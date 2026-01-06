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
const svc = T.AwsApiService({ sdkId: "SQS", serviceShapeName: "AmazonSQS" });
const auth = T.AwsAuthSigv4({ name: "sqs" });
const ver = T.ServiceVersion("2012-11-05");
const proto = T.AwsProtocolsAwsJson1_0();
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
                        url: "https://sqs-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      ],
                      endpoint: {
                        url: "https://sqs.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://sqs-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://sqs.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://sqs.{Region}.{PartitionResult#dnsSuffix}",
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
export type NullableInteger = number;
export type Token = string;
export type BoxedInteger = number;
export type MessageAttributeName = string;
export type TagKey = string;
export type TagValue = string;
export type ExceptionMessage = string;
export type Long = number;
export type NullableLong = number;

//# Schemas
export type AWSAccountIdList = string[];
export const AWSAccountIdList = S.Array(S.String);
export type ActionNameList = string[];
export const ActionNameList = S.Array(S.String);
export type AttributeNameList = string[];
export const AttributeNameList = S.Array(S.String);
export type MessageSystemAttributeList = string[];
export const MessageSystemAttributeList = S.Array(S.String);
export type MessageAttributeNameList = string[];
export const MessageAttributeNameList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AddPermissionRequest {
  QueueUrl: string;
  Label: string;
  AWSAccountIds: AWSAccountIdList;
  Actions: ActionNameList;
}
export const AddPermissionRequest = S.suspend(() =>
  S.Struct({
    QueueUrl: S.String,
    Label: S.String,
    AWSAccountIds: AWSAccountIdList.pipe(
      T.XmlName("AWSAccountId"),
      T.XmlFlattened(),
    ),
    Actions: ActionNameList.pipe(T.XmlName("ActionName"), T.XmlFlattened()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AddPermissionRequest",
}) as any as S.Schema<AddPermissionRequest>;
export interface AddPermissionResponse {}
export const AddPermissionResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "AddPermissionResponse",
}) as any as S.Schema<AddPermissionResponse>;
export interface CancelMessageMoveTaskRequest {
  TaskHandle: string;
}
export const CancelMessageMoveTaskRequest = S.suspend(() =>
  S.Struct({ TaskHandle: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelMessageMoveTaskRequest",
}) as any as S.Schema<CancelMessageMoveTaskRequest>;
export interface ChangeMessageVisibilityRequest {
  QueueUrl: string;
  ReceiptHandle: string;
  VisibilityTimeout: number;
}
export const ChangeMessageVisibilityRequest = S.suspend(() =>
  S.Struct({
    QueueUrl: S.String,
    ReceiptHandle: S.String,
    VisibilityTimeout: S.Number,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ChangeMessageVisibilityRequest",
}) as any as S.Schema<ChangeMessageVisibilityRequest>;
export interface ChangeMessageVisibilityResponse {}
export const ChangeMessageVisibilityResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ChangeMessageVisibilityResponse",
}) as any as S.Schema<ChangeMessageVisibilityResponse>;
export interface DeleteMessageRequest {
  QueueUrl: string;
  ReceiptHandle: string;
}
export const DeleteMessageRequest = S.suspend(() =>
  S.Struct({ QueueUrl: S.String, ReceiptHandle: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteMessageRequest",
}) as any as S.Schema<DeleteMessageRequest>;
export interface DeleteMessageResponse {}
export const DeleteMessageResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteMessageResponse",
}) as any as S.Schema<DeleteMessageResponse>;
export interface DeleteQueueRequest {
  QueueUrl: string;
}
export const DeleteQueueRequest = S.suspend(() =>
  S.Struct({ QueueUrl: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteQueueRequest",
}) as any as S.Schema<DeleteQueueRequest>;
export interface DeleteQueueResponse {}
export const DeleteQueueResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteQueueResponse",
}) as any as S.Schema<DeleteQueueResponse>;
export interface GetQueueAttributesRequest {
  QueueUrl: string;
  AttributeNames?: AttributeNameList;
}
export const GetQueueAttributesRequest = S.suspend(() =>
  S.Struct({
    QueueUrl: S.String,
    AttributeNames: S.optional(AttributeNameList).pipe(
      T.XmlName("AttributeName"),
      T.XmlFlattened(),
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetQueueAttributesRequest",
}) as any as S.Schema<GetQueueAttributesRequest>;
export interface GetQueueUrlRequest {
  QueueName: string;
  QueueOwnerAWSAccountId?: string;
}
export const GetQueueUrlRequest = S.suspend(() =>
  S.Struct({
    QueueName: S.String,
    QueueOwnerAWSAccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetQueueUrlRequest",
}) as any as S.Schema<GetQueueUrlRequest>;
export interface ListDeadLetterSourceQueuesRequest {
  QueueUrl: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListDeadLetterSourceQueuesRequest = S.suspend(() =>
  S.Struct({
    QueueUrl: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDeadLetterSourceQueuesRequest",
}) as any as S.Schema<ListDeadLetterSourceQueuesRequest>;
export interface ListMessageMoveTasksRequest {
  SourceArn: string;
  MaxResults?: number;
}
export const ListMessageMoveTasksRequest = S.suspend(() =>
  S.Struct({ SourceArn: S.String, MaxResults: S.optional(S.Number) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListMessageMoveTasksRequest",
}) as any as S.Schema<ListMessageMoveTasksRequest>;
export interface ListQueuesRequest {
  QueueNamePrefix?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListQueuesRequest = S.suspend(() =>
  S.Struct({
    QueueNamePrefix: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListQueuesRequest",
}) as any as S.Schema<ListQueuesRequest>;
export interface ListQueueTagsRequest {
  QueueUrl: string;
}
export const ListQueueTagsRequest = S.suspend(() =>
  S.Struct({ QueueUrl: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListQueueTagsRequest",
}) as any as S.Schema<ListQueueTagsRequest>;
export interface PurgeQueueRequest {
  QueueUrl: string;
}
export const PurgeQueueRequest = S.suspend(() =>
  S.Struct({ QueueUrl: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PurgeQueueRequest",
}) as any as S.Schema<PurgeQueueRequest>;
export interface PurgeQueueResponse {}
export const PurgeQueueResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "PurgeQueueResponse",
}) as any as S.Schema<PurgeQueueResponse>;
export interface ReceiveMessageRequest {
  QueueUrl: string;
  AttributeNames?: AttributeNameList;
  MessageSystemAttributeNames?: MessageSystemAttributeList;
  MessageAttributeNames?: MessageAttributeNameList;
  MaxNumberOfMessages?: number;
  VisibilityTimeout?: number;
  WaitTimeSeconds?: number;
  ReceiveRequestAttemptId?: string;
}
export const ReceiveMessageRequest = S.suspend(() =>
  S.Struct({
    QueueUrl: S.String,
    AttributeNames: S.optional(AttributeNameList).pipe(
      T.XmlName("AttributeName"),
      T.XmlFlattened(),
    ),
    MessageSystemAttributeNames: S.optional(MessageSystemAttributeList).pipe(
      T.XmlName("AttributeName"),
      T.XmlFlattened(),
    ),
    MessageAttributeNames: S.optional(MessageAttributeNameList).pipe(
      T.XmlName("MessageAttributeName"),
      T.XmlFlattened(),
    ),
    MaxNumberOfMessages: S.optional(S.Number),
    VisibilityTimeout: S.optional(S.Number),
    WaitTimeSeconds: S.optional(S.Number),
    ReceiveRequestAttemptId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ReceiveMessageRequest",
}) as any as S.Schema<ReceiveMessageRequest>;
export interface RemovePermissionRequest {
  QueueUrl: string;
  Label: string;
}
export const RemovePermissionRequest = S.suspend(() =>
  S.Struct({ QueueUrl: S.String, Label: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RemovePermissionRequest",
}) as any as S.Schema<RemovePermissionRequest>;
export interface RemovePermissionResponse {}
export const RemovePermissionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RemovePermissionResponse",
}) as any as S.Schema<RemovePermissionResponse>;
export type QueueAttributeMap = { [key: string]: string };
export const QueueAttributeMap = S.Record({
  key: S.String.pipe(T.XmlName("Name")),
  value: S.String.pipe(T.XmlName("Value")),
});
export interface SetQueueAttributesRequest {
  QueueUrl: string;
  Attributes: QueueAttributeMap;
}
export const SetQueueAttributesRequest = S.suspend(() =>
  S.Struct({
    QueueUrl: S.String,
    Attributes: QueueAttributeMap.pipe(
      T.XmlName("Attribute"),
      T.XmlFlattened(),
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SetQueueAttributesRequest",
}) as any as S.Schema<SetQueueAttributesRequest>;
export interface SetQueueAttributesResponse {}
export const SetQueueAttributesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SetQueueAttributesResponse",
}) as any as S.Schema<SetQueueAttributesResponse>;
export interface StartMessageMoveTaskRequest {
  SourceArn: string;
  DestinationArn?: string;
  MaxNumberOfMessagesPerSecond?: number;
}
export const StartMessageMoveTaskRequest = S.suspend(() =>
  S.Struct({
    SourceArn: S.String,
    DestinationArn: S.optional(S.String),
    MaxNumberOfMessagesPerSecond: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartMessageMoveTaskRequest",
}) as any as S.Schema<StartMessageMoveTaskRequest>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({
  key: S.String.pipe(T.XmlName("Key")),
  value: S.String.pipe(T.XmlName("Value")),
});
export interface TagQueueRequest {
  QueueUrl: string;
  Tags: TagMap;
}
export const TagQueueRequest = S.suspend(() =>
  S.Struct({
    QueueUrl: S.String,
    Tags: TagMap.pipe(T.XmlName("Tag"), T.XmlFlattened()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagQueueRequest",
}) as any as S.Schema<TagQueueRequest>;
export interface TagQueueResponse {}
export const TagQueueResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagQueueResponse",
}) as any as S.Schema<TagQueueResponse>;
export interface UntagQueueRequest {
  QueueUrl: string;
  TagKeys: TagKeyList;
}
export const UntagQueueRequest = S.suspend(() =>
  S.Struct({
    QueueUrl: S.String,
    TagKeys: TagKeyList.pipe(T.XmlName("TagKey"), T.XmlFlattened()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagQueueRequest",
}) as any as S.Schema<UntagQueueRequest>;
export interface UntagQueueResponse {}
export const UntagQueueResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagQueueResponse",
}) as any as S.Schema<UntagQueueResponse>;
export interface ChangeMessageVisibilityBatchRequestEntry {
  Id: string;
  ReceiptHandle: string;
  VisibilityTimeout?: number;
}
export const ChangeMessageVisibilityBatchRequestEntry = S.suspend(() =>
  S.Struct({
    Id: S.String,
    ReceiptHandle: S.String,
    VisibilityTimeout: S.optional(S.Number),
  }),
).annotations({
  identifier: "ChangeMessageVisibilityBatchRequestEntry",
}) as any as S.Schema<ChangeMessageVisibilityBatchRequestEntry>;
export type ChangeMessageVisibilityBatchRequestEntryList =
  ChangeMessageVisibilityBatchRequestEntry[];
export const ChangeMessageVisibilityBatchRequestEntryList = S.Array(
  ChangeMessageVisibilityBatchRequestEntry,
);
export interface DeleteMessageBatchRequestEntry {
  Id: string;
  ReceiptHandle: string;
}
export const DeleteMessageBatchRequestEntry = S.suspend(() =>
  S.Struct({ Id: S.String, ReceiptHandle: S.String }),
).annotations({
  identifier: "DeleteMessageBatchRequestEntry",
}) as any as S.Schema<DeleteMessageBatchRequestEntry>;
export type DeleteMessageBatchRequestEntryList =
  DeleteMessageBatchRequestEntry[];
export const DeleteMessageBatchRequestEntryList = S.Array(
  DeleteMessageBatchRequestEntry,
);
export type QueueUrlList = string[];
export const QueueUrlList = S.Array(S.String);
export type StringList = string[];
export const StringList = S.Array(S.String.pipe(T.XmlName("StringListValue")));
export type BinaryList = Uint8Array[];
export const BinaryList = S.Array(T.Blob.pipe(T.XmlName("BinaryListValue")));
export interface MessageAttributeValue {
  StringValue?: string;
  BinaryValue?: Uint8Array;
  StringListValues?: StringList;
  BinaryListValues?: BinaryList;
  DataType: string;
}
export const MessageAttributeValue = S.suspend(() =>
  S.Struct({
    StringValue: S.optional(S.String),
    BinaryValue: S.optional(T.Blob),
    StringListValues: S.optional(StringList).pipe(
      T.XmlName("StringListValue"),
      T.XmlFlattened(),
    ),
    BinaryListValues: S.optional(BinaryList).pipe(
      T.XmlName("BinaryListValue"),
      T.XmlFlattened(),
    ),
    DataType: S.String,
  }),
).annotations({
  identifier: "MessageAttributeValue",
}) as any as S.Schema<MessageAttributeValue>;
export type MessageBodyAttributeMap = { [key: string]: MessageAttributeValue };
export const MessageBodyAttributeMap = S.Record({
  key: S.String.pipe(T.XmlName("Name")),
  value: MessageAttributeValue.pipe(T.XmlName("Value")).annotations({
    identifier: "MessageAttributeValue",
  }),
});
export interface MessageSystemAttributeValue {
  StringValue?: string;
  BinaryValue?: Uint8Array;
  StringListValues?: StringList;
  BinaryListValues?: BinaryList;
  DataType: string;
}
export const MessageSystemAttributeValue = S.suspend(() =>
  S.Struct({
    StringValue: S.optional(S.String),
    BinaryValue: S.optional(T.Blob),
    StringListValues: S.optional(StringList).pipe(
      T.XmlName("StringListValue"),
      T.XmlFlattened(),
    ),
    BinaryListValues: S.optional(BinaryList).pipe(
      T.XmlName("BinaryListValue"),
      T.XmlFlattened(),
    ),
    DataType: S.String,
  }),
).annotations({
  identifier: "MessageSystemAttributeValue",
}) as any as S.Schema<MessageSystemAttributeValue>;
export type MessageBodySystemAttributeMap = {
  [key: string]: MessageSystemAttributeValue;
};
export const MessageBodySystemAttributeMap = S.Record({
  key: S.String.pipe(T.XmlName("Name")),
  value: MessageSystemAttributeValue.pipe(T.XmlName("Value")).annotations({
    identifier: "MessageSystemAttributeValue",
  }),
});
export interface SendMessageBatchRequestEntry {
  Id: string;
  MessageBody: string;
  DelaySeconds?: number;
  MessageAttributes?: MessageBodyAttributeMap;
  MessageSystemAttributes?: MessageBodySystemAttributeMap;
  MessageDeduplicationId?: string;
  MessageGroupId?: string;
}
export const SendMessageBatchRequestEntry = S.suspend(() =>
  S.Struct({
    Id: S.String,
    MessageBody: S.String,
    DelaySeconds: S.optional(S.Number),
    MessageAttributes: S.optional(MessageBodyAttributeMap).pipe(
      T.XmlName("MessageAttribute"),
      T.XmlFlattened(),
    ),
    MessageSystemAttributes: S.optional(MessageBodySystemAttributeMap).pipe(
      T.XmlName("MessageSystemAttribute"),
      T.XmlFlattened(),
    ),
    MessageDeduplicationId: S.optional(S.String),
    MessageGroupId: S.optional(S.String),
  }),
).annotations({
  identifier: "SendMessageBatchRequestEntry",
}) as any as S.Schema<SendMessageBatchRequestEntry>;
export type SendMessageBatchRequestEntryList = SendMessageBatchRequestEntry[];
export const SendMessageBatchRequestEntryList = S.Array(
  SendMessageBatchRequestEntry,
);
export interface CancelMessageMoveTaskResult {
  ApproximateNumberOfMessagesMoved?: number;
}
export const CancelMessageMoveTaskResult = S.suspend(() =>
  S.Struct({ ApproximateNumberOfMessagesMoved: S.optional(S.Number) }),
).annotations({
  identifier: "CancelMessageMoveTaskResult",
}) as any as S.Schema<CancelMessageMoveTaskResult>;
export interface ChangeMessageVisibilityBatchRequest {
  QueueUrl: string;
  Entries: ChangeMessageVisibilityBatchRequestEntryList;
}
export const ChangeMessageVisibilityBatchRequest = S.suspend(() =>
  S.Struct({
    QueueUrl: S.String,
    Entries: ChangeMessageVisibilityBatchRequestEntryList.pipe(
      T.XmlName("ChangeMessageVisibilityBatchRequestEntry"),
      T.XmlFlattened(),
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ChangeMessageVisibilityBatchRequest",
}) as any as S.Schema<ChangeMessageVisibilityBatchRequest>;
export interface CreateQueueRequest {
  QueueName: string;
  Attributes?: QueueAttributeMap;
  tags?: TagMap;
}
export const CreateQueueRequest = S.suspend(() =>
  S.Struct({
    QueueName: S.String,
    Attributes: S.optional(QueueAttributeMap).pipe(
      T.XmlName("Attribute"),
      T.XmlFlattened(),
    ),
    tags: S.optional(TagMap).pipe(T.XmlName("Tag"), T.XmlFlattened()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateQueueRequest",
}) as any as S.Schema<CreateQueueRequest>;
export interface DeleteMessageBatchRequest {
  QueueUrl: string;
  Entries: DeleteMessageBatchRequestEntryList;
}
export const DeleteMessageBatchRequest = S.suspend(() =>
  S.Struct({
    QueueUrl: S.String,
    Entries: DeleteMessageBatchRequestEntryList.pipe(
      T.XmlName("DeleteMessageBatchRequestEntry"),
      T.XmlFlattened(),
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteMessageBatchRequest",
}) as any as S.Schema<DeleteMessageBatchRequest>;
export interface GetQueueAttributesResult {
  Attributes?: QueueAttributeMap;
}
export const GetQueueAttributesResult = S.suspend(() =>
  S.Struct({
    Attributes: S.optional(QueueAttributeMap).pipe(
      T.XmlName("Attribute"),
      T.XmlFlattened(),
    ),
  }),
).annotations({
  identifier: "GetQueueAttributesResult",
}) as any as S.Schema<GetQueueAttributesResult>;
export interface GetQueueUrlResult {
  QueueUrl?: string;
}
export const GetQueueUrlResult = S.suspend(() =>
  S.Struct({ QueueUrl: S.optional(S.String) }),
).annotations({
  identifier: "GetQueueUrlResult",
}) as any as S.Schema<GetQueueUrlResult>;
export interface ListDeadLetterSourceQueuesResult {
  queueUrls: QueueUrlList;
  NextToken?: string;
}
export const ListDeadLetterSourceQueuesResult = S.suspend(() =>
  S.Struct({
    queueUrls: QueueUrlList.pipe(T.XmlName("QueueUrl"), T.XmlFlattened()),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDeadLetterSourceQueuesResult",
}) as any as S.Schema<ListDeadLetterSourceQueuesResult>;
export interface ListQueuesResult {
  QueueUrls?: QueueUrlList;
  NextToken?: string;
}
export const ListQueuesResult = S.suspend(() =>
  S.Struct({
    QueueUrls: S.optional(QueueUrlList).pipe(
      T.XmlName("QueueUrl"),
      T.XmlFlattened(),
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListQueuesResult",
}) as any as S.Schema<ListQueuesResult>;
export interface ListQueueTagsResult {
  Tags?: TagMap;
}
export const ListQueueTagsResult = S.suspend(() =>
  S.Struct({
    Tags: S.optional(TagMap).pipe(T.XmlName("Tag"), T.XmlFlattened()),
  }),
).annotations({
  identifier: "ListQueueTagsResult",
}) as any as S.Schema<ListQueueTagsResult>;
export interface SendMessageBatchRequest {
  QueueUrl: string;
  Entries: SendMessageBatchRequestEntryList;
}
export const SendMessageBatchRequest = S.suspend(() =>
  S.Struct({
    QueueUrl: S.String,
    Entries: SendMessageBatchRequestEntryList.pipe(
      T.XmlName("SendMessageBatchRequestEntry"),
      T.XmlFlattened(),
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SendMessageBatchRequest",
}) as any as S.Schema<SendMessageBatchRequest>;
export interface StartMessageMoveTaskResult {
  TaskHandle?: string;
}
export const StartMessageMoveTaskResult = S.suspend(() =>
  S.Struct({ TaskHandle: S.optional(S.String) }),
).annotations({
  identifier: "StartMessageMoveTaskResult",
}) as any as S.Schema<StartMessageMoveTaskResult>;
export interface ListMessageMoveTasksResultEntry {
  TaskHandle?: string;
  Status?: string;
  SourceArn?: string;
  DestinationArn?: string;
  MaxNumberOfMessagesPerSecond?: number;
  ApproximateNumberOfMessagesMoved?: number;
  ApproximateNumberOfMessagesToMove?: number;
  FailureReason?: string;
  StartedTimestamp?: number;
}
export const ListMessageMoveTasksResultEntry = S.suspend(() =>
  S.Struct({
    TaskHandle: S.optional(S.String),
    Status: S.optional(S.String),
    SourceArn: S.optional(S.String),
    DestinationArn: S.optional(S.String),
    MaxNumberOfMessagesPerSecond: S.optional(S.Number),
    ApproximateNumberOfMessagesMoved: S.optional(S.Number),
    ApproximateNumberOfMessagesToMove: S.optional(S.Number),
    FailureReason: S.optional(S.String),
    StartedTimestamp: S.optional(S.Number),
  }),
).annotations({
  identifier: "ListMessageMoveTasksResultEntry",
}) as any as S.Schema<ListMessageMoveTasksResultEntry>;
export type ListMessageMoveTasksResultEntryList =
  ListMessageMoveTasksResultEntry[];
export const ListMessageMoveTasksResultEntryList = S.Array(
  ListMessageMoveTasksResultEntry,
);
export interface CreateQueueResult {
  QueueUrl?: string;
}
export const CreateQueueResult = S.suspend(() =>
  S.Struct({ QueueUrl: S.optional(S.String) }),
).annotations({
  identifier: "CreateQueueResult",
}) as any as S.Schema<CreateQueueResult>;
export interface ListMessageMoveTasksResult {
  Results?: ListMessageMoveTasksResultEntryList;
}
export const ListMessageMoveTasksResult = S.suspend(() =>
  S.Struct({
    Results: S.optional(ListMessageMoveTasksResultEntryList).pipe(
      T.XmlName("ListMessageMoveTasksResultEntry"),
      T.XmlFlattened(),
    ),
  }).pipe(T.XmlName("ListMessageMoveTasksResult")),
).annotations({
  identifier: "ListMessageMoveTasksResult",
}) as any as S.Schema<ListMessageMoveTasksResult>;
export interface SendMessageRequest {
  QueueUrl: string;
  MessageBody: string;
  DelaySeconds?: number;
  MessageAttributes?: MessageBodyAttributeMap;
  MessageSystemAttributes?: MessageBodySystemAttributeMap;
  MessageDeduplicationId?: string;
  MessageGroupId?: string;
}
export const SendMessageRequest = S.suspend(() =>
  S.Struct({
    QueueUrl: S.String,
    MessageBody: S.String,
    DelaySeconds: S.optional(S.Number),
    MessageAttributes: S.optional(MessageBodyAttributeMap).pipe(
      T.XmlName("MessageAttribute"),
      T.XmlFlattened(),
    ),
    MessageSystemAttributes: S.optional(MessageBodySystemAttributeMap).pipe(
      T.XmlName("MessageSystemAttribute"),
      T.XmlFlattened(),
    ),
    MessageDeduplicationId: S.optional(S.String),
    MessageGroupId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SendMessageRequest",
}) as any as S.Schema<SendMessageRequest>;
export type MessageSystemAttributeMap = { [key: string]: string };
export const MessageSystemAttributeMap = S.Record({
  key: S.String.pipe(T.XmlName("Name")),
  value: S.String.pipe(T.XmlName("Value")),
});
export interface ChangeMessageVisibilityBatchResultEntry {
  Id: string;
}
export const ChangeMessageVisibilityBatchResultEntry = S.suspend(() =>
  S.Struct({ Id: S.String }),
).annotations({
  identifier: "ChangeMessageVisibilityBatchResultEntry",
}) as any as S.Schema<ChangeMessageVisibilityBatchResultEntry>;
export type ChangeMessageVisibilityBatchResultEntryList =
  ChangeMessageVisibilityBatchResultEntry[];
export const ChangeMessageVisibilityBatchResultEntryList = S.Array(
  ChangeMessageVisibilityBatchResultEntry,
);
export interface BatchResultErrorEntry {
  Id: string;
  SenderFault: boolean;
  Code: string;
  Message?: string;
}
export const BatchResultErrorEntry = S.suspend(() =>
  S.Struct({
    Id: S.String,
    SenderFault: S.Boolean,
    Code: S.String,
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchResultErrorEntry",
}) as any as S.Schema<BatchResultErrorEntry>;
export type BatchResultErrorEntryList = BatchResultErrorEntry[];
export const BatchResultErrorEntryList = S.Array(BatchResultErrorEntry);
export interface DeleteMessageBatchResultEntry {
  Id: string;
}
export const DeleteMessageBatchResultEntry = S.suspend(() =>
  S.Struct({ Id: S.String }),
).annotations({
  identifier: "DeleteMessageBatchResultEntry",
}) as any as S.Schema<DeleteMessageBatchResultEntry>;
export type DeleteMessageBatchResultEntryList = DeleteMessageBatchResultEntry[];
export const DeleteMessageBatchResultEntryList = S.Array(
  DeleteMessageBatchResultEntry,
);
export interface Message {
  MessageId?: string;
  ReceiptHandle?: string;
  MD5OfBody?: string;
  Body?: string;
  Attributes?: MessageSystemAttributeMap;
  MD5OfMessageAttributes?: string;
  MessageAttributes?: MessageBodyAttributeMap;
}
export const Message = S.suspend(() =>
  S.Struct({
    MessageId: S.optional(S.String),
    ReceiptHandle: S.optional(S.String),
    MD5OfBody: S.optional(S.String),
    Body: S.optional(S.String),
    Attributes: S.optional(MessageSystemAttributeMap).pipe(
      T.XmlName("Attribute"),
      T.XmlFlattened(),
    ),
    MD5OfMessageAttributes: S.optional(S.String),
    MessageAttributes: S.optional(MessageBodyAttributeMap).pipe(
      T.XmlName("MessageAttribute"),
      T.XmlFlattened(),
    ),
  }),
).annotations({ identifier: "Message" }) as any as S.Schema<Message>;
export type MessageList = Message[];
export const MessageList = S.Array(Message);
export interface SendMessageBatchResultEntry {
  Id: string;
  MessageId: string;
  MD5OfMessageBody: string;
  MD5OfMessageAttributes?: string;
  MD5OfMessageSystemAttributes?: string;
  SequenceNumber?: string;
}
export const SendMessageBatchResultEntry = S.suspend(() =>
  S.Struct({
    Id: S.String,
    MessageId: S.String,
    MD5OfMessageBody: S.String,
    MD5OfMessageAttributes: S.optional(S.String),
    MD5OfMessageSystemAttributes: S.optional(S.String),
    SequenceNumber: S.optional(S.String),
  }),
).annotations({
  identifier: "SendMessageBatchResultEntry",
}) as any as S.Schema<SendMessageBatchResultEntry>;
export type SendMessageBatchResultEntryList = SendMessageBatchResultEntry[];
export const SendMessageBatchResultEntryList = S.Array(
  SendMessageBatchResultEntry,
);
export interface ChangeMessageVisibilityBatchResult {
  Successful: ChangeMessageVisibilityBatchResultEntryList;
  Failed: BatchResultErrorEntryList;
}
export const ChangeMessageVisibilityBatchResult = S.suspend(() =>
  S.Struct({
    Successful: ChangeMessageVisibilityBatchResultEntryList.pipe(
      T.XmlName("ChangeMessageVisibilityBatchResultEntry"),
      T.XmlFlattened(),
    ),
    Failed: BatchResultErrorEntryList.pipe(
      T.XmlName("BatchResultErrorEntry"),
      T.XmlFlattened(),
    ),
  }),
).annotations({
  identifier: "ChangeMessageVisibilityBatchResult",
}) as any as S.Schema<ChangeMessageVisibilityBatchResult>;
export interface DeleteMessageBatchResult {
  Successful: DeleteMessageBatchResultEntryList;
  Failed: BatchResultErrorEntryList;
}
export const DeleteMessageBatchResult = S.suspend(() =>
  S.Struct({
    Successful: DeleteMessageBatchResultEntryList.pipe(
      T.XmlName("DeleteMessageBatchResultEntry"),
      T.XmlFlattened(),
    ),
    Failed: BatchResultErrorEntryList.pipe(
      T.XmlName("BatchResultErrorEntry"),
      T.XmlFlattened(),
    ),
  }),
).annotations({
  identifier: "DeleteMessageBatchResult",
}) as any as S.Schema<DeleteMessageBatchResult>;
export interface ReceiveMessageResult {
  Messages?: MessageList;
}
export const ReceiveMessageResult = S.suspend(() =>
  S.Struct({
    Messages: S.optional(MessageList).pipe(
      T.XmlName("Message"),
      T.XmlFlattened(),
    ),
  }),
).annotations({
  identifier: "ReceiveMessageResult",
}) as any as S.Schema<ReceiveMessageResult>;
export interface SendMessageResult {
  MD5OfMessageBody?: string;
  MD5OfMessageAttributes?: string;
  MD5OfMessageSystemAttributes?: string;
  MessageId?: string;
  SequenceNumber?: string;
}
export const SendMessageResult = S.suspend(() =>
  S.Struct({
    MD5OfMessageBody: S.optional(S.String),
    MD5OfMessageAttributes: S.optional(S.String),
    MD5OfMessageSystemAttributes: S.optional(S.String),
    MessageId: S.optional(S.String),
    SequenceNumber: S.optional(S.String),
  }),
).annotations({
  identifier: "SendMessageResult",
}) as any as S.Schema<SendMessageResult>;
export interface SendMessageBatchResult {
  Successful: SendMessageBatchResultEntryList;
  Failed: BatchResultErrorEntryList;
}
export const SendMessageBatchResult = S.suspend(() =>
  S.Struct({
    Successful: SendMessageBatchResultEntryList.pipe(
      T.XmlName("SendMessageBatchResultEntry"),
      T.XmlFlattened(),
    ),
    Failed: BatchResultErrorEntryList.pipe(
      T.XmlName("BatchResultErrorEntry"),
      T.XmlFlattened(),
    ),
  }),
).annotations({
  identifier: "SendMessageBatchResult",
}) as any as S.Schema<SendMessageBatchResult>;

//# Errors
export class InvalidAddress extends S.TaggedError<InvalidAddress>()(
  "InvalidAddress",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidAddress", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidIdFormat extends S.TaggedError<InvalidIdFormat>()(
  "InvalidIdFormat",
  {},
) {}
export class InvalidSecurity extends S.TaggedError<InvalidSecurity>()(
  "InvalidSecurity",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSecurity", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class InvalidAttributeName extends S.TaggedError<InvalidAttributeName>()(
  "InvalidAttributeName",
  { message: S.optional(S.String) },
) {}
export class MessageNotInflight extends S.TaggedError<MessageNotInflight>()(
  "MessageNotInflight",
  {},
  T.AwsQueryError({
    code: "AWS.SimpleQueueService.MessageNotInflight",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class OverLimit extends S.TaggedError<OverLimit>()(
  "OverLimit",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "OverLimit", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class QueueDoesNotExist extends S.TaggedError<QueueDoesNotExist>()(
  "QueueDoesNotExist",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AWS.SimpleQueueService.NonExistentQueue",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class RequestThrottled extends S.TaggedError<RequestThrottled>()(
  "RequestThrottled",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "RequestThrottled", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class PurgeQueueInProgress extends S.TaggedError<PurgeQueueInProgress>()(
  "PurgeQueueInProgress",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AWS.SimpleQueueService.PurgeQueueInProgress",
    httpResponseCode: 403,
  }),
).pipe(C.withAuthError) {}
export class InvalidAttributeValue extends S.TaggedError<InvalidAttributeValue>()(
  "InvalidAttributeValue",
  { message: S.optional(S.String) },
) {}
export class BatchEntryIdsNotDistinct extends S.TaggedError<BatchEntryIdsNotDistinct>()(
  "BatchEntryIdsNotDistinct",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AWS.SimpleQueueService.BatchEntryIdsNotDistinct",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFoundException", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class KmsAccessDenied extends S.TaggedError<KmsAccessDenied>()(
  "KmsAccessDenied",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMS.AccessDeniedException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidMessageContents extends S.TaggedError<InvalidMessageContents>()(
  "InvalidMessageContents",
  { message: S.optional(S.String) },
) {}
export class UnsupportedOperation extends S.TaggedError<UnsupportedOperation>()(
  "UnsupportedOperation",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AWS.SimpleQueueService.UnsupportedOperation",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ReceiptHandleIsInvalid extends S.TaggedError<ReceiptHandleIsInvalid>()(
  "ReceiptHandleIsInvalid",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ReceiptHandleIsInvalid", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  {},
) {}
export class CommonServiceException extends S.TaggedError<CommonServiceException>()(
  "CommonServiceException",
  {},
) {}
export class QueueDeletedRecently extends S.TaggedError<QueueDeletedRecently>()(
  "QueueDeletedRecently",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AWS.SimpleQueueService.QueueDeletedRecently",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class EmptyBatchRequest extends S.TaggedError<EmptyBatchRequest>()(
  "EmptyBatchRequest",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AWS.SimpleQueueService.EmptyBatchRequest",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class KmsDisabled extends S.TaggedError<KmsDisabled>()(
  "KmsDisabled",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMS.DisabledException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class BatchRequestTooLong extends S.TaggedError<BatchRequestTooLong>()(
  "BatchRequestTooLong",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AWS.SimpleQueueService.BatchRequestTooLong",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class QueueNameExists extends S.TaggedError<QueueNameExists>()(
  "QueueNameExists",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "QueueAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidBatchEntryId extends S.TaggedError<InvalidBatchEntryId>()(
  "InvalidBatchEntryId",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AWS.SimpleQueueService.InvalidBatchEntryId",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class KmsInvalidKeyUsage extends S.TaggedError<KmsInvalidKeyUsage>()(
  "KmsInvalidKeyUsage",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "KMS.InvalidKeyUsageException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class TooManyEntriesInBatchRequest extends S.TaggedError<TooManyEntriesInBatchRequest>()(
  "TooManyEntriesInBatchRequest",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AWS.SimpleQueueService.TooManyEntriesInBatchRequest",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class KmsInvalidState extends S.TaggedError<KmsInvalidState>()(
  "KmsInvalidState",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMS.InvalidStateException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class KmsNotFound extends S.TaggedError<KmsNotFound>()(
  "KmsNotFound",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMS.NotFoundException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class KmsOptInRequired extends S.TaggedError<KmsOptInRequired>()(
  "KmsOptInRequired",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMS.OptInRequired", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class KmsThrottled extends S.TaggedError<KmsThrottled>()(
  "KmsThrottled",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMS.ThrottlingException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ParseError extends S.TaggedError<ParseError>()("ParseError", {}) {}
export class MissingRequiredParameterException extends S.TaggedError<MissingRequiredParameterException>()(
  "MissingRequiredParameterException",
  {},
) {}

//# Operations
/**
 * Deletes available messages in a queue (including in-flight messages) specified by the
 * `QueueURL` parameter.
 *
 * When you use the `PurgeQueue` action, you can't retrieve any messages
 * deleted from a queue.
 *
 * The message deletion process takes up to 60 seconds. We recommend waiting for 60
 * seconds regardless of your queue's size.
 *
 * Messages sent to the queue *before* you call
 * `PurgeQueue` might be received but are deleted within the next
 * minute.
 *
 * Messages sent to the queue *after* you call `PurgeQueue`
 * might be deleted while the queue is being purged.
 */
export const purgeQueue: (
  input: PurgeQueueRequest,
) => Effect.Effect<
  PurgeQueueResponse,
  | InvalidAddress
  | InvalidSecurity
  | PurgeQueueInProgress
  | QueueDoesNotExist
  | RequestThrottled
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PurgeQueueRequest,
  output: PurgeQueueResponse,
  errors: [
    InvalidAddress,
    InvalidSecurity,
    PurgeQueueInProgress,
    QueueDoesNotExist,
    RequestThrottled,
    UnsupportedOperation,
  ],
}));
/**
 * Changes the visibility timeout of a specified message in a queue to a new value. The
 * default visibility timeout for a message is 30 seconds. The minimum is 0 seconds. The
 * maximum is 12 hours. For more information, see Visibility Timeout in the Amazon SQS Developer
 * Guide.
 *
 * For example, if the default timeout for a queue is 60 seconds, 15 seconds have elapsed
 * since you received the message, and you send a ChangeMessageVisibility call with
 * `VisibilityTimeout` set to 10 seconds, the 10 seconds begin to count from
 * the time that you make the `ChangeMessageVisibility` call. Thus, any attempt
 * to change the visibility timeout or to delete that message 10 seconds after you
 * initially change the visibility timeout (a total of 25 seconds) might result in an
 * error.
 *
 * An Amazon SQS message has three basic states:
 *
 * - Sent to a queue by a producer.
 *
 * - Received from the queue by a consumer.
 *
 * - Deleted from the queue.
 *
 * A message is considered to be *stored* after it is sent to a queue by a producer, but not yet received from the queue by a consumer (that is, between states 1 and 2). There is no limit to the number of stored messages.
 * A message is considered to be *in flight* after it is received from a queue by a consumer, but not yet deleted from the queue (that is, between states 2 and 3). There is a limit to the number of in flight messages.
 *
 * Limits that apply to in flight messages are unrelated to the *unlimited* number of stored messages.
 *
 * For most standard queues (depending on queue traffic and message backlog), there can be a maximum of approximately 120,000 in flight messages (received from a queue by a consumer, but not yet deleted from the queue).
 * If you reach this limit, Amazon SQS returns the `OverLimit` error message.
 * To avoid reaching the limit, you should delete messages from the queue after they're processed. You can also increase the number of queues you use to process your messages.
 * To request a limit increase, file a support request.
 *
 * For FIFO queues, there can be a maximum of 120,000 in flight messages (received from a queue by a consumer, but not yet deleted from the queue). If you reach this limit, Amazon SQS returns no error messages.
 *
 * If you attempt to set the `VisibilityTimeout` to a value greater than
 * the maximum time left, Amazon SQS returns an error. Amazon SQS doesn't automatically
 * recalculate and increase the timeout to the maximum remaining time.
 *
 * Unlike with a queue, when you change the visibility timeout for a specific message
 * the timeout value is applied immediately but isn't saved in memory for that message.
 * If you don't delete a message after it is received, the visibility timeout for the
 * message reverts to the original timeout value (not to the value you set using the
 * `ChangeMessageVisibility` action) the next time the message is
 * received.
 */
export const changeMessageVisibility: (
  input: ChangeMessageVisibilityRequest,
) => Effect.Effect<
  ChangeMessageVisibilityResponse,
  | InvalidAddress
  | InvalidSecurity
  | MessageNotInflight
  | QueueDoesNotExist
  | ReceiptHandleIsInvalid
  | RequestThrottled
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ChangeMessageVisibilityRequest,
  output: ChangeMessageVisibilityResponse,
  errors: [
    InvalidAddress,
    InvalidSecurity,
    MessageNotInflight,
    QueueDoesNotExist,
    ReceiptHandleIsInvalid,
    RequestThrottled,
    UnsupportedOperation,
  ],
}));
/**
 * Cancels a specified message movement task. A message movement can only be cancelled
 * when the current status is RUNNING. Cancelling a message movement task does not revert
 * the messages that have already been moved. It can only stop the messages that have not
 * been moved yet.
 *
 * - This action is currently limited to supporting message redrive from dead-letter queues (DLQs) only. In this context, the source
 * queue is the dead-letter queue (DLQ), while the destination queue can be the
 * original source queue (from which the messages were driven to the
 * dead-letter-queue), or a custom destination queue.
 *
 * - Only one active message movement task is supported per queue at any given
 * time.
 */
export const cancelMessageMoveTask: (
  input: CancelMessageMoveTaskRequest,
) => Effect.Effect<
  CancelMessageMoveTaskResult,
  | InvalidAddress
  | InvalidSecurity
  | RequestThrottled
  | ResourceNotFoundException
  | UnsupportedOperation
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelMessageMoveTaskRequest,
  output: CancelMessageMoveTaskResult,
  errors: [
    InvalidAddress,
    InvalidSecurity,
    RequestThrottled,
    ResourceNotFoundException,
    UnsupportedOperation,
    InvalidParameterValueException,
  ],
}));
/**
 * Starts an asynchronous task to move messages from a specified source queue to a
 * specified destination queue.
 *
 * - This action is currently limited to supporting message redrive from queues
 * that are configured as dead-letter queues (DLQs) of other Amazon SQS queues only. Non-SQS
 * queue sources of dead-letter queues, such as Lambda or Amazon SNS topics, are
 * currently not supported.
 *
 * - In dead-letter queues redrive context, the
 * `StartMessageMoveTask` the source queue is the DLQ, while the
 * destination queue can be the original source queue (from which the messages
 * were driven to the dead-letter-queue), or a custom destination queue.
 *
 * - Only one active message movement task is supported per queue at any given
 * time.
 */
export const startMessageMoveTask: (
  input: StartMessageMoveTaskRequest,
) => Effect.Effect<
  StartMessageMoveTaskResult,
  | InvalidAddress
  | InvalidSecurity
  | RequestThrottled
  | ResourceNotFoundException
  | UnsupportedOperation
  | CommonServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMessageMoveTaskRequest,
  output: StartMessageMoveTaskResult,
  errors: [
    InvalidAddress,
    InvalidSecurity,
    RequestThrottled,
    ResourceNotFoundException,
    UnsupportedOperation,
    CommonServiceException,
  ],
}));
/**
 * Sets the value of one or more queue attributes, like a policy. When you change a
 * queue's attributes, the change can take up to 60 seconds for most of the attributes to
 * propagate throughout the Amazon SQS system. Changes made to the
 * `MessageRetentionPeriod` attribute can take up to 15 minutes and will
 * impact existing messages in the queue potentially causing them to be expired and deleted
 * if the `MessageRetentionPeriod` is reduced below the age of existing
 * messages.
 *
 * - In the future, new attributes might be added. If you write code that calls this action, we recommend that you structure your code so that it can handle new attributes gracefully.
 *
 * - Cross-account permissions don't apply to this action. For more information,
 * see Grant
 * cross-account permissions to a role and a username in the *Amazon SQS Developer Guide*.
 *
 * - To remove the ability to change queue permissions, you must deny permission to the `AddPermission`, `RemovePermission`, and `SetQueueAttributes` actions in your IAM policy.
 */
export const setQueueAttributes: (
  input: SetQueueAttributesRequest,
) => Effect.Effect<
  SetQueueAttributesResponse,
  | InvalidAddress
  | InvalidAttributeName
  | InvalidAttributeValue
  | InvalidSecurity
  | OverLimit
  | QueueDoesNotExist
  | RequestThrottled
  | UnsupportedOperation
  | CommonServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetQueueAttributesRequest,
  output: SetQueueAttributesResponse,
  errors: [
    InvalidAddress,
    InvalidAttributeName,
    InvalidAttributeValue,
    InvalidSecurity,
    OverLimit,
    QueueDoesNotExist,
    RequestThrottled,
    UnsupportedOperation,
    CommonServiceException,
  ],
}));
/**
 * The `GetQueueUrl` API returns the URL of an existing Amazon SQS queue. This is
 * useful when you know the queue's name but need to retrieve its URL for further
 * operations.
 *
 * To access a queue owned by another Amazon Web Services account, use the
 * `QueueOwnerAWSAccountId` parameter to specify the account ID of the
 * queue's owner. Note that the queue owner must grant you the necessary permissions to
 * access the queue. For more information about accessing shared queues, see the
 *
 * AddPermission
 * API or Allow developers to write messages to a shared queue in the Amazon SQS
 * Developer Guide.
 */
export const getQueueUrl: (
  input: GetQueueUrlRequest,
) => Effect.Effect<
  GetQueueUrlResult,
  | InvalidAddress
  | InvalidSecurity
  | QueueDoesNotExist
  | RequestThrottled
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQueueUrlRequest,
  output: GetQueueUrlResult,
  errors: [
    InvalidAddress,
    InvalidSecurity,
    QueueDoesNotExist,
    RequestThrottled,
    UnsupportedOperation,
  ],
}));
/**
 * Returns a list of your queues that have the `RedrivePolicy` queue attribute
 * configured with a dead-letter queue.
 *
 * The `ListDeadLetterSourceQueues` methods supports pagination. Set
 * parameter `MaxResults` in the request to specify the maximum number of
 * results to be returned in the response. If you do not set `MaxResults`, the
 * response includes a maximum of 1,000 results. If you set `MaxResults` and
 * there are additional results to display, the response includes a value for
 * `NextToken`. Use `NextToken` as a parameter in your next
 * request to `ListDeadLetterSourceQueues` to receive the next page of results.
 *
 * For more information about using dead-letter queues, see Using Amazon SQS Dead-Letter Queues in the Amazon SQS Developer
 * Guide.
 */
export const listDeadLetterSourceQueues: {
  (
    input: ListDeadLetterSourceQueuesRequest,
  ): Effect.Effect<
    ListDeadLetterSourceQueuesResult,
    | InvalidAddress
    | InvalidSecurity
    | QueueDoesNotExist
    | RequestThrottled
    | UnsupportedOperation
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDeadLetterSourceQueuesRequest,
  ) => Stream.Stream<
    ListDeadLetterSourceQueuesResult,
    | InvalidAddress
    | InvalidSecurity
    | QueueDoesNotExist
    | RequestThrottled
    | UnsupportedOperation
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDeadLetterSourceQueuesRequest,
  ) => Stream.Stream<
    String,
    | InvalidAddress
    | InvalidSecurity
    | QueueDoesNotExist
    | RequestThrottled
    | UnsupportedOperation
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDeadLetterSourceQueuesRequest,
  output: ListDeadLetterSourceQueuesResult,
  errors: [
    InvalidAddress,
    InvalidSecurity,
    QueueDoesNotExist,
    RequestThrottled,
    UnsupportedOperation,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "queueUrls",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List all cost allocation tags added to the specified Amazon SQS queue.
 * For an overview, see Tagging
 * Your Amazon SQS Queues in the *Amazon SQS Developer Guide*.
 *
 * Cross-account permissions don't apply to this action. For more information,
 * see Grant
 * cross-account permissions to a role and a username in the *Amazon SQS Developer Guide*.
 */
export const listQueueTags: (
  input: ListQueueTagsRequest,
) => Effect.Effect<
  ListQueueTagsResult,
  | InvalidAddress
  | InvalidSecurity
  | QueueDoesNotExist
  | RequestThrottled
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListQueueTagsRequest,
  output: ListQueueTagsResult,
  errors: [
    InvalidAddress,
    InvalidSecurity,
    QueueDoesNotExist,
    RequestThrottled,
    UnsupportedOperation,
  ],
}));
/**
 * Deletes the queue specified by the `QueueUrl`, regardless of the queue's
 * contents.
 *
 * Be careful with the `DeleteQueue` action: When you delete a queue, any
 * messages in the queue are no longer available.
 *
 * When you delete a queue, the deletion process takes up to 60 seconds. Requests you
 * send involving that queue during the 60 seconds might succeed. For example, a
 *
 * SendMessage
 * request might succeed, but after 60
 * seconds the queue and the message you sent no longer exist.
 *
 * When you delete a queue, you must wait at least 60 seconds before creating a queue
 * with the same name.
 *
 * Cross-account permissions don't apply to this action. For more information,
 * see Grant
 * cross-account permissions to a role and a username in the *Amazon SQS Developer Guide*.
 *
 * The delete operation uses the HTTP `GET` verb.
 */
export const deleteQueue: (
  input: DeleteQueueRequest,
) => Effect.Effect<
  DeleteQueueResponse,
  | InvalidAddress
  | InvalidSecurity
  | QueueDoesNotExist
  | RequestThrottled
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteQueueRequest,
  output: DeleteQueueResponse,
  errors: [
    InvalidAddress,
    InvalidSecurity,
    QueueDoesNotExist,
    RequestThrottled,
    UnsupportedOperation,
  ],
}));
/**
 * Revokes any permissions in the queue policy that matches the specified
 * `Label` parameter.
 *
 * - Only the owner of a queue can remove permissions from it.
 *
 * - Cross-account permissions don't apply to this action. For more information,
 * see Grant
 * cross-account permissions to a role and a username in the *Amazon SQS Developer Guide*.
 *
 * - To remove the ability to change queue permissions, you must deny permission to the `AddPermission`, `RemovePermission`, and `SetQueueAttributes` actions in your IAM policy.
 */
export const removePermission: (
  input: RemovePermissionRequest,
) => Effect.Effect<
  RemovePermissionResponse,
  | InvalidAddress
  | InvalidSecurity
  | QueueDoesNotExist
  | RequestThrottled
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemovePermissionRequest,
  output: RemovePermissionResponse,
  errors: [
    InvalidAddress,
    InvalidSecurity,
    QueueDoesNotExist,
    RequestThrottled,
    UnsupportedOperation,
  ],
}));
/**
 * Add cost allocation tags to the specified Amazon SQS queue. For an overview, see Tagging
 * Your Amazon SQS Queues in the *Amazon SQS Developer Guide*.
 *
 * When you use queue tags, keep the following guidelines in mind:
 *
 * - Adding more than 50 tags to a queue isn't recommended.
 *
 * - Tags don't have any semantic meaning. Amazon SQS interprets tags as character strings.
 *
 * - Tags are case-sensitive.
 *
 * - A new tag with a key identical to that of an existing tag overwrites the existing tag.
 *
 * For a full list of tag restrictions, see
 * Quotas related to queues
 * in the *Amazon SQS Developer Guide*.
 *
 * Cross-account permissions don't apply to this action. For more information,
 * see Grant
 * cross-account permissions to a role and a username in the *Amazon SQS Developer Guide*.
 */
export const tagQueue: (
  input: TagQueueRequest,
) => Effect.Effect<
  TagQueueResponse,
  | InvalidAddress
  | InvalidSecurity
  | QueueDoesNotExist
  | RequestThrottled
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagQueueRequest,
  output: TagQueueResponse,
  errors: [
    InvalidAddress,
    InvalidSecurity,
    QueueDoesNotExist,
    RequestThrottled,
    UnsupportedOperation,
  ],
}));
/**
 * Remove cost allocation tags from the specified Amazon SQS queue. For an overview, see Tagging
 * Your Amazon SQS Queues in the *Amazon SQS Developer Guide*.
 *
 * Cross-account permissions don't apply to this action. For more information,
 * see Grant
 * cross-account permissions to a role and a username in the *Amazon SQS Developer Guide*.
 */
export const untagQueue: (
  input: UntagQueueRequest,
) => Effect.Effect<
  UntagQueueResponse,
  | InvalidAddress
  | InvalidSecurity
  | QueueDoesNotExist
  | RequestThrottled
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagQueueRequest,
  output: UntagQueueResponse,
  errors: [
    InvalidAddress,
    InvalidSecurity,
    QueueDoesNotExist,
    RequestThrottled,
    UnsupportedOperation,
  ],
}));
/**
 * Adds a permission to a queue for a specific principal. This allows sharing
 * access to the queue.
 *
 * When you create a queue, you have full control access rights for the queue. Only you,
 * the owner of the queue, can grant or deny permissions to the queue. For more information
 * about these permissions, see Allow Developers to Write Messages to a Shared Queue in the Amazon SQS
 * Developer Guide.
 *
 * - `AddPermission` generates a policy for you. You can use
 *
 * SetQueueAttributes
 * to upload your
 * policy. For more information, see Using Custom Policies with the Amazon SQS Access Policy Language in
 * the *Amazon SQS Developer Guide*.
 *
 * - An Amazon SQS policy can have a maximum of seven actions per statement.
 *
 * - To remove the ability to change queue permissions, you must deny permission to the `AddPermission`, `RemovePermission`, and `SetQueueAttributes` actions in your IAM policy.
 *
 * - Amazon SQS `AddPermission` does not support adding a non-account
 * principal.
 *
 * Cross-account permissions don't apply to this action. For more information,
 * see Grant
 * cross-account permissions to a role and a username in the *Amazon SQS Developer Guide*.
 */
export const addPermission: (
  input: AddPermissionRequest,
) => Effect.Effect<
  AddPermissionResponse,
  | InvalidAddress
  | InvalidSecurity
  | OverLimit
  | QueueDoesNotExist
  | RequestThrottled
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddPermissionRequest,
  output: AddPermissionResponse,
  errors: [
    InvalidAddress,
    InvalidSecurity,
    OverLimit,
    QueueDoesNotExist,
    RequestThrottled,
    UnsupportedOperation,
  ],
}));
/**
 * Returns a list of your queues in the current region. The response includes a maximum
 * of 1,000 results. If you specify a value for the optional `QueueNamePrefix`
 * parameter, only queues with a name that begins with the specified value are
 * returned.
 *
 * The `listQueues` methods supports pagination. Set parameter
 * `MaxResults` in the request to specify the maximum number of results to
 * be returned in the response. If you do not set `MaxResults`, the response
 * includes a maximum of 1,000 results. If you set `MaxResults` and there are
 * additional results to display, the response includes a value for `NextToken`.
 * Use `NextToken` as a parameter in your next request to
 * `listQueues` to receive the next page of results.
 *
 * Cross-account permissions don't apply to this action. For more information,
 * see Grant
 * cross-account permissions to a role and a username in the *Amazon SQS Developer Guide*.
 */
export const listQueues: {
  (
    input: ListQueuesRequest,
  ): Effect.Effect<
    ListQueuesResult,
    | InvalidAddress
    | InvalidSecurity
    | RequestThrottled
    | UnsupportedOperation
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListQueuesRequest,
  ) => Stream.Stream<
    ListQueuesResult,
    | InvalidAddress
    | InvalidSecurity
    | RequestThrottled
    | UnsupportedOperation
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListQueuesRequest,
  ) => Stream.Stream<
    String,
    | InvalidAddress
    | InvalidSecurity
    | RequestThrottled
    | UnsupportedOperation
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListQueuesRequest,
  output: ListQueuesResult,
  errors: [
    InvalidAddress,
    InvalidSecurity,
    RequestThrottled,
    UnsupportedOperation,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "QueueUrls",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Gets attributes for the specified queue.
 *
 * To determine whether a queue is FIFO, you can check whether `QueueName` ends with the `.fifo` suffix.
 */
export const getQueueAttributes: (
  input: GetQueueAttributesRequest,
) => Effect.Effect<
  GetQueueAttributesResult,
  | InvalidAddress
  | InvalidAttributeName
  | InvalidSecurity
  | QueueDoesNotExist
  | RequestThrottled
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQueueAttributesRequest,
  output: GetQueueAttributesResult,
  errors: [
    InvalidAddress,
    InvalidAttributeName,
    InvalidSecurity,
    QueueDoesNotExist,
    RequestThrottled,
    UnsupportedOperation,
  ],
}));
/**
 * Gets the most recent message movement tasks (up to 10) under a specific source
 * queue.
 *
 * - This action is currently limited to supporting message redrive from dead-letter queues (DLQs) only. In this context, the source
 * queue is the dead-letter queue (DLQ), while the destination queue can be the
 * original source queue (from which the messages were driven to the
 * dead-letter-queue), or a custom destination queue.
 *
 * - Only one active message movement task is supported per queue at any given
 * time.
 */
export const listMessageMoveTasks: (
  input: ListMessageMoveTasksRequest,
) => Effect.Effect<
  ListMessageMoveTasksResult,
  | InvalidAddress
  | InvalidSecurity
  | RequestThrottled
  | ResourceNotFoundException
  | UnsupportedOperation
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMessageMoveTasksRequest,
  output: ListMessageMoveTasksResult,
  errors: [
    InvalidAddress,
    InvalidSecurity,
    RequestThrottled,
    ResourceNotFoundException,
    UnsupportedOperation,
    InvalidParameterValueException,
  ],
}));
/**
 * Deletes the specified message from the specified queue. To select the message to
 * delete, use the `ReceiptHandle` of the message (*not* the
 * `MessageId` which you receive when you send the message). Amazon SQS can
 * delete a message from a queue even if a visibility timeout setting causes the message to
 * be locked by another consumer. Amazon SQS automatically deletes messages left in a queue
 * longer than the retention period configured for the queue.
 *
 * Each time you receive a message, meaning when a consumer retrieves a message from
 * the queue, it comes with a unique `ReceiptHandle`. If you receive the
 * same message more than once, you will get a different `ReceiptHandle`
 * each time. When you want to delete a message using the `DeleteMessage`
 * action, you must use the `ReceiptHandle` from the most recent time you
 * received the message. If you use an old `ReceiptHandle`, the request will
 * succeed, but the message might not be deleted.
 *
 * For standard queues, it is possible to receive a message even after you
 * delete it. This might happen on rare occasions if one of the servers which stores a
 * copy of the message is unavailable when you send the request to delete the message.
 * The copy remains on the server and might be returned to you during a subsequent
 * receive request. You should ensure that your application is idempotent, so that
 * receiving a message more than once does not cause issues.
 */
export const deleteMessage: (
  input: DeleteMessageRequest,
) => Effect.Effect<
  DeleteMessageResponse,
  | InvalidAddress
  | InvalidIdFormat
  | InvalidSecurity
  | QueueDoesNotExist
  | ReceiptHandleIsInvalid
  | RequestThrottled
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMessageRequest,
  output: DeleteMessageResponse,
  errors: [
    InvalidAddress,
    InvalidIdFormat,
    InvalidSecurity,
    QueueDoesNotExist,
    ReceiptHandleIsInvalid,
    RequestThrottled,
    UnsupportedOperation,
  ],
}));
/**
 * Creates a new standard or FIFO queue. You can pass one or more attributes in
 * the request. Keep the following in mind:
 *
 * - If you don't specify the `FifoQueue` attribute, Amazon SQS creates a standard queue.
 *
 * You can't change the queue type after you create it and you can't convert
 * an existing standard queue into a FIFO queue. You must either create a new
 * FIFO queue for your application or delete your existing standard queue and
 * recreate it as a FIFO queue. For more information, see Moving From a standard queue to a FIFO queue in the
 * *Amazon SQS Developer Guide*.
 *
 * - If you don't provide a value for an attribute, the queue is created with the
 * default value for the attribute.
 *
 * - If you delete a queue, you must wait at least 60 seconds before creating a
 * queue with the same name.
 *
 * To successfully create a new queue, you must provide a queue name that adheres to the
 * limits
 * related to queues and is unique within the scope of your queues.
 *
 * After you create a queue, you must wait at least one second after the queue is
 * created to be able to use the queue.
 *
 * To retrieve the URL of a queue, use the
 * `GetQueueUrl`
 * action. This action only requires the
 * `QueueName`
 * parameter.
 *
 * When creating queues, keep the following points in mind:
 *
 * - If you specify the name of an existing queue and provide the exact same names
 * and values for all its attributes, the
 * `CreateQueue`
 * action will return the URL of the
 * existing queue instead of creating a new one.
 *
 * - If you attempt to create a queue with a name that already exists but with
 * different attribute names or values, the `CreateQueue` action will
 * return an error. This ensures that existing queues are not inadvertently
 * altered.
 *
 * Cross-account permissions don't apply to this action. For more information,
 * see Grant
 * cross-account permissions to a role and a username in the *Amazon SQS Developer Guide*.
 */
export const createQueue: (
  input: CreateQueueRequest,
) => Effect.Effect<
  CreateQueueResult,
  | InvalidAddress
  | InvalidAttributeName
  | InvalidAttributeValue
  | InvalidSecurity
  | QueueDeletedRecently
  | QueueNameExists
  | RequestThrottled
  | UnsupportedOperation
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateQueueRequest,
  output: CreateQueueResult,
  errors: [
    InvalidAddress,
    InvalidAttributeName,
    InvalidAttributeValue,
    InvalidSecurity,
    QueueDeletedRecently,
    QueueNameExists,
    RequestThrottled,
    UnsupportedOperation,
    InvalidParameterValueException,
  ],
}));
/**
 * Changes the visibility timeout of multiple messages. This is a batch version of
 *
 * ChangeMessageVisibility. The result of the action
 * on each message is reported individually in the response. You can send up to 10
 *
 * ChangeMessageVisibility
 * requests with each
 * `ChangeMessageVisibilityBatch` action.
 *
 * Because the batch request can result in a combination of successful and unsuccessful actions, you should check for batch errors even when the call returns an HTTP status code of `200`.
 */
export const changeMessageVisibilityBatch: (
  input: ChangeMessageVisibilityBatchRequest,
) => Effect.Effect<
  ChangeMessageVisibilityBatchResult,
  | BatchEntryIdsNotDistinct
  | EmptyBatchRequest
  | InvalidAddress
  | InvalidBatchEntryId
  | InvalidSecurity
  | QueueDoesNotExist
  | RequestThrottled
  | TooManyEntriesInBatchRequest
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ChangeMessageVisibilityBatchRequest,
  output: ChangeMessageVisibilityBatchResult,
  errors: [
    BatchEntryIdsNotDistinct,
    EmptyBatchRequest,
    InvalidAddress,
    InvalidBatchEntryId,
    InvalidSecurity,
    QueueDoesNotExist,
    RequestThrottled,
    TooManyEntriesInBatchRequest,
    UnsupportedOperation,
  ],
}));
/**
 * Deletes up to ten messages from the specified queue. This is a batch version of
 *
 * DeleteMessage. The result of the action on each
 * message is reported individually in the response.
 *
 * Because the batch request can result in a combination of successful and unsuccessful actions, you should check for batch errors even when the call returns an HTTP status code of `200`.
 */
export const deleteMessageBatch: (
  input: DeleteMessageBatchRequest,
) => Effect.Effect<
  DeleteMessageBatchResult,
  | BatchEntryIdsNotDistinct
  | EmptyBatchRequest
  | InvalidAddress
  | InvalidBatchEntryId
  | InvalidSecurity
  | QueueDoesNotExist
  | RequestThrottled
  | TooManyEntriesInBatchRequest
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMessageBatchRequest,
  output: DeleteMessageBatchResult,
  errors: [
    BatchEntryIdsNotDistinct,
    EmptyBatchRequest,
    InvalidAddress,
    InvalidBatchEntryId,
    InvalidSecurity,
    QueueDoesNotExist,
    RequestThrottled,
    TooManyEntriesInBatchRequest,
    UnsupportedOperation,
  ],
}));
/**
 * Retrieves one or more messages (up to 10), from the specified queue. Using the
 * `WaitTimeSeconds` parameter enables long-poll support. For more
 * information, see Amazon SQS
 * Long Polling in the *Amazon SQS Developer Guide*.
 *
 * Short poll is the default behavior where a weighted random set of machines is sampled
 * on a `ReceiveMessage` call. Therefore, only the messages on the sampled
 * machines are returned. If the number of messages in the queue is small (fewer than
 * 1,000), you most likely get fewer messages than you requested per
 * `ReceiveMessage` call. If the number of messages in the queue is
 * extremely small, you might not receive any messages in a particular
 * `ReceiveMessage` response. If this happens, repeat the request.
 *
 * For each message returned, the response includes the following:
 *
 * - The message body.
 *
 * - An MD5 digest of the message body. For information about MD5, see RFC1321.
 *
 * - The `MessageId` you received when you sent the message to the
 * queue.
 *
 * - The receipt handle.
 *
 * - The message attributes.
 *
 * - An MD5 digest of the message attributes.
 *
 * The receipt handle is the identifier you must provide when deleting the message. For
 * more information, see Queue and Message Identifiers in the Amazon SQS Developer
 * Guide.
 *
 * You can provide the `VisibilityTimeout` parameter in your request. The
 * parameter is applied to the messages that Amazon SQS returns in the response. If you don't
 * include the parameter, the overall visibility timeout for the queue is used for the
 * returned messages. The default visibility timeout for a queue is 30 seconds.
 *
 * In the future, new attributes might be added. If you write code that calls this action, we recommend that you structure your code so that it can handle new attributes gracefully.
 */
export const receiveMessage: (
  input: ReceiveMessageRequest,
) => Effect.Effect<
  ReceiveMessageResult,
  | InvalidAddress
  | InvalidSecurity
  | KmsAccessDenied
  | KmsDisabled
  | KmsInvalidKeyUsage
  | KmsInvalidState
  | KmsNotFound
  | KmsOptInRequired
  | KmsThrottled
  | OverLimit
  | QueueDoesNotExist
  | RequestThrottled
  | UnsupportedOperation
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReceiveMessageRequest,
  output: ReceiveMessageResult,
  errors: [
    InvalidAddress,
    InvalidSecurity,
    KmsAccessDenied,
    KmsDisabled,
    KmsInvalidKeyUsage,
    KmsInvalidState,
    KmsNotFound,
    KmsOptInRequired,
    KmsThrottled,
    OverLimit,
    QueueDoesNotExist,
    RequestThrottled,
    UnsupportedOperation,
    InvalidParameterValueException,
  ],
}));
/**
 * You can use `SendMessageBatch` to send up to 10 messages to the specified
 * queue by assigning either identical or different values to each message (or by not
 * assigning values at all). This is a batch version of
 * SendMessage. For a FIFO queue, multiple messages within a single batch are enqueued
 * in the order they are sent.
 *
 * The result of sending each message is reported individually in the response.
 * Because the batch request can result in a combination of successful and unsuccessful actions, you should check for batch errors even when the call returns an HTTP status code of `200`.
 *
 * The maximum allowed individual message size and the maximum total payload size (the
 * sum of the individual lengths of all of the batched messages) are both 1 MiB
 * 1,048,576 bytes.
 *
 * A message can include only XML, JSON, and unformatted text. The following Unicode characters are allowed. For more information, see the W3C specification for characters.
 *
 * `#x9` | `#xA` | `#xD` | `#x20` to `#xD7FF` | `#xE000` to `#xFFFD` | `#x10000` to `#x10FFFF`
 *
 * If a message contains characters outside the allowed set, Amazon SQS rejects the message and returns an InvalidMessageContents error. Ensure that your message body includes only valid characters to avoid this exception.
 *
 * If you don't specify the `DelaySeconds` parameter for an entry, Amazon SQS uses
 * the default value for the queue.
 */
export const sendMessageBatch: (
  input: SendMessageBatchRequest,
) => Effect.Effect<
  SendMessageBatchResult,
  | BatchEntryIdsNotDistinct
  | BatchRequestTooLong
  | EmptyBatchRequest
  | InvalidAddress
  | InvalidBatchEntryId
  | InvalidSecurity
  | KmsAccessDenied
  | KmsDisabled
  | KmsInvalidKeyUsage
  | KmsInvalidState
  | KmsNotFound
  | KmsOptInRequired
  | KmsThrottled
  | QueueDoesNotExist
  | RequestThrottled
  | TooManyEntriesInBatchRequest
  | UnsupportedOperation
  | InvalidParameterValueException
  | ParseError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendMessageBatchRequest,
  output: SendMessageBatchResult,
  errors: [
    BatchEntryIdsNotDistinct,
    BatchRequestTooLong,
    EmptyBatchRequest,
    InvalidAddress,
    InvalidBatchEntryId,
    InvalidSecurity,
    KmsAccessDenied,
    KmsDisabled,
    KmsInvalidKeyUsage,
    KmsInvalidState,
    KmsNotFound,
    KmsOptInRequired,
    KmsThrottled,
    QueueDoesNotExist,
    RequestThrottled,
    TooManyEntriesInBatchRequest,
    UnsupportedOperation,
    InvalidParameterValueException,
    ParseError,
  ],
}));
/**
 * Delivers a message to the specified queue.
 *
 * A message can include only XML, JSON, and unformatted text. The following Unicode characters are allowed. For more information, see the W3C specification for characters.
 *
 * `#x9` | `#xA` | `#xD` | `#x20` to `#xD7FF` | `#xE000` to `#xFFFD` | `#x10000` to `#x10FFFF`
 *
 * If a message contains characters outside the allowed set, Amazon SQS rejects the message and returns an InvalidMessageContents error. Ensure that your message body includes only valid characters to avoid this exception.
 */
export const sendMessage: (
  input: SendMessageRequest,
) => Effect.Effect<
  SendMessageResult,
  | InvalidAddress
  | InvalidMessageContents
  | InvalidSecurity
  | KmsAccessDenied
  | KmsDisabled
  | KmsInvalidKeyUsage
  | KmsInvalidState
  | KmsNotFound
  | KmsOptInRequired
  | KmsThrottled
  | QueueDoesNotExist
  | RequestThrottled
  | UnsupportedOperation
  | InvalidParameterValueException
  | MissingRequiredParameterException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendMessageRequest,
  output: SendMessageResult,
  errors: [
    InvalidAddress,
    InvalidMessageContents,
    InvalidSecurity,
    KmsAccessDenied,
    KmsDisabled,
    KmsInvalidKeyUsage,
    KmsInvalidState,
    KmsNotFound,
    KmsOptInRequired,
    KmsThrottled,
    QueueDoesNotExist,
    RequestThrottled,
    UnsupportedOperation,
    InvalidParameterValueException,
    MissingRequiredParameterException,
  ],
}));

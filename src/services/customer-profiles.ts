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
const svc = T.AwsApiService({
  sdkId: "Customer Profiles",
  serviceShapeName: "CustomerProfiles_20200815",
});
const auth = T.AwsAuthSigv4({ name: "profile" });
const ver = T.ServiceVersion("2020-08-15");
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
                        url: "https://profile-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://profile-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://profile.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://profile.{Region}.{PartitionResult#dnsSuffix}",
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
export type uuid = string;
export type name = string;
export type string1To255 = string;
export type typeName = string;
export type displayName = string;
export type sensitiveText = string | Redacted.Redacted<string>;
export type expirationDaysInteger = number;
export type encryptionKey = string;
export type sqsQueueUrl = string;
export type sensitiveString1To2000000 = string | Redacted.Redacted<string>;
export type RoleArn = string;
export type sensitiveString1To255 = string | Redacted.Redacted<string>;
export type sensitiveString1To1000 = string | Redacted.Redacted<string>;
export type sensitiveString1To4000 = string | Redacted.Redacted<string>;
export type sensitiveString1To50000 = string | Redacted.Redacted<string>;
export type text = string;
export type stringifiedJson = string | Redacted.Redacted<string>;
export type Double0To1 = number;
export type token = string;
export type maxSize100 = number;
export type string1To1000 = string;
export type MaxSize10 = number;
export type GetRecommenderRequestTrainingMetricsCountInteger = number;
export type ListRecommenderRecipesRequestMaxResultsInteger = number;
export type ListRecommendersRequestMaxResultsInteger = number;
export type MaxSize500 = number;
export type TagArn = string;
export type sensitiveString1To10000 = string | Redacted.Redacted<string>;
export type minSize1 = number;
export type TagKey = string;
export type sensitiveString0To1000 = string | Redacted.Redacted<string>;
export type sensitiveString0To255 = string | Redacted.Redacted<string>;
export type ObjectCount = number;
export type TagValue = string;
export type MaxAllowedRuleLevelForMerging = number;
export type MaxAllowedRuleLevelForMatching = number;
export type optionalLong = number;
export type RecommenderConfigTrainingFrequencyInteger = number;
export type fieldName = string;
export type ContextKey = string;
export type DomainObjectTypeFieldName = string;
export type FlowDescription = string;
export type FlowName = string;
export type KmsArn = string;
export type string0To255 = string;
export type message = string;
export type stringTo2048 = string;
export type matchesNumber = number;
export type minSize0 = number;
export type SegmentDefinitionArn = string;
export type StatusCode = number;
export type RuleLevel = number;
export type Double = number;
export type Start = number;
export type End = number;
export type attributeName = string;
export type Value = number;
export type JobScheduleTime = string;
export type maxSize24 = number;
export type maxSize1000 = number;
export type ConnectorProfileName = string;
export type DestinationField = string;
export type percentageInteger = number;
export type long = number;
export type ProfileId = string;
export type GetSegmentMembershipMessage = string;
export type GetSegmentMembershipStatus = number;
export type ValueRangeStart = number;
export type ValueRangeEnd = number;
export type s3BucketName = string;
export type s3KeyNameCustomerOutputConfig = string;
export type EventParametersEventTypeString = string;
export type DatetimeTypeFieldName = string;
export type Property = string;
export type s3KeyName = string;
export type BucketName = string;
export type BucketPrefix = string;
export type ScheduleExpression = string;
export type Timezone = string;
export type ScheduleOffset = number;
export type Arn = string;

//# Schemas
export type requestValueList = string[];
export const requestValueList = S.Array(S.String);
export type BatchGetCalculatedAttributeForProfileIdList = string[];
export const BatchGetCalculatedAttributeForProfileIdList = S.Array(S.String);
export type BatchGetProfileIdList = string[];
export const BatchGetProfileIdList = S.Array(S.String);
export type Objects = string | Redacted.Redacted<string>[];
export const Objects = S.Array(SensitiveString);
export type ProfileIds = string[];
export const ProfileIds = S.Array(S.String);
export type ProfileIdToBeMergedList = string[];
export const ProfileIdToBeMergedList = S.Array(S.String);
export type EventTriggerNames = string[];
export const EventTriggerNames = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AddProfileKeyRequest {
  ProfileId: string;
  KeyName: string;
  Values: requestValueList;
  DomainName: string;
}
export const AddProfileKeyRequest = S.suspend(() =>
  S.Struct({
    ProfileId: S.String,
    KeyName: S.String,
    Values: requestValueList,
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{DomainName}/profiles/keys" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddProfileKeyRequest",
}) as any as S.Schema<AddProfileKeyRequest>;
export interface BatchGetProfileRequest {
  DomainName: string;
  ProfileIds: BatchGetProfileIdList;
}
export const BatchGetProfileRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ProfileIds: BatchGetProfileIdList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/batch-get-profiles",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetProfileRequest",
}) as any as S.Schema<BatchGetProfileRequest>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface CreateDomainLayoutRequest {
  DomainName: string;
  LayoutDefinitionName: string;
  Description: string | Redacted.Redacted<string>;
  DisplayName: string;
  IsDefault?: boolean;
  LayoutType: string;
  Layout: string | Redacted.Redacted<string>;
  Tags?: TagMap;
}
export const CreateDomainLayoutRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    LayoutDefinitionName: S.String.pipe(T.HttpLabel("LayoutDefinitionName")),
    Description: SensitiveString,
    DisplayName: S.String,
    IsDefault: S.optional(S.Boolean),
    LayoutType: S.String,
    Layout: SensitiveString,
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/layouts/{LayoutDefinitionName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDomainLayoutRequest",
}) as any as S.Schema<CreateDomainLayoutRequest>;
export interface CreateEventStreamRequest {
  DomainName: string;
  Uri: string;
  EventStreamName: string;
  Tags?: TagMap;
}
export const CreateEventStreamRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Uri: S.String,
    EventStreamName: S.String.pipe(T.HttpLabel("EventStreamName")),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/event-streams/{EventStreamName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEventStreamRequest",
}) as any as S.Schema<CreateEventStreamRequest>;
export interface CreateSegmentSnapshotRequest {
  DomainName: string;
  SegmentDefinitionName: string;
  DataFormat: string;
  EncryptionKey?: string;
  RoleArn?: string;
  DestinationUri?: string;
}
export const CreateSegmentSnapshotRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    SegmentDefinitionName: S.String.pipe(T.HttpLabel("SegmentDefinitionName")),
    DataFormat: S.String,
    EncryptionKey: S.optional(S.String),
    RoleArn: S.optional(S.String),
    DestinationUri: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/segments/{SegmentDefinitionName}/snapshots",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSegmentSnapshotRequest",
}) as any as S.Schema<CreateSegmentSnapshotRequest>;
export interface DeleteCalculatedAttributeDefinitionRequest {
  DomainName: string;
  CalculatedAttributeName: string;
}
export const DeleteCalculatedAttributeDefinitionRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    CalculatedAttributeName: S.String.pipe(
      T.HttpLabel("CalculatedAttributeName"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/domains/{DomainName}/calculated-attributes/{CalculatedAttributeName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCalculatedAttributeDefinitionRequest",
}) as any as S.Schema<DeleteCalculatedAttributeDefinitionRequest>;
export interface DeleteCalculatedAttributeDefinitionResponse {}
export const DeleteCalculatedAttributeDefinitionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCalculatedAttributeDefinitionResponse",
}) as any as S.Schema<DeleteCalculatedAttributeDefinitionResponse>;
export interface DeleteDomainRequest {
  DomainName: string;
}
export const DeleteDomainRequest = S.suspend(() =>
  S.Struct({ DomainName: S.String.pipe(T.HttpLabel("DomainName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/domains/{DomainName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDomainRequest",
}) as any as S.Schema<DeleteDomainRequest>;
export interface DeleteDomainLayoutRequest {
  DomainName: string;
  LayoutDefinitionName: string;
}
export const DeleteDomainLayoutRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    LayoutDefinitionName: S.String.pipe(T.HttpLabel("LayoutDefinitionName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/domains/{DomainName}/layouts/{LayoutDefinitionName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDomainLayoutRequest",
}) as any as S.Schema<DeleteDomainLayoutRequest>;
export interface DeleteDomainObjectTypeRequest {
  DomainName: string;
  ObjectTypeName: string;
}
export const DeleteDomainObjectTypeRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ObjectTypeName: S.String.pipe(T.HttpLabel("ObjectTypeName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/domains/{DomainName}/domain-object-types/{ObjectTypeName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDomainObjectTypeRequest",
}) as any as S.Schema<DeleteDomainObjectTypeRequest>;
export interface DeleteDomainObjectTypeResponse {}
export const DeleteDomainObjectTypeResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDomainObjectTypeResponse",
}) as any as S.Schema<DeleteDomainObjectTypeResponse>;
export interface DeleteEventStreamRequest {
  DomainName: string;
  EventStreamName: string;
}
export const DeleteEventStreamRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    EventStreamName: S.String.pipe(T.HttpLabel("EventStreamName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/domains/{DomainName}/event-streams/{EventStreamName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEventStreamRequest",
}) as any as S.Schema<DeleteEventStreamRequest>;
export interface DeleteEventStreamResponse {}
export const DeleteEventStreamResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEventStreamResponse",
}) as any as S.Schema<DeleteEventStreamResponse>;
export interface DeleteEventTriggerRequest {
  DomainName: string;
  EventTriggerName: string;
}
export const DeleteEventTriggerRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    EventTriggerName: S.String.pipe(T.HttpLabel("EventTriggerName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/domains/{DomainName}/event-triggers/{EventTriggerName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEventTriggerRequest",
}) as any as S.Schema<DeleteEventTriggerRequest>;
export interface DeleteIntegrationRequest {
  DomainName: string;
  Uri: string;
}
export const DeleteIntegrationRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Uri: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/integrations/delete",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIntegrationRequest",
}) as any as S.Schema<DeleteIntegrationRequest>;
export interface DeleteProfileRequest {
  ProfileId: string;
  DomainName: string;
}
export const DeleteProfileRequest = S.suspend(() =>
  S.Struct({
    ProfileId: S.String,
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{DomainName}/profiles/delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProfileRequest",
}) as any as S.Schema<DeleteProfileRequest>;
export interface DeleteProfileKeyRequest {
  ProfileId: string;
  KeyName: string;
  Values: requestValueList;
  DomainName: string;
}
export const DeleteProfileKeyRequest = S.suspend(() =>
  S.Struct({
    ProfileId: S.String,
    KeyName: S.String,
    Values: requestValueList,
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/profiles/keys/delete",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProfileKeyRequest",
}) as any as S.Schema<DeleteProfileKeyRequest>;
export interface DeleteProfileObjectRequest {
  ProfileId: string;
  ProfileObjectUniqueKey: string;
  ObjectTypeName: string;
  DomainName: string;
}
export const DeleteProfileObjectRequest = S.suspend(() =>
  S.Struct({
    ProfileId: S.String,
    ProfileObjectUniqueKey: S.String,
    ObjectTypeName: S.String,
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/profiles/objects/delete",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProfileObjectRequest",
}) as any as S.Schema<DeleteProfileObjectRequest>;
export interface DeleteProfileObjectTypeRequest {
  DomainName: string;
  ObjectTypeName: string;
}
export const DeleteProfileObjectTypeRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ObjectTypeName: S.String.pipe(T.HttpLabel("ObjectTypeName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/domains/{DomainName}/object-types/{ObjectTypeName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProfileObjectTypeRequest",
}) as any as S.Schema<DeleteProfileObjectTypeRequest>;
export interface DeleteRecommenderRequest {
  DomainName: string;
  RecommenderName: string;
}
export const DeleteRecommenderRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    RecommenderName: S.String.pipe(T.HttpLabel("RecommenderName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/domains/{DomainName}/recommenders/{RecommenderName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRecommenderRequest",
}) as any as S.Schema<DeleteRecommenderRequest>;
export interface DeleteRecommenderResponse {}
export const DeleteRecommenderResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRecommenderResponse",
}) as any as S.Schema<DeleteRecommenderResponse>;
export interface DeleteSegmentDefinitionRequest {
  DomainName: string;
  SegmentDefinitionName: string;
}
export const DeleteSegmentDefinitionRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    SegmentDefinitionName: S.String.pipe(T.HttpLabel("SegmentDefinitionName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/domains/{DomainName}/segment-definitions/{SegmentDefinitionName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSegmentDefinitionRequest",
}) as any as S.Schema<DeleteSegmentDefinitionRequest>;
export interface DeleteWorkflowRequest {
  DomainName: string;
  WorkflowId: string;
}
export const DeleteWorkflowRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    WorkflowId: S.String.pipe(T.HttpLabel("WorkflowId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/domains/{DomainName}/workflows/{WorkflowId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWorkflowRequest",
}) as any as S.Schema<DeleteWorkflowRequest>;
export interface DeleteWorkflowResponse {}
export const DeleteWorkflowResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteWorkflowResponse" },
) as any as S.Schema<DeleteWorkflowResponse>;
export interface DetectProfileObjectTypeRequest {
  Objects: Objects;
  DomainName: string;
}
export const DetectProfileObjectTypeRequest = S.suspend(() =>
  S.Struct({
    Objects: Objects,
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/detect/object-types",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DetectProfileObjectTypeRequest",
}) as any as S.Schema<DetectProfileObjectTypeRequest>;
export interface GetCalculatedAttributeDefinitionRequest {
  DomainName: string;
  CalculatedAttributeName: string;
}
export const GetCalculatedAttributeDefinitionRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    CalculatedAttributeName: S.String.pipe(
      T.HttpLabel("CalculatedAttributeName"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/calculated-attributes/{CalculatedAttributeName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCalculatedAttributeDefinitionRequest",
}) as any as S.Schema<GetCalculatedAttributeDefinitionRequest>;
export interface GetCalculatedAttributeForProfileRequest {
  DomainName: string;
  ProfileId: string;
  CalculatedAttributeName: string;
}
export const GetCalculatedAttributeForProfileRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ProfileId: S.String.pipe(T.HttpLabel("ProfileId")),
    CalculatedAttributeName: S.String.pipe(
      T.HttpLabel("CalculatedAttributeName"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/profile/{ProfileId}/calculated-attributes/{CalculatedAttributeName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCalculatedAttributeForProfileRequest",
}) as any as S.Schema<GetCalculatedAttributeForProfileRequest>;
export interface GetDomainRequest {
  DomainName: string;
}
export const GetDomainRequest = S.suspend(() =>
  S.Struct({ DomainName: S.String.pipe(T.HttpLabel("DomainName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/domains/{DomainName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDomainRequest",
}) as any as S.Schema<GetDomainRequest>;
export interface GetDomainLayoutRequest {
  DomainName: string;
  LayoutDefinitionName: string;
}
export const GetDomainLayoutRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    LayoutDefinitionName: S.String.pipe(T.HttpLabel("LayoutDefinitionName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/layouts/{LayoutDefinitionName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDomainLayoutRequest",
}) as any as S.Schema<GetDomainLayoutRequest>;
export interface GetDomainObjectTypeRequest {
  DomainName: string;
  ObjectTypeName: string;
}
export const GetDomainObjectTypeRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ObjectTypeName: S.String.pipe(T.HttpLabel("ObjectTypeName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/domain-object-types/{ObjectTypeName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDomainObjectTypeRequest",
}) as any as S.Schema<GetDomainObjectTypeRequest>;
export interface GetEventStreamRequest {
  DomainName: string;
  EventStreamName: string;
}
export const GetEventStreamRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    EventStreamName: S.String.pipe(T.HttpLabel("EventStreamName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/event-streams/{EventStreamName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEventStreamRequest",
}) as any as S.Schema<GetEventStreamRequest>;
export interface GetEventTriggerRequest {
  DomainName: string;
  EventTriggerName: string;
}
export const GetEventTriggerRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    EventTriggerName: S.String.pipe(T.HttpLabel("EventTriggerName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/event-triggers/{EventTriggerName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEventTriggerRequest",
}) as any as S.Schema<GetEventTriggerRequest>;
export interface GetIdentityResolutionJobRequest {
  DomainName: string;
  JobId: string;
}
export const GetIdentityResolutionJobRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    JobId: S.String.pipe(T.HttpLabel("JobId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/identity-resolution-jobs/{JobId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIdentityResolutionJobRequest",
}) as any as S.Schema<GetIdentityResolutionJobRequest>;
export interface GetIntegrationRequest {
  DomainName: string;
  Uri: string;
}
export const GetIntegrationRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Uri: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{DomainName}/integrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIntegrationRequest",
}) as any as S.Schema<GetIntegrationRequest>;
export interface GetMatchesRequest {
  NextToken?: string;
  MaxResults?: number;
  DomainName: string;
}
export const GetMatchesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/domains/{DomainName}/matches" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMatchesRequest",
}) as any as S.Schema<GetMatchesRequest>;
export interface GetObjectTypeAttributeStatisticsRequest {
  DomainName: string;
  ObjectTypeName: string;
  AttributeName: string;
}
export const GetObjectTypeAttributeStatisticsRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ObjectTypeName: S.String.pipe(T.HttpLabel("ObjectTypeName")),
    AttributeName: S.String.pipe(T.HttpLabel("AttributeName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/object-types/{ObjectTypeName}/attributes/{AttributeName}/statistics",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetObjectTypeAttributeStatisticsRequest",
}) as any as S.Schema<GetObjectTypeAttributeStatisticsRequest>;
export interface GetProfileHistoryRecordRequest {
  DomainName: string;
  ProfileId: string;
  Id: string;
}
export const GetProfileHistoryRecordRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ProfileId: S.String.pipe(T.HttpLabel("ProfileId")),
    Id: S.String.pipe(T.HttpLabel("Id")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/profiles/{ProfileId}/history-records/{Id}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProfileHistoryRecordRequest",
}) as any as S.Schema<GetProfileHistoryRecordRequest>;
export interface GetProfileObjectTypeRequest {
  DomainName: string;
  ObjectTypeName: string;
}
export const GetProfileObjectTypeRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ObjectTypeName: S.String.pipe(T.HttpLabel("ObjectTypeName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/object-types/{ObjectTypeName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProfileObjectTypeRequest",
}) as any as S.Schema<GetProfileObjectTypeRequest>;
export interface GetProfileObjectTypeTemplateRequest {
  TemplateId: string;
}
export const GetProfileObjectTypeTemplateRequest = S.suspend(() =>
  S.Struct({ TemplateId: S.String.pipe(T.HttpLabel("TemplateId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/templates/{TemplateId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProfileObjectTypeTemplateRequest",
}) as any as S.Schema<GetProfileObjectTypeTemplateRequest>;
export interface GetRecommenderRequest {
  DomainName: string;
  RecommenderName: string;
  TrainingMetricsCount?: number;
}
export const GetRecommenderRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    RecommenderName: S.String.pipe(T.HttpLabel("RecommenderName")),
    TrainingMetricsCount: S.optional(S.Number).pipe(
      T.HttpQuery("training-metrics-count"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/recommenders/{RecommenderName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRecommenderRequest",
}) as any as S.Schema<GetRecommenderRequest>;
export interface GetSegmentDefinitionRequest {
  DomainName: string;
  SegmentDefinitionName: string;
}
export const GetSegmentDefinitionRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    SegmentDefinitionName: S.String.pipe(T.HttpLabel("SegmentDefinitionName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/segment-definitions/{SegmentDefinitionName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSegmentDefinitionRequest",
}) as any as S.Schema<GetSegmentDefinitionRequest>;
export interface GetSegmentEstimateRequest {
  DomainName: string;
  EstimateId: string;
}
export const GetSegmentEstimateRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    EstimateId: S.String.pipe(T.HttpLabel("EstimateId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/segment-estimates/{EstimateId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSegmentEstimateRequest",
}) as any as S.Schema<GetSegmentEstimateRequest>;
export interface GetSegmentMembershipRequest {
  DomainName: string;
  SegmentDefinitionName: string;
  ProfileIds: ProfileIds;
}
export const GetSegmentMembershipRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    SegmentDefinitionName: S.String.pipe(T.HttpLabel("SegmentDefinitionName")),
    ProfileIds: ProfileIds.pipe(T.JsonName("ProfileIds")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/segments/{SegmentDefinitionName}/membership",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSegmentMembershipRequest",
}) as any as S.Schema<GetSegmentMembershipRequest>;
export interface GetSegmentSnapshotRequest {
  DomainName: string;
  SegmentDefinitionName: string;
  SnapshotId: string;
}
export const GetSegmentSnapshotRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    SegmentDefinitionName: S.String.pipe(T.HttpLabel("SegmentDefinitionName")),
    SnapshotId: S.String.pipe(T.HttpLabel("SnapshotId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/segments/{SegmentDefinitionName}/snapshots/{SnapshotId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSegmentSnapshotRequest",
}) as any as S.Schema<GetSegmentSnapshotRequest>;
export interface GetSimilarProfilesRequest {
  NextToken?: string;
  MaxResults?: number;
  DomainName: string;
  MatchType: string;
  SearchKey: string;
  SearchValue: string;
}
export const GetSimilarProfilesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    MatchType: S.String,
    SearchKey: S.String,
    SearchValue: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{DomainName}/matches" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSimilarProfilesRequest",
}) as any as S.Schema<GetSimilarProfilesRequest>;
export interface GetUploadJobRequest {
  DomainName: string;
  JobId: string;
}
export const GetUploadJobRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    JobId: S.String.pipe(T.HttpLabel("JobId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/upload-jobs/{JobId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUploadJobRequest",
}) as any as S.Schema<GetUploadJobRequest>;
export interface GetUploadJobPathRequest {
  DomainName: string;
  JobId: string;
}
export const GetUploadJobPathRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    JobId: S.String.pipe(T.HttpLabel("JobId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/upload-jobs/{JobId}/path",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUploadJobPathRequest",
}) as any as S.Schema<GetUploadJobPathRequest>;
export interface GetWorkflowRequest {
  DomainName: string;
  WorkflowId: string;
}
export const GetWorkflowRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    WorkflowId: S.String.pipe(T.HttpLabel("WorkflowId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/workflows/{WorkflowId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWorkflowRequest",
}) as any as S.Schema<GetWorkflowRequest>;
export interface GetWorkflowStepsRequest {
  DomainName: string;
  WorkflowId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const GetWorkflowStepsRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    WorkflowId: S.String.pipe(T.HttpLabel("WorkflowId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/workflows/{WorkflowId}/steps",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWorkflowStepsRequest",
}) as any as S.Schema<GetWorkflowStepsRequest>;
export interface ListAccountIntegrationsRequest {
  Uri: string;
  NextToken?: string;
  MaxResults?: number;
  IncludeHidden?: boolean;
}
export const ListAccountIntegrationsRequest = S.suspend(() =>
  S.Struct({
    Uri: S.String,
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    IncludeHidden: S.optional(S.Boolean).pipe(T.HttpQuery("include-hidden")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/integrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAccountIntegrationsRequest",
}) as any as S.Schema<ListAccountIntegrationsRequest>;
export interface ListCalculatedAttributeDefinitionsRequest {
  DomainName: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListCalculatedAttributeDefinitionsRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/calculated-attributes",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCalculatedAttributeDefinitionsRequest",
}) as any as S.Schema<ListCalculatedAttributeDefinitionsRequest>;
export interface ListCalculatedAttributesForProfileRequest {
  NextToken?: string;
  MaxResults?: number;
  DomainName: string;
  ProfileId: string;
}
export const ListCalculatedAttributesForProfileRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ProfileId: S.String.pipe(T.HttpLabel("ProfileId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/profile/{ProfileId}/calculated-attributes",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCalculatedAttributesForProfileRequest",
}) as any as S.Schema<ListCalculatedAttributesForProfileRequest>;
export interface ListDomainLayoutsRequest {
  DomainName: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListDomainLayoutsRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/domains/{DomainName}/layouts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDomainLayoutsRequest",
}) as any as S.Schema<ListDomainLayoutsRequest>;
export interface ListDomainObjectTypesRequest {
  DomainName: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListDomainObjectTypesRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/domain-object-types",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDomainObjectTypesRequest",
}) as any as S.Schema<ListDomainObjectTypesRequest>;
export interface ListDomainsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListDomainsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/domains" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDomainsRequest",
}) as any as S.Schema<ListDomainsRequest>;
export interface ListEventStreamsRequest {
  DomainName: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListEventStreamsRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/domains/{DomainName}/event-streams" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEventStreamsRequest",
}) as any as S.Schema<ListEventStreamsRequest>;
export interface ListEventTriggersRequest {
  DomainName: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListEventTriggersRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/domains/{DomainName}/event-triggers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEventTriggersRequest",
}) as any as S.Schema<ListEventTriggersRequest>;
export interface ListIdentityResolutionJobsRequest {
  DomainName: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListIdentityResolutionJobsRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/identity-resolution-jobs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIdentityResolutionJobsRequest",
}) as any as S.Schema<ListIdentityResolutionJobsRequest>;
export interface ListIntegrationsRequest {
  DomainName: string;
  NextToken?: string;
  MaxResults?: number;
  IncludeHidden?: boolean;
}
export const ListIntegrationsRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    IncludeHidden: S.optional(S.Boolean).pipe(T.HttpQuery("include-hidden")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/domains/{DomainName}/integrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIntegrationsRequest",
}) as any as S.Schema<ListIntegrationsRequest>;
export interface ListObjectTypeAttributesRequest {
  NextToken?: string;
  MaxResults?: number;
  DomainName: string;
  ObjectTypeName: string;
}
export const ListObjectTypeAttributesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ObjectTypeName: S.String.pipe(T.HttpLabel("ObjectTypeName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/object-types/{ObjectTypeName}/attributes",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListObjectTypeAttributesRequest",
}) as any as S.Schema<ListObjectTypeAttributesRequest>;
export interface ListObjectTypeAttributeValuesRequest {
  NextToken?: string;
  MaxResults?: number;
  DomainName: string;
  ObjectTypeName: string;
  AttributeName: string;
}
export const ListObjectTypeAttributeValuesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ObjectTypeName: S.String.pipe(T.HttpLabel("ObjectTypeName")),
    AttributeName: S.String.pipe(T.HttpLabel("AttributeName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/object-types/{ObjectTypeName}/attributes/{AttributeName}/values",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListObjectTypeAttributeValuesRequest",
}) as any as S.Schema<ListObjectTypeAttributeValuesRequest>;
export interface ProfileAttributeValuesRequest {
  DomainName: string;
  AttributeName: string;
}
export const ProfileAttributeValuesRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    AttributeName: S.String.pipe(T.HttpLabel("AttributeName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/profile-attributes/{AttributeName}/values",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ProfileAttributeValuesRequest",
}) as any as S.Schema<ProfileAttributeValuesRequest>;
export interface ListProfileHistoryRecordsRequest {
  DomainName: string;
  ProfileId: string;
  ObjectTypeName?: string;
  NextToken?: string;
  MaxResults?: number;
  ActionType?: string;
  PerformedBy?: string;
}
export const ListProfileHistoryRecordsRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ProfileId: S.String,
    ObjectTypeName: S.optional(S.String),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    ActionType: S.optional(S.String),
    PerformedBy: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/profiles/history-records",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProfileHistoryRecordsRequest",
}) as any as S.Schema<ListProfileHistoryRecordsRequest>;
export interface ListProfileObjectTypesRequest {
  DomainName: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListProfileObjectTypesRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/domains/{DomainName}/object-types" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProfileObjectTypesRequest",
}) as any as S.Schema<ListProfileObjectTypesRequest>;
export interface ListProfileObjectTypeTemplatesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListProfileObjectTypeTemplatesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/templates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProfileObjectTypeTemplatesRequest",
}) as any as S.Schema<ListProfileObjectTypeTemplatesRequest>;
export interface ListRecommenderRecipesRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListRecommenderRecipesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/recommender-recipes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRecommenderRecipesRequest",
}) as any as S.Schema<ListRecommenderRecipesRequest>;
export interface ListRecommendersRequest {
  DomainName: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListRecommendersRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/domains/{DomainName}/recommenders" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRecommendersRequest",
}) as any as S.Schema<ListRecommendersRequest>;
export interface ListRuleBasedMatchesRequest {
  NextToken?: string;
  MaxResults?: number;
  DomainName: string;
}
export const ListRuleBasedMatchesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/profiles/ruleBasedMatches",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRuleBasedMatchesRequest",
}) as any as S.Schema<ListRuleBasedMatchesRequest>;
export interface ListSegmentDefinitionsRequest {
  DomainName: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListSegmentDefinitionsRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domains/{DomainName}/segment-definitions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSegmentDefinitionsRequest",
}) as any as S.Schema<ListSegmentDefinitionsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ListUploadJobsRequest {
  DomainName: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListUploadJobsRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/domains/{DomainName}/upload-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListUploadJobsRequest",
}) as any as S.Schema<ListUploadJobsRequest>;
export interface ListWorkflowsRequest {
  DomainName: string;
  WorkflowType?: string;
  Status?: string;
  QueryStartDate?: Date;
  QueryEndDate?: Date;
  NextToken?: string;
  MaxResults?: number;
}
export const ListWorkflowsRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    WorkflowType: S.optional(S.String),
    Status: S.optional(S.String),
    QueryStartDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    QueryEndDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{DomainName}/workflows" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWorkflowsRequest",
}) as any as S.Schema<ListWorkflowsRequest>;
export interface PutProfileObjectRequest {
  ObjectTypeName: string;
  Object: string | Redacted.Redacted<string>;
  DomainName: string;
}
export const PutProfileObjectRequest = S.suspend(() =>
  S.Struct({
    ObjectTypeName: S.String,
    Object: SensitiveString,
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/domains/{DomainName}/profiles/objects" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutProfileObjectRequest",
}) as any as S.Schema<PutProfileObjectRequest>;
export interface StartRecommenderRequest {
  DomainName: string;
  RecommenderName: string;
}
export const StartRecommenderRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    RecommenderName: S.String.pipe(T.HttpLabel("RecommenderName")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/domains/{DomainName}/recommenders/{RecommenderName}/start",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartRecommenderRequest",
}) as any as S.Schema<StartRecommenderRequest>;
export interface StartRecommenderResponse {}
export const StartRecommenderResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartRecommenderResponse",
}) as any as S.Schema<StartRecommenderResponse>;
export interface StartUploadJobRequest {
  DomainName: string;
  JobId: string;
}
export const StartUploadJobRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    JobId: S.String.pipe(T.HttpLabel("JobId")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/domains/{DomainName}/upload-jobs/{JobId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartUploadJobRequest",
}) as any as S.Schema<StartUploadJobRequest>;
export interface StartUploadJobResponse {}
export const StartUploadJobResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "StartUploadJobResponse" },
) as any as S.Schema<StartUploadJobResponse>;
export interface StopRecommenderRequest {
  DomainName: string;
  RecommenderName: string;
}
export const StopRecommenderRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    RecommenderName: S.String.pipe(T.HttpLabel("RecommenderName")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/domains/{DomainName}/recommenders/{RecommenderName}/stop",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopRecommenderRequest",
}) as any as S.Schema<StopRecommenderRequest>;
export interface StopRecommenderResponse {}
export const StopRecommenderResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopRecommenderResponse",
}) as any as S.Schema<StopRecommenderResponse>;
export interface StopUploadJobRequest {
  DomainName: string;
  JobId: string;
}
export const StopUploadJobRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    JobId: S.String.pipe(T.HttpLabel("JobId")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/domains/{DomainName}/upload-jobs/{JobId}/stop",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopUploadJobRequest",
}) as any as S.Schema<StopUploadJobRequest>;
export interface StopUploadJobResponse {}
export const StopUploadJobResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "StopUploadJobResponse",
}) as any as S.Schema<StopUploadJobResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: TagMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface ValueRange {
  Start: number;
  End: number;
}
export const ValueRange = S.suspend(() =>
  S.Struct({ Start: S.Number, End: S.Number }),
).annotations({ identifier: "ValueRange" }) as any as S.Schema<ValueRange>;
export interface Range {
  Value?: number;
  Unit?: string;
  ValueRange?: ValueRange;
  TimestampSource?: string;
  TimestampFormat?: string;
}
export const Range = S.suspend(() =>
  S.Struct({
    Value: S.optional(S.Number),
    Unit: S.optional(S.String),
    ValueRange: S.optional(ValueRange),
    TimestampSource: S.optional(S.String),
    TimestampFormat: S.optional(S.String),
  }),
).annotations({ identifier: "Range" }) as any as S.Schema<Range>;
export interface Threshold {
  Value: string;
  Operator: string;
}
export const Threshold = S.suspend(() =>
  S.Struct({ Value: S.String, Operator: S.String }),
).annotations({ identifier: "Threshold" }) as any as S.Schema<Threshold>;
export interface Conditions {
  Range?: Range;
  ObjectCount?: number;
  Threshold?: Threshold;
}
export const Conditions = S.suspend(() =>
  S.Struct({
    Range: S.optional(Range),
    ObjectCount: S.optional(S.Number),
    Threshold: S.optional(Threshold),
  }),
).annotations({ identifier: "Conditions" }) as any as S.Schema<Conditions>;
export interface UpdateCalculatedAttributeDefinitionRequest {
  DomainName: string;
  CalculatedAttributeName: string;
  DisplayName?: string;
  Description?: string | Redacted.Redacted<string>;
  Conditions?: Conditions;
}
export const UpdateCalculatedAttributeDefinitionRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    CalculatedAttributeName: S.String.pipe(
      T.HttpLabel("CalculatedAttributeName"),
    ),
    DisplayName: S.optional(S.String),
    Description: S.optional(SensitiveString),
    Conditions: S.optional(Conditions),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/domains/{DomainName}/calculated-attributes/{CalculatedAttributeName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCalculatedAttributeDefinitionRequest",
}) as any as S.Schema<UpdateCalculatedAttributeDefinitionRequest>;
export interface JobSchedule {
  DayOfTheWeek: string;
  Time: string;
}
export const JobSchedule = S.suspend(() =>
  S.Struct({ DayOfTheWeek: S.String, Time: S.String }),
).annotations({ identifier: "JobSchedule" }) as any as S.Schema<JobSchedule>;
export type MatchingAttributes = string[];
export const MatchingAttributes = S.Array(S.String);
export type MatchingAttributesList = MatchingAttributes[];
export const MatchingAttributesList = S.Array(MatchingAttributes);
export interface Consolidation {
  MatchingAttributesList: MatchingAttributesList;
}
export const Consolidation = S.suspend(() =>
  S.Struct({ MatchingAttributesList: MatchingAttributesList }),
).annotations({
  identifier: "Consolidation",
}) as any as S.Schema<Consolidation>;
export interface ConflictResolution {
  ConflictResolvingModel: string;
  SourceName?: string;
}
export const ConflictResolution = S.suspend(() =>
  S.Struct({
    ConflictResolvingModel: S.String,
    SourceName: S.optional(S.String),
  }),
).annotations({
  identifier: "ConflictResolution",
}) as any as S.Schema<ConflictResolution>;
export interface AutoMerging {
  Enabled: boolean;
  Consolidation?: Consolidation;
  ConflictResolution?: ConflictResolution;
  MinAllowedConfidenceScoreForMerging?: number;
}
export const AutoMerging = S.suspend(() =>
  S.Struct({
    Enabled: S.Boolean,
    Consolidation: S.optional(Consolidation),
    ConflictResolution: S.optional(ConflictResolution),
    MinAllowedConfidenceScoreForMerging: S.optional(S.Number),
  }),
).annotations({ identifier: "AutoMerging" }) as any as S.Schema<AutoMerging>;
export interface S3ExportingConfig {
  S3BucketName: string;
  S3KeyName?: string;
}
export const S3ExportingConfig = S.suspend(() =>
  S.Struct({ S3BucketName: S.String, S3KeyName: S.optional(S.String) }),
).annotations({
  identifier: "S3ExportingConfig",
}) as any as S.Schema<S3ExportingConfig>;
export interface ExportingConfig {
  S3Exporting?: S3ExportingConfig;
}
export const ExportingConfig = S.suspend(() =>
  S.Struct({ S3Exporting: S.optional(S3ExportingConfig) }),
).annotations({
  identifier: "ExportingConfig",
}) as any as S.Schema<ExportingConfig>;
export interface MatchingRequest {
  Enabled: boolean;
  JobSchedule?: JobSchedule;
  AutoMerging?: AutoMerging;
  ExportingConfig?: ExportingConfig;
}
export const MatchingRequest = S.suspend(() =>
  S.Struct({
    Enabled: S.Boolean,
    JobSchedule: S.optional(JobSchedule),
    AutoMerging: S.optional(AutoMerging),
    ExportingConfig: S.optional(ExportingConfig),
  }),
).annotations({
  identifier: "MatchingRequest",
}) as any as S.Schema<MatchingRequest>;
export type MatchingRuleAttributeList = string[];
export const MatchingRuleAttributeList = S.Array(S.String);
export interface MatchingRule {
  Rule: MatchingRuleAttributeList;
}
export const MatchingRule = S.suspend(() =>
  S.Struct({ Rule: MatchingRuleAttributeList }),
).annotations({ identifier: "MatchingRule" }) as any as S.Schema<MatchingRule>;
export type MatchingRules = MatchingRule[];
export const MatchingRules = S.Array(MatchingRule);
export type AddressList = string[];
export const AddressList = S.Array(S.String);
export type PhoneNumberList = string[];
export const PhoneNumberList = S.Array(S.String);
export type EmailList = string[];
export const EmailList = S.Array(S.String);
export interface AttributeTypesSelector {
  AttributeMatchingModel: string;
  Address?: AddressList;
  PhoneNumber?: PhoneNumberList;
  EmailAddress?: EmailList;
}
export const AttributeTypesSelector = S.suspend(() =>
  S.Struct({
    AttributeMatchingModel: S.String,
    Address: S.optional(AddressList),
    PhoneNumber: S.optional(PhoneNumberList),
    EmailAddress: S.optional(EmailList),
  }),
).annotations({
  identifier: "AttributeTypesSelector",
}) as any as S.Schema<AttributeTypesSelector>;
export interface RuleBasedMatchingRequest {
  Enabled: boolean;
  MatchingRules?: MatchingRules;
  MaxAllowedRuleLevelForMerging?: number;
  MaxAllowedRuleLevelForMatching?: number;
  AttributeTypesSelector?: AttributeTypesSelector;
  ConflictResolution?: ConflictResolution;
  ExportingConfig?: ExportingConfig;
}
export const RuleBasedMatchingRequest = S.suspend(() =>
  S.Struct({
    Enabled: S.Boolean,
    MatchingRules: S.optional(MatchingRules),
    MaxAllowedRuleLevelForMerging: S.optional(S.Number),
    MaxAllowedRuleLevelForMatching: S.optional(S.Number),
    AttributeTypesSelector: S.optional(AttributeTypesSelector),
    ConflictResolution: S.optional(ConflictResolution),
    ExportingConfig: S.optional(ExportingConfig),
  }),
).annotations({
  identifier: "RuleBasedMatchingRequest",
}) as any as S.Schema<RuleBasedMatchingRequest>;
export interface DataStoreRequest {
  Enabled?: boolean;
}
export const DataStoreRequest = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "DataStoreRequest",
}) as any as S.Schema<DataStoreRequest>;
export interface UpdateDomainRequest {
  DomainName: string;
  DefaultExpirationDays?: number;
  DefaultEncryptionKey?: string;
  DeadLetterQueueUrl?: string;
  Matching?: MatchingRequest;
  RuleBasedMatching?: RuleBasedMatchingRequest;
  DataStore?: DataStoreRequest;
  Tags?: TagMap;
}
export const UpdateDomainRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    DefaultExpirationDays: S.optional(S.Number),
    DefaultEncryptionKey: S.optional(S.String),
    DeadLetterQueueUrl: S.optional(S.String),
    Matching: S.optional(MatchingRequest),
    RuleBasedMatching: S.optional(RuleBasedMatchingRequest),
    DataStore: S.optional(DataStoreRequest),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/domains/{DomainName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDomainRequest",
}) as any as S.Schema<UpdateDomainRequest>;
export interface UpdateDomainLayoutRequest {
  DomainName: string;
  LayoutDefinitionName: string;
  Description?: string | Redacted.Redacted<string>;
  DisplayName?: string;
  IsDefault?: boolean;
  LayoutType?: string;
  Layout?: string | Redacted.Redacted<string>;
}
export const UpdateDomainLayoutRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    LayoutDefinitionName: S.String.pipe(T.HttpLabel("LayoutDefinitionName")),
    Description: S.optional(SensitiveString),
    DisplayName: S.optional(S.String),
    IsDefault: S.optional(S.Boolean),
    LayoutType: S.optional(S.String),
    Layout: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/domains/{DomainName}/layouts/{LayoutDefinitionName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDomainLayoutRequest",
}) as any as S.Schema<UpdateDomainLayoutRequest>;
export type EventTriggerValues = string[];
export const EventTriggerValues = S.Array(S.String);
export interface ObjectAttribute {
  Source?: string;
  FieldName?: string;
  ComparisonOperator: string;
  Values: EventTriggerValues;
}
export const ObjectAttribute = S.suspend(() =>
  S.Struct({
    Source: S.optional(S.String),
    FieldName: S.optional(S.String),
    ComparisonOperator: S.String,
    Values: EventTriggerValues,
  }),
).annotations({
  identifier: "ObjectAttribute",
}) as any as S.Schema<ObjectAttribute>;
export type ObjectAttributes = ObjectAttribute[];
export const ObjectAttributes = S.Array(ObjectAttribute);
export interface EventTriggerDimension {
  ObjectAttributes: ObjectAttributes;
}
export const EventTriggerDimension = S.suspend(() =>
  S.Struct({ ObjectAttributes: ObjectAttributes }),
).annotations({
  identifier: "EventTriggerDimension",
}) as any as S.Schema<EventTriggerDimension>;
export type EventTriggerDimensions = EventTriggerDimension[];
export const EventTriggerDimensions = S.Array(EventTriggerDimension);
export interface EventTriggerCondition {
  EventTriggerDimensions: EventTriggerDimensions;
  LogicalOperator: string;
}
export const EventTriggerCondition = S.suspend(() =>
  S.Struct({
    EventTriggerDimensions: EventTriggerDimensions,
    LogicalOperator: S.String,
  }),
).annotations({
  identifier: "EventTriggerCondition",
}) as any as S.Schema<EventTriggerCondition>;
export type EventTriggerConditions = EventTriggerCondition[];
export const EventTriggerConditions = S.Array(EventTriggerCondition);
export interface Period {
  Unit: string;
  Value: number;
  MaxInvocationsPerProfile?: number;
  Unlimited?: boolean;
}
export const Period = S.suspend(() =>
  S.Struct({
    Unit: S.String,
    Value: S.Number,
    MaxInvocationsPerProfile: S.optional(S.Number),
    Unlimited: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Period" }) as any as S.Schema<Period>;
export type Periods = Period[];
export const Periods = S.Array(Period);
export interface EventTriggerLimits {
  EventExpiration?: number;
  Periods?: Periods;
}
export const EventTriggerLimits = S.suspend(() =>
  S.Struct({
    EventExpiration: S.optional(S.Number),
    Periods: S.optional(Periods),
  }),
).annotations({
  identifier: "EventTriggerLimits",
}) as any as S.Schema<EventTriggerLimits>;
export interface UpdateEventTriggerRequest {
  DomainName: string;
  EventTriggerName: string;
  ObjectTypeName?: string;
  Description?: string | Redacted.Redacted<string>;
  EventTriggerConditions?: EventTriggerConditions;
  SegmentFilter?: string;
  EventTriggerLimits?: EventTriggerLimits;
}
export const UpdateEventTriggerRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    EventTriggerName: S.String.pipe(T.HttpLabel("EventTriggerName")),
    ObjectTypeName: S.optional(S.String),
    Description: S.optional(SensitiveString),
    EventTriggerConditions: S.optional(EventTriggerConditions),
    SegmentFilter: S.optional(S.String),
    EventTriggerLimits: S.optional(EventTriggerLimits),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/domains/{DomainName}/event-triggers/{EventTriggerName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEventTriggerRequest",
}) as any as S.Schema<UpdateEventTriggerRequest>;
export interface EventParameters {
  EventType: string;
  EventValueThreshold?: number;
}
export const EventParameters = S.suspend(() =>
  S.Struct({ EventType: S.String, EventValueThreshold: S.optional(S.Number) }),
).annotations({
  identifier: "EventParameters",
}) as any as S.Schema<EventParameters>;
export type EventParametersList = EventParameters[];
export const EventParametersList = S.Array(EventParameters);
export interface EventsConfig {
  EventParametersList: EventParametersList;
}
export const EventsConfig = S.suspend(() =>
  S.Struct({ EventParametersList: EventParametersList }),
).annotations({ identifier: "EventsConfig" }) as any as S.Schema<EventsConfig>;
export interface RecommenderConfig {
  EventsConfig: EventsConfig;
  TrainingFrequency?: number;
}
export const RecommenderConfig = S.suspend(() =>
  S.Struct({
    EventsConfig: EventsConfig,
    TrainingFrequency: S.optional(S.Number),
  }),
).annotations({
  identifier: "RecommenderConfig",
}) as any as S.Schema<RecommenderConfig>;
export interface UpdateRecommenderRequest {
  DomainName: string;
  RecommenderName: string;
  Description?: string | Redacted.Redacted<string>;
  RecommenderConfig?: RecommenderConfig;
}
export const UpdateRecommenderRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    RecommenderName: S.String.pipe(T.HttpLabel("RecommenderName")),
    Description: S.optional(SensitiveString),
    RecommenderConfig: S.optional(RecommenderConfig),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/domains/{DomainName}/recommenders/{RecommenderName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRecommenderRequest",
}) as any as S.Schema<UpdateRecommenderRequest>;
export interface ContactPreference {
  KeyName?: string;
  KeyValue?: string;
  ProfileId?: string;
  ContactType?: string;
}
export const ContactPreference = S.suspend(() =>
  S.Struct({
    KeyName: S.optional(S.String),
    KeyValue: S.optional(S.String),
    ProfileId: S.optional(S.String),
    ContactType: S.optional(S.String),
  }),
).annotations({
  identifier: "ContactPreference",
}) as any as S.Schema<ContactPreference>;
export type EmailPreferenceList = ContactPreference[];
export const EmailPreferenceList = S.Array(ContactPreference);
export interface Address {
  Address1?: string;
  Address2?: string;
  Address3?: string;
  Address4?: string;
  City?: string;
  County?: string;
  State?: string;
  Province?: string;
  Country?: string;
  PostalCode?: string;
}
export const Address = S.suspend(() =>
  S.Struct({
    Address1: S.optional(S.String),
    Address2: S.optional(S.String),
    Address3: S.optional(S.String),
    Address4: S.optional(S.String),
    City: S.optional(S.String),
    County: S.optional(S.String),
    State: S.optional(S.String),
    Province: S.optional(S.String),
    Country: S.optional(S.String),
    PostalCode: S.optional(S.String),
  }),
).annotations({ identifier: "Address" }) as any as S.Schema<Address>;
export type Attributes = { [key: string]: string };
export const Attributes = S.Record({ key: S.String, value: S.String });
export type Values = string[];
export const Values = S.Array(S.String);
export interface ProfileDimension {
  DimensionType: string;
  Values: Values;
}
export const ProfileDimension = S.suspend(() =>
  S.Struct({
    DimensionType: S.String.pipe(T.JsonName("DimensionType")),
    Values: Values.pipe(T.JsonName("Values")),
  }),
).annotations({
  identifier: "ProfileDimension",
}) as any as S.Schema<ProfileDimension>;
export type ExtraLengthValues = string[];
export const ExtraLengthValues = S.Array(S.String);
export interface ExtraLengthValueProfileDimension {
  DimensionType: string;
  Values: ExtraLengthValues;
}
export const ExtraLengthValueProfileDimension = S.suspend(() =>
  S.Struct({
    DimensionType: S.String.pipe(T.JsonName("DimensionType")),
    Values: ExtraLengthValues.pipe(T.JsonName("Values")),
  }),
).annotations({
  identifier: "ExtraLengthValueProfileDimension",
}) as any as S.Schema<ExtraLengthValueProfileDimension>;
export type DateValues = string[];
export const DateValues = S.Array(S.String);
export interface DateDimension {
  DimensionType: string;
  Values: DateValues;
}
export const DateDimension = S.suspend(() =>
  S.Struct({
    DimensionType: S.String.pipe(T.JsonName("DimensionType")),
    Values: DateValues.pipe(T.JsonName("Values")),
  }),
).annotations({
  identifier: "DateDimension",
}) as any as S.Schema<DateDimension>;
export interface AddressDimension {
  City?: ProfileDimension;
  Country?: ProfileDimension;
  County?: ProfileDimension;
  PostalCode?: ProfileDimension;
  Province?: ProfileDimension;
  State?: ProfileDimension;
}
export const AddressDimension = S.suspend(() =>
  S.Struct({
    City: S.optional(ProfileDimension)
      .pipe(T.JsonName("City"))
      .annotations({ identifier: "ProfileDimension" }),
    Country: S.optional(ProfileDimension)
      .pipe(T.JsonName("Country"))
      .annotations({ identifier: "ProfileDimension" }),
    County: S.optional(ProfileDimension)
      .pipe(T.JsonName("County"))
      .annotations({ identifier: "ProfileDimension" }),
    PostalCode: S.optional(ProfileDimension)
      .pipe(T.JsonName("PostalCode"))
      .annotations({ identifier: "ProfileDimension" }),
    Province: S.optional(ProfileDimension)
      .pipe(T.JsonName("Province"))
      .annotations({ identifier: "ProfileDimension" }),
    State: S.optional(ProfileDimension)
      .pipe(T.JsonName("State"))
      .annotations({ identifier: "ProfileDimension" }),
  }),
).annotations({
  identifier: "AddressDimension",
}) as any as S.Schema<AddressDimension>;
export interface AttributeDimension {
  DimensionType: string;
  Values: Values;
}
export const AttributeDimension = S.suspend(() =>
  S.Struct({
    DimensionType: S.String.pipe(T.JsonName("DimensionType")),
    Values: Values.pipe(T.JsonName("Values")),
  }),
).annotations({
  identifier: "AttributeDimension",
}) as any as S.Schema<AttributeDimension>;
export type CustomAttributes = { [key: string]: AttributeDimension };
export const CustomAttributes = S.Record({
  key: S.String,
  value: AttributeDimension,
});
export type ProfileTypeValues = string[];
export const ProfileTypeValues = S.Array(S.String);
export interface ProfileTypeDimension {
  DimensionType: string;
  Values: ProfileTypeValues;
}
export const ProfileTypeDimension = S.suspend(() =>
  S.Struct({
    DimensionType: S.String.pipe(T.JsonName("DimensionType")),
    Values: ProfileTypeValues.pipe(T.JsonName("Values")),
  }),
).annotations({
  identifier: "ProfileTypeDimension",
}) as any as S.Schema<ProfileTypeDimension>;
export interface ProfileAttributes {
  AccountNumber?: ProfileDimension;
  AdditionalInformation?: ExtraLengthValueProfileDimension;
  FirstName?: ProfileDimension;
  LastName?: ProfileDimension;
  MiddleName?: ProfileDimension;
  GenderString?: ProfileDimension;
  PartyTypeString?: ProfileDimension;
  BirthDate?: DateDimension;
  PhoneNumber?: ProfileDimension;
  BusinessName?: ProfileDimension;
  BusinessPhoneNumber?: ProfileDimension;
  HomePhoneNumber?: ProfileDimension;
  MobilePhoneNumber?: ProfileDimension;
  EmailAddress?: ProfileDimension;
  PersonalEmailAddress?: ProfileDimension;
  BusinessEmailAddress?: ProfileDimension;
  Address?: AddressDimension;
  ShippingAddress?: AddressDimension;
  MailingAddress?: AddressDimension;
  BillingAddress?: AddressDimension;
  Attributes?: CustomAttributes;
  ProfileType?: ProfileTypeDimension;
}
export const ProfileAttributes = S.suspend(() =>
  S.Struct({
    AccountNumber: S.optional(ProfileDimension)
      .pipe(T.JsonName("AccountNumber"))
      .annotations({ identifier: "ProfileDimension" }),
    AdditionalInformation: S.optional(ExtraLengthValueProfileDimension)
      .pipe(T.JsonName("AdditionalInformation"))
      .annotations({ identifier: "ExtraLengthValueProfileDimension" }),
    FirstName: S.optional(ProfileDimension)
      .pipe(T.JsonName("FirstName"))
      .annotations({ identifier: "ProfileDimension" }),
    LastName: S.optional(ProfileDimension)
      .pipe(T.JsonName("LastName"))
      .annotations({ identifier: "ProfileDimension" }),
    MiddleName: S.optional(ProfileDimension)
      .pipe(T.JsonName("MiddleName"))
      .annotations({ identifier: "ProfileDimension" }),
    GenderString: S.optional(ProfileDimension)
      .pipe(T.JsonName("GenderString"))
      .annotations({ identifier: "ProfileDimension" }),
    PartyTypeString: S.optional(ProfileDimension)
      .pipe(T.JsonName("PartyTypeString"))
      .annotations({ identifier: "ProfileDimension" }),
    BirthDate: S.optional(DateDimension)
      .pipe(T.JsonName("BirthDate"))
      .annotations({ identifier: "DateDimension" }),
    PhoneNumber: S.optional(ProfileDimension)
      .pipe(T.JsonName("PhoneNumber"))
      .annotations({ identifier: "ProfileDimension" }),
    BusinessName: S.optional(ProfileDimension)
      .pipe(T.JsonName("BusinessName"))
      .annotations({ identifier: "ProfileDimension" }),
    BusinessPhoneNumber: S.optional(ProfileDimension)
      .pipe(T.JsonName("BusinessPhoneNumber"))
      .annotations({ identifier: "ProfileDimension" }),
    HomePhoneNumber: S.optional(ProfileDimension)
      .pipe(T.JsonName("HomePhoneNumber"))
      .annotations({ identifier: "ProfileDimension" }),
    MobilePhoneNumber: S.optional(ProfileDimension)
      .pipe(T.JsonName("MobilePhoneNumber"))
      .annotations({ identifier: "ProfileDimension" }),
    EmailAddress: S.optional(ProfileDimension)
      .pipe(T.JsonName("EmailAddress"))
      .annotations({ identifier: "ProfileDimension" }),
    PersonalEmailAddress: S.optional(ProfileDimension)
      .pipe(T.JsonName("PersonalEmailAddress"))
      .annotations({ identifier: "ProfileDimension" }),
    BusinessEmailAddress: S.optional(ProfileDimension)
      .pipe(T.JsonName("BusinessEmailAddress"))
      .annotations({ identifier: "ProfileDimension" }),
    Address: S.optional(AddressDimension)
      .pipe(T.JsonName("Address"))
      .annotations({ identifier: "AddressDimension" }),
    ShippingAddress: S.optional(AddressDimension)
      .pipe(T.JsonName("ShippingAddress"))
      .annotations({ identifier: "AddressDimension" }),
    MailingAddress: S.optional(AddressDimension)
      .pipe(T.JsonName("MailingAddress"))
      .annotations({ identifier: "AddressDimension" }),
    BillingAddress: S.optional(AddressDimension)
      .pipe(T.JsonName("BillingAddress"))
      .annotations({ identifier: "AddressDimension" }),
    Attributes: S.optional(CustomAttributes).pipe(T.JsonName("Attributes")),
    ProfileType: S.optional(ProfileTypeDimension)
      .pipe(T.JsonName("ProfileType"))
      .annotations({ identifier: "ProfileTypeDimension" }),
  }),
).annotations({
  identifier: "ProfileAttributes",
}) as any as S.Schema<ProfileAttributes>;
export interface RangeOverride {
  Start: number;
  End?: number;
  Unit: string;
}
export const RangeOverride = S.suspend(() =>
  S.Struct({ Start: S.Number, End: S.optional(S.Number), Unit: S.String }),
).annotations({
  identifier: "RangeOverride",
}) as any as S.Schema<RangeOverride>;
export interface ConditionOverrides {
  Range?: RangeOverride;
}
export const ConditionOverrides = S.suspend(() =>
  S.Struct({ Range: S.optional(RangeOverride) }),
).annotations({
  identifier: "ConditionOverrides",
}) as any as S.Schema<ConditionOverrides>;
export interface CalculatedAttributeDimension {
  DimensionType: string;
  Values: Values;
  ConditionOverrides?: ConditionOverrides;
}
export const CalculatedAttributeDimension = S.suspend(() =>
  S.Struct({
    DimensionType: S.String.pipe(T.JsonName("DimensionType")),
    Values: Values.pipe(T.JsonName("Values")),
    ConditionOverrides: S.optional(ConditionOverrides)
      .pipe(T.JsonName("ConditionOverrides"))
      .annotations({ identifier: "ConditionOverrides" }),
  }),
).annotations({
  identifier: "CalculatedAttributeDimension",
}) as any as S.Schema<CalculatedAttributeDimension>;
export type CalculatedCustomAttributes = {
  [key: string]: CalculatedAttributeDimension;
};
export const CalculatedCustomAttributes = S.Record({
  key: S.String,
  value: CalculatedAttributeDimension,
});
export type Dimension =
  | { ProfileAttributes: ProfileAttributes }
  | { CalculatedAttributes: CalculatedCustomAttributes };
export const Dimension = S.Union(
  S.Struct({
    ProfileAttributes: ProfileAttributes.pipe(
      T.JsonName("ProfileAttributes"),
    ).annotations({ identifier: "ProfileAttributes" }),
  }),
  S.Struct({
    CalculatedAttributes: CalculatedCustomAttributes.pipe(
      T.JsonName("CalculatedAttributes"),
    ),
  }),
);
export type DimensionList = (typeof Dimension)["Type"][];
export const DimensionList = S.Array(Dimension);
export interface SourceSegment {
  SegmentDefinitionName?: string;
}
export const SourceSegment = S.suspend(() =>
  S.Struct({
    SegmentDefinitionName: S.optional(S.String).pipe(
      T.JsonName("SegmentDefinitionName"),
    ),
  }),
).annotations({
  identifier: "SourceSegment",
}) as any as S.Schema<SourceSegment>;
export type SourceSegmentList = SourceSegment[];
export const SourceSegmentList = S.Array(SourceSegment);
export interface Group {
  Dimensions?: DimensionList;
  SourceSegments?: SourceSegmentList;
  SourceType?: string;
  Type?: string;
}
export const Group = S.suspend(() =>
  S.Struct({
    Dimensions: S.optional(DimensionList).pipe(T.JsonName("Dimensions")),
    SourceSegments: S.optional(SourceSegmentList).pipe(
      T.JsonName("SourceSegments"),
    ),
    SourceType: S.optional(S.String).pipe(T.JsonName("SourceType")),
    Type: S.optional(S.String).pipe(T.JsonName("Type")),
  }),
).annotations({ identifier: "Group" }) as any as S.Schema<Group>;
export type SegmentGroupList = Group[];
export const SegmentGroupList = S.Array(Group);
export interface SegmentGroupStructure {
  Groups?: SegmentGroupList;
  Include?: string;
}
export const SegmentGroupStructure = S.suspend(() =>
  S.Struct({
    Groups: S.optional(SegmentGroupList),
    Include: S.optional(S.String),
  }),
).annotations({
  identifier: "SegmentGroupStructure",
}) as any as S.Schema<SegmentGroupStructure>;
export type RecommenderContext = { [key: string]: string };
export const RecommenderContext = S.Record({ key: S.String, value: S.String });
export type ProfileIdList = string[];
export const ProfileIdList = S.Array(S.String);
export interface ObjectFilter {
  KeyName: string;
  Values: requestValueList;
}
export const ObjectFilter = S.suspend(() =>
  S.Struct({ KeyName: S.String, Values: requestValueList }),
).annotations({ identifier: "ObjectFilter" }) as any as S.Schema<ObjectFilter>;
export type MatchIdList = string[];
export const MatchIdList = S.Array(S.String);
export type ObjectTypeNames = { [key: string]: string };
export const ObjectTypeNames = S.Record({ key: S.String, value: S.String });
export interface AdditionalSearchKey {
  KeyName: string;
  Values: requestValueList;
}
export const AdditionalSearchKey = S.suspend(() =>
  S.Struct({ KeyName: S.String, Values: requestValueList }),
).annotations({
  identifier: "AdditionalSearchKey",
}) as any as S.Schema<AdditionalSearchKey>;
export type additionalSearchKeysList = AdditionalSearchKey[];
export const additionalSearchKeysList = S.Array(AdditionalSearchKey);
export interface UpdateAddress {
  Address1?: string;
  Address2?: string;
  Address3?: string;
  Address4?: string;
  City?: string;
  County?: string;
  State?: string;
  Province?: string;
  Country?: string;
  PostalCode?: string;
}
export const UpdateAddress = S.suspend(() =>
  S.Struct({
    Address1: S.optional(S.String),
    Address2: S.optional(S.String),
    Address3: S.optional(S.String),
    Address4: S.optional(S.String),
    City: S.optional(S.String),
    County: S.optional(S.String),
    State: S.optional(S.String),
    Province: S.optional(S.String),
    Country: S.optional(S.String),
    PostalCode: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateAddress",
}) as any as S.Schema<UpdateAddress>;
export type UpdateAttributes = { [key: string]: string };
export const UpdateAttributes = S.Record({ key: S.String, value: S.String });
export type SourceFields = string[];
export const SourceFields = S.Array(S.String);
export type StandardIdentifierList = string[];
export const StandardIdentifierList = S.Array(S.String);
export type FieldNameList = string[];
export const FieldNameList = S.Array(S.String);
export interface AddProfileKeyResponse {
  KeyName?: string;
  Values?: requestValueList;
}
export const AddProfileKeyResponse = S.suspend(() =>
  S.Struct({
    KeyName: S.optional(S.String),
    Values: S.optional(requestValueList),
  }),
).annotations({
  identifier: "AddProfileKeyResponse",
}) as any as S.Schema<AddProfileKeyResponse>;
export interface CreateDomainLayoutResponse {
  LayoutDefinitionName: string;
  Description: string | Redacted.Redacted<string>;
  DisplayName: string;
  IsDefault?: boolean;
  LayoutType: string;
  Layout: string | Redacted.Redacted<string>;
  Version: string;
  Tags?: TagMap;
  CreatedAt: Date;
  LastUpdatedAt?: Date;
}
export const CreateDomainLayoutResponse = S.suspend(() =>
  S.Struct({
    LayoutDefinitionName: S.String,
    Description: SensitiveString,
    DisplayName: S.String,
    IsDefault: S.optional(S.Boolean),
    LayoutType: S.String,
    Layout: SensitiveString,
    Version: S.String,
    Tags: S.optional(TagMap),
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CreateDomainLayoutResponse",
}) as any as S.Schema<CreateDomainLayoutResponse>;
export interface CreateEventStreamResponse {
  EventStreamArn: string;
  Tags?: TagMap;
}
export const CreateEventStreamResponse = S.suspend(() =>
  S.Struct({ EventStreamArn: S.String, Tags: S.optional(TagMap) }),
).annotations({
  identifier: "CreateEventStreamResponse",
}) as any as S.Schema<CreateEventStreamResponse>;
export interface CreateSegmentEstimateRequest {
  DomainName: string;
  SegmentQuery?: SegmentGroupStructure;
  SegmentSqlQuery?: string | Redacted.Redacted<string>;
}
export const CreateSegmentEstimateRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    SegmentQuery: S.optional(SegmentGroupStructure),
    SegmentSqlQuery: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/segment-estimates",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSegmentEstimateRequest",
}) as any as S.Schema<CreateSegmentEstimateRequest>;
export interface CreateSegmentSnapshotResponse {
  SnapshotId: string;
}
export const CreateSegmentSnapshotResponse = S.suspend(() =>
  S.Struct({ SnapshotId: S.String }),
).annotations({
  identifier: "CreateSegmentSnapshotResponse",
}) as any as S.Schema<CreateSegmentSnapshotResponse>;
export interface DeleteDomainResponse {
  Message: string;
}
export const DeleteDomainResponse = S.suspend(() =>
  S.Struct({ Message: S.String }),
).annotations({
  identifier: "DeleteDomainResponse",
}) as any as S.Schema<DeleteDomainResponse>;
export interface DeleteDomainLayoutResponse {
  Message: string;
}
export const DeleteDomainLayoutResponse = S.suspend(() =>
  S.Struct({ Message: S.String }),
).annotations({
  identifier: "DeleteDomainLayoutResponse",
}) as any as S.Schema<DeleteDomainLayoutResponse>;
export interface DeleteEventTriggerResponse {
  Message: string;
}
export const DeleteEventTriggerResponse = S.suspend(() =>
  S.Struct({ Message: S.String }),
).annotations({
  identifier: "DeleteEventTriggerResponse",
}) as any as S.Schema<DeleteEventTriggerResponse>;
export interface DeleteIntegrationResponse {
  Message: string;
}
export const DeleteIntegrationResponse = S.suspend(() =>
  S.Struct({ Message: S.String }),
).annotations({
  identifier: "DeleteIntegrationResponse",
}) as any as S.Schema<DeleteIntegrationResponse>;
export interface DeleteProfileResponse {
  Message?: string;
}
export const DeleteProfileResponse = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String) }),
).annotations({
  identifier: "DeleteProfileResponse",
}) as any as S.Schema<DeleteProfileResponse>;
export interface DeleteProfileKeyResponse {
  Message?: string;
}
export const DeleteProfileKeyResponse = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String) }),
).annotations({
  identifier: "DeleteProfileKeyResponse",
}) as any as S.Schema<DeleteProfileKeyResponse>;
export interface DeleteProfileObjectResponse {
  Message?: string;
}
export const DeleteProfileObjectResponse = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String) }),
).annotations({
  identifier: "DeleteProfileObjectResponse",
}) as any as S.Schema<DeleteProfileObjectResponse>;
export interface DeleteProfileObjectTypeResponse {
  Message: string;
}
export const DeleteProfileObjectTypeResponse = S.suspend(() =>
  S.Struct({ Message: S.String }),
).annotations({
  identifier: "DeleteProfileObjectTypeResponse",
}) as any as S.Schema<DeleteProfileObjectTypeResponse>;
export interface DeleteSegmentDefinitionResponse {
  Message?: string;
}
export const DeleteSegmentDefinitionResponse = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String).pipe(T.JsonName("Message")) }),
).annotations({
  identifier: "DeleteSegmentDefinitionResponse",
}) as any as S.Schema<DeleteSegmentDefinitionResponse>;
export interface GetAutoMergingPreviewRequest {
  DomainName: string;
  Consolidation: Consolidation;
  ConflictResolution: ConflictResolution;
  MinAllowedConfidenceScoreForMerging?: number;
}
export const GetAutoMergingPreviewRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Consolidation: Consolidation,
    ConflictResolution: ConflictResolution,
    MinAllowedConfidenceScoreForMerging: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/identity-resolution-jobs/auto-merging-preview",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAutoMergingPreviewRequest",
}) as any as S.Schema<GetAutoMergingPreviewRequest>;
export interface GetCalculatedAttributeForProfileResponse {
  CalculatedAttributeName?: string;
  DisplayName?: string;
  IsDataPartial?: string;
  Value?: string;
  LastObjectTimestamp?: Date;
}
export const GetCalculatedAttributeForProfileResponse = S.suspend(() =>
  S.Struct({
    CalculatedAttributeName: S.optional(S.String),
    DisplayName: S.optional(S.String),
    IsDataPartial: S.optional(S.String),
    Value: S.optional(S.String),
    LastObjectTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "GetCalculatedAttributeForProfileResponse",
}) as any as S.Schema<GetCalculatedAttributeForProfileResponse>;
export interface GetDomainLayoutResponse {
  LayoutDefinitionName: string;
  Description: string | Redacted.Redacted<string>;
  DisplayName: string;
  IsDefault?: boolean;
  LayoutType: string;
  Layout: string | Redacted.Redacted<string>;
  Version: string;
  CreatedAt: Date;
  LastUpdatedAt: Date;
  Tags?: TagMap;
}
export const GetDomainLayoutResponse = S.suspend(() =>
  S.Struct({
    LayoutDefinitionName: S.String,
    Description: SensitiveString,
    DisplayName: S.String,
    IsDefault: S.optional(S.Boolean),
    LayoutType: S.String,
    Layout: SensitiveString,
    Version: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetDomainLayoutResponse",
}) as any as S.Schema<GetDomainLayoutResponse>;
export interface DomainObjectTypeField {
  Source: string;
  Target: string;
  ContentType?: string;
  FeatureType?: string;
}
export const DomainObjectTypeField = S.suspend(() =>
  S.Struct({
    Source: S.String,
    Target: S.String,
    ContentType: S.optional(S.String),
    FeatureType: S.optional(S.String),
  }),
).annotations({
  identifier: "DomainObjectTypeField",
}) as any as S.Schema<DomainObjectTypeField>;
export type DomainObjectTypeFields = { [key: string]: DomainObjectTypeField };
export const DomainObjectTypeFields = S.Record({
  key: S.String,
  value: DomainObjectTypeField,
});
export interface GetDomainObjectTypeResponse {
  ObjectTypeName: string;
  Description?: string | Redacted.Redacted<string>;
  EncryptionKey?: string;
  Fields?: DomainObjectTypeFields;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  Tags?: TagMap;
}
export const GetDomainObjectTypeResponse = S.suspend(() =>
  S.Struct({
    ObjectTypeName: S.String,
    Description: S.optional(SensitiveString),
    EncryptionKey: S.optional(S.String),
    Fields: S.optional(DomainObjectTypeFields),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetDomainObjectTypeResponse",
}) as any as S.Schema<GetDomainObjectTypeResponse>;
export interface GetEventTriggerResponse {
  EventTriggerName?: string;
  ObjectTypeName?: string;
  Description?: string | Redacted.Redacted<string>;
  EventTriggerConditions?: EventTriggerConditions;
  SegmentFilter?: string;
  EventTriggerLimits?: EventTriggerLimits;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  Tags?: TagMap;
}
export const GetEventTriggerResponse = S.suspend(() =>
  S.Struct({
    EventTriggerName: S.optional(S.String),
    ObjectTypeName: S.optional(S.String),
    Description: S.optional(SensitiveString),
    EventTriggerConditions: S.optional(EventTriggerConditions),
    SegmentFilter: S.optional(S.String),
    EventTriggerLimits: S.optional(EventTriggerLimits),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetEventTriggerResponse",
}) as any as S.Schema<GetEventTriggerResponse>;
export interface GetIntegrationResponse {
  DomainName: string;
  Uri: string;
  ObjectTypeName?: string;
  CreatedAt: Date;
  LastUpdatedAt: Date;
  Tags?: TagMap;
  ObjectTypeNames?: ObjectTypeNames;
  WorkflowId?: string;
  IsUnstructured?: boolean;
  RoleArn?: string;
  EventTriggerNames?: EventTriggerNames;
  Scope?: string;
}
export const GetIntegrationResponse = S.suspend(() =>
  S.Struct({
    DomainName: S.String,
    Uri: S.String,
    ObjectTypeName: S.optional(S.String),
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Tags: S.optional(TagMap),
    ObjectTypeNames: S.optional(ObjectTypeNames),
    WorkflowId: S.optional(S.String),
    IsUnstructured: S.optional(S.Boolean),
    RoleArn: S.optional(S.String),
    EventTriggerNames: S.optional(EventTriggerNames),
    Scope: S.optional(S.String),
  }),
).annotations({
  identifier: "GetIntegrationResponse",
}) as any as S.Schema<GetIntegrationResponse>;
export interface GetProfileHistoryRecordResponse {
  Id: string;
  ObjectTypeName: string;
  CreatedAt: Date;
  LastUpdatedAt?: Date;
  ActionType: string;
  ProfileObjectUniqueKey?: string;
  Content?: string | Redacted.Redacted<string>;
  PerformedBy?: string;
}
export const GetProfileHistoryRecordResponse = S.suspend(() =>
  S.Struct({
    Id: S.String,
    ObjectTypeName: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ActionType: S.String,
    ProfileObjectUniqueKey: S.optional(S.String),
    Content: S.optional(SensitiveString),
    PerformedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "GetProfileHistoryRecordResponse",
}) as any as S.Schema<GetProfileHistoryRecordResponse>;
export interface ObjectTypeField {
  Source?: string;
  Target?: string;
  ContentType?: string;
}
export const ObjectTypeField = S.suspend(() =>
  S.Struct({
    Source: S.optional(S.String),
    Target: S.optional(S.String),
    ContentType: S.optional(S.String),
  }),
).annotations({
  identifier: "ObjectTypeField",
}) as any as S.Schema<ObjectTypeField>;
export type FieldMap = { [key: string]: ObjectTypeField };
export const FieldMap = S.Record({ key: S.String, value: ObjectTypeField });
export interface ObjectTypeKey {
  StandardIdentifiers?: StandardIdentifierList;
  FieldNames?: FieldNameList;
}
export const ObjectTypeKey = S.suspend(() =>
  S.Struct({
    StandardIdentifiers: S.optional(StandardIdentifierList),
    FieldNames: S.optional(FieldNameList),
  }),
).annotations({
  identifier: "ObjectTypeKey",
}) as any as S.Schema<ObjectTypeKey>;
export type ObjectTypeKeyList = ObjectTypeKey[];
export const ObjectTypeKeyList = S.Array(ObjectTypeKey);
export type KeyMap = { [key: string]: ObjectTypeKeyList };
export const KeyMap = S.Record({ key: S.String, value: ObjectTypeKeyList });
export interface GetProfileObjectTypeResponse {
  ObjectTypeName: string;
  Description: string | Redacted.Redacted<string>;
  TemplateId?: string;
  ExpirationDays?: number;
  EncryptionKey?: string;
  AllowProfileCreation?: boolean;
  SourceLastUpdatedTimestampFormat?: string;
  MaxAvailableProfileObjectCount?: number;
  MaxProfileObjectCount?: number;
  Fields?: FieldMap;
  Keys?: KeyMap;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  Tags?: TagMap;
}
export const GetProfileObjectTypeResponse = S.suspend(() =>
  S.Struct({
    ObjectTypeName: S.String,
    Description: SensitiveString,
    TemplateId: S.optional(S.String),
    ExpirationDays: S.optional(S.Number),
    EncryptionKey: S.optional(S.String),
    AllowProfileCreation: S.optional(S.Boolean),
    SourceLastUpdatedTimestampFormat: S.optional(S.String),
    MaxAvailableProfileObjectCount: S.optional(S.Number),
    MaxProfileObjectCount: S.optional(S.Number),
    Fields: S.optional(FieldMap),
    Keys: S.optional(KeyMap),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetProfileObjectTypeResponse",
}) as any as S.Schema<GetProfileObjectTypeResponse>;
export interface GetProfileObjectTypeTemplateResponse {
  TemplateId?: string;
  SourceName?: string;
  SourceObject?: string;
  AllowProfileCreation?: boolean;
  SourceLastUpdatedTimestampFormat?: string;
  Fields?: FieldMap;
  Keys?: KeyMap;
}
export const GetProfileObjectTypeTemplateResponse = S.suspend(() =>
  S.Struct({
    TemplateId: S.optional(S.String),
    SourceName: S.optional(S.String),
    SourceObject: S.optional(S.String),
    AllowProfileCreation: S.optional(S.Boolean),
    SourceLastUpdatedTimestampFormat: S.optional(S.String),
    Fields: S.optional(FieldMap),
    Keys: S.optional(KeyMap),
  }),
).annotations({
  identifier: "GetProfileObjectTypeTemplateResponse",
}) as any as S.Schema<GetProfileObjectTypeTemplateResponse>;
export interface GetProfileRecommendationsRequest {
  DomainName: string;
  ProfileId: string;
  RecommenderName: string;
  Context?: RecommenderContext;
  MaxResults?: number;
}
export const GetProfileRecommendationsRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ProfileId: S.String.pipe(T.HttpLabel("ProfileId")),
    RecommenderName: S.String,
    Context: S.optional(RecommenderContext),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/profiles/{ProfileId}/recommendations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProfileRecommendationsRequest",
}) as any as S.Schema<GetProfileRecommendationsRequest>;
export interface SegmentGroup {
  Groups?: SegmentGroupList;
  Include?: string;
}
export const SegmentGroup = S.suspend(() =>
  S.Struct({
    Groups: S.optional(SegmentGroupList).pipe(T.JsonName("Groups")),
    Include: S.optional(S.String).pipe(T.JsonName("Include")),
  }),
).annotations({ identifier: "SegmentGroup" }) as any as S.Schema<SegmentGroup>;
export interface GetSegmentDefinitionResponse {
  SegmentDefinitionName?: string;
  DisplayName?: string;
  Description?: string | Redacted.Redacted<string>;
  SegmentGroups?: SegmentGroup;
  SegmentDefinitionArn: string;
  CreatedAt?: Date;
  Tags?: TagMap;
  SegmentSqlQuery?: string | Redacted.Redacted<string>;
  SegmentType?: string;
}
export const GetSegmentDefinitionResponse = S.suspend(() =>
  S.Struct({
    SegmentDefinitionName: S.optional(S.String).pipe(
      T.JsonName("SegmentDefinitionName"),
    ),
    DisplayName: S.optional(S.String).pipe(T.JsonName("DisplayName")),
    Description: S.optional(SensitiveString).pipe(T.JsonName("Description")),
    SegmentGroups: S.optional(SegmentGroup)
      .pipe(T.JsonName("SegmentGroups"))
      .annotations({ identifier: "SegmentGroup" }),
    SegmentDefinitionArn: S.String.pipe(T.JsonName("SegmentDefinitionArn")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("CreatedAt"),
    ),
    Tags: S.optional(TagMap).pipe(T.JsonName("Tags")),
    SegmentSqlQuery: S.optional(SensitiveString).pipe(
      T.JsonName("SegmentSqlQuery"),
    ),
    SegmentType: S.optional(S.String).pipe(T.JsonName("SegmentType")),
  }),
).annotations({
  identifier: "GetSegmentDefinitionResponse",
}) as any as S.Schema<GetSegmentDefinitionResponse>;
export interface GetSegmentEstimateResponse {
  DomainName?: string;
  EstimateId?: string;
  Status?: string;
  Estimate?: string;
  Message?: string;
  StatusCode?: number;
}
export const GetSegmentEstimateResponse = S.suspend(() =>
  S.Struct({
    DomainName: S.optional(S.String),
    EstimateId: S.optional(S.String),
    Status: S.optional(S.String),
    Estimate: S.optional(S.String),
    Message: S.optional(S.String),
    StatusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
  }),
).annotations({
  identifier: "GetSegmentEstimateResponse",
}) as any as S.Schema<GetSegmentEstimateResponse>;
export interface GetSegmentSnapshotResponse {
  SnapshotId: string;
  Status: string;
  StatusMessage?: string;
  DataFormat: string;
  EncryptionKey?: string;
  RoleArn?: string;
  DestinationUri?: string;
}
export const GetSegmentSnapshotResponse = S.suspend(() =>
  S.Struct({
    SnapshotId: S.String,
    Status: S.String,
    StatusMessage: S.optional(S.String),
    DataFormat: S.String,
    EncryptionKey: S.optional(S.String),
    RoleArn: S.optional(S.String),
    DestinationUri: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSegmentSnapshotResponse",
}) as any as S.Schema<GetSegmentSnapshotResponse>;
export interface GetSimilarProfilesResponse {
  ProfileIds?: ProfileIdList;
  MatchId?: string;
  MatchType?: string;
  RuleLevel?: number;
  ConfidenceScore?: number;
  NextToken?: string;
}
export const GetSimilarProfilesResponse = S.suspend(() =>
  S.Struct({
    ProfileIds: S.optional(ProfileIdList),
    MatchId: S.optional(S.String),
    MatchType: S.optional(S.String),
    RuleLevel: S.optional(S.Number),
    ConfidenceScore: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSimilarProfilesResponse",
}) as any as S.Schema<GetSimilarProfilesResponse>;
export interface GetUploadJobPathResponse {
  Url: string;
  ClientToken?: string;
  ValidUntil?: Date;
}
export const GetUploadJobPathResponse = S.suspend(() =>
  S.Struct({
    Url: S.String.pipe(T.JsonName("Url")),
    ClientToken: S.optional(S.String).pipe(T.JsonName("ClientToken")),
    ValidUntil: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("ValidUntil")),
  }),
).annotations({
  identifier: "GetUploadJobPathResponse",
}) as any as S.Schema<GetUploadJobPathResponse>;
export interface ListIntegrationItem {
  DomainName: string;
  Uri: string;
  ObjectTypeName?: string;
  CreatedAt: Date;
  LastUpdatedAt: Date;
  Tags?: TagMap;
  ObjectTypeNames?: ObjectTypeNames;
  WorkflowId?: string;
  IsUnstructured?: boolean;
  RoleArn?: string;
  EventTriggerNames?: EventTriggerNames;
  Scope?: string;
}
export const ListIntegrationItem = S.suspend(() =>
  S.Struct({
    DomainName: S.String,
    Uri: S.String,
    ObjectTypeName: S.optional(S.String),
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Tags: S.optional(TagMap),
    ObjectTypeNames: S.optional(ObjectTypeNames),
    WorkflowId: S.optional(S.String),
    IsUnstructured: S.optional(S.Boolean),
    RoleArn: S.optional(S.String),
    EventTriggerNames: S.optional(EventTriggerNames),
    Scope: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIntegrationItem",
}) as any as S.Schema<ListIntegrationItem>;
export type IntegrationList = ListIntegrationItem[];
export const IntegrationList = S.Array(ListIntegrationItem);
export interface ListIntegrationsResponse {
  Items?: IntegrationList;
  NextToken?: string;
}
export const ListIntegrationsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(IntegrationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIntegrationsResponse",
}) as any as S.Schema<ListIntegrationsResponse>;
export interface ListProfileObjectsRequest {
  NextToken?: string;
  MaxResults?: number;
  DomainName: string;
  ObjectTypeName: string;
  ProfileId: string;
  ObjectFilter?: ObjectFilter;
}
export const ListProfileObjectsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ObjectTypeName: S.String,
    ProfileId: S.String,
    ObjectFilter: S.optional(ObjectFilter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{DomainName}/profiles/objects" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProfileObjectsRequest",
}) as any as S.Schema<ListProfileObjectsRequest>;
export interface ListRuleBasedMatchesResponse {
  MatchIds?: MatchIdList;
  NextToken?: string;
}
export const ListRuleBasedMatchesResponse = S.suspend(() =>
  S.Struct({
    MatchIds: S.optional(MatchIdList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRuleBasedMatchesResponse",
}) as any as S.Schema<ListRuleBasedMatchesResponse>;
export interface ListTagsForResourceResponse {
  tags?: TagMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutProfileObjectResponse {
  ProfileObjectUniqueKey?: string;
}
export const PutProfileObjectResponse = S.suspend(() =>
  S.Struct({ ProfileObjectUniqueKey: S.optional(S.String) }),
).annotations({
  identifier: "PutProfileObjectResponse",
}) as any as S.Schema<PutProfileObjectResponse>;
export interface SearchProfilesRequest {
  NextToken?: string;
  MaxResults?: number;
  DomainName: string;
  KeyName: string;
  Values: requestValueList;
  AdditionalSearchKeys?: additionalSearchKeysList;
  LogicalOperator?: string;
}
export const SearchProfilesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    KeyName: S.String,
    Values: requestValueList,
    AdditionalSearchKeys: S.optional(additionalSearchKeysList),
    LogicalOperator: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{DomainName}/profiles/search" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchProfilesRequest",
}) as any as S.Schema<SearchProfilesRequest>;
export interface AttributeItem {
  Name: string;
}
export const AttributeItem = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "AttributeItem",
}) as any as S.Schema<AttributeItem>;
export type AttributeList = AttributeItem[];
export const AttributeList = S.Array(AttributeItem);
export interface AttributeDetails {
  Attributes: AttributeList;
  Expression: string;
}
export const AttributeDetails = S.suspend(() =>
  S.Struct({ Attributes: AttributeList, Expression: S.String }),
).annotations({
  identifier: "AttributeDetails",
}) as any as S.Schema<AttributeDetails>;
export interface Readiness {
  ProgressPercentage?: number;
  Message?: string;
}
export const Readiness = S.suspend(() =>
  S.Struct({
    ProgressPercentage: S.optional(S.Number),
    Message: S.optional(S.String),
  }),
).annotations({ identifier: "Readiness" }) as any as S.Schema<Readiness>;
export interface UpdateCalculatedAttributeDefinitionResponse {
  CalculatedAttributeName?: string;
  DisplayName?: string;
  Description?: string | Redacted.Redacted<string>;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  Statistic?: string;
  Conditions?: Conditions;
  AttributeDetails?: AttributeDetails;
  UseHistoricalData?: boolean;
  Status?: string;
  Readiness?: Readiness;
  Tags?: TagMap;
}
export const UpdateCalculatedAttributeDefinitionResponse = S.suspend(() =>
  S.Struct({
    CalculatedAttributeName: S.optional(S.String),
    DisplayName: S.optional(S.String),
    Description: S.optional(SensitiveString),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Statistic: S.optional(S.String),
    Conditions: S.optional(Conditions),
    AttributeDetails: S.optional(AttributeDetails),
    UseHistoricalData: S.optional(S.Boolean),
    Status: S.optional(S.String),
    Readiness: S.optional(Readiness),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "UpdateCalculatedAttributeDefinitionResponse",
}) as any as S.Schema<UpdateCalculatedAttributeDefinitionResponse>;
export interface MatchingResponse {
  Enabled?: boolean;
  JobSchedule?: JobSchedule;
  AutoMerging?: AutoMerging;
  ExportingConfig?: ExportingConfig;
}
export const MatchingResponse = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    JobSchedule: S.optional(JobSchedule),
    AutoMerging: S.optional(AutoMerging),
    ExportingConfig: S.optional(ExportingConfig),
  }),
).annotations({
  identifier: "MatchingResponse",
}) as any as S.Schema<MatchingResponse>;
export interface RuleBasedMatchingResponse {
  Enabled?: boolean;
  MatchingRules?: MatchingRules;
  Status?: string;
  MaxAllowedRuleLevelForMerging?: number;
  MaxAllowedRuleLevelForMatching?: number;
  AttributeTypesSelector?: AttributeTypesSelector;
  ConflictResolution?: ConflictResolution;
  ExportingConfig?: ExportingConfig;
}
export const RuleBasedMatchingResponse = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    MatchingRules: S.optional(MatchingRules),
    Status: S.optional(S.String),
    MaxAllowedRuleLevelForMerging: S.optional(S.Number),
    MaxAllowedRuleLevelForMatching: S.optional(S.Number),
    AttributeTypesSelector: S.optional(AttributeTypesSelector),
    ConflictResolution: S.optional(ConflictResolution),
    ExportingConfig: S.optional(ExportingConfig),
  }),
).annotations({
  identifier: "RuleBasedMatchingResponse",
}) as any as S.Schema<RuleBasedMatchingResponse>;
export interface DataStoreResponse {
  Enabled?: boolean;
  Readiness?: Readiness;
}
export const DataStoreResponse = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    Readiness: S.optional(Readiness),
  }),
).annotations({
  identifier: "DataStoreResponse",
}) as any as S.Schema<DataStoreResponse>;
export interface UpdateDomainResponse {
  DomainName: string;
  DefaultExpirationDays?: number;
  DefaultEncryptionKey?: string;
  DeadLetterQueueUrl?: string;
  Matching?: MatchingResponse;
  RuleBasedMatching?: RuleBasedMatchingResponse;
  DataStore?: DataStoreResponse;
  CreatedAt: Date;
  LastUpdatedAt: Date;
  Tags?: TagMap;
}
export const UpdateDomainResponse = S.suspend(() =>
  S.Struct({
    DomainName: S.String,
    DefaultExpirationDays: S.optional(S.Number),
    DefaultEncryptionKey: S.optional(S.String),
    DeadLetterQueueUrl: S.optional(S.String),
    Matching: S.optional(MatchingResponse),
    RuleBasedMatching: S.optional(RuleBasedMatchingResponse),
    DataStore: S.optional(DataStoreResponse),
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "UpdateDomainResponse",
}) as any as S.Schema<UpdateDomainResponse>;
export interface UpdateDomainLayoutResponse {
  LayoutDefinitionName?: string;
  Description?: string | Redacted.Redacted<string>;
  DisplayName?: string;
  IsDefault?: boolean;
  LayoutType?: string;
  Layout?: string | Redacted.Redacted<string>;
  Version?: string;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  Tags?: TagMap;
}
export const UpdateDomainLayoutResponse = S.suspend(() =>
  S.Struct({
    LayoutDefinitionName: S.optional(S.String),
    Description: S.optional(SensitiveString),
    DisplayName: S.optional(S.String),
    IsDefault: S.optional(S.Boolean),
    LayoutType: S.optional(S.String),
    Layout: S.optional(SensitiveString),
    Version: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "UpdateDomainLayoutResponse",
}) as any as S.Schema<UpdateDomainLayoutResponse>;
export interface UpdateEventTriggerResponse {
  EventTriggerName?: string;
  ObjectTypeName?: string;
  Description?: string | Redacted.Redacted<string>;
  EventTriggerConditions?: EventTriggerConditions;
  SegmentFilter?: string;
  EventTriggerLimits?: EventTriggerLimits;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  Tags?: TagMap;
}
export const UpdateEventTriggerResponse = S.suspend(() =>
  S.Struct({
    EventTriggerName: S.optional(S.String),
    ObjectTypeName: S.optional(S.String),
    Description: S.optional(SensitiveString),
    EventTriggerConditions: S.optional(EventTriggerConditions),
    SegmentFilter: S.optional(S.String),
    EventTriggerLimits: S.optional(EventTriggerLimits),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "UpdateEventTriggerResponse",
}) as any as S.Schema<UpdateEventTriggerResponse>;
export type PhonePreferenceList = ContactPreference[];
export const PhonePreferenceList = S.Array(ContactPreference);
export interface EngagementPreferences {
  Phone?: PhonePreferenceList;
  Email?: EmailPreferenceList;
}
export const EngagementPreferences = S.suspend(() =>
  S.Struct({
    Phone: S.optional(PhonePreferenceList),
    Email: S.optional(EmailPreferenceList),
  }),
).annotations({
  identifier: "EngagementPreferences",
}) as any as S.Schema<EngagementPreferences>;
export interface UpdateProfileRequest {
  DomainName: string;
  ProfileId: string;
  AdditionalInformation?: string | Redacted.Redacted<string>;
  AccountNumber?: string | Redacted.Redacted<string>;
  PartyType?: string;
  BusinessName?: string | Redacted.Redacted<string>;
  FirstName?: string | Redacted.Redacted<string>;
  MiddleName?: string | Redacted.Redacted<string>;
  LastName?: string | Redacted.Redacted<string>;
  BirthDate?: string | Redacted.Redacted<string>;
  Gender?: string;
  PhoneNumber?: string | Redacted.Redacted<string>;
  MobilePhoneNumber?: string | Redacted.Redacted<string>;
  HomePhoneNumber?: string | Redacted.Redacted<string>;
  BusinessPhoneNumber?: string | Redacted.Redacted<string>;
  EmailAddress?: string | Redacted.Redacted<string>;
  PersonalEmailAddress?: string | Redacted.Redacted<string>;
  BusinessEmailAddress?: string | Redacted.Redacted<string>;
  Address?: UpdateAddress;
  ShippingAddress?: UpdateAddress;
  MailingAddress?: UpdateAddress;
  BillingAddress?: UpdateAddress;
  Attributes?: UpdateAttributes;
  PartyTypeString?: string | Redacted.Redacted<string>;
  GenderString?: string | Redacted.Redacted<string>;
  ProfileType?: string;
  EngagementPreferences?: EngagementPreferences;
}
export const UpdateProfileRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ProfileId: S.String,
    AdditionalInformation: S.optional(SensitiveString),
    AccountNumber: S.optional(SensitiveString),
    PartyType: S.optional(S.String),
    BusinessName: S.optional(SensitiveString),
    FirstName: S.optional(SensitiveString),
    MiddleName: S.optional(SensitiveString),
    LastName: S.optional(SensitiveString),
    BirthDate: S.optional(SensitiveString),
    Gender: S.optional(S.String),
    PhoneNumber: S.optional(SensitiveString),
    MobilePhoneNumber: S.optional(SensitiveString),
    HomePhoneNumber: S.optional(SensitiveString),
    BusinessPhoneNumber: S.optional(SensitiveString),
    EmailAddress: S.optional(SensitiveString),
    PersonalEmailAddress: S.optional(SensitiveString),
    BusinessEmailAddress: S.optional(SensitiveString),
    Address: S.optional(UpdateAddress),
    ShippingAddress: S.optional(UpdateAddress),
    MailingAddress: S.optional(UpdateAddress),
    BillingAddress: S.optional(UpdateAddress),
    Attributes: S.optional(UpdateAttributes),
    PartyTypeString: S.optional(SensitiveString),
    GenderString: S.optional(SensitiveString),
    ProfileType: S.optional(S.String),
    EngagementPreferences: S.optional(EngagementPreferences),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/domains/{DomainName}/profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProfileRequest",
}) as any as S.Schema<UpdateProfileRequest>;
export interface UpdateRecommenderResponse {
  RecommenderName: string;
}
export const UpdateRecommenderResponse = S.suspend(() =>
  S.Struct({ RecommenderName: S.String }),
).annotations({
  identifier: "UpdateRecommenderResponse",
}) as any as S.Schema<UpdateRecommenderResponse>;
export type AttributeSourceIdMap = { [key: string]: string };
export const AttributeSourceIdMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface BatchGetProfileError {
  Code: string;
  Message: string;
  ProfileId: string;
}
export const BatchGetProfileError = S.suspend(() =>
  S.Struct({ Code: S.String, Message: S.String, ProfileId: S.String }),
).annotations({
  identifier: "BatchGetProfileError",
}) as any as S.Schema<BatchGetProfileError>;
export type BatchGetProfileErrorList = BatchGetProfileError[];
export const BatchGetProfileErrorList = S.Array(BatchGetProfileError);
export interface DetectedProfileObjectType {
  SourceLastUpdatedTimestampFormat?: string;
  Fields?: FieldMap;
  Keys?: KeyMap;
}
export const DetectedProfileObjectType = S.suspend(() =>
  S.Struct({
    SourceLastUpdatedTimestampFormat: S.optional(S.String),
    Fields: S.optional(FieldMap),
    Keys: S.optional(KeyMap),
  }),
).annotations({
  identifier: "DetectedProfileObjectType",
}) as any as S.Schema<DetectedProfileObjectType>;
export type DetectedProfileObjectTypes = DetectedProfileObjectType[];
export const DetectedProfileObjectTypes = S.Array(DetectedProfileObjectType);
export interface DomainStats {
  ProfileCount?: number;
  MeteringProfileCount?: number;
  ObjectCount?: number;
  TotalSize?: number;
}
export const DomainStats = S.suspend(() =>
  S.Struct({
    ProfileCount: S.optional(S.Number),
    MeteringProfileCount: S.optional(S.Number),
    ObjectCount: S.optional(S.Number),
    TotalSize: S.optional(S.Number),
  }),
).annotations({ identifier: "DomainStats" }) as any as S.Schema<DomainStats>;
export interface EventStreamDestinationDetails {
  Uri: string;
  Status: string;
  UnhealthySince?: Date;
  Message?: string;
}
export const EventStreamDestinationDetails = S.suspend(() =>
  S.Struct({
    Uri: S.String,
    Status: S.String,
    UnhealthySince: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "EventStreamDestinationDetails",
}) as any as S.Schema<EventStreamDestinationDetails>;
export interface JobStats {
  NumberOfProfilesReviewed?: number;
  NumberOfMatchesFound?: number;
  NumberOfMergesDone?: number;
}
export const JobStats = S.suspend(() =>
  S.Struct({
    NumberOfProfilesReviewed: S.optional(S.Number),
    NumberOfMatchesFound: S.optional(S.Number),
    NumberOfMergesDone: S.optional(S.Number),
  }),
).annotations({ identifier: "JobStats" }) as any as S.Schema<JobStats>;
export interface MatchItem {
  MatchId?: string;
  ProfileIds?: ProfileIdList;
  ConfidenceScore?: number;
}
export const MatchItem = S.suspend(() =>
  S.Struct({
    MatchId: S.optional(S.String),
    ProfileIds: S.optional(ProfileIdList),
    ConfidenceScore: S.optional(S.Number),
  }),
).annotations({ identifier: "MatchItem" }) as any as S.Schema<MatchItem>;
export type MatchesList = MatchItem[];
export const MatchesList = S.Array(MatchItem);
export interface RecommenderUpdate {
  RecommenderConfig?: RecommenderConfig;
  Status?: string;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  FailureReason?: string;
}
export const RecommenderUpdate = S.suspend(() =>
  S.Struct({
    RecommenderConfig: S.optional(RecommenderConfig),
    Status: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FailureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "RecommenderUpdate",
}) as any as S.Schema<RecommenderUpdate>;
export interface FoundByKeyValue {
  KeyName?: string;
  Values?: requestValueList;
}
export const FoundByKeyValue = S.suspend(() =>
  S.Struct({
    KeyName: S.optional(S.String),
    Values: S.optional(requestValueList),
  }),
).annotations({
  identifier: "FoundByKeyValue",
}) as any as S.Schema<FoundByKeyValue>;
export type foundByList = FoundByKeyValue[];
export const foundByList = S.Array(FoundByKeyValue);
export interface Profile {
  ProfileId?: string;
  AccountNumber?: string | Redacted.Redacted<string>;
  AdditionalInformation?: string | Redacted.Redacted<string>;
  PartyType?: string;
  BusinessName?: string | Redacted.Redacted<string>;
  FirstName?: string | Redacted.Redacted<string>;
  MiddleName?: string | Redacted.Redacted<string>;
  LastName?: string | Redacted.Redacted<string>;
  BirthDate?: string | Redacted.Redacted<string>;
  Gender?: string;
  PhoneNumber?: string | Redacted.Redacted<string>;
  MobilePhoneNumber?: string | Redacted.Redacted<string>;
  HomePhoneNumber?: string | Redacted.Redacted<string>;
  BusinessPhoneNumber?: string | Redacted.Redacted<string>;
  EmailAddress?: string | Redacted.Redacted<string>;
  PersonalEmailAddress?: string | Redacted.Redacted<string>;
  BusinessEmailAddress?: string | Redacted.Redacted<string>;
  Address?: Address;
  ShippingAddress?: Address;
  MailingAddress?: Address;
  BillingAddress?: Address;
  Attributes?: Attributes;
  FoundByItems?: foundByList;
  PartyTypeString?: string | Redacted.Redacted<string>;
  GenderString?: string | Redacted.Redacted<string>;
  ProfileType?: string;
  EngagementPreferences?: EngagementPreferences;
}
export const Profile = S.suspend(() =>
  S.Struct({
    ProfileId: S.optional(S.String),
    AccountNumber: S.optional(SensitiveString),
    AdditionalInformation: S.optional(SensitiveString),
    PartyType: S.optional(S.String),
    BusinessName: S.optional(SensitiveString),
    FirstName: S.optional(SensitiveString),
    MiddleName: S.optional(SensitiveString),
    LastName: S.optional(SensitiveString),
    BirthDate: S.optional(SensitiveString),
    Gender: S.optional(S.String),
    PhoneNumber: S.optional(SensitiveString),
    MobilePhoneNumber: S.optional(SensitiveString),
    HomePhoneNumber: S.optional(SensitiveString),
    BusinessPhoneNumber: S.optional(SensitiveString),
    EmailAddress: S.optional(SensitiveString),
    PersonalEmailAddress: S.optional(SensitiveString),
    BusinessEmailAddress: S.optional(SensitiveString),
    Address: S.optional(Address),
    ShippingAddress: S.optional(Address),
    MailingAddress: S.optional(Address),
    BillingAddress: S.optional(Address),
    Attributes: S.optional(Attributes),
    FoundByItems: S.optional(foundByList),
    PartyTypeString: S.optional(SensitiveString),
    GenderString: S.optional(SensitiveString),
    ProfileType: S.optional(S.String),
    EngagementPreferences: S.optional(EngagementPreferences),
  }),
).annotations({ identifier: "Profile" }) as any as S.Schema<Profile>;
export interface ProfileQueryResult {
  ProfileId: string;
  QueryResult: string;
  Profile?: Profile;
}
export const ProfileQueryResult = S.suspend(() =>
  S.Struct({
    ProfileId: S.String.pipe(T.JsonName("ProfileId")),
    QueryResult: S.String.pipe(T.JsonName("QueryResult")),
    Profile: S.optional(Profile)
      .pipe(T.JsonName("Profile"))
      .annotations({ identifier: "Profile" }),
  }),
).annotations({
  identifier: "ProfileQueryResult",
}) as any as S.Schema<ProfileQueryResult>;
export type Profiles = ProfileQueryResult[];
export const Profiles = S.Array(ProfileQueryResult);
export interface ProfileQueryFailures {
  ProfileId: string;
  Message: string;
  Status?: number;
}
export const ProfileQueryFailures = S.suspend(() =>
  S.Struct({
    ProfileId: S.String.pipe(T.JsonName("ProfileId")),
    Message: S.String.pipe(T.JsonName("Message")),
    Status: S.optional(S.Number).pipe(T.JsonName("Status")),
  }),
).annotations({
  identifier: "ProfileQueryFailures",
}) as any as S.Schema<ProfileQueryFailures>;
export type Failures = ProfileQueryFailures[];
export const Failures = S.Array(ProfileQueryFailures);
export interface ResultsSummary {
  UpdatedRecords?: number;
  CreatedRecords?: number;
  FailedRecords?: number;
}
export const ResultsSummary = S.suspend(() =>
  S.Struct({
    UpdatedRecords: S.optional(S.Number).pipe(T.JsonName("UpdatedRecords")),
    CreatedRecords: S.optional(S.Number).pipe(T.JsonName("CreatedRecords")),
    FailedRecords: S.optional(S.Number).pipe(T.JsonName("FailedRecords")),
  }),
).annotations({
  identifier: "ResultsSummary",
}) as any as S.Schema<ResultsSummary>;
export interface ListCalculatedAttributeDefinitionItem {
  CalculatedAttributeName?: string;
  DisplayName?: string;
  Description?: string | Redacted.Redacted<string>;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  UseHistoricalData?: boolean;
  Status?: string;
  Tags?: TagMap;
}
export const ListCalculatedAttributeDefinitionItem = S.suspend(() =>
  S.Struct({
    CalculatedAttributeName: S.optional(S.String),
    DisplayName: S.optional(S.String),
    Description: S.optional(SensitiveString),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UseHistoricalData: S.optional(S.Boolean),
    Status: S.optional(S.String),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "ListCalculatedAttributeDefinitionItem",
}) as any as S.Schema<ListCalculatedAttributeDefinitionItem>;
export type CalculatedAttributeDefinitionsList =
  ListCalculatedAttributeDefinitionItem[];
export const CalculatedAttributeDefinitionsList = S.Array(
  ListCalculatedAttributeDefinitionItem,
);
export interface ListCalculatedAttributeForProfileItem {
  CalculatedAttributeName?: string;
  DisplayName?: string;
  IsDataPartial?: string;
  Value?: string;
  LastObjectTimestamp?: Date;
}
export const ListCalculatedAttributeForProfileItem = S.suspend(() =>
  S.Struct({
    CalculatedAttributeName: S.optional(S.String),
    DisplayName: S.optional(S.String),
    IsDataPartial: S.optional(S.String),
    Value: S.optional(S.String),
    LastObjectTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ListCalculatedAttributeForProfileItem",
}) as any as S.Schema<ListCalculatedAttributeForProfileItem>;
export type CalculatedAttributesForProfileList =
  ListCalculatedAttributeForProfileItem[];
export const CalculatedAttributesForProfileList = S.Array(
  ListCalculatedAttributeForProfileItem,
);
export interface LayoutItem {
  LayoutDefinitionName: string;
  Description: string | Redacted.Redacted<string>;
  DisplayName: string;
  IsDefault?: boolean;
  LayoutType: string;
  Tags?: TagMap;
  CreatedAt: Date;
  LastUpdatedAt: Date;
}
export const LayoutItem = S.suspend(() =>
  S.Struct({
    LayoutDefinitionName: S.String,
    Description: SensitiveString,
    DisplayName: S.String,
    IsDefault: S.optional(S.Boolean),
    LayoutType: S.String,
    Tags: S.optional(TagMap),
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "LayoutItem" }) as any as S.Schema<LayoutItem>;
export type LayoutList = LayoutItem[];
export const LayoutList = S.Array(LayoutItem);
export interface DomainObjectTypesListItem {
  ObjectTypeName: string;
  Description?: string | Redacted.Redacted<string>;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  Tags?: TagMap;
}
export const DomainObjectTypesListItem = S.suspend(() =>
  S.Struct({
    ObjectTypeName: S.String,
    Description: S.optional(SensitiveString),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "DomainObjectTypesListItem",
}) as any as S.Schema<DomainObjectTypesListItem>;
export type DomainObjectTypesList = DomainObjectTypesListItem[];
export const DomainObjectTypesList = S.Array(DomainObjectTypesListItem);
export interface ListDomainItem {
  DomainName: string;
  CreatedAt: Date;
  LastUpdatedAt: Date;
  Tags?: TagMap;
}
export const ListDomainItem = S.suspend(() =>
  S.Struct({
    DomainName: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "ListDomainItem",
}) as any as S.Schema<ListDomainItem>;
export type DomainList = ListDomainItem[];
export const DomainList = S.Array(ListDomainItem);
export interface EventTriggerSummaryItem {
  ObjectTypeName?: string;
  EventTriggerName?: string;
  Description?: string;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  Tags?: TagMap;
}
export const EventTriggerSummaryItem = S.suspend(() =>
  S.Struct({
    ObjectTypeName: S.optional(S.String),
    EventTriggerName: S.optional(S.String),
    Description: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "EventTriggerSummaryItem",
}) as any as S.Schema<EventTriggerSummaryItem>;
export type EventTriggerSummaryList = EventTriggerSummaryItem[];
export const EventTriggerSummaryList = S.Array(EventTriggerSummaryItem);
export interface S3ExportingLocation {
  S3BucketName?: string;
  S3KeyName?: string;
}
export const S3ExportingLocation = S.suspend(() =>
  S.Struct({
    S3BucketName: S.optional(S.String),
    S3KeyName: S.optional(S.String),
  }),
).annotations({
  identifier: "S3ExportingLocation",
}) as any as S.Schema<S3ExportingLocation>;
export interface ExportingLocation {
  S3Exporting?: S3ExportingLocation;
}
export const ExportingLocation = S.suspend(() =>
  S.Struct({ S3Exporting: S.optional(S3ExportingLocation) }),
).annotations({
  identifier: "ExportingLocation",
}) as any as S.Schema<ExportingLocation>;
export interface IdentityResolutionJob {
  DomainName?: string;
  JobId?: string;
  Status?: string;
  JobStartTime?: Date;
  JobEndTime?: Date;
  JobStats?: JobStats;
  ExportingLocation?: ExportingLocation;
  Message?: string;
}
export const IdentityResolutionJob = S.suspend(() =>
  S.Struct({
    DomainName: S.optional(S.String),
    JobId: S.optional(S.String),
    Status: S.optional(S.String),
    JobStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    JobEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    JobStats: S.optional(JobStats),
    ExportingLocation: S.optional(ExportingLocation),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "IdentityResolutionJob",
}) as any as S.Schema<IdentityResolutionJob>;
export type IdentityResolutionJobsList = IdentityResolutionJob[];
export const IdentityResolutionJobsList = S.Array(IdentityResolutionJob);
export interface ListObjectTypeAttributeItem {
  AttributeName: string;
  LastUpdatedAt: Date;
}
export const ListObjectTypeAttributeItem = S.suspend(() =>
  S.Struct({
    AttributeName: S.String,
    LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ListObjectTypeAttributeItem",
}) as any as S.Schema<ListObjectTypeAttributeItem>;
export type ListObjectTypeAttributesList = ListObjectTypeAttributeItem[];
export const ListObjectTypeAttributesList = S.Array(
  ListObjectTypeAttributeItem,
);
export interface ListObjectTypeAttributeValuesItem {
  Value: string | Redacted.Redacted<string>;
  LastUpdatedAt: Date;
}
export const ListObjectTypeAttributeValuesItem = S.suspend(() =>
  S.Struct({
    Value: SensitiveString,
    LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ListObjectTypeAttributeValuesItem",
}) as any as S.Schema<ListObjectTypeAttributeValuesItem>;
export type ListObjectTypeAttributeValuesList =
  ListObjectTypeAttributeValuesItem[];
export const ListObjectTypeAttributeValuesList = S.Array(
  ListObjectTypeAttributeValuesItem,
);
export interface AttributeValueItem {
  Value?: string;
}
export const AttributeValueItem = S.suspend(() =>
  S.Struct({ Value: S.optional(S.String) }),
).annotations({
  identifier: "AttributeValueItem",
}) as any as S.Schema<AttributeValueItem>;
export type AttributeValueItemList = AttributeValueItem[];
export const AttributeValueItemList = S.Array(AttributeValueItem);
export interface ProfileHistoryRecord {
  Id: string;
  ObjectTypeName: string;
  CreatedAt: Date;
  LastUpdatedAt?: Date;
  ActionType: string;
  ProfileObjectUniqueKey?: string;
  PerformedBy?: string;
}
export const ProfileHistoryRecord = S.suspend(() =>
  S.Struct({
    Id: S.String,
    ObjectTypeName: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ActionType: S.String,
    ProfileObjectUniqueKey: S.optional(S.String),
    PerformedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "ProfileHistoryRecord",
}) as any as S.Schema<ProfileHistoryRecord>;
export type ProfileHistoryRecords = ProfileHistoryRecord[];
export const ProfileHistoryRecords = S.Array(ProfileHistoryRecord);
export interface ListProfileObjectTypeItem {
  ObjectTypeName: string;
  Description: string;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  MaxProfileObjectCount?: number;
  MaxAvailableProfileObjectCount?: number;
  Tags?: TagMap;
}
export const ListProfileObjectTypeItem = S.suspend(() =>
  S.Struct({
    ObjectTypeName: S.String,
    Description: S.String,
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    MaxProfileObjectCount: S.optional(S.Number),
    MaxAvailableProfileObjectCount: S.optional(S.Number),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "ListProfileObjectTypeItem",
}) as any as S.Schema<ListProfileObjectTypeItem>;
export type ProfileObjectTypeList = ListProfileObjectTypeItem[];
export const ProfileObjectTypeList = S.Array(ListProfileObjectTypeItem);
export interface ListProfileObjectTypeTemplateItem {
  TemplateId?: string;
  SourceName?: string;
  SourceObject?: string;
}
export const ListProfileObjectTypeTemplateItem = S.suspend(() =>
  S.Struct({
    TemplateId: S.optional(S.String),
    SourceName: S.optional(S.String),
    SourceObject: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProfileObjectTypeTemplateItem",
}) as any as S.Schema<ListProfileObjectTypeTemplateItem>;
export type ProfileObjectTypeTemplateList = ListProfileObjectTypeTemplateItem[];
export const ProfileObjectTypeTemplateList = S.Array(
  ListProfileObjectTypeTemplateItem,
);
export interface RecommenderRecipe {
  name?: string;
  description?: string;
}
export const RecommenderRecipe = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), description: S.optional(S.String) }),
).annotations({
  identifier: "RecommenderRecipe",
}) as any as S.Schema<RecommenderRecipe>;
export type RecommenderRecipesList = RecommenderRecipe[];
export const RecommenderRecipesList = S.Array(RecommenderRecipe);
export interface RecommenderSummary {
  RecommenderName?: string;
  RecipeName?: string;
  RecommenderConfig?: RecommenderConfig;
  CreatedAt?: Date;
  Description?: string | Redacted.Redacted<string>;
  Status?: string;
  LastUpdatedAt?: Date;
  Tags?: TagMap;
  FailureReason?: string;
  LatestRecommenderUpdate?: RecommenderUpdate;
}
export const RecommenderSummary = S.suspend(() =>
  S.Struct({
    RecommenderName: S.optional(S.String),
    RecipeName: S.optional(S.String),
    RecommenderConfig: S.optional(RecommenderConfig),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(SensitiveString),
    Status: S.optional(S.String),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(TagMap),
    FailureReason: S.optional(S.String),
    LatestRecommenderUpdate: S.optional(RecommenderUpdate),
  }),
).annotations({
  identifier: "RecommenderSummary",
}) as any as S.Schema<RecommenderSummary>;
export type RecommenderSummaryList = RecommenderSummary[];
export const RecommenderSummaryList = S.Array(RecommenderSummary);
export interface SegmentDefinitionItem {
  SegmentDefinitionName?: string;
  DisplayName?: string;
  Description?: string | Redacted.Redacted<string>;
  SegmentDefinitionArn?: string;
  CreatedAt?: Date;
  Tags?: TagMap;
  SegmentType?: string;
}
export const SegmentDefinitionItem = S.suspend(() =>
  S.Struct({
    SegmentDefinitionName: S.optional(S.String).pipe(
      T.JsonName("SegmentDefinitionName"),
    ),
    DisplayName: S.optional(S.String).pipe(T.JsonName("DisplayName")),
    Description: S.optional(SensitiveString).pipe(T.JsonName("Description")),
    SegmentDefinitionArn: S.optional(S.String).pipe(
      T.JsonName("SegmentDefinitionArn"),
    ),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("CreatedAt"),
    ),
    Tags: S.optional(TagMap).pipe(T.JsonName("Tags")),
    SegmentType: S.optional(S.String).pipe(T.JsonName("SegmentType")),
  }),
).annotations({
  identifier: "SegmentDefinitionItem",
}) as any as S.Schema<SegmentDefinitionItem>;
export type SegmentDefinitionsList = SegmentDefinitionItem[];
export const SegmentDefinitionsList = S.Array(SegmentDefinitionItem);
export interface UploadJobItem {
  JobId?: string;
  DisplayName?: string;
  Status?: string;
  StatusReason?: string;
  CreatedAt?: Date;
  CompletedAt?: Date;
  DataExpiry?: number;
}
export const UploadJobItem = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String).pipe(T.JsonName("JobId")),
    DisplayName: S.optional(S.String).pipe(T.JsonName("DisplayName")),
    Status: S.optional(S.String).pipe(T.JsonName("Status")),
    StatusReason: S.optional(S.String).pipe(T.JsonName("StatusReason")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("CreatedAt"),
    ),
    CompletedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("CompletedAt")),
    DataExpiry: S.optional(S.Number).pipe(T.JsonName("DataExpiry")),
  }),
).annotations({
  identifier: "UploadJobItem",
}) as any as S.Schema<UploadJobItem>;
export type UploadJobsList = UploadJobItem[];
export const UploadJobsList = S.Array(UploadJobItem);
export interface ListWorkflowsItem {
  WorkflowType: string;
  WorkflowId: string;
  Status: string;
  StatusDescription: string;
  CreatedAt: Date;
  LastUpdatedAt: Date;
}
export const ListWorkflowsItem = S.suspend(() =>
  S.Struct({
    WorkflowType: S.String,
    WorkflowId: S.String,
    Status: S.String,
    StatusDescription: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ListWorkflowsItem",
}) as any as S.Schema<ListWorkflowsItem>;
export type WorkflowList = ListWorkflowsItem[];
export const WorkflowList = S.Array(ListWorkflowsItem);
export interface FieldSourceProfileIds {
  AccountNumber?: string;
  AdditionalInformation?: string;
  PartyType?: string;
  BusinessName?: string;
  FirstName?: string;
  MiddleName?: string;
  LastName?: string;
  BirthDate?: string;
  Gender?: string;
  PhoneNumber?: string;
  MobilePhoneNumber?: string;
  HomePhoneNumber?: string;
  BusinessPhoneNumber?: string;
  EmailAddress?: string;
  PersonalEmailAddress?: string;
  BusinessEmailAddress?: string;
  Address?: string;
  ShippingAddress?: string;
  MailingAddress?: string;
  BillingAddress?: string;
  Attributes?: AttributeSourceIdMap;
  ProfileType?: string;
  EngagementPreferences?: string;
}
export const FieldSourceProfileIds = S.suspend(() =>
  S.Struct({
    AccountNumber: S.optional(S.String),
    AdditionalInformation: S.optional(S.String),
    PartyType: S.optional(S.String),
    BusinessName: S.optional(S.String),
    FirstName: S.optional(S.String),
    MiddleName: S.optional(S.String),
    LastName: S.optional(S.String),
    BirthDate: S.optional(S.String),
    Gender: S.optional(S.String),
    PhoneNumber: S.optional(S.String),
    MobilePhoneNumber: S.optional(S.String),
    HomePhoneNumber: S.optional(S.String),
    BusinessPhoneNumber: S.optional(S.String),
    EmailAddress: S.optional(S.String),
    PersonalEmailAddress: S.optional(S.String),
    BusinessEmailAddress: S.optional(S.String),
    Address: S.optional(S.String),
    ShippingAddress: S.optional(S.String),
    MailingAddress: S.optional(S.String),
    BillingAddress: S.optional(S.String),
    Attributes: S.optional(AttributeSourceIdMap),
    ProfileType: S.optional(S.String),
    EngagementPreferences: S.optional(S.String),
  }),
).annotations({
  identifier: "FieldSourceProfileIds",
}) as any as S.Schema<FieldSourceProfileIds>;
export interface Batch {
  StartTime: Date;
  EndTime: Date;
}
export const Batch = S.suspend(() =>
  S.Struct({
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "Batch" }) as any as S.Schema<Batch>;
export type Batches = Batch[];
export const Batches = S.Array(Batch);
export interface IncrementalPullConfig {
  DatetimeTypeFieldName?: string;
}
export const IncrementalPullConfig = S.suspend(() =>
  S.Struct({ DatetimeTypeFieldName: S.optional(S.String) }),
).annotations({
  identifier: "IncrementalPullConfig",
}) as any as S.Schema<IncrementalPullConfig>;
export interface ConnectorOperator {
  Marketo?: string;
  S3?: string;
  Salesforce?: string;
  ServiceNow?: string;
  Zendesk?: string;
}
export const ConnectorOperator = S.suspend(() =>
  S.Struct({
    Marketo: S.optional(S.String),
    S3: S.optional(S.String),
    Salesforce: S.optional(S.String),
    ServiceNow: S.optional(S.String),
    Zendesk: S.optional(S.String),
  }),
).annotations({
  identifier: "ConnectorOperator",
}) as any as S.Schema<ConnectorOperator>;
export type TaskPropertiesMap = { [key: string]: string };
export const TaskPropertiesMap = S.Record({ key: S.String, value: S.String });
export interface BatchGetCalculatedAttributeForProfileRequest {
  CalculatedAttributeName: string;
  DomainName: string;
  ProfileIds: BatchGetCalculatedAttributeForProfileIdList;
  ConditionOverrides?: ConditionOverrides;
}
export const BatchGetCalculatedAttributeForProfileRequest = S.suspend(() =>
  S.Struct({
    CalculatedAttributeName: S.String.pipe(
      T.HttpLabel("CalculatedAttributeName"),
    ),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ProfileIds: BatchGetCalculatedAttributeForProfileIdList,
    ConditionOverrides: S.optional(ConditionOverrides),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/calculated-attributes/{CalculatedAttributeName}/batch-get-for-profiles",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetCalculatedAttributeForProfileRequest",
}) as any as S.Schema<BatchGetCalculatedAttributeForProfileRequest>;
export interface CreateProfileRequest {
  DomainName: string;
  AccountNumber?: string | Redacted.Redacted<string>;
  AdditionalInformation?: string | Redacted.Redacted<string>;
  PartyType?: string;
  BusinessName?: string | Redacted.Redacted<string>;
  FirstName?: string | Redacted.Redacted<string>;
  MiddleName?: string | Redacted.Redacted<string>;
  LastName?: string | Redacted.Redacted<string>;
  BirthDate?: string | Redacted.Redacted<string>;
  Gender?: string;
  PhoneNumber?: string | Redacted.Redacted<string>;
  MobilePhoneNumber?: string | Redacted.Redacted<string>;
  HomePhoneNumber?: string | Redacted.Redacted<string>;
  BusinessPhoneNumber?: string | Redacted.Redacted<string>;
  EmailAddress?: string | Redacted.Redacted<string>;
  PersonalEmailAddress?: string | Redacted.Redacted<string>;
  BusinessEmailAddress?: string | Redacted.Redacted<string>;
  Address?: Address;
  ShippingAddress?: Address;
  MailingAddress?: Address;
  BillingAddress?: Address;
  Attributes?: Attributes;
  PartyTypeString?: string | Redacted.Redacted<string>;
  GenderString?: string | Redacted.Redacted<string>;
  ProfileType?: string;
  EngagementPreferences?: EngagementPreferences;
}
export const CreateProfileRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    AccountNumber: S.optional(SensitiveString),
    AdditionalInformation: S.optional(SensitiveString),
    PartyType: S.optional(S.String),
    BusinessName: S.optional(SensitiveString),
    FirstName: S.optional(SensitiveString),
    MiddleName: S.optional(SensitiveString),
    LastName: S.optional(SensitiveString),
    BirthDate: S.optional(SensitiveString),
    Gender: S.optional(S.String),
    PhoneNumber: S.optional(SensitiveString),
    MobilePhoneNumber: S.optional(SensitiveString),
    HomePhoneNumber: S.optional(SensitiveString),
    BusinessPhoneNumber: S.optional(SensitiveString),
    EmailAddress: S.optional(SensitiveString),
    PersonalEmailAddress: S.optional(SensitiveString),
    BusinessEmailAddress: S.optional(SensitiveString),
    Address: S.optional(Address),
    ShippingAddress: S.optional(Address),
    MailingAddress: S.optional(Address),
    BillingAddress: S.optional(Address),
    Attributes: S.optional(Attributes),
    PartyTypeString: S.optional(SensitiveString),
    GenderString: S.optional(SensitiveString),
    ProfileType: S.optional(S.String),
    EngagementPreferences: S.optional(EngagementPreferences),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{DomainName}/profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProfileRequest",
}) as any as S.Schema<CreateProfileRequest>;
export interface CreateSegmentEstimateResponse {
  DomainName?: string;
  EstimateId?: string;
  StatusCode?: number;
}
export const CreateSegmentEstimateResponse = S.suspend(() =>
  S.Struct({
    DomainName: S.optional(S.String),
    EstimateId: S.optional(S.String),
    StatusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
  }),
).annotations({
  identifier: "CreateSegmentEstimateResponse",
}) as any as S.Schema<CreateSegmentEstimateResponse>;
export interface CreateUploadJobRequest {
  DomainName: string;
  DisplayName: string;
  Fields: FieldMap;
  UniqueKey: string;
  DataExpiry?: number;
}
export const CreateUploadJobRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    DisplayName: S.String,
    Fields: FieldMap,
    UniqueKey: S.String,
    DataExpiry: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{DomainName}/upload-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateUploadJobRequest",
}) as any as S.Schema<CreateUploadJobRequest>;
export interface DetectProfileObjectTypeResponse {
  DetectedProfileObjectTypes?: DetectedProfileObjectTypes;
}
export const DetectProfileObjectTypeResponse = S.suspend(() =>
  S.Struct({
    DetectedProfileObjectTypes: S.optional(DetectedProfileObjectTypes),
  }),
).annotations({
  identifier: "DetectProfileObjectTypeResponse",
}) as any as S.Schema<DetectProfileObjectTypeResponse>;
export interface GetAutoMergingPreviewResponse {
  DomainName: string;
  NumberOfMatchesInSample?: number;
  NumberOfProfilesInSample?: number;
  NumberOfProfilesWillBeMerged?: number;
}
export const GetAutoMergingPreviewResponse = S.suspend(() =>
  S.Struct({
    DomainName: S.String,
    NumberOfMatchesInSample: S.optional(S.Number),
    NumberOfProfilesInSample: S.optional(S.Number),
    NumberOfProfilesWillBeMerged: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetAutoMergingPreviewResponse",
}) as any as S.Schema<GetAutoMergingPreviewResponse>;
export type ValueList = string[];
export const ValueList = S.Array(S.String);
export interface FilterAttributeDimension {
  DimensionType: string;
  Values: ValueList;
}
export const FilterAttributeDimension = S.suspend(() =>
  S.Struct({ DimensionType: S.String, Values: ValueList }),
).annotations({
  identifier: "FilterAttributeDimension",
}) as any as S.Schema<FilterAttributeDimension>;
export type AttributeMap = { [key: string]: FilterAttributeDimension };
export const AttributeMap = S.Record({
  key: S.String,
  value: FilterAttributeDimension,
});
export interface FilterDimension {
  Attributes: AttributeMap;
}
export const FilterDimension = S.suspend(() =>
  S.Struct({ Attributes: AttributeMap }),
).annotations({
  identifier: "FilterDimension",
}) as any as S.Schema<FilterDimension>;
export type FilterDimensionList = FilterDimension[];
export const FilterDimensionList = S.Array(FilterDimension);
export interface FilterGroup {
  Type: string;
  Dimensions: FilterDimensionList;
}
export const FilterGroup = S.suspend(() =>
  S.Struct({ Type: S.String, Dimensions: FilterDimensionList }),
).annotations({ identifier: "FilterGroup" }) as any as S.Schema<FilterGroup>;
export type GroupList = FilterGroup[];
export const GroupList = S.Array(FilterGroup);
export interface Filter {
  Include: string;
  Groups: GroupList;
}
export const Filter = S.suspend(() =>
  S.Struct({ Include: S.String, Groups: GroupList }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export interface GetCalculatedAttributeDefinitionResponse {
  CalculatedAttributeName?: string;
  DisplayName?: string;
  Description?: string | Redacted.Redacted<string>;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  Statistic?: string;
  Filter?: Filter;
  Conditions?: Conditions;
  AttributeDetails?: AttributeDetails;
  UseHistoricalData?: boolean;
  Status?: string;
  Readiness?: Readiness;
  Tags?: TagMap;
}
export const GetCalculatedAttributeDefinitionResponse = S.suspend(() =>
  S.Struct({
    CalculatedAttributeName: S.optional(S.String),
    DisplayName: S.optional(S.String),
    Description: S.optional(SensitiveString),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Statistic: S.optional(S.String),
    Filter: S.optional(Filter),
    Conditions: S.optional(Conditions),
    AttributeDetails: S.optional(AttributeDetails),
    UseHistoricalData: S.optional(S.Boolean),
    Status: S.optional(S.String),
    Readiness: S.optional(Readiness),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetCalculatedAttributeDefinitionResponse",
}) as any as S.Schema<GetCalculatedAttributeDefinitionResponse>;
export interface GetDomainResponse {
  DomainName: string;
  DefaultExpirationDays?: number;
  DefaultEncryptionKey?: string;
  DeadLetterQueueUrl?: string;
  Stats?: DomainStats;
  Matching?: MatchingResponse;
  RuleBasedMatching?: RuleBasedMatchingResponse;
  DataStore?: DataStoreResponse;
  CreatedAt: Date;
  LastUpdatedAt: Date;
  Tags?: TagMap;
}
export const GetDomainResponse = S.suspend(() =>
  S.Struct({
    DomainName: S.String,
    DefaultExpirationDays: S.optional(S.Number),
    DefaultEncryptionKey: S.optional(S.String),
    DeadLetterQueueUrl: S.optional(S.String),
    Stats: S.optional(DomainStats),
    Matching: S.optional(MatchingResponse),
    RuleBasedMatching: S.optional(RuleBasedMatchingResponse),
    DataStore: S.optional(DataStoreResponse),
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetDomainResponse",
}) as any as S.Schema<GetDomainResponse>;
export interface GetEventStreamResponse {
  DomainName: string;
  EventStreamArn: string;
  CreatedAt: Date;
  State: string;
  StoppedSince?: Date;
  DestinationDetails: EventStreamDestinationDetails;
  Tags?: TagMap;
}
export const GetEventStreamResponse = S.suspend(() =>
  S.Struct({
    DomainName: S.String,
    EventStreamArn: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    State: S.String,
    StoppedSince: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DestinationDetails: EventStreamDestinationDetails,
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetEventStreamResponse",
}) as any as S.Schema<GetEventStreamResponse>;
export interface GetMatchesResponse {
  NextToken?: string;
  MatchGenerationDate?: Date;
  PotentialMatches?: number;
  Matches?: MatchesList;
}
export const GetMatchesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MatchGenerationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    PotentialMatches: S.optional(S.Number),
    Matches: S.optional(MatchesList),
  }),
).annotations({
  identifier: "GetMatchesResponse",
}) as any as S.Schema<GetMatchesResponse>;
export interface GetSegmentMembershipResponse {
  SegmentDefinitionName?: string;
  Profiles?: Profiles;
  Failures?: Failures;
  LastComputedAt?: Date;
}
export const GetSegmentMembershipResponse = S.suspend(() =>
  S.Struct({
    SegmentDefinitionName: S.optional(S.String).pipe(
      T.JsonName("SegmentDefinitionName"),
    ),
    Profiles: S.optional(Profiles).pipe(T.JsonName("Profiles")),
    Failures: S.optional(Failures).pipe(T.JsonName("Failures")),
    LastComputedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("LastComputedAt")),
  }),
).annotations({
  identifier: "GetSegmentMembershipResponse",
}) as any as S.Schema<GetSegmentMembershipResponse>;
export interface GetUploadJobResponse {
  JobId?: string;
  DisplayName?: string;
  Status?: string;
  StatusReason?: string;
  CreatedAt?: Date;
  CompletedAt?: Date;
  Fields?: FieldMap;
  UniqueKey?: string;
  ResultsSummary?: ResultsSummary;
  DataExpiry?: number;
}
export const GetUploadJobResponse = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String).pipe(T.JsonName("JobId")),
    DisplayName: S.optional(S.String).pipe(T.JsonName("DisplayName")),
    Status: S.optional(S.String).pipe(T.JsonName("Status")),
    StatusReason: S.optional(S.String).pipe(T.JsonName("StatusReason")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("CreatedAt"),
    ),
    CompletedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("CompletedAt")),
    Fields: S.optional(FieldMap).pipe(T.JsonName("Fields")),
    UniqueKey: S.optional(S.String).pipe(T.JsonName("UniqueKey")),
    ResultsSummary: S.optional(ResultsSummary)
      .pipe(T.JsonName("ResultsSummary"))
      .annotations({ identifier: "ResultsSummary" }),
    DataExpiry: S.optional(S.Number).pipe(T.JsonName("DataExpiry")),
  }),
).annotations({
  identifier: "GetUploadJobResponse",
}) as any as S.Schema<GetUploadJobResponse>;
export interface ListAccountIntegrationsResponse {
  Items?: IntegrationList;
  NextToken?: string;
}
export const ListAccountIntegrationsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(IntegrationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAccountIntegrationsResponse",
}) as any as S.Schema<ListAccountIntegrationsResponse>;
export interface ListCalculatedAttributeDefinitionsResponse {
  Items?: CalculatedAttributeDefinitionsList;
  NextToken?: string;
}
export const ListCalculatedAttributeDefinitionsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(CalculatedAttributeDefinitionsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCalculatedAttributeDefinitionsResponse",
}) as any as S.Schema<ListCalculatedAttributeDefinitionsResponse>;
export interface ListCalculatedAttributesForProfileResponse {
  Items?: CalculatedAttributesForProfileList;
  NextToken?: string;
}
export const ListCalculatedAttributesForProfileResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(CalculatedAttributesForProfileList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCalculatedAttributesForProfileResponse",
}) as any as S.Schema<ListCalculatedAttributesForProfileResponse>;
export interface ListDomainLayoutsResponse {
  Items?: LayoutList;
  NextToken?: string;
}
export const ListDomainLayoutsResponse = S.suspend(() =>
  S.Struct({ Items: S.optional(LayoutList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDomainLayoutsResponse",
}) as any as S.Schema<ListDomainLayoutsResponse>;
export interface ListDomainObjectTypesResponse {
  Items?: DomainObjectTypesList;
  NextToken?: string;
}
export const ListDomainObjectTypesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(DomainObjectTypesList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDomainObjectTypesResponse",
}) as any as S.Schema<ListDomainObjectTypesResponse>;
export interface ListDomainsResponse {
  Items?: DomainList;
  NextToken?: string;
}
export const ListDomainsResponse = S.suspend(() =>
  S.Struct({ Items: S.optional(DomainList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDomainsResponse",
}) as any as S.Schema<ListDomainsResponse>;
export interface ListEventTriggersResponse {
  Items?: EventTriggerSummaryList;
  NextToken?: string;
}
export const ListEventTriggersResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(EventTriggerSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEventTriggersResponse",
}) as any as S.Schema<ListEventTriggersResponse>;
export interface ListIdentityResolutionJobsResponse {
  IdentityResolutionJobsList?: IdentityResolutionJobsList;
  NextToken?: string;
}
export const ListIdentityResolutionJobsResponse = S.suspend(() =>
  S.Struct({
    IdentityResolutionJobsList: S.optional(IdentityResolutionJobsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIdentityResolutionJobsResponse",
}) as any as S.Schema<ListIdentityResolutionJobsResponse>;
export interface ListObjectTypeAttributesResponse {
  Items?: ListObjectTypeAttributesList;
  NextToken?: string;
}
export const ListObjectTypeAttributesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(ListObjectTypeAttributesList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListObjectTypeAttributesResponse",
}) as any as S.Schema<ListObjectTypeAttributesResponse>;
export interface ListObjectTypeAttributeValuesResponse {
  Items?: ListObjectTypeAttributeValuesList;
  NextToken?: string;
}
export const ListObjectTypeAttributeValuesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(ListObjectTypeAttributeValuesList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListObjectTypeAttributeValuesResponse",
}) as any as S.Schema<ListObjectTypeAttributeValuesResponse>;
export interface ProfileAttributeValuesResponse {
  DomainName?: string;
  AttributeName?: string;
  Items?: AttributeValueItemList;
  StatusCode?: number;
}
export const ProfileAttributeValuesResponse = S.suspend(() =>
  S.Struct({
    DomainName: S.optional(S.String),
    AttributeName: S.optional(S.String),
    Items: S.optional(AttributeValueItemList),
    StatusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
  }),
).annotations({
  identifier: "ProfileAttributeValuesResponse",
}) as any as S.Schema<ProfileAttributeValuesResponse>;
export interface ListProfileHistoryRecordsResponse {
  ProfileHistoryRecords?: ProfileHistoryRecords;
  NextToken?: string;
}
export const ListProfileHistoryRecordsResponse = S.suspend(() =>
  S.Struct({
    ProfileHistoryRecords: S.optional(ProfileHistoryRecords),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProfileHistoryRecordsResponse",
}) as any as S.Schema<ListProfileHistoryRecordsResponse>;
export interface ListProfileObjectTypesResponse {
  Items?: ProfileObjectTypeList;
  NextToken?: string;
}
export const ListProfileObjectTypesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(ProfileObjectTypeList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProfileObjectTypesResponse",
}) as any as S.Schema<ListProfileObjectTypesResponse>;
export interface ListProfileObjectTypeTemplatesResponse {
  Items?: ProfileObjectTypeTemplateList;
  NextToken?: string;
}
export const ListProfileObjectTypeTemplatesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(ProfileObjectTypeTemplateList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProfileObjectTypeTemplatesResponse",
}) as any as S.Schema<ListProfileObjectTypeTemplatesResponse>;
export interface ListRecommenderRecipesResponse {
  NextToken?: string;
  RecommenderRecipes?: RecommenderRecipesList;
}
export const ListRecommenderRecipesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    RecommenderRecipes: S.optional(RecommenderRecipesList),
  }),
).annotations({
  identifier: "ListRecommenderRecipesResponse",
}) as any as S.Schema<ListRecommenderRecipesResponse>;
export interface ListRecommendersResponse {
  NextToken?: string;
  Recommenders?: RecommenderSummaryList;
}
export const ListRecommendersResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Recommenders: S.optional(RecommenderSummaryList),
  }),
).annotations({
  identifier: "ListRecommendersResponse",
}) as any as S.Schema<ListRecommendersResponse>;
export interface ListSegmentDefinitionsResponse {
  NextToken?: string;
  Items?: SegmentDefinitionsList;
}
export const ListSegmentDefinitionsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("NextToken")),
    Items: S.optional(SegmentDefinitionsList).pipe(T.JsonName("Items")),
  }),
).annotations({
  identifier: "ListSegmentDefinitionsResponse",
}) as any as S.Schema<ListSegmentDefinitionsResponse>;
export interface ListUploadJobsResponse {
  NextToken?: string;
  Items?: UploadJobsList;
}
export const ListUploadJobsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("NextToken")),
    Items: S.optional(UploadJobsList).pipe(T.JsonName("Items")),
  }),
).annotations({
  identifier: "ListUploadJobsResponse",
}) as any as S.Schema<ListUploadJobsResponse>;
export interface ListWorkflowsResponse {
  Items?: WorkflowList;
  NextToken?: string;
}
export const ListWorkflowsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(WorkflowList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWorkflowsResponse",
}) as any as S.Schema<ListWorkflowsResponse>;
export interface MergeProfilesRequest {
  DomainName: string;
  MainProfileId: string;
  ProfileIdsToBeMerged: ProfileIdToBeMergedList;
  FieldSourceProfileIds?: FieldSourceProfileIds;
}
export const MergeProfilesRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    MainProfileId: S.String,
    ProfileIdsToBeMerged: ProfileIdToBeMergedList,
    FieldSourceProfileIds: S.optional(FieldSourceProfileIds),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/profiles/objects/merge",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "MergeProfilesRequest",
}) as any as S.Schema<MergeProfilesRequest>;
export interface PutDomainObjectTypeRequest {
  DomainName: string;
  ObjectTypeName: string;
  Description?: string | Redacted.Redacted<string>;
  EncryptionKey?: string;
  Fields: DomainObjectTypeFields;
  Tags?: TagMap;
}
export const PutDomainObjectTypeRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ObjectTypeName: S.String.pipe(T.HttpLabel("ObjectTypeName")),
    Description: S.optional(SensitiveString),
    EncryptionKey: S.optional(S.String),
    Fields: DomainObjectTypeFields,
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/domains/{DomainName}/domain-object-types/{ObjectTypeName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutDomainObjectTypeRequest",
}) as any as S.Schema<PutDomainObjectTypeRequest>;
export interface PutProfileObjectTypeRequest {
  DomainName: string;
  ObjectTypeName: string;
  Description: string | Redacted.Redacted<string>;
  TemplateId?: string;
  ExpirationDays?: number;
  EncryptionKey?: string;
  AllowProfileCreation?: boolean;
  SourceLastUpdatedTimestampFormat?: string;
  MaxProfileObjectCount?: number;
  Fields?: FieldMap;
  Keys?: KeyMap;
  Tags?: TagMap;
}
export const PutProfileObjectTypeRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ObjectTypeName: S.String.pipe(T.HttpLabel("ObjectTypeName")),
    Description: SensitiveString,
    TemplateId: S.optional(S.String),
    ExpirationDays: S.optional(S.Number),
    EncryptionKey: S.optional(S.String),
    AllowProfileCreation: S.optional(S.Boolean),
    SourceLastUpdatedTimestampFormat: S.optional(S.String),
    MaxProfileObjectCount: S.optional(S.Number),
    Fields: S.optional(FieldMap),
    Keys: S.optional(KeyMap),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/domains/{DomainName}/object-types/{ObjectTypeName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutProfileObjectTypeRequest",
}) as any as S.Schema<PutProfileObjectTypeRequest>;
export type ProfileList = Profile[];
export const ProfileList = S.Array(Profile);
export interface SearchProfilesResponse {
  Items?: ProfileList;
  NextToken?: string;
}
export const SearchProfilesResponse = S.suspend(() =>
  S.Struct({ Items: S.optional(ProfileList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "SearchProfilesResponse",
}) as any as S.Schema<SearchProfilesResponse>;
export interface UpdateProfileResponse {
  ProfileId: string;
}
export const UpdateProfileResponse = S.suspend(() =>
  S.Struct({ ProfileId: S.String }),
).annotations({
  identifier: "UpdateProfileResponse",
}) as any as S.Schema<UpdateProfileResponse>;
export interface MarketoSourceProperties {
  Object: string;
}
export const MarketoSourceProperties = S.suspend(() =>
  S.Struct({ Object: S.String }),
).annotations({
  identifier: "MarketoSourceProperties",
}) as any as S.Schema<MarketoSourceProperties>;
export interface S3SourceProperties {
  BucketName: string;
  BucketPrefix?: string;
}
export const S3SourceProperties = S.suspend(() =>
  S.Struct({ BucketName: S.String, BucketPrefix: S.optional(S.String) }),
).annotations({
  identifier: "S3SourceProperties",
}) as any as S.Schema<S3SourceProperties>;
export interface SalesforceSourceProperties {
  Object: string;
  EnableDynamicFieldUpdate?: boolean;
  IncludeDeletedRecords?: boolean;
}
export const SalesforceSourceProperties = S.suspend(() =>
  S.Struct({
    Object: S.String,
    EnableDynamicFieldUpdate: S.optional(S.Boolean),
    IncludeDeletedRecords: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SalesforceSourceProperties",
}) as any as S.Schema<SalesforceSourceProperties>;
export interface ServiceNowSourceProperties {
  Object: string;
}
export const ServiceNowSourceProperties = S.suspend(() =>
  S.Struct({ Object: S.String }),
).annotations({
  identifier: "ServiceNowSourceProperties",
}) as any as S.Schema<ServiceNowSourceProperties>;
export interface ZendeskSourceProperties {
  Object: string;
}
export const ZendeskSourceProperties = S.suspend(() =>
  S.Struct({ Object: S.String }),
).annotations({
  identifier: "ZendeskSourceProperties",
}) as any as S.Schema<ZendeskSourceProperties>;
export interface SourceConnectorProperties {
  Marketo?: MarketoSourceProperties;
  S3?: S3SourceProperties;
  Salesforce?: SalesforceSourceProperties;
  ServiceNow?: ServiceNowSourceProperties;
  Zendesk?: ZendeskSourceProperties;
}
export const SourceConnectorProperties = S.suspend(() =>
  S.Struct({
    Marketo: S.optional(MarketoSourceProperties),
    S3: S.optional(S3SourceProperties),
    Salesforce: S.optional(SalesforceSourceProperties),
    ServiceNow: S.optional(ServiceNowSourceProperties),
    Zendesk: S.optional(ZendeskSourceProperties),
  }),
).annotations({
  identifier: "SourceConnectorProperties",
}) as any as S.Schema<SourceConnectorProperties>;
export interface SourceFlowConfig {
  ConnectorProfileName?: string;
  ConnectorType: string;
  IncrementalPullConfig?: IncrementalPullConfig;
  SourceConnectorProperties: SourceConnectorProperties;
}
export const SourceFlowConfig = S.suspend(() =>
  S.Struct({
    ConnectorProfileName: S.optional(S.String),
    ConnectorType: S.String,
    IncrementalPullConfig: S.optional(IncrementalPullConfig),
    SourceConnectorProperties: SourceConnectorProperties,
  }),
).annotations({
  identifier: "SourceFlowConfig",
}) as any as S.Schema<SourceFlowConfig>;
export interface Task {
  ConnectorOperator?: ConnectorOperator;
  DestinationField?: string;
  SourceFields: SourceFields;
  TaskProperties?: TaskPropertiesMap;
  TaskType: string;
}
export const Task = S.suspend(() =>
  S.Struct({
    ConnectorOperator: S.optional(ConnectorOperator),
    DestinationField: S.optional(S.String),
    SourceFields: SourceFields,
    TaskProperties: S.optional(TaskPropertiesMap),
    TaskType: S.String,
  }),
).annotations({ identifier: "Task" }) as any as S.Schema<Task>;
export type Tasks = Task[];
export const Tasks = S.Array(Task);
export interface ScheduledTriggerProperties {
  ScheduleExpression: string;
  DataPullMode?: string;
  ScheduleStartTime?: Date;
  ScheduleEndTime?: Date;
  Timezone?: string;
  ScheduleOffset?: number;
  FirstExecutionFrom?: Date;
}
export const ScheduledTriggerProperties = S.suspend(() =>
  S.Struct({
    ScheduleExpression: S.String,
    DataPullMode: S.optional(S.String),
    ScheduleStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ScheduleEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Timezone: S.optional(S.String),
    ScheduleOffset: S.optional(S.Number),
    FirstExecutionFrom: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ScheduledTriggerProperties",
}) as any as S.Schema<ScheduledTriggerProperties>;
export interface TriggerProperties {
  Scheduled?: ScheduledTriggerProperties;
}
export const TriggerProperties = S.suspend(() =>
  S.Struct({ Scheduled: S.optional(ScheduledTriggerProperties) }),
).annotations({
  identifier: "TriggerProperties",
}) as any as S.Schema<TriggerProperties>;
export interface TriggerConfig {
  TriggerType: string;
  TriggerProperties?: TriggerProperties;
}
export const TriggerConfig = S.suspend(() =>
  S.Struct({
    TriggerType: S.String,
    TriggerProperties: S.optional(TriggerProperties),
  }),
).annotations({
  identifier: "TriggerConfig",
}) as any as S.Schema<TriggerConfig>;
export interface FlowDefinition {
  Description?: string;
  FlowName: string;
  KmsArn: string;
  SourceFlowConfig: SourceFlowConfig;
  Tasks: Tasks;
  TriggerConfig: TriggerConfig;
}
export const FlowDefinition = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    FlowName: S.String,
    KmsArn: S.String,
    SourceFlowConfig: SourceFlowConfig,
    Tasks: Tasks,
    TriggerConfig: TriggerConfig,
  }),
).annotations({
  identifier: "FlowDefinition",
}) as any as S.Schema<FlowDefinition>;
export interface AppflowIntegration {
  FlowDefinition: FlowDefinition;
  Batches?: Batches;
}
export const AppflowIntegration = S.suspend(() =>
  S.Struct({ FlowDefinition: FlowDefinition, Batches: S.optional(Batches) }),
).annotations({
  identifier: "AppflowIntegration",
}) as any as S.Schema<AppflowIntegration>;
export interface GetObjectTypeAttributeStatisticsPercentiles {
  P5: number;
  P25: number;
  P50: number;
  P75: number;
  P95: number;
}
export const GetObjectTypeAttributeStatisticsPercentiles = S.suspend(() =>
  S.Struct({
    P5: S.Number,
    P25: S.Number,
    P50: S.Number,
    P75: S.Number,
    P95: S.Number,
  }),
).annotations({
  identifier: "GetObjectTypeAttributeStatisticsPercentiles",
}) as any as S.Schema<GetObjectTypeAttributeStatisticsPercentiles>;
export type Metrics = { [key: string]: number };
export const Metrics = S.Record({ key: S.String, value: S.Number });
export interface AppflowIntegrationWorkflowAttributes {
  SourceConnectorType: string;
  ConnectorProfileName: string;
  RoleArn?: string;
}
export const AppflowIntegrationWorkflowAttributes = S.suspend(() =>
  S.Struct({
    SourceConnectorType: S.String,
    ConnectorProfileName: S.String,
    RoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AppflowIntegrationWorkflowAttributes",
}) as any as S.Schema<AppflowIntegrationWorkflowAttributes>;
export interface AppflowIntegrationWorkflowMetrics {
  RecordsProcessed: number;
  StepsCompleted: number;
  TotalSteps: number;
}
export const AppflowIntegrationWorkflowMetrics = S.suspend(() =>
  S.Struct({
    RecordsProcessed: S.Number,
    StepsCompleted: S.Number,
    TotalSteps: S.Number,
  }),
).annotations({
  identifier: "AppflowIntegrationWorkflowMetrics",
}) as any as S.Schema<AppflowIntegrationWorkflowMetrics>;
export interface AppflowIntegrationWorkflowStep {
  FlowName: string;
  Status: string;
  ExecutionMessage: string;
  RecordsProcessed: number;
  BatchRecordsStartTime: string;
  BatchRecordsEndTime: string;
  CreatedAt: Date;
  LastUpdatedAt: Date;
}
export const AppflowIntegrationWorkflowStep = S.suspend(() =>
  S.Struct({
    FlowName: S.String,
    Status: S.String,
    ExecutionMessage: S.String,
    RecordsProcessed: S.Number,
    BatchRecordsStartTime: S.String,
    BatchRecordsEndTime: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "AppflowIntegrationWorkflowStep",
}) as any as S.Schema<AppflowIntegrationWorkflowStep>;
export interface DestinationSummary {
  Uri: string;
  Status: string;
  UnhealthySince?: Date;
}
export const DestinationSummary = S.suspend(() =>
  S.Struct({
    Uri: S.String,
    Status: S.String,
    UnhealthySince: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DestinationSummary",
}) as any as S.Schema<DestinationSummary>;
export interface IntegrationConfig {
  AppflowIntegration?: AppflowIntegration;
}
export const IntegrationConfig = S.suspend(() =>
  S.Struct({ AppflowIntegration: S.optional(AppflowIntegration) }),
).annotations({
  identifier: "IntegrationConfig",
}) as any as S.Schema<IntegrationConfig>;
export interface GetObjectTypeAttributeStatisticsStats {
  Maximum: number;
  Minimum: number;
  Average: number;
  StandardDeviation: number;
  Percentiles: GetObjectTypeAttributeStatisticsPercentiles;
}
export const GetObjectTypeAttributeStatisticsStats = S.suspend(() =>
  S.Struct({
    Maximum: S.Number,
    Minimum: S.Number,
    Average: S.Number,
    StandardDeviation: S.Number,
    Percentiles: GetObjectTypeAttributeStatisticsPercentiles,
  }),
).annotations({
  identifier: "GetObjectTypeAttributeStatisticsStats",
}) as any as S.Schema<GetObjectTypeAttributeStatisticsStats>;
export interface TrainingMetrics {
  Time?: Date;
  Metrics?: Metrics;
}
export const TrainingMetrics = S.suspend(() =>
  S.Struct({
    Time: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Metrics: S.optional(Metrics),
  }),
).annotations({
  identifier: "TrainingMetrics",
}) as any as S.Schema<TrainingMetrics>;
export type TrainingMetricsList = TrainingMetrics[];
export const TrainingMetricsList = S.Array(TrainingMetrics);
export interface WorkflowAttributes {
  AppflowIntegration?: AppflowIntegrationWorkflowAttributes;
}
export const WorkflowAttributes = S.suspend(() =>
  S.Struct({
    AppflowIntegration: S.optional(AppflowIntegrationWorkflowAttributes),
  }),
).annotations({
  identifier: "WorkflowAttributes",
}) as any as S.Schema<WorkflowAttributes>;
export interface WorkflowMetrics {
  AppflowIntegration?: AppflowIntegrationWorkflowMetrics;
}
export const WorkflowMetrics = S.suspend(() =>
  S.Struct({
    AppflowIntegration: S.optional(AppflowIntegrationWorkflowMetrics),
  }),
).annotations({
  identifier: "WorkflowMetrics",
}) as any as S.Schema<WorkflowMetrics>;
export interface WorkflowStepItem {
  AppflowIntegration?: AppflowIntegrationWorkflowStep;
}
export const WorkflowStepItem = S.suspend(() =>
  S.Struct({ AppflowIntegration: S.optional(AppflowIntegrationWorkflowStep) }),
).annotations({
  identifier: "WorkflowStepItem",
}) as any as S.Schema<WorkflowStepItem>;
export type WorkflowStepsList = WorkflowStepItem[];
export const WorkflowStepsList = S.Array(WorkflowStepItem);
export interface EventStreamSummary {
  DomainName: string;
  EventStreamName: string;
  EventStreamArn: string;
  State: string;
  StoppedSince?: Date;
  DestinationSummary?: DestinationSummary;
  Tags?: TagMap;
}
export const EventStreamSummary = S.suspend(() =>
  S.Struct({
    DomainName: S.String,
    EventStreamName: S.String,
    EventStreamArn: S.String,
    State: S.String,
    StoppedSince: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DestinationSummary: S.optional(DestinationSummary),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "EventStreamSummary",
}) as any as S.Schema<EventStreamSummary>;
export type EventStreamSummaryList = EventStreamSummary[];
export const EventStreamSummaryList = S.Array(EventStreamSummary);
export interface ListProfileObjectsItem {
  ObjectTypeName?: string;
  ProfileObjectUniqueKey?: string;
  Object?: string | Redacted.Redacted<string>;
}
export const ListProfileObjectsItem = S.suspend(() =>
  S.Struct({
    ObjectTypeName: S.optional(S.String),
    ProfileObjectUniqueKey: S.optional(S.String),
    Object: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ListProfileObjectsItem",
}) as any as S.Schema<ListProfileObjectsItem>;
export type ProfileObjectList = ListProfileObjectsItem[];
export const ProfileObjectList = S.Array(ListProfileObjectsItem);
export interface BatchGetProfileResponse {
  Errors?: BatchGetProfileErrorList;
  Profiles?: ProfileList;
}
export const BatchGetProfileResponse = S.suspend(() =>
  S.Struct({
    Errors: S.optional(BatchGetProfileErrorList),
    Profiles: S.optional(ProfileList),
  }),
).annotations({
  identifier: "BatchGetProfileResponse",
}) as any as S.Schema<BatchGetProfileResponse>;
export interface CreateDomainRequest {
  DomainName: string;
  DefaultExpirationDays: number;
  DefaultEncryptionKey?: string;
  DeadLetterQueueUrl?: string;
  Matching?: MatchingRequest;
  RuleBasedMatching?: RuleBasedMatchingRequest;
  DataStore?: DataStoreRequest;
  Tags?: TagMap;
}
export const CreateDomainRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    DefaultExpirationDays: S.Number,
    DefaultEncryptionKey: S.optional(S.String),
    DeadLetterQueueUrl: S.optional(S.String),
    Matching: S.optional(MatchingRequest),
    RuleBasedMatching: S.optional(RuleBasedMatchingRequest),
    DataStore: S.optional(DataStoreRequest),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains/{DomainName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDomainRequest",
}) as any as S.Schema<CreateDomainRequest>;
export interface CreateEventTriggerRequest {
  DomainName: string;
  EventTriggerName: string;
  ObjectTypeName: string;
  Description?: string | Redacted.Redacted<string>;
  EventTriggerConditions: EventTriggerConditions;
  SegmentFilter?: string;
  EventTriggerLimits?: EventTriggerLimits;
  Tags?: TagMap;
}
export const CreateEventTriggerRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    EventTriggerName: S.String.pipe(T.HttpLabel("EventTriggerName")),
    ObjectTypeName: S.String,
    Description: S.optional(SensitiveString),
    EventTriggerConditions: EventTriggerConditions,
    SegmentFilter: S.optional(S.String),
    EventTriggerLimits: S.optional(EventTriggerLimits),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/event-triggers/{EventTriggerName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEventTriggerRequest",
}) as any as S.Schema<CreateEventTriggerRequest>;
export interface CreateIntegrationWorkflowRequest {
  DomainName: string;
  WorkflowType: string;
  IntegrationConfig: IntegrationConfig;
  ObjectTypeName: string;
  RoleArn: string;
  Tags?: TagMap;
}
export const CreateIntegrationWorkflowRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    WorkflowType: S.String,
    IntegrationConfig: IntegrationConfig,
    ObjectTypeName: S.String,
    RoleArn: S.String,
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/workflows/integrations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIntegrationWorkflowRequest",
}) as any as S.Schema<CreateIntegrationWorkflowRequest>;
export interface CreateProfileResponse {
  ProfileId: string;
}
export const CreateProfileResponse = S.suspend(() =>
  S.Struct({ ProfileId: S.String }),
).annotations({
  identifier: "CreateProfileResponse",
}) as any as S.Schema<CreateProfileResponse>;
export interface CreateRecommenderRequest {
  DomainName: string;
  RecommenderName: string;
  RecommenderRecipeName: string;
  RecommenderConfig?: RecommenderConfig;
  Description?: string | Redacted.Redacted<string>;
  Tags?: TagMap;
}
export const CreateRecommenderRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    RecommenderName: S.String.pipe(T.HttpLabel("RecommenderName")),
    RecommenderRecipeName: S.String,
    RecommenderConfig: S.optional(RecommenderConfig),
    Description: S.optional(SensitiveString),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/recommenders/{RecommenderName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRecommenderRequest",
}) as any as S.Schema<CreateRecommenderRequest>;
export interface CreateUploadJobResponse {
  JobId: string;
}
export const CreateUploadJobResponse = S.suspend(() =>
  S.Struct({ JobId: S.String.pipe(T.JsonName("JobId")) }),
).annotations({
  identifier: "CreateUploadJobResponse",
}) as any as S.Schema<CreateUploadJobResponse>;
export interface GetIdentityResolutionJobResponse {
  DomainName?: string;
  JobId?: string;
  Status?: string;
  Message?: string;
  JobStartTime?: Date;
  JobEndTime?: Date;
  LastUpdatedAt?: Date;
  JobExpirationTime?: Date;
  AutoMerging?: AutoMerging;
  ExportingLocation?: ExportingLocation;
  JobStats?: JobStats;
}
export const GetIdentityResolutionJobResponse = S.suspend(() =>
  S.Struct({
    DomainName: S.optional(S.String),
    JobId: S.optional(S.String),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
    JobStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    JobEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    JobExpirationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AutoMerging: S.optional(AutoMerging),
    ExportingLocation: S.optional(ExportingLocation),
    JobStats: S.optional(JobStats),
  }),
).annotations({
  identifier: "GetIdentityResolutionJobResponse",
}) as any as S.Schema<GetIdentityResolutionJobResponse>;
export interface GetObjectTypeAttributeStatisticsResponse {
  Statistics: GetObjectTypeAttributeStatisticsStats;
  CalculatedAt: Date;
}
export const GetObjectTypeAttributeStatisticsResponse = S.suspend(() =>
  S.Struct({
    Statistics: GetObjectTypeAttributeStatisticsStats,
    CalculatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "GetObjectTypeAttributeStatisticsResponse",
}) as any as S.Schema<GetObjectTypeAttributeStatisticsResponse>;
export interface GetRecommenderResponse {
  RecommenderName: string;
  RecommenderRecipeName: string;
  RecommenderConfig?: RecommenderConfig;
  Description?: string | Redacted.Redacted<string>;
  Status?: string;
  LastUpdatedAt?: Date;
  CreatedAt?: Date;
  FailureReason?: string;
  LatestRecommenderUpdate?: RecommenderUpdate;
  TrainingMetrics?: TrainingMetricsList;
  Tags?: TagMap;
}
export const GetRecommenderResponse = S.suspend(() =>
  S.Struct({
    RecommenderName: S.String,
    RecommenderRecipeName: S.String,
    RecommenderConfig: S.optional(RecommenderConfig),
    Description: S.optional(SensitiveString),
    Status: S.optional(S.String),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FailureReason: S.optional(S.String),
    LatestRecommenderUpdate: S.optional(RecommenderUpdate),
    TrainingMetrics: S.optional(TrainingMetricsList),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetRecommenderResponse",
}) as any as S.Schema<GetRecommenderResponse>;
export interface GetWorkflowResponse {
  WorkflowId?: string;
  WorkflowType?: string;
  Status?: string;
  ErrorDescription?: string;
  StartDate?: Date;
  LastUpdatedAt?: Date;
  Attributes?: WorkflowAttributes;
  Metrics?: WorkflowMetrics;
}
export const GetWorkflowResponse = S.suspend(() =>
  S.Struct({
    WorkflowId: S.optional(S.String),
    WorkflowType: S.optional(S.String),
    Status: S.optional(S.String),
    ErrorDescription: S.optional(S.String),
    StartDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Attributes: S.optional(WorkflowAttributes),
    Metrics: S.optional(WorkflowMetrics),
  }),
).annotations({
  identifier: "GetWorkflowResponse",
}) as any as S.Schema<GetWorkflowResponse>;
export interface GetWorkflowStepsResponse {
  WorkflowId?: string;
  WorkflowType?: string;
  Items?: WorkflowStepsList;
  NextToken?: string;
}
export const GetWorkflowStepsResponse = S.suspend(() =>
  S.Struct({
    WorkflowId: S.optional(S.String),
    WorkflowType: S.optional(S.String),
    Items: S.optional(WorkflowStepsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetWorkflowStepsResponse",
}) as any as S.Schema<GetWorkflowStepsResponse>;
export interface ListEventStreamsResponse {
  Items?: EventStreamSummaryList;
  NextToken?: string;
}
export const ListEventStreamsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(EventStreamSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEventStreamsResponse",
}) as any as S.Schema<ListEventStreamsResponse>;
export interface ListProfileObjectsResponse {
  Items?: ProfileObjectList;
  NextToken?: string;
}
export const ListProfileObjectsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(ProfileObjectList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProfileObjectsResponse",
}) as any as S.Schema<ListProfileObjectsResponse>;
export interface MergeProfilesResponse {
  Message?: string;
}
export const MergeProfilesResponse = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String) }),
).annotations({
  identifier: "MergeProfilesResponse",
}) as any as S.Schema<MergeProfilesResponse>;
export interface PutDomainObjectTypeResponse {
  ObjectTypeName?: string;
  Description?: string | Redacted.Redacted<string>;
  EncryptionKey?: string;
  Fields?: DomainObjectTypeFields;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  Tags?: TagMap;
}
export const PutDomainObjectTypeResponse = S.suspend(() =>
  S.Struct({
    ObjectTypeName: S.optional(S.String),
    Description: S.optional(SensitiveString),
    EncryptionKey: S.optional(S.String),
    Fields: S.optional(DomainObjectTypeFields),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "PutDomainObjectTypeResponse",
}) as any as S.Schema<PutDomainObjectTypeResponse>;
export interface PutProfileObjectTypeResponse {
  ObjectTypeName: string;
  Description: string | Redacted.Redacted<string>;
  TemplateId?: string;
  ExpirationDays?: number;
  EncryptionKey?: string;
  AllowProfileCreation?: boolean;
  SourceLastUpdatedTimestampFormat?: string;
  MaxProfileObjectCount?: number;
  MaxAvailableProfileObjectCount?: number;
  Fields?: FieldMap;
  Keys?: KeyMap;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  Tags?: TagMap;
}
export const PutProfileObjectTypeResponse = S.suspend(() =>
  S.Struct({
    ObjectTypeName: S.String,
    Description: SensitiveString,
    TemplateId: S.optional(S.String),
    ExpirationDays: S.optional(S.Number),
    EncryptionKey: S.optional(S.String),
    AllowProfileCreation: S.optional(S.Boolean),
    SourceLastUpdatedTimestampFormat: S.optional(S.String),
    MaxProfileObjectCount: S.optional(S.Number),
    MaxAvailableProfileObjectCount: S.optional(S.Number),
    Fields: S.optional(FieldMap),
    Keys: S.optional(KeyMap),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "PutProfileObjectTypeResponse",
}) as any as S.Schema<PutProfileObjectTypeResponse>;
export interface CatalogItem {
  Id?: string | Redacted.Redacted<string>;
  Name?: string | Redacted.Redacted<string>;
  Code?: string | Redacted.Redacted<string>;
  Type?: string | Redacted.Redacted<string>;
  Category?: string | Redacted.Redacted<string>;
  Description?: string | Redacted.Redacted<string>;
  AdditionalInformation?: string | Redacted.Redacted<string>;
  ImageLink?: string | Redacted.Redacted<string>;
  Link?: string | Redacted.Redacted<string>;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  Price?: string | Redacted.Redacted<string>;
  Attributes?: Attributes;
}
export const CatalogItem = S.suspend(() =>
  S.Struct({
    Id: S.optional(SensitiveString),
    Name: S.optional(SensitiveString),
    Code: S.optional(SensitiveString),
    Type: S.optional(SensitiveString),
    Category: S.optional(SensitiveString),
    Description: S.optional(SensitiveString),
    AdditionalInformation: S.optional(SensitiveString),
    ImageLink: S.optional(SensitiveString),
    Link: S.optional(SensitiveString),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Price: S.optional(SensitiveString),
    Attributes: S.optional(Attributes),
  }),
).annotations({ identifier: "CatalogItem" }) as any as S.Schema<CatalogItem>;
export interface BatchGetCalculatedAttributeForProfileError {
  Code: string;
  Message: string;
  ProfileId: string;
}
export const BatchGetCalculatedAttributeForProfileError = S.suspend(() =>
  S.Struct({ Code: S.String, Message: S.String, ProfileId: S.String }),
).annotations({
  identifier: "BatchGetCalculatedAttributeForProfileError",
}) as any as S.Schema<BatchGetCalculatedAttributeForProfileError>;
export type BatchGetCalculatedAttributeForProfileErrorList =
  BatchGetCalculatedAttributeForProfileError[];
export const BatchGetCalculatedAttributeForProfileErrorList = S.Array(
  BatchGetCalculatedAttributeForProfileError,
);
export interface CalculatedAttributeValue {
  CalculatedAttributeName?: string;
  DisplayName?: string;
  IsDataPartial?: string;
  ProfileId?: string;
  Value?: string;
  LastObjectTimestamp?: Date;
}
export const CalculatedAttributeValue = S.suspend(() =>
  S.Struct({
    CalculatedAttributeName: S.optional(S.String),
    DisplayName: S.optional(S.String),
    IsDataPartial: S.optional(S.String),
    ProfileId: S.optional(S.String),
    Value: S.optional(S.String),
    LastObjectTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "CalculatedAttributeValue",
}) as any as S.Schema<CalculatedAttributeValue>;
export type CalculatedAttributeValueList = CalculatedAttributeValue[];
export const CalculatedAttributeValueList = S.Array(CalculatedAttributeValue);
export interface Recommendation {
  CatalogItem?: CatalogItem;
  Score?: number;
}
export const Recommendation = S.suspend(() =>
  S.Struct({
    CatalogItem: S.optional(CatalogItem),
    Score: S.optional(S.Number),
  }),
).annotations({
  identifier: "Recommendation",
}) as any as S.Schema<Recommendation>;
export type Recommendations = Recommendation[];
export const Recommendations = S.Array(Recommendation);
export interface BatchGetCalculatedAttributeForProfileResponse {
  Errors?: BatchGetCalculatedAttributeForProfileErrorList;
  CalculatedAttributeValues?: CalculatedAttributeValueList;
  ConditionOverrides?: ConditionOverrides;
}
export const BatchGetCalculatedAttributeForProfileResponse = S.suspend(() =>
  S.Struct({
    Errors: S.optional(BatchGetCalculatedAttributeForProfileErrorList),
    CalculatedAttributeValues: S.optional(CalculatedAttributeValueList),
    ConditionOverrides: S.optional(ConditionOverrides),
  }),
).annotations({
  identifier: "BatchGetCalculatedAttributeForProfileResponse",
}) as any as S.Schema<BatchGetCalculatedAttributeForProfileResponse>;
export interface CreateDomainResponse {
  DomainName: string;
  DefaultExpirationDays: number;
  DefaultEncryptionKey?: string;
  DeadLetterQueueUrl?: string;
  Matching?: MatchingResponse;
  RuleBasedMatching?: RuleBasedMatchingResponse;
  DataStore?: DataStoreResponse;
  CreatedAt: Date;
  LastUpdatedAt: Date;
  Tags?: TagMap;
}
export const CreateDomainResponse = S.suspend(() =>
  S.Struct({
    DomainName: S.String,
    DefaultExpirationDays: S.Number,
    DefaultEncryptionKey: S.optional(S.String),
    DeadLetterQueueUrl: S.optional(S.String),
    Matching: S.optional(MatchingResponse),
    RuleBasedMatching: S.optional(RuleBasedMatchingResponse),
    DataStore: S.optional(DataStoreResponse),
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "CreateDomainResponse",
}) as any as S.Schema<CreateDomainResponse>;
export interface CreateEventTriggerResponse {
  EventTriggerName?: string;
  ObjectTypeName?: string;
  Description?: string | Redacted.Redacted<string>;
  EventTriggerConditions?: EventTriggerConditions;
  SegmentFilter?: string;
  EventTriggerLimits?: EventTriggerLimits;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  Tags?: TagMap;
}
export const CreateEventTriggerResponse = S.suspend(() =>
  S.Struct({
    EventTriggerName: S.optional(S.String),
    ObjectTypeName: S.optional(S.String),
    Description: S.optional(SensitiveString),
    EventTriggerConditions: S.optional(EventTriggerConditions),
    SegmentFilter: S.optional(S.String),
    EventTriggerLimits: S.optional(EventTriggerLimits),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "CreateEventTriggerResponse",
}) as any as S.Schema<CreateEventTriggerResponse>;
export interface CreateIntegrationWorkflowResponse {
  WorkflowId: string;
  Message: string;
}
export const CreateIntegrationWorkflowResponse = S.suspend(() =>
  S.Struct({ WorkflowId: S.String, Message: S.String }),
).annotations({
  identifier: "CreateIntegrationWorkflowResponse",
}) as any as S.Schema<CreateIntegrationWorkflowResponse>;
export interface CreateRecommenderResponse {
  RecommenderArn: string;
  Tags?: TagMap;
}
export const CreateRecommenderResponse = S.suspend(() =>
  S.Struct({ RecommenderArn: S.String, Tags: S.optional(TagMap) }),
).annotations({
  identifier: "CreateRecommenderResponse",
}) as any as S.Schema<CreateRecommenderResponse>;
export interface GetProfileRecommendationsResponse {
  Recommendations?: Recommendations;
}
export const GetProfileRecommendationsResponse = S.suspend(() =>
  S.Struct({ Recommendations: S.optional(Recommendations) }),
).annotations({
  identifier: "GetProfileRecommendationsResponse",
}) as any as S.Schema<GetProfileRecommendationsResponse>;
export interface PutIntegrationRequest {
  DomainName: string;
  Uri?: string;
  ObjectTypeName?: string;
  ObjectTypeNames?: ObjectTypeNames;
  Tags?: TagMap;
  FlowDefinition?: FlowDefinition;
  RoleArn?: string;
  EventTriggerNames?: EventTriggerNames;
  Scope?: string;
}
export const PutIntegrationRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Uri: S.optional(S.String),
    ObjectTypeName: S.optional(S.String),
    ObjectTypeNames: S.optional(ObjectTypeNames),
    Tags: S.optional(TagMap),
    FlowDefinition: S.optional(FlowDefinition),
    RoleArn: S.optional(S.String),
    EventTriggerNames: S.optional(EventTriggerNames),
    Scope: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/domains/{DomainName}/integrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutIntegrationRequest",
}) as any as S.Schema<PutIntegrationRequest>;
export interface CreateCalculatedAttributeDefinitionRequest {
  DomainName: string;
  CalculatedAttributeName: string;
  DisplayName?: string;
  Description?: string | Redacted.Redacted<string>;
  AttributeDetails: AttributeDetails;
  Conditions?: Conditions;
  Filter?: Filter;
  Statistic: string;
  UseHistoricalData?: boolean;
  Tags?: TagMap;
}
export const CreateCalculatedAttributeDefinitionRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    CalculatedAttributeName: S.String.pipe(
      T.HttpLabel("CalculatedAttributeName"),
    ),
    DisplayName: S.optional(S.String),
    Description: S.optional(SensitiveString),
    AttributeDetails: AttributeDetails,
    Conditions: S.optional(Conditions),
    Filter: S.optional(Filter),
    Statistic: S.String,
    UseHistoricalData: S.optional(S.Boolean),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/calculated-attributes/{CalculatedAttributeName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCalculatedAttributeDefinitionRequest",
}) as any as S.Schema<CreateCalculatedAttributeDefinitionRequest>;
export interface PutIntegrationResponse {
  DomainName: string;
  Uri: string;
  ObjectTypeName?: string;
  CreatedAt: Date;
  LastUpdatedAt: Date;
  Tags?: TagMap;
  ObjectTypeNames?: ObjectTypeNames;
  WorkflowId?: string;
  IsUnstructured?: boolean;
  RoleArn?: string;
  EventTriggerNames?: EventTriggerNames;
  Scope?: string;
}
export const PutIntegrationResponse = S.suspend(() =>
  S.Struct({
    DomainName: S.String,
    Uri: S.String,
    ObjectTypeName: S.optional(S.String),
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Tags: S.optional(TagMap),
    ObjectTypeNames: S.optional(ObjectTypeNames),
    WorkflowId: S.optional(S.String),
    IsUnstructured: S.optional(S.Boolean),
    RoleArn: S.optional(S.String),
    EventTriggerNames: S.optional(EventTriggerNames),
    Scope: S.optional(S.String),
  }),
).annotations({
  identifier: "PutIntegrationResponse",
}) as any as S.Schema<PutIntegrationResponse>;
export interface CreateCalculatedAttributeDefinitionResponse {
  CalculatedAttributeName?: string;
  DisplayName?: string;
  Description?: string | Redacted.Redacted<string>;
  AttributeDetails?: AttributeDetails;
  Conditions?: Conditions;
  Filter?: Filter;
  Statistic?: string;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  UseHistoricalData?: boolean;
  Status?: string;
  Readiness?: Readiness;
  Tags?: TagMap;
}
export const CreateCalculatedAttributeDefinitionResponse = S.suspend(() =>
  S.Struct({
    CalculatedAttributeName: S.optional(S.String),
    DisplayName: S.optional(S.String),
    Description: S.optional(SensitiveString),
    AttributeDetails: S.optional(AttributeDetails),
    Conditions: S.optional(Conditions),
    Filter: S.optional(Filter),
    Statistic: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UseHistoricalData: S.optional(S.Boolean),
    Status: S.optional(S.String),
    Readiness: S.optional(Readiness),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "CreateCalculatedAttributeDefinitionResponse",
}) as any as S.Schema<CreateCalculatedAttributeDefinitionResponse>;
export interface CreateSegmentDefinitionRequest {
  DomainName: string;
  SegmentDefinitionName: string;
  DisplayName: string;
  Description?: string | Redacted.Redacted<string>;
  SegmentGroups?: SegmentGroup;
  SegmentSqlQuery?: string | Redacted.Redacted<string>;
  Tags?: TagMap;
}
export const CreateSegmentDefinitionRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    SegmentDefinitionName: S.String.pipe(T.HttpLabel("SegmentDefinitionName")),
    DisplayName: S.String,
    Description: S.optional(SensitiveString),
    SegmentGroups: S.optional(SegmentGroup),
    SegmentSqlQuery: S.optional(SensitiveString),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domains/{DomainName}/segment-definitions/{SegmentDefinitionName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSegmentDefinitionRequest",
}) as any as S.Schema<CreateSegmentDefinitionRequest>;
export interface CreateSegmentDefinitionResponse {
  SegmentDefinitionName: string;
  DisplayName?: string;
  Description?: string | Redacted.Redacted<string>;
  CreatedAt?: Date;
  SegmentDefinitionArn?: string;
  Tags?: TagMap;
}
export const CreateSegmentDefinitionResponse = S.suspend(() =>
  S.Struct({
    SegmentDefinitionName: S.String.pipe(T.JsonName("SegmentDefinitionName")),
    DisplayName: S.optional(S.String).pipe(T.JsonName("DisplayName")),
    Description: S.optional(SensitiveString).pipe(T.JsonName("Description")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("CreatedAt"),
    ),
    SegmentDefinitionArn: S.optional(S.String).pipe(
      T.JsonName("SegmentDefinitionArn"),
    ),
    Tags: S.optional(TagMap).pipe(T.JsonName("Tags")),
  }),
).annotations({
  identifier: "CreateSegmentDefinitionResponse",
}) as any as S.Schema<CreateSegmentDefinitionResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}

//# Operations
/**
 * Assigns one or more tags (key-value pairs) to the specified Amazon Connect Customer Profiles
 * resource. Tags can help you organize and categorize your resources. You can also use them
 * to scope user permissions by granting a user permission to access or change only resources
 * with certain tag values. In Connect Customer Profiles, domains, profile object types, and
 * integrations can be tagged.
 *
 * Tags don't have any semantic meaning to AWS and are interpreted strictly as strings of
 * characters.
 *
 * You can use the TagResource action with a resource that already has tags. If you specify
 * a new tag key, this tag is appended to the list of tags associated with the resource. If
 * you specify a tag key that is already associated with the resource, the new tag value that
 * you specify replaces the previous value for that tag.
 *
 * You can associate as many as 50 tags with a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of available recommender recipes that can be used to create recommenders.
 */
export const listRecommenderRecipes: {
  (
    input: ListRecommenderRecipesRequest,
  ): Effect.Effect<
    ListRecommenderRecipesResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecommenderRecipesRequest,
  ) => Stream.Stream<
    ListRecommenderRecipesResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecommenderRecipesRequest,
  ) => Stream.Stream<
    RecommenderRecipe,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRecommenderRecipesRequest,
  output: ListRecommenderRecipesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RecommenderRecipes",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates the properties of a profile. The ProfileId is required for updating a customer
 * profile.
 *
 * When calling the UpdateProfile API, specifying an empty string value means that any
 * existing value will be removed. Not specifying a string value means that any value already
 * there will be kept.
 */
export const updateProfile: (
  input: UpdateProfileRequest,
) => Effect.Effect<
  UpdateProfileResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProfileRequest,
  output: UpdateProfileResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates an existing calculated attribute definition. When updating the Conditions, note
 * that increasing the date range of a calculated attribute will not trigger inclusion of
 * historical data greater than the current date range.
 */
export const updateCalculatedAttributeDefinition: (
  input: UpdateCalculatedAttributeDefinitionRequest,
) => Effect.Effect<
  UpdateCalculatedAttributeDefinitionResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCalculatedAttributeDefinitionRequest,
  output: UpdateCalculatedAttributeDefinitionResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the properties of a domain, including creating or selecting a dead letter queue
 * or an encryption key.
 *
 * After a domain is created, the name can’t be changed.
 *
 * Use this API or CreateDomain to
 * enable identity
 * resolution: set `Matching` to true.
 *
 * To prevent cross-service impersonation when you call this API, see Cross-service confused deputy prevention for sample policies that you should
 * apply.
 *
 * To add or remove tags on an existing Domain, see TagResource/UntagResource.
 */
export const updateDomain: (
  input: UpdateDomainRequest,
) => Effect.Effect<
  UpdateDomainResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDomainRequest,
  output: UpdateDomainResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the layout used to view data for a specific domain. This API can only be invoked
 * from the Amazon Connect admin website.
 */
export const updateDomainLayout: (
  input: UpdateDomainLayoutRequest,
) => Effect.Effect<
  UpdateDomainLayoutResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDomainLayoutRequest,
  output: UpdateDomainLayoutResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Update the properties of an Event Trigger.
 */
export const updateEventTrigger: (
  input: UpdateEventTriggerRequest,
) => Effect.Effect<
  UpdateEventTriggerResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEventTriggerRequest,
  output: UpdateEventTriggerResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the properties of an existing recommender, allowing you to modify its configuration and description.
 */
export const updateRecommender: (
  input: UpdateRecommenderRequest,
) => Effect.Effect<
  UpdateRecommenderResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRecommenderRequest,
  output: UpdateRecommenderResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Delete a DomainObjectType for the given Domain and ObjectType name.
 */
export const deleteDomainObjectType: (
  input: DeleteDomainObjectTypeRequest,
) => Effect.Effect<
  DeleteDomainObjectTypeResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainObjectTypeRequest,
  output: DeleteDomainObjectTypeResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Disables and deletes the specified event stream.
 */
export const deleteEventStream: (
  input: DeleteEventStreamRequest,
) => Effect.Effect<
  DeleteEventStreamResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventStreamRequest,
  output: DeleteEventStreamResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a recommender.
 */
export const deleteRecommender: (
  input: DeleteRecommenderRequest,
) => Effect.Effect<
  DeleteRecommenderResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRecommenderRequest,
  output: DeleteRecommenderResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the specified workflow and all its corresponding resources. This is an async
 * process.
 */
export const deleteWorkflow: (
  input: DeleteWorkflowRequest,
) => Effect.Effect<
  DeleteWorkflowResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkflowRequest,
  output: DeleteWorkflowResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Starts a recommender that was previously stopped. Starting a recommender resumes its ability to generate recommendations.
 */
export const startRecommender: (
  input: StartRecommenderRequest,
) => Effect.Effect<
  StartRecommenderResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartRecommenderRequest,
  output: StartRecommenderResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * This API starts the processing of an upload job to ingest profile data.
 */
export const startUploadJob: (
  input: StartUploadJobRequest,
) => Effect.Effect<
  StartUploadJobResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartUploadJobRequest,
  output: StartUploadJobResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Stops a recommender, suspending its ability to generate recommendations. The recommender can be restarted later using StartRecommender.
 */
export const stopRecommender: (
  input: StopRecommenderRequest,
) => Effect.Effect<
  StopRecommenderResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopRecommenderRequest,
  output: StopRecommenderResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * This API stops the processing of an upload job.
 */
export const stopUploadJob: (
  input: StopUploadJobRequest,
) => Effect.Effect<
  StopUploadJobResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopUploadJobRequest,
  output: StopUploadJobResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Associates a new key value with a specific profile, such as a Contact Record
 * ContactId.
 *
 * A profile object can have a single unique key and any number of additional keys that can
 * be used to identify the profile that it belongs to.
 */
export const addProfileKey: (
  input: AddProfileKeyRequest,
) => Effect.Effect<
  AddProfileKeyResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddProfileKeyRequest,
  output: AddProfileKeyResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates the layout to view data for a specific domain. This API can only be invoked from
 * the Amazon Connect admin website.
 */
export const createDomainLayout: (
  input: CreateDomainLayoutRequest,
) => Effect.Effect<
  CreateDomainLayoutResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainLayoutRequest,
  output: CreateDomainLayoutResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates an event stream, which is a subscription to real-time events, such as when
 * profiles are created and updated through Amazon Connect Customer Profiles.
 *
 * Each event stream can be associated with only one Kinesis Data Stream destination in the
 * same region and Amazon Web Services account as the customer profiles domain
 */
export const createEventStream: (
  input: CreateEventStreamRequest,
) => Effect.Effect<
  CreateEventStreamResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEventStreamRequest,
  output: CreateEventStreamResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Triggers a job to export a segment to a specified destination.
 */
export const createSegmentSnapshot: (
  input: CreateSegmentSnapshotRequest,
) => Effect.Effect<
  CreateSegmentSnapshotResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSegmentSnapshotRequest,
  output: CreateSegmentSnapshotResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes one or more tags from the specified Amazon Connect Customer Profiles resource. In Connect
 * Customer Profiles, domains, profile object types, and integrations can be tagged.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes an existing calculated attribute definition. Note that deleting a default
 * calculated attribute is possible, however once deleted, you will be unable to undo that
 * action and will need to recreate it on your own using the
 * CreateCalculatedAttributeDefinition API if you want it back.
 */
export const deleteCalculatedAttributeDefinition: (
  input: DeleteCalculatedAttributeDefinitionRequest,
) => Effect.Effect<
  DeleteCalculatedAttributeDefinitionResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCalculatedAttributeDefinitionRequest,
  output: DeleteCalculatedAttributeDefinitionResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a specific domain and all of its customer data, such as customer profile
 * attributes and their related objects.
 */
export const deleteDomain: (
  input: DeleteDomainRequest,
) => Effect.Effect<
  DeleteDomainResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainRequest,
  output: DeleteDomainResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the layout used to view data for a specific domain. This API can only be invoked
 * from the Amazon Connect admin website.
 */
export const deleteDomainLayout: (
  input: DeleteDomainLayoutRequest,
) => Effect.Effect<
  DeleteDomainLayoutResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainLayoutRequest,
  output: DeleteDomainLayoutResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Disable and deletes the Event Trigger.
 *
 * You cannot delete an Event Trigger with an active Integration associated.
 */
export const deleteEventTrigger: (
  input: DeleteEventTriggerRequest,
) => Effect.Effect<
  DeleteEventTriggerResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventTriggerRequest,
  output: DeleteEventTriggerResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes an integration from a specific domain.
 */
export const deleteIntegration: (
  input: DeleteIntegrationRequest,
) => Effect.Effect<
  DeleteIntegrationResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIntegrationRequest,
  output: DeleteIntegrationResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the standard customer profile and all data pertaining to the profile.
 */
export const deleteProfile: (
  input: DeleteProfileRequest,
) => Effect.Effect<
  DeleteProfileResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProfileRequest,
  output: DeleteProfileResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes a searchable key from a customer profile.
 */
export const deleteProfileKey: (
  input: DeleteProfileKeyRequest,
) => Effect.Effect<
  DeleteProfileKeyResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProfileKeyRequest,
  output: DeleteProfileKeyResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes an object associated with a profile of a given ProfileObjectType.
 */
export const deleteProfileObject: (
  input: DeleteProfileObjectRequest,
) => Effect.Effect<
  DeleteProfileObjectResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProfileObjectRequest,
  output: DeleteProfileObjectResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes a ProfileObjectType from a specific domain as well as removes all the
 * ProfileObjects of that type. It also disables integrations from this specific
 * ProfileObjectType. In addition, it scrubs all of the fields of the standard profile that
 * were populated from this ProfileObjectType.
 */
export const deleteProfileObjectType: (
  input: DeleteProfileObjectTypeRequest,
) => Effect.Effect<
  DeleteProfileObjectTypeResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProfileObjectTypeRequest,
  output: DeleteProfileObjectTypeResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a segment definition from the domain.
 */
export const deleteSegmentDefinition: (
  input: DeleteSegmentDefinitionRequest,
) => Effect.Effect<
  DeleteSegmentDefinitionResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSegmentDefinitionRequest,
  output: DeleteSegmentDefinitionResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieve a calculated attribute for a customer profile.
 */
export const getCalculatedAttributeForProfile: (
  input: GetCalculatedAttributeForProfileRequest,
) => Effect.Effect<
  GetCalculatedAttributeForProfileResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCalculatedAttributeForProfileRequest,
  output: GetCalculatedAttributeForProfileResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets the layout to view data for a specific domain. This API can only be invoked from
 * the Amazon Connect admin website.
 */
export const getDomainLayout: (
  input: GetDomainLayoutRequest,
) => Effect.Effect<
  GetDomainLayoutResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainLayoutRequest,
  output: GetDomainLayoutResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Return a DomainObjectType for the input Domain and ObjectType names.
 */
export const getDomainObjectType: (
  input: GetDomainObjectTypeRequest,
) => Effect.Effect<
  GetDomainObjectTypeResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainObjectTypeRequest,
  output: GetDomainObjectTypeResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Get a specific Event Trigger from the domain.
 */
export const getEventTrigger: (
  input: GetEventTriggerRequest,
) => Effect.Effect<
  GetEventTriggerResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventTriggerRequest,
  output: GetEventTriggerResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns an integration for a domain.
 */
export const getIntegration: (
  input: GetIntegrationRequest,
) => Effect.Effect<
  GetIntegrationResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIntegrationRequest,
  output: GetIntegrationResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns a history record for a specific profile, for a specific domain.
 */
export const getProfileHistoryRecord: (
  input: GetProfileHistoryRecordRequest,
) => Effect.Effect<
  GetProfileHistoryRecordResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProfileHistoryRecordRequest,
  output: GetProfileHistoryRecordResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns the object types for a specific domain.
 */
export const getProfileObjectType: (
  input: GetProfileObjectTypeRequest,
) => Effect.Effect<
  GetProfileObjectTypeResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProfileObjectTypeRequest,
  output: GetProfileObjectTypeResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns the template information for a specific object type.
 *
 * A template is a predefined ProfileObjectType, such as “Salesforce-Account” or
 * “Salesforce-Contact.” When a user sends a ProfileObject, using the PutProfileObject API,
 * with an ObjectTypeName that matches one of the TemplateIds, it uses the mappings from the
 * template.
 */
export const getProfileObjectTypeTemplate: (
  input: GetProfileObjectTypeTemplateRequest,
) => Effect.Effect<
  GetProfileObjectTypeTemplateResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProfileObjectTypeTemplateRequest,
  output: GetProfileObjectTypeTemplateResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets a segment definition from the domain.
 */
export const getSegmentDefinition: (
  input: GetSegmentDefinitionRequest,
) => Effect.Effect<
  GetSegmentDefinitionResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSegmentDefinitionRequest,
  output: GetSegmentDefinitionResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets the result of a segment estimate query.
 */
export const getSegmentEstimate: (
  input: GetSegmentEstimateRequest,
) => Effect.Effect<
  GetSegmentEstimateResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSegmentEstimateRequest,
  output: GetSegmentEstimateResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieve the latest status of a segment snapshot.
 */
export const getSegmentSnapshot: (
  input: GetSegmentSnapshotRequest,
) => Effect.Effect<
  GetSegmentSnapshotResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSegmentSnapshotRequest,
  output: GetSegmentSnapshotResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns a set of profiles that belong to the same matching group using the
 * `matchId` or `profileId`. You can also specify the type of
 * matching that you want for finding similar profiles using either
 * `RULE_BASED_MATCHING` or `ML_BASED_MATCHING`.
 */
export const getSimilarProfiles: {
  (
    input: GetSimilarProfilesRequest,
  ): Effect.Effect<
    GetSimilarProfilesResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetSimilarProfilesRequest,
  ) => Stream.Stream<
    GetSimilarProfilesResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetSimilarProfilesRequest,
  ) => Stream.Stream<
    uuid,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetSimilarProfilesRequest,
  output: GetSimilarProfilesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ProfileIds",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This API retrieves the pre-signed URL and client token for uploading the file associated
 * with the upload job.
 */
export const getUploadJobPath: (
  input: GetUploadJobPathRequest,
) => Effect.Effect<
  GetUploadJobPathResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUploadJobPathRequest,
  output: GetUploadJobPathResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists all of the integrations in your domain.
 */
export const listIntegrations: (
  input: ListIntegrationsRequest,
) => Effect.Effect<
  ListIntegrationsResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIntegrationsRequest,
  output: ListIntegrationsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns a set of `MatchIds` that belong to the given domain.
 */
export const listRuleBasedMatches: {
  (
    input: ListRuleBasedMatchesRequest,
  ): Effect.Effect<
    ListRuleBasedMatchesResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRuleBasedMatchesRequest,
  ) => Stream.Stream<
    ListRuleBasedMatchesResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRuleBasedMatchesRequest,
  ) => Stream.Stream<
    string1To255,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRuleBasedMatchesRequest,
  output: ListRuleBasedMatchesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "MatchIds",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Displays the tags associated with an Amazon Connect Customer Profiles resource. In Connect
 * Customer Profiles, domains, profile object types, and integrations can be tagged.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Adds additional objects to customer profiles of a given ObjectType.
 *
 * When adding a specific profile object, like a Contact Record, an inferred profile can
 * get created if it is not mapped to an existing profile. The resulting profile will only
 * have a phone number populated in the standard ProfileObject. Any additional Contact Records
 * with the same phone number will be mapped to the same inferred profile.
 *
 * When a ProfileObject is created and if a ProfileObjectType already exists for the
 * ProfileObject, it will provide data to a standard profile depending on the
 * ProfileObjectType definition.
 *
 * PutProfileObject needs an ObjectType, which can be created using
 * PutProfileObjectType.
 */
export const putProfileObject: (
  input: PutProfileObjectRequest,
) => Effect.Effect<
  PutProfileObjectResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutProfileObjectRequest,
  output: PutProfileObjectResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a segment estimate query.
 */
export const createSegmentEstimate: (
  input: CreateSegmentEstimateRequest,
) => Effect.Effect<
  CreateSegmentEstimateResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSegmentEstimateRequest,
  output: CreateSegmentEstimateResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * The process of detecting profile object type mapping by using given objects.
 */
export const detectProfileObjectType: (
  input: DetectProfileObjectTypeRequest,
) => Effect.Effect<
  DetectProfileObjectTypeResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetectProfileObjectTypeRequest,
  output: DetectProfileObjectTypeResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Tests the auto-merging settings of your Identity Resolution Job without merging your data. It randomly
 * selects a sample of matching groups from the existing matching results, and applies the
 * automerging settings that you provided. You can then view the number of profiles in the
 * sample, the number of matches, and the number of profiles identified to be merged. This
 * enables you to evaluate the accuracy of the attributes in your matching list.
 *
 * You can't view which profiles are matched and would be merged.
 *
 * We strongly recommend you use this API to do a dry run of the automerging process
 * before running the Identity Resolution Job. Include **at least** two matching
 * attributes. If your matching list includes too few attributes (such as only
 * `FirstName` or only `LastName`), there may be a large number of
 * matches. This increases the chances of erroneous merges.
 */
export const getAutoMergingPreview: (
  input: GetAutoMergingPreviewRequest,
) => Effect.Effect<
  GetAutoMergingPreviewResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutoMergingPreviewRequest,
  output: GetAutoMergingPreviewResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Provides more information on a calculated attribute definition for Customer
 * Profiles.
 */
export const getCalculatedAttributeDefinition: (
  input: GetCalculatedAttributeDefinitionRequest,
) => Effect.Effect<
  GetCalculatedAttributeDefinitionResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCalculatedAttributeDefinitionRequest,
  output: GetCalculatedAttributeDefinitionResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns information about a specific domain.
 */
export const getDomain: (
  input: GetDomainRequest,
) => Effect.Effect<
  GetDomainResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainRequest,
  output: GetDomainResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns information about the specified event stream in a specific domain.
 */
export const getEventStream: (
  input: GetEventStreamRequest,
) => Effect.Effect<
  GetEventStreamResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventStreamRequest,
  output: GetEventStreamResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Before calling this API, use CreateDomain or
 * UpdateDomain to
 * enable identity resolution: set `Matching` to true.
 *
 * GetMatches returns potentially matching profiles, based on the results of the latest run
 * of a machine learning process.
 *
 * The process of matching duplicate profiles. If `Matching` = `true`, Amazon Connect Customer Profiles starts a weekly
 * batch process called Identity Resolution Job. If you do not specify a date and time for Identity Resolution Job to run, by default it runs every
 * Saturday at 12AM UTC to detect duplicate profiles in your domains.
 *
 * After the Identity Resolution Job completes, use the
 * GetMatches
 * API to return and review the results. Or, if you have configured `ExportingConfig` in the `MatchingRequest`, you can download the results from
 * S3.
 *
 * Amazon Connect uses the following profile attributes to identify matches:
 *
 * - PhoneNumber
 *
 * - HomePhoneNumber
 *
 * - BusinessPhoneNumber
 *
 * - MobilePhoneNumber
 *
 * - EmailAddress
 *
 * - PersonalEmailAddress
 *
 * - BusinessEmailAddress
 *
 * - FullName
 *
 * For example, two or more profiles—with spelling mistakes such as **John Doe** and **Jhn Doe**, or different casing
 * email addresses such as **JOHN_DOE@ANYCOMPANY.COM** and
 * **johndoe@anycompany.com**, or different phone number
 * formats such as **555-010-0000** and **+1-555-010-0000**—can be detected as belonging to the same customer **John Doe** and merged into a unified profile.
 */
export const getMatches: (
  input: GetMatchesRequest,
) => Effect.Effect<
  GetMatchesResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMatchesRequest,
  output: GetMatchesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Determines if the given profiles are within a segment.
 */
export const getSegmentMembership: (
  input: GetSegmentMembershipRequest,
) => Effect.Effect<
  GetSegmentMembershipResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSegmentMembershipRequest,
  output: GetSegmentMembershipResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * This API retrieves the details of a specific upload job.
 */
export const getUploadJob: (
  input: GetUploadJobRequest,
) => Effect.Effect<
  GetUploadJobResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUploadJobRequest,
  output: GetUploadJobResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists all of the integrations associated to a specific URI in the AWS account.
 */
export const listAccountIntegrations: (
  input: ListAccountIntegrationsRequest,
) => Effect.Effect<
  ListAccountIntegrationsResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAccountIntegrationsRequest,
  output: ListAccountIntegrationsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists calculated attribute definitions for Customer Profiles
 */
export const listCalculatedAttributeDefinitions: (
  input: ListCalculatedAttributeDefinitionsRequest,
) => Effect.Effect<
  ListCalculatedAttributeDefinitionsResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCalculatedAttributeDefinitionsRequest,
  output: ListCalculatedAttributeDefinitionsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieve a list of calculated attributes for a customer profile.
 */
export const listCalculatedAttributesForProfile: (
  input: ListCalculatedAttributesForProfileRequest,
) => Effect.Effect<
  ListCalculatedAttributesForProfileResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCalculatedAttributesForProfileRequest,
  output: ListCalculatedAttributesForProfileResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists the existing layouts that can be used to view data for a specific domain. This API
 * can only be invoked from the Amazon Connect admin website.
 */
export const listDomainLayouts: {
  (
    input: ListDomainLayoutsRequest,
  ): Effect.Effect<
    ListDomainLayoutsResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDomainLayoutsRequest,
  ) => Stream.Stream<
    ListDomainLayoutsResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDomainLayoutsRequest,
  ) => Stream.Stream<
    LayoutItem,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDomainLayoutsRequest,
  output: ListDomainLayoutsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List all DomainObjectType(s) in a Customer Profiles domain.
 */
export const listDomainObjectTypes: {
  (
    input: ListDomainObjectTypesRequest,
  ): Effect.Effect<
    ListDomainObjectTypesResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDomainObjectTypesRequest,
  ) => Stream.Stream<
    ListDomainObjectTypesResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDomainObjectTypesRequest,
  ) => Stream.Stream<
    DomainObjectTypesListItem,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDomainObjectTypesRequest,
  output: ListDomainObjectTypesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of all the domains for an AWS account that have been created.
 */
export const listDomains: (
  input: ListDomainsRequest,
) => Effect.Effect<
  ListDomainsResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDomainsRequest,
  output: ListDomainsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * List all Event Triggers under a domain.
 */
export const listEventTriggers: {
  (
    input: ListEventTriggersRequest,
  ): Effect.Effect<
    ListEventTriggersResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEventTriggersRequest,
  ) => Stream.Stream<
    ListEventTriggersResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEventTriggersRequest,
  ) => Stream.Stream<
    EventTriggerSummaryItem,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEventTriggersRequest,
  output: ListEventTriggersResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all of the Identity Resolution Jobs in your domain. The response sorts the list by
 * `JobStartTime`.
 */
export const listIdentityResolutionJobs: (
  input: ListIdentityResolutionJobsRequest,
) => Effect.Effect<
  ListIdentityResolutionJobsResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIdentityResolutionJobsRequest,
  output: ListIdentityResolutionJobsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Fetch the possible attribute values given the attribute name.
 */
export const listObjectTypeAttributes: {
  (
    input: ListObjectTypeAttributesRequest,
  ): Effect.Effect<
    ListObjectTypeAttributesResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListObjectTypeAttributesRequest,
  ) => Stream.Stream<
    ListObjectTypeAttributesResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListObjectTypeAttributesRequest,
  ) => Stream.Stream<
    ListObjectTypeAttributeItem,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListObjectTypeAttributesRequest,
  output: ListObjectTypeAttributesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * The ListObjectTypeAttributeValues API provides access to the most recent distinct values for any specified attribute, making it valuable for real-time data validation and consistency checks within your object types. This API works across domain, supporting both custom and standard object types. The API accepts the object type name, attribute name, and domain name as input parameters and returns values up to the storage limit of approximately 350KB.
 */
export const listObjectTypeAttributeValues: (
  input: ListObjectTypeAttributeValuesRequest,
) => Effect.Effect<
  ListObjectTypeAttributeValuesResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListObjectTypeAttributeValuesRequest,
  output: ListObjectTypeAttributeValuesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Fetch the possible attribute values given the attribute name.
 */
export const listProfileAttributeValues: (
  input: ProfileAttributeValuesRequest,
) => Effect.Effect<
  ProfileAttributeValuesResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ProfileAttributeValuesRequest,
  output: ProfileAttributeValuesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns a list of history records for a specific profile, for a specific domain.
 */
export const listProfileHistoryRecords: (
  input: ListProfileHistoryRecordsRequest,
) => Effect.Effect<
  ListProfileHistoryRecordsResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProfileHistoryRecordsRequest,
  output: ListProfileHistoryRecordsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists all of the templates available within the service.
 */
export const listProfileObjectTypes: (
  input: ListProfileObjectTypesRequest,
) => Effect.Effect<
  ListProfileObjectTypesResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProfileObjectTypesRequest,
  output: ListProfileObjectTypesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists all of the template information for object types.
 */
export const listProfileObjectTypeTemplates: (
  input: ListProfileObjectTypeTemplatesRequest,
) => Effect.Effect<
  ListProfileObjectTypeTemplatesResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProfileObjectTypeTemplatesRequest,
  output: ListProfileObjectTypeTemplatesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns a list of recommenders in the specified domain.
 */
export const listRecommenders: {
  (
    input: ListRecommendersRequest,
  ): Effect.Effect<
    ListRecommendersResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecommendersRequest,
  ) => Stream.Stream<
    ListRecommendersResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecommendersRequest,
  ) => Stream.Stream<
    RecommenderSummary,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRecommendersRequest,
  output: ListRecommendersResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Recommenders",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all segment definitions under a domain.
 */
export const listSegmentDefinitions: {
  (
    input: ListSegmentDefinitionsRequest,
  ): Effect.Effect<
    ListSegmentDefinitionsResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSegmentDefinitionsRequest,
  ) => Stream.Stream<
    ListSegmentDefinitionsResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSegmentDefinitionsRequest,
  ) => Stream.Stream<
    SegmentDefinitionItem,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSegmentDefinitionsRequest,
  output: ListSegmentDefinitionsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This API retrieves a list of upload jobs for the specified domain.
 */
export const listUploadJobs: {
  (
    input: ListUploadJobsRequest,
  ): Effect.Effect<
    ListUploadJobsResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUploadJobsRequest,
  ) => Stream.Stream<
    ListUploadJobsResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUploadJobsRequest,
  ) => Stream.Stream<
    UploadJobItem,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUploadJobsRequest,
  output: ListUploadJobsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Query to list all workflows.
 */
export const listWorkflows: (
  input: ListWorkflowsRequest,
) => Effect.Effect<
  ListWorkflowsResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListWorkflowsRequest,
  output: ListWorkflowsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Searches for profiles within a specific domain using one or more predefined search keys
 * (e.g., _fullName, _phone, _email, _account, etc.) and/or custom-defined search keys. A
 * search key is a data type pair that consists of a `KeyName` and
 * `Values` list.
 *
 * This operation supports searching for profiles with a minimum of 1 key-value(s) pair and
 * up to 5 key-value(s) pairs using either `AND` or `OR` logic.
 */
export const searchProfiles: (
  input: SearchProfilesRequest,
) => Effect.Effect<
  SearchProfilesResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchProfilesRequest,
  output: SearchProfilesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Get a batch of profiles.
 */
export const batchGetProfile: (
  input: BatchGetProfileRequest,
) => Effect.Effect<
  BatchGetProfileResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetProfileRequest,
  output: BatchGetProfileResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a standard profile.
 *
 * A standard profile represents the following attributes for a customer profile in a
 * domain.
 */
export const createProfile: (
  input: CreateProfileRequest,
) => Effect.Effect<
  CreateProfileResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProfileRequest,
  output: CreateProfileResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates an Upload job to ingest data for segment imports. The metadata is created for
 * the job with the provided field mapping and unique key.
 */
export const createUploadJob: (
  input: CreateUploadJobRequest,
) => Effect.Effect<
  CreateUploadJobResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUploadJobRequest,
  output: CreateUploadJobResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns information about an Identity Resolution Job in a specific domain.
 *
 * Identity Resolution Jobs are set up using the Amazon Connect admin console. For more information, see Use
 * Identity Resolution to consolidate similar profiles.
 */
export const getIdentityResolutionJob: (
  input: GetIdentityResolutionJobRequest,
) => Effect.Effect<
  GetIdentityResolutionJobResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdentityResolutionJobRequest,
  output: GetIdentityResolutionJobResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * The GetObjectTypeAttributeValues API delivers statistical insights about attributes within a specific object type, but is exclusively available for domains with data store enabled. This API performs daily calculations to provide statistical information about your attribute values, helping you understand patterns and trends in your data. The statistical calculations are performed once per day, providing a consistent snapshot of your attribute data characteristics.
 *
 * You'll receive null values in two scenarios:
 *
 * During the first period after enabling data vault (unless a calculation cycle occurs, which happens once daily).
 *
 * For attributes that don't contain numeric values.
 */
export const getObjectTypeAttributeStatistics: (
  input: GetObjectTypeAttributeStatisticsRequest,
) => Effect.Effect<
  GetObjectTypeAttributeStatisticsResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetObjectTypeAttributeStatisticsRequest,
  output: GetObjectTypeAttributeStatisticsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a recommender.
 */
export const getRecommender: (
  input: GetRecommenderRequest,
) => Effect.Effect<
  GetRecommenderResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRecommenderRequest,
  output: GetRecommenderResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Get details of specified workflow.
 */
export const getWorkflow: (
  input: GetWorkflowRequest,
) => Effect.Effect<
  GetWorkflowResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkflowRequest,
  output: GetWorkflowResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Get granular list of steps in workflow.
 */
export const getWorkflowSteps: (
  input: GetWorkflowStepsRequest,
) => Effect.Effect<
  GetWorkflowStepsResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkflowStepsRequest,
  output: GetWorkflowStepsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns a list of all the event streams in a specific domain.
 */
export const listEventStreams: {
  (
    input: ListEventStreamsRequest,
  ): Effect.Effect<
    ListEventStreamsResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEventStreamsRequest,
  ) => Stream.Stream<
    ListEventStreamsResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEventStreamsRequest,
  ) => Stream.Stream<
    EventStreamSummary,
    | AccessDeniedException
    | BadRequestException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEventStreamsRequest,
  output: ListEventStreamsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Items",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of objects associated with a profile of a given ProfileObjectType.
 */
export const listProfileObjects: (
  input: ListProfileObjectsRequest,
) => Effect.Effect<
  ListProfileObjectsResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProfileObjectsRequest,
  output: ListProfileObjectsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Runs an AWS Lambda job that does the following:
 *
 * - All the profileKeys in the `ProfileToBeMerged` will be moved to the
 * main profile.
 *
 * - All the objects in the `ProfileToBeMerged` will be moved to the main
 * profile.
 *
 * - All the `ProfileToBeMerged` will be deleted at the end.
 *
 * - All the profileKeys in the `ProfileIdsToBeMerged` will be moved to the
 * main profile.
 *
 * - Standard fields are merged as follows:
 *
 * - Fields are always "union"-ed if there are no conflicts in standard fields or
 * attributeKeys.
 *
 * - When there are conflicting fields:
 *
 * - If no `SourceProfileIds` entry is specified, the main
 * Profile value is always taken.
 *
 * - If a `SourceProfileIds` entry is specified, the specified
 * profileId is always taken, even if it is a NULL value.
 *
 * You can use MergeProfiles together with GetMatches, which
 * returns potentially matching profiles, or use it with the results of another matching
 * system. After profiles have been merged, they cannot be separated (unmerged).
 */
export const mergeProfiles: (
  input: MergeProfilesRequest,
) => Effect.Effect<
  MergeProfilesResponse,
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: MergeProfilesRequest,
  output: MergeProfilesResponse,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Create/Update a DomainObjectType in a Customer Profiles domain. To create a new DomainObjectType, Data Store needs to be enabled on the Domain.
 */
export const putDomainObjectType: (
  input: PutDomainObjectTypeRequest,
) => Effect.Effect<
  PutDomainObjectTypeResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDomainObjectTypeRequest,
  output: PutDomainObjectTypeResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Defines a ProfileObjectType.
 *
 * To add or remove tags on an existing ObjectType, see
 * TagResource/UntagResource.
 */
export const putProfileObjectType: (
  input: PutProfileObjectTypeRequest,
) => Effect.Effect<
  PutProfileObjectTypeResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutProfileObjectTypeRequest,
  output: PutProfileObjectTypeResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Fetch the possible attribute values given the attribute name.
 */
export const batchGetCalculatedAttributeForProfile: (
  input: BatchGetCalculatedAttributeForProfileRequest,
) => Effect.Effect<
  BatchGetCalculatedAttributeForProfileResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetCalculatedAttributeForProfileRequest,
  output: BatchGetCalculatedAttributeForProfileResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a domain, which is a container for all customer data, such as customer profile
 * attributes, object types, profile keys, and encryption keys. You can create multiple
 * domains, and each domain can have multiple third-party integrations.
 *
 * Each Amazon Connect instance can be associated with only one domain. Multiple
 * Amazon Connect instances can be associated with one domain.
 *
 * Use this API or UpdateDomain to
 * enable identity
 * resolution: set `Matching` to true.
 *
 * To prevent cross-service impersonation when you call this API, see Cross-service confused deputy prevention for sample policies that you should
 * apply.
 *
 * It is not possible to associate a Customer Profiles domain with an Amazon Connect Instance directly from
 * the API. If you would like to create a domain and associate a Customer Profiles domain, use the Amazon Connect
 * admin website. For more information, see Enable Customer Profiles.
 *
 * Each Amazon Connect instance can be associated with only one domain. Multiple Amazon Connect instances
 * can be associated with one domain.
 */
export const createDomain: (
  input: CreateDomainRequest,
) => Effect.Effect<
  CreateDomainResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainRequest,
  output: CreateDomainResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates an event trigger, which specifies the rules when to perform action based on
 * customer's ingested data.
 *
 * Each event stream can be associated with only one integration in the same region and AWS
 * account as the event stream.
 */
export const createEventTrigger: (
  input: CreateEventTriggerRequest,
) => Effect.Effect<
  CreateEventTriggerResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEventTriggerRequest,
  output: CreateEventTriggerResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates an integration workflow. An integration workflow is an async process which
 * ingests historic data and sets up an integration for ongoing updates. The supported Amazon AppFlow sources are Salesforce, ServiceNow, and Marketo.
 */
export const createIntegrationWorkflow: (
  input: CreateIntegrationWorkflowRequest,
) => Effect.Effect<
  CreateIntegrationWorkflowResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIntegrationWorkflowRequest,
  output: CreateIntegrationWorkflowResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a recommender
 */
export const createRecommender: (
  input: CreateRecommenderRequest,
) => Effect.Effect<
  CreateRecommenderResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRecommenderRequest,
  output: CreateRecommenderResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Fetches the recommendations for a profile in the input Customer Profiles domain. Fetches all the profile recommendations
 */
export const getProfileRecommendations: (
  input: GetProfileRecommendationsRequest,
) => Effect.Effect<
  GetProfileRecommendationsResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProfileRecommendationsRequest,
  output: GetProfileRecommendationsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Adds an integration between the service and a third-party service, which includes
 * Amazon AppFlow and Amazon Connect.
 *
 * An integration can belong to only one domain.
 *
 * To add or remove tags on an existing Integration, see TagResource
 * /
 * UntagResource.
 */
export const putIntegration: (
  input: PutIntegrationRequest,
) => Effect.Effect<
  PutIntegrationResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutIntegrationRequest,
  output: PutIntegrationResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a new calculated attribute definition. After creation, new object data ingested
 * into Customer Profiles will be included in the calculated attribute, which can be retrieved
 * for a profile using the GetCalculatedAttributeForProfile API. Defining a calculated attribute makes it
 * available for all profiles within a domain. Each calculated attribute can only reference
 * one `ObjectType` and at most, two fields from that
 * `ObjectType`.
 */
export const createCalculatedAttributeDefinition: (
  input: CreateCalculatedAttributeDefinitionRequest,
) => Effect.Effect<
  CreateCalculatedAttributeDefinitionResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCalculatedAttributeDefinitionRequest,
  output: CreateCalculatedAttributeDefinitionResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a segment definition associated to the given domain.
 */
export const createSegmentDefinition: (
  input: CreateSegmentDefinitionRequest,
) => Effect.Effect<
  CreateSegmentDefinitionResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSegmentDefinitionRequest,
  output: CreateSegmentDefinitionResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));

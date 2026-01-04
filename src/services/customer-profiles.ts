import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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

//# Schemas
export const requestValueList = S.Array(S.String);
export const BatchGetCalculatedAttributeForProfileIdList = S.Array(S.String);
export const BatchGetProfileIdList = S.Array(S.String);
export const Objects = S.Array(S.String);
export const ProfileIds = S.Array(S.String);
export const ProfileIdToBeMergedList = S.Array(S.String);
export const EventTriggerNames = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AddProfileKeyRequest extends S.Class<AddProfileKeyRequest>(
  "AddProfileKeyRequest",
)(
  {
    ProfileId: S.String,
    KeyName: S.String,
    Values: requestValueList,
    DomainName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{DomainName}/profiles/keys" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetProfileRequest extends S.Class<BatchGetProfileRequest>(
  "BatchGetProfileRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    ProfileIds: BatchGetProfileIdList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{DomainName}/batch-get-profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateDomainLayoutRequest extends S.Class<CreateDomainLayoutRequest>(
  "CreateDomainLayoutRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    LayoutDefinitionName: S.String.pipe(T.HttpLabel()),
    Description: S.String,
    DisplayName: S.String,
    IsDefault: S.optional(S.Boolean),
    LayoutType: S.String,
    Layout: S.String,
    Tags: S.optional(TagMap),
  },
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
) {}
export class CreateEventStreamRequest extends S.Class<CreateEventStreamRequest>(
  "CreateEventStreamRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    Uri: S.String,
    EventStreamName: S.String.pipe(T.HttpLabel()),
    Tags: S.optional(TagMap),
  },
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
) {}
export class CreateSegmentSnapshotRequest extends S.Class<CreateSegmentSnapshotRequest>(
  "CreateSegmentSnapshotRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    SegmentDefinitionName: S.String.pipe(T.HttpLabel()),
    DataFormat: S.String,
    EncryptionKey: S.optional(S.String),
    RoleArn: S.optional(S.String),
    DestinationUri: S.optional(S.String),
  },
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
) {}
export class DeleteCalculatedAttributeDefinitionRequest extends S.Class<DeleteCalculatedAttributeDefinitionRequest>(
  "DeleteCalculatedAttributeDefinitionRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    CalculatedAttributeName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DeleteCalculatedAttributeDefinitionResponse extends S.Class<DeleteCalculatedAttributeDefinitionResponse>(
  "DeleteCalculatedAttributeDefinitionResponse",
)({}) {}
export class DeleteDomainRequest extends S.Class<DeleteDomainRequest>(
  "DeleteDomainRequest",
)(
  { DomainName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/domains/{DomainName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDomainLayoutRequest extends S.Class<DeleteDomainLayoutRequest>(
  "DeleteDomainLayoutRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    LayoutDefinitionName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DeleteDomainObjectTypeRequest extends S.Class<DeleteDomainObjectTypeRequest>(
  "DeleteDomainObjectTypeRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    ObjectTypeName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DeleteDomainObjectTypeResponse extends S.Class<DeleteDomainObjectTypeResponse>(
  "DeleteDomainObjectTypeResponse",
)({}) {}
export class DeleteEventStreamRequest extends S.Class<DeleteEventStreamRequest>(
  "DeleteEventStreamRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    EventStreamName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DeleteEventStreamResponse extends S.Class<DeleteEventStreamResponse>(
  "DeleteEventStreamResponse",
)({}) {}
export class DeleteEventTriggerRequest extends S.Class<DeleteEventTriggerRequest>(
  "DeleteEventTriggerRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    EventTriggerName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DeleteIntegrationRequest extends S.Class<DeleteIntegrationRequest>(
  "DeleteIntegrationRequest",
)(
  { DomainName: S.String.pipe(T.HttpLabel()), Uri: S.String },
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
) {}
export class DeleteProfileRequest extends S.Class<DeleteProfileRequest>(
  "DeleteProfileRequest",
)(
  { ProfileId: S.String, DomainName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{DomainName}/profiles/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProfileKeyRequest extends S.Class<DeleteProfileKeyRequest>(
  "DeleteProfileKeyRequest",
)(
  {
    ProfileId: S.String,
    KeyName: S.String,
    Values: requestValueList,
    DomainName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DeleteProfileObjectRequest extends S.Class<DeleteProfileObjectRequest>(
  "DeleteProfileObjectRequest",
)(
  {
    ProfileId: S.String,
    ProfileObjectUniqueKey: S.String,
    ObjectTypeName: S.String,
    DomainName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DeleteProfileObjectTypeRequest extends S.Class<DeleteProfileObjectTypeRequest>(
  "DeleteProfileObjectTypeRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    ObjectTypeName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DeleteRecommenderRequest extends S.Class<DeleteRecommenderRequest>(
  "DeleteRecommenderRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    RecommenderName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DeleteRecommenderResponse extends S.Class<DeleteRecommenderResponse>(
  "DeleteRecommenderResponse",
)({}) {}
export class DeleteSegmentDefinitionRequest extends S.Class<DeleteSegmentDefinitionRequest>(
  "DeleteSegmentDefinitionRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    SegmentDefinitionName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DeleteWorkflowRequest extends S.Class<DeleteWorkflowRequest>(
  "DeleteWorkflowRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    WorkflowId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DeleteWorkflowResponse extends S.Class<DeleteWorkflowResponse>(
  "DeleteWorkflowResponse",
)({}) {}
export class DetectProfileObjectTypeRequest extends S.Class<DetectProfileObjectTypeRequest>(
  "DetectProfileObjectTypeRequest",
)(
  { Objects: Objects, DomainName: S.String.pipe(T.HttpLabel()) },
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
) {}
export class GetCalculatedAttributeDefinitionRequest extends S.Class<GetCalculatedAttributeDefinitionRequest>(
  "GetCalculatedAttributeDefinitionRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    CalculatedAttributeName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetCalculatedAttributeForProfileRequest extends S.Class<GetCalculatedAttributeForProfileRequest>(
  "GetCalculatedAttributeForProfileRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    ProfileId: S.String.pipe(T.HttpLabel()),
    CalculatedAttributeName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetDomainRequest extends S.Class<GetDomainRequest>(
  "GetDomainRequest",
)(
  { DomainName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/domains/{DomainName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDomainLayoutRequest extends S.Class<GetDomainLayoutRequest>(
  "GetDomainLayoutRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    LayoutDefinitionName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetDomainObjectTypeRequest extends S.Class<GetDomainObjectTypeRequest>(
  "GetDomainObjectTypeRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    ObjectTypeName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetEventStreamRequest extends S.Class<GetEventStreamRequest>(
  "GetEventStreamRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    EventStreamName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetEventTriggerRequest extends S.Class<GetEventTriggerRequest>(
  "GetEventTriggerRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    EventTriggerName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetIdentityResolutionJobRequest extends S.Class<GetIdentityResolutionJobRequest>(
  "GetIdentityResolutionJobRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    JobId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetIntegrationRequest extends S.Class<GetIntegrationRequest>(
  "GetIntegrationRequest",
)(
  { DomainName: S.String.pipe(T.HttpLabel()), Uri: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{DomainName}/integrations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMatchesRequest extends S.Class<GetMatchesRequest>(
  "GetMatchesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    DomainName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/domains/{DomainName}/matches" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetObjectTypeAttributeStatisticsRequest extends S.Class<GetObjectTypeAttributeStatisticsRequest>(
  "GetObjectTypeAttributeStatisticsRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    ObjectTypeName: S.String.pipe(T.HttpLabel()),
    AttributeName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetProfileHistoryRecordRequest extends S.Class<GetProfileHistoryRecordRequest>(
  "GetProfileHistoryRecordRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    ProfileId: S.String.pipe(T.HttpLabel()),
    Id: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetProfileObjectTypeRequest extends S.Class<GetProfileObjectTypeRequest>(
  "GetProfileObjectTypeRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    ObjectTypeName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetProfileObjectTypeTemplateRequest extends S.Class<GetProfileObjectTypeTemplateRequest>(
  "GetProfileObjectTypeTemplateRequest",
)(
  { TemplateId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/templates/{TemplateId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRecommenderRequest extends S.Class<GetRecommenderRequest>(
  "GetRecommenderRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    RecommenderName: S.String.pipe(T.HttpLabel()),
    TrainingMetricsCount: S.optional(S.Number).pipe(
      T.HttpQuery("training-metrics-count"),
    ),
  },
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
) {}
export class GetSegmentDefinitionRequest extends S.Class<GetSegmentDefinitionRequest>(
  "GetSegmentDefinitionRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    SegmentDefinitionName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetSegmentEstimateRequest extends S.Class<GetSegmentEstimateRequest>(
  "GetSegmentEstimateRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    EstimateId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetSegmentMembershipRequest extends S.Class<GetSegmentMembershipRequest>(
  "GetSegmentMembershipRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    SegmentDefinitionName: S.String.pipe(T.HttpLabel()),
    ProfileIds: ProfileIds.pipe(T.JsonName("ProfileIds")),
  },
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
) {}
export class GetSegmentSnapshotRequest extends S.Class<GetSegmentSnapshotRequest>(
  "GetSegmentSnapshotRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    SegmentDefinitionName: S.String.pipe(T.HttpLabel()),
    SnapshotId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetSimilarProfilesRequest extends S.Class<GetSimilarProfilesRequest>(
  "GetSimilarProfilesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    DomainName: S.String.pipe(T.HttpLabel()),
    MatchType: S.String,
    SearchKey: S.String,
    SearchValue: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{DomainName}/matches" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUploadJobRequest extends S.Class<GetUploadJobRequest>(
  "GetUploadJobRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    JobId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/domains/{DomainName}/upload-jobs/{JobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUploadJobPathRequest extends S.Class<GetUploadJobPathRequest>(
  "GetUploadJobPathRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    JobId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetWorkflowRequest extends S.Class<GetWorkflowRequest>(
  "GetWorkflowRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    WorkflowId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetWorkflowStepsRequest extends S.Class<GetWorkflowStepsRequest>(
  "GetWorkflowStepsRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    WorkflowId: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
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
) {}
export class ListAccountIntegrationsRequest extends S.Class<ListAccountIntegrationsRequest>(
  "ListAccountIntegrationsRequest",
)(
  {
    Uri: S.String,
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    IncludeHidden: S.optional(S.Boolean).pipe(T.HttpQuery("include-hidden")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/integrations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCalculatedAttributeDefinitionsRequest extends S.Class<ListCalculatedAttributeDefinitionsRequest>(
  "ListCalculatedAttributeDefinitionsRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
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
) {}
export class ListCalculatedAttributesForProfileRequest extends S.Class<ListCalculatedAttributesForProfileRequest>(
  "ListCalculatedAttributesForProfileRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    DomainName: S.String.pipe(T.HttpLabel()),
    ProfileId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class ListDomainLayoutsRequest extends S.Class<ListDomainLayoutsRequest>(
  "ListDomainLayoutsRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/domains/{DomainName}/layouts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDomainObjectTypesRequest extends S.Class<ListDomainObjectTypesRequest>(
  "ListDomainObjectTypesRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/domains/{DomainName}/domain-object-types" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDomainsRequest extends S.Class<ListDomainsRequest>(
  "ListDomainsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/domains" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEventStreamsRequest extends S.Class<ListEventStreamsRequest>(
  "ListEventStreamsRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/domains/{DomainName}/event-streams" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEventTriggersRequest extends S.Class<ListEventTriggersRequest>(
  "ListEventTriggersRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/domains/{DomainName}/event-triggers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIdentityResolutionJobsRequest extends S.Class<ListIdentityResolutionJobsRequest>(
  "ListIdentityResolutionJobsRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
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
) {}
export class ListIntegrationsRequest extends S.Class<ListIntegrationsRequest>(
  "ListIntegrationsRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    IncludeHidden: S.optional(S.Boolean).pipe(T.HttpQuery("include-hidden")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/domains/{DomainName}/integrations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListObjectTypeAttributesRequest extends S.Class<ListObjectTypeAttributesRequest>(
  "ListObjectTypeAttributesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    DomainName: S.String.pipe(T.HttpLabel()),
    ObjectTypeName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class ListObjectTypeAttributeValuesRequest extends S.Class<ListObjectTypeAttributeValuesRequest>(
  "ListObjectTypeAttributeValuesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    DomainName: S.String.pipe(T.HttpLabel()),
    ObjectTypeName: S.String.pipe(T.HttpLabel()),
    AttributeName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class ProfileAttributeValuesRequest extends S.Class<ProfileAttributeValuesRequest>(
  "ProfileAttributeValuesRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    AttributeName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class ListProfileHistoryRecordsRequest extends S.Class<ListProfileHistoryRecordsRequest>(
  "ListProfileHistoryRecordsRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    ProfileId: S.String,
    ObjectTypeName: S.optional(S.String),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    ActionType: S.optional(S.String),
    PerformedBy: S.optional(S.String),
  },
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
) {}
export class ListProfileObjectTypesRequest extends S.Class<ListProfileObjectTypesRequest>(
  "ListProfileObjectTypesRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/domains/{DomainName}/object-types" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProfileObjectTypeTemplatesRequest extends S.Class<ListProfileObjectTypeTemplatesRequest>(
  "ListProfileObjectTypeTemplatesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/templates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRecommenderRecipesRequest extends S.Class<ListRecommenderRecipesRequest>(
  "ListRecommenderRecipesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/recommender-recipes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRecommendersRequest extends S.Class<ListRecommendersRequest>(
  "ListRecommendersRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/domains/{DomainName}/recommenders" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRuleBasedMatchesRequest extends S.Class<ListRuleBasedMatchesRequest>(
  "ListRuleBasedMatchesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    DomainName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class ListSegmentDefinitionsRequest extends S.Class<ListSegmentDefinitionsRequest>(
  "ListSegmentDefinitionsRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/domains/{DomainName}/segment-definitions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListUploadJobsRequest extends S.Class<ListUploadJobsRequest>(
  "ListUploadJobsRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/domains/{DomainName}/upload-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkflowsRequest extends S.Class<ListWorkflowsRequest>(
  "ListWorkflowsRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    WorkflowType: S.optional(S.String),
    Status: S.optional(S.String),
    QueryStartDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    QueryEndDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{DomainName}/workflows" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutProfileObjectRequest extends S.Class<PutProfileObjectRequest>(
  "PutProfileObjectRequest",
)(
  {
    ObjectTypeName: S.String,
    Object: S.String,
    DomainName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/domains/{DomainName}/profiles/objects" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartRecommenderRequest extends S.Class<StartRecommenderRequest>(
  "StartRecommenderRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    RecommenderName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class StartRecommenderResponse extends S.Class<StartRecommenderResponse>(
  "StartRecommenderResponse",
)({}) {}
export class StartUploadJobRequest extends S.Class<StartUploadJobRequest>(
  "StartUploadJobRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    JobId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/domains/{DomainName}/upload-jobs/{JobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartUploadJobResponse extends S.Class<StartUploadJobResponse>(
  "StartUploadJobResponse",
)({}) {}
export class StopRecommenderRequest extends S.Class<StopRecommenderRequest>(
  "StopRecommenderRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    RecommenderName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class StopRecommenderResponse extends S.Class<StopRecommenderResponse>(
  "StopRecommenderResponse",
)({}) {}
export class StopUploadJobRequest extends S.Class<StopUploadJobRequest>(
  "StopUploadJobRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    JobId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class StopUploadJobResponse extends S.Class<StopUploadJobResponse>(
  "StopUploadJobResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel()),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class ValueRange extends S.Class<ValueRange>("ValueRange")({
  Start: S.Number,
  End: S.Number,
}) {}
export class Range extends S.Class<Range>("Range")({
  Value: S.optional(S.Number),
  Unit: S.optional(S.String),
  ValueRange: S.optional(ValueRange),
  TimestampSource: S.optional(S.String),
  TimestampFormat: S.optional(S.String),
}) {}
export class Threshold extends S.Class<Threshold>("Threshold")({
  Value: S.String,
  Operator: S.String,
}) {}
export class Conditions extends S.Class<Conditions>("Conditions")({
  Range: S.optional(Range),
  ObjectCount: S.optional(S.Number),
  Threshold: S.optional(Threshold),
}) {}
export class UpdateCalculatedAttributeDefinitionRequest extends S.Class<UpdateCalculatedAttributeDefinitionRequest>(
  "UpdateCalculatedAttributeDefinitionRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    CalculatedAttributeName: S.String.pipe(T.HttpLabel()),
    DisplayName: S.optional(S.String),
    Description: S.optional(S.String),
    Conditions: S.optional(Conditions),
  },
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
) {}
export class JobSchedule extends S.Class<JobSchedule>("JobSchedule")({
  DayOfTheWeek: S.String,
  Time: S.String,
}) {}
export const MatchingAttributes = S.Array(S.String);
export const MatchingAttributesList = S.Array(MatchingAttributes);
export class Consolidation extends S.Class<Consolidation>("Consolidation")({
  MatchingAttributesList: MatchingAttributesList,
}) {}
export class ConflictResolution extends S.Class<ConflictResolution>(
  "ConflictResolution",
)({ ConflictResolvingModel: S.String, SourceName: S.optional(S.String) }) {}
export class AutoMerging extends S.Class<AutoMerging>("AutoMerging")({
  Enabled: S.Boolean,
  Consolidation: S.optional(Consolidation),
  ConflictResolution: S.optional(ConflictResolution),
  MinAllowedConfidenceScoreForMerging: S.optional(S.Number),
}) {}
export class S3ExportingConfig extends S.Class<S3ExportingConfig>(
  "S3ExportingConfig",
)({ S3BucketName: S.String, S3KeyName: S.optional(S.String) }) {}
export class ExportingConfig extends S.Class<ExportingConfig>(
  "ExportingConfig",
)({ S3Exporting: S.optional(S3ExportingConfig) }) {}
export class MatchingRequest extends S.Class<MatchingRequest>(
  "MatchingRequest",
)({
  Enabled: S.Boolean,
  JobSchedule: S.optional(JobSchedule),
  AutoMerging: S.optional(AutoMerging),
  ExportingConfig: S.optional(ExportingConfig),
}) {}
export const MatchingRuleAttributeList = S.Array(S.String);
export class MatchingRule extends S.Class<MatchingRule>("MatchingRule")({
  Rule: MatchingRuleAttributeList,
}) {}
export const MatchingRules = S.Array(MatchingRule);
export const AddressList = S.Array(S.String);
export const PhoneNumberList = S.Array(S.String);
export const EmailList = S.Array(S.String);
export class AttributeTypesSelector extends S.Class<AttributeTypesSelector>(
  "AttributeTypesSelector",
)({
  AttributeMatchingModel: S.String,
  Address: S.optional(AddressList),
  PhoneNumber: S.optional(PhoneNumberList),
  EmailAddress: S.optional(EmailList),
}) {}
export class RuleBasedMatchingRequest extends S.Class<RuleBasedMatchingRequest>(
  "RuleBasedMatchingRequest",
)({
  Enabled: S.Boolean,
  MatchingRules: S.optional(MatchingRules),
  MaxAllowedRuleLevelForMerging: S.optional(S.Number),
  MaxAllowedRuleLevelForMatching: S.optional(S.Number),
  AttributeTypesSelector: S.optional(AttributeTypesSelector),
  ConflictResolution: S.optional(ConflictResolution),
  ExportingConfig: S.optional(ExportingConfig),
}) {}
export class DataStoreRequest extends S.Class<DataStoreRequest>(
  "DataStoreRequest",
)({ Enabled: S.optional(S.Boolean) }) {}
export class UpdateDomainRequest extends S.Class<UpdateDomainRequest>(
  "UpdateDomainRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    DefaultExpirationDays: S.optional(S.Number),
    DefaultEncryptionKey: S.optional(S.String),
    DeadLetterQueueUrl: S.optional(S.String),
    Matching: S.optional(MatchingRequest),
    RuleBasedMatching: S.optional(RuleBasedMatchingRequest),
    DataStore: S.optional(DataStoreRequest),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/domains/{DomainName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDomainLayoutRequest extends S.Class<UpdateDomainLayoutRequest>(
  "UpdateDomainLayoutRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    LayoutDefinitionName: S.String.pipe(T.HttpLabel()),
    Description: S.optional(S.String),
    DisplayName: S.optional(S.String),
    IsDefault: S.optional(S.Boolean),
    LayoutType: S.optional(S.String),
    Layout: S.optional(S.String),
  },
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
) {}
export const EventTriggerValues = S.Array(S.String);
export class ObjectAttribute extends S.Class<ObjectAttribute>(
  "ObjectAttribute",
)({
  Source: S.optional(S.String),
  FieldName: S.optional(S.String),
  ComparisonOperator: S.String,
  Values: EventTriggerValues,
}) {}
export const ObjectAttributes = S.Array(ObjectAttribute);
export class EventTriggerDimension extends S.Class<EventTriggerDimension>(
  "EventTriggerDimension",
)({ ObjectAttributes: ObjectAttributes }) {}
export const EventTriggerDimensions = S.Array(EventTriggerDimension);
export class EventTriggerCondition extends S.Class<EventTriggerCondition>(
  "EventTriggerCondition",
)({
  EventTriggerDimensions: EventTriggerDimensions,
  LogicalOperator: S.String,
}) {}
export const EventTriggerConditions = S.Array(EventTriggerCondition);
export class Period extends S.Class<Period>("Period")({
  Unit: S.String,
  Value: S.Number,
  MaxInvocationsPerProfile: S.optional(S.Number),
  Unlimited: S.optional(S.Boolean),
}) {}
export const Periods = S.Array(Period);
export class EventTriggerLimits extends S.Class<EventTriggerLimits>(
  "EventTriggerLimits",
)({ EventExpiration: S.optional(S.Number), Periods: S.optional(Periods) }) {}
export class UpdateEventTriggerRequest extends S.Class<UpdateEventTriggerRequest>(
  "UpdateEventTriggerRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    EventTriggerName: S.String.pipe(T.HttpLabel()),
    ObjectTypeName: S.optional(S.String),
    Description: S.optional(S.String),
    EventTriggerConditions: S.optional(EventTriggerConditions),
    SegmentFilter: S.optional(S.String),
    EventTriggerLimits: S.optional(EventTriggerLimits),
  },
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
) {}
export class EventParameters extends S.Class<EventParameters>(
  "EventParameters",
)({ EventType: S.String, EventValueThreshold: S.optional(S.Number) }) {}
export const EventParametersList = S.Array(EventParameters);
export class EventsConfig extends S.Class<EventsConfig>("EventsConfig")({
  EventParametersList: EventParametersList,
}) {}
export class RecommenderConfig extends S.Class<RecommenderConfig>(
  "RecommenderConfig",
)({ EventsConfig: EventsConfig, TrainingFrequency: S.optional(S.Number) }) {}
export class UpdateRecommenderRequest extends S.Class<UpdateRecommenderRequest>(
  "UpdateRecommenderRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    RecommenderName: S.String.pipe(T.HttpLabel()),
    Description: S.optional(S.String),
    RecommenderConfig: S.optional(RecommenderConfig),
  },
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
) {}
export class ContactPreference extends S.Class<ContactPreference>(
  "ContactPreference",
)({
  KeyName: S.optional(S.String),
  KeyValue: S.optional(S.String),
  ProfileId: S.optional(S.String),
  ContactType: S.optional(S.String),
}) {}
export const EmailPreferenceList = S.Array(ContactPreference);
export class Address extends S.Class<Address>("Address")({
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
}) {}
export const Attributes = S.Record({ key: S.String, value: S.String });
export const Values = S.Array(S.String);
export class ProfileDimension extends S.Class<ProfileDimension>(
  "ProfileDimension",
)({
  DimensionType: S.String.pipe(T.JsonName("DimensionType")),
  Values: Values.pipe(T.JsonName("Values")),
}) {}
export const ExtraLengthValues = S.Array(S.String);
export class ExtraLengthValueProfileDimension extends S.Class<ExtraLengthValueProfileDimension>(
  "ExtraLengthValueProfileDimension",
)({
  DimensionType: S.String.pipe(T.JsonName("DimensionType")),
  Values: ExtraLengthValues.pipe(T.JsonName("Values")),
}) {}
export const DateValues = S.Array(S.String);
export class DateDimension extends S.Class<DateDimension>("DateDimension")({
  DimensionType: S.String.pipe(T.JsonName("DimensionType")),
  Values: DateValues.pipe(T.JsonName("Values")),
}) {}
export class AddressDimension extends S.Class<AddressDimension>(
  "AddressDimension",
)({
  City: S.optional(ProfileDimension).pipe(T.JsonName("City")),
  Country: S.optional(ProfileDimension).pipe(T.JsonName("Country")),
  County: S.optional(ProfileDimension).pipe(T.JsonName("County")),
  PostalCode: S.optional(ProfileDimension).pipe(T.JsonName("PostalCode")),
  Province: S.optional(ProfileDimension).pipe(T.JsonName("Province")),
  State: S.optional(ProfileDimension).pipe(T.JsonName("State")),
}) {}
export class AttributeDimension extends S.Class<AttributeDimension>(
  "AttributeDimension",
)({
  DimensionType: S.String.pipe(T.JsonName("DimensionType")),
  Values: Values.pipe(T.JsonName("Values")),
}) {}
export const CustomAttributes = S.Record({
  key: S.String,
  value: AttributeDimension,
});
export const ProfileTypeValues = S.Array(S.String);
export class ProfileTypeDimension extends S.Class<ProfileTypeDimension>(
  "ProfileTypeDimension",
)({
  DimensionType: S.String.pipe(T.JsonName("DimensionType")),
  Values: ProfileTypeValues.pipe(T.JsonName("Values")),
}) {}
export class ProfileAttributes extends S.Class<ProfileAttributes>(
  "ProfileAttributes",
)({
  AccountNumber: S.optional(ProfileDimension).pipe(T.JsonName("AccountNumber")),
  AdditionalInformation: S.optional(ExtraLengthValueProfileDimension).pipe(
    T.JsonName("AdditionalInformation"),
  ),
  FirstName: S.optional(ProfileDimension).pipe(T.JsonName("FirstName")),
  LastName: S.optional(ProfileDimension).pipe(T.JsonName("LastName")),
  MiddleName: S.optional(ProfileDimension).pipe(T.JsonName("MiddleName")),
  GenderString: S.optional(ProfileDimension).pipe(T.JsonName("GenderString")),
  PartyTypeString: S.optional(ProfileDimension).pipe(
    T.JsonName("PartyTypeString"),
  ),
  BirthDate: S.optional(DateDimension).pipe(T.JsonName("BirthDate")),
  PhoneNumber: S.optional(ProfileDimension).pipe(T.JsonName("PhoneNumber")),
  BusinessName: S.optional(ProfileDimension).pipe(T.JsonName("BusinessName")),
  BusinessPhoneNumber: S.optional(ProfileDimension).pipe(
    T.JsonName("BusinessPhoneNumber"),
  ),
  HomePhoneNumber: S.optional(ProfileDimension).pipe(
    T.JsonName("HomePhoneNumber"),
  ),
  MobilePhoneNumber: S.optional(ProfileDimension).pipe(
    T.JsonName("MobilePhoneNumber"),
  ),
  EmailAddress: S.optional(ProfileDimension).pipe(T.JsonName("EmailAddress")),
  PersonalEmailAddress: S.optional(ProfileDimension).pipe(
    T.JsonName("PersonalEmailAddress"),
  ),
  BusinessEmailAddress: S.optional(ProfileDimension).pipe(
    T.JsonName("BusinessEmailAddress"),
  ),
  Address: S.optional(AddressDimension).pipe(T.JsonName("Address")),
  ShippingAddress: S.optional(AddressDimension).pipe(
    T.JsonName("ShippingAddress"),
  ),
  MailingAddress: S.optional(AddressDimension).pipe(
    T.JsonName("MailingAddress"),
  ),
  BillingAddress: S.optional(AddressDimension).pipe(
    T.JsonName("BillingAddress"),
  ),
  Attributes: S.optional(CustomAttributes).pipe(T.JsonName("Attributes")),
  ProfileType: S.optional(ProfileTypeDimension).pipe(T.JsonName("ProfileType")),
}) {}
export class RangeOverride extends S.Class<RangeOverride>("RangeOverride")({
  Start: S.Number,
  End: S.optional(S.Number),
  Unit: S.String,
}) {}
export class ConditionOverrides extends S.Class<ConditionOverrides>(
  "ConditionOverrides",
)({ Range: S.optional(RangeOverride) }) {}
export class CalculatedAttributeDimension extends S.Class<CalculatedAttributeDimension>(
  "CalculatedAttributeDimension",
)({
  DimensionType: S.String.pipe(T.JsonName("DimensionType")),
  Values: Values.pipe(T.JsonName("Values")),
  ConditionOverrides: S.optional(ConditionOverrides).pipe(
    T.JsonName("ConditionOverrides"),
  ),
}) {}
export const CalculatedCustomAttributes = S.Record({
  key: S.String,
  value: CalculatedAttributeDimension,
});
export const Dimension = S.Union(
  S.Struct({
    ProfileAttributes: ProfileAttributes.pipe(T.JsonName("ProfileAttributes")),
  }),
  S.Struct({
    CalculatedAttributes: CalculatedCustomAttributes.pipe(
      T.JsonName("CalculatedAttributes"),
    ),
  }),
);
export const DimensionList = S.Array(Dimension);
export class SourceSegment extends S.Class<SourceSegment>("SourceSegment")({
  SegmentDefinitionName: S.optional(S.String).pipe(
    T.JsonName("SegmentDefinitionName"),
  ),
}) {}
export const SourceSegmentList = S.Array(SourceSegment);
export class Group extends S.Class<Group>("Group")({
  Dimensions: S.optional(DimensionList).pipe(T.JsonName("Dimensions")),
  SourceSegments: S.optional(SourceSegmentList).pipe(
    T.JsonName("SourceSegments"),
  ),
  SourceType: S.optional(S.String).pipe(T.JsonName("SourceType")),
  Type: S.optional(S.String).pipe(T.JsonName("Type")),
}) {}
export const SegmentGroupList = S.Array(Group);
export class SegmentGroupStructure extends S.Class<SegmentGroupStructure>(
  "SegmentGroupStructure",
)({ Groups: S.optional(SegmentGroupList), Include: S.optional(S.String) }) {}
export const RecommenderContext = S.Record({ key: S.String, value: S.String });
export const ProfileIdList = S.Array(S.String);
export class ObjectFilter extends S.Class<ObjectFilter>("ObjectFilter")({
  KeyName: S.String,
  Values: requestValueList,
}) {}
export const MatchIdList = S.Array(S.String);
export const ObjectTypeNames = S.Record({ key: S.String, value: S.String });
export class AdditionalSearchKey extends S.Class<AdditionalSearchKey>(
  "AdditionalSearchKey",
)({ KeyName: S.String, Values: requestValueList }) {}
export const additionalSearchKeysList = S.Array(AdditionalSearchKey);
export class UpdateAddress extends S.Class<UpdateAddress>("UpdateAddress")({
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
}) {}
export const UpdateAttributes = S.Record({ key: S.String, value: S.String });
export const SourceFields = S.Array(S.String);
export const StandardIdentifierList = S.Array(S.String);
export const FieldNameList = S.Array(S.String);
export class AddProfileKeyResponse extends S.Class<AddProfileKeyResponse>(
  "AddProfileKeyResponse",
)({ KeyName: S.optional(S.String), Values: S.optional(requestValueList) }) {}
export class CreateDomainLayoutResponse extends S.Class<CreateDomainLayoutResponse>(
  "CreateDomainLayoutResponse",
)({
  LayoutDefinitionName: S.String,
  Description: S.String,
  DisplayName: S.String,
  IsDefault: S.optional(S.Boolean),
  LayoutType: S.String,
  Layout: S.String,
  Version: S.String,
  Tags: S.optional(TagMap),
  CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateEventStreamResponse extends S.Class<CreateEventStreamResponse>(
  "CreateEventStreamResponse",
)({ EventStreamArn: S.String, Tags: S.optional(TagMap) }) {}
export class CreateSegmentEstimateRequest extends S.Class<CreateSegmentEstimateRequest>(
  "CreateSegmentEstimateRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    SegmentQuery: S.optional(SegmentGroupStructure),
    SegmentSqlQuery: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{DomainName}/segment-estimates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSegmentSnapshotResponse extends S.Class<CreateSegmentSnapshotResponse>(
  "CreateSegmentSnapshotResponse",
)({ SnapshotId: S.String }) {}
export class DeleteDomainResponse extends S.Class<DeleteDomainResponse>(
  "DeleteDomainResponse",
)({ Message: S.String }) {}
export class DeleteDomainLayoutResponse extends S.Class<DeleteDomainLayoutResponse>(
  "DeleteDomainLayoutResponse",
)({ Message: S.String }) {}
export class DeleteEventTriggerResponse extends S.Class<DeleteEventTriggerResponse>(
  "DeleteEventTriggerResponse",
)({ Message: S.String }) {}
export class DeleteIntegrationResponse extends S.Class<DeleteIntegrationResponse>(
  "DeleteIntegrationResponse",
)({ Message: S.String }) {}
export class DeleteProfileResponse extends S.Class<DeleteProfileResponse>(
  "DeleteProfileResponse",
)({ Message: S.optional(S.String) }) {}
export class DeleteProfileKeyResponse extends S.Class<DeleteProfileKeyResponse>(
  "DeleteProfileKeyResponse",
)({ Message: S.optional(S.String) }) {}
export class DeleteProfileObjectResponse extends S.Class<DeleteProfileObjectResponse>(
  "DeleteProfileObjectResponse",
)({ Message: S.optional(S.String) }) {}
export class DeleteProfileObjectTypeResponse extends S.Class<DeleteProfileObjectTypeResponse>(
  "DeleteProfileObjectTypeResponse",
)({ Message: S.String }) {}
export class DeleteSegmentDefinitionResponse extends S.Class<DeleteSegmentDefinitionResponse>(
  "DeleteSegmentDefinitionResponse",
)({ Message: S.optional(S.String).pipe(T.JsonName("Message")) }) {}
export class GetAutoMergingPreviewRequest extends S.Class<GetAutoMergingPreviewRequest>(
  "GetAutoMergingPreviewRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    Consolidation: Consolidation,
    ConflictResolution: ConflictResolution,
    MinAllowedConfidenceScoreForMerging: S.optional(S.Number),
  },
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
) {}
export class GetCalculatedAttributeForProfileResponse extends S.Class<GetCalculatedAttributeForProfileResponse>(
  "GetCalculatedAttributeForProfileResponse",
)({
  CalculatedAttributeName: S.optional(S.String),
  DisplayName: S.optional(S.String),
  IsDataPartial: S.optional(S.String),
  Value: S.optional(S.String),
  LastObjectTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class GetDomainLayoutResponse extends S.Class<GetDomainLayoutResponse>(
  "GetDomainLayoutResponse",
)({
  LayoutDefinitionName: S.String,
  Description: S.String,
  DisplayName: S.String,
  IsDefault: S.optional(S.Boolean),
  LayoutType: S.String,
  Layout: S.String,
  Version: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Tags: S.optional(TagMap),
}) {}
export class DomainObjectTypeField extends S.Class<DomainObjectTypeField>(
  "DomainObjectTypeField",
)({
  Source: S.String,
  Target: S.String,
  ContentType: S.optional(S.String),
  FeatureType: S.optional(S.String),
}) {}
export const DomainObjectTypeFields = S.Record({
  key: S.String,
  value: DomainObjectTypeField,
});
export class GetDomainObjectTypeResponse extends S.Class<GetDomainObjectTypeResponse>(
  "GetDomainObjectTypeResponse",
)({
  ObjectTypeName: S.String,
  Description: S.optional(S.String),
  EncryptionKey: S.optional(S.String),
  Fields: S.optional(DomainObjectTypeFields),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(TagMap),
}) {}
export class GetEventTriggerResponse extends S.Class<GetEventTriggerResponse>(
  "GetEventTriggerResponse",
)({
  EventTriggerName: S.optional(S.String),
  ObjectTypeName: S.optional(S.String),
  Description: S.optional(S.String),
  EventTriggerConditions: S.optional(EventTriggerConditions),
  SegmentFilter: S.optional(S.String),
  EventTriggerLimits: S.optional(EventTriggerLimits),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(TagMap),
}) {}
export class GetIntegrationResponse extends S.Class<GetIntegrationResponse>(
  "GetIntegrationResponse",
)({
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
}) {}
export class GetProfileHistoryRecordResponse extends S.Class<GetProfileHistoryRecordResponse>(
  "GetProfileHistoryRecordResponse",
)({
  Id: S.String,
  ObjectTypeName: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ActionType: S.String,
  ProfileObjectUniqueKey: S.optional(S.String),
  Content: S.optional(S.String),
  PerformedBy: S.optional(S.String),
}) {}
export class ObjectTypeField extends S.Class<ObjectTypeField>(
  "ObjectTypeField",
)({
  Source: S.optional(S.String),
  Target: S.optional(S.String),
  ContentType: S.optional(S.String),
}) {}
export const FieldMap = S.Record({ key: S.String, value: ObjectTypeField });
export class ObjectTypeKey extends S.Class<ObjectTypeKey>("ObjectTypeKey")({
  StandardIdentifiers: S.optional(StandardIdentifierList),
  FieldNames: S.optional(FieldNameList),
}) {}
export const ObjectTypeKeyList = S.Array(ObjectTypeKey);
export const KeyMap = S.Record({ key: S.String, value: ObjectTypeKeyList });
export class GetProfileObjectTypeResponse extends S.Class<GetProfileObjectTypeResponse>(
  "GetProfileObjectTypeResponse",
)({
  ObjectTypeName: S.String,
  Description: S.String,
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
}) {}
export class GetProfileObjectTypeTemplateResponse extends S.Class<GetProfileObjectTypeTemplateResponse>(
  "GetProfileObjectTypeTemplateResponse",
)({
  TemplateId: S.optional(S.String),
  SourceName: S.optional(S.String),
  SourceObject: S.optional(S.String),
  AllowProfileCreation: S.optional(S.Boolean),
  SourceLastUpdatedTimestampFormat: S.optional(S.String),
  Fields: S.optional(FieldMap),
  Keys: S.optional(KeyMap),
}) {}
export class GetProfileRecommendationsRequest extends S.Class<GetProfileRecommendationsRequest>(
  "GetProfileRecommendationsRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    ProfileId: S.String.pipe(T.HttpLabel()),
    RecommenderName: S.String,
    Context: S.optional(RecommenderContext),
    MaxResults: S.optional(S.Number),
  },
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
) {}
export class SegmentGroup extends S.Class<SegmentGroup>("SegmentGroup")({
  Groups: S.optional(SegmentGroupList).pipe(T.JsonName("Groups")),
  Include: S.optional(S.String).pipe(T.JsonName("Include")),
}) {}
export class GetSegmentDefinitionResponse extends S.Class<GetSegmentDefinitionResponse>(
  "GetSegmentDefinitionResponse",
)({
  SegmentDefinitionName: S.optional(S.String).pipe(
    T.JsonName("SegmentDefinitionName"),
  ),
  DisplayName: S.optional(S.String).pipe(T.JsonName("DisplayName")),
  Description: S.optional(S.String).pipe(T.JsonName("Description")),
  SegmentGroups: S.optional(SegmentGroup).pipe(T.JsonName("SegmentGroups")),
  SegmentDefinitionArn: S.String.pipe(T.JsonName("SegmentDefinitionArn")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("CreatedAt"),
  ),
  Tags: S.optional(TagMap).pipe(T.JsonName("Tags")),
  SegmentSqlQuery: S.optional(S.String).pipe(T.JsonName("SegmentSqlQuery")),
  SegmentType: S.optional(S.String).pipe(T.JsonName("SegmentType")),
}) {}
export class GetSegmentEstimateResponse extends S.Class<GetSegmentEstimateResponse>(
  "GetSegmentEstimateResponse",
)({
  DomainName: S.optional(S.String),
  EstimateId: S.optional(S.String),
  Status: S.optional(S.String),
  Estimate: S.optional(S.String),
  Message: S.optional(S.String),
  StatusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class GetSegmentSnapshotResponse extends S.Class<GetSegmentSnapshotResponse>(
  "GetSegmentSnapshotResponse",
)({
  SnapshotId: S.String,
  Status: S.String,
  StatusMessage: S.optional(S.String),
  DataFormat: S.String,
  EncryptionKey: S.optional(S.String),
  RoleArn: S.optional(S.String),
  DestinationUri: S.optional(S.String),
}) {}
export class GetSimilarProfilesResponse extends S.Class<GetSimilarProfilesResponse>(
  "GetSimilarProfilesResponse",
)({
  ProfileIds: S.optional(ProfileIdList),
  MatchId: S.optional(S.String),
  MatchType: S.optional(S.String),
  RuleLevel: S.optional(S.Number),
  ConfidenceScore: S.optional(S.Number),
  NextToken: S.optional(S.String),
}) {}
export class GetUploadJobPathResponse extends S.Class<GetUploadJobPathResponse>(
  "GetUploadJobPathResponse",
)({
  Url: S.String.pipe(T.JsonName("Url")),
  ClientToken: S.optional(S.String).pipe(T.JsonName("ClientToken")),
  ValidUntil: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("ValidUntil"),
  ),
}) {}
export class ListIntegrationItem extends S.Class<ListIntegrationItem>(
  "ListIntegrationItem",
)({
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
}) {}
export const IntegrationList = S.Array(ListIntegrationItem);
export class ListIntegrationsResponse extends S.Class<ListIntegrationsResponse>(
  "ListIntegrationsResponse",
)({ Items: S.optional(IntegrationList), NextToken: S.optional(S.String) }) {}
export class ListProfileObjectsRequest extends S.Class<ListProfileObjectsRequest>(
  "ListProfileObjectsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    DomainName: S.String.pipe(T.HttpLabel()),
    ObjectTypeName: S.String,
    ProfileId: S.String,
    ObjectFilter: S.optional(ObjectFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{DomainName}/profiles/objects" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRuleBasedMatchesResponse extends S.Class<ListRuleBasedMatchesResponse>(
  "ListRuleBasedMatchesResponse",
)({ MatchIds: S.optional(MatchIdList), NextToken: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class PutProfileObjectResponse extends S.Class<PutProfileObjectResponse>(
  "PutProfileObjectResponse",
)({ ProfileObjectUniqueKey: S.optional(S.String) }) {}
export class SearchProfilesRequest extends S.Class<SearchProfilesRequest>(
  "SearchProfilesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    DomainName: S.String.pipe(T.HttpLabel()),
    KeyName: S.String,
    Values: requestValueList,
    AdditionalSearchKeys: S.optional(additionalSearchKeysList),
    LogicalOperator: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{DomainName}/profiles/search" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AttributeItem extends S.Class<AttributeItem>("AttributeItem")({
  Name: S.String,
}) {}
export const AttributeList = S.Array(AttributeItem);
export class AttributeDetails extends S.Class<AttributeDetails>(
  "AttributeDetails",
)({ Attributes: AttributeList, Expression: S.String }) {}
export class Readiness extends S.Class<Readiness>("Readiness")({
  ProgressPercentage: S.optional(S.Number),
  Message: S.optional(S.String),
}) {}
export class UpdateCalculatedAttributeDefinitionResponse extends S.Class<UpdateCalculatedAttributeDefinitionResponse>(
  "UpdateCalculatedAttributeDefinitionResponse",
)({
  CalculatedAttributeName: S.optional(S.String),
  DisplayName: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Statistic: S.optional(S.String),
  Conditions: S.optional(Conditions),
  AttributeDetails: S.optional(AttributeDetails),
  UseHistoricalData: S.optional(S.Boolean),
  Status: S.optional(S.String),
  Readiness: S.optional(Readiness),
  Tags: S.optional(TagMap),
}) {}
export class MatchingResponse extends S.Class<MatchingResponse>(
  "MatchingResponse",
)({
  Enabled: S.optional(S.Boolean),
  JobSchedule: S.optional(JobSchedule),
  AutoMerging: S.optional(AutoMerging),
  ExportingConfig: S.optional(ExportingConfig),
}) {}
export class RuleBasedMatchingResponse extends S.Class<RuleBasedMatchingResponse>(
  "RuleBasedMatchingResponse",
)({
  Enabled: S.optional(S.Boolean),
  MatchingRules: S.optional(MatchingRules),
  Status: S.optional(S.String),
  MaxAllowedRuleLevelForMerging: S.optional(S.Number),
  MaxAllowedRuleLevelForMatching: S.optional(S.Number),
  AttributeTypesSelector: S.optional(AttributeTypesSelector),
  ConflictResolution: S.optional(ConflictResolution),
  ExportingConfig: S.optional(ExportingConfig),
}) {}
export class DataStoreResponse extends S.Class<DataStoreResponse>(
  "DataStoreResponse",
)({ Enabled: S.optional(S.Boolean), Readiness: S.optional(Readiness) }) {}
export class UpdateDomainResponse extends S.Class<UpdateDomainResponse>(
  "UpdateDomainResponse",
)({
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
}) {}
export class UpdateDomainLayoutResponse extends S.Class<UpdateDomainLayoutResponse>(
  "UpdateDomainLayoutResponse",
)({
  LayoutDefinitionName: S.optional(S.String),
  Description: S.optional(S.String),
  DisplayName: S.optional(S.String),
  IsDefault: S.optional(S.Boolean),
  LayoutType: S.optional(S.String),
  Layout: S.optional(S.String),
  Version: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(TagMap),
}) {}
export class UpdateEventTriggerResponse extends S.Class<UpdateEventTriggerResponse>(
  "UpdateEventTriggerResponse",
)({
  EventTriggerName: S.optional(S.String),
  ObjectTypeName: S.optional(S.String),
  Description: S.optional(S.String),
  EventTriggerConditions: S.optional(EventTriggerConditions),
  SegmentFilter: S.optional(S.String),
  EventTriggerLimits: S.optional(EventTriggerLimits),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(TagMap),
}) {}
export const PhonePreferenceList = S.Array(ContactPreference);
export class EngagementPreferences extends S.Class<EngagementPreferences>(
  "EngagementPreferences",
)({
  Phone: S.optional(PhonePreferenceList),
  Email: S.optional(EmailPreferenceList),
}) {}
export class UpdateProfileRequest extends S.Class<UpdateProfileRequest>(
  "UpdateProfileRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    ProfileId: S.String,
    AdditionalInformation: S.optional(S.String),
    AccountNumber: S.optional(S.String),
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
    Address: S.optional(UpdateAddress),
    ShippingAddress: S.optional(UpdateAddress),
    MailingAddress: S.optional(UpdateAddress),
    BillingAddress: S.optional(UpdateAddress),
    Attributes: S.optional(UpdateAttributes),
    PartyTypeString: S.optional(S.String),
    GenderString: S.optional(S.String),
    ProfileType: S.optional(S.String),
    EngagementPreferences: S.optional(EngagementPreferences),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/domains/{DomainName}/profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRecommenderResponse extends S.Class<UpdateRecommenderResponse>(
  "UpdateRecommenderResponse",
)({ RecommenderName: S.String }) {}
export const AttributeSourceIdMap = S.Record({
  key: S.String,
  value: S.String,
});
export class BatchGetProfileError extends S.Class<BatchGetProfileError>(
  "BatchGetProfileError",
)({ Code: S.String, Message: S.String, ProfileId: S.String }) {}
export const BatchGetProfileErrorList = S.Array(BatchGetProfileError);
export class DetectedProfileObjectType extends S.Class<DetectedProfileObjectType>(
  "DetectedProfileObjectType",
)({
  SourceLastUpdatedTimestampFormat: S.optional(S.String),
  Fields: S.optional(FieldMap),
  Keys: S.optional(KeyMap),
}) {}
export const DetectedProfileObjectTypes = S.Array(DetectedProfileObjectType);
export class DomainStats extends S.Class<DomainStats>("DomainStats")({
  ProfileCount: S.optional(S.Number),
  MeteringProfileCount: S.optional(S.Number),
  ObjectCount: S.optional(S.Number),
  TotalSize: S.optional(S.Number),
}) {}
export class EventStreamDestinationDetails extends S.Class<EventStreamDestinationDetails>(
  "EventStreamDestinationDetails",
)({
  Uri: S.String,
  Status: S.String,
  UnhealthySince: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Message: S.optional(S.String),
}) {}
export class JobStats extends S.Class<JobStats>("JobStats")({
  NumberOfProfilesReviewed: S.optional(S.Number),
  NumberOfMatchesFound: S.optional(S.Number),
  NumberOfMergesDone: S.optional(S.Number),
}) {}
export class MatchItem extends S.Class<MatchItem>("MatchItem")({
  MatchId: S.optional(S.String),
  ProfileIds: S.optional(ProfileIdList),
  ConfidenceScore: S.optional(S.Number),
}) {}
export const MatchesList = S.Array(MatchItem);
export class RecommenderUpdate extends S.Class<RecommenderUpdate>(
  "RecommenderUpdate",
)({
  RecommenderConfig: S.optional(RecommenderConfig),
  Status: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FailureReason: S.optional(S.String),
}) {}
export class FoundByKeyValue extends S.Class<FoundByKeyValue>(
  "FoundByKeyValue",
)({ KeyName: S.optional(S.String), Values: S.optional(requestValueList) }) {}
export const foundByList = S.Array(FoundByKeyValue);
export class Profile extends S.Class<Profile>("Profile")({
  ProfileId: S.optional(S.String),
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
  Address: S.optional(Address),
  ShippingAddress: S.optional(Address),
  MailingAddress: S.optional(Address),
  BillingAddress: S.optional(Address),
  Attributes: S.optional(Attributes),
  FoundByItems: S.optional(foundByList),
  PartyTypeString: S.optional(S.String),
  GenderString: S.optional(S.String),
  ProfileType: S.optional(S.String),
  EngagementPreferences: S.optional(EngagementPreferences),
}) {}
export class ProfileQueryResult extends S.Class<ProfileQueryResult>(
  "ProfileQueryResult",
)({
  ProfileId: S.String.pipe(T.JsonName("ProfileId")),
  QueryResult: S.String.pipe(T.JsonName("QueryResult")),
  Profile: S.optional(Profile).pipe(T.JsonName("Profile")),
}) {}
export const Profiles = S.Array(ProfileQueryResult);
export class ProfileQueryFailures extends S.Class<ProfileQueryFailures>(
  "ProfileQueryFailures",
)({
  ProfileId: S.String.pipe(T.JsonName("ProfileId")),
  Message: S.String.pipe(T.JsonName("Message")),
  Status: S.optional(S.Number).pipe(T.JsonName("Status")),
}) {}
export const Failures = S.Array(ProfileQueryFailures);
export class ResultsSummary extends S.Class<ResultsSummary>("ResultsSummary")({
  UpdatedRecords: S.optional(S.Number).pipe(T.JsonName("UpdatedRecords")),
  CreatedRecords: S.optional(S.Number).pipe(T.JsonName("CreatedRecords")),
  FailedRecords: S.optional(S.Number).pipe(T.JsonName("FailedRecords")),
}) {}
export class ListCalculatedAttributeDefinitionItem extends S.Class<ListCalculatedAttributeDefinitionItem>(
  "ListCalculatedAttributeDefinitionItem",
)({
  CalculatedAttributeName: S.optional(S.String),
  DisplayName: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UseHistoricalData: S.optional(S.Boolean),
  Status: S.optional(S.String),
  Tags: S.optional(TagMap),
}) {}
export const CalculatedAttributeDefinitionsList = S.Array(
  ListCalculatedAttributeDefinitionItem,
);
export class ListCalculatedAttributeForProfileItem extends S.Class<ListCalculatedAttributeForProfileItem>(
  "ListCalculatedAttributeForProfileItem",
)({
  CalculatedAttributeName: S.optional(S.String),
  DisplayName: S.optional(S.String),
  IsDataPartial: S.optional(S.String),
  Value: S.optional(S.String),
  LastObjectTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const CalculatedAttributesForProfileList = S.Array(
  ListCalculatedAttributeForProfileItem,
);
export class LayoutItem extends S.Class<LayoutItem>("LayoutItem")({
  LayoutDefinitionName: S.String,
  Description: S.String,
  DisplayName: S.String,
  IsDefault: S.optional(S.Boolean),
  LayoutType: S.String,
  Tags: S.optional(TagMap),
  CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const LayoutList = S.Array(LayoutItem);
export class DomainObjectTypesListItem extends S.Class<DomainObjectTypesListItem>(
  "DomainObjectTypesListItem",
)({
  ObjectTypeName: S.String,
  Description: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(TagMap),
}) {}
export const DomainObjectTypesList = S.Array(DomainObjectTypesListItem);
export class ListDomainItem extends S.Class<ListDomainItem>("ListDomainItem")({
  DomainName: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Tags: S.optional(TagMap),
}) {}
export const DomainList = S.Array(ListDomainItem);
export class EventTriggerSummaryItem extends S.Class<EventTriggerSummaryItem>(
  "EventTriggerSummaryItem",
)({
  ObjectTypeName: S.optional(S.String),
  EventTriggerName: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(TagMap),
}) {}
export const EventTriggerSummaryList = S.Array(EventTriggerSummaryItem);
export class S3ExportingLocation extends S.Class<S3ExportingLocation>(
  "S3ExportingLocation",
)({ S3BucketName: S.optional(S.String), S3KeyName: S.optional(S.String) }) {}
export class ExportingLocation extends S.Class<ExportingLocation>(
  "ExportingLocation",
)({ S3Exporting: S.optional(S3ExportingLocation) }) {}
export class IdentityResolutionJob extends S.Class<IdentityResolutionJob>(
  "IdentityResolutionJob",
)({
  DomainName: S.optional(S.String),
  JobId: S.optional(S.String),
  Status: S.optional(S.String),
  JobStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  JobEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  JobStats: S.optional(JobStats),
  ExportingLocation: S.optional(ExportingLocation),
  Message: S.optional(S.String),
}) {}
export const IdentityResolutionJobsList = S.Array(IdentityResolutionJob);
export class ListObjectTypeAttributeItem extends S.Class<ListObjectTypeAttributeItem>(
  "ListObjectTypeAttributeItem",
)({
  AttributeName: S.String,
  LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const ListObjectTypeAttributesList = S.Array(
  ListObjectTypeAttributeItem,
);
export class ListObjectTypeAttributeValuesItem extends S.Class<ListObjectTypeAttributeValuesItem>(
  "ListObjectTypeAttributeValuesItem",
)({
  Value: S.String,
  LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const ListObjectTypeAttributeValuesList = S.Array(
  ListObjectTypeAttributeValuesItem,
);
export class AttributeValueItem extends S.Class<AttributeValueItem>(
  "AttributeValueItem",
)({ Value: S.optional(S.String) }) {}
export const AttributeValueItemList = S.Array(AttributeValueItem);
export class ProfileHistoryRecord extends S.Class<ProfileHistoryRecord>(
  "ProfileHistoryRecord",
)({
  Id: S.String,
  ObjectTypeName: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ActionType: S.String,
  ProfileObjectUniqueKey: S.optional(S.String),
  PerformedBy: S.optional(S.String),
}) {}
export const ProfileHistoryRecords = S.Array(ProfileHistoryRecord);
export class ListProfileObjectTypeItem extends S.Class<ListProfileObjectTypeItem>(
  "ListProfileObjectTypeItem",
)({
  ObjectTypeName: S.String,
  Description: S.String,
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  MaxProfileObjectCount: S.optional(S.Number),
  MaxAvailableProfileObjectCount: S.optional(S.Number),
  Tags: S.optional(TagMap),
}) {}
export const ProfileObjectTypeList = S.Array(ListProfileObjectTypeItem);
export class ListProfileObjectTypeTemplateItem extends S.Class<ListProfileObjectTypeTemplateItem>(
  "ListProfileObjectTypeTemplateItem",
)({
  TemplateId: S.optional(S.String),
  SourceName: S.optional(S.String),
  SourceObject: S.optional(S.String),
}) {}
export const ProfileObjectTypeTemplateList = S.Array(
  ListProfileObjectTypeTemplateItem,
);
export class RecommenderRecipe extends S.Class<RecommenderRecipe>(
  "RecommenderRecipe",
)({ name: S.optional(S.String), description: S.optional(S.String) }) {}
export const RecommenderRecipesList = S.Array(RecommenderRecipe);
export class RecommenderSummary extends S.Class<RecommenderSummary>(
  "RecommenderSummary",
)({
  RecommenderName: S.optional(S.String),
  RecipeName: S.optional(S.String),
  RecommenderConfig: S.optional(RecommenderConfig),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(TagMap),
  FailureReason: S.optional(S.String),
  LatestRecommenderUpdate: S.optional(RecommenderUpdate),
}) {}
export const RecommenderSummaryList = S.Array(RecommenderSummary);
export class SegmentDefinitionItem extends S.Class<SegmentDefinitionItem>(
  "SegmentDefinitionItem",
)({
  SegmentDefinitionName: S.optional(S.String).pipe(
    T.JsonName("SegmentDefinitionName"),
  ),
  DisplayName: S.optional(S.String).pipe(T.JsonName("DisplayName")),
  Description: S.optional(S.String).pipe(T.JsonName("Description")),
  SegmentDefinitionArn: S.optional(S.String).pipe(
    T.JsonName("SegmentDefinitionArn"),
  ),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("CreatedAt"),
  ),
  Tags: S.optional(TagMap).pipe(T.JsonName("Tags")),
  SegmentType: S.optional(S.String).pipe(T.JsonName("SegmentType")),
}) {}
export const SegmentDefinitionsList = S.Array(SegmentDefinitionItem);
export class UploadJobItem extends S.Class<UploadJobItem>("UploadJobItem")({
  JobId: S.optional(S.String).pipe(T.JsonName("JobId")),
  DisplayName: S.optional(S.String).pipe(T.JsonName("DisplayName")),
  Status: S.optional(S.String).pipe(T.JsonName("Status")),
  StatusReason: S.optional(S.String).pipe(T.JsonName("StatusReason")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("CreatedAt"),
  ),
  CompletedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("CompletedAt"),
  ),
  DataExpiry: S.optional(S.Number).pipe(T.JsonName("DataExpiry")),
}) {}
export const UploadJobsList = S.Array(UploadJobItem);
export class ListWorkflowsItem extends S.Class<ListWorkflowsItem>(
  "ListWorkflowsItem",
)({
  WorkflowType: S.String,
  WorkflowId: S.String,
  Status: S.String,
  StatusDescription: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const WorkflowList = S.Array(ListWorkflowsItem);
export class FieldSourceProfileIds extends S.Class<FieldSourceProfileIds>(
  "FieldSourceProfileIds",
)({
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
}) {}
export class Batch extends S.Class<Batch>("Batch")({
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const Batches = S.Array(Batch);
export class IncrementalPullConfig extends S.Class<IncrementalPullConfig>(
  "IncrementalPullConfig",
)({ DatetimeTypeFieldName: S.optional(S.String) }) {}
export class ConnectorOperator extends S.Class<ConnectorOperator>(
  "ConnectorOperator",
)({
  Marketo: S.optional(S.String),
  S3: S.optional(S.String),
  Salesforce: S.optional(S.String),
  ServiceNow: S.optional(S.String),
  Zendesk: S.optional(S.String),
}) {}
export const TaskPropertiesMap = S.Record({ key: S.String, value: S.String });
export class BatchGetCalculatedAttributeForProfileRequest extends S.Class<BatchGetCalculatedAttributeForProfileRequest>(
  "BatchGetCalculatedAttributeForProfileRequest",
)(
  {
    CalculatedAttributeName: S.String.pipe(T.HttpLabel()),
    DomainName: S.String.pipe(T.HttpLabel()),
    ProfileIds: BatchGetCalculatedAttributeForProfileIdList,
    ConditionOverrides: S.optional(ConditionOverrides),
  },
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
) {}
export class CreateProfileRequest extends S.Class<CreateProfileRequest>(
  "CreateProfileRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
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
    Address: S.optional(Address),
    ShippingAddress: S.optional(Address),
    MailingAddress: S.optional(Address),
    BillingAddress: S.optional(Address),
    Attributes: S.optional(Attributes),
    PartyTypeString: S.optional(S.String),
    GenderString: S.optional(S.String),
    ProfileType: S.optional(S.String),
    EngagementPreferences: S.optional(EngagementPreferences),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{DomainName}/profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSegmentEstimateResponse extends S.Class<CreateSegmentEstimateResponse>(
  "CreateSegmentEstimateResponse",
)({
  DomainName: S.optional(S.String),
  EstimateId: S.optional(S.String),
  StatusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class CreateUploadJobRequest extends S.Class<CreateUploadJobRequest>(
  "CreateUploadJobRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    DisplayName: S.String,
    Fields: FieldMap,
    UniqueKey: S.String,
    DataExpiry: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{DomainName}/upload-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DetectProfileObjectTypeResponse extends S.Class<DetectProfileObjectTypeResponse>(
  "DetectProfileObjectTypeResponse",
)({ DetectedProfileObjectTypes: S.optional(DetectedProfileObjectTypes) }) {}
export class GetAutoMergingPreviewResponse extends S.Class<GetAutoMergingPreviewResponse>(
  "GetAutoMergingPreviewResponse",
)({
  DomainName: S.String,
  NumberOfMatchesInSample: S.optional(S.Number),
  NumberOfProfilesInSample: S.optional(S.Number),
  NumberOfProfilesWillBeMerged: S.optional(S.Number),
}) {}
export const ValueList = S.Array(S.String);
export class FilterAttributeDimension extends S.Class<FilterAttributeDimension>(
  "FilterAttributeDimension",
)({ DimensionType: S.String, Values: ValueList }) {}
export const AttributeMap = S.Record({
  key: S.String,
  value: FilterAttributeDimension,
});
export class FilterDimension extends S.Class<FilterDimension>(
  "FilterDimension",
)({ Attributes: AttributeMap }) {}
export const FilterDimensionList = S.Array(FilterDimension);
export class FilterGroup extends S.Class<FilterGroup>("FilterGroup")({
  Type: S.String,
  Dimensions: FilterDimensionList,
}) {}
export const GroupList = S.Array(FilterGroup);
export class Filter extends S.Class<Filter>("Filter")({
  Include: S.String,
  Groups: GroupList,
}) {}
export class GetCalculatedAttributeDefinitionResponse extends S.Class<GetCalculatedAttributeDefinitionResponse>(
  "GetCalculatedAttributeDefinitionResponse",
)({
  CalculatedAttributeName: S.optional(S.String),
  DisplayName: S.optional(S.String),
  Description: S.optional(S.String),
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
}) {}
export class GetDomainResponse extends S.Class<GetDomainResponse>(
  "GetDomainResponse",
)({
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
}) {}
export class GetEventStreamResponse extends S.Class<GetEventStreamResponse>(
  "GetEventStreamResponse",
)({
  DomainName: S.String,
  EventStreamArn: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  State: S.String,
  StoppedSince: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DestinationDetails: EventStreamDestinationDetails,
  Tags: S.optional(TagMap),
}) {}
export class GetMatchesResponse extends S.Class<GetMatchesResponse>(
  "GetMatchesResponse",
)({
  NextToken: S.optional(S.String),
  MatchGenerationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  PotentialMatches: S.optional(S.Number),
  Matches: S.optional(MatchesList),
}) {}
export class GetSegmentMembershipResponse extends S.Class<GetSegmentMembershipResponse>(
  "GetSegmentMembershipResponse",
)({
  SegmentDefinitionName: S.optional(S.String).pipe(
    T.JsonName("SegmentDefinitionName"),
  ),
  Profiles: S.optional(Profiles).pipe(T.JsonName("Profiles")),
  Failures: S.optional(Failures).pipe(T.JsonName("Failures")),
  LastComputedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ).pipe(T.JsonName("LastComputedAt")),
}) {}
export class GetUploadJobResponse extends S.Class<GetUploadJobResponse>(
  "GetUploadJobResponse",
)({
  JobId: S.optional(S.String).pipe(T.JsonName("JobId")),
  DisplayName: S.optional(S.String).pipe(T.JsonName("DisplayName")),
  Status: S.optional(S.String).pipe(T.JsonName("Status")),
  StatusReason: S.optional(S.String).pipe(T.JsonName("StatusReason")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("CreatedAt"),
  ),
  CompletedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("CompletedAt"),
  ),
  Fields: S.optional(FieldMap).pipe(T.JsonName("Fields")),
  UniqueKey: S.optional(S.String).pipe(T.JsonName("UniqueKey")),
  ResultsSummary: S.optional(ResultsSummary).pipe(T.JsonName("ResultsSummary")),
  DataExpiry: S.optional(S.Number).pipe(T.JsonName("DataExpiry")),
}) {}
export class ListAccountIntegrationsResponse extends S.Class<ListAccountIntegrationsResponse>(
  "ListAccountIntegrationsResponse",
)({ Items: S.optional(IntegrationList), NextToken: S.optional(S.String) }) {}
export class ListCalculatedAttributeDefinitionsResponse extends S.Class<ListCalculatedAttributeDefinitionsResponse>(
  "ListCalculatedAttributeDefinitionsResponse",
)({
  Items: S.optional(CalculatedAttributeDefinitionsList),
  NextToken: S.optional(S.String),
}) {}
export class ListCalculatedAttributesForProfileResponse extends S.Class<ListCalculatedAttributesForProfileResponse>(
  "ListCalculatedAttributesForProfileResponse",
)({
  Items: S.optional(CalculatedAttributesForProfileList),
  NextToken: S.optional(S.String),
}) {}
export class ListDomainLayoutsResponse extends S.Class<ListDomainLayoutsResponse>(
  "ListDomainLayoutsResponse",
)({ Items: S.optional(LayoutList), NextToken: S.optional(S.String) }) {}
export class ListDomainObjectTypesResponse extends S.Class<ListDomainObjectTypesResponse>(
  "ListDomainObjectTypesResponse",
)({
  Items: S.optional(DomainObjectTypesList),
  NextToken: S.optional(S.String),
}) {}
export class ListDomainsResponse extends S.Class<ListDomainsResponse>(
  "ListDomainsResponse",
)({ Items: S.optional(DomainList), NextToken: S.optional(S.String) }) {}
export class ListEventTriggersResponse extends S.Class<ListEventTriggersResponse>(
  "ListEventTriggersResponse",
)({
  Items: S.optional(EventTriggerSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListIdentityResolutionJobsResponse extends S.Class<ListIdentityResolutionJobsResponse>(
  "ListIdentityResolutionJobsResponse",
)({
  IdentityResolutionJobsList: S.optional(IdentityResolutionJobsList),
  NextToken: S.optional(S.String),
}) {}
export class ListObjectTypeAttributesResponse extends S.Class<ListObjectTypeAttributesResponse>(
  "ListObjectTypeAttributesResponse",
)({
  Items: S.optional(ListObjectTypeAttributesList),
  NextToken: S.optional(S.String),
}) {}
export class ListObjectTypeAttributeValuesResponse extends S.Class<ListObjectTypeAttributeValuesResponse>(
  "ListObjectTypeAttributeValuesResponse",
)({
  Items: S.optional(ListObjectTypeAttributeValuesList),
  NextToken: S.optional(S.String),
}) {}
export class ProfileAttributeValuesResponse extends S.Class<ProfileAttributeValuesResponse>(
  "ProfileAttributeValuesResponse",
)({
  DomainName: S.optional(S.String),
  AttributeName: S.optional(S.String),
  Items: S.optional(AttributeValueItemList),
  StatusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class ListProfileHistoryRecordsResponse extends S.Class<ListProfileHistoryRecordsResponse>(
  "ListProfileHistoryRecordsResponse",
)({
  ProfileHistoryRecords: S.optional(ProfileHistoryRecords),
  NextToken: S.optional(S.String),
}) {}
export class ListProfileObjectTypesResponse extends S.Class<ListProfileObjectTypesResponse>(
  "ListProfileObjectTypesResponse",
)({
  Items: S.optional(ProfileObjectTypeList),
  NextToken: S.optional(S.String),
}) {}
export class ListProfileObjectTypeTemplatesResponse extends S.Class<ListProfileObjectTypeTemplatesResponse>(
  "ListProfileObjectTypeTemplatesResponse",
)({
  Items: S.optional(ProfileObjectTypeTemplateList),
  NextToken: S.optional(S.String),
}) {}
export class ListRecommenderRecipesResponse extends S.Class<ListRecommenderRecipesResponse>(
  "ListRecommenderRecipesResponse",
)({
  NextToken: S.optional(S.String),
  RecommenderRecipes: S.optional(RecommenderRecipesList),
}) {}
export class ListRecommendersResponse extends S.Class<ListRecommendersResponse>(
  "ListRecommendersResponse",
)({
  NextToken: S.optional(S.String),
  Recommenders: S.optional(RecommenderSummaryList),
}) {}
export class ListSegmentDefinitionsResponse extends S.Class<ListSegmentDefinitionsResponse>(
  "ListSegmentDefinitionsResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("NextToken")),
  Items: S.optional(SegmentDefinitionsList).pipe(T.JsonName("Items")),
}) {}
export class ListUploadJobsResponse extends S.Class<ListUploadJobsResponse>(
  "ListUploadJobsResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("NextToken")),
  Items: S.optional(UploadJobsList).pipe(T.JsonName("Items")),
}) {}
export class ListWorkflowsResponse extends S.Class<ListWorkflowsResponse>(
  "ListWorkflowsResponse",
)({ Items: S.optional(WorkflowList), NextToken: S.optional(S.String) }) {}
export class MergeProfilesRequest extends S.Class<MergeProfilesRequest>(
  "MergeProfilesRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    MainProfileId: S.String,
    ProfileIdsToBeMerged: ProfileIdToBeMergedList,
    FieldSourceProfileIds: S.optional(FieldSourceProfileIds),
  },
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
) {}
export class PutDomainObjectTypeRequest extends S.Class<PutDomainObjectTypeRequest>(
  "PutDomainObjectTypeRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    ObjectTypeName: S.String.pipe(T.HttpLabel()),
    Description: S.optional(S.String),
    EncryptionKey: S.optional(S.String),
    Fields: DomainObjectTypeFields,
    Tags: S.optional(TagMap),
  },
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
) {}
export class PutProfileObjectTypeRequest extends S.Class<PutProfileObjectTypeRequest>(
  "PutProfileObjectTypeRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    ObjectTypeName: S.String.pipe(T.HttpLabel()),
    Description: S.String,
    TemplateId: S.optional(S.String),
    ExpirationDays: S.optional(S.Number),
    EncryptionKey: S.optional(S.String),
    AllowProfileCreation: S.optional(S.Boolean),
    SourceLastUpdatedTimestampFormat: S.optional(S.String),
    MaxProfileObjectCount: S.optional(S.Number),
    Fields: S.optional(FieldMap),
    Keys: S.optional(KeyMap),
    Tags: S.optional(TagMap),
  },
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
) {}
export const ProfileList = S.Array(Profile);
export class SearchProfilesResponse extends S.Class<SearchProfilesResponse>(
  "SearchProfilesResponse",
)({ Items: S.optional(ProfileList), NextToken: S.optional(S.String) }) {}
export class UpdateProfileResponse extends S.Class<UpdateProfileResponse>(
  "UpdateProfileResponse",
)({ ProfileId: S.String }) {}
export class MarketoSourceProperties extends S.Class<MarketoSourceProperties>(
  "MarketoSourceProperties",
)({ Object: S.String }) {}
export class S3SourceProperties extends S.Class<S3SourceProperties>(
  "S3SourceProperties",
)({ BucketName: S.String, BucketPrefix: S.optional(S.String) }) {}
export class SalesforceSourceProperties extends S.Class<SalesforceSourceProperties>(
  "SalesforceSourceProperties",
)({
  Object: S.String,
  EnableDynamicFieldUpdate: S.optional(S.Boolean),
  IncludeDeletedRecords: S.optional(S.Boolean),
}) {}
export class ServiceNowSourceProperties extends S.Class<ServiceNowSourceProperties>(
  "ServiceNowSourceProperties",
)({ Object: S.String }) {}
export class ZendeskSourceProperties extends S.Class<ZendeskSourceProperties>(
  "ZendeskSourceProperties",
)({ Object: S.String }) {}
export class SourceConnectorProperties extends S.Class<SourceConnectorProperties>(
  "SourceConnectorProperties",
)({
  Marketo: S.optional(MarketoSourceProperties),
  S3: S.optional(S3SourceProperties),
  Salesforce: S.optional(SalesforceSourceProperties),
  ServiceNow: S.optional(ServiceNowSourceProperties),
  Zendesk: S.optional(ZendeskSourceProperties),
}) {}
export class SourceFlowConfig extends S.Class<SourceFlowConfig>(
  "SourceFlowConfig",
)({
  ConnectorProfileName: S.optional(S.String),
  ConnectorType: S.String,
  IncrementalPullConfig: S.optional(IncrementalPullConfig),
  SourceConnectorProperties: SourceConnectorProperties,
}) {}
export class Task extends S.Class<Task>("Task")({
  ConnectorOperator: S.optional(ConnectorOperator),
  DestinationField: S.optional(S.String),
  SourceFields: SourceFields,
  TaskProperties: S.optional(TaskPropertiesMap),
  TaskType: S.String,
}) {}
export const Tasks = S.Array(Task);
export class ScheduledTriggerProperties extends S.Class<ScheduledTriggerProperties>(
  "ScheduledTriggerProperties",
)({
  ScheduleExpression: S.String,
  DataPullMode: S.optional(S.String),
  ScheduleStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ScheduleEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Timezone: S.optional(S.String),
  ScheduleOffset: S.optional(S.Number),
  FirstExecutionFrom: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class TriggerProperties extends S.Class<TriggerProperties>(
  "TriggerProperties",
)({ Scheduled: S.optional(ScheduledTriggerProperties) }) {}
export class TriggerConfig extends S.Class<TriggerConfig>("TriggerConfig")({
  TriggerType: S.String,
  TriggerProperties: S.optional(TriggerProperties),
}) {}
export class FlowDefinition extends S.Class<FlowDefinition>("FlowDefinition")({
  Description: S.optional(S.String),
  FlowName: S.String,
  KmsArn: S.String,
  SourceFlowConfig: SourceFlowConfig,
  Tasks: Tasks,
  TriggerConfig: TriggerConfig,
}) {}
export class AppflowIntegration extends S.Class<AppflowIntegration>(
  "AppflowIntegration",
)({ FlowDefinition: FlowDefinition, Batches: S.optional(Batches) }) {}
export class GetObjectTypeAttributeStatisticsPercentiles extends S.Class<GetObjectTypeAttributeStatisticsPercentiles>(
  "GetObjectTypeAttributeStatisticsPercentiles",
)({
  P5: S.Number,
  P25: S.Number,
  P50: S.Number,
  P75: S.Number,
  P95: S.Number,
}) {}
export const Metrics = S.Record({ key: S.String, value: S.Number });
export class AppflowIntegrationWorkflowAttributes extends S.Class<AppflowIntegrationWorkflowAttributes>(
  "AppflowIntegrationWorkflowAttributes",
)({
  SourceConnectorType: S.String,
  ConnectorProfileName: S.String,
  RoleArn: S.optional(S.String),
}) {}
export class AppflowIntegrationWorkflowMetrics extends S.Class<AppflowIntegrationWorkflowMetrics>(
  "AppflowIntegrationWorkflowMetrics",
)({
  RecordsProcessed: S.Number,
  StepsCompleted: S.Number,
  TotalSteps: S.Number,
}) {}
export class AppflowIntegrationWorkflowStep extends S.Class<AppflowIntegrationWorkflowStep>(
  "AppflowIntegrationWorkflowStep",
)({
  FlowName: S.String,
  Status: S.String,
  ExecutionMessage: S.String,
  RecordsProcessed: S.Number,
  BatchRecordsStartTime: S.String,
  BatchRecordsEndTime: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class DestinationSummary extends S.Class<DestinationSummary>(
  "DestinationSummary",
)({
  Uri: S.String,
  Status: S.String,
  UnhealthySince: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class IntegrationConfig extends S.Class<IntegrationConfig>(
  "IntegrationConfig",
)({ AppflowIntegration: S.optional(AppflowIntegration) }) {}
export class GetObjectTypeAttributeStatisticsStats extends S.Class<GetObjectTypeAttributeStatisticsStats>(
  "GetObjectTypeAttributeStatisticsStats",
)({
  Maximum: S.Number,
  Minimum: S.Number,
  Average: S.Number,
  StandardDeviation: S.Number,
  Percentiles: GetObjectTypeAttributeStatisticsPercentiles,
}) {}
export class TrainingMetrics extends S.Class<TrainingMetrics>(
  "TrainingMetrics",
)({
  Time: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Metrics: S.optional(Metrics),
}) {}
export const TrainingMetricsList = S.Array(TrainingMetrics);
export class WorkflowAttributes extends S.Class<WorkflowAttributes>(
  "WorkflowAttributes",
)({ AppflowIntegration: S.optional(AppflowIntegrationWorkflowAttributes) }) {}
export class WorkflowMetrics extends S.Class<WorkflowMetrics>(
  "WorkflowMetrics",
)({ AppflowIntegration: S.optional(AppflowIntegrationWorkflowMetrics) }) {}
export class WorkflowStepItem extends S.Class<WorkflowStepItem>(
  "WorkflowStepItem",
)({ AppflowIntegration: S.optional(AppflowIntegrationWorkflowStep) }) {}
export const WorkflowStepsList = S.Array(WorkflowStepItem);
export class EventStreamSummary extends S.Class<EventStreamSummary>(
  "EventStreamSummary",
)({
  DomainName: S.String,
  EventStreamName: S.String,
  EventStreamArn: S.String,
  State: S.String,
  StoppedSince: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DestinationSummary: S.optional(DestinationSummary),
  Tags: S.optional(TagMap),
}) {}
export const EventStreamSummaryList = S.Array(EventStreamSummary);
export class ListProfileObjectsItem extends S.Class<ListProfileObjectsItem>(
  "ListProfileObjectsItem",
)({
  ObjectTypeName: S.optional(S.String),
  ProfileObjectUniqueKey: S.optional(S.String),
  Object: S.optional(S.String),
}) {}
export const ProfileObjectList = S.Array(ListProfileObjectsItem);
export class BatchGetProfileResponse extends S.Class<BatchGetProfileResponse>(
  "BatchGetProfileResponse",
)({
  Errors: S.optional(BatchGetProfileErrorList),
  Profiles: S.optional(ProfileList),
}) {}
export class CreateDomainRequest extends S.Class<CreateDomainRequest>(
  "CreateDomainRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    DefaultExpirationDays: S.Number,
    DefaultEncryptionKey: S.optional(S.String),
    DeadLetterQueueUrl: S.optional(S.String),
    Matching: S.optional(MatchingRequest),
    RuleBasedMatching: S.optional(RuleBasedMatchingRequest),
    DataStore: S.optional(DataStoreRequest),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domains/{DomainName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEventTriggerRequest extends S.Class<CreateEventTriggerRequest>(
  "CreateEventTriggerRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    EventTriggerName: S.String.pipe(T.HttpLabel()),
    ObjectTypeName: S.String,
    Description: S.optional(S.String),
    EventTriggerConditions: EventTriggerConditions,
    SegmentFilter: S.optional(S.String),
    EventTriggerLimits: S.optional(EventTriggerLimits),
    Tags: S.optional(TagMap),
  },
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
) {}
export class CreateIntegrationWorkflowRequest extends S.Class<CreateIntegrationWorkflowRequest>(
  "CreateIntegrationWorkflowRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    WorkflowType: S.String,
    IntegrationConfig: IntegrationConfig,
    ObjectTypeName: S.String,
    RoleArn: S.String,
    Tags: S.optional(TagMap),
  },
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
) {}
export class CreateProfileResponse extends S.Class<CreateProfileResponse>(
  "CreateProfileResponse",
)({ ProfileId: S.String }) {}
export class CreateRecommenderRequest extends S.Class<CreateRecommenderRequest>(
  "CreateRecommenderRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    RecommenderName: S.String.pipe(T.HttpLabel()),
    RecommenderRecipeName: S.String,
    RecommenderConfig: S.optional(RecommenderConfig),
    Description: S.optional(S.String),
    Tags: S.optional(TagMap),
  },
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
) {}
export class CreateUploadJobResponse extends S.Class<CreateUploadJobResponse>(
  "CreateUploadJobResponse",
)({ JobId: S.String.pipe(T.JsonName("JobId")) }) {}
export class GetIdentityResolutionJobResponse extends S.Class<GetIdentityResolutionJobResponse>(
  "GetIdentityResolutionJobResponse",
)({
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
}) {}
export class GetObjectTypeAttributeStatisticsResponse extends S.Class<GetObjectTypeAttributeStatisticsResponse>(
  "GetObjectTypeAttributeStatisticsResponse",
)({
  Statistics: GetObjectTypeAttributeStatisticsStats,
  CalculatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class GetRecommenderResponse extends S.Class<GetRecommenderResponse>(
  "GetRecommenderResponse",
)({
  RecommenderName: S.String,
  RecommenderRecipeName: S.String,
  RecommenderConfig: S.optional(RecommenderConfig),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FailureReason: S.optional(S.String),
  LatestRecommenderUpdate: S.optional(RecommenderUpdate),
  TrainingMetrics: S.optional(TrainingMetricsList),
  Tags: S.optional(TagMap),
}) {}
export class GetWorkflowResponse extends S.Class<GetWorkflowResponse>(
  "GetWorkflowResponse",
)({
  WorkflowId: S.optional(S.String),
  WorkflowType: S.optional(S.String),
  Status: S.optional(S.String),
  ErrorDescription: S.optional(S.String),
  StartDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Attributes: S.optional(WorkflowAttributes),
  Metrics: S.optional(WorkflowMetrics),
}) {}
export class GetWorkflowStepsResponse extends S.Class<GetWorkflowStepsResponse>(
  "GetWorkflowStepsResponse",
)({
  WorkflowId: S.optional(S.String),
  WorkflowType: S.optional(S.String),
  Items: S.optional(WorkflowStepsList),
  NextToken: S.optional(S.String),
}) {}
export class ListEventStreamsResponse extends S.Class<ListEventStreamsResponse>(
  "ListEventStreamsResponse",
)({
  Items: S.optional(EventStreamSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListProfileObjectsResponse extends S.Class<ListProfileObjectsResponse>(
  "ListProfileObjectsResponse",
)({ Items: S.optional(ProfileObjectList), NextToken: S.optional(S.String) }) {}
export class MergeProfilesResponse extends S.Class<MergeProfilesResponse>(
  "MergeProfilesResponse",
)({ Message: S.optional(S.String) }) {}
export class PutDomainObjectTypeResponse extends S.Class<PutDomainObjectTypeResponse>(
  "PutDomainObjectTypeResponse",
)({
  ObjectTypeName: S.optional(S.String),
  Description: S.optional(S.String),
  EncryptionKey: S.optional(S.String),
  Fields: S.optional(DomainObjectTypeFields),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(TagMap),
}) {}
export class PutProfileObjectTypeResponse extends S.Class<PutProfileObjectTypeResponse>(
  "PutProfileObjectTypeResponse",
)({
  ObjectTypeName: S.String,
  Description: S.String,
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
}) {}
export class CatalogItem extends S.Class<CatalogItem>("CatalogItem")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Code: S.optional(S.String),
  Type: S.optional(S.String),
  Category: S.optional(S.String),
  Description: S.optional(S.String),
  AdditionalInformation: S.optional(S.String),
  ImageLink: S.optional(S.String),
  Link: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Price: S.optional(S.String),
  Attributes: S.optional(Attributes),
}) {}
export class BatchGetCalculatedAttributeForProfileError extends S.Class<BatchGetCalculatedAttributeForProfileError>(
  "BatchGetCalculatedAttributeForProfileError",
)({ Code: S.String, Message: S.String, ProfileId: S.String }) {}
export const BatchGetCalculatedAttributeForProfileErrorList = S.Array(
  BatchGetCalculatedAttributeForProfileError,
);
export class CalculatedAttributeValue extends S.Class<CalculatedAttributeValue>(
  "CalculatedAttributeValue",
)({
  CalculatedAttributeName: S.optional(S.String),
  DisplayName: S.optional(S.String),
  IsDataPartial: S.optional(S.String),
  ProfileId: S.optional(S.String),
  Value: S.optional(S.String),
  LastObjectTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const CalculatedAttributeValueList = S.Array(CalculatedAttributeValue);
export class Recommendation extends S.Class<Recommendation>("Recommendation")({
  CatalogItem: S.optional(CatalogItem),
  Score: S.optional(S.Number),
}) {}
export const Recommendations = S.Array(Recommendation);
export class BatchGetCalculatedAttributeForProfileResponse extends S.Class<BatchGetCalculatedAttributeForProfileResponse>(
  "BatchGetCalculatedAttributeForProfileResponse",
)({
  Errors: S.optional(BatchGetCalculatedAttributeForProfileErrorList),
  CalculatedAttributeValues: S.optional(CalculatedAttributeValueList),
  ConditionOverrides: S.optional(ConditionOverrides),
}) {}
export class CreateDomainResponse extends S.Class<CreateDomainResponse>(
  "CreateDomainResponse",
)({
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
}) {}
export class CreateEventTriggerResponse extends S.Class<CreateEventTriggerResponse>(
  "CreateEventTriggerResponse",
)({
  EventTriggerName: S.optional(S.String),
  ObjectTypeName: S.optional(S.String),
  Description: S.optional(S.String),
  EventTriggerConditions: S.optional(EventTriggerConditions),
  SegmentFilter: S.optional(S.String),
  EventTriggerLimits: S.optional(EventTriggerLimits),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(TagMap),
}) {}
export class CreateIntegrationWorkflowResponse extends S.Class<CreateIntegrationWorkflowResponse>(
  "CreateIntegrationWorkflowResponse",
)({ WorkflowId: S.String, Message: S.String }) {}
export class CreateRecommenderResponse extends S.Class<CreateRecommenderResponse>(
  "CreateRecommenderResponse",
)({ RecommenderArn: S.String, Tags: S.optional(TagMap) }) {}
export class GetProfileRecommendationsResponse extends S.Class<GetProfileRecommendationsResponse>(
  "GetProfileRecommendationsResponse",
)({ Recommendations: S.optional(Recommendations) }) {}
export class PutIntegrationRequest extends S.Class<PutIntegrationRequest>(
  "PutIntegrationRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    Uri: S.optional(S.String),
    ObjectTypeName: S.optional(S.String),
    ObjectTypeNames: S.optional(ObjectTypeNames),
    Tags: S.optional(TagMap),
    FlowDefinition: S.optional(FlowDefinition),
    RoleArn: S.optional(S.String),
    EventTriggerNames: S.optional(EventTriggerNames),
    Scope: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/domains/{DomainName}/integrations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCalculatedAttributeDefinitionRequest extends S.Class<CreateCalculatedAttributeDefinitionRequest>(
  "CreateCalculatedAttributeDefinitionRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    CalculatedAttributeName: S.String.pipe(T.HttpLabel()),
    DisplayName: S.optional(S.String),
    Description: S.optional(S.String),
    AttributeDetails: AttributeDetails,
    Conditions: S.optional(Conditions),
    Filter: S.optional(Filter),
    Statistic: S.String,
    UseHistoricalData: S.optional(S.Boolean),
    Tags: S.optional(TagMap),
  },
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
) {}
export class PutIntegrationResponse extends S.Class<PutIntegrationResponse>(
  "PutIntegrationResponse",
)({
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
}) {}
export class CreateCalculatedAttributeDefinitionResponse extends S.Class<CreateCalculatedAttributeDefinitionResponse>(
  "CreateCalculatedAttributeDefinitionResponse",
)({
  CalculatedAttributeName: S.optional(S.String),
  DisplayName: S.optional(S.String),
  Description: S.optional(S.String),
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
}) {}
export class CreateSegmentDefinitionRequest extends S.Class<CreateSegmentDefinitionRequest>(
  "CreateSegmentDefinitionRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel()),
    SegmentDefinitionName: S.String.pipe(T.HttpLabel()),
    DisplayName: S.String,
    Description: S.optional(S.String),
    SegmentGroups: S.optional(SegmentGroup),
    SegmentSqlQuery: S.optional(S.String),
    Tags: S.optional(TagMap),
  },
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
) {}
export class CreateSegmentDefinitionResponse extends S.Class<CreateSegmentDefinitionResponse>(
  "CreateSegmentDefinitionResponse",
)({
  SegmentDefinitionName: S.String.pipe(T.JsonName("SegmentDefinitionName")),
  DisplayName: S.optional(S.String).pipe(T.JsonName("DisplayName")),
  Description: S.optional(S.String).pipe(T.JsonName("Description")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("CreatedAt"),
  ),
  SegmentDefinitionArn: S.optional(S.String).pipe(
    T.JsonName("SegmentDefinitionArn"),
  ),
  Tags: S.optional(TagMap).pipe(T.JsonName("Tags")),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}

//# Operations
/**
 * Starts a recommender that was previously stopped. Starting a recommender resumes its ability to generate recommendations.
 */
export const startRecommender = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startUploadJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopRecommender = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopUploadJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes one or more tags from the specified Amazon Connect Customer Profiles resource. In Connect
 * Customer Profiles, domains, profile object types, and integrations can be tagged.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Associates a new key value with a specific profile, such as a Contact Record
 * ContactId.
 *
 * A profile object can have a single unique key and any number of additional keys that can
 * be used to identify the profile that it belongs to.
 */
export const addProfileKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDomainLayout = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createEventStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createSegmentSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSegmentSnapshotRequest,
    output: CreateSegmentSnapshotResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes an existing calculated attribute definition. Note that deleting a default
 * calculated attribute is possible, however once deleted, you will be unable to undo that
 * action and will need to recreate it on your own using the
 * CreateCalculatedAttributeDefinition API if you want it back.
 */
export const deleteCalculatedAttributeDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDomainLayout = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Delete a DomainObjectType for the given Domain and ObjectType name.
 */
export const deleteDomainObjectType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDomainObjectTypeRequest,
    output: DeleteDomainObjectTypeResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Disables and deletes the specified event stream.
 */
export const deleteEventStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Disable and deletes the Event Trigger.
 *
 * You cannot delete an Event Trigger with an active Integration associated.
 */
export const deleteEventTrigger = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteProfileKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteProfileObject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteProfileObjectType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteProfileObjectTypeRequest,
    output: DeleteProfileObjectTypeResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes a recommender.
 */
export const deleteRecommender = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a segment definition from the domain.
 */
export const deleteSegmentDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSegmentDefinitionRequest,
    output: DeleteSegmentDefinitionResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes the specified workflow and all its corresponding resources. This is an async
 * process.
 */
export const deleteWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieve a calculated attribute for a customer profile.
 */
export const getCalculatedAttributeForProfile =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDomainLayout = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDomainObjectType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getEventTrigger = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getProfileHistoryRecord = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetProfileHistoryRecordRequest,
    output: GetProfileHistoryRecordResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns the object types for a specific domain.
 */
export const getProfileObjectType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetProfileObjectTypeRequest,
    output: GetProfileObjectTypeResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns the template information for a specific object type.
 *
 * A template is a predefined ProfileObjectType, such as “Salesforce-Account” or
 * “Salesforce-Contact.” When a user sends a ProfileObject, using the PutProfileObject API,
 * with an ObjectTypeName that matches one of the TemplateIds, it uses the mappings from the
 * template.
 */
export const getProfileObjectTypeTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSegmentDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSegmentDefinitionRequest,
    output: GetSegmentDefinitionResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Gets the result of a segment estimate query.
 */
export const getSegmentEstimate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSegmentSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSimilarProfiles = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSimilarProfilesRequest,
  output: GetSimilarProfilesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * This API retrieves the pre-signed URL and client token for uploading the file associated
 * with the upload job.
 */
export const getUploadJobPath = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listIntegrations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listRuleBasedMatches = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListRuleBasedMatchesRequest,
    output: ListRuleBasedMatchesResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Displays the tags associated with an Amazon Connect Customer Profiles resource. In Connect
 * Customer Profiles, domains, profile object types, and integrations can be tagged.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putProfileObject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates an existing calculated attribute definition. When updating the Conditions, note
 * that increasing the date range of a calculated attribute will not trigger inclusion of
 * historical data greater than the current date range.
 */
export const updateCalculatedAttributeDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDomainLayout = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateEventTrigger = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateRecommender = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a segment estimate query.
 */
export const createSegmentEstimate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSegmentEstimateRequest,
    output: CreateSegmentEstimateResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * The process of detecting profile object type mapping by using given objects.
 */
export const detectProfileObjectType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DetectProfileObjectTypeRequest,
    output: DetectProfileObjectTypeResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
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
export const getAutoMergingPreview = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAutoMergingPreviewRequest,
    output: GetAutoMergingPreviewResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Provides more information on a calculated attribute definition for Customer
 * Profiles.
 */
export const getCalculatedAttributeDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getEventStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getMatches = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSegmentMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSegmentMembershipRequest,
    output: GetSegmentMembershipResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * This API retrieves the details of a specific upload job.
 */
export const getUploadJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAccountIntegrations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAccountIntegrationsRequest,
    output: ListAccountIntegrationsResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists calculated attribute definitions for Customer Profiles
 */
export const listCalculatedAttributeDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listCalculatedAttributesForProfile =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listDomainLayouts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDomainLayoutsRequest,
  output: ListDomainLayoutsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * List all DomainObjectType(s) in a Customer Profiles domain.
 */
export const listDomainObjectTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDomainObjectTypesRequest,
    output: ListDomainObjectTypesResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns a list of all the domains for an AWS account that have been created.
 */
export const listDomains = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listEventTriggers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEventTriggersRequest,
  output: ListEventTriggersResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists all of the Identity Resolution Jobs in your domain. The response sorts the list by
 * `JobStartTime`.
 */
export const listIdentityResolutionJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListIdentityResolutionJobsRequest,
    output: ListIdentityResolutionJobsResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Fetch the possible attribute values given the attribute name.
 */
export const listObjectTypeAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListObjectTypeAttributesRequest,
    output: ListObjectTypeAttributesResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * The ListObjectTypeAttributeValues API provides access to the most recent distinct values for any specified attribute, making it valuable for real-time data validation and consistency checks within your object types. This API works across domain, supporting both custom and standard object types. The API accepts the object type name, attribute name, and domain name as input parameters and returns values up to the storage limit of approximately 350KB.
 */
export const listObjectTypeAttributeValues =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listProfileAttributeValues = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ProfileAttributeValuesRequest,
    output: ProfileAttributeValuesResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns a list of history records for a specific profile, for a specific domain.
 */
export const listProfileHistoryRecords = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListProfileHistoryRecordsRequest,
    output: ListProfileHistoryRecordsResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists all of the templates available within the service.
 */
export const listProfileObjectTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListProfileObjectTypesRequest,
    output: ListProfileObjectTypesResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists all of the template information for object types.
 */
export const listProfileObjectTypeTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns a list of available recommender recipes that can be used to create recommenders.
 */
export const listRecommenderRecipes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListRecommenderRecipesRequest,
    output: ListRecommenderRecipesResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns a list of recommenders in the specified domain.
 */
export const listRecommenders = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRecommendersRequest,
  output: ListRecommendersResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists all segment definitions under a domain.
 */
export const listSegmentDefinitions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSegmentDefinitionsRequest,
    output: ListSegmentDefinitionsResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * This API retrieves a list of upload jobs for the specified domain.
 */
export const listUploadJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListUploadJobsRequest,
  output: ListUploadJobsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Query to list all workflows.
 */
export const listWorkflows = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const searchProfiles = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates the properties of a profile. The ProfileId is required for updating a customer
 * profile.
 *
 * When calling the UpdateProfile API, specifying an empty string value means that any
 * existing value will be removed. Not specifying a string value means that any value already
 * there will be kept.
 */
export const updateProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Get a batch of profiles.
 */
export const batchGetProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createUploadJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getIdentityResolutionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetIdentityResolutionJobRequest,
    output: GetIdentityResolutionJobResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * The GetObjectTypeAttributeValues API delivers statistical insights about attributes within a specific object type, but is exclusively available for domains with data store enabled. This API performs daily calculations to provide statistical information about your attribute values, helping you understand patterns and trends in your data. The statistical calculations are performed once per day, providing a consistent snapshot of your attribute data characteristics.
 *
 * You'll receive null values in two scenarios:
 *
 * During the first period after enabling data vault (unless a calculation cycle occurs, which happens once daily).
 *
 * For attributes that don't contain numeric values.
 */
export const getObjectTypeAttributeStatistics =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRecommender = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getWorkflowSteps = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listEventStreams = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEventStreamsRequest,
  output: ListEventStreamsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns a list of objects associated with a profile of a given ProfileObjectType.
 */
export const listProfileObjects = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const mergeProfiles = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putDomainObjectType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putProfileObjectType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutProfileObjectTypeRequest,
    output: PutProfileObjectTypeResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Fetch the possible attribute values given the attribute name.
 */
export const batchGetCalculatedAttributeForProfile =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createEventTrigger = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createIntegrationWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateIntegrationWorkflowRequest,
    output: CreateIntegrationWorkflowResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a recommender
 */
export const createRecommender = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getProfileRecommendations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetProfileRecommendationsRequest,
    output: GetProfileRecommendationsResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
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
export const putIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createCalculatedAttributeDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createSegmentDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSegmentDefinitionRequest,
    output: CreateSegmentDefinitionResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Connect",
  serviceShapeName: "AmazonConnectService",
});
const auth = T.AwsAuthSigv4({ name: "connect" });
const ver = T.ServiceVersion("2017-08-08");
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
                        url: "https://connect-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://connect.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://connect-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://connect.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://connect.{Region}.{PartitionResult#dnsSuffix}",
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
export const QuickConnectsList = S.Array(S.String);
export const WorkspaceResourceArnList = S.Array(S.String);
export const DataSetIds = S.Array(S.String);
export const FileIdList = S.Array(S.String);
export const resourceArnListMaxLimit100 = S.Array(S.String);
export const PredefinedAttributePurposeNameList = S.Array(S.String);
export const PermissionsList = S.Array(S.String);
export const TagRestrictedResourceList = S.Array(S.String);
export const HierarchyRestrictedResourceList = S.Array(S.String);
export const SecurityProfileIds = S.Array(S.String);
export const Groupings = S.Array(S.String);
export const GroupingsV2 = S.Array(S.String);
export const AgentStatusTypes = S.Array(S.String);
export const ContactFlowTypes = S.Array(S.String);
export const ReferenceTypes = S.Array(S.String);
export const AttributeIds = S.Array(S.String);
export const RecordIds = S.Array(S.String);
export const PhoneNumberTypes = S.Array(S.String);
export const PhoneNumberCountryCodes = S.Array(S.String);
export const QueueTypes = S.Array(S.String);
export const QuickConnectTypes = S.Array(S.String);
export const RealTimeContactAnalysisSegmentTypes = S.Array(S.String);
export const AllowedMonitorCapabilities = S.Array(S.String);
export const ResourceTypeList = S.Array(S.String);
export const SupportedMessagingContentTypes = S.Array(S.String);
export const DisconnectOnCustomerExit = S.Array(S.String);
export const ContactTagKeys = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const IpCidrList = S.Array(S.String);
export class ActivateEvaluationFormRequest extends S.Class<ActivateEvaluationFormRequest>(
  "ActivateEvaluationFormRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    EvaluationFormId: S.String.pipe(T.HttpLabel("EvaluationFormId")),
    EvaluationFormVersion: S.Number,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/evaluation-forms/{InstanceId}/{EvaluationFormId}/activate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateAnalyticsDataSetRequest extends S.Class<AssociateAnalyticsDataSetRequest>(
  "AssociateAnalyticsDataSetRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataSetId: S.String,
    TargetAccountId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/analytics-data/instance/{InstanceId}/association",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateApprovedOriginRequest extends S.Class<AssociateApprovedOriginRequest>(
  "AssociateApprovedOriginRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Origin: S.String,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/instance/{InstanceId}/approved-origin" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateApprovedOriginResponse extends S.Class<AssociateApprovedOriginResponse>(
  "AssociateApprovedOriginResponse",
)({}) {}
export class AssociateContactWithUserRequest extends S.Class<AssociateContactWithUserRequest>(
  "AssociateContactWithUserRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactId: S.String.pipe(T.HttpLabel("ContactId")),
    UserId: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/contacts/{InstanceId}/{ContactId}/associate-user",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateContactWithUserResponse extends S.Class<AssociateContactWithUserResponse>(
  "AssociateContactWithUserResponse",
)({}) {}
export class AssociateDefaultVocabularyRequest extends S.Class<AssociateDefaultVocabularyRequest>(
  "AssociateDefaultVocabularyRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    LanguageCode: S.String.pipe(T.HttpLabel("LanguageCode")),
    VocabularyId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/default-vocabulary/{InstanceId}/{LanguageCode}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateDefaultVocabularyResponse extends S.Class<AssociateDefaultVocabularyResponse>(
  "AssociateDefaultVocabularyResponse",
)({}) {}
export class AssociateFlowRequest extends S.Class<AssociateFlowRequest>(
  "AssociateFlowRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ResourceId: S.String,
    FlowId: S.String,
    ResourceType: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/flow-associations/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateFlowResponse extends S.Class<AssociateFlowResponse>(
  "AssociateFlowResponse",
)({}) {}
export class AssociateLambdaFunctionRequest extends S.Class<AssociateLambdaFunctionRequest>(
  "AssociateLambdaFunctionRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    FunctionArn: S.String,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/instance/{InstanceId}/lambda-function" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateLambdaFunctionResponse extends S.Class<AssociateLambdaFunctionResponse>(
  "AssociateLambdaFunctionResponse",
)({}) {}
export class LexBot extends S.Class<LexBot>("LexBot")({
  Name: S.String,
  LexRegion: S.String,
}) {}
export class AssociateLexBotRequest extends S.Class<AssociateLexBotRequest>(
  "AssociateLexBotRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    LexBot: LexBot,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/instance/{InstanceId}/lex-bot" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateLexBotResponse extends S.Class<AssociateLexBotResponse>(
  "AssociateLexBotResponse",
)({}) {}
export class AssociatePhoneNumberContactFlowRequest extends S.Class<AssociatePhoneNumberContactFlowRequest>(
  "AssociatePhoneNumberContactFlowRequest",
)(
  {
    PhoneNumberId: S.String.pipe(T.HttpLabel("PhoneNumberId")),
    InstanceId: S.String,
    ContactFlowId: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/phone-number/{PhoneNumberId}/contact-flow",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociatePhoneNumberContactFlowResponse extends S.Class<AssociatePhoneNumberContactFlowResponse>(
  "AssociatePhoneNumberContactFlowResponse",
)({}) {}
export class AssociateQueueQuickConnectsRequest extends S.Class<AssociateQueueQuickConnectsRequest>(
  "AssociateQueueQuickConnectsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    QueueId: S.String.pipe(T.HttpLabel("QueueId")),
    QuickConnectIds: QuickConnectsList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/queues/{InstanceId}/{QueueId}/associate-quick-connects",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateQueueQuickConnectsResponse extends S.Class<AssociateQueueQuickConnectsResponse>(
  "AssociateQueueQuickConnectsResponse",
)({}) {}
export class AssociateSecurityKeyRequest extends S.Class<AssociateSecurityKeyRequest>(
  "AssociateSecurityKeyRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Key: S.String,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/instance/{InstanceId}/security-key" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateTrafficDistributionGroupUserRequest extends S.Class<AssociateTrafficDistributionGroupUserRequest>(
  "AssociateTrafficDistributionGroupUserRequest",
)(
  {
    TrafficDistributionGroupId: S.String.pipe(
      T.HttpLabel("TrafficDistributionGroupId"),
    ),
    UserId: S.String,
    InstanceId: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/traffic-distribution-group/{TrafficDistributionGroupId}/user",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateTrafficDistributionGroupUserResponse extends S.Class<AssociateTrafficDistributionGroupUserResponse>(
  "AssociateTrafficDistributionGroupUserResponse",
)({}) {}
export class AssociateWorkspaceRequest extends S.Class<AssociateWorkspaceRequest>(
  "AssociateWorkspaceRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    WorkspaceId: S.String.pipe(T.HttpLabel("WorkspaceId")),
    ResourceArns: WorkspaceResourceArnList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/workspaces/{InstanceId}/{WorkspaceId}/associate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchAssociateAnalyticsDataSetRequest extends S.Class<BatchAssociateAnalyticsDataSetRequest>(
  "BatchAssociateAnalyticsDataSetRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataSetIds: DataSetIds,
    TargetAccountId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/analytics-data/instance/{InstanceId}/associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDisassociateAnalyticsDataSetRequest extends S.Class<BatchDisassociateAnalyticsDataSetRequest>(
  "BatchDisassociateAnalyticsDataSetRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataSetIds: DataSetIds,
    TargetAccountId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/analytics-data/instance/{InstanceId}/associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetAttachedFileMetadataRequest extends S.Class<BatchGetAttachedFileMetadataRequest>(
  "BatchGetAttachedFileMetadataRequest",
)(
  {
    FileIds: FileIdList,
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    AssociatedResourceArn: S.String.pipe(T.HttpQuery("associatedResourceArn")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/attached-files/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetFlowAssociationRequest extends S.Class<BatchGetFlowAssociationRequest>(
  "BatchGetFlowAssociationRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ResourceIds: resourceArnListMaxLimit100,
    ResourceType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/flow-associations-batch/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PrimaryValue extends S.Class<PrimaryValue>("PrimaryValue")({
  AttributeName: S.String,
  Value: S.String,
}) {}
export const PrimaryValuesSet = S.Array(PrimaryValue);
export class DataTableLockVersion extends S.Class<DataTableLockVersion>(
  "DataTableLockVersion",
)({
  DataTable: S.optional(S.String),
  Attribute: S.optional(S.String),
  PrimaryValues: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export class DataTableValue extends S.Class<DataTableValue>("DataTableValue")({
  PrimaryValues: S.optional(PrimaryValuesSet),
  AttributeName: S.String,
  Value: S.String,
  LockVersion: S.optional(DataTableLockVersion),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export const DataTableValueList = S.Array(DataTableValue);
export class BatchUpdateDataTableValueRequest extends S.Class<BatchUpdateDataTableValueRequest>(
  "BatchUpdateDataTableValueRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataTableId: S.String.pipe(T.HttpLabel("DataTableId")),
    Values: DataTableValueList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/data-tables/{InstanceId}/{DataTableId}/values/update",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CompleteAttachedFileUploadRequest extends S.Class<CompleteAttachedFileUploadRequest>(
  "CompleteAttachedFileUploadRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    FileId: S.String.pipe(T.HttpLabel("FileId")),
    AssociatedResourceArn: S.String.pipe(T.HttpQuery("associatedResourceArn")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/attached-files/{InstanceId}/{FileId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CompleteAttachedFileUploadResponse extends S.Class<CompleteAttachedFileUploadResponse>(
  "CompleteAttachedFileUploadResponse",
)({}) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateAgentStatusRequest extends S.Class<CreateAgentStatusRequest>(
  "CreateAgentStatusRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Name: S.String,
    Description: S.optional(S.String),
    State: S.String,
    DisplayOrder: S.optional(S.Number),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/agent-status/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateContactFlowRequest extends S.Class<CreateContactFlowRequest>(
  "CreateContactFlowRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Name: S.String,
    Type: S.String,
    Description: S.optional(S.String),
    Content: S.String,
    Status: S.optional(S.String),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/contact-flows/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateContactFlowModuleAliasRequest extends S.Class<CreateContactFlowModuleAliasRequest>(
  "CreateContactFlowModuleAliasRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Description: S.optional(S.String),
    ContactFlowModuleId: S.String.pipe(T.HttpLabel("ContactFlowModuleId")),
    ContactFlowModuleVersion: S.Number,
    AliasName: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/contact-flow-modules/{InstanceId}/{ContactFlowModuleId}/alias",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateContactFlowModuleVersionRequest extends S.Class<CreateContactFlowModuleVersionRequest>(
  "CreateContactFlowModuleVersionRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Description: S.optional(S.String),
    ContactFlowModuleId: S.String.pipe(T.HttpLabel("ContactFlowModuleId")),
    FlowModuleContentSha256: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/contact-flow-modules/{InstanceId}/{ContactFlowModuleId}/version",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateContactFlowVersionRequest extends S.Class<CreateContactFlowVersionRequest>(
  "CreateContactFlowVersionRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Description: S.optional(S.String),
    ContactFlowId: S.String.pipe(T.HttpLabel("ContactFlowId")),
    FlowContentSha256: S.optional(S.String),
    ContactFlowVersion: S.optional(S.Number),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedRegion: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/contact-flows/{InstanceId}/{ContactFlowId}/version",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataTableRequest extends S.Class<CreateDataTableRequest>(
  "CreateDataTableRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Name: S.String,
    Description: S.optional(S.String),
    TimeZone: S.String,
    ValueLockLevel: S.String,
    Status: S.String,
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/data-tables/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEmailAddressRequest extends S.Class<CreateEmailAddressRequest>(
  "CreateEmailAddressRequest",
)(
  {
    Description: S.optional(S.String),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    EmailAddress: S.String,
    DisplayName: S.optional(S.String),
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/email-addresses/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateInstanceRequest extends S.Class<CreateInstanceRequest>(
  "CreateInstanceRequest",
)(
  {
    ClientToken: S.optional(S.String),
    IdentityManagementType: S.String,
    InstanceAlias: S.optional(S.String),
    DirectoryId: S.optional(S.String),
    InboundCallsEnabled: S.Boolean,
    OutboundCallsEnabled: S.Boolean,
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/instance" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateIntegrationAssociationRequest extends S.Class<CreateIntegrationAssociationRequest>(
  "CreateIntegrationAssociationRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    IntegrationType: S.String,
    IntegrationArn: S.String,
    SourceApplicationUrl: S.optional(S.String),
    SourceApplicationName: S.optional(S.String),
    SourceType: S.optional(S.String),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/instance/{InstanceId}/integration-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePersistentContactAssociationRequest extends S.Class<CreatePersistentContactAssociationRequest>(
  "CreatePersistentContactAssociationRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    InitialContactId: S.String.pipe(T.HttpLabel("InitialContactId")),
    RehydrationType: S.String,
    SourceContactId: S.String,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/contact/persistent-contact-association/{InstanceId}/{InitialContactId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePromptRequest extends S.Class<CreatePromptRequest>(
  "CreatePromptRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Name: S.String,
    Description: S.optional(S.String),
    S3Uri: S.String,
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/prompts/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTrafficDistributionGroupRequest extends S.Class<CreateTrafficDistributionGroupRequest>(
  "CreateTrafficDistributionGroupRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    InstanceId: S.String,
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/traffic-distribution-group" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateUseCaseRequest extends S.Class<CreateUseCaseRequest>(
  "CreateUseCaseRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    IntegrationAssociationId: S.String.pipe(
      T.HttpLabel("IntegrationAssociationId"),
    ),
    UseCaseType: S.String,
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/instance/{InstanceId}/integration-associations/{IntegrationAssociationId}/use-cases",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateUserHierarchyGroupRequest extends S.Class<CreateUserHierarchyGroupRequest>(
  "CreateUserHierarchyGroupRequest",
)(
  {
    Name: S.String,
    ParentGroupId: S.optional(S.String),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/user-hierarchy-groups/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateViewVersionRequest extends S.Class<CreateViewVersionRequest>(
  "CreateViewVersionRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ViewId: S.String.pipe(T.HttpLabel("ViewId")),
    VersionDescription: S.optional(S.String),
    ViewContentSha256: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/views/{InstanceId}/{ViewId}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateVocabularyRequest extends S.Class<CreateVocabularyRequest>(
  "CreateVocabularyRequest",
)(
  {
    ClientToken: S.optional(S.String),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    VocabularyName: S.String,
    LanguageCode: S.String,
    Content: S.String,
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/vocabulary/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateWorkspacePageRequest extends S.Class<CreateWorkspacePageRequest>(
  "CreateWorkspacePageRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    WorkspaceId: S.String.pipe(T.HttpLabel("WorkspaceId")),
    ResourceArn: S.String,
    Page: S.String,
    Slug: S.optional(S.String),
    InputData: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/workspaces/{InstanceId}/{WorkspaceId}/pages",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateWorkspacePageResponse extends S.Class<CreateWorkspacePageResponse>(
  "CreateWorkspacePageResponse",
)({}) {}
export class DeactivateEvaluationFormRequest extends S.Class<DeactivateEvaluationFormRequest>(
  "DeactivateEvaluationFormRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    EvaluationFormId: S.String.pipe(T.HttpLabel("EvaluationFormId")),
    EvaluationFormVersion: S.Number,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/evaluation-forms/{InstanceId}/{EvaluationFormId}/deactivate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAttachedFileRequest extends S.Class<DeleteAttachedFileRequest>(
  "DeleteAttachedFileRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    FileId: S.String.pipe(T.HttpLabel("FileId")),
    AssociatedResourceArn: S.String.pipe(T.HttpQuery("associatedResourceArn")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/attached-files/{InstanceId}/{FileId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAttachedFileResponse extends S.Class<DeleteAttachedFileResponse>(
  "DeleteAttachedFileResponse",
)({}) {}
export class DeleteContactEvaluationRequest extends S.Class<DeleteContactEvaluationRequest>(
  "DeleteContactEvaluationRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    EvaluationId: S.String.pipe(T.HttpLabel("EvaluationId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/contact-evaluations/{InstanceId}/{EvaluationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteContactEvaluationResponse extends S.Class<DeleteContactEvaluationResponse>(
  "DeleteContactEvaluationResponse",
)({}) {}
export class DeleteContactFlowRequest extends S.Class<DeleteContactFlowRequest>(
  "DeleteContactFlowRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactFlowId: S.String.pipe(T.HttpLabel("ContactFlowId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/contact-flows/{InstanceId}/{ContactFlowId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteContactFlowResponse extends S.Class<DeleteContactFlowResponse>(
  "DeleteContactFlowResponse",
)({}) {}
export class DeleteContactFlowModuleRequest extends S.Class<DeleteContactFlowModuleRequest>(
  "DeleteContactFlowModuleRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactFlowModuleId: S.String.pipe(T.HttpLabel("ContactFlowModuleId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/contact-flow-modules/{InstanceId}/{ContactFlowModuleId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteContactFlowModuleResponse extends S.Class<DeleteContactFlowModuleResponse>(
  "DeleteContactFlowModuleResponse",
)({}) {}
export class DeleteContactFlowModuleAliasRequest extends S.Class<DeleteContactFlowModuleAliasRequest>(
  "DeleteContactFlowModuleAliasRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactFlowModuleId: S.String.pipe(T.HttpLabel("ContactFlowModuleId")),
    AliasId: S.String.pipe(T.HttpLabel("AliasId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/contact-flow-modules/{InstanceId}/{ContactFlowModuleId}/alias/{AliasId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteContactFlowModuleAliasResponse extends S.Class<DeleteContactFlowModuleAliasResponse>(
  "DeleteContactFlowModuleAliasResponse",
)({}) {}
export class DeleteContactFlowModuleVersionRequest extends S.Class<DeleteContactFlowModuleVersionRequest>(
  "DeleteContactFlowModuleVersionRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactFlowModuleId: S.String.pipe(T.HttpLabel("ContactFlowModuleId")),
    ContactFlowModuleVersion: S.Number.pipe(
      T.HttpLabel("ContactFlowModuleVersion"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/contact-flow-modules/{InstanceId}/{ContactFlowModuleId}/version/{ContactFlowModuleVersion}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteContactFlowModuleVersionResponse extends S.Class<DeleteContactFlowModuleVersionResponse>(
  "DeleteContactFlowModuleVersionResponse",
)({}) {}
export class DeleteContactFlowVersionRequest extends S.Class<DeleteContactFlowVersionRequest>(
  "DeleteContactFlowVersionRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactFlowId: S.String.pipe(T.HttpLabel("ContactFlowId")),
    ContactFlowVersion: S.Number.pipe(T.HttpLabel("ContactFlowVersion")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/contact-flows/{InstanceId}/{ContactFlowId}/version/{ContactFlowVersion}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteContactFlowVersionResponse extends S.Class<DeleteContactFlowVersionResponse>(
  "DeleteContactFlowVersionResponse",
)({}) {}
export class DeleteDataTableRequest extends S.Class<DeleteDataTableRequest>(
  "DeleteDataTableRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataTableId: S.String.pipe(T.HttpLabel("DataTableId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/data-tables/{InstanceId}/{DataTableId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataTableResponse extends S.Class<DeleteDataTableResponse>(
  "DeleteDataTableResponse",
)({}) {}
export class DeleteDataTableAttributeRequest extends S.Class<DeleteDataTableAttributeRequest>(
  "DeleteDataTableAttributeRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataTableId: S.String.pipe(T.HttpLabel("DataTableId")),
    AttributeName: S.String.pipe(T.HttpLabel("AttributeName")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/data-tables/{InstanceId}/{DataTableId}/attributes/{AttributeName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEmailAddressRequest extends S.Class<DeleteEmailAddressRequest>(
  "DeleteEmailAddressRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    EmailAddressId: S.String.pipe(T.HttpLabel("EmailAddressId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/email-addresses/{InstanceId}/{EmailAddressId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEmailAddressResponse extends S.Class<DeleteEmailAddressResponse>(
  "DeleteEmailAddressResponse",
)({}) {}
export class DeleteEvaluationFormRequest extends S.Class<DeleteEvaluationFormRequest>(
  "DeleteEvaluationFormRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    EvaluationFormId: S.String.pipe(T.HttpLabel("EvaluationFormId")),
    EvaluationFormVersion: S.optional(S.Number).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/evaluation-forms/{InstanceId}/{EvaluationFormId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEvaluationFormResponse extends S.Class<DeleteEvaluationFormResponse>(
  "DeleteEvaluationFormResponse",
)({}) {}
export class DeleteHoursOfOperationRequest extends S.Class<DeleteHoursOfOperationRequest>(
  "DeleteHoursOfOperationRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    HoursOfOperationId: S.String.pipe(T.HttpLabel("HoursOfOperationId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/hours-of-operations/{InstanceId}/{HoursOfOperationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteHoursOfOperationResponse extends S.Class<DeleteHoursOfOperationResponse>(
  "DeleteHoursOfOperationResponse",
)({}) {}
export class DeleteHoursOfOperationOverrideRequest extends S.Class<DeleteHoursOfOperationOverrideRequest>(
  "DeleteHoursOfOperationOverrideRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    HoursOfOperationId: S.String.pipe(T.HttpLabel("HoursOfOperationId")),
    HoursOfOperationOverrideId: S.String.pipe(
      T.HttpLabel("HoursOfOperationOverrideId"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/hours-of-operations/{InstanceId}/{HoursOfOperationId}/overrides/{HoursOfOperationOverrideId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteHoursOfOperationOverrideResponse extends S.Class<DeleteHoursOfOperationOverrideResponse>(
  "DeleteHoursOfOperationOverrideResponse",
)({}) {}
export class DeleteInstanceRequest extends S.Class<DeleteInstanceRequest>(
  "DeleteInstanceRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ClientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/instance/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInstanceResponse extends S.Class<DeleteInstanceResponse>(
  "DeleteInstanceResponse",
)({}) {}
export class DeleteIntegrationAssociationRequest extends S.Class<DeleteIntegrationAssociationRequest>(
  "DeleteIntegrationAssociationRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    IntegrationAssociationId: S.String.pipe(
      T.HttpLabel("IntegrationAssociationId"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/instance/{InstanceId}/integration-associations/{IntegrationAssociationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIntegrationAssociationResponse extends S.Class<DeleteIntegrationAssociationResponse>(
  "DeleteIntegrationAssociationResponse",
)({}) {}
export class DeletePredefinedAttributeRequest extends S.Class<DeletePredefinedAttributeRequest>(
  "DeletePredefinedAttributeRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Name: S.String.pipe(T.HttpLabel("Name")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/predefined-attributes/{InstanceId}/{Name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePredefinedAttributeResponse extends S.Class<DeletePredefinedAttributeResponse>(
  "DeletePredefinedAttributeResponse",
)({}) {}
export class DeletePromptRequest extends S.Class<DeletePromptRequest>(
  "DeletePromptRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    PromptId: S.String.pipe(T.HttpLabel("PromptId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/prompts/{InstanceId}/{PromptId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePromptResponse extends S.Class<DeletePromptResponse>(
  "DeletePromptResponse",
)({}) {}
export class DeletePushNotificationRegistrationRequest extends S.Class<DeletePushNotificationRegistrationRequest>(
  "DeletePushNotificationRegistrationRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    RegistrationId: S.String.pipe(T.HttpLabel("RegistrationId")),
    ContactId: S.String.pipe(T.HttpQuery("contactId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/push-notification/{InstanceId}/registrations/{RegistrationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePushNotificationRegistrationResponse extends S.Class<DeletePushNotificationRegistrationResponse>(
  "DeletePushNotificationRegistrationResponse",
)({}) {}
export class DeleteQueueRequest extends S.Class<DeleteQueueRequest>(
  "DeleteQueueRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    QueueId: S.String.pipe(T.HttpLabel("QueueId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/queues/{InstanceId}/{QueueId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteQueueResponse extends S.Class<DeleteQueueResponse>(
  "DeleteQueueResponse",
)({}) {}
export class DeleteQuickConnectRequest extends S.Class<DeleteQuickConnectRequest>(
  "DeleteQuickConnectRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    QuickConnectId: S.String.pipe(T.HttpLabel("QuickConnectId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/quick-connects/{InstanceId}/{QuickConnectId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteQuickConnectResponse extends S.Class<DeleteQuickConnectResponse>(
  "DeleteQuickConnectResponse",
)({}) {}
export class DeleteRoutingProfileRequest extends S.Class<DeleteRoutingProfileRequest>(
  "DeleteRoutingProfileRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    RoutingProfileId: S.String.pipe(T.HttpLabel("RoutingProfileId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/routing-profiles/{InstanceId}/{RoutingProfileId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRoutingProfileResponse extends S.Class<DeleteRoutingProfileResponse>(
  "DeleteRoutingProfileResponse",
)({}) {}
export class DeleteRuleRequest extends S.Class<DeleteRuleRequest>(
  "DeleteRuleRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    RuleId: S.String.pipe(T.HttpLabel("RuleId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/rules/{InstanceId}/{RuleId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRuleResponse extends S.Class<DeleteRuleResponse>(
  "DeleteRuleResponse",
)({}) {}
export class DeleteSecurityProfileRequest extends S.Class<DeleteSecurityProfileRequest>(
  "DeleteSecurityProfileRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    SecurityProfileId: S.String.pipe(T.HttpLabel("SecurityProfileId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/security-profiles/{InstanceId}/{SecurityProfileId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSecurityProfileResponse extends S.Class<DeleteSecurityProfileResponse>(
  "DeleteSecurityProfileResponse",
)({}) {}
export class DeleteTaskTemplateRequest extends S.Class<DeleteTaskTemplateRequest>(
  "DeleteTaskTemplateRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    TaskTemplateId: S.String.pipe(T.HttpLabel("TaskTemplateId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/instance/{InstanceId}/task/template/{TaskTemplateId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTaskTemplateResponse extends S.Class<DeleteTaskTemplateResponse>(
  "DeleteTaskTemplateResponse",
)({}) {}
export class DeleteTrafficDistributionGroupRequest extends S.Class<DeleteTrafficDistributionGroupRequest>(
  "DeleteTrafficDistributionGroupRequest",
)(
  {
    TrafficDistributionGroupId: S.String.pipe(
      T.HttpLabel("TrafficDistributionGroupId"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/traffic-distribution-group/{TrafficDistributionGroupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTrafficDistributionGroupResponse extends S.Class<DeleteTrafficDistributionGroupResponse>(
  "DeleteTrafficDistributionGroupResponse",
)({}) {}
export class DeleteUseCaseRequest extends S.Class<DeleteUseCaseRequest>(
  "DeleteUseCaseRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    IntegrationAssociationId: S.String.pipe(
      T.HttpLabel("IntegrationAssociationId"),
    ),
    UseCaseId: S.String.pipe(T.HttpLabel("UseCaseId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/instance/{InstanceId}/integration-associations/{IntegrationAssociationId}/use-cases/{UseCaseId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteUseCaseResponse extends S.Class<DeleteUseCaseResponse>(
  "DeleteUseCaseResponse",
)({}) {}
export class DeleteUserRequest extends S.Class<DeleteUserRequest>(
  "DeleteUserRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/users/{InstanceId}/{UserId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteUserResponse extends S.Class<DeleteUserResponse>(
  "DeleteUserResponse",
)({}) {}
export class DeleteUserHierarchyGroupRequest extends S.Class<DeleteUserHierarchyGroupRequest>(
  "DeleteUserHierarchyGroupRequest",
)(
  {
    HierarchyGroupId: S.String.pipe(T.HttpLabel("HierarchyGroupId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/user-hierarchy-groups/{InstanceId}/{HierarchyGroupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteUserHierarchyGroupResponse extends S.Class<DeleteUserHierarchyGroupResponse>(
  "DeleteUserHierarchyGroupResponse",
)({}) {}
export class DeleteViewRequest extends S.Class<DeleteViewRequest>(
  "DeleteViewRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ViewId: S.String.pipe(T.HttpLabel("ViewId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/views/{InstanceId}/{ViewId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteViewResponse extends S.Class<DeleteViewResponse>(
  "DeleteViewResponse",
)({}) {}
export class DeleteViewVersionRequest extends S.Class<DeleteViewVersionRequest>(
  "DeleteViewVersionRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ViewId: S.String.pipe(T.HttpLabel("ViewId")),
    ViewVersion: S.Number.pipe(T.HttpLabel("ViewVersion")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/views/{InstanceId}/{ViewId}/versions/{ViewVersion}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteViewVersionResponse extends S.Class<DeleteViewVersionResponse>(
  "DeleteViewVersionResponse",
)({}) {}
export class DeleteVocabularyRequest extends S.Class<DeleteVocabularyRequest>(
  "DeleteVocabularyRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    VocabularyId: S.String.pipe(T.HttpLabel("VocabularyId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/vocabulary-remove/{InstanceId}/{VocabularyId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkspaceRequest extends S.Class<DeleteWorkspaceRequest>(
  "DeleteWorkspaceRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    WorkspaceId: S.String.pipe(T.HttpLabel("WorkspaceId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/workspaces/{InstanceId}/{WorkspaceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkspaceResponse extends S.Class<DeleteWorkspaceResponse>(
  "DeleteWorkspaceResponse",
)({}) {}
export class DeleteWorkspaceMediaRequest extends S.Class<DeleteWorkspaceMediaRequest>(
  "DeleteWorkspaceMediaRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    WorkspaceId: S.String.pipe(T.HttpLabel("WorkspaceId")),
    MediaType: S.String.pipe(T.HttpQuery("mediaType")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/workspaces/{InstanceId}/{WorkspaceId}/media",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkspaceMediaResponse extends S.Class<DeleteWorkspaceMediaResponse>(
  "DeleteWorkspaceMediaResponse",
)({}) {}
export class DeleteWorkspacePageRequest extends S.Class<DeleteWorkspacePageRequest>(
  "DeleteWorkspacePageRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    WorkspaceId: S.String.pipe(T.HttpLabel("WorkspaceId")),
    Page: S.String.pipe(T.HttpLabel("Page")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/workspaces/{InstanceId}/{WorkspaceId}/pages/{Page}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkspacePageResponse extends S.Class<DeleteWorkspacePageResponse>(
  "DeleteWorkspacePageResponse",
)({}) {}
export class DescribeAgentStatusRequest extends S.Class<DescribeAgentStatusRequest>(
  "DescribeAgentStatusRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    AgentStatusId: S.String.pipe(T.HttpLabel("AgentStatusId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/agent-status/{InstanceId}/{AgentStatusId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAuthenticationProfileRequest extends S.Class<DescribeAuthenticationProfileRequest>(
  "DescribeAuthenticationProfileRequest",
)(
  {
    AuthenticationProfileId: S.String.pipe(
      T.HttpLabel("AuthenticationProfileId"),
    ),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/authentication-profiles/{InstanceId}/{AuthenticationProfileId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeContactRequest extends S.Class<DescribeContactRequest>(
  "DescribeContactRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactId: S.String.pipe(T.HttpLabel("ContactId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/contacts/{InstanceId}/{ContactId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeContactEvaluationRequest extends S.Class<DescribeContactEvaluationRequest>(
  "DescribeContactEvaluationRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    EvaluationId: S.String.pipe(T.HttpLabel("EvaluationId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/contact-evaluations/{InstanceId}/{EvaluationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeContactFlowRequest extends S.Class<DescribeContactFlowRequest>(
  "DescribeContactFlowRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactFlowId: S.String.pipe(T.HttpLabel("ContactFlowId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/contact-flows/{InstanceId}/{ContactFlowId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeContactFlowModuleRequest extends S.Class<DescribeContactFlowModuleRequest>(
  "DescribeContactFlowModuleRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactFlowModuleId: S.String.pipe(T.HttpLabel("ContactFlowModuleId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/contact-flow-modules/{InstanceId}/{ContactFlowModuleId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeContactFlowModuleAliasRequest extends S.Class<DescribeContactFlowModuleAliasRequest>(
  "DescribeContactFlowModuleAliasRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactFlowModuleId: S.String.pipe(T.HttpLabel("ContactFlowModuleId")),
    AliasId: S.String.pipe(T.HttpLabel("AliasId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/contact-flow-modules/{InstanceId}/{ContactFlowModuleId}/alias/{AliasId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDataTableRequest extends S.Class<DescribeDataTableRequest>(
  "DescribeDataTableRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataTableId: S.String.pipe(T.HttpLabel("DataTableId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/data-tables/{InstanceId}/{DataTableId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDataTableAttributeRequest extends S.Class<DescribeDataTableAttributeRequest>(
  "DescribeDataTableAttributeRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataTableId: S.String.pipe(T.HttpLabel("DataTableId")),
    AttributeName: S.String.pipe(T.HttpLabel("AttributeName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/data-tables/{InstanceId}/{DataTableId}/attributes/{AttributeName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeEmailAddressRequest extends S.Class<DescribeEmailAddressRequest>(
  "DescribeEmailAddressRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    EmailAddressId: S.String.pipe(T.HttpLabel("EmailAddressId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/email-addresses/{InstanceId}/{EmailAddressId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeEvaluationFormRequest extends S.Class<DescribeEvaluationFormRequest>(
  "DescribeEvaluationFormRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    EvaluationFormId: S.String.pipe(T.HttpLabel("EvaluationFormId")),
    EvaluationFormVersion: S.optional(S.Number).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/evaluation-forms/{InstanceId}/{EvaluationFormId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeHoursOfOperationRequest extends S.Class<DescribeHoursOfOperationRequest>(
  "DescribeHoursOfOperationRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    HoursOfOperationId: S.String.pipe(T.HttpLabel("HoursOfOperationId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/hours-of-operations/{InstanceId}/{HoursOfOperationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeHoursOfOperationOverrideRequest extends S.Class<DescribeHoursOfOperationOverrideRequest>(
  "DescribeHoursOfOperationOverrideRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    HoursOfOperationId: S.String.pipe(T.HttpLabel("HoursOfOperationId")),
    HoursOfOperationOverrideId: S.String.pipe(
      T.HttpLabel("HoursOfOperationOverrideId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/hours-of-operations/{InstanceId}/{HoursOfOperationId}/overrides/{HoursOfOperationOverrideId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeInstanceRequest extends S.Class<DescribeInstanceRequest>(
  "DescribeInstanceRequest",
)(
  { InstanceId: S.String.pipe(T.HttpLabel("InstanceId")) },
  T.all(
    T.Http({ method: "GET", uri: "/instance/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeInstanceAttributeRequest extends S.Class<DescribeInstanceAttributeRequest>(
  "DescribeInstanceAttributeRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    AttributeType: S.String.pipe(T.HttpLabel("AttributeType")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/instance/{InstanceId}/attribute/{AttributeType}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeInstanceStorageConfigRequest extends S.Class<DescribeInstanceStorageConfigRequest>(
  "DescribeInstanceStorageConfigRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    AssociationId: S.String.pipe(T.HttpLabel("AssociationId")),
    ResourceType: S.String.pipe(T.HttpQuery("resourceType")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/instance/{InstanceId}/storage-config/{AssociationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribePhoneNumberRequest extends S.Class<DescribePhoneNumberRequest>(
  "DescribePhoneNumberRequest",
)(
  { PhoneNumberId: S.String.pipe(T.HttpLabel("PhoneNumberId")) },
  T.all(
    T.Http({ method: "GET", uri: "/phone-number/{PhoneNumberId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribePredefinedAttributeRequest extends S.Class<DescribePredefinedAttributeRequest>(
  "DescribePredefinedAttributeRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Name: S.String.pipe(T.HttpLabel("Name")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/predefined-attributes/{InstanceId}/{Name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribePromptRequest extends S.Class<DescribePromptRequest>(
  "DescribePromptRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    PromptId: S.String.pipe(T.HttpLabel("PromptId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prompts/{InstanceId}/{PromptId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeQueueRequest extends S.Class<DescribeQueueRequest>(
  "DescribeQueueRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    QueueId: S.String.pipe(T.HttpLabel("QueueId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/queues/{InstanceId}/{QueueId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeQuickConnectRequest extends S.Class<DescribeQuickConnectRequest>(
  "DescribeQuickConnectRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    QuickConnectId: S.String.pipe(T.HttpLabel("QuickConnectId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/quick-connects/{InstanceId}/{QuickConnectId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRoutingProfileRequest extends S.Class<DescribeRoutingProfileRequest>(
  "DescribeRoutingProfileRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    RoutingProfileId: S.String.pipe(T.HttpLabel("RoutingProfileId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/routing-profiles/{InstanceId}/{RoutingProfileId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRuleRequest extends S.Class<DescribeRuleRequest>(
  "DescribeRuleRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    RuleId: S.String.pipe(T.HttpLabel("RuleId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/rules/{InstanceId}/{RuleId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSecurityProfileRequest extends S.Class<DescribeSecurityProfileRequest>(
  "DescribeSecurityProfileRequest",
)(
  {
    SecurityProfileId: S.String.pipe(T.HttpLabel("SecurityProfileId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/security-profiles/{InstanceId}/{SecurityProfileId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeTrafficDistributionGroupRequest extends S.Class<DescribeTrafficDistributionGroupRequest>(
  "DescribeTrafficDistributionGroupRequest",
)(
  {
    TrafficDistributionGroupId: S.String.pipe(
      T.HttpLabel("TrafficDistributionGroupId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/traffic-distribution-group/{TrafficDistributionGroupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeUserRequest extends S.Class<DescribeUserRequest>(
  "DescribeUserRequest",
)(
  {
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/users/{InstanceId}/{UserId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeUserHierarchyGroupRequest extends S.Class<DescribeUserHierarchyGroupRequest>(
  "DescribeUserHierarchyGroupRequest",
)(
  {
    HierarchyGroupId: S.String.pipe(T.HttpLabel("HierarchyGroupId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/user-hierarchy-groups/{InstanceId}/{HierarchyGroupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeUserHierarchyStructureRequest extends S.Class<DescribeUserHierarchyStructureRequest>(
  "DescribeUserHierarchyStructureRequest",
)(
  { InstanceId: S.String.pipe(T.HttpLabel("InstanceId")) },
  T.all(
    T.Http({ method: "GET", uri: "/user-hierarchy-structure/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeViewRequest extends S.Class<DescribeViewRequest>(
  "DescribeViewRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ViewId: S.String.pipe(T.HttpLabel("ViewId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/views/{InstanceId}/{ViewId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeVocabularyRequest extends S.Class<DescribeVocabularyRequest>(
  "DescribeVocabularyRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    VocabularyId: S.String.pipe(T.HttpLabel("VocabularyId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/vocabulary/{InstanceId}/{VocabularyId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeWorkspaceRequest extends S.Class<DescribeWorkspaceRequest>(
  "DescribeWorkspaceRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    WorkspaceId: S.String.pipe(T.HttpLabel("WorkspaceId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/workspaces/{InstanceId}/{WorkspaceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateAnalyticsDataSetRequest extends S.Class<DisassociateAnalyticsDataSetRequest>(
  "DisassociateAnalyticsDataSetRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataSetId: S.String,
    TargetAccountId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/analytics-data/instance/{InstanceId}/association",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateAnalyticsDataSetResponse extends S.Class<DisassociateAnalyticsDataSetResponse>(
  "DisassociateAnalyticsDataSetResponse",
)({}) {}
export class DisassociateApprovedOriginRequest extends S.Class<DisassociateApprovedOriginRequest>(
  "DisassociateApprovedOriginRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Origin: S.String.pipe(T.HttpQuery("origin")),
    ClientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/instance/{InstanceId}/approved-origin" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateApprovedOriginResponse extends S.Class<DisassociateApprovedOriginResponse>(
  "DisassociateApprovedOriginResponse",
)({}) {}
export class LexV2Bot extends S.Class<LexV2Bot>("LexV2Bot")({
  AliasArn: S.optional(S.String),
}) {}
export class DisassociateBotRequest extends S.Class<DisassociateBotRequest>(
  "DisassociateBotRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    LexBot: S.optional(LexBot),
    LexV2Bot: S.optional(LexV2Bot),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/instance/{InstanceId}/bot" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateBotResponse extends S.Class<DisassociateBotResponse>(
  "DisassociateBotResponse",
)({}) {}
export class AliasConfiguration extends S.Class<AliasConfiguration>(
  "AliasConfiguration",
)({ EmailAddressId: S.String }) {}
export class DisassociateEmailAddressAliasRequest extends S.Class<DisassociateEmailAddressAliasRequest>(
  "DisassociateEmailAddressAliasRequest",
)(
  {
    EmailAddressId: S.String.pipe(T.HttpLabel("EmailAddressId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    AliasConfiguration: AliasConfiguration,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/email-addresses/{InstanceId}/{EmailAddressId}/disassociate-alias",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateEmailAddressAliasResponse extends S.Class<DisassociateEmailAddressAliasResponse>(
  "DisassociateEmailAddressAliasResponse",
)({}) {}
export class DisassociateFlowRequest extends S.Class<DisassociateFlowRequest>(
  "DisassociateFlowRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    ResourceType: S.String.pipe(T.HttpLabel("ResourceType")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/flow-associations/{InstanceId}/{ResourceId}/{ResourceType}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateFlowResponse extends S.Class<DisassociateFlowResponse>(
  "DisassociateFlowResponse",
)({}) {}
export class DisassociateInstanceStorageConfigRequest extends S.Class<DisassociateInstanceStorageConfigRequest>(
  "DisassociateInstanceStorageConfigRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    AssociationId: S.String.pipe(T.HttpLabel("AssociationId")),
    ResourceType: S.String.pipe(T.HttpQuery("resourceType")),
    ClientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/instance/{InstanceId}/storage-config/{AssociationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateInstanceStorageConfigResponse extends S.Class<DisassociateInstanceStorageConfigResponse>(
  "DisassociateInstanceStorageConfigResponse",
)({}) {}
export class DisassociateLambdaFunctionRequest extends S.Class<DisassociateLambdaFunctionRequest>(
  "DisassociateLambdaFunctionRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    FunctionArn: S.String.pipe(T.HttpQuery("functionArn")),
    ClientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/instance/{InstanceId}/lambda-function" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateLambdaFunctionResponse extends S.Class<DisassociateLambdaFunctionResponse>(
  "DisassociateLambdaFunctionResponse",
)({}) {}
export class DisassociateLexBotRequest extends S.Class<DisassociateLexBotRequest>(
  "DisassociateLexBotRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    BotName: S.String.pipe(T.HttpQuery("botName")),
    LexRegion: S.String.pipe(T.HttpQuery("lexRegion")),
    ClientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/instance/{InstanceId}/lex-bot" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateLexBotResponse extends S.Class<DisassociateLexBotResponse>(
  "DisassociateLexBotResponse",
)({}) {}
export class DisassociatePhoneNumberContactFlowRequest extends S.Class<DisassociatePhoneNumberContactFlowRequest>(
  "DisassociatePhoneNumberContactFlowRequest",
)(
  {
    PhoneNumberId: S.String.pipe(T.HttpLabel("PhoneNumberId")),
    InstanceId: S.String.pipe(T.HttpQuery("instanceId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/phone-number/{PhoneNumberId}/contact-flow",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociatePhoneNumberContactFlowResponse extends S.Class<DisassociatePhoneNumberContactFlowResponse>(
  "DisassociatePhoneNumberContactFlowResponse",
)({}) {}
export class DisassociateQueueQuickConnectsRequest extends S.Class<DisassociateQueueQuickConnectsRequest>(
  "DisassociateQueueQuickConnectsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    QueueId: S.String.pipe(T.HttpLabel("QueueId")),
    QuickConnectIds: QuickConnectsList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/queues/{InstanceId}/{QueueId}/disassociate-quick-connects",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateQueueQuickConnectsResponse extends S.Class<DisassociateQueueQuickConnectsResponse>(
  "DisassociateQueueQuickConnectsResponse",
)({}) {}
export class DisassociateSecurityKeyRequest extends S.Class<DisassociateSecurityKeyRequest>(
  "DisassociateSecurityKeyRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    AssociationId: S.String.pipe(T.HttpLabel("AssociationId")),
    ClientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/instance/{InstanceId}/security-key/{AssociationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateSecurityKeyResponse extends S.Class<DisassociateSecurityKeyResponse>(
  "DisassociateSecurityKeyResponse",
)({}) {}
export class SecurityProfileItem extends S.Class<SecurityProfileItem>(
  "SecurityProfileItem",
)({ Id: S.optional(S.String) }) {}
export const SecurityProfiles = S.Array(SecurityProfileItem);
export class DisassociateSecurityProfilesRequest extends S.Class<DisassociateSecurityProfilesRequest>(
  "DisassociateSecurityProfilesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    SecurityProfiles: SecurityProfiles,
    EntityType: S.String,
    EntityArn: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/disassociate-security-profiles/{InstanceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateSecurityProfilesResponse extends S.Class<DisassociateSecurityProfilesResponse>(
  "DisassociateSecurityProfilesResponse",
)({}) {}
export class DisassociateTrafficDistributionGroupUserRequest extends S.Class<DisassociateTrafficDistributionGroupUserRequest>(
  "DisassociateTrafficDistributionGroupUserRequest",
)(
  {
    TrafficDistributionGroupId: S.String.pipe(
      T.HttpLabel("TrafficDistributionGroupId"),
    ),
    UserId: S.String.pipe(T.HttpQuery("UserId")),
    InstanceId: S.String.pipe(T.HttpQuery("InstanceId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/traffic-distribution-group/{TrafficDistributionGroupId}/user",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateTrafficDistributionGroupUserResponse extends S.Class<DisassociateTrafficDistributionGroupUserResponse>(
  "DisassociateTrafficDistributionGroupUserResponse",
)({}) {}
export class DisassociateWorkspaceRequest extends S.Class<DisassociateWorkspaceRequest>(
  "DisassociateWorkspaceRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    WorkspaceId: S.String.pipe(T.HttpLabel("WorkspaceId")),
    ResourceArns: WorkspaceResourceArnList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/workspaces/{InstanceId}/{WorkspaceId}/disassociate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DismissUserContactRequest extends S.Class<DismissUserContactRequest>(
  "DismissUserContactRequest",
)(
  {
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactId: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/users/{InstanceId}/{UserId}/contact" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DismissUserContactResponse extends S.Class<DismissUserContactResponse>(
  "DismissUserContactResponse",
)({}) {}
export class GetAttachedFileRequest extends S.Class<GetAttachedFileRequest>(
  "GetAttachedFileRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    FileId: S.String.pipe(T.HttpLabel("FileId")),
    UrlExpiryInSeconds: S.optional(S.Number).pipe(
      T.HttpQuery("urlExpiryInSeconds"),
    ),
    AssociatedResourceArn: S.String.pipe(T.HttpQuery("associatedResourceArn")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/attached-files/{InstanceId}/{FileId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetContactAttributesRequest extends S.Class<GetContactAttributesRequest>(
  "GetContactAttributesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    InitialContactId: S.String.pipe(T.HttpLabel("InitialContactId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/contact/attributes/{InstanceId}/{InitialContactId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEffectiveHoursOfOperationsRequest extends S.Class<GetEffectiveHoursOfOperationsRequest>(
  "GetEffectiveHoursOfOperationsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    HoursOfOperationId: S.String.pipe(T.HttpLabel("HoursOfOperationId")),
    FromDate: S.String.pipe(T.HttpQuery("fromDate")),
    ToDate: S.String.pipe(T.HttpQuery("toDate")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/effective-hours-of-operations/{InstanceId}/{HoursOfOperationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFederationTokenRequest extends S.Class<GetFederationTokenRequest>(
  "GetFederationTokenRequest",
)(
  { InstanceId: S.String.pipe(T.HttpLabel("InstanceId")) },
  T.all(
    T.Http({ method: "GET", uri: "/user/federate/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFlowAssociationRequest extends S.Class<GetFlowAssociationRequest>(
  "GetFlowAssociationRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    ResourceType: S.String.pipe(T.HttpLabel("ResourceType")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/flow-associations/{InstanceId}/{ResourceId}/{ResourceType}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPromptFileRequest extends S.Class<GetPromptFileRequest>(
  "GetPromptFileRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    PromptId: S.String.pipe(T.HttpLabel("PromptId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prompts/{InstanceId}/{PromptId}/file" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTaskTemplateRequest extends S.Class<GetTaskTemplateRequest>(
  "GetTaskTemplateRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    TaskTemplateId: S.String.pipe(T.HttpLabel("TaskTemplateId")),
    SnapshotVersion: S.optional(S.String).pipe(T.HttpQuery("snapshotVersion")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/instance/{InstanceId}/task/template/{TaskTemplateId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTrafficDistributionRequest extends S.Class<GetTrafficDistributionRequest>(
  "GetTrafficDistributionRequest",
)(
  { Id: S.String.pipe(T.HttpLabel("Id")) },
  T.all(
    T.Http({ method: "GET", uri: "/traffic-distribution/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImportPhoneNumberRequest extends S.Class<ImportPhoneNumberRequest>(
  "ImportPhoneNumberRequest",
)(
  {
    InstanceId: S.String,
    SourcePhoneNumberArn: S.String,
    PhoneNumberDescription: S.optional(S.String),
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/phone-number/import" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImportWorkspaceMediaRequest extends S.Class<ImportWorkspaceMediaRequest>(
  "ImportWorkspaceMediaRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    WorkspaceId: S.String.pipe(T.HttpLabel("WorkspaceId")),
    MediaType: S.String,
    MediaSource: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/workspaces/{InstanceId}/{WorkspaceId}/media",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImportWorkspaceMediaResponse extends S.Class<ImportWorkspaceMediaResponse>(
  "ImportWorkspaceMediaResponse",
)({}) {}
export class ListAgentStatusRequest extends S.Class<ListAgentStatusRequest>(
  "ListAgentStatusRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    AgentStatusTypes: S.optional(AgentStatusTypes).pipe(
      T.HttpQuery("AgentStatusTypes"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/agent-status/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAnalyticsDataAssociationsRequest extends S.Class<ListAnalyticsDataAssociationsRequest>(
  "ListAnalyticsDataAssociationsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataSetId: S.optional(S.String).pipe(T.HttpQuery("DataSetId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/analytics-data/instance/{InstanceId}/association",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAnalyticsDataLakeDataSetsRequest extends S.Class<ListAnalyticsDataLakeDataSetsRequest>(
  "ListAnalyticsDataLakeDataSetsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/analytics-data/instance/{InstanceId}/datasets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListApprovedOriginsRequest extends S.Class<ListApprovedOriginsRequest>(
  "ListApprovedOriginsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/instance/{InstanceId}/approved-origins" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssociatedContactsRequest extends S.Class<ListAssociatedContactsRequest>(
  "ListAssociatedContactsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactId: S.String.pipe(T.HttpQuery("contactId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/contact/associated/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAuthenticationProfilesRequest extends S.Class<ListAuthenticationProfilesRequest>(
  "ListAuthenticationProfilesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/authentication-profiles-summary/{InstanceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBotsRequest extends S.Class<ListBotsRequest>(
  "ListBotsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    LexVersion: S.String.pipe(T.HttpQuery("lexVersion")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/instance/{InstanceId}/bots" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListContactEvaluationsRequest extends S.Class<ListContactEvaluationsRequest>(
  "ListContactEvaluationsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactId: S.String.pipe(T.HttpQuery("contactId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/contact-evaluations/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListContactFlowModuleAliasesRequest extends S.Class<ListContactFlowModuleAliasesRequest>(
  "ListContactFlowModuleAliasesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactFlowModuleId: S.String.pipe(T.HttpLabel("ContactFlowModuleId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/contact-flow-modules/{InstanceId}/{ContactFlowModuleId}/aliases",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListContactFlowModulesRequest extends S.Class<ListContactFlowModulesRequest>(
  "ListContactFlowModulesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    ContactFlowModuleState: S.optional(S.String).pipe(T.HttpQuery("state")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/contact-flow-modules-summary/{InstanceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListContactFlowModuleVersionsRequest extends S.Class<ListContactFlowModuleVersionsRequest>(
  "ListContactFlowModuleVersionsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactFlowModuleId: S.String.pipe(T.HttpLabel("ContactFlowModuleId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/contact-flow-modules/{InstanceId}/{ContactFlowModuleId}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListContactFlowsRequest extends S.Class<ListContactFlowsRequest>(
  "ListContactFlowsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactFlowTypes: S.optional(ContactFlowTypes).pipe(
      T.HttpQuery("contactFlowTypes"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/contact-flows-summary/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListContactFlowVersionsRequest extends S.Class<ListContactFlowVersionsRequest>(
  "ListContactFlowVersionsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactFlowId: S.String.pipe(T.HttpLabel("ContactFlowId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/contact-flows/{InstanceId}/{ContactFlowId}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListContactReferencesRequest extends S.Class<ListContactReferencesRequest>(
  "ListContactReferencesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactId: S.String.pipe(T.HttpLabel("ContactId")),
    ReferenceTypes: ReferenceTypes.pipe(T.HttpQuery("referenceTypes")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/contact/references/{InstanceId}/{ContactId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataTableAttributesRequest extends S.Class<ListDataTableAttributesRequest>(
  "ListDataTableAttributesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataTableId: S.String.pipe(T.HttpLabel("DataTableId")),
    AttributeIds: S.optional(AttributeIds),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/data-tables/{InstanceId}/{DataTableId}/attributes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataTablesRequest extends S.Class<ListDataTablesRequest>(
  "ListDataTablesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/data-tables/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ValueList = S.Array(S.String);
export class PrimaryAttributeValueFilter extends S.Class<PrimaryAttributeValueFilter>(
  "PrimaryAttributeValueFilter",
)({ AttributeName: S.String, Values: ValueList }) {}
export const PrimaryAttributeValueFilters = S.Array(
  PrimaryAttributeValueFilter,
);
export class ListDataTableValuesRequest extends S.Class<ListDataTableValuesRequest>(
  "ListDataTableValuesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataTableId: S.String.pipe(T.HttpLabel("DataTableId")),
    RecordIds: S.optional(RecordIds),
    PrimaryAttributeValues: S.optional(PrimaryAttributeValueFilters),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/data-tables/{InstanceId}/{DataTableId}/values/list",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDefaultVocabulariesRequest extends S.Class<ListDefaultVocabulariesRequest>(
  "ListDefaultVocabulariesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    LanguageCode: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/default-vocabulary-summary/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEntitySecurityProfilesRequest extends S.Class<ListEntitySecurityProfilesRequest>(
  "ListEntitySecurityProfilesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    EntityType: S.String,
    EntityArn: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/entity-security-profiles-summary/{InstanceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEvaluationFormsRequest extends S.Class<ListEvaluationFormsRequest>(
  "ListEvaluationFormsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/evaluation-forms/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEvaluationFormVersionsRequest extends S.Class<ListEvaluationFormVersionsRequest>(
  "ListEvaluationFormVersionsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    EvaluationFormId: S.String.pipe(T.HttpLabel("EvaluationFormId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/evaluation-forms/{InstanceId}/{EvaluationFormId}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFlowAssociationsRequest extends S.Class<ListFlowAssociationsRequest>(
  "ListFlowAssociationsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("ResourceType")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/flow-associations-summary/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListHoursOfOperationOverridesRequest extends S.Class<ListHoursOfOperationOverridesRequest>(
  "ListHoursOfOperationOverridesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    HoursOfOperationId: S.String.pipe(T.HttpLabel("HoursOfOperationId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/hours-of-operations/{InstanceId}/{HoursOfOperationId}/overrides",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListHoursOfOperationsRequest extends S.Class<ListHoursOfOperationsRequest>(
  "ListHoursOfOperationsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/hours-of-operations-summary/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInstanceAttributesRequest extends S.Class<ListInstanceAttributesRequest>(
  "ListInstanceAttributesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/instance/{InstanceId}/attributes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInstancesRequest extends S.Class<ListInstancesRequest>(
  "ListInstancesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/instance" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInstanceStorageConfigsRequest extends S.Class<ListInstanceStorageConfigsRequest>(
  "ListInstanceStorageConfigsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ResourceType: S.String.pipe(T.HttpQuery("resourceType")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/instance/{InstanceId}/storage-configs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIntegrationAssociationsRequest extends S.Class<ListIntegrationAssociationsRequest>(
  "ListIntegrationAssociationsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    IntegrationType: S.optional(S.String).pipe(T.HttpQuery("integrationType")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    IntegrationArn: S.optional(S.String).pipe(T.HttpQuery("integrationArn")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/instance/{InstanceId}/integration-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLambdaFunctionsRequest extends S.Class<ListLambdaFunctionsRequest>(
  "ListLambdaFunctionsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/instance/{InstanceId}/lambda-functions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLexBotsRequest extends S.Class<ListLexBotsRequest>(
  "ListLexBotsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/instance/{InstanceId}/lex-bots" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPhoneNumbersRequest extends S.Class<ListPhoneNumbersRequest>(
  "ListPhoneNumbersRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    PhoneNumberTypes: S.optional(PhoneNumberTypes).pipe(
      T.HttpQuery("phoneNumberTypes"),
    ),
    PhoneNumberCountryCodes: S.optional(PhoneNumberCountryCodes).pipe(
      T.HttpQuery("phoneNumberCountryCodes"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/phone-numbers-summary/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPhoneNumbersV2Request extends S.Class<ListPhoneNumbersV2Request>(
  "ListPhoneNumbersV2Request",
)(
  {
    TargetArn: S.optional(S.String),
    InstanceId: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    PhoneNumberCountryCodes: S.optional(PhoneNumberCountryCodes),
    PhoneNumberTypes: S.optional(PhoneNumberTypes),
    PhoneNumberPrefix: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/phone-number/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPredefinedAttributesRequest extends S.Class<ListPredefinedAttributesRequest>(
  "ListPredefinedAttributesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/predefined-attributes/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPromptsRequest extends S.Class<ListPromptsRequest>(
  "ListPromptsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prompts-summary/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListQueueQuickConnectsRequest extends S.Class<ListQueueQuickConnectsRequest>(
  "ListQueueQuickConnectsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    QueueId: S.String.pipe(T.HttpLabel("QueueId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/queues/{InstanceId}/{QueueId}/quick-connects",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListQueuesRequest extends S.Class<ListQueuesRequest>(
  "ListQueuesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    QueueTypes: S.optional(QueueTypes).pipe(T.HttpQuery("queueTypes")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/queues-summary/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListQuickConnectsRequest extends S.Class<ListQuickConnectsRequest>(
  "ListQuickConnectsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    QuickConnectTypes: S.optional(QuickConnectTypes).pipe(
      T.HttpQuery("QuickConnectTypes"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/quick-connects/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRealtimeContactAnalysisSegmentsV2Request extends S.Class<ListRealtimeContactAnalysisSegmentsV2Request>(
  "ListRealtimeContactAnalysisSegmentsV2Request",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactId: S.String.pipe(T.HttpLabel("ContactId")),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    OutputType: S.String,
    SegmentTypes: RealTimeContactAnalysisSegmentTypes,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/contact/list-real-time-analysis-segments-v2/{InstanceId}/{ContactId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRoutingProfileManualAssignmentQueuesRequest extends S.Class<ListRoutingProfileManualAssignmentQueuesRequest>(
  "ListRoutingProfileManualAssignmentQueuesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    RoutingProfileId: S.String.pipe(T.HttpLabel("RoutingProfileId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/routing-profiles/{InstanceId}/{RoutingProfileId}/manual-assignment-queues",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRoutingProfileQueuesRequest extends S.Class<ListRoutingProfileQueuesRequest>(
  "ListRoutingProfileQueuesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    RoutingProfileId: S.String.pipe(T.HttpLabel("RoutingProfileId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/routing-profiles/{InstanceId}/{RoutingProfileId}/queues",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRoutingProfilesRequest extends S.Class<ListRoutingProfilesRequest>(
  "ListRoutingProfilesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/routing-profiles-summary/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRulesRequest extends S.Class<ListRulesRequest>(
  "ListRulesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    PublishStatus: S.optional(S.String).pipe(T.HttpQuery("publishStatus")),
    EventSourceName: S.optional(S.String).pipe(T.HttpQuery("eventSourceName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/rules/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSecurityKeysRequest extends S.Class<ListSecurityKeysRequest>(
  "ListSecurityKeysRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/instance/{InstanceId}/security-keys" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSecurityProfileApplicationsRequest extends S.Class<ListSecurityProfileApplicationsRequest>(
  "ListSecurityProfileApplicationsRequest",
)(
  {
    SecurityProfileId: S.String.pipe(T.HttpLabel("SecurityProfileId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/security-profiles-applications/{InstanceId}/{SecurityProfileId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSecurityProfileFlowModulesRequest extends S.Class<ListSecurityProfileFlowModulesRequest>(
  "ListSecurityProfileFlowModulesRequest",
)(
  {
    SecurityProfileId: S.String.pipe(T.HttpLabel("SecurityProfileId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/security-profiles-flow-modules/{InstanceId}/{SecurityProfileId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSecurityProfilePermissionsRequest extends S.Class<ListSecurityProfilePermissionsRequest>(
  "ListSecurityProfilePermissionsRequest",
)(
  {
    SecurityProfileId: S.String.pipe(T.HttpLabel("SecurityProfileId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/security-profiles-permissions/{InstanceId}/{SecurityProfileId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSecurityProfilesRequest extends S.Class<ListSecurityProfilesRequest>(
  "ListSecurityProfilesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/security-profiles-summary/{InstanceId}" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTaskTemplatesRequest extends S.Class<ListTaskTemplatesRequest>(
  "ListTaskTemplatesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    Status: S.optional(S.String).pipe(T.HttpQuery("status")),
    Name: S.optional(S.String).pipe(T.HttpQuery("name")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/instance/{InstanceId}/task/template" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTrafficDistributionGroupsRequest extends S.Class<ListTrafficDistributionGroupsRequest>(
  "ListTrafficDistributionGroupsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    InstanceId: S.optional(S.String).pipe(T.HttpQuery("instanceId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/traffic-distribution-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTrafficDistributionGroupUsersRequest extends S.Class<ListTrafficDistributionGroupUsersRequest>(
  "ListTrafficDistributionGroupUsersRequest",
)(
  {
    TrafficDistributionGroupId: S.String.pipe(
      T.HttpLabel("TrafficDistributionGroupId"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/traffic-distribution-group/{TrafficDistributionGroupId}/user",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListUseCasesRequest extends S.Class<ListUseCasesRequest>(
  "ListUseCasesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    IntegrationAssociationId: S.String.pipe(
      T.HttpLabel("IntegrationAssociationId"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/instance/{InstanceId}/integration-associations/{IntegrationAssociationId}/use-cases",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListUserHierarchyGroupsRequest extends S.Class<ListUserHierarchyGroupsRequest>(
  "ListUserHierarchyGroupsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/user-hierarchy-groups-summary/{InstanceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListUserProficienciesRequest extends S.Class<ListUserProficienciesRequest>(
  "ListUserProficienciesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/users/{InstanceId}/{UserId}/proficiencies",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListUsersRequest extends S.Class<ListUsersRequest>(
  "ListUsersRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/users-summary/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListViewsRequest extends S.Class<ListViewsRequest>(
  "ListViewsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Type: S.optional(S.String).pipe(T.HttpQuery("type")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/views/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListViewVersionsRequest extends S.Class<ListViewVersionsRequest>(
  "ListViewVersionsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ViewId: S.String.pipe(T.HttpLabel("ViewId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/views/{InstanceId}/{ViewId}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkspaceMediaRequest extends S.Class<ListWorkspaceMediaRequest>(
  "ListWorkspaceMediaRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    WorkspaceId: S.String.pipe(T.HttpLabel("WorkspaceId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/workspaces/{InstanceId}/{WorkspaceId}/media",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkspacePagesRequest extends S.Class<ListWorkspacePagesRequest>(
  "ListWorkspacePagesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    WorkspaceId: S.String.pipe(T.HttpLabel("WorkspaceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/workspaces/{InstanceId}/{WorkspaceId}/pages",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkspacesRequest extends S.Class<ListWorkspacesRequest>(
  "ListWorkspacesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/workspaces/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class MonitorContactRequest extends S.Class<MonitorContactRequest>(
  "MonitorContactRequest",
)(
  {
    InstanceId: S.String,
    ContactId: S.String,
    UserId: S.String,
    AllowedMonitorCapabilities: S.optional(AllowedMonitorCapabilities),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/contact/monitor" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PauseContactRequest extends S.Class<PauseContactRequest>(
  "PauseContactRequest",
)(
  {
    ContactId: S.String,
    InstanceId: S.String,
    ContactFlowId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/contact/pause" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PauseContactResponse extends S.Class<PauseContactResponse>(
  "PauseContactResponse",
)({}) {}
export class PutUserStatusRequest extends S.Class<PutUserStatusRequest>(
  "PutUserStatusRequest",
)(
  {
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    AgentStatusId: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/users/{InstanceId}/{UserId}/status" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutUserStatusResponse extends S.Class<PutUserStatusResponse>(
  "PutUserStatusResponse",
)({}) {}
export class ReleasePhoneNumberRequest extends S.Class<ReleasePhoneNumberRequest>(
  "ReleasePhoneNumberRequest",
)(
  {
    PhoneNumberId: S.String.pipe(T.HttpLabel("PhoneNumberId")),
    ClientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/phone-number/{PhoneNumberId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ReleasePhoneNumberResponse extends S.Class<ReleasePhoneNumberResponse>(
  "ReleasePhoneNumberResponse",
)({}) {}
export class ReplicateInstanceRequest extends S.Class<ReplicateInstanceRequest>(
  "ReplicateInstanceRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ReplicaRegion: S.String,
    ClientToken: S.optional(S.String),
    ReplicaAlias: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/instance/{InstanceId}/replicate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResumeContactRequest extends S.Class<ResumeContactRequest>(
  "ResumeContactRequest",
)(
  {
    ContactId: S.String,
    InstanceId: S.String,
    ContactFlowId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/contact/resume" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResumeContactResponse extends S.Class<ResumeContactResponse>(
  "ResumeContactResponse",
)({}) {}
export class ResumeContactRecordingRequest extends S.Class<ResumeContactRecordingRequest>(
  "ResumeContactRecordingRequest",
)(
  {
    InstanceId: S.String,
    ContactId: S.String,
    InitialContactId: S.String,
    ContactRecordingType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/contact/resume-recording" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResumeContactRecordingResponse extends S.Class<ResumeContactRecordingResponse>(
  "ResumeContactRecordingResponse",
)({}) {}
export class SearchAvailablePhoneNumbersRequest extends S.Class<SearchAvailablePhoneNumbersRequest>(
  "SearchAvailablePhoneNumbersRequest",
)(
  {
    TargetArn: S.optional(S.String),
    InstanceId: S.optional(S.String),
    PhoneNumberCountryCode: S.String,
    PhoneNumberType: S.String,
    PhoneNumberPrefix: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/phone-number/search-available" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchVocabulariesRequest extends S.Class<SearchVocabulariesRequest>(
  "SearchVocabulariesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    State: S.optional(S.String),
    NameStartsWith: S.optional(S.String),
    LanguageCode: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/vocabulary-summary/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartContactMediaProcessingRequest extends S.Class<StartContactMediaProcessingRequest>(
  "StartContactMediaProcessingRequest",
)(
  {
    InstanceId: S.optional(S.String),
    ContactId: S.optional(S.String),
    ProcessorArn: S.optional(S.String),
    FailureMode: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/contact/start-contact-media-processing" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartContactMediaProcessingResponse extends S.Class<StartContactMediaProcessingResponse>(
  "StartContactMediaProcessingResponse",
)({}) {}
export class EmailAddressInfo extends S.Class<EmailAddressInfo>(
  "EmailAddressInfo",
)({ EmailAddress: S.String, DisplayName: S.optional(S.String) }) {}
export const EmailAddressRecipientList = S.Array(EmailAddressInfo);
export class OutboundAdditionalRecipients extends S.Class<OutboundAdditionalRecipients>(
  "OutboundAdditionalRecipients",
)({ CcEmailAddresses: S.optional(EmailAddressRecipientList) }) {}
export const Attributes = S.Record({ key: S.String, value: S.String });
export class TemplateAttributes extends S.Class<TemplateAttributes>(
  "TemplateAttributes",
)({
  CustomAttributes: S.optional(Attributes),
  CustomerProfileAttributes: S.optional(S.String),
}) {}
export class TemplatedMessageConfig extends S.Class<TemplatedMessageConfig>(
  "TemplatedMessageConfig",
)({
  KnowledgeBaseId: S.String,
  MessageTemplateId: S.String,
  TemplateAttributes: TemplateAttributes,
}) {}
export class OutboundRawMessage extends S.Class<OutboundRawMessage>(
  "OutboundRawMessage",
)({ Subject: S.String, Body: S.String, ContentType: S.String }) {}
export class OutboundEmailContent extends S.Class<OutboundEmailContent>(
  "OutboundEmailContent",
)({
  MessageSourceType: S.String,
  TemplatedMessageConfig: S.optional(TemplatedMessageConfig),
  RawMessage: S.optional(OutboundRawMessage),
}) {}
export class StartOutboundEmailContactRequest extends S.Class<StartOutboundEmailContactRequest>(
  "StartOutboundEmailContactRequest",
)(
  {
    InstanceId: S.String,
    ContactId: S.String,
    FromEmailAddress: S.optional(EmailAddressInfo),
    DestinationEmailAddress: EmailAddressInfo,
    AdditionalRecipients: S.optional(OutboundAdditionalRecipients),
    EmailMessage: OutboundEmailContent,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/contact/outbound-email" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartScreenSharingRequest extends S.Class<StartScreenSharingRequest>(
  "StartScreenSharingRequest",
)(
  {
    ClientToken: S.optional(S.String),
    InstanceId: S.String,
    ContactId: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/contact/screen-sharing" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartScreenSharingResponse extends S.Class<StartScreenSharingResponse>(
  "StartScreenSharingResponse",
)({}) {}
export class Reference extends S.Class<Reference>("Reference")({
  Value: S.optional(S.String),
  Type: S.String,
  Status: S.optional(S.String),
  Arn: S.optional(S.String),
  StatusReason: S.optional(S.String),
}) {}
export const ContactReferences = S.Record({ key: S.String, value: Reference });
export class SegmentAttributeValue extends S.Class<SegmentAttributeValue>(
  "SegmentAttributeValue",
)({
  ValueString: S.optional(S.String),
  ValueMap: S.optional(S.suspend(() => SegmentAttributeValueMap)),
  ValueInteger: S.optional(S.Number),
  ValueList: S.optional(S.suspend(() => SegmentAttributeValueList)),
  ValueArn: S.optional(S.String),
}) {}
export const SegmentAttributes = S.Record({
  key: S.String,
  value: S.suspend(
    (): S.Schema<SegmentAttributeValue, any> => SegmentAttributeValue,
  ),
});
export class StartTaskContactRequest extends S.Class<StartTaskContactRequest>(
  "StartTaskContactRequest",
)(
  {
    InstanceId: S.String,
    PreviousContactId: S.optional(S.String),
    ContactFlowId: S.optional(S.String),
    Attributes: S.optional(Attributes),
    Name: S.String,
    References: S.optional(ContactReferences),
    Description: S.optional(S.String),
    ClientToken: S.optional(S.String),
    ScheduledTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    TaskTemplateId: S.optional(S.String),
    QuickConnectId: S.optional(S.String),
    RelatedContactId: S.optional(S.String),
    SegmentAttributes: S.optional(SegmentAttributes),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/contact/task" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopContactMediaProcessingRequest extends S.Class<StopContactMediaProcessingRequest>(
  "StopContactMediaProcessingRequest",
)(
  { InstanceId: S.optional(S.String), ContactId: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/contact/stop-contact-media-processing" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopContactMediaProcessingResponse extends S.Class<StopContactMediaProcessingResponse>(
  "StopContactMediaProcessingResponse",
)({}) {}
export class StopContactRecordingRequest extends S.Class<StopContactRecordingRequest>(
  "StopContactRecordingRequest",
)(
  {
    InstanceId: S.String,
    ContactId: S.String,
    InitialContactId: S.String,
    ContactRecordingType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/contact/stop-recording" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopContactRecordingResponse extends S.Class<StopContactRecordingResponse>(
  "StopContactRecordingResponse",
)({}) {}
export class StopContactStreamingRequest extends S.Class<StopContactStreamingRequest>(
  "StopContactStreamingRequest",
)(
  { InstanceId: S.String, ContactId: S.String, StreamingId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/contact/stop-streaming" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopContactStreamingResponse extends S.Class<StopContactStreamingResponse>(
  "StopContactStreamingResponse",
)({}) {}
export class SuspendContactRecordingRequest extends S.Class<SuspendContactRecordingRequest>(
  "SuspendContactRecordingRequest",
)(
  {
    InstanceId: S.String,
    ContactId: S.String,
    InitialContactId: S.String,
    ContactRecordingType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/contact/suspend-recording" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SuspendContactRecordingResponse extends S.Class<SuspendContactRecordingResponse>(
  "SuspendContactRecordingResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagMap },
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
export class TransferContactRequest extends S.Class<TransferContactRequest>(
  "TransferContactRequest",
)(
  {
    InstanceId: S.String,
    ContactId: S.String,
    QueueId: S.optional(S.String),
    UserId: S.optional(S.String),
    ContactFlowId: S.String,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/contact/transfer" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagContactRequest extends S.Class<UntagContactRequest>(
  "UntagContactRequest",
)(
  {
    ContactId: S.String.pipe(T.HttpLabel("ContactId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    TagKeys: ContactTagKeys.pipe(T.HttpQuery("TagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/contact/tags/{InstanceId}/{ContactId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagContactResponse extends S.Class<UntagContactResponse>(
  "UntagContactResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
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
export class UpdateAgentStatusRequest extends S.Class<UpdateAgentStatusRequest>(
  "UpdateAgentStatusRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    AgentStatusId: S.String.pipe(T.HttpLabel("AgentStatusId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    State: S.optional(S.String),
    DisplayOrder: S.optional(S.Number),
    ResetOrderNumber: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/agent-status/{InstanceId}/{AgentStatusId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAgentStatusResponse extends S.Class<UpdateAgentStatusResponse>(
  "UpdateAgentStatusResponse",
)({}) {}
export class UpdateAuthenticationProfileRequest extends S.Class<UpdateAuthenticationProfileRequest>(
  "UpdateAuthenticationProfileRequest",
)(
  {
    AuthenticationProfileId: S.String.pipe(
      T.HttpLabel("AuthenticationProfileId"),
    ),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    AllowedIps: S.optional(IpCidrList),
    BlockedIps: S.optional(IpCidrList),
    PeriodicSessionDuration: S.optional(S.Number),
    SessionInactivityDuration: S.optional(S.Number),
    SessionInactivityHandlingEnabled: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/authentication-profiles/{InstanceId}/{AuthenticationProfileId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAuthenticationProfileResponse extends S.Class<UpdateAuthenticationProfileResponse>(
  "UpdateAuthenticationProfileResponse",
)({}) {}
export class UpdateContactAttributesRequest extends S.Class<UpdateContactAttributesRequest>(
  "UpdateContactAttributesRequest",
)(
  { InitialContactId: S.String, InstanceId: S.String, Attributes: Attributes },
  T.all(
    T.Http({ method: "POST", uri: "/contact/attributes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateContactAttributesResponse extends S.Class<UpdateContactAttributesResponse>(
  "UpdateContactAttributesResponse",
)({}) {}
export const EvaluationAnswerDataStringValueList = S.Array(S.String);
export const EvaluationAnswerData = S.Union(
  S.Struct({ StringValue: S.String }),
  S.Struct({ NumericValue: S.Number }),
  S.Struct({ StringValues: EvaluationAnswerDataStringValueList }),
  S.Struct({ DateTimeValue: S.String }),
  S.Struct({ NotApplicable: S.Boolean }),
);
export class EvaluationAnswerInput extends S.Class<EvaluationAnswerInput>(
  "EvaluationAnswerInput",
)({ Value: S.optional(EvaluationAnswerData) }) {}
export const EvaluationAnswersInputMap = S.Record({
  key: S.String,
  value: EvaluationAnswerInput,
});
export class EvaluationNote extends S.Class<EvaluationNote>("EvaluationNote")({
  Value: S.optional(S.String),
}) {}
export const EvaluationNotesMap = S.Record({
  key: S.String,
  value: EvaluationNote,
});
export const EvaluatorUserUnion = S.Union(
  S.Struct({ ConnectUserArn: S.String }),
);
export class UpdateContactEvaluationRequest extends S.Class<UpdateContactEvaluationRequest>(
  "UpdateContactEvaluationRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    EvaluationId: S.String.pipe(T.HttpLabel("EvaluationId")),
    Answers: S.optional(EvaluationAnswersInputMap),
    Notes: S.optional(EvaluationNotesMap),
    UpdatedBy: S.optional(EvaluatorUserUnion),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/contact-evaluations/{InstanceId}/{EvaluationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateContactFlowContentRequest extends S.Class<UpdateContactFlowContentRequest>(
  "UpdateContactFlowContentRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactFlowId: S.String.pipe(T.HttpLabel("ContactFlowId")),
    Content: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/contact-flows/{InstanceId}/{ContactFlowId}/content",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateContactFlowContentResponse extends S.Class<UpdateContactFlowContentResponse>(
  "UpdateContactFlowContentResponse",
)({}) {}
export class UpdateContactFlowMetadataRequest extends S.Class<UpdateContactFlowMetadataRequest>(
  "UpdateContactFlowMetadataRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactFlowId: S.String.pipe(T.HttpLabel("ContactFlowId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ContactFlowState: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/contact-flows/{InstanceId}/{ContactFlowId}/metadata",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateContactFlowMetadataResponse extends S.Class<UpdateContactFlowMetadataResponse>(
  "UpdateContactFlowMetadataResponse",
)({}) {}
export class UpdateContactFlowModuleAliasRequest extends S.Class<UpdateContactFlowModuleAliasRequest>(
  "UpdateContactFlowModuleAliasRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactFlowModuleId: S.String.pipe(T.HttpLabel("ContactFlowModuleId")),
    AliasId: S.String.pipe(T.HttpLabel("AliasId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ContactFlowModuleVersion: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/contact-flow-modules/{InstanceId}/{ContactFlowModuleId}/alias/{AliasId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateContactFlowModuleAliasResponse extends S.Class<UpdateContactFlowModuleAliasResponse>(
  "UpdateContactFlowModuleAliasResponse",
)({}) {}
export class UpdateContactFlowModuleContentRequest extends S.Class<UpdateContactFlowModuleContentRequest>(
  "UpdateContactFlowModuleContentRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactFlowModuleId: S.String.pipe(T.HttpLabel("ContactFlowModuleId")),
    Content: S.optional(S.String),
    Settings: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/contact-flow-modules/{InstanceId}/{ContactFlowModuleId}/content",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateContactFlowModuleContentResponse extends S.Class<UpdateContactFlowModuleContentResponse>(
  "UpdateContactFlowModuleContentResponse",
)({}) {}
export class UpdateContactFlowModuleMetadataRequest extends S.Class<UpdateContactFlowModuleMetadataRequest>(
  "UpdateContactFlowModuleMetadataRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactFlowModuleId: S.String.pipe(T.HttpLabel("ContactFlowModuleId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    State: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/contact-flow-modules/{InstanceId}/{ContactFlowModuleId}/metadata",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateContactFlowModuleMetadataResponse extends S.Class<UpdateContactFlowModuleMetadataResponse>(
  "UpdateContactFlowModuleMetadataResponse",
)({}) {}
export class UpdateContactFlowNameRequest extends S.Class<UpdateContactFlowNameRequest>(
  "UpdateContactFlowNameRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactFlowId: S.String.pipe(T.HttpLabel("ContactFlowId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/contact-flows/{InstanceId}/{ContactFlowId}/name",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateContactFlowNameResponse extends S.Class<UpdateContactFlowNameResponse>(
  "UpdateContactFlowNameResponse",
)({}) {}
export class UpdateContactScheduleRequest extends S.Class<UpdateContactScheduleRequest>(
  "UpdateContactScheduleRequest",
)(
  {
    InstanceId: S.String,
    ContactId: S.String,
    ScheduledTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/contact/schedule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateContactScheduleResponse extends S.Class<UpdateContactScheduleResponse>(
  "UpdateContactScheduleResponse",
)({}) {}
export const ValidationEnumValues = S.Array(S.String);
export class ValidationEnum extends S.Class<ValidationEnum>("ValidationEnum")({
  Strict: S.optional(S.Boolean),
  Values: S.optional(ValidationEnumValues),
}) {}
export class Validation extends S.Class<Validation>("Validation")({
  MinLength: S.optional(S.Number),
  MaxLength: S.optional(S.Number),
  MinValues: S.optional(S.Number),
  MaxValues: S.optional(S.Number),
  IgnoreCase: S.optional(S.Boolean),
  Minimum: S.optional(S.Number),
  Maximum: S.optional(S.Number),
  ExclusiveMinimum: S.optional(S.Number),
  ExclusiveMaximum: S.optional(S.Number),
  MultipleOf: S.optional(S.Number),
  Enum: S.optional(ValidationEnum),
}) {}
export class UpdateDataTableAttributeRequest extends S.Class<UpdateDataTableAttributeRequest>(
  "UpdateDataTableAttributeRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataTableId: S.String.pipe(T.HttpLabel("DataTableId")),
    AttributeName: S.String.pipe(T.HttpLabel("AttributeName")),
    Name: S.String,
    ValueType: S.String,
    Description: S.optional(S.String),
    Primary: S.optional(S.Boolean),
    Validation: S.optional(Validation),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/data-tables/{InstanceId}/{DataTableId}/attributes/{AttributeName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDataTableMetadataRequest extends S.Class<UpdateDataTableMetadataRequest>(
  "UpdateDataTableMetadataRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataTableId: S.String.pipe(T.HttpLabel("DataTableId")),
    Name: S.String,
    Description: S.optional(S.String),
    ValueLockLevel: S.String,
    TimeZone: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/data-tables/{InstanceId}/{DataTableId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEmailAddressMetadataRequest extends S.Class<UpdateEmailAddressMetadataRequest>(
  "UpdateEmailAddressMetadataRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    EmailAddressId: S.String.pipe(T.HttpLabel("EmailAddressId")),
    Description: S.optional(S.String),
    DisplayName: S.optional(S.String),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/email-addresses/{InstanceId}/{EmailAddressId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export type EvaluationFormItemsList = EvaluationFormItem[];
export const EvaluationFormItemsList = S.Array(
  S.suspend(() => EvaluationFormItem),
) as any as S.Schema<EvaluationFormItemsList>;
export class EvaluationFormScoringStrategy extends S.Class<EvaluationFormScoringStrategy>(
  "EvaluationFormScoringStrategy",
)({ Mode: S.String, Status: S.String }) {}
export class EvaluationFormAutoEvaluationConfiguration extends S.Class<EvaluationFormAutoEvaluationConfiguration>(
  "EvaluationFormAutoEvaluationConfiguration",
)({ Enabled: S.Boolean }) {}
export class EvaluationFormTargetConfiguration extends S.Class<EvaluationFormTargetConfiguration>(
  "EvaluationFormTargetConfiguration",
)({ ContactInteractionType: S.String }) {}
export class EvaluationFormLanguageConfiguration extends S.Class<EvaluationFormLanguageConfiguration>(
  "EvaluationFormLanguageConfiguration",
)({ FormLanguage: S.optional(S.String) }) {}
export class UpdateEvaluationFormRequest extends S.Class<UpdateEvaluationFormRequest>(
  "UpdateEvaluationFormRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    EvaluationFormId: S.String.pipe(T.HttpLabel("EvaluationFormId")),
    EvaluationFormVersion: S.Number,
    CreateNewVersion: S.optional(S.Boolean),
    Title: S.String,
    Description: S.optional(S.String),
    Items: EvaluationFormItemsList,
    ScoringStrategy: S.optional(EvaluationFormScoringStrategy),
    AutoEvaluationConfiguration: S.optional(
      EvaluationFormAutoEvaluationConfiguration,
    ),
    AsDraft: S.optional(S.Boolean),
    ClientToken: S.optional(S.String),
    TargetConfiguration: S.optional(EvaluationFormTargetConfiguration),
    LanguageConfiguration: S.optional(EvaluationFormLanguageConfiguration),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/evaluation-forms/{InstanceId}/{EvaluationFormId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class HoursOfOperationTimeSlice extends S.Class<HoursOfOperationTimeSlice>(
  "HoursOfOperationTimeSlice",
)({ Hours: S.Number, Minutes: S.Number }) {}
export class HoursOfOperationConfig extends S.Class<HoursOfOperationConfig>(
  "HoursOfOperationConfig",
)({
  Day: S.String,
  StartTime: HoursOfOperationTimeSlice,
  EndTime: HoursOfOperationTimeSlice,
}) {}
export const HoursOfOperationConfigList = S.Array(HoursOfOperationConfig);
export class UpdateHoursOfOperationRequest extends S.Class<UpdateHoursOfOperationRequest>(
  "UpdateHoursOfOperationRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    HoursOfOperationId: S.String.pipe(T.HttpLabel("HoursOfOperationId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    TimeZone: S.optional(S.String),
    Config: S.optional(HoursOfOperationConfigList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/hours-of-operations/{InstanceId}/{HoursOfOperationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateHoursOfOperationResponse extends S.Class<UpdateHoursOfOperationResponse>(
  "UpdateHoursOfOperationResponse",
)({}) {}
export class OverrideTimeSlice extends S.Class<OverrideTimeSlice>(
  "OverrideTimeSlice",
)({ Hours: S.Number, Minutes: S.Number }) {}
export class HoursOfOperationOverrideConfig extends S.Class<HoursOfOperationOverrideConfig>(
  "HoursOfOperationOverrideConfig",
)({
  Day: S.optional(S.String),
  StartTime: S.optional(OverrideTimeSlice),
  EndTime: S.optional(OverrideTimeSlice),
}) {}
export const HoursOfOperationOverrideConfigList = S.Array(
  HoursOfOperationOverrideConfig,
);
export class UpdateHoursOfOperationOverrideRequest extends S.Class<UpdateHoursOfOperationOverrideRequest>(
  "UpdateHoursOfOperationOverrideRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    HoursOfOperationId: S.String.pipe(T.HttpLabel("HoursOfOperationId")),
    HoursOfOperationOverrideId: S.String.pipe(
      T.HttpLabel("HoursOfOperationOverrideId"),
    ),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Config: S.optional(HoursOfOperationOverrideConfigList),
    EffectiveFrom: S.optional(S.String),
    EffectiveTill: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/hours-of-operations/{InstanceId}/{HoursOfOperationId}/overrides/{HoursOfOperationOverrideId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateHoursOfOperationOverrideResponse extends S.Class<UpdateHoursOfOperationOverrideResponse>(
  "UpdateHoursOfOperationOverrideResponse",
)({}) {}
export class UpdateInstanceAttributeRequest extends S.Class<UpdateInstanceAttributeRequest>(
  "UpdateInstanceAttributeRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    AttributeType: S.String.pipe(T.HttpLabel("AttributeType")),
    Value: S.String,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/instance/{InstanceId}/attribute/{AttributeType}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateInstanceAttributeResponse extends S.Class<UpdateInstanceAttributeResponse>(
  "UpdateInstanceAttributeResponse",
)({}) {}
export class EncryptionConfig extends S.Class<EncryptionConfig>(
  "EncryptionConfig",
)({ EncryptionType: S.String, KeyId: S.String }) {}
export class S3Config extends S.Class<S3Config>("S3Config")({
  BucketName: S.String,
  BucketPrefix: S.String,
  EncryptionConfig: S.optional(EncryptionConfig),
}) {}
export class KinesisVideoStreamConfig extends S.Class<KinesisVideoStreamConfig>(
  "KinesisVideoStreamConfig",
)({
  Prefix: S.String,
  RetentionPeriodHours: S.Number,
  EncryptionConfig: EncryptionConfig,
}) {}
export class KinesisStreamConfig extends S.Class<KinesisStreamConfig>(
  "KinesisStreamConfig",
)({ StreamArn: S.String }) {}
export class KinesisFirehoseConfig extends S.Class<KinesisFirehoseConfig>(
  "KinesisFirehoseConfig",
)({ FirehoseArn: S.String }) {}
export class InstanceStorageConfig extends S.Class<InstanceStorageConfig>(
  "InstanceStorageConfig",
)({
  AssociationId: S.optional(S.String),
  StorageType: S.String,
  S3Config: S.optional(S3Config),
  KinesisVideoStreamConfig: S.optional(KinesisVideoStreamConfig),
  KinesisStreamConfig: S.optional(KinesisStreamConfig),
  KinesisFirehoseConfig: S.optional(KinesisFirehoseConfig),
}) {}
export class UpdateInstanceStorageConfigRequest extends S.Class<UpdateInstanceStorageConfigRequest>(
  "UpdateInstanceStorageConfigRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    AssociationId: S.String.pipe(T.HttpLabel("AssociationId")),
    ResourceType: S.String.pipe(T.HttpQuery("resourceType")),
    StorageConfig: InstanceStorageConfig,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/instance/{InstanceId}/storage-config/{AssociationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateInstanceStorageConfigResponse extends S.Class<UpdateInstanceStorageConfigResponse>(
  "UpdateInstanceStorageConfigResponse",
)({}) {}
export class UpdateParticipantAuthenticationRequest extends S.Class<UpdateParticipantAuthenticationRequest>(
  "UpdateParticipantAuthenticationRequest",
)(
  {
    State: S.String,
    InstanceId: S.String,
    Code: S.optional(S.String),
    Error: S.optional(S.String),
    ErrorDescription: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/contact/update-participant-authentication",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateParticipantAuthenticationResponse extends S.Class<UpdateParticipantAuthenticationResponse>(
  "UpdateParticipantAuthenticationResponse",
)({}) {}
export class UpdatePhoneNumberRequest extends S.Class<UpdatePhoneNumberRequest>(
  "UpdatePhoneNumberRequest",
)(
  {
    PhoneNumberId: S.String.pipe(T.HttpLabel("PhoneNumberId")),
    TargetArn: S.optional(S.String),
    InstanceId: S.optional(S.String),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/phone-number/{PhoneNumberId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePhoneNumberMetadataRequest extends S.Class<UpdatePhoneNumberMetadataRequest>(
  "UpdatePhoneNumberMetadataRequest",
)(
  {
    PhoneNumberId: S.String.pipe(T.HttpLabel("PhoneNumberId")),
    PhoneNumberDescription: S.optional(S.String),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/phone-number/{PhoneNumberId}/metadata" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePhoneNumberMetadataResponse extends S.Class<UpdatePhoneNumberMetadataResponse>(
  "UpdatePhoneNumberMetadataResponse",
)({}) {}
export const PredefinedAttributeStringValuesList = S.Array(S.String);
export const PredefinedAttributeValues = S.Union(
  S.Struct({ StringList: PredefinedAttributeStringValuesList }),
);
export class InputPredefinedAttributeConfiguration extends S.Class<InputPredefinedAttributeConfiguration>(
  "InputPredefinedAttributeConfiguration",
)({ EnableValueValidationOnAssociation: S.optional(S.Boolean) }) {}
export class UpdatePredefinedAttributeRequest extends S.Class<UpdatePredefinedAttributeRequest>(
  "UpdatePredefinedAttributeRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Name: S.String.pipe(T.HttpLabel("Name")),
    Values: S.optional(PredefinedAttributeValues),
    Purposes: S.optional(PredefinedAttributePurposeNameList),
    AttributeConfiguration: S.optional(InputPredefinedAttributeConfiguration),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/predefined-attributes/{InstanceId}/{Name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePredefinedAttributeResponse extends S.Class<UpdatePredefinedAttributeResponse>(
  "UpdatePredefinedAttributeResponse",
)({}) {}
export class UpdatePromptRequest extends S.Class<UpdatePromptRequest>(
  "UpdatePromptRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    PromptId: S.String.pipe(T.HttpLabel("PromptId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    S3Uri: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prompts/{InstanceId}/{PromptId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateQueueHoursOfOperationRequest extends S.Class<UpdateQueueHoursOfOperationRequest>(
  "UpdateQueueHoursOfOperationRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    QueueId: S.String.pipe(T.HttpLabel("QueueId")),
    HoursOfOperationId: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/queues/{InstanceId}/{QueueId}/hours-of-operation",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateQueueHoursOfOperationResponse extends S.Class<UpdateQueueHoursOfOperationResponse>(
  "UpdateQueueHoursOfOperationResponse",
)({}) {}
export class UpdateQueueMaxContactsRequest extends S.Class<UpdateQueueMaxContactsRequest>(
  "UpdateQueueMaxContactsRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    QueueId: S.String.pipe(T.HttpLabel("QueueId")),
    MaxContacts: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/queues/{InstanceId}/{QueueId}/max-contacts",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateQueueMaxContactsResponse extends S.Class<UpdateQueueMaxContactsResponse>(
  "UpdateQueueMaxContactsResponse",
)({}) {}
export class UpdateQueueNameRequest extends S.Class<UpdateQueueNameRequest>(
  "UpdateQueueNameRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    QueueId: S.String.pipe(T.HttpLabel("QueueId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/queues/{InstanceId}/{QueueId}/name" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateQueueNameResponse extends S.Class<UpdateQueueNameResponse>(
  "UpdateQueueNameResponse",
)({}) {}
export class OutboundCallerConfig extends S.Class<OutboundCallerConfig>(
  "OutboundCallerConfig",
)({
  OutboundCallerIdName: S.optional(S.String),
  OutboundCallerIdNumberId: S.optional(S.String),
  OutboundFlowId: S.optional(S.String),
}) {}
export class UpdateQueueOutboundCallerConfigRequest extends S.Class<UpdateQueueOutboundCallerConfigRequest>(
  "UpdateQueueOutboundCallerConfigRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    QueueId: S.String.pipe(T.HttpLabel("QueueId")),
    OutboundCallerConfig: OutboundCallerConfig,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/queues/{InstanceId}/{QueueId}/outbound-caller-config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateQueueOutboundCallerConfigResponse extends S.Class<UpdateQueueOutboundCallerConfigResponse>(
  "UpdateQueueOutboundCallerConfigResponse",
)({}) {}
export class OutboundEmailConfig extends S.Class<OutboundEmailConfig>(
  "OutboundEmailConfig",
)({ OutboundEmailAddressId: S.optional(S.String) }) {}
export class UpdateQueueOutboundEmailConfigRequest extends S.Class<UpdateQueueOutboundEmailConfigRequest>(
  "UpdateQueueOutboundEmailConfigRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    QueueId: S.String.pipe(T.HttpLabel("QueueId")),
    OutboundEmailConfig: OutboundEmailConfig,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/queues/{InstanceId}/{QueueId}/outbound-email-config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateQueueOutboundEmailConfigResponse extends S.Class<UpdateQueueOutboundEmailConfigResponse>(
  "UpdateQueueOutboundEmailConfigResponse",
)({}) {}
export class UpdateQueueStatusRequest extends S.Class<UpdateQueueStatusRequest>(
  "UpdateQueueStatusRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    QueueId: S.String.pipe(T.HttpLabel("QueueId")),
    Status: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/queues/{InstanceId}/{QueueId}/status" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateQueueStatusResponse extends S.Class<UpdateQueueStatusResponse>(
  "UpdateQueueStatusResponse",
)({}) {}
export class UserQuickConnectConfig extends S.Class<UserQuickConnectConfig>(
  "UserQuickConnectConfig",
)({ UserId: S.String, ContactFlowId: S.String }) {}
export class QueueQuickConnectConfig extends S.Class<QueueQuickConnectConfig>(
  "QueueQuickConnectConfig",
)({ QueueId: S.String, ContactFlowId: S.String }) {}
export class PhoneNumberQuickConnectConfig extends S.Class<PhoneNumberQuickConnectConfig>(
  "PhoneNumberQuickConnectConfig",
)({ PhoneNumber: S.String }) {}
export class FlowQuickConnectConfig extends S.Class<FlowQuickConnectConfig>(
  "FlowQuickConnectConfig",
)({ ContactFlowId: S.String }) {}
export class QuickConnectConfig extends S.Class<QuickConnectConfig>(
  "QuickConnectConfig",
)({
  QuickConnectType: S.String,
  UserConfig: S.optional(UserQuickConnectConfig),
  QueueConfig: S.optional(QueueQuickConnectConfig),
  PhoneConfig: S.optional(PhoneNumberQuickConnectConfig),
  FlowConfig: S.optional(FlowQuickConnectConfig),
}) {}
export class UpdateQuickConnectConfigRequest extends S.Class<UpdateQuickConnectConfigRequest>(
  "UpdateQuickConnectConfigRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    QuickConnectId: S.String.pipe(T.HttpLabel("QuickConnectId")),
    QuickConnectConfig: QuickConnectConfig,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/quick-connects/{InstanceId}/{QuickConnectId}/config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateQuickConnectConfigResponse extends S.Class<UpdateQuickConnectConfigResponse>(
  "UpdateQuickConnectConfigResponse",
)({}) {}
export class UpdateQuickConnectNameRequest extends S.Class<UpdateQuickConnectNameRequest>(
  "UpdateQuickConnectNameRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    QuickConnectId: S.String.pipe(T.HttpLabel("QuickConnectId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/quick-connects/{InstanceId}/{QuickConnectId}/name",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateQuickConnectNameResponse extends S.Class<UpdateQuickConnectNameResponse>(
  "UpdateQuickConnectNameResponse",
)({}) {}
export class UpdateRoutingProfileAgentAvailabilityTimerRequest extends S.Class<UpdateRoutingProfileAgentAvailabilityTimerRequest>(
  "UpdateRoutingProfileAgentAvailabilityTimerRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    RoutingProfileId: S.String.pipe(T.HttpLabel("RoutingProfileId")),
    AgentAvailabilityTimer: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/routing-profiles/{InstanceId}/{RoutingProfileId}/agent-availability-timer",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRoutingProfileAgentAvailabilityTimerResponse extends S.Class<UpdateRoutingProfileAgentAvailabilityTimerResponse>(
  "UpdateRoutingProfileAgentAvailabilityTimerResponse",
)({}) {}
export class CrossChannelBehavior extends S.Class<CrossChannelBehavior>(
  "CrossChannelBehavior",
)({ BehaviorType: S.String }) {}
export class MediaConcurrency extends S.Class<MediaConcurrency>(
  "MediaConcurrency",
)({
  Channel: S.String,
  Concurrency: S.Number,
  CrossChannelBehavior: S.optional(CrossChannelBehavior),
}) {}
export const MediaConcurrencies = S.Array(MediaConcurrency);
export class UpdateRoutingProfileConcurrencyRequest extends S.Class<UpdateRoutingProfileConcurrencyRequest>(
  "UpdateRoutingProfileConcurrencyRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    RoutingProfileId: S.String.pipe(T.HttpLabel("RoutingProfileId")),
    MediaConcurrencies: MediaConcurrencies,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/routing-profiles/{InstanceId}/{RoutingProfileId}/concurrency",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRoutingProfileConcurrencyResponse extends S.Class<UpdateRoutingProfileConcurrencyResponse>(
  "UpdateRoutingProfileConcurrencyResponse",
)({}) {}
export class UpdateRoutingProfileDefaultOutboundQueueRequest extends S.Class<UpdateRoutingProfileDefaultOutboundQueueRequest>(
  "UpdateRoutingProfileDefaultOutboundQueueRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    RoutingProfileId: S.String.pipe(T.HttpLabel("RoutingProfileId")),
    DefaultOutboundQueueId: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/routing-profiles/{InstanceId}/{RoutingProfileId}/default-outbound-queue",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRoutingProfileDefaultOutboundQueueResponse extends S.Class<UpdateRoutingProfileDefaultOutboundQueueResponse>(
  "UpdateRoutingProfileDefaultOutboundQueueResponse",
)({}) {}
export class UpdateRoutingProfileNameRequest extends S.Class<UpdateRoutingProfileNameRequest>(
  "UpdateRoutingProfileNameRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    RoutingProfileId: S.String.pipe(T.HttpLabel("RoutingProfileId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/routing-profiles/{InstanceId}/{RoutingProfileId}/name",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRoutingProfileNameResponse extends S.Class<UpdateRoutingProfileNameResponse>(
  "UpdateRoutingProfileNameResponse",
)({}) {}
export class RoutingProfileQueueReference extends S.Class<RoutingProfileQueueReference>(
  "RoutingProfileQueueReference",
)({ QueueId: S.String, Channel: S.String }) {}
export class RoutingProfileQueueConfig extends S.Class<RoutingProfileQueueConfig>(
  "RoutingProfileQueueConfig",
)({
  QueueReference: RoutingProfileQueueReference,
  Priority: S.Number,
  Delay: S.Number,
}) {}
export const RoutingProfileQueueConfigList = S.Array(RoutingProfileQueueConfig);
export class UpdateRoutingProfileQueuesRequest extends S.Class<UpdateRoutingProfileQueuesRequest>(
  "UpdateRoutingProfileQueuesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    RoutingProfileId: S.String.pipe(T.HttpLabel("RoutingProfileId")),
    QueueConfigs: RoutingProfileQueueConfigList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/routing-profiles/{InstanceId}/{RoutingProfileId}/queues",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRoutingProfileQueuesResponse extends S.Class<UpdateRoutingProfileQueuesResponse>(
  "UpdateRoutingProfileQueuesResponse",
)({}) {}
export class TaskActionDefinition extends S.Class<TaskActionDefinition>(
  "TaskActionDefinition",
)({
  Name: S.String,
  Description: S.optional(S.String),
  ContactFlowId: S.String,
  References: S.optional(ContactReferences),
}) {}
export class EventBridgeActionDefinition extends S.Class<EventBridgeActionDefinition>(
  "EventBridgeActionDefinition",
)({ Name: S.String }) {}
export class AssignContactCategoryActionDefinition extends S.Class<AssignContactCategoryActionDefinition>(
  "AssignContactCategoryActionDefinition",
)({}) {}
export const UserTagMap = S.Record({ key: S.String, value: S.String });
export const UserIdList = S.Array(S.String);
export class NotificationRecipientType extends S.Class<NotificationRecipientType>(
  "NotificationRecipientType",
)({ UserTags: S.optional(UserTagMap), UserIds: S.optional(UserIdList) }) {}
export class SendNotificationActionDefinition extends S.Class<SendNotificationActionDefinition>(
  "SendNotificationActionDefinition",
)({
  DeliveryMethod: S.String,
  Subject: S.optional(S.String),
  Content: S.String,
  ContentType: S.String,
  Recipient: NotificationRecipientType,
  Exclusion: S.optional(NotificationRecipientType),
}) {}
export class EmptyFieldValue extends S.Class<EmptyFieldValue>(
  "EmptyFieldValue",
)({}) {}
export class FieldValueUnion extends S.Class<FieldValueUnion>(
  "FieldValueUnion",
)({
  BooleanValue: S.optional(S.Boolean),
  DoubleValue: S.optional(S.Number),
  EmptyValue: S.optional(EmptyFieldValue),
  StringValue: S.optional(S.String),
}) {}
export class FieldValue extends S.Class<FieldValue>("FieldValue")({
  Id: S.String,
  Value: FieldValueUnion,
}) {}
export const FieldValues = S.Array(FieldValue);
export class CreateCaseActionDefinition extends S.Class<CreateCaseActionDefinition>(
  "CreateCaseActionDefinition",
)({ Fields: FieldValues, TemplateId: S.String }) {}
export class UpdateCaseActionDefinition extends S.Class<UpdateCaseActionDefinition>(
  "UpdateCaseActionDefinition",
)({ Fields: FieldValues }) {}
export const SlaFieldValueUnionList = S.Array(FieldValueUnion);
export class CaseSlaConfiguration extends S.Class<CaseSlaConfiguration>(
  "CaseSlaConfiguration",
)({
  Name: S.String,
  Type: S.String,
  FieldId: S.optional(S.String),
  TargetFieldValues: S.optional(SlaFieldValueUnionList),
  TargetSlaMinutes: S.Number,
}) {}
export class AssignSlaActionDefinition extends S.Class<AssignSlaActionDefinition>(
  "AssignSlaActionDefinition",
)({
  SlaAssignmentType: S.String,
  CaseSlaConfiguration: S.optional(CaseSlaConfiguration),
}) {}
export class EndAssociatedTasksActionDefinition extends S.Class<EndAssociatedTasksActionDefinition>(
  "EndAssociatedTasksActionDefinition",
)({}) {}
export class SubmitAutoEvaluationActionDefinition extends S.Class<SubmitAutoEvaluationActionDefinition>(
  "SubmitAutoEvaluationActionDefinition",
)({ EvaluationFormId: S.String }) {}
export class RuleAction extends S.Class<RuleAction>("RuleAction")({
  ActionType: S.String,
  TaskAction: S.optional(TaskActionDefinition),
  EventBridgeAction: S.optional(EventBridgeActionDefinition),
  AssignContactCategoryAction: S.optional(
    AssignContactCategoryActionDefinition,
  ),
  SendNotificationAction: S.optional(SendNotificationActionDefinition),
  CreateCaseAction: S.optional(CreateCaseActionDefinition),
  UpdateCaseAction: S.optional(UpdateCaseActionDefinition),
  AssignSlaAction: S.optional(AssignSlaActionDefinition),
  EndAssociatedTasksAction: S.optional(EndAssociatedTasksActionDefinition),
  SubmitAutoEvaluationAction: S.optional(SubmitAutoEvaluationActionDefinition),
}) {}
export const RuleActions = S.Array(RuleAction);
export class UpdateRuleRequest extends S.Class<UpdateRuleRequest>(
  "UpdateRuleRequest",
)(
  {
    RuleId: S.String.pipe(T.HttpLabel("RuleId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Name: S.String,
    Function: S.String,
    Actions: RuleActions,
    PublishStatus: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/rules/{InstanceId}/{RuleId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRuleResponse extends S.Class<UpdateRuleResponse>(
  "UpdateRuleResponse",
)({}) {}
export const AllowedAccessControlTags = S.Record({
  key: S.String,
  value: S.String,
});
export const ApplicationPermissions = S.Array(S.String);
export class Application extends S.Class<Application>("Application")({
  Namespace: S.optional(S.String),
  ApplicationPermissions: S.optional(ApplicationPermissions),
  Type: S.optional(S.String),
}) {}
export const Applications = S.Array(Application);
export class FlowModule extends S.Class<FlowModule>("FlowModule")({
  Type: S.optional(S.String),
  FlowModuleId: S.optional(S.String),
}) {}
export const AllowedFlowModules = S.Array(FlowModule);
export const PrimaryValueList = S.Array(S.String);
export class PrimaryAttributeValue extends S.Class<PrimaryAttributeValue>(
  "PrimaryAttributeValue",
)({
  AccessType: S.optional(S.String),
  AttributeName: S.optional(S.String),
  Values: S.optional(PrimaryValueList),
}) {}
export const PrimaryAttributeValuesSet = S.Array(PrimaryAttributeValue);
export class PrimaryAttributeAccessControlConfigurationItem extends S.Class<PrimaryAttributeAccessControlConfigurationItem>(
  "PrimaryAttributeAccessControlConfigurationItem",
)({ PrimaryAttributeValues: S.optional(PrimaryAttributeValuesSet) }) {}
export class DataTableAccessControlConfiguration extends S.Class<DataTableAccessControlConfiguration>(
  "DataTableAccessControlConfiguration",
)({
  PrimaryAttributeAccessControlConfiguration: S.optional(
    PrimaryAttributeAccessControlConfigurationItem,
  ),
}) {}
export class GranularAccessControlConfiguration extends S.Class<GranularAccessControlConfiguration>(
  "GranularAccessControlConfiguration",
)({
  DataTableAccessControlConfiguration: S.optional(
    DataTableAccessControlConfiguration,
  ),
}) {}
export class UpdateSecurityProfileRequest extends S.Class<UpdateSecurityProfileRequest>(
  "UpdateSecurityProfileRequest",
)(
  {
    Description: S.optional(S.String),
    Permissions: S.optional(PermissionsList),
    SecurityProfileId: S.String.pipe(T.HttpLabel("SecurityProfileId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    AllowedAccessControlTags: S.optional(AllowedAccessControlTags),
    TagRestrictedResources: S.optional(TagRestrictedResourceList),
    Applications: S.optional(Applications),
    HierarchyRestrictedResources: S.optional(HierarchyRestrictedResourceList),
    AllowedAccessControlHierarchyGroupId: S.optional(S.String),
    AllowedFlowModules: S.optional(AllowedFlowModules),
    GranularAccessControlConfiguration: S.optional(
      GranularAccessControlConfiguration,
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/security-profiles/{InstanceId}/{SecurityProfileId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSecurityProfileResponse extends S.Class<UpdateSecurityProfileResponse>(
  "UpdateSecurityProfileResponse",
)({}) {}
export class TaskTemplateFieldIdentifier extends S.Class<TaskTemplateFieldIdentifier>(
  "TaskTemplateFieldIdentifier",
)({ Name: S.optional(S.String) }) {}
export class RequiredFieldInfo extends S.Class<RequiredFieldInfo>(
  "RequiredFieldInfo",
)({ Id: S.optional(TaskTemplateFieldIdentifier) }) {}
export const RequiredTaskTemplateFields = S.Array(RequiredFieldInfo);
export class ReadOnlyFieldInfo extends S.Class<ReadOnlyFieldInfo>(
  "ReadOnlyFieldInfo",
)({ Id: S.optional(TaskTemplateFieldIdentifier) }) {}
export const ReadOnlyTaskTemplateFields = S.Array(ReadOnlyFieldInfo);
export class InvisibleFieldInfo extends S.Class<InvisibleFieldInfo>(
  "InvisibleFieldInfo",
)({ Id: S.optional(TaskTemplateFieldIdentifier) }) {}
export const InvisibleTaskTemplateFields = S.Array(InvisibleFieldInfo);
export class TaskTemplateConstraints extends S.Class<TaskTemplateConstraints>(
  "TaskTemplateConstraints",
)({
  RequiredFields: S.optional(RequiredTaskTemplateFields),
  ReadOnlyFields: S.optional(ReadOnlyTaskTemplateFields),
  InvisibleFields: S.optional(InvisibleTaskTemplateFields),
}) {}
export class TaskTemplateDefaultFieldValue extends S.Class<TaskTemplateDefaultFieldValue>(
  "TaskTemplateDefaultFieldValue",
)({
  Id: S.optional(TaskTemplateFieldIdentifier),
  DefaultValue: S.optional(S.String),
}) {}
export const TaskTemplateDefaultFieldValueList = S.Array(
  TaskTemplateDefaultFieldValue,
);
export class TaskTemplateDefaults extends S.Class<TaskTemplateDefaults>(
  "TaskTemplateDefaults",
)({ DefaultFieldValues: S.optional(TaskTemplateDefaultFieldValueList) }) {}
export const SingleSelectOptions = S.Array(S.String);
export class TaskTemplateField extends S.Class<TaskTemplateField>(
  "TaskTemplateField",
)({
  Id: TaskTemplateFieldIdentifier,
  Description: S.optional(S.String),
  Type: S.optional(S.String),
  SingleSelectOptions: S.optional(SingleSelectOptions),
}) {}
export const TaskTemplateFields = S.Array(TaskTemplateField);
export class UpdateTaskTemplateRequest extends S.Class<UpdateTaskTemplateRequest>(
  "UpdateTaskTemplateRequest",
)(
  {
    TaskTemplateId: S.String.pipe(T.HttpLabel("TaskTemplateId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ContactFlowId: S.optional(S.String),
    SelfAssignFlowId: S.optional(S.String),
    Constraints: S.optional(TaskTemplateConstraints),
    Defaults: S.optional(TaskTemplateDefaults),
    Status: S.optional(S.String),
    Fields: S.optional(TaskTemplateFields),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/instance/{InstanceId}/task/template/{TaskTemplateId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateUserHierarchyRequest extends S.Class<UpdateUserHierarchyRequest>(
  "UpdateUserHierarchyRequest",
)(
  {
    HierarchyGroupId: S.optional(S.String),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/users/{InstanceId}/{UserId}/hierarchy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateUserHierarchyResponse extends S.Class<UpdateUserHierarchyResponse>(
  "UpdateUserHierarchyResponse",
)({}) {}
export class UpdateUserHierarchyGroupNameRequest extends S.Class<UpdateUserHierarchyGroupNameRequest>(
  "UpdateUserHierarchyGroupNameRequest",
)(
  {
    Name: S.String,
    HierarchyGroupId: S.String.pipe(T.HttpLabel("HierarchyGroupId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/user-hierarchy-groups/{InstanceId}/{HierarchyGroupId}/name",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateUserHierarchyGroupNameResponse extends S.Class<UpdateUserHierarchyGroupNameResponse>(
  "UpdateUserHierarchyGroupNameResponse",
)({}) {}
export class UserIdentityInfo extends S.Class<UserIdentityInfo>(
  "UserIdentityInfo",
)({
  FirstName: S.optional(S.String),
  LastName: S.optional(S.String),
  Email: S.optional(S.String),
  SecondaryEmail: S.optional(S.String),
  Mobile: S.optional(S.String),
}) {}
export class UpdateUserIdentityInfoRequest extends S.Class<UpdateUserIdentityInfoRequest>(
  "UpdateUserIdentityInfoRequest",
)(
  {
    IdentityInfo: UserIdentityInfo,
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/users/{InstanceId}/{UserId}/identity-info",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateUserIdentityInfoResponse extends S.Class<UpdateUserIdentityInfoResponse>(
  "UpdateUserIdentityInfoResponse",
)({}) {}
export class UserPhoneConfig extends S.Class<UserPhoneConfig>(
  "UserPhoneConfig",
)({
  PhoneType: S.String,
  AutoAccept: S.optional(S.Boolean),
  AfterContactWorkTimeLimit: S.optional(S.Number),
  DeskPhoneNumber: S.optional(S.String),
  PersistentConnection: S.optional(S.Boolean),
}) {}
export class UpdateUserPhoneConfigRequest extends S.Class<UpdateUserPhoneConfigRequest>(
  "UpdateUserPhoneConfigRequest",
)(
  {
    PhoneConfig: UserPhoneConfig,
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/users/{InstanceId}/{UserId}/phone-config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateUserPhoneConfigResponse extends S.Class<UpdateUserPhoneConfigResponse>(
  "UpdateUserPhoneConfigResponse",
)({}) {}
export class UserProficiency extends S.Class<UserProficiency>(
  "UserProficiency",
)({ AttributeName: S.String, AttributeValue: S.String, Level: S.Number }) {}
export const UserProficiencyList = S.Array(UserProficiency);
export class UpdateUserProficienciesRequest extends S.Class<UpdateUserProficienciesRequest>(
  "UpdateUserProficienciesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    UserProficiencies: UserProficiencyList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/users/{InstanceId}/{UserId}/proficiencies",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateUserProficienciesResponse extends S.Class<UpdateUserProficienciesResponse>(
  "UpdateUserProficienciesResponse",
)({}) {}
export class UpdateUserRoutingProfileRequest extends S.Class<UpdateUserRoutingProfileRequest>(
  "UpdateUserRoutingProfileRequest",
)(
  {
    RoutingProfileId: S.String,
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/users/{InstanceId}/{UserId}/routing-profile",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateUserRoutingProfileResponse extends S.Class<UpdateUserRoutingProfileResponse>(
  "UpdateUserRoutingProfileResponse",
)({}) {}
export class UpdateUserSecurityProfilesRequest extends S.Class<UpdateUserSecurityProfilesRequest>(
  "UpdateUserSecurityProfilesRequest",
)(
  {
    SecurityProfileIds: SecurityProfileIds,
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/users/{InstanceId}/{UserId}/security-profiles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateUserSecurityProfilesResponse extends S.Class<UpdateUserSecurityProfilesResponse>(
  "UpdateUserSecurityProfilesResponse",
)({}) {}
export const ViewActions = S.Array(S.String);
export class ViewInputContent extends S.Class<ViewInputContent>(
  "ViewInputContent",
)({ Template: S.optional(S.String), Actions: S.optional(ViewActions) }) {}
export class UpdateViewContentRequest extends S.Class<UpdateViewContentRequest>(
  "UpdateViewContentRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ViewId: S.String.pipe(T.HttpLabel("ViewId")),
    Status: S.String,
    Content: ViewInputContent,
  },
  T.all(
    T.Http({ method: "POST", uri: "/views/{InstanceId}/{ViewId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateViewMetadataRequest extends S.Class<UpdateViewMetadataRequest>(
  "UpdateViewMetadataRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ViewId: S.String.pipe(T.HttpLabel("ViewId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/views/{InstanceId}/{ViewId}/metadata" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateViewMetadataResponse extends S.Class<UpdateViewMetadataResponse>(
  "UpdateViewMetadataResponse",
)({}) {}
export class UpdateWorkspaceMetadataRequest extends S.Class<UpdateWorkspaceMetadataRequest>(
  "UpdateWorkspaceMetadataRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    WorkspaceId: S.String.pipe(T.HttpLabel("WorkspaceId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Title: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/workspaces/{InstanceId}/{WorkspaceId}/metadata",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWorkspaceMetadataResponse extends S.Class<UpdateWorkspaceMetadataResponse>(
  "UpdateWorkspaceMetadataResponse",
)({}) {}
export class UpdateWorkspacePageRequest extends S.Class<UpdateWorkspacePageRequest>(
  "UpdateWorkspacePageRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    WorkspaceId: S.String.pipe(T.HttpLabel("WorkspaceId")),
    Page: S.String.pipe(T.HttpLabel("Page")),
    NewPage: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    Slug: S.optional(S.String),
    InputData: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/workspaces/{InstanceId}/{WorkspaceId}/pages/{Page}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWorkspacePageResponse extends S.Class<UpdateWorkspacePageResponse>(
  "UpdateWorkspacePageResponse",
)({}) {}
export class PaletteHeader extends S.Class<PaletteHeader>("PaletteHeader")({
  Background: S.optional(S.String),
  Text: S.optional(S.String),
  TextHover: S.optional(S.String),
  InvertActionsColors: S.optional(S.Boolean),
}) {}
export class PaletteNavigation extends S.Class<PaletteNavigation>(
  "PaletteNavigation",
)({
  Background: S.optional(S.String),
  TextBackgroundHover: S.optional(S.String),
  TextBackgroundActive: S.optional(S.String),
  Text: S.optional(S.String),
  TextHover: S.optional(S.String),
  TextActive: S.optional(S.String),
  InvertActionsColors: S.optional(S.Boolean),
}) {}
export class PaletteCanvas extends S.Class<PaletteCanvas>("PaletteCanvas")({
  ContainerBackground: S.optional(S.String),
  PageBackground: S.optional(S.String),
  ActiveBackground: S.optional(S.String),
}) {}
export class PalettePrimary extends S.Class<PalettePrimary>("PalettePrimary")({
  Default: S.optional(S.String),
  Active: S.optional(S.String),
  ContrastText: S.optional(S.String),
}) {}
export class WorkspaceThemePalette extends S.Class<WorkspaceThemePalette>(
  "WorkspaceThemePalette",
)({
  Header: S.optional(PaletteHeader),
  Navigation: S.optional(PaletteNavigation),
  Canvas: S.optional(PaletteCanvas),
  Primary: S.optional(PalettePrimary),
}) {}
export class ImagesLogo extends S.Class<ImagesLogo>("ImagesLogo")({
  Default: S.optional(S.String),
  Favicon: S.optional(S.String),
}) {}
export class WorkspaceThemeImages extends S.Class<WorkspaceThemeImages>(
  "WorkspaceThemeImages",
)({ Logo: S.optional(ImagesLogo) }) {}
export class FontFamily extends S.Class<FontFamily>("FontFamily")({
  Default: S.optional(S.String),
}) {}
export class WorkspaceThemeTypography extends S.Class<WorkspaceThemeTypography>(
  "WorkspaceThemeTypography",
)({ FontFamily: S.optional(FontFamily) }) {}
export class WorkspaceThemeConfig extends S.Class<WorkspaceThemeConfig>(
  "WorkspaceThemeConfig",
)({
  Palette: S.optional(WorkspaceThemePalette),
  Images: S.optional(WorkspaceThemeImages),
  Typography: S.optional(WorkspaceThemeTypography),
}) {}
export class WorkspaceTheme extends S.Class<WorkspaceTheme>("WorkspaceTheme")({
  Light: S.optional(WorkspaceThemeConfig),
  Dark: S.optional(WorkspaceThemeConfig),
}) {}
export class UpdateWorkspaceThemeRequest extends S.Class<UpdateWorkspaceThemeRequest>(
  "UpdateWorkspaceThemeRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    WorkspaceId: S.String.pipe(T.HttpLabel("WorkspaceId")),
    Theme: S.optional(WorkspaceTheme),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/workspaces/{InstanceId}/{WorkspaceId}/theme",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWorkspaceThemeResponse extends S.Class<UpdateWorkspaceThemeResponse>(
  "UpdateWorkspaceThemeResponse",
)({}) {}
export class UpdateWorkspaceVisibilityRequest extends S.Class<UpdateWorkspaceVisibilityRequest>(
  "UpdateWorkspaceVisibilityRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    WorkspaceId: S.String.pipe(T.HttpLabel("WorkspaceId")),
    Visibility: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/workspaces/{InstanceId}/{WorkspaceId}/visibility",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWorkspaceVisibilityResponse extends S.Class<UpdateWorkspaceVisibilityResponse>(
  "UpdateWorkspaceVisibilityResponse",
)({}) {}
export const AttributeNameList = S.Array(S.String);
export const Queues = S.Array(S.String);
export const Channels = S.Array(S.String);
export const RoutingProfiles = S.Array(S.String);
export const RoutingExpressions = S.Array(S.String);
export const AgentStatuses = S.Array(S.String);
export const Subtypes = S.Array(S.String);
export const ValidationTestTypes = S.Array(S.String);
export const AgentsMinOneMaxHundred = S.Array(S.String);
export const UserDataHierarchyGroups = S.Array(S.String);
export const FilterValueList = S.Array(S.String);
export type AgentStatusSearchConditionList = AgentStatusSearchCriteria[];
export const AgentStatusSearchConditionList = S.Array(
  S.suspend(
    (): S.Schema<AgentStatusSearchCriteria, any> => AgentStatusSearchCriteria,
  ),
) as any as S.Schema<AgentStatusSearchConditionList>;
export type EvaluationSearchConditionList = EvaluationSearchCriteria[];
export const EvaluationSearchConditionList = S.Array(
  S.suspend(
    (): S.Schema<EvaluationSearchCriteria, any> => EvaluationSearchCriteria,
  ),
) as any as S.Schema<EvaluationSearchConditionList>;
export type ContactFlowModuleSearchConditionList =
  ContactFlowModuleSearchCriteria[];
export const ContactFlowModuleSearchConditionList = S.Array(
  S.suspend(
    (): S.Schema<ContactFlowModuleSearchCriteria, any> =>
      ContactFlowModuleSearchCriteria,
  ),
) as any as S.Schema<ContactFlowModuleSearchConditionList>;
export type ContactFlowSearchConditionList = ContactFlowSearchCriteria[];
export const ContactFlowSearchConditionList = S.Array(
  S.suspend(
    (): S.Schema<ContactFlowSearchCriteria, any> => ContactFlowSearchCriteria,
  ),
) as any as S.Schema<ContactFlowSearchConditionList>;
export const AgentResourceIdList = S.Array(S.String);
export const ChannelList = S.Array(S.String);
export const InitiationMethodList = S.Array(S.String);
export const QueueIdList = S.Array(S.String);
export const ActiveRegionList = S.Array(S.String);
export type DataTableSearchConditionList = DataTableSearchCriteria[];
export const DataTableSearchConditionList = S.Array(
  S.suspend(
    (): S.Schema<DataTableSearchCriteria, any> => DataTableSearchCriteria,
  ),
) as any as S.Schema<DataTableSearchConditionList>;
export type EmailAddressSearchConditionList = EmailAddressSearchCriteria[];
export const EmailAddressSearchConditionList = S.Array(
  S.suspend(
    (): S.Schema<EmailAddressSearchCriteria, any> => EmailAddressSearchCriteria,
  ),
) as any as S.Schema<EmailAddressSearchConditionList>;
export type EvaluationFormSearchConditionList = EvaluationFormSearchCriteria[];
export const EvaluationFormSearchConditionList = S.Array(
  S.suspend(
    (): S.Schema<EvaluationFormSearchCriteria, any> =>
      EvaluationFormSearchCriteria,
  ),
) as any as S.Schema<EvaluationFormSearchConditionList>;
export type HoursOfOperationOverrideSearchConditionList =
  HoursOfOperationOverrideSearchCriteria[];
export const HoursOfOperationOverrideSearchConditionList = S.Array(
  S.suspend(
    (): S.Schema<HoursOfOperationOverrideSearchCriteria, any> =>
      HoursOfOperationOverrideSearchCriteria,
  ),
) as any as S.Schema<HoursOfOperationOverrideSearchConditionList>;
export type HoursOfOperationSearchConditionList =
  HoursOfOperationSearchCriteria[];
export const HoursOfOperationSearchConditionList = S.Array(
  S.suspend(
    (): S.Schema<HoursOfOperationSearchCriteria, any> =>
      HoursOfOperationSearchCriteria,
  ),
) as any as S.Schema<HoursOfOperationSearchConditionList>;
export type PredefinedAttributeSearchConditionList =
  PredefinedAttributeSearchCriteria[];
export const PredefinedAttributeSearchConditionList = S.Array(
  S.suspend(
    (): S.Schema<PredefinedAttributeSearchCriteria, any> =>
      PredefinedAttributeSearchCriteria,
  ),
) as any as S.Schema<PredefinedAttributeSearchConditionList>;
export type PromptSearchConditionList = PromptSearchCriteria[];
export const PromptSearchConditionList = S.Array(
  S.suspend((): S.Schema<PromptSearchCriteria, any> => PromptSearchCriteria),
) as any as S.Schema<PromptSearchConditionList>;
export type QueueSearchConditionList = QueueSearchCriteria[];
export const QueueSearchConditionList = S.Array(
  S.suspend((): S.Schema<QueueSearchCriteria, any> => QueueSearchCriteria),
) as any as S.Schema<QueueSearchConditionList>;
export type QuickConnectSearchConditionList = QuickConnectSearchCriteria[];
export const QuickConnectSearchConditionList = S.Array(
  S.suspend(
    (): S.Schema<QuickConnectSearchCriteria, any> => QuickConnectSearchCriteria,
  ),
) as any as S.Schema<QuickConnectSearchConditionList>;
export type RoutingProfileSearchConditionList = RoutingProfileSearchCriteria[];
export const RoutingProfileSearchConditionList = S.Array(
  S.suspend(
    (): S.Schema<RoutingProfileSearchCriteria, any> =>
      RoutingProfileSearchCriteria,
  ),
) as any as S.Schema<RoutingProfileSearchConditionList>;
export type SecurityProfileSearchConditionList =
  SecurityProfileSearchCriteria[];
export const SecurityProfileSearchConditionList = S.Array(
  S.suspend(
    (): S.Schema<SecurityProfileSearchCriteria, any> =>
      SecurityProfileSearchCriteria,
  ),
) as any as S.Schema<SecurityProfileSearchConditionList>;
export type UserHierarchyGroupSearchConditionList =
  UserHierarchyGroupSearchCriteria[];
export const UserHierarchyGroupSearchConditionList = S.Array(
  S.suspend(
    (): S.Schema<UserHierarchyGroupSearchCriteria, any> =>
      UserHierarchyGroupSearchCriteria,
  ),
) as any as S.Schema<UserHierarchyGroupSearchConditionList>;
export type UserSearchConditionList = UserSearchCriteria[];
export const UserSearchConditionList = S.Array(
  S.suspend((): S.Schema<UserSearchCriteria, any> => UserSearchCriteria),
) as any as S.Schema<UserSearchConditionList>;
export type ViewSearchConditionList = ViewSearchCriteria[];
export const ViewSearchConditionList = S.Array(
  S.suspend((): S.Schema<ViewSearchCriteria, any> => ViewSearchCriteria),
) as any as S.Schema<ViewSearchConditionList>;
export type WorkspaceAssociationSearchConditionList =
  WorkspaceAssociationSearchCriteria[];
export const WorkspaceAssociationSearchConditionList = S.Array(
  S.suspend(
    (): S.Schema<WorkspaceAssociationSearchCriteria, any> =>
      WorkspaceAssociationSearchCriteria,
  ),
) as any as S.Schema<WorkspaceAssociationSearchConditionList>;
export type WorkspaceSearchConditionList = WorkspaceSearchCriteria[];
export const WorkspaceSearchConditionList = S.Array(
  S.suspend(
    (): S.Schema<WorkspaceSearchCriteria, any> => WorkspaceSearchCriteria,
  ),
) as any as S.Schema<WorkspaceSearchConditionList>;
export class RoutingProfileManualAssignmentQueueConfig extends S.Class<RoutingProfileManualAssignmentQueueConfig>(
  "RoutingProfileManualAssignmentQueueConfig",
)({ QueueReference: RoutingProfileQueueReference }) {}
export const RoutingProfileManualAssignmentQueueConfigList = S.Array(
  RoutingProfileManualAssignmentQueueConfig,
);
export class DataTableDeleteValueIdentifier extends S.Class<DataTableDeleteValueIdentifier>(
  "DataTableDeleteValueIdentifier",
)({
  PrimaryValues: S.optional(PrimaryValuesSet),
  AttributeName: S.String,
  LockVersion: DataTableLockVersion,
}) {}
export const DataTableDeleteValueIdentifierList = S.Array(
  DataTableDeleteValueIdentifier,
);
export class DataTableValueIdentifier extends S.Class<DataTableValueIdentifier>(
  "DataTableValueIdentifier",
)({ PrimaryValues: S.optional(PrimaryValuesSet), AttributeName: S.String }) {}
export const DataTableValueIdentifierList = S.Array(DataTableValueIdentifier);
export class UserInfo extends S.Class<UserInfo>("UserInfo")({
  UserId: S.optional(S.String),
}) {}
export class ExternalInvocationConfiguration extends S.Class<ExternalInvocationConfiguration>(
  "ExternalInvocationConfiguration",
)({ Enabled: S.optional(S.Boolean) }) {}
export class ContactConfiguration extends S.Class<ContactConfiguration>(
  "ContactConfiguration",
)({
  ContactId: S.String,
  ParticipantRole: S.optional(S.String),
  IncludeRawMessage: S.optional(S.Boolean),
}) {}
export class RuleTriggerEventSource extends S.Class<RuleTriggerEventSource>(
  "RuleTriggerEventSource",
)({
  EventSourceName: S.String,
  IntegrationAssociationId: S.optional(S.String),
}) {}
export const AliasConfigurationList = S.Array(AliasConfiguration);
export const RoutingProfileQueueReferenceList = S.Array(
  RoutingProfileQueueReference,
);
export class UserProficiencyDisassociate extends S.Class<UserProficiencyDisassociate>(
  "UserProficiencyDisassociate",
)({ AttributeName: S.String, AttributeValue: S.String }) {}
export const UserProficiencyDisassociateList = S.Array(
  UserProficiencyDisassociate,
);
export class DataTableValueEvaluationSet extends S.Class<DataTableValueEvaluationSet>(
  "DataTableValueEvaluationSet",
)({
  PrimaryValues: S.optional(PrimaryValuesSet),
  AttributeNames: AttributeNameList,
}) {}
export const DataTableValueEvaluationSetList = S.Array(
  DataTableValueEvaluationSet,
);
export class ContactMetricInfo extends S.Class<ContactMetricInfo>(
  "ContactMetricInfo",
)({ Name: S.String }) {}
export const ContactMetrics = S.Array(ContactMetricInfo);
export class Filters extends S.Class<Filters>("Filters")({
  Queues: S.optional(Queues),
  Channels: S.optional(Channels),
  RoutingProfiles: S.optional(RoutingProfiles),
  RoutingStepExpressions: S.optional(RoutingExpressions),
  AgentStatuses: S.optional(AgentStatuses),
  Subtypes: S.optional(Subtypes),
  ValidationTestTypes: S.optional(ValidationTestTypes),
}) {}
export class CurrentMetric extends S.Class<CurrentMetric>("CurrentMetric")({
  Name: S.optional(S.String),
  MetricId: S.optional(S.String),
  Unit: S.optional(S.String),
}) {}
export const CurrentMetrics = S.Array(CurrentMetric);
export class CurrentMetricSortCriteria extends S.Class<CurrentMetricSortCriteria>(
  "CurrentMetricSortCriteria",
)({ SortByMetric: S.optional(S.String), SortOrder: S.optional(S.String) }) {}
export const CurrentMetricSortCriteriaMaxOne = S.Array(
  CurrentMetricSortCriteria,
);
export class IntervalDetails extends S.Class<IntervalDetails>(
  "IntervalDetails",
)({ TimeZone: S.optional(S.String), IntervalPeriod: S.optional(S.String) }) {}
export const OriginsList = S.Array(S.String);
export class DataTableAttribute extends S.Class<DataTableAttribute>(
  "DataTableAttribute",
)({
  AttributeId: S.optional(S.String),
  Name: S.String,
  ValueType: S.String,
  Description: S.optional(S.String),
  DataTableId: S.optional(S.String),
  DataTableArn: S.optional(S.String),
  Primary: S.optional(S.Boolean),
  Version: S.optional(S.String),
  LockVersion: S.optional(DataTableLockVersion),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
  Validation: S.optional(Validation),
}) {}
export const AttributeList = S.Array(DataTableAttribute);
export const SecurityProfiles100 = S.Array(SecurityProfileItem);
export class HoursOfOperationOverride extends S.Class<HoursOfOperationOverride>(
  "HoursOfOperationOverride",
)({
  HoursOfOperationOverrideId: S.optional(S.String),
  HoursOfOperationId: S.optional(S.String),
  HoursOfOperationArn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Config: S.optional(HoursOfOperationOverrideConfigList),
  EffectiveFrom: S.optional(S.String),
  EffectiveTill: S.optional(S.String),
}) {}
export const HoursOfOperationOverrideList = S.Array(HoursOfOperationOverride);
export class Attribute extends S.Class<Attribute>("Attribute")({
  AttributeType: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const AttributesList = S.Array(Attribute);
export const InstanceStorageConfigs = S.Array(InstanceStorageConfig);
export const FunctionArnsList = S.Array(S.String);
export const LexBotsList = S.Array(LexBot);
export class TagCondition extends S.Class<TagCondition>("TagCondition")({
  TagKey: S.optional(S.String),
  TagValue: S.optional(S.String),
}) {}
export const TagAndConditionList = S.Array(TagCondition);
export class CommonAttributeAndCondition extends S.Class<CommonAttributeAndCondition>(
  "CommonAttributeAndCondition",
)({ TagConditions: S.optional(TagAndConditionList) }) {}
export const CommonAttributeOrConditionList = S.Array(
  CommonAttributeAndCondition,
);
export class ControlPlaneAttributeFilter extends S.Class<ControlPlaneAttributeFilter>(
  "ControlPlaneAttributeFilter",
)({
  OrConditions: S.optional(CommonAttributeOrConditionList),
  AndCondition: S.optional(CommonAttributeAndCondition),
  TagCondition: S.optional(TagCondition),
}) {}
export class EvaluationSearchFilter extends S.Class<EvaluationSearchFilter>(
  "EvaluationSearchFilter",
)({ AttributeFilter: S.optional(ControlPlaneAttributeFilter) }) {}
export class StringCondition extends S.Class<StringCondition>(
  "StringCondition",
)({
  FieldName: S.optional(S.String),
  Value: S.optional(S.String),
  ComparisonType: S.optional(S.String),
}) {}
export class ContactFlowModuleSearchCriteria extends S.Class<ContactFlowModuleSearchCriteria>(
  "ContactFlowModuleSearchCriteria",
)({
  OrConditions: S.optional(
    S.suspend(() => ContactFlowModuleSearchConditionList),
  ),
  AndConditions: S.optional(
    S.suspend(() => ContactFlowModuleSearchConditionList),
  ),
  StringCondition: S.optional(StringCondition),
  StateCondition: S.optional(S.String),
  StatusCondition: S.optional(S.String),
}) {}
export class ContactFlowSearchCriteria extends S.Class<ContactFlowSearchCriteria>(
  "ContactFlowSearchCriteria",
)({
  OrConditions: S.optional(S.suspend(() => ContactFlowSearchConditionList)),
  AndConditions: S.optional(S.suspend(() => ContactFlowSearchConditionList)),
  StringCondition: S.optional(StringCondition),
  TypeCondition: S.optional(S.String),
  StateCondition: S.optional(S.String),
  StatusCondition: S.optional(S.String),
}) {}
export class SearchContactsTimeRange extends S.Class<SearchContactsTimeRange>(
  "SearchContactsTimeRange",
)({
  Type: S.String,
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class Sort extends S.Class<Sort>("Sort")({
  FieldName: S.String,
  Order: S.String,
}) {}
export class DataTableSearchFilter extends S.Class<DataTableSearchFilter>(
  "DataTableSearchFilter",
)({ AttributeFilter: S.optional(ControlPlaneAttributeFilter) }) {}
export class DataTableSearchCriteria extends S.Class<DataTableSearchCriteria>(
  "DataTableSearchCriteria",
)({
  OrConditions: S.optional(S.suspend(() => DataTableSearchConditionList)),
  AndConditions: S.optional(S.suspend(() => DataTableSearchConditionList)),
  StringCondition: S.optional(StringCondition),
}) {}
export class EmailAddressSearchCriteria extends S.Class<EmailAddressSearchCriteria>(
  "EmailAddressSearchCriteria",
)({
  OrConditions: S.optional(S.suspend(() => EmailAddressSearchConditionList)),
  AndConditions: S.optional(S.suspend(() => EmailAddressSearchConditionList)),
  StringCondition: S.optional(StringCondition),
}) {}
export const TagOrConditionList = S.Array(TagAndConditionList);
export class ControlPlaneTagFilter extends S.Class<ControlPlaneTagFilter>(
  "ControlPlaneTagFilter",
)({
  OrConditions: S.optional(TagOrConditionList),
  AndConditions: S.optional(TagAndConditionList),
  TagCondition: S.optional(TagCondition),
}) {}
export class EmailAddressSearchFilter extends S.Class<EmailAddressSearchFilter>(
  "EmailAddressSearchFilter",
)({ TagFilter: S.optional(ControlPlaneTagFilter) }) {}
export class NumberCondition extends S.Class<NumberCondition>(
  "NumberCondition",
)({
  FieldName: S.optional(S.String),
  MinValue: S.optional(S.Number),
  MaxValue: S.optional(S.Number),
  ComparisonType: S.optional(S.String),
}) {}
export class BooleanCondition extends S.Class<BooleanCondition>(
  "BooleanCondition",
)({ FieldName: S.optional(S.String), ComparisonType: S.optional(S.String) }) {}
export class DateTimeCondition extends S.Class<DateTimeCondition>(
  "DateTimeCondition",
)({
  FieldName: S.optional(S.String),
  MinValue: S.optional(S.String),
  MaxValue: S.optional(S.String),
  ComparisonType: S.optional(S.String),
}) {}
export class EvaluationFormSearchCriteria extends S.Class<EvaluationFormSearchCriteria>(
  "EvaluationFormSearchCriteria",
)({
  OrConditions: S.optional(S.suspend(() => EvaluationFormSearchConditionList)),
  AndConditions: S.optional(S.suspend(() => EvaluationFormSearchConditionList)),
  StringCondition: S.optional(StringCondition),
  NumberCondition: S.optional(NumberCondition),
  BooleanCondition: S.optional(BooleanCondition),
  DateTimeCondition: S.optional(DateTimeCondition),
}) {}
export class EvaluationFormSearchFilter extends S.Class<EvaluationFormSearchFilter>(
  "EvaluationFormSearchFilter",
)({ AttributeFilter: S.optional(ControlPlaneAttributeFilter) }) {}
export class HoursOfOperationSearchFilter extends S.Class<HoursOfOperationSearchFilter>(
  "HoursOfOperationSearchFilter",
)({ TagFilter: S.optional(ControlPlaneTagFilter) }) {}
export class HoursOfOperationSearchCriteria extends S.Class<HoursOfOperationSearchCriteria>(
  "HoursOfOperationSearchCriteria",
)({
  OrConditions: S.optional(
    S.suspend(() => HoursOfOperationSearchConditionList),
  ),
  AndConditions: S.optional(
    S.suspend(() => HoursOfOperationSearchConditionList),
  ),
  StringCondition: S.optional(StringCondition),
}) {}
export class PredefinedAttributeSearchCriteria extends S.Class<PredefinedAttributeSearchCriteria>(
  "PredefinedAttributeSearchCriteria",
)({
  OrConditions: S.optional(
    S.suspend(() => PredefinedAttributeSearchConditionList),
  ),
  AndConditions: S.optional(
    S.suspend(() => PredefinedAttributeSearchConditionList),
  ),
  StringCondition: S.optional(StringCondition),
}) {}
export class PromptSearchFilter extends S.Class<PromptSearchFilter>(
  "PromptSearchFilter",
)({ TagFilter: S.optional(ControlPlaneTagFilter) }) {}
export class PromptSearchCriteria extends S.Class<PromptSearchCriteria>(
  "PromptSearchCriteria",
)({
  OrConditions: S.optional(S.suspend(() => PromptSearchConditionList)),
  AndConditions: S.optional(S.suspend(() => PromptSearchConditionList)),
  StringCondition: S.optional(StringCondition),
}) {}
export class QueueSearchFilter extends S.Class<QueueSearchFilter>(
  "QueueSearchFilter",
)({ TagFilter: S.optional(ControlPlaneTagFilter) }) {}
export class QueueSearchCriteria extends S.Class<QueueSearchCriteria>(
  "QueueSearchCriteria",
)({
  OrConditions: S.optional(S.suspend(() => QueueSearchConditionList)),
  AndConditions: S.optional(S.suspend(() => QueueSearchConditionList)),
  StringCondition: S.optional(StringCondition),
  QueueTypeCondition: S.optional(S.String),
}) {}
export class QuickConnectSearchFilter extends S.Class<QuickConnectSearchFilter>(
  "QuickConnectSearchFilter",
)({ TagFilter: S.optional(ControlPlaneTagFilter) }) {}
export class QuickConnectSearchCriteria extends S.Class<QuickConnectSearchCriteria>(
  "QuickConnectSearchCriteria",
)({
  OrConditions: S.optional(S.suspend(() => QuickConnectSearchConditionList)),
  AndConditions: S.optional(S.suspend(() => QuickConnectSearchConditionList)),
  StringCondition: S.optional(StringCondition),
}) {}
export class RoutingProfileSearchFilter extends S.Class<RoutingProfileSearchFilter>(
  "RoutingProfileSearchFilter",
)({ TagFilter: S.optional(ControlPlaneTagFilter) }) {}
export class RoutingProfileSearchCriteria extends S.Class<RoutingProfileSearchCriteria>(
  "RoutingProfileSearchCriteria",
)({
  OrConditions: S.optional(S.suspend(() => RoutingProfileSearchConditionList)),
  AndConditions: S.optional(S.suspend(() => RoutingProfileSearchConditionList)),
  StringCondition: S.optional(StringCondition),
}) {}
export class SecurityProfileSearchCriteria extends S.Class<SecurityProfileSearchCriteria>(
  "SecurityProfileSearchCriteria",
)({
  OrConditions: S.optional(S.suspend(() => SecurityProfileSearchConditionList)),
  AndConditions: S.optional(
    S.suspend(() => SecurityProfileSearchConditionList),
  ),
  StringCondition: S.optional(StringCondition),
}) {}
export class SecurityProfilesSearchFilter extends S.Class<SecurityProfilesSearchFilter>(
  "SecurityProfilesSearchFilter",
)({ TagFilter: S.optional(ControlPlaneTagFilter) }) {}
export class UserHierarchyGroupSearchFilter extends S.Class<UserHierarchyGroupSearchFilter>(
  "UserHierarchyGroupSearchFilter",
)({ AttributeFilter: S.optional(ControlPlaneAttributeFilter) }) {}
export class UserHierarchyGroupSearchCriteria extends S.Class<UserHierarchyGroupSearchCriteria>(
  "UserHierarchyGroupSearchCriteria",
)({
  OrConditions: S.optional(
    S.suspend(() => UserHierarchyGroupSearchConditionList),
  ),
  AndConditions: S.optional(
    S.suspend(() => UserHierarchyGroupSearchConditionList),
  ),
  StringCondition: S.optional(StringCondition),
}) {}
export class ViewSearchFilter extends S.Class<ViewSearchFilter>(
  "ViewSearchFilter",
)({ AttributeFilter: S.optional(ControlPlaneAttributeFilter) }) {}
export class ViewSearchCriteria extends S.Class<ViewSearchCriteria>(
  "ViewSearchCriteria",
)({
  OrConditions: S.optional(S.suspend(() => ViewSearchConditionList)),
  AndConditions: S.optional(S.suspend(() => ViewSearchConditionList)),
  StringCondition: S.optional(StringCondition),
  ViewTypeCondition: S.optional(S.String),
  ViewStatusCondition: S.optional(S.String),
}) {}
export class WorkspaceAssociationSearchFilter extends S.Class<WorkspaceAssociationSearchFilter>(
  "WorkspaceAssociationSearchFilter",
)({ AttributeFilter: S.optional(ControlPlaneAttributeFilter) }) {}
export class WorkspaceAssociationSearchCriteria extends S.Class<WorkspaceAssociationSearchCriteria>(
  "WorkspaceAssociationSearchCriteria",
)({
  OrConditions: S.optional(
    S.suspend(() => WorkspaceAssociationSearchConditionList),
  ),
  AndConditions: S.optional(
    S.suspend(() => WorkspaceAssociationSearchConditionList),
  ),
  StringCondition: S.optional(StringCondition),
}) {}
export class WorkspaceSearchFilter extends S.Class<WorkspaceSearchFilter>(
  "WorkspaceSearchFilter",
)({ AttributeFilter: S.optional(ControlPlaneAttributeFilter) }) {}
export class WorkspaceSearchCriteria extends S.Class<WorkspaceSearchCriteria>(
  "WorkspaceSearchCriteria",
)({
  OrConditions: S.optional(S.suspend(() => WorkspaceSearchConditionList)),
  AndConditions: S.optional(S.suspend(() => WorkspaceSearchConditionList)),
  StringCondition: S.optional(StringCondition),
}) {}
export class ChatEvent extends S.Class<ChatEvent>("ChatEvent")({
  Type: S.String,
  ContentType: S.optional(S.String),
  Content: S.optional(S.String),
}) {}
export class ParticipantDetails extends S.Class<ParticipantDetails>(
  "ParticipantDetails",
)({ DisplayName: S.String }) {}
export class ChatStreamingConfiguration extends S.Class<ChatStreamingConfiguration>(
  "ChatStreamingConfiguration",
)({ StreamingEndpointArn: S.String }) {}
export class NewSessionDetails extends S.Class<NewSessionDetails>(
  "NewSessionDetails",
)({
  SupportedMessagingContentTypes: S.optional(SupportedMessagingContentTypes),
  ParticipantDetails: S.optional(ParticipantDetails),
  Attributes: S.optional(Attributes),
  StreamingConfiguration: S.optional(ChatStreamingConfiguration),
}) {}
export class SourceCampaign extends S.Class<SourceCampaign>("SourceCampaign")({
  CampaignId: S.optional(S.String),
  OutboundRequestId: S.optional(S.String),
}) {}
export const CreatedByInfo = S.Union(
  S.Struct({ ConnectUserArn: S.String }),
  S.Struct({ AWSIdentityArn: S.String }),
);
export class ParticipantConfiguration extends S.Class<ParticipantConfiguration>(
  "ParticipantConfiguration",
)({ ResponseMode: S.optional(S.String) }) {}
export class ChatMessage extends S.Class<ChatMessage>("ChatMessage")({
  ContentType: S.String,
  Content: S.String,
}) {}
export class PersistentChat extends S.Class<PersistentChat>("PersistentChat")({
  RehydrationType: S.optional(S.String),
  SourceContactId: S.optional(S.String),
}) {}
export class AutoEvaluationConfiguration extends S.Class<AutoEvaluationConfiguration>(
  "AutoEvaluationConfiguration",
)({ Enabled: S.Boolean }) {}
export class VoiceRecordingConfiguration extends S.Class<VoiceRecordingConfiguration>(
  "VoiceRecordingConfiguration",
)({
  VoiceRecordingTrack: S.optional(S.String),
  IvrRecordingTrack: S.optional(S.String),
}) {}
export class InboundAdditionalRecipients extends S.Class<InboundAdditionalRecipients>(
  "InboundAdditionalRecipients",
)({
  ToAddresses: S.optional(EmailAddressRecipientList),
  CcAddresses: S.optional(EmailAddressRecipientList),
}) {}
export class EmailAttachment extends S.Class<EmailAttachment>(
  "EmailAttachment",
)({ FileName: S.String, S3Url: S.String }) {}
export const EmailAttachments = S.Array(EmailAttachment);
export class Endpoint extends S.Class<Endpoint>("Endpoint")({
  Type: S.optional(S.String),
  Address: S.optional(S.String),
}) {}
export class AnswerMachineDetectionConfig extends S.Class<AnswerMachineDetectionConfig>(
  "AnswerMachineDetectionConfig",
)({
  EnableAnswerMachineDetection: S.optional(S.Boolean),
  AwaitAnswerMachinePrompt: S.optional(S.Boolean),
}) {}
export class ParticipantCapabilities extends S.Class<ParticipantCapabilities>(
  "ParticipantCapabilities",
)({ Video: S.optional(S.String), ScreenShare: S.optional(S.String) }) {}
export class AllowedCapabilities extends S.Class<AllowedCapabilities>(
  "AllowedCapabilities",
)({
  Customer: S.optional(ParticipantCapabilities),
  Agent: S.optional(ParticipantCapabilities),
}) {}
export class DisconnectReason extends S.Class<DisconnectReason>(
  "DisconnectReason",
)({ Code: S.optional(S.String) }) {}
export const ContactTagMap = S.Record({ key: S.String, value: S.String });
export class QueueInfoInput extends S.Class<QueueInfoInput>("QueueInfoInput")({
  Id: S.optional(S.String),
}) {}
export class Distribution extends S.Class<Distribution>("Distribution")({
  Region: S.String,
  Percentage: S.Number,
}) {}
export const DistributionList = S.Array(Distribution);
export class AgentConfig extends S.Class<AgentConfig>("AgentConfig")({
  Distributions: DistributionList,
}) {}
export type SegmentAttributeValueList = SegmentAttributeValue[];
export const SegmentAttributeValueList = S.Array(
  S.suspend((): S.Schema<SegmentAttributeValue, any> => SegmentAttributeValue),
) as any as S.Schema<SegmentAttributeValueList>;
export const ContactStates = S.Array(S.String);
export const MetricFilterValueList = S.Array(S.String);
export const SearchTextList = S.Array(S.String);
export const HierarchyGroupIdList = S.Array(S.String);
export class ActivateEvaluationFormResponse extends S.Class<ActivateEvaluationFormResponse>(
  "ActivateEvaluationFormResponse",
)({
  EvaluationFormId: S.String,
  EvaluationFormArn: S.String,
  EvaluationFormVersion: S.Number,
}) {}
export class AssociateAnalyticsDataSetResponse extends S.Class<AssociateAnalyticsDataSetResponse>(
  "AssociateAnalyticsDataSetResponse",
)({
  DataSetId: S.optional(S.String),
  TargetAccountId: S.optional(S.String),
  ResourceShareId: S.optional(S.String),
  ResourceShareArn: S.optional(S.String),
}) {}
export class AssociateBotRequest extends S.Class<AssociateBotRequest>(
  "AssociateBotRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    LexBot: S.optional(LexBot),
    LexV2Bot: S.optional(LexV2Bot),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/instance/{InstanceId}/bot" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateBotResponse extends S.Class<AssociateBotResponse>(
  "AssociateBotResponse",
)({}) {}
export class AssociateEmailAddressAliasRequest extends S.Class<AssociateEmailAddressAliasRequest>(
  "AssociateEmailAddressAliasRequest",
)(
  {
    EmailAddressId: S.String.pipe(T.HttpLabel("EmailAddressId")),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    AliasConfiguration: AliasConfiguration,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/email-addresses/{InstanceId}/{EmailAddressId}/associate-alias",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateEmailAddressAliasResponse extends S.Class<AssociateEmailAddressAliasResponse>(
  "AssociateEmailAddressAliasResponse",
)({}) {}
export class AssociateRoutingProfileQueuesRequest extends S.Class<AssociateRoutingProfileQueuesRequest>(
  "AssociateRoutingProfileQueuesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    RoutingProfileId: S.String.pipe(T.HttpLabel("RoutingProfileId")),
    QueueConfigs: S.optional(RoutingProfileQueueConfigList),
    ManualAssignmentQueueConfigs: S.optional(
      RoutingProfileManualAssignmentQueueConfigList,
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/routing-profiles/{InstanceId}/{RoutingProfileId}/associate-queues",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateRoutingProfileQueuesResponse extends S.Class<AssociateRoutingProfileQueuesResponse>(
  "AssociateRoutingProfileQueuesResponse",
)({}) {}
export class AssociateSecurityKeyResponse extends S.Class<AssociateSecurityKeyResponse>(
  "AssociateSecurityKeyResponse",
)({ AssociationId: S.optional(S.String) }) {}
export class AssociateSecurityProfilesRequest extends S.Class<AssociateSecurityProfilesRequest>(
  "AssociateSecurityProfilesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    SecurityProfiles: SecurityProfiles,
    EntityType: S.String,
    EntityArn: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/associate-security-profiles/{InstanceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateSecurityProfilesResponse extends S.Class<AssociateSecurityProfilesResponse>(
  "AssociateSecurityProfilesResponse",
)({}) {}
export class AssociateUserProficienciesRequest extends S.Class<AssociateUserProficienciesRequest>(
  "AssociateUserProficienciesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    UserProficiencies: UserProficiencyList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/users/{InstanceId}/{UserId}/associate-proficiencies",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateUserProficienciesResponse extends S.Class<AssociateUserProficienciesResponse>(
  "AssociateUserProficienciesResponse",
)({}) {}
export class BatchCreateDataTableValueRequest extends S.Class<BatchCreateDataTableValueRequest>(
  "BatchCreateDataTableValueRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataTableId: S.String.pipe(T.HttpLabel("DataTableId")),
    Values: DataTableValueList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/data-tables/{InstanceId}/{DataTableId}/values/create",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDeleteDataTableValueRequest extends S.Class<BatchDeleteDataTableValueRequest>(
  "BatchDeleteDataTableValueRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataTableId: S.String.pipe(T.HttpLabel("DataTableId")),
    Values: DataTableDeleteValueIdentifierList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/data-tables/{InstanceId}/{DataTableId}/values/delete",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDescribeDataTableValueRequest extends S.Class<BatchDescribeDataTableValueRequest>(
  "BatchDescribeDataTableValueRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataTableId: S.String.pipe(T.HttpLabel("DataTableId")),
    Values: DataTableValueIdentifierList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/data-tables/{InstanceId}/{DataTableId}/values/describe",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ErrorResult extends S.Class<ErrorResult>("ErrorResult")({
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const ErrorResults = S.Array(ErrorResult);
export class BatchDisassociateAnalyticsDataSetResponse extends S.Class<BatchDisassociateAnalyticsDataSetResponse>(
  "BatchDisassociateAnalyticsDataSetResponse",
)({ Deleted: S.optional(DataSetIds), Errors: S.optional(ErrorResults) }) {}
export class ClaimPhoneNumberRequest extends S.Class<ClaimPhoneNumberRequest>(
  "ClaimPhoneNumberRequest",
)(
  {
    TargetArn: S.optional(S.String),
    InstanceId: S.optional(S.String),
    PhoneNumber: S.String,
    PhoneNumberDescription: S.optional(S.String),
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/phone-number/claim" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAgentStatusResponse extends S.Class<CreateAgentStatusResponse>(
  "CreateAgentStatusResponse",
)({
  AgentStatusARN: S.optional(S.String),
  AgentStatusId: S.optional(S.String),
}) {}
export class CreateContactFlowResponse extends S.Class<CreateContactFlowResponse>(
  "CreateContactFlowResponse",
)({
  ContactFlowId: S.optional(S.String),
  ContactFlowArn: S.optional(S.String),
  FlowContentSha256: S.optional(S.String),
}) {}
export class CreateContactFlowModuleRequest extends S.Class<CreateContactFlowModuleRequest>(
  "CreateContactFlowModuleRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Name: S.String,
    Description: S.optional(S.String),
    Content: S.String,
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String),
    Settings: S.optional(S.String),
    ExternalInvocationConfiguration: S.optional(
      ExternalInvocationConfiguration,
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/contact-flow-modules/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateContactFlowModuleAliasResponse extends S.Class<CreateContactFlowModuleAliasResponse>(
  "CreateContactFlowModuleAliasResponse",
)({ ContactFlowModuleArn: S.optional(S.String), Id: S.optional(S.String) }) {}
export class CreateContactFlowModuleVersionResponse extends S.Class<CreateContactFlowModuleVersionResponse>(
  "CreateContactFlowModuleVersionResponse",
)({
  ContactFlowModuleArn: S.optional(S.String),
  Version: S.optional(S.Number),
}) {}
export class CreateContactFlowVersionResponse extends S.Class<CreateContactFlowVersionResponse>(
  "CreateContactFlowVersionResponse",
)({ ContactFlowArn: S.optional(S.String), Version: S.optional(S.Number) }) {}
export class CreateDataTableResponse extends S.Class<CreateDataTableResponse>(
  "CreateDataTableResponse",
)({ Id: S.String, Arn: S.String, LockVersion: DataTableLockVersion }) {}
export class CreateEmailAddressResponse extends S.Class<CreateEmailAddressResponse>(
  "CreateEmailAddressResponse",
)({
  EmailAddressId: S.optional(S.String),
  EmailAddressArn: S.optional(S.String),
}) {}
export class CreateInstanceResponse extends S.Class<CreateInstanceResponse>(
  "CreateInstanceResponse",
)({ Id: S.optional(S.String), Arn: S.optional(S.String) }) {}
export class CreateIntegrationAssociationResponse extends S.Class<CreateIntegrationAssociationResponse>(
  "CreateIntegrationAssociationResponse",
)({
  IntegrationAssociationId: S.optional(S.String),
  IntegrationAssociationArn: S.optional(S.String),
}) {}
export class CreatePersistentContactAssociationResponse extends S.Class<CreatePersistentContactAssociationResponse>(
  "CreatePersistentContactAssociationResponse",
)({ ContinuedFromContactId: S.optional(S.String) }) {}
export class CreatePredefinedAttributeRequest extends S.Class<CreatePredefinedAttributeRequest>(
  "CreatePredefinedAttributeRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Name: S.String,
    Values: S.optional(PredefinedAttributeValues),
    Purposes: S.optional(PredefinedAttributePurposeNameList),
    AttributeConfiguration: S.optional(InputPredefinedAttributeConfiguration),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/predefined-attributes/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePredefinedAttributeResponse extends S.Class<CreatePredefinedAttributeResponse>(
  "CreatePredefinedAttributeResponse",
)({}) {}
export class CreatePromptResponse extends S.Class<CreatePromptResponse>(
  "CreatePromptResponse",
)({ PromptARN: S.optional(S.String), PromptId: S.optional(S.String) }) {}
export class CreatePushNotificationRegistrationRequest extends S.Class<CreatePushNotificationRegistrationRequest>(
  "CreatePushNotificationRegistrationRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ClientToken: S.optional(S.String),
    PinpointAppArn: S.String,
    DeviceToken: S.String,
    DeviceType: S.String,
    ContactConfiguration: ContactConfiguration,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/push-notification/{InstanceId}/registrations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateQueueRequest extends S.Class<CreateQueueRequest>(
  "CreateQueueRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Name: S.String,
    Description: S.optional(S.String),
    OutboundCallerConfig: S.optional(OutboundCallerConfig),
    OutboundEmailConfig: S.optional(OutboundEmailConfig),
    HoursOfOperationId: S.String,
    MaxContacts: S.optional(S.Number),
    QuickConnectIds: S.optional(QuickConnectsList),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/queues/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTrafficDistributionGroupResponse extends S.Class<CreateTrafficDistributionGroupResponse>(
  "CreateTrafficDistributionGroupResponse",
)({ Id: S.optional(S.String), Arn: S.optional(S.String) }) {}
export class CreateUseCaseResponse extends S.Class<CreateUseCaseResponse>(
  "CreateUseCaseResponse",
)({ UseCaseId: S.optional(S.String), UseCaseArn: S.optional(S.String) }) {}
export class CreateUserRequest extends S.Class<CreateUserRequest>(
  "CreateUserRequest",
)(
  {
    Username: S.String,
    Password: S.optional(S.String),
    IdentityInfo: S.optional(UserIdentityInfo),
    PhoneConfig: UserPhoneConfig,
    DirectoryUserId: S.optional(S.String),
    SecurityProfileIds: SecurityProfileIds,
    RoutingProfileId: S.String,
    HierarchyGroupId: S.optional(S.String),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/users/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateUserHierarchyGroupResponse extends S.Class<CreateUserHierarchyGroupResponse>(
  "CreateUserHierarchyGroupResponse",
)({
  HierarchyGroupId: S.optional(S.String),
  HierarchyGroupArn: S.optional(S.String),
}) {}
export class CreateViewRequest extends S.Class<CreateViewRequest>(
  "CreateViewRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ClientToken: S.optional(S.String),
    Status: S.String,
    Content: ViewInputContent,
    Description: S.optional(S.String),
    Name: S.String,
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/views/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateVocabularyResponse extends S.Class<CreateVocabularyResponse>(
  "CreateVocabularyResponse",
)({ VocabularyArn: S.String, VocabularyId: S.String, State: S.String }) {}
export class DeactivateEvaluationFormResponse extends S.Class<DeactivateEvaluationFormResponse>(
  "DeactivateEvaluationFormResponse",
)({
  EvaluationFormId: S.String,
  EvaluationFormArn: S.String,
  EvaluationFormVersion: S.Number,
}) {}
export class DeleteDataTableAttributeResponse extends S.Class<DeleteDataTableAttributeResponse>(
  "DeleteDataTableAttributeResponse",
)({ LockVersion: DataTableLockVersion }) {}
export class DeleteVocabularyResponse extends S.Class<DeleteVocabularyResponse>(
  "DeleteVocabularyResponse",
)({ VocabularyArn: S.String, VocabularyId: S.String, State: S.String }) {}
export class DescribeEmailAddressResponse extends S.Class<DescribeEmailAddressResponse>(
  "DescribeEmailAddressResponse",
)({
  EmailAddressId: S.optional(S.String),
  EmailAddressArn: S.optional(S.String),
  EmailAddress: S.optional(S.String),
  DisplayName: S.optional(S.String),
  Description: S.optional(S.String),
  CreateTimestamp: S.optional(S.String),
  ModifiedTimestamp: S.optional(S.String),
  AliasConfigurations: S.optional(AliasConfigurationList),
  Tags: S.optional(TagMap),
}) {}
export class DescribeInstanceStorageConfigResponse extends S.Class<DescribeInstanceStorageConfigResponse>(
  "DescribeInstanceStorageConfigResponse",
)({ StorageConfig: S.optional(InstanceStorageConfig) }) {}
export class ViewContent extends S.Class<ViewContent>("ViewContent")({
  InputSchema: S.optional(S.String),
  Template: S.optional(S.String),
  Actions: S.optional(ViewActions),
}) {}
export class View extends S.Class<View>("View")({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  Type: S.optional(S.String),
  Description: S.optional(S.String),
  Version: S.optional(S.Number),
  VersionDescription: S.optional(S.String),
  Content: S.optional(ViewContent),
  Tags: S.optional(TagMap),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ViewContentSha256: S.optional(S.String),
}) {}
export class DescribeViewResponse extends S.Class<DescribeViewResponse>(
  "DescribeViewResponse",
)({ View: S.optional(View) }) {}
export class DisassociateRoutingProfileQueuesRequest extends S.Class<DisassociateRoutingProfileQueuesRequest>(
  "DisassociateRoutingProfileQueuesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    RoutingProfileId: S.String.pipe(T.HttpLabel("RoutingProfileId")),
    QueueReferences: S.optional(RoutingProfileQueueReferenceList),
    ManualAssignmentQueueReferences: S.optional(
      RoutingProfileQueueReferenceList,
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/routing-profiles/{InstanceId}/{RoutingProfileId}/disassociate-queues",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateRoutingProfileQueuesResponse extends S.Class<DisassociateRoutingProfileQueuesResponse>(
  "DisassociateRoutingProfileQueuesResponse",
)({}) {}
export class DisassociateUserProficienciesRequest extends S.Class<DisassociateUserProficienciesRequest>(
  "DisassociateUserProficienciesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    UserProficiencies: UserProficiencyDisassociateList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/users/{InstanceId}/{UserId}/disassociate-proficiencies",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateUserProficienciesResponse extends S.Class<DisassociateUserProficienciesResponse>(
  "DisassociateUserProficienciesResponse",
)({}) {}
export class SuccessfulBatchAssociationSummary extends S.Class<SuccessfulBatchAssociationSummary>(
  "SuccessfulBatchAssociationSummary",
)({ ResourceArn: S.optional(S.String) }) {}
export const SuccessfulBatchAssociationSummaryList = S.Array(
  SuccessfulBatchAssociationSummary,
);
export class FailedBatchAssociationSummary extends S.Class<FailedBatchAssociationSummary>(
  "FailedBatchAssociationSummary",
)({
  ResourceArn: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const FailedBatchAssociationSummaryList = S.Array(
  FailedBatchAssociationSummary,
);
export class DisassociateWorkspaceResponse extends S.Class<DisassociateWorkspaceResponse>(
  "DisassociateWorkspaceResponse",
)({
  SuccessfulList: S.optional(SuccessfulBatchAssociationSummaryList),
  FailedList: S.optional(FailedBatchAssociationSummaryList),
}) {}
export class EvaluateDataTableValuesRequest extends S.Class<EvaluateDataTableValuesRequest>(
  "EvaluateDataTableValuesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataTableId: S.String.pipe(T.HttpLabel("DataTableId")),
    Values: DataTableValueEvaluationSetList,
    TimeZone: S.optional(S.String),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/data-tables/{InstanceId}/{DataTableId}/values/evaluate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetContactAttributesResponse extends S.Class<GetContactAttributesResponse>(
  "GetContactAttributesResponse",
)({ Attributes: S.optional(Attributes) }) {}
export class GetContactMetricsRequest extends S.Class<GetContactMetricsRequest>(
  "GetContactMetricsRequest",
)(
  { InstanceId: S.String, ContactId: S.String, Metrics: ContactMetrics },
  T.all(
    T.Http({ method: "POST", uri: "/metrics/contact" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCurrentMetricDataRequest extends S.Class<GetCurrentMetricDataRequest>(
  "GetCurrentMetricDataRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Filters: Filters,
    Groupings: S.optional(Groupings),
    CurrentMetrics: CurrentMetrics,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SortCriteria: S.optional(CurrentMetricSortCriteriaMaxOne),
  },
  T.all(
    T.Http({ method: "POST", uri: "/metrics/current/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFlowAssociationResponse extends S.Class<GetFlowAssociationResponse>(
  "GetFlowAssociationResponse",
)({
  ResourceId: S.optional(S.String),
  FlowId: S.optional(S.String),
  ResourceType: S.optional(S.String),
}) {}
export class GetPromptFileResponse extends S.Class<GetPromptFileResponse>(
  "GetPromptFileResponse",
)({
  PromptPresignedUrl: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export class GetTaskTemplateResponse extends S.Class<GetTaskTemplateResponse>(
  "GetTaskTemplateResponse",
)({
  InstanceId: S.optional(S.String),
  Id: S.String,
  Arn: S.String,
  Name: S.String,
  Description: S.optional(S.String),
  ContactFlowId: S.optional(S.String),
  SelfAssignFlowId: S.optional(S.String),
  Constraints: S.optional(TaskTemplateConstraints),
  Defaults: S.optional(TaskTemplateDefaults),
  Fields: S.optional(TaskTemplateFields),
  Status: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(TagMap),
}) {}
export class TelephonyConfig extends S.Class<TelephonyConfig>(
  "TelephonyConfig",
)({ Distributions: DistributionList }) {}
export class SignInDistribution extends S.Class<SignInDistribution>(
  "SignInDistribution",
)({ Region: S.String, Enabled: S.Boolean }) {}
export const SignInDistributionList = S.Array(SignInDistribution);
export class SignInConfig extends S.Class<SignInConfig>("SignInConfig")({
  Distributions: SignInDistributionList,
}) {}
export class GetTrafficDistributionResponse extends S.Class<GetTrafficDistributionResponse>(
  "GetTrafficDistributionResponse",
)({
  TelephonyConfig: S.optional(TelephonyConfig),
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  SignInConfig: S.optional(SignInConfig),
  AgentConfig: S.optional(AgentConfig),
}) {}
export class ImportPhoneNumberResponse extends S.Class<ImportPhoneNumberResponse>(
  "ImportPhoneNumberResponse",
)({
  PhoneNumberId: S.optional(S.String),
  PhoneNumberArn: S.optional(S.String),
}) {}
export class AnalyticsDataAssociationResult extends S.Class<AnalyticsDataAssociationResult>(
  "AnalyticsDataAssociationResult",
)({
  DataSetId: S.optional(S.String),
  TargetAccountId: S.optional(S.String),
  ResourceShareId: S.optional(S.String),
  ResourceShareArn: S.optional(S.String),
  ResourceShareStatus: S.optional(S.String),
}) {}
export const AnalyticsDataAssociationResults = S.Array(
  AnalyticsDataAssociationResult,
);
export class ListAnalyticsDataAssociationsResponse extends S.Class<ListAnalyticsDataAssociationsResponse>(
  "ListAnalyticsDataAssociationsResponse",
)({
  Results: S.optional(AnalyticsDataAssociationResults),
  NextToken: S.optional(S.String),
}) {}
export class ListApprovedOriginsResponse extends S.Class<ListApprovedOriginsResponse>(
  "ListApprovedOriginsResponse",
)({ Origins: S.optional(OriginsList), NextToken: S.optional(S.String) }) {}
export class ListDataTableAttributesResponse extends S.Class<ListDataTableAttributesResponse>(
  "ListDataTableAttributesResponse",
)({ NextToken: S.optional(S.String), Attributes: AttributeList }) {}
export class ListDataTablePrimaryValuesRequest extends S.Class<ListDataTablePrimaryValuesRequest>(
  "ListDataTablePrimaryValuesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataTableId: S.String.pipe(T.HttpLabel("DataTableId")),
    RecordIds: S.optional(RecordIds),
    PrimaryAttributeValues: S.optional(PrimaryAttributeValueFilters),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/data-tables/{InstanceId}/{DataTableId}/values/list-primary",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEntitySecurityProfilesResponse extends S.Class<ListEntitySecurityProfilesResponse>(
  "ListEntitySecurityProfilesResponse",
)({
  SecurityProfiles: S.optional(SecurityProfiles100),
  NextToken: S.optional(S.String),
}) {}
export class FlowAssociationSummary extends S.Class<FlowAssociationSummary>(
  "FlowAssociationSummary",
)({
  ResourceId: S.optional(S.String),
  FlowId: S.optional(S.String),
  ResourceType: S.optional(S.String),
}) {}
export const FlowAssociationSummaryList = S.Array(FlowAssociationSummary);
export class ListFlowAssociationsResponse extends S.Class<ListFlowAssociationsResponse>(
  "ListFlowAssociationsResponse",
)({
  FlowAssociationSummaryList: S.optional(FlowAssociationSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListHoursOfOperationOverridesResponse extends S.Class<ListHoursOfOperationOverridesResponse>(
  "ListHoursOfOperationOverridesResponse",
)({
  NextToken: S.optional(S.String),
  HoursOfOperationOverrideList: S.optional(HoursOfOperationOverrideList),
  LastModifiedRegion: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ListInstanceAttributesResponse extends S.Class<ListInstanceAttributesResponse>(
  "ListInstanceAttributesResponse",
)({
  Attributes: S.optional(AttributesList),
  NextToken: S.optional(S.String),
}) {}
export class ListInstanceStorageConfigsResponse extends S.Class<ListInstanceStorageConfigsResponse>(
  "ListInstanceStorageConfigsResponse",
)({
  StorageConfigs: S.optional(InstanceStorageConfigs),
  NextToken: S.optional(S.String),
}) {}
export class ListLambdaFunctionsResponse extends S.Class<ListLambdaFunctionsResponse>(
  "ListLambdaFunctionsResponse",
)({
  LambdaFunctions: S.optional(FunctionArnsList),
  NextToken: S.optional(S.String),
}) {}
export class ListLexBotsResponse extends S.Class<ListLexBotsResponse>(
  "ListLexBotsResponse",
)({ LexBots: S.optional(LexBotsList), NextToken: S.optional(S.String) }) {}
export class QuickConnectSummary extends S.Class<QuickConnectSummary>(
  "QuickConnectSummary",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  QuickConnectType: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export const QuickConnectSummaryList = S.Array(QuickConnectSummary);
export class ListQuickConnectsResponse extends S.Class<ListQuickConnectsResponse>(
  "ListQuickConnectsResponse",
)({
  QuickConnectSummaryList: S.optional(QuickConnectSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListSecurityProfileApplicationsResponse extends S.Class<ListSecurityProfileApplicationsResponse>(
  "ListSecurityProfileApplicationsResponse",
)({
  Applications: S.optional(Applications),
  NextToken: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export class ListSecurityProfileFlowModulesResponse extends S.Class<ListSecurityProfileFlowModulesResponse>(
  "ListSecurityProfileFlowModulesResponse",
)({
  AllowedFlowModules: S.optional(AllowedFlowModules),
  NextToken: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export class ListSecurityProfilePermissionsResponse extends S.Class<ListSecurityProfilePermissionsResponse>(
  "ListSecurityProfilePermissionsResponse",
)({
  Permissions: S.optional(PermissionsList),
  NextToken: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class ListUserProficienciesResponse extends S.Class<ListUserProficienciesResponse>(
  "ListUserProficienciesResponse",
)({
  NextToken: S.optional(S.String),
  UserProficiencyList: S.optional(UserProficiencyList),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export class MonitorContactResponse extends S.Class<MonitorContactResponse>(
  "MonitorContactResponse",
)({ ContactId: S.optional(S.String), ContactArn: S.optional(S.String) }) {}
export class ReplicateInstanceResponse extends S.Class<ReplicateInstanceResponse>(
  "ReplicateInstanceResponse",
)({ Id: S.optional(S.String), Arn: S.optional(S.String) }) {}
export class SearchDataTablesRequest extends S.Class<SearchDataTablesRequest>(
  "SearchDataTablesRequest",
)(
  {
    InstanceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchFilter: S.optional(DataTableSearchFilter),
    SearchCriteria: S.optional(DataTableSearchCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-data-tables" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchEmailAddressesRequest extends S.Class<SearchEmailAddressesRequest>(
  "SearchEmailAddressesRequest",
)(
  {
    InstanceId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    SearchCriteria: S.optional(EmailAddressSearchCriteria),
    SearchFilter: S.optional(EmailAddressSearchFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-email-addresses" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchEvaluationFormsRequest extends S.Class<SearchEvaluationFormsRequest>(
  "SearchEvaluationFormsRequest",
)(
  {
    InstanceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchCriteria: S.optional(EvaluationFormSearchCriteria),
    SearchFilter: S.optional(EvaluationFormSearchFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-evaluation-forms" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchHoursOfOperationsRequest extends S.Class<SearchHoursOfOperationsRequest>(
  "SearchHoursOfOperationsRequest",
)(
  {
    InstanceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchFilter: S.optional(HoursOfOperationSearchFilter),
    SearchCriteria: S.optional(HoursOfOperationSearchCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-hours-of-operations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchPredefinedAttributesRequest extends S.Class<SearchPredefinedAttributesRequest>(
  "SearchPredefinedAttributesRequest",
)(
  {
    InstanceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchCriteria: S.optional(PredefinedAttributeSearchCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-predefined-attributes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchPromptsRequest extends S.Class<SearchPromptsRequest>(
  "SearchPromptsRequest",
)(
  {
    InstanceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchFilter: S.optional(PromptSearchFilter),
    SearchCriteria: S.optional(PromptSearchCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-prompts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchQueuesRequest extends S.Class<SearchQueuesRequest>(
  "SearchQueuesRequest",
)(
  {
    InstanceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchFilter: S.optional(QueueSearchFilter),
    SearchCriteria: S.optional(QueueSearchCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-queues" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchQuickConnectsRequest extends S.Class<SearchQuickConnectsRequest>(
  "SearchQuickConnectsRequest",
)(
  {
    InstanceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchFilter: S.optional(QuickConnectSearchFilter),
    SearchCriteria: S.optional(QuickConnectSearchCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-quick-connects" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchRoutingProfilesRequest extends S.Class<SearchRoutingProfilesRequest>(
  "SearchRoutingProfilesRequest",
)(
  {
    InstanceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchFilter: S.optional(RoutingProfileSearchFilter),
    SearchCriteria: S.optional(RoutingProfileSearchCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-routing-profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchSecurityProfilesRequest extends S.Class<SearchSecurityProfilesRequest>(
  "SearchSecurityProfilesRequest",
)(
  {
    InstanceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchCriteria: S.optional(SecurityProfileSearchCriteria),
    SearchFilter: S.optional(SecurityProfilesSearchFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-security-profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchUserHierarchyGroupsRequest extends S.Class<SearchUserHierarchyGroupsRequest>(
  "SearchUserHierarchyGroupsRequest",
)(
  {
    InstanceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchFilter: S.optional(UserHierarchyGroupSearchFilter),
    SearchCriteria: S.optional(UserHierarchyGroupSearchCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-user-hierarchy-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchViewsRequest extends S.Class<SearchViewsRequest>(
  "SearchViewsRequest",
)(
  {
    InstanceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchFilter: S.optional(ViewSearchFilter),
    SearchCriteria: S.optional(ViewSearchCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-views" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchWorkspaceAssociationsRequest extends S.Class<SearchWorkspaceAssociationsRequest>(
  "SearchWorkspaceAssociationsRequest",
)(
  {
    InstanceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchFilter: S.optional(WorkspaceAssociationSearchFilter),
    SearchCriteria: S.optional(WorkspaceAssociationSearchCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-workspace-associations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchWorkspacesRequest extends S.Class<SearchWorkspacesRequest>(
  "SearchWorkspacesRequest",
)(
  {
    InstanceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchFilter: S.optional(WorkspaceSearchFilter),
    SearchCriteria: S.optional(WorkspaceSearchCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-workspaces" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendChatIntegrationEventRequest extends S.Class<SendChatIntegrationEventRequest>(
  "SendChatIntegrationEventRequest",
)(
  {
    SourceId: S.String,
    DestinationId: S.String,
    Subtype: S.optional(S.String),
    Event: ChatEvent,
    NewSessionDetails: S.optional(NewSessionDetails),
  },
  T.all(
    T.Http({ method: "POST", uri: "/chat-integration-event" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartAttachedFileUploadRequest extends S.Class<StartAttachedFileUploadRequest>(
  "StartAttachedFileUploadRequest",
)(
  {
    ClientToken: S.optional(S.String),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    FileName: S.String,
    FileSizeInBytes: S.Number,
    UrlExpiryInSeconds: S.optional(S.Number),
    FileUseCaseType: S.String,
    AssociatedResourceArn: S.String.pipe(T.HttpQuery("associatedResourceArn")),
    CreatedBy: S.optional(CreatedByInfo),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/attached-files/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartChatContactRequest extends S.Class<StartChatContactRequest>(
  "StartChatContactRequest",
)(
  {
    InstanceId: S.String,
    ContactFlowId: S.String,
    Attributes: S.optional(Attributes),
    ParticipantDetails: ParticipantDetails,
    ParticipantConfiguration: S.optional(ParticipantConfiguration),
    InitialMessage: S.optional(ChatMessage),
    ClientToken: S.optional(S.String),
    ChatDurationInMinutes: S.optional(S.Number),
    SupportedMessagingContentTypes: S.optional(SupportedMessagingContentTypes),
    PersistentChat: S.optional(PersistentChat),
    RelatedContactId: S.optional(S.String),
    SegmentAttributes: S.optional(SegmentAttributes),
    CustomerId: S.optional(S.String),
    DisconnectOnCustomerExit: S.optional(DisconnectOnCustomerExit),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/contact/chat" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartContactEvaluationRequest extends S.Class<StartContactEvaluationRequest>(
  "StartContactEvaluationRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactId: S.String,
    EvaluationFormId: S.String,
    AutoEvaluationConfiguration: S.optional(AutoEvaluationConfiguration),
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/contact-evaluations/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartContactRecordingRequest extends S.Class<StartContactRecordingRequest>(
  "StartContactRecordingRequest",
)(
  {
    InstanceId: S.String,
    ContactId: S.String,
    InitialContactId: S.String,
    VoiceRecordingConfiguration: VoiceRecordingConfiguration,
  },
  T.all(
    T.Http({ method: "POST", uri: "/contact/start-recording" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartContactRecordingResponse extends S.Class<StartContactRecordingResponse>(
  "StartContactRecordingResponse",
)({}) {}
export class StartContactStreamingRequest extends S.Class<StartContactStreamingRequest>(
  "StartContactStreamingRequest",
)(
  {
    InstanceId: S.String,
    ContactId: S.String,
    ChatStreamingConfiguration: ChatStreamingConfiguration,
    ClientToken: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/contact/start-streaming" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartOutboundEmailContactResponse extends S.Class<StartOutboundEmailContactResponse>(
  "StartOutboundEmailContactResponse",
)({ ContactId: S.optional(S.String) }) {}
export class StartTaskContactResponse extends S.Class<StartTaskContactResponse>(
  "StartTaskContactResponse",
)({ ContactId: S.optional(S.String) }) {}
export class StartWebRTCContactRequest extends S.Class<StartWebRTCContactRequest>(
  "StartWebRTCContactRequest",
)(
  {
    Attributes: S.optional(Attributes),
    ClientToken: S.optional(S.String),
    ContactFlowId: S.String,
    InstanceId: S.String,
    AllowedCapabilities: S.optional(AllowedCapabilities),
    ParticipantDetails: ParticipantDetails,
    RelatedContactId: S.optional(S.String),
    References: S.optional(ContactReferences),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/contact/webrtc" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopContactRequest extends S.Class<StopContactRequest>(
  "StopContactRequest",
)(
  {
    ContactId: S.String,
    InstanceId: S.String,
    DisconnectReason: S.optional(DisconnectReason),
  },
  T.all(
    T.Http({ method: "POST", uri: "/contact/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopContactResponse extends S.Class<StopContactResponse>(
  "StopContactResponse",
)({}) {}
export class TagContactRequest extends S.Class<TagContactRequest>(
  "TagContactRequest",
)(
  { ContactId: S.String, InstanceId: S.String, Tags: ContactTagMap },
  T.all(
    T.Http({ method: "POST", uri: "/contact/tags" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagContactResponse extends S.Class<TagContactResponse>(
  "TagContactResponse",
)({}) {}
export class TransferContactResponse extends S.Class<TransferContactResponse>(
  "TransferContactResponse",
)({ ContactId: S.optional(S.String), ContactArn: S.optional(S.String) }) {}
export class UpdateContactRequest extends S.Class<UpdateContactRequest>(
  "UpdateContactRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactId: S.String.pipe(T.HttpLabel("ContactId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    References: S.optional(ContactReferences),
    SegmentAttributes: S.optional(SegmentAttributes),
    QueueInfo: S.optional(QueueInfoInput),
    UserInfo: S.optional(UserInfo),
    CustomerEndpoint: S.optional(Endpoint),
    SystemEndpoint: S.optional(Endpoint),
  },
  T.all(
    T.Http({ method: "POST", uri: "/contacts/{InstanceId}/{ContactId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateContactResponse extends S.Class<UpdateContactResponse>(
  "UpdateContactResponse",
)({}) {}
export class UpdateContactEvaluationResponse extends S.Class<UpdateContactEvaluationResponse>(
  "UpdateContactEvaluationResponse",
)({ EvaluationId: S.String, EvaluationArn: S.String }) {}
export class UpdateDataTableAttributeResponse extends S.Class<UpdateDataTableAttributeResponse>(
  "UpdateDataTableAttributeResponse",
)({ Name: S.String, LockVersion: DataTableLockVersion }) {}
export class UpdateDataTableMetadataResponse extends S.Class<UpdateDataTableMetadataResponse>(
  "UpdateDataTableMetadataResponse",
)({ LockVersion: DataTableLockVersion }) {}
export class UpdateDataTablePrimaryValuesRequest extends S.Class<UpdateDataTablePrimaryValuesRequest>(
  "UpdateDataTablePrimaryValuesRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataTableId: S.String.pipe(T.HttpLabel("DataTableId")),
    PrimaryValues: PrimaryValuesSet,
    NewPrimaryValues: PrimaryValuesSet,
    LockVersion: DataTableLockVersion,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/data-tables/{InstanceId}/{DataTableId}/values/update-primary",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEmailAddressMetadataResponse extends S.Class<UpdateEmailAddressMetadataResponse>(
  "UpdateEmailAddressMetadataResponse",
)({
  EmailAddressId: S.optional(S.String),
  EmailAddressArn: S.optional(S.String),
}) {}
export class UpdateEvaluationFormResponse extends S.Class<UpdateEvaluationFormResponse>(
  "UpdateEvaluationFormResponse",
)({
  EvaluationFormId: S.String,
  EvaluationFormArn: S.String,
  EvaluationFormVersion: S.Number,
}) {}
export class UpdatePhoneNumberResponse extends S.Class<UpdatePhoneNumberResponse>(
  "UpdatePhoneNumberResponse",
)({
  PhoneNumberId: S.optional(S.String),
  PhoneNumberArn: S.optional(S.String),
}) {}
export class UpdatePromptResponse extends S.Class<UpdatePromptResponse>(
  "UpdatePromptResponse",
)({ PromptARN: S.optional(S.String), PromptId: S.optional(S.String) }) {}
export class UpdateTaskTemplateResponse extends S.Class<UpdateTaskTemplateResponse>(
  "UpdateTaskTemplateResponse",
)({
  InstanceId: S.optional(S.String),
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  ContactFlowId: S.optional(S.String),
  SelfAssignFlowId: S.optional(S.String),
  Constraints: S.optional(TaskTemplateConstraints),
  Defaults: S.optional(TaskTemplateDefaults),
  Fields: S.optional(TaskTemplateFields),
  Status: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class UpdateViewContentResponse extends S.Class<UpdateViewContentResponse>(
  "UpdateViewContentResponse",
)({ View: S.optional(View) }) {}
export class Campaign extends S.Class<Campaign>("Campaign")({
  CampaignId: S.optional(S.String),
}) {}
export class EvaluationFormSection extends S.Class<EvaluationFormSection>(
  "EvaluationFormSection",
)({
  Title: S.String,
  RefId: S.String,
  Instructions: S.optional(S.String),
  Items: S.suspend(() => EvaluationFormItemsList),
  Weight: S.optional(S.Number),
}) {}
export const AssociatedQueueIdList = S.Array(S.String);
export class ContactFilter extends S.Class<ContactFilter>("ContactFilter")({
  ContactStates: S.optional(ContactStates),
}) {}
export class Threshold extends S.Class<Threshold>("Threshold")({
  Comparison: S.optional(S.String),
  ThresholdValue: S.optional(S.Number),
}) {}
export class FilterV2StringCondition extends S.Class<FilterV2StringCondition>(
  "FilterV2StringCondition",
)({ Comparison: S.optional(S.String) }) {}
export class ThresholdV2 extends S.Class<ThresholdV2>("ThresholdV2")({
  Comparison: S.optional(S.String),
  ThresholdValue: S.optional(S.Number),
}) {}
export const ThresholdCollections = S.Array(ThresholdV2);
export class MetricFilterV2 extends S.Class<MetricFilterV2>("MetricFilterV2")({
  MetricFilterKey: S.optional(S.String),
  MetricFilterValues: S.optional(MetricFilterValueList),
  Negate: S.optional(S.Boolean),
}) {}
export const MetricFiltersV2List = S.Array(MetricFilterV2);
export class DecimalCondition extends S.Class<DecimalCondition>(
  "DecimalCondition",
)({
  FieldName: S.optional(S.String),
  MinValue: S.optional(S.Number),
  MaxValue: S.optional(S.Number),
  ComparisonType: S.optional(S.String),
}) {}
export class NameCriteria extends S.Class<NameCriteria>("NameCriteria")({
  SearchText: SearchTextList,
  MatchType: S.String,
}) {}
export class AgentHierarchyGroups extends S.Class<AgentHierarchyGroups>(
  "AgentHierarchyGroups",
)({
  L1Ids: S.optional(HierarchyGroupIdList),
  L2Ids: S.optional(HierarchyGroupIdList),
  L3Ids: S.optional(HierarchyGroupIdList),
  L4Ids: S.optional(HierarchyGroupIdList),
  L5Ids: S.optional(HierarchyGroupIdList),
}) {}
export class DateCondition extends S.Class<DateCondition>("DateCondition")({
  FieldName: S.optional(S.String),
  Value: S.optional(S.String),
  ComparisonType: S.optional(S.String),
}) {}
export class TagSearchCondition extends S.Class<TagSearchCondition>(
  "TagSearchCondition",
)({
  tagKey: S.optional(S.String),
  tagValue: S.optional(S.String),
  tagKeyComparisonType: S.optional(S.String),
  tagValueComparisonType: S.optional(S.String),
}) {}
export class HierarchyGroupCondition extends S.Class<HierarchyGroupCondition>(
  "HierarchyGroupCondition",
)({
  Value: S.optional(S.String),
  HierarchyGroupMatchType: S.optional(S.String),
}) {}
export class HierarchyLevelUpdate extends S.Class<HierarchyLevelUpdate>(
  "HierarchyLevelUpdate",
)({ Name: S.String }) {}
export const SearchableContactAttributeValueList = S.Array(S.String);
export const SearchableSegmentAttributeValueList = S.Array(S.String);
export type Expressions = Expression[];
export const Expressions = S.Array(
  S.suspend((): S.Schema<Expression, any> => Expression),
) as any as S.Schema<Expressions>;
export class AttachedFile extends S.Class<AttachedFile>("AttachedFile")({
  CreationTime: S.String,
  FileArn: S.String,
  FileId: S.String,
  FileName: S.String,
  FileSizeInBytes: S.Number,
  FileStatus: S.String,
  CreatedBy: S.optional(CreatedByInfo),
  FileUseCaseType: S.optional(S.String),
  AssociatedResourceArn: S.optional(S.String),
  Tags: S.optional(TagMap),
}) {}
export const AttachedFilesList = S.Array(AttachedFile);
export class AttachedFileError extends S.Class<AttachedFileError>(
  "AttachedFileError",
)({
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  FileId: S.optional(S.String),
}) {}
export const AttachedFileErrorsList = S.Array(AttachedFileError);
export class PostAcceptTimeoutConfig extends S.Class<PostAcceptTimeoutConfig>(
  "PostAcceptTimeoutConfig",
)({ DurationInSeconds: S.Number }) {}
export const AllowedUserActions = S.Array(S.String);
export class Preview extends S.Class<Preview>("Preview")({
  PostAcceptTimeoutConfig: PostAcceptTimeoutConfig,
  AllowedUserActions: AllowedUserActions,
}) {}
export class AgentFirst extends S.Class<AgentFirst>("AgentFirst")({
  Preview: S.optional(Preview),
}) {}
export class OutboundStrategyConfig extends S.Class<OutboundStrategyConfig>(
  "OutboundStrategyConfig",
)({ AgentFirst: S.optional(AgentFirst) }) {}
export class OutboundStrategy extends S.Class<OutboundStrategy>(
  "OutboundStrategy",
)({ Type: S.String, Config: S.optional(OutboundStrategyConfig) }) {}
export class ContactDataRequest extends S.Class<ContactDataRequest>(
  "ContactDataRequest",
)({
  SystemEndpoint: S.optional(Endpoint),
  CustomerEndpoint: S.optional(Endpoint),
  RequestIdentifier: S.optional(S.String),
  QueueId: S.optional(S.String),
  Attributes: S.optional(Attributes),
  Campaign: S.optional(Campaign),
  OutboundStrategy: S.optional(OutboundStrategy),
}) {}
export const ContactDataRequestList = S.Array(ContactDataRequest);
export class BatchUpdateDataTableValueSuccessResult extends S.Class<BatchUpdateDataTableValueSuccessResult>(
  "BatchUpdateDataTableValueSuccessResult",
)({
  PrimaryValues: PrimaryValuesSet,
  AttributeName: S.String,
  LockVersion: DataTableLockVersion,
}) {}
export const BatchUpdateDataTableValueSuccessResultList = S.Array(
  BatchUpdateDataTableValueSuccessResult,
);
export class BatchUpdateDataTableValueFailureResult extends S.Class<BatchUpdateDataTableValueFailureResult>(
  "BatchUpdateDataTableValueFailureResult",
)({
  PrimaryValues: PrimaryValuesSet,
  AttributeName: S.String,
  Message: S.String,
}) {}
export const BatchUpdateDataTableValueFailureResultList = S.Array(
  BatchUpdateDataTableValueFailureResult,
);
export class ParticipantDetailsToAdd extends S.Class<ParticipantDetailsToAdd>(
  "ParticipantDetailsToAdd",
)({
  ParticipantRole: S.optional(S.String),
  DisplayName: S.optional(S.String),
  ParticipantCapabilities: S.optional(ParticipantCapabilities),
}) {}
export class AgentStatus extends S.Class<AgentStatus>("AgentStatus")({
  AgentStatusARN: S.optional(S.String),
  AgentStatusId: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Type: S.optional(S.String),
  DisplayOrder: S.optional(S.Number),
  State: S.optional(S.String),
  Tags: S.optional(TagMap),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export class AuthenticationProfile extends S.Class<AuthenticationProfile>(
  "AuthenticationProfile",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  AllowedIps: S.optional(IpCidrList),
  BlockedIps: S.optional(IpCidrList),
  IsDefault: S.optional(S.Boolean),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
  PeriodicSessionDuration: S.optional(S.Number),
  MaxSessionDuration: S.optional(S.Number),
  SessionInactivityDuration: S.optional(S.Number),
  SessionInactivityHandlingEnabled: S.optional(S.Boolean),
}) {}
export class EvaluationFormContent extends S.Class<EvaluationFormContent>(
  "EvaluationFormContent",
)({
  EvaluationFormVersion: S.Number,
  EvaluationFormId: S.String,
  EvaluationFormArn: S.String,
  Title: S.String,
  Description: S.optional(S.String),
  Items: EvaluationFormItemsList,
  ScoringStrategy: S.optional(EvaluationFormScoringStrategy),
  AutoEvaluationConfiguration: S.optional(
    EvaluationFormAutoEvaluationConfiguration,
  ),
  TargetConfiguration: S.optional(EvaluationFormTargetConfiguration),
  LanguageConfiguration: S.optional(EvaluationFormLanguageConfiguration),
}) {}
export class ContactFlow extends S.Class<ContactFlow>("ContactFlow")({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  State: S.optional(S.String),
  Status: S.optional(S.String),
  Description: S.optional(S.String),
  Content: S.optional(S.String),
  Tags: S.optional(TagMap),
  FlowContentSha256: S.optional(S.String),
  Version: S.optional(S.Number),
  VersionDescription: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export class ContactFlowModule extends S.Class<ContactFlowModule>(
  "ContactFlowModule",
)({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Content: S.optional(S.String),
  Description: S.optional(S.String),
  State: S.optional(S.String),
  Status: S.optional(S.String),
  Tags: S.optional(TagMap),
  FlowModuleContentSha256: S.optional(S.String),
  Version: S.optional(S.Number),
  VersionDescription: S.optional(S.String),
  Settings: S.optional(S.String),
  ExternalInvocationConfiguration: S.optional(ExternalInvocationConfiguration),
}) {}
export class ContactFlowModuleAliasInfo extends S.Class<ContactFlowModuleAliasInfo>(
  "ContactFlowModuleAliasInfo",
)({
  ContactFlowModuleId: S.optional(S.String),
  ContactFlowModuleArn: S.optional(S.String),
  AliasId: S.optional(S.String),
  Version: S.optional(S.Number),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  LastModifiedRegion: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DataTable extends S.Class<DataTable>("DataTable")({
  Name: S.String,
  Id: S.String,
  Arn: S.String,
  TimeZone: S.String,
  Description: S.optional(S.String),
  ValueLockLevel: S.optional(S.String),
  LockVersion: S.optional(DataTableLockVersion),
  Version: S.optional(S.String),
  VersionDescription: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedRegion: S.optional(S.String),
  Tags: S.optional(TagMap),
}) {}
export class EvaluationForm extends S.Class<EvaluationForm>("EvaluationForm")({
  EvaluationFormId: S.String,
  EvaluationFormVersion: S.Number,
  Locked: S.Boolean,
  EvaluationFormArn: S.String,
  Title: S.String,
  Description: S.optional(S.String),
  Status: S.String,
  Items: EvaluationFormItemsList,
  ScoringStrategy: S.optional(EvaluationFormScoringStrategy),
  CreatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  CreatedBy: S.String,
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedBy: S.String,
  AutoEvaluationConfiguration: S.optional(
    EvaluationFormAutoEvaluationConfiguration,
  ),
  Tags: S.optional(TagMap),
  TargetConfiguration: S.optional(EvaluationFormTargetConfiguration),
  LanguageConfiguration: S.optional(EvaluationFormLanguageConfiguration),
}) {}
export class HoursOfOperation extends S.Class<HoursOfOperation>(
  "HoursOfOperation",
)({
  HoursOfOperationId: S.optional(S.String),
  HoursOfOperationArn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  TimeZone: S.optional(S.String),
  Config: S.optional(HoursOfOperationConfigList),
  Tags: S.optional(TagMap),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export class Prompt extends S.Class<Prompt>("Prompt")({
  PromptARN: S.optional(S.String),
  PromptId: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Tags: S.optional(TagMap),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export class Queue extends S.Class<Queue>("Queue")({
  Name: S.optional(S.String),
  QueueArn: S.optional(S.String),
  QueueId: S.optional(S.String),
  Description: S.optional(S.String),
  OutboundCallerConfig: S.optional(OutboundCallerConfig),
  OutboundEmailConfig: S.optional(OutboundEmailConfig),
  HoursOfOperationId: S.optional(S.String),
  MaxContacts: S.optional(S.Number),
  Status: S.optional(S.String),
  Tags: S.optional(TagMap),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export class QuickConnect extends S.Class<QuickConnect>("QuickConnect")({
  QuickConnectARN: S.optional(S.String),
  QuickConnectId: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  QuickConnectConfig: S.optional(QuickConnectConfig),
  Tags: S.optional(TagMap),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export class RoutingProfile extends S.Class<RoutingProfile>("RoutingProfile")({
  InstanceId: S.optional(S.String),
  Name: S.optional(S.String),
  RoutingProfileArn: S.optional(S.String),
  RoutingProfileId: S.optional(S.String),
  Description: S.optional(S.String),
  MediaConcurrencies: S.optional(MediaConcurrencies),
  DefaultOutboundQueueId: S.optional(S.String),
  Tags: S.optional(TagMap),
  NumberOfAssociatedQueues: S.optional(S.Number),
  NumberOfAssociatedManualAssignmentQueues: S.optional(S.Number),
  NumberOfAssociatedUsers: S.optional(S.Number),
  AgentAvailabilityTimer: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
  IsDefault: S.optional(S.Boolean),
  AssociatedQueueIds: S.optional(AssociatedQueueIdList),
  AssociatedManualAssignmentQueueIds: S.optional(AssociatedQueueIdList),
}) {}
export class Rule extends S.Class<Rule>("Rule")({
  Name: S.String,
  RuleId: S.String,
  RuleArn: S.String,
  TriggerEventSource: RuleTriggerEventSource,
  Function: S.String,
  Actions: RuleActions,
  PublishStatus: S.String,
  CreatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdatedBy: S.String,
  Tags: S.optional(TagMap),
}) {}
export class SecurityProfile extends S.Class<SecurityProfile>(
  "SecurityProfile",
)({
  Id: S.optional(S.String),
  OrganizationResourceId: S.optional(S.String),
  Arn: S.optional(S.String),
  SecurityProfileName: S.optional(S.String),
  Description: S.optional(S.String),
  Tags: S.optional(TagMap),
  AllowedAccessControlTags: S.optional(AllowedAccessControlTags),
  TagRestrictedResources: S.optional(TagRestrictedResourceList),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
  HierarchyRestrictedResources: S.optional(HierarchyRestrictedResourceList),
  AllowedAccessControlHierarchyGroupId: S.optional(S.String),
  GranularAccessControlConfiguration: S.optional(
    GranularAccessControlConfiguration,
  ),
}) {}
export class TrafficDistributionGroup extends S.Class<TrafficDistributionGroup>(
  "TrafficDistributionGroup",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  InstanceArn: S.optional(S.String),
  Status: S.optional(S.String),
  Tags: S.optional(TagMap),
  IsDefault: S.optional(S.Boolean),
}) {}
export class User extends S.Class<User>("User")({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Username: S.optional(S.String),
  IdentityInfo: S.optional(UserIdentityInfo),
  PhoneConfig: S.optional(UserPhoneConfig),
  DirectoryUserId: S.optional(S.String),
  SecurityProfileIds: S.optional(SecurityProfileIds),
  RoutingProfileId: S.optional(S.String),
  HierarchyGroupId: S.optional(S.String),
  Tags: S.optional(TagMap),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export class Vocabulary extends S.Class<Vocabulary>("Vocabulary")({
  Name: S.String,
  Id: S.String,
  Arn: S.String,
  LanguageCode: S.String,
  State: S.String,
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  FailureReason: S.optional(S.String),
  Content: S.optional(S.String),
  Tags: S.optional(TagMap),
}) {}
export class Workspace extends S.Class<Workspace>("Workspace")({
  Visibility: S.optional(S.String),
  Id: S.String,
  Name: S.String,
  Arn: S.String,
  Description: S.optional(S.String),
  Theme: S.optional(WorkspaceTheme),
  Title: S.optional(S.String),
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedRegion: S.optional(S.String),
  Tags: S.optional(TagMap),
}) {}
export class DownloadUrlMetadata extends S.Class<DownloadUrlMetadata>(
  "DownloadUrlMetadata",
)({ Url: S.optional(S.String), UrlExpiry: S.optional(S.String) }) {}
export class UserDataFilters extends S.Class<UserDataFilters>(
  "UserDataFilters",
)({
  Queues: S.optional(Queues),
  ContactFilter: S.optional(ContactFilter),
  RoutingProfiles: S.optional(RoutingProfiles),
  Agents: S.optional(AgentsMinOneMaxHundred),
  UserHierarchyGroups: S.optional(UserDataHierarchyGroups),
}) {}
export class Credentials extends S.Class<Credentials>("Credentials")({
  AccessToken: S.optional(S.String),
  AccessTokenExpiration: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  RefreshToken: S.optional(S.String),
  RefreshTokenExpiration: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class HistoricalMetric extends S.Class<HistoricalMetric>(
  "HistoricalMetric",
)({
  Name: S.optional(S.String),
  Threshold: S.optional(Threshold),
  Statistic: S.optional(S.String),
  Unit: S.optional(S.String),
}) {}
export const HistoricalMetrics = S.Array(HistoricalMetric);
export class FilterV2 extends S.Class<FilterV2>("FilterV2")({
  FilterKey: S.optional(S.String),
  FilterValues: S.optional(FilterValueList),
  StringCondition: S.optional(FilterV2StringCondition),
}) {}
export const FiltersV2List = S.Array(FilterV2);
export class MetricV2 extends S.Class<MetricV2>("MetricV2")({
  Name: S.optional(S.String),
  Threshold: S.optional(ThresholdCollections),
  MetricId: S.optional(S.String),
  MetricFilters: S.optional(MetricFiltersV2List),
}) {}
export const MetricsV2 = S.Array(MetricV2);
export class AgentStatusSummary extends S.Class<AgentStatusSummary>(
  "AgentStatusSummary",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export const AgentStatusSummaryList = S.Array(AgentStatusSummary);
export class AnalyticsDataSetsResult extends S.Class<AnalyticsDataSetsResult>(
  "AnalyticsDataSetsResult",
)({ DataSetId: S.optional(S.String), DataSetName: S.optional(S.String) }) {}
export const AnalyticsDataSetsResults = S.Array(AnalyticsDataSetsResult);
export class AssociatedContactSummary extends S.Class<AssociatedContactSummary>(
  "AssociatedContactSummary",
)({
  ContactId: S.optional(S.String),
  ContactArn: S.optional(S.String),
  InitiationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  DisconnectTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  InitialContactId: S.optional(S.String),
  PreviousContactId: S.optional(S.String),
  RelatedContactId: S.optional(S.String),
  InitiationMethod: S.optional(S.String),
  Channel: S.optional(S.String),
}) {}
export const AssociatedContactSummaryList = S.Array(AssociatedContactSummary);
export class AuthenticationProfileSummary extends S.Class<AuthenticationProfileSummary>(
  "AuthenticationProfileSummary",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  IsDefault: S.optional(S.Boolean),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export const AuthenticationProfileSummaryList = S.Array(
  AuthenticationProfileSummary,
);
export class LexBotConfig extends S.Class<LexBotConfig>("LexBotConfig")({
  LexBot: S.optional(LexBot),
  LexV2Bot: S.optional(LexV2Bot),
}) {}
export const LexBotConfigList = S.Array(LexBotConfig);
export class ContactFlowModuleAliasSummary extends S.Class<ContactFlowModuleAliasSummary>(
  "ContactFlowModuleAliasSummary",
)({
  Arn: S.optional(S.String),
  AliasId: S.optional(S.String),
  Version: S.optional(S.Number),
  AliasName: S.optional(S.String),
  AliasDescription: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ContactFlowModuleAliasSummaryList = S.Array(
  ContactFlowModuleAliasSummary,
);
export class ContactFlowModuleSummary extends S.Class<ContactFlowModuleSummary>(
  "ContactFlowModuleSummary",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  State: S.optional(S.String),
}) {}
export const ContactFlowModulesSummaryList = S.Array(ContactFlowModuleSummary);
export class ContactFlowModuleVersionSummary extends S.Class<ContactFlowModuleVersionSummary>(
  "ContactFlowModuleVersionSummary",
)({
  Arn: S.optional(S.String),
  VersionDescription: S.optional(S.String),
  Version: S.optional(S.Number),
}) {}
export const ContactFlowModuleVersionSummaryList = S.Array(
  ContactFlowModuleVersionSummary,
);
export class ContactFlowSummary extends S.Class<ContactFlowSummary>(
  "ContactFlowSummary",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  ContactFlowType: S.optional(S.String),
  ContactFlowState: S.optional(S.String),
  ContactFlowStatus: S.optional(S.String),
}) {}
export const ContactFlowSummaryList = S.Array(ContactFlowSummary);
export class ContactFlowVersionSummary extends S.Class<ContactFlowVersionSummary>(
  "ContactFlowVersionSummary",
)({
  Arn: S.optional(S.String),
  VersionDescription: S.optional(S.String),
  Version: S.optional(S.Number),
}) {}
export const ContactFlowVersionSummaryList = S.Array(ContactFlowVersionSummary);
export class DataTableSummary extends S.Class<DataTableSummary>(
  "DataTableSummary",
)({
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export const DataTableSummaryList = S.Array(DataTableSummary);
export class DefaultVocabulary extends S.Class<DefaultVocabulary>(
  "DefaultVocabulary",
)({
  InstanceId: S.String,
  LanguageCode: S.String,
  VocabularyId: S.String,
  VocabularyName: S.String,
}) {}
export const DefaultVocabularyList = S.Array(DefaultVocabulary);
export class EvaluationFormSummary extends S.Class<EvaluationFormSummary>(
  "EvaluationFormSummary",
)({
  EvaluationFormId: S.String,
  EvaluationFormArn: S.String,
  Title: S.String,
  CreatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  CreatedBy: S.String,
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedBy: S.String,
  LastActivatedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastActivatedBy: S.optional(S.String),
  LatestVersion: S.Number,
  ActiveVersion: S.optional(S.Number),
}) {}
export const EvaluationFormSummaryList = S.Array(EvaluationFormSummary);
export class EvaluationFormVersionSummary extends S.Class<EvaluationFormVersionSummary>(
  "EvaluationFormVersionSummary",
)({
  EvaluationFormArn: S.String,
  EvaluationFormId: S.String,
  EvaluationFormVersion: S.Number,
  Locked: S.Boolean,
  Status: S.String,
  CreatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  CreatedBy: S.String,
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedBy: S.String,
}) {}
export const EvaluationFormVersionSummaryList = S.Array(
  EvaluationFormVersionSummary,
);
export class HoursOfOperationSummary extends S.Class<HoursOfOperationSummary>(
  "HoursOfOperationSummary",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export const HoursOfOperationSummaryList = S.Array(HoursOfOperationSummary);
export class InstanceSummary extends S.Class<InstanceSummary>(
  "InstanceSummary",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  IdentityManagementType: S.optional(S.String),
  InstanceAlias: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ServiceRole: S.optional(S.String),
  InstanceStatus: S.optional(S.String),
  InboundCallsEnabled: S.optional(S.Boolean),
  OutboundCallsEnabled: S.optional(S.Boolean),
  InstanceAccessUrl: S.optional(S.String),
}) {}
export const InstanceSummaryList = S.Array(InstanceSummary);
export class IntegrationAssociationSummary extends S.Class<IntegrationAssociationSummary>(
  "IntegrationAssociationSummary",
)({
  IntegrationAssociationId: S.optional(S.String),
  IntegrationAssociationArn: S.optional(S.String),
  InstanceId: S.optional(S.String),
  IntegrationType: S.optional(S.String),
  IntegrationArn: S.optional(S.String),
  SourceApplicationUrl: S.optional(S.String),
  SourceApplicationName: S.optional(S.String),
  SourceType: S.optional(S.String),
}) {}
export const IntegrationAssociationSummaryList = S.Array(
  IntegrationAssociationSummary,
);
export class PhoneNumberSummary extends S.Class<PhoneNumberSummary>(
  "PhoneNumberSummary",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  PhoneNumber: S.optional(S.String),
  PhoneNumberType: S.optional(S.String),
  PhoneNumberCountryCode: S.optional(S.String),
}) {}
export const PhoneNumberSummaryList = S.Array(PhoneNumberSummary);
export class ListPhoneNumbersSummary extends S.Class<ListPhoneNumbersSummary>(
  "ListPhoneNumbersSummary",
)({
  PhoneNumberId: S.optional(S.String),
  PhoneNumberArn: S.optional(S.String),
  PhoneNumber: S.optional(S.String),
  PhoneNumberCountryCode: S.optional(S.String),
  PhoneNumberType: S.optional(S.String),
  TargetArn: S.optional(S.String),
  InstanceId: S.optional(S.String),
  PhoneNumberDescription: S.optional(S.String),
  SourcePhoneNumberArn: S.optional(S.String),
}) {}
export const ListPhoneNumbersSummaryList = S.Array(ListPhoneNumbersSummary);
export class PredefinedAttributeSummary extends S.Class<PredefinedAttributeSummary>(
  "PredefinedAttributeSummary",
)({
  Name: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export const PredefinedAttributeSummaryList = S.Array(
  PredefinedAttributeSummary,
);
export class PromptSummary extends S.Class<PromptSummary>("PromptSummary")({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export const PromptSummaryList = S.Array(PromptSummary);
export class QueueSummary extends S.Class<QueueSummary>("QueueSummary")({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  QueueType: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export const QueueSummaryList = S.Array(QueueSummary);
export class RoutingProfileManualAssignmentQueueConfigSummary extends S.Class<RoutingProfileManualAssignmentQueueConfigSummary>(
  "RoutingProfileManualAssignmentQueueConfigSummary",
)({
  QueueId: S.String,
  QueueArn: S.String,
  QueueName: S.String,
  Channel: S.String,
}) {}
export const RoutingProfileManualAssignmentQueueConfigSummaryList = S.Array(
  RoutingProfileManualAssignmentQueueConfigSummary,
);
export class RoutingProfileQueueConfigSummary extends S.Class<RoutingProfileQueueConfigSummary>(
  "RoutingProfileQueueConfigSummary",
)({
  QueueId: S.String,
  QueueArn: S.String,
  QueueName: S.String,
  Priority: S.Number,
  Delay: S.Number,
  Channel: S.String,
}) {}
export const RoutingProfileQueueConfigSummaryList = S.Array(
  RoutingProfileQueueConfigSummary,
);
export class RoutingProfileSummary extends S.Class<RoutingProfileSummary>(
  "RoutingProfileSummary",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export const RoutingProfileSummaryList = S.Array(RoutingProfileSummary);
export class SecurityKey extends S.Class<SecurityKey>("SecurityKey")({
  AssociationId: S.optional(S.String),
  Key: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const SecurityKeysList = S.Array(SecurityKey);
export class SecurityProfileSummary extends S.Class<SecurityProfileSummary>(
  "SecurityProfileSummary",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export const SecurityProfileSummaryList = S.Array(SecurityProfileSummary);
export class TaskTemplateMetadata extends S.Class<TaskTemplateMetadata>(
  "TaskTemplateMetadata",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const TaskTemplateList = S.Array(TaskTemplateMetadata);
export class TrafficDistributionGroupSummary extends S.Class<TrafficDistributionGroupSummary>(
  "TrafficDistributionGroupSummary",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  InstanceArn: S.optional(S.String),
  Status: S.optional(S.String),
  IsDefault: S.optional(S.Boolean),
}) {}
export const TrafficDistributionGroupSummaryList = S.Array(
  TrafficDistributionGroupSummary,
);
export class TrafficDistributionGroupUserSummary extends S.Class<TrafficDistributionGroupUserSummary>(
  "TrafficDistributionGroupUserSummary",
)({ UserId: S.optional(S.String) }) {}
export const TrafficDistributionGroupUserSummaryList = S.Array(
  TrafficDistributionGroupUserSummary,
);
export class UseCase extends S.Class<UseCase>("UseCase")({
  UseCaseId: S.optional(S.String),
  UseCaseArn: S.optional(S.String),
  UseCaseType: S.optional(S.String),
}) {}
export const UseCaseSummaryList = S.Array(UseCase);
export class HierarchyGroupSummary extends S.Class<HierarchyGroupSummary>(
  "HierarchyGroupSummary",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export const HierarchyGroupSummaryList = S.Array(HierarchyGroupSummary);
export class UserSummary extends S.Class<UserSummary>("UserSummary")({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Username: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export const UserSummaryList = S.Array(UserSummary);
export class ViewSummary extends S.Class<ViewSummary>("ViewSummary")({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  Status: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export const ViewsSummaryList = S.Array(ViewSummary);
export class ViewVersionSummary extends S.Class<ViewVersionSummary>(
  "ViewVersionSummary",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Description: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  Version: S.optional(S.Number),
  VersionDescription: S.optional(S.String),
}) {}
export const ViewVersionSummaryList = S.Array(ViewVersionSummary);
export class MediaItem extends S.Class<MediaItem>("MediaItem")({
  Type: S.optional(S.String),
  Source: S.optional(S.String),
}) {}
export const MediaList = S.Array(MediaItem);
export class WorkspacePage extends S.Class<WorkspacePage>("WorkspacePage")({
  ResourceArn: S.optional(S.String),
  Page: S.optional(S.String),
  Slug: S.optional(S.String),
  InputData: S.optional(S.String),
}) {}
export const WorkspacePageList = S.Array(WorkspacePage);
export class WorkspaceSummary extends S.Class<WorkspaceSummary>(
  "WorkspaceSummary",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export const WorkspaceSummaryList = S.Array(WorkspaceSummary);
export class AgentStatusSearchCriteria extends S.Class<AgentStatusSearchCriteria>(
  "AgentStatusSearchCriteria",
)({
  OrConditions: S.optional(S.suspend(() => AgentStatusSearchConditionList)),
  AndConditions: S.optional(S.suspend(() => AgentStatusSearchConditionList)),
  StringCondition: S.optional(StringCondition),
}) {}
export class AvailableNumberSummary extends S.Class<AvailableNumberSummary>(
  "AvailableNumberSummary",
)({
  PhoneNumber: S.optional(S.String),
  PhoneNumberCountryCode: S.optional(S.String),
  PhoneNumberType: S.optional(S.String),
}) {}
export const AvailableNumbersList = S.Array(AvailableNumberSummary);
export class EvaluationSearchCriteria extends S.Class<EvaluationSearchCriteria>(
  "EvaluationSearchCriteria",
)({
  OrConditions: S.optional(S.suspend(() => EvaluationSearchConditionList)),
  AndConditions: S.optional(S.suspend(() => EvaluationSearchConditionList)),
  StringCondition: S.optional(StringCondition),
  NumberCondition: S.optional(NumberCondition),
  BooleanCondition: S.optional(BooleanCondition),
  DateTimeCondition: S.optional(DateTimeCondition),
  DecimalCondition: S.optional(DecimalCondition),
}) {}
export class ContactFlowModuleSearchFilter extends S.Class<ContactFlowModuleSearchFilter>(
  "ContactFlowModuleSearchFilter",
)({ TagFilter: S.optional(ControlPlaneTagFilter) }) {}
export const DataTableList = S.Array(DataTable);
export class HoursOfOperationOverrideSearchCriteria extends S.Class<HoursOfOperationOverrideSearchCriteria>(
  "HoursOfOperationOverrideSearchCriteria",
)({
  OrConditions: S.optional(
    S.suspend(() => HoursOfOperationOverrideSearchConditionList),
  ),
  AndConditions: S.optional(
    S.suspend(() => HoursOfOperationOverrideSearchConditionList),
  ),
  StringCondition: S.optional(StringCondition),
  DateCondition: S.optional(DateCondition),
}) {}
export const HoursOfOperationList = S.Array(HoursOfOperation);
export class PredefinedAttributeConfiguration extends S.Class<PredefinedAttributeConfiguration>(
  "PredefinedAttributeConfiguration",
)({
  EnableValueValidationOnAssociation: S.optional(S.Boolean),
  IsReadOnly: S.optional(S.Boolean),
}) {}
export class PredefinedAttribute extends S.Class<PredefinedAttribute>(
  "PredefinedAttribute",
)({
  Name: S.optional(S.String),
  Values: S.optional(PredefinedAttributeValues),
  Purposes: S.optional(PredefinedAttributePurposeNameList),
  AttributeConfiguration: S.optional(PredefinedAttributeConfiguration),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export const PredefinedAttributeSearchSummaryList =
  S.Array(PredefinedAttribute);
export const PromptList = S.Array(Prompt);
export const QueueSearchSummaryList = S.Array(Queue);
export const QuickConnectSearchSummaryList = S.Array(QuickConnect);
export class ResourceTagsSearchCriteria extends S.Class<ResourceTagsSearchCriteria>(
  "ResourceTagsSearchCriteria",
)({ TagSearchCondition: S.optional(TagSearchCondition) }) {}
export const RoutingProfileList = S.Array(RoutingProfile);
export class HierarchyPath extends S.Class<HierarchyPath>("HierarchyPath")({
  LevelOne: S.optional(HierarchyGroupSummary),
  LevelTwo: S.optional(HierarchyGroupSummary),
  LevelThree: S.optional(HierarchyGroupSummary),
  LevelFour: S.optional(HierarchyGroupSummary),
  LevelFive: S.optional(HierarchyGroupSummary),
}) {}
export class HierarchyGroup extends S.Class<HierarchyGroup>("HierarchyGroup")({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  LevelId: S.optional(S.String),
  HierarchyPath: S.optional(HierarchyPath),
  Tags: S.optional(TagMap),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export const UserHierarchyGroupList = S.Array(HierarchyGroup);
export const ViewSearchSummaryList = S.Array(View);
export class VocabularySummary extends S.Class<VocabularySummary>(
  "VocabularySummary",
)({
  Name: S.String,
  Id: S.String,
  Arn: S.String,
  LanguageCode: S.String,
  State: S.String,
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  FailureReason: S.optional(S.String),
}) {}
export const VocabularySummaryList = S.Array(VocabularySummary);
export class HierarchyStructureUpdate extends S.Class<HierarchyStructureUpdate>(
  "HierarchyStructureUpdate",
)({
  LevelOne: S.optional(HierarchyLevelUpdate),
  LevelTwo: S.optional(HierarchyLevelUpdate),
  LevelThree: S.optional(HierarchyLevelUpdate),
  LevelFour: S.optional(HierarchyLevelUpdate),
  LevelFive: S.optional(HierarchyLevelUpdate),
}) {}
export type SegmentAttributeValueMap = { [key: string]: SegmentAttributeValue };
export const SegmentAttributeValueMap = S.Record({
  key: S.String,
  value: S.suspend(
    (): S.Schema<SegmentAttributeValue, any> => SegmentAttributeValue,
  ),
}) as any as S.Schema<SegmentAttributeValueMap>;
export class ContactFlowTypeCondition extends S.Class<ContactFlowTypeCondition>(
  "ContactFlowTypeCondition",
)({ ContactFlowType: S.optional(S.String) }) {}
export class ContactFlowAttributeAndCondition extends S.Class<ContactFlowAttributeAndCondition>(
  "ContactFlowAttributeAndCondition",
)({
  TagConditions: S.optional(TagAndConditionList),
  ContactFlowTypeCondition: S.optional(ContactFlowTypeCondition),
}) {}
export const ContactFlowAttributeOrConditionList = S.Array(
  ContactFlowAttributeAndCondition,
);
export class SearchableContactAttributesCriteria extends S.Class<SearchableContactAttributesCriteria>(
  "SearchableContactAttributesCriteria",
)({ Key: S.String, Values: SearchableContactAttributeValueList }) {}
export const SearchableContactAttributesCriteriaList = S.Array(
  SearchableContactAttributesCriteria,
);
export class SearchableSegmentAttributesCriteria extends S.Class<SearchableSegmentAttributesCriteria>(
  "SearchableSegmentAttributesCriteria",
)({ Key: S.String, Values: SearchableSegmentAttributeValueList }) {}
export const SearchableSegmentAttributesCriteriaList = S.Array(
  SearchableSegmentAttributesCriteria,
);
export class AttributeAndCondition extends S.Class<AttributeAndCondition>(
  "AttributeAndCondition",
)({
  TagConditions: S.optional(TagAndConditionList),
  HierarchyGroupCondition: S.optional(HierarchyGroupCondition),
}) {}
export const AttributeOrConditionList = S.Array(AttributeAndCondition);
export class Condition extends S.Class<Condition>("Condition")({
  StringCondition: S.optional(StringCondition),
  NumberCondition: S.optional(NumberCondition),
}) {}
export const Conditions = S.Array(Condition);
export const EmailHeaders = S.Record({ key: S.String, value: S.String });
export class RoutingCriteriaInputStepExpiry extends S.Class<RoutingCriteriaInputStepExpiry>(
  "RoutingCriteriaInputStepExpiry",
)({ DurationInSeconds: S.optional(S.Number) }) {}
export class AssociateWorkspaceResponse extends S.Class<AssociateWorkspaceResponse>(
  "AssociateWorkspaceResponse",
)({
  SuccessfulList: S.optional(SuccessfulBatchAssociationSummaryList),
  FailedList: S.optional(FailedBatchAssociationSummaryList),
}) {}
export class BatchAssociateAnalyticsDataSetResponse extends S.Class<BatchAssociateAnalyticsDataSetResponse>(
  "BatchAssociateAnalyticsDataSetResponse",
)({
  Created: S.optional(AnalyticsDataAssociationResults),
  Errors: S.optional(ErrorResults),
}) {}
export class BatchGetAttachedFileMetadataResponse extends S.Class<BatchGetAttachedFileMetadataResponse>(
  "BatchGetAttachedFileMetadataResponse",
)({
  Files: S.optional(AttachedFilesList),
  Errors: S.optional(AttachedFileErrorsList),
}) {}
export class BatchGetFlowAssociationResponse extends S.Class<BatchGetFlowAssociationResponse>(
  "BatchGetFlowAssociationResponse",
)({ FlowAssociationSummaryList: S.optional(FlowAssociationSummaryList) }) {}
export class BatchPutContactRequest extends S.Class<BatchPutContactRequest>(
  "BatchPutContactRequest",
)(
  {
    ClientToken: S.optional(S.String),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactDataRequestList: ContactDataRequestList,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/contact/batch/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchUpdateDataTableValueResponse extends S.Class<BatchUpdateDataTableValueResponse>(
  "BatchUpdateDataTableValueResponse",
)({
  Successful: BatchUpdateDataTableValueSuccessResultList,
  Failed: BatchUpdateDataTableValueFailureResultList,
}) {}
export class ClaimPhoneNumberResponse extends S.Class<ClaimPhoneNumberResponse>(
  "ClaimPhoneNumberResponse",
)({
  PhoneNumberId: S.optional(S.String),
  PhoneNumberArn: S.optional(S.String),
}) {}
export class CreateContactFlowModuleResponse extends S.Class<CreateContactFlowModuleResponse>(
  "CreateContactFlowModuleResponse",
)({ Id: S.optional(S.String), Arn: S.optional(S.String) }) {}
export class CreateDataTableAttributeRequest extends S.Class<CreateDataTableAttributeRequest>(
  "CreateDataTableAttributeRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    DataTableId: S.String.pipe(T.HttpLabel("DataTableId")),
    Name: S.String,
    ValueType: S.String,
    Description: S.optional(S.String),
    Primary: S.optional(S.Boolean),
    Validation: S.optional(Validation),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/data-tables/{InstanceId}/{DataTableId}/attributes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateHoursOfOperationRequest extends S.Class<CreateHoursOfOperationRequest>(
  "CreateHoursOfOperationRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Name: S.String,
    Description: S.optional(S.String),
    TimeZone: S.String,
    Config: HoursOfOperationConfigList,
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/hours-of-operations/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateHoursOfOperationOverrideRequest extends S.Class<CreateHoursOfOperationOverrideRequest>(
  "CreateHoursOfOperationOverrideRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    HoursOfOperationId: S.String.pipe(T.HttpLabel("HoursOfOperationId")),
    Name: S.String,
    Description: S.optional(S.String),
    Config: HoursOfOperationOverrideConfigList,
    EffectiveFrom: S.String,
    EffectiveTill: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/hours-of-operations/{InstanceId}/{HoursOfOperationId}/overrides",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateParticipantRequest extends S.Class<CreateParticipantRequest>(
  "CreateParticipantRequest",
)(
  {
    InstanceId: S.String,
    ContactId: S.String,
    ClientToken: S.optional(S.String),
    ParticipantDetails: ParticipantDetailsToAdd,
  },
  T.all(
    T.Http({ method: "POST", uri: "/contact/create-participant" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePushNotificationRegistrationResponse extends S.Class<CreatePushNotificationRegistrationResponse>(
  "CreatePushNotificationRegistrationResponse",
)({ RegistrationId: S.String }) {}
export class CreateQueueResponse extends S.Class<CreateQueueResponse>(
  "CreateQueueResponse",
)({ QueueArn: S.optional(S.String), QueueId: S.optional(S.String) }) {}
export class CreateQuickConnectRequest extends S.Class<CreateQuickConnectRequest>(
  "CreateQuickConnectRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Name: S.String,
    Description: S.optional(S.String),
    QuickConnectConfig: QuickConnectConfig,
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/quick-connects/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRoutingProfileRequest extends S.Class<CreateRoutingProfileRequest>(
  "CreateRoutingProfileRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Name: S.String,
    Description: S.String,
    DefaultOutboundQueueId: S.String,
    QueueConfigs: S.optional(RoutingProfileQueueConfigList),
    ManualAssignmentQueueConfigs: S.optional(
      RoutingProfileManualAssignmentQueueConfigList,
    ),
    MediaConcurrencies: MediaConcurrencies,
    Tags: S.optional(TagMap),
    AgentAvailabilityTimer: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/routing-profiles/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTaskTemplateRequest extends S.Class<CreateTaskTemplateRequest>(
  "CreateTaskTemplateRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Name: S.String,
    Description: S.optional(S.String),
    ContactFlowId: S.optional(S.String),
    SelfAssignFlowId: S.optional(S.String),
    Constraints: S.optional(TaskTemplateConstraints),
    Defaults: S.optional(TaskTemplateDefaults),
    Status: S.optional(S.String),
    Fields: TaskTemplateFields,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/instance/{InstanceId}/task/template" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateUserResponse extends S.Class<CreateUserResponse>(
  "CreateUserResponse",
)({ UserId: S.optional(S.String), UserArn: S.optional(S.String) }) {}
export class CreateViewResponse extends S.Class<CreateViewResponse>(
  "CreateViewResponse",
)({ View: S.optional(View) }) {}
export class DescribeAgentStatusResponse extends S.Class<DescribeAgentStatusResponse>(
  "DescribeAgentStatusResponse",
)({ AgentStatus: S.optional(AgentStatus) }) {}
export class DescribeAuthenticationProfileResponse extends S.Class<DescribeAuthenticationProfileResponse>(
  "DescribeAuthenticationProfileResponse",
)({ AuthenticationProfile: S.optional(AuthenticationProfile) }) {}
export class DescribeContactFlowResponse extends S.Class<DescribeContactFlowResponse>(
  "DescribeContactFlowResponse",
)({ ContactFlow: S.optional(ContactFlow) }) {}
export class DescribeContactFlowModuleResponse extends S.Class<DescribeContactFlowModuleResponse>(
  "DescribeContactFlowModuleResponse",
)({ ContactFlowModule: S.optional(ContactFlowModule) }) {}
export class DescribeContactFlowModuleAliasResponse extends S.Class<DescribeContactFlowModuleAliasResponse>(
  "DescribeContactFlowModuleAliasResponse",
)({ ContactFlowModuleAlias: S.optional(ContactFlowModuleAliasInfo) }) {}
export class DescribeDataTableResponse extends S.Class<DescribeDataTableResponse>(
  "DescribeDataTableResponse",
)({ DataTable: DataTable }) {}
export class DescribeDataTableAttributeResponse extends S.Class<DescribeDataTableAttributeResponse>(
  "DescribeDataTableAttributeResponse",
)({ Attribute: DataTableAttribute }) {}
export class DescribeEvaluationFormResponse extends S.Class<DescribeEvaluationFormResponse>(
  "DescribeEvaluationFormResponse",
)({ EvaluationForm: EvaluationForm }) {}
export class DescribeHoursOfOperationResponse extends S.Class<DescribeHoursOfOperationResponse>(
  "DescribeHoursOfOperationResponse",
)({ HoursOfOperation: S.optional(HoursOfOperation) }) {}
export class DescribeHoursOfOperationOverrideResponse extends S.Class<DescribeHoursOfOperationOverrideResponse>(
  "DescribeHoursOfOperationOverrideResponse",
)({ HoursOfOperationOverride: S.optional(HoursOfOperationOverride) }) {}
export class DescribeInstanceAttributeResponse extends S.Class<DescribeInstanceAttributeResponse>(
  "DescribeInstanceAttributeResponse",
)({ Attribute: S.optional(Attribute) }) {}
export class DescribePromptResponse extends S.Class<DescribePromptResponse>(
  "DescribePromptResponse",
)({ Prompt: S.optional(Prompt) }) {}
export class DescribeQueueResponse extends S.Class<DescribeQueueResponse>(
  "DescribeQueueResponse",
)({ Queue: S.optional(Queue) }) {}
export class DescribeQuickConnectResponse extends S.Class<DescribeQuickConnectResponse>(
  "DescribeQuickConnectResponse",
)({ QuickConnect: S.optional(QuickConnect) }) {}
export class DescribeRoutingProfileResponse extends S.Class<DescribeRoutingProfileResponse>(
  "DescribeRoutingProfileResponse",
)({ RoutingProfile: S.optional(RoutingProfile) }) {}
export class DescribeRuleResponse extends S.Class<DescribeRuleResponse>(
  "DescribeRuleResponse",
)({ Rule: Rule }) {}
export class DescribeSecurityProfileResponse extends S.Class<DescribeSecurityProfileResponse>(
  "DescribeSecurityProfileResponse",
)({ SecurityProfile: S.optional(SecurityProfile) }) {}
export class DescribeTrafficDistributionGroupResponse extends S.Class<DescribeTrafficDistributionGroupResponse>(
  "DescribeTrafficDistributionGroupResponse",
)({ TrafficDistributionGroup: S.optional(TrafficDistributionGroup) }) {}
export class DescribeUserResponse extends S.Class<DescribeUserResponse>(
  "DescribeUserResponse",
)({ User: S.optional(User) }) {}
export class DescribeVocabularyResponse extends S.Class<DescribeVocabularyResponse>(
  "DescribeVocabularyResponse",
)({ Vocabulary: Vocabulary }) {}
export class DescribeWorkspaceResponse extends S.Class<DescribeWorkspaceResponse>(
  "DescribeWorkspaceResponse",
)({ Workspace: Workspace }) {}
export class GetAttachedFileResponse extends S.Class<GetAttachedFileResponse>(
  "GetAttachedFileResponse",
)({
  FileArn: S.optional(S.String),
  FileId: S.optional(S.String),
  CreationTime: S.optional(S.String),
  FileStatus: S.optional(S.String),
  FileName: S.optional(S.String),
  FileSizeInBytes: S.Number,
  AssociatedResourceArn: S.optional(S.String),
  FileUseCaseType: S.optional(S.String),
  CreatedBy: S.optional(CreatedByInfo),
  DownloadUrlMetadata: S.optional(DownloadUrlMetadata),
  Tags: S.optional(TagMap),
}) {}
export class GetCurrentUserDataRequest extends S.Class<GetCurrentUserDataRequest>(
  "GetCurrentUserDataRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Filters: UserDataFilters,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/metrics/userdata/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFederationTokenResponse extends S.Class<GetFederationTokenResponse>(
  "GetFederationTokenResponse",
)({
  Credentials: S.optional(Credentials),
  SignInUrl: S.optional(S.String),
  UserArn: S.optional(S.String),
  UserId: S.optional(S.String),
}) {}
export class GetMetricDataRequest extends S.Class<GetMetricDataRequest>(
  "GetMetricDataRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Filters: Filters,
    Groupings: S.optional(Groupings),
    HistoricalMetrics: HistoricalMetrics,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/metrics/historical/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMetricDataV2Request extends S.Class<GetMetricDataV2Request>(
  "GetMetricDataV2Request",
)(
  {
    ResourceArn: S.String,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Interval: S.optional(IntervalDetails),
    Filters: FiltersV2List,
    Groupings: S.optional(GroupingsV2),
    Metrics: MetricsV2,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/metrics/data" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAgentStatusResponse extends S.Class<ListAgentStatusResponse>(
  "ListAgentStatusResponse",
)({
  NextToken: S.optional(S.String),
  AgentStatusSummaryList: S.optional(AgentStatusSummaryList),
}) {}
export class ListAnalyticsDataLakeDataSetsResponse extends S.Class<ListAnalyticsDataLakeDataSetsResponse>(
  "ListAnalyticsDataLakeDataSetsResponse",
)({
  Results: S.optional(AnalyticsDataSetsResults),
  NextToken: S.optional(S.String),
}) {}
export class ListAssociatedContactsResponse extends S.Class<ListAssociatedContactsResponse>(
  "ListAssociatedContactsResponse",
)({
  ContactSummaryList: S.optional(AssociatedContactSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListAuthenticationProfilesResponse extends S.Class<ListAuthenticationProfilesResponse>(
  "ListAuthenticationProfilesResponse",
)({
  AuthenticationProfileSummaryList: S.optional(
    AuthenticationProfileSummaryList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListBotsResponse extends S.Class<ListBotsResponse>(
  "ListBotsResponse",
)({ LexBots: S.optional(LexBotConfigList), NextToken: S.optional(S.String) }) {}
export class ListContactFlowModuleAliasesResponse extends S.Class<ListContactFlowModuleAliasesResponse>(
  "ListContactFlowModuleAliasesResponse",
)({
  ContactFlowModuleAliasSummaryList: S.optional(
    ContactFlowModuleAliasSummaryList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListContactFlowModulesResponse extends S.Class<ListContactFlowModulesResponse>(
  "ListContactFlowModulesResponse",
)({
  ContactFlowModulesSummaryList: S.optional(ContactFlowModulesSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListContactFlowModuleVersionsResponse extends S.Class<ListContactFlowModuleVersionsResponse>(
  "ListContactFlowModuleVersionsResponse",
)({
  ContactFlowModuleVersionSummaryList: S.optional(
    ContactFlowModuleVersionSummaryList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListContactFlowsResponse extends S.Class<ListContactFlowsResponse>(
  "ListContactFlowsResponse",
)({
  ContactFlowSummaryList: S.optional(ContactFlowSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListContactFlowVersionsResponse extends S.Class<ListContactFlowVersionsResponse>(
  "ListContactFlowVersionsResponse",
)({
  ContactFlowVersionSummaryList: S.optional(ContactFlowVersionSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListDataTablesResponse extends S.Class<ListDataTablesResponse>(
  "ListDataTablesResponse",
)({
  NextToken: S.optional(S.String),
  DataTableSummaryList: DataTableSummaryList,
}) {}
export class ListDefaultVocabulariesResponse extends S.Class<ListDefaultVocabulariesResponse>(
  "ListDefaultVocabulariesResponse",
)({
  DefaultVocabularyList: DefaultVocabularyList,
  NextToken: S.optional(S.String),
}) {}
export class ListEvaluationFormsResponse extends S.Class<ListEvaluationFormsResponse>(
  "ListEvaluationFormsResponse",
)({
  EvaluationFormSummaryList: EvaluationFormSummaryList,
  NextToken: S.optional(S.String),
}) {}
export class ListEvaluationFormVersionsResponse extends S.Class<ListEvaluationFormVersionsResponse>(
  "ListEvaluationFormVersionsResponse",
)({
  EvaluationFormVersionSummaryList: EvaluationFormVersionSummaryList,
  NextToken: S.optional(S.String),
}) {}
export class ListHoursOfOperationsResponse extends S.Class<ListHoursOfOperationsResponse>(
  "ListHoursOfOperationsResponse",
)({
  HoursOfOperationSummaryList: S.optional(HoursOfOperationSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListInstancesResponse extends S.Class<ListInstancesResponse>(
  "ListInstancesResponse",
)({
  InstanceSummaryList: S.optional(InstanceSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListIntegrationAssociationsResponse extends S.Class<ListIntegrationAssociationsResponse>(
  "ListIntegrationAssociationsResponse",
)({
  IntegrationAssociationSummaryList: S.optional(
    IntegrationAssociationSummaryList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListPhoneNumbersResponse extends S.Class<ListPhoneNumbersResponse>(
  "ListPhoneNumbersResponse",
)({
  PhoneNumberSummaryList: S.optional(PhoneNumberSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListPhoneNumbersV2Response extends S.Class<ListPhoneNumbersV2Response>(
  "ListPhoneNumbersV2Response",
)({
  NextToken: S.optional(S.String),
  ListPhoneNumbersSummaryList: S.optional(ListPhoneNumbersSummaryList),
}) {}
export class ListPredefinedAttributesResponse extends S.Class<ListPredefinedAttributesResponse>(
  "ListPredefinedAttributesResponse",
)({
  NextToken: S.optional(S.String),
  PredefinedAttributeSummaryList: S.optional(PredefinedAttributeSummaryList),
}) {}
export class ListPromptsResponse extends S.Class<ListPromptsResponse>(
  "ListPromptsResponse",
)({
  PromptSummaryList: S.optional(PromptSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListQueueQuickConnectsResponse extends S.Class<ListQueueQuickConnectsResponse>(
  "ListQueueQuickConnectsResponse",
)({
  NextToken: S.optional(S.String),
  QuickConnectSummaryList: S.optional(QuickConnectSummaryList),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export class ListQueuesResponse extends S.Class<ListQueuesResponse>(
  "ListQueuesResponse",
)({
  QueueSummaryList: S.optional(QueueSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListRoutingProfileManualAssignmentQueuesResponse extends S.Class<ListRoutingProfileManualAssignmentQueuesResponse>(
  "ListRoutingProfileManualAssignmentQueuesResponse",
)({
  NextToken: S.optional(S.String),
  RoutingProfileManualAssignmentQueueConfigSummaryList: S.optional(
    RoutingProfileManualAssignmentQueueConfigSummaryList,
  ),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export class ListRoutingProfileQueuesResponse extends S.Class<ListRoutingProfileQueuesResponse>(
  "ListRoutingProfileQueuesResponse",
)({
  NextToken: S.optional(S.String),
  RoutingProfileQueueConfigSummaryList: S.optional(
    RoutingProfileQueueConfigSummaryList,
  ),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export class ListRoutingProfilesResponse extends S.Class<ListRoutingProfilesResponse>(
  "ListRoutingProfilesResponse",
)({
  RoutingProfileSummaryList: S.optional(RoutingProfileSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListSecurityKeysResponse extends S.Class<ListSecurityKeysResponse>(
  "ListSecurityKeysResponse",
)({
  SecurityKeys: S.optional(SecurityKeysList),
  NextToken: S.optional(S.String),
}) {}
export class ListSecurityProfilesResponse extends S.Class<ListSecurityProfilesResponse>(
  "ListSecurityProfilesResponse",
)({
  SecurityProfileSummaryList: S.optional(SecurityProfileSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListTaskTemplatesResponse extends S.Class<ListTaskTemplatesResponse>(
  "ListTaskTemplatesResponse",
)({
  TaskTemplates: S.optional(TaskTemplateList),
  NextToken: S.optional(S.String),
}) {}
export class ListTrafficDistributionGroupsResponse extends S.Class<ListTrafficDistributionGroupsResponse>(
  "ListTrafficDistributionGroupsResponse",
)({
  NextToken: S.optional(S.String),
  TrafficDistributionGroupSummaryList: S.optional(
    TrafficDistributionGroupSummaryList,
  ),
}) {}
export class ListTrafficDistributionGroupUsersResponse extends S.Class<ListTrafficDistributionGroupUsersResponse>(
  "ListTrafficDistributionGroupUsersResponse",
)({
  NextToken: S.optional(S.String),
  TrafficDistributionGroupUserSummaryList: S.optional(
    TrafficDistributionGroupUserSummaryList,
  ),
}) {}
export class ListUseCasesResponse extends S.Class<ListUseCasesResponse>(
  "ListUseCasesResponse",
)({
  UseCaseSummaryList: S.optional(UseCaseSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListUserHierarchyGroupsResponse extends S.Class<ListUserHierarchyGroupsResponse>(
  "ListUserHierarchyGroupsResponse",
)({
  UserHierarchyGroupSummaryList: S.optional(HierarchyGroupSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListUsersResponse extends S.Class<ListUsersResponse>(
  "ListUsersResponse",
)({
  UserSummaryList: S.optional(UserSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListViewsResponse extends S.Class<ListViewsResponse>(
  "ListViewsResponse",
)({
  ViewsSummaryList: S.optional(ViewsSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListViewVersionsResponse extends S.Class<ListViewVersionsResponse>(
  "ListViewVersionsResponse",
)({
  ViewVersionSummaryList: S.optional(ViewVersionSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListWorkspaceMediaResponse extends S.Class<ListWorkspaceMediaResponse>(
  "ListWorkspaceMediaResponse",
)({ Media: S.optional(MediaList) }) {}
export class ListWorkspacePagesResponse extends S.Class<ListWorkspacePagesResponse>(
  "ListWorkspacePagesResponse",
)({ NextToken: S.optional(S.String), WorkspacePageList: WorkspacePageList }) {}
export class ListWorkspacesResponse extends S.Class<ListWorkspacesResponse>(
  "ListWorkspacesResponse",
)({
  NextToken: S.optional(S.String),
  WorkspaceSummaryList: WorkspaceSummaryList,
}) {}
export class SearchAvailablePhoneNumbersResponse extends S.Class<SearchAvailablePhoneNumbersResponse>(
  "SearchAvailablePhoneNumbersResponse",
)({
  NextToken: S.optional(S.String),
  AvailableNumbersList: S.optional(AvailableNumbersList),
}) {}
export class SearchContactEvaluationsRequest extends S.Class<SearchContactEvaluationsRequest>(
  "SearchContactEvaluationsRequest",
)(
  {
    InstanceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchCriteria: S.optional(EvaluationSearchCriteria),
    SearchFilter: S.optional(EvaluationSearchFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-contact-evaluations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchContactFlowModulesRequest extends S.Class<SearchContactFlowModulesRequest>(
  "SearchContactFlowModulesRequest",
)(
  {
    InstanceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchFilter: S.optional(ContactFlowModuleSearchFilter),
    SearchCriteria: S.optional(ContactFlowModuleSearchCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-contact-flow-modules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchDataTablesResponse extends S.Class<SearchDataTablesResponse>(
  "SearchDataTablesResponse",
)({
  DataTables: S.optional(DataTableList),
  NextToken: S.optional(S.String),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class SearchHoursOfOperationOverridesRequest extends S.Class<SearchHoursOfOperationOverridesRequest>(
  "SearchHoursOfOperationOverridesRequest",
)(
  {
    InstanceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchFilter: S.optional(HoursOfOperationSearchFilter),
    SearchCriteria: S.optional(HoursOfOperationOverrideSearchCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-hours-of-operation-overrides" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchHoursOfOperationsResponse extends S.Class<SearchHoursOfOperationsResponse>(
  "SearchHoursOfOperationsResponse",
)({
  HoursOfOperations: S.optional(HoursOfOperationList),
  NextToken: S.optional(S.String),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class SearchPredefinedAttributesResponse extends S.Class<SearchPredefinedAttributesResponse>(
  "SearchPredefinedAttributesResponse",
)({
  PredefinedAttributes: S.optional(PredefinedAttributeSearchSummaryList),
  NextToken: S.optional(S.String),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class SearchPromptsResponse extends S.Class<SearchPromptsResponse>(
  "SearchPromptsResponse",
)({
  Prompts: S.optional(PromptList),
  NextToken: S.optional(S.String),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class SearchQueuesResponse extends S.Class<SearchQueuesResponse>(
  "SearchQueuesResponse",
)({
  Queues: S.optional(QueueSearchSummaryList),
  NextToken: S.optional(S.String),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class SearchQuickConnectsResponse extends S.Class<SearchQuickConnectsResponse>(
  "SearchQuickConnectsResponse",
)({
  QuickConnects: S.optional(QuickConnectSearchSummaryList),
  NextToken: S.optional(S.String),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class SearchResourceTagsRequest extends S.Class<SearchResourceTagsRequest>(
  "SearchResourceTagsRequest",
)(
  {
    InstanceId: S.String,
    ResourceTypes: S.optional(ResourceTypeList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchCriteria: S.optional(ResourceTagsSearchCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-resource-tags" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchRoutingProfilesResponse extends S.Class<SearchRoutingProfilesResponse>(
  "SearchRoutingProfilesResponse",
)({
  RoutingProfiles: S.optional(RoutingProfileList),
  NextToken: S.optional(S.String),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class SearchUserHierarchyGroupsResponse extends S.Class<SearchUserHierarchyGroupsResponse>(
  "SearchUserHierarchyGroupsResponse",
)({
  UserHierarchyGroups: S.optional(UserHierarchyGroupList),
  NextToken: S.optional(S.String),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class SearchViewsResponse extends S.Class<SearchViewsResponse>(
  "SearchViewsResponse",
)({
  Views: S.optional(ViewSearchSummaryList),
  NextToken: S.optional(S.String),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class SearchVocabulariesResponse extends S.Class<SearchVocabulariesResponse>(
  "SearchVocabulariesResponse",
)({
  VocabularySummaryList: S.optional(VocabularySummaryList),
  NextToken: S.optional(S.String),
}) {}
export class SendChatIntegrationEventResponse extends S.Class<SendChatIntegrationEventResponse>(
  "SendChatIntegrationEventResponse",
)({
  InitialContactId: S.optional(S.String),
  NewChatCreated: S.optional(S.Boolean),
}) {}
export class SendOutboundEmailRequest extends S.Class<SendOutboundEmailRequest>(
  "SendOutboundEmailRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    FromEmailAddress: EmailAddressInfo,
    DestinationEmailAddress: EmailAddressInfo,
    AdditionalRecipients: S.optional(OutboundAdditionalRecipients),
    EmailMessage: OutboundEmailContent,
    TrafficType: S.String,
    SourceCampaign: S.optional(SourceCampaign),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/instance/{InstanceId}/outbound-email" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendOutboundEmailResponse extends S.Class<SendOutboundEmailResponse>(
  "SendOutboundEmailResponse",
)({}) {}
export class StartChatContactResponse extends S.Class<StartChatContactResponse>(
  "StartChatContactResponse",
)({
  ContactId: S.optional(S.String),
  ParticipantId: S.optional(S.String),
  ParticipantToken: S.optional(S.String),
  ContinuedFromContactId: S.optional(S.String),
}) {}
export class StartContactEvaluationResponse extends S.Class<StartContactEvaluationResponse>(
  "StartContactEvaluationResponse",
)({ EvaluationId: S.String, EvaluationArn: S.String }) {}
export class StartContactStreamingResponse extends S.Class<StartContactStreamingResponse>(
  "StartContactStreamingResponse",
)({ StreamingId: S.String }) {}
export class StartOutboundChatContactRequest extends S.Class<StartOutboundChatContactRequest>(
  "StartOutboundChatContactRequest",
)(
  {
    SourceEndpoint: Endpoint,
    DestinationEndpoint: Endpoint,
    InstanceId: S.String,
    SegmentAttributes: SegmentAttributes,
    Attributes: S.optional(Attributes),
    ContactFlowId: S.String,
    ChatDurationInMinutes: S.optional(S.Number),
    ParticipantDetails: S.optional(ParticipantDetails),
    InitialSystemMessage: S.optional(ChatMessage),
    InitialTemplatedSystemMessage: S.optional(TemplatedMessageConfig),
    RelatedContactId: S.optional(S.String),
    SupportedMessagingContentTypes: S.optional(SupportedMessagingContentTypes),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/contact/outbound-chat" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDataTablePrimaryValuesResponse extends S.Class<UpdateDataTablePrimaryValuesResponse>(
  "UpdateDataTablePrimaryValuesResponse",
)({ LockVersion: DataTableLockVersion }) {}
export class UpdateTrafficDistributionRequest extends S.Class<UpdateTrafficDistributionRequest>(
  "UpdateTrafficDistributionRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel("Id")),
    TelephonyConfig: S.optional(TelephonyConfig),
    SignInConfig: S.optional(SignInConfig),
    AgentConfig: S.optional(AgentConfig),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/traffic-distribution/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTrafficDistributionResponse extends S.Class<UpdateTrafficDistributionResponse>(
  "UpdateTrafficDistributionResponse",
)({}) {}
export class UpdateUserHierarchyStructureRequest extends S.Class<UpdateUserHierarchyStructureRequest>(
  "UpdateUserHierarchyStructureRequest",
)(
  {
    HierarchyStructure: HierarchyStructureUpdate,
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/user-hierarchy-structure/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateUserHierarchyStructureResponse extends S.Class<UpdateUserHierarchyStructureResponse>(
  "UpdateUserHierarchyStructureResponse",
)({}) {}
export class QueueInfo extends S.Class<QueueInfo>("QueueInfo")({
  Id: S.optional(S.String),
  EnqueueTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class EndpointInfo extends S.Class<EndpointInfo>("EndpointInfo")({
  Type: S.optional(S.String),
  Address: S.optional(S.String),
  DisplayName: S.optional(S.String),
}) {}
export class DeviceInfo extends S.Class<DeviceInfo>("DeviceInfo")({
  PlatformName: S.optional(S.String),
  PlatformVersion: S.optional(S.String),
  OperatingSystem: S.optional(S.String),
}) {}
export class Customer extends S.Class<Customer>("Customer")({
  DeviceInfo: S.optional(DeviceInfo),
  Capabilities: S.optional(ParticipantCapabilities),
}) {}
export class CustomerVoiceActivity extends S.Class<CustomerVoiceActivity>(
  "CustomerVoiceActivity",
)({
  GreetingStartTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  GreetingEndTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class DisconnectDetails extends S.Class<DisconnectDetails>(
  "DisconnectDetails",
)({ PotentialDisconnectIssue: S.optional(S.String) }) {}
export class RecordingInfo extends S.Class<RecordingInfo>("RecordingInfo")({
  StorageType: S.optional(S.String),
  Location: S.optional(S.String),
  MediaStreamType: S.optional(S.String),
  ParticipantType: S.optional(S.String),
  FragmentStartNumber: S.optional(S.String),
  FragmentStopNumber: S.optional(S.String),
  StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StopTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  DeletionReason: S.optional(S.String),
  UnprocessedTranscriptLocation: S.optional(S.String),
}) {}
export const Recordings = S.Array(RecordingInfo);
export class TaskTemplateInfoV2 extends S.Class<TaskTemplateInfoV2>(
  "TaskTemplateInfoV2",
)({ Arn: S.optional(S.String), Name: S.optional(S.String) }) {}
export class ContactDetails extends S.Class<ContactDetails>("ContactDetails")({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export class GlobalResiliencyMetadata extends S.Class<GlobalResiliencyMetadata>(
  "GlobalResiliencyMetadata",
)({
  ActiveRegion: S.optional(S.String),
  OriginRegion: S.optional(S.String),
  TrafficDistributionGroupId: S.optional(S.String),
}) {}
export class EvaluationScore extends S.Class<EvaluationScore>(
  "EvaluationScore",
)({
  Percentage: S.optional(S.Number),
  NotApplicable: S.optional(S.Boolean),
  AutomaticFail: S.optional(S.Boolean),
  AppliedWeight: S.optional(S.Number),
}) {}
export const EvaluationScoresMap = S.Record({
  key: S.String,
  value: EvaluationScore,
});
export class InstanceStatusReason extends S.Class<InstanceStatusReason>(
  "InstanceStatusReason",
)({ Message: S.optional(S.String) }) {}
export class ReplicationStatusSummary extends S.Class<ReplicationStatusSummary>(
  "ReplicationStatusSummary",
)({
  Region: S.optional(S.String),
  ReplicationStatus: S.optional(S.String),
  ReplicationStatusReason: S.optional(S.String),
}) {}
export const ReplicationStatusSummaryList = S.Array(ReplicationStatusSummary);
export class PhoneNumberStatus extends S.Class<PhoneNumberStatus>(
  "PhoneNumberStatus",
)({ Status: S.optional(S.String), Message: S.optional(S.String) }) {}
export class HierarchyLevel extends S.Class<HierarchyLevel>("HierarchyLevel")({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export class OperationalHour extends S.Class<OperationalHour>(
  "OperationalHour",
)({
  Start: S.optional(OverrideTimeSlice),
  End: S.optional(OverrideTimeSlice),
}) {}
export const OperationalHours = S.Array(OperationalHour);
export class EvaluationAcknowledgementSummary extends S.Class<EvaluationAcknowledgementSummary>(
  "EvaluationAcknowledgementSummary",
)({
  AcknowledgedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AcknowledgedBy: S.optional(S.String),
  AcknowledgerComment: S.optional(S.String),
}) {}
export class EvaluationContactParticipant extends S.Class<EvaluationContactParticipant>(
  "EvaluationContactParticipant",
)({
  ContactParticipantRole: S.optional(S.String),
  ContactParticipantId: S.optional(S.String),
}) {}
export class UrlReference extends S.Class<UrlReference>("UrlReference")({
  Name: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export class AttachmentReference extends S.Class<AttachmentReference>(
  "AttachmentReference",
)({
  Name: S.optional(S.String),
  Value: S.optional(S.String),
  Status: S.optional(S.String),
  Arn: S.optional(S.String),
}) {}
export class EmailMessageReference extends S.Class<EmailMessageReference>(
  "EmailMessageReference",
)({ Name: S.optional(S.String), Arn: S.optional(S.String) }) {}
export class StringReference extends S.Class<StringReference>(
  "StringReference",
)({ Name: S.optional(S.String), Value: S.optional(S.String) }) {}
export class NumberReference extends S.Class<NumberReference>(
  "NumberReference",
)({ Name: S.optional(S.String), Value: S.optional(S.String) }) {}
export class DateReference extends S.Class<DateReference>("DateReference")({
  Name: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export class EmailReference extends S.Class<EmailReference>("EmailReference")({
  Name: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export class PrimaryValueResponse extends S.Class<PrimaryValueResponse>(
  "PrimaryValueResponse",
)({
  AttributeName: S.optional(S.String),
  AttributeId: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const PrimaryValuesResponseSet = S.Array(PrimaryValueResponse);
export const RealTimeContactAnalysisTimeData = S.Union(
  S.Struct({ AbsoluteTime: S.Date.pipe(T.TimestampFormat("date-time")) }),
);
export class RealTimeContactAnalysisSegmentEvent extends S.Class<RealTimeContactAnalysisSegmentEvent>(
  "RealTimeContactAnalysisSegmentEvent",
)({
  Id: S.String,
  ParticipantId: S.optional(S.String),
  ParticipantRole: S.optional(S.String),
  DisplayName: S.optional(S.String),
  EventType: S.String,
  Time: RealTimeContactAnalysisTimeData,
}) {}
export class RealTimeContactAnalysisSegmentPostContactSummary extends S.Class<RealTimeContactAnalysisSegmentPostContactSummary>(
  "RealTimeContactAnalysisSegmentPostContactSummary",
)({
  Content: S.optional(S.String),
  Status: S.String,
  FailureCode: S.optional(S.String),
}) {}
export class ActionSummary extends S.Class<ActionSummary>("ActionSummary")({
  ActionType: S.String,
}) {}
export const ActionSummaries = S.Array(ActionSummary);
export class ContactFlowAttributeFilter extends S.Class<ContactFlowAttributeFilter>(
  "ContactFlowAttributeFilter",
)({
  OrConditions: S.optional(ContactFlowAttributeOrConditionList),
  AndCondition: S.optional(ContactFlowAttributeAndCondition),
  TagCondition: S.optional(TagCondition),
  ContactFlowTypeCondition: S.optional(ContactFlowTypeCondition),
}) {}
export class SearchableContactAttributes extends S.Class<SearchableContactAttributes>(
  "SearchableContactAttributes",
)({
  Criteria: SearchableContactAttributesCriteriaList,
  MatchType: S.optional(S.String),
}) {}
export class SearchableSegmentAttributes extends S.Class<SearchableSegmentAttributes>(
  "SearchableSegmentAttributes",
)({
  Criteria: SearchableSegmentAttributesCriteriaList,
  MatchType: S.optional(S.String),
}) {}
export class ControlPlaneUserAttributeFilter extends S.Class<ControlPlaneUserAttributeFilter>(
  "ControlPlaneUserAttributeFilter",
)({
  OrConditions: S.optional(AttributeOrConditionList),
  AndCondition: S.optional(AttributeAndCondition),
  TagCondition: S.optional(TagCondition),
  HierarchyGroupCondition: S.optional(HierarchyGroupCondition),
}) {}
export class ListCondition extends S.Class<ListCondition>("ListCondition")({
  TargetListType: S.optional(S.String),
  Conditions: S.optional(Conditions),
}) {}
export class InboundRawMessage extends S.Class<InboundRawMessage>(
  "InboundRawMessage",
)({
  Subject: S.String,
  Body: S.String,
  ContentType: S.String,
  Headers: S.optional(EmailHeaders),
}) {}
export class TranscriptCriteria extends S.Class<TranscriptCriteria>(
  "TranscriptCriteria",
)({
  ParticipantRole: S.String,
  SearchText: SearchTextList,
  MatchType: S.String,
}) {}
export const TranscriptCriteriaList = S.Array(TranscriptCriteria);
export class SearchableAgentCriteriaStep extends S.Class<SearchableAgentCriteriaStep>(
  "SearchableAgentCriteriaStep",
)({
  AgentIds: S.optional(AgentResourceIdList),
  MatchType: S.optional(S.String),
}) {}
export class SearchContactsTimestampCondition extends S.Class<SearchContactsTimestampCondition>(
  "SearchContactsTimestampCondition",
)({ Type: S.String, ConditionType: S.String }) {}
export const ParticipantTimerValue = S.Union(
  S.Struct({ ParticipantTimerAction: S.String }),
  S.Struct({ ParticipantTimerDurationInMinutes: S.Number }),
);
export const InvalidRequestExceptionReason = S.Union(
  S.Struct({ AttachedFileInvalidRequestExceptionReason: S.String }),
);
export class BatchCreateDataTableValueSuccessResult extends S.Class<BatchCreateDataTableValueSuccessResult>(
  "BatchCreateDataTableValueSuccessResult",
)({
  PrimaryValues: PrimaryValuesSet,
  AttributeName: S.String,
  RecordId: S.String,
  LockVersion: DataTableLockVersion,
}) {}
export const BatchCreateDataTableValueSuccessResultList = S.Array(
  BatchCreateDataTableValueSuccessResult,
);
export class BatchCreateDataTableValueFailureResult extends S.Class<BatchCreateDataTableValueFailureResult>(
  "BatchCreateDataTableValueFailureResult",
)({
  PrimaryValues: PrimaryValuesSet,
  AttributeName: S.String,
  Message: S.String,
}) {}
export const BatchCreateDataTableValueFailureResultList = S.Array(
  BatchCreateDataTableValueFailureResult,
);
export class BatchDeleteDataTableValueSuccessResult extends S.Class<BatchDeleteDataTableValueSuccessResult>(
  "BatchDeleteDataTableValueSuccessResult",
)({
  PrimaryValues: PrimaryValuesSet,
  AttributeName: S.String,
  LockVersion: DataTableLockVersion,
}) {}
export const BatchDeleteDataTableValueSuccessResultList = S.Array(
  BatchDeleteDataTableValueSuccessResult,
);
export class BatchDeleteDataTableValueFailureResult extends S.Class<BatchDeleteDataTableValueFailureResult>(
  "BatchDeleteDataTableValueFailureResult",
)({
  PrimaryValues: PrimaryValuesSet,
  AttributeName: S.String,
  Message: S.String,
}) {}
export const BatchDeleteDataTableValueFailureResultList = S.Array(
  BatchDeleteDataTableValueFailureResult,
);
export class BatchDescribeDataTableValueSuccessResult extends S.Class<BatchDescribeDataTableValueSuccessResult>(
  "BatchDescribeDataTableValueSuccessResult",
)({
  RecordId: S.String,
  AttributeId: S.String,
  PrimaryValues: PrimaryValuesResponseSet,
  AttributeName: S.String,
  Value: S.optional(S.String),
  LockVersion: DataTableLockVersion,
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export const BatchDescribeDataTableValueSuccessResultList = S.Array(
  BatchDescribeDataTableValueSuccessResult,
);
export class BatchDescribeDataTableValueFailureResult extends S.Class<BatchDescribeDataTableValueFailureResult>(
  "BatchDescribeDataTableValueFailureResult",
)({
  PrimaryValues: PrimaryValuesSet,
  AttributeName: S.String,
  Message: S.String,
}) {}
export const BatchDescribeDataTableValueFailureResultList = S.Array(
  BatchDescribeDataTableValueFailureResult,
);
export const ReferenceIdList = S.Array(S.String);
export class Instance extends S.Class<Instance>("Instance")({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  IdentityManagementType: S.optional(S.String),
  InstanceAlias: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ServiceRole: S.optional(S.String),
  InstanceStatus: S.optional(S.String),
  StatusReason: S.optional(InstanceStatusReason),
  InboundCallsEnabled: S.optional(S.Boolean),
  OutboundCallsEnabled: S.optional(S.Boolean),
  InstanceAccessUrl: S.optional(S.String),
  Tags: S.optional(TagMap),
}) {}
export class ReplicationConfiguration extends S.Class<ReplicationConfiguration>(
  "ReplicationConfiguration",
)({
  ReplicationStatusSummaryList: S.optional(ReplicationStatusSummaryList),
  SourceRegion: S.optional(S.String),
  GlobalSignInEndpoint: S.optional(S.String),
}) {}
export class ClaimedPhoneNumberSummary extends S.Class<ClaimedPhoneNumberSummary>(
  "ClaimedPhoneNumberSummary",
)({
  PhoneNumberId: S.optional(S.String),
  PhoneNumberArn: S.optional(S.String),
  PhoneNumber: S.optional(S.String),
  PhoneNumberCountryCode: S.optional(S.String),
  PhoneNumberType: S.optional(S.String),
  PhoneNumberDescription: S.optional(S.String),
  TargetArn: S.optional(S.String),
  InstanceId: S.optional(S.String),
  Tags: S.optional(TagMap),
  PhoneNumberStatus: S.optional(PhoneNumberStatus),
  SourcePhoneNumberArn: S.optional(S.String),
}) {}
export class HierarchyStructure extends S.Class<HierarchyStructure>(
  "HierarchyStructure",
)({
  LevelOne: S.optional(HierarchyLevel),
  LevelTwo: S.optional(HierarchyLevel),
  LevelThree: S.optional(HierarchyLevel),
  LevelFour: S.optional(HierarchyLevel),
  LevelFive: S.optional(HierarchyLevel),
}) {}
export class DataTableEvaluatedValue extends S.Class<DataTableEvaluatedValue>(
  "DataTableEvaluatedValue",
)({
  RecordId: S.String,
  PrimaryValues: PrimaryValuesSet,
  AttributeName: S.String,
  ValueType: S.String,
  Found: S.Boolean,
  Error: S.Boolean,
  EvaluatedValue: S.String,
}) {}
export const DataTableEvaluatedValueList = S.Array(DataTableEvaluatedValue);
export class EffectiveHoursOfOperations extends S.Class<EffectiveHoursOfOperations>(
  "EffectiveHoursOfOperations",
)({
  Date: S.optional(S.String),
  OperationalHours: S.optional(OperationalHours),
}) {}
export const EffectiveHoursOfOperationList = S.Array(
  EffectiveHoursOfOperations,
);
export class EvaluationSummary extends S.Class<EvaluationSummary>(
  "EvaluationSummary",
)({
  EvaluationId: S.String,
  EvaluationArn: S.String,
  EvaluationFormTitle: S.String,
  EvaluationFormId: S.String,
  CalibrationSessionId: S.optional(S.String),
  Status: S.String,
  AutoEvaluationEnabled: S.optional(S.Boolean),
  AutoEvaluationStatus: S.optional(S.String),
  EvaluatorArn: S.String,
  Score: S.optional(EvaluationScore),
  Acknowledgement: S.optional(EvaluationAcknowledgementSummary),
  EvaluationType: S.optional(S.String),
  CreatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ContactParticipant: S.optional(EvaluationContactParticipant),
}) {}
export const EvaluationSummaryList = S.Array(EvaluationSummary);
export const ReferenceSummary = S.Union(
  S.Struct({ Url: UrlReference }),
  S.Struct({ Attachment: AttachmentReference }),
  S.Struct({ EmailMessage: EmailMessageReference }),
  S.Struct({ EmailMessagePlainText: EmailMessageReference }),
  S.Struct({ String: StringReference }),
  S.Struct({ Number: NumberReference }),
  S.Struct({ Date: DateReference }),
  S.Struct({ Email: EmailReference }),
);
export const ReferenceSummaryList = S.Array(ReferenceSummary);
export class RecordPrimaryValue extends S.Class<RecordPrimaryValue>(
  "RecordPrimaryValue",
)({
  RecordId: S.optional(S.String),
  PrimaryValues: S.optional(PrimaryValuesResponseSet),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export const PrimaryValuesList = S.Array(RecordPrimaryValue);
export class DataTableValueSummary extends S.Class<DataTableValueSummary>(
  "DataTableValueSummary",
)({
  RecordId: S.optional(S.String),
  AttributeId: S.optional(S.String),
  PrimaryValues: PrimaryValuesResponseSet,
  AttributeName: S.String,
  ValueType: S.String,
  Value: S.String,
  LockVersion: S.optional(DataTableLockVersion),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedRegion: S.optional(S.String),
}) {}
export const DataTableValueSummaryList = S.Array(DataTableValueSummary);
export class RuleSummary extends S.Class<RuleSummary>("RuleSummary")({
  Name: S.String,
  RuleId: S.String,
  RuleArn: S.String,
  EventSourceName: S.String,
  PublishStatus: S.String,
  ActionSummaries: ActionSummaries,
  CreatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const RuleSummaryList = S.Array(RuleSummary);
export class AgentStatusSearchFilter extends S.Class<AgentStatusSearchFilter>(
  "AgentStatusSearchFilter",
)({ AttributeFilter: S.optional(ControlPlaneAttributeFilter) }) {}
export const ContactFlowModuleSearchSummaryList = S.Array(ContactFlowModule);
export class ContactFlowSearchFilter extends S.Class<ContactFlowSearchFilter>(
  "ContactFlowSearchFilter",
)({
  TagFilter: S.optional(ControlPlaneTagFilter),
  FlowAttributeFilter: S.optional(ContactFlowAttributeFilter),
}) {}
export class EmailAddressMetadata extends S.Class<EmailAddressMetadata>(
  "EmailAddressMetadata",
)({
  EmailAddressId: S.optional(S.String),
  EmailAddressArn: S.optional(S.String),
  EmailAddress: S.optional(S.String),
  Description: S.optional(S.String),
  DisplayName: S.optional(S.String),
  AliasConfigurations: S.optional(AliasConfigurationList),
}) {}
export const EmailAddressList = S.Array(EmailAddressMetadata);
export class EvaluationFormSearchSummary extends S.Class<EvaluationFormSearchSummary>(
  "EvaluationFormSearchSummary",
)({
  EvaluationFormId: S.String,
  EvaluationFormArn: S.String,
  Title: S.String,
  Status: S.String,
  Description: S.optional(S.String),
  CreatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  CreatedBy: S.String,
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedBy: S.String,
  LastActivatedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastActivatedBy: S.optional(S.String),
  LatestVersion: S.Number,
  ActiveVersion: S.optional(S.Number),
  AutoEvaluationEnabled: S.optional(S.Boolean),
  EvaluationFormLanguage: S.optional(S.String),
  ContactInteractionType: S.optional(S.String),
  Tags: S.optional(TagMap),
}) {}
export const EvaluationFormSearchSummaryList = S.Array(
  EvaluationFormSearchSummary,
);
export class SecurityProfileSearchSummary extends S.Class<SecurityProfileSearchSummary>(
  "SecurityProfileSearchSummary",
)({
  Id: S.optional(S.String),
  OrganizationResourceId: S.optional(S.String),
  Arn: S.optional(S.String),
  SecurityProfileName: S.optional(S.String),
  Description: S.optional(S.String),
  Tags: S.optional(TagMap),
}) {}
export const SecurityProfilesSearchSummaryList = S.Array(
  SecurityProfileSearchSummary,
);
export class UserSearchFilter extends S.Class<UserSearchFilter>(
  "UserSearchFilter",
)({
  TagFilter: S.optional(ControlPlaneTagFilter),
  UserAttributeFilter: S.optional(ControlPlaneUserAttributeFilter),
}) {}
export class UserSearchCriteria extends S.Class<UserSearchCriteria>(
  "UserSearchCriteria",
)({
  OrConditions: S.optional(S.suspend(() => UserSearchConditionList)),
  AndConditions: S.optional(S.suspend(() => UserSearchConditionList)),
  StringCondition: S.optional(StringCondition),
  ListCondition: S.optional(ListCondition),
  HierarchyGroupCondition: S.optional(HierarchyGroupCondition),
}) {}
export class WorkspaceAssociationSearchSummary extends S.Class<WorkspaceAssociationSearchSummary>(
  "WorkspaceAssociationSearchSummary",
)({
  WorkspaceId: S.optional(S.String),
  WorkspaceArn: S.optional(S.String),
  ResourceId: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  ResourceType: S.optional(S.String),
  ResourceName: S.optional(S.String),
}) {}
export const WorkspaceAssociationSearchSummaryList = S.Array(
  WorkspaceAssociationSearchSummary,
);
export class WorkspaceSearchSummary extends S.Class<WorkspaceSearchSummary>(
  "WorkspaceSearchSummary",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Visibility: S.optional(S.String),
  Description: S.optional(S.String),
  Title: S.optional(S.String),
  Arn: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(TagMap),
}) {}
export const WorkspaceSearchSummaryList = S.Array(WorkspaceSearchSummary);
export class InboundEmailContent extends S.Class<InboundEmailContent>(
  "InboundEmailContent",
)({ MessageSourceType: S.String, RawMessage: S.optional(InboundRawMessage) }) {}
export class ProblemDetail extends S.Class<ProblemDetail>("ProblemDetail")({
  message: S.optional(S.String),
}) {}
export const Problems = S.Array(ProblemDetail);
export class StateTransition extends S.Class<StateTransition>(
  "StateTransition",
)({
  State: S.optional(S.String),
  StateStartTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  StateEndTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const StateTransitions = S.Array(StateTransition);
export class AiAgentInfo extends S.Class<AiAgentInfo>("AiAgentInfo")({
  AiUseCase: S.optional(S.String),
  AiAgentVersionId: S.optional(S.String),
  AiAgentEscalated: S.optional(S.Boolean),
}) {}
export const AiAgents = S.Array(AiAgentInfo);
export const PotentialAudioQualityIssues = S.Array(S.String);
export class AudioQualityMetricsInfo extends S.Class<AudioQualityMetricsInfo>(
  "AudioQualityMetricsInfo",
)({
  QualityScore: S.optional(S.Number),
  PotentialQualityIssues: S.optional(PotentialAudioQualityIssues),
}) {}
export class CustomerQualityMetrics extends S.Class<CustomerQualityMetrics>(
  "CustomerQualityMetrics",
)({ Audio: S.optional(AudioQualityMetricsInfo) }) {}
export class ChatContactMetrics extends S.Class<ChatContactMetrics>(
  "ChatContactMetrics",
)({
  MultiParty: S.optional(S.Boolean),
  TotalMessages: S.optional(S.Number),
  TotalBotMessages: S.optional(S.Number),
  TotalBotMessageLengthInChars: S.optional(S.Number),
  ConversationCloseTimeInMillis: S.optional(S.Number),
  ConversationTurnCount: S.optional(S.Number),
  AgentFirstResponseTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AgentFirstResponseTimeInMillis: S.optional(S.Number),
}) {}
export class ParticipantMetrics extends S.Class<ParticipantMetrics>(
  "ParticipantMetrics",
)({
  ParticipantId: S.optional(S.String),
  ParticipantType: S.optional(S.String),
  ConversationAbandon: S.optional(S.Boolean),
  MessagesSent: S.optional(S.Number),
  NumResponses: S.optional(S.Number),
  MessageLengthInChars: S.optional(S.Number),
  TotalResponseTimeInMillis: S.optional(S.Number),
  MaxResponseTimeInMillis: S.optional(S.Number),
  LastMessageTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class EmailRecipient extends S.Class<EmailRecipient>("EmailRecipient")({
  Address: S.optional(S.String),
  DisplayName: S.optional(S.String),
}) {}
export const EmailRecipientsList = S.Array(EmailRecipient);
export class ContactEvaluation extends S.Class<ContactEvaluation>(
  "ContactEvaluation",
)({
  FormId: S.optional(S.String),
  EvaluationArn: S.optional(S.String),
  Status: S.optional(S.String),
  StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeleteTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ExportLocation: S.optional(S.String),
}) {}
export class AutoEvaluationDetails extends S.Class<AutoEvaluationDetails>(
  "AutoEvaluationDetails",
)({
  AutoEvaluationEnabled: S.Boolean,
  AutoEvaluationStatus: S.optional(S.String),
}) {}
export class EvaluationAcknowledgement extends S.Class<EvaluationAcknowledgement>(
  "EvaluationAcknowledgement",
)({
  AcknowledgedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  AcknowledgedBy: S.String,
  AcknowledgerComment: S.optional(S.String),
}) {}
export class RealTimeContactAnalysisAttachment extends S.Class<RealTimeContactAnalysisAttachment>(
  "RealTimeContactAnalysisAttachment",
)({
  AttachmentName: S.String,
  ContentType: S.optional(S.String),
  AttachmentId: S.String,
  Status: S.optional(S.String),
}) {}
export const RealTimeContactAnalysisAttachments = S.Array(
  RealTimeContactAnalysisAttachment,
);
export class Transcript extends S.Class<Transcript>("Transcript")({
  Criteria: TranscriptCriteriaList,
  MatchType: S.optional(S.String),
}) {}
export class SearchableRoutingCriteriaStep extends S.Class<SearchableRoutingCriteriaStep>(
  "SearchableRoutingCriteriaStep",
)({ AgentCriteria: S.optional(SearchableAgentCriteriaStep) }) {}
export const SearchableRoutingCriteriaStepList = S.Array(
  SearchableRoutingCriteriaStep,
);
export class SearchContactsAdditionalTimeRangeCriteria extends S.Class<SearchContactsAdditionalTimeRangeCriteria>(
  "SearchContactsAdditionalTimeRangeCriteria",
)({
  TimeRange: S.optional(SearchContactsTimeRange),
  TimestampCondition: S.optional(SearchContactsTimestampCondition),
}) {}
export const SearchContactsAdditionalTimeRangeCriteriaList = S.Array(
  SearchContactsAdditionalTimeRangeCriteria,
);
export class ParticipantTimerConfiguration extends S.Class<ParticipantTimerConfiguration>(
  "ParticipantTimerConfiguration",
)({
  ParticipantRole: S.String,
  TimerType: S.String,
  TimerValue: ParticipantTimerValue,
}) {}
export const ParticipantTimerConfigList = S.Array(
  ParticipantTimerConfiguration,
);
export class AssociateInstanceStorageConfigRequest extends S.Class<AssociateInstanceStorageConfigRequest>(
  "AssociateInstanceStorageConfigRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ResourceType: S.String,
    StorageConfig: InstanceStorageConfig,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/instance/{InstanceId}/storage-config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchCreateDataTableValueResponse extends S.Class<BatchCreateDataTableValueResponse>(
  "BatchCreateDataTableValueResponse",
)({
  Successful: BatchCreateDataTableValueSuccessResultList,
  Failed: BatchCreateDataTableValueFailureResultList,
}) {}
export class BatchDeleteDataTableValueResponse extends S.Class<BatchDeleteDataTableValueResponse>(
  "BatchDeleteDataTableValueResponse",
)({
  Successful: BatchDeleteDataTableValueSuccessResultList,
  Failed: BatchDeleteDataTableValueFailureResultList,
}) {}
export class BatchDescribeDataTableValueResponse extends S.Class<BatchDescribeDataTableValueResponse>(
  "BatchDescribeDataTableValueResponse",
)({
  Successful: BatchDescribeDataTableValueSuccessResultList,
  Failed: BatchDescribeDataTableValueFailureResultList,
}) {}
export class CreateContactRequest extends S.Class<CreateContactRequest>(
  "CreateContactRequest",
)(
  {
    InstanceId: S.String,
    ClientToken: S.optional(S.String),
    RelatedContactId: S.optional(S.String),
    Attributes: S.optional(Attributes),
    References: S.optional(ContactReferences),
    Channel: S.String,
    InitiationMethod: S.String,
    ExpiryDurationInMinutes: S.optional(S.Number),
    UserInfo: S.optional(UserInfo),
    InitiateAs: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    SegmentAttributes: S.optional(SegmentAttributes),
    PreviousContactId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/contact/create-contact" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataTableAttributeResponse extends S.Class<CreateDataTableAttributeResponse>(
  "CreateDataTableAttributeResponse",
)({
  Name: S.String,
  AttributeId: S.optional(S.String),
  LockVersion: DataTableLockVersion,
}) {}
export class AutomaticFailConfiguration extends S.Class<AutomaticFailConfiguration>(
  "AutomaticFailConfiguration",
)({ TargetSection: S.optional(S.String) }) {}
export class EvaluationFormSingleSelectQuestionOption extends S.Class<EvaluationFormSingleSelectQuestionOption>(
  "EvaluationFormSingleSelectQuestionOption",
)({
  RefId: S.String,
  Text: S.String,
  Score: S.optional(S.Number),
  AutomaticFail: S.optional(S.Boolean),
  AutomaticFailConfiguration: S.optional(AutomaticFailConfiguration),
}) {}
export const EvaluationFormSingleSelectQuestionOptionList = S.Array(
  EvaluationFormSingleSelectQuestionOption,
);
export class EvaluationFormQuestionAutomationAnswerSource extends S.Class<EvaluationFormQuestionAutomationAnswerSource>(
  "EvaluationFormQuestionAutomationAnswerSource",
)({ SourceType: S.String }) {}
export class EvaluationFormTextQuestionAutomation extends S.Class<EvaluationFormTextQuestionAutomation>(
  "EvaluationFormTextQuestionAutomation",
)({ AnswerSource: S.optional(EvaluationFormQuestionAutomationAnswerSource) }) {}
export class EvaluationFormMultiSelectQuestionOption extends S.Class<EvaluationFormMultiSelectQuestionOption>(
  "EvaluationFormMultiSelectQuestionOption",
)({ RefId: S.String, Text: S.String }) {}
export const EvaluationFormMultiSelectQuestionOptionList = S.Array(
  EvaluationFormMultiSelectQuestionOption,
);
export class CreateHoursOfOperationResponse extends S.Class<CreateHoursOfOperationResponse>(
  "CreateHoursOfOperationResponse",
)({
  HoursOfOperationId: S.optional(S.String),
  HoursOfOperationArn: S.optional(S.String),
}) {}
export class CreateHoursOfOperationOverrideResponse extends S.Class<CreateHoursOfOperationOverrideResponse>(
  "CreateHoursOfOperationOverrideResponse",
)({ HoursOfOperationOverrideId: S.optional(S.String) }) {}
export class CreateQuickConnectResponse extends S.Class<CreateQuickConnectResponse>(
  "CreateQuickConnectResponse",
)({
  QuickConnectARN: S.optional(S.String),
  QuickConnectId: S.optional(S.String),
}) {}
export class CreateRoutingProfileResponse extends S.Class<CreateRoutingProfileResponse>(
  "CreateRoutingProfileResponse",
)({
  RoutingProfileArn: S.optional(S.String),
  RoutingProfileId: S.optional(S.String),
}) {}
export class CreateTaskTemplateResponse extends S.Class<CreateTaskTemplateResponse>(
  "CreateTaskTemplateResponse",
)({ Id: S.String, Arn: S.String }) {}
export class CreateViewVersionResponse extends S.Class<CreateViewVersionResponse>(
  "CreateViewVersionResponse",
)({ View: S.optional(View) }) {}
export class DescribeInstanceResponse extends S.Class<DescribeInstanceResponse>(
  "DescribeInstanceResponse",
)({
  Instance: S.optional(Instance),
  ReplicationConfiguration: S.optional(ReplicationConfiguration),
}) {}
export class DescribePhoneNumberResponse extends S.Class<DescribePhoneNumberResponse>(
  "DescribePhoneNumberResponse",
)({ ClaimedPhoneNumberSummary: S.optional(ClaimedPhoneNumberSummary) }) {}
export class DescribePredefinedAttributeResponse extends S.Class<DescribePredefinedAttributeResponse>(
  "DescribePredefinedAttributeResponse",
)({ PredefinedAttribute: S.optional(PredefinedAttribute) }) {}
export class DescribeUserHierarchyGroupResponse extends S.Class<DescribeUserHierarchyGroupResponse>(
  "DescribeUserHierarchyGroupResponse",
)({ HierarchyGroup: S.optional(HierarchyGroup) }) {}
export class DescribeUserHierarchyStructureResponse extends S.Class<DescribeUserHierarchyStructureResponse>(
  "DescribeUserHierarchyStructureResponse",
)({ HierarchyStructure: S.optional(HierarchyStructure) }) {}
export class EvaluateDataTableValuesResponse extends S.Class<EvaluateDataTableValuesResponse>(
  "EvaluateDataTableValuesResponse",
)({ Values: DataTableEvaluatedValueList, NextToken: S.optional(S.String) }) {}
export class GetEffectiveHoursOfOperationsResponse extends S.Class<GetEffectiveHoursOfOperationsResponse>(
  "GetEffectiveHoursOfOperationsResponse",
)({
  EffectiveHoursOfOperationList: S.optional(EffectiveHoursOfOperationList),
  TimeZone: S.optional(S.String),
}) {}
export class ListContactEvaluationsResponse extends S.Class<ListContactEvaluationsResponse>(
  "ListContactEvaluationsResponse",
)({
  EvaluationSummaryList: EvaluationSummaryList,
  NextToken: S.optional(S.String),
}) {}
export class ListContactReferencesResponse extends S.Class<ListContactReferencesResponse>(
  "ListContactReferencesResponse",
)({
  ReferenceSummaryList: S.optional(ReferenceSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListDataTablePrimaryValuesResponse extends S.Class<ListDataTablePrimaryValuesResponse>(
  "ListDataTablePrimaryValuesResponse",
)({ NextToken: S.optional(S.String), PrimaryValuesList: PrimaryValuesList }) {}
export class ListDataTableValuesResponse extends S.Class<ListDataTableValuesResponse>(
  "ListDataTableValuesResponse",
)({ NextToken: S.optional(S.String), Values: DataTableValueSummaryList }) {}
export class ListRulesResponse extends S.Class<ListRulesResponse>(
  "ListRulesResponse",
)({ RuleSummaryList: RuleSummaryList, NextToken: S.optional(S.String) }) {}
export class SearchAgentStatusesRequest extends S.Class<SearchAgentStatusesRequest>(
  "SearchAgentStatusesRequest",
)(
  {
    InstanceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchFilter: S.optional(AgentStatusSearchFilter),
    SearchCriteria: S.optional(AgentStatusSearchCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-agent-statuses" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchContactFlowModulesResponse extends S.Class<SearchContactFlowModulesResponse>(
  "SearchContactFlowModulesResponse",
)({
  ContactFlowModules: S.optional(ContactFlowModuleSearchSummaryList),
  NextToken: S.optional(S.String),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class SearchContactFlowsRequest extends S.Class<SearchContactFlowsRequest>(
  "SearchContactFlowsRequest",
)(
  {
    InstanceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchFilter: S.optional(ContactFlowSearchFilter),
    SearchCriteria: S.optional(ContactFlowSearchCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-contact-flows" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchEmailAddressesResponse extends S.Class<SearchEmailAddressesResponse>(
  "SearchEmailAddressesResponse",
)({
  NextToken: S.optional(S.String),
  EmailAddresses: S.optional(EmailAddressList),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class SearchEvaluationFormsResponse extends S.Class<SearchEvaluationFormsResponse>(
  "SearchEvaluationFormsResponse",
)({
  EvaluationFormSearchSummaryList: S.optional(EvaluationFormSearchSummaryList),
  NextToken: S.optional(S.String),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class SearchHoursOfOperationOverridesResponse extends S.Class<SearchHoursOfOperationOverridesResponse>(
  "SearchHoursOfOperationOverridesResponse",
)({
  HoursOfOperationOverrides: S.optional(HoursOfOperationOverrideList),
  NextToken: S.optional(S.String),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class SearchSecurityProfilesResponse extends S.Class<SearchSecurityProfilesResponse>(
  "SearchSecurityProfilesResponse",
)({
  SecurityProfiles: S.optional(SecurityProfilesSearchSummaryList),
  NextToken: S.optional(S.String),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class SearchUsersRequest extends S.Class<SearchUsersRequest>(
  "SearchUsersRequest",
)(
  {
    InstanceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SearchFilter: S.optional(UserSearchFilter),
    SearchCriteria: S.optional(UserSearchCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-users" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchWorkspaceAssociationsResponse extends S.Class<SearchWorkspaceAssociationsResponse>(
  "SearchWorkspaceAssociationsResponse",
)({
  NextToken: S.optional(S.String),
  WorkspaceAssociations: S.optional(WorkspaceAssociationSearchSummaryList),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class SearchWorkspacesResponse extends S.Class<SearchWorkspacesResponse>(
  "SearchWorkspacesResponse",
)({
  NextToken: S.optional(S.String),
  Workspaces: S.optional(WorkspaceSearchSummaryList),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class StartEmailContactRequest extends S.Class<StartEmailContactRequest>(
  "StartEmailContactRequest",
)(
  {
    InstanceId: S.String,
    FromEmailAddress: EmailAddressInfo,
    DestinationEmailAddress: S.String,
    Description: S.optional(S.String),
    References: S.optional(ContactReferences),
    Name: S.optional(S.String),
    EmailMessage: InboundEmailContent,
    AdditionalRecipients: S.optional(InboundAdditionalRecipients),
    Attachments: S.optional(EmailAttachments),
    ContactFlowId: S.optional(S.String),
    RelatedContactId: S.optional(S.String),
    Attributes: S.optional(Attributes),
    SegmentAttributes: S.optional(SegmentAttributes),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/contact/email" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartOutboundChatContactResponse extends S.Class<StartOutboundChatContactResponse>(
  "StartOutboundChatContactResponse",
)({ ContactId: S.optional(S.String) }) {}
export class SubmitContactEvaluationRequest extends S.Class<SubmitContactEvaluationRequest>(
  "SubmitContactEvaluationRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    EvaluationId: S.String.pipe(T.HttpLabel("EvaluationId")),
    Answers: S.optional(EvaluationAnswersInputMap),
    Notes: S.optional(EvaluationNotesMap),
    SubmittedBy: S.optional(EvaluatorUserUnion),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/contact-evaluations/{InstanceId}/{EvaluationId}/submit",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Range extends S.Class<Range>("Range")({
  MinProficiencyLevel: S.optional(S.Number),
  MaxProficiencyLevel: S.optional(S.Number),
}) {}
export class WisdomInfo extends S.Class<WisdomInfo>("WisdomInfo")({
  SessionArn: S.optional(S.String),
  AiAgents: S.optional(AiAgents),
}) {}
export class ChatMetrics extends S.Class<ChatMetrics>("ChatMetrics")({
  ChatContactMetrics: S.optional(ChatContactMetrics),
  AgentMetrics: S.optional(ParticipantMetrics),
  CustomerMetrics: S.optional(ParticipantMetrics),
}) {}
export class AdditionalEmailRecipients extends S.Class<AdditionalEmailRecipients>(
  "AdditionalEmailRecipients",
)({
  ToList: S.optional(EmailRecipientsList),
  CcList: S.optional(EmailRecipientsList),
}) {}
export const ContactEvaluations = S.Record({
  key: S.String,
  value: ContactEvaluation,
});
export class EvaluationMetadata extends S.Class<EvaluationMetadata>(
  "EvaluationMetadata",
)({
  ContactId: S.String,
  EvaluatorArn: S.String,
  ContactAgentId: S.optional(S.String),
  CalibrationSessionId: S.optional(S.String),
  Score: S.optional(EvaluationScore),
  AutoEvaluation: S.optional(AutoEvaluationDetails),
  Acknowledgement: S.optional(EvaluationAcknowledgement),
  ContactParticipant: S.optional(EvaluationContactParticipant),
  SamplingJobId: S.optional(S.String),
}) {}
export const ContactMetricValue = S.Union(S.Struct({ Number: S.Number }));
export class CurrentMetricData extends S.Class<CurrentMetricData>(
  "CurrentMetricData",
)({ Metric: S.optional(CurrentMetric), Value: S.optional(S.Number) }) {}
export const CurrentMetricDataCollections = S.Array(CurrentMetricData);
export class RealTimeContactAnalysisSegmentAttachments extends S.Class<RealTimeContactAnalysisSegmentAttachments>(
  "RealTimeContactAnalysisSegmentAttachments",
)({
  Id: S.String,
  ParticipantId: S.String,
  ParticipantRole: S.String,
  DisplayName: S.optional(S.String),
  Attachments: RealTimeContactAnalysisAttachments,
  Time: RealTimeContactAnalysisTimeData,
}) {}
export class ContactAnalysis extends S.Class<ContactAnalysis>(
  "ContactAnalysis",
)({ Transcript: S.optional(Transcript) }) {}
export class SearchableRoutingCriteria extends S.Class<SearchableRoutingCriteria>(
  "SearchableRoutingCriteria",
)({ Steps: S.optional(SearchableRoutingCriteriaStepList) }) {}
export class SearchContactsAdditionalTimeRange extends S.Class<SearchContactsAdditionalTimeRange>(
  "SearchContactsAdditionalTimeRange",
)({
  Criteria: SearchContactsAdditionalTimeRangeCriteriaList,
  MatchType: S.String,
}) {}
export const UrlMetadataSignedHeaders = S.Record({
  key: S.String,
  value: S.String,
});
export class Attendee extends S.Class<Attendee>("Attendee")({
  AttendeeId: S.optional(S.String),
  JoinToken: S.optional(S.String),
}) {}
export const AgentIds = S.Array(S.String);
export class ChatParticipantRoleConfig extends S.Class<ChatParticipantRoleConfig>(
  "ChatParticipantRoleConfig",
)({ ParticipantTimerConfigList: ParticipantTimerConfigList }) {}
export class EvaluationFormTextQuestionProperties extends S.Class<EvaluationFormTextQuestionProperties>(
  "EvaluationFormTextQuestionProperties",
)({ Automation: S.optional(EvaluationFormTextQuestionAutomation) }) {}
export class AgentHierarchyGroup extends S.Class<AgentHierarchyGroup>(
  "AgentHierarchyGroup",
)({ Arn: S.optional(S.String) }) {}
export class Expiry extends S.Class<Expiry>("Expiry")({
  DurationInSeconds: S.optional(S.Number),
  ExpiryTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class QuickConnectContactData extends S.Class<QuickConnectContactData>(
  "QuickConnectContactData",
)({
  ContactId: S.optional(S.String),
  InitiationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  QuickConnectId: S.optional(S.String),
  QuickConnectName: S.optional(S.String),
  QuickConnectType: S.optional(S.String),
}) {}
export class RealTimeContactAnalysisCharacterInterval extends S.Class<RealTimeContactAnalysisCharacterInterval>(
  "RealTimeContactAnalysisCharacterInterval",
)({ BeginOffsetChar: S.Number, EndOffsetChar: S.Number }) {}
export const RealTimeContactAnalysisCharacterIntervals = S.Array(
  RealTimeContactAnalysisCharacterInterval,
);
export class RealTimeContactAnalysisTranscriptItemWithContent extends S.Class<RealTimeContactAnalysisTranscriptItemWithContent>(
  "RealTimeContactAnalysisTranscriptItemWithContent",
)({
  Content: S.optional(S.String),
  Id: S.String,
  CharacterOffsets: S.optional(RealTimeContactAnalysisCharacterInterval),
}) {}
export const RealTimeContactAnalysisTranscriptItemsWithContent = S.Array(
  RealTimeContactAnalysisTranscriptItemWithContent,
);
export class SuccessfulRequest extends S.Class<SuccessfulRequest>(
  "SuccessfulRequest",
)({
  RequestIdentifier: S.optional(S.String),
  ContactId: S.optional(S.String),
}) {}
export const SuccessfulRequestList = S.Array(SuccessfulRequest);
export class FailedRequest extends S.Class<FailedRequest>("FailedRequest")({
  RequestIdentifier: S.optional(S.String),
  FailureReasonCode: S.optional(S.String),
  FailureReasonMessage: S.optional(S.String),
}) {}
export const FailedRequestList = S.Array(FailedRequest);
export class NumericQuestionPropertyValueAutomation extends S.Class<NumericQuestionPropertyValueAutomation>(
  "NumericQuestionPropertyValueAutomation",
)({ Label: S.String }) {}
export class ParticipantTokenCredentials extends S.Class<ParticipantTokenCredentials>(
  "ParticipantTokenCredentials",
)({ ParticipantToken: S.optional(S.String), Expiry: S.optional(S.String) }) {}
export class ContactMetricResult extends S.Class<ContactMetricResult>(
  "ContactMetricResult",
)({ Name: S.String, Value: ContactMetricValue }) {}
export const ContactMetricResults = S.Array(ContactMetricResult);
export const AgentStatusList = S.Array(AgentStatus);
export const ContactFlowSearchSummaryList = S.Array(ContactFlow);
export class SearchCriteria extends S.Class<SearchCriteria>("SearchCriteria")({
  Name: S.optional(NameCriteria),
  AgentIds: S.optional(AgentResourceIdList),
  AgentHierarchyGroups: S.optional(AgentHierarchyGroups),
  Channels: S.optional(ChannelList),
  ContactAnalysis: S.optional(ContactAnalysis),
  InitiationMethods: S.optional(InitiationMethodList),
  QueueIds: S.optional(QueueIdList),
  RoutingCriteria: S.optional(SearchableRoutingCriteria),
  AdditionalTimeRange: S.optional(SearchContactsAdditionalTimeRange),
  SearchableContactAttributes: S.optional(SearchableContactAttributes),
  SearchableSegmentAttributes: S.optional(SearchableSegmentAttributes),
  ActiveRegions: S.optional(ActiveRegionList),
}) {}
export class TagSet extends S.Class<TagSet>("TagSet")({
  key: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const TagsList = S.Array(TagSet);
export class UploadUrlMetadata extends S.Class<UploadUrlMetadata>(
  "UploadUrlMetadata",
)({
  Url: S.optional(S.String),
  UrlExpiry: S.optional(S.String),
  HeadersToInclude: S.optional(UrlMetadataSignedHeaders),
}) {}
export class AgentsCriteria extends S.Class<AgentsCriteria>("AgentsCriteria")({
  AgentIds: S.optional(AgentIds),
}) {}
export const UpdateParticipantRoleConfigChannelInfo = S.Union(
  S.Struct({ Chat: ChatParticipantRoleConfig }),
);
export class PropertyValidationExceptionProperty extends S.Class<PropertyValidationExceptionProperty>(
  "PropertyValidationExceptionProperty",
)({ PropertyPath: S.String, Reason: S.String, Message: S.String }) {}
export const PropertyValidationExceptionPropertyList = S.Array(
  PropertyValidationExceptionProperty,
);
export class HierarchyGroups extends S.Class<HierarchyGroups>(
  "HierarchyGroups",
)({
  Level1: S.optional(AgentHierarchyGroup),
  Level2: S.optional(AgentHierarchyGroup),
  Level3: S.optional(AgentHierarchyGroup),
  Level4: S.optional(AgentHierarchyGroup),
  Level5: S.optional(AgentHierarchyGroup),
}) {}
export class MatchCriteria extends S.Class<MatchCriteria>("MatchCriteria")({
  AgentsCriteria: S.optional(AgentsCriteria),
}) {}
export class AttributeCondition extends S.Class<AttributeCondition>(
  "AttributeCondition",
)({
  Name: S.optional(S.String),
  Value: S.optional(S.String),
  ProficiencyLevel: S.optional(S.Number),
  Range: S.optional(Range),
  MatchCriteria: S.optional(MatchCriteria),
  ComparisonOperator: S.optional(S.String),
}) {}
export class Expression extends S.Class<Expression>("Expression")({
  AttributeCondition: S.optional(AttributeCondition),
  AndExpression: S.optional(S.suspend(() => Expressions)),
  OrExpression: S.optional(S.suspend(() => Expressions)),
  NotAttributeCondition: S.optional(AttributeCondition),
}) {}
export class Step extends S.Class<Step>("Step")({
  Expiry: S.optional(Expiry),
  Expression: S.optional(Expression),
  Status: S.optional(S.String),
}) {}
export const Steps = S.Array(Step);
export class AgentQualityMetrics extends S.Class<AgentQualityMetrics>(
  "AgentQualityMetrics",
)({ Audio: S.optional(AudioQualityMetricsInfo) }) {}
export const NextContactMetadata = S.Union(
  S.Struct({ QuickConnectContactData: QuickConnectContactData }),
);
export class QueueReference extends S.Class<QueueReference>("QueueReference")({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
}) {}
export class RoutingProfileReference extends S.Class<RoutingProfileReference>(
  "RoutingProfileReference",
)({ Id: S.optional(S.String), Arn: S.optional(S.String) }) {}
export class AgentStatusIdentifier extends S.Class<AgentStatusIdentifier>(
  "AgentStatusIdentifier",
)({ Arn: S.optional(S.String), Id: S.optional(S.String) }) {}
export class RealTimeContactAnalysisTranscriptItemRedaction extends S.Class<RealTimeContactAnalysisTranscriptItemRedaction>(
  "RealTimeContactAnalysisTranscriptItemRedaction",
)({
  CharacterOffsets: S.optional(RealTimeContactAnalysisCharacterIntervals),
}) {}
export class RealTimeContactAnalysisIssueDetected extends S.Class<RealTimeContactAnalysisIssueDetected>(
  "RealTimeContactAnalysisIssueDetected",
)({ TranscriptItems: RealTimeContactAnalysisTranscriptItemsWithContent }) {}
export const RealTimeContactAnalysisIssuesDetected = S.Array(
  RealTimeContactAnalysisIssueDetected,
);
export class MediaPlacement extends S.Class<MediaPlacement>("MediaPlacement")({
  AudioHostUrl: S.optional(S.String),
  AudioFallbackUrl: S.optional(S.String),
  SignalingUrl: S.optional(S.String),
  TurnControlUrl: S.optional(S.String),
  EventIngestionUrl: S.optional(S.String),
}) {}
export class AssociateInstanceStorageConfigResponse extends S.Class<AssociateInstanceStorageConfigResponse>(
  "AssociateInstanceStorageConfigResponse",
)({ AssociationId: S.optional(S.String) }) {}
export class BatchPutContactResponse extends S.Class<BatchPutContactResponse>(
  "BatchPutContactResponse",
)({
  SuccessfulRequestList: S.optional(SuccessfulRequestList),
  FailedRequestList: S.optional(FailedRequestList),
}) {}
export class CreateContactResponse extends S.Class<CreateContactResponse>(
  "CreateContactResponse",
)({ ContactId: S.optional(S.String), ContactArn: S.optional(S.String) }) {}
export class EvaluationFormNumericQuestionOption extends S.Class<EvaluationFormNumericQuestionOption>(
  "EvaluationFormNumericQuestionOption",
)({
  MinValue: S.Number,
  MaxValue: S.Number,
  Score: S.optional(S.Number),
  AutomaticFail: S.optional(S.Boolean),
  AutomaticFailConfiguration: S.optional(AutomaticFailConfiguration),
}) {}
export const EvaluationFormNumericQuestionOptionList = S.Array(
  EvaluationFormNumericQuestionOption,
);
export const EvaluationFormNumericQuestionAutomation = S.Union(
  S.Struct({ PropertyValue: NumericQuestionPropertyValueAutomation }),
  S.Struct({ AnswerSource: EvaluationFormQuestionAutomationAnswerSource }),
);
export class CreateParticipantResponse extends S.Class<CreateParticipantResponse>(
  "CreateParticipantResponse",
)({
  ParticipantCredentials: S.optional(ParticipantTokenCredentials),
  ParticipantId: S.optional(S.String),
}) {}
export class CreateRuleRequest extends S.Class<CreateRuleRequest>(
  "CreateRuleRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Name: S.String,
    TriggerEventSource: RuleTriggerEventSource,
    Function: S.String,
    Actions: RuleActions,
    PublishStatus: S.String,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/rules/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSecurityProfileRequest extends S.Class<CreateSecurityProfileRequest>(
  "CreateSecurityProfileRequest",
)(
  {
    SecurityProfileName: S.String,
    Description: S.optional(S.String),
    Permissions: S.optional(PermissionsList),
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Tags: S.optional(TagMap),
    AllowedAccessControlTags: S.optional(AllowedAccessControlTags),
    TagRestrictedResources: S.optional(TagRestrictedResourceList),
    Applications: S.optional(Applications),
    HierarchyRestrictedResources: S.optional(HierarchyRestrictedResourceList),
    AllowedAccessControlHierarchyGroupId: S.optional(S.String),
    AllowedFlowModules: S.optional(AllowedFlowModules),
    GranularAccessControlConfiguration: S.optional(
      GranularAccessControlConfiguration,
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/security-profiles/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateWorkspaceRequest extends S.Class<CreateWorkspaceRequest>(
  "CreateWorkspaceRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Name: S.String,
    Description: S.optional(S.String),
    Theme: S.optional(WorkspaceTheme),
    Title: S.optional(S.String),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/workspaces/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EvaluationQuestionInputDetails extends S.Class<EvaluationQuestionInputDetails>(
  "EvaluationQuestionInputDetails",
)({ TranscriptType: S.optional(S.String) }) {}
export class GetContactMetricsResponse extends S.Class<GetContactMetricsResponse>(
  "GetContactMetricsResponse",
)({
  MetricResults: S.optional(ContactMetricResults),
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
}) {}
export class SearchAgentStatusesResponse extends S.Class<SearchAgentStatusesResponse>(
  "SearchAgentStatusesResponse",
)({
  AgentStatuses: S.optional(AgentStatusList),
  NextToken: S.optional(S.String),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class SearchContactFlowsResponse extends S.Class<SearchContactFlowsResponse>(
  "SearchContactFlowsResponse",
)({
  ContactFlows: S.optional(ContactFlowSearchSummaryList),
  NextToken: S.optional(S.String),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class SearchContactsRequest extends S.Class<SearchContactsRequest>(
  "SearchContactsRequest",
)(
  {
    InstanceId: S.String,
    TimeRange: SearchContactsTimeRange,
    SearchCriteria: S.optional(SearchCriteria),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Sort: S.optional(Sort),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-contacts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchResourceTagsResponse extends S.Class<SearchResourceTagsResponse>(
  "SearchResourceTagsResponse",
)({ Tags: S.optional(TagsList), NextToken: S.optional(S.String) }) {}
export class StartAttachedFileUploadResponse extends S.Class<StartAttachedFileUploadResponse>(
  "StartAttachedFileUploadResponse",
)({
  FileArn: S.optional(S.String),
  FileId: S.optional(S.String),
  CreationTime: S.optional(S.String),
  FileStatus: S.optional(S.String),
  CreatedBy: S.optional(CreatedByInfo),
  UploadUrlMetadata: S.optional(UploadUrlMetadata),
}) {}
export class StartEmailContactResponse extends S.Class<StartEmailContactResponse>(
  "StartEmailContactResponse",
)({ ContactId: S.optional(S.String) }) {}
export class SubmitContactEvaluationResponse extends S.Class<SubmitContactEvaluationResponse>(
  "SubmitContactEvaluationResponse",
)({ EvaluationId: S.String, EvaluationArn: S.String }) {}
export class UpdateParticipantRoleConfigRequest extends S.Class<UpdateParticipantRoleConfigRequest>(
  "UpdateParticipantRoleConfigRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactId: S.String.pipe(T.HttpLabel("ContactId")),
    ChannelConfiguration: UpdateParticipantRoleConfigChannelInfo,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/contact/participant-role-config/{InstanceId}/{ContactId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateParticipantRoleConfigResponse extends S.Class<UpdateParticipantRoleConfigResponse>(
  "UpdateParticipantRoleConfigResponse",
)({}) {}
export class SingleSelectQuestionRuleCategoryAutomation extends S.Class<SingleSelectQuestionRuleCategoryAutomation>(
  "SingleSelectQuestionRuleCategoryAutomation",
)({ Category: S.String, Condition: S.String, OptionRefId: S.String }) {}
export class MultiSelectQuestionRuleCategoryAutomation extends S.Class<MultiSelectQuestionRuleCategoryAutomation>(
  "MultiSelectQuestionRuleCategoryAutomation",
)({ Category: S.String, Condition: S.String, OptionRefIds: ReferenceIdList }) {}
export class EvaluationFormItemEnablementSource extends S.Class<EvaluationFormItemEnablementSource>(
  "EvaluationFormItemEnablementSource",
)({ Type: S.String, RefId: S.optional(S.String) }) {}
export class EvaluationFormItemEnablementSourceValue extends S.Class<EvaluationFormItemEnablementSourceValue>(
  "EvaluationFormItemEnablementSourceValue",
)({ Type: S.String, RefId: S.optional(S.String) }) {}
export const EvaluationFormItemEnablementSourceValueList = S.Array(
  EvaluationFormItemEnablementSourceValue,
);
export class AgentInfo extends S.Class<AgentInfo>("AgentInfo")({
  Id: S.optional(S.String),
  AcceptedByAgentTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  PreviewEndTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ConnectedToAgentTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AgentPauseDurationInSeconds: S.optional(S.Number),
  HierarchyGroups: S.optional(HierarchyGroups),
  DeviceInfo: S.optional(DeviceInfo),
  Capabilities: S.optional(ParticipantCapabilities),
  AfterContactWorkDuration: S.optional(S.Number),
  AfterContactWorkStartTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AfterContactWorkEndTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AgentInitiatedHoldDuration: S.optional(S.Number),
  StateTransitions: S.optional(StateTransitions),
}) {}
export class RoutingCriteria extends S.Class<RoutingCriteria>(
  "RoutingCriteria",
)({
  Steps: S.optional(Steps),
  ActivationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Index: S.optional(S.Number),
}) {}
export class QualityMetrics extends S.Class<QualityMetrics>("QualityMetrics")({
  Agent: S.optional(AgentQualityMetrics),
  Customer: S.optional(CustomerQualityMetrics),
}) {}
export class NextContactEntry extends S.Class<NextContactEntry>(
  "NextContactEntry",
)({
  Type: S.optional(S.String),
  NextContactMetadata: S.optional(NextContactMetadata),
}) {}
export const NextContacts = S.Array(NextContactEntry);
export class Dimensions extends S.Class<Dimensions>("Dimensions")({
  Queue: S.optional(QueueReference),
  Channel: S.optional(S.String),
  RoutingProfile: S.optional(RoutingProfileReference),
  RoutingStepExpression: S.optional(S.String),
  AgentStatus: S.optional(AgentStatusIdentifier),
  Subtype: S.optional(S.String),
  ValidationTestType: S.optional(S.String),
}) {}
export class UserReference extends S.Class<UserReference>("UserReference")({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
}) {}
export class AgentStatusReference extends S.Class<AgentStatusReference>(
  "AgentStatusReference",
)({
  StatusStartTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  StatusArn: S.optional(S.String),
  StatusName: S.optional(S.String),
}) {}
export const ChannelToCountMap = S.Record({ key: S.String, value: S.Number });
export class AgentContactReference extends S.Class<AgentContactReference>(
  "AgentContactReference",
)({
  ContactId: S.optional(S.String),
  Channel: S.optional(S.String),
  InitiationMethod: S.optional(S.String),
  AgentContactState: S.optional(S.String),
  StateStartTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ConnectedToAgentTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Queue: S.optional(QueueReference),
}) {}
export const AgentContactReferenceList = S.Array(AgentContactReference);
export class HistoricalMetricData extends S.Class<HistoricalMetricData>(
  "HistoricalMetricData",
)({ Metric: S.optional(HistoricalMetric), Value: S.optional(S.Number) }) {}
export const HistoricalMetricDataCollections = S.Array(HistoricalMetricData);
export const DimensionsV2Map = S.Record({ key: S.String, value: S.String });
export class MetricInterval extends S.Class<MetricInterval>("MetricInterval")({
  Interval: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class MetricDataV2 extends S.Class<MetricDataV2>("MetricDataV2")({
  Metric: S.optional(MetricV2),
  Value: S.optional(S.Number),
}) {}
export const MetricDataCollectionsV2 = S.Array(MetricDataV2);
export class RealTimeContactAnalysisSegmentTranscript extends S.Class<RealTimeContactAnalysisSegmentTranscript>(
  "RealTimeContactAnalysisSegmentTranscript",
)({
  Id: S.String,
  ParticipantId: S.String,
  ParticipantRole: S.String,
  DisplayName: S.optional(S.String),
  Content: S.String,
  ContentType: S.optional(S.String),
  Time: RealTimeContactAnalysisTimeData,
  Redaction: S.optional(RealTimeContactAnalysisTranscriptItemRedaction),
  Sentiment: S.optional(S.String),
}) {}
export class RealTimeContactAnalysisSegmentIssues extends S.Class<RealTimeContactAnalysisSegmentIssues>(
  "RealTimeContactAnalysisSegmentIssues",
)({ IssuesDetected: RealTimeContactAnalysisIssuesDetected }) {}
export class EvaluationSearchMetadata extends S.Class<EvaluationSearchMetadata>(
  "EvaluationSearchMetadata",
)({
  ContactId: S.String,
  EvaluatorArn: S.String,
  ContactAgentId: S.optional(S.String),
  CalibrationSessionId: S.optional(S.String),
  ScorePercentage: S.optional(S.Number),
  ScoreAutomaticFail: S.optional(S.Boolean),
  ScoreNotApplicable: S.optional(S.Boolean),
  AutoEvaluationEnabled: S.optional(S.Boolean),
  AutoEvaluationStatus: S.optional(S.String),
  AcknowledgedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AcknowledgedBy: S.optional(S.String),
  AcknowledgerComment: S.optional(S.String),
  SamplingJobId: S.optional(S.String),
  ReviewId: S.optional(S.String),
  ContactParticipantRole: S.optional(S.String),
  ContactParticipantId: S.optional(S.String),
}) {}
export class EvaluationFormNumericQuestionProperties extends S.Class<EvaluationFormNumericQuestionProperties>(
  "EvaluationFormNumericQuestionProperties",
)({
  MinValue: S.Number,
  MaxValue: S.Number,
  Options: S.optional(EvaluationFormNumericQuestionOptionList),
  Automation: S.optional(EvaluationFormNumericQuestionAutomation),
}) {}
export class AudioFeatures extends S.Class<AudioFeatures>("AudioFeatures")({
  EchoReduction: S.optional(S.String),
}) {}
export const ServiceQuotaExceededExceptionReason = S.Union(
  S.Struct({ AttachedFileServiceQuotaExceededExceptionReason: S.String }),
);
export const EvaluationFormSingleSelectQuestionAutomationOption = S.Union(
  S.Struct({ RuleCategory: SingleSelectQuestionRuleCategoryAutomation }),
);
export const EvaluationFormSingleSelectQuestionAutomationOptionList = S.Array(
  EvaluationFormSingleSelectQuestionAutomationOption,
);
export const EvaluationFormMultiSelectQuestionAutomationOption = S.Union(
  S.Struct({ RuleCategory: MultiSelectQuestionRuleCategoryAutomation }),
);
export const EvaluationFormMultiSelectQuestionAutomationOptionList = S.Array(
  EvaluationFormMultiSelectQuestionAutomationOption,
);
export class EvaluationFormItemEnablementExpression extends S.Class<EvaluationFormItemEnablementExpression>(
  "EvaluationFormItemEnablementExpression",
)({
  Source: EvaluationFormItemEnablementSource,
  Values: EvaluationFormItemEnablementSourceValueList,
  Comparator: S.String,
}) {}
export class Contact extends S.Class<Contact>("Contact")({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  InitialContactId: S.optional(S.String),
  PreviousContactId: S.optional(S.String),
  ContactAssociationId: S.optional(S.String),
  InitiationMethod: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Channel: S.optional(S.String),
  QueueInfo: S.optional(QueueInfo),
  AgentInfo: S.optional(AgentInfo),
  InitiationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  DisconnectTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastUpdateTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastPausedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastResumedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  RingStartTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  TotalPauseCount: S.optional(S.Number),
  TotalPauseDurationInSeconds: S.optional(S.Number),
  ScheduledTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  RelatedContactId: S.optional(S.String),
  WisdomInfo: S.optional(WisdomInfo),
  CustomerId: S.optional(S.String),
  CustomerEndpoint: S.optional(EndpointInfo),
  SystemEndpoint: S.optional(EndpointInfo),
  QueueTimeAdjustmentSeconds: S.optional(S.Number),
  QueuePriority: S.optional(S.Number),
  Tags: S.optional(ContactTagMap),
  ConnectedToSystemTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  RoutingCriteria: S.optional(RoutingCriteria),
  Customer: S.optional(Customer),
  Campaign: S.optional(Campaign),
  AnsweringMachineDetectionStatus: S.optional(S.String),
  CustomerVoiceActivity: S.optional(CustomerVoiceActivity),
  QualityMetrics: S.optional(QualityMetrics),
  ChatMetrics: S.optional(ChatMetrics),
  DisconnectDetails: S.optional(DisconnectDetails),
  AdditionalEmailRecipients: S.optional(AdditionalEmailRecipients),
  SegmentAttributes: S.optional(SegmentAttributes),
  Recordings: S.optional(Recordings),
  DisconnectReason: S.optional(S.String),
  ContactEvaluations: S.optional(ContactEvaluations),
  TaskTemplateInfo: S.optional(TaskTemplateInfoV2),
  ContactDetails: S.optional(ContactDetails),
  OutboundStrategy: S.optional(OutboundStrategy),
  Attributes: S.optional(Attributes),
  NextContacts: S.optional(NextContacts),
  GlobalResiliencyMetadata: S.optional(GlobalResiliencyMetadata),
}) {}
export class CurrentMetricResult extends S.Class<CurrentMetricResult>(
  "CurrentMetricResult",
)({
  Dimensions: S.optional(Dimensions),
  Collections: S.optional(CurrentMetricDataCollections),
}) {}
export const CurrentMetricResults = S.Array(CurrentMetricResult);
export class HistoricalMetricResult extends S.Class<HistoricalMetricResult>(
  "HistoricalMetricResult",
)({
  Dimensions: S.optional(Dimensions),
  Collections: S.optional(HistoricalMetricDataCollections),
}) {}
export const HistoricalMetricResults = S.Array(HistoricalMetricResult);
export class MetricResultV2 extends S.Class<MetricResultV2>("MetricResultV2")({
  Dimensions: S.optional(DimensionsV2Map),
  MetricInterval: S.optional(MetricInterval),
  Collections: S.optional(MetricDataCollectionsV2),
}) {}
export const MetricResultsV2 = S.Array(MetricResultV2);
export class RealTimeContactAnalysisTranscriptItemWithCharacterOffsets extends S.Class<RealTimeContactAnalysisTranscriptItemWithCharacterOffsets>(
  "RealTimeContactAnalysisTranscriptItemWithCharacterOffsets",
)({
  Id: S.String,
  CharacterOffsets: S.optional(RealTimeContactAnalysisCharacterInterval),
}) {}
export const RealTimeContactAnalysisTranscriptItemsWithCharacterOffsets =
  S.Array(RealTimeContactAnalysisTranscriptItemWithCharacterOffsets);
export class EvaluationSearchSummary extends S.Class<EvaluationSearchSummary>(
  "EvaluationSearchSummary",
)({
  EvaluationId: S.String,
  EvaluationArn: S.String,
  EvaluationFormId: S.optional(S.String),
  EvaluationFormVersion: S.Number,
  EvaluationFormTitle: S.optional(S.String),
  Metadata: EvaluationSearchMetadata,
  Status: S.String,
  EvaluationType: S.optional(S.String),
  CreatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Tags: S.optional(TagMap),
}) {}
export const EvaluationSearchSummaryList = S.Array(EvaluationSearchSummary);
export class HierarchyGroupSummaryReference extends S.Class<HierarchyGroupSummaryReference>(
  "HierarchyGroupSummaryReference",
)({ Id: S.optional(S.String), Arn: S.optional(S.String) }) {}
export class MeetingFeaturesConfiguration extends S.Class<MeetingFeaturesConfiguration>(
  "MeetingFeaturesConfiguration",
)({ Audio: S.optional(AudioFeatures) }) {}
export class EvaluationFormSingleSelectQuestionAutomation extends S.Class<EvaluationFormSingleSelectQuestionAutomation>(
  "EvaluationFormSingleSelectQuestionAutomation",
)({
  Options: S.optional(EvaluationFormSingleSelectQuestionAutomationOptionList),
  DefaultOptionRefId: S.optional(S.String),
  AnswerSource: S.optional(EvaluationFormQuestionAutomationAnswerSource),
}) {}
export class EvaluationFormMultiSelectQuestionAutomation extends S.Class<EvaluationFormMultiSelectQuestionAutomation>(
  "EvaluationFormMultiSelectQuestionAutomation",
)({
  Options: S.optional(EvaluationFormMultiSelectQuestionAutomationOptionList),
  DefaultOptionRefIds: S.optional(ReferenceIdList),
  AnswerSource: S.optional(EvaluationFormQuestionAutomationAnswerSource),
}) {}
export type EvaluationFormItemEnablementConditionOperand =
  | { Expression: EvaluationFormItemEnablementExpression }
  | { Condition: EvaluationFormItemEnablementCondition };
export const EvaluationFormItemEnablementConditionOperand = S.Union(
  S.Struct({ Expression: EvaluationFormItemEnablementExpression }),
  S.Struct({
    Condition: S.suspend(
      (): S.Schema<EvaluationFormItemEnablementCondition, any> =>
        EvaluationFormItemEnablementCondition,
    ),
  }),
) as any as S.Schema<EvaluationFormItemEnablementConditionOperand>;
export type EvaluationFormItemEnablementConditionOperandList =
  EvaluationFormItemEnablementConditionOperand[];
export const EvaluationFormItemEnablementConditionOperandList = S.Array(
  S.suspend(() => EvaluationFormItemEnablementConditionOperand),
) as any as S.Schema<EvaluationFormItemEnablementConditionOperandList>;
export class CreateRuleResponse extends S.Class<CreateRuleResponse>(
  "CreateRuleResponse",
)({ RuleArn: S.String, RuleId: S.String }) {}
export class CreateSecurityProfileResponse extends S.Class<CreateSecurityProfileResponse>(
  "CreateSecurityProfileResponse",
)({
  SecurityProfileId: S.optional(S.String),
  SecurityProfileArn: S.optional(S.String),
}) {}
export class CreateWorkspaceResponse extends S.Class<CreateWorkspaceResponse>(
  "CreateWorkspaceResponse",
)({ WorkspaceId: S.String, WorkspaceArn: S.String }) {}
export class DescribeContactResponse extends S.Class<DescribeContactResponse>(
  "DescribeContactResponse",
)({ Contact: S.optional(Contact) }) {}
export class GetCurrentMetricDataResponse extends S.Class<GetCurrentMetricDataResponse>(
  "GetCurrentMetricDataResponse",
)({
  NextToken: S.optional(S.String),
  MetricResults: S.optional(CurrentMetricResults),
  DataSnapshotTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class GetMetricDataResponse extends S.Class<GetMetricDataResponse>(
  "GetMetricDataResponse",
)({
  NextToken: S.optional(S.String),
  MetricResults: S.optional(HistoricalMetricResults),
}) {}
export class GetMetricDataV2Response extends S.Class<GetMetricDataV2Response>(
  "GetMetricDataV2Response",
)({
  NextToken: S.optional(S.String),
  MetricResults: S.optional(MetricResultsV2),
}) {}
export class RealTimeContactAnalysisPointOfInterest extends S.Class<RealTimeContactAnalysisPointOfInterest>(
  "RealTimeContactAnalysisPointOfInterest",
)({
  TranscriptItems: S.optional(
    RealTimeContactAnalysisTranscriptItemsWithCharacterOffsets,
  ),
}) {}
export const RealTimeContactAnalysisPointsOfInterest = S.Array(
  RealTimeContactAnalysisPointOfInterest,
);
export class SearchContactEvaluationsResponse extends S.Class<SearchContactEvaluationsResponse>(
  "SearchContactEvaluationsResponse",
)({
  EvaluationSearchSummaryList: S.optional(EvaluationSearchSummaryList),
  NextToken: S.optional(S.String),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class StartOutboundVoiceContactRequest extends S.Class<StartOutboundVoiceContactRequest>(
  "StartOutboundVoiceContactRequest",
)(
  {
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    References: S.optional(ContactReferences),
    RelatedContactId: S.optional(S.String),
    DestinationPhoneNumber: S.String,
    ContactFlowId: S.String,
    InstanceId: S.String,
    ClientToken: S.optional(S.String),
    SourcePhoneNumber: S.optional(S.String),
    QueueId: S.optional(S.String),
    Attributes: S.optional(Attributes),
    AnswerMachineDetectionConfig: S.optional(AnswerMachineDetectionConfig),
    CampaignId: S.optional(S.String),
    TrafficType: S.optional(S.String),
    OutboundStrategy: S.optional(OutboundStrategy),
    RingTimeoutInSeconds: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/contact/outbound-voice" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EvaluationSuggestedAnswerTranscriptMillisecondOffsets extends S.Class<EvaluationSuggestedAnswerTranscriptMillisecondOffsets>(
  "EvaluationSuggestedAnswerTranscriptMillisecondOffsets",
)({ BeginOffsetMillis: S.Number }) {}
export class EvaluationTranscriptPointOfInterest extends S.Class<EvaluationTranscriptPointOfInterest>(
  "EvaluationTranscriptPointOfInterest",
)({
  MillisecondOffsets: S.optional(
    EvaluationSuggestedAnswerTranscriptMillisecondOffsets,
  ),
  TranscriptSegment: S.optional(S.String),
}) {}
export const EvaluationTranscriptPointsOfInterest = S.Array(
  EvaluationTranscriptPointOfInterest,
);
export class EvaluationAutomationRuleCategory extends S.Class<EvaluationAutomationRuleCategory>(
  "EvaluationAutomationRuleCategory",
)({
  Category: S.String,
  Condition: S.String,
  PointsOfInterest: S.optional(EvaluationTranscriptPointsOfInterest),
}) {}
export const EvaluationAutomationRuleCategoryList = S.Array(
  EvaluationAutomationRuleCategory,
);
export class HierarchyPathReference extends S.Class<HierarchyPathReference>(
  "HierarchyPathReference",
)({
  LevelOne: S.optional(HierarchyGroupSummaryReference),
  LevelTwo: S.optional(HierarchyGroupSummaryReference),
  LevelThree: S.optional(HierarchyGroupSummaryReference),
  LevelFour: S.optional(HierarchyGroupSummaryReference),
  LevelFive: S.optional(HierarchyGroupSummaryReference),
}) {}
export class UserIdentityInfoLite extends S.Class<UserIdentityInfoLite>(
  "UserIdentityInfoLite",
)({ FirstName: S.optional(S.String), LastName: S.optional(S.String) }) {}
export class Meeting extends S.Class<Meeting>("Meeting")({
  MediaRegion: S.optional(S.String),
  MediaPlacement: S.optional(MediaPlacement),
  MeetingFeatures: S.optional(MeetingFeaturesConfiguration),
  MeetingId: S.optional(S.String),
}) {}
export class RoutingCriteriaInputStep extends S.Class<RoutingCriteriaInputStep>(
  "RoutingCriteriaInputStep",
)({
  Expiry: S.optional(RoutingCriteriaInputStepExpiry),
  Expression: S.optional(Expression),
}) {}
export const RoutingCriteriaInputSteps = S.Array(RoutingCriteriaInputStep);
export class EvaluationFormSingleSelectQuestionProperties extends S.Class<EvaluationFormSingleSelectQuestionProperties>(
  "EvaluationFormSingleSelectQuestionProperties",
)({
  Options: EvaluationFormSingleSelectQuestionOptionList,
  DisplayAs: S.optional(S.String),
  Automation: S.optional(EvaluationFormSingleSelectQuestionAutomation),
}) {}
export class EvaluationFormMultiSelectQuestionProperties extends S.Class<EvaluationFormMultiSelectQuestionProperties>(
  "EvaluationFormMultiSelectQuestionProperties",
)({
  Options: EvaluationFormMultiSelectQuestionOptionList,
  DisplayAs: S.optional(S.String),
  Automation: S.optional(EvaluationFormMultiSelectQuestionAutomation),
}) {}
export class EvaluationFormItemEnablementCondition extends S.Class<EvaluationFormItemEnablementCondition>(
  "EvaluationFormItemEnablementCondition",
)({
  Operands: S.suspend(() => EvaluationFormItemEnablementConditionOperandList),
  Operator: S.optional(S.String),
}) {}
export class RealTimeContactAnalysisCategoryDetails extends S.Class<RealTimeContactAnalysisCategoryDetails>(
  "RealTimeContactAnalysisCategoryDetails",
)({ PointsOfInterest: RealTimeContactAnalysisPointsOfInterest }) {}
export class EvaluationContactLensAnswerAnalysisDetails extends S.Class<EvaluationContactLensAnswerAnalysisDetails>(
  "EvaluationContactLensAnswerAnalysisDetails",
)({
  MatchedRuleCategories: S.optional(EvaluationAutomationRuleCategoryList),
}) {}
export class UserData extends S.Class<UserData>("UserData")({
  User: S.optional(UserReference),
  RoutingProfile: S.optional(RoutingProfileReference),
  HierarchyPath: S.optional(HierarchyPathReference),
  Status: S.optional(AgentStatusReference),
  AvailableSlotsByChannel: S.optional(ChannelToCountMap),
  MaxSlotsByChannel: S.optional(ChannelToCountMap),
  ActiveSlotsByChannel: S.optional(ChannelToCountMap),
  Contacts: S.optional(AgentContactReferenceList),
  NextStatus: S.optional(S.String),
}) {}
export const UserDataList = S.Array(UserData);
export class UserSearchSummary extends S.Class<UserSearchSummary>(
  "UserSearchSummary",
)({
  Arn: S.optional(S.String),
  DirectoryUserId: S.optional(S.String),
  HierarchyGroupId: S.optional(S.String),
  Id: S.optional(S.String),
  IdentityInfo: S.optional(UserIdentityInfoLite),
  PhoneConfig: S.optional(UserPhoneConfig),
  RoutingProfileId: S.optional(S.String),
  SecurityProfileIds: S.optional(SecurityProfileIds),
  Tags: S.optional(TagMap),
  Username: S.optional(S.String),
}) {}
export const UserSearchSummaryList = S.Array(UserSearchSummary);
export class ConnectionData extends S.Class<ConnectionData>("ConnectionData")({
  Attendee: S.optional(Attendee),
  Meeting: S.optional(Meeting),
}) {}
export class RoutingCriteriaInput extends S.Class<RoutingCriteriaInput>(
  "RoutingCriteriaInput",
)({ Steps: S.optional(RoutingCriteriaInputSteps) }) {}
export const EvaluationFormQuestionTypeProperties = S.Union(
  S.Struct({ Numeric: EvaluationFormNumericQuestionProperties }),
  S.Struct({ SingleSelect: EvaluationFormSingleSelectQuestionProperties }),
  S.Struct({ Text: EvaluationFormTextQuestionProperties }),
  S.Struct({ MultiSelect: EvaluationFormMultiSelectQuestionProperties }),
);
export class EvaluationFormItemEnablementConfiguration extends S.Class<EvaluationFormItemEnablementConfiguration>(
  "EvaluationFormItemEnablementConfiguration",
)({
  Condition: EvaluationFormItemEnablementCondition,
  Action: S.String,
  DefaultAction: S.optional(S.String),
}) {}
export const RealTimeContactAnalysisMatchedDetails = S.Record({
  key: S.String,
  value: RealTimeContactAnalysisCategoryDetails,
});
export class GetCurrentUserDataResponse extends S.Class<GetCurrentUserDataResponse>(
  "GetCurrentUserDataResponse",
)({
  NextToken: S.optional(S.String),
  UserDataList: S.optional(UserDataList),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class SearchUsersResponse extends S.Class<SearchUsersResponse>(
  "SearchUsersResponse",
)({
  Users: S.optional(UserSearchSummaryList),
  NextToken: S.optional(S.String),
  ApproximateTotalCount: S.optional(S.Number),
}) {}
export class StartOutboundVoiceContactResponse extends S.Class<StartOutboundVoiceContactResponse>(
  "StartOutboundVoiceContactResponse",
)({ ContactId: S.optional(S.String) }) {}
export class StartWebRTCContactResponse extends S.Class<StartWebRTCContactResponse>(
  "StartWebRTCContactResponse",
)({
  ConnectionData: S.optional(ConnectionData),
  ContactId: S.optional(S.String),
  ParticipantId: S.optional(S.String),
  ParticipantToken: S.optional(S.String),
}) {}
export class UpdateContactRoutingDataRequest extends S.Class<UpdateContactRoutingDataRequest>(
  "UpdateContactRoutingDataRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    ContactId: S.String.pipe(T.HttpLabel("ContactId")),
    QueueTimeAdjustmentSeconds: S.optional(S.Number),
    QueuePriority: S.optional(S.Number),
    RoutingCriteria: S.optional(RoutingCriteriaInput),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/contacts/{InstanceId}/{ContactId}/routing-data",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateContactRoutingDataResponse extends S.Class<UpdateContactRoutingDataResponse>(
  "UpdateContactRoutingDataResponse",
)({}) {}
export class EvaluationFormQuestion extends S.Class<EvaluationFormQuestion>(
  "EvaluationFormQuestion",
)({
  Title: S.String,
  Instructions: S.optional(S.String),
  RefId: S.String,
  NotApplicableEnabled: S.optional(S.Boolean),
  QuestionType: S.String,
  QuestionTypeProperties: S.optional(EvaluationFormQuestionTypeProperties),
  Enablement: S.optional(EvaluationFormItemEnablementConfiguration),
  Weight: S.optional(S.Number),
}) {}
export class RealTimeContactAnalysisSegmentCategories extends S.Class<RealTimeContactAnalysisSegmentCategories>(
  "RealTimeContactAnalysisSegmentCategories",
)({ MatchedDetails: RealTimeContactAnalysisMatchedDetails }) {}
export class ContactSearchSummaryQueueInfo extends S.Class<ContactSearchSummaryQueueInfo>(
  "ContactSearchSummaryQueueInfo",
)({
  Id: S.optional(S.String),
  EnqueueTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ContactSearchSummaryAgentInfo extends S.Class<ContactSearchSummaryAgentInfo>(
  "ContactSearchSummaryAgentInfo",
)({
  Id: S.optional(S.String),
  ConnectedToAgentTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export type EvaluationFormItem =
  | { Section: EvaluationFormSection }
  | { Question: EvaluationFormQuestion };
export const EvaluationFormItem = S.Union(
  S.Struct({
    Section: S.suspend(
      (): S.Schema<EvaluationFormSection, any> => EvaluationFormSection,
    ),
  }),
  S.Struct({ Question: EvaluationFormQuestion }),
) as any as S.Schema<EvaluationFormItem>;
export class EvaluationGenAIAnswerAnalysisDetails extends S.Class<EvaluationGenAIAnswerAnalysisDetails>(
  "EvaluationGenAIAnswerAnalysisDetails",
)({
  Justification: S.optional(S.String),
  PointsOfInterest: S.optional(EvaluationTranscriptPointsOfInterest),
}) {}
export const RealtimeContactAnalysisSegment = S.Union(
  S.Struct({ Transcript: RealTimeContactAnalysisSegmentTranscript }),
  S.Struct({ Categories: RealTimeContactAnalysisSegmentCategories }),
  S.Struct({ Issues: RealTimeContactAnalysisSegmentIssues }),
  S.Struct({ Event: RealTimeContactAnalysisSegmentEvent }),
  S.Struct({ Attachments: RealTimeContactAnalysisSegmentAttachments }),
  S.Struct({
    PostContactSummary: RealTimeContactAnalysisSegmentPostContactSummary,
  }),
);
export const RealtimeContactAnalysisSegments = S.Array(
  RealtimeContactAnalysisSegment,
);
export class ContactSearchSummarySegmentAttributeValue extends S.Class<ContactSearchSummarySegmentAttributeValue>(
  "ContactSearchSummarySegmentAttributeValue",
)({
  ValueString: S.optional(S.String),
  ValueMap: S.optional(SegmentAttributeValueMap),
}) {}
export class CreateEvaluationFormRequest extends S.Class<CreateEvaluationFormRequest>(
  "CreateEvaluationFormRequest",
)(
  {
    InstanceId: S.String.pipe(T.HttpLabel("InstanceId")),
    Title: S.String,
    Description: S.optional(S.String),
    Items: EvaluationFormItemsList,
    ScoringStrategy: S.optional(EvaluationFormScoringStrategy),
    AutoEvaluationConfiguration: S.optional(
      EvaluationFormAutoEvaluationConfiguration,
    ),
    ClientToken: S.optional(S.String),
    AsDraft: S.optional(S.Boolean),
    Tags: S.optional(TagMap),
    TargetConfiguration: S.optional(EvaluationFormTargetConfiguration),
    LanguageConfiguration: S.optional(EvaluationFormLanguageConfiguration),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/evaluation-forms/{InstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const EvaluationQuestionAnswerAnalysisDetails = S.Union(
  S.Struct({ GenAI: EvaluationGenAIAnswerAnalysisDetails }),
  S.Struct({ ContactLens: EvaluationContactLensAnswerAnalysisDetails }),
);
export class ListRealtimeContactAnalysisSegmentsV2Response extends S.Class<ListRealtimeContactAnalysisSegmentsV2Response>(
  "ListRealtimeContactAnalysisSegmentsV2Response",
)({
  Channel: S.String,
  Status: S.String,
  Segments: RealtimeContactAnalysisSegments,
  NextToken: S.optional(S.String),
}) {}
export const ContactSearchSummarySegmentAttributes = S.Record({
  key: S.String,
  value: ContactSearchSummarySegmentAttributeValue,
});
export class EvaluationSuggestedAnswer extends S.Class<EvaluationSuggestedAnswer>(
  "EvaluationSuggestedAnswer",
)({
  Value: S.optional(EvaluationAnswerData),
  Status: S.String,
  Input: S.optional(EvaluationQuestionInputDetails),
  AnalysisType: S.String,
  AnalysisDetails: S.optional(EvaluationQuestionAnswerAnalysisDetails),
}) {}
export const EvaluationSuggestedAnswersList = S.Array(
  EvaluationSuggestedAnswer,
);
export class ContactSearchSummary extends S.Class<ContactSearchSummary>(
  "ContactSearchSummary",
)({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  InitialContactId: S.optional(S.String),
  PreviousContactId: S.optional(S.String),
  InitiationMethod: S.optional(S.String),
  Channel: S.optional(S.String),
  QueueInfo: S.optional(ContactSearchSummaryQueueInfo),
  AgentInfo: S.optional(ContactSearchSummaryAgentInfo),
  InitiationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  DisconnectTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ScheduledTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  SegmentAttributes: S.optional(ContactSearchSummarySegmentAttributes),
  Name: S.optional(S.String),
  RoutingCriteria: S.optional(RoutingCriteria),
  GlobalResiliencyMetadata: S.optional(GlobalResiliencyMetadata),
}) {}
export const Contacts = S.Array(ContactSearchSummary);
export class EvaluationAnswerOutput extends S.Class<EvaluationAnswerOutput>(
  "EvaluationAnswerOutput",
)({
  Value: S.optional(EvaluationAnswerData),
  SystemSuggestedValue: S.optional(EvaluationAnswerData),
  SuggestedAnswers: S.optional(EvaluationSuggestedAnswersList),
}) {}
export class CreateEvaluationFormResponse extends S.Class<CreateEvaluationFormResponse>(
  "CreateEvaluationFormResponse",
)({ EvaluationFormId: S.String, EvaluationFormArn: S.String }) {}
export class SearchContactsResponse extends S.Class<SearchContactsResponse>(
  "SearchContactsResponse",
)({
  Contacts: Contacts,
  NextToken: S.optional(S.String),
  TotalCount: S.optional(S.Number),
}) {}
export const EvaluationAnswersOutputMap = S.Record({
  key: S.String,
  value: EvaluationAnswerOutput,
});
export class Evaluation extends S.Class<Evaluation>("Evaluation")({
  EvaluationId: S.String,
  EvaluationArn: S.String,
  Metadata: EvaluationMetadata,
  Answers: EvaluationAnswersOutputMap,
  Notes: EvaluationNotesMap,
  Status: S.String,
  Scores: S.optional(EvaluationScoresMap),
  CreatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EvaluationType: S.optional(S.String),
  Tags: S.optional(TagMap),
}) {}
export class DescribeContactEvaluationResponse extends S.Class<DescribeContactEvaluationResponse>(
  "DescribeContactEvaluationResponse",
)({ Evaluation: Evaluation, EvaluationForm: EvaluationFormContent }) {}

//# Errors
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccessDeniedException", httpResponseCode: 403 }),
) {}
export class DuplicateResourceException extends S.TaggedError<DuplicateResourceException>()(
  "DuplicateResourceException",
  { Message: S.optional(S.String) },
) {}
export class ConditionalOperationFailedException extends S.TaggedError<ConditionalOperationFailedException>()(
  "ConditionalOperationFailedException",
  { Message: S.optional(S.String) },
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { Message: S.optional(S.String) },
) {}
export class IdempotencyException extends S.TaggedError<IdempotencyException>()(
  "IdempotencyException",
  { Message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class InvalidActiveRegionException extends S.TaggedError<InvalidActiveRegionException>()(
  "InvalidActiveRegionException",
  { Message: S.optional(S.String) },
) {}
export class ContactNotFoundException extends S.TaggedError<ContactNotFoundException>()(
  "ContactNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ContactNotFoundException", httpResponseCode: 410 }),
) {}
export class InvalidContactFlowModuleException extends S.TaggedError<InvalidContactFlowModuleException>()(
  "InvalidContactFlowModuleException",
  { Problems: S.optional(Problems) },
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {
    Message: S.optional(S.String),
    Reason: S.optional(InvalidRequestExceptionReason),
  },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ContactFlowNotPublishedException extends S.TaggedError<ContactFlowNotPublishedException>()(
  "ContactFlowNotPublishedException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ThrottlingException", httpResponseCode: 429 }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourceConflictException extends S.TaggedError<ResourceConflictException>()(
  "ResourceConflictException",
  { Message: S.optional(S.String) },
) {}
export class InvalidContactFlowException extends S.TaggedError<InvalidContactFlowException>()(
  "InvalidContactFlowException",
  { problems: S.optional(Problems) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  {
    Message: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
  },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "LimitExceededException", httpResponseCode: 429 }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class PropertyValidationException extends S.TaggedError<PropertyValidationException>()(
  "PropertyValidationException",
  {
    Message: S.String,
    PropertyList: S.optional(PropertyValidationExceptionPropertyList),
  },
) {}
export class ResourceNotReadyException extends S.TaggedError<ResourceNotReadyException>()(
  "ResourceNotReadyException",
  { Message: S.optional(S.String) },
) {}
export class UserNotFoundException extends S.TaggedError<UserNotFoundException>()(
  "UserNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.optional(S.String),
    Reason: S.optional(ServiceQuotaExceededExceptionReason),
  },
) {}
export class MaximumResultReturnedException extends S.TaggedError<MaximumResultReturnedException>()(
  "MaximumResultReturnedException",
  { Message: S.optional(S.String) },
) {}
export class DestinationNotAllowedException extends S.TaggedError<DestinationNotAllowedException>()(
  "DestinationNotAllowedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DestinationNotAllowedException",
    httpResponseCode: 403,
  }),
) {}
export class OutputTypeNotFoundException extends S.TaggedError<OutputTypeNotFoundException>()(
  "OutputTypeNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class OutboundContactNotPermittedException extends S.TaggedError<OutboundContactNotPermittedException>()(
  "OutboundContactNotPermittedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OutboundContactNotPermittedException",
    httpResponseCode: 403,
  }),
) {}

//# Operations
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Returns the current state of the specified instance identifier. It tracks the instance while it is being created
 * and returns an error status, if applicable.
 *
 * If an instance is not created successfully, the instance status reason field returns details relevant to the
 * reason. The instance in a failed state is returned only for 24 hours after the CreateInstance API was invoked.
 */
export const describeInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInstanceRequest,
  output: DescribeInstanceResponse,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Searches for available phone numbers that you can claim to your Amazon Connect instance or traffic distribution group. If the
 * provided `TargetArn` is a traffic distribution group, you can call this API in both Amazon Web Services Regions associated with
 * the traffic distribution group.
 */
export const searchAvailablePhoneNumbers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: SearchAvailablePhoneNumbersRequest,
    output: SearchAvailablePhoneNumbersResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "AvailableNumbersList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Searches the flow modules in an Amazon Connect instance, with optional filtering.
 */
export const searchContactFlowModules =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: SearchContactFlowModulesRequest,
    output: SearchContactFlowModulesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ContactFlowModules",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Searches email address in an instance, with optional filtering.
 */
export const searchEmailAddresses = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SearchEmailAddressesRequest,
    output: SearchEmailAddressesResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Searches evaluation forms in an Amazon Connect instance, with optional filtering.
 *
 * **Use cases**
 *
 * Following are common uses cases for this API:
 *
 * - List all evaluation forms in an instance.
 *
 * - Find all evaluation forms that meet specific criteria, such as Title, Description, Status, and more.
 *
 * - Find all evaluation forms that are tagged with a specific set of tags.
 *
 * **Important things to know**
 *
 * - A Search operation, unlike a List operation, takes time to index changes to resource (create, update or
 * delete). If you don't see updated information for recently changed contact evaluations, try calling the API again
 * in a few seconds.
 *
 * **Endpoints**: See Amazon Connect endpoints and quotas.
 */
export const searchEvaluationForms = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SearchEvaluationFormsRequest,
    output: SearchEvaluationFormsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Searches the hours of operation overrides.
 */
export const searchHoursOfOperationOverrides =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: SearchHoursOfOperationOverridesRequest,
    output: SearchHoursOfOperationOverridesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "HoursOfOperationOverrides",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Searches security profiles in an Amazon Connect instance, with optional filtering.
 *
 * For information about security profiles, see Security Profiles in the *Amazon Connect Administrator Guide*. For a mapping of the API name and user interface name of the security
 * profile permissions, see List
 * of security profile permissions.
 */
export const searchSecurityProfiles =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: SearchSecurityProfilesRequest,
    output: SearchSecurityProfilesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "SecurityProfiles",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Searches for workspace associations with users or routing profiles based on various criteria.
 */
export const searchWorkspaceAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: SearchWorkspaceAssociationsRequest,
    output: SearchWorkspaceAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "WorkspaceAssociations",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Searches workspaces based on name, description, visibility, or tags.
 */
export const searchWorkspaces = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: SearchWorkspacesRequest,
    output: SearchWorkspacesResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Workspaces",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Updates the specified flow.
 *
 * You can also create and update flows using the Amazon Connect
 * Flow language.
 *
 * Use the `$SAVED` alias in the request to describe the `SAVED` content of a Flow. For
 * example, `arn:aws:.../contact-flow/{id}:$SAVED`. After a flow is published, `$SAVED` needs to
 * be supplied to view saved content that has not been published.
 */
export const updateContactFlowContent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateContactFlowContentRequest,
    output: UpdateContactFlowContentResponse,
    errors: [
      InternalServiceException,
      InvalidContactFlowException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves the contact attributes for the specified contact.
 */
export const getContactAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetContactAttributesRequest,
    output: GetContactAttributesResponse,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Retrieves the current traffic distribution for a given traffic distribution group.
 */
export const getTrafficDistribution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTrafficDistributionRequest,
    output: GetTrafficDistributionResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Deletes the Amazon Connect instance. For more information, see Delete your Amazon Connect instance in the
 * *Amazon Connect Administrator Guide*.
 *
 * Amazon Connect enforces a limit on the total number of instances that you can create or delete in 30 days.
 * If you exceed this limit, you will get an error message indicating there has been an excessive number of attempts at creating or deleting instances.
 * You must wait 30 days before you can restart creating and deleting instances in your account.
 */
export const deleteInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInstanceRequest,
  output: DeleteInstanceResponse,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes an Amazon Web Services resource association from an Amazon Connect instance. The association must not
 * have any use cases associated with it.
 */
export const deleteIntegrationAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteIntegrationAssociationRequest,
    output: DeleteIntegrationAssociationResponse,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes a use case from an integration association.
 */
export const deleteUseCase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUseCaseRequest,
  output: DeleteUseCaseResponse,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Revokes authorization from the specified instance to access the specified Amazon Lex or Amazon Lex V2 bot.
 */
export const disassociateBot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateBotRequest,
  output: DisassociateBotResponse,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Associates an existing vocabulary as the default. Contact Lens for Amazon Connect uses the vocabulary in post-call and real-time
 * analysis sessions for the given language.
 */
export const associateDefaultVocabulary = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateDefaultVocabularyRequest,
    output: AssociateDefaultVocabularyResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Associates an agent with a traffic distribution group. This API can be called only in the Region where the traffic distribution group
 * is created.
 */
export const associateTrafficDistributionGroupUser =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateTrafficDistributionGroupUserRequest,
    output: AssociateTrafficDistributionGroupUserResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidRequestException,
      ResourceConflictException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Allows you to confirm that the attached file has been uploaded using the pre-signed URL provided in the
 * StartAttachedFileUpload API.
 */
export const completeAttachedFileUpload = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CompleteAttachedFileUploadRequest,
    output: CompleteAttachedFileUploadResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes an attached file along with the underlying S3 Object.
 *
 * The attached file is **permanently deleted** if S3 bucket versioning is not
 * enabled.
 */
export const deleteAttachedFile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAttachedFileRequest,
  output: DeleteAttachedFileResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a rule for the specified Amazon Connect instance.
 */
export const deleteRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRuleRequest,
  output: DeleteRuleResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Disassociates an agent from a traffic distribution group. This API can be called only in the Region where the
 * traffic distribution group is created.
 */
export const disassociateTrafficDistributionGroupUser =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateTrafficDistributionGroupUserRequest,
    output: DisassociateTrafficDistributionGroupUserResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidRequestException,
      ResourceConflictException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Updates a rule for the specified Amazon Connect instance.
 *
 * Use the Rules Function
 * language to code conditions for the rule.
 */
export const updateRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRuleRequest,
  output: UpdateRuleResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidRequestException,
    ResourceConflictException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates an Amazon Web Services resource association with an Amazon Connect instance.
 */
export const createIntegrationAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateIntegrationAssociationRequest,
    output: CreateIntegrationAssociationResponse,
    errors: [
      DuplicateResourceException,
      InternalServiceException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Creates a use case for an integration association.
 */
export const createUseCase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUseCaseRequest,
  output: CreateUseCaseResponse,
  errors: [
    DuplicateResourceException,
    InternalServiceException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Associates an email address alias with an existing email address in an Amazon Connect instance. This creates
 * a forwarding relationship where emails sent to the alias email address are automatically forwarded to the primary
 * email address.
 *
 * **Use cases**
 *
 * Following are common uses cases for this API:
 *
 * - **Unified customer support**: Create multiple entry points (for example,
 * support@example.com, help@example.com, customercare@example.com) that all forward to a single agent queue for
 * streamlined management.
 *
 * - **Department consolidation**: Forward emails from legacy department addresses
 * (for example, sales@example.com, info@example.com) to a centralized customer service email during organizational
 * restructuring.
 *
 * - **Brand management**: Enable you to use familiar brand-specific email addresses
 * that forward to the appropriate Amazon Connect instance email address.
 *
 * **Important things to know**
 *
 * - Each email address can have a maximum of one alias. You cannot create multiple aliases for the same email
 * address.
 *
 * - If the alias email address already receives direct emails, it continues to receive direct emails plus
 * forwarded emails.
 *
 * - You cannot chain email aliases together (that is, create an alias of an alias).
 *
 * `AssociateEmailAddressAlias` does not return the following information:
 *
 * - A confirmation of the alias relationship details (you must call DescribeEmailAddress to verify).
 *
 * - The timestamp of when the association occurred.
 *
 * - The status of the forwarding configuration.
 *
 * **Endpoints**: See Amazon Connect endpoints and quotas.
 *
 * **Related operations**
 *
 * - DisassociateEmailAddressAlias: Removes the alias association between two email addresses in an Amazon Connect instance.
 *
 * - DescribeEmailAddress: View current alias configurations for an email address.
 *
 * - SearchEmailAddresses: Find email addresses and their alias relationships across an instance.
 *
 * - CreateEmailAddress: Create new email addresses that can participate in alias relationships.
 *
 * - DeleteEmailAddress: Remove email addresses (automatically removes any alias relationships).
 *
 * - UpdateEmailAddressMetadata: Modify email address properties (does not affect alias relationships).
 */
export const associateEmailAddressAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateEmailAddressAliasRequest,
    output: AssociateEmailAddressAliasResponse,
    errors: [
      AccessDeniedException,
      IdempotencyException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceConflictException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Associates a workspace with one or more users or routing profiles, allowing them to access the workspace's
 * configured views and pages.
 */
export const associateWorkspace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateWorkspaceRequest,
  output: AssociateWorkspaceResponse,
  errors: [
    AccessDeniedException,
    DuplicateResourceException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Associates a list of analytics datasets for a given Amazon Connect instance to a target account. You can
 * associate multiple datasets in a single call.
 */
export const batchAssociateAnalyticsDataSet =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchAssociateAnalyticsDataSetRequest,
    output: BatchAssociateAnalyticsDataSetResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Allows you to retrieve metadata about multiple attached files on an associated resource. Each attached file
 * provided in the input list must be associated with the input AssociatedResourceArn.
 */
export const batchGetAttachedFileMetadata =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchGetAttachedFileMetadataRequest,
    output: BatchGetAttachedFileMetadataResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieve the flow associations for the given resources.
 */
export const batchGetFlowAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetFlowAssociationRequest,
    output: BatchGetFlowAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes an agent status.
 */
export const describeAgentStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAgentStatusRequest,
  output: DescribeAgentStatusResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * This API is in preview release for Amazon Connect and is subject to change. To
 * request access to this API, contact Amazon Web Services Support.
 *
 * Describes the target authentication profile.
 */
export const describeAuthenticationProfile =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAuthenticationProfileRequest,
    output: DescribeAuthenticationProfileResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Describes the specified flow module.
 *
 * Use the `$SAVED` alias in the request to describe the `SAVED` content of a Flow. For
 * example, `arn:aws:.../contact-flow/{id}:$SAVED`. After a flow is published, `$SAVED` needs to
 * be supplied to view saved content that has not been published.
 */
export const describeContactFlowModule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeContactFlowModuleRequest,
    output: DescribeContactFlowModuleResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves detailed information about a specific alias, including which version it currently points to and its
 * metadata.
 */
export const describeContactFlowModuleAlias =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeContactFlowModuleAliasRequest,
    output: DescribeContactFlowModuleAliasResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Returns all properties for a data table except for attributes and values. All properties from CreateDataTable
 * are returned as well as properties for region replication, versioning, and system tables. "Describe" is a deprecated
 * term but is allowed to maintain consistency with existing operations.
 */
export const describeDataTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDataTableRequest,
  output: DescribeDataTableResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns detailed information for a specific data table attribute including its configuration, validation rules,
 * and metadata. "Describe" is a deprecated term but is allowed to maintain consistency with existing operations.
 */
export const describeDataTableAttribute = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDataTableAttributeRequest,
    output: DescribeDataTableAttributeResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes the hours of operation.
 */
export const describeHoursOfOperation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeHoursOfOperationRequest,
    output: DescribeHoursOfOperationResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes the hours of operation override.
 */
export const describeHoursOfOperationOverride =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeHoursOfOperationOverrideRequest,
    output: DescribeHoursOfOperationOverrideResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Describes the specified instance attribute.
 */
export const describeInstanceAttribute = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeInstanceAttributeRequest,
    output: DescribeInstanceAttributeResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes the prompt.
 */
export const describePrompt = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePromptRequest,
  output: DescribePromptResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes the specified queue.
 */
export const describeQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeQueueRequest,
  output: DescribeQueueResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes the quick connect.
 */
export const describeQuickConnect = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeQuickConnectRequest,
    output: DescribeQuickConnectResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes the specified routing profile.
 *
 * `DescribeRoutingProfile` does not populate AssociatedQueueIds in its response. The example Response
 * Syntax shown on this page is incorrect; we are working to update it. SearchRoutingProfiles does include
 * AssociatedQueueIds.
 */
export const describeRoutingProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeRoutingProfileRequest,
    output: DescribeRoutingProfileResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes a rule for the specified Amazon Connect instance.
 */
export const describeRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRuleRequest,
  output: DescribeRuleResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets basic information about the security profile.
 *
 * For information about security profiles, see Security Profiles in the *Amazon Connect Administrator Guide*. For a mapping of the API name and user interface name of the security
 * profile permissions, see List
 * of security profile permissions.
 */
export const describeSecurityProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSecurityProfileRequest,
    output: DescribeSecurityProfileResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Gets details and status of a traffic distribution group.
 */
export const describeTrafficDistributionGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeTrafficDistributionGroupRequest,
    output: DescribeTrafficDistributionGroupResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Describes the specified user. You can find the instance ID in the Amazon Connect
 * console (it’s the final part of the ARN). The console does not display the user IDs. Instead, list the users
 * and note the IDs provided in the output.
 */
export const describeUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUserRequest,
  output: DescribeUserResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes the specified vocabulary.
 */
export const describeVocabulary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeVocabularyRequest,
  output: DescribeVocabularyResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves details about a workspace, including its configuration and metadata.
 */
export const describeWorkspace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeWorkspaceRequest,
  output: DescribeWorkspaceResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Provides a pre-signed URL for download of an approved attached file. This API also returns metadata about the
 * attached file. It will only return a downloadURL if the status of the attached file is `APPROVED`.
 */
export const getAttachedFile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAttachedFileRequest,
  output: GetAttachedFileResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists agent statuses.
 */
export const listAgentStatuses = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListAgentStatusRequest,
    output: ListAgentStatusResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "AgentStatusSummaryList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the data lake datasets available to associate with for a given Amazon Connect instance.
 */
export const listAnalyticsDataLakeDataSets =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAnalyticsDataLakeDataSetsRequest,
    output: ListAnalyticsDataLakeDataSetsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Provides information about contact tree, a list of associated contacts with a unique identifier.
 */
export const listAssociatedContacts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAssociatedContactsRequest,
    output: ListAssociatedContactsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * This API is in preview release for Amazon Connect and is subject to change. To
 * request access to this API, contact Amazon Web Services Support.
 *
 * Provides summary information about the authentication profiles in a specified Amazon Connect
 * instance.
 */
export const listAuthenticationProfiles =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAuthenticationProfilesRequest,
    output: ListAuthenticationProfilesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "AuthenticationProfileSummaryList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * For the specified version of Amazon Lex, returns a paginated list of all the Amazon Lex bots
 * currently associated with the instance. Use this API to return both Amazon Lex V1 and V2
 * bots.
 */
export const listBots = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBotsRequest,
  output: ListBotsResponse,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "LexBots",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all aliases associated with a contact flow module, showing their current version mappings and
 * metadata.
 */
export const listContactFlowModuleAliases =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListContactFlowModuleAliasesRequest,
    output: ListContactFlowModuleAliasesResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ContactFlowModuleAliasSummaryList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Provides information about the flow modules for the specified Amazon Connect instance.
 */
export const listContactFlowModules =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListContactFlowModulesRequest,
    output: ListContactFlowModulesResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ContactFlowModulesSummaryList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves a paginated list of all versions for a specific contact flow module.
 */
export const listContactFlowModuleVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListContactFlowModuleVersionsRequest,
    output: ListContactFlowModuleVersionsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ContactFlowModuleVersionSummaryList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Provides information about the flows for the specified Amazon Connect instance.
 *
 * You can also create and update flows using the Amazon Connect
 * Flow language.
 *
 * For more information about flows, see Flows in the Amazon Connect
 * Administrator Guide.
 */
export const listContactFlows = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListContactFlowsRequest,
    output: ListContactFlowsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ContactFlowSummaryList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns all the available versions for the specified Amazon Connect instance and flow identifier.
 */
export const listContactFlowVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListContactFlowVersionsRequest,
    output: ListContactFlowVersionsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ContactFlowVersionSummaryList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists all data tables for the specified Amazon Connect instance. Returns summary information for each table
 * including basic metadata and modification details.
 */
export const listDataTables = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDataTablesRequest,
    output: ListDataTablesResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "DataTableSummaryList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the default vocabularies for the specified Amazon Connect instance.
 */
export const listDefaultVocabularies =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDefaultVocabulariesRequest,
    output: ListDefaultVocabulariesResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidRequestException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "DefaultVocabularyList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Provides information about the hours of operation for the specified Amazon Connect instance.
 *
 * For more information about hours of operation, see Set the Hours of Operation for a Queue in the
 * *Amazon Connect Administrator Guide*.
 */
export const listHoursOfOperations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListHoursOfOperationsRequest,
    output: ListHoursOfOperationsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "HoursOfOperationSummaryList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Return a list of instances which are in active state, creation-in-progress state, and failed state. Instances
 * that aren't successfully created (they are in a failed state) are returned only for 24 hours after the CreateInstance
 * API was invoked.
 */
export const listInstances = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListInstancesRequest,
    output: ListInstancesResponse,
    errors: [InternalServiceException, InvalidRequestException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "InstanceSummaryList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Provides summary information about the Amazon Web Services resource associations for the specified Amazon Connect instance.
 */
export const listIntegrationAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListIntegrationAssociationsRequest,
    output: ListIntegrationAssociationsResponse,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "IntegrationAssociationSummaryList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Provides information about the phone numbers for the specified Amazon Connect instance.
 *
 * For more information about phone numbers, see Set Up Phone Numbers for Your Contact
 * Center in the *Amazon Connect Administrator Guide*.
 *
 * - We recommend using ListPhoneNumbersV2 to return phone number types. ListPhoneNumbers doesn't support number types
 * `UIFN`, `SHARED`, `THIRD_PARTY_TF`, and `THIRD_PARTY_DID`. While it
 * returns numbers of those types, it incorrectly lists them as `TOLL_FREE` or `DID`.
 *
 * - The phone number `Arn` value that is returned from each of the items in the PhoneNumberSummaryList cannot be used to tag phone number resources. It will fail with a
 * `ResourceNotFoundException`. Instead, use the ListPhoneNumbersV2 API. It returns the new
 * phone number ARN that can be used to tag phone number resources.
 */
export const listPhoneNumbers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPhoneNumbersRequest,
    output: ListPhoneNumbersResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "PhoneNumberSummaryList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists predefined attributes for the specified Amazon Connect instance. A *predefined attribute* is
 * made up of a name and a value. You can use predefined attributes for:
 *
 * - Routing proficiency (for example, agent certification) that has predefined values (for example, a list of
 * possible certifications). For more information, see Create predefined attributes for routing contacts to
 * agents.
 *
 * - Contact information that varies between transfers or conferences, such as the name of the business unit
 * handling the contact. For more information, see Use contact segment attributes.
 *
 * For the predefined attributes per instance quota, see Amazon Connect
 * quotas.
 *
 * **Endpoints**: See Amazon Connect endpoints and quotas.
 */
export const listPredefinedAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPredefinedAttributesRequest,
    output: ListPredefinedAttributesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "PredefinedAttributeSummaryList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Provides information about the prompts for the specified Amazon Connect instance.
 */
export const listPrompts = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPromptsRequest,
    output: ListPromptsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "PromptSummaryList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the quick connects associated with a queue.
 */
export const listQueueQuickConnects =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListQueueQuickConnectsRequest,
    output: ListQueueQuickConnectsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "QuickConnectSummaryList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Provides information about the queues for the specified Amazon Connect instance.
 *
 * If you do not specify a `QueueTypes` parameter, both standard and
 * agent queues are returned. This might cause an unexpected truncation of results if you have more than 1000 agents and
 * you limit the number of results of the API call in code.
 *
 * For more information about queues, see Queues: Standard and Agent in the
 * *Amazon Connect Administrator Guide*.
 */
export const listQueues = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListQueuesRequest,
  output: ListQueuesResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "QueueSummaryList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the manual assignment queues associated with a routing profile.
 *
 * **Use cases**
 *
 * Following are common uses cases for this API:
 *
 * - This API returns list of queues where contacts can be manually assigned or picked by an agent who has access
 * to the Worklist app. The user can additionally filter on queues, if they have access to those queues (otherwise a
 * invalid request exception will be thrown).
 *
 * For information about how manual contact assignment works in the agent workspace, see the Access the Worklist app in the Amazon Connect agent workspace in the *Amazon Connect Administrator Guide*.
 *
 * **Important things to know**
 *
 * - This API only returns the manual assignment queues associated with a routing profile. Use the
 * ListRoutingProfileQueues API to list the auto assignment queues for the routing profile.
 *
 * **Endpoints**: See Amazon Connect endpoints and quotas.
 */
export const listRoutingProfileManualAssignmentQueues =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRoutingProfileManualAssignmentQueuesRequest,
    output: ListRoutingProfileManualAssignmentQueuesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "RoutingProfileManualAssignmentQueueConfigSummaryList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the queues associated with a routing profile.
 */
export const listRoutingProfileQueues =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRoutingProfileQueuesRequest,
    output: ListRoutingProfileQueuesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "RoutingProfileQueueConfigSummaryList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Provides summary information about the routing profiles for the specified Amazon Connect instance.
 *
 * For more information about routing profiles, see Routing Profiles and Create a Routing Profile in the *Amazon Connect Administrator Guide*.
 */
export const listRoutingProfiles =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRoutingProfilesRequest,
    output: ListRoutingProfilesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "RoutingProfileSummaryList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Returns a paginated list of all security keys associated with the instance.
 */
export const listSecurityKeys = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSecurityKeysRequest,
    output: ListSecurityKeysResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "SecurityKeys",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Provides summary information about the security profiles for the specified Amazon Connect instance.
 *
 * For more information about security profiles, see Security Profiles in the *Amazon Connect Administrator Guide*. For a mapping of the API name and user interface name of the security
 * profile permissions, see List
 * of security profile permissions.
 */
export const listSecurityProfiles =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSecurityProfilesRequest,
    output: ListSecurityProfilesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "SecurityProfileSummaryList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists task templates for the specified Amazon Connect instance.
 */
export const listTaskTemplates = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListTaskTemplatesRequest,
    output: ListTaskTemplatesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "TaskTemplates",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists traffic distribution groups.
 */
export const listTrafficDistributionGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTrafficDistributionGroupsRequest,
    output: ListTrafficDistributionGroupsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidRequestException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "TrafficDistributionGroupSummaryList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists traffic distribution group users.
 */
export const listTrafficDistributionGroupUsers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTrafficDistributionGroupUsersRequest,
    output: ListTrafficDistributionGroupUsersResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "TrafficDistributionGroupUserSummaryList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the use cases for the integration association.
 */
export const listUseCases = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListUseCasesRequest,
    output: ListUseCasesResponse,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "UseCaseSummaryList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Provides summary information about the hierarchy groups for the specified Amazon Connect instance.
 *
 * For more information about agent hierarchies, see Set Up Agent Hierarchies in the *Amazon Connect Administrator Guide*.
 */
export const listUserHierarchyGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListUserHierarchyGroupsRequest,
    output: ListUserHierarchyGroupsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "UserHierarchyGroupSummaryList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Provides summary information about the users for the specified Amazon Connect instance.
 */
export const listUsers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUsersRequest,
  output: ListUsersResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "UserSummaryList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists media assets (such as logos) associated with a workspace.
 */
export const listWorkspaceMedia = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListWorkspaceMediaRequest,
  output: ListWorkspaceMediaResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists the page configurations in a workspace, including the views assigned to each page.
 */
export const listWorkspacePages = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListWorkspacePagesRequest,
    output: ListWorkspacePagesResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "WorkspacePageList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the workspaces in an Amazon Connect instance.
 */
export const listWorkspaces = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListWorkspacesRequest,
    output: ListWorkspacesResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "WorkspaceSummaryList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Searches for data tables based on the table's ID, name, and description. In the future, this operation can
 * support searching on attribute names and possibly primary values. Follows other search operations closely and
 * supports both search criteria and filters.
 */
export const searchDataTables = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: SearchDataTablesRequest,
    output: SearchDataTablesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "DataTables",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Searches the hours of operation in an Amazon Connect instance, with optional filtering.
 */
export const searchHoursOfOperations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: SearchHoursOfOperationsRequest,
    output: SearchHoursOfOperationsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "HoursOfOperations",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Searches predefined attributes that meet certain criteria. A *predefined attribute* is made
 * up of a name and a value. You can use predefined attributes for:
 *
 * - Routing proficiency (for example, agent certification) that has predefined values (for example, a list of
 * possible certifications). For more information, see Create predefined attributes for routing contacts to
 * agents.
 *
 * - Contact information that varies between transfers or conferences, such as the name of the business unit
 * handling the contact. For more information, see Use contact segment attributes.
 *
 * For the predefined attributes per instance quota, see Amazon Connect
 * quotas.
 *
 * **Endpoints**: See Amazon Connect endpoints and quotas.
 */
export const searchPredefinedAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: SearchPredefinedAttributesRequest,
    output: SearchPredefinedAttributesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "PredefinedAttributes",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Searches prompts in an Amazon Connect instance, with optional filtering.
 */
export const searchPrompts = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: SearchPromptsRequest,
    output: SearchPromptsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Prompts",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Searches queues in an Amazon Connect instance, with optional filtering.
 */
export const searchQueues = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: SearchQueuesRequest,
    output: SearchQueuesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Queues",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Searches quick connects in an Amazon Connect instance, with optional filtering.
 */
export const searchQuickConnects =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: SearchQuickConnectsRequest,
    output: SearchQuickConnectsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "QuickConnects",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Searches routing profiles in an Amazon Connect instance, with optional filtering.
 *
 * `SearchRoutingProfiles` does not populate LastModifiedRegion, LastModifiedTime,
 * MediaConcurrencies.CrossChannelBehavior, and AgentAvailabilityTimer in its response, but DescribeRoutingProfile does.
 */
export const searchRoutingProfiles =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: SearchRoutingProfilesRequest,
    output: SearchRoutingProfilesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "RoutingProfiles",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Searches UserHierarchyGroups in an Amazon Connect instance, with optional filtering.
 *
 * The UserHierarchyGroup with `"LevelId": "0"` is the foundation for building levels on top of an
 * instance. It is not user-definable, nor is it visible in the UI.
 */
export const searchUserHierarchyGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: SearchUserHierarchyGroupsRequest,
    output: SearchUserHierarchyGroupsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "UserHierarchyGroups",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Searches views based on name, description, or tags.
 */
export const searchViews = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: SearchViewsRequest,
    output: SearchViewsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Views",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Searches for vocabularies within a specific Amazon Connect instance using `State`,
 * `NameStartsWith`, and `LanguageCode`.
 */
export const searchVocabularies = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: SearchVocabulariesRequest,
    output: SearchVocabulariesResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidRequestException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "VocabularySummaryList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Processes chat integration events from Amazon Web Services or external integrations to Amazon Connect. A chat
 * integration event includes:
 *
 * - SourceId, DestinationId, and Subtype: a set of identifiers, uniquely representing a chat
 *
 * - ChatEvent: details of the chat action to perform such as sending a message, event, or disconnecting from a
 * chat
 *
 * When a chat integration event is sent with chat identifiers that do not map to an active chat contact, a new
 * chat contact is also created before handling chat action.
 *
 * Access to this API is currently restricted to Amazon Web Services End User Messaging for supporting SMS
 * integration.
 */
export const sendChatIntegrationEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SendChatIntegrationEventRequest,
    output: SendChatIntegrationEventResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Starts recording the contact:
 *
 * - If the API is called *before* the agent joins the call, recording starts when the agent
 * joins the call.
 *
 * - If the API is called *after* the agent joins the call, recording starts at the time of the
 * API call.
 *
 * StartContactRecording is a one-time action. For example, if you use StopContactRecording to stop recording an
 * ongoing call, you can't use StartContactRecording to restart it. For scenarios where the recording has started and
 * you want to suspend and resume it, such as when collecting sensitive information (for example, a credit card number),
 * use SuspendContactRecording and ResumeContactRecording.
 *
 * You can use this API to override the recording behavior configured in the Set recording behavior block.
 *
 * Only voice recordings are supported at this time.
 */
export const startContactRecording = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartContactRecordingRequest,
    output: StartContactRecordingResponse,
    errors: [
      InternalServiceException,
      InvalidActiveRegionException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Ends the specified contact. Use this API to stop queued callbacks. It does not work for voice contacts that use
 * the following initiation methods:
 *
 * - DISCONNECT
 *
 * - TRANSFER
 *
 * - QUEUE_TRANSFER
 *
 * - EXTERNAL_OUTBOUND
 *
 * - MONITOR
 *
 * Chat and task contacts can be terminated in any state, regardless of initiation method.
 */
export const stopContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopContactRequest,
  output: StopContactResponse,
  errors: [
    ContactNotFoundException,
    InternalServiceException,
    InvalidActiveRegionException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the primary values for a record. This operation affects all existing values that are currently
 * associated to the record and its primary values. Users that have restrictions on attributes and/or primary values are
 * not authorized to use this endpoint. The combination of new primary values must be unique within the table.
 */
export const updateDataTablePrimaryValues =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateDataTablePrimaryValuesRequest,
    output: UpdateDataTablePrimaryValuesResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Updates the traffic distribution for a given traffic distribution group.
 *
 * When you shift telephony traffic, also shift agents and/or agent sign-ins to ensure they can handle the calls
 * in the other Region. If you don't shift the agents, voice calls will go to the shifted Region but there won't be any
 * agents available to receive the calls.
 *
 * The `SignInConfig` distribution is available only on a
 * default `TrafficDistributionGroup` (see the `IsDefault` parameter in the
 * TrafficDistributionGroup
 * data type). If you call
 * `UpdateTrafficDistribution` with a modified `SignInConfig` and a non-default `TrafficDistributionGroup`,
 * an `InvalidRequestException` is returned.
 *
 * For more information about updating a traffic distribution group, see Update telephony traffic distribution
 * across Amazon Web Services Regions
 * in the *Amazon Connect Administrator Guide*.
 */
export const updateTrafficDistribution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateTrafficDistributionRequest,
    output: UpdateTrafficDistributionResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidRequestException,
      ResourceConflictException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Associates a queued contact with an agent.
 *
 * **Use cases**
 *
 * Following are common uses cases for this API:
 *
 * - Programmatically assign queued contacts to available users.
 *
 * - Leverage the IAM context key `connect:PreferredUserArn` to restrict contact association to specific
 * preferred user.
 *
 * **Important things to know**
 *
 * - Use this API with chat, email, and task contacts. It does not support voice contacts.
 *
 * - Use it to associate contacts with users regardless of their current state, including custom states. Ensure
 * your application logic accounts for user availability before making associations.
 *
 * - It honors the IAM context key `connect:PreferredUserArn` to prevent unauthorized contact
 * associations.
 *
 * - It respects the IAM context key `connect:PreferredUserArn` to enforce authorization controls and
 * prevent unauthorized contact associations. Verify that your IAM policies are properly configured to support your
 * intended use cases.
 *
 * - The service quota *Queues per routing profile per instance* applies to manually assigned
 * queues, too. For more information about this quota, see Amazon Connect
 * quotas in the *Amazon Connect Administrator Guide*.
 *
 * **Endpoints**: See Amazon Connect endpoints and quotas.
 */
export const associateContactWithUser = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateContactWithUserRequest,
    output: AssociateContactWithUserResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Associates a set of queues with a routing profile.
 */
export const associateRoutingProfileQueues =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateRoutingProfileQueuesRequest,
    output: AssociateRoutingProfileQueuesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Associates a set of proficiencies with a user.
 */
export const associateUserProficiencies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateUserProficienciesRequest,
    output: AssociateUserProficienciesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Removes a list of analytics datasets associated with a given Amazon Connect instance. You can disassociate
 * multiple datasets in a single call.
 */
export const batchDisassociateAnalyticsDataSet =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchDisassociateAnalyticsDataSetRequest,
    output: BatchDisassociateAnalyticsDataSetResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Enables rehydration of chats for the lifespan of a contact. For more information about chat rehydration, see
 * Enable persistent chat in
 * the *Amazon Connect Administrator Guide*.
 */
export const createPersistentContactAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreatePersistentContactAssociationRequest,
    output: CreatePersistentContactAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Describe email address form the specified Amazon Connect instance.
 */
export const describeEmailAddress = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEmailAddressRequest,
    output: DescribeEmailAddressResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Retrieves the current storage configurations for the specified resource type, association ID, and instance
 * ID.
 */
export const describeInstanceStorageConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeInstanceStorageConfigRequest,
    output: DescribeInstanceStorageConfigResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Disassociates a set of queues from a routing profile.
 *
 * Up to 10 queue references can be disassociated in a single API call. More than 10 queue references results in a
 * single call results in an InvalidParameterException.
 */
export const disassociateRoutingProfileQueues =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateRoutingProfileQueuesRequest,
    output: DisassociateRoutingProfileQueuesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Disassociates a set of proficiencies from a user.
 */
export const disassociateUserProficiencies =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateUserProficienciesRequest,
    output: DisassociateUserProficienciesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Removes the association between a workspace and one or more users or routing profiles.
 */
export const disassociateWorkspace = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateWorkspaceRequest,
    output: DisassociateWorkspaceResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves the flow associated for a given resource.
 */
export const getFlowAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFlowAssociationRequest,
  output: GetFlowAssociationResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets the prompt file.
 */
export const getPromptFile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPromptFileRequest,
  output: GetPromptFileResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets details about a specific task template in the specified Amazon Connect instance.
 */
export const getTaskTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTaskTemplateRequest,
  output: GetTaskTemplateResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists the association status of requested dataset ID for a given Amazon Connect instance.
 */
export const listAnalyticsDataAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAnalyticsDataAssociationsRequest,
    output: ListAnalyticsDataAssociationsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Returns a paginated list of all approved origins associated with the instance.
 */
export const listApprovedOrigins =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListApprovedOriginsRequest,
    output: ListApprovedOriginsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Origins",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns all attributes for a specified data table. A maximum of 100 attributes per data table is allowed.
 * Customers can request an increase by using Amazon Web Services Service Quotas. The response can be filtered by specific attribute IDs
 * for CloudFormation integration.
 */
export const listDataTableAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDataTableAttributesRequest,
    output: ListDataTableAttributesResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Attributes",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists all security profiles attached to a Q in Connect AIAgent Entity in an Amazon Connect instance.
 */
export const listEntitySecurityProfiles =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEntitySecurityProfilesRequest,
    output: ListEntitySecurityProfilesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "SecurityProfiles",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * List the flow association based on the filters.
 */
export const listFlowAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListFlowAssociationsRequest,
    output: ListFlowAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "FlowAssociationSummaryList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * List the hours of operation overrides.
 */
export const listHoursOfOperationOverrides =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListHoursOfOperationOverridesRequest,
    output: ListHoursOfOperationOverridesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "HoursOfOperationOverrideList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Returns a paginated list of all attribute types for the given instance.
 */
export const listInstanceAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListInstanceAttributesRequest,
    output: ListInstanceAttributesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Attributes",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Returns a paginated list of storage configs for the identified instance and resource type.
 */
export const listInstanceStorageConfigs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListInstanceStorageConfigsRequest,
    output: ListInstanceStorageConfigsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "StorageConfigs",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Returns a paginated list of all Lambda functions that display in the dropdown options in the relevant flow
 * blocks.
 */
export const listLambdaFunctions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListLambdaFunctionsRequest,
    output: ListLambdaFunctionsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "LambdaFunctions",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Returns a paginated list of all the Amazon Lex V1 bots currently associated with the instance. To return
 * both Amazon Lex V1 and V2 bots, use the ListBots API.
 */
export const listLexBots = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListLexBotsRequest,
    output: ListLexBotsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "LexBots",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Provides information about the quick connects for the specified Amazon Connect instance.
 */
export const listQuickConnects = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListQuickConnectsRequest,
    output: ListQuickConnectsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "QuickConnectSummaryList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns a list of third-party applications or MCP Servers in a specific security profile.
 */
export const listSecurityProfileApplications =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSecurityProfileApplicationsRequest,
    output: ListSecurityProfileApplicationsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Applications",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * A list of Flow Modules an AI Agent can invoke as a tool
 */
export const listSecurityProfileFlowModules =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSecurityProfileFlowModulesRequest,
    output: ListSecurityProfileFlowModulesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "AllowedFlowModules",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the permissions granted to a security profile.
 *
 * For information about security profiles, see Security Profiles in the *Amazon Connect Administrator Guide*. For a mapping of the API name and user interface name of the security
 * profile permissions, see List
 * of security profile permissions.
 */
export const listSecurityProfilePermissions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSecurityProfilePermissionsRequest,
    output: ListSecurityProfilePermissionsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Permissions",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the tags for the specified resource.
 *
 * For sample policies that use tags, see Amazon Connect Identity-Based Policy
 * Examples in the *Amazon Connect Administrator Guide*.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists proficiencies associated with a user.
 */
export const listUserProficiencies =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListUserProficienciesRequest,
    output: ListUserProficienciesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "UserProficiencyList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Update the hours of operation override.
 */
export const updateHoursOfOperationOverride =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateHoursOfOperationOverrideRequest,
    output: UpdateHoursOfOperationOverrideResponse,
    errors: [
      ConditionalOperationFailedException,
      DuplicateResourceException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Updates a prompt.
 */
export const updatePrompt = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePromptRequest,
  output: UpdatePromptResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes an hours of operation.
 */
export const deleteHoursOfOperation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteHoursOfOperationRequest,
    output: DeleteHoursOfOperationResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes an hours of operation override in an Amazon Connect hours of operation resource.
 */
export const deleteHoursOfOperationOverride =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteHoursOfOperationOverrideRequest,
    output: DeleteHoursOfOperationOverrideResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes a prompt.
 */
export const deletePrompt = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePromptRequest,
  output: DeletePromptResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a quick connect.
 *
 * After calling DeleteUser, it's important to call `DeleteQuickConnect` to delete any records related to the
 * deleted users. This will help you:
 *
 * - Avoid dangling resources that impact your service quotas.
 *
 * - Remove deleted users so they don't appear to agents as transfer options.
 *
 * - Avoid the disruption of other Amazon Connect processes, such as instance replication and syncing if
 * you're using Amazon Connect Global Resiliency.
 */
export const deleteQuickConnect = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteQuickConnectRequest,
  output: DeleteQuickConnectResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the task template.
 */
export const deleteTaskTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTaskTemplateRequest,
  output: DeleteTaskTemplateResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a user account from the specified Amazon Connect instance.
 *
 * For information about what happens to a user's data when their account is deleted, see Delete Users from Your Amazon Connect
 * Instance in the *Amazon Connect Administrator Guide*.
 *
 * After calling DeleteUser, call DeleteQuickConnect to delete any records
 * related to the deleted users. This will help you:
 *
 * - Avoid dangling resources that impact your service quotas.
 *
 * - Remove deleted users so they don't appear to agents as transfer options.
 *
 * - Avoid the disruption of other Amazon Connect processes, such as instance replication and syncing if
 * you're using Amazon Connect Global Resiliency.
 */
export const deleteUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserRequest,
  output: DeleteUserResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a media asset (such as a logo) from a workspace.
 */
export const deleteWorkspaceMedia = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteWorkspaceMediaRequest,
    output: DeleteWorkspaceMediaResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Removes the dataset ID associated with a given Amazon Connect instance.
 */
export const disassociateAnalyticsDataSet =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateAnalyticsDataSetRequest,
    output: DisassociateAnalyticsDataSetResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Revokes access to integrated applications from Amazon Connect.
 */
export const disassociateApprovedOrigin = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateApprovedOriginRequest,
    output: DisassociateApprovedOriginResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Removes the storage type configurations for the specified resource type and association ID.
 */
export const disassociateInstanceStorageConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateInstanceStorageConfigRequest,
    output: DisassociateInstanceStorageConfigResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Remove the Lambda function from the dropdown options available in the relevant flow blocks.
 */
export const disassociateLambdaFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateLambdaFunctionRequest,
    output: DisassociateLambdaFunctionResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Revokes authorization from the specified instance to access the specified Amazon Lex bot.
 */
export const disassociateLexBot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateLexBotRequest,
  output: DisassociateLexBotResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Disassociates a set of quick connects from a queue.
 */
export const disassociateQueueQuickConnects =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateQueueQuickConnectsRequest,
    output: DisassociateQueueQuickConnectsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Deletes the specified security key.
 */
export const disassociateSecurityKey = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateSecurityKeyRequest,
    output: DisassociateSecurityKeyResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Imports a media asset (such as a logo) for use in a workspace.
 */
export const importWorkspaceMedia = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ImportWorkspaceMediaRequest,
    output: ImportWorkspaceMediaResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Ends message streaming on a specified contact. To restart message streaming on that contact, call the StartContactStreaming
 * API.
 */
export const stopContactStreaming = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopContactStreamingRequest,
    output: StopContactStreamingResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Adds the specified tags to the specified resource.
 *
 * Some of the supported resource types are agents, routing profiles, queues, quick connects, flows, agent
 * statuses, hours of operation, phone numbers, security profiles, and task templates. For a complete list, see Tagging resources in Amazon Connect.
 *
 * For sample policies that use tags, see Amazon Connect Identity-Based Policy
 * Examples in the *Amazon Connect Administrator Guide*.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes the specified tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * This API is in preview release for Amazon Connect and is subject to change. To
 * request access to this API, contact Amazon Web Services Support.
 *
 * Updates the selected authentication profile.
 */
export const updateAuthenticationProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAuthenticationProfileRequest,
    output: UpdateAuthenticationProfileResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Updates the value for the specified attribute type.
 */
export const updateInstanceAttribute = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateInstanceAttributeRequest,
    output: UpdateInstanceAttributeResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Updates an existing configuration for a resource type. This API is idempotent.
 */
export const updateInstanceStorageConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateInstanceStorageConfigRequest,
    output: UpdateInstanceStorageConfigResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates a predefined attribute for the specified Amazon Connect instance. A *predefined attribute* is
 * made up of a name and a value.
 *
 * For the predefined attributes per instance quota, see Amazon Connect
 * quotas.
 *
 * **Use cases**
 *
 * Following are common uses cases for this API:
 *
 * - Update routing proficiency (for example, agent certification) that has predefined values (for example, a list
 * of possible certifications). For more information, see Create predefined attributes for routing contacts to
 * agents.
 *
 * - Update an attribute for business unit name that has a list of predefined business unit names used in your
 * organization. This is a use case where information for a contact varies between transfers or conferences. For more
 * information, see Use contact segment attributes.
 *
 * **Endpoints**: See Amazon Connect endpoints and quotas.
 */
export const updatePredefinedAttribute = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdatePredefinedAttributeRequest,
    output: UpdatePredefinedAttributeResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the hours of operation for the specified queue.
 */
export const updateQueueHoursOfOperation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateQueueHoursOfOperationRequest,
    output: UpdateQueueHoursOfOperationResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the maximum number of contacts allowed in a queue before it is considered full.
 */
export const updateQueueMaxContacts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateQueueMaxContactsRequest,
    output: UpdateQueueMaxContactsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the outbound caller ID name, number, and outbound whisper flow for a specified queue.
 *
 * - If the phone number is claimed to a traffic distribution group that was created in the
 * same Region as the Amazon Connect instance where you are calling this API, then you can use a
 * full phone number ARN or a UUID for `OutboundCallerIdNumberId`. However, if the phone number is claimed
 * to a traffic distribution group that is in one Region, and you are calling this API from an instance in another Amazon Web Services Region that is associated with the traffic distribution group, you must provide a full phone number ARN. If a
 * UUID is provided in this scenario, you will receive a
 * `ResourceNotFoundException`.
 *
 * - Only use the phone number ARN format that doesn't contain `instance` in the path, for example,
 * `arn:aws:connect:us-east-1:1234567890:phone-number/uuid`. This is the same ARN format that is returned
 * when you call the ListPhoneNumbersV2 API.
 *
 * - If you plan to use IAM policies to allow/deny access to this API for phone number resources
 * claimed to a traffic distribution group, see Allow or Deny queue API actions for phone numbers in a replica Region.
 */
export const updateQueueOutboundCallerConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateQueueOutboundCallerConfigRequest,
    output: UpdateQueueOutboundCallerConfigResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Updates the status of the queue.
 */
export const updateQueueStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateQueueStatusRequest,
  output: UpdateQueueStatusResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the configuration settings for the specified quick connect.
 */
export const updateQuickConnectConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateQuickConnectConfigRequest,
    output: UpdateQuickConnectConfigResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the name and description of a quick connect. The request accepts the following data in JSON format. At least `Name` or `Description` must be provided.
 */
export const updateQuickConnectName = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateQuickConnectNameRequest,
    output: UpdateQuickConnectNameResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Whether agents with this routing profile will have their routing order calculated based on time since
 * their last inbound contact or *longest idle time*.
 */
export const updateRoutingProfileAgentAvailabilityTimer =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateRoutingProfileAgentAvailabilityTimerRequest,
    output: UpdateRoutingProfileAgentAvailabilityTimerResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Updates the channels that agents can handle in the Contact Control Panel (CCP) for a routing profile.
 */
export const updateRoutingProfileConcurrency =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateRoutingProfileConcurrencyRequest,
    output: UpdateRoutingProfileConcurrencyResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Updates the default outbound queue of a routing profile.
 */
export const updateRoutingProfileDefaultOutboundQueue =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateRoutingProfileDefaultOutboundQueueRequest,
    output: UpdateRoutingProfileDefaultOutboundQueueResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Updates the properties associated with a set of queues for a routing profile.
 */
export const updateRoutingProfileQueues = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateRoutingProfileQueuesRequest,
    output: UpdateRoutingProfileQueuesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates a security profile.
 *
 * For information about security profiles, see Security Profiles in the *Amazon Connect Administrator Guide*. For a mapping of the API name and user interface name of the security
 * profile permissions, see List
 * of security profile permissions.
 */
export const updateSecurityProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSecurityProfileRequest,
    output: UpdateSecurityProfileResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Assigns the specified hierarchy group to the specified user.
 */
export const updateUserHierarchy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserHierarchyRequest,
  output: UpdateUserHierarchyResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the identity information for the specified user.
 *
 * We strongly recommend limiting who has the ability to invoke `UpdateUserIdentityInfo`. Someone with
 * that ability can change the login credentials of other users by changing their email address. This poses a security
 * risk to your organization. They can change the email address of a user to the attacker's email address, and then
 * reset the password through email. For more information, see Best Practices for Security Profiles
 * in the *Amazon Connect Administrator Guide*.
 */
export const updateUserIdentityInfo = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateUserIdentityInfoRequest,
    output: UpdateUserIdentityInfoResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the phone configuration settings for the specified user.
 */
export const updateUserPhoneConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateUserPhoneConfigRequest,
    output: UpdateUserPhoneConfigResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the properties associated with the proficiencies of a user.
 */
export const updateUserProficiencies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateUserProficienciesRequest,
    output: UpdateUserProficienciesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Assigns the specified routing profile to the specified user.
 */
export const updateUserRoutingProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateUserRoutingProfileRequest,
    output: UpdateUserRoutingProfileResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Assigns the specified security profiles to the specified user.
 */
export const updateUserSecurityProfiles = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateUserSecurityProfilesRequest,
    output: UpdateUserSecurityProfilesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Associates the specified dataset for a Amazon Connect instance with the target account. You can associate
 * only one dataset in a single call.
 */
export const associateAnalyticsDataSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateAnalyticsDataSetRequest,
    output: AssociateAnalyticsDataSetResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Associates a connect resource to a flow.
 */
export const associateFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateFlowRequest,
  output: AssociateFlowResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a flow for the specified Amazon Connect instance.
 */
export const deleteContactFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteContactFlowRequest,
  output: DeleteContactFlowResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the specified flow module.
 */
export const deleteContactFlowModule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteContactFlowModuleRequest,
    output: DeleteContactFlowModuleResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Removes an alias reference, breaking the named connection to the underlying module version without affecting the
 * version itself.
 */
export const deleteContactFlowModuleAlias =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteContactFlowModuleAliasRequest,
    output: DeleteContactFlowModuleAliasResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Removes a specific version of a contact flow module.
 */
export const deleteContactFlowModuleVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteContactFlowModuleVersionRequest,
    output: DeleteContactFlowModuleVersionResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes the particular version specified in flow version identifier.
 */
export const deleteContactFlowVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteContactFlowVersionRequest,
    output: DeleteContactFlowVersionResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes email address from the specified Amazon Connect instance.
 */
export const deleteEmailAddress = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEmailAddressRequest,
  output: DeleteEmailAddressResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceConflictException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a workspace and removes all associated view and resource assignments.
 */
export const deleteWorkspace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkspaceRequest,
  output: DeleteWorkspaceResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes the association between a view and a page in a workspace. The page will display the default view after
 * deletion.
 */
export const deleteWorkspacePage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkspacePageRequest,
  output: DeleteWorkspacePageResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceConflictException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes the alias association between two email addresses in an Amazon Connect instance. After
 * disassociation, emails sent to the former alias email address are no longer forwarded to the primary email address.
 * Both email addresses continue to exist independently and can receive emails directly.
 *
 * **Use cases**
 *
 * Following are common uses cases for this API:
 *
 * - **Department separation**: Remove alias relationships when splitting a
 * consolidated support queue back into separate department-specific queues.
 *
 * - **Email address retirement**: Cleanly remove forwarding relationships before
 * decommissioning old email addresses.
 *
 * - **Organizational restructuring**: Reconfigure email routing when business
 * processes change and aliases are no longer needed.
 *
 * **Important things to know**
 *
 * - Concurrent operations: This API uses distributed locking, so concurrent operations on the same email addresses
 * may be temporarily blocked.
 *
 * - Emails sent to the former alias address are still delivered directly to that address if it exists.
 *
 * - You do not need to delete the email addresses after disassociation. Both addresses remain active
 * independently.
 *
 * - After a successful disassociation, you can immediately create a new alias relationship with the same
 * addresses.
 *
 * - 200 status means alias was successfully disassociated.
 *
 * `DisassociateEmailAddressAlias` does not return the following information:
 *
 * - Details in the response about the email that was disassociated. The response returns an empty body.
 *
 * - The timestamp of when the disassociation occurred.
 *
 * **Endpoints**: See Amazon Connect endpoints and quotas.
 *
 * **Related operations**
 *
 * - AssociateEmailAddressAlias: Associates an email address alias with an existing email address in an
 * Amazon Connect instance.
 *
 * - DescribeEmailAddress: View current alias configurations for an email address.
 *
 * - SearchEmailAddresses: Find email addresses and their alias relationships across an instance.
 *
 * - CreateEmailAddress: Create new email addresses that can participate in alias relationships.
 *
 * - DeleteEmailAddress: Remove email addresses (automatically removes any alias relationships).
 *
 * - UpdateEmailAddressMetadata: Modify email address properties (does not affect alias relationships).
 */
export const disassociateEmailAddressAlias =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateEmailAddressAliasRequest,
    output: DisassociateEmailAddressAliasResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceConflictException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Disassociates a connect resource from a flow.
 */
export const disassociateFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateFlowRequest,
  output: DisassociateFlowResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Disassociates a security profile attached to a Q in Connect AI Agent Entity in an Amazon Connect instance.
 */
export const disassociateSecurityProfiles =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateSecurityProfilesRequest,
    output: DisassociateSecurityProfilesResponse,
    errors: [
      AccessDeniedException,
      ConditionalOperationFailedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceConflictException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Dismisses contacts from an agent’s CCP and returns the agent to an available state, which allows the agent to
 * receive a new routed contact. Contacts can only be dismissed if they are in a `MISSED`,
 * `ERROR`, `ENDED`, or `REJECTED` state in the Agent Event Stream.
 */
export const dismissUserContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DismissUserContactRequest,
  output: DismissUserContactResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Changes the current status of a user or agent in Amazon Connect. If the agent is currently handling a
 * contact, this sets the agent's next status.
 *
 * For more information, see Agent status and Set your
 * next status in the *Amazon Connect Administrator Guide*.
 */
export const putUserStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutUserStatusRequest,
  output: PutUserStatusResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Starts screen sharing for a contact. For more information about screen sharing, see Set up in-app, web, video calling, and screen sharing
 * capabilities in the *Amazon Connect Administrator Guide*.
 */
export const startScreenSharing = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartScreenSharingRequest,
  output: StartScreenSharingResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates a specific Aliases metadata, including the version it’s tied to, it’s name, and description.
 */
export const updateContactFlowModuleAlias =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateContactFlowModuleAliasRequest,
    output: UpdateContactFlowModuleAliasResponse,
    errors: [
      AccessDeniedException,
      ConditionalOperationFailedException,
      DuplicateResourceException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Updates metadata about specified flow module.
 */
export const updateContactFlowModuleMetadata =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateContactFlowModuleMetadataRequest,
    output: UpdateContactFlowModuleMetadataResponse,
    errors: [
      AccessDeniedException,
      DuplicateResourceException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Updates the outbound email address Id for a specified queue.
 */
export const updateQueueOutboundEmailConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateQueueOutboundEmailConfigRequest,
    output: UpdateQueueOutboundEmailConfigResponse,
    errors: [
      AccessDeniedException,
      ConditionalOperationFailedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Updates the metadata of a workspace, such as its name and description.
 */
export const updateWorkspaceMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateWorkspaceMetadataRequest,
    output: UpdateWorkspaceMetadataResponse,
    errors: [
      AccessDeniedException,
      DuplicateResourceException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the configuration of a page in a workspace, including the associated view and input data.
 */
export const updateWorkspacePage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkspacePageRequest,
  output: UpdateWorkspacePageResponse,
  errors: [
    AccessDeniedException,
    DuplicateResourceException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceConflictException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the theme configuration for a workspace, including colors and styling.
 */
export const updateWorkspaceTheme = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateWorkspaceThemeRequest,
    output: UpdateWorkspaceThemeResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the visibility setting of a workspace, controlling whether it is available to all users, assigned users
 * only, or none.
 */
export const updateWorkspaceVisibility = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateWorkspaceVisibilityRequest,
    output: UpdateWorkspaceVisibilityResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates metadata about specified flow.
 */
export const updateContactFlowMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateContactFlowMetadataRequest,
    output: UpdateContactFlowMetadataResponse,
    errors: [
      DuplicateResourceException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * The name of the flow.
 *
 * You can also create and update flows using the Amazon Connect
 * Flow language.
 */
export const updateContactFlowName = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateContactFlowNameRequest,
    output: UpdateContactFlowNameResponse,
    errors: [
      DuplicateResourceException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the hours of operation.
 */
export const updateHoursOfOperation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateHoursOfOperationRequest,
    output: UpdateHoursOfOperationResponse,
    errors: [
      DuplicateResourceException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the name and description of a queue. At least `Name` or `Description` must be provided.
 */
export const updateQueueName = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateQueueNameRequest,
  output: UpdateQueueNameResponse,
  errors: [
    DuplicateResourceException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the name and description of a routing profile. The request accepts the following data in JSON format. At least `Name` or `Description` must be provided.
 */
export const updateRoutingProfileName = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateRoutingProfileNameRequest,
    output: UpdateRoutingProfileNameResponse,
    errors: [
      DuplicateResourceException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the name of the user hierarchy group.
 */
export const updateUserHierarchyGroupName =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateUserHierarchyGroupNameRequest,
    output: UpdateUserHierarchyGroupNameResponse,
    errors: [
      DuplicateResourceException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Associate security profiles with an Entity in an Amazon Connect instance.
 */
export const associateSecurityProfiles = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateSecurityProfilesRequest,
    output: AssociateSecurityProfilesResponse,
    errors: [
      AccessDeniedException,
      ConditionalOperationFailedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceConflictException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Updates specified flow module for the specified Amazon Connect instance.
 *
 * Use the `$SAVED` alias in the request to describe the `SAVED` content of a Flow. For
 * example, `arn:aws:.../contact-flow/{id}:$SAVED`. After a flow is published, `$SAVED` needs to
 * be supplied to view saved content that has not been published.
 */
export const updateContactFlowModuleContent =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateContactFlowModuleContentRequest,
    output: UpdateContactFlowModuleContentResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidContactFlowModuleException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Updates an email address metadata. For more information about email addresses, see Create email addresses in the Amazon Connect
 * Administrator Guide.
 */
export const updateEmailAddressMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateEmailAddressMetadataRequest,
    output: UpdateEmailAddressMetadataResponse,
    errors: [
      AccessDeniedException,
      IdempotencyException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes an attribute and all its values from a data table.
 */
export const deleteDataTableAttribute = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDataTableAttributeRequest,
    output: DeleteDataTableAttributeResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Adds or updates user-defined contact information associated with the specified contact. At least one field to be
 * updated must be present in the request.
 *
 * You can add or update user-defined contact information for both ongoing and completed contacts.
 */
export const updateContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateContactRequest,
  output: UpdateContactResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceException,
    InvalidActiveRegionException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the metadata properties of a data table. Accepts all fields similar to CreateDataTable, except for
 * fields and tags. There are no other granular update endpoints. It does not act as a patch operation - all properties
 * must be provided or defaults will be used. Fields follow the same requirements as CreateDataTable.
 */
export const updateDataTableMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDataTableMetadataRequest,
    output: UpdateDataTableMetadataResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      DuplicateResourceException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes a data table and all associated attributes, versions, audits, and values. Does not update any references
 * to the data table, even from other data tables. This includes dynamic values and conditional validations. System
 * managed data tables are not deletable by customers. API users may delete the table at any time. When deletion is
 * requested from the admin website, a warning is shown alerting the user of the most recent time the table and its
 * values were accessed.
 */
export const deleteDataTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataTableRequest,
  output: DeleteDataTableResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Allows resuming a task contact in a paused state.
 */
export const resumeContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResumeContactRequest,
  output: ResumeContactResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Instructs Amazon Connect to resume the authentication process. The subsequent actions depend on the request
 * body contents:
 *
 * - **If a code is provided**: Connect retrieves the identity information from Amazon
 * Cognito and imports it into Connect Customer Profiles.
 *
 * - **If an error is provided**: The error branch of the Authenticate Customer block
 * is executed.
 *
 * The API returns a success response to acknowledge the request. However, the interaction and exchange of
 * identity information occur asynchronously after the response is returned.
 */
export const updateParticipantAuthentication =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateParticipantAuthenticationRequest,
    output: UpdateParticipantAuthenticationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }));
/**
 * Updates multiple data table values using all properties from BatchCreateDataTableValue. System managed values
 * are not modifiable by customers. The operation requires proper lock versions to prevent concurrent modification
 * conflicts.
 */
export const batchUpdateDataTableValue = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchUpdateDataTableValueRequest,
    output: BatchUpdateDataTableValueResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Adds the specified tags to the contact resource. For more information about this API is used, see Set up granular billing for a detailed
 * view of your Amazon Connect usage.
 */
export const tagContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagContactRequest,
  output: TagContactResponse,
  errors: [
    InternalServiceException,
    InvalidActiveRegionException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * When a contact is being recorded, and the recording has been suspended using SuspendContactRecording, this API
 * resumes recording whatever recording is selected in the flow configuration: call, screen, or both. If only call
 * recording or only screen recording is enabled, then it would resume.
 *
 * Voice and screen recordings are supported.
 */
export const resumeContactRecording = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ResumeContactRecordingRequest,
    output: ResumeContactRecordingResponse,
    errors: [
      InternalServiceException,
      InvalidActiveRegionException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Stops recording a call when a contact is being recorded. StopContactRecording is a one-time action. If you use
 * StopContactRecording to stop recording an ongoing call, you can't use StartContactRecording to restart it. For
 * scenarios where the recording has started and you want to suspend it for sensitive information (for example, to
 * collect a credit card number), and then restart it, use SuspendContactRecording and ResumeContactRecording.
 *
 * Only voice recordings are supported at this time.
 */
export const stopContactRecording = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopContactRecordingRequest,
    output: StopContactRecordingResponse,
    errors: [
      InternalServiceException,
      InvalidActiveRegionException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * When a contact is being recorded, this API suspends recording whatever is selected in the flow configuration:
 * call (IVR or agent), screen, or both. If only call recording or only screen recording is enabled, then it would be
 * suspended. For example, you might suspend the screen recording while collecting sensitive information, such as a
 * credit card number. Then use ResumeContactRecording to restart
 * recording the screen.
 *
 * The period of time that the recording is suspended is filled with silence in the final recording.
 *
 * Voice (IVR, agent) and screen recordings are supported.
 */
export const suspendContactRecording = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SuspendContactRecordingRequest,
    output: SuspendContactRecordingResponse,
    errors: [
      InternalServiceException,
      InvalidActiveRegionException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Removes the specified tags from the contact resource. For more information about this API is used, see Set up granular billing for a detailed
 * view of your Amazon Connect usage.
 */
export const untagContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagContactRequest,
  output: UntagContactResponse,
  errors: [
    InternalServiceException,
    InvalidActiveRegionException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates or updates user-defined contact
 * attributes associated with the specified contact.
 *
 * You can create or update user-defined attributes for both ongoing and completed contacts. For example, while the
 * call is active, you can update the customer's name or the reason the customer called. You can add notes about steps
 * that the agent took during the call that display to the next agent that takes the call. You can also update
 * attributes for a contact using data from your CRM application and save the data with the contact in Amazon Connect. You could also flag calls for additional analysis, such as legal review or to identify abusive callers.
 *
 * Contact attributes are available in Amazon Connect for 24 months, and are then deleted. For information
 * about contact record retention and the maximum size of the contact record attributes section, see Feature
 * specifications in the *Amazon Connect Administrator Guide*.
 */
export const updateContactAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateContactAttributesRequest,
    output: UpdateContactAttributesResponse,
    errors: [
      InternalServiceException,
      InvalidActiveRegionException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Updates your claimed phone number from its current Amazon Connect instance or traffic distribution group to another Amazon Connect instance or traffic distribution group in the same Amazon Web Services Region.
 *
 * After using this API, you must verify that the phone number is attached to the correct flow in the target
 * instance or traffic distribution group. You need to do this because the API switches only the phone number to a new
 * instance or traffic distribution group. It doesn't migrate the flow configuration of the phone number, too.
 *
 * You can call DescribePhoneNumber API to verify the status of a previous UpdatePhoneNumber operation.
 */
export const updatePhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePhoneNumberRequest,
  output: UpdatePhoneNumberResponse,
  errors: [
    AccessDeniedException,
    IdempotencyException,
    InternalServiceException,
    InvalidParameterException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes an evaluation form in the specified Amazon Connect instance. If the version property is not
 * provided, the latest version of the evaluation form is described.
 */
export const describeEvaluationForm = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEvaluationFormRequest,
    output: DescribeEvaluationFormResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists evaluation forms in the specified Amazon Connect instance.
 */
export const listEvaluationForms =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEvaluationFormsRequest,
    output: ListEvaluationFormsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "EvaluationFormSummaryList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists versions of an evaluation form in the specified Amazon Connect instance.
 */
export const listEvaluationFormVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEvaluationFormVersionsRequest,
    output: ListEvaluationFormVersionsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "EvaluationFormVersionSummaryList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists phone numbers claimed to your Amazon Connect instance or traffic distribution group. If the provided `TargetArn`
 * is a traffic distribution group, you can call this API in both Amazon Web Services Regions associated with traffic distribution group.
 *
 * For more information about phone numbers, see Set Up Phone Numbers for Your Contact
 * Center in the *Amazon Connect Administrator Guide*.
 *
 * - When given an instance ARN, `ListPhoneNumbersV2` returns only the phone numbers claimed to the
 * instance.
 *
 * - When given a traffic distribution group ARN `ListPhoneNumbersV2` returns only the phone numbers claimed to the
 * traffic distribution group.
 */
export const listPhoneNumbersV2 = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPhoneNumbersV2Request,
    output: ListPhoneNumbersV2Response,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ListPhoneNumbersSummaryList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Associates a flow with a phone number claimed to your Amazon Connect instance.
 *
 * If the number is claimed to a traffic distribution group, and you are calling this API using an instance in the Amazon Web Services Region where the traffic distribution group was created, you can use either a full phone number ARN or UUID value for the
 * `PhoneNumberId` URI request parameter. However, if the number is claimed to a traffic distribution group and you are calling
 * this API using an instance in the alternate Amazon Web Services Region associated with the traffic distribution group, you must provide a
 * full phone number ARN. If a UUID is provided
 * in
 * this scenario, you will receive a `ResourceNotFoundException`.
 */
export const associatePhoneNumberContactFlow =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociatePhoneNumberContactFlowRequest,
    output: AssociatePhoneNumberContactFlowResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes registration for a device token and a chat contact.
 */
export const deletePushNotificationRegistration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeletePushNotificationRegistrationRequest,
    output: DeletePushNotificationRegistrationResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Removes the flow association from a phone number claimed to your Amazon Connect instance.
 *
 * If the number is claimed to a traffic distribution group, and you are calling this API using an instance in the Amazon Web Services Region where the traffic distribution group was created, you can use either a full phone number ARN or UUID value for the
 * `PhoneNumberId` URI request parameter. However, if the number is claimed to a traffic distribution group and you are calling
 * this API using an instance in the alternate Amazon Web Services Region associated with the traffic distribution group, you must provide a
 * full phone number ARN. If a UUID is provided in this scenario, you will receive a
 * `ResourceNotFoundException`.
 */
export const disassociatePhoneNumberContactFlow =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociatePhoneNumberContactFlowRequest,
    output: DisassociatePhoneNumberContactFlowResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Imports a claimed phone number from an external service, such as Amazon Web Services End User Messaging, into an
 * Amazon Connect instance. You can call this API only in the same Amazon Web Services Region where the Amazon Connect instance was created.
 *
 * Call the DescribePhoneNumber API to verify the status of a previous `ImportPhoneNumber` operation.
 *
 * If you plan to claim or import numbers and then release numbers frequently, contact us for a service quota
 * exception. Otherwise, it is possible you will be blocked from claiming and releasing any more numbers until up to 180
 * days past the oldest number released has expired.
 *
 * By default you can claim or import and then release up to 200% of your maximum number of active phone numbers.
 * If you claim or import and then release phone numbers using the UI or API during a rolling 180 day cycle that exceeds
 * 200% of your phone number service level quota, you will be blocked from claiming or importing any more numbers until
 * 180 days past the oldest number released has expired.
 *
 * For example, if you already have 99 claimed or imported numbers and a service level quota of 99 phone numbers,
 * and in any 180 day period you release 99, claim 99, and then release 99, you will have exceeded the 200% limit. At
 * that point you are blocked from claiming any more numbers until you open an Amazon Web Services Support ticket.
 */
export const importPhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportPhoneNumberRequest,
  output: ImportPhoneNumberResponse,
  errors: [
    AccessDeniedException,
    IdempotencyException,
    InternalServiceException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes multiple values from a data table. API users may delete values at any time. When deletion is requested
 * from the admin website, a warning is shown alerting the user of the most recent time the attribute and its values
 * were accessed. System managed values are not deletable by customers.
 */
export const batchDeleteDataTableValue = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDeleteDataTableValueRequest,
    output: BatchDeleteDataTableValueResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves multiple values from a data table without evaluating expressions. Returns the raw stored values along
 * with metadata such as lock versions and modification timestamps. "Describe" is a deprecated term but is allowed to
 * maintain consistency with existing operations.
 */
export const batchDescribeDataTableValue = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDescribeDataTableValueRequest,
    output: BatchDescribeDataTableValueResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Claims an available phone number to your Amazon Connect instance or traffic distribution group. You can call
 * this API only in the same Amazon Web Services Region where the Amazon Connect instance or traffic distribution group was
 * created.
 *
 * For more information about how to use this operation, see Claim a phone number in your country and Claim
 * phone numbers to traffic distribution groups in the Amazon Connect Administrator
 * Guide.
 *
 * You can call the SearchAvailablePhoneNumbers API for
 * available phone numbers that you can claim. Call the DescribePhoneNumber API to verify the status
 * of a previous ClaimPhoneNumber operation.
 *
 * If you plan to claim and release numbers frequently,
 * contact us for a service quota exception. Otherwise, it is possible you will be blocked from
 * claiming and releasing any more numbers until up to 180 days past the oldest number
 * released has expired.
 *
 * By default you can claim and release up to 200% of your maximum number of active
 * phone numbers. If you claim and release phone numbers using
 * the UI or API during a rolling 180 day cycle that exceeds 200% of your phone number
 * service level quota, you will be blocked from claiming any more numbers until 180
 * days past the oldest number released has expired.
 *
 * For example, if you already have 99 claimed numbers and a service level quota of 99 phone numbers, and in any 180
 * day period you release 99, claim 99, and then release 99, you will have exceeded the
 * 200% limit. At that point you are blocked from claiming any more numbers until you
 * open an Amazon Web Services support ticket.
 */
export const claimPhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ClaimPhoneNumberRequest,
  output: ClaimPhoneNumberResponse,
  errors: [
    AccessDeniedException,
    IdempotencyException,
    InternalServiceException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes the specified flow.
 *
 * You can also create and update flows using the Amazon Connect
 * Flow language.
 *
 * Use the `$SAVED` alias in the request to describe the `SAVED` content of a Flow. For
 * example, `arn:aws:.../contact-flow/{id}:$SAVED`. After a flow is published, `$SAVED` needs to
 * be supplied to view saved content that has not been published.
 *
 * Use `arn:aws:.../contact-flow/{id}:{version}` to retrieve the content of a specific flow
 * version.
 *
 * In the response, **Status** indicates the flow status as either `SAVED`
 * or `PUBLISHED`. The `PUBLISHED` status will initiate validation on the content.
 * `SAVED` does not initiate validation of the content. `SAVED` | `PUBLISHED`
 */
export const describeContactFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeContactFlowRequest,
  output: DescribeContactFlowResponse,
  errors: [
    ContactFlowNotPublishedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets details and status of a phone number that’s claimed to your Amazon Connect instance or traffic distribution group.
 *
 * If the number is claimed to a traffic distribution group, and you are calling in the Amazon Web Services Region where the traffic distribution group was
 * created, you can use either a phone number ARN or UUID value for the `PhoneNumberId` URI request
 * parameter. However, if the number is claimed to a traffic distribution group and you are calling this API in the alternate Amazon Web Services Region associated with the traffic distribution group, you must provide a full phone number ARN. If a UUID is provided
 * in
 * this scenario, you receive a `ResourceNotFoundException`.
 */
export const describePhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePhoneNumberRequest,
  output: DescribePhoneNumberResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes a predefined attribute for the specified Amazon Connect instance. A *predefined attribute*
 * is made up of a name and a value. You can use predefined attributes for:
 *
 * - Routing proficiency (for example, agent certification) that has predefined values (for example, a list of
 * possible certifications). For more information, see Create predefined attributes for routing contacts to
 * agents.
 *
 * - Contact information that varies between transfers or conferences, such as the name of the business unit
 * handling the contact. For more information, see Use contact segment attributes.
 *
 * For the predefined attributes per instance quota, see Amazon Connect
 * quotas.
 *
 * **Endpoints**: See Amazon Connect endpoints and quotas.
 */
export const describePredefinedAttribute = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribePredefinedAttributeRequest,
    output: DescribePredefinedAttributeResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes the specified hierarchy group.
 */
export const describeUserHierarchyGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeUserHierarchyGroupRequest,
    output: DescribeUserHierarchyGroupResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes the hierarchy structure of the specified Amazon Connect instance.
 */
export const describeUserHierarchyStructure =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeUserHierarchyStructureRequest,
    output: DescribeUserHierarchyStructureResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Evaluates values at the time of the request and returns them. It considers the request's timezone or the table's
 * timezone, in that order, when accessing time based tables. When a value is accessed, the accessor's identity and the
 * time of access are saved alongside the value to help identify values that are actively in use. The term "Batch" is
 * not included in the operation name since it does not meet all the criteria for a batch operation as specified in
 * Batch Operations: Amazon Web Services API Standards.
 */
export const evaluateDataTableValues =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: EvaluateDataTableValuesRequest,
    output: EvaluateDataTableValuesResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Get the hours of operations with the effective override applied.
 */
export const getEffectiveHoursOfOperations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetEffectiveHoursOfOperationsRequest,
    output: GetEffectiveHoursOfOperationsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Lists contact evaluations in the specified Amazon Connect instance.
 */
export const listContactEvaluations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListContactEvaluationsRequest,
    output: ListContactEvaluationsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "EvaluationSummaryList",
    } as const,
  }));
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * For the specified `referenceTypes`, returns a list of references associated with the contact.
 * *References* are links to documents that are related to a contact, such as emails, attachments,
 * or URLs.
 */
export const listContactReferences =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListContactReferencesRequest,
    output: ListContactReferencesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ReferenceSummaryList",
    } as const,
  }));
/**
 * Lists all primary value combinations for a given data table. Returns the unique combinations of primary
 * attribute values that identify records in the table. Up to 100 records are returned per request.
 */
export const listDataTablePrimaryValues =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDataTablePrimaryValuesRequest,
    output: ListDataTablePrimaryValuesResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "PrimaryValuesList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists values stored in a data table with optional filtering by record IDs or primary attribute values. Returns
 * the raw stored values along with metadata such as lock versions and modification timestamps.
 */
export const listDataTableValues =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDataTableValuesRequest,
    output: ListDataTableValuesResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Values",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * List all rules for the specified Amazon Connect instance.
 */
export const listRules = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRulesRequest,
  output: ListRulesResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RuleSummaryList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deactivates an evaluation form in the specified Amazon Connect instance. After a form is deactivated, it is no longer
 * available for users to start new evaluations based on the form.
 */
export const deactivateEvaluationForm = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeactivateEvaluationFormRequest,
    output: DeactivateEvaluationFormResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      ResourceConflictException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates details about a contact evaluation in the specified Amazon Connect instance. A contact evaluation
 * must be in draft state. Answers included in the request are merged with existing answers for the given evaluation. An
 * answer or note can be deleted by passing an empty object (`{}`) to the question identifier.
 */
export const updateContactEvaluation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateContactEvaluationRequest,
    output: UpdateContactEvaluationResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      ResourceConflictException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes a contact evaluation in the specified Amazon Connect instance.
 */
export const deleteContactEvaluation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteContactEvaluationRequest,
    output: DeleteContactEvaluationResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      ResourceConflictException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes an evaluation form in the specified Amazon Connect instance.
 *
 * - If the version property is provided, only the specified version of the evaluation form is deleted.
 *
 * - If no version is provided, then the full form (all versions) is deleted.
 */
export const deleteEvaluationForm = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEvaluationFormRequest,
    output: DeleteEvaluationFormResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      ResourceConflictException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Activates an evaluation form in the specified Amazon Connect instance. After the evaluation form is
 * activated, it is available to start new evaluations based on the form.
 */
export const activateEvaluationForm = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ActivateEvaluationFormRequest,
    output: ActivateEvaluationFormResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      ResourceConflictException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Releases a phone number previously claimed to an Amazon Connect instance or traffic distribution group. You can call this API
 * only in the Amazon Web Services Region where the number was claimed.
 *
 * To release phone numbers from a traffic distribution group, use the `ReleasePhoneNumber` API, not the Amazon Connect admin website.
 *
 * After releasing a phone number, the phone number enters into a cooldown period for up to 180 days. It cannot be
 * searched for or claimed again until the period has ended. If you accidentally release a phone number, contact
 * Amazon Web Services Support.
 *
 * If you plan to claim and release numbers frequently,
 * contact us for a service quota exception. Otherwise, it is possible you will be blocked from
 * claiming and releasing any more numbers until up to 180 days past the oldest number
 * released has expired.
 *
 * By default you can claim and release up to 200% of your maximum number of active
 * phone numbers. If you claim and release phone numbers using
 * the UI or API during a rolling 180 day cycle that exceeds 200% of your phone number
 * service level quota, you will be blocked from claiming any more numbers until 180
 * days past the oldest number released has expired.
 *
 * For example, if you already have 99 claimed numbers and a service level quota of 99 phone numbers, and in any 180
 * day period you release 99, claim 99, and then release 99, you will have exceeded the
 * 200% limit. At that point you are blocked from claiming any more numbers until you
 * open an Amazon Web Services support ticket.
 */
export const releasePhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReleasePhoneNumberRequest,
  output: ReleasePhoneNumberResponse,
  errors: [
    AccessDeniedException,
    IdempotencyException,
    InternalServiceException,
    InvalidParameterException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the vocabulary that has the given identifier.
 */
export const deleteVocabulary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVocabularyRequest,
  output: DeleteVocabularyResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a traffic distribution group. This API can be called only in the Region where the traffic distribution group is created.
 *
 * For more information about deleting traffic distribution groups, see Delete traffic distribution groups in the
 * *Amazon Connect Administrator Guide*.
 */
export const deleteTrafficDistributionGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteTrafficDistributionGroupRequest,
    output: DeleteTrafficDistributionGroupResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidRequestException,
      ResourceInUseException,
      ThrottlingException,
    ],
  }));
/**
 * Updates the user hierarchy structure: add, remove, and rename user hierarchy levels.
 */
export const updateUserHierarchyStructure =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateUserHierarchyStructureRequest,
    output: UpdateUserHierarchyStructureResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes a predefined attribute from the specified Amazon Connect instance.
 */
export const deletePredefinedAttribute = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePredefinedAttributeRequest,
    output: DeletePredefinedAttributeResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes a queue.
 */
export const deleteQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteQueueRequest,
  output: DeleteQueueResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a routing profile.
 */
export const deleteRoutingProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRoutingProfileRequest,
    output: DeleteRoutingProfileResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes an existing user hierarchy group. It must not be associated with any agents or have any active child
 * groups.
 */
export const deleteUserHierarchyGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteUserHierarchyGroupRequest,
    output: DeleteUserHierarchyGroupResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes a security profile.
 */
export const deleteSecurityProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSecurityProfileRequest,
    output: DeleteSecurityProfileResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates a phone number’s metadata.
 *
 * To verify the status of a previous UpdatePhoneNumberMetadata operation, call the DescribePhoneNumber API.
 */
export const updatePhoneNumberMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdatePhoneNumberMetadataRequest,
    output: UpdatePhoneNumberMetadataResponse,
    errors: [
      AccessDeniedException,
      IdempotencyException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Associates a storage resource type for the first time. You can only associate one type of storage configuration
 * in a single call. This means, for example, that you can't define an instance with multiple S3 buckets for storing
 * chat transcripts.
 *
 * This API does not create a resource that doesn't exist. It only associates it to the instance. Ensure that the
 * resource being specified in the storage configuration, like an S3 bucket, exists when being used for
 * association.
 */
export const associateInstanceStorageConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateInstanceStorageConfigRequest,
    output: AssociateInstanceStorageConfigResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceConflictException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Only the Amazon Connect outbound campaigns service principal is allowed to assume a role in your account
 * and call this API.
 *
 * Allows you to create a batch of contacts in Amazon Connect. The outbound campaigns capability ingests dial
 * requests via the PutDialRequestBatch API. It then uses BatchPutContact to create contacts corresponding to those dial
 * requests. If agents are available, the dial requests are dialed out, which results in a voice call. The resulting
 * voice call uses the same contactId that was created by BatchPutContact.
 */
export const batchPutContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchPutContactRequest,
  output: BatchPutContactResponse,
  errors: [
    AccessDeniedException,
    IdempotencyException,
    InternalServiceException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves the position of the contact in the queue.
 *
 * **Use cases**
 *
 * Following are common uses cases for position in queue:
 *
 * - Understand the expected wait experience of a contact.
 *
 * - Inform customers of their position in queue and potentially offer a callback.
 *
 * - Make data-driven routing decisions between primary and alternative queues.
 *
 * - Enhance queue visibility and leverage agent proficiencies to streamline contact routing.
 *
 * **Important things to know**
 *
 * - The only way to retrieve the position of the contact in queue is by using this API. You can't retrieve the
 * position by using flows and attributes.
 *
 * - For more information, see the Position in queue metric in the *Amazon Connect Administrator Guide*.
 *
 * **Endpoints**: See Amazon Connect endpoints and quotas.
 */
export const getContactMetrics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContactMetricsRequest,
  output: GetContactMetricsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Searches AgentStatuses in an Amazon Connect instance, with optional filtering.
 */
export const searchAgentStatuses =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: SearchAgentStatusesRequest,
    output: SearchAgentStatusesResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "AgentStatuses",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Searches the flows in an Amazon Connect instance, with optional filtering.
 */
export const searchContactFlows = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: SearchContactFlowsRequest,
    output: SearchContactFlowsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ContactFlows",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Submits a contact evaluation in the specified Amazon Connect instance. Answers included in the request are
 * merged with existing answers for the given evaluation. If no answers or notes are passed, the evaluation is submitted
 * with the existing answers and notes. You can delete an answer or note by passing an empty object (`{}`) to
 * the question identifier.
 *
 * If a contact evaluation is already in submitted state, this operation will trigger a resubmission.
 */
export const submitContactEvaluation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SubmitContactEvaluationRequest,
    output: SubmitContactEvaluationResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      ResourceConflictException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates timeouts for when human chat participants are to be considered idle, and when agents are automatically
 * disconnected from a chat due to idleness. You can set four timers:
 *
 * - Customer idle timeout
 *
 * - Customer auto-disconnect timeout
 *
 * - Agent idle timeout
 *
 * - Agent auto-disconnect timeout
 *
 * For more information about how chat timeouts work, see
 * Set up chat timeouts for human participants.
 */
export const updateParticipantRoleConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateParticipantRoleConfigRequest,
    output: UpdateParticipantRoleConfigResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Supports SAML sign-in for Amazon Connect. Retrieves a token for federation. The token is for the Amazon Connect user which corresponds to the IAM credentials that were used to invoke this action.
 *
 * For more information about how SAML sign-in works in Amazon Connect, see Configure SAML with IAM for Amazon Connect
 * in the *Amazon Connect Administrator Guide*.
 *
 * This API doesn't support root users. If you try to invoke GetFederationToken with root credentials, an error
 * message similar to the following one appears:
 *
 * `Provided identity: Principal: .... User: .... cannot be used for federation with Amazon Connect`
 */
export const getFederationToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFederationTokenRequest,
  output: GetFederationTokenResponse,
  errors: [
    DuplicateResourceException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    UserNotFoundException,
  ],
}));
/**
 * Returns views in the given instance.
 *
 * Results are sorted primarily by type, and secondarily by name.
 */
export const listViews = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListViewsRequest,
  output: ListViewsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ViewsSummaryList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates hours of operation.
 */
export const createHoursOfOperation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateHoursOfOperationRequest,
    output: CreateHoursOfOperationResponse,
    errors: [
      DuplicateResourceException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates an hours of operation override in an Amazon Connect hours of operation resource.
 */
export const createHoursOfOperationOverride =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateHoursOfOperationOverrideRequest,
    output: CreateHoursOfOperationOverrideResponse,
    errors: [
      DuplicateResourceException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Creates a quick connect for the specified Amazon Connect instance.
 */
export const createQuickConnect = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateQuickConnectRequest,
  output: CreateQuickConnectResponse,
  errors: [
    DuplicateResourceException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a new routing profile.
 */
export const createRoutingProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateRoutingProfileRequest,
    output: CreateRoutingProfileResponse,
    errors: [
      DuplicateResourceException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Initiates a new outbound SMS or WhatsApp contact to a customer. Response of this API provides the
 * `ContactId` of the outbound SMS or WhatsApp contact created.
 *
 * **SourceEndpoint** only supports Endpoints with
 * `CONNECT_PHONENUMBER_ARN` as Type and **DestinationEndpoint** only supports
 * Endpoints with `TELEPHONE_NUMBER` as Type. **ContactFlowId** initiates the
 * flow to manage the new contact created.
 *
 * This API can be used to initiate outbound SMS or WhatsApp contacts for an agent, or it can also deflect
 * an ongoing contact to an outbound SMS or WhatsApp contact by using the StartOutboundChatContact Flow
 * Action.
 *
 * For more information about using SMS or WhatsApp in Amazon Connect, see the following topics in
 * the *Amazon Connect Administrator Guide*:
 *
 * - Set up SMS
 * messaging
 *
 * - Request an SMS-enabled phone
 * number through Amazon Web Services End User Messaging SMS
 *
 * - Set up WhatsApp
 * Business messaging
 */
export const startOutboundChatContact = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartOutboundChatContactRequest,
    output: StartOutboundChatContactResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServiceException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a new queue for the specified Amazon Connect instance.
 *
 * - If the phone number is claimed to a traffic distribution group that was created in the
 * same Region as the Amazon Connect instance where you are calling this API, then you can use a
 * full phone number ARN or a UUID for `OutboundCallerIdNumberId`. However, if the phone number is claimed
 * to a traffic distribution group that is in one Region, and you are calling this API from an instance in another Amazon Web Services Region that is associated with the traffic distribution group, you must provide a full phone number ARN. If a
 * UUID is provided in this scenario, you will receive a
 * `ResourceNotFoundException`.
 *
 * - Only use the phone number ARN format that doesn't contain `instance` in the path, for example,
 * `arn:aws:connect:us-east-1:1234567890:phone-number/uuid`. This is the same ARN format that is returned
 * when you call the ListPhoneNumbersV2 API.
 *
 * - If you plan to use IAM policies to allow/deny access to this API for phone number resources
 * claimed to a traffic distribution group, see Allow or Deny queue API actions for phone numbers in a replica Region.
 */
export const createQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateQueueRequest,
  output: CreateQueueResponse,
  errors: [
    DuplicateResourceException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a user account for the specified Amazon Connect instance.
 *
 * Certain UserIdentityInfo parameters are required in some situations. For example, `Email`,
 * `FirstName` and `LastName` are required if you are using Amazon Connect or SAML for
 * identity management.
 *
 * For information about how to create users using the Amazon Connect admin website, see Add Users in the Amazon Connect
 * Administrator Guide.
 */
export const createUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserRequest,
  output: CreateUserResponse,
  errors: [
    DuplicateResourceException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Initiates a flow to start a new chat for the customer. Response of this API provides a token required to obtain
 * credentials from the CreateParticipantConnection API in the Amazon Connect Participant Service.
 *
 * When a new chat contact is successfully created, clients must subscribe to the participant’s connection for the
 * created chat within 5 minutes. This is achieved by invoking CreateParticipantConnection with WEBSOCKET and CONNECTION_CREDENTIALS.
 *
 * A 429 error occurs in the following situations:
 *
 * - API rate limit is exceeded. API TPS throttling returns a `TooManyRequests` exception.
 *
 * - The quota for
 * concurrent active chats is exceeded. Active chat throttling returns a
 * `LimitExceededException`.
 *
 * If you use the `ChatDurationInMinutes` parameter and receive a 400 error, your account may not
 * support the ability to configure custom chat durations. For more information, contact Amazon Web Services Support.
 *
 * For more information about chat, see the following topics in the Amazon Connect
 * Administrator Guide:
 *
 * - Concepts: Web and mobile messaging capabilities in Amazon Connect
 *
 * - Amazon Connect Chat security best practices
 */
export const startChatContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartChatContactRequest,
  output: StartChatContactResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Initiates real-time message streaming for a new chat contact.
 *
 * For more information about message streaming, see Enable real-time chat message streaming in the
 * *Amazon Connect Administrator Guide*.
 *
 * For more information about chat, see the following topics in the Amazon Connect
 * Administrator Guide:
 *
 * - Concepts: Web and mobile messaging capabilities in Amazon Connect
 *
 * - Amazon Connect Chat security best practices
 */
export const startContactStreaming = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartContactStreamingRequest,
    output: StartContactStreamingResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Creates an immutable snapshot of a contact flow module, preserving its content and settings at a specific point
 * in time for version control and rollback capabilities.
 */
export const createContactFlowModuleVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateContactFlowModuleVersionRequest,
    output: CreateContactFlowModuleVersionResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Publishes a new version of the flow provided. Versions are immutable and monotonically increasing. If the
 * `FlowContentSha256` provided is different from the `FlowContentSha256` of the
 * `$LATEST` published flow content, then an error is returned. This API only supports creating versions for
 * flows of type `Campaign`.
 */
export const createContactFlowVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateContactFlowVersionRequest,
    output: CreateContactFlowVersionResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates agent status.
 */
export const updateAgentStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAgentStatusRequest,
  output: UpdateAgentStatusResponse,
  errors: [
    DuplicateResourceException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Associates a set of quick connects with a queue.
 */
export const associateQueueQuickConnects = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateQueueQuickConnectsRequest,
    output: AssociateQueueQuickConnectsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the scheduled time of a task contact that is already scheduled.
 */
export const updateContactSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateContactScheduleRequest,
    output: UpdateContactScheduleResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Stops in-flight message processing for an ongoing chat session.
 */
export const stopContactMediaProcessing = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopContactMediaProcessingRequest,
    output: StopContactMediaProcessingResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Creates an agent status for the specified Amazon Connect instance.
 */
export const createAgentStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAgentStatusRequest,
  output: CreateAgentStatusResponse,
  errors: [
    DuplicateResourceException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a named alias that points to a specific version of a contact flow module.
 */
export const createContactFlowModuleAlias =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateContactFlowModuleAliasRequest,
    output: CreateContactFlowModuleAliasResponse,
    errors: [
      AccessDeniedException,
      DuplicateResourceException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Creates a new predefined attribute for the specified Amazon Connect instance. A *predefined attribute*
 * is made up of a name and a value.
 *
 * For the predefined attributes per instance quota, see Amazon Connect
 * quotas.
 *
 * **Use cases**
 *
 * Following are common uses cases for this API:
 *
 * - Create an attribute for routing proficiency (for example, agent certification) that has predefined values (for
 * example, a list of possible certifications). For more information, see Create predefined attributes for routing contacts to
 * agents.
 *
 * - Create an attribute for business unit name that has a list of predefined business unit names used in your
 * organization. This is a use case where information for a contact varies between transfers or conferences. For more
 * information, see Use contact segment attributes.
 *
 * **Endpoints**: See Amazon Connect endpoints and quotas.
 */
export const createPredefinedAttribute = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePredefinedAttributeRequest,
    output: CreatePredefinedAttributeResponse,
    errors: [
      DuplicateResourceException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a prompt. For more information about prompts, such as supported file types and maximum length, see
 * Create prompts in the
 * *Amazon Connect Administrator Guide*.
 */
export const createPrompt = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePromptRequest,
  output: CreatePromptResponse,
  errors: [
    DuplicateResourceException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ThrottlingException,
  ],
}));
/**
 * Creates a new user hierarchy group.
 */
export const createUserHierarchyGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateUserHierarchyGroupRequest,
    output: CreateUserHierarchyGroupResponse,
    errors: [
      DuplicateResourceException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Allows pausing an ongoing task contact.
 */
export const pauseContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PauseContactRequest,
  output: PauseContactResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a flow module for the specified Amazon Connect instance.
 */
export const createContactFlowModule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateContactFlowModuleRequest,
    output: CreateContactFlowModuleResponse,
    errors: [
      AccessDeniedException,
      DuplicateResourceException,
      IdempotencyException,
      InternalServiceException,
      InvalidContactFlowModuleException,
      InvalidParameterException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a flow for the specified Amazon Connect instance.
 *
 * You can also create and update flows using the Amazon Connect
 * Flow language.
 */
export const createContactFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateContactFlowRequest,
  output: CreateContactFlowResponse,
  errors: [
    DuplicateResourceException,
    InternalServiceException,
    InvalidContactFlowException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns all the available versions for the specified Amazon Connect instance and view identifier.
 *
 * Results will be sorted from highest to lowest.
 */
export const listViewVersions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListViewVersionsRequest,
    output: ListViewVersionsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ViewVersionSummaryList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Retrieves the view for the specified Amazon Connect instance and view identifier.
 *
 * The view identifier can be supplied as a ViewId or ARN.
 *
 * `$SAVED` needs to be supplied if a view is unpublished.
 *
 * The view identifier can contain an optional qualifier, for example, `:$SAVED`, which
 * is either an actual version number or an Amazon Connect managed qualifier `$SAVED | $LATEST`. If it is
 * not supplied, then `$LATEST` is assumed for customer managed views and an error is returned if there is no
 * published content available. Version 1 is assumed for Amazon Web Services managed views.
 */
export const describeView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeViewRequest,
  output: DescribeViewResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the view content of the given view identifier in the specified Amazon Connect instance.
 *
 * It performs content validation if `Status` is set to `SAVED` and performs full content
 * validation if `Status` is `PUBLISHED`. Note that the `$SAVED` alias' content will
 * always be updated, but the `$LATEST` alias' content will only be updated if `Status` is
 * `PUBLISHED`.
 */
export const updateViewContent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateViewContentRequest,
  output: UpdateViewContentResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the view entirely. It deletes the view and all associated qualifiers (versions and aliases).
 */
export const deleteView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteViewRequest,
  output: DeleteViewResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the particular version specified in `ViewVersion` identifier.
 */
export const deleteViewVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteViewVersionRequest,
  output: DeleteViewVersionResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the view metadata. Note that either `Name` or `Description` must be
 * provided.
 */
export const updateViewMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateViewMetadataRequest,
  output: UpdateViewMetadataResponse,
  errors: [
    AccessDeniedException,
    DuplicateResourceException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Adds an attribute to an existing data table. Creating a new primary attribute uses the empty value for the
 * specified value type for all existing records. This should not affect uniqueness of published data tables since the
 * existing primary values will already be unique. Creating attributes does not create any values. System managed tables
 * may not allow customers to create new attributes.
 */
export const createDataTableAttribute = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDataTableAttributeRequest,
    output: CreateDataTableAttributeResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      DuplicateResourceException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a rule for the specified Amazon Connect instance.
 *
 * Use the Rules Function
 * language to code conditions for the rule.
 */
export const createRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRuleRequest,
  output: CreateRuleResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidRequestException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Creates a security profile.
 *
 * For information about security profiles, see Security Profiles in the *Amazon Connect Administrator Guide*. For a mapping of the API name and user interface name of the security
 * profile permissions, see List
 * of security profile permissions.
 */
export const createSecurityProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSecurityProfileRequest,
    output: CreateSecurityProfileResponse,
    errors: [
      DuplicateResourceException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a workspace that defines the user experience by mapping views to pages. Workspaces can be assigned to
 * users or routing profiles.
 */
export const createWorkspace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkspaceRequest,
  output: CreateWorkspaceResponse,
  errors: [
    AccessDeniedException,
    DuplicateResourceException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Describes the specified contact.
 *
 * **Use cases**
 *
 * Following are common uses cases for this API:
 *
 * - Retrieve contact information such as the caller's phone number and the specific number the caller dialed to
 * integrate into custom monitoring or custom agent experience solutions.
 *
 * - Detect when a customer chat session disconnects due to a network issue on the agent's end. Use the
 * DisconnectReason field in the ContactTraceRecord to detect
 * this event and then re-queue the chat for followup.
 *
 * - Identify after contact work (ACW) duration and call recordings information when a COMPLETED event is received
 * by using the contact event
 * stream.
 *
 * **Important things to know**
 *
 * - `SystemEndpoint` is not populated for contacts with initiation method of MONITOR, QUEUE_TRANSFER,
 * or CALLBACK
 *
 * - Contact information remains available in Amazon Connect for 24 months from the
 * `InitiationTimestamp`, and then it is deleted. Only contact information that is available in Amazon Connect is returned by this API.
 *
 * **Endpoints**: See Amazon Connect endpoints and quotas.
 */
export const describeContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeContactRequest,
  output: DescribeContactResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets the real-time metric data from the specified Amazon Connect instance.
 *
 * For a description of each metric, see Metrics definitions in the *Amazon Connect Administrator Guide*.
 *
 * When you make a successful API request, you can expect the following metric values in the response:
 *
 * - **Metric value is null**: The calculation cannot be performed due to divide by
 * zero or insufficient data
 *
 * - **Metric value is a number (including 0) of defined type**: The number provided
 * is the calculation result
 *
 * - **MetricResult list is empty**: The request cannot find any data in the
 * system
 *
 * The following guidelines can help you work with the API:
 *
 * - Each dimension in the metric response must contain a value
 *
 * - Each item in MetricResult must include all requested metrics
 *
 * - If the response is slow due to large result sets, try these approaches:
 *
 * - Add filters to reduce the amount of data returned
 */
export const getCurrentMetricData =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetCurrentMetricDataRequest,
    output: GetCurrentMetricDataResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets historical metric data from the specified Amazon Connect instance.
 *
 * For a description of each historical metric, see Metrics definitions in the *Amazon Connect Administrator Guide*.
 *
 * We recommend using the GetMetricDataV2 API. It provides more flexibility, features, and the ability to query longer time ranges
 * than `GetMetricData`. Use it to retrieve historical agent and contact metrics for the last 3 months, at
 * varying intervals. You can also use it to build custom dashboards to measure historical queue and agent performance.
 * For example, you can track the number of incoming contacts for the last 7 days, with data split by day, to see how
 * contact volume changed per day of the week.
 */
export const getMetricData = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetMetricDataRequest,
    output: GetMetricDataResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Gets metric data from the specified Amazon Connect instance.
 *
 * `GetMetricDataV2` offers more features than GetMetricData, the previous version of this API. It
 * has new metrics, offers filtering at a metric level, and offers the ability to filter and group data by channels,
 * queues, routing profiles, agents, and agent hierarchy levels. It can retrieve historical data for the last 3 months,
 * at varying intervals. It does not support agent queues.
 *
 * For a description of the historical metrics that are supported by `GetMetricDataV2` and
 * `GetMetricData`, see Metrics definitions in the *Amazon Connect Administrator Guide*.
 *
 * When you make a successful API request, you can expect the following metric values in the response:
 *
 * - **Metric value is null**: The calculation cannot be performed due to divide by
 * zero or insufficient data
 *
 * - **Metric value is a number (including 0) of defined type**: The number provided
 * is the calculation result
 *
 * - **MetricResult list is empty**: The request cannot find any data in the
 * system
 *
 * The following guidelines can help you work with the API:
 *
 * - Each dimension in the metric response must contain a value
 *
 * - Each item in MetricResult must include all requested metrics
 *
 * - If the response is slow due to large result sets, try these approaches:
 *
 * - Narrow the time range of your request
 *
 * - Add filters to reduce the amount of data returned
 */
export const getMetricDataV2 = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetMetricDataV2Request,
    output: GetMetricDataV2Response,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Searches contact evaluations in an Amazon Connect instance, with optional filtering.
 *
 * **Use cases**
 *
 * Following are common uses cases for this API:
 *
 * - Find contact evaluations by using specific search criteria.
 *
 * - Find contact evaluations that are tagged with a specific set of tags.
 *
 * **Important things to know**
 *
 * - A Search operation, unlike a List operation, takes time to index changes to resource (create, update or
 * delete). If you don't see updated information for recently changed contact evaluations, try calling the API again
 * in a few seconds. Contact Evaluations may not be fully backfilled with historical data in all regions yet, however
 * all recently created Contact Evaluations should be available for search.
 *
 * **Endpoints**: See Amazon Connect endpoints and quotas.
 */
export const searchContactEvaluations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SearchContactEvaluationsRequest,
    output: SearchContactEvaluationsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Searches tags used in an Amazon Connect instance using optional search criteria.
 */
export const searchResourceTags = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: SearchResourceTagsRequest,
    output: SearchResourceTagsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      MaximumResultReturnedException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Tags",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Starts an empty evaluation in the specified Amazon Connect instance, using the given evaluation form for the
 * particular contact. The evaluation form version used for the contact evaluation corresponds to the currently
 * activated version. If no version is activated for the evaluation form, the contact evaluation cannot be started.
 *
 * Evaluations created through the public API do not contain answer values suggested from automation.
 */
export const startContactEvaluation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartContactEvaluationRequest,
    output: StartContactEvaluationResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      ResourceConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
    ],
  }),
);
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Initiates an Amazon Connect instance with all the supported channels enabled. It does not attach any
 * storage, such as Amazon Simple Storage Service (Amazon S3) or Amazon Kinesis. It also does not allow for any
 * configurations on features, such as Contact Lens for Amazon Connect.
 *
 * For more information, see Create an Amazon Connect instance in the
 * *Amazon Connect Administrator Guide*.
 *
 * Amazon Connect enforces a limit on the total number of instances that you can create or delete in 30 days.
 * If you exceed this limit, you will get an error message indicating there has been an excessive number of attempts at creating or deleting instances.
 * You must wait 30 days before you can restart creating and deleting instances in your account.
 */
export const createInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInstanceRequest,
  output: CreateInstanceResponse,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Creates a custom vocabulary associated with your Amazon Connect instance. You can set a custom vocabulary to
 * be your default vocabulary for a given language. Contact Lens for Amazon Connect uses the default vocabulary in post-call and real-time
 * contact analysis sessions for that language.
 */
export const createVocabulary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVocabularyRequest,
  output: CreateVocabularyResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidRequestException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Associates an approved origin to an Amazon Connect instance.
 */
export const associateApprovedOrigin = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateApprovedOriginRequest,
    output: AssociateApprovedOriginResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a new data table with the specified properties. Supports the creation of all table properties except for
 * attributes and values. A table with no attributes and values is a valid state for a table. The number of tables per
 * instance is limited to 100 per instance. Customers can request an increase by using Amazon Web Services Service Quotas.
 */
export const createDataTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataTableRequest,
  output: CreateDataTableResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    DuplicateResourceException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Send outbound email for outbound campaigns. For more information about outbound campaigns, see Set up Amazon Connect
 * outbound campaigns.
 *
 * Only the Amazon Connect outbound campaigns service principal is allowed to assume a role in your account
 * and call this API.
 */
export const sendOutboundEmail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendOutboundEmailRequest,
  output: SendOutboundEmailResponse,
  errors: [
    AccessDeniedException,
    IdempotencyException,
    InternalServiceException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Associates a security key to the instance.
 */
export const associateSecurityKey = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateSecurityKeyRequest,
    output: AssociateSecurityKeyResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
    ],
  }),
);
/**
 * Initiates a flow to start a new task contact. For more information about task contacts, see Concepts: Tasks in Amazon Connect in the
 * *Amazon Connect Administrator Guide*.
 *
 * When using `PreviousContactId` and `RelatedContactId` input parameters, note the
 * following:
 *
 * - `PreviousContactId`
 *
 * - Any updates to user-defined task contact attributes on any contact linked through the same
 * `PreviousContactId` will affect every contact in the chain.
 *
 * - There can be a maximum of 12 linked task contacts in a chain. That is, 12 task contacts can be created that
 * share the same `PreviousContactId`.
 *
 * - `RelatedContactId`
 *
 * - Copies contact attributes from the related task contact to the new contact.
 *
 * - Any update on attributes in a new task contact does not update attributes on previous contact.
 *
 * - There’s no limit on the number of task contacts that can be created that use the same
 * `RelatedContactId`.
 *
 * In addition, when calling StartTaskContact include only one of these parameters: `ContactFlowID`,
 * `QuickConnectID`, or `TaskTemplateID`. Only one parameter is required as long as the task
 * template has a flow configured to run it. If more than one parameter is specified, or only the
 * `TaskTemplateID` is specified but it does not have a flow configured, the request returns an error
 * because Amazon Connect cannot identify the unique flow to run when the task is created.
 *
 * A `ServiceQuotaExceededException` occurs when the number of open tasks exceeds the active tasks quota
 * or there are already 12 tasks referencing the same `PreviousContactId`. For more information about service
 * quotas for task contacts, see Amazon Connect service quotas in the
 * *Amazon Connect Administrator Guide*.
 */
export const startTaskContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTaskContactRequest,
  output: StartTaskContactResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Allows the specified Amazon Connect instance to access the specified Lambda function.
 */
export const associateLambdaFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateLambdaFunctionRequest,
    output: AssociateLambdaFunctionResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
    ],
  }),
);
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Allows the specified Amazon Connect instance to access the specified Amazon Lex V1 bot. This API
 * only supports the association of Amazon Lex V1 bots.
 */
export const associateLexBot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateLexBotRequest,
  output: AssociateLexBotResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Initiates silent monitoring of a contact. The Contact Control Panel (CCP) of the user specified by
 * *userId* will be set to silent monitoring mode on the contact.
 */
export const monitorContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: MonitorContactRequest,
  output: MonitorContactResponse,
  errors: [
    AccessDeniedException,
    IdempotencyException,
    InternalServiceException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Initiates a flow to send an agent reply or outbound email contact (created from the CreateContact API) to a
 * customer.
 */
export const startOutboundEmailContact = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartOutboundEmailContactRequest,
    output: StartOutboundEmailContactResponse,
    errors: [
      AccessDeniedException,
      IdempotencyException,
      InternalServiceException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
    ],
  }),
);
/**
 * Transfers `TASK` or `EMAIL`
 * contacts from one agent or queue to another agent or queue at any point after a contact is
 * created. You can transfer a contact to another queue by providing the flow which orchestrates the contact to the
 * destination queue. This gives you more control over contact handling and helps you adhere to the service level
 * agreement (SLA) guaranteed to your customers.
 *
 * Note the following requirements:
 *
 * - Transfer is only supported for `TASK` and `EMAIL` contacts.
 *
 * - Do not use both `QueueId` and `UserId` in the same call.
 *
 * - The following flow types are supported: Inbound flow, Transfer to agent flow, and Transfer to queue
 * flow.
 *
 * - The `TransferContact` API can be called only on active contacts.
 *
 * - A contact cannot be transferred more than 11 times.
 */
export const transferContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TransferContactRequest,
  output: TransferContactResponse,
  errors: [
    AccessDeniedException,
    IdempotencyException,
    InternalServiceException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Create new email address in the specified Amazon Connect instance. For more information about email
 * addresses, see Create email
 * addresses in the Amazon Connect Administrator Guide.
 */
export const createEmailAddress = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEmailAddressRequest,
  output: CreateEmailAddressResponse,
  errors: [
    AccessDeniedException,
    DuplicateResourceException,
    IdempotencyException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Creates registration for a device token and a chat contact to receive real-time push notifications. For more
 * information about push notifications, see Set up push notifications in Amazon Connect for mobile chat in the *Amazon Connect Administrator Guide*.
 */
export const createPushNotificationRegistration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreatePushNotificationRegistrationRequest,
    output: CreatePushNotificationRegistrationResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
    ],
  }));
/**
 * Creates values for attributes in a data table. The value may be a default or it may be associated with a primary
 * value. The value must pass all customer defined validation as well as the default validation for the value type. The
 * operation must conform to Batch Operation API Standards. Although the standard specifies that successful and failed
 * entities are listed separately in the response, authorization fails if any primary values or attributes are
 * unauthorized. The combination of primary values and the attribute name serve as the identifier for the individual
 * item request.
 */
export const batchCreateDataTableValue = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchCreateDataTableValueRequest,
    output: BatchCreateDataTableValueResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      DuplicateResourceException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates details about a specific evaluation form version in the specified Amazon Connect instance. Question
 * and section identifiers cannot be duplicated within the same evaluation form.
 *
 * This operation does not support partial updates. Instead it does a full update of evaluation form
 * content.
 */
export const updateEvaluationForm = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateEvaluationFormRequest,
    output: UpdateEvaluationFormResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      ResourceConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
    ],
  }),
);
/**
 * Publishes a new version of the view identifier.
 *
 * Versions are immutable and monotonically increasing.
 *
 * It returns the highest version if there is no change in content compared to that version. An error is displayed
 * if the supplied ViewContentSha256 is different from the ViewContentSha256 of the `$LATEST` alias.
 */
export const createViewVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateViewVersionRequest,
  output: CreateViewVersionResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new view with the possible status of `SAVED` or `PUBLISHED`.
 *
 * The views will have a unique name for each connect instance.
 *
 * It performs basic content validation if the status is `SAVED` or full content validation if the
 * status is set to `PUBLISHED`. An error is returned if validation fails. It associates either the
 * `$SAVED` qualifier or both of the `$SAVED` and `$LATEST` qualifiers with the
 * provided view content based on the status. The view is idempotent if ClientToken is provided.
 */
export const createView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateViewRequest,
  output: CreateViewResponse,
  errors: [
    AccessDeniedException,
    DuplicateResourceException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * This API is in preview release for Amazon Connect and is subject to change.
 *
 * Allows the specified Amazon Connect instance to access the specified Amazon Lex or Amazon Lex V2
 * bot.
 */
export const associateBot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateBotRequest,
  output: AssociateBotResponse,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    LimitExceededException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Only the VOICE, EMAIL, and TASK channels are supported.
 *
 * - For VOICE: The supported initiation method is `TRANSFER`. The contacts created with this
 * initiation method have a subtype `connect:ExternalAudio`.
 *
 * - For EMAIL: The supported initiation methods are `OUTBOUND`, `AGENT_REPLY`, and
 * `FLOW`.
 *
 * - For TASK: The supported initiation method is `API`. Contacts created with this API have a sub-type
 * of `connect:ExternalTask`.
 *
 * Creates a new VOICE, EMAIL, or TASK contact.
 *
 * After a contact is created, you can move it to the desired state by using the `InitiateAs` parameter.
 * While you can use API to create task contacts that are in the `COMPLETED` state, you must contact Amazon Web Services Support before using it for bulk import use cases. Bulk import causes your requests to be throttled or
 * fail if your CreateContact limits aren't high enough.
 */
export const createContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateContactRequest,
  output: CreateContactResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    IdempotencyException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Adds a new participant into an on-going chat contact or webRTC call. For more information, see Customize chat flow experiences by
 * integrating custom participants or Enable multi-user web, in-app, and video
 * calling.
 */
export const createParticipant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateParticipantRequest,
  output: CreateParticipantResponse,
  errors: [
    ConflictException,
    InternalServiceException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Provides a pre-signed Amazon S3 URL in response for uploading your content.
 *
 * You may only use this API to upload attachments to an Amazon Connect Case or Amazon Connect Email.
 */
export const startAttachedFileUpload = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartAttachedFileUploadRequest,
    output: StartAttachedFileUploadResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidRequestException,
      ResourceConflictException,
      ServiceQuotaExceededException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates an inbound email contact and initiates a flow to start the email contact for the customer. Response of
 * this API provides the ContactId of the email contact created.
 */
export const startEmailContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartEmailContactRequest,
  output: StartEmailContactResponse,
  errors: [
    AccessDeniedException,
    IdempotencyException,
    InternalServiceException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Updates details about a specific task template in the specified Amazon Connect instance. This operation does
 * not support partial updates. Instead it does a full update of template content.
 */
export const updateTaskTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTaskTemplateRequest,
  output: UpdateTaskTemplateResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    PropertyValidationException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Creates a traffic distribution group given an Amazon Connect instance that has been replicated.
 *
 * The `SignInConfig` distribution is available only on a
 * default `TrafficDistributionGroup` (see the `IsDefault` parameter in the
 * TrafficDistributionGroup
 * data type). If you call
 * `UpdateTrafficDistribution` with a modified `SignInConfig` and a non-default `TrafficDistributionGroup`,
 * an `InvalidRequestException` is returned.
 *
 * For more information about creating traffic distribution groups, see Set up traffic distribution groups in the
 * *Amazon Connect Administrator Guide*.
 */
export const createTrafficDistributionGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateTrafficDistributionGroupRequest,
    output: CreateTrafficDistributionGroupResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidRequestException,
      ResourceConflictException,
      ResourceNotFoundException,
      ResourceNotReadyException,
      ServiceQuotaExceededException,
      ThrottlingException,
    ],
  }));
/**
 * Associates a view with a page in a workspace, defining what users see when they navigate to that page.
 */
export const createWorkspacePage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkspacePageRequest,
  output: CreateWorkspacePageResponse,
  errors: [
    AccessDeniedException,
    DuplicateResourceException,
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Enables in-flight message processing for an ongoing chat session. Message processing will stay active for the
 * rest of the chat, even if an individual contact segment ends.
 */
export const startContactMediaProcessing = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartContactMediaProcessingRequest,
    output: StartContactMediaProcessingResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
    ],
  }),
);
/**
 * Updates all properties for an attribute using all properties from CreateDataTableAttribute. There are no other
 * granular update endpoints. It does not act as a patch operation - all properties must be provided. System managed
 * attributes are not mutable by customers. Changing an attribute's validation does not invalidate existing values since
 * validation only runs when values are created or updated.
 */
export const updateDataTableAttribute = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDataTableAttributeRequest,
    output: UpdateDataTableAttributeResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a new task template in the specified Amazon Connect instance.
 */
export const createTaskTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTaskTemplateRequest,
  output: CreateTaskTemplateResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    PropertyValidationException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Replicates an Amazon Connect instance in the specified Amazon Web Services Region and copies configuration
 * information for Amazon Connect resources across Amazon Web Services Regions.
 *
 * For more information about replicating an Amazon Connect instance, see Create a replica of your existing Amazon Connect
 * instance in the *Amazon Connect Administrator Guide*.
 */
export const replicateInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReplicateInstanceRequest,
  output: ReplicateInstanceResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidRequestException,
    ResourceConflictException,
    ResourceNotFoundException,
    ResourceNotReadyException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Gets the real-time active user data from the specified Amazon Connect instance.
 */
export const getCurrentUserData = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetCurrentUserDataRequest,
    output: GetCurrentUserDataResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Searches users in an Amazon Connect instance, with optional filtering.
 *
 * `AfterContactWorkTimeLimit` is returned in milliseconds.
 */
export const searchUsers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: SearchUsersRequest,
    output: SearchUsersResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Users",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Places an inbound in-app, web, or video call to a contact, and then initiates the flow. It performs the actions
 * in the flow that are specified (in ContactFlowId) and present in the Amazon Connect instance (specified as
 * InstanceId).
 */
export const startWebRTCContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartWebRTCContactRequest,
  output: StartWebRTCContactResponse,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates routing priority and age on the contact (**QueuePriority** and **QueueTimeAdjustmentInSeconds**). These properties can be used to change a customer's position
 * in the queue. For example, you can move a contact to the back of the queue by setting a lower routing priority
 * relative to other contacts in queue; or you can move a contact to the front of the queue by increasing the routing
 * age which will make the contact look artificially older and therefore higher up in the first-in-first-out routing
 * order. Note that adjusting the routing age of a contact affects only its position in queue, and not its actual queue
 * wait time as reported through metrics. These properties can also be updated by using the Set routing priority / age flow
 * block.
 *
 * Either **QueuePriority** or **QueueTimeAdjustmentInSeconds** should be provided within the request body, but not both.
 */
export const updateContactRoutingData = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateContactRoutingDataRequest,
    output: UpdateContactRoutingDataResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidActiveRegionException,
      InvalidParameterException,
      ResourceConflictException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates an evaluation form in the specified Amazon Connect instance. The form can be used to define
 * questions related to agent performance, and create sections to organize such questions. Question and section
 * identifiers cannot be duplicated within the same evaluation form.
 */
export const createEvaluationForm = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEvaluationFormRequest,
    output: CreateEvaluationFormResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      ResourceConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
    ],
  }),
);
/**
 * Provides a list of analysis segments for a real-time chat analysis session. This API supports CHAT channels
 * only.
 *
 * This API does not support VOICE. If you attempt to use it for VOICE, an `InvalidRequestException`
 * occurs.
 */
export const listRealtimeContactAnalysisSegmentsV2 =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRealtimeContactAnalysisSegmentsV2Request,
    output: ListRealtimeContactAnalysisSegmentsV2Response,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidRequestException,
      OutputTypeNotFoundException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Searches contacts in an Amazon Connect instance.
 */
export const searchContacts = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: SearchContactsRequest,
    output: SearchContactsResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Contacts",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Places an outbound call to a contact, and then initiates the flow. It performs the actions in the flow that's
 * specified (in `ContactFlowId`).
 *
 * Agents do not initiate the outbound API, which means that they do not dial the contact. If the flow places an
 * outbound call to a contact, and then puts the contact in queue, the call is then routed to the agent, like any other
 * inbound case.
 *
 * Dialing timeout for this operation can be configured with the “RingTimeoutInSeconds” parameter. If not
 * specified, the default dialing timeout will be 60 seconds which means if the call is not connected within 60 seconds,
 * it fails.
 *
 * UK numbers with a 447 prefix are not allowed by default. Before you can dial these UK mobile numbers, you must
 * submit a service quota increase request. For more information, see Amazon Connect Service Quotas in the
 * *Amazon Connect Administrator Guide*.
 *
 * Campaign calls are not allowed by default. Before you can make a call with `TrafficType` =
 * `CAMPAIGN`, you must submit a service quota increase request to the quota Amazon Connect campaigns.
 *
 * For Preview dialing mode, only the Amazon Connect outbound campaigns service principal is allowed to assume a
 * role in your account and call this API with OutboundStrategy.
 */
export const startOutboundVoiceContact = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartOutboundVoiceContactRequest,
    output: StartOutboundVoiceContactResponse,
    errors: [
      DestinationNotAllowedException,
      InternalServiceException,
      InvalidParameterException,
      InvalidRequestException,
      LimitExceededException,
      OutboundContactNotPermittedException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Describes a contact evaluation in the specified Amazon Connect instance.
 */
export const describeContactEvaluation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeContactEvaluationRequest,
    output: DescribeContactEvaluationResponse,
    errors: [
      InternalServiceException,
      InvalidParameterException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);

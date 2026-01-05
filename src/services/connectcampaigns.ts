import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "ConnectCampaigns",
  serviceShapeName: "AmazonConnectCampaignService",
});
const auth = T.AwsAuthSigv4({ name: "connect-campaigns" });
const ver = T.ServiceVersion("2021-01-30");
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
                        url: "https://connect-campaigns-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://connect-campaigns-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://connect-campaigns.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://connect-campaigns.{Region}.{PartitionResult#dnsSuffix}",
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
export const CampaignIdList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class DeleteCampaignRequest extends S.Class<DeleteCampaignRequest>(
  "DeleteCampaignRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/campaigns/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCampaignResponse extends S.Class<DeleteCampaignResponse>(
  "DeleteCampaignResponse",
)({}) {}
export class DeleteConnectInstanceConfigRequest extends S.Class<DeleteConnectInstanceConfigRequest>(
  "DeleteConnectInstanceConfigRequest",
)(
  { connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/connect-instance/{connectInstanceId}/config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConnectInstanceConfigResponse extends S.Class<DeleteConnectInstanceConfigResponse>(
  "DeleteConnectInstanceConfigResponse",
)({}) {}
export class DeleteInstanceOnboardingJobRequest extends S.Class<DeleteInstanceOnboardingJobRequest>(
  "DeleteInstanceOnboardingJobRequest",
)(
  { connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/connect-instance/{connectInstanceId}/onboarding",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInstanceOnboardingJobResponse extends S.Class<DeleteInstanceOnboardingJobResponse>(
  "DeleteInstanceOnboardingJobResponse",
)({}) {}
export class DescribeCampaignRequest extends S.Class<DescribeCampaignRequest>(
  "DescribeCampaignRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "GET", uri: "/campaigns/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCampaignStateRequest extends S.Class<GetCampaignStateRequest>(
  "GetCampaignStateRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "GET", uri: "/campaigns/{id}/state" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCampaignStateBatchRequest extends S.Class<GetCampaignStateBatchRequest>(
  "GetCampaignStateBatchRequest",
)(
  { campaignIds: CampaignIdList },
  T.all(
    T.Http({ method: "POST", uri: "/campaigns-state" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConnectInstanceConfigRequest extends S.Class<GetConnectInstanceConfigRequest>(
  "GetConnectInstanceConfigRequest",
)(
  { connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/connect-instance/{connectInstanceId}/config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInstanceOnboardingJobStatusRequest extends S.Class<GetInstanceOnboardingJobStatusRequest>(
  "GetInstanceOnboardingJobStatusRequest",
)(
  { connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/connect-instance/{connectInstanceId}/onboarding",
    }),
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
  { arn: S.String.pipe(T.HttpLabel("arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PauseCampaignRequest extends S.Class<PauseCampaignRequest>(
  "PauseCampaignRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "POST", uri: "/campaigns/{id}/pause" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PauseCampaignResponse extends S.Class<PauseCampaignResponse>(
  "PauseCampaignResponse",
)({}) {}
export class ResumeCampaignRequest extends S.Class<ResumeCampaignRequest>(
  "ResumeCampaignRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "POST", uri: "/campaigns/{id}/resume" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResumeCampaignResponse extends S.Class<ResumeCampaignResponse>(
  "ResumeCampaignResponse",
)({}) {}
export class StartCampaignRequest extends S.Class<StartCampaignRequest>(
  "StartCampaignRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "POST", uri: "/campaigns/{id}/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartCampaignResponse extends S.Class<StartCampaignResponse>(
  "StartCampaignResponse",
)({}) {}
export class StopCampaignRequest extends S.Class<StopCampaignRequest>(
  "StopCampaignRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "POST", uri: "/campaigns/{id}/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopCampaignResponse extends S.Class<StopCampaignResponse>(
  "StopCampaignResponse",
)({}) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { arn: S.String.pipe(T.HttpLabel("arn")), tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{arn}" }),
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
    arn: S.String.pipe(T.HttpLabel("arn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{arn}" }),
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
export class ProgressiveDialerConfig extends S.Class<ProgressiveDialerConfig>(
  "ProgressiveDialerConfig",
)({ bandwidthAllocation: S.Number, dialingCapacity: S.optional(S.Number) }) {}
export class PredictiveDialerConfig extends S.Class<PredictiveDialerConfig>(
  "PredictiveDialerConfig",
)({ bandwidthAllocation: S.Number, dialingCapacity: S.optional(S.Number) }) {}
export class AgentlessDialerConfig extends S.Class<AgentlessDialerConfig>(
  "AgentlessDialerConfig",
)({ dialingCapacity: S.optional(S.Number) }) {}
export const DialerConfig = S.Union(
  S.Struct({ progressiveDialerConfig: ProgressiveDialerConfig }),
  S.Struct({ predictiveDialerConfig: PredictiveDialerConfig }),
  S.Struct({ agentlessDialerConfig: AgentlessDialerConfig }),
);
export class UpdateCampaignDialerConfigRequest extends S.Class<UpdateCampaignDialerConfigRequest>(
  "UpdateCampaignDialerConfigRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")), dialerConfig: DialerConfig },
  T.all(
    T.Http({ method: "POST", uri: "/campaigns/{id}/dialer-config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCampaignDialerConfigResponse extends S.Class<UpdateCampaignDialerConfigResponse>(
  "UpdateCampaignDialerConfigResponse",
)({}) {}
export class UpdateCampaignNameRequest extends S.Class<UpdateCampaignNameRequest>(
  "UpdateCampaignNameRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")), name: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/campaigns/{id}/name" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCampaignNameResponse extends S.Class<UpdateCampaignNameResponse>(
  "UpdateCampaignNameResponse",
)({}) {}
export class AnswerMachineDetectionConfig extends S.Class<AnswerMachineDetectionConfig>(
  "AnswerMachineDetectionConfig",
)({
  enableAnswerMachineDetection: S.Boolean,
  awaitAnswerMachinePrompt: S.optional(S.Boolean),
}) {}
export class OutboundCallConfig extends S.Class<OutboundCallConfig>(
  "OutboundCallConfig",
)({
  connectContactFlowId: S.String,
  connectSourcePhoneNumber: S.optional(S.String),
  connectQueueId: S.optional(S.String),
  answerMachineDetectionConfig: S.optional(AnswerMachineDetectionConfig),
}) {}
export class EncryptionConfig extends S.Class<EncryptionConfig>(
  "EncryptionConfig",
)({
  enabled: S.Boolean,
  encryptionType: S.optional(S.String),
  keyArn: S.optional(S.String),
}) {}
export class GetCampaignStateResponse extends S.Class<GetCampaignStateResponse>(
  "GetCampaignStateResponse",
)({ state: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class StartInstanceOnboardingJobRequest extends S.Class<StartInstanceOnboardingJobRequest>(
  "StartInstanceOnboardingJobRequest",
)(
  {
    connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")),
    encryptionConfig: EncryptionConfig,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/connect-instance/{connectInstanceId}/onboarding",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCampaignOutboundCallConfigRequest extends S.Class<UpdateCampaignOutboundCallConfigRequest>(
  "UpdateCampaignOutboundCallConfigRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    connectContactFlowId: S.optional(S.String),
    connectSourcePhoneNumber: S.optional(S.String),
    answerMachineDetectionConfig: S.optional(AnswerMachineDetectionConfig),
  },
  T.all(
    T.Http({ method: "POST", uri: "/campaigns/{id}/outbound-call-config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCampaignOutboundCallConfigResponse extends S.Class<UpdateCampaignOutboundCallConfigResponse>(
  "UpdateCampaignOutboundCallConfigResponse",
)({}) {}
export class InstanceIdFilter extends S.Class<InstanceIdFilter>(
  "InstanceIdFilter",
)({ value: S.String, operator: S.String }) {}
export const Attributes = S.Record({ key: S.String, value: S.String });
export class Campaign extends S.Class<Campaign>("Campaign")({
  id: S.String,
  arn: S.String,
  name: S.String,
  connectInstanceId: S.String,
  dialerConfig: DialerConfig,
  outboundCallConfig: OutboundCallConfig,
  tags: S.optional(TagMap),
}) {}
export class SuccessfulCampaignStateResponse extends S.Class<SuccessfulCampaignStateResponse>(
  "SuccessfulCampaignStateResponse",
)({ campaignId: S.optional(S.String), state: S.optional(S.String) }) {}
export const SuccessfulCampaignStateResponseList = S.Array(
  SuccessfulCampaignStateResponse,
);
export class FailedCampaignStateResponse extends S.Class<FailedCampaignStateResponse>(
  "FailedCampaignStateResponse",
)({ campaignId: S.optional(S.String), failureCode: S.optional(S.String) }) {}
export const FailedCampaignStateResponseList = S.Array(
  FailedCampaignStateResponse,
);
export class InstanceConfig extends S.Class<InstanceConfig>("InstanceConfig")({
  connectInstanceId: S.String,
  serviceLinkedRoleArn: S.String,
  encryptionConfig: EncryptionConfig,
}) {}
export class InstanceOnboardingJobStatus extends S.Class<InstanceOnboardingJobStatus>(
  "InstanceOnboardingJobStatus",
)({
  connectInstanceId: S.String,
  status: S.String,
  failureCode: S.optional(S.String),
}) {}
export class CampaignFilters extends S.Class<CampaignFilters>(
  "CampaignFilters",
)({ instanceIdFilter: S.optional(InstanceIdFilter) }) {}
export class DialRequest extends S.Class<DialRequest>("DialRequest")({
  clientToken: S.String,
  phoneNumber: S.String,
  expirationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  attributes: Attributes,
}) {}
export const DialRequestList = S.Array(DialRequest);
export class CreateCampaignRequest extends S.Class<CreateCampaignRequest>(
  "CreateCampaignRequest",
)(
  {
    name: S.String,
    connectInstanceId: S.String,
    dialerConfig: DialerConfig,
    outboundCallConfig: OutboundCallConfig,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/campaigns" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeCampaignResponse extends S.Class<DescribeCampaignResponse>(
  "DescribeCampaignResponse",
)({ campaign: S.optional(Campaign) }) {}
export class GetCampaignStateBatchResponse extends S.Class<GetCampaignStateBatchResponse>(
  "GetCampaignStateBatchResponse",
)({
  successfulRequests: S.optional(SuccessfulCampaignStateResponseList),
  failedRequests: S.optional(FailedCampaignStateResponseList),
}) {}
export class GetConnectInstanceConfigResponse extends S.Class<GetConnectInstanceConfigResponse>(
  "GetConnectInstanceConfigResponse",
)({ connectInstanceConfig: S.optional(InstanceConfig) }) {}
export class GetInstanceOnboardingJobStatusResponse extends S.Class<GetInstanceOnboardingJobStatusResponse>(
  "GetInstanceOnboardingJobStatusResponse",
)({
  connectInstanceOnboardingJobStatus: S.optional(InstanceOnboardingJobStatus),
}) {}
export class ListCampaignsRequest extends S.Class<ListCampaignsRequest>(
  "ListCampaignsRequest",
)(
  {
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    filters: S.optional(CampaignFilters),
  },
  T.all(
    T.Http({ method: "POST", uri: "/campaigns-summary" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutDialRequestBatchRequest extends S.Class<PutDialRequestBatchRequest>(
  "PutDialRequestBatchRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")), dialRequests: DialRequestList },
  T.all(
    T.Http({ method: "PUT", uri: "/campaigns/{id}/dial-requests" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartInstanceOnboardingJobResponse extends S.Class<StartInstanceOnboardingJobResponse>(
  "StartInstanceOnboardingJobResponse",
)({
  connectInstanceOnboardingJobStatus: S.optional(InstanceOnboardingJobStatus),
}) {}
export class CreateCampaignResponse extends S.Class<CreateCampaignResponse>(
  "CreateCampaignResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export class CampaignSummary extends S.Class<CampaignSummary>(
  "CampaignSummary",
)({
  id: S.String,
  arn: S.String,
  name: S.String,
  connectInstanceId: S.String,
}) {}
export const CampaignSummaryList = S.Array(CampaignSummary);
export class SuccessfulRequest extends S.Class<SuccessfulRequest>(
  "SuccessfulRequest",
)({ clientToken: S.optional(S.String), id: S.optional(S.String) }) {}
export const SuccessfulRequestList = S.Array(SuccessfulRequest);
export class FailedRequest extends S.Class<FailedRequest>("FailedRequest")({
  clientToken: S.optional(S.String),
  id: S.optional(S.String),
  failureCode: S.optional(S.String),
}) {}
export const FailedRequestList = S.Array(FailedRequest);
export class ListCampaignsResponse extends S.Class<ListCampaignsResponse>(
  "ListCampaignsResponse",
)({
  nextToken: S.optional(S.String),
  campaignSummaryList: S.optional(CampaignSummaryList),
}) {}
export class PutDialRequestBatchResponse extends S.Class<PutDialRequestBatchResponse>(
  "PutDialRequestBatchResponse",
)({
  successfulRequests: S.optional(SuccessfulRequestList),
  failedRequests: S.optional(FailedRequestList),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class InvalidCampaignStateException extends S.TaggedError<InvalidCampaignStateException>()(
  "InvalidCampaignStateException",
  {
    state: S.String,
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}

//# Operations
/**
 * Deletes a campaign from the specified Amazon Connect account.
 */
export const deleteCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCampaignRequest,
  output: DeleteCampaignResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Provides summary information about the campaigns under the specified Amazon Connect account.
 */
export const listCampaigns = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListCampaignsRequest,
    output: ListCampaignsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "campaignSummaryList",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Creates dials requests for the specified campaign Amazon Connect account. This API is idempotent.
 */
export const putDialRequestBatch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDialRequestBatchRequest,
  output: PutDialRequestBatchResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidCampaignStateException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a campaign for the specified Amazon Connect account. This API is idempotent.
 */
export const createCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCampaignRequest,
  output: CreateCampaignResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get state of campaigns for the specified Amazon Connect account.
 */
export const getCampaignStateBatch = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCampaignStateBatchRequest,
    output: GetCampaignStateBatchResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a connect instance config from the specified AWS account.
 */
export const deleteConnectInstanceConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteConnectInstanceConfigRequest,
    output: DeleteConnectInstanceConfigResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidStateException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Describes the specific campaign.
 */
export const describeCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCampaignRequest,
  output: DescribeCampaignResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Get the specific Connect instance config.
 */
export const getConnectInstanceConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetConnectInstanceConfigRequest,
    output: GetConnectInstanceConfigResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Get the specific instance onboarding job status.
 */
export const getInstanceOnboardingJobStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetInstanceOnboardingJobStatusRequest,
    output: GetInstanceOnboardingJobStatusResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Updates the outbound call config of a campaign. This API is idempotent.
 */
export const updateCampaignOutboundCallConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateCampaignOutboundCallConfigRequest,
    output: UpdateCampaignOutboundCallConfigResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Get state of a campaign for the specified Amazon Connect account.
 */
export const getCampaignState = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCampaignStateRequest,
  output: GetCampaignStateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List tags for a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Tag a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Untag a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the dialer config of a campaign. This API is idempotent.
 */
export const updateCampaignDialerConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateCampaignDialerConfigRequest,
    output: UpdateCampaignDialerConfigResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the name of a campaign. This API is idempotent.
 */
export const updateCampaignName = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCampaignNameRequest,
  output: UpdateCampaignNameResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Onboard the specific Amazon Connect instance to Connect Campaigns.
 */
export const startInstanceOnboardingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartInstanceOnboardingJobRequest,
    output: StartInstanceOnboardingJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Pauses a campaign for the specified Amazon Connect account.
 */
export const pauseCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PauseCampaignRequest,
  output: PauseCampaignResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidCampaignStateException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete the Connect Campaigns onboarding job for the specified Amazon Connect instance.
 */
export const deleteInstanceOnboardingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteInstanceOnboardingJobRequest,
    output: DeleteInstanceOnboardingJobResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidStateException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Stops a campaign for the specified Amazon Connect account.
 */
export const resumeCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResumeCampaignRequest,
  output: ResumeCampaignResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidCampaignStateException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a campaign for the specified Amazon Connect account.
 */
export const startCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCampaignRequest,
  output: StartCampaignResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidCampaignStateException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stops a campaign for the specified Amazon Connect account.
 */
export const stopCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopCampaignRequest,
  output: StopCampaignResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidCampaignStateException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

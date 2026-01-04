import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Pinpoint Email",
  serviceShapeName: "AmazonPinpointEmailService",
});
const auth = T.AwsAuthSigv4({ name: "ses" });
const ver = T.ServiceVersion("2018-07-26");
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
                        url: "https://email-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://email-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://email.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://email.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetAccountRequest extends S.Class<GetAccountRequest>(
  "GetAccountRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/v1/email/account" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDeliverabilityDashboardOptionsRequest extends S.Class<GetDeliverabilityDashboardOptionsRequest>(
  "GetDeliverabilityDashboardOptionsRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/v1/email/deliverability-dashboard" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const BlacklistItemNames = S.Array(S.String);
export const EmailAddressList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateDedicatedIpPoolRequest extends S.Class<CreateDedicatedIpPoolRequest>(
  "CreateDedicatedIpPoolRequest",
)(
  { PoolName: S.String, Tags: S.optional(TagList) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/email/dedicated-ip-pools" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDedicatedIpPoolResponse extends S.Class<CreateDedicatedIpPoolResponse>(
  "CreateDedicatedIpPoolResponse",
)({}) {}
export class CreateEmailIdentityRequest extends S.Class<CreateEmailIdentityRequest>(
  "CreateEmailIdentityRequest",
)(
  { EmailIdentity: S.String, Tags: S.optional(TagList) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/email/identities" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfigurationSetRequest extends S.Class<DeleteConfigurationSetRequest>(
  "DeleteConfigurationSetRequest",
)(
  { ConfigurationSetName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/email/configuration-sets/{ConfigurationSetName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfigurationSetResponse extends S.Class<DeleteConfigurationSetResponse>(
  "DeleteConfigurationSetResponse",
)({}) {}
export class DeleteConfigurationSetEventDestinationRequest extends S.Class<DeleteConfigurationSetEventDestinationRequest>(
  "DeleteConfigurationSetEventDestinationRequest",
)(
  {
    ConfigurationSetName: S.String.pipe(T.HttpLabel()),
    EventDestinationName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/email/configuration-sets/{ConfigurationSetName}/event-destinations/{EventDestinationName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfigurationSetEventDestinationResponse extends S.Class<DeleteConfigurationSetEventDestinationResponse>(
  "DeleteConfigurationSetEventDestinationResponse",
)({}) {}
export class DeleteDedicatedIpPoolRequest extends S.Class<DeleteDedicatedIpPoolRequest>(
  "DeleteDedicatedIpPoolRequest",
)(
  { PoolName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/email/dedicated-ip-pools/{PoolName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDedicatedIpPoolResponse extends S.Class<DeleteDedicatedIpPoolResponse>(
  "DeleteDedicatedIpPoolResponse",
)({}) {}
export class DeleteEmailIdentityRequest extends S.Class<DeleteEmailIdentityRequest>(
  "DeleteEmailIdentityRequest",
)(
  { EmailIdentity: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/email/identities/{EmailIdentity}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEmailIdentityResponse extends S.Class<DeleteEmailIdentityResponse>(
  "DeleteEmailIdentityResponse",
)({}) {}
export class GetBlacklistReportsRequest extends S.Class<GetBlacklistReportsRequest>(
  "GetBlacklistReportsRequest",
)(
  {
    BlacklistItemNames: BlacklistItemNames.pipe(
      T.HttpQuery("BlacklistItemNames"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/email/deliverability-dashboard/blacklist-report",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConfigurationSetRequest extends S.Class<GetConfigurationSetRequest>(
  "GetConfigurationSetRequest",
)(
  { ConfigurationSetName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/email/configuration-sets/{ConfigurationSetName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConfigurationSetEventDestinationsRequest extends S.Class<GetConfigurationSetEventDestinationsRequest>(
  "GetConfigurationSetEventDestinationsRequest",
)(
  { ConfigurationSetName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/email/configuration-sets/{ConfigurationSetName}/event-destinations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDedicatedIpRequest extends S.Class<GetDedicatedIpRequest>(
  "GetDedicatedIpRequest",
)(
  { Ip: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/email/dedicated-ips/{Ip}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDedicatedIpsRequest extends S.Class<GetDedicatedIpsRequest>(
  "GetDedicatedIpsRequest",
)(
  {
    PoolName: S.optional(S.String).pipe(T.HttpQuery("PoolName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PageSize: S.optional(S.Number).pipe(T.HttpQuery("PageSize")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/email/dedicated-ips" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDeliverabilityTestReportRequest extends S.Class<GetDeliverabilityTestReportRequest>(
  "GetDeliverabilityTestReportRequest",
)(
  { ReportId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/email/deliverability-dashboard/test-reports/{ReportId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDomainDeliverabilityCampaignRequest extends S.Class<GetDomainDeliverabilityCampaignRequest>(
  "GetDomainDeliverabilityCampaignRequest",
)(
  { CampaignId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/email/deliverability-dashboard/campaigns/{CampaignId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDomainStatisticsReportRequest extends S.Class<GetDomainStatisticsReportRequest>(
  "GetDomainStatisticsReportRequest",
)(
  {
    Domain: S.String.pipe(T.HttpLabel()),
    StartDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("StartDate"),
    ),
    EndDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("EndDate"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/email/deliverability-dashboard/statistics-report/{Domain}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEmailIdentityRequest extends S.Class<GetEmailIdentityRequest>(
  "GetEmailIdentityRequest",
)(
  { EmailIdentity: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/email/identities/{EmailIdentity}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConfigurationSetsRequest extends S.Class<ListConfigurationSetsRequest>(
  "ListConfigurationSetsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PageSize: S.optional(S.Number).pipe(T.HttpQuery("PageSize")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/email/configuration-sets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDedicatedIpPoolsRequest extends S.Class<ListDedicatedIpPoolsRequest>(
  "ListDedicatedIpPoolsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PageSize: S.optional(S.Number).pipe(T.HttpQuery("PageSize")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/email/dedicated-ip-pools" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDeliverabilityTestReportsRequest extends S.Class<ListDeliverabilityTestReportsRequest>(
  "ListDeliverabilityTestReportsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PageSize: S.optional(S.Number).pipe(T.HttpQuery("PageSize")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/email/deliverability-dashboard/test-reports",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDomainDeliverabilityCampaignsRequest extends S.Class<ListDomainDeliverabilityCampaignsRequest>(
  "ListDomainDeliverabilityCampaignsRequest",
)(
  {
    StartDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("StartDate"),
    ),
    EndDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("EndDate"),
    ),
    SubscribedDomain: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PageSize: S.optional(S.Number).pipe(T.HttpQuery("PageSize")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/email/deliverability-dashboard/domains/{SubscribedDomain}/campaigns",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEmailIdentitiesRequest extends S.Class<ListEmailIdentitiesRequest>(
  "ListEmailIdentitiesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PageSize: S.optional(S.Number).pipe(T.HttpQuery("PageSize")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/email/identities" }),
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
  { ResourceArn: S.String.pipe(T.HttpQuery("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/email/tags" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutAccountDedicatedIpWarmupAttributesRequest extends S.Class<PutAccountDedicatedIpWarmupAttributesRequest>(
  "PutAccountDedicatedIpWarmupAttributesRequest",
)(
  { AutoWarmupEnabled: S.optional(S.Boolean) },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/email/account/dedicated-ips/warmup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutAccountDedicatedIpWarmupAttributesResponse extends S.Class<PutAccountDedicatedIpWarmupAttributesResponse>(
  "PutAccountDedicatedIpWarmupAttributesResponse",
)({}) {}
export class PutAccountSendingAttributesRequest extends S.Class<PutAccountSendingAttributesRequest>(
  "PutAccountSendingAttributesRequest",
)(
  { SendingEnabled: S.optional(S.Boolean) },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/email/account/sending" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutAccountSendingAttributesResponse extends S.Class<PutAccountSendingAttributesResponse>(
  "PutAccountSendingAttributesResponse",
)({}) {}
export class PutConfigurationSetDeliveryOptionsRequest extends S.Class<PutConfigurationSetDeliveryOptionsRequest>(
  "PutConfigurationSetDeliveryOptionsRequest",
)(
  {
    ConfigurationSetName: S.String.pipe(T.HttpLabel()),
    TlsPolicy: S.optional(S.String),
    SendingPoolName: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/email/configuration-sets/{ConfigurationSetName}/delivery-options",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutConfigurationSetDeliveryOptionsResponse extends S.Class<PutConfigurationSetDeliveryOptionsResponse>(
  "PutConfigurationSetDeliveryOptionsResponse",
)({}) {}
export class PutConfigurationSetReputationOptionsRequest extends S.Class<PutConfigurationSetReputationOptionsRequest>(
  "PutConfigurationSetReputationOptionsRequest",
)(
  {
    ConfigurationSetName: S.String.pipe(T.HttpLabel()),
    ReputationMetricsEnabled: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/email/configuration-sets/{ConfigurationSetName}/reputation-options",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutConfigurationSetReputationOptionsResponse extends S.Class<PutConfigurationSetReputationOptionsResponse>(
  "PutConfigurationSetReputationOptionsResponse",
)({}) {}
export class PutConfigurationSetSendingOptionsRequest extends S.Class<PutConfigurationSetSendingOptionsRequest>(
  "PutConfigurationSetSendingOptionsRequest",
)(
  {
    ConfigurationSetName: S.String.pipe(T.HttpLabel()),
    SendingEnabled: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/email/configuration-sets/{ConfigurationSetName}/sending",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutConfigurationSetSendingOptionsResponse extends S.Class<PutConfigurationSetSendingOptionsResponse>(
  "PutConfigurationSetSendingOptionsResponse",
)({}) {}
export class PutConfigurationSetTrackingOptionsRequest extends S.Class<PutConfigurationSetTrackingOptionsRequest>(
  "PutConfigurationSetTrackingOptionsRequest",
)(
  {
    ConfigurationSetName: S.String.pipe(T.HttpLabel()),
    CustomRedirectDomain: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/email/configuration-sets/{ConfigurationSetName}/tracking-options",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutConfigurationSetTrackingOptionsResponse extends S.Class<PutConfigurationSetTrackingOptionsResponse>(
  "PutConfigurationSetTrackingOptionsResponse",
)({}) {}
export class PutDedicatedIpInPoolRequest extends S.Class<PutDedicatedIpInPoolRequest>(
  "PutDedicatedIpInPoolRequest",
)(
  { Ip: S.String.pipe(T.HttpLabel()), DestinationPoolName: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/email/dedicated-ips/{Ip}/pool" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutDedicatedIpInPoolResponse extends S.Class<PutDedicatedIpInPoolResponse>(
  "PutDedicatedIpInPoolResponse",
)({}) {}
export class PutDedicatedIpWarmupAttributesRequest extends S.Class<PutDedicatedIpWarmupAttributesRequest>(
  "PutDedicatedIpWarmupAttributesRequest",
)(
  { Ip: S.String.pipe(T.HttpLabel()), WarmupPercentage: S.Number },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/email/dedicated-ips/{Ip}/warmup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutDedicatedIpWarmupAttributesResponse extends S.Class<PutDedicatedIpWarmupAttributesResponse>(
  "PutDedicatedIpWarmupAttributesResponse",
)({}) {}
export const IspNameList = S.Array(S.String);
export class InboxPlacementTrackingOption extends S.Class<InboxPlacementTrackingOption>(
  "InboxPlacementTrackingOption",
)({ Global: S.optional(S.Boolean), TrackedIsps: S.optional(IspNameList) }) {}
export class DomainDeliverabilityTrackingOption extends S.Class<DomainDeliverabilityTrackingOption>(
  "DomainDeliverabilityTrackingOption",
)({
  Domain: S.optional(S.String),
  SubscriptionStartDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  InboxPlacementTrackingOption: S.optional(InboxPlacementTrackingOption),
}) {}
export const DomainDeliverabilityTrackingOptions = S.Array(
  DomainDeliverabilityTrackingOption,
);
export class PutDeliverabilityDashboardOptionRequest extends S.Class<PutDeliverabilityDashboardOptionRequest>(
  "PutDeliverabilityDashboardOptionRequest",
)(
  {
    DashboardEnabled: S.Boolean,
    SubscribedDomains: S.optional(DomainDeliverabilityTrackingOptions),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/email/deliverability-dashboard" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutDeliverabilityDashboardOptionResponse extends S.Class<PutDeliverabilityDashboardOptionResponse>(
  "PutDeliverabilityDashboardOptionResponse",
)({}) {}
export class PutEmailIdentityDkimAttributesRequest extends S.Class<PutEmailIdentityDkimAttributesRequest>(
  "PutEmailIdentityDkimAttributesRequest",
)(
  {
    EmailIdentity: S.String.pipe(T.HttpLabel()),
    SigningEnabled: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/email/identities/{EmailIdentity}/dkim" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutEmailIdentityDkimAttributesResponse extends S.Class<PutEmailIdentityDkimAttributesResponse>(
  "PutEmailIdentityDkimAttributesResponse",
)({}) {}
export class PutEmailIdentityFeedbackAttributesRequest extends S.Class<PutEmailIdentityFeedbackAttributesRequest>(
  "PutEmailIdentityFeedbackAttributesRequest",
)(
  {
    EmailIdentity: S.String.pipe(T.HttpLabel()),
    EmailForwardingEnabled: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/email/identities/{EmailIdentity}/feedback",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutEmailIdentityFeedbackAttributesResponse extends S.Class<PutEmailIdentityFeedbackAttributesResponse>(
  "PutEmailIdentityFeedbackAttributesResponse",
)({}) {}
export class PutEmailIdentityMailFromAttributesRequest extends S.Class<PutEmailIdentityMailFromAttributesRequest>(
  "PutEmailIdentityMailFromAttributesRequest",
)(
  {
    EmailIdentity: S.String.pipe(T.HttpLabel()),
    MailFromDomain: S.optional(S.String),
    BehaviorOnMxFailure: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/email/identities/{EmailIdentity}/mail-from",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutEmailIdentityMailFromAttributesResponse extends S.Class<PutEmailIdentityMailFromAttributesResponse>(
  "PutEmailIdentityMailFromAttributesResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, Tags: TagList },
  T.all(
    T.Http({ method: "POST", uri: "/v1/email/tags" }),
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
    ResourceArn: S.String.pipe(T.HttpQuery("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("TagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/email/tags" }),
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
export const EventTypes = S.Array(S.String);
export class KinesisFirehoseDestination extends S.Class<KinesisFirehoseDestination>(
  "KinesisFirehoseDestination",
)({ IamRoleArn: S.String, DeliveryStreamArn: S.String }) {}
export class CloudWatchDimensionConfiguration extends S.Class<CloudWatchDimensionConfiguration>(
  "CloudWatchDimensionConfiguration",
)({
  DimensionName: S.String,
  DimensionValueSource: S.String,
  DefaultDimensionValue: S.String,
}) {}
export const CloudWatchDimensionConfigurations = S.Array(
  CloudWatchDimensionConfiguration,
);
export class CloudWatchDestination extends S.Class<CloudWatchDestination>(
  "CloudWatchDestination",
)({ DimensionConfigurations: CloudWatchDimensionConfigurations }) {}
export class SnsDestination extends S.Class<SnsDestination>("SnsDestination")({
  TopicArn: S.String,
}) {}
export class PinpointDestination extends S.Class<PinpointDestination>(
  "PinpointDestination",
)({ ApplicationArn: S.optional(S.String) }) {}
export class EventDestinationDefinition extends S.Class<EventDestinationDefinition>(
  "EventDestinationDefinition",
)({
  Enabled: S.optional(S.Boolean),
  MatchingEventTypes: S.optional(EventTypes),
  KinesisFirehoseDestination: S.optional(KinesisFirehoseDestination),
  CloudWatchDestination: S.optional(CloudWatchDestination),
  SnsDestination: S.optional(SnsDestination),
  PinpointDestination: S.optional(PinpointDestination),
}) {}
export class UpdateConfigurationSetEventDestinationRequest extends S.Class<UpdateConfigurationSetEventDestinationRequest>(
  "UpdateConfigurationSetEventDestinationRequest",
)(
  {
    ConfigurationSetName: S.String.pipe(T.HttpLabel()),
    EventDestinationName: S.String.pipe(T.HttpLabel()),
    EventDestination: EventDestinationDefinition,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/email/configuration-sets/{ConfigurationSetName}/event-destinations/{EventDestinationName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateConfigurationSetEventDestinationResponse extends S.Class<UpdateConfigurationSetEventDestinationResponse>(
  "UpdateConfigurationSetEventDestinationResponse",
)({}) {}
export class TrackingOptions extends S.Class<TrackingOptions>(
  "TrackingOptions",
)({ CustomRedirectDomain: S.String }) {}
export class DeliveryOptions extends S.Class<DeliveryOptions>(
  "DeliveryOptions",
)({ TlsPolicy: S.optional(S.String), SendingPoolName: S.optional(S.String) }) {}
export class ReputationOptions extends S.Class<ReputationOptions>(
  "ReputationOptions",
)({
  ReputationMetricsEnabled: S.optional(S.Boolean),
  LastFreshStart: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class SendingOptions extends S.Class<SendingOptions>("SendingOptions")({
  SendingEnabled: S.optional(S.Boolean),
}) {}
export class SendQuota extends S.Class<SendQuota>("SendQuota")({
  Max24HourSend: S.optional(S.Number),
  MaxSendRate: S.optional(S.Number),
  SentLast24Hours: S.optional(S.Number),
}) {}
export class DedicatedIp extends S.Class<DedicatedIp>("DedicatedIp")({
  Ip: S.String,
  WarmupStatus: S.String,
  WarmupPercentage: S.Number,
  PoolName: S.optional(S.String),
}) {}
export const DedicatedIpList = S.Array(DedicatedIp);
export const ConfigurationSetNameList = S.Array(S.String);
export const ListOfDedicatedIpPools = S.Array(S.String);
export class DeliverabilityTestReport extends S.Class<DeliverabilityTestReport>(
  "DeliverabilityTestReport",
)({
  ReportId: S.optional(S.String),
  ReportName: S.optional(S.String),
  Subject: S.optional(S.String),
  FromEmailAddress: S.optional(S.String),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeliverabilityTestStatus: S.optional(S.String),
}) {}
export const DeliverabilityTestReports = S.Array(DeliverabilityTestReport);
export const IpList = S.Array(S.String);
export const Esps = S.Array(S.String);
export class DomainDeliverabilityCampaign extends S.Class<DomainDeliverabilityCampaign>(
  "DomainDeliverabilityCampaign",
)({
  CampaignId: S.optional(S.String),
  ImageUrl: S.optional(S.String),
  Subject: S.optional(S.String),
  FromAddress: S.optional(S.String),
  SendingIps: S.optional(IpList),
  FirstSeenDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastSeenDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InboxCount: S.optional(S.Number),
  SpamCount: S.optional(S.Number),
  ReadRate: S.optional(S.Number),
  DeleteRate: S.optional(S.Number),
  ReadDeleteRate: S.optional(S.Number),
  ProjectedVolume: S.optional(S.Number),
  Esps: S.optional(Esps),
}) {}
export const DomainDeliverabilityCampaignList = S.Array(
  DomainDeliverabilityCampaign,
);
export class Destination extends S.Class<Destination>("Destination")({
  ToAddresses: S.optional(EmailAddressList),
  CcAddresses: S.optional(EmailAddressList),
  BccAddresses: S.optional(EmailAddressList),
}) {}
export class MessageTag extends S.Class<MessageTag>("MessageTag")({
  Name: S.String,
  Value: S.String,
}) {}
export const MessageTagList = S.Array(MessageTag);
export class CreateConfigurationSetRequest extends S.Class<CreateConfigurationSetRequest>(
  "CreateConfigurationSetRequest",
)(
  {
    ConfigurationSetName: S.String,
    TrackingOptions: S.optional(TrackingOptions),
    DeliveryOptions: S.optional(DeliveryOptions),
    ReputationOptions: S.optional(ReputationOptions),
    SendingOptions: S.optional(SendingOptions),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/email/configuration-sets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateConfigurationSetResponse extends S.Class<CreateConfigurationSetResponse>(
  "CreateConfigurationSetResponse",
)({}) {}
export class GetAccountResponse extends S.Class<GetAccountResponse>(
  "GetAccountResponse",
)({
  SendQuota: S.optional(SendQuota),
  SendingEnabled: S.optional(S.Boolean),
  DedicatedIpAutoWarmupEnabled: S.optional(S.Boolean),
  EnforcementStatus: S.optional(S.String),
  ProductionAccessEnabled: S.optional(S.Boolean),
}) {}
export class GetConfigurationSetResponse extends S.Class<GetConfigurationSetResponse>(
  "GetConfigurationSetResponse",
)({
  ConfigurationSetName: S.optional(S.String),
  TrackingOptions: S.optional(TrackingOptions),
  DeliveryOptions: S.optional(DeliveryOptions),
  ReputationOptions: S.optional(ReputationOptions),
  SendingOptions: S.optional(SendingOptions),
  Tags: S.optional(TagList),
}) {}
export class GetDedicatedIpsResponse extends S.Class<GetDedicatedIpsResponse>(
  "GetDedicatedIpsResponse",
)({
  DedicatedIps: S.optional(DedicatedIpList),
  NextToken: S.optional(S.String),
}) {}
export class ListConfigurationSetsResponse extends S.Class<ListConfigurationSetsResponse>(
  "ListConfigurationSetsResponse",
)({
  ConfigurationSets: S.optional(ConfigurationSetNameList),
  NextToken: S.optional(S.String),
}) {}
export class ListDedicatedIpPoolsResponse extends S.Class<ListDedicatedIpPoolsResponse>(
  "ListDedicatedIpPoolsResponse",
)({
  DedicatedIpPools: S.optional(ListOfDedicatedIpPools),
  NextToken: S.optional(S.String),
}) {}
export class ListDeliverabilityTestReportsResponse extends S.Class<ListDeliverabilityTestReportsResponse>(
  "ListDeliverabilityTestReportsResponse",
)({
  DeliverabilityTestReports: DeliverabilityTestReports,
  NextToken: S.optional(S.String),
}) {}
export class ListDomainDeliverabilityCampaignsResponse extends S.Class<ListDomainDeliverabilityCampaignsResponse>(
  "ListDomainDeliverabilityCampaignsResponse",
)({
  DomainDeliverabilityCampaigns: DomainDeliverabilityCampaignList,
  NextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: TagList }) {}
export class Content extends S.Class<Content>("Content")({
  Data: S.String,
  Charset: S.optional(S.String),
}) {}
export class Body extends S.Class<Body>("Body")({
  Text: S.optional(Content),
  Html: S.optional(Content),
}) {}
export class Message extends S.Class<Message>("Message")({
  Subject: Content,
  Body: Body,
}) {}
export class RawMessage extends S.Class<RawMessage>("RawMessage")({
  Data: T.Blob,
}) {}
export class Template extends S.Class<Template>("Template")({
  TemplateArn: S.optional(S.String),
  TemplateData: S.optional(S.String),
}) {}
export class EmailContent extends S.Class<EmailContent>("EmailContent")({
  Simple: S.optional(Message),
  Raw: S.optional(RawMessage),
  Template: S.optional(Template),
}) {}
export class SendEmailRequest extends S.Class<SendEmailRequest>(
  "SendEmailRequest",
)(
  {
    FromEmailAddress: S.optional(S.String),
    Destination: Destination,
    ReplyToAddresses: S.optional(EmailAddressList),
    FeedbackForwardingEmailAddress: S.optional(S.String),
    Content: EmailContent,
    EmailTags: S.optional(MessageTagList),
    ConfigurationSetName: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/email/outbound-emails" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const DnsTokenList = S.Array(S.String);
export class DkimAttributes extends S.Class<DkimAttributes>("DkimAttributes")({
  SigningEnabled: S.optional(S.Boolean),
  Status: S.optional(S.String),
  Tokens: S.optional(DnsTokenList),
}) {}
export class EventDestination extends S.Class<EventDestination>(
  "EventDestination",
)({
  Name: S.String,
  Enabled: S.optional(S.Boolean),
  MatchingEventTypes: EventTypes,
  KinesisFirehoseDestination: S.optional(KinesisFirehoseDestination),
  CloudWatchDestination: S.optional(CloudWatchDestination),
  SnsDestination: S.optional(SnsDestination),
  PinpointDestination: S.optional(PinpointDestination),
}) {}
export const EventDestinations = S.Array(EventDestination);
export class PlacementStatistics extends S.Class<PlacementStatistics>(
  "PlacementStatistics",
)({
  InboxPercentage: S.optional(S.Number),
  SpamPercentage: S.optional(S.Number),
  MissingPercentage: S.optional(S.Number),
  SpfPercentage: S.optional(S.Number),
  DkimPercentage: S.optional(S.Number),
}) {}
export class IspPlacement extends S.Class<IspPlacement>("IspPlacement")({
  IspName: S.optional(S.String),
  PlacementStatistics: S.optional(PlacementStatistics),
}) {}
export const IspPlacements = S.Array(IspPlacement);
export class VolumeStatistics extends S.Class<VolumeStatistics>(
  "VolumeStatistics",
)({
  InboxRawCount: S.optional(S.Number),
  SpamRawCount: S.optional(S.Number),
  ProjectedInbox: S.optional(S.Number),
  ProjectedSpam: S.optional(S.Number),
}) {}
export class DomainIspPlacement extends S.Class<DomainIspPlacement>(
  "DomainIspPlacement",
)({
  IspName: S.optional(S.String),
  InboxRawCount: S.optional(S.Number),
  SpamRawCount: S.optional(S.Number),
  InboxPercentage: S.optional(S.Number),
  SpamPercentage: S.optional(S.Number),
}) {}
export const DomainIspPlacements = S.Array(DomainIspPlacement);
export class DailyVolume extends S.Class<DailyVolume>("DailyVolume")({
  StartDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  VolumeStatistics: S.optional(VolumeStatistics),
  DomainIspPlacements: S.optional(DomainIspPlacements),
}) {}
export const DailyVolumes = S.Array(DailyVolume);
export class MailFromAttributes extends S.Class<MailFromAttributes>(
  "MailFromAttributes",
)({
  MailFromDomain: S.String,
  MailFromDomainStatus: S.String,
  BehaviorOnMxFailure: S.String,
}) {}
export class IdentityInfo extends S.Class<IdentityInfo>("IdentityInfo")({
  IdentityType: S.optional(S.String),
  IdentityName: S.optional(S.String),
  SendingEnabled: S.optional(S.Boolean),
}) {}
export const IdentityInfoList = S.Array(IdentityInfo);
export class CreateEmailIdentityResponse extends S.Class<CreateEmailIdentityResponse>(
  "CreateEmailIdentityResponse",
)({
  IdentityType: S.optional(S.String),
  VerifiedForSendingStatus: S.optional(S.Boolean),
  DkimAttributes: S.optional(DkimAttributes),
}) {}
export class GetConfigurationSetEventDestinationsResponse extends S.Class<GetConfigurationSetEventDestinationsResponse>(
  "GetConfigurationSetEventDestinationsResponse",
)({ EventDestinations: S.optional(EventDestinations) }) {}
export class GetDedicatedIpResponse extends S.Class<GetDedicatedIpResponse>(
  "GetDedicatedIpResponse",
)({ DedicatedIp: S.optional(DedicatedIp) }) {}
export class GetDeliverabilityDashboardOptionsResponse extends S.Class<GetDeliverabilityDashboardOptionsResponse>(
  "GetDeliverabilityDashboardOptionsResponse",
)({
  DashboardEnabled: S.Boolean,
  SubscriptionExpiryDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AccountStatus: S.optional(S.String),
  ActiveSubscribedDomains: S.optional(DomainDeliverabilityTrackingOptions),
  PendingExpirationSubscribedDomains: S.optional(
    DomainDeliverabilityTrackingOptions,
  ),
}) {}
export class GetDeliverabilityTestReportResponse extends S.Class<GetDeliverabilityTestReportResponse>(
  "GetDeliverabilityTestReportResponse",
)({
  DeliverabilityTestReport: DeliverabilityTestReport,
  OverallPlacement: PlacementStatistics,
  IspPlacements: IspPlacements,
  Message: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export class GetDomainDeliverabilityCampaignResponse extends S.Class<GetDomainDeliverabilityCampaignResponse>(
  "GetDomainDeliverabilityCampaignResponse",
)({ DomainDeliverabilityCampaign: DomainDeliverabilityCampaign }) {}
export class GetEmailIdentityResponse extends S.Class<GetEmailIdentityResponse>(
  "GetEmailIdentityResponse",
)({
  IdentityType: S.optional(S.String),
  FeedbackForwardingStatus: S.optional(S.Boolean),
  VerifiedForSendingStatus: S.optional(S.Boolean),
  DkimAttributes: S.optional(DkimAttributes),
  MailFromAttributes: S.optional(MailFromAttributes),
  Tags: S.optional(TagList),
}) {}
export class ListEmailIdentitiesResponse extends S.Class<ListEmailIdentitiesResponse>(
  "ListEmailIdentitiesResponse",
)({
  EmailIdentities: S.optional(IdentityInfoList),
  NextToken: S.optional(S.String),
}) {}
export class SendEmailResponse extends S.Class<SendEmailResponse>(
  "SendEmailResponse",
)({ MessageId: S.optional(S.String) }) {}
export class BlacklistEntry extends S.Class<BlacklistEntry>("BlacklistEntry")({
  RblName: S.optional(S.String),
  ListingTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Description: S.optional(S.String),
}) {}
export const BlacklistEntries = S.Array(BlacklistEntry);
export const BlacklistReport = S.Record({
  key: S.String,
  value: BlacklistEntries,
});
export class OverallVolume extends S.Class<OverallVolume>("OverallVolume")({
  VolumeStatistics: S.optional(VolumeStatistics),
  ReadRatePercent: S.optional(S.Number),
  DomainIspPlacements: S.optional(DomainIspPlacements),
}) {}
export class CreateConfigurationSetEventDestinationRequest extends S.Class<CreateConfigurationSetEventDestinationRequest>(
  "CreateConfigurationSetEventDestinationRequest",
)(
  {
    ConfigurationSetName: S.String.pipe(T.HttpLabel()),
    EventDestinationName: S.String,
    EventDestination: EventDestinationDefinition,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v1/email/configuration-sets/{ConfigurationSetName}/event-destinations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateConfigurationSetEventDestinationResponse extends S.Class<CreateConfigurationSetEventDestinationResponse>(
  "CreateConfigurationSetEventDestinationResponse",
)({}) {}
export class CreateDeliverabilityTestReportRequest extends S.Class<CreateDeliverabilityTestReportRequest>(
  "CreateDeliverabilityTestReportRequest",
)(
  {
    ReportName: S.optional(S.String),
    FromEmailAddress: S.String,
    Content: EmailContent,
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/email/deliverability-dashboard/test" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBlacklistReportsResponse extends S.Class<GetBlacklistReportsResponse>(
  "GetBlacklistReportsResponse",
)({ BlacklistReport: BlacklistReport }) {}
export class GetDomainStatisticsReportResponse extends S.Class<GetDomainStatisticsReportResponse>(
  "GetDomainStatisticsReportResponse",
)({ OverallVolume: OverallVolume, DailyVolumes: DailyVolumes }) {}
export class CreateDeliverabilityTestReportResponse extends S.Class<CreateDeliverabilityTestReportResponse>(
  "CreateDeliverabilityTestReportResponse",
)({ ReportId: S.String, DeliverabilityTestStatus: S.String }) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {},
) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  {},
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {},
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {},
) {}
export class AlreadyExistsException extends S.TaggedError<AlreadyExistsException>()(
  "AlreadyExistsException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class AccountSuspendedException extends S.TaggedError<AccountSuspendedException>()(
  "AccountSuspendedException",
  { message: S.optional(S.String) },
) {}
export class MailFromDomainNotVerifiedException extends S.TaggedError<MailFromDomainNotVerifiedException>()(
  "MailFromDomainNotVerifiedException",
  {},
) {}
export class MessageRejected extends S.TaggedError<MessageRejected>()(
  "MessageRejected",
  {},
) {}
export class SendingPausedException extends S.TaggedError<SendingPausedException>()(
  "SendingPausedException",
  {},
) {}

//# Operations
/**
 * Enable or disable the automatic warm-up feature for dedicated IP addresses.
 */
export const putAccountDedicatedIpWarmupAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutAccountDedicatedIpWarmupAttributesRequest,
    output: PutAccountDedicatedIpWarmupAttributesResponse,
    errors: [BadRequestException, TooManyRequestsException],
  }));
/**
 * Enable or disable the ability of your account to send email.
 */
export const putAccountSendingAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutAccountSendingAttributesRequest,
    output: PutAccountSendingAttributesResponse,
    errors: [BadRequestException, TooManyRequestsException],
  }),
);
/**
 * Associate a configuration set with a dedicated IP pool. You can use dedicated IP pools
 * to create groups of dedicated IP addresses for sending specific types of email.
 */
export const putConfigurationSetDeliveryOptions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutConfigurationSetDeliveryOptionsRequest,
    output: PutConfigurationSetDeliveryOptionsResponse,
    errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  }));
/**
 * Enable or disable collection of reputation metrics for emails that you send using a
 * particular configuration set in a specific AWS Region.
 */
export const putConfigurationSetReputationOptions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutConfigurationSetReputationOptionsRequest,
    output: PutConfigurationSetReputationOptionsResponse,
    errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  }));
/**
 * Enable or disable email sending for messages that use a particular configuration set
 * in a specific AWS Region.
 */
export const putConfigurationSetSendingOptions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutConfigurationSetSendingOptionsRequest,
    output: PutConfigurationSetSendingOptionsResponse,
    errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  }));
/**
 * Specify a custom domain to use for open and click tracking elements in email that you
 * send using Amazon Pinpoint.
 */
export const putConfigurationSetTrackingOptions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutConfigurationSetTrackingOptionsRequest,
    output: PutConfigurationSetTrackingOptionsResponse,
    errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  }));
/**
 * Move a dedicated IP address to an existing dedicated IP pool.
 *
 * The dedicated IP address that you specify must already exist, and must be
 * associated with your Amazon Pinpoint account.
 *
 * The dedicated IP pool you specify must already exist. You can create a new pool by
 * using the `CreateDedicatedIpPool` operation.
 */
export const putDedicatedIpInPool = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutDedicatedIpInPoolRequest,
    output: PutDedicatedIpInPoolResponse,
    errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  }),
);
/**
 *
 */
export const putDedicatedIpWarmupAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutDedicatedIpWarmupAttributesRequest,
    output: PutDedicatedIpWarmupAttributesResponse,
    errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  }));
/**
 * Used to enable or disable DKIM authentication for an email identity.
 */
export const putEmailIdentityDkimAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutEmailIdentityDkimAttributesRequest,
    output: PutEmailIdentityDkimAttributesResponse,
    errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  }));
/**
 * Used to enable or disable feedback forwarding for an identity. This setting determines
 * what happens when an identity is used to send an email that results in a bounce or
 * complaint event.
 *
 * When you enable feedback forwarding, Amazon Pinpoint sends you email notifications when bounce
 * or complaint events occur. Amazon Pinpoint sends this notification to the address that you
 * specified in the Return-Path header of the original email.
 *
 * When you disable feedback forwarding, Amazon Pinpoint sends notifications through other
 * mechanisms, such as by notifying an Amazon SNS topic. You're required to have a method of
 * tracking bounces and complaints. If you haven't set up another mechanism for receiving
 * bounce or complaint notifications, Amazon Pinpoint sends an email notification when these events
 * occur (even if this setting is disabled).
 */
export const putEmailIdentityFeedbackAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutEmailIdentityFeedbackAttributesRequest,
    output: PutEmailIdentityFeedbackAttributesResponse,
    errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  }));
/**
 * Used to enable or disable the custom Mail-From domain configuration for an email
 * identity.
 */
export const putEmailIdentityMailFromAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutEmailIdentityMailFromAttributesRequest,
    output: PutEmailIdentityMailFromAttributesResponse,
    errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  }));
/**
 * Add one or more tags (keys and values) to a specified resource. A
 * *tag* is a label that you optionally define and associate with a
 * resource in Amazon Pinpoint. Tags can help you categorize and manage resources in different ways,
 * such as by purpose, owner, environment, or other criteria. A resource can have as many
 * as 50 tags.
 *
 * Each tag consists of a required *tag key* and an
 * associated *tag value*, both of which you define. A tag key is a
 * general label that acts as a category for more specific tag values. A tag value acts as
 * a descriptor within a tag key.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Remove one or more tags (keys and values) from a specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Update the configuration of an event destination for a configuration set.
 *
 * In Amazon Pinpoint, *events* include message sends, deliveries, opens,
 * clicks, bounces, and complaints. *Event destinations* are places that
 * you can send information about these events to. For example, you can send event data to
 * Amazon SNS to receive notifications when you receive bounces or complaints, or you can use
 * Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
 */
export const updateConfigurationSetEventDestination =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateConfigurationSetEventDestinationRequest,
    output: UpdateConfigurationSetEventDestinationResponse,
    errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  }));
/**
 * Create a configuration set. *Configuration sets* are groups of
 * rules that you can apply to the emails you send using Amazon Pinpoint. You apply a configuration
 * set to an email by including a reference to the configuration set in the headers of the
 * email. When you apply a configuration set to an email, all of the rules in that
 * configuration set are applied to the email.
 */
export const createConfigurationSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateConfigurationSetRequest,
    output: CreateConfigurationSetResponse,
    errors: [
      AlreadyExistsException,
      BadRequestException,
      ConcurrentModificationException,
      LimitExceededException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Create a new pool of dedicated IP addresses. A pool can include one or more dedicated
 * IP addresses that are associated with your Amazon Pinpoint account. You can associate a pool with
 * a configuration set. When you send an email that uses that configuration set, Amazon Pinpoint
 * sends it using only the IP addresses in the associated pool.
 */
export const createDedicatedIpPool = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDedicatedIpPoolRequest,
    output: CreateDedicatedIpPoolResponse,
    errors: [
      AlreadyExistsException,
      BadRequestException,
      ConcurrentModificationException,
      LimitExceededException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Delete an existing configuration set.
 *
 * In Amazon Pinpoint, *configuration sets* are groups of rules that you can
 * apply to the emails you send. You apply a configuration set to an email by including a
 * reference to the configuration set in the headers of the email. When you apply a
 * configuration set to an email, all of the rules in that configuration set are applied to
 * the email.
 */
export const deleteConfigurationSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteConfigurationSetRequest,
    output: DeleteConfigurationSetResponse,
    errors: [
      BadRequestException,
      ConcurrentModificationException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Delete an event destination.
 *
 * In Amazon Pinpoint, *events* include message sends, deliveries, opens,
 * clicks, bounces, and complaints. *Event destinations* are places that
 * you can send information about these events to. For example, you can send event data to
 * Amazon SNS to receive notifications when you receive bounces or complaints, or you can use
 * Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
 */
export const deleteConfigurationSetEventDestination =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteConfigurationSetEventDestinationRequest,
    output: DeleteConfigurationSetEventDestinationResponse,
    errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  }));
/**
 * Delete a dedicated IP pool.
 */
export const deleteDedicatedIpPool = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDedicatedIpPoolRequest,
    output: DeleteDedicatedIpPoolResponse,
    errors: [
      BadRequestException,
      ConcurrentModificationException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Deletes an email identity that you previously verified for use with Amazon Pinpoint. An identity
 * can be either an email address or a domain name.
 */
export const deleteEmailIdentity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEmailIdentityRequest,
  output: DeleteEmailIdentityResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Obtain information about the email-sending status and capabilities of your Amazon Pinpoint
 * account in the current AWS Region.
 */
export const getAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountRequest,
  output: GetAccountResponse,
  errors: [BadRequestException, TooManyRequestsException],
}));
/**
 * Get information about an existing configuration set, including the dedicated IP pool
 * that it's associated with, whether or not it's enabled for sending email, and
 * more.
 *
 * In Amazon Pinpoint, *configuration sets* are groups of rules that you can
 * apply to the emails you send. You apply a configuration set to an email by including a
 * reference to the configuration set in the headers of the email. When you apply a
 * configuration set to an email, all of the rules in that configuration set are applied to
 * the email.
 */
export const getConfigurationSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfigurationSetRequest,
  output: GetConfigurationSetResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * List the dedicated IP addresses that are associated with your Amazon Pinpoint
 * account.
 */
export const getDedicatedIps = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDedicatedIpsRequest,
  output: GetDedicatedIpsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * List all of the configuration sets associated with your Amazon Pinpoint account in the current
 * region.
 *
 * In Amazon Pinpoint, *configuration sets* are groups of rules that you can
 * apply to the emails you send. You apply a configuration set to an email by including a
 * reference to the configuration set in the headers of the email. When you apply a
 * configuration set to an email, all of the rules in that configuration set are applied to
 * the email.
 */
export const listConfigurationSets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListConfigurationSetsRequest,
    output: ListConfigurationSetsResponse,
    errors: [BadRequestException, TooManyRequestsException],
  }),
);
/**
 * List all of the dedicated IP pools that exist in your Amazon Pinpoint account in the current
 * AWS Region.
 */
export const listDedicatedIpPools = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDedicatedIpPoolsRequest,
    output: ListDedicatedIpPoolsResponse,
    errors: [BadRequestException, TooManyRequestsException],
  }),
);
/**
 * Show a list of the predictive inbox placement tests that you've performed, regardless of their statuses. For
 * predictive inbox placement tests that are complete, you can use the `GetDeliverabilityTestReport`
 * operation to view the results.
 */
export const listDeliverabilityTestReports =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDeliverabilityTestReportsRequest,
    output: ListDeliverabilityTestReportsResponse,
    errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  }));
/**
 * Retrieve deliverability data for all the campaigns that used a specific domain to send
 * email during a specified time range. This data is available for a domain only if you
 * enabled the Deliverability dashboard (`PutDeliverabilityDashboardOption` operation)
 * for the domain.
 */
export const listDomainDeliverabilityCampaigns =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDomainDeliverabilityCampaignsRequest,
    output: ListDomainDeliverabilityCampaignsResponse,
    errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  }));
/**
 * Retrieve a list of the tags (keys and values) that are associated with a specified
 * resource. A *tag* is a label that you optionally define and associate
 * with a resource in Amazon Pinpoint. Each tag consists of a required tag
 * key and an optional associated *tag value*. A tag key
 * is a general label that acts as a category for more specific tag values. A tag value
 * acts as a descriptor within a tag key.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Enable or disable the Deliverability dashboard for your Amazon Pinpoint account. When you enable the
 * Deliverability dashboard, you gain access to reputation, deliverability, and other metrics for
 * the domains that you use to send email using Amazon Pinpoint. You also gain the ability to perform
 * predictive inbox placement tests.
 *
 * When you use the Deliverability dashboard, you pay a monthly subscription charge, in addition
 * to any other fees that you accrue by using Amazon Pinpoint. For more information about the
 * features and cost of a Deliverability dashboard subscription, see Amazon Pinpoint Pricing.
 */
export const putDeliverabilityDashboardOption =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutDeliverabilityDashboardOptionRequest,
    output: PutDeliverabilityDashboardOptionResponse,
    errors: [
      AlreadyExistsException,
      BadRequestException,
      LimitExceededException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Verifies an email identity for use with Amazon Pinpoint. In Amazon Pinpoint, an identity is an email
 * address or domain that you use when you send email. Before you can use an identity to
 * send email with Amazon Pinpoint, you first have to verify it. By verifying an address, you
 * demonstrate that you're the owner of the address, and that you've given Amazon Pinpoint permission
 * to send email from the address.
 *
 * When you verify an email address, Amazon Pinpoint sends an email to the address. Your email
 * address is verified as soon as you follow the link in the verification email.
 *
 * When you verify a domain, this operation provides a set of DKIM tokens, which you can
 * convert into CNAME tokens. You add these CNAME tokens to the DNS configuration for your
 * domain. Your domain is verified when Amazon Pinpoint detects these records in the DNS
 * configuration for your domain. It usually takes around 72 hours to complete the domain
 * verification process.
 */
export const createEmailIdentity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEmailIdentityRequest,
  output: CreateEmailIdentityResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    LimitExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieve a list of event destinations that are associated with a configuration
 * set.
 *
 * In Amazon Pinpoint, *events* include message sends, deliveries, opens,
 * clicks, bounces, and complaints. *Event destinations* are places that
 * you can send information about these events to. For example, you can send event data to
 * Amazon SNS to receive notifications when you receive bounces or complaints, or you can use
 * Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
 */
export const getConfigurationSetEventDestinations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetConfigurationSetEventDestinationsRequest,
    output: GetConfigurationSetEventDestinationsResponse,
    errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  }));
/**
 * Get information about a dedicated IP address, including the name of the dedicated IP
 * pool that it's associated with, as well information about the automatic warm-up process
 * for the address.
 */
export const getDedicatedIp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDedicatedIpRequest,
  output: GetDedicatedIpResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Retrieve information about the status of the Deliverability dashboard for your Amazon Pinpoint account.
 * When the Deliverability dashboard is enabled, you gain access to reputation, deliverability, and
 * other metrics for the domains that you use to send email using Amazon Pinpoint. You also gain the
 * ability to perform predictive inbox placement tests.
 *
 * When you use the Deliverability dashboard, you pay a monthly subscription charge, in addition
 * to any other fees that you accrue by using Amazon Pinpoint. For more information about the
 * features and cost of a Deliverability dashboard subscription, see Amazon Pinpoint Pricing.
 */
export const getDeliverabilityDashboardOptions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDeliverabilityDashboardOptionsRequest,
    output: GetDeliverabilityDashboardOptionsResponse,
    errors: [
      BadRequestException,
      LimitExceededException,
      TooManyRequestsException,
    ],
  }));
/**
 * Retrieve the results of a predictive inbox placement test.
 */
export const getDeliverabilityTestReport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDeliverabilityTestReportRequest,
    output: GetDeliverabilityTestReportResponse,
    errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  }),
);
/**
 * Retrieve all the deliverability data for a specific campaign. This data is available
 * for a campaign only if the campaign sent email by using a domain that the
 * Deliverability dashboard is enabled for (`PutDeliverabilityDashboardOption`
 * operation).
 */
export const getDomainDeliverabilityCampaign =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDomainDeliverabilityCampaignRequest,
    output: GetDomainDeliverabilityCampaignResponse,
    errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  }));
/**
 * Provides information about a specific identity associated with your Amazon Pinpoint account,
 * including the identity's verification status, its DKIM authentication status, and its
 * custom Mail-From settings.
 */
export const getEmailIdentity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEmailIdentityRequest,
  output: GetEmailIdentityResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Returns a list of all of the email identities that are associated with your Amazon Pinpoint
 * account. An identity can be either an email address or a domain. This operation returns
 * identities that are verified as well as those that aren't.
 */
export const listEmailIdentities = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEmailIdentitiesRequest,
  output: ListEmailIdentitiesResponse,
  errors: [BadRequestException, TooManyRequestsException],
}));
/**
 * Create an event destination. In Amazon Pinpoint, *events* include message
 * sends, deliveries, opens, clicks, bounces, and complaints. Event
 * destinations are places that you can send information about these events
 * to. For example, you can send event data to Amazon SNS to receive notifications when you
 * receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term
 * storage.
 *
 * A single configuration set can include more than one event destination.
 */
export const createConfigurationSetEventDestination =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateConfigurationSetEventDestinationRequest,
    output: CreateConfigurationSetEventDestinationResponse,
    errors: [
      AlreadyExistsException,
      BadRequestException,
      LimitExceededException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Retrieve a list of the blacklists that your dedicated IP addresses appear on.
 */
export const getBlacklistReports = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBlacklistReportsRequest,
  output: GetBlacklistReportsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Retrieve inbox placement and engagement rates for the domains that you use to send
 * email.
 */
export const getDomainStatisticsReport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDomainStatisticsReportRequest,
    output: GetDomainStatisticsReportResponse,
    errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  }),
);
/**
 * Create a new predictive inbox placement test. Predictive inbox placement tests can help you predict how your messages will be handled
 * by various email providers around the world. When you perform a predictive inbox placement test, you provide a
 * sample message that contains the content that you plan to send to your customers. Amazon Pinpoint
 * then sends that message to special email addresses spread across several major email
 * providers. After about 24 hours, the test is complete, and you can use the
 * `GetDeliverabilityTestReport` operation to view the results of the
 * test.
 */
export const createDeliverabilityTestReport =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateDeliverabilityTestReportRequest,
    output: CreateDeliverabilityTestReportResponse,
    errors: [
      AccountSuspendedException,
      BadRequestException,
      ConcurrentModificationException,
      LimitExceededException,
      MailFromDomainNotVerifiedException,
      MessageRejected,
      NotFoundException,
      SendingPausedException,
      TooManyRequestsException,
    ],
  }));
/**
 * Sends an email message. You can use the Amazon Pinpoint Email API to send two types of
 * messages:
 *
 * - **Simple** – A standard email message. When
 * you create this type of message, you specify the sender, the recipient, and the
 * message body, and Amazon Pinpoint assembles the message for you.
 *
 * - **Raw** – A raw, MIME-formatted email
 * message. When you send this type of email, you have to specify all of the
 * message headers, as well as the message body. You can use this message type to
 * send messages that contain attachments. The message that you specify has to be a
 * valid MIME message.
 */
export const sendEmail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendEmailRequest,
  output: SendEmailResponse,
  errors: [
    AccountSuspendedException,
    BadRequestException,
    LimitExceededException,
    MailFromDomainNotVerifiedException,
    MessageRejected,
    NotFoundException,
    SendingPausedException,
    TooManyRequestsException,
  ],
}));

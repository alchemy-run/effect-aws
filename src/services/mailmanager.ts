import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "MailManager",
  serviceShapeName: "MailManagerSvc",
});
const auth = T.AwsAuthSigv4({ name: "ses" });
const ver = T.ServiceVersion("2023-10-17");
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://mail-manager-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://mail-manager-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://mail-manager.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://mail-manager.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export class DeregisterMemberFromAddressListRequest extends S.Class<DeregisterMemberFromAddressListRequest>(
  "DeregisterMemberFromAddressListRequest",
)(
  { AddressListId: S.String, Address: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeregisterMemberFromAddressListResponse extends S.Class<DeregisterMemberFromAddressListResponse>(
  "DeregisterMemberFromAddressListResponse",
)({}) {}
export class GetAddressListImportJobRequest extends S.Class<GetAddressListImportJobRequest>(
  "GetAddressListImportJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetArchiveExportRequest extends S.Class<GetArchiveExportRequest>(
  "GetArchiveExportRequest",
)(
  { ExportId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetArchiveMessageRequest extends S.Class<GetArchiveMessageRequest>(
  "GetArchiveMessageRequest",
)(
  { ArchivedMessageId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetArchiveMessageContentRequest extends S.Class<GetArchiveMessageContentRequest>(
  "GetArchiveMessageContentRequest",
)(
  { ArchivedMessageId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetArchiveSearchRequest extends S.Class<GetArchiveSearchRequest>(
  "GetArchiveSearchRequest",
)(
  { SearchId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetArchiveSearchResultsRequest extends S.Class<GetArchiveSearchResultsRequest>(
  "GetArchiveSearchResultsRequest",
)(
  { SearchId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMemberOfAddressListRequest extends S.Class<GetMemberOfAddressListRequest>(
  "GetMemberOfAddressListRequest",
)(
  { AddressListId: S.String, Address: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAddressListImportJobsRequest extends S.Class<ListAddressListImportJobsRequest>(
  "ListAddressListImportJobsRequest",
)(
  {
    AddressListId: S.String,
    NextToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListArchiveExportsRequest extends S.Class<ListArchiveExportsRequest>(
  "ListArchiveExportsRequest",
)(
  {
    ArchiveId: S.String,
    NextToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListArchiveSearchesRequest extends S.Class<ListArchiveSearchesRequest>(
  "ListArchiveSearchesRequest",
)(
  {
    ArchiveId: S.String,
    NextToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterMemberToAddressListRequest extends S.Class<RegisterMemberToAddressListRequest>(
  "RegisterMemberToAddressListRequest",
)(
  { AddressListId: S.String, Address: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterMemberToAddressListResponse extends S.Class<RegisterMemberToAddressListResponse>(
  "RegisterMemberToAddressListResponse",
)({}) {}
export class StartAddressListImportJobRequest extends S.Class<StartAddressListImportJobRequest>(
  "StartAddressListImportJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartAddressListImportJobResponse extends S.Class<StartAddressListImportJobResponse>(
  "StartAddressListImportJobResponse",
)({}) {}
export const ArchiveStringToEvaluate = S.Union(
  S.Struct({ Attribute: S.String }),
);
export const StringValueList = S.Array(S.String);
export class ArchiveStringExpression extends S.Class<ArchiveStringExpression>(
  "ArchiveStringExpression",
)({
  Evaluate: ArchiveStringToEvaluate,
  Operator: S.String,
  Values: StringValueList,
}) {}
export const ArchiveBooleanToEvaluate = S.Union(
  S.Struct({ Attribute: S.String }),
);
export class ArchiveBooleanExpression extends S.Class<ArchiveBooleanExpression>(
  "ArchiveBooleanExpression",
)({ Evaluate: ArchiveBooleanToEvaluate, Operator: S.String }) {}
export const ArchiveFilterCondition = S.Union(
  S.Struct({ StringExpression: ArchiveStringExpression }),
  S.Struct({ BooleanExpression: ArchiveBooleanExpression }),
);
export const ArchiveFilterConditions = S.Array(ArchiveFilterCondition);
export class ArchiveFilters extends S.Class<ArchiveFilters>("ArchiveFilters")({
  Include: S.optional(ArchiveFilterConditions),
  Unless: S.optional(ArchiveFilterConditions),
}) {}
export class StartArchiveSearchRequest extends S.Class<StartArchiveSearchRequest>(
  "StartArchiveSearchRequest",
)(
  {
    ArchiveId: S.String,
    Filters: S.optional(ArchiveFilters),
    FromTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ToTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    MaxResults: S.Number,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopAddressListImportJobRequest extends S.Class<StopAddressListImportJobRequest>(
  "StopAddressListImportJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopAddressListImportJobResponse extends S.Class<StopAddressListImportJobResponse>(
  "StopAddressListImportJobResponse",
)({}) {}
export class StopArchiveExportRequest extends S.Class<StopArchiveExportRequest>(
  "StopArchiveExportRequest",
)(
  { ExportId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopArchiveExportResponse extends S.Class<StopArchiveExportResponse>(
  "StopArchiveExportResponse",
)({}) {}
export class StopArchiveSearchRequest extends S.Class<StopArchiveSearchRequest>(
  "StopArchiveSearchRequest",
)(
  { SearchId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopArchiveSearchResponse extends S.Class<StopArchiveSearchResponse>(
  "StopArchiveSearchResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateAddonInstanceRequest extends S.Class<CreateAddonInstanceRequest>(
  "CreateAddonInstanceRequest",
)(
  {
    ClientToken: S.optional(S.String),
    AddonSubscriptionId: S.String,
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAddonInstanceRequest extends S.Class<GetAddonInstanceRequest>(
  "GetAddonInstanceRequest",
)(
  { AddonInstanceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAddonInstanceRequest extends S.Class<DeleteAddonInstanceRequest>(
  "DeleteAddonInstanceRequest",
)(
  { AddonInstanceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAddonInstanceResponse extends S.Class<DeleteAddonInstanceResponse>(
  "DeleteAddonInstanceResponse",
)({}) {}
export class ListAddonInstancesRequest extends S.Class<ListAddonInstancesRequest>(
  "ListAddonInstancesRequest",
)(
  { NextToken: S.optional(S.String), PageSize: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateAddonSubscriptionRequest extends S.Class<CreateAddonSubscriptionRequest>(
  "CreateAddonSubscriptionRequest",
)(
  {
    ClientToken: S.optional(S.String),
    AddonName: S.String,
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAddonSubscriptionRequest extends S.Class<GetAddonSubscriptionRequest>(
  "GetAddonSubscriptionRequest",
)(
  { AddonSubscriptionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAddonSubscriptionRequest extends S.Class<DeleteAddonSubscriptionRequest>(
  "DeleteAddonSubscriptionRequest",
)(
  { AddonSubscriptionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAddonSubscriptionResponse extends S.Class<DeleteAddonSubscriptionResponse>(
  "DeleteAddonSubscriptionResponse",
)({}) {}
export class ListAddonSubscriptionsRequest extends S.Class<ListAddonSubscriptionsRequest>(
  "ListAddonSubscriptionsRequest",
)(
  { NextToken: S.optional(S.String), PageSize: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateAddressListRequest extends S.Class<CreateAddressListRequest>(
  "CreateAddressListRequest",
)(
  {
    ClientToken: S.optional(S.String),
    AddressListName: S.String,
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAddressListRequest extends S.Class<GetAddressListRequest>(
  "GetAddressListRequest",
)(
  { AddressListId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAddressListRequest extends S.Class<DeleteAddressListRequest>(
  "DeleteAddressListRequest",
)(
  { AddressListId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAddressListResponse extends S.Class<DeleteAddressListResponse>(
  "DeleteAddressListResponse",
)({}) {}
export class ListAddressListsRequest extends S.Class<ListAddressListsRequest>(
  "ListAddressListsRequest",
)(
  { NextToken: S.optional(S.String), PageSize: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetArchiveRequest extends S.Class<GetArchiveRequest>(
  "GetArchiveRequest",
)(
  { ArchiveId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ArchiveRetention = S.Union(
  S.Struct({ RetentionPeriod: S.String }),
);
export class UpdateArchiveRequest extends S.Class<UpdateArchiveRequest>(
  "UpdateArchiveRequest",
)(
  {
    ArchiveId: S.String,
    ArchiveName: S.optional(S.String),
    Retention: S.optional(ArchiveRetention),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateArchiveResponse extends S.Class<UpdateArchiveResponse>(
  "UpdateArchiveResponse",
)({}) {}
export class DeleteArchiveRequest extends S.Class<DeleteArchiveRequest>(
  "DeleteArchiveRequest",
)(
  { ArchiveId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteArchiveResponse extends S.Class<DeleteArchiveResponse>(
  "DeleteArchiveResponse",
)({}) {}
export class ListArchivesRequest extends S.Class<ListArchivesRequest>(
  "ListArchivesRequest",
)(
  { NextToken: S.optional(S.String), PageSize: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIngressPointRequest extends S.Class<GetIngressPointRequest>(
  "GetIngressPointRequest",
)(
  { IngressPointId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const IngressPointConfiguration = S.Union(
  S.Struct({ SmtpPassword: S.String }),
  S.Struct({ SecretArn: S.String }),
);
export class UpdateIngressPointRequest extends S.Class<UpdateIngressPointRequest>(
  "UpdateIngressPointRequest",
)(
  {
    IngressPointId: S.String,
    IngressPointName: S.optional(S.String),
    StatusToUpdate: S.optional(S.String),
    RuleSetId: S.optional(S.String),
    TrafficPolicyId: S.optional(S.String),
    IngressPointConfiguration: S.optional(IngressPointConfiguration),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateIngressPointResponse extends S.Class<UpdateIngressPointResponse>(
  "UpdateIngressPointResponse",
)({}) {}
export class DeleteIngressPointRequest extends S.Class<DeleteIngressPointRequest>(
  "DeleteIngressPointRequest",
)(
  { IngressPointId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIngressPointResponse extends S.Class<DeleteIngressPointResponse>(
  "DeleteIngressPointResponse",
)({}) {}
export class ListIngressPointsRequest extends S.Class<ListIngressPointsRequest>(
  "ListIngressPointsRequest",
)(
  { PageSize: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRelayRequest extends S.Class<GetRelayRequest>(
  "GetRelayRequest",
)(
  { RelayId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class NoAuthentication extends S.Class<NoAuthentication>(
  "NoAuthentication",
)({}) {}
export const RelayAuthentication = S.Union(
  S.Struct({ SecretArn: S.String }),
  S.Struct({ NoAuthentication: NoAuthentication }),
);
export class UpdateRelayRequest extends S.Class<UpdateRelayRequest>(
  "UpdateRelayRequest",
)(
  {
    RelayId: S.String,
    RelayName: S.optional(S.String),
    ServerName: S.optional(S.String),
    ServerPort: S.optional(S.Number),
    Authentication: S.optional(RelayAuthentication),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateRelayResponse extends S.Class<UpdateRelayResponse>(
  "UpdateRelayResponse",
)({}) {}
export class DeleteRelayRequest extends S.Class<DeleteRelayRequest>(
  "DeleteRelayRequest",
)(
  { RelayId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRelayResponse extends S.Class<DeleteRelayResponse>(
  "DeleteRelayResponse",
)({}) {}
export class ListRelaysRequest extends S.Class<ListRelaysRequest>(
  "ListRelaysRequest",
)(
  { PageSize: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRuleSetRequest extends S.Class<GetRuleSetRequest>(
  "GetRuleSetRequest",
)(
  { RuleSetId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Analysis extends S.Class<Analysis>("Analysis")({
  Analyzer: S.String,
  ResultField: S.String,
}) {}
export const RuleAddressListArnList = S.Array(S.String);
export class RuleIsInAddressList extends S.Class<RuleIsInAddressList>(
  "RuleIsInAddressList",
)({ Attribute: S.String, AddressLists: RuleAddressListArnList }) {}
export const RuleBooleanToEvaluate = S.Union(
  S.Struct({ Attribute: S.String }),
  S.Struct({ Analysis: Analysis }),
  S.Struct({ IsInAddressList: RuleIsInAddressList }),
);
export class RuleBooleanExpression extends S.Class<RuleBooleanExpression>(
  "RuleBooleanExpression",
)({ Evaluate: RuleBooleanToEvaluate, Operator: S.String }) {}
export const RuleStringToEvaluate = S.Union(
  S.Struct({ Attribute: S.String }),
  S.Struct({ MimeHeaderAttribute: S.String }),
  S.Struct({ Analysis: Analysis }),
);
export const RuleStringList = S.Array(S.String);
export class RuleStringExpression extends S.Class<RuleStringExpression>(
  "RuleStringExpression",
)({
  Evaluate: RuleStringToEvaluate,
  Operator: S.String,
  Values: RuleStringList,
}) {}
export const RuleNumberToEvaluate = S.Union(S.Struct({ Attribute: S.String }));
export class RuleNumberExpression extends S.Class<RuleNumberExpression>(
  "RuleNumberExpression",
)({ Evaluate: RuleNumberToEvaluate, Operator: S.String, Value: S.Number }) {}
export const RuleIpToEvaluate = S.Union(S.Struct({ Attribute: S.String }));
export const RuleIpValueList = S.Array(S.String);
export class RuleIpExpression extends S.Class<RuleIpExpression>(
  "RuleIpExpression",
)({
  Evaluate: RuleIpToEvaluate,
  Operator: S.String,
  Values: RuleIpValueList,
}) {}
export const RuleVerdictToEvaluate = S.Union(
  S.Struct({ Attribute: S.String }),
  S.Struct({ Analysis: Analysis }),
);
export const RuleVerdictValueList = S.Array(S.String);
export class RuleVerdictExpression extends S.Class<RuleVerdictExpression>(
  "RuleVerdictExpression",
)({
  Evaluate: RuleVerdictToEvaluate,
  Operator: S.String,
  Values: RuleVerdictValueList,
}) {}
export const RuleDmarcValueList = S.Array(S.String);
export class RuleDmarcExpression extends S.Class<RuleDmarcExpression>(
  "RuleDmarcExpression",
)({ Operator: S.String, Values: RuleDmarcValueList }) {}
export const RuleCondition = S.Union(
  S.Struct({ BooleanExpression: RuleBooleanExpression }),
  S.Struct({ StringExpression: RuleStringExpression }),
  S.Struct({ NumberExpression: RuleNumberExpression }),
  S.Struct({ IpExpression: RuleIpExpression }),
  S.Struct({ VerdictExpression: RuleVerdictExpression }),
  S.Struct({ DmarcExpression: RuleDmarcExpression }),
);
export const RuleConditions = S.Array(RuleCondition);
export class DropAction extends S.Class<DropAction>("DropAction")({}) {}
export class RelayAction extends S.Class<RelayAction>("RelayAction")({
  ActionFailurePolicy: S.optional(S.String),
  Relay: S.String,
  MailFrom: S.optional(S.String),
}) {}
export class ArchiveAction extends S.Class<ArchiveAction>("ArchiveAction")({
  ActionFailurePolicy: S.optional(S.String),
  TargetArchive: S.String,
}) {}
export class S3Action extends S.Class<S3Action>("S3Action")({
  ActionFailurePolicy: S.optional(S.String),
  RoleArn: S.String,
  S3Bucket: S.String,
  S3Prefix: S.optional(S.String),
  S3SseKmsKeyId: S.optional(S.String),
}) {}
export class SendAction extends S.Class<SendAction>("SendAction")({
  ActionFailurePolicy: S.optional(S.String),
  RoleArn: S.String,
}) {}
export class AddHeaderAction extends S.Class<AddHeaderAction>(
  "AddHeaderAction",
)({ HeaderName: S.String, HeaderValue: S.String }) {}
export const Recipients = S.Array(S.String);
export class ReplaceRecipientAction extends S.Class<ReplaceRecipientAction>(
  "ReplaceRecipientAction",
)({ ReplaceWith: S.optional(Recipients) }) {}
export class DeliverToMailboxAction extends S.Class<DeliverToMailboxAction>(
  "DeliverToMailboxAction",
)({
  ActionFailurePolicy: S.optional(S.String),
  MailboxArn: S.String,
  RoleArn: S.String,
}) {}
export class DeliverToQBusinessAction extends S.Class<DeliverToQBusinessAction>(
  "DeliverToQBusinessAction",
)({
  ActionFailurePolicy: S.optional(S.String),
  ApplicationId: S.String,
  IndexId: S.String,
  RoleArn: S.String,
}) {}
export class SnsAction extends S.Class<SnsAction>("SnsAction")({
  ActionFailurePolicy: S.optional(S.String),
  TopicArn: S.String,
  RoleArn: S.String,
  Encoding: S.optional(S.String),
  PayloadType: S.optional(S.String),
}) {}
export const RuleAction = S.Union(
  S.Struct({ Drop: DropAction }),
  S.Struct({ Relay: RelayAction }),
  S.Struct({ Archive: ArchiveAction }),
  S.Struct({ WriteToS3: S3Action }),
  S.Struct({ Send: SendAction }),
  S.Struct({ AddHeader: AddHeaderAction }),
  S.Struct({ ReplaceRecipient: ReplaceRecipientAction }),
  S.Struct({ DeliverToMailbox: DeliverToMailboxAction }),
  S.Struct({ DeliverToQBusiness: DeliverToQBusinessAction }),
  S.Struct({ PublishToSns: SnsAction }),
);
export const RuleActions = S.Array(RuleAction);
export class Rule extends S.Class<Rule>("Rule")({
  Name: S.optional(S.String),
  Conditions: S.optional(RuleConditions),
  Unless: S.optional(RuleConditions),
  Actions: RuleActions,
}) {}
export const Rules = S.Array(Rule);
export class UpdateRuleSetRequest extends S.Class<UpdateRuleSetRequest>(
  "UpdateRuleSetRequest",
)(
  {
    RuleSetId: S.String,
    RuleSetName: S.optional(S.String),
    Rules: S.optional(Rules),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateRuleSetResponse extends S.Class<UpdateRuleSetResponse>(
  "UpdateRuleSetResponse",
)({}) {}
export class DeleteRuleSetRequest extends S.Class<DeleteRuleSetRequest>(
  "DeleteRuleSetRequest",
)(
  { RuleSetId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRuleSetResponse extends S.Class<DeleteRuleSetResponse>(
  "DeleteRuleSetResponse",
)({}) {}
export class ListRuleSetsRequest extends S.Class<ListRuleSetsRequest>(
  "ListRuleSetsRequest",
)(
  { NextToken: S.optional(S.String), PageSize: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTrafficPolicyRequest extends S.Class<GetTrafficPolicyRequest>(
  "GetTrafficPolicyRequest",
)(
  { TrafficPolicyId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class IngressAnalysis extends S.Class<IngressAnalysis>(
  "IngressAnalysis",
)({ Analyzer: S.String, ResultField: S.String }) {}
export const IngressStringToEvaluate = S.Union(
  S.Struct({ Attribute: S.String }),
  S.Struct({ Analysis: IngressAnalysis }),
);
export const StringList = S.Array(S.String);
export class IngressStringExpression extends S.Class<IngressStringExpression>(
  "IngressStringExpression",
)({
  Evaluate: IngressStringToEvaluate,
  Operator: S.String,
  Values: StringList,
}) {}
export const IngressIpToEvaluate = S.Union(S.Struct({ Attribute: S.String }));
export const Ipv4Cidrs = S.Array(S.String);
export class IngressIpv4Expression extends S.Class<IngressIpv4Expression>(
  "IngressIpv4Expression",
)({ Evaluate: IngressIpToEvaluate, Operator: S.String, Values: Ipv4Cidrs }) {}
export const IngressIpv6ToEvaluate = S.Union(S.Struct({ Attribute: S.String }));
export const Ipv6Cidrs = S.Array(S.String);
export class IngressIpv6Expression extends S.Class<IngressIpv6Expression>(
  "IngressIpv6Expression",
)({ Evaluate: IngressIpv6ToEvaluate, Operator: S.String, Values: Ipv6Cidrs }) {}
export const IngressTlsProtocolToEvaluate = S.Union(
  S.Struct({ Attribute: S.String }),
);
export class IngressTlsProtocolExpression extends S.Class<IngressTlsProtocolExpression>(
  "IngressTlsProtocolExpression",
)({
  Evaluate: IngressTlsProtocolToEvaluate,
  Operator: S.String,
  Value: S.String,
}) {}
export const IngressAddressListArnList = S.Array(S.String);
export class IngressIsInAddressList extends S.Class<IngressIsInAddressList>(
  "IngressIsInAddressList",
)({ Attribute: S.String, AddressLists: IngressAddressListArnList }) {}
export const IngressBooleanToEvaluate = S.Union(
  S.Struct({ Analysis: IngressAnalysis }),
  S.Struct({ IsInAddressList: IngressIsInAddressList }),
);
export class IngressBooleanExpression extends S.Class<IngressBooleanExpression>(
  "IngressBooleanExpression",
)({ Evaluate: IngressBooleanToEvaluate, Operator: S.String }) {}
export const PolicyCondition = S.Union(
  S.Struct({ StringExpression: IngressStringExpression }),
  S.Struct({ IpExpression: IngressIpv4Expression }),
  S.Struct({ Ipv6Expression: IngressIpv6Expression }),
  S.Struct({ TlsExpression: IngressTlsProtocolExpression }),
  S.Struct({ BooleanExpression: IngressBooleanExpression }),
);
export const PolicyConditions = S.Array(PolicyCondition);
export class PolicyStatement extends S.Class<PolicyStatement>(
  "PolicyStatement",
)({ Conditions: PolicyConditions, Action: S.String }) {}
export const PolicyStatementList = S.Array(PolicyStatement);
export class UpdateTrafficPolicyRequest extends S.Class<UpdateTrafficPolicyRequest>(
  "UpdateTrafficPolicyRequest",
)(
  {
    TrafficPolicyId: S.String,
    TrafficPolicyName: S.optional(S.String),
    PolicyStatements: S.optional(PolicyStatementList),
    DefaultAction: S.optional(S.String),
    MaxMessageSizeBytes: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateTrafficPolicyResponse extends S.Class<UpdateTrafficPolicyResponse>(
  "UpdateTrafficPolicyResponse",
)({}) {}
export class DeleteTrafficPolicyRequest extends S.Class<DeleteTrafficPolicyRequest>(
  "DeleteTrafficPolicyRequest",
)(
  { TrafficPolicyId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTrafficPolicyResponse extends S.Class<DeleteTrafficPolicyResponse>(
  "DeleteTrafficPolicyResponse",
)({}) {}
export class ListTrafficPoliciesRequest extends S.Class<ListTrafficPoliciesRequest>(
  "ListTrafficPoliciesRequest",
)(
  { PageSize: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportDataFormat extends S.Class<ImportDataFormat>(
  "ImportDataFormat",
)({ ImportDataType: S.String }) {}
export class AddressFilter extends S.Class<AddressFilter>("AddressFilter")({
  AddressPrefix: S.optional(S.String),
}) {}
export class CreateAddressListImportJobRequest extends S.Class<CreateAddressListImportJobRequest>(
  "CreateAddressListImportJobRequest",
)(
  {
    ClientToken: S.optional(S.String),
    AddressListId: S.String,
    Name: S.String,
    ImportDataFormat: ImportDataFormat,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAddressListImportJobResponse extends S.Class<GetAddressListImportJobResponse>(
  "GetAddressListImportJobResponse",
)({
  JobId: S.String,
  Name: S.String,
  Status: S.String,
  PreSignedUrl: S.String,
  ImportedItemsCount: S.optional(S.Number),
  FailedItemsCount: S.optional(S.Number),
  ImportDataFormat: ImportDataFormat,
  AddressListId: S.String,
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Error: S.optional(S.String),
}) {}
export class GetMemberOfAddressListResponse extends S.Class<GetMemberOfAddressListResponse>(
  "GetMemberOfAddressListResponse",
)({
  Address: S.String,
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class ListMembersOfAddressListRequest extends S.Class<ListMembersOfAddressListRequest>(
  "ListMembersOfAddressListRequest",
)(
  {
    AddressListId: S.String,
    Filter: S.optional(AddressFilter),
    NextToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: TagList }) {}
export class StartArchiveSearchResponse extends S.Class<StartArchiveSearchResponse>(
  "StartArchiveSearchResponse",
)({ SearchId: S.optional(S.String) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class CreateAddonInstanceResponse extends S.Class<CreateAddonInstanceResponse>(
  "CreateAddonInstanceResponse",
)({ AddonInstanceId: S.String }) {}
export class GetAddonInstanceResponse extends S.Class<GetAddonInstanceResponse>(
  "GetAddonInstanceResponse",
)({
  AddonSubscriptionId: S.optional(S.String),
  AddonName: S.optional(S.String),
  AddonInstanceArn: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateAddonSubscriptionResponse extends S.Class<CreateAddonSubscriptionResponse>(
  "CreateAddonSubscriptionResponse",
)({ AddonSubscriptionId: S.String }) {}
export class GetAddonSubscriptionResponse extends S.Class<GetAddonSubscriptionResponse>(
  "GetAddonSubscriptionResponse",
)({
  AddonName: S.optional(S.String),
  AddonSubscriptionArn: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateAddressListResponse extends S.Class<CreateAddressListResponse>(
  "CreateAddressListResponse",
)({ AddressListId: S.String }) {}
export class GetAddressListResponse extends S.Class<GetAddressListResponse>(
  "GetAddressListResponse",
)({
  AddressListId: S.String,
  AddressListArn: S.String,
  AddressListName: S.String,
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class CreateArchiveRequest extends S.Class<CreateArchiveRequest>(
  "CreateArchiveRequest",
)(
  {
    ClientToken: S.optional(S.String),
    ArchiveName: S.String,
    Retention: S.optional(ArchiveRetention),
    KmsKeyArn: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetArchiveResponse extends S.Class<GetArchiveResponse>(
  "GetArchiveResponse",
)({
  ArchiveId: S.String,
  ArchiveName: S.String,
  ArchiveArn: S.String,
  ArchiveState: S.String,
  Retention: ArchiveRetention,
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  KmsKeyArn: S.optional(S.String),
}) {}
export class CreateRelayRequest extends S.Class<CreateRelayRequest>(
  "CreateRelayRequest",
)(
  {
    ClientToken: S.optional(S.String),
    RelayName: S.String,
    ServerName: S.String,
    ServerPort: S.Number,
    Authentication: RelayAuthentication,
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRelayResponse extends S.Class<GetRelayResponse>(
  "GetRelayResponse",
)({
  RelayId: S.String,
  RelayArn: S.optional(S.String),
  RelayName: S.optional(S.String),
  ServerName: S.optional(S.String),
  ServerPort: S.optional(S.Number),
  Authentication: S.optional(RelayAuthentication),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class GetRuleSetResponse extends S.Class<GetRuleSetResponse>(
  "GetRuleSetResponse",
)({
  RuleSetId: S.String,
  RuleSetArn: S.String,
  RuleSetName: S.String,
  CreatedDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModificationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Rules: Rules,
}) {}
export class GetTrafficPolicyResponse extends S.Class<GetTrafficPolicyResponse>(
  "GetTrafficPolicyResponse",
)({
  TrafficPolicyName: S.String,
  TrafficPolicyId: S.String,
  TrafficPolicyArn: S.optional(S.String),
  PolicyStatements: S.optional(PolicyStatementList),
  MaxMessageSizeBytes: S.optional(S.Number),
  DefaultAction: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const EmailReceivedHeadersList = S.Array(S.String);
export class S3ExportDestinationConfiguration extends S.Class<S3ExportDestinationConfiguration>(
  "S3ExportDestinationConfiguration",
)({ S3Location: S.optional(S.String) }) {}
export class PublicNetworkConfiguration extends S.Class<PublicNetworkConfiguration>(
  "PublicNetworkConfiguration",
)({ IpType: S.String }) {}
export class PrivateNetworkConfiguration extends S.Class<PrivateNetworkConfiguration>(
  "PrivateNetworkConfiguration",
)({ VpcEndpointId: S.String }) {}
export class ExportStatus extends S.Class<ExportStatus>("ExportStatus")({
  SubmissionTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  CompletionTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  State: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export class Metadata extends S.Class<Metadata>("Metadata")({
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  IngressPointId: S.optional(S.String),
  TrafficPolicyId: S.optional(S.String),
  RuleSetId: S.optional(S.String),
  SenderHostname: S.optional(S.String),
  SenderIpAddress: S.optional(S.String),
  TlsCipherSuite: S.optional(S.String),
  TlsProtocol: S.optional(S.String),
  SendingMethod: S.optional(S.String),
  SourceIdentity: S.optional(S.String),
  SendingPool: S.optional(S.String),
  ConfigurationSet: S.optional(S.String),
  SourceArn: S.optional(S.String),
}) {}
export class Envelope extends S.Class<Envelope>("Envelope")({
  Helo: S.optional(S.String),
  From: S.optional(S.String),
  To: S.optional(StringList),
}) {}
export class MessageBody extends S.Class<MessageBody>("MessageBody")({
  Text: S.optional(S.String),
  Html: S.optional(S.String),
  MessageMalformed: S.optional(S.Boolean),
}) {}
export class SearchStatus extends S.Class<SearchStatus>("SearchStatus")({
  SubmissionTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  CompletionTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  State: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export class Row extends S.Class<Row>("Row")({
  ArchivedMessageId: S.optional(S.String),
  ReceivedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Date: S.optional(S.String),
  To: S.optional(S.String),
  From: S.optional(S.String),
  Cc: S.optional(S.String),
  Subject: S.optional(S.String),
  MessageId: S.optional(S.String),
  HasAttachments: S.optional(S.Boolean),
  ReceivedHeaders: S.optional(EmailReceivedHeadersList),
  InReplyTo: S.optional(S.String),
  XMailer: S.optional(S.String),
  XOriginalMailer: S.optional(S.String),
  XPriority: S.optional(S.String),
  IngressPointId: S.optional(S.String),
  SenderHostname: S.optional(S.String),
  SenderIpAddress: S.optional(S.String),
  Envelope: S.optional(Envelope),
  SourceArn: S.optional(S.String),
}) {}
export const RowsList = S.Array(Row);
export class ImportJob extends S.Class<ImportJob>("ImportJob")({
  JobId: S.String,
  Name: S.String,
  Status: S.String,
  PreSignedUrl: S.String,
  ImportedItemsCount: S.optional(S.Number),
  FailedItemsCount: S.optional(S.Number),
  ImportDataFormat: ImportDataFormat,
  AddressListId: S.String,
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Error: S.optional(S.String),
}) {}
export const ImportJobs = S.Array(ImportJob);
export class ExportSummary extends S.Class<ExportSummary>("ExportSummary")({
  ExportId: S.optional(S.String),
  Status: S.optional(ExportStatus),
}) {}
export const ExportSummaryList = S.Array(ExportSummary);
export class SearchSummary extends S.Class<SearchSummary>("SearchSummary")({
  SearchId: S.optional(S.String),
  Status: S.optional(SearchStatus),
}) {}
export const SearchSummaryList = S.Array(SearchSummary);
export const ExportDestinationConfiguration = S.Union(
  S.Struct({ S3: S3ExportDestinationConfiguration }),
);
export class AddonInstance extends S.Class<AddonInstance>("AddonInstance")({
  AddonInstanceId: S.optional(S.String),
  AddonSubscriptionId: S.optional(S.String),
  AddonName: S.optional(S.String),
  AddonInstanceArn: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const AddonInstances = S.Array(AddonInstance);
export class AddonSubscription extends S.Class<AddonSubscription>(
  "AddonSubscription",
)({
  AddonSubscriptionId: S.optional(S.String),
  AddonName: S.optional(S.String),
  AddonSubscriptionArn: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const AddonSubscriptions = S.Array(AddonSubscription);
export class AddressList extends S.Class<AddressList>("AddressList")({
  AddressListId: S.String,
  AddressListArn: S.String,
  AddressListName: S.String,
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const AddressLists = S.Array(AddressList);
export class Archive extends S.Class<Archive>("Archive")({
  ArchiveId: S.String,
  ArchiveName: S.optional(S.String),
  ArchiveState: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const ArchivesList = S.Array(Archive);
export const NetworkConfiguration = S.Union(
  S.Struct({ PublicNetworkConfiguration: PublicNetworkConfiguration }),
  S.Struct({ PrivateNetworkConfiguration: PrivateNetworkConfiguration }),
);
export class IngressPoint extends S.Class<IngressPoint>("IngressPoint")({
  IngressPointName: S.String,
  IngressPointId: S.String,
  Status: S.String,
  Type: S.String,
  ARecord: S.optional(S.String),
}) {}
export const IngressPointsList = S.Array(IngressPoint);
export class Relay extends S.Class<Relay>("Relay")({
  RelayId: S.optional(S.String),
  RelayName: S.optional(S.String),
  LastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const Relays = S.Array(Relay);
export class RuleSet extends S.Class<RuleSet>("RuleSet")({
  RuleSetId: S.optional(S.String),
  RuleSetName: S.optional(S.String),
  LastModificationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const RuleSets = S.Array(RuleSet);
export class TrafficPolicy extends S.Class<TrafficPolicy>("TrafficPolicy")({
  TrafficPolicyName: S.String,
  TrafficPolicyId: S.String,
  DefaultAction: S.String,
}) {}
export const TrafficPolicyList = S.Array(TrafficPolicy);
export class CreateAddressListImportJobResponse extends S.Class<CreateAddressListImportJobResponse>(
  "CreateAddressListImportJobResponse",
)({ JobId: S.String, PreSignedUrl: S.String }) {}
export class GetArchiveExportResponse extends S.Class<GetArchiveExportResponse>(
  "GetArchiveExportResponse",
)({
  ArchiveId: S.optional(S.String),
  Filters: S.optional(ArchiveFilters),
  FromTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ToTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  MaxResults: S.optional(S.Number),
  ExportDestinationConfiguration: S.optional(ExportDestinationConfiguration),
  Status: S.optional(ExportStatus),
}) {}
export class GetArchiveMessageResponse extends S.Class<GetArchiveMessageResponse>(
  "GetArchiveMessageResponse",
)({
  MessageDownloadLink: S.optional(S.String),
  Metadata: S.optional(Metadata),
  Envelope: S.optional(Envelope),
}) {}
export class GetArchiveMessageContentResponse extends S.Class<GetArchiveMessageContentResponse>(
  "GetArchiveMessageContentResponse",
)({ Body: S.optional(MessageBody) }) {}
export class GetArchiveSearchResponse extends S.Class<GetArchiveSearchResponse>(
  "GetArchiveSearchResponse",
)({
  ArchiveId: S.optional(S.String),
  Filters: S.optional(ArchiveFilters),
  FromTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ToTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  MaxResults: S.optional(S.Number),
  Status: S.optional(SearchStatus),
}) {}
export class GetArchiveSearchResultsResponse extends S.Class<GetArchiveSearchResultsResponse>(
  "GetArchiveSearchResultsResponse",
)({ Rows: S.optional(RowsList) }) {}
export class ListAddressListImportJobsResponse extends S.Class<ListAddressListImportJobsResponse>(
  "ListAddressListImportJobsResponse",
)({ ImportJobs: ImportJobs, NextToken: S.optional(S.String) }) {}
export class ListArchiveExportsResponse extends S.Class<ListArchiveExportsResponse>(
  "ListArchiveExportsResponse",
)({
  Exports: S.optional(ExportSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListArchiveSearchesResponse extends S.Class<ListArchiveSearchesResponse>(
  "ListArchiveSearchesResponse",
)({
  Searches: S.optional(SearchSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListAddonInstancesResponse extends S.Class<ListAddonInstancesResponse>(
  "ListAddonInstancesResponse",
)({
  AddonInstances: S.optional(AddonInstances),
  NextToken: S.optional(S.String),
}) {}
export class ListAddonSubscriptionsResponse extends S.Class<ListAddonSubscriptionsResponse>(
  "ListAddonSubscriptionsResponse",
)({
  AddonSubscriptions: S.optional(AddonSubscriptions),
  NextToken: S.optional(S.String),
}) {}
export class ListAddressListsResponse extends S.Class<ListAddressListsResponse>(
  "ListAddressListsResponse",
)({ AddressLists: AddressLists, NextToken: S.optional(S.String) }) {}
export class CreateArchiveResponse extends S.Class<CreateArchiveResponse>(
  "CreateArchiveResponse",
)({ ArchiveId: S.String }) {}
export class ListArchivesResponse extends S.Class<ListArchivesResponse>(
  "ListArchivesResponse",
)({ Archives: ArchivesList, NextToken: S.optional(S.String) }) {}
export class CreateIngressPointRequest extends S.Class<CreateIngressPointRequest>(
  "CreateIngressPointRequest",
)(
  {
    ClientToken: S.optional(S.String),
    IngressPointName: S.String,
    Type: S.String,
    RuleSetId: S.String,
    TrafficPolicyId: S.String,
    IngressPointConfiguration: S.optional(IngressPointConfiguration),
    NetworkConfiguration: S.optional(NetworkConfiguration),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListIngressPointsResponse extends S.Class<ListIngressPointsResponse>(
  "ListIngressPointsResponse",
)({
  IngressPoints: S.optional(IngressPointsList),
  NextToken: S.optional(S.String),
}) {}
export class CreateRelayResponse extends S.Class<CreateRelayResponse>(
  "CreateRelayResponse",
)({ RelayId: S.String }) {}
export class ListRelaysResponse extends S.Class<ListRelaysResponse>(
  "ListRelaysResponse",
)({ Relays: Relays, NextToken: S.optional(S.String) }) {}
export class ListRuleSetsResponse extends S.Class<ListRuleSetsResponse>(
  "ListRuleSetsResponse",
)({ RuleSets: RuleSets, NextToken: S.optional(S.String) }) {}
export class ListTrafficPoliciesResponse extends S.Class<ListTrafficPoliciesResponse>(
  "ListTrafficPoliciesResponse",
)({
  TrafficPolicies: S.optional(TrafficPolicyList),
  NextToken: S.optional(S.String),
}) {}
export class IngressPointPasswordConfiguration extends S.Class<IngressPointPasswordConfiguration>(
  "IngressPointPasswordConfiguration",
)({
  SmtpPasswordVersion: S.optional(S.String),
  PreviousSmtpPasswordVersion: S.optional(S.String),
  PreviousSmtpPasswordExpiryTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class SavedAddress extends S.Class<SavedAddress>("SavedAddress")({
  Address: S.String,
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const SavedAddresses = S.Array(SavedAddress);
export class IngressPointAuthConfiguration extends S.Class<IngressPointAuthConfiguration>(
  "IngressPointAuthConfiguration",
)({
  IngressPointPasswordConfiguration: S.optional(
    IngressPointPasswordConfiguration,
  ),
  SecretArn: S.optional(S.String),
}) {}
export class ListMembersOfAddressListResponse extends S.Class<ListMembersOfAddressListResponse>(
  "ListMembersOfAddressListResponse",
)({ Addresses: SavedAddresses, NextToken: S.optional(S.String) }) {}
export class CreateIngressPointResponse extends S.Class<CreateIngressPointResponse>(
  "CreateIngressPointResponse",
)({ IngressPointId: S.String }) {}
export class GetIngressPointResponse extends S.Class<GetIngressPointResponse>(
  "GetIngressPointResponse",
)({
  IngressPointId: S.String,
  IngressPointName: S.String,
  IngressPointArn: S.optional(S.String),
  Status: S.optional(S.String),
  Type: S.optional(S.String),
  ARecord: S.optional(S.String),
  RuleSetId: S.optional(S.String),
  TrafficPolicyId: S.optional(S.String),
  IngressPointAuthConfiguration: S.optional(IngressPointAuthConfiguration),
  NetworkConfiguration: S.optional(NetworkConfiguration),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class StartArchiveExportRequest extends S.Class<StartArchiveExportRequest>(
  "StartArchiveExportRequest",
)(
  {
    ArchiveId: S.String,
    Filters: S.optional(ArchiveFilters),
    FromTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ToTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    MaxResults: S.optional(S.Number),
    ExportDestinationConfiguration: ExportDestinationConfiguration,
    IncludeMetadata: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartArchiveExportResponse extends S.Class<StartArchiveExportResponse>(
  "StartArchiveExportResponse",
)({ ExportId: S.optional(S.String) }) {}
export class CreateRuleSetRequest extends S.Class<CreateRuleSetRequest>(
  "CreateRuleSetRequest",
)(
  {
    ClientToken: S.optional(S.String),
    RuleSetName: S.String,
    Rules: Rules,
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTrafficPolicyRequest extends S.Class<CreateTrafficPolicyRequest>(
  "CreateTrafficPolicyRequest",
)(
  {
    ClientToken: S.optional(S.String),
    TrafficPolicyName: S.String,
    PolicyStatements: PolicyStatementList,
    DefaultAction: S.String,
    MaxMessageSizeBytes: S.optional(S.Number),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateRuleSetResponse extends S.Class<CreateRuleSetResponse>(
  "CreateRuleSetResponse",
)({ RuleSetId: S.String }) {}
export class CreateTrafficPolicyResponse extends S.Class<CreateTrafficPolicyResponse>(
  "CreateTrafficPolicyResponse",
)({ TrafficPolicyId: S.String }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes an Add On instance.
 */
export const deleteAddonInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAddonInstanceRequest,
  output: DeleteAddonInstanceResponse,
  errors: [ConflictException, ValidationException],
}));
/**
 * Creates a new address list.
 */
export const createAddressList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAddressListRequest,
  output: CreateAddressListResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stops an in-progress archive search job.
 */
export const stopArchiveSearch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopArchiveSearchRequest,
  output: StopArchiveSearchResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Deletes an address list.
 */
export const deleteAddressList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAddressListRequest,
  output: DeleteAddressListResponse,
  errors: [AccessDeniedException, ConflictException, ThrottlingException],
}));
/**
 * Initiates deletion of an email archive. This changes the archive state to pending deletion. In this state, no new emails can be added, and existing archived emails become inaccessible (search, export, download). The archive and all of its contents will be permanently deleted 30 days after entering the pending deletion state, regardless of the configured retention period.
 */
export const deleteArchive = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteArchiveRequest,
  output: DeleteArchiveResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a member from an address list.
 */
export const deregisterMemberFromAddressList =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeregisterMemberFromAddressListRequest,
    output: DeregisterMemberFromAddressListResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves the details and current status of a specific email archive export job.
 */
export const getArchiveExport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetArchiveExportRequest,
  output: GetArchiveExportResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Returns a pre-signed URL that provides temporary download access to the specific email message stored in the archive.
 */
export const getArchiveMessage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetArchiveMessageRequest,
  output: GetArchiveMessageResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Returns the textual content of a specific email message stored in the archive. Attachments are not included.
 */
export const getArchiveMessageContent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetArchiveMessageContentRequest,
    output: GetArchiveMessageContentResponse,
    errors: [AccessDeniedException, ThrottlingException, ValidationException],
  }),
);
/**
 * Retrieves the details and current status of a specific email archive search job.
 */
export const getArchiveSearch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetArchiveSearchRequest,
  output: GetArchiveSearchResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Returns the results of a completed email archive search job.
 */
export const getArchiveSearchResults = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetArchiveSearchResultsRequest,
    output: GetArchiveSearchResultsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists jobs for an address list.
 */
export const listAddressListImportJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAddressListImportJobsRequest,
    output: ListAddressListImportJobsResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of email archive export jobs.
 */
export const listArchiveExports = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListArchiveExportsRequest,
  output: ListArchiveExportsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of email archive search jobs.
 */
export const listArchiveSearches = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListArchiveSearchesRequest,
  output: ListArchiveSearchesResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists address lists for this account.
 */
export const listAddressLists = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAddressListsRequest,
  output: ListAddressListsResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Creates a new email archive resource for storing and retaining emails.
 */
export const createArchive = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateArchiveRequest,
  output: CreateArchiveResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of all email archives in your account.
 */
export const listArchives = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListArchivesRequest,
  output: ListArchivesResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Deletes an Add On subscription.
 */
export const deleteAddonSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAddonSubscriptionRequest,
    output: DeleteAddonSubscriptionResponse,
    errors: [ConflictException, ValidationException],
  }),
);
/**
 * Delete a rule set.
 */
export const deleteRuleSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRuleSetRequest,
  output: DeleteRuleSetResponse,
  errors: [ConflictException, ValidationException],
}));
/**
 * Lists all Add On instances in your account.
 */
export const listAddonInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAddonInstancesRequest,
  output: ListAddonInstancesResponse,
  errors: [ValidationException],
}));
/**
 * Creates a subscription for an Add On representing the acceptance of its terms of use and additional pricing. The subscription can then be used to create an instance for use in rule sets or traffic policies.
 */
export const createAddonSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAddonSubscriptionRequest,
    output: CreateAddonSubscriptionResponse,
    errors: [
      ConflictException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all Add On subscriptions in your account.
 */
export const listAddonSubscriptions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAddonSubscriptionsRequest,
    output: ListAddonSubscriptionsResponse,
    errors: [ValidationException],
  }),
);
/**
 * List all ingress endpoint resources.
 */
export const listIngressPoints = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIngressPointsRequest,
  output: ListIngressPointsResponse,
  errors: [ValidationException],
}));
/**
 * Creates a relay resource which can be used in rules to relay incoming emails to defined relay destinations.
 */
export const createRelay = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRelayRequest,
  output: CreateRelayResponse,
  errors: [
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Lists all the existing relay resources.
 */
export const listRelays = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRelaysRequest,
  output: ListRelaysResponse,
  errors: [ValidationException],
}));
/**
 * List rule sets for this account.
 */
export const listRuleSets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRuleSetsRequest,
  output: ListRuleSetsResponse,
  errors: [ValidationException],
}));
/**
 * List traffic policy resources.
 */
export const listTrafficPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTrafficPoliciesRequest,
  output: ListTrafficPoliciesResponse,
  errors: [ValidationException],
}));
/**
 * Stops an in-progress export of emails from an archive.
 */
export const stopArchiveExport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopArchiveExportRequest,
  output: StopArchiveExportResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Fetch attributes of an import job.
 */
export const getAddressListImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAddressListImportJobRequest,
    output: GetAddressListImportJobResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Fetch attributes of a member in an address list.
 */
export const getMemberOfAddressList = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMemberOfAddressListRequest,
    output: GetMemberOfAddressListResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the list of tags (keys and values) assigned to the resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Remove one or more tags (keys and values) from a specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Creates an Add On instance for the subscription indicated in the request. The resulting Amazon Resource Name (ARN) can be used in a conditional statement for a rule set or traffic policy.
 */
export const createAddonInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAddonInstanceRequest,
  output: CreateAddonInstanceResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Gets detailed information about an Add On instance.
 */
export const getAddonInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAddonInstanceRequest,
  output: GetAddonInstanceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Gets detailed information about an Add On subscription.
 */
export const getAddonSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAddonSubscriptionRequest,
    output: GetAddonSubscriptionResponse,
    errors: [ResourceNotFoundException, ValidationException],
  }),
);
/**
 * Fetch attributes of an address list.
 */
export const getAddressList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAddressListRequest,
  output: GetAddressListResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the full details and current state of a specified email archive.
 */
export const getArchive = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetArchiveRequest,
  output: GetArchiveResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Fetch the relay resource and it's attributes.
 */
export const getRelay = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRelayRequest,
  output: GetRelayResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Fetch attributes of a rule set.
 */
export const getRuleSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRuleSetRequest,
  output: GetRuleSetResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Fetch attributes of a traffic policy resource.
 */
export const getTrafficPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrafficPolicyRequest,
  output: GetTrafficPolicyResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Adds a member to an address list.
 */
export const registerMemberToAddressList = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterMemberToAddressListRequest,
    output: RegisterMemberToAddressListResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Starts an import job for an address list.
 */
export const startAddressListImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartAddressListImportJobRequest,
    output: StartAddressListImportJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Stops an ongoing import job for an address list.
 */
export const stopAddressListImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopAddressListImportJobRequest,
    output: StopAddressListImportJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the attributes of an existing email archive.
 */
export const updateArchive = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateArchiveRequest,
  output: UpdateArchiveResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update attributes of a provisioned ingress endpoint resource.
 */
export const updateIngressPoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIngressPointRequest,
  output: UpdateIngressPointResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Delete an ingress endpoint resource.
 */
export const deleteIngressPoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIngressPointRequest,
  output: DeleteIngressPointResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Updates the attributes of an existing relay resource.
 */
export const updateRelay = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRelayRequest,
  output: UpdateRelayResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes an existing relay resource.
 */
export const deleteRelay = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRelayRequest,
  output: DeleteRelayResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Update attributes of an already provisioned rule set.
 */
export const updateRuleSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRuleSetRequest,
  output: UpdateRuleSetResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Update attributes of an already provisioned traffic policy resource.
 */
export const updateTrafficPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTrafficPolicyRequest,
  output: UpdateTrafficPolicyResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Delete a traffic policy resource.
 */
export const deleteTrafficPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTrafficPolicyRequest,
  output: DeleteTrafficPolicyResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Initiates a search across emails in the specified archive.
 */
export const startArchiveSearch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartArchiveSearchRequest,
  output: StartArchiveSearchResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds one or more tags (keys and values) to a specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates an import job for an address list.
 */
export const createAddressListImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAddressListImportJobRequest,
    output: CreateAddressListImportJobResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists members of an address list.
 */
export const listMembersOfAddressList = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMembersOfAddressListRequest,
    output: ListMembersOfAddressListResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Provision a new ingress endpoint resource.
 */
export const createIngressPoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIngressPointRequest,
  output: CreateIngressPointResponse,
  errors: [
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Fetch ingress endpoint resource attributes.
 */
export const getIngressPoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIngressPointRequest,
  output: GetIngressPointResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Initiates an export of emails from the specified archive.
 */
export const startArchiveExport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartArchiveExportRequest,
  output: StartArchiveExportResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provision a new rule set.
 */
export const createRuleSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRuleSetRequest,
  output: CreateRuleSetResponse,
  errors: [
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Provision a new traffic policy resource.
 */
export const createTrafficPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrafficPolicyRequest,
  output: CreateTrafficPolicyResponse,
  errors: [
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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
export class ImportDataFormat extends S.Class<ImportDataFormat>(
  "ImportDataFormat",
)({ ImportDataType: S.String }) {}
export class AddressFilter extends S.Class<AddressFilter>("AddressFilter")({
  AddressPrefix: S.optional(S.String),
}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
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
export const StringList = S.Array(S.String);
export const EmailReceivedHeadersList = S.Array(S.String);
export class S3ExportDestinationConfiguration extends S.Class<S3ExportDestinationConfiguration>(
  "S3ExportDestinationConfiguration",
)({ S3Location: S.optional(S.String) }) {}
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
export class SavedAddress extends S.Class<SavedAddress>("SavedAddress")({
  Address: S.String,
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const SavedAddresses = S.Array(SavedAddress);
export class ListMembersOfAddressListResponse extends S.Class<ListMembersOfAddressListResponse>(
  "ListMembersOfAddressListResponse",
)({ Addresses: SavedAddresses, NextToken: S.optional(S.String) }) {}
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

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
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
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}

//# Operations
/**
 * Stops an in-progress archive search job.
 */
export const stopArchiveSearch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopArchiveSearchRequest,
  output: StopArchiveSearchResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
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
 * Stops an in-progress export of emails from an archive.
 */
export const stopArchiveExport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopArchiveExportRequest,
  output: StopArchiveExportResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
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

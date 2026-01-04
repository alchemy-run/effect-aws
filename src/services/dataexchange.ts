import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "DataExchange",
  serviceShapeName: "DataExchange",
});
const auth = T.AwsAuthSigv4({ name: "dataexchange" });
const ver = T.ServiceVersion("2017-07-25");
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
                        url: "https://dataexchange-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://dataexchange-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://dataexchange.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://dataexchange.{Region}.{PartitionResult#dnsSuffix}",
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
export const AcceptanceStateFilterValues = S.Array(S.String);
export const ListOf__string = S.Array(S.String);
export class AcceptDataGrantRequest extends S.Class<AcceptDataGrantRequest>(
  "AcceptDataGrantRequest",
)(
  { DataGrantArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/data-grants/{DataGrantArn}/accept" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelJobRequest extends S.Class<CancelJobRequest>(
  "CancelJobRequest",
)(
  { JobId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/jobs/{JobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelJobResponse extends S.Class<CancelJobResponse>(
  "CancelJobResponse",
)({}) {}
export const MapOf__string = S.Record({ key: S.String, value: S.String });
export class CreateDataSetRequest extends S.Class<CreateDataSetRequest>(
  "CreateDataSetRequest",
)(
  {
    AssetType: S.String,
    Description: S.String,
    Name: S.String,
    Tags: S.optional(MapOf__string),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/data-sets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRevisionRequest extends S.Class<CreateRevisionRequest>(
  "CreateRevisionRequest",
)(
  {
    Comment: S.optional(S.String),
    DataSetId: S.String.pipe(T.HttpLabel()),
    Tags: S.optional(MapOf__string),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/data-sets/{DataSetId}/revisions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssetRequest extends S.Class<DeleteAssetRequest>(
  "DeleteAssetRequest",
)(
  {
    AssetId: S.String.pipe(T.HttpLabel()),
    DataSetId: S.String.pipe(T.HttpLabel()),
    RevisionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/data-sets/{DataSetId}/revisions/{RevisionId}/assets/{AssetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssetResponse extends S.Class<DeleteAssetResponse>(
  "DeleteAssetResponse",
)({}) {}
export class DeleteDataGrantRequest extends S.Class<DeleteDataGrantRequest>(
  "DeleteDataGrantRequest",
)(
  { DataGrantId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/data-grants/{DataGrantId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataGrantResponse extends S.Class<DeleteDataGrantResponse>(
  "DeleteDataGrantResponse",
)({}) {}
export class DeleteDataSetRequest extends S.Class<DeleteDataSetRequest>(
  "DeleteDataSetRequest",
)(
  { DataSetId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/data-sets/{DataSetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataSetResponse extends S.Class<DeleteDataSetResponse>(
  "DeleteDataSetResponse",
)({}) {}
export class DeleteEventActionRequest extends S.Class<DeleteEventActionRequest>(
  "DeleteEventActionRequest",
)(
  { EventActionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/event-actions/{EventActionId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEventActionResponse extends S.Class<DeleteEventActionResponse>(
  "DeleteEventActionResponse",
)({}) {}
export class DeleteRevisionRequest extends S.Class<DeleteRevisionRequest>(
  "DeleteRevisionRequest",
)(
  {
    DataSetId: S.String.pipe(T.HttpLabel()),
    RevisionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/data-sets/{DataSetId}/revisions/{RevisionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRevisionResponse extends S.Class<DeleteRevisionResponse>(
  "DeleteRevisionResponse",
)({}) {}
export class GetAssetRequest extends S.Class<GetAssetRequest>(
  "GetAssetRequest",
)(
  {
    AssetId: S.String.pipe(T.HttpLabel()),
    DataSetId: S.String.pipe(T.HttpLabel()),
    RevisionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/data-sets/{DataSetId}/revisions/{RevisionId}/assets/{AssetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataGrantRequest extends S.Class<GetDataGrantRequest>(
  "GetDataGrantRequest",
)(
  { DataGrantId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/data-grants/{DataGrantId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataSetRequest extends S.Class<GetDataSetRequest>(
  "GetDataSetRequest",
)(
  { DataSetId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/data-sets/{DataSetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEventActionRequest extends S.Class<GetEventActionRequest>(
  "GetEventActionRequest",
)(
  { EventActionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/event-actions/{EventActionId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetJobRequest extends S.Class<GetJobRequest>("GetJobRequest")(
  { JobId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/jobs/{JobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetReceivedDataGrantRequest extends S.Class<GetReceivedDataGrantRequest>(
  "GetReceivedDataGrantRequest",
)(
  { DataGrantArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/received-data-grants/{DataGrantArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRevisionRequest extends S.Class<GetRevisionRequest>(
  "GetRevisionRequest",
)(
  {
    DataSetId: S.String.pipe(T.HttpLabel()),
    RevisionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/data-sets/{DataSetId}/revisions/{RevisionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataGrantsRequest extends S.Class<ListDataGrantsRequest>(
  "ListDataGrantsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/data-grants" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataSetRevisionsRequest extends S.Class<ListDataSetRevisionsRequest>(
  "ListDataSetRevisionsRequest",
)(
  {
    DataSetId: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/data-sets/{DataSetId}/revisions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataSetsRequest extends S.Class<ListDataSetsRequest>(
  "ListDataSetsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Origin: S.optional(S.String).pipe(T.HttpQuery("origin")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/data-sets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEventActionsRequest extends S.Class<ListEventActionsRequest>(
  "ListEventActionsRequest",
)(
  {
    EventSourceId: S.optional(S.String).pipe(T.HttpQuery("eventSourceId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/event-actions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListJobsRequest extends S.Class<ListJobsRequest>(
  "ListJobsRequest",
)(
  {
    DataSetId: S.optional(S.String).pipe(T.HttpQuery("dataSetId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RevisionId: S.optional(S.String).pipe(T.HttpQuery("revisionId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListReceivedDataGrantsRequest extends S.Class<ListReceivedDataGrantsRequest>(
  "ListReceivedDataGrantsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    AcceptanceState: S.optional(AcceptanceStateFilterValues).pipe(
      T.HttpQuery("acceptanceState"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/received-data-grants" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRevisionAssetsRequest extends S.Class<ListRevisionAssetsRequest>(
  "ListRevisionAssetsRequest",
)(
  {
    DataSetId: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RevisionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/data-sets/{DataSetId}/revisions/{RevisionId}/assets",
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
  { ResourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RevokeRevisionRequest extends S.Class<RevokeRevisionRequest>(
  "RevokeRevisionRequest",
)(
  {
    DataSetId: S.String.pipe(T.HttpLabel()),
    RevisionId: S.String.pipe(T.HttpLabel()),
    RevocationComment: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v1/data-sets/{DataSetId}/revisions/{RevisionId}/revoke",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendApiAssetRequest extends S.Class<SendApiAssetRequest>(
  "SendApiAssetRequest",
)(
  {
    Body: S.optional(S.String).pipe(T.HttpPayload()),
    QueryStringParameters: S.optional(MapOf__string).pipe(T.HttpQueryParams()),
    AssetId: S.String.pipe(T.HttpHeader("x-amzn-dataexchange-asset-id")),
    DataSetId: S.String.pipe(T.HttpHeader("x-amzn-dataexchange-data-set-id")),
    RequestHeaders: S.optional(MapOf__string).pipe(
      T.HttpPrefixHeaders("x-amzn-dataexchange-header-"),
    ),
    Method: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-dataexchange-http-method"),
    ),
    Path: S.optional(S.String).pipe(T.HttpHeader("x-amzn-dataexchange-path")),
    RevisionId: S.String.pipe(T.HttpHeader("x-amzn-dataexchange-revision-id")),
  },
  T.all(T.Http({ method: "POST", uri: "/v1" }), svc, auth, proto, ver, rules),
) {}
export class StartJobRequest extends S.Class<StartJobRequest>(
  "StartJobRequest",
)(
  { JobId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "PATCH", uri: "/v1/jobs/{JobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartJobResponse extends S.Class<StartJobResponse>(
  "StartJobResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel()),
    Tags: MapOf__string.pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
    ResourceArn: S.String.pipe(T.HttpLabel()),
    TagKeys: ListOf__string.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export class UpdateAssetRequest extends S.Class<UpdateAssetRequest>(
  "UpdateAssetRequest",
)(
  {
    AssetId: S.String.pipe(T.HttpLabel()),
    DataSetId: S.String.pipe(T.HttpLabel()),
    Name: S.String,
    RevisionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v1/data-sets/{DataSetId}/revisions/{RevisionId}/assets/{AssetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDataSetRequest extends S.Class<UpdateDataSetRequest>(
  "UpdateDataSetRequest",
)(
  {
    DataSetId: S.String.pipe(T.HttpLabel()),
    Description: S.optional(S.String),
    Name: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/v1/data-sets/{DataSetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExportServerSideEncryption extends S.Class<ExportServerSideEncryption>(
  "ExportServerSideEncryption",
)({ KmsKeyArn: S.optional(S.String), Type: S.String }) {}
export class AutoExportRevisionDestinationEntry extends S.Class<AutoExportRevisionDestinationEntry>(
  "AutoExportRevisionDestinationEntry",
)({ Bucket: S.String, KeyPattern: S.optional(S.String) }) {}
export class AutoExportRevisionToS3RequestDetails extends S.Class<AutoExportRevisionToS3RequestDetails>(
  "AutoExportRevisionToS3RequestDetails",
)({
  Encryption: S.optional(ExportServerSideEncryption),
  RevisionDestination: AutoExportRevisionDestinationEntry,
}) {}
export class Action extends S.Class<Action>("Action")({
  ExportRevisionToS3: S.optional(AutoExportRevisionToS3RequestDetails),
}) {}
export class UpdateEventActionRequest extends S.Class<UpdateEventActionRequest>(
  "UpdateEventActionRequest",
)(
  { Action: S.optional(Action), EventActionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "PATCH", uri: "/v1/event-actions/{EventActionId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRevisionRequest extends S.Class<UpdateRevisionRequest>(
  "UpdateRevisionRequest",
)(
  {
    Comment: S.optional(S.String),
    DataSetId: S.String.pipe(T.HttpLabel()),
    Finalized: S.optional(S.Boolean),
    RevisionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v1/data-sets/{DataSetId}/revisions/{RevisionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AcceptDataGrantResponse extends S.Class<AcceptDataGrantResponse>(
  "AcceptDataGrantResponse",
)({
  Name: S.String,
  SenderPrincipal: S.optional(S.String),
  ReceiverPrincipal: S.String,
  Description: S.optional(S.String),
  AcceptanceState: S.String,
  AcceptedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EndsAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  GrantDistributionScope: S.String,
  DataSetId: S.String,
  Id: S.String,
  Arn: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class CreateDataGrantRequest extends S.Class<CreateDataGrantRequest>(
  "CreateDataGrantRequest",
)(
  {
    Name: S.String,
    GrantDistributionScope: S.String,
    ReceiverPrincipal: S.String,
    SourceDataSetId: S.String,
    EndsAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Description: S.optional(S.String),
    Tags: S.optional(MapOf__string),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/data-grants" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRevisionResponse extends S.Class<CreateRevisionResponse>(
  "CreateRevisionResponse",
)({
  Arn: S.optional(S.String),
  Comment: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  DataSetId: S.optional(S.String),
  Finalized: S.optional(S.Boolean),
  Id: S.optional(S.String),
  SourceId: S.optional(S.String),
  Tags: S.optional(MapOf__string),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  RevocationComment: S.optional(S.String),
  Revoked: S.optional(S.Boolean),
  RevokedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class GetDataGrantResponse extends S.Class<GetDataGrantResponse>(
  "GetDataGrantResponse",
)({
  Name: S.String,
  SenderPrincipal: S.String,
  ReceiverPrincipal: S.String,
  Description: S.optional(S.String),
  AcceptanceState: S.String,
  AcceptedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EndsAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  GrantDistributionScope: S.String,
  DataSetId: S.String,
  SourceDataSetId: S.String,
  Id: S.String,
  Arn: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  Tags: S.optional(MapOf__string),
}) {}
export class OriginDetails extends S.Class<OriginDetails>("OriginDetails")({
  ProductId: S.optional(S.String),
  DataGrantId: S.optional(S.String),
}) {}
export class GetDataSetResponse extends S.Class<GetDataSetResponse>(
  "GetDataSetResponse",
)({
  Arn: S.optional(S.String),
  AssetType: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Description: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Origin: S.optional(S.String),
  OriginDetails: S.optional(OriginDetails),
  SourceId: S.optional(S.String),
  Tags: S.optional(MapOf__string),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class RevisionPublished extends S.Class<RevisionPublished>(
  "RevisionPublished",
)({ DataSetId: S.String }) {}
export class Event extends S.Class<Event>("Event")({
  RevisionPublished: S.optional(RevisionPublished),
}) {}
export class GetEventActionResponse extends S.Class<GetEventActionResponse>(
  "GetEventActionResponse",
)({
  Action: S.optional(Action),
  Arn: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Event: S.optional(Event),
  Id: S.optional(S.String),
  Tags: S.optional(MapOf__string),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class GetReceivedDataGrantResponse extends S.Class<GetReceivedDataGrantResponse>(
  "GetReceivedDataGrantResponse",
)({
  Name: S.String,
  SenderPrincipal: S.optional(S.String),
  ReceiverPrincipal: S.String,
  Description: S.optional(S.String),
  AcceptanceState: S.String,
  AcceptedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EndsAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  GrantDistributionScope: S.String,
  DataSetId: S.String,
  Id: S.String,
  Arn: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class GetRevisionResponse extends S.Class<GetRevisionResponse>(
  "GetRevisionResponse",
)({
  Arn: S.optional(S.String),
  Comment: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  DataSetId: S.optional(S.String),
  Finalized: S.optional(S.Boolean),
  Id: S.optional(S.String),
  SourceId: S.optional(S.String),
  Tags: S.optional(MapOf__string),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  RevocationComment: S.optional(S.String),
  Revoked: S.optional(S.Boolean),
  RevokedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(MapOf__string).pipe(T.JsonName("tags")) }) {}
export class RevokeRevisionResponse extends S.Class<RevokeRevisionResponse>(
  "RevokeRevisionResponse",
)({
  Arn: S.optional(S.String),
  Comment: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  DataSetId: S.optional(S.String),
  Finalized: S.optional(S.Boolean),
  Id: S.optional(S.String),
  SourceId: S.optional(S.String),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  RevocationComment: S.optional(S.String),
  Revoked: S.optional(S.Boolean),
  RevokedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class SendApiAssetResponse extends S.Class<SendApiAssetResponse>(
  "SendApiAssetResponse",
)({
  Body: S.optional(S.String).pipe(T.HttpPayload()),
  ResponseHeaders: S.optional(MapOf__string).pipe(T.HttpPrefixHeaders("")),
}) {}
export class S3SnapshotAsset extends S.Class<S3SnapshotAsset>(
  "S3SnapshotAsset",
)({ Size: S.Number }) {}
export class RedshiftDataShareAsset extends S.Class<RedshiftDataShareAsset>(
  "RedshiftDataShareAsset",
)({ Arn: S.String }) {}
export class ApiGatewayApiAsset extends S.Class<ApiGatewayApiAsset>(
  "ApiGatewayApiAsset",
)({
  ApiDescription: S.optional(S.String),
  ApiEndpoint: S.optional(S.String),
  ApiId: S.optional(S.String),
  ApiKey: S.optional(S.String),
  ApiName: S.optional(S.String),
  ApiSpecificationDownloadUrl: S.optional(S.String),
  ApiSpecificationDownloadUrlExpiresAt: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  ProtocolType: S.optional(S.String),
  Stage: S.optional(S.String),
}) {}
export class KmsKeyToGrant extends S.Class<KmsKeyToGrant>("KmsKeyToGrant")({
  KmsKeyArn: S.String,
}) {}
export const ListOfKmsKeysToGrant = S.Array(KmsKeyToGrant);
export class S3DataAccessAsset extends S.Class<S3DataAccessAsset>(
  "S3DataAccessAsset",
)({
  Bucket: S.String,
  KeyPrefixes: S.optional(ListOf__string),
  Keys: S.optional(ListOf__string),
  S3AccessPointAlias: S.optional(S.String),
  S3AccessPointArn: S.optional(S.String),
  KmsKeysToGrant: S.optional(ListOfKmsKeysToGrant),
}) {}
export const ListOfLFTagValues = S.Array(S.String);
export class LFTag extends S.Class<LFTag>("LFTag")({
  TagKey: S.String,
  TagValues: ListOfLFTagValues,
}) {}
export const ListOfLFTags = S.Array(LFTag);
export class DatabaseLFTagPolicy extends S.Class<DatabaseLFTagPolicy>(
  "DatabaseLFTagPolicy",
)({ Expression: ListOfLFTags }) {}
export class TableLFTagPolicy extends S.Class<TableLFTagPolicy>(
  "TableLFTagPolicy",
)({ Expression: ListOfLFTags }) {}
export class LFResourceDetails extends S.Class<LFResourceDetails>(
  "LFResourceDetails",
)({
  Database: S.optional(DatabaseLFTagPolicy),
  Table: S.optional(TableLFTagPolicy),
}) {}
export class LFTagPolicyDetails extends S.Class<LFTagPolicyDetails>(
  "LFTagPolicyDetails",
)({
  CatalogId: S.String,
  ResourceType: S.String,
  ResourceDetails: LFResourceDetails,
}) {}
export class LakeFormationDataPermissionDetails extends S.Class<LakeFormationDataPermissionDetails>(
  "LakeFormationDataPermissionDetails",
)({ LFTagPolicy: S.optional(LFTagPolicyDetails) }) {}
export const ListOfLFPermissions = S.Array(S.String);
export class LakeFormationDataPermissionAsset extends S.Class<LakeFormationDataPermissionAsset>(
  "LakeFormationDataPermissionAsset",
)({
  LakeFormationDataPermissionDetails: LakeFormationDataPermissionDetails,
  LakeFormationDataPermissionType: S.String,
  Permissions: ListOfLFPermissions,
  RoleArn: S.optional(S.String),
}) {}
export class AssetDetails extends S.Class<AssetDetails>("AssetDetails")({
  S3SnapshotAsset: S.optional(S3SnapshotAsset),
  RedshiftDataShareAsset: S.optional(RedshiftDataShareAsset),
  ApiGatewayApiAsset: S.optional(ApiGatewayApiAsset),
  S3DataAccessAsset: S.optional(S3DataAccessAsset),
  LakeFormationDataPermissionAsset: S.optional(
    LakeFormationDataPermissionAsset,
  ),
}) {}
export class UpdateAssetResponse extends S.Class<UpdateAssetResponse>(
  "UpdateAssetResponse",
)({
  Arn: S.optional(S.String),
  AssetDetails: S.optional(AssetDetails),
  AssetType: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  DataSetId: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  RevisionId: S.optional(S.String),
  SourceId: S.optional(S.String),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UpdateDataSetResponse extends S.Class<UpdateDataSetResponse>(
  "UpdateDataSetResponse",
)({
  Arn: S.optional(S.String),
  AssetType: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Description: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Origin: S.optional(S.String),
  OriginDetails: S.optional(OriginDetails),
  SourceId: S.optional(S.String),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UpdateEventActionResponse extends S.Class<UpdateEventActionResponse>(
  "UpdateEventActionResponse",
)({
  Action: S.optional(Action),
  Arn: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Event: S.optional(Event),
  Id: S.optional(S.String),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UpdateRevisionResponse extends S.Class<UpdateRevisionResponse>(
  "UpdateRevisionResponse",
)({
  Arn: S.optional(S.String),
  Comment: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  DataSetId: S.optional(S.String),
  Finalized: S.optional(S.Boolean),
  Id: S.optional(S.String),
  SourceId: S.optional(S.String),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  RevocationComment: S.optional(S.String),
  Revoked: S.optional(S.Boolean),
  RevokedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ExportAssetToSignedUrlRequestDetails extends S.Class<ExportAssetToSignedUrlRequestDetails>(
  "ExportAssetToSignedUrlRequestDetails",
)({ AssetId: S.String, DataSetId: S.String, RevisionId: S.String }) {}
export class ImportAssetFromSignedUrlRequestDetails extends S.Class<ImportAssetFromSignedUrlRequestDetails>(
  "ImportAssetFromSignedUrlRequestDetails",
)({
  AssetName: S.String,
  DataSetId: S.String,
  Md5Hash: S.String,
  RevisionId: S.String,
}) {}
export class ImportAssetFromApiGatewayApiRequestDetails extends S.Class<ImportAssetFromApiGatewayApiRequestDetails>(
  "ImportAssetFromApiGatewayApiRequestDetails",
)({
  ApiDescription: S.optional(S.String),
  ApiId: S.String,
  ApiKey: S.optional(S.String),
  ApiName: S.String,
  ApiSpecificationMd5Hash: S.String,
  DataSetId: S.String,
  ProtocolType: S.String,
  RevisionId: S.String,
  Stage: S.String,
}) {}
export class LakeFormationTagPolicyDetails extends S.Class<LakeFormationTagPolicyDetails>(
  "LakeFormationTagPolicyDetails",
)({ Database: S.optional(S.String), Table: S.optional(S.String) }) {}
export const ListOfLakeFormationTagPolicies = S.Array(
  LakeFormationTagPolicyDetails,
);
export class RedshiftDataShareDetails extends S.Class<RedshiftDataShareDetails>(
  "RedshiftDataShareDetails",
)({
  Arn: S.String,
  Database: S.String,
  Function: S.optional(S.String),
  Table: S.optional(S.String),
  Schema: S.optional(S.String),
  View: S.optional(S.String),
}) {}
export const ListOfRedshiftDataShares = S.Array(RedshiftDataShareDetails);
export class S3DataAccessDetails extends S.Class<S3DataAccessDetails>(
  "S3DataAccessDetails",
)({
  KeyPrefixes: S.optional(ListOf__string),
  Keys: S.optional(ListOf__string),
}) {}
export const ListOfS3DataAccesses = S.Array(S3DataAccessDetails);
export class DataUpdateRequestDetails extends S.Class<DataUpdateRequestDetails>(
  "DataUpdateRequestDetails",
)({ DataUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))) }) {}
export class DeprecationRequestDetails extends S.Class<DeprecationRequestDetails>(
  "DeprecationRequestDetails",
)({ DeprecationAt: S.Date.pipe(T.TimestampFormat("date-time")) }) {}
export const ListOfDatabaseLFTagPolicyPermissions = S.Array(S.String);
export const ListOfTableTagPolicyLFPermissions = S.Array(S.String);
export class DataGrantSummaryEntry extends S.Class<DataGrantSummaryEntry>(
  "DataGrantSummaryEntry",
)({
  Name: S.String,
  SenderPrincipal: S.String,
  ReceiverPrincipal: S.String,
  AcceptanceState: S.String,
  AcceptedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EndsAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  DataSetId: S.String,
  SourceDataSetId: S.String,
  Id: S.String,
  Arn: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const ListOfDataGrantSummaryEntry = S.Array(DataGrantSummaryEntry);
export class RevisionEntry extends S.Class<RevisionEntry>("RevisionEntry")({
  Arn: S.String,
  Comment: S.optional(S.String),
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  DataSetId: S.String,
  Finalized: S.optional(S.Boolean),
  Id: S.String,
  SourceId: S.optional(S.String),
  UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  RevocationComment: S.optional(S.String),
  Revoked: S.optional(S.Boolean),
  RevokedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const ListOfRevisionEntry = S.Array(RevisionEntry);
export class DataSetEntry extends S.Class<DataSetEntry>("DataSetEntry")({
  Arn: S.String,
  AssetType: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  Description: S.String,
  Id: S.String,
  Name: S.String,
  Origin: S.String,
  OriginDetails: S.optional(OriginDetails),
  SourceId: S.optional(S.String),
  UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const ListOfDataSetEntry = S.Array(DataSetEntry);
export class EventActionEntry extends S.Class<EventActionEntry>(
  "EventActionEntry",
)({
  Action: Action,
  Arn: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  Event: Event,
  Id: S.String,
  UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const ListOfEventActionEntry = S.Array(EventActionEntry);
export class ExportAssetToSignedUrlResponseDetails extends S.Class<ExportAssetToSignedUrlResponseDetails>(
  "ExportAssetToSignedUrlResponseDetails",
)({
  AssetId: S.String,
  DataSetId: S.String,
  RevisionId: S.String,
  SignedUrl: S.optional(S.String),
  SignedUrlExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class AssetDestinationEntry extends S.Class<AssetDestinationEntry>(
  "AssetDestinationEntry",
)({ AssetId: S.String, Bucket: S.String, Key: S.optional(S.String) }) {}
export const ListOfAssetDestinationEntry = S.Array(AssetDestinationEntry);
export class ExportAssetsToS3ResponseDetails extends S.Class<ExportAssetsToS3ResponseDetails>(
  "ExportAssetsToS3ResponseDetails",
)({
  AssetDestinations: ListOfAssetDestinationEntry,
  DataSetId: S.String,
  Encryption: S.optional(ExportServerSideEncryption),
  RevisionId: S.String,
}) {}
export class RevisionDestinationEntry extends S.Class<RevisionDestinationEntry>(
  "RevisionDestinationEntry",
)({
  Bucket: S.String,
  KeyPattern: S.optional(S.String),
  RevisionId: S.String,
}) {}
export const ListOfRevisionDestinationEntry = S.Array(RevisionDestinationEntry);
export class ExportRevisionsToS3ResponseDetails extends S.Class<ExportRevisionsToS3ResponseDetails>(
  "ExportRevisionsToS3ResponseDetails",
)({
  DataSetId: S.String,
  Encryption: S.optional(ExportServerSideEncryption),
  RevisionDestinations: ListOfRevisionDestinationEntry,
  EventActionArn: S.optional(S.String),
}) {}
export class ImportAssetFromSignedUrlResponseDetails extends S.Class<ImportAssetFromSignedUrlResponseDetails>(
  "ImportAssetFromSignedUrlResponseDetails",
)({
  AssetName: S.String,
  DataSetId: S.String,
  Md5Hash: S.optional(S.String),
  RevisionId: S.String,
  SignedUrl: S.optional(S.String),
  SignedUrlExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class AssetSourceEntry extends S.Class<AssetSourceEntry>(
  "AssetSourceEntry",
)({ Bucket: S.String, Key: S.String }) {}
export const ListOfAssetSourceEntry = S.Array(AssetSourceEntry);
export class ImportAssetsFromS3ResponseDetails extends S.Class<ImportAssetsFromS3ResponseDetails>(
  "ImportAssetsFromS3ResponseDetails",
)({
  AssetSources: ListOfAssetSourceEntry,
  DataSetId: S.String,
  RevisionId: S.String,
}) {}
export class RedshiftDataShareAssetSourceEntry extends S.Class<RedshiftDataShareAssetSourceEntry>(
  "RedshiftDataShareAssetSourceEntry",
)({ DataShareArn: S.String }) {}
export const ListOfRedshiftDataShareAssetSourceEntry = S.Array(
  RedshiftDataShareAssetSourceEntry,
);
export class ImportAssetsFromRedshiftDataSharesResponseDetails extends S.Class<ImportAssetsFromRedshiftDataSharesResponseDetails>(
  "ImportAssetsFromRedshiftDataSharesResponseDetails",
)({
  AssetSources: ListOfRedshiftDataShareAssetSourceEntry,
  DataSetId: S.String,
  RevisionId: S.String,
}) {}
export class ImportAssetFromApiGatewayApiResponseDetails extends S.Class<ImportAssetFromApiGatewayApiResponseDetails>(
  "ImportAssetFromApiGatewayApiResponseDetails",
)({
  ApiDescription: S.optional(S.String),
  ApiId: S.String,
  ApiKey: S.optional(S.String),
  ApiName: S.String,
  ApiSpecificationMd5Hash: S.String,
  ApiSpecificationUploadUrl: S.String,
  ApiSpecificationUploadUrlExpiresAt: S.Date.pipe(
    T.TimestampFormat("date-time"),
  ),
  DataSetId: S.String,
  ProtocolType: S.String,
  RevisionId: S.String,
  Stage: S.String,
}) {}
export class S3DataAccessAssetSourceEntry extends S.Class<S3DataAccessAssetSourceEntry>(
  "S3DataAccessAssetSourceEntry",
)({
  Bucket: S.String,
  KeyPrefixes: S.optional(ListOf__string),
  Keys: S.optional(ListOf__string),
  KmsKeysToGrant: S.optional(ListOfKmsKeysToGrant),
}) {}
export class CreateS3DataAccessFromS3BucketResponseDetails extends S.Class<CreateS3DataAccessFromS3BucketResponseDetails>(
  "CreateS3DataAccessFromS3BucketResponseDetails",
)({
  AssetSource: S3DataAccessAssetSourceEntry,
  DataSetId: S.String,
  RevisionId: S.String,
}) {}
export class DatabaseLFTagPolicyAndPermissions extends S.Class<DatabaseLFTagPolicyAndPermissions>(
  "DatabaseLFTagPolicyAndPermissions",
)({
  Expression: ListOfLFTags,
  Permissions: ListOfDatabaseLFTagPolicyPermissions,
}) {}
export class TableLFTagPolicyAndPermissions extends S.Class<TableLFTagPolicyAndPermissions>(
  "TableLFTagPolicyAndPermissions",
)({
  Expression: ListOfLFTags,
  Permissions: ListOfTableTagPolicyLFPermissions,
}) {}
export class ImportAssetsFromLakeFormationTagPolicyResponseDetails extends S.Class<ImportAssetsFromLakeFormationTagPolicyResponseDetails>(
  "ImportAssetsFromLakeFormationTagPolicyResponseDetails",
)({
  CatalogId: S.String,
  Database: S.optional(DatabaseLFTagPolicyAndPermissions),
  Table: S.optional(TableLFTagPolicyAndPermissions),
  RoleArn: S.String,
  DataSetId: S.String,
  RevisionId: S.String,
}) {}
export class ResponseDetails extends S.Class<ResponseDetails>(
  "ResponseDetails",
)({
  ExportAssetToSignedUrl: S.optional(ExportAssetToSignedUrlResponseDetails),
  ExportAssetsToS3: S.optional(ExportAssetsToS3ResponseDetails),
  ExportRevisionsToS3: S.optional(ExportRevisionsToS3ResponseDetails),
  ImportAssetFromSignedUrl: S.optional(ImportAssetFromSignedUrlResponseDetails),
  ImportAssetsFromS3: S.optional(ImportAssetsFromS3ResponseDetails),
  ImportAssetsFromRedshiftDataShares: S.optional(
    ImportAssetsFromRedshiftDataSharesResponseDetails,
  ),
  ImportAssetFromApiGatewayApi: S.optional(
    ImportAssetFromApiGatewayApiResponseDetails,
  ),
  CreateS3DataAccessFromS3Bucket: S.optional(
    CreateS3DataAccessFromS3BucketResponseDetails,
  ),
  ImportAssetsFromLakeFormationTagPolicy: S.optional(
    ImportAssetsFromLakeFormationTagPolicyResponseDetails,
  ),
}) {}
export class ImportAssetFromSignedUrlJobErrorDetails extends S.Class<ImportAssetFromSignedUrlJobErrorDetails>(
  "ImportAssetFromSignedUrlJobErrorDetails",
)({ AssetName: S.String }) {}
export class Details extends S.Class<Details>("Details")({
  ImportAssetFromSignedUrlJobErrorDetails: S.optional(
    ImportAssetFromSignedUrlJobErrorDetails,
  ),
  ImportAssetsFromS3JobErrorDetails: S.optional(ListOfAssetSourceEntry),
}) {}
export class JobError extends S.Class<JobError>("JobError")({
  Code: S.String,
  Details: S.optional(Details),
  LimitName: S.optional(S.String),
  LimitValue: S.optional(S.Number),
  Message: S.String,
  ResourceId: S.optional(S.String),
  ResourceType: S.optional(S.String),
}) {}
export const ListOfJobError = S.Array(JobError);
export class JobEntry extends S.Class<JobEntry>("JobEntry")({
  Arn: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  Details: ResponseDetails,
  Errors: S.optional(ListOfJobError),
  Id: S.String,
  State: S.String,
  Type: S.String,
  UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const ListOfJobEntry = S.Array(JobEntry);
export class ReceivedDataGrantSummariesEntry extends S.Class<ReceivedDataGrantSummariesEntry>(
  "ReceivedDataGrantSummariesEntry",
)({
  Name: S.String,
  SenderPrincipal: S.String,
  ReceiverPrincipal: S.String,
  AcceptanceState: S.String,
  AcceptedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EndsAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  DataSetId: S.String,
  Id: S.String,
  Arn: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const ListOfReceivedDataGrantSummariesEntry = S.Array(
  ReceivedDataGrantSummariesEntry,
);
export class AssetEntry extends S.Class<AssetEntry>("AssetEntry")({
  Arn: S.String,
  AssetDetails: AssetDetails,
  AssetType: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  DataSetId: S.String,
  Id: S.String,
  Name: S.String,
  RevisionId: S.String,
  SourceId: S.optional(S.String),
  UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const ListOfAssetEntry = S.Array(AssetEntry);
export class ScopeDetails extends S.Class<ScopeDetails>("ScopeDetails")({
  LakeFormationTagPolicies: S.optional(ListOfLakeFormationTagPolicies),
  RedshiftDataShares: S.optional(ListOfRedshiftDataShares),
  S3DataAccesses: S.optional(ListOfS3DataAccesses),
}) {}
export class SchemaChangeDetails extends S.Class<SchemaChangeDetails>(
  "SchemaChangeDetails",
)({ Name: S.String, Type: S.String, Description: S.optional(S.String) }) {}
export const ListOfSchemaChangeDetails = S.Array(SchemaChangeDetails);
export class CreateDataGrantResponse extends S.Class<CreateDataGrantResponse>(
  "CreateDataGrantResponse",
)({
  Name: S.String,
  SenderPrincipal: S.String,
  ReceiverPrincipal: S.String,
  Description: S.optional(S.String),
  AcceptanceState: S.String,
  AcceptedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EndsAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  GrantDistributionScope: S.String,
  DataSetId: S.String,
  SourceDataSetId: S.String,
  Id: S.String,
  Arn: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  Tags: S.optional(MapOf__string),
}) {}
export class CreateDataSetResponse extends S.Class<CreateDataSetResponse>(
  "CreateDataSetResponse",
)({
  Arn: S.optional(S.String),
  AssetType: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Description: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Origin: S.optional(S.String),
  OriginDetails: S.optional(OriginDetails),
  SourceId: S.optional(S.String),
  Tags: S.optional(MapOf__string),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ListDataGrantsResponse extends S.Class<ListDataGrantsResponse>(
  "ListDataGrantsResponse",
)({
  DataGrantSummaries: S.optional(ListOfDataGrantSummaryEntry),
  NextToken: S.optional(S.String),
}) {}
export class ListDataSetRevisionsResponse extends S.Class<ListDataSetRevisionsResponse>(
  "ListDataSetRevisionsResponse",
)({
  NextToken: S.optional(S.String),
  Revisions: S.optional(ListOfRevisionEntry),
}) {}
export class ListDataSetsResponse extends S.Class<ListDataSetsResponse>(
  "ListDataSetsResponse",
)({
  DataSets: S.optional(ListOfDataSetEntry),
  NextToken: S.optional(S.String),
}) {}
export class ListEventActionsResponse extends S.Class<ListEventActionsResponse>(
  "ListEventActionsResponse",
)({
  EventActions: S.optional(ListOfEventActionEntry),
  NextToken: S.optional(S.String),
}) {}
export class ListJobsResponse extends S.Class<ListJobsResponse>(
  "ListJobsResponse",
)({ Jobs: S.optional(ListOfJobEntry), NextToken: S.optional(S.String) }) {}
export class ListReceivedDataGrantsResponse extends S.Class<ListReceivedDataGrantsResponse>(
  "ListReceivedDataGrantsResponse",
)({
  DataGrantSummaries: S.optional(ListOfReceivedDataGrantSummariesEntry),
  NextToken: S.optional(S.String),
}) {}
export class ListRevisionAssetsResponse extends S.Class<ListRevisionAssetsResponse>(
  "ListRevisionAssetsResponse",
)({ Assets: S.optional(ListOfAssetEntry), NextToken: S.optional(S.String) }) {}
export class ExportAssetsToS3RequestDetails extends S.Class<ExportAssetsToS3RequestDetails>(
  "ExportAssetsToS3RequestDetails",
)({
  AssetDestinations: ListOfAssetDestinationEntry,
  DataSetId: S.String,
  Encryption: S.optional(ExportServerSideEncryption),
  RevisionId: S.String,
}) {}
export class ExportRevisionsToS3RequestDetails extends S.Class<ExportRevisionsToS3RequestDetails>(
  "ExportRevisionsToS3RequestDetails",
)({
  DataSetId: S.String,
  Encryption: S.optional(ExportServerSideEncryption),
  RevisionDestinations: ListOfRevisionDestinationEntry,
}) {}
export class ImportAssetsFromS3RequestDetails extends S.Class<ImportAssetsFromS3RequestDetails>(
  "ImportAssetsFromS3RequestDetails",
)({
  AssetSources: ListOfAssetSourceEntry,
  DataSetId: S.String,
  RevisionId: S.String,
}) {}
export class ImportAssetsFromRedshiftDataSharesRequestDetails extends S.Class<ImportAssetsFromRedshiftDataSharesRequestDetails>(
  "ImportAssetsFromRedshiftDataSharesRequestDetails",
)({
  AssetSources: ListOfRedshiftDataShareAssetSourceEntry,
  DataSetId: S.String,
  RevisionId: S.String,
}) {}
export class SchemaChangeRequestDetails extends S.Class<SchemaChangeRequestDetails>(
  "SchemaChangeRequestDetails",
)({
  Changes: S.optional(ListOfSchemaChangeDetails),
  SchemaChangeAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class NotificationDetails extends S.Class<NotificationDetails>(
  "NotificationDetails",
)({
  DataUpdate: S.optional(DataUpdateRequestDetails),
  Deprecation: S.optional(DeprecationRequestDetails),
  SchemaChange: S.optional(SchemaChangeRequestDetails),
}) {}
export class CreateEventActionRequest extends S.Class<CreateEventActionRequest>(
  "CreateEventActionRequest",
)(
  { Action: Action, Event: Event, Tags: S.optional(MapOf__string) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/event-actions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendDataSetNotificationRequest extends S.Class<SendDataSetNotificationRequest>(
  "SendDataSetNotificationRequest",
)(
  {
    Scope: S.optional(ScopeDetails),
    ClientToken: S.optional(S.String),
    Comment: S.optional(S.String),
    DataSetId: S.String.pipe(T.HttpLabel()),
    Details: S.optional(NotificationDetails),
    Type: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/data-sets/{DataSetId}/notification" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendDataSetNotificationResponse extends S.Class<SendDataSetNotificationResponse>(
  "SendDataSetNotificationResponse",
)({}) {}
export class CreateS3DataAccessFromS3BucketRequestDetails extends S.Class<CreateS3DataAccessFromS3BucketRequestDetails>(
  "CreateS3DataAccessFromS3BucketRequestDetails",
)({
  AssetSource: S3DataAccessAssetSourceEntry,
  DataSetId: S.String,
  RevisionId: S.String,
}) {}
export class ImportAssetsFromLakeFormationTagPolicyRequestDetails extends S.Class<ImportAssetsFromLakeFormationTagPolicyRequestDetails>(
  "ImportAssetsFromLakeFormationTagPolicyRequestDetails",
)({
  CatalogId: S.String,
  Database: S.optional(DatabaseLFTagPolicyAndPermissions),
  Table: S.optional(TableLFTagPolicyAndPermissions),
  RoleArn: S.String,
  DataSetId: S.String,
  RevisionId: S.String,
}) {}
export class RequestDetails extends S.Class<RequestDetails>("RequestDetails")({
  ExportAssetToSignedUrl: S.optional(ExportAssetToSignedUrlRequestDetails),
  ExportAssetsToS3: S.optional(ExportAssetsToS3RequestDetails),
  ExportRevisionsToS3: S.optional(ExportRevisionsToS3RequestDetails),
  ImportAssetFromSignedUrl: S.optional(ImportAssetFromSignedUrlRequestDetails),
  ImportAssetsFromS3: S.optional(ImportAssetsFromS3RequestDetails),
  ImportAssetsFromRedshiftDataShares: S.optional(
    ImportAssetsFromRedshiftDataSharesRequestDetails,
  ),
  ImportAssetFromApiGatewayApi: S.optional(
    ImportAssetFromApiGatewayApiRequestDetails,
  ),
  CreateS3DataAccessFromS3Bucket: S.optional(
    CreateS3DataAccessFromS3BucketRequestDetails,
  ),
  ImportAssetsFromLakeFormationTagPolicy: S.optional(
    ImportAssetsFromLakeFormationTagPolicyRequestDetails,
  ),
}) {}
export class CreateEventActionResponse extends S.Class<CreateEventActionResponse>(
  "CreateEventActionResponse",
)({
  Action: S.optional(Action),
  Arn: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Event: S.optional(Event),
  Id: S.optional(S.String),
  Tags: S.optional(MapOf__string),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class CreateJobRequest extends S.Class<CreateJobRequest>(
  "CreateJobRequest",
)(
  { Details: RequestDetails, Type: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/v1/jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetJobResponse extends S.Class<GetJobResponse>("GetJobResponse")({
  Arn: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Details: S.optional(ResponseDetails),
  Errors: S.optional(ListOfJobError),
  Id: S.optional(S.String),
  State: S.optional(S.String),
  Type: S.optional(S.String),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class CreateJobResponse extends S.Class<CreateJobResponse>(
  "CreateJobResponse",
)({
  Arn: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Details: S.optional(ResponseDetails),
  Errors: S.optional(ListOfJobError),
  Id: S.optional(S.String),
  State: S.optional(S.String),
  Type: S.optional(S.String),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class GetAssetResponse extends S.Class<GetAssetResponse>(
  "GetAssetResponse",
)({
  Arn: S.optional(S.String),
  AssetDetails: S.optional(AssetDetails),
  AssetType: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  DataSetId: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  RevisionId: S.optional(S.String),
  SourceId: S.optional(S.String),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
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
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ServiceLimitExceededException extends S.TaggedError<ServiceLimitExceededException>()(
  "ServiceLimitExceededException",
  {},
) {}

//# Operations
/**
 * This operation starts a job.
 */
export const startJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartJobRequest,
  output: StartJobResponse,
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
 * This operation tags a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [],
}));
/**
 * This operation removes one or more tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [],
}));
/**
 * This operation accepts a data grant.
 */
export const acceptDataGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptDataGrantRequest,
  output: AcceptDataGrantResponse,
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
 * This operation cancels a job. Jobs can be cancelled only when they are in the WAITING
 * state.
 */
export const cancelJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelJobRequest,
  output: CancelJobResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation creates a revision for a data set.
 */
export const createRevision = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRevisionRequest,
  output: CreateRevisionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation deletes an asset.
 */
export const deleteAsset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssetRequest,
  output: DeleteAssetResponse,
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
 * This operation deletes a data grant.
 */
export const deleteDataGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataGrantRequest,
  output: DeleteDataGrantResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation deletes a data set.
 */
export const deleteDataSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataSetRequest,
  output: DeleteDataSetResponse,
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
 * This operation deletes the event action.
 */
export const deleteEventAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventActionRequest,
  output: DeleteEventActionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation deletes a revision.
 */
export const deleteRevision = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRevisionRequest,
  output: DeleteRevisionResponse,
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
 * This operation returns information about a data grant.
 */
export const getDataGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataGrantRequest,
  output: GetDataGrantResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation returns information about a data set.
 */
export const getDataSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataSetRequest,
  output: GetDataSetResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation retrieves information about an event action.
 */
export const getEventAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventActionRequest,
  output: GetEventActionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation returns information about a received data grant.
 */
export const getReceivedDataGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetReceivedDataGrantRequest,
    output: GetReceivedDataGrantResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * This operation returns information about a revision.
 */
export const getRevision = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRevisionRequest,
  output: GetRevisionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation lists the tags on the resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [],
}));
/**
 * This operation revokes subscribers' access to a revision.
 */
export const revokeRevision = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RevokeRevisionRequest,
  output: RevokeRevisionResponse,
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
 * This operation invokes an API Gateway API asset. The request is proxied to the
 * provider’s API Gateway API.
 */
export const sendApiAsset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendApiAssetRequest,
  output: SendApiAssetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation updates an asset.
 */
export const updateAsset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssetRequest,
  output: UpdateAssetResponse,
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
 * This operation updates a data set.
 */
export const updateDataSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataSetRequest,
  output: UpdateDataSetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation updates the event action.
 */
export const updateEventAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEventActionRequest,
  output: UpdateEventActionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation updates a revision.
 */
export const updateRevision = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRevisionRequest,
  output: UpdateRevisionResponse,
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
 * This operation creates a data set.
 */
export const createDataSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataSetRequest,
  output: CreateDataSetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceLimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation returns information about all data grants.
 */
export const listDataGrants = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDataGrantsRequest,
  output: ListDataGrantsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation lists a data set's revisions sorted by CreatedAt in descending
 * order.
 */
export const listDataSetRevisions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDataSetRevisionsRequest,
    output: ListDataSetRevisionsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * This operation lists your data sets. When listing by origin OWNED, results are sorted by
 * CreatedAt in descending order. When listing by origin ENTITLED, there is no order.
 */
export const listDataSets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDataSetsRequest,
  output: ListDataSetsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation lists your event actions.
 */
export const listEventActions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEventActionsRequest,
  output: ListEventActionsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation lists your jobs sorted by CreatedAt in descending order.
 */
export const listJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListJobsRequest,
  output: ListJobsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation returns information about all received data grants.
 */
export const listReceivedDataGrants = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListReceivedDataGrantsRequest,
    output: ListReceivedDataGrantsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * This operation lists a revision's assets sorted alphabetically in descending
 * order.
 */
export const listRevisionAssets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRevisionAssetsRequest,
  output: ListRevisionAssetsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation creates a data grant.
 */
export const createDataGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataGrantRequest,
  output: CreateDataGrantResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceLimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The type of event associated with the data set.
 */
export const sendDataSetNotification = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SendDataSetNotificationRequest,
    output: SendDataSetNotificationResponse,
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
 * This operation creates an event action.
 */
export const createEventAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEventActionRequest,
  output: CreateEventActionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceLimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation returns information about a job.
 */
export const getJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobRequest,
  output: GetJobResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation creates a job.
 */
export const createJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateJobRequest,
  output: CreateJobResponse,
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
 * This operation returns information about an asset.
 */
export const getAsset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssetRequest,
  output: GetAssetResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

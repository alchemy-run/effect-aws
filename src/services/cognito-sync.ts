import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://cognito-sync.amazonaws.com/doc/2014-06-30/");
const svc = T.AwsApiService({
  sdkId: "Cognito Sync",
  serviceShapeName: "AWSCognitoSyncService",
});
const auth = T.AwsAuthSigv4({ name: "cognito-sync" });
const ver = T.ServiceVersion("2014-06-30");
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
                        url: "https://cognito-sync-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://cognito-sync-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://cognito-sync.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://cognito-sync.{Region}.{PartitionResult#dnsSuffix}",
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
export class BulkPublishRequest extends S.Class<BulkPublishRequest>(
  "BulkPublishRequest",
)(
  { IdentityPoolId: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/identitypools/{IdentityPoolId}/bulkpublish",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDatasetRequest extends S.Class<DeleteDatasetRequest>(
  "DeleteDatasetRequest",
)(
  {
    IdentityPoolId: S.String.pipe(T.HttpLabel()),
    IdentityId: S.String.pipe(T.HttpLabel()),
    DatasetName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/identitypools/{IdentityPoolId}/identities/{IdentityId}/datasets/{DatasetName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDatasetRequest extends S.Class<DescribeDatasetRequest>(
  "DescribeDatasetRequest",
)(
  {
    IdentityPoolId: S.String.pipe(T.HttpLabel()),
    IdentityId: S.String.pipe(T.HttpLabel()),
    DatasetName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/identitypools/{IdentityPoolId}/identities/{IdentityId}/datasets/{DatasetName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeIdentityPoolUsageRequest extends S.Class<DescribeIdentityPoolUsageRequest>(
  "DescribeIdentityPoolUsageRequest",
)(
  { IdentityPoolId: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/identitypools/{IdentityPoolId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeIdentityUsageRequest extends S.Class<DescribeIdentityUsageRequest>(
  "DescribeIdentityUsageRequest",
)(
  {
    IdentityPoolId: S.String.pipe(T.HttpLabel()),
    IdentityId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/identitypools/{IdentityPoolId}/identities/{IdentityId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBulkPublishDetailsRequest extends S.Class<GetBulkPublishDetailsRequest>(
  "GetBulkPublishDetailsRequest",
)(
  { IdentityPoolId: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/identitypools/{IdentityPoolId}/getBulkPublishDetails",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCognitoEventsRequest extends S.Class<GetCognitoEventsRequest>(
  "GetCognitoEventsRequest",
)(
  { IdentityPoolId: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/identitypools/{IdentityPoolId}/events" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIdentityPoolConfigurationRequest extends S.Class<GetIdentityPoolConfigurationRequest>(
  "GetIdentityPoolConfigurationRequest",
)(
  { IdentityPoolId: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/identitypools/{IdentityPoolId}/configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDatasetsRequest extends S.Class<ListDatasetsRequest>(
  "ListDatasetsRequest",
)(
  {
    IdentityPoolId: S.String.pipe(T.HttpLabel()),
    IdentityId: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/identitypools/{IdentityPoolId}/identities/{IdentityId}/datasets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIdentityPoolUsageRequest extends S.Class<ListIdentityPoolUsageRequest>(
  "ListIdentityPoolUsageRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/identitypools" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRecordsRequest extends S.Class<ListRecordsRequest>(
  "ListRecordsRequest",
)(
  {
    IdentityPoolId: S.String.pipe(T.HttpLabel()),
    IdentityId: S.String.pipe(T.HttpLabel()),
    DatasetName: S.String.pipe(T.HttpLabel()),
    LastSyncCount: S.optional(S.Number).pipe(T.HttpQuery("lastSyncCount")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    SyncSessionToken: S.optional(S.String).pipe(
      T.HttpQuery("syncSessionToken"),
    ),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/identitypools/{IdentityPoolId}/identities/{IdentityId}/datasets/{DatasetName}/records",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterDeviceRequest extends S.Class<RegisterDeviceRequest>(
  "RegisterDeviceRequest",
)(
  {
    IdentityPoolId: S.String.pipe(T.HttpLabel()),
    IdentityId: S.String.pipe(T.HttpLabel()),
    Platform: S.String,
    Token: S.String,
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/identitypools/{IdentityPoolId}/identity/{IdentityId}/device",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SubscribeToDatasetRequest extends S.Class<SubscribeToDatasetRequest>(
  "SubscribeToDatasetRequest",
)(
  {
    IdentityPoolId: S.String.pipe(T.HttpLabel()),
    IdentityId: S.String.pipe(T.HttpLabel()),
    DatasetName: S.String.pipe(T.HttpLabel()),
    DeviceId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/identitypools/{IdentityPoolId}/identities/{IdentityId}/datasets/{DatasetName}/subscriptions/{DeviceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SubscribeToDatasetResponse extends S.Class<SubscribeToDatasetResponse>(
  "SubscribeToDatasetResponse",
)({}, ns) {}
export class UnsubscribeFromDatasetRequest extends S.Class<UnsubscribeFromDatasetRequest>(
  "UnsubscribeFromDatasetRequest",
)(
  {
    IdentityPoolId: S.String.pipe(T.HttpLabel()),
    IdentityId: S.String.pipe(T.HttpLabel()),
    DatasetName: S.String.pipe(T.HttpLabel()),
    DeviceId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/identitypools/{IdentityPoolId}/identities/{IdentityId}/datasets/{DatasetName}/subscriptions/{DeviceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UnsubscribeFromDatasetResponse extends S.Class<UnsubscribeFromDatasetResponse>(
  "UnsubscribeFromDatasetResponse",
)({}, ns) {}
export const ApplicationArnList = S.Array(S.String);
export class Dataset extends S.Class<Dataset>("Dataset")({
  IdentityId: S.optional(S.String),
  DatasetName: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedBy: S.optional(S.String),
  DataStorage: S.optional(S.Number),
  NumRecords: S.optional(S.Number),
}) {}
export const DatasetList = S.Array(Dataset);
export class IdentityPoolUsage extends S.Class<IdentityPoolUsage>(
  "IdentityPoolUsage",
)({
  IdentityPoolId: S.optional(S.String),
  SyncSessionsCount: S.optional(S.Number),
  DataStorage: S.optional(S.Number),
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const IdentityPoolUsageList = S.Array(IdentityPoolUsage);
export const MergedDatasetNameList = S.Array(S.String);
export const Events = S.Record({ key: S.String, value: S.String });
export class PushSync extends S.Class<PushSync>("PushSync")({
  ApplicationArns: S.optional(ApplicationArnList),
  RoleArn: S.optional(S.String),
}) {}
export class CognitoStreams extends S.Class<CognitoStreams>("CognitoStreams")({
  StreamName: S.optional(S.String),
  RoleArn: S.optional(S.String),
  StreamingStatus: S.optional(S.String),
}) {}
export class RecordPatch extends S.Class<RecordPatch>("RecordPatch")({
  Op: S.String,
  Key: S.String,
  Value: S.optional(S.String),
  SyncCount: S.Number,
  DeviceLastModifiedDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const RecordPatchList = S.Array(RecordPatch);
export class BulkPublishResponse extends S.Class<BulkPublishResponse>(
  "BulkPublishResponse",
)({ IdentityPoolId: S.optional(S.String) }, ns) {}
export class DescribeDatasetResponse extends S.Class<DescribeDatasetResponse>(
  "DescribeDatasetResponse",
)({ Dataset: S.optional(Dataset) }, ns) {}
export class GetBulkPublishDetailsResponse extends S.Class<GetBulkPublishDetailsResponse>(
  "GetBulkPublishDetailsResponse",
)(
  {
    IdentityPoolId: S.optional(S.String),
    BulkPublishStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    BulkPublishCompleteTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    BulkPublishStatus: S.optional(S.String),
    FailureMessage: S.optional(S.String),
  },
  ns,
) {}
export class GetCognitoEventsResponse extends S.Class<GetCognitoEventsResponse>(
  "GetCognitoEventsResponse",
)({ Events: S.optional(Events) }, ns) {}
export class GetIdentityPoolConfigurationResponse extends S.Class<GetIdentityPoolConfigurationResponse>(
  "GetIdentityPoolConfigurationResponse",
)(
  {
    IdentityPoolId: S.optional(S.String),
    PushSync: S.optional(PushSync),
    CognitoStreams: S.optional(CognitoStreams),
  },
  ns,
) {}
export class ListDatasetsResponse extends S.Class<ListDatasetsResponse>(
  "ListDatasetsResponse",
)(
  {
    Datasets: S.optional(DatasetList),
    Count: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListIdentityPoolUsageResponse extends S.Class<ListIdentityPoolUsageResponse>(
  "ListIdentityPoolUsageResponse",
)(
  {
    IdentityPoolUsages: S.optional(IdentityPoolUsageList),
    MaxResults: S.optional(S.Number),
    Count: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class RegisterDeviceResponse extends S.Class<RegisterDeviceResponse>(
  "RegisterDeviceResponse",
)({ DeviceId: S.optional(S.String) }, ns) {}
export class SetCognitoEventsRequest extends S.Class<SetCognitoEventsRequest>(
  "SetCognitoEventsRequest",
)(
  { IdentityPoolId: S.String.pipe(T.HttpLabel()), Events: Events },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/identitypools/{IdentityPoolId}/events" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SetCognitoEventsResponse extends S.Class<SetCognitoEventsResponse>(
  "SetCognitoEventsResponse",
)({}, ns) {}
export class SetIdentityPoolConfigurationRequest extends S.Class<SetIdentityPoolConfigurationRequest>(
  "SetIdentityPoolConfigurationRequest",
)(
  {
    IdentityPoolId: S.String.pipe(T.HttpLabel()),
    PushSync: S.optional(PushSync),
    CognitoStreams: S.optional(CognitoStreams),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/identitypools/{IdentityPoolId}/configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRecordsRequest extends S.Class<UpdateRecordsRequest>(
  "UpdateRecordsRequest",
)(
  {
    IdentityPoolId: S.String.pipe(T.HttpLabel()),
    IdentityId: S.String.pipe(T.HttpLabel()),
    DatasetName: S.String.pipe(T.HttpLabel()),
    DeviceId: S.optional(S.String),
    RecordPatches: S.optional(RecordPatchList),
    SyncSessionToken: S.String,
    ClientContext: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-Client-Context"),
    ),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/identitypools/{IdentityPoolId}/identities/{IdentityId}/datasets/{DatasetName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class IdentityUsage extends S.Class<IdentityUsage>("IdentityUsage")({
  IdentityId: S.optional(S.String),
  IdentityPoolId: S.optional(S.String),
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DatasetCount: S.optional(S.Number),
  DataStorage: S.optional(S.Number),
}) {}
export class Record extends S.Class<Record>("Record")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
  SyncCount: S.optional(S.Number),
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedBy: S.optional(S.String),
  DeviceLastModifiedDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const RecordList = S.Array(Record);
export class DeleteDatasetResponse extends S.Class<DeleteDatasetResponse>(
  "DeleteDatasetResponse",
)({ Dataset: S.optional(Dataset) }, ns) {}
export class DescribeIdentityPoolUsageResponse extends S.Class<DescribeIdentityPoolUsageResponse>(
  "DescribeIdentityPoolUsageResponse",
)({ IdentityPoolUsage: S.optional(IdentityPoolUsage) }, ns) {}
export class DescribeIdentityUsageResponse extends S.Class<DescribeIdentityUsageResponse>(
  "DescribeIdentityUsageResponse",
)({ IdentityUsage: S.optional(IdentityUsage) }, ns) {}
export class ListRecordsResponse extends S.Class<ListRecordsResponse>(
  "ListRecordsResponse",
)(
  {
    Records: S.optional(RecordList),
    NextToken: S.optional(S.String),
    Count: S.optional(S.Number),
    DatasetSyncCount: S.optional(S.Number),
    LastModifiedBy: S.optional(S.String),
    MergedDatasetNames: S.optional(MergedDatasetNameList),
    DatasetExists: S.optional(S.Boolean),
    DatasetDeletedAfterRequestedSyncCount: S.optional(S.Boolean),
    SyncSessionToken: S.optional(S.String),
  },
  ns,
) {}
export class SetIdentityPoolConfigurationResponse extends S.Class<SetIdentityPoolConfigurationResponse>(
  "SetIdentityPoolConfigurationResponse",
)(
  {
    IdentityPoolId: S.optional(S.String),
    PushSync: S.optional(PushSync),
    CognitoStreams: S.optional(CognitoStreams),
  },
  ns,
) {}
export class UpdateRecordsResponse extends S.Class<UpdateRecordsResponse>(
  "UpdateRecordsResponse",
)({ Records: S.optional(RecordList) }, ns) {}

//# Errors
export class InternalErrorException extends S.TaggedError<InternalErrorException>()(
  "InternalErrorException",
  {},
  T.AwsQueryError({ code: "InternalError", httpResponseCode: 500 }),
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  {},
  T.AwsQueryError({ code: "InvalidParameter", httpResponseCode: 400 }),
) {}
export class NotAuthorizedException extends S.TaggedError<NotAuthorizedException>()(
  "NotAuthorizedException",
  {},
  T.AwsQueryError({ code: "NotAuthorizedError", httpResponseCode: 403 }),
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
  T.AwsQueryError({ code: "ResourceNotFound", httpResponseCode: 404 }),
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {},
  T.AwsQueryError({ code: "TooManyRequests", httpResponseCode: 429 }),
) {}
export class InvalidConfigurationException extends S.TaggedError<InvalidConfigurationException>()(
  "InvalidConfigurationException",
  {},
  T.AwsQueryError({ code: "InvalidConfiguration", httpResponseCode: 400 }),
) {}
export class AlreadyStreamedException extends S.TaggedError<AlreadyStreamedException>()(
  "AlreadyStreamedException",
  { message: S.String },
  T.AwsQueryError({ code: "AlreadyStreamed", httpResponseCode: 400 }),
) {}
export class DuplicateRequestException extends S.TaggedError<DuplicateRequestException>()(
  "DuplicateRequestException",
  { message: S.String },
  T.AwsQueryError({ code: "DuplicateRequest", httpResponseCode: 400 }),
) {}
export class ResourceConflictException extends S.TaggedError<ResourceConflictException>()(
  "ResourceConflictException",
  { message: S.String },
  T.AwsQueryError({ code: "ResourceConflict", httpResponseCode: 409 }),
) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { message: S.String },
  T.AwsQueryError({ code: "ConcurrentModification", httpResponseCode: 400 }),
) {}
export class InvalidLambdaFunctionOutputException extends S.TaggedError<InvalidLambdaFunctionOutputException>()(
  "InvalidLambdaFunctionOutputException",
  { message: S.String },
  T.AwsQueryError({
    code: "InvalidLambdaFunctionOutput",
    httpResponseCode: 400,
  }),
) {}
export class LambdaThrottledException extends S.TaggedError<LambdaThrottledException>()(
  "LambdaThrottledException",
  { message: S.String },
  T.AwsQueryError({ code: "LambdaThrottled", httpResponseCode: 429 }),
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.String },
  T.AwsQueryError({ code: "LimitExceeded", httpResponseCode: 400 }),
) {}

//# Operations
/**
 * Lists datasets for an identity. With Amazon Cognito Sync, each identity has access only to
 * its own data. Thus, the credentials used to make this API call need to have access to the
 * identity data.
 *
 * ListDatasets can be called with temporary user credentials provided by Cognito
 * Identity or with developer credentials. You should use the Cognito Identity credentials to
 * make this API call.
 *
 * ListDatasets
 * The following examples have been edited for readability.
 *
 * POST / HTTP/1.1
 * CONTENT-TYPE: application/json
 * X-AMZN-REQUESTID: 15225768-209f-4078-aaed-7494ace9f2db
 * X-AMZ-TARGET: com.amazonaws.cognito.sync.model.AWSCognitoSyncService.ListDatasets
 * HOST: cognito-sync.us-east-1.amazonaws.com:443
 * X-AMZ-DATE: 20141111T215640Z
 * AUTHORIZATION: AWS4-HMAC-SHA256 Credential=, SignedHeaders=content-type;host;x-amz-date;x-amz-target;x-amzn-requestid, Signature=
 *
 * {
 * "Operation": "com.amazonaws.cognito.sync.model#ListDatasets",
 * "Service": "com.amazonaws.cognito.sync.model#AWSCognitoSyncService",
 * "Input":
 * {
 * "IdentityPoolId": "IDENTITY_POOL_ID",
 * "IdentityId": "IDENTITY_ID",
 * "MaxResults": "3"
 * }
 * }
 *
 * 1.1 200 OK
 * x-amzn-requestid: 15225768-209f-4078-aaed-7494ace9f2db, 15225768-209f-4078-aaed-7494ace9f2db
 * content-type: application/json
 * content-length: 355
 * date: Tue, 11 Nov 2014 21:56:40 GMT
 *
 * {
 * "Output":
 * {
 * "__type": "com.amazonaws.cognito.sync.model#ListDatasetsResponse",
 * "Count": 1,
 * "Datasets": [
 * {
 * "CreationDate": 1.412974057151E9,
 * "DataStorage": 16,
 * "DatasetName": "my_list",
 * "IdentityId": "IDENTITY_ID",
 * "LastModifiedBy": "123456789012",
 * "LastModifiedDate": 1.412974057244E9,
 * "NumRecords": 1
 * }],
 * "NextToken": null
 * },
 * "Version": "1.0"
 * }
 */
export const listDatasets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDatasetsRequest,
  output: ListDatasetsResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets a list of identity pools registered with Cognito.
 *
 * ListIdentityPoolUsage can only be called with developer credentials. You
 * cannot make this API call with the temporary user credentials provided by Cognito
 * Identity.
 *
 * ListIdentityPoolUsage
 * The following examples have been edited for readability.
 *
 * POST / HTTP/1.1
 * CONTENT-TYPE: application/json
 * X-AMZN-REQUESTID: 9be7c425-ef05-48c0-aef3-9f0ff2fe17d3
 * X-AMZ-TARGET: com.amazonaws.cognito.sync.model.AWSCognitoSyncService.ListIdentityPoolUsage
 * HOST: cognito-sync.us-east-1.amazonaws.com:443
 * X-AMZ-DATE: 20141111T211414Z
 * AUTHORIZATION: AWS4-HMAC-SHA256 Credential=, SignedHeaders=content-type;host;x-amz-date;x-amz-target;x-amzn-requestid, Signature=
 *
 * {
 * "Operation": "com.amazonaws.cognito.sync.model#ListIdentityPoolUsage",
 * "Service": "com.amazonaws.cognito.sync.model#AWSCognitoSyncService",
 * "Input":
 * {
 * "MaxResults": "2"
 * }
 * }
 *
 * 1.1 200 OK
 * x-amzn-requestid: 9be7c425-ef05-48c0-aef3-9f0ff2fe17d3
 * content-type: application/json
 * content-length: 519
 * date: Tue, 11 Nov 2014 21:14:14 GMT
 *
 * {
 * "Output":
 * {
 * "__type": "com.amazonaws.cognito.sync.model#ListIdentityPoolUsageResponse",
 * "Count": 2,
 * "IdentityPoolUsages": [
 * {
 * "DataStorage": 0,
 * "IdentityPoolId": "IDENTITY_POOL_ID",
 * "LastModifiedDate": 1.413836234607E9,
 * "SyncSessionsCount": null
 * },
 * {
 * "DataStorage": 0,
 * "IdentityPoolId": "IDENTITY_POOL_ID",
 * "LastModifiedDate": 1.410892165601E9,
 * "SyncSessionsCount": null
 * }],
 * "MaxResults": 2,
 * "NextToken": "dXMtZWFzdC0xOjBjMWJhMDUyLWUwOTgtNDFmYS1hNzZlLWVhYTJjMTI1Zjg2MQ=="
 * },
 * "Version": "1.0"
 * }
 */
export const listIdentityPoolUsage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListIdentityPoolUsageRequest,
    output: ListIdentityPoolUsageResponse,
    errors: [
      InternalErrorException,
      InvalidParameterException,
      NotAuthorizedException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Registers a device to receive push sync notifications.
 *
 * This API can only be called with temporary credentials provided by Cognito Identity. You cannot call this API with developer credentials.
 *
 * RegisterDevice
 * The following examples have been edited for readability.
 *
 * POST / HTTP/1.1
 * CONTENT-TYPE: application/json
 * X-AMZN-REQUESTID: 368f9200-3eca-449e-93b3-7b9c08d8e185
 * X-AMZ-TARGET: com.amazonaws.cognito.sync.model.AWSCognitoSyncService.RegisterDevice
 * HOST: cognito-sync.us-east-1.amazonaws.com
 * X-AMZ-DATE: 20141004T194643Z
 * X-AMZ-SECURITY-TOKEN:
 * AUTHORIZATION: AWS4-HMAC-SHA256 Credential=, SignedHeaders=content-type;content-length;host;x-amz-date;x-amz-target, Signature=
 *
 * {
 * "Operation": "com.amazonaws.cognito.sync.model#RegisterDevice",
 * "Service": "com.amazonaws.cognito.sync.model#AWSCognitoSyncService",
 * "Input":
 * {
 * "IdentityPoolId": "ID_POOL_ID",
 * "IdentityId": "IDENTITY_ID",
 * "Platform": "GCM",
 * "Token": "PUSH_TOKEN"
 * }
 * }
 *
 * 1.1 200 OK
 * x-amzn-requestid: 368f9200-3eca-449e-93b3-7b9c08d8e185
 * date: Sat, 04 Oct 2014 19:46:44 GMT
 * content-type: application/json
 * content-length: 145
 *
 * {
 * "Output":
 * {
 * "__type": "com.amazonaws.cognito.sync.model#RegisterDeviceResponse",
 * "DeviceId": "5cd28fbe-dd83-47ab-9f83-19093a5fb014"
 * },
 * "Version": "1.0"
 * }
 */
export const registerDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterDeviceRequest,
  output: RegisterDeviceResponse,
  errors: [
    InternalErrorException,
    InvalidConfigurationException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Sets the AWS Lambda function for a given event type for an identity pool. This request only updates the key/value pair specified. Other key/values pairs are not updated. To remove a key value pair, pass a empty value for the particular key.
 *
 * This API can only be called with developer credentials. You cannot call this API with the temporary user credentials provided by Cognito Identity.
 */
export const setCognitoEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetCognitoEventsRequest,
  output: SetCognitoEventsResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Subscribes to receive notifications when a dataset is modified by another device.
 *
 * This API can only be called with temporary credentials provided by Cognito Identity. You cannot call this API with developer credentials.
 *
 * SubscribeToDataset
 * The following examples have been edited for readability.
 *
 * POST / HTTP/1.1
 * CONTENT-TYPE: application/json
 * X-AMZN-REQUESTID: 8b9932b7-201d-4418-a960-0a470e11de9f
 * X-AMZ-TARGET: com.amazonaws.cognito.sync.model.AWSCognitoSyncService.SubscribeToDataset
 * HOST: cognito-sync.us-east-1.amazonaws.com
 * X-AMZ-DATE: 20141004T195350Z
 * X-AMZ-SECURITY-TOKEN:
 * AUTHORIZATION: AWS4-HMAC-SHA256 Credential=, SignedHeaders=content-type;content-length;host;x-amz-date;x-amz-target, Signature=
 *
 * {
 * "Operation": "com.amazonaws.cognito.sync.model#SubscribeToDataset",
 * "Service": "com.amazonaws.cognito.sync.model#AWSCognitoSyncService",
 * "Input":
 * {
 * "IdentityPoolId": "ID_POOL_ID",
 * "IdentityId": "IDENTITY_ID",
 * "DatasetName": "Rufus",
 * "DeviceId": "5cd28fbe-dd83-47ab-9f83-19093a5fb014"
 * }
 * }
 *
 * 1.1 200 OK
 * x-amzn-requestid: 8b9932b7-201d-4418-a960-0a470e11de9f
 * date: Sat, 04 Oct 2014 19:53:50 GMT
 * content-type: application/json
 * content-length: 99
 *
 * {
 * "Output":
 * {
 * "__type": "com.amazonaws.cognito.sync.model#SubscribeToDatasetResponse"
 * },
 * "Version": "1.0"
 * }
 */
export const subscribeToDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SubscribeToDatasetRequest,
  output: SubscribeToDatasetResponse,
  errors: [
    InternalErrorException,
    InvalidConfigurationException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Unsubscribes from receiving notifications when a dataset is modified by another device.
 *
 * This API can only be called with temporary credentials provided by Cognito Identity. You cannot call this API with developer credentials.
 *
 * UnsubscribeFromDataset
 * The following examples have been edited for readability.
 *
 * POST / HTTP/1.1
 * CONTENT-TYPE: application/json
 * X-AMZ-REQUESTSUPERTRACE: true
 * X-AMZN-REQUESTID: 676896d6-14ca-45b1-8029-6d36b10a077e
 * X-AMZ-TARGET: com.amazonaws.cognito.sync.model.AWSCognitoSyncService.UnsubscribeFromDataset
 * HOST: cognito-sync.us-east-1.amazonaws.com
 * X-AMZ-DATE: 20141004T195446Z
 * X-AMZ-SECURITY-TOKEN:
 * AUTHORIZATION: AWS4-HMAC-SHA256 Credential=, SignedHeaders=content-type;content-length;host;x-amz-date;x-amz-target, Signature=
 *
 * {
 * "Operation": "com.amazonaws.cognito.sync.model#UnsubscribeFromDataset",
 * "Service": "com.amazonaws.cognito.sync.model#AWSCognitoSyncService",
 * "Input":
 * {
 * "IdentityPoolId": "ID_POOL_ID",
 * "IdentityId": "IDENTITY_ID",
 * "DatasetName": "Rufus",
 * "DeviceId": "5cd28fbe-dd83-47ab-9f83-19093a5fb014"
 * }
 * }
 *
 * 1.1 200 OK
 * x-amzn-requestid: 676896d6-14ca-45b1-8029-6d36b10a077e
 * date: Sat, 04 Oct 2014 19:54:46 GMT
 * content-type: application/json
 * content-length: 103
 *
 * {
 * "Output":
 * {
 * "__type": "com.amazonaws.cognito.sync.model#UnsubscribeFromDatasetResponse"
 * },
 * "Version": "1.0"
 * }
 */
export const unsubscribeFromDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UnsubscribeFromDatasetRequest,
    output: UnsubscribeFromDatasetResponse,
    errors: [
      InternalErrorException,
      InvalidConfigurationException,
      InvalidParameterException,
      NotAuthorizedException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Gets meta data about a dataset by identity and dataset name. With Amazon Cognito Sync, each
 * identity has access only to its own data. Thus, the credentials used to make this API call
 * need to have access to the identity data.
 *
 * This API can be called with temporary user credentials provided by Cognito Identity or with developer credentials. You should use Cognito Identity credentials to make this API call.
 */
export const describeDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatasetRequest,
  output: DescribeDatasetResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets usage details (for example, data storage) about a particular identity pool.
 *
 * This API can only be called with developer credentials. You cannot call this API with the temporary user credentials provided by Cognito Identity.
 *
 * DescribeIdentityPoolUsage
 * The following examples have been edited for readability.
 *
 * POST / HTTP/1.1
 * CONTENT-TYPE: application/json
 * X-AMZN-REQUESTID: 8dc0e749-c8cd-48bd-8520-da6be00d528b
 * X-AMZ-TARGET: com.amazonaws.cognito.sync.model.AWSCognitoSyncService.DescribeIdentityPoolUsage
 * HOST: cognito-sync.us-east-1.amazonaws.com:443
 * X-AMZ-DATE: 20141111T205737Z
 * AUTHORIZATION: AWS4-HMAC-SHA256 Credential=, SignedHeaders=content-type;host;x-amz-date;x-amz-target;x-amzn-requestid, Signature=
 *
 * {
 * "Operation": "com.amazonaws.cognito.sync.model#DescribeIdentityPoolUsage",
 * "Service": "com.amazonaws.cognito.sync.model#AWSCognitoSyncService",
 * "Input":
 * {
 * "IdentityPoolId": "IDENTITY_POOL_ID"
 * }
 * }
 *
 * 1.1 200 OK
 * x-amzn-requestid: 8dc0e749-c8cd-48bd-8520-da6be00d528b
 * content-type: application/json
 * content-length: 271
 * date: Tue, 11 Nov 2014 20:57:37 GMT
 *
 * {
 * "Output":
 * {
 * "__type": "com.amazonaws.cognito.sync.model#DescribeIdentityPoolUsageResponse",
 * "IdentityPoolUsage":
 * {
 * "DataStorage": 0,
 * "IdentityPoolId": "IDENTITY_POOL_ID",
 * "LastModifiedDate": 1.413231134115E9,
 * "SyncSessionsCount": null
 * }
 * },
 * "Version": "1.0"
 * }
 */
export const describeIdentityPoolUsage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeIdentityPoolUsageRequest,
    output: DescribeIdentityPoolUsageResponse,
    errors: [
      InternalErrorException,
      InvalidParameterException,
      NotAuthorizedException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Gets usage information for an identity, including number of datasets and data usage.
 *
 * This API can be called with temporary user credentials provided by Cognito Identity or with developer credentials.
 *
 * DescribeIdentityUsage
 * The following examples have been edited for readability.
 *
 * POST / HTTP/1.1
 * CONTENT-TYPE: application/json
 * X-AMZN-REQUESTID: 33f9b4e4-a177-4aad-a3bb-6edb7980b283
 * X-AMZ-TARGET: com.amazonaws.cognito.sync.model.AWSCognitoSyncService.DescribeIdentityUsage
 * HOST: cognito-sync.us-east-1.amazonaws.com:443
 * X-AMZ-DATE: 20141111T215129Z
 * AUTHORIZATION: AWS4-HMAC-SHA256 Credential=, SignedHeaders=content-type;host;x-amz-date;x-amz-target;x-amzn-requestid, Signature=
 *
 * {
 * "Operation": "com.amazonaws.cognito.sync.model#DescribeIdentityUsage",
 * "Service": "com.amazonaws.cognito.sync.model#AWSCognitoSyncService",
 * "Input":
 * {
 * "IdentityPoolId": "IDENTITY_POOL_ID",
 * "IdentityId": "IDENTITY_ID"
 * }
 * }
 *
 * 1.1 200 OK
 * x-amzn-requestid: 33f9b4e4-a177-4aad-a3bb-6edb7980b283
 * content-type: application/json
 * content-length: 318
 * date: Tue, 11 Nov 2014 21:51:29 GMT
 *
 * {
 * "Output":
 * {
 * "__type": "com.amazonaws.cognito.sync.model#DescribeIdentityUsageResponse",
 * "IdentityUsage":
 * {
 * "DataStorage": 16,
 * "DatasetCount": 1,
 * "IdentityId": "IDENTITY_ID",
 * "IdentityPoolId": "IDENTITY_POOL_ID",
 * "LastModifiedDate": 1.412974081336E9
 * }
 * },
 * "Version": "1.0"
 * }
 */
export const describeIdentityUsage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeIdentityUsageRequest,
    output: DescribeIdentityUsageResponse,
    errors: [
      InternalErrorException,
      InvalidParameterException,
      NotAuthorizedException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Get the status of the last BulkPublish operation for an identity pool.
 *
 * This API can only be called with developer credentials. You cannot call this API with the temporary user credentials provided by Cognito Identity.
 */
export const getBulkPublishDetails = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetBulkPublishDetailsRequest,
    output: GetBulkPublishDetailsResponse,
    errors: [
      InternalErrorException,
      InvalidParameterException,
      NotAuthorizedException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Gets the events and the corresponding Lambda functions associated with an identity pool.
 *
 * This API can only be called with developer credentials. You cannot call this API with the temporary user credentials provided by Cognito Identity.
 */
export const getCognitoEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCognitoEventsRequest,
  output: GetCognitoEventsResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the configuration settings of an identity pool.
 *
 * This API can only be called with developer credentials. You cannot call this API with the temporary user credentials provided by Cognito Identity.
 *
 * GetIdentityPoolConfiguration
 * The following examples have been edited for readability.
 *
 * POST / HTTP/1.1
 * CONTENT-TYPE: application/json
 * X-AMZN-REQUESTID: b1cfdd4b-f620-4fe4-be0f-02024a1d33da
 * X-AMZ-TARGET: com.amazonaws.cognito.sync.model.AWSCognitoSyncService.GetIdentityPoolConfiguration
 * HOST: cognito-sync.us-east-1.amazonaws.com
 * X-AMZ-DATE: 20141004T195722Z
 * AUTHORIZATION: AWS4-HMAC-SHA256 Credential=, SignedHeaders=content-type;content-length;host;x-amz-date;x-amz-target, Signature=
 *
 * {
 * "Operation": "com.amazonaws.cognito.sync.model#GetIdentityPoolConfiguration",
 * "Service": "com.amazonaws.cognito.sync.model#AWSCognitoSyncService",
 * "Input":
 * {
 * "IdentityPoolId": "ID_POOL_ID"
 * }
 * }
 *
 * 1.1 200 OK
 * x-amzn-requestid: b1cfdd4b-f620-4fe4-be0f-02024a1d33da
 * date: Sat, 04 Oct 2014 19:57:22 GMT
 * content-type: application/json
 * content-length: 332
 *
 * {
 * "Output":
 * {
 * "__type": "com.amazonaws.cognito.sync.model#GetIdentityPoolConfigurationResponse",
 * "IdentityPoolId": "ID_POOL_ID",
 * "PushSync":
 * {
 * "ApplicationArns": ["PLATFORMARN1", "PLATFORMARN2"],
 * "RoleArn": "ROLEARN"
 * }
 * },
 * "Version": "1.0"
 * }
 */
export const getIdentityPoolConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetIdentityPoolConfigurationRequest,
    output: GetIdentityPoolConfigurationResponse,
    errors: [
      InternalErrorException,
      InvalidParameterException,
      NotAuthorizedException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Gets paginated records, optionally changed after a particular sync count for a dataset and
 * identity. With Amazon Cognito Sync, each identity has access only to its own data. Thus,
 * the credentials used to make this API call need to have access to the identity data.
 *
 * ListRecords can be called with temporary user credentials provided by Cognito
 * Identity or with developer credentials. You should use Cognito Identity credentials to make
 * this API call.
 *
 * ListRecords
 * The following examples have been edited for readability.
 *
 * POST / HTTP/1.1
 * CONTENT-TYPE: application/json
 * X-AMZN-REQUESTID: b3d2e31e-d6b7-4612-8e84-c9ba288dab5d
 * X-AMZ-TARGET: com.amazonaws.cognito.sync.model.AWSCognitoSyncService.ListRecords
 * HOST: cognito-sync.us-east-1.amazonaws.com:443
 * X-AMZ-DATE: 20141111T183230Z
 * AUTHORIZATION: AWS4-HMAC-SHA256 Credential=, SignedHeaders=content-type;host;x-amz-date;x-amz-target;x-amzn-requestid, Signature=
 *
 * {
 * "Operation": "com.amazonaws.cognito.sync.model#ListRecords",
 * "Service": "com.amazonaws.cognito.sync.model#AWSCognitoSyncService",
 * "Input":
 * {
 * "IdentityPoolId": "IDENTITY_POOL_ID",
 * "IdentityId": "IDENTITY_ID",
 * "DatasetName": "newDataSet"
 * }
 * }
 *
 * 1.1 200 OK
 * x-amzn-requestid: b3d2e31e-d6b7-4612-8e84-c9ba288dab5d
 * content-type: application/json
 * content-length: 623
 * date: Tue, 11 Nov 2014 18:32:30 GMT
 *
 * {
 * "Output":
 * {
 * "__type": "com.amazonaws.cognito.sync.model#ListRecordsResponse",
 * "Count": 0,
 * "DatasetDeletedAfterRequestedSyncCount": false,
 * "DatasetExists": false,
 * "DatasetSyncCount": 0,
 * "LastModifiedBy": null,
 * "MergedDatasetNames": null,
 * "NextToken": null,
 * "Records": [],
 * "SyncSessionToken": "SYNC_SESSION_TOKEN"
 * },
 * "Version": "1.0"
 * }
 */
export const listRecords = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRecordsRequest,
  output: ListRecordsResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    TooManyRequestsException,
  ],
}));
/**
 * Initiates a bulk publish of all existing datasets for an Identity Pool to the configured stream. Customers are limited to one successful bulk publish per 24 hours. Bulk publish is an asynchronous request, customers can see the status of the request via the GetBulkPublishDetails operation.
 *
 * This API can only be called with developer credentials. You cannot call this API with the temporary user credentials provided by Cognito Identity.
 */
export const bulkPublish = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BulkPublishRequest,
  output: BulkPublishResponse,
  errors: [
    AlreadyStreamedException,
    DuplicateRequestException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the specific dataset. The dataset will be deleted permanently, and the action can't
 * be undone. Datasets that this dataset was merged with will no longer report the merge. Any
 * subsequent operation on this dataset will result in a
 * ResourceNotFoundException.
 *
 * This API can be called with temporary user credentials provided by Cognito Identity or with developer credentials.
 */
export const deleteDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatasetRequest,
  output: DeleteDatasetResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceConflictException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Sets the necessary configuration for push sync.
 *
 * This API can only be called with developer credentials. You cannot call this API with the temporary user credentials provided by Cognito Identity.
 *
 * SetIdentityPoolConfiguration
 * The following examples have been edited for readability.
 *
 * POST / HTTP/1.1
 * CONTENT-TYPE: application/json
 * X-AMZN-REQUESTID: a46db021-f5dd-45d6-af5b-7069fa4a211b
 * X-AMZ-TARGET: com.amazonaws.cognito.sync.model.AWSCognitoSyncService.SetIdentityPoolConfiguration
 * HOST: cognito-sync.us-east-1.amazonaws.com
 * X-AMZ-DATE: 20141004T200006Z
 * AUTHORIZATION: AWS4-HMAC-SHA256 Credential=, SignedHeaders=content-type;content-length;host;x-amz-date;x-amz-target, Signature=
 *
 * {
 * "Operation": "com.amazonaws.cognito.sync.model#SetIdentityPoolConfiguration",
 * "Service": "com.amazonaws.cognito.sync.model#AWSCognitoSyncService",
 * "Input":
 * {
 * "IdentityPoolId": "ID_POOL_ID",
 * "PushSync":
 * {
 * "ApplicationArns": ["PLATFORMARN1", "PLATFORMARN2"],
 * "RoleArn": "ROLEARN"
 * }
 * }
 * }
 *
 * 1.1 200 OK
 * x-amzn-requestid: a46db021-f5dd-45d6-af5b-7069fa4a211b
 * date: Sat, 04 Oct 2014 20:00:06 GMT
 * content-type: application/json
 * content-length: 332
 *
 * {
 * "Output":
 * {
 * "__type": "com.amazonaws.cognito.sync.model#SetIdentityPoolConfigurationResponse",
 * "IdentityPoolId": "ID_POOL_ID",
 * "PushSync":
 * {
 * "ApplicationArns": ["PLATFORMARN1", "PLATFORMARN2"],
 * "RoleArn": "ROLEARN"
 * }
 * },
 * "Version": "1.0"
 * }
 */
export const setIdentityPoolConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SetIdentityPoolConfigurationRequest,
    output: SetIdentityPoolConfigurationResponse,
    errors: [
      ConcurrentModificationException,
      InternalErrorException,
      InvalidParameterException,
      NotAuthorizedException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Posts updates to records and adds and deletes records for a dataset and user.
 *
 * The sync count in the record patch is your last known sync count for that record. The server will reject an UpdateRecords request with a ResourceConflictException if you try to patch a record with a new value but a stale sync count.
 *
 * For example, if the sync count on the server is 5 for a key called highScore and you try and submit a new highScore with sync count of 4, the request will be rejected. To obtain the current sync count for a record, call ListRecords. On a successful update of the record, the response returns the new sync count for that record. You should present that sync count the next time you try to update that same record. When the record does not exist, specify the sync count as 0.
 *
 * This API can be called with temporary user credentials provided by Cognito Identity or with developer credentials.
 */
export const updateRecords = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRecordsRequest,
  output: UpdateRecordsResponse,
  errors: [
    InternalErrorException,
    InvalidLambdaFunctionOutputException,
    InvalidParameterException,
    LambdaThrottledException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceConflictException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));

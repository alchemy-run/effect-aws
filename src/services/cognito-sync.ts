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
const ns = T.XmlNamespace("http://cognito-sync.amazonaws.com/doc/2014-06-30/");
const svc = T.AwsApiService({
  sdkId: "Cognito Sync",
  serviceShapeName: "AWSCognitoSyncService",
});
const auth = T.AwsAuthSigv4({ name: "cognito-sync" });
const ver = T.ServiceVersion("2014-06-30");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://cognito-sync-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://cognito-sync-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://cognito-sync.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://cognito-sync.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type IdentityPoolId = string;
export type IdentityId = string;
export type DatasetName = string;
export type IntegerString = number;
export type Long = number;
export type SyncSessionToken = string;
export type PushToken = string;
export type DeviceId = string;
export type ClientContext = string;
export type CognitoEventType = string;
export type LambdaFunctionArn = string;
export type ApplicationArn = string;
export type AssumeRoleArn = string;
export type StreamName = string;
export type RecordKey = string;
export type RecordValue = string;
export type Integer = number;
export type ExceptionMessage = string;

//# Schemas
export interface BulkPublishRequest {
  IdentityPoolId: string;
}
export const BulkPublishRequest = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String.pipe(T.HttpLabel("IdentityPoolId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "BulkPublishRequest",
}) as any as S.Schema<BulkPublishRequest>;
export interface DeleteDatasetRequest {
  IdentityPoolId: string;
  IdentityId: string;
  DatasetName: string;
}
export const DeleteDatasetRequest = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String.pipe(T.HttpLabel("IdentityPoolId")),
    IdentityId: S.String.pipe(T.HttpLabel("IdentityId")),
    DatasetName: S.String.pipe(T.HttpLabel("DatasetName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteDatasetRequest",
}) as any as S.Schema<DeleteDatasetRequest>;
export interface DescribeDatasetRequest {
  IdentityPoolId: string;
  IdentityId: string;
  DatasetName: string;
}
export const DescribeDatasetRequest = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String.pipe(T.HttpLabel("IdentityPoolId")),
    IdentityId: S.String.pipe(T.HttpLabel("IdentityId")),
    DatasetName: S.String.pipe(T.HttpLabel("DatasetName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DescribeDatasetRequest",
}) as any as S.Schema<DescribeDatasetRequest>;
export interface DescribeIdentityPoolUsageRequest {
  IdentityPoolId: string;
}
export const DescribeIdentityPoolUsageRequest = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String.pipe(T.HttpLabel("IdentityPoolId")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/identitypools/{IdentityPoolId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeIdentityPoolUsageRequest",
}) as any as S.Schema<DescribeIdentityPoolUsageRequest>;
export interface DescribeIdentityUsageRequest {
  IdentityPoolId: string;
  IdentityId: string;
}
export const DescribeIdentityUsageRequest = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String.pipe(T.HttpLabel("IdentityPoolId")),
    IdentityId: S.String.pipe(T.HttpLabel("IdentityId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DescribeIdentityUsageRequest",
}) as any as S.Schema<DescribeIdentityUsageRequest>;
export interface GetBulkPublishDetailsRequest {
  IdentityPoolId: string;
}
export const GetBulkPublishDetailsRequest = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String.pipe(T.HttpLabel("IdentityPoolId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetBulkPublishDetailsRequest",
}) as any as S.Schema<GetBulkPublishDetailsRequest>;
export interface GetCognitoEventsRequest {
  IdentityPoolId: string;
}
export const GetCognitoEventsRequest = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String.pipe(T.HttpLabel("IdentityPoolId")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/identitypools/{IdentityPoolId}/events" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCognitoEventsRequest",
}) as any as S.Schema<GetCognitoEventsRequest>;
export interface GetIdentityPoolConfigurationRequest {
  IdentityPoolId: string;
}
export const GetIdentityPoolConfigurationRequest = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String.pipe(T.HttpLabel("IdentityPoolId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetIdentityPoolConfigurationRequest",
}) as any as S.Schema<GetIdentityPoolConfigurationRequest>;
export interface ListDatasetsRequest {
  IdentityPoolId: string;
  IdentityId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListDatasetsRequest = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String.pipe(T.HttpLabel("IdentityPoolId")),
    IdentityId: S.String.pipe(T.HttpLabel("IdentityId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDatasetsRequest",
}) as any as S.Schema<ListDatasetsRequest>;
export interface ListIdentityPoolUsageRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListIdentityPoolUsageRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/identitypools" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIdentityPoolUsageRequest",
}) as any as S.Schema<ListIdentityPoolUsageRequest>;
export interface ListRecordsRequest {
  IdentityPoolId: string;
  IdentityId: string;
  DatasetName: string;
  LastSyncCount?: number;
  NextToken?: string;
  MaxResults?: number;
  SyncSessionToken?: string;
}
export const ListRecordsRequest = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String.pipe(T.HttpLabel("IdentityPoolId")),
    IdentityId: S.String.pipe(T.HttpLabel("IdentityId")),
    DatasetName: S.String.pipe(T.HttpLabel("DatasetName")),
    LastSyncCount: S.optional(S.Number).pipe(T.HttpQuery("lastSyncCount")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    SyncSessionToken: S.optional(S.String).pipe(
      T.HttpQuery("syncSessionToken"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListRecordsRequest",
}) as any as S.Schema<ListRecordsRequest>;
export interface RegisterDeviceRequest {
  IdentityPoolId: string;
  IdentityId: string;
  Platform: string;
  Token: string;
}
export const RegisterDeviceRequest = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String.pipe(T.HttpLabel("IdentityPoolId")),
    IdentityId: S.String.pipe(T.HttpLabel("IdentityId")),
    Platform: S.String,
    Token: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "RegisterDeviceRequest",
}) as any as S.Schema<RegisterDeviceRequest>;
export interface SubscribeToDatasetRequest {
  IdentityPoolId: string;
  IdentityId: string;
  DatasetName: string;
  DeviceId: string;
}
export const SubscribeToDatasetRequest = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String.pipe(T.HttpLabel("IdentityPoolId")),
    IdentityId: S.String.pipe(T.HttpLabel("IdentityId")),
    DatasetName: S.String.pipe(T.HttpLabel("DatasetName")),
    DeviceId: S.String.pipe(T.HttpLabel("DeviceId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "SubscribeToDatasetRequest",
}) as any as S.Schema<SubscribeToDatasetRequest>;
export interface SubscribeToDatasetResponse {}
export const SubscribeToDatasetResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SubscribeToDatasetResponse",
}) as any as S.Schema<SubscribeToDatasetResponse>;
export interface UnsubscribeFromDatasetRequest {
  IdentityPoolId: string;
  IdentityId: string;
  DatasetName: string;
  DeviceId: string;
}
export const UnsubscribeFromDatasetRequest = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String.pipe(T.HttpLabel("IdentityPoolId")),
    IdentityId: S.String.pipe(T.HttpLabel("IdentityId")),
    DatasetName: S.String.pipe(T.HttpLabel("DatasetName")),
    DeviceId: S.String.pipe(T.HttpLabel("DeviceId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UnsubscribeFromDatasetRequest",
}) as any as S.Schema<UnsubscribeFromDatasetRequest>;
export interface UnsubscribeFromDatasetResponse {}
export const UnsubscribeFromDatasetResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UnsubscribeFromDatasetResponse",
}) as any as S.Schema<UnsubscribeFromDatasetResponse>;
export type ApplicationArnList = string[];
export const ApplicationArnList = S.Array(S.String);
export interface Dataset {
  IdentityId?: string;
  DatasetName?: string;
  CreationDate?: Date;
  LastModifiedDate?: Date;
  LastModifiedBy?: string;
  DataStorage?: number;
  NumRecords?: number;
}
export const Dataset = S.suspend(() =>
  S.Struct({
    IdentityId: S.optional(S.String),
    DatasetName: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(S.String),
    DataStorage: S.optional(S.Number),
    NumRecords: S.optional(S.Number),
  }),
).annotations({ identifier: "Dataset" }) as any as S.Schema<Dataset>;
export type DatasetList = Dataset[];
export const DatasetList = S.Array(Dataset);
export interface IdentityPoolUsage {
  IdentityPoolId?: string;
  SyncSessionsCount?: number;
  DataStorage?: number;
  LastModifiedDate?: Date;
}
export const IdentityPoolUsage = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.optional(S.String),
    SyncSessionsCount: S.optional(S.Number),
    DataStorage: S.optional(S.Number),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "IdentityPoolUsage",
}) as any as S.Schema<IdentityPoolUsage>;
export type IdentityPoolUsageList = IdentityPoolUsage[];
export const IdentityPoolUsageList = S.Array(IdentityPoolUsage);
export type MergedDatasetNameList = string[];
export const MergedDatasetNameList = S.Array(S.String);
export type Events = { [key: string]: string };
export const Events = S.Record({ key: S.String, value: S.String });
export interface PushSync {
  ApplicationArns?: ApplicationArnList;
  RoleArn?: string;
}
export const PushSync = S.suspend(() =>
  S.Struct({
    ApplicationArns: S.optional(ApplicationArnList),
    RoleArn: S.optional(S.String),
  }),
).annotations({ identifier: "PushSync" }) as any as S.Schema<PushSync>;
export interface CognitoStreams {
  StreamName?: string;
  RoleArn?: string;
  StreamingStatus?: string;
}
export const CognitoStreams = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    RoleArn: S.optional(S.String),
    StreamingStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "CognitoStreams",
}) as any as S.Schema<CognitoStreams>;
export interface RecordPatch {
  Op: string;
  Key: string;
  Value?: string;
  SyncCount: number;
  DeviceLastModifiedDate?: Date;
}
export const RecordPatch = S.suspend(() =>
  S.Struct({
    Op: S.String,
    Key: S.String,
    Value: S.optional(S.String),
    SyncCount: S.Number,
    DeviceLastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "RecordPatch" }) as any as S.Schema<RecordPatch>;
export type RecordPatchList = RecordPatch[];
export const RecordPatchList = S.Array(RecordPatch);
export interface BulkPublishResponse {
  IdentityPoolId?: string;
}
export const BulkPublishResponse = S.suspend(() =>
  S.Struct({ IdentityPoolId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "BulkPublishResponse",
}) as any as S.Schema<BulkPublishResponse>;
export interface DescribeDatasetResponse {
  Dataset?: Dataset;
}
export const DescribeDatasetResponse = S.suspend(() =>
  S.Struct({ Dataset: S.optional(Dataset) }).pipe(ns),
).annotations({
  identifier: "DescribeDatasetResponse",
}) as any as S.Schema<DescribeDatasetResponse>;
export interface GetBulkPublishDetailsResponse {
  IdentityPoolId?: string;
  BulkPublishStartTime?: Date;
  BulkPublishCompleteTime?: Date;
  BulkPublishStatus?: string;
  FailureMessage?: string;
}
export const GetBulkPublishDetailsResponse = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.optional(S.String),
    BulkPublishStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    BulkPublishCompleteTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    BulkPublishStatus: S.optional(S.String),
    FailureMessage: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetBulkPublishDetailsResponse",
}) as any as S.Schema<GetBulkPublishDetailsResponse>;
export interface GetCognitoEventsResponse {
  Events?: Events;
}
export const GetCognitoEventsResponse = S.suspend(() =>
  S.Struct({ Events: S.optional(Events) }).pipe(ns),
).annotations({
  identifier: "GetCognitoEventsResponse",
}) as any as S.Schema<GetCognitoEventsResponse>;
export interface GetIdentityPoolConfigurationResponse {
  IdentityPoolId?: string;
  PushSync?: PushSync;
  CognitoStreams?: CognitoStreams;
}
export const GetIdentityPoolConfigurationResponse = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.optional(S.String),
    PushSync: S.optional(PushSync),
    CognitoStreams: S.optional(CognitoStreams),
  }).pipe(ns),
).annotations({
  identifier: "GetIdentityPoolConfigurationResponse",
}) as any as S.Schema<GetIdentityPoolConfigurationResponse>;
export interface ListDatasetsResponse {
  Datasets?: DatasetList;
  Count?: number;
  NextToken?: string;
}
export const ListDatasetsResponse = S.suspend(() =>
  S.Struct({
    Datasets: S.optional(DatasetList),
    Count: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDatasetsResponse",
}) as any as S.Schema<ListDatasetsResponse>;
export interface ListIdentityPoolUsageResponse {
  IdentityPoolUsages?: IdentityPoolUsageList;
  MaxResults?: number;
  Count?: number;
  NextToken?: string;
}
export const ListIdentityPoolUsageResponse = S.suspend(() =>
  S.Struct({
    IdentityPoolUsages: S.optional(IdentityPoolUsageList),
    MaxResults: S.optional(S.Number),
    Count: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListIdentityPoolUsageResponse",
}) as any as S.Schema<ListIdentityPoolUsageResponse>;
export interface RegisterDeviceResponse {
  DeviceId?: string;
}
export const RegisterDeviceResponse = S.suspend(() =>
  S.Struct({ DeviceId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "RegisterDeviceResponse",
}) as any as S.Schema<RegisterDeviceResponse>;
export interface SetCognitoEventsRequest {
  IdentityPoolId: string;
  Events: Events;
}
export const SetCognitoEventsRequest = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String.pipe(T.HttpLabel("IdentityPoolId")),
    Events: Events,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/identitypools/{IdentityPoolId}/events" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetCognitoEventsRequest",
}) as any as S.Schema<SetCognitoEventsRequest>;
export interface SetCognitoEventsResponse {}
export const SetCognitoEventsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetCognitoEventsResponse",
}) as any as S.Schema<SetCognitoEventsResponse>;
export interface SetIdentityPoolConfigurationRequest {
  IdentityPoolId: string;
  PushSync?: PushSync;
  CognitoStreams?: CognitoStreams;
}
export const SetIdentityPoolConfigurationRequest = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String.pipe(T.HttpLabel("IdentityPoolId")),
    PushSync: S.optional(PushSync),
    CognitoStreams: S.optional(CognitoStreams),
  }).pipe(
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
  ),
).annotations({
  identifier: "SetIdentityPoolConfigurationRequest",
}) as any as S.Schema<SetIdentityPoolConfigurationRequest>;
export interface UpdateRecordsRequest {
  IdentityPoolId: string;
  IdentityId: string;
  DatasetName: string;
  DeviceId?: string;
  RecordPatches?: RecordPatchList;
  SyncSessionToken: string;
  ClientContext?: string;
}
export const UpdateRecordsRequest = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String.pipe(T.HttpLabel("IdentityPoolId")),
    IdentityId: S.String.pipe(T.HttpLabel("IdentityId")),
    DatasetName: S.String.pipe(T.HttpLabel("DatasetName")),
    DeviceId: S.optional(S.String),
    RecordPatches: S.optional(RecordPatchList),
    SyncSessionToken: S.String,
    ClientContext: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-Client-Context"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateRecordsRequest",
}) as any as S.Schema<UpdateRecordsRequest>;
export interface IdentityUsage {
  IdentityId?: string;
  IdentityPoolId?: string;
  LastModifiedDate?: Date;
  DatasetCount?: number;
  DataStorage?: number;
}
export const IdentityUsage = S.suspend(() =>
  S.Struct({
    IdentityId: S.optional(S.String),
    IdentityPoolId: S.optional(S.String),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    DatasetCount: S.optional(S.Number),
    DataStorage: S.optional(S.Number),
  }),
).annotations({
  identifier: "IdentityUsage",
}) as any as S.Schema<IdentityUsage>;
export interface Record {
  Key?: string;
  Value?: string;
  SyncCount?: number;
  LastModifiedDate?: Date;
  LastModifiedBy?: string;
  DeviceLastModifiedDate?: Date;
}
export const Record = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Value: S.optional(S.String),
    SyncCount: S.optional(S.Number),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(S.String),
    DeviceLastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "Record" }) as any as S.Schema<Record>;
export type RecordList = Record[];
export const RecordList = S.Array(Record);
export interface DeleteDatasetResponse {
  Dataset?: Dataset;
}
export const DeleteDatasetResponse = S.suspend(() =>
  S.Struct({ Dataset: S.optional(Dataset) }).pipe(ns),
).annotations({
  identifier: "DeleteDatasetResponse",
}) as any as S.Schema<DeleteDatasetResponse>;
export interface DescribeIdentityPoolUsageResponse {
  IdentityPoolUsage?: IdentityPoolUsage;
}
export const DescribeIdentityPoolUsageResponse = S.suspend(() =>
  S.Struct({ IdentityPoolUsage: S.optional(IdentityPoolUsage) }).pipe(ns),
).annotations({
  identifier: "DescribeIdentityPoolUsageResponse",
}) as any as S.Schema<DescribeIdentityPoolUsageResponse>;
export interface DescribeIdentityUsageResponse {
  IdentityUsage?: IdentityUsage;
}
export const DescribeIdentityUsageResponse = S.suspend(() =>
  S.Struct({ IdentityUsage: S.optional(IdentityUsage) }).pipe(ns),
).annotations({
  identifier: "DescribeIdentityUsageResponse",
}) as any as S.Schema<DescribeIdentityUsageResponse>;
export interface ListRecordsResponse {
  Records?: RecordList;
  NextToken?: string;
  Count?: number;
  DatasetSyncCount?: number;
  LastModifiedBy?: string;
  MergedDatasetNames?: MergedDatasetNameList;
  DatasetExists?: boolean;
  DatasetDeletedAfterRequestedSyncCount?: boolean;
  SyncSessionToken?: string;
}
export const ListRecordsResponse = S.suspend(() =>
  S.Struct({
    Records: S.optional(RecordList),
    NextToken: S.optional(S.String),
    Count: S.optional(S.Number),
    DatasetSyncCount: S.optional(S.Number),
    LastModifiedBy: S.optional(S.String),
    MergedDatasetNames: S.optional(MergedDatasetNameList),
    DatasetExists: S.optional(S.Boolean),
    DatasetDeletedAfterRequestedSyncCount: S.optional(S.Boolean),
    SyncSessionToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListRecordsResponse",
}) as any as S.Schema<ListRecordsResponse>;
export interface SetIdentityPoolConfigurationResponse {
  IdentityPoolId?: string;
  PushSync?: PushSync;
  CognitoStreams?: CognitoStreams;
}
export const SetIdentityPoolConfigurationResponse = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.optional(S.String),
    PushSync: S.optional(PushSync),
    CognitoStreams: S.optional(CognitoStreams),
  }).pipe(ns),
).annotations({
  identifier: "SetIdentityPoolConfigurationResponse",
}) as any as S.Schema<SetIdentityPoolConfigurationResponse>;
export interface UpdateRecordsResponse {
  Records?: RecordList;
}
export const UpdateRecordsResponse = S.suspend(() =>
  S.Struct({ Records: S.optional(RecordList) }).pipe(ns),
).annotations({
  identifier: "UpdateRecordsResponse",
}) as any as S.Schema<UpdateRecordsResponse>;

//# Errors
export class InternalErrorException extends S.TaggedError<InternalErrorException>()(
  "InternalErrorException",
  { message: S.String },
  T.AwsQueryError({ code: "InternalError", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class AlreadyStreamedException extends S.TaggedError<AlreadyStreamedException>()(
  "AlreadyStreamedException",
  { message: S.String },
  T.AwsQueryError({ code: "AlreadyStreamed", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidConfigurationException extends S.TaggedError<InvalidConfigurationException>()(
  "InvalidConfigurationException",
  { message: S.String },
  T.AwsQueryError({ code: "InvalidConfiguration", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { message: S.String },
  T.AwsQueryError({ code: "InvalidParameter", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DuplicateRequestException extends S.TaggedError<DuplicateRequestException>()(
  "DuplicateRequestException",
  { message: S.String },
  T.AwsQueryError({ code: "DuplicateRequest", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { message: S.String },
  T.AwsQueryError({ code: "ConcurrentModification", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidLambdaFunctionOutputException extends S.TaggedError<InvalidLambdaFunctionOutputException>()(
  "InvalidLambdaFunctionOutputException",
  { message: S.String },
  T.AwsQueryError({
    code: "InvalidLambdaFunctionOutput",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class NotAuthorizedException extends S.TaggedError<NotAuthorizedException>()(
  "NotAuthorizedException",
  { message: S.String },
  T.AwsQueryError({ code: "NotAuthorizedError", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class LambdaThrottledException extends S.TaggedError<LambdaThrottledException>()(
  "LambdaThrottledException",
  { message: S.String },
  T.AwsQueryError({ code: "LambdaThrottled", httpResponseCode: 429 }),
).pipe(C.withThrottlingError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
  T.AwsQueryError({ code: "ResourceNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { message: S.String },
  T.AwsQueryError({ code: "TooManyRequests", httpResponseCode: 429 }),
).pipe(C.withThrottlingError) {}
export class ResourceConflictException extends S.TaggedError<ResourceConflictException>()(
  "ResourceConflictException",
  { message: S.String },
  T.AwsQueryError({ code: "ResourceConflict", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.String },
  T.AwsQueryError({ code: "LimitExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}

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
export const listDatasets: (
  input: ListDatasetsRequest,
) => Effect.Effect<
  ListDatasetsResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the specific dataset. The dataset will be deleted permanently, and the action can't
 * be undone. Datasets that this dataset was merged with will no longer report the merge. Any
 * subsequent operation on this dataset will result in a
 * ResourceNotFoundException.
 *
 * This API can be called with temporary user credentials provided by Cognito Identity or with developer credentials.
 */
export const deleteDataset: (
  input: DeleteDatasetRequest,
) => Effect.Effect<
  DeleteDatasetResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceConflictException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const unsubscribeFromDataset: (
  input: UnsubscribeFromDatasetRequest,
) => Effect.Effect<
  UnsubscribeFromDatasetResponse,
  | InternalErrorException
  | InvalidConfigurationException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const registerDevice: (
  input: RegisterDeviceRequest,
) => Effect.Effect<
  RegisterDeviceResponse,
  | InternalErrorException
  | InvalidConfigurationException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Get the status of the last BulkPublish operation for an identity pool.
 *
 * This API can only be called with developer credentials. You cannot call this API with the temporary user credentials provided by Cognito Identity.
 */
export const getBulkPublishDetails: (
  input: GetBulkPublishDetailsRequest,
) => Effect.Effect<
  GetBulkPublishDetailsResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBulkPublishDetailsRequest,
  output: GetBulkPublishDetailsResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets the events and the corresponding Lambda functions associated with an identity pool.
 *
 * This API can only be called with developer credentials. You cannot call this API with the temporary user credentials provided by Cognito Identity.
 */
export const getCognitoEvents: (
  input: GetCognitoEventsRequest,
) => Effect.Effect<
  GetCognitoEventsResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getIdentityPoolConfiguration: (
  input: GetIdentityPoolConfigurationRequest,
) => Effect.Effect<
  GetIdentityPoolConfigurationResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Sets the AWS Lambda function for a given event type for an identity pool. This request only updates the key/value pair specified. Other key/values pairs are not updated. To remove a key value pair, pass a empty value for the particular key.
 *
 * This API can only be called with developer credentials. You cannot call this API with the temporary user credentials provided by Cognito Identity.
 */
export const setCognitoEvents: (
  input: SetCognitoEventsRequest,
) => Effect.Effect<
  SetCognitoEventsResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeIdentityPoolUsage: (
  input: DescribeIdentityPoolUsageRequest,
) => Effect.Effect<
  DescribeIdentityPoolUsageResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeIdentityPoolUsageRequest,
  output: DescribeIdentityPoolUsageResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
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
export const describeIdentityUsage: (
  input: DescribeIdentityUsageRequest,
) => Effect.Effect<
  DescribeIdentityUsageResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeIdentityUsageRequest,
  output: DescribeIdentityUsageResponse,
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
export const subscribeToDataset: (
  input: SubscribeToDatasetRequest,
) => Effect.Effect<
  SubscribeToDatasetResponse,
  | InternalErrorException
  | InvalidConfigurationException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Initiates a bulk publish of all existing datasets for an Identity Pool to the configured stream. Customers are limited to one successful bulk publish per 24 hours. Bulk publish is an asynchronous request, customers can see the status of the request via the GetBulkPublishDetails operation.
 *
 * This API can only be called with developer credentials. You cannot call this API with the temporary user credentials provided by Cognito Identity.
 */
export const bulkPublish: (
  input: BulkPublishRequest,
) => Effect.Effect<
  BulkPublishResponse,
  | AlreadyStreamedException
  | DuplicateRequestException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const setIdentityPoolConfiguration: (
  input: SetIdentityPoolConfigurationRequest,
) => Effect.Effect<
  SetIdentityPoolConfigurationResponse,
  | ConcurrentModificationException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listIdentityPoolUsage: (
  input: ListIdentityPoolUsageRequest,
) => Effect.Effect<
  ListIdentityPoolUsageResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIdentityPoolUsageRequest,
  output: ListIdentityPoolUsageResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
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
export const listRecords: (
  input: ListRecordsRequest,
) => Effect.Effect<
  ListRecordsResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets meta data about a dataset by identity and dataset name. With Amazon Cognito Sync, each
 * identity has access only to its own data. Thus, the credentials used to make this API call
 * need to have access to the identity data.
 *
 * This API can be called with temporary user credentials provided by Cognito Identity or with developer credentials. You should use Cognito Identity credentials to make this API call.
 */
export const describeDataset: (
  input: DescribeDatasetRequest,
) => Effect.Effect<
  DescribeDatasetResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Posts updates to records and adds and deletes records for a dataset and user.
 *
 * The sync count in the record patch is your last known sync count for that record. The server will reject an UpdateRecords request with a ResourceConflictException if you try to patch a record with a new value but a stale sync count.
 *
 * For example, if the sync count on the server is 5 for a key called highScore and you try and submit a new highScore with sync count of 4, the request will be rejected. To obtain the current sync count for a record, call ListRecords. On a successful update of the record, the response returns the new sync count for that record. You should present that sync count the next time you try to update that same record. When the record does not exist, specify the sync count as 0.
 *
 * This API can be called with temporary user credentials provided by Cognito Identity or with developer credentials.
 */
export const updateRecords: (
  input: UpdateRecordsRequest,
) => Effect.Effect<
  UpdateRecordsResponse,
  | InternalErrorException
  | InvalidLambdaFunctionOutputException
  | InvalidParameterException
  | LambdaThrottledException
  | LimitExceededException
  | NotAuthorizedException
  | ResourceConflictException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

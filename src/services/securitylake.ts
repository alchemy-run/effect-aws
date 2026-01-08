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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "SecurityLake",
  serviceShapeName: "SecurityLake",
});
const auth = T.AwsAuthSigv4({ name: "securitylake" });
const ver = T.ServiceVersion("2018-05-10");
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
              `https://securitylake-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://securitylake-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://securitylake.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://securitylake.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type SubscriptionProtocol = string;
export type SafeString = string;
export type Region = string;
export type MaxResults = number;
export type NextToken = string;
export type AmazonResourceName = string;
export type TagKey = string;
export type CustomLogSourceName = string;
export type CustomLogSourceVersion = string;
export type OcsfEventClass = string;
export type RoleArn = string;
export type AwsAccountId = string;
export type DescriptionString = string;
export type UUID = string;
export type TagValue = string;
export type AwsLogSourceVersion = string;
export type AwsPrincipal = string;
export type ExternalId = string;
export type S3BucketArn = string;
export type ResourceShareArn = string;
export type ResourceShareName = string;
export type DataLakeStorageClass = string;
export type S3URI = string;

//# Schemas
export interface DeleteDataLakeExceptionSubscriptionRequest {}
export const DeleteDataLakeExceptionSubscriptionRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/datalake/exceptions/subscription" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDataLakeExceptionSubscriptionRequest",
}) as any as S.Schema<DeleteDataLakeExceptionSubscriptionRequest>;
export interface DeleteDataLakeExceptionSubscriptionResponse {}
export const DeleteDataLakeExceptionSubscriptionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDataLakeExceptionSubscriptionResponse",
}) as any as S.Schema<DeleteDataLakeExceptionSubscriptionResponse>;
export interface DeregisterDataLakeDelegatedAdministratorRequest {}
export const DeregisterDataLakeDelegatedAdministratorRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/datalake/delegate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterDataLakeDelegatedAdministratorRequest",
}) as any as S.Schema<DeregisterDataLakeDelegatedAdministratorRequest>;
export interface DeregisterDataLakeDelegatedAdministratorResponse {}
export const DeregisterDataLakeDelegatedAdministratorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeregisterDataLakeDelegatedAdministratorResponse",
}) as any as S.Schema<DeregisterDataLakeDelegatedAdministratorResponse>;
export interface GetDataLakeExceptionSubscriptionRequest {}
export const GetDataLakeExceptionSubscriptionRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/datalake/exceptions/subscription" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataLakeExceptionSubscriptionRequest",
}) as any as S.Schema<GetDataLakeExceptionSubscriptionRequest>;
export interface GetDataLakeOrganizationConfigurationRequest {}
export const GetDataLakeOrganizationConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/datalake/organization/configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataLakeOrganizationConfigurationRequest",
}) as any as S.Schema<GetDataLakeOrganizationConfigurationRequest>;
export type RegionList = string[];
export const RegionList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type OcsfEventClassList = string[];
export const OcsfEventClassList = S.Array(S.String);
export type AccountList = string[];
export const AccountList = S.Array(S.String);
export type AccessTypeList = string[];
export const AccessTypeList = S.Array(S.String);
export interface CreateDataLakeExceptionSubscriptionRequest {
  subscriptionProtocol: string;
  notificationEndpoint: string;
  exceptionTimeToLive?: number;
}
export const CreateDataLakeExceptionSubscriptionRequest = S.suspend(() =>
  S.Struct({
    subscriptionProtocol: S.String,
    notificationEndpoint: S.String,
    exceptionTimeToLive: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/datalake/exceptions/subscription" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataLakeExceptionSubscriptionRequest",
}) as any as S.Schema<CreateDataLakeExceptionSubscriptionRequest>;
export interface CreateDataLakeExceptionSubscriptionResponse {}
export const CreateDataLakeExceptionSubscriptionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateDataLakeExceptionSubscriptionResponse",
}) as any as S.Schema<CreateDataLakeExceptionSubscriptionResponse>;
export interface GetDataLakeExceptionSubscriptionResponse {
  subscriptionProtocol?: string;
  notificationEndpoint?: string;
  exceptionTimeToLive?: number;
}
export const GetDataLakeExceptionSubscriptionResponse = S.suspend(() =>
  S.Struct({
    subscriptionProtocol: S.optional(S.String),
    notificationEndpoint: S.optional(S.String),
    exceptionTimeToLive: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetDataLakeExceptionSubscriptionResponse",
}) as any as S.Schema<GetDataLakeExceptionSubscriptionResponse>;
export interface ListDataLakeExceptionsRequest {
  regions?: RegionList;
  maxResults?: number;
  nextToken?: string;
}
export const ListDataLakeExceptionsRequest = S.suspend(() =>
  S.Struct({
    regions: S.optional(RegionList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/datalake/exceptions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataLakeExceptionsRequest",
}) as any as S.Schema<ListDataLakeExceptionsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/tags/{resourceArn}" }),
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
export interface RegisterDataLakeDelegatedAdministratorRequest {
  accountId: string;
}
export const RegisterDataLakeDelegatedAdministratorRequest = S.suspend(() =>
  S.Struct({ accountId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/datalake/delegate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterDataLakeDelegatedAdministratorRequest",
}) as any as S.Schema<RegisterDataLakeDelegatedAdministratorRequest>;
export interface RegisterDataLakeDelegatedAdministratorResponse {}
export const RegisterDataLakeDelegatedAdministratorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RegisterDataLakeDelegatedAdministratorResponse",
}) as any as S.Schema<RegisterDataLakeDelegatedAdministratorResponse>;
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
      T.Http({ method: "DELETE", uri: "/v1/tags/{resourceArn}" }),
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
export interface UpdateDataLakeExceptionSubscriptionRequest {
  subscriptionProtocol: string;
  notificationEndpoint: string;
  exceptionTimeToLive?: number;
}
export const UpdateDataLakeExceptionSubscriptionRequest = S.suspend(() =>
  S.Struct({
    subscriptionProtocol: S.String,
    notificationEndpoint: S.String,
    exceptionTimeToLive: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/datalake/exceptions/subscription" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDataLakeExceptionSubscriptionRequest",
}) as any as S.Schema<UpdateDataLakeExceptionSubscriptionRequest>;
export interface UpdateDataLakeExceptionSubscriptionResponse {}
export const UpdateDataLakeExceptionSubscriptionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateDataLakeExceptionSubscriptionResponse",
}) as any as S.Schema<UpdateDataLakeExceptionSubscriptionResponse>;
export interface AwsLogSourceConfiguration {
  accounts?: AccountList;
  regions: RegionList;
  sourceName: string;
  sourceVersion?: string;
}
export const AwsLogSourceConfiguration = S.suspend(() =>
  S.Struct({
    accounts: S.optional(AccountList),
    regions: RegionList,
    sourceName: S.String,
    sourceVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsLogSourceConfiguration",
}) as any as S.Schema<AwsLogSourceConfiguration>;
export type AwsLogSourceConfigurationList = AwsLogSourceConfiguration[];
export const AwsLogSourceConfigurationList = S.Array(AwsLogSourceConfiguration);
export interface DeleteAwsLogSourceRequest {
  sources: AwsLogSourceConfigurationList;
}
export const DeleteAwsLogSourceRequest = S.suspend(() =>
  S.Struct({ sources: AwsLogSourceConfigurationList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/datalake/logsources/aws/delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAwsLogSourceRequest",
}) as any as S.Schema<DeleteAwsLogSourceRequest>;
export interface DeleteCustomLogSourceRequest {
  sourceName: string;
  sourceVersion?: string;
}
export const DeleteCustomLogSourceRequest = S.suspend(() =>
  S.Struct({
    sourceName: S.String.pipe(T.HttpLabel("sourceName")),
    sourceVersion: S.optional(S.String).pipe(T.HttpQuery("sourceVersion")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/datalake/logsources/custom/{sourceName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCustomLogSourceRequest",
}) as any as S.Schema<DeleteCustomLogSourceRequest>;
export interface DeleteCustomLogSourceResponse {}
export const DeleteCustomLogSourceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCustomLogSourceResponse",
}) as any as S.Schema<DeleteCustomLogSourceResponse>;
export interface DeleteDataLakeRequest {
  regions: RegionList;
}
export const DeleteDataLakeRequest = S.suspend(() =>
  S.Struct({ regions: RegionList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/datalake/delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDataLakeRequest",
}) as any as S.Schema<DeleteDataLakeRequest>;
export interface DeleteDataLakeResponse {}
export const DeleteDataLakeResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteDataLakeResponse" },
) as any as S.Schema<DeleteDataLakeResponse>;
export interface AwsLogSourceResource {
  sourceName?: string;
  sourceVersion?: string;
}
export const AwsLogSourceResource = S.suspend(() =>
  S.Struct({
    sourceName: S.optional(S.String),
    sourceVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsLogSourceResource",
}) as any as S.Schema<AwsLogSourceResource>;
export type AwsLogSourceResourceList = AwsLogSourceResource[];
export const AwsLogSourceResourceList = S.Array(AwsLogSourceResource);
export interface DataLakeAutoEnableNewAccountConfiguration {
  region: string;
  sources: AwsLogSourceResourceList;
}
export const DataLakeAutoEnableNewAccountConfiguration = S.suspend(() =>
  S.Struct({ region: S.String, sources: AwsLogSourceResourceList }),
).annotations({
  identifier: "DataLakeAutoEnableNewAccountConfiguration",
}) as any as S.Schema<DataLakeAutoEnableNewAccountConfiguration>;
export type DataLakeAutoEnableNewAccountConfigurationList =
  DataLakeAutoEnableNewAccountConfiguration[];
export const DataLakeAutoEnableNewAccountConfigurationList = S.Array(
  DataLakeAutoEnableNewAccountConfiguration,
);
export interface DeleteDataLakeOrganizationConfigurationRequest {
  autoEnableNewAccount?: DataLakeAutoEnableNewAccountConfigurationList;
}
export const DeleteDataLakeOrganizationConfigurationRequest = S.suspend(() =>
  S.Struct({
    autoEnableNewAccount: S.optional(
      DataLakeAutoEnableNewAccountConfigurationList,
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v1/datalake/organization/configuration/delete",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDataLakeOrganizationConfigurationRequest",
}) as any as S.Schema<DeleteDataLakeOrganizationConfigurationRequest>;
export interface DeleteDataLakeOrganizationConfigurationResponse {}
export const DeleteDataLakeOrganizationConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDataLakeOrganizationConfigurationResponse",
}) as any as S.Schema<DeleteDataLakeOrganizationConfigurationResponse>;
export interface GetDataLakeOrganizationConfigurationResponse {
  autoEnableNewAccount?: DataLakeAutoEnableNewAccountConfigurationList;
}
export const GetDataLakeOrganizationConfigurationResponse = S.suspend(() =>
  S.Struct({
    autoEnableNewAccount: S.optional(
      DataLakeAutoEnableNewAccountConfigurationList,
    ),
  }),
).annotations({
  identifier: "GetDataLakeOrganizationConfigurationResponse",
}) as any as S.Schema<GetDataLakeOrganizationConfigurationResponse>;
export interface GetDataLakeSourcesRequest {
  accounts?: AccountList;
  maxResults?: number;
  nextToken?: string;
}
export const GetDataLakeSourcesRequest = S.suspend(() =>
  S.Struct({
    accounts: S.optional(AccountList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/datalake/sources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataLakeSourcesRequest",
}) as any as S.Schema<GetDataLakeSourcesRequest>;
export interface ListDataLakesRequest {
  regions?: RegionList;
}
export const ListDataLakesRequest = S.suspend(() =>
  S.Struct({
    regions: S.optional(RegionList).pipe(T.HttpQuery("regions")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/datalakes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataLakesRequest",
}) as any as S.Schema<ListDataLakesRequest>;
export interface DataLakeEncryptionConfiguration {
  kmsKeyId?: string;
}
export const DataLakeEncryptionConfiguration = S.suspend(() =>
  S.Struct({ kmsKeyId: S.optional(S.String) }),
).annotations({
  identifier: "DataLakeEncryptionConfiguration",
}) as any as S.Schema<DataLakeEncryptionConfiguration>;
export interface DataLakeLifecycleExpiration {
  days?: number;
}
export const DataLakeLifecycleExpiration = S.suspend(() =>
  S.Struct({ days: S.optional(S.Number) }),
).annotations({
  identifier: "DataLakeLifecycleExpiration",
}) as any as S.Schema<DataLakeLifecycleExpiration>;
export interface DataLakeLifecycleTransition {
  storageClass?: string;
  days?: number;
}
export const DataLakeLifecycleTransition = S.suspend(() =>
  S.Struct({ storageClass: S.optional(S.String), days: S.optional(S.Number) }),
).annotations({
  identifier: "DataLakeLifecycleTransition",
}) as any as S.Schema<DataLakeLifecycleTransition>;
export type DataLakeLifecycleTransitionList = DataLakeLifecycleTransition[];
export const DataLakeLifecycleTransitionList = S.Array(
  DataLakeLifecycleTransition,
);
export interface DataLakeLifecycleConfiguration {
  expiration?: DataLakeLifecycleExpiration;
  transitions?: DataLakeLifecycleTransitionList;
}
export const DataLakeLifecycleConfiguration = S.suspend(() =>
  S.Struct({
    expiration: S.optional(DataLakeLifecycleExpiration),
    transitions: S.optional(DataLakeLifecycleTransitionList),
  }),
).annotations({
  identifier: "DataLakeLifecycleConfiguration",
}) as any as S.Schema<DataLakeLifecycleConfiguration>;
export interface DataLakeReplicationConfiguration {
  regions?: RegionList;
  roleArn?: string;
}
export const DataLakeReplicationConfiguration = S.suspend(() =>
  S.Struct({ regions: S.optional(RegionList), roleArn: S.optional(S.String) }),
).annotations({
  identifier: "DataLakeReplicationConfiguration",
}) as any as S.Schema<DataLakeReplicationConfiguration>;
export interface DataLakeConfiguration {
  region: string;
  encryptionConfiguration?: DataLakeEncryptionConfiguration;
  lifecycleConfiguration?: DataLakeLifecycleConfiguration;
  replicationConfiguration?: DataLakeReplicationConfiguration;
}
export const DataLakeConfiguration = S.suspend(() =>
  S.Struct({
    region: S.String,
    encryptionConfiguration: S.optional(DataLakeEncryptionConfiguration),
    lifecycleConfiguration: S.optional(DataLakeLifecycleConfiguration),
    replicationConfiguration: S.optional(DataLakeReplicationConfiguration),
  }),
).annotations({
  identifier: "DataLakeConfiguration",
}) as any as S.Schema<DataLakeConfiguration>;
export type DataLakeConfigurationList = DataLakeConfiguration[];
export const DataLakeConfigurationList = S.Array(DataLakeConfiguration);
export interface UpdateDataLakeRequest {
  configurations: DataLakeConfigurationList;
  metaStoreManagerRoleArn?: string;
}
export const UpdateDataLakeRequest = S.suspend(() =>
  S.Struct({
    configurations: DataLakeConfigurationList,
    metaStoreManagerRoleArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/datalake" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDataLakeRequest",
}) as any as S.Schema<UpdateDataLakeRequest>;
export interface GetSubscriberRequest {
  subscriberId: string;
}
export const GetSubscriberRequest = S.suspend(() =>
  S.Struct({ subscriberId: S.String.pipe(T.HttpLabel("subscriberId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/subscribers/{subscriberId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSubscriberRequest",
}) as any as S.Schema<GetSubscriberRequest>;
export interface AwsIdentity {
  principal: string;
  externalId: string;
}
export const AwsIdentity = S.suspend(() =>
  S.Struct({ principal: S.String, externalId: S.String }),
).annotations({ identifier: "AwsIdentity" }) as any as S.Schema<AwsIdentity>;
export interface CustomLogSourceProvider {
  roleArn?: string;
  location?: string;
}
export const CustomLogSourceProvider = S.suspend(() =>
  S.Struct({ roleArn: S.optional(S.String), location: S.optional(S.String) }),
).annotations({
  identifier: "CustomLogSourceProvider",
}) as any as S.Schema<CustomLogSourceProvider>;
export interface CustomLogSourceAttributes {
  crawlerArn?: string;
  databaseArn?: string;
  tableArn?: string;
}
export const CustomLogSourceAttributes = S.suspend(() =>
  S.Struct({
    crawlerArn: S.optional(S.String),
    databaseArn: S.optional(S.String),
    tableArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomLogSourceAttributes",
}) as any as S.Schema<CustomLogSourceAttributes>;
export interface CustomLogSourceResource {
  sourceName?: string;
  sourceVersion?: string;
  provider?: CustomLogSourceProvider;
  attributes?: CustomLogSourceAttributes;
}
export const CustomLogSourceResource = S.suspend(() =>
  S.Struct({
    sourceName: S.optional(S.String),
    sourceVersion: S.optional(S.String),
    provider: S.optional(CustomLogSourceProvider),
    attributes: S.optional(CustomLogSourceAttributes),
  }),
).annotations({
  identifier: "CustomLogSourceResource",
}) as any as S.Schema<CustomLogSourceResource>;
export type LogSourceResource =
  | { awsLogSource: AwsLogSourceResource }
  | { customLogSource: CustomLogSourceResource };
export const LogSourceResource = S.Union(
  S.Struct({ awsLogSource: AwsLogSourceResource }),
  S.Struct({ customLogSource: CustomLogSourceResource }),
);
export type LogSourceResourceList = (typeof LogSourceResource)["Type"][];
export const LogSourceResourceList = S.Array(LogSourceResource);
export interface UpdateSubscriberRequest {
  subscriberId: string;
  subscriberIdentity?: AwsIdentity;
  subscriberName?: string;
  subscriberDescription?: string;
  sources?: LogSourceResourceList;
}
export const UpdateSubscriberRequest = S.suspend(() =>
  S.Struct({
    subscriberId: S.String.pipe(T.HttpLabel("subscriberId")),
    subscriberIdentity: S.optional(AwsIdentity),
    subscriberName: S.optional(S.String),
    subscriberDescription: S.optional(S.String),
    sources: S.optional(LogSourceResourceList),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/subscribers/{subscriberId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSubscriberRequest",
}) as any as S.Schema<UpdateSubscriberRequest>;
export interface DeleteSubscriberRequest {
  subscriberId: string;
}
export const DeleteSubscriberRequest = S.suspend(() =>
  S.Struct({ subscriberId: S.String.pipe(T.HttpLabel("subscriberId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/subscribers/{subscriberId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSubscriberRequest",
}) as any as S.Schema<DeleteSubscriberRequest>;
export interface DeleteSubscriberResponse {}
export const DeleteSubscriberResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSubscriberResponse",
}) as any as S.Schema<DeleteSubscriberResponse>;
export interface ListSubscribersRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListSubscribersRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/subscribers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSubscribersRequest",
}) as any as S.Schema<ListSubscribersRequest>;
export interface DeleteSubscriberNotificationRequest {
  subscriberId: string;
}
export const DeleteSubscriberNotificationRequest = S.suspend(() =>
  S.Struct({ subscriberId: S.String.pipe(T.HttpLabel("subscriberId")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/subscribers/{subscriberId}/notification",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSubscriberNotificationRequest",
}) as any as S.Schema<DeleteSubscriberNotificationRequest>;
export interface DeleteSubscriberNotificationResponse {}
export const DeleteSubscriberNotificationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSubscriberNotificationResponse",
}) as any as S.Schema<DeleteSubscriberNotificationResponse>;
export interface SqsNotificationConfiguration {}
export const SqsNotificationConfiguration = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SqsNotificationConfiguration",
}) as any as S.Schema<SqsNotificationConfiguration>;
export interface HttpsNotificationConfiguration {
  endpoint: string;
  authorizationApiKeyName?: string;
  authorizationApiKeyValue?: string;
  httpMethod?: string;
  targetRoleArn: string;
}
export const HttpsNotificationConfiguration = S.suspend(() =>
  S.Struct({
    endpoint: S.String,
    authorizationApiKeyName: S.optional(S.String),
    authorizationApiKeyValue: S.optional(S.String),
    httpMethod: S.optional(S.String),
    targetRoleArn: S.String,
  }),
).annotations({
  identifier: "HttpsNotificationConfiguration",
}) as any as S.Schema<HttpsNotificationConfiguration>;
export type NotificationConfiguration =
  | { sqsNotificationConfiguration: SqsNotificationConfiguration }
  | { httpsNotificationConfiguration: HttpsNotificationConfiguration };
export const NotificationConfiguration = S.Union(
  S.Struct({ sqsNotificationConfiguration: SqsNotificationConfiguration }),
  S.Struct({ httpsNotificationConfiguration: HttpsNotificationConfiguration }),
);
export interface UpdateSubscriberNotificationRequest {
  subscriberId: string;
  configuration: (typeof NotificationConfiguration)["Type"];
}
export const UpdateSubscriberNotificationRequest = S.suspend(() =>
  S.Struct({
    subscriberId: S.String.pipe(T.HttpLabel("subscriberId")),
    configuration: NotificationConfiguration,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v1/subscribers/{subscriberId}/notification",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSubscriberNotificationRequest",
}) as any as S.Schema<UpdateSubscriberNotificationRequest>;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface SubscriberResource {
  subscriberId: string;
  subscriberArn: string;
  subscriberIdentity: AwsIdentity;
  subscriberName: string;
  subscriberDescription?: string;
  sources: LogSourceResourceList;
  accessTypes?: AccessTypeList;
  roleArn?: string;
  s3BucketArn?: string;
  subscriberEndpoint?: string;
  subscriberStatus?: string;
  resourceShareArn?: string;
  resourceShareName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export const SubscriberResource = S.suspend(() =>
  S.Struct({
    subscriberId: S.String,
    subscriberArn: S.String,
    subscriberIdentity: AwsIdentity,
    subscriberName: S.String,
    subscriberDescription: S.optional(S.String),
    sources: LogSourceResourceList,
    accessTypes: S.optional(AccessTypeList),
    roleArn: S.optional(S.String),
    s3BucketArn: S.optional(S.String),
    subscriberEndpoint: S.optional(S.String),
    subscriberStatus: S.optional(S.String),
    resourceShareArn: S.optional(S.String),
    resourceShareName: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "SubscriberResource",
}) as any as S.Schema<SubscriberResource>;
export type SubscriberResourceList = SubscriberResource[];
export const SubscriberResourceList = S.Array(SubscriberResource);
export interface ListTagsForResourceResponse {
  tags?: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/tags/{resourceArn}" }),
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
export interface CreateAwsLogSourceRequest {
  sources: AwsLogSourceConfigurationList;
}
export const CreateAwsLogSourceRequest = S.suspend(() =>
  S.Struct({ sources: AwsLogSourceConfigurationList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/datalake/logsources/aws" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAwsLogSourceRequest",
}) as any as S.Schema<CreateAwsLogSourceRequest>;
export interface DeleteAwsLogSourceResponse {
  failed?: AccountList;
}
export const DeleteAwsLogSourceResponse = S.suspend(() =>
  S.Struct({ failed: S.optional(AccountList) }),
).annotations({
  identifier: "DeleteAwsLogSourceResponse",
}) as any as S.Schema<DeleteAwsLogSourceResponse>;
export interface DataLakeUpdateException {
  reason?: string;
  code?: string;
}
export const DataLakeUpdateException = S.suspend(() =>
  S.Struct({ reason: S.optional(S.String), code: S.optional(S.String) }),
).annotations({
  identifier: "DataLakeUpdateException",
}) as any as S.Schema<DataLakeUpdateException>;
export interface DataLakeUpdateStatus {
  requestId?: string;
  status?: string;
  exception?: DataLakeUpdateException;
}
export const DataLakeUpdateStatus = S.suspend(() =>
  S.Struct({
    requestId: S.optional(S.String),
    status: S.optional(S.String),
    exception: S.optional(DataLakeUpdateException),
  }),
).annotations({
  identifier: "DataLakeUpdateStatus",
}) as any as S.Schema<DataLakeUpdateStatus>;
export interface DataLakeResource {
  dataLakeArn: string;
  region: string;
  s3BucketArn?: string;
  encryptionConfiguration?: DataLakeEncryptionConfiguration;
  lifecycleConfiguration?: DataLakeLifecycleConfiguration;
  replicationConfiguration?: DataLakeReplicationConfiguration;
  createStatus?: string;
  updateStatus?: DataLakeUpdateStatus;
}
export const DataLakeResource = S.suspend(() =>
  S.Struct({
    dataLakeArn: S.String,
    region: S.String,
    s3BucketArn: S.optional(S.String),
    encryptionConfiguration: S.optional(DataLakeEncryptionConfiguration),
    lifecycleConfiguration: S.optional(DataLakeLifecycleConfiguration),
    replicationConfiguration: S.optional(DataLakeReplicationConfiguration),
    createStatus: S.optional(S.String),
    updateStatus: S.optional(DataLakeUpdateStatus),
  }),
).annotations({
  identifier: "DataLakeResource",
}) as any as S.Schema<DataLakeResource>;
export type DataLakeResourceList = DataLakeResource[];
export const DataLakeResourceList = S.Array(DataLakeResource);
export interface UpdateDataLakeResponse {
  dataLakes?: DataLakeResourceList;
}
export const UpdateDataLakeResponse = S.suspend(() =>
  S.Struct({ dataLakes: S.optional(DataLakeResourceList) }),
).annotations({
  identifier: "UpdateDataLakeResponse",
}) as any as S.Schema<UpdateDataLakeResponse>;
export interface CreateSubscriberRequest {
  subscriberIdentity: AwsIdentity;
  subscriberName: string;
  subscriberDescription?: string;
  sources: LogSourceResourceList;
  accessTypes?: AccessTypeList;
  tags?: TagList;
}
export const CreateSubscriberRequest = S.suspend(() =>
  S.Struct({
    subscriberIdentity: AwsIdentity,
    subscriberName: S.String,
    subscriberDescription: S.optional(S.String),
    sources: LogSourceResourceList,
    accessTypes: S.optional(AccessTypeList),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/subscribers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSubscriberRequest",
}) as any as S.Schema<CreateSubscriberRequest>;
export interface UpdateSubscriberResponse {
  subscriber?: SubscriberResource;
}
export const UpdateSubscriberResponse = S.suspend(() =>
  S.Struct({ subscriber: S.optional(SubscriberResource) }),
).annotations({
  identifier: "UpdateSubscriberResponse",
}) as any as S.Schema<UpdateSubscriberResponse>;
export interface ListSubscribersResponse {
  subscribers?: SubscriberResourceList;
  nextToken?: string;
}
export const ListSubscribersResponse = S.suspend(() =>
  S.Struct({
    subscribers: S.optional(SubscriberResourceList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSubscribersResponse",
}) as any as S.Schema<ListSubscribersResponse>;
export interface UpdateSubscriberNotificationResponse {
  subscriberEndpoint?: string;
}
export const UpdateSubscriberNotificationResponse = S.suspend(() =>
  S.Struct({ subscriberEndpoint: S.optional(S.String) }),
).annotations({
  identifier: "UpdateSubscriberNotificationResponse",
}) as any as S.Schema<UpdateSubscriberNotificationResponse>;
export interface CustomLogSourceCrawlerConfiguration {
  roleArn: string;
}
export const CustomLogSourceCrawlerConfiguration = S.suspend(() =>
  S.Struct({ roleArn: S.String }),
).annotations({
  identifier: "CustomLogSourceCrawlerConfiguration",
}) as any as S.Schema<CustomLogSourceCrawlerConfiguration>;
export interface DataLakeException {
  region?: string;
  exception?: string;
  remediation?: string;
  timestamp?: Date;
}
export const DataLakeException = S.suspend(() =>
  S.Struct({
    region: S.optional(S.String),
    exception: S.optional(S.String),
    remediation: S.optional(S.String),
    timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "DataLakeException",
}) as any as S.Schema<DataLakeException>;
export type DataLakeExceptionList = DataLakeException[];
export const DataLakeExceptionList = S.Array(DataLakeException);
export interface CustomLogSourceConfiguration {
  crawlerConfiguration: CustomLogSourceCrawlerConfiguration;
  providerIdentity: AwsIdentity;
}
export const CustomLogSourceConfiguration = S.suspend(() =>
  S.Struct({
    crawlerConfiguration: CustomLogSourceCrawlerConfiguration,
    providerIdentity: AwsIdentity,
  }),
).annotations({
  identifier: "CustomLogSourceConfiguration",
}) as any as S.Schema<CustomLogSourceConfiguration>;
export interface ListDataLakeExceptionsResponse {
  exceptions?: DataLakeExceptionList;
  nextToken?: string;
}
export const ListDataLakeExceptionsResponse = S.suspend(() =>
  S.Struct({
    exceptions: S.optional(DataLakeExceptionList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataLakeExceptionsResponse",
}) as any as S.Schema<ListDataLakeExceptionsResponse>;
export interface CreateAwsLogSourceResponse {
  failed?: AccountList;
}
export const CreateAwsLogSourceResponse = S.suspend(() =>
  S.Struct({ failed: S.optional(AccountList) }),
).annotations({
  identifier: "CreateAwsLogSourceResponse",
}) as any as S.Schema<CreateAwsLogSourceResponse>;
export interface CreateCustomLogSourceRequest {
  sourceName: string;
  sourceVersion?: string;
  eventClasses?: OcsfEventClassList;
  configuration: CustomLogSourceConfiguration;
}
export const CreateCustomLogSourceRequest = S.suspend(() =>
  S.Struct({
    sourceName: S.String,
    sourceVersion: S.optional(S.String),
    eventClasses: S.optional(OcsfEventClassList),
    configuration: CustomLogSourceConfiguration,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/datalake/logsources/custom" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCustomLogSourceRequest",
}) as any as S.Schema<CreateCustomLogSourceRequest>;
export interface CreateDataLakeOrganizationConfigurationRequest {
  autoEnableNewAccount?: DataLakeAutoEnableNewAccountConfigurationList;
}
export const CreateDataLakeOrganizationConfigurationRequest = S.suspend(() =>
  S.Struct({
    autoEnableNewAccount: S.optional(
      DataLakeAutoEnableNewAccountConfigurationList,
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v1/datalake/organization/configuration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataLakeOrganizationConfigurationRequest",
}) as any as S.Schema<CreateDataLakeOrganizationConfigurationRequest>;
export interface CreateDataLakeOrganizationConfigurationResponse {}
export const CreateDataLakeOrganizationConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateDataLakeOrganizationConfigurationResponse",
}) as any as S.Schema<CreateDataLakeOrganizationConfigurationResponse>;
export interface CreateSubscriberResponse {
  subscriber?: SubscriberResource;
}
export const CreateSubscriberResponse = S.suspend(() =>
  S.Struct({ subscriber: S.optional(SubscriberResource) }),
).annotations({
  identifier: "CreateSubscriberResponse",
}) as any as S.Schema<CreateSubscriberResponse>;
export interface GetSubscriberResponse {
  subscriber?: SubscriberResource;
}
export const GetSubscriberResponse = S.suspend(() =>
  S.Struct({ subscriber: S.optional(SubscriberResource) }),
).annotations({
  identifier: "GetSubscriberResponse",
}) as any as S.Schema<GetSubscriberResponse>;
export interface CreateSubscriberNotificationRequest {
  subscriberId: string;
  configuration: (typeof NotificationConfiguration)["Type"];
}
export const CreateSubscriberNotificationRequest = S.suspend(() =>
  S.Struct({
    subscriberId: S.String.pipe(T.HttpLabel("subscriberId")),
    configuration: NotificationConfiguration,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v1/subscribers/{subscriberId}/notification",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSubscriberNotificationRequest",
}) as any as S.Schema<CreateSubscriberNotificationRequest>;
export interface DataLakeSourceStatus {
  resource?: string;
  status?: string;
}
export const DataLakeSourceStatus = S.suspend(() =>
  S.Struct({ resource: S.optional(S.String), status: S.optional(S.String) }),
).annotations({
  identifier: "DataLakeSourceStatus",
}) as any as S.Schema<DataLakeSourceStatus>;
export type DataLakeSourceStatusList = DataLakeSourceStatus[];
export const DataLakeSourceStatusList = S.Array(DataLakeSourceStatus);
export interface DataLakeSource {
  account?: string;
  sourceName?: string;
  eventClasses?: OcsfEventClassList;
  sourceStatuses?: DataLakeSourceStatusList;
}
export const DataLakeSource = S.suspend(() =>
  S.Struct({
    account: S.optional(S.String),
    sourceName: S.optional(S.String),
    eventClasses: S.optional(OcsfEventClassList),
    sourceStatuses: S.optional(DataLakeSourceStatusList),
  }),
).annotations({
  identifier: "DataLakeSource",
}) as any as S.Schema<DataLakeSource>;
export type DataLakeSourceList = DataLakeSource[];
export const DataLakeSourceList = S.Array(DataLakeSource);
export interface CreateCustomLogSourceResponse {
  source?: CustomLogSourceResource;
}
export const CreateCustomLogSourceResponse = S.suspend(() =>
  S.Struct({ source: S.optional(CustomLogSourceResource) }),
).annotations({
  identifier: "CreateCustomLogSourceResponse",
}) as any as S.Schema<CreateCustomLogSourceResponse>;
export interface CreateDataLakeRequest {
  configurations: DataLakeConfigurationList;
  metaStoreManagerRoleArn: string;
  tags?: TagList;
}
export const CreateDataLakeRequest = S.suspend(() =>
  S.Struct({
    configurations: DataLakeConfigurationList,
    metaStoreManagerRoleArn: S.String,
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/datalake" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataLakeRequest",
}) as any as S.Schema<CreateDataLakeRequest>;
export interface GetDataLakeSourcesResponse {
  dataLakeArn?: string;
  dataLakeSources?: DataLakeSourceList;
  nextToken?: string;
}
export const GetDataLakeSourcesResponse = S.suspend(() =>
  S.Struct({
    dataLakeArn: S.optional(S.String),
    dataLakeSources: S.optional(DataLakeSourceList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDataLakeSourcesResponse",
}) as any as S.Schema<GetDataLakeSourcesResponse>;
export interface ListLogSourcesRequest {
  accounts?: AccountList;
  regions?: RegionList;
  sources?: LogSourceResourceList;
  maxResults?: number;
  nextToken?: string;
}
export const ListLogSourcesRequest = S.suspend(() =>
  S.Struct({
    accounts: S.optional(AccountList),
    regions: S.optional(RegionList),
    sources: S.optional(LogSourceResourceList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/datalake/logsources/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLogSourcesRequest",
}) as any as S.Schema<ListLogSourcesRequest>;
export interface CreateSubscriberNotificationResponse {
  subscriberEndpoint?: string;
}
export const CreateSubscriberNotificationResponse = S.suspend(() =>
  S.Struct({ subscriberEndpoint: S.optional(S.String) }),
).annotations({
  identifier: "CreateSubscriberNotificationResponse",
}) as any as S.Schema<CreateSubscriberNotificationResponse>;
export interface CreateDataLakeResponse {
  dataLakes?: DataLakeResourceList;
}
export const CreateDataLakeResponse = S.suspend(() =>
  S.Struct({ dataLakes: S.optional(DataLakeResourceList) }),
).annotations({
  identifier: "CreateDataLakeResponse",
}) as any as S.Schema<CreateDataLakeResponse>;
export interface ListDataLakesResponse {
  dataLakes?: DataLakeResourceList;
}
export const ListDataLakesResponse = S.suspend(() =>
  S.Struct({ dataLakes: S.optional(DataLakeResourceList) }),
).annotations({
  identifier: "ListDataLakesResponse",
}) as any as S.Schema<ListDataLakesResponse>;
export interface LogSource {
  account?: string;
  region?: string;
  sources?: LogSourceResourceList;
}
export const LogSource = S.suspend(() =>
  S.Struct({
    account: S.optional(S.String),
    region: S.optional(S.String),
    sources: S.optional(LogSourceResourceList),
  }),
).annotations({ identifier: "LogSource" }) as any as S.Schema<LogSource>;
export type LogSourceList = LogSource[];
export const LogSourceList = S.Array(LogSource);
export interface ListLogSourcesResponse {
  sources?: LogSourceList;
  nextToken?: string;
}
export const ListLogSourcesResponse = S.suspend(() =>
  S.Struct({
    sources: S.optional(LogSourceList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLogSourcesResponse",
}) as any as S.Schema<ListLogSourcesResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String), errorCode: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.optional(S.String),
    resourceName: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.optional(S.String),
    resourceName: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}

//# Operations
/**
 * Deletes the specified notification subscription in Amazon Security Lake for the organization
 * you specify.
 */
export const deleteDataLakeExceptionSubscription: (
  input: DeleteDataLakeExceptionSubscriptionRequest,
) => Effect.Effect<
  DeleteDataLakeExceptionSubscriptionResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataLakeExceptionSubscriptionRequest,
  output: DeleteDataLakeExceptionSubscriptionResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the log sources.
 */
export const listLogSources: {
  (
    input: ListLogSourcesRequest,
  ): Effect.Effect<
    ListLogSourcesResponse,
    | AccessDeniedException
    | BadRequestException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListLogSourcesRequest,
  ) => Stream.Stream<
    ListLogSourcesResponse,
    | AccessDeniedException
    | BadRequestException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListLogSourcesRequest,
  ) => Stream.Stream<
    LogSource,
    | AccessDeniedException
    | BadRequestException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLogSourcesRequest,
  output: ListLogSourcesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "sources",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Initializes an Amazon Security Lake instance with the provided (or default) configuration. You
 * can enable Security Lake in Amazon Web Services Regions with customized settings before enabling
 * log collection in Regions. To specify particular Regions, configure these Regions using the
 * `configurations` parameter. If you have already enabled Security Lake in a Region
 * when you call this command, the command will update the Region if you provide new
 * configuration parameters. If you have not already enabled Security Lake in the Region when you
 * call this API, it will set up the data lake in the Region with the specified
 * configurations.
 *
 * When you enable Security Lake, it starts ingesting security data after the
 * `CreateAwsLogSource` call and after you create subscribers using the `CreateSubscriber` API. This includes ingesting security data from
 * sources, storing data, and making data accessible to subscribers. Security Lake also enables
 * all the existing settings and resources that it stores or maintains for your Amazon Web Services account in the current Region, including security log and event data. For
 * more information, see the Amazon Security Lake User
 * Guide.
 */
export const createDataLake: (
  input: CreateDataLakeRequest,
) => Effect.Effect<
  CreateDataLakeResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataLakeRequest,
  output: CreateDataLakeResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the Amazon Security Lake configuration object for the specified Amazon Web Services Regions. You can use this operation to determine whether
 * Security Lake is enabled for a Region.
 */
export const listDataLakes: (
  input: ListDataLakesRequest,
) => Effect.Effect<
  ListDataLakesResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDataLakesRequest,
  output: ListDataLakesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Adds a third-party custom source in Amazon Security Lake, from the Amazon Web Services Region
 * where you want to create a custom source. Security Lake can collect logs and events from
 * third-party custom sources. After creating the appropriate IAM role to
 * invoke Glue crawler, use this API to add a custom source name in Security Lake. This
 * operation creates a partition in the Amazon S3 bucket for Security Lake as the target
 * location for log files from the custom source. In addition, this operation also creates an
 * associated Glue table and an Glue crawler.
 */
export const createCustomLogSource: (
  input: CreateCustomLogSourceRequest,
) => Effect.Effect<
  CreateCustomLogSourceResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCustomLogSourceRequest,
  output: CreateCustomLogSourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a snapshot of the current Region, including whether Amazon Security Lake is enabled
 * for those accounts and which sources Security Lake is collecting data from.
 */
export const getDataLakeSources: {
  (
    input: GetDataLakeSourcesRequest,
  ): Effect.Effect<
    GetDataLakeSourcesResponse,
    | AccessDeniedException
    | BadRequestException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetDataLakeSourcesRequest,
  ) => Stream.Stream<
    GetDataLakeSourcesResponse,
    | AccessDeniedException
    | BadRequestException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetDataLakeSourcesRequest,
  ) => Stream.Stream<
    DataLakeSource,
    | AccessDeniedException
    | BadRequestException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetDataLakeSourcesRequest,
  output: GetDataLakeSourcesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "dataLakeSources",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Notifies the subscriber when new data is written to the data lake for the sources that
 * the subscriber consumes in Security Lake. You can create only one subscriber notification per
 * subscriber.
 */
export const createSubscriberNotification: (
  input: CreateSubscriberNotificationRequest,
) => Effect.Effect<
  CreateSubscriberNotificationResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSubscriberNotificationRequest,
  output: CreateSubscriberNotificationResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists the Amazon Security Lake exceptions that you can use to find the source of problems and
 * fix them.
 */
export const listDataLakeExceptions: {
  (
    input: ListDataLakeExceptionsRequest,
  ): Effect.Effect<
    ListDataLakeExceptionsResponse,
    | AccessDeniedException
    | BadRequestException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataLakeExceptionsRequest,
  ) => Stream.Stream<
    ListDataLakeExceptionsResponse,
    | AccessDeniedException
    | BadRequestException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListDataLakeExceptionsRequest,
  ) => Stream.Stream<
    DataLakeException,
    | AccessDeniedException
    | BadRequestException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataLakeExceptionsRequest,
  output: ListDataLakeExceptionsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "exceptions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Adds a natively supported Amazon Web Services service as an Amazon Security Lake source. Enables
 * source types for member accounts in required Amazon Web Services Regions, based on the
 * parameters you specify. You can choose any source type in any Region for either accounts
 * that are part of a trusted organization or standalone accounts. Once you add an Amazon Web Services service as a source, Security Lake starts collecting logs and events from it.
 *
 * You can use this API only to enable natively supported Amazon Web Services services as a
 * source. Use `CreateCustomLogSource` to enable data collection from a custom
 * source.
 */
export const createAwsLogSource: (
  input: CreateAwsLogSourceRequest,
) => Effect.Effect<
  CreateAwsLogSourceResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAwsLogSourceRequest,
  output: CreateAwsLogSourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Automatically enables Amazon Security Lake for new member accounts in your organization.
 * Security Lake is not automatically enabled for any existing member accounts in your
 * organization.
 *
 * This operation merges the new data lake organization configuration with the existing configuration for Security Lake in your organization. If you want to create a new data lake organization configuration, you must delete the existing one using DeleteDataLakeOrganizationConfiguration.
 */
export const createDataLakeOrganizationConfiguration: (
  input: CreateDataLakeOrganizationConfigurationRequest,
) => Effect.Effect<
  CreateDataLakeOrganizationConfigurationResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataLakeOrganizationConfigurationRequest,
  output: CreateDataLakeOrganizationConfigurationResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a subscriber for accounts that are already enabled in Amazon Security Lake. You can
 * create a subscriber with access to data in the current Amazon Web Services Region.
 */
export const createSubscriber: (
  input: CreateSubscriberRequest,
) => Effect.Effect<
  CreateSubscriberResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSubscriberRequest,
  output: CreateSubscriberResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the subscription information for the specified subscription ID. You can get
 * information about a specific subscriber.
 */
export const getSubscriber: (
  input: GetSubscriberRequest,
) => Effect.Effect<
  GetSubscriberResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSubscriberRequest,
  output: GetSubscriberResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the tags (keys and values) that are associated with an Amazon Security Lake resource: a subscriber, or the data lake configuration for
 * your Amazon Web Services account in a particular Amazon Web Services Region.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Adds or updates one or more tags that are associated with an Amazon Security Lake resource: a subscriber, or the data lake configuration for your
 * Amazon Web Services account in a particular Amazon Web Services Region. A *tag* is a label that you can define and associate with
 * Amazon Web Services resources. Each tag consists of a required *tag key* and an associated *tag value*. A
 * *tag key* is a general label that acts as a category for a more specific tag value. A *tag value* acts as a
 * descriptor for a tag key. Tags can help you identify, categorize, and manage resources in different ways, such as by owner, environment, or other
 * criteria. For more information, see
 * Tagging Amazon Security Lake resources in the
 * *Amazon Security Lake User Guide*.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes a natively supported Amazon Web Services service as an Amazon Security Lake source. You
 * can remove a source for one or more Regions. When you remove the source, Security Lake stops
 * collecting data from that source in the specified Regions and accounts, and subscribers can
 * no longer consume new data from the source. However, subscribers can still consume data
 * that Security Lake collected from the source before removal.
 *
 * You can choose any source type in any Amazon Web Services Region for either accounts that
 * are part of a trusted organization or standalone accounts.
 */
export const deleteAwsLogSource: (
  input: DeleteAwsLogSourceRequest,
) => Effect.Effect<
  DeleteAwsLogSourceResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAwsLogSourceRequest,
  output: DeleteAwsLogSourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * You can use `UpdateDataLake` to specify where to store your security data, how it should
 * be encrypted at rest and for how long. You can add a Rollup
 * Region to consolidate data from multiple Amazon Web Services Regions, replace
 * default encryption (SSE-S3) with Customer Manged Key,
 * or specify transition and expiration actions through storage Lifecycle management. The `UpdateDataLake` API works as an "upsert" operation that performs an insert if the specified item or record does not exist, or an update if it
 * already exists. Security Lake securely stores your data at rest using Amazon Web Services encryption solutions. For more details, see Data protection in Amazon Security Lake.
 *
 * For example, omitting the key `encryptionConfiguration` from a Region that is
 * included in an update call that currently uses KMS will leave that Region's KMS key in
 * place, but specifying `encryptionConfiguration: {kmsKeyId: 'S3_MANAGED_KEY'}`
 * for that same Region will reset the key to `S3-managed`.
 *
 * For more details about lifecycle management and how to update retention settings for one or more Regions after enabling Security Lake, see the Amazon Security Lake User Guide.
 */
export const updateDataLake: (
  input: UpdateDataLakeRequest,
) => Effect.Effect<
  UpdateDataLakeResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataLakeRequest,
  output: UpdateDataLakeResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates an existing subscription for the given Amazon Security Lake account ID. You can update
 * a subscriber by changing the sources that the subscriber consumes data from.
 */
export const updateSubscriber: (
  input: UpdateSubscriberRequest,
) => Effect.Effect<
  UpdateSubscriberResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSubscriberRequest,
  output: UpdateSubscriberResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists all subscribers for the specific Amazon Security Lake account ID. You can retrieve a list
 * of subscriptions associated with a specific organization or Amazon Web Services account.
 */
export const listSubscribers: {
  (
    input: ListSubscribersRequest,
  ): Effect.Effect<
    ListSubscribersResponse,
    | AccessDeniedException
    | BadRequestException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListSubscribersRequest,
  ) => Stream.Stream<
    ListSubscribersResponse,
    | AccessDeniedException
    | BadRequestException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListSubscribersRequest,
  ) => Stream.Stream<
    SubscriberResource,
    | AccessDeniedException
    | BadRequestException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSubscribersRequest,
  output: ListSubscribersResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "subscribers",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates an existing notification method for the subscription (SQS or HTTPs endpoint) or
 * switches the notification subscription endpoint for a subscriber.
 */
export const updateSubscriberNotification: (
  input: UpdateSubscriberNotificationRequest,
) => Effect.Effect<
  UpdateSubscriberNotificationResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSubscriberNotificationRequest,
  output: UpdateSubscriberNotificationResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the protocol and endpoint that were provided when subscribing to Amazon SNS topics for exception notifications.
 */
export const getDataLakeExceptionSubscription: (
  input: GetDataLakeExceptionSubscriptionRequest,
) => Effect.Effect<
  GetDataLakeExceptionSubscriptionResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataLakeExceptionSubscriptionRequest,
  output: GetDataLakeExceptionSubscriptionResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Designates the Amazon Security Lake delegated administrator account for the organization. This
 * API can only be called by the organization management account. The organization management
 * account cannot be the delegated administrator account.
 */
export const registerDataLakeDelegatedAdministrator: (
  input: RegisterDataLakeDelegatedAdministratorRequest,
) => Effect.Effect<
  RegisterDataLakeDelegatedAdministratorResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterDataLakeDelegatedAdministratorRequest,
  output: RegisterDataLakeDelegatedAdministratorResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes one or more tags (keys and values) from an Amazon Security Lake resource: a subscriber, or the data lake configuration for your
 * Amazon Web Services account in a particular Amazon Web Services Region.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the specified notification subscription in Amazon Security Lake for the organization
 * you specify.
 */
export const updateDataLakeExceptionSubscription: (
  input: UpdateDataLakeExceptionSubscriptionRequest,
) => Effect.Effect<
  UpdateDataLakeExceptionSubscriptionResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataLakeExceptionSubscriptionRequest,
  output: UpdateDataLakeExceptionSubscriptionResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes a custom log source from Amazon Security Lake, to stop sending data from the custom
 * source to Security Lake.
 */
export const deleteCustomLogSource: (
  input: DeleteCustomLogSourceRequest,
) => Effect.Effect<
  DeleteCustomLogSourceResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomLogSourceRequest,
  output: DeleteCustomLogSourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * When you disable Amazon Security Lake from your account, Security Lake is disabled in all Amazon Web Services Regions and it stops collecting data from your sources. Also, this API
 * automatically takes steps to remove the account from Security Lake. However, Security Lake retains
 * all of your existing settings and the resources that it created in your Amazon Web Services
 * account in the current Amazon Web Services Region.
 *
 * The `DeleteDataLake` operation does not delete the data that is stored in
 * your Amazon S3 bucket, which is owned by your Amazon Web Services account. For more
 * information, see the Amazon Security Lake User
 * Guide.
 */
export const deleteDataLake: (
  input: DeleteDataLakeRequest,
) => Effect.Effect<
  DeleteDataLakeResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataLakeRequest,
  output: DeleteDataLakeResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Turns off automatic enablement of Amazon Security Lake for member accounts that are added to an organization in Organizations. Only the delegated
 * Security Lake administrator for an organization can perform this operation. If the delegated Security Lake administrator performs this operation, new member
 * accounts won't automatically contribute data to the data lake.
 */
export const deleteDataLakeOrganizationConfiguration: (
  input: DeleteDataLakeOrganizationConfigurationRequest,
) => Effect.Effect<
  DeleteDataLakeOrganizationConfigurationResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataLakeOrganizationConfigurationRequest,
  output: DeleteDataLakeOrganizationConfigurationResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the configuration that will be automatically set up for accounts added to the
 * organization after the organization has onboarded to Amazon Security Lake. This API does not take
 * input parameters.
 */
export const getDataLakeOrganizationConfiguration: (
  input: GetDataLakeOrganizationConfigurationRequest,
) => Effect.Effect<
  GetDataLakeOrganizationConfigurationResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataLakeOrganizationConfigurationRequest,
  output: GetDataLakeOrganizationConfigurationResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the subscription permission and all notification settings for accounts that are
 * already enabled in Amazon Security Lake. When you run `DeleteSubscriber`, the
 * subscriber will no longer consume data from Security Lake and the subscriber is removed. This
 * operation deletes the subscriber and removes access to data in the current Amazon Web Services Region.
 */
export const deleteSubscriber: (
  input: DeleteSubscriberRequest,
) => Effect.Effect<
  DeleteSubscriberResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSubscriberRequest,
  output: DeleteSubscriberResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the specified subscription notification in Amazon Security Lake for the organization
 * you specify.
 */
export const deleteSubscriberNotification: (
  input: DeleteSubscriberNotificationRequest,
) => Effect.Effect<
  DeleteSubscriberNotificationResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSubscriberNotificationRequest,
  output: DeleteSubscriberNotificationResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the Amazon Security Lake delegated administrator account for the organization. This API
 * can only be called by the organization management account. The organization management
 * account cannot be the delegated administrator account.
 */
export const deregisterDataLakeDelegatedAdministrator: (
  input: DeregisterDataLakeDelegatedAdministratorRequest,
) => Effect.Effect<
  DeregisterDataLakeDelegatedAdministratorResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterDataLakeDelegatedAdministratorRequest,
  output: DeregisterDataLakeDelegatedAdministratorResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates the specified notification subscription in Amazon Security Lake for the organization
 * you specify. The notification subscription is created for exceptions that cannot be resolved by Security Lake automatically.
 */
export const createDataLakeExceptionSubscription: (
  input: CreateDataLakeExceptionSubscriptionRequest,
) => Effect.Effect<
  CreateDataLakeExceptionSubscriptionResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataLakeExceptionSubscriptionRequest,
  output: CreateDataLakeExceptionSubscriptionResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));

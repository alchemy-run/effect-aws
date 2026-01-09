import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({ sdkId: "mq", serviceShapeName: "mq" });
const auth = T.AwsAuthSigv4({ name: "mq" });
const ver = T.ServiceVersion("2017-11-27");
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
              `https://mq-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://mq-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://mq.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://mq.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type MaxResults = number;
export type __timestampIso8601 = Date;
export type __integerMin5Max100 = number;

//# Schemas
export type AuthenticationStrategy =
  | "SIMPLE"
  | "LDAP"
  | "CONFIG_MANAGED"
  | (string & {});
export const AuthenticationStrategy = S.String;
export type DeploymentMode =
  | "SINGLE_INSTANCE"
  | "ACTIVE_STANDBY_MULTI_AZ"
  | "CLUSTER_MULTI_AZ"
  | (string & {});
export const DeploymentMode = S.String;
export type EngineType = "ACTIVEMQ" | "RABBITMQ" | (string & {});
export const EngineType = S.String;
export type __listOf__string = string[];
export const __listOf__string = S.Array(S.String);
export type BrokerStorageType = "EBS" | "EFS" | (string & {});
export const BrokerStorageType = S.String;
export type DataReplicationMode = "NONE" | "CRDR" | (string & {});
export const DataReplicationMode = S.String;
export type PromoteMode = "SWITCHOVER" | "FAILOVER" | (string & {});
export const PromoteMode = S.String;
export type __mapOf__string = { [key: string]: string | undefined };
export const __mapOf__string = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CreateConfigurationRequest {
  AuthenticationStrategy?: AuthenticationStrategy;
  EngineType?: EngineType;
  EngineVersion?: string;
  Name?: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateConfigurationRequest = S.suspend(() =>
  S.Struct({
    AuthenticationStrategy: S.optional(AuthenticationStrategy).pipe(
      T.JsonName("authenticationStrategy"),
    ),
    EngineType: S.optional(EngineType).pipe(T.JsonName("engineType")),
    EngineVersion: S.optional(S.String).pipe(T.JsonName("engineVersion")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfigurationRequest",
}) as any as S.Schema<CreateConfigurationRequest>;
export interface CreateTagsRequest {
  ResourceArn: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateTagsRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTagsRequest",
}) as any as S.Schema<CreateTagsRequest>;
export interface CreateTagsResponse {}
export const CreateTagsResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "CreateTagsResponse",
}) as any as S.Schema<CreateTagsResponse>;
export interface CreateUserRequest {
  BrokerId: string;
  ConsoleAccess?: boolean;
  Groups?: string[];
  Password?: string;
  Username: string;
  ReplicationUser?: boolean;
}
export const CreateUserRequest = S.suspend(() =>
  S.Struct({
    BrokerId: S.String.pipe(T.HttpLabel("BrokerId")),
    ConsoleAccess: S.optional(S.Boolean).pipe(T.JsonName("consoleAccess")),
    Groups: S.optional(__listOf__string).pipe(T.JsonName("groups")),
    Password: S.optional(S.String).pipe(T.JsonName("password")),
    Username: S.String.pipe(T.HttpLabel("Username")),
    ReplicationUser: S.optional(S.Boolean).pipe(T.JsonName("replicationUser")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v1/brokers/{BrokerId}/users/{Username}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateUserRequest",
}) as any as S.Schema<CreateUserRequest>;
export interface CreateUserResponse {}
export const CreateUserResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "CreateUserResponse",
}) as any as S.Schema<CreateUserResponse>;
export interface DeleteBrokerRequest {
  BrokerId: string;
}
export const DeleteBrokerRequest = S.suspend(() =>
  S.Struct({ BrokerId: S.String.pipe(T.HttpLabel("BrokerId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/brokers/{BrokerId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBrokerRequest",
}) as any as S.Schema<DeleteBrokerRequest>;
export interface DeleteConfigurationRequest {
  ConfigurationId: string;
}
export const DeleteConfigurationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationId: S.String.pipe(T.HttpLabel("ConfigurationId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/configurations/{ConfigurationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfigurationRequest",
}) as any as S.Schema<DeleteConfigurationRequest>;
export interface DeleteTagsRequest {
  ResourceArn: string;
  TagKeys?: string[];
}
export const DeleteTagsRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: S.optional(__listOf__string).pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTagsRequest",
}) as any as S.Schema<DeleteTagsRequest>;
export interface DeleteTagsResponse {}
export const DeleteTagsResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteTagsResponse",
}) as any as S.Schema<DeleteTagsResponse>;
export interface DeleteUserRequest {
  BrokerId: string;
  Username: string;
}
export const DeleteUserRequest = S.suspend(() =>
  S.Struct({
    BrokerId: S.String.pipe(T.HttpLabel("BrokerId")),
    Username: S.String.pipe(T.HttpLabel("Username")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/brokers/{BrokerId}/users/{Username}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteUserRequest",
}) as any as S.Schema<DeleteUserRequest>;
export interface DeleteUserResponse {}
export const DeleteUserResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteUserResponse",
}) as any as S.Schema<DeleteUserResponse>;
export interface DescribeBrokerRequest {
  BrokerId: string;
}
export const DescribeBrokerRequest = S.suspend(() =>
  S.Struct({ BrokerId: S.String.pipe(T.HttpLabel("BrokerId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/brokers/{BrokerId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeBrokerRequest",
}) as any as S.Schema<DescribeBrokerRequest>;
export interface DescribeBrokerEngineTypesRequest {
  EngineType?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeBrokerEngineTypesRequest = S.suspend(() =>
  S.Struct({
    EngineType: S.optional(S.String).pipe(T.HttpQuery("engineType")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/broker-engine-types" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeBrokerEngineTypesRequest",
}) as any as S.Schema<DescribeBrokerEngineTypesRequest>;
export interface DescribeBrokerInstanceOptionsRequest {
  EngineType?: string;
  HostInstanceType?: string;
  MaxResults?: number;
  NextToken?: string;
  StorageType?: string;
}
export const DescribeBrokerInstanceOptionsRequest = S.suspend(() =>
  S.Struct({
    EngineType: S.optional(S.String).pipe(T.HttpQuery("engineType")),
    HostInstanceType: S.optional(S.String).pipe(
      T.HttpQuery("hostInstanceType"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    StorageType: S.optional(S.String).pipe(T.HttpQuery("storageType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/broker-instance-options" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeBrokerInstanceOptionsRequest",
}) as any as S.Schema<DescribeBrokerInstanceOptionsRequest>;
export interface DescribeConfigurationRequest {
  ConfigurationId: string;
}
export const DescribeConfigurationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationId: S.String.pipe(T.HttpLabel("ConfigurationId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/configurations/{ConfigurationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConfigurationRequest",
}) as any as S.Schema<DescribeConfigurationRequest>;
export interface DescribeConfigurationRevisionRequest {
  ConfigurationId: string;
  ConfigurationRevision: string;
}
export const DescribeConfigurationRevisionRequest = S.suspend(() =>
  S.Struct({
    ConfigurationId: S.String.pipe(T.HttpLabel("ConfigurationId")),
    ConfigurationRevision: S.String.pipe(T.HttpLabel("ConfigurationRevision")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/configurations/{ConfigurationId}/revisions/{ConfigurationRevision}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConfigurationRevisionRequest",
}) as any as S.Schema<DescribeConfigurationRevisionRequest>;
export interface DescribeUserRequest {
  BrokerId: string;
  Username: string;
}
export const DescribeUserRequest = S.suspend(() =>
  S.Struct({
    BrokerId: S.String.pipe(T.HttpLabel("BrokerId")),
    Username: S.String.pipe(T.HttpLabel("Username")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/brokers/{BrokerId}/users/{Username}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeUserRequest",
}) as any as S.Schema<DescribeUserRequest>;
export interface ListBrokersRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListBrokersRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/brokers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBrokersRequest",
}) as any as S.Schema<ListBrokersRequest>;
export interface ListConfigurationRevisionsRequest {
  ConfigurationId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListConfigurationRevisionsRequest = S.suspend(() =>
  S.Struct({
    ConfigurationId: S.String.pipe(T.HttpLabel("ConfigurationId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/configurations/{ConfigurationId}/revisions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfigurationRevisionsRequest",
}) as any as S.Schema<ListConfigurationRevisionsRequest>;
export interface ListConfigurationsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListConfigurationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfigurationsRequest",
}) as any as S.Schema<ListConfigurationsRequest>;
export interface ListTagsRequest {
  ResourceArn: string;
}
export const ListTagsRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsRequest",
}) as any as S.Schema<ListTagsRequest>;
export interface ListUsersRequest {
  BrokerId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListUsersRequest = S.suspend(() =>
  S.Struct({
    BrokerId: S.String.pipe(T.HttpLabel("BrokerId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/brokers/{BrokerId}/users" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListUsersRequest",
}) as any as S.Schema<ListUsersRequest>;
export interface PromoteRequest {
  BrokerId: string;
  Mode?: PromoteMode;
}
export const PromoteRequest = S.suspend(() =>
  S.Struct({
    BrokerId: S.String.pipe(T.HttpLabel("BrokerId")),
    Mode: S.optional(PromoteMode).pipe(T.JsonName("mode")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/brokers/{BrokerId}/promote" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PromoteRequest",
}) as any as S.Schema<PromoteRequest>;
export interface RebootBrokerRequest {
  BrokerId: string;
}
export const RebootBrokerRequest = S.suspend(() =>
  S.Struct({ BrokerId: S.String.pipe(T.HttpLabel("BrokerId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/brokers/{BrokerId}/reboot" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RebootBrokerRequest",
}) as any as S.Schema<RebootBrokerRequest>;
export interface RebootBrokerResponse {}
export const RebootBrokerResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "RebootBrokerResponse",
}) as any as S.Schema<RebootBrokerResponse>;
export interface ConfigurationId {
  Id?: string;
  Revision?: number;
}
export const ConfigurationId = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Revision: S.optional(S.Number).pipe(T.JsonName("revision")),
  }),
).annotations({
  identifier: "ConfigurationId",
}) as any as S.Schema<ConfigurationId>;
export interface LdapServerMetadataInput {
  Hosts?: string[];
  RoleBase?: string;
  RoleName?: string;
  RoleSearchMatching?: string;
  RoleSearchSubtree?: boolean;
  ServiceAccountPassword?: string;
  ServiceAccountUsername?: string;
  UserBase?: string;
  UserRoleName?: string;
  UserSearchMatching?: string;
  UserSearchSubtree?: boolean;
}
export const LdapServerMetadataInput = S.suspend(() =>
  S.Struct({
    Hosts: S.optional(__listOf__string).pipe(T.JsonName("hosts")),
    RoleBase: S.optional(S.String).pipe(T.JsonName("roleBase")),
    RoleName: S.optional(S.String).pipe(T.JsonName("roleName")),
    RoleSearchMatching: S.optional(S.String).pipe(
      T.JsonName("roleSearchMatching"),
    ),
    RoleSearchSubtree: S.optional(S.Boolean).pipe(
      T.JsonName("roleSearchSubtree"),
    ),
    ServiceAccountPassword: S.optional(S.String).pipe(
      T.JsonName("serviceAccountPassword"),
    ),
    ServiceAccountUsername: S.optional(S.String).pipe(
      T.JsonName("serviceAccountUsername"),
    ),
    UserBase: S.optional(S.String).pipe(T.JsonName("userBase")),
    UserRoleName: S.optional(S.String).pipe(T.JsonName("userRoleName")),
    UserSearchMatching: S.optional(S.String).pipe(
      T.JsonName("userSearchMatching"),
    ),
    UserSearchSubtree: S.optional(S.Boolean).pipe(
      T.JsonName("userSearchSubtree"),
    ),
  }),
).annotations({
  identifier: "LdapServerMetadataInput",
}) as any as S.Schema<LdapServerMetadataInput>;
export interface Logs {
  Audit?: boolean;
  General?: boolean;
}
export const Logs = S.suspend(() =>
  S.Struct({
    Audit: S.optional(S.Boolean).pipe(T.JsonName("audit")),
    General: S.optional(S.Boolean).pipe(T.JsonName("general")),
  }),
).annotations({ identifier: "Logs" }) as any as S.Schema<Logs>;
export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY"
  | (string & {});
export const DayOfWeek = S.String;
export interface WeeklyStartTime {
  DayOfWeek?: DayOfWeek;
  TimeOfDay?: string;
  TimeZone?: string;
}
export const WeeklyStartTime = S.suspend(() =>
  S.Struct({
    DayOfWeek: S.optional(DayOfWeek).pipe(T.JsonName("dayOfWeek")),
    TimeOfDay: S.optional(S.String).pipe(T.JsonName("timeOfDay")),
    TimeZone: S.optional(S.String).pipe(T.JsonName("timeZone")),
  }),
).annotations({
  identifier: "WeeklyStartTime",
}) as any as S.Schema<WeeklyStartTime>;
export interface UpdateBrokerRequest {
  AuthenticationStrategy?: AuthenticationStrategy;
  AutoMinorVersionUpgrade?: boolean;
  BrokerId: string;
  Configuration?: ConfigurationId;
  EngineVersion?: string;
  HostInstanceType?: string;
  LdapServerMetadata?: LdapServerMetadataInput;
  Logs?: Logs;
  MaintenanceWindowStartTime?: WeeklyStartTime;
  SecurityGroups?: string[];
  DataReplicationMode?: DataReplicationMode;
}
export const UpdateBrokerRequest = S.suspend(() =>
  S.Struct({
    AuthenticationStrategy: S.optional(AuthenticationStrategy).pipe(
      T.JsonName("authenticationStrategy"),
    ),
    AutoMinorVersionUpgrade: S.optional(S.Boolean).pipe(
      T.JsonName("autoMinorVersionUpgrade"),
    ),
    BrokerId: S.String.pipe(T.HttpLabel("BrokerId")),
    Configuration: S.optional(ConfigurationId)
      .pipe(T.JsonName("configuration"))
      .annotations({ identifier: "ConfigurationId" }),
    EngineVersion: S.optional(S.String).pipe(T.JsonName("engineVersion")),
    HostInstanceType: S.optional(S.String).pipe(T.JsonName("hostInstanceType")),
    LdapServerMetadata: S.optional(LdapServerMetadataInput)
      .pipe(T.JsonName("ldapServerMetadata"))
      .annotations({ identifier: "LdapServerMetadataInput" }),
    Logs: S.optional(Logs)
      .pipe(T.JsonName("logs"))
      .annotations({ identifier: "Logs" }),
    MaintenanceWindowStartTime: S.optional(WeeklyStartTime)
      .pipe(T.JsonName("maintenanceWindowStartTime"))
      .annotations({ identifier: "WeeklyStartTime" }),
    SecurityGroups: S.optional(__listOf__string).pipe(
      T.JsonName("securityGroups"),
    ),
    DataReplicationMode: S.optional(DataReplicationMode).pipe(
      T.JsonName("dataReplicationMode"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/brokers/{BrokerId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBrokerRequest",
}) as any as S.Schema<UpdateBrokerRequest>;
export interface UpdateConfigurationRequest {
  ConfigurationId: string;
  Data?: string;
  Description?: string;
}
export const UpdateConfigurationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationId: S.String.pipe(T.HttpLabel("ConfigurationId")),
    Data: S.optional(S.String).pipe(T.JsonName("data")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/configurations/{ConfigurationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConfigurationRequest",
}) as any as S.Schema<UpdateConfigurationRequest>;
export interface UpdateUserRequest {
  BrokerId: string;
  ConsoleAccess?: boolean;
  Groups?: string[];
  Password?: string;
  Username: string;
  ReplicationUser?: boolean;
}
export const UpdateUserRequest = S.suspend(() =>
  S.Struct({
    BrokerId: S.String.pipe(T.HttpLabel("BrokerId")),
    ConsoleAccess: S.optional(S.Boolean).pipe(T.JsonName("consoleAccess")),
    Groups: S.optional(__listOf__string).pipe(T.JsonName("groups")),
    Password: S.optional(S.String).pipe(T.JsonName("password")),
    Username: S.String.pipe(T.HttpLabel("Username")),
    ReplicationUser: S.optional(S.Boolean).pipe(T.JsonName("replicationUser")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/brokers/{BrokerId}/users/{Username}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateUserRequest",
}) as any as S.Schema<UpdateUserRequest>;
export interface UpdateUserResponse {}
export const UpdateUserResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateUserResponse",
}) as any as S.Schema<UpdateUserResponse>;
export interface EncryptionOptions {
  KmsKeyId?: string;
  UseAwsOwnedKey?: boolean;
}
export const EncryptionOptions = S.suspend(() =>
  S.Struct({
    KmsKeyId: S.optional(S.String).pipe(T.JsonName("kmsKeyId")),
    UseAwsOwnedKey: S.optional(S.Boolean).pipe(T.JsonName("useAwsOwnedKey")),
  }),
).annotations({
  identifier: "EncryptionOptions",
}) as any as S.Schema<EncryptionOptions>;
export interface User {
  ConsoleAccess?: boolean;
  Groups?: string[];
  Password?: string;
  Username?: string;
  ReplicationUser?: boolean;
}
export const User = S.suspend(() =>
  S.Struct({
    ConsoleAccess: S.optional(S.Boolean).pipe(T.JsonName("consoleAccess")),
    Groups: S.optional(__listOf__string).pipe(T.JsonName("groups")),
    Password: S.optional(S.String).pipe(T.JsonName("password")),
    Username: S.optional(S.String).pipe(T.JsonName("username")),
    ReplicationUser: S.optional(S.Boolean).pipe(T.JsonName("replicationUser")),
  }),
).annotations({ identifier: "User" }) as any as S.Schema<User>;
export type __listOfUser = User[];
export const __listOfUser = S.Array(User);
export type BrokerState =
  | "CREATION_IN_PROGRESS"
  | "CREATION_FAILED"
  | "DELETION_IN_PROGRESS"
  | "RUNNING"
  | "REBOOT_IN_PROGRESS"
  | "CRITICAL_ACTION_REQUIRED"
  | "REPLICA"
  | (string & {});
export const BrokerState = S.String;
export interface ConfigurationRevision {
  Created?: Date;
  Description?: string;
  Revision?: number;
}
export const ConfigurationRevision = S.suspend(() =>
  S.Struct({
    Created: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("created"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Revision: S.optional(S.Number).pipe(T.JsonName("revision")),
  }),
).annotations({
  identifier: "ConfigurationRevision",
}) as any as S.Schema<ConfigurationRevision>;
export type __listOfConfigurationRevision = ConfigurationRevision[];
export const __listOfConfigurationRevision = S.Array(ConfigurationRevision);
export interface CreateBrokerRequest {
  AuthenticationStrategy?: AuthenticationStrategy;
  AutoMinorVersionUpgrade?: boolean;
  BrokerName?: string;
  Configuration?: ConfigurationId;
  CreatorRequestId?: string;
  DeploymentMode?: DeploymentMode;
  EncryptionOptions?: EncryptionOptions;
  EngineType?: EngineType;
  EngineVersion?: string;
  HostInstanceType?: string;
  LdapServerMetadata?: LdapServerMetadataInput;
  Logs?: Logs;
  MaintenanceWindowStartTime?: WeeklyStartTime;
  PubliclyAccessible?: boolean;
  SecurityGroups?: string[];
  StorageType?: BrokerStorageType;
  SubnetIds?: string[];
  Tags?: { [key: string]: string | undefined };
  Users?: User[];
  DataReplicationMode?: DataReplicationMode;
  DataReplicationPrimaryBrokerArn?: string;
}
export const CreateBrokerRequest = S.suspend(() =>
  S.Struct({
    AuthenticationStrategy: S.optional(AuthenticationStrategy).pipe(
      T.JsonName("authenticationStrategy"),
    ),
    AutoMinorVersionUpgrade: S.optional(S.Boolean).pipe(
      T.JsonName("autoMinorVersionUpgrade"),
    ),
    BrokerName: S.optional(S.String).pipe(T.JsonName("brokerName")),
    Configuration: S.optional(ConfigurationId)
      .pipe(T.JsonName("configuration"))
      .annotations({ identifier: "ConfigurationId" }),
    CreatorRequestId: S.optional(S.String).pipe(
      T.JsonName("creatorRequestId"),
      T.IdempotencyToken(),
    ),
    DeploymentMode: S.optional(DeploymentMode).pipe(
      T.JsonName("deploymentMode"),
    ),
    EncryptionOptions: S.optional(EncryptionOptions)
      .pipe(T.JsonName("encryptionOptions"))
      .annotations({ identifier: "EncryptionOptions" }),
    EngineType: S.optional(EngineType).pipe(T.JsonName("engineType")),
    EngineVersion: S.optional(S.String).pipe(T.JsonName("engineVersion")),
    HostInstanceType: S.optional(S.String).pipe(T.JsonName("hostInstanceType")),
    LdapServerMetadata: S.optional(LdapServerMetadataInput)
      .pipe(T.JsonName("ldapServerMetadata"))
      .annotations({ identifier: "LdapServerMetadataInput" }),
    Logs: S.optional(Logs)
      .pipe(T.JsonName("logs"))
      .annotations({ identifier: "Logs" }),
    MaintenanceWindowStartTime: S.optional(WeeklyStartTime)
      .pipe(T.JsonName("maintenanceWindowStartTime"))
      .annotations({ identifier: "WeeklyStartTime" }),
    PubliclyAccessible: S.optional(S.Boolean).pipe(
      T.JsonName("publiclyAccessible"),
    ),
    SecurityGroups: S.optional(__listOf__string).pipe(
      T.JsonName("securityGroups"),
    ),
    StorageType: S.optional(BrokerStorageType).pipe(T.JsonName("storageType")),
    SubnetIds: S.optional(__listOf__string).pipe(T.JsonName("subnetIds")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    Users: S.optional(__listOfUser).pipe(T.JsonName("users")),
    DataReplicationMode: S.optional(DataReplicationMode).pipe(
      T.JsonName("dataReplicationMode"),
    ),
    DataReplicationPrimaryBrokerArn: S.optional(S.String).pipe(
      T.JsonName("dataReplicationPrimaryBrokerArn"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/brokers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBrokerRequest",
}) as any as S.Schema<CreateBrokerRequest>;
export interface DeleteBrokerResponse {
  BrokerId?: string;
}
export const DeleteBrokerResponse = S.suspend(() =>
  S.Struct({ BrokerId: S.optional(S.String).pipe(T.JsonName("brokerId")) }),
).annotations({
  identifier: "DeleteBrokerResponse",
}) as any as S.Schema<DeleteBrokerResponse>;
export interface DeleteConfigurationResponse {
  ConfigurationId?: string;
}
export const DeleteConfigurationResponse = S.suspend(() =>
  S.Struct({
    ConfigurationId: S.optional(S.String).pipe(T.JsonName("configurationId")),
  }),
).annotations({
  identifier: "DeleteConfigurationResponse",
}) as any as S.Schema<DeleteConfigurationResponse>;
export interface DescribeConfigurationResponse {
  Arn?: string;
  AuthenticationStrategy?: AuthenticationStrategy;
  Created?: Date;
  Description?: string;
  EngineType?: EngineType;
  EngineVersion?: string;
  Id?: string;
  LatestRevision?: ConfigurationRevision & {
    Created: __timestampIso8601;
    Revision: number;
  };
  Name?: string;
  Tags?: { [key: string]: string | undefined };
}
export const DescribeConfigurationResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    AuthenticationStrategy: S.optional(AuthenticationStrategy).pipe(
      T.JsonName("authenticationStrategy"),
    ),
    Created: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("created"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EngineType: S.optional(EngineType).pipe(T.JsonName("engineType")),
    EngineVersion: S.optional(S.String).pipe(T.JsonName("engineVersion")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    LatestRevision: S.optional(ConfigurationRevision)
      .pipe(T.JsonName("latestRevision"))
      .annotations({ identifier: "ConfigurationRevision" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "DescribeConfigurationResponse",
}) as any as S.Schema<DescribeConfigurationResponse>;
export interface DescribeConfigurationRevisionResponse {
  ConfigurationId?: string;
  Created?: Date;
  Data?: string;
  Description?: string;
}
export const DescribeConfigurationRevisionResponse = S.suspend(() =>
  S.Struct({
    ConfigurationId: S.optional(S.String).pipe(T.JsonName("configurationId")),
    Created: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("created"),
    ),
    Data: S.optional(S.String).pipe(T.JsonName("data")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
  }),
).annotations({
  identifier: "DescribeConfigurationRevisionResponse",
}) as any as S.Schema<DescribeConfigurationRevisionResponse>;
export interface ListConfigurationRevisionsResponse {
  ConfigurationId?: string;
  MaxResults?: number;
  NextToken?: string;
  Revisions?: (ConfigurationRevision & {
    Created: __timestampIso8601;
    Revision: number;
  })[];
}
export const ListConfigurationRevisionsResponse = S.suspend(() =>
  S.Struct({
    ConfigurationId: S.optional(S.String).pipe(T.JsonName("configurationId")),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Revisions: S.optional(__listOfConfigurationRevision).pipe(
      T.JsonName("revisions"),
    ),
  }),
).annotations({
  identifier: "ListConfigurationRevisionsResponse",
}) as any as S.Schema<ListConfigurationRevisionsResponse>;
export interface ListTagsResponse {
  Tags?: { [key: string]: string | undefined };
}
export const ListTagsResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")) }),
).annotations({
  identifier: "ListTagsResponse",
}) as any as S.Schema<ListTagsResponse>;
export type ChangeType = "CREATE" | "UPDATE" | "DELETE" | (string & {});
export const ChangeType = S.String;
export interface UserSummary {
  PendingChange?: ChangeType;
  Username?: string;
}
export const UserSummary = S.suspend(() =>
  S.Struct({
    PendingChange: S.optional(ChangeType).pipe(T.JsonName("pendingChange")),
    Username: S.optional(S.String).pipe(T.JsonName("username")),
  }),
).annotations({ identifier: "UserSummary" }) as any as S.Schema<UserSummary>;
export type __listOfUserSummary = UserSummary[];
export const __listOfUserSummary = S.Array(UserSummary);
export interface ListUsersResponse {
  BrokerId?: string;
  MaxResults?: number;
  NextToken?: string;
  Users?: (UserSummary & { Username: string })[];
}
export const ListUsersResponse = S.suspend(() =>
  S.Struct({
    BrokerId: S.optional(S.String).pipe(T.JsonName("brokerId")),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Users: S.optional(__listOfUserSummary).pipe(T.JsonName("users")),
  }),
).annotations({
  identifier: "ListUsersResponse",
}) as any as S.Schema<ListUsersResponse>;
export interface PromoteResponse {
  BrokerId?: string;
}
export const PromoteResponse = S.suspend(() =>
  S.Struct({ BrokerId: S.optional(S.String).pipe(T.JsonName("brokerId")) }),
).annotations({
  identifier: "PromoteResponse",
}) as any as S.Schema<PromoteResponse>;
export interface LdapServerMetadataOutput {
  Hosts?: string[];
  RoleBase?: string;
  RoleName?: string;
  RoleSearchMatching?: string;
  RoleSearchSubtree?: boolean;
  ServiceAccountUsername?: string;
  UserBase?: string;
  UserRoleName?: string;
  UserSearchMatching?: string;
  UserSearchSubtree?: boolean;
}
export const LdapServerMetadataOutput = S.suspend(() =>
  S.Struct({
    Hosts: S.optional(__listOf__string).pipe(T.JsonName("hosts")),
    RoleBase: S.optional(S.String).pipe(T.JsonName("roleBase")),
    RoleName: S.optional(S.String).pipe(T.JsonName("roleName")),
    RoleSearchMatching: S.optional(S.String).pipe(
      T.JsonName("roleSearchMatching"),
    ),
    RoleSearchSubtree: S.optional(S.Boolean).pipe(
      T.JsonName("roleSearchSubtree"),
    ),
    ServiceAccountUsername: S.optional(S.String).pipe(
      T.JsonName("serviceAccountUsername"),
    ),
    UserBase: S.optional(S.String).pipe(T.JsonName("userBase")),
    UserRoleName: S.optional(S.String).pipe(T.JsonName("userRoleName")),
    UserSearchMatching: S.optional(S.String).pipe(
      T.JsonName("userSearchMatching"),
    ),
    UserSearchSubtree: S.optional(S.Boolean).pipe(
      T.JsonName("userSearchSubtree"),
    ),
  }),
).annotations({
  identifier: "LdapServerMetadataOutput",
}) as any as S.Schema<LdapServerMetadataOutput>;
export interface DataReplicationCounterpart {
  BrokerId?: string;
  Region?: string;
}
export const DataReplicationCounterpart = S.suspend(() =>
  S.Struct({
    BrokerId: S.optional(S.String).pipe(T.JsonName("brokerId")),
    Region: S.optional(S.String).pipe(T.JsonName("region")),
  }),
).annotations({
  identifier: "DataReplicationCounterpart",
}) as any as S.Schema<DataReplicationCounterpart>;
export interface DataReplicationMetadataOutput {
  DataReplicationCounterpart?: DataReplicationCounterpart;
  DataReplicationRole?: string;
}
export const DataReplicationMetadataOutput = S.suspend(() =>
  S.Struct({
    DataReplicationCounterpart: S.optional(DataReplicationCounterpart)
      .pipe(T.JsonName("dataReplicationCounterpart"))
      .annotations({ identifier: "DataReplicationCounterpart" }),
    DataReplicationRole: S.optional(S.String).pipe(
      T.JsonName("dataReplicationRole"),
    ),
  }),
).annotations({
  identifier: "DataReplicationMetadataOutput",
}) as any as S.Schema<DataReplicationMetadataOutput>;
export interface UpdateBrokerResponse {
  AuthenticationStrategy?: AuthenticationStrategy;
  AutoMinorVersionUpgrade?: boolean;
  BrokerId?: string;
  Configuration?: ConfigurationId & { Id: string };
  EngineVersion?: string;
  HostInstanceType?: string;
  LdapServerMetadata?: LdapServerMetadataOutput & {
    Hosts: __listOf__string;
    RoleBase: string;
    RoleSearchMatching: string;
    ServiceAccountUsername: string;
    UserBase: string;
    UserSearchMatching: string;
  };
  Logs?: Logs;
  MaintenanceWindowStartTime?: WeeklyStartTime & {
    DayOfWeek: DayOfWeek;
    TimeOfDay: string;
  };
  SecurityGroups?: string[];
  DataReplicationMetadata?: DataReplicationMetadataOutput & {
    DataReplicationRole: string;
    DataReplicationCounterpart: DataReplicationCounterpart & {
      BrokerId: string;
      Region: string;
    };
  };
  DataReplicationMode?: DataReplicationMode;
  PendingDataReplicationMetadata?: DataReplicationMetadataOutput & {
    DataReplicationRole: string;
    DataReplicationCounterpart: DataReplicationCounterpart & {
      BrokerId: string;
      Region: string;
    };
  };
  PendingDataReplicationMode?: DataReplicationMode;
}
export const UpdateBrokerResponse = S.suspend(() =>
  S.Struct({
    AuthenticationStrategy: S.optional(AuthenticationStrategy).pipe(
      T.JsonName("authenticationStrategy"),
    ),
    AutoMinorVersionUpgrade: S.optional(S.Boolean).pipe(
      T.JsonName("autoMinorVersionUpgrade"),
    ),
    BrokerId: S.optional(S.String).pipe(T.JsonName("brokerId")),
    Configuration: S.optional(ConfigurationId)
      .pipe(T.JsonName("configuration"))
      .annotations({ identifier: "ConfigurationId" }),
    EngineVersion: S.optional(S.String).pipe(T.JsonName("engineVersion")),
    HostInstanceType: S.optional(S.String).pipe(T.JsonName("hostInstanceType")),
    LdapServerMetadata: S.optional(LdapServerMetadataOutput)
      .pipe(T.JsonName("ldapServerMetadata"))
      .annotations({ identifier: "LdapServerMetadataOutput" }),
    Logs: S.optional(Logs)
      .pipe(T.JsonName("logs"))
      .annotations({ identifier: "Logs" }),
    MaintenanceWindowStartTime: S.optional(WeeklyStartTime)
      .pipe(T.JsonName("maintenanceWindowStartTime"))
      .annotations({ identifier: "WeeklyStartTime" }),
    SecurityGroups: S.optional(__listOf__string).pipe(
      T.JsonName("securityGroups"),
    ),
    DataReplicationMetadata: S.optional(DataReplicationMetadataOutput)
      .pipe(T.JsonName("dataReplicationMetadata"))
      .annotations({ identifier: "DataReplicationMetadataOutput" }),
    DataReplicationMode: S.optional(DataReplicationMode).pipe(
      T.JsonName("dataReplicationMode"),
    ),
    PendingDataReplicationMetadata: S.optional(DataReplicationMetadataOutput)
      .pipe(T.JsonName("pendingDataReplicationMetadata"))
      .annotations({ identifier: "DataReplicationMetadataOutput" }),
    PendingDataReplicationMode: S.optional(DataReplicationMode).pipe(
      T.JsonName("pendingDataReplicationMode"),
    ),
  }),
).annotations({
  identifier: "UpdateBrokerResponse",
}) as any as S.Schema<UpdateBrokerResponse>;
export type __listOfConfigurationId = ConfigurationId[];
export const __listOfConfigurationId = S.Array(ConfigurationId);
export type __listOfDeploymentMode = DeploymentMode[];
export const __listOfDeploymentMode = S.Array(DeploymentMode);
export type SanitizationWarningReason =
  | "DISALLOWED_ELEMENT_REMOVED"
  | "DISALLOWED_ATTRIBUTE_REMOVED"
  | "INVALID_ATTRIBUTE_VALUE_REMOVED"
  | (string & {});
export const SanitizationWarningReason = S.String;
export interface ActionRequired {
  ActionRequiredCode?: string;
  ActionRequiredInfo?: string;
}
export const ActionRequired = S.suspend(() =>
  S.Struct({
    ActionRequiredCode: S.optional(S.String).pipe(
      T.JsonName("actionRequiredCode"),
    ),
    ActionRequiredInfo: S.optional(S.String).pipe(
      T.JsonName("actionRequiredInfo"),
    ),
  }),
).annotations({
  identifier: "ActionRequired",
}) as any as S.Schema<ActionRequired>;
export type __listOfActionRequired = ActionRequired[];
export const __listOfActionRequired = S.Array(ActionRequired);
export interface BrokerInstance {
  ConsoleURL?: string;
  Endpoints?: string[];
  IpAddress?: string;
}
export const BrokerInstance = S.suspend(() =>
  S.Struct({
    ConsoleURL: S.optional(S.String).pipe(T.JsonName("consoleURL")),
    Endpoints: S.optional(__listOf__string).pipe(T.JsonName("endpoints")),
    IpAddress: S.optional(S.String).pipe(T.JsonName("ipAddress")),
  }),
).annotations({
  identifier: "BrokerInstance",
}) as any as S.Schema<BrokerInstance>;
export type __listOfBrokerInstance = BrokerInstance[];
export const __listOfBrokerInstance = S.Array(BrokerInstance);
export interface Configurations {
  Current?: ConfigurationId;
  History?: ConfigurationId[];
  Pending?: ConfigurationId;
}
export const Configurations = S.suspend(() =>
  S.Struct({
    Current: S.optional(ConfigurationId)
      .pipe(T.JsonName("current"))
      .annotations({ identifier: "ConfigurationId" }),
    History: S.optional(__listOfConfigurationId).pipe(T.JsonName("history")),
    Pending: S.optional(ConfigurationId)
      .pipe(T.JsonName("pending"))
      .annotations({ identifier: "ConfigurationId" }),
  }),
).annotations({
  identifier: "Configurations",
}) as any as S.Schema<Configurations>;
export interface UserPendingChanges {
  ConsoleAccess?: boolean;
  Groups?: string[];
  PendingChange?: ChangeType;
}
export const UserPendingChanges = S.suspend(() =>
  S.Struct({
    ConsoleAccess: S.optional(S.Boolean).pipe(T.JsonName("consoleAccess")),
    Groups: S.optional(__listOf__string).pipe(T.JsonName("groups")),
    PendingChange: S.optional(ChangeType).pipe(T.JsonName("pendingChange")),
  }),
).annotations({
  identifier: "UserPendingChanges",
}) as any as S.Schema<UserPendingChanges>;
export interface BrokerSummary {
  BrokerArn?: string;
  BrokerId?: string;
  BrokerName?: string;
  BrokerState?: BrokerState;
  Created?: Date;
  DeploymentMode?: DeploymentMode;
  EngineType?: EngineType;
  HostInstanceType?: string;
}
export const BrokerSummary = S.suspend(() =>
  S.Struct({
    BrokerArn: S.optional(S.String).pipe(T.JsonName("brokerArn")),
    BrokerId: S.optional(S.String).pipe(T.JsonName("brokerId")),
    BrokerName: S.optional(S.String).pipe(T.JsonName("brokerName")),
    BrokerState: S.optional(BrokerState).pipe(T.JsonName("brokerState")),
    Created: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("created"),
    ),
    DeploymentMode: S.optional(DeploymentMode).pipe(
      T.JsonName("deploymentMode"),
    ),
    EngineType: S.optional(EngineType).pipe(T.JsonName("engineType")),
    HostInstanceType: S.optional(S.String).pipe(T.JsonName("hostInstanceType")),
  }),
).annotations({
  identifier: "BrokerSummary",
}) as any as S.Schema<BrokerSummary>;
export type __listOfBrokerSummary = BrokerSummary[];
export const __listOfBrokerSummary = S.Array(BrokerSummary);
export interface Configuration {
  Arn?: string;
  AuthenticationStrategy?: AuthenticationStrategy;
  Created?: Date;
  Description?: string;
  EngineType?: EngineType;
  EngineVersion?: string;
  Id?: string;
  LatestRevision?: ConfigurationRevision;
  Name?: string;
  Tags?: { [key: string]: string | undefined };
}
export const Configuration = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    AuthenticationStrategy: S.optional(AuthenticationStrategy).pipe(
      T.JsonName("authenticationStrategy"),
    ),
    Created: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("created"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EngineType: S.optional(EngineType).pipe(T.JsonName("engineType")),
    EngineVersion: S.optional(S.String).pipe(T.JsonName("engineVersion")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    LatestRevision: S.optional(ConfigurationRevision)
      .pipe(T.JsonName("latestRevision"))
      .annotations({ identifier: "ConfigurationRevision" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "Configuration",
}) as any as S.Schema<Configuration>;
export type __listOfConfiguration = Configuration[];
export const __listOfConfiguration = S.Array(Configuration);
export interface SanitizationWarning {
  AttributeName?: string;
  ElementName?: string;
  Reason?: SanitizationWarningReason;
}
export const SanitizationWarning = S.suspend(() =>
  S.Struct({
    AttributeName: S.optional(S.String).pipe(T.JsonName("attributeName")),
    ElementName: S.optional(S.String).pipe(T.JsonName("elementName")),
    Reason: S.optional(SanitizationWarningReason).pipe(T.JsonName("reason")),
  }),
).annotations({
  identifier: "SanitizationWarning",
}) as any as S.Schema<SanitizationWarning>;
export type __listOfSanitizationWarning = SanitizationWarning[];
export const __listOfSanitizationWarning = S.Array(SanitizationWarning);
export interface CreateBrokerResponse {
  BrokerArn?: string;
  BrokerId?: string;
}
export const CreateBrokerResponse = S.suspend(() =>
  S.Struct({
    BrokerArn: S.optional(S.String).pipe(T.JsonName("brokerArn")),
    BrokerId: S.optional(S.String).pipe(T.JsonName("brokerId")),
  }),
).annotations({
  identifier: "CreateBrokerResponse",
}) as any as S.Schema<CreateBrokerResponse>;
export interface CreateConfigurationResponse {
  Arn?: string;
  AuthenticationStrategy?: AuthenticationStrategy;
  Created?: Date;
  Id?: string;
  LatestRevision?: ConfigurationRevision & {
    Created: __timestampIso8601;
    Revision: number;
  };
  Name?: string;
}
export const CreateConfigurationResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    AuthenticationStrategy: S.optional(AuthenticationStrategy).pipe(
      T.JsonName("authenticationStrategy"),
    ),
    Created: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("created"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    LatestRevision: S.optional(ConfigurationRevision)
      .pipe(T.JsonName("latestRevision"))
      .annotations({ identifier: "ConfigurationRevision" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
  }),
).annotations({
  identifier: "CreateConfigurationResponse",
}) as any as S.Schema<CreateConfigurationResponse>;
export interface DescribeUserResponse {
  BrokerId?: string;
  ConsoleAccess?: boolean;
  Groups?: string[];
  Pending?: UserPendingChanges & { PendingChange: ChangeType };
  Username?: string;
  ReplicationUser?: boolean;
}
export const DescribeUserResponse = S.suspend(() =>
  S.Struct({
    BrokerId: S.optional(S.String).pipe(T.JsonName("brokerId")),
    ConsoleAccess: S.optional(S.Boolean).pipe(T.JsonName("consoleAccess")),
    Groups: S.optional(__listOf__string).pipe(T.JsonName("groups")),
    Pending: S.optional(UserPendingChanges)
      .pipe(T.JsonName("pending"))
      .annotations({ identifier: "UserPendingChanges" }),
    Username: S.optional(S.String).pipe(T.JsonName("username")),
    ReplicationUser: S.optional(S.Boolean).pipe(T.JsonName("replicationUser")),
  }),
).annotations({
  identifier: "DescribeUserResponse",
}) as any as S.Schema<DescribeUserResponse>;
export interface ListBrokersResponse {
  BrokerSummaries?: (BrokerSummary & {
    DeploymentMode: DeploymentMode;
    EngineType: EngineType;
  })[];
  NextToken?: string;
}
export const ListBrokersResponse = S.suspend(() =>
  S.Struct({
    BrokerSummaries: S.optional(__listOfBrokerSummary).pipe(
      T.JsonName("brokerSummaries"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListBrokersResponse",
}) as any as S.Schema<ListBrokersResponse>;
export interface ListConfigurationsResponse {
  Configurations?: (Configuration & {
    Arn: string;
    AuthenticationStrategy: AuthenticationStrategy;
    Created: __timestampIso8601;
    Description: string;
    EngineType: EngineType;
    EngineVersion: string;
    Id: string;
    LatestRevision: ConfigurationRevision & {
      Created: __timestampIso8601;
      Revision: number;
    };
    Name: string;
  })[];
  MaxResults?: number;
  NextToken?: string;
}
export const ListConfigurationsResponse = S.suspend(() =>
  S.Struct({
    Configurations: S.optional(__listOfConfiguration).pipe(
      T.JsonName("configurations"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListConfigurationsResponse",
}) as any as S.Schema<ListConfigurationsResponse>;
export interface UpdateConfigurationResponse {
  Arn?: string;
  Created?: Date;
  Id?: string;
  LatestRevision?: ConfigurationRevision & {
    Created: __timestampIso8601;
    Revision: number;
  };
  Name?: string;
  Warnings?: (SanitizationWarning & { Reason: SanitizationWarningReason })[];
}
export const UpdateConfigurationResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Created: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("created"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    LatestRevision: S.optional(ConfigurationRevision)
      .pipe(T.JsonName("latestRevision"))
      .annotations({ identifier: "ConfigurationRevision" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Warnings: S.optional(__listOfSanitizationWarning).pipe(
      T.JsonName("warnings"),
    ),
  }),
).annotations({
  identifier: "UpdateConfigurationResponse",
}) as any as S.Schema<UpdateConfigurationResponse>;
export interface PendingLogs {
  Audit?: boolean;
  General?: boolean;
}
export const PendingLogs = S.suspend(() =>
  S.Struct({
    Audit: S.optional(S.Boolean).pipe(T.JsonName("audit")),
    General: S.optional(S.Boolean).pipe(T.JsonName("general")),
  }),
).annotations({ identifier: "PendingLogs" }) as any as S.Schema<PendingLogs>;
export interface EngineVersion {
  Name?: string;
}
export const EngineVersion = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String).pipe(T.JsonName("name")) }),
).annotations({
  identifier: "EngineVersion",
}) as any as S.Schema<EngineVersion>;
export type __listOfEngineVersion = EngineVersion[];
export const __listOfEngineVersion = S.Array(EngineVersion);
export interface AvailabilityZone {
  Name?: string;
}
export const AvailabilityZone = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String).pipe(T.JsonName("name")) }),
).annotations({
  identifier: "AvailabilityZone",
}) as any as S.Schema<AvailabilityZone>;
export type __listOfAvailabilityZone = AvailabilityZone[];
export const __listOfAvailabilityZone = S.Array(AvailabilityZone);
export interface LogsSummary {
  Audit?: boolean;
  AuditLogGroup?: string;
  General?: boolean;
  GeneralLogGroup?: string;
  Pending?: PendingLogs;
}
export const LogsSummary = S.suspend(() =>
  S.Struct({
    Audit: S.optional(S.Boolean).pipe(T.JsonName("audit")),
    AuditLogGroup: S.optional(S.String).pipe(T.JsonName("auditLogGroup")),
    General: S.optional(S.Boolean).pipe(T.JsonName("general")),
    GeneralLogGroup: S.optional(S.String).pipe(T.JsonName("generalLogGroup")),
    Pending: S.optional(PendingLogs)
      .pipe(T.JsonName("pending"))
      .annotations({ identifier: "PendingLogs" }),
  }),
).annotations({ identifier: "LogsSummary" }) as any as S.Schema<LogsSummary>;
export interface BrokerEngineType {
  EngineType?: EngineType;
  EngineVersions?: EngineVersion[];
}
export const BrokerEngineType = S.suspend(() =>
  S.Struct({
    EngineType: S.optional(EngineType).pipe(T.JsonName("engineType")),
    EngineVersions: S.optional(__listOfEngineVersion).pipe(
      T.JsonName("engineVersions"),
    ),
  }),
).annotations({
  identifier: "BrokerEngineType",
}) as any as S.Schema<BrokerEngineType>;
export type __listOfBrokerEngineType = BrokerEngineType[];
export const __listOfBrokerEngineType = S.Array(BrokerEngineType);
export interface BrokerInstanceOption {
  AvailabilityZones?: AvailabilityZone[];
  EngineType?: EngineType;
  HostInstanceType?: string;
  StorageType?: BrokerStorageType;
  SupportedDeploymentModes?: DeploymentMode[];
  SupportedEngineVersions?: string[];
}
export const BrokerInstanceOption = S.suspend(() =>
  S.Struct({
    AvailabilityZones: S.optional(__listOfAvailabilityZone).pipe(
      T.JsonName("availabilityZones"),
    ),
    EngineType: S.optional(EngineType).pipe(T.JsonName("engineType")),
    HostInstanceType: S.optional(S.String).pipe(T.JsonName("hostInstanceType")),
    StorageType: S.optional(BrokerStorageType).pipe(T.JsonName("storageType")),
    SupportedDeploymentModes: S.optional(__listOfDeploymentMode).pipe(
      T.JsonName("supportedDeploymentModes"),
    ),
    SupportedEngineVersions: S.optional(__listOf__string).pipe(
      T.JsonName("supportedEngineVersions"),
    ),
  }),
).annotations({
  identifier: "BrokerInstanceOption",
}) as any as S.Schema<BrokerInstanceOption>;
export type __listOfBrokerInstanceOption = BrokerInstanceOption[];
export const __listOfBrokerInstanceOption = S.Array(BrokerInstanceOption);
export interface DescribeBrokerResponse {
  ActionsRequired?: ActionRequired[];
  AuthenticationStrategy?: AuthenticationStrategy;
  AutoMinorVersionUpgrade?: boolean;
  BrokerArn?: string;
  BrokerId?: string;
  BrokerInstances?: BrokerInstance[];
  BrokerName?: string;
  BrokerState?: BrokerState;
  Configurations?: Configurations & {
    Current: ConfigurationId & { Id: string };
    History: (ConfigurationId & { Id: string })[];
    Pending: ConfigurationId & { Id: string };
  };
  Created?: Date;
  DeploymentMode?: DeploymentMode;
  EncryptionOptions?: EncryptionOptions & { UseAwsOwnedKey: boolean };
  EngineType?: EngineType;
  EngineVersion?: string;
  HostInstanceType?: string;
  LdapServerMetadata?: LdapServerMetadataOutput & {
    Hosts: __listOf__string;
    RoleBase: string;
    RoleSearchMatching: string;
    ServiceAccountUsername: string;
    UserBase: string;
    UserSearchMatching: string;
  };
  Logs?: LogsSummary & { General: boolean; GeneralLogGroup: string };
  MaintenanceWindowStartTime?: WeeklyStartTime & {
    DayOfWeek: DayOfWeek;
    TimeOfDay: string;
  };
  PendingAuthenticationStrategy?: AuthenticationStrategy;
  PendingEngineVersion?: string;
  PendingHostInstanceType?: string;
  PendingLdapServerMetadata?: LdapServerMetadataOutput & {
    Hosts: __listOf__string;
    RoleBase: string;
    RoleSearchMatching: string;
    ServiceAccountUsername: string;
    UserBase: string;
    UserSearchMatching: string;
  };
  PendingSecurityGroups?: string[];
  PubliclyAccessible?: boolean;
  SecurityGroups?: string[];
  StorageType?: BrokerStorageType;
  SubnetIds?: string[];
  Tags?: { [key: string]: string | undefined };
  Users?: (UserSummary & { Username: string })[];
  DataReplicationMetadata?: DataReplicationMetadataOutput & {
    DataReplicationRole: string;
    DataReplicationCounterpart: DataReplicationCounterpart & {
      BrokerId: string;
      Region: string;
    };
  };
  DataReplicationMode?: DataReplicationMode;
  PendingDataReplicationMetadata?: DataReplicationMetadataOutput & {
    DataReplicationRole: string;
    DataReplicationCounterpart: DataReplicationCounterpart & {
      BrokerId: string;
      Region: string;
    };
  };
  PendingDataReplicationMode?: DataReplicationMode;
}
export const DescribeBrokerResponse = S.suspend(() =>
  S.Struct({
    ActionsRequired: S.optional(__listOfActionRequired).pipe(
      T.JsonName("actionsRequired"),
    ),
    AuthenticationStrategy: S.optional(AuthenticationStrategy).pipe(
      T.JsonName("authenticationStrategy"),
    ),
    AutoMinorVersionUpgrade: S.optional(S.Boolean).pipe(
      T.JsonName("autoMinorVersionUpgrade"),
    ),
    BrokerArn: S.optional(S.String).pipe(T.JsonName("brokerArn")),
    BrokerId: S.optional(S.String).pipe(T.JsonName("brokerId")),
    BrokerInstances: S.optional(__listOfBrokerInstance).pipe(
      T.JsonName("brokerInstances"),
    ),
    BrokerName: S.optional(S.String).pipe(T.JsonName("brokerName")),
    BrokerState: S.optional(BrokerState).pipe(T.JsonName("brokerState")),
    Configurations: S.optional(Configurations)
      .pipe(T.JsonName("configurations"))
      .annotations({ identifier: "Configurations" }),
    Created: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("created"),
    ),
    DeploymentMode: S.optional(DeploymentMode).pipe(
      T.JsonName("deploymentMode"),
    ),
    EncryptionOptions: S.optional(EncryptionOptions)
      .pipe(T.JsonName("encryptionOptions"))
      .annotations({ identifier: "EncryptionOptions" }),
    EngineType: S.optional(EngineType).pipe(T.JsonName("engineType")),
    EngineVersion: S.optional(S.String).pipe(T.JsonName("engineVersion")),
    HostInstanceType: S.optional(S.String).pipe(T.JsonName("hostInstanceType")),
    LdapServerMetadata: S.optional(LdapServerMetadataOutput)
      .pipe(T.JsonName("ldapServerMetadata"))
      .annotations({ identifier: "LdapServerMetadataOutput" }),
    Logs: S.optional(LogsSummary)
      .pipe(T.JsonName("logs"))
      .annotations({ identifier: "LogsSummary" }),
    MaintenanceWindowStartTime: S.optional(WeeklyStartTime)
      .pipe(T.JsonName("maintenanceWindowStartTime"))
      .annotations({ identifier: "WeeklyStartTime" }),
    PendingAuthenticationStrategy: S.optional(AuthenticationStrategy).pipe(
      T.JsonName("pendingAuthenticationStrategy"),
    ),
    PendingEngineVersion: S.optional(S.String).pipe(
      T.JsonName("pendingEngineVersion"),
    ),
    PendingHostInstanceType: S.optional(S.String).pipe(
      T.JsonName("pendingHostInstanceType"),
    ),
    PendingLdapServerMetadata: S.optional(LdapServerMetadataOutput)
      .pipe(T.JsonName("pendingLdapServerMetadata"))
      .annotations({ identifier: "LdapServerMetadataOutput" }),
    PendingSecurityGroups: S.optional(__listOf__string).pipe(
      T.JsonName("pendingSecurityGroups"),
    ),
    PubliclyAccessible: S.optional(S.Boolean).pipe(
      T.JsonName("publiclyAccessible"),
    ),
    SecurityGroups: S.optional(__listOf__string).pipe(
      T.JsonName("securityGroups"),
    ),
    StorageType: S.optional(BrokerStorageType).pipe(T.JsonName("storageType")),
    SubnetIds: S.optional(__listOf__string).pipe(T.JsonName("subnetIds")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    Users: S.optional(__listOfUserSummary).pipe(T.JsonName("users")),
    DataReplicationMetadata: S.optional(DataReplicationMetadataOutput)
      .pipe(T.JsonName("dataReplicationMetadata"))
      .annotations({ identifier: "DataReplicationMetadataOutput" }),
    DataReplicationMode: S.optional(DataReplicationMode).pipe(
      T.JsonName("dataReplicationMode"),
    ),
    PendingDataReplicationMetadata: S.optional(DataReplicationMetadataOutput)
      .pipe(T.JsonName("pendingDataReplicationMetadata"))
      .annotations({ identifier: "DataReplicationMetadataOutput" }),
    PendingDataReplicationMode: S.optional(DataReplicationMode).pipe(
      T.JsonName("pendingDataReplicationMode"),
    ),
  }),
).annotations({
  identifier: "DescribeBrokerResponse",
}) as any as S.Schema<DescribeBrokerResponse>;
export interface DescribeBrokerEngineTypesResponse {
  BrokerEngineTypes?: BrokerEngineType[];
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeBrokerEngineTypesResponse = S.suspend(() =>
  S.Struct({
    BrokerEngineTypes: S.optional(__listOfBrokerEngineType).pipe(
      T.JsonName("brokerEngineTypes"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "DescribeBrokerEngineTypesResponse",
}) as any as S.Schema<DescribeBrokerEngineTypesResponse>;
export interface DescribeBrokerInstanceOptionsResponse {
  BrokerInstanceOptions?: BrokerInstanceOption[];
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeBrokerInstanceOptionsResponse = S.suspend(() =>
  S.Struct({
    BrokerInstanceOptions: S.optional(__listOfBrokerInstanceOption).pipe(
      T.JsonName("brokerInstanceOptions"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "DescribeBrokerInstanceOptionsResponse",
}) as any as S.Schema<DescribeBrokerInstanceOptionsResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {
    ErrorAttribute: S.optional(S.String).pipe(T.JsonName("errorAttribute")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
).pipe(C.withBadRequestError) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  {
    ErrorAttribute: S.optional(S.String).pipe(T.JsonName("errorAttribute")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    ErrorAttribute: S.optional(S.String).pipe(T.JsonName("errorAttribute")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
).pipe(C.withConflictError) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  {
    ErrorAttribute: S.optional(S.String).pipe(T.JsonName("errorAttribute")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
).pipe(C.withServerError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {
    ErrorAttribute: S.optional(S.String).pipe(T.JsonName("errorAttribute")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
).pipe(C.withBadRequestError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  {
    ErrorAttribute: S.optional(S.String).pipe(T.JsonName("errorAttribute")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
).pipe(C.withAuthError) {}

//# Operations
/**
 * Describe available engine types and versions.
 */
export const describeBrokerEngineTypes: (
  input: DescribeBrokerEngineTypesRequest,
) => effect.Effect<
  DescribeBrokerEngineTypesResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBrokerEngineTypesRequest,
  output: DescribeBrokerEngineTypesResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
  ],
}));
/**
 * Describe available broker instance options.
 */
export const describeBrokerInstanceOptions: (
  input: DescribeBrokerInstanceOptionsRequest,
) => effect.Effect<
  DescribeBrokerInstanceOptionsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBrokerInstanceOptionsRequest,
  output: DescribeBrokerInstanceOptionsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
  ],
}));
/**
 * Returns a list of all brokers.
 */
export const listBrokers: {
  (
    input: ListBrokersRequest,
  ): effect.Effect<
    ListBrokersResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBrokersRequest,
  ) => stream.Stream<
    ListBrokersResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBrokersRequest,
  ) => stream.Stream<
    BrokerSummary,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBrokersRequest,
  output: ListBrokersResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "BrokerSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of all configurations.
 */
export const listConfigurations: (
  input: ListConfigurationsRequest,
) => effect.Effect<
  ListConfigurationsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListConfigurationsRequest,
  output: ListConfigurationsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
  ],
}));
/**
 * Creates a new configuration for the specified configuration name. Amazon MQ uses the default configuration (the engine type and version).
 */
export const createConfiguration: (
  input: CreateConfigurationRequest,
) => effect.Effect<
  CreateConfigurationResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConfigurationRequest,
  output: CreateConfigurationResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
  ],
}));
/**
 * Add a tag to a resource.
 */
export const createTags: (
  input: CreateTagsRequest,
) => effect.Effect<
  CreateTagsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTagsRequest,
  output: CreateTagsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Creates a broker. Note: This API is asynchronous.
 *
 * To create a broker, you must either use the AmazonMQFullAccess IAM policy or include the following EC2 permissions in your IAM policy.
 *
 * - ec2:CreateNetworkInterface
 *
 * This permission is required to allow Amazon MQ to create an elastic network interface (ENI) on behalf of your account.
 *
 * - ec2:CreateNetworkInterfacePermission
 *
 * This permission is required to attach the ENI to the broker instance.
 *
 * - ec2:DeleteNetworkInterface
 *
 * - ec2:DeleteNetworkInterfacePermission
 *
 * - ec2:DetachNetworkInterface
 *
 * - ec2:DescribeInternetGateways
 *
 * - ec2:DescribeNetworkInterfaces
 *
 * - ec2:DescribeNetworkInterfacePermissions
 *
 * - ec2:DescribeRouteTables
 *
 * - ec2:DescribeSecurityGroups
 *
 * - ec2:DescribeSubnets
 *
 * - ec2:DescribeVpcs
 *
 * For more information, see Create an IAM User and Get Your Amazon Web Services Credentials and Never Modify or Delete the Amazon MQ Elastic Network Interface in the *Amazon MQ Developer Guide*.
 */
export const createBroker: (
  input: CreateBrokerRequest,
) => effect.Effect<
  CreateBrokerResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBrokerRequest,
  output: CreateBrokerResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    UnauthorizedException,
  ],
}));
/**
 * Returns information about the specified broker.
 */
export const describeBroker: (
  input: DescribeBrokerRequest,
) => effect.Effect<
  DescribeBrokerResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBrokerRequest,
  output: DescribeBrokerResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Deletes the specified configuration.
 */
export const deleteConfiguration: (
  input: DeleteConfigurationRequest,
) => effect.Effect<
  DeleteConfigurationResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfigurationRequest,
  output: DeleteConfigurationResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Returns information about an ActiveMQ user.
 */
export const describeUser: (
  input: DescribeUserRequest,
) => effect.Effect<
  DescribeUserResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUserRequest,
  output: DescribeUserResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Updates the specified configuration.
 */
export const updateConfiguration: (
  input: UpdateConfigurationRequest,
) => effect.Effect<
  UpdateConfigurationResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConfigurationRequest,
  output: UpdateConfigurationResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Deletes a broker. Note: This API is asynchronous.
 */
export const deleteBroker: (
  input: DeleteBrokerRequest,
) => effect.Effect<
  DeleteBrokerResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBrokerRequest,
  output: DeleteBrokerResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Returns information about the specified configuration.
 */
export const describeConfiguration: (
  input: DescribeConfigurationRequest,
) => effect.Effect<
  DescribeConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConfigurationRequest,
  output: DescribeConfigurationResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Returns the specified configuration revision for the specified configuration.
 */
export const describeConfigurationRevision: (
  input: DescribeConfigurationRevisionRequest,
) => effect.Effect<
  DescribeConfigurationRevisionResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConfigurationRevisionRequest,
  output: DescribeConfigurationRevisionResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Returns a list of all revisions for the specified configuration.
 */
export const listConfigurationRevisions: (
  input: ListConfigurationRevisionsRequest,
) => effect.Effect<
  ListConfigurationRevisionsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListConfigurationRevisionsRequest,
  output: ListConfigurationRevisionsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Lists tags for a resource.
 */
export const listTags: (
  input: ListTagsRequest,
) => effect.Effect<
  ListTagsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsRequest,
  output: ListTagsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Returns a list of all ActiveMQ users.
 */
export const listUsers: (
  input: ListUsersRequest,
) => effect.Effect<
  ListUsersResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListUsersRequest,
  output: ListUsersResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Promotes a data replication replica broker to the primary broker role.
 */
export const promote: (
  input: PromoteRequest,
) => effect.Effect<
  PromoteResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PromoteRequest,
  output: PromoteResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Removes a tag from a resource.
 */
export const deleteTags: (
  input: DeleteTagsRequest,
) => effect.Effect<
  DeleteTagsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTagsRequest,
  output: DeleteTagsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Deletes an ActiveMQ user.
 */
export const deleteUser: (
  input: DeleteUserRequest,
) => effect.Effect<
  DeleteUserResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserRequest,
  output: DeleteUserResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Reboots a broker. Note: This API is asynchronous.
 */
export const rebootBroker: (
  input: RebootBrokerRequest,
) => effect.Effect<
  RebootBrokerResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootBrokerRequest,
  output: RebootBrokerResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Adds a pending configuration change to a broker.
 */
export const updateBroker: (
  input: UpdateBrokerRequest,
) => effect.Effect<
  UpdateBrokerResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBrokerRequest,
  output: UpdateBrokerResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Creates an ActiveMQ user.
 *
 * Do not add personally identifiable information (PII) or other confidential or sensitive information in broker usernames. Broker usernames are accessible to other Amazon Web Services services, including CloudWatch Logs. Broker usernames are not intended to be used for private or sensitive data.
 */
export const createUser: (
  input: CreateUserRequest,
) => effect.Effect<
  CreateUserResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserRequest,
  output: CreateUserResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Updates the information for an ActiveMQ user.
 */
export const updateUser: (
  input: UpdateUserRequest,
) => effect.Effect<
  UpdateUserResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserRequest,
  output: UpdateUserResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));

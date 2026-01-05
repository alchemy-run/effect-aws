import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({ sdkId: "mq", serviceShapeName: "mq" });
const auth = T.AwsAuthSigv4({ name: "mq" });
const ver = T.ServiceVersion("2017-11-27");
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
                        url: "https://mq-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://mq-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://mq.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://mq.{Region}.{PartitionResult#dnsSuffix}",
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
export const __listOf__string = S.Array(S.String);
export const __mapOf__string = S.Record({ key: S.String, value: S.String });
export class CreateConfigurationRequest extends S.Class<CreateConfigurationRequest>(
  "CreateConfigurationRequest",
)(
  {
    AuthenticationStrategy: S.optional(S.String).pipe(
      T.JsonName("authenticationStrategy"),
    ),
    EngineType: S.String.pipe(T.JsonName("engineType")),
    EngineVersion: S.optional(S.String).pipe(T.JsonName("engineVersion")),
    Name: S.String.pipe(T.JsonName("name")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTagsRequest extends S.Class<CreateTagsRequest>(
  "CreateTagsRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTagsResponse extends S.Class<CreateTagsResponse>(
  "CreateTagsResponse",
)({}) {}
export class CreateUserRequest extends S.Class<CreateUserRequest>(
  "CreateUserRequest",
)(
  {
    BrokerId: S.String.pipe(T.HttpLabel("BrokerId")),
    ConsoleAccess: S.optional(S.Boolean).pipe(T.JsonName("consoleAccess")),
    Groups: S.optional(__listOf__string).pipe(T.JsonName("groups")),
    Password: S.String.pipe(T.JsonName("password")),
    Username: S.String.pipe(T.HttpLabel("Username")),
    ReplicationUser: S.optional(S.Boolean).pipe(T.JsonName("replicationUser")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/brokers/{BrokerId}/users/{Username}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateUserResponse extends S.Class<CreateUserResponse>(
  "CreateUserResponse",
)({}) {}
export class DeleteBrokerRequest extends S.Class<DeleteBrokerRequest>(
  "DeleteBrokerRequest",
)(
  { BrokerId: S.String.pipe(T.HttpLabel("BrokerId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/brokers/{BrokerId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfigurationRequest extends S.Class<DeleteConfigurationRequest>(
  "DeleteConfigurationRequest",
)(
  { ConfigurationId: S.String.pipe(T.HttpLabel("ConfigurationId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/configurations/{ConfigurationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTagsRequest extends S.Class<DeleteTagsRequest>(
  "DeleteTagsRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: __listOf__string.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTagsResponse extends S.Class<DeleteTagsResponse>(
  "DeleteTagsResponse",
)({}) {}
export class DeleteUserRequest extends S.Class<DeleteUserRequest>(
  "DeleteUserRequest",
)(
  {
    BrokerId: S.String.pipe(T.HttpLabel("BrokerId")),
    Username: S.String.pipe(T.HttpLabel("Username")),
  },
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
) {}
export class DeleteUserResponse extends S.Class<DeleteUserResponse>(
  "DeleteUserResponse",
)({}) {}
export class DescribeBrokerRequest extends S.Class<DescribeBrokerRequest>(
  "DescribeBrokerRequest",
)(
  { BrokerId: S.String.pipe(T.HttpLabel("BrokerId")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/brokers/{BrokerId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeBrokerEngineTypesRequest extends S.Class<DescribeBrokerEngineTypesRequest>(
  "DescribeBrokerEngineTypesRequest",
)(
  {
    EngineType: S.optional(S.String).pipe(T.HttpQuery("engineType")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/broker-engine-types" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeBrokerInstanceOptionsRequest extends S.Class<DescribeBrokerInstanceOptionsRequest>(
  "DescribeBrokerInstanceOptionsRequest",
)(
  {
    EngineType: S.optional(S.String).pipe(T.HttpQuery("engineType")),
    HostInstanceType: S.optional(S.String).pipe(
      T.HttpQuery("hostInstanceType"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    StorageType: S.optional(S.String).pipe(T.HttpQuery("storageType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/broker-instance-options" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeConfigurationRequest extends S.Class<DescribeConfigurationRequest>(
  "DescribeConfigurationRequest",
)(
  { ConfigurationId: S.String.pipe(T.HttpLabel("ConfigurationId")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/configurations/{ConfigurationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeConfigurationRevisionRequest extends S.Class<DescribeConfigurationRevisionRequest>(
  "DescribeConfigurationRevisionRequest",
)(
  {
    ConfigurationId: S.String.pipe(T.HttpLabel("ConfigurationId")),
    ConfigurationRevision: S.String.pipe(T.HttpLabel("ConfigurationRevision")),
  },
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
) {}
export class DescribeUserRequest extends S.Class<DescribeUserRequest>(
  "DescribeUserRequest",
)(
  {
    BrokerId: S.String.pipe(T.HttpLabel("BrokerId")),
    Username: S.String.pipe(T.HttpLabel("Username")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/brokers/{BrokerId}/users/{Username}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBrokersRequest extends S.Class<ListBrokersRequest>(
  "ListBrokersRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/brokers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConfigurationRevisionsRequest extends S.Class<ListConfigurationRevisionsRequest>(
  "ListConfigurationRevisionsRequest",
)(
  {
    ConfigurationId: S.String.pipe(T.HttpLabel("ConfigurationId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
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
) {}
export class ListConfigurationsRequest extends S.Class<ListConfigurationsRequest>(
  "ListConfigurationsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsRequest extends S.Class<ListTagsRequest>(
  "ListTagsRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/tags/{ResourceArn}" }),
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
    BrokerId: S.String.pipe(T.HttpLabel("BrokerId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/brokers/{BrokerId}/users" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PromoteRequest extends S.Class<PromoteRequest>("PromoteRequest")(
  {
    BrokerId: S.String.pipe(T.HttpLabel("BrokerId")),
    Mode: S.String.pipe(T.JsonName("mode")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/brokers/{BrokerId}/promote" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RebootBrokerRequest extends S.Class<RebootBrokerRequest>(
  "RebootBrokerRequest",
)(
  { BrokerId: S.String.pipe(T.HttpLabel("BrokerId")) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/brokers/{BrokerId}/reboot" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RebootBrokerResponse extends S.Class<RebootBrokerResponse>(
  "RebootBrokerResponse",
)({}) {}
export class ConfigurationId extends S.Class<ConfigurationId>(
  "ConfigurationId",
)({
  Id: S.String.pipe(T.JsonName("id")),
  Revision: S.optional(S.Number).pipe(T.JsonName("revision")),
}) {}
export class LdapServerMetadataInput extends S.Class<LdapServerMetadataInput>(
  "LdapServerMetadataInput",
)({
  Hosts: __listOf__string.pipe(T.JsonName("hosts")),
  RoleBase: S.String.pipe(T.JsonName("roleBase")),
  RoleName: S.optional(S.String).pipe(T.JsonName("roleName")),
  RoleSearchMatching: S.String.pipe(T.JsonName("roleSearchMatching")),
  RoleSearchSubtree: S.optional(S.Boolean).pipe(
    T.JsonName("roleSearchSubtree"),
  ),
  ServiceAccountPassword: S.String.pipe(T.JsonName("serviceAccountPassword")),
  ServiceAccountUsername: S.String.pipe(T.JsonName("serviceAccountUsername")),
  UserBase: S.String.pipe(T.JsonName("userBase")),
  UserRoleName: S.optional(S.String).pipe(T.JsonName("userRoleName")),
  UserSearchMatching: S.String.pipe(T.JsonName("userSearchMatching")),
  UserSearchSubtree: S.optional(S.Boolean).pipe(
    T.JsonName("userSearchSubtree"),
  ),
}) {}
export class Logs extends S.Class<Logs>("Logs")({
  Audit: S.optional(S.Boolean).pipe(T.JsonName("audit")),
  General: S.optional(S.Boolean).pipe(T.JsonName("general")),
}) {}
export class WeeklyStartTime extends S.Class<WeeklyStartTime>(
  "WeeklyStartTime",
)({
  DayOfWeek: S.String.pipe(T.JsonName("dayOfWeek")),
  TimeOfDay: S.String.pipe(T.JsonName("timeOfDay")),
  TimeZone: S.optional(S.String).pipe(T.JsonName("timeZone")),
}) {}
export class UpdateBrokerRequest extends S.Class<UpdateBrokerRequest>(
  "UpdateBrokerRequest",
)(
  {
    AuthenticationStrategy: S.optional(S.String).pipe(
      T.JsonName("authenticationStrategy"),
    ),
    AutoMinorVersionUpgrade: S.optional(S.Boolean).pipe(
      T.JsonName("autoMinorVersionUpgrade"),
    ),
    BrokerId: S.String.pipe(T.HttpLabel("BrokerId")),
    Configuration: S.optional(ConfigurationId).pipe(
      T.JsonName("configuration"),
    ),
    EngineVersion: S.optional(S.String).pipe(T.JsonName("engineVersion")),
    HostInstanceType: S.optional(S.String).pipe(T.JsonName("hostInstanceType")),
    LdapServerMetadata: S.optional(LdapServerMetadataInput).pipe(
      T.JsonName("ldapServerMetadata"),
    ),
    Logs: S.optional(Logs).pipe(T.JsonName("logs")),
    MaintenanceWindowStartTime: S.optional(WeeklyStartTime).pipe(
      T.JsonName("maintenanceWindowStartTime"),
    ),
    SecurityGroups: S.optional(__listOf__string).pipe(
      T.JsonName("securityGroups"),
    ),
    DataReplicationMode: S.optional(S.String).pipe(
      T.JsonName("dataReplicationMode"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/brokers/{BrokerId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateConfigurationRequest extends S.Class<UpdateConfigurationRequest>(
  "UpdateConfigurationRequest",
)(
  {
    ConfigurationId: S.String.pipe(T.HttpLabel("ConfigurationId")),
    Data: S.String.pipe(T.JsonName("data")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/configurations/{ConfigurationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateUserRequest extends S.Class<UpdateUserRequest>(
  "UpdateUserRequest",
)(
  {
    BrokerId: S.String.pipe(T.HttpLabel("BrokerId")),
    ConsoleAccess: S.optional(S.Boolean).pipe(T.JsonName("consoleAccess")),
    Groups: S.optional(__listOf__string).pipe(T.JsonName("groups")),
    Password: S.optional(S.String).pipe(T.JsonName("password")),
    Username: S.String.pipe(T.HttpLabel("Username")),
    ReplicationUser: S.optional(S.Boolean).pipe(T.JsonName("replicationUser")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/brokers/{BrokerId}/users/{Username}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateUserResponse extends S.Class<UpdateUserResponse>(
  "UpdateUserResponse",
)({}) {}
export class EncryptionOptions extends S.Class<EncryptionOptions>(
  "EncryptionOptions",
)({
  KmsKeyId: S.optional(S.String).pipe(T.JsonName("kmsKeyId")),
  UseAwsOwnedKey: S.Boolean.pipe(T.JsonName("useAwsOwnedKey")),
}) {}
export class User extends S.Class<User>("User")({
  ConsoleAccess: S.optional(S.Boolean).pipe(T.JsonName("consoleAccess")),
  Groups: S.optional(__listOf__string).pipe(T.JsonName("groups")),
  Password: S.String.pipe(T.JsonName("password")),
  Username: S.String.pipe(T.JsonName("username")),
  ReplicationUser: S.optional(S.Boolean).pipe(T.JsonName("replicationUser")),
}) {}
export const __listOfUser = S.Array(User);
export class ConfigurationRevision extends S.Class<ConfigurationRevision>(
  "ConfigurationRevision",
)({
  Created: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("created"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Revision: S.Number.pipe(T.JsonName("revision")),
}) {}
export const __listOfConfigurationRevision = S.Array(ConfigurationRevision);
export class CreateBrokerRequest extends S.Class<CreateBrokerRequest>(
  "CreateBrokerRequest",
)(
  {
    AuthenticationStrategy: S.optional(S.String).pipe(
      T.JsonName("authenticationStrategy"),
    ),
    AutoMinorVersionUpgrade: S.optional(S.Boolean).pipe(
      T.JsonName("autoMinorVersionUpgrade"),
    ),
    BrokerName: S.String.pipe(T.JsonName("brokerName")),
    Configuration: S.optional(ConfigurationId).pipe(
      T.JsonName("configuration"),
    ),
    CreatorRequestId: S.optional(S.String).pipe(T.JsonName("creatorRequestId")),
    DeploymentMode: S.String.pipe(T.JsonName("deploymentMode")),
    EncryptionOptions: S.optional(EncryptionOptions).pipe(
      T.JsonName("encryptionOptions"),
    ),
    EngineType: S.String.pipe(T.JsonName("engineType")),
    EngineVersion: S.optional(S.String).pipe(T.JsonName("engineVersion")),
    HostInstanceType: S.String.pipe(T.JsonName("hostInstanceType")),
    LdapServerMetadata: S.optional(LdapServerMetadataInput).pipe(
      T.JsonName("ldapServerMetadata"),
    ),
    Logs: S.optional(Logs).pipe(T.JsonName("logs")),
    MaintenanceWindowStartTime: S.optional(WeeklyStartTime).pipe(
      T.JsonName("maintenanceWindowStartTime"),
    ),
    PubliclyAccessible: S.Boolean.pipe(T.JsonName("publiclyAccessible")),
    SecurityGroups: S.optional(__listOf__string).pipe(
      T.JsonName("securityGroups"),
    ),
    StorageType: S.optional(S.String).pipe(T.JsonName("storageType")),
    SubnetIds: S.optional(__listOf__string).pipe(T.JsonName("subnetIds")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    Users: S.optional(__listOfUser).pipe(T.JsonName("users")),
    DataReplicationMode: S.optional(S.String).pipe(
      T.JsonName("dataReplicationMode"),
    ),
    DataReplicationPrimaryBrokerArn: S.optional(S.String).pipe(
      T.JsonName("dataReplicationPrimaryBrokerArn"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/brokers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBrokerResponse extends S.Class<DeleteBrokerResponse>(
  "DeleteBrokerResponse",
)({ BrokerId: S.optional(S.String).pipe(T.JsonName("brokerId")) }) {}
export class DeleteConfigurationResponse extends S.Class<DeleteConfigurationResponse>(
  "DeleteConfigurationResponse",
)({
  ConfigurationId: S.optional(S.String).pipe(T.JsonName("configurationId")),
}) {}
export class DescribeConfigurationResponse extends S.Class<DescribeConfigurationResponse>(
  "DescribeConfigurationResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  AuthenticationStrategy: S.optional(S.String).pipe(
    T.JsonName("authenticationStrategy"),
  ),
  Created: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("created"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  EngineType: S.optional(S.String).pipe(T.JsonName("engineType")),
  EngineVersion: S.optional(S.String).pipe(T.JsonName("engineVersion")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  LatestRevision: S.optional(ConfigurationRevision).pipe(
    T.JsonName("latestRevision"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
}) {}
export class DescribeConfigurationRevisionResponse extends S.Class<DescribeConfigurationRevisionResponse>(
  "DescribeConfigurationRevisionResponse",
)({
  ConfigurationId: S.optional(S.String).pipe(T.JsonName("configurationId")),
  Created: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("created"),
  ),
  Data: S.optional(S.String).pipe(T.JsonName("data")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
}) {}
export class ListConfigurationRevisionsResponse extends S.Class<ListConfigurationRevisionsResponse>(
  "ListConfigurationRevisionsResponse",
)({
  ConfigurationId: S.optional(S.String).pipe(T.JsonName("configurationId")),
  MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Revisions: S.optional(__listOfConfigurationRevision).pipe(
    T.JsonName("revisions"),
  ),
}) {}
export class ListTagsResponse extends S.Class<ListTagsResponse>(
  "ListTagsResponse",
)({ Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")) }) {}
export class UserSummary extends S.Class<UserSummary>("UserSummary")({
  PendingChange: S.optional(S.String).pipe(T.JsonName("pendingChange")),
  Username: S.String.pipe(T.JsonName("username")),
}) {}
export const __listOfUserSummary = S.Array(UserSummary);
export class ListUsersResponse extends S.Class<ListUsersResponse>(
  "ListUsersResponse",
)({
  BrokerId: S.optional(S.String).pipe(T.JsonName("brokerId")),
  MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Users: S.optional(__listOfUserSummary).pipe(T.JsonName("users")),
}) {}
export class PromoteResponse extends S.Class<PromoteResponse>(
  "PromoteResponse",
)({ BrokerId: S.optional(S.String).pipe(T.JsonName("brokerId")) }) {}
export class LdapServerMetadataOutput extends S.Class<LdapServerMetadataOutput>(
  "LdapServerMetadataOutput",
)({
  Hosts: __listOf__string.pipe(T.JsonName("hosts")),
  RoleBase: S.String.pipe(T.JsonName("roleBase")),
  RoleName: S.optional(S.String).pipe(T.JsonName("roleName")),
  RoleSearchMatching: S.String.pipe(T.JsonName("roleSearchMatching")),
  RoleSearchSubtree: S.optional(S.Boolean).pipe(
    T.JsonName("roleSearchSubtree"),
  ),
  ServiceAccountUsername: S.String.pipe(T.JsonName("serviceAccountUsername")),
  UserBase: S.String.pipe(T.JsonName("userBase")),
  UserRoleName: S.optional(S.String).pipe(T.JsonName("userRoleName")),
  UserSearchMatching: S.String.pipe(T.JsonName("userSearchMatching")),
  UserSearchSubtree: S.optional(S.Boolean).pipe(
    T.JsonName("userSearchSubtree"),
  ),
}) {}
export class DataReplicationCounterpart extends S.Class<DataReplicationCounterpart>(
  "DataReplicationCounterpart",
)({
  BrokerId: S.String.pipe(T.JsonName("brokerId")),
  Region: S.String.pipe(T.JsonName("region")),
}) {}
export class DataReplicationMetadataOutput extends S.Class<DataReplicationMetadataOutput>(
  "DataReplicationMetadataOutput",
)({
  DataReplicationCounterpart: S.optional(DataReplicationCounterpart).pipe(
    T.JsonName("dataReplicationCounterpart"),
  ),
  DataReplicationRole: S.String.pipe(T.JsonName("dataReplicationRole")),
}) {}
export class UpdateBrokerResponse extends S.Class<UpdateBrokerResponse>(
  "UpdateBrokerResponse",
)({
  AuthenticationStrategy: S.optional(S.String).pipe(
    T.JsonName("authenticationStrategy"),
  ),
  AutoMinorVersionUpgrade: S.optional(S.Boolean).pipe(
    T.JsonName("autoMinorVersionUpgrade"),
  ),
  BrokerId: S.optional(S.String).pipe(T.JsonName("brokerId")),
  Configuration: S.optional(ConfigurationId).pipe(T.JsonName("configuration")),
  EngineVersion: S.optional(S.String).pipe(T.JsonName("engineVersion")),
  HostInstanceType: S.optional(S.String).pipe(T.JsonName("hostInstanceType")),
  LdapServerMetadata: S.optional(LdapServerMetadataOutput).pipe(
    T.JsonName("ldapServerMetadata"),
  ),
  Logs: S.optional(Logs).pipe(T.JsonName("logs")),
  MaintenanceWindowStartTime: S.optional(WeeklyStartTime).pipe(
    T.JsonName("maintenanceWindowStartTime"),
  ),
  SecurityGroups: S.optional(__listOf__string).pipe(
    T.JsonName("securityGroups"),
  ),
  DataReplicationMetadata: S.optional(DataReplicationMetadataOutput).pipe(
    T.JsonName("dataReplicationMetadata"),
  ),
  DataReplicationMode: S.optional(S.String).pipe(
    T.JsonName("dataReplicationMode"),
  ),
  PendingDataReplicationMetadata: S.optional(
    DataReplicationMetadataOutput,
  ).pipe(T.JsonName("pendingDataReplicationMetadata")),
  PendingDataReplicationMode: S.optional(S.String).pipe(
    T.JsonName("pendingDataReplicationMode"),
  ),
}) {}
export const __listOfConfigurationId = S.Array(ConfigurationId);
export const __listOfDeploymentMode = S.Array(S.String);
export class ActionRequired extends S.Class<ActionRequired>("ActionRequired")({
  ActionRequiredCode: S.optional(S.String).pipe(
    T.JsonName("actionRequiredCode"),
  ),
  ActionRequiredInfo: S.optional(S.String).pipe(
    T.JsonName("actionRequiredInfo"),
  ),
}) {}
export const __listOfActionRequired = S.Array(ActionRequired);
export class BrokerInstance extends S.Class<BrokerInstance>("BrokerInstance")({
  ConsoleURL: S.optional(S.String).pipe(T.JsonName("consoleURL")),
  Endpoints: S.optional(__listOf__string).pipe(T.JsonName("endpoints")),
  IpAddress: S.optional(S.String).pipe(T.JsonName("ipAddress")),
}) {}
export const __listOfBrokerInstance = S.Array(BrokerInstance);
export class Configurations extends S.Class<Configurations>("Configurations")({
  Current: S.optional(ConfigurationId).pipe(T.JsonName("current")),
  History: S.optional(__listOfConfigurationId).pipe(T.JsonName("history")),
  Pending: S.optional(ConfigurationId).pipe(T.JsonName("pending")),
}) {}
export class UserPendingChanges extends S.Class<UserPendingChanges>(
  "UserPendingChanges",
)({
  ConsoleAccess: S.optional(S.Boolean).pipe(T.JsonName("consoleAccess")),
  Groups: S.optional(__listOf__string).pipe(T.JsonName("groups")),
  PendingChange: S.String.pipe(T.JsonName("pendingChange")),
}) {}
export class BrokerSummary extends S.Class<BrokerSummary>("BrokerSummary")({
  BrokerArn: S.optional(S.String).pipe(T.JsonName("brokerArn")),
  BrokerId: S.optional(S.String).pipe(T.JsonName("brokerId")),
  BrokerName: S.optional(S.String).pipe(T.JsonName("brokerName")),
  BrokerState: S.optional(S.String).pipe(T.JsonName("brokerState")),
  Created: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("created"),
  ),
  DeploymentMode: S.String.pipe(T.JsonName("deploymentMode")),
  EngineType: S.String.pipe(T.JsonName("engineType")),
  HostInstanceType: S.optional(S.String).pipe(T.JsonName("hostInstanceType")),
}) {}
export const __listOfBrokerSummary = S.Array(BrokerSummary);
export class Configuration extends S.Class<Configuration>("Configuration")({
  Arn: S.String.pipe(T.JsonName("arn")),
  AuthenticationStrategy: S.String.pipe(T.JsonName("authenticationStrategy")),
  Created: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("created"),
  ),
  Description: S.String.pipe(T.JsonName("description")),
  EngineType: S.String.pipe(T.JsonName("engineType")),
  EngineVersion: S.String.pipe(T.JsonName("engineVersion")),
  Id: S.String.pipe(T.JsonName("id")),
  LatestRevision: ConfigurationRevision.pipe(T.JsonName("latestRevision")),
  Name: S.String.pipe(T.JsonName("name")),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
}) {}
export const __listOfConfiguration = S.Array(Configuration);
export class SanitizationWarning extends S.Class<SanitizationWarning>(
  "SanitizationWarning",
)({
  AttributeName: S.optional(S.String).pipe(T.JsonName("attributeName")),
  ElementName: S.optional(S.String).pipe(T.JsonName("elementName")),
  Reason: S.String.pipe(T.JsonName("reason")),
}) {}
export const __listOfSanitizationWarning = S.Array(SanitizationWarning);
export class CreateBrokerResponse extends S.Class<CreateBrokerResponse>(
  "CreateBrokerResponse",
)({
  BrokerArn: S.optional(S.String).pipe(T.JsonName("brokerArn")),
  BrokerId: S.optional(S.String).pipe(T.JsonName("brokerId")),
}) {}
export class CreateConfigurationResponse extends S.Class<CreateConfigurationResponse>(
  "CreateConfigurationResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  AuthenticationStrategy: S.optional(S.String).pipe(
    T.JsonName("authenticationStrategy"),
  ),
  Created: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("created"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  LatestRevision: S.optional(ConfigurationRevision).pipe(
    T.JsonName("latestRevision"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
}) {}
export class DescribeUserResponse extends S.Class<DescribeUserResponse>(
  "DescribeUserResponse",
)({
  BrokerId: S.optional(S.String).pipe(T.JsonName("brokerId")),
  ConsoleAccess: S.optional(S.Boolean).pipe(T.JsonName("consoleAccess")),
  Groups: S.optional(__listOf__string).pipe(T.JsonName("groups")),
  Pending: S.optional(UserPendingChanges).pipe(T.JsonName("pending")),
  Username: S.optional(S.String).pipe(T.JsonName("username")),
  ReplicationUser: S.optional(S.Boolean).pipe(T.JsonName("replicationUser")),
}) {}
export class ListBrokersResponse extends S.Class<ListBrokersResponse>(
  "ListBrokersResponse",
)({
  BrokerSummaries: S.optional(__listOfBrokerSummary).pipe(
    T.JsonName("brokerSummaries"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListConfigurationsResponse extends S.Class<ListConfigurationsResponse>(
  "ListConfigurationsResponse",
)({
  Configurations: S.optional(__listOfConfiguration).pipe(
    T.JsonName("configurations"),
  ),
  MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class UpdateConfigurationResponse extends S.Class<UpdateConfigurationResponse>(
  "UpdateConfigurationResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Created: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("created"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  LatestRevision: S.optional(ConfigurationRevision).pipe(
    T.JsonName("latestRevision"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Warnings: S.optional(__listOfSanitizationWarning).pipe(
    T.JsonName("warnings"),
  ),
}) {}
export class PendingLogs extends S.Class<PendingLogs>("PendingLogs")({
  Audit: S.optional(S.Boolean).pipe(T.JsonName("audit")),
  General: S.optional(S.Boolean).pipe(T.JsonName("general")),
}) {}
export class EngineVersion extends S.Class<EngineVersion>("EngineVersion")({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
}) {}
export const __listOfEngineVersion = S.Array(EngineVersion);
export class AvailabilityZone extends S.Class<AvailabilityZone>(
  "AvailabilityZone",
)({ Name: S.optional(S.String).pipe(T.JsonName("name")) }) {}
export const __listOfAvailabilityZone = S.Array(AvailabilityZone);
export class LogsSummary extends S.Class<LogsSummary>("LogsSummary")({
  Audit: S.optional(S.Boolean).pipe(T.JsonName("audit")),
  AuditLogGroup: S.optional(S.String).pipe(T.JsonName("auditLogGroup")),
  General: S.Boolean.pipe(T.JsonName("general")),
  GeneralLogGroup: S.String.pipe(T.JsonName("generalLogGroup")),
  Pending: S.optional(PendingLogs).pipe(T.JsonName("pending")),
}) {}
export class BrokerEngineType extends S.Class<BrokerEngineType>(
  "BrokerEngineType",
)({
  EngineType: S.optional(S.String).pipe(T.JsonName("engineType")),
  EngineVersions: S.optional(__listOfEngineVersion).pipe(
    T.JsonName("engineVersions"),
  ),
}) {}
export const __listOfBrokerEngineType = S.Array(BrokerEngineType);
export class BrokerInstanceOption extends S.Class<BrokerInstanceOption>(
  "BrokerInstanceOption",
)({
  AvailabilityZones: S.optional(__listOfAvailabilityZone).pipe(
    T.JsonName("availabilityZones"),
  ),
  EngineType: S.optional(S.String).pipe(T.JsonName("engineType")),
  HostInstanceType: S.optional(S.String).pipe(T.JsonName("hostInstanceType")),
  StorageType: S.optional(S.String).pipe(T.JsonName("storageType")),
  SupportedDeploymentModes: S.optional(__listOfDeploymentMode).pipe(
    T.JsonName("supportedDeploymentModes"),
  ),
  SupportedEngineVersions: S.optional(__listOf__string).pipe(
    T.JsonName("supportedEngineVersions"),
  ),
}) {}
export const __listOfBrokerInstanceOption = S.Array(BrokerInstanceOption);
export class DescribeBrokerResponse extends S.Class<DescribeBrokerResponse>(
  "DescribeBrokerResponse",
)({
  ActionsRequired: S.optional(__listOfActionRequired).pipe(
    T.JsonName("actionsRequired"),
  ),
  AuthenticationStrategy: S.optional(S.String).pipe(
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
  BrokerState: S.optional(S.String).pipe(T.JsonName("brokerState")),
  Configurations: S.optional(Configurations).pipe(T.JsonName("configurations")),
  Created: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("created"),
  ),
  DeploymentMode: S.optional(S.String).pipe(T.JsonName("deploymentMode")),
  EncryptionOptions: S.optional(EncryptionOptions).pipe(
    T.JsonName("encryptionOptions"),
  ),
  EngineType: S.optional(S.String).pipe(T.JsonName("engineType")),
  EngineVersion: S.optional(S.String).pipe(T.JsonName("engineVersion")),
  HostInstanceType: S.optional(S.String).pipe(T.JsonName("hostInstanceType")),
  LdapServerMetadata: S.optional(LdapServerMetadataOutput).pipe(
    T.JsonName("ldapServerMetadata"),
  ),
  Logs: S.optional(LogsSummary).pipe(T.JsonName("logs")),
  MaintenanceWindowStartTime: S.optional(WeeklyStartTime).pipe(
    T.JsonName("maintenanceWindowStartTime"),
  ),
  PendingAuthenticationStrategy: S.optional(S.String).pipe(
    T.JsonName("pendingAuthenticationStrategy"),
  ),
  PendingEngineVersion: S.optional(S.String).pipe(
    T.JsonName("pendingEngineVersion"),
  ),
  PendingHostInstanceType: S.optional(S.String).pipe(
    T.JsonName("pendingHostInstanceType"),
  ),
  PendingLdapServerMetadata: S.optional(LdapServerMetadataOutput).pipe(
    T.JsonName("pendingLdapServerMetadata"),
  ),
  PendingSecurityGroups: S.optional(__listOf__string).pipe(
    T.JsonName("pendingSecurityGroups"),
  ),
  PubliclyAccessible: S.optional(S.Boolean).pipe(
    T.JsonName("publiclyAccessible"),
  ),
  SecurityGroups: S.optional(__listOf__string).pipe(
    T.JsonName("securityGroups"),
  ),
  StorageType: S.optional(S.String).pipe(T.JsonName("storageType")),
  SubnetIds: S.optional(__listOf__string).pipe(T.JsonName("subnetIds")),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  Users: S.optional(__listOfUserSummary).pipe(T.JsonName("users")),
  DataReplicationMetadata: S.optional(DataReplicationMetadataOutput).pipe(
    T.JsonName("dataReplicationMetadata"),
  ),
  DataReplicationMode: S.optional(S.String).pipe(
    T.JsonName("dataReplicationMode"),
  ),
  PendingDataReplicationMetadata: S.optional(
    DataReplicationMetadataOutput,
  ).pipe(T.JsonName("pendingDataReplicationMetadata")),
  PendingDataReplicationMode: S.optional(S.String).pipe(
    T.JsonName("pendingDataReplicationMode"),
  ),
}) {}
export class DescribeBrokerEngineTypesResponse extends S.Class<DescribeBrokerEngineTypesResponse>(
  "DescribeBrokerEngineTypesResponse",
)({
  BrokerEngineTypes: S.optional(__listOfBrokerEngineType).pipe(
    T.JsonName("brokerEngineTypes"),
  ),
  MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class DescribeBrokerInstanceOptionsResponse extends S.Class<DescribeBrokerInstanceOptionsResponse>(
  "DescribeBrokerInstanceOptionsResponse",
)({
  BrokerInstanceOptions: S.optional(__listOfBrokerInstanceOption).pipe(
    T.JsonName("brokerInstanceOptions"),
  ),
  MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {
    ErrorAttribute: S.optional(S.String).pipe(T.JsonName("errorAttribute")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  {
    ErrorAttribute: S.optional(S.String).pipe(T.JsonName("errorAttribute")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    ErrorAttribute: S.optional(S.String).pipe(T.JsonName("errorAttribute")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  {
    ErrorAttribute: S.optional(S.String).pipe(T.JsonName("errorAttribute")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {
    ErrorAttribute: S.optional(S.String).pipe(T.JsonName("errorAttribute")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  {
    ErrorAttribute: S.optional(S.String).pipe(T.JsonName("errorAttribute")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
) {}

//# Operations
/**
 * Describe available engine types and versions.
 */
export const describeBrokerEngineTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeBrokerEngineTypesRequest,
    output: DescribeBrokerEngineTypesResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
    ],
  }),
);
/**
 * Describe available broker instance options.
 */
export const describeBrokerInstanceOptions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listBrokers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Returns a list of all configurations.
 */
export const listConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createBroker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeBroker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteBroker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeConfigurationRequest,
    output: DescribeConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
    ],
  }),
);
/**
 * Returns the specified configuration revision for the specified configuration.
 */
export const describeConfigurationRevision =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listConfigurationRevisions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListConfigurationRevisionsRequest,
    output: ListConfigurationRevisionsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
    ],
  }),
);
/**
 * Lists tags for a resource.
 */
export const listTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listUsers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const promote = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const rebootBroker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBroker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

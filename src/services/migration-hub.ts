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
const svc = T.AwsApiService({
  sdkId: "Migration Hub",
  serviceShapeName: "AWSMigrationHub",
});
const auth = T.AwsAuthSigv4({ name: "mgh" });
const ver = T.ServiceVersion("2017-05-31");
const proto = T.AwsProtocolsAwsJson1_1();
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
                        url: "https://mgh-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://mgh-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://mgh.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://mgh.{Region}.{PartitionResult#dnsSuffix}",
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

//# Newtypes
export type ProgressUpdateStream = string;
export type MigrationTaskName = string;
export type ApplicationId = string;
export type CreatedArtifactName = string;
export type ConfigurationId = string;
export type SourceResourceName = string;
export type Token = string;
export type MaxResults = number;
export type MaxResultsCreatedArtifacts = number;
export type MaxResultsResources = number;
export type ResourceName = string;
export type MaxResultsSourceResources = number;
export type NextUpdateSeconds = number;
export type CreatedArtifactDescription = string;
export type DiscoveredResourceDescription = string;
export type SourceResourceDescription = string;
export type StatusDetail = string;
export type ProgressPercent = number;
export type ResourceAttributeValue = string;
export type ErrorMessage = string;
export type RetryAfterSeconds = number;

//# Schemas
export type ApplicationIds = string[];
export const ApplicationIds = S.Array(S.String);
export interface CreateProgressUpdateStreamRequest {
  ProgressUpdateStreamName: string;
  DryRun?: boolean;
}
export const CreateProgressUpdateStreamRequest = S.suspend(() =>
  S.Struct({
    ProgressUpdateStreamName: S.String,
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateProgressUpdateStreamRequest",
}) as any as S.Schema<CreateProgressUpdateStreamRequest>;
export interface CreateProgressUpdateStreamResult {}
export const CreateProgressUpdateStreamResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateProgressUpdateStreamResult",
}) as any as S.Schema<CreateProgressUpdateStreamResult>;
export interface DeleteProgressUpdateStreamRequest {
  ProgressUpdateStreamName: string;
  DryRun?: boolean;
}
export const DeleteProgressUpdateStreamRequest = S.suspend(() =>
  S.Struct({
    ProgressUpdateStreamName: S.String,
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteProgressUpdateStreamRequest",
}) as any as S.Schema<DeleteProgressUpdateStreamRequest>;
export interface DeleteProgressUpdateStreamResult {}
export const DeleteProgressUpdateStreamResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteProgressUpdateStreamResult",
}) as any as S.Schema<DeleteProgressUpdateStreamResult>;
export interface DescribeApplicationStateRequest {
  ApplicationId: string;
}
export const DescribeApplicationStateRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeApplicationStateRequest",
}) as any as S.Schema<DescribeApplicationStateRequest>;
export interface DescribeMigrationTaskRequest {
  ProgressUpdateStream: string;
  MigrationTaskName: string;
}
export const DescribeMigrationTaskRequest = S.suspend(() =>
  S.Struct({
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeMigrationTaskRequest",
}) as any as S.Schema<DescribeMigrationTaskRequest>;
export interface DisassociateCreatedArtifactRequest {
  ProgressUpdateStream: string;
  MigrationTaskName: string;
  CreatedArtifactName: string;
  DryRun?: boolean;
}
export const DisassociateCreatedArtifactRequest = S.suspend(() =>
  S.Struct({
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    CreatedArtifactName: S.String,
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateCreatedArtifactRequest",
}) as any as S.Schema<DisassociateCreatedArtifactRequest>;
export interface DisassociateCreatedArtifactResult {}
export const DisassociateCreatedArtifactResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateCreatedArtifactResult",
}) as any as S.Schema<DisassociateCreatedArtifactResult>;
export interface DisassociateDiscoveredResourceRequest {
  ProgressUpdateStream: string;
  MigrationTaskName: string;
  ConfigurationId: string;
  DryRun?: boolean;
}
export const DisassociateDiscoveredResourceRequest = S.suspend(() =>
  S.Struct({
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    ConfigurationId: S.String,
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateDiscoveredResourceRequest",
}) as any as S.Schema<DisassociateDiscoveredResourceRequest>;
export interface DisassociateDiscoveredResourceResult {}
export const DisassociateDiscoveredResourceResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateDiscoveredResourceResult",
}) as any as S.Schema<DisassociateDiscoveredResourceResult>;
export interface DisassociateSourceResourceRequest {
  ProgressUpdateStream: string;
  MigrationTaskName: string;
  SourceResourceName: string;
  DryRun?: boolean;
}
export const DisassociateSourceResourceRequest = S.suspend(() =>
  S.Struct({
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    SourceResourceName: S.String,
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateSourceResourceRequest",
}) as any as S.Schema<DisassociateSourceResourceRequest>;
export interface DisassociateSourceResourceResult {}
export const DisassociateSourceResourceResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateSourceResourceResult",
}) as any as S.Schema<DisassociateSourceResourceResult>;
export interface ImportMigrationTaskRequest {
  ProgressUpdateStream: string;
  MigrationTaskName: string;
  DryRun?: boolean;
}
export const ImportMigrationTaskRequest = S.suspend(() =>
  S.Struct({
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ImportMigrationTaskRequest",
}) as any as S.Schema<ImportMigrationTaskRequest>;
export interface ImportMigrationTaskResult {}
export const ImportMigrationTaskResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ImportMigrationTaskResult",
}) as any as S.Schema<ImportMigrationTaskResult>;
export interface ListApplicationStatesRequest {
  ApplicationIds?: ApplicationIds;
  NextToken?: string;
  MaxResults?: number;
}
export const ListApplicationStatesRequest = S.suspend(() =>
  S.Struct({
    ApplicationIds: S.optional(ApplicationIds),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListApplicationStatesRequest",
}) as any as S.Schema<ListApplicationStatesRequest>;
export interface ListCreatedArtifactsRequest {
  ProgressUpdateStream: string;
  MigrationTaskName: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListCreatedArtifactsRequest = S.suspend(() =>
  S.Struct({
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCreatedArtifactsRequest",
}) as any as S.Schema<ListCreatedArtifactsRequest>;
export interface ListDiscoveredResourcesRequest {
  ProgressUpdateStream: string;
  MigrationTaskName: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListDiscoveredResourcesRequest = S.suspend(() =>
  S.Struct({
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDiscoveredResourcesRequest",
}) as any as S.Schema<ListDiscoveredResourcesRequest>;
export interface ListMigrationTasksRequest {
  NextToken?: string;
  MaxResults?: number;
  ResourceName?: string;
}
export const ListMigrationTasksRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ResourceName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListMigrationTasksRequest",
}) as any as S.Schema<ListMigrationTasksRequest>;
export interface ListMigrationTaskUpdatesRequest {
  ProgressUpdateStream: string;
  MigrationTaskName: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListMigrationTaskUpdatesRequest = S.suspend(() =>
  S.Struct({
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListMigrationTaskUpdatesRequest",
}) as any as S.Schema<ListMigrationTaskUpdatesRequest>;
export interface ListProgressUpdateStreamsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListProgressUpdateStreamsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListProgressUpdateStreamsRequest",
}) as any as S.Schema<ListProgressUpdateStreamsRequest>;
export interface ListSourceResourcesRequest {
  ProgressUpdateStream: string;
  MigrationTaskName: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListSourceResourcesRequest = S.suspend(() =>
  S.Struct({
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSourceResourcesRequest",
}) as any as S.Schema<ListSourceResourcesRequest>;
export interface NotifyApplicationStateRequest {
  ApplicationId: string;
  Status: string;
  UpdateDateTime?: Date;
  DryRun?: boolean;
}
export const NotifyApplicationStateRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String,
    Status: S.String,
    UpdateDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "NotifyApplicationStateRequest",
}) as any as S.Schema<NotifyApplicationStateRequest>;
export interface NotifyApplicationStateResult {}
export const NotifyApplicationStateResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "NotifyApplicationStateResult",
}) as any as S.Schema<NotifyApplicationStateResult>;
export interface CreatedArtifact {
  Name: string;
  Description?: string;
}
export const CreatedArtifact = S.suspend(() =>
  S.Struct({ Name: S.String, Description: S.optional(S.String) }),
).annotations({
  identifier: "CreatedArtifact",
}) as any as S.Schema<CreatedArtifact>;
export interface DiscoveredResource {
  ConfigurationId: string;
  Description?: string;
}
export const DiscoveredResource = S.suspend(() =>
  S.Struct({ ConfigurationId: S.String, Description: S.optional(S.String) }),
).annotations({
  identifier: "DiscoveredResource",
}) as any as S.Schema<DiscoveredResource>;
export interface SourceResource {
  Name: string;
  Description?: string;
  StatusDetail?: string;
}
export const SourceResource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    StatusDetail: S.optional(S.String),
  }),
).annotations({
  identifier: "SourceResource",
}) as any as S.Schema<SourceResource>;
export type CreatedArtifactList = CreatedArtifact[];
export const CreatedArtifactList = S.Array(CreatedArtifact);
export type DiscoveredResourceList = DiscoveredResource[];
export const DiscoveredResourceList = S.Array(DiscoveredResource);
export type SourceResourceList = SourceResource[];
export const SourceResourceList = S.Array(SourceResource);
export interface Task {
  Status: string;
  StatusDetail?: string;
  ProgressPercent?: number;
}
export const Task = S.suspend(() =>
  S.Struct({
    Status: S.String,
    StatusDetail: S.optional(S.String),
    ProgressPercent: S.optional(S.Number),
  }),
).annotations({ identifier: "Task" }) as any as S.Schema<Task>;
export interface ResourceAttribute {
  Type: string;
  Value: string;
}
export const ResourceAttribute = S.suspend(() =>
  S.Struct({ Type: S.String, Value: S.String }),
).annotations({
  identifier: "ResourceAttribute",
}) as any as S.Schema<ResourceAttribute>;
export type ResourceAttributeList = ResourceAttribute[];
export const ResourceAttributeList = S.Array(ResourceAttribute);
export interface AssociateCreatedArtifactRequest {
  ProgressUpdateStream: string;
  MigrationTaskName: string;
  CreatedArtifact: CreatedArtifact;
  DryRun?: boolean;
}
export const AssociateCreatedArtifactRequest = S.suspend(() =>
  S.Struct({
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    CreatedArtifact: CreatedArtifact,
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateCreatedArtifactRequest",
}) as any as S.Schema<AssociateCreatedArtifactRequest>;
export interface AssociateCreatedArtifactResult {}
export const AssociateCreatedArtifactResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateCreatedArtifactResult",
}) as any as S.Schema<AssociateCreatedArtifactResult>;
export interface AssociateDiscoveredResourceRequest {
  ProgressUpdateStream: string;
  MigrationTaskName: string;
  DiscoveredResource: DiscoveredResource;
  DryRun?: boolean;
}
export const AssociateDiscoveredResourceRequest = S.suspend(() =>
  S.Struct({
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    DiscoveredResource: DiscoveredResource,
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateDiscoveredResourceRequest",
}) as any as S.Schema<AssociateDiscoveredResourceRequest>;
export interface AssociateDiscoveredResourceResult {}
export const AssociateDiscoveredResourceResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateDiscoveredResourceResult",
}) as any as S.Schema<AssociateDiscoveredResourceResult>;
export interface AssociateSourceResourceRequest {
  ProgressUpdateStream: string;
  MigrationTaskName: string;
  SourceResource: SourceResource;
  DryRun?: boolean;
}
export const AssociateSourceResourceRequest = S.suspend(() =>
  S.Struct({
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    SourceResource: SourceResource,
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateSourceResourceRequest",
}) as any as S.Schema<AssociateSourceResourceRequest>;
export interface AssociateSourceResourceResult {}
export const AssociateSourceResourceResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateSourceResourceResult",
}) as any as S.Schema<AssociateSourceResourceResult>;
export interface DescribeApplicationStateResult {
  ApplicationStatus?: string;
  LastUpdatedTime?: Date;
}
export const DescribeApplicationStateResult = S.suspend(() =>
  S.Struct({
    ApplicationStatus: S.optional(S.String),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DescribeApplicationStateResult",
}) as any as S.Schema<DescribeApplicationStateResult>;
export interface ListCreatedArtifactsResult {
  NextToken?: string;
  CreatedArtifactList?: CreatedArtifactList;
}
export const ListCreatedArtifactsResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    CreatedArtifactList: S.optional(CreatedArtifactList),
  }),
).annotations({
  identifier: "ListCreatedArtifactsResult",
}) as any as S.Schema<ListCreatedArtifactsResult>;
export interface ListDiscoveredResourcesResult {
  NextToken?: string;
  DiscoveredResourceList?: DiscoveredResourceList;
}
export const ListDiscoveredResourcesResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    DiscoveredResourceList: S.optional(DiscoveredResourceList),
  }),
).annotations({
  identifier: "ListDiscoveredResourcesResult",
}) as any as S.Schema<ListDiscoveredResourcesResult>;
export interface ListSourceResourcesResult {
  NextToken?: string;
  SourceResourceList?: SourceResourceList;
}
export const ListSourceResourcesResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    SourceResourceList: S.optional(SourceResourceList),
  }),
).annotations({
  identifier: "ListSourceResourcesResult",
}) as any as S.Schema<ListSourceResourcesResult>;
export interface NotifyMigrationTaskStateRequest {
  ProgressUpdateStream: string;
  MigrationTaskName: string;
  Task: Task;
  UpdateDateTime: Date;
  NextUpdateSeconds: number;
  DryRun?: boolean;
}
export const NotifyMigrationTaskStateRequest = S.suspend(() =>
  S.Struct({
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    Task: Task,
    UpdateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    NextUpdateSeconds: S.Number,
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "NotifyMigrationTaskStateRequest",
}) as any as S.Schema<NotifyMigrationTaskStateRequest>;
export interface NotifyMigrationTaskStateResult {}
export const NotifyMigrationTaskStateResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "NotifyMigrationTaskStateResult",
}) as any as S.Schema<NotifyMigrationTaskStateResult>;
export interface PutResourceAttributesRequest {
  ProgressUpdateStream: string;
  MigrationTaskName: string;
  ResourceAttributeList: ResourceAttributeList;
  DryRun?: boolean;
}
export const PutResourceAttributesRequest = S.suspend(() =>
  S.Struct({
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    ResourceAttributeList: ResourceAttributeList,
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutResourceAttributesRequest",
}) as any as S.Schema<PutResourceAttributesRequest>;
export interface PutResourceAttributesResult {}
export const PutResourceAttributesResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutResourceAttributesResult",
}) as any as S.Schema<PutResourceAttributesResult>;
export type LatestResourceAttributeList = ResourceAttribute[];
export const LatestResourceAttributeList = S.Array(ResourceAttribute);
export interface MigrationTask {
  ProgressUpdateStream?: string;
  MigrationTaskName?: string;
  Task?: Task;
  UpdateDateTime?: Date;
  ResourceAttributeList?: LatestResourceAttributeList;
}
export const MigrationTask = S.suspend(() =>
  S.Struct({
    ProgressUpdateStream: S.optional(S.String),
    MigrationTaskName: S.optional(S.String),
    Task: S.optional(Task),
    UpdateDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ResourceAttributeList: S.optional(LatestResourceAttributeList),
  }),
).annotations({
  identifier: "MigrationTask",
}) as any as S.Schema<MigrationTask>;
export interface ApplicationState {
  ApplicationId?: string;
  ApplicationStatus?: string;
  LastUpdatedTime?: Date;
}
export const ApplicationState = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    ApplicationStatus: S.optional(S.String),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ApplicationState",
}) as any as S.Schema<ApplicationState>;
export type ApplicationStateList = ApplicationState[];
export const ApplicationStateList = S.Array(ApplicationState);
export interface MigrationTaskSummary {
  ProgressUpdateStream?: string;
  MigrationTaskName?: string;
  Status?: string;
  ProgressPercent?: number;
  StatusDetail?: string;
  UpdateDateTime?: Date;
}
export const MigrationTaskSummary = S.suspend(() =>
  S.Struct({
    ProgressUpdateStream: S.optional(S.String),
    MigrationTaskName: S.optional(S.String),
    Status: S.optional(S.String),
    ProgressPercent: S.optional(S.Number),
    StatusDetail: S.optional(S.String),
    UpdateDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "MigrationTaskSummary",
}) as any as S.Schema<MigrationTaskSummary>;
export type MigrationTaskSummaryList = MigrationTaskSummary[];
export const MigrationTaskSummaryList = S.Array(MigrationTaskSummary);
export interface MigrationTaskUpdate {
  UpdateDateTime?: Date;
  UpdateType?: string;
  MigrationTaskState?: Task;
}
export const MigrationTaskUpdate = S.suspend(() =>
  S.Struct({
    UpdateDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdateType: S.optional(S.String),
    MigrationTaskState: S.optional(Task),
  }),
).annotations({
  identifier: "MigrationTaskUpdate",
}) as any as S.Schema<MigrationTaskUpdate>;
export type MigrationTaskUpdateList = MigrationTaskUpdate[];
export const MigrationTaskUpdateList = S.Array(MigrationTaskUpdate);
export interface ProgressUpdateStreamSummary {
  ProgressUpdateStreamName?: string;
}
export const ProgressUpdateStreamSummary = S.suspend(() =>
  S.Struct({ ProgressUpdateStreamName: S.optional(S.String) }),
).annotations({
  identifier: "ProgressUpdateStreamSummary",
}) as any as S.Schema<ProgressUpdateStreamSummary>;
export type ProgressUpdateStreamSummaryList = ProgressUpdateStreamSummary[];
export const ProgressUpdateStreamSummaryList = S.Array(
  ProgressUpdateStreamSummary,
);
export interface DescribeMigrationTaskResult {
  MigrationTask?: MigrationTask;
}
export const DescribeMigrationTaskResult = S.suspend(() =>
  S.Struct({ MigrationTask: S.optional(MigrationTask) }),
).annotations({
  identifier: "DescribeMigrationTaskResult",
}) as any as S.Schema<DescribeMigrationTaskResult>;
export interface ListApplicationStatesResult {
  ApplicationStateList?: ApplicationStateList;
  NextToken?: string;
}
export const ListApplicationStatesResult = S.suspend(() =>
  S.Struct({
    ApplicationStateList: S.optional(ApplicationStateList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListApplicationStatesResult",
}) as any as S.Schema<ListApplicationStatesResult>;
export interface ListMigrationTasksResult {
  NextToken?: string;
  MigrationTaskSummaryList?: MigrationTaskSummaryList;
}
export const ListMigrationTasksResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MigrationTaskSummaryList: S.optional(MigrationTaskSummaryList),
  }),
).annotations({
  identifier: "ListMigrationTasksResult",
}) as any as S.Schema<ListMigrationTasksResult>;
export interface ListMigrationTaskUpdatesResult {
  NextToken?: string;
  MigrationTaskUpdateList?: MigrationTaskUpdateList;
}
export const ListMigrationTaskUpdatesResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MigrationTaskUpdateList: S.optional(MigrationTaskUpdateList),
  }),
).annotations({
  identifier: "ListMigrationTaskUpdatesResult",
}) as any as S.Schema<ListMigrationTaskUpdatesResult>;
export interface ListProgressUpdateStreamsResult {
  ProgressUpdateStreamSummaryList?: ProgressUpdateStreamSummaryList;
  NextToken?: string;
}
export const ListProgressUpdateStreamsResult = S.suspend(() =>
  S.Struct({
    ProgressUpdateStreamSummaryList: S.optional(
      ProgressUpdateStreamSummaryList,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProgressUpdateStreamsResult",
}) as any as S.Schema<ListProgressUpdateStreamsResult>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class DryRunOperation extends S.TaggedError<DryRunOperation>()(
  "DryRunOperation",
  { Message: S.optional(S.String) },
) {}
export class HomeRegionNotSetException extends S.TaggedError<HomeRegionNotSetException>()(
  "HomeRegionNotSetException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  { Message: S.optional(S.String) },
) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class PolicyErrorException extends S.TaggedError<PolicyErrorException>()(
  "PolicyErrorException",
  { Message: S.optional(S.String) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withThrottlingError) {}
export class UnauthorizedOperation extends S.TaggedError<UnauthorizedOperation>()(
  "UnauthorizedOperation",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Lists the created artifacts attached to a given migration task in an update stream. This
 * API has the following traits:
 *
 * - Gets the list of the created artifacts while
 * migration is taking place.
 *
 * - Shows the artifacts created by the migration tool that was associated by the
 * `AssociateCreatedArtifact` API.
 *
 * - Lists created artifacts in a paginated interface.
 */
export const listCreatedArtifacts: {
  (
    input: ListCreatedArtifactsRequest,
  ): Effect.Effect<
    ListCreatedArtifactsResult,
    | AccessDeniedException
    | HomeRegionNotSetException
    | InternalServerError
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCreatedArtifactsRequest,
  ) => Stream.Stream<
    ListCreatedArtifactsResult,
    | AccessDeniedException
    | HomeRegionNotSetException
    | InternalServerError
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCreatedArtifactsRequest,
  ) => Stream.Stream<
    CreatedArtifact,
    | AccessDeniedException
    | HomeRegionNotSetException
    | InternalServerError
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCreatedArtifactsRequest,
  output: ListCreatedArtifactsResult,
  errors: [
    AccessDeniedException,
    HomeRegionNotSetException,
    InternalServerError,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "CreatedArtifactList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists discovered resources associated with the given `MigrationTask`.
 */
export const listDiscoveredResources: {
  (
    input: ListDiscoveredResourcesRequest,
  ): Effect.Effect<
    ListDiscoveredResourcesResult,
    | AccessDeniedException
    | HomeRegionNotSetException
    | InternalServerError
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDiscoveredResourcesRequest,
  ) => Stream.Stream<
    ListDiscoveredResourcesResult,
    | AccessDeniedException
    | HomeRegionNotSetException
    | InternalServerError
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDiscoveredResourcesRequest,
  ) => Stream.Stream<
    DiscoveredResource,
    | AccessDeniedException
    | HomeRegionNotSetException
    | InternalServerError
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDiscoveredResourcesRequest,
  output: ListDiscoveredResourcesResult,
  errors: [
    AccessDeniedException,
    HomeRegionNotSetException,
    InternalServerError,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DiscoveredResourceList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a list of all attributes associated with a specific migration task.
 */
export const describeMigrationTask: (
  input: DescribeMigrationTaskRequest,
) => Effect.Effect<
  DescribeMigrationTaskResult,
  | AccessDeniedException
  | HomeRegionNotSetException
  | InternalServerError
  | InvalidInputException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMigrationTaskRequest,
  output: DescribeMigrationTaskResult,
  errors: [
    AccessDeniedException,
    HomeRegionNotSetException,
    InternalServerError,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * This is a paginated API that returns all the migration-task states for the specified
 * `MigrationTaskName` and `ProgressUpdateStream`.
 */
export const listMigrationTaskUpdates: {
  (
    input: ListMigrationTaskUpdatesRequest,
  ): Effect.Effect<
    ListMigrationTaskUpdatesResult,
    | AccessDeniedException
    | InternalServerError
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMigrationTaskUpdatesRequest,
  ) => Stream.Stream<
    ListMigrationTaskUpdatesResult,
    | AccessDeniedException
    | InternalServerError
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMigrationTaskUpdatesRequest,
  ) => Stream.Stream<
    MigrationTaskUpdate,
    | AccessDeniedException
    | InternalServerError
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMigrationTaskUpdatesRequest,
  output: ListMigrationTaskUpdatesResult,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "MigrationTaskUpdateList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Gets the migration status of an application.
 */
export const describeApplicationState: (
  input: DescribeApplicationStateRequest,
) => Effect.Effect<
  DescribeApplicationStateResult,
  | AccessDeniedException
  | HomeRegionNotSetException
  | InternalServerError
  | InvalidInputException
  | PolicyErrorException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeApplicationStateRequest,
  output: DescribeApplicationStateResult,
  errors: [
    AccessDeniedException,
    HomeRegionNotSetException,
    InternalServerError,
    InvalidInputException,
    PolicyErrorException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists all, or filtered by resource name, migration tasks associated with the user
 * account making this call. This API has the following traits:
 *
 * - Can show a summary list of the most recent migration tasks.
 *
 * - Can show a summary list of migration tasks associated with a given discovered
 * resource.
 *
 * - Lists migration tasks in a paginated interface.
 */
export const listMigrationTasks: {
  (
    input: ListMigrationTasksRequest,
  ): Effect.Effect<
    ListMigrationTasksResult,
    | AccessDeniedException
    | HomeRegionNotSetException
    | InternalServerError
    | InvalidInputException
    | PolicyErrorException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMigrationTasksRequest,
  ) => Stream.Stream<
    ListMigrationTasksResult,
    | AccessDeniedException
    | HomeRegionNotSetException
    | InternalServerError
    | InvalidInputException
    | PolicyErrorException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMigrationTasksRequest,
  ) => Stream.Stream<
    MigrationTaskSummary,
    | AccessDeniedException
    | HomeRegionNotSetException
    | InternalServerError
    | InvalidInputException
    | PolicyErrorException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMigrationTasksRequest,
  output: ListMigrationTasksResult,
  errors: [
    AccessDeniedException,
    HomeRegionNotSetException,
    InternalServerError,
    InvalidInputException,
    PolicyErrorException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "MigrationTaskSummaryList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all the migration statuses for your applications. If you use the optional
 * `ApplicationIds` parameter, only the migration statuses for those
 * applications will be returned.
 */
export const listApplicationStates: {
  (
    input: ListApplicationStatesRequest,
  ): Effect.Effect<
    ListApplicationStatesResult,
    | AccessDeniedException
    | HomeRegionNotSetException
    | InternalServerError
    | InvalidInputException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationStatesRequest,
  ) => Stream.Stream<
    ListApplicationStatesResult,
    | AccessDeniedException
    | HomeRegionNotSetException
    | InternalServerError
    | InvalidInputException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationStatesRequest,
  ) => Stream.Stream<
    ApplicationState,
    | AccessDeniedException
    | HomeRegionNotSetException
    | InternalServerError
    | InvalidInputException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationStatesRequest,
  output: ListApplicationStatesResult,
  errors: [
    AccessDeniedException,
    HomeRegionNotSetException,
    InternalServerError,
    InvalidInputException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ApplicationStateList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists progress update streams associated with the user account making this call.
 */
export const listProgressUpdateStreams: {
  (
    input: ListProgressUpdateStreamsRequest,
  ): Effect.Effect<
    ListProgressUpdateStreamsResult,
    | AccessDeniedException
    | HomeRegionNotSetException
    | InternalServerError
    | InvalidInputException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProgressUpdateStreamsRequest,
  ) => Stream.Stream<
    ListProgressUpdateStreamsResult,
    | AccessDeniedException
    | HomeRegionNotSetException
    | InternalServerError
    | InvalidInputException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProgressUpdateStreamsRequest,
  ) => Stream.Stream<
    ProgressUpdateStreamSummary,
    | AccessDeniedException
    | HomeRegionNotSetException
    | InternalServerError
    | InvalidInputException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProgressUpdateStreamsRequest,
  output: ListProgressUpdateStreamsResult,
  errors: [
    AccessDeniedException,
    HomeRegionNotSetException,
    InternalServerError,
    InvalidInputException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ProgressUpdateStreamSummaryList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all the source resource that are associated with the specified
 * `MigrationTaskName` and `ProgressUpdateStream`.
 */
export const listSourceResources: {
  (
    input: ListSourceResourcesRequest,
  ): Effect.Effect<
    ListSourceResourcesResult,
    | AccessDeniedException
    | InternalServerError
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSourceResourcesRequest,
  ) => Stream.Stream<
    ListSourceResourcesResult,
    | AccessDeniedException
    | InternalServerError
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSourceResourcesRequest,
  ) => Stream.Stream<
    SourceResource,
    | AccessDeniedException
    | InternalServerError
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSourceResourcesRequest,
  output: ListSourceResourcesResult,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SourceResourceList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a progress update stream which is an AWS resource used for access control as
 * well as a namespace for migration task names that is implicitly linked to your AWS account.
 * It must uniquely identify the migration tool as it is used for all updates made by the
 * tool; however, it does not need to be unique for each AWS account because it is scoped to
 * the AWS account.
 */
export const createProgressUpdateStream: (
  input: CreateProgressUpdateStreamRequest,
) => Effect.Effect<
  CreateProgressUpdateStreamResult,
  | AccessDeniedException
  | DryRunOperation
  | HomeRegionNotSetException
  | InternalServerError
  | InvalidInputException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProgressUpdateStreamRequest,
  output: CreateProgressUpdateStreamResult,
  errors: [
    AccessDeniedException,
    DryRunOperation,
    HomeRegionNotSetException,
    InternalServerError,
    InvalidInputException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedOperation,
  ],
}));
/**
 * Notifies Migration Hub of the current status, progress, or other detail regarding a
 * migration task. This API has the following traits:
 *
 * - Migration tools will call the `NotifyMigrationTaskState` API to share
 * the latest progress and status.
 *
 * - `MigrationTaskName` is used for addressing updates to the correct
 * target.
 *
 * - `ProgressUpdateStream` is used for access control and to provide a
 * namespace for each migration tool.
 */
export const notifyMigrationTaskState: (
  input: NotifyMigrationTaskStateRequest,
) => Effect.Effect<
  NotifyMigrationTaskStateResult,
  | AccessDeniedException
  | DryRunOperation
  | HomeRegionNotSetException
  | InternalServerError
  | InvalidInputException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: NotifyMigrationTaskStateRequest,
  output: NotifyMigrationTaskStateResult,
  errors: [
    AccessDeniedException,
    DryRunOperation,
    HomeRegionNotSetException,
    InternalServerError,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedOperation,
  ],
}));
/**
 * Provides identifying details of the resource being migrated so that it can be associated
 * in the Application Discovery Service repository. This association occurs asynchronously
 * after `PutResourceAttributes` returns.
 *
 * - Keep in mind that subsequent calls to PutResourceAttributes will override
 * previously stored attributes. For example, if it is first called with a MAC
 * address, but later, it is desired to *add* an IP address, it
 * will then be required to call it with *both* the IP and MAC
 * addresses to prevent overriding the MAC address.
 *
 * - Note the instructions regarding the special use case of the
 * `ResourceAttributeList`
 * parameter when specifying any
 * "VM" related value.
 *
 * Because this is an asynchronous call, it will always return 200, whether an
 * association occurs or not. To confirm if an association was found based on the provided
 * details, call `ListDiscoveredResources`.
 */
export const putResourceAttributes: (
  input: PutResourceAttributesRequest,
) => Effect.Effect<
  PutResourceAttributesResult,
  | AccessDeniedException
  | DryRunOperation
  | HomeRegionNotSetException
  | InternalServerError
  | InvalidInputException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourceAttributesRequest,
  output: PutResourceAttributesResult,
  errors: [
    AccessDeniedException,
    DryRunOperation,
    HomeRegionNotSetException,
    InternalServerError,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedOperation,
  ],
}));
/**
 * Deletes a progress update stream, including all of its tasks, which was previously
 * created as an AWS resource used for access control. This API has the following
 * traits:
 *
 * - The only parameter needed for `DeleteProgressUpdateStream` is the
 * stream name (same as a `CreateProgressUpdateStream` call).
 *
 * - The call will return, and a background process will asynchronously delete the
 * stream and all of its resources (tasks, associated resources, resource attributes,
 * created artifacts).
 *
 * - If the stream takes time to be deleted, it might still show up on a
 * `ListProgressUpdateStreams` call.
 *
 * - `CreateProgressUpdateStream`, `ImportMigrationTask`,
 * `NotifyMigrationTaskState`, and all Associate[*] APIs related to the
 * tasks belonging to the stream will throw "InvalidInputException" if the stream of the
 * same name is in the process of being deleted.
 *
 * - Once the stream and all of its resources are deleted,
 * `CreateProgressUpdateStream` for a stream of the same name will
 * succeed, and that stream will be an entirely new logical resource (without any
 * resources associated with the old stream).
 */
export const deleteProgressUpdateStream: (
  input: DeleteProgressUpdateStreamRequest,
) => Effect.Effect<
  DeleteProgressUpdateStreamResult,
  | AccessDeniedException
  | DryRunOperation
  | HomeRegionNotSetException
  | InternalServerError
  | InvalidInputException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProgressUpdateStreamRequest,
  output: DeleteProgressUpdateStreamResult,
  errors: [
    AccessDeniedException,
    DryRunOperation,
    HomeRegionNotSetException,
    InternalServerError,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedOperation,
  ],
}));
/**
 * Disassociates a created artifact of an AWS resource with a migration task performed by a
 * migration tool that was previously associated. This API has the following traits:
 *
 * - A migration user can call the `DisassociateCreatedArtifacts` operation
 * to disassociate a created AWS Artifact from a migration task.
 *
 * - The created artifact name must be provided in ARN (Amazon Resource Name) format
 * which will contain information about type and region; for example:
 * `arn:aws:ec2:us-east-1:488216288981:image/ami-6d0ba87b`.
 *
 * - Examples of the AWS resource behind the created artifact are, AMI's, EC2 instance,
 * or RDS instance, etc.
 */
export const disassociateCreatedArtifact: (
  input: DisassociateCreatedArtifactRequest,
) => Effect.Effect<
  DisassociateCreatedArtifactResult,
  | AccessDeniedException
  | DryRunOperation
  | HomeRegionNotSetException
  | InternalServerError
  | InvalidInputException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateCreatedArtifactRequest,
  output: DisassociateCreatedArtifactResult,
  errors: [
    AccessDeniedException,
    DryRunOperation,
    HomeRegionNotSetException,
    InternalServerError,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedOperation,
  ],
}));
/**
 * Disassociate an Application Discovery Service discovered resource from a migration
 * task.
 */
export const disassociateDiscoveredResource: (
  input: DisassociateDiscoveredResourceRequest,
) => Effect.Effect<
  DisassociateDiscoveredResourceResult,
  | AccessDeniedException
  | DryRunOperation
  | HomeRegionNotSetException
  | InternalServerError
  | InvalidInputException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateDiscoveredResourceRequest,
  output: DisassociateDiscoveredResourceResult,
  errors: [
    AccessDeniedException,
    DryRunOperation,
    HomeRegionNotSetException,
    InternalServerError,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedOperation,
  ],
}));
/**
 * Removes the association between a source resource and a migration task.
 */
export const disassociateSourceResource: (
  input: DisassociateSourceResourceRequest,
) => Effect.Effect<
  DisassociateSourceResourceResult,
  | AccessDeniedException
  | DryRunOperation
  | InternalServerError
  | InvalidInputException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateSourceResourceRequest,
  output: DisassociateSourceResourceResult,
  errors: [
    AccessDeniedException,
    DryRunOperation,
    InternalServerError,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedOperation,
  ],
}));
/**
 * Registers a new migration task which represents a server, database, etc., being migrated
 * to AWS by a migration tool.
 *
 * This API is a prerequisite to calling the `NotifyMigrationTaskState` API as
 * the migration tool must first register the migration task with Migration Hub.
 */
export const importMigrationTask: (
  input: ImportMigrationTaskRequest,
) => Effect.Effect<
  ImportMigrationTaskResult,
  | AccessDeniedException
  | DryRunOperation
  | HomeRegionNotSetException
  | InternalServerError
  | InvalidInputException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportMigrationTaskRequest,
  output: ImportMigrationTaskResult,
  errors: [
    AccessDeniedException,
    DryRunOperation,
    HomeRegionNotSetException,
    InternalServerError,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedOperation,
  ],
}));
/**
 * Associates a created artifact of an AWS cloud resource, the target receiving the
 * migration, with the migration task performed by a migration tool. This API has the
 * following traits:
 *
 * - Migration tools can call the `AssociateCreatedArtifact` operation to
 * indicate which AWS artifact is associated with a migration task.
 *
 * - The created artifact name must be provided in ARN (Amazon Resource Name) format
 * which will contain information about type and region; for example:
 * `arn:aws:ec2:us-east-1:488216288981:image/ami-6d0ba87b`.
 *
 * - Examples of the AWS resource behind the created artifact are, AMI's, EC2 instance,
 * or DMS endpoint, etc.
 */
export const associateCreatedArtifact: (
  input: AssociateCreatedArtifactRequest,
) => Effect.Effect<
  AssociateCreatedArtifactResult,
  | AccessDeniedException
  | DryRunOperation
  | HomeRegionNotSetException
  | InternalServerError
  | InvalidInputException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateCreatedArtifactRequest,
  output: AssociateCreatedArtifactResult,
  errors: [
    AccessDeniedException,
    DryRunOperation,
    HomeRegionNotSetException,
    InternalServerError,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedOperation,
  ],
}));
/**
 * Associates a source resource with a migration task. For example, the source resource can
 * be a source server, an application, or a migration wave.
 */
export const associateSourceResource: (
  input: AssociateSourceResourceRequest,
) => Effect.Effect<
  AssociateSourceResourceResult,
  | AccessDeniedException
  | DryRunOperation
  | InternalServerError
  | InvalidInputException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateSourceResourceRequest,
  output: AssociateSourceResourceResult,
  errors: [
    AccessDeniedException,
    DryRunOperation,
    InternalServerError,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedOperation,
  ],
}));
/**
 * Associates a discovered resource ID from Application Discovery Service with a migration
 * task.
 */
export const associateDiscoveredResource: (
  input: AssociateDiscoveredResourceRequest,
) => Effect.Effect<
  AssociateDiscoveredResourceResult,
  | AccessDeniedException
  | DryRunOperation
  | HomeRegionNotSetException
  | InternalServerError
  | InvalidInputException
  | PolicyErrorException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateDiscoveredResourceRequest,
  output: AssociateDiscoveredResourceResult,
  errors: [
    AccessDeniedException,
    DryRunOperation,
    HomeRegionNotSetException,
    InternalServerError,
    InvalidInputException,
    PolicyErrorException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedOperation,
  ],
}));
/**
 * Sets the migration state of an application. For a given application identified by the
 * value passed to `ApplicationId`, its status is set or updated by passing one of
 * three values to `Status`: NOT_STARTED | IN_PROGRESS |
 * COMPLETED.
 */
export const notifyApplicationState: (
  input: NotifyApplicationStateRequest,
) => Effect.Effect<
  NotifyApplicationStateResult,
  | AccessDeniedException
  | DryRunOperation
  | HomeRegionNotSetException
  | InternalServerError
  | InvalidInputException
  | PolicyErrorException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: NotifyApplicationStateRequest,
  output: NotifyApplicationStateResult,
  errors: [
    AccessDeniedException,
    DryRunOperation,
    HomeRegionNotSetException,
    InternalServerError,
    InvalidInputException,
    PolicyErrorException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedOperation,
  ],
}));

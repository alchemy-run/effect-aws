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
  sdkId: "Launch Wizard",
  serviceShapeName: "LaunchWizard",
});
const auth = T.AwsAuthSigv4({ name: "launchwizard" });
const ver = T.ServiceVersion("2018-05-10");
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
                                url: "https://launchwizard-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://launchwizard-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://launchwizard.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://launchwizard.{Region}.{PartitionResult#dnsSuffix}",
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

//# Newtypes
export type TagKey = string;
export type WorkloadName = string;
export type DeploymentPatternName = string;
export type DeploymentName = string;
export type DeploymentId = string;
export type MaxDeploymentResults = number;
export type NextToken = string;
export type MaxDeploymentEventResults = number;
export type MaxWorkloadResults = number;
export type MaxWorkloadDeploymentPatternResults = number;
export type TagValue = string;
export type KeyString = string;
export type ValueString = string;
export type WorkloadVersionName = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface ListTagsForResourceInput {
  resourceArn: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface UntagResourceInput {
  resourceArn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceOutput {}
export const UntagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export interface GetDeploymentInput {
  deploymentId: string;
}
export const GetDeploymentInput = S.suspend(() =>
  S.Struct({ deploymentId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getDeployment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDeploymentInput",
}) as any as S.Schema<GetDeploymentInput>;
export interface DeleteDeploymentInput {
  deploymentId: string;
}
export const DeleteDeploymentInput = S.suspend(() =>
  S.Struct({ deploymentId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/deleteDeployment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDeploymentInput",
}) as any as S.Schema<DeleteDeploymentInput>;
export interface ListDeploymentEventsInput {
  deploymentId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListDeploymentEventsInput = S.suspend(() =>
  S.Struct({
    deploymentId: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listDeploymentEvents" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDeploymentEventsInput",
}) as any as S.Schema<ListDeploymentEventsInput>;
export interface GetWorkloadInput {
  workloadName: string;
}
export const GetWorkloadInput = S.suspend(() =>
  S.Struct({ workloadName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getWorkload" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWorkloadInput",
}) as any as S.Schema<GetWorkloadInput>;
export interface ListWorkloadsInput {
  maxResults?: number;
  nextToken?: string;
}
export const ListWorkloadsInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listWorkloads" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWorkloadsInput",
}) as any as S.Schema<ListWorkloadsInput>;
export interface GetWorkloadDeploymentPatternInput {
  workloadName: string;
  deploymentPatternName: string;
}
export const GetWorkloadDeploymentPatternInput = S.suspend(() =>
  S.Struct({ workloadName: S.String, deploymentPatternName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getWorkloadDeploymentPattern" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWorkloadDeploymentPatternInput",
}) as any as S.Schema<GetWorkloadDeploymentPatternInput>;
export interface ListWorkloadDeploymentPatternsInput {
  workloadName: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListWorkloadDeploymentPatternsInput = S.suspend(() =>
  S.Struct({
    workloadName: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listWorkloadDeploymentPatterns" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWorkloadDeploymentPatternsInput",
}) as any as S.Schema<ListWorkloadDeploymentPatternsInput>;
export type DeploymentFilterValues = string[];
export const DeploymentFilterValues = S.Array(S.String);
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export type DeploymentSpecifications = { [key: string]: string };
export const DeploymentSpecifications = S.Record({
  key: S.String,
  value: S.String,
});
export interface DeploymentFilter {
  name?: string;
  values?: DeploymentFilterValues;
}
export const DeploymentFilter = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    values: S.optional(DeploymentFilterValues),
  }),
).annotations({
  identifier: "DeploymentFilter",
}) as any as S.Schema<DeploymentFilter>;
export type DeploymentFilterList = DeploymentFilter[];
export const DeploymentFilterList = S.Array(DeploymentFilter);
export interface ListTagsForResourceOutput {
  tags?: Tags;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface TagResourceInput {
  resourceArn: string;
  tags: Tags;
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceOutput {}
export const TagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface CreateDeploymentInput {
  workloadName: string;
  deploymentPatternName: string;
  name: string;
  specifications: DeploymentSpecifications;
  dryRun?: boolean;
  tags?: Tags;
}
export const CreateDeploymentInput = S.suspend(() =>
  S.Struct({
    workloadName: S.String,
    deploymentPatternName: S.String,
    name: S.String,
    specifications: DeploymentSpecifications,
    dryRun: S.optional(S.Boolean),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/createDeployment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDeploymentInput",
}) as any as S.Schema<CreateDeploymentInput>;
export interface DeleteDeploymentOutput {
  status?: string;
  statusReason?: string;
}
export const DeleteDeploymentOutput = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteDeploymentOutput",
}) as any as S.Schema<DeleteDeploymentOutput>;
export interface ListDeploymentsInput {
  filters?: DeploymentFilterList;
  maxResults?: number;
  nextToken?: string;
}
export const ListDeploymentsInput = S.suspend(() =>
  S.Struct({
    filters: S.optional(DeploymentFilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listDeployments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDeploymentsInput",
}) as any as S.Schema<ListDeploymentsInput>;
export interface DeploymentData {
  name?: string;
  id?: string;
  workloadName?: string;
  patternName?: string;
  status?: string;
  createdAt?: Date;
  specifications?: DeploymentSpecifications;
  resourceGroup?: string;
  deletedAt?: Date;
  tags?: Tags;
  deploymentArn?: string;
}
export const DeploymentData = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    id: S.optional(S.String),
    workloadName: S.optional(S.String),
    patternName: S.optional(S.String),
    status: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    specifications: S.optional(DeploymentSpecifications),
    resourceGroup: S.optional(S.String),
    deletedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tags: S.optional(Tags),
    deploymentArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DeploymentData",
}) as any as S.Schema<DeploymentData>;
export interface DeploymentEventDataSummary {
  name?: string;
  description?: string;
  status?: string;
  statusReason?: string;
  timestamp?: Date;
}
export const DeploymentEventDataSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    status: S.optional(S.String),
    statusReason: S.optional(S.String),
    timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DeploymentEventDataSummary",
}) as any as S.Schema<DeploymentEventDataSummary>;
export type DeploymentEventDataSummaryList = DeploymentEventDataSummary[];
export const DeploymentEventDataSummaryList = S.Array(
  DeploymentEventDataSummary,
);
export interface WorkloadData {
  workloadName?: string;
  displayName?: string;
  description?: string;
  documentationUrl?: string;
  iconUrl?: string;
  status?: string;
  statusMessage?: string;
}
export const WorkloadData = S.suspend(() =>
  S.Struct({
    workloadName: S.optional(S.String),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    documentationUrl: S.optional(S.String),
    iconUrl: S.optional(S.String),
    status: S.optional(S.String),
    statusMessage: S.optional(S.String),
  }),
).annotations({ identifier: "WorkloadData" }) as any as S.Schema<WorkloadData>;
export interface WorkloadDataSummary {
  workloadName?: string;
  displayName?: string;
}
export const WorkloadDataSummary = S.suspend(() =>
  S.Struct({
    workloadName: S.optional(S.String),
    displayName: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkloadDataSummary",
}) as any as S.Schema<WorkloadDataSummary>;
export type WorkloadDataSummaryList = WorkloadDataSummary[];
export const WorkloadDataSummaryList = S.Array(WorkloadDataSummary);
export interface WorkloadDeploymentPatternDataSummary {
  workloadName?: string;
  deploymentPatternName?: string;
  workloadVersionName?: string;
  displayName?: string;
  description?: string;
  status?: string;
  statusMessage?: string;
}
export const WorkloadDeploymentPatternDataSummary = S.suspend(() =>
  S.Struct({
    workloadName: S.optional(S.String),
    deploymentPatternName: S.optional(S.String),
    workloadVersionName: S.optional(S.String),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    status: S.optional(S.String),
    statusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkloadDeploymentPatternDataSummary",
}) as any as S.Schema<WorkloadDeploymentPatternDataSummary>;
export type WorkloadDeploymentPatternDataSummaryList =
  WorkloadDeploymentPatternDataSummary[];
export const WorkloadDeploymentPatternDataSummaryList = S.Array(
  WorkloadDeploymentPatternDataSummary,
);
export type AllowedValues = string[];
export const AllowedValues = S.Array(S.String);
export interface CreateDeploymentOutput {
  deploymentId?: string;
}
export const CreateDeploymentOutput = S.suspend(() =>
  S.Struct({ deploymentId: S.optional(S.String) }),
).annotations({
  identifier: "CreateDeploymentOutput",
}) as any as S.Schema<CreateDeploymentOutput>;
export interface GetDeploymentOutput {
  deployment?: DeploymentData;
}
export const GetDeploymentOutput = S.suspend(() =>
  S.Struct({ deployment: S.optional(DeploymentData) }),
).annotations({
  identifier: "GetDeploymentOutput",
}) as any as S.Schema<GetDeploymentOutput>;
export interface ListDeploymentEventsOutput {
  deploymentEvents?: DeploymentEventDataSummaryList;
  nextToken?: string;
}
export const ListDeploymentEventsOutput = S.suspend(() =>
  S.Struct({
    deploymentEvents: S.optional(DeploymentEventDataSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDeploymentEventsOutput",
}) as any as S.Schema<ListDeploymentEventsOutput>;
export interface GetWorkloadOutput {
  workload?: WorkloadData;
}
export const GetWorkloadOutput = S.suspend(() =>
  S.Struct({ workload: S.optional(WorkloadData) }),
).annotations({
  identifier: "GetWorkloadOutput",
}) as any as S.Schema<GetWorkloadOutput>;
export interface ListWorkloadsOutput {
  workloads?: WorkloadDataSummaryList;
  nextToken?: string;
}
export const ListWorkloadsOutput = S.suspend(() =>
  S.Struct({
    workloads: S.optional(WorkloadDataSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWorkloadsOutput",
}) as any as S.Schema<ListWorkloadsOutput>;
export interface ListWorkloadDeploymentPatternsOutput {
  workloadDeploymentPatterns?: WorkloadDeploymentPatternDataSummaryList;
  nextToken?: string;
}
export const ListWorkloadDeploymentPatternsOutput = S.suspend(() =>
  S.Struct({
    workloadDeploymentPatterns: S.optional(
      WorkloadDeploymentPatternDataSummaryList,
    ),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWorkloadDeploymentPatternsOutput",
}) as any as S.Schema<ListWorkloadDeploymentPatternsOutput>;
export interface DeploymentDataSummary {
  name?: string;
  id?: string;
  workloadName?: string;
  patternName?: string;
  status?: string;
  createdAt?: Date;
}
export const DeploymentDataSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    id: S.optional(S.String),
    workloadName: S.optional(S.String),
    patternName: S.optional(S.String),
    status: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DeploymentDataSummary",
}) as any as S.Schema<DeploymentDataSummary>;
export type DeploymentDataSummaryList = DeploymentDataSummary[];
export const DeploymentDataSummaryList = S.Array(DeploymentDataSummary);
export interface DeploymentConditionalField {
  name?: string;
  value?: string;
  comparator?: string;
}
export const DeploymentConditionalField = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    value: S.optional(S.String),
    comparator: S.optional(S.String),
  }),
).annotations({
  identifier: "DeploymentConditionalField",
}) as any as S.Schema<DeploymentConditionalField>;
export type SpecificationsConditionalData = DeploymentConditionalField[];
export const SpecificationsConditionalData = S.Array(
  DeploymentConditionalField,
);
export interface ListDeploymentsOutput {
  deployments?: DeploymentDataSummaryList;
  nextToken?: string;
}
export const ListDeploymentsOutput = S.suspend(() =>
  S.Struct({
    deployments: S.optional(DeploymentDataSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDeploymentsOutput",
}) as any as S.Schema<ListDeploymentsOutput>;
export interface DeploymentSpecificationsField {
  name?: string;
  description?: string;
  allowedValues?: AllowedValues;
  required?: string;
  conditionals?: SpecificationsConditionalData;
}
export const DeploymentSpecificationsField = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    allowedValues: S.optional(AllowedValues),
    required: S.optional(S.String),
    conditionals: S.optional(SpecificationsConditionalData),
  }),
).annotations({
  identifier: "DeploymentSpecificationsField",
}) as any as S.Schema<DeploymentSpecificationsField>;
export type DeploymentSpecificationsData = DeploymentSpecificationsField[];
export const DeploymentSpecificationsData = S.Array(
  DeploymentSpecificationsField,
);
export interface WorkloadDeploymentPatternData {
  workloadName?: string;
  deploymentPatternName?: string;
  workloadVersionName?: string;
  displayName?: string;
  description?: string;
  status?: string;
  statusMessage?: string;
  specifications?: DeploymentSpecificationsData;
}
export const WorkloadDeploymentPatternData = S.suspend(() =>
  S.Struct({
    workloadName: S.optional(S.String),
    deploymentPatternName: S.optional(S.String),
    workloadVersionName: S.optional(S.String),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    status: S.optional(S.String),
    statusMessage: S.optional(S.String),
    specifications: S.optional(DeploymentSpecificationsData),
  }),
).annotations({
  identifier: "WorkloadDeploymentPatternData",
}) as any as S.Schema<WorkloadDeploymentPatternData>;
export interface GetWorkloadDeploymentPatternOutput {
  workloadDeploymentPattern?: WorkloadDeploymentPatternData;
}
export const GetWorkloadDeploymentPatternOutput = S.suspend(() =>
  S.Struct({
    workloadDeploymentPattern: S.optional(WorkloadDeploymentPatternData),
  }),
).annotations({
  identifier: "GetWorkloadDeploymentPatternOutput",
}) as any as S.Schema<GetWorkloadDeploymentPatternOutput>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceLimitException extends S.TaggedError<ResourceLimitException>()(
  "ResourceLimitException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Removes the specified tags from the given resource.
 */
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the deployments that have been created.
 */
export const listDeployments: {
  (
    input: ListDeploymentsInput,
  ): Effect.Effect<
    ListDeploymentsOutput,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDeploymentsInput,
  ) => Stream.Stream<
    ListDeploymentsOutput,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDeploymentsInput,
  ) => Stream.Stream<
    DeploymentDataSummary,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDeploymentsInput,
  output: ListDeploymentsOutput,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "deployments",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns information about the deployment.
 */
export const getDeployment: (
  input: GetDeploymentInput,
) => Effect.Effect<
  GetDeploymentOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeploymentInput,
  output: GetDeploymentOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a deployment.
 */
export const deleteDeployment: (
  input: DeleteDeploymentInput,
) => Effect.Effect<
  DeleteDeploymentOutput,
  | InternalServerException
  | ResourceLimitException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeploymentInput,
  output: DeleteDeploymentOutput,
  errors: [
    InternalServerException,
    ResourceLimitException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the events of a deployment.
 */
export const listDeploymentEvents: {
  (
    input: ListDeploymentEventsInput,
  ): Effect.Effect<
    ListDeploymentEventsOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDeploymentEventsInput,
  ) => Stream.Stream<
    ListDeploymentEventsOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDeploymentEventsInput,
  ) => Stream.Stream<
    DeploymentEventDataSummary,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDeploymentEventsInput,
  output: ListDeploymentEventsOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "deploymentEvents",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns information about a workload.
 */
export const getWorkload: (
  input: GetWorkloadInput,
) => Effect.Effect<
  GetWorkloadOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkloadInput,
  output: GetWorkloadOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the available workload names. You can use the ListWorkloadDeploymentPatterns operation to discover the available deployment patterns for a given workload.
 */
export const listWorkloads: {
  (
    input: ListWorkloadsInput,
  ): Effect.Effect<
    ListWorkloadsOutput,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkloadsInput,
  ) => Stream.Stream<
    ListWorkloadsOutput,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkloadsInput,
  ) => Stream.Stream<
    WorkloadDataSummary,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWorkloadsInput,
  output: ListWorkloadsOutput,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "workloads",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the workload deployment patterns for a given workload name. You can use the ListWorkloads operation to discover the available workload names.
 */
export const listWorkloadDeploymentPatterns: {
  (
    input: ListWorkloadDeploymentPatternsInput,
  ): Effect.Effect<
    ListWorkloadDeploymentPatternsOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkloadDeploymentPatternsInput,
  ) => Stream.Stream<
    ListWorkloadDeploymentPatternsOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkloadDeploymentPatternsInput,
  ) => Stream.Stream<
    WorkloadDeploymentPatternDataSummary,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWorkloadDeploymentPatternsInput,
  output: ListWorkloadDeploymentPatternsOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "workloadDeploymentPatterns",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the tags associated with a specified resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => Effect.Effect<
  ListTagsForResourceOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds the specified tags to the given resource.
 */
export const tagResource: (
  input: TagResourceInput,
) => Effect.Effect<
  TagResourceOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a deployment for the given workload. Deployments created by this operation are
 * not available in the Launch Wizard console to use the `Clone deployment` action
 * on.
 */
export const createDeployment: (
  input: CreateDeploymentInput,
) => Effect.Effect<
  CreateDeploymentOutput,
  | InternalServerException
  | ResourceLimitException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDeploymentInput,
  output: CreateDeploymentOutput,
  errors: [
    InternalServerException,
    ResourceLimitException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns details for a given workload and deployment pattern, including the available
 * specifications. You can use the ListWorkloads
 * operation to discover the available workload names and the ListWorkloadDeploymentPatterns operation to discover the available deployment
 * pattern names of a given workload.
 */
export const getWorkloadDeploymentPattern: (
  input: GetWorkloadDeploymentPatternInput,
) => Effect.Effect<
  GetWorkloadDeploymentPatternOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkloadDeploymentPatternInput,
  output: GetWorkloadDeploymentPatternOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));

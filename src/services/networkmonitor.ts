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
  sdkId: "NetworkMonitor",
  serviceShapeName: "NetworkMonitor",
});
const auth = T.AwsAuthSigv4({ name: "networkmonitor" });
const ver = T.ServiceVersion("2023-08-01");
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
                                url: "https://networkmonitor-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://networkmonitor-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://networkmonitor.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://networkmonitor.{Region}.{PartitionResult#dnsSuffix}",
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
export type Arn = string;
export type TagKey = string;
export type ResourceName = string;
export type AggregationPeriod = number;
export type PaginationToken = string;
export type MaxResults = number;
export type ProbeId = string;
export type Destination = string;
export type Port = number;
export type PacketSize = number;
export type TagValue = string;
export type MonitorArn = string;
export type VpcId = string;

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
export interface GetMonitorInput {
  monitorName: string;
}
export const GetMonitorInput = S.suspend(() =>
  S.Struct({ monitorName: S.String.pipe(T.HttpLabel("monitorName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/monitors/{monitorName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMonitorInput",
}) as any as S.Schema<GetMonitorInput>;
export interface UpdateMonitorInput {
  monitorName: string;
  aggregationPeriod: number;
}
export const UpdateMonitorInput = S.suspend(() =>
  S.Struct({
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    aggregationPeriod: S.Number,
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/monitors/{monitorName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMonitorInput",
}) as any as S.Schema<UpdateMonitorInput>;
export interface DeleteMonitorInput {
  monitorName: string;
}
export const DeleteMonitorInput = S.suspend(() =>
  S.Struct({ monitorName: S.String.pipe(T.HttpLabel("monitorName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/monitors/{monitorName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMonitorInput",
}) as any as S.Schema<DeleteMonitorInput>;
export interface DeleteMonitorOutput {}
export const DeleteMonitorOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteMonitorOutput",
}) as any as S.Schema<DeleteMonitorOutput>;
export interface ListMonitorsInput {
  nextToken?: string;
  maxResults?: number;
  state?: string;
}
export const ListMonitorsInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    state: S.optional(S.String).pipe(T.HttpQuery("state")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/monitors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMonitorsInput",
}) as any as S.Schema<ListMonitorsInput>;
export interface GetProbeInput {
  monitorName: string;
  probeId: string;
}
export const GetProbeInput = S.suspend(() =>
  S.Struct({
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    probeId: S.String.pipe(T.HttpLabel("probeId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/monitors/{monitorName}/probes/{probeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProbeInput",
}) as any as S.Schema<GetProbeInput>;
export interface UpdateProbeInput {
  monitorName: string;
  probeId: string;
  state?: string;
  destination?: string;
  destinationPort?: number;
  protocol?: string;
  packetSize?: number;
}
export const UpdateProbeInput = S.suspend(() =>
  S.Struct({
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    probeId: S.String.pipe(T.HttpLabel("probeId")),
    state: S.optional(S.String),
    destination: S.optional(S.String),
    destinationPort: S.optional(S.Number),
    protocol: S.optional(S.String),
    packetSize: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/monitors/{monitorName}/probes/{probeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProbeInput",
}) as any as S.Schema<UpdateProbeInput>;
export interface DeleteProbeInput {
  monitorName: string;
  probeId: string;
}
export const DeleteProbeInput = S.suspend(() =>
  S.Struct({
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    probeId: S.String.pipe(T.HttpLabel("probeId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/monitors/{monitorName}/probes/{probeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProbeInput",
}) as any as S.Schema<DeleteProbeInput>;
export interface DeleteProbeOutput {}
export const DeleteProbeOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteProbeOutput",
}) as any as S.Schema<DeleteProbeOutput>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface CreateMonitorProbeInput {
  sourceArn: string;
  destination: string;
  destinationPort?: number;
  protocol: string;
  packetSize?: number;
  probeTags?: TagMap;
}
export const CreateMonitorProbeInput = S.suspend(() =>
  S.Struct({
    sourceArn: S.String,
    destination: S.String,
    destinationPort: S.optional(S.Number),
    protocol: S.String,
    packetSize: S.optional(S.Number),
    probeTags: S.optional(TagMap),
  }),
).annotations({
  identifier: "CreateMonitorProbeInput",
}) as any as S.Schema<CreateMonitorProbeInput>;
export type CreateMonitorProbeInputList = CreateMonitorProbeInput[];
export const CreateMonitorProbeInputList = S.Array(CreateMonitorProbeInput);
export interface ProbeInput {
  sourceArn: string;
  destination: string;
  destinationPort?: number;
  protocol: string;
  packetSize?: number;
  tags?: TagMap;
}
export const ProbeInput = S.suspend(() =>
  S.Struct({
    sourceArn: S.String,
    destination: S.String,
    destinationPort: S.optional(S.Number),
    protocol: S.String,
    packetSize: S.optional(S.Number),
    tags: S.optional(TagMap),
  }),
).annotations({ identifier: "ProbeInput" }) as any as S.Schema<ProbeInput>;
export interface ListTagsForResourceOutput {
  tags?: TagMap;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface TagResourceInput {
  resourceArn: string;
  tags: TagMap;
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
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
export interface CreateMonitorInput {
  monitorName: string;
  probes?: CreateMonitorProbeInputList;
  aggregationPeriod?: number;
  clientToken?: string;
  tags?: TagMap;
}
export const CreateMonitorInput = S.suspend(() =>
  S.Struct({
    monitorName: S.String,
    probes: S.optional(CreateMonitorProbeInputList),
    aggregationPeriod: S.optional(S.Number),
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/monitors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMonitorInput",
}) as any as S.Schema<CreateMonitorInput>;
export interface UpdateMonitorOutput {
  monitorArn: string;
  monitorName: string;
  state: string;
  aggregationPeriod?: number;
  tags?: TagMap;
}
export const UpdateMonitorOutput = S.suspend(() =>
  S.Struct({
    monitorArn: S.String,
    monitorName: S.String,
    state: S.String,
    aggregationPeriod: S.optional(S.Number),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "UpdateMonitorOutput",
}) as any as S.Schema<UpdateMonitorOutput>;
export interface CreateProbeInput {
  monitorName: string;
  probe: ProbeInput;
  clientToken?: string;
  tags?: TagMap;
}
export const CreateProbeInput = S.suspend(() =>
  S.Struct({
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    probe: ProbeInput,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/monitors/{monitorName}/probes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProbeInput",
}) as any as S.Schema<CreateProbeInput>;
export interface GetProbeOutput {
  probeId?: string;
  probeArn?: string;
  sourceArn: string;
  destination: string;
  destinationPort?: number;
  protocol: string;
  packetSize?: number;
  addressFamily?: string;
  vpcId?: string;
  state?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  tags?: TagMap;
}
export const GetProbeOutput = S.suspend(() =>
  S.Struct({
    probeId: S.optional(S.String),
    probeArn: S.optional(S.String),
    sourceArn: S.String,
    destination: S.String,
    destinationPort: S.optional(S.Number),
    protocol: S.String,
    packetSize: S.optional(S.Number),
    addressFamily: S.optional(S.String),
    vpcId: S.optional(S.String),
    state: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetProbeOutput",
}) as any as S.Schema<GetProbeOutput>;
export interface UpdateProbeOutput {
  probeId?: string;
  probeArn?: string;
  sourceArn: string;
  destination: string;
  destinationPort?: number;
  protocol: string;
  packetSize?: number;
  addressFamily?: string;
  vpcId?: string;
  state?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  tags?: TagMap;
}
export const UpdateProbeOutput = S.suspend(() =>
  S.Struct({
    probeId: S.optional(S.String),
    probeArn: S.optional(S.String),
    sourceArn: S.String,
    destination: S.String,
    destinationPort: S.optional(S.Number),
    protocol: S.String,
    packetSize: S.optional(S.Number),
    addressFamily: S.optional(S.String),
    vpcId: S.optional(S.String),
    state: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "UpdateProbeOutput",
}) as any as S.Schema<UpdateProbeOutput>;
export interface Probe {
  probeId?: string;
  probeArn?: string;
  sourceArn: string;
  destination: string;
  destinationPort?: number;
  protocol: string;
  packetSize?: number;
  addressFamily?: string;
  vpcId?: string;
  state?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  tags?: TagMap;
}
export const Probe = S.suspend(() =>
  S.Struct({
    probeId: S.optional(S.String),
    probeArn: S.optional(S.String),
    sourceArn: S.String,
    destination: S.String,
    destinationPort: S.optional(S.Number),
    protocol: S.String,
    packetSize: S.optional(S.Number),
    addressFamily: S.optional(S.String),
    vpcId: S.optional(S.String),
    state: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tags: S.optional(TagMap),
  }),
).annotations({ identifier: "Probe" }) as any as S.Schema<Probe>;
export type ProbeList = Probe[];
export const ProbeList = S.Array(Probe);
export interface MonitorSummary {
  monitorArn: string;
  monitorName: string;
  state: string;
  aggregationPeriod?: number;
  tags?: TagMap;
}
export const MonitorSummary = S.suspend(() =>
  S.Struct({
    monitorArn: S.String,
    monitorName: S.String,
    state: S.String,
    aggregationPeriod: S.optional(S.Number),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "MonitorSummary",
}) as any as S.Schema<MonitorSummary>;
export type MonitorList = MonitorSummary[];
export const MonitorList = S.Array(MonitorSummary);
export interface CreateMonitorOutput {
  monitorArn: string;
  monitorName: string;
  state: string;
  aggregationPeriod?: number;
  tags?: TagMap;
}
export const CreateMonitorOutput = S.suspend(() =>
  S.Struct({
    monitorArn: S.String,
    monitorName: S.String,
    state: S.String,
    aggregationPeriod: S.optional(S.Number),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "CreateMonitorOutput",
}) as any as S.Schema<CreateMonitorOutput>;
export interface GetMonitorOutput {
  monitorArn: string;
  monitorName: string;
  state: string;
  aggregationPeriod: number;
  tags?: TagMap;
  probes?: ProbeList;
  createdAt: Date;
  modifiedAt: Date;
}
export const GetMonitorOutput = S.suspend(() =>
  S.Struct({
    monitorArn: S.String,
    monitorName: S.String,
    state: S.String,
    aggregationPeriod: S.Number,
    tags: S.optional(TagMap),
    probes: S.optional(ProbeList),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    modifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "GetMonitorOutput",
}) as any as S.Schema<GetMonitorOutput>;
export interface ListMonitorsOutput {
  monitors: MonitorList;
  nextToken?: string;
}
export const ListMonitorsOutput = S.suspend(() =>
  S.Struct({ monitors: MonitorList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListMonitorsOutput",
}) as any as S.Schema<ListMonitorsOutput>;
export interface CreateProbeOutput {
  probeId?: string;
  probeArn?: string;
  sourceArn: string;
  destination: string;
  destinationPort?: number;
  protocol: string;
  packetSize?: number;
  addressFamily?: string;
  vpcId?: string;
  state?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  tags?: TagMap;
}
export const CreateProbeOutput = S.suspend(() =>
  S.Struct({
    probeId: S.optional(S.String),
    probeArn: S.optional(S.String),
    sourceArn: S.String,
    destination: S.String,
    destinationPort: S.optional(S.Number),
    protocol: S.String,
    packetSize: S.optional(S.Number),
    addressFamily: S.optional(S.String),
    vpcId: S.optional(S.String),
    state: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "CreateProbeOutput",
}) as any as S.Schema<CreateProbeOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a list of all of your monitors.
 */
export const listMonitors: {
  (
    input: ListMonitorsInput,
  ): Effect.Effect<
    ListMonitorsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMonitorsInput,
  ) => Stream.Stream<
    ListMonitorsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMonitorsInput,
  ) => Stream.Stream<
    MonitorSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMonitorsInput,
  output: ListMonitorsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "monitors",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a monitor between a source subnet and destination IP address. Within a monitor you'll create one or more probes that monitor network traffic between your source Amazon Web Services VPC subnets and your destination IP addresses. Each probe then aggregates and sends metrics to Amazon CloudWatch.
 *
 * You can also create a monitor with probes using this command. For each probe, you
 * define the following:
 *
 * - `source`—The subnet IDs where the probes will be created.
 *
 * - `destination`— The target destination IP address for the
 * probe.
 *
 * - `destinationPort`—Required only if the protocol is
 * `TCP`.
 *
 * - `protocol`—The communication protocol between the source and
 * destination. This will be either `TCP` or `ICMP`.
 *
 * - `packetSize`—The size of the packets. This must be a number between
 * `56` and `8500`.
 *
 * - (Optional) `tags` —Key-value pairs created and assigned to the
 * probe.
 */
export const createMonitor: (
  input: CreateMonitorInput,
) => Effect.Effect<
  CreateMonitorOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMonitorInput,
  output: CreateMonitorOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create a probe within a monitor. Once you create a probe, and it begins monitoring your
 * network traffic, you'll incur billing charges for that probe. This action requires the
 * `monitorName` parameter. Run `ListMonitors` to get a list of
 * monitor names. Note the name of the `monitorName` you want to create the
 * probe for.
 */
export const createProbe: (
  input: CreateProbeInput,
) => Effect.Effect<
  CreateProbeOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProbeInput,
  output: CreateProbeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the tags assigned to this resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => Effect.Effect<
  ListTagsForResourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
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
 * Adds key-value pairs to a monitor or probe.
 */
export const tagResource: (
  input: TagResourceInput,
) => Effect.Effect<
  TagResourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
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
 * Returns the details about a probe. This action requires both the
 * `monitorName` and `probeId` parameters. Run
 * `ListMonitors` to get a list of monitor names. Run
 * `GetMonitor` to get a list of probes and probe IDs.
 */
export const getProbe: (
  input: GetProbeInput,
) => Effect.Effect<
  GetProbeOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProbeInput,
  output: GetProbeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a monitor probe. This action requires both the `monitorName` and `probeId` parameters. Run `ListMonitors` to get a list of monitor names. Run `GetMonitor` to get a list of probes and probe IDs.
 *
 * You can update the following para create a monitor with probes using this command. For
 * each probe, you define the following:
 *
 * - `state`—The state of the probe.
 *
 * - `destination`— The target destination IP address for the
 * probe.
 *
 * - `destinationPort`—Required only if the protocol is
 * `TCP`.
 *
 * - `protocol`—The communication protocol between the source and
 * destination. This will be either `TCP` or `ICMP`.
 *
 * - `packetSize`—The size of the packets. This must be a number between
 * `56` and `8500`.
 *
 * - (Optional) `tags` —Key-value pairs created and assigned to the
 * probe.
 */
export const updateProbe: (
  input: UpdateProbeInput,
) => Effect.Effect<
  UpdateProbeOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProbeInput,
  output: UpdateProbeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a specified monitor.
 *
 * This action requires the `monitorName` parameter. Run
 * `ListMonitors` to get a list of monitor names.
 */
export const deleteMonitor: (
  input: DeleteMonitorInput,
) => Effect.Effect<
  DeleteMonitorOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMonitorInput,
  output: DeleteMonitorOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified probe. Once a probe is deleted you'll no longer incur any billing
 * fees for that probe.
 *
 * This action requires both the `monitorName` and `probeId`
 * parameters. Run `ListMonitors` to get a list of monitor names. Run
 * `GetMonitor` to get a list of probes and probe IDs. You can only delete a
 * single probe at a time using this action.
 */
export const deleteProbe: (
  input: DeleteProbeInput,
) => Effect.Effect<
  DeleteProbeOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProbeInput,
  output: DeleteProbeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a key-value pair from a monitor or probe.
 */
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
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
 * Returns details about a specific monitor.
 *
 * This action requires the `monitorName` parameter. Run
 * `ListMonitors` to get a list of monitor names.
 */
export const getMonitor: (
  input: GetMonitorInput,
) => Effect.Effect<
  GetMonitorOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMonitorInput,
  output: GetMonitorOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the `aggregationPeriod` for a monitor. Monitors support an
 * `aggregationPeriod` of either `30` or `60` seconds.
 * This action requires the `monitorName` and `probeId` parameter.
 * Run `ListMonitors` to get a list of monitor names.
 */
export const updateMonitor: (
  input: UpdateMonitorInput,
) => Effect.Effect<
  UpdateMonitorOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMonitorInput,
  output: UpdateMonitorOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));

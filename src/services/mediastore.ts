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
const ns = T.XmlNamespace("https://mediastore.amazonaws.com/doc/2017-09-01");
const svc = T.AwsApiService({
  sdkId: "MediaStore",
  serviceShapeName: "MediaStore_20170901",
});
const auth = T.AwsAuthSigv4({ name: "mediastore" });
const ver = T.ServiceVersion("2017-09-01");
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
                        url: "https://mediastore-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://mediastore-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://mediastore.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://mediastore.{Region}.{PartitionResult#dnsSuffix}",
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
export type ContainerName = string;
export type PaginationToken = string;
export type ContainerListLimit = number;
export type ContainerARN = string;
export type ContainerPolicy = string;
export type LifecyclePolicy = string;
export type TagKey = string;
export type TagValue = string;
export type Origin = string;
export type Header = string;
export type MaxAgeSeconds = number;
export type ErrorMessage = string;
export type ObjectGroup = string;
export type ObjectGroupName = string;
export type Endpoint = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeleteContainerInput {
  ContainerName: string;
}
export const DeleteContainerInput = S.suspend(() =>
  S.Struct({ ContainerName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteContainerInput",
}) as any as S.Schema<DeleteContainerInput>;
export interface DeleteContainerOutput {}
export const DeleteContainerOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteContainerOutput",
}) as any as S.Schema<DeleteContainerOutput>;
export interface DeleteContainerPolicyInput {
  ContainerName: string;
}
export const DeleteContainerPolicyInput = S.suspend(() =>
  S.Struct({ ContainerName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteContainerPolicyInput",
}) as any as S.Schema<DeleteContainerPolicyInput>;
export interface DeleteContainerPolicyOutput {}
export const DeleteContainerPolicyOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteContainerPolicyOutput",
}) as any as S.Schema<DeleteContainerPolicyOutput>;
export interface DeleteCorsPolicyInput {
  ContainerName: string;
}
export const DeleteCorsPolicyInput = S.suspend(() =>
  S.Struct({ ContainerName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCorsPolicyInput",
}) as any as S.Schema<DeleteCorsPolicyInput>;
export interface DeleteCorsPolicyOutput {}
export const DeleteCorsPolicyOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteCorsPolicyOutput",
}) as any as S.Schema<DeleteCorsPolicyOutput>;
export interface DeleteLifecyclePolicyInput {
  ContainerName: string;
}
export const DeleteLifecyclePolicyInput = S.suspend(() =>
  S.Struct({ ContainerName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLifecyclePolicyInput",
}) as any as S.Schema<DeleteLifecyclePolicyInput>;
export interface DeleteLifecyclePolicyOutput {}
export const DeleteLifecyclePolicyOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteLifecyclePolicyOutput",
}) as any as S.Schema<DeleteLifecyclePolicyOutput>;
export interface DeleteMetricPolicyInput {
  ContainerName: string;
}
export const DeleteMetricPolicyInput = S.suspend(() =>
  S.Struct({ ContainerName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMetricPolicyInput",
}) as any as S.Schema<DeleteMetricPolicyInput>;
export interface DeleteMetricPolicyOutput {}
export const DeleteMetricPolicyOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteMetricPolicyOutput",
}) as any as S.Schema<DeleteMetricPolicyOutput>;
export interface DescribeContainerInput {
  ContainerName?: string;
}
export const DescribeContainerInput = S.suspend(() =>
  S.Struct({ ContainerName: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeContainerInput",
}) as any as S.Schema<DescribeContainerInput>;
export interface GetContainerPolicyInput {
  ContainerName: string;
}
export const GetContainerPolicyInput = S.suspend(() =>
  S.Struct({ ContainerName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetContainerPolicyInput",
}) as any as S.Schema<GetContainerPolicyInput>;
export interface GetCorsPolicyInput {
  ContainerName: string;
}
export const GetCorsPolicyInput = S.suspend(() =>
  S.Struct({ ContainerName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCorsPolicyInput",
}) as any as S.Schema<GetCorsPolicyInput>;
export interface GetLifecyclePolicyInput {
  ContainerName: string;
}
export const GetLifecyclePolicyInput = S.suspend(() =>
  S.Struct({ ContainerName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLifecyclePolicyInput",
}) as any as S.Schema<GetLifecyclePolicyInput>;
export interface GetMetricPolicyInput {
  ContainerName: string;
}
export const GetMetricPolicyInput = S.suspend(() =>
  S.Struct({ ContainerName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMetricPolicyInput",
}) as any as S.Schema<GetMetricPolicyInput>;
export interface ListContainersInput {
  NextToken?: string;
  MaxResults?: number;
}
export const ListContainersInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListContainersInput",
}) as any as S.Schema<ListContainersInput>;
export interface ListTagsForResourceInput {
  Resource: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({ Resource: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export interface PutContainerPolicyInput {
  ContainerName: string;
  Policy: string;
}
export const PutContainerPolicyInput = S.suspend(() =>
  S.Struct({ ContainerName: S.String, Policy: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutContainerPolicyInput",
}) as any as S.Schema<PutContainerPolicyInput>;
export interface PutContainerPolicyOutput {}
export const PutContainerPolicyOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutContainerPolicyOutput",
}) as any as S.Schema<PutContainerPolicyOutput>;
export interface PutLifecyclePolicyInput {
  ContainerName: string;
  LifecyclePolicy: string;
}
export const PutLifecyclePolicyInput = S.suspend(() =>
  S.Struct({ ContainerName: S.String, LifecyclePolicy: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutLifecyclePolicyInput",
}) as any as S.Schema<PutLifecyclePolicyInput>;
export interface PutLifecyclePolicyOutput {}
export const PutLifecyclePolicyOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutLifecyclePolicyOutput",
}) as any as S.Schema<PutLifecyclePolicyOutput>;
export interface StartAccessLoggingInput {
  ContainerName: string;
}
export const StartAccessLoggingInput = S.suspend(() =>
  S.Struct({ ContainerName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartAccessLoggingInput",
}) as any as S.Schema<StartAccessLoggingInput>;
export interface StartAccessLoggingOutput {}
export const StartAccessLoggingOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "StartAccessLoggingOutput",
}) as any as S.Schema<StartAccessLoggingOutput>;
export interface StopAccessLoggingInput {
  ContainerName: string;
}
export const StopAccessLoggingInput = S.suspend(() =>
  S.Struct({ ContainerName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopAccessLoggingInput",
}) as any as S.Schema<StopAccessLoggingInput>;
export interface StopAccessLoggingOutput {}
export const StopAccessLoggingOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "StopAccessLoggingOutput",
}) as any as S.Schema<StopAccessLoggingOutput>;
export interface Tag {
  Key: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceInput {
  Resource: string;
  Tags: TagList;
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({ Resource: S.String, Tags: TagList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export const TagResourceOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface UntagResourceInput {
  Resource: string;
  TagKeys: TagKeyList;
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({ Resource: S.String, TagKeys: TagKeyList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export const UntagResourceOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export type AllowedOrigins = string[];
export const AllowedOrigins = S.Array(S.String);
export type AllowedMethods = string[];
export const AllowedMethods = S.Array(S.String);
export type AllowedHeaders = string[];
export const AllowedHeaders = S.Array(S.String);
export type ExposeHeaders = string[];
export const ExposeHeaders = S.Array(S.String);
export interface Container {
  Endpoint?: string;
  CreationTime?: Date;
  ARN?: string;
  Name?: string;
  Status?: string;
  AccessLoggingEnabled?: boolean;
}
export const Container = S.suspend(() =>
  S.Struct({
    Endpoint: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ARN: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    AccessLoggingEnabled: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Container" }) as any as S.Schema<Container>;
export type ContainerList = Container[];
export const ContainerList = S.Array(Container);
export interface CorsRule {
  AllowedOrigins: AllowedOrigins;
  AllowedMethods?: AllowedMethods;
  AllowedHeaders: AllowedHeaders;
  MaxAgeSeconds?: number;
  ExposeHeaders?: ExposeHeaders;
}
export const CorsRule = S.suspend(() =>
  S.Struct({
    AllowedOrigins: AllowedOrigins,
    AllowedMethods: S.optional(AllowedMethods),
    AllowedHeaders: AllowedHeaders,
    MaxAgeSeconds: S.optional(S.Number),
    ExposeHeaders: S.optional(ExposeHeaders),
  }),
).annotations({ identifier: "CorsRule" }) as any as S.Schema<CorsRule>;
export type CorsPolicy = CorsRule[];
export const CorsPolicy = S.Array(CorsRule);
export interface CreateContainerInput {
  ContainerName: string;
  Tags?: TagList;
}
export const CreateContainerInput = S.suspend(() =>
  S.Struct({ ContainerName: S.String, Tags: S.optional(TagList) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateContainerInput",
}) as any as S.Schema<CreateContainerInput>;
export interface GetContainerPolicyOutput {
  Policy: string;
}
export const GetContainerPolicyOutput = S.suspend(() =>
  S.Struct({ Policy: S.String }).pipe(ns),
).annotations({
  identifier: "GetContainerPolicyOutput",
}) as any as S.Schema<GetContainerPolicyOutput>;
export interface GetCorsPolicyOutput {
  CorsPolicy: CorsPolicy;
}
export const GetCorsPolicyOutput = S.suspend(() =>
  S.Struct({ CorsPolicy: CorsPolicy }).pipe(ns),
).annotations({
  identifier: "GetCorsPolicyOutput",
}) as any as S.Schema<GetCorsPolicyOutput>;
export interface GetLifecyclePolicyOutput {
  LifecyclePolicy: string;
}
export const GetLifecyclePolicyOutput = S.suspend(() =>
  S.Struct({ LifecyclePolicy: S.String }).pipe(ns),
).annotations({
  identifier: "GetLifecyclePolicyOutput",
}) as any as S.Schema<GetLifecyclePolicyOutput>;
export interface MetricPolicyRule {
  ObjectGroup: string;
  ObjectGroupName: string;
}
export const MetricPolicyRule = S.suspend(() =>
  S.Struct({ ObjectGroup: S.String, ObjectGroupName: S.String }),
).annotations({
  identifier: "MetricPolicyRule",
}) as any as S.Schema<MetricPolicyRule>;
export type MetricPolicyRules = MetricPolicyRule[];
export const MetricPolicyRules = S.Array(MetricPolicyRule);
export interface MetricPolicy {
  ContainerLevelMetrics: string;
  MetricPolicyRules?: MetricPolicyRules;
}
export const MetricPolicy = S.suspend(() =>
  S.Struct({
    ContainerLevelMetrics: S.String,
    MetricPolicyRules: S.optional(MetricPolicyRules),
  }),
).annotations({ identifier: "MetricPolicy" }) as any as S.Schema<MetricPolicy>;
export interface GetMetricPolicyOutput {
  MetricPolicy: MetricPolicy;
}
export const GetMetricPolicyOutput = S.suspend(() =>
  S.Struct({ MetricPolicy: MetricPolicy }).pipe(ns),
).annotations({
  identifier: "GetMetricPolicyOutput",
}) as any as S.Schema<GetMetricPolicyOutput>;
export interface ListContainersOutput {
  Containers: ContainerList;
  NextToken?: string;
}
export const ListContainersOutput = S.suspend(() =>
  S.Struct({ Containers: ContainerList, NextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ListContainersOutput",
}) as any as S.Schema<ListContainersOutput>;
export interface ListTagsForResourceOutput {
  Tags?: TagList;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface PutCorsPolicyInput {
  ContainerName: string;
  CorsPolicy: CorsPolicy;
}
export const PutCorsPolicyInput = S.suspend(() =>
  S.Struct({ ContainerName: S.String, CorsPolicy: CorsPolicy }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutCorsPolicyInput",
}) as any as S.Schema<PutCorsPolicyInput>;
export interface PutCorsPolicyOutput {}
export const PutCorsPolicyOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutCorsPolicyOutput",
}) as any as S.Schema<PutCorsPolicyOutput>;
export interface CreateContainerOutput {
  Container: Container;
}
export const CreateContainerOutput = S.suspend(() =>
  S.Struct({ Container: Container }).pipe(ns),
).annotations({
  identifier: "CreateContainerOutput",
}) as any as S.Schema<CreateContainerOutput>;
export interface DescribeContainerOutput {
  Container?: Container;
}
export const DescribeContainerOutput = S.suspend(() =>
  S.Struct({ Container: S.optional(Container) }).pipe(ns),
).annotations({
  identifier: "DescribeContainerOutput",
}) as any as S.Schema<DescribeContainerOutput>;
export interface PutMetricPolicyInput {
  ContainerName: string;
  MetricPolicy: MetricPolicy;
}
export const PutMetricPolicyInput = S.suspend(() =>
  S.Struct({ ContainerName: S.String, MetricPolicy: MetricPolicy }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutMetricPolicyInput",
}) as any as S.Schema<PutMetricPolicyInput>;
export interface PutMetricPolicyOutput {}
export const PutMetricPolicyOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutMetricPolicyOutput",
}) as any as S.Schema<PutMetricPolicyOutput>;

//# Errors
export class ContainerInUseException extends S.TaggedError<ContainerInUseException>()(
  "ContainerInUseException",
  { Message: S.optional(S.String) },
) {}
export class ContainerNotFoundException extends S.TaggedError<ContainerNotFoundException>()(
  "ContainerNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  { Message: S.optional(S.String) },
) {}
export class PolicyNotFoundException extends S.TaggedError<PolicyNotFoundException>()(
  "PolicyNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class CorsPolicyNotFoundException extends S.TaggedError<CorsPolicyNotFoundException>()(
  "CorsPolicyNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Lists the properties of all containers in AWS Elemental MediaStore.
 *
 * You can query to receive all the containers in one response. Or you can include the
 * `MaxResults` parameter to receive a limited number of containers in each
 * response. In this case, the response includes a token. To get the next set of containers,
 * send the command again, this time with the `NextToken` parameter (with the
 * returned token as its value). The next set of responses appears, with a token if there are
 * still more containers to receive.
 *
 * See also DescribeContainer, which gets the properties of one
 * container.
 */
export const listContainers: {
  (
    input: ListContainersInput,
  ): Effect.Effect<
    ListContainersOutput,
    InternalServerError | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListContainersInput,
  ) => Stream.Stream<
    ListContainersOutput,
    InternalServerError | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListContainersInput,
  ) => Stream.Stream<
    unknown,
    InternalServerError | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListContainersInput,
  output: ListContainersOutput,
  errors: [InternalServerError],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * The metric policy that you want to add to the container. A metric policy allows AWS Elemental MediaStore to send metrics to Amazon CloudWatch. It takes up to 20 minutes for the new policy to take effect.
 */
export const putMetricPolicy: (
  input: PutMetricPolicyInput,
) => Effect.Effect<
  PutMetricPolicyOutput,
  | ContainerInUseException
  | ContainerNotFoundException
  | InternalServerError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMetricPolicyInput,
  output: PutMetricPolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Returns a list of the tags assigned to the specified container.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => Effect.Effect<
  ListTagsForResourceOutput,
  | ContainerInUseException
  | ContainerNotFoundException
  | InternalServerError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Sets the cross-origin resource sharing (CORS) configuration on a container so that
 * the container can service cross-origin requests. For example, you might want to enable a
 * request whose origin is http://www.example.com to access your AWS Elemental MediaStore
 * container at my.example.container.com by using the browser's XMLHttpRequest
 * capability.
 *
 * To enable CORS on a container, you attach a CORS policy to the container. In the CORS
 * policy, you configure rules that identify origins and the HTTP methods that can be executed
 * on your container. The policy can contain up to 398,000 characters. You can add up to 100
 * rules to a CORS policy. If more than one rule applies, the service uses the first
 * applicable rule listed.
 *
 * To learn more about CORS, see Cross-Origin Resource Sharing (CORS) in AWS Elemental MediaStore.
 */
export const putCorsPolicy: (
  input: PutCorsPolicyInput,
) => Effect.Effect<
  PutCorsPolicyOutput,
  | ContainerInUseException
  | ContainerNotFoundException
  | InternalServerError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutCorsPolicyInput,
  output: PutCorsPolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Creates an access policy for the specified container to restrict the users and
 * clients that can access it. For information about the data that is included in an access
 * policy, see the AWS Identity and
 * Access Management User Guide.
 *
 * For this release of the REST API, you can create only one policy for a container. If
 * you enter `PutContainerPolicy` twice, the second command modifies the existing
 * policy.
 */
export const putContainerPolicy: (
  input: PutContainerPolicyInput,
) => Effect.Effect<
  PutContainerPolicyOutput,
  | ContainerInUseException
  | ContainerNotFoundException
  | InternalServerError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutContainerPolicyInput,
  output: PutContainerPolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Writes an object lifecycle policy to a container. If the container already has an object lifecycle policy, the service replaces the existing policy with the new policy. It takes up to 20 minutes for the change to take effect.
 *
 * For information about how to construct an object lifecycle policy, see Components of an Object Lifecycle Policy.
 */
export const putLifecyclePolicy: (
  input: PutLifecyclePolicyInput,
) => Effect.Effect<
  PutLifecyclePolicyOutput,
  | ContainerInUseException
  | ContainerNotFoundException
  | InternalServerError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLifecyclePolicyInput,
  output: PutLifecyclePolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Starts access logging on the specified container. When you enable access logging on a container, MediaStore delivers access logs for objects stored in that container to Amazon CloudWatch Logs.
 */
export const startAccessLogging: (
  input: StartAccessLoggingInput,
) => Effect.Effect<
  StartAccessLoggingOutput,
  | ContainerInUseException
  | ContainerNotFoundException
  | InternalServerError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAccessLoggingInput,
  output: StartAccessLoggingOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Stops access logging on the specified container. When you stop access logging on a container, MediaStore stops sending access logs to Amazon CloudWatch Logs. These access logs are not saved and are not retrievable.
 */
export const stopAccessLogging: (
  input: StopAccessLoggingInput,
) => Effect.Effect<
  StopAccessLoggingOutput,
  | ContainerInUseException
  | ContainerNotFoundException
  | InternalServerError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopAccessLoggingInput,
  output: StopAccessLoggingOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Adds tags to the specified AWS Elemental MediaStore container. Tags are key:value pairs that you can associate with AWS resources. For example, the
 * tag key might be "customer" and the tag value might be "companyA." You can specify one or more tags to add to each container. You can add up to 50
 * tags to each container. For more information about tagging, including naming and usage conventions, see Tagging Resources in MediaStore.
 */
export const tagResource: (
  input: TagResourceInput,
) => Effect.Effect<
  TagResourceOutput,
  | ContainerInUseException
  | ContainerNotFoundException
  | InternalServerError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Removes tags from the specified container. You can specify one or more tags to remove.
 */
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceOutput,
  | ContainerInUseException
  | ContainerNotFoundException
  | InternalServerError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Deletes the specified container. Before you make a `DeleteContainer`
 * request, delete any objects in the container or in any folders in the container. You can
 * delete only empty containers.
 */
export const deleteContainer: (
  input: DeleteContainerInput,
) => Effect.Effect<
  DeleteContainerOutput,
  | ContainerInUseException
  | ContainerNotFoundException
  | InternalServerError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteContainerInput,
  output: DeleteContainerOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Retrieves the properties of the requested container. This request is commonly used to
 * retrieve the endpoint of a container. An endpoint is a value assigned by the service when a
 * new container is created. A container's endpoint does not change after it has been
 * assigned. The `DescribeContainer` request returns a single
 * `Container` object based on `ContainerName`. To return all
 * `Container` objects that are associated with a specified AWS account, use
 * ListContainers.
 */
export const describeContainer: (
  input: DescribeContainerInput,
) => Effect.Effect<
  DescribeContainerOutput,
  ContainerNotFoundException | InternalServerError | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeContainerInput,
  output: DescribeContainerOutput,
  errors: [ContainerNotFoundException, InternalServerError],
}));
/**
 * Retrieves the access policy for the specified container. For information about the
 * data that is included in an access policy, see the AWS Identity and Access Management User
 * Guide.
 */
export const getContainerPolicy: (
  input: GetContainerPolicyInput,
) => Effect.Effect<
  GetContainerPolicyOutput,
  | ContainerInUseException
  | ContainerNotFoundException
  | InternalServerError
  | PolicyNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContainerPolicyInput,
  output: GetContainerPolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
    PolicyNotFoundException,
  ],
}));
/**
 * Returns the cross-origin resource sharing (CORS) configuration information that is
 * set for the container.
 *
 * To use this operation, you must have permission to perform the
 * `MediaStore:GetCorsPolicy` action. By default, the container owner has this
 * permission and can grant it to others.
 */
export const getCorsPolicy: (
  input: GetCorsPolicyInput,
) => Effect.Effect<
  GetCorsPolicyOutput,
  | ContainerInUseException
  | ContainerNotFoundException
  | CorsPolicyNotFoundException
  | InternalServerError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCorsPolicyInput,
  output: GetCorsPolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    CorsPolicyNotFoundException,
    InternalServerError,
  ],
}));
/**
 * Creates a storage container to hold objects. A container is similar to a bucket in
 * the Amazon S3 service.
 */
export const createContainer: (
  input: CreateContainerInput,
) => Effect.Effect<
  CreateContainerOutput,
  | ContainerInUseException
  | InternalServerError
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateContainerInput,
  output: CreateContainerOutput,
  errors: [
    ContainerInUseException,
    InternalServerError,
    LimitExceededException,
  ],
}));
/**
 * Retrieves the object lifecycle policy that is assigned to a container.
 */
export const getLifecyclePolicy: (
  input: GetLifecyclePolicyInput,
) => Effect.Effect<
  GetLifecyclePolicyOutput,
  | ContainerInUseException
  | ContainerNotFoundException
  | InternalServerError
  | PolicyNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLifecyclePolicyInput,
  output: GetLifecyclePolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
    PolicyNotFoundException,
  ],
}));
/**
 * Returns the metric policy for the specified container.
 */
export const getMetricPolicy: (
  input: GetMetricPolicyInput,
) => Effect.Effect<
  GetMetricPolicyOutput,
  | ContainerInUseException
  | ContainerNotFoundException
  | InternalServerError
  | PolicyNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMetricPolicyInput,
  output: GetMetricPolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
    PolicyNotFoundException,
  ],
}));
/**
 * Deletes the access policy that is associated with the specified container.
 */
export const deleteContainerPolicy: (
  input: DeleteContainerPolicyInput,
) => Effect.Effect<
  DeleteContainerPolicyOutput,
  | ContainerInUseException
  | ContainerNotFoundException
  | InternalServerError
  | PolicyNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteContainerPolicyInput,
  output: DeleteContainerPolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
    PolicyNotFoundException,
  ],
}));
/**
 * Removes an object lifecycle policy from a container. It takes up to 20 minutes for the change to take effect.
 */
export const deleteLifecyclePolicy: (
  input: DeleteLifecyclePolicyInput,
) => Effect.Effect<
  DeleteLifecyclePolicyOutput,
  | ContainerInUseException
  | ContainerNotFoundException
  | InternalServerError
  | PolicyNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLifecyclePolicyInput,
  output: DeleteLifecyclePolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
    PolicyNotFoundException,
  ],
}));
/**
 * Deletes the metric policy that is associated with the specified container. If there is no metric policy associated with the container, MediaStore doesn't send metrics to CloudWatch.
 */
export const deleteMetricPolicy: (
  input: DeleteMetricPolicyInput,
) => Effect.Effect<
  DeleteMetricPolicyOutput,
  | ContainerInUseException
  | ContainerNotFoundException
  | InternalServerError
  | PolicyNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMetricPolicyInput,
  output: DeleteMetricPolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    InternalServerError,
    PolicyNotFoundException,
  ],
}));
/**
 * Deletes the cross-origin resource sharing (CORS) configuration information that is
 * set for the container.
 *
 * To use this operation, you must have permission to perform the
 * `MediaStore:DeleteCorsPolicy` action. The container owner has this permission
 * by default and can grant this permission to others.
 */
export const deleteCorsPolicy: (
  input: DeleteCorsPolicyInput,
) => Effect.Effect<
  DeleteCorsPolicyOutput,
  | ContainerInUseException
  | ContainerNotFoundException
  | CorsPolicyNotFoundException
  | InternalServerError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCorsPolicyInput,
  output: DeleteCorsPolicyOutput,
  errors: [
    ContainerInUseException,
    ContainerNotFoundException,
    CorsPolicyNotFoundException,
    InternalServerError,
  ],
}));

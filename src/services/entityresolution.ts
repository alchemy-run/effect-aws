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
  sdkId: "EntityResolution",
  serviceShapeName: "AWSVeniceService",
});
const auth = T.AwsAuthSigv4({ name: "entityresolution" });
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
                                url: "https://entityresolution-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://entityresolution-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://entityresolution.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://entityresolution.{Region}.{PartitionResult#dnsSuffix}",
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
export type VeniceGlobalArn = string;
export type StatementId = string;
export type StatementAction = string;
export type StatementPrincipal = string;
export type StatementCondition = string;
export type EntityName = string;
export type HeaderSafeUniqueId = string;
export type Description = string;
export type IdMappingRoleArn = string;
export type RoleArn = string;
export type EntityNameOrIdMappingWorkflowArn = string;
export type JobId = string;
export type EntityNameOrIdNamespaceArn = string;
export type ProviderServiceArn = string;
export type NextToken = string;
export type PolicyToken = string;
export type PolicyDocument = string;
export type TagKey = string;
export type InputSourceARN = string;
export type KMSArn = string;
export type S3Path = string;
export type TagValue = string;
export type OptionalS3Path = string;
export type AttributeName = string;
export type UniqueId = string;
export type IdMappingWorkflowArn = string;
export type IdNamespaceArn = string;
export type MatchingWorkflowArn = string;
export type ProviderServiceDisplayName = string;
export type SchemaMappingArn = string;
export type ErrorMessage = string;
export type CustomerProfilesDomainArn = string;
export type CustomerProfilesObjectTypeArn = string;
export type AwsAccountId = string;

//# Schemas
export type StatementActionList = string[];
export const StatementActionList = S.Array(S.String);
export type StatementPrincipalList = string[];
export const StatementPrincipalList = S.Array(S.String);
export type UniqueIdList = string[];
export const UniqueIdList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AddPolicyStatementInput {
  arn: string;
  statementId: string;
  effect: string;
  action: StatementActionList;
  principal: StatementPrincipalList;
  condition?: string;
}
export const AddPolicyStatementInput = S.suspend(() =>
  S.Struct({
    arn: S.String.pipe(T.HttpLabel("arn")),
    statementId: S.String.pipe(T.HttpLabel("statementId")),
    effect: S.String,
    action: StatementActionList,
    principal: StatementPrincipalList,
    condition: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/policies/{arn}/{statementId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddPolicyStatementInput",
}) as any as S.Schema<AddPolicyStatementInput>;
export interface BatchDeleteUniqueIdInput {
  workflowName: string;
  inputSource?: string;
  uniqueIds: UniqueIdList;
}
export const BatchDeleteUniqueIdInput = S.suspend(() =>
  S.Struct({
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    inputSource: S.optional(S.String).pipe(T.HttpHeader("inputSource")),
    uniqueIds: UniqueIdList.pipe(T.HttpHeader("uniqueIds")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/matchingworkflows/{workflowName}/uniqueids",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeleteUniqueIdInput",
}) as any as S.Schema<BatchDeleteUniqueIdInput>;
export interface DeleteIdMappingWorkflowInput {
  workflowName: string;
}
export const DeleteIdMappingWorkflowInput = S.suspend(() =>
  S.Struct({ workflowName: S.String.pipe(T.HttpLabel("workflowName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/idmappingworkflows/{workflowName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIdMappingWorkflowInput",
}) as any as S.Schema<DeleteIdMappingWorkflowInput>;
export interface DeleteIdNamespaceInput {
  idNamespaceName: string;
}
export const DeleteIdNamespaceInput = S.suspend(() =>
  S.Struct({
    idNamespaceName: S.String.pipe(T.HttpLabel("idNamespaceName")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/idnamespaces/{idNamespaceName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIdNamespaceInput",
}) as any as S.Schema<DeleteIdNamespaceInput>;
export interface DeleteMatchingWorkflowInput {
  workflowName: string;
}
export const DeleteMatchingWorkflowInput = S.suspend(() =>
  S.Struct({ workflowName: S.String.pipe(T.HttpLabel("workflowName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/matchingworkflows/{workflowName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMatchingWorkflowInput",
}) as any as S.Schema<DeleteMatchingWorkflowInput>;
export interface DeletePolicyStatementInput {
  arn: string;
  statementId: string;
}
export const DeletePolicyStatementInput = S.suspend(() =>
  S.Struct({
    arn: S.String.pipe(T.HttpLabel("arn")),
    statementId: S.String.pipe(T.HttpLabel("statementId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/policies/{arn}/{statementId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePolicyStatementInput",
}) as any as S.Schema<DeletePolicyStatementInput>;
export interface DeleteSchemaMappingInput {
  schemaName: string;
}
export const DeleteSchemaMappingInput = S.suspend(() =>
  S.Struct({ schemaName: S.String.pipe(T.HttpLabel("schemaName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/schemas/{schemaName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSchemaMappingInput",
}) as any as S.Schema<DeleteSchemaMappingInput>;
export interface GetIdMappingJobInput {
  workflowName: string;
  jobId: string;
}
export const GetIdMappingJobInput = S.suspend(() =>
  S.Struct({
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/idmappingworkflows/{workflowName}/jobs/{jobId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIdMappingJobInput",
}) as any as S.Schema<GetIdMappingJobInput>;
export interface GetIdMappingWorkflowInput {
  workflowName: string;
}
export const GetIdMappingWorkflowInput = S.suspend(() =>
  S.Struct({ workflowName: S.String.pipe(T.HttpLabel("workflowName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/idmappingworkflows/{workflowName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIdMappingWorkflowInput",
}) as any as S.Schema<GetIdMappingWorkflowInput>;
export interface GetIdNamespaceInput {
  idNamespaceName: string;
}
export const GetIdNamespaceInput = S.suspend(() =>
  S.Struct({
    idNamespaceName: S.String.pipe(T.HttpLabel("idNamespaceName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/idnamespaces/{idNamespaceName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIdNamespaceInput",
}) as any as S.Schema<GetIdNamespaceInput>;
export interface GetMatchingJobInput {
  workflowName: string;
  jobId: string;
}
export const GetMatchingJobInput = S.suspend(() =>
  S.Struct({
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/matchingworkflows/{workflowName}/jobs/{jobId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMatchingJobInput",
}) as any as S.Schema<GetMatchingJobInput>;
export interface GetMatchingWorkflowInput {
  workflowName: string;
}
export const GetMatchingWorkflowInput = S.suspend(() =>
  S.Struct({ workflowName: S.String.pipe(T.HttpLabel("workflowName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/matchingworkflows/{workflowName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMatchingWorkflowInput",
}) as any as S.Schema<GetMatchingWorkflowInput>;
export interface GetPolicyInput {
  arn: string;
}
export const GetPolicyInput = S.suspend(() =>
  S.Struct({ arn: S.String.pipe(T.HttpLabel("arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/policies/{arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPolicyInput",
}) as any as S.Schema<GetPolicyInput>;
export interface GetProviderServiceInput {
  providerName: string;
  providerServiceName: string;
}
export const GetProviderServiceInput = S.suspend(() =>
  S.Struct({
    providerName: S.String.pipe(T.HttpLabel("providerName")),
    providerServiceName: S.String.pipe(T.HttpLabel("providerServiceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/providerservices/{providerName}/{providerServiceName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProviderServiceInput",
}) as any as S.Schema<GetProviderServiceInput>;
export interface GetSchemaMappingInput {
  schemaName: string;
}
export const GetSchemaMappingInput = S.suspend(() =>
  S.Struct({ schemaName: S.String.pipe(T.HttpLabel("schemaName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/schemas/{schemaName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSchemaMappingInput",
}) as any as S.Schema<GetSchemaMappingInput>;
export interface ListIdMappingJobsInput {
  workflowName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListIdMappingJobsInput = S.suspend(() =>
  S.Struct({
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/idmappingworkflows/{workflowName}/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIdMappingJobsInput",
}) as any as S.Schema<ListIdMappingJobsInput>;
export interface ListIdMappingWorkflowsInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListIdMappingWorkflowsInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/idmappingworkflows" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIdMappingWorkflowsInput",
}) as any as S.Schema<ListIdMappingWorkflowsInput>;
export interface ListIdNamespacesInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListIdNamespacesInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/idnamespaces" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIdNamespacesInput",
}) as any as S.Schema<ListIdNamespacesInput>;
export interface ListMatchingJobsInput {
  workflowName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListMatchingJobsInput = S.suspend(() =>
  S.Struct({
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/matchingworkflows/{workflowName}/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMatchingJobsInput",
}) as any as S.Schema<ListMatchingJobsInput>;
export interface ListMatchingWorkflowsInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListMatchingWorkflowsInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/matchingworkflows" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMatchingWorkflowsInput",
}) as any as S.Schema<ListMatchingWorkflowsInput>;
export interface ListProviderServicesInput {
  nextToken?: string;
  maxResults?: number;
  providerName?: string;
}
export const ListProviderServicesInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    providerName: S.optional(S.String).pipe(T.HttpQuery("providerName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/providerservices" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProviderServicesInput",
}) as any as S.Schema<ListProviderServicesInput>;
export interface ListSchemaMappingsInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListSchemaMappingsInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/schemas" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSchemaMappingsInput",
}) as any as S.Schema<ListSchemaMappingsInput>;
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
export interface PutPolicyInput {
  arn: string;
  token?: string;
  policy: string;
}
export const PutPolicyInput = S.suspend(() =>
  S.Struct({
    arn: S.String.pipe(T.HttpLabel("arn")),
    token: S.optional(S.String),
    policy: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/policies/{arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutPolicyInput",
}) as any as S.Schema<PutPolicyInput>;
export interface StartMatchingJobInput {
  workflowName: string;
}
export const StartMatchingJobInput = S.suspend(() =>
  S.Struct({ workflowName: S.String.pipe(T.HttpLabel("workflowName")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/matchingworkflows/{workflowName}/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartMatchingJobInput",
}) as any as S.Schema<StartMatchingJobInput>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
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
export interface IdMappingWorkflowInputSource {
  inputSourceARN: string;
  schemaName?: string;
  type?: string;
}
export const IdMappingWorkflowInputSource = S.suspend(() =>
  S.Struct({
    inputSourceARN: S.String,
    schemaName: S.optional(S.String),
    type: S.optional(S.String),
  }),
).annotations({
  identifier: "IdMappingWorkflowInputSource",
}) as any as S.Schema<IdMappingWorkflowInputSource>;
export type IdMappingWorkflowInputSourceConfig = IdMappingWorkflowInputSource[];
export const IdMappingWorkflowInputSourceConfig = S.Array(
  IdMappingWorkflowInputSource,
);
export interface IdMappingWorkflowOutputSource {
  KMSArn?: string;
  outputS3Path: string;
}
export const IdMappingWorkflowOutputSource = S.suspend(() =>
  S.Struct({ KMSArn: S.optional(S.String), outputS3Path: S.String }),
).annotations({
  identifier: "IdMappingWorkflowOutputSource",
}) as any as S.Schema<IdMappingWorkflowOutputSource>;
export type IdMappingWorkflowOutputSourceConfig =
  IdMappingWorkflowOutputSource[];
export const IdMappingWorkflowOutputSourceConfig = S.Array(
  IdMappingWorkflowOutputSource,
);
export type MatchingKeys = string[];
export const MatchingKeys = S.Array(S.String);
export interface Rule {
  ruleName: string;
  matchingKeys: MatchingKeys;
}
export const Rule = S.suspend(() =>
  S.Struct({ ruleName: S.String, matchingKeys: MatchingKeys }),
).annotations({ identifier: "Rule" }) as any as S.Schema<Rule>;
export type RuleList = Rule[];
export const RuleList = S.Array(Rule);
export interface IdMappingRuleBasedProperties {
  rules?: RuleList;
  ruleDefinitionType: string;
  attributeMatchingModel: string;
  recordMatchingModel: string;
}
export const IdMappingRuleBasedProperties = S.suspend(() =>
  S.Struct({
    rules: S.optional(RuleList),
    ruleDefinitionType: S.String,
    attributeMatchingModel: S.String,
    recordMatchingModel: S.String,
  }),
).annotations({
  identifier: "IdMappingRuleBasedProperties",
}) as any as S.Schema<IdMappingRuleBasedProperties>;
export interface IntermediateSourceConfiguration {
  intermediateS3Path: string;
}
export const IntermediateSourceConfiguration = S.suspend(() =>
  S.Struct({ intermediateS3Path: S.String }),
).annotations({
  identifier: "IntermediateSourceConfiguration",
}) as any as S.Schema<IntermediateSourceConfiguration>;
export interface ProviderProperties {
  providerServiceArn: string;
  providerConfiguration?: any;
  intermediateSourceConfiguration?: IntermediateSourceConfiguration;
}
export const ProviderProperties = S.suspend(() =>
  S.Struct({
    providerServiceArn: S.String,
    providerConfiguration: S.optional(S.Any),
    intermediateSourceConfiguration: S.optional(
      IntermediateSourceConfiguration,
    ),
  }),
).annotations({
  identifier: "ProviderProperties",
}) as any as S.Schema<ProviderProperties>;
export interface IdMappingTechniques {
  idMappingType: string;
  ruleBasedProperties?: IdMappingRuleBasedProperties;
  providerProperties?: ProviderProperties;
}
export const IdMappingTechniques = S.suspend(() =>
  S.Struct({
    idMappingType: S.String,
    ruleBasedProperties: S.optional(IdMappingRuleBasedProperties),
    providerProperties: S.optional(ProviderProperties),
  }),
).annotations({
  identifier: "IdMappingTechniques",
}) as any as S.Schema<IdMappingTechniques>;
export interface IdMappingIncrementalRunConfig {
  incrementalRunType?: string;
}
export const IdMappingIncrementalRunConfig = S.suspend(() =>
  S.Struct({ incrementalRunType: S.optional(S.String) }),
).annotations({
  identifier: "IdMappingIncrementalRunConfig",
}) as any as S.Schema<IdMappingIncrementalRunConfig>;
export interface UpdateIdMappingWorkflowInput {
  workflowName: string;
  description?: string;
  inputSourceConfig: IdMappingWorkflowInputSourceConfig;
  outputSourceConfig?: IdMappingWorkflowOutputSourceConfig;
  idMappingTechniques: IdMappingTechniques;
  incrementalRunConfig?: IdMappingIncrementalRunConfig;
  roleArn?: string;
}
export const UpdateIdMappingWorkflowInput = S.suspend(() =>
  S.Struct({
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    description: S.optional(S.String),
    inputSourceConfig: IdMappingWorkflowInputSourceConfig,
    outputSourceConfig: S.optional(IdMappingWorkflowOutputSourceConfig),
    idMappingTechniques: IdMappingTechniques,
    incrementalRunConfig: S.optional(IdMappingIncrementalRunConfig),
    roleArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/idmappingworkflows/{workflowName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateIdMappingWorkflowInput",
}) as any as S.Schema<UpdateIdMappingWorkflowInput>;
export interface IdNamespaceInputSource {
  inputSourceARN: string;
  schemaName?: string;
}
export const IdNamespaceInputSource = S.suspend(() =>
  S.Struct({ inputSourceARN: S.String, schemaName: S.optional(S.String) }),
).annotations({
  identifier: "IdNamespaceInputSource",
}) as any as S.Schema<IdNamespaceInputSource>;
export type IdNamespaceInputSourceConfig = IdNamespaceInputSource[];
export const IdNamespaceInputSourceConfig = S.Array(IdNamespaceInputSource);
export type IdMappingWorkflowRuleDefinitionTypeList = string[];
export const IdMappingWorkflowRuleDefinitionTypeList = S.Array(S.String);
export type RecordMatchingModelList = string[];
export const RecordMatchingModelList = S.Array(S.String);
export interface NamespaceRuleBasedProperties {
  rules?: RuleList;
  ruleDefinitionTypes?: IdMappingWorkflowRuleDefinitionTypeList;
  attributeMatchingModel?: string;
  recordMatchingModels?: RecordMatchingModelList;
}
export const NamespaceRuleBasedProperties = S.suspend(() =>
  S.Struct({
    rules: S.optional(RuleList),
    ruleDefinitionTypes: S.optional(IdMappingWorkflowRuleDefinitionTypeList),
    attributeMatchingModel: S.optional(S.String),
    recordMatchingModels: S.optional(RecordMatchingModelList),
  }),
).annotations({
  identifier: "NamespaceRuleBasedProperties",
}) as any as S.Schema<NamespaceRuleBasedProperties>;
export interface NamespaceProviderProperties {
  providerServiceArn: string;
  providerConfiguration?: any;
}
export const NamespaceProviderProperties = S.suspend(() =>
  S.Struct({
    providerServiceArn: S.String,
    providerConfiguration: S.optional(S.Any),
  }),
).annotations({
  identifier: "NamespaceProviderProperties",
}) as any as S.Schema<NamespaceProviderProperties>;
export interface IdNamespaceIdMappingWorkflowProperties {
  idMappingType: string;
  ruleBasedProperties?: NamespaceRuleBasedProperties;
  providerProperties?: NamespaceProviderProperties;
}
export const IdNamespaceIdMappingWorkflowProperties = S.suspend(() =>
  S.Struct({
    idMappingType: S.String,
    ruleBasedProperties: S.optional(NamespaceRuleBasedProperties),
    providerProperties: S.optional(NamespaceProviderProperties),
  }),
).annotations({
  identifier: "IdNamespaceIdMappingWorkflowProperties",
}) as any as S.Schema<IdNamespaceIdMappingWorkflowProperties>;
export type IdNamespaceIdMappingWorkflowPropertiesList =
  IdNamespaceIdMappingWorkflowProperties[];
export const IdNamespaceIdMappingWorkflowPropertiesList = S.Array(
  IdNamespaceIdMappingWorkflowProperties,
);
export interface UpdateIdNamespaceInput {
  idNamespaceName: string;
  description?: string;
  inputSourceConfig?: IdNamespaceInputSourceConfig;
  idMappingWorkflowProperties?: IdNamespaceIdMappingWorkflowPropertiesList;
  roleArn?: string;
}
export const UpdateIdNamespaceInput = S.suspend(() =>
  S.Struct({
    idNamespaceName: S.String.pipe(T.HttpLabel("idNamespaceName")),
    description: S.optional(S.String),
    inputSourceConfig: S.optional(IdNamespaceInputSourceConfig),
    idMappingWorkflowProperties: S.optional(
      IdNamespaceIdMappingWorkflowPropertiesList,
    ),
    roleArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/idnamespaces/{idNamespaceName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateIdNamespaceInput",
}) as any as S.Schema<UpdateIdNamespaceInput>;
export interface InputSource {
  inputSourceARN: string;
  schemaName: string;
  applyNormalization?: boolean;
}
export const InputSource = S.suspend(() =>
  S.Struct({
    inputSourceARN: S.String,
    schemaName: S.String,
    applyNormalization: S.optional(S.Boolean),
  }),
).annotations({ identifier: "InputSource" }) as any as S.Schema<InputSource>;
export type InputSourceConfig = InputSource[];
export const InputSourceConfig = S.Array(InputSource);
export interface OutputAttribute {
  name: string;
  hashed?: boolean;
}
export const OutputAttribute = S.suspend(() =>
  S.Struct({ name: S.String, hashed: S.optional(S.Boolean) }),
).annotations({
  identifier: "OutputAttribute",
}) as any as S.Schema<OutputAttribute>;
export type OutputAttributes = OutputAttribute[];
export const OutputAttributes = S.Array(OutputAttribute);
export interface CustomerProfilesIntegrationConfig {
  domainArn: string;
  objectTypeArn: string;
}
export const CustomerProfilesIntegrationConfig = S.suspend(() =>
  S.Struct({ domainArn: S.String, objectTypeArn: S.String }),
).annotations({
  identifier: "CustomerProfilesIntegrationConfig",
}) as any as S.Schema<CustomerProfilesIntegrationConfig>;
export interface OutputSource {
  KMSArn?: string;
  outputS3Path?: string;
  output: OutputAttributes;
  applyNormalization?: boolean;
  customerProfilesIntegrationConfig?: CustomerProfilesIntegrationConfig;
}
export const OutputSource = S.suspend(() =>
  S.Struct({
    KMSArn: S.optional(S.String),
    outputS3Path: S.optional(S.String),
    output: OutputAttributes,
    applyNormalization: S.optional(S.Boolean),
    customerProfilesIntegrationConfig: S.optional(
      CustomerProfilesIntegrationConfig,
    ),
  }),
).annotations({ identifier: "OutputSource" }) as any as S.Schema<OutputSource>;
export type OutputSourceConfig = OutputSource[];
export const OutputSourceConfig = S.Array(OutputSource);
export interface RuleBasedProperties {
  rules: RuleList;
  attributeMatchingModel: string;
  matchPurpose?: string;
}
export const RuleBasedProperties = S.suspend(() =>
  S.Struct({
    rules: RuleList,
    attributeMatchingModel: S.String,
    matchPurpose: S.optional(S.String),
  }),
).annotations({
  identifier: "RuleBasedProperties",
}) as any as S.Schema<RuleBasedProperties>;
export interface RuleCondition {
  ruleName: string;
  condition: string;
}
export const RuleCondition = S.suspend(() =>
  S.Struct({ ruleName: S.String, condition: S.String }),
).annotations({
  identifier: "RuleCondition",
}) as any as S.Schema<RuleCondition>;
export type RuleConditionList = RuleCondition[];
export const RuleConditionList = S.Array(RuleCondition);
export interface RuleConditionProperties {
  rules: RuleConditionList;
}
export const RuleConditionProperties = S.suspend(() =>
  S.Struct({ rules: RuleConditionList }),
).annotations({
  identifier: "RuleConditionProperties",
}) as any as S.Schema<RuleConditionProperties>;
export interface ResolutionTechniques {
  resolutionType: string;
  ruleBasedProperties?: RuleBasedProperties;
  ruleConditionProperties?: RuleConditionProperties;
  providerProperties?: ProviderProperties;
}
export const ResolutionTechniques = S.suspend(() =>
  S.Struct({
    resolutionType: S.String,
    ruleBasedProperties: S.optional(RuleBasedProperties),
    ruleConditionProperties: S.optional(RuleConditionProperties),
    providerProperties: S.optional(ProviderProperties),
  }),
).annotations({
  identifier: "ResolutionTechniques",
}) as any as S.Schema<ResolutionTechniques>;
export interface IncrementalRunConfig {
  incrementalRunType?: string;
}
export const IncrementalRunConfig = S.suspend(() =>
  S.Struct({ incrementalRunType: S.optional(S.String) }),
).annotations({
  identifier: "IncrementalRunConfig",
}) as any as S.Schema<IncrementalRunConfig>;
export interface UpdateMatchingWorkflowInput {
  workflowName: string;
  description?: string;
  inputSourceConfig: InputSourceConfig;
  outputSourceConfig: OutputSourceConfig;
  resolutionTechniques: ResolutionTechniques;
  incrementalRunConfig?: IncrementalRunConfig;
  roleArn: string;
}
export const UpdateMatchingWorkflowInput = S.suspend(() =>
  S.Struct({
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    description: S.optional(S.String),
    inputSourceConfig: InputSourceConfig,
    outputSourceConfig: OutputSourceConfig,
    resolutionTechniques: ResolutionTechniques,
    incrementalRunConfig: S.optional(IncrementalRunConfig),
    roleArn: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/matchingworkflows/{workflowName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMatchingWorkflowInput",
}) as any as S.Schema<UpdateMatchingWorkflowInput>;
export interface SchemaInputAttribute {
  fieldName: string;
  type: string;
  groupName?: string;
  matchKey?: string;
  subType?: string;
  hashed?: boolean;
}
export const SchemaInputAttribute = S.suspend(() =>
  S.Struct({
    fieldName: S.String,
    type: S.String,
    groupName: S.optional(S.String),
    matchKey: S.optional(S.String),
    subType: S.optional(S.String),
    hashed: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SchemaInputAttribute",
}) as any as S.Schema<SchemaInputAttribute>;
export type SchemaInputAttributes = SchemaInputAttribute[];
export const SchemaInputAttributes = S.Array(SchemaInputAttribute);
export interface UpdateSchemaMappingInput {
  schemaName: string;
  description?: string;
  mappedInputFields: SchemaInputAttributes;
}
export const UpdateSchemaMappingInput = S.suspend(() =>
  S.Struct({
    schemaName: S.String.pipe(T.HttpLabel("schemaName")),
    description: S.optional(S.String),
    mappedInputFields: SchemaInputAttributes,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/schemas/{schemaName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSchemaMappingInput",
}) as any as S.Schema<UpdateSchemaMappingInput>;
export type DisconnectedUniqueIdsList = string[];
export const DisconnectedUniqueIdsList = S.Array(S.String);
export type RecordAttributeMap = { [key: string]: string };
export const RecordAttributeMap = S.Record({ key: S.String, value: S.String });
export interface IdMappingJobOutputSource {
  roleArn: string;
  outputS3Path: string;
  KMSArn?: string;
}
export const IdMappingJobOutputSource = S.suspend(() =>
  S.Struct({
    roleArn: S.String,
    outputS3Path: S.String,
    KMSArn: S.optional(S.String),
  }),
).annotations({
  identifier: "IdMappingJobOutputSource",
}) as any as S.Schema<IdMappingJobOutputSource>;
export type IdMappingJobOutputSourceConfig = IdMappingJobOutputSource[];
export const IdMappingJobOutputSourceConfig = S.Array(IdMappingJobOutputSource);
export interface AddPolicyStatementOutput {
  arn: string;
  token: string;
  policy?: string;
}
export const AddPolicyStatementOutput = S.suspend(() =>
  S.Struct({ arn: S.String, token: S.String, policy: S.optional(S.String) }),
).annotations({
  identifier: "AddPolicyStatementOutput",
}) as any as S.Schema<AddPolicyStatementOutput>;
export interface CreateSchemaMappingInput {
  schemaName: string;
  description?: string;
  mappedInputFields: SchemaInputAttributes;
  tags?: TagMap;
}
export const CreateSchemaMappingInput = S.suspend(() =>
  S.Struct({
    schemaName: S.String,
    description: S.optional(S.String),
    mappedInputFields: SchemaInputAttributes,
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/schemas" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSchemaMappingInput",
}) as any as S.Schema<CreateSchemaMappingInput>;
export interface DeleteIdMappingWorkflowOutput {
  message: string;
}
export const DeleteIdMappingWorkflowOutput = S.suspend(() =>
  S.Struct({ message: S.String }),
).annotations({
  identifier: "DeleteIdMappingWorkflowOutput",
}) as any as S.Schema<DeleteIdMappingWorkflowOutput>;
export interface DeleteIdNamespaceOutput {
  message: string;
}
export const DeleteIdNamespaceOutput = S.suspend(() =>
  S.Struct({ message: S.String }),
).annotations({
  identifier: "DeleteIdNamespaceOutput",
}) as any as S.Schema<DeleteIdNamespaceOutput>;
export interface DeleteMatchingWorkflowOutput {
  message: string;
}
export const DeleteMatchingWorkflowOutput = S.suspend(() =>
  S.Struct({ message: S.String }),
).annotations({
  identifier: "DeleteMatchingWorkflowOutput",
}) as any as S.Schema<DeleteMatchingWorkflowOutput>;
export interface DeletePolicyStatementOutput {
  arn: string;
  token: string;
  policy?: string;
}
export const DeletePolicyStatementOutput = S.suspend(() =>
  S.Struct({ arn: S.String, token: S.String, policy: S.optional(S.String) }),
).annotations({
  identifier: "DeletePolicyStatementOutput",
}) as any as S.Schema<DeletePolicyStatementOutput>;
export interface DeleteSchemaMappingOutput {
  message: string;
}
export const DeleteSchemaMappingOutput = S.suspend(() =>
  S.Struct({ message: S.String }),
).annotations({
  identifier: "DeleteSchemaMappingOutput",
}) as any as S.Schema<DeleteSchemaMappingOutput>;
export interface GetIdMappingWorkflowOutput {
  workflowName: string;
  workflowArn: string;
  description?: string;
  inputSourceConfig: IdMappingWorkflowInputSourceConfig;
  outputSourceConfig?: IdMappingWorkflowOutputSourceConfig;
  idMappingTechniques: IdMappingTechniques;
  createdAt: Date;
  updatedAt: Date;
  incrementalRunConfig?: IdMappingIncrementalRunConfig;
  roleArn?: string;
  tags?: TagMap;
}
export const GetIdMappingWorkflowOutput = S.suspend(() =>
  S.Struct({
    workflowName: S.String,
    workflowArn: S.String,
    description: S.optional(S.String),
    inputSourceConfig: IdMappingWorkflowInputSourceConfig,
    outputSourceConfig: S.optional(IdMappingWorkflowOutputSourceConfig),
    idMappingTechniques: IdMappingTechniques,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    incrementalRunConfig: S.optional(IdMappingIncrementalRunConfig),
    roleArn: S.optional(S.String),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetIdMappingWorkflowOutput",
}) as any as S.Schema<GetIdMappingWorkflowOutput>;
export interface GetIdNamespaceOutput {
  idNamespaceName: string;
  idNamespaceArn: string;
  description?: string;
  inputSourceConfig?: IdNamespaceInputSourceConfig;
  idMappingWorkflowProperties?: IdNamespaceIdMappingWorkflowPropertiesList;
  type: string;
  roleArn?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: TagMap;
}
export const GetIdNamespaceOutput = S.suspend(() =>
  S.Struct({
    idNamespaceName: S.String,
    idNamespaceArn: S.String,
    description: S.optional(S.String),
    inputSourceConfig: S.optional(IdNamespaceInputSourceConfig),
    idMappingWorkflowProperties: S.optional(
      IdNamespaceIdMappingWorkflowPropertiesList,
    ),
    type: S.String,
    roleArn: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetIdNamespaceOutput",
}) as any as S.Schema<GetIdNamespaceOutput>;
export interface GetMatchIdInput {
  workflowName: string;
  record: RecordAttributeMap;
  applyNormalization?: boolean;
}
export const GetMatchIdInput = S.suspend(() =>
  S.Struct({
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    record: RecordAttributeMap,
    applyNormalization: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/matchingworkflows/{workflowName}/matches",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMatchIdInput",
}) as any as S.Schema<GetMatchIdInput>;
export interface GetMatchingWorkflowOutput {
  workflowName: string;
  workflowArn: string;
  description?: string;
  inputSourceConfig: InputSourceConfig;
  outputSourceConfig: OutputSourceConfig;
  resolutionTechniques: ResolutionTechniques;
  createdAt: Date;
  updatedAt: Date;
  incrementalRunConfig?: IncrementalRunConfig;
  roleArn: string;
  tags?: TagMap;
}
export const GetMatchingWorkflowOutput = S.suspend(() =>
  S.Struct({
    workflowName: S.String,
    workflowArn: S.String,
    description: S.optional(S.String),
    inputSourceConfig: InputSourceConfig,
    outputSourceConfig: OutputSourceConfig,
    resolutionTechniques: ResolutionTechniques,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    incrementalRunConfig: S.optional(IncrementalRunConfig),
    roleArn: S.String,
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetMatchingWorkflowOutput",
}) as any as S.Schema<GetMatchingWorkflowOutput>;
export interface GetPolicyOutput {
  arn: string;
  token: string;
  policy?: string;
}
export const GetPolicyOutput = S.suspend(() =>
  S.Struct({ arn: S.String, token: S.String, policy: S.optional(S.String) }),
).annotations({
  identifier: "GetPolicyOutput",
}) as any as S.Schema<GetPolicyOutput>;
export interface GetSchemaMappingOutput {
  schemaName: string;
  schemaArn: string;
  description?: string;
  mappedInputFields: SchemaInputAttributes;
  createdAt: Date;
  updatedAt: Date;
  tags?: TagMap;
  hasWorkflows: boolean;
}
export const GetSchemaMappingOutput = S.suspend(() =>
  S.Struct({
    schemaName: S.String,
    schemaArn: S.String,
    description: S.optional(S.String),
    mappedInputFields: SchemaInputAttributes,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    tags: S.optional(TagMap),
    hasWorkflows: S.Boolean,
  }),
).annotations({
  identifier: "GetSchemaMappingOutput",
}) as any as S.Schema<GetSchemaMappingOutput>;
export interface JobSummary {
  jobId: string;
  status: string;
  startTime: Date;
  endTime?: Date;
}
export const JobSummary = S.suspend(() =>
  S.Struct({
    jobId: S.String,
    status: S.String,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "JobSummary" }) as any as S.Schema<JobSummary>;
export type JobList = JobSummary[];
export const JobList = S.Array(JobSummary);
export interface ListMatchingJobsOutput {
  jobs?: JobList;
  nextToken?: string;
}
export const ListMatchingJobsOutput = S.suspend(() =>
  S.Struct({ jobs: S.optional(JobList), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListMatchingJobsOutput",
}) as any as S.Schema<ListMatchingJobsOutput>;
export interface ListTagsForResourceOutput {
  tags: TagMap;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ tags: TagMap }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface PutPolicyOutput {
  arn: string;
  token: string;
  policy?: string;
}
export const PutPolicyOutput = S.suspend(() =>
  S.Struct({ arn: S.String, token: S.String, policy: S.optional(S.String) }),
).annotations({
  identifier: "PutPolicyOutput",
}) as any as S.Schema<PutPolicyOutput>;
export interface StartIdMappingJobInput {
  workflowName: string;
  outputSourceConfig?: IdMappingJobOutputSourceConfig;
  jobType?: string;
}
export const StartIdMappingJobInput = S.suspend(() =>
  S.Struct({
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    outputSourceConfig: S.optional(IdMappingJobOutputSourceConfig),
    jobType: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/idmappingworkflows/{workflowName}/jobs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartIdMappingJobInput",
}) as any as S.Schema<StartIdMappingJobInput>;
export interface StartMatchingJobOutput {
  jobId: string;
}
export const StartMatchingJobOutput = S.suspend(() =>
  S.Struct({ jobId: S.String }),
).annotations({
  identifier: "StartMatchingJobOutput",
}) as any as S.Schema<StartMatchingJobOutput>;
export interface UpdateIdMappingWorkflowOutput {
  workflowName: string;
  workflowArn: string;
  description?: string;
  inputSourceConfig: IdMappingWorkflowInputSourceConfig;
  outputSourceConfig?: IdMappingWorkflowOutputSourceConfig;
  idMappingTechniques: IdMappingTechniques;
  incrementalRunConfig?: IdMappingIncrementalRunConfig;
  roleArn?: string;
}
export const UpdateIdMappingWorkflowOutput = S.suspend(() =>
  S.Struct({
    workflowName: S.String,
    workflowArn: S.String,
    description: S.optional(S.String),
    inputSourceConfig: IdMappingWorkflowInputSourceConfig,
    outputSourceConfig: S.optional(IdMappingWorkflowOutputSourceConfig),
    idMappingTechniques: IdMappingTechniques,
    incrementalRunConfig: S.optional(IdMappingIncrementalRunConfig),
    roleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateIdMappingWorkflowOutput",
}) as any as S.Schema<UpdateIdMappingWorkflowOutput>;
export interface UpdateIdNamespaceOutput {
  idNamespaceName: string;
  idNamespaceArn: string;
  description?: string;
  inputSourceConfig?: IdNamespaceInputSourceConfig;
  idMappingWorkflowProperties?: IdNamespaceIdMappingWorkflowPropertiesList;
  type: string;
  roleArn?: string;
  createdAt: Date;
  updatedAt: Date;
}
export const UpdateIdNamespaceOutput = S.suspend(() =>
  S.Struct({
    idNamespaceName: S.String,
    idNamespaceArn: S.String,
    description: S.optional(S.String),
    inputSourceConfig: S.optional(IdNamespaceInputSourceConfig),
    idMappingWorkflowProperties: S.optional(
      IdNamespaceIdMappingWorkflowPropertiesList,
    ),
    type: S.String,
    roleArn: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "UpdateIdNamespaceOutput",
}) as any as S.Schema<UpdateIdNamespaceOutput>;
export interface UpdateMatchingWorkflowOutput {
  workflowName: string;
  description?: string;
  inputSourceConfig: InputSourceConfig;
  outputSourceConfig: OutputSourceConfig;
  resolutionTechniques: ResolutionTechniques;
  incrementalRunConfig?: IncrementalRunConfig;
  roleArn: string;
}
export const UpdateMatchingWorkflowOutput = S.suspend(() =>
  S.Struct({
    workflowName: S.String,
    description: S.optional(S.String),
    inputSourceConfig: InputSourceConfig,
    outputSourceConfig: OutputSourceConfig,
    resolutionTechniques: ResolutionTechniques,
    incrementalRunConfig: S.optional(IncrementalRunConfig),
    roleArn: S.String,
  }),
).annotations({
  identifier: "UpdateMatchingWorkflowOutput",
}) as any as S.Schema<UpdateMatchingWorkflowOutput>;
export interface UpdateSchemaMappingOutput {
  schemaName: string;
  schemaArn: string;
  description?: string;
  mappedInputFields: SchemaInputAttributes;
}
export const UpdateSchemaMappingOutput = S.suspend(() =>
  S.Struct({
    schemaName: S.String,
    schemaArn: S.String,
    description: S.optional(S.String),
    mappedInputFields: SchemaInputAttributes,
  }),
).annotations({
  identifier: "UpdateSchemaMappingOutput",
}) as any as S.Schema<UpdateSchemaMappingOutput>;
export type RecordAttributeMapString255 = { [key: string]: string };
export const RecordAttributeMapString255 = S.Record({
  key: S.String,
  value: S.String,
});
export type AwsAccountIdList = string[];
export const AwsAccountIdList = S.Array(S.String);
export type RequiredBucketActionsList = string[];
export const RequiredBucketActionsList = S.Array(S.String);
export type SchemaList = string[];
export const SchemaList = S.Array(S.String);
export type Schemas = SchemaList[];
export const Schemas = S.Array(SchemaList);
export interface DeleteUniqueIdError {
  uniqueId: string;
  errorType: string;
}
export const DeleteUniqueIdError = S.suspend(() =>
  S.Struct({ uniqueId: S.String, errorType: S.String }),
).annotations({
  identifier: "DeleteUniqueIdError",
}) as any as S.Schema<DeleteUniqueIdError>;
export type DeleteUniqueIdErrorsList = DeleteUniqueIdError[];
export const DeleteUniqueIdErrorsList = S.Array(DeleteUniqueIdError);
export interface DeletedUniqueId {
  uniqueId: string;
}
export const DeletedUniqueId = S.suspend(() =>
  S.Struct({ uniqueId: S.String }),
).annotations({
  identifier: "DeletedUniqueId",
}) as any as S.Schema<DeletedUniqueId>;
export type DeletedUniqueIdList = DeletedUniqueId[];
export const DeletedUniqueIdList = S.Array(DeletedUniqueId);
export interface Record {
  inputSourceARN: string;
  uniqueId: string;
  recordAttributeMap: RecordAttributeMapString255;
}
export const Record = S.suspend(() =>
  S.Struct({
    inputSourceARN: S.String,
    uniqueId: S.String,
    recordAttributeMap: RecordAttributeMapString255,
  }),
).annotations({ identifier: "Record" }) as any as S.Schema<Record>;
export type RecordList = Record[];
export const RecordList = S.Array(Record);
export interface IdMappingJobMetrics {
  inputRecords?: number;
  totalRecordsProcessed?: number;
  recordsNotProcessed?: number;
  deleteRecordsProcessed?: number;
  totalMappedRecords?: number;
  totalMappedSourceRecords?: number;
  totalMappedTargetRecords?: number;
  uniqueRecordsLoaded?: number;
  newMappedRecords?: number;
  newMappedSourceRecords?: number;
  newMappedTargetRecords?: number;
  newUniqueRecordsLoaded?: number;
  mappedRecordsRemoved?: number;
  mappedSourceRecordsRemoved?: number;
  mappedTargetRecordsRemoved?: number;
}
export const IdMappingJobMetrics = S.suspend(() =>
  S.Struct({
    inputRecords: S.optional(S.Number),
    totalRecordsProcessed: S.optional(S.Number),
    recordsNotProcessed: S.optional(S.Number),
    deleteRecordsProcessed: S.optional(S.Number),
    totalMappedRecords: S.optional(S.Number),
    totalMappedSourceRecords: S.optional(S.Number),
    totalMappedTargetRecords: S.optional(S.Number),
    uniqueRecordsLoaded: S.optional(S.Number),
    newMappedRecords: S.optional(S.Number),
    newMappedSourceRecords: S.optional(S.Number),
    newMappedTargetRecords: S.optional(S.Number),
    newUniqueRecordsLoaded: S.optional(S.Number),
    mappedRecordsRemoved: S.optional(S.Number),
    mappedSourceRecordsRemoved: S.optional(S.Number),
    mappedTargetRecordsRemoved: S.optional(S.Number),
  }),
).annotations({
  identifier: "IdMappingJobMetrics",
}) as any as S.Schema<IdMappingJobMetrics>;
export interface ErrorDetails {
  errorMessage?: string;
}
export const ErrorDetails = S.suspend(() =>
  S.Struct({ errorMessage: S.optional(S.String) }),
).annotations({ identifier: "ErrorDetails" }) as any as S.Schema<ErrorDetails>;
export interface JobMetrics {
  inputRecords?: number;
  totalRecordsProcessed?: number;
  recordsNotProcessed?: number;
  deleteRecordsProcessed?: number;
  matchIDs?: number;
}
export const JobMetrics = S.suspend(() =>
  S.Struct({
    inputRecords: S.optional(S.Number),
    totalRecordsProcessed: S.optional(S.Number),
    recordsNotProcessed: S.optional(S.Number),
    deleteRecordsProcessed: S.optional(S.Number),
    matchIDs: S.optional(S.Number),
  }),
).annotations({ identifier: "JobMetrics" }) as any as S.Schema<JobMetrics>;
export interface JobOutputSource {
  roleArn: string;
  outputS3Path: string;
  KMSArn?: string;
}
export const JobOutputSource = S.suspend(() =>
  S.Struct({
    roleArn: S.String,
    outputS3Path: S.String,
    KMSArn: S.optional(S.String),
  }),
).annotations({
  identifier: "JobOutputSource",
}) as any as S.Schema<JobOutputSource>;
export type JobOutputSourceConfig = JobOutputSource[];
export const JobOutputSourceConfig = S.Array(JobOutputSource);
export interface ProviderIdNameSpaceConfiguration {
  description?: string;
  providerTargetConfigurationDefinition?: any;
  providerSourceConfigurationDefinition?: any;
}
export const ProviderIdNameSpaceConfiguration = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    providerTargetConfigurationDefinition: S.optional(S.Any),
    providerSourceConfigurationDefinition: S.optional(S.Any),
  }),
).annotations({
  identifier: "ProviderIdNameSpaceConfiguration",
}) as any as S.Schema<ProviderIdNameSpaceConfiguration>;
export interface ProviderIntermediateDataAccessConfiguration {
  awsAccountIds?: AwsAccountIdList;
  requiredBucketActions?: RequiredBucketActionsList;
}
export const ProviderIntermediateDataAccessConfiguration = S.suspend(() =>
  S.Struct({
    awsAccountIds: S.optional(AwsAccountIdList),
    requiredBucketActions: S.optional(RequiredBucketActionsList),
  }),
).annotations({
  identifier: "ProviderIntermediateDataAccessConfiguration",
}) as any as S.Schema<ProviderIntermediateDataAccessConfiguration>;
export interface IdMappingWorkflowSummary {
  workflowName: string;
  workflowArn: string;
  createdAt: Date;
  updatedAt: Date;
}
export const IdMappingWorkflowSummary = S.suspend(() =>
  S.Struct({
    workflowName: S.String,
    workflowArn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "IdMappingWorkflowSummary",
}) as any as S.Schema<IdMappingWorkflowSummary>;
export type IdMappingWorkflowList = IdMappingWorkflowSummary[];
export const IdMappingWorkflowList = S.Array(IdMappingWorkflowSummary);
export interface MatchingWorkflowSummary {
  workflowName: string;
  workflowArn: string;
  createdAt: Date;
  updatedAt: Date;
  resolutionType: string;
}
export const MatchingWorkflowSummary = S.suspend(() =>
  S.Struct({
    workflowName: S.String,
    workflowArn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    resolutionType: S.String,
  }),
).annotations({
  identifier: "MatchingWorkflowSummary",
}) as any as S.Schema<MatchingWorkflowSummary>;
export type MatchingWorkflowList = MatchingWorkflowSummary[];
export const MatchingWorkflowList = S.Array(MatchingWorkflowSummary);
export interface ProviderServiceSummary {
  providerServiceArn: string;
  providerName: string;
  providerServiceDisplayName: string;
  providerServiceName: string;
  providerServiceType: string;
}
export const ProviderServiceSummary = S.suspend(() =>
  S.Struct({
    providerServiceArn: S.String,
    providerName: S.String,
    providerServiceDisplayName: S.String,
    providerServiceName: S.String,
    providerServiceType: S.String,
  }),
).annotations({
  identifier: "ProviderServiceSummary",
}) as any as S.Schema<ProviderServiceSummary>;
export type ProviderServiceList = ProviderServiceSummary[];
export const ProviderServiceList = S.Array(ProviderServiceSummary);
export interface SchemaMappingSummary {
  schemaName: string;
  schemaArn: string;
  createdAt: Date;
  updatedAt: Date;
  hasWorkflows: boolean;
}
export const SchemaMappingSummary = S.suspend(() =>
  S.Struct({
    schemaName: S.String,
    schemaArn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    hasWorkflows: S.Boolean,
  }),
).annotations({
  identifier: "SchemaMappingSummary",
}) as any as S.Schema<SchemaMappingSummary>;
export type SchemaMappingList = SchemaMappingSummary[];
export const SchemaMappingList = S.Array(SchemaMappingSummary);
export interface BatchDeleteUniqueIdOutput {
  status: string;
  errors: DeleteUniqueIdErrorsList;
  deleted: DeletedUniqueIdList;
  disconnectedUniqueIds: DisconnectedUniqueIdsList;
}
export const BatchDeleteUniqueIdOutput = S.suspend(() =>
  S.Struct({
    status: S.String,
    errors: DeleteUniqueIdErrorsList,
    deleted: DeletedUniqueIdList,
    disconnectedUniqueIds: DisconnectedUniqueIdsList,
  }),
).annotations({
  identifier: "BatchDeleteUniqueIdOutput",
}) as any as S.Schema<BatchDeleteUniqueIdOutput>;
export interface CreateIdNamespaceInput {
  idNamespaceName: string;
  description?: string;
  inputSourceConfig?: IdNamespaceInputSourceConfig;
  idMappingWorkflowProperties?: IdNamespaceIdMappingWorkflowPropertiesList;
  type: string;
  roleArn?: string;
  tags?: TagMap;
}
export const CreateIdNamespaceInput = S.suspend(() =>
  S.Struct({
    idNamespaceName: S.String,
    description: S.optional(S.String),
    inputSourceConfig: S.optional(IdNamespaceInputSourceConfig),
    idMappingWorkflowProperties: S.optional(
      IdNamespaceIdMappingWorkflowPropertiesList,
    ),
    type: S.String,
    roleArn: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/idnamespaces" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIdNamespaceInput",
}) as any as S.Schema<CreateIdNamespaceInput>;
export interface CreateSchemaMappingOutput {
  schemaName: string;
  schemaArn: string;
  description: string;
  mappedInputFields: SchemaInputAttributes;
}
export const CreateSchemaMappingOutput = S.suspend(() =>
  S.Struct({
    schemaName: S.String,
    schemaArn: S.String,
    description: S.String,
    mappedInputFields: SchemaInputAttributes,
  }),
).annotations({
  identifier: "CreateSchemaMappingOutput",
}) as any as S.Schema<CreateSchemaMappingOutput>;
export interface GenerateMatchIdInput {
  workflowName: string;
  records: RecordList;
  processingType?: string;
}
export const GenerateMatchIdInput = S.suspend(() =>
  S.Struct({
    workflowName: S.String.pipe(T.HttpLabel("workflowName")),
    records: RecordList,
    processingType: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/matchingworkflows/{workflowName}/generateMatches",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GenerateMatchIdInput",
}) as any as S.Schema<GenerateMatchIdInput>;
export interface GetIdMappingJobOutput {
  jobId: string;
  status: string;
  startTime: Date;
  endTime?: Date;
  metrics?: IdMappingJobMetrics;
  errorDetails?: ErrorDetails;
  outputSourceConfig?: IdMappingJobOutputSourceConfig;
  jobType?: string;
}
export const GetIdMappingJobOutput = S.suspend(() =>
  S.Struct({
    jobId: S.String,
    status: S.String,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    metrics: S.optional(IdMappingJobMetrics),
    errorDetails: S.optional(ErrorDetails),
    outputSourceConfig: S.optional(IdMappingJobOutputSourceConfig),
    jobType: S.optional(S.String),
  }),
).annotations({
  identifier: "GetIdMappingJobOutput",
}) as any as S.Schema<GetIdMappingJobOutput>;
export interface GetMatchIdOutput {
  matchId?: string;
  matchRule?: string;
}
export const GetMatchIdOutput = S.suspend(() =>
  S.Struct({ matchId: S.optional(S.String), matchRule: S.optional(S.String) }),
).annotations({
  identifier: "GetMatchIdOutput",
}) as any as S.Schema<GetMatchIdOutput>;
export interface GetMatchingJobOutput {
  jobId: string;
  status: string;
  startTime: Date;
  endTime?: Date;
  metrics?: JobMetrics;
  errorDetails?: ErrorDetails;
  outputSourceConfig?: JobOutputSourceConfig;
}
export const GetMatchingJobOutput = S.suspend(() =>
  S.Struct({
    jobId: S.String,
    status: S.String,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    metrics: S.optional(JobMetrics),
    errorDetails: S.optional(ErrorDetails),
    outputSourceConfig: S.optional(JobOutputSourceConfig),
  }),
).annotations({
  identifier: "GetMatchingJobOutput",
}) as any as S.Schema<GetMatchingJobOutput>;
export interface ListIdMappingJobsOutput {
  jobs?: JobList;
  nextToken?: string;
}
export const ListIdMappingJobsOutput = S.suspend(() =>
  S.Struct({ jobs: S.optional(JobList), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListIdMappingJobsOutput",
}) as any as S.Schema<ListIdMappingJobsOutput>;
export interface ListIdMappingWorkflowsOutput {
  workflowSummaries?: IdMappingWorkflowList;
  nextToken?: string;
}
export const ListIdMappingWorkflowsOutput = S.suspend(() =>
  S.Struct({
    workflowSummaries: S.optional(IdMappingWorkflowList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIdMappingWorkflowsOutput",
}) as any as S.Schema<ListIdMappingWorkflowsOutput>;
export interface ListMatchingWorkflowsOutput {
  workflowSummaries?: MatchingWorkflowList;
  nextToken?: string;
}
export const ListMatchingWorkflowsOutput = S.suspend(() =>
  S.Struct({
    workflowSummaries: S.optional(MatchingWorkflowList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMatchingWorkflowsOutput",
}) as any as S.Schema<ListMatchingWorkflowsOutput>;
export interface ListProviderServicesOutput {
  providerServiceSummaries?: ProviderServiceList;
  nextToken?: string;
}
export const ListProviderServicesOutput = S.suspend(() =>
  S.Struct({
    providerServiceSummaries: S.optional(ProviderServiceList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProviderServicesOutput",
}) as any as S.Schema<ListProviderServicesOutput>;
export interface ListSchemaMappingsOutput {
  schemaList?: SchemaMappingList;
  nextToken?: string;
}
export const ListSchemaMappingsOutput = S.suspend(() =>
  S.Struct({
    schemaList: S.optional(SchemaMappingList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSchemaMappingsOutput",
}) as any as S.Schema<ListSchemaMappingsOutput>;
export interface StartIdMappingJobOutput {
  jobId: string;
  outputSourceConfig?: IdMappingJobOutputSourceConfig;
  jobType?: string;
}
export const StartIdMappingJobOutput = S.suspend(() =>
  S.Struct({
    jobId: S.String,
    outputSourceConfig: S.optional(IdMappingJobOutputSourceConfig),
    jobType: S.optional(S.String),
  }),
).annotations({
  identifier: "StartIdMappingJobOutput",
}) as any as S.Schema<StartIdMappingJobOutput>;
export interface ProviderMarketplaceConfiguration {
  dataSetId: string;
  revisionId: string;
  assetId: string;
  listingId: string;
}
export const ProviderMarketplaceConfiguration = S.suspend(() =>
  S.Struct({
    dataSetId: S.String,
    revisionId: S.String,
    assetId: S.String,
    listingId: S.String,
  }),
).annotations({
  identifier: "ProviderMarketplaceConfiguration",
}) as any as S.Schema<ProviderMarketplaceConfiguration>;
export interface ProviderSchemaAttribute {
  fieldName: string;
  type: string;
  subType?: string;
  hashing?: boolean;
}
export const ProviderSchemaAttribute = S.suspend(() =>
  S.Struct({
    fieldName: S.String,
    type: S.String,
    subType: S.optional(S.String),
    hashing: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ProviderSchemaAttribute",
}) as any as S.Schema<ProviderSchemaAttribute>;
export type ProviderSchemaAttributes = ProviderSchemaAttribute[];
export const ProviderSchemaAttributes = S.Array(ProviderSchemaAttribute);
export interface IdNamespaceIdMappingWorkflowMetadata {
  idMappingType: string;
}
export const IdNamespaceIdMappingWorkflowMetadata = S.suspend(() =>
  S.Struct({ idMappingType: S.String }),
).annotations({
  identifier: "IdNamespaceIdMappingWorkflowMetadata",
}) as any as S.Schema<IdNamespaceIdMappingWorkflowMetadata>;
export type IdNamespaceIdMappingWorkflowMetadataList =
  IdNamespaceIdMappingWorkflowMetadata[];
export const IdNamespaceIdMappingWorkflowMetadataList = S.Array(
  IdNamespaceIdMappingWorkflowMetadata,
);
export type ProviderEndpointConfiguration = {
  marketplaceConfiguration: ProviderMarketplaceConfiguration;
};
export const ProviderEndpointConfiguration = S.Union(
  S.Struct({ marketplaceConfiguration: ProviderMarketplaceConfiguration }),
);
export interface ProviderComponentSchema {
  schemas?: Schemas;
  providerSchemaAttributes?: ProviderSchemaAttributes;
}
export const ProviderComponentSchema = S.suspend(() =>
  S.Struct({
    schemas: S.optional(Schemas),
    providerSchemaAttributes: S.optional(ProviderSchemaAttributes),
  }),
).annotations({
  identifier: "ProviderComponentSchema",
}) as any as S.Schema<ProviderComponentSchema>;
export interface IdNamespaceSummary {
  idNamespaceName: string;
  idNamespaceArn: string;
  description?: string;
  idMappingWorkflowProperties?: IdNamespaceIdMappingWorkflowMetadataList;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}
export const IdNamespaceSummary = S.suspend(() =>
  S.Struct({
    idNamespaceName: S.String,
    idNamespaceArn: S.String,
    description: S.optional(S.String),
    idMappingWorkflowProperties: S.optional(
      IdNamespaceIdMappingWorkflowMetadataList,
    ),
    type: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "IdNamespaceSummary",
}) as any as S.Schema<IdNamespaceSummary>;
export type IdNamespaceList = IdNamespaceSummary[];
export const IdNamespaceList = S.Array(IdNamespaceSummary);
export interface CreateIdMappingWorkflowInput {
  workflowName: string;
  description?: string;
  inputSourceConfig: IdMappingWorkflowInputSourceConfig;
  outputSourceConfig?: IdMappingWorkflowOutputSourceConfig;
  idMappingTechniques: IdMappingTechniques;
  incrementalRunConfig?: IdMappingIncrementalRunConfig;
  roleArn?: string;
  tags?: TagMap;
}
export const CreateIdMappingWorkflowInput = S.suspend(() =>
  S.Struct({
    workflowName: S.String,
    description: S.optional(S.String),
    inputSourceConfig: IdMappingWorkflowInputSourceConfig,
    outputSourceConfig: S.optional(IdMappingWorkflowOutputSourceConfig),
    idMappingTechniques: IdMappingTechniques,
    incrementalRunConfig: S.optional(IdMappingIncrementalRunConfig),
    roleArn: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/idmappingworkflows" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIdMappingWorkflowInput",
}) as any as S.Schema<CreateIdMappingWorkflowInput>;
export interface CreateIdNamespaceOutput {
  idNamespaceName: string;
  idNamespaceArn: string;
  description?: string;
  inputSourceConfig?: IdNamespaceInputSourceConfig;
  idMappingWorkflowProperties?: IdNamespaceIdMappingWorkflowPropertiesList;
  type: string;
  roleArn?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: TagMap;
}
export const CreateIdNamespaceOutput = S.suspend(() =>
  S.Struct({
    idNamespaceName: S.String,
    idNamespaceArn: S.String,
    description: S.optional(S.String),
    inputSourceConfig: S.optional(IdNamespaceInputSourceConfig),
    idMappingWorkflowProperties: S.optional(
      IdNamespaceIdMappingWorkflowPropertiesList,
    ),
    type: S.String,
    roleArn: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "CreateIdNamespaceOutput",
}) as any as S.Schema<CreateIdNamespaceOutput>;
export interface CreateMatchingWorkflowInput {
  workflowName: string;
  description?: string;
  inputSourceConfig: InputSourceConfig;
  outputSourceConfig: OutputSourceConfig;
  resolutionTechniques: ResolutionTechniques;
  incrementalRunConfig?: IncrementalRunConfig;
  roleArn: string;
  tags?: TagMap;
}
export const CreateMatchingWorkflowInput = S.suspend(() =>
  S.Struct({
    workflowName: S.String,
    description: S.optional(S.String),
    inputSourceConfig: InputSourceConfig,
    outputSourceConfig: OutputSourceConfig,
    resolutionTechniques: ResolutionTechniques,
    incrementalRunConfig: S.optional(IncrementalRunConfig),
    roleArn: S.String,
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/matchingworkflows" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMatchingWorkflowInput",
}) as any as S.Schema<CreateMatchingWorkflowInput>;
export interface GetProviderServiceOutput {
  providerName: string;
  providerServiceName: string;
  providerServiceDisplayName: string;
  providerServiceType: string;
  providerServiceArn: string;
  providerConfigurationDefinition?: any;
  providerIdNameSpaceConfiguration?: ProviderIdNameSpaceConfiguration;
  providerJobConfiguration?: any;
  providerEndpointConfiguration: (typeof ProviderEndpointConfiguration)["Type"];
  anonymizedOutput: boolean;
  providerEntityOutputDefinition: any;
  providerIntermediateDataAccessConfiguration?: ProviderIntermediateDataAccessConfiguration;
  providerComponentSchema?: ProviderComponentSchema;
}
export const GetProviderServiceOutput = S.suspend(() =>
  S.Struct({
    providerName: S.String,
    providerServiceName: S.String,
    providerServiceDisplayName: S.String,
    providerServiceType: S.String,
    providerServiceArn: S.String,
    providerConfigurationDefinition: S.optional(S.Any),
    providerIdNameSpaceConfiguration: S.optional(
      ProviderIdNameSpaceConfiguration,
    ),
    providerJobConfiguration: S.optional(S.Any),
    providerEndpointConfiguration: ProviderEndpointConfiguration,
    anonymizedOutput: S.Boolean,
    providerEntityOutputDefinition: S.Any,
    providerIntermediateDataAccessConfiguration: S.optional(
      ProviderIntermediateDataAccessConfiguration,
    ),
    providerComponentSchema: S.optional(ProviderComponentSchema),
  }),
).annotations({
  identifier: "GetProviderServiceOutput",
}) as any as S.Schema<GetProviderServiceOutput>;
export interface ListIdNamespacesOutput {
  idNamespaceSummaries?: IdNamespaceList;
  nextToken?: string;
}
export const ListIdNamespacesOutput = S.suspend(() =>
  S.Struct({
    idNamespaceSummaries: S.optional(IdNamespaceList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIdNamespacesOutput",
}) as any as S.Schema<ListIdNamespacesOutput>;
export interface FailedRecord {
  inputSourceARN: string;
  uniqueId: string;
  errorMessage: string;
}
export const FailedRecord = S.suspend(() =>
  S.Struct({
    inputSourceARN: S.String,
    uniqueId: S.String,
    errorMessage: S.String,
  }),
).annotations({ identifier: "FailedRecord" }) as any as S.Schema<FailedRecord>;
export type FailedRecordsList = FailedRecord[];
export const FailedRecordsList = S.Array(FailedRecord);
export interface CreateIdMappingWorkflowOutput {
  workflowName: string;
  workflowArn: string;
  description?: string;
  inputSourceConfig: IdMappingWorkflowInputSourceConfig;
  outputSourceConfig?: IdMappingWorkflowOutputSourceConfig;
  idMappingTechniques: IdMappingTechniques;
  incrementalRunConfig?: IdMappingIncrementalRunConfig;
  roleArn?: string;
}
export const CreateIdMappingWorkflowOutput = S.suspend(() =>
  S.Struct({
    workflowName: S.String,
    workflowArn: S.String,
    description: S.optional(S.String),
    inputSourceConfig: IdMappingWorkflowInputSourceConfig,
    outputSourceConfig: S.optional(IdMappingWorkflowOutputSourceConfig),
    idMappingTechniques: IdMappingTechniques,
    incrementalRunConfig: S.optional(IdMappingIncrementalRunConfig),
    roleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateIdMappingWorkflowOutput",
}) as any as S.Schema<CreateIdMappingWorkflowOutput>;
export interface CreateMatchingWorkflowOutput {
  workflowName: string;
  workflowArn: string;
  description?: string;
  inputSourceConfig: InputSourceConfig;
  outputSourceConfig: OutputSourceConfig;
  resolutionTechniques: ResolutionTechniques;
  incrementalRunConfig?: IncrementalRunConfig;
  roleArn: string;
}
export const CreateMatchingWorkflowOutput = S.suspend(() =>
  S.Struct({
    workflowName: S.String,
    workflowArn: S.String,
    description: S.optional(S.String),
    inputSourceConfig: InputSourceConfig,
    outputSourceConfig: OutputSourceConfig,
    resolutionTechniques: ResolutionTechniques,
    incrementalRunConfig: S.optional(IncrementalRunConfig),
    roleArn: S.String,
  }),
).annotations({
  identifier: "CreateMatchingWorkflowOutput",
}) as any as S.Schema<CreateMatchingWorkflowOutput>;
export interface MatchedRecord {
  inputSourceARN: string;
  recordId: string;
}
export const MatchedRecord = S.suspend(() =>
  S.Struct({ inputSourceARN: S.String, recordId: S.String }),
).annotations({
  identifier: "MatchedRecord",
}) as any as S.Schema<MatchedRecord>;
export type MatchedRecordsList = MatchedRecord[];
export const MatchedRecordsList = S.Array(MatchedRecord);
export interface MatchGroup {
  records: MatchedRecordsList;
  matchId: string;
  matchRule: string;
}
export const MatchGroup = S.suspend(() =>
  S.Struct({
    records: MatchedRecordsList,
    matchId: S.String,
    matchRule: S.String,
  }),
).annotations({ identifier: "MatchGroup" }) as any as S.Schema<MatchGroup>;
export type MatchGroupsList = MatchGroup[];
export const MatchGroupsList = S.Array(MatchGroup);
export interface GenerateMatchIdOutput {
  matchGroups: MatchGroupsList;
  failedRecords: FailedRecordsList;
}
export const GenerateMatchIdOutput = S.suspend(() =>
  S.Struct({ matchGroups: MatchGroupsList, failedRecords: FailedRecordsList }),
).annotations({
  identifier: "GenerateMatchIdOutput",
}) as any as S.Schema<GenerateMatchIdOutput>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ExceedsLimitException extends S.TaggedError<ExceedsLimitException>()(
  "ExceedsLimitException",
  {
    message: S.optional(S.String),
    quotaName: S.optional(S.String),
    quotaValue: S.optional(S.Number),
  },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Removes one or more tags from the specified Entity Resolution resource. In Entity Resolution, `SchemaMapping`, and `MatchingWorkflow` can be tagged.
 */
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceOutput,
  InternalServerException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [InternalServerException, ResourceNotFoundException],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified Entity Resolution resource. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. In Entity Resolution, `SchemaMapping` and `MatchingWorkflow` can be tagged. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can use the `TagResource` action with a resource that already has tags. If you specify a new tag key, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag.
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
 * Deletes the `IdMappingWorkflow` with a given name. This operation will succeed even if a workflow with the given name does not exist.
 */
export const deleteIdMappingWorkflow: (
  input: DeleteIdMappingWorkflowInput,
) => Effect.Effect<
  DeleteIdMappingWorkflowOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIdMappingWorkflowInput,
  output: DeleteIdMappingWorkflowOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the `MatchingWorkflow` with a given name. This operation will succeed even if a workflow with the given name does not exist.
 */
export const deleteMatchingWorkflow: (
  input: DeleteMatchingWorkflowInput,
) => Effect.Effect<
  DeleteMatchingWorkflowOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMatchingWorkflowInput,
  output: DeleteMatchingWorkflowOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the policy statement.
 */
export const deletePolicyStatement: (
  input: DeletePolicyStatementInput,
) => Effect.Effect<
  DeletePolicyStatementOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyStatementInput,
  output: DeletePolicyStatementOutput,
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
 * Deletes the `SchemaMapping` with a given name. This operation will succeed even if a schema with the given name does not exist. This operation will fail if there is a `MatchingWorkflow` object that references the `SchemaMapping` in the workflow's `InputSourceConfig`.
 */
export const deleteSchemaMapping: (
  input: DeleteSchemaMappingInput,
) => Effect.Effect<
  DeleteSchemaMappingOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSchemaMappingInput,
  output: DeleteSchemaMappingOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the resource-based policy.
 */
export const putPolicy: (
  input: PutPolicyInput,
) => Effect.Effect<
  PutPolicyOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPolicyInput,
  output: PutPolicyOutput,
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
 * Updates a schema mapping.
 *
 * A schema is immutable if it is being used by a workflow. Therefore, you can't update a schema mapping if it's associated with a workflow.
 */
export const updateSchemaMapping: (
  input: UpdateSchemaMappingInput,
) => Effect.Effect<
  UpdateSchemaMappingOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSchemaMappingInput,
  output: UpdateSchemaMappingOutput,
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
 * Returns a list of all the `MatchingWorkflows` that have been created for an Amazon Web Services account.
 */
export const listMatchingWorkflows: {
  (
    input: ListMatchingWorkflowsInput,
  ): Effect.Effect<
    ListMatchingWorkflowsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMatchingWorkflowsInput,
  ) => Stream.Stream<
    ListMatchingWorkflowsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMatchingWorkflowsInput,
  ) => Stream.Stream<
    MatchingWorkflowSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMatchingWorkflowsInput,
  output: ListMatchingWorkflowsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "workflowSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of all the `ProviderServices` that are available in this Amazon Web Services Region.
 */
export const listProviderServices: {
  (
    input: ListProviderServicesInput,
  ): Effect.Effect<
    ListProviderServicesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProviderServicesInput,
  ) => Stream.Stream<
    ListProviderServicesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProviderServicesInput,
  ) => Stream.Stream<
    ProviderServiceSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProviderServicesInput,
  output: ListProviderServicesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "providerServiceSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of all the `SchemaMappings` that have been created for an Amazon Web Services account.
 */
export const listSchemaMappings: {
  (
    input: ListSchemaMappingsInput,
  ): Effect.Effect<
    ListSchemaMappingsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSchemaMappingsInput,
  ) => Stream.Stream<
    ListSchemaMappingsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSchemaMappingsInput,
  ) => Stream.Stream<
    SchemaMappingSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSchemaMappingsInput,
  output: ListSchemaMappingsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "schemaList",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes the `IdNamespace` with a given name.
 */
export const deleteIdNamespace: (
  input: DeleteIdNamespaceInput,
) => Effect.Effect<
  DeleteIdNamespaceOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIdNamespaceInput,
  output: DeleteIdNamespaceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the `IdMappingWorkflow` with a given name, if it exists.
 */
export const getIdMappingWorkflow: (
  input: GetIdMappingWorkflowInput,
) => Effect.Effect<
  GetIdMappingWorkflowOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdMappingWorkflowInput,
  output: GetIdMappingWorkflowOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the `IdNamespace` with a given name, if it exists.
 */
export const getIdNamespace: (
  input: GetIdNamespaceInput,
) => Effect.Effect<
  GetIdNamespaceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdNamespaceInput,
  output: GetIdNamespaceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the `MatchingWorkflow` with a given name, if it exists.
 */
export const getMatchingWorkflow: (
  input: GetMatchingWorkflowInput,
) => Effect.Effect<
  GetMatchingWorkflowOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMatchingWorkflowInput,
  output: GetMatchingWorkflowOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the resource-based policy.
 */
export const getPolicy: (
  input: GetPolicyInput,
) => Effect.Effect<
  GetPolicyOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyInput,
  output: GetPolicyOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the SchemaMapping of a given name.
 */
export const getSchemaMapping: (
  input: GetSchemaMappingInput,
) => Effect.Effect<
  GetSchemaMappingOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSchemaMappingInput,
  output: GetSchemaMappingOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all jobs for a given workflow.
 */
export const listMatchingJobs: {
  (
    input: ListMatchingJobsInput,
  ): Effect.Effect<
    ListMatchingJobsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMatchingJobsInput,
  ) => Stream.Stream<
    ListMatchingJobsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMatchingJobsInput,
  ) => Stream.Stream<
    JobSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMatchingJobsInput,
  output: ListMatchingJobsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "jobs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates an existing `IdMappingWorkflow`. This method is identical to CreateIdMappingWorkflow, except it uses an HTTP `PUT` request instead of a `POST` request, and the `IdMappingWorkflow` must already exist for the method to succeed.
 *
 * Incremental processing is not supported for ID mapping workflows.
 */
export const updateIdMappingWorkflow: (
  input: UpdateIdMappingWorkflowInput,
) => Effect.Effect<
  UpdateIdMappingWorkflowOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIdMappingWorkflowInput,
  output: UpdateIdMappingWorkflowOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing ID namespace.
 */
export const updateIdNamespace: (
  input: UpdateIdNamespaceInput,
) => Effect.Effect<
  UpdateIdNamespaceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIdNamespaceInput,
  output: UpdateIdNamespaceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing matching workflow. The workflow must already exist for this operation to succeed.
 *
 * For workflows where `resolutionType` is `ML_MATCHING` or `PROVIDER`, incremental processing is not supported.
 */
export const updateMatchingWorkflow: (
  input: UpdateMatchingWorkflowInput,
) => Effect.Effect<
  UpdateMatchingWorkflowOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMatchingWorkflowInput,
  output: UpdateMatchingWorkflowOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the status, metrics, and errors (if there are any) that are associated with a job.
 */
export const getIdMappingJob: (
  input: GetIdMappingJobInput,
) => Effect.Effect<
  GetIdMappingJobOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdMappingJobInput,
  output: GetIdMappingJobOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the corresponding Match ID of a customer record if the record has been processed in a rule-based matching workflow.
 *
 * You can call this API as a dry run of an incremental load on the rule-based matching workflow.
 */
export const getMatchId: (
  input: GetMatchIdInput,
) => Effect.Effect<
  GetMatchIdOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMatchIdInput,
  output: GetMatchIdOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the status, metrics, and errors (if there are any) that are associated with a job.
 */
export const getMatchingJob: (
  input: GetMatchingJobInput,
) => Effect.Effect<
  GetMatchingJobOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMatchingJobInput,
  output: GetMatchingJobOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all ID mapping jobs for a given workflow.
 */
export const listIdMappingJobs: {
  (
    input: ListIdMappingJobsInput,
  ): Effect.Effect<
    ListIdMappingJobsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIdMappingJobsInput,
  ) => Stream.Stream<
    ListIdMappingJobsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIdMappingJobsInput,
  ) => Stream.Stream<
    JobSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIdMappingJobsInput,
  output: ListIdMappingJobsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "jobs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Adds a policy statement object. To retrieve a list of existing policy statements, use the `GetPolicy` API.
 */
export const addPolicyStatement: (
  input: AddPolicyStatementInput,
) => Effect.Effect<
  AddPolicyStatementOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddPolicyStatementInput,
  output: AddPolicyStatementOutput,
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
 * Returns the `ProviderService` of a given name.
 */
export const getProviderService: (
  input: GetProviderServiceInput,
) => Effect.Effect<
  GetProviderServiceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProviderServiceInput,
  output: GetProviderServiceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Displays the tags associated with an Entity Resolution resource. In Entity Resolution, `SchemaMapping`, and `MatchingWorkflow` can be tagged.
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
 * Deletes multiple unique IDs in a matching workflow.
 */
export const batchDeleteUniqueId: (
  input: BatchDeleteUniqueIdInput,
) => Effect.Effect<
  BatchDeleteUniqueIdOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteUniqueIdInput,
  output: BatchDeleteUniqueIdOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of all the `IdMappingWorkflows` that have been created for an Amazon Web Services account.
 */
export const listIdMappingWorkflows: {
  (
    input: ListIdMappingWorkflowsInput,
  ): Effect.Effect<
    ListIdMappingWorkflowsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIdMappingWorkflowsInput,
  ) => Stream.Stream<
    ListIdMappingWorkflowsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIdMappingWorkflowsInput,
  ) => Stream.Stream<
    IdMappingWorkflowSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIdMappingWorkflowsInput,
  output: ListIdMappingWorkflowsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "workflowSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of all ID namespaces.
 */
export const listIdNamespaces: {
  (
    input: ListIdNamespacesInput,
  ): Effect.Effect<
    ListIdNamespacesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIdNamespacesInput,
  ) => Stream.Stream<
    ListIdNamespacesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIdNamespacesInput,
  ) => Stream.Stream<
    IdNamespaceSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIdNamespacesInput,
  output: ListIdNamespacesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "idNamespaceSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates an ID namespace object which will help customers provide metadata explaining their dataset and how to use it. Each ID namespace must have a unique name. To modify an existing ID namespace, use the UpdateIdNamespace API.
 */
export const createIdNamespace: (
  input: CreateIdNamespaceInput,
) => Effect.Effect<
  CreateIdNamespaceOutput,
  | AccessDeniedException
  | ConflictException
  | ExceedsLimitException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIdNamespaceInput,
  output: CreateIdNamespaceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    ExceedsLimitException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a matching workflow that defines the configuration for a data processing job. The workflow name must be unique. To modify an existing workflow, use `UpdateMatchingWorkflow`.
 *
 * For workflows where `resolutionType` is `ML_MATCHING` or `PROVIDER`, incremental processing is not supported.
 */
export const createMatchingWorkflow: (
  input: CreateMatchingWorkflowInput,
) => Effect.Effect<
  CreateMatchingWorkflowOutput,
  | AccessDeniedException
  | ConflictException
  | ExceedsLimitException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMatchingWorkflowInput,
  output: CreateMatchingWorkflowOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    ExceedsLimitException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a schema mapping, which defines the schema of the input customer records table. The `SchemaMapping` also provides Entity Resolution with some metadata about the table, such as the attribute types of the columns and which columns to match on.
 */
export const createSchemaMapping: (
  input: CreateSchemaMappingInput,
) => Effect.Effect<
  CreateSchemaMappingOutput,
  | AccessDeniedException
  | ConflictException
  | ExceedsLimitException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSchemaMappingInput,
  output: CreateSchemaMappingOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    ExceedsLimitException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts the `IdMappingJob` of a workflow. The workflow must have previously been created using the `CreateIdMappingWorkflow` endpoint.
 */
export const startIdMappingJob: (
  input: StartIdMappingJobInput,
) => Effect.Effect<
  StartIdMappingJobOutput,
  | AccessDeniedException
  | ConflictException
  | ExceedsLimitException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartIdMappingJobInput,
  output: StartIdMappingJobOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    ExceedsLimitException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts the `MatchingJob` of a workflow. The workflow must have previously been created using the `CreateMatchingWorkflow` endpoint.
 */
export const startMatchingJob: (
  input: StartMatchingJobInput,
) => Effect.Effect<
  StartMatchingJobOutput,
  | AccessDeniedException
  | ConflictException
  | ExceedsLimitException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMatchingJobInput,
  output: StartMatchingJobOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    ExceedsLimitException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an `IdMappingWorkflow` object which stores the configuration of the data processing job to be run. Each `IdMappingWorkflow` must have a unique workflow name. To modify an existing workflow, use the UpdateIdMappingWorkflow API.
 *
 * Incremental processing is not supported for ID mapping workflows.
 */
export const createIdMappingWorkflow: (
  input: CreateIdMappingWorkflowInput,
) => Effect.Effect<
  CreateIdMappingWorkflowOutput,
  | AccessDeniedException
  | ConflictException
  | ExceedsLimitException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIdMappingWorkflowInput,
  output: CreateIdMappingWorkflowOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    ExceedsLimitException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Generates or retrieves Match IDs for records using a rule-based matching workflow. When you call this operation, it processes your records against the workflow's matching rules to identify potential matches. For existing records, it retrieves their Match IDs and associated rules. For records without matches, it generates new Match IDs. The operation saves results to Amazon S3.
 *
 * The processing type (`processingType`) you choose affects both the accuracy and response time of the operation. Additional charges apply for each API call, whether made through the Entity Resolution console or directly via the API. The rule-based matching workflow must exist and be active before calling this operation.
 */
export const generateMatchId: (
  input: GenerateMatchIdInput,
) => Effect.Effect<
  GenerateMatchIdOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateMatchIdInput,
  output: GenerateMatchIdOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

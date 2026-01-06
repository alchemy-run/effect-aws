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
  sdkId: "Route53 Recovery Readiness",
  serviceShapeName: "Route53RecoveryReadiness",
});
const auth = T.AwsAuthSigv4({ name: "route53-recovery-readiness" });
const ver = T.ServiceVersion("2019-12-02");
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
                        url: "https://route53-recovery-readiness-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://route53-recovery-readiness-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://route53-recovery-readiness.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://route53-recovery-readiness.{Region}.{PartitionResult#dnsSuffix}",
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
export type __string = string;
export type CrossAccountAuthorization = string;
export type __stringPatternAWSAZaZ09AZaZ09 = string;
export type MaxResults = number;
export type __stringMax256 = string;
export type __stringMax64PatternAAZAZ09Z = string;
export type __stringMax64 = string;

//# Schemas
export type __listOf__string = string[];
export const __listOf__string = S.Array(S.String);
export interface CreateCrossAccountAuthorizationRequest {
  CrossAccountAuthorization: string;
}
export const CreateCrossAccountAuthorizationRequest = S.suspend(() =>
  S.Struct({
    CrossAccountAuthorization: S.String.pipe(
      T.JsonName("crossAccountAuthorization"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/crossaccountauthorizations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCrossAccountAuthorizationRequest",
}) as any as S.Schema<CreateCrossAccountAuthorizationRequest>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface CreateReadinessCheckRequest {
  ReadinessCheckName: string;
  ResourceSetName: string;
  Tags?: Tags;
}
export const CreateReadinessCheckRequest = S.suspend(() =>
  S.Struct({
    ReadinessCheckName: S.String.pipe(T.JsonName("readinessCheckName")),
    ResourceSetName: S.String.pipe(T.JsonName("resourceSetName")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/readinesschecks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateReadinessCheckRequest",
}) as any as S.Schema<CreateReadinessCheckRequest>;
export interface CreateRecoveryGroupRequest {
  Cells?: __listOf__string;
  RecoveryGroupName: string;
  Tags?: Tags;
}
export const CreateRecoveryGroupRequest = S.suspend(() =>
  S.Struct({
    Cells: S.optional(__listOf__string).pipe(T.JsonName("cells")),
    RecoveryGroupName: S.String.pipe(T.JsonName("recoveryGroupName")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/recoverygroups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRecoveryGroupRequest",
}) as any as S.Schema<CreateRecoveryGroupRequest>;
export interface DeleteCellRequest {
  CellName: string;
}
export const DeleteCellRequest = S.suspend(() =>
  S.Struct({ CellName: S.String.pipe(T.HttpLabel("CellName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/cells/{CellName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCellRequest",
}) as any as S.Schema<DeleteCellRequest>;
export interface DeleteCellResponse {}
export const DeleteCellResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteCellResponse",
}) as any as S.Schema<DeleteCellResponse>;
export interface DeleteCrossAccountAuthorizationRequest {
  CrossAccountAuthorization: string;
}
export const DeleteCrossAccountAuthorizationRequest = S.suspend(() =>
  S.Struct({
    CrossAccountAuthorization: S.String.pipe(
      T.HttpLabel("CrossAccountAuthorization"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/crossaccountauthorizations/{CrossAccountAuthorization}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCrossAccountAuthorizationRequest",
}) as any as S.Schema<DeleteCrossAccountAuthorizationRequest>;
export interface DeleteCrossAccountAuthorizationResponse {}
export const DeleteCrossAccountAuthorizationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCrossAccountAuthorizationResponse",
}) as any as S.Schema<DeleteCrossAccountAuthorizationResponse>;
export interface DeleteReadinessCheckRequest {
  ReadinessCheckName: string;
}
export const DeleteReadinessCheckRequest = S.suspend(() =>
  S.Struct({
    ReadinessCheckName: S.String.pipe(T.HttpLabel("ReadinessCheckName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/readinesschecks/{ReadinessCheckName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteReadinessCheckRequest",
}) as any as S.Schema<DeleteReadinessCheckRequest>;
export interface DeleteReadinessCheckResponse {}
export const DeleteReadinessCheckResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteReadinessCheckResponse",
}) as any as S.Schema<DeleteReadinessCheckResponse>;
export interface DeleteRecoveryGroupRequest {
  RecoveryGroupName: string;
}
export const DeleteRecoveryGroupRequest = S.suspend(() =>
  S.Struct({
    RecoveryGroupName: S.String.pipe(T.HttpLabel("RecoveryGroupName")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/recoverygroups/{RecoveryGroupName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRecoveryGroupRequest",
}) as any as S.Schema<DeleteRecoveryGroupRequest>;
export interface DeleteRecoveryGroupResponse {}
export const DeleteRecoveryGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRecoveryGroupResponse",
}) as any as S.Schema<DeleteRecoveryGroupResponse>;
export interface DeleteResourceSetRequest {
  ResourceSetName: string;
}
export const DeleteResourceSetRequest = S.suspend(() =>
  S.Struct({
    ResourceSetName: S.String.pipe(T.HttpLabel("ResourceSetName")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/resourcesets/{ResourceSetName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResourceSetRequest",
}) as any as S.Schema<DeleteResourceSetRequest>;
export interface DeleteResourceSetResponse {}
export const DeleteResourceSetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteResourceSetResponse",
}) as any as S.Schema<DeleteResourceSetResponse>;
export interface GetArchitectureRecommendationsRequest {
  MaxResults?: number;
  NextToken?: string;
  RecoveryGroupName: string;
}
export const GetArchitectureRecommendationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RecoveryGroupName: S.String.pipe(T.HttpLabel("RecoveryGroupName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/recoverygroups/{RecoveryGroupName}/architectureRecommendations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetArchitectureRecommendationsRequest",
}) as any as S.Schema<GetArchitectureRecommendationsRequest>;
export interface GetCellRequest {
  CellName: string;
}
export const GetCellRequest = S.suspend(() =>
  S.Struct({ CellName: S.String.pipe(T.HttpLabel("CellName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/cells/{CellName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCellRequest",
}) as any as S.Schema<GetCellRequest>;
export interface GetCellReadinessSummaryRequest {
  CellName: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetCellReadinessSummaryRequest = S.suspend(() =>
  S.Struct({
    CellName: S.String.pipe(T.HttpLabel("CellName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/cellreadiness/{CellName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCellReadinessSummaryRequest",
}) as any as S.Schema<GetCellReadinessSummaryRequest>;
export interface GetReadinessCheckRequest {
  ReadinessCheckName: string;
}
export const GetReadinessCheckRequest = S.suspend(() =>
  S.Struct({
    ReadinessCheckName: S.String.pipe(T.HttpLabel("ReadinessCheckName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/readinesschecks/{ReadinessCheckName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetReadinessCheckRequest",
}) as any as S.Schema<GetReadinessCheckRequest>;
export interface GetReadinessCheckResourceStatusRequest {
  MaxResults?: number;
  NextToken?: string;
  ReadinessCheckName: string;
  ResourceIdentifier: string;
}
export const GetReadinessCheckResourceStatusRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ReadinessCheckName: S.String.pipe(T.HttpLabel("ReadinessCheckName")),
    ResourceIdentifier: S.String.pipe(T.HttpLabel("ResourceIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/readinesschecks/{ReadinessCheckName}/resource/{ResourceIdentifier}/status",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetReadinessCheckResourceStatusRequest",
}) as any as S.Schema<GetReadinessCheckResourceStatusRequest>;
export interface GetReadinessCheckStatusRequest {
  MaxResults?: number;
  NextToken?: string;
  ReadinessCheckName: string;
}
export const GetReadinessCheckStatusRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ReadinessCheckName: S.String.pipe(T.HttpLabel("ReadinessCheckName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/readinesschecks/{ReadinessCheckName}/status",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetReadinessCheckStatusRequest",
}) as any as S.Schema<GetReadinessCheckStatusRequest>;
export interface GetRecoveryGroupRequest {
  RecoveryGroupName: string;
}
export const GetRecoveryGroupRequest = S.suspend(() =>
  S.Struct({
    RecoveryGroupName: S.String.pipe(T.HttpLabel("RecoveryGroupName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/recoverygroups/{RecoveryGroupName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRecoveryGroupRequest",
}) as any as S.Schema<GetRecoveryGroupRequest>;
export interface GetRecoveryGroupReadinessSummaryRequest {
  MaxResults?: number;
  NextToken?: string;
  RecoveryGroupName: string;
}
export const GetRecoveryGroupReadinessSummaryRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RecoveryGroupName: S.String.pipe(T.HttpLabel("RecoveryGroupName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/recoverygroupreadiness/{RecoveryGroupName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRecoveryGroupReadinessSummaryRequest",
}) as any as S.Schema<GetRecoveryGroupReadinessSummaryRequest>;
export interface GetResourceSetRequest {
  ResourceSetName: string;
}
export const GetResourceSetRequest = S.suspend(() =>
  S.Struct({
    ResourceSetName: S.String.pipe(T.HttpLabel("ResourceSetName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/resourcesets/{ResourceSetName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceSetRequest",
}) as any as S.Schema<GetResourceSetRequest>;
export interface ListCellsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListCellsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/cells" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCellsRequest",
}) as any as S.Schema<ListCellsRequest>;
export interface ListCrossAccountAuthorizationsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListCrossAccountAuthorizationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/crossaccountauthorizations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCrossAccountAuthorizationsRequest",
}) as any as S.Schema<ListCrossAccountAuthorizationsRequest>;
export interface ListReadinessChecksRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListReadinessChecksRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/readinesschecks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReadinessChecksRequest",
}) as any as S.Schema<ListReadinessChecksRequest>;
export interface ListRecoveryGroupsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListRecoveryGroupsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/recoverygroups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRecoveryGroupsRequest",
}) as any as S.Schema<ListRecoveryGroupsRequest>;
export interface ListResourceSetsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListResourceSetsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/resourcesets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourceSetsRequest",
}) as any as S.Schema<ListResourceSetsRequest>;
export interface ListRulesRequest {
  MaxResults?: number;
  NextToken?: string;
  ResourceType?: string;
}
export const ListRulesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/rules" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRulesRequest",
}) as any as S.Schema<ListRulesRequest>;
export interface ListTagsForResourcesRequest {
  ResourceArn: string;
}
export const ListTagsForResourcesRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourcesRequest",
}) as any as S.Schema<ListTagsForResourcesRequest>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: Tags.pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: __listOf__string;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: __listOf__string.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export interface UpdateCellRequest {
  CellName: string;
  Cells: __listOf__string;
}
export const UpdateCellRequest = S.suspend(() =>
  S.Struct({
    CellName: S.String.pipe(T.HttpLabel("CellName")),
    Cells: __listOf__string.pipe(T.JsonName("cells")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/cells/{CellName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCellRequest",
}) as any as S.Schema<UpdateCellRequest>;
export interface UpdateReadinessCheckRequest {
  ReadinessCheckName: string;
  ResourceSetName: string;
}
export const UpdateReadinessCheckRequest = S.suspend(() =>
  S.Struct({
    ReadinessCheckName: S.String.pipe(T.HttpLabel("ReadinessCheckName")),
    ResourceSetName: S.String.pipe(T.JsonName("resourceSetName")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/readinesschecks/{ReadinessCheckName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateReadinessCheckRequest",
}) as any as S.Schema<UpdateReadinessCheckRequest>;
export interface UpdateRecoveryGroupRequest {
  Cells: __listOf__string;
  RecoveryGroupName: string;
}
export const UpdateRecoveryGroupRequest = S.suspend(() =>
  S.Struct({
    Cells: __listOf__string.pipe(T.JsonName("cells")),
    RecoveryGroupName: S.String.pipe(T.HttpLabel("RecoveryGroupName")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/recoverygroups/{RecoveryGroupName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRecoveryGroupRequest",
}) as any as S.Schema<UpdateRecoveryGroupRequest>;
export interface NLBResource {
  Arn?: string;
}
export const NLBResource = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String).pipe(T.JsonName("arn")) }),
).annotations({ identifier: "NLBResource" }) as any as S.Schema<NLBResource>;
export interface R53ResourceRecord {
  DomainName?: string;
  RecordSetId?: string;
}
export const R53ResourceRecord = S.suspend(() =>
  S.Struct({
    DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
    RecordSetId: S.optional(S.String).pipe(T.JsonName("recordSetId")),
  }),
).annotations({
  identifier: "R53ResourceRecord",
}) as any as S.Schema<R53ResourceRecord>;
export interface TargetResource {
  NLBResource?: NLBResource;
  R53Resource?: R53ResourceRecord;
}
export const TargetResource = S.suspend(() =>
  S.Struct({
    NLBResource: S.optional(NLBResource)
      .pipe(T.JsonName("nLBResource"))
      .annotations({ identifier: "NLBResource" }),
    R53Resource: S.optional(R53ResourceRecord)
      .pipe(T.JsonName("r53Resource"))
      .annotations({ identifier: "R53ResourceRecord" }),
  }),
).annotations({
  identifier: "TargetResource",
}) as any as S.Schema<TargetResource>;
export interface DNSTargetResource {
  DomainName?: string;
  HostedZoneArn?: string;
  RecordSetId?: string;
  RecordType?: string;
  TargetResource?: TargetResource;
}
export const DNSTargetResource = S.suspend(() =>
  S.Struct({
    DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
    HostedZoneArn: S.optional(S.String).pipe(T.JsonName("hostedZoneArn")),
    RecordSetId: S.optional(S.String).pipe(T.JsonName("recordSetId")),
    RecordType: S.optional(S.String).pipe(T.JsonName("recordType")),
    TargetResource: S.optional(TargetResource)
      .pipe(T.JsonName("targetResource"))
      .annotations({ identifier: "TargetResource" }),
  }),
).annotations({
  identifier: "DNSTargetResource",
}) as any as S.Schema<DNSTargetResource>;
export interface Resource {
  ComponentId?: string;
  DnsTargetResource?: DNSTargetResource;
  ReadinessScopes?: __listOf__string;
  ResourceArn?: string;
}
export const Resource = S.suspend(() =>
  S.Struct({
    ComponentId: S.optional(S.String).pipe(T.JsonName("componentId")),
    DnsTargetResource: S.optional(DNSTargetResource)
      .pipe(T.JsonName("dnsTargetResource"))
      .annotations({ identifier: "DNSTargetResource" }),
    ReadinessScopes: S.optional(__listOf__string).pipe(
      T.JsonName("readinessScopes"),
    ),
    ResourceArn: S.optional(S.String).pipe(T.JsonName("resourceArn")),
  }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export type __listOfResource = Resource[];
export const __listOfResource = S.Array(Resource);
export interface UpdateResourceSetRequest {
  ResourceSetName: string;
  ResourceSetType: string;
  Resources: __listOfResource;
}
export const UpdateResourceSetRequest = S.suspend(() =>
  S.Struct({
    ResourceSetName: S.String.pipe(T.HttpLabel("ResourceSetName")),
    ResourceSetType: S.String.pipe(T.JsonName("resourceSetType")),
    Resources: __listOfResource.pipe(T.JsonName("resources")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/resourcesets/{ResourceSetName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateResourceSetRequest",
}) as any as S.Schema<UpdateResourceSetRequest>;
export type __listOfCrossAccountAuthorization = string[];
export const __listOfCrossAccountAuthorization = S.Array(S.String);
export interface CreateCellRequest {
  CellName: string;
  Cells?: __listOf__string;
  Tags?: Tags;
}
export const CreateCellRequest = S.suspend(() =>
  S.Struct({
    CellName: S.String.pipe(T.JsonName("cellName")),
    Cells: S.optional(__listOf__string).pipe(T.JsonName("cells")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/cells" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCellRequest",
}) as any as S.Schema<CreateCellRequest>;
export interface CreateCrossAccountAuthorizationResponse {
  CrossAccountAuthorization?: string;
}
export const CreateCrossAccountAuthorizationResponse = S.suspend(() =>
  S.Struct({
    CrossAccountAuthorization: S.optional(S.String).pipe(
      T.JsonName("crossAccountAuthorization"),
    ),
  }),
).annotations({
  identifier: "CreateCrossAccountAuthorizationResponse",
}) as any as S.Schema<CreateCrossAccountAuthorizationResponse>;
export interface CreateReadinessCheckResponse {
  ReadinessCheckArn?: string;
  ReadinessCheckName?: string;
  ResourceSet?: string;
  Tags?: Tags;
}
export const CreateReadinessCheckResponse = S.suspend(() =>
  S.Struct({
    ReadinessCheckArn: S.optional(S.String).pipe(
      T.JsonName("readinessCheckArn"),
    ),
    ReadinessCheckName: S.optional(S.String).pipe(
      T.JsonName("readinessCheckName"),
    ),
    ResourceSet: S.optional(S.String).pipe(T.JsonName("resourceSet")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreateReadinessCheckResponse",
}) as any as S.Schema<CreateReadinessCheckResponse>;
export interface CreateRecoveryGroupResponse {
  Cells?: __listOf__string;
  RecoveryGroupArn?: string;
  RecoveryGroupName?: string;
  Tags?: Tags;
}
export const CreateRecoveryGroupResponse = S.suspend(() =>
  S.Struct({
    Cells: S.optional(__listOf__string).pipe(T.JsonName("cells")),
    RecoveryGroupArn: S.optional(S.String).pipe(T.JsonName("recoveryGroupArn")),
    RecoveryGroupName: S.optional(S.String).pipe(
      T.JsonName("recoveryGroupName"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreateRecoveryGroupResponse",
}) as any as S.Schema<CreateRecoveryGroupResponse>;
export interface GetCellResponse {
  CellArn?: string;
  CellName?: string;
  Cells?: __listOf__string;
  ParentReadinessScopes?: __listOf__string;
  Tags?: Tags;
}
export const GetCellResponse = S.suspend(() =>
  S.Struct({
    CellArn: S.optional(S.String).pipe(T.JsonName("cellArn")),
    CellName: S.optional(S.String).pipe(T.JsonName("cellName")),
    Cells: S.optional(__listOf__string).pipe(T.JsonName("cells")),
    ParentReadinessScopes: S.optional(__listOf__string).pipe(
      T.JsonName("parentReadinessScopes"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "GetCellResponse",
}) as any as S.Schema<GetCellResponse>;
export interface GetReadinessCheckResponse {
  ReadinessCheckArn?: string;
  ReadinessCheckName?: string;
  ResourceSet?: string;
  Tags?: Tags;
}
export const GetReadinessCheckResponse = S.suspend(() =>
  S.Struct({
    ReadinessCheckArn: S.optional(S.String).pipe(
      T.JsonName("readinessCheckArn"),
    ),
    ReadinessCheckName: S.optional(S.String).pipe(
      T.JsonName("readinessCheckName"),
    ),
    ResourceSet: S.optional(S.String).pipe(T.JsonName("resourceSet")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "GetReadinessCheckResponse",
}) as any as S.Schema<GetReadinessCheckResponse>;
export interface GetRecoveryGroupResponse {
  Cells?: __listOf__string;
  RecoveryGroupArn?: string;
  RecoveryGroupName?: string;
  Tags?: Tags;
}
export const GetRecoveryGroupResponse = S.suspend(() =>
  S.Struct({
    Cells: S.optional(__listOf__string).pipe(T.JsonName("cells")),
    RecoveryGroupArn: S.optional(S.String).pipe(T.JsonName("recoveryGroupArn")),
    RecoveryGroupName: S.optional(S.String).pipe(
      T.JsonName("recoveryGroupName"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "GetRecoveryGroupResponse",
}) as any as S.Schema<GetRecoveryGroupResponse>;
export interface ReadinessCheckSummary {
  Readiness?: string;
  ReadinessCheckName?: string;
}
export const ReadinessCheckSummary = S.suspend(() =>
  S.Struct({
    Readiness: S.optional(S.String).pipe(T.JsonName("readiness")),
    ReadinessCheckName: S.optional(S.String).pipe(
      T.JsonName("readinessCheckName"),
    ),
  }),
).annotations({
  identifier: "ReadinessCheckSummary",
}) as any as S.Schema<ReadinessCheckSummary>;
export type __listOfReadinessCheckSummary = ReadinessCheckSummary[];
export const __listOfReadinessCheckSummary = S.Array(ReadinessCheckSummary);
export interface GetRecoveryGroupReadinessSummaryResponse {
  NextToken?: string;
  Readiness?: string;
  ReadinessChecks?: __listOfReadinessCheckSummary;
}
export const GetRecoveryGroupReadinessSummaryResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Readiness: S.optional(S.String).pipe(T.JsonName("readiness")),
    ReadinessChecks: S.optional(__listOfReadinessCheckSummary).pipe(
      T.JsonName("readinessChecks"),
    ),
  }),
).annotations({
  identifier: "GetRecoveryGroupReadinessSummaryResponse",
}) as any as S.Schema<GetRecoveryGroupReadinessSummaryResponse>;
export interface GetResourceSetResponse {
  ResourceSetArn?: string;
  ResourceSetName?: string;
  ResourceSetType?: string;
  Resources?: __listOfResource;
  Tags?: Tags;
}
export const GetResourceSetResponse = S.suspend(() =>
  S.Struct({
    ResourceSetArn: S.optional(S.String).pipe(T.JsonName("resourceSetArn")),
    ResourceSetName: S.optional(S.String).pipe(T.JsonName("resourceSetName")),
    ResourceSetType: S.optional(S.String).pipe(T.JsonName("resourceSetType")),
    Resources: S.optional(__listOfResource).pipe(T.JsonName("resources")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "GetResourceSetResponse",
}) as any as S.Schema<GetResourceSetResponse>;
export interface ListCrossAccountAuthorizationsResponse {
  CrossAccountAuthorizations?: __listOfCrossAccountAuthorization;
  NextToken?: string;
}
export const ListCrossAccountAuthorizationsResponse = S.suspend(() =>
  S.Struct({
    CrossAccountAuthorizations: S.optional(
      __listOfCrossAccountAuthorization,
    ).pipe(T.JsonName("crossAccountAuthorizations")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListCrossAccountAuthorizationsResponse",
}) as any as S.Schema<ListCrossAccountAuthorizationsResponse>;
export interface ListTagsForResourcesResponse {
  Tags?: Tags;
}
export const ListTagsForResourcesResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags).pipe(T.JsonName("tags")) }),
).annotations({
  identifier: "ListTagsForResourcesResponse",
}) as any as S.Schema<ListTagsForResourcesResponse>;
export interface UpdateCellResponse {
  CellArn?: string;
  CellName?: string;
  Cells?: __listOf__string;
  ParentReadinessScopes?: __listOf__string;
  Tags?: Tags;
}
export const UpdateCellResponse = S.suspend(() =>
  S.Struct({
    CellArn: S.optional(S.String).pipe(T.JsonName("cellArn")),
    CellName: S.optional(S.String).pipe(T.JsonName("cellName")),
    Cells: S.optional(__listOf__string).pipe(T.JsonName("cells")),
    ParentReadinessScopes: S.optional(__listOf__string).pipe(
      T.JsonName("parentReadinessScopes"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "UpdateCellResponse",
}) as any as S.Schema<UpdateCellResponse>;
export interface UpdateReadinessCheckResponse {
  ReadinessCheckArn?: string;
  ReadinessCheckName?: string;
  ResourceSet?: string;
  Tags?: Tags;
}
export const UpdateReadinessCheckResponse = S.suspend(() =>
  S.Struct({
    ReadinessCheckArn: S.optional(S.String).pipe(
      T.JsonName("readinessCheckArn"),
    ),
    ReadinessCheckName: S.optional(S.String).pipe(
      T.JsonName("readinessCheckName"),
    ),
    ResourceSet: S.optional(S.String).pipe(T.JsonName("resourceSet")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "UpdateReadinessCheckResponse",
}) as any as S.Schema<UpdateReadinessCheckResponse>;
export interface UpdateRecoveryGroupResponse {
  Cells?: __listOf__string;
  RecoveryGroupArn?: string;
  RecoveryGroupName?: string;
  Tags?: Tags;
}
export const UpdateRecoveryGroupResponse = S.suspend(() =>
  S.Struct({
    Cells: S.optional(__listOf__string).pipe(T.JsonName("cells")),
    RecoveryGroupArn: S.optional(S.String).pipe(T.JsonName("recoveryGroupArn")),
    RecoveryGroupName: S.optional(S.String).pipe(
      T.JsonName("recoveryGroupName"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "UpdateRecoveryGroupResponse",
}) as any as S.Schema<UpdateRecoveryGroupResponse>;
export interface UpdateResourceSetResponse {
  ResourceSetArn?: string;
  ResourceSetName?: string;
  ResourceSetType?: string;
  Resources?: __listOfResource;
  Tags?: Tags;
}
export const UpdateResourceSetResponse = S.suspend(() =>
  S.Struct({
    ResourceSetArn: S.optional(S.String).pipe(T.JsonName("resourceSetArn")),
    ResourceSetName: S.optional(S.String).pipe(T.JsonName("resourceSetName")),
    ResourceSetType: S.optional(S.String).pipe(T.JsonName("resourceSetType")),
    Resources: S.optional(__listOfResource).pipe(T.JsonName("resources")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "UpdateResourceSetResponse",
}) as any as S.Schema<UpdateResourceSetResponse>;
export interface Recommendation {
  RecommendationText: string;
}
export const Recommendation = S.suspend(() =>
  S.Struct({
    RecommendationText: S.String.pipe(T.JsonName("recommendationText")),
  }),
).annotations({
  identifier: "Recommendation",
}) as any as S.Schema<Recommendation>;
export type __listOfRecommendation = Recommendation[];
export const __listOfRecommendation = S.Array(Recommendation);
export interface Message {
  MessageText?: string;
}
export const Message = S.suspend(() =>
  S.Struct({
    MessageText: S.optional(S.String).pipe(T.JsonName("messageText")),
  }),
).annotations({ identifier: "Message" }) as any as S.Schema<Message>;
export type __listOfMessage = Message[];
export const __listOfMessage = S.Array(Message);
export interface RuleResult {
  LastCheckedTimestamp: Date;
  Messages: __listOfMessage;
  Readiness: string;
  RuleId: string;
}
export const RuleResult = S.suspend(() =>
  S.Struct({
    LastCheckedTimestamp: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.JsonName("lastCheckedTimestamp"),
    ),
    Messages: __listOfMessage.pipe(T.JsonName("messages")),
    Readiness: S.String.pipe(T.JsonName("readiness")),
    RuleId: S.String.pipe(T.JsonName("ruleId")),
  }),
).annotations({ identifier: "RuleResult" }) as any as S.Schema<RuleResult>;
export type __listOfRuleResult = RuleResult[];
export const __listOfRuleResult = S.Array(RuleResult);
export interface ResourceResult {
  ComponentId?: string;
  LastCheckedTimestamp: Date;
  Readiness: string;
  ResourceArn?: string;
}
export const ResourceResult = S.suspend(() =>
  S.Struct({
    ComponentId: S.optional(S.String).pipe(T.JsonName("componentId")),
    LastCheckedTimestamp: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.JsonName("lastCheckedTimestamp"),
    ),
    Readiness: S.String.pipe(T.JsonName("readiness")),
    ResourceArn: S.optional(S.String).pipe(T.JsonName("resourceArn")),
  }),
).annotations({
  identifier: "ResourceResult",
}) as any as S.Schema<ResourceResult>;
export type __listOfResourceResult = ResourceResult[];
export const __listOfResourceResult = S.Array(ResourceResult);
export interface CellOutput {
  CellArn: string;
  CellName: string;
  Cells: __listOf__string;
  ParentReadinessScopes: __listOf__string;
  Tags?: Tags;
}
export const CellOutput = S.suspend(() =>
  S.Struct({
    CellArn: S.String.pipe(T.JsonName("cellArn")),
    CellName: S.String.pipe(T.JsonName("cellName")),
    Cells: __listOf__string.pipe(T.JsonName("cells")),
    ParentReadinessScopes: __listOf__string.pipe(
      T.JsonName("parentReadinessScopes"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({ identifier: "CellOutput" }) as any as S.Schema<CellOutput>;
export type __listOfCellOutput = CellOutput[];
export const __listOfCellOutput = S.Array(CellOutput);
export interface ReadinessCheckOutput {
  ReadinessCheckArn: string;
  ReadinessCheckName?: string;
  ResourceSet: string;
  Tags?: Tags;
}
export const ReadinessCheckOutput = S.suspend(() =>
  S.Struct({
    ReadinessCheckArn: S.String.pipe(T.JsonName("readinessCheckArn")),
    ReadinessCheckName: S.optional(S.String).pipe(
      T.JsonName("readinessCheckName"),
    ),
    ResourceSet: S.String.pipe(T.JsonName("resourceSet")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "ReadinessCheckOutput",
}) as any as S.Schema<ReadinessCheckOutput>;
export type __listOfReadinessCheckOutput = ReadinessCheckOutput[];
export const __listOfReadinessCheckOutput = S.Array(ReadinessCheckOutput);
export interface RecoveryGroupOutput {
  Cells: __listOf__string;
  RecoveryGroupArn: string;
  RecoveryGroupName: string;
  Tags?: Tags;
}
export const RecoveryGroupOutput = S.suspend(() =>
  S.Struct({
    Cells: __listOf__string.pipe(T.JsonName("cells")),
    RecoveryGroupArn: S.String.pipe(T.JsonName("recoveryGroupArn")),
    RecoveryGroupName: S.String.pipe(T.JsonName("recoveryGroupName")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "RecoveryGroupOutput",
}) as any as S.Schema<RecoveryGroupOutput>;
export type __listOfRecoveryGroupOutput = RecoveryGroupOutput[];
export const __listOfRecoveryGroupOutput = S.Array(RecoveryGroupOutput);
export interface ResourceSetOutput {
  ResourceSetArn: string;
  ResourceSetName: string;
  ResourceSetType: string;
  Resources: __listOfResource;
  Tags?: Tags;
}
export const ResourceSetOutput = S.suspend(() =>
  S.Struct({
    ResourceSetArn: S.String.pipe(T.JsonName("resourceSetArn")),
    ResourceSetName: S.String.pipe(T.JsonName("resourceSetName")),
    ResourceSetType: S.String.pipe(T.JsonName("resourceSetType")),
    Resources: __listOfResource.pipe(T.JsonName("resources")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "ResourceSetOutput",
}) as any as S.Schema<ResourceSetOutput>;
export type __listOfResourceSetOutput = ResourceSetOutput[];
export const __listOfResourceSetOutput = S.Array(ResourceSetOutput);
export interface ListRulesOutput {
  ResourceType: string;
  RuleDescription: string;
  RuleId: string;
}
export const ListRulesOutput = S.suspend(() =>
  S.Struct({
    ResourceType: S.String.pipe(T.JsonName("resourceType")),
    RuleDescription: S.String.pipe(T.JsonName("ruleDescription")),
    RuleId: S.String.pipe(T.JsonName("ruleId")),
  }),
).annotations({
  identifier: "ListRulesOutput",
}) as any as S.Schema<ListRulesOutput>;
export type __listOfListRulesOutput = ListRulesOutput[];
export const __listOfListRulesOutput = S.Array(ListRulesOutput);
export interface CreateCellResponse {
  CellArn?: string;
  CellName?: string;
  Cells?: __listOf__string;
  ParentReadinessScopes?: __listOf__string;
  Tags?: Tags;
}
export const CreateCellResponse = S.suspend(() =>
  S.Struct({
    CellArn: S.optional(S.String).pipe(T.JsonName("cellArn")),
    CellName: S.optional(S.String).pipe(T.JsonName("cellName")),
    Cells: S.optional(__listOf__string).pipe(T.JsonName("cells")),
    ParentReadinessScopes: S.optional(__listOf__string).pipe(
      T.JsonName("parentReadinessScopes"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreateCellResponse",
}) as any as S.Schema<CreateCellResponse>;
export interface GetArchitectureRecommendationsResponse {
  LastAuditTimestamp?: Date;
  NextToken?: string;
  Recommendations?: __listOfRecommendation;
}
export const GetArchitectureRecommendationsResponse = S.suspend(() =>
  S.Struct({
    LastAuditTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("lastAuditTimestamp")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Recommendations: S.optional(__listOfRecommendation).pipe(
      T.JsonName("recommendations"),
    ),
  }),
).annotations({
  identifier: "GetArchitectureRecommendationsResponse",
}) as any as S.Schema<GetArchitectureRecommendationsResponse>;
export interface GetCellReadinessSummaryResponse {
  NextToken?: string;
  Readiness?: string;
  ReadinessChecks?: __listOfReadinessCheckSummary;
}
export const GetCellReadinessSummaryResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Readiness: S.optional(S.String).pipe(T.JsonName("readiness")),
    ReadinessChecks: S.optional(__listOfReadinessCheckSummary).pipe(
      T.JsonName("readinessChecks"),
    ),
  }),
).annotations({
  identifier: "GetCellReadinessSummaryResponse",
}) as any as S.Schema<GetCellReadinessSummaryResponse>;
export interface GetReadinessCheckResourceStatusResponse {
  NextToken?: string;
  Readiness?: string;
  Rules?: __listOfRuleResult;
}
export const GetReadinessCheckResourceStatusResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Readiness: S.optional(S.String).pipe(T.JsonName("readiness")),
    Rules: S.optional(__listOfRuleResult).pipe(T.JsonName("rules")),
  }),
).annotations({
  identifier: "GetReadinessCheckResourceStatusResponse",
}) as any as S.Schema<GetReadinessCheckResourceStatusResponse>;
export interface GetReadinessCheckStatusResponse {
  Messages?: __listOfMessage;
  NextToken?: string;
  Readiness?: string;
  Resources?: __listOfResourceResult;
}
export const GetReadinessCheckStatusResponse = S.suspend(() =>
  S.Struct({
    Messages: S.optional(__listOfMessage).pipe(T.JsonName("messages")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Readiness: S.optional(S.String).pipe(T.JsonName("readiness")),
    Resources: S.optional(__listOfResourceResult).pipe(T.JsonName("resources")),
  }),
).annotations({
  identifier: "GetReadinessCheckStatusResponse",
}) as any as S.Schema<GetReadinessCheckStatusResponse>;
export interface ListCellsResponse {
  Cells?: __listOfCellOutput;
  NextToken?: string;
}
export const ListCellsResponse = S.suspend(() =>
  S.Struct({
    Cells: S.optional(__listOfCellOutput).pipe(T.JsonName("cells")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListCellsResponse",
}) as any as S.Schema<ListCellsResponse>;
export interface ListReadinessChecksResponse {
  NextToken?: string;
  ReadinessChecks?: __listOfReadinessCheckOutput;
}
export const ListReadinessChecksResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    ReadinessChecks: S.optional(__listOfReadinessCheckOutput).pipe(
      T.JsonName("readinessChecks"),
    ),
  }),
).annotations({
  identifier: "ListReadinessChecksResponse",
}) as any as S.Schema<ListReadinessChecksResponse>;
export interface ListRecoveryGroupsResponse {
  NextToken?: string;
  RecoveryGroups?: __listOfRecoveryGroupOutput;
}
export const ListRecoveryGroupsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    RecoveryGroups: S.optional(__listOfRecoveryGroupOutput).pipe(
      T.JsonName("recoveryGroups"),
    ),
  }),
).annotations({
  identifier: "ListRecoveryGroupsResponse",
}) as any as S.Schema<ListRecoveryGroupsResponse>;
export interface ListResourceSetsResponse {
  NextToken?: string;
  ResourceSets?: __listOfResourceSetOutput;
}
export const ListResourceSetsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    ResourceSets: S.optional(__listOfResourceSetOutput).pipe(
      T.JsonName("resourceSets"),
    ),
  }),
).annotations({
  identifier: "ListResourceSetsResponse",
}) as any as S.Schema<ListResourceSetsResponse>;
export interface ListRulesResponse {
  NextToken?: string;
  Rules?: __listOfListRulesOutput;
}
export const ListRulesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Rules: S.optional(__listOfListRulesOutput).pipe(T.JsonName("rules")),
  }),
).annotations({
  identifier: "ListRulesResponse",
}) as any as S.Schema<ListRulesResponse>;
export interface CreateResourceSetRequest {
  ResourceSetName: string;
  ResourceSetType: string;
  Resources: __listOfResource;
  Tags?: Tags;
}
export const CreateResourceSetRequest = S.suspend(() =>
  S.Struct({
    ResourceSetName: S.String.pipe(T.JsonName("resourceSetName")),
    ResourceSetType: S.String.pipe(T.JsonName("resourceSetType")),
    Resources: __listOfResource.pipe(T.JsonName("resources")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/resourcesets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateResourceSetRequest",
}) as any as S.Schema<CreateResourceSetRequest>;
export interface CreateResourceSetResponse {
  ResourceSetArn?: string;
  ResourceSetName?: string;
  ResourceSetType?: string;
  Resources?: __listOfResource;
  Tags?: Tags;
}
export const CreateResourceSetResponse = S.suspend(() =>
  S.Struct({
    ResourceSetArn: S.optional(S.String).pipe(T.JsonName("resourceSetArn")),
    ResourceSetName: S.optional(S.String).pipe(T.JsonName("resourceSetName")),
    ResourceSetType: S.optional(S.String).pipe(T.JsonName("resourceSetType")),
    Resources: S.optional(__listOfResource).pipe(T.JsonName("resources")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreateResourceSetResponse",
}) as any as S.Schema<CreateResourceSetResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withThrottlingError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withConflictError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Adds a tag to a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes cross account readiness authorization.
 */
export const deleteCrossAccountAuthorization: (
  input: DeleteCrossAccountAuthorizationRequest,
) => Effect.Effect<
  DeleteCrossAccountAuthorizationResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCrossAccountAuthorizationRequest,
  output: DeleteCrossAccountAuthorizationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a cross-account readiness authorization. This lets you authorize another account to work with Route 53 Application Recovery Controller, for example, to check the readiness status of resources in a separate account.
 */
export const createCrossAccountAuthorization: (
  input: CreateCrossAccountAuthorizationRequest,
) => Effect.Effect<
  CreateCrossAccountAuthorizationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCrossAccountAuthorizationRequest,
  output: CreateCrossAccountAuthorizationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a cell to replace the list of nested cells with a new list of nested cells.
 */
export const updateCell: (
  input: UpdateCellRequest,
) => Effect.Effect<
  UpdateCellResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCellRequest,
  output: UpdateCellResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a readiness check.
 */
export const updateReadinessCheck: (
  input: UpdateReadinessCheckRequest,
) => Effect.Effect<
  UpdateReadinessCheckResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateReadinessCheckRequest,
  output: UpdateReadinessCheckResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a recovery group.
 */
export const updateRecoveryGroup: (
  input: UpdateRecoveryGroupRequest,
) => Effect.Effect<
  UpdateRecoveryGroupResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRecoveryGroupRequest,
  output: UpdateRecoveryGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a resource set.
 */
export const updateResourceSet: (
  input: UpdateResourceSetRequest,
) => Effect.Effect<
  UpdateResourceSetResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResourceSetRequest,
  output: UpdateResourceSetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a readiness check.
 */
export const deleteReadinessCheck: (
  input: DeleteReadinessCheckRequest,
) => Effect.Effect<
  DeleteReadinessCheckResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReadinessCheckRequest,
  output: DeleteReadinessCheckResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a recovery group.
 */
export const deleteRecoveryGroup: (
  input: DeleteRecoveryGroupRequest,
) => Effect.Effect<
  DeleteRecoveryGroupResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRecoveryGroupRequest,
  output: DeleteRecoveryGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a resource set.
 */
export const deleteResourceSet: (
  input: DeleteResourceSetRequest,
) => Effect.Effect<
  DeleteResourceSetResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourceSetRequest,
  output: DeleteResourceSetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a tag from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Delete a cell. When successful, the response code is 204, with no response body.
 */
export const deleteCell: (
  input: DeleteCellRequest,
) => Effect.Effect<
  DeleteCellResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCellRequest,
  output: DeleteCellResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a cell including cell name, cell Amazon Resource Name (ARN), ARNs of nested cells for this cell, and a list of those cell ARNs with their associated recovery group ARNs.
 */
export const getCell: (
  input: GetCellRequest,
) => Effect.Effect<
  GetCellResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCellRequest,
  output: GetCellResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets details about a readiness check.
 */
export const getReadinessCheck: (
  input: GetReadinessCheckRequest,
) => Effect.Effect<
  GetReadinessCheckResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReadinessCheckRequest,
  output: GetReadinessCheckResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets details about a recovery group, including a list of the cells that are included in it.
 */
export const getRecoveryGroup: (
  input: GetRecoveryGroupRequest,
) => Effect.Effect<
  GetRecoveryGroupResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRecoveryGroupRequest,
  output: GetRecoveryGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Displays a summary of information about a recovery group's readiness status. Includes the readiness checks for resources in the recovery group and the readiness status of each one.
 */
export const getRecoveryGroupReadinessSummary: {
  (
    input: GetRecoveryGroupReadinessSummaryRequest,
  ): Effect.Effect<
    GetRecoveryGroupReadinessSummaryResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetRecoveryGroupReadinessSummaryRequest,
  ) => Stream.Stream<
    GetRecoveryGroupReadinessSummaryResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetRecoveryGroupReadinessSummaryRequest,
  ) => Stream.Stream<
    ReadinessCheckSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetRecoveryGroupReadinessSummaryRequest,
  output: GetRecoveryGroupReadinessSummaryResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ReadinessChecks",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Displays the details about a resource set, including a list of the resources in the set.
 */
export const getResourceSet: (
  input: GetResourceSetRequest,
) => Effect.Effect<
  GetResourceSetResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceSetRequest,
  output: GetResourceSetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the tags for a resource.
 */
export const listTagsForResources: (
  input: ListTagsForResourcesRequest,
) => Effect.Effect<
  ListTagsForResourcesResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourcesRequest,
  output: ListTagsForResourcesResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets recommendations about architecture designs for improving resiliency for an application, based on a recovery group.
 */
export const getArchitectureRecommendations: (
  input: GetArchitectureRecommendationsRequest,
) => Effect.Effect<
  GetArchitectureRecommendationsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetArchitectureRecommendationsRequest,
  output: GetArchitectureRecommendationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets readiness for a cell. Aggregates the readiness of all the resources that are associated with the cell into a single value.
 */
export const getCellReadinessSummary: {
  (
    input: GetCellReadinessSummaryRequest,
  ): Effect.Effect<
    GetCellReadinessSummaryResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetCellReadinessSummaryRequest,
  ) => Stream.Stream<
    GetCellReadinessSummaryResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetCellReadinessSummaryRequest,
  ) => Stream.Stream<
    ReadinessCheckSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetCellReadinessSummaryRequest,
  output: GetCellReadinessSummaryResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ReadinessChecks",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Gets individual readiness status for a readiness check. To see the overall readiness status for a recovery group, that considers the readiness status for all the readiness checks in the recovery group, use GetRecoveryGroupReadinessSummary.
 */
export const getReadinessCheckResourceStatus: {
  (
    input: GetReadinessCheckResourceStatusRequest,
  ): Effect.Effect<
    GetReadinessCheckResourceStatusResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetReadinessCheckResourceStatusRequest,
  ) => Stream.Stream<
    GetReadinessCheckResourceStatusResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetReadinessCheckResourceStatusRequest,
  ) => Stream.Stream<
    RuleResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetReadinessCheckResourceStatusRequest,
  output: GetReadinessCheckResourceStatusResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Rules",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Gets the readiness status for an individual readiness check. To see the overall readiness status for a recovery group, that considers the readiness status for all the readiness checks in a recovery group, use GetRecoveryGroupReadinessSummary.
 */
export const getReadinessCheckStatus: {
  (
    input: GetReadinessCheckStatusRequest,
  ): Effect.Effect<
    GetReadinessCheckStatusResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetReadinessCheckStatusRequest,
  ) => Stream.Stream<
    GetReadinessCheckStatusResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetReadinessCheckStatusRequest,
  ) => Stream.Stream<
    ResourceResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetReadinessCheckStatusRequest,
  output: GetReadinessCheckStatusResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Resources",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the cross-account readiness authorizations that are in place for an account.
 */
export const listCrossAccountAuthorizations: {
  (
    input: ListCrossAccountAuthorizationsRequest,
  ): Effect.Effect<
    ListCrossAccountAuthorizationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCrossAccountAuthorizationsRequest,
  ) => Stream.Stream<
    ListCrossAccountAuthorizationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCrossAccountAuthorizationsRequest,
  ) => Stream.Stream<
    CrossAccountAuthorization,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCrossAccountAuthorizationsRequest,
  output: ListCrossAccountAuthorizationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "CrossAccountAuthorizations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the cells for an account.
 */
export const listCells: {
  (
    input: ListCellsRequest,
  ): Effect.Effect<
    ListCellsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCellsRequest,
  ) => Stream.Stream<
    ListCellsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCellsRequest,
  ) => Stream.Stream<
    CellOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCellsRequest,
  output: ListCellsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Cells",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the readiness checks for an account.
 */
export const listReadinessChecks: {
  (
    input: ListReadinessChecksRequest,
  ): Effect.Effect<
    ListReadinessChecksResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReadinessChecksRequest,
  ) => Stream.Stream<
    ListReadinessChecksResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReadinessChecksRequest,
  ) => Stream.Stream<
    ReadinessCheckOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListReadinessChecksRequest,
  output: ListReadinessChecksResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ReadinessChecks",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the recovery groups in an account.
 */
export const listRecoveryGroups: {
  (
    input: ListRecoveryGroupsRequest,
  ): Effect.Effect<
    ListRecoveryGroupsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecoveryGroupsRequest,
  ) => Stream.Stream<
    ListRecoveryGroupsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecoveryGroupsRequest,
  ) => Stream.Stream<
    RecoveryGroupOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRecoveryGroupsRequest,
  output: ListRecoveryGroupsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RecoveryGroups",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the resource sets in an account.
 */
export const listResourceSets: {
  (
    input: ListResourceSetsRequest,
  ): Effect.Effect<
    ListResourceSetsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceSetsRequest,
  ) => Stream.Stream<
    ListResourceSetsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceSetsRequest,
  ) => Stream.Stream<
    ResourceSetOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceSetsRequest,
  output: ListResourceSetsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResourceSets",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all readiness rules, or lists the readiness rules for a specific resource type.
 */
export const listRules: {
  (
    input: ListRulesRequest,
  ): Effect.Effect<
    ListRulesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRulesRequest,
  ) => Stream.Stream<
    ListRulesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRulesRequest,
  ) => Stream.Stream<
    ListRulesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRulesRequest,
  output: ListRulesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Rules",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a readiness check in an account. A readiness check monitors a resource set in your application, such as a set of Amazon Aurora instances, that Application Recovery Controller is auditing recovery readiness for. The audits run once every minute on every resource that's associated with a readiness check.
 */
export const createReadinessCheck: (
  input: CreateReadinessCheckRequest,
) => Effect.Effect<
  CreateReadinessCheckResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateReadinessCheckRequest,
  output: CreateReadinessCheckResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a recovery group in an account. A recovery group corresponds to an application and includes a list of the cells that make up the application.
 */
export const createRecoveryGroup: (
  input: CreateRecoveryGroupRequest,
) => Effect.Effect<
  CreateRecoveryGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRecoveryGroupRequest,
  output: CreateRecoveryGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a cell in an account.
 */
export const createCell: (
  input: CreateCellRequest,
) => Effect.Effect<
  CreateCellResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCellRequest,
  output: CreateCellResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a resource set. A resource set is a set of resources of one type that span multiple cells. You can associate a resource set with a readiness check to monitor the resources for failover readiness.
 */
export const createResourceSet: (
  input: CreateResourceSetRequest,
) => Effect.Effect<
  CreateResourceSetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResourceSetRequest,
  output: CreateResourceSetResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));

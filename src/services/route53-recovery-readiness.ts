import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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

//# Schemas
export const __listOf__string = S.Array(S.String);
export class CreateCrossAccountAuthorizationRequest extends S.Class<CreateCrossAccountAuthorizationRequest>(
  "CreateCrossAccountAuthorizationRequest",
)(
  {
    CrossAccountAuthorization: S.String.pipe(
      T.JsonName("crossAccountAuthorization"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/crossaccountauthorizations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class CreateReadinessCheckRequest extends S.Class<CreateReadinessCheckRequest>(
  "CreateReadinessCheckRequest",
)(
  {
    ReadinessCheckName: S.String.pipe(T.JsonName("readinessCheckName")),
    ResourceSetName: S.String.pipe(T.JsonName("resourceSetName")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/readinesschecks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRecoveryGroupRequest extends S.Class<CreateRecoveryGroupRequest>(
  "CreateRecoveryGroupRequest",
)(
  {
    Cells: S.optional(__listOf__string).pipe(T.JsonName("cells")),
    RecoveryGroupName: S.String.pipe(T.JsonName("recoveryGroupName")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/recoverygroups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCellRequest extends S.Class<DeleteCellRequest>(
  "DeleteCellRequest",
)(
  { CellName: S.String.pipe(T.HttpLabel("CellName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/cells/{CellName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCellResponse extends S.Class<DeleteCellResponse>(
  "DeleteCellResponse",
)({}) {}
export class DeleteCrossAccountAuthorizationRequest extends S.Class<DeleteCrossAccountAuthorizationRequest>(
  "DeleteCrossAccountAuthorizationRequest",
)(
  {
    CrossAccountAuthorization: S.String.pipe(
      T.HttpLabel("CrossAccountAuthorization"),
    ),
  },
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
) {}
export class DeleteCrossAccountAuthorizationResponse extends S.Class<DeleteCrossAccountAuthorizationResponse>(
  "DeleteCrossAccountAuthorizationResponse",
)({}) {}
export class DeleteReadinessCheckRequest extends S.Class<DeleteReadinessCheckRequest>(
  "DeleteReadinessCheckRequest",
)(
  { ReadinessCheckName: S.String.pipe(T.HttpLabel("ReadinessCheckName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/readinesschecks/{ReadinessCheckName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteReadinessCheckResponse extends S.Class<DeleteReadinessCheckResponse>(
  "DeleteReadinessCheckResponse",
)({}) {}
export class DeleteRecoveryGroupRequest extends S.Class<DeleteRecoveryGroupRequest>(
  "DeleteRecoveryGroupRequest",
)(
  { RecoveryGroupName: S.String.pipe(T.HttpLabel("RecoveryGroupName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/recoverygroups/{RecoveryGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRecoveryGroupResponse extends S.Class<DeleteRecoveryGroupResponse>(
  "DeleteRecoveryGroupResponse",
)({}) {}
export class DeleteResourceSetRequest extends S.Class<DeleteResourceSetRequest>(
  "DeleteResourceSetRequest",
)(
  { ResourceSetName: S.String.pipe(T.HttpLabel("ResourceSetName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/resourcesets/{ResourceSetName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourceSetResponse extends S.Class<DeleteResourceSetResponse>(
  "DeleteResourceSetResponse",
)({}) {}
export class GetArchitectureRecommendationsRequest extends S.Class<GetArchitectureRecommendationsRequest>(
  "GetArchitectureRecommendationsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RecoveryGroupName: S.String.pipe(T.HttpLabel("RecoveryGroupName")),
  },
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
) {}
export class GetCellRequest extends S.Class<GetCellRequest>("GetCellRequest")(
  { CellName: S.String.pipe(T.HttpLabel("CellName")) },
  T.all(
    T.Http({ method: "GET", uri: "/cells/{CellName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCellReadinessSummaryRequest extends S.Class<GetCellReadinessSummaryRequest>(
  "GetCellReadinessSummaryRequest",
)(
  {
    CellName: S.String.pipe(T.HttpLabel("CellName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/cellreadiness/{CellName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetReadinessCheckRequest extends S.Class<GetReadinessCheckRequest>(
  "GetReadinessCheckRequest",
)(
  { ReadinessCheckName: S.String.pipe(T.HttpLabel("ReadinessCheckName")) },
  T.all(
    T.Http({ method: "GET", uri: "/readinesschecks/{ReadinessCheckName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetReadinessCheckResourceStatusRequest extends S.Class<GetReadinessCheckResourceStatusRequest>(
  "GetReadinessCheckResourceStatusRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ReadinessCheckName: S.String.pipe(T.HttpLabel("ReadinessCheckName")),
    ResourceIdentifier: S.String.pipe(T.HttpLabel("ResourceIdentifier")),
  },
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
) {}
export class GetReadinessCheckStatusRequest extends S.Class<GetReadinessCheckStatusRequest>(
  "GetReadinessCheckStatusRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ReadinessCheckName: S.String.pipe(T.HttpLabel("ReadinessCheckName")),
  },
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
) {}
export class GetRecoveryGroupRequest extends S.Class<GetRecoveryGroupRequest>(
  "GetRecoveryGroupRequest",
)(
  { RecoveryGroupName: S.String.pipe(T.HttpLabel("RecoveryGroupName")) },
  T.all(
    T.Http({ method: "GET", uri: "/recoverygroups/{RecoveryGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRecoveryGroupReadinessSummaryRequest extends S.Class<GetRecoveryGroupReadinessSummaryRequest>(
  "GetRecoveryGroupReadinessSummaryRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RecoveryGroupName: S.String.pipe(T.HttpLabel("RecoveryGroupName")),
  },
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
) {}
export class GetResourceSetRequest extends S.Class<GetResourceSetRequest>(
  "GetResourceSetRequest",
)(
  { ResourceSetName: S.String.pipe(T.HttpLabel("ResourceSetName")) },
  T.all(
    T.Http({ method: "GET", uri: "/resourcesets/{ResourceSetName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCellsRequest extends S.Class<ListCellsRequest>(
  "ListCellsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(T.Http({ method: "GET", uri: "/cells" }), svc, auth, proto, ver, rules),
) {}
export class ListCrossAccountAuthorizationsRequest extends S.Class<ListCrossAccountAuthorizationsRequest>(
  "ListCrossAccountAuthorizationsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/crossaccountauthorizations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListReadinessChecksRequest extends S.Class<ListReadinessChecksRequest>(
  "ListReadinessChecksRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/readinesschecks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRecoveryGroupsRequest extends S.Class<ListRecoveryGroupsRequest>(
  "ListRecoveryGroupsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/recoverygroups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListResourceSetsRequest extends S.Class<ListResourceSetsRequest>(
  "ListResourceSetsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/resourcesets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRulesRequest extends S.Class<ListRulesRequest>(
  "ListRulesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
  },
  T.all(T.Http({ method: "GET", uri: "/rules" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourcesRequest extends S.Class<ListTagsForResourcesRequest>(
  "ListTagsForResourcesRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: Tags.pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: __listOf__string.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateCellRequest extends S.Class<UpdateCellRequest>(
  "UpdateCellRequest",
)(
  {
    CellName: S.String.pipe(T.HttpLabel("CellName")),
    Cells: __listOf__string.pipe(T.JsonName("cells")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/cells/{CellName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateReadinessCheckRequest extends S.Class<UpdateReadinessCheckRequest>(
  "UpdateReadinessCheckRequest",
)(
  {
    ReadinessCheckName: S.String.pipe(T.HttpLabel("ReadinessCheckName")),
    ResourceSetName: S.String.pipe(T.JsonName("resourceSetName")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/readinesschecks/{ReadinessCheckName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRecoveryGroupRequest extends S.Class<UpdateRecoveryGroupRequest>(
  "UpdateRecoveryGroupRequest",
)(
  {
    Cells: __listOf__string.pipe(T.JsonName("cells")),
    RecoveryGroupName: S.String.pipe(T.HttpLabel("RecoveryGroupName")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/recoverygroups/{RecoveryGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class NLBResource extends S.Class<NLBResource>("NLBResource")({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
}) {}
export class R53ResourceRecord extends S.Class<R53ResourceRecord>(
  "R53ResourceRecord",
)({
  DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
  RecordSetId: S.optional(S.String).pipe(T.JsonName("recordSetId")),
}) {}
export class TargetResource extends S.Class<TargetResource>("TargetResource")({
  NLBResource: S.optional(NLBResource).pipe(T.JsonName("nLBResource")),
  R53Resource: S.optional(R53ResourceRecord).pipe(T.JsonName("r53Resource")),
}) {}
export class DNSTargetResource extends S.Class<DNSTargetResource>(
  "DNSTargetResource",
)({
  DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
  HostedZoneArn: S.optional(S.String).pipe(T.JsonName("hostedZoneArn")),
  RecordSetId: S.optional(S.String).pipe(T.JsonName("recordSetId")),
  RecordType: S.optional(S.String).pipe(T.JsonName("recordType")),
  TargetResource: S.optional(TargetResource).pipe(T.JsonName("targetResource")),
}) {}
export class Resource extends S.Class<Resource>("Resource")({
  ComponentId: S.optional(S.String).pipe(T.JsonName("componentId")),
  DnsTargetResource: S.optional(DNSTargetResource).pipe(
    T.JsonName("dnsTargetResource"),
  ),
  ReadinessScopes: S.optional(__listOf__string).pipe(
    T.JsonName("readinessScopes"),
  ),
  ResourceArn: S.optional(S.String).pipe(T.JsonName("resourceArn")),
}) {}
export const __listOfResource = S.Array(Resource);
export class UpdateResourceSetRequest extends S.Class<UpdateResourceSetRequest>(
  "UpdateResourceSetRequest",
)(
  {
    ResourceSetName: S.String.pipe(T.HttpLabel("ResourceSetName")),
    ResourceSetType: S.String.pipe(T.JsonName("resourceSetType")),
    Resources: __listOfResource.pipe(T.JsonName("resources")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/resourcesets/{ResourceSetName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const __listOfCrossAccountAuthorization = S.Array(S.String);
export class CreateCellRequest extends S.Class<CreateCellRequest>(
  "CreateCellRequest",
)(
  {
    CellName: S.String.pipe(T.JsonName("cellName")),
    Cells: S.optional(__listOf__string).pipe(T.JsonName("cells")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cells" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCrossAccountAuthorizationResponse extends S.Class<CreateCrossAccountAuthorizationResponse>(
  "CreateCrossAccountAuthorizationResponse",
)({
  CrossAccountAuthorization: S.optional(S.String).pipe(
    T.JsonName("crossAccountAuthorization"),
  ),
}) {}
export class CreateReadinessCheckResponse extends S.Class<CreateReadinessCheckResponse>(
  "CreateReadinessCheckResponse",
)({
  ReadinessCheckArn: S.optional(S.String).pipe(T.JsonName("readinessCheckArn")),
  ReadinessCheckName: S.optional(S.String).pipe(
    T.JsonName("readinessCheckName"),
  ),
  ResourceSet: S.optional(S.String).pipe(T.JsonName("resourceSet")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class CreateRecoveryGroupResponse extends S.Class<CreateRecoveryGroupResponse>(
  "CreateRecoveryGroupResponse",
)({
  Cells: S.optional(__listOf__string).pipe(T.JsonName("cells")),
  RecoveryGroupArn: S.optional(S.String).pipe(T.JsonName("recoveryGroupArn")),
  RecoveryGroupName: S.optional(S.String).pipe(T.JsonName("recoveryGroupName")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class GetCellResponse extends S.Class<GetCellResponse>(
  "GetCellResponse",
)({
  CellArn: S.optional(S.String).pipe(T.JsonName("cellArn")),
  CellName: S.optional(S.String).pipe(T.JsonName("cellName")),
  Cells: S.optional(__listOf__string).pipe(T.JsonName("cells")),
  ParentReadinessScopes: S.optional(__listOf__string).pipe(
    T.JsonName("parentReadinessScopes"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class GetReadinessCheckResponse extends S.Class<GetReadinessCheckResponse>(
  "GetReadinessCheckResponse",
)({
  ReadinessCheckArn: S.optional(S.String).pipe(T.JsonName("readinessCheckArn")),
  ReadinessCheckName: S.optional(S.String).pipe(
    T.JsonName("readinessCheckName"),
  ),
  ResourceSet: S.optional(S.String).pipe(T.JsonName("resourceSet")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class GetRecoveryGroupResponse extends S.Class<GetRecoveryGroupResponse>(
  "GetRecoveryGroupResponse",
)({
  Cells: S.optional(__listOf__string).pipe(T.JsonName("cells")),
  RecoveryGroupArn: S.optional(S.String).pipe(T.JsonName("recoveryGroupArn")),
  RecoveryGroupName: S.optional(S.String).pipe(T.JsonName("recoveryGroupName")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class ReadinessCheckSummary extends S.Class<ReadinessCheckSummary>(
  "ReadinessCheckSummary",
)({
  Readiness: S.optional(S.String).pipe(T.JsonName("readiness")),
  ReadinessCheckName: S.optional(S.String).pipe(
    T.JsonName("readinessCheckName"),
  ),
}) {}
export const __listOfReadinessCheckSummary = S.Array(ReadinessCheckSummary);
export class GetRecoveryGroupReadinessSummaryResponse extends S.Class<GetRecoveryGroupReadinessSummaryResponse>(
  "GetRecoveryGroupReadinessSummaryResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Readiness: S.optional(S.String).pipe(T.JsonName("readiness")),
  ReadinessChecks: S.optional(__listOfReadinessCheckSummary).pipe(
    T.JsonName("readinessChecks"),
  ),
}) {}
export class GetResourceSetResponse extends S.Class<GetResourceSetResponse>(
  "GetResourceSetResponse",
)({
  ResourceSetArn: S.optional(S.String).pipe(T.JsonName("resourceSetArn")),
  ResourceSetName: S.optional(S.String).pipe(T.JsonName("resourceSetName")),
  ResourceSetType: S.optional(S.String).pipe(T.JsonName("resourceSetType")),
  Resources: S.optional(__listOfResource).pipe(T.JsonName("resources")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class ListCrossAccountAuthorizationsResponse extends S.Class<ListCrossAccountAuthorizationsResponse>(
  "ListCrossAccountAuthorizationsResponse",
)({
  CrossAccountAuthorizations: S.optional(
    __listOfCrossAccountAuthorization,
  ).pipe(T.JsonName("crossAccountAuthorizations")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListTagsForResourcesResponse extends S.Class<ListTagsForResourcesResponse>(
  "ListTagsForResourcesResponse",
)({ Tags: S.optional(Tags).pipe(T.JsonName("tags")) }) {}
export class UpdateCellResponse extends S.Class<UpdateCellResponse>(
  "UpdateCellResponse",
)({
  CellArn: S.optional(S.String).pipe(T.JsonName("cellArn")),
  CellName: S.optional(S.String).pipe(T.JsonName("cellName")),
  Cells: S.optional(__listOf__string).pipe(T.JsonName("cells")),
  ParentReadinessScopes: S.optional(__listOf__string).pipe(
    T.JsonName("parentReadinessScopes"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class UpdateReadinessCheckResponse extends S.Class<UpdateReadinessCheckResponse>(
  "UpdateReadinessCheckResponse",
)({
  ReadinessCheckArn: S.optional(S.String).pipe(T.JsonName("readinessCheckArn")),
  ReadinessCheckName: S.optional(S.String).pipe(
    T.JsonName("readinessCheckName"),
  ),
  ResourceSet: S.optional(S.String).pipe(T.JsonName("resourceSet")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class UpdateRecoveryGroupResponse extends S.Class<UpdateRecoveryGroupResponse>(
  "UpdateRecoveryGroupResponse",
)({
  Cells: S.optional(__listOf__string).pipe(T.JsonName("cells")),
  RecoveryGroupArn: S.optional(S.String).pipe(T.JsonName("recoveryGroupArn")),
  RecoveryGroupName: S.optional(S.String).pipe(T.JsonName("recoveryGroupName")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class UpdateResourceSetResponse extends S.Class<UpdateResourceSetResponse>(
  "UpdateResourceSetResponse",
)({
  ResourceSetArn: S.optional(S.String).pipe(T.JsonName("resourceSetArn")),
  ResourceSetName: S.optional(S.String).pipe(T.JsonName("resourceSetName")),
  ResourceSetType: S.optional(S.String).pipe(T.JsonName("resourceSetType")),
  Resources: S.optional(__listOfResource).pipe(T.JsonName("resources")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class Recommendation extends S.Class<Recommendation>("Recommendation")({
  RecommendationText: S.String.pipe(T.JsonName("recommendationText")),
}) {}
export const __listOfRecommendation = S.Array(Recommendation);
export class Message extends S.Class<Message>("Message")({
  MessageText: S.optional(S.String).pipe(T.JsonName("messageText")),
}) {}
export const __listOfMessage = S.Array(Message);
export class RuleResult extends S.Class<RuleResult>("RuleResult")({
  LastCheckedTimestamp: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("lastCheckedTimestamp"),
  ),
  Messages: __listOfMessage.pipe(T.JsonName("messages")),
  Readiness: S.String.pipe(T.JsonName("readiness")),
  RuleId: S.String.pipe(T.JsonName("ruleId")),
}) {}
export const __listOfRuleResult = S.Array(RuleResult);
export class ResourceResult extends S.Class<ResourceResult>("ResourceResult")({
  ComponentId: S.optional(S.String).pipe(T.JsonName("componentId")),
  LastCheckedTimestamp: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("lastCheckedTimestamp"),
  ),
  Readiness: S.String.pipe(T.JsonName("readiness")),
  ResourceArn: S.optional(S.String).pipe(T.JsonName("resourceArn")),
}) {}
export const __listOfResourceResult = S.Array(ResourceResult);
export class CellOutput extends S.Class<CellOutput>("CellOutput")({
  CellArn: S.String.pipe(T.JsonName("cellArn")),
  CellName: S.String.pipe(T.JsonName("cellName")),
  Cells: __listOf__string.pipe(T.JsonName("cells")),
  ParentReadinessScopes: __listOf__string.pipe(
    T.JsonName("parentReadinessScopes"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export const __listOfCellOutput = S.Array(CellOutput);
export class ReadinessCheckOutput extends S.Class<ReadinessCheckOutput>(
  "ReadinessCheckOutput",
)({
  ReadinessCheckArn: S.String.pipe(T.JsonName("readinessCheckArn")),
  ReadinessCheckName: S.optional(S.String).pipe(
    T.JsonName("readinessCheckName"),
  ),
  ResourceSet: S.String.pipe(T.JsonName("resourceSet")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export const __listOfReadinessCheckOutput = S.Array(ReadinessCheckOutput);
export class RecoveryGroupOutput extends S.Class<RecoveryGroupOutput>(
  "RecoveryGroupOutput",
)({
  Cells: __listOf__string.pipe(T.JsonName("cells")),
  RecoveryGroupArn: S.String.pipe(T.JsonName("recoveryGroupArn")),
  RecoveryGroupName: S.String.pipe(T.JsonName("recoveryGroupName")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export const __listOfRecoveryGroupOutput = S.Array(RecoveryGroupOutput);
export class ResourceSetOutput extends S.Class<ResourceSetOutput>(
  "ResourceSetOutput",
)({
  ResourceSetArn: S.String.pipe(T.JsonName("resourceSetArn")),
  ResourceSetName: S.String.pipe(T.JsonName("resourceSetName")),
  ResourceSetType: S.String.pipe(T.JsonName("resourceSetType")),
  Resources: __listOfResource.pipe(T.JsonName("resources")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export const __listOfResourceSetOutput = S.Array(ResourceSetOutput);
export class ListRulesOutput extends S.Class<ListRulesOutput>(
  "ListRulesOutput",
)({
  ResourceType: S.String.pipe(T.JsonName("resourceType")),
  RuleDescription: S.String.pipe(T.JsonName("ruleDescription")),
  RuleId: S.String.pipe(T.JsonName("ruleId")),
}) {}
export const __listOfListRulesOutput = S.Array(ListRulesOutput);
export class CreateCellResponse extends S.Class<CreateCellResponse>(
  "CreateCellResponse",
)({
  CellArn: S.optional(S.String).pipe(T.JsonName("cellArn")),
  CellName: S.optional(S.String).pipe(T.JsonName("cellName")),
  Cells: S.optional(__listOf__string).pipe(T.JsonName("cells")),
  ParentReadinessScopes: S.optional(__listOf__string).pipe(
    T.JsonName("parentReadinessScopes"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class GetArchitectureRecommendationsResponse extends S.Class<GetArchitectureRecommendationsResponse>(
  "GetArchitectureRecommendationsResponse",
)({
  LastAuditTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ).pipe(T.JsonName("lastAuditTimestamp")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Recommendations: S.optional(__listOfRecommendation).pipe(
    T.JsonName("recommendations"),
  ),
}) {}
export class GetCellReadinessSummaryResponse extends S.Class<GetCellReadinessSummaryResponse>(
  "GetCellReadinessSummaryResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Readiness: S.optional(S.String).pipe(T.JsonName("readiness")),
  ReadinessChecks: S.optional(__listOfReadinessCheckSummary).pipe(
    T.JsonName("readinessChecks"),
  ),
}) {}
export class GetReadinessCheckResourceStatusResponse extends S.Class<GetReadinessCheckResourceStatusResponse>(
  "GetReadinessCheckResourceStatusResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Readiness: S.optional(S.String).pipe(T.JsonName("readiness")),
  Rules: S.optional(__listOfRuleResult).pipe(T.JsonName("rules")),
}) {}
export class GetReadinessCheckStatusResponse extends S.Class<GetReadinessCheckStatusResponse>(
  "GetReadinessCheckStatusResponse",
)({
  Messages: S.optional(__listOfMessage).pipe(T.JsonName("messages")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Readiness: S.optional(S.String).pipe(T.JsonName("readiness")),
  Resources: S.optional(__listOfResourceResult).pipe(T.JsonName("resources")),
}) {}
export class ListCellsResponse extends S.Class<ListCellsResponse>(
  "ListCellsResponse",
)({
  Cells: S.optional(__listOfCellOutput).pipe(T.JsonName("cells")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListReadinessChecksResponse extends S.Class<ListReadinessChecksResponse>(
  "ListReadinessChecksResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  ReadinessChecks: S.optional(__listOfReadinessCheckOutput).pipe(
    T.JsonName("readinessChecks"),
  ),
}) {}
export class ListRecoveryGroupsResponse extends S.Class<ListRecoveryGroupsResponse>(
  "ListRecoveryGroupsResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  RecoveryGroups: S.optional(__listOfRecoveryGroupOutput).pipe(
    T.JsonName("recoveryGroups"),
  ),
}) {}
export class ListResourceSetsResponse extends S.Class<ListResourceSetsResponse>(
  "ListResourceSetsResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  ResourceSets: S.optional(__listOfResourceSetOutput).pipe(
    T.JsonName("resourceSets"),
  ),
}) {}
export class ListRulesResponse extends S.Class<ListRulesResponse>(
  "ListRulesResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Rules: S.optional(__listOfListRulesOutput).pipe(T.JsonName("rules")),
}) {}
export class CreateResourceSetRequest extends S.Class<CreateResourceSetRequest>(
  "CreateResourceSetRequest",
)(
  {
    ResourceSetName: S.String.pipe(T.JsonName("resourceSetName")),
    ResourceSetType: S.String.pipe(T.JsonName("resourceSetType")),
    Resources: __listOfResource.pipe(T.JsonName("resources")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/resourcesets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateResourceSetResponse extends S.Class<CreateResourceSetResponse>(
  "CreateResourceSetResponse",
)({
  ResourceSetArn: S.optional(S.String).pipe(T.JsonName("resourceSetArn")),
  ResourceSetName: S.optional(S.String).pipe(T.JsonName("resourceSetName")),
  ResourceSetType: S.optional(S.String).pipe(T.JsonName("resourceSetType")),
  Resources: S.optional(__listOfResource).pipe(T.JsonName("resources")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
) {}

//# Operations
/**
 * Adds a tag to a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteCrossAccountAuthorization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createCrossAccountAuthorization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateCell = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateReadinessCheck = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateReadinessCheckRequest,
    output: UpdateReadinessCheckResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates a recovery group.
 */
export const updateRecoveryGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateResourceSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteReadinessCheck = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteReadinessCheckRequest,
    output: DeleteReadinessCheckResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a recovery group.
 */
export const deleteRecoveryGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteResourceSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteCell = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCell = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getReadinessCheck = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRecoveryGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRecoveryGroupReadinessSummary =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getResourceSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResources = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTagsForResourcesRequest,
    output: ListTagsForResourcesResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Gets recommendations about architecture designs for improving resiliency for an application, based on a recovery group.
 */
export const getArchitectureRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCellReadinessSummary =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getReadinessCheckResourceStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getReadinessCheckStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listCrossAccountAuthorizations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listCells = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listReadinessChecks =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listRecoveryGroups = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Lists the resource sets in an account.
 */
export const listResourceSets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Lists all readiness rules, or lists the readiness rules for a specific resource type.
 */
export const listRules = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createReadinessCheck = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateReadinessCheckRequest,
    output: CreateReadinessCheckResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a recovery group in an account. A recovery group corresponds to an application and includes a list of the cells that make up the application.
 */
export const createRecoveryGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createCell = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createResourceSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

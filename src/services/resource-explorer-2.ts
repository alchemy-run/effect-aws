import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Resource Explorer 2",
  serviceShapeName: "ResourceExplorer",
});
const auth = T.AwsAuthSigv4({ name: "resource-explorer-2" });
const ver = T.ServiceVersion("2022-07-28");
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
                        url: "https://resource-explorer-2-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://resource-explorer-2-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://resource-explorer-2.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://resource-explorer-2.{Region}.{PartitionResult#dnsSuffix}",
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
export class DisassociateDefaultViewRequest extends S.Class<DisassociateDefaultViewRequest>(
  "DisassociateDefaultViewRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateDefaultViewResponse extends S.Class<DisassociateDefaultViewResponse>(
  "DisassociateDefaultViewResponse",
)({}) {}
export class GetAccountLevelServiceConfigurationRequest extends S.Class<GetAccountLevelServiceConfigurationRequest>(
  "GetAccountLevelServiceConfigurationRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDefaultViewRequest extends S.Class<GetDefaultViewRequest>(
  "GetDefaultViewRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIndexRequest extends S.Class<GetIndexRequest>(
  "GetIndexRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetServiceIndexRequest extends S.Class<GetServiceIndexRequest>(
  "GetServiceIndexRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ViewArnList = S.Array(S.String);
export const RegionList = S.Array(S.String);
export const AccountIdList = S.Array(S.String);
export const StringList = S.Array(S.String);
export class BatchGetViewInput extends S.Class<BatchGetViewInput>(
  "BatchGetViewInput",
)(
  { ViewArns: S.optional(ViewArnList) },
  T.all(
    T.Http({ method: "POST", uri: "/BatchGetView" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateResourceExplorerSetupInput extends S.Class<CreateResourceExplorerSetupInput>(
  "CreateResourceExplorerSetupInput",
)(
  {
    RegionList: RegionList,
    AggregatorRegions: S.optional(RegionList),
    ViewName: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateResourceExplorerSetup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourceExplorerSetupInput extends S.Class<DeleteResourceExplorerSetupInput>(
  "DeleteResourceExplorerSetupInput",
)(
  {
    RegionList: S.optional(RegionList),
    DeleteInAllRegions: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteResourceExplorerSetup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDefaultViewOutput extends S.Class<GetDefaultViewOutput>(
  "GetDefaultViewOutput",
)({ ViewArn: S.optional(S.String) }) {}
export class GetManagedViewInput extends S.Class<GetManagedViewInput>(
  "GetManagedViewInput",
)(
  { ManagedViewArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetManagedView" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourceExplorerSetupInput extends S.Class<GetResourceExplorerSetupInput>(
  "GetResourceExplorerSetupInput",
)(
  {
    TaskId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/GetResourceExplorerSetup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetServiceIndexOutput extends S.Class<GetServiceIndexOutput>(
  "GetServiceIndexOutput",
)({ Arn: S.optional(S.String), Type: S.optional(S.String) }) {}
export class GetServiceViewInput extends S.Class<GetServiceViewInput>(
  "GetServiceViewInput",
)(
  { ServiceViewArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetServiceView" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIndexesForMembersInput extends S.Class<ListIndexesForMembersInput>(
  "ListIndexesForMembersInput",
)(
  {
    AccountIdList: AccountIdList,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListIndexesForMembers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListManagedViewsInput extends S.Class<ListManagedViewsInput>(
  "ListManagedViewsInput",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ServicePrincipal: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListManagedViews" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListServiceIndexesInput extends S.Class<ListServiceIndexesInput>(
  "ListServiceIndexesInput",
)(
  {
    Regions: S.optional(RegionList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListServiceIndexes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListServiceViewsInput extends S.Class<ListServiceViewsInput>(
  "ListServiceViewsInput",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ListServiceViews" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListStreamingAccessForServicesInput extends S.Class<ListStreamingAccessForServicesInput>(
  "ListStreamingAccessForServicesInput",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ListStreamingAccessForServices" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSupportedResourceTypesInput extends S.Class<ListSupportedResourceTypesInput>(
  "ListSupportedResourceTypesInput",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(
    T.Http({ method: "POST", uri: "/ListSupportedResourceTypes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchInput extends S.Class<SearchInput>("SearchInput")(
  {
    QueryString: S.String,
    MaxResults: S.optional(S.Number),
    ViewArn: S.optional(S.String),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/Search" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: StringList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}) {}
export class CreateIndexInput extends S.Class<CreateIndexInput>(
  "CreateIndexInput",
)(
  { ClientToken: S.optional(S.String), Tags: S.optional(TagMap) },
  T.all(
    T.Http({ method: "POST", uri: "/CreateIndex" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateIndexTypeInput extends S.Class<UpdateIndexTypeInput>(
  "UpdateIndexTypeInput",
)(
  { Arn: S.String, Type: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateIndexType" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIndexInput extends S.Class<DeleteIndexInput>(
  "DeleteIndexInput",
)(
  { Arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteIndex" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIndexesInput extends S.Class<ListIndexesInput>(
  "ListIndexesInput",
)(
  {
    Type: S.optional(S.String),
    Regions: S.optional(RegionList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListIndexes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetViewInput extends S.Class<GetViewInput>("GetViewInput")(
  { ViewArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetView" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class IncludedProperty extends S.Class<IncludedProperty>(
  "IncludedProperty",
)({ Name: S.String }) {}
export const IncludedPropertyList = S.Array(IncludedProperty);
export class SearchFilter extends S.Class<SearchFilter>("SearchFilter")({
  FilterString: S.String,
}) {}
export class UpdateViewInput extends S.Class<UpdateViewInput>(
  "UpdateViewInput",
)(
  {
    ViewArn: S.String,
    IncludedProperties: S.optional(IncludedPropertyList),
    Filters: S.optional(SearchFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateView" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteViewInput extends S.Class<DeleteViewInput>(
  "DeleteViewInput",
)(
  { ViewArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteView" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListViewsInput extends S.Class<ListViewsInput>("ListViewsInput")(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(
    T.Http({ method: "POST", uri: "/ListViews" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateDefaultViewInput extends S.Class<AssociateDefaultViewInput>(
  "AssociateDefaultViewInput",
)(
  { ViewArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/AssociateDefaultView" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class OrgConfiguration extends S.Class<OrgConfiguration>(
  "OrgConfiguration",
)({
  AWSServiceAccessStatus: S.String,
  ServiceLinkedRole: S.optional(S.String),
}) {}
export const ManagedViewArnList = S.Array(S.String);
export const ServiceViewArnList = S.Array(S.String);
export class CreateResourceExplorerSetupOutput extends S.Class<CreateResourceExplorerSetupOutput>(
  "CreateResourceExplorerSetupOutput",
)({ TaskId: S.String }) {}
export class DeleteResourceExplorerSetupOutput extends S.Class<DeleteResourceExplorerSetupOutput>(
  "DeleteResourceExplorerSetupOutput",
)({ TaskId: S.String }) {}
export class GetAccountLevelServiceConfigurationOutput extends S.Class<GetAccountLevelServiceConfigurationOutput>(
  "GetAccountLevelServiceConfigurationOutput",
)({ OrgConfiguration: S.optional(OrgConfiguration) }) {}
export class GetIndexOutput extends S.Class<GetIndexOutput>("GetIndexOutput")({
  Arn: S.optional(S.String),
  Type: S.optional(S.String),
  State: S.optional(S.String),
  ReplicatingFrom: S.optional(RegionList),
  ReplicatingTo: S.optional(RegionList),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Tags: S.optional(TagMap),
}) {}
export class ListManagedViewsOutput extends S.Class<ListManagedViewsOutput>(
  "ListManagedViewsOutput",
)({
  NextToken: S.optional(S.String),
  ManagedViews: S.optional(ManagedViewArnList),
}) {}
export class ListResourcesInput extends S.Class<ListResourcesInput>(
  "ListResourcesInput",
)(
  {
    Filters: S.optional(SearchFilter),
    MaxResults: S.optional(S.Number),
    ViewArn: S.optional(S.String),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListResources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListServiceViewsOutput extends S.Class<ListServiceViewsOutput>(
  "ListServiceViewsOutput",
)({
  NextToken: S.optional(S.String),
  ServiceViews: S.optional(ServiceViewArnList),
}) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ Tags: S.optional(TagMap) }) {}
export class CreateIndexOutput extends S.Class<CreateIndexOutput>(
  "CreateIndexOutput",
)({
  Arn: S.optional(S.String),
  State: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UpdateIndexTypeOutput extends S.Class<UpdateIndexTypeOutput>(
  "UpdateIndexTypeOutput",
)({
  Arn: S.optional(S.String),
  Type: S.optional(S.String),
  State: S.optional(S.String),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class DeleteIndexOutput extends S.Class<DeleteIndexOutput>(
  "DeleteIndexOutput",
)({
  Arn: S.optional(S.String),
  State: S.optional(S.String),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class Index extends S.Class<Index>("Index")({
  Region: S.optional(S.String),
  Arn: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const IndexList = S.Array(Index);
export class ListIndexesOutput extends S.Class<ListIndexesOutput>(
  "ListIndexesOutput",
)({ Indexes: S.optional(IndexList), NextToken: S.optional(S.String) }) {}
export class CreateViewInput extends S.Class<CreateViewInput>(
  "CreateViewInput",
)(
  {
    ClientToken: S.optional(S.String),
    ViewName: S.String,
    IncludedProperties: S.optional(IncludedPropertyList),
    Scope: S.optional(S.String),
    Filters: S.optional(SearchFilter),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateView" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class View extends S.Class<View>("View")({
  ViewArn: S.optional(S.String),
  Owner: S.optional(S.String),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Scope: S.optional(S.String),
  IncludedProperties: S.optional(IncludedPropertyList),
  Filters: S.optional(SearchFilter),
}) {}
export class GetViewOutput extends S.Class<GetViewOutput>("GetViewOutput")({
  View: S.optional(View),
  Tags: S.optional(TagMap),
}) {}
export class UpdateViewOutput extends S.Class<UpdateViewOutput>(
  "UpdateViewOutput",
)({ View: S.optional(View) }) {}
export class DeleteViewOutput extends S.Class<DeleteViewOutput>(
  "DeleteViewOutput",
)({ ViewArn: S.optional(S.String) }) {}
export class ListViewsOutput extends S.Class<ListViewsOutput>(
  "ListViewsOutput",
)({ Views: S.optional(ViewArnList), NextToken: S.optional(S.String) }) {}
export class AssociateDefaultViewOutput extends S.Class<AssociateDefaultViewOutput>(
  "AssociateDefaultViewOutput",
)({ ViewArn: S.optional(S.String) }) {}
export const ViewList = S.Array(View);
export class BatchGetViewError extends S.Class<BatchGetViewError>(
  "BatchGetViewError",
)({ ViewArn: S.String, ErrorMessage: S.String }) {}
export const BatchGetViewErrors = S.Array(BatchGetViewError);
export class ManagedView extends S.Class<ManagedView>("ManagedView")({
  ManagedViewArn: S.optional(S.String),
  ManagedViewName: S.optional(S.String),
  TrustedService: S.optional(S.String),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Owner: S.optional(S.String),
  Scope: S.optional(S.String),
  IncludedProperties: S.optional(IncludedPropertyList),
  Filters: S.optional(SearchFilter),
  ResourcePolicy: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class ServiceView extends S.Class<ServiceView>("ServiceView")({
  ServiceViewArn: S.String,
  Filters: S.optional(SearchFilter),
  IncludedProperties: S.optional(IncludedPropertyList),
  StreamingAccessForService: S.optional(S.String),
  ScopeType: S.optional(S.String),
}) {}
export class MemberIndex extends S.Class<MemberIndex>("MemberIndex")({
  AccountId: S.optional(S.String),
  Region: S.optional(S.String),
  Arn: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const MemberIndexList = S.Array(MemberIndex);
export class StreamingAccessDetails extends S.Class<StreamingAccessDetails>(
  "StreamingAccessDetails",
)({
  ServicePrincipal: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const StreamingAccessDetailsList = S.Array(StreamingAccessDetails);
export class SupportedResourceType extends S.Class<SupportedResourceType>(
  "SupportedResourceType",
)({ Service: S.optional(S.String), ResourceType: S.optional(S.String) }) {}
export const ResourceTypeList = S.Array(SupportedResourceType);
export class ResourceCount extends S.Class<ResourceCount>("ResourceCount")({
  TotalResources: S.optional(S.Number),
  Complete: S.optional(S.Boolean),
}) {}
export class BatchGetViewOutput extends S.Class<BatchGetViewOutput>(
  "BatchGetViewOutput",
)({ Views: S.optional(ViewList), Errors: S.optional(BatchGetViewErrors) }) {}
export class GetManagedViewOutput extends S.Class<GetManagedViewOutput>(
  "GetManagedViewOutput",
)({ ManagedView: S.optional(ManagedView) }) {}
export class GetServiceViewOutput extends S.Class<GetServiceViewOutput>(
  "GetServiceViewOutput",
)({ View: ServiceView }) {}
export class ListIndexesForMembersOutput extends S.Class<ListIndexesForMembersOutput>(
  "ListIndexesForMembersOutput",
)({ Indexes: S.optional(MemberIndexList), NextToken: S.optional(S.String) }) {}
export class ResourceProperty extends S.Class<ResourceProperty>(
  "ResourceProperty",
)({
  Name: S.optional(S.String),
  LastReportedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Data: S.optional(S.Any),
}) {}
export const ResourcePropertyList = S.Array(ResourceProperty);
export class Resource extends S.Class<Resource>("Resource")({
  Arn: S.optional(S.String),
  OwningAccountId: S.optional(S.String),
  Region: S.optional(S.String),
  ResourceType: S.optional(S.String),
  Service: S.optional(S.String),
  LastReportedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Properties: S.optional(ResourcePropertyList),
}) {}
export const ResourceList = S.Array(Resource);
export class ListResourcesOutput extends S.Class<ListResourcesOutput>(
  "ListResourcesOutput",
)({
  Resources: S.optional(ResourceList),
  NextToken: S.optional(S.String),
  ViewArn: S.optional(S.String),
}) {}
export class ListServiceIndexesOutput extends S.Class<ListServiceIndexesOutput>(
  "ListServiceIndexesOutput",
)({ Indexes: S.optional(IndexList), NextToken: S.optional(S.String) }) {}
export class ListStreamingAccessForServicesOutput extends S.Class<ListStreamingAccessForServicesOutput>(
  "ListStreamingAccessForServicesOutput",
)({
  StreamingAccessForServices: StreamingAccessDetailsList,
  NextToken: S.optional(S.String),
}) {}
export class ListSupportedResourceTypesOutput extends S.Class<ListSupportedResourceTypesOutput>(
  "ListSupportedResourceTypesOutput",
)({
  ResourceTypes: S.optional(ResourceTypeList),
  NextToken: S.optional(S.String),
}) {}
export class CreateViewOutput extends S.Class<CreateViewOutput>(
  "CreateViewOutput",
)({ View: S.optional(View) }) {}
export class ErrorDetails extends S.Class<ErrorDetails>("ErrorDetails")({
  Code: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export class ViewStatus extends S.Class<ViewStatus>("ViewStatus")({
  Status: S.optional(S.String),
  View: S.optional(View),
  ErrorDetails: S.optional(ErrorDetails),
}) {}
export class SearchOutput extends S.Class<SearchOutput>("SearchOutput")({
  Resources: S.optional(ResourceList),
  NextToken: S.optional(S.String),
  ViewArn: S.optional(S.String),
  Count: S.optional(ResourceCount),
}) {}
export class IndexStatus extends S.Class<IndexStatus>("IndexStatus")({
  Status: S.optional(S.String),
  Index: S.optional(Index),
  ErrorDetails: S.optional(ErrorDetails),
}) {}
export class RegionStatus extends S.Class<RegionStatus>("RegionStatus")({
  Region: S.optional(S.String),
  Index: S.optional(IndexStatus),
  View: S.optional(ViewStatus),
}) {}
export const RegionStatusList = S.Array(RegionStatus);
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ Name: S.String, ValidationIssue: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class GetResourceExplorerSetupOutput extends S.Class<GetResourceExplorerSetupOutput>(
  "GetResourceExplorerSetupOutput",
)({ Regions: S.optional(RegionStatusList), NextToken: S.optional(S.String) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.String, Name: S.String, Value: S.String },
) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String, FieldList: S.optional(ValidationExceptionFieldList) },
) {}

//# Operations
/**
 * Retrieves the status of your account's Amazon Web Services service access, and validates the service linked role required to access the multi-account search feature. Only the management account can invoke this API call.
 */
export const getAccountLevelServiceConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetAccountLevelServiceConfigurationRequest,
    output: GetAccountLevelServiceConfigurationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Lists all Resource Explorer indexes across the specified Amazon Web Services Regions. This operation returns information about indexes including their ARNs, types, and Regions.
 */
export const listServiceIndexes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListServiceIndexesInput,
  output: ListServiceIndexesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of Amazon Web Services services that have been granted streaming access to your Resource Explorer data. Streaming access allows Amazon Web Services services to receive real-time updates about your resources as they are indexed by Resource Explorer.
 */
export const listStreamingAccessForServices =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListStreamingAccessForServicesInput,
    output: ListStreamingAccessForServicesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ValidationException,
    ],
  }));
/**
 * Retrieves a list of all resource types currently supported by Amazon Web Services Resource Explorer.
 */
export const listSupportedResourceTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSupportedResourceTypesInput,
    output: ListSupportedResourceTypesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves details about the Amazon Web Services Resource Explorer index in the Amazon Web Services Region in which you invoked the operation.
 */
export const getIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIndexRequest,
  output: GetIndexOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Changes the type of the index from one of the following types to the other. For more information about indexes and the role they perform in Amazon Web Services Resource Explorer, see Turning on cross-Region search by creating an aggregator index in the *Amazon Web Services Resource Explorer User Guide*.
 *
 * - ** `AGGREGATOR` index type**
 *
 * The index contains information about resources from all Amazon Web Services Regions in the Amazon Web Services account in which you've created a Resource Explorer index. Resource information from all other Regions is replicated to this Region's index.
 *
 * When you change the index type to `AGGREGATOR`, Resource Explorer turns on replication of all discovered resource information from the other Amazon Web Services Regions in your account to this index. You can then, from this Region only, perform resource search queries that span all Amazon Web Services Regions in the Amazon Web Services account. Turning on replication from all other Regions is performed by asynchronous background tasks. You can check the status of the asynchronous tasks by using the GetIndex operation. When the asynchronous tasks complete, the `Status` response of that operation changes from `UPDATING` to `ACTIVE`. After that, you can start to see results from other Amazon Web Services Regions in query results. However, it can take several hours for replication from all other Regions to complete.
 *
 * You can have only one aggregator index per Amazon Web Services account. Before you can promote a different index to be the aggregator index for the account, you must first demote the existing aggregator index to type `LOCAL`.
 *
 * - ** `LOCAL` index type**
 *
 * The index contains information about resources in only the Amazon Web Services Region in which the index exists. If an aggregator index in another Region exists, then information in this local index is replicated to the aggregator index.
 *
 * When you change the index type to `LOCAL`, Resource Explorer turns off the replication of resource information from all other Amazon Web Services Regions in the Amazon Web Services account to this Region. The aggregator index remains in the `UPDATING` state until all replication with other Regions successfully stops. You can check the status of the asynchronous task by using the GetIndex operation. When Resource Explorer successfully stops all replication with other Regions, the `Status` response of that operation changes from `UPDATING` to `ACTIVE`. Separately, the resource information from other Regions that was previously stored in the index is deleted within 30 days by another background task. Until that asynchronous task completes, some results from other Regions can continue to appear in search results.
 *
 * After you demote an aggregator index to a local index, you must wait 24 hours before you can promote another index to be the new aggregator index for the account.
 */
export const updateIndexType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIndexTypeInput,
  output: UpdateIndexTypeOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified index and turns off Amazon Web Services Resource Explorer in the specified Amazon Web Services Region. When you delete an index, Resource Explorer stops discovering and indexing resources in that Region. Resource Explorer also deletes all views in that Region. These actions occur as asynchronous background tasks. You can check to see when the actions are complete by using the GetIndex operation and checking the `Status` response value.
 *
 * If the index you delete is the aggregator index for the Amazon Web Services account, you must wait 24 hours before you can promote another local index to be the aggregator index for the account. Users can't perform account-wide searches using Resource Explorer until another aggregator index is configured.
 */
export const deleteIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIndexInput,
  output: DeleteIndexOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sets the specified view as the default for the Amazon Web Services Region in which you call this operation. When a user performs a Search that doesn't explicitly specify which view to use, then Amazon Web Services Resource Explorer automatically chooses this default view for searches performed in this Amazon Web Services Region.
 *
 * If an Amazon Web Services Region doesn't have a default view configured, then users must explicitly specify a view with every `Search` operation performed in that Region.
 */
export const associateDefaultView = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateDefaultViewInput,
    output: AssociateDefaultViewOutput,
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
 * Retrieves the Amazon Resource Name (ARN) of the view that is the default for the Amazon Web Services Region in which you call this operation. You can then call GetView to retrieve the details of that view.
 */
export const getDefaultView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDefaultViewRequest,
  output: GetDefaultViewOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about the Resource Explorer index in the current Amazon Web Services Region. This operation returns the ARN and type of the index if one exists.
 */
export const getServiceIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceIndexRequest,
  output: GetServiceIndexOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all Resource Explorer service views available in the current Amazon Web Services account. This operation returns the ARNs of available service views.
 */
export const listServiceViews = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListServiceViewsInput,
  output: ListServiceViewsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Turns on Amazon Web Services Resource Explorer in the Amazon Web Services Region in which you called this operation by creating an index. Resource Explorer begins discovering the resources in this Region and stores the details about the resources in the index so that they can be queried by using the Search operation. You can create only one index in a Region.
 *
 * This operation creates only a *local* index. To promote the local index in one Amazon Web Services Region into the aggregator index for the Amazon Web Services account, use the UpdateIndexType operation. For more information, see Turning on cross-Region search by creating an aggregator index in the *Amazon Web Services Resource Explorer User Guide*.
 *
 * For more details about what happens when you turn on Resource Explorer in an Amazon Web Services Region, see Turn on Resource Explorer to index your resources in an Amazon Web Services Region in the *Amazon Web Services Resource Explorer User Guide*.
 *
 * If this is the first Amazon Web Services Region in which you've created an index for Resource Explorer, then this operation also creates a service-linked role in your Amazon Web Services account that allows Resource Explorer to enumerate your resources to populate the index.
 *
 * - **Action**: `resource-explorer-2:CreateIndex`
 *
 * **Resource**: The ARN of the index (as it will exist after the operation completes) in the Amazon Web Services Region and account in which you're trying to create the index. Use the wildcard character (`*`) at the end of the string to match the eventual UUID. For example, the following `Resource` element restricts the role or user to creating an index in only the `us-east-2` Region of the specified account.
 *
 * `"Resource": "arn:aws:resource-explorer-2:us-west-2:*<account-id>*:index/*"`
 *
 * Alternatively, you can use `"Resource": "*"` to allow the role or user to create an index in any Region.
 *
 * - **Action**: `iam:CreateServiceLinkedRole`
 *
 * **Resource**: No specific resource (*).
 *
 * This permission is required only the first time you create an index to turn on Resource Explorer in the account. Resource Explorer uses this to create the service-linked role needed to index the resources in your account. Resource Explorer uses the same service-linked role for all additional indexes you create afterwards.
 */
export const createIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIndexInput,
  output: CreateIndexOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of all of the indexes in Amazon Web Services Regions that are currently collecting resource information for Amazon Web Services Resource Explorer.
 */
export const listIndexes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIndexesInput,
  output: ListIndexesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the Amazon resource names (ARNs) of the views available in the Amazon Web Services Region in which you call this operation.
 *
 * Always check the `NextToken` response parameter for a `null` value when calling a paginated operation. These operations can occasionally return an empty set of results even when there are more results available. The `NextToken` response parameter value is `null` *only* when there are no more results to display.
 */
export const listViews = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListViewsInput,
  output: ListViewsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a Resource Explorer setup configuration across multiple Amazon Web Services Regions. This operation sets up indexes and views in the specified Regions. This operation can also be used to set an aggregator Region for cross-Region resource search.
 */
export const createResourceExplorerSetup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateResourceExplorerSetupInput,
    output: CreateResourceExplorerSetupOutput,
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
 * Deletes a Resource Explorer setup configuration. This operation removes indexes and views from the specified Regions or all Regions where Resource Explorer is configured.
 */
export const deleteResourceExplorerSetup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourceExplorerSetupInput,
    output: DeleteResourceExplorerSetupOutput,
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
 * After you call this operation, the affected Amazon Web Services Region no longer has a default view. All Search operations in that Region must explicitly specify a view or the operation fails. You can configure a new default by calling the AssociateDefaultView operation.
 *
 * If an Amazon Web Services Region doesn't have a default view configured, then users must explicitly specify a view with every `Search` operation performed in that Region.
 */
export const disassociateDefaultView = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateDefaultViewRequest,
    output: DisassociateDefaultViewResponse,
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
 * Retrieves details about a specific Resource Explorer service view. This operation returns the configuration and properties of the specified view.
 */
export const getServiceView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceViewInput,
  output: GetServiceViewOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of a member's indexes in all Amazon Web Services Regions that are currently collecting resource information for Amazon Web Services Resource Explorer. Only the management account or a delegated administrator with service access enabled can invoke this API call.
 */
export const listIndexesForMembers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListIndexesForMembersInput,
    output: ListIndexesForMembersOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the Amazon resource names (ARNs) of the Amazon Web Services-managed views available in the Amazon Web Services Region in which you call this operation.
 */
export const listManagedViews = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListManagedViewsInput,
  output: ListManagedViewsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Searches for resources and displays details about all resources that match the specified criteria. You must specify a query string.
 *
 * All search queries must use a view. If you don't explicitly specify a view, then Amazon Web Services Resource Explorer uses the default view for the Amazon Web Services Region in which you call this operation. The results are the logical intersection of the results that match both the `QueryString` parameter supplied to this operation and the `SearchFilter` parameter attached to the view.
 *
 * For the complete syntax supported by the `QueryString` parameter, see Search query syntax reference for Resource Explorer.
 *
 * If your search results are empty, or are missing results that you think should be there, see Troubleshooting Resource Explorer search.
 */
export const search = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchInput,
  output: SearchOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Returns a list of resources and their details that match the specified criteria. This query must use a view. If you don’t explicitly specify a view, then Resource Explorer uses the default view for the Amazon Web Services Region in which you call this operation.
 */
export const listResources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListResourcesInput,
  output: ListResourcesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Modifies some of the details of a view. You can change the filter string and the list of included properties. You can't change the name of the view.
 */
export const updateView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateViewInput,
  output: UpdateViewOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Lists the tags that are attached to the specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Retrieves details of the specified view.
 */
export const getView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetViewInput,
  output: GetViewOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified view.
 *
 * If the specified view is the default view for its Amazon Web Services Region, then all Search operations in that Region must explicitly specify the view to use until you configure a new default by calling the AssociateDefaultView operation.
 */
export const deleteView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteViewInput,
  output: DeleteViewOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Removes one or more tag key and value pairs from an Amazon Web Services Resource Explorer view or index.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Adds one or more tag key and value pairs to an Amazon Web Services Resource Explorer view or index.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Retrieves details about a list of views.
 */
export const batchGetView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetViewInput,
  output: BatchGetViewOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Retrieves details of the specified Amazon Web Services-managed view.
 */
export const getManagedView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetManagedViewInput,
  output: GetManagedViewOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Creates a view that users can query by using the Search operation. Results from queries that you make using this view include only resources that match the view's `Filters`. For more information about Amazon Web Services Resource Explorer views, see Managing views in the *Amazon Web Services Resource Explorer User Guide*.
 *
 * Only the principals with an IAM identity-based policy that grants `Allow` to the `Search` action on a `Resource` with the Amazon resource name (ARN) of this view can Search using views you create with this operation.
 */
export const createView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateViewInput,
  output: CreateViewOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Retrieves the status and details of a Resource Explorer setup operation. This operation returns information about the progress of creating or deleting Resource Explorer configurations across Regions.
 */
export const getResourceExplorerSetup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetResourceExplorerSetupInput,
    output: GetResourceExplorerSetupOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);

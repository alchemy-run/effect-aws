import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Service Catalog AppRegistry",
  serviceShapeName: "AWS242AppRegistry",
});
const auth = T.AwsAuthSigv4({ name: "servicecatalog" });
const ver = T.ServiceVersion("2020-06-24");
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
                        url: "https://servicecatalog-appregistry-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://servicecatalog-appregistry.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://servicecatalog-appregistry-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://servicecatalog-appregistry.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://servicecatalog-appregistry.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetConfigurationRequest extends S.Class<GetConfigurationRequest>(
  "GetConfigurationRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const Options = S.Array(S.String);
export const GetAssociatedResourceFilter = S.Array(S.String);
export const TagKeys = S.Array(S.String);
export class AssociateAttributeGroupRequest extends S.Class<AssociateAttributeGroupRequest>(
  "AssociateAttributeGroupRequest",
)(
  {
    application: S.String.pipe(T.HttpLabel()),
    attributeGroup: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/applications/{application}/attribute-groups/{attributeGroup}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateResourceRequest extends S.Class<AssociateResourceRequest>(
  "AssociateResourceRequest",
)(
  {
    application: S.String.pipe(T.HttpLabel()),
    resourceType: S.String.pipe(T.HttpLabel()),
    resource: S.String.pipe(T.HttpLabel()),
    options: S.optional(Options),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/applications/{application}/resources/{resourceType}/{resource}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class CreateAttributeGroupRequest extends S.Class<CreateAttributeGroupRequest>(
  "CreateAttributeGroupRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    attributes: S.String,
    tags: S.optional(Tags),
    clientToken: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/attribute-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApplicationRequest extends S.Class<DeleteApplicationRequest>(
  "DeleteApplicationRequest",
)(
  { application: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/applications/{application}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAttributeGroupRequest extends S.Class<DeleteAttributeGroupRequest>(
  "DeleteAttributeGroupRequest",
)(
  { attributeGroup: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/attribute-groups/{attributeGroup}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateAttributeGroupRequest extends S.Class<DisassociateAttributeGroupRequest>(
  "DisassociateAttributeGroupRequest",
)(
  {
    application: S.String.pipe(T.HttpLabel()),
    attributeGroup: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/applications/{application}/attribute-groups/{attributeGroup}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateResourceRequest extends S.Class<DisassociateResourceRequest>(
  "DisassociateResourceRequest",
)(
  {
    application: S.String.pipe(T.HttpLabel()),
    resourceType: S.String.pipe(T.HttpLabel()),
    resource: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/applications/{application}/resources/{resourceType}/{resource}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApplicationRequest extends S.Class<GetApplicationRequest>(
  "GetApplicationRequest",
)(
  { application: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/applications/{application}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAssociatedResourceRequest extends S.Class<GetAssociatedResourceRequest>(
  "GetAssociatedResourceRequest",
)(
  {
    application: S.String.pipe(T.HttpLabel()),
    resourceType: S.String.pipe(T.HttpLabel()),
    resource: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    resourceTagStatus: S.optional(GetAssociatedResourceFilter).pipe(
      T.HttpQuery("resourceTagStatus"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{application}/resources/{resourceType}/{resource}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAttributeGroupRequest extends S.Class<GetAttributeGroupRequest>(
  "GetAttributeGroupRequest",
)(
  { attributeGroup: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/attribute-groups/{attributeGroup}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListApplicationsRequest extends S.Class<ListApplicationsRequest>(
  "ListApplicationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/applications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssociatedAttributeGroupsRequest extends S.Class<ListAssociatedAttributeGroupsRequest>(
  "ListAssociatedAttributeGroupsRequest",
)(
  {
    application: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{application}/attribute-groups",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssociatedResourcesRequest extends S.Class<ListAssociatedResourcesRequest>(
  "ListAssociatedResourcesRequest",
)(
  {
    application: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/applications/{application}/resources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAttributeGroupsRequest extends S.Class<ListAttributeGroupsRequest>(
  "ListAttributeGroupsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/attribute-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAttributeGroupsForApplicationRequest extends S.Class<ListAttributeGroupsForApplicationRequest>(
  "ListAttributeGroupsForApplicationRequest",
)(
  {
    application: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{application}/attribute-group-details",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagQueryConfiguration extends S.Class<TagQueryConfiguration>(
  "TagQueryConfiguration",
)({ tagKey: S.optional(S.String) }) {}
export class AppRegistryConfiguration extends S.Class<AppRegistryConfiguration>(
  "AppRegistryConfiguration",
)({ tagQueryConfiguration: S.optional(TagQueryConfiguration) }) {}
export class PutConfigurationRequest extends S.Class<PutConfigurationRequest>(
  "PutConfigurationRequest",
)(
  { configuration: AppRegistryConfiguration },
  T.all(
    T.Http({ method: "PUT", uri: "/configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutConfigurationResponse extends S.Class<PutConfigurationResponse>(
  "PutConfigurationResponse",
)({}) {}
export class SyncResourceRequest extends S.Class<SyncResourceRequest>(
  "SyncResourceRequest",
)(
  {
    resourceType: S.String.pipe(T.HttpLabel()),
    resource: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/sync/{resourceType}/{resource}" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: Tags },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
    resourceArn: S.String.pipe(T.HttpLabel()),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
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
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateApplicationRequest extends S.Class<UpdateApplicationRequest>(
  "UpdateApplicationRequest",
)(
  {
    application: S.String.pipe(T.HttpLabel()),
    name: S.optional(S.String),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/applications/{application}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAttributeGroupRequest extends S.Class<UpdateAttributeGroupRequest>(
  "UpdateAttributeGroupRequest",
)(
  {
    attributeGroup: S.String.pipe(T.HttpLabel()),
    name: S.optional(S.String),
    description: S.optional(S.String),
    attributes: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/attribute-groups/{attributeGroup}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ApplicationSummary extends S.Class<ApplicationSummary>(
  "ApplicationSummary",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const ApplicationSummaries = S.Array(ApplicationSummary);
export const AttributeGroupIds = S.Array(S.String);
export class AttributeGroupSummary extends S.Class<AttributeGroupSummary>(
  "AttributeGroupSummary",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  createdBy: S.optional(S.String),
}) {}
export const AttributeGroupSummaries = S.Array(AttributeGroupSummary);
export class AssociateAttributeGroupResponse extends S.Class<AssociateAttributeGroupResponse>(
  "AssociateAttributeGroupResponse",
)({
  applicationArn: S.optional(S.String),
  attributeGroupArn: S.optional(S.String),
}) {}
export class AssociateResourceResponse extends S.Class<AssociateResourceResponse>(
  "AssociateResourceResponse",
)({
  applicationArn: S.optional(S.String),
  resourceArn: S.optional(S.String),
  options: S.optional(Options),
}) {}
export class CreateApplicationRequest extends S.Class<CreateApplicationRequest>(
  "CreateApplicationRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    tags: S.optional(Tags),
    clientToken: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/applications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateAttributeGroupResponse extends S.Class<DisassociateAttributeGroupResponse>(
  "DisassociateAttributeGroupResponse",
)({
  applicationArn: S.optional(S.String),
  attributeGroupArn: S.optional(S.String),
}) {}
export class DisassociateResourceResponse extends S.Class<DisassociateResourceResponse>(
  "DisassociateResourceResponse",
)({
  applicationArn: S.optional(S.String),
  resourceArn: S.optional(S.String),
}) {}
export class GetAttributeGroupResponse extends S.Class<GetAttributeGroupResponse>(
  "GetAttributeGroupResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  attributes: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  tags: S.optional(Tags),
  createdBy: S.optional(S.String),
}) {}
export class ListApplicationsResponse extends S.Class<ListApplicationsResponse>(
  "ListApplicationsResponse",
)({
  applications: S.optional(ApplicationSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListAssociatedAttributeGroupsResponse extends S.Class<ListAssociatedAttributeGroupsResponse>(
  "ListAssociatedAttributeGroupsResponse",
)({
  attributeGroups: S.optional(AttributeGroupIds),
  nextToken: S.optional(S.String),
}) {}
export class ListAttributeGroupsResponse extends S.Class<ListAttributeGroupsResponse>(
  "ListAttributeGroupsResponse",
)({
  attributeGroups: S.optional(AttributeGroupSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }) {}
export class SyncResourceResponse extends S.Class<SyncResourceResponse>(
  "SyncResourceResponse",
)({
  applicationArn: S.optional(S.String),
  resourceArn: S.optional(S.String),
  actionTaken: S.optional(S.String),
}) {}
export class AttributeGroup extends S.Class<AttributeGroup>("AttributeGroup")({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  tags: S.optional(Tags),
}) {}
export class UpdateAttributeGroupResponse extends S.Class<UpdateAttributeGroupResponse>(
  "UpdateAttributeGroupResponse",
)({ attributeGroup: S.optional(AttributeGroup) }) {}
export const ApplicationTagDefinition = S.Record({
  key: S.String,
  value: S.String,
});
export class AttributeGroupDetails extends S.Class<AttributeGroupDetails>(
  "AttributeGroupDetails",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  createdBy: S.optional(S.String),
}) {}
export const AttributeGroupDetailsList = S.Array(AttributeGroupDetails);
export class Application extends S.Class<Application>("Application")({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  tags: S.optional(Tags),
  applicationTag: S.optional(ApplicationTagDefinition),
}) {}
export class CreateApplicationResponse extends S.Class<CreateApplicationResponse>(
  "CreateApplicationResponse",
)({ application: S.optional(Application) }) {}
export class CreateAttributeGroupResponse extends S.Class<CreateAttributeGroupResponse>(
  "CreateAttributeGroupResponse",
)({ attributeGroup: S.optional(AttributeGroup) }) {}
export class DeleteApplicationResponse extends S.Class<DeleteApplicationResponse>(
  "DeleteApplicationResponse",
)({ application: S.optional(ApplicationSummary) }) {}
export class DeleteAttributeGroupResponse extends S.Class<DeleteAttributeGroupResponse>(
  "DeleteAttributeGroupResponse",
)({ attributeGroup: S.optional(AttributeGroupSummary) }) {}
export class GetConfigurationResponse extends S.Class<GetConfigurationResponse>(
  "GetConfigurationResponse",
)({ configuration: S.optional(AppRegistryConfiguration) }) {}
export class ListAttributeGroupsForApplicationResponse extends S.Class<ListAttributeGroupsForApplicationResponse>(
  "ListAttributeGroupsForApplicationResponse",
)({
  attributeGroupsDetails: S.optional(AttributeGroupDetailsList),
  nextToken: S.optional(S.String),
}) {}
export class UpdateApplicationResponse extends S.Class<UpdateApplicationResponse>(
  "UpdateApplicationResponse",
)({ application: S.optional(Application) }) {}
export class ResourceGroup extends S.Class<ResourceGroup>("ResourceGroup")({
  state: S.optional(S.String),
  arn: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export class ResourceIntegrations extends S.Class<ResourceIntegrations>(
  "ResourceIntegrations",
)({ resourceGroup: S.optional(ResourceGroup) }) {}
export class ResourcesListItem extends S.Class<ResourcesListItem>(
  "ResourcesListItem",
)({
  resourceArn: S.optional(S.String),
  errorMessage: S.optional(S.String),
  status: S.optional(S.String),
  resourceType: S.optional(S.String),
}) {}
export const ResourcesList = S.Array(ResourcesListItem);
export class ResourceDetails extends S.Class<ResourceDetails>(
  "ResourceDetails",
)({ tagValue: S.optional(S.String) }) {}
export class Integrations extends S.Class<Integrations>("Integrations")({
  resourceGroup: S.optional(ResourceGroup),
  applicationTagResourceGroup: S.optional(ResourceGroup),
}) {}
export class Resource extends S.Class<Resource>("Resource")({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  associationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  integrations: S.optional(ResourceIntegrations),
}) {}
export class ApplicationTagResult extends S.Class<ApplicationTagResult>(
  "ApplicationTagResult",
)({
  applicationTagStatus: S.optional(S.String),
  errorMessage: S.optional(S.String),
  resources: S.optional(ResourcesList),
  nextToken: S.optional(S.String),
}) {}
export class ResourceInfo extends S.Class<ResourceInfo>("ResourceInfo")({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  resourceType: S.optional(S.String),
  resourceDetails: S.optional(ResourceDetails),
  options: S.optional(Options),
}) {}
export const Resources = S.Array(ResourceInfo);
export class GetApplicationResponse extends S.Class<GetApplicationResponse>(
  "GetApplicationResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  associatedResourceCount: S.optional(S.Number),
  tags: S.optional(Tags),
  integrations: S.optional(Integrations),
  applicationTag: S.optional(ApplicationTagDefinition),
}) {}
export class GetAssociatedResourceResponse extends S.Class<GetAssociatedResourceResponse>(
  "GetAssociatedResourceResponse",
)({
  resource: S.optional(Resource),
  options: S.optional(Options),
  applicationTagResult: S.optional(ApplicationTagResult),
}) {}
export class ListAssociatedResourcesResponse extends S.Class<ListAssociatedResourcesResponse>(
  "ListAssociatedResourcesResponse",
)({ resources: S.optional(Resources), nextToken: S.optional(S.String) }) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}

//# Operations
/**
 * Disassociates a resource from application.
 * Both the resource and the application can be specified either by ID or name.
 *
 * **Minimum permissions**
 *
 * You must have the following permissions to remove a resource that's been associated with an application using the `APPLY_APPLICATION_TAG` option for AssociateResource.
 *
 * - `tag:GetResources`
 *
 * - `tag:UntagResources`
 *
 * You must also have the following permissions if you don't use the `AWSServiceCatalogAppRegistryFullAccess` policy.
 * For more information, see AWSServiceCatalogAppRegistryFullAccess in the AppRegistry Administrator Guide.
 *
 * - `resource-groups:DisassociateResource`
 *
 * - `cloudformation:UpdateStack`
 *
 * - `cloudformation:DescribeStacks`
 *
 * In addition, you must have the tagging permission defined by the Amazon Web Services service that creates the resource.
 * For more information, see UntagResources in the *Resource Groups Tagging API Reference*.
 */
export const disassociateResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateResourceRequest,
    output: DisassociateResourceResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves an attribute group
 * by its ARN, ID, or name.
 * The attribute group can be specified
 * by its ARN, ID, or name.
 */
export const getAttributeGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAttributeGroupRequest,
  output: GetAttributeGroupResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of all of your applications. Results are paginated.
 */
export const listApplications = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListApplicationsRequest,
  output: ListApplicationsResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Lists all attribute groups that are associated with specified application. Results are paginated.
 */
export const listAssociatedAttributeGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAssociatedAttributeGroupsRequest,
    output: ListAssociatedAttributeGroupsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Lists all attribute groups which you have access to. Results are paginated.
 */
export const listAttributeGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAttributeGroupsRequest,
  output: ListAttributeGroupsResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Lists all of the tags on the resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Associates a `TagKey` configuration
 * to an account.
 */
export const putConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConfigurationRequest,
  output: PutConfigurationResponse,
  errors: [ConflictException, InternalServerException, ValidationException],
}));
/**
 * Syncs the resource with current AppRegistry records.
 *
 * Specifically, the resource’s AppRegistry system tags sync with its associated application. We remove the resource's AppRegistry system tags if it does not associate with the application. The caller must have permissions to read and update the resource.
 */
export const syncResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SyncResourceRequest,
  output: SyncResourceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified resource.
 *
 * Each tag consists of a key and an optional value. If a tag with the same key is already associated with the resource, this action updates its value.
 *
 * This operation returns an empty response if the call was successful.
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
 * Removes tags from a resource.
 *
 * This operation returns an empty response if the call was successful.
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
 * Updates an existing attribute group with new details.
 */
export const updateAttributeGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAttributeGroupRequest,
    output: UpdateAttributeGroupResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Associates an attribute group with an application to augment the application's metadata
 * with the group's attributes. This feature enables applications to be described with
 * user-defined details that are machine-readable, such as third-party integrations.
 */
export const associateAttributeGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateAttributeGroupRequest,
    output: AssociateAttributeGroupResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Associates a resource with an application.
 * The resource can be specified by its ARN or name.
 * The application can be specified by ARN, ID, or name.
 *
 * **Minimum permissions**
 *
 * You must have the following permissions to associate a resource using the `OPTIONS` parameter set to `APPLY_APPLICATION_TAG`.
 *
 * - `tag:GetResources`
 *
 * - `tag:TagResources`
 *
 * You must also have these additional permissions if you don't use the `AWSServiceCatalogAppRegistryFullAccess` policy.
 * For more information, see AWSServiceCatalogAppRegistryFullAccess in the AppRegistry Administrator Guide.
 *
 * - `resource-groups:AssociateResource`
 *
 * - `cloudformation:UpdateStack`
 *
 * - `cloudformation:DescribeStacks`
 *
 * In addition, you must have the tagging permission defined by the Amazon Web Services service that creates the resource.
 * For more information, see TagResources in the *Resource Groups Tagging API Reference*.
 */
export const associateResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateResourceRequest,
  output: AssociateResourceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new application that is the top-level node in a hierarchy of related cloud resource abstractions.
 */
export const createApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationRequest,
  output: CreateApplicationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new attribute group as a container for user-defined attributes. This feature
 * enables users to have full control over their cloud application's metadata in a rich
 * machine-readable format to facilitate integration with automated workflows and third-party
 * tools.
 */
export const createAttributeGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAttributeGroupRequest,
    output: CreateAttributeGroupResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes an application that is specified either by its application ID, name, or ARN. All associated attribute groups and resources must be disassociated from it before deleting an application.
 */
export const deleteApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationRequest,
  output: DeleteApplicationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an attribute group, specified either by its attribute group ID, name, or ARN.
 */
export const deleteAttributeGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAttributeGroupRequest,
    output: DeleteAttributeGroupResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Disassociates an attribute group from an application to remove the extra attributes contained in the attribute group from the application's metadata. This operation reverts `AssociateAttributeGroup`.
 */
export const disassociateAttributeGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateAttributeGroupRequest,
    output: DisassociateAttributeGroupResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves a `TagKey` configuration
 * from an account.
 */
export const getConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfigurationRequest,
  output: GetConfigurationResponse,
  errors: [InternalServerException],
}));
/**
 * Lists the details of all attribute groups associated with a specific application. The results display in pages.
 */
export const listAttributeGroupsForApplication =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAttributeGroupsForApplicationRequest,
    output: ListAttributeGroupsForApplicationResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Updates an existing application with new attributes.
 */
export const updateApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationRequest,
  output: UpdateApplicationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves metadata information
 * about one
 * of your applications.
 * The application can be specified
 * by its ARN, ID, or name
 * (which is unique
 * within one account
 * in one region
 * at a given point
 * in time).
 * Specify
 * by ARN or ID
 * in automated workflows
 * if you want
 * to make sure
 * that the exact same application is returned or a `ResourceNotFoundException` is thrown,
 * avoiding the ABA addressing problem.
 */
export const getApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApplicationRequest,
  output: GetApplicationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets the resource associated with the application.
 */
export const getAssociatedResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAssociatedResourceRequest,
    output: GetAssociatedResourceResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all
 * of the resources
 * that are associated
 * with the specified application.
 * Results are paginated.
 *
 * If you share an application,
 * and a consumer account associates a tag query
 * to the application,
 * all of the users
 * who can access the application
 * can also view the tag values
 * in all accounts
 * that are associated
 * with it
 * using this API.
 */
export const listAssociatedResources = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAssociatedResourcesRequest,
    output: ListAssociatedResourcesResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);

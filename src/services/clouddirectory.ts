import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "CloudDirectory",
  serviceShapeName: "AmazonCloudDirectory_20170111",
});
const auth = T.AwsAuthSigv4({ name: "clouddirectory" });
const ver = T.ServiceVersion("2017-01-11");
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
                        url: "https://clouddirectory-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://clouddirectory.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://clouddirectory-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://clouddirectory.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://clouddirectory.{Region}.{PartitionResult#dnsSuffix}",
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
export class SchemaFacet extends S.Class<SchemaFacet>("SchemaFacet")({
  SchemaArn: S.optional(S.String),
  FacetName: S.optional(S.String),
}) {}
export const SchemaFacetList = S.Array(SchemaFacet);
export const AttributeNameList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class ApplySchemaRequest extends S.Class<ApplySchemaRequest>(
  "ApplySchemaRequest",
)(
  {
    PublishedSchemaArn: S.String,
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/schema/apply",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ObjectReference extends S.Class<ObjectReference>(
  "ObjectReference",
)({ Selector: S.optional(S.String) }) {}
export class AttachObjectRequest extends S.Class<AttachObjectRequest>(
  "AttachObjectRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ParentReference: ObjectReference,
    ChildReference: ObjectReference,
    LinkName: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/object/attach",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AttachPolicyRequest extends S.Class<AttachPolicyRequest>(
  "AttachPolicyRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    PolicyReference: ObjectReference,
    ObjectReference: ObjectReference,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/policy/attach",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AttachPolicyResponse extends S.Class<AttachPolicyResponse>(
  "AttachPolicyResponse",
)({}) {}
export class AttachToIndexRequest extends S.Class<AttachToIndexRequest>(
  "AttachToIndexRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    IndexReference: ObjectReference,
    TargetReference: ObjectReference,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/index/attach",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDirectoryRequest extends S.Class<CreateDirectoryRequest>(
  "CreateDirectoryRequest",
)(
  {
    Name: S.String,
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/directory/create",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AttributeKey extends S.Class<AttributeKey>("AttributeKey")({
  SchemaArn: S.String,
  FacetName: S.String,
  Name: S.String,
}) {}
export const TypedAttributeValue = S.Union(
  S.Struct({ StringValue: S.String }),
  S.Struct({ BinaryValue: T.Blob }),
  S.Struct({ BooleanValue: S.Boolean }),
  S.Struct({ NumberValue: S.String }),
  S.Struct({ DatetimeValue: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }),
);
export class AttributeKeyAndValue extends S.Class<AttributeKeyAndValue>(
  "AttributeKeyAndValue",
)({ Key: AttributeKey, Value: TypedAttributeValue }) {}
export const AttributeKeyAndValueList = S.Array(AttributeKeyAndValue);
export class CreateObjectRequest extends S.Class<CreateObjectRequest>(
  "CreateObjectRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    SchemaFacets: SchemaFacetList,
    ObjectAttributeList: S.optional(AttributeKeyAndValueList),
    ParentReference: S.optional(ObjectReference),
    LinkName: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/amazonclouddirectory/2017-01-11/object" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSchemaRequest extends S.Class<CreateSchemaRequest>(
  "CreateSchemaRequest",
)(
  { Name: S.String },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/schema/create",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDirectoryRequest extends S.Class<DeleteDirectoryRequest>(
  "DeleteDirectoryRequest",
)(
  { DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")) },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/directory",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFacetRequest extends S.Class<DeleteFacetRequest>(
  "DeleteFacetRequest",
)(
  {
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/facet/delete",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFacetResponse extends S.Class<DeleteFacetResponse>(
  "DeleteFacetResponse",
)({}) {}
export class DeleteObjectRequest extends S.Class<DeleteObjectRequest>(
  "DeleteObjectRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/object/delete",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteObjectResponse extends S.Class<DeleteObjectResponse>(
  "DeleteObjectResponse",
)({}) {}
export class DeleteSchemaRequest extends S.Class<DeleteSchemaRequest>(
  "DeleteSchemaRequest",
)(
  { SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")) },
  T.all(
    T.Http({ method: "PUT", uri: "/amazonclouddirectory/2017-01-11/schema" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTypedLinkFacetRequest extends S.Class<DeleteTypedLinkFacetRequest>(
  "DeleteTypedLinkFacetRequest",
)(
  {
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/typedlink/facet/delete",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTypedLinkFacetResponse extends S.Class<DeleteTypedLinkFacetResponse>(
  "DeleteTypedLinkFacetResponse",
)({}) {}
export class DetachFromIndexRequest extends S.Class<DetachFromIndexRequest>(
  "DetachFromIndexRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    IndexReference: ObjectReference,
    TargetReference: ObjectReference,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/index/detach",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DetachObjectRequest extends S.Class<DetachObjectRequest>(
  "DetachObjectRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ParentReference: ObjectReference,
    LinkName: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/object/detach",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DetachPolicyRequest extends S.Class<DetachPolicyRequest>(
  "DetachPolicyRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    PolicyReference: ObjectReference,
    ObjectReference: ObjectReference,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/policy/detach",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DetachPolicyResponse extends S.Class<DetachPolicyResponse>(
  "DetachPolicyResponse",
)({}) {}
export class DisableDirectoryRequest extends S.Class<DisableDirectoryRequest>(
  "DisableDirectoryRequest",
)(
  { DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")) },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/directory/disable",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EnableDirectoryRequest extends S.Class<EnableDirectoryRequest>(
  "EnableDirectoryRequest",
)(
  { DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")) },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/directory/enable",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAppliedSchemaVersionRequest extends S.Class<GetAppliedSchemaVersionRequest>(
  "GetAppliedSchemaVersionRequest",
)(
  { SchemaArn: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/schema/getappliedschema",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDirectoryRequest extends S.Class<GetDirectoryRequest>(
  "GetDirectoryRequest",
)(
  { DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/directory/get",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFacetRequest extends S.Class<GetFacetRequest>(
  "GetFacetRequest",
)(
  {
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/amazonclouddirectory/2017-01-11/facet" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TypedLinkSchemaAndFacetName extends S.Class<TypedLinkSchemaAndFacetName>(
  "TypedLinkSchemaAndFacetName",
)({ SchemaArn: S.String, TypedLinkName: S.String }) {}
export class AttributeNameAndValue extends S.Class<AttributeNameAndValue>(
  "AttributeNameAndValue",
)({ AttributeName: S.String, Value: TypedAttributeValue }) {}
export const AttributeNameAndValueList = S.Array(AttributeNameAndValue);
export class TypedLinkSpecifier extends S.Class<TypedLinkSpecifier>(
  "TypedLinkSpecifier",
)({
  TypedLinkFacet: TypedLinkSchemaAndFacetName,
  SourceObjectReference: ObjectReference,
  TargetObjectReference: ObjectReference,
  IdentityAttributeValues: AttributeNameAndValueList,
}) {}
export class GetLinkAttributesRequest extends S.Class<GetLinkAttributesRequest>(
  "GetLinkAttributesRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    TypedLinkSpecifier: TypedLinkSpecifier,
    AttributeNames: AttributeNameList,
    ConsistencyLevel: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/typedlink/attributes/get",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetObjectAttributesRequest extends S.Class<GetObjectAttributesRequest>(
  "GetObjectAttributesRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
    SchemaFacet: SchemaFacet,
    AttributeNames: AttributeNameList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/object/attributes/get",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetObjectInformationRequest extends S.Class<GetObjectInformationRequest>(
  "GetObjectInformationRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/object/information",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSchemaAsJsonRequest extends S.Class<GetSchemaAsJsonRequest>(
  "GetSchemaAsJsonRequest",
)(
  { SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/schema/json",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTypedLinkFacetInformationRequest extends S.Class<GetTypedLinkFacetInformationRequest>(
  "GetTypedLinkFacetInformationRequest",
)(
  {
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/typedlink/facet/get",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppliedSchemaArnsRequest extends S.Class<ListAppliedSchemaArnsRequest>(
  "ListAppliedSchemaArnsRequest",
)(
  {
    DirectoryArn: S.String,
    SchemaArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/schema/applied",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAttachedIndicesRequest extends S.Class<ListAttachedIndicesRequest>(
  "ListAttachedIndicesRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    TargetReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/object/indices",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDevelopmentSchemaArnsRequest extends S.Class<ListDevelopmentSchemaArnsRequest>(
  "ListDevelopmentSchemaArnsRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/schema/development",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDirectoriesRequest extends S.Class<ListDirectoriesRequest>(
  "ListDirectoriesRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    state: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/directory/list",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFacetAttributesRequest extends S.Class<ListFacetAttributesRequest>(
  "ListFacetAttributesRequest",
)(
  {
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/facet/attributes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFacetNamesRequest extends S.Class<ListFacetNamesRequest>(
  "ListFacetNamesRequest",
)(
  {
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/facet/list",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListManagedSchemaArnsRequest extends S.Class<ListManagedSchemaArnsRequest>(
  "ListManagedSchemaArnsRequest",
)(
  {
    SchemaArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/schema/managed",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListObjectAttributesRequest extends S.Class<ListObjectAttributesRequest>(
  "ListObjectAttributesRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
    FacetFilter: S.optional(SchemaFacet),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/object/attributes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListObjectChildrenRequest extends S.Class<ListObjectChildrenRequest>(
  "ListObjectChildrenRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/object/children",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListObjectParentPathsRequest extends S.Class<ListObjectParentPathsRequest>(
  "ListObjectParentPathsRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/object/parentpaths",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListObjectParentsRequest extends S.Class<ListObjectParentsRequest>(
  "ListObjectParentsRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
    IncludeAllLinksToEachParent: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/object/parent",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListObjectPoliciesRequest extends S.Class<ListObjectPoliciesRequest>(
  "ListObjectPoliciesRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/object/policy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TypedAttributeValueRange extends S.Class<TypedAttributeValueRange>(
  "TypedAttributeValueRange",
)({
  StartMode: S.String,
  StartValue: S.optional(TypedAttributeValue),
  EndMode: S.String,
  EndValue: S.optional(TypedAttributeValue),
}) {}
export class TypedLinkAttributeRange extends S.Class<TypedLinkAttributeRange>(
  "TypedLinkAttributeRange",
)({ AttributeName: S.optional(S.String), Range: TypedAttributeValueRange }) {}
export const TypedLinkAttributeRangeList = S.Array(TypedLinkAttributeRange);
export class ListOutgoingTypedLinksRequest extends S.Class<ListOutgoingTypedLinksRequest>(
  "ListOutgoingTypedLinksRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    FilterAttributeRanges: S.optional(TypedLinkAttributeRangeList),
    FilterTypedLink: S.optional(TypedLinkSchemaAndFacetName),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ConsistencyLevel: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/typedlink/outgoing",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPolicyAttachmentsRequest extends S.Class<ListPolicyAttachmentsRequest>(
  "ListPolicyAttachmentsRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    PolicyReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/policy/attachment",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPublishedSchemaArnsRequest extends S.Class<ListPublishedSchemaArnsRequest>(
  "ListPublishedSchemaArnsRequest",
)(
  {
    SchemaArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/schema/published",
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
  {
    ResourceArn: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/amazonclouddirectory/2017-01-11/tags" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTypedLinkFacetAttributesRequest extends S.Class<ListTypedLinkFacetAttributesRequest>(
  "ListTypedLinkFacetAttributesRequest",
)(
  {
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/typedlink/facet/attributes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTypedLinkFacetNamesRequest extends S.Class<ListTypedLinkFacetNamesRequest>(
  "ListTypedLinkFacetNamesRequest",
)(
  {
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/typedlink/facet/list",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LookupPolicyRequest extends S.Class<LookupPolicyRequest>(
  "LookupPolicyRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/policy/lookup",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PublishSchemaRequest extends S.Class<PublishSchemaRequest>(
  "PublishSchemaRequest",
)(
  {
    DevelopmentSchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Version: S.String,
    MinorVersion: S.optional(S.String),
    Name: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/schema/publish",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutSchemaFromJsonRequest extends S.Class<PutSchemaFromJsonRequest>(
  "PutSchemaFromJsonRequest",
)(
  {
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Document: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/schema/json",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveFacetFromObjectRequest extends S.Class<RemoveFacetFromObjectRequest>(
  "RemoveFacetFromObjectRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    SchemaFacet: SchemaFacet,
    ObjectReference: ObjectReference,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/object/facets/delete",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveFacetFromObjectResponse extends S.Class<RemoveFacetFromObjectResponse>(
  "RemoveFacetFromObjectResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String, TagKeys: TagKeyList },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/tags/remove",
    }),
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
export class UpdateSchemaRequest extends S.Class<UpdateSchemaRequest>(
  "UpdateSchemaRequest",
)(
  {
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/schema/update",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpgradeAppliedSchemaRequest extends S.Class<UpgradeAppliedSchemaRequest>(
  "UpgradeAppliedSchemaRequest",
)(
  {
    PublishedSchemaArn: S.String,
    DirectoryArn: S.String,
    DryRun: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/schema/upgradeapplied",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpgradePublishedSchemaRequest extends S.Class<UpgradePublishedSchemaRequest>(
  "UpgradePublishedSchemaRequest",
)(
  {
    DevelopmentSchemaArn: S.String,
    PublishedSchemaArn: S.String,
    MinorVersion: S.String,
    DryRun: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/schema/upgradepublished",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const AttributeKeyList = S.Array(AttributeKey);
export const Arns = S.Array(S.String);
export class Directory extends S.Class<Directory>("Directory")({
  Name: S.optional(S.String),
  DirectoryArn: S.optional(S.String),
  State: S.optional(S.String),
  CreationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DirectoryList = S.Array(Directory);
export const FacetNameList = S.Array(S.String);
export class ObjectAttributeRange extends S.Class<ObjectAttributeRange>(
  "ObjectAttributeRange",
)({
  AttributeKey: S.optional(AttributeKey),
  Range: S.optional(TypedAttributeValueRange),
}) {}
export const ObjectAttributeRangeList = S.Array(ObjectAttributeRange);
export const ObjectIdentifierList = S.Array(S.String);
export const TypedLinkSpecifierList = S.Array(TypedLinkSpecifier);
export const TypedLinkNameList = S.Array(S.String);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export const RuleParameterMap = S.Record({ key: S.String, value: S.String });
export class Rule extends S.Class<Rule>("Rule")({
  Type: S.optional(S.String),
  Parameters: S.optional(RuleParameterMap),
}) {}
export const RuleMap = S.Record({ key: S.String, value: Rule });
export class FacetAttributeDefinition extends S.Class<FacetAttributeDefinition>(
  "FacetAttributeDefinition",
)({
  Type: S.String,
  DefaultValue: S.optional(TypedAttributeValue),
  IsImmutable: S.optional(S.Boolean),
  Rules: S.optional(RuleMap),
}) {}
export class FacetAttributeReference extends S.Class<FacetAttributeReference>(
  "FacetAttributeReference",
)({ TargetFacetName: S.String, TargetAttributeName: S.String }) {}
export class FacetAttribute extends S.Class<FacetAttribute>("FacetAttribute")({
  Name: S.String,
  AttributeDefinition: S.optional(FacetAttributeDefinition),
  AttributeReference: S.optional(FacetAttributeReference),
  RequiredBehavior: S.optional(S.String),
}) {}
export class FacetAttributeUpdate extends S.Class<FacetAttributeUpdate>(
  "FacetAttributeUpdate",
)({ Attribute: S.optional(FacetAttribute), Action: S.optional(S.String) }) {}
export const FacetAttributeUpdateList = S.Array(FacetAttributeUpdate);
export class TypedLinkAttributeDefinition extends S.Class<TypedLinkAttributeDefinition>(
  "TypedLinkAttributeDefinition",
)({
  Name: S.String,
  Type: S.String,
  DefaultValue: S.optional(TypedAttributeValue),
  IsImmutable: S.optional(S.Boolean),
  Rules: S.optional(RuleMap),
  RequiredBehavior: S.String,
}) {}
export class TypedLinkFacetAttributeUpdate extends S.Class<TypedLinkFacetAttributeUpdate>(
  "TypedLinkFacetAttributeUpdate",
)({ Attribute: TypedLinkAttributeDefinition, Action: S.String }) {}
export const TypedLinkFacetAttributeUpdateList = S.Array(
  TypedLinkFacetAttributeUpdate,
);
export class ApplySchemaResponse extends S.Class<ApplySchemaResponse>(
  "ApplySchemaResponse",
)({
  AppliedSchemaArn: S.optional(S.String),
  DirectoryArn: S.optional(S.String),
}) {}
export class AttachObjectResponse extends S.Class<AttachObjectResponse>(
  "AttachObjectResponse",
)({ AttachedObjectIdentifier: S.optional(S.String) }) {}
export class AttachToIndexResponse extends S.Class<AttachToIndexResponse>(
  "AttachToIndexResponse",
)({ AttachedObjectIdentifier: S.optional(S.String) }) {}
export class AttachTypedLinkRequest extends S.Class<AttachTypedLinkRequest>(
  "AttachTypedLinkRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    SourceObjectReference: ObjectReference,
    TargetObjectReference: ObjectReference,
    TypedLinkFacet: TypedLinkSchemaAndFacetName,
    Attributes: AttributeNameAndValueList,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/typedlink/attach",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDirectoryResponse extends S.Class<CreateDirectoryResponse>(
  "CreateDirectoryResponse",
)({
  DirectoryArn: S.String,
  Name: S.String,
  ObjectIdentifier: S.String,
  AppliedSchemaArn: S.String,
}) {}
export class CreateIndexRequest extends S.Class<CreateIndexRequest>(
  "CreateIndexRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    OrderedIndexedAttributeList: AttributeKeyList,
    IsUnique: S.Boolean,
    ParentReference: S.optional(ObjectReference),
    LinkName: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/amazonclouddirectory/2017-01-11/index" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateObjectResponse extends S.Class<CreateObjectResponse>(
  "CreateObjectResponse",
)({ ObjectIdentifier: S.optional(S.String) }) {}
export class CreateSchemaResponse extends S.Class<CreateSchemaResponse>(
  "CreateSchemaResponse",
)({ SchemaArn: S.optional(S.String) }) {}
export class DeleteDirectoryResponse extends S.Class<DeleteDirectoryResponse>(
  "DeleteDirectoryResponse",
)({ DirectoryArn: S.String }) {}
export class DeleteSchemaResponse extends S.Class<DeleteSchemaResponse>(
  "DeleteSchemaResponse",
)({ SchemaArn: S.optional(S.String) }) {}
export class DetachFromIndexResponse extends S.Class<DetachFromIndexResponse>(
  "DetachFromIndexResponse",
)({ DetachedObjectIdentifier: S.optional(S.String) }) {}
export class DetachObjectResponse extends S.Class<DetachObjectResponse>(
  "DetachObjectResponse",
)({ DetachedObjectIdentifier: S.optional(S.String) }) {}
export class DetachTypedLinkRequest extends S.Class<DetachTypedLinkRequest>(
  "DetachTypedLinkRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    TypedLinkSpecifier: TypedLinkSpecifier,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/typedlink/detach",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DetachTypedLinkResponse extends S.Class<DetachTypedLinkResponse>(
  "DetachTypedLinkResponse",
)({}) {}
export class DisableDirectoryResponse extends S.Class<DisableDirectoryResponse>(
  "DisableDirectoryResponse",
)({ DirectoryArn: S.String }) {}
export class EnableDirectoryResponse extends S.Class<EnableDirectoryResponse>(
  "EnableDirectoryResponse",
)({ DirectoryArn: S.String }) {}
export class GetAppliedSchemaVersionResponse extends S.Class<GetAppliedSchemaVersionResponse>(
  "GetAppliedSchemaVersionResponse",
)({ AppliedSchemaArn: S.optional(S.String) }) {}
export class GetLinkAttributesResponse extends S.Class<GetLinkAttributesResponse>(
  "GetLinkAttributesResponse",
)({ Attributes: S.optional(AttributeKeyAndValueList) }) {}
export class GetObjectAttributesResponse extends S.Class<GetObjectAttributesResponse>(
  "GetObjectAttributesResponse",
)({ Attributes: S.optional(AttributeKeyAndValueList) }) {}
export class GetObjectInformationResponse extends S.Class<GetObjectInformationResponse>(
  "GetObjectInformationResponse",
)({
  SchemaFacets: S.optional(SchemaFacetList),
  ObjectIdentifier: S.optional(S.String),
}) {}
export class GetSchemaAsJsonResponse extends S.Class<GetSchemaAsJsonResponse>(
  "GetSchemaAsJsonResponse",
)({ Name: S.optional(S.String), Document: S.optional(S.String) }) {}
export class GetTypedLinkFacetInformationResponse extends S.Class<GetTypedLinkFacetInformationResponse>(
  "GetTypedLinkFacetInformationResponse",
)({ IdentityAttributeOrder: S.optional(AttributeNameList) }) {}
export class ListAppliedSchemaArnsResponse extends S.Class<ListAppliedSchemaArnsResponse>(
  "ListAppliedSchemaArnsResponse",
)({ SchemaArns: S.optional(Arns), NextToken: S.optional(S.String) }) {}
export class ListDevelopmentSchemaArnsResponse extends S.Class<ListDevelopmentSchemaArnsResponse>(
  "ListDevelopmentSchemaArnsResponse",
)({ SchemaArns: S.optional(Arns), NextToken: S.optional(S.String) }) {}
export class ListDirectoriesResponse extends S.Class<ListDirectoriesResponse>(
  "ListDirectoriesResponse",
)({ Directories: DirectoryList, NextToken: S.optional(S.String) }) {}
export const FacetAttributeList = S.Array(FacetAttribute);
export class ListFacetAttributesResponse extends S.Class<ListFacetAttributesResponse>(
  "ListFacetAttributesResponse",
)({
  Attributes: S.optional(FacetAttributeList),
  NextToken: S.optional(S.String),
}) {}
export class ListFacetNamesResponse extends S.Class<ListFacetNamesResponse>(
  "ListFacetNamesResponse",
)({ FacetNames: S.optional(FacetNameList), NextToken: S.optional(S.String) }) {}
export class ListIndexRequest extends S.Class<ListIndexRequest>(
  "ListIndexRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    RangesOnIndexedValues: S.optional(ObjectAttributeRangeList),
    IndexReference: ObjectReference,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/index/targets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListManagedSchemaArnsResponse extends S.Class<ListManagedSchemaArnsResponse>(
  "ListManagedSchemaArnsResponse",
)({ SchemaArns: S.optional(Arns), NextToken: S.optional(S.String) }) {}
export class ListObjectAttributesResponse extends S.Class<ListObjectAttributesResponse>(
  "ListObjectAttributesResponse",
)({
  Attributes: S.optional(AttributeKeyAndValueList),
  NextToken: S.optional(S.String),
}) {}
export class ListObjectPoliciesResponse extends S.Class<ListObjectPoliciesResponse>(
  "ListObjectPoliciesResponse",
)({
  AttachedPolicyIds: S.optional(ObjectIdentifierList),
  NextToken: S.optional(S.String),
}) {}
export class ListOutgoingTypedLinksResponse extends S.Class<ListOutgoingTypedLinksResponse>(
  "ListOutgoingTypedLinksResponse",
)({
  TypedLinkSpecifiers: S.optional(TypedLinkSpecifierList),
  NextToken: S.optional(S.String),
}) {}
export class ListPolicyAttachmentsResponse extends S.Class<ListPolicyAttachmentsResponse>(
  "ListPolicyAttachmentsResponse",
)({
  ObjectIdentifiers: S.optional(ObjectIdentifierList),
  NextToken: S.optional(S.String),
}) {}
export class ListPublishedSchemaArnsResponse extends S.Class<ListPublishedSchemaArnsResponse>(
  "ListPublishedSchemaArnsResponse",
)({ SchemaArns: S.optional(Arns), NextToken: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList), NextToken: S.optional(S.String) }) {}
export const TypedLinkAttributeDefinitionList = S.Array(
  TypedLinkAttributeDefinition,
);
export class ListTypedLinkFacetAttributesResponse extends S.Class<ListTypedLinkFacetAttributesResponse>(
  "ListTypedLinkFacetAttributesResponse",
)({
  Attributes: S.optional(TypedLinkAttributeDefinitionList),
  NextToken: S.optional(S.String),
}) {}
export class ListTypedLinkFacetNamesResponse extends S.Class<ListTypedLinkFacetNamesResponse>(
  "ListTypedLinkFacetNamesResponse",
)({
  FacetNames: S.optional(TypedLinkNameList),
  NextToken: S.optional(S.String),
}) {}
export class PublishSchemaResponse extends S.Class<PublishSchemaResponse>(
  "PublishSchemaResponse",
)({ PublishedSchemaArn: S.optional(S.String) }) {}
export class PutSchemaFromJsonResponse extends S.Class<PutSchemaFromJsonResponse>(
  "PutSchemaFromJsonResponse",
)({ Arn: S.optional(S.String) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, Tags: TagList },
  T.all(
    T.Http({ method: "PUT", uri: "/amazonclouddirectory/2017-01-11/tags/add" }),
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
export class UpdateFacetRequest extends S.Class<UpdateFacetRequest>(
  "UpdateFacetRequest",
)(
  {
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
    AttributeUpdates: S.optional(FacetAttributeUpdateList),
    ObjectType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/amazonclouddirectory/2017-01-11/facet" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFacetResponse extends S.Class<UpdateFacetResponse>(
  "UpdateFacetResponse",
)({}) {}
export class UpdateSchemaResponse extends S.Class<UpdateSchemaResponse>(
  "UpdateSchemaResponse",
)({ SchemaArn: S.optional(S.String) }) {}
export class UpdateTypedLinkFacetRequest extends S.Class<UpdateTypedLinkFacetRequest>(
  "UpdateTypedLinkFacetRequest",
)(
  {
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
    AttributeUpdates: TypedLinkFacetAttributeUpdateList,
    IdentityAttributeOrder: AttributeNameList,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/typedlink/facet",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTypedLinkFacetResponse extends S.Class<UpdateTypedLinkFacetResponse>(
  "UpdateTypedLinkFacetResponse",
)({}) {}
export class UpgradeAppliedSchemaResponse extends S.Class<UpgradeAppliedSchemaResponse>(
  "UpgradeAppliedSchemaResponse",
)({
  UpgradedSchemaArn: S.optional(S.String),
  DirectoryArn: S.optional(S.String),
}) {}
export class UpgradePublishedSchemaResponse extends S.Class<UpgradePublishedSchemaResponse>(
  "UpgradePublishedSchemaResponse",
)({ UpgradedSchemaArn: S.optional(S.String) }) {}
export class BatchListObjectAttributes extends S.Class<BatchListObjectAttributes>(
  "BatchListObjectAttributes",
)({
  ObjectReference: ObjectReference,
  NextToken: S.optional(S.String),
  MaxResults: S.optional(S.Number),
  FacetFilter: S.optional(SchemaFacet),
}) {}
export class BatchListObjectChildren extends S.Class<BatchListObjectChildren>(
  "BatchListObjectChildren",
)({
  ObjectReference: ObjectReference,
  NextToken: S.optional(S.String),
  MaxResults: S.optional(S.Number),
}) {}
export class BatchListAttachedIndices extends S.Class<BatchListAttachedIndices>(
  "BatchListAttachedIndices",
)({
  TargetReference: ObjectReference,
  NextToken: S.optional(S.String),
  MaxResults: S.optional(S.Number),
}) {}
export class BatchListObjectParentPaths extends S.Class<BatchListObjectParentPaths>(
  "BatchListObjectParentPaths",
)({
  ObjectReference: ObjectReference,
  NextToken: S.optional(S.String),
  MaxResults: S.optional(S.Number),
}) {}
export class BatchGetObjectInformation extends S.Class<BatchGetObjectInformation>(
  "BatchGetObjectInformation",
)({ ObjectReference: ObjectReference }) {}
export class BatchGetObjectAttributes extends S.Class<BatchGetObjectAttributes>(
  "BatchGetObjectAttributes",
)({
  ObjectReference: ObjectReference,
  SchemaFacet: SchemaFacet,
  AttributeNames: AttributeNameList,
}) {}
export class BatchListObjectParents extends S.Class<BatchListObjectParents>(
  "BatchListObjectParents",
)({
  ObjectReference: ObjectReference,
  NextToken: S.optional(S.String),
  MaxResults: S.optional(S.Number),
}) {}
export class BatchListObjectPolicies extends S.Class<BatchListObjectPolicies>(
  "BatchListObjectPolicies",
)({
  ObjectReference: ObjectReference,
  NextToken: S.optional(S.String),
  MaxResults: S.optional(S.Number),
}) {}
export class BatchListPolicyAttachments extends S.Class<BatchListPolicyAttachments>(
  "BatchListPolicyAttachments",
)({
  PolicyReference: ObjectReference,
  NextToken: S.optional(S.String),
  MaxResults: S.optional(S.Number),
}) {}
export class BatchLookupPolicy extends S.Class<BatchLookupPolicy>(
  "BatchLookupPolicy",
)({
  ObjectReference: ObjectReference,
  NextToken: S.optional(S.String),
  MaxResults: S.optional(S.Number),
}) {}
export class BatchListIndex extends S.Class<BatchListIndex>("BatchListIndex")({
  RangesOnIndexedValues: S.optional(ObjectAttributeRangeList),
  IndexReference: ObjectReference,
  MaxResults: S.optional(S.Number),
  NextToken: S.optional(S.String),
}) {}
export class BatchListOutgoingTypedLinks extends S.Class<BatchListOutgoingTypedLinks>(
  "BatchListOutgoingTypedLinks",
)({
  ObjectReference: ObjectReference,
  FilterAttributeRanges: S.optional(TypedLinkAttributeRangeList),
  FilterTypedLink: S.optional(TypedLinkSchemaAndFacetName),
  NextToken: S.optional(S.String),
  MaxResults: S.optional(S.Number),
}) {}
export class BatchListIncomingTypedLinks extends S.Class<BatchListIncomingTypedLinks>(
  "BatchListIncomingTypedLinks",
)({
  ObjectReference: ObjectReference,
  FilterAttributeRanges: S.optional(TypedLinkAttributeRangeList),
  FilterTypedLink: S.optional(TypedLinkSchemaAndFacetName),
  NextToken: S.optional(S.String),
  MaxResults: S.optional(S.Number),
}) {}
export class BatchGetLinkAttributes extends S.Class<BatchGetLinkAttributes>(
  "BatchGetLinkAttributes",
)({
  TypedLinkSpecifier: TypedLinkSpecifier,
  AttributeNames: AttributeNameList,
}) {}
export class BatchCreateObject extends S.Class<BatchCreateObject>(
  "BatchCreateObject",
)({
  SchemaFacet: SchemaFacetList,
  ObjectAttributeList: AttributeKeyAndValueList,
  ParentReference: S.optional(ObjectReference),
  LinkName: S.optional(S.String),
  BatchReferenceName: S.optional(S.String),
}) {}
export class BatchAttachObject extends S.Class<BatchAttachObject>(
  "BatchAttachObject",
)({
  ParentReference: ObjectReference,
  ChildReference: ObjectReference,
  LinkName: S.String,
}) {}
export class BatchDetachObject extends S.Class<BatchDetachObject>(
  "BatchDetachObject",
)({
  ParentReference: ObjectReference,
  LinkName: S.String,
  BatchReferenceName: S.optional(S.String),
}) {}
export class ObjectAttributeAction extends S.Class<ObjectAttributeAction>(
  "ObjectAttributeAction",
)({
  ObjectAttributeActionType: S.optional(S.String),
  ObjectAttributeUpdateValue: S.optional(TypedAttributeValue),
}) {}
export class ObjectAttributeUpdate extends S.Class<ObjectAttributeUpdate>(
  "ObjectAttributeUpdate",
)({
  ObjectAttributeKey: S.optional(AttributeKey),
  ObjectAttributeAction: S.optional(ObjectAttributeAction),
}) {}
export const ObjectAttributeUpdateList = S.Array(ObjectAttributeUpdate);
export class BatchUpdateObjectAttributes extends S.Class<BatchUpdateObjectAttributes>(
  "BatchUpdateObjectAttributes",
)({
  ObjectReference: ObjectReference,
  AttributeUpdates: ObjectAttributeUpdateList,
}) {}
export class BatchDeleteObject extends S.Class<BatchDeleteObject>(
  "BatchDeleteObject",
)({ ObjectReference: ObjectReference }) {}
export class BatchAddFacetToObject extends S.Class<BatchAddFacetToObject>(
  "BatchAddFacetToObject",
)({
  SchemaFacet: SchemaFacet,
  ObjectAttributeList: AttributeKeyAndValueList,
  ObjectReference: ObjectReference,
}) {}
export class BatchRemoveFacetFromObject extends S.Class<BatchRemoveFacetFromObject>(
  "BatchRemoveFacetFromObject",
)({ SchemaFacet: SchemaFacet, ObjectReference: ObjectReference }) {}
export class BatchAttachPolicy extends S.Class<BatchAttachPolicy>(
  "BatchAttachPolicy",
)({ PolicyReference: ObjectReference, ObjectReference: ObjectReference }) {}
export class BatchDetachPolicy extends S.Class<BatchDetachPolicy>(
  "BatchDetachPolicy",
)({ PolicyReference: ObjectReference, ObjectReference: ObjectReference }) {}
export class BatchCreateIndex extends S.Class<BatchCreateIndex>(
  "BatchCreateIndex",
)({
  OrderedIndexedAttributeList: AttributeKeyList,
  IsUnique: S.Boolean,
  ParentReference: S.optional(ObjectReference),
  LinkName: S.optional(S.String),
  BatchReferenceName: S.optional(S.String),
}) {}
export class BatchAttachToIndex extends S.Class<BatchAttachToIndex>(
  "BatchAttachToIndex",
)({ IndexReference: ObjectReference, TargetReference: ObjectReference }) {}
export class BatchDetachFromIndex extends S.Class<BatchDetachFromIndex>(
  "BatchDetachFromIndex",
)({ IndexReference: ObjectReference, TargetReference: ObjectReference }) {}
export class BatchAttachTypedLink extends S.Class<BatchAttachTypedLink>(
  "BatchAttachTypedLink",
)({
  SourceObjectReference: ObjectReference,
  TargetObjectReference: ObjectReference,
  TypedLinkFacet: TypedLinkSchemaAndFacetName,
  Attributes: AttributeNameAndValueList,
}) {}
export class BatchDetachTypedLink extends S.Class<BatchDetachTypedLink>(
  "BatchDetachTypedLink",
)({ TypedLinkSpecifier: TypedLinkSpecifier }) {}
export class LinkAttributeAction extends S.Class<LinkAttributeAction>(
  "LinkAttributeAction",
)({
  AttributeActionType: S.optional(S.String),
  AttributeUpdateValue: S.optional(TypedAttributeValue),
}) {}
export class LinkAttributeUpdate extends S.Class<LinkAttributeUpdate>(
  "LinkAttributeUpdate",
)({
  AttributeKey: S.optional(AttributeKey),
  AttributeAction: S.optional(LinkAttributeAction),
}) {}
export const LinkAttributeUpdateList = S.Array(LinkAttributeUpdate);
export class BatchUpdateLinkAttributes extends S.Class<BatchUpdateLinkAttributes>(
  "BatchUpdateLinkAttributes",
)({
  TypedLinkSpecifier: TypedLinkSpecifier,
  AttributeUpdates: LinkAttributeUpdateList,
}) {}
export class BatchReadOperation extends S.Class<BatchReadOperation>(
  "BatchReadOperation",
)({
  ListObjectAttributes: S.optional(BatchListObjectAttributes),
  ListObjectChildren: S.optional(BatchListObjectChildren),
  ListAttachedIndices: S.optional(BatchListAttachedIndices),
  ListObjectParentPaths: S.optional(BatchListObjectParentPaths),
  GetObjectInformation: S.optional(BatchGetObjectInformation),
  GetObjectAttributes: S.optional(BatchGetObjectAttributes),
  ListObjectParents: S.optional(BatchListObjectParents),
  ListObjectPolicies: S.optional(BatchListObjectPolicies),
  ListPolicyAttachments: S.optional(BatchListPolicyAttachments),
  LookupPolicy: S.optional(BatchLookupPolicy),
  ListIndex: S.optional(BatchListIndex),
  ListOutgoingTypedLinks: S.optional(BatchListOutgoingTypedLinks),
  ListIncomingTypedLinks: S.optional(BatchListIncomingTypedLinks),
  GetLinkAttributes: S.optional(BatchGetLinkAttributes),
}) {}
export const BatchReadOperationList = S.Array(BatchReadOperation);
export class BatchWriteOperation extends S.Class<BatchWriteOperation>(
  "BatchWriteOperation",
)({
  CreateObject: S.optional(BatchCreateObject),
  AttachObject: S.optional(BatchAttachObject),
  DetachObject: S.optional(BatchDetachObject),
  UpdateObjectAttributes: S.optional(BatchUpdateObjectAttributes),
  DeleteObject: S.optional(BatchDeleteObject),
  AddFacetToObject: S.optional(BatchAddFacetToObject),
  RemoveFacetFromObject: S.optional(BatchRemoveFacetFromObject),
  AttachPolicy: S.optional(BatchAttachPolicy),
  DetachPolicy: S.optional(BatchDetachPolicy),
  CreateIndex: S.optional(BatchCreateIndex),
  AttachToIndex: S.optional(BatchAttachToIndex),
  DetachFromIndex: S.optional(BatchDetachFromIndex),
  AttachTypedLink: S.optional(BatchAttachTypedLink),
  DetachTypedLink: S.optional(BatchDetachTypedLink),
  UpdateLinkAttributes: S.optional(BatchUpdateLinkAttributes),
}) {}
export const BatchWriteOperationList = S.Array(BatchWriteOperation);
export class TypedLinkFacet extends S.Class<TypedLinkFacet>("TypedLinkFacet")({
  Name: S.String,
  Attributes: TypedLinkAttributeDefinitionList,
  IdentityAttributeOrder: AttributeNameList,
}) {}
export class Facet extends S.Class<Facet>("Facet")({
  Name: S.optional(S.String),
  ObjectType: S.optional(S.String),
  FacetStyle: S.optional(S.String),
}) {}
export class IndexAttachment extends S.Class<IndexAttachment>(
  "IndexAttachment",
)({
  IndexedAttributes: S.optional(AttributeKeyAndValueList),
  ObjectIdentifier: S.optional(S.String),
}) {}
export const IndexAttachmentList = S.Array(IndexAttachment);
export const LinkNameToObjectIdentifierMap = S.Record({
  key: S.String,
  value: S.String,
});
export class PathToObjectIdentifiers extends S.Class<PathToObjectIdentifiers>(
  "PathToObjectIdentifiers",
)({
  Path: S.optional(S.String),
  ObjectIdentifiers: S.optional(ObjectIdentifierList),
}) {}
export const PathToObjectIdentifiersList = S.Array(PathToObjectIdentifiers);
export const ObjectIdentifierToLinkNameMap = S.Record({
  key: S.String,
  value: S.String,
});
export class ObjectIdentifierAndLinkNameTuple extends S.Class<ObjectIdentifierAndLinkNameTuple>(
  "ObjectIdentifierAndLinkNameTuple",
)({ ObjectIdentifier: S.optional(S.String), LinkName: S.optional(S.String) }) {}
export const ObjectIdentifierAndLinkNameList = S.Array(
  ObjectIdentifierAndLinkNameTuple,
);
export class AddFacetToObjectRequest extends S.Class<AddFacetToObjectRequest>(
  "AddFacetToObjectRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    SchemaFacet: SchemaFacet,
    ObjectAttributeList: S.optional(AttributeKeyAndValueList),
    ObjectReference: ObjectReference,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/object/facets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AddFacetToObjectResponse extends S.Class<AddFacetToObjectResponse>(
  "AddFacetToObjectResponse",
)({}) {}
export class AttachTypedLinkResponse extends S.Class<AttachTypedLinkResponse>(
  "AttachTypedLinkResponse",
)({ TypedLinkSpecifier: S.optional(TypedLinkSpecifier) }) {}
export class BatchReadRequest extends S.Class<BatchReadRequest>(
  "BatchReadRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Operations: BatchReadOperationList,
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/batchread",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchWriteRequest extends S.Class<BatchWriteRequest>(
  "BatchWriteRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Operations: BatchWriteOperationList,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/batchwrite",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateIndexResponse extends S.Class<CreateIndexResponse>(
  "CreateIndexResponse",
)({ ObjectIdentifier: S.optional(S.String) }) {}
export class CreateTypedLinkFacetRequest extends S.Class<CreateTypedLinkFacetRequest>(
  "CreateTypedLinkFacetRequest",
)(
  {
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Facet: TypedLinkFacet,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/typedlink/facet/create",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTypedLinkFacetResponse extends S.Class<CreateTypedLinkFacetResponse>(
  "CreateTypedLinkFacetResponse",
)({}) {}
export class GetDirectoryResponse extends S.Class<GetDirectoryResponse>(
  "GetDirectoryResponse",
)({ Directory: Directory }) {}
export class GetFacetResponse extends S.Class<GetFacetResponse>(
  "GetFacetResponse",
)({ Facet: S.optional(Facet) }) {}
export class ListAttachedIndicesResponse extends S.Class<ListAttachedIndicesResponse>(
  "ListAttachedIndicesResponse",
)({
  IndexAttachments: S.optional(IndexAttachmentList),
  NextToken: S.optional(S.String),
}) {}
export class ListIncomingTypedLinksRequest extends S.Class<ListIncomingTypedLinksRequest>(
  "ListIncomingTypedLinksRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    FilterAttributeRanges: S.optional(TypedLinkAttributeRangeList),
    FilterTypedLink: S.optional(TypedLinkSchemaAndFacetName),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ConsistencyLevel: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/typedlink/incoming",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIndexResponse extends S.Class<ListIndexResponse>(
  "ListIndexResponse",
)({
  IndexAttachments: S.optional(IndexAttachmentList),
  NextToken: S.optional(S.String),
}) {}
export class ListObjectChildrenResponse extends S.Class<ListObjectChildrenResponse>(
  "ListObjectChildrenResponse",
)({
  Children: S.optional(LinkNameToObjectIdentifierMap),
  NextToken: S.optional(S.String),
}) {}
export class ListObjectParentPathsResponse extends S.Class<ListObjectParentPathsResponse>(
  "ListObjectParentPathsResponse",
)({
  PathToObjectIdentifiersList: S.optional(PathToObjectIdentifiersList),
  NextToken: S.optional(S.String),
}) {}
export class ListObjectParentsResponse extends S.Class<ListObjectParentsResponse>(
  "ListObjectParentsResponse",
)({
  Parents: S.optional(ObjectIdentifierToLinkNameMap),
  NextToken: S.optional(S.String),
  ParentLinks: S.optional(ObjectIdentifierAndLinkNameList),
}) {}
export class UpdateLinkAttributesRequest extends S.Class<UpdateLinkAttributesRequest>(
  "UpdateLinkAttributesRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    TypedLinkSpecifier: TypedLinkSpecifier,
    AttributeUpdates: LinkAttributeUpdateList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/amazonclouddirectory/2017-01-11/typedlink/attributes/update",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateLinkAttributesResponse extends S.Class<UpdateLinkAttributesResponse>(
  "UpdateLinkAttributesResponse",
)({}) {}
export class UpdateObjectAttributesRequest extends S.Class<UpdateObjectAttributesRequest>(
  "UpdateObjectAttributesRequest",
)(
  {
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    AttributeUpdates: ObjectAttributeUpdateList,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/object/update",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PolicyAttachment extends S.Class<PolicyAttachment>(
  "PolicyAttachment",
)({
  PolicyId: S.optional(S.String),
  ObjectIdentifier: S.optional(S.String),
  PolicyType: S.optional(S.String),
}) {}
export const PolicyAttachmentList = S.Array(PolicyAttachment);
export class PolicyToPath extends S.Class<PolicyToPath>("PolicyToPath")({
  Path: S.optional(S.String),
  Policies: S.optional(PolicyAttachmentList),
}) {}
export const PolicyToPathList = S.Array(PolicyToPath);
export class ListIncomingTypedLinksResponse extends S.Class<ListIncomingTypedLinksResponse>(
  "ListIncomingTypedLinksResponse",
)({
  LinkSpecifiers: S.optional(TypedLinkSpecifierList),
  NextToken: S.optional(S.String),
}) {}
export class LookupPolicyResponse extends S.Class<LookupPolicyResponse>(
  "LookupPolicyResponse",
)({
  PolicyToPathList: S.optional(PolicyToPathList),
  NextToken: S.optional(S.String),
}) {}
export class UpdateObjectAttributesResponse extends S.Class<UpdateObjectAttributesResponse>(
  "UpdateObjectAttributesResponse",
)({ ObjectIdentifier: S.optional(S.String) }) {}
export class BatchDeleteObjectResponse extends S.Class<BatchDeleteObjectResponse>(
  "BatchDeleteObjectResponse",
)({}) {}
export class BatchAddFacetToObjectResponse extends S.Class<BatchAddFacetToObjectResponse>(
  "BatchAddFacetToObjectResponse",
)({}) {}
export class BatchRemoveFacetFromObjectResponse extends S.Class<BatchRemoveFacetFromObjectResponse>(
  "BatchRemoveFacetFromObjectResponse",
)({}) {}
export class BatchAttachPolicyResponse extends S.Class<BatchAttachPolicyResponse>(
  "BatchAttachPolicyResponse",
)({}) {}
export class BatchDetachPolicyResponse extends S.Class<BatchDetachPolicyResponse>(
  "BatchDetachPolicyResponse",
)({}) {}
export class BatchDetachTypedLinkResponse extends S.Class<BatchDetachTypedLinkResponse>(
  "BatchDetachTypedLinkResponse",
)({}) {}
export class BatchUpdateLinkAttributesResponse extends S.Class<BatchUpdateLinkAttributesResponse>(
  "BatchUpdateLinkAttributesResponse",
)({}) {}
export class BatchReadException extends S.Class<BatchReadException>(
  "BatchReadException",
)({ Type: S.optional(S.String), Message: S.optional(S.String) }) {}
export class BatchCreateObjectResponse extends S.Class<BatchCreateObjectResponse>(
  "BatchCreateObjectResponse",
)({ ObjectIdentifier: S.optional(S.String) }) {}
export class BatchAttachObjectResponse extends S.Class<BatchAttachObjectResponse>(
  "BatchAttachObjectResponse",
)({ attachedObjectIdentifier: S.optional(S.String) }) {}
export class BatchDetachObjectResponse extends S.Class<BatchDetachObjectResponse>(
  "BatchDetachObjectResponse",
)({ detachedObjectIdentifier: S.optional(S.String) }) {}
export class BatchUpdateObjectAttributesResponse extends S.Class<BatchUpdateObjectAttributesResponse>(
  "BatchUpdateObjectAttributesResponse",
)({ ObjectIdentifier: S.optional(S.String) }) {}
export class BatchCreateIndexResponse extends S.Class<BatchCreateIndexResponse>(
  "BatchCreateIndexResponse",
)({ ObjectIdentifier: S.optional(S.String) }) {}
export class BatchAttachToIndexResponse extends S.Class<BatchAttachToIndexResponse>(
  "BatchAttachToIndexResponse",
)({ AttachedObjectIdentifier: S.optional(S.String) }) {}
export class BatchDetachFromIndexResponse extends S.Class<BatchDetachFromIndexResponse>(
  "BatchDetachFromIndexResponse",
)({ DetachedObjectIdentifier: S.optional(S.String) }) {}
export class BatchAttachTypedLinkResponse extends S.Class<BatchAttachTypedLinkResponse>(
  "BatchAttachTypedLinkResponse",
)({ TypedLinkSpecifier: S.optional(TypedLinkSpecifier) }) {}
export class BatchWriteOperationResponse extends S.Class<BatchWriteOperationResponse>(
  "BatchWriteOperationResponse",
)({
  CreateObject: S.optional(BatchCreateObjectResponse),
  AttachObject: S.optional(BatchAttachObjectResponse),
  DetachObject: S.optional(BatchDetachObjectResponse),
  UpdateObjectAttributes: S.optional(BatchUpdateObjectAttributesResponse),
  DeleteObject: S.optional(BatchDeleteObjectResponse),
  AddFacetToObject: S.optional(BatchAddFacetToObjectResponse),
  RemoveFacetFromObject: S.optional(BatchRemoveFacetFromObjectResponse),
  AttachPolicy: S.optional(BatchAttachPolicyResponse),
  DetachPolicy: S.optional(BatchDetachPolicyResponse),
  CreateIndex: S.optional(BatchCreateIndexResponse),
  AttachToIndex: S.optional(BatchAttachToIndexResponse),
  DetachFromIndex: S.optional(BatchDetachFromIndexResponse),
  AttachTypedLink: S.optional(BatchAttachTypedLinkResponse),
  DetachTypedLink: S.optional(BatchDetachTypedLinkResponse),
  UpdateLinkAttributes: S.optional(BatchUpdateLinkAttributesResponse),
}) {}
export const BatchWriteOperationResponseList = S.Array(
  BatchWriteOperationResponse,
);
export class BatchListObjectAttributesResponse extends S.Class<BatchListObjectAttributesResponse>(
  "BatchListObjectAttributesResponse",
)({
  Attributes: S.optional(AttributeKeyAndValueList),
  NextToken: S.optional(S.String),
}) {}
export class BatchListObjectChildrenResponse extends S.Class<BatchListObjectChildrenResponse>(
  "BatchListObjectChildrenResponse",
)({
  Children: S.optional(LinkNameToObjectIdentifierMap),
  NextToken: S.optional(S.String),
}) {}
export class BatchGetObjectInformationResponse extends S.Class<BatchGetObjectInformationResponse>(
  "BatchGetObjectInformationResponse",
)({
  SchemaFacets: S.optional(SchemaFacetList),
  ObjectIdentifier: S.optional(S.String),
}) {}
export class BatchGetObjectAttributesResponse extends S.Class<BatchGetObjectAttributesResponse>(
  "BatchGetObjectAttributesResponse",
)({ Attributes: S.optional(AttributeKeyAndValueList) }) {}
export class BatchListAttachedIndicesResponse extends S.Class<BatchListAttachedIndicesResponse>(
  "BatchListAttachedIndicesResponse",
)({
  IndexAttachments: S.optional(IndexAttachmentList),
  NextToken: S.optional(S.String),
}) {}
export class BatchListObjectParentPathsResponse extends S.Class<BatchListObjectParentPathsResponse>(
  "BatchListObjectParentPathsResponse",
)({
  PathToObjectIdentifiersList: S.optional(PathToObjectIdentifiersList),
  NextToken: S.optional(S.String),
}) {}
export class BatchListObjectPoliciesResponse extends S.Class<BatchListObjectPoliciesResponse>(
  "BatchListObjectPoliciesResponse",
)({
  AttachedPolicyIds: S.optional(ObjectIdentifierList),
  NextToken: S.optional(S.String),
}) {}
export class BatchListPolicyAttachmentsResponse extends S.Class<BatchListPolicyAttachmentsResponse>(
  "BatchListPolicyAttachmentsResponse",
)({
  ObjectIdentifiers: S.optional(ObjectIdentifierList),
  NextToken: S.optional(S.String),
}) {}
export class BatchLookupPolicyResponse extends S.Class<BatchLookupPolicyResponse>(
  "BatchLookupPolicyResponse",
)({
  PolicyToPathList: S.optional(PolicyToPathList),
  NextToken: S.optional(S.String),
}) {}
export class BatchListIndexResponse extends S.Class<BatchListIndexResponse>(
  "BatchListIndexResponse",
)({
  IndexAttachments: S.optional(IndexAttachmentList),
  NextToken: S.optional(S.String),
}) {}
export class BatchListOutgoingTypedLinksResponse extends S.Class<BatchListOutgoingTypedLinksResponse>(
  "BatchListOutgoingTypedLinksResponse",
)({
  TypedLinkSpecifiers: S.optional(TypedLinkSpecifierList),
  NextToken: S.optional(S.String),
}) {}
export class BatchListIncomingTypedLinksResponse extends S.Class<BatchListIncomingTypedLinksResponse>(
  "BatchListIncomingTypedLinksResponse",
)({
  LinkSpecifiers: S.optional(TypedLinkSpecifierList),
  NextToken: S.optional(S.String),
}) {}
export class BatchGetLinkAttributesResponse extends S.Class<BatchGetLinkAttributesResponse>(
  "BatchGetLinkAttributesResponse",
)({ Attributes: S.optional(AttributeKeyAndValueList) }) {}
export class BatchListObjectParentsResponse extends S.Class<BatchListObjectParentsResponse>(
  "BatchListObjectParentsResponse",
)({
  ParentLinks: S.optional(ObjectIdentifierAndLinkNameList),
  NextToken: S.optional(S.String),
}) {}
export class BatchWriteResponse extends S.Class<BatchWriteResponse>(
  "BatchWriteResponse",
)({ Responses: S.optional(BatchWriteOperationResponseList) }) {}
export class CreateFacetRequest extends S.Class<CreateFacetRequest>(
  "CreateFacetRequest",
)(
  {
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
    Attributes: S.optional(FacetAttributeList),
    ObjectType: S.optional(S.String),
    FacetStyle: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/amazonclouddirectory/2017-01-11/facet/create",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFacetResponse extends S.Class<CreateFacetResponse>(
  "CreateFacetResponse",
)({}) {}
export class BatchReadSuccessfulResponse extends S.Class<BatchReadSuccessfulResponse>(
  "BatchReadSuccessfulResponse",
)({
  ListObjectAttributes: S.optional(BatchListObjectAttributesResponse),
  ListObjectChildren: S.optional(BatchListObjectChildrenResponse),
  GetObjectInformation: S.optional(BatchGetObjectInformationResponse),
  GetObjectAttributes: S.optional(BatchGetObjectAttributesResponse),
  ListAttachedIndices: S.optional(BatchListAttachedIndicesResponse),
  ListObjectParentPaths: S.optional(BatchListObjectParentPathsResponse),
  ListObjectPolicies: S.optional(BatchListObjectPoliciesResponse),
  ListPolicyAttachments: S.optional(BatchListPolicyAttachmentsResponse),
  LookupPolicy: S.optional(BatchLookupPolicyResponse),
  ListIndex: S.optional(BatchListIndexResponse),
  ListOutgoingTypedLinks: S.optional(BatchListOutgoingTypedLinksResponse),
  ListIncomingTypedLinks: S.optional(BatchListIncomingTypedLinksResponse),
  GetLinkAttributes: S.optional(BatchGetLinkAttributesResponse),
  ListObjectParents: S.optional(BatchListObjectParentsResponse),
}) {}
export class BatchReadOperationResponse extends S.Class<BatchReadOperationResponse>(
  "BatchReadOperationResponse",
)({
  SuccessfulResponse: S.optional(BatchReadSuccessfulResponse),
  ExceptionResponse: S.optional(BatchReadException),
}) {}
export const BatchReadOperationResponseList = S.Array(
  BatchReadOperationResponse,
);
export class BatchReadResponse extends S.Class<BatchReadResponse>(
  "BatchReadResponse",
)({ Responses: S.optional(BatchReadOperationResponseList) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class DirectoryNotEnabledException extends S.TaggedError<DirectoryNotEnabledException>()(
  "DirectoryNotEnabledException",
  { Message: S.optional(S.String) },
) {}
export class DirectoryAlreadyExistsException extends S.TaggedError<DirectoryAlreadyExistsException>()(
  "DirectoryAlreadyExistsException",
  { Message: S.optional(S.String) },
) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class DirectoryDeletedException extends S.TaggedError<DirectoryDeletedException>()(
  "DirectoryDeletedException",
  { Message: S.optional(S.String) },
) {}
export class FacetNotFoundException extends S.TaggedError<FacetNotFoundException>()(
  "FacetNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class IncompatibleSchemaException extends S.TaggedError<IncompatibleSchemaException>()(
  "IncompatibleSchemaException",
  { Message: S.optional(S.String) },
) {}
export class FacetInUseException extends S.TaggedError<FacetInUseException>()(
  "FacetInUseException",
  { Message: S.optional(S.String) },
) {}
export class FacetValidationException extends S.TaggedError<FacetValidationException>()(
  "FacetValidationException",
  { Message: S.optional(S.String) },
) {}
export class InvalidArnException extends S.TaggedError<InvalidArnException>()(
  "InvalidArnException",
  { Message: S.optional(S.String) },
) {}
export class FacetAlreadyExistsException extends S.TaggedError<FacetAlreadyExistsException>()(
  "FacetAlreadyExistsException",
  { Message: S.optional(S.String) },
) {}
export class DirectoryNotDisabledException extends S.TaggedError<DirectoryNotDisabledException>()(
  "DirectoryNotDisabledException",
  { Message: S.optional(S.String) },
) {}
export class CannotListParentOfRootException extends S.TaggedError<CannotListParentOfRootException>()(
  "CannotListParentOfRootException",
  { Message: S.optional(S.String) },
) {}
export class IndexedAttributeMissingException extends S.TaggedError<IndexedAttributeMissingException>()(
  "IndexedAttributeMissingException",
  { Message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class InvalidRuleException extends S.TaggedError<InvalidRuleException>()(
  "InvalidRuleException",
  { Message: S.optional(S.String) },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
) {}
export class InvalidAttachmentException extends S.TaggedError<InvalidAttachmentException>()(
  "InvalidAttachmentException",
  { Message: S.optional(S.String) },
) {}
export class InvalidFacetUpdateException extends S.TaggedError<InvalidFacetUpdateException>()(
  "InvalidFacetUpdateException",
  { Message: S.optional(S.String) },
) {}
export class InvalidTaggingRequestException extends S.TaggedError<InvalidTaggingRequestException>()(
  "InvalidTaggingRequestException",
  { Message: S.optional(S.String) },
) {}
export class RetryableConflictException extends S.TaggedError<RetryableConflictException>()(
  "RetryableConflictException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class LinkNameAlreadyInUseException extends S.TaggedError<LinkNameAlreadyInUseException>()(
  "LinkNameAlreadyInUseException",
  { Message: S.optional(S.String) },
) {}
export class NotIndexException extends S.TaggedError<NotIndexException>()(
  "NotIndexException",
  { Message: S.optional(S.String) },
) {}
export class NotNodeException extends S.TaggedError<NotNodeException>()(
  "NotNodeException",
  { Message: S.optional(S.String) },
) {}
export class ObjectNotDetachedException extends S.TaggedError<ObjectNotDetachedException>()(
  "ObjectNotDetachedException",
  { Message: S.optional(S.String) },
) {}
export class NotPolicyException extends S.TaggedError<NotPolicyException>()(
  "NotPolicyException",
  { Message: S.optional(S.String) },
) {}
export class InvalidSchemaDocException extends S.TaggedError<InvalidSchemaDocException>()(
  "InvalidSchemaDocException",
  { Message: S.optional(S.String) },
) {}
export class BatchWriteException extends S.TaggedError<BatchWriteException>()(
  "BatchWriteException",
  {
    Index: S.optional(S.Number),
    Type: S.optional(S.String),
    Message: S.optional(S.String),
  },
) {}
export class SchemaAlreadyExistsException extends S.TaggedError<SchemaAlreadyExistsException>()(
  "SchemaAlreadyExistsException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}
export class ObjectAlreadyDetachedException extends S.TaggedError<ObjectAlreadyDetachedException>()(
  "ObjectAlreadyDetachedException",
  { Message: S.optional(S.String) },
) {}
export class StillContainsLinksException extends S.TaggedError<StillContainsLinksException>()(
  "StillContainsLinksException",
  { Message: S.optional(S.String) },
) {}
export class SchemaAlreadyPublishedException extends S.TaggedError<SchemaAlreadyPublishedException>()(
  "SchemaAlreadyPublishedException",
  { Message: S.optional(S.String) },
) {}
export class UnsupportedIndexTypeException extends S.TaggedError<UnsupportedIndexTypeException>()(
  "UnsupportedIndexTypeException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Creates a TypedLinkFacet. For more information, see Typed Links.
 */
export const createTypedLinkFacet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateTypedLinkFacetRequest,
    output: CreateTypedLinkFacetResponse,
    errors: [
      AccessDeniedException,
      FacetAlreadyExistsException,
      FacetValidationException,
      InternalServiceException,
      InvalidArnException,
      InvalidRuleException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
  }),
);
/**
 * Detaches the specified object from the specified index.
 */
export const detachFromIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachFromIndexRequest,
  output: DetachFromIndexResponse,
  errors: [
    AccessDeniedException,
    DirectoryNotEnabledException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    NotIndexException,
    ObjectAlreadyDetachedException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Upgrades a single directory in-place using the `PublishedSchemaArn` with schema updates found in `MinorVersion`. Backwards-compatible minor version upgrades are instantaneously available for readers on all objects in the directory. Note: This is a synchronous API call and upgrades only one schema on a given directory per call. To upgrade multiple directories from one schema, you would need to call this API on each directory.
 */
export const upgradeAppliedSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpgradeAppliedSchemaRequest,
    output: UpgradeAppliedSchemaResponse,
    errors: [
      AccessDeniedException,
      IncompatibleSchemaException,
      InternalServiceException,
      InvalidArnException,
      InvalidAttachmentException,
      ResourceNotFoundException,
      RetryableConflictException,
      SchemaAlreadyExistsException,
      ValidationException,
    ],
  }),
);
/**
 * Copies the input published schema, at the specified version, into the Directory with the same
 * name and version as that of the published schema.
 */
export const applySchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ApplySchemaRequest,
  output: ApplySchemaResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidArnException,
    InvalidAttachmentException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    SchemaAlreadyExistsException,
    ValidationException,
  ],
}));
/**
 * Deletes a given schema. Schemas in a development and published state can only be deleted.
 */
export const deleteSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSchemaRequest,
  output: DeleteSchemaResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    StillContainsLinksException,
    ValidationException,
  ],
}));
/**
 * Publishes a development schema with a major version and a recommended minor version.
 */
export const publishSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PublishSchemaRequest,
  output: PublishSchemaResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    SchemaAlreadyPublishedException,
    ValidationException,
  ],
}));
/**
 * Detaches a given object from the parent object. The object that is to be detached from the
 * parent is specified by the link name.
 */
export const detachObject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachObjectRequest,
  output: DetachObjectResponse,
  errors: [
    AccessDeniedException,
    DirectoryNotEnabledException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    NotNodeException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Deletes an object and its associated attributes. Only objects with no children and no
 * parents can be deleted. The maximum number of attributes that can be deleted during an object deletion is 30. For more information, see Amazon Cloud Directory Limits.
 */
export const deleteObject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteObjectRequest,
  output: DeleteObjectResponse,
  errors: [
    AccessDeniedException,
    DirectoryNotEnabledException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    ObjectNotDetachedException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Detaches a policy from an object.
 */
export const detachPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachPolicyRequest,
  output: DetachPolicyResponse,
  errors: [
    AccessDeniedException,
    DirectoryNotEnabledException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    NotPolicyException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Retrieves metadata about a directory.
 */
export const getDirectory = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDirectoryRequest,
  output: GetDirectoryResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Lists directories created within an account.
 */
export const listDirectories = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDirectoriesRequest,
    output: ListDirectoriesResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidArnException,
      InvalidNextTokenException,
      LimitExceededException,
      RetryableConflictException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Allows a schema to be updated using JSON upload. Only available for development schemas. See JSON Schema Format for more information.
 */
export const putSchemaFromJson = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutSchemaFromJsonRequest,
  output: PutSchemaFromJsonResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidArnException,
    InvalidRuleException,
    InvalidSchemaDocException,
    LimitExceededException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Returns a paginated list of all the incoming TypedLinkSpecifier
 * information for an object. It also supports filtering by typed link facet and identity
 * attributes. For more information, see Typed Links.
 */
export const listIncomingTypedLinks = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListIncomingTypedLinksRequest,
    output: ListIncomingTypedLinksResponse,
    errors: [
      AccessDeniedException,
      DirectoryNotEnabledException,
      FacetValidationException,
      InternalServiceException,
      InvalidArnException,
      InvalidNextTokenException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
  }),
);
/**
 * Does the following:
 *
 * - Adds new `Attributes`, `Rules`, or `ObjectTypes`.
 *
 * - Updates existing `Attributes`, `Rules`, or `ObjectTypes`.
 *
 * - Deletes existing `Attributes`, `Rules`, or `ObjectTypes`.
 */
export const updateFacet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFacetRequest,
  output: UpdateFacetResponse,
  errors: [
    AccessDeniedException,
    FacetNotFoundException,
    FacetValidationException,
    InternalServiceException,
    InvalidArnException,
    InvalidFacetUpdateException,
    InvalidRuleException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Returns tags for a resource. Tagging is currently supported only for directories with a
 * limit of 50 tags per directory. All 50 tags are returned for a given directory with this API
 * call.
 */
export const listTagsForResource =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTagsForResourceRequest,
    output: ListTagsForResourceResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidArnException,
      InvalidTaggingRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Deletes a directory. Only disabled directories can be deleted. A deleted directory cannot be undone. Exercise extreme
 * caution
 * when deleting directories.
 */
export const deleteDirectory = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDirectoryRequest,
  output: DeleteDirectoryResponse,
  errors: [
    AccessDeniedException,
    DirectoryDeletedException,
    DirectoryNotDisabledException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Updates a given typed link’s attributes. Attributes to be updated must not contribute to the typed link’s identity, as defined by its `IdentityAttributeOrder`.
 */
export const updateLinkAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLinkAttributesRequest,
    output: UpdateLinkAttributesResponse,
    errors: [
      AccessDeniedException,
      DirectoryNotEnabledException,
      FacetValidationException,
      InternalServiceException,
      InvalidArnException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
  }),
);
/**
 * Detaches a typed link from a specified source and target object. For more information, see Typed Links.
 */
export const detachTypedLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachTypedLinkRequest,
  output: DetachTypedLinkResponse,
  errors: [
    AccessDeniedException,
    DirectoryNotEnabledException,
    FacetValidationException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Retrieves attributes that are associated with a typed link.
 */
export const getLinkAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLinkAttributesRequest,
  output: GetLinkAttributesResponse,
  errors: [
    AccessDeniedException,
    DirectoryNotEnabledException,
    FacetValidationException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Retrieves attributes within a facet that are associated with an object.
 */
export const getObjectAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetObjectAttributesRequest,
  output: GetObjectAttributesResponse,
  errors: [
    AccessDeniedException,
    DirectoryNotEnabledException,
    FacetValidationException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Removes the specified facet from the specified object.
 */
export const removeFacetFromObject = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveFacetFromObjectRequest,
    output: RemoveFacetFromObjectResponse,
    errors: [
      AccessDeniedException,
      DirectoryNotEnabledException,
      FacetValidationException,
      InternalServiceException,
      InvalidArnException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
  }),
);
/**
 * Adds a new Facet to an object. An object can have more than one facet applied on it.
 */
export const addFacetToObject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddFacetToObjectRequest,
  output: AddFacetToObjectResponse,
  errors: [
    AccessDeniedException,
    DirectoryNotEnabledException,
    FacetValidationException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Lists indices attached to the specified object.
 */
export const listAttachedIndices =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAttachedIndicesRequest,
    output: ListAttachedIndicesResponse,
    errors: [
      AccessDeniedException,
      DirectoryNotEnabledException,
      InternalServiceException,
      InvalidArnException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Deletes a given Facet. All attributes and Rules
 * that are associated with the facet will be deleted. Only development schema facets are allowed
 * deletion.
 */
export const deleteFacet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFacetRequest,
  output: DeleteFacetResponse,
  errors: [
    AccessDeniedException,
    FacetInUseException,
    FacetNotFoundException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Retrieves metadata about an object.
 */
export const getObjectInformation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetObjectInformationRequest,
    output: GetObjectInformationResponse,
    errors: [
      AccessDeniedException,
      DirectoryNotEnabledException,
      InternalServiceException,
      InvalidArnException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
  }),
);
/**
 * Returns current applied schema version ARN, including the minor version in use.
 */
export const getAppliedSchemaVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAppliedSchemaVersionRequest,
    output: GetAppliedSchemaVersionResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidArnException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves a JSON representation of the schema. See JSON Schema Format for more information.
 */
export const getSchemaAsJson = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSchemaAsJsonRequest,
  output: GetSchemaAsJsonResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Updates the schema name with a new name. Only development schema names can be
 * updated.
 */
export const updateSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSchemaRequest,
  output: UpdateSchemaResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Creates a Directory by copying the published schema into the
 * directory. A directory cannot be created without a schema.
 *
 * You can also quickly create a directory using a managed schema, called the
 * `QuickStartSchema`. For more information, see Managed Schema in the *Amazon Cloud Directory Developer Guide*.
 */
export const createDirectory = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDirectoryRequest,
  output: CreateDirectoryResponse,
  errors: [
    AccessDeniedException,
    DirectoryAlreadyExistsException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Disables the specified directory. Disabled directories cannot be read or written to.
 * Only enabled directories can be disabled. Disabled directories may be reenabled.
 */
export const disableDirectory = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableDirectoryRequest,
  output: DisableDirectoryResponse,
  errors: [
    AccessDeniedException,
    DirectoryDeletedException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Enables the specified directory. Only disabled directories can be enabled. Once
 * enabled, the directory can then be read and written to.
 */
export const enableDirectory = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableDirectoryRequest,
  output: EnableDirectoryResponse,
  errors: [
    AccessDeniedException,
    DirectoryDeletedException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Deletes a TypedLinkFacet. For more information, see Typed Links.
 */
export const deleteTypedLinkFacet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTypedLinkFacetRequest,
    output: DeleteTypedLinkFacetResponse,
    errors: [
      AccessDeniedException,
      FacetNotFoundException,
      InternalServiceException,
      InvalidArnException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
  }),
);
/**
 * Gets details of the Facet, such as facet name, attributes, Rules, or `ObjectType`. You can call this on all kinds of schema
 * facets -- published, development, or applied.
 */
export const getFacet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFacetRequest,
  output: GetFacetResponse,
  errors: [
    AccessDeniedException,
    FacetNotFoundException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Lists parent objects that are associated with a given object in pagination
 * fashion.
 */
export const listObjectParents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListObjectParentsRequest,
    output: ListObjectParentsResponse,
    errors: [
      AccessDeniedException,
      CannotListParentOfRootException,
      DirectoryNotEnabledException,
      InternalServiceException,
      InvalidArnException,
      InvalidNextTokenException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists all policies from the root of the Directory to the object
 * specified. If there are no policies present, an empty list is returned. If policies are
 * present, and if some objects don't have the policies attached, it returns the `ObjectIdentifier`
 * for such objects. If policies are present, it returns `ObjectIdentifier`, `policyId`, and
 * `policyType`. Paths that don't lead to the root from the target object are ignored. For more
 * information, see Policies.
 */
export const lookupPolicy = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: LookupPolicyRequest,
    output: LookupPolicyResponse,
    errors: [
      AccessDeniedException,
      DirectoryNotEnabledException,
      InternalServiceException,
      InvalidArnException,
      InvalidNextTokenException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists all attributes that are associated with an object.
 */
export const listObjectAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListObjectAttributesRequest,
    output: ListObjectAttributesResponse,
    errors: [
      AccessDeniedException,
      DirectoryNotEnabledException,
      FacetValidationException,
      InternalServiceException,
      InvalidArnException,
      InvalidNextTokenException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a paginated list of all the outgoing TypedLinkSpecifier
 * information for an object. It also supports filtering by typed link facet and identity
 * attributes. For more information, see Typed Links.
 */
export const listOutgoingTypedLinks = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListOutgoingTypedLinksRequest,
    output: ListOutgoingTypedLinksResponse,
    errors: [
      AccessDeniedException,
      DirectoryNotEnabledException,
      FacetValidationException,
      InternalServiceException,
      InvalidArnException,
      InvalidNextTokenException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
  }),
);
/**
 * Returns the identity attribute order for a specific TypedLinkFacet. For more information, see Typed Links.
 */
export const getTypedLinkFacetInformation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetTypedLinkFacetInformationRequest,
    output: GetTypedLinkFacetInformationResponse,
    errors: [
      AccessDeniedException,
      FacetNotFoundException,
      InternalServiceException,
      InvalidArnException,
      InvalidNextTokenException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
  }));
/**
 * Retrieves all available parent paths for any object type such as node, leaf node,
 * policy node, and index node objects. For more information about objects, see Directory Structure.
 *
 * Use this API to evaluate all parents for an object. The call returns all objects from
 * the root of the directory up to the requested object. The API returns the number of paths
 * based on user-defined `MaxResults`, in case there are multiple paths to the parent.
 * The order of the paths and nodes returned is consistent among multiple API calls unless the
 * objects are deleted or moved. Paths not leading to the directory root are ignored from the
 * target object.
 */
export const listObjectParentPaths =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListObjectParentPathsRequest,
    output: ListObjectParentPathsResponse,
    errors: [
      AccessDeniedException,
      DirectoryNotEnabledException,
      InternalServiceException,
      InvalidArnException,
      InvalidNextTokenException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns policies attached to an object in pagination fashion.
 */
export const listObjectPolicies = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListObjectPoliciesRequest,
    output: ListObjectPoliciesResponse,
    errors: [
      AccessDeniedException,
      DirectoryNotEnabledException,
      InternalServiceException,
      InvalidArnException,
      InvalidNextTokenException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists schema major versions applied to a directory. If `SchemaArn` is provided, lists the minor version.
 */
export const listAppliedSchemaArns =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAppliedSchemaArnsRequest,
    output: ListAppliedSchemaArnsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidArnException,
      InvalidNextTokenException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves each Amazon Resource Name (ARN) of schemas in the development
 * state.
 */
export const listDevelopmentSchemaArns =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDevelopmentSchemaArnsRequest,
    output: ListDevelopmentSchemaArnsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidArnException,
      InvalidNextTokenException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves the names of facets that exist in a schema.
 */
export const listFacetNames = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListFacetNamesRequest,
    output: ListFacetNamesResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidArnException,
      InvalidNextTokenException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the major version families of each managed schema. If a major version ARN is provided as SchemaArn, the minor version revisions in that family are listed instead.
 */
export const listManagedSchemaArns =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListManagedSchemaArnsRequest,
    output: ListManagedSchemaArnsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidArnException,
      InvalidNextTokenException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the major version families of each published schema. If a major version ARN is provided as `SchemaArn`, the minor version revisions in that family are listed instead.
 */
export const listPublishedSchemaArns =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPublishedSchemaArnsRequest,
    output: ListPublishedSchemaArnsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidArnException,
      InvalidNextTokenException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a paginated list of `TypedLink` facet names for a particular schema.
 * For more information, see Typed Links.
 */
export const listTypedLinkFacetNames =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTypedLinkFacetNamesRequest,
    output: ListTypedLinkFacetNamesResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidArnException,
      InvalidNextTokenException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves attributes attached to the facet.
 */
export const listFacetAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListFacetAttributesRequest,
    output: ListFacetAttributesResponse,
    errors: [
      AccessDeniedException,
      FacetNotFoundException,
      InternalServiceException,
      InvalidArnException,
      InvalidNextTokenException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a paginated list of all attribute definitions for a particular TypedLinkFacet. For more information, see Typed Links.
 */
export const listTypedLinkFacetAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTypedLinkFacetAttributesRequest,
    output: ListTypedLinkFacetAttributesResponse,
    errors: [
      AccessDeniedException,
      FacetNotFoundException,
      InternalServiceException,
      InvalidArnException,
      InvalidNextTokenException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Upgrades a published schema under a new minor version revision using the current contents of `DevelopmentSchemaArn`.
 */
export const upgradePublishedSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpgradePublishedSchemaRequest,
    output: UpgradePublishedSchemaResponse,
    errors: [
      AccessDeniedException,
      IncompatibleSchemaException,
      InternalServiceException,
      InvalidArnException,
      InvalidAttachmentException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
  }),
);
/**
 * Attaches a typed link to a specified source and target object. For more information, see Typed Links.
 */
export const attachTypedLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachTypedLinkRequest,
  output: AttachTypedLinkResponse,
  errors: [
    AccessDeniedException,
    DirectoryNotEnabledException,
    FacetValidationException,
    InternalServiceException,
    InvalidArnException,
    InvalidAttachmentException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Updates a TypedLinkFacet. For more information, see Typed Links.
 */
export const updateTypedLinkFacet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateTypedLinkFacetRequest,
    output: UpdateTypedLinkFacetResponse,
    errors: [
      AccessDeniedException,
      FacetNotFoundException,
      FacetValidationException,
      InternalServiceException,
      InvalidArnException,
      InvalidFacetUpdateException,
      InvalidRuleException,
      LimitExceededException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
  }),
);
/**
 * An API operation for adding tags to a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidArnException,
    InvalidTaggingRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * An API operation for removing tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidArnException,
    InvalidTaggingRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Creates a new Facet in a schema. Facet creation is allowed only
 * in development or applied schemas.
 */
export const createFacet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFacetRequest,
  output: CreateFacetResponse,
  errors: [
    AccessDeniedException,
    FacetAlreadyExistsException,
    FacetValidationException,
    InternalServiceException,
    InvalidArnException,
    InvalidRuleException,
    LimitExceededException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Updates a given object's attributes.
 */
export const updateObjectAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateObjectAttributesRequest,
    output: UpdateObjectAttributesResponse,
    errors: [
      AccessDeniedException,
      DirectoryNotEnabledException,
      FacetValidationException,
      InternalServiceException,
      InvalidArnException,
      LimitExceededException,
      LinkNameAlreadyInUseException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
  }),
);
/**
 * Attaches an existing object to another object. An object can be accessed in two
 * ways:
 *
 * - Using the path
 *
 * - Using `ObjectIdentifier`
 */
export const attachObject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachObjectRequest,
  output: AttachObjectResponse,
  errors: [
    AccessDeniedException,
    DirectoryNotEnabledException,
    FacetValidationException,
    InternalServiceException,
    InvalidArnException,
    InvalidAttachmentException,
    LimitExceededException,
    LinkNameAlreadyInUseException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Lists objects attached to the specified index.
 */
export const listIndex = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIndexRequest,
  output: ListIndexResponse,
  errors: [
    AccessDeniedException,
    DirectoryNotEnabledException,
    FacetValidationException,
    InternalServiceException,
    InvalidArnException,
    InvalidNextTokenException,
    LimitExceededException,
    NotIndexException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Attaches the specified object to the specified index.
 */
export const attachToIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachToIndexRequest,
  output: AttachToIndexResponse,
  errors: [
    AccessDeniedException,
    DirectoryNotEnabledException,
    IndexedAttributeMissingException,
    InternalServiceException,
    InvalidArnException,
    InvalidAttachmentException,
    LimitExceededException,
    LinkNameAlreadyInUseException,
    NotIndexException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Returns a paginated list of child objects that are associated with a given
 * object.
 */
export const listObjectChildren = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListObjectChildrenRequest,
    output: ListObjectChildrenResponse,
    errors: [
      AccessDeniedException,
      DirectoryNotEnabledException,
      InternalServiceException,
      InvalidArnException,
      InvalidNextTokenException,
      LimitExceededException,
      NotNodeException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Attaches a policy object to a regular object. An object can have a limited number of attached
 * policies.
 */
export const attachPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachPolicyRequest,
  output: AttachPolicyResponse,
  errors: [
    AccessDeniedException,
    DirectoryNotEnabledException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    NotPolicyException,
    ResourceNotFoundException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Returns all of the `ObjectIdentifiers` to which a given policy is attached.
 */
export const listPolicyAttachments =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPolicyAttachmentsRequest,
    output: ListPolicyAttachmentsResponse,
    errors: [
      AccessDeniedException,
      DirectoryNotEnabledException,
      InternalServiceException,
      InvalidArnException,
      InvalidNextTokenException,
      LimitExceededException,
      NotPolicyException,
      ResourceNotFoundException,
      RetryableConflictException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Performs all the read operations in a batch.
 */
export const batchRead = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchReadRequest,
  output: BatchReadResponse,
  errors: [
    AccessDeniedException,
    DirectoryNotEnabledException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Performs all the write operations in a batch. Either all the operations succeed or
 * none.
 */
export const batchWrite = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchWriteRequest,
  output: BatchWriteResponse,
  errors: [
    AccessDeniedException,
    BatchWriteException,
    DirectoryNotEnabledException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    RetryableConflictException,
    ValidationException,
  ],
}));
/**
 * Creates a new schema in a development state. A schema can exist in three
 * phases:
 *
 * - *Development:* This is a mutable phase of the schema. All new
 * schemas are in the development phase. Once the schema is finalized, it can be
 * published.
 *
 * - *Published:* Published schemas are immutable and have a version
 * associated with them.
 *
 * - *Applied:* Applied schemas are mutable in a way that allows you
 * to add new schema facets. You can also add new, nonrequired attributes to existing schema
 * facets. You can apply only published schemas to directories.
 */
export const createSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSchemaRequest,
  output: CreateSchemaResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    RetryableConflictException,
    SchemaAlreadyExistsException,
    ValidationException,
  ],
}));
/**
 * Creates an index object. See Indexing and search for more information.
 */
export const createIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIndexRequest,
  output: CreateIndexResponse,
  errors: [
    AccessDeniedException,
    DirectoryNotEnabledException,
    FacetValidationException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    LinkNameAlreadyInUseException,
    ResourceNotFoundException,
    RetryableConflictException,
    UnsupportedIndexTypeException,
    ValidationException,
  ],
}));
/**
 * Creates an object in a Directory. Additionally attaches the object to
 * a parent, if a parent reference and `LinkName` is specified. An object is simply a
 * collection of Facet attributes. You can also use this API call to create a
 * policy object, if the facet from which you create the object is a policy facet.
 */
export const createObject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateObjectRequest,
  output: CreateObjectResponse,
  errors: [
    AccessDeniedException,
    DirectoryNotEnabledException,
    FacetValidationException,
    InternalServiceException,
    InvalidArnException,
    LimitExceededException,
    LinkNameAlreadyInUseException,
    ResourceNotFoundException,
    RetryableConflictException,
    UnsupportedIndexTypeException,
    ValidationException,
  ],
}));

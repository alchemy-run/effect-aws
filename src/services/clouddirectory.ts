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
  sdkId: "CloudDirectory",
  serviceShapeName: "AmazonCloudDirectory_20170111",
});
const auth = T.AwsAuthSigv4({ name: "clouddirectory" });
const ver = T.ServiceVersion("2017-01-11");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://clouddirectory-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://clouddirectory.${Region}.amazonaws.com`);
            }
            return e(
              `https://clouddirectory-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://clouddirectory.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://clouddirectory.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Arn = string;
export type LinkName = string;
export type DirectoryName = string;
export type FacetName = string;
export type SchemaName = string;
export type TypedLinkName = string;
export type DirectoryArn = string;
export type AttributeName = string;
export type NextToken = string;
export type NumberResults = number;
export type TagsNumberResults = number;
export type Version = string;
export type SchemaJsonDocument = string;
export type TagKey = string;
export type SelectorObjectReference = string;
export type TagValue = string;
export type ObjectIdentifier = string;
export type ExceptionMessage = string;
export type StringAttributeValue = string;
export type NumberAttributeValue = string;
export type BatchReferenceName = string;
export type PathString = string;
export type RuleKey = string;
export type PolicyType = string;
export type RuleParameterKey = string;
export type RuleParameterValue = string;
export type BatchOperationIndex = number;

//# Schemas
export interface SchemaFacet {
  SchemaArn?: string;
  FacetName?: string;
}
export const SchemaFacet = S.suspend(() =>
  S.Struct({
    SchemaArn: S.optional(S.String),
    FacetName: S.optional(S.String),
  }),
).annotations({ identifier: "SchemaFacet" }) as any as S.Schema<SchemaFacet>;
export type SchemaFacetList = SchemaFacet[];
export const SchemaFacetList = S.Array(SchemaFacet);
export type AttributeNameList = string[];
export const AttributeNameList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface ApplySchemaRequest {
  PublishedSchemaArn: string;
  DirectoryArn: string;
}
export const ApplySchemaRequest = S.suspend(() =>
  S.Struct({
    PublishedSchemaArn: S.String,
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ApplySchemaRequest",
}) as any as S.Schema<ApplySchemaRequest>;
export interface ObjectReference {
  Selector?: string;
}
export const ObjectReference = S.suspend(() =>
  S.Struct({ Selector: S.optional(S.String) }),
).annotations({
  identifier: "ObjectReference",
}) as any as S.Schema<ObjectReference>;
export interface AttachObjectRequest {
  DirectoryArn: string;
  ParentReference: ObjectReference;
  ChildReference: ObjectReference;
  LinkName: string;
}
export const AttachObjectRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ParentReference: ObjectReference,
    ChildReference: ObjectReference,
    LinkName: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "AttachObjectRequest",
}) as any as S.Schema<AttachObjectRequest>;
export interface AttachPolicyRequest {
  DirectoryArn: string;
  PolicyReference: ObjectReference;
  ObjectReference: ObjectReference;
}
export const AttachPolicyRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    PolicyReference: ObjectReference,
    ObjectReference: ObjectReference,
  }).pipe(
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
  ),
).annotations({
  identifier: "AttachPolicyRequest",
}) as any as S.Schema<AttachPolicyRequest>;
export interface AttachPolicyResponse {}
export const AttachPolicyResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "AttachPolicyResponse",
}) as any as S.Schema<AttachPolicyResponse>;
export interface AttachToIndexRequest {
  DirectoryArn: string;
  IndexReference: ObjectReference;
  TargetReference: ObjectReference;
}
export const AttachToIndexRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    IndexReference: ObjectReference,
    TargetReference: ObjectReference,
  }).pipe(
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
  ),
).annotations({
  identifier: "AttachToIndexRequest",
}) as any as S.Schema<AttachToIndexRequest>;
export interface CreateDirectoryRequest {
  Name: string;
  SchemaArn: string;
}
export const CreateDirectoryRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateDirectoryRequest",
}) as any as S.Schema<CreateDirectoryRequest>;
export interface AttributeKey {
  SchemaArn: string;
  FacetName: string;
  Name: string;
}
export const AttributeKey = S.suspend(() =>
  S.Struct({ SchemaArn: S.String, FacetName: S.String, Name: S.String }),
).annotations({ identifier: "AttributeKey" }) as any as S.Schema<AttributeKey>;
export type TypedAttributeValue =
  | { StringValue: string }
  | { BinaryValue: Uint8Array }
  | { BooleanValue: boolean }
  | { NumberValue: string }
  | { DatetimeValue: Date };
export const TypedAttributeValue = S.Union(
  S.Struct({ StringValue: S.String }),
  S.Struct({ BinaryValue: T.Blob }),
  S.Struct({ BooleanValue: S.Boolean }),
  S.Struct({ NumberValue: S.String }),
  S.Struct({ DatetimeValue: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }),
);
export interface AttributeKeyAndValue {
  Key: AttributeKey;
  Value: (typeof TypedAttributeValue)["Type"];
}
export const AttributeKeyAndValue = S.suspend(() =>
  S.Struct({ Key: AttributeKey, Value: TypedAttributeValue }),
).annotations({
  identifier: "AttributeKeyAndValue",
}) as any as S.Schema<AttributeKeyAndValue>;
export type AttributeKeyAndValueList = AttributeKeyAndValue[];
export const AttributeKeyAndValueList = S.Array(AttributeKeyAndValue);
export interface CreateObjectRequest {
  DirectoryArn: string;
  SchemaFacets: SchemaFacetList;
  ObjectAttributeList?: AttributeKeyAndValueList;
  ParentReference?: ObjectReference;
  LinkName?: string;
}
export const CreateObjectRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    SchemaFacets: SchemaFacetList,
    ObjectAttributeList: S.optional(AttributeKeyAndValueList),
    ParentReference: S.optional(ObjectReference),
    LinkName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/amazonclouddirectory/2017-01-11/object" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateObjectRequest",
}) as any as S.Schema<CreateObjectRequest>;
export interface CreateSchemaRequest {
  Name: string;
}
export const CreateSchemaRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
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
  ),
).annotations({
  identifier: "CreateSchemaRequest",
}) as any as S.Schema<CreateSchemaRequest>;
export interface DeleteDirectoryRequest {
  DirectoryArn: string;
}
export const DeleteDirectoryRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteDirectoryRequest",
}) as any as S.Schema<DeleteDirectoryRequest>;
export interface DeleteFacetRequest {
  SchemaArn: string;
  Name: string;
}
export const DeleteFacetRequest = S.suspend(() =>
  S.Struct({
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteFacetRequest",
}) as any as S.Schema<DeleteFacetRequest>;
export interface DeleteFacetResponse {}
export const DeleteFacetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteFacetResponse",
}) as any as S.Schema<DeleteFacetResponse>;
export interface DeleteObjectRequest {
  DirectoryArn: string;
  ObjectReference: ObjectReference;
}
export const DeleteObjectRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteObjectRequest",
}) as any as S.Schema<DeleteObjectRequest>;
export interface DeleteObjectResponse {}
export const DeleteObjectResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteObjectResponse",
}) as any as S.Schema<DeleteObjectResponse>;
export interface DeleteSchemaRequest {
  SchemaArn: string;
}
export const DeleteSchemaRequest = S.suspend(() =>
  S.Struct({
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/amazonclouddirectory/2017-01-11/schema" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSchemaRequest",
}) as any as S.Schema<DeleteSchemaRequest>;
export interface DeleteTypedLinkFacetRequest {
  SchemaArn: string;
  Name: string;
}
export const DeleteTypedLinkFacetRequest = S.suspend(() =>
  S.Struct({
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteTypedLinkFacetRequest",
}) as any as S.Schema<DeleteTypedLinkFacetRequest>;
export interface DeleteTypedLinkFacetResponse {}
export const DeleteTypedLinkFacetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTypedLinkFacetResponse",
}) as any as S.Schema<DeleteTypedLinkFacetResponse>;
export interface DetachFromIndexRequest {
  DirectoryArn: string;
  IndexReference: ObjectReference;
  TargetReference: ObjectReference;
}
export const DetachFromIndexRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    IndexReference: ObjectReference,
    TargetReference: ObjectReference,
  }).pipe(
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
  ),
).annotations({
  identifier: "DetachFromIndexRequest",
}) as any as S.Schema<DetachFromIndexRequest>;
export interface DetachObjectRequest {
  DirectoryArn: string;
  ParentReference: ObjectReference;
  LinkName: string;
}
export const DetachObjectRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ParentReference: ObjectReference,
    LinkName: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "DetachObjectRequest",
}) as any as S.Schema<DetachObjectRequest>;
export interface DetachPolicyRequest {
  DirectoryArn: string;
  PolicyReference: ObjectReference;
  ObjectReference: ObjectReference;
}
export const DetachPolicyRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    PolicyReference: ObjectReference,
    ObjectReference: ObjectReference,
  }).pipe(
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
  ),
).annotations({
  identifier: "DetachPolicyRequest",
}) as any as S.Schema<DetachPolicyRequest>;
export interface DetachPolicyResponse {}
export const DetachPolicyResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DetachPolicyResponse",
}) as any as S.Schema<DetachPolicyResponse>;
export interface DisableDirectoryRequest {
  DirectoryArn: string;
}
export const DisableDirectoryRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DisableDirectoryRequest",
}) as any as S.Schema<DisableDirectoryRequest>;
export interface EnableDirectoryRequest {
  DirectoryArn: string;
}
export const EnableDirectoryRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
  }).pipe(
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
  ),
).annotations({
  identifier: "EnableDirectoryRequest",
}) as any as S.Schema<EnableDirectoryRequest>;
export interface GetAppliedSchemaVersionRequest {
  SchemaArn: string;
}
export const GetAppliedSchemaVersionRequest = S.suspend(() =>
  S.Struct({ SchemaArn: S.String }).pipe(
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
  ),
).annotations({
  identifier: "GetAppliedSchemaVersionRequest",
}) as any as S.Schema<GetAppliedSchemaVersionRequest>;
export interface GetDirectoryRequest {
  DirectoryArn: string;
}
export const GetDirectoryRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetDirectoryRequest",
}) as any as S.Schema<GetDirectoryRequest>;
export interface GetFacetRequest {
  SchemaArn: string;
  Name: string;
}
export const GetFacetRequest = S.suspend(() =>
  S.Struct({
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/amazonclouddirectory/2017-01-11/facet" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFacetRequest",
}) as any as S.Schema<GetFacetRequest>;
export interface TypedLinkSchemaAndFacetName {
  SchemaArn: string;
  TypedLinkName: string;
}
export const TypedLinkSchemaAndFacetName = S.suspend(() =>
  S.Struct({ SchemaArn: S.String, TypedLinkName: S.String }),
).annotations({
  identifier: "TypedLinkSchemaAndFacetName",
}) as any as S.Schema<TypedLinkSchemaAndFacetName>;
export interface AttributeNameAndValue {
  AttributeName: string;
  Value: (typeof TypedAttributeValue)["Type"];
}
export const AttributeNameAndValue = S.suspend(() =>
  S.Struct({ AttributeName: S.String, Value: TypedAttributeValue }),
).annotations({
  identifier: "AttributeNameAndValue",
}) as any as S.Schema<AttributeNameAndValue>;
export type AttributeNameAndValueList = AttributeNameAndValue[];
export const AttributeNameAndValueList = S.Array(AttributeNameAndValue);
export interface TypedLinkSpecifier {
  TypedLinkFacet: TypedLinkSchemaAndFacetName;
  SourceObjectReference: ObjectReference;
  TargetObjectReference: ObjectReference;
  IdentityAttributeValues: AttributeNameAndValueList;
}
export const TypedLinkSpecifier = S.suspend(() =>
  S.Struct({
    TypedLinkFacet: TypedLinkSchemaAndFacetName,
    SourceObjectReference: ObjectReference,
    TargetObjectReference: ObjectReference,
    IdentityAttributeValues: AttributeNameAndValueList,
  }),
).annotations({
  identifier: "TypedLinkSpecifier",
}) as any as S.Schema<TypedLinkSpecifier>;
export interface GetLinkAttributesRequest {
  DirectoryArn: string;
  TypedLinkSpecifier: TypedLinkSpecifier;
  AttributeNames: AttributeNameList;
  ConsistencyLevel?: string;
}
export const GetLinkAttributesRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    TypedLinkSpecifier: TypedLinkSpecifier,
    AttributeNames: AttributeNameList,
    ConsistencyLevel: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetLinkAttributesRequest",
}) as any as S.Schema<GetLinkAttributesRequest>;
export interface GetObjectAttributesRequest {
  DirectoryArn: string;
  ObjectReference: ObjectReference;
  ConsistencyLevel?: string;
  SchemaFacet: SchemaFacet;
  AttributeNames: AttributeNameList;
}
export const GetObjectAttributesRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
    SchemaFacet: SchemaFacet,
    AttributeNames: AttributeNameList,
  }).pipe(
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
  ),
).annotations({
  identifier: "GetObjectAttributesRequest",
}) as any as S.Schema<GetObjectAttributesRequest>;
export interface GetObjectInformationRequest {
  DirectoryArn: string;
  ObjectReference: ObjectReference;
  ConsistencyLevel?: string;
}
export const GetObjectInformationRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetObjectInformationRequest",
}) as any as S.Schema<GetObjectInformationRequest>;
export interface GetSchemaAsJsonRequest {
  SchemaArn: string;
}
export const GetSchemaAsJsonRequest = S.suspend(() =>
  S.Struct({
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSchemaAsJsonRequest",
}) as any as S.Schema<GetSchemaAsJsonRequest>;
export interface GetTypedLinkFacetInformationRequest {
  SchemaArn: string;
  Name: string;
}
export const GetTypedLinkFacetInformationRequest = S.suspend(() =>
  S.Struct({
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "GetTypedLinkFacetInformationRequest",
}) as any as S.Schema<GetTypedLinkFacetInformationRequest>;
export interface ListAppliedSchemaArnsRequest {
  DirectoryArn: string;
  SchemaArn?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListAppliedSchemaArnsRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String,
    SchemaArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListAppliedSchemaArnsRequest",
}) as any as S.Schema<ListAppliedSchemaArnsRequest>;
export interface ListAttachedIndicesRequest {
  DirectoryArn: string;
  TargetReference: ObjectReference;
  NextToken?: string;
  MaxResults?: number;
  ConsistencyLevel?: string;
}
export const ListAttachedIndicesRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    TargetReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListAttachedIndicesRequest",
}) as any as S.Schema<ListAttachedIndicesRequest>;
export interface ListDevelopmentSchemaArnsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListDevelopmentSchemaArnsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDevelopmentSchemaArnsRequest",
}) as any as S.Schema<ListDevelopmentSchemaArnsRequest>;
export interface ListDirectoriesRequest {
  NextToken?: string;
  MaxResults?: number;
  state?: string;
}
export const ListDirectoriesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    state: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDirectoriesRequest",
}) as any as S.Schema<ListDirectoriesRequest>;
export interface ListFacetAttributesRequest {
  SchemaArn: string;
  Name: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListFacetAttributesRequest = S.suspend(() =>
  S.Struct({
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListFacetAttributesRequest",
}) as any as S.Schema<ListFacetAttributesRequest>;
export interface ListFacetNamesRequest {
  SchemaArn: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListFacetNamesRequest = S.suspend(() =>
  S.Struct({
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListFacetNamesRequest",
}) as any as S.Schema<ListFacetNamesRequest>;
export interface ListManagedSchemaArnsRequest {
  SchemaArn?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListManagedSchemaArnsRequest = S.suspend(() =>
  S.Struct({
    SchemaArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListManagedSchemaArnsRequest",
}) as any as S.Schema<ListManagedSchemaArnsRequest>;
export interface ListObjectAttributesRequest {
  DirectoryArn: string;
  ObjectReference: ObjectReference;
  NextToken?: string;
  MaxResults?: number;
  ConsistencyLevel?: string;
  FacetFilter?: SchemaFacet;
}
export const ListObjectAttributesRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
    FacetFilter: S.optional(SchemaFacet),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListObjectAttributesRequest",
}) as any as S.Schema<ListObjectAttributesRequest>;
export interface ListObjectChildrenRequest {
  DirectoryArn: string;
  ObjectReference: ObjectReference;
  NextToken?: string;
  MaxResults?: number;
  ConsistencyLevel?: string;
}
export const ListObjectChildrenRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListObjectChildrenRequest",
}) as any as S.Schema<ListObjectChildrenRequest>;
export interface ListObjectParentPathsRequest {
  DirectoryArn: string;
  ObjectReference: ObjectReference;
  NextToken?: string;
  MaxResults?: number;
}
export const ListObjectParentPathsRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListObjectParentPathsRequest",
}) as any as S.Schema<ListObjectParentPathsRequest>;
export interface ListObjectParentsRequest {
  DirectoryArn: string;
  ObjectReference: ObjectReference;
  NextToken?: string;
  MaxResults?: number;
  ConsistencyLevel?: string;
  IncludeAllLinksToEachParent?: boolean;
}
export const ListObjectParentsRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
    IncludeAllLinksToEachParent: S.optional(S.Boolean),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListObjectParentsRequest",
}) as any as S.Schema<ListObjectParentsRequest>;
export interface ListObjectPoliciesRequest {
  DirectoryArn: string;
  ObjectReference: ObjectReference;
  NextToken?: string;
  MaxResults?: number;
  ConsistencyLevel?: string;
}
export const ListObjectPoliciesRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListObjectPoliciesRequest",
}) as any as S.Schema<ListObjectPoliciesRequest>;
export interface TypedAttributeValueRange {
  StartMode: string;
  StartValue?: (typeof TypedAttributeValue)["Type"];
  EndMode: string;
  EndValue?: (typeof TypedAttributeValue)["Type"];
}
export const TypedAttributeValueRange = S.suspend(() =>
  S.Struct({
    StartMode: S.String,
    StartValue: S.optional(TypedAttributeValue),
    EndMode: S.String,
    EndValue: S.optional(TypedAttributeValue),
  }),
).annotations({
  identifier: "TypedAttributeValueRange",
}) as any as S.Schema<TypedAttributeValueRange>;
export interface TypedLinkAttributeRange {
  AttributeName?: string;
  Range: TypedAttributeValueRange;
}
export const TypedLinkAttributeRange = S.suspend(() =>
  S.Struct({
    AttributeName: S.optional(S.String),
    Range: TypedAttributeValueRange,
  }),
).annotations({
  identifier: "TypedLinkAttributeRange",
}) as any as S.Schema<TypedLinkAttributeRange>;
export type TypedLinkAttributeRangeList = TypedLinkAttributeRange[];
export const TypedLinkAttributeRangeList = S.Array(TypedLinkAttributeRange);
export interface ListOutgoingTypedLinksRequest {
  DirectoryArn: string;
  ObjectReference: ObjectReference;
  FilterAttributeRanges?: TypedLinkAttributeRangeList;
  FilterTypedLink?: TypedLinkSchemaAndFacetName;
  NextToken?: string;
  MaxResults?: number;
  ConsistencyLevel?: string;
}
export const ListOutgoingTypedLinksRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    FilterAttributeRanges: S.optional(TypedLinkAttributeRangeList),
    FilterTypedLink: S.optional(TypedLinkSchemaAndFacetName),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ConsistencyLevel: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListOutgoingTypedLinksRequest",
}) as any as S.Schema<ListOutgoingTypedLinksRequest>;
export interface ListPolicyAttachmentsRequest {
  DirectoryArn: string;
  PolicyReference: ObjectReference;
  NextToken?: string;
  MaxResults?: number;
  ConsistencyLevel?: string;
}
export const ListPolicyAttachmentsRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    PolicyReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListPolicyAttachmentsRequest",
}) as any as S.Schema<ListPolicyAttachmentsRequest>;
export interface ListPublishedSchemaArnsRequest {
  SchemaArn?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListPublishedSchemaArnsRequest = S.suspend(() =>
  S.Struct({
    SchemaArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListPublishedSchemaArnsRequest",
}) as any as S.Schema<ListPublishedSchemaArnsRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/amazonclouddirectory/2017-01-11/tags" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ListTypedLinkFacetAttributesRequest {
  SchemaArn: string;
  Name: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListTypedLinkFacetAttributesRequest = S.suspend(() =>
  S.Struct({
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListTypedLinkFacetAttributesRequest",
}) as any as S.Schema<ListTypedLinkFacetAttributesRequest>;
export interface ListTypedLinkFacetNamesRequest {
  SchemaArn: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListTypedLinkFacetNamesRequest = S.suspend(() =>
  S.Struct({
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListTypedLinkFacetNamesRequest",
}) as any as S.Schema<ListTypedLinkFacetNamesRequest>;
export interface LookupPolicyRequest {
  DirectoryArn: string;
  ObjectReference: ObjectReference;
  NextToken?: string;
  MaxResults?: number;
}
export const LookupPolicyRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "LookupPolicyRequest",
}) as any as S.Schema<LookupPolicyRequest>;
export interface PublishSchemaRequest {
  DevelopmentSchemaArn: string;
  Version: string;
  MinorVersion?: string;
  Name?: string;
}
export const PublishSchemaRequest = S.suspend(() =>
  S.Struct({
    DevelopmentSchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Version: S.String,
    MinorVersion: S.optional(S.String),
    Name: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "PublishSchemaRequest",
}) as any as S.Schema<PublishSchemaRequest>;
export interface PutSchemaFromJsonRequest {
  SchemaArn: string;
  Document: string;
}
export const PutSchemaFromJsonRequest = S.suspend(() =>
  S.Struct({
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Document: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "PutSchemaFromJsonRequest",
}) as any as S.Schema<PutSchemaFromJsonRequest>;
export interface RemoveFacetFromObjectRequest {
  DirectoryArn: string;
  SchemaFacet: SchemaFacet;
  ObjectReference: ObjectReference;
}
export const RemoveFacetFromObjectRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    SchemaFacet: SchemaFacet,
    ObjectReference: ObjectReference,
  }).pipe(
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
  ),
).annotations({
  identifier: "RemoveFacetFromObjectRequest",
}) as any as S.Schema<RemoveFacetFromObjectRequest>;
export interface RemoveFacetFromObjectResponse {}
export const RemoveFacetFromObjectResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RemoveFacetFromObjectResponse",
}) as any as S.Schema<RemoveFacetFromObjectResponse>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: TagKeyList }).pipe(
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
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateSchemaRequest {
  SchemaArn: string;
  Name: string;
}
export const UpdateSchemaRequest = S.suspend(() =>
  S.Struct({
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateSchemaRequest",
}) as any as S.Schema<UpdateSchemaRequest>;
export interface UpgradeAppliedSchemaRequest {
  PublishedSchemaArn: string;
  DirectoryArn: string;
  DryRun?: boolean;
}
export const UpgradeAppliedSchemaRequest = S.suspend(() =>
  S.Struct({
    PublishedSchemaArn: S.String,
    DirectoryArn: S.String,
    DryRun: S.optional(S.Boolean),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpgradeAppliedSchemaRequest",
}) as any as S.Schema<UpgradeAppliedSchemaRequest>;
export interface UpgradePublishedSchemaRequest {
  DevelopmentSchemaArn: string;
  PublishedSchemaArn: string;
  MinorVersion: string;
  DryRun?: boolean;
}
export const UpgradePublishedSchemaRequest = S.suspend(() =>
  S.Struct({
    DevelopmentSchemaArn: S.String,
    PublishedSchemaArn: S.String,
    MinorVersion: S.String,
    DryRun: S.optional(S.Boolean),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpgradePublishedSchemaRequest",
}) as any as S.Schema<UpgradePublishedSchemaRequest>;
export type AttributeKeyList = AttributeKey[];
export const AttributeKeyList = S.Array(AttributeKey);
export type Arns = string[];
export const Arns = S.Array(S.String);
export interface Directory {
  Name?: string;
  DirectoryArn?: string;
  State?: string;
  CreationDateTime?: Date;
}
export const Directory = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    DirectoryArn: S.optional(S.String),
    State: S.optional(S.String),
    CreationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "Directory" }) as any as S.Schema<Directory>;
export type DirectoryList = Directory[];
export const DirectoryList = S.Array(Directory);
export type FacetNameList = string[];
export const FacetNameList = S.Array(S.String);
export interface ObjectAttributeRange {
  AttributeKey?: AttributeKey;
  Range?: TypedAttributeValueRange;
}
export const ObjectAttributeRange = S.suspend(() =>
  S.Struct({
    AttributeKey: S.optional(AttributeKey),
    Range: S.optional(TypedAttributeValueRange),
  }),
).annotations({
  identifier: "ObjectAttributeRange",
}) as any as S.Schema<ObjectAttributeRange>;
export type ObjectAttributeRangeList = ObjectAttributeRange[];
export const ObjectAttributeRangeList = S.Array(ObjectAttributeRange);
export type ObjectIdentifierList = string[];
export const ObjectIdentifierList = S.Array(S.String);
export type TypedLinkSpecifierList = TypedLinkSpecifier[];
export const TypedLinkSpecifierList = S.Array(TypedLinkSpecifier);
export type TypedLinkNameList = string[];
export const TypedLinkNameList = S.Array(S.String);
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export type RuleParameterMap = { [key: string]: string };
export const RuleParameterMap = S.Record({ key: S.String, value: S.String });
export interface Rule {
  Type?: string;
  Parameters?: RuleParameterMap;
}
export const Rule = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Parameters: S.optional(RuleParameterMap),
  }),
).annotations({ identifier: "Rule" }) as any as S.Schema<Rule>;
export type RuleMap = { [key: string]: Rule };
export const RuleMap = S.Record({ key: S.String, value: Rule });
export interface FacetAttributeDefinition {
  Type: string;
  DefaultValue?: (typeof TypedAttributeValue)["Type"];
  IsImmutable?: boolean;
  Rules?: RuleMap;
}
export const FacetAttributeDefinition = S.suspend(() =>
  S.Struct({
    Type: S.String,
    DefaultValue: S.optional(TypedAttributeValue),
    IsImmutable: S.optional(S.Boolean),
    Rules: S.optional(RuleMap),
  }),
).annotations({
  identifier: "FacetAttributeDefinition",
}) as any as S.Schema<FacetAttributeDefinition>;
export interface FacetAttributeReference {
  TargetFacetName: string;
  TargetAttributeName: string;
}
export const FacetAttributeReference = S.suspend(() =>
  S.Struct({ TargetFacetName: S.String, TargetAttributeName: S.String }),
).annotations({
  identifier: "FacetAttributeReference",
}) as any as S.Schema<FacetAttributeReference>;
export interface FacetAttribute {
  Name: string;
  AttributeDefinition?: FacetAttributeDefinition;
  AttributeReference?: FacetAttributeReference;
  RequiredBehavior?: string;
}
export const FacetAttribute = S.suspend(() =>
  S.Struct({
    Name: S.String,
    AttributeDefinition: S.optional(FacetAttributeDefinition),
    AttributeReference: S.optional(FacetAttributeReference),
    RequiredBehavior: S.optional(S.String),
  }),
).annotations({
  identifier: "FacetAttribute",
}) as any as S.Schema<FacetAttribute>;
export interface FacetAttributeUpdate {
  Attribute?: FacetAttribute;
  Action?: string;
}
export const FacetAttributeUpdate = S.suspend(() =>
  S.Struct({
    Attribute: S.optional(FacetAttribute),
    Action: S.optional(S.String),
  }),
).annotations({
  identifier: "FacetAttributeUpdate",
}) as any as S.Schema<FacetAttributeUpdate>;
export type FacetAttributeUpdateList = FacetAttributeUpdate[];
export const FacetAttributeUpdateList = S.Array(FacetAttributeUpdate);
export interface TypedLinkAttributeDefinition {
  Name: string;
  Type: string;
  DefaultValue?: (typeof TypedAttributeValue)["Type"];
  IsImmutable?: boolean;
  Rules?: RuleMap;
  RequiredBehavior: string;
}
export const TypedLinkAttributeDefinition = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Type: S.String,
    DefaultValue: S.optional(TypedAttributeValue),
    IsImmutable: S.optional(S.Boolean),
    Rules: S.optional(RuleMap),
    RequiredBehavior: S.String,
  }),
).annotations({
  identifier: "TypedLinkAttributeDefinition",
}) as any as S.Schema<TypedLinkAttributeDefinition>;
export interface TypedLinkFacetAttributeUpdate {
  Attribute: TypedLinkAttributeDefinition;
  Action: string;
}
export const TypedLinkFacetAttributeUpdate = S.suspend(() =>
  S.Struct({ Attribute: TypedLinkAttributeDefinition, Action: S.String }),
).annotations({
  identifier: "TypedLinkFacetAttributeUpdate",
}) as any as S.Schema<TypedLinkFacetAttributeUpdate>;
export type TypedLinkFacetAttributeUpdateList = TypedLinkFacetAttributeUpdate[];
export const TypedLinkFacetAttributeUpdateList = S.Array(
  TypedLinkFacetAttributeUpdate,
);
export interface ApplySchemaResponse {
  AppliedSchemaArn?: string;
  DirectoryArn?: string;
}
export const ApplySchemaResponse = S.suspend(() =>
  S.Struct({
    AppliedSchemaArn: S.optional(S.String),
    DirectoryArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ApplySchemaResponse",
}) as any as S.Schema<ApplySchemaResponse>;
export interface AttachObjectResponse {
  AttachedObjectIdentifier?: string;
}
export const AttachObjectResponse = S.suspend(() =>
  S.Struct({ AttachedObjectIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "AttachObjectResponse",
}) as any as S.Schema<AttachObjectResponse>;
export interface AttachToIndexResponse {
  AttachedObjectIdentifier?: string;
}
export const AttachToIndexResponse = S.suspend(() =>
  S.Struct({ AttachedObjectIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "AttachToIndexResponse",
}) as any as S.Schema<AttachToIndexResponse>;
export interface AttachTypedLinkRequest {
  DirectoryArn: string;
  SourceObjectReference: ObjectReference;
  TargetObjectReference: ObjectReference;
  TypedLinkFacet: TypedLinkSchemaAndFacetName;
  Attributes: AttributeNameAndValueList;
}
export const AttachTypedLinkRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    SourceObjectReference: ObjectReference,
    TargetObjectReference: ObjectReference,
    TypedLinkFacet: TypedLinkSchemaAndFacetName,
    Attributes: AttributeNameAndValueList,
  }).pipe(
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
  ),
).annotations({
  identifier: "AttachTypedLinkRequest",
}) as any as S.Schema<AttachTypedLinkRequest>;
export interface CreateDirectoryResponse {
  DirectoryArn: string;
  Name: string;
  ObjectIdentifier: string;
  AppliedSchemaArn: string;
}
export const CreateDirectoryResponse = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String,
    Name: S.String,
    ObjectIdentifier: S.String,
    AppliedSchemaArn: S.String,
  }),
).annotations({
  identifier: "CreateDirectoryResponse",
}) as any as S.Schema<CreateDirectoryResponse>;
export interface CreateIndexRequest {
  DirectoryArn: string;
  OrderedIndexedAttributeList: AttributeKeyList;
  IsUnique: boolean;
  ParentReference?: ObjectReference;
  LinkName?: string;
}
export const CreateIndexRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    OrderedIndexedAttributeList: AttributeKeyList,
    IsUnique: S.Boolean,
    ParentReference: S.optional(ObjectReference),
    LinkName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/amazonclouddirectory/2017-01-11/index" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIndexRequest",
}) as any as S.Schema<CreateIndexRequest>;
export interface CreateObjectResponse {
  ObjectIdentifier?: string;
}
export const CreateObjectResponse = S.suspend(() =>
  S.Struct({ ObjectIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "CreateObjectResponse",
}) as any as S.Schema<CreateObjectResponse>;
export interface CreateSchemaResponse {
  SchemaArn?: string;
}
export const CreateSchemaResponse = S.suspend(() =>
  S.Struct({ SchemaArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateSchemaResponse",
}) as any as S.Schema<CreateSchemaResponse>;
export interface DeleteDirectoryResponse {
  DirectoryArn: string;
}
export const DeleteDirectoryResponse = S.suspend(() =>
  S.Struct({ DirectoryArn: S.String }),
).annotations({
  identifier: "DeleteDirectoryResponse",
}) as any as S.Schema<DeleteDirectoryResponse>;
export interface DeleteSchemaResponse {
  SchemaArn?: string;
}
export const DeleteSchemaResponse = S.suspend(() =>
  S.Struct({ SchemaArn: S.optional(S.String) }),
).annotations({
  identifier: "DeleteSchemaResponse",
}) as any as S.Schema<DeleteSchemaResponse>;
export interface DetachFromIndexResponse {
  DetachedObjectIdentifier?: string;
}
export const DetachFromIndexResponse = S.suspend(() =>
  S.Struct({ DetachedObjectIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "DetachFromIndexResponse",
}) as any as S.Schema<DetachFromIndexResponse>;
export interface DetachObjectResponse {
  DetachedObjectIdentifier?: string;
}
export const DetachObjectResponse = S.suspend(() =>
  S.Struct({ DetachedObjectIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "DetachObjectResponse",
}) as any as S.Schema<DetachObjectResponse>;
export interface DetachTypedLinkRequest {
  DirectoryArn: string;
  TypedLinkSpecifier: TypedLinkSpecifier;
}
export const DetachTypedLinkRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    TypedLinkSpecifier: TypedLinkSpecifier,
  }).pipe(
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
  ),
).annotations({
  identifier: "DetachTypedLinkRequest",
}) as any as S.Schema<DetachTypedLinkRequest>;
export interface DetachTypedLinkResponse {}
export const DetachTypedLinkResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DetachTypedLinkResponse",
}) as any as S.Schema<DetachTypedLinkResponse>;
export interface DisableDirectoryResponse {
  DirectoryArn: string;
}
export const DisableDirectoryResponse = S.suspend(() =>
  S.Struct({ DirectoryArn: S.String }),
).annotations({
  identifier: "DisableDirectoryResponse",
}) as any as S.Schema<DisableDirectoryResponse>;
export interface EnableDirectoryResponse {
  DirectoryArn: string;
}
export const EnableDirectoryResponse = S.suspend(() =>
  S.Struct({ DirectoryArn: S.String }),
).annotations({
  identifier: "EnableDirectoryResponse",
}) as any as S.Schema<EnableDirectoryResponse>;
export interface GetAppliedSchemaVersionResponse {
  AppliedSchemaArn?: string;
}
export const GetAppliedSchemaVersionResponse = S.suspend(() =>
  S.Struct({ AppliedSchemaArn: S.optional(S.String) }),
).annotations({
  identifier: "GetAppliedSchemaVersionResponse",
}) as any as S.Schema<GetAppliedSchemaVersionResponse>;
export interface GetLinkAttributesResponse {
  Attributes?: AttributeKeyAndValueList;
}
export const GetLinkAttributesResponse = S.suspend(() =>
  S.Struct({ Attributes: S.optional(AttributeKeyAndValueList) }),
).annotations({
  identifier: "GetLinkAttributesResponse",
}) as any as S.Schema<GetLinkAttributesResponse>;
export interface GetObjectAttributesResponse {
  Attributes?: AttributeKeyAndValueList;
}
export const GetObjectAttributesResponse = S.suspend(() =>
  S.Struct({ Attributes: S.optional(AttributeKeyAndValueList) }),
).annotations({
  identifier: "GetObjectAttributesResponse",
}) as any as S.Schema<GetObjectAttributesResponse>;
export interface GetObjectInformationResponse {
  SchemaFacets?: SchemaFacetList;
  ObjectIdentifier?: string;
}
export const GetObjectInformationResponse = S.suspend(() =>
  S.Struct({
    SchemaFacets: S.optional(SchemaFacetList),
    ObjectIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "GetObjectInformationResponse",
}) as any as S.Schema<GetObjectInformationResponse>;
export interface GetSchemaAsJsonResponse {
  Name?: string;
  Document?: string;
}
export const GetSchemaAsJsonResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Document: S.optional(S.String) }),
).annotations({
  identifier: "GetSchemaAsJsonResponse",
}) as any as S.Schema<GetSchemaAsJsonResponse>;
export interface GetTypedLinkFacetInformationResponse {
  IdentityAttributeOrder?: AttributeNameList;
}
export const GetTypedLinkFacetInformationResponse = S.suspend(() =>
  S.Struct({ IdentityAttributeOrder: S.optional(AttributeNameList) }),
).annotations({
  identifier: "GetTypedLinkFacetInformationResponse",
}) as any as S.Schema<GetTypedLinkFacetInformationResponse>;
export interface ListAppliedSchemaArnsResponse {
  SchemaArns?: Arns;
  NextToken?: string;
}
export const ListAppliedSchemaArnsResponse = S.suspend(() =>
  S.Struct({ SchemaArns: S.optional(Arns), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAppliedSchemaArnsResponse",
}) as any as S.Schema<ListAppliedSchemaArnsResponse>;
export interface ListDevelopmentSchemaArnsResponse {
  SchemaArns?: Arns;
  NextToken?: string;
}
export const ListDevelopmentSchemaArnsResponse = S.suspend(() =>
  S.Struct({ SchemaArns: S.optional(Arns), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDevelopmentSchemaArnsResponse",
}) as any as S.Schema<ListDevelopmentSchemaArnsResponse>;
export interface ListDirectoriesResponse {
  Directories: DirectoryList;
  NextToken?: string;
}
export const ListDirectoriesResponse = S.suspend(() =>
  S.Struct({ Directories: DirectoryList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDirectoriesResponse",
}) as any as S.Schema<ListDirectoriesResponse>;
export type FacetAttributeList = FacetAttribute[];
export const FacetAttributeList = S.Array(FacetAttribute);
export interface ListFacetAttributesResponse {
  Attributes?: FacetAttributeList;
  NextToken?: string;
}
export const ListFacetAttributesResponse = S.suspend(() =>
  S.Struct({
    Attributes: S.optional(FacetAttributeList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFacetAttributesResponse",
}) as any as S.Schema<ListFacetAttributesResponse>;
export interface ListFacetNamesResponse {
  FacetNames?: FacetNameList;
  NextToken?: string;
}
export const ListFacetNamesResponse = S.suspend(() =>
  S.Struct({
    FacetNames: S.optional(FacetNameList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFacetNamesResponse",
}) as any as S.Schema<ListFacetNamesResponse>;
export interface ListIndexRequest {
  DirectoryArn: string;
  RangesOnIndexedValues?: ObjectAttributeRangeList;
  IndexReference: ObjectReference;
  MaxResults?: number;
  NextToken?: string;
  ConsistencyLevel?: string;
}
export const ListIndexRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    RangesOnIndexedValues: S.optional(ObjectAttributeRangeList),
    IndexReference: ObjectReference,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListIndexRequest",
}) as any as S.Schema<ListIndexRequest>;
export interface ListManagedSchemaArnsResponse {
  SchemaArns?: Arns;
  NextToken?: string;
}
export const ListManagedSchemaArnsResponse = S.suspend(() =>
  S.Struct({ SchemaArns: S.optional(Arns), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListManagedSchemaArnsResponse",
}) as any as S.Schema<ListManagedSchemaArnsResponse>;
export interface ListObjectAttributesResponse {
  Attributes?: AttributeKeyAndValueList;
  NextToken?: string;
}
export const ListObjectAttributesResponse = S.suspend(() =>
  S.Struct({
    Attributes: S.optional(AttributeKeyAndValueList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListObjectAttributesResponse",
}) as any as S.Schema<ListObjectAttributesResponse>;
export interface ListObjectPoliciesResponse {
  AttachedPolicyIds?: ObjectIdentifierList;
  NextToken?: string;
}
export const ListObjectPoliciesResponse = S.suspend(() =>
  S.Struct({
    AttachedPolicyIds: S.optional(ObjectIdentifierList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListObjectPoliciesResponse",
}) as any as S.Schema<ListObjectPoliciesResponse>;
export interface ListOutgoingTypedLinksResponse {
  TypedLinkSpecifiers?: TypedLinkSpecifierList;
  NextToken?: string;
}
export const ListOutgoingTypedLinksResponse = S.suspend(() =>
  S.Struct({
    TypedLinkSpecifiers: S.optional(TypedLinkSpecifierList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOutgoingTypedLinksResponse",
}) as any as S.Schema<ListOutgoingTypedLinksResponse>;
export interface ListPolicyAttachmentsResponse {
  ObjectIdentifiers?: ObjectIdentifierList;
  NextToken?: string;
}
export const ListPolicyAttachmentsResponse = S.suspend(() =>
  S.Struct({
    ObjectIdentifiers: S.optional(ObjectIdentifierList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPolicyAttachmentsResponse",
}) as any as S.Schema<ListPolicyAttachmentsResponse>;
export interface ListPublishedSchemaArnsResponse {
  SchemaArns?: Arns;
  NextToken?: string;
}
export const ListPublishedSchemaArnsResponse = S.suspend(() =>
  S.Struct({ SchemaArns: S.optional(Arns), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListPublishedSchemaArnsResponse",
}) as any as S.Schema<ListPublishedSchemaArnsResponse>;
export interface ListTagsForResourceResponse {
  Tags?: TagList;
  NextToken?: string;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export type TypedLinkAttributeDefinitionList = TypedLinkAttributeDefinition[];
export const TypedLinkAttributeDefinitionList = S.Array(
  TypedLinkAttributeDefinition,
);
export interface ListTypedLinkFacetAttributesResponse {
  Attributes?: TypedLinkAttributeDefinitionList;
  NextToken?: string;
}
export const ListTypedLinkFacetAttributesResponse = S.suspend(() =>
  S.Struct({
    Attributes: S.optional(TypedLinkAttributeDefinitionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTypedLinkFacetAttributesResponse",
}) as any as S.Schema<ListTypedLinkFacetAttributesResponse>;
export interface ListTypedLinkFacetNamesResponse {
  FacetNames?: TypedLinkNameList;
  NextToken?: string;
}
export const ListTypedLinkFacetNamesResponse = S.suspend(() =>
  S.Struct({
    FacetNames: S.optional(TypedLinkNameList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTypedLinkFacetNamesResponse",
}) as any as S.Schema<ListTypedLinkFacetNamesResponse>;
export interface PublishSchemaResponse {
  PublishedSchemaArn?: string;
}
export const PublishSchemaResponse = S.suspend(() =>
  S.Struct({ PublishedSchemaArn: S.optional(S.String) }),
).annotations({
  identifier: "PublishSchemaResponse",
}) as any as S.Schema<PublishSchemaResponse>;
export interface PutSchemaFromJsonResponse {
  Arn?: string;
}
export const PutSchemaFromJsonResponse = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "PutSchemaFromJsonResponse",
}) as any as S.Schema<PutSchemaFromJsonResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: TagList }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/amazonclouddirectory/2017-01-11/tags/add",
      }),
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
export interface UpdateFacetRequest {
  SchemaArn: string;
  Name: string;
  AttributeUpdates?: FacetAttributeUpdateList;
  ObjectType?: string;
}
export const UpdateFacetRequest = S.suspend(() =>
  S.Struct({
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
    AttributeUpdates: S.optional(FacetAttributeUpdateList),
    ObjectType: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/amazonclouddirectory/2017-01-11/facet" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFacetRequest",
}) as any as S.Schema<UpdateFacetRequest>;
export interface UpdateFacetResponse {}
export const UpdateFacetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateFacetResponse",
}) as any as S.Schema<UpdateFacetResponse>;
export interface UpdateSchemaResponse {
  SchemaArn?: string;
}
export const UpdateSchemaResponse = S.suspend(() =>
  S.Struct({ SchemaArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateSchemaResponse",
}) as any as S.Schema<UpdateSchemaResponse>;
export interface UpdateTypedLinkFacetRequest {
  SchemaArn: string;
  Name: string;
  AttributeUpdates: TypedLinkFacetAttributeUpdateList;
  IdentityAttributeOrder: AttributeNameList;
}
export const UpdateTypedLinkFacetRequest = S.suspend(() =>
  S.Struct({
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
    AttributeUpdates: TypedLinkFacetAttributeUpdateList,
    IdentityAttributeOrder: AttributeNameList,
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateTypedLinkFacetRequest",
}) as any as S.Schema<UpdateTypedLinkFacetRequest>;
export interface UpdateTypedLinkFacetResponse {}
export const UpdateTypedLinkFacetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateTypedLinkFacetResponse",
}) as any as S.Schema<UpdateTypedLinkFacetResponse>;
export interface UpgradeAppliedSchemaResponse {
  UpgradedSchemaArn?: string;
  DirectoryArn?: string;
}
export const UpgradeAppliedSchemaResponse = S.suspend(() =>
  S.Struct({
    UpgradedSchemaArn: S.optional(S.String),
    DirectoryArn: S.optional(S.String),
  }),
).annotations({
  identifier: "UpgradeAppliedSchemaResponse",
}) as any as S.Schema<UpgradeAppliedSchemaResponse>;
export interface UpgradePublishedSchemaResponse {
  UpgradedSchemaArn?: string;
}
export const UpgradePublishedSchemaResponse = S.suspend(() =>
  S.Struct({ UpgradedSchemaArn: S.optional(S.String) }),
).annotations({
  identifier: "UpgradePublishedSchemaResponse",
}) as any as S.Schema<UpgradePublishedSchemaResponse>;
export interface BatchListObjectAttributes {
  ObjectReference: ObjectReference;
  NextToken?: string;
  MaxResults?: number;
  FacetFilter?: SchemaFacet;
}
export const BatchListObjectAttributes = S.suspend(() =>
  S.Struct({
    ObjectReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    FacetFilter: S.optional(SchemaFacet),
  }),
).annotations({
  identifier: "BatchListObjectAttributes",
}) as any as S.Schema<BatchListObjectAttributes>;
export interface BatchListObjectChildren {
  ObjectReference: ObjectReference;
  NextToken?: string;
  MaxResults?: number;
}
export const BatchListObjectChildren = S.suspend(() =>
  S.Struct({
    ObjectReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }),
).annotations({
  identifier: "BatchListObjectChildren",
}) as any as S.Schema<BatchListObjectChildren>;
export interface BatchListAttachedIndices {
  TargetReference: ObjectReference;
  NextToken?: string;
  MaxResults?: number;
}
export const BatchListAttachedIndices = S.suspend(() =>
  S.Struct({
    TargetReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }),
).annotations({
  identifier: "BatchListAttachedIndices",
}) as any as S.Schema<BatchListAttachedIndices>;
export interface BatchListObjectParentPaths {
  ObjectReference: ObjectReference;
  NextToken?: string;
  MaxResults?: number;
}
export const BatchListObjectParentPaths = S.suspend(() =>
  S.Struct({
    ObjectReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }),
).annotations({
  identifier: "BatchListObjectParentPaths",
}) as any as S.Schema<BatchListObjectParentPaths>;
export interface BatchGetObjectInformation {
  ObjectReference: ObjectReference;
}
export const BatchGetObjectInformation = S.suspend(() =>
  S.Struct({ ObjectReference: ObjectReference }),
).annotations({
  identifier: "BatchGetObjectInformation",
}) as any as S.Schema<BatchGetObjectInformation>;
export interface BatchGetObjectAttributes {
  ObjectReference: ObjectReference;
  SchemaFacet: SchemaFacet;
  AttributeNames: AttributeNameList;
}
export const BatchGetObjectAttributes = S.suspend(() =>
  S.Struct({
    ObjectReference: ObjectReference,
    SchemaFacet: SchemaFacet,
    AttributeNames: AttributeNameList,
  }),
).annotations({
  identifier: "BatchGetObjectAttributes",
}) as any as S.Schema<BatchGetObjectAttributes>;
export interface BatchListObjectParents {
  ObjectReference: ObjectReference;
  NextToken?: string;
  MaxResults?: number;
}
export const BatchListObjectParents = S.suspend(() =>
  S.Struct({
    ObjectReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }),
).annotations({
  identifier: "BatchListObjectParents",
}) as any as S.Schema<BatchListObjectParents>;
export interface BatchListObjectPolicies {
  ObjectReference: ObjectReference;
  NextToken?: string;
  MaxResults?: number;
}
export const BatchListObjectPolicies = S.suspend(() =>
  S.Struct({
    ObjectReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }),
).annotations({
  identifier: "BatchListObjectPolicies",
}) as any as S.Schema<BatchListObjectPolicies>;
export interface BatchListPolicyAttachments {
  PolicyReference: ObjectReference;
  NextToken?: string;
  MaxResults?: number;
}
export const BatchListPolicyAttachments = S.suspend(() =>
  S.Struct({
    PolicyReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }),
).annotations({
  identifier: "BatchListPolicyAttachments",
}) as any as S.Schema<BatchListPolicyAttachments>;
export interface BatchLookupPolicy {
  ObjectReference: ObjectReference;
  NextToken?: string;
  MaxResults?: number;
}
export const BatchLookupPolicy = S.suspend(() =>
  S.Struct({
    ObjectReference: ObjectReference,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }),
).annotations({
  identifier: "BatchLookupPolicy",
}) as any as S.Schema<BatchLookupPolicy>;
export interface BatchListIndex {
  RangesOnIndexedValues?: ObjectAttributeRangeList;
  IndexReference: ObjectReference;
  MaxResults?: number;
  NextToken?: string;
}
export const BatchListIndex = S.suspend(() =>
  S.Struct({
    RangesOnIndexedValues: S.optional(ObjectAttributeRangeList),
    IndexReference: ObjectReference,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchListIndex",
}) as any as S.Schema<BatchListIndex>;
export interface BatchListOutgoingTypedLinks {
  ObjectReference: ObjectReference;
  FilterAttributeRanges?: TypedLinkAttributeRangeList;
  FilterTypedLink?: TypedLinkSchemaAndFacetName;
  NextToken?: string;
  MaxResults?: number;
}
export const BatchListOutgoingTypedLinks = S.suspend(() =>
  S.Struct({
    ObjectReference: ObjectReference,
    FilterAttributeRanges: S.optional(TypedLinkAttributeRangeList),
    FilterTypedLink: S.optional(TypedLinkSchemaAndFacetName),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }),
).annotations({
  identifier: "BatchListOutgoingTypedLinks",
}) as any as S.Schema<BatchListOutgoingTypedLinks>;
export interface BatchListIncomingTypedLinks {
  ObjectReference: ObjectReference;
  FilterAttributeRanges?: TypedLinkAttributeRangeList;
  FilterTypedLink?: TypedLinkSchemaAndFacetName;
  NextToken?: string;
  MaxResults?: number;
}
export const BatchListIncomingTypedLinks = S.suspend(() =>
  S.Struct({
    ObjectReference: ObjectReference,
    FilterAttributeRanges: S.optional(TypedLinkAttributeRangeList),
    FilterTypedLink: S.optional(TypedLinkSchemaAndFacetName),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }),
).annotations({
  identifier: "BatchListIncomingTypedLinks",
}) as any as S.Schema<BatchListIncomingTypedLinks>;
export interface BatchGetLinkAttributes {
  TypedLinkSpecifier: TypedLinkSpecifier;
  AttributeNames: AttributeNameList;
}
export const BatchGetLinkAttributes = S.suspend(() =>
  S.Struct({
    TypedLinkSpecifier: TypedLinkSpecifier,
    AttributeNames: AttributeNameList,
  }),
).annotations({
  identifier: "BatchGetLinkAttributes",
}) as any as S.Schema<BatchGetLinkAttributes>;
export interface BatchCreateObject {
  SchemaFacet: SchemaFacetList;
  ObjectAttributeList: AttributeKeyAndValueList;
  ParentReference?: ObjectReference;
  LinkName?: string;
  BatchReferenceName?: string;
}
export const BatchCreateObject = S.suspend(() =>
  S.Struct({
    SchemaFacet: SchemaFacetList,
    ObjectAttributeList: AttributeKeyAndValueList,
    ParentReference: S.optional(ObjectReference),
    LinkName: S.optional(S.String),
    BatchReferenceName: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchCreateObject",
}) as any as S.Schema<BatchCreateObject>;
export interface BatchAttachObject {
  ParentReference: ObjectReference;
  ChildReference: ObjectReference;
  LinkName: string;
}
export const BatchAttachObject = S.suspend(() =>
  S.Struct({
    ParentReference: ObjectReference,
    ChildReference: ObjectReference,
    LinkName: S.String,
  }),
).annotations({
  identifier: "BatchAttachObject",
}) as any as S.Schema<BatchAttachObject>;
export interface BatchDetachObject {
  ParentReference: ObjectReference;
  LinkName: string;
  BatchReferenceName?: string;
}
export const BatchDetachObject = S.suspend(() =>
  S.Struct({
    ParentReference: ObjectReference,
    LinkName: S.String,
    BatchReferenceName: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchDetachObject",
}) as any as S.Schema<BatchDetachObject>;
export interface ObjectAttributeAction {
  ObjectAttributeActionType?: string;
  ObjectAttributeUpdateValue?: (typeof TypedAttributeValue)["Type"];
}
export const ObjectAttributeAction = S.suspend(() =>
  S.Struct({
    ObjectAttributeActionType: S.optional(S.String),
    ObjectAttributeUpdateValue: S.optional(TypedAttributeValue),
  }),
).annotations({
  identifier: "ObjectAttributeAction",
}) as any as S.Schema<ObjectAttributeAction>;
export interface ObjectAttributeUpdate {
  ObjectAttributeKey?: AttributeKey;
  ObjectAttributeAction?: ObjectAttributeAction;
}
export const ObjectAttributeUpdate = S.suspend(() =>
  S.Struct({
    ObjectAttributeKey: S.optional(AttributeKey),
    ObjectAttributeAction: S.optional(ObjectAttributeAction),
  }),
).annotations({
  identifier: "ObjectAttributeUpdate",
}) as any as S.Schema<ObjectAttributeUpdate>;
export type ObjectAttributeUpdateList = ObjectAttributeUpdate[];
export const ObjectAttributeUpdateList = S.Array(ObjectAttributeUpdate);
export interface BatchUpdateObjectAttributes {
  ObjectReference: ObjectReference;
  AttributeUpdates: ObjectAttributeUpdateList;
}
export const BatchUpdateObjectAttributes = S.suspend(() =>
  S.Struct({
    ObjectReference: ObjectReference,
    AttributeUpdates: ObjectAttributeUpdateList,
  }),
).annotations({
  identifier: "BatchUpdateObjectAttributes",
}) as any as S.Schema<BatchUpdateObjectAttributes>;
export interface BatchDeleteObject {
  ObjectReference: ObjectReference;
}
export const BatchDeleteObject = S.suspend(() =>
  S.Struct({ ObjectReference: ObjectReference }),
).annotations({
  identifier: "BatchDeleteObject",
}) as any as S.Schema<BatchDeleteObject>;
export interface BatchAddFacetToObject {
  SchemaFacet: SchemaFacet;
  ObjectAttributeList: AttributeKeyAndValueList;
  ObjectReference: ObjectReference;
}
export const BatchAddFacetToObject = S.suspend(() =>
  S.Struct({
    SchemaFacet: SchemaFacet,
    ObjectAttributeList: AttributeKeyAndValueList,
    ObjectReference: ObjectReference,
  }),
).annotations({
  identifier: "BatchAddFacetToObject",
}) as any as S.Schema<BatchAddFacetToObject>;
export interface BatchRemoveFacetFromObject {
  SchemaFacet: SchemaFacet;
  ObjectReference: ObjectReference;
}
export const BatchRemoveFacetFromObject = S.suspend(() =>
  S.Struct({ SchemaFacet: SchemaFacet, ObjectReference: ObjectReference }),
).annotations({
  identifier: "BatchRemoveFacetFromObject",
}) as any as S.Schema<BatchRemoveFacetFromObject>;
export interface BatchAttachPolicy {
  PolicyReference: ObjectReference;
  ObjectReference: ObjectReference;
}
export const BatchAttachPolicy = S.suspend(() =>
  S.Struct({
    PolicyReference: ObjectReference,
    ObjectReference: ObjectReference,
  }),
).annotations({
  identifier: "BatchAttachPolicy",
}) as any as S.Schema<BatchAttachPolicy>;
export interface BatchDetachPolicy {
  PolicyReference: ObjectReference;
  ObjectReference: ObjectReference;
}
export const BatchDetachPolicy = S.suspend(() =>
  S.Struct({
    PolicyReference: ObjectReference,
    ObjectReference: ObjectReference,
  }),
).annotations({
  identifier: "BatchDetachPolicy",
}) as any as S.Schema<BatchDetachPolicy>;
export interface BatchCreateIndex {
  OrderedIndexedAttributeList: AttributeKeyList;
  IsUnique: boolean;
  ParentReference?: ObjectReference;
  LinkName?: string;
  BatchReferenceName?: string;
}
export const BatchCreateIndex = S.suspend(() =>
  S.Struct({
    OrderedIndexedAttributeList: AttributeKeyList,
    IsUnique: S.Boolean,
    ParentReference: S.optional(ObjectReference),
    LinkName: S.optional(S.String),
    BatchReferenceName: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchCreateIndex",
}) as any as S.Schema<BatchCreateIndex>;
export interface BatchAttachToIndex {
  IndexReference: ObjectReference;
  TargetReference: ObjectReference;
}
export const BatchAttachToIndex = S.suspend(() =>
  S.Struct({
    IndexReference: ObjectReference,
    TargetReference: ObjectReference,
  }),
).annotations({
  identifier: "BatchAttachToIndex",
}) as any as S.Schema<BatchAttachToIndex>;
export interface BatchDetachFromIndex {
  IndexReference: ObjectReference;
  TargetReference: ObjectReference;
}
export const BatchDetachFromIndex = S.suspend(() =>
  S.Struct({
    IndexReference: ObjectReference,
    TargetReference: ObjectReference,
  }),
).annotations({
  identifier: "BatchDetachFromIndex",
}) as any as S.Schema<BatchDetachFromIndex>;
export interface BatchAttachTypedLink {
  SourceObjectReference: ObjectReference;
  TargetObjectReference: ObjectReference;
  TypedLinkFacet: TypedLinkSchemaAndFacetName;
  Attributes: AttributeNameAndValueList;
}
export const BatchAttachTypedLink = S.suspend(() =>
  S.Struct({
    SourceObjectReference: ObjectReference,
    TargetObjectReference: ObjectReference,
    TypedLinkFacet: TypedLinkSchemaAndFacetName,
    Attributes: AttributeNameAndValueList,
  }),
).annotations({
  identifier: "BatchAttachTypedLink",
}) as any as S.Schema<BatchAttachTypedLink>;
export interface BatchDetachTypedLink {
  TypedLinkSpecifier: TypedLinkSpecifier;
}
export const BatchDetachTypedLink = S.suspend(() =>
  S.Struct({ TypedLinkSpecifier: TypedLinkSpecifier }),
).annotations({
  identifier: "BatchDetachTypedLink",
}) as any as S.Schema<BatchDetachTypedLink>;
export interface LinkAttributeAction {
  AttributeActionType?: string;
  AttributeUpdateValue?: (typeof TypedAttributeValue)["Type"];
}
export const LinkAttributeAction = S.suspend(() =>
  S.Struct({
    AttributeActionType: S.optional(S.String),
    AttributeUpdateValue: S.optional(TypedAttributeValue),
  }),
).annotations({
  identifier: "LinkAttributeAction",
}) as any as S.Schema<LinkAttributeAction>;
export interface LinkAttributeUpdate {
  AttributeKey?: AttributeKey;
  AttributeAction?: LinkAttributeAction;
}
export const LinkAttributeUpdate = S.suspend(() =>
  S.Struct({
    AttributeKey: S.optional(AttributeKey),
    AttributeAction: S.optional(LinkAttributeAction),
  }),
).annotations({
  identifier: "LinkAttributeUpdate",
}) as any as S.Schema<LinkAttributeUpdate>;
export type LinkAttributeUpdateList = LinkAttributeUpdate[];
export const LinkAttributeUpdateList = S.Array(LinkAttributeUpdate);
export interface BatchUpdateLinkAttributes {
  TypedLinkSpecifier: TypedLinkSpecifier;
  AttributeUpdates: LinkAttributeUpdateList;
}
export const BatchUpdateLinkAttributes = S.suspend(() =>
  S.Struct({
    TypedLinkSpecifier: TypedLinkSpecifier,
    AttributeUpdates: LinkAttributeUpdateList,
  }),
).annotations({
  identifier: "BatchUpdateLinkAttributes",
}) as any as S.Schema<BatchUpdateLinkAttributes>;
export interface BatchReadOperation {
  ListObjectAttributes?: BatchListObjectAttributes;
  ListObjectChildren?: BatchListObjectChildren;
  ListAttachedIndices?: BatchListAttachedIndices;
  ListObjectParentPaths?: BatchListObjectParentPaths;
  GetObjectInformation?: BatchGetObjectInformation;
  GetObjectAttributes?: BatchGetObjectAttributes;
  ListObjectParents?: BatchListObjectParents;
  ListObjectPolicies?: BatchListObjectPolicies;
  ListPolicyAttachments?: BatchListPolicyAttachments;
  LookupPolicy?: BatchLookupPolicy;
  ListIndex?: BatchListIndex;
  ListOutgoingTypedLinks?: BatchListOutgoingTypedLinks;
  ListIncomingTypedLinks?: BatchListIncomingTypedLinks;
  GetLinkAttributes?: BatchGetLinkAttributes;
}
export const BatchReadOperation = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "BatchReadOperation",
}) as any as S.Schema<BatchReadOperation>;
export type BatchReadOperationList = BatchReadOperation[];
export const BatchReadOperationList = S.Array(BatchReadOperation);
export interface BatchWriteOperation {
  CreateObject?: BatchCreateObject;
  AttachObject?: BatchAttachObject;
  DetachObject?: BatchDetachObject;
  UpdateObjectAttributes?: BatchUpdateObjectAttributes;
  DeleteObject?: BatchDeleteObject;
  AddFacetToObject?: BatchAddFacetToObject;
  RemoveFacetFromObject?: BatchRemoveFacetFromObject;
  AttachPolicy?: BatchAttachPolicy;
  DetachPolicy?: BatchDetachPolicy;
  CreateIndex?: BatchCreateIndex;
  AttachToIndex?: BatchAttachToIndex;
  DetachFromIndex?: BatchDetachFromIndex;
  AttachTypedLink?: BatchAttachTypedLink;
  DetachTypedLink?: BatchDetachTypedLink;
  UpdateLinkAttributes?: BatchUpdateLinkAttributes;
}
export const BatchWriteOperation = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "BatchWriteOperation",
}) as any as S.Schema<BatchWriteOperation>;
export type BatchWriteOperationList = BatchWriteOperation[];
export const BatchWriteOperationList = S.Array(BatchWriteOperation);
export interface TypedLinkFacet {
  Name: string;
  Attributes: TypedLinkAttributeDefinitionList;
  IdentityAttributeOrder: AttributeNameList;
}
export const TypedLinkFacet = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Attributes: TypedLinkAttributeDefinitionList,
    IdentityAttributeOrder: AttributeNameList,
  }),
).annotations({
  identifier: "TypedLinkFacet",
}) as any as S.Schema<TypedLinkFacet>;
export interface Facet {
  Name?: string;
  ObjectType?: string;
  FacetStyle?: string;
}
export const Facet = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    ObjectType: S.optional(S.String),
    FacetStyle: S.optional(S.String),
  }),
).annotations({ identifier: "Facet" }) as any as S.Schema<Facet>;
export interface IndexAttachment {
  IndexedAttributes?: AttributeKeyAndValueList;
  ObjectIdentifier?: string;
}
export const IndexAttachment = S.suspend(() =>
  S.Struct({
    IndexedAttributes: S.optional(AttributeKeyAndValueList),
    ObjectIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "IndexAttachment",
}) as any as S.Schema<IndexAttachment>;
export type IndexAttachmentList = IndexAttachment[];
export const IndexAttachmentList = S.Array(IndexAttachment);
export type LinkNameToObjectIdentifierMap = { [key: string]: string };
export const LinkNameToObjectIdentifierMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface PathToObjectIdentifiers {
  Path?: string;
  ObjectIdentifiers?: ObjectIdentifierList;
}
export const PathToObjectIdentifiers = S.suspend(() =>
  S.Struct({
    Path: S.optional(S.String),
    ObjectIdentifiers: S.optional(ObjectIdentifierList),
  }),
).annotations({
  identifier: "PathToObjectIdentifiers",
}) as any as S.Schema<PathToObjectIdentifiers>;
export type PathToObjectIdentifiersList = PathToObjectIdentifiers[];
export const PathToObjectIdentifiersList = S.Array(PathToObjectIdentifiers);
export type ObjectIdentifierToLinkNameMap = { [key: string]: string };
export const ObjectIdentifierToLinkNameMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface ObjectIdentifierAndLinkNameTuple {
  ObjectIdentifier?: string;
  LinkName?: string;
}
export const ObjectIdentifierAndLinkNameTuple = S.suspend(() =>
  S.Struct({
    ObjectIdentifier: S.optional(S.String),
    LinkName: S.optional(S.String),
  }),
).annotations({
  identifier: "ObjectIdentifierAndLinkNameTuple",
}) as any as S.Schema<ObjectIdentifierAndLinkNameTuple>;
export type ObjectIdentifierAndLinkNameList =
  ObjectIdentifierAndLinkNameTuple[];
export const ObjectIdentifierAndLinkNameList = S.Array(
  ObjectIdentifierAndLinkNameTuple,
);
export interface AddFacetToObjectRequest {
  DirectoryArn: string;
  SchemaFacet: SchemaFacet;
  ObjectAttributeList?: AttributeKeyAndValueList;
  ObjectReference: ObjectReference;
}
export const AddFacetToObjectRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    SchemaFacet: SchemaFacet,
    ObjectAttributeList: S.optional(AttributeKeyAndValueList),
    ObjectReference: ObjectReference,
  }).pipe(
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
  ),
).annotations({
  identifier: "AddFacetToObjectRequest",
}) as any as S.Schema<AddFacetToObjectRequest>;
export interface AddFacetToObjectResponse {}
export const AddFacetToObjectResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AddFacetToObjectResponse",
}) as any as S.Schema<AddFacetToObjectResponse>;
export interface AttachTypedLinkResponse {
  TypedLinkSpecifier?: TypedLinkSpecifier;
}
export const AttachTypedLinkResponse = S.suspend(() =>
  S.Struct({ TypedLinkSpecifier: S.optional(TypedLinkSpecifier) }),
).annotations({
  identifier: "AttachTypedLinkResponse",
}) as any as S.Schema<AttachTypedLinkResponse>;
export interface BatchReadRequest {
  DirectoryArn: string;
  Operations: BatchReadOperationList;
  ConsistencyLevel?: string;
}
export const BatchReadRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Operations: BatchReadOperationList,
    ConsistencyLevel: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-consistency-level"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "BatchReadRequest",
}) as any as S.Schema<BatchReadRequest>;
export interface BatchWriteRequest {
  DirectoryArn: string;
  Operations: BatchWriteOperationList;
}
export const BatchWriteRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Operations: BatchWriteOperationList,
  }).pipe(
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
  ),
).annotations({
  identifier: "BatchWriteRequest",
}) as any as S.Schema<BatchWriteRequest>;
export interface CreateIndexResponse {
  ObjectIdentifier?: string;
}
export const CreateIndexResponse = S.suspend(() =>
  S.Struct({ ObjectIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "CreateIndexResponse",
}) as any as S.Schema<CreateIndexResponse>;
export interface CreateTypedLinkFacetRequest {
  SchemaArn: string;
  Facet: TypedLinkFacet;
}
export const CreateTypedLinkFacetRequest = S.suspend(() =>
  S.Struct({
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Facet: TypedLinkFacet,
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateTypedLinkFacetRequest",
}) as any as S.Schema<CreateTypedLinkFacetRequest>;
export interface CreateTypedLinkFacetResponse {}
export const CreateTypedLinkFacetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateTypedLinkFacetResponse",
}) as any as S.Schema<CreateTypedLinkFacetResponse>;
export interface GetDirectoryResponse {
  Directory: Directory;
}
export const GetDirectoryResponse = S.suspend(() =>
  S.Struct({ Directory: Directory }),
).annotations({
  identifier: "GetDirectoryResponse",
}) as any as S.Schema<GetDirectoryResponse>;
export interface GetFacetResponse {
  Facet?: Facet;
}
export const GetFacetResponse = S.suspend(() =>
  S.Struct({ Facet: S.optional(Facet) }),
).annotations({
  identifier: "GetFacetResponse",
}) as any as S.Schema<GetFacetResponse>;
export interface ListAttachedIndicesResponse {
  IndexAttachments?: IndexAttachmentList;
  NextToken?: string;
}
export const ListAttachedIndicesResponse = S.suspend(() =>
  S.Struct({
    IndexAttachments: S.optional(IndexAttachmentList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAttachedIndicesResponse",
}) as any as S.Schema<ListAttachedIndicesResponse>;
export interface ListIncomingTypedLinksRequest {
  DirectoryArn: string;
  ObjectReference: ObjectReference;
  FilterAttributeRanges?: TypedLinkAttributeRangeList;
  FilterTypedLink?: TypedLinkSchemaAndFacetName;
  NextToken?: string;
  MaxResults?: number;
  ConsistencyLevel?: string;
}
export const ListIncomingTypedLinksRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    FilterAttributeRanges: S.optional(TypedLinkAttributeRangeList),
    FilterTypedLink: S.optional(TypedLinkSchemaAndFacetName),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ConsistencyLevel: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListIncomingTypedLinksRequest",
}) as any as S.Schema<ListIncomingTypedLinksRequest>;
export interface ListIndexResponse {
  IndexAttachments?: IndexAttachmentList;
  NextToken?: string;
}
export const ListIndexResponse = S.suspend(() =>
  S.Struct({
    IndexAttachments: S.optional(IndexAttachmentList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIndexResponse",
}) as any as S.Schema<ListIndexResponse>;
export interface ListObjectChildrenResponse {
  Children?: LinkNameToObjectIdentifierMap;
  NextToken?: string;
}
export const ListObjectChildrenResponse = S.suspend(() =>
  S.Struct({
    Children: S.optional(LinkNameToObjectIdentifierMap),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListObjectChildrenResponse",
}) as any as S.Schema<ListObjectChildrenResponse>;
export interface ListObjectParentPathsResponse {
  PathToObjectIdentifiersList?: PathToObjectIdentifiersList;
  NextToken?: string;
}
export const ListObjectParentPathsResponse = S.suspend(() =>
  S.Struct({
    PathToObjectIdentifiersList: S.optional(PathToObjectIdentifiersList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListObjectParentPathsResponse",
}) as any as S.Schema<ListObjectParentPathsResponse>;
export interface ListObjectParentsResponse {
  Parents?: ObjectIdentifierToLinkNameMap;
  NextToken?: string;
  ParentLinks?: ObjectIdentifierAndLinkNameList;
}
export const ListObjectParentsResponse = S.suspend(() =>
  S.Struct({
    Parents: S.optional(ObjectIdentifierToLinkNameMap),
    NextToken: S.optional(S.String),
    ParentLinks: S.optional(ObjectIdentifierAndLinkNameList),
  }),
).annotations({
  identifier: "ListObjectParentsResponse",
}) as any as S.Schema<ListObjectParentsResponse>;
export interface UpdateLinkAttributesRequest {
  DirectoryArn: string;
  TypedLinkSpecifier: TypedLinkSpecifier;
  AttributeUpdates: LinkAttributeUpdateList;
}
export const UpdateLinkAttributesRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    TypedLinkSpecifier: TypedLinkSpecifier,
    AttributeUpdates: LinkAttributeUpdateList,
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateLinkAttributesRequest",
}) as any as S.Schema<UpdateLinkAttributesRequest>;
export interface UpdateLinkAttributesResponse {}
export const UpdateLinkAttributesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateLinkAttributesResponse",
}) as any as S.Schema<UpdateLinkAttributesResponse>;
export interface UpdateObjectAttributesRequest {
  DirectoryArn: string;
  ObjectReference: ObjectReference;
  AttributeUpdates: ObjectAttributeUpdateList;
}
export const UpdateObjectAttributesRequest = S.suspend(() =>
  S.Struct({
    DirectoryArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    ObjectReference: ObjectReference,
    AttributeUpdates: ObjectAttributeUpdateList,
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateObjectAttributesRequest",
}) as any as S.Schema<UpdateObjectAttributesRequest>;
export interface PolicyAttachment {
  PolicyId?: string;
  ObjectIdentifier?: string;
  PolicyType?: string;
}
export const PolicyAttachment = S.suspend(() =>
  S.Struct({
    PolicyId: S.optional(S.String),
    ObjectIdentifier: S.optional(S.String),
    PolicyType: S.optional(S.String),
  }),
).annotations({
  identifier: "PolicyAttachment",
}) as any as S.Schema<PolicyAttachment>;
export type PolicyAttachmentList = PolicyAttachment[];
export const PolicyAttachmentList = S.Array(PolicyAttachment);
export interface PolicyToPath {
  Path?: string;
  Policies?: PolicyAttachmentList;
}
export const PolicyToPath = S.suspend(() =>
  S.Struct({
    Path: S.optional(S.String),
    Policies: S.optional(PolicyAttachmentList),
  }),
).annotations({ identifier: "PolicyToPath" }) as any as S.Schema<PolicyToPath>;
export type PolicyToPathList = PolicyToPath[];
export const PolicyToPathList = S.Array(PolicyToPath);
export interface ListIncomingTypedLinksResponse {
  LinkSpecifiers?: TypedLinkSpecifierList;
  NextToken?: string;
}
export const ListIncomingTypedLinksResponse = S.suspend(() =>
  S.Struct({
    LinkSpecifiers: S.optional(TypedLinkSpecifierList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIncomingTypedLinksResponse",
}) as any as S.Schema<ListIncomingTypedLinksResponse>;
export interface LookupPolicyResponse {
  PolicyToPathList?: PolicyToPathList;
  NextToken?: string;
}
export const LookupPolicyResponse = S.suspend(() =>
  S.Struct({
    PolicyToPathList: S.optional(PolicyToPathList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "LookupPolicyResponse",
}) as any as S.Schema<LookupPolicyResponse>;
export interface UpdateObjectAttributesResponse {
  ObjectIdentifier?: string;
}
export const UpdateObjectAttributesResponse = S.suspend(() =>
  S.Struct({ ObjectIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "UpdateObjectAttributesResponse",
}) as any as S.Schema<UpdateObjectAttributesResponse>;
export interface BatchDeleteObjectResponse {}
export const BatchDeleteObjectResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "BatchDeleteObjectResponse",
}) as any as S.Schema<BatchDeleteObjectResponse>;
export interface BatchAddFacetToObjectResponse {}
export const BatchAddFacetToObjectResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "BatchAddFacetToObjectResponse",
}) as any as S.Schema<BatchAddFacetToObjectResponse>;
export interface BatchRemoveFacetFromObjectResponse {}
export const BatchRemoveFacetFromObjectResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "BatchRemoveFacetFromObjectResponse",
}) as any as S.Schema<BatchRemoveFacetFromObjectResponse>;
export interface BatchAttachPolicyResponse {}
export const BatchAttachPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "BatchAttachPolicyResponse",
}) as any as S.Schema<BatchAttachPolicyResponse>;
export interface BatchDetachPolicyResponse {}
export const BatchDetachPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "BatchDetachPolicyResponse",
}) as any as S.Schema<BatchDetachPolicyResponse>;
export interface BatchDetachTypedLinkResponse {}
export const BatchDetachTypedLinkResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "BatchDetachTypedLinkResponse",
}) as any as S.Schema<BatchDetachTypedLinkResponse>;
export interface BatchUpdateLinkAttributesResponse {}
export const BatchUpdateLinkAttributesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "BatchUpdateLinkAttributesResponse",
}) as any as S.Schema<BatchUpdateLinkAttributesResponse>;
export interface BatchReadException {
  Type?: string;
  Message?: string;
}
export const BatchReadException = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "BatchReadException",
}) as any as S.Schema<BatchReadException>;
export interface BatchCreateObjectResponse {
  ObjectIdentifier?: string;
}
export const BatchCreateObjectResponse = S.suspend(() =>
  S.Struct({ ObjectIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "BatchCreateObjectResponse",
}) as any as S.Schema<BatchCreateObjectResponse>;
export interface BatchAttachObjectResponse {
  attachedObjectIdentifier?: string;
}
export const BatchAttachObjectResponse = S.suspend(() =>
  S.Struct({ attachedObjectIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "BatchAttachObjectResponse",
}) as any as S.Schema<BatchAttachObjectResponse>;
export interface BatchDetachObjectResponse {
  detachedObjectIdentifier?: string;
}
export const BatchDetachObjectResponse = S.suspend(() =>
  S.Struct({ detachedObjectIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "BatchDetachObjectResponse",
}) as any as S.Schema<BatchDetachObjectResponse>;
export interface BatchUpdateObjectAttributesResponse {
  ObjectIdentifier?: string;
}
export const BatchUpdateObjectAttributesResponse = S.suspend(() =>
  S.Struct({ ObjectIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "BatchUpdateObjectAttributesResponse",
}) as any as S.Schema<BatchUpdateObjectAttributesResponse>;
export interface BatchCreateIndexResponse {
  ObjectIdentifier?: string;
}
export const BatchCreateIndexResponse = S.suspend(() =>
  S.Struct({ ObjectIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "BatchCreateIndexResponse",
}) as any as S.Schema<BatchCreateIndexResponse>;
export interface BatchAttachToIndexResponse {
  AttachedObjectIdentifier?: string;
}
export const BatchAttachToIndexResponse = S.suspend(() =>
  S.Struct({ AttachedObjectIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "BatchAttachToIndexResponse",
}) as any as S.Schema<BatchAttachToIndexResponse>;
export interface BatchDetachFromIndexResponse {
  DetachedObjectIdentifier?: string;
}
export const BatchDetachFromIndexResponse = S.suspend(() =>
  S.Struct({ DetachedObjectIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "BatchDetachFromIndexResponse",
}) as any as S.Schema<BatchDetachFromIndexResponse>;
export interface BatchAttachTypedLinkResponse {
  TypedLinkSpecifier?: TypedLinkSpecifier;
}
export const BatchAttachTypedLinkResponse = S.suspend(() =>
  S.Struct({ TypedLinkSpecifier: S.optional(TypedLinkSpecifier) }),
).annotations({
  identifier: "BatchAttachTypedLinkResponse",
}) as any as S.Schema<BatchAttachTypedLinkResponse>;
export interface BatchWriteOperationResponse {
  CreateObject?: BatchCreateObjectResponse;
  AttachObject?: BatchAttachObjectResponse;
  DetachObject?: BatchDetachObjectResponse;
  UpdateObjectAttributes?: BatchUpdateObjectAttributesResponse;
  DeleteObject?: BatchDeleteObjectResponse;
  AddFacetToObject?: BatchAddFacetToObjectResponse;
  RemoveFacetFromObject?: BatchRemoveFacetFromObjectResponse;
  AttachPolicy?: BatchAttachPolicyResponse;
  DetachPolicy?: BatchDetachPolicyResponse;
  CreateIndex?: BatchCreateIndexResponse;
  AttachToIndex?: BatchAttachToIndexResponse;
  DetachFromIndex?: BatchDetachFromIndexResponse;
  AttachTypedLink?: BatchAttachTypedLinkResponse;
  DetachTypedLink?: BatchDetachTypedLinkResponse;
  UpdateLinkAttributes?: BatchUpdateLinkAttributesResponse;
}
export const BatchWriteOperationResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "BatchWriteOperationResponse",
}) as any as S.Schema<BatchWriteOperationResponse>;
export type BatchWriteOperationResponseList = BatchWriteOperationResponse[];
export const BatchWriteOperationResponseList = S.Array(
  BatchWriteOperationResponse,
);
export interface BatchListObjectAttributesResponse {
  Attributes?: AttributeKeyAndValueList;
  NextToken?: string;
}
export const BatchListObjectAttributesResponse = S.suspend(() =>
  S.Struct({
    Attributes: S.optional(AttributeKeyAndValueList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchListObjectAttributesResponse",
}) as any as S.Schema<BatchListObjectAttributesResponse>;
export interface BatchListObjectChildrenResponse {
  Children?: LinkNameToObjectIdentifierMap;
  NextToken?: string;
}
export const BatchListObjectChildrenResponse = S.suspend(() =>
  S.Struct({
    Children: S.optional(LinkNameToObjectIdentifierMap),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchListObjectChildrenResponse",
}) as any as S.Schema<BatchListObjectChildrenResponse>;
export interface BatchGetObjectInformationResponse {
  SchemaFacets?: SchemaFacetList;
  ObjectIdentifier?: string;
}
export const BatchGetObjectInformationResponse = S.suspend(() =>
  S.Struct({
    SchemaFacets: S.optional(SchemaFacetList),
    ObjectIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchGetObjectInformationResponse",
}) as any as S.Schema<BatchGetObjectInformationResponse>;
export interface BatchGetObjectAttributesResponse {
  Attributes?: AttributeKeyAndValueList;
}
export const BatchGetObjectAttributesResponse = S.suspend(() =>
  S.Struct({ Attributes: S.optional(AttributeKeyAndValueList) }),
).annotations({
  identifier: "BatchGetObjectAttributesResponse",
}) as any as S.Schema<BatchGetObjectAttributesResponse>;
export interface BatchListAttachedIndicesResponse {
  IndexAttachments?: IndexAttachmentList;
  NextToken?: string;
}
export const BatchListAttachedIndicesResponse = S.suspend(() =>
  S.Struct({
    IndexAttachments: S.optional(IndexAttachmentList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchListAttachedIndicesResponse",
}) as any as S.Schema<BatchListAttachedIndicesResponse>;
export interface BatchListObjectParentPathsResponse {
  PathToObjectIdentifiersList?: PathToObjectIdentifiersList;
  NextToken?: string;
}
export const BatchListObjectParentPathsResponse = S.suspend(() =>
  S.Struct({
    PathToObjectIdentifiersList: S.optional(PathToObjectIdentifiersList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchListObjectParentPathsResponse",
}) as any as S.Schema<BatchListObjectParentPathsResponse>;
export interface BatchListObjectPoliciesResponse {
  AttachedPolicyIds?: ObjectIdentifierList;
  NextToken?: string;
}
export const BatchListObjectPoliciesResponse = S.suspend(() =>
  S.Struct({
    AttachedPolicyIds: S.optional(ObjectIdentifierList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchListObjectPoliciesResponse",
}) as any as S.Schema<BatchListObjectPoliciesResponse>;
export interface BatchListPolicyAttachmentsResponse {
  ObjectIdentifiers?: ObjectIdentifierList;
  NextToken?: string;
}
export const BatchListPolicyAttachmentsResponse = S.suspend(() =>
  S.Struct({
    ObjectIdentifiers: S.optional(ObjectIdentifierList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchListPolicyAttachmentsResponse",
}) as any as S.Schema<BatchListPolicyAttachmentsResponse>;
export interface BatchLookupPolicyResponse {
  PolicyToPathList?: PolicyToPathList;
  NextToken?: string;
}
export const BatchLookupPolicyResponse = S.suspend(() =>
  S.Struct({
    PolicyToPathList: S.optional(PolicyToPathList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchLookupPolicyResponse",
}) as any as S.Schema<BatchLookupPolicyResponse>;
export interface BatchListIndexResponse {
  IndexAttachments?: IndexAttachmentList;
  NextToken?: string;
}
export const BatchListIndexResponse = S.suspend(() =>
  S.Struct({
    IndexAttachments: S.optional(IndexAttachmentList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchListIndexResponse",
}) as any as S.Schema<BatchListIndexResponse>;
export interface BatchListOutgoingTypedLinksResponse {
  TypedLinkSpecifiers?: TypedLinkSpecifierList;
  NextToken?: string;
}
export const BatchListOutgoingTypedLinksResponse = S.suspend(() =>
  S.Struct({
    TypedLinkSpecifiers: S.optional(TypedLinkSpecifierList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchListOutgoingTypedLinksResponse",
}) as any as S.Schema<BatchListOutgoingTypedLinksResponse>;
export interface BatchListIncomingTypedLinksResponse {
  LinkSpecifiers?: TypedLinkSpecifierList;
  NextToken?: string;
}
export const BatchListIncomingTypedLinksResponse = S.suspend(() =>
  S.Struct({
    LinkSpecifiers: S.optional(TypedLinkSpecifierList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchListIncomingTypedLinksResponse",
}) as any as S.Schema<BatchListIncomingTypedLinksResponse>;
export interface BatchGetLinkAttributesResponse {
  Attributes?: AttributeKeyAndValueList;
}
export const BatchGetLinkAttributesResponse = S.suspend(() =>
  S.Struct({ Attributes: S.optional(AttributeKeyAndValueList) }),
).annotations({
  identifier: "BatchGetLinkAttributesResponse",
}) as any as S.Schema<BatchGetLinkAttributesResponse>;
export interface BatchListObjectParentsResponse {
  ParentLinks?: ObjectIdentifierAndLinkNameList;
  NextToken?: string;
}
export const BatchListObjectParentsResponse = S.suspend(() =>
  S.Struct({
    ParentLinks: S.optional(ObjectIdentifierAndLinkNameList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchListObjectParentsResponse",
}) as any as S.Schema<BatchListObjectParentsResponse>;
export interface BatchWriteResponse {
  Responses?: BatchWriteOperationResponseList;
}
export const BatchWriteResponse = S.suspend(() =>
  S.Struct({ Responses: S.optional(BatchWriteOperationResponseList) }),
).annotations({
  identifier: "BatchWriteResponse",
}) as any as S.Schema<BatchWriteResponse>;
export interface CreateFacetRequest {
  SchemaArn: string;
  Name: string;
  Attributes?: FacetAttributeList;
  ObjectType?: string;
  FacetStyle?: string;
}
export const CreateFacetRequest = S.suspend(() =>
  S.Struct({
    SchemaArn: S.String.pipe(T.HttpHeader("x-amz-data-partition")),
    Name: S.String,
    Attributes: S.optional(FacetAttributeList),
    ObjectType: S.optional(S.String),
    FacetStyle: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateFacetRequest",
}) as any as S.Schema<CreateFacetRequest>;
export interface CreateFacetResponse {}
export const CreateFacetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "CreateFacetResponse",
}) as any as S.Schema<CreateFacetResponse>;
export interface BatchReadSuccessfulResponse {
  ListObjectAttributes?: BatchListObjectAttributesResponse;
  ListObjectChildren?: BatchListObjectChildrenResponse;
  GetObjectInformation?: BatchGetObjectInformationResponse;
  GetObjectAttributes?: BatchGetObjectAttributesResponse;
  ListAttachedIndices?: BatchListAttachedIndicesResponse;
  ListObjectParentPaths?: BatchListObjectParentPathsResponse;
  ListObjectPolicies?: BatchListObjectPoliciesResponse;
  ListPolicyAttachments?: BatchListPolicyAttachmentsResponse;
  LookupPolicy?: BatchLookupPolicyResponse;
  ListIndex?: BatchListIndexResponse;
  ListOutgoingTypedLinks?: BatchListOutgoingTypedLinksResponse;
  ListIncomingTypedLinks?: BatchListIncomingTypedLinksResponse;
  GetLinkAttributes?: BatchGetLinkAttributesResponse;
  ListObjectParents?: BatchListObjectParentsResponse;
}
export const BatchReadSuccessfulResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "BatchReadSuccessfulResponse",
}) as any as S.Schema<BatchReadSuccessfulResponse>;
export interface BatchReadOperationResponse {
  SuccessfulResponse?: BatchReadSuccessfulResponse;
  ExceptionResponse?: BatchReadException;
}
export const BatchReadOperationResponse = S.suspend(() =>
  S.Struct({
    SuccessfulResponse: S.optional(BatchReadSuccessfulResponse),
    ExceptionResponse: S.optional(BatchReadException),
  }),
).annotations({
  identifier: "BatchReadOperationResponse",
}) as any as S.Schema<BatchReadOperationResponse>;
export type BatchReadOperationResponseList = BatchReadOperationResponse[];
export const BatchReadOperationResponseList = S.Array(
  BatchReadOperationResponse,
);
export interface BatchReadResponse {
  Responses?: BatchReadOperationResponseList;
}
export const BatchReadResponse = S.suspend(() =>
  S.Struct({ Responses: S.optional(BatchReadOperationResponseList) }),
).annotations({
  identifier: "BatchReadResponse",
}) as any as S.Schema<BatchReadResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class DirectoryNotEnabledException extends S.TaggedError<DirectoryNotEnabledException>()(
  "DirectoryNotEnabledException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DirectoryAlreadyExistsException extends S.TaggedError<DirectoryAlreadyExistsException>()(
  "DirectoryAlreadyExistsException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class DirectoryDeletedException extends S.TaggedError<DirectoryDeletedException>()(
  "DirectoryDeletedException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class FacetNotFoundException extends S.TaggedError<FacetNotFoundException>()(
  "FacetNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class IncompatibleSchemaException extends S.TaggedError<IncompatibleSchemaException>()(
  "IncompatibleSchemaException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class FacetInUseException extends S.TaggedError<FacetInUseException>()(
  "FacetInUseException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class FacetValidationException extends S.TaggedError<FacetValidationException>()(
  "FacetValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidArnException extends S.TaggedError<InvalidArnException>()(
  "InvalidArnException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class FacetAlreadyExistsException extends S.TaggedError<FacetAlreadyExistsException>()(
  "FacetAlreadyExistsException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DirectoryNotDisabledException extends S.TaggedError<DirectoryNotDisabledException>()(
  "DirectoryNotDisabledException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class CannotListParentOfRootException extends S.TaggedError<CannotListParentOfRootException>()(
  "CannotListParentOfRootException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class IndexedAttributeMissingException extends S.TaggedError<IndexedAttributeMissingException>()(
  "IndexedAttributeMissingException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidRuleException extends S.TaggedError<InvalidRuleException>()(
  "InvalidRuleException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidAttachmentException extends S.TaggedError<InvalidAttachmentException>()(
  "InvalidAttachmentException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidFacetUpdateException extends S.TaggedError<InvalidFacetUpdateException>()(
  "InvalidFacetUpdateException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidTaggingRequestException extends S.TaggedError<InvalidTaggingRequestException>()(
  "InvalidTaggingRequestException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class RetryableConflictException extends S.TaggedError<RetryableConflictException>()(
  "RetryableConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LinkNameAlreadyInUseException extends S.TaggedError<LinkNameAlreadyInUseException>()(
  "LinkNameAlreadyInUseException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NotIndexException extends S.TaggedError<NotIndexException>()(
  "NotIndexException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NotNodeException extends S.TaggedError<NotNodeException>()(
  "NotNodeException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ObjectNotDetachedException extends S.TaggedError<ObjectNotDetachedException>()(
  "ObjectNotDetachedException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NotPolicyException extends S.TaggedError<NotPolicyException>()(
  "NotPolicyException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidSchemaDocException extends S.TaggedError<InvalidSchemaDocException>()(
  "InvalidSchemaDocException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
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
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ObjectAlreadyDetachedException extends S.TaggedError<ObjectAlreadyDetachedException>()(
  "ObjectAlreadyDetachedException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class StillContainsLinksException extends S.TaggedError<StillContainsLinksException>()(
  "StillContainsLinksException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class SchemaAlreadyPublishedException extends S.TaggedError<SchemaAlreadyPublishedException>()(
  "SchemaAlreadyPublishedException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnsupportedIndexTypeException extends S.TaggedError<UnsupportedIndexTypeException>()(
  "UnsupportedIndexTypeException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Creates a TypedLinkFacet. For more information, see Typed Links.
 */
export const createTypedLinkFacet: (
  input: CreateTypedLinkFacetRequest,
) => Effect.Effect<
  CreateTypedLinkFacetResponse,
  | AccessDeniedException
  | FacetAlreadyExistsException
  | FacetValidationException
  | InternalServiceException
  | InvalidArnException
  | InvalidRuleException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Detaches the specified object from the specified index.
 */
export const detachFromIndex: (
  input: DetachFromIndexRequest,
) => Effect.Effect<
  DetachFromIndexResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | NotIndexException
  | ObjectAlreadyDetachedException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const upgradeAppliedSchema: (
  input: UpgradeAppliedSchemaRequest,
) => Effect.Effect<
  UpgradeAppliedSchemaResponse,
  | AccessDeniedException
  | IncompatibleSchemaException
  | InternalServiceException
  | InvalidArnException
  | InvalidAttachmentException
  | ResourceNotFoundException
  | RetryableConflictException
  | SchemaAlreadyExistsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Copies the input published schema, at the specified version, into the Directory with the same
 * name and version as that of the published schema.
 */
export const applySchema: (
  input: ApplySchemaRequest,
) => Effect.Effect<
  ApplySchemaResponse,
  | AccessDeniedException
  | InternalServiceException
  | InvalidArnException
  | InvalidAttachmentException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | SchemaAlreadyExistsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSchema: (
  input: DeleteSchemaRequest,
) => Effect.Effect<
  DeleteSchemaResponse,
  | AccessDeniedException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | StillContainsLinksException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const publishSchema: (
  input: PublishSchemaRequest,
) => Effect.Effect<
  PublishSchemaResponse,
  | AccessDeniedException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | SchemaAlreadyPublishedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const detachObject: (
  input: DetachObjectRequest,
) => Effect.Effect<
  DetachObjectResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | NotNodeException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteObject: (
  input: DeleteObjectRequest,
) => Effect.Effect<
  DeleteObjectResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ObjectNotDetachedException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const detachPolicy: (
  input: DetachPolicyRequest,
) => Effect.Effect<
  DetachPolicyResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | NotPolicyException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDirectory: (
  input: GetDirectoryRequest,
) => Effect.Effect<
  GetDirectoryResponse,
  | AccessDeniedException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listDirectories: {
  (
    input: ListDirectoriesRequest,
  ): Effect.Effect<
    ListDirectoriesResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDirectoriesRequest,
  ) => Stream.Stream<
    ListDirectoriesResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDirectoriesRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Allows a schema to be updated using JSON upload. Only available for development schemas. See JSON Schema Format for more information.
 */
export const putSchemaFromJson: (
  input: PutSchemaFromJsonRequest,
) => Effect.Effect<
  PutSchemaFromJsonResponse,
  | AccessDeniedException
  | InternalServiceException
  | InvalidArnException
  | InvalidRuleException
  | InvalidSchemaDocException
  | LimitExceededException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listIncomingTypedLinks: (
  input: ListIncomingTypedLinksRequest,
) => Effect.Effect<
  ListIncomingTypedLinksResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | FacetValidationException
  | InternalServiceException
  | InvalidArnException
  | InvalidNextTokenException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Does the following:
 *
 * - Adds new `Attributes`, `Rules`, or `ObjectTypes`.
 *
 * - Updates existing `Attributes`, `Rules`, or `ObjectTypes`.
 *
 * - Deletes existing `Attributes`, `Rules`, or `ObjectTypes`.
 */
export const updateFacet: (
  input: UpdateFacetRequest,
) => Effect.Effect<
  UpdateFacetResponse,
  | AccessDeniedException
  | FacetNotFoundException
  | FacetValidationException
  | InternalServiceException
  | InvalidArnException
  | InvalidFacetUpdateException
  | InvalidRuleException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: {
  (
    input: ListTagsForResourceRequest,
  ): Effect.Effect<
    ListTagsForResourceResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidTaggingRequestException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsForResourceRequest,
  ) => Stream.Stream<
    ListTagsForResourceResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidTaggingRequestException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsForResourceRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidTaggingRequestException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const deleteDirectory: (
  input: DeleteDirectoryRequest,
) => Effect.Effect<
  DeleteDirectoryResponse,
  | AccessDeniedException
  | DirectoryDeletedException
  | DirectoryNotDisabledException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateLinkAttributes: (
  input: UpdateLinkAttributesRequest,
) => Effect.Effect<
  UpdateLinkAttributesResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | FacetValidationException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Detaches a typed link from a specified source and target object. For more information, see Typed Links.
 */
export const detachTypedLink: (
  input: DetachTypedLinkRequest,
) => Effect.Effect<
  DetachTypedLinkResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | FacetValidationException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getLinkAttributes: (
  input: GetLinkAttributesRequest,
) => Effect.Effect<
  GetLinkAttributesResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | FacetValidationException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getObjectAttributes: (
  input: GetObjectAttributesRequest,
) => Effect.Effect<
  GetObjectAttributesResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | FacetValidationException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const removeFacetFromObject: (
  input: RemoveFacetFromObjectRequest,
) => Effect.Effect<
  RemoveFacetFromObjectResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | FacetValidationException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Adds a new Facet to an object. An object can have more than one facet applied on it.
 */
export const addFacetToObject: (
  input: AddFacetToObjectRequest,
) => Effect.Effect<
  AddFacetToObjectResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | FacetValidationException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAttachedIndices: {
  (
    input: ListAttachedIndicesRequest,
  ): Effect.Effect<
    ListAttachedIndicesResponse,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAttachedIndicesRequest,
  ) => Stream.Stream<
    ListAttachedIndicesResponse,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAttachedIndicesRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const deleteFacet: (
  input: DeleteFacetRequest,
) => Effect.Effect<
  DeleteFacetResponse,
  | AccessDeniedException
  | FacetInUseException
  | FacetNotFoundException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getObjectInformation: (
  input: GetObjectInformationRequest,
) => Effect.Effect<
  GetObjectInformationResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Returns current applied schema version ARN, including the minor version in use.
 */
export const getAppliedSchemaVersion: (
  input: GetAppliedSchemaVersionRequest,
) => Effect.Effect<
  GetAppliedSchemaVersionResponse,
  | AccessDeniedException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves a JSON representation of the schema. See JSON Schema Format for more information.
 */
export const getSchemaAsJson: (
  input: GetSchemaAsJsonRequest,
) => Effect.Effect<
  GetSchemaAsJsonResponse,
  | AccessDeniedException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSchema: (
  input: UpdateSchemaRequest,
) => Effect.Effect<
  UpdateSchemaResponse,
  | AccessDeniedException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDirectory: (
  input: CreateDirectoryRequest,
) => Effect.Effect<
  CreateDirectoryResponse,
  | AccessDeniedException
  | DirectoryAlreadyExistsException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disableDirectory: (
  input: DisableDirectoryRequest,
) => Effect.Effect<
  DisableDirectoryResponse,
  | AccessDeniedException
  | DirectoryDeletedException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const enableDirectory: (
  input: EnableDirectoryRequest,
) => Effect.Effect<
  EnableDirectoryResponse,
  | AccessDeniedException
  | DirectoryDeletedException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteTypedLinkFacet: (
  input: DeleteTypedLinkFacetRequest,
) => Effect.Effect<
  DeleteTypedLinkFacetResponse,
  | AccessDeniedException
  | FacetNotFoundException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Gets details of the Facet, such as facet name, attributes, Rules, or `ObjectType`. You can call this on all kinds of schema
 * facets -- published, development, or applied.
 */
export const getFacet: (
  input: GetFacetRequest,
) => Effect.Effect<
  GetFacetResponse,
  | AccessDeniedException
  | FacetNotFoundException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listObjectParents: {
  (
    input: ListObjectParentsRequest,
  ): Effect.Effect<
    ListObjectParentsResponse,
    | AccessDeniedException
    | CannotListParentOfRootException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListObjectParentsRequest,
  ) => Stream.Stream<
    ListObjectParentsResponse,
    | AccessDeniedException
    | CannotListParentOfRootException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListObjectParentsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | CannotListParentOfRootException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists all policies from the root of the Directory to the object
 * specified. If there are no policies present, an empty list is returned. If policies are
 * present, and if some objects don't have the policies attached, it returns the `ObjectIdentifier`
 * for such objects. If policies are present, it returns `ObjectIdentifier`, `policyId`, and
 * `policyType`. Paths that don't lead to the root from the target object are ignored. For more
 * information, see Policies.
 */
export const lookupPolicy: {
  (
    input: LookupPolicyRequest,
  ): Effect.Effect<
    LookupPolicyResponse,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: LookupPolicyRequest,
  ) => Stream.Stream<
    LookupPolicyResponse,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: LookupPolicyRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists all attributes that are associated with an object.
 */
export const listObjectAttributes: {
  (
    input: ListObjectAttributesRequest,
  ): Effect.Effect<
    ListObjectAttributesResponse,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | FacetValidationException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListObjectAttributesRequest,
  ) => Stream.Stream<
    ListObjectAttributesResponse,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | FacetValidationException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListObjectAttributesRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | FacetValidationException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listOutgoingTypedLinks: (
  input: ListOutgoingTypedLinksRequest,
) => Effect.Effect<
  ListOutgoingTypedLinksResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | FacetValidationException
  | InternalServiceException
  | InvalidArnException
  | InvalidNextTokenException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Returns the identity attribute order for a specific TypedLinkFacet. For more information, see Typed Links.
 */
export const getTypedLinkFacetInformation: (
  input: GetTypedLinkFacetInformationRequest,
) => Effect.Effect<
  GetTypedLinkFacetInformationResponse,
  | AccessDeniedException
  | FacetNotFoundException
  | InternalServiceException
  | InvalidArnException
  | InvalidNextTokenException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listObjectParentPaths: {
  (
    input: ListObjectParentPathsRequest,
  ): Effect.Effect<
    ListObjectParentPathsResponse,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListObjectParentPathsRequest,
  ) => Stream.Stream<
    ListObjectParentPathsResponse,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListObjectParentPathsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listObjectPolicies: {
  (
    input: ListObjectPoliciesRequest,
  ): Effect.Effect<
    ListObjectPoliciesResponse,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListObjectPoliciesRequest,
  ) => Stream.Stream<
    ListObjectPoliciesResponse,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListObjectPoliciesRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists schema major versions applied to a directory. If `SchemaArn` is provided, lists the minor version.
 */
export const listAppliedSchemaArns: {
  (
    input: ListAppliedSchemaArnsRequest,
  ): Effect.Effect<
    ListAppliedSchemaArnsResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppliedSchemaArnsRequest,
  ) => Stream.Stream<
    ListAppliedSchemaArnsResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppliedSchemaArnsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listDevelopmentSchemaArns: {
  (
    input: ListDevelopmentSchemaArnsRequest,
  ): Effect.Effect<
    ListDevelopmentSchemaArnsResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDevelopmentSchemaArnsRequest,
  ) => Stream.Stream<
    ListDevelopmentSchemaArnsResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDevelopmentSchemaArnsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listFacetNames: {
  (
    input: ListFacetNamesRequest,
  ): Effect.Effect<
    ListFacetNamesResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFacetNamesRequest,
  ) => Stream.Stream<
    ListFacetNamesResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFacetNamesRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists the major version families of each managed schema. If a major version ARN is provided as SchemaArn, the minor version revisions in that family are listed instead.
 */
export const listManagedSchemaArns: {
  (
    input: ListManagedSchemaArnsRequest,
  ): Effect.Effect<
    ListManagedSchemaArnsResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListManagedSchemaArnsRequest,
  ) => Stream.Stream<
    ListManagedSchemaArnsResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListManagedSchemaArnsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listPublishedSchemaArns: {
  (
    input: ListPublishedSchemaArnsRequest,
  ): Effect.Effect<
    ListPublishedSchemaArnsResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPublishedSchemaArnsRequest,
  ) => Stream.Stream<
    ListPublishedSchemaArnsResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPublishedSchemaArnsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listTypedLinkFacetNames: {
  (
    input: ListTypedLinkFacetNamesRequest,
  ): Effect.Effect<
    ListTypedLinkFacetNamesResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTypedLinkFacetNamesRequest,
  ) => Stream.Stream<
    ListTypedLinkFacetNamesResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTypedLinkFacetNamesRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listFacetAttributes: {
  (
    input: ListFacetAttributesRequest,
  ): Effect.Effect<
    ListFacetAttributesResponse,
    | AccessDeniedException
    | FacetNotFoundException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFacetAttributesRequest,
  ) => Stream.Stream<
    ListFacetAttributesResponse,
    | AccessDeniedException
    | FacetNotFoundException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFacetAttributesRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | FacetNotFoundException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listTypedLinkFacetAttributes: {
  (
    input: ListTypedLinkFacetAttributesRequest,
  ): Effect.Effect<
    ListTypedLinkFacetAttributesResponse,
    | AccessDeniedException
    | FacetNotFoundException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTypedLinkFacetAttributesRequest,
  ) => Stream.Stream<
    ListTypedLinkFacetAttributesResponse,
    | AccessDeniedException
    | FacetNotFoundException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTypedLinkFacetAttributesRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | FacetNotFoundException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const upgradePublishedSchema: (
  input: UpgradePublishedSchemaRequest,
) => Effect.Effect<
  UpgradePublishedSchemaResponse,
  | AccessDeniedException
  | IncompatibleSchemaException
  | InternalServiceException
  | InvalidArnException
  | InvalidAttachmentException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Attaches a typed link to a specified source and target object. For more information, see Typed Links.
 */
export const attachTypedLink: (
  input: AttachTypedLinkRequest,
) => Effect.Effect<
  AttachTypedLinkResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | FacetValidationException
  | InternalServiceException
  | InvalidArnException
  | InvalidAttachmentException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateTypedLinkFacet: (
  input: UpdateTypedLinkFacetRequest,
) => Effect.Effect<
  UpdateTypedLinkFacetResponse,
  | AccessDeniedException
  | FacetNotFoundException
  | FacetValidationException
  | InternalServiceException
  | InvalidArnException
  | InvalidFacetUpdateException
  | InvalidRuleException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * An API operation for adding tags to a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServiceException
  | InvalidArnException
  | InvalidTaggingRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServiceException
  | InvalidArnException
  | InvalidTaggingRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createFacet: (
  input: CreateFacetRequest,
) => Effect.Effect<
  CreateFacetResponse,
  | AccessDeniedException
  | FacetAlreadyExistsException
  | FacetValidationException
  | InternalServiceException
  | InvalidArnException
  | InvalidRuleException
  | LimitExceededException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateObjectAttributes: (
  input: UpdateObjectAttributesRequest,
) => Effect.Effect<
  UpdateObjectAttributesResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | FacetValidationException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | LinkNameAlreadyInUseException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Attaches an existing object to another object. An object can be accessed in two
 * ways:
 *
 * - Using the path
 *
 * - Using `ObjectIdentifier`
 */
export const attachObject: (
  input: AttachObjectRequest,
) => Effect.Effect<
  AttachObjectResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | FacetValidationException
  | InternalServiceException
  | InvalidArnException
  | InvalidAttachmentException
  | LimitExceededException
  | LinkNameAlreadyInUseException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listIndex: {
  (
    input: ListIndexRequest,
  ): Effect.Effect<
    ListIndexResponse,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | FacetValidationException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | NotIndexException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIndexRequest,
  ) => Stream.Stream<
    ListIndexResponse,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | FacetValidationException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | NotIndexException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIndexRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | FacetValidationException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | NotIndexException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const attachToIndex: (
  input: AttachToIndexRequest,
) => Effect.Effect<
  AttachToIndexResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | IndexedAttributeMissingException
  | InternalServiceException
  | InvalidArnException
  | InvalidAttachmentException
  | LimitExceededException
  | LinkNameAlreadyInUseException
  | NotIndexException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listObjectChildren: {
  (
    input: ListObjectChildrenRequest,
  ): Effect.Effect<
    ListObjectChildrenResponse,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | NotNodeException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListObjectChildrenRequest,
  ) => Stream.Stream<
    ListObjectChildrenResponse,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | NotNodeException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListObjectChildrenRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | NotNodeException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Attaches a policy object to a regular object. An object can have a limited number of attached
 * policies.
 */
export const attachPolicy: (
  input: AttachPolicyRequest,
) => Effect.Effect<
  AttachPolicyResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | NotPolicyException
  | ResourceNotFoundException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listPolicyAttachments: {
  (
    input: ListPolicyAttachmentsRequest,
  ): Effect.Effect<
    ListPolicyAttachmentsResponse,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | NotPolicyException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPolicyAttachmentsRequest,
  ) => Stream.Stream<
    ListPolicyAttachmentsResponse,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | NotPolicyException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPolicyAttachmentsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | DirectoryNotEnabledException
    | InternalServiceException
    | InvalidArnException
    | InvalidNextTokenException
    | LimitExceededException
    | NotPolicyException
    | ResourceNotFoundException
    | RetryableConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const batchRead: (
  input: BatchReadRequest,
) => Effect.Effect<
  BatchReadResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchWrite: (
  input: BatchWriteRequest,
) => Effect.Effect<
  BatchWriteResponse,
  | AccessDeniedException
  | BatchWriteException
  | DirectoryNotEnabledException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | RetryableConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createSchema: (
  input: CreateSchemaRequest,
) => Effect.Effect<
  CreateSchemaResponse,
  | AccessDeniedException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | RetryableConflictException
  | SchemaAlreadyExistsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createIndex: (
  input: CreateIndexRequest,
) => Effect.Effect<
  CreateIndexResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | FacetValidationException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | LinkNameAlreadyInUseException
  | ResourceNotFoundException
  | RetryableConflictException
  | UnsupportedIndexTypeException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createObject: (
  input: CreateObjectRequest,
) => Effect.Effect<
  CreateObjectResponse,
  | AccessDeniedException
  | DirectoryNotEnabledException
  | FacetValidationException
  | InternalServiceException
  | InvalidArnException
  | LimitExceededException
  | LinkNameAlreadyInUseException
  | ResourceNotFoundException
  | RetryableConflictException
  | UnsupportedIndexTypeException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

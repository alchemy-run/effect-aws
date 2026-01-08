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
const svc = T.AwsApiService({ sdkId: "tnb", serviceShapeName: "TNB" });
const auth = T.AwsAuthSigv4({ name: "tnb" });
const ver = T.ServiceVersion("2008-10-21");
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
              `https://tnb-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://tnb-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://tnb.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://tnb.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type NsLcmOpOccId = string;
export type NsdInfoId = string;
export type VnfPkgId = string;
export type NsInstanceId = string;
export type VnfInstanceId = string;
export type PaginationToken = string;
export type TNBResourceArn = string;
export type TagKey = string;
export type TagValue = string;
export type NsInstanceArn = string;
export type NsdInfoArn = string;
export type VnfInstanceArn = string;
export type VnfdId = string;
export type VnfPkgArn = string;
export type NsdId = string;
export type NsLcmOpOccArn = string;
export type ErrorCause = string;
export type ErrorDetails = string;

//# Schemas
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export interface CancelSolNetworkOperationInput {
  nsLcmOpOccId: string;
}
export const CancelSolNetworkOperationInput = S.suspend(() =>
  S.Struct({ nsLcmOpOccId: S.String.pipe(T.HttpLabel("nsLcmOpOccId")) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/sol/nslcm/v1/ns_lcm_op_occs/{nsLcmOpOccId}/cancel",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelSolNetworkOperationInput",
}) as any as S.Schema<CancelSolNetworkOperationInput>;
export interface CancelSolNetworkOperationResponse {}
export const CancelSolNetworkOperationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelSolNetworkOperationResponse",
}) as any as S.Schema<CancelSolNetworkOperationResponse>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface CreateSolNetworkInstanceInput {
  nsdInfoId: string;
  nsName: string;
  nsDescription?: string;
  tags?: TagMap;
}
export const CreateSolNetworkInstanceInput = S.suspend(() =>
  S.Struct({
    nsdInfoId: S.String,
    nsName: S.String,
    nsDescription: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/sol/nslcm/v1/ns_instances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSolNetworkInstanceInput",
}) as any as S.Schema<CreateSolNetworkInstanceInput>;
export interface CreateSolNetworkPackageInput {
  tags?: TagMap;
}
export const CreateSolNetworkPackageInput = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/sol/nsd/v1/ns_descriptors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSolNetworkPackageInput",
}) as any as S.Schema<CreateSolNetworkPackageInput>;
export interface DeleteSolFunctionPackageInput {
  vnfPkgId: string;
}
export const DeleteSolFunctionPackageInput = S.suspend(() =>
  S.Struct({ vnfPkgId: S.String.pipe(T.HttpLabel("vnfPkgId")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/sol/vnfpkgm/v1/vnf_packages/{vnfPkgId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSolFunctionPackageInput",
}) as any as S.Schema<DeleteSolFunctionPackageInput>;
export interface DeleteSolFunctionPackageResponse {}
export const DeleteSolFunctionPackageResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSolFunctionPackageResponse",
}) as any as S.Schema<DeleteSolFunctionPackageResponse>;
export interface DeleteSolNetworkInstanceInput {
  nsInstanceId: string;
}
export const DeleteSolNetworkInstanceInput = S.suspend(() =>
  S.Struct({ nsInstanceId: S.String.pipe(T.HttpLabel("nsInstanceId")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/sol/nslcm/v1/ns_instances/{nsInstanceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSolNetworkInstanceInput",
}) as any as S.Schema<DeleteSolNetworkInstanceInput>;
export interface DeleteSolNetworkInstanceResponse {}
export const DeleteSolNetworkInstanceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSolNetworkInstanceResponse",
}) as any as S.Schema<DeleteSolNetworkInstanceResponse>;
export interface DeleteSolNetworkPackageInput {
  nsdInfoId: string;
}
export const DeleteSolNetworkPackageInput = S.suspend(() =>
  S.Struct({ nsdInfoId: S.String.pipe(T.HttpLabel("nsdInfoId")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/sol/nsd/v1/ns_descriptors/{nsdInfoId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSolNetworkPackageInput",
}) as any as S.Schema<DeleteSolNetworkPackageInput>;
export interface DeleteSolNetworkPackageResponse {}
export const DeleteSolNetworkPackageResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSolNetworkPackageResponse",
}) as any as S.Schema<DeleteSolNetworkPackageResponse>;
export interface GetSolFunctionInstanceInput {
  vnfInstanceId: string;
}
export const GetSolFunctionInstanceInput = S.suspend(() =>
  S.Struct({ vnfInstanceId: S.String.pipe(T.HttpLabel("vnfInstanceId")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/sol/vnflcm/v1/vnf_instances/{vnfInstanceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSolFunctionInstanceInput",
}) as any as S.Schema<GetSolFunctionInstanceInput>;
export interface GetSolFunctionPackageInput {
  vnfPkgId: string;
}
export const GetSolFunctionPackageInput = S.suspend(() =>
  S.Struct({ vnfPkgId: S.String.pipe(T.HttpLabel("vnfPkgId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sol/vnfpkgm/v1/vnf_packages/{vnfPkgId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSolFunctionPackageInput",
}) as any as S.Schema<GetSolFunctionPackageInput>;
export interface GetSolFunctionPackageContentInput {
  vnfPkgId: string;
  accept: string;
}
export const GetSolFunctionPackageContentInput = S.suspend(() =>
  S.Struct({
    vnfPkgId: S.String.pipe(T.HttpLabel("vnfPkgId")),
    accept: S.String.pipe(T.HttpHeader("Accept")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/sol/vnfpkgm/v1/vnf_packages/{vnfPkgId}/package_content",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSolFunctionPackageContentInput",
}) as any as S.Schema<GetSolFunctionPackageContentInput>;
export interface GetSolFunctionPackageDescriptorInput {
  vnfPkgId: string;
  accept: string;
}
export const GetSolFunctionPackageDescriptorInput = S.suspend(() =>
  S.Struct({
    vnfPkgId: S.String.pipe(T.HttpLabel("vnfPkgId")),
    accept: S.String.pipe(T.HttpHeader("Accept")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/sol/vnfpkgm/v1/vnf_packages/{vnfPkgId}/vnfd",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSolFunctionPackageDescriptorInput",
}) as any as S.Schema<GetSolFunctionPackageDescriptorInput>;
export interface GetSolNetworkInstanceInput {
  nsInstanceId: string;
}
export const GetSolNetworkInstanceInput = S.suspend(() =>
  S.Struct({ nsInstanceId: S.String.pipe(T.HttpLabel("nsInstanceId")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/sol/nslcm/v1/ns_instances/{nsInstanceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSolNetworkInstanceInput",
}) as any as S.Schema<GetSolNetworkInstanceInput>;
export interface GetSolNetworkOperationInput {
  nsLcmOpOccId: string;
}
export const GetSolNetworkOperationInput = S.suspend(() =>
  S.Struct({ nsLcmOpOccId: S.String.pipe(T.HttpLabel("nsLcmOpOccId")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/sol/nslcm/v1/ns_lcm_op_occs/{nsLcmOpOccId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSolNetworkOperationInput",
}) as any as S.Schema<GetSolNetworkOperationInput>;
export interface GetSolNetworkPackageInput {
  nsdInfoId: string;
}
export const GetSolNetworkPackageInput = S.suspend(() =>
  S.Struct({ nsdInfoId: S.String.pipe(T.HttpLabel("nsdInfoId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sol/nsd/v1/ns_descriptors/{nsdInfoId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSolNetworkPackageInput",
}) as any as S.Schema<GetSolNetworkPackageInput>;
export interface GetSolNetworkPackageContentInput {
  nsdInfoId: string;
  accept: string;
}
export const GetSolNetworkPackageContentInput = S.suspend(() =>
  S.Struct({
    nsdInfoId: S.String.pipe(T.HttpLabel("nsdInfoId")),
    accept: S.String.pipe(T.HttpHeader("Accept")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/sol/nsd/v1/ns_descriptors/{nsdInfoId}/nsd_content",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSolNetworkPackageContentInput",
}) as any as S.Schema<GetSolNetworkPackageContentInput>;
export interface GetSolNetworkPackageDescriptorInput {
  nsdInfoId: string;
}
export const GetSolNetworkPackageDescriptorInput = S.suspend(() =>
  S.Struct({ nsdInfoId: S.String.pipe(T.HttpLabel("nsdInfoId")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/sol/nsd/v1/ns_descriptors/{nsdInfoId}/nsd",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSolNetworkPackageDescriptorInput",
}) as any as S.Schema<GetSolNetworkPackageDescriptorInput>;
export interface InstantiateSolNetworkInstanceInput {
  nsInstanceId: string;
  dryRun?: boolean;
  additionalParamsForNs?: any;
  tags?: TagMap;
}
export const InstantiateSolNetworkInstanceInput = S.suspend(() =>
  S.Struct({
    nsInstanceId: S.String.pipe(T.HttpLabel("nsInstanceId")),
    dryRun: S.optional(S.Boolean).pipe(T.HttpQuery("dry_run")),
    additionalParamsForNs: S.optional(S.Any),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/sol/nslcm/v1/ns_instances/{nsInstanceId}/instantiate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InstantiateSolNetworkInstanceInput",
}) as any as S.Schema<InstantiateSolNetworkInstanceInput>;
export interface ListSolFunctionInstancesInput {
  maxResults?: number;
  nextToken?: string;
}
export const ListSolFunctionInstancesInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextpage_opaque_marker")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sol/vnflcm/v1/vnf_instances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSolFunctionInstancesInput",
}) as any as S.Schema<ListSolFunctionInstancesInput>;
export interface ListSolFunctionPackagesInput {
  maxResults?: number;
  nextToken?: string;
}
export const ListSolFunctionPackagesInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextpage_opaque_marker")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sol/vnfpkgm/v1/vnf_packages" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSolFunctionPackagesInput",
}) as any as S.Schema<ListSolFunctionPackagesInput>;
export interface ListSolNetworkInstancesInput {
  maxResults?: number;
  nextToken?: string;
}
export const ListSolNetworkInstancesInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextpage_opaque_marker")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sol/nslcm/v1/ns_instances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSolNetworkInstancesInput",
}) as any as S.Schema<ListSolNetworkInstancesInput>;
export interface ListSolNetworkOperationsInput {
  nsInstanceId?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListSolNetworkOperationsInput = S.suspend(() =>
  S.Struct({
    nsInstanceId: S.optional(S.String).pipe(T.HttpQuery("nsInstanceId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextpage_opaque_marker")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sol/nslcm/v1/ns_lcm_op_occs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSolNetworkOperationsInput",
}) as any as S.Schema<ListSolNetworkOperationsInput>;
export interface ListSolNetworkPackagesInput {
  maxResults?: number;
  nextToken?: string;
}
export const ListSolNetworkPackagesInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextpage_opaque_marker")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sol/nsd/v1/ns_descriptors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSolNetworkPackagesInput",
}) as any as S.Schema<ListSolNetworkPackagesInput>;
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
export interface PutSolFunctionPackageContentInput {
  vnfPkgId: string;
  contentType?: string;
  file: T.StreamingInputBody;
}
export const PutSolFunctionPackageContentInput = S.suspend(() =>
  S.Struct({
    vnfPkgId: S.String.pipe(T.HttpLabel("vnfPkgId")),
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    file: T.StreamingInput.pipe(T.HttpPayload()),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/sol/vnfpkgm/v1/vnf_packages/{vnfPkgId}/package_content",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutSolFunctionPackageContentInput",
}) as any as S.Schema<PutSolFunctionPackageContentInput>;
export interface PutSolNetworkPackageContentInput {
  nsdInfoId: string;
  contentType?: string;
  file: T.StreamingInputBody;
}
export const PutSolNetworkPackageContentInput = S.suspend(() =>
  S.Struct({
    nsdInfoId: S.String.pipe(T.HttpLabel("nsdInfoId")),
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    file: T.StreamingInput.pipe(T.HttpPayload()),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/sol/nsd/v1/ns_descriptors/{nsdInfoId}/nsd_content",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutSolNetworkPackageContentInput",
}) as any as S.Schema<PutSolNetworkPackageContentInput>;
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
export interface TerminateSolNetworkInstanceInput {
  nsInstanceId: string;
  tags?: TagMap;
}
export const TerminateSolNetworkInstanceInput = S.suspend(() =>
  S.Struct({
    nsInstanceId: S.String.pipe(T.HttpLabel("nsInstanceId")),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/sol/nslcm/v1/ns_instances/{nsInstanceId}/terminate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TerminateSolNetworkInstanceInput",
}) as any as S.Schema<TerminateSolNetworkInstanceInput>;
export interface UntagResourceInput {
  resourceArn: string;
  tagKeys: TagKeys;
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
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
export interface UpdateSolFunctionPackageInput {
  vnfPkgId: string;
  operationalState: string;
}
export const UpdateSolFunctionPackageInput = S.suspend(() =>
  S.Struct({
    vnfPkgId: S.String.pipe(T.HttpLabel("vnfPkgId")),
    operationalState: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/sol/vnfpkgm/v1/vnf_packages/{vnfPkgId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSolFunctionPackageInput",
}) as any as S.Schema<UpdateSolFunctionPackageInput>;
export interface UpdateSolNetworkPackageInput {
  nsdInfoId: string;
  nsdOperationalState: string;
}
export const UpdateSolNetworkPackageInput = S.suspend(() =>
  S.Struct({
    nsdInfoId: S.String.pipe(T.HttpLabel("nsdInfoId")),
    nsdOperationalState: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/sol/nsd/v1/ns_descriptors/{nsdInfoId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSolNetworkPackageInput",
}) as any as S.Schema<UpdateSolNetworkPackageInput>;
export interface ValidateSolFunctionPackageContentInput {
  vnfPkgId: string;
  contentType?: string;
  file: T.StreamingInputBody;
}
export const ValidateSolFunctionPackageContentInput = S.suspend(() =>
  S.Struct({
    vnfPkgId: S.String.pipe(T.HttpLabel("vnfPkgId")),
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    file: T.StreamingInput.pipe(T.HttpPayload()),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/sol/vnfpkgm/v1/vnf_packages/{vnfPkgId}/package_content/validate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ValidateSolFunctionPackageContentInput",
}) as any as S.Schema<ValidateSolFunctionPackageContentInput>;
export interface ValidateSolNetworkPackageContentInput {
  nsdInfoId: string;
  contentType?: string;
  file: T.StreamingInputBody;
}
export const ValidateSolNetworkPackageContentInput = S.suspend(() =>
  S.Struct({
    nsdInfoId: S.String.pipe(T.HttpLabel("nsdInfoId")),
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    file: T.StreamingInput.pipe(T.HttpPayload()),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/sol/nsd/v1/ns_descriptors/{nsdInfoId}/nsd_content/validate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ValidateSolNetworkPackageContentInput",
}) as any as S.Schema<ValidateSolNetworkPackageContentInput>;
export type VnfPkgIdList = string[];
export const VnfPkgIdList = S.Array(S.String);
export interface UpdateSolNetworkModify {
  vnfInstanceId: string;
  vnfConfigurableProperties: any;
}
export const UpdateSolNetworkModify = S.suspend(() =>
  S.Struct({ vnfInstanceId: S.String, vnfConfigurableProperties: S.Any }),
).annotations({
  identifier: "UpdateSolNetworkModify",
}) as any as S.Schema<UpdateSolNetworkModify>;
export interface UpdateSolNetworkServiceData {
  nsdInfoId: string;
  additionalParamsForNs?: any;
}
export const UpdateSolNetworkServiceData = S.suspend(() =>
  S.Struct({ nsdInfoId: S.String, additionalParamsForNs: S.optional(S.Any) }),
).annotations({
  identifier: "UpdateSolNetworkServiceData",
}) as any as S.Schema<UpdateSolNetworkServiceData>;
export interface CreateSolFunctionPackageInput {
  tags?: TagMap;
}
export const CreateSolFunctionPackageInput = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/sol/vnfpkgm/v1/vnf_packages" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSolFunctionPackageInput",
}) as any as S.Schema<CreateSolFunctionPackageInput>;
export interface CreateSolNetworkInstanceOutput {
  id: string;
  arn: string;
  nsdInfoId: string;
  nsInstanceName: string;
  tags?: TagMap;
}
export const CreateSolNetworkInstanceOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    nsdInfoId: S.String,
    nsInstanceName: S.String,
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "CreateSolNetworkInstanceOutput",
}) as any as S.Schema<CreateSolNetworkInstanceOutput>;
export interface CreateSolNetworkPackageOutput {
  id: string;
  arn: string;
  nsdOnboardingState: string;
  nsdOperationalState: string;
  nsdUsageState: string;
  tags?: TagMap;
}
export const CreateSolNetworkPackageOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    nsdOnboardingState: S.String,
    nsdOperationalState: S.String,
    nsdUsageState: S.String,
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "CreateSolNetworkPackageOutput",
}) as any as S.Schema<CreateSolNetworkPackageOutput>;
export interface GetSolFunctionPackageContentOutput {
  contentType?: string;
  packageContent?: Uint8Array;
}
export const GetSolFunctionPackageContentOutput = S.suspend(() =>
  S.Struct({
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    packageContent: S.optional(T.Blob).pipe(T.HttpPayload()),
  }),
).annotations({
  identifier: "GetSolFunctionPackageContentOutput",
}) as any as S.Schema<GetSolFunctionPackageContentOutput>;
export interface GetSolFunctionPackageDescriptorOutput {
  contentType?: string;
  vnfd?: Uint8Array;
}
export const GetSolFunctionPackageDescriptorOutput = S.suspend(() =>
  S.Struct({
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    vnfd: S.optional(T.Blob).pipe(T.HttpPayload()),
  }),
).annotations({
  identifier: "GetSolFunctionPackageDescriptorOutput",
}) as any as S.Schema<GetSolFunctionPackageDescriptorOutput>;
export interface GetSolNetworkPackageContentOutput {
  contentType?: string;
  nsdContent?: Uint8Array;
}
export const GetSolNetworkPackageContentOutput = S.suspend(() =>
  S.Struct({
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    nsdContent: S.optional(T.Blob).pipe(T.HttpPayload()),
  }),
).annotations({
  identifier: "GetSolNetworkPackageContentOutput",
}) as any as S.Schema<GetSolNetworkPackageContentOutput>;
export interface GetSolNetworkPackageDescriptorOutput {
  contentType?: string;
  nsd?: Uint8Array;
}
export const GetSolNetworkPackageDescriptorOutput = S.suspend(() =>
  S.Struct({
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    nsd: S.optional(T.Blob).pipe(T.HttpPayload()),
  }),
).annotations({
  identifier: "GetSolNetworkPackageDescriptorOutput",
}) as any as S.Schema<GetSolNetworkPackageDescriptorOutput>;
export interface InstantiateSolNetworkInstanceOutput {
  nsLcmOpOccId: string;
  tags?: TagMap;
}
export const InstantiateSolNetworkInstanceOutput = S.suspend(() =>
  S.Struct({ nsLcmOpOccId: S.String, tags: S.optional(TagMap) }),
).annotations({
  identifier: "InstantiateSolNetworkInstanceOutput",
}) as any as S.Schema<InstantiateSolNetworkInstanceOutput>;
export interface ListTagsForResourceOutput {
  tags: TagMap;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ tags: TagMap }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface TerminateSolNetworkInstanceOutput {
  nsLcmOpOccId?: string;
  tags?: TagMap;
}
export const TerminateSolNetworkInstanceOutput = S.suspend(() =>
  S.Struct({ nsLcmOpOccId: S.optional(S.String), tags: S.optional(TagMap) }),
).annotations({
  identifier: "TerminateSolNetworkInstanceOutput",
}) as any as S.Schema<TerminateSolNetworkInstanceOutput>;
export interface UpdateSolFunctionPackageOutput {
  operationalState: string;
}
export const UpdateSolFunctionPackageOutput = S.suspend(() =>
  S.Struct({ operationalState: S.String }),
).annotations({
  identifier: "UpdateSolFunctionPackageOutput",
}) as any as S.Schema<UpdateSolFunctionPackageOutput>;
export interface UpdateSolNetworkInstanceInput {
  nsInstanceId: string;
  updateType: string;
  modifyVnfInfoData?: UpdateSolNetworkModify;
  updateNs?: UpdateSolNetworkServiceData;
  tags?: TagMap;
}
export const UpdateSolNetworkInstanceInput = S.suspend(() =>
  S.Struct({
    nsInstanceId: S.String.pipe(T.HttpLabel("nsInstanceId")),
    updateType: S.String,
    modifyVnfInfoData: S.optional(UpdateSolNetworkModify),
    updateNs: S.optional(UpdateSolNetworkServiceData),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/sol/nslcm/v1/ns_instances/{nsInstanceId}/update",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSolNetworkInstanceInput",
}) as any as S.Schema<UpdateSolNetworkInstanceInput>;
export interface UpdateSolNetworkPackageOutput {
  nsdOperationalState: string;
}
export const UpdateSolNetworkPackageOutput = S.suspend(() =>
  S.Struct({ nsdOperationalState: S.String }),
).annotations({
  identifier: "UpdateSolNetworkPackageOutput",
}) as any as S.Schema<UpdateSolNetworkPackageOutput>;
export interface GetSolFunctionInstanceMetadata {
  createdAt: Date;
  lastModified: Date;
}
export const GetSolFunctionInstanceMetadata = S.suspend(() =>
  S.Struct({
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetSolFunctionInstanceMetadata",
}) as any as S.Schema<GetSolFunctionInstanceMetadata>;
export interface LcmOperationInfo {
  nsLcmOpOccId: string;
}
export const LcmOperationInfo = S.suspend(() =>
  S.Struct({ nsLcmOpOccId: S.String }),
).annotations({
  identifier: "LcmOperationInfo",
}) as any as S.Schema<LcmOperationInfo>;
export interface GetSolNetworkInstanceMetadata {
  createdAt: Date;
  lastModified: Date;
}
export const GetSolNetworkInstanceMetadata = S.suspend(() =>
  S.Struct({
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetSolNetworkInstanceMetadata",
}) as any as S.Schema<GetSolNetworkInstanceMetadata>;
export interface ProblemDetails {
  detail: string;
  title?: string;
}
export const ProblemDetails = S.suspend(() =>
  S.Struct({ detail: S.String, title: S.optional(S.String) }),
).annotations({
  identifier: "ProblemDetails",
}) as any as S.Schema<ProblemDetails>;
export interface ToscaOverride {
  name?: string;
  defaultValue?: string;
}
export const ToscaOverride = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), defaultValue: S.optional(S.String) }),
).annotations({
  identifier: "ToscaOverride",
}) as any as S.Schema<ToscaOverride>;
export type OverrideList = ToscaOverride[];
export const OverrideList = S.Array(ToscaOverride);
export interface FunctionArtifactMeta {
  overrides?: OverrideList;
}
export const FunctionArtifactMeta = S.suspend(() =>
  S.Struct({ overrides: S.optional(OverrideList) }),
).annotations({
  identifier: "FunctionArtifactMeta",
}) as any as S.Schema<FunctionArtifactMeta>;
export interface PutSolFunctionPackageContentMetadata {
  vnfd?: FunctionArtifactMeta;
}
export const PutSolFunctionPackageContentMetadata = S.suspend(() =>
  S.Struct({ vnfd: S.optional(FunctionArtifactMeta) }),
).annotations({
  identifier: "PutSolFunctionPackageContentMetadata",
}) as any as S.Schema<PutSolFunctionPackageContentMetadata>;
export interface NetworkArtifactMeta {
  overrides?: OverrideList;
}
export const NetworkArtifactMeta = S.suspend(() =>
  S.Struct({ overrides: S.optional(OverrideList) }),
).annotations({
  identifier: "NetworkArtifactMeta",
}) as any as S.Schema<NetworkArtifactMeta>;
export interface PutSolNetworkPackageContentMetadata {
  nsd?: NetworkArtifactMeta;
}
export const PutSolNetworkPackageContentMetadata = S.suspend(() =>
  S.Struct({ nsd: S.optional(NetworkArtifactMeta) }),
).annotations({
  identifier: "PutSolNetworkPackageContentMetadata",
}) as any as S.Schema<PutSolNetworkPackageContentMetadata>;
export interface ValidateSolFunctionPackageContentMetadata {
  vnfd?: FunctionArtifactMeta;
}
export const ValidateSolFunctionPackageContentMetadata = S.suspend(() =>
  S.Struct({ vnfd: S.optional(FunctionArtifactMeta) }),
).annotations({
  identifier: "ValidateSolFunctionPackageContentMetadata",
}) as any as S.Schema<ValidateSolFunctionPackageContentMetadata>;
export interface ValidateSolNetworkPackageContentMetadata {
  nsd?: NetworkArtifactMeta;
}
export const ValidateSolNetworkPackageContentMetadata = S.suspend(() =>
  S.Struct({ nsd: S.optional(NetworkArtifactMeta) }),
).annotations({
  identifier: "ValidateSolNetworkPackageContentMetadata",
}) as any as S.Schema<ValidateSolNetworkPackageContentMetadata>;
export interface CreateSolFunctionPackageOutput {
  id: string;
  arn: string;
  onboardingState: string;
  operationalState: string;
  usageState: string;
  tags?: TagMap;
}
export const CreateSolFunctionPackageOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    onboardingState: S.String,
    operationalState: S.String,
    usageState: S.String,
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "CreateSolFunctionPackageOutput",
}) as any as S.Schema<CreateSolFunctionPackageOutput>;
export interface GetSolNetworkInstanceOutput {
  id: string;
  arn: string;
  nsInstanceName: string;
  nsInstanceDescription: string;
  nsdId: string;
  nsdInfoId: string;
  nsState?: string;
  lcmOpInfo?: LcmOperationInfo;
  metadata: GetSolNetworkInstanceMetadata;
  tags?: TagMap;
}
export const GetSolNetworkInstanceOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    nsInstanceName: S.String,
    nsInstanceDescription: S.String,
    nsdId: S.String,
    nsdInfoId: S.String,
    nsState: S.optional(S.String),
    lcmOpInfo: S.optional(LcmOperationInfo),
    metadata: GetSolNetworkInstanceMetadata,
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetSolNetworkInstanceOutput",
}) as any as S.Schema<GetSolNetworkInstanceOutput>;
export interface PutSolFunctionPackageContentOutput {
  id: string;
  vnfdId: string;
  vnfProductName: string;
  vnfProvider: string;
  vnfdVersion: string;
  metadata: PutSolFunctionPackageContentMetadata;
}
export const PutSolFunctionPackageContentOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    vnfdId: S.String,
    vnfProductName: S.String,
    vnfProvider: S.String,
    vnfdVersion: S.String,
    metadata: PutSolFunctionPackageContentMetadata,
  }),
).annotations({
  identifier: "PutSolFunctionPackageContentOutput",
}) as any as S.Schema<PutSolFunctionPackageContentOutput>;
export interface PutSolNetworkPackageContentOutput {
  id: string;
  arn: string;
  nsdId: string;
  nsdName: string;
  nsdVersion: string;
  vnfPkgIds: VnfPkgIdList;
  metadata: PutSolNetworkPackageContentMetadata;
}
export const PutSolNetworkPackageContentOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    nsdId: S.String,
    nsdName: S.String,
    nsdVersion: S.String,
    vnfPkgIds: VnfPkgIdList,
    metadata: PutSolNetworkPackageContentMetadata,
  }),
).annotations({
  identifier: "PutSolNetworkPackageContentOutput",
}) as any as S.Schema<PutSolNetworkPackageContentOutput>;
export interface UpdateSolNetworkInstanceOutput {
  nsLcmOpOccId?: string;
  tags?: TagMap;
}
export const UpdateSolNetworkInstanceOutput = S.suspend(() =>
  S.Struct({ nsLcmOpOccId: S.optional(S.String), tags: S.optional(TagMap) }),
).annotations({
  identifier: "UpdateSolNetworkInstanceOutput",
}) as any as S.Schema<UpdateSolNetworkInstanceOutput>;
export interface ValidateSolFunctionPackageContentOutput {
  id: string;
  vnfdId: string;
  vnfProductName: string;
  vnfProvider: string;
  vnfdVersion: string;
  metadata: ValidateSolFunctionPackageContentMetadata;
}
export const ValidateSolFunctionPackageContentOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    vnfdId: S.String,
    vnfProductName: S.String,
    vnfProvider: S.String,
    vnfdVersion: S.String,
    metadata: ValidateSolFunctionPackageContentMetadata,
  }),
).annotations({
  identifier: "ValidateSolFunctionPackageContentOutput",
}) as any as S.Schema<ValidateSolFunctionPackageContentOutput>;
export interface ValidateSolNetworkPackageContentOutput {
  id: string;
  arn: string;
  nsdId: string;
  nsdName: string;
  nsdVersion: string;
  vnfPkgIds: VnfPkgIdList;
  metadata: ValidateSolNetworkPackageContentMetadata;
}
export const ValidateSolNetworkPackageContentOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    nsdId: S.String,
    nsdName: S.String,
    nsdVersion: S.String,
    vnfPkgIds: VnfPkgIdList,
    metadata: ValidateSolNetworkPackageContentMetadata,
  }),
).annotations({
  identifier: "ValidateSolNetworkPackageContentOutput",
}) as any as S.Schema<ValidateSolNetworkPackageContentOutput>;
export interface UpdateNsMetadata {
  nsdInfoId: string;
  additionalParamsForNs?: any;
}
export const UpdateNsMetadata = S.suspend(() =>
  S.Struct({ nsdInfoId: S.String, additionalParamsForNs: S.optional(S.Any) }),
).annotations({
  identifier: "UpdateNsMetadata",
}) as any as S.Schema<UpdateNsMetadata>;
export interface ModifyVnfInfoMetadata {
  vnfInstanceId: string;
  vnfConfigurableProperties: any;
}
export const ModifyVnfInfoMetadata = S.suspend(() =>
  S.Struct({ vnfInstanceId: S.String, vnfConfigurableProperties: S.Any }),
).annotations({
  identifier: "ModifyVnfInfoMetadata",
}) as any as S.Schema<ModifyVnfInfoMetadata>;
export interface InstantiateMetadata {
  nsdInfoId: string;
  additionalParamsForNs?: any;
}
export const InstantiateMetadata = S.suspend(() =>
  S.Struct({ nsdInfoId: S.String, additionalParamsForNs: S.optional(S.Any) }),
).annotations({
  identifier: "InstantiateMetadata",
}) as any as S.Schema<InstantiateMetadata>;
export type StringMap = { [key: string]: string };
export const StringMap = S.Record({ key: S.String, value: S.String });
export interface ErrorInfo {
  cause?: string;
  details?: string;
}
export const ErrorInfo = S.suspend(() =>
  S.Struct({ cause: S.optional(S.String), details: S.optional(S.String) }),
).annotations({ identifier: "ErrorInfo" }) as any as S.Schema<ErrorInfo>;
export interface GetSolInstantiatedVnfInfo {
  vnfState?: string;
}
export const GetSolInstantiatedVnfInfo = S.suspend(() =>
  S.Struct({ vnfState: S.optional(S.String) }),
).annotations({
  identifier: "GetSolInstantiatedVnfInfo",
}) as any as S.Schema<GetSolInstantiatedVnfInfo>;
export interface ListSolFunctionInstanceMetadata {
  createdAt: Date;
  lastModified: Date;
}
export const ListSolFunctionInstanceMetadata = S.suspend(() =>
  S.Struct({
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ListSolFunctionInstanceMetadata",
}) as any as S.Schema<ListSolFunctionInstanceMetadata>;
export interface ListSolFunctionPackageMetadata {
  createdAt: Date;
  lastModified: Date;
}
export const ListSolFunctionPackageMetadata = S.suspend(() =>
  S.Struct({
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ListSolFunctionPackageMetadata",
}) as any as S.Schema<ListSolFunctionPackageMetadata>;
export interface ListSolNetworkInstanceMetadata {
  createdAt: Date;
  lastModified: Date;
}
export const ListSolNetworkInstanceMetadata = S.suspend(() =>
  S.Struct({
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ListSolNetworkInstanceMetadata",
}) as any as S.Schema<ListSolNetworkInstanceMetadata>;
export interface ListSolNetworkOperationsMetadata {
  nsdInfoId?: string;
  vnfInstanceId?: string;
  createdAt: Date;
  lastModified: Date;
}
export const ListSolNetworkOperationsMetadata = S.suspend(() =>
  S.Struct({
    nsdInfoId: S.optional(S.String),
    vnfInstanceId: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ListSolNetworkOperationsMetadata",
}) as any as S.Schema<ListSolNetworkOperationsMetadata>;
export interface ListSolNetworkPackageMetadata {
  createdAt: Date;
  lastModified: Date;
}
export const ListSolNetworkPackageMetadata = S.suspend(() =>
  S.Struct({
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ListSolNetworkPackageMetadata",
}) as any as S.Schema<ListSolNetworkPackageMetadata>;
export interface GetSolNetworkOperationMetadata {
  updateNsMetadata?: UpdateNsMetadata;
  modifyVnfInfoMetadata?: ModifyVnfInfoMetadata;
  instantiateMetadata?: InstantiateMetadata;
  createdAt: Date;
  lastModified: Date;
}
export const GetSolNetworkOperationMetadata = S.suspend(() =>
  S.Struct({
    updateNsMetadata: S.optional(UpdateNsMetadata),
    modifyVnfInfoMetadata: S.optional(ModifyVnfInfoMetadata),
    instantiateMetadata: S.optional(InstantiateMetadata),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetSolNetworkOperationMetadata",
}) as any as S.Schema<GetSolNetworkOperationMetadata>;
export interface GetSolNetworkOperationTaskDetails {
  taskName?: string;
  taskContext?: StringMap;
  taskErrorDetails?: ErrorInfo;
  taskStatus?: string;
  taskStartTime?: Date;
  taskEndTime?: Date;
}
export const GetSolNetworkOperationTaskDetails = S.suspend(() =>
  S.Struct({
    taskName: S.optional(S.String),
    taskContext: S.optional(StringMap),
    taskErrorDetails: S.optional(ErrorInfo),
    taskStatus: S.optional(S.String),
    taskStartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    taskEndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetSolNetworkOperationTaskDetails",
}) as any as S.Schema<GetSolNetworkOperationTaskDetails>;
export type GetSolNetworkOperationTasksList =
  GetSolNetworkOperationTaskDetails[];
export const GetSolNetworkOperationTasksList = S.Array(
  GetSolNetworkOperationTaskDetails,
);
export interface GetSolNetworkPackageMetadata {
  nsd?: NetworkArtifactMeta;
  createdAt: Date;
  lastModified: Date;
}
export const GetSolNetworkPackageMetadata = S.suspend(() =>
  S.Struct({
    nsd: S.optional(NetworkArtifactMeta),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetSolNetworkPackageMetadata",
}) as any as S.Schema<GetSolNetworkPackageMetadata>;
export interface ListSolFunctionInstanceInfo {
  id: string;
  arn: string;
  nsInstanceId: string;
  vnfPkgId: string;
  vnfPkgName?: string;
  instantiationState: string;
  instantiatedVnfInfo?: GetSolInstantiatedVnfInfo;
  metadata: ListSolFunctionInstanceMetadata;
}
export const ListSolFunctionInstanceInfo = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    nsInstanceId: S.String,
    vnfPkgId: S.String,
    vnfPkgName: S.optional(S.String),
    instantiationState: S.String,
    instantiatedVnfInfo: S.optional(GetSolInstantiatedVnfInfo),
    metadata: ListSolFunctionInstanceMetadata,
  }),
).annotations({
  identifier: "ListSolFunctionInstanceInfo",
}) as any as S.Schema<ListSolFunctionInstanceInfo>;
export type ListSolFunctionInstanceResources = ListSolFunctionInstanceInfo[];
export const ListSolFunctionInstanceResources = S.Array(
  ListSolFunctionInstanceInfo,
);
export interface ListSolFunctionPackageInfo {
  id: string;
  arn: string;
  onboardingState: string;
  operationalState: string;
  usageState: string;
  vnfdId?: string;
  vnfProvider?: string;
  vnfProductName?: string;
  vnfdVersion?: string;
  metadata?: ListSolFunctionPackageMetadata;
}
export const ListSolFunctionPackageInfo = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    onboardingState: S.String,
    operationalState: S.String,
    usageState: S.String,
    vnfdId: S.optional(S.String),
    vnfProvider: S.optional(S.String),
    vnfProductName: S.optional(S.String),
    vnfdVersion: S.optional(S.String),
    metadata: S.optional(ListSolFunctionPackageMetadata),
  }),
).annotations({
  identifier: "ListSolFunctionPackageInfo",
}) as any as S.Schema<ListSolFunctionPackageInfo>;
export type ListSolFunctionPackageResources = ListSolFunctionPackageInfo[];
export const ListSolFunctionPackageResources = S.Array(
  ListSolFunctionPackageInfo,
);
export interface ListSolNetworkInstanceInfo {
  id: string;
  arn: string;
  nsInstanceName: string;
  nsInstanceDescription: string;
  nsdId: string;
  nsdInfoId: string;
  nsState: string;
  metadata: ListSolNetworkInstanceMetadata;
}
export const ListSolNetworkInstanceInfo = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    nsInstanceName: S.String,
    nsInstanceDescription: S.String,
    nsdId: S.String,
    nsdInfoId: S.String,
    nsState: S.String,
    metadata: ListSolNetworkInstanceMetadata,
  }),
).annotations({
  identifier: "ListSolNetworkInstanceInfo",
}) as any as S.Schema<ListSolNetworkInstanceInfo>;
export type ListSolNetworkInstanceResources = ListSolNetworkInstanceInfo[];
export const ListSolNetworkInstanceResources = S.Array(
  ListSolNetworkInstanceInfo,
);
export interface ListSolNetworkOperationsInfo {
  id: string;
  arn: string;
  operationState: string;
  nsInstanceId: string;
  lcmOperationType: string;
  updateType?: string;
  error?: ProblemDetails;
  metadata?: ListSolNetworkOperationsMetadata;
}
export const ListSolNetworkOperationsInfo = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    operationState: S.String,
    nsInstanceId: S.String,
    lcmOperationType: S.String,
    updateType: S.optional(S.String),
    error: S.optional(ProblemDetails),
    metadata: S.optional(ListSolNetworkOperationsMetadata),
  }),
).annotations({
  identifier: "ListSolNetworkOperationsInfo",
}) as any as S.Schema<ListSolNetworkOperationsInfo>;
export type ListSolNetworkOperationsResources = ListSolNetworkOperationsInfo[];
export const ListSolNetworkOperationsResources = S.Array(
  ListSolNetworkOperationsInfo,
);
export interface ListSolNetworkPackageInfo {
  id: string;
  arn: string;
  nsdOnboardingState: string;
  nsdOperationalState: string;
  nsdUsageState: string;
  nsdId?: string;
  nsdName?: string;
  nsdVersion?: string;
  nsdDesigner?: string;
  nsdInvariantId?: string;
  vnfPkgIds?: VnfPkgIdList;
  metadata: ListSolNetworkPackageMetadata;
}
export const ListSolNetworkPackageInfo = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    nsdOnboardingState: S.String,
    nsdOperationalState: S.String,
    nsdUsageState: S.String,
    nsdId: S.optional(S.String),
    nsdName: S.optional(S.String),
    nsdVersion: S.optional(S.String),
    nsdDesigner: S.optional(S.String),
    nsdInvariantId: S.optional(S.String),
    vnfPkgIds: S.optional(VnfPkgIdList),
    metadata: ListSolNetworkPackageMetadata,
  }),
).annotations({
  identifier: "ListSolNetworkPackageInfo",
}) as any as S.Schema<ListSolNetworkPackageInfo>;
export type ListSolNetworkPackageResources = ListSolNetworkPackageInfo[];
export const ListSolNetworkPackageResources = S.Array(
  ListSolNetworkPackageInfo,
);
export interface GetSolVnfcResourceInfoMetadata {
  nodeGroup?: string;
  cluster?: string;
  helmChart?: string;
}
export const GetSolVnfcResourceInfoMetadata = S.suspend(() =>
  S.Struct({
    nodeGroup: S.optional(S.String),
    cluster: S.optional(S.String),
    helmChart: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSolVnfcResourceInfoMetadata",
}) as any as S.Schema<GetSolVnfcResourceInfoMetadata>;
export interface GetSolNetworkOperationOutput {
  id?: string;
  arn: string;
  operationState?: string;
  nsInstanceId?: string;
  lcmOperationType?: string;
  updateType?: string;
  error?: ProblemDetails;
  metadata?: GetSolNetworkOperationMetadata;
  tasks?: GetSolNetworkOperationTasksList;
  tags?: TagMap;
}
export const GetSolNetworkOperationOutput = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.String,
    operationState: S.optional(S.String),
    nsInstanceId: S.optional(S.String),
    lcmOperationType: S.optional(S.String),
    updateType: S.optional(S.String),
    error: S.optional(ProblemDetails),
    metadata: S.optional(GetSolNetworkOperationMetadata),
    tasks: S.optional(GetSolNetworkOperationTasksList),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetSolNetworkOperationOutput",
}) as any as S.Schema<GetSolNetworkOperationOutput>;
export interface GetSolNetworkPackageOutput {
  id: string;
  arn: string;
  nsdOnboardingState: string;
  nsdOperationalState: string;
  nsdUsageState: string;
  nsdId: string;
  nsdName: string;
  nsdVersion: string;
  vnfPkgIds: VnfPkgIdList;
  metadata: GetSolNetworkPackageMetadata;
  tags?: TagMap;
}
export const GetSolNetworkPackageOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    nsdOnboardingState: S.String,
    nsdOperationalState: S.String,
    nsdUsageState: S.String,
    nsdId: S.String,
    nsdName: S.String,
    nsdVersion: S.String,
    vnfPkgIds: VnfPkgIdList,
    metadata: GetSolNetworkPackageMetadata,
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetSolNetworkPackageOutput",
}) as any as S.Schema<GetSolNetworkPackageOutput>;
export interface ListSolFunctionInstancesOutput {
  nextToken?: string;
  functionInstances?: ListSolFunctionInstanceResources;
}
export const ListSolFunctionInstancesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    functionInstances: S.optional(ListSolFunctionInstanceResources),
  }),
).annotations({
  identifier: "ListSolFunctionInstancesOutput",
}) as any as S.Schema<ListSolFunctionInstancesOutput>;
export interface ListSolFunctionPackagesOutput {
  nextToken?: string;
  functionPackages: ListSolFunctionPackageResources;
}
export const ListSolFunctionPackagesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    functionPackages: ListSolFunctionPackageResources,
  }),
).annotations({
  identifier: "ListSolFunctionPackagesOutput",
}) as any as S.Schema<ListSolFunctionPackagesOutput>;
export interface ListSolNetworkInstancesOutput {
  nextToken?: string;
  networkInstances?: ListSolNetworkInstanceResources;
}
export const ListSolNetworkInstancesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    networkInstances: S.optional(ListSolNetworkInstanceResources),
  }),
).annotations({
  identifier: "ListSolNetworkInstancesOutput",
}) as any as S.Schema<ListSolNetworkInstancesOutput>;
export interface ListSolNetworkOperationsOutput {
  nextToken?: string;
  networkOperations?: ListSolNetworkOperationsResources;
}
export const ListSolNetworkOperationsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    networkOperations: S.optional(ListSolNetworkOperationsResources),
  }),
).annotations({
  identifier: "ListSolNetworkOperationsOutput",
}) as any as S.Schema<ListSolNetworkOperationsOutput>;
export interface ListSolNetworkPackagesOutput {
  nextToken?: string;
  networkPackages: ListSolNetworkPackageResources;
}
export const ListSolNetworkPackagesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    networkPackages: ListSolNetworkPackageResources,
  }),
).annotations({
  identifier: "ListSolNetworkPackagesOutput",
}) as any as S.Schema<ListSolNetworkPackagesOutput>;
export interface GetSolVnfcResourceInfo {
  metadata?: GetSolVnfcResourceInfoMetadata;
}
export const GetSolVnfcResourceInfo = S.suspend(() =>
  S.Struct({ metadata: S.optional(GetSolVnfcResourceInfoMetadata) }),
).annotations({
  identifier: "GetSolVnfcResourceInfo",
}) as any as S.Schema<GetSolVnfcResourceInfo>;
export type GetSolVnfcResourceInfoList = GetSolVnfcResourceInfo[];
export const GetSolVnfcResourceInfoList = S.Array(GetSolVnfcResourceInfo);
export interface GetSolVnfInfo {
  vnfState?: string;
  vnfcResourceInfo?: GetSolVnfcResourceInfoList;
}
export const GetSolVnfInfo = S.suspend(() =>
  S.Struct({
    vnfState: S.optional(S.String),
    vnfcResourceInfo: S.optional(GetSolVnfcResourceInfoList),
  }),
).annotations({
  identifier: "GetSolVnfInfo",
}) as any as S.Schema<GetSolVnfInfo>;
export interface GetSolFunctionPackageMetadata {
  vnfd?: FunctionArtifactMeta;
  createdAt: Date;
  lastModified: Date;
}
export const GetSolFunctionPackageMetadata = S.suspend(() =>
  S.Struct({
    vnfd: S.optional(FunctionArtifactMeta),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetSolFunctionPackageMetadata",
}) as any as S.Schema<GetSolFunctionPackageMetadata>;
export interface GetSolFunctionInstanceOutput {
  id: string;
  arn: string;
  nsInstanceId: string;
  vnfPkgId: string;
  vnfdId: string;
  vnfProvider?: string;
  vnfProductName?: string;
  vnfdVersion?: string;
  instantiationState: string;
  instantiatedVnfInfo?: GetSolVnfInfo;
  metadata: GetSolFunctionInstanceMetadata;
  tags?: TagMap;
}
export const GetSolFunctionInstanceOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    nsInstanceId: S.String,
    vnfPkgId: S.String,
    vnfdId: S.String,
    vnfProvider: S.optional(S.String),
    vnfProductName: S.optional(S.String),
    vnfdVersion: S.optional(S.String),
    instantiationState: S.String,
    instantiatedVnfInfo: S.optional(GetSolVnfInfo),
    metadata: GetSolFunctionInstanceMetadata,
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetSolFunctionInstanceOutput",
}) as any as S.Schema<GetSolFunctionInstanceOutput>;
export interface GetSolFunctionPackageOutput {
  id: string;
  arn: string;
  onboardingState: string;
  operationalState: string;
  usageState: string;
  vnfdId?: string;
  vnfProvider?: string;
  vnfProductName?: string;
  vnfdVersion?: string;
  metadata?: GetSolFunctionPackageMetadata;
  tags?: TagMap;
}
export const GetSolFunctionPackageOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    onboardingState: S.String,
    operationalState: S.String,
    usageState: S.String,
    vnfdId: S.optional(S.String),
    vnfProvider: S.optional(S.String),
    vnfProductName: S.optional(S.String),
    vnfdVersion: S.optional(S.String),
    metadata: S.optional(GetSolFunctionPackageMetadata),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetSolFunctionPackageOutput",
}) as any as S.Schema<GetSolFunctionPackageOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
).pipe(C.withQuotaError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Cancels a network operation.
 *
 * A network operation is any operation that is done to your network, such as network instance instantiation or termination.
 */
export const cancelSolNetworkOperation: (
  input: CancelSolNetworkOperationInput,
) => Effect.Effect<
  CancelSolNetworkOperationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelSolNetworkOperationInput,
  output: CancelSolNetworkOperationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the details of a network function instance, including the instantiation state and
 * metadata from the function package descriptor in the network function package.
 *
 * A network function instance is a function in a function package .
 */
export const getSolFunctionInstance: (
  input: GetSolFunctionInstanceInput,
) => Effect.Effect<
  GetSolFunctionInstanceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSolFunctionInstanceInput,
  output: GetSolFunctionInstanceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the details of an individual function package, such as the operational state and
 * whether the package is in use.
 *
 * A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network..
 */
export const getSolFunctionPackage: (
  input: GetSolFunctionPackageInput,
) => Effect.Effect<
  GetSolFunctionPackageOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSolFunctionPackageInput,
  output: GetSolFunctionPackageOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a function package.
 *
 * A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network. For more information, see Function packages in the
 * *Amazon Web Services Telco Network Builder User Guide*.
 *
 * Creating a function package is the first step for creating a network in AWS TNB. This
 * request creates an empty container with an ID. The next step is to upload the actual CSAR
 * zip file into that empty container. To upload function package content, see PutSolFunctionPackageContent.
 */
export const createSolFunctionPackage: (
  input: CreateSolFunctionPackageInput,
) => Effect.Effect<
  CreateSolFunctionPackageOutput,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSolFunctionPackageInput,
  output: CreateSolFunctionPackageOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the details of a network operation, including the tasks involved in the network
 * operation and the status of the tasks.
 *
 * A network operation is any operation that is done to your network, such as network instance instantiation or termination.
 */
export const getSolNetworkOperation: (
  input: GetSolNetworkOperationInput,
) => Effect.Effect<
  GetSolNetworkOperationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSolNetworkOperationInput,
  output: GetSolNetworkOperationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the details of a network package.
 *
 * A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
 */
export const getSolNetworkPackage: (
  input: GetSolNetworkPackageInput,
) => Effect.Effect<
  GetSolNetworkPackageOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSolNetworkPackageInput,
  output: GetSolNetworkPackageOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists network function instances.
 *
 * A network function instance is a function in a function package .
 */
export const listSolFunctionInstances: {
  (
    input: ListSolFunctionInstancesInput,
  ): Effect.Effect<
    ListSolFunctionInstancesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSolFunctionInstancesInput,
  ) => Stream.Stream<
    ListSolFunctionInstancesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSolFunctionInstancesInput,
  ) => Stream.Stream<
    ListSolFunctionInstanceInfo,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSolFunctionInstancesInput,
  output: ListSolFunctionInstancesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "functionInstances",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists information about function packages.
 *
 * A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
 */
export const listSolFunctionPackages: {
  (
    input: ListSolFunctionPackagesInput,
  ): Effect.Effect<
    ListSolFunctionPackagesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSolFunctionPackagesInput,
  ) => Stream.Stream<
    ListSolFunctionPackagesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSolFunctionPackagesInput,
  ) => Stream.Stream<
    ListSolFunctionPackageInfo,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSolFunctionPackagesInput,
  output: ListSolFunctionPackagesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "functionPackages",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists your network instances.
 *
 * A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed.
 */
export const listSolNetworkInstances: {
  (
    input: ListSolNetworkInstancesInput,
  ): Effect.Effect<
    ListSolNetworkInstancesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSolNetworkInstancesInput,
  ) => Stream.Stream<
    ListSolNetworkInstancesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSolNetworkInstancesInput,
  ) => Stream.Stream<
    ListSolNetworkInstanceInfo,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSolNetworkInstancesInput,
  output: ListSolNetworkInstancesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "networkInstances",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists details for a network operation, including when the operation started and the
 * status of the operation.
 *
 * A network operation is any operation that is done to your network, such as network instance instantiation or termination.
 */
export const listSolNetworkOperations: {
  (
    input: ListSolNetworkOperationsInput,
  ): Effect.Effect<
    ListSolNetworkOperationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSolNetworkOperationsInput,
  ) => Stream.Stream<
    ListSolNetworkOperationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSolNetworkOperationsInput,
  ) => Stream.Stream<
    ListSolNetworkOperationsInfo,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSolNetworkOperationsInput,
  output: ListSolNetworkOperationsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "networkOperations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists network packages.
 *
 * A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
 */
export const listSolNetworkPackages: {
  (
    input: ListSolNetworkPackagesInput,
  ): Effect.Effect<
    ListSolNetworkPackagesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSolNetworkPackagesInput,
  ) => Stream.Stream<
    ListSolNetworkPackagesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSolNetworkPackagesInput,
  ) => Stream.Stream<
    ListSolNetworkPackageInfo,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSolNetworkPackagesInput,
  output: ListSolNetworkPackagesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "networkPackages",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets the details of the network instance.
 *
 * A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed.
 */
export const getSolNetworkInstance: (
  input: GetSolNetworkInstanceInput,
) => Effect.Effect<
  GetSolNetworkInstanceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSolNetworkInstanceInput,
  output: GetSolNetworkInstanceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Uploads the contents of a function package.
 *
 * A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
 */
export const putSolFunctionPackageContent: (
  input: PutSolFunctionPackageContentInput,
) => Effect.Effect<
  PutSolFunctionPackageContentOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutSolFunctionPackageContentInput,
  output: PutSolFunctionPackageContentOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Uploads the contents of a network package.
 *
 * A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
 */
export const putSolNetworkPackageContent: (
  input: PutSolNetworkPackageContentInput,
) => Effect.Effect<
  PutSolNetworkPackageContentOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutSolNetworkPackageContentInput,
  output: PutSolNetworkPackageContentOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update a network instance.
 *
 * A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed.
 *
 * Choose the *updateType* parameter to target the necessary update of the network instance.
 */
export const updateSolNetworkInstance: (
  input: UpdateSolNetworkInstanceInput,
) => Effect.Effect<
  UpdateSolNetworkInstanceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSolNetworkInstanceInput,
  output: UpdateSolNetworkInstanceOutput,
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
 * Validates function package content. This can be used as a dry run before uploading
 * function package content with PutSolFunctionPackageContent.
 *
 * A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
 */
export const validateSolFunctionPackageContent: (
  input: ValidateSolFunctionPackageContentInput,
) => Effect.Effect<
  ValidateSolFunctionPackageContentOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ValidateSolFunctionPackageContentInput,
  output: ValidateSolFunctionPackageContentOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Validates network package content. This can be used as a dry run before uploading
 * network package content with PutSolNetworkPackageContent.
 *
 * A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
 */
export const validateSolNetworkPackageContent: (
  input: ValidateSolNetworkPackageContentInput,
) => Effect.Effect<
  ValidateSolNetworkPackageContentOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ValidateSolNetworkPackageContentInput,
  output: ValidateSolNetworkPackageContentOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a network instance.
 *
 * A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed. Creating a network instance is the third step after creating a network
 * package. For more information about network instances, Network instances in the
 * *Amazon Web Services Telco Network Builder User Guide*.
 *
 * Once you create a network instance, you can instantiate it. To instantiate a network,
 * see InstantiateSolNetworkInstance.
 */
export const createSolNetworkInstance: (
  input: CreateSolNetworkInstanceInput,
) => Effect.Effect<
  CreateSolNetworkInstanceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSolNetworkInstanceInput,
  output: CreateSolNetworkInstanceOutput,
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
 * Gets the contents of a function package.
 *
 * A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
 */
export const getSolFunctionPackageContent: (
  input: GetSolFunctionPackageContentInput,
) => Effect.Effect<
  GetSolFunctionPackageContentOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSolFunctionPackageContentInput,
  output: GetSolFunctionPackageContentOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a function package descriptor in a function package.
 *
 * A function package descriptor is a .yaml file in a function package that uses the TOSCA standard to describe how the network function in the function package should run on your network.
 *
 * A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
 */
export const getSolFunctionPackageDescriptor: (
  input: GetSolFunctionPackageDescriptorInput,
) => Effect.Effect<
  GetSolFunctionPackageDescriptorOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSolFunctionPackageDescriptorInput,
  output: GetSolFunctionPackageDescriptorOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the contents of a network package.
 *
 * A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
 */
export const getSolNetworkPackageContent: (
  input: GetSolNetworkPackageContentInput,
) => Effect.Effect<
  GetSolNetworkPackageContentOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSolNetworkPackageContentInput,
  output: GetSolNetworkPackageContentOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the content of the network service descriptor.
 *
 * A network service descriptor is a .yaml file in a network package that uses the TOSCA standard to describe the network functions you want to deploy and the Amazon Web Services infrastructure you want to deploy the network functions on.
 */
export const getSolNetworkPackageDescriptor: (
  input: GetSolNetworkPackageDescriptorInput,
) => Effect.Effect<
  GetSolNetworkPackageDescriptorOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSolNetworkPackageDescriptorInput,
  output: GetSolNetworkPackageDescriptorOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Instantiates a network instance.
 *
 * A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed.
 *
 * Before you can instantiate a network instance, you have to create a network instance.
 * For more information, see CreateSolNetworkInstance.
 */
export const instantiateSolNetworkInstance: (
  input: InstantiateSolNetworkInstanceInput,
) => Effect.Effect<
  InstantiateSolNetworkInstanceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InstantiateSolNetworkInstanceInput,
  output: InstantiateSolNetworkInstanceOutput,
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
 * Lists tags for AWS TNB resources.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => Effect.Effect<
  ListTagsForResourceOutput,
  | AccessDeniedException
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
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Terminates a network instance.
 *
 * A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed.
 *
 * You must terminate a network instance before you can delete it.
 */
export const terminateSolNetworkInstance: (
  input: TerminateSolNetworkInstanceInput,
) => Effect.Effect<
  TerminateSolNetworkInstanceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TerminateSolNetworkInstanceInput,
  output: TerminateSolNetworkInstanceOutput,
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
 * Updates the operational state of function package.
 *
 * A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
 */
export const updateSolFunctionPackage: (
  input: UpdateSolFunctionPackageInput,
) => Effect.Effect<
  UpdateSolFunctionPackageOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSolFunctionPackageInput,
  output: UpdateSolFunctionPackageOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the operational state of a network package.
 *
 * A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
 *
 * A network service descriptor is a .yaml file in a network package that uses the TOSCA standard to describe the network functions you want to deploy and the Amazon Web Services infrastructure you want to deploy the network functions on.
 */
export const updateSolNetworkPackage: (
  input: UpdateSolNetworkPackageInput,
) => Effect.Effect<
  UpdateSolNetworkPackageOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSolNetworkPackageInput,
  output: UpdateSolNetworkPackageOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a function package.
 *
 * A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
 *
 * To delete a function package, the package must be in a disabled state. To disable a
 * function package, see UpdateSolFunctionPackage.
 */
export const deleteSolFunctionPackage: (
  input: DeleteSolFunctionPackageInput,
) => Effect.Effect<
  DeleteSolFunctionPackageResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSolFunctionPackageInput,
  output: DeleteSolFunctionPackageResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a network instance.
 *
 * A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed.
 *
 * To delete a network instance, the instance must be in a stopped or terminated state. To
 * terminate a network instance, see TerminateSolNetworkInstance.
 */
export const deleteSolNetworkInstance: (
  input: DeleteSolNetworkInstanceInput,
) => Effect.Effect<
  DeleteSolNetworkInstanceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSolNetworkInstanceInput,
  output: DeleteSolNetworkInstanceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes network package.
 *
 * A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
 *
 * To delete a network package, the package must be in a disable state. To disable a
 * network package, see UpdateSolNetworkPackage.
 */
export const deleteSolNetworkPackage: (
  input: DeleteSolNetworkPackageInput,
) => Effect.Effect<
  DeleteSolNetworkPackageResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSolNetworkPackageInput,
  output: DeleteSolNetworkPackageResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Tags an AWS TNB resource.
 *
 * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
 */
export const tagResource: (
  input: TagResourceInput,
) => Effect.Effect<
  TagResourceOutput,
  | AccessDeniedException
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
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Untags an AWS TNB resource.
 *
 * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
 */
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceOutput,
  | AccessDeniedException
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
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a network package.
 *
 * A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on. For more information, see Network instances in the
 * *Amazon Web Services Telco Network Builder User Guide*.
 *
 * A network package consists of a network service descriptor (NSD) file (required) and any
 * additional files (optional), such as scripts specific to your needs. For example, if you
 * have multiple function packages in your network package, you can use the NSD to define
 * which network functions should run in certain VPCs, subnets, or EKS clusters.
 *
 * This request creates an empty network package container with an ID. Once you create a
 * network package, you can upload the network package content using PutSolNetworkPackageContent.
 */
export const createSolNetworkPackage: (
  input: CreateSolNetworkPackageInput,
) => Effect.Effect<
  CreateSolNetworkPackageOutput,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSolNetworkPackageInput,
  output: CreateSolNetworkPackageOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));

import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const ns = T.XmlNamespace("http://glacier.amazonaws.com/doc/2012-06-01/");
const svc = T.AwsApiService({ sdkId: "Glacier", serviceShapeName: "Glacier" });
const auth = T.AwsAuthSigv4({ name: "glacier" });
const ver = T.ServiceVersion("2012-06-01");
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
              `https://glacier-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://glacier.${Region}.amazonaws.com`);
            }
            return e(
              `https://glacier-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://glacier.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://glacier.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type TagKey = string;
export type TagValue = string;
export type Size = number;
export type Httpstatus = number;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AbortMultipartUploadInput {
  accountId: string;
  vaultName: string;
  uploadId: string;
}
export const AbortMultipartUploadInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
    uploadId: S.String.pipe(T.HttpLabel("uploadId")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/{accountId}/vaults/{vaultName}/multipart-uploads/{uploadId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AbortMultipartUploadInput",
}) as any as S.Schema<AbortMultipartUploadInput>;
export interface AbortMultipartUploadResponse {}
export const AbortMultipartUploadResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AbortMultipartUploadResponse",
}) as any as S.Schema<AbortMultipartUploadResponse>;
export interface AbortVaultLockInput {
  accountId: string;
  vaultName: string;
}
export const AbortVaultLockInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/{accountId}/vaults/{vaultName}/lock-policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AbortVaultLockInput",
}) as any as S.Schema<AbortVaultLockInput>;
export interface AbortVaultLockResponse {}
export const AbortVaultLockResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AbortVaultLockResponse",
}) as any as S.Schema<AbortVaultLockResponse>;
export interface CompleteMultipartUploadInput {
  accountId: string;
  vaultName: string;
  uploadId: string;
  archiveSize?: string;
  checksum?: string;
}
export const CompleteMultipartUploadInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
    uploadId: S.String.pipe(T.HttpLabel("uploadId")),
    archiveSize: S.optional(S.String).pipe(T.HttpHeader("x-amz-archive-size")),
    checksum: S.optional(S.String).pipe(T.HttpHeader("x-amz-sha256-tree-hash")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/{accountId}/vaults/{vaultName}/multipart-uploads/{uploadId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CompleteMultipartUploadInput",
}) as any as S.Schema<CompleteMultipartUploadInput>;
export interface CompleteVaultLockInput {
  accountId: string;
  vaultName: string;
  lockId: string;
}
export const CompleteVaultLockInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
    lockId: S.String.pipe(T.HttpLabel("lockId")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/{accountId}/vaults/{vaultName}/lock-policy/{lockId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CompleteVaultLockInput",
}) as any as S.Schema<CompleteVaultLockInput>;
export interface CompleteVaultLockResponse {}
export const CompleteVaultLockResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CompleteVaultLockResponse",
}) as any as S.Schema<CompleteVaultLockResponse>;
export interface CreateVaultInput {
  accountId: string;
  vaultName: string;
}
export const CreateVaultInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{accountId}/vaults/{vaultName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateVaultInput",
}) as any as S.Schema<CreateVaultInput>;
export interface DeleteArchiveInput {
  accountId: string;
  vaultName: string;
  archiveId: string;
}
export const DeleteArchiveInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
    archiveId: S.String.pipe(T.HttpLabel("archiveId")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/{accountId}/vaults/{vaultName}/archives/{archiveId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteArchiveInput",
}) as any as S.Schema<DeleteArchiveInput>;
export interface DeleteArchiveResponse {}
export const DeleteArchiveResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteArchiveResponse",
}) as any as S.Schema<DeleteArchiveResponse>;
export interface DeleteVaultInput {
  accountId: string;
  vaultName: string;
}
export const DeleteVaultInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/{accountId}/vaults/{vaultName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVaultInput",
}) as any as S.Schema<DeleteVaultInput>;
export interface DeleteVaultResponse {}
export const DeleteVaultResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteVaultResponse",
}) as any as S.Schema<DeleteVaultResponse>;
export interface DeleteVaultAccessPolicyInput {
  accountId: string;
  vaultName: string;
}
export const DeleteVaultAccessPolicyInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/{accountId}/vaults/{vaultName}/access-policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVaultAccessPolicyInput",
}) as any as S.Schema<DeleteVaultAccessPolicyInput>;
export interface DeleteVaultAccessPolicyResponse {}
export const DeleteVaultAccessPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteVaultAccessPolicyResponse",
}) as any as S.Schema<DeleteVaultAccessPolicyResponse>;
export interface DeleteVaultNotificationsInput {
  accountId: string;
  vaultName: string;
}
export const DeleteVaultNotificationsInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/{accountId}/vaults/{vaultName}/notification-configuration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVaultNotificationsInput",
}) as any as S.Schema<DeleteVaultNotificationsInput>;
export interface DeleteVaultNotificationsResponse {}
export const DeleteVaultNotificationsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteVaultNotificationsResponse",
}) as any as S.Schema<DeleteVaultNotificationsResponse>;
export interface DescribeJobInput {
  accountId: string;
  vaultName: string;
  jobId: string;
}
export const DescribeJobInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/{accountId}/vaults/{vaultName}/jobs/{jobId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeJobInput",
}) as any as S.Schema<DescribeJobInput>;
export interface DescribeVaultInput {
  accountId: string;
  vaultName: string;
}
export const DescribeVaultInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{accountId}/vaults/{vaultName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeVaultInput",
}) as any as S.Schema<DescribeVaultInput>;
export interface GetDataRetrievalPolicyInput {
  accountId: string;
}
export const GetDataRetrievalPolicyInput = S.suspend(() =>
  S.Struct({ accountId: S.String.pipe(T.HttpLabel("accountId")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{accountId}/policies/data-retrieval" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataRetrievalPolicyInput",
}) as any as S.Schema<GetDataRetrievalPolicyInput>;
export interface GetJobOutputInput {
  accountId: string;
  vaultName: string;
  jobId: string;
  range?: string;
}
export const GetJobOutputInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    range: S.optional(S.String).pipe(T.HttpHeader("Range")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/{accountId}/vaults/{vaultName}/jobs/{jobId}/output",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetJobOutputInput",
}) as any as S.Schema<GetJobOutputInput>;
export interface GetVaultAccessPolicyInput {
  accountId: string;
  vaultName: string;
}
export const GetVaultAccessPolicyInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/{accountId}/vaults/{vaultName}/access-policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVaultAccessPolicyInput",
}) as any as S.Schema<GetVaultAccessPolicyInput>;
export interface GetVaultLockInput {
  accountId: string;
  vaultName: string;
}
export const GetVaultLockInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/{accountId}/vaults/{vaultName}/lock-policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVaultLockInput",
}) as any as S.Schema<GetVaultLockInput>;
export interface GetVaultNotificationsInput {
  accountId: string;
  vaultName: string;
}
export const GetVaultNotificationsInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/{accountId}/vaults/{vaultName}/notification-configuration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVaultNotificationsInput",
}) as any as S.Schema<GetVaultNotificationsInput>;
export interface InitiateMultipartUploadInput {
  accountId: string;
  vaultName: string;
  archiveDescription?: string;
  partSize?: string;
}
export const InitiateMultipartUploadInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
    archiveDescription: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-archive-description"),
    ),
    partSize: S.optional(S.String).pipe(T.HttpHeader("x-amz-part-size")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/{accountId}/vaults/{vaultName}/multipart-uploads",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InitiateMultipartUploadInput",
}) as any as S.Schema<InitiateMultipartUploadInput>;
export interface ListJobsInput {
  accountId: string;
  vaultName: string;
  limit?: number;
  marker?: string;
  statuscode?: string;
  completed?: string;
}
export const ListJobsInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    statuscode: S.optional(S.String).pipe(T.HttpQuery("statuscode")),
    completed: S.optional(S.String).pipe(T.HttpQuery("completed")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{accountId}/vaults/{vaultName}/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListJobsInput",
}) as any as S.Schema<ListJobsInput>;
export interface ListMultipartUploadsInput {
  accountId: string;
  vaultName: string;
  limit?: number;
  marker?: string;
}
export const ListMultipartUploadsInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/{accountId}/vaults/{vaultName}/multipart-uploads",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMultipartUploadsInput",
}) as any as S.Schema<ListMultipartUploadsInput>;
export interface ListPartsInput {
  accountId: string;
  vaultName: string;
  uploadId: string;
  marker?: string;
  limit?: number;
}
export const ListPartsInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
    uploadId: S.String.pipe(T.HttpLabel("uploadId")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/{accountId}/vaults/{vaultName}/multipart-uploads/{uploadId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPartsInput",
}) as any as S.Schema<ListPartsInput>;
export interface ListProvisionedCapacityInput {
  accountId: string;
}
export const ListProvisionedCapacityInput = S.suspend(() =>
  S.Struct({ accountId: S.String.pipe(T.HttpLabel("accountId")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{accountId}/provisioned-capacity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProvisionedCapacityInput",
}) as any as S.Schema<ListProvisionedCapacityInput>;
export interface ListTagsForVaultInput {
  accountId: string;
  vaultName: string;
}
export const ListTagsForVaultInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{accountId}/vaults/{vaultName}/tags" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForVaultInput",
}) as any as S.Schema<ListTagsForVaultInput>;
export interface ListVaultsInput {
  accountId: string;
  marker?: string;
  limit?: number;
}
export const ListVaultsInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{accountId}/vaults" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVaultsInput",
}) as any as S.Schema<ListVaultsInput>;
export interface PurchaseProvisionedCapacityInput {
  accountId: string;
}
export const PurchaseProvisionedCapacityInput = S.suspend(() =>
  S.Struct({ accountId: S.String.pipe(T.HttpLabel("accountId")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/{accountId}/provisioned-capacity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PurchaseProvisionedCapacityInput",
}) as any as S.Schema<PurchaseProvisionedCapacityInput>;
export interface RemoveTagsFromVaultInput {
  accountId: string;
  vaultName: string;
  TagKeys?: string[];
}
export const RemoveTagsFromVaultInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
    TagKeys: S.optional(TagKeyList),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/{accountId}/vaults/{vaultName}/tags?operation=remove",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveTagsFromVaultInput",
}) as any as S.Schema<RemoveTagsFromVaultInput>;
export interface RemoveTagsFromVaultResponse {}
export const RemoveTagsFromVaultResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveTagsFromVaultResponse",
}) as any as S.Schema<RemoveTagsFromVaultResponse>;
export interface UploadArchiveInput {
  vaultName: string;
  accountId: string;
  archiveDescription?: string;
  checksum?: string;
  body?: T.StreamingInputBody;
}
export const UploadArchiveInput = S.suspend(() =>
  S.Struct({
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    archiveDescription: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-archive-description"),
    ),
    checksum: S.optional(S.String).pipe(T.HttpHeader("x-amz-sha256-tree-hash")),
    body: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/{accountId}/vaults/{vaultName}/archives",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UploadArchiveInput",
}) as any as S.Schema<UploadArchiveInput>;
export interface UploadMultipartPartInput {
  accountId: string;
  vaultName: string;
  uploadId: string;
  checksum?: string;
  range?: string;
  body?: T.StreamingInputBody;
}
export const UploadMultipartPartInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
    uploadId: S.String.pipe(T.HttpLabel("uploadId")),
    checksum: S.optional(S.String).pipe(T.HttpHeader("x-amz-sha256-tree-hash")),
    range: S.optional(S.String).pipe(T.HttpHeader("Content-Range")),
    body: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/{accountId}/vaults/{vaultName}/multipart-uploads/{uploadId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UploadMultipartPartInput",
}) as any as S.Schema<UploadMultipartPartInput>;
export type NotificationEventList = string[];
export const NotificationEventList = S.Array(S.String);
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type ActionCode =
  | "ArchiveRetrieval"
  | "InventoryRetrieval"
  | "Select"
  | (string & {});
export const ActionCode = S.String;
export type StatusCode = "InProgress" | "Succeeded" | "Failed" | (string & {});
export const StatusCode = S.String;
export interface VaultLockPolicy {
  Policy?: string;
}
export const VaultLockPolicy = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String) }),
).annotations({
  identifier: "VaultLockPolicy",
}) as any as S.Schema<VaultLockPolicy>;
export interface InventoryRetrievalJobDescription {
  Format?: string;
  StartDate?: string;
  EndDate?: string;
  Limit?: string;
  Marker?: string;
}
export const InventoryRetrievalJobDescription = S.suspend(() =>
  S.Struct({
    Format: S.optional(S.String),
    StartDate: S.optional(S.String),
    EndDate: S.optional(S.String),
    Limit: S.optional(S.String),
    Marker: S.optional(S.String),
  }),
).annotations({
  identifier: "InventoryRetrievalJobDescription",
}) as any as S.Schema<InventoryRetrievalJobDescription>;
export type FileHeaderInfo = "USE" | "IGNORE" | "NONE" | (string & {});
export const FileHeaderInfo = S.String;
export interface CSVInput {
  FileHeaderInfo?: FileHeaderInfo;
  Comments?: string;
  QuoteEscapeCharacter?: string;
  RecordDelimiter?: string;
  FieldDelimiter?: string;
  QuoteCharacter?: string;
}
export const CSVInput = S.suspend(() =>
  S.Struct({
    FileHeaderInfo: S.optional(FileHeaderInfo),
    Comments: S.optional(S.String),
    QuoteEscapeCharacter: S.optional(S.String),
    RecordDelimiter: S.optional(S.String),
    FieldDelimiter: S.optional(S.String),
    QuoteCharacter: S.optional(S.String),
  }),
).annotations({ identifier: "CSVInput" }) as any as S.Schema<CSVInput>;
export interface InputSerialization {
  csv?: CSVInput;
}
export const InputSerialization = S.suspend(() =>
  S.Struct({ csv: S.optional(CSVInput) }),
).annotations({
  identifier: "InputSerialization",
}) as any as S.Schema<InputSerialization>;
export type ExpressionType = "SQL" | (string & {});
export const ExpressionType = S.String;
export type QuoteFields = "ALWAYS" | "ASNEEDED" | (string & {});
export const QuoteFields = S.String;
export interface CSVOutput {
  QuoteFields?: QuoteFields;
  QuoteEscapeCharacter?: string;
  RecordDelimiter?: string;
  FieldDelimiter?: string;
  QuoteCharacter?: string;
}
export const CSVOutput = S.suspend(() =>
  S.Struct({
    QuoteFields: S.optional(QuoteFields),
    QuoteEscapeCharacter: S.optional(S.String),
    RecordDelimiter: S.optional(S.String),
    FieldDelimiter: S.optional(S.String),
    QuoteCharacter: S.optional(S.String),
  }),
).annotations({ identifier: "CSVOutput" }) as any as S.Schema<CSVOutput>;
export interface OutputSerialization {
  csv?: CSVOutput;
}
export const OutputSerialization = S.suspend(() =>
  S.Struct({ csv: S.optional(CSVOutput) }),
).annotations({
  identifier: "OutputSerialization",
}) as any as S.Schema<OutputSerialization>;
export interface SelectParameters {
  InputSerialization?: InputSerialization;
  ExpressionType?: ExpressionType;
  Expression?: string;
  OutputSerialization?: OutputSerialization;
}
export const SelectParameters = S.suspend(() =>
  S.Struct({
    InputSerialization: S.optional(InputSerialization),
    ExpressionType: S.optional(ExpressionType),
    Expression: S.optional(S.String),
    OutputSerialization: S.optional(OutputSerialization),
  }),
).annotations({
  identifier: "SelectParameters",
}) as any as S.Schema<SelectParameters>;
export type EncryptionType = "aws:kms" | "AES256" | (string & {});
export const EncryptionType = S.String;
export interface Encryption {
  EncryptionType?: EncryptionType;
  KMSKeyId?: string;
  KMSContext?: string;
}
export const Encryption = S.suspend(() =>
  S.Struct({
    EncryptionType: S.optional(EncryptionType),
    KMSKeyId: S.optional(S.String),
    KMSContext: S.optional(S.String),
  }),
).annotations({ identifier: "Encryption" }) as any as S.Schema<Encryption>;
export type CannedACL =
  | "private"
  | "public-read"
  | "public-read-write"
  | "aws-exec-read"
  | "authenticated-read"
  | "bucket-owner-read"
  | "bucket-owner-full-control"
  | (string & {});
export const CannedACL = S.String;
export type Type =
  | "AmazonCustomerByEmail"
  | "CanonicalUser"
  | "Group"
  | (string & {});
export const Type = S.String;
export interface Grantee {
  Type: Type;
  DisplayName?: string;
  URI?: string;
  ID?: string;
  EmailAddress?: string;
}
export const Grantee = S.suspend(() =>
  S.Struct({
    Type: Type,
    DisplayName: S.optional(S.String),
    URI: S.optional(S.String),
    ID: S.optional(S.String),
    EmailAddress: S.optional(S.String),
  }),
).annotations({ identifier: "Grantee" }) as any as S.Schema<Grantee>;
export type Permission =
  | "FULL_CONTROL"
  | "WRITE"
  | "WRITE_ACP"
  | "READ"
  | "READ_ACP"
  | (string & {});
export const Permission = S.String;
export interface Grant {
  Grantee?: Grantee;
  Permission?: Permission;
}
export const Grant = S.suspend(() =>
  S.Struct({
    Grantee: S.optional(Grantee),
    Permission: S.optional(Permission),
  }),
).annotations({ identifier: "Grant" }) as any as S.Schema<Grant>;
export type AccessControlPolicyList = Grant[];
export const AccessControlPolicyList = S.Array(Grant);
export type Hashmap = { [key: string]: string | undefined };
export const Hashmap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type StorageClass =
  | "STANDARD"
  | "REDUCED_REDUNDANCY"
  | "STANDARD_IA"
  | (string & {});
export const StorageClass = S.String;
export interface S3Location {
  BucketName?: string;
  Prefix?: string;
  Encryption?: Encryption;
  CannedACL?: CannedACL;
  AccessControlList?: Grant[];
  Tagging?: { [key: string]: string | undefined };
  UserMetadata?: { [key: string]: string | undefined };
  StorageClass?: StorageClass;
}
export const S3Location = S.suspend(() =>
  S.Struct({
    BucketName: S.optional(S.String),
    Prefix: S.optional(S.String),
    Encryption: S.optional(Encryption),
    CannedACL: S.optional(CannedACL),
    AccessControlList: S.optional(AccessControlPolicyList),
    Tagging: S.optional(Hashmap),
    UserMetadata: S.optional(Hashmap),
    StorageClass: S.optional(StorageClass),
  }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export interface OutputLocation {
  S3?: S3Location;
}
export const OutputLocation = S.suspend(() =>
  S.Struct({ S3: S.optional(S3Location) }),
).annotations({
  identifier: "OutputLocation",
}) as any as S.Schema<OutputLocation>;
export interface GlacierJobDescription {
  JobId?: string;
  JobDescription?: string;
  Action?: ActionCode;
  ArchiveId?: string;
  VaultARN?: string;
  CreationDate?: string;
  Completed?: boolean;
  StatusCode?: StatusCode;
  StatusMessage?: string;
  ArchiveSizeInBytes?: number;
  InventorySizeInBytes?: number;
  SNSTopic?: string;
  CompletionDate?: string;
  SHA256TreeHash?: string;
  ArchiveSHA256TreeHash?: string;
  RetrievalByteRange?: string;
  Tier?: string;
  InventoryRetrievalParameters?: InventoryRetrievalJobDescription;
  JobOutputPath?: string;
  SelectParameters?: SelectParameters;
  OutputLocation?: OutputLocation;
}
export const GlacierJobDescription = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    JobDescription: S.optional(S.String),
    Action: S.optional(ActionCode),
    ArchiveId: S.optional(S.String),
    VaultARN: S.optional(S.String),
    CreationDate: S.optional(S.String),
    Completed: S.optional(S.Boolean),
    StatusCode: S.optional(StatusCode),
    StatusMessage: S.optional(S.String),
    ArchiveSizeInBytes: S.optional(S.Number),
    InventorySizeInBytes: S.optional(S.Number),
    SNSTopic: S.optional(S.String),
    CompletionDate: S.optional(S.String),
    SHA256TreeHash: S.optional(S.String),
    ArchiveSHA256TreeHash: S.optional(S.String),
    RetrievalByteRange: S.optional(S.String),
    Tier: S.optional(S.String),
    InventoryRetrievalParameters: S.optional(InventoryRetrievalJobDescription),
    JobOutputPath: S.optional(S.String),
    SelectParameters: S.optional(SelectParameters),
    OutputLocation: S.optional(OutputLocation),
  }).pipe(ns),
).annotations({
  identifier: "GlacierJobDescription",
}) as any as S.Schema<GlacierJobDescription>;
export type JobList = GlacierJobDescription[];
export const JobList = S.Array(GlacierJobDescription);
export interface DescribeVaultOutput {
  VaultARN?: string;
  VaultName?: string;
  CreationDate?: string;
  LastInventoryDate?: string;
  NumberOfArchives?: number;
  SizeInBytes?: number;
}
export const DescribeVaultOutput = S.suspend(() =>
  S.Struct({
    VaultARN: S.optional(S.String),
    VaultName: S.optional(S.String),
    CreationDate: S.optional(S.String),
    LastInventoryDate: S.optional(S.String),
    NumberOfArchives: S.optional(S.Number),
    SizeInBytes: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "DescribeVaultOutput",
}) as any as S.Schema<DescribeVaultOutput>;
export type VaultList = DescribeVaultOutput[];
export const VaultList = S.Array(DescribeVaultOutput);
export interface VaultAccessPolicy {
  Policy?: string;
}
export const VaultAccessPolicy = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String) }),
).annotations({
  identifier: "VaultAccessPolicy",
}) as any as S.Schema<VaultAccessPolicy>;
export interface VaultNotificationConfig {
  SNSTopic?: string;
  Events?: string[];
}
export const VaultNotificationConfig = S.suspend(() =>
  S.Struct({
    SNSTopic: S.optional(S.String),
    Events: S.optional(NotificationEventList),
  }),
).annotations({
  identifier: "VaultNotificationConfig",
}) as any as S.Schema<VaultNotificationConfig>;
export interface AddTagsToVaultInput {
  accountId: string;
  vaultName: string;
  Tags?: { [key: string]: string | undefined };
}
export const AddTagsToVaultInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/{accountId}/vaults/{vaultName}/tags?operation=add",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddTagsToVaultInput",
}) as any as S.Schema<AddTagsToVaultInput>;
export interface AddTagsToVaultResponse {}
export const AddTagsToVaultResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddTagsToVaultResponse",
}) as any as S.Schema<AddTagsToVaultResponse>;
export interface ArchiveCreationOutput {
  location?: string;
  checksum?: string;
  archiveId?: string;
}
export const ArchiveCreationOutput = S.suspend(() =>
  S.Struct({
    location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    checksum: S.optional(S.String).pipe(T.HttpHeader("x-amz-sha256-tree-hash")),
    archiveId: S.optional(S.String).pipe(T.HttpHeader("x-amz-archive-id")),
  }).pipe(ns),
).annotations({
  identifier: "ArchiveCreationOutput",
}) as any as S.Schema<ArchiveCreationOutput>;
export interface CreateVaultOutput {
  location?: string;
}
export const CreateVaultOutput = S.suspend(() =>
  S.Struct({
    location: S.optional(S.String).pipe(T.HttpHeader("Location")),
  }).pipe(ns),
).annotations({
  identifier: "CreateVaultOutput",
}) as any as S.Schema<CreateVaultOutput>;
export interface DataRetrievalRule {
  Strategy?: string;
  BytesPerHour?: number;
}
export const DataRetrievalRule = S.suspend(() =>
  S.Struct({
    Strategy: S.optional(S.String),
    BytesPerHour: S.optional(S.Number),
  }),
).annotations({
  identifier: "DataRetrievalRule",
}) as any as S.Schema<DataRetrievalRule>;
export type DataRetrievalRulesList = DataRetrievalRule[];
export const DataRetrievalRulesList = S.Array(DataRetrievalRule);
export interface DataRetrievalPolicy {
  Rules?: DataRetrievalRule[];
}
export const DataRetrievalPolicy = S.suspend(() =>
  S.Struct({ Rules: S.optional(DataRetrievalRulesList) }),
).annotations({
  identifier: "DataRetrievalPolicy",
}) as any as S.Schema<DataRetrievalPolicy>;
export interface GetDataRetrievalPolicyOutput {
  Policy?: DataRetrievalPolicy;
}
export const GetDataRetrievalPolicyOutput = S.suspend(() =>
  S.Struct({ Policy: S.optional(DataRetrievalPolicy) }).pipe(ns),
).annotations({
  identifier: "GetDataRetrievalPolicyOutput",
}) as any as S.Schema<GetDataRetrievalPolicyOutput>;
export interface GetJobOutputOutput {
  body?: T.StreamingOutputBody;
  checksum?: string;
  status?: number;
  contentRange?: string;
  acceptRanges?: string;
  contentType?: string;
  archiveDescription?: string;
}
export const GetJobOutputOutput = S.suspend(() =>
  S.Struct({
    body: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
    checksum: S.optional(S.String).pipe(T.HttpHeader("x-amz-sha256-tree-hash")),
    status: S.optional(S.Number).pipe(T.HttpResponseCode()),
    contentRange: S.optional(S.String).pipe(T.HttpHeader("Content-Range")),
    acceptRanges: S.optional(S.String).pipe(T.HttpHeader("Accept-Ranges")),
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    archiveDescription: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-archive-description"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "GetJobOutputOutput",
}) as any as S.Schema<GetJobOutputOutput>;
export interface GetVaultAccessPolicyOutput {
  policy?: VaultAccessPolicy;
}
export const GetVaultAccessPolicyOutput = S.suspend(() =>
  S.Struct({
    policy: S.optional(VaultAccessPolicy)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "VaultAccessPolicy" }),
  }).pipe(ns),
).annotations({
  identifier: "GetVaultAccessPolicyOutput",
}) as any as S.Schema<GetVaultAccessPolicyOutput>;
export interface GetVaultLockOutput {
  Policy?: string;
  State?: string;
  ExpirationDate?: string;
  CreationDate?: string;
}
export const GetVaultLockOutput = S.suspend(() =>
  S.Struct({
    Policy: S.optional(S.String),
    State: S.optional(S.String),
    ExpirationDate: S.optional(S.String),
    CreationDate: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetVaultLockOutput",
}) as any as S.Schema<GetVaultLockOutput>;
export interface GetVaultNotificationsOutput {
  vaultNotificationConfig?: VaultNotificationConfig;
}
export const GetVaultNotificationsOutput = S.suspend(() =>
  S.Struct({
    vaultNotificationConfig: S.optional(VaultNotificationConfig)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "VaultNotificationConfig" }),
  }).pipe(ns),
).annotations({
  identifier: "GetVaultNotificationsOutput",
}) as any as S.Schema<GetVaultNotificationsOutput>;
export interface InitiateMultipartUploadOutput {
  location?: string;
  uploadId?: string;
}
export const InitiateMultipartUploadOutput = S.suspend(() =>
  S.Struct({
    location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    uploadId: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-multipart-upload-id"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "InitiateMultipartUploadOutput",
}) as any as S.Schema<InitiateMultipartUploadOutput>;
export interface InitiateVaultLockInput {
  accountId: string;
  vaultName: string;
  policy?: VaultLockPolicy;
}
export const InitiateVaultLockInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
    policy: S.optional(VaultLockPolicy)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "VaultLockPolicy" }),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/{accountId}/vaults/{vaultName}/lock-policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InitiateVaultLockInput",
}) as any as S.Schema<InitiateVaultLockInput>;
export interface ListJobsOutput {
  JobList?: GlacierJobDescription[];
  Marker?: string;
}
export const ListJobsOutput = S.suspend(() =>
  S.Struct({ JobList: S.optional(JobList), Marker: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ListJobsOutput",
}) as any as S.Schema<ListJobsOutput>;
export interface ListTagsForVaultOutput {
  Tags?: { [key: string]: string | undefined };
}
export const ListTagsForVaultOutput = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMap) }).pipe(ns),
).annotations({
  identifier: "ListTagsForVaultOutput",
}) as any as S.Schema<ListTagsForVaultOutput>;
export interface ListVaultsOutput {
  VaultList?: DescribeVaultOutput[];
  Marker?: string;
}
export const ListVaultsOutput = S.suspend(() =>
  S.Struct({
    VaultList: S.optional(VaultList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListVaultsOutput",
}) as any as S.Schema<ListVaultsOutput>;
export interface PurchaseProvisionedCapacityOutput {
  capacityId?: string;
}
export const PurchaseProvisionedCapacityOutput = S.suspend(() =>
  S.Struct({
    capacityId: S.optional(S.String).pipe(T.HttpHeader("x-amz-capacity-id")),
  }).pipe(ns),
).annotations({
  identifier: "PurchaseProvisionedCapacityOutput",
}) as any as S.Schema<PurchaseProvisionedCapacityOutput>;
export interface SetVaultAccessPolicyInput {
  accountId: string;
  vaultName: string;
  policy?: VaultAccessPolicy;
}
export const SetVaultAccessPolicyInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
    policy: S.optional(VaultAccessPolicy)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "VaultAccessPolicy" }),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/{accountId}/vaults/{vaultName}/access-policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetVaultAccessPolicyInput",
}) as any as S.Schema<SetVaultAccessPolicyInput>;
export interface SetVaultAccessPolicyResponse {}
export const SetVaultAccessPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetVaultAccessPolicyResponse",
}) as any as S.Schema<SetVaultAccessPolicyResponse>;
export interface SetVaultNotificationsInput {
  accountId: string;
  vaultName: string;
  vaultNotificationConfig?: VaultNotificationConfig;
}
export const SetVaultNotificationsInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
    vaultNotificationConfig: S.optional(VaultNotificationConfig)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "VaultNotificationConfig" }),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/{accountId}/vaults/{vaultName}/notification-configuration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetVaultNotificationsInput",
}) as any as S.Schema<SetVaultNotificationsInput>;
export interface SetVaultNotificationsResponse {}
export const SetVaultNotificationsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetVaultNotificationsResponse",
}) as any as S.Schema<SetVaultNotificationsResponse>;
export interface UploadMultipartPartOutput {
  checksum?: string;
}
export const UploadMultipartPartOutput = S.suspend(() =>
  S.Struct({
    checksum: S.optional(S.String).pipe(T.HttpHeader("x-amz-sha256-tree-hash")),
  }).pipe(ns),
).annotations({
  identifier: "UploadMultipartPartOutput",
}) as any as S.Schema<UploadMultipartPartOutput>;
export interface InventoryRetrievalJobInput {
  StartDate?: string;
  EndDate?: string;
  Limit?: string;
  Marker?: string;
}
export const InventoryRetrievalJobInput = S.suspend(() =>
  S.Struct({
    StartDate: S.optional(S.String),
    EndDate: S.optional(S.String),
    Limit: S.optional(S.String),
    Marker: S.optional(S.String),
  }),
).annotations({
  identifier: "InventoryRetrievalJobInput",
}) as any as S.Schema<InventoryRetrievalJobInput>;
export interface UploadListElement {
  MultipartUploadId?: string;
  VaultARN?: string;
  ArchiveDescription?: string;
  PartSizeInBytes?: number;
  CreationDate?: string;
}
export const UploadListElement = S.suspend(() =>
  S.Struct({
    MultipartUploadId: S.optional(S.String),
    VaultARN: S.optional(S.String),
    ArchiveDescription: S.optional(S.String),
    PartSizeInBytes: S.optional(S.Number),
    CreationDate: S.optional(S.String),
  }),
).annotations({
  identifier: "UploadListElement",
}) as any as S.Schema<UploadListElement>;
export type UploadsList = UploadListElement[];
export const UploadsList = S.Array(UploadListElement);
export interface PartListElement {
  RangeInBytes?: string;
  SHA256TreeHash?: string;
}
export const PartListElement = S.suspend(() =>
  S.Struct({
    RangeInBytes: S.optional(S.String),
    SHA256TreeHash: S.optional(S.String),
  }),
).annotations({
  identifier: "PartListElement",
}) as any as S.Schema<PartListElement>;
export type PartList = PartListElement[];
export const PartList = S.Array(PartListElement);
export interface ProvisionedCapacityDescription {
  CapacityId?: string;
  StartDate?: string;
  ExpirationDate?: string;
}
export const ProvisionedCapacityDescription = S.suspend(() =>
  S.Struct({
    CapacityId: S.optional(S.String),
    StartDate: S.optional(S.String),
    ExpirationDate: S.optional(S.String),
  }),
).annotations({
  identifier: "ProvisionedCapacityDescription",
}) as any as S.Schema<ProvisionedCapacityDescription>;
export type ProvisionedCapacityList = ProvisionedCapacityDescription[];
export const ProvisionedCapacityList = S.Array(ProvisionedCapacityDescription);
export interface InitiateVaultLockOutput {
  lockId?: string;
}
export const InitiateVaultLockOutput = S.suspend(() =>
  S.Struct({
    lockId: S.optional(S.String).pipe(T.HttpHeader("x-amz-lock-id")),
  }).pipe(ns),
).annotations({
  identifier: "InitiateVaultLockOutput",
}) as any as S.Schema<InitiateVaultLockOutput>;
export interface ListMultipartUploadsOutput {
  UploadsList?: UploadListElement[];
  Marker?: string;
}
export const ListMultipartUploadsOutput = S.suspend(() =>
  S.Struct({
    UploadsList: S.optional(UploadsList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListMultipartUploadsOutput",
}) as any as S.Schema<ListMultipartUploadsOutput>;
export interface ListPartsOutput {
  MultipartUploadId?: string;
  VaultARN?: string;
  ArchiveDescription?: string;
  PartSizeInBytes?: number;
  CreationDate?: string;
  Parts?: PartListElement[];
  Marker?: string;
}
export const ListPartsOutput = S.suspend(() =>
  S.Struct({
    MultipartUploadId: S.optional(S.String),
    VaultARN: S.optional(S.String),
    ArchiveDescription: S.optional(S.String),
    PartSizeInBytes: S.optional(S.Number),
    CreationDate: S.optional(S.String),
    Parts: S.optional(PartList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPartsOutput",
}) as any as S.Schema<ListPartsOutput>;
export interface ListProvisionedCapacityOutput {
  ProvisionedCapacityList?: ProvisionedCapacityDescription[];
}
export const ListProvisionedCapacityOutput = S.suspend(() =>
  S.Struct({
    ProvisionedCapacityList: S.optional(ProvisionedCapacityList),
  }).pipe(ns),
).annotations({
  identifier: "ListProvisionedCapacityOutput",
}) as any as S.Schema<ListProvisionedCapacityOutput>;
export interface SetDataRetrievalPolicyInput {
  accountId: string;
  Policy?: DataRetrievalPolicy;
}
export const SetDataRetrievalPolicyInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    Policy: S.optional(DataRetrievalPolicy),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{accountId}/policies/data-retrieval" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetDataRetrievalPolicyInput",
}) as any as S.Schema<SetDataRetrievalPolicyInput>;
export interface SetDataRetrievalPolicyResponse {}
export const SetDataRetrievalPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetDataRetrievalPolicyResponse",
}) as any as S.Schema<SetDataRetrievalPolicyResponse>;
export interface JobParameters {
  Format?: string;
  Type?: string;
  ArchiveId?: string;
  Description?: string;
  SNSTopic?: string;
  RetrievalByteRange?: string;
  Tier?: string;
  InventoryRetrievalParameters?: InventoryRetrievalJobInput;
  SelectParameters?: SelectParameters;
  OutputLocation?: OutputLocation;
}
export const JobParameters = S.suspend(() =>
  S.Struct({
    Format: S.optional(S.String),
    Type: S.optional(S.String),
    ArchiveId: S.optional(S.String),
    Description: S.optional(S.String),
    SNSTopic: S.optional(S.String),
    RetrievalByteRange: S.optional(S.String),
    Tier: S.optional(S.String),
    InventoryRetrievalParameters: S.optional(InventoryRetrievalJobInput),
    SelectParameters: S.optional(SelectParameters),
    OutputLocation: S.optional(OutputLocation),
  }),
).annotations({
  identifier: "JobParameters",
}) as any as S.Schema<JobParameters>;
export interface InitiateJobInput {
  accountId: string;
  vaultName: string;
  jobParameters?: JobParameters;
}
export const InitiateJobInput = S.suspend(() =>
  S.Struct({
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    vaultName: S.String.pipe(T.HttpLabel("vaultName")),
    jobParameters: S.optional(JobParameters)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "JobParameters" }),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/{accountId}/vaults/{vaultName}/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InitiateJobInput",
}) as any as S.Schema<InitiateJobInput>;
export interface InitiateJobOutput {
  location?: string;
  jobId?: string;
  jobOutputPath?: string;
}
export const InitiateJobOutput = S.suspend(() =>
  S.Struct({
    location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    jobId: S.optional(S.String).pipe(T.HttpHeader("x-amz-job-id")),
    jobOutputPath: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-job-output-path"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "InitiateJobOutput",
}) as any as S.Schema<InitiateJobOutput>;

//# Errors
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  {
    type: S.optional(S.String),
    code: S.optional(S.String),
    message: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class MissingParameterValueException extends S.TaggedError<MissingParameterValueException>()(
  "MissingParameterValueException",
  {
    type: S.optional(S.String),
    code: S.optional(S.String),
    message: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {
    type: S.optional(S.String),
    code: S.optional(S.String),
    message: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class NoLongerSupportedException extends S.TaggedError<NoLongerSupportedException>()(
  "NoLongerSupportedException",
  {
    type: S.optional(S.String),
    code: S.optional(S.String),
    message: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    type: S.optional(S.String),
    code: S.optional(S.String),
    message: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {
    type: S.optional(S.String),
    code: S.optional(S.String),
    message: S.optional(S.String),
  },
).pipe(C.withServerError) {}
export class RequestTimeoutException extends S.TaggedError<RequestTimeoutException>()(
  "RequestTimeoutException",
  {
    type: S.optional(S.String),
    code: S.optional(S.String),
    message: S.optional(S.String),
  },
).pipe(C.withTimeoutError) {}
export class InsufficientCapacityException extends S.TaggedError<InsufficientCapacityException>()(
  "InsufficientCapacityException",
  {
    type: S.optional(S.String),
    code: S.optional(S.String),
    message: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class PolicyEnforcedException extends S.TaggedError<PolicyEnforcedException>()(
  "PolicyEnforcedException",
  {
    type: S.optional(S.String),
    code: S.optional(S.String),
    message: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * This operation lists the provisioned capacity units for the specified AWS
 * account.
 */
export const listProvisionedCapacity: (
  input: ListProvisionedCapacityInput,
) => effect.Effect<
  ListProvisionedCapacityOutput,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProvisionedCapacityInput,
  output: ListProvisionedCapacityOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation uploads a part of an archive. You can upload archive parts in any
 * order. You can also upload them in parallel. You can upload up to 10,000 parts for a
 * multipart upload.
 *
 * Amazon Glacier rejects your upload part request if any of the following conditions is
 * true:
 *
 * - **SHA256 tree hash does not match**To ensure that part
 * data is not corrupted in transmission, you compute a SHA256 tree hash of the part and
 * include it in your request. Upon receiving the part data, Amazon Glacier also
 * computes a SHA256 tree hash. If these hash values don't match, the operation fails.
 * For information about computing a SHA256 tree hash, see Computing
 * Checksums.
 *
 * - **Part size does not match**The size of each part except
 * the last must match the size specified in the corresponding InitiateMultipartUpload request. The size of the last part must be the
 * same size as, or smaller than, the specified size.
 *
 * If you upload a part whose size is smaller than the part size you specified
 * in your initiate multipart upload request and that part is not the last part, then
 * the upload part request will succeed. However, the subsequent Complete Multipart
 * Upload request will fail.
 *
 * - **Range does not align**The byte range value in the
 * request does not align with the part size specified in the corresponding initiate
 * request. For example, if you specify a part size of 4194304 bytes (4 MB), then 0 to
 * 4194303 bytes (4 MB - 1) and 4194304 (4 MB) to 8388607 (8 MB - 1) are valid part
 * ranges. However, if you set a range value of 2 MB to 6 MB, the range does not align
 * with the part size and the upload will fail.
 *
 * This operation is idempotent. If you upload the same part multiple times, the data
 * included in the most recent request overwrites the previously uploaded data.
 *
 * An AWS account has full permission to perform all operations (actions). However, AWS
 * Identity and Access Management (IAM) users don't have any permissions by default. You must
 * grant them explicit permission to perform specific actions. For more information, see
 * Access Control Using
 * AWS Identity and Access Management (IAM).
 *
 * For conceptual information and underlying REST API, see Uploading Large Archives in
 * Parts (Multipart Upload) and Upload Part in the
 * *Amazon Glacier Developer Guide*.
 */
export const uploadMultipartPart: (
  input: UploadMultipartPartInput,
) => effect.Effect<
  UploadMultipartPartOutput,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | RequestTimeoutException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UploadMultipartPartInput,
  output: UploadMultipartPartOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation adds the specified tags to a vault. Each tag is composed of a key and
 * a value. Each vault can have up to 10 tags. If your request would cause the tag limit for
 * the vault to be exceeded, the operation throws the `LimitExceededException`
 * error. If a tag already exists on the vault under a specified key, the existing key value
 * will be overwritten. For more information about tags, see Tagging Amazon Glacier Resources.
 */
export const addTagsToVault: (
  input: AddTagsToVaultInput,
) => effect.Effect<
  AddTagsToVaultResponse,
  | InvalidParameterValueException
  | LimitExceededException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsToVaultInput,
  output: AddTagsToVaultResponse,
  errors: [
    InvalidParameterValueException,
    LimitExceededException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation returns information about a job you previously initiated, including
 * the job initiation date, the user who initiated the job, the job status code/message and
 * the Amazon SNS topic to notify after Amazon Glacier (Glacier) completes the job. For more information
 * about initiating a job, see InitiateJob.
 *
 * This operation enables you to check the status of your job. However, it is
 * strongly recommended that you set up an Amazon SNS topic and specify it in your initiate
 * job request so that Glacier can notify the topic after it completes the
 * job.
 *
 * A job ID will not expire for at least 24 hours after Glacier completes the
 * job.
 *
 * An AWS account has full permission to perform all operations (actions). However, AWS
 * Identity and Access Management (IAM) users don't have any permissions by default. You must
 * grant them explicit permission to perform specific actions. For more information, see
 * Access Control Using
 * AWS Identity and Access Management (IAM).
 *
 * For more information about using this operation,
 * see the documentation for the underlying REST API Describe Job
 * in the *Amazon Glacier Developer Guide*.
 */
export const describeJob: (
  input: DescribeJobInput,
) => effect.Effect<
  GlacierJobDescription,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobInput,
  output: GlacierJobDescription,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation initiates the vault locking process by doing the following:
 *
 * - Installing a vault lock policy on the specified vault.
 *
 * - Setting the lock state of vault lock to `InProgress`.
 *
 * - Returning a lock ID, which is used to complete the vault locking
 * process.
 *
 * You can set one vault lock policy for each vault and this policy can be up to 20 KB
 * in size. For more information about vault lock policies, see Amazon Glacier Access Control with
 * Vault Lock Policies.
 *
 * You must complete the vault locking process within 24 hours after the vault lock
 * enters the `InProgress` state. After the 24 hour window ends, the lock ID
 * expires, the vault automatically exits the `InProgress` state, and the vault
 * lock policy is removed from the vault. You call CompleteVaultLock to
 * complete the vault locking process by setting the state of the vault lock to
 * `Locked`.
 *
 * After a vault lock is in the `Locked` state, you cannot initiate a new
 * vault lock for the vault.
 *
 * You can abort the vault locking process by calling AbortVaultLock.
 * You can get the state of the vault lock by calling GetVaultLock. For more
 * information about the vault locking process, Amazon Glacier Vault
 * Lock.
 *
 * If this operation is called when the vault lock is in the `InProgress`
 * state, the operation returns an `AccessDeniedException` error. When the vault
 * lock is in the `InProgress` state you must call AbortVaultLock
 * before you can initiate a new vault lock policy.
 */
export const initiateVaultLock: (
  input: InitiateVaultLockInput,
) => effect.Effect<
  InitiateVaultLockOutput,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InitiateVaultLockInput,
  output: InitiateVaultLockOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation lists in-progress multipart uploads for the specified vault. An
 * in-progress multipart upload is a multipart upload that has been initiated by an InitiateMultipartUpload request, but has not yet been completed or aborted.
 * The list returned in the List Multipart Upload response has no guaranteed order.
 *
 * The List Multipart Uploads operation supports pagination. By default, this operation
 * returns up to 50 multipart uploads in the response. You should always check the response
 * for a `marker` at which to continue the list; if there are no more items the
 * `marker` is `null`. To return a list of multipart uploads that
 * begins at a specific upload, set the `marker` request parameter to the value you
 * obtained from a previous List Multipart Upload request. You can also limit the number of
 * uploads returned in the response by specifying the `limit` parameter in the
 * request.
 *
 * Note the difference between this operation and listing parts (ListParts). The List Multipart Uploads operation lists all multipart uploads
 * for a vault and does not require a multipart upload ID. The List Parts operation requires a
 * multipart upload ID since parts are associated with a single upload.
 *
 * An AWS account has full permission to perform all operations (actions). However, AWS
 * Identity and Access Management (IAM) users don't have any permissions by default. You must
 * grant them explicit permission to perform specific actions. For more information, see
 * Access Control Using
 * AWS Identity and Access Management (IAM).
 *
 * For conceptual information and the underlying REST API, see Working
 * with Archives in Amazon Glacier and List Multipart Uploads
 * in the *Amazon Glacier Developer Guide*.
 */
export const listMultipartUploads: {
  (
    input: ListMultipartUploadsInput,
  ): effect.Effect<
    ListMultipartUploadsOutput,
    | InvalidParameterValueException
    | MissingParameterValueException
    | NoLongerSupportedException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMultipartUploadsInput,
  ) => stream.Stream<
    ListMultipartUploadsOutput,
    | InvalidParameterValueException
    | MissingParameterValueException
    | NoLongerSupportedException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMultipartUploadsInput,
  ) => stream.Stream<
    UploadListElement,
    | InvalidParameterValueException
    | MissingParameterValueException
    | NoLongerSupportedException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMultipartUploadsInput,
  output: ListMultipartUploadsOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "marker",
    outputToken: "Marker",
    items: "UploadsList",
    pageSize: "limit",
  } as const,
}));
/**
 * This operation lists the parts of an archive that have been uploaded in a specific
 * multipart upload. You can make this request at any time during an in-progress multipart
 * upload before you complete the upload (see CompleteMultipartUpload. List
 * Parts returns an error for completed uploads. The list returned in the List Parts response
 * is sorted by part range.
 *
 * The List Parts operation supports pagination. By default, this operation returns up
 * to 50 uploaded parts in the response. You should always check the response for a
 * `marker` at which to continue the list; if there are no more items the
 * `marker` is `null`. To return a list of parts that begins at a
 * specific part, set the `marker` request parameter to the value you obtained from
 * a previous List Parts request. You can also limit the number of parts returned in the
 * response by specifying the `limit` parameter in the request.
 *
 * An AWS account has full permission to perform all operations (actions). However, AWS
 * Identity and Access Management (IAM) users don't have any permissions by default. You must
 * grant them explicit permission to perform specific actions. For more information, see
 * Access Control Using
 * AWS Identity and Access Management (IAM).
 *
 * For conceptual information and the underlying REST API, see Working
 * with Archives in Amazon Glacier and List Parts in the
 * *Amazon Glacier Developer Guide*.
 */
export const listParts: {
  (
    input: ListPartsInput,
  ): effect.Effect<
    ListPartsOutput,
    | InvalidParameterValueException
    | MissingParameterValueException
    | NoLongerSupportedException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPartsInput,
  ) => stream.Stream<
    ListPartsOutput,
    | InvalidParameterValueException
    | MissingParameterValueException
    | NoLongerSupportedException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPartsInput,
  ) => stream.Stream<
    PartListElement,
    | InvalidParameterValueException
    | MissingParameterValueException
    | NoLongerSupportedException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPartsInput,
  output: ListPartsOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "marker",
    outputToken: "Marker",
    items: "Parts",
    pageSize: "limit",
  } as const,
}));
/**
 * You call this operation to inform Amazon Glacier (Glacier) that all the archive parts have been
 * uploaded and that Glacier can now assemble the archive from the uploaded parts.
 * After assembling and saving the archive to the vault, Glacier returns the URI path
 * of the newly created archive resource. Using the URI path, you can then access the archive.
 * After you upload an archive, you should save the archive ID returned to retrieve the
 * archive at a later point. You can also get the vault inventory to obtain a list of archive
 * IDs in a vault. For more information, see InitiateJob.
 *
 * In the request, you must include the computed SHA256 tree hash of the entire archive
 * you have uploaded. For information about computing a SHA256 tree hash, see Computing
 * Checksums. On the server side, Glacier also constructs the SHA256 tree
 * hash of the assembled archive. If the values match, Glacier saves the archive to the
 * vault; otherwise, it returns an error, and the operation fails. The ListParts operation returns a list of parts uploaded for a specific
 * multipart upload. It includes checksum information for each uploaded part that can be used
 * to debug a bad checksum issue.
 *
 * Additionally, Glacier also checks for any missing content ranges when
 * assembling the archive, if missing content ranges are found, Glacier returns an
 * error and the operation fails.
 *
 * Complete Multipart Upload is an idempotent operation. After your first successful
 * complete multipart upload, if you call the operation again within a short period, the
 * operation will succeed and return the same archive ID. This is useful in the event you
 * experience a network issue that causes an aborted connection or receive a 500 server error,
 * in which case you can repeat your Complete Multipart Upload request and get the same
 * archive ID without creating duplicate archives. Note, however, that after the multipart
 * upload completes, you cannot call the List Parts operation and the multipart upload will
 * not appear in List Multipart Uploads response, even if idempotent complete is
 * possible.
 *
 * An AWS account has full permission to perform all operations (actions). However, AWS
 * Identity and Access Management (IAM) users don't have any permissions by default. You must
 * grant them explicit permission to perform specific actions. For more information, see
 * Access Control Using
 * AWS Identity and Access Management (IAM).
 *
 * For conceptual information and underlying REST API, see Uploading Large Archives in
 * Parts (Multipart Upload) and Complete Multipart
 * Upload in the *Amazon Glacier Developer Guide*.
 */
export const completeMultipartUpload: (
  input: CompleteMultipartUploadInput,
) => effect.Effect<
  ArchiveCreationOutput,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CompleteMultipartUploadInput,
  output: ArchiveCreationOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation returns information about a vault, including the vault's Amazon
 * Resource Name (ARN), the date the vault was created, the number of archives it contains,
 * and the total size of all the archives in the vault. The number of archives and their total
 * size are as of the last inventory generation. This means that if you add or remove an
 * archive from a vault, and then immediately use Describe Vault, the change in contents will
 * not be immediately reflected. If you want to retrieve the latest inventory of the vault,
 * use InitiateJob. Amazon Glacier generates vault inventories approximately
 * daily. For more information, see Downloading a Vault Inventory in
 * Amazon Glacier.
 *
 * An AWS account has full permission to perform all operations (actions). However, AWS
 * Identity and Access Management (IAM) users don't have any permissions by default. You must
 * grant them explicit permission to perform specific actions. For more information, see
 * Access Control Using
 * AWS Identity and Access Management (IAM).
 *
 * For conceptual information and underlying REST API, see Retrieving Vault Metadata in
 * Amazon Glacier and Describe Vault in the
 * *Amazon Glacier Developer Guide*.
 */
export const describeVault: (
  input: DescribeVaultInput,
) => effect.Effect<
  DescribeVaultOutput,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeVaultInput,
  output: DescribeVaultOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation downloads the output of the job you initiated using InitiateJob. Depending on the job type you specified when you initiated the
 * job, the output will be either the content of an archive or a vault inventory.
 *
 * You can download all the job output or download a portion of the output by specifying
 * a byte range. In the case of an archive retrieval job, depending on the byte range you
 * specify, Amazon Glacier (Glacier) returns the checksum for the portion of the data. You can compute the
 * checksum on the client and verify that the values match to ensure the portion you downloaded
 * is the correct data.
 *
 * A job ID will not expire for at least 24 hours after Glacier completes the job. That
 * a byte range. For both archive and inventory retrieval jobs, you should verify the downloaded
 * size against the size returned in the headers from the
 * **Get Job Output** response.
 *
 * For archive retrieval jobs, you should also verify that the size is what you expected. If
 * you download a portion of the output, the expected size is based on the range of bytes
 * you specified. For example, if you specify a range of `bytes=0-1048575`, you should
 * verify your download size is 1,048,576 bytes. If you download an entire archive, the
 * expected size is the size of the archive when you uploaded it to Amazon Glacier
 * The expected size is also returned in the headers from the
 * **Get Job Output** response.
 *
 * In the case of an archive retrieval job, depending on the byte range you
 * specify, Glacier returns the checksum for the portion of the data. To ensure the portion you downloaded
 * is the correct data, compute the checksum on the client, verify that the values match,
 * and verify that the size is what you expected.
 *
 * A job ID does not expire for at least 24 hours after Glacier completes the
 * job. That is, you can download the job output within the 24 hours period after Amazon
 * Glacier completes the job.
 *
 * An AWS account has full permission to perform all operations (actions). However, AWS
 * Identity and Access Management (IAM) users don't have any permissions by default. You must
 * grant them explicit permission to perform specific actions. For more information, see
 * Access Control Using
 * AWS Identity and Access Management (IAM).
 *
 * For conceptual information and the underlying REST API, see Downloading a
 * Vault Inventory, Downloading an
 * Archive, and Get Job Output
 */
export const getJobOutput: (
  input: GetJobOutputInput,
) => effect.Effect<
  GetJobOutputOutput,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobOutputInput,
  output: GetJobOutputOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation retrieves the `access-policy` subresource set on the vault;
 * for more information on setting this subresource, see Set Vault Access Policy
 * (PUT access-policy). If there is no access policy set on the vault, the
 * operation returns a `404 Not found` error. For more information about vault
 * access policies, see Amazon Glacier Access Control
 * with Vault Access Policies.
 */
export const getVaultAccessPolicy: (
  input: GetVaultAccessPolicyInput,
) => effect.Effect<
  GetVaultAccessPolicyOutput,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVaultAccessPolicyInput,
  output: GetVaultAccessPolicyOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation retrieves the following attributes from the `lock-policy`
 * subresource set on the specified vault:
 *
 * - The vault lock policy set on the vault.
 *
 * - The state of the vault lock, which is either `InProgess` or
 * `Locked`.
 *
 * - When the lock ID expires. The lock ID is used to complete the vault locking
 * process.
 *
 * - When the vault lock was initiated and put into the `InProgress`
 * state.
 *
 * A vault lock is put into the `InProgress` state by calling InitiateVaultLock. A vault lock is put into the `Locked` state by
 * calling CompleteVaultLock. You can abort the vault locking process by
 * calling AbortVaultLock. For more information about the vault locking
 * process, Amazon
 * Glacier Vault Lock.
 *
 * If there is no vault lock policy set on the vault, the operation returns a 404
 * Not found error. For more information about vault lock policies, Amazon
 * Glacier Access Control with Vault Lock Policies.
 */
export const getVaultLock: (
  input: GetVaultLockInput,
) => effect.Effect<
  GetVaultLockOutput,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVaultLockInput,
  output: GetVaultLockOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation retrieves the `notification-configuration` subresource of
 * the specified vault.
 *
 * For information about setting a notification configuration on a vault, see SetVaultNotifications. If a notification configuration for a vault is not
 * set, the operation returns a `404 Not Found` error. For more information about
 * vault notifications, see Configuring Vault
 * Notifications in Amazon Glacier.
 *
 * An AWS account has full permission to perform all operations (actions). However, AWS
 * Identity and Access Management (IAM) users don't have any permissions by default. You must
 * grant them explicit permission to perform specific actions. For more information, see
 * Access Control Using
 * AWS Identity and Access Management (IAM).
 *
 * For conceptual information and underlying REST API, see Configuring Vault
 * Notifications in Amazon Glacier and Get Vault Notification
 * Configuration in the *Amazon Glacier Developer Guide*.
 */
export const getVaultNotifications: (
  input: GetVaultNotificationsInput,
) => effect.Effect<
  GetVaultNotificationsOutput,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVaultNotificationsInput,
  output: GetVaultNotificationsOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation initiates a multipart upload. Amazon Glacier creates a multipart
 * upload resource and returns its ID in the response. The multipart upload ID is used in
 * subsequent requests to upload parts of an archive (see UploadMultipartPart).
 *
 * When you initiate a multipart upload, you specify the part size in number of bytes.
 * The part size must be a megabyte (1024 KB) multiplied by a power of 2-for example, 1048576
 * (1 MB), 2097152 (2 MB), 4194304 (4 MB), 8388608 (8 MB), and so on. The minimum allowable
 * part size is 1 MB, and the maximum is 4 GB.
 *
 * Every part you upload to this resource (see UploadMultipartPart),
 * except the last one, must have the same size. The last one can be the same size or smaller.
 * For example, suppose you want to upload a 16.2 MB file. If you initiate the multipart
 * upload with a part size of 4 MB, you will upload four parts of 4 MB each and one part of
 * 0.2 MB.
 *
 * You don't need to know the size of the archive when you start a multipart upload
 * because Amazon Glacier does not require you to specify the overall archive
 * size.
 *
 * After you complete the multipart upload, Amazon Glacier (Glacier) removes the multipart upload
 * resource referenced by the ID. Glacier also removes the multipart upload resource if
 * you cancel the multipart upload or it may be removed if there is no activity for a period
 * of 24 hours.
 *
 * An AWS account has full permission to perform all operations (actions). However, AWS
 * Identity and Access Management (IAM) users don't have any permissions by default. You must
 * grant them explicit permission to perform specific actions. For more information, see
 * Access Control Using
 * AWS Identity and Access Management (IAM).
 *
 * For conceptual information and underlying REST API, see Uploading Large Archives in
 * Parts (Multipart Upload) and Initiate Multipart
 * Upload in the *Amazon Glacier Developer Guide*.
 */
export const initiateMultipartUpload: (
  input: InitiateMultipartUploadInput,
) => effect.Effect<
  InitiateMultipartUploadOutput,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InitiateMultipartUploadInput,
  output: InitiateMultipartUploadOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation lists jobs for a vault, including jobs that are in-progress and jobs
 * that have recently finished. The List Job operation returns a list of these jobs sorted by job initiation
 * time.
 *
 * Amazon Glacier retains recently completed jobs for a period before deleting them;
 * however, it eventually removes completed jobs. The output of completed jobs can be
 * retrieved. Retaining completed jobs for a period of time after they have completed
 * enables you to get a job output in the event you miss the job completion notification or
 * your first attempt to download it fails. For example, suppose you start an archive
 * retrieval job to download an archive. After the job completes, you start to download the
 * archive but encounter a network error. In this scenario, you can retry and download the
 * archive while the job exists.
 *
 * The List Jobs operation supports pagination. You should always check the response `Marker` field.
 * If there are no more jobs to list, the `Marker` field is set to `null`. If there are more jobs to list,
 * the `Marker` field is set to a non-null value, which you can use to continue the pagination of the list.
 * To return a list of jobs that begins at a specific job,
 * set the marker request parameter to the `Marker` value for that job that you obtained from a previous List Jobs request.
 *
 * You can set a maximum limit for the number of jobs returned in the response by
 * specifying the `limit` parameter in the request. The default limit is 50. The
 * number of jobs returned might be fewer than the limit, but the number of returned jobs
 * never exceeds the limit.
 *
 * Additionally, you can filter the jobs list returned by specifying the optional
 * `statuscode` parameter or `completed` parameter, or both. Using
 * the `statuscode` parameter, you can specify to return only jobs that match
 * either the `InProgress`, `Succeeded`, or `Failed` status.
 * Using the `completed` parameter, you can specify to return only jobs that were
 * completed (`true`) or jobs that were not completed
 * (`false`).
 *
 * For more information about using this operation,
 * see the documentation for the underlying REST API List Jobs.
 */
export const listJobs: {
  (
    input: ListJobsInput,
  ): effect.Effect<
    ListJobsOutput,
    | InvalidParameterValueException
    | MissingParameterValueException
    | NoLongerSupportedException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobsInput,
  ) => stream.Stream<
    ListJobsOutput,
    | InvalidParameterValueException
    | MissingParameterValueException
    | NoLongerSupportedException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobsInput,
  ) => stream.Stream<
    GlacierJobDescription,
    | InvalidParameterValueException
    | MissingParameterValueException
    | NoLongerSupportedException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobsInput,
  output: ListJobsOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "marker",
    outputToken: "Marker",
    items: "JobList",
    pageSize: "limit",
  } as const,
}));
/**
 * This operation lists all the tags attached to a vault. The operation returns an empty
 * map if there are no tags. For more information about tags, see Tagging Amazon Glacier
 * Resources.
 */
export const listTagsForVault: (
  input: ListTagsForVaultInput,
) => effect.Effect<
  ListTagsForVaultOutput,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForVaultInput,
  output: ListTagsForVaultOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation lists all vaults owned by the calling user's account. The list
 * returned in the response is ASCII-sorted by vault name.
 *
 * By default, this operation returns up to 10 items. If there are more vaults to
 * list, the response `marker` field contains the vault Amazon Resource Name (ARN)
 * at which to continue the list with a new List Vaults request; otherwise, the
 * `marker` field is `null`. To return a list of vaults that begins
 * at a specific vault, set the `marker` request parameter to the vault ARN you
 * obtained from a previous List Vaults request. You can also limit the number of vaults
 * returned in the response by specifying the `limit` parameter in the request.
 *
 * An AWS account has full permission to perform all operations (actions). However, AWS
 * Identity and Access Management (IAM) users don't have any permissions by default. You must
 * grant them explicit permission to perform specific actions. For more information, see
 * Access Control Using
 * AWS Identity and Access Management (IAM).
 *
 * For conceptual information and underlying REST API, see Retrieving Vault Metadata in
 * Amazon Glacier and List Vaults in the
 * *Amazon Glacier Developer Guide*.
 */
export const listVaults: {
  (
    input: ListVaultsInput,
  ): effect.Effect<
    ListVaultsOutput,
    | InvalidParameterValueException
    | MissingParameterValueException
    | NoLongerSupportedException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVaultsInput,
  ) => stream.Stream<
    ListVaultsOutput,
    | InvalidParameterValueException
    | MissingParameterValueException
    | NoLongerSupportedException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVaultsInput,
  ) => stream.Stream<
    DescribeVaultOutput,
    | InvalidParameterValueException
    | MissingParameterValueException
    | NoLongerSupportedException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListVaultsInput,
  output: ListVaultsOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "marker",
    outputToken: "Marker",
    items: "VaultList",
    pageSize: "limit",
  } as const,
}));
/**
 * This operation configures an access policy for a vault and will overwrite an existing
 * policy. To configure a vault access policy, send a PUT request to the
 * `access-policy` subresource of the vault. An access policy is specific to a
 * vault and is also called a vault subresource. You can set one access policy per vault and
 * the policy can be up to 20 KB in size. For more information about vault access policies,
 * see Amazon Glacier Access Control with Vault Access Policies.
 */
export const setVaultAccessPolicy: (
  input: SetVaultAccessPolicyInput,
) => effect.Effect<
  SetVaultAccessPolicyResponse,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetVaultAccessPolicyInput,
  output: SetVaultAccessPolicyResponse,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation configures notifications that will be sent when specific events happen
 * to a vault. By default, you don't get any notifications.
 *
 * To configure vault notifications, send a PUT request to the
 * `notification-configuration` subresource of the vault. The request should
 * include a JSON document that provides an Amazon SNS topic and specific events for which you
 * want Amazon Glacier to send notifications to the topic.
 *
 * Amazon SNS topics must grant permission to the vault to be allowed to publish
 * notifications to the topic. You can configure a vault to publish a notification for the
 * following vault events:
 *
 * - **ArchiveRetrievalCompleted** This event occurs when a
 * job that was initiated for an archive retrieval is completed (InitiateJob). The status of the completed job can be "Succeeded" or
 * "Failed". The notification sent to the SNS topic is the same output as returned from
 * DescribeJob.
 *
 * - **InventoryRetrievalCompleted** This event occurs when a
 * job that was initiated for an inventory retrieval is completed (InitiateJob). The status of the completed job can be "Succeeded" or
 * "Failed". The notification sent to the SNS topic is the same output as returned from
 * DescribeJob.
 *
 * An AWS account has full permission to perform all operations (actions). However, AWS
 * Identity and Access Management (IAM) users don't have any permissions by default. You must
 * grant them explicit permission to perform specific actions. For more information, see
 * Access Control Using
 * AWS Identity and Access Management (IAM).
 *
 * For conceptual information and underlying REST API, see Configuring Vault
 * Notifications in Amazon Glacier and Set Vault Notification
 * Configuration in the *Amazon Glacier Developer Guide*.
 */
export const setVaultNotifications: (
  input: SetVaultNotificationsInput,
) => effect.Effect<
  SetVaultNotificationsResponse,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetVaultNotificationsInput,
  output: SetVaultNotificationsResponse,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation aborts the vault locking process if the vault lock is not in the
 * `Locked` state. If the vault lock is in the `Locked` state when
 * this operation is requested, the operation returns an `AccessDeniedException`
 * error. Aborting the vault locking process removes the vault lock policy from the specified
 * vault.
 *
 * A vault lock is put into the `InProgress` state by calling InitiateVaultLock. A vault lock is put into the `Locked` state by
 * calling CompleteVaultLock. You can get the state of a vault lock by
 * calling GetVaultLock. For more information about the vault locking
 * process, see Amazon Glacier Vault Lock. For more information about vault lock policies, see
 * Amazon
 * Glacier Access Control with Vault Lock Policies.
 *
 * This operation is idempotent. You can successfully invoke this operation multiple
 * times, if the vault lock is in the `InProgress` state or if there is no policy
 * associated with the vault.
 */
export const abortVaultLock: (
  input: AbortVaultLockInput,
) => effect.Effect<
  AbortVaultLockResponse,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AbortVaultLockInput,
  output: AbortVaultLockResponse,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation completes the vault locking process by transitioning the vault lock
 * from the `InProgress` state to the `Locked` state, which causes the
 * vault lock policy to become unchangeable. A vault lock is put into the
 * `InProgress` state by calling InitiateVaultLock. You can
 * obtain the state of the vault lock by calling GetVaultLock. For more
 * information about the vault locking process, Amazon Glacier Vault Lock.
 *
 * This operation is idempotent. This request is always successful if the vault lock is
 * in the `Locked` state and the provided lock ID matches the lock ID originally
 * used to lock the vault.
 *
 * If an invalid lock ID is passed in the request when the vault lock is in the
 * `Locked` state, the operation returns an `AccessDeniedException`
 * error. If an invalid lock ID is passed in the request when the vault lock is in the
 * `InProgress` state, the operation throws an `InvalidParameter`
 * error.
 */
export const completeVaultLock: (
  input: CompleteVaultLockInput,
) => effect.Effect<
  CompleteVaultLockResponse,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CompleteVaultLockInput,
  output: CompleteVaultLockResponse,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation deletes an archive from a vault. Subsequent requests to initiate a
 * retrieval of this archive will fail. Archive retrievals that are in progress for this
 * archive ID may or may not succeed according to the following scenarios:
 *
 * - If the archive retrieval job is actively preparing the data for download when
 * Amazon Glacier receives the delete archive request, the archival retrieval operation
 * might fail.
 *
 * - If the archive retrieval job has successfully prepared the archive for download
 * when Amazon Glacier receives the delete archive request, you will be able to download
 * the output.
 *
 * This operation is idempotent. Attempting to delete an already-deleted archive does
 * not result in an error.
 *
 * An AWS account has full permission to perform all operations (actions). However, AWS
 * Identity and Access Management (IAM) users don't have any permissions by default. You must
 * grant them explicit permission to perform specific actions. For more information, see
 * Access Control Using
 * AWS Identity and Access Management (IAM).
 *
 * For conceptual information and underlying REST API, see Deleting an Archive in Amazon
 * Glacier and Delete Archive in the
 * *Amazon Glacier Developer Guide*.
 */
export const deleteArchive: (
  input: DeleteArchiveInput,
) => effect.Effect<
  DeleteArchiveResponse,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteArchiveInput,
  output: DeleteArchiveResponse,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation deletes a vault. Amazon Glacier will delete a vault only if there are
 * no archives in the vault as of the last inventory and there have been no writes to the
 * vault since the last inventory. If either of these conditions is not satisfied, the vault
 * deletion fails (that is, the vault is not removed) and Amazon Glacier returns an error. You
 * can use DescribeVault to return the number of archives in a vault, and
 * you can use Initiate a Job (POST
 * jobs) to initiate a new inventory retrieval for a vault. The inventory contains
 * the archive IDs you use to delete archives using Delete Archive (DELETE
 * archive).
 *
 * This operation is idempotent.
 *
 * An AWS account has full permission to perform all operations (actions). However, AWS
 * Identity and Access Management (IAM) users don't have any permissions by default. You must
 * grant them explicit permission to perform specific actions. For more information, see
 * Access Control Using
 * AWS Identity and Access Management (IAM).
 *
 * For conceptual information and underlying REST API, see Deleting a Vault in Amazon
 * Glacier and Delete Vault in the
 * *Amazon Glacier Developer Guide*.
 */
export const deleteVault: (
  input: DeleteVaultInput,
) => effect.Effect<
  DeleteVaultResponse,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVaultInput,
  output: DeleteVaultResponse,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation deletes the access policy associated with the specified vault. The
 * operation is eventually consistent; that is, it might take some time for Amazon Glacier to
 * completely remove the access policy, and you might still see the effect of the policy for a
 * short time after you send the delete request.
 *
 * This operation is idempotent. You can invoke delete multiple times, even if there is
 * no policy associated with the vault. For more information about vault access policies, see
 * Amazon Glacier Access Control with Vault Access Policies.
 */
export const deleteVaultAccessPolicy: (
  input: DeleteVaultAccessPolicyInput,
) => effect.Effect<
  DeleteVaultAccessPolicyResponse,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVaultAccessPolicyInput,
  output: DeleteVaultAccessPolicyResponse,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation deletes the notification configuration set for a vault. The operation
 * is eventually consistent; that is, it might take some time for Amazon Glacier to completely
 * disable the notifications and you might still receive some notifications for a short time
 * after you send the delete request.
 *
 * An AWS account has full permission to perform all operations (actions). However, AWS
 * Identity and Access Management (IAM) users don't have any permissions by default. You must
 * grant them explicit permission to perform specific actions. For more information, see
 * Access
 * Control Using AWS Identity and Access Management (IAM).
 *
 * For conceptual information and underlying REST API, see Configuring Vault
 * Notifications in Amazon Glacier and Delete Vault
 * Notification Configuration in the Amazon Glacier Developer Guide.
 */
export const deleteVaultNotifications: (
  input: DeleteVaultNotificationsInput,
) => effect.Effect<
  DeleteVaultNotificationsResponse,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVaultNotificationsInput,
  output: DeleteVaultNotificationsResponse,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation removes one or more tags from the set of tags attached to a vault. For
 * more information about tags, see Tagging Amazon Glacier Resources.
 * This operation is idempotent. The operation will be successful, even if there are no tags
 * attached to the vault.
 */
export const removeTagsFromVault: (
  input: RemoveTagsFromVaultInput,
) => effect.Effect<
  RemoveTagsFromVaultResponse,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsFromVaultInput,
  output: RemoveTagsFromVaultResponse,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation sets and then enacts a data retrieval policy in the region specified
 * in the PUT request. You can set one policy per region for an AWS account. The policy is
 * enacted within a few minutes of a successful PUT operation.
 *
 * The set policy operation does not affect retrieval jobs that were in progress before
 * the policy was enacted. For more information about data retrieval policies, see Amazon
 * Glacier Data Retrieval Policies.
 */
export const setDataRetrievalPolicy: (
  input: SetDataRetrievalPolicyInput,
) => effect.Effect<
  SetDataRetrievalPolicyResponse,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetDataRetrievalPolicyInput,
  output: SetDataRetrievalPolicyResponse,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation returns the current data retrieval policy for the account and region
 * specified in the GET request. For more information about data retrieval policies, see
 * Amazon Glacier Data Retrieval Policies.
 */
export const getDataRetrievalPolicy: (
  input: GetDataRetrievalPolicyInput,
) => effect.Effect<
  GetDataRetrievalPolicyOutput,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataRetrievalPolicyInput,
  output: GetDataRetrievalPolicyOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation creates a new vault with the specified name. The name of the vault
 * must be unique within a region for an AWS account. You can create up to 1,000 vaults per
 * account. If you need to create more vaults, contact Amazon Glacier.
 *
 * You must use the following guidelines when naming a vault.
 *
 * - Names can be between 1 and 255 characters long.
 *
 * - Allowed characters are a-z, A-Z, 0-9, '_' (underscore), '-' (hyphen), and '.'
 * (period).
 *
 * This operation is idempotent.
 *
 * An AWS account has full permission to perform all operations (actions). However, AWS
 * Identity and Access Management (IAM) users don't have any permissions by default. You must
 * grant them explicit permission to perform specific actions. For more information, see
 * Access Control Using
 * AWS Identity and Access Management (IAM).
 *
 * For conceptual information and underlying REST API, see Creating a Vault in Amazon
 * Glacier and Create Vault in the
 * *Amazon Glacier Developer Guide*.
 */
export const createVault: (
  input: CreateVaultInput,
) => effect.Effect<
  CreateVaultOutput,
  | InvalidParameterValueException
  | LimitExceededException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVaultInput,
  output: CreateVaultOutput,
  errors: [
    InvalidParameterValueException,
    LimitExceededException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation purchases a provisioned capacity unit for an AWS account.
 */
export const purchaseProvisionedCapacity: (
  input: PurchaseProvisionedCapacityInput,
) => effect.Effect<
  PurchaseProvisionedCapacityOutput,
  | InvalidParameterValueException
  | LimitExceededException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PurchaseProvisionedCapacityInput,
  output: PurchaseProvisionedCapacityOutput,
  errors: [
    InvalidParameterValueException,
    LimitExceededException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation aborts a multipart upload identified by the upload ID.
 *
 * After the Abort Multipart Upload request succeeds, you cannot upload any more parts
 * to the multipart upload or complete the multipart upload. Aborting a completed upload
 * fails. However, aborting an already-aborted upload will succeed, for a short time. For more
 * information about uploading a part and completing a multipart upload, see UploadMultipartPart and CompleteMultipartUpload.
 *
 * This operation is idempotent.
 *
 * An AWS account has full permission to perform all operations (actions). However, AWS
 * Identity and Access Management (IAM) users don't have any permissions by default. You must
 * grant them explicit permission to perform specific actions. For more information, see
 * Access Control Using
 * AWS Identity and Access Management (IAM).
 *
 * For conceptual information and underlying REST API, see Working with Archives in
 * Amazon Glacier and Abort Multipart
 * Upload in the *Amazon Glacier Developer Guide*.
 */
export const abortMultipartUpload: (
  input: AbortMultipartUploadInput,
) => effect.Effect<
  AbortMultipartUploadResponse,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AbortMultipartUploadInput,
  output: AbortMultipartUploadResponse,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation adds an archive to a vault. This is a synchronous operation, and for a
 * successful upload, your data is durably persisted. Amazon Glacier returns the archive ID in
 * the `x-amz-archive-id` header of the response.
 *
 * You must use the archive ID to access your data in Amazon Glacier. After you upload
 * an archive, you should save the archive ID returned so that you can retrieve or delete the
 * archive later. Besides saving the archive ID, you can also index it and give it a friendly
 * name to allow for better searching. You can also use the optional archive description field
 * to specify how the archive is referred to in an external index of archives, such as you
 * might create in Amazon DynamoDB. You can also get the vault inventory to obtain a list of
 * archive IDs in a vault. For more information, see InitiateJob.
 *
 * You must provide a SHA256 tree hash of the data you are uploading. For information
 * about computing a SHA256 tree hash, see Computing Checksums.
 *
 * You can optionally specify an archive description of up to 1,024 printable ASCII
 * characters. You can get the archive description when you either retrieve the archive or get
 * the vault inventory. For more information, see InitiateJob. Amazon
 * Glacier does not interpret the description in any way. An archive description does not need
 * to be unique. You cannot use the description to retrieve or sort the archive list.
 *
 * Archives are immutable. After you upload an archive, you cannot edit the archive or
 * its description.
 *
 * An AWS account has full permission to perform all operations (actions). However, AWS
 * Identity and Access Management (IAM) users don't have any permissions by default. You must
 * grant them explicit permission to perform specific actions. For more information, see
 * Access Control Using
 * AWS Identity and Access Management (IAM).
 *
 * For conceptual information and underlying REST API, see Uploading an Archive in Amazon
 * Glacier and Upload Archive in the
 * *Amazon Glacier Developer Guide*.
 */
export const uploadArchive: (
  input: UploadArchiveInput,
) => effect.Effect<
  ArchiveCreationOutput,
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | RequestTimeoutException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UploadArchiveInput,
  output: ArchiveCreationOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation initiates a job of the specified type, which can be a select, an archival retrieval,
 * or a vault retrieval. For more information about using this operation,
 * see the documentation for the underlying REST API Initiate
 * a Job.
 */
export const initiateJob: (
  input: InitiateJobInput,
) => effect.Effect<
  InitiateJobOutput,
  | InsufficientCapacityException
  | InvalidParameterValueException
  | MissingParameterValueException
  | NoLongerSupportedException
  | PolicyEnforcedException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InitiateJobInput,
  output: InitiateJobOutput,
  errors: [
    InsufficientCapacityException,
    InvalidParameterValueException,
    MissingParameterValueException,
    NoLongerSupportedException,
    PolicyEnforcedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));

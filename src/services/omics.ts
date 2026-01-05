import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({ sdkId: "Omics", serviceShapeName: "Omics" });
const auth = T.AwsAuthSigv4({ name: "omics" });
const ver = T.ServiceVersion("2022-11-28");
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
                                url: "https://omics-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://omics-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://omics.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://omics.{Region}.{PartitionResult#dnsSuffix}",
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

//# Schemas
export const IdList = S.Array(S.String);
export const VersionList = S.Array(S.String);
export const RunExportList = S.Array(S.String);
export const PropagatedSetLevelTags = S.Array(S.String);
export const ReadSetIdList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const WorkflowExportList = S.Array(S.String);
export class DeleteS3AccessPolicyRequest extends S.Class<DeleteS3AccessPolicyRequest>(
  "DeleteS3AccessPolicyRequest",
)(
  { s3AccessPointArn: S.String.pipe(T.HttpLabel("s3AccessPointArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/s3accesspolicy/{s3AccessPointArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteS3AccessPolicyResponse extends S.Class<DeleteS3AccessPolicyResponse>(
  "DeleteS3AccessPolicyResponse",
)({}) {}
export class GetS3AccessPolicyRequest extends S.Class<GetS3AccessPolicyRequest>(
  "GetS3AccessPolicyRequest",
)(
  { s3AccessPointArn: S.String.pipe(T.HttpLabel("s3AccessPointArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/s3accesspolicy/{s3AccessPointArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutS3AccessPolicyRequest extends S.Class<PutS3AccessPolicyRequest>(
  "PutS3AccessPolicyRequest",
)(
  {
    s3AccessPointArn: S.String.pipe(T.HttpLabel("s3AccessPointArn")),
    s3AccessPolicy: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/s3accesspolicy/{s3AccessPointArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAnnotationImportRequest extends S.Class<GetAnnotationImportRequest>(
  "GetAnnotationImportRequest",
)(
  { jobId: S.String.pipe(T.HttpLabel("jobId")) },
  T.all(
    T.Http({ method: "GET", uri: "/import/annotation/{jobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelAnnotationImportRequest extends S.Class<CancelAnnotationImportRequest>(
  "CancelAnnotationImportRequest",
)(
  { jobId: S.String.pipe(T.HttpLabel("jobId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/import/annotation/{jobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelAnnotationImportResponse extends S.Class<CancelAnnotationImportResponse>(
  "CancelAnnotationImportResponse",
)({}) {}
export class GetAnnotationStoreRequest extends S.Class<GetAnnotationStoreRequest>(
  "GetAnnotationStoreRequest",
)(
  { name: S.String.pipe(T.HttpLabel("name")) },
  T.all(
    T.Http({ method: "GET", uri: "/annotationStore/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAnnotationStoreRequest extends S.Class<UpdateAnnotationStoreRequest>(
  "UpdateAnnotationStoreRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/annotationStore/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAnnotationStoreRequest extends S.Class<DeleteAnnotationStoreRequest>(
  "DeleteAnnotationStoreRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    force: S.optional(S.Boolean).pipe(T.HttpQuery("force")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/annotationStore/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAnnotationStoreVersionRequest extends S.Class<GetAnnotationStoreVersionRequest>(
  "GetAnnotationStoreVersionRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    versionName: S.String.pipe(T.HttpLabel("versionName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/annotationStore/{name}/version/{versionName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAnnotationStoreVersionRequest extends S.Class<UpdateAnnotationStoreVersionRequest>(
  "UpdateAnnotationStoreVersionRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    versionName: S.String.pipe(T.HttpLabel("versionName")),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/annotationStore/{name}/version/{versionName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAnnotationStoreVersionsRequest extends S.Class<DeleteAnnotationStoreVersionsRequest>(
  "DeleteAnnotationStoreVersionsRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    versions: VersionList,
    force: S.optional(S.Boolean).pipe(T.HttpQuery("force")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/annotationStore/{name}/versions/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SseConfig extends S.Class<SseConfig>("SseConfig")({
  type: S.String,
  keyArn: S.optional(S.String),
}) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateReferenceStoreRequest extends S.Class<CreateReferenceStoreRequest>(
  "CreateReferenceStoreRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    sseConfig: S.optional(SseConfig),
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/referencestore" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetReferenceStoreRequest extends S.Class<GetReferenceStoreRequest>(
  "GetReferenceStoreRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "GET", uri: "/referencestore/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteReferenceStoreRequest extends S.Class<DeleteReferenceStoreRequest>(
  "DeleteReferenceStoreRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/referencestore/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteReferenceStoreResponse extends S.Class<DeleteReferenceStoreResponse>(
  "DeleteReferenceStoreResponse",
)({}) {}
export class GetReferenceImportJobRequest extends S.Class<GetReferenceImportJobRequest>(
  "GetReferenceImportJobRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    referenceStoreId: S.String.pipe(T.HttpLabel("referenceStoreId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/referencestore/{referenceStoreId}/importjob/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetReferenceMetadataRequest extends S.Class<GetReferenceMetadataRequest>(
  "GetReferenceMetadataRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    referenceStoreId: S.String.pipe(T.HttpLabel("referenceStoreId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/referencestore/{referenceStoreId}/reference/{id}/metadata",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteReferenceRequest extends S.Class<DeleteReferenceRequest>(
  "DeleteReferenceRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    referenceStoreId: S.String.pipe(T.HttpLabel("referenceStoreId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/referencestore/{referenceStoreId}/reference/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteReferenceResponse extends S.Class<DeleteReferenceResponse>(
  "DeleteReferenceResponse",
)({}) {}
export class GetReferenceRequest extends S.Class<GetReferenceRequest>(
  "GetReferenceRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    referenceStoreId: S.String.pipe(T.HttpLabel("referenceStoreId")),
    range: S.optional(S.String).pipe(T.HttpHeader("Range")),
    partNumber: S.Number.pipe(T.HttpQuery("partNumber")),
    file: S.optional(S.String).pipe(T.HttpQuery("file")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/referencestore/{referenceStoreId}/reference/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRunCacheRequest extends S.Class<CreateRunCacheRequest>(
  "CreateRunCacheRequest",
)(
  {
    cacheBehavior: S.optional(S.String),
    cacheS3Location: S.String,
    description: S.optional(S.String),
    name: S.optional(S.String),
    requestId: S.String,
    tags: S.optional(TagMap),
    cacheBucketOwnerId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/runCache" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRunCacheRequest extends S.Class<GetRunCacheRequest>(
  "GetRunCacheRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "GET", uri: "/runCache/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRunCacheRequest extends S.Class<UpdateRunCacheRequest>(
  "UpdateRunCacheRequest",
)(
  {
    cacheBehavior: S.optional(S.String),
    description: S.optional(S.String),
    id: S.String.pipe(T.HttpLabel("id")),
    name: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/runCache/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRunCacheResponse extends S.Class<UpdateRunCacheResponse>(
  "UpdateRunCacheResponse",
)({}) {}
export class DeleteRunCacheRequest extends S.Class<DeleteRunCacheRequest>(
  "DeleteRunCacheRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/runCache/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRunCacheResponse extends S.Class<DeleteRunCacheResponse>(
  "DeleteRunCacheResponse",
)({}) {}
export class ListRunCachesRequest extends S.Class<ListRunCachesRequest>(
  "ListRunCachesRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    startingToken: S.optional(S.String).pipe(T.HttpQuery("startingToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/runCache" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRunGroupRequest extends S.Class<CreateRunGroupRequest>(
  "CreateRunGroupRequest",
)(
  {
    name: S.optional(S.String),
    maxCpus: S.optional(S.Number),
    maxRuns: S.optional(S.Number),
    maxDuration: S.optional(S.Number),
    tags: S.optional(TagMap),
    requestId: S.String,
    maxGpus: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/runGroup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRunGroupRequest extends S.Class<GetRunGroupRequest>(
  "GetRunGroupRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "GET", uri: "/runGroup/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRunGroupRequest extends S.Class<UpdateRunGroupRequest>(
  "UpdateRunGroupRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    name: S.optional(S.String),
    maxCpus: S.optional(S.Number),
    maxRuns: S.optional(S.Number),
    maxDuration: S.optional(S.Number),
    maxGpus: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/runGroup/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRunGroupResponse extends S.Class<UpdateRunGroupResponse>(
  "UpdateRunGroupResponse",
)({}) {}
export class DeleteRunGroupRequest extends S.Class<DeleteRunGroupRequest>(
  "DeleteRunGroupRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/runGroup/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRunGroupResponse extends S.Class<DeleteRunGroupResponse>(
  "DeleteRunGroupResponse",
)({}) {}
export class ListRunGroupsRequest extends S.Class<ListRunGroupsRequest>(
  "ListRunGroupsRequest",
)(
  {
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    startingToken: S.optional(S.String).pipe(T.HttpQuery("startingToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/runGroup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartRunRequest extends S.Class<StartRunRequest>(
  "StartRunRequest",
)(
  {
    workflowId: S.optional(S.String),
    workflowType: S.optional(S.String),
    runId: S.optional(S.String),
    roleArn: S.String,
    name: S.optional(S.String),
    cacheId: S.optional(S.String),
    cacheBehavior: S.optional(S.String),
    runGroupId: S.optional(S.String),
    priority: S.optional(S.Number),
    parameters: S.optional(S.Any),
    storageCapacity: S.optional(S.Number),
    outputUri: S.String,
    logLevel: S.optional(S.String),
    tags: S.optional(TagMap),
    requestId: S.String,
    retentionMode: S.optional(S.String),
    storageType: S.optional(S.String),
    workflowOwnerId: S.optional(S.String),
    workflowVersionName: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/run" }), svc, auth, proto, ver, rules),
) {}
export class GetRunRequest extends S.Class<GetRunRequest>("GetRunRequest")(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    export: S.optional(RunExportList).pipe(T.HttpQuery("export")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/run/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRunRequest extends S.Class<DeleteRunRequest>(
  "DeleteRunRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/run/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRunResponse extends S.Class<DeleteRunResponse>(
  "DeleteRunResponse",
)({}) {}
export class ListRunsRequest extends S.Class<ListRunsRequest>(
  "ListRunsRequest",
)(
  {
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    runGroupId: S.optional(S.String).pipe(T.HttpQuery("runGroupId")),
    startingToken: S.optional(S.String).pipe(T.HttpQuery("startingToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
  },
  T.all(T.Http({ method: "GET", uri: "/run" }), svc, auth, proto, ver, rules),
) {}
export class CancelRunRequest extends S.Class<CancelRunRequest>(
  "CancelRunRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "POST", uri: "/run/{id}/cancel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelRunResponse extends S.Class<CancelRunResponse>(
  "CancelRunResponse",
)({}) {}
export class GetRunTaskRequest extends S.Class<GetRunTaskRequest>(
  "GetRunTaskRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    taskId: S.String.pipe(T.HttpLabel("taskId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/run/{id}/task/{taskId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRunTasksRequest extends S.Class<ListRunTasksRequest>(
  "ListRunTasksRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    startingToken: S.optional(S.String).pipe(T.HttpQuery("startingToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/run/{id}/task" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSequenceStoreRequest extends S.Class<GetSequenceStoreRequest>(
  "GetSequenceStoreRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "GET", uri: "/sequencestore/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class S3AccessConfig extends S.Class<S3AccessConfig>("S3AccessConfig")({
  accessLogLocation: S.optional(S.String),
}) {}
export class UpdateSequenceStoreRequest extends S.Class<UpdateSequenceStoreRequest>(
  "UpdateSequenceStoreRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    clientToken: S.optional(S.String),
    fallbackLocation: S.optional(S.String),
    propagatedSetLevelTags: S.optional(PropagatedSetLevelTags),
    s3AccessConfig: S.optional(S3AccessConfig),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/sequencestore/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSequenceStoreRequest extends S.Class<DeleteSequenceStoreRequest>(
  "DeleteSequenceStoreRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/sequencestore/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSequenceStoreResponse extends S.Class<DeleteSequenceStoreResponse>(
  "DeleteSequenceStoreResponse",
)({}) {}
export class AbortMultipartReadSetUploadRequest extends S.Class<AbortMultipartReadSetUploadRequest>(
  "AbortMultipartReadSetUploadRequest",
)(
  {
    sequenceStoreId: S.String.pipe(T.HttpLabel("sequenceStoreId")),
    uploadId: S.String.pipe(T.HttpLabel("uploadId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/sequencestore/{sequenceStoreId}/upload/{uploadId}/abort",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AbortMultipartReadSetUploadResponse extends S.Class<AbortMultipartReadSetUploadResponse>(
  "AbortMultipartReadSetUploadResponse",
)({}) {}
export class CreateMultipartReadSetUploadRequest extends S.Class<CreateMultipartReadSetUploadRequest>(
  "CreateMultipartReadSetUploadRequest",
)(
  {
    sequenceStoreId: S.String.pipe(T.HttpLabel("sequenceStoreId")),
    clientToken: S.optional(S.String),
    sourceFileType: S.String,
    subjectId: S.String,
    sampleId: S.String,
    generatedFrom: S.optional(S.String),
    referenceArn: S.optional(S.String),
    name: S.String,
    description: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/sequencestore/{sequenceStoreId}/upload" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetReadSetActivationJobRequest extends S.Class<GetReadSetActivationJobRequest>(
  "GetReadSetActivationJobRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    sequenceStoreId: S.String.pipe(T.HttpLabel("sequenceStoreId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/sequencestore/{sequenceStoreId}/activationjob/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetReadSetExportJobRequest extends S.Class<GetReadSetExportJobRequest>(
  "GetReadSetExportJobRequest",
)(
  {
    sequenceStoreId: S.String.pipe(T.HttpLabel("sequenceStoreId")),
    id: S.String.pipe(T.HttpLabel("id")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/sequencestore/{sequenceStoreId}/exportjob/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetReadSetImportJobRequest extends S.Class<GetReadSetImportJobRequest>(
  "GetReadSetImportJobRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    sequenceStoreId: S.String.pipe(T.HttpLabel("sequenceStoreId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/sequencestore/{sequenceStoreId}/importjob/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMultipartReadSetUploadsRequest extends S.Class<ListMultipartReadSetUploadsRequest>(
  "ListMultipartReadSetUploadsRequest",
)(
  {
    sequenceStoreId: S.String.pipe(T.HttpLabel("sequenceStoreId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/sequencestore/{sequenceStoreId}/uploads" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UploadReadSetPartRequest extends S.Class<UploadReadSetPartRequest>(
  "UploadReadSetPartRequest",
)(
  {
    sequenceStoreId: S.String.pipe(T.HttpLabel("sequenceStoreId")),
    uploadId: S.String.pipe(T.HttpLabel("uploadId")),
    partSource: S.String.pipe(T.HttpQuery("partSource")),
    partNumber: S.Number.pipe(T.HttpQuery("partNumber")),
    payload: T.StreamingInput.pipe(T.RequiresLength()).pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/sequencestore/{sequenceStoreId}/upload/{uploadId}/part",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetReadSetMetadataRequest extends S.Class<GetReadSetMetadataRequest>(
  "GetReadSetMetadataRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    sequenceStoreId: S.String.pipe(T.HttpLabel("sequenceStoreId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/sequencestore/{sequenceStoreId}/readset/{id}/metadata",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetReadSetRequest extends S.Class<GetReadSetRequest>(
  "GetReadSetRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    sequenceStoreId: S.String.pipe(T.HttpLabel("sequenceStoreId")),
    file: S.optional(S.String).pipe(T.HttpQuery("file")),
    partNumber: S.Number.pipe(T.HttpQuery("partNumber")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/sequencestore/{sequenceStoreId}/readset/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDeleteReadSetRequest extends S.Class<BatchDeleteReadSetRequest>(
  "BatchDeleteReadSetRequest",
)(
  {
    ids: ReadSetIdList,
    sequenceStoreId: S.String.pipe(T.HttpLabel("sequenceStoreId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/sequencestore/{sequenceStoreId}/readset/batch/delete",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateShareRequest extends S.Class<CreateShareRequest>(
  "CreateShareRequest",
)(
  {
    resourceArn: S.String,
    principalSubscriber: S.String,
    shareName: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/share" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetShareRequest extends S.Class<GetShareRequest>(
  "GetShareRequest",
)(
  { shareId: S.String.pipe(T.HttpLabel("shareId")) },
  T.all(
    T.Http({ method: "GET", uri: "/share/{shareId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AcceptShareRequest extends S.Class<AcceptShareRequest>(
  "AcceptShareRequest",
)(
  { shareId: S.String.pipe(T.HttpLabel("shareId")) },
  T.all(
    T.Http({ method: "POST", uri: "/share/{shareId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteShareRequest extends S.Class<DeleteShareRequest>(
  "DeleteShareRequest",
)(
  { shareId: S.String.pipe(T.HttpLabel("shareId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/share/{shareId}" }),
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
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagMap },
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
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export class GetVariantImportRequest extends S.Class<GetVariantImportRequest>(
  "GetVariantImportRequest",
)(
  { jobId: S.String.pipe(T.HttpLabel("jobId")) },
  T.all(
    T.Http({ method: "GET", uri: "/import/variant/{jobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelVariantImportRequest extends S.Class<CancelVariantImportRequest>(
  "CancelVariantImportRequest",
)(
  { jobId: S.String.pipe(T.HttpLabel("jobId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/import/variant/{jobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelVariantImportResponse extends S.Class<CancelVariantImportResponse>(
  "CancelVariantImportResponse",
)({}) {}
export const ReferenceItem = S.Union(S.Struct({ referenceArn: S.String }));
export class CreateVariantStoreRequest extends S.Class<CreateVariantStoreRequest>(
  "CreateVariantStoreRequest",
)(
  {
    reference: ReferenceItem,
    name: S.optional(S.String),
    description: S.optional(S.String),
    tags: S.optional(TagMap),
    sseConfig: S.optional(SseConfig),
  },
  T.all(
    T.Http({ method: "POST", uri: "/variantStore" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVariantStoreRequest extends S.Class<GetVariantStoreRequest>(
  "GetVariantStoreRequest",
)(
  { name: S.String.pipe(T.HttpLabel("name")) },
  T.all(
    T.Http({ method: "GET", uri: "/variantStore/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateVariantStoreRequest extends S.Class<UpdateVariantStoreRequest>(
  "UpdateVariantStoreRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/variantStore/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVariantStoreRequest extends S.Class<DeleteVariantStoreRequest>(
  "DeleteVariantStoreRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    force: S.optional(S.Boolean).pipe(T.HttpQuery("force")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/variantStore/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkflowRequest extends S.Class<GetWorkflowRequest>(
  "GetWorkflowRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
    export: S.optional(WorkflowExportList).pipe(T.HttpQuery("export")),
    workflowOwnerId: S.optional(S.String).pipe(T.HttpQuery("workflowOwnerId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/workflow/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWorkflowRequest extends S.Class<UpdateWorkflowRequest>(
  "UpdateWorkflowRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    storageType: S.optional(S.String),
    storageCapacity: S.optional(S.Number),
    readmeMarkdown: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/workflow/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWorkflowResponse extends S.Class<UpdateWorkflowResponse>(
  "UpdateWorkflowResponse",
)({}) {}
export class DeleteWorkflowRequest extends S.Class<DeleteWorkflowRequest>(
  "DeleteWorkflowRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/workflow/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkflowResponse extends S.Class<DeleteWorkflowResponse>(
  "DeleteWorkflowResponse",
)({}) {}
export class ListWorkflowsRequest extends S.Class<ListWorkflowsRequest>(
  "ListWorkflowsRequest",
)(
  {
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    startingToken: S.optional(S.String).pipe(T.HttpQuery("startingToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/workflow" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class WorkflowParameter extends S.Class<WorkflowParameter>(
  "WorkflowParameter",
)({ description: S.optional(S.String), optional: S.optional(S.Boolean) }) {}
export const WorkflowParameterTemplate = S.Record({
  key: S.String,
  value: WorkflowParameter,
});
export class RegistryMapping extends S.Class<RegistryMapping>(
  "RegistryMapping",
)({
  upstreamRegistryUrl: S.optional(S.String),
  ecrRepositoryPrefix: S.optional(S.String),
  upstreamRepositoryPrefix: S.optional(S.String),
  ecrAccountId: S.optional(S.String),
}) {}
export const RegistryMappingsList = S.Array(RegistryMapping);
export class ImageMapping extends S.Class<ImageMapping>("ImageMapping")({
  sourceImage: S.optional(S.String),
  destinationImage: S.optional(S.String),
}) {}
export const ImageMappingsList = S.Array(ImageMapping);
export class ContainerRegistryMap extends S.Class<ContainerRegistryMap>(
  "ContainerRegistryMap",
)({
  registryMappings: S.optional(RegistryMappingsList),
  imageMappings: S.optional(ImageMappingsList),
}) {}
export class SourceReference extends S.Class<SourceReference>(
  "SourceReference",
)({ type: S.String, value: S.String }) {}
export const ExcludeFilePatternList = S.Array(S.String);
export class DefinitionRepository extends S.Class<DefinitionRepository>(
  "DefinitionRepository",
)({
  connectionArn: S.String,
  fullRepositoryId: S.String,
  sourceReference: S.optional(SourceReference),
  excludeFilePatterns: S.optional(ExcludeFilePatternList),
}) {}
export class CreateWorkflowVersionRequest extends S.Class<CreateWorkflowVersionRequest>(
  "CreateWorkflowVersionRequest",
)(
  {
    workflowId: S.String.pipe(T.HttpLabel("workflowId")),
    versionName: S.String,
    definitionZip: S.optional(T.Blob),
    definitionUri: S.optional(S.String),
    accelerators: S.optional(S.String),
    description: S.optional(S.String),
    engine: S.optional(S.String),
    main: S.optional(S.String),
    parameterTemplate: S.optional(WorkflowParameterTemplate),
    requestId: S.String,
    storageType: S.optional(S.String),
    storageCapacity: S.optional(S.Number),
    tags: S.optional(TagMap),
    workflowBucketOwnerId: S.optional(S.String),
    containerRegistryMap: S.optional(ContainerRegistryMap),
    containerRegistryMapUri: S.optional(S.String),
    readmeMarkdown: S.optional(S.String),
    parameterTemplatePath: S.optional(S.String),
    readmePath: S.optional(S.String),
    definitionRepository: S.optional(DefinitionRepository),
    readmeUri: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/workflow/{workflowId}/version" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkflowVersionRequest extends S.Class<GetWorkflowVersionRequest>(
  "GetWorkflowVersionRequest",
)(
  {
    workflowId: S.String.pipe(T.HttpLabel("workflowId")),
    versionName: S.String.pipe(T.HttpLabel("versionName")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
    export: S.optional(WorkflowExportList).pipe(T.HttpQuery("export")),
    workflowOwnerId: S.optional(S.String).pipe(T.HttpQuery("workflowOwnerId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/workflow/{workflowId}/version/{versionName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWorkflowVersionRequest extends S.Class<UpdateWorkflowVersionRequest>(
  "UpdateWorkflowVersionRequest",
)(
  {
    workflowId: S.String.pipe(T.HttpLabel("workflowId")),
    versionName: S.String.pipe(T.HttpLabel("versionName")),
    description: S.optional(S.String),
    storageType: S.optional(S.String),
    storageCapacity: S.optional(S.Number),
    readmeMarkdown: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/workflow/{workflowId}/version/{versionName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWorkflowVersionResponse extends S.Class<UpdateWorkflowVersionResponse>(
  "UpdateWorkflowVersionResponse",
)({}) {}
export class DeleteWorkflowVersionRequest extends S.Class<DeleteWorkflowVersionRequest>(
  "DeleteWorkflowVersionRequest",
)(
  {
    workflowId: S.String.pipe(T.HttpLabel("workflowId")),
    versionName: S.String.pipe(T.HttpLabel("versionName")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/workflow/{workflowId}/version/{versionName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkflowVersionResponse extends S.Class<DeleteWorkflowVersionResponse>(
  "DeleteWorkflowVersionResponse",
)({}) {}
export class ListWorkflowVersionsRequest extends S.Class<ListWorkflowVersionsRequest>(
  "ListWorkflowVersionsRequest",
)(
  {
    workflowId: S.String.pipe(T.HttpLabel("workflowId")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
    workflowOwnerId: S.optional(S.String).pipe(T.HttpQuery("workflowOwnerId")),
    startingToken: S.optional(S.String).pipe(T.HttpQuery("startingToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/workflow/{workflowId}/version" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ArnList = S.Array(S.String);
export const StatusList = S.Array(S.String);
export const TypeList = S.Array(S.String);
export class AnnotationImportItemSource extends S.Class<AnnotationImportItemSource>(
  "AnnotationImportItemSource",
)({ source: S.String }) {}
export const AnnotationImportItemSources = S.Array(AnnotationImportItemSource);
export const AnnotationFieldMap = S.Record({ key: S.String, value: S.String });
export class ListAnnotationImportJobsFilter extends S.Class<ListAnnotationImportJobsFilter>(
  "ListAnnotationImportJobsFilter",
)({ status: S.optional(S.String), storeName: S.optional(S.String) }) {}
export class ListAnnotationStoresFilter extends S.Class<ListAnnotationStoresFilter>(
  "ListAnnotationStoresFilter",
)({ status: S.optional(S.String) }) {}
export class ListAnnotationStoreVersionsFilter extends S.Class<ListAnnotationStoreVersionsFilter>(
  "ListAnnotationStoreVersionsFilter",
)({ status: S.optional(S.String) }) {}
export class ReferenceStoreFilter extends S.Class<ReferenceStoreFilter>(
  "ReferenceStoreFilter",
)({
  name: S.optional(S.String),
  createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ImportReferenceFilter extends S.Class<ImportReferenceFilter>(
  "ImportReferenceFilter",
)({
  status: S.optional(S.String),
  createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class StartReferenceImportJobSourceItem extends S.Class<StartReferenceImportJobSourceItem>(
  "StartReferenceImportJobSourceItem",
)({
  sourceFile: S.String,
  name: S.String,
  description: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export const StartReferenceImportJobSourceList = S.Array(
  StartReferenceImportJobSourceItem,
);
export class ReferenceFilter extends S.Class<ReferenceFilter>(
  "ReferenceFilter",
)({
  name: S.optional(S.String),
  md5: S.optional(S.String),
  createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class SequenceStoreFilter extends S.Class<SequenceStoreFilter>(
  "SequenceStoreFilter",
)({
  name: S.optional(S.String),
  createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  status: S.optional(S.String),
  updatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class CompleteReadSetUploadPartListItem extends S.Class<CompleteReadSetUploadPartListItem>(
  "CompleteReadSetUploadPartListItem",
)({ partNumber: S.Number, partSource: S.String, checksum: S.String }) {}
export const CompleteReadSetUploadPartList = S.Array(
  CompleteReadSetUploadPartListItem,
);
export class ActivateReadSetFilter extends S.Class<ActivateReadSetFilter>(
  "ActivateReadSetFilter",
)({
  status: S.optional(S.String),
  createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ExportReadSetFilter extends S.Class<ExportReadSetFilter>(
  "ExportReadSetFilter",
)({
  status: S.optional(S.String),
  createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ImportReadSetFilter extends S.Class<ImportReadSetFilter>(
  "ImportReadSetFilter",
)({
  status: S.optional(S.String),
  createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ReadSetUploadPartListFilter extends S.Class<ReadSetUploadPartListFilter>(
  "ReadSetUploadPartListFilter",
)({
  createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class StartReadSetActivationJobSourceItem extends S.Class<StartReadSetActivationJobSourceItem>(
  "StartReadSetActivationJobSourceItem",
)({ readSetId: S.String }) {}
export const StartReadSetActivationJobSourceList = S.Array(
  StartReadSetActivationJobSourceItem,
);
export class ExportReadSet extends S.Class<ExportReadSet>("ExportReadSet")({
  readSetId: S.String,
}) {}
export const ExportReadSetList = S.Array(ExportReadSet);
export class ReadSetFilter extends S.Class<ReadSetFilter>("ReadSetFilter")({
  name: S.optional(S.String),
  status: S.optional(S.String),
  referenceArn: S.optional(S.String),
  createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  sampleId: S.optional(S.String),
  subjectId: S.optional(S.String),
  generatedFrom: S.optional(S.String),
  creationType: S.optional(S.String),
}) {}
export class Filter extends S.Class<Filter>("Filter")({
  resourceArns: S.optional(ArnList),
  status: S.optional(StatusList),
  type: S.optional(TypeList),
}) {}
export class VariantImportItemSource extends S.Class<VariantImportItemSource>(
  "VariantImportItemSource",
)({ source: S.String }) {}
export const VariantImportItemSources = S.Array(VariantImportItemSource);
export class ListVariantImportJobsFilter extends S.Class<ListVariantImportJobsFilter>(
  "ListVariantImportJobsFilter",
)({ status: S.optional(S.String), storeName: S.optional(S.String) }) {}
export class ListVariantStoresFilter extends S.Class<ListVariantStoresFilter>(
  "ListVariantStoresFilter",
)({ status: S.optional(S.String) }) {}
export class GetS3AccessPolicyResponse extends S.Class<GetS3AccessPolicyResponse>(
  "GetS3AccessPolicyResponse",
)({
  s3AccessPointArn: S.optional(S.String),
  storeId: S.optional(S.String),
  storeType: S.optional(S.String),
  updateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  s3AccessPolicy: S.String,
}) {}
export class PutS3AccessPolicyResponse extends S.Class<PutS3AccessPolicyResponse>(
  "PutS3AccessPolicyResponse",
)({
  s3AccessPointArn: S.optional(S.String),
  storeId: S.optional(S.String),
  storeType: S.optional(S.String),
}) {}
export class ListAnnotationImportJobsRequest extends S.Class<ListAnnotationImportJobsRequest>(
  "ListAnnotationImportJobsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    ids: S.optional(IdList),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    filter: S.optional(ListAnnotationImportJobsFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/import/annotations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const FormatToHeader = S.Record({ key: S.String, value: S.String });
export const SchemaItem = S.Record({ key: S.String, value: S.String });
export const Schema = S.Array(SchemaItem);
export class TsvStoreOptions extends S.Class<TsvStoreOptions>(
  "TsvStoreOptions",
)({
  annotationType: S.optional(S.String),
  formatToHeader: S.optional(FormatToHeader),
  schema: S.optional(Schema),
}) {}
export const StoreOptions = S.Union(
  S.Struct({ tsvStoreOptions: TsvStoreOptions }),
);
export class GetAnnotationStoreResponse extends S.Class<GetAnnotationStoreResponse>(
  "GetAnnotationStoreResponse",
)({
  id: S.String,
  reference: ReferenceItem,
  status: S.String,
  storeArn: S.String,
  name: S.String,
  description: S.String,
  sseConfig: SseConfig,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  tags: TagMap,
  storeOptions: S.optional(StoreOptions),
  storeFormat: S.optional(S.String),
  statusMessage: S.String,
  storeSizeBytes: S.Number,
  numVersions: S.Number,
}) {}
export class UpdateAnnotationStoreResponse extends S.Class<UpdateAnnotationStoreResponse>(
  "UpdateAnnotationStoreResponse",
)({
  id: S.String,
  reference: ReferenceItem,
  status: S.String,
  name: S.String,
  description: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  storeOptions: S.optional(StoreOptions),
  storeFormat: S.optional(S.String),
}) {}
export class DeleteAnnotationStoreResponse extends S.Class<DeleteAnnotationStoreResponse>(
  "DeleteAnnotationStoreResponse",
)({ status: S.String }) {}
export class ListAnnotationStoresRequest extends S.Class<ListAnnotationStoresRequest>(
  "ListAnnotationStoresRequest",
)(
  {
    ids: S.optional(IdList),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    filter: S.optional(ListAnnotationStoresFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/annotationStores" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TsvVersionOptions extends S.Class<TsvVersionOptions>(
  "TsvVersionOptions",
)({
  annotationType: S.optional(S.String),
  formatToHeader: S.optional(FormatToHeader),
  schema: S.optional(Schema),
}) {}
export const VersionOptions = S.Union(
  S.Struct({ tsvVersionOptions: TsvVersionOptions }),
);
export class GetAnnotationStoreVersionResponse extends S.Class<GetAnnotationStoreVersionResponse>(
  "GetAnnotationStoreVersionResponse",
)({
  storeId: S.String,
  id: S.String,
  status: S.String,
  versionArn: S.String,
  name: S.String,
  versionName: S.String,
  description: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  tags: TagMap,
  versionOptions: S.optional(VersionOptions),
  statusMessage: S.String,
  versionSizeBytes: S.Number,
}) {}
export class UpdateAnnotationStoreVersionResponse extends S.Class<UpdateAnnotationStoreVersionResponse>(
  "UpdateAnnotationStoreVersionResponse",
)({
  storeId: S.String,
  id: S.String,
  status: S.String,
  name: S.String,
  versionName: S.String,
  description: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListAnnotationStoreVersionsRequest extends S.Class<ListAnnotationStoreVersionsRequest>(
  "ListAnnotationStoreVersionsRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    filter: S.optional(ListAnnotationStoreVersionsFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/annotationStore/{name}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateReferenceStoreResponse extends S.Class<CreateReferenceStoreResponse>(
  "CreateReferenceStoreResponse",
)({
  id: S.String,
  arn: S.String,
  name: S.optional(S.String),
  description: S.optional(S.String),
  sseConfig: S.optional(SseConfig),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class GetReferenceStoreResponse extends S.Class<GetReferenceStoreResponse>(
  "GetReferenceStoreResponse",
)({
  id: S.String,
  arn: S.String,
  name: S.optional(S.String),
  description: S.optional(S.String),
  sseConfig: S.optional(SseConfig),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListReferenceStoresRequest extends S.Class<ListReferenceStoresRequest>(
  "ListReferenceStoresRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    filter: S.optional(ReferenceStoreFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/referencestores" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListReferenceImportJobsRequest extends S.Class<ListReferenceImportJobsRequest>(
  "ListReferenceImportJobsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    referenceStoreId: S.String.pipe(T.HttpLabel("referenceStoreId")),
    filter: S.optional(ImportReferenceFilter),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/referencestore/{referenceStoreId}/importjobs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartReferenceImportJobRequest extends S.Class<StartReferenceImportJobRequest>(
  "StartReferenceImportJobRequest",
)(
  {
    referenceStoreId: S.String.pipe(T.HttpLabel("referenceStoreId")),
    roleArn: S.String,
    clientToken: S.optional(S.String),
    sources: StartReferenceImportJobSourceList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/referencestore/{referenceStoreId}/importjob",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListReferencesRequest extends S.Class<ListReferencesRequest>(
  "ListReferencesRequest",
)(
  {
    referenceStoreId: S.String.pipe(T.HttpLabel("referenceStoreId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    filter: S.optional(ReferenceFilter),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/referencestore/{referenceStoreId}/references",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetReferenceResponse extends S.Class<GetReferenceResponse>(
  "GetReferenceResponse",
)({ payload: S.optional(T.StreamingOutput).pipe(T.HttpPayload()) }) {}
export class CreateRunCacheResponse extends S.Class<CreateRunCacheResponse>(
  "CreateRunCacheResponse",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  status: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export class GetRunCacheResponse extends S.Class<GetRunCacheResponse>(
  "GetRunCacheResponse",
)({
  arn: S.optional(S.String),
  cacheBehavior: S.optional(S.String),
  cacheBucketOwnerId: S.optional(S.String),
  cacheS3Uri: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  description: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  status: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export class CreateRunGroupResponse extends S.Class<CreateRunGroupResponse>(
  "CreateRunGroupResponse",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export class GetRunGroupResponse extends S.Class<GetRunGroupResponse>(
  "GetRunGroupResponse",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  maxCpus: S.optional(S.Number),
  maxRuns: S.optional(S.Number),
  maxDuration: S.optional(S.Number),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  tags: S.optional(TagMap),
  maxGpus: S.optional(S.Number),
}) {}
export class StartRunResponse extends S.Class<StartRunResponse>(
  "StartRunResponse",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  status: S.optional(S.String),
  tags: S.optional(TagMap),
  uuid: S.optional(S.String),
  runOutputUri: S.optional(S.String),
}) {}
export class CreateSequenceStoreRequest extends S.Class<CreateSequenceStoreRequest>(
  "CreateSequenceStoreRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    sseConfig: S.optional(SseConfig),
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String),
    fallbackLocation: S.optional(S.String),
    eTagAlgorithmFamily: S.optional(S.String),
    propagatedSetLevelTags: S.optional(PropagatedSetLevelTags),
    s3AccessConfig: S.optional(S3AccessConfig),
  },
  T.all(
    T.Http({ method: "POST", uri: "/sequencestore" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SequenceStoreS3Access extends S.Class<SequenceStoreS3Access>(
  "SequenceStoreS3Access",
)({
  s3Uri: S.optional(S.String),
  s3AccessPointArn: S.optional(S.String),
  accessLogLocation: S.optional(S.String),
}) {}
export class UpdateSequenceStoreResponse extends S.Class<UpdateSequenceStoreResponse>(
  "UpdateSequenceStoreResponse",
)({
  id: S.String,
  arn: S.String,
  name: S.optional(S.String),
  description: S.optional(S.String),
  sseConfig: S.optional(SseConfig),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  propagatedSetLevelTags: S.optional(PropagatedSetLevelTags),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  fallbackLocation: S.optional(S.String),
  s3Access: S.optional(SequenceStoreS3Access),
  eTagAlgorithmFamily: S.optional(S.String),
}) {}
export class ListSequenceStoresRequest extends S.Class<ListSequenceStoresRequest>(
  "ListSequenceStoresRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    filter: S.optional(SequenceStoreFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/sequencestores" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CompleteMultipartReadSetUploadRequest extends S.Class<CompleteMultipartReadSetUploadRequest>(
  "CompleteMultipartReadSetUploadRequest",
)(
  {
    sequenceStoreId: S.String.pipe(T.HttpLabel("sequenceStoreId")),
    uploadId: S.String.pipe(T.HttpLabel("uploadId")),
    parts: CompleteReadSetUploadPartList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/sequencestore/{sequenceStoreId}/upload/{uploadId}/complete",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMultipartReadSetUploadResponse extends S.Class<CreateMultipartReadSetUploadResponse>(
  "CreateMultipartReadSetUploadResponse",
)({
  sequenceStoreId: S.String,
  uploadId: S.String,
  sourceFileType: S.String,
  subjectId: S.String,
  sampleId: S.String,
  generatedFrom: S.optional(S.String),
  referenceArn: S.String,
  name: S.optional(S.String),
  description: S.optional(S.String),
  tags: S.optional(TagMap),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListReadSetActivationJobsRequest extends S.Class<ListReadSetActivationJobsRequest>(
  "ListReadSetActivationJobsRequest",
)(
  {
    sequenceStoreId: S.String.pipe(T.HttpLabel("sequenceStoreId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    filter: S.optional(ActivateReadSetFilter),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/sequencestore/{sequenceStoreId}/activationjobs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListReadSetExportJobsRequest extends S.Class<ListReadSetExportJobsRequest>(
  "ListReadSetExportJobsRequest",
)(
  {
    sequenceStoreId: S.String.pipe(T.HttpLabel("sequenceStoreId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    filter: S.optional(ExportReadSetFilter),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/sequencestore/{sequenceStoreId}/exportjobs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListReadSetImportJobsRequest extends S.Class<ListReadSetImportJobsRequest>(
  "ListReadSetImportJobsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sequenceStoreId: S.String.pipe(T.HttpLabel("sequenceStoreId")),
    filter: S.optional(ImportReadSetFilter),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/sequencestore/{sequenceStoreId}/importjobs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListReadSetUploadPartsRequest extends S.Class<ListReadSetUploadPartsRequest>(
  "ListReadSetUploadPartsRequest",
)(
  {
    sequenceStoreId: S.String.pipe(T.HttpLabel("sequenceStoreId")),
    uploadId: S.String.pipe(T.HttpLabel("uploadId")),
    partSource: S.String,
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    filter: S.optional(ReadSetUploadPartListFilter),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/sequencestore/{sequenceStoreId}/upload/{uploadId}/parts",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartReadSetActivationJobRequest extends S.Class<StartReadSetActivationJobRequest>(
  "StartReadSetActivationJobRequest",
)(
  {
    sequenceStoreId: S.String.pipe(T.HttpLabel("sequenceStoreId")),
    clientToken: S.optional(S.String),
    sources: StartReadSetActivationJobSourceList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/sequencestore/{sequenceStoreId}/activationjob",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartReadSetExportJobRequest extends S.Class<StartReadSetExportJobRequest>(
  "StartReadSetExportJobRequest",
)(
  {
    sequenceStoreId: S.String.pipe(T.HttpLabel("sequenceStoreId")),
    destination: S.String,
    roleArn: S.String,
    clientToken: S.optional(S.String),
    sources: ExportReadSetList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/sequencestore/{sequenceStoreId}/exportjob",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UploadReadSetPartResponse extends S.Class<UploadReadSetPartResponse>(
  "UploadReadSetPartResponse",
)({ checksum: S.String }) {}
export class ListReadSetsRequest extends S.Class<ListReadSetsRequest>(
  "ListReadSetsRequest",
)(
  {
    sequenceStoreId: S.String.pipe(T.HttpLabel("sequenceStoreId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    filter: S.optional(ReadSetFilter),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/sequencestore/{sequenceStoreId}/readsets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetReadSetResponse extends S.Class<GetReadSetResponse>(
  "GetReadSetResponse",
)({ payload: S.optional(T.StreamingOutput).pipe(T.HttpPayload()) }) {}
export class CreateShareResponse extends S.Class<CreateShareResponse>(
  "CreateShareResponse",
)({
  shareId: S.optional(S.String),
  status: S.optional(S.String),
  shareName: S.optional(S.String),
}) {}
export class AcceptShareResponse extends S.Class<AcceptShareResponse>(
  "AcceptShareResponse",
)({ status: S.optional(S.String) }) {}
export class DeleteShareResponse extends S.Class<DeleteShareResponse>(
  "DeleteShareResponse",
)({ status: S.optional(S.String) }) {}
export class ListSharesRequest extends S.Class<ListSharesRequest>(
  "ListSharesRequest",
)(
  {
    resourceOwner: S.String,
    filter: S.optional(Filter),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/shares" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: TagMap }) {}
export class StartVariantImportRequest extends S.Class<StartVariantImportRequest>(
  "StartVariantImportRequest",
)(
  {
    destinationName: S.String,
    roleArn: S.String,
    items: VariantImportItemSources,
    runLeftNormalization: S.optional(S.Boolean),
    annotationFields: S.optional(AnnotationFieldMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/import/variant" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVariantImportJobsRequest extends S.Class<ListVariantImportJobsRequest>(
  "ListVariantImportJobsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    ids: S.optional(IdList),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    filter: S.optional(ListVariantImportJobsFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/import/variants" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateVariantStoreResponse extends S.Class<CreateVariantStoreResponse>(
  "CreateVariantStoreResponse",
)({
  id: S.String,
  reference: S.optional(ReferenceItem),
  status: S.String,
  name: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class GetVariantStoreResponse extends S.Class<GetVariantStoreResponse>(
  "GetVariantStoreResponse",
)({
  id: S.String,
  reference: ReferenceItem,
  status: S.String,
  storeArn: S.String,
  name: S.String,
  description: S.String,
  sseConfig: SseConfig,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  tags: TagMap,
  statusMessage: S.String,
  storeSizeBytes: S.Number,
}) {}
export class UpdateVariantStoreResponse extends S.Class<UpdateVariantStoreResponse>(
  "UpdateVariantStoreResponse",
)({
  id: S.String,
  reference: ReferenceItem,
  status: S.String,
  name: S.String,
  description: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class DeleteVariantStoreResponse extends S.Class<DeleteVariantStoreResponse>(
  "DeleteVariantStoreResponse",
)({ status: S.String }) {}
export class ListVariantStoresRequest extends S.Class<ListVariantStoresRequest>(
  "ListVariantStoresRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    ids: S.optional(IdList),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    filter: S.optional(ListVariantStoresFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/variantStores" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateWorkflowVersionResponse extends S.Class<CreateWorkflowVersionResponse>(
  "CreateWorkflowVersionResponse",
)({
  arn: S.optional(S.String),
  workflowId: S.optional(S.String),
  versionName: S.optional(S.String),
  status: S.optional(S.String),
  tags: S.optional(TagMap),
  uuid: S.optional(S.String),
}) {}
export const WorkflowMetadata = S.Record({ key: S.String, value: S.String });
export class DefinitionRepositoryDetails extends S.Class<DefinitionRepositoryDetails>(
  "DefinitionRepositoryDetails",
)({
  connectionArn: S.optional(S.String),
  fullRepositoryId: S.optional(S.String),
  sourceReference: S.optional(SourceReference),
  providerType: S.optional(S.String),
  providerEndpoint: S.optional(S.String),
}) {}
export class GetWorkflowVersionResponse extends S.Class<GetWorkflowVersionResponse>(
  "GetWorkflowVersionResponse",
)({
  arn: S.optional(S.String),
  workflowId: S.optional(S.String),
  versionName: S.optional(S.String),
  accelerators: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  description: S.optional(S.String),
  definition: S.optional(S.String),
  digest: S.optional(S.String),
  engine: S.optional(S.String),
  main: S.optional(S.String),
  metadata: S.optional(WorkflowMetadata),
  parameterTemplate: S.optional(WorkflowParameterTemplate),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  storageType: S.optional(S.String),
  storageCapacity: S.optional(S.Number),
  type: S.optional(S.String),
  tags: S.optional(TagMap),
  uuid: S.optional(S.String),
  workflowBucketOwnerId: S.optional(S.String),
  containerRegistryMap: S.optional(ContainerRegistryMap),
  readme: S.optional(S.String),
  definitionRepositoryDetails: S.optional(DefinitionRepositoryDetails),
  readmePath: S.optional(S.String),
}) {}
export class VcfOptions extends S.Class<VcfOptions>("VcfOptions")({
  ignoreQualField: S.optional(S.Boolean),
  ignoreFilterField: S.optional(S.Boolean),
}) {}
export class SourceFiles extends S.Class<SourceFiles>("SourceFiles")({
  source1: S.String,
  source2: S.optional(S.String),
}) {}
export class AnnotationImportItemDetail extends S.Class<AnnotationImportItemDetail>(
  "AnnotationImportItemDetail",
)({ source: S.String, jobStatus: S.String }) {}
export const AnnotationImportItemDetails = S.Array(AnnotationImportItemDetail);
export class VersionDeleteError extends S.Class<VersionDeleteError>(
  "VersionDeleteError",
)({ versionName: S.String, message: S.String }) {}
export const VersionDeleteErrorList = S.Array(VersionDeleteError);
export class ImportReferenceSourceItem extends S.Class<ImportReferenceSourceItem>(
  "ImportReferenceSourceItem",
)({
  sourceFile: S.optional(S.String),
  status: S.String,
  statusMessage: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  tags: S.optional(TagMap),
  referenceId: S.optional(S.String),
}) {}
export const ImportReferenceSourceList = S.Array(ImportReferenceSourceItem);
export class RunCacheListItem extends S.Class<RunCacheListItem>(
  "RunCacheListItem",
)({
  arn: S.optional(S.String),
  cacheBehavior: S.optional(S.String),
  cacheS3Uri: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  id: S.optional(S.String),
  name: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export const RunCacheList = S.Array(RunCacheListItem);
export class RunGroupListItem extends S.Class<RunGroupListItem>(
  "RunGroupListItem",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  maxCpus: S.optional(S.Number),
  maxRuns: S.optional(S.Number),
  maxDuration: S.optional(S.Number),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  maxGpus: S.optional(S.Number),
}) {}
export const RunGroupList = S.Array(RunGroupListItem);
export const RunResourceDigests = S.Record({ key: S.String, value: S.String });
export class RunLogLocation extends S.Class<RunLogLocation>("RunLogLocation")({
  engineLogStream: S.optional(S.String),
  runLogStream: S.optional(S.String),
}) {}
export class RunListItem extends S.Class<RunListItem>("RunListItem")({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  status: S.optional(S.String),
  workflowId: S.optional(S.String),
  name: S.optional(S.String),
  priority: S.optional(S.Number),
  storageCapacity: S.optional(S.Number),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  stopTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  storageType: S.optional(S.String),
  workflowVersionName: S.optional(S.String),
}) {}
export const RunList = S.Array(RunListItem);
export class ImageDetails extends S.Class<ImageDetails>("ImageDetails")({
  image: S.optional(S.String),
  imageDigest: S.optional(S.String),
  sourceImage: S.optional(S.String),
}) {}
export class TaskListItem extends S.Class<TaskListItem>("TaskListItem")({
  taskId: S.optional(S.String),
  status: S.optional(S.String),
  name: S.optional(S.String),
  cpus: S.optional(S.Number),
  cacheHit: S.optional(S.Boolean),
  cacheS3Uri: S.optional(S.String),
  memory: S.optional(S.Number),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  stopTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  gpus: S.optional(S.Number),
  instanceType: S.optional(S.String),
}) {}
export const TaskList = S.Array(TaskListItem);
export class ActivateReadSetSourceItem extends S.Class<ActivateReadSetSourceItem>(
  "ActivateReadSetSourceItem",
)({
  readSetId: S.String,
  status: S.String,
  statusMessage: S.optional(S.String),
}) {}
export const ActivateReadSetSourceList = S.Array(ActivateReadSetSourceItem);
export class ExportReadSetDetail extends S.Class<ExportReadSetDetail>(
  "ExportReadSetDetail",
)({ id: S.String, status: S.String, statusMessage: S.optional(S.String) }) {}
export const ExportReadSetDetailList = S.Array(ExportReadSetDetail);
export class ImportReadSetSourceItem extends S.Class<ImportReadSetSourceItem>(
  "ImportReadSetSourceItem",
)({
  sourceFiles: SourceFiles,
  sourceFileType: S.String,
  status: S.String,
  statusMessage: S.optional(S.String),
  subjectId: S.String,
  sampleId: S.String,
  generatedFrom: S.optional(S.String),
  referenceArn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  tags: S.optional(TagMap),
  readSetId: S.optional(S.String),
}) {}
export const ImportReadSetSourceList = S.Array(ImportReadSetSourceItem);
export class MultipartReadSetUploadListItem extends S.Class<MultipartReadSetUploadListItem>(
  "MultipartReadSetUploadListItem",
)({
  sequenceStoreId: S.String,
  uploadId: S.String,
  sourceFileType: S.String,
  subjectId: S.String,
  sampleId: S.String,
  generatedFrom: S.String,
  referenceArn: S.String,
  name: S.optional(S.String),
  description: S.optional(S.String),
  tags: S.optional(TagMap),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const MultipartReadSetUploadList = S.Array(
  MultipartReadSetUploadListItem,
);
export class StartReadSetImportJobSourceItem extends S.Class<StartReadSetImportJobSourceItem>(
  "StartReadSetImportJobSourceItem",
)({
  sourceFiles: SourceFiles,
  sourceFileType: S.String,
  subjectId: S.String,
  sampleId: S.String,
  generatedFrom: S.optional(S.String),
  referenceArn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export const StartReadSetImportJobSourceList = S.Array(
  StartReadSetImportJobSourceItem,
);
export class SequenceInformation extends S.Class<SequenceInformation>(
  "SequenceInformation",
)({
  totalReadCount: S.optional(S.Number),
  totalBaseCount: S.optional(S.Number),
  generatedFrom: S.optional(S.String),
  alignment: S.optional(S.String),
}) {}
export class ReadSetS3Access extends S.Class<ReadSetS3Access>(
  "ReadSetS3Access",
)({ s3Uri: S.optional(S.String) }) {}
export class FileInformation extends S.Class<FileInformation>(
  "FileInformation",
)({
  totalParts: S.optional(S.Number),
  partSize: S.optional(S.Number),
  contentLength: S.optional(S.Number),
  s3Access: S.optional(ReadSetS3Access),
}) {}
export class ReadSetFiles extends S.Class<ReadSetFiles>("ReadSetFiles")({
  source1: S.optional(FileInformation),
  source2: S.optional(FileInformation),
  index: S.optional(FileInformation),
}) {}
export class ETag extends S.Class<ETag>("ETag")({
  algorithm: S.optional(S.String),
  source1: S.optional(S.String),
  source2: S.optional(S.String),
}) {}
export class ReadSetBatchError extends S.Class<ReadSetBatchError>(
  "ReadSetBatchError",
)({ id: S.String, code: S.String, message: S.String }) {}
export const ReadSetBatchErrorList = S.Array(ReadSetBatchError);
export class ShareDetails extends S.Class<ShareDetails>("ShareDetails")({
  shareId: S.optional(S.String),
  resourceArn: S.optional(S.String),
  resourceId: S.optional(S.String),
  principalSubscriber: S.optional(S.String),
  ownerId: S.optional(S.String),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  shareName: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const ShareDetailsList = S.Array(ShareDetails);
export class VariantImportItemDetail extends S.Class<VariantImportItemDetail>(
  "VariantImportItemDetail",
)({
  source: S.String,
  jobStatus: S.String,
  statusMessage: S.optional(S.String),
}) {}
export const VariantImportItemDetails = S.Array(VariantImportItemDetail);
export class WorkflowListItem extends S.Class<WorkflowListItem>(
  "WorkflowListItem",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  status: S.optional(S.String),
  type: S.optional(S.String),
  digest: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  metadata: S.optional(WorkflowMetadata),
}) {}
export const WorkflowList = S.Array(WorkflowListItem);
export class WorkflowVersionListItem extends S.Class<WorkflowVersionListItem>(
  "WorkflowVersionListItem",
)({
  arn: S.optional(S.String),
  workflowId: S.optional(S.String),
  versionName: S.optional(S.String),
  description: S.optional(S.String),
  status: S.optional(S.String),
  type: S.optional(S.String),
  digest: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  metadata: S.optional(WorkflowMetadata),
}) {}
export const WorkflowVersionList = S.Array(WorkflowVersionListItem);
export class ReadOptions extends S.Class<ReadOptions>("ReadOptions")({
  sep: S.optional(S.String),
  encoding: S.optional(S.String),
  quote: S.optional(S.String),
  quoteAll: S.optional(S.Boolean),
  escape: S.optional(S.String),
  escapeQuotes: S.optional(S.Boolean),
  comment: S.optional(S.String),
  header: S.optional(S.Boolean),
  lineSep: S.optional(S.String),
}) {}
export class TsvOptions extends S.Class<TsvOptions>("TsvOptions")({
  readOptions: S.optional(ReadOptions),
}) {}
export const FormatOptions = S.Union(
  S.Struct({ tsvOptions: TsvOptions }),
  S.Struct({ vcfOptions: VcfOptions }),
);
export class GetAnnotationImportResponse extends S.Class<GetAnnotationImportResponse>(
  "GetAnnotationImportResponse",
)({
  id: S.String,
  destinationName: S.String,
  versionName: S.String,
  roleArn: S.String,
  status: S.String,
  statusMessage: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  completionTime: S.Date.pipe(T.TimestampFormat("date-time")),
  items: AnnotationImportItemDetails,
  runLeftNormalization: S.Boolean,
  formatOptions: FormatOptions,
  annotationFields: S.optional(AnnotationFieldMap),
}) {}
export class CreateAnnotationStoreVersionRequest extends S.Class<CreateAnnotationStoreVersionRequest>(
  "CreateAnnotationStoreVersionRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    versionName: S.String,
    description: S.optional(S.String),
    versionOptions: S.optional(VersionOptions),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/annotationStore/{name}/version" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAnnotationStoreVersionsResponse extends S.Class<DeleteAnnotationStoreVersionsResponse>(
  "DeleteAnnotationStoreVersionsResponse",
)({ errors: S.optional(VersionDeleteErrorList) }) {}
export class GetReferenceImportJobResponse extends S.Class<GetReferenceImportJobResponse>(
  "GetReferenceImportJobResponse",
)({
  id: S.String,
  referenceStoreId: S.String,
  roleArn: S.String,
  status: S.String,
  statusMessage: S.optional(S.String),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  completionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  sources: ImportReferenceSourceList,
}) {}
export class StartReferenceImportJobResponse extends S.Class<StartReferenceImportJobResponse>(
  "StartReferenceImportJobResponse",
)({
  id: S.String,
  referenceStoreId: S.String,
  roleArn: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListRunCachesResponse extends S.Class<ListRunCachesResponse>(
  "ListRunCachesResponse",
)({ items: S.optional(RunCacheList), nextToken: S.optional(S.String) }) {}
export class ListRunGroupsResponse extends S.Class<ListRunGroupsResponse>(
  "ListRunGroupsResponse",
)({ items: S.optional(RunGroupList), nextToken: S.optional(S.String) }) {}
export class GetRunResponse extends S.Class<GetRunResponse>("GetRunResponse")({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  cacheId: S.optional(S.String),
  cacheBehavior: S.optional(S.String),
  engineVersion: S.optional(S.String),
  status: S.optional(S.String),
  workflowId: S.optional(S.String),
  workflowType: S.optional(S.String),
  runId: S.optional(S.String),
  roleArn: S.optional(S.String),
  name: S.optional(S.String),
  runGroupId: S.optional(S.String),
  priority: S.optional(S.Number),
  definition: S.optional(S.String),
  digest: S.optional(S.String),
  parameters: S.optional(S.Any),
  storageCapacity: S.optional(S.Number),
  outputUri: S.optional(S.String),
  logLevel: S.optional(S.String),
  resourceDigests: S.optional(RunResourceDigests),
  startedBy: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  stopTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  statusMessage: S.optional(S.String),
  tags: S.optional(TagMap),
  accelerators: S.optional(S.String),
  retentionMode: S.optional(S.String),
  failureReason: S.optional(S.String),
  logLocation: S.optional(RunLogLocation),
  uuid: S.optional(S.String),
  runOutputUri: S.optional(S.String),
  storageType: S.optional(S.String),
  workflowOwnerId: S.optional(S.String),
  workflowVersionName: S.optional(S.String),
  workflowUuid: S.optional(S.String),
}) {}
export class ListRunsResponse extends S.Class<ListRunsResponse>(
  "ListRunsResponse",
)({ items: S.optional(RunList), nextToken: S.optional(S.String) }) {}
export class GetRunTaskResponse extends S.Class<GetRunTaskResponse>(
  "GetRunTaskResponse",
)({
  taskId: S.optional(S.String),
  status: S.optional(S.String),
  name: S.optional(S.String),
  cpus: S.optional(S.Number),
  cacheHit: S.optional(S.Boolean),
  cacheS3Uri: S.optional(S.String),
  memory: S.optional(S.Number),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  stopTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  statusMessage: S.optional(S.String),
  logStream: S.optional(S.String),
  gpus: S.optional(S.Number),
  instanceType: S.optional(S.String),
  failureReason: S.optional(S.String),
  imageDetails: S.optional(ImageDetails),
}) {}
export class ListRunTasksResponse extends S.Class<ListRunTasksResponse>(
  "ListRunTasksResponse",
)({ items: S.optional(TaskList), nextToken: S.optional(S.String) }) {}
export class CreateSequenceStoreResponse extends S.Class<CreateSequenceStoreResponse>(
  "CreateSequenceStoreResponse",
)({
  id: S.String,
  arn: S.String,
  name: S.optional(S.String),
  description: S.optional(S.String),
  sseConfig: S.optional(SseConfig),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  fallbackLocation: S.optional(S.String),
  eTagAlgorithmFamily: S.optional(S.String),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  propagatedSetLevelTags: S.optional(PropagatedSetLevelTags),
  s3Access: S.optional(SequenceStoreS3Access),
}) {}
export class GetSequenceStoreResponse extends S.Class<GetSequenceStoreResponse>(
  "GetSequenceStoreResponse",
)({
  id: S.String,
  arn: S.String,
  name: S.optional(S.String),
  description: S.optional(S.String),
  sseConfig: S.optional(SseConfig),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  fallbackLocation: S.optional(S.String),
  s3Access: S.optional(SequenceStoreS3Access),
  eTagAlgorithmFamily: S.optional(S.String),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  propagatedSetLevelTags: S.optional(PropagatedSetLevelTags),
  updateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class CompleteMultipartReadSetUploadResponse extends S.Class<CompleteMultipartReadSetUploadResponse>(
  "CompleteMultipartReadSetUploadResponse",
)({ readSetId: S.String }) {}
export class GetReadSetActivationJobResponse extends S.Class<GetReadSetActivationJobResponse>(
  "GetReadSetActivationJobResponse",
)({
  id: S.String,
  sequenceStoreId: S.String,
  status: S.String,
  statusMessage: S.optional(S.String),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  completionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  sources: S.optional(ActivateReadSetSourceList),
}) {}
export class GetReadSetExportJobResponse extends S.Class<GetReadSetExportJobResponse>(
  "GetReadSetExportJobResponse",
)({
  id: S.String,
  sequenceStoreId: S.String,
  destination: S.String,
  status: S.String,
  statusMessage: S.optional(S.String),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  completionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  readSets: S.optional(ExportReadSetDetailList),
}) {}
export class GetReadSetImportJobResponse extends S.Class<GetReadSetImportJobResponse>(
  "GetReadSetImportJobResponse",
)({
  id: S.String,
  sequenceStoreId: S.String,
  roleArn: S.String,
  status: S.String,
  statusMessage: S.optional(S.String),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  completionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  sources: ImportReadSetSourceList,
}) {}
export class ListMultipartReadSetUploadsResponse extends S.Class<ListMultipartReadSetUploadsResponse>(
  "ListMultipartReadSetUploadsResponse",
)({
  nextToken: S.optional(S.String),
  uploads: S.optional(MultipartReadSetUploadList),
}) {}
export class StartReadSetActivationJobResponse extends S.Class<StartReadSetActivationJobResponse>(
  "StartReadSetActivationJobResponse",
)({
  id: S.String,
  sequenceStoreId: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class StartReadSetExportJobResponse extends S.Class<StartReadSetExportJobResponse>(
  "StartReadSetExportJobResponse",
)({
  id: S.String,
  sequenceStoreId: S.String,
  destination: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class StartReadSetImportJobRequest extends S.Class<StartReadSetImportJobRequest>(
  "StartReadSetImportJobRequest",
)(
  {
    sequenceStoreId: S.String.pipe(T.HttpLabel("sequenceStoreId")),
    roleArn: S.String,
    clientToken: S.optional(S.String),
    sources: StartReadSetImportJobSourceList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/sequencestore/{sequenceStoreId}/importjob",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetReadSetMetadataResponse extends S.Class<GetReadSetMetadataResponse>(
  "GetReadSetMetadataResponse",
)({
  id: S.String,
  arn: S.String,
  sequenceStoreId: S.String,
  subjectId: S.optional(S.String),
  sampleId: S.optional(S.String),
  status: S.String,
  name: S.optional(S.String),
  description: S.optional(S.String),
  fileType: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  sequenceInformation: S.optional(SequenceInformation),
  referenceArn: S.optional(S.String),
  files: S.optional(ReadSetFiles),
  statusMessage: S.optional(S.String),
  creationType: S.optional(S.String),
  etag: S.optional(ETag),
  creationJobId: S.optional(S.String),
}) {}
export class BatchDeleteReadSetResponse extends S.Class<BatchDeleteReadSetResponse>(
  "BatchDeleteReadSetResponse",
)({ errors: S.optional(ReadSetBatchErrorList) }) {}
export class GetShareResponse extends S.Class<GetShareResponse>(
  "GetShareResponse",
)({ share: S.optional(ShareDetails) }) {}
export class ListSharesResponse extends S.Class<ListSharesResponse>(
  "ListSharesResponse",
)({ shares: ShareDetailsList, nextToken: S.optional(S.String) }) {}
export class StartVariantImportResponse extends S.Class<StartVariantImportResponse>(
  "StartVariantImportResponse",
)({ jobId: S.String }) {}
export class GetVariantImportResponse extends S.Class<GetVariantImportResponse>(
  "GetVariantImportResponse",
)({
  id: S.String,
  destinationName: S.String,
  roleArn: S.String,
  status: S.String,
  statusMessage: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  completionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  items: VariantImportItemDetails,
  runLeftNormalization: S.Boolean,
  annotationFields: S.optional(AnnotationFieldMap),
}) {}
export class CreateWorkflowRequest extends S.Class<CreateWorkflowRequest>(
  "CreateWorkflowRequest",
)(
  {
    name: S.optional(S.String),
    description: S.optional(S.String),
    engine: S.optional(S.String),
    definitionZip: S.optional(T.Blob),
    definitionUri: S.optional(S.String),
    main: S.optional(S.String),
    parameterTemplate: S.optional(WorkflowParameterTemplate),
    storageCapacity: S.optional(S.Number),
    tags: S.optional(TagMap),
    requestId: S.String,
    accelerators: S.optional(S.String),
    storageType: S.optional(S.String),
    containerRegistryMap: S.optional(ContainerRegistryMap),
    containerRegistryMapUri: S.optional(S.String),
    readmeMarkdown: S.optional(S.String),
    parameterTemplatePath: S.optional(S.String),
    readmePath: S.optional(S.String),
    definitionRepository: S.optional(DefinitionRepository),
    workflowBucketOwnerId: S.optional(S.String),
    readmeUri: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/workflow" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkflowResponse extends S.Class<GetWorkflowResponse>(
  "GetWorkflowResponse",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  status: S.optional(S.String),
  type: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  engine: S.optional(S.String),
  definition: S.optional(S.String),
  main: S.optional(S.String),
  digest: S.optional(S.String),
  parameterTemplate: S.optional(WorkflowParameterTemplate),
  storageCapacity: S.optional(S.Number),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  statusMessage: S.optional(S.String),
  tags: S.optional(TagMap),
  metadata: S.optional(WorkflowMetadata),
  accelerators: S.optional(S.String),
  storageType: S.optional(S.String),
  uuid: S.optional(S.String),
  containerRegistryMap: S.optional(ContainerRegistryMap),
  readme: S.optional(S.String),
  definitionRepositoryDetails: S.optional(DefinitionRepositoryDetails),
  readmePath: S.optional(S.String),
}) {}
export class ListWorkflowsResponse extends S.Class<ListWorkflowsResponse>(
  "ListWorkflowsResponse",
)({ items: S.optional(WorkflowList), nextToken: S.optional(S.String) }) {}
export class ListWorkflowVersionsResponse extends S.Class<ListWorkflowVersionsResponse>(
  "ListWorkflowVersionsResponse",
)({
  items: S.optional(WorkflowVersionList),
  nextToken: S.optional(S.String),
}) {}
export class AnnotationImportJobItem extends S.Class<AnnotationImportJobItem>(
  "AnnotationImportJobItem",
)({
  id: S.String,
  destinationName: S.String,
  versionName: S.String,
  roleArn: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  completionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  runLeftNormalization: S.optional(S.Boolean),
  annotationFields: S.optional(AnnotationFieldMap),
}) {}
export const AnnotationImportJobItems = S.Array(AnnotationImportJobItem);
export class AnnotationStoreItem extends S.Class<AnnotationStoreItem>(
  "AnnotationStoreItem",
)({
  id: S.String,
  reference: ReferenceItem,
  status: S.String,
  storeArn: S.String,
  name: S.String,
  storeFormat: S.String,
  description: S.String,
  sseConfig: SseConfig,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  statusMessage: S.String,
  storeSizeBytes: S.Number,
}) {}
export const AnnotationStoreItems = S.Array(AnnotationStoreItem);
export class AnnotationStoreVersionItem extends S.Class<AnnotationStoreVersionItem>(
  "AnnotationStoreVersionItem",
)({
  storeId: S.String,
  id: S.String,
  status: S.String,
  versionArn: S.String,
  name: S.String,
  versionName: S.String,
  description: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  statusMessage: S.String,
  versionSizeBytes: S.Number,
}) {}
export const AnnotationStoreVersionItems = S.Array(AnnotationStoreVersionItem);
export class ReferenceStoreDetail extends S.Class<ReferenceStoreDetail>(
  "ReferenceStoreDetail",
)({
  arn: S.String,
  id: S.String,
  name: S.optional(S.String),
  description: S.optional(S.String),
  sseConfig: S.optional(SseConfig),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const ReferenceStoreDetailList = S.Array(ReferenceStoreDetail);
export class ImportReferenceJobItem extends S.Class<ImportReferenceJobItem>(
  "ImportReferenceJobItem",
)({
  id: S.String,
  referenceStoreId: S.String,
  roleArn: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  completionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const ImportReferenceJobList = S.Array(ImportReferenceJobItem);
export class ReferenceListItem extends S.Class<ReferenceListItem>(
  "ReferenceListItem",
)({
  id: S.String,
  arn: S.String,
  referenceStoreId: S.String,
  md5: S.String,
  status: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const ReferenceList = S.Array(ReferenceListItem);
export class SequenceStoreDetail extends S.Class<SequenceStoreDetail>(
  "SequenceStoreDetail",
)({
  arn: S.String,
  id: S.String,
  name: S.optional(S.String),
  description: S.optional(S.String),
  sseConfig: S.optional(SseConfig),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  fallbackLocation: S.optional(S.String),
  eTagAlgorithmFamily: S.optional(S.String),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  updateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const SequenceStoreDetailList = S.Array(SequenceStoreDetail);
export class ActivateReadSetJobItem extends S.Class<ActivateReadSetJobItem>(
  "ActivateReadSetJobItem",
)({
  id: S.String,
  sequenceStoreId: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  completionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const ActivateReadSetJobList = S.Array(ActivateReadSetJobItem);
export class ExportReadSetJobDetail extends S.Class<ExportReadSetJobDetail>(
  "ExportReadSetJobDetail",
)({
  id: S.String,
  sequenceStoreId: S.String,
  destination: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  completionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const ExportReadSetJobDetailList = S.Array(ExportReadSetJobDetail);
export class ImportReadSetJobItem extends S.Class<ImportReadSetJobItem>(
  "ImportReadSetJobItem",
)({
  id: S.String,
  sequenceStoreId: S.String,
  roleArn: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  completionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const ImportReadSetJobList = S.Array(ImportReadSetJobItem);
export class ReadSetUploadPartListItem extends S.Class<ReadSetUploadPartListItem>(
  "ReadSetUploadPartListItem",
)({
  partNumber: S.Number,
  partSize: S.Number,
  partSource: S.String,
  checksum: S.String,
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const ReadSetUploadPartList = S.Array(ReadSetUploadPartListItem);
export class ReadSetListItem extends S.Class<ReadSetListItem>(
  "ReadSetListItem",
)({
  id: S.String,
  arn: S.String,
  sequenceStoreId: S.String,
  subjectId: S.optional(S.String),
  sampleId: S.optional(S.String),
  status: S.String,
  name: S.optional(S.String),
  description: S.optional(S.String),
  referenceArn: S.optional(S.String),
  fileType: S.String,
  sequenceInformation: S.optional(SequenceInformation),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  statusMessage: S.optional(S.String),
  creationType: S.optional(S.String),
  etag: S.optional(ETag),
}) {}
export const ReadSetList = S.Array(ReadSetListItem);
export class VariantImportJobItem extends S.Class<VariantImportJobItem>(
  "VariantImportJobItem",
)({
  id: S.String,
  destinationName: S.String,
  roleArn: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  completionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  runLeftNormalization: S.optional(S.Boolean),
  annotationFields: S.optional(AnnotationFieldMap),
}) {}
export const VariantImportJobItems = S.Array(VariantImportJobItem);
export class VariantStoreItem extends S.Class<VariantStoreItem>(
  "VariantStoreItem",
)({
  id: S.String,
  reference: ReferenceItem,
  status: S.String,
  storeArn: S.String,
  name: S.String,
  description: S.String,
  sseConfig: SseConfig,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  statusMessage: S.String,
  storeSizeBytes: S.Number,
}) {}
export const VariantStoreItems = S.Array(VariantStoreItem);
export class StartAnnotationImportRequest extends S.Class<StartAnnotationImportRequest>(
  "StartAnnotationImportRequest",
)(
  {
    destinationName: S.String,
    roleArn: S.String,
    items: AnnotationImportItemSources,
    versionName: S.optional(S.String),
    formatOptions: S.optional(FormatOptions),
    runLeftNormalization: S.optional(S.Boolean),
    annotationFields: S.optional(AnnotationFieldMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/import/annotation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAnnotationImportJobsResponse extends S.Class<ListAnnotationImportJobsResponse>(
  "ListAnnotationImportJobsResponse",
)({
  annotationImportJobs: S.optional(AnnotationImportJobItems),
  nextToken: S.optional(S.String),
}) {}
export class CreateAnnotationStoreRequest extends S.Class<CreateAnnotationStoreRequest>(
  "CreateAnnotationStoreRequest",
)(
  {
    reference: S.optional(ReferenceItem),
    name: S.optional(S.String),
    description: S.optional(S.String),
    tags: S.optional(TagMap),
    versionName: S.optional(S.String),
    sseConfig: S.optional(SseConfig),
    storeFormat: S.String,
    storeOptions: S.optional(StoreOptions),
  },
  T.all(
    T.Http({ method: "POST", uri: "/annotationStore" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAnnotationStoresResponse extends S.Class<ListAnnotationStoresResponse>(
  "ListAnnotationStoresResponse",
)({
  annotationStores: S.optional(AnnotationStoreItems),
  nextToken: S.optional(S.String),
}) {}
export class CreateAnnotationStoreVersionResponse extends S.Class<CreateAnnotationStoreVersionResponse>(
  "CreateAnnotationStoreVersionResponse",
)({
  id: S.String,
  versionName: S.String,
  storeId: S.String,
  versionOptions: S.optional(VersionOptions),
  name: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListAnnotationStoreVersionsResponse extends S.Class<ListAnnotationStoreVersionsResponse>(
  "ListAnnotationStoreVersionsResponse",
)({
  annotationStoreVersions: S.optional(AnnotationStoreVersionItems),
  nextToken: S.optional(S.String),
}) {}
export class ListReferenceStoresResponse extends S.Class<ListReferenceStoresResponse>(
  "ListReferenceStoresResponse",
)({
  nextToken: S.optional(S.String),
  referenceStores: ReferenceStoreDetailList,
}) {}
export class ListReferenceImportJobsResponse extends S.Class<ListReferenceImportJobsResponse>(
  "ListReferenceImportJobsResponse",
)({
  nextToken: S.optional(S.String),
  importJobs: S.optional(ImportReferenceJobList),
}) {}
export class ListReferencesResponse extends S.Class<ListReferencesResponse>(
  "ListReferencesResponse",
)({ nextToken: S.optional(S.String), references: ReferenceList }) {}
export class ListSequenceStoresResponse extends S.Class<ListSequenceStoresResponse>(
  "ListSequenceStoresResponse",
)({
  nextToken: S.optional(S.String),
  sequenceStores: SequenceStoreDetailList,
}) {}
export class ListReadSetActivationJobsResponse extends S.Class<ListReadSetActivationJobsResponse>(
  "ListReadSetActivationJobsResponse",
)({
  nextToken: S.optional(S.String),
  activationJobs: S.optional(ActivateReadSetJobList),
}) {}
export class ListReadSetExportJobsResponse extends S.Class<ListReadSetExportJobsResponse>(
  "ListReadSetExportJobsResponse",
)({
  nextToken: S.optional(S.String),
  exportJobs: S.optional(ExportReadSetJobDetailList),
}) {}
export class ListReadSetImportJobsResponse extends S.Class<ListReadSetImportJobsResponse>(
  "ListReadSetImportJobsResponse",
)({
  nextToken: S.optional(S.String),
  importJobs: S.optional(ImportReadSetJobList),
}) {}
export class ListReadSetUploadPartsResponse extends S.Class<ListReadSetUploadPartsResponse>(
  "ListReadSetUploadPartsResponse",
)({
  nextToken: S.optional(S.String),
  parts: S.optional(ReadSetUploadPartList),
}) {}
export class StartReadSetImportJobResponse extends S.Class<StartReadSetImportJobResponse>(
  "StartReadSetImportJobResponse",
)({
  id: S.String,
  sequenceStoreId: S.String,
  roleArn: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListReadSetsResponse extends S.Class<ListReadSetsResponse>(
  "ListReadSetsResponse",
)({ nextToken: S.optional(S.String), readSets: ReadSetList }) {}
export class ListVariantImportJobsResponse extends S.Class<ListVariantImportJobsResponse>(
  "ListVariantImportJobsResponse",
)({
  variantImportJobs: S.optional(VariantImportJobItems),
  nextToken: S.optional(S.String),
}) {}
export class ListVariantStoresResponse extends S.Class<ListVariantStoresResponse>(
  "ListVariantStoresResponse",
)({
  variantStores: S.optional(VariantStoreItems),
  nextToken: S.optional(S.String),
}) {}
export class CreateWorkflowResponse extends S.Class<CreateWorkflowResponse>(
  "CreateWorkflowResponse",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  status: S.optional(S.String),
  tags: S.optional(TagMap),
  uuid: S.optional(S.String),
}) {}
export class ReferenceFiles extends S.Class<ReferenceFiles>("ReferenceFiles")({
  source: S.optional(FileInformation),
  index: S.optional(FileInformation),
}) {}
export class StartAnnotationImportResponse extends S.Class<StartAnnotationImportResponse>(
  "StartAnnotationImportResponse",
)({ jobId: S.String }) {}
export class CreateAnnotationStoreResponse extends S.Class<CreateAnnotationStoreResponse>(
  "CreateAnnotationStoreResponse",
)({
  id: S.String,
  reference: S.optional(ReferenceItem),
  storeFormat: S.optional(S.String),
  storeOptions: S.optional(StoreOptions),
  status: S.String,
  name: S.String,
  versionName: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class GetReferenceMetadataResponse extends S.Class<GetReferenceMetadataResponse>(
  "GetReferenceMetadataResponse",
)({
  id: S.String,
  arn: S.String,
  referenceStoreId: S.String,
  md5: S.String,
  status: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  files: S.optional(ReferenceFiles),
  creationType: S.optional(S.String),
  creationJobId: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
) {}
export class NotSupportedOperationException extends S.TaggedError<NotSupportedOperationException>()(
  "NotSupportedOperationException",
  { message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
) {}
export class RequestTimeoutException extends S.TaggedError<RequestTimeoutException>()(
  "RequestTimeoutException",
  { message: S.String },
) {}
export class RangeNotSatisfiableException extends S.TaggedError<RangeNotSatisfiableException>()(
  "RangeNotSatisfiableException",
  { message: S.String },
  T.Retryable(),
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
) {}

//# Operations
/**
 * Amazon Web Services HealthOmics variant stores and annotation stores will no longer be open to new customers starting November 7, 2025. If you would like to use variant stores or annotation stores, sign up prior to that date. Existing customers can continue to use the service as normal. For more information, see Amazon Web Services HealthOmics variant store and annotation store availability change.
 *
 * Gets information about an annotation import job.
 */
export const getAnnotationImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAnnotationImportRequest,
    output: GetAnnotationImportResponse,
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
 * Creates a new version of an annotation store.
 */
export const createAnnotationStoreVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateAnnotationStoreVersionRequest,
    output: CreateAnnotationStoreVersionResponse,
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
 * Retrieves metadata for a reference genome. This operation returns the number of parts, part size, and MD5 of an entire file. This operation does not return tags. To retrieve the list of tags for a read set, use the `ListTagsForResource` API operation.
 */
export const getReferenceMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetReferenceMetadataRequest,
    output: GetReferenceMetadataResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Amazon Web Services HealthOmics variant stores and annotation stores will no longer be open to new customers starting November 7, 2025. If you would like to use variant stores or annotation stores, sign up prior to that date. Existing customers can continue to use the service as normal. For more information, see Amazon Web Services HealthOmics variant store and annotation store availability change.
 *
 * Retrieves a list of annotation import jobs.
 */
export const listAnnotationImportJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAnnotationImportJobsRequest,
    output: ListAnnotationImportJobsResponse,
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
      items: "annotationImportJobs",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Amazon Web Services HealthOmics variant stores and annotation stores will no longer be open to new customers starting November 7, 2025. If you would like to use variant stores or annotation stores, sign up prior to that date. Existing customers can continue to use the service as normal. For more information, see Amazon Web Services HealthOmics variant store and annotation store availability change.
 *
 * Retrieves a list of annotation stores.
 */
export const listAnnotationStores =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAnnotationStoresRequest,
    output: ListAnnotationStoresResponse,
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
      items: "annotationStores",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists the versions of an annotation store.
 */
export const listAnnotationStoreVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAnnotationStoreVersionsRequest,
    output: ListAnnotationStoreVersionsResponse,
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
      items: "annotationStoreVersions",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Monitors the status of a reference import job. This operation can be called after calling the `StartReferenceImportJob` operation.
 */
export const getReferenceImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetReferenceImportJobRequest,
    output: GetReferenceImportJobResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the metadata of one or more reference import jobs for a reference store.
 */
export const listReferenceImportJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListReferenceImportJobsRequest,
    output: ListReferenceImportJobsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "importJobs",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves the metadata of one or more reference genomes in a reference store.
 *
 * For more information, see Creating a reference store in the *Amazon Web Services HealthOmics User Guide*.
 */
export const listReferences = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListReferencesRequest,
    output: ListReferencesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "references",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Retrieves a list of sequence stores and returns each sequence store's metadata.
 *
 * For more information, see Creating a HealthOmics sequence store in the *Amazon Web Services HealthOmics User Guide*.
 */
export const listSequenceStores = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSequenceStoresRequest,
    output: ListSequenceStoresResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      RequestTimeoutException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "sequenceStores",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Retrieves a list of read set activation jobs and returns the metadata in a JSON formatted output. To extract metadata from a read set activation job, use the `GetReadSetActivationJob` API operation.
 */
export const listReadSetActivationJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListReadSetActivationJobsRequest,
    output: ListReadSetActivationJobsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "activationJobs",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves a list of read set export jobs in a JSON formatted response. This API operation is used to check the status of a read set export job initiated by the `StartReadSetExportJob` API operation.
 */
export const listReadSetExportJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListReadSetExportJobsRequest,
    output: ListReadSetExportJobsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "exportJobs",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves a list of read set import jobs and returns the data in JSON format.
 */
export const listReadSetImportJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListReadSetImportJobsRequest,
    output: ListReadSetImportJobsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "importJobs",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves a list of read sets from a sequence store ID and returns the metadata in JSON format.
 */
export const listReadSets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListReadSetsRequest,
    output: ListReadSetsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "readSets",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Amazon Web Services HealthOmics variant stores and annotation stores will no longer be open to new customers starting November 7, 2025. If you would like to use variant stores or annotation stores, sign up prior to that date. Existing customers can continue to use the service as normal. For more information, see Amazon Web Services HealthOmics variant store and annotation store availability change.
 *
 * Retrieves a list of variant import jobs.
 */
export const listVariantImportJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListVariantImportJobsRequest,
    output: ListVariantImportJobsResponse,
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
      items: "variantImportJobs",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Amazon Web Services HealthOmics variant stores and annotation stores will no longer be open to new customers starting November 7, 2025. If you would like to use variant stores or annotation stores, sign up prior to that date. Existing customers can continue to use the service as normal. For more information, see Amazon Web Services HealthOmics variant store and annotation store availability change.
 *
 * Retrieves a list of variant stores.
 */
export const listVariantStores = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListVariantStoresRequest,
    output: ListVariantStoresResponse,
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
      items: "variantStores",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Downloads parts of data from a reference genome and returns the reference file in the same format that it was uploaded.
 *
 * For more information, see Creating a HealthOmics reference store in the *Amazon Web Services HealthOmics User Guide*.
 */
export const getReference = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReferenceRequest,
  output: GetReferenceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    RangeNotSatisfiableException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds an access policy to the specified store.
 */
export const putS3AccessPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutS3AccessPolicyRequest,
  output: PutS3AccessPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    NotSupportedOperationException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Amazon Web Services HealthOmics variant stores and annotation stores will no longer be open to new customers starting November 7, 2025. If you would like to use variant stores or annotation stores, sign up prior to that date. Existing customers can continue to use the service as normal. For more information, see Amazon Web Services HealthOmics variant store and annotation store availability change.
 *
 * Deletes an annotation store.
 */
export const deleteAnnotationStore = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAnnotationStoreRequest,
    output: DeleteAnnotationStoreResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes one or multiple versions of an annotation store.
 */
export const deleteAnnotationStoreVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteAnnotationStoreVersionsRequest,
    output: DeleteAnnotationStoreVersionsResponse,
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
 * Amazon Web Services HealthOmics variant stores and annotation stores will no longer be open to new customers starting November 7, 2025. If you would like to use variant stores or annotation stores, sign up prior to that date. Existing customers can continue to use the service as normal. For more information, see Amazon Web Services HealthOmics variant store and annotation store availability change.
 *
 * Gets information about a variant import job.
 */
export const getVariantImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVariantImportRequest,
  output: GetVariantImportResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Amazon Web Services HealthOmics variant stores and annotation stores will no longer be open to new customers starting November 7, 2025. If you would like to use variant stores or annotation stores, sign up prior to that date. Existing customers can continue to use the service as normal. For more information, see Amazon Web Services HealthOmics variant store and annotation store availability change.
 *
 * Gets information about an annotation store.
 */
export const getAnnotationStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAnnotationStoreRequest,
  output: GetAnnotationStoreResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Amazon Web Services HealthOmics variant stores and annotation stores will no longer be open to new customers starting November 7, 2025. If you would like to use variant stores or annotation stores, sign up prior to that date. Existing customers can continue to use the service as normal. For more information, see Amazon Web Services HealthOmics variant store and annotation store availability change.
 *
 * Updates an annotation store.
 */
export const updateAnnotationStore = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAnnotationStoreRequest,
    output: UpdateAnnotationStoreResponse,
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
 * Retrieves the metadata for an annotation store version.
 */
export const getAnnotationStoreVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAnnotationStoreVersionRequest,
    output: GetAnnotationStoreVersionResponse,
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
 * Updates the description of an annotation store version.
 */
export const updateAnnotationStoreVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateAnnotationStoreVersionRequest,
    output: UpdateAnnotationStoreVersionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Amazon Web Services HealthOmics variant stores and annotation stores will no longer be open to new customers starting November 7, 2025. If you would like to use variant stores or annotation stores, sign up prior to that date. Existing customers can continue to use the service as normal. For more information, see Amazon Web Services HealthOmics variant store and annotation store availability change.
 *
 * Gets information about a variant store.
 */
export const getVariantStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVariantStoreRequest,
  output: GetVariantStoreResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Amazon Web Services HealthOmics variant stores and annotation stores will no longer be open to new customers starting November 7, 2025. If you would like to use variant stores or annotation stores, sign up prior to that date. Existing customers can continue to use the service as normal. For more information, see Amazon Web Services HealthOmics variant store and annotation store availability change.
 *
 * Updates a variant store.
 */
export const updateVariantStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVariantStoreRequest,
  output: UpdateVariantStoreResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Amazon Web Services HealthOmics variant stores and annotation stores will no longer be open to new customers starting November 7, 2025. If you would like to use variant stores or annotation stores, sign up prior to that date. Existing customers can continue to use the service as normal. For more information, see Amazon Web Services HealthOmics variant store and annotation store availability change.
 *
 * Cancels an annotation import job.
 */
export const cancelAnnotationImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelAnnotationImportRequest,
    output: CancelAnnotationImportResponse,
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
 * Amazon Web Services HealthOmics variant stores and annotation stores will no longer be open to new customers starting November 7, 2025. If you would like to use variant stores or annotation stores, sign up prior to that date. Existing customers can continue to use the service as normal. For more information, see Amazon Web Services HealthOmics variant store and annotation store availability change.
 *
 * Cancels a variant import job.
 */
export const cancelVariantImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelVariantImportRequest,
    output: CancelVariantImportResponse,
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
 * Amazon Web Services HealthOmics variant stores and annotation stores will no longer be open to new customers starting November 7, 2025. If you would like to use variant stores or annotation stores, sign up prior to that date. Existing customers can continue to use the service as normal. For more information, see Amazon Web Services HealthOmics variant store and annotation store availability change.
 *
 * Deletes a variant store.
 */
export const deleteVariantStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVariantStoreRequest,
  output: DeleteVariantStoreResponse,
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
 * Retrieves metadata for a sequence store using its ID and returns it in JSON format.
 */
export const getSequenceStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSequenceStoreRequest,
  output: GetSequenceStoreResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns detailed information about the status of a read set activation job in JSON format.
 */
export const getReadSetActivationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetReadSetActivationJobRequest,
    output: GetReadSetActivationJobResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves status information about a read set export job and returns the data in JSON format. Use this operation to actively monitor the progress of an export job.
 */
export const getReadSetExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReadSetExportJobRequest,
  output: GetReadSetExportJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets detailed and status information about a read set import job and returns the data in JSON format.
 */
export const getReadSetImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReadSetImportJobRequest,
  output: GetReadSetImportJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the metadata for a read set from a sequence store in JSON format. This operation does not return tags. To retrieve the list of tags for a read set, use the `ListTagsForResource` API operation.
 */
export const getReadSetMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReadSetMetadataRequest,
  output: GetReadSetMetadataResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes one or more read sets. If the operation is successful, it returns a response with no body. If there is an error with deleting one of the read sets, the operation returns an error list. If the operation successfully deletes only a subset of files, it will return an error list for the remaining files that fail to be deleted. There is a limit of 100 read sets that can be deleted in each `BatchDeleteReadSet` API call.
 */
export const batchDeleteReadSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteReadSetRequest,
  output: BatchDeleteReadSetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a reference store.
 */
export const getReferenceStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReferenceStoreRequest,
  output: GetReferenceStoreResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update one or more parameters for the sequence store.
 */
export const updateSequenceStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSequenceStoreRequest,
  output: UpdateSequenceStoreResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a reference store and returns a response with no body if the operation is successful. You can only delete a reference store when it does not contain any reference genomes. To empty a reference store, use `DeleteReference`.
 *
 * For more information about your workflow status, see Deleting HealthOmics reference and sequence stores in the *Amazon Web Services HealthOmics User Guide*.
 */
export const deleteReferenceStore = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteReferenceStoreRequest,
    output: DeleteReferenceStoreResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a reference genome and returns a response with no body if the operation is successful. The read set associated with the reference genome must first be deleted before deleting the reference genome. After the reference genome is deleted, you can delete the reference store using the `DeleteReferenceStore` API operation.
 *
 * For more information, see Deleting HealthOmics reference and sequence stores in the *Amazon Web Services HealthOmics User Guide*.
 */
export const deleteReference = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReferenceRequest,
  output: DeleteReferenceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a sequence store and returns a response with no body if the operation is successful. You can only delete a sequence store when it does not contain any read sets.
 *
 * Use the `BatchDeleteReadSet` API operation to ensure that all read sets in the sequence store are deleted. When a sequence store is deleted, all tags associated with the store are also deleted.
 *
 * For more information, see Deleting HealthOmics reference and sequence stores in the *Amazon Web Services HealthOmics User Guide*.
 */
export const deleteSequenceStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSequenceStoreRequest,
  output: DeleteSequenceStoreResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an access policy for the specified store.
 */
export const deleteS3AccessPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteS3AccessPolicyRequest,
    output: DeleteS3AccessPolicyResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      NotSupportedOperationException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves a list of reference stores linked to your account and returns their metadata in JSON format.
 *
 * For more information, see Creating a reference store in the *Amazon Web Services HealthOmics User Guide*.
 */
export const listReferenceStores =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListReferenceStoresRequest,
    output: ListReferenceStoresResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      RequestTimeoutException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "referenceStores",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves detailed information from parts of a read set and returns the read set in the same format that it was uploaded. You must have read sets uploaded to your sequence store in order to run this operation.
 */
export const getReadSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReadSetRequest,
  output: GetReadSetResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RangeNotSatisfiableException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all parts in a multipart read set upload for a sequence store and returns the metadata in a JSON formatted output.
 */
export const listReadSetUploadParts =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListReadSetUploadPartsRequest,
    output: ListReadSetUploadPartsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      NotSupportedOperationException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "parts",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Imports a read set from the sequence store. Read set import jobs support a maximum of 100 read sets of different types. Monitor the progress of your read set import job by calling the `GetReadSetImportJob` API operation.
 */
export const startReadSetImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartReadSetImportJobRequest,
    output: StartReadSetImportJobResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a private workflow. Before you create a private workflow, you must create and configure these required resources:
 *
 * - *Workflow definition file:* A workflow definition file written in WDL, Nextflow, or CWL. The workflow definition specifies the inputs and outputs for runs that use the workflow. It also includes specifications for the runs and run tasks for your workflow, including compute and memory requirements. The workflow definition file must be in `.zip` format. For more information, see Workflow definition files in Amazon Web Services HealthOmics.
 *
 * - You can use Amazon Q CLI to build and validate your workflow definition files in WDL, Nextflow, and CWL. For more information, see Example prompts for Amazon Q CLI and the Amazon Web Services HealthOmics Agentic generative AI tutorial on GitHub.
 *
 * - *(Optional) Parameter template file:* A parameter template file written in JSON. Create the file to define the run parameters, or Amazon Web Services HealthOmics generates the parameter template for you. For more information, see Parameter template files for HealthOmics workflows.
 *
 * - *ECR container images:* Create container images for the workflow in a private ECR repository, or synchronize images from a supported upstream registry with your Amazon ECR private repository.
 *
 * - *(Optional) Sentieon licenses:* Request a Sentieon license to use the Sentieon software in private workflows.
 *
 * For more information, see Creating or updating a private workflow in Amazon Web Services HealthOmics in the *Amazon Web Services HealthOmics User Guide*.
 */
export const createWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkflowRequest,
  output: CreateWorkflowResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Completes a multipart read set upload into a sequence store after you have initiated the upload process with `CreateMultipartReadSetUpload` and uploaded all read set parts using `UploadReadSetPart`. You must specify the parts you uploaded using the parts parameter. If the operation is successful, it returns the read set ID(s) of the uploaded read set(s).
 *
 * For more information, see Direct upload to a sequence store in the *Amazon Web Services HealthOmics User Guide*.
 */
export const completeMultipartReadSetUpload =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CompleteMultipartReadSetUploadRequest,
    output: CompleteMultipartReadSetUploadResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      NotSupportedOperationException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists in-progress multipart read set uploads for a sequence store and returns it in a JSON formatted output. Multipart read set uploads are initiated by the `CreateMultipartReadSetUploads` API operation. This operation returns a response with no body when the upload is complete.
 */
export const listMultipartReadSetUploads =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListMultipartReadSetUploadsRequest,
    output: ListMultipartReadSetUploadsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      NotSupportedOperationException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "uploads",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves details about an access policy on a given store.
 */
export const getS3AccessPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetS3AccessPolicyRequest,
  output: GetS3AccessPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    NotSupportedOperationException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Initiates a multipart read set upload for uploading partitioned source files into a sequence store. You can directly import source files from an EC2 instance and other local compute, or from an S3 bucket. To separate these source files into parts, use the `split` operation. Each part cannot be larger than 100 MB. If the operation is successful, it provides an `uploadId` which is required by the `UploadReadSetPart` API operation to upload parts into a sequence store.
 *
 * To continue uploading a multipart read set into your sequence store, you must use the `UploadReadSetPart` API operation to upload each part individually following the steps below:
 *
 * - Specify the `uploadId` obtained from the previous call to `CreateMultipartReadSetUpload`.
 *
 * - Upload parts for that `uploadId`.
 *
 * When you have finished uploading parts, use the `CompleteMultipartReadSetUpload` API to complete the multipart read set upload and to retrieve the final read set IDs in the response.
 *
 * To learn more about creating parts and the `split` operation, see Direct upload to a sequence store in the *Amazon Web Services HealthOmics User Guide*.
 */
export const createMultipartReadSetUpload =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateMultipartReadSetUploadRequest,
    output: CreateMultipartReadSetUploadResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      NotSupportedOperationException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Uploads a specific part of a read set into a sequence store. When you a upload a read set part with a part number that already exists, the new part replaces the existing one. This operation returns a JSON formatted response containing a string identifier that is used to confirm that parts are being added to the intended upload.
 *
 * For more information, see Direct upload to a sequence store in the *Amazon Web Services HealthOmics User Guide*.
 */
export const uploadReadSetPart = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UploadReadSetPartRequest,
  output: UploadReadSetPartResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    NotSupportedOperationException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stops a multipart read set upload into a sequence store and returns a response with no body if the operation is successful. To confirm that a multipart read set upload has been stopped, use the `ListMultipartReadSetUploads` API operation to view all active multipart read set uploads.
 */
export const abortMultipartReadSetUpload = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AbortMultipartReadSetUploadRequest,
    output: AbortMultipartReadSetUploadResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      NotSupportedOperationException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the metadata for the specified resource share.
 */
export const getShare = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetShareRequest,
  output: GetShareResponse,
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
 * Retrieves the resource shares associated with an account. Use the filter parameter to retrieve a specific subset of the shares.
 */
export const listShares = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSharesRequest,
  output: ListSharesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "shares",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Amazon Web Services HealthOmics variant stores and annotation stores will no longer be open to new customers starting November 7, 2025. If you would like to use variant stores or annotation stores, sign up prior to that date. Existing customers can continue to use the service as normal. For more information, see Amazon Web Services HealthOmics variant store and annotation store availability change.
 *
 * Starts a variant import job.
 */
export const startVariantImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartVariantImportRequest,
    output: StartVariantImportResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a cross-account shared resource. The resource owner makes an offer to share the resource with the principal subscriber (an AWS user with a different account than the resource owner).
 *
 * The following resources support cross-account sharing:
 *
 * - HealthOmics variant stores
 *
 * - HealthOmics annotation stores
 *
 * - Private workflows
 */
export const createShare = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateShareRequest,
  output: CreateShareResponse,
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
 * Accept a resource share request.
 */
export const acceptShare = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptShareRequest,
  output: AcceptShareResponse,
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
 * Deletes a resource share. If you are the resource owner, the subscriber will no longer have access to the shared resource. If you are the subscriber, this operation deletes your access to the share.
 */
export const deleteShare = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteShareRequest,
  output: DeleteShareResponse,
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
 * Amazon Web Services HealthOmics variant stores and annotation stores will no longer be open to new customers starting November 7, 2025. If you would like to use variant stores or annotation stores, sign up prior to that date. Existing customers can continue to use the service as normal. For more information, see Amazon Web Services HealthOmics variant store and annotation store availability change.
 *
 * Creates a variant store.
 */
export const createVariantStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVariantStoreRequest,
  output: CreateVariantStoreResponse,
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
 * Imports a reference genome from Amazon S3 into a specified reference store. You can have multiple reference genomes in a reference store. You can only import reference genomes one at a time into each reference store. Monitor the status of your reference import job by using the `GetReferenceImportJob` API operation.
 */
export const startReferenceImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartReferenceImportJobRequest,
    output: StartReferenceImportJobResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves a list of your run caches and the metadata for each cache.
 */
export const listRunCaches = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListRunCachesRequest,
    output: ListRunCachesResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "startingToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Retrieves a list of all run groups and returns the metadata for each run group.
 */
export const listRunGroups = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListRunGroupsRequest,
    output: ListRunGroupsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "startingToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Gets detailed information about a specific run using its ID.
 *
 * Amazon Web Services HealthOmics stores a configurable number of runs, as determined by service limits, that are available to the console and API. If `GetRun` does not return the requested run, you can find all run logs in the CloudWatch logs. For more information about viewing the run logs, see CloudWatch logs in the *Amazon Web Services HealthOmics User Guide*.
 */
export const getRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRunRequest,
  output: GetRunResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of runs and returns each run's metadata and status.
 *
 * Amazon Web Services HealthOmics stores a configurable number of runs, as determined by service limits, that are available to the console and API. If the `ListRuns` response doesn't include specific runs that you expected, you can find all run logs in the CloudWatch logs. For more information about viewing the run logs, see CloudWatch logs in the *Amazon Web Services HealthOmics User Guide*.
 */
export const listRuns = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRunsRequest,
  output: ListRunsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "startingToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets detailed information about a run task using its ID.
 */
export const getRunTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRunTaskRequest,
  output: GetRunTaskResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of tasks and status information within their specified run. Use this operation to monitor runs and to identify which specific tasks have failed.
 */
export const listRunTasks = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListRunTasksRequest,
    output: ListRunTasksResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "startingToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Creates a sequence store and returns its metadata. Sequence stores are used to store sequence data files called read sets that are saved in FASTQ, BAM, uBAM, or CRAM formats. For aligned formats (BAM and CRAM), a sequence store can only use one reference genome. For unaligned formats (FASTQ and uBAM), a reference genome is not required. You can create multiple sequence stores per region per account.
 *
 * The following are optional parameters you can specify for your sequence store:
 *
 * - Use `s3AccessConfig` to configure your sequence store with S3 access logs (recommended).
 *
 * - Use `sseConfig` to define your own KMS key for encryption.
 *
 * - Use `eTagAlgorithmFamily` to define which algorithm to use for the HealthOmics eTag on objects.
 *
 * - Use `fallbackLocation` to define a backup location for storing files that have failed a direct upload.
 *
 * - Use `propagatedSetLevelTags` to configure tags that propagate to all objects in your store.
 *
 * For more information, see Creating a HealthOmics sequence store in the *Amazon Web Services HealthOmics User Guide*.
 */
export const createSequenceStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSequenceStoreRequest,
  output: CreateSequenceStoreResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    RequestTimeoutException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Activates an archived read set and returns its metadata in a JSON formatted output. AWS HealthOmics automatically archives unused read sets after 30 days. To monitor the status of your read set activation job, use the `GetReadSetActivationJob` operation.
 *
 * To learn more, see Activating read sets in the *Amazon Web Services HealthOmics User Guide*.
 */
export const startReadSetActivationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartReadSetActivationJobRequest,
    output: StartReadSetActivationJobResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Starts a read set export job. When the export job is finished, the read set is exported to an Amazon S3 bucket which can be retrieved using the `GetReadSetExportJob` API operation.
 *
 * To monitor the status of the export job, use the `ListReadSetExportJobs` API operation.
 */
export const startReadSetExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartReadSetExportJobRequest,
    output: StartReadSetExportJobResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets all information about a workflow using its ID.
 *
 * If a workflow is shared with you, you cannot export the workflow.
 *
 * For more information about your workflow status, see Verify the workflow status in the *Amazon Web Services HealthOmics User Guide*.
 */
export const getWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkflowRequest,
  output: GetWorkflowResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of existing workflows. You can filter for specific workflows by their name and type. Using the type parameter, specify `PRIVATE` to retrieve a list of private workflows or specify `READY2RUN` for a list of all Ready2Run workflows. If you do not specify the type of workflow, this operation returns a list of existing workflows.
 */
export const listWorkflows = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListWorkflowsRequest,
    output: ListWorkflowsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "startingToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists the workflow versions for the specified workflow. For more information, see Workflow versioning in Amazon Web Services HealthOmics in the *Amazon Web Services HealthOmics User Guide*.
 */
export const listWorkflowVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListWorkflowVersionsRequest,
    output: ListWorkflowVersionsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "startingToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Creates a reference store and returns metadata in JSON format. Reference stores are used to store reference genomes in FASTA format. A reference store is created when the first reference genome is imported. To import additional reference genomes from an Amazon S3 bucket, use the `StartReferenceImportJob` API operation.
 *
 * For more information, see Creating a HealthOmics reference store in the *Amazon Web Services HealthOmics User Guide*.
 */
export const createReferenceStore = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateReferenceStoreRequest,
    output: CreateReferenceStoreResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      RequestTimeoutException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a run cache to store and reference task outputs from completed private runs. Specify an Amazon S3 location where Amazon Web Services HealthOmics saves the cached data. This data must be immediately accessible and not in an archived state. You can save intermediate task files to a run cache if they are declared as task outputs in the workflow definition file.
 *
 * For more information, see Call caching and Creating a run cache in the *Amazon Web Services HealthOmics User Guide*.
 */
export const createRunCache = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRunCacheRequest,
  output: CreateRunCacheResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves detailed information about the specified run cache using its ID.
 *
 * For more information, see Call caching for Amazon Web Services HealthOmics runs in the *Amazon Web Services HealthOmics User Guide*.
 */
export const getRunCache = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRunCacheRequest,
  output: GetRunCacheResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a run group to limit the compute resources for the runs that are added to the group. Returns an ARN, ID, and tags for the run group.
 */
export const createRunGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRunGroupRequest,
  output: CreateRunGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a run group and returns its metadata.
 */
export const getRunGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRunGroupRequest,
  output: GetRunGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a new run and returns details about the run, or duplicates an existing run. A run is a single invocation of a workflow. If you provide request IDs, Amazon Web Services HealthOmics identifies duplicate requests and starts the run only once. Monitor the progress of the run by calling the `GetRun` API operation.
 *
 * To start a new run, the following inputs are required:
 *
 * - A service role ARN (`roleArn`).
 *
 * - The run's workflow ID (`workflowId`, not the `uuid` or `runId`).
 *
 * - An Amazon S3 location (`outputUri`) where the run outputs will be saved.
 *
 * - All required workflow parameters (`parameter`), which can include optional parameters from the parameter template. The run cannot include any parameters that are not defined in the parameter template. To see all possible parameters, use the `GetRun` API operation.
 *
 * - For runs with a `STATIC` (default) storage type, specify the required storage capacity (in gibibytes). A storage capacity value is not required for runs that use `DYNAMIC` storage.
 *
 * `StartRun` can also duplicate an existing run using the run's default values. You can modify these default values and/or add other optional inputs. To duplicate a run, the following inputs are required:
 *
 * - A service role ARN (`roleArn`).
 *
 * - The ID of the run to duplicate (`runId`).
 *
 * - An Amazon S3 location where the run outputs will be saved (`outputUri`).
 *
 * To learn more about the optional parameters for `StartRun`, see Starting a run in the *Amazon Web Services HealthOmics User Guide*.
 *
 * Use the `retentionMode` input to control how long the metadata for each run is stored in CloudWatch. There are two retention modes:
 *
 * - Specify `REMOVE` to automatically remove the oldest runs when you reach the maximum service retention limit for runs. It is recommended that you use the `REMOVE` mode to initiate major run requests so that your runs do not fail when you reach the limit.
 *
 * - The `retentionMode` is set to the `RETAIN` mode by default, which allows you to manually remove runs after reaching the maximum service retention limit. Under this setting, you cannot create additional runs until you remove the excess runs.
 *
 * To learn more about the retention modes, see Run retention mode in the *Amazon Web Services HealthOmics User Guide*.
 *
 * You can use Amazon Q CLI to analyze run logs and make performance optimization recommendations. To get started, see the Amazon Web Services HealthOmics MCP server on GitHub.
 */
export const startRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartRunRequest,
  output: StartRunResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of tags for a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new workflow version for the workflow that you specify with the `workflowId` parameter.
 *
 * When you create a new version of a workflow, you need to specify the configuration for the new version. It doesn't inherit any configuration values from the workflow.
 *
 * Provide a version name that is unique for this workflow. You cannot change the name after HealthOmics creates the version.
 *
 * Don't include any personally identifiable information (PII) in the version name. Version names appear in the workflow version ARN.
 *
 * For more information, see Workflow versioning in Amazon Web Services HealthOmics in the *Amazon Web Services HealthOmics User Guide*.
 */
export const createWorkflowVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateWorkflowVersionRequest,
    output: CreateWorkflowVersionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets information about a workflow version. For more information, see Workflow versioning in Amazon Web Services HealthOmics in the *Amazon Web Services HealthOmics User Guide*.
 */
export const getWorkflowVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkflowVersionRequest,
  output: GetWorkflowVersionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a run cache using its ID and returns a response with no body if the operation is successful. You can update the run cache description, name, or the default run cache behavior with `CACHE_ON_FAILURE` or `CACHE_ALWAYS`. To confirm that your run cache settings have been properly updated, use the `GetRunCache` API operation.
 *
 * For more information, see How call caching works in the *Amazon Web Services HealthOmics User Guide*.
 */
export const updateRunCache = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRunCacheRequest,
  output: UpdateRunCacheResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a run cache and returns a response with no body if the operation is successful. This action removes the cache metadata stored in the service account, but does not delete the data in Amazon S3. You can access the cache data in Amazon S3, for inspection or to troubleshoot issues. You can remove old cache data using standard S3 `Delete` operations.
 *
 * For more information, see Deleting a run cache in the *Amazon Web Services HealthOmics User Guide*.
 */
export const deleteRunCache = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRunCacheRequest,
  output: DeleteRunCacheResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the settings of a run group and returns a response with no body if the operation is successful.
 *
 * You can update the following settings with `UpdateRunGroup`:
 *
 * - Maximum number of CPUs
 *
 * - Run time (measured in minutes)
 *
 * - Number of GPUs
 *
 * - Number of concurrent runs
 *
 * - Group name
 *
 * To confirm that the settings have been successfully updated, use the `ListRunGroups` or `GetRunGroup` API operations to verify that the desired changes have been made.
 */
export const updateRunGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRunGroupRequest,
  output: UpdateRunGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a run group and returns a response with no body if the operation is successful.
 *
 * To verify that the run group is deleted:
 *
 * - Use `ListRunGroups` to confirm the workflow no longer appears in the list.
 *
 * - Use `GetRunGroup` to verify the workflow cannot be found.
 */
export const deleteRunGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRunGroupRequest,
  output: DeleteRunGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a run and returns a response with no body if the operation is successful. You can only delete a run that has reached a `COMPLETED`, `FAILED`, or `CANCELLED` stage. A completed run has delivered an output, or was cancelled and resulted in no output. When you delete a run, only the metadata associated with the run is deleted. The run outputs remain in Amazon S3 and logs remain in CloudWatch.
 *
 * To verify that the workflow is deleted:
 *
 * - Use `ListRuns` to confirm the workflow no longer appears in the list.
 *
 * - Use `GetRun` to verify the workflow cannot be found.
 */
export const deleteRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRunRequest,
  output: DeleteRunResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Cancels a run using its ID and returns a response with no body if the operation is successful. To confirm that the run has been cancelled, use the `ListRuns` API operation to check that it is no longer listed.
 */
export const cancelRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelRunRequest,
  output: CancelRunResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Tags a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates information about a workflow.
 *
 * You can update the following workflow information:
 *
 * - Name
 *
 * - Description
 *
 * - Default storage type
 *
 * - Default storage capacity (with workflow ID)
 *
 * This operation returns a response with no body if the operation is successful. You can check the workflow updates by calling the `GetWorkflow` API operation.
 *
 * For more information, see Update a private workflow in the *Amazon Web Services HealthOmics User Guide*.
 */
export const updateWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkflowRequest,
  output: UpdateWorkflowResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a workflow by specifying its ID. This operation returns a response with no body if the deletion is successful.
 *
 * To verify that the workflow is deleted:
 *
 * - Use `ListWorkflows` to confirm the workflow no longer appears in the list.
 *
 * - Use `GetWorkflow` to verify the workflow cannot be found.
 */
export const deleteWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkflowRequest,
  output: DeleteWorkflowResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates information about the workflow version. For more information, see Workflow versioning in Amazon Web Services HealthOmics in the *Amazon Web Services HealthOmics User Guide*.
 */
export const updateWorkflowVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateWorkflowVersionRequest,
    output: UpdateWorkflowVersionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a workflow version. Deleting a workflow version doesn't affect any ongoing runs that are using the workflow version.
 *
 * For more information, see Workflow versioning in Amazon Web Services HealthOmics in the *Amazon Web Services HealthOmics User Guide*.
 */
export const deleteWorkflowVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteWorkflowVersionRequest,
    output: DeleteWorkflowVersionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      RequestTimeoutException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Amazon Web Services HealthOmics variant stores and annotation stores will no longer be open to new customers starting November 7, 2025. If you would like to use variant stores or annotation stores, sign up prior to that date. Existing customers can continue to use the service as normal. For more information, see Amazon Web Services HealthOmics variant store and annotation store availability change.
 *
 * Starts an annotation import job.
 */
export const startAnnotationImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartAnnotationImportRequest,
    output: StartAnnotationImportResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Amazon Web Services HealthOmics variant stores and annotation stores will no longer be open to new customers starting November 7, 2025. If you would like to use variant stores or annotation stores, sign up prior to that date. Existing customers can continue to use the service as normal. For more information, see Amazon Web Services HealthOmics variant store and annotation store availability change.
 *
 * Creates an annotation store.
 */
export const createAnnotationStore = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAnnotationStoreRequest,
    output: CreateAnnotationStoreResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);

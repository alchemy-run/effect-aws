import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "HealthLake",
  serviceShapeName: "HealthLake",
});
const auth = T.AwsAuthSigv4({ name: "healthlake" });
const ver = T.ServiceVersion("2017-07-01");
const proto = T.AwsProtocolsAwsJson1_0();
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
                        url: "https://healthlake-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://healthlake-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://healthlake.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://healthlake.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export class DeleteFHIRDatastoreRequest extends S.Class<DeleteFHIRDatastoreRequest>(
  "DeleteFHIRDatastoreRequest",
)(
  { DatastoreId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFHIRDatastoreRequest extends S.Class<DescribeFHIRDatastoreRequest>(
  "DescribeFHIRDatastoreRequest",
)(
  { DatastoreId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFHIRExportJobRequest extends S.Class<DescribeFHIRExportJobRequest>(
  "DescribeFHIRExportJobRequest",
)(
  { DatastoreId: S.String, JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFHIRImportJobRequest extends S.Class<DescribeFHIRImportJobRequest>(
  "DescribeFHIRImportJobRequest",
)(
  { DatastoreId: S.String, JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFHIRExportJobsRequest extends S.Class<ListFHIRExportJobsRequest>(
  "ListFHIRExportJobsRequest",
)(
  {
    DatastoreId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    JobName: S.optional(S.String),
    JobStatus: S.optional(S.String),
    SubmittedBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SubmittedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFHIRImportJobsRequest extends S.Class<ListFHIRImportJobsRequest>(
  "ListFHIRImportJobsRequest",
)(
  {
    DatastoreId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    JobName: S.optional(S.String),
    JobStatus: S.optional(S.String),
    SubmittedBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SubmittedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceARN: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class PreloadDataConfig extends S.Class<PreloadDataConfig>(
  "PreloadDataConfig",
)({ PreloadDataType: S.String }) {}
export class IdentityProviderConfiguration extends S.Class<IdentityProviderConfiguration>(
  "IdentityProviderConfiguration",
)({
  AuthorizationStrategy: S.String,
  FineGrainedAuthorizationEnabled: S.optional(S.Boolean),
  Metadata: S.optional(S.String),
  IdpLambdaArn: S.optional(S.String),
}) {}
export class DatastoreFilter extends S.Class<DatastoreFilter>(
  "DatastoreFilter",
)({
  DatastoreName: S.optional(S.String),
  DatastoreStatus: S.optional(S.String),
  CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class S3Configuration extends S.Class<S3Configuration>(
  "S3Configuration",
)({ S3Uri: S.String, KmsKeyId: S.String }) {}
export const OutputDataConfig = S.Union(
  S.Struct({ S3Configuration: S3Configuration }),
);
export class ExportJobProperties extends S.Class<ExportJobProperties>(
  "ExportJobProperties",
)({
  JobId: S.String,
  JobName: S.optional(S.String),
  JobStatus: S.String,
  SubmitTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DatastoreId: S.String,
  OutputDataConfig: OutputDataConfig,
  DataAccessRoleArn: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export const ExportJobPropertiesList = S.Array(ExportJobProperties);
export const InputDataConfig = S.Union(S.Struct({ S3Uri: S.String }));
export class JobProgressReport extends S.Class<JobProgressReport>(
  "JobProgressReport",
)({
  TotalNumberOfScannedFiles: S.optional(S.Number),
  TotalSizeOfScannedFilesInMB: S.optional(S.Number),
  TotalNumberOfImportedFiles: S.optional(S.Number),
  TotalNumberOfResourcesScanned: S.optional(S.Number),
  TotalNumberOfResourcesImported: S.optional(S.Number),
  TotalNumberOfResourcesWithCustomerError: S.optional(S.Number),
  TotalNumberOfFilesReadWithCustomerError: S.optional(S.Number),
  Throughput: S.optional(S.Number),
}) {}
export class ImportJobProperties extends S.Class<ImportJobProperties>(
  "ImportJobProperties",
)({
  JobId: S.String,
  JobName: S.optional(S.String),
  JobStatus: S.String,
  SubmitTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DatastoreId: S.String,
  InputDataConfig: InputDataConfig,
  JobOutputDataConfig: S.optional(OutputDataConfig),
  JobProgressReport: S.optional(JobProgressReport),
  DataAccessRoleArn: S.optional(S.String),
  Message: S.optional(S.String),
  ValidationLevel: S.optional(S.String),
}) {}
export const ImportJobPropertiesList = S.Array(ImportJobProperties);
export class DeleteFHIRDatastoreResponse extends S.Class<DeleteFHIRDatastoreResponse>(
  "DeleteFHIRDatastoreResponse",
)({
  DatastoreId: S.String,
  DatastoreArn: S.String,
  DatastoreStatus: S.String,
  DatastoreEndpoint: S.String,
}) {}
export class ListFHIRDatastoresRequest extends S.Class<ListFHIRDatastoresRequest>(
  "ListFHIRDatastoresRequest",
)(
  {
    Filter: S.optional(DatastoreFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFHIRExportJobsResponse extends S.Class<ListFHIRExportJobsResponse>(
  "ListFHIRExportJobsResponse",
)({
  ExportJobPropertiesList: ExportJobPropertiesList,
  NextToken: S.optional(S.String),
}) {}
export class ListFHIRImportJobsResponse extends S.Class<ListFHIRImportJobsResponse>(
  "ListFHIRImportJobsResponse",
)({
  ImportJobPropertiesList: ImportJobPropertiesList,
  NextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class StartFHIRImportJobRequest extends S.Class<StartFHIRImportJobRequest>(
  "StartFHIRImportJobRequest",
)(
  {
    JobName: S.optional(S.String),
    InputDataConfig: InputDataConfig,
    JobOutputDataConfig: OutputDataConfig,
    DatastoreId: S.String,
    DataAccessRoleArn: S.String,
    ClientToken: S.optional(S.String),
    ValidationLevel: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class KmsEncryptionConfig extends S.Class<KmsEncryptionConfig>(
  "KmsEncryptionConfig",
)({ CmkType: S.String, KmsKeyId: S.optional(S.String) }) {}
export class SseConfiguration extends S.Class<SseConfiguration>(
  "SseConfiguration",
)({ KmsEncryptionConfig: KmsEncryptionConfig }) {}
export class ErrorCause extends S.Class<ErrorCause>("ErrorCause")({
  ErrorMessage: S.optional(S.String),
  ErrorCategory: S.optional(S.String),
}) {}
export class DatastoreProperties extends S.Class<DatastoreProperties>(
  "DatastoreProperties",
)({
  DatastoreId: S.String,
  DatastoreArn: S.String,
  DatastoreName: S.optional(S.String),
  DatastoreStatus: S.String,
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DatastoreTypeVersion: S.String,
  DatastoreEndpoint: S.String,
  SseConfiguration: S.optional(SseConfiguration),
  PreloadDataConfig: S.optional(PreloadDataConfig),
  IdentityProviderConfiguration: S.optional(IdentityProviderConfiguration),
  ErrorCause: S.optional(ErrorCause),
}) {}
export const DatastorePropertiesList = S.Array(DatastoreProperties);
export class CreateFHIRDatastoreRequest extends S.Class<CreateFHIRDatastoreRequest>(
  "CreateFHIRDatastoreRequest",
)(
  {
    DatastoreName: S.optional(S.String),
    DatastoreTypeVersion: S.String,
    SseConfiguration: S.optional(SseConfiguration),
    PreloadDataConfig: S.optional(PreloadDataConfig),
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagList),
    IdentityProviderConfiguration: S.optional(IdentityProviderConfiguration),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFHIRExportJobResponse extends S.Class<DescribeFHIRExportJobResponse>(
  "DescribeFHIRExportJobResponse",
)({ ExportJobProperties: ExportJobProperties }) {}
export class ListFHIRDatastoresResponse extends S.Class<ListFHIRDatastoresResponse>(
  "ListFHIRDatastoresResponse",
)({
  DatastorePropertiesList: DatastorePropertiesList,
  NextToken: S.optional(S.String),
}) {}
export class StartFHIRExportJobRequest extends S.Class<StartFHIRExportJobRequest>(
  "StartFHIRExportJobRequest",
)(
  {
    JobName: S.optional(S.String),
    OutputDataConfig: OutputDataConfig,
    DatastoreId: S.String,
    DataAccessRoleArn: S.String,
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartFHIRImportJobResponse extends S.Class<StartFHIRImportJobResponse>(
  "StartFHIRImportJobResponse",
)({
  JobId: S.String,
  JobStatus: S.String,
  DatastoreId: S.optional(S.String),
}) {}
export class CreateFHIRDatastoreResponse extends S.Class<CreateFHIRDatastoreResponse>(
  "CreateFHIRDatastoreResponse",
)({
  DatastoreId: S.String,
  DatastoreArn: S.String,
  DatastoreStatus: S.String,
  DatastoreEndpoint: S.String,
}) {}
export class DescribeFHIRDatastoreResponse extends S.Class<DescribeFHIRDatastoreResponse>(
  "DescribeFHIRDatastoreResponse",
)({ DatastoreProperties: DatastoreProperties }) {}
export class DescribeFHIRImportJobResponse extends S.Class<DescribeFHIRImportJobResponse>(
  "DescribeFHIRImportJobResponse",
)({ ImportJobProperties: ImportJobProperties }) {}
export class StartFHIRExportJobResponse extends S.Class<StartFHIRExportJobResponse>(
  "StartFHIRExportJobResponse",
)({
  JobId: S.String,
  JobStatus: S.String,
  DatastoreId: S.optional(S.String),
}) {}

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns a list of all existing tags associated with a data store.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Add a user-specifed key and value tag to a data store.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Remove a user-specifed key and value tag from a data store.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Get FHIR export job properties.
 */
export const describeFHIRExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFHIRExportJobRequest,
    output: DescribeFHIRExportJobResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * List all FHIR-enabled data stores in a user’s account, regardless of data store
 * status.
 */
export const listFHIRDatastores = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFHIRDatastoresRequest,
  output: ListFHIRDatastoresResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Lists all FHIR export jobs associated with an account and their statuses.
 */
export const listFHIRExportJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFHIRExportJobsRequest,
  output: ListFHIRExportJobsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List all FHIR import jobs associated with an account and their statuses.
 */
export const listFHIRImportJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFHIRImportJobsRequest,
  output: ListFHIRImportJobsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Start importing bulk FHIR data into an ACTIVE data store. The import job imports FHIR
 * data found in the `InputDataConfig` object and stores processing results in the
 * `JobOutputDataConfig` object.
 */
export const startFHIRImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartFHIRImportJobRequest,
  output: StartFHIRImportJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create a FHIR-enabled data store.
 */
export const createFHIRDatastore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFHIRDatastoreRequest,
  output: CreateFHIRDatastoreResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete a FHIR-enabled data store.
 */
export const deleteFHIRDatastore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFHIRDatastoreRequest,
  output: DeleteFHIRDatastoreResponse,
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
 * Get properties for a FHIR-enabled data store.
 */
export const describeFHIRDatastore = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFHIRDatastoreRequest,
    output: DescribeFHIRDatastoreResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Get the import job properties to learn more about the job or job progress.
 */
export const describeFHIRImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFHIRImportJobRequest,
    output: DescribeFHIRImportJobResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Start a FHIR export job.
 */
export const startFHIRExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartFHIRExportJobRequest,
  output: StartFHIRExportJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

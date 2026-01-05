import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({ sdkId: "Voice ID", serviceShapeName: "VoiceID" });
const auth = T.AwsAuthSigv4({ name: "voiceid" });
const ver = T.ServiceVersion("2021-09-27");
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
                        url: "https://voiceid-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://voiceid-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://voiceid.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://voiceid.{Region}.{PartitionResult#dnsSuffix}",
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
export class AssociateFraudsterRequest extends S.Class<AssociateFraudsterRequest>(
  "AssociateFraudsterRequest",
)(
  { DomainId: S.String, WatchlistId: S.String, FraudsterId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateWatchlistRequest extends S.Class<CreateWatchlistRequest>(
  "CreateWatchlistRequest",
)(
  {
    DomainId: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFraudsterRequest extends S.Class<DeleteFraudsterRequest>(
  "DeleteFraudsterRequest",
)(
  { DomainId: S.String, FraudsterId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFraudsterResponse extends S.Class<DeleteFraudsterResponse>(
  "DeleteFraudsterResponse",
)({}) {}
export class DeleteSpeakerRequest extends S.Class<DeleteSpeakerRequest>(
  "DeleteSpeakerRequest",
)(
  { DomainId: S.String, SpeakerId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSpeakerResponse extends S.Class<DeleteSpeakerResponse>(
  "DeleteSpeakerResponse",
)({}) {}
export class DeleteWatchlistRequest extends S.Class<DeleteWatchlistRequest>(
  "DeleteWatchlistRequest",
)(
  { DomainId: S.String, WatchlistId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteWatchlistResponse extends S.Class<DeleteWatchlistResponse>(
  "DeleteWatchlistResponse",
)({}) {}
export class DescribeFraudsterRequest extends S.Class<DescribeFraudsterRequest>(
  "DescribeFraudsterRequest",
)(
  { DomainId: S.String, FraudsterId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFraudsterRegistrationJobRequest extends S.Class<DescribeFraudsterRegistrationJobRequest>(
  "DescribeFraudsterRegistrationJobRequest",
)(
  { DomainId: S.String, JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSpeakerRequest extends S.Class<DescribeSpeakerRequest>(
  "DescribeSpeakerRequest",
)(
  { DomainId: S.String, SpeakerId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSpeakerEnrollmentJobRequest extends S.Class<DescribeSpeakerEnrollmentJobRequest>(
  "DescribeSpeakerEnrollmentJobRequest",
)(
  { DomainId: S.String, JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeWatchlistRequest extends S.Class<DescribeWatchlistRequest>(
  "DescribeWatchlistRequest",
)(
  { DomainId: S.String, WatchlistId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateFraudsterRequest extends S.Class<DisassociateFraudsterRequest>(
  "DisassociateFraudsterRequest",
)(
  { DomainId: S.String, WatchlistId: S.String, FraudsterId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EvaluateSessionRequest extends S.Class<EvaluateSessionRequest>(
  "EvaluateSessionRequest",
)(
  { DomainId: S.String, SessionNameOrId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFraudsterRegistrationJobsRequest extends S.Class<ListFraudsterRegistrationJobsRequest>(
  "ListFraudsterRegistrationJobsRequest",
)(
  {
    DomainId: S.String,
    JobStatus: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFraudstersRequest extends S.Class<ListFraudstersRequest>(
  "ListFraudstersRequest",
)(
  {
    DomainId: S.String,
    WatchlistId: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSpeakerEnrollmentJobsRequest extends S.Class<ListSpeakerEnrollmentJobsRequest>(
  "ListSpeakerEnrollmentJobsRequest",
)(
  {
    DomainId: S.String,
    JobStatus: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSpeakersRequest extends S.Class<ListSpeakersRequest>(
  "ListSpeakersRequest",
)(
  {
    DomainId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListWatchlistsRequest extends S.Class<ListWatchlistsRequest>(
  "ListWatchlistsRequest",
)(
  {
    DomainId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class OptOutSpeakerRequest extends S.Class<OptOutSpeakerRequest>(
  "OptOutSpeakerRequest",
)(
  { DomainId: S.String, SpeakerId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateWatchlistRequest extends S.Class<UpdateWatchlistRequest>(
  "UpdateWatchlistRequest",
)(
  {
    DomainId: S.String,
    WatchlistId: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDomainRequest extends S.Class<DescribeDomainRequest>(
  "DescribeDomainRequest",
)(
  { DomainId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ServerSideEncryptionConfiguration extends S.Class<ServerSideEncryptionConfiguration>(
  "ServerSideEncryptionConfiguration",
)({ KmsKeyId: S.String }) {}
export class UpdateDomainRequest extends S.Class<UpdateDomainRequest>(
  "UpdateDomainRequest",
)(
  {
    DomainId: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    ServerSideEncryptionConfiguration: ServerSideEncryptionConfiguration,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDomainRequest extends S.Class<DeleteDomainRequest>(
  "DeleteDomainRequest",
)(
  { DomainId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDomainResponse extends S.Class<DeleteDomainResponse>(
  "DeleteDomainResponse",
)({}) {}
export class ListDomainsRequest extends S.Class<ListDomainsRequest>(
  "ListDomainsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const RegistrationConfigWatchlistIds = S.Array(S.String);
export class RegistrationConfig extends S.Class<RegistrationConfig>(
  "RegistrationConfig",
)({
  DuplicateRegistrationAction: S.optional(S.String),
  FraudsterSimilarityThreshold: S.optional(S.Number),
  WatchlistIds: S.optional(RegistrationConfigWatchlistIds),
}) {}
export class InputDataConfig extends S.Class<InputDataConfig>(
  "InputDataConfig",
)({ S3Uri: S.String }) {}
export class OutputDataConfig extends S.Class<OutputDataConfig>(
  "OutputDataConfig",
)({ S3Uri: S.String, KmsKeyId: S.optional(S.String) }) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export const EnrollmentJobFraudDetectionConfigWatchlistIds = S.Array(S.String);
export const ResponseWatchlistIds = S.Array(S.String);
export class Fraudster extends S.Class<Fraudster>("Fraudster")({
  DomainId: S.optional(S.String),
  GeneratedFraudsterId: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  WatchlistIds: S.optional(ResponseWatchlistIds),
}) {}
export class DescribeFraudsterResponse extends S.Class<DescribeFraudsterResponse>(
  "DescribeFraudsterResponse",
)({ Fraudster: S.optional(Fraudster) }) {}
export class Watchlist extends S.Class<Watchlist>("Watchlist")({
  DomainId: S.optional(S.String),
  WatchlistId: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  DefaultWatchlist: S.optional(S.Boolean),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeWatchlistResponse extends S.Class<DescribeWatchlistResponse>(
  "DescribeWatchlistResponse",
)({ Watchlist: S.optional(Watchlist) }) {}
export class DisassociateFraudsterResponse extends S.Class<DisassociateFraudsterResponse>(
  "DisassociateFraudsterResponse",
)({ Fraudster: S.optional(Fraudster) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class Speaker extends S.Class<Speaker>("Speaker")({
  DomainId: S.optional(S.String),
  CustomerSpeakerId: S.optional(S.String),
  GeneratedSpeakerId: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastAccessedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class OptOutSpeakerResponse extends S.Class<OptOutSpeakerResponse>(
  "OptOutSpeakerResponse",
)({ Speaker: S.optional(Speaker) }) {}
export class StartFraudsterRegistrationJobRequest extends S.Class<StartFraudsterRegistrationJobRequest>(
  "StartFraudsterRegistrationJobRequest",
)(
  {
    ClientToken: S.optional(S.String),
    JobName: S.optional(S.String),
    DomainId: S.String,
    DataAccessRoleArn: S.String,
    RegistrationConfig: S.optional(RegistrationConfig),
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UpdateWatchlistResponse extends S.Class<UpdateWatchlistResponse>(
  "UpdateWatchlistResponse",
)({ Watchlist: S.optional(Watchlist) }) {}
export class CreateDomainRequest extends S.Class<CreateDomainRequest>(
  "CreateDomainRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    ServerSideEncryptionConfiguration: ServerSideEncryptionConfiguration,
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ServerSideEncryptionUpdateDetails extends S.Class<ServerSideEncryptionUpdateDetails>(
  "ServerSideEncryptionUpdateDetails",
)({
  OldKmsKeyId: S.optional(S.String),
  UpdateStatus: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export class WatchlistDetails extends S.Class<WatchlistDetails>(
  "WatchlistDetails",
)({ DefaultWatchlistId: S.String }) {}
export class Domain extends S.Class<Domain>("Domain")({
  DomainId: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  DomainStatus: S.optional(S.String),
  ServerSideEncryptionConfiguration: S.optional(
    ServerSideEncryptionConfiguration,
  ),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ServerSideEncryptionUpdateDetails: S.optional(
    ServerSideEncryptionUpdateDetails,
  ),
  WatchlistDetails: S.optional(WatchlistDetails),
}) {}
export class UpdateDomainResponse extends S.Class<UpdateDomainResponse>(
  "UpdateDomainResponse",
)({ Domain: S.optional(Domain) }) {}
export const FraudDetectionReasons = S.Array(S.String);
export class EnrollmentJobFraudDetectionConfig extends S.Class<EnrollmentJobFraudDetectionConfig>(
  "EnrollmentJobFraudDetectionConfig",
)({
  FraudDetectionAction: S.optional(S.String),
  RiskThreshold: S.optional(S.Number),
  WatchlistIds: S.optional(EnrollmentJobFraudDetectionConfigWatchlistIds),
}) {}
export class EnrollmentConfig extends S.Class<EnrollmentConfig>(
  "EnrollmentConfig",
)({
  ExistingEnrollmentAction: S.optional(S.String),
  FraudDetectionConfig: S.optional(EnrollmentJobFraudDetectionConfig),
}) {}
export class FailureDetails extends S.Class<FailureDetails>("FailureDetails")({
  StatusCode: S.optional(S.Number),
  Message: S.optional(S.String),
}) {}
export class JobProgress extends S.Class<JobProgress>("JobProgress")({
  PercentComplete: S.optional(S.Number),
}) {}
export class SpeakerEnrollmentJob extends S.Class<SpeakerEnrollmentJob>(
  "SpeakerEnrollmentJob",
)({
  JobName: S.optional(S.String),
  JobId: S.optional(S.String),
  JobStatus: S.optional(S.String),
  DomainId: S.optional(S.String),
  DataAccessRoleArn: S.optional(S.String),
  EnrollmentConfig: S.optional(EnrollmentConfig),
  InputDataConfig: S.optional(InputDataConfig),
  OutputDataConfig: S.optional(OutputDataConfig),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FailureDetails: S.optional(FailureDetails),
  JobProgress: S.optional(JobProgress),
}) {}
export class FraudsterRegistrationJobSummary extends S.Class<FraudsterRegistrationJobSummary>(
  "FraudsterRegistrationJobSummary",
)({
  JobName: S.optional(S.String),
  JobId: S.optional(S.String),
  JobStatus: S.optional(S.String),
  DomainId: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FailureDetails: S.optional(FailureDetails),
  JobProgress: S.optional(JobProgress),
}) {}
export const FraudsterRegistrationJobSummaries = S.Array(
  FraudsterRegistrationJobSummary,
);
export class FraudsterSummary extends S.Class<FraudsterSummary>(
  "FraudsterSummary",
)({
  DomainId: S.optional(S.String),
  GeneratedFraudsterId: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  WatchlistIds: S.optional(ResponseWatchlistIds),
}) {}
export const FraudsterSummaries = S.Array(FraudsterSummary);
export class SpeakerEnrollmentJobSummary extends S.Class<SpeakerEnrollmentJobSummary>(
  "SpeakerEnrollmentJobSummary",
)({
  JobName: S.optional(S.String),
  JobId: S.optional(S.String),
  JobStatus: S.optional(S.String),
  DomainId: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FailureDetails: S.optional(FailureDetails),
  JobProgress: S.optional(JobProgress),
}) {}
export const SpeakerEnrollmentJobSummaries = S.Array(
  SpeakerEnrollmentJobSummary,
);
export class SpeakerSummary extends S.Class<SpeakerSummary>("SpeakerSummary")({
  DomainId: S.optional(S.String),
  CustomerSpeakerId: S.optional(S.String),
  GeneratedSpeakerId: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastAccessedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const SpeakerSummaries = S.Array(SpeakerSummary);
export class WatchlistSummary extends S.Class<WatchlistSummary>(
  "WatchlistSummary",
)({
  DomainId: S.optional(S.String),
  WatchlistId: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  DefaultWatchlist: S.optional(S.Boolean),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const WatchlistSummaries = S.Array(WatchlistSummary);
export class DomainSummary extends S.Class<DomainSummary>("DomainSummary")({
  DomainId: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  DomainStatus: S.optional(S.String),
  ServerSideEncryptionConfiguration: S.optional(
    ServerSideEncryptionConfiguration,
  ),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ServerSideEncryptionUpdateDetails: S.optional(
    ServerSideEncryptionUpdateDetails,
  ),
  WatchlistDetails: S.optional(WatchlistDetails),
}) {}
export const DomainSummaries = S.Array(DomainSummary);
export class AssociateFraudsterResponse extends S.Class<AssociateFraudsterResponse>(
  "AssociateFraudsterResponse",
)({ Fraudster: S.optional(Fraudster) }) {}
export class CreateWatchlistResponse extends S.Class<CreateWatchlistResponse>(
  "CreateWatchlistResponse",
)({ Watchlist: S.optional(Watchlist) }) {}
export class DescribeSpeakerResponse extends S.Class<DescribeSpeakerResponse>(
  "DescribeSpeakerResponse",
)({ Speaker: S.optional(Speaker) }) {}
export class DescribeSpeakerEnrollmentJobResponse extends S.Class<DescribeSpeakerEnrollmentJobResponse>(
  "DescribeSpeakerEnrollmentJobResponse",
)({ Job: S.optional(SpeakerEnrollmentJob) }) {}
export class ListFraudsterRegistrationJobsResponse extends S.Class<ListFraudsterRegistrationJobsResponse>(
  "ListFraudsterRegistrationJobsResponse",
)({
  JobSummaries: S.optional(FraudsterRegistrationJobSummaries),
  NextToken: S.optional(S.String),
}) {}
export class ListFraudstersResponse extends S.Class<ListFraudstersResponse>(
  "ListFraudstersResponse",
)({
  FraudsterSummaries: S.optional(FraudsterSummaries),
  NextToken: S.optional(S.String),
}) {}
export class ListSpeakerEnrollmentJobsResponse extends S.Class<ListSpeakerEnrollmentJobsResponse>(
  "ListSpeakerEnrollmentJobsResponse",
)({
  JobSummaries: S.optional(SpeakerEnrollmentJobSummaries),
  NextToken: S.optional(S.String),
}) {}
export class ListSpeakersResponse extends S.Class<ListSpeakersResponse>(
  "ListSpeakersResponse",
)({
  SpeakerSummaries: S.optional(SpeakerSummaries),
  NextToken: S.optional(S.String),
}) {}
export class ListWatchlistsResponse extends S.Class<ListWatchlistsResponse>(
  "ListWatchlistsResponse",
)({
  WatchlistSummaries: S.optional(WatchlistSummaries),
  NextToken: S.optional(S.String),
}) {}
export class FraudsterRegistrationJob extends S.Class<FraudsterRegistrationJob>(
  "FraudsterRegistrationJob",
)({
  JobName: S.optional(S.String),
  JobId: S.optional(S.String),
  JobStatus: S.optional(S.String),
  DomainId: S.optional(S.String),
  DataAccessRoleArn: S.optional(S.String),
  RegistrationConfig: S.optional(RegistrationConfig),
  InputDataConfig: S.optional(InputDataConfig),
  OutputDataConfig: S.optional(OutputDataConfig),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FailureDetails: S.optional(FailureDetails),
  JobProgress: S.optional(JobProgress),
}) {}
export class StartFraudsterRegistrationJobResponse extends S.Class<StartFraudsterRegistrationJobResponse>(
  "StartFraudsterRegistrationJobResponse",
)({ Job: S.optional(FraudsterRegistrationJob) }) {}
export class StartSpeakerEnrollmentJobRequest extends S.Class<StartSpeakerEnrollmentJobRequest>(
  "StartSpeakerEnrollmentJobRequest",
)(
  {
    ClientToken: S.optional(S.String),
    JobName: S.optional(S.String),
    DomainId: S.String,
    DataAccessRoleArn: S.String,
    EnrollmentConfig: S.optional(EnrollmentConfig),
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDomainResponse extends S.Class<CreateDomainResponse>(
  "CreateDomainResponse",
)({ Domain: S.optional(Domain) }) {}
export class ListDomainsResponse extends S.Class<ListDomainsResponse>(
  "ListDomainsResponse",
)({
  DomainSummaries: S.optional(DomainSummaries),
  NextToken: S.optional(S.String),
}) {}
export class AuthenticationConfiguration extends S.Class<AuthenticationConfiguration>(
  "AuthenticationConfiguration",
)({ AcceptanceThreshold: S.Number }) {}
export class FraudDetectionConfiguration extends S.Class<FraudDetectionConfiguration>(
  "FraudDetectionConfiguration",
)({ RiskThreshold: S.optional(S.Number), WatchlistId: S.optional(S.String) }) {}
export class AuthenticationResult extends S.Class<AuthenticationResult>(
  "AuthenticationResult",
)({
  AuthenticationResultId: S.optional(S.String),
  AudioAggregationStartedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AudioAggregationEndedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  CustomerSpeakerId: S.optional(S.String),
  GeneratedSpeakerId: S.optional(S.String),
  Decision: S.optional(S.String),
  Score: S.optional(S.Number),
  Configuration: S.optional(AuthenticationConfiguration),
}) {}
export class KnownFraudsterRisk extends S.Class<KnownFraudsterRisk>(
  "KnownFraudsterRisk",
)({ RiskScore: S.Number, GeneratedFraudsterId: S.optional(S.String) }) {}
export class VoiceSpoofingRisk extends S.Class<VoiceSpoofingRisk>(
  "VoiceSpoofingRisk",
)({ RiskScore: S.Number }) {}
export class DescribeFraudsterRegistrationJobResponse extends S.Class<DescribeFraudsterRegistrationJobResponse>(
  "DescribeFraudsterRegistrationJobResponse",
)({ Job: S.optional(FraudsterRegistrationJob) }) {}
export class StartSpeakerEnrollmentJobResponse extends S.Class<StartSpeakerEnrollmentJobResponse>(
  "StartSpeakerEnrollmentJobResponse",
)({ Job: S.optional(SpeakerEnrollmentJob) }) {}
export class DescribeDomainResponse extends S.Class<DescribeDomainResponse>(
  "DescribeDomainResponse",
)({ Domain: S.optional(Domain) }) {}
export class FraudRiskDetails extends S.Class<FraudRiskDetails>(
  "FraudRiskDetails",
)({
  KnownFraudsterRisk: KnownFraudsterRisk,
  VoiceSpoofingRisk: VoiceSpoofingRisk,
}) {}
export class FraudDetectionResult extends S.Class<FraudDetectionResult>(
  "FraudDetectionResult",
)({
  FraudDetectionResultId: S.optional(S.String),
  AudioAggregationStartedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AudioAggregationEndedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Configuration: S.optional(FraudDetectionConfiguration),
  Decision: S.optional(S.String),
  Reasons: S.optional(FraudDetectionReasons),
  RiskDetails: S.optional(FraudRiskDetails),
}) {}
export class EvaluateSessionResponse extends S.Class<EvaluateSessionResponse>(
  "EvaluateSessionResponse",
)({
  DomainId: S.optional(S.String),
  SessionId: S.optional(S.String),
  SessionName: S.optional(S.String),
  StreamingStatus: S.optional(S.String),
  AuthenticationResult: S.optional(AuthenticationResult),
  FraudDetectionResult: S.optional(FraudDetectionResult),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String), ConflictType: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String), ResourceType: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Lists all the domains in the Amazon Web Services account.
 */
export const listDomains = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDomainsRequest,
    output: ListDomainsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "DomainSummaries",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Starts a new batch fraudster registration job using provided details.
 */
export const startFraudsterRegistrationJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartFraudsterRegistrationJobRequest,
    output: StartFraudsterRegistrationJobResponse,
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
 * Creates a domain that contains all Amazon Connect Voice ID data, such as speakers, fraudsters,
 * customer audio, and voiceprints. Every domain is created with a default watchlist that fraudsters can be a part of.
 */
export const createDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainRequest,
  output: CreateDomainResponse,
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
 * Opts out a speaker from Voice ID. A speaker can be opted out regardless of whether or
 * not they already exist in Voice ID. If they don't yet exist, a new speaker is created
 * in an opted out state. If they already exist, their existing status is overridden and
 * they are opted out. Enrollment and evaluation authentication requests are rejected for
 * opted out speakers, and opted out speakers have no voice embeddings stored in
 * Voice ID.
 */
export const optOutSpeaker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: OptOutSpeakerRequest,
  output: OptOutSpeakerResponse,
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
 * Associates the fraudsters with the watchlist specified in the same domain.
 */
export const associateFraudster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateFraudsterRequest,
  output: AssociateFraudsterResponse,
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
 * Creates a watchlist that fraudsters can be a part of.
 */
export const createWatchlist = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWatchlistRequest,
  output: CreateWatchlistResponse,
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
 * Describes the specified speaker.
 */
export const describeSpeaker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSpeakerRequest,
  output: DescribeSpeakerResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes the specified speaker enrollment job.
 */
export const describeSpeakerEnrollmentJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeSpeakerEnrollmentJobRequest,
    output: DescribeSpeakerEnrollmentJobResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists all the fraudster registration jobs in the domain with the given
 * `JobStatus`. If `JobStatus` is not provided, this lists all
 * fraudster registration jobs in the given domain.
 */
export const listFraudsterRegistrationJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListFraudsterRegistrationJobsRequest,
    output: ListFraudsterRegistrationJobsResponse,
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
      items: "JobSummaries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists all fraudsters in a specified watchlist or domain.
 */
export const listFraudsters = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListFraudstersRequest,
    output: ListFraudstersResponse,
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
      items: "FraudsterSummaries",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists all the speaker enrollment jobs in the domain with the specified
 * `JobStatus`. If `JobStatus` is not provided, this lists all
 * jobs with all possible speaker enrollment job statuses.
 */
export const listSpeakerEnrollmentJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSpeakerEnrollmentJobsRequest,
    output: ListSpeakerEnrollmentJobsResponse,
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
      items: "JobSummaries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists all speakers in a specified domain.
 */
export const listSpeakers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSpeakersRequest,
    output: ListSpeakersResponse,
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
      items: "SpeakerSummaries",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists all watchlists in a specified domain.
 */
export const listWatchlists = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListWatchlistsRequest,
    output: ListWatchlistsResponse,
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
      items: "WatchlistSummaries",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Disassociates the fraudsters from the watchlist specified. Voice ID always expects a
 * fraudster to be a part of at least one watchlist. If
 * you try to disassociate a fraudster from its only watchlist, a `ValidationException` is thrown.
 */
export const disassociateFraudster = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateFraudsterRequest,
    output: DisassociateFraudsterResponse,
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
 * Tags a Voice ID resource with the provided list of tags.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
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
 * Updates the specified watchlist. Every domain has a default watchlist which cannot be updated.
 */
export const updateWatchlist = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWatchlistRequest,
  output: UpdateWatchlistResponse,
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
 * Updates the specified domain. This API has clobber behavior, and clears and replaces
 * all attributes. If an optional field, such as 'Description' is not provided, it is
 * removed from the domain.
 */
export const updateDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDomainRequest,
  output: UpdateDomainResponse,
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
 * Deletes the specified speaker from Voice ID.
 */
export const deleteSpeaker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSpeakerRequest,
  output: DeleteSpeakerResponse,
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
 * Deletes the specified watchlist from Voice ID. This API throws an exception when
 * there are fraudsters in the watchlist that you are trying to delete. You must delete the
 * fraudsters, and then delete the watchlist. Every domain has a default watchlist which cannot be deleted.
 */
export const deleteWatchlist = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWatchlistRequest,
  output: DeleteWatchlistResponse,
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
 * Removes specified tags from a specified Amazon Connect Voice ID resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
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
 * Deletes the specified domain from Voice ID.
 */
export const deleteDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainRequest,
  output: DeleteDomainResponse,
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
 * Describes the specified watchlist.
 */
export const describeWatchlist = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeWatchlistRequest,
  output: DescribeWatchlistResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all tags associated with a specified Voice ID resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified fraudster from Voice ID. This action disassociates the fraudster from any watchlists it is a part of.
 */
export const deleteFraudster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFraudsterRequest,
  output: DeleteFraudsterResponse,
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
 * Describes the specified fraudster.
 */
export const describeFraudster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFraudsterRequest,
  output: DescribeFraudsterResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes the specified fraudster registration job.
 */
export const describeFraudsterRegistrationJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeFraudsterRegistrationJobRequest,
    output: DescribeFraudsterRegistrationJobResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Describes the specified domain.
 */
export const describeDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDomainRequest,
  output: DescribeDomainResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Evaluates a specified session based on audio data accumulated during a streaming
 * Amazon Connect Voice ID call.
 */
export const evaluateSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EvaluateSessionRequest,
  output: EvaluateSessionResponse,
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
 * Starts a new batch speaker enrollment job using specified details.
 */
export const startSpeakerEnrollmentJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartSpeakerEnrollmentJobRequest,
    output: StartSpeakerEnrollmentJobResponse,
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

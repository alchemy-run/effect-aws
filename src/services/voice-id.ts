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
const svc = T.AwsApiService({ sdkId: "Voice ID", serviceShapeName: "VoiceID" });
const auth = T.AwsAuthSigv4({ name: "voiceid" });
const ver = T.ServiceVersion("2021-09-27");
const proto = T.AwsProtocolsAwsJson1_0();
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
              `https://voiceid-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://voiceid-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://voiceid.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://voiceid.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type DomainId = string;
export type WatchlistId = string;
export type FraudsterId = string | Redacted.Redacted<string>;
export type WatchlistName = string | Redacted.Redacted<string>;
export type WatchlistDescription = string | Redacted.Redacted<string>;
export type ClientTokenString = string;
export type SpeakerId = string | Redacted.Redacted<string>;
export type JobId = string;
export type SessionNameOrId = string;
export type FraudsterRegistrationJobStatus = string;
export type MaxResultsForList = number;
export type NextToken = string;
export type SpeakerEnrollmentJobStatus = string;
export type AmazonResourceName = string;
export type JobName = string | Redacted.Redacted<string>;
export type IamRoleArn = string;
export type TagKey = string | Redacted.Redacted<string>;
export type DomainName = string | Redacted.Redacted<string>;
export type Description = string | Redacted.Redacted<string>;
export type MaxResultsForListDomainFe = number;
export type DuplicateRegistrationAction = string;
export type Score = number;
export type S3Uri = string;
export type KmsKeyId = string;
export type ExistingEnrollmentAction = string;
export type TagValue = string | Redacted.Redacted<string>;
export type SessionId = string;
export type SessionName = string;
export type StreamingStatus = string;
export type FraudDetectionAction = string;
export type GeneratedFraudsterId = string;
export type CustomerSpeakerId = string | Redacted.Redacted<string>;
export type GeneratedSpeakerId = string;
export type SpeakerStatus = string;
export type UniqueIdLarge = string;
export type AuthenticationDecision = string;
export type FraudDetectionDecision = string;
export type FraudDetectionReason = string;
export type Arn = string;
export type DomainStatus = string;
export type ConflictType = string;
export type Integer = number;
export type ServerSideEncryptionUpdateStatus = string;
export type ResourceType = string;

//# Schemas
export type TagKeyList = string | Redacted.Redacted<string>[];
export const TagKeyList = S.Array(SensitiveString);
export interface AssociateFraudsterRequest {
  DomainId: string;
  WatchlistId: string;
  FraudsterId: string | Redacted.Redacted<string>;
}
export const AssociateFraudsterRequest = S.suspend(() =>
  S.Struct({
    DomainId: S.String,
    WatchlistId: S.String,
    FraudsterId: SensitiveString,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateFraudsterRequest",
}) as any as S.Schema<AssociateFraudsterRequest>;
export interface CreateWatchlistRequest {
  DomainId: string;
  Name: string | Redacted.Redacted<string>;
  Description?: string | Redacted.Redacted<string>;
  ClientToken?: string;
}
export const CreateWatchlistRequest = S.suspend(() =>
  S.Struct({
    DomainId: S.String,
    Name: SensitiveString,
    Description: S.optional(SensitiveString),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateWatchlistRequest",
}) as any as S.Schema<CreateWatchlistRequest>;
export interface DeleteFraudsterRequest {
  DomainId: string;
  FraudsterId: string | Redacted.Redacted<string>;
}
export const DeleteFraudsterRequest = S.suspend(() =>
  S.Struct({ DomainId: S.String, FraudsterId: SensitiveString }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteFraudsterRequest",
}) as any as S.Schema<DeleteFraudsterRequest>;
export interface DeleteFraudsterResponse {}
export const DeleteFraudsterResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteFraudsterResponse",
}) as any as S.Schema<DeleteFraudsterResponse>;
export interface DeleteSpeakerRequest {
  DomainId: string;
  SpeakerId: string | Redacted.Redacted<string>;
}
export const DeleteSpeakerRequest = S.suspend(() =>
  S.Struct({ DomainId: S.String, SpeakerId: SensitiveString }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSpeakerRequest",
}) as any as S.Schema<DeleteSpeakerRequest>;
export interface DeleteSpeakerResponse {}
export const DeleteSpeakerResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteSpeakerResponse",
}) as any as S.Schema<DeleteSpeakerResponse>;
export interface DeleteWatchlistRequest {
  DomainId: string;
  WatchlistId: string;
}
export const DeleteWatchlistRequest = S.suspend(() =>
  S.Struct({ DomainId: S.String, WatchlistId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteWatchlistRequest",
}) as any as S.Schema<DeleteWatchlistRequest>;
export interface DeleteWatchlistResponse {}
export const DeleteWatchlistResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteWatchlistResponse",
}) as any as S.Schema<DeleteWatchlistResponse>;
export interface DescribeFraudsterRequest {
  DomainId: string;
  FraudsterId: string | Redacted.Redacted<string>;
}
export const DescribeFraudsterRequest = S.suspend(() =>
  S.Struct({ DomainId: S.String, FraudsterId: SensitiveString }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeFraudsterRequest",
}) as any as S.Schema<DescribeFraudsterRequest>;
export interface DescribeFraudsterRegistrationJobRequest {
  DomainId: string;
  JobId: string;
}
export const DescribeFraudsterRegistrationJobRequest = S.suspend(() =>
  S.Struct({ DomainId: S.String, JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeFraudsterRegistrationJobRequest",
}) as any as S.Schema<DescribeFraudsterRegistrationJobRequest>;
export interface DescribeSpeakerRequest {
  DomainId: string;
  SpeakerId: string | Redacted.Redacted<string>;
}
export const DescribeSpeakerRequest = S.suspend(() =>
  S.Struct({ DomainId: S.String, SpeakerId: SensitiveString }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeSpeakerRequest",
}) as any as S.Schema<DescribeSpeakerRequest>;
export interface DescribeSpeakerEnrollmentJobRequest {
  DomainId: string;
  JobId: string;
}
export const DescribeSpeakerEnrollmentJobRequest = S.suspend(() =>
  S.Struct({ DomainId: S.String, JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeSpeakerEnrollmentJobRequest",
}) as any as S.Schema<DescribeSpeakerEnrollmentJobRequest>;
export interface DescribeWatchlistRequest {
  DomainId: string;
  WatchlistId: string;
}
export const DescribeWatchlistRequest = S.suspend(() =>
  S.Struct({ DomainId: S.String, WatchlistId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeWatchlistRequest",
}) as any as S.Schema<DescribeWatchlistRequest>;
export interface DisassociateFraudsterRequest {
  DomainId: string;
  WatchlistId: string;
  FraudsterId: string | Redacted.Redacted<string>;
}
export const DisassociateFraudsterRequest = S.suspend(() =>
  S.Struct({
    DomainId: S.String,
    WatchlistId: S.String,
    FraudsterId: SensitiveString,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateFraudsterRequest",
}) as any as S.Schema<DisassociateFraudsterRequest>;
export interface EvaluateSessionRequest {
  DomainId: string;
  SessionNameOrId: string;
}
export const EvaluateSessionRequest = S.suspend(() =>
  S.Struct({ DomainId: S.String, SessionNameOrId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "EvaluateSessionRequest",
}) as any as S.Schema<EvaluateSessionRequest>;
export interface ListFraudsterRegistrationJobsRequest {
  DomainId: string;
  JobStatus?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListFraudsterRegistrationJobsRequest = S.suspend(() =>
  S.Struct({
    DomainId: S.String,
    JobStatus: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListFraudsterRegistrationJobsRequest",
}) as any as S.Schema<ListFraudsterRegistrationJobsRequest>;
export interface ListFraudstersRequest {
  DomainId: string;
  WatchlistId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListFraudstersRequest = S.suspend(() =>
  S.Struct({
    DomainId: S.String,
    WatchlistId: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListFraudstersRequest",
}) as any as S.Schema<ListFraudstersRequest>;
export interface ListSpeakerEnrollmentJobsRequest {
  DomainId: string;
  JobStatus?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListSpeakerEnrollmentJobsRequest = S.suspend(() =>
  S.Struct({
    DomainId: S.String,
    JobStatus: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSpeakerEnrollmentJobsRequest",
}) as any as S.Schema<ListSpeakerEnrollmentJobsRequest>;
export interface ListSpeakersRequest {
  DomainId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListSpeakersRequest = S.suspend(() =>
  S.Struct({
    DomainId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSpeakersRequest",
}) as any as S.Schema<ListSpeakersRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ListWatchlistsRequest {
  DomainId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListWatchlistsRequest = S.suspend(() =>
  S.Struct({
    DomainId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListWatchlistsRequest",
}) as any as S.Schema<ListWatchlistsRequest>;
export interface OptOutSpeakerRequest {
  DomainId: string;
  SpeakerId: string | Redacted.Redacted<string>;
}
export const OptOutSpeakerRequest = S.suspend(() =>
  S.Struct({ DomainId: S.String, SpeakerId: SensitiveString }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "OptOutSpeakerRequest",
}) as any as S.Schema<OptOutSpeakerRequest>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateWatchlistRequest {
  DomainId: string;
  WatchlistId: string;
  Name?: string | Redacted.Redacted<string>;
  Description?: string | Redacted.Redacted<string>;
}
export const UpdateWatchlistRequest = S.suspend(() =>
  S.Struct({
    DomainId: S.String,
    WatchlistId: S.String,
    Name: S.optional(SensitiveString),
    Description: S.optional(SensitiveString),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateWatchlistRequest",
}) as any as S.Schema<UpdateWatchlistRequest>;
export interface DescribeDomainRequest {
  DomainId: string;
}
export const DescribeDomainRequest = S.suspend(() =>
  S.Struct({ DomainId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeDomainRequest",
}) as any as S.Schema<DescribeDomainRequest>;
export interface ServerSideEncryptionConfiguration {
  KmsKeyId: string;
}
export const ServerSideEncryptionConfiguration = S.suspend(() =>
  S.Struct({ KmsKeyId: S.String }),
).annotations({
  identifier: "ServerSideEncryptionConfiguration",
}) as any as S.Schema<ServerSideEncryptionConfiguration>;
export interface UpdateDomainRequest {
  DomainId: string;
  Name: string | Redacted.Redacted<string>;
  Description?: string | Redacted.Redacted<string>;
  ServerSideEncryptionConfiguration: ServerSideEncryptionConfiguration;
}
export const UpdateDomainRequest = S.suspend(() =>
  S.Struct({
    DomainId: S.String,
    Name: SensitiveString,
    Description: S.optional(SensitiveString),
    ServerSideEncryptionConfiguration: ServerSideEncryptionConfiguration,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateDomainRequest",
}) as any as S.Schema<UpdateDomainRequest>;
export interface DeleteDomainRequest {
  DomainId: string;
}
export const DeleteDomainRequest = S.suspend(() =>
  S.Struct({ DomainId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteDomainRequest",
}) as any as S.Schema<DeleteDomainRequest>;
export interface DeleteDomainResponse {}
export const DeleteDomainResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteDomainResponse",
}) as any as S.Schema<DeleteDomainResponse>;
export interface ListDomainsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListDomainsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDomainsRequest",
}) as any as S.Schema<ListDomainsRequest>;
export type RegistrationConfigWatchlistIds = string[];
export const RegistrationConfigWatchlistIds = S.Array(S.String);
export interface RegistrationConfig {
  DuplicateRegistrationAction?: string;
  FraudsterSimilarityThreshold?: number;
  WatchlistIds?: RegistrationConfigWatchlistIds;
}
export const RegistrationConfig = S.suspend(() =>
  S.Struct({
    DuplicateRegistrationAction: S.optional(S.String),
    FraudsterSimilarityThreshold: S.optional(S.Number),
    WatchlistIds: S.optional(RegistrationConfigWatchlistIds),
  }),
).annotations({
  identifier: "RegistrationConfig",
}) as any as S.Schema<RegistrationConfig>;
export interface InputDataConfig {
  S3Uri: string;
}
export const InputDataConfig = S.suspend(() =>
  S.Struct({ S3Uri: S.String }),
).annotations({
  identifier: "InputDataConfig",
}) as any as S.Schema<InputDataConfig>;
export interface OutputDataConfig {
  S3Uri: string;
  KmsKeyId?: string;
}
export const OutputDataConfig = S.suspend(() =>
  S.Struct({ S3Uri: S.String, KmsKeyId: S.optional(S.String) }),
).annotations({
  identifier: "OutputDataConfig",
}) as any as S.Schema<OutputDataConfig>;
export interface Tag {
  Key: string | Redacted.Redacted<string>;
  Value: string | Redacted.Redacted<string>;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: SensitiveString, Value: SensitiveString }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export type EnrollmentJobFraudDetectionConfigWatchlistIds = string[];
export const EnrollmentJobFraudDetectionConfigWatchlistIds = S.Array(S.String);
export type ResponseWatchlistIds = string[];
export const ResponseWatchlistIds = S.Array(S.String);
export interface Fraudster {
  DomainId?: string;
  GeneratedFraudsterId?: string;
  CreatedAt?: Date;
  WatchlistIds?: ResponseWatchlistIds;
}
export const Fraudster = S.suspend(() =>
  S.Struct({
    DomainId: S.optional(S.String),
    GeneratedFraudsterId: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    WatchlistIds: S.optional(ResponseWatchlistIds),
  }),
).annotations({ identifier: "Fraudster" }) as any as S.Schema<Fraudster>;
export interface DescribeFraudsterResponse {
  Fraudster?: Fraudster;
}
export const DescribeFraudsterResponse = S.suspend(() =>
  S.Struct({ Fraudster: S.optional(Fraudster) }),
).annotations({
  identifier: "DescribeFraudsterResponse",
}) as any as S.Schema<DescribeFraudsterResponse>;
export interface Watchlist {
  DomainId?: string;
  WatchlistId?: string;
  Name?: string | Redacted.Redacted<string>;
  Description?: string | Redacted.Redacted<string>;
  DefaultWatchlist?: boolean;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const Watchlist = S.suspend(() =>
  S.Struct({
    DomainId: S.optional(S.String),
    WatchlistId: S.optional(S.String),
    Name: S.optional(SensitiveString),
    Description: S.optional(SensitiveString),
    DefaultWatchlist: S.optional(S.Boolean),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Watchlist" }) as any as S.Schema<Watchlist>;
export interface DescribeWatchlistResponse {
  Watchlist?: Watchlist;
}
export const DescribeWatchlistResponse = S.suspend(() =>
  S.Struct({ Watchlist: S.optional(Watchlist) }),
).annotations({
  identifier: "DescribeWatchlistResponse",
}) as any as S.Schema<DescribeWatchlistResponse>;
export interface DisassociateFraudsterResponse {
  Fraudster?: Fraudster;
}
export const DisassociateFraudsterResponse = S.suspend(() =>
  S.Struct({ Fraudster: S.optional(Fraudster) }),
).annotations({
  identifier: "DisassociateFraudsterResponse",
}) as any as S.Schema<DisassociateFraudsterResponse>;
export interface ListTagsForResourceResponse {
  Tags?: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface Speaker {
  DomainId?: string;
  CustomerSpeakerId?: string | Redacted.Redacted<string>;
  GeneratedSpeakerId?: string;
  Status?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  LastAccessedAt?: Date;
}
export const Speaker = S.suspend(() =>
  S.Struct({
    DomainId: S.optional(S.String),
    CustomerSpeakerId: S.optional(SensitiveString),
    GeneratedSpeakerId: S.optional(S.String),
    Status: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastAccessedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Speaker" }) as any as S.Schema<Speaker>;
export interface OptOutSpeakerResponse {
  Speaker?: Speaker;
}
export const OptOutSpeakerResponse = S.suspend(() =>
  S.Struct({ Speaker: S.optional(Speaker) }),
).annotations({
  identifier: "OptOutSpeakerResponse",
}) as any as S.Schema<OptOutSpeakerResponse>;
export interface StartFraudsterRegistrationJobRequest {
  ClientToken?: string;
  JobName?: string | Redacted.Redacted<string>;
  DomainId: string;
  DataAccessRoleArn: string;
  RegistrationConfig?: RegistrationConfig;
  InputDataConfig: InputDataConfig;
  OutputDataConfig: OutputDataConfig;
}
export const StartFraudsterRegistrationJobRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String),
    JobName: S.optional(SensitiveString),
    DomainId: S.String,
    DataAccessRoleArn: S.String,
    RegistrationConfig: S.optional(RegistrationConfig),
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartFraudsterRegistrationJobRequest",
}) as any as S.Schema<StartFraudsterRegistrationJobRequest>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: TagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UpdateWatchlistResponse {
  Watchlist?: Watchlist;
}
export const UpdateWatchlistResponse = S.suspend(() =>
  S.Struct({ Watchlist: S.optional(Watchlist) }),
).annotations({
  identifier: "UpdateWatchlistResponse",
}) as any as S.Schema<UpdateWatchlistResponse>;
export interface CreateDomainRequest {
  Name: string | Redacted.Redacted<string>;
  Description?: string | Redacted.Redacted<string>;
  ServerSideEncryptionConfiguration: ServerSideEncryptionConfiguration;
  ClientToken?: string;
  Tags?: TagList;
}
export const CreateDomainRequest = S.suspend(() =>
  S.Struct({
    Name: SensitiveString,
    Description: S.optional(SensitiveString),
    ServerSideEncryptionConfiguration: ServerSideEncryptionConfiguration,
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDomainRequest",
}) as any as S.Schema<CreateDomainRequest>;
export interface ServerSideEncryptionUpdateDetails {
  OldKmsKeyId?: string;
  UpdateStatus?: string;
  Message?: string;
}
export const ServerSideEncryptionUpdateDetails = S.suspend(() =>
  S.Struct({
    OldKmsKeyId: S.optional(S.String),
    UpdateStatus: S.optional(S.String),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "ServerSideEncryptionUpdateDetails",
}) as any as S.Schema<ServerSideEncryptionUpdateDetails>;
export interface WatchlistDetails {
  DefaultWatchlistId: string;
}
export const WatchlistDetails = S.suspend(() =>
  S.Struct({ DefaultWatchlistId: S.String }),
).annotations({
  identifier: "WatchlistDetails",
}) as any as S.Schema<WatchlistDetails>;
export interface Domain {
  DomainId?: string;
  Arn?: string;
  Name?: string | Redacted.Redacted<string>;
  Description?: string | Redacted.Redacted<string>;
  DomainStatus?: string;
  ServerSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  ServerSideEncryptionUpdateDetails?: ServerSideEncryptionUpdateDetails;
  WatchlistDetails?: WatchlistDetails;
}
export const Domain = S.suspend(() =>
  S.Struct({
    DomainId: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(SensitiveString),
    Description: S.optional(SensitiveString),
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
  }),
).annotations({ identifier: "Domain" }) as any as S.Schema<Domain>;
export interface UpdateDomainResponse {
  Domain?: Domain;
}
export const UpdateDomainResponse = S.suspend(() =>
  S.Struct({ Domain: S.optional(Domain) }),
).annotations({
  identifier: "UpdateDomainResponse",
}) as any as S.Schema<UpdateDomainResponse>;
export type FraudDetectionReasons = string[];
export const FraudDetectionReasons = S.Array(S.String);
export interface EnrollmentJobFraudDetectionConfig {
  FraudDetectionAction?: string;
  RiskThreshold?: number;
  WatchlistIds?: EnrollmentJobFraudDetectionConfigWatchlistIds;
}
export const EnrollmentJobFraudDetectionConfig = S.suspend(() =>
  S.Struct({
    FraudDetectionAction: S.optional(S.String),
    RiskThreshold: S.optional(S.Number),
    WatchlistIds: S.optional(EnrollmentJobFraudDetectionConfigWatchlistIds),
  }),
).annotations({
  identifier: "EnrollmentJobFraudDetectionConfig",
}) as any as S.Schema<EnrollmentJobFraudDetectionConfig>;
export interface EnrollmentConfig {
  ExistingEnrollmentAction?: string;
  FraudDetectionConfig?: EnrollmentJobFraudDetectionConfig;
}
export const EnrollmentConfig = S.suspend(() =>
  S.Struct({
    ExistingEnrollmentAction: S.optional(S.String),
    FraudDetectionConfig: S.optional(EnrollmentJobFraudDetectionConfig),
  }),
).annotations({
  identifier: "EnrollmentConfig",
}) as any as S.Schema<EnrollmentConfig>;
export interface FailureDetails {
  StatusCode?: number;
  Message?: string;
}
export const FailureDetails = S.suspend(() =>
  S.Struct({ StatusCode: S.optional(S.Number), Message: S.optional(S.String) }),
).annotations({
  identifier: "FailureDetails",
}) as any as S.Schema<FailureDetails>;
export interface JobProgress {
  PercentComplete?: number;
}
export const JobProgress = S.suspend(() =>
  S.Struct({ PercentComplete: S.optional(S.Number) }),
).annotations({ identifier: "JobProgress" }) as any as S.Schema<JobProgress>;
export interface SpeakerEnrollmentJob {
  JobName?: string | Redacted.Redacted<string>;
  JobId?: string;
  JobStatus?: string;
  DomainId?: string;
  DataAccessRoleArn?: string;
  EnrollmentConfig?: EnrollmentConfig;
  InputDataConfig?: InputDataConfig;
  OutputDataConfig?: OutputDataConfig;
  CreatedAt?: Date;
  EndedAt?: Date;
  FailureDetails?: FailureDetails;
  JobProgress?: JobProgress;
}
export const SpeakerEnrollmentJob = S.suspend(() =>
  S.Struct({
    JobName: S.optional(SensitiveString),
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
  }),
).annotations({
  identifier: "SpeakerEnrollmentJob",
}) as any as S.Schema<SpeakerEnrollmentJob>;
export interface FraudsterRegistrationJobSummary {
  JobName?: string | Redacted.Redacted<string>;
  JobId?: string;
  JobStatus?: string;
  DomainId?: string;
  CreatedAt?: Date;
  EndedAt?: Date;
  FailureDetails?: FailureDetails;
  JobProgress?: JobProgress;
}
export const FraudsterRegistrationJobSummary = S.suspend(() =>
  S.Struct({
    JobName: S.optional(SensitiveString),
    JobId: S.optional(S.String),
    JobStatus: S.optional(S.String),
    DomainId: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FailureDetails: S.optional(FailureDetails),
    JobProgress: S.optional(JobProgress),
  }),
).annotations({
  identifier: "FraudsterRegistrationJobSummary",
}) as any as S.Schema<FraudsterRegistrationJobSummary>;
export type FraudsterRegistrationJobSummaries =
  FraudsterRegistrationJobSummary[];
export const FraudsterRegistrationJobSummaries = S.Array(
  FraudsterRegistrationJobSummary,
);
export interface FraudsterSummary {
  DomainId?: string;
  GeneratedFraudsterId?: string;
  CreatedAt?: Date;
  WatchlistIds?: ResponseWatchlistIds;
}
export const FraudsterSummary = S.suspend(() =>
  S.Struct({
    DomainId: S.optional(S.String),
    GeneratedFraudsterId: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    WatchlistIds: S.optional(ResponseWatchlistIds),
  }),
).annotations({
  identifier: "FraudsterSummary",
}) as any as S.Schema<FraudsterSummary>;
export type FraudsterSummaries = FraudsterSummary[];
export const FraudsterSummaries = S.Array(FraudsterSummary);
export interface SpeakerEnrollmentJobSummary {
  JobName?: string | Redacted.Redacted<string>;
  JobId?: string;
  JobStatus?: string;
  DomainId?: string;
  CreatedAt?: Date;
  EndedAt?: Date;
  FailureDetails?: FailureDetails;
  JobProgress?: JobProgress;
}
export const SpeakerEnrollmentJobSummary = S.suspend(() =>
  S.Struct({
    JobName: S.optional(SensitiveString),
    JobId: S.optional(S.String),
    JobStatus: S.optional(S.String),
    DomainId: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FailureDetails: S.optional(FailureDetails),
    JobProgress: S.optional(JobProgress),
  }),
).annotations({
  identifier: "SpeakerEnrollmentJobSummary",
}) as any as S.Schema<SpeakerEnrollmentJobSummary>;
export type SpeakerEnrollmentJobSummaries = SpeakerEnrollmentJobSummary[];
export const SpeakerEnrollmentJobSummaries = S.Array(
  SpeakerEnrollmentJobSummary,
);
export interface SpeakerSummary {
  DomainId?: string;
  CustomerSpeakerId?: string | Redacted.Redacted<string>;
  GeneratedSpeakerId?: string;
  Status?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  LastAccessedAt?: Date;
}
export const SpeakerSummary = S.suspend(() =>
  S.Struct({
    DomainId: S.optional(S.String),
    CustomerSpeakerId: S.optional(SensitiveString),
    GeneratedSpeakerId: S.optional(S.String),
    Status: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastAccessedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "SpeakerSummary",
}) as any as S.Schema<SpeakerSummary>;
export type SpeakerSummaries = SpeakerSummary[];
export const SpeakerSummaries = S.Array(SpeakerSummary);
export interface WatchlistSummary {
  DomainId?: string;
  WatchlistId?: string;
  Name?: string | Redacted.Redacted<string>;
  Description?: string | Redacted.Redacted<string>;
  DefaultWatchlist?: boolean;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const WatchlistSummary = S.suspend(() =>
  S.Struct({
    DomainId: S.optional(S.String),
    WatchlistId: S.optional(S.String),
    Name: S.optional(SensitiveString),
    Description: S.optional(SensitiveString),
    DefaultWatchlist: S.optional(S.Boolean),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "WatchlistSummary",
}) as any as S.Schema<WatchlistSummary>;
export type WatchlistSummaries = WatchlistSummary[];
export const WatchlistSummaries = S.Array(WatchlistSummary);
export interface DomainSummary {
  DomainId?: string;
  Arn?: string;
  Name?: string | Redacted.Redacted<string>;
  Description?: string | Redacted.Redacted<string>;
  DomainStatus?: string;
  ServerSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  ServerSideEncryptionUpdateDetails?: ServerSideEncryptionUpdateDetails;
  WatchlistDetails?: WatchlistDetails;
}
export const DomainSummary = S.suspend(() =>
  S.Struct({
    DomainId: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(SensitiveString),
    Description: S.optional(SensitiveString),
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
  }),
).annotations({
  identifier: "DomainSummary",
}) as any as S.Schema<DomainSummary>;
export type DomainSummaries = DomainSummary[];
export const DomainSummaries = S.Array(DomainSummary);
export interface AssociateFraudsterResponse {
  Fraudster?: Fraudster;
}
export const AssociateFraudsterResponse = S.suspend(() =>
  S.Struct({ Fraudster: S.optional(Fraudster) }),
).annotations({
  identifier: "AssociateFraudsterResponse",
}) as any as S.Schema<AssociateFraudsterResponse>;
export interface CreateWatchlistResponse {
  Watchlist?: Watchlist;
}
export const CreateWatchlistResponse = S.suspend(() =>
  S.Struct({ Watchlist: S.optional(Watchlist) }),
).annotations({
  identifier: "CreateWatchlistResponse",
}) as any as S.Schema<CreateWatchlistResponse>;
export interface DescribeSpeakerResponse {
  Speaker?: Speaker;
}
export const DescribeSpeakerResponse = S.suspend(() =>
  S.Struct({ Speaker: S.optional(Speaker) }),
).annotations({
  identifier: "DescribeSpeakerResponse",
}) as any as S.Schema<DescribeSpeakerResponse>;
export interface DescribeSpeakerEnrollmentJobResponse {
  Job?: SpeakerEnrollmentJob;
}
export const DescribeSpeakerEnrollmentJobResponse = S.suspend(() =>
  S.Struct({ Job: S.optional(SpeakerEnrollmentJob) }),
).annotations({
  identifier: "DescribeSpeakerEnrollmentJobResponse",
}) as any as S.Schema<DescribeSpeakerEnrollmentJobResponse>;
export interface ListFraudsterRegistrationJobsResponse {
  JobSummaries?: FraudsterRegistrationJobSummaries;
  NextToken?: string;
}
export const ListFraudsterRegistrationJobsResponse = S.suspend(() =>
  S.Struct({
    JobSummaries: S.optional(FraudsterRegistrationJobSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFraudsterRegistrationJobsResponse",
}) as any as S.Schema<ListFraudsterRegistrationJobsResponse>;
export interface ListFraudstersResponse {
  FraudsterSummaries?: FraudsterSummaries;
  NextToken?: string;
}
export const ListFraudstersResponse = S.suspend(() =>
  S.Struct({
    FraudsterSummaries: S.optional(FraudsterSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFraudstersResponse",
}) as any as S.Schema<ListFraudstersResponse>;
export interface ListSpeakerEnrollmentJobsResponse {
  JobSummaries?: SpeakerEnrollmentJobSummaries;
  NextToken?: string;
}
export const ListSpeakerEnrollmentJobsResponse = S.suspend(() =>
  S.Struct({
    JobSummaries: S.optional(SpeakerEnrollmentJobSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSpeakerEnrollmentJobsResponse",
}) as any as S.Schema<ListSpeakerEnrollmentJobsResponse>;
export interface ListSpeakersResponse {
  SpeakerSummaries?: SpeakerSummaries;
  NextToken?: string;
}
export const ListSpeakersResponse = S.suspend(() =>
  S.Struct({
    SpeakerSummaries: S.optional(SpeakerSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSpeakersResponse",
}) as any as S.Schema<ListSpeakersResponse>;
export interface ListWatchlistsResponse {
  WatchlistSummaries?: WatchlistSummaries;
  NextToken?: string;
}
export const ListWatchlistsResponse = S.suspend(() =>
  S.Struct({
    WatchlistSummaries: S.optional(WatchlistSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWatchlistsResponse",
}) as any as S.Schema<ListWatchlistsResponse>;
export interface FraudsterRegistrationJob {
  JobName?: string | Redacted.Redacted<string>;
  JobId?: string;
  JobStatus?: string;
  DomainId?: string;
  DataAccessRoleArn?: string;
  RegistrationConfig?: RegistrationConfig;
  InputDataConfig?: InputDataConfig;
  OutputDataConfig?: OutputDataConfig;
  CreatedAt?: Date;
  EndedAt?: Date;
  FailureDetails?: FailureDetails;
  JobProgress?: JobProgress;
}
export const FraudsterRegistrationJob = S.suspend(() =>
  S.Struct({
    JobName: S.optional(SensitiveString),
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
  }),
).annotations({
  identifier: "FraudsterRegistrationJob",
}) as any as S.Schema<FraudsterRegistrationJob>;
export interface StartFraudsterRegistrationJobResponse {
  Job?: FraudsterRegistrationJob;
}
export const StartFraudsterRegistrationJobResponse = S.suspend(() =>
  S.Struct({ Job: S.optional(FraudsterRegistrationJob) }),
).annotations({
  identifier: "StartFraudsterRegistrationJobResponse",
}) as any as S.Schema<StartFraudsterRegistrationJobResponse>;
export interface StartSpeakerEnrollmentJobRequest {
  ClientToken?: string;
  JobName?: string | Redacted.Redacted<string>;
  DomainId: string;
  DataAccessRoleArn: string;
  EnrollmentConfig?: EnrollmentConfig;
  InputDataConfig: InputDataConfig;
  OutputDataConfig: OutputDataConfig;
}
export const StartSpeakerEnrollmentJobRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String),
    JobName: S.optional(SensitiveString),
    DomainId: S.String,
    DataAccessRoleArn: S.String,
    EnrollmentConfig: S.optional(EnrollmentConfig),
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartSpeakerEnrollmentJobRequest",
}) as any as S.Schema<StartSpeakerEnrollmentJobRequest>;
export interface CreateDomainResponse {
  Domain?: Domain;
}
export const CreateDomainResponse = S.suspend(() =>
  S.Struct({ Domain: S.optional(Domain) }),
).annotations({
  identifier: "CreateDomainResponse",
}) as any as S.Schema<CreateDomainResponse>;
export interface ListDomainsResponse {
  DomainSummaries?: DomainSummaries;
  NextToken?: string;
}
export const ListDomainsResponse = S.suspend(() =>
  S.Struct({
    DomainSummaries: S.optional(DomainSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDomainsResponse",
}) as any as S.Schema<ListDomainsResponse>;
export interface AuthenticationConfiguration {
  AcceptanceThreshold: number;
}
export const AuthenticationConfiguration = S.suspend(() =>
  S.Struct({ AcceptanceThreshold: S.Number }),
).annotations({
  identifier: "AuthenticationConfiguration",
}) as any as S.Schema<AuthenticationConfiguration>;
export interface FraudDetectionConfiguration {
  RiskThreshold?: number;
  WatchlistId?: string;
}
export const FraudDetectionConfiguration = S.suspend(() =>
  S.Struct({
    RiskThreshold: S.optional(S.Number),
    WatchlistId: S.optional(S.String),
  }),
).annotations({
  identifier: "FraudDetectionConfiguration",
}) as any as S.Schema<FraudDetectionConfiguration>;
export interface AuthenticationResult {
  AuthenticationResultId?: string;
  AudioAggregationStartedAt?: Date;
  AudioAggregationEndedAt?: Date;
  CustomerSpeakerId?: string | Redacted.Redacted<string>;
  GeneratedSpeakerId?: string;
  Decision?: string;
  Score?: number;
  Configuration?: AuthenticationConfiguration;
}
export const AuthenticationResult = S.suspend(() =>
  S.Struct({
    AuthenticationResultId: S.optional(S.String),
    AudioAggregationStartedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AudioAggregationEndedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CustomerSpeakerId: S.optional(SensitiveString),
    GeneratedSpeakerId: S.optional(S.String),
    Decision: S.optional(S.String),
    Score: S.optional(S.Number),
    Configuration: S.optional(AuthenticationConfiguration),
  }),
).annotations({
  identifier: "AuthenticationResult",
}) as any as S.Schema<AuthenticationResult>;
export interface KnownFraudsterRisk {
  RiskScore: number;
  GeneratedFraudsterId?: string;
}
export const KnownFraudsterRisk = S.suspend(() =>
  S.Struct({ RiskScore: S.Number, GeneratedFraudsterId: S.optional(S.String) }),
).annotations({
  identifier: "KnownFraudsterRisk",
}) as any as S.Schema<KnownFraudsterRisk>;
export interface VoiceSpoofingRisk {
  RiskScore: number;
}
export const VoiceSpoofingRisk = S.suspend(() =>
  S.Struct({ RiskScore: S.Number }),
).annotations({
  identifier: "VoiceSpoofingRisk",
}) as any as S.Schema<VoiceSpoofingRisk>;
export interface DescribeFraudsterRegistrationJobResponse {
  Job?: FraudsterRegistrationJob;
}
export const DescribeFraudsterRegistrationJobResponse = S.suspend(() =>
  S.Struct({ Job: S.optional(FraudsterRegistrationJob) }),
).annotations({
  identifier: "DescribeFraudsterRegistrationJobResponse",
}) as any as S.Schema<DescribeFraudsterRegistrationJobResponse>;
export interface StartSpeakerEnrollmentJobResponse {
  Job?: SpeakerEnrollmentJob;
}
export const StartSpeakerEnrollmentJobResponse = S.suspend(() =>
  S.Struct({ Job: S.optional(SpeakerEnrollmentJob) }),
).annotations({
  identifier: "StartSpeakerEnrollmentJobResponse",
}) as any as S.Schema<StartSpeakerEnrollmentJobResponse>;
export interface DescribeDomainResponse {
  Domain?: Domain;
}
export const DescribeDomainResponse = S.suspend(() =>
  S.Struct({ Domain: S.optional(Domain) }),
).annotations({
  identifier: "DescribeDomainResponse",
}) as any as S.Schema<DescribeDomainResponse>;
export interface FraudRiskDetails {
  KnownFraudsterRisk: KnownFraudsterRisk;
  VoiceSpoofingRisk: VoiceSpoofingRisk;
}
export const FraudRiskDetails = S.suspend(() =>
  S.Struct({
    KnownFraudsterRisk: KnownFraudsterRisk,
    VoiceSpoofingRisk: VoiceSpoofingRisk,
  }),
).annotations({
  identifier: "FraudRiskDetails",
}) as any as S.Schema<FraudRiskDetails>;
export interface FraudDetectionResult {
  FraudDetectionResultId?: string;
  AudioAggregationStartedAt?: Date;
  AudioAggregationEndedAt?: Date;
  Configuration?: FraudDetectionConfiguration;
  Decision?: string;
  Reasons?: FraudDetectionReasons;
  RiskDetails?: FraudRiskDetails;
}
export const FraudDetectionResult = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "FraudDetectionResult",
}) as any as S.Schema<FraudDetectionResult>;
export interface EvaluateSessionResponse {
  DomainId?: string;
  SessionId?: string;
  SessionName?: string;
  StreamingStatus?: string;
  AuthenticationResult?: AuthenticationResult;
  FraudDetectionResult?: FraudDetectionResult;
}
export const EvaluateSessionResponse = S.suspend(() =>
  S.Struct({
    DomainId: S.optional(S.String),
    SessionId: S.optional(S.String),
    SessionName: S.optional(S.String),
    StreamingStatus: S.optional(S.String),
    AuthenticationResult: S.optional(AuthenticationResult),
    FraudDetectionResult: S.optional(FraudDetectionResult),
  }),
).annotations({
  identifier: "EvaluateSessionResponse",
}) as any as S.Schema<EvaluateSessionResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String), ConflictType: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String), ResourceType: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists all the domains in the Amazon Web Services account.
 */
export const listDomains: {
  (
    input: ListDomainsRequest,
  ): Effect.Effect<
    ListDomainsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDomainsRequest,
  ) => Stream.Stream<
    ListDomainsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDomainsRequest,
  ) => Stream.Stream<
    DomainSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Starts a new batch fraudster registration job using provided details.
 */
export const startFraudsterRegistrationJob: (
  input: StartFraudsterRegistrationJobRequest,
) => Effect.Effect<
  StartFraudsterRegistrationJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDomain: (
  input: CreateDomainRequest,
) => Effect.Effect<
  CreateDomainResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const optOutSpeaker: (
  input: OptOutSpeakerRequest,
) => Effect.Effect<
  OptOutSpeakerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateFraudster: (
  input: AssociateFraudsterRequest,
) => Effect.Effect<
  AssociateFraudsterResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createWatchlist: (
  input: CreateWatchlistRequest,
) => Effect.Effect<
  CreateWatchlistResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeSpeaker: (
  input: DescribeSpeakerRequest,
) => Effect.Effect<
  DescribeSpeakerResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeSpeakerEnrollmentJob: (
  input: DescribeSpeakerEnrollmentJobRequest,
) => Effect.Effect<
  DescribeSpeakerEnrollmentJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listFraudsterRegistrationJobs: {
  (
    input: ListFraudsterRegistrationJobsRequest,
  ): Effect.Effect<
    ListFraudsterRegistrationJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFraudsterRegistrationJobsRequest,
  ) => Stream.Stream<
    ListFraudsterRegistrationJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFraudsterRegistrationJobsRequest,
  ) => Stream.Stream<
    FraudsterRegistrationJobSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listFraudsters: {
  (
    input: ListFraudstersRequest,
  ): Effect.Effect<
    ListFraudstersResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFraudstersRequest,
  ) => Stream.Stream<
    ListFraudstersResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFraudstersRequest,
  ) => Stream.Stream<
    FraudsterSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists all the speaker enrollment jobs in the domain with the specified
 * `JobStatus`. If `JobStatus` is not provided, this lists all
 * jobs with all possible speaker enrollment job statuses.
 */
export const listSpeakerEnrollmentJobs: {
  (
    input: ListSpeakerEnrollmentJobsRequest,
  ): Effect.Effect<
    ListSpeakerEnrollmentJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSpeakerEnrollmentJobsRequest,
  ) => Stream.Stream<
    ListSpeakerEnrollmentJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSpeakerEnrollmentJobsRequest,
  ) => Stream.Stream<
    SpeakerEnrollmentJobSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listSpeakers: {
  (
    input: ListSpeakersRequest,
  ): Effect.Effect<
    ListSpeakersResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSpeakersRequest,
  ) => Stream.Stream<
    ListSpeakersResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSpeakersRequest,
  ) => Stream.Stream<
    SpeakerSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists all watchlists in a specified domain.
 */
export const listWatchlists: {
  (
    input: ListWatchlistsRequest,
  ): Effect.Effect<
    ListWatchlistsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWatchlistsRequest,
  ) => Stream.Stream<
    ListWatchlistsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWatchlistsRequest,
  ) => Stream.Stream<
    WatchlistSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Disassociates the fraudsters from the watchlist specified. Voice ID always expects a
 * fraudster to be a part of at least one watchlist. If
 * you try to disassociate a fraudster from its only watchlist, a `ValidationException` is thrown.
 */
export const disassociateFraudster: (
  input: DisassociateFraudsterRequest,
) => Effect.Effect<
  DisassociateFraudsterResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Tags a Voice ID resource with the provided list of tags.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateWatchlist: (
  input: UpdateWatchlistRequest,
) => Effect.Effect<
  UpdateWatchlistResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDomain: (
  input: UpdateDomainRequest,
) => Effect.Effect<
  UpdateDomainResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSpeaker: (
  input: DeleteSpeakerRequest,
) => Effect.Effect<
  DeleteSpeakerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteWatchlist: (
  input: DeleteWatchlistRequest,
) => Effect.Effect<
  DeleteWatchlistResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDomain: (
  input: DeleteDomainRequest,
) => Effect.Effect<
  DeleteDomainResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeWatchlist: (
  input: DescribeWatchlistRequest,
) => Effect.Effect<
  DescribeWatchlistResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteFraudster: (
  input: DeleteFraudsterRequest,
) => Effect.Effect<
  DeleteFraudsterResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeFraudster: (
  input: DescribeFraudsterRequest,
) => Effect.Effect<
  DescribeFraudsterResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeFraudsterRegistrationJob: (
  input: DescribeFraudsterRegistrationJobRequest,
) => Effect.Effect<
  DescribeFraudsterRegistrationJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeDomain: (
  input: DescribeDomainRequest,
) => Effect.Effect<
  DescribeDomainResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const evaluateSession: (
  input: EvaluateSessionRequest,
) => Effect.Effect<
  EvaluateSessionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startSpeakerEnrollmentJob: (
  input: StartSpeakerEnrollmentJobRequest,
) => Effect.Effect<
  StartSpeakerEnrollmentJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));

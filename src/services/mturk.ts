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
const ns = T.XmlNamespace("http://requester.mturk.com/2017-01-17/");
const svc = T.AwsApiService({
  sdkId: "MTurk",
  serviceShapeName: "MTurkRequesterServiceV20170117",
});
const auth = T.AwsAuthSigv4({ name: "mturk-requester" });
const ver = T.ServiceVersion("2017-01-17");
const proto = T.AwsProtocolsAwsJson1_1();
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
              `https://mturk-requester-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://mturk-requester-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://mturk-requester.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        if (Region === "sandbox") {
          return e("https://mturk-requester-sandbox.us-east-1.amazonaws.com");
        }
        return e(
          `https://mturk-requester.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Integer = number;
export type EntityId = string;
export type CustomerId = string;
export type IdempotencyToken = string;
export type Long = number;
export type CurrencyAmount = string;
export type PaginationToken = string;
export type ResultSize = number;
export type ExceptionMessage = string;
export type TurkErrorCode = string;
export type CountryParameters = string;

//# Schemas
export interface GetAccountBalanceRequest {}
export const GetAccountBalanceRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccountBalanceRequest",
}) as any as S.Schema<GetAccountBalanceRequest>;
export type AssignmentStatusList = string[];
export const AssignmentStatusList = S.Array(S.String);
export type ReviewPolicyLevelList = string[];
export const ReviewPolicyLevelList = S.Array(S.String);
export type CustomerIdList = string[];
export const CustomerIdList = S.Array(S.String);
export interface AcceptQualificationRequestRequest {
  QualificationRequestId: string;
  IntegerValue?: number;
}
export const AcceptQualificationRequestRequest = S.suspend(() =>
  S.Struct({
    QualificationRequestId: S.String,
    IntegerValue: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptQualificationRequestRequest",
}) as any as S.Schema<AcceptQualificationRequestRequest>;
export interface AcceptQualificationRequestResponse {}
export const AcceptQualificationRequestResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AcceptQualificationRequestResponse",
}) as any as S.Schema<AcceptQualificationRequestResponse>;
export interface ApproveAssignmentRequest {
  AssignmentId: string;
  RequesterFeedback?: string;
  OverrideRejection?: boolean;
}
export const ApproveAssignmentRequest = S.suspend(() =>
  S.Struct({
    AssignmentId: S.String,
    RequesterFeedback: S.optional(S.String),
    OverrideRejection: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ApproveAssignmentRequest",
}) as any as S.Schema<ApproveAssignmentRequest>;
export interface ApproveAssignmentResponse {}
export const ApproveAssignmentResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ApproveAssignmentResponse",
}) as any as S.Schema<ApproveAssignmentResponse>;
export interface AssociateQualificationWithWorkerRequest {
  QualificationTypeId: string;
  WorkerId: string;
  IntegerValue?: number;
  SendNotification?: boolean;
}
export const AssociateQualificationWithWorkerRequest = S.suspend(() =>
  S.Struct({
    QualificationTypeId: S.String,
    WorkerId: S.String,
    IntegerValue: S.optional(S.Number),
    SendNotification: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateQualificationWithWorkerRequest",
}) as any as S.Schema<AssociateQualificationWithWorkerRequest>;
export interface AssociateQualificationWithWorkerResponse {}
export const AssociateQualificationWithWorkerResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AssociateQualificationWithWorkerResponse",
}) as any as S.Schema<AssociateQualificationWithWorkerResponse>;
export interface CreateAdditionalAssignmentsForHITRequest {
  HITId: string;
  NumberOfAdditionalAssignments: number;
  UniqueRequestToken?: string;
}
export const CreateAdditionalAssignmentsForHITRequest = S.suspend(() =>
  S.Struct({
    HITId: S.String,
    NumberOfAdditionalAssignments: S.Number,
    UniqueRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAdditionalAssignmentsForHITRequest",
}) as any as S.Schema<CreateAdditionalAssignmentsForHITRequest>;
export interface CreateAdditionalAssignmentsForHITResponse {}
export const CreateAdditionalAssignmentsForHITResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateAdditionalAssignmentsForHITResponse",
}) as any as S.Schema<CreateAdditionalAssignmentsForHITResponse>;
export type IntegerList = number[];
export const IntegerList = S.Array(S.Number);
export interface Locale {
  Country: string;
  Subdivision?: string;
}
export const Locale = S.suspend(() =>
  S.Struct({ Country: S.String, Subdivision: S.optional(S.String) }),
).annotations({ identifier: "Locale" }) as any as S.Schema<Locale>;
export type LocaleList = Locale[];
export const LocaleList = S.Array(Locale);
export interface QualificationRequirement {
  QualificationTypeId: string;
  Comparator: string;
  IntegerValues?: IntegerList;
  LocaleValues?: LocaleList;
  RequiredToPreview?: boolean;
  ActionsGuarded?: string;
}
export const QualificationRequirement = S.suspend(() =>
  S.Struct({
    QualificationTypeId: S.String,
    Comparator: S.String,
    IntegerValues: S.optional(IntegerList),
    LocaleValues: S.optional(LocaleList),
    RequiredToPreview: S.optional(S.Boolean),
    ActionsGuarded: S.optional(S.String),
  }),
).annotations({
  identifier: "QualificationRequirement",
}) as any as S.Schema<QualificationRequirement>;
export type QualificationRequirementList = QualificationRequirement[];
export const QualificationRequirementList = S.Array(QualificationRequirement);
export interface CreateHITTypeRequest {
  AutoApprovalDelayInSeconds?: number;
  AssignmentDurationInSeconds: number;
  Reward: string;
  Title: string;
  Keywords?: string;
  Description: string;
  QualificationRequirements?: QualificationRequirementList;
}
export const CreateHITTypeRequest = S.suspend(() =>
  S.Struct({
    AutoApprovalDelayInSeconds: S.optional(S.Number),
    AssignmentDurationInSeconds: S.Number,
    Reward: S.String,
    Title: S.String,
    Keywords: S.optional(S.String),
    Description: S.String,
    QualificationRequirements: S.optional(QualificationRequirementList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateHITTypeRequest",
}) as any as S.Schema<CreateHITTypeRequest>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface ParameterMapEntry {
  Key?: string;
  Values?: StringList;
}
export const ParameterMapEntry = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Values: S.optional(StringList) }),
).annotations({
  identifier: "ParameterMapEntry",
}) as any as S.Schema<ParameterMapEntry>;
export type ParameterMapEntryList = ParameterMapEntry[];
export const ParameterMapEntryList = S.Array(ParameterMapEntry);
export interface PolicyParameter {
  Key?: string;
  Values?: StringList;
  MapEntries?: ParameterMapEntryList;
}
export const PolicyParameter = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Values: S.optional(StringList),
    MapEntries: S.optional(ParameterMapEntryList),
  }),
).annotations({
  identifier: "PolicyParameter",
}) as any as S.Schema<PolicyParameter>;
export type PolicyParameterList = PolicyParameter[];
export const PolicyParameterList = S.Array(PolicyParameter);
export interface ReviewPolicy {
  PolicyName: string;
  Parameters?: PolicyParameterList;
}
export const ReviewPolicy = S.suspend(() =>
  S.Struct({
    PolicyName: S.String,
    Parameters: S.optional(PolicyParameterList),
  }),
).annotations({ identifier: "ReviewPolicy" }) as any as S.Schema<ReviewPolicy>;
export interface HITLayoutParameter {
  Name: string;
  Value: string;
}
export const HITLayoutParameter = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({
  identifier: "HITLayoutParameter",
}) as any as S.Schema<HITLayoutParameter>;
export type HITLayoutParameterList = HITLayoutParameter[];
export const HITLayoutParameterList = S.Array(HITLayoutParameter);
export interface CreateHITWithHITTypeRequest {
  HITTypeId: string;
  MaxAssignments?: number;
  LifetimeInSeconds: number;
  Question?: string;
  RequesterAnnotation?: string;
  UniqueRequestToken?: string;
  AssignmentReviewPolicy?: ReviewPolicy;
  HITReviewPolicy?: ReviewPolicy;
  HITLayoutId?: string;
  HITLayoutParameters?: HITLayoutParameterList;
}
export const CreateHITWithHITTypeRequest = S.suspend(() =>
  S.Struct({
    HITTypeId: S.String,
    MaxAssignments: S.optional(S.Number),
    LifetimeInSeconds: S.Number,
    Question: S.optional(S.String),
    RequesterAnnotation: S.optional(S.String),
    UniqueRequestToken: S.optional(S.String),
    AssignmentReviewPolicy: S.optional(ReviewPolicy),
    HITReviewPolicy: S.optional(ReviewPolicy),
    HITLayoutId: S.optional(S.String),
    HITLayoutParameters: S.optional(HITLayoutParameterList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateHITWithHITTypeRequest",
}) as any as S.Schema<CreateHITWithHITTypeRequest>;
export interface CreateQualificationTypeRequest {
  Name: string;
  Keywords?: string;
  Description: string;
  QualificationTypeStatus: string;
  RetryDelayInSeconds?: number;
  Test?: string;
  AnswerKey?: string;
  TestDurationInSeconds?: number;
  AutoGranted?: boolean;
  AutoGrantedValue?: number;
}
export const CreateQualificationTypeRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Keywords: S.optional(S.String),
    Description: S.String,
    QualificationTypeStatus: S.String,
    RetryDelayInSeconds: S.optional(S.Number),
    Test: S.optional(S.String),
    AnswerKey: S.optional(S.String),
    TestDurationInSeconds: S.optional(S.Number),
    AutoGranted: S.optional(S.Boolean),
    AutoGrantedValue: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateQualificationTypeRequest",
}) as any as S.Schema<CreateQualificationTypeRequest>;
export interface CreateWorkerBlockRequest {
  WorkerId: string;
  Reason: string;
}
export const CreateWorkerBlockRequest = S.suspend(() =>
  S.Struct({ WorkerId: S.String, Reason: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWorkerBlockRequest",
}) as any as S.Schema<CreateWorkerBlockRequest>;
export interface CreateWorkerBlockResponse {}
export const CreateWorkerBlockResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateWorkerBlockResponse",
}) as any as S.Schema<CreateWorkerBlockResponse>;
export interface DeleteHITRequest {
  HITId: string;
}
export const DeleteHITRequest = S.suspend(() =>
  S.Struct({ HITId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteHITRequest",
}) as any as S.Schema<DeleteHITRequest>;
export interface DeleteHITResponse {}
export const DeleteHITResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteHITResponse",
}) as any as S.Schema<DeleteHITResponse>;
export interface DeleteQualificationTypeRequest {
  QualificationTypeId: string;
}
export const DeleteQualificationTypeRequest = S.suspend(() =>
  S.Struct({ QualificationTypeId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteQualificationTypeRequest",
}) as any as S.Schema<DeleteQualificationTypeRequest>;
export interface DeleteQualificationTypeResponse {}
export const DeleteQualificationTypeResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteQualificationTypeResponse",
}) as any as S.Schema<DeleteQualificationTypeResponse>;
export interface DeleteWorkerBlockRequest {
  WorkerId: string;
  Reason?: string;
}
export const DeleteWorkerBlockRequest = S.suspend(() =>
  S.Struct({ WorkerId: S.String, Reason: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWorkerBlockRequest",
}) as any as S.Schema<DeleteWorkerBlockRequest>;
export interface DeleteWorkerBlockResponse {}
export const DeleteWorkerBlockResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteWorkerBlockResponse",
}) as any as S.Schema<DeleteWorkerBlockResponse>;
export interface DisassociateQualificationFromWorkerRequest {
  WorkerId: string;
  QualificationTypeId: string;
  Reason?: string;
}
export const DisassociateQualificationFromWorkerRequest = S.suspend(() =>
  S.Struct({
    WorkerId: S.String,
    QualificationTypeId: S.String,
    Reason: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateQualificationFromWorkerRequest",
}) as any as S.Schema<DisassociateQualificationFromWorkerRequest>;
export interface DisassociateQualificationFromWorkerResponse {}
export const DisassociateQualificationFromWorkerResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisassociateQualificationFromWorkerResponse",
}) as any as S.Schema<DisassociateQualificationFromWorkerResponse>;
export interface GetAccountBalanceResponse {
  AvailableBalance?: string;
  OnHoldBalance?: string;
}
export const GetAccountBalanceResponse = S.suspend(() =>
  S.Struct({
    AvailableBalance: S.optional(S.String),
    OnHoldBalance: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetAccountBalanceResponse",
}) as any as S.Schema<GetAccountBalanceResponse>;
export interface GetAssignmentRequest {
  AssignmentId: string;
}
export const GetAssignmentRequest = S.suspend(() =>
  S.Struct({ AssignmentId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAssignmentRequest",
}) as any as S.Schema<GetAssignmentRequest>;
export interface GetFileUploadURLRequest {
  AssignmentId: string;
  QuestionIdentifier: string;
}
export const GetFileUploadURLRequest = S.suspend(() =>
  S.Struct({ AssignmentId: S.String, QuestionIdentifier: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFileUploadURLRequest",
}) as any as S.Schema<GetFileUploadURLRequest>;
export interface GetHITRequest {
  HITId: string;
}
export const GetHITRequest = S.suspend(() =>
  S.Struct({ HITId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetHITRequest",
}) as any as S.Schema<GetHITRequest>;
export interface GetQualificationScoreRequest {
  QualificationTypeId: string;
  WorkerId: string;
}
export const GetQualificationScoreRequest = S.suspend(() =>
  S.Struct({ QualificationTypeId: S.String, WorkerId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetQualificationScoreRequest",
}) as any as S.Schema<GetQualificationScoreRequest>;
export interface GetQualificationTypeRequest {
  QualificationTypeId: string;
}
export const GetQualificationTypeRequest = S.suspend(() =>
  S.Struct({ QualificationTypeId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetQualificationTypeRequest",
}) as any as S.Schema<GetQualificationTypeRequest>;
export interface ListAssignmentsForHITRequest {
  HITId: string;
  NextToken?: string;
  MaxResults?: number;
  AssignmentStatuses?: AssignmentStatusList;
}
export const ListAssignmentsForHITRequest = S.suspend(() =>
  S.Struct({
    HITId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    AssignmentStatuses: S.optional(AssignmentStatusList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssignmentsForHITRequest",
}) as any as S.Schema<ListAssignmentsForHITRequest>;
export interface ListBonusPaymentsRequest {
  HITId?: string;
  AssignmentId?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListBonusPaymentsRequest = S.suspend(() =>
  S.Struct({
    HITId: S.optional(S.String),
    AssignmentId: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBonusPaymentsRequest",
}) as any as S.Schema<ListBonusPaymentsRequest>;
export interface ListHITsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListHITsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListHITsRequest",
}) as any as S.Schema<ListHITsRequest>;
export interface ListHITsForQualificationTypeRequest {
  QualificationTypeId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListHITsForQualificationTypeRequest = S.suspend(() =>
  S.Struct({
    QualificationTypeId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListHITsForQualificationTypeRequest",
}) as any as S.Schema<ListHITsForQualificationTypeRequest>;
export interface ListQualificationRequestsRequest {
  QualificationTypeId?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListQualificationRequestsRequest = S.suspend(() =>
  S.Struct({
    QualificationTypeId: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListQualificationRequestsRequest",
}) as any as S.Schema<ListQualificationRequestsRequest>;
export interface ListQualificationTypesRequest {
  Query?: string;
  MustBeRequestable: boolean;
  MustBeOwnedByCaller?: boolean;
  NextToken?: string;
  MaxResults?: number;
}
export const ListQualificationTypesRequest = S.suspend(() =>
  S.Struct({
    Query: S.optional(S.String),
    MustBeRequestable: S.Boolean,
    MustBeOwnedByCaller: S.optional(S.Boolean),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListQualificationTypesRequest",
}) as any as S.Schema<ListQualificationTypesRequest>;
export interface ListReviewableHITsRequest {
  HITTypeId?: string;
  Status?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListReviewableHITsRequest = S.suspend(() =>
  S.Struct({
    HITTypeId: S.optional(S.String),
    Status: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReviewableHITsRequest",
}) as any as S.Schema<ListReviewableHITsRequest>;
export interface ListReviewPolicyResultsForHITRequest {
  HITId: string;
  PolicyLevels?: ReviewPolicyLevelList;
  RetrieveActions?: boolean;
  RetrieveResults?: boolean;
  NextToken?: string;
  MaxResults?: number;
}
export const ListReviewPolicyResultsForHITRequest = S.suspend(() =>
  S.Struct({
    HITId: S.String,
    PolicyLevels: S.optional(ReviewPolicyLevelList),
    RetrieveActions: S.optional(S.Boolean),
    RetrieveResults: S.optional(S.Boolean),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReviewPolicyResultsForHITRequest",
}) as any as S.Schema<ListReviewPolicyResultsForHITRequest>;
export interface ListWorkerBlocksRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListWorkerBlocksRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWorkerBlocksRequest",
}) as any as S.Schema<ListWorkerBlocksRequest>;
export interface ListWorkersWithQualificationTypeRequest {
  QualificationTypeId: string;
  Status?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListWorkersWithQualificationTypeRequest = S.suspend(() =>
  S.Struct({
    QualificationTypeId: S.String,
    Status: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWorkersWithQualificationTypeRequest",
}) as any as S.Schema<ListWorkersWithQualificationTypeRequest>;
export interface NotifyWorkersRequest {
  Subject: string;
  MessageText: string;
  WorkerIds: CustomerIdList;
}
export const NotifyWorkersRequest = S.suspend(() =>
  S.Struct({
    Subject: S.String,
    MessageText: S.String,
    WorkerIds: CustomerIdList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "NotifyWorkersRequest",
}) as any as S.Schema<NotifyWorkersRequest>;
export interface RejectAssignmentRequest {
  AssignmentId: string;
  RequesterFeedback: string;
}
export const RejectAssignmentRequest = S.suspend(() =>
  S.Struct({ AssignmentId: S.String, RequesterFeedback: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RejectAssignmentRequest",
}) as any as S.Schema<RejectAssignmentRequest>;
export interface RejectAssignmentResponse {}
export const RejectAssignmentResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RejectAssignmentResponse",
}) as any as S.Schema<RejectAssignmentResponse>;
export interface RejectQualificationRequestRequest {
  QualificationRequestId: string;
  Reason?: string;
}
export const RejectQualificationRequestRequest = S.suspend(() =>
  S.Struct({
    QualificationRequestId: S.String,
    Reason: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RejectQualificationRequestRequest",
}) as any as S.Schema<RejectQualificationRequestRequest>;
export interface RejectQualificationRequestResponse {}
export const RejectQualificationRequestResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RejectQualificationRequestResponse",
}) as any as S.Schema<RejectQualificationRequestResponse>;
export interface SendBonusRequest {
  WorkerId: string;
  BonusAmount: string;
  AssignmentId: string;
  Reason: string;
  UniqueRequestToken?: string;
}
export const SendBonusRequest = S.suspend(() =>
  S.Struct({
    WorkerId: S.String,
    BonusAmount: S.String,
    AssignmentId: S.String,
    Reason: S.String,
    UniqueRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendBonusRequest",
}) as any as S.Schema<SendBonusRequest>;
export interface SendBonusResponse {}
export const SendBonusResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SendBonusResponse",
}) as any as S.Schema<SendBonusResponse>;
export interface UpdateExpirationForHITRequest {
  HITId: string;
  ExpireAt: Date;
}
export const UpdateExpirationForHITRequest = S.suspend(() =>
  S.Struct({
    HITId: S.String,
    ExpireAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateExpirationForHITRequest",
}) as any as S.Schema<UpdateExpirationForHITRequest>;
export interface UpdateExpirationForHITResponse {}
export const UpdateExpirationForHITResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateExpirationForHITResponse",
}) as any as S.Schema<UpdateExpirationForHITResponse>;
export interface UpdateHITReviewStatusRequest {
  HITId: string;
  Revert?: boolean;
}
export const UpdateHITReviewStatusRequest = S.suspend(() =>
  S.Struct({ HITId: S.String, Revert: S.optional(S.Boolean) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateHITReviewStatusRequest",
}) as any as S.Schema<UpdateHITReviewStatusRequest>;
export interface UpdateHITReviewStatusResponse {}
export const UpdateHITReviewStatusResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateHITReviewStatusResponse",
}) as any as S.Schema<UpdateHITReviewStatusResponse>;
export interface UpdateHITTypeOfHITRequest {
  HITId: string;
  HITTypeId: string;
}
export const UpdateHITTypeOfHITRequest = S.suspend(() =>
  S.Struct({ HITId: S.String, HITTypeId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateHITTypeOfHITRequest",
}) as any as S.Schema<UpdateHITTypeOfHITRequest>;
export interface UpdateHITTypeOfHITResponse {}
export const UpdateHITTypeOfHITResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateHITTypeOfHITResponse",
}) as any as S.Schema<UpdateHITTypeOfHITResponse>;
export type EventTypeList = string[];
export const EventTypeList = S.Array(S.String);
export interface NotificationSpecification {
  Destination: string;
  Transport: string;
  Version: string;
  EventTypes: EventTypeList;
}
export const NotificationSpecification = S.suspend(() =>
  S.Struct({
    Destination: S.String,
    Transport: S.String,
    Version: S.String,
    EventTypes: EventTypeList,
  }),
).annotations({
  identifier: "NotificationSpecification",
}) as any as S.Schema<NotificationSpecification>;
export interface UpdateNotificationSettingsRequest {
  HITTypeId: string;
  Notification?: NotificationSpecification;
  Active?: boolean;
}
export const UpdateNotificationSettingsRequest = S.suspend(() =>
  S.Struct({
    HITTypeId: S.String,
    Notification: S.optional(NotificationSpecification),
    Active: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateNotificationSettingsRequest",
}) as any as S.Schema<UpdateNotificationSettingsRequest>;
export interface UpdateNotificationSettingsResponse {}
export const UpdateNotificationSettingsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateNotificationSettingsResponse",
}) as any as S.Schema<UpdateNotificationSettingsResponse>;
export interface UpdateQualificationTypeRequest {
  QualificationTypeId: string;
  Description?: string;
  QualificationTypeStatus?: string;
  Test?: string;
  AnswerKey?: string;
  TestDurationInSeconds?: number;
  RetryDelayInSeconds?: number;
  AutoGranted?: boolean;
  AutoGrantedValue?: number;
}
export const UpdateQualificationTypeRequest = S.suspend(() =>
  S.Struct({
    QualificationTypeId: S.String,
    Description: S.optional(S.String),
    QualificationTypeStatus: S.optional(S.String),
    Test: S.optional(S.String),
    AnswerKey: S.optional(S.String),
    TestDurationInSeconds: S.optional(S.Number),
    RetryDelayInSeconds: S.optional(S.Number),
    AutoGranted: S.optional(S.Boolean),
    AutoGrantedValue: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateQualificationTypeRequest",
}) as any as S.Schema<UpdateQualificationTypeRequest>;
export interface Assignment {
  AssignmentId?: string;
  WorkerId?: string;
  HITId?: string;
  AssignmentStatus?: string;
  AutoApprovalTime?: Date;
  AcceptTime?: Date;
  SubmitTime?: Date;
  ApprovalTime?: Date;
  RejectionTime?: Date;
  Deadline?: Date;
  Answer?: string;
  RequesterFeedback?: string;
}
export const Assignment = S.suspend(() =>
  S.Struct({
    AssignmentId: S.optional(S.String),
    WorkerId: S.optional(S.String),
    HITId: S.optional(S.String),
    AssignmentStatus: S.optional(S.String),
    AutoApprovalTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AcceptTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SubmitTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ApprovalTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    RejectionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Deadline: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Answer: S.optional(S.String),
    RequesterFeedback: S.optional(S.String),
  }),
).annotations({ identifier: "Assignment" }) as any as S.Schema<Assignment>;
export type AssignmentList = Assignment[];
export const AssignmentList = S.Array(Assignment);
export interface HIT {
  HITId?: string;
  HITTypeId?: string;
  HITGroupId?: string;
  HITLayoutId?: string;
  CreationTime?: Date;
  Title?: string;
  Description?: string;
  Question?: string;
  Keywords?: string;
  HITStatus?: string;
  MaxAssignments?: number;
  Reward?: string;
  AutoApprovalDelayInSeconds?: number;
  Expiration?: Date;
  AssignmentDurationInSeconds?: number;
  RequesterAnnotation?: string;
  QualificationRequirements?: QualificationRequirementList;
  HITReviewStatus?: string;
  NumberOfAssignmentsPending?: number;
  NumberOfAssignmentsAvailable?: number;
  NumberOfAssignmentsCompleted?: number;
}
export const HIT = S.suspend(() =>
  S.Struct({
    HITId: S.optional(S.String),
    HITTypeId: S.optional(S.String),
    HITGroupId: S.optional(S.String),
    HITLayoutId: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Title: S.optional(S.String),
    Description: S.optional(S.String),
    Question: S.optional(S.String),
    Keywords: S.optional(S.String),
    HITStatus: S.optional(S.String),
    MaxAssignments: S.optional(S.Number),
    Reward: S.optional(S.String),
    AutoApprovalDelayInSeconds: S.optional(S.Number),
    Expiration: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AssignmentDurationInSeconds: S.optional(S.Number),
    RequesterAnnotation: S.optional(S.String),
    QualificationRequirements: S.optional(QualificationRequirementList),
    HITReviewStatus: S.optional(S.String),
    NumberOfAssignmentsPending: S.optional(S.Number),
    NumberOfAssignmentsAvailable: S.optional(S.Number),
    NumberOfAssignmentsCompleted: S.optional(S.Number),
  }),
).annotations({ identifier: "HIT" }) as any as S.Schema<HIT>;
export type HITList = HIT[];
export const HITList = S.Array(HIT);
export interface QualificationType {
  QualificationTypeId?: string;
  CreationTime?: Date;
  Name?: string;
  Description?: string;
  Keywords?: string;
  QualificationTypeStatus?: string;
  Test?: string;
  TestDurationInSeconds?: number;
  AnswerKey?: string;
  RetryDelayInSeconds?: number;
  IsRequestable?: boolean;
  AutoGranted?: boolean;
  AutoGrantedValue?: number;
}
export const QualificationType = S.suspend(() =>
  S.Struct({
    QualificationTypeId: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Keywords: S.optional(S.String),
    QualificationTypeStatus: S.optional(S.String),
    Test: S.optional(S.String),
    TestDurationInSeconds: S.optional(S.Number),
    AnswerKey: S.optional(S.String),
    RetryDelayInSeconds: S.optional(S.Number),
    IsRequestable: S.optional(S.Boolean),
    AutoGranted: S.optional(S.Boolean),
    AutoGrantedValue: S.optional(S.Number),
  }),
).annotations({
  identifier: "QualificationType",
}) as any as S.Schema<QualificationType>;
export type QualificationTypeList = QualificationType[];
export const QualificationTypeList = S.Array(QualificationType);
export interface Qualification {
  QualificationTypeId?: string;
  WorkerId?: string;
  GrantTime?: Date;
  IntegerValue?: number;
  LocaleValue?: Locale;
  Status?: string;
}
export const Qualification = S.suspend(() =>
  S.Struct({
    QualificationTypeId: S.optional(S.String),
    WorkerId: S.optional(S.String),
    GrantTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    IntegerValue: S.optional(S.Number),
    LocaleValue: S.optional(Locale),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "Qualification",
}) as any as S.Schema<Qualification>;
export type QualificationList = Qualification[];
export const QualificationList = S.Array(Qualification);
export interface CreateHITTypeResponse {
  HITTypeId?: string;
}
export const CreateHITTypeResponse = S.suspend(() =>
  S.Struct({ HITTypeId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateHITTypeResponse",
}) as any as S.Schema<CreateHITTypeResponse>;
export interface GetFileUploadURLResponse {
  FileUploadURL?: string;
}
export const GetFileUploadURLResponse = S.suspend(() =>
  S.Struct({ FileUploadURL: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GetFileUploadURLResponse",
}) as any as S.Schema<GetFileUploadURLResponse>;
export interface GetHITResponse {
  HIT?: HIT;
}
export const GetHITResponse = S.suspend(() =>
  S.Struct({ HIT: S.optional(HIT) }).pipe(ns),
).annotations({
  identifier: "GetHITResponse",
}) as any as S.Schema<GetHITResponse>;
export interface GetQualificationTypeResponse {
  QualificationType?: QualificationType;
}
export const GetQualificationTypeResponse = S.suspend(() =>
  S.Struct({ QualificationType: S.optional(QualificationType) }).pipe(ns),
).annotations({
  identifier: "GetQualificationTypeResponse",
}) as any as S.Schema<GetQualificationTypeResponse>;
export interface ListAssignmentsForHITResponse {
  NextToken?: string;
  NumResults?: number;
  Assignments?: AssignmentList;
}
export const ListAssignmentsForHITResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    NumResults: S.optional(S.Number),
    Assignments: S.optional(AssignmentList),
  }).pipe(ns),
).annotations({
  identifier: "ListAssignmentsForHITResponse",
}) as any as S.Schema<ListAssignmentsForHITResponse>;
export interface ListHITsResponse {
  NextToken?: string;
  NumResults?: number;
  HITs?: HITList;
}
export const ListHITsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    NumResults: S.optional(S.Number),
    HITs: S.optional(HITList),
  }).pipe(ns),
).annotations({
  identifier: "ListHITsResponse",
}) as any as S.Schema<ListHITsResponse>;
export interface ListHITsForQualificationTypeResponse {
  NextToken?: string;
  NumResults?: number;
  HITs?: HITList;
}
export const ListHITsForQualificationTypeResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    NumResults: S.optional(S.Number),
    HITs: S.optional(HITList),
  }).pipe(ns),
).annotations({
  identifier: "ListHITsForQualificationTypeResponse",
}) as any as S.Schema<ListHITsForQualificationTypeResponse>;
export interface ListQualificationTypesResponse {
  NumResults?: number;
  NextToken?: string;
  QualificationTypes?: QualificationTypeList;
}
export const ListQualificationTypesResponse = S.suspend(() =>
  S.Struct({
    NumResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    QualificationTypes: S.optional(QualificationTypeList),
  }).pipe(ns),
).annotations({
  identifier: "ListQualificationTypesResponse",
}) as any as S.Schema<ListQualificationTypesResponse>;
export interface ListReviewableHITsResponse {
  NextToken?: string;
  NumResults?: number;
  HITs?: HITList;
}
export const ListReviewableHITsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    NumResults: S.optional(S.Number),
    HITs: S.optional(HITList),
  }).pipe(ns),
).annotations({
  identifier: "ListReviewableHITsResponse",
}) as any as S.Schema<ListReviewableHITsResponse>;
export interface ListWorkersWithQualificationTypeResponse {
  NextToken?: string;
  NumResults?: number;
  Qualifications?: QualificationList;
}
export const ListWorkersWithQualificationTypeResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    NumResults: S.optional(S.Number),
    Qualifications: S.optional(QualificationList),
  }).pipe(ns),
).annotations({
  identifier: "ListWorkersWithQualificationTypeResponse",
}) as any as S.Schema<ListWorkersWithQualificationTypeResponse>;
export interface SendTestEventNotificationRequest {
  Notification: NotificationSpecification;
  TestEventType: string;
}
export const SendTestEventNotificationRequest = S.suspend(() =>
  S.Struct({
    Notification: NotificationSpecification,
    TestEventType: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendTestEventNotificationRequest",
}) as any as S.Schema<SendTestEventNotificationRequest>;
export interface SendTestEventNotificationResponse {}
export const SendTestEventNotificationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SendTestEventNotificationResponse",
}) as any as S.Schema<SendTestEventNotificationResponse>;
export interface UpdateQualificationTypeResponse {
  QualificationType?: QualificationType;
}
export const UpdateQualificationTypeResponse = S.suspend(() =>
  S.Struct({ QualificationType: S.optional(QualificationType) }).pipe(ns),
).annotations({
  identifier: "UpdateQualificationTypeResponse",
}) as any as S.Schema<UpdateQualificationTypeResponse>;
export interface BonusPayment {
  WorkerId?: string;
  BonusAmount?: string;
  AssignmentId?: string;
  Reason?: string;
  GrantTime?: Date;
}
export const BonusPayment = S.suspend(() =>
  S.Struct({
    WorkerId: S.optional(S.String),
    BonusAmount: S.optional(S.String),
    AssignmentId: S.optional(S.String),
    Reason: S.optional(S.String),
    GrantTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "BonusPayment" }) as any as S.Schema<BonusPayment>;
export type BonusPaymentList = BonusPayment[];
export const BonusPaymentList = S.Array(BonusPayment);
export interface QualificationRequest {
  QualificationRequestId?: string;
  QualificationTypeId?: string;
  WorkerId?: string;
  Test?: string;
  Answer?: string;
  SubmitTime?: Date;
}
export const QualificationRequest = S.suspend(() =>
  S.Struct({
    QualificationRequestId: S.optional(S.String),
    QualificationTypeId: S.optional(S.String),
    WorkerId: S.optional(S.String),
    Test: S.optional(S.String),
    Answer: S.optional(S.String),
    SubmitTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "QualificationRequest",
}) as any as S.Schema<QualificationRequest>;
export type QualificationRequestList = QualificationRequest[];
export const QualificationRequestList = S.Array(QualificationRequest);
export interface WorkerBlock {
  WorkerId?: string;
  Reason?: string;
}
export const WorkerBlock = S.suspend(() =>
  S.Struct({ WorkerId: S.optional(S.String), Reason: S.optional(S.String) }),
).annotations({ identifier: "WorkerBlock" }) as any as S.Schema<WorkerBlock>;
export type WorkerBlockList = WorkerBlock[];
export const WorkerBlockList = S.Array(WorkerBlock);
export interface NotifyWorkersFailureStatus {
  NotifyWorkersFailureCode?: string;
  NotifyWorkersFailureMessage?: string;
  WorkerId?: string;
}
export const NotifyWorkersFailureStatus = S.suspend(() =>
  S.Struct({
    NotifyWorkersFailureCode: S.optional(S.String),
    NotifyWorkersFailureMessage: S.optional(S.String),
    WorkerId: S.optional(S.String),
  }),
).annotations({
  identifier: "NotifyWorkersFailureStatus",
}) as any as S.Schema<NotifyWorkersFailureStatus>;
export type NotifyWorkersFailureStatusList = NotifyWorkersFailureStatus[];
export const NotifyWorkersFailureStatusList = S.Array(
  NotifyWorkersFailureStatus,
);
export interface CreateHITWithHITTypeResponse {
  HIT?: HIT;
}
export const CreateHITWithHITTypeResponse = S.suspend(() =>
  S.Struct({ HIT: S.optional(HIT) }).pipe(ns),
).annotations({
  identifier: "CreateHITWithHITTypeResponse",
}) as any as S.Schema<CreateHITWithHITTypeResponse>;
export interface CreateQualificationTypeResponse {
  QualificationType?: QualificationType;
}
export const CreateQualificationTypeResponse = S.suspend(() =>
  S.Struct({ QualificationType: S.optional(QualificationType) }).pipe(ns),
).annotations({
  identifier: "CreateQualificationTypeResponse",
}) as any as S.Schema<CreateQualificationTypeResponse>;
export interface GetAssignmentResponse {
  Assignment?: Assignment;
  HIT?: HIT;
}
export const GetAssignmentResponse = S.suspend(() =>
  S.Struct({ Assignment: S.optional(Assignment), HIT: S.optional(HIT) }).pipe(
    ns,
  ),
).annotations({
  identifier: "GetAssignmentResponse",
}) as any as S.Schema<GetAssignmentResponse>;
export interface GetQualificationScoreResponse {
  Qualification?: Qualification;
}
export const GetQualificationScoreResponse = S.suspend(() =>
  S.Struct({ Qualification: S.optional(Qualification) }).pipe(ns),
).annotations({
  identifier: "GetQualificationScoreResponse",
}) as any as S.Schema<GetQualificationScoreResponse>;
export interface ListBonusPaymentsResponse {
  NumResults?: number;
  NextToken?: string;
  BonusPayments?: BonusPaymentList;
}
export const ListBonusPaymentsResponse = S.suspend(() =>
  S.Struct({
    NumResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    BonusPayments: S.optional(BonusPaymentList),
  }).pipe(ns),
).annotations({
  identifier: "ListBonusPaymentsResponse",
}) as any as S.Schema<ListBonusPaymentsResponse>;
export interface ListQualificationRequestsResponse {
  NumResults?: number;
  NextToken?: string;
  QualificationRequests?: QualificationRequestList;
}
export const ListQualificationRequestsResponse = S.suspend(() =>
  S.Struct({
    NumResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    QualificationRequests: S.optional(QualificationRequestList),
  }).pipe(ns),
).annotations({
  identifier: "ListQualificationRequestsResponse",
}) as any as S.Schema<ListQualificationRequestsResponse>;
export interface ListWorkerBlocksResponse {
  NextToken?: string;
  NumResults?: number;
  WorkerBlocks?: WorkerBlockList;
}
export const ListWorkerBlocksResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    NumResults: S.optional(S.Number),
    WorkerBlocks: S.optional(WorkerBlockList),
  }).pipe(ns),
).annotations({
  identifier: "ListWorkerBlocksResponse",
}) as any as S.Schema<ListWorkerBlocksResponse>;
export interface NotifyWorkersResponse {
  NotifyWorkersFailureStatuses?: NotifyWorkersFailureStatusList;
}
export const NotifyWorkersResponse = S.suspend(() =>
  S.Struct({
    NotifyWorkersFailureStatuses: S.optional(NotifyWorkersFailureStatusList),
  }).pipe(ns),
).annotations({
  identifier: "NotifyWorkersResponse",
}) as any as S.Schema<NotifyWorkersResponse>;
export interface ReviewResultDetail {
  ActionId?: string;
  SubjectId?: string;
  SubjectType?: string;
  QuestionId?: string;
  Key?: string;
  Value?: string;
}
export const ReviewResultDetail = S.suspend(() =>
  S.Struct({
    ActionId: S.optional(S.String),
    SubjectId: S.optional(S.String),
    SubjectType: S.optional(S.String),
    QuestionId: S.optional(S.String),
    Key: S.optional(S.String),
    Value: S.optional(S.String),
  }),
).annotations({
  identifier: "ReviewResultDetail",
}) as any as S.Schema<ReviewResultDetail>;
export type ReviewResultDetailList = ReviewResultDetail[];
export const ReviewResultDetailList = S.Array(ReviewResultDetail);
export interface ReviewActionDetail {
  ActionId?: string;
  ActionName?: string;
  TargetId?: string;
  TargetType?: string;
  Status?: string;
  CompleteTime?: Date;
  Result?: string;
  ErrorCode?: string;
}
export const ReviewActionDetail = S.suspend(() =>
  S.Struct({
    ActionId: S.optional(S.String),
    ActionName: S.optional(S.String),
    TargetId: S.optional(S.String),
    TargetType: S.optional(S.String),
    Status: S.optional(S.String),
    CompleteTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Result: S.optional(S.String),
    ErrorCode: S.optional(S.String),
  }),
).annotations({
  identifier: "ReviewActionDetail",
}) as any as S.Schema<ReviewActionDetail>;
export type ReviewActionDetailList = ReviewActionDetail[];
export const ReviewActionDetailList = S.Array(ReviewActionDetail);
export interface ReviewReport {
  ReviewResults?: ReviewResultDetailList;
  ReviewActions?: ReviewActionDetailList;
}
export const ReviewReport = S.suspend(() =>
  S.Struct({
    ReviewResults: S.optional(ReviewResultDetailList),
    ReviewActions: S.optional(ReviewActionDetailList),
  }),
).annotations({ identifier: "ReviewReport" }) as any as S.Schema<ReviewReport>;
export interface CreateHITRequest {
  MaxAssignments?: number;
  AutoApprovalDelayInSeconds?: number;
  LifetimeInSeconds: number;
  AssignmentDurationInSeconds: number;
  Reward: string;
  Title: string;
  Keywords?: string;
  Description: string;
  Question?: string;
  RequesterAnnotation?: string;
  QualificationRequirements?: QualificationRequirementList;
  UniqueRequestToken?: string;
  AssignmentReviewPolicy?: ReviewPolicy;
  HITReviewPolicy?: ReviewPolicy;
  HITLayoutId?: string;
  HITLayoutParameters?: HITLayoutParameterList;
}
export const CreateHITRequest = S.suspend(() =>
  S.Struct({
    MaxAssignments: S.optional(S.Number),
    AutoApprovalDelayInSeconds: S.optional(S.Number),
    LifetimeInSeconds: S.Number,
    AssignmentDurationInSeconds: S.Number,
    Reward: S.String,
    Title: S.String,
    Keywords: S.optional(S.String),
    Description: S.String,
    Question: S.optional(S.String),
    RequesterAnnotation: S.optional(S.String),
    QualificationRequirements: S.optional(QualificationRequirementList),
    UniqueRequestToken: S.optional(S.String),
    AssignmentReviewPolicy: S.optional(ReviewPolicy),
    HITReviewPolicy: S.optional(ReviewPolicy),
    HITLayoutId: S.optional(S.String),
    HITLayoutParameters: S.optional(HITLayoutParameterList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateHITRequest",
}) as any as S.Schema<CreateHITRequest>;
export interface ListReviewPolicyResultsForHITResponse {
  HITId?: string;
  AssignmentReviewPolicy?: ReviewPolicy;
  HITReviewPolicy?: ReviewPolicy;
  AssignmentReviewReport?: ReviewReport;
  HITReviewReport?: ReviewReport;
  NextToken?: string;
}
export const ListReviewPolicyResultsForHITResponse = S.suspend(() =>
  S.Struct({
    HITId: S.optional(S.String),
    AssignmentReviewPolicy: S.optional(ReviewPolicy),
    HITReviewPolicy: S.optional(ReviewPolicy),
    AssignmentReviewReport: S.optional(ReviewReport),
    HITReviewReport: S.optional(ReviewReport),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListReviewPolicyResultsForHITResponse",
}) as any as S.Schema<ListReviewPolicyResultsForHITResponse>;
export interface CreateHITResponse {
  HIT?: HIT;
}
export const CreateHITResponse = S.suspend(() =>
  S.Struct({ HIT: S.optional(HIT) }).pipe(ns),
).annotations({
  identifier: "CreateHITResponse",
}) as any as S.Schema<CreateHITResponse>;

//# Errors
export class RequestError extends S.TaggedError<RequestError>()(
  "RequestError",
  { Message: S.optional(S.String), TurkErrorCode: S.optional(S.String) },
  T.AwsQueryError({ code: "RequestError", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ServiceFault extends S.TaggedError<ServiceFault>()(
  "ServiceFault",
  { Message: S.optional(S.String), TurkErrorCode: S.optional(S.String) },
  T.AwsQueryError({ code: "ServiceFault", httpResponseCode: 500 }),
).pipe(C.withServerError) {}

//# Operations
/**
 * The `AcceptQualificationRequest` operation approves a Worker's request for a Qualification.
 *
 * Only the owner of the Qualification type can grant a Qualification request for that type.
 *
 * A successful request for the `AcceptQualificationRequest` operation
 * returns with no errors and an empty body.
 */
export const acceptQualificationRequest: (
  input: AcceptQualificationRequestRequest,
) => Effect.Effect<
  AcceptQualificationRequestResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptQualificationRequestRequest,
  output: AcceptQualificationRequestResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The `CreateHITWithHITType` operation creates a new Human Intelligence Task (HIT)
 * using an existing HITTypeID generated by the `CreateHITType` operation.
 *
 * This is an alternative way to create HITs from the `CreateHIT` operation.
 * This is the recommended best practice for Requesters who are creating large numbers of HITs.
 *
 * CreateHITWithHITType also supports several ways to provide question data:
 * by providing a value for the `Question` parameter that fully specifies the contents of the HIT,
 * or by providing a `HitLayoutId` and associated `HitLayoutParameters`.
 *
 * If a HIT is created with 10 or more maximum assignments, there is an additional fee.
 * For more information, see Amazon Mechanical Turk Pricing.
 */
export const createHITWithHITType: (
  input: CreateHITWithHITTypeRequest,
) => Effect.Effect<
  CreateHITWithHITTypeResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHITWithHITTypeRequest,
  output: CreateHITWithHITTypeResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The
 * `CreateQualificationType`
 * operation creates a new Qualification type, which is represented by a
 * `QualificationType`
 * data structure.
 */
export const createQualificationType: (
  input: CreateQualificationTypeRequest,
) => Effect.Effect<
  CreateQualificationTypeResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateQualificationTypeRequest,
  output: CreateQualificationTypeResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The `GetAssignment` operation retrieves the details of the specified Assignment.
 */
export const getAssignment: (
  input: GetAssignmentRequest,
) => Effect.Effect<
  GetAssignmentResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssignmentRequest,
  output: GetAssignmentResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The
 * `GetQualificationScore`
 * operation returns the value of a Worker's Qualification for a given
 * Qualification type.
 *
 * To get a Worker's Qualification, you must know the Worker's ID. The
 * Worker's ID is included in the assignment data returned by the
 * `ListAssignmentsForHIT`
 * operation.
 *
 * Only the owner of a Qualification type can query the value of
 * a Worker's Qualification of that type.
 */
export const getQualificationScore: (
  input: GetQualificationScoreRequest,
) => Effect.Effect<
  GetQualificationScoreResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQualificationScoreRequest,
  output: GetQualificationScoreResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The
 * `ListBonusPayments`
 * operation retrieves the amounts of bonuses you have paid to Workers
 * for a given HIT or assignment.
 */
export const listBonusPayments: {
  (
    input: ListBonusPaymentsRequest,
  ): Effect.Effect<
    ListBonusPaymentsResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBonusPaymentsRequest,
  ) => Stream.Stream<
    ListBonusPaymentsResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBonusPaymentsRequest,
  ) => Stream.Stream<
    unknown,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBonusPaymentsRequest,
  output: ListBonusPaymentsResponse,
  errors: [RequestError, ServiceFault],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * The
 * `ListQualificationRequests`
 * operation retrieves requests for Qualifications of a particular
 * Qualification type. The owner of the Qualification type calls this
 * operation to poll for pending requests, and accepts them using the
 * AcceptQualification operation.
 */
export const listQualificationRequests: {
  (
    input: ListQualificationRequestsRequest,
  ): Effect.Effect<
    ListQualificationRequestsResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListQualificationRequestsRequest,
  ) => Stream.Stream<
    ListQualificationRequestsResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListQualificationRequestsRequest,
  ) => Stream.Stream<
    unknown,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListQualificationRequestsRequest,
  output: ListQualificationRequestsResponse,
  errors: [RequestError, ServiceFault],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * The `ListWorkersBlocks` operation retrieves a list of Workers who are blocked from working on your HITs.
 */
export const listWorkerBlocks: {
  (
    input: ListWorkerBlocksRequest,
  ): Effect.Effect<
    ListWorkerBlocksResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkerBlocksRequest,
  ) => Stream.Stream<
    ListWorkerBlocksResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkerBlocksRequest,
  ) => Stream.Stream<
    unknown,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWorkerBlocksRequest,
  output: ListWorkerBlocksResponse,
  errors: [RequestError, ServiceFault],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * The
 * `NotifyWorkers`
 * operation sends an email to one or more Workers that you specify with
 * the Worker ID. You can specify up to 100 Worker IDs to send the same
 * message with a single call to the NotifyWorkers operation. The
 * NotifyWorkers operation will send a notification email to a Worker
 * only if you have previously approved or rejected work from the
 * Worker.
 */
export const notifyWorkers: (
  input: NotifyWorkersRequest,
) => Effect.Effect<
  NotifyWorkersResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: NotifyWorkersRequest,
  output: NotifyWorkersResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The `CreateHITType` operation creates a new HIT type. This operation
 * allows you to define a standard set of HIT properties to use when creating HITs.
 * If you register a HIT type with values that match an existing HIT type, the HIT type
 * ID of the existing type will be returned.
 */
export const createHITType: (
  input: CreateHITTypeRequest,
) => Effect.Effect<
  CreateHITTypeResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHITTypeRequest,
  output: CreateHITTypeResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The
 * `GetFileUploadURL`
 * operation generates and returns a temporary URL. You use the
 * temporary URL to retrieve a file uploaded by a Worker as an answer to
 * a FileUploadAnswer question for a HIT. The temporary URL is generated
 * the instant the GetFileUploadURL operation is called, and is valid
 * for 60 seconds. You can get a temporary file upload URL any time
 * until the HIT is disposed. After the HIT is disposed, any uploaded
 * files are deleted, and cannot be retrieved.
 *
 * Pending Deprecation on December 12, 2017. The Answer Specification
 * structure will no longer support the `FileUploadAnswer`
 * element to be used for the QuestionForm data structure.
 * Instead, we recommend that Requesters who want to create HITs asking
 * Workers to upload files to use Amazon S3.
 */
export const getFileUploadURL: (
  input: GetFileUploadURLRequest,
) => Effect.Effect<
  GetFileUploadURLResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFileUploadURLRequest,
  output: GetFileUploadURLResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The `GetHIT` operation retrieves the details of the specified HIT.
 */
export const getHIT: (
  input: GetHITRequest,
) => Effect.Effect<
  GetHITResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHITRequest,
  output: GetHITResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The `GetQualificationType`operation retrieves information about a Qualification type using its ID.
 */
export const getQualificationType: (
  input: GetQualificationTypeRequest,
) => Effect.Effect<
  GetQualificationTypeResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQualificationTypeRequest,
  output: GetQualificationTypeResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The
 * `ListAssignmentsForHIT`
 * operation retrieves completed assignments for a HIT. You can use this
 * operation to retrieve the results for a HIT.
 *
 * You can get assignments for a HIT at any time, even if the
 * HIT is not yet Reviewable. If a HIT requested multiple assignments,
 * and has received some results but has not yet become Reviewable, you
 * can still retrieve the partial results with this operation.
 *
 * Use the AssignmentStatus parameter to control which set of
 * assignments for a HIT are returned. The ListAssignmentsForHIT
 * operation
 * can return submitted assignments awaiting approval, or it can return
 * assignments that have already been approved or rejected. You can set
 * AssignmentStatus=Approved,Rejected to get assignments that have
 * already been approved and rejected together in one result set.
 *
 * Only the Requester who created the HIT can retrieve the
 * assignments for that HIT.
 *
 * Results are sorted and divided into numbered pages and the
 * operation returns a single page of results. You can use the
 * parameters
 * of the operation to control sorting and pagination.
 */
export const listAssignmentsForHIT: {
  (
    input: ListAssignmentsForHITRequest,
  ): Effect.Effect<
    ListAssignmentsForHITResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssignmentsForHITRequest,
  ) => Stream.Stream<
    ListAssignmentsForHITResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssignmentsForHITRequest,
  ) => Stream.Stream<
    unknown,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssignmentsForHITRequest,
  output: ListAssignmentsForHITResponse,
  errors: [RequestError, ServiceFault],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * The
 * `ListHITs`
 * operation returns all of a Requester's HITs. The operation returns
 * HITs of any status, except for HITs that have been deleted of with
 * the DeleteHIT operation or that have been auto-deleted.
 */
export const listHITs: {
  (
    input: ListHITsRequest,
  ): Effect.Effect<
    ListHITsResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListHITsRequest,
  ) => Stream.Stream<
    ListHITsResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListHITsRequest,
  ) => Stream.Stream<
    unknown,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListHITsRequest,
  output: ListHITsResponse,
  errors: [RequestError, ServiceFault],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * The `ListHITsForQualificationType` operation returns the HITs that use
 * the given Qualification type for a Qualification requirement.
 * The operation returns HITs of any status, except for HITs that have been deleted
 * with the `DeleteHIT` operation or that have been auto-deleted.
 */
export const listHITsForQualificationType: {
  (
    input: ListHITsForQualificationTypeRequest,
  ): Effect.Effect<
    ListHITsForQualificationTypeResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListHITsForQualificationTypeRequest,
  ) => Stream.Stream<
    ListHITsForQualificationTypeResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListHITsForQualificationTypeRequest,
  ) => Stream.Stream<
    unknown,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListHITsForQualificationTypeRequest,
  output: ListHITsForQualificationTypeResponse,
  errors: [RequestError, ServiceFault],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * The
 * `ListQualificationTypes`
 * operation returns a list of Qualification types, filtered by
 * an optional search term.
 */
export const listQualificationTypes: {
  (
    input: ListQualificationTypesRequest,
  ): Effect.Effect<
    ListQualificationTypesResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListQualificationTypesRequest,
  ) => Stream.Stream<
    ListQualificationTypesResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListQualificationTypesRequest,
  ) => Stream.Stream<
    unknown,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListQualificationTypesRequest,
  output: ListQualificationTypesResponse,
  errors: [RequestError, ServiceFault],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * The `ListReviewableHITs` operation retrieves the HITs with Status equal to
 * Reviewable or Status equal to Reviewing that belong to the Requester calling the operation.
 */
export const listReviewableHITs: {
  (
    input: ListReviewableHITsRequest,
  ): Effect.Effect<
    ListReviewableHITsResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReviewableHITsRequest,
  ) => Stream.Stream<
    ListReviewableHITsResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReviewableHITsRequest,
  ) => Stream.Stream<
    unknown,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListReviewableHITsRequest,
  output: ListReviewableHITsResponse,
  errors: [RequestError, ServiceFault],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * The `ListWorkersWithQualificationType` operation returns all of the Workers
 * that have been associated with a given Qualification type.
 */
export const listWorkersWithQualificationType: {
  (
    input: ListWorkersWithQualificationTypeRequest,
  ): Effect.Effect<
    ListWorkersWithQualificationTypeResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkersWithQualificationTypeRequest,
  ) => Stream.Stream<
    ListWorkersWithQualificationTypeResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkersWithQualificationTypeRequest,
  ) => Stream.Stream<
    unknown,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWorkersWithQualificationTypeRequest,
  output: ListWorkersWithQualificationTypeResponse,
  errors: [RequestError, ServiceFault],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * The `SendTestEventNotification` operation causes Amazon Mechanical Turk to send
 * a notification message as if a HIT event occurred, according to the provided
 * notification specification. This allows you to test notifications without
 * setting up notifications for a real HIT type and trying to trigger them using the website.
 * When you call this operation, the service attempts to send the test notification immediately.
 */
export const sendTestEventNotification: (
  input: SendTestEventNotificationRequest,
) => Effect.Effect<
  SendTestEventNotificationResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendTestEventNotificationRequest,
  output: SendTestEventNotificationResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The
 * `UpdateQualificationType`
 * operation modifies the attributes of an existing Qualification type,
 * which is represented by a QualificationType data structure. Only the
 * owner of a Qualification type can modify its attributes.
 *
 * Most attributes of a Qualification type can be changed after
 * the type has been created. However, the Name and Keywords fields
 * cannot be modified. The RetryDelayInSeconds parameter can be modified
 * or added to change the delay or to enable retries, but
 * RetryDelayInSeconds cannot be used to disable retries.
 *
 * You can use this operation to update the test for a
 * Qualification type. The test is updated based on the values specified
 * for the Test, TestDurationInSeconds and AnswerKey parameters. All
 * three parameters specify the updated test. If you are updating the
 * test for a type, you must specify the Test and TestDurationInSeconds
 * parameters. The AnswerKey parameter is optional; omitting it specifies
 * that the updated test does not have an answer key.
 *
 * If you omit the Test parameter, the test for the
 * Qualification type is unchanged. There is no way to remove a test from
 * a Qualification type that has one. If the type already has a test, you
 * cannot update it to be AutoGranted. If the Qualification type does not
 * have a test and one is provided by an update, the type will henceforth
 * have a test.
 *
 * If you want to update the test duration or answer key for an
 * existing test without changing the questions, you must specify a Test
 * parameter with the original questions, along with the updated values.
 *
 * If you provide an updated Test but no AnswerKey, the new test
 * will not have an answer key. Requests for such Qualifications must be
 * granted manually.
 *
 * You can also update the AutoGranted and AutoGrantedValue
 * attributes of the Qualification type.
 */
export const updateQualificationType: (
  input: UpdateQualificationTypeRequest,
) => Effect.Effect<
  UpdateQualificationTypeResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateQualificationTypeRequest,
  output: UpdateQualificationTypeResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The `ApproveAssignment` operation approves the results of a completed assignment.
 *
 * Approving an assignment initiates two payments from the Requester's Amazon.com account
 *
 * - The Worker who submitted the results is paid the reward specified in the HIT.
 *
 * - Amazon Mechanical Turk fees are debited.
 *
 * If the Requester's account does not have adequate funds for these payments,
 * the call to ApproveAssignment returns an exception, and the approval is not processed.
 * You can include an optional feedback message with the approval,
 * which the Worker can see in the Status section of the web site.
 *
 * You can also call this operation for assignments that were previous rejected
 * and approve them by explicitly overriding the previous rejection.
 * This only works on rejected assignments that were submitted within the previous 30 days
 * and only if the assignment's related HIT has not been deleted.
 */
export const approveAssignment: (
  input: ApproveAssignmentRequest,
) => Effect.Effect<
  ApproveAssignmentResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ApproveAssignmentRequest,
  output: ApproveAssignmentResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The `AssociateQualificationWithWorker` operation gives a Worker a
 * Qualification. `AssociateQualificationWithWorker` does not require that the Worker
 * submit a Qualification request. It gives the Qualification directly to the Worker.
 *
 * You can only assign a Qualification of a Qualification type that you created (using
 * the `CreateQualificationType` operation).
 *
 * Note: `AssociateQualificationWithWorker` does not affect any pending Qualification
 * requests for the Qualification by the Worker. If you assign a Qualification to a
 * Worker, then later grant a Qualification request made by the Worker, the granting of
 * the request may modify the Qualification score. To resolve a pending Qualification
 * request without affecting the Qualification the Worker already has, reject the
 * request with the `RejectQualificationRequest` operation.
 */
export const associateQualificationWithWorker: (
  input: AssociateQualificationWithWorkerRequest,
) => Effect.Effect<
  AssociateQualificationWithWorkerResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateQualificationWithWorkerRequest,
  output: AssociateQualificationWithWorkerResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The
 * `CreateAdditionalAssignmentsForHIT`
 * operation increases the maximum number of assignments of an existing HIT.
 *
 * To extend the maximum number of assignments, specify the number of additional assignments.
 *
 * - HITs created with fewer than 10 assignments cannot be extended to have 10 or more assignments. Attempting to add assignments in a way that brings the total number of assignments for a HIT from fewer than 10 assignments to 10 or more
 * assignments will result in an
 * `AWS.MechanicalTurk.InvalidMaximumAssignmentsIncrease`
 * exception.
 *
 * - HITs that were created before July 22, 2015 cannot be extended. Attempting to extend HITs that were created before July 22, 2015 will result in an
 * `AWS.MechanicalTurk.HITTooOldForExtension`
 * exception.
 */
export const createAdditionalAssignmentsForHIT: (
  input: CreateAdditionalAssignmentsForHITRequest,
) => Effect.Effect<
  CreateAdditionalAssignmentsForHITResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAdditionalAssignmentsForHITRequest,
  output: CreateAdditionalAssignmentsForHITResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The `CreateWorkerBlock` operation allows you to prevent a Worker from working on your HITs. For example, you can block a Worker who is producing poor quality work. You can block up to 100,000 Workers.
 */
export const createWorkerBlock: (
  input: CreateWorkerBlockRequest,
) => Effect.Effect<
  CreateWorkerBlockResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkerBlockRequest,
  output: CreateWorkerBlockResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The `DeleteHIT` operation is used to delete HIT that is no longer needed.
 * Only the Requester who created the HIT can delete it.
 *
 * You can only dispose of HITs that are in the `Reviewable` state,
 * with all of their submitted assignments already either approved or rejected.
 * If you call the DeleteHIT operation on a HIT that is not in the `Reviewable` state
 * (for example, that has not expired, or still has active assignments),
 * or on a HIT that is Reviewable but without all of its submitted assignments
 * already approved or rejected, the service will return an error.
 *
 * - HITs are automatically disposed of after 120 days.
 *
 * - After you dispose of a HIT, you can no longer approve the HIT's rejected assignments.
 *
 * - Disposed HITs are not returned in results for the ListHITs operation.
 *
 * - Disposing HITs can improve the performance of operations such as ListReviewableHITs and ListHITs.
 */
export const deleteHIT: (
  input: DeleteHITRequest,
) => Effect.Effect<
  DeleteHITResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHITRequest,
  output: DeleteHITResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The
 * `DeleteQualificationType`
 * deletes a Qualification type and deletes any HIT types that are
 * associated with the Qualification type.
 *
 * This operation does not revoke Qualifications already assigned
 * to Workers because the Qualifications might be needed for active HITs.
 * If there are any pending requests for the Qualification type, Amazon
 * Mechanical Turk rejects those requests. After you delete a
 * Qualification type, you can no longer use it to create HITs or HIT
 * types.
 *
 * DeleteQualificationType must wait for all the HITs that use
 * the deleted Qualification type to be deleted before completing. It
 * may take up to 48 hours before DeleteQualificationType completes and
 * the unique name of the Qualification type is available for reuse with
 * CreateQualificationType.
 */
export const deleteQualificationType: (
  input: DeleteQualificationTypeRequest,
) => Effect.Effect<
  DeleteQualificationTypeResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteQualificationTypeRequest,
  output: DeleteQualificationTypeResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The `DeleteWorkerBlock` operation allows you to reinstate a blocked Worker to work on your HITs. This operation reverses the effects of the CreateWorkerBlock operation. You need the Worker ID to use this operation. If the Worker ID is missing or invalid, this operation fails and returns the message “WorkerId is invalid.” If the specified Worker is not blocked, this operation returns successfully.
 */
export const deleteWorkerBlock: (
  input: DeleteWorkerBlockRequest,
) => Effect.Effect<
  DeleteWorkerBlockResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkerBlockRequest,
  output: DeleteWorkerBlockResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The `DisassociateQualificationFromWorker`
 * revokes a previously granted Qualification from a user.
 *
 * You can provide a text message explaining why the Qualification was
 * revoked. The user who had the Qualification can see this message.
 */
export const disassociateQualificationFromWorker: (
  input: DisassociateQualificationFromWorkerRequest,
) => Effect.Effect<
  DisassociateQualificationFromWorkerResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateQualificationFromWorkerRequest,
  output: DisassociateQualificationFromWorkerResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The `GetAccountBalance` operation retrieves the Prepaid HITs balance in your Amazon Mechanical Turk account if you are a Prepaid Requester.
 * Alternatively, this operation will retrieve the remaining available AWS Billing usage if you have enabled AWS Billing.
 * Note: If you have enabled AWS Billing and still have a remaining Prepaid HITs balance, this balance can be viewed on the My Account page in the Requester console.
 */
export const getAccountBalance: (
  input: GetAccountBalanceRequest,
) => Effect.Effect<
  GetAccountBalanceResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountBalanceRequest,
  output: GetAccountBalanceResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The `RejectAssignment` operation rejects the results of a completed assignment.
 *
 * You can include an optional feedback message with the rejection,
 * which the Worker can see in the Status section of the web site.
 * When you include a feedback message with the rejection,
 * it helps the Worker understand why the assignment was rejected,
 * and can improve the quality of the results the Worker submits in the future.
 *
 * Only the Requester who created the HIT can reject an assignment for the HIT.
 */
export const rejectAssignment: (
  input: RejectAssignmentRequest,
) => Effect.Effect<
  RejectAssignmentResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectAssignmentRequest,
  output: RejectAssignmentResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The
 * `RejectQualificationRequest`
 * operation rejects a user's request for a Qualification.
 *
 * You can provide a text message explaining why the request was
 * rejected. The Worker who made the request can see this message.
 */
export const rejectQualificationRequest: (
  input: RejectQualificationRequestRequest,
) => Effect.Effect<
  RejectQualificationRequestResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectQualificationRequestRequest,
  output: RejectQualificationRequestResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The
 * `SendBonus`
 * operation issues a payment of money from your account to a Worker.
 * This payment happens separately from the reward you pay to the Worker
 * when you approve the Worker's assignment. The SendBonus operation
 * requires the Worker's ID and the assignment ID as parameters to
 * initiate payment of the bonus. You must include a message that
 * explains the reason for the bonus payment, as the Worker may not be
 * expecting the payment. Amazon Mechanical Turk collects a fee for
 * bonus payments, similar to the HIT listing fee. This operation fails
 * if your account does not have enough funds to pay for both the bonus
 * and the fees.
 */
export const sendBonus: (
  input: SendBonusRequest,
) => Effect.Effect<
  SendBonusResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendBonusRequest,
  output: SendBonusResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The `UpdateExpirationForHIT` operation allows you update the expiration time of a HIT.
 * If you update it to a time in the past, the HIT will be immediately expired.
 */
export const updateExpirationForHIT: (
  input: UpdateExpirationForHITRequest,
) => Effect.Effect<
  UpdateExpirationForHITResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateExpirationForHITRequest,
  output: UpdateExpirationForHITResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The `UpdateHITReviewStatus` operation updates the status of a HIT.
 * If the status is Reviewable, this operation can update the status to Reviewing,
 * or it can revert a Reviewing HIT back to the Reviewable status.
 */
export const updateHITReviewStatus: (
  input: UpdateHITReviewStatusRequest,
) => Effect.Effect<
  UpdateHITReviewStatusResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateHITReviewStatusRequest,
  output: UpdateHITReviewStatusResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The
 * `UpdateHITTypeOfHIT`
 * operation allows you to change the HITType properties of a HIT. This
 * operation disassociates the HIT from its old HITType properties and
 * associates it with the new HITType properties. The HIT takes on the
 * properties of the new HITType in place of the old ones.
 */
export const updateHITTypeOfHIT: (
  input: UpdateHITTypeOfHITRequest,
) => Effect.Effect<
  UpdateHITTypeOfHITResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateHITTypeOfHITRequest,
  output: UpdateHITTypeOfHITResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The `UpdateNotificationSettings` operation creates, updates,
 * disables or re-enables notifications for a HIT type.
 * If you call the UpdateNotificationSettings operation for a HIT type that already has a
 * notification specification, the operation replaces the old specification with a new one.
 * You can call the UpdateNotificationSettings operation to enable or disable notifications
 * for the HIT type, without having to modify the notification specification itself by providing
 * updates to the Active status without specifying a new notification specification.
 * To change the Active status of a HIT type's notifications,
 * the HIT type must already have a notification specification,
 * or one must be provided in the same call to `UpdateNotificationSettings`.
 */
export const updateNotificationSettings: (
  input: UpdateNotificationSettingsRequest,
) => Effect.Effect<
  UpdateNotificationSettingsResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNotificationSettingsRequest,
  output: UpdateNotificationSettingsResponse,
  errors: [RequestError, ServiceFault],
}));
/**
 * The `ListReviewPolicyResultsForHIT` operation retrieves the computed results
 * and the actions taken in the course of executing your Review Policies for a given HIT.
 * For information about how to specify Review Policies when you call CreateHIT,
 * see Review Policies. The ListReviewPolicyResultsForHIT operation can return results for both
 * Assignment-level and HIT-level review results.
 */
export const listReviewPolicyResultsForHIT: {
  (
    input: ListReviewPolicyResultsForHITRequest,
  ): Effect.Effect<
    ListReviewPolicyResultsForHITResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReviewPolicyResultsForHITRequest,
  ) => Stream.Stream<
    ListReviewPolicyResultsForHITResponse,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReviewPolicyResultsForHITRequest,
  ) => Stream.Stream<
    unknown,
    RequestError | ServiceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListReviewPolicyResultsForHITRequest,
  output: ListReviewPolicyResultsForHITResponse,
  errors: [RequestError, ServiceFault],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * The `CreateHIT` operation creates a new Human Intelligence Task (HIT).
 * The new HIT is made available for Workers to find and accept on the Amazon Mechanical
 * Turk website.
 *
 * This operation allows you to specify a new HIT by passing in values for the properties of the HIT, such as its title, reward amount and number of assignments. When you pass these values to `CreateHIT`, a new HIT is created for you, with a new `HITTypeID`. The HITTypeID can be used to create additional HITs in the future without needing to specify common parameters such as the title, description and reward amount each time.
 *
 * An alternative way to create HITs is to first generate a HITTypeID using the `CreateHITType` operation and then call the `CreateHITWithHITType` operation. This is the recommended best practice for Requesters who are creating large numbers of HITs.
 *
 * CreateHIT also supports several ways to provide question data: by providing a value
 * for the `Question` parameter that fully specifies the contents of the HIT, or by providing
 * a `HitLayoutId` and associated `HitLayoutParameters`.
 *
 * If a HIT is created with 10 or more maximum assignments, there is an additional fee. For more information, see
 * Amazon Mechanical Turk Pricing.
 */
export const createHIT: (
  input: CreateHITRequest,
) => Effect.Effect<
  CreateHITResponse,
  RequestError | ServiceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHITRequest,
  output: CreateHITResponse,
  errors: [RequestError, ServiceFault],
}));

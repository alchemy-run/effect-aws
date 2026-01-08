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
  sdkId: "ComprehendMedical",
  serviceShapeName: "ComprehendMedical_20181030",
});
const auth = T.AwsAuthSigv4({ name: "comprehendmedical" });
const ver = T.ServiceVersion("2018-10-30");
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
              `https://comprehendmedical-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://comprehendmedical-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://comprehendmedical.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://comprehendmedical.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type JobId = string;
export type BoundedLengthString = string;
export type OntologyLinkingBoundedLengthString = string;
export type MaxResultsInteger = number;
export type IamRoleArn = string;
export type JobName = string;
export type ClientRequestTokenString = string;
export type KMSKey = string;
export type S3Bucket = string;
export type S3Key = string;
export type AnyLengthString = string;
export type ManifestFilePath = string;
export type ModelVersion = string;
export type Integer = number;
export type Float = number;

//# Schemas
export interface DescribeEntitiesDetectionV2JobRequest {
  JobId: string;
}
export const DescribeEntitiesDetectionV2JobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEntitiesDetectionV2JobRequest",
}) as any as S.Schema<DescribeEntitiesDetectionV2JobRequest>;
export interface DescribeICD10CMInferenceJobRequest {
  JobId: string;
}
export const DescribeICD10CMInferenceJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeICD10CMInferenceJobRequest",
}) as any as S.Schema<DescribeICD10CMInferenceJobRequest>;
export interface DescribePHIDetectionJobRequest {
  JobId: string;
}
export const DescribePHIDetectionJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribePHIDetectionJobRequest",
}) as any as S.Schema<DescribePHIDetectionJobRequest>;
export interface DescribeRxNormInferenceJobRequest {
  JobId: string;
}
export const DescribeRxNormInferenceJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeRxNormInferenceJobRequest",
}) as any as S.Schema<DescribeRxNormInferenceJobRequest>;
export interface DescribeSNOMEDCTInferenceJobRequest {
  JobId: string;
}
export const DescribeSNOMEDCTInferenceJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeSNOMEDCTInferenceJobRequest",
}) as any as S.Schema<DescribeSNOMEDCTInferenceJobRequest>;
export interface DetectEntitiesRequest {
  Text: string;
}
export const DetectEntitiesRequest = S.suspend(() =>
  S.Struct({ Text: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DetectEntitiesRequest",
}) as any as S.Schema<DetectEntitiesRequest>;
export interface DetectEntitiesV2Request {
  Text: string;
}
export const DetectEntitiesV2Request = S.suspend(() =>
  S.Struct({ Text: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DetectEntitiesV2Request",
}) as any as S.Schema<DetectEntitiesV2Request>;
export interface DetectPHIRequest {
  Text: string;
}
export const DetectPHIRequest = S.suspend(() =>
  S.Struct({ Text: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DetectPHIRequest",
}) as any as S.Schema<DetectPHIRequest>;
export interface InferICD10CMRequest {
  Text: string;
}
export const InferICD10CMRequest = S.suspend(() =>
  S.Struct({ Text: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "InferICD10CMRequest",
}) as any as S.Schema<InferICD10CMRequest>;
export interface InferRxNormRequest {
  Text: string;
}
export const InferRxNormRequest = S.suspend(() =>
  S.Struct({ Text: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "InferRxNormRequest",
}) as any as S.Schema<InferRxNormRequest>;
export interface InferSNOMEDCTRequest {
  Text: string;
}
export const InferSNOMEDCTRequest = S.suspend(() =>
  S.Struct({ Text: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "InferSNOMEDCTRequest",
}) as any as S.Schema<InferSNOMEDCTRequest>;
export interface ComprehendMedicalAsyncJobFilter {
  JobName?: string;
  JobStatus?: string;
  SubmitTimeBefore?: Date;
  SubmitTimeAfter?: Date;
}
export const ComprehendMedicalAsyncJobFilter = S.suspend(() =>
  S.Struct({
    JobName: S.optional(S.String),
    JobStatus: S.optional(S.String),
    SubmitTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SubmitTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ComprehendMedicalAsyncJobFilter",
}) as any as S.Schema<ComprehendMedicalAsyncJobFilter>;
export interface ListICD10CMInferenceJobsRequest {
  Filter?: ComprehendMedicalAsyncJobFilter;
  NextToken?: string;
  MaxResults?: number;
}
export const ListICD10CMInferenceJobsRequest = S.suspend(() =>
  S.Struct({
    Filter: S.optional(ComprehendMedicalAsyncJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListICD10CMInferenceJobsRequest",
}) as any as S.Schema<ListICD10CMInferenceJobsRequest>;
export interface ListPHIDetectionJobsRequest {
  Filter?: ComprehendMedicalAsyncJobFilter;
  NextToken?: string;
  MaxResults?: number;
}
export const ListPHIDetectionJobsRequest = S.suspend(() =>
  S.Struct({
    Filter: S.optional(ComprehendMedicalAsyncJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPHIDetectionJobsRequest",
}) as any as S.Schema<ListPHIDetectionJobsRequest>;
export interface ListRxNormInferenceJobsRequest {
  Filter?: ComprehendMedicalAsyncJobFilter;
  NextToken?: string;
  MaxResults?: number;
}
export const ListRxNormInferenceJobsRequest = S.suspend(() =>
  S.Struct({
    Filter: S.optional(ComprehendMedicalAsyncJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRxNormInferenceJobsRequest",
}) as any as S.Schema<ListRxNormInferenceJobsRequest>;
export interface ListSNOMEDCTInferenceJobsRequest {
  Filter?: ComprehendMedicalAsyncJobFilter;
  NextToken?: string;
  MaxResults?: number;
}
export const ListSNOMEDCTInferenceJobsRequest = S.suspend(() =>
  S.Struct({
    Filter: S.optional(ComprehendMedicalAsyncJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSNOMEDCTInferenceJobsRequest",
}) as any as S.Schema<ListSNOMEDCTInferenceJobsRequest>;
export interface InputDataConfig {
  S3Bucket: string;
  S3Key?: string;
}
export const InputDataConfig = S.suspend(() =>
  S.Struct({ S3Bucket: S.String, S3Key: S.optional(S.String) }),
).annotations({
  identifier: "InputDataConfig",
}) as any as S.Schema<InputDataConfig>;
export interface OutputDataConfig {
  S3Bucket: string;
  S3Key?: string;
}
export const OutputDataConfig = S.suspend(() =>
  S.Struct({ S3Bucket: S.String, S3Key: S.optional(S.String) }),
).annotations({
  identifier: "OutputDataConfig",
}) as any as S.Schema<OutputDataConfig>;
export interface StartICD10CMInferenceJobRequest {
  InputDataConfig: InputDataConfig;
  OutputDataConfig: OutputDataConfig;
  DataAccessRoleArn: string;
  JobName?: string;
  ClientRequestToken?: string;
  KMSKey?: string;
  LanguageCode: string;
}
export const StartICD10CMInferenceJobRequest = S.suspend(() =>
  S.Struct({
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    JobName: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    KMSKey: S.optional(S.String),
    LanguageCode: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartICD10CMInferenceJobRequest",
}) as any as S.Schema<StartICD10CMInferenceJobRequest>;
export interface StartPHIDetectionJobRequest {
  InputDataConfig: InputDataConfig;
  OutputDataConfig: OutputDataConfig;
  DataAccessRoleArn: string;
  JobName?: string;
  ClientRequestToken?: string;
  KMSKey?: string;
  LanguageCode: string;
}
export const StartPHIDetectionJobRequest = S.suspend(() =>
  S.Struct({
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    JobName: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    KMSKey: S.optional(S.String),
    LanguageCode: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartPHIDetectionJobRequest",
}) as any as S.Schema<StartPHIDetectionJobRequest>;
export interface StartRxNormInferenceJobRequest {
  InputDataConfig: InputDataConfig;
  OutputDataConfig: OutputDataConfig;
  DataAccessRoleArn: string;
  JobName?: string;
  ClientRequestToken?: string;
  KMSKey?: string;
  LanguageCode: string;
}
export const StartRxNormInferenceJobRequest = S.suspend(() =>
  S.Struct({
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    JobName: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    KMSKey: S.optional(S.String),
    LanguageCode: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartRxNormInferenceJobRequest",
}) as any as S.Schema<StartRxNormInferenceJobRequest>;
export interface StartSNOMEDCTInferenceJobRequest {
  InputDataConfig: InputDataConfig;
  OutputDataConfig: OutputDataConfig;
  DataAccessRoleArn: string;
  JobName?: string;
  ClientRequestToken?: string;
  KMSKey?: string;
  LanguageCode: string;
}
export const StartSNOMEDCTInferenceJobRequest = S.suspend(() =>
  S.Struct({
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    JobName: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    KMSKey: S.optional(S.String),
    LanguageCode: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartSNOMEDCTInferenceJobRequest",
}) as any as S.Schema<StartSNOMEDCTInferenceJobRequest>;
export interface StopEntitiesDetectionV2JobRequest {
  JobId: string;
}
export const StopEntitiesDetectionV2JobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopEntitiesDetectionV2JobRequest",
}) as any as S.Schema<StopEntitiesDetectionV2JobRequest>;
export interface StopICD10CMInferenceJobRequest {
  JobId: string;
}
export const StopICD10CMInferenceJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopICD10CMInferenceJobRequest",
}) as any as S.Schema<StopICD10CMInferenceJobRequest>;
export interface StopPHIDetectionJobRequest {
  JobId: string;
}
export const StopPHIDetectionJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopPHIDetectionJobRequest",
}) as any as S.Schema<StopPHIDetectionJobRequest>;
export interface StopRxNormInferenceJobRequest {
  JobId: string;
}
export const StopRxNormInferenceJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopRxNormInferenceJobRequest",
}) as any as S.Schema<StopRxNormInferenceJobRequest>;
export interface StopSNOMEDCTInferenceJobRequest {
  JobId: string;
}
export const StopSNOMEDCTInferenceJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopSNOMEDCTInferenceJobRequest",
}) as any as S.Schema<StopSNOMEDCTInferenceJobRequest>;
export interface ComprehendMedicalAsyncJobProperties {
  JobId?: string;
  JobName?: string;
  JobStatus?: string;
  Message?: string;
  SubmitTime?: Date;
  EndTime?: Date;
  ExpirationTime?: Date;
  InputDataConfig?: InputDataConfig;
  OutputDataConfig?: OutputDataConfig;
  LanguageCode?: string;
  DataAccessRoleArn?: string;
  ManifestFilePath?: string;
  KMSKey?: string;
  ModelVersion?: string;
}
export const ComprehendMedicalAsyncJobProperties = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    JobName: S.optional(S.String),
    JobStatus: S.optional(S.String),
    Message: S.optional(S.String),
    SubmitTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    InputDataConfig: S.optional(InputDataConfig),
    OutputDataConfig: S.optional(OutputDataConfig),
    LanguageCode: S.optional(S.String),
    DataAccessRoleArn: S.optional(S.String),
    ManifestFilePath: S.optional(S.String),
    KMSKey: S.optional(S.String),
    ModelVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "ComprehendMedicalAsyncJobProperties",
}) as any as S.Schema<ComprehendMedicalAsyncJobProperties>;
export type ComprehendMedicalAsyncJobPropertiesList =
  ComprehendMedicalAsyncJobProperties[];
export const ComprehendMedicalAsyncJobPropertiesList = S.Array(
  ComprehendMedicalAsyncJobProperties,
);
export interface DescribeICD10CMInferenceJobResponse {
  ComprehendMedicalAsyncJobProperties?: ComprehendMedicalAsyncJobProperties;
}
export const DescribeICD10CMInferenceJobResponse = S.suspend(() =>
  S.Struct({
    ComprehendMedicalAsyncJobProperties: S.optional(
      ComprehendMedicalAsyncJobProperties,
    ),
  }),
).annotations({
  identifier: "DescribeICD10CMInferenceJobResponse",
}) as any as S.Schema<DescribeICD10CMInferenceJobResponse>;
export interface DescribePHIDetectionJobResponse {
  ComprehendMedicalAsyncJobProperties?: ComprehendMedicalAsyncJobProperties;
}
export const DescribePHIDetectionJobResponse = S.suspend(() =>
  S.Struct({
    ComprehendMedicalAsyncJobProperties: S.optional(
      ComprehendMedicalAsyncJobProperties,
    ),
  }),
).annotations({
  identifier: "DescribePHIDetectionJobResponse",
}) as any as S.Schema<DescribePHIDetectionJobResponse>;
export interface DescribeRxNormInferenceJobResponse {
  ComprehendMedicalAsyncJobProperties?: ComprehendMedicalAsyncJobProperties;
}
export const DescribeRxNormInferenceJobResponse = S.suspend(() =>
  S.Struct({
    ComprehendMedicalAsyncJobProperties: S.optional(
      ComprehendMedicalAsyncJobProperties,
    ),
  }),
).annotations({
  identifier: "DescribeRxNormInferenceJobResponse",
}) as any as S.Schema<DescribeRxNormInferenceJobResponse>;
export interface DescribeSNOMEDCTInferenceJobResponse {
  ComprehendMedicalAsyncJobProperties?: ComprehendMedicalAsyncJobProperties;
}
export const DescribeSNOMEDCTInferenceJobResponse = S.suspend(() =>
  S.Struct({
    ComprehendMedicalAsyncJobProperties: S.optional(
      ComprehendMedicalAsyncJobProperties,
    ),
  }),
).annotations({
  identifier: "DescribeSNOMEDCTInferenceJobResponse",
}) as any as S.Schema<DescribeSNOMEDCTInferenceJobResponse>;
export interface Trait {
  Name?: string;
  Score?: number;
}
export const Trait = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Score: S.optional(S.Number) }),
).annotations({ identifier: "Trait" }) as any as S.Schema<Trait>;
export type TraitList = Trait[];
export const TraitList = S.Array(Trait);
export interface Attribute {
  Type?: string;
  Score?: number;
  RelationshipScore?: number;
  RelationshipType?: string;
  Id?: number;
  BeginOffset?: number;
  EndOffset?: number;
  Text?: string;
  Category?: string;
  Traits?: TraitList;
}
export const Attribute = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Score: S.optional(S.Number),
    RelationshipScore: S.optional(S.Number),
    RelationshipType: S.optional(S.String),
    Id: S.optional(S.Number),
    BeginOffset: S.optional(S.Number),
    EndOffset: S.optional(S.Number),
    Text: S.optional(S.String),
    Category: S.optional(S.String),
    Traits: S.optional(TraitList),
  }),
).annotations({ identifier: "Attribute" }) as any as S.Schema<Attribute>;
export type AttributeList = Attribute[];
export const AttributeList = S.Array(Attribute);
export interface Entity {
  Id?: number;
  BeginOffset?: number;
  EndOffset?: number;
  Score?: number;
  Text?: string;
  Category?: string;
  Type?: string;
  Traits?: TraitList;
  Attributes?: AttributeList;
}
export const Entity = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.Number),
    BeginOffset: S.optional(S.Number),
    EndOffset: S.optional(S.Number),
    Score: S.optional(S.Number),
    Text: S.optional(S.String),
    Category: S.optional(S.String),
    Type: S.optional(S.String),
    Traits: S.optional(TraitList),
    Attributes: S.optional(AttributeList),
  }),
).annotations({ identifier: "Entity" }) as any as S.Schema<Entity>;
export type EntityList = Entity[];
export const EntityList = S.Array(Entity);
export interface UnmappedAttribute {
  Type?: string;
  Attribute?: Attribute;
}
export const UnmappedAttribute = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String), Attribute: S.optional(Attribute) }),
).annotations({
  identifier: "UnmappedAttribute",
}) as any as S.Schema<UnmappedAttribute>;
export type UnmappedAttributeList = UnmappedAttribute[];
export const UnmappedAttributeList = S.Array(UnmappedAttribute);
export interface DetectEntitiesV2Response {
  Entities: EntityList;
  UnmappedAttributes?: UnmappedAttributeList;
  PaginationToken?: string;
  ModelVersion: string;
}
export const DetectEntitiesV2Response = S.suspend(() =>
  S.Struct({
    Entities: EntityList,
    UnmappedAttributes: S.optional(UnmappedAttributeList),
    PaginationToken: S.optional(S.String),
    ModelVersion: S.String,
  }),
).annotations({
  identifier: "DetectEntitiesV2Response",
}) as any as S.Schema<DetectEntitiesV2Response>;
export interface DetectPHIResponse {
  Entities: EntityList;
  PaginationToken?: string;
  ModelVersion: string;
}
export const DetectPHIResponse = S.suspend(() =>
  S.Struct({
    Entities: EntityList,
    PaginationToken: S.optional(S.String),
    ModelVersion: S.String,
  }),
).annotations({
  identifier: "DetectPHIResponse",
}) as any as S.Schema<DetectPHIResponse>;
export interface ListEntitiesDetectionV2JobsRequest {
  Filter?: ComprehendMedicalAsyncJobFilter;
  NextToken?: string;
  MaxResults?: number;
}
export const ListEntitiesDetectionV2JobsRequest = S.suspend(() =>
  S.Struct({
    Filter: S.optional(ComprehendMedicalAsyncJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEntitiesDetectionV2JobsRequest",
}) as any as S.Schema<ListEntitiesDetectionV2JobsRequest>;
export interface ListICD10CMInferenceJobsResponse {
  ComprehendMedicalAsyncJobPropertiesList?: ComprehendMedicalAsyncJobPropertiesList;
  NextToken?: string;
}
export const ListICD10CMInferenceJobsResponse = S.suspend(() =>
  S.Struct({
    ComprehendMedicalAsyncJobPropertiesList: S.optional(
      ComprehendMedicalAsyncJobPropertiesList,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListICD10CMInferenceJobsResponse",
}) as any as S.Schema<ListICD10CMInferenceJobsResponse>;
export interface ListPHIDetectionJobsResponse {
  ComprehendMedicalAsyncJobPropertiesList?: ComprehendMedicalAsyncJobPropertiesList;
  NextToken?: string;
}
export const ListPHIDetectionJobsResponse = S.suspend(() =>
  S.Struct({
    ComprehendMedicalAsyncJobPropertiesList: S.optional(
      ComprehendMedicalAsyncJobPropertiesList,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPHIDetectionJobsResponse",
}) as any as S.Schema<ListPHIDetectionJobsResponse>;
export interface ListRxNormInferenceJobsResponse {
  ComprehendMedicalAsyncJobPropertiesList?: ComprehendMedicalAsyncJobPropertiesList;
  NextToken?: string;
}
export const ListRxNormInferenceJobsResponse = S.suspend(() =>
  S.Struct({
    ComprehendMedicalAsyncJobPropertiesList: S.optional(
      ComprehendMedicalAsyncJobPropertiesList,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRxNormInferenceJobsResponse",
}) as any as S.Schema<ListRxNormInferenceJobsResponse>;
export interface ListSNOMEDCTInferenceJobsResponse {
  ComprehendMedicalAsyncJobPropertiesList?: ComprehendMedicalAsyncJobPropertiesList;
  NextToken?: string;
}
export const ListSNOMEDCTInferenceJobsResponse = S.suspend(() =>
  S.Struct({
    ComprehendMedicalAsyncJobPropertiesList: S.optional(
      ComprehendMedicalAsyncJobPropertiesList,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSNOMEDCTInferenceJobsResponse",
}) as any as S.Schema<ListSNOMEDCTInferenceJobsResponse>;
export interface StartEntitiesDetectionV2JobRequest {
  InputDataConfig: InputDataConfig;
  OutputDataConfig: OutputDataConfig;
  DataAccessRoleArn: string;
  JobName?: string;
  ClientRequestToken?: string;
  KMSKey?: string;
  LanguageCode: string;
}
export const StartEntitiesDetectionV2JobRequest = S.suspend(() =>
  S.Struct({
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    JobName: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    KMSKey: S.optional(S.String),
    LanguageCode: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartEntitiesDetectionV2JobRequest",
}) as any as S.Schema<StartEntitiesDetectionV2JobRequest>;
export interface StartICD10CMInferenceJobResponse {
  JobId?: string;
}
export const StartICD10CMInferenceJobResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }),
).annotations({
  identifier: "StartICD10CMInferenceJobResponse",
}) as any as S.Schema<StartICD10CMInferenceJobResponse>;
export interface StartPHIDetectionJobResponse {
  JobId?: string;
}
export const StartPHIDetectionJobResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }),
).annotations({
  identifier: "StartPHIDetectionJobResponse",
}) as any as S.Schema<StartPHIDetectionJobResponse>;
export interface StartRxNormInferenceJobResponse {
  JobId?: string;
}
export const StartRxNormInferenceJobResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }),
).annotations({
  identifier: "StartRxNormInferenceJobResponse",
}) as any as S.Schema<StartRxNormInferenceJobResponse>;
export interface StartSNOMEDCTInferenceJobResponse {
  JobId?: string;
}
export const StartSNOMEDCTInferenceJobResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }),
).annotations({
  identifier: "StartSNOMEDCTInferenceJobResponse",
}) as any as S.Schema<StartSNOMEDCTInferenceJobResponse>;
export interface StopEntitiesDetectionV2JobResponse {
  JobId?: string;
}
export const StopEntitiesDetectionV2JobResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }),
).annotations({
  identifier: "StopEntitiesDetectionV2JobResponse",
}) as any as S.Schema<StopEntitiesDetectionV2JobResponse>;
export interface StopICD10CMInferenceJobResponse {
  JobId?: string;
}
export const StopICD10CMInferenceJobResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }),
).annotations({
  identifier: "StopICD10CMInferenceJobResponse",
}) as any as S.Schema<StopICD10CMInferenceJobResponse>;
export interface StopPHIDetectionJobResponse {
  JobId?: string;
}
export const StopPHIDetectionJobResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }),
).annotations({
  identifier: "StopPHIDetectionJobResponse",
}) as any as S.Schema<StopPHIDetectionJobResponse>;
export interface StopRxNormInferenceJobResponse {
  JobId?: string;
}
export const StopRxNormInferenceJobResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }),
).annotations({
  identifier: "StopRxNormInferenceJobResponse",
}) as any as S.Schema<StopRxNormInferenceJobResponse>;
export interface StopSNOMEDCTInferenceJobResponse {
  JobId?: string;
}
export const StopSNOMEDCTInferenceJobResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }),
).annotations({
  identifier: "StopSNOMEDCTInferenceJobResponse",
}) as any as S.Schema<StopSNOMEDCTInferenceJobResponse>;
export interface SNOMEDCTDetails {
  Edition?: string;
  Language?: string;
  VersionDate?: string;
}
export const SNOMEDCTDetails = S.suspend(() =>
  S.Struct({
    Edition: S.optional(S.String),
    Language: S.optional(S.String),
    VersionDate: S.optional(S.String),
  }),
).annotations({
  identifier: "SNOMEDCTDetails",
}) as any as S.Schema<SNOMEDCTDetails>;
export interface Characters {
  OriginalTextCharacters?: number;
}
export const Characters = S.suspend(() =>
  S.Struct({ OriginalTextCharacters: S.optional(S.Number) }),
).annotations({ identifier: "Characters" }) as any as S.Schema<Characters>;
export interface DescribeEntitiesDetectionV2JobResponse {
  ComprehendMedicalAsyncJobProperties?: ComprehendMedicalAsyncJobProperties;
}
export const DescribeEntitiesDetectionV2JobResponse = S.suspend(() =>
  S.Struct({
    ComprehendMedicalAsyncJobProperties: S.optional(
      ComprehendMedicalAsyncJobProperties,
    ),
  }),
).annotations({
  identifier: "DescribeEntitiesDetectionV2JobResponse",
}) as any as S.Schema<DescribeEntitiesDetectionV2JobResponse>;
export interface ListEntitiesDetectionV2JobsResponse {
  ComprehendMedicalAsyncJobPropertiesList?: ComprehendMedicalAsyncJobPropertiesList;
  NextToken?: string;
}
export const ListEntitiesDetectionV2JobsResponse = S.suspend(() =>
  S.Struct({
    ComprehendMedicalAsyncJobPropertiesList: S.optional(
      ComprehendMedicalAsyncJobPropertiesList,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEntitiesDetectionV2JobsResponse",
}) as any as S.Schema<ListEntitiesDetectionV2JobsResponse>;
export interface StartEntitiesDetectionV2JobResponse {
  JobId?: string;
}
export const StartEntitiesDetectionV2JobResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }),
).annotations({
  identifier: "StartEntitiesDetectionV2JobResponse",
}) as any as S.Schema<StartEntitiesDetectionV2JobResponse>;
export interface ICD10CMTrait {
  Name?: string;
  Score?: number;
}
export const ICD10CMTrait = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Score: S.optional(S.Number) }),
).annotations({ identifier: "ICD10CMTrait" }) as any as S.Schema<ICD10CMTrait>;
export type ICD10CMTraitList = ICD10CMTrait[];
export const ICD10CMTraitList = S.Array(ICD10CMTrait);
export interface ICD10CMAttribute {
  Type?: string;
  Score?: number;
  RelationshipScore?: number;
  Id?: number;
  BeginOffset?: number;
  EndOffset?: number;
  Text?: string;
  Traits?: ICD10CMTraitList;
  Category?: string;
  RelationshipType?: string;
}
export const ICD10CMAttribute = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Score: S.optional(S.Number),
    RelationshipScore: S.optional(S.Number),
    Id: S.optional(S.Number),
    BeginOffset: S.optional(S.Number),
    EndOffset: S.optional(S.Number),
    Text: S.optional(S.String),
    Traits: S.optional(ICD10CMTraitList),
    Category: S.optional(S.String),
    RelationshipType: S.optional(S.String),
  }),
).annotations({
  identifier: "ICD10CMAttribute",
}) as any as S.Schema<ICD10CMAttribute>;
export type ICD10CMAttributeList = ICD10CMAttribute[];
export const ICD10CMAttributeList = S.Array(ICD10CMAttribute);
export interface ICD10CMConcept {
  Description?: string;
  Code?: string;
  Score?: number;
}
export const ICD10CMConcept = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Code: S.optional(S.String),
    Score: S.optional(S.Number),
  }),
).annotations({
  identifier: "ICD10CMConcept",
}) as any as S.Schema<ICD10CMConcept>;
export type ICD10CMConceptList = ICD10CMConcept[];
export const ICD10CMConceptList = S.Array(ICD10CMConcept);
export interface RxNormTrait {
  Name?: string;
  Score?: number;
}
export const RxNormTrait = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Score: S.optional(S.Number) }),
).annotations({ identifier: "RxNormTrait" }) as any as S.Schema<RxNormTrait>;
export type RxNormTraitList = RxNormTrait[];
export const RxNormTraitList = S.Array(RxNormTrait);
export interface RxNormAttribute {
  Type?: string;
  Score?: number;
  RelationshipScore?: number;
  Id?: number;
  BeginOffset?: number;
  EndOffset?: number;
  Text?: string;
  Traits?: RxNormTraitList;
}
export const RxNormAttribute = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Score: S.optional(S.Number),
    RelationshipScore: S.optional(S.Number),
    Id: S.optional(S.Number),
    BeginOffset: S.optional(S.Number),
    EndOffset: S.optional(S.Number),
    Text: S.optional(S.String),
    Traits: S.optional(RxNormTraitList),
  }),
).annotations({
  identifier: "RxNormAttribute",
}) as any as S.Schema<RxNormAttribute>;
export type RxNormAttributeList = RxNormAttribute[];
export const RxNormAttributeList = S.Array(RxNormAttribute);
export interface RxNormConcept {
  Description?: string;
  Code?: string;
  Score?: number;
}
export const RxNormConcept = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Code: S.optional(S.String),
    Score: S.optional(S.Number),
  }),
).annotations({
  identifier: "RxNormConcept",
}) as any as S.Schema<RxNormConcept>;
export type RxNormConceptList = RxNormConcept[];
export const RxNormConceptList = S.Array(RxNormConcept);
export interface SNOMEDCTTrait {
  Name?: string;
  Score?: number;
}
export const SNOMEDCTTrait = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Score: S.optional(S.Number) }),
).annotations({
  identifier: "SNOMEDCTTrait",
}) as any as S.Schema<SNOMEDCTTrait>;
export type SNOMEDCTTraitList = SNOMEDCTTrait[];
export const SNOMEDCTTraitList = S.Array(SNOMEDCTTrait);
export interface SNOMEDCTConcept {
  Description?: string;
  Code?: string;
  Score?: number;
}
export const SNOMEDCTConcept = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Code: S.optional(S.String),
    Score: S.optional(S.Number),
  }),
).annotations({
  identifier: "SNOMEDCTConcept",
}) as any as S.Schema<SNOMEDCTConcept>;
export type SNOMEDCTConceptList = SNOMEDCTConcept[];
export const SNOMEDCTConceptList = S.Array(SNOMEDCTConcept);
export interface SNOMEDCTAttribute {
  Category?: string;
  Type?: string;
  Score?: number;
  RelationshipScore?: number;
  RelationshipType?: string;
  Id?: number;
  BeginOffset?: number;
  EndOffset?: number;
  Text?: string;
  Traits?: SNOMEDCTTraitList;
  SNOMEDCTConcepts?: SNOMEDCTConceptList;
}
export const SNOMEDCTAttribute = S.suspend(() =>
  S.Struct({
    Category: S.optional(S.String),
    Type: S.optional(S.String),
    Score: S.optional(S.Number),
    RelationshipScore: S.optional(S.Number),
    RelationshipType: S.optional(S.String),
    Id: S.optional(S.Number),
    BeginOffset: S.optional(S.Number),
    EndOffset: S.optional(S.Number),
    Text: S.optional(S.String),
    Traits: S.optional(SNOMEDCTTraitList),
    SNOMEDCTConcepts: S.optional(SNOMEDCTConceptList),
  }),
).annotations({
  identifier: "SNOMEDCTAttribute",
}) as any as S.Schema<SNOMEDCTAttribute>;
export type SNOMEDCTAttributeList = SNOMEDCTAttribute[];
export const SNOMEDCTAttributeList = S.Array(SNOMEDCTAttribute);
export interface ICD10CMEntity {
  Id?: number;
  Text?: string;
  Category?: string;
  Type?: string;
  Score?: number;
  BeginOffset?: number;
  EndOffset?: number;
  Attributes?: ICD10CMAttributeList;
  Traits?: ICD10CMTraitList;
  ICD10CMConcepts?: ICD10CMConceptList;
}
export const ICD10CMEntity = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.Number),
    Text: S.optional(S.String),
    Category: S.optional(S.String),
    Type: S.optional(S.String),
    Score: S.optional(S.Number),
    BeginOffset: S.optional(S.Number),
    EndOffset: S.optional(S.Number),
    Attributes: S.optional(ICD10CMAttributeList),
    Traits: S.optional(ICD10CMTraitList),
    ICD10CMConcepts: S.optional(ICD10CMConceptList),
  }),
).annotations({
  identifier: "ICD10CMEntity",
}) as any as S.Schema<ICD10CMEntity>;
export type ICD10CMEntityList = ICD10CMEntity[];
export const ICD10CMEntityList = S.Array(ICD10CMEntity);
export interface RxNormEntity {
  Id?: number;
  Text?: string;
  Category?: string;
  Type?: string;
  Score?: number;
  BeginOffset?: number;
  EndOffset?: number;
  Attributes?: RxNormAttributeList;
  Traits?: RxNormTraitList;
  RxNormConcepts?: RxNormConceptList;
}
export const RxNormEntity = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.Number),
    Text: S.optional(S.String),
    Category: S.optional(S.String),
    Type: S.optional(S.String),
    Score: S.optional(S.Number),
    BeginOffset: S.optional(S.Number),
    EndOffset: S.optional(S.Number),
    Attributes: S.optional(RxNormAttributeList),
    Traits: S.optional(RxNormTraitList),
    RxNormConcepts: S.optional(RxNormConceptList),
  }),
).annotations({ identifier: "RxNormEntity" }) as any as S.Schema<RxNormEntity>;
export type RxNormEntityList = RxNormEntity[];
export const RxNormEntityList = S.Array(RxNormEntity);
export interface SNOMEDCTEntity {
  Id?: number;
  Text?: string;
  Category?: string;
  Type?: string;
  Score?: number;
  BeginOffset?: number;
  EndOffset?: number;
  Attributes?: SNOMEDCTAttributeList;
  Traits?: SNOMEDCTTraitList;
  SNOMEDCTConcepts?: SNOMEDCTConceptList;
}
export const SNOMEDCTEntity = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.Number),
    Text: S.optional(S.String),
    Category: S.optional(S.String),
    Type: S.optional(S.String),
    Score: S.optional(S.Number),
    BeginOffset: S.optional(S.Number),
    EndOffset: S.optional(S.Number),
    Attributes: S.optional(SNOMEDCTAttributeList),
    Traits: S.optional(SNOMEDCTTraitList),
    SNOMEDCTConcepts: S.optional(SNOMEDCTConceptList),
  }),
).annotations({
  identifier: "SNOMEDCTEntity",
}) as any as S.Schema<SNOMEDCTEntity>;
export type SNOMEDCTEntityList = SNOMEDCTEntity[];
export const SNOMEDCTEntityList = S.Array(SNOMEDCTEntity);
export interface DetectEntitiesResponse {
  Entities: EntityList;
  UnmappedAttributes?: UnmappedAttributeList;
  PaginationToken?: string;
  ModelVersion: string;
}
export const DetectEntitiesResponse = S.suspend(() =>
  S.Struct({
    Entities: EntityList,
    UnmappedAttributes: S.optional(UnmappedAttributeList),
    PaginationToken: S.optional(S.String),
    ModelVersion: S.String,
  }),
).annotations({
  identifier: "DetectEntitiesResponse",
}) as any as S.Schema<DetectEntitiesResponse>;
export interface InferICD10CMResponse {
  Entities: ICD10CMEntityList;
  PaginationToken?: string;
  ModelVersion?: string;
}
export const InferICD10CMResponse = S.suspend(() =>
  S.Struct({
    Entities: ICD10CMEntityList,
    PaginationToken: S.optional(S.String),
    ModelVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "InferICD10CMResponse",
}) as any as S.Schema<InferICD10CMResponse>;
export interface InferRxNormResponse {
  Entities: RxNormEntityList;
  PaginationToken?: string;
  ModelVersion?: string;
}
export const InferRxNormResponse = S.suspend(() =>
  S.Struct({
    Entities: RxNormEntityList,
    PaginationToken: S.optional(S.String),
    ModelVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "InferRxNormResponse",
}) as any as S.Schema<InferRxNormResponse>;
export interface InferSNOMEDCTResponse {
  Entities: SNOMEDCTEntityList;
  PaginationToken?: string;
  ModelVersion?: string;
  SNOMEDCTDetails?: SNOMEDCTDetails;
  Characters?: Characters;
}
export const InferSNOMEDCTResponse = S.suspend(() =>
  S.Struct({
    Entities: SNOMEDCTEntityList,
    PaginationToken: S.optional(S.String),
    ModelVersion: S.optional(S.String),
    SNOMEDCTDetails: S.optional(SNOMEDCTDetails),
    Characters: S.optional(Characters),
  }),
).annotations({
  identifier: "InferSNOMEDCTResponse",
}) as any as S.Schema<InferSNOMEDCTResponse>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidEncodingException extends S.TaggedError<InvalidEncodingException>()(
  "InvalidEncodingException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class TextSizeLimitExceededException extends S.TaggedError<TextSizeLimitExceededException>()(
  "TextSizeLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Starts an asynchronous medical entity detection job for a collection of documents. Use the
 * `DescribeEntitiesDetectionV2Job` operation to track the status of a job.
 */
export const startEntitiesDetectionV2Job: (
  input: StartEntitiesDetectionV2JobRequest,
) => Effect.Effect<
  StartEntitiesDetectionV2JobResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartEntitiesDetectionV2JobRequest,
  output: StartEntitiesDetectionV2JobResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the properties associated with a protected health information (PHI) detection job.
 * Use this operation to get the status of a detection job.
 */
export const describePHIDetectionJob: (
  input: DescribePHIDetectionJobRequest,
) => Effect.Effect<
  DescribePHIDetectionJobResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePHIDetectionJobRequest,
  output: DescribePHIDetectionJobResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the properties associated with an InferRxNorm job. Use this operation to get the
 * status of an inference job.
 */
export const describeRxNormInferenceJob: (
  input: DescribeRxNormInferenceJobRequest,
) => Effect.Effect<
  DescribeRxNormInferenceJobResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRxNormInferenceJobRequest,
  output: DescribeRxNormInferenceJobResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the properties associated with an InferSNOMEDCT job. Use this operation to get the status of an inference job.
 */
export const describeSNOMEDCTInferenceJob: (
  input: DescribeSNOMEDCTInferenceJobRequest,
) => Effect.Effect<
  DescribeSNOMEDCTInferenceJobResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSNOMEDCTInferenceJobRequest,
  output: DescribeSNOMEDCTInferenceJobResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Starts an asynchronous job to detect medical conditions and link them to the ICD-10-CM
 * ontology. Use the `DescribeICD10CMInferenceJob` operation to track the status of a
 * job.
 */
export const startICD10CMInferenceJob: (
  input: StartICD10CMInferenceJobRequest,
) => Effect.Effect<
  StartICD10CMInferenceJobResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartICD10CMInferenceJobRequest,
  output: StartICD10CMInferenceJobResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Starts an asynchronous job to detect protected health information (PHI). Use the
 * `DescribePHIDetectionJob` operation to track the status of a job.
 */
export const startPHIDetectionJob: (
  input: StartPHIDetectionJobRequest,
) => Effect.Effect<
  StartPHIDetectionJobResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartPHIDetectionJobRequest,
  output: StartPHIDetectionJobResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Starts an asynchronous job to detect medication entities and link them to the RxNorm
 * ontology. Use the `DescribeRxNormInferenceJob` operation to track the status of a
 * job.
 */
export const startRxNormInferenceJob: (
  input: StartRxNormInferenceJobRequest,
) => Effect.Effect<
  StartRxNormInferenceJobResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartRxNormInferenceJobRequest,
  output: StartRxNormInferenceJobResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Starts an asynchronous job to detect medical concepts and link them to the SNOMED-CT ontology. Use the DescribeSNOMEDCTInferenceJob operation to track the status of a job.
 */
export const startSNOMEDCTInferenceJob: (
  input: StartSNOMEDCTInferenceJobRequest,
) => Effect.Effect<
  StartSNOMEDCTInferenceJobResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSNOMEDCTInferenceJobRequest,
  output: StartSNOMEDCTInferenceJobResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Stops a medical entities detection job in progress.
 */
export const stopEntitiesDetectionV2Job: (
  input: StopEntitiesDetectionV2JobRequest,
) => Effect.Effect<
  StopEntitiesDetectionV2JobResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopEntitiesDetectionV2JobRequest,
  output: StopEntitiesDetectionV2JobResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Stops an InferICD10CM inference job in progress.
 */
export const stopICD10CMInferenceJob: (
  input: StopICD10CMInferenceJobRequest,
) => Effect.Effect<
  StopICD10CMInferenceJobResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopICD10CMInferenceJobRequest,
  output: StopICD10CMInferenceJobResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Stops a protected health information (PHI) detection job in progress.
 */
export const stopPHIDetectionJob: (
  input: StopPHIDetectionJobRequest,
) => Effect.Effect<
  StopPHIDetectionJobResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopPHIDetectionJobRequest,
  output: StopPHIDetectionJobResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Stops an InferRxNorm inference job in progress.
 */
export const stopRxNormInferenceJob: (
  input: StopRxNormInferenceJobRequest,
) => Effect.Effect<
  StopRxNormInferenceJobResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopRxNormInferenceJobRequest,
  output: StopRxNormInferenceJobResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Stops an InferSNOMEDCT inference job in progress.
 */
export const stopSNOMEDCTInferenceJob: (
  input: StopSNOMEDCTInferenceJobRequest,
) => Effect.Effect<
  StopSNOMEDCTInferenceJobResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopSNOMEDCTInferenceJobRequest,
  output: StopSNOMEDCTInferenceJobResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the properties associated with a medical entities detection job. Use this operation
 * to get the status of a detection job.
 */
export const describeEntitiesDetectionV2Job: (
  input: DescribeEntitiesDetectionV2JobRequest,
) => Effect.Effect<
  DescribeEntitiesDetectionV2JobResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEntitiesDetectionV2JobRequest,
  output: DescribeEntitiesDetectionV2JobResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the properties associated with an InferICD10CM job. Use this operation to get the
 * status of an inference job.
 */
export const describeICD10CMInferenceJob: (
  input: DescribeICD10CMInferenceJobRequest,
) => Effect.Effect<
  DescribeICD10CMInferenceJobResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeICD10CMInferenceJobRequest,
  output: DescribeICD10CMInferenceJobResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Inspects the clinical text for a variety of medical entities and returns specific
 * information about them such as entity category, location, and confidence score on that
 * information. Amazon Comprehend Medical only detects medical entities in English language
 * texts.
 *
 * The `DetectEntitiesV2` operation replaces the DetectEntities
 * operation. This new action uses a different model for determining the entities in your medical
 * text and changes the way that some entities are returned in the output. You should use the
 * `DetectEntitiesV2` operation in all new applications.
 *
 * The `DetectEntitiesV2` operation returns the `Acuity` and
 * `Direction` entities as attributes instead of types.
 */
export const detectEntitiesV2: (
  input: DetectEntitiesV2Request,
) => Effect.Effect<
  DetectEntitiesV2Response,
  | InternalServerException
  | InvalidEncodingException
  | InvalidRequestException
  | ServiceUnavailableException
  | TextSizeLimitExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetectEntitiesV2Request,
  output: DetectEntitiesV2Response,
  errors: [
    InternalServerException,
    InvalidEncodingException,
    InvalidRequestException,
    ServiceUnavailableException,
    TextSizeLimitExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets a list of medical entity detection jobs that you have submitted.
 */
export const listEntitiesDetectionV2Jobs: (
  input: ListEntitiesDetectionV2JobsRequest,
) => Effect.Effect<
  ListEntitiesDetectionV2JobsResponse,
  | InternalServerException
  | InvalidRequestException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEntitiesDetectionV2JobsRequest,
  output: ListEntitiesDetectionV2JobsResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Inspects the clinical text for protected health information (PHI) entities and returns
 * the entity category, location, and confidence score for each entity. Amazon Comprehend Medical
 * only detects entities in English language texts.
 */
export const detectPHI: (
  input: DetectPHIRequest,
) => Effect.Effect<
  DetectPHIResponse,
  | InternalServerException
  | InvalidEncodingException
  | InvalidRequestException
  | ServiceUnavailableException
  | TextSizeLimitExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetectPHIRequest,
  output: DetectPHIResponse,
  errors: [
    InternalServerException,
    InvalidEncodingException,
    InvalidRequestException,
    ServiceUnavailableException,
    TextSizeLimitExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * The `DetectEntities` operation is deprecated. You should use the DetectEntitiesV2 operation instead.
 *
 * Inspects the clinical text for a variety of medical entities and returns specific
 * information about them such as entity category, location, and confidence score on that
 * information.
 */
export const detectEntities: (
  input: DetectEntitiesRequest,
) => Effect.Effect<
  DetectEntitiesResponse,
  | InternalServerException
  | InvalidEncodingException
  | InvalidRequestException
  | ServiceUnavailableException
  | TextSizeLimitExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetectEntitiesRequest,
  output: DetectEntitiesResponse,
  errors: [
    InternalServerException,
    InvalidEncodingException,
    InvalidRequestException,
    ServiceUnavailableException,
    TextSizeLimitExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * InferICD10CM detects medical conditions as entities listed in a patient record and links
 * those entities to normalized concept identifiers in the ICD-10-CM knowledge base from the
 * Centers for Disease Control. Amazon Comprehend Medical only detects medical entities in
 * English language texts.
 */
export const inferICD10CM: (
  input: InferICD10CMRequest,
) => Effect.Effect<
  InferICD10CMResponse,
  | InternalServerException
  | InvalidEncodingException
  | InvalidRequestException
  | ServiceUnavailableException
  | TextSizeLimitExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InferICD10CMRequest,
  output: InferICD10CMResponse,
  errors: [
    InternalServerException,
    InvalidEncodingException,
    InvalidRequestException,
    ServiceUnavailableException,
    TextSizeLimitExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * InferRxNorm detects medications as entities listed in a patient record and links to the
 * normalized concept identifiers in the RxNorm database from the National Library of Medicine.
 * Amazon Comprehend Medical only detects medical entities in English language texts.
 */
export const inferRxNorm: (
  input: InferRxNormRequest,
) => Effect.Effect<
  InferRxNormResponse,
  | InternalServerException
  | InvalidEncodingException
  | InvalidRequestException
  | ServiceUnavailableException
  | TextSizeLimitExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InferRxNormRequest,
  output: InferRxNormResponse,
  errors: [
    InternalServerException,
    InvalidEncodingException,
    InvalidRequestException,
    ServiceUnavailableException,
    TextSizeLimitExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * InferSNOMEDCT detects possible medical concepts as entities and links them to codes from the Systematized Nomenclature of Medicine, Clinical Terms (SNOMED-CT) ontology
 */
export const inferSNOMEDCT: (
  input: InferSNOMEDCTRequest,
) => Effect.Effect<
  InferSNOMEDCTResponse,
  | InternalServerException
  | InvalidEncodingException
  | InvalidRequestException
  | ServiceUnavailableException
  | TextSizeLimitExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InferSNOMEDCTRequest,
  output: InferSNOMEDCTResponse,
  errors: [
    InternalServerException,
    InvalidEncodingException,
    InvalidRequestException,
    ServiceUnavailableException,
    TextSizeLimitExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets a list of InferICD10CM jobs that you have submitted.
 */
export const listICD10CMInferenceJobs: (
  input: ListICD10CMInferenceJobsRequest,
) => Effect.Effect<
  ListICD10CMInferenceJobsResponse,
  | InternalServerException
  | InvalidRequestException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListICD10CMInferenceJobsRequest,
  output: ListICD10CMInferenceJobsResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Gets a list of protected health information (PHI) detection jobs you have
 * submitted.
 */
export const listPHIDetectionJobs: (
  input: ListPHIDetectionJobsRequest,
) => Effect.Effect<
  ListPHIDetectionJobsResponse,
  | InternalServerException
  | InvalidRequestException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPHIDetectionJobsRequest,
  output: ListPHIDetectionJobsResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Gets a list of InferRxNorm jobs that you have submitted.
 */
export const listRxNormInferenceJobs: (
  input: ListRxNormInferenceJobsRequest,
) => Effect.Effect<
  ListRxNormInferenceJobsResponse,
  | InternalServerException
  | InvalidRequestException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRxNormInferenceJobsRequest,
  output: ListRxNormInferenceJobsResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Gets a list of InferSNOMEDCT jobs a user has submitted.
 */
export const listSNOMEDCTInferenceJobs: (
  input: ListSNOMEDCTInferenceJobsRequest,
) => Effect.Effect<
  ListSNOMEDCTInferenceJobsResponse,
  | InternalServerException
  | InvalidRequestException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSNOMEDCTInferenceJobsRequest,
  output: ListSNOMEDCTInferenceJobsResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TooManyRequestsException,
    ValidationException,
  ],
}));

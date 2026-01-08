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
const svc = T.AwsApiService({
  sdkId: "MediaConvert",
  serviceShapeName: "MediaConvert",
});
const auth = T.AwsAuthSigv4({ name: "mediaconvert" });
const ver = T.ServiceVersion("2017-08-29");
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
              `https://mediaconvert-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://mediaconvert.${Region}.amazonaws.com`);
            }
            return e(
              `https://mediaconvert-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://mediaconvert.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        if (Region === "cn-northwest-1") {
          return e(
            "https://subscribe.mediaconvert.cn-northwest-1.amazonaws.com.cn",
          );
        }
        return e(
          `https://mediaconvert.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type __integerMinNegative50Max50 = number;
export type __integerMin1Max20 = number;
export type __integerMinNegative1000Max1000 = number;
export type __integerMin1Max150 = number;
export type __stringMax100 = string;
export type __stringMin14PatternS3BmpBMPPngPNGHttpsBmpBMPPngPNG = string;
export type __stringMin14PatternS3CubeCUBEHttpsCubeCUBE = string;
export type __integerMin0Max2147483647 = number;
export type __integerMin0Max30000 = number;
export type __stringMin14PatternS3XmlXMLHttpsXmlXML = string;
export type __stringMax2048PatternS3Https = string;
export type __integerMin0Max5 = number;
export type __integerMin1Max2147483647 = number;
export type __stringPatternS3ASSETMAPXml = string;
export type __stringMin11Max11Pattern01D20305D205D = string;
export type __stringMin1Max20 = string;
export type __stringMin1Max50PatternAZAZ09 = string;
export type __stringMin1Max2048PatternArnAZSecretsmanagerWD12SecretAZAZ09 =
  string;
export type __doubleMin0 = number;
export type __stringPatternHttpsKantarmedia = string;
export type __stringPatternS3 = string;
export type __stringMin1Max50 = string;
export type __stringMin14PatternS3Mov09PngHttpsMov09Png = string;
export type __integerMin0Max0 = number;
export type __stringPattern0xAFaF0908190908 = string;
export type __integerMin0Max65534 = number;
export type __stringPatternHttps = string;
export type __stringMax2048 = string;
export type __stringPattern010920405090509092 = string;
export type __stringPattern0940191020191209301 = string;
export type __integerMin0Max255 = number;
export type __stringPatternAZaZ23AZaZ09 = string;
export type __stringPatternWS = string;
export type __stringPatternAZaZ23AZaZ = string;
export type __integerMin0Max15 = number;
export type __integerMin32Max8192 = number;
export type __integerMin0Max100 = number;
export type __timestampUnix = Date;
export type __stringPatternSNManifestConfirmConditionNotificationNS = string;
export type __stringPatternSNSignalProcessingNotificationNS = string;
export type __integerMin2Max2147483647 = number;
export type __stringMin24Max512PatternAZaZ0902 = string;
export type __stringMin16Max24PatternAZaZ0922AZaZ0916 = string;
export type __stringMin9Max19PatternAZ26EastWestCentralNorthSouthEastWest1912 =
  string;
export type __integerMin100Max1000 = number;
export type __stringPattern010920405090509092090909 = string;
export type __stringPatternArnAwsAZ09EventsAZ090912ConnectionAZAZ09AF0936 =
  string;
export type __stringPattern019090190908019090190908 = string;
export type __integerMin1Max32 = number;
export type __integerMin1Max86400000 = number;
export type __integerMin1Max1001 = number;
export type __integerMin1Max60000 = number;
export type __stringMin14PatternS3BmpBMPPngPNGTgaTGAHttpsBmpBMPPngPNGTgaTGA =
  string;
export type __integerMin32000Max48000 = number;
export type __integerMinNegative2147483648Max2147483647 = number;
export type __integerMin1Max17895697 = number;
export type __integerMin1Max2147483640 = number;
export type __stringMax256 = string;
export type __stringMin1Max256 = string;
export type __stringMin0 = string;
export type __stringPatternAZaZ0902 = string;
export type __integerMinNegative70Max0 = number;
export type __doubleMinNegative59Max0 = number;
export type __doubleMinNegative8Max0 = number;
export type __integerMin1Max64 = number;
export type __stringMin1PatternArnAwsUsGovCnKmsAZ26EastWestCentralNorthSouthEastWest1912D12KeyAFAF098AFAF094AFAF094AFAF094AFAF0912MrkAFAF0932 =
  string;
export type __stringMax1000 = string;
export type __integerMin32Max8182 = number;
export type __integerMinNegative10000Max10000 = number;
export type __integerMin0Max500 = number;
export type __integerMin0Max10000 = number;
export type __integerMin0Max1000 = number;
export type __integerMin0Max65535 = number;
export type __integerMin0Max3600 = number;
export type __integerMin0Max1 = number;
export type __stringMin1 = string;
export type __stringMin3Max3PatternAZaZ3 = string;
export type __stringPatternS3Https = string;
export type __integerMin0Max8 = number;
export type __integerMin0Max99 = number;
export type __stringPattern01D20305D205D = string;
export type __integerMinNegative1Max2147483647 = number;
export type __integerMin0Max50000 = number;
export type __integerMin100000Max100000000 = number;
export type __doubleMin1Max10 = number;
export type __integerMin3Max15 = number;
export type __doubleMin0Max2147483647 = number;
export type __integerMin6000Max1024000 = number;
export type __integerMin2000Max30000 = number;
export type __integerMin8000Max96000 = number;
export type __integerMin6Max16 = number;
export type __integerMin64000Max640000 = number;
export type __integerMin1Max31 = number;
export type __integerMin48000Max48000 = number;
export type __integerMin16Max24 = number;
export type __integerMin8000Max192000 = number;
export type __integerMin384000Max1024000 = number;
export type __doubleMinNegative6Max3 = number;
export type __doubleMinNegative60MaxNegative1 = number;
export type __integerMin32000Max3024000 = number;
export type __doubleMinNegative60Max3 = number;
export type __integerMin1Max8 = number;
export type __integerMin22050Max192000 = number;
export type __integerMin32000Max384000 = number;
export type __integerMin1Max2 = number;
export type __integerMin16000Max320000 = number;
export type __integerMin22050Max48000 = number;
export type __integerMin0Max9 = number;
export type __integerMin32000Max192000 = number;
export type __integerMin16000Max48000 = number;
export type __integerMinNegative1Max10 = number;
export type __stringPatternS3TtfHttpsTtf = string;
export type __integerMin96Max600 = number;
export type __integerMin0Max96 = number;
export type __stringMin6Max8Pattern09aFAF609aFAF2 = string;
export type __integerMin0Max10 = number;
export type __integerMin1Max4 = number;
export type __integerMin1Max6 = number;
export type __stringMin3Max3Pattern1809aFAF09aEAE = string;
export type __integerMin25Max10000 = number;
export type __integerMin25Max2000 = number;
export type __integerMin1000Max30000 = number;
export type __integerMin1000Max1152000000 = number;
export type __integerMin24Max60000 = number;
export type __integerMin1Max10000000 = number;
export type __integerMin1Max100 = number;
export type __integerMin0Max1152000000 = number;
export type __integerMin0Max30 = number;
export type __integerMin0Max7 = number;
export type __integerMin0Max128 = number;
export type __integerMin1000Max1466400000 = number;
export type __integerMin0Max1466400000 = number;
export type __integerMin64Max2160 = number;
export type __integerMin256Max3840 = number;
export type __integerMin1000Max288000000 = number;
export type __integerMin0Max47185920 = number;
export type __integerMin1000Max300000000 = number;
export type __integerMin1000Max480000000 = number;
export type __integerMinNegative180Max180 = number;
export type __integerMin0Max4000 = number;
export type __integerMin10Max48 = number;
export type __stringPattern = string;
export type __stringMin32Max32Pattern09aFAF32 = string;
export type __integerMin2Max4096 = number;
export type __integerMin8Max4096 = number;
export type __integerMin1Max2048 = number;
export type __integerMin1Max512 = number;
export type __integerMin1Max4096 = number;
export type __integerMinNegative60Max6 = number;
export type __doubleMinNegative60Max6 = number;
export type __integerMin1Max10 = number;
export type __doubleMin0Max1 = number;
export type __integerMin8Max12 = number;
export type __integerMin4Max12 = number;
export type __integerMin90Max105 = number;
export type __integerMin920Max1023 = number;
export type __integerMinNegative5Max10 = number;
export type __integerMin0Max3 = number;
export type __integerMinNegative2Max3 = number;
export type __integerMin0Max16 = number;
export type __integerMin0Max4 = number;
export type __integerMinNegative1Max3 = number;
export type __stringMin1Max100000 = string;
export type __integerMin0Max4194303 = number;
export type __integerMin1Max1 = number;
export type __stringMin14PatternS3SccSCCTtmlTTMLDfxpDFXPStlSTLSrtSRTXmlXMLSmiSMIVttVTTWebvttWEBVTTHttpsSccSCCTtmlTTMLDfxpDFXPStlSTLSrtSRTXmlXMLSmiSMIVttVTTWebvttWEBVTT =
  string;
export type __stringPatternArnAwsUsGovAcm = string;
export type __stringMin36Max36Pattern09aFAF809aFAF409aFAF409aFAF409aFAF12 =
  string;
export type __stringPatternW = string;
export type __stringPatternHttpsD = string;
export type __stringPatternIdentityAZaZ26AZaZ09163 = string;
export type __stringPatternDD = string;
export type __stringPatternAZaZ0932 = string;
export type __stringPattern09aFAF809aFAF409aFAF409aFAF409aFAF12 = string;
export type __stringPatternArnAwsUsGovCnKmsAZ26EastWestCentralNorthSouthEastWest1912D12KeyAFAF098AFAF094AFAF094AFAF094AFAF0912MrkAFAF0932 =
  string;

//# Schemas
export interface DeletePolicyRequest {}
export const DeletePolicyRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/2017-08-29/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePolicyRequest",
}) as any as S.Schema<DeletePolicyRequest>;
export interface DeletePolicyResponse {}
export const DeletePolicyResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeletePolicyResponse",
}) as any as S.Schema<DeletePolicyResponse>;
export interface GetPolicyRequest {}
export const GetPolicyRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2017-08-29/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPolicyRequest",
}) as any as S.Schema<GetPolicyRequest>;
export type BillingTagsSource = "QUEUE" | "PRESET" | "JOB_TEMPLATE" | "JOB";
export const BillingTagsSource = S.Literal(
  "QUEUE",
  "PRESET",
  "JOB_TEMPLATE",
  "JOB",
);
export type SimulateReservedQueue = "DISABLED" | "ENABLED";
export const SimulateReservedQueue = S.Literal("DISABLED", "ENABLED");
export type StatusUpdateInterval =
  | "SECONDS_10"
  | "SECONDS_12"
  | "SECONDS_15"
  | "SECONDS_20"
  | "SECONDS_30"
  | "SECONDS_60"
  | "SECONDS_120"
  | "SECONDS_180"
  | "SECONDS_240"
  | "SECONDS_300"
  | "SECONDS_360"
  | "SECONDS_420"
  | "SECONDS_480"
  | "SECONDS_540"
  | "SECONDS_600";
export const StatusUpdateInterval = S.Literal(
  "SECONDS_10",
  "SECONDS_12",
  "SECONDS_15",
  "SECONDS_20",
  "SECONDS_30",
  "SECONDS_60",
  "SECONDS_120",
  "SECONDS_180",
  "SECONDS_240",
  "SECONDS_300",
  "SECONDS_360",
  "SECONDS_420",
  "SECONDS_480",
  "SECONDS_540",
  "SECONDS_600",
);
export type PricingPlan = "ON_DEMAND" | "RESERVED";
export const PricingPlan = S.Literal("ON_DEMAND", "RESERVED");
export type QueueStatus = "ACTIVE" | "PAUSED";
export const QueueStatus = S.Literal("ACTIVE", "PAUSED");
export type DescribeEndpointsMode = "DEFAULT" | "GET_ONLY";
export const DescribeEndpointsMode = S.Literal("DEFAULT", "GET_ONLY");
export type Order = "ASCENDING" | "DESCENDING";
export const Order = S.Literal("ASCENDING", "DESCENDING");
export type JobStatus =
  | "SUBMITTED"
  | "PROGRESSING"
  | "COMPLETE"
  | "CANCELED"
  | "ERROR";
export const JobStatus = S.Literal(
  "SUBMITTED",
  "PROGRESSING",
  "COMPLETE",
  "CANCELED",
  "ERROR",
);
export type JobTemplateListBy = "NAME" | "CREATION_DATE" | "SYSTEM";
export const JobTemplateListBy = S.Literal("NAME", "CREATION_DATE", "SYSTEM");
export type PresetListBy = "NAME" | "CREATION_DATE" | "SYSTEM";
export const PresetListBy = S.Literal("NAME", "CREATION_DATE", "SYSTEM");
export type QueueListBy = "NAME" | "CREATION_DATE";
export const QueueListBy = S.Literal("NAME", "CREATION_DATE");
export type __listOf__string = string[];
export const __listOf__string = S.Array(S.String);
export interface AssociateCertificateRequest {
  Arn?: string;
}
export const AssociateCertificateRequest = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String).pipe(T.JsonName("arn")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2017-08-29/certificates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateCertificateRequest",
}) as any as S.Schema<AssociateCertificateRequest>;
export interface AssociateCertificateResponse {}
export const AssociateCertificateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateCertificateResponse",
}) as any as S.Schema<AssociateCertificateResponse>;
export interface CancelJobRequest {
  Id: string;
}
export const CancelJobRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/2017-08-29/jobs/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelJobRequest",
}) as any as S.Schema<CancelJobRequest>;
export interface CancelJobResponse {}
export const CancelJobResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "CancelJobResponse",
}) as any as S.Schema<CancelJobResponse>;
export interface CreateResourceShareRequest {
  JobId?: string;
  SupportCaseId?: string;
}
export const CreateResourceShareRequest = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    SupportCaseId: S.optional(S.String).pipe(T.JsonName("supportCaseId")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2017-08-29/resourceShares" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateResourceShareRequest",
}) as any as S.Schema<CreateResourceShareRequest>;
export interface CreateResourceShareResponse {}
export const CreateResourceShareResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateResourceShareResponse",
}) as any as S.Schema<CreateResourceShareResponse>;
export interface DeleteJobTemplateRequest {
  Name: string;
}
export const DeleteJobTemplateRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/2017-08-29/jobTemplates/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteJobTemplateRequest",
}) as any as S.Schema<DeleteJobTemplateRequest>;
export interface DeleteJobTemplateResponse {}
export const DeleteJobTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteJobTemplateResponse",
}) as any as S.Schema<DeleteJobTemplateResponse>;
export interface DeletePresetRequest {
  Name: string;
}
export const DeletePresetRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/2017-08-29/presets/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePresetRequest",
}) as any as S.Schema<DeletePresetRequest>;
export interface DeletePresetResponse {}
export const DeletePresetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeletePresetResponse",
}) as any as S.Schema<DeletePresetResponse>;
export interface DeleteQueueRequest {
  Name: string;
}
export const DeleteQueueRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/2017-08-29/queues/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteQueueRequest",
}) as any as S.Schema<DeleteQueueRequest>;
export interface DeleteQueueResponse {}
export const DeleteQueueResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteQueueResponse",
}) as any as S.Schema<DeleteQueueResponse>;
export interface DescribeEndpointsRequest {
  MaxResults?: number;
  Mode?: DescribeEndpointsMode;
  NextToken?: string;
}
export const DescribeEndpointsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    Mode: S.optional(DescribeEndpointsMode).pipe(T.JsonName("mode")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2017-08-29/endpoints" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEndpointsRequest",
}) as any as S.Schema<DescribeEndpointsRequest>;
export interface DisassociateCertificateRequest {
  Arn: string;
}
export const DisassociateCertificateRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/2017-08-29/certificates/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateCertificateRequest",
}) as any as S.Schema<DisassociateCertificateRequest>;
export interface DisassociateCertificateResponse {}
export const DisassociateCertificateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateCertificateResponse",
}) as any as S.Schema<DisassociateCertificateResponse>;
export interface GetJobRequest {
  Id: string;
}
export const GetJobRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2017-08-29/jobs/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetJobRequest",
}) as any as S.Schema<GetJobRequest>;
export interface GetJobsQueryResultsRequest {
  Id: string;
}
export const GetJobsQueryResultsRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2017-08-29/jobsQueries/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetJobsQueryResultsRequest",
}) as any as S.Schema<GetJobsQueryResultsRequest>;
export interface GetJobTemplateRequest {
  Name: string;
}
export const GetJobTemplateRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2017-08-29/jobTemplates/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetJobTemplateRequest",
}) as any as S.Schema<GetJobTemplateRequest>;
export interface GetPresetRequest {
  Name: string;
}
export const GetPresetRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2017-08-29/presets/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPresetRequest",
}) as any as S.Schema<GetPresetRequest>;
export interface GetQueueRequest {
  Name: string;
}
export const GetQueueRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2017-08-29/queues/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetQueueRequest",
}) as any as S.Schema<GetQueueRequest>;
export interface ListJobsRequest {
  MaxResults?: number;
  NextToken?: string;
  Order?: Order;
  Queue?: string;
  Status?: JobStatus;
}
export const ListJobsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Order: S.optional(Order).pipe(T.HttpQuery("order")),
    Queue: S.optional(S.String).pipe(T.HttpQuery("queue")),
    Status: S.optional(JobStatus).pipe(T.HttpQuery("status")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2017-08-29/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListJobsRequest",
}) as any as S.Schema<ListJobsRequest>;
export interface ListJobTemplatesRequest {
  Category?: string;
  ListBy?: JobTemplateListBy;
  MaxResults?: number;
  NextToken?: string;
  Order?: Order;
}
export const ListJobTemplatesRequest = S.suspend(() =>
  S.Struct({
    Category: S.optional(S.String).pipe(T.HttpQuery("category")),
    ListBy: S.optional(JobTemplateListBy).pipe(T.HttpQuery("listBy")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Order: S.optional(Order).pipe(T.HttpQuery("order")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2017-08-29/jobTemplates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListJobTemplatesRequest",
}) as any as S.Schema<ListJobTemplatesRequest>;
export interface ListPresetsRequest {
  Category?: string;
  ListBy?: PresetListBy;
  MaxResults?: number;
  NextToken?: string;
  Order?: Order;
}
export const ListPresetsRequest = S.suspend(() =>
  S.Struct({
    Category: S.optional(S.String).pipe(T.HttpQuery("category")),
    ListBy: S.optional(PresetListBy).pipe(T.HttpQuery("listBy")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Order: S.optional(Order).pipe(T.HttpQuery("order")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2017-08-29/presets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPresetsRequest",
}) as any as S.Schema<ListPresetsRequest>;
export interface ListQueuesRequest {
  ListBy?: QueueListBy;
  MaxResults?: number;
  NextToken?: string;
  Order?: Order;
}
export const ListQueuesRequest = S.suspend(() =>
  S.Struct({
    ListBy: S.optional(QueueListBy).pipe(T.HttpQuery("listBy")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Order: S.optional(Order).pipe(T.HttpQuery("order")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2017-08-29/queues" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListQueuesRequest",
}) as any as S.Schema<ListQueuesRequest>;
export interface ListTagsForResourceRequest {
  Arn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2017-08-29/tags/{Arn}" }),
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
export interface ListVersionsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListVersionsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2017-08-29/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVersionsRequest",
}) as any as S.Schema<ListVersionsRequest>;
export type InputPolicy = "ALLOWED" | "DISALLOWED";
export const InputPolicy = S.Literal("ALLOWED", "DISALLOWED");
export interface Policy {
  HttpInputs?: InputPolicy;
  HttpsInputs?: InputPolicy;
  S3Inputs?: InputPolicy;
}
export const Policy = S.suspend(() =>
  S.Struct({
    HttpInputs: S.optional(InputPolicy).pipe(T.JsonName("httpInputs")),
    HttpsInputs: S.optional(InputPolicy).pipe(T.JsonName("httpsInputs")),
    S3Inputs: S.optional(InputPolicy).pipe(T.JsonName("s3Inputs")),
  }),
).annotations({ identifier: "Policy" }) as any as S.Schema<Policy>;
export interface PutPolicyRequest {
  Policy?: Policy;
}
export const PutPolicyRequest = S.suspend(() =>
  S.Struct({
    Policy: S.optional(Policy)
      .pipe(T.JsonName("policy"))
      .annotations({ identifier: "Policy" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/2017-08-29/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutPolicyRequest",
}) as any as S.Schema<PutPolicyRequest>;
export interface SearchJobsRequest {
  InputFile?: string;
  MaxResults?: number;
  NextToken?: string;
  Order?: Order;
  Queue?: string;
  Status?: JobStatus;
}
export const SearchJobsRequest = S.suspend(() =>
  S.Struct({
    InputFile: S.optional(S.String).pipe(T.HttpQuery("inputFile")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Order: S.optional(Order).pipe(T.HttpQuery("order")),
    Queue: S.optional(S.String).pipe(T.HttpQuery("queue")),
    Status: S.optional(JobStatus).pipe(T.HttpQuery("status")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2017-08-29/search" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchJobsRequest",
}) as any as S.Schema<SearchJobsRequest>;
export type __mapOf__string = { [key: string]: string };
export const __mapOf__string = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  Arn?: string;
  Tags?: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2017-08-29/tags" }),
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
export interface UntagResourceRequest {
  Arn: string;
  TagKeys?: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.HttpLabel("Arn")),
    TagKeys: S.optional(__listOf__string).pipe(T.JsonName("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/2017-08-29/tags/{Arn}" }),
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
export type AccelerationMode = "DISABLED" | "ENABLED" | "PREFERRED";
export const AccelerationMode = S.Literal("DISABLED", "ENABLED", "PREFERRED");
export interface AccelerationSettings {
  Mode?: AccelerationMode;
}
export const AccelerationSettings = S.suspend(() =>
  S.Struct({ Mode: S.optional(AccelerationMode).pipe(T.JsonName("mode")) }),
).annotations({
  identifier: "AccelerationSettings",
}) as any as S.Schema<AccelerationSettings>;
export interface HopDestination {
  Priority?: number;
  Queue?: string;
  WaitMinutes?: number;
}
export const HopDestination = S.suspend(() =>
  S.Struct({
    Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
    Queue: S.optional(S.String).pipe(T.JsonName("queue")),
    WaitMinutes: S.optional(S.Number).pipe(T.JsonName("waitMinutes")),
  }),
).annotations({
  identifier: "HopDestination",
}) as any as S.Schema<HopDestination>;
export type __listOfHopDestination = HopDestination[];
export const __listOfHopDestination = S.Array(HopDestination);
export interface AvailBlanking {
  AvailBlankingImage?: string;
}
export const AvailBlanking = S.suspend(() =>
  S.Struct({
    AvailBlankingImage: S.optional(S.String).pipe(
      T.JsonName("availBlankingImage"),
    ),
  }),
).annotations({
  identifier: "AvailBlanking",
}) as any as S.Schema<AvailBlanking>;
export type ColorSpace =
  | "FOLLOW"
  | "REC_601"
  | "REC_709"
  | "HDR10"
  | "HLG_2020"
  | "P3DCI"
  | "P3D65_SDR"
  | "P3D65_HDR";
export const ColorSpace = S.Literal(
  "FOLLOW",
  "REC_601",
  "REC_709",
  "HDR10",
  "HLG_2020",
  "P3DCI",
  "P3D65_SDR",
  "P3D65_HDR",
);
export interface ColorConversion3DLUTSetting {
  FileInput?: string;
  InputColorSpace?: ColorSpace;
  InputMasteringLuminance?: number;
  OutputColorSpace?: ColorSpace;
  OutputMasteringLuminance?: number;
}
export const ColorConversion3DLUTSetting = S.suspend(() =>
  S.Struct({
    FileInput: S.optional(S.String).pipe(T.JsonName("fileInput")),
    InputColorSpace: S.optional(ColorSpace).pipe(T.JsonName("inputColorSpace")),
    InputMasteringLuminance: S.optional(S.Number).pipe(
      T.JsonName("inputMasteringLuminance"),
    ),
    OutputColorSpace: S.optional(ColorSpace).pipe(
      T.JsonName("outputColorSpace"),
    ),
    OutputMasteringLuminance: S.optional(S.Number).pipe(
      T.JsonName("outputMasteringLuminance"),
    ),
  }),
).annotations({
  identifier: "ColorConversion3DLUTSetting",
}) as any as S.Schema<ColorConversion3DLUTSetting>;
export type __listOfColorConversion3DLUTSetting = ColorConversion3DLUTSetting[];
export const __listOfColorConversion3DLUTSetting = S.Array(
  ColorConversion3DLUTSetting,
);
export interface EsamManifestConfirmConditionNotification {
  MccXml?: string;
}
export const EsamManifestConfirmConditionNotification = S.suspend(() =>
  S.Struct({ MccXml: S.optional(S.String).pipe(T.JsonName("mccXml")) }),
).annotations({
  identifier: "EsamManifestConfirmConditionNotification",
}) as any as S.Schema<EsamManifestConfirmConditionNotification>;
export interface EsamSignalProcessingNotification {
  SccXml?: string;
}
export const EsamSignalProcessingNotification = S.suspend(() =>
  S.Struct({ SccXml: S.optional(S.String).pipe(T.JsonName("sccXml")) }),
).annotations({
  identifier: "EsamSignalProcessingNotification",
}) as any as S.Schema<EsamSignalProcessingNotification>;
export interface EsamSettings {
  ManifestConfirmConditionNotification?: EsamManifestConfirmConditionNotification;
  ResponseSignalPreroll?: number;
  SignalProcessingNotification?: EsamSignalProcessingNotification;
}
export const EsamSettings = S.suspend(() =>
  S.Struct({
    ManifestConfirmConditionNotification: S.optional(
      EsamManifestConfirmConditionNotification,
    )
      .pipe(T.JsonName("manifestConfirmConditionNotification"))
      .annotations({ identifier: "EsamManifestConfirmConditionNotification" }),
    ResponseSignalPreroll: S.optional(S.Number).pipe(
      T.JsonName("responseSignalPreroll"),
    ),
    SignalProcessingNotification: S.optional(EsamSignalProcessingNotification)
      .pipe(T.JsonName("signalProcessingNotification"))
      .annotations({ identifier: "EsamSignalProcessingNotification" }),
  }),
).annotations({ identifier: "EsamSettings" }) as any as S.Schema<EsamSettings>;
export type CopyProtectionAction = "PASSTHROUGH" | "STRIP";
export const CopyProtectionAction = S.Literal("PASSTHROUGH", "STRIP");
export type VchipAction = "PASSTHROUGH" | "STRIP";
export const VchipAction = S.Literal("PASSTHROUGH", "STRIP");
export interface ExtendedDataServices {
  CopyProtectionAction?: CopyProtectionAction;
  VchipAction?: VchipAction;
}
export const ExtendedDataServices = S.suspend(() =>
  S.Struct({
    CopyProtectionAction: S.optional(CopyProtectionAction).pipe(
      T.JsonName("copyProtectionAction"),
    ),
    VchipAction: S.optional(VchipAction).pipe(T.JsonName("vchipAction")),
  }),
).annotations({
  identifier: "ExtendedDataServices",
}) as any as S.Schema<ExtendedDataServices>;
export type AdvancedInputFilter = "ENABLED" | "DISABLED";
export const AdvancedInputFilter = S.Literal("ENABLED", "DISABLED");
export type AdvancedInputFilterAddTexture = "ENABLED" | "DISABLED";
export const AdvancedInputFilterAddTexture = S.Literal("ENABLED", "DISABLED");
export type AdvancedInputFilterSharpen = "OFF" | "LOW" | "HIGH";
export const AdvancedInputFilterSharpen = S.Literal("OFF", "LOW", "HIGH");
export interface AdvancedInputFilterSettings {
  AddTexture?: AdvancedInputFilterAddTexture;
  Sharpening?: AdvancedInputFilterSharpen;
}
export const AdvancedInputFilterSettings = S.suspend(() =>
  S.Struct({
    AddTexture: S.optional(AdvancedInputFilterAddTexture).pipe(
      T.JsonName("addTexture"),
    ),
    Sharpening: S.optional(AdvancedInputFilterSharpen).pipe(
      T.JsonName("sharpening"),
    ),
  }),
).annotations({
  identifier: "AdvancedInputFilterSettings",
}) as any as S.Schema<AdvancedInputFilterSettings>;
export type __listOf__stringMin1 = string[];
export const __listOf__stringMin1 = S.Array(S.String);
export interface AudioSelectorGroup {
  AudioSelectorNames?: string[];
}
export const AudioSelectorGroup = S.suspend(() =>
  S.Struct({
    AudioSelectorNames: S.optional(__listOf__stringMin1).pipe(
      T.JsonName("audioSelectorNames"),
    ),
  }),
).annotations({
  identifier: "AudioSelectorGroup",
}) as any as S.Schema<AudioSelectorGroup>;
export type __mapOfAudioSelectorGroup = { [key: string]: AudioSelectorGroup };
export const __mapOfAudioSelectorGroup = S.Record({
  key: S.String,
  value: AudioSelectorGroup,
});
export type AudioDurationCorrection =
  | "DISABLED"
  | "AUTO"
  | "TRACK"
  | "FRAME"
  | "FORCE";
export const AudioDurationCorrection = S.Literal(
  "DISABLED",
  "AUTO",
  "TRACK",
  "FRAME",
  "FORCE",
);
export type AudioDefaultSelection = "DEFAULT" | "NOT_DEFAULT";
export const AudioDefaultSelection = S.Literal("DEFAULT", "NOT_DEFAULT");
export type LanguageCode =
  | "ENG"
  | "SPA"
  | "FRA"
  | "DEU"
  | "GER"
  | "ZHO"
  | "ARA"
  | "HIN"
  | "JPN"
  | "RUS"
  | "POR"
  | "ITA"
  | "URD"
  | "VIE"
  | "KOR"
  | "PAN"
  | "ABK"
  | "AAR"
  | "AFR"
  | "AKA"
  | "SQI"
  | "AMH"
  | "ARG"
  | "HYE"
  | "ASM"
  | "AVA"
  | "AVE"
  | "AYM"
  | "AZE"
  | "BAM"
  | "BAK"
  | "EUS"
  | "BEL"
  | "BEN"
  | "BIH"
  | "BIS"
  | "BOS"
  | "BRE"
  | "BUL"
  | "MYA"
  | "CAT"
  | "KHM"
  | "CHA"
  | "CHE"
  | "NYA"
  | "CHU"
  | "CHV"
  | "COR"
  | "COS"
  | "CRE"
  | "HRV"
  | "CES"
  | "DAN"
  | "DIV"
  | "NLD"
  | "DZO"
  | "ENM"
  | "EPO"
  | "EST"
  | "EWE"
  | "FAO"
  | "FIJ"
  | "FIN"
  | "FRM"
  | "FUL"
  | "GLA"
  | "GLG"
  | "LUG"
  | "KAT"
  | "ELL"
  | "GRN"
  | "GUJ"
  | "HAT"
  | "HAU"
  | "HEB"
  | "HER"
  | "HMO"
  | "HUN"
  | "ISL"
  | "IDO"
  | "IBO"
  | "IND"
  | "INA"
  | "ILE"
  | "IKU"
  | "IPK"
  | "GLE"
  | "JAV"
  | "KAL"
  | "KAN"
  | "KAU"
  | "KAS"
  | "KAZ"
  | "KIK"
  | "KIN"
  | "KIR"
  | "KOM"
  | "KON"
  | "KUA"
  | "KUR"
  | "LAO"
  | "LAT"
  | "LAV"
  | "LIM"
  | "LIN"
  | "LIT"
  | "LUB"
  | "LTZ"
  | "MKD"
  | "MLG"
  | "MSA"
  | "MAL"
  | "MLT"
  | "GLV"
  | "MRI"
  | "MAR"
  | "MAH"
  | "MON"
  | "NAU"
  | "NAV"
  | "NDE"
  | "NBL"
  | "NDO"
  | "NEP"
  | "SME"
  | "NOR"
  | "NOB"
  | "NNO"
  | "OCI"
  | "OJI"
  | "ORI"
  | "ORM"
  | "OSS"
  | "PLI"
  | "FAS"
  | "POL"
  | "PUS"
  | "QUE"
  | "QAA"
  | "RON"
  | "ROH"
  | "RUN"
  | "SMO"
  | "SAG"
  | "SAN"
  | "SRD"
  | "SRB"
  | "SNA"
  | "III"
  | "SND"
  | "SIN"
  | "SLK"
  | "SLV"
  | "SOM"
  | "SOT"
  | "SUN"
  | "SWA"
  | "SSW"
  | "SWE"
  | "TGL"
  | "TAH"
  | "TGK"
  | "TAM"
  | "TAT"
  | "TEL"
  | "THA"
  | "BOD"
  | "TIR"
  | "TON"
  | "TSO"
  | "TSN"
  | "TUR"
  | "TUK"
  | "TWI"
  | "UIG"
  | "UKR"
  | "UZB"
  | "VEN"
  | "VOL"
  | "WLN"
  | "CYM"
  | "FRY"
  | "WOL"
  | "XHO"
  | "YID"
  | "YOR"
  | "ZHA"
  | "ZUL"
  | "ORJ"
  | "QPC"
  | "TNG"
  | "SRP";
export const LanguageCode = S.Literal(
  "ENG",
  "SPA",
  "FRA",
  "DEU",
  "GER",
  "ZHO",
  "ARA",
  "HIN",
  "JPN",
  "RUS",
  "POR",
  "ITA",
  "URD",
  "VIE",
  "KOR",
  "PAN",
  "ABK",
  "AAR",
  "AFR",
  "AKA",
  "SQI",
  "AMH",
  "ARG",
  "HYE",
  "ASM",
  "AVA",
  "AVE",
  "AYM",
  "AZE",
  "BAM",
  "BAK",
  "EUS",
  "BEL",
  "BEN",
  "BIH",
  "BIS",
  "BOS",
  "BRE",
  "BUL",
  "MYA",
  "CAT",
  "KHM",
  "CHA",
  "CHE",
  "NYA",
  "CHU",
  "CHV",
  "COR",
  "COS",
  "CRE",
  "HRV",
  "CES",
  "DAN",
  "DIV",
  "NLD",
  "DZO",
  "ENM",
  "EPO",
  "EST",
  "EWE",
  "FAO",
  "FIJ",
  "FIN",
  "FRM",
  "FUL",
  "GLA",
  "GLG",
  "LUG",
  "KAT",
  "ELL",
  "GRN",
  "GUJ",
  "HAT",
  "HAU",
  "HEB",
  "HER",
  "HMO",
  "HUN",
  "ISL",
  "IDO",
  "IBO",
  "IND",
  "INA",
  "ILE",
  "IKU",
  "IPK",
  "GLE",
  "JAV",
  "KAL",
  "KAN",
  "KAU",
  "KAS",
  "KAZ",
  "KIK",
  "KIN",
  "KIR",
  "KOM",
  "KON",
  "KUA",
  "KUR",
  "LAO",
  "LAT",
  "LAV",
  "LIM",
  "LIN",
  "LIT",
  "LUB",
  "LTZ",
  "MKD",
  "MLG",
  "MSA",
  "MAL",
  "MLT",
  "GLV",
  "MRI",
  "MAR",
  "MAH",
  "MON",
  "NAU",
  "NAV",
  "NDE",
  "NBL",
  "NDO",
  "NEP",
  "SME",
  "NOR",
  "NOB",
  "NNO",
  "OCI",
  "OJI",
  "ORI",
  "ORM",
  "OSS",
  "PLI",
  "FAS",
  "POL",
  "PUS",
  "QUE",
  "QAA",
  "RON",
  "ROH",
  "RUN",
  "SMO",
  "SAG",
  "SAN",
  "SRD",
  "SRB",
  "SNA",
  "III",
  "SND",
  "SIN",
  "SLK",
  "SLV",
  "SOM",
  "SOT",
  "SUN",
  "SWA",
  "SSW",
  "SWE",
  "TGL",
  "TAH",
  "TGK",
  "TAM",
  "TAT",
  "TEL",
  "THA",
  "BOD",
  "TIR",
  "TON",
  "TSO",
  "TSN",
  "TUR",
  "TUK",
  "TWI",
  "UIG",
  "UKR",
  "UZB",
  "VEN",
  "VOL",
  "WLN",
  "CYM",
  "FRY",
  "WOL",
  "XHO",
  "YID",
  "YOR",
  "ZHA",
  "ZUL",
  "ORJ",
  "QPC",
  "TNG",
  "SRP",
);
export interface HlsRenditionGroupSettings {
  RenditionGroupId?: string;
  RenditionLanguageCode?: LanguageCode;
  RenditionName?: string;
}
export const HlsRenditionGroupSettings = S.suspend(() =>
  S.Struct({
    RenditionGroupId: S.optional(S.String).pipe(T.JsonName("renditionGroupId")),
    RenditionLanguageCode: S.optional(LanguageCode).pipe(
      T.JsonName("renditionLanguageCode"),
    ),
    RenditionName: S.optional(S.String).pipe(T.JsonName("renditionName")),
  }),
).annotations({
  identifier: "HlsRenditionGroupSettings",
}) as any as S.Schema<HlsRenditionGroupSettings>;
export type __listOf__integerMin1Max2147483647 = number[];
export const __listOf__integerMin1Max2147483647 = S.Array(S.Number);
export type __listOf__integerMinNegative60Max6 = number[];
export const __listOf__integerMinNegative60Max6 = S.Array(S.Number);
export type __listOf__doubleMinNegative60Max6 = number[];
export const __listOf__doubleMinNegative60Max6 = S.Array(S.Number);
export interface OutputChannelMapping {
  InputChannels?: number[];
  InputChannelsFineTune?: number[];
}
export const OutputChannelMapping = S.suspend(() =>
  S.Struct({
    InputChannels: S.optional(__listOf__integerMinNegative60Max6).pipe(
      T.JsonName("inputChannels"),
    ),
    InputChannelsFineTune: S.optional(__listOf__doubleMinNegative60Max6).pipe(
      T.JsonName("inputChannelsFineTune"),
    ),
  }),
).annotations({
  identifier: "OutputChannelMapping",
}) as any as S.Schema<OutputChannelMapping>;
export type __listOfOutputChannelMapping = OutputChannelMapping[];
export const __listOfOutputChannelMapping = S.Array(OutputChannelMapping);
export interface ChannelMapping {
  OutputChannels?: OutputChannelMapping[];
}
export const ChannelMapping = S.suspend(() =>
  S.Struct({
    OutputChannels: S.optional(__listOfOutputChannelMapping).pipe(
      T.JsonName("outputChannels"),
    ),
  }),
).annotations({
  identifier: "ChannelMapping",
}) as any as S.Schema<ChannelMapping>;
export interface RemixSettings {
  AudioDescriptionAudioChannel?: number;
  AudioDescriptionDataChannel?: number;
  ChannelMapping?: ChannelMapping;
  ChannelsIn?: number;
  ChannelsOut?: number;
}
export const RemixSettings = S.suspend(() =>
  S.Struct({
    AudioDescriptionAudioChannel: S.optional(S.Number).pipe(
      T.JsonName("audioDescriptionAudioChannel"),
    ),
    AudioDescriptionDataChannel: S.optional(S.Number).pipe(
      T.JsonName("audioDescriptionDataChannel"),
    ),
    ChannelMapping: S.optional(ChannelMapping)
      .pipe(T.JsonName("channelMapping"))
      .annotations({ identifier: "ChannelMapping" }),
    ChannelsIn: S.optional(S.Number).pipe(T.JsonName("channelsIn")),
    ChannelsOut: S.optional(S.Number).pipe(T.JsonName("channelsOut")),
  }),
).annotations({
  identifier: "RemixSettings",
}) as any as S.Schema<RemixSettings>;
export type AudioSelectorType =
  | "PID"
  | "TRACK"
  | "LANGUAGE_CODE"
  | "HLS_RENDITION_GROUP"
  | "ALL_PCM"
  | "STREAM";
export const AudioSelectorType = S.Literal(
  "PID",
  "TRACK",
  "LANGUAGE_CODE",
  "HLS_RENDITION_GROUP",
  "ALL_PCM",
  "STREAM",
);
export interface AudioSelector {
  AudioDurationCorrection?: AudioDurationCorrection;
  CustomLanguageCode?: string;
  DefaultSelection?: AudioDefaultSelection;
  ExternalAudioFileInput?: string;
  HlsRenditionGroupSettings?: HlsRenditionGroupSettings;
  LanguageCode?: LanguageCode;
  Offset?: number;
  Pids?: number[];
  ProgramSelection?: number;
  RemixSettings?: RemixSettings;
  SelectorType?: AudioSelectorType;
  Streams?: number[];
  Tracks?: number[];
}
export const AudioSelector = S.suspend(() =>
  S.Struct({
    AudioDurationCorrection: S.optional(AudioDurationCorrection).pipe(
      T.JsonName("audioDurationCorrection"),
    ),
    CustomLanguageCode: S.optional(S.String).pipe(
      T.JsonName("customLanguageCode"),
    ),
    DefaultSelection: S.optional(AudioDefaultSelection).pipe(
      T.JsonName("defaultSelection"),
    ),
    ExternalAudioFileInput: S.optional(S.String).pipe(
      T.JsonName("externalAudioFileInput"),
    ),
    HlsRenditionGroupSettings: S.optional(HlsRenditionGroupSettings)
      .pipe(T.JsonName("hlsRenditionGroupSettings"))
      .annotations({ identifier: "HlsRenditionGroupSettings" }),
    LanguageCode: S.optional(LanguageCode).pipe(T.JsonName("languageCode")),
    Offset: S.optional(S.Number).pipe(T.JsonName("offset")),
    Pids: S.optional(__listOf__integerMin1Max2147483647).pipe(
      T.JsonName("pids"),
    ),
    ProgramSelection: S.optional(S.Number).pipe(T.JsonName("programSelection")),
    RemixSettings: S.optional(RemixSettings)
      .pipe(T.JsonName("remixSettings"))
      .annotations({ identifier: "RemixSettings" }),
    SelectorType: S.optional(AudioSelectorType).pipe(
      T.JsonName("selectorType"),
    ),
    Streams: S.optional(__listOf__integerMin1Max2147483647).pipe(
      T.JsonName("streams"),
    ),
    Tracks: S.optional(__listOf__integerMin1Max2147483647).pipe(
      T.JsonName("tracks"),
    ),
  }),
).annotations({
  identifier: "AudioSelector",
}) as any as S.Schema<AudioSelector>;
export type __mapOfAudioSelector = { [key: string]: AudioSelector };
export const __mapOfAudioSelector = S.Record({
  key: S.String,
  value: AudioSelector,
});
export type AncillaryConvert608To708 = "UPCONVERT" | "DISABLED";
export const AncillaryConvert608To708 = S.Literal("UPCONVERT", "DISABLED");
export type AncillaryTerminateCaptions = "END_OF_INPUT" | "DISABLED";
export const AncillaryTerminateCaptions = S.Literal("END_OF_INPUT", "DISABLED");
export interface AncillarySourceSettings {
  Convert608To708?: AncillaryConvert608To708;
  SourceAncillaryChannelNumber?: number;
  TerminateCaptions?: AncillaryTerminateCaptions;
}
export const AncillarySourceSettings = S.suspend(() =>
  S.Struct({
    Convert608To708: S.optional(AncillaryConvert608To708).pipe(
      T.JsonName("convert608To708"),
    ),
    SourceAncillaryChannelNumber: S.optional(S.Number).pipe(
      T.JsonName("sourceAncillaryChannelNumber"),
    ),
    TerminateCaptions: S.optional(AncillaryTerminateCaptions).pipe(
      T.JsonName("terminateCaptions"),
    ),
  }),
).annotations({
  identifier: "AncillarySourceSettings",
}) as any as S.Schema<AncillarySourceSettings>;
export interface DvbSubSourceSettings {
  Pid?: number;
}
export const DvbSubSourceSettings = S.suspend(() =>
  S.Struct({ Pid: S.optional(S.Number).pipe(T.JsonName("pid")) }),
).annotations({
  identifier: "DvbSubSourceSettings",
}) as any as S.Schema<DvbSubSourceSettings>;
export type EmbeddedConvert608To708 = "UPCONVERT" | "DISABLED";
export const EmbeddedConvert608To708 = S.Literal("UPCONVERT", "DISABLED");
export type EmbeddedTerminateCaptions = "END_OF_INPUT" | "DISABLED";
export const EmbeddedTerminateCaptions = S.Literal("END_OF_INPUT", "DISABLED");
export interface EmbeddedSourceSettings {
  Convert608To708?: EmbeddedConvert608To708;
  Source608ChannelNumber?: number;
  Source608TrackNumber?: number;
  TerminateCaptions?: EmbeddedTerminateCaptions;
}
export const EmbeddedSourceSettings = S.suspend(() =>
  S.Struct({
    Convert608To708: S.optional(EmbeddedConvert608To708).pipe(
      T.JsonName("convert608To708"),
    ),
    Source608ChannelNumber: S.optional(S.Number).pipe(
      T.JsonName("source608ChannelNumber"),
    ),
    Source608TrackNumber: S.optional(S.Number).pipe(
      T.JsonName("source608TrackNumber"),
    ),
    TerminateCaptions: S.optional(EmbeddedTerminateCaptions).pipe(
      T.JsonName("terminateCaptions"),
    ),
  }),
).annotations({
  identifier: "EmbeddedSourceSettings",
}) as any as S.Schema<EmbeddedSourceSettings>;
export type CaptionSourceByteRateLimit = "ENABLED" | "DISABLED";
export const CaptionSourceByteRateLimit = S.Literal("ENABLED", "DISABLED");
export type FileSourceConvert608To708 = "UPCONVERT" | "DISABLED";
export const FileSourceConvert608To708 = S.Literal("UPCONVERT", "DISABLED");
export type CaptionSourceConvertPaintOnToPopOn = "ENABLED" | "DISABLED";
export const CaptionSourceConvertPaintOnToPopOn = S.Literal(
  "ENABLED",
  "DISABLED",
);
export interface CaptionSourceFramerate {
  FramerateDenominator?: number;
  FramerateNumerator?: number;
}
export const CaptionSourceFramerate = S.suspend(() =>
  S.Struct({
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
  }),
).annotations({
  identifier: "CaptionSourceFramerate",
}) as any as S.Schema<CaptionSourceFramerate>;
export type FileSourceTimeDeltaUnits = "SECONDS" | "MILLISECONDS";
export const FileSourceTimeDeltaUnits = S.Literal("SECONDS", "MILLISECONDS");
export type CaptionSourceUpconvertSTLToTeletext = "UPCONVERT" | "DISABLED";
export const CaptionSourceUpconvertSTLToTeletext = S.Literal(
  "UPCONVERT",
  "DISABLED",
);
export interface FileSourceSettings {
  ByteRateLimit?: CaptionSourceByteRateLimit;
  Convert608To708?: FileSourceConvert608To708;
  ConvertPaintToPop?: CaptionSourceConvertPaintOnToPopOn;
  Framerate?: CaptionSourceFramerate;
  SourceFile?: string;
  TimeDelta?: number;
  TimeDeltaUnits?: FileSourceTimeDeltaUnits;
  UpconvertSTLToTeletext?: CaptionSourceUpconvertSTLToTeletext;
}
export const FileSourceSettings = S.suspend(() =>
  S.Struct({
    ByteRateLimit: S.optional(CaptionSourceByteRateLimit).pipe(
      T.JsonName("byteRateLimit"),
    ),
    Convert608To708: S.optional(FileSourceConvert608To708).pipe(
      T.JsonName("convert608To708"),
    ),
    ConvertPaintToPop: S.optional(CaptionSourceConvertPaintOnToPopOn).pipe(
      T.JsonName("convertPaintToPop"),
    ),
    Framerate: S.optional(CaptionSourceFramerate)
      .pipe(T.JsonName("framerate"))
      .annotations({ identifier: "CaptionSourceFramerate" }),
    SourceFile: S.optional(S.String).pipe(T.JsonName("sourceFile")),
    TimeDelta: S.optional(S.Number).pipe(T.JsonName("timeDelta")),
    TimeDeltaUnits: S.optional(FileSourceTimeDeltaUnits).pipe(
      T.JsonName("timeDeltaUnits"),
    ),
    UpconvertSTLToTeletext: S.optional(
      CaptionSourceUpconvertSTLToTeletext,
    ).pipe(T.JsonName("upconvertSTLToTeletext")),
  }),
).annotations({
  identifier: "FileSourceSettings",
}) as any as S.Schema<FileSourceSettings>;
export type CaptionSourceType =
  | "ANCILLARY"
  | "DVB_SUB"
  | "EMBEDDED"
  | "SCTE20"
  | "SCC"
  | "TTML"
  | "STL"
  | "SRT"
  | "SMI"
  | "SMPTE_TT"
  | "TELETEXT"
  | "NULL_SOURCE"
  | "IMSC"
  | "WEBVTT"
  | "TT_3GPP";
export const CaptionSourceType = S.Literal(
  "ANCILLARY",
  "DVB_SUB",
  "EMBEDDED",
  "SCTE20",
  "SCC",
  "TTML",
  "STL",
  "SRT",
  "SMI",
  "SMPTE_TT",
  "TELETEXT",
  "NULL_SOURCE",
  "IMSC",
  "WEBVTT",
  "TT_3GPP",
);
export interface TeletextSourceSettings {
  PageNumber?: string;
}
export const TeletextSourceSettings = S.suspend(() =>
  S.Struct({ PageNumber: S.optional(S.String).pipe(T.JsonName("pageNumber")) }),
).annotations({
  identifier: "TeletextSourceSettings",
}) as any as S.Schema<TeletextSourceSettings>;
export interface TrackSourceSettings {
  StreamNumber?: number;
  TrackNumber?: number;
}
export const TrackSourceSettings = S.suspend(() =>
  S.Struct({
    StreamNumber: S.optional(S.Number).pipe(T.JsonName("streamNumber")),
    TrackNumber: S.optional(S.Number).pipe(T.JsonName("trackNumber")),
  }),
).annotations({
  identifier: "TrackSourceSettings",
}) as any as S.Schema<TrackSourceSettings>;
export interface WebvttHlsSourceSettings {
  RenditionGroupId?: string;
  RenditionLanguageCode?: LanguageCode;
  RenditionName?: string;
}
export const WebvttHlsSourceSettings = S.suspend(() =>
  S.Struct({
    RenditionGroupId: S.optional(S.String).pipe(T.JsonName("renditionGroupId")),
    RenditionLanguageCode: S.optional(LanguageCode).pipe(
      T.JsonName("renditionLanguageCode"),
    ),
    RenditionName: S.optional(S.String).pipe(T.JsonName("renditionName")),
  }),
).annotations({
  identifier: "WebvttHlsSourceSettings",
}) as any as S.Schema<WebvttHlsSourceSettings>;
export interface CaptionSourceSettings {
  AncillarySourceSettings?: AncillarySourceSettings;
  DvbSubSourceSettings?: DvbSubSourceSettings;
  EmbeddedSourceSettings?: EmbeddedSourceSettings;
  FileSourceSettings?: FileSourceSettings;
  SourceType?: CaptionSourceType;
  TeletextSourceSettings?: TeletextSourceSettings;
  TrackSourceSettings?: TrackSourceSettings;
  WebvttHlsSourceSettings?: WebvttHlsSourceSettings;
}
export const CaptionSourceSettings = S.suspend(() =>
  S.Struct({
    AncillarySourceSettings: S.optional(AncillarySourceSettings)
      .pipe(T.JsonName("ancillarySourceSettings"))
      .annotations({ identifier: "AncillarySourceSettings" }),
    DvbSubSourceSettings: S.optional(DvbSubSourceSettings)
      .pipe(T.JsonName("dvbSubSourceSettings"))
      .annotations({ identifier: "DvbSubSourceSettings" }),
    EmbeddedSourceSettings: S.optional(EmbeddedSourceSettings)
      .pipe(T.JsonName("embeddedSourceSettings"))
      .annotations({ identifier: "EmbeddedSourceSettings" }),
    FileSourceSettings: S.optional(FileSourceSettings)
      .pipe(T.JsonName("fileSourceSettings"))
      .annotations({ identifier: "FileSourceSettings" }),
    SourceType: S.optional(CaptionSourceType).pipe(T.JsonName("sourceType")),
    TeletextSourceSettings: S.optional(TeletextSourceSettings)
      .pipe(T.JsonName("teletextSourceSettings"))
      .annotations({ identifier: "TeletextSourceSettings" }),
    TrackSourceSettings: S.optional(TrackSourceSettings)
      .pipe(T.JsonName("trackSourceSettings"))
      .annotations({ identifier: "TrackSourceSettings" }),
    WebvttHlsSourceSettings: S.optional(WebvttHlsSourceSettings)
      .pipe(T.JsonName("webvttHlsSourceSettings"))
      .annotations({ identifier: "WebvttHlsSourceSettings" }),
  }),
).annotations({
  identifier: "CaptionSourceSettings",
}) as any as S.Schema<CaptionSourceSettings>;
export interface CaptionSelector {
  CustomLanguageCode?: string;
  LanguageCode?: LanguageCode;
  SourceSettings?: CaptionSourceSettings;
}
export const CaptionSelector = S.suspend(() =>
  S.Struct({
    CustomLanguageCode: S.optional(S.String).pipe(
      T.JsonName("customLanguageCode"),
    ),
    LanguageCode: S.optional(LanguageCode).pipe(T.JsonName("languageCode")),
    SourceSettings: S.optional(CaptionSourceSettings)
      .pipe(T.JsonName("sourceSettings"))
      .annotations({ identifier: "CaptionSourceSettings" }),
  }),
).annotations({
  identifier: "CaptionSelector",
}) as any as S.Schema<CaptionSelector>;
export type __mapOfCaptionSelector = { [key: string]: CaptionSelector };
export const __mapOfCaptionSelector = S.Record({
  key: S.String,
  value: CaptionSelector,
});
export interface Rectangle {
  Height?: number;
  Width?: number;
  X?: number;
  Y?: number;
}
export const Rectangle = S.suspend(() =>
  S.Struct({
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
    X: S.optional(S.Number).pipe(T.JsonName("x")),
    Y: S.optional(S.Number).pipe(T.JsonName("y")),
  }),
).annotations({ identifier: "Rectangle" }) as any as S.Schema<Rectangle>;
export type InputDeblockFilter = "ENABLED" | "DISABLED";
export const InputDeblockFilter = S.Literal("ENABLED", "DISABLED");
export type InputDenoiseFilter = "ENABLED" | "DISABLED";
export const InputDenoiseFilter = S.Literal("ENABLED", "DISABLED");
export type DynamicAudioSelectorType = "ALL_TRACKS" | "LANGUAGE_CODE";
export const DynamicAudioSelectorType = S.Literal(
  "ALL_TRACKS",
  "LANGUAGE_CODE",
);
export interface DynamicAudioSelector {
  AudioDurationCorrection?: AudioDurationCorrection;
  ExternalAudioFileInput?: string;
  LanguageCode?: LanguageCode;
  Offset?: number;
  SelectorType?: DynamicAudioSelectorType;
}
export const DynamicAudioSelector = S.suspend(() =>
  S.Struct({
    AudioDurationCorrection: S.optional(AudioDurationCorrection).pipe(
      T.JsonName("audioDurationCorrection"),
    ),
    ExternalAudioFileInput: S.optional(S.String).pipe(
      T.JsonName("externalAudioFileInput"),
    ),
    LanguageCode: S.optional(LanguageCode).pipe(T.JsonName("languageCode")),
    Offset: S.optional(S.Number).pipe(T.JsonName("offset")),
    SelectorType: S.optional(DynamicAudioSelectorType).pipe(
      T.JsonName("selectorType"),
    ),
  }),
).annotations({
  identifier: "DynamicAudioSelector",
}) as any as S.Schema<DynamicAudioSelector>;
export type __mapOfDynamicAudioSelector = {
  [key: string]: DynamicAudioSelector;
};
export const __mapOfDynamicAudioSelector = S.Record({
  key: S.String,
  value: DynamicAudioSelector,
});
export type InputFilterEnable = "AUTO" | "DISABLE" | "FORCE";
export const InputFilterEnable = S.Literal("AUTO", "DISABLE", "FORCE");
export interface InsertableImage {
  Duration?: number;
  FadeIn?: number;
  FadeOut?: number;
  Height?: number;
  ImageInserterInput?: string;
  ImageX?: number;
  ImageY?: number;
  Layer?: number;
  Opacity?: number;
  StartTime?: string;
  Width?: number;
}
export const InsertableImage = S.suspend(() =>
  S.Struct({
    Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
    FadeIn: S.optional(S.Number).pipe(T.JsonName("fadeIn")),
    FadeOut: S.optional(S.Number).pipe(T.JsonName("fadeOut")),
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    ImageInserterInput: S.optional(S.String).pipe(
      T.JsonName("imageInserterInput"),
    ),
    ImageX: S.optional(S.Number).pipe(T.JsonName("imageX")),
    ImageY: S.optional(S.Number).pipe(T.JsonName("imageY")),
    Layer: S.optional(S.Number).pipe(T.JsonName("layer")),
    Opacity: S.optional(S.Number).pipe(T.JsonName("opacity")),
    StartTime: S.optional(S.String).pipe(T.JsonName("startTime")),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
  }),
).annotations({
  identifier: "InsertableImage",
}) as any as S.Schema<InsertableImage>;
export type __listOfInsertableImage = InsertableImage[];
export const __listOfInsertableImage = S.Array(InsertableImage);
export interface ImageInserter {
  InsertableImages?: InsertableImage[];
  SdrReferenceWhiteLevel?: number;
}
export const ImageInserter = S.suspend(() =>
  S.Struct({
    InsertableImages: S.optional(__listOfInsertableImage).pipe(
      T.JsonName("insertableImages"),
    ),
    SdrReferenceWhiteLevel: S.optional(S.Number).pipe(
      T.JsonName("sdrReferenceWhiteLevel"),
    ),
  }),
).annotations({
  identifier: "ImageInserter",
}) as any as S.Schema<ImageInserter>;
export interface InputClipping {
  EndTimecode?: string;
  StartTimecode?: string;
}
export const InputClipping = S.suspend(() =>
  S.Struct({
    EndTimecode: S.optional(S.String).pipe(T.JsonName("endTimecode")),
    StartTimecode: S.optional(S.String).pipe(T.JsonName("startTimecode")),
  }),
).annotations({
  identifier: "InputClipping",
}) as any as S.Schema<InputClipping>;
export type __listOfInputClipping = InputClipping[];
export const __listOfInputClipping = S.Array(InputClipping);
export type InputScanType = "AUTO" | "PSF";
export const InputScanType = S.Literal("AUTO", "PSF");
export type InputPsiControl = "IGNORE_PSI" | "USE_PSI";
export const InputPsiControl = S.Literal("IGNORE_PSI", "USE_PSI");
export type InputTimecodeSource = "EMBEDDED" | "ZEROBASED" | "SPECIFIEDSTART";
export const InputTimecodeSource = S.Literal(
  "EMBEDDED",
  "ZEROBASED",
  "SPECIFIEDSTART",
);
export type VideoOverlayUnit = "PIXELS" | "PERCENTAGE";
export const VideoOverlayUnit = S.Literal("PIXELS", "PERCENTAGE");
export interface VideoOverlayCrop {
  Height?: number;
  Unit?: VideoOverlayUnit;
  Width?: number;
  X?: number;
  Y?: number;
}
export const VideoOverlayCrop = S.suspend(() =>
  S.Struct({
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    Unit: S.optional(VideoOverlayUnit).pipe(T.JsonName("unit")),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
    X: S.optional(S.Number).pipe(T.JsonName("x")),
    Y: S.optional(S.Number).pipe(T.JsonName("y")),
  }),
).annotations({
  identifier: "VideoOverlayCrop",
}) as any as S.Schema<VideoOverlayCrop>;
export interface VideoOverlayPosition {
  Height?: number;
  Opacity?: number;
  Unit?: VideoOverlayUnit;
  Width?: number;
  XPosition?: number;
  YPosition?: number;
}
export const VideoOverlayPosition = S.suspend(() =>
  S.Struct({
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    Opacity: S.optional(S.Number).pipe(T.JsonName("opacity")),
    Unit: S.optional(VideoOverlayUnit).pipe(T.JsonName("unit")),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
    XPosition: S.optional(S.Number).pipe(T.JsonName("xPosition")),
    YPosition: S.optional(S.Number).pipe(T.JsonName("yPosition")),
  }),
).annotations({
  identifier: "VideoOverlayPosition",
}) as any as S.Schema<VideoOverlayPosition>;
export interface VideoOverlayInputClipping {
  EndTimecode?: string;
  StartTimecode?: string;
}
export const VideoOverlayInputClipping = S.suspend(() =>
  S.Struct({
    EndTimecode: S.optional(S.String).pipe(T.JsonName("endTimecode")),
    StartTimecode: S.optional(S.String).pipe(T.JsonName("startTimecode")),
  }),
).annotations({
  identifier: "VideoOverlayInputClipping",
}) as any as S.Schema<VideoOverlayInputClipping>;
export type __listOfVideoOverlayInputClipping = VideoOverlayInputClipping[];
export const __listOfVideoOverlayInputClipping = S.Array(
  VideoOverlayInputClipping,
);
export interface VideoOverlayInput {
  AudioSelectors?: { [key: string]: AudioSelector };
  FileInput?: string;
  InputClippings?: VideoOverlayInputClipping[];
  TimecodeSource?: InputTimecodeSource;
  TimecodeStart?: string;
}
export const VideoOverlayInput = S.suspend(() =>
  S.Struct({
    AudioSelectors: S.optional(__mapOfAudioSelector).pipe(
      T.JsonName("audioSelectors"),
    ),
    FileInput: S.optional(S.String).pipe(T.JsonName("fileInput")),
    InputClippings: S.optional(__listOfVideoOverlayInputClipping).pipe(
      T.JsonName("inputClippings"),
    ),
    TimecodeSource: S.optional(InputTimecodeSource).pipe(
      T.JsonName("timecodeSource"),
    ),
    TimecodeStart: S.optional(S.String).pipe(T.JsonName("timecodeStart")),
  }),
).annotations({
  identifier: "VideoOverlayInput",
}) as any as S.Schema<VideoOverlayInput>;
export type VideoOverlayPlayBackMode = "ONCE" | "REPEAT";
export const VideoOverlayPlayBackMode = S.Literal("ONCE", "REPEAT");
export interface VideoOverlayTransition {
  EndPosition?: VideoOverlayPosition;
  EndTimecode?: string;
  StartTimecode?: string;
}
export const VideoOverlayTransition = S.suspend(() =>
  S.Struct({
    EndPosition: S.optional(VideoOverlayPosition)
      .pipe(T.JsonName("endPosition"))
      .annotations({ identifier: "VideoOverlayPosition" }),
    EndTimecode: S.optional(S.String).pipe(T.JsonName("endTimecode")),
    StartTimecode: S.optional(S.String).pipe(T.JsonName("startTimecode")),
  }),
).annotations({
  identifier: "VideoOverlayTransition",
}) as any as S.Schema<VideoOverlayTransition>;
export type __listOfVideoOverlayTransition = VideoOverlayTransition[];
export const __listOfVideoOverlayTransition = S.Array(VideoOverlayTransition);
export interface VideoOverlay {
  Crop?: VideoOverlayCrop;
  EndTimecode?: string;
  InitialPosition?: VideoOverlayPosition;
  Input?: VideoOverlayInput;
  Playback?: VideoOverlayPlayBackMode;
  StartTimecode?: string;
  Transitions?: VideoOverlayTransition[];
}
export const VideoOverlay = S.suspend(() =>
  S.Struct({
    Crop: S.optional(VideoOverlayCrop)
      .pipe(T.JsonName("crop"))
      .annotations({ identifier: "VideoOverlayCrop" }),
    EndTimecode: S.optional(S.String).pipe(T.JsonName("endTimecode")),
    InitialPosition: S.optional(VideoOverlayPosition)
      .pipe(T.JsonName("initialPosition"))
      .annotations({ identifier: "VideoOverlayPosition" }),
    Input: S.optional(VideoOverlayInput)
      .pipe(T.JsonName("input"))
      .annotations({ identifier: "VideoOverlayInput" }),
    Playback: S.optional(VideoOverlayPlayBackMode).pipe(T.JsonName("playback")),
    StartTimecode: S.optional(S.String).pipe(T.JsonName("startTimecode")),
    Transitions: S.optional(__listOfVideoOverlayTransition).pipe(
      T.JsonName("transitions"),
    ),
  }),
).annotations({ identifier: "VideoOverlay" }) as any as S.Schema<VideoOverlay>;
export type __listOfVideoOverlay = VideoOverlay[];
export const __listOfVideoOverlay = S.Array(VideoOverlay);
export type AlphaBehavior = "DISCARD" | "REMAP_TO_LUMA";
export const AlphaBehavior = S.Literal("DISCARD", "REMAP_TO_LUMA");
export type ColorSpaceUsage = "FORCE" | "FALLBACK";
export const ColorSpaceUsage = S.Literal("FORCE", "FALLBACK");
export type EmbeddedTimecodeOverride = "NONE" | "USE_MDPM";
export const EmbeddedTimecodeOverride = S.Literal("NONE", "USE_MDPM");
export interface Hdr10Metadata {
  BluePrimaryX?: number;
  BluePrimaryY?: number;
  GreenPrimaryX?: number;
  GreenPrimaryY?: number;
  MaxContentLightLevel?: number;
  MaxFrameAverageLightLevel?: number;
  MaxLuminance?: number;
  MinLuminance?: number;
  RedPrimaryX?: number;
  RedPrimaryY?: number;
  WhitePointX?: number;
  WhitePointY?: number;
}
export const Hdr10Metadata = S.suspend(() =>
  S.Struct({
    BluePrimaryX: S.optional(S.Number).pipe(T.JsonName("bluePrimaryX")),
    BluePrimaryY: S.optional(S.Number).pipe(T.JsonName("bluePrimaryY")),
    GreenPrimaryX: S.optional(S.Number).pipe(T.JsonName("greenPrimaryX")),
    GreenPrimaryY: S.optional(S.Number).pipe(T.JsonName("greenPrimaryY")),
    MaxContentLightLevel: S.optional(S.Number).pipe(
      T.JsonName("maxContentLightLevel"),
    ),
    MaxFrameAverageLightLevel: S.optional(S.Number).pipe(
      T.JsonName("maxFrameAverageLightLevel"),
    ),
    MaxLuminance: S.optional(S.Number).pipe(T.JsonName("maxLuminance")),
    MinLuminance: S.optional(S.Number).pipe(T.JsonName("minLuminance")),
    RedPrimaryX: S.optional(S.Number).pipe(T.JsonName("redPrimaryX")),
    RedPrimaryY: S.optional(S.Number).pipe(T.JsonName("redPrimaryY")),
    WhitePointX: S.optional(S.Number).pipe(T.JsonName("whitePointX")),
    WhitePointY: S.optional(S.Number).pipe(T.JsonName("whitePointY")),
  }),
).annotations({
  identifier: "Hdr10Metadata",
}) as any as S.Schema<Hdr10Metadata>;
export type PadVideo = "DISABLED" | "BLACK";
export const PadVideo = S.Literal("DISABLED", "BLACK");
export type InputRotate =
  | "DEGREE_0"
  | "DEGREES_90"
  | "DEGREES_180"
  | "DEGREES_270"
  | "AUTO";
export const InputRotate = S.Literal(
  "DEGREE_0",
  "DEGREES_90",
  "DEGREES_180",
  "DEGREES_270",
  "AUTO",
);
export type InputSampleRange = "FOLLOW" | "FULL_RANGE" | "LIMITED_RANGE";
export const InputSampleRange = S.Literal(
  "FOLLOW",
  "FULL_RANGE",
  "LIMITED_RANGE",
);
export type VideoSelectorType = "AUTO" | "STREAM";
export const VideoSelectorType = S.Literal("AUTO", "STREAM");
export interface VideoSelector {
  AlphaBehavior?: AlphaBehavior;
  ColorSpace?: ColorSpace;
  ColorSpaceUsage?: ColorSpaceUsage;
  EmbeddedTimecodeOverride?: EmbeddedTimecodeOverride;
  Hdr10Metadata?: Hdr10Metadata;
  MaxLuminance?: number;
  PadVideo?: PadVideo;
  Pid?: number;
  ProgramNumber?: number;
  Rotate?: InputRotate;
  SampleRange?: InputSampleRange;
  SelectorType?: VideoSelectorType;
  Streams?: number[];
}
export const VideoSelector = S.suspend(() =>
  S.Struct({
    AlphaBehavior: S.optional(AlphaBehavior).pipe(T.JsonName("alphaBehavior")),
    ColorSpace: S.optional(ColorSpace).pipe(T.JsonName("colorSpace")),
    ColorSpaceUsage: S.optional(ColorSpaceUsage).pipe(
      T.JsonName("colorSpaceUsage"),
    ),
    EmbeddedTimecodeOverride: S.optional(EmbeddedTimecodeOverride).pipe(
      T.JsonName("embeddedTimecodeOverride"),
    ),
    Hdr10Metadata: S.optional(Hdr10Metadata)
      .pipe(T.JsonName("hdr10Metadata"))
      .annotations({ identifier: "Hdr10Metadata" }),
    MaxLuminance: S.optional(S.Number).pipe(T.JsonName("maxLuminance")),
    PadVideo: S.optional(PadVideo).pipe(T.JsonName("padVideo")),
    Pid: S.optional(S.Number).pipe(T.JsonName("pid")),
    ProgramNumber: S.optional(S.Number).pipe(T.JsonName("programNumber")),
    Rotate: S.optional(InputRotate).pipe(T.JsonName("rotate")),
    SampleRange: S.optional(InputSampleRange).pipe(T.JsonName("sampleRange")),
    SelectorType: S.optional(VideoSelectorType).pipe(
      T.JsonName("selectorType"),
    ),
    Streams: S.optional(__listOf__integerMin1Max2147483647).pipe(
      T.JsonName("streams"),
    ),
  }),
).annotations({
  identifier: "VideoSelector",
}) as any as S.Schema<VideoSelector>;
export interface InputTemplate {
  AdvancedInputFilter?: AdvancedInputFilter;
  AdvancedInputFilterSettings?: AdvancedInputFilterSettings;
  AudioSelectorGroups?: { [key: string]: AudioSelectorGroup };
  AudioSelectors?: { [key: string]: AudioSelector };
  CaptionSelectors?: { [key: string]: CaptionSelector };
  Crop?: Rectangle;
  DeblockFilter?: InputDeblockFilter;
  DenoiseFilter?: InputDenoiseFilter;
  DolbyVisionMetadataXml?: string;
  DynamicAudioSelectors?: { [key: string]: DynamicAudioSelector };
  FilterEnable?: InputFilterEnable;
  FilterStrength?: number;
  ImageInserter?: ImageInserter;
  InputClippings?: InputClipping[];
  InputScanType?: InputScanType;
  Position?: Rectangle;
  ProgramNumber?: number;
  PsiControl?: InputPsiControl;
  TimecodeSource?: InputTimecodeSource;
  TimecodeStart?: string;
  VideoOverlays?: VideoOverlay[];
  VideoSelector?: VideoSelector;
}
export const InputTemplate = S.suspend(() =>
  S.Struct({
    AdvancedInputFilter: S.optional(AdvancedInputFilter).pipe(
      T.JsonName("advancedInputFilter"),
    ),
    AdvancedInputFilterSettings: S.optional(AdvancedInputFilterSettings)
      .pipe(T.JsonName("advancedInputFilterSettings"))
      .annotations({ identifier: "AdvancedInputFilterSettings" }),
    AudioSelectorGroups: S.optional(__mapOfAudioSelectorGroup).pipe(
      T.JsonName("audioSelectorGroups"),
    ),
    AudioSelectors: S.optional(__mapOfAudioSelector).pipe(
      T.JsonName("audioSelectors"),
    ),
    CaptionSelectors: S.optional(__mapOfCaptionSelector).pipe(
      T.JsonName("captionSelectors"),
    ),
    Crop: S.optional(Rectangle)
      .pipe(T.JsonName("crop"))
      .annotations({ identifier: "Rectangle" }),
    DeblockFilter: S.optional(InputDeblockFilter).pipe(
      T.JsonName("deblockFilter"),
    ),
    DenoiseFilter: S.optional(InputDenoiseFilter).pipe(
      T.JsonName("denoiseFilter"),
    ),
    DolbyVisionMetadataXml: S.optional(S.String).pipe(
      T.JsonName("dolbyVisionMetadataXml"),
    ),
    DynamicAudioSelectors: S.optional(__mapOfDynamicAudioSelector).pipe(
      T.JsonName("dynamicAudioSelectors"),
    ),
    FilterEnable: S.optional(InputFilterEnable).pipe(
      T.JsonName("filterEnable"),
    ),
    FilterStrength: S.optional(S.Number).pipe(T.JsonName("filterStrength")),
    ImageInserter: S.optional(ImageInserter)
      .pipe(T.JsonName("imageInserter"))
      .annotations({ identifier: "ImageInserter" }),
    InputClippings: S.optional(__listOfInputClipping).pipe(
      T.JsonName("inputClippings"),
    ),
    InputScanType: S.optional(InputScanType).pipe(T.JsonName("inputScanType")),
    Position: S.optional(Rectangle)
      .pipe(T.JsonName("position"))
      .annotations({ identifier: "Rectangle" }),
    ProgramNumber: S.optional(S.Number).pipe(T.JsonName("programNumber")),
    PsiControl: S.optional(InputPsiControl).pipe(T.JsonName("psiControl")),
    TimecodeSource: S.optional(InputTimecodeSource).pipe(
      T.JsonName("timecodeSource"),
    ),
    TimecodeStart: S.optional(S.String).pipe(T.JsonName("timecodeStart")),
    VideoOverlays: S.optional(__listOfVideoOverlay).pipe(
      T.JsonName("videoOverlays"),
    ),
    VideoSelector: S.optional(VideoSelector)
      .pipe(T.JsonName("videoSelector"))
      .annotations({ identifier: "VideoSelector" }),
  }),
).annotations({
  identifier: "InputTemplate",
}) as any as S.Schema<InputTemplate>;
export type __listOfInputTemplate = InputTemplate[];
export const __listOfInputTemplate = S.Array(InputTemplate);
export interface KantarWatermarkSettings {
  ChannelName?: string;
  ContentReference?: string;
  CredentialsSecretName?: string;
  FileOffset?: number;
  KantarLicenseId?: number;
  KantarServerUrl?: string;
  LogDestination?: string;
  Metadata3?: string;
  Metadata4?: string;
  Metadata5?: string;
  Metadata6?: string;
  Metadata7?: string;
  Metadata8?: string;
}
export const KantarWatermarkSettings = S.suspend(() =>
  S.Struct({
    ChannelName: S.optional(S.String).pipe(T.JsonName("channelName")),
    ContentReference: S.optional(S.String).pipe(T.JsonName("contentReference")),
    CredentialsSecretName: S.optional(S.String).pipe(
      T.JsonName("credentialsSecretName"),
    ),
    FileOffset: S.optional(S.Number).pipe(T.JsonName("fileOffset")),
    KantarLicenseId: S.optional(S.Number).pipe(T.JsonName("kantarLicenseId")),
    KantarServerUrl: S.optional(S.String).pipe(T.JsonName("kantarServerUrl")),
    LogDestination: S.optional(S.String).pipe(T.JsonName("logDestination")),
    Metadata3: S.optional(S.String).pipe(T.JsonName("metadata3")),
    Metadata4: S.optional(S.String).pipe(T.JsonName("metadata4")),
    Metadata5: S.optional(S.String).pipe(T.JsonName("metadata5")),
    Metadata6: S.optional(S.String).pipe(T.JsonName("metadata6")),
    Metadata7: S.optional(S.String).pipe(T.JsonName("metadata7")),
    Metadata8: S.optional(S.String).pipe(T.JsonName("metadata8")),
  }),
).annotations({
  identifier: "KantarWatermarkSettings",
}) as any as S.Schema<KantarWatermarkSettings>;
export interface MotionImageInsertionFramerate {
  FramerateDenominator?: number;
  FramerateNumerator?: number;
}
export const MotionImageInsertionFramerate = S.suspend(() =>
  S.Struct({
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
  }),
).annotations({
  identifier: "MotionImageInsertionFramerate",
}) as any as S.Schema<MotionImageInsertionFramerate>;
export type MotionImageInsertionMode = "MOV" | "PNG";
export const MotionImageInsertionMode = S.Literal("MOV", "PNG");
export interface MotionImageInsertionOffset {
  ImageX?: number;
  ImageY?: number;
}
export const MotionImageInsertionOffset = S.suspend(() =>
  S.Struct({
    ImageX: S.optional(S.Number).pipe(T.JsonName("imageX")),
    ImageY: S.optional(S.Number).pipe(T.JsonName("imageY")),
  }),
).annotations({
  identifier: "MotionImageInsertionOffset",
}) as any as S.Schema<MotionImageInsertionOffset>;
export type MotionImagePlayback = "ONCE" | "REPEAT";
export const MotionImagePlayback = S.Literal("ONCE", "REPEAT");
export interface MotionImageInserter {
  Framerate?: MotionImageInsertionFramerate;
  Input?: string;
  InsertionMode?: MotionImageInsertionMode;
  Offset?: MotionImageInsertionOffset;
  Playback?: MotionImagePlayback;
  StartTime?: string;
}
export const MotionImageInserter = S.suspend(() =>
  S.Struct({
    Framerate: S.optional(MotionImageInsertionFramerate)
      .pipe(T.JsonName("framerate"))
      .annotations({ identifier: "MotionImageInsertionFramerate" }),
    Input: S.optional(S.String).pipe(T.JsonName("input")),
    InsertionMode: S.optional(MotionImageInsertionMode).pipe(
      T.JsonName("insertionMode"),
    ),
    Offset: S.optional(MotionImageInsertionOffset)
      .pipe(T.JsonName("offset"))
      .annotations({ identifier: "MotionImageInsertionOffset" }),
    Playback: S.optional(MotionImagePlayback).pipe(T.JsonName("playback")),
    StartTime: S.optional(S.String).pipe(T.JsonName("startTime")),
  }),
).annotations({
  identifier: "MotionImageInserter",
}) as any as S.Schema<MotionImageInserter>;
export interface NielsenConfiguration {
  BreakoutCode?: number;
  DistributorId?: string;
}
export const NielsenConfiguration = S.suspend(() =>
  S.Struct({
    BreakoutCode: S.optional(S.Number).pipe(T.JsonName("breakoutCode")),
    DistributorId: S.optional(S.String).pipe(T.JsonName("distributorId")),
  }),
).annotations({
  identifier: "NielsenConfiguration",
}) as any as S.Schema<NielsenConfiguration>;
export type NielsenActiveWatermarkProcessType =
  | "NAES2_AND_NW"
  | "CBET"
  | "NAES2_AND_NW_AND_CBET";
export const NielsenActiveWatermarkProcessType = S.Literal(
  "NAES2_AND_NW",
  "CBET",
  "NAES2_AND_NW_AND_CBET",
);
export type NielsenSourceWatermarkStatusType = "CLEAN" | "WATERMARKED";
export const NielsenSourceWatermarkStatusType = S.Literal(
  "CLEAN",
  "WATERMARKED",
);
export type NielsenUniqueTicPerAudioTrackType =
  | "RESERVE_UNIQUE_TICS_PER_TRACK"
  | "SAME_TICS_PER_TRACK";
export const NielsenUniqueTicPerAudioTrackType = S.Literal(
  "RESERVE_UNIQUE_TICS_PER_TRACK",
  "SAME_TICS_PER_TRACK",
);
export interface NielsenNonLinearWatermarkSettings {
  ActiveWatermarkProcess?: NielsenActiveWatermarkProcessType;
  AdiFilename?: string;
  AssetId?: string;
  AssetName?: string;
  CbetSourceId?: string;
  EpisodeId?: string;
  MetadataDestination?: string;
  SourceId?: number;
  SourceWatermarkStatus?: NielsenSourceWatermarkStatusType;
  TicServerUrl?: string;
  UniqueTicPerAudioTrack?: NielsenUniqueTicPerAudioTrackType;
}
export const NielsenNonLinearWatermarkSettings = S.suspend(() =>
  S.Struct({
    ActiveWatermarkProcess: S.optional(NielsenActiveWatermarkProcessType).pipe(
      T.JsonName("activeWatermarkProcess"),
    ),
    AdiFilename: S.optional(S.String).pipe(T.JsonName("adiFilename")),
    AssetId: S.optional(S.String).pipe(T.JsonName("assetId")),
    AssetName: S.optional(S.String).pipe(T.JsonName("assetName")),
    CbetSourceId: S.optional(S.String).pipe(T.JsonName("cbetSourceId")),
    EpisodeId: S.optional(S.String).pipe(T.JsonName("episodeId")),
    MetadataDestination: S.optional(S.String).pipe(
      T.JsonName("metadataDestination"),
    ),
    SourceId: S.optional(S.Number).pipe(T.JsonName("sourceId")),
    SourceWatermarkStatus: S.optional(NielsenSourceWatermarkStatusType).pipe(
      T.JsonName("sourceWatermarkStatus"),
    ),
    TicServerUrl: S.optional(S.String).pipe(T.JsonName("ticServerUrl")),
    UniqueTicPerAudioTrack: S.optional(NielsenUniqueTicPerAudioTrackType).pipe(
      T.JsonName("uniqueTicPerAudioTrack"),
    ),
  }),
).annotations({
  identifier: "NielsenNonLinearWatermarkSettings",
}) as any as S.Schema<NielsenNonLinearWatermarkSettings>;
export type RequiredFlag = "ENABLED" | "DISABLED";
export const RequiredFlag = S.Literal("ENABLED", "DISABLED");
export interface AllowedRenditionSize {
  Height?: number;
  Required?: RequiredFlag;
  Width?: number;
}
export const AllowedRenditionSize = S.suspend(() =>
  S.Struct({
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    Required: S.optional(RequiredFlag).pipe(T.JsonName("required")),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
  }),
).annotations({
  identifier: "AllowedRenditionSize",
}) as any as S.Schema<AllowedRenditionSize>;
export type __listOfAllowedRenditionSize = AllowedRenditionSize[];
export const __listOfAllowedRenditionSize = S.Array(AllowedRenditionSize);
export interface ForceIncludeRenditionSize {
  Height?: number;
  Width?: number;
}
export const ForceIncludeRenditionSize = S.suspend(() =>
  S.Struct({
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
  }),
).annotations({
  identifier: "ForceIncludeRenditionSize",
}) as any as S.Schema<ForceIncludeRenditionSize>;
export type __listOfForceIncludeRenditionSize = ForceIncludeRenditionSize[];
export const __listOfForceIncludeRenditionSize = S.Array(
  ForceIncludeRenditionSize,
);
export interface MinBottomRenditionSize {
  Height?: number;
  Width?: number;
}
export const MinBottomRenditionSize = S.suspend(() =>
  S.Struct({
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
  }),
).annotations({
  identifier: "MinBottomRenditionSize",
}) as any as S.Schema<MinBottomRenditionSize>;
export interface MinTopRenditionSize {
  Height?: number;
  Width?: number;
}
export const MinTopRenditionSize = S.suspend(() =>
  S.Struct({
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
  }),
).annotations({
  identifier: "MinTopRenditionSize",
}) as any as S.Schema<MinTopRenditionSize>;
export type RuleType =
  | "MIN_TOP_RENDITION_SIZE"
  | "MIN_BOTTOM_RENDITION_SIZE"
  | "FORCE_INCLUDE_RENDITIONS"
  | "ALLOWED_RENDITIONS";
export const RuleType = S.Literal(
  "MIN_TOP_RENDITION_SIZE",
  "MIN_BOTTOM_RENDITION_SIZE",
  "FORCE_INCLUDE_RENDITIONS",
  "ALLOWED_RENDITIONS",
);
export interface AutomatedAbrRule {
  AllowedRenditions?: AllowedRenditionSize[];
  ForceIncludeRenditions?: ForceIncludeRenditionSize[];
  MinBottomRenditionSize?: MinBottomRenditionSize;
  MinTopRenditionSize?: MinTopRenditionSize;
  Type?: RuleType;
}
export const AutomatedAbrRule = S.suspend(() =>
  S.Struct({
    AllowedRenditions: S.optional(__listOfAllowedRenditionSize).pipe(
      T.JsonName("allowedRenditions"),
    ),
    ForceIncludeRenditions: S.optional(__listOfForceIncludeRenditionSize).pipe(
      T.JsonName("forceIncludeRenditions"),
    ),
    MinBottomRenditionSize: S.optional(MinBottomRenditionSize)
      .pipe(T.JsonName("minBottomRenditionSize"))
      .annotations({ identifier: "MinBottomRenditionSize" }),
    MinTopRenditionSize: S.optional(MinTopRenditionSize)
      .pipe(T.JsonName("minTopRenditionSize"))
      .annotations({ identifier: "MinTopRenditionSize" }),
    Type: S.optional(RuleType).pipe(T.JsonName("type")),
  }),
).annotations({
  identifier: "AutomatedAbrRule",
}) as any as S.Schema<AutomatedAbrRule>;
export type __listOfAutomatedAbrRule = AutomatedAbrRule[];
export const __listOfAutomatedAbrRule = S.Array(AutomatedAbrRule);
export interface AutomatedAbrSettings {
  MaxAbrBitrate?: number;
  MaxQualityLevel?: number;
  MaxRenditions?: number;
  MinAbrBitrate?: number;
  Rules?: AutomatedAbrRule[];
}
export const AutomatedAbrSettings = S.suspend(() =>
  S.Struct({
    MaxAbrBitrate: S.optional(S.Number).pipe(T.JsonName("maxAbrBitrate")),
    MaxQualityLevel: S.optional(S.Number).pipe(T.JsonName("maxQualityLevel")),
    MaxRenditions: S.optional(S.Number).pipe(T.JsonName("maxRenditions")),
    MinAbrBitrate: S.optional(S.Number).pipe(T.JsonName("minAbrBitrate")),
    Rules: S.optional(__listOfAutomatedAbrRule).pipe(T.JsonName("rules")),
  }),
).annotations({
  identifier: "AutomatedAbrSettings",
}) as any as S.Schema<AutomatedAbrSettings>;
export interface AutomatedEncodingSettings {
  AbrSettings?: AutomatedAbrSettings;
}
export const AutomatedEncodingSettings = S.suspend(() =>
  S.Struct({
    AbrSettings: S.optional(AutomatedAbrSettings)
      .pipe(T.JsonName("abrSettings"))
      .annotations({ identifier: "AutomatedAbrSettings" }),
  }),
).annotations({
  identifier: "AutomatedEncodingSettings",
}) as any as S.Schema<AutomatedEncodingSettings>;
export interface CmafAdditionalManifest {
  ManifestNameModifier?: string;
  SelectedOutputs?: string[];
}
export const CmafAdditionalManifest = S.suspend(() =>
  S.Struct({
    ManifestNameModifier: S.optional(S.String).pipe(
      T.JsonName("manifestNameModifier"),
    ),
    SelectedOutputs: S.optional(__listOf__stringMin1).pipe(
      T.JsonName("selectedOutputs"),
    ),
  }),
).annotations({
  identifier: "CmafAdditionalManifest",
}) as any as S.Schema<CmafAdditionalManifest>;
export type __listOfCmafAdditionalManifest = CmafAdditionalManifest[];
export const __listOfCmafAdditionalManifest = S.Array(CmafAdditionalManifest);
export type CmafClientCache = "DISABLED" | "ENABLED";
export const CmafClientCache = S.Literal("DISABLED", "ENABLED");
export type CmafCodecSpecification = "RFC_6381" | "RFC_4281";
export const CmafCodecSpecification = S.Literal("RFC_6381", "RFC_4281");
export type DashManifestStyle = "BASIC" | "COMPACT" | "DISTINCT" | "FULL";
export const DashManifestStyle = S.Literal(
  "BASIC",
  "COMPACT",
  "DISTINCT",
  "FULL",
);
export type S3ObjectCannedAcl =
  | "PUBLIC_READ"
  | "AUTHENTICATED_READ"
  | "BUCKET_OWNER_READ"
  | "BUCKET_OWNER_FULL_CONTROL";
export const S3ObjectCannedAcl = S.Literal(
  "PUBLIC_READ",
  "AUTHENTICATED_READ",
  "BUCKET_OWNER_READ",
  "BUCKET_OWNER_FULL_CONTROL",
);
export interface S3DestinationAccessControl {
  CannedAcl?: S3ObjectCannedAcl;
}
export const S3DestinationAccessControl = S.suspend(() =>
  S.Struct({
    CannedAcl: S.optional(S3ObjectCannedAcl).pipe(T.JsonName("cannedAcl")),
  }),
).annotations({
  identifier: "S3DestinationAccessControl",
}) as any as S.Schema<S3DestinationAccessControl>;
export type S3ServerSideEncryptionType =
  | "SERVER_SIDE_ENCRYPTION_S3"
  | "SERVER_SIDE_ENCRYPTION_KMS";
export const S3ServerSideEncryptionType = S.Literal(
  "SERVER_SIDE_ENCRYPTION_S3",
  "SERVER_SIDE_ENCRYPTION_KMS",
);
export interface S3EncryptionSettings {
  EncryptionType?: S3ServerSideEncryptionType;
  KmsEncryptionContext?: string;
  KmsKeyArn?: string;
}
export const S3EncryptionSettings = S.suspend(() =>
  S.Struct({
    EncryptionType: S.optional(S3ServerSideEncryptionType).pipe(
      T.JsonName("encryptionType"),
    ),
    KmsEncryptionContext: S.optional(S.String).pipe(
      T.JsonName("kmsEncryptionContext"),
    ),
    KmsKeyArn: S.optional(S.String).pipe(T.JsonName("kmsKeyArn")),
  }),
).annotations({
  identifier: "S3EncryptionSettings",
}) as any as S.Schema<S3EncryptionSettings>;
export type S3StorageClass =
  | "STANDARD"
  | "REDUCED_REDUNDANCY"
  | "STANDARD_IA"
  | "ONEZONE_IA"
  | "INTELLIGENT_TIERING"
  | "GLACIER"
  | "DEEP_ARCHIVE";
export const S3StorageClass = S.Literal(
  "STANDARD",
  "REDUCED_REDUNDANCY",
  "STANDARD_IA",
  "ONEZONE_IA",
  "INTELLIGENT_TIERING",
  "GLACIER",
  "DEEP_ARCHIVE",
);
export interface S3DestinationSettings {
  AccessControl?: S3DestinationAccessControl;
  Encryption?: S3EncryptionSettings;
  StorageClass?: S3StorageClass;
}
export const S3DestinationSettings = S.suspend(() =>
  S.Struct({
    AccessControl: S.optional(S3DestinationAccessControl)
      .pipe(T.JsonName("accessControl"))
      .annotations({ identifier: "S3DestinationAccessControl" }),
    Encryption: S.optional(S3EncryptionSettings)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "S3EncryptionSettings" }),
    StorageClass: S.optional(S3StorageClass).pipe(T.JsonName("storageClass")),
  }),
).annotations({
  identifier: "S3DestinationSettings",
}) as any as S.Schema<S3DestinationSettings>;
export interface DestinationSettings {
  S3Settings?: S3DestinationSettings;
}
export const DestinationSettings = S.suspend(() =>
  S.Struct({
    S3Settings: S.optional(S3DestinationSettings)
      .pipe(T.JsonName("s3Settings"))
      .annotations({ identifier: "S3DestinationSettings" }),
  }),
).annotations({
  identifier: "DestinationSettings",
}) as any as S.Schema<DestinationSettings>;
export type CmafEncryptionType = "SAMPLE_AES" | "AES_CTR";
export const CmafEncryptionType = S.Literal("SAMPLE_AES", "AES_CTR");
export type CmafInitializationVectorInManifest = "INCLUDE" | "EXCLUDE";
export const CmafInitializationVectorInManifest = S.Literal(
  "INCLUDE",
  "EXCLUDE",
);
export type __listOf__stringMin36Max36Pattern09aFAF809aFAF409aFAF409aFAF409aFAF12 =
  string[];
export const __listOf__stringMin36Max36Pattern09aFAF809aFAF409aFAF409aFAF409aFAF12 =
  S.Array(S.String);
export type PresetSpeke20Audio =
  | "PRESET_AUDIO_1"
  | "PRESET_AUDIO_2"
  | "PRESET_AUDIO_3"
  | "SHARED"
  | "UNENCRYPTED";
export const PresetSpeke20Audio = S.Literal(
  "PRESET_AUDIO_1",
  "PRESET_AUDIO_2",
  "PRESET_AUDIO_3",
  "SHARED",
  "UNENCRYPTED",
);
export type PresetSpeke20Video =
  | "PRESET_VIDEO_1"
  | "PRESET_VIDEO_2"
  | "PRESET_VIDEO_3"
  | "PRESET_VIDEO_4"
  | "PRESET_VIDEO_5"
  | "PRESET_VIDEO_6"
  | "PRESET_VIDEO_7"
  | "PRESET_VIDEO_8"
  | "SHARED"
  | "UNENCRYPTED";
export const PresetSpeke20Video = S.Literal(
  "PRESET_VIDEO_1",
  "PRESET_VIDEO_2",
  "PRESET_VIDEO_3",
  "PRESET_VIDEO_4",
  "PRESET_VIDEO_5",
  "PRESET_VIDEO_6",
  "PRESET_VIDEO_7",
  "PRESET_VIDEO_8",
  "SHARED",
  "UNENCRYPTED",
);
export interface EncryptionContractConfiguration {
  SpekeAudioPreset?: PresetSpeke20Audio;
  SpekeVideoPreset?: PresetSpeke20Video;
}
export const EncryptionContractConfiguration = S.suspend(() =>
  S.Struct({
    SpekeAudioPreset: S.optional(PresetSpeke20Audio).pipe(
      T.JsonName("spekeAudioPreset"),
    ),
    SpekeVideoPreset: S.optional(PresetSpeke20Video).pipe(
      T.JsonName("spekeVideoPreset"),
    ),
  }),
).annotations({
  identifier: "EncryptionContractConfiguration",
}) as any as S.Schema<EncryptionContractConfiguration>;
export interface SpekeKeyProviderCmaf {
  CertificateArn?: string;
  DashSignaledSystemIds?: string[];
  EncryptionContractConfiguration?: EncryptionContractConfiguration;
  HlsSignaledSystemIds?: string[];
  ResourceId?: string;
  Url?: string;
}
export const SpekeKeyProviderCmaf = S.suspend(() =>
  S.Struct({
    CertificateArn: S.optional(S.String).pipe(T.JsonName("certificateArn")),
    DashSignaledSystemIds: S.optional(
      __listOf__stringMin36Max36Pattern09aFAF809aFAF409aFAF409aFAF409aFAF12,
    ).pipe(T.JsonName("dashSignaledSystemIds")),
    EncryptionContractConfiguration: S.optional(EncryptionContractConfiguration)
      .pipe(T.JsonName("encryptionContractConfiguration"))
      .annotations({ identifier: "EncryptionContractConfiguration" }),
    HlsSignaledSystemIds: S.optional(
      __listOf__stringMin36Max36Pattern09aFAF809aFAF409aFAF409aFAF409aFAF12,
    ).pipe(T.JsonName("hlsSignaledSystemIds")),
    ResourceId: S.optional(S.String).pipe(T.JsonName("resourceId")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
  }),
).annotations({
  identifier: "SpekeKeyProviderCmaf",
}) as any as S.Schema<SpekeKeyProviderCmaf>;
export interface StaticKeyProvider {
  KeyFormat?: string;
  KeyFormatVersions?: string;
  StaticKeyValue?: string;
  Url?: string;
}
export const StaticKeyProvider = S.suspend(() =>
  S.Struct({
    KeyFormat: S.optional(S.String).pipe(T.JsonName("keyFormat")),
    KeyFormatVersions: S.optional(S.String).pipe(
      T.JsonName("keyFormatVersions"),
    ),
    StaticKeyValue: S.optional(S.String).pipe(T.JsonName("staticKeyValue")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
  }),
).annotations({
  identifier: "StaticKeyProvider",
}) as any as S.Schema<StaticKeyProvider>;
export type CmafKeyProviderType = "SPEKE" | "STATIC_KEY";
export const CmafKeyProviderType = S.Literal("SPEKE", "STATIC_KEY");
export interface CmafEncryptionSettings {
  ConstantInitializationVector?: string;
  EncryptionMethod?: CmafEncryptionType;
  InitializationVectorInManifest?: CmafInitializationVectorInManifest;
  SpekeKeyProvider?: SpekeKeyProviderCmaf;
  StaticKeyProvider?: StaticKeyProvider;
  Type?: CmafKeyProviderType;
}
export const CmafEncryptionSettings = S.suspend(() =>
  S.Struct({
    ConstantInitializationVector: S.optional(S.String).pipe(
      T.JsonName("constantInitializationVector"),
    ),
    EncryptionMethod: S.optional(CmafEncryptionType).pipe(
      T.JsonName("encryptionMethod"),
    ),
    InitializationVectorInManifest: S.optional(
      CmafInitializationVectorInManifest,
    ).pipe(T.JsonName("initializationVectorInManifest")),
    SpekeKeyProvider: S.optional(SpekeKeyProviderCmaf)
      .pipe(T.JsonName("spekeKeyProvider"))
      .annotations({ identifier: "SpekeKeyProviderCmaf" }),
    StaticKeyProvider: S.optional(StaticKeyProvider)
      .pipe(T.JsonName("staticKeyProvider"))
      .annotations({ identifier: "StaticKeyProvider" }),
    Type: S.optional(CmafKeyProviderType).pipe(T.JsonName("type")),
  }),
).annotations({
  identifier: "CmafEncryptionSettings",
}) as any as S.Schema<CmafEncryptionSettings>;
export type CmafImageBasedTrickPlay =
  | "NONE"
  | "THUMBNAIL"
  | "THUMBNAIL_AND_FULLFRAME"
  | "ADVANCED";
export const CmafImageBasedTrickPlay = S.Literal(
  "NONE",
  "THUMBNAIL",
  "THUMBNAIL_AND_FULLFRAME",
  "ADVANCED",
);
export type CmafIntervalCadence = "FOLLOW_IFRAME" | "FOLLOW_CUSTOM";
export const CmafIntervalCadence = S.Literal("FOLLOW_IFRAME", "FOLLOW_CUSTOM");
export interface CmafImageBasedTrickPlaySettings {
  IntervalCadence?: CmafIntervalCadence;
  ThumbnailHeight?: number;
  ThumbnailInterval?: number;
  ThumbnailWidth?: number;
  TileHeight?: number;
  TileWidth?: number;
}
export const CmafImageBasedTrickPlaySettings = S.suspend(() =>
  S.Struct({
    IntervalCadence: S.optional(CmafIntervalCadence).pipe(
      T.JsonName("intervalCadence"),
    ),
    ThumbnailHeight: S.optional(S.Number).pipe(T.JsonName("thumbnailHeight")),
    ThumbnailInterval: S.optional(S.Number).pipe(
      T.JsonName("thumbnailInterval"),
    ),
    ThumbnailWidth: S.optional(S.Number).pipe(T.JsonName("thumbnailWidth")),
    TileHeight: S.optional(S.Number).pipe(T.JsonName("tileHeight")),
    TileWidth: S.optional(S.Number).pipe(T.JsonName("tileWidth")),
  }),
).annotations({
  identifier: "CmafImageBasedTrickPlaySettings",
}) as any as S.Schema<CmafImageBasedTrickPlaySettings>;
export type CmafManifestCompression = "GZIP" | "NONE";
export const CmafManifestCompression = S.Literal("GZIP", "NONE");
export type CmafManifestDurationFormat = "FLOATING_POINT" | "INTEGER";
export const CmafManifestDurationFormat = S.Literal(
  "FLOATING_POINT",
  "INTEGER",
);
export type CmafMpdManifestBandwidthType = "AVERAGE" | "MAX";
export const CmafMpdManifestBandwidthType = S.Literal("AVERAGE", "MAX");
export type CmafMpdProfile = "MAIN_PROFILE" | "ON_DEMAND_PROFILE";
export const CmafMpdProfile = S.Literal("MAIN_PROFILE", "ON_DEMAND_PROFILE");
export type CmafPtsOffsetHandlingForBFrames =
  | "ZERO_BASED"
  | "MATCH_INITIAL_PTS";
export const CmafPtsOffsetHandlingForBFrames = S.Literal(
  "ZERO_BASED",
  "MATCH_INITIAL_PTS",
);
export type CmafSegmentControl = "SINGLE_FILE" | "SEGMENTED_FILES";
export const CmafSegmentControl = S.Literal("SINGLE_FILE", "SEGMENTED_FILES");
export type CmafSegmentLengthControl = "EXACT" | "GOP_MULTIPLE" | "MATCH";
export const CmafSegmentLengthControl = S.Literal(
  "EXACT",
  "GOP_MULTIPLE",
  "MATCH",
);
export type CmafStreamInfResolution = "INCLUDE" | "EXCLUDE";
export const CmafStreamInfResolution = S.Literal("INCLUDE", "EXCLUDE");
export type CmafTargetDurationCompatibilityMode = "LEGACY" | "SPEC_COMPLIANT";
export const CmafTargetDurationCompatibilityMode = S.Literal(
  "LEGACY",
  "SPEC_COMPLIANT",
);
export type CmafVideoCompositionOffsets = "SIGNED" | "UNSIGNED";
export const CmafVideoCompositionOffsets = S.Literal("SIGNED", "UNSIGNED");
export type CmafWriteDASHManifest = "DISABLED" | "ENABLED";
export const CmafWriteDASHManifest = S.Literal("DISABLED", "ENABLED");
export type CmafWriteHLSManifest = "DISABLED" | "ENABLED";
export const CmafWriteHLSManifest = S.Literal("DISABLED", "ENABLED");
export type CmafWriteSegmentTimelineInRepresentation = "ENABLED" | "DISABLED";
export const CmafWriteSegmentTimelineInRepresentation = S.Literal(
  "ENABLED",
  "DISABLED",
);
export interface CmafGroupSettings {
  AdditionalManifests?: CmafAdditionalManifest[];
  BaseUrl?: string;
  ClientCache?: CmafClientCache;
  CodecSpecification?: CmafCodecSpecification;
  DashIFrameTrickPlayNameModifier?: string;
  DashManifestStyle?: DashManifestStyle;
  Destination?: string;
  DestinationSettings?: DestinationSettings;
  Encryption?: CmafEncryptionSettings;
  FragmentLength?: number;
  ImageBasedTrickPlay?: CmafImageBasedTrickPlay;
  ImageBasedTrickPlaySettings?: CmafImageBasedTrickPlaySettings;
  ManifestCompression?: CmafManifestCompression;
  ManifestDurationFormat?: CmafManifestDurationFormat;
  MinBufferTime?: number;
  MinFinalSegmentLength?: number;
  MpdManifestBandwidthType?: CmafMpdManifestBandwidthType;
  MpdProfile?: CmafMpdProfile;
  PtsOffsetHandlingForBFrames?: CmafPtsOffsetHandlingForBFrames;
  SegmentControl?: CmafSegmentControl;
  SegmentLength?: number;
  SegmentLengthControl?: CmafSegmentLengthControl;
  StreamInfResolution?: CmafStreamInfResolution;
  TargetDurationCompatibilityMode?: CmafTargetDurationCompatibilityMode;
  VideoCompositionOffsets?: CmafVideoCompositionOffsets;
  WriteDashManifest?: CmafWriteDASHManifest;
  WriteHlsManifest?: CmafWriteHLSManifest;
  WriteSegmentTimelineInRepresentation?: CmafWriteSegmentTimelineInRepresentation;
}
export const CmafGroupSettings = S.suspend(() =>
  S.Struct({
    AdditionalManifests: S.optional(__listOfCmafAdditionalManifest).pipe(
      T.JsonName("additionalManifests"),
    ),
    BaseUrl: S.optional(S.String).pipe(T.JsonName("baseUrl")),
    ClientCache: S.optional(CmafClientCache).pipe(T.JsonName("clientCache")),
    CodecSpecification: S.optional(CmafCodecSpecification).pipe(
      T.JsonName("codecSpecification"),
    ),
    DashIFrameTrickPlayNameModifier: S.optional(S.String).pipe(
      T.JsonName("dashIFrameTrickPlayNameModifier"),
    ),
    DashManifestStyle: S.optional(DashManifestStyle).pipe(
      T.JsonName("dashManifestStyle"),
    ),
    Destination: S.optional(S.String).pipe(T.JsonName("destination")),
    DestinationSettings: S.optional(DestinationSettings)
      .pipe(T.JsonName("destinationSettings"))
      .annotations({ identifier: "DestinationSettings" }),
    Encryption: S.optional(CmafEncryptionSettings)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "CmafEncryptionSettings" }),
    FragmentLength: S.optional(S.Number).pipe(T.JsonName("fragmentLength")),
    ImageBasedTrickPlay: S.optional(CmafImageBasedTrickPlay).pipe(
      T.JsonName("imageBasedTrickPlay"),
    ),
    ImageBasedTrickPlaySettings: S.optional(CmafImageBasedTrickPlaySettings)
      .pipe(T.JsonName("imageBasedTrickPlaySettings"))
      .annotations({ identifier: "CmafImageBasedTrickPlaySettings" }),
    ManifestCompression: S.optional(CmafManifestCompression).pipe(
      T.JsonName("manifestCompression"),
    ),
    ManifestDurationFormat: S.optional(CmafManifestDurationFormat).pipe(
      T.JsonName("manifestDurationFormat"),
    ),
    MinBufferTime: S.optional(S.Number).pipe(T.JsonName("minBufferTime")),
    MinFinalSegmentLength: S.optional(S.Number).pipe(
      T.JsonName("minFinalSegmentLength"),
    ),
    MpdManifestBandwidthType: S.optional(CmafMpdManifestBandwidthType).pipe(
      T.JsonName("mpdManifestBandwidthType"),
    ),
    MpdProfile: S.optional(CmafMpdProfile).pipe(T.JsonName("mpdProfile")),
    PtsOffsetHandlingForBFrames: S.optional(
      CmafPtsOffsetHandlingForBFrames,
    ).pipe(T.JsonName("ptsOffsetHandlingForBFrames")),
    SegmentControl: S.optional(CmafSegmentControl).pipe(
      T.JsonName("segmentControl"),
    ),
    SegmentLength: S.optional(S.Number).pipe(T.JsonName("segmentLength")),
    SegmentLengthControl: S.optional(CmafSegmentLengthControl).pipe(
      T.JsonName("segmentLengthControl"),
    ),
    StreamInfResolution: S.optional(CmafStreamInfResolution).pipe(
      T.JsonName("streamInfResolution"),
    ),
    TargetDurationCompatibilityMode: S.optional(
      CmafTargetDurationCompatibilityMode,
    ).pipe(T.JsonName("targetDurationCompatibilityMode")),
    VideoCompositionOffsets: S.optional(CmafVideoCompositionOffsets).pipe(
      T.JsonName("videoCompositionOffsets"),
    ),
    WriteDashManifest: S.optional(CmafWriteDASHManifest).pipe(
      T.JsonName("writeDashManifest"),
    ),
    WriteHlsManifest: S.optional(CmafWriteHLSManifest).pipe(
      T.JsonName("writeHlsManifest"),
    ),
    WriteSegmentTimelineInRepresentation: S.optional(
      CmafWriteSegmentTimelineInRepresentation,
    ).pipe(T.JsonName("writeSegmentTimelineInRepresentation")),
  }),
).annotations({
  identifier: "CmafGroupSettings",
}) as any as S.Schema<CmafGroupSettings>;
export interface DashAdditionalManifest {
  ManifestNameModifier?: string;
  SelectedOutputs?: string[];
}
export const DashAdditionalManifest = S.suspend(() =>
  S.Struct({
    ManifestNameModifier: S.optional(S.String).pipe(
      T.JsonName("manifestNameModifier"),
    ),
    SelectedOutputs: S.optional(__listOf__stringMin1).pipe(
      T.JsonName("selectedOutputs"),
    ),
  }),
).annotations({
  identifier: "DashAdditionalManifest",
}) as any as S.Schema<DashAdditionalManifest>;
export type __listOfDashAdditionalManifest = DashAdditionalManifest[];
export const __listOfDashAdditionalManifest = S.Array(DashAdditionalManifest);
export type DashIsoGroupAudioChannelConfigSchemeIdUri =
  | "MPEG_CHANNEL_CONFIGURATION"
  | "DOLBY_CHANNEL_CONFIGURATION";
export const DashIsoGroupAudioChannelConfigSchemeIdUri = S.Literal(
  "MPEG_CHANNEL_CONFIGURATION",
  "DOLBY_CHANNEL_CONFIGURATION",
);
export type DashIsoPlaybackDeviceCompatibility = "CENC_V1" | "UNENCRYPTED_SEI";
export const DashIsoPlaybackDeviceCompatibility = S.Literal(
  "CENC_V1",
  "UNENCRYPTED_SEI",
);
export type __listOf__stringPattern09aFAF809aFAF409aFAF409aFAF409aFAF12 =
  string[];
export const __listOf__stringPattern09aFAF809aFAF409aFAF409aFAF409aFAF12 =
  S.Array(S.String);
export interface SpekeKeyProvider {
  CertificateArn?: string;
  EncryptionContractConfiguration?: EncryptionContractConfiguration;
  ResourceId?: string;
  SystemIds?: string[];
  Url?: string;
}
export const SpekeKeyProvider = S.suspend(() =>
  S.Struct({
    CertificateArn: S.optional(S.String).pipe(T.JsonName("certificateArn")),
    EncryptionContractConfiguration: S.optional(EncryptionContractConfiguration)
      .pipe(T.JsonName("encryptionContractConfiguration"))
      .annotations({ identifier: "EncryptionContractConfiguration" }),
    ResourceId: S.optional(S.String).pipe(T.JsonName("resourceId")),
    SystemIds: S.optional(
      __listOf__stringPattern09aFAF809aFAF409aFAF409aFAF409aFAF12,
    ).pipe(T.JsonName("systemIds")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
  }),
).annotations({
  identifier: "SpekeKeyProvider",
}) as any as S.Schema<SpekeKeyProvider>;
export interface DashIsoEncryptionSettings {
  PlaybackDeviceCompatibility?: DashIsoPlaybackDeviceCompatibility;
  SpekeKeyProvider?: SpekeKeyProvider;
}
export const DashIsoEncryptionSettings = S.suspend(() =>
  S.Struct({
    PlaybackDeviceCompatibility: S.optional(
      DashIsoPlaybackDeviceCompatibility,
    ).pipe(T.JsonName("playbackDeviceCompatibility")),
    SpekeKeyProvider: S.optional(SpekeKeyProvider)
      .pipe(T.JsonName("spekeKeyProvider"))
      .annotations({ identifier: "SpekeKeyProvider" }),
  }),
).annotations({
  identifier: "DashIsoEncryptionSettings",
}) as any as S.Schema<DashIsoEncryptionSettings>;
export type DashIsoHbbtvCompliance = "HBBTV_1_5" | "NONE";
export const DashIsoHbbtvCompliance = S.Literal("HBBTV_1_5", "NONE");
export type DashIsoImageBasedTrickPlay =
  | "NONE"
  | "THUMBNAIL"
  | "THUMBNAIL_AND_FULLFRAME"
  | "ADVANCED";
export const DashIsoImageBasedTrickPlay = S.Literal(
  "NONE",
  "THUMBNAIL",
  "THUMBNAIL_AND_FULLFRAME",
  "ADVANCED",
);
export type DashIsoIntervalCadence = "FOLLOW_IFRAME" | "FOLLOW_CUSTOM";
export const DashIsoIntervalCadence = S.Literal(
  "FOLLOW_IFRAME",
  "FOLLOW_CUSTOM",
);
export interface DashIsoImageBasedTrickPlaySettings {
  IntervalCadence?: DashIsoIntervalCadence;
  ThumbnailHeight?: number;
  ThumbnailInterval?: number;
  ThumbnailWidth?: number;
  TileHeight?: number;
  TileWidth?: number;
}
export const DashIsoImageBasedTrickPlaySettings = S.suspend(() =>
  S.Struct({
    IntervalCadence: S.optional(DashIsoIntervalCadence).pipe(
      T.JsonName("intervalCadence"),
    ),
    ThumbnailHeight: S.optional(S.Number).pipe(T.JsonName("thumbnailHeight")),
    ThumbnailInterval: S.optional(S.Number).pipe(
      T.JsonName("thumbnailInterval"),
    ),
    ThumbnailWidth: S.optional(S.Number).pipe(T.JsonName("thumbnailWidth")),
    TileHeight: S.optional(S.Number).pipe(T.JsonName("tileHeight")),
    TileWidth: S.optional(S.Number).pipe(T.JsonName("tileWidth")),
  }),
).annotations({
  identifier: "DashIsoImageBasedTrickPlaySettings",
}) as any as S.Schema<DashIsoImageBasedTrickPlaySettings>;
export type DashIsoMpdManifestBandwidthType = "AVERAGE" | "MAX";
export const DashIsoMpdManifestBandwidthType = S.Literal("AVERAGE", "MAX");
export type DashIsoMpdProfile = "MAIN_PROFILE" | "ON_DEMAND_PROFILE";
export const DashIsoMpdProfile = S.Literal("MAIN_PROFILE", "ON_DEMAND_PROFILE");
export type DashIsoPtsOffsetHandlingForBFrames =
  | "ZERO_BASED"
  | "MATCH_INITIAL_PTS";
export const DashIsoPtsOffsetHandlingForBFrames = S.Literal(
  "ZERO_BASED",
  "MATCH_INITIAL_PTS",
);
export type DashIsoSegmentControl = "SINGLE_FILE" | "SEGMENTED_FILES";
export const DashIsoSegmentControl = S.Literal(
  "SINGLE_FILE",
  "SEGMENTED_FILES",
);
export type DashIsoSegmentLengthControl = "EXACT" | "GOP_MULTIPLE" | "MATCH";
export const DashIsoSegmentLengthControl = S.Literal(
  "EXACT",
  "GOP_MULTIPLE",
  "MATCH",
);
export type DashIsoVideoCompositionOffsets = "SIGNED" | "UNSIGNED";
export const DashIsoVideoCompositionOffsets = S.Literal("SIGNED", "UNSIGNED");
export type DashIsoWriteSegmentTimelineInRepresentation =
  | "ENABLED"
  | "DISABLED";
export const DashIsoWriteSegmentTimelineInRepresentation = S.Literal(
  "ENABLED",
  "DISABLED",
);
export interface DashIsoGroupSettings {
  AdditionalManifests?: DashAdditionalManifest[];
  AudioChannelConfigSchemeIdUri?: DashIsoGroupAudioChannelConfigSchemeIdUri;
  BaseUrl?: string;
  DashIFrameTrickPlayNameModifier?: string;
  DashManifestStyle?: DashManifestStyle;
  Destination?: string;
  DestinationSettings?: DestinationSettings;
  Encryption?: DashIsoEncryptionSettings;
  FragmentLength?: number;
  HbbtvCompliance?: DashIsoHbbtvCompliance;
  ImageBasedTrickPlay?: DashIsoImageBasedTrickPlay;
  ImageBasedTrickPlaySettings?: DashIsoImageBasedTrickPlaySettings;
  MinBufferTime?: number;
  MinFinalSegmentLength?: number;
  MpdManifestBandwidthType?: DashIsoMpdManifestBandwidthType;
  MpdProfile?: DashIsoMpdProfile;
  PtsOffsetHandlingForBFrames?: DashIsoPtsOffsetHandlingForBFrames;
  SegmentControl?: DashIsoSegmentControl;
  SegmentLength?: number;
  SegmentLengthControl?: DashIsoSegmentLengthControl;
  VideoCompositionOffsets?: DashIsoVideoCompositionOffsets;
  WriteSegmentTimelineInRepresentation?: DashIsoWriteSegmentTimelineInRepresentation;
}
export const DashIsoGroupSettings = S.suspend(() =>
  S.Struct({
    AdditionalManifests: S.optional(__listOfDashAdditionalManifest).pipe(
      T.JsonName("additionalManifests"),
    ),
    AudioChannelConfigSchemeIdUri: S.optional(
      DashIsoGroupAudioChannelConfigSchemeIdUri,
    ).pipe(T.JsonName("audioChannelConfigSchemeIdUri")),
    BaseUrl: S.optional(S.String).pipe(T.JsonName("baseUrl")),
    DashIFrameTrickPlayNameModifier: S.optional(S.String).pipe(
      T.JsonName("dashIFrameTrickPlayNameModifier"),
    ),
    DashManifestStyle: S.optional(DashManifestStyle).pipe(
      T.JsonName("dashManifestStyle"),
    ),
    Destination: S.optional(S.String).pipe(T.JsonName("destination")),
    DestinationSettings: S.optional(DestinationSettings)
      .pipe(T.JsonName("destinationSettings"))
      .annotations({ identifier: "DestinationSettings" }),
    Encryption: S.optional(DashIsoEncryptionSettings)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "DashIsoEncryptionSettings" }),
    FragmentLength: S.optional(S.Number).pipe(T.JsonName("fragmentLength")),
    HbbtvCompliance: S.optional(DashIsoHbbtvCompliance).pipe(
      T.JsonName("hbbtvCompliance"),
    ),
    ImageBasedTrickPlay: S.optional(DashIsoImageBasedTrickPlay).pipe(
      T.JsonName("imageBasedTrickPlay"),
    ),
    ImageBasedTrickPlaySettings: S.optional(DashIsoImageBasedTrickPlaySettings)
      .pipe(T.JsonName("imageBasedTrickPlaySettings"))
      .annotations({ identifier: "DashIsoImageBasedTrickPlaySettings" }),
    MinBufferTime: S.optional(S.Number).pipe(T.JsonName("minBufferTime")),
    MinFinalSegmentLength: S.optional(S.Number).pipe(
      T.JsonName("minFinalSegmentLength"),
    ),
    MpdManifestBandwidthType: S.optional(DashIsoMpdManifestBandwidthType).pipe(
      T.JsonName("mpdManifestBandwidthType"),
    ),
    MpdProfile: S.optional(DashIsoMpdProfile).pipe(T.JsonName("mpdProfile")),
    PtsOffsetHandlingForBFrames: S.optional(
      DashIsoPtsOffsetHandlingForBFrames,
    ).pipe(T.JsonName("ptsOffsetHandlingForBFrames")),
    SegmentControl: S.optional(DashIsoSegmentControl).pipe(
      T.JsonName("segmentControl"),
    ),
    SegmentLength: S.optional(S.Number).pipe(T.JsonName("segmentLength")),
    SegmentLengthControl: S.optional(DashIsoSegmentLengthControl).pipe(
      T.JsonName("segmentLengthControl"),
    ),
    VideoCompositionOffsets: S.optional(DashIsoVideoCompositionOffsets).pipe(
      T.JsonName("videoCompositionOffsets"),
    ),
    WriteSegmentTimelineInRepresentation: S.optional(
      DashIsoWriteSegmentTimelineInRepresentation,
    ).pipe(T.JsonName("writeSegmentTimelineInRepresentation")),
  }),
).annotations({
  identifier: "DashIsoGroupSettings",
}) as any as S.Schema<DashIsoGroupSettings>;
export interface FileGroupSettings {
  Destination?: string;
  DestinationSettings?: DestinationSettings;
}
export const FileGroupSettings = S.suspend(() =>
  S.Struct({
    Destination: S.optional(S.String).pipe(T.JsonName("destination")),
    DestinationSettings: S.optional(DestinationSettings)
      .pipe(T.JsonName("destinationSettings"))
      .annotations({ identifier: "DestinationSettings" }),
  }),
).annotations({
  identifier: "FileGroupSettings",
}) as any as S.Schema<FileGroupSettings>;
export type HlsAdMarkers = "ELEMENTAL" | "ELEMENTAL_SCTE35";
export const HlsAdMarkers = S.Literal("ELEMENTAL", "ELEMENTAL_SCTE35");
export type __listOfHlsAdMarkers = HlsAdMarkers[];
export const __listOfHlsAdMarkers = S.Array(HlsAdMarkers);
export interface HlsAdditionalManifest {
  ManifestNameModifier?: string;
  SelectedOutputs?: string[];
}
export const HlsAdditionalManifest = S.suspend(() =>
  S.Struct({
    ManifestNameModifier: S.optional(S.String).pipe(
      T.JsonName("manifestNameModifier"),
    ),
    SelectedOutputs: S.optional(__listOf__stringMin1).pipe(
      T.JsonName("selectedOutputs"),
    ),
  }),
).annotations({
  identifier: "HlsAdditionalManifest",
}) as any as S.Schema<HlsAdditionalManifest>;
export type __listOfHlsAdditionalManifest = HlsAdditionalManifest[];
export const __listOfHlsAdditionalManifest = S.Array(HlsAdditionalManifest);
export type HlsAudioOnlyHeader = "INCLUDE" | "EXCLUDE";
export const HlsAudioOnlyHeader = S.Literal("INCLUDE", "EXCLUDE");
export interface HlsCaptionLanguageMapping {
  CaptionChannel?: number;
  CustomLanguageCode?: string;
  LanguageCode?: LanguageCode;
  LanguageDescription?: string;
}
export const HlsCaptionLanguageMapping = S.suspend(() =>
  S.Struct({
    CaptionChannel: S.optional(S.Number).pipe(T.JsonName("captionChannel")),
    CustomLanguageCode: S.optional(S.String).pipe(
      T.JsonName("customLanguageCode"),
    ),
    LanguageCode: S.optional(LanguageCode).pipe(T.JsonName("languageCode")),
    LanguageDescription: S.optional(S.String).pipe(
      T.JsonName("languageDescription"),
    ),
  }),
).annotations({
  identifier: "HlsCaptionLanguageMapping",
}) as any as S.Schema<HlsCaptionLanguageMapping>;
export type __listOfHlsCaptionLanguageMapping = HlsCaptionLanguageMapping[];
export const __listOfHlsCaptionLanguageMapping = S.Array(
  HlsCaptionLanguageMapping,
);
export type HlsCaptionLanguageSetting = "INSERT" | "OMIT" | "NONE";
export const HlsCaptionLanguageSetting = S.Literal("INSERT", "OMIT", "NONE");
export type HlsCaptionSegmentLengthControl = "LARGE_SEGMENTS" | "MATCH_VIDEO";
export const HlsCaptionSegmentLengthControl = S.Literal(
  "LARGE_SEGMENTS",
  "MATCH_VIDEO",
);
export type HlsClientCache = "DISABLED" | "ENABLED";
export const HlsClientCache = S.Literal("DISABLED", "ENABLED");
export type HlsCodecSpecification = "RFC_6381" | "RFC_4281";
export const HlsCodecSpecification = S.Literal("RFC_6381", "RFC_4281");
export type HlsDirectoryStructure =
  | "SINGLE_DIRECTORY"
  | "SUBDIRECTORY_PER_STREAM";
export const HlsDirectoryStructure = S.Literal(
  "SINGLE_DIRECTORY",
  "SUBDIRECTORY_PER_STREAM",
);
export type HlsEncryptionType = "AES128" | "SAMPLE_AES";
export const HlsEncryptionType = S.Literal("AES128", "SAMPLE_AES");
export type HlsInitializationVectorInManifest = "INCLUDE" | "EXCLUDE";
export const HlsInitializationVectorInManifest = S.Literal(
  "INCLUDE",
  "EXCLUDE",
);
export type HlsOfflineEncrypted = "ENABLED" | "DISABLED";
export const HlsOfflineEncrypted = S.Literal("ENABLED", "DISABLED");
export type HlsKeyProviderType = "SPEKE" | "STATIC_KEY";
export const HlsKeyProviderType = S.Literal("SPEKE", "STATIC_KEY");
export interface HlsEncryptionSettings {
  ConstantInitializationVector?: string;
  EncryptionMethod?: HlsEncryptionType;
  InitializationVectorInManifest?: HlsInitializationVectorInManifest;
  OfflineEncrypted?: HlsOfflineEncrypted;
  SpekeKeyProvider?: SpekeKeyProvider;
  StaticKeyProvider?: StaticKeyProvider;
  Type?: HlsKeyProviderType;
}
export const HlsEncryptionSettings = S.suspend(() =>
  S.Struct({
    ConstantInitializationVector: S.optional(S.String).pipe(
      T.JsonName("constantInitializationVector"),
    ),
    EncryptionMethod: S.optional(HlsEncryptionType).pipe(
      T.JsonName("encryptionMethod"),
    ),
    InitializationVectorInManifest: S.optional(
      HlsInitializationVectorInManifest,
    ).pipe(T.JsonName("initializationVectorInManifest")),
    OfflineEncrypted: S.optional(HlsOfflineEncrypted).pipe(
      T.JsonName("offlineEncrypted"),
    ),
    SpekeKeyProvider: S.optional(SpekeKeyProvider)
      .pipe(T.JsonName("spekeKeyProvider"))
      .annotations({ identifier: "SpekeKeyProvider" }),
    StaticKeyProvider: S.optional(StaticKeyProvider)
      .pipe(T.JsonName("staticKeyProvider"))
      .annotations({ identifier: "StaticKeyProvider" }),
    Type: S.optional(HlsKeyProviderType).pipe(T.JsonName("type")),
  }),
).annotations({
  identifier: "HlsEncryptionSettings",
}) as any as S.Schema<HlsEncryptionSettings>;
export type HlsImageBasedTrickPlay =
  | "NONE"
  | "THUMBNAIL"
  | "THUMBNAIL_AND_FULLFRAME"
  | "ADVANCED";
export const HlsImageBasedTrickPlay = S.Literal(
  "NONE",
  "THUMBNAIL",
  "THUMBNAIL_AND_FULLFRAME",
  "ADVANCED",
);
export type HlsIntervalCadence = "FOLLOW_IFRAME" | "FOLLOW_CUSTOM";
export const HlsIntervalCadence = S.Literal("FOLLOW_IFRAME", "FOLLOW_CUSTOM");
export interface HlsImageBasedTrickPlaySettings {
  IntervalCadence?: HlsIntervalCadence;
  ThumbnailHeight?: number;
  ThumbnailInterval?: number;
  ThumbnailWidth?: number;
  TileHeight?: number;
  TileWidth?: number;
}
export const HlsImageBasedTrickPlaySettings = S.suspend(() =>
  S.Struct({
    IntervalCadence: S.optional(HlsIntervalCadence).pipe(
      T.JsonName("intervalCadence"),
    ),
    ThumbnailHeight: S.optional(S.Number).pipe(T.JsonName("thumbnailHeight")),
    ThumbnailInterval: S.optional(S.Number).pipe(
      T.JsonName("thumbnailInterval"),
    ),
    ThumbnailWidth: S.optional(S.Number).pipe(T.JsonName("thumbnailWidth")),
    TileHeight: S.optional(S.Number).pipe(T.JsonName("tileHeight")),
    TileWidth: S.optional(S.Number).pipe(T.JsonName("tileWidth")),
  }),
).annotations({
  identifier: "HlsImageBasedTrickPlaySettings",
}) as any as S.Schema<HlsImageBasedTrickPlaySettings>;
export type HlsManifestCompression = "GZIP" | "NONE";
export const HlsManifestCompression = S.Literal("GZIP", "NONE");
export type HlsManifestDurationFormat = "FLOATING_POINT" | "INTEGER";
export const HlsManifestDurationFormat = S.Literal("FLOATING_POINT", "INTEGER");
export type HlsOutputSelection = "MANIFESTS_AND_SEGMENTS" | "SEGMENTS_ONLY";
export const HlsOutputSelection = S.Literal(
  "MANIFESTS_AND_SEGMENTS",
  "SEGMENTS_ONLY",
);
export type HlsProgramDateTime = "INCLUDE" | "EXCLUDE";
export const HlsProgramDateTime = S.Literal("INCLUDE", "EXCLUDE");
export type HlsProgressiveWriteHlsManifest = "ENABLED" | "DISABLED";
export const HlsProgressiveWriteHlsManifest = S.Literal("ENABLED", "DISABLED");
export type HlsSegmentControl = "SINGLE_FILE" | "SEGMENTED_FILES";
export const HlsSegmentControl = S.Literal("SINGLE_FILE", "SEGMENTED_FILES");
export type HlsSegmentLengthControl = "EXACT" | "GOP_MULTIPLE" | "MATCH";
export const HlsSegmentLengthControl = S.Literal(
  "EXACT",
  "GOP_MULTIPLE",
  "MATCH",
);
export type HlsStreamInfResolution = "INCLUDE" | "EXCLUDE";
export const HlsStreamInfResolution = S.Literal("INCLUDE", "EXCLUDE");
export type HlsTargetDurationCompatibilityMode = "LEGACY" | "SPEC_COMPLIANT";
export const HlsTargetDurationCompatibilityMode = S.Literal(
  "LEGACY",
  "SPEC_COMPLIANT",
);
export type HlsTimedMetadataId3Frame = "NONE" | "PRIV" | "TDRL";
export const HlsTimedMetadataId3Frame = S.Literal("NONE", "PRIV", "TDRL");
export interface HlsGroupSettings {
  AdMarkers?: HlsAdMarkers[];
  AdditionalManifests?: HlsAdditionalManifest[];
  AudioOnlyHeader?: HlsAudioOnlyHeader;
  BaseUrl?: string;
  CaptionLanguageMappings?: HlsCaptionLanguageMapping[];
  CaptionLanguageSetting?: HlsCaptionLanguageSetting;
  CaptionSegmentLengthControl?: HlsCaptionSegmentLengthControl;
  ClientCache?: HlsClientCache;
  CodecSpecification?: HlsCodecSpecification;
  Destination?: string;
  DestinationSettings?: DestinationSettings;
  DirectoryStructure?: HlsDirectoryStructure;
  Encryption?: HlsEncryptionSettings;
  ImageBasedTrickPlay?: HlsImageBasedTrickPlay;
  ImageBasedTrickPlaySettings?: HlsImageBasedTrickPlaySettings;
  ManifestCompression?: HlsManifestCompression;
  ManifestDurationFormat?: HlsManifestDurationFormat;
  MinFinalSegmentLength?: number;
  MinSegmentLength?: number;
  OutputSelection?: HlsOutputSelection;
  ProgramDateTime?: HlsProgramDateTime;
  ProgramDateTimePeriod?: number;
  ProgressiveWriteHlsManifest?: HlsProgressiveWriteHlsManifest;
  SegmentControl?: HlsSegmentControl;
  SegmentLength?: number;
  SegmentLengthControl?: HlsSegmentLengthControl;
  SegmentsPerSubdirectory?: number;
  StreamInfResolution?: HlsStreamInfResolution;
  TargetDurationCompatibilityMode?: HlsTargetDurationCompatibilityMode;
  TimedMetadataId3Frame?: HlsTimedMetadataId3Frame;
  TimedMetadataId3Period?: number;
  TimestampDeltaMilliseconds?: number;
}
export const HlsGroupSettings = S.suspend(() =>
  S.Struct({
    AdMarkers: S.optional(__listOfHlsAdMarkers).pipe(T.JsonName("adMarkers")),
    AdditionalManifests: S.optional(__listOfHlsAdditionalManifest).pipe(
      T.JsonName("additionalManifests"),
    ),
    AudioOnlyHeader: S.optional(HlsAudioOnlyHeader).pipe(
      T.JsonName("audioOnlyHeader"),
    ),
    BaseUrl: S.optional(S.String).pipe(T.JsonName("baseUrl")),
    CaptionLanguageMappings: S.optional(__listOfHlsCaptionLanguageMapping).pipe(
      T.JsonName("captionLanguageMappings"),
    ),
    CaptionLanguageSetting: S.optional(HlsCaptionLanguageSetting).pipe(
      T.JsonName("captionLanguageSetting"),
    ),
    CaptionSegmentLengthControl: S.optional(
      HlsCaptionSegmentLengthControl,
    ).pipe(T.JsonName("captionSegmentLengthControl")),
    ClientCache: S.optional(HlsClientCache).pipe(T.JsonName("clientCache")),
    CodecSpecification: S.optional(HlsCodecSpecification).pipe(
      T.JsonName("codecSpecification"),
    ),
    Destination: S.optional(S.String).pipe(T.JsonName("destination")),
    DestinationSettings: S.optional(DestinationSettings)
      .pipe(T.JsonName("destinationSettings"))
      .annotations({ identifier: "DestinationSettings" }),
    DirectoryStructure: S.optional(HlsDirectoryStructure).pipe(
      T.JsonName("directoryStructure"),
    ),
    Encryption: S.optional(HlsEncryptionSettings)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "HlsEncryptionSettings" }),
    ImageBasedTrickPlay: S.optional(HlsImageBasedTrickPlay).pipe(
      T.JsonName("imageBasedTrickPlay"),
    ),
    ImageBasedTrickPlaySettings: S.optional(HlsImageBasedTrickPlaySettings)
      .pipe(T.JsonName("imageBasedTrickPlaySettings"))
      .annotations({ identifier: "HlsImageBasedTrickPlaySettings" }),
    ManifestCompression: S.optional(HlsManifestCompression).pipe(
      T.JsonName("manifestCompression"),
    ),
    ManifestDurationFormat: S.optional(HlsManifestDurationFormat).pipe(
      T.JsonName("manifestDurationFormat"),
    ),
    MinFinalSegmentLength: S.optional(S.Number).pipe(
      T.JsonName("minFinalSegmentLength"),
    ),
    MinSegmentLength: S.optional(S.Number).pipe(T.JsonName("minSegmentLength")),
    OutputSelection: S.optional(HlsOutputSelection).pipe(
      T.JsonName("outputSelection"),
    ),
    ProgramDateTime: S.optional(HlsProgramDateTime).pipe(
      T.JsonName("programDateTime"),
    ),
    ProgramDateTimePeriod: S.optional(S.Number).pipe(
      T.JsonName("programDateTimePeriod"),
    ),
    ProgressiveWriteHlsManifest: S.optional(
      HlsProgressiveWriteHlsManifest,
    ).pipe(T.JsonName("progressiveWriteHlsManifest")),
    SegmentControl: S.optional(HlsSegmentControl).pipe(
      T.JsonName("segmentControl"),
    ),
    SegmentLength: S.optional(S.Number).pipe(T.JsonName("segmentLength")),
    SegmentLengthControl: S.optional(HlsSegmentLengthControl).pipe(
      T.JsonName("segmentLengthControl"),
    ),
    SegmentsPerSubdirectory: S.optional(S.Number).pipe(
      T.JsonName("segmentsPerSubdirectory"),
    ),
    StreamInfResolution: S.optional(HlsStreamInfResolution).pipe(
      T.JsonName("streamInfResolution"),
    ),
    TargetDurationCompatibilityMode: S.optional(
      HlsTargetDurationCompatibilityMode,
    ).pipe(T.JsonName("targetDurationCompatibilityMode")),
    TimedMetadataId3Frame: S.optional(HlsTimedMetadataId3Frame).pipe(
      T.JsonName("timedMetadataId3Frame"),
    ),
    TimedMetadataId3Period: S.optional(S.Number).pipe(
      T.JsonName("timedMetadataId3Period"),
    ),
    TimestampDeltaMilliseconds: S.optional(S.Number).pipe(
      T.JsonName("timestampDeltaMilliseconds"),
    ),
  }),
).annotations({
  identifier: "HlsGroupSettings",
}) as any as S.Schema<HlsGroupSettings>;
export interface MsSmoothAdditionalManifest {
  ManifestNameModifier?: string;
  SelectedOutputs?: string[];
}
export const MsSmoothAdditionalManifest = S.suspend(() =>
  S.Struct({
    ManifestNameModifier: S.optional(S.String).pipe(
      T.JsonName("manifestNameModifier"),
    ),
    SelectedOutputs: S.optional(__listOf__stringMin1).pipe(
      T.JsonName("selectedOutputs"),
    ),
  }),
).annotations({
  identifier: "MsSmoothAdditionalManifest",
}) as any as S.Schema<MsSmoothAdditionalManifest>;
export type __listOfMsSmoothAdditionalManifest = MsSmoothAdditionalManifest[];
export const __listOfMsSmoothAdditionalManifest = S.Array(
  MsSmoothAdditionalManifest,
);
export type MsSmoothAudioDeduplication = "COMBINE_DUPLICATE_STREAMS" | "NONE";
export const MsSmoothAudioDeduplication = S.Literal(
  "COMBINE_DUPLICATE_STREAMS",
  "NONE",
);
export interface MsSmoothEncryptionSettings {
  SpekeKeyProvider?: SpekeKeyProvider;
}
export const MsSmoothEncryptionSettings = S.suspend(() =>
  S.Struct({
    SpekeKeyProvider: S.optional(SpekeKeyProvider)
      .pipe(T.JsonName("spekeKeyProvider"))
      .annotations({ identifier: "SpekeKeyProvider" }),
  }),
).annotations({
  identifier: "MsSmoothEncryptionSettings",
}) as any as S.Schema<MsSmoothEncryptionSettings>;
export type MsSmoothFragmentLengthControl = "EXACT" | "GOP_MULTIPLE";
export const MsSmoothFragmentLengthControl = S.Literal("EXACT", "GOP_MULTIPLE");
export type MsSmoothManifestEncoding = "UTF8" | "UTF16";
export const MsSmoothManifestEncoding = S.Literal("UTF8", "UTF16");
export interface MsSmoothGroupSettings {
  AdditionalManifests?: MsSmoothAdditionalManifest[];
  AudioDeduplication?: MsSmoothAudioDeduplication;
  Destination?: string;
  DestinationSettings?: DestinationSettings;
  Encryption?: MsSmoothEncryptionSettings;
  FragmentLength?: number;
  FragmentLengthControl?: MsSmoothFragmentLengthControl;
  ManifestEncoding?: MsSmoothManifestEncoding;
}
export const MsSmoothGroupSettings = S.suspend(() =>
  S.Struct({
    AdditionalManifests: S.optional(__listOfMsSmoothAdditionalManifest).pipe(
      T.JsonName("additionalManifests"),
    ),
    AudioDeduplication: S.optional(MsSmoothAudioDeduplication).pipe(
      T.JsonName("audioDeduplication"),
    ),
    Destination: S.optional(S.String).pipe(T.JsonName("destination")),
    DestinationSettings: S.optional(DestinationSettings)
      .pipe(T.JsonName("destinationSettings"))
      .annotations({ identifier: "DestinationSettings" }),
    Encryption: S.optional(MsSmoothEncryptionSettings)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "MsSmoothEncryptionSettings" }),
    FragmentLength: S.optional(S.Number).pipe(T.JsonName("fragmentLength")),
    FragmentLengthControl: S.optional(MsSmoothFragmentLengthControl).pipe(
      T.JsonName("fragmentLengthControl"),
    ),
    ManifestEncoding: S.optional(MsSmoothManifestEncoding).pipe(
      T.JsonName("manifestEncoding"),
    ),
  }),
).annotations({
  identifier: "MsSmoothGroupSettings",
}) as any as S.Schema<MsSmoothGroupSettings>;
export type FrameMetricType =
  | "PSNR"
  | "SSIM"
  | "MS_SSIM"
  | "PSNR_HVS"
  | "VMAF"
  | "QVBR"
  | "SHOT_CHANGE";
export const FrameMetricType = S.Literal(
  "PSNR",
  "SSIM",
  "MS_SSIM",
  "PSNR_HVS",
  "VMAF",
  "QVBR",
  "SHOT_CHANGE",
);
export type __listOfFrameMetricType = FrameMetricType[];
export const __listOfFrameMetricType = S.Array(FrameMetricType);
export type OutputGroupType =
  | "HLS_GROUP_SETTINGS"
  | "DASH_ISO_GROUP_SETTINGS"
  | "FILE_GROUP_SETTINGS"
  | "MS_SMOOTH_GROUP_SETTINGS"
  | "CMAF_GROUP_SETTINGS";
export const OutputGroupType = S.Literal(
  "HLS_GROUP_SETTINGS",
  "DASH_ISO_GROUP_SETTINGS",
  "FILE_GROUP_SETTINGS",
  "MS_SMOOTH_GROUP_SETTINGS",
  "CMAF_GROUP_SETTINGS",
);
export interface OutputGroupSettings {
  CmafGroupSettings?: CmafGroupSettings;
  DashIsoGroupSettings?: DashIsoGroupSettings;
  FileGroupSettings?: FileGroupSettings;
  HlsGroupSettings?: HlsGroupSettings;
  MsSmoothGroupSettings?: MsSmoothGroupSettings;
  PerFrameMetrics?: FrameMetricType[];
  Type?: OutputGroupType;
}
export const OutputGroupSettings = S.suspend(() =>
  S.Struct({
    CmafGroupSettings: S.optional(CmafGroupSettings)
      .pipe(T.JsonName("cmafGroupSettings"))
      .annotations({ identifier: "CmafGroupSettings" }),
    DashIsoGroupSettings: S.optional(DashIsoGroupSettings)
      .pipe(T.JsonName("dashIsoGroupSettings"))
      .annotations({ identifier: "DashIsoGroupSettings" }),
    FileGroupSettings: S.optional(FileGroupSettings)
      .pipe(T.JsonName("fileGroupSettings"))
      .annotations({ identifier: "FileGroupSettings" }),
    HlsGroupSettings: S.optional(HlsGroupSettings)
      .pipe(T.JsonName("hlsGroupSettings"))
      .annotations({ identifier: "HlsGroupSettings" }),
    MsSmoothGroupSettings: S.optional(MsSmoothGroupSettings)
      .pipe(T.JsonName("msSmoothGroupSettings"))
      .annotations({ identifier: "MsSmoothGroupSettings" }),
    PerFrameMetrics: S.optional(__listOfFrameMetricType).pipe(
      T.JsonName("perFrameMetrics"),
    ),
    Type: S.optional(OutputGroupType).pipe(T.JsonName("type")),
  }),
).annotations({
  identifier: "OutputGroupSettings",
}) as any as S.Schema<OutputGroupSettings>;
export type AudioChannelTag =
  | "L"
  | "R"
  | "C"
  | "LFE"
  | "LS"
  | "RS"
  | "LC"
  | "RC"
  | "CS"
  | "LSD"
  | "RSD"
  | "TCS"
  | "VHL"
  | "VHC"
  | "VHR"
  | "TBL"
  | "TBC"
  | "TBR"
  | "RSL"
  | "RSR"
  | "LW"
  | "RW"
  | "LFE2"
  | "LT"
  | "RT"
  | "HI"
  | "NAR"
  | "M";
export const AudioChannelTag = S.Literal(
  "L",
  "R",
  "C",
  "LFE",
  "LS",
  "RS",
  "LC",
  "RC",
  "CS",
  "LSD",
  "RSD",
  "TCS",
  "VHL",
  "VHC",
  "VHR",
  "TBL",
  "TBC",
  "TBR",
  "RSL",
  "RSR",
  "LW",
  "RW",
  "LFE2",
  "LT",
  "RT",
  "HI",
  "NAR",
  "M",
);
export type __listOfAudioChannelTag = AudioChannelTag[];
export const __listOfAudioChannelTag = S.Array(AudioChannelTag);
export interface AudioChannelTaggingSettings {
  ChannelTag?: AudioChannelTag;
  ChannelTags?: AudioChannelTag[];
}
export const AudioChannelTaggingSettings = S.suspend(() =>
  S.Struct({
    ChannelTag: S.optional(AudioChannelTag).pipe(T.JsonName("channelTag")),
    ChannelTags: S.optional(__listOfAudioChannelTag).pipe(
      T.JsonName("channelTags"),
    ),
  }),
).annotations({
  identifier: "AudioChannelTaggingSettings",
}) as any as S.Schema<AudioChannelTaggingSettings>;
export type AudioNormalizationAlgorithm =
  | "ITU_BS_1770_1"
  | "ITU_BS_1770_2"
  | "ITU_BS_1770_3"
  | "ITU_BS_1770_4";
export const AudioNormalizationAlgorithm = S.Literal(
  "ITU_BS_1770_1",
  "ITU_BS_1770_2",
  "ITU_BS_1770_3",
  "ITU_BS_1770_4",
);
export type AudioNormalizationAlgorithmControl =
  | "CORRECT_AUDIO"
  | "MEASURE_ONLY";
export const AudioNormalizationAlgorithmControl = S.Literal(
  "CORRECT_AUDIO",
  "MEASURE_ONLY",
);
export type AudioNormalizationLoudnessLogging = "LOG" | "DONT_LOG";
export const AudioNormalizationLoudnessLogging = S.Literal("LOG", "DONT_LOG");
export type AudioNormalizationPeakCalculation = "TRUE_PEAK" | "NONE";
export const AudioNormalizationPeakCalculation = S.Literal("TRUE_PEAK", "NONE");
export interface AudioNormalizationSettings {
  Algorithm?: AudioNormalizationAlgorithm;
  AlgorithmControl?: AudioNormalizationAlgorithmControl;
  CorrectionGateLevel?: number;
  LoudnessLogging?: AudioNormalizationLoudnessLogging;
  PeakCalculation?: AudioNormalizationPeakCalculation;
  TargetLkfs?: number;
  TruePeakLimiterThreshold?: number;
}
export const AudioNormalizationSettings = S.suspend(() =>
  S.Struct({
    Algorithm: S.optional(AudioNormalizationAlgorithm).pipe(
      T.JsonName("algorithm"),
    ),
    AlgorithmControl: S.optional(AudioNormalizationAlgorithmControl).pipe(
      T.JsonName("algorithmControl"),
    ),
    CorrectionGateLevel: S.optional(S.Number).pipe(
      T.JsonName("correctionGateLevel"),
    ),
    LoudnessLogging: S.optional(AudioNormalizationLoudnessLogging).pipe(
      T.JsonName("loudnessLogging"),
    ),
    PeakCalculation: S.optional(AudioNormalizationPeakCalculation).pipe(
      T.JsonName("peakCalculation"),
    ),
    TargetLkfs: S.optional(S.Number).pipe(T.JsonName("targetLkfs")),
    TruePeakLimiterThreshold: S.optional(S.Number).pipe(
      T.JsonName("truePeakLimiterThreshold"),
    ),
  }),
).annotations({
  identifier: "AudioNormalizationSettings",
}) as any as S.Schema<AudioNormalizationSettings>;
export type SlowPalPitchCorrection = "DISABLED" | "ENABLED";
export const SlowPalPitchCorrection = S.Literal("DISABLED", "ENABLED");
export interface AudioPitchCorrectionSettings {
  SlowPalPitchCorrection?: SlowPalPitchCorrection;
}
export const AudioPitchCorrectionSettings = S.suspend(() =>
  S.Struct({
    SlowPalPitchCorrection: S.optional(SlowPalPitchCorrection).pipe(
      T.JsonName("slowPalPitchCorrection"),
    ),
  }),
).annotations({
  identifier: "AudioPitchCorrectionSettings",
}) as any as S.Schema<AudioPitchCorrectionSettings>;
export type AudioTypeControl = "FOLLOW_INPUT" | "USE_CONFIGURED";
export const AudioTypeControl = S.Literal("FOLLOW_INPUT", "USE_CONFIGURED");
export type AacAudioDescriptionBroadcasterMix =
  | "BROADCASTER_MIXED_AD"
  | "NORMAL";
export const AacAudioDescriptionBroadcasterMix = S.Literal(
  "BROADCASTER_MIXED_AD",
  "NORMAL",
);
export type AacCodecProfile = "LC" | "HEV1" | "HEV2" | "XHE";
export const AacCodecProfile = S.Literal("LC", "HEV1", "HEV2", "XHE");
export type AacCodingMode =
  | "AD_RECEIVER_MIX"
  | "CODING_MODE_1_0"
  | "CODING_MODE_1_1"
  | "CODING_MODE_2_0"
  | "CODING_MODE_5_1";
export const AacCodingMode = S.Literal(
  "AD_RECEIVER_MIX",
  "CODING_MODE_1_0",
  "CODING_MODE_1_1",
  "CODING_MODE_2_0",
  "CODING_MODE_5_1",
);
export type AacLoudnessMeasurementMode = "PROGRAM" | "ANCHOR";
export const AacLoudnessMeasurementMode = S.Literal("PROGRAM", "ANCHOR");
export type AacRateControlMode = "CBR" | "VBR";
export const AacRateControlMode = S.Literal("CBR", "VBR");
export type AacRawFormat = "LATM_LOAS" | "NONE";
export const AacRawFormat = S.Literal("LATM_LOAS", "NONE");
export type AacSpecification = "MPEG2" | "MPEG4";
export const AacSpecification = S.Literal("MPEG2", "MPEG4");
export type AacVbrQuality = "LOW" | "MEDIUM_LOW" | "MEDIUM_HIGH" | "HIGH";
export const AacVbrQuality = S.Literal(
  "LOW",
  "MEDIUM_LOW",
  "MEDIUM_HIGH",
  "HIGH",
);
export interface AacSettings {
  AudioDescriptionBroadcasterMix?: AacAudioDescriptionBroadcasterMix;
  Bitrate?: number;
  CodecProfile?: AacCodecProfile;
  CodingMode?: AacCodingMode;
  LoudnessMeasurementMode?: AacLoudnessMeasurementMode;
  RapInterval?: number;
  RateControlMode?: AacRateControlMode;
  RawFormat?: AacRawFormat;
  SampleRate?: number;
  Specification?: AacSpecification;
  TargetLoudnessRange?: number;
  VbrQuality?: AacVbrQuality;
}
export const AacSettings = S.suspend(() =>
  S.Struct({
    AudioDescriptionBroadcasterMix: S.optional(
      AacAudioDescriptionBroadcasterMix,
    ).pipe(T.JsonName("audioDescriptionBroadcasterMix")),
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    CodecProfile: S.optional(AacCodecProfile).pipe(T.JsonName("codecProfile")),
    CodingMode: S.optional(AacCodingMode).pipe(T.JsonName("codingMode")),
    LoudnessMeasurementMode: S.optional(AacLoudnessMeasurementMode).pipe(
      T.JsonName("loudnessMeasurementMode"),
    ),
    RapInterval: S.optional(S.Number).pipe(T.JsonName("rapInterval")),
    RateControlMode: S.optional(AacRateControlMode).pipe(
      T.JsonName("rateControlMode"),
    ),
    RawFormat: S.optional(AacRawFormat).pipe(T.JsonName("rawFormat")),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
    Specification: S.optional(AacSpecification).pipe(
      T.JsonName("specification"),
    ),
    TargetLoudnessRange: S.optional(S.Number).pipe(
      T.JsonName("targetLoudnessRange"),
    ),
    VbrQuality: S.optional(AacVbrQuality).pipe(T.JsonName("vbrQuality")),
  }),
).annotations({ identifier: "AacSettings" }) as any as S.Schema<AacSettings>;
export type Ac3BitstreamMode =
  | "COMPLETE_MAIN"
  | "COMMENTARY"
  | "DIALOGUE"
  | "EMERGENCY"
  | "HEARING_IMPAIRED"
  | "MUSIC_AND_EFFECTS"
  | "VISUALLY_IMPAIRED"
  | "VOICE_OVER";
export const Ac3BitstreamMode = S.Literal(
  "COMPLETE_MAIN",
  "COMMENTARY",
  "DIALOGUE",
  "EMERGENCY",
  "HEARING_IMPAIRED",
  "MUSIC_AND_EFFECTS",
  "VISUALLY_IMPAIRED",
  "VOICE_OVER",
);
export type Ac3CodingMode =
  | "CODING_MODE_1_0"
  | "CODING_MODE_1_1"
  | "CODING_MODE_2_0"
  | "CODING_MODE_3_2_LFE";
export const Ac3CodingMode = S.Literal(
  "CODING_MODE_1_0",
  "CODING_MODE_1_1",
  "CODING_MODE_2_0",
  "CODING_MODE_3_2_LFE",
);
export type Ac3DynamicRangeCompressionLine =
  | "FILM_STANDARD"
  | "FILM_LIGHT"
  | "MUSIC_STANDARD"
  | "MUSIC_LIGHT"
  | "SPEECH"
  | "NONE";
export const Ac3DynamicRangeCompressionLine = S.Literal(
  "FILM_STANDARD",
  "FILM_LIGHT",
  "MUSIC_STANDARD",
  "MUSIC_LIGHT",
  "SPEECH",
  "NONE",
);
export type Ac3DynamicRangeCompressionProfile = "FILM_STANDARD" | "NONE";
export const Ac3DynamicRangeCompressionProfile = S.Literal(
  "FILM_STANDARD",
  "NONE",
);
export type Ac3DynamicRangeCompressionRf =
  | "FILM_STANDARD"
  | "FILM_LIGHT"
  | "MUSIC_STANDARD"
  | "MUSIC_LIGHT"
  | "SPEECH"
  | "NONE";
export const Ac3DynamicRangeCompressionRf = S.Literal(
  "FILM_STANDARD",
  "FILM_LIGHT",
  "MUSIC_STANDARD",
  "MUSIC_LIGHT",
  "SPEECH",
  "NONE",
);
export type Ac3LfeFilter = "ENABLED" | "DISABLED";
export const Ac3LfeFilter = S.Literal("ENABLED", "DISABLED");
export type Ac3MetadataControl = "FOLLOW_INPUT" | "USE_CONFIGURED";
export const Ac3MetadataControl = S.Literal("FOLLOW_INPUT", "USE_CONFIGURED");
export interface Ac3Settings {
  Bitrate?: number;
  BitstreamMode?: Ac3BitstreamMode;
  CodingMode?: Ac3CodingMode;
  Dialnorm?: number;
  DynamicRangeCompressionLine?: Ac3DynamicRangeCompressionLine;
  DynamicRangeCompressionProfile?: Ac3DynamicRangeCompressionProfile;
  DynamicRangeCompressionRf?: Ac3DynamicRangeCompressionRf;
  LfeFilter?: Ac3LfeFilter;
  MetadataControl?: Ac3MetadataControl;
  SampleRate?: number;
}
export const Ac3Settings = S.suspend(() =>
  S.Struct({
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    BitstreamMode: S.optional(Ac3BitstreamMode).pipe(
      T.JsonName("bitstreamMode"),
    ),
    CodingMode: S.optional(Ac3CodingMode).pipe(T.JsonName("codingMode")),
    Dialnorm: S.optional(S.Number).pipe(T.JsonName("dialnorm")),
    DynamicRangeCompressionLine: S.optional(
      Ac3DynamicRangeCompressionLine,
    ).pipe(T.JsonName("dynamicRangeCompressionLine")),
    DynamicRangeCompressionProfile: S.optional(
      Ac3DynamicRangeCompressionProfile,
    ).pipe(T.JsonName("dynamicRangeCompressionProfile")),
    DynamicRangeCompressionRf: S.optional(Ac3DynamicRangeCompressionRf).pipe(
      T.JsonName("dynamicRangeCompressionRf"),
    ),
    LfeFilter: S.optional(Ac3LfeFilter).pipe(T.JsonName("lfeFilter")),
    MetadataControl: S.optional(Ac3MetadataControl).pipe(
      T.JsonName("metadataControl"),
    ),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
  }),
).annotations({ identifier: "Ac3Settings" }) as any as S.Schema<Ac3Settings>;
export interface AiffSettings {
  BitDepth?: number;
  Channels?: number;
  SampleRate?: number;
}
export const AiffSettings = S.suspend(() =>
  S.Struct({
    BitDepth: S.optional(S.Number).pipe(T.JsonName("bitDepth")),
    Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
  }),
).annotations({ identifier: "AiffSettings" }) as any as S.Schema<AiffSettings>;
export type AudioCodec =
  | "AAC"
  | "MP2"
  | "MP3"
  | "WAV"
  | "AIFF"
  | "AC3"
  | "EAC3"
  | "EAC3_ATMOS"
  | "VORBIS"
  | "OPUS"
  | "PASSTHROUGH"
  | "FLAC";
export const AudioCodec = S.Literal(
  "AAC",
  "MP2",
  "MP3",
  "WAV",
  "AIFF",
  "AC3",
  "EAC3",
  "EAC3_ATMOS",
  "VORBIS",
  "OPUS",
  "PASSTHROUGH",
  "FLAC",
);
export type Eac3AtmosBitstreamMode = "COMPLETE_MAIN";
export const Eac3AtmosBitstreamMode = S.Literal("COMPLETE_MAIN");
export type Eac3AtmosCodingMode =
  | "CODING_MODE_AUTO"
  | "CODING_MODE_5_1_4"
  | "CODING_MODE_7_1_4"
  | "CODING_MODE_9_1_6";
export const Eac3AtmosCodingMode = S.Literal(
  "CODING_MODE_AUTO",
  "CODING_MODE_5_1_4",
  "CODING_MODE_7_1_4",
  "CODING_MODE_9_1_6",
);
export type Eac3AtmosDialogueIntelligence = "ENABLED" | "DISABLED";
export const Eac3AtmosDialogueIntelligence = S.Literal("ENABLED", "DISABLED");
export type Eac3AtmosDownmixControl = "SPECIFIED" | "INITIALIZE_FROM_SOURCE";
export const Eac3AtmosDownmixControl = S.Literal(
  "SPECIFIED",
  "INITIALIZE_FROM_SOURCE",
);
export type Eac3AtmosDynamicRangeCompressionLine =
  | "NONE"
  | "FILM_STANDARD"
  | "FILM_LIGHT"
  | "MUSIC_STANDARD"
  | "MUSIC_LIGHT"
  | "SPEECH";
export const Eac3AtmosDynamicRangeCompressionLine = S.Literal(
  "NONE",
  "FILM_STANDARD",
  "FILM_LIGHT",
  "MUSIC_STANDARD",
  "MUSIC_LIGHT",
  "SPEECH",
);
export type Eac3AtmosDynamicRangeCompressionRf =
  | "NONE"
  | "FILM_STANDARD"
  | "FILM_LIGHT"
  | "MUSIC_STANDARD"
  | "MUSIC_LIGHT"
  | "SPEECH";
export const Eac3AtmosDynamicRangeCompressionRf = S.Literal(
  "NONE",
  "FILM_STANDARD",
  "FILM_LIGHT",
  "MUSIC_STANDARD",
  "MUSIC_LIGHT",
  "SPEECH",
);
export type Eac3AtmosDynamicRangeControl =
  | "SPECIFIED"
  | "INITIALIZE_FROM_SOURCE";
export const Eac3AtmosDynamicRangeControl = S.Literal(
  "SPECIFIED",
  "INITIALIZE_FROM_SOURCE",
);
export type Eac3AtmosMeteringMode =
  | "LEQ_A"
  | "ITU_BS_1770_1"
  | "ITU_BS_1770_2"
  | "ITU_BS_1770_3"
  | "ITU_BS_1770_4";
export const Eac3AtmosMeteringMode = S.Literal(
  "LEQ_A",
  "ITU_BS_1770_1",
  "ITU_BS_1770_2",
  "ITU_BS_1770_3",
  "ITU_BS_1770_4",
);
export type Eac3AtmosStereoDownmix =
  | "NOT_INDICATED"
  | "STEREO"
  | "SURROUND"
  | "DPL2";
export const Eac3AtmosStereoDownmix = S.Literal(
  "NOT_INDICATED",
  "STEREO",
  "SURROUND",
  "DPL2",
);
export type Eac3AtmosSurroundExMode = "NOT_INDICATED" | "ENABLED" | "DISABLED";
export const Eac3AtmosSurroundExMode = S.Literal(
  "NOT_INDICATED",
  "ENABLED",
  "DISABLED",
);
export interface Eac3AtmosSettings {
  Bitrate?: number;
  BitstreamMode?: Eac3AtmosBitstreamMode;
  CodingMode?: Eac3AtmosCodingMode;
  DialogueIntelligence?: Eac3AtmosDialogueIntelligence;
  DownmixControl?: Eac3AtmosDownmixControl;
  DynamicRangeCompressionLine?: Eac3AtmosDynamicRangeCompressionLine;
  DynamicRangeCompressionRf?: Eac3AtmosDynamicRangeCompressionRf;
  DynamicRangeControl?: Eac3AtmosDynamicRangeControl;
  LoRoCenterMixLevel?: number;
  LoRoSurroundMixLevel?: number;
  LtRtCenterMixLevel?: number;
  LtRtSurroundMixLevel?: number;
  MeteringMode?: Eac3AtmosMeteringMode;
  SampleRate?: number;
  SpeechThreshold?: number;
  StereoDownmix?: Eac3AtmosStereoDownmix;
  SurroundExMode?: Eac3AtmosSurroundExMode;
}
export const Eac3AtmosSettings = S.suspend(() =>
  S.Struct({
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    BitstreamMode: S.optional(Eac3AtmosBitstreamMode).pipe(
      T.JsonName("bitstreamMode"),
    ),
    CodingMode: S.optional(Eac3AtmosCodingMode).pipe(T.JsonName("codingMode")),
    DialogueIntelligence: S.optional(Eac3AtmosDialogueIntelligence).pipe(
      T.JsonName("dialogueIntelligence"),
    ),
    DownmixControl: S.optional(Eac3AtmosDownmixControl).pipe(
      T.JsonName("downmixControl"),
    ),
    DynamicRangeCompressionLine: S.optional(
      Eac3AtmosDynamicRangeCompressionLine,
    ).pipe(T.JsonName("dynamicRangeCompressionLine")),
    DynamicRangeCompressionRf: S.optional(
      Eac3AtmosDynamicRangeCompressionRf,
    ).pipe(T.JsonName("dynamicRangeCompressionRf")),
    DynamicRangeControl: S.optional(Eac3AtmosDynamicRangeControl).pipe(
      T.JsonName("dynamicRangeControl"),
    ),
    LoRoCenterMixLevel: S.optional(S.Number).pipe(
      T.JsonName("loRoCenterMixLevel"),
    ),
    LoRoSurroundMixLevel: S.optional(S.Number).pipe(
      T.JsonName("loRoSurroundMixLevel"),
    ),
    LtRtCenterMixLevel: S.optional(S.Number).pipe(
      T.JsonName("ltRtCenterMixLevel"),
    ),
    LtRtSurroundMixLevel: S.optional(S.Number).pipe(
      T.JsonName("ltRtSurroundMixLevel"),
    ),
    MeteringMode: S.optional(Eac3AtmosMeteringMode).pipe(
      T.JsonName("meteringMode"),
    ),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
    SpeechThreshold: S.optional(S.Number).pipe(T.JsonName("speechThreshold")),
    StereoDownmix: S.optional(Eac3AtmosStereoDownmix).pipe(
      T.JsonName("stereoDownmix"),
    ),
    SurroundExMode: S.optional(Eac3AtmosSurroundExMode).pipe(
      T.JsonName("surroundExMode"),
    ),
  }),
).annotations({
  identifier: "Eac3AtmosSettings",
}) as any as S.Schema<Eac3AtmosSettings>;
export type Eac3AttenuationControl = "ATTENUATE_3_DB" | "NONE";
export const Eac3AttenuationControl = S.Literal("ATTENUATE_3_DB", "NONE");
export type Eac3BitstreamMode =
  | "COMPLETE_MAIN"
  | "COMMENTARY"
  | "EMERGENCY"
  | "HEARING_IMPAIRED"
  | "VISUALLY_IMPAIRED";
export const Eac3BitstreamMode = S.Literal(
  "COMPLETE_MAIN",
  "COMMENTARY",
  "EMERGENCY",
  "HEARING_IMPAIRED",
  "VISUALLY_IMPAIRED",
);
export type Eac3CodingMode =
  | "CODING_MODE_1_0"
  | "CODING_MODE_2_0"
  | "CODING_MODE_3_2";
export const Eac3CodingMode = S.Literal(
  "CODING_MODE_1_0",
  "CODING_MODE_2_0",
  "CODING_MODE_3_2",
);
export type Eac3DcFilter = "ENABLED" | "DISABLED";
export const Eac3DcFilter = S.Literal("ENABLED", "DISABLED");
export type Eac3DynamicRangeCompressionLine =
  | "NONE"
  | "FILM_STANDARD"
  | "FILM_LIGHT"
  | "MUSIC_STANDARD"
  | "MUSIC_LIGHT"
  | "SPEECH";
export const Eac3DynamicRangeCompressionLine = S.Literal(
  "NONE",
  "FILM_STANDARD",
  "FILM_LIGHT",
  "MUSIC_STANDARD",
  "MUSIC_LIGHT",
  "SPEECH",
);
export type Eac3DynamicRangeCompressionRf =
  | "NONE"
  | "FILM_STANDARD"
  | "FILM_LIGHT"
  | "MUSIC_STANDARD"
  | "MUSIC_LIGHT"
  | "SPEECH";
export const Eac3DynamicRangeCompressionRf = S.Literal(
  "NONE",
  "FILM_STANDARD",
  "FILM_LIGHT",
  "MUSIC_STANDARD",
  "MUSIC_LIGHT",
  "SPEECH",
);
export type Eac3LfeControl = "LFE" | "NO_LFE";
export const Eac3LfeControl = S.Literal("LFE", "NO_LFE");
export type Eac3LfeFilter = "ENABLED" | "DISABLED";
export const Eac3LfeFilter = S.Literal("ENABLED", "DISABLED");
export type Eac3MetadataControl = "FOLLOW_INPUT" | "USE_CONFIGURED";
export const Eac3MetadataControl = S.Literal("FOLLOW_INPUT", "USE_CONFIGURED");
export type Eac3PassthroughControl = "WHEN_POSSIBLE" | "NO_PASSTHROUGH";
export const Eac3PassthroughControl = S.Literal(
  "WHEN_POSSIBLE",
  "NO_PASSTHROUGH",
);
export type Eac3PhaseControl = "SHIFT_90_DEGREES" | "NO_SHIFT";
export const Eac3PhaseControl = S.Literal("SHIFT_90_DEGREES", "NO_SHIFT");
export type Eac3StereoDownmix = "NOT_INDICATED" | "LO_RO" | "LT_RT" | "DPL2";
export const Eac3StereoDownmix = S.Literal(
  "NOT_INDICATED",
  "LO_RO",
  "LT_RT",
  "DPL2",
);
export type Eac3SurroundExMode = "NOT_INDICATED" | "ENABLED" | "DISABLED";
export const Eac3SurroundExMode = S.Literal(
  "NOT_INDICATED",
  "ENABLED",
  "DISABLED",
);
export type Eac3SurroundMode = "NOT_INDICATED" | "ENABLED" | "DISABLED";
export const Eac3SurroundMode = S.Literal(
  "NOT_INDICATED",
  "ENABLED",
  "DISABLED",
);
export interface Eac3Settings {
  AttenuationControl?: Eac3AttenuationControl;
  Bitrate?: number;
  BitstreamMode?: Eac3BitstreamMode;
  CodingMode?: Eac3CodingMode;
  DcFilter?: Eac3DcFilter;
  Dialnorm?: number;
  DynamicRangeCompressionLine?: Eac3DynamicRangeCompressionLine;
  DynamicRangeCompressionRf?: Eac3DynamicRangeCompressionRf;
  LfeControl?: Eac3LfeControl;
  LfeFilter?: Eac3LfeFilter;
  LoRoCenterMixLevel?: number;
  LoRoSurroundMixLevel?: number;
  LtRtCenterMixLevel?: number;
  LtRtSurroundMixLevel?: number;
  MetadataControl?: Eac3MetadataControl;
  PassthroughControl?: Eac3PassthroughControl;
  PhaseControl?: Eac3PhaseControl;
  SampleRate?: number;
  StereoDownmix?: Eac3StereoDownmix;
  SurroundExMode?: Eac3SurroundExMode;
  SurroundMode?: Eac3SurroundMode;
}
export const Eac3Settings = S.suspend(() =>
  S.Struct({
    AttenuationControl: S.optional(Eac3AttenuationControl).pipe(
      T.JsonName("attenuationControl"),
    ),
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    BitstreamMode: S.optional(Eac3BitstreamMode).pipe(
      T.JsonName("bitstreamMode"),
    ),
    CodingMode: S.optional(Eac3CodingMode).pipe(T.JsonName("codingMode")),
    DcFilter: S.optional(Eac3DcFilter).pipe(T.JsonName("dcFilter")),
    Dialnorm: S.optional(S.Number).pipe(T.JsonName("dialnorm")),
    DynamicRangeCompressionLine: S.optional(
      Eac3DynamicRangeCompressionLine,
    ).pipe(T.JsonName("dynamicRangeCompressionLine")),
    DynamicRangeCompressionRf: S.optional(Eac3DynamicRangeCompressionRf).pipe(
      T.JsonName("dynamicRangeCompressionRf"),
    ),
    LfeControl: S.optional(Eac3LfeControl).pipe(T.JsonName("lfeControl")),
    LfeFilter: S.optional(Eac3LfeFilter).pipe(T.JsonName("lfeFilter")),
    LoRoCenterMixLevel: S.optional(S.Number).pipe(
      T.JsonName("loRoCenterMixLevel"),
    ),
    LoRoSurroundMixLevel: S.optional(S.Number).pipe(
      T.JsonName("loRoSurroundMixLevel"),
    ),
    LtRtCenterMixLevel: S.optional(S.Number).pipe(
      T.JsonName("ltRtCenterMixLevel"),
    ),
    LtRtSurroundMixLevel: S.optional(S.Number).pipe(
      T.JsonName("ltRtSurroundMixLevel"),
    ),
    MetadataControl: S.optional(Eac3MetadataControl).pipe(
      T.JsonName("metadataControl"),
    ),
    PassthroughControl: S.optional(Eac3PassthroughControl).pipe(
      T.JsonName("passthroughControl"),
    ),
    PhaseControl: S.optional(Eac3PhaseControl).pipe(T.JsonName("phaseControl")),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
    StereoDownmix: S.optional(Eac3StereoDownmix).pipe(
      T.JsonName("stereoDownmix"),
    ),
    SurroundExMode: S.optional(Eac3SurroundExMode).pipe(
      T.JsonName("surroundExMode"),
    ),
    SurroundMode: S.optional(Eac3SurroundMode).pipe(T.JsonName("surroundMode")),
  }),
).annotations({ identifier: "Eac3Settings" }) as any as S.Schema<Eac3Settings>;
export interface FlacSettings {
  BitDepth?: number;
  Channels?: number;
  SampleRate?: number;
}
export const FlacSettings = S.suspend(() =>
  S.Struct({
    BitDepth: S.optional(S.Number).pipe(T.JsonName("bitDepth")),
    Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
  }),
).annotations({ identifier: "FlacSettings" }) as any as S.Schema<FlacSettings>;
export type Mp2AudioDescriptionMix = "BROADCASTER_MIXED_AD" | "NONE";
export const Mp2AudioDescriptionMix = S.Literal("BROADCASTER_MIXED_AD", "NONE");
export interface Mp2Settings {
  AudioDescriptionMix?: Mp2AudioDescriptionMix;
  Bitrate?: number;
  Channels?: number;
  SampleRate?: number;
}
export const Mp2Settings = S.suspend(() =>
  S.Struct({
    AudioDescriptionMix: S.optional(Mp2AudioDescriptionMix).pipe(
      T.JsonName("audioDescriptionMix"),
    ),
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
  }),
).annotations({ identifier: "Mp2Settings" }) as any as S.Schema<Mp2Settings>;
export type Mp3RateControlMode = "CBR" | "VBR";
export const Mp3RateControlMode = S.Literal("CBR", "VBR");
export interface Mp3Settings {
  Bitrate?: number;
  Channels?: number;
  RateControlMode?: Mp3RateControlMode;
  SampleRate?: number;
  VbrQuality?: number;
}
export const Mp3Settings = S.suspend(() =>
  S.Struct({
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
    RateControlMode: S.optional(Mp3RateControlMode).pipe(
      T.JsonName("rateControlMode"),
    ),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
    VbrQuality: S.optional(S.Number).pipe(T.JsonName("vbrQuality")),
  }),
).annotations({ identifier: "Mp3Settings" }) as any as S.Schema<Mp3Settings>;
export interface OpusSettings {
  Bitrate?: number;
  Channels?: number;
  SampleRate?: number;
}
export const OpusSettings = S.suspend(() =>
  S.Struct({
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
  }),
).annotations({ identifier: "OpusSettings" }) as any as S.Schema<OpusSettings>;
export interface VorbisSettings {
  Channels?: number;
  SampleRate?: number;
  VbrQuality?: number;
}
export const VorbisSettings = S.suspend(() =>
  S.Struct({
    Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
    VbrQuality: S.optional(S.Number).pipe(T.JsonName("vbrQuality")),
  }),
).annotations({
  identifier: "VorbisSettings",
}) as any as S.Schema<VorbisSettings>;
export type WavFormat = "RIFF" | "RF64" | "EXTENSIBLE";
export const WavFormat = S.Literal("RIFF", "RF64", "EXTENSIBLE");
export interface WavSettings {
  BitDepth?: number;
  Channels?: number;
  Format?: WavFormat;
  SampleRate?: number;
}
export const WavSettings = S.suspend(() =>
  S.Struct({
    BitDepth: S.optional(S.Number).pipe(T.JsonName("bitDepth")),
    Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
    Format: S.optional(WavFormat).pipe(T.JsonName("format")),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
  }),
).annotations({ identifier: "WavSettings" }) as any as S.Schema<WavSettings>;
export interface AudioCodecSettings {
  AacSettings?: AacSettings;
  Ac3Settings?: Ac3Settings;
  AiffSettings?: AiffSettings;
  Codec?: AudioCodec;
  Eac3AtmosSettings?: Eac3AtmosSettings;
  Eac3Settings?: Eac3Settings;
  FlacSettings?: FlacSettings;
  Mp2Settings?: Mp2Settings;
  Mp3Settings?: Mp3Settings;
  OpusSettings?: OpusSettings;
  VorbisSettings?: VorbisSettings;
  WavSettings?: WavSettings;
}
export const AudioCodecSettings = S.suspend(() =>
  S.Struct({
    AacSettings: S.optional(AacSettings)
      .pipe(T.JsonName("aacSettings"))
      .annotations({ identifier: "AacSettings" }),
    Ac3Settings: S.optional(Ac3Settings)
      .pipe(T.JsonName("ac3Settings"))
      .annotations({ identifier: "Ac3Settings" }),
    AiffSettings: S.optional(AiffSettings)
      .pipe(T.JsonName("aiffSettings"))
      .annotations({ identifier: "AiffSettings" }),
    Codec: S.optional(AudioCodec).pipe(T.JsonName("codec")),
    Eac3AtmosSettings: S.optional(Eac3AtmosSettings)
      .pipe(T.JsonName("eac3AtmosSettings"))
      .annotations({ identifier: "Eac3AtmosSettings" }),
    Eac3Settings: S.optional(Eac3Settings)
      .pipe(T.JsonName("eac3Settings"))
      .annotations({ identifier: "Eac3Settings" }),
    FlacSettings: S.optional(FlacSettings)
      .pipe(T.JsonName("flacSettings"))
      .annotations({ identifier: "FlacSettings" }),
    Mp2Settings: S.optional(Mp2Settings)
      .pipe(T.JsonName("mp2Settings"))
      .annotations({ identifier: "Mp2Settings" }),
    Mp3Settings: S.optional(Mp3Settings)
      .pipe(T.JsonName("mp3Settings"))
      .annotations({ identifier: "Mp3Settings" }),
    OpusSettings: S.optional(OpusSettings)
      .pipe(T.JsonName("opusSettings"))
      .annotations({ identifier: "OpusSettings" }),
    VorbisSettings: S.optional(VorbisSettings)
      .pipe(T.JsonName("vorbisSettings"))
      .annotations({ identifier: "VorbisSettings" }),
    WavSettings: S.optional(WavSettings)
      .pipe(T.JsonName("wavSettings"))
      .annotations({ identifier: "WavSettings" }),
  }),
).annotations({
  identifier: "AudioCodecSettings",
}) as any as S.Schema<AudioCodecSettings>;
export type AudioLanguageCodeControl = "FOLLOW_INPUT" | "USE_CONFIGURED";
export const AudioLanguageCodeControl = S.Literal(
  "FOLLOW_INPUT",
  "USE_CONFIGURED",
);
export interface AudioDescription {
  AudioChannelTaggingSettings?: AudioChannelTaggingSettings;
  AudioNormalizationSettings?: AudioNormalizationSettings;
  AudioPitchCorrectionSettings?: AudioPitchCorrectionSettings;
  AudioSourceName?: string;
  AudioType?: number;
  AudioTypeControl?: AudioTypeControl;
  CodecSettings?: AudioCodecSettings;
  CustomLanguageCode?: string;
  LanguageCode?: LanguageCode;
  LanguageCodeControl?: AudioLanguageCodeControl;
  RemixSettings?: RemixSettings;
  StreamName?: string;
}
export const AudioDescription = S.suspend(() =>
  S.Struct({
    AudioChannelTaggingSettings: S.optional(AudioChannelTaggingSettings)
      .pipe(T.JsonName("audioChannelTaggingSettings"))
      .annotations({ identifier: "AudioChannelTaggingSettings" }),
    AudioNormalizationSettings: S.optional(AudioNormalizationSettings)
      .pipe(T.JsonName("audioNormalizationSettings"))
      .annotations({ identifier: "AudioNormalizationSettings" }),
    AudioPitchCorrectionSettings: S.optional(AudioPitchCorrectionSettings)
      .pipe(T.JsonName("audioPitchCorrectionSettings"))
      .annotations({ identifier: "AudioPitchCorrectionSettings" }),
    AudioSourceName: S.optional(S.String).pipe(T.JsonName("audioSourceName")),
    AudioType: S.optional(S.Number).pipe(T.JsonName("audioType")),
    AudioTypeControl: S.optional(AudioTypeControl).pipe(
      T.JsonName("audioTypeControl"),
    ),
    CodecSettings: S.optional(AudioCodecSettings)
      .pipe(T.JsonName("codecSettings"))
      .annotations({ identifier: "AudioCodecSettings" }),
    CustomLanguageCode: S.optional(S.String).pipe(
      T.JsonName("customLanguageCode"),
    ),
    LanguageCode: S.optional(LanguageCode).pipe(T.JsonName("languageCode")),
    LanguageCodeControl: S.optional(AudioLanguageCodeControl).pipe(
      T.JsonName("languageCodeControl"),
    ),
    RemixSettings: S.optional(RemixSettings)
      .pipe(T.JsonName("remixSettings"))
      .annotations({ identifier: "RemixSettings" }),
    StreamName: S.optional(S.String).pipe(T.JsonName("streamName")),
  }),
).annotations({
  identifier: "AudioDescription",
}) as any as S.Schema<AudioDescription>;
export type __listOfAudioDescription = AudioDescription[];
export const __listOfAudioDescription = S.Array(AudioDescription);
export type BurninSubtitleAlignment = "CENTERED" | "LEFT" | "AUTO";
export const BurninSubtitleAlignment = S.Literal("CENTERED", "LEFT", "AUTO");
export type BurninSubtitleApplyFontColor = "WHITE_TEXT_ONLY" | "ALL_TEXT";
export const BurninSubtitleApplyFontColor = S.Literal(
  "WHITE_TEXT_ONLY",
  "ALL_TEXT",
);
export type BurninSubtitleBackgroundColor = "NONE" | "BLACK" | "WHITE" | "AUTO";
export const BurninSubtitleBackgroundColor = S.Literal(
  "NONE",
  "BLACK",
  "WHITE",
  "AUTO",
);
export type BurninSubtitleFallbackFont =
  | "BEST_MATCH"
  | "MONOSPACED_SANSSERIF"
  | "MONOSPACED_SERIF"
  | "PROPORTIONAL_SANSSERIF"
  | "PROPORTIONAL_SERIF";
export const BurninSubtitleFallbackFont = S.Literal(
  "BEST_MATCH",
  "MONOSPACED_SANSSERIF",
  "MONOSPACED_SERIF",
  "PROPORTIONAL_SANSSERIF",
  "PROPORTIONAL_SERIF",
);
export type BurninSubtitleFontColor =
  | "WHITE"
  | "BLACK"
  | "YELLOW"
  | "RED"
  | "GREEN"
  | "BLUE"
  | "HEX"
  | "AUTO";
export const BurninSubtitleFontColor = S.Literal(
  "WHITE",
  "BLACK",
  "YELLOW",
  "RED",
  "GREEN",
  "BLUE",
  "HEX",
  "AUTO",
);
export type FontScript = "AUTOMATIC" | "HANS" | "HANT";
export const FontScript = S.Literal("AUTOMATIC", "HANS", "HANT");
export type BurninSubtitleOutlineColor =
  | "BLACK"
  | "WHITE"
  | "YELLOW"
  | "RED"
  | "GREEN"
  | "BLUE"
  | "AUTO";
export const BurninSubtitleOutlineColor = S.Literal(
  "BLACK",
  "WHITE",
  "YELLOW",
  "RED",
  "GREEN",
  "BLUE",
  "AUTO",
);
export type RemoveRubyReserveAttributes = "DISABLED" | "ENABLED";
export const RemoveRubyReserveAttributes = S.Literal("DISABLED", "ENABLED");
export type BurninSubtitleShadowColor = "NONE" | "BLACK" | "WHITE" | "AUTO";
export const BurninSubtitleShadowColor = S.Literal(
  "NONE",
  "BLACK",
  "WHITE",
  "AUTO",
);
export type BurnInSubtitleStylePassthrough = "ENABLED" | "DISABLED";
export const BurnInSubtitleStylePassthrough = S.Literal("ENABLED", "DISABLED");
export type BurninSubtitleTeletextSpacing =
  | "FIXED_GRID"
  | "PROPORTIONAL"
  | "AUTO";
export const BurninSubtitleTeletextSpacing = S.Literal(
  "FIXED_GRID",
  "PROPORTIONAL",
  "AUTO",
);
export interface BurninDestinationSettings {
  Alignment?: BurninSubtitleAlignment;
  ApplyFontColor?: BurninSubtitleApplyFontColor;
  BackgroundColor?: BurninSubtitleBackgroundColor;
  BackgroundOpacity?: number;
  FallbackFont?: BurninSubtitleFallbackFont;
  FontColor?: BurninSubtitleFontColor;
  FontFileBold?: string;
  FontFileBoldItalic?: string;
  FontFileItalic?: string;
  FontFileRegular?: string;
  FontOpacity?: number;
  FontResolution?: number;
  FontScript?: FontScript;
  FontSize?: number;
  HexFontColor?: string;
  OutlineColor?: BurninSubtitleOutlineColor;
  OutlineSize?: number;
  RemoveRubyReserveAttributes?: RemoveRubyReserveAttributes;
  ShadowColor?: BurninSubtitleShadowColor;
  ShadowOpacity?: number;
  ShadowXOffset?: number;
  ShadowYOffset?: number;
  StylePassthrough?: BurnInSubtitleStylePassthrough;
  TeletextSpacing?: BurninSubtitleTeletextSpacing;
  XPosition?: number;
  YPosition?: number;
}
export const BurninDestinationSettings = S.suspend(() =>
  S.Struct({
    Alignment: S.optional(BurninSubtitleAlignment).pipe(
      T.JsonName("alignment"),
    ),
    ApplyFontColor: S.optional(BurninSubtitleApplyFontColor).pipe(
      T.JsonName("applyFontColor"),
    ),
    BackgroundColor: S.optional(BurninSubtitleBackgroundColor).pipe(
      T.JsonName("backgroundColor"),
    ),
    BackgroundOpacity: S.optional(S.Number).pipe(
      T.JsonName("backgroundOpacity"),
    ),
    FallbackFont: S.optional(BurninSubtitleFallbackFont).pipe(
      T.JsonName("fallbackFont"),
    ),
    FontColor: S.optional(BurninSubtitleFontColor).pipe(
      T.JsonName("fontColor"),
    ),
    FontFileBold: S.optional(S.String).pipe(T.JsonName("fontFileBold")),
    FontFileBoldItalic: S.optional(S.String).pipe(
      T.JsonName("fontFileBoldItalic"),
    ),
    FontFileItalic: S.optional(S.String).pipe(T.JsonName("fontFileItalic")),
    FontFileRegular: S.optional(S.String).pipe(T.JsonName("fontFileRegular")),
    FontOpacity: S.optional(S.Number).pipe(T.JsonName("fontOpacity")),
    FontResolution: S.optional(S.Number).pipe(T.JsonName("fontResolution")),
    FontScript: S.optional(FontScript).pipe(T.JsonName("fontScript")),
    FontSize: S.optional(S.Number).pipe(T.JsonName("fontSize")),
    HexFontColor: S.optional(S.String).pipe(T.JsonName("hexFontColor")),
    OutlineColor: S.optional(BurninSubtitleOutlineColor).pipe(
      T.JsonName("outlineColor"),
    ),
    OutlineSize: S.optional(S.Number).pipe(T.JsonName("outlineSize")),
    RemoveRubyReserveAttributes: S.optional(RemoveRubyReserveAttributes).pipe(
      T.JsonName("removeRubyReserveAttributes"),
    ),
    ShadowColor: S.optional(BurninSubtitleShadowColor).pipe(
      T.JsonName("shadowColor"),
    ),
    ShadowOpacity: S.optional(S.Number).pipe(T.JsonName("shadowOpacity")),
    ShadowXOffset: S.optional(S.Number).pipe(T.JsonName("shadowXOffset")),
    ShadowYOffset: S.optional(S.Number).pipe(T.JsonName("shadowYOffset")),
    StylePassthrough: S.optional(BurnInSubtitleStylePassthrough).pipe(
      T.JsonName("stylePassthrough"),
    ),
    TeletextSpacing: S.optional(BurninSubtitleTeletextSpacing).pipe(
      T.JsonName("teletextSpacing"),
    ),
    XPosition: S.optional(S.Number).pipe(T.JsonName("xPosition")),
    YPosition: S.optional(S.Number).pipe(T.JsonName("yPosition")),
  }),
).annotations({
  identifier: "BurninDestinationSettings",
}) as any as S.Schema<BurninDestinationSettings>;
export type CaptionDestinationType =
  | "BURN_IN"
  | "DVB_SUB"
  | "EMBEDDED"
  | "EMBEDDED_PLUS_SCTE20"
  | "IMSC"
  | "SCTE20_PLUS_EMBEDDED"
  | "SCC"
  | "SRT"
  | "SMI"
  | "TELETEXT"
  | "TTML"
  | "WEBVTT";
export const CaptionDestinationType = S.Literal(
  "BURN_IN",
  "DVB_SUB",
  "EMBEDDED",
  "EMBEDDED_PLUS_SCTE20",
  "IMSC",
  "SCTE20_PLUS_EMBEDDED",
  "SCC",
  "SRT",
  "SMI",
  "TELETEXT",
  "TTML",
  "WEBVTT",
);
export type DvbSubtitleAlignment = "CENTERED" | "LEFT" | "AUTO";
export const DvbSubtitleAlignment = S.Literal("CENTERED", "LEFT", "AUTO");
export type DvbSubtitleApplyFontColor = "WHITE_TEXT_ONLY" | "ALL_TEXT";
export const DvbSubtitleApplyFontColor = S.Literal(
  "WHITE_TEXT_ONLY",
  "ALL_TEXT",
);
export type DvbSubtitleBackgroundColor = "NONE" | "BLACK" | "WHITE" | "AUTO";
export const DvbSubtitleBackgroundColor = S.Literal(
  "NONE",
  "BLACK",
  "WHITE",
  "AUTO",
);
export type DvbddsHandling =
  | "NONE"
  | "SPECIFIED"
  | "NO_DISPLAY_WINDOW"
  | "SPECIFIED_OPTIMAL";
export const DvbddsHandling = S.Literal(
  "NONE",
  "SPECIFIED",
  "NO_DISPLAY_WINDOW",
  "SPECIFIED_OPTIMAL",
);
export type DvbSubSubtitleFallbackFont =
  | "BEST_MATCH"
  | "MONOSPACED_SANSSERIF"
  | "MONOSPACED_SERIF"
  | "PROPORTIONAL_SANSSERIF"
  | "PROPORTIONAL_SERIF";
export const DvbSubSubtitleFallbackFont = S.Literal(
  "BEST_MATCH",
  "MONOSPACED_SANSSERIF",
  "MONOSPACED_SERIF",
  "PROPORTIONAL_SANSSERIF",
  "PROPORTIONAL_SERIF",
);
export type DvbSubtitleFontColor =
  | "WHITE"
  | "BLACK"
  | "YELLOW"
  | "RED"
  | "GREEN"
  | "BLUE"
  | "HEX"
  | "AUTO";
export const DvbSubtitleFontColor = S.Literal(
  "WHITE",
  "BLACK",
  "YELLOW",
  "RED",
  "GREEN",
  "BLUE",
  "HEX",
  "AUTO",
);
export type DvbSubtitleOutlineColor =
  | "BLACK"
  | "WHITE"
  | "YELLOW"
  | "RED"
  | "GREEN"
  | "BLUE"
  | "AUTO";
export const DvbSubtitleOutlineColor = S.Literal(
  "BLACK",
  "WHITE",
  "YELLOW",
  "RED",
  "GREEN",
  "BLUE",
  "AUTO",
);
export type DvbSubtitleShadowColor = "NONE" | "BLACK" | "WHITE" | "AUTO";
export const DvbSubtitleShadowColor = S.Literal(
  "NONE",
  "BLACK",
  "WHITE",
  "AUTO",
);
export type DvbSubtitleStylePassthrough = "ENABLED" | "DISABLED";
export const DvbSubtitleStylePassthrough = S.Literal("ENABLED", "DISABLED");
export type DvbSubtitlingType = "HEARING_IMPAIRED" | "STANDARD";
export const DvbSubtitlingType = S.Literal("HEARING_IMPAIRED", "STANDARD");
export type DvbSubtitleTeletextSpacing = "FIXED_GRID" | "PROPORTIONAL" | "AUTO";
export const DvbSubtitleTeletextSpacing = S.Literal(
  "FIXED_GRID",
  "PROPORTIONAL",
  "AUTO",
);
export interface DvbSubDestinationSettings {
  Alignment?: DvbSubtitleAlignment;
  ApplyFontColor?: DvbSubtitleApplyFontColor;
  BackgroundColor?: DvbSubtitleBackgroundColor;
  BackgroundOpacity?: number;
  DdsHandling?: DvbddsHandling;
  DdsXCoordinate?: number;
  DdsYCoordinate?: number;
  FallbackFont?: DvbSubSubtitleFallbackFont;
  FontColor?: DvbSubtitleFontColor;
  FontFileBold?: string;
  FontFileBoldItalic?: string;
  FontFileItalic?: string;
  FontFileRegular?: string;
  FontOpacity?: number;
  FontResolution?: number;
  FontScript?: FontScript;
  FontSize?: number;
  Height?: number;
  HexFontColor?: string;
  OutlineColor?: DvbSubtitleOutlineColor;
  OutlineSize?: number;
  ShadowColor?: DvbSubtitleShadowColor;
  ShadowOpacity?: number;
  ShadowXOffset?: number;
  ShadowYOffset?: number;
  StylePassthrough?: DvbSubtitleStylePassthrough;
  SubtitlingType?: DvbSubtitlingType;
  TeletextSpacing?: DvbSubtitleTeletextSpacing;
  Width?: number;
  XPosition?: number;
  YPosition?: number;
}
export const DvbSubDestinationSettings = S.suspend(() =>
  S.Struct({
    Alignment: S.optional(DvbSubtitleAlignment).pipe(T.JsonName("alignment")),
    ApplyFontColor: S.optional(DvbSubtitleApplyFontColor).pipe(
      T.JsonName("applyFontColor"),
    ),
    BackgroundColor: S.optional(DvbSubtitleBackgroundColor).pipe(
      T.JsonName("backgroundColor"),
    ),
    BackgroundOpacity: S.optional(S.Number).pipe(
      T.JsonName("backgroundOpacity"),
    ),
    DdsHandling: S.optional(DvbddsHandling).pipe(T.JsonName("ddsHandling")),
    DdsXCoordinate: S.optional(S.Number).pipe(T.JsonName("ddsXCoordinate")),
    DdsYCoordinate: S.optional(S.Number).pipe(T.JsonName("ddsYCoordinate")),
    FallbackFont: S.optional(DvbSubSubtitleFallbackFont).pipe(
      T.JsonName("fallbackFont"),
    ),
    FontColor: S.optional(DvbSubtitleFontColor).pipe(T.JsonName("fontColor")),
    FontFileBold: S.optional(S.String).pipe(T.JsonName("fontFileBold")),
    FontFileBoldItalic: S.optional(S.String).pipe(
      T.JsonName("fontFileBoldItalic"),
    ),
    FontFileItalic: S.optional(S.String).pipe(T.JsonName("fontFileItalic")),
    FontFileRegular: S.optional(S.String).pipe(T.JsonName("fontFileRegular")),
    FontOpacity: S.optional(S.Number).pipe(T.JsonName("fontOpacity")),
    FontResolution: S.optional(S.Number).pipe(T.JsonName("fontResolution")),
    FontScript: S.optional(FontScript).pipe(T.JsonName("fontScript")),
    FontSize: S.optional(S.Number).pipe(T.JsonName("fontSize")),
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    HexFontColor: S.optional(S.String).pipe(T.JsonName("hexFontColor")),
    OutlineColor: S.optional(DvbSubtitleOutlineColor).pipe(
      T.JsonName("outlineColor"),
    ),
    OutlineSize: S.optional(S.Number).pipe(T.JsonName("outlineSize")),
    ShadowColor: S.optional(DvbSubtitleShadowColor).pipe(
      T.JsonName("shadowColor"),
    ),
    ShadowOpacity: S.optional(S.Number).pipe(T.JsonName("shadowOpacity")),
    ShadowXOffset: S.optional(S.Number).pipe(T.JsonName("shadowXOffset")),
    ShadowYOffset: S.optional(S.Number).pipe(T.JsonName("shadowYOffset")),
    StylePassthrough: S.optional(DvbSubtitleStylePassthrough).pipe(
      T.JsonName("stylePassthrough"),
    ),
    SubtitlingType: S.optional(DvbSubtitlingType).pipe(
      T.JsonName("subtitlingType"),
    ),
    TeletextSpacing: S.optional(DvbSubtitleTeletextSpacing).pipe(
      T.JsonName("teletextSpacing"),
    ),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
    XPosition: S.optional(S.Number).pipe(T.JsonName("xPosition")),
    YPosition: S.optional(S.Number).pipe(T.JsonName("yPosition")),
  }),
).annotations({
  identifier: "DvbSubDestinationSettings",
}) as any as S.Schema<DvbSubDestinationSettings>;
export interface EmbeddedDestinationSettings {
  Destination608ChannelNumber?: number;
  Destination708ServiceNumber?: number;
}
export const EmbeddedDestinationSettings = S.suspend(() =>
  S.Struct({
    Destination608ChannelNumber: S.optional(S.Number).pipe(
      T.JsonName("destination608ChannelNumber"),
    ),
    Destination708ServiceNumber: S.optional(S.Number).pipe(
      T.JsonName("destination708ServiceNumber"),
    ),
  }),
).annotations({
  identifier: "EmbeddedDestinationSettings",
}) as any as S.Schema<EmbeddedDestinationSettings>;
export type ImscAccessibilitySubs = "DISABLED" | "ENABLED";
export const ImscAccessibilitySubs = S.Literal("DISABLED", "ENABLED");
export type ImscStylePassthrough = "ENABLED" | "DISABLED";
export const ImscStylePassthrough = S.Literal("ENABLED", "DISABLED");
export interface ImscDestinationSettings {
  Accessibility?: ImscAccessibilitySubs;
  StylePassthrough?: ImscStylePassthrough;
}
export const ImscDestinationSettings = S.suspend(() =>
  S.Struct({
    Accessibility: S.optional(ImscAccessibilitySubs).pipe(
      T.JsonName("accessibility"),
    ),
    StylePassthrough: S.optional(ImscStylePassthrough).pipe(
      T.JsonName("stylePassthrough"),
    ),
  }),
).annotations({
  identifier: "ImscDestinationSettings",
}) as any as S.Schema<ImscDestinationSettings>;
export type SccDestinationFramerate =
  | "FRAMERATE_23_97"
  | "FRAMERATE_24"
  | "FRAMERATE_25"
  | "FRAMERATE_29_97_DROPFRAME"
  | "FRAMERATE_29_97_NON_DROPFRAME";
export const SccDestinationFramerate = S.Literal(
  "FRAMERATE_23_97",
  "FRAMERATE_24",
  "FRAMERATE_25",
  "FRAMERATE_29_97_DROPFRAME",
  "FRAMERATE_29_97_NON_DROPFRAME",
);
export interface SccDestinationSettings {
  Framerate?: SccDestinationFramerate;
}
export const SccDestinationSettings = S.suspend(() =>
  S.Struct({
    Framerate: S.optional(SccDestinationFramerate).pipe(
      T.JsonName("framerate"),
    ),
  }),
).annotations({
  identifier: "SccDestinationSettings",
}) as any as S.Schema<SccDestinationSettings>;
export type SrtStylePassthrough = "ENABLED" | "DISABLED";
export const SrtStylePassthrough = S.Literal("ENABLED", "DISABLED");
export interface SrtDestinationSettings {
  StylePassthrough?: SrtStylePassthrough;
}
export const SrtDestinationSettings = S.suspend(() =>
  S.Struct({
    StylePassthrough: S.optional(SrtStylePassthrough).pipe(
      T.JsonName("stylePassthrough"),
    ),
  }),
).annotations({
  identifier: "SrtDestinationSettings",
}) as any as S.Schema<SrtDestinationSettings>;
export type TeletextPageType =
  | "PAGE_TYPE_INITIAL"
  | "PAGE_TYPE_SUBTITLE"
  | "PAGE_TYPE_ADDL_INFO"
  | "PAGE_TYPE_PROGRAM_SCHEDULE"
  | "PAGE_TYPE_HEARING_IMPAIRED_SUBTITLE";
export const TeletextPageType = S.Literal(
  "PAGE_TYPE_INITIAL",
  "PAGE_TYPE_SUBTITLE",
  "PAGE_TYPE_ADDL_INFO",
  "PAGE_TYPE_PROGRAM_SCHEDULE",
  "PAGE_TYPE_HEARING_IMPAIRED_SUBTITLE",
);
export type __listOfTeletextPageType = TeletextPageType[];
export const __listOfTeletextPageType = S.Array(TeletextPageType);
export interface TeletextDestinationSettings {
  PageNumber?: string;
  PageTypes?: TeletextPageType[];
}
export const TeletextDestinationSettings = S.suspend(() =>
  S.Struct({
    PageNumber: S.optional(S.String).pipe(T.JsonName("pageNumber")),
    PageTypes: S.optional(__listOfTeletextPageType).pipe(
      T.JsonName("pageTypes"),
    ),
  }),
).annotations({
  identifier: "TeletextDestinationSettings",
}) as any as S.Schema<TeletextDestinationSettings>;
export type TtmlStylePassthrough = "ENABLED" | "DISABLED";
export const TtmlStylePassthrough = S.Literal("ENABLED", "DISABLED");
export interface TtmlDestinationSettings {
  StylePassthrough?: TtmlStylePassthrough;
}
export const TtmlDestinationSettings = S.suspend(() =>
  S.Struct({
    StylePassthrough: S.optional(TtmlStylePassthrough).pipe(
      T.JsonName("stylePassthrough"),
    ),
  }),
).annotations({
  identifier: "TtmlDestinationSettings",
}) as any as S.Schema<TtmlDestinationSettings>;
export type WebvttAccessibilitySubs = "DISABLED" | "ENABLED";
export const WebvttAccessibilitySubs = S.Literal("DISABLED", "ENABLED");
export type WebvttStylePassthrough =
  | "ENABLED"
  | "DISABLED"
  | "STRICT"
  | "MERGE";
export const WebvttStylePassthrough = S.Literal(
  "ENABLED",
  "DISABLED",
  "STRICT",
  "MERGE",
);
export interface WebvttDestinationSettings {
  Accessibility?: WebvttAccessibilitySubs;
  StylePassthrough?: WebvttStylePassthrough;
}
export const WebvttDestinationSettings = S.suspend(() =>
  S.Struct({
    Accessibility: S.optional(WebvttAccessibilitySubs).pipe(
      T.JsonName("accessibility"),
    ),
    StylePassthrough: S.optional(WebvttStylePassthrough).pipe(
      T.JsonName("stylePassthrough"),
    ),
  }),
).annotations({
  identifier: "WebvttDestinationSettings",
}) as any as S.Schema<WebvttDestinationSettings>;
export interface CaptionDestinationSettings {
  BurninDestinationSettings?: BurninDestinationSettings;
  DestinationType?: CaptionDestinationType;
  DvbSubDestinationSettings?: DvbSubDestinationSettings;
  EmbeddedDestinationSettings?: EmbeddedDestinationSettings;
  ImscDestinationSettings?: ImscDestinationSettings;
  SccDestinationSettings?: SccDestinationSettings;
  SrtDestinationSettings?: SrtDestinationSettings;
  TeletextDestinationSettings?: TeletextDestinationSettings;
  TtmlDestinationSettings?: TtmlDestinationSettings;
  WebvttDestinationSettings?: WebvttDestinationSettings;
}
export const CaptionDestinationSettings = S.suspend(() =>
  S.Struct({
    BurninDestinationSettings: S.optional(BurninDestinationSettings)
      .pipe(T.JsonName("burninDestinationSettings"))
      .annotations({ identifier: "BurninDestinationSettings" }),
    DestinationType: S.optional(CaptionDestinationType).pipe(
      T.JsonName("destinationType"),
    ),
    DvbSubDestinationSettings: S.optional(DvbSubDestinationSettings)
      .pipe(T.JsonName("dvbSubDestinationSettings"))
      .annotations({ identifier: "DvbSubDestinationSettings" }),
    EmbeddedDestinationSettings: S.optional(EmbeddedDestinationSettings)
      .pipe(T.JsonName("embeddedDestinationSettings"))
      .annotations({ identifier: "EmbeddedDestinationSettings" }),
    ImscDestinationSettings: S.optional(ImscDestinationSettings)
      .pipe(T.JsonName("imscDestinationSettings"))
      .annotations({ identifier: "ImscDestinationSettings" }),
    SccDestinationSettings: S.optional(SccDestinationSettings)
      .pipe(T.JsonName("sccDestinationSettings"))
      .annotations({ identifier: "SccDestinationSettings" }),
    SrtDestinationSettings: S.optional(SrtDestinationSettings)
      .pipe(T.JsonName("srtDestinationSettings"))
      .annotations({ identifier: "SrtDestinationSettings" }),
    TeletextDestinationSettings: S.optional(TeletextDestinationSettings)
      .pipe(T.JsonName("teletextDestinationSettings"))
      .annotations({ identifier: "TeletextDestinationSettings" }),
    TtmlDestinationSettings: S.optional(TtmlDestinationSettings)
      .pipe(T.JsonName("ttmlDestinationSettings"))
      .annotations({ identifier: "TtmlDestinationSettings" }),
    WebvttDestinationSettings: S.optional(WebvttDestinationSettings)
      .pipe(T.JsonName("webvttDestinationSettings"))
      .annotations({ identifier: "WebvttDestinationSettings" }),
  }),
).annotations({
  identifier: "CaptionDestinationSettings",
}) as any as S.Schema<CaptionDestinationSettings>;
export interface CaptionDescription {
  CaptionSelectorName?: string;
  CustomLanguageCode?: string;
  DestinationSettings?: CaptionDestinationSettings;
  LanguageCode?: LanguageCode;
  LanguageDescription?: string;
}
export const CaptionDescription = S.suspend(() =>
  S.Struct({
    CaptionSelectorName: S.optional(S.String).pipe(
      T.JsonName("captionSelectorName"),
    ),
    CustomLanguageCode: S.optional(S.String).pipe(
      T.JsonName("customLanguageCode"),
    ),
    DestinationSettings: S.optional(CaptionDestinationSettings)
      .pipe(T.JsonName("destinationSettings"))
      .annotations({ identifier: "CaptionDestinationSettings" }),
    LanguageCode: S.optional(LanguageCode).pipe(T.JsonName("languageCode")),
    LanguageDescription: S.optional(S.String).pipe(
      T.JsonName("languageDescription"),
    ),
  }),
).annotations({
  identifier: "CaptionDescription",
}) as any as S.Schema<CaptionDescription>;
export type __listOfCaptionDescription = CaptionDescription[];
export const __listOfCaptionDescription = S.Array(CaptionDescription);
export type CmfcAudioDuration =
  | "DEFAULT_CODEC_DURATION"
  | "MATCH_VIDEO_DURATION";
export const CmfcAudioDuration = S.Literal(
  "DEFAULT_CODEC_DURATION",
  "MATCH_VIDEO_DURATION",
);
export type CmfcAudioTrackType =
  | "ALTERNATE_AUDIO_AUTO_SELECT_DEFAULT"
  | "ALTERNATE_AUDIO_AUTO_SELECT"
  | "ALTERNATE_AUDIO_NOT_AUTO_SELECT"
  | "AUDIO_ONLY_VARIANT_STREAM";
export const CmfcAudioTrackType = S.Literal(
  "ALTERNATE_AUDIO_AUTO_SELECT_DEFAULT",
  "ALTERNATE_AUDIO_AUTO_SELECT",
  "ALTERNATE_AUDIO_NOT_AUTO_SELECT",
  "AUDIO_ONLY_VARIANT_STREAM",
);
export type CmfcC2paManifest = "INCLUDE" | "EXCLUDE";
export const CmfcC2paManifest = S.Literal("INCLUDE", "EXCLUDE");
export type CmfcDescriptiveVideoServiceFlag = "DONT_FLAG" | "FLAG";
export const CmfcDescriptiveVideoServiceFlag = S.Literal("DONT_FLAG", "FLAG");
export type CmfcIFrameOnlyManifest = "INCLUDE" | "EXCLUDE";
export const CmfcIFrameOnlyManifest = S.Literal("INCLUDE", "EXCLUDE");
export type CmfcKlvMetadata = "PASSTHROUGH" | "NONE";
export const CmfcKlvMetadata = S.Literal("PASSTHROUGH", "NONE");
export type CmfcManifestMetadataSignaling = "ENABLED" | "DISABLED";
export const CmfcManifestMetadataSignaling = S.Literal("ENABLED", "DISABLED");
export type CmfcScte35Esam = "INSERT" | "NONE";
export const CmfcScte35Esam = S.Literal("INSERT", "NONE");
export type CmfcScte35Source = "PASSTHROUGH" | "NONE";
export const CmfcScte35Source = S.Literal("PASSTHROUGH", "NONE");
export type CmfcTimedMetadata = "PASSTHROUGH" | "NONE";
export const CmfcTimedMetadata = S.Literal("PASSTHROUGH", "NONE");
export type CmfcTimedMetadataBoxVersion = "VERSION_0" | "VERSION_1";
export const CmfcTimedMetadataBoxVersion = S.Literal("VERSION_0", "VERSION_1");
export interface CmfcSettings {
  AudioDuration?: CmfcAudioDuration;
  AudioGroupId?: string;
  AudioRenditionSets?: string;
  AudioTrackType?: CmfcAudioTrackType;
  C2paManifest?: CmfcC2paManifest;
  CertificateSecret?: string;
  DescriptiveVideoServiceFlag?: CmfcDescriptiveVideoServiceFlag;
  IFrameOnlyManifest?: CmfcIFrameOnlyManifest;
  KlvMetadata?: CmfcKlvMetadata;
  ManifestMetadataSignaling?: CmfcManifestMetadataSignaling;
  Scte35Esam?: CmfcScte35Esam;
  Scte35Source?: CmfcScte35Source;
  SigningKmsKey?: string;
  TimedMetadata?: CmfcTimedMetadata;
  TimedMetadataBoxVersion?: CmfcTimedMetadataBoxVersion;
  TimedMetadataSchemeIdUri?: string;
  TimedMetadataValue?: string;
}
export const CmfcSettings = S.suspend(() =>
  S.Struct({
    AudioDuration: S.optional(CmfcAudioDuration).pipe(
      T.JsonName("audioDuration"),
    ),
    AudioGroupId: S.optional(S.String).pipe(T.JsonName("audioGroupId")),
    AudioRenditionSets: S.optional(S.String).pipe(
      T.JsonName("audioRenditionSets"),
    ),
    AudioTrackType: S.optional(CmfcAudioTrackType).pipe(
      T.JsonName("audioTrackType"),
    ),
    C2paManifest: S.optional(CmfcC2paManifest).pipe(T.JsonName("c2paManifest")),
    CertificateSecret: S.optional(S.String).pipe(
      T.JsonName("certificateSecret"),
    ),
    DescriptiveVideoServiceFlag: S.optional(
      CmfcDescriptiveVideoServiceFlag,
    ).pipe(T.JsonName("descriptiveVideoServiceFlag")),
    IFrameOnlyManifest: S.optional(CmfcIFrameOnlyManifest).pipe(
      T.JsonName("iFrameOnlyManifest"),
    ),
    KlvMetadata: S.optional(CmfcKlvMetadata).pipe(T.JsonName("klvMetadata")),
    ManifestMetadataSignaling: S.optional(CmfcManifestMetadataSignaling).pipe(
      T.JsonName("manifestMetadataSignaling"),
    ),
    Scte35Esam: S.optional(CmfcScte35Esam).pipe(T.JsonName("scte35Esam")),
    Scte35Source: S.optional(CmfcScte35Source).pipe(T.JsonName("scte35Source")),
    SigningKmsKey: S.optional(S.String).pipe(T.JsonName("signingKmsKey")),
    TimedMetadata: S.optional(CmfcTimedMetadata).pipe(
      T.JsonName("timedMetadata"),
    ),
    TimedMetadataBoxVersion: S.optional(CmfcTimedMetadataBoxVersion).pipe(
      T.JsonName("timedMetadataBoxVersion"),
    ),
    TimedMetadataSchemeIdUri: S.optional(S.String).pipe(
      T.JsonName("timedMetadataSchemeIdUri"),
    ),
    TimedMetadataValue: S.optional(S.String).pipe(
      T.JsonName("timedMetadataValue"),
    ),
  }),
).annotations({ identifier: "CmfcSettings" }) as any as S.Schema<CmfcSettings>;
export type ContainerType =
  | "F4V"
  | "GIF"
  | "ISMV"
  | "M2TS"
  | "M3U8"
  | "CMFC"
  | "MOV"
  | "MP4"
  | "MPD"
  | "MXF"
  | "OGG"
  | "WEBM"
  | "RAW"
  | "Y4M";
export const ContainerType = S.Literal(
  "F4V",
  "GIF",
  "ISMV",
  "M2TS",
  "M3U8",
  "CMFC",
  "MOV",
  "MP4",
  "MPD",
  "MXF",
  "OGG",
  "WEBM",
  "RAW",
  "Y4M",
);
export type F4vMoovPlacement = "PROGRESSIVE_DOWNLOAD" | "NORMAL";
export const F4vMoovPlacement = S.Literal("PROGRESSIVE_DOWNLOAD", "NORMAL");
export interface F4vSettings {
  MoovPlacement?: F4vMoovPlacement;
}
export const F4vSettings = S.suspend(() =>
  S.Struct({
    MoovPlacement: S.optional(F4vMoovPlacement).pipe(
      T.JsonName("moovPlacement"),
    ),
  }),
).annotations({ identifier: "F4vSettings" }) as any as S.Schema<F4vSettings>;
export type M2tsAudioBufferModel = "DVB" | "ATSC";
export const M2tsAudioBufferModel = S.Literal("DVB", "ATSC");
export type M2tsAudioDuration =
  | "DEFAULT_CODEC_DURATION"
  | "MATCH_VIDEO_DURATION";
export const M2tsAudioDuration = S.Literal(
  "DEFAULT_CODEC_DURATION",
  "MATCH_VIDEO_DURATION",
);
export type __listOf__integerMin32Max8182 = number[];
export const __listOf__integerMin32Max8182 = S.Array(S.Number);
export type M2tsBufferModel = "MULTIPLEX" | "NONE";
export const M2tsBufferModel = S.Literal("MULTIPLEX", "NONE");
export type M2tsDataPtsControl = "AUTO" | "ALIGN_TO_VIDEO";
export const M2tsDataPtsControl = S.Literal("AUTO", "ALIGN_TO_VIDEO");
export interface DvbNitSettings {
  NetworkId?: number;
  NetworkName?: string;
  NitInterval?: number;
}
export const DvbNitSettings = S.suspend(() =>
  S.Struct({
    NetworkId: S.optional(S.Number).pipe(T.JsonName("networkId")),
    NetworkName: S.optional(S.String).pipe(T.JsonName("networkName")),
    NitInterval: S.optional(S.Number).pipe(T.JsonName("nitInterval")),
  }),
).annotations({
  identifier: "DvbNitSettings",
}) as any as S.Schema<DvbNitSettings>;
export type OutputSdt =
  | "SDT_FOLLOW"
  | "SDT_FOLLOW_IF_PRESENT"
  | "SDT_MANUAL"
  | "SDT_NONE";
export const OutputSdt = S.Literal(
  "SDT_FOLLOW",
  "SDT_FOLLOW_IF_PRESENT",
  "SDT_MANUAL",
  "SDT_NONE",
);
export interface DvbSdtSettings {
  OutputSdt?: OutputSdt;
  SdtInterval?: number;
  ServiceName?: string;
  ServiceProviderName?: string;
}
export const DvbSdtSettings = S.suspend(() =>
  S.Struct({
    OutputSdt: S.optional(OutputSdt).pipe(T.JsonName("outputSdt")),
    SdtInterval: S.optional(S.Number).pipe(T.JsonName("sdtInterval")),
    ServiceName: S.optional(S.String).pipe(T.JsonName("serviceName")),
    ServiceProviderName: S.optional(S.String).pipe(
      T.JsonName("serviceProviderName"),
    ),
  }),
).annotations({
  identifier: "DvbSdtSettings",
}) as any as S.Schema<DvbSdtSettings>;
export interface DvbTdtSettings {
  TdtInterval?: number;
}
export const DvbTdtSettings = S.suspend(() =>
  S.Struct({
    TdtInterval: S.optional(S.Number).pipe(T.JsonName("tdtInterval")),
  }),
).annotations({
  identifier: "DvbTdtSettings",
}) as any as S.Schema<DvbTdtSettings>;
export type M2tsEbpAudioInterval =
  | "VIDEO_AND_FIXED_INTERVALS"
  | "VIDEO_INTERVAL";
export const M2tsEbpAudioInterval = S.Literal(
  "VIDEO_AND_FIXED_INTERVALS",
  "VIDEO_INTERVAL",
);
export type M2tsEbpPlacement = "VIDEO_AND_AUDIO_PIDS" | "VIDEO_PID";
export const M2tsEbpPlacement = S.Literal("VIDEO_AND_AUDIO_PIDS", "VIDEO_PID");
export type M2tsEsRateInPes = "INCLUDE" | "EXCLUDE";
export const M2tsEsRateInPes = S.Literal("INCLUDE", "EXCLUDE");
export type M2tsForceTsVideoEbpOrder = "FORCE" | "DEFAULT";
export const M2tsForceTsVideoEbpOrder = S.Literal("FORCE", "DEFAULT");
export type M2tsKlvMetadata = "PASSTHROUGH" | "NONE";
export const M2tsKlvMetadata = S.Literal("PASSTHROUGH", "NONE");
export type M2tsNielsenId3 = "INSERT" | "NONE";
export const M2tsNielsenId3 = S.Literal("INSERT", "NONE");
export type M2tsPcrControl = "PCR_EVERY_PES_PACKET" | "CONFIGURED_PCR_PERIOD";
export const M2tsPcrControl = S.Literal(
  "PCR_EVERY_PES_PACKET",
  "CONFIGURED_PCR_PERIOD",
);
export type M2tsPreventBufferUnderflow = "DISABLED" | "ENABLED";
export const M2tsPreventBufferUnderflow = S.Literal("DISABLED", "ENABLED");
export type TsPtsOffset = "AUTO" | "SECONDS" | "MILLISECONDS";
export const TsPtsOffset = S.Literal("AUTO", "SECONDS", "MILLISECONDS");
export type M2tsRateMode = "VBR" | "CBR";
export const M2tsRateMode = S.Literal("VBR", "CBR");
export interface M2tsScte35Esam {
  Scte35EsamPid?: number;
}
export const M2tsScte35Esam = S.suspend(() =>
  S.Struct({
    Scte35EsamPid: S.optional(S.Number).pipe(T.JsonName("scte35EsamPid")),
  }),
).annotations({
  identifier: "M2tsScte35Esam",
}) as any as S.Schema<M2tsScte35Esam>;
export type M2tsScte35Source = "PASSTHROUGH" | "NONE";
export const M2tsScte35Source = S.Literal("PASSTHROUGH", "NONE");
export type M2tsSegmentationMarkers =
  | "NONE"
  | "RAI_SEGSTART"
  | "RAI_ADAPT"
  | "PSI_SEGSTART"
  | "EBP"
  | "EBP_LEGACY";
export const M2tsSegmentationMarkers = S.Literal(
  "NONE",
  "RAI_SEGSTART",
  "RAI_ADAPT",
  "PSI_SEGSTART",
  "EBP",
  "EBP_LEGACY",
);
export type M2tsSegmentationStyle = "MAINTAIN_CADENCE" | "RESET_CADENCE";
export const M2tsSegmentationStyle = S.Literal(
  "MAINTAIN_CADENCE",
  "RESET_CADENCE",
);
export interface M2tsSettings {
  AudioBufferModel?: M2tsAudioBufferModel;
  AudioDuration?: M2tsAudioDuration;
  AudioFramesPerPes?: number;
  AudioPids?: number[];
  AudioPtsOffsetDelta?: number;
  Bitrate?: number;
  BufferModel?: M2tsBufferModel;
  DataPTSControl?: M2tsDataPtsControl;
  DvbNitSettings?: DvbNitSettings;
  DvbSdtSettings?: DvbSdtSettings;
  DvbSubPids?: number[];
  DvbTdtSettings?: DvbTdtSettings;
  DvbTeletextPid?: number;
  EbpAudioInterval?: M2tsEbpAudioInterval;
  EbpPlacement?: M2tsEbpPlacement;
  EsRateInPes?: M2tsEsRateInPes;
  ForceTsVideoEbpOrder?: M2tsForceTsVideoEbpOrder;
  FragmentTime?: number;
  KlvMetadata?: M2tsKlvMetadata;
  MaxPcrInterval?: number;
  MinEbpInterval?: number;
  NielsenId3?: M2tsNielsenId3;
  NullPacketBitrate?: number;
  PatInterval?: number;
  PcrControl?: M2tsPcrControl;
  PcrPid?: number;
  PmtInterval?: number;
  PmtPid?: number;
  PreventBufferUnderflow?: M2tsPreventBufferUnderflow;
  PrivateMetadataPid?: number;
  ProgramNumber?: number;
  PtsOffset?: number;
  PtsOffsetMode?: TsPtsOffset;
  RateMode?: M2tsRateMode;
  Scte35Esam?: M2tsScte35Esam;
  Scte35Pid?: number;
  Scte35Source?: M2tsScte35Source;
  SegmentationMarkers?: M2tsSegmentationMarkers;
  SegmentationStyle?: M2tsSegmentationStyle;
  SegmentationTime?: number;
  TimedMetadataPid?: number;
  TransportStreamId?: number;
  VideoPid?: number;
}
export const M2tsSettings = S.suspend(() =>
  S.Struct({
    AudioBufferModel: S.optional(M2tsAudioBufferModel).pipe(
      T.JsonName("audioBufferModel"),
    ),
    AudioDuration: S.optional(M2tsAudioDuration).pipe(
      T.JsonName("audioDuration"),
    ),
    AudioFramesPerPes: S.optional(S.Number).pipe(
      T.JsonName("audioFramesPerPes"),
    ),
    AudioPids: S.optional(__listOf__integerMin32Max8182).pipe(
      T.JsonName("audioPids"),
    ),
    AudioPtsOffsetDelta: S.optional(S.Number).pipe(
      T.JsonName("audioPtsOffsetDelta"),
    ),
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    BufferModel: S.optional(M2tsBufferModel).pipe(T.JsonName("bufferModel")),
    DataPTSControl: S.optional(M2tsDataPtsControl).pipe(
      T.JsonName("dataPTSControl"),
    ),
    DvbNitSettings: S.optional(DvbNitSettings)
      .pipe(T.JsonName("dvbNitSettings"))
      .annotations({ identifier: "DvbNitSettings" }),
    DvbSdtSettings: S.optional(DvbSdtSettings)
      .pipe(T.JsonName("dvbSdtSettings"))
      .annotations({ identifier: "DvbSdtSettings" }),
    DvbSubPids: S.optional(__listOf__integerMin32Max8182).pipe(
      T.JsonName("dvbSubPids"),
    ),
    DvbTdtSettings: S.optional(DvbTdtSettings)
      .pipe(T.JsonName("dvbTdtSettings"))
      .annotations({ identifier: "DvbTdtSettings" }),
    DvbTeletextPid: S.optional(S.Number).pipe(T.JsonName("dvbTeletextPid")),
    EbpAudioInterval: S.optional(M2tsEbpAudioInterval).pipe(
      T.JsonName("ebpAudioInterval"),
    ),
    EbpPlacement: S.optional(M2tsEbpPlacement).pipe(T.JsonName("ebpPlacement")),
    EsRateInPes: S.optional(M2tsEsRateInPes).pipe(T.JsonName("esRateInPes")),
    ForceTsVideoEbpOrder: S.optional(M2tsForceTsVideoEbpOrder).pipe(
      T.JsonName("forceTsVideoEbpOrder"),
    ),
    FragmentTime: S.optional(S.Number).pipe(T.JsonName("fragmentTime")),
    KlvMetadata: S.optional(M2tsKlvMetadata).pipe(T.JsonName("klvMetadata")),
    MaxPcrInterval: S.optional(S.Number).pipe(T.JsonName("maxPcrInterval")),
    MinEbpInterval: S.optional(S.Number).pipe(T.JsonName("minEbpInterval")),
    NielsenId3: S.optional(M2tsNielsenId3).pipe(T.JsonName("nielsenId3")),
    NullPacketBitrate: S.optional(S.Number).pipe(
      T.JsonName("nullPacketBitrate"),
    ),
    PatInterval: S.optional(S.Number).pipe(T.JsonName("patInterval")),
    PcrControl: S.optional(M2tsPcrControl).pipe(T.JsonName("pcrControl")),
    PcrPid: S.optional(S.Number).pipe(T.JsonName("pcrPid")),
    PmtInterval: S.optional(S.Number).pipe(T.JsonName("pmtInterval")),
    PmtPid: S.optional(S.Number).pipe(T.JsonName("pmtPid")),
    PreventBufferUnderflow: S.optional(M2tsPreventBufferUnderflow).pipe(
      T.JsonName("preventBufferUnderflow"),
    ),
    PrivateMetadataPid: S.optional(S.Number).pipe(
      T.JsonName("privateMetadataPid"),
    ),
    ProgramNumber: S.optional(S.Number).pipe(T.JsonName("programNumber")),
    PtsOffset: S.optional(S.Number).pipe(T.JsonName("ptsOffset")),
    PtsOffsetMode: S.optional(TsPtsOffset).pipe(T.JsonName("ptsOffsetMode")),
    RateMode: S.optional(M2tsRateMode).pipe(T.JsonName("rateMode")),
    Scte35Esam: S.optional(M2tsScte35Esam)
      .pipe(T.JsonName("scte35Esam"))
      .annotations({ identifier: "M2tsScte35Esam" }),
    Scte35Pid: S.optional(S.Number).pipe(T.JsonName("scte35Pid")),
    Scte35Source: S.optional(M2tsScte35Source).pipe(T.JsonName("scte35Source")),
    SegmentationMarkers: S.optional(M2tsSegmentationMarkers).pipe(
      T.JsonName("segmentationMarkers"),
    ),
    SegmentationStyle: S.optional(M2tsSegmentationStyle).pipe(
      T.JsonName("segmentationStyle"),
    ),
    SegmentationTime: S.optional(S.Number).pipe(T.JsonName("segmentationTime")),
    TimedMetadataPid: S.optional(S.Number).pipe(T.JsonName("timedMetadataPid")),
    TransportStreamId: S.optional(S.Number).pipe(
      T.JsonName("transportStreamId"),
    ),
    VideoPid: S.optional(S.Number).pipe(T.JsonName("videoPid")),
  }),
).annotations({ identifier: "M2tsSettings" }) as any as S.Schema<M2tsSettings>;
export type M3u8AudioDuration =
  | "DEFAULT_CODEC_DURATION"
  | "MATCH_VIDEO_DURATION";
export const M3u8AudioDuration = S.Literal(
  "DEFAULT_CODEC_DURATION",
  "MATCH_VIDEO_DURATION",
);
export type M3u8DataPtsControl = "AUTO" | "ALIGN_TO_VIDEO";
export const M3u8DataPtsControl = S.Literal("AUTO", "ALIGN_TO_VIDEO");
export type M3u8NielsenId3 = "INSERT" | "NONE";
export const M3u8NielsenId3 = S.Literal("INSERT", "NONE");
export type M3u8PcrControl = "PCR_EVERY_PES_PACKET" | "CONFIGURED_PCR_PERIOD";
export const M3u8PcrControl = S.Literal(
  "PCR_EVERY_PES_PACKET",
  "CONFIGURED_PCR_PERIOD",
);
export type M3u8Scte35Source = "PASSTHROUGH" | "NONE";
export const M3u8Scte35Source = S.Literal("PASSTHROUGH", "NONE");
export type TimedMetadata = "PASSTHROUGH" | "NONE";
export const TimedMetadata = S.Literal("PASSTHROUGH", "NONE");
export interface M3u8Settings {
  AudioDuration?: M3u8AudioDuration;
  AudioFramesPerPes?: number;
  AudioPids?: number[];
  AudioPtsOffsetDelta?: number;
  DataPTSControl?: M3u8DataPtsControl;
  MaxPcrInterval?: number;
  NielsenId3?: M3u8NielsenId3;
  PatInterval?: number;
  PcrControl?: M3u8PcrControl;
  PcrPid?: number;
  PmtInterval?: number;
  PmtPid?: number;
  PrivateMetadataPid?: number;
  ProgramNumber?: number;
  PtsOffset?: number;
  PtsOffsetMode?: TsPtsOffset;
  Scte35Pid?: number;
  Scte35Source?: M3u8Scte35Source;
  TimedMetadata?: TimedMetadata;
  TimedMetadataPid?: number;
  TransportStreamId?: number;
  VideoPid?: number;
}
export const M3u8Settings = S.suspend(() =>
  S.Struct({
    AudioDuration: S.optional(M3u8AudioDuration).pipe(
      T.JsonName("audioDuration"),
    ),
    AudioFramesPerPes: S.optional(S.Number).pipe(
      T.JsonName("audioFramesPerPes"),
    ),
    AudioPids: S.optional(__listOf__integerMin32Max8182).pipe(
      T.JsonName("audioPids"),
    ),
    AudioPtsOffsetDelta: S.optional(S.Number).pipe(
      T.JsonName("audioPtsOffsetDelta"),
    ),
    DataPTSControl: S.optional(M3u8DataPtsControl).pipe(
      T.JsonName("dataPTSControl"),
    ),
    MaxPcrInterval: S.optional(S.Number).pipe(T.JsonName("maxPcrInterval")),
    NielsenId3: S.optional(M3u8NielsenId3).pipe(T.JsonName("nielsenId3")),
    PatInterval: S.optional(S.Number).pipe(T.JsonName("patInterval")),
    PcrControl: S.optional(M3u8PcrControl).pipe(T.JsonName("pcrControl")),
    PcrPid: S.optional(S.Number).pipe(T.JsonName("pcrPid")),
    PmtInterval: S.optional(S.Number).pipe(T.JsonName("pmtInterval")),
    PmtPid: S.optional(S.Number).pipe(T.JsonName("pmtPid")),
    PrivateMetadataPid: S.optional(S.Number).pipe(
      T.JsonName("privateMetadataPid"),
    ),
    ProgramNumber: S.optional(S.Number).pipe(T.JsonName("programNumber")),
    PtsOffset: S.optional(S.Number).pipe(T.JsonName("ptsOffset")),
    PtsOffsetMode: S.optional(TsPtsOffset).pipe(T.JsonName("ptsOffsetMode")),
    Scte35Pid: S.optional(S.Number).pipe(T.JsonName("scte35Pid")),
    Scte35Source: S.optional(M3u8Scte35Source).pipe(T.JsonName("scte35Source")),
    TimedMetadata: S.optional(TimedMetadata).pipe(T.JsonName("timedMetadata")),
    TimedMetadataPid: S.optional(S.Number).pipe(T.JsonName("timedMetadataPid")),
    TransportStreamId: S.optional(S.Number).pipe(
      T.JsonName("transportStreamId"),
    ),
    VideoPid: S.optional(S.Number).pipe(T.JsonName("videoPid")),
  }),
).annotations({ identifier: "M3u8Settings" }) as any as S.Schema<M3u8Settings>;
export type MovClapAtom = "INCLUDE" | "EXCLUDE";
export const MovClapAtom = S.Literal("INCLUDE", "EXCLUDE");
export type MovCslgAtom = "INCLUDE" | "EXCLUDE";
export const MovCslgAtom = S.Literal("INCLUDE", "EXCLUDE");
export type MovMpeg2FourCCControl = "XDCAM" | "MPEG";
export const MovMpeg2FourCCControl = S.Literal("XDCAM", "MPEG");
export type MovPaddingControl = "OMNEON" | "NONE";
export const MovPaddingControl = S.Literal("OMNEON", "NONE");
export type MovReference = "SELF_CONTAINED" | "EXTERNAL";
export const MovReference = S.Literal("SELF_CONTAINED", "EXTERNAL");
export interface MovSettings {
  ClapAtom?: MovClapAtom;
  CslgAtom?: MovCslgAtom;
  Mpeg2FourCCControl?: MovMpeg2FourCCControl;
  PaddingControl?: MovPaddingControl;
  Reference?: MovReference;
}
export const MovSettings = S.suspend(() =>
  S.Struct({
    ClapAtom: S.optional(MovClapAtom).pipe(T.JsonName("clapAtom")),
    CslgAtom: S.optional(MovCslgAtom).pipe(T.JsonName("cslgAtom")),
    Mpeg2FourCCControl: S.optional(MovMpeg2FourCCControl).pipe(
      T.JsonName("mpeg2FourCCControl"),
    ),
    PaddingControl: S.optional(MovPaddingControl).pipe(
      T.JsonName("paddingControl"),
    ),
    Reference: S.optional(MovReference).pipe(T.JsonName("reference")),
  }),
).annotations({ identifier: "MovSettings" }) as any as S.Schema<MovSettings>;
export type Mp4C2paManifest = "INCLUDE" | "EXCLUDE";
export const Mp4C2paManifest = S.Literal("INCLUDE", "EXCLUDE");
export type Mp4CslgAtom = "INCLUDE" | "EXCLUDE";
export const Mp4CslgAtom = S.Literal("INCLUDE", "EXCLUDE");
export type Mp4FreeSpaceBox = "INCLUDE" | "EXCLUDE";
export const Mp4FreeSpaceBox = S.Literal("INCLUDE", "EXCLUDE");
export type Mp4MoovPlacement = "PROGRESSIVE_DOWNLOAD" | "NORMAL";
export const Mp4MoovPlacement = S.Literal("PROGRESSIVE_DOWNLOAD", "NORMAL");
export interface Mp4Settings {
  AudioDuration?: CmfcAudioDuration;
  C2paManifest?: Mp4C2paManifest;
  CertificateSecret?: string;
  CslgAtom?: Mp4CslgAtom;
  CttsVersion?: number;
  FreeSpaceBox?: Mp4FreeSpaceBox;
  MoovPlacement?: Mp4MoovPlacement;
  Mp4MajorBrand?: string;
  SigningKmsKey?: string;
}
export const Mp4Settings = S.suspend(() =>
  S.Struct({
    AudioDuration: S.optional(CmfcAudioDuration).pipe(
      T.JsonName("audioDuration"),
    ),
    C2paManifest: S.optional(Mp4C2paManifest).pipe(T.JsonName("c2paManifest")),
    CertificateSecret: S.optional(S.String).pipe(
      T.JsonName("certificateSecret"),
    ),
    CslgAtom: S.optional(Mp4CslgAtom).pipe(T.JsonName("cslgAtom")),
    CttsVersion: S.optional(S.Number).pipe(T.JsonName("cttsVersion")),
    FreeSpaceBox: S.optional(Mp4FreeSpaceBox).pipe(T.JsonName("freeSpaceBox")),
    MoovPlacement: S.optional(Mp4MoovPlacement).pipe(
      T.JsonName("moovPlacement"),
    ),
    Mp4MajorBrand: S.optional(S.String).pipe(T.JsonName("mp4MajorBrand")),
    SigningKmsKey: S.optional(S.String).pipe(T.JsonName("signingKmsKey")),
  }),
).annotations({ identifier: "Mp4Settings" }) as any as S.Schema<Mp4Settings>;
export type MpdAccessibilityCaptionHints = "INCLUDE" | "EXCLUDE";
export const MpdAccessibilityCaptionHints = S.Literal("INCLUDE", "EXCLUDE");
export type MpdAudioDuration =
  | "DEFAULT_CODEC_DURATION"
  | "MATCH_VIDEO_DURATION";
export const MpdAudioDuration = S.Literal(
  "DEFAULT_CODEC_DURATION",
  "MATCH_VIDEO_DURATION",
);
export type MpdC2paManifest = "INCLUDE" | "EXCLUDE";
export const MpdC2paManifest = S.Literal("INCLUDE", "EXCLUDE");
export type MpdCaptionContainerType = "RAW" | "FRAGMENTED_MP4";
export const MpdCaptionContainerType = S.Literal("RAW", "FRAGMENTED_MP4");
export type MpdKlvMetadata = "NONE" | "PASSTHROUGH";
export const MpdKlvMetadata = S.Literal("NONE", "PASSTHROUGH");
export type MpdManifestMetadataSignaling = "ENABLED" | "DISABLED";
export const MpdManifestMetadataSignaling = S.Literal("ENABLED", "DISABLED");
export type MpdScte35Esam = "INSERT" | "NONE";
export const MpdScte35Esam = S.Literal("INSERT", "NONE");
export type MpdScte35Source = "PASSTHROUGH" | "NONE";
export const MpdScte35Source = S.Literal("PASSTHROUGH", "NONE");
export type MpdTimedMetadata = "PASSTHROUGH" | "NONE";
export const MpdTimedMetadata = S.Literal("PASSTHROUGH", "NONE");
export type MpdTimedMetadataBoxVersion = "VERSION_0" | "VERSION_1";
export const MpdTimedMetadataBoxVersion = S.Literal("VERSION_0", "VERSION_1");
export interface MpdSettings {
  AccessibilityCaptionHints?: MpdAccessibilityCaptionHints;
  AudioDuration?: MpdAudioDuration;
  C2paManifest?: MpdC2paManifest;
  CaptionContainerType?: MpdCaptionContainerType;
  CertificateSecret?: string;
  KlvMetadata?: MpdKlvMetadata;
  ManifestMetadataSignaling?: MpdManifestMetadataSignaling;
  Scte35Esam?: MpdScte35Esam;
  Scte35Source?: MpdScte35Source;
  SigningKmsKey?: string;
  TimedMetadata?: MpdTimedMetadata;
  TimedMetadataBoxVersion?: MpdTimedMetadataBoxVersion;
  TimedMetadataSchemeIdUri?: string;
  TimedMetadataValue?: string;
}
export const MpdSettings = S.suspend(() =>
  S.Struct({
    AccessibilityCaptionHints: S.optional(MpdAccessibilityCaptionHints).pipe(
      T.JsonName("accessibilityCaptionHints"),
    ),
    AudioDuration: S.optional(MpdAudioDuration).pipe(
      T.JsonName("audioDuration"),
    ),
    C2paManifest: S.optional(MpdC2paManifest).pipe(T.JsonName("c2paManifest")),
    CaptionContainerType: S.optional(MpdCaptionContainerType).pipe(
      T.JsonName("captionContainerType"),
    ),
    CertificateSecret: S.optional(S.String).pipe(
      T.JsonName("certificateSecret"),
    ),
    KlvMetadata: S.optional(MpdKlvMetadata).pipe(T.JsonName("klvMetadata")),
    ManifestMetadataSignaling: S.optional(MpdManifestMetadataSignaling).pipe(
      T.JsonName("manifestMetadataSignaling"),
    ),
    Scte35Esam: S.optional(MpdScte35Esam).pipe(T.JsonName("scte35Esam")),
    Scte35Source: S.optional(MpdScte35Source).pipe(T.JsonName("scte35Source")),
    SigningKmsKey: S.optional(S.String).pipe(T.JsonName("signingKmsKey")),
    TimedMetadata: S.optional(MpdTimedMetadata).pipe(
      T.JsonName("timedMetadata"),
    ),
    TimedMetadataBoxVersion: S.optional(MpdTimedMetadataBoxVersion).pipe(
      T.JsonName("timedMetadataBoxVersion"),
    ),
    TimedMetadataSchemeIdUri: S.optional(S.String).pipe(
      T.JsonName("timedMetadataSchemeIdUri"),
    ),
    TimedMetadataValue: S.optional(S.String).pipe(
      T.JsonName("timedMetadataValue"),
    ),
  }),
).annotations({ identifier: "MpdSettings" }) as any as S.Schema<MpdSettings>;
export type MxfAfdSignaling = "NO_COPY" | "COPY_FROM_VIDEO";
export const MxfAfdSignaling = S.Literal("NO_COPY", "COPY_FROM_VIDEO");
export type MxfProfile = "D_10" | "XDCAM" | "OP1A" | "XAVC" | "XDCAM_RDD9";
export const MxfProfile = S.Literal(
  "D_10",
  "XDCAM",
  "OP1A",
  "XAVC",
  "XDCAM_RDD9",
);
export type MxfXavcDurationMode =
  | "ALLOW_ANY_DURATION"
  | "DROP_FRAMES_FOR_COMPLIANCE";
export const MxfXavcDurationMode = S.Literal(
  "ALLOW_ANY_DURATION",
  "DROP_FRAMES_FOR_COMPLIANCE",
);
export interface MxfXavcProfileSettings {
  DurationMode?: MxfXavcDurationMode;
  MaxAncDataSize?: number;
}
export const MxfXavcProfileSettings = S.suspend(() =>
  S.Struct({
    DurationMode: S.optional(MxfXavcDurationMode).pipe(
      T.JsonName("durationMode"),
    ),
    MaxAncDataSize: S.optional(S.Number).pipe(T.JsonName("maxAncDataSize")),
  }),
).annotations({
  identifier: "MxfXavcProfileSettings",
}) as any as S.Schema<MxfXavcProfileSettings>;
export interface MxfSettings {
  AfdSignaling?: MxfAfdSignaling;
  Profile?: MxfProfile;
  XavcProfileSettings?: MxfXavcProfileSettings;
}
export const MxfSettings = S.suspend(() =>
  S.Struct({
    AfdSignaling: S.optional(MxfAfdSignaling).pipe(T.JsonName("afdSignaling")),
    Profile: S.optional(MxfProfile).pipe(T.JsonName("profile")),
    XavcProfileSettings: S.optional(MxfXavcProfileSettings)
      .pipe(T.JsonName("xavcProfileSettings"))
      .annotations({ identifier: "MxfXavcProfileSettings" }),
  }),
).annotations({ identifier: "MxfSettings" }) as any as S.Schema<MxfSettings>;
export interface ContainerSettings {
  CmfcSettings?: CmfcSettings;
  Container?: ContainerType;
  F4vSettings?: F4vSettings;
  M2tsSettings?: M2tsSettings;
  M3u8Settings?: M3u8Settings;
  MovSettings?: MovSettings;
  Mp4Settings?: Mp4Settings;
  MpdSettings?: MpdSettings;
  MxfSettings?: MxfSettings;
}
export const ContainerSettings = S.suspend(() =>
  S.Struct({
    CmfcSettings: S.optional(CmfcSettings)
      .pipe(T.JsonName("cmfcSettings"))
      .annotations({ identifier: "CmfcSettings" }),
    Container: S.optional(ContainerType).pipe(T.JsonName("container")),
    F4vSettings: S.optional(F4vSettings)
      .pipe(T.JsonName("f4vSettings"))
      .annotations({ identifier: "F4vSettings" }),
    M2tsSettings: S.optional(M2tsSettings)
      .pipe(T.JsonName("m2tsSettings"))
      .annotations({ identifier: "M2tsSettings" }),
    M3u8Settings: S.optional(M3u8Settings)
      .pipe(T.JsonName("m3u8Settings"))
      .annotations({ identifier: "M3u8Settings" }),
    MovSettings: S.optional(MovSettings)
      .pipe(T.JsonName("movSettings"))
      .annotations({ identifier: "MovSettings" }),
    Mp4Settings: S.optional(Mp4Settings)
      .pipe(T.JsonName("mp4Settings"))
      .annotations({ identifier: "Mp4Settings" }),
    MpdSettings: S.optional(MpdSettings)
      .pipe(T.JsonName("mpdSettings"))
      .annotations({ identifier: "MpdSettings" }),
    MxfSettings: S.optional(MxfSettings)
      .pipe(T.JsonName("mxfSettings"))
      .annotations({ identifier: "MxfSettings" }),
  }),
).annotations({
  identifier: "ContainerSettings",
}) as any as S.Schema<ContainerSettings>;
export type HlsAudioOnlyContainer = "AUTOMATIC" | "M2TS";
export const HlsAudioOnlyContainer = S.Literal("AUTOMATIC", "M2TS");
export type HlsAudioTrackType =
  | "ALTERNATE_AUDIO_AUTO_SELECT_DEFAULT"
  | "ALTERNATE_AUDIO_AUTO_SELECT"
  | "ALTERNATE_AUDIO_NOT_AUTO_SELECT"
  | "AUDIO_ONLY_VARIANT_STREAM";
export const HlsAudioTrackType = S.Literal(
  "ALTERNATE_AUDIO_AUTO_SELECT_DEFAULT",
  "ALTERNATE_AUDIO_AUTO_SELECT",
  "ALTERNATE_AUDIO_NOT_AUTO_SELECT",
  "AUDIO_ONLY_VARIANT_STREAM",
);
export type HlsDescriptiveVideoServiceFlag = "DONT_FLAG" | "FLAG";
export const HlsDescriptiveVideoServiceFlag = S.Literal("DONT_FLAG", "FLAG");
export type HlsIFrameOnlyManifest = "INCLUDE" | "INCLUDE_AS_TS" | "EXCLUDE";
export const HlsIFrameOnlyManifest = S.Literal(
  "INCLUDE",
  "INCLUDE_AS_TS",
  "EXCLUDE",
);
export interface HlsSettings {
  AudioGroupId?: string;
  AudioOnlyContainer?: HlsAudioOnlyContainer;
  AudioRenditionSets?: string;
  AudioTrackType?: HlsAudioTrackType;
  DescriptiveVideoServiceFlag?: HlsDescriptiveVideoServiceFlag;
  IFrameOnlyManifest?: HlsIFrameOnlyManifest;
  SegmentModifier?: string;
}
export const HlsSettings = S.suspend(() =>
  S.Struct({
    AudioGroupId: S.optional(S.String).pipe(T.JsonName("audioGroupId")),
    AudioOnlyContainer: S.optional(HlsAudioOnlyContainer).pipe(
      T.JsonName("audioOnlyContainer"),
    ),
    AudioRenditionSets: S.optional(S.String).pipe(
      T.JsonName("audioRenditionSets"),
    ),
    AudioTrackType: S.optional(HlsAudioTrackType).pipe(
      T.JsonName("audioTrackType"),
    ),
    DescriptiveVideoServiceFlag: S.optional(
      HlsDescriptiveVideoServiceFlag,
    ).pipe(T.JsonName("descriptiveVideoServiceFlag")),
    IFrameOnlyManifest: S.optional(HlsIFrameOnlyManifest).pipe(
      T.JsonName("iFrameOnlyManifest"),
    ),
    SegmentModifier: S.optional(S.String).pipe(T.JsonName("segmentModifier")),
  }),
).annotations({ identifier: "HlsSettings" }) as any as S.Schema<HlsSettings>;
export interface OutputSettings {
  HlsSettings?: HlsSettings;
}
export const OutputSettings = S.suspend(() =>
  S.Struct({
    HlsSettings: S.optional(HlsSettings)
      .pipe(T.JsonName("hlsSettings"))
      .annotations({ identifier: "HlsSettings" }),
  }),
).annotations({
  identifier: "OutputSettings",
}) as any as S.Schema<OutputSettings>;
export type AfdSignaling = "NONE" | "AUTO" | "FIXED";
export const AfdSignaling = S.Literal("NONE", "AUTO", "FIXED");
export type AntiAlias = "DISABLED" | "ENABLED";
export const AntiAlias = S.Literal("DISABLED", "ENABLED");
export type ChromaPositionMode = "AUTO" | "FORCE_CENTER" | "FORCE_TOP_LEFT";
export const ChromaPositionMode = S.Literal(
  "AUTO",
  "FORCE_CENTER",
  "FORCE_TOP_LEFT",
);
export type Av1AdaptiveQuantization =
  | "OFF"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "HIGHER"
  | "MAX";
export const Av1AdaptiveQuantization = S.Literal(
  "OFF",
  "LOW",
  "MEDIUM",
  "HIGH",
  "HIGHER",
  "MAX",
);
export type Av1BitDepth = "BIT_8" | "BIT_10";
export const Av1BitDepth = S.Literal("BIT_8", "BIT_10");
export type Av1FilmGrainSynthesis = "DISABLED" | "ENABLED";
export const Av1FilmGrainSynthesis = S.Literal("DISABLED", "ENABLED");
export type Av1FramerateControl = "INITIALIZE_FROM_SOURCE" | "SPECIFIED";
export const Av1FramerateControl = S.Literal(
  "INITIALIZE_FROM_SOURCE",
  "SPECIFIED",
);
export type Av1FramerateConversionAlgorithm =
  | "DUPLICATE_DROP"
  | "INTERPOLATE"
  | "FRAMEFORMER"
  | "MAINTAIN_FRAME_COUNT";
export const Av1FramerateConversionAlgorithm = S.Literal(
  "DUPLICATE_DROP",
  "INTERPOLATE",
  "FRAMEFORMER",
  "MAINTAIN_FRAME_COUNT",
);
export interface Av1QvbrSettings {
  QvbrQualityLevel?: number;
  QvbrQualityLevelFineTune?: number;
}
export const Av1QvbrSettings = S.suspend(() =>
  S.Struct({
    QvbrQualityLevel: S.optional(S.Number).pipe(T.JsonName("qvbrQualityLevel")),
    QvbrQualityLevelFineTune: S.optional(S.Number).pipe(
      T.JsonName("qvbrQualityLevelFineTune"),
    ),
  }),
).annotations({
  identifier: "Av1QvbrSettings",
}) as any as S.Schema<Av1QvbrSettings>;
export type Av1RateControlMode = "QVBR";
export const Av1RateControlMode = S.Literal("QVBR");
export type Av1SpatialAdaptiveQuantization = "DISABLED" | "ENABLED";
export const Av1SpatialAdaptiveQuantization = S.Literal("DISABLED", "ENABLED");
export interface Av1Settings {
  AdaptiveQuantization?: Av1AdaptiveQuantization;
  BitDepth?: Av1BitDepth;
  FilmGrainSynthesis?: Av1FilmGrainSynthesis;
  FramerateControl?: Av1FramerateControl;
  FramerateConversionAlgorithm?: Av1FramerateConversionAlgorithm;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  GopSize?: number;
  MaxBitrate?: number;
  NumberBFramesBetweenReferenceFrames?: number;
  PerFrameMetrics?: FrameMetricType[];
  QvbrSettings?: Av1QvbrSettings;
  RateControlMode?: Av1RateControlMode;
  Slices?: number;
  SpatialAdaptiveQuantization?: Av1SpatialAdaptiveQuantization;
}
export const Av1Settings = S.suspend(() =>
  S.Struct({
    AdaptiveQuantization: S.optional(Av1AdaptiveQuantization).pipe(
      T.JsonName("adaptiveQuantization"),
    ),
    BitDepth: S.optional(Av1BitDepth).pipe(T.JsonName("bitDepth")),
    FilmGrainSynthesis: S.optional(Av1FilmGrainSynthesis).pipe(
      T.JsonName("filmGrainSynthesis"),
    ),
    FramerateControl: S.optional(Av1FramerateControl).pipe(
      T.JsonName("framerateControl"),
    ),
    FramerateConversionAlgorithm: S.optional(
      Av1FramerateConversionAlgorithm,
    ).pipe(T.JsonName("framerateConversionAlgorithm")),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    GopSize: S.optional(S.Number).pipe(T.JsonName("gopSize")),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    NumberBFramesBetweenReferenceFrames: S.optional(S.Number).pipe(
      T.JsonName("numberBFramesBetweenReferenceFrames"),
    ),
    PerFrameMetrics: S.optional(__listOfFrameMetricType).pipe(
      T.JsonName("perFrameMetrics"),
    ),
    QvbrSettings: S.optional(Av1QvbrSettings)
      .pipe(T.JsonName("qvbrSettings"))
      .annotations({ identifier: "Av1QvbrSettings" }),
    RateControlMode: S.optional(Av1RateControlMode).pipe(
      T.JsonName("rateControlMode"),
    ),
    Slices: S.optional(S.Number).pipe(T.JsonName("slices")),
    SpatialAdaptiveQuantization: S.optional(
      Av1SpatialAdaptiveQuantization,
    ).pipe(T.JsonName("spatialAdaptiveQuantization")),
  }),
).annotations({ identifier: "Av1Settings" }) as any as S.Schema<Av1Settings>;
export type AvcIntraClass =
  | "CLASS_50"
  | "CLASS_100"
  | "CLASS_200"
  | "CLASS_4K_2K";
export const AvcIntraClass = S.Literal(
  "CLASS_50",
  "CLASS_100",
  "CLASS_200",
  "CLASS_4K_2K",
);
export type AvcIntraUhdQualityTuningLevel = "SINGLE_PASS" | "MULTI_PASS";
export const AvcIntraUhdQualityTuningLevel = S.Literal(
  "SINGLE_PASS",
  "MULTI_PASS",
);
export interface AvcIntraUhdSettings {
  QualityTuningLevel?: AvcIntraUhdQualityTuningLevel;
}
export const AvcIntraUhdSettings = S.suspend(() =>
  S.Struct({
    QualityTuningLevel: S.optional(AvcIntraUhdQualityTuningLevel).pipe(
      T.JsonName("qualityTuningLevel"),
    ),
  }),
).annotations({
  identifier: "AvcIntraUhdSettings",
}) as any as S.Schema<AvcIntraUhdSettings>;
export type AvcIntraFramerateControl = "INITIALIZE_FROM_SOURCE" | "SPECIFIED";
export const AvcIntraFramerateControl = S.Literal(
  "INITIALIZE_FROM_SOURCE",
  "SPECIFIED",
);
export type AvcIntraFramerateConversionAlgorithm =
  | "DUPLICATE_DROP"
  | "INTERPOLATE"
  | "FRAMEFORMER"
  | "MAINTAIN_FRAME_COUNT";
export const AvcIntraFramerateConversionAlgorithm = S.Literal(
  "DUPLICATE_DROP",
  "INTERPOLATE",
  "FRAMEFORMER",
  "MAINTAIN_FRAME_COUNT",
);
export type AvcIntraInterlaceMode =
  | "PROGRESSIVE"
  | "TOP_FIELD"
  | "BOTTOM_FIELD"
  | "FOLLOW_TOP_FIELD"
  | "FOLLOW_BOTTOM_FIELD";
export const AvcIntraInterlaceMode = S.Literal(
  "PROGRESSIVE",
  "TOP_FIELD",
  "BOTTOM_FIELD",
  "FOLLOW_TOP_FIELD",
  "FOLLOW_BOTTOM_FIELD",
);
export type AvcIntraScanTypeConversionMode =
  | "INTERLACED"
  | "INTERLACED_OPTIMIZE";
export const AvcIntraScanTypeConversionMode = S.Literal(
  "INTERLACED",
  "INTERLACED_OPTIMIZE",
);
export type AvcIntraSlowPal = "DISABLED" | "ENABLED";
export const AvcIntraSlowPal = S.Literal("DISABLED", "ENABLED");
export type AvcIntraTelecine = "NONE" | "HARD";
export const AvcIntraTelecine = S.Literal("NONE", "HARD");
export interface AvcIntraSettings {
  AvcIntraClass?: AvcIntraClass;
  AvcIntraUhdSettings?: AvcIntraUhdSettings;
  FramerateControl?: AvcIntraFramerateControl;
  FramerateConversionAlgorithm?: AvcIntraFramerateConversionAlgorithm;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  InterlaceMode?: AvcIntraInterlaceMode;
  PerFrameMetrics?: FrameMetricType[];
  ScanTypeConversionMode?: AvcIntraScanTypeConversionMode;
  SlowPal?: AvcIntraSlowPal;
  Telecine?: AvcIntraTelecine;
}
export const AvcIntraSettings = S.suspend(() =>
  S.Struct({
    AvcIntraClass: S.optional(AvcIntraClass).pipe(T.JsonName("avcIntraClass")),
    AvcIntraUhdSettings: S.optional(AvcIntraUhdSettings)
      .pipe(T.JsonName("avcIntraUhdSettings"))
      .annotations({ identifier: "AvcIntraUhdSettings" }),
    FramerateControl: S.optional(AvcIntraFramerateControl).pipe(
      T.JsonName("framerateControl"),
    ),
    FramerateConversionAlgorithm: S.optional(
      AvcIntraFramerateConversionAlgorithm,
    ).pipe(T.JsonName("framerateConversionAlgorithm")),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    InterlaceMode: S.optional(AvcIntraInterlaceMode).pipe(
      T.JsonName("interlaceMode"),
    ),
    PerFrameMetrics: S.optional(__listOfFrameMetricType).pipe(
      T.JsonName("perFrameMetrics"),
    ),
    ScanTypeConversionMode: S.optional(AvcIntraScanTypeConversionMode).pipe(
      T.JsonName("scanTypeConversionMode"),
    ),
    SlowPal: S.optional(AvcIntraSlowPal).pipe(T.JsonName("slowPal")),
    Telecine: S.optional(AvcIntraTelecine).pipe(T.JsonName("telecine")),
  }),
).annotations({
  identifier: "AvcIntraSettings",
}) as any as S.Schema<AvcIntraSettings>;
export type VideoCodec =
  | "AV1"
  | "AVC_INTRA"
  | "FRAME_CAPTURE"
  | "GIF"
  | "H_264"
  | "H_265"
  | "MPEG2"
  | "PASSTHROUGH"
  | "PRORES"
  | "UNCOMPRESSED"
  | "VC3"
  | "VP8"
  | "VP9"
  | "XAVC";
export const VideoCodec = S.Literal(
  "AV1",
  "AVC_INTRA",
  "FRAME_CAPTURE",
  "GIF",
  "H_264",
  "H_265",
  "MPEG2",
  "PASSTHROUGH",
  "PRORES",
  "UNCOMPRESSED",
  "VC3",
  "VP8",
  "VP9",
  "XAVC",
);
export interface FrameCaptureSettings {
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  MaxCaptures?: number;
  Quality?: number;
}
export const FrameCaptureSettings = S.suspend(() =>
  S.Struct({
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    MaxCaptures: S.optional(S.Number).pipe(T.JsonName("maxCaptures")),
    Quality: S.optional(S.Number).pipe(T.JsonName("quality")),
  }),
).annotations({
  identifier: "FrameCaptureSettings",
}) as any as S.Schema<FrameCaptureSettings>;
export type GifFramerateControl = "INITIALIZE_FROM_SOURCE" | "SPECIFIED";
export const GifFramerateControl = S.Literal(
  "INITIALIZE_FROM_SOURCE",
  "SPECIFIED",
);
export type GifFramerateConversionAlgorithm = "DUPLICATE_DROP" | "INTERPOLATE";
export const GifFramerateConversionAlgorithm = S.Literal(
  "DUPLICATE_DROP",
  "INTERPOLATE",
);
export interface GifSettings {
  FramerateControl?: GifFramerateControl;
  FramerateConversionAlgorithm?: GifFramerateConversionAlgorithm;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
}
export const GifSettings = S.suspend(() =>
  S.Struct({
    FramerateControl: S.optional(GifFramerateControl).pipe(
      T.JsonName("framerateControl"),
    ),
    FramerateConversionAlgorithm: S.optional(
      GifFramerateConversionAlgorithm,
    ).pipe(T.JsonName("framerateConversionAlgorithm")),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
  }),
).annotations({ identifier: "GifSettings" }) as any as S.Schema<GifSettings>;
export type H264AdaptiveQuantization =
  | "OFF"
  | "AUTO"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "HIGHER"
  | "MAX";
export const H264AdaptiveQuantization = S.Literal(
  "OFF",
  "AUTO",
  "LOW",
  "MEDIUM",
  "HIGH",
  "HIGHER",
  "MAX",
);
export type BandwidthReductionFilterSharpening =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "OFF";
export const BandwidthReductionFilterSharpening = S.Literal(
  "LOW",
  "MEDIUM",
  "HIGH",
  "OFF",
);
export type BandwidthReductionFilterStrength =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "AUTO"
  | "OFF";
export const BandwidthReductionFilterStrength = S.Literal(
  "LOW",
  "MEDIUM",
  "HIGH",
  "AUTO",
  "OFF",
);
export interface BandwidthReductionFilter {
  Sharpening?: BandwidthReductionFilterSharpening;
  Strength?: BandwidthReductionFilterStrength;
}
export const BandwidthReductionFilter = S.suspend(() =>
  S.Struct({
    Sharpening: S.optional(BandwidthReductionFilterSharpening).pipe(
      T.JsonName("sharpening"),
    ),
    Strength: S.optional(BandwidthReductionFilterStrength).pipe(
      T.JsonName("strength"),
    ),
  }),
).annotations({
  identifier: "BandwidthReductionFilter",
}) as any as S.Schema<BandwidthReductionFilter>;
export type H264CodecLevel =
  | "AUTO"
  | "LEVEL_1"
  | "LEVEL_1_1"
  | "LEVEL_1_2"
  | "LEVEL_1_3"
  | "LEVEL_2"
  | "LEVEL_2_1"
  | "LEVEL_2_2"
  | "LEVEL_3"
  | "LEVEL_3_1"
  | "LEVEL_3_2"
  | "LEVEL_4"
  | "LEVEL_4_1"
  | "LEVEL_4_2"
  | "LEVEL_5"
  | "LEVEL_5_1"
  | "LEVEL_5_2";
export const H264CodecLevel = S.Literal(
  "AUTO",
  "LEVEL_1",
  "LEVEL_1_1",
  "LEVEL_1_2",
  "LEVEL_1_3",
  "LEVEL_2",
  "LEVEL_2_1",
  "LEVEL_2_2",
  "LEVEL_3",
  "LEVEL_3_1",
  "LEVEL_3_2",
  "LEVEL_4",
  "LEVEL_4_1",
  "LEVEL_4_2",
  "LEVEL_5",
  "LEVEL_5_1",
  "LEVEL_5_2",
);
export type H264CodecProfile =
  | "BASELINE"
  | "HIGH"
  | "HIGH_10BIT"
  | "HIGH_422"
  | "HIGH_422_10BIT"
  | "MAIN";
export const H264CodecProfile = S.Literal(
  "BASELINE",
  "HIGH",
  "HIGH_10BIT",
  "HIGH_422",
  "HIGH_422_10BIT",
  "MAIN",
);
export type H264DynamicSubGop = "ADAPTIVE" | "STATIC";
export const H264DynamicSubGop = S.Literal("ADAPTIVE", "STATIC");
export type H264EndOfStreamMarkers = "INCLUDE" | "SUPPRESS";
export const H264EndOfStreamMarkers = S.Literal("INCLUDE", "SUPPRESS");
export type H264EntropyEncoding = "CABAC" | "CAVLC";
export const H264EntropyEncoding = S.Literal("CABAC", "CAVLC");
export type H264FieldEncoding = "PAFF" | "FORCE_FIELD" | "MBAFF";
export const H264FieldEncoding = S.Literal("PAFF", "FORCE_FIELD", "MBAFF");
export type H264FlickerAdaptiveQuantization = "DISABLED" | "ENABLED";
export const H264FlickerAdaptiveQuantization = S.Literal("DISABLED", "ENABLED");
export type H264FramerateControl = "INITIALIZE_FROM_SOURCE" | "SPECIFIED";
export const H264FramerateControl = S.Literal(
  "INITIALIZE_FROM_SOURCE",
  "SPECIFIED",
);
export type H264FramerateConversionAlgorithm =
  | "DUPLICATE_DROP"
  | "INTERPOLATE"
  | "FRAMEFORMER"
  | "MAINTAIN_FRAME_COUNT";
export const H264FramerateConversionAlgorithm = S.Literal(
  "DUPLICATE_DROP",
  "INTERPOLATE",
  "FRAMEFORMER",
  "MAINTAIN_FRAME_COUNT",
);
export type H264GopBReference = "DISABLED" | "ENABLED";
export const H264GopBReference = S.Literal("DISABLED", "ENABLED");
export type H264GopSizeUnits = "FRAMES" | "SECONDS" | "AUTO";
export const H264GopSizeUnits = S.Literal("FRAMES", "SECONDS", "AUTO");
export type H264InterlaceMode =
  | "PROGRESSIVE"
  | "TOP_FIELD"
  | "BOTTOM_FIELD"
  | "FOLLOW_TOP_FIELD"
  | "FOLLOW_BOTTOM_FIELD";
export const H264InterlaceMode = S.Literal(
  "PROGRESSIVE",
  "TOP_FIELD",
  "BOTTOM_FIELD",
  "FOLLOW_TOP_FIELD",
  "FOLLOW_BOTTOM_FIELD",
);
export type H264ParControl = "INITIALIZE_FROM_SOURCE" | "SPECIFIED";
export const H264ParControl = S.Literal("INITIALIZE_FROM_SOURCE", "SPECIFIED");
export type H264QualityTuningLevel =
  | "SINGLE_PASS"
  | "SINGLE_PASS_HQ"
  | "MULTI_PASS_HQ";
export const H264QualityTuningLevel = S.Literal(
  "SINGLE_PASS",
  "SINGLE_PASS_HQ",
  "MULTI_PASS_HQ",
);
export interface H264QvbrSettings {
  MaxAverageBitrate?: number;
  QvbrQualityLevel?: number;
  QvbrQualityLevelFineTune?: number;
}
export const H264QvbrSettings = S.suspend(() =>
  S.Struct({
    MaxAverageBitrate: S.optional(S.Number).pipe(
      T.JsonName("maxAverageBitrate"),
    ),
    QvbrQualityLevel: S.optional(S.Number).pipe(T.JsonName("qvbrQualityLevel")),
    QvbrQualityLevelFineTune: S.optional(S.Number).pipe(
      T.JsonName("qvbrQualityLevelFineTune"),
    ),
  }),
).annotations({
  identifier: "H264QvbrSettings",
}) as any as S.Schema<H264QvbrSettings>;
export type H264RateControlMode = "VBR" | "CBR" | "QVBR";
export const H264RateControlMode = S.Literal("VBR", "CBR", "QVBR");
export type H264RepeatPps = "DISABLED" | "ENABLED";
export const H264RepeatPps = S.Literal("DISABLED", "ENABLED");
export type H264SaliencyAwareEncoding = "DISABLED" | "PREFERRED";
export const H264SaliencyAwareEncoding = S.Literal("DISABLED", "PREFERRED");
export type H264ScanTypeConversionMode = "INTERLACED" | "INTERLACED_OPTIMIZE";
export const H264ScanTypeConversionMode = S.Literal(
  "INTERLACED",
  "INTERLACED_OPTIMIZE",
);
export type H264SceneChangeDetect =
  | "DISABLED"
  | "ENABLED"
  | "TRANSITION_DETECTION";
export const H264SceneChangeDetect = S.Literal(
  "DISABLED",
  "ENABLED",
  "TRANSITION_DETECTION",
);
export type H264SlowPal = "DISABLED" | "ENABLED";
export const H264SlowPal = S.Literal("DISABLED", "ENABLED");
export type H264SpatialAdaptiveQuantization = "DISABLED" | "ENABLED";
export const H264SpatialAdaptiveQuantization = S.Literal("DISABLED", "ENABLED");
export type H264Syntax = "DEFAULT" | "RP2027";
export const H264Syntax = S.Literal("DEFAULT", "RP2027");
export type H264Telecine = "NONE" | "SOFT" | "HARD";
export const H264Telecine = S.Literal("NONE", "SOFT", "HARD");
export type H264TemporalAdaptiveQuantization = "DISABLED" | "ENABLED";
export const H264TemporalAdaptiveQuantization = S.Literal(
  "DISABLED",
  "ENABLED",
);
export type H264UnregisteredSeiTimecode = "DISABLED" | "ENABLED";
export const H264UnregisteredSeiTimecode = S.Literal("DISABLED", "ENABLED");
export type H264WriteMp4PackagingType = "AVC1" | "AVC3";
export const H264WriteMp4PackagingType = S.Literal("AVC1", "AVC3");
export interface H264Settings {
  AdaptiveQuantization?: H264AdaptiveQuantization;
  BandwidthReductionFilter?: BandwidthReductionFilter;
  Bitrate?: number;
  CodecLevel?: H264CodecLevel;
  CodecProfile?: H264CodecProfile;
  DynamicSubGop?: H264DynamicSubGop;
  EndOfStreamMarkers?: H264EndOfStreamMarkers;
  EntropyEncoding?: H264EntropyEncoding;
  FieldEncoding?: H264FieldEncoding;
  FlickerAdaptiveQuantization?: H264FlickerAdaptiveQuantization;
  FramerateControl?: H264FramerateControl;
  FramerateConversionAlgorithm?: H264FramerateConversionAlgorithm;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  GopBReference?: H264GopBReference;
  GopClosedCadence?: number;
  GopSize?: number;
  GopSizeUnits?: H264GopSizeUnits;
  HrdBufferFinalFillPercentage?: number;
  HrdBufferInitialFillPercentage?: number;
  HrdBufferSize?: number;
  InterlaceMode?: H264InterlaceMode;
  MaxBitrate?: number;
  MinIInterval?: number;
  NumberBFramesBetweenReferenceFrames?: number;
  NumberReferenceFrames?: number;
  ParControl?: H264ParControl;
  ParDenominator?: number;
  ParNumerator?: number;
  PerFrameMetrics?: FrameMetricType[];
  QualityTuningLevel?: H264QualityTuningLevel;
  QvbrSettings?: H264QvbrSettings;
  RateControlMode?: H264RateControlMode;
  RepeatPps?: H264RepeatPps;
  SaliencyAwareEncoding?: H264SaliencyAwareEncoding;
  ScanTypeConversionMode?: H264ScanTypeConversionMode;
  SceneChangeDetect?: H264SceneChangeDetect;
  Slices?: number;
  SlowPal?: H264SlowPal;
  Softness?: number;
  SpatialAdaptiveQuantization?: H264SpatialAdaptiveQuantization;
  Syntax?: H264Syntax;
  Telecine?: H264Telecine;
  TemporalAdaptiveQuantization?: H264TemporalAdaptiveQuantization;
  UnregisteredSeiTimecode?: H264UnregisteredSeiTimecode;
  WriteMp4PackagingType?: H264WriteMp4PackagingType;
}
export const H264Settings = S.suspend(() =>
  S.Struct({
    AdaptiveQuantization: S.optional(H264AdaptiveQuantization).pipe(
      T.JsonName("adaptiveQuantization"),
    ),
    BandwidthReductionFilter: S.optional(BandwidthReductionFilter)
      .pipe(T.JsonName("bandwidthReductionFilter"))
      .annotations({ identifier: "BandwidthReductionFilter" }),
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    CodecLevel: S.optional(H264CodecLevel).pipe(T.JsonName("codecLevel")),
    CodecProfile: S.optional(H264CodecProfile).pipe(T.JsonName("codecProfile")),
    DynamicSubGop: S.optional(H264DynamicSubGop).pipe(
      T.JsonName("dynamicSubGop"),
    ),
    EndOfStreamMarkers: S.optional(H264EndOfStreamMarkers).pipe(
      T.JsonName("endOfStreamMarkers"),
    ),
    EntropyEncoding: S.optional(H264EntropyEncoding).pipe(
      T.JsonName("entropyEncoding"),
    ),
    FieldEncoding: S.optional(H264FieldEncoding).pipe(
      T.JsonName("fieldEncoding"),
    ),
    FlickerAdaptiveQuantization: S.optional(
      H264FlickerAdaptiveQuantization,
    ).pipe(T.JsonName("flickerAdaptiveQuantization")),
    FramerateControl: S.optional(H264FramerateControl).pipe(
      T.JsonName("framerateControl"),
    ),
    FramerateConversionAlgorithm: S.optional(
      H264FramerateConversionAlgorithm,
    ).pipe(T.JsonName("framerateConversionAlgorithm")),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    GopBReference: S.optional(H264GopBReference).pipe(
      T.JsonName("gopBReference"),
    ),
    GopClosedCadence: S.optional(S.Number).pipe(T.JsonName("gopClosedCadence")),
    GopSize: S.optional(S.Number).pipe(T.JsonName("gopSize")),
    GopSizeUnits: S.optional(H264GopSizeUnits).pipe(T.JsonName("gopSizeUnits")),
    HrdBufferFinalFillPercentage: S.optional(S.Number).pipe(
      T.JsonName("hrdBufferFinalFillPercentage"),
    ),
    HrdBufferInitialFillPercentage: S.optional(S.Number).pipe(
      T.JsonName("hrdBufferInitialFillPercentage"),
    ),
    HrdBufferSize: S.optional(S.Number).pipe(T.JsonName("hrdBufferSize")),
    InterlaceMode: S.optional(H264InterlaceMode).pipe(
      T.JsonName("interlaceMode"),
    ),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    MinIInterval: S.optional(S.Number).pipe(T.JsonName("minIInterval")),
    NumberBFramesBetweenReferenceFrames: S.optional(S.Number).pipe(
      T.JsonName("numberBFramesBetweenReferenceFrames"),
    ),
    NumberReferenceFrames: S.optional(S.Number).pipe(
      T.JsonName("numberReferenceFrames"),
    ),
    ParControl: S.optional(H264ParControl).pipe(T.JsonName("parControl")),
    ParDenominator: S.optional(S.Number).pipe(T.JsonName("parDenominator")),
    ParNumerator: S.optional(S.Number).pipe(T.JsonName("parNumerator")),
    PerFrameMetrics: S.optional(__listOfFrameMetricType).pipe(
      T.JsonName("perFrameMetrics"),
    ),
    QualityTuningLevel: S.optional(H264QualityTuningLevel).pipe(
      T.JsonName("qualityTuningLevel"),
    ),
    QvbrSettings: S.optional(H264QvbrSettings)
      .pipe(T.JsonName("qvbrSettings"))
      .annotations({ identifier: "H264QvbrSettings" }),
    RateControlMode: S.optional(H264RateControlMode).pipe(
      T.JsonName("rateControlMode"),
    ),
    RepeatPps: S.optional(H264RepeatPps).pipe(T.JsonName("repeatPps")),
    SaliencyAwareEncoding: S.optional(H264SaliencyAwareEncoding).pipe(
      T.JsonName("saliencyAwareEncoding"),
    ),
    ScanTypeConversionMode: S.optional(H264ScanTypeConversionMode).pipe(
      T.JsonName("scanTypeConversionMode"),
    ),
    SceneChangeDetect: S.optional(H264SceneChangeDetect).pipe(
      T.JsonName("sceneChangeDetect"),
    ),
    Slices: S.optional(S.Number).pipe(T.JsonName("slices")),
    SlowPal: S.optional(H264SlowPal).pipe(T.JsonName("slowPal")),
    Softness: S.optional(S.Number).pipe(T.JsonName("softness")),
    SpatialAdaptiveQuantization: S.optional(
      H264SpatialAdaptiveQuantization,
    ).pipe(T.JsonName("spatialAdaptiveQuantization")),
    Syntax: S.optional(H264Syntax).pipe(T.JsonName("syntax")),
    Telecine: S.optional(H264Telecine).pipe(T.JsonName("telecine")),
    TemporalAdaptiveQuantization: S.optional(
      H264TemporalAdaptiveQuantization,
    ).pipe(T.JsonName("temporalAdaptiveQuantization")),
    UnregisteredSeiTimecode: S.optional(H264UnregisteredSeiTimecode).pipe(
      T.JsonName("unregisteredSeiTimecode"),
    ),
    WriteMp4PackagingType: S.optional(H264WriteMp4PackagingType).pipe(
      T.JsonName("writeMp4PackagingType"),
    ),
  }),
).annotations({ identifier: "H264Settings" }) as any as S.Schema<H264Settings>;
export type H265AdaptiveQuantization =
  | "OFF"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "HIGHER"
  | "MAX"
  | "AUTO";
export const H265AdaptiveQuantization = S.Literal(
  "OFF",
  "LOW",
  "MEDIUM",
  "HIGH",
  "HIGHER",
  "MAX",
  "AUTO",
);
export type H265AlternateTransferFunctionSei = "DISABLED" | "ENABLED";
export const H265AlternateTransferFunctionSei = S.Literal(
  "DISABLED",
  "ENABLED",
);
export type H265CodecLevel =
  | "AUTO"
  | "LEVEL_1"
  | "LEVEL_2"
  | "LEVEL_2_1"
  | "LEVEL_3"
  | "LEVEL_3_1"
  | "LEVEL_4"
  | "LEVEL_4_1"
  | "LEVEL_5"
  | "LEVEL_5_1"
  | "LEVEL_5_2"
  | "LEVEL_6"
  | "LEVEL_6_1"
  | "LEVEL_6_2";
export const H265CodecLevel = S.Literal(
  "AUTO",
  "LEVEL_1",
  "LEVEL_2",
  "LEVEL_2_1",
  "LEVEL_3",
  "LEVEL_3_1",
  "LEVEL_4",
  "LEVEL_4_1",
  "LEVEL_5",
  "LEVEL_5_1",
  "LEVEL_5_2",
  "LEVEL_6",
  "LEVEL_6_1",
  "LEVEL_6_2",
);
export type H265CodecProfile =
  | "MAIN_MAIN"
  | "MAIN_HIGH"
  | "MAIN10_MAIN"
  | "MAIN10_HIGH"
  | "MAIN_422_8BIT_MAIN"
  | "MAIN_422_8BIT_HIGH"
  | "MAIN_422_10BIT_MAIN"
  | "MAIN_422_10BIT_HIGH";
export const H265CodecProfile = S.Literal(
  "MAIN_MAIN",
  "MAIN_HIGH",
  "MAIN10_MAIN",
  "MAIN10_HIGH",
  "MAIN_422_8BIT_MAIN",
  "MAIN_422_8BIT_HIGH",
  "MAIN_422_10BIT_MAIN",
  "MAIN_422_10BIT_HIGH",
);
export type H265Deblocking = "ENABLED" | "DISABLED";
export const H265Deblocking = S.Literal("ENABLED", "DISABLED");
export type H265DynamicSubGop = "ADAPTIVE" | "STATIC";
export const H265DynamicSubGop = S.Literal("ADAPTIVE", "STATIC");
export type H265EndOfStreamMarkers = "INCLUDE" | "SUPPRESS";
export const H265EndOfStreamMarkers = S.Literal("INCLUDE", "SUPPRESS");
export type H265FlickerAdaptiveQuantization = "DISABLED" | "ENABLED";
export const H265FlickerAdaptiveQuantization = S.Literal("DISABLED", "ENABLED");
export type H265FramerateControl = "INITIALIZE_FROM_SOURCE" | "SPECIFIED";
export const H265FramerateControl = S.Literal(
  "INITIALIZE_FROM_SOURCE",
  "SPECIFIED",
);
export type H265FramerateConversionAlgorithm =
  | "DUPLICATE_DROP"
  | "INTERPOLATE"
  | "FRAMEFORMER"
  | "MAINTAIN_FRAME_COUNT";
export const H265FramerateConversionAlgorithm = S.Literal(
  "DUPLICATE_DROP",
  "INTERPOLATE",
  "FRAMEFORMER",
  "MAINTAIN_FRAME_COUNT",
);
export type H265GopBReference = "DISABLED" | "ENABLED";
export const H265GopBReference = S.Literal("DISABLED", "ENABLED");
export type H265GopSizeUnits = "FRAMES" | "SECONDS" | "AUTO";
export const H265GopSizeUnits = S.Literal("FRAMES", "SECONDS", "AUTO");
export type H265InterlaceMode =
  | "PROGRESSIVE"
  | "TOP_FIELD"
  | "BOTTOM_FIELD"
  | "FOLLOW_TOP_FIELD"
  | "FOLLOW_BOTTOM_FIELD";
export const H265InterlaceMode = S.Literal(
  "PROGRESSIVE",
  "TOP_FIELD",
  "BOTTOM_FIELD",
  "FOLLOW_TOP_FIELD",
  "FOLLOW_BOTTOM_FIELD",
);
export type H265MvOverPictureBoundaries = "ENABLED" | "DISABLED";
export const H265MvOverPictureBoundaries = S.Literal("ENABLED", "DISABLED");
export type H265MvTemporalPredictor = "ENABLED" | "DISABLED";
export const H265MvTemporalPredictor = S.Literal("ENABLED", "DISABLED");
export type H265ParControl = "INITIALIZE_FROM_SOURCE" | "SPECIFIED";
export const H265ParControl = S.Literal("INITIALIZE_FROM_SOURCE", "SPECIFIED");
export type H265QualityTuningLevel =
  | "SINGLE_PASS"
  | "SINGLE_PASS_HQ"
  | "MULTI_PASS_HQ";
export const H265QualityTuningLevel = S.Literal(
  "SINGLE_PASS",
  "SINGLE_PASS_HQ",
  "MULTI_PASS_HQ",
);
export interface H265QvbrSettings {
  MaxAverageBitrate?: number;
  QvbrQualityLevel?: number;
  QvbrQualityLevelFineTune?: number;
}
export const H265QvbrSettings = S.suspend(() =>
  S.Struct({
    MaxAverageBitrate: S.optional(S.Number).pipe(
      T.JsonName("maxAverageBitrate"),
    ),
    QvbrQualityLevel: S.optional(S.Number).pipe(T.JsonName("qvbrQualityLevel")),
    QvbrQualityLevelFineTune: S.optional(S.Number).pipe(
      T.JsonName("qvbrQualityLevelFineTune"),
    ),
  }),
).annotations({
  identifier: "H265QvbrSettings",
}) as any as S.Schema<H265QvbrSettings>;
export type H265RateControlMode = "VBR" | "CBR" | "QVBR";
export const H265RateControlMode = S.Literal("VBR", "CBR", "QVBR");
export type H265SampleAdaptiveOffsetFilterMode = "DEFAULT" | "ADAPTIVE" | "OFF";
export const H265SampleAdaptiveOffsetFilterMode = S.Literal(
  "DEFAULT",
  "ADAPTIVE",
  "OFF",
);
export type H265ScanTypeConversionMode = "INTERLACED" | "INTERLACED_OPTIMIZE";
export const H265ScanTypeConversionMode = S.Literal(
  "INTERLACED",
  "INTERLACED_OPTIMIZE",
);
export type H265SceneChangeDetect =
  | "DISABLED"
  | "ENABLED"
  | "TRANSITION_DETECTION";
export const H265SceneChangeDetect = S.Literal(
  "DISABLED",
  "ENABLED",
  "TRANSITION_DETECTION",
);
export type H265SlowPal = "DISABLED" | "ENABLED";
export const H265SlowPal = S.Literal("DISABLED", "ENABLED");
export type H265SpatialAdaptiveQuantization = "DISABLED" | "ENABLED";
export const H265SpatialAdaptiveQuantization = S.Literal("DISABLED", "ENABLED");
export type H265Telecine = "NONE" | "SOFT" | "HARD";
export const H265Telecine = S.Literal("NONE", "SOFT", "HARD");
export type H265TemporalAdaptiveQuantization = "DISABLED" | "ENABLED";
export const H265TemporalAdaptiveQuantization = S.Literal(
  "DISABLED",
  "ENABLED",
);
export type H265TemporalIds = "DISABLED" | "ENABLED";
export const H265TemporalIds = S.Literal("DISABLED", "ENABLED");
export type H265TilePadding = "NONE" | "PADDED";
export const H265TilePadding = S.Literal("NONE", "PADDED");
export type H265Tiles = "DISABLED" | "ENABLED";
export const H265Tiles = S.Literal("DISABLED", "ENABLED");
export type H265TreeBlockSize = "AUTO" | "TREE_SIZE_32X32";
export const H265TreeBlockSize = S.Literal("AUTO", "TREE_SIZE_32X32");
export type H265UnregisteredSeiTimecode = "DISABLED" | "ENABLED";
export const H265UnregisteredSeiTimecode = S.Literal("DISABLED", "ENABLED");
export type H265WriteMp4PackagingType = "HVC1" | "HEV1";
export const H265WriteMp4PackagingType = S.Literal("HVC1", "HEV1");
export interface H265Settings {
  AdaptiveQuantization?: H265AdaptiveQuantization;
  AlternateTransferFunctionSei?: H265AlternateTransferFunctionSei;
  BandwidthReductionFilter?: BandwidthReductionFilter;
  Bitrate?: number;
  CodecLevel?: H265CodecLevel;
  CodecProfile?: H265CodecProfile;
  Deblocking?: H265Deblocking;
  DynamicSubGop?: H265DynamicSubGop;
  EndOfStreamMarkers?: H265EndOfStreamMarkers;
  FlickerAdaptiveQuantization?: H265FlickerAdaptiveQuantization;
  FramerateControl?: H265FramerateControl;
  FramerateConversionAlgorithm?: H265FramerateConversionAlgorithm;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  GopBReference?: H265GopBReference;
  GopClosedCadence?: number;
  GopSize?: number;
  GopSizeUnits?: H265GopSizeUnits;
  HrdBufferFinalFillPercentage?: number;
  HrdBufferInitialFillPercentage?: number;
  HrdBufferSize?: number;
  InterlaceMode?: H265InterlaceMode;
  MaxBitrate?: number;
  MinIInterval?: number;
  MvOverPictureBoundaries?: H265MvOverPictureBoundaries;
  MvTemporalPredictor?: H265MvTemporalPredictor;
  NumberBFramesBetweenReferenceFrames?: number;
  NumberReferenceFrames?: number;
  ParControl?: H265ParControl;
  ParDenominator?: number;
  ParNumerator?: number;
  PerFrameMetrics?: FrameMetricType[];
  QualityTuningLevel?: H265QualityTuningLevel;
  QvbrSettings?: H265QvbrSettings;
  RateControlMode?: H265RateControlMode;
  SampleAdaptiveOffsetFilterMode?: H265SampleAdaptiveOffsetFilterMode;
  ScanTypeConversionMode?: H265ScanTypeConversionMode;
  SceneChangeDetect?: H265SceneChangeDetect;
  Slices?: number;
  SlowPal?: H265SlowPal;
  SpatialAdaptiveQuantization?: H265SpatialAdaptiveQuantization;
  Telecine?: H265Telecine;
  TemporalAdaptiveQuantization?: H265TemporalAdaptiveQuantization;
  TemporalIds?: H265TemporalIds;
  TileHeight?: number;
  TilePadding?: H265TilePadding;
  TileWidth?: number;
  Tiles?: H265Tiles;
  TreeBlockSize?: H265TreeBlockSize;
  UnregisteredSeiTimecode?: H265UnregisteredSeiTimecode;
  WriteMp4PackagingType?: H265WriteMp4PackagingType;
}
export const H265Settings = S.suspend(() =>
  S.Struct({
    AdaptiveQuantization: S.optional(H265AdaptiveQuantization).pipe(
      T.JsonName("adaptiveQuantization"),
    ),
    AlternateTransferFunctionSei: S.optional(
      H265AlternateTransferFunctionSei,
    ).pipe(T.JsonName("alternateTransferFunctionSei")),
    BandwidthReductionFilter: S.optional(BandwidthReductionFilter)
      .pipe(T.JsonName("bandwidthReductionFilter"))
      .annotations({ identifier: "BandwidthReductionFilter" }),
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    CodecLevel: S.optional(H265CodecLevel).pipe(T.JsonName("codecLevel")),
    CodecProfile: S.optional(H265CodecProfile).pipe(T.JsonName("codecProfile")),
    Deblocking: S.optional(H265Deblocking).pipe(T.JsonName("deblocking")),
    DynamicSubGop: S.optional(H265DynamicSubGop).pipe(
      T.JsonName("dynamicSubGop"),
    ),
    EndOfStreamMarkers: S.optional(H265EndOfStreamMarkers).pipe(
      T.JsonName("endOfStreamMarkers"),
    ),
    FlickerAdaptiveQuantization: S.optional(
      H265FlickerAdaptiveQuantization,
    ).pipe(T.JsonName("flickerAdaptiveQuantization")),
    FramerateControl: S.optional(H265FramerateControl).pipe(
      T.JsonName("framerateControl"),
    ),
    FramerateConversionAlgorithm: S.optional(
      H265FramerateConversionAlgorithm,
    ).pipe(T.JsonName("framerateConversionAlgorithm")),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    GopBReference: S.optional(H265GopBReference).pipe(
      T.JsonName("gopBReference"),
    ),
    GopClosedCadence: S.optional(S.Number).pipe(T.JsonName("gopClosedCadence")),
    GopSize: S.optional(S.Number).pipe(T.JsonName("gopSize")),
    GopSizeUnits: S.optional(H265GopSizeUnits).pipe(T.JsonName("gopSizeUnits")),
    HrdBufferFinalFillPercentage: S.optional(S.Number).pipe(
      T.JsonName("hrdBufferFinalFillPercentage"),
    ),
    HrdBufferInitialFillPercentage: S.optional(S.Number).pipe(
      T.JsonName("hrdBufferInitialFillPercentage"),
    ),
    HrdBufferSize: S.optional(S.Number).pipe(T.JsonName("hrdBufferSize")),
    InterlaceMode: S.optional(H265InterlaceMode).pipe(
      T.JsonName("interlaceMode"),
    ),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    MinIInterval: S.optional(S.Number).pipe(T.JsonName("minIInterval")),
    MvOverPictureBoundaries: S.optional(H265MvOverPictureBoundaries).pipe(
      T.JsonName("mvOverPictureBoundaries"),
    ),
    MvTemporalPredictor: S.optional(H265MvTemporalPredictor).pipe(
      T.JsonName("mvTemporalPredictor"),
    ),
    NumberBFramesBetweenReferenceFrames: S.optional(S.Number).pipe(
      T.JsonName("numberBFramesBetweenReferenceFrames"),
    ),
    NumberReferenceFrames: S.optional(S.Number).pipe(
      T.JsonName("numberReferenceFrames"),
    ),
    ParControl: S.optional(H265ParControl).pipe(T.JsonName("parControl")),
    ParDenominator: S.optional(S.Number).pipe(T.JsonName("parDenominator")),
    ParNumerator: S.optional(S.Number).pipe(T.JsonName("parNumerator")),
    PerFrameMetrics: S.optional(__listOfFrameMetricType).pipe(
      T.JsonName("perFrameMetrics"),
    ),
    QualityTuningLevel: S.optional(H265QualityTuningLevel).pipe(
      T.JsonName("qualityTuningLevel"),
    ),
    QvbrSettings: S.optional(H265QvbrSettings)
      .pipe(T.JsonName("qvbrSettings"))
      .annotations({ identifier: "H265QvbrSettings" }),
    RateControlMode: S.optional(H265RateControlMode).pipe(
      T.JsonName("rateControlMode"),
    ),
    SampleAdaptiveOffsetFilterMode: S.optional(
      H265SampleAdaptiveOffsetFilterMode,
    ).pipe(T.JsonName("sampleAdaptiveOffsetFilterMode")),
    ScanTypeConversionMode: S.optional(H265ScanTypeConversionMode).pipe(
      T.JsonName("scanTypeConversionMode"),
    ),
    SceneChangeDetect: S.optional(H265SceneChangeDetect).pipe(
      T.JsonName("sceneChangeDetect"),
    ),
    Slices: S.optional(S.Number).pipe(T.JsonName("slices")),
    SlowPal: S.optional(H265SlowPal).pipe(T.JsonName("slowPal")),
    SpatialAdaptiveQuantization: S.optional(
      H265SpatialAdaptiveQuantization,
    ).pipe(T.JsonName("spatialAdaptiveQuantization")),
    Telecine: S.optional(H265Telecine).pipe(T.JsonName("telecine")),
    TemporalAdaptiveQuantization: S.optional(
      H265TemporalAdaptiveQuantization,
    ).pipe(T.JsonName("temporalAdaptiveQuantization")),
    TemporalIds: S.optional(H265TemporalIds).pipe(T.JsonName("temporalIds")),
    TileHeight: S.optional(S.Number).pipe(T.JsonName("tileHeight")),
    TilePadding: S.optional(H265TilePadding).pipe(T.JsonName("tilePadding")),
    TileWidth: S.optional(S.Number).pipe(T.JsonName("tileWidth")),
    Tiles: S.optional(H265Tiles).pipe(T.JsonName("tiles")),
    TreeBlockSize: S.optional(H265TreeBlockSize).pipe(
      T.JsonName("treeBlockSize"),
    ),
    UnregisteredSeiTimecode: S.optional(H265UnregisteredSeiTimecode).pipe(
      T.JsonName("unregisteredSeiTimecode"),
    ),
    WriteMp4PackagingType: S.optional(H265WriteMp4PackagingType).pipe(
      T.JsonName("writeMp4PackagingType"),
    ),
  }),
).annotations({ identifier: "H265Settings" }) as any as S.Schema<H265Settings>;
export type Mpeg2AdaptiveQuantization = "OFF" | "LOW" | "MEDIUM" | "HIGH";
export const Mpeg2AdaptiveQuantization = S.Literal(
  "OFF",
  "LOW",
  "MEDIUM",
  "HIGH",
);
export type Mpeg2CodecLevel = "AUTO" | "LOW" | "MAIN" | "HIGH1440" | "HIGH";
export const Mpeg2CodecLevel = S.Literal(
  "AUTO",
  "LOW",
  "MAIN",
  "HIGH1440",
  "HIGH",
);
export type Mpeg2CodecProfile = "MAIN" | "PROFILE_422";
export const Mpeg2CodecProfile = S.Literal("MAIN", "PROFILE_422");
export type Mpeg2DynamicSubGop = "ADAPTIVE" | "STATIC";
export const Mpeg2DynamicSubGop = S.Literal("ADAPTIVE", "STATIC");
export type Mpeg2FramerateControl = "INITIALIZE_FROM_SOURCE" | "SPECIFIED";
export const Mpeg2FramerateControl = S.Literal(
  "INITIALIZE_FROM_SOURCE",
  "SPECIFIED",
);
export type Mpeg2FramerateConversionAlgorithm =
  | "DUPLICATE_DROP"
  | "INTERPOLATE"
  | "FRAMEFORMER"
  | "MAINTAIN_FRAME_COUNT";
export const Mpeg2FramerateConversionAlgorithm = S.Literal(
  "DUPLICATE_DROP",
  "INTERPOLATE",
  "FRAMEFORMER",
  "MAINTAIN_FRAME_COUNT",
);
export type Mpeg2GopSizeUnits = "FRAMES" | "SECONDS";
export const Mpeg2GopSizeUnits = S.Literal("FRAMES", "SECONDS");
export type Mpeg2InterlaceMode =
  | "PROGRESSIVE"
  | "TOP_FIELD"
  | "BOTTOM_FIELD"
  | "FOLLOW_TOP_FIELD"
  | "FOLLOW_BOTTOM_FIELD";
export const Mpeg2InterlaceMode = S.Literal(
  "PROGRESSIVE",
  "TOP_FIELD",
  "BOTTOM_FIELD",
  "FOLLOW_TOP_FIELD",
  "FOLLOW_BOTTOM_FIELD",
);
export type Mpeg2IntraDcPrecision =
  | "AUTO"
  | "INTRA_DC_PRECISION_8"
  | "INTRA_DC_PRECISION_9"
  | "INTRA_DC_PRECISION_10"
  | "INTRA_DC_PRECISION_11";
export const Mpeg2IntraDcPrecision = S.Literal(
  "AUTO",
  "INTRA_DC_PRECISION_8",
  "INTRA_DC_PRECISION_9",
  "INTRA_DC_PRECISION_10",
  "INTRA_DC_PRECISION_11",
);
export type Mpeg2ParControl = "INITIALIZE_FROM_SOURCE" | "SPECIFIED";
export const Mpeg2ParControl = S.Literal("INITIALIZE_FROM_SOURCE", "SPECIFIED");
export type Mpeg2QualityTuningLevel = "SINGLE_PASS" | "MULTI_PASS";
export const Mpeg2QualityTuningLevel = S.Literal("SINGLE_PASS", "MULTI_PASS");
export type Mpeg2RateControlMode = "VBR" | "CBR";
export const Mpeg2RateControlMode = S.Literal("VBR", "CBR");
export type Mpeg2ScanTypeConversionMode = "INTERLACED" | "INTERLACED_OPTIMIZE";
export const Mpeg2ScanTypeConversionMode = S.Literal(
  "INTERLACED",
  "INTERLACED_OPTIMIZE",
);
export type Mpeg2SceneChangeDetect = "DISABLED" | "ENABLED";
export const Mpeg2SceneChangeDetect = S.Literal("DISABLED", "ENABLED");
export type Mpeg2SlowPal = "DISABLED" | "ENABLED";
export const Mpeg2SlowPal = S.Literal("DISABLED", "ENABLED");
export type Mpeg2SpatialAdaptiveQuantization = "DISABLED" | "ENABLED";
export const Mpeg2SpatialAdaptiveQuantization = S.Literal(
  "DISABLED",
  "ENABLED",
);
export type Mpeg2Syntax = "DEFAULT" | "D_10";
export const Mpeg2Syntax = S.Literal("DEFAULT", "D_10");
export type Mpeg2Telecine = "NONE" | "SOFT" | "HARD";
export const Mpeg2Telecine = S.Literal("NONE", "SOFT", "HARD");
export type Mpeg2TemporalAdaptiveQuantization = "DISABLED" | "ENABLED";
export const Mpeg2TemporalAdaptiveQuantization = S.Literal(
  "DISABLED",
  "ENABLED",
);
export interface Mpeg2Settings {
  AdaptiveQuantization?: Mpeg2AdaptiveQuantization;
  Bitrate?: number;
  CodecLevel?: Mpeg2CodecLevel;
  CodecProfile?: Mpeg2CodecProfile;
  DynamicSubGop?: Mpeg2DynamicSubGop;
  FramerateControl?: Mpeg2FramerateControl;
  FramerateConversionAlgorithm?: Mpeg2FramerateConversionAlgorithm;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  GopClosedCadence?: number;
  GopSize?: number;
  GopSizeUnits?: Mpeg2GopSizeUnits;
  HrdBufferFinalFillPercentage?: number;
  HrdBufferInitialFillPercentage?: number;
  HrdBufferSize?: number;
  InterlaceMode?: Mpeg2InterlaceMode;
  IntraDcPrecision?: Mpeg2IntraDcPrecision;
  MaxBitrate?: number;
  MinIInterval?: number;
  NumberBFramesBetweenReferenceFrames?: number;
  ParControl?: Mpeg2ParControl;
  ParDenominator?: number;
  ParNumerator?: number;
  PerFrameMetrics?: FrameMetricType[];
  QualityTuningLevel?: Mpeg2QualityTuningLevel;
  RateControlMode?: Mpeg2RateControlMode;
  ScanTypeConversionMode?: Mpeg2ScanTypeConversionMode;
  SceneChangeDetect?: Mpeg2SceneChangeDetect;
  SlowPal?: Mpeg2SlowPal;
  Softness?: number;
  SpatialAdaptiveQuantization?: Mpeg2SpatialAdaptiveQuantization;
  Syntax?: Mpeg2Syntax;
  Telecine?: Mpeg2Telecine;
  TemporalAdaptiveQuantization?: Mpeg2TemporalAdaptiveQuantization;
}
export const Mpeg2Settings = S.suspend(() =>
  S.Struct({
    AdaptiveQuantization: S.optional(Mpeg2AdaptiveQuantization).pipe(
      T.JsonName("adaptiveQuantization"),
    ),
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    CodecLevel: S.optional(Mpeg2CodecLevel).pipe(T.JsonName("codecLevel")),
    CodecProfile: S.optional(Mpeg2CodecProfile).pipe(
      T.JsonName("codecProfile"),
    ),
    DynamicSubGop: S.optional(Mpeg2DynamicSubGop).pipe(
      T.JsonName("dynamicSubGop"),
    ),
    FramerateControl: S.optional(Mpeg2FramerateControl).pipe(
      T.JsonName("framerateControl"),
    ),
    FramerateConversionAlgorithm: S.optional(
      Mpeg2FramerateConversionAlgorithm,
    ).pipe(T.JsonName("framerateConversionAlgorithm")),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    GopClosedCadence: S.optional(S.Number).pipe(T.JsonName("gopClosedCadence")),
    GopSize: S.optional(S.Number).pipe(T.JsonName("gopSize")),
    GopSizeUnits: S.optional(Mpeg2GopSizeUnits).pipe(
      T.JsonName("gopSizeUnits"),
    ),
    HrdBufferFinalFillPercentage: S.optional(S.Number).pipe(
      T.JsonName("hrdBufferFinalFillPercentage"),
    ),
    HrdBufferInitialFillPercentage: S.optional(S.Number).pipe(
      T.JsonName("hrdBufferInitialFillPercentage"),
    ),
    HrdBufferSize: S.optional(S.Number).pipe(T.JsonName("hrdBufferSize")),
    InterlaceMode: S.optional(Mpeg2InterlaceMode).pipe(
      T.JsonName("interlaceMode"),
    ),
    IntraDcPrecision: S.optional(Mpeg2IntraDcPrecision).pipe(
      T.JsonName("intraDcPrecision"),
    ),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    MinIInterval: S.optional(S.Number).pipe(T.JsonName("minIInterval")),
    NumberBFramesBetweenReferenceFrames: S.optional(S.Number).pipe(
      T.JsonName("numberBFramesBetweenReferenceFrames"),
    ),
    ParControl: S.optional(Mpeg2ParControl).pipe(T.JsonName("parControl")),
    ParDenominator: S.optional(S.Number).pipe(T.JsonName("parDenominator")),
    ParNumerator: S.optional(S.Number).pipe(T.JsonName("parNumerator")),
    PerFrameMetrics: S.optional(__listOfFrameMetricType).pipe(
      T.JsonName("perFrameMetrics"),
    ),
    QualityTuningLevel: S.optional(Mpeg2QualityTuningLevel).pipe(
      T.JsonName("qualityTuningLevel"),
    ),
    RateControlMode: S.optional(Mpeg2RateControlMode).pipe(
      T.JsonName("rateControlMode"),
    ),
    ScanTypeConversionMode: S.optional(Mpeg2ScanTypeConversionMode).pipe(
      T.JsonName("scanTypeConversionMode"),
    ),
    SceneChangeDetect: S.optional(Mpeg2SceneChangeDetect).pipe(
      T.JsonName("sceneChangeDetect"),
    ),
    SlowPal: S.optional(Mpeg2SlowPal).pipe(T.JsonName("slowPal")),
    Softness: S.optional(S.Number).pipe(T.JsonName("softness")),
    SpatialAdaptiveQuantization: S.optional(
      Mpeg2SpatialAdaptiveQuantization,
    ).pipe(T.JsonName("spatialAdaptiveQuantization")),
    Syntax: S.optional(Mpeg2Syntax).pipe(T.JsonName("syntax")),
    Telecine: S.optional(Mpeg2Telecine).pipe(T.JsonName("telecine")),
    TemporalAdaptiveQuantization: S.optional(
      Mpeg2TemporalAdaptiveQuantization,
    ).pipe(T.JsonName("temporalAdaptiveQuantization")),
  }),
).annotations({
  identifier: "Mpeg2Settings",
}) as any as S.Schema<Mpeg2Settings>;
export type FrameControl = "NEAREST_IDRFRAME" | "NEAREST_IFRAME";
export const FrameControl = S.Literal("NEAREST_IDRFRAME", "NEAREST_IFRAME");
export type VideoSelectorMode = "AUTO" | "REMUX_ALL";
export const VideoSelectorMode = S.Literal("AUTO", "REMUX_ALL");
export interface PassthroughSettings {
  FrameControl?: FrameControl;
  VideoSelectorMode?: VideoSelectorMode;
}
export const PassthroughSettings = S.suspend(() =>
  S.Struct({
    FrameControl: S.optional(FrameControl).pipe(T.JsonName("frameControl")),
    VideoSelectorMode: S.optional(VideoSelectorMode).pipe(
      T.JsonName("videoSelectorMode"),
    ),
  }),
).annotations({
  identifier: "PassthroughSettings",
}) as any as S.Schema<PassthroughSettings>;
export type ProresChromaSampling = "PRESERVE_444_SAMPLING" | "SUBSAMPLE_TO_422";
export const ProresChromaSampling = S.Literal(
  "PRESERVE_444_SAMPLING",
  "SUBSAMPLE_TO_422",
);
export type ProresCodecProfile =
  | "APPLE_PRORES_422"
  | "APPLE_PRORES_422_HQ"
  | "APPLE_PRORES_422_LT"
  | "APPLE_PRORES_422_PROXY"
  | "APPLE_PRORES_4444"
  | "APPLE_PRORES_4444_XQ";
export const ProresCodecProfile = S.Literal(
  "APPLE_PRORES_422",
  "APPLE_PRORES_422_HQ",
  "APPLE_PRORES_422_LT",
  "APPLE_PRORES_422_PROXY",
  "APPLE_PRORES_4444",
  "APPLE_PRORES_4444_XQ",
);
export type ProresFramerateControl = "INITIALIZE_FROM_SOURCE" | "SPECIFIED";
export const ProresFramerateControl = S.Literal(
  "INITIALIZE_FROM_SOURCE",
  "SPECIFIED",
);
export type ProresFramerateConversionAlgorithm =
  | "DUPLICATE_DROP"
  | "INTERPOLATE"
  | "FRAMEFORMER"
  | "MAINTAIN_FRAME_COUNT";
export const ProresFramerateConversionAlgorithm = S.Literal(
  "DUPLICATE_DROP",
  "INTERPOLATE",
  "FRAMEFORMER",
  "MAINTAIN_FRAME_COUNT",
);
export type ProresInterlaceMode =
  | "PROGRESSIVE"
  | "TOP_FIELD"
  | "BOTTOM_FIELD"
  | "FOLLOW_TOP_FIELD"
  | "FOLLOW_BOTTOM_FIELD";
export const ProresInterlaceMode = S.Literal(
  "PROGRESSIVE",
  "TOP_FIELD",
  "BOTTOM_FIELD",
  "FOLLOW_TOP_FIELD",
  "FOLLOW_BOTTOM_FIELD",
);
export type ProresParControl = "INITIALIZE_FROM_SOURCE" | "SPECIFIED";
export const ProresParControl = S.Literal(
  "INITIALIZE_FROM_SOURCE",
  "SPECIFIED",
);
export type ProresScanTypeConversionMode = "INTERLACED" | "INTERLACED_OPTIMIZE";
export const ProresScanTypeConversionMode = S.Literal(
  "INTERLACED",
  "INTERLACED_OPTIMIZE",
);
export type ProresSlowPal = "DISABLED" | "ENABLED";
export const ProresSlowPal = S.Literal("DISABLED", "ENABLED");
export type ProresTelecine = "NONE" | "HARD";
export const ProresTelecine = S.Literal("NONE", "HARD");
export interface ProresSettings {
  ChromaSampling?: ProresChromaSampling;
  CodecProfile?: ProresCodecProfile;
  FramerateControl?: ProresFramerateControl;
  FramerateConversionAlgorithm?: ProresFramerateConversionAlgorithm;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  InterlaceMode?: ProresInterlaceMode;
  ParControl?: ProresParControl;
  ParDenominator?: number;
  ParNumerator?: number;
  PerFrameMetrics?: FrameMetricType[];
  ScanTypeConversionMode?: ProresScanTypeConversionMode;
  SlowPal?: ProresSlowPal;
  Telecine?: ProresTelecine;
}
export const ProresSettings = S.suspend(() =>
  S.Struct({
    ChromaSampling: S.optional(ProresChromaSampling).pipe(
      T.JsonName("chromaSampling"),
    ),
    CodecProfile: S.optional(ProresCodecProfile).pipe(
      T.JsonName("codecProfile"),
    ),
    FramerateControl: S.optional(ProresFramerateControl).pipe(
      T.JsonName("framerateControl"),
    ),
    FramerateConversionAlgorithm: S.optional(
      ProresFramerateConversionAlgorithm,
    ).pipe(T.JsonName("framerateConversionAlgorithm")),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    InterlaceMode: S.optional(ProresInterlaceMode).pipe(
      T.JsonName("interlaceMode"),
    ),
    ParControl: S.optional(ProresParControl).pipe(T.JsonName("parControl")),
    ParDenominator: S.optional(S.Number).pipe(T.JsonName("parDenominator")),
    ParNumerator: S.optional(S.Number).pipe(T.JsonName("parNumerator")),
    PerFrameMetrics: S.optional(__listOfFrameMetricType).pipe(
      T.JsonName("perFrameMetrics"),
    ),
    ScanTypeConversionMode: S.optional(ProresScanTypeConversionMode).pipe(
      T.JsonName("scanTypeConversionMode"),
    ),
    SlowPal: S.optional(ProresSlowPal).pipe(T.JsonName("slowPal")),
    Telecine: S.optional(ProresTelecine).pipe(T.JsonName("telecine")),
  }),
).annotations({
  identifier: "ProresSettings",
}) as any as S.Schema<ProresSettings>;
export type UncompressedFourcc = "I420" | "I422" | "I444";
export const UncompressedFourcc = S.Literal("I420", "I422", "I444");
export type UncompressedFramerateControl =
  | "INITIALIZE_FROM_SOURCE"
  | "SPECIFIED";
export const UncompressedFramerateControl = S.Literal(
  "INITIALIZE_FROM_SOURCE",
  "SPECIFIED",
);
export type UncompressedFramerateConversionAlgorithm =
  | "DUPLICATE_DROP"
  | "INTERPOLATE"
  | "FRAMEFORMER"
  | "MAINTAIN_FRAME_COUNT";
export const UncompressedFramerateConversionAlgorithm = S.Literal(
  "DUPLICATE_DROP",
  "INTERPOLATE",
  "FRAMEFORMER",
  "MAINTAIN_FRAME_COUNT",
);
export type UncompressedInterlaceMode = "INTERLACED" | "PROGRESSIVE";
export const UncompressedInterlaceMode = S.Literal("INTERLACED", "PROGRESSIVE");
export type UncompressedScanTypeConversionMode =
  | "INTERLACED"
  | "INTERLACED_OPTIMIZE";
export const UncompressedScanTypeConversionMode = S.Literal(
  "INTERLACED",
  "INTERLACED_OPTIMIZE",
);
export type UncompressedSlowPal = "DISABLED" | "ENABLED";
export const UncompressedSlowPal = S.Literal("DISABLED", "ENABLED");
export type UncompressedTelecine = "NONE" | "HARD";
export const UncompressedTelecine = S.Literal("NONE", "HARD");
export interface UncompressedSettings {
  Fourcc?: UncompressedFourcc;
  FramerateControl?: UncompressedFramerateControl;
  FramerateConversionAlgorithm?: UncompressedFramerateConversionAlgorithm;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  InterlaceMode?: UncompressedInterlaceMode;
  ScanTypeConversionMode?: UncompressedScanTypeConversionMode;
  SlowPal?: UncompressedSlowPal;
  Telecine?: UncompressedTelecine;
}
export const UncompressedSettings = S.suspend(() =>
  S.Struct({
    Fourcc: S.optional(UncompressedFourcc).pipe(T.JsonName("fourcc")),
    FramerateControl: S.optional(UncompressedFramerateControl).pipe(
      T.JsonName("framerateControl"),
    ),
    FramerateConversionAlgorithm: S.optional(
      UncompressedFramerateConversionAlgorithm,
    ).pipe(T.JsonName("framerateConversionAlgorithm")),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    InterlaceMode: S.optional(UncompressedInterlaceMode).pipe(
      T.JsonName("interlaceMode"),
    ),
    ScanTypeConversionMode: S.optional(UncompressedScanTypeConversionMode).pipe(
      T.JsonName("scanTypeConversionMode"),
    ),
    SlowPal: S.optional(UncompressedSlowPal).pipe(T.JsonName("slowPal")),
    Telecine: S.optional(UncompressedTelecine).pipe(T.JsonName("telecine")),
  }),
).annotations({
  identifier: "UncompressedSettings",
}) as any as S.Schema<UncompressedSettings>;
export type Vc3FramerateControl = "INITIALIZE_FROM_SOURCE" | "SPECIFIED";
export const Vc3FramerateControl = S.Literal(
  "INITIALIZE_FROM_SOURCE",
  "SPECIFIED",
);
export type Vc3FramerateConversionAlgorithm =
  | "DUPLICATE_DROP"
  | "INTERPOLATE"
  | "FRAMEFORMER"
  | "MAINTAIN_FRAME_COUNT";
export const Vc3FramerateConversionAlgorithm = S.Literal(
  "DUPLICATE_DROP",
  "INTERPOLATE",
  "FRAMEFORMER",
  "MAINTAIN_FRAME_COUNT",
);
export type Vc3InterlaceMode = "INTERLACED" | "PROGRESSIVE";
export const Vc3InterlaceMode = S.Literal("INTERLACED", "PROGRESSIVE");
export type Vc3ScanTypeConversionMode = "INTERLACED" | "INTERLACED_OPTIMIZE";
export const Vc3ScanTypeConversionMode = S.Literal(
  "INTERLACED",
  "INTERLACED_OPTIMIZE",
);
export type Vc3SlowPal = "DISABLED" | "ENABLED";
export const Vc3SlowPal = S.Literal("DISABLED", "ENABLED");
export type Vc3Telecine = "NONE" | "HARD";
export const Vc3Telecine = S.Literal("NONE", "HARD");
export type Vc3Class = "CLASS_145_8BIT" | "CLASS_220_8BIT" | "CLASS_220_10BIT";
export const Vc3Class = S.Literal(
  "CLASS_145_8BIT",
  "CLASS_220_8BIT",
  "CLASS_220_10BIT",
);
export interface Vc3Settings {
  FramerateControl?: Vc3FramerateControl;
  FramerateConversionAlgorithm?: Vc3FramerateConversionAlgorithm;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  InterlaceMode?: Vc3InterlaceMode;
  ScanTypeConversionMode?: Vc3ScanTypeConversionMode;
  SlowPal?: Vc3SlowPal;
  Telecine?: Vc3Telecine;
  Vc3Class?: Vc3Class;
}
export const Vc3Settings = S.suspend(() =>
  S.Struct({
    FramerateControl: S.optional(Vc3FramerateControl).pipe(
      T.JsonName("framerateControl"),
    ),
    FramerateConversionAlgorithm: S.optional(
      Vc3FramerateConversionAlgorithm,
    ).pipe(T.JsonName("framerateConversionAlgorithm")),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    InterlaceMode: S.optional(Vc3InterlaceMode).pipe(
      T.JsonName("interlaceMode"),
    ),
    ScanTypeConversionMode: S.optional(Vc3ScanTypeConversionMode).pipe(
      T.JsonName("scanTypeConversionMode"),
    ),
    SlowPal: S.optional(Vc3SlowPal).pipe(T.JsonName("slowPal")),
    Telecine: S.optional(Vc3Telecine).pipe(T.JsonName("telecine")),
    Vc3Class: S.optional(Vc3Class).pipe(T.JsonName("vc3Class")),
  }),
).annotations({ identifier: "Vc3Settings" }) as any as S.Schema<Vc3Settings>;
export type Vp8FramerateControl = "INITIALIZE_FROM_SOURCE" | "SPECIFIED";
export const Vp8FramerateControl = S.Literal(
  "INITIALIZE_FROM_SOURCE",
  "SPECIFIED",
);
export type Vp8FramerateConversionAlgorithm =
  | "DUPLICATE_DROP"
  | "INTERPOLATE"
  | "FRAMEFORMER"
  | "MAINTAIN_FRAME_COUNT";
export const Vp8FramerateConversionAlgorithm = S.Literal(
  "DUPLICATE_DROP",
  "INTERPOLATE",
  "FRAMEFORMER",
  "MAINTAIN_FRAME_COUNT",
);
export type Vp8ParControl = "INITIALIZE_FROM_SOURCE" | "SPECIFIED";
export const Vp8ParControl = S.Literal("INITIALIZE_FROM_SOURCE", "SPECIFIED");
export type Vp8QualityTuningLevel = "MULTI_PASS" | "MULTI_PASS_HQ";
export const Vp8QualityTuningLevel = S.Literal("MULTI_PASS", "MULTI_PASS_HQ");
export type Vp8RateControlMode = "VBR";
export const Vp8RateControlMode = S.Literal("VBR");
export interface Vp8Settings {
  Bitrate?: number;
  FramerateControl?: Vp8FramerateControl;
  FramerateConversionAlgorithm?: Vp8FramerateConversionAlgorithm;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  GopSize?: number;
  HrdBufferSize?: number;
  MaxBitrate?: number;
  ParControl?: Vp8ParControl;
  ParDenominator?: number;
  ParNumerator?: number;
  QualityTuningLevel?: Vp8QualityTuningLevel;
  RateControlMode?: Vp8RateControlMode;
}
export const Vp8Settings = S.suspend(() =>
  S.Struct({
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    FramerateControl: S.optional(Vp8FramerateControl).pipe(
      T.JsonName("framerateControl"),
    ),
    FramerateConversionAlgorithm: S.optional(
      Vp8FramerateConversionAlgorithm,
    ).pipe(T.JsonName("framerateConversionAlgorithm")),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    GopSize: S.optional(S.Number).pipe(T.JsonName("gopSize")),
    HrdBufferSize: S.optional(S.Number).pipe(T.JsonName("hrdBufferSize")),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    ParControl: S.optional(Vp8ParControl).pipe(T.JsonName("parControl")),
    ParDenominator: S.optional(S.Number).pipe(T.JsonName("parDenominator")),
    ParNumerator: S.optional(S.Number).pipe(T.JsonName("parNumerator")),
    QualityTuningLevel: S.optional(Vp8QualityTuningLevel).pipe(
      T.JsonName("qualityTuningLevel"),
    ),
    RateControlMode: S.optional(Vp8RateControlMode).pipe(
      T.JsonName("rateControlMode"),
    ),
  }),
).annotations({ identifier: "Vp8Settings" }) as any as S.Schema<Vp8Settings>;
export type Vp9FramerateControl = "INITIALIZE_FROM_SOURCE" | "SPECIFIED";
export const Vp9FramerateControl = S.Literal(
  "INITIALIZE_FROM_SOURCE",
  "SPECIFIED",
);
export type Vp9FramerateConversionAlgorithm =
  | "DUPLICATE_DROP"
  | "INTERPOLATE"
  | "FRAMEFORMER"
  | "MAINTAIN_FRAME_COUNT";
export const Vp9FramerateConversionAlgorithm = S.Literal(
  "DUPLICATE_DROP",
  "INTERPOLATE",
  "FRAMEFORMER",
  "MAINTAIN_FRAME_COUNT",
);
export type Vp9ParControl = "INITIALIZE_FROM_SOURCE" | "SPECIFIED";
export const Vp9ParControl = S.Literal("INITIALIZE_FROM_SOURCE", "SPECIFIED");
export type Vp9QualityTuningLevel = "MULTI_PASS" | "MULTI_PASS_HQ";
export const Vp9QualityTuningLevel = S.Literal("MULTI_PASS", "MULTI_PASS_HQ");
export type Vp9RateControlMode = "VBR";
export const Vp9RateControlMode = S.Literal("VBR");
export interface Vp9Settings {
  Bitrate?: number;
  FramerateControl?: Vp9FramerateControl;
  FramerateConversionAlgorithm?: Vp9FramerateConversionAlgorithm;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  GopSize?: number;
  HrdBufferSize?: number;
  MaxBitrate?: number;
  ParControl?: Vp9ParControl;
  ParDenominator?: number;
  ParNumerator?: number;
  QualityTuningLevel?: Vp9QualityTuningLevel;
  RateControlMode?: Vp9RateControlMode;
}
export const Vp9Settings = S.suspend(() =>
  S.Struct({
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    FramerateControl: S.optional(Vp9FramerateControl).pipe(
      T.JsonName("framerateControl"),
    ),
    FramerateConversionAlgorithm: S.optional(
      Vp9FramerateConversionAlgorithm,
    ).pipe(T.JsonName("framerateConversionAlgorithm")),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    GopSize: S.optional(S.Number).pipe(T.JsonName("gopSize")),
    HrdBufferSize: S.optional(S.Number).pipe(T.JsonName("hrdBufferSize")),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    ParControl: S.optional(Vp9ParControl).pipe(T.JsonName("parControl")),
    ParDenominator: S.optional(S.Number).pipe(T.JsonName("parDenominator")),
    ParNumerator: S.optional(S.Number).pipe(T.JsonName("parNumerator")),
    QualityTuningLevel: S.optional(Vp9QualityTuningLevel).pipe(
      T.JsonName("qualityTuningLevel"),
    ),
    RateControlMode: S.optional(Vp9RateControlMode).pipe(
      T.JsonName("rateControlMode"),
    ),
  }),
).annotations({ identifier: "Vp9Settings" }) as any as S.Schema<Vp9Settings>;
export type XavcAdaptiveQuantization =
  | "OFF"
  | "AUTO"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "HIGHER"
  | "MAX";
export const XavcAdaptiveQuantization = S.Literal(
  "OFF",
  "AUTO",
  "LOW",
  "MEDIUM",
  "HIGH",
  "HIGHER",
  "MAX",
);
export type XavcEntropyEncoding = "AUTO" | "CABAC" | "CAVLC";
export const XavcEntropyEncoding = S.Literal("AUTO", "CABAC", "CAVLC");
export type XavcFramerateControl = "INITIALIZE_FROM_SOURCE" | "SPECIFIED";
export const XavcFramerateControl = S.Literal(
  "INITIALIZE_FROM_SOURCE",
  "SPECIFIED",
);
export type XavcFramerateConversionAlgorithm =
  | "DUPLICATE_DROP"
  | "INTERPOLATE"
  | "FRAMEFORMER"
  | "MAINTAIN_FRAME_COUNT";
export const XavcFramerateConversionAlgorithm = S.Literal(
  "DUPLICATE_DROP",
  "INTERPOLATE",
  "FRAMEFORMER",
  "MAINTAIN_FRAME_COUNT",
);
export type XavcProfile =
  | "XAVC_HD_INTRA_CBG"
  | "XAVC_4K_INTRA_CBG"
  | "XAVC_4K_INTRA_VBR"
  | "XAVC_HD"
  | "XAVC_4K";
export const XavcProfile = S.Literal(
  "XAVC_HD_INTRA_CBG",
  "XAVC_4K_INTRA_CBG",
  "XAVC_4K_INTRA_VBR",
  "XAVC_HD",
  "XAVC_4K",
);
export type XavcSlowPal = "DISABLED" | "ENABLED";
export const XavcSlowPal = S.Literal("DISABLED", "ENABLED");
export type XavcSpatialAdaptiveQuantization = "DISABLED" | "ENABLED";
export const XavcSpatialAdaptiveQuantization = S.Literal("DISABLED", "ENABLED");
export type XavcTemporalAdaptiveQuantization = "DISABLED" | "ENABLED";
export const XavcTemporalAdaptiveQuantization = S.Literal(
  "DISABLED",
  "ENABLED",
);
export type Xavc4kIntraCbgProfileClass =
  | "CLASS_100"
  | "CLASS_300"
  | "CLASS_480";
export const Xavc4kIntraCbgProfileClass = S.Literal(
  "CLASS_100",
  "CLASS_300",
  "CLASS_480",
);
export interface Xavc4kIntraCbgProfileSettings {
  XavcClass?: Xavc4kIntraCbgProfileClass;
}
export const Xavc4kIntraCbgProfileSettings = S.suspend(() =>
  S.Struct({
    XavcClass: S.optional(Xavc4kIntraCbgProfileClass).pipe(
      T.JsonName("xavcClass"),
    ),
  }),
).annotations({
  identifier: "Xavc4kIntraCbgProfileSettings",
}) as any as S.Schema<Xavc4kIntraCbgProfileSettings>;
export type Xavc4kIntraVbrProfileClass =
  | "CLASS_100"
  | "CLASS_300"
  | "CLASS_480";
export const Xavc4kIntraVbrProfileClass = S.Literal(
  "CLASS_100",
  "CLASS_300",
  "CLASS_480",
);
export interface Xavc4kIntraVbrProfileSettings {
  XavcClass?: Xavc4kIntraVbrProfileClass;
}
export const Xavc4kIntraVbrProfileSettings = S.suspend(() =>
  S.Struct({
    XavcClass: S.optional(Xavc4kIntraVbrProfileClass).pipe(
      T.JsonName("xavcClass"),
    ),
  }),
).annotations({
  identifier: "Xavc4kIntraVbrProfileSettings",
}) as any as S.Schema<Xavc4kIntraVbrProfileSettings>;
export type Xavc4kProfileBitrateClass =
  | "BITRATE_CLASS_100"
  | "BITRATE_CLASS_140"
  | "BITRATE_CLASS_200";
export const Xavc4kProfileBitrateClass = S.Literal(
  "BITRATE_CLASS_100",
  "BITRATE_CLASS_140",
  "BITRATE_CLASS_200",
);
export type Xavc4kProfileCodecProfile = "HIGH" | "HIGH_422";
export const Xavc4kProfileCodecProfile = S.Literal("HIGH", "HIGH_422");
export type XavcFlickerAdaptiveQuantization = "DISABLED" | "ENABLED";
export const XavcFlickerAdaptiveQuantization = S.Literal("DISABLED", "ENABLED");
export type XavcGopBReference = "DISABLED" | "ENABLED";
export const XavcGopBReference = S.Literal("DISABLED", "ENABLED");
export type Xavc4kProfileQualityTuningLevel =
  | "SINGLE_PASS"
  | "SINGLE_PASS_HQ"
  | "MULTI_PASS_HQ";
export const Xavc4kProfileQualityTuningLevel = S.Literal(
  "SINGLE_PASS",
  "SINGLE_PASS_HQ",
  "MULTI_PASS_HQ",
);
export interface Xavc4kProfileSettings {
  BitrateClass?: Xavc4kProfileBitrateClass;
  CodecProfile?: Xavc4kProfileCodecProfile;
  FlickerAdaptiveQuantization?: XavcFlickerAdaptiveQuantization;
  GopBReference?: XavcGopBReference;
  GopClosedCadence?: number;
  HrdBufferSize?: number;
  QualityTuningLevel?: Xavc4kProfileQualityTuningLevel;
  Slices?: number;
}
export const Xavc4kProfileSettings = S.suspend(() =>
  S.Struct({
    BitrateClass: S.optional(Xavc4kProfileBitrateClass).pipe(
      T.JsonName("bitrateClass"),
    ),
    CodecProfile: S.optional(Xavc4kProfileCodecProfile).pipe(
      T.JsonName("codecProfile"),
    ),
    FlickerAdaptiveQuantization: S.optional(
      XavcFlickerAdaptiveQuantization,
    ).pipe(T.JsonName("flickerAdaptiveQuantization")),
    GopBReference: S.optional(XavcGopBReference).pipe(
      T.JsonName("gopBReference"),
    ),
    GopClosedCadence: S.optional(S.Number).pipe(T.JsonName("gopClosedCadence")),
    HrdBufferSize: S.optional(S.Number).pipe(T.JsonName("hrdBufferSize")),
    QualityTuningLevel: S.optional(Xavc4kProfileQualityTuningLevel).pipe(
      T.JsonName("qualityTuningLevel"),
    ),
    Slices: S.optional(S.Number).pipe(T.JsonName("slices")),
  }),
).annotations({
  identifier: "Xavc4kProfileSettings",
}) as any as S.Schema<Xavc4kProfileSettings>;
export type XavcHdIntraCbgProfileClass = "CLASS_50" | "CLASS_100" | "CLASS_200";
export const XavcHdIntraCbgProfileClass = S.Literal(
  "CLASS_50",
  "CLASS_100",
  "CLASS_200",
);
export interface XavcHdIntraCbgProfileSettings {
  XavcClass?: XavcHdIntraCbgProfileClass;
}
export const XavcHdIntraCbgProfileSettings = S.suspend(() =>
  S.Struct({
    XavcClass: S.optional(XavcHdIntraCbgProfileClass).pipe(
      T.JsonName("xavcClass"),
    ),
  }),
).annotations({
  identifier: "XavcHdIntraCbgProfileSettings",
}) as any as S.Schema<XavcHdIntraCbgProfileSettings>;
export type XavcHdProfileBitrateClass =
  | "BITRATE_CLASS_25"
  | "BITRATE_CLASS_35"
  | "BITRATE_CLASS_50";
export const XavcHdProfileBitrateClass = S.Literal(
  "BITRATE_CLASS_25",
  "BITRATE_CLASS_35",
  "BITRATE_CLASS_50",
);
export type XavcInterlaceMode =
  | "PROGRESSIVE"
  | "TOP_FIELD"
  | "BOTTOM_FIELD"
  | "FOLLOW_TOP_FIELD"
  | "FOLLOW_BOTTOM_FIELD";
export const XavcInterlaceMode = S.Literal(
  "PROGRESSIVE",
  "TOP_FIELD",
  "BOTTOM_FIELD",
  "FOLLOW_TOP_FIELD",
  "FOLLOW_BOTTOM_FIELD",
);
export type XavcHdProfileQualityTuningLevel =
  | "SINGLE_PASS"
  | "SINGLE_PASS_HQ"
  | "MULTI_PASS_HQ";
export const XavcHdProfileQualityTuningLevel = S.Literal(
  "SINGLE_PASS",
  "SINGLE_PASS_HQ",
  "MULTI_PASS_HQ",
);
export type XavcHdProfileTelecine = "NONE" | "HARD";
export const XavcHdProfileTelecine = S.Literal("NONE", "HARD");
export interface XavcHdProfileSettings {
  BitrateClass?: XavcHdProfileBitrateClass;
  FlickerAdaptiveQuantization?: XavcFlickerAdaptiveQuantization;
  GopBReference?: XavcGopBReference;
  GopClosedCadence?: number;
  HrdBufferSize?: number;
  InterlaceMode?: XavcInterlaceMode;
  QualityTuningLevel?: XavcHdProfileQualityTuningLevel;
  Slices?: number;
  Telecine?: XavcHdProfileTelecine;
}
export const XavcHdProfileSettings = S.suspend(() =>
  S.Struct({
    BitrateClass: S.optional(XavcHdProfileBitrateClass).pipe(
      T.JsonName("bitrateClass"),
    ),
    FlickerAdaptiveQuantization: S.optional(
      XavcFlickerAdaptiveQuantization,
    ).pipe(T.JsonName("flickerAdaptiveQuantization")),
    GopBReference: S.optional(XavcGopBReference).pipe(
      T.JsonName("gopBReference"),
    ),
    GopClosedCadence: S.optional(S.Number).pipe(T.JsonName("gopClosedCadence")),
    HrdBufferSize: S.optional(S.Number).pipe(T.JsonName("hrdBufferSize")),
    InterlaceMode: S.optional(XavcInterlaceMode).pipe(
      T.JsonName("interlaceMode"),
    ),
    QualityTuningLevel: S.optional(XavcHdProfileQualityTuningLevel).pipe(
      T.JsonName("qualityTuningLevel"),
    ),
    Slices: S.optional(S.Number).pipe(T.JsonName("slices")),
    Telecine: S.optional(XavcHdProfileTelecine).pipe(T.JsonName("telecine")),
  }),
).annotations({
  identifier: "XavcHdProfileSettings",
}) as any as S.Schema<XavcHdProfileSettings>;
export interface XavcSettings {
  AdaptiveQuantization?: XavcAdaptiveQuantization;
  EntropyEncoding?: XavcEntropyEncoding;
  FramerateControl?: XavcFramerateControl;
  FramerateConversionAlgorithm?: XavcFramerateConversionAlgorithm;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  PerFrameMetrics?: FrameMetricType[];
  Profile?: XavcProfile;
  SlowPal?: XavcSlowPal;
  Softness?: number;
  SpatialAdaptiveQuantization?: XavcSpatialAdaptiveQuantization;
  TemporalAdaptiveQuantization?: XavcTemporalAdaptiveQuantization;
  Xavc4kIntraCbgProfileSettings?: Xavc4kIntraCbgProfileSettings;
  Xavc4kIntraVbrProfileSettings?: Xavc4kIntraVbrProfileSettings;
  Xavc4kProfileSettings?: Xavc4kProfileSettings;
  XavcHdIntraCbgProfileSettings?: XavcHdIntraCbgProfileSettings;
  XavcHdProfileSettings?: XavcHdProfileSettings;
}
export const XavcSettings = S.suspend(() =>
  S.Struct({
    AdaptiveQuantization: S.optional(XavcAdaptiveQuantization).pipe(
      T.JsonName("adaptiveQuantization"),
    ),
    EntropyEncoding: S.optional(XavcEntropyEncoding).pipe(
      T.JsonName("entropyEncoding"),
    ),
    FramerateControl: S.optional(XavcFramerateControl).pipe(
      T.JsonName("framerateControl"),
    ),
    FramerateConversionAlgorithm: S.optional(
      XavcFramerateConversionAlgorithm,
    ).pipe(T.JsonName("framerateConversionAlgorithm")),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    PerFrameMetrics: S.optional(__listOfFrameMetricType).pipe(
      T.JsonName("perFrameMetrics"),
    ),
    Profile: S.optional(XavcProfile).pipe(T.JsonName("profile")),
    SlowPal: S.optional(XavcSlowPal).pipe(T.JsonName("slowPal")),
    Softness: S.optional(S.Number).pipe(T.JsonName("softness")),
    SpatialAdaptiveQuantization: S.optional(
      XavcSpatialAdaptiveQuantization,
    ).pipe(T.JsonName("spatialAdaptiveQuantization")),
    TemporalAdaptiveQuantization: S.optional(
      XavcTemporalAdaptiveQuantization,
    ).pipe(T.JsonName("temporalAdaptiveQuantization")),
    Xavc4kIntraCbgProfileSettings: S.optional(Xavc4kIntraCbgProfileSettings)
      .pipe(T.JsonName("xavc4kIntraCbgProfileSettings"))
      .annotations({ identifier: "Xavc4kIntraCbgProfileSettings" }),
    Xavc4kIntraVbrProfileSettings: S.optional(Xavc4kIntraVbrProfileSettings)
      .pipe(T.JsonName("xavc4kIntraVbrProfileSettings"))
      .annotations({ identifier: "Xavc4kIntraVbrProfileSettings" }),
    Xavc4kProfileSettings: S.optional(Xavc4kProfileSettings)
      .pipe(T.JsonName("xavc4kProfileSettings"))
      .annotations({ identifier: "Xavc4kProfileSettings" }),
    XavcHdIntraCbgProfileSettings: S.optional(XavcHdIntraCbgProfileSettings)
      .pipe(T.JsonName("xavcHdIntraCbgProfileSettings"))
      .annotations({ identifier: "XavcHdIntraCbgProfileSettings" }),
    XavcHdProfileSettings: S.optional(XavcHdProfileSettings)
      .pipe(T.JsonName("xavcHdProfileSettings"))
      .annotations({ identifier: "XavcHdProfileSettings" }),
  }),
).annotations({ identifier: "XavcSettings" }) as any as S.Schema<XavcSettings>;
export interface VideoCodecSettings {
  Av1Settings?: Av1Settings;
  AvcIntraSettings?: AvcIntraSettings;
  Codec?: VideoCodec;
  FrameCaptureSettings?: FrameCaptureSettings;
  GifSettings?: GifSettings;
  H264Settings?: H264Settings;
  H265Settings?: H265Settings;
  Mpeg2Settings?: Mpeg2Settings;
  PassthroughSettings?: PassthroughSettings;
  ProresSettings?: ProresSettings;
  UncompressedSettings?: UncompressedSettings;
  Vc3Settings?: Vc3Settings;
  Vp8Settings?: Vp8Settings;
  Vp9Settings?: Vp9Settings;
  XavcSettings?: XavcSettings;
}
export const VideoCodecSettings = S.suspend(() =>
  S.Struct({
    Av1Settings: S.optional(Av1Settings)
      .pipe(T.JsonName("av1Settings"))
      .annotations({ identifier: "Av1Settings" }),
    AvcIntraSettings: S.optional(AvcIntraSettings)
      .pipe(T.JsonName("avcIntraSettings"))
      .annotations({ identifier: "AvcIntraSettings" }),
    Codec: S.optional(VideoCodec).pipe(T.JsonName("codec")),
    FrameCaptureSettings: S.optional(FrameCaptureSettings)
      .pipe(T.JsonName("frameCaptureSettings"))
      .annotations({ identifier: "FrameCaptureSettings" }),
    GifSettings: S.optional(GifSettings)
      .pipe(T.JsonName("gifSettings"))
      .annotations({ identifier: "GifSettings" }),
    H264Settings: S.optional(H264Settings)
      .pipe(T.JsonName("h264Settings"))
      .annotations({ identifier: "H264Settings" }),
    H265Settings: S.optional(H265Settings)
      .pipe(T.JsonName("h265Settings"))
      .annotations({ identifier: "H265Settings" }),
    Mpeg2Settings: S.optional(Mpeg2Settings)
      .pipe(T.JsonName("mpeg2Settings"))
      .annotations({ identifier: "Mpeg2Settings" }),
    PassthroughSettings: S.optional(PassthroughSettings)
      .pipe(T.JsonName("passthroughSettings"))
      .annotations({ identifier: "PassthroughSettings" }),
    ProresSettings: S.optional(ProresSettings)
      .pipe(T.JsonName("proresSettings"))
      .annotations({ identifier: "ProresSettings" }),
    UncompressedSettings: S.optional(UncompressedSettings)
      .pipe(T.JsonName("uncompressedSettings"))
      .annotations({ identifier: "UncompressedSettings" }),
    Vc3Settings: S.optional(Vc3Settings)
      .pipe(T.JsonName("vc3Settings"))
      .annotations({ identifier: "Vc3Settings" }),
    Vp8Settings: S.optional(Vp8Settings)
      .pipe(T.JsonName("vp8Settings"))
      .annotations({ identifier: "Vp8Settings" }),
    Vp9Settings: S.optional(Vp9Settings)
      .pipe(T.JsonName("vp9Settings"))
      .annotations({ identifier: "Vp9Settings" }),
    XavcSettings: S.optional(XavcSettings)
      .pipe(T.JsonName("xavcSettings"))
      .annotations({ identifier: "XavcSettings" }),
  }),
).annotations({
  identifier: "VideoCodecSettings",
}) as any as S.Schema<VideoCodecSettings>;
export type ColorMetadata = "IGNORE" | "INSERT";
export const ColorMetadata = S.Literal("IGNORE", "INSERT");
export type DropFrameTimecode = "DISABLED" | "ENABLED";
export const DropFrameTimecode = S.Literal("DISABLED", "ENABLED");
export type RespondToAfd = "NONE" | "RESPOND" | "PASSTHROUGH";
export const RespondToAfd = S.Literal("NONE", "RESPOND", "PASSTHROUGH");
export type ScalingBehavior =
  | "DEFAULT"
  | "STRETCH_TO_OUTPUT"
  | "FIT"
  | "FIT_NO_UPSCALE"
  | "FILL";
export const ScalingBehavior = S.Literal(
  "DEFAULT",
  "STRETCH_TO_OUTPUT",
  "FIT",
  "FIT_NO_UPSCALE",
  "FILL",
);
export type VideoTimecodeInsertion = "DISABLED" | "PIC_TIMING_SEI";
export const VideoTimecodeInsertion = S.Literal("DISABLED", "PIC_TIMING_SEI");
export type TimecodeTrack = "DISABLED" | "ENABLED";
export const TimecodeTrack = S.Literal("DISABLED", "ENABLED");
export interface ClipLimits {
  MaximumRGBTolerance?: number;
  MaximumYUV?: number;
  MinimumRGBTolerance?: number;
  MinimumYUV?: number;
}
export const ClipLimits = S.suspend(() =>
  S.Struct({
    MaximumRGBTolerance: S.optional(S.Number).pipe(
      T.JsonName("maximumRGBTolerance"),
    ),
    MaximumYUV: S.optional(S.Number).pipe(T.JsonName("maximumYUV")),
    MinimumRGBTolerance: S.optional(S.Number).pipe(
      T.JsonName("minimumRGBTolerance"),
    ),
    MinimumYUV: S.optional(S.Number).pipe(T.JsonName("minimumYUV")),
  }),
).annotations({ identifier: "ClipLimits" }) as any as S.Schema<ClipLimits>;
export type ColorSpaceConversion =
  | "NONE"
  | "FORCE_601"
  | "FORCE_709"
  | "FORCE_HDR10"
  | "FORCE_HLG_2020"
  | "FORCE_P3DCI"
  | "FORCE_P3D65_SDR"
  | "FORCE_P3D65_HDR";
export const ColorSpaceConversion = S.Literal(
  "NONE",
  "FORCE_601",
  "FORCE_709",
  "FORCE_HDR10",
  "FORCE_HLG_2020",
  "FORCE_P3DCI",
  "FORCE_P3D65_SDR",
  "FORCE_P3D65_HDR",
);
export type HDRToSDRToneMapper = "PRESERVE_DETAILS" | "VIBRANT";
export const HDRToSDRToneMapper = S.Literal("PRESERVE_DETAILS", "VIBRANT");
export type SampleRangeConversion =
  | "LIMITED_RANGE_SQUEEZE"
  | "NONE"
  | "LIMITED_RANGE_CLIP";
export const SampleRangeConversion = S.Literal(
  "LIMITED_RANGE_SQUEEZE",
  "NONE",
  "LIMITED_RANGE_CLIP",
);
export interface ColorCorrector {
  Brightness?: number;
  ClipLimits?: ClipLimits;
  ColorSpaceConversion?: ColorSpaceConversion;
  Contrast?: number;
  Hdr10Metadata?: Hdr10Metadata;
  HdrToSdrToneMapper?: HDRToSDRToneMapper;
  Hue?: number;
  MaxLuminance?: number;
  SampleRangeConversion?: SampleRangeConversion;
  Saturation?: number;
  SdrReferenceWhiteLevel?: number;
}
export const ColorCorrector = S.suspend(() =>
  S.Struct({
    Brightness: S.optional(S.Number).pipe(T.JsonName("brightness")),
    ClipLimits: S.optional(ClipLimits)
      .pipe(T.JsonName("clipLimits"))
      .annotations({ identifier: "ClipLimits" }),
    ColorSpaceConversion: S.optional(ColorSpaceConversion).pipe(
      T.JsonName("colorSpaceConversion"),
    ),
    Contrast: S.optional(S.Number).pipe(T.JsonName("contrast")),
    Hdr10Metadata: S.optional(Hdr10Metadata)
      .pipe(T.JsonName("hdr10Metadata"))
      .annotations({ identifier: "Hdr10Metadata" }),
    HdrToSdrToneMapper: S.optional(HDRToSDRToneMapper).pipe(
      T.JsonName("hdrToSdrToneMapper"),
    ),
    Hue: S.optional(S.Number).pipe(T.JsonName("hue")),
    MaxLuminance: S.optional(S.Number).pipe(T.JsonName("maxLuminance")),
    SampleRangeConversion: S.optional(SampleRangeConversion).pipe(
      T.JsonName("sampleRangeConversion"),
    ),
    Saturation: S.optional(S.Number).pipe(T.JsonName("saturation")),
    SdrReferenceWhiteLevel: S.optional(S.Number).pipe(
      T.JsonName("sdrReferenceWhiteLevel"),
    ),
  }),
).annotations({
  identifier: "ColorCorrector",
}) as any as S.Schema<ColorCorrector>;
export type DeinterlaceAlgorithm =
  | "INTERPOLATE"
  | "INTERPOLATE_TICKER"
  | "BLEND"
  | "BLEND_TICKER"
  | "LINEAR_INTERPOLATION";
export const DeinterlaceAlgorithm = S.Literal(
  "INTERPOLATE",
  "INTERPOLATE_TICKER",
  "BLEND",
  "BLEND_TICKER",
  "LINEAR_INTERPOLATION",
);
export type DeinterlacerControl = "FORCE_ALL_FRAMES" | "NORMAL";
export const DeinterlacerControl = S.Literal("FORCE_ALL_FRAMES", "NORMAL");
export type DeinterlacerMode = "DEINTERLACE" | "INVERSE_TELECINE" | "ADAPTIVE";
export const DeinterlacerMode = S.Literal(
  "DEINTERLACE",
  "INVERSE_TELECINE",
  "ADAPTIVE",
);
export interface Deinterlacer {
  Algorithm?: DeinterlaceAlgorithm;
  Control?: DeinterlacerControl;
  Mode?: DeinterlacerMode;
}
export const Deinterlacer = S.suspend(() =>
  S.Struct({
    Algorithm: S.optional(DeinterlaceAlgorithm).pipe(T.JsonName("algorithm")),
    Control: S.optional(DeinterlacerControl).pipe(T.JsonName("control")),
    Mode: S.optional(DeinterlacerMode).pipe(T.JsonName("mode")),
  }),
).annotations({ identifier: "Deinterlacer" }) as any as S.Schema<Deinterlacer>;
export interface DolbyVisionLevel6Metadata {
  MaxCll?: number;
  MaxFall?: number;
}
export const DolbyVisionLevel6Metadata = S.suspend(() =>
  S.Struct({
    MaxCll: S.optional(S.Number).pipe(T.JsonName("maxCll")),
    MaxFall: S.optional(S.Number).pipe(T.JsonName("maxFall")),
  }),
).annotations({
  identifier: "DolbyVisionLevel6Metadata",
}) as any as S.Schema<DolbyVisionLevel6Metadata>;
export type DolbyVisionLevel6Mode = "PASSTHROUGH" | "RECALCULATE" | "SPECIFY";
export const DolbyVisionLevel6Mode = S.Literal(
  "PASSTHROUGH",
  "RECALCULATE",
  "SPECIFY",
);
export type DolbyVisionMapping = "HDR10_NOMAP" | "HDR10_1000";
export const DolbyVisionMapping = S.Literal("HDR10_NOMAP", "HDR10_1000");
export type DolbyVisionProfile = "PROFILE_5" | "PROFILE_8_1";
export const DolbyVisionProfile = S.Literal("PROFILE_5", "PROFILE_8_1");
export interface DolbyVision {
  L6Metadata?: DolbyVisionLevel6Metadata;
  L6Mode?: DolbyVisionLevel6Mode;
  Mapping?: DolbyVisionMapping;
  Profile?: DolbyVisionProfile;
}
export const DolbyVision = S.suspend(() =>
  S.Struct({
    L6Metadata: S.optional(DolbyVisionLevel6Metadata)
      .pipe(T.JsonName("l6Metadata"))
      .annotations({ identifier: "DolbyVisionLevel6Metadata" }),
    L6Mode: S.optional(DolbyVisionLevel6Mode).pipe(T.JsonName("l6Mode")),
    Mapping: S.optional(DolbyVisionMapping).pipe(T.JsonName("mapping")),
    Profile: S.optional(DolbyVisionProfile).pipe(T.JsonName("profile")),
  }),
).annotations({ identifier: "DolbyVision" }) as any as S.Schema<DolbyVision>;
export interface Hdr10Plus {
  MasteringMonitorNits?: number;
  TargetMonitorNits?: number;
}
export const Hdr10Plus = S.suspend(() =>
  S.Struct({
    MasteringMonitorNits: S.optional(S.Number).pipe(
      T.JsonName("masteringMonitorNits"),
    ),
    TargetMonitorNits: S.optional(S.Number).pipe(
      T.JsonName("targetMonitorNits"),
    ),
  }),
).annotations({ identifier: "Hdr10Plus" }) as any as S.Schema<Hdr10Plus>;
export type NoiseReducerFilter =
  | "BILATERAL"
  | "MEAN"
  | "GAUSSIAN"
  | "LANCZOS"
  | "SHARPEN"
  | "CONSERVE"
  | "SPATIAL"
  | "TEMPORAL";
export const NoiseReducerFilter = S.Literal(
  "BILATERAL",
  "MEAN",
  "GAUSSIAN",
  "LANCZOS",
  "SHARPEN",
  "CONSERVE",
  "SPATIAL",
  "TEMPORAL",
);
export interface NoiseReducerFilterSettings {
  Strength?: number;
}
export const NoiseReducerFilterSettings = S.suspend(() =>
  S.Struct({ Strength: S.optional(S.Number).pipe(T.JsonName("strength")) }),
).annotations({
  identifier: "NoiseReducerFilterSettings",
}) as any as S.Schema<NoiseReducerFilterSettings>;
export interface NoiseReducerSpatialFilterSettings {
  PostFilterSharpenStrength?: number;
  Speed?: number;
  Strength?: number;
}
export const NoiseReducerSpatialFilterSettings = S.suspend(() =>
  S.Struct({
    PostFilterSharpenStrength: S.optional(S.Number).pipe(
      T.JsonName("postFilterSharpenStrength"),
    ),
    Speed: S.optional(S.Number).pipe(T.JsonName("speed")),
    Strength: S.optional(S.Number).pipe(T.JsonName("strength")),
  }),
).annotations({
  identifier: "NoiseReducerSpatialFilterSettings",
}) as any as S.Schema<NoiseReducerSpatialFilterSettings>;
export type NoiseFilterPostTemporalSharpening = "DISABLED" | "ENABLED" | "AUTO";
export const NoiseFilterPostTemporalSharpening = S.Literal(
  "DISABLED",
  "ENABLED",
  "AUTO",
);
export type NoiseFilterPostTemporalSharpeningStrength =
  | "LOW"
  | "MEDIUM"
  | "HIGH";
export const NoiseFilterPostTemporalSharpeningStrength = S.Literal(
  "LOW",
  "MEDIUM",
  "HIGH",
);
export interface NoiseReducerTemporalFilterSettings {
  AggressiveMode?: number;
  PostTemporalSharpening?: NoiseFilterPostTemporalSharpening;
  PostTemporalSharpeningStrength?: NoiseFilterPostTemporalSharpeningStrength;
  Speed?: number;
  Strength?: number;
}
export const NoiseReducerTemporalFilterSettings = S.suspend(() =>
  S.Struct({
    AggressiveMode: S.optional(S.Number).pipe(T.JsonName("aggressiveMode")),
    PostTemporalSharpening: S.optional(NoiseFilterPostTemporalSharpening).pipe(
      T.JsonName("postTemporalSharpening"),
    ),
    PostTemporalSharpeningStrength: S.optional(
      NoiseFilterPostTemporalSharpeningStrength,
    ).pipe(T.JsonName("postTemporalSharpeningStrength")),
    Speed: S.optional(S.Number).pipe(T.JsonName("speed")),
    Strength: S.optional(S.Number).pipe(T.JsonName("strength")),
  }),
).annotations({
  identifier: "NoiseReducerTemporalFilterSettings",
}) as any as S.Schema<NoiseReducerTemporalFilterSettings>;
export interface NoiseReducer {
  Filter?: NoiseReducerFilter;
  FilterSettings?: NoiseReducerFilterSettings;
  SpatialFilterSettings?: NoiseReducerSpatialFilterSettings;
  TemporalFilterSettings?: NoiseReducerTemporalFilterSettings;
}
export const NoiseReducer = S.suspend(() =>
  S.Struct({
    Filter: S.optional(NoiseReducerFilter).pipe(T.JsonName("filter")),
    FilterSettings: S.optional(NoiseReducerFilterSettings)
      .pipe(T.JsonName("filterSettings"))
      .annotations({ identifier: "NoiseReducerFilterSettings" }),
    SpatialFilterSettings: S.optional(NoiseReducerSpatialFilterSettings)
      .pipe(T.JsonName("spatialFilterSettings"))
      .annotations({ identifier: "NoiseReducerSpatialFilterSettings" }),
    TemporalFilterSettings: S.optional(NoiseReducerTemporalFilterSettings)
      .pipe(T.JsonName("temporalFilterSettings"))
      .annotations({ identifier: "NoiseReducerTemporalFilterSettings" }),
  }),
).annotations({ identifier: "NoiseReducer" }) as any as S.Schema<NoiseReducer>;
export type WatermarkingStrength =
  | "LIGHTEST"
  | "LIGHTER"
  | "DEFAULT"
  | "STRONGER"
  | "STRONGEST";
export const WatermarkingStrength = S.Literal(
  "LIGHTEST",
  "LIGHTER",
  "DEFAULT",
  "STRONGER",
  "STRONGEST",
);
export interface NexGuardFileMarkerSettings {
  License?: string;
  Payload?: number;
  Preset?: string;
  Strength?: WatermarkingStrength;
}
export const NexGuardFileMarkerSettings = S.suspend(() =>
  S.Struct({
    License: S.optional(S.String).pipe(T.JsonName("license")),
    Payload: S.optional(S.Number).pipe(T.JsonName("payload")),
    Preset: S.optional(S.String).pipe(T.JsonName("preset")),
    Strength: S.optional(WatermarkingStrength).pipe(T.JsonName("strength")),
  }),
).annotations({
  identifier: "NexGuardFileMarkerSettings",
}) as any as S.Schema<NexGuardFileMarkerSettings>;
export interface PartnerWatermarking {
  NexguardFileMarkerSettings?: NexGuardFileMarkerSettings;
}
export const PartnerWatermarking = S.suspend(() =>
  S.Struct({
    NexguardFileMarkerSettings: S.optional(NexGuardFileMarkerSettings)
      .pipe(T.JsonName("nexguardFileMarkerSettings"))
      .annotations({ identifier: "NexGuardFileMarkerSettings" }),
  }),
).annotations({
  identifier: "PartnerWatermarking",
}) as any as S.Schema<PartnerWatermarking>;
export type TimecodeBurninPosition =
  | "TOP_CENTER"
  | "TOP_LEFT"
  | "TOP_RIGHT"
  | "MIDDLE_LEFT"
  | "MIDDLE_CENTER"
  | "MIDDLE_RIGHT"
  | "BOTTOM_LEFT"
  | "BOTTOM_CENTER"
  | "BOTTOM_RIGHT";
export const TimecodeBurninPosition = S.Literal(
  "TOP_CENTER",
  "TOP_LEFT",
  "TOP_RIGHT",
  "MIDDLE_LEFT",
  "MIDDLE_CENTER",
  "MIDDLE_RIGHT",
  "BOTTOM_LEFT",
  "BOTTOM_CENTER",
  "BOTTOM_RIGHT",
);
export interface TimecodeBurnin {
  FontSize?: number;
  Position?: TimecodeBurninPosition;
  Prefix?: string;
}
export const TimecodeBurnin = S.suspend(() =>
  S.Struct({
    FontSize: S.optional(S.Number).pipe(T.JsonName("fontSize")),
    Position: S.optional(TimecodeBurninPosition).pipe(T.JsonName("position")),
    Prefix: S.optional(S.String).pipe(T.JsonName("prefix")),
  }),
).annotations({
  identifier: "TimecodeBurnin",
}) as any as S.Schema<TimecodeBurnin>;
export interface VideoPreprocessor {
  ColorCorrector?: ColorCorrector;
  Deinterlacer?: Deinterlacer;
  DolbyVision?: DolbyVision;
  Hdr10Plus?: Hdr10Plus;
  ImageInserter?: ImageInserter;
  NoiseReducer?: NoiseReducer;
  PartnerWatermarking?: PartnerWatermarking;
  TimecodeBurnin?: TimecodeBurnin;
}
export const VideoPreprocessor = S.suspend(() =>
  S.Struct({
    ColorCorrector: S.optional(ColorCorrector)
      .pipe(T.JsonName("colorCorrector"))
      .annotations({ identifier: "ColorCorrector" }),
    Deinterlacer: S.optional(Deinterlacer)
      .pipe(T.JsonName("deinterlacer"))
      .annotations({ identifier: "Deinterlacer" }),
    DolbyVision: S.optional(DolbyVision)
      .pipe(T.JsonName("dolbyVision"))
      .annotations({ identifier: "DolbyVision" }),
    Hdr10Plus: S.optional(Hdr10Plus)
      .pipe(T.JsonName("hdr10Plus"))
      .annotations({ identifier: "Hdr10Plus" }),
    ImageInserter: S.optional(ImageInserter)
      .pipe(T.JsonName("imageInserter"))
      .annotations({ identifier: "ImageInserter" }),
    NoiseReducer: S.optional(NoiseReducer)
      .pipe(T.JsonName("noiseReducer"))
      .annotations({ identifier: "NoiseReducer" }),
    PartnerWatermarking: S.optional(PartnerWatermarking)
      .pipe(T.JsonName("partnerWatermarking"))
      .annotations({ identifier: "PartnerWatermarking" }),
    TimecodeBurnin: S.optional(TimecodeBurnin)
      .pipe(T.JsonName("timecodeBurnin"))
      .annotations({ identifier: "TimecodeBurnin" }),
  }),
).annotations({
  identifier: "VideoPreprocessor",
}) as any as S.Schema<VideoPreprocessor>;
export interface VideoDescription {
  AfdSignaling?: AfdSignaling;
  AntiAlias?: AntiAlias;
  ChromaPositionMode?: ChromaPositionMode;
  CodecSettings?: VideoCodecSettings;
  ColorMetadata?: ColorMetadata;
  Crop?: Rectangle;
  DropFrameTimecode?: DropFrameTimecode;
  FixedAfd?: number;
  Height?: number;
  Position?: Rectangle;
  RespondToAfd?: RespondToAfd;
  ScalingBehavior?: ScalingBehavior;
  Sharpness?: number;
  TimecodeInsertion?: VideoTimecodeInsertion;
  TimecodeTrack?: TimecodeTrack;
  VideoPreprocessors?: VideoPreprocessor;
  Width?: number;
}
export const VideoDescription = S.suspend(() =>
  S.Struct({
    AfdSignaling: S.optional(AfdSignaling).pipe(T.JsonName("afdSignaling")),
    AntiAlias: S.optional(AntiAlias).pipe(T.JsonName("antiAlias")),
    ChromaPositionMode: S.optional(ChromaPositionMode).pipe(
      T.JsonName("chromaPositionMode"),
    ),
    CodecSettings: S.optional(VideoCodecSettings)
      .pipe(T.JsonName("codecSettings"))
      .annotations({ identifier: "VideoCodecSettings" }),
    ColorMetadata: S.optional(ColorMetadata).pipe(T.JsonName("colorMetadata")),
    Crop: S.optional(Rectangle)
      .pipe(T.JsonName("crop"))
      .annotations({ identifier: "Rectangle" }),
    DropFrameTimecode: S.optional(DropFrameTimecode).pipe(
      T.JsonName("dropFrameTimecode"),
    ),
    FixedAfd: S.optional(S.Number).pipe(T.JsonName("fixedAfd")),
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    Position: S.optional(Rectangle)
      .pipe(T.JsonName("position"))
      .annotations({ identifier: "Rectangle" }),
    RespondToAfd: S.optional(RespondToAfd).pipe(T.JsonName("respondToAfd")),
    ScalingBehavior: S.optional(ScalingBehavior).pipe(
      T.JsonName("scalingBehavior"),
    ),
    Sharpness: S.optional(S.Number).pipe(T.JsonName("sharpness")),
    TimecodeInsertion: S.optional(VideoTimecodeInsertion).pipe(
      T.JsonName("timecodeInsertion"),
    ),
    TimecodeTrack: S.optional(TimecodeTrack).pipe(T.JsonName("timecodeTrack")),
    VideoPreprocessors: S.optional(VideoPreprocessor)
      .pipe(T.JsonName("videoPreprocessors"))
      .annotations({ identifier: "VideoPreprocessor" }),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
  }),
).annotations({
  identifier: "VideoDescription",
}) as any as S.Schema<VideoDescription>;
export interface Output {
  AudioDescriptions?: AudioDescription[];
  CaptionDescriptions?: CaptionDescription[];
  ContainerSettings?: ContainerSettings;
  Extension?: string;
  NameModifier?: string;
  OutputSettings?: OutputSettings;
  Preset?: string;
  VideoDescription?: VideoDescription;
}
export const Output = S.suspend(() =>
  S.Struct({
    AudioDescriptions: S.optional(__listOfAudioDescription).pipe(
      T.JsonName("audioDescriptions"),
    ),
    CaptionDescriptions: S.optional(__listOfCaptionDescription).pipe(
      T.JsonName("captionDescriptions"),
    ),
    ContainerSettings: S.optional(ContainerSettings)
      .pipe(T.JsonName("containerSettings"))
      .annotations({ identifier: "ContainerSettings" }),
    Extension: S.optional(S.String).pipe(T.JsonName("extension")),
    NameModifier: S.optional(S.String).pipe(T.JsonName("nameModifier")),
    OutputSettings: S.optional(OutputSettings)
      .pipe(T.JsonName("outputSettings"))
      .annotations({ identifier: "OutputSettings" }),
    Preset: S.optional(S.String).pipe(T.JsonName("preset")),
    VideoDescription: S.optional(VideoDescription)
      .pipe(T.JsonName("videoDescription"))
      .annotations({ identifier: "VideoDescription" }),
  }),
).annotations({ identifier: "Output" }) as any as S.Schema<Output>;
export type __listOfOutput = Output[];
export const __listOfOutput = S.Array(Output);
export interface OutputGroup {
  AutomatedEncodingSettings?: AutomatedEncodingSettings;
  CustomName?: string;
  Name?: string;
  OutputGroupSettings?: OutputGroupSettings;
  Outputs?: Output[];
}
export const OutputGroup = S.suspend(() =>
  S.Struct({
    AutomatedEncodingSettings: S.optional(AutomatedEncodingSettings)
      .pipe(T.JsonName("automatedEncodingSettings"))
      .annotations({ identifier: "AutomatedEncodingSettings" }),
    CustomName: S.optional(S.String).pipe(T.JsonName("customName")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    OutputGroupSettings: S.optional(OutputGroupSettings)
      .pipe(T.JsonName("outputGroupSettings"))
      .annotations({ identifier: "OutputGroupSettings" }),
    Outputs: S.optional(__listOfOutput).pipe(T.JsonName("outputs")),
  }),
).annotations({ identifier: "OutputGroup" }) as any as S.Schema<OutputGroup>;
export type __listOfOutputGroup = OutputGroup[];
export const __listOfOutputGroup = S.Array(OutputGroup);
export type TimecodeSource = "EMBEDDED" | "ZEROBASED" | "SPECIFIEDSTART";
export const TimecodeSource = S.Literal(
  "EMBEDDED",
  "ZEROBASED",
  "SPECIFIEDSTART",
);
export interface TimecodeConfig {
  Anchor?: string;
  Source?: TimecodeSource;
  Start?: string;
  TimestampOffset?: string;
}
export const TimecodeConfig = S.suspend(() =>
  S.Struct({
    Anchor: S.optional(S.String).pipe(T.JsonName("anchor")),
    Source: S.optional(TimecodeSource).pipe(T.JsonName("source")),
    Start: S.optional(S.String).pipe(T.JsonName("start")),
    TimestampOffset: S.optional(S.String).pipe(T.JsonName("timestampOffset")),
  }),
).annotations({
  identifier: "TimecodeConfig",
}) as any as S.Schema<TimecodeConfig>;
export interface Id3Insertion {
  Id3?: string;
  Timecode?: string;
}
export const Id3Insertion = S.suspend(() =>
  S.Struct({
    Id3: S.optional(S.String).pipe(T.JsonName("id3")),
    Timecode: S.optional(S.String).pipe(T.JsonName("timecode")),
  }),
).annotations({ identifier: "Id3Insertion" }) as any as S.Schema<Id3Insertion>;
export type __listOfId3Insertion = Id3Insertion[];
export const __listOfId3Insertion = S.Array(Id3Insertion);
export interface TimedMetadataInsertion {
  Id3Insertions?: Id3Insertion[];
}
export const TimedMetadataInsertion = S.suspend(() =>
  S.Struct({
    Id3Insertions: S.optional(__listOfId3Insertion).pipe(
      T.JsonName("id3Insertions"),
    ),
  }),
).annotations({
  identifier: "TimedMetadataInsertion",
}) as any as S.Schema<TimedMetadataInsertion>;
export interface JobTemplateSettings {
  AdAvailOffset?: number;
  AvailBlanking?: AvailBlanking;
  ColorConversion3DLUTSettings?: ColorConversion3DLUTSetting[];
  Esam?: EsamSettings;
  ExtendedDataServices?: ExtendedDataServices;
  FollowSource?: number;
  Inputs?: InputTemplate[];
  KantarWatermark?: KantarWatermarkSettings;
  MotionImageInserter?: MotionImageInserter;
  NielsenConfiguration?: NielsenConfiguration;
  NielsenNonLinearWatermark?: NielsenNonLinearWatermarkSettings;
  OutputGroups?: OutputGroup[];
  TimecodeConfig?: TimecodeConfig;
  TimedMetadataInsertion?: TimedMetadataInsertion;
}
export const JobTemplateSettings = S.suspend(() =>
  S.Struct({
    AdAvailOffset: S.optional(S.Number).pipe(T.JsonName("adAvailOffset")),
    AvailBlanking: S.optional(AvailBlanking)
      .pipe(T.JsonName("availBlanking"))
      .annotations({ identifier: "AvailBlanking" }),
    ColorConversion3DLUTSettings: S.optional(
      __listOfColorConversion3DLUTSetting,
    ).pipe(T.JsonName("colorConversion3DLUTSettings")),
    Esam: S.optional(EsamSettings)
      .pipe(T.JsonName("esam"))
      .annotations({ identifier: "EsamSettings" }),
    ExtendedDataServices: S.optional(ExtendedDataServices)
      .pipe(T.JsonName("extendedDataServices"))
      .annotations({ identifier: "ExtendedDataServices" }),
    FollowSource: S.optional(S.Number).pipe(T.JsonName("followSource")),
    Inputs: S.optional(__listOfInputTemplate).pipe(T.JsonName("inputs")),
    KantarWatermark: S.optional(KantarWatermarkSettings)
      .pipe(T.JsonName("kantarWatermark"))
      .annotations({ identifier: "KantarWatermarkSettings" }),
    MotionImageInserter: S.optional(MotionImageInserter)
      .pipe(T.JsonName("motionImageInserter"))
      .annotations({ identifier: "MotionImageInserter" }),
    NielsenConfiguration: S.optional(NielsenConfiguration)
      .pipe(T.JsonName("nielsenConfiguration"))
      .annotations({ identifier: "NielsenConfiguration" }),
    NielsenNonLinearWatermark: S.optional(NielsenNonLinearWatermarkSettings)
      .pipe(T.JsonName("nielsenNonLinearWatermark"))
      .annotations({ identifier: "NielsenNonLinearWatermarkSettings" }),
    OutputGroups: S.optional(__listOfOutputGroup).pipe(
      T.JsonName("outputGroups"),
    ),
    TimecodeConfig: S.optional(TimecodeConfig)
      .pipe(T.JsonName("timecodeConfig"))
      .annotations({ identifier: "TimecodeConfig" }),
    TimedMetadataInsertion: S.optional(TimedMetadataInsertion)
      .pipe(T.JsonName("timedMetadataInsertion"))
      .annotations({ identifier: "TimedMetadataInsertion" }),
  }),
).annotations({
  identifier: "JobTemplateSettings",
}) as any as S.Schema<JobTemplateSettings>;
export interface UpdateJobTemplateRequest {
  AccelerationSettings?: AccelerationSettings;
  Category?: string;
  Description?: string;
  HopDestinations?: HopDestination[];
  Name: string;
  Priority?: number;
  Queue?: string;
  Settings?: JobTemplateSettings;
  StatusUpdateInterval?: StatusUpdateInterval;
}
export const UpdateJobTemplateRequest = S.suspend(() =>
  S.Struct({
    AccelerationSettings: S.optional(AccelerationSettings)
      .pipe(T.JsonName("accelerationSettings"))
      .annotations({ identifier: "AccelerationSettings" }),
    Category: S.optional(S.String).pipe(T.JsonName("category")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    HopDestinations: S.optional(__listOfHopDestination).pipe(
      T.JsonName("hopDestinations"),
    ),
    Name: S.String.pipe(T.HttpLabel("Name")),
    Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
    Queue: S.optional(S.String).pipe(T.JsonName("queue")),
    Settings: S.optional(JobTemplateSettings)
      .pipe(T.JsonName("settings"))
      .annotations({ identifier: "JobTemplateSettings" }),
    StatusUpdateInterval: S.optional(StatusUpdateInterval).pipe(
      T.JsonName("statusUpdateInterval"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/2017-08-29/jobTemplates/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateJobTemplateRequest",
}) as any as S.Schema<UpdateJobTemplateRequest>;
export interface CaptionDescriptionPreset {
  CustomLanguageCode?: string;
  DestinationSettings?: CaptionDestinationSettings;
  LanguageCode?: LanguageCode;
  LanguageDescription?: string;
}
export const CaptionDescriptionPreset = S.suspend(() =>
  S.Struct({
    CustomLanguageCode: S.optional(S.String).pipe(
      T.JsonName("customLanguageCode"),
    ),
    DestinationSettings: S.optional(CaptionDestinationSettings)
      .pipe(T.JsonName("destinationSettings"))
      .annotations({ identifier: "CaptionDestinationSettings" }),
    LanguageCode: S.optional(LanguageCode).pipe(T.JsonName("languageCode")),
    LanguageDescription: S.optional(S.String).pipe(
      T.JsonName("languageDescription"),
    ),
  }),
).annotations({
  identifier: "CaptionDescriptionPreset",
}) as any as S.Schema<CaptionDescriptionPreset>;
export type __listOfCaptionDescriptionPreset = CaptionDescriptionPreset[];
export const __listOfCaptionDescriptionPreset = S.Array(
  CaptionDescriptionPreset,
);
export interface PresetSettings {
  AudioDescriptions?: AudioDescription[];
  CaptionDescriptions?: CaptionDescriptionPreset[];
  ContainerSettings?: ContainerSettings;
  VideoDescription?: VideoDescription;
}
export const PresetSettings = S.suspend(() =>
  S.Struct({
    AudioDescriptions: S.optional(__listOfAudioDescription).pipe(
      T.JsonName("audioDescriptions"),
    ),
    CaptionDescriptions: S.optional(__listOfCaptionDescriptionPreset).pipe(
      T.JsonName("captionDescriptions"),
    ),
    ContainerSettings: S.optional(ContainerSettings)
      .pipe(T.JsonName("containerSettings"))
      .annotations({ identifier: "ContainerSettings" }),
    VideoDescription: S.optional(VideoDescription)
      .pipe(T.JsonName("videoDescription"))
      .annotations({ identifier: "VideoDescription" }),
  }),
).annotations({
  identifier: "PresetSettings",
}) as any as S.Schema<PresetSettings>;
export interface UpdatePresetRequest {
  Category?: string;
  Description?: string;
  Name: string;
  Settings?: PresetSettings;
}
export const UpdatePresetRequest = S.suspend(() =>
  S.Struct({
    Category: S.optional(S.String).pipe(T.JsonName("category")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Name: S.String.pipe(T.HttpLabel("Name")),
    Settings: S.optional(PresetSettings)
      .pipe(T.JsonName("settings"))
      .annotations({ identifier: "PresetSettings" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/2017-08-29/presets/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePresetRequest",
}) as any as S.Schema<UpdatePresetRequest>;
export type Commitment = "ONE_YEAR";
export const Commitment = S.Literal("ONE_YEAR");
export type RenewalType = "AUTO_RENEW" | "EXPIRE";
export const RenewalType = S.Literal("AUTO_RENEW", "EXPIRE");
export interface ReservationPlanSettings {
  Commitment?: Commitment;
  RenewalType?: RenewalType;
  ReservedSlots?: number;
}
export const ReservationPlanSettings = S.suspend(() =>
  S.Struct({
    Commitment: S.optional(Commitment).pipe(T.JsonName("commitment")),
    RenewalType: S.optional(RenewalType).pipe(T.JsonName("renewalType")),
    ReservedSlots: S.optional(S.Number).pipe(T.JsonName("reservedSlots")),
  }),
).annotations({
  identifier: "ReservationPlanSettings",
}) as any as S.Schema<ReservationPlanSettings>;
export interface UpdateQueueRequest {
  ConcurrentJobs?: number;
  Description?: string;
  Name: string;
  ReservationPlanSettings?: ReservationPlanSettings;
  Status?: QueueStatus;
}
export const UpdateQueueRequest = S.suspend(() =>
  S.Struct({
    ConcurrentJobs: S.optional(S.Number).pipe(T.JsonName("concurrentJobs")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Name: S.String.pipe(T.HttpLabel("Name")),
    ReservationPlanSettings: S.optional(ReservationPlanSettings)
      .pipe(T.JsonName("reservationPlanSettings"))
      .annotations({ identifier: "ReservationPlanSettings" }),
    Status: S.optional(QueueStatus).pipe(T.JsonName("status")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/2017-08-29/queues/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateQueueRequest",
}) as any as S.Schema<UpdateQueueRequest>;
export type JobsQueryFilterKey =
  | "queue"
  | "status"
  | "fileInput"
  | "jobEngineVersionRequested"
  | "jobEngineVersionUsed"
  | "audioCodec"
  | "videoCodec";
export const JobsQueryFilterKey = S.Literal(
  "queue",
  "status",
  "fileInput",
  "jobEngineVersionRequested",
  "jobEngineVersionUsed",
  "audioCodec",
  "videoCodec",
);
export type __listOf__stringMax100 = string[];
export const __listOf__stringMax100 = S.Array(S.String);
export type AccelerationStatus =
  | "NOT_APPLICABLE"
  | "IN_PROGRESS"
  | "ACCELERATED"
  | "NOT_ACCELERATED";
export const AccelerationStatus = S.Literal(
  "NOT_APPLICABLE",
  "IN_PROGRESS",
  "ACCELERATED",
  "NOT_ACCELERATED",
);
export type JobPhase = "PROBING" | "TRANSCODING" | "UPLOADING";
export const JobPhase = S.Literal("PROBING", "TRANSCODING", "UPLOADING");
export interface JobMessages {
  Info?: string[];
  Warning?: string[];
}
export const JobMessages = S.suspend(() =>
  S.Struct({
    Info: S.optional(__listOf__string).pipe(T.JsonName("info")),
    Warning: S.optional(__listOf__string).pipe(T.JsonName("warning")),
  }),
).annotations({ identifier: "JobMessages" }) as any as S.Schema<JobMessages>;
export interface VideoDetail {
  HeightInPx?: number;
  WidthInPx?: number;
}
export const VideoDetail = S.suspend(() =>
  S.Struct({
    HeightInPx: S.optional(S.Number).pipe(T.JsonName("heightInPx")),
    WidthInPx: S.optional(S.Number).pipe(T.JsonName("widthInPx")),
  }),
).annotations({ identifier: "VideoDetail" }) as any as S.Schema<VideoDetail>;
export interface OutputDetail {
  DurationInMs?: number;
  VideoDetails?: VideoDetail;
}
export const OutputDetail = S.suspend(() =>
  S.Struct({
    DurationInMs: S.optional(S.Number).pipe(T.JsonName("durationInMs")),
    VideoDetails: S.optional(VideoDetail)
      .pipe(T.JsonName("videoDetails"))
      .annotations({ identifier: "VideoDetail" }),
  }),
).annotations({ identifier: "OutputDetail" }) as any as S.Schema<OutputDetail>;
export type __listOfOutputDetail = OutputDetail[];
export const __listOfOutputDetail = S.Array(OutputDetail);
export interface OutputGroupDetail {
  OutputDetails?: OutputDetail[];
}
export const OutputGroupDetail = S.suspend(() =>
  S.Struct({
    OutputDetails: S.optional(__listOfOutputDetail).pipe(
      T.JsonName("outputDetails"),
    ),
  }),
).annotations({
  identifier: "OutputGroupDetail",
}) as any as S.Schema<OutputGroupDetail>;
export type __listOfOutputGroupDetail = OutputGroupDetail[];
export const __listOfOutputGroupDetail = S.Array(OutputGroupDetail);
export interface QueueTransition {
  DestinationQueue?: string;
  SourceQueue?: string;
  Timestamp?: Date;
}
export const QueueTransition = S.suspend(() =>
  S.Struct({
    DestinationQueue: S.optional(S.String).pipe(T.JsonName("destinationQueue")),
    SourceQueue: S.optional(S.String).pipe(T.JsonName("sourceQueue")),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("timestamp"),
    ),
  }),
).annotations({
  identifier: "QueueTransition",
}) as any as S.Schema<QueueTransition>;
export type __listOfQueueTransition = QueueTransition[];
export const __listOfQueueTransition = S.Array(QueueTransition);
export type DecryptionMode = "AES_CTR" | "AES_CBC" | "AES_GCM";
export const DecryptionMode = S.Literal("AES_CTR", "AES_CBC", "AES_GCM");
export interface InputDecryptionSettings {
  DecryptionMode?: DecryptionMode;
  EncryptedDecryptionKey?: string;
  InitializationVector?: string;
  KmsKeyRegion?: string;
}
export const InputDecryptionSettings = S.suspend(() =>
  S.Struct({
    DecryptionMode: S.optional(DecryptionMode).pipe(
      T.JsonName("decryptionMode"),
    ),
    EncryptedDecryptionKey: S.optional(S.String).pipe(
      T.JsonName("encryptedDecryptionKey"),
    ),
    InitializationVector: S.optional(S.String).pipe(
      T.JsonName("initializationVector"),
    ),
    KmsKeyRegion: S.optional(S.String).pipe(T.JsonName("kmsKeyRegion")),
  }),
).annotations({
  identifier: "InputDecryptionSettings",
}) as any as S.Schema<InputDecryptionSettings>;
export type __listOf__stringPatternS3ASSETMAPXml = string[];
export const __listOf__stringPatternS3ASSETMAPXml = S.Array(S.String);
export type TamsGapHandling =
  | "SKIP_GAPS"
  | "FILL_WITH_BLACK"
  | "HOLD_LAST_FRAME";
export const TamsGapHandling = S.Literal(
  "SKIP_GAPS",
  "FILL_WITH_BLACK",
  "HOLD_LAST_FRAME",
);
export interface InputTamsSettings {
  AuthConnectionArn?: string;
  GapHandling?: TamsGapHandling;
  SourceId?: string;
  Timerange?: string;
}
export const InputTamsSettings = S.suspend(() =>
  S.Struct({
    AuthConnectionArn: S.optional(S.String).pipe(
      T.JsonName("authConnectionArn"),
    ),
    GapHandling: S.optional(TamsGapHandling).pipe(T.JsonName("gapHandling")),
    SourceId: S.optional(S.String).pipe(T.JsonName("sourceId")),
    Timerange: S.optional(S.String).pipe(T.JsonName("timerange")),
  }),
).annotations({
  identifier: "InputTamsSettings",
}) as any as S.Schema<InputTamsSettings>;
export interface InputVideoGenerator {
  Channels?: number;
  Duration?: number;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  Height?: number;
  ImageInput?: string;
  SampleRate?: number;
  Width?: number;
}
export const InputVideoGenerator = S.suspend(() =>
  S.Struct({
    Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
    Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    ImageInput: S.optional(S.String).pipe(T.JsonName("imageInput")),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
  }),
).annotations({
  identifier: "InputVideoGenerator",
}) as any as S.Schema<InputVideoGenerator>;
export interface Input {
  AdvancedInputFilter?: AdvancedInputFilter;
  AdvancedInputFilterSettings?: AdvancedInputFilterSettings;
  AudioSelectorGroups?: { [key: string]: AudioSelectorGroup };
  AudioSelectors?: { [key: string]: AudioSelector };
  CaptionSelectors?: { [key: string]: CaptionSelector };
  Crop?: Rectangle;
  DeblockFilter?: InputDeblockFilter;
  DecryptionSettings?: InputDecryptionSettings;
  DenoiseFilter?: InputDenoiseFilter;
  DolbyVisionMetadataXml?: string;
  DynamicAudioSelectors?: { [key: string]: DynamicAudioSelector };
  FileInput?: string;
  FilterEnable?: InputFilterEnable;
  FilterStrength?: number;
  ImageInserter?: ImageInserter;
  InputClippings?: InputClipping[];
  InputScanType?: InputScanType;
  Position?: Rectangle;
  ProgramNumber?: number;
  PsiControl?: InputPsiControl;
  SupplementalImps?: string[];
  TamsSettings?: InputTamsSettings;
  TimecodeSource?: InputTimecodeSource;
  TimecodeStart?: string;
  VideoGenerator?: InputVideoGenerator;
  VideoOverlays?: VideoOverlay[];
  VideoSelector?: VideoSelector;
}
export const Input = S.suspend(() =>
  S.Struct({
    AdvancedInputFilter: S.optional(AdvancedInputFilter).pipe(
      T.JsonName("advancedInputFilter"),
    ),
    AdvancedInputFilterSettings: S.optional(AdvancedInputFilterSettings)
      .pipe(T.JsonName("advancedInputFilterSettings"))
      .annotations({ identifier: "AdvancedInputFilterSettings" }),
    AudioSelectorGroups: S.optional(__mapOfAudioSelectorGroup).pipe(
      T.JsonName("audioSelectorGroups"),
    ),
    AudioSelectors: S.optional(__mapOfAudioSelector).pipe(
      T.JsonName("audioSelectors"),
    ),
    CaptionSelectors: S.optional(__mapOfCaptionSelector).pipe(
      T.JsonName("captionSelectors"),
    ),
    Crop: S.optional(Rectangle)
      .pipe(T.JsonName("crop"))
      .annotations({ identifier: "Rectangle" }),
    DeblockFilter: S.optional(InputDeblockFilter).pipe(
      T.JsonName("deblockFilter"),
    ),
    DecryptionSettings: S.optional(InputDecryptionSettings)
      .pipe(T.JsonName("decryptionSettings"))
      .annotations({ identifier: "InputDecryptionSettings" }),
    DenoiseFilter: S.optional(InputDenoiseFilter).pipe(
      T.JsonName("denoiseFilter"),
    ),
    DolbyVisionMetadataXml: S.optional(S.String).pipe(
      T.JsonName("dolbyVisionMetadataXml"),
    ),
    DynamicAudioSelectors: S.optional(__mapOfDynamicAudioSelector).pipe(
      T.JsonName("dynamicAudioSelectors"),
    ),
    FileInput: S.optional(S.String).pipe(T.JsonName("fileInput")),
    FilterEnable: S.optional(InputFilterEnable).pipe(
      T.JsonName("filterEnable"),
    ),
    FilterStrength: S.optional(S.Number).pipe(T.JsonName("filterStrength")),
    ImageInserter: S.optional(ImageInserter)
      .pipe(T.JsonName("imageInserter"))
      .annotations({ identifier: "ImageInserter" }),
    InputClippings: S.optional(__listOfInputClipping).pipe(
      T.JsonName("inputClippings"),
    ),
    InputScanType: S.optional(InputScanType).pipe(T.JsonName("inputScanType")),
    Position: S.optional(Rectangle)
      .pipe(T.JsonName("position"))
      .annotations({ identifier: "Rectangle" }),
    ProgramNumber: S.optional(S.Number).pipe(T.JsonName("programNumber")),
    PsiControl: S.optional(InputPsiControl).pipe(T.JsonName("psiControl")),
    SupplementalImps: S.optional(__listOf__stringPatternS3ASSETMAPXml).pipe(
      T.JsonName("supplementalImps"),
    ),
    TamsSettings: S.optional(InputTamsSettings)
      .pipe(T.JsonName("tamsSettings"))
      .annotations({ identifier: "InputTamsSettings" }),
    TimecodeSource: S.optional(InputTimecodeSource).pipe(
      T.JsonName("timecodeSource"),
    ),
    TimecodeStart: S.optional(S.String).pipe(T.JsonName("timecodeStart")),
    VideoGenerator: S.optional(InputVideoGenerator)
      .pipe(T.JsonName("videoGenerator"))
      .annotations({ identifier: "InputVideoGenerator" }),
    VideoOverlays: S.optional(__listOfVideoOverlay).pipe(
      T.JsonName("videoOverlays"),
    ),
    VideoSelector: S.optional(VideoSelector)
      .pipe(T.JsonName("videoSelector"))
      .annotations({ identifier: "VideoSelector" }),
  }),
).annotations({ identifier: "Input" }) as any as S.Schema<Input>;
export type __listOfInput = Input[];
export const __listOfInput = S.Array(Input);
export interface JobSettings {
  AdAvailOffset?: number;
  AvailBlanking?: AvailBlanking;
  ColorConversion3DLUTSettings?: ColorConversion3DLUTSetting[];
  Esam?: EsamSettings;
  ExtendedDataServices?: ExtendedDataServices;
  FollowSource?: number;
  Inputs?: Input[];
  KantarWatermark?: KantarWatermarkSettings;
  MotionImageInserter?: MotionImageInserter;
  NielsenConfiguration?: NielsenConfiguration;
  NielsenNonLinearWatermark?: NielsenNonLinearWatermarkSettings;
  OutputGroups?: OutputGroup[];
  TimecodeConfig?: TimecodeConfig;
  TimedMetadataInsertion?: TimedMetadataInsertion;
}
export const JobSettings = S.suspend(() =>
  S.Struct({
    AdAvailOffset: S.optional(S.Number).pipe(T.JsonName("adAvailOffset")),
    AvailBlanking: S.optional(AvailBlanking)
      .pipe(T.JsonName("availBlanking"))
      .annotations({ identifier: "AvailBlanking" }),
    ColorConversion3DLUTSettings: S.optional(
      __listOfColorConversion3DLUTSetting,
    ).pipe(T.JsonName("colorConversion3DLUTSettings")),
    Esam: S.optional(EsamSettings)
      .pipe(T.JsonName("esam"))
      .annotations({ identifier: "EsamSettings" }),
    ExtendedDataServices: S.optional(ExtendedDataServices)
      .pipe(T.JsonName("extendedDataServices"))
      .annotations({ identifier: "ExtendedDataServices" }),
    FollowSource: S.optional(S.Number).pipe(T.JsonName("followSource")),
    Inputs: S.optional(__listOfInput).pipe(T.JsonName("inputs")),
    KantarWatermark: S.optional(KantarWatermarkSettings)
      .pipe(T.JsonName("kantarWatermark"))
      .annotations({ identifier: "KantarWatermarkSettings" }),
    MotionImageInserter: S.optional(MotionImageInserter)
      .pipe(T.JsonName("motionImageInserter"))
      .annotations({ identifier: "MotionImageInserter" }),
    NielsenConfiguration: S.optional(NielsenConfiguration)
      .pipe(T.JsonName("nielsenConfiguration"))
      .annotations({ identifier: "NielsenConfiguration" }),
    NielsenNonLinearWatermark: S.optional(NielsenNonLinearWatermarkSettings)
      .pipe(T.JsonName("nielsenNonLinearWatermark"))
      .annotations({ identifier: "NielsenNonLinearWatermarkSettings" }),
    OutputGroups: S.optional(__listOfOutputGroup).pipe(
      T.JsonName("outputGroups"),
    ),
    TimecodeConfig: S.optional(TimecodeConfig)
      .pipe(T.JsonName("timecodeConfig"))
      .annotations({ identifier: "TimecodeConfig" }),
    TimedMetadataInsertion: S.optional(TimedMetadataInsertion)
      .pipe(T.JsonName("timedMetadataInsertion"))
      .annotations({ identifier: "TimedMetadataInsertion" }),
  }),
).annotations({ identifier: "JobSettings" }) as any as S.Schema<JobSettings>;
export type ShareStatus = "NOT_SHARED" | "INITIATED" | "SHARED";
export const ShareStatus = S.Literal("NOT_SHARED", "INITIATED", "SHARED");
export interface Timing {
  FinishTime?: Date;
  StartTime?: Date;
  SubmitTime?: Date;
}
export const Timing = S.suspend(() =>
  S.Struct({
    FinishTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("finishTime")),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("startTime"),
    ),
    SubmitTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("submitTime")),
  }),
).annotations({ identifier: "Timing" }) as any as S.Schema<Timing>;
export interface WarningGroup {
  Code?: number;
  Count?: number;
}
export const WarningGroup = S.suspend(() =>
  S.Struct({
    Code: S.optional(S.Number).pipe(T.JsonName("code")),
    Count: S.optional(S.Number).pipe(T.JsonName("count")),
  }),
).annotations({ identifier: "WarningGroup" }) as any as S.Schema<WarningGroup>;
export type __listOfWarningGroup = WarningGroup[];
export const __listOfWarningGroup = S.Array(WarningGroup);
export interface Job {
  AccelerationSettings?: AccelerationSettings;
  AccelerationStatus?: AccelerationStatus;
  Arn?: string;
  BillingTagsSource?: BillingTagsSource;
  ClientRequestToken?: string;
  CreatedAt?: Date;
  CurrentPhase?: JobPhase;
  ErrorCode?: number;
  ErrorMessage?: string;
  HopDestinations?: HopDestination[];
  Id?: string;
  JobEngineVersionRequested?: string;
  JobEngineVersionUsed?: string;
  JobPercentComplete?: number;
  JobTemplate?: string;
  LastShareDetails?: string;
  Messages?: JobMessages;
  OutputGroupDetails?: OutputGroupDetail[];
  Priority?: number;
  Queue?: string;
  QueueTransitions?: QueueTransition[];
  RetryCount?: number;
  Role?: string;
  Settings?: JobSettings;
  ShareStatus?: ShareStatus;
  SimulateReservedQueue?: SimulateReservedQueue;
  Status?: JobStatus;
  StatusUpdateInterval?: StatusUpdateInterval;
  Timing?: Timing;
  UserMetadata?: { [key: string]: string };
  Warnings?: WarningGroup[];
}
export const Job = S.suspend(() =>
  S.Struct({
    AccelerationSettings: S.optional(AccelerationSettings)
      .pipe(T.JsonName("accelerationSettings"))
      .annotations({ identifier: "AccelerationSettings" }),
    AccelerationStatus: S.optional(AccelerationStatus).pipe(
      T.JsonName("accelerationStatus"),
    ),
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    BillingTagsSource: S.optional(BillingTagsSource).pipe(
      T.JsonName("billingTagsSource"),
    ),
    ClientRequestToken: S.optional(S.String).pipe(
      T.JsonName("clientRequestToken"),
    ),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("createdAt"),
    ),
    CurrentPhase: S.optional(JobPhase).pipe(T.JsonName("currentPhase")),
    ErrorCode: S.optional(S.Number).pipe(T.JsonName("errorCode")),
    ErrorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
    HopDestinations: S.optional(__listOfHopDestination).pipe(
      T.JsonName("hopDestinations"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    JobEngineVersionRequested: S.optional(S.String).pipe(
      T.JsonName("jobEngineVersionRequested"),
    ),
    JobEngineVersionUsed: S.optional(S.String).pipe(
      T.JsonName("jobEngineVersionUsed"),
    ),
    JobPercentComplete: S.optional(S.Number).pipe(
      T.JsonName("jobPercentComplete"),
    ),
    JobTemplate: S.optional(S.String).pipe(T.JsonName("jobTemplate")),
    LastShareDetails: S.optional(S.String).pipe(T.JsonName("lastShareDetails")),
    Messages: S.optional(JobMessages)
      .pipe(T.JsonName("messages"))
      .annotations({ identifier: "JobMessages" }),
    OutputGroupDetails: S.optional(__listOfOutputGroupDetail).pipe(
      T.JsonName("outputGroupDetails"),
    ),
    Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
    Queue: S.optional(S.String).pipe(T.JsonName("queue")),
    QueueTransitions: S.optional(__listOfQueueTransition).pipe(
      T.JsonName("queueTransitions"),
    ),
    RetryCount: S.optional(S.Number).pipe(T.JsonName("retryCount")),
    Role: S.optional(S.String).pipe(T.JsonName("role")),
    Settings: S.optional(JobSettings)
      .pipe(T.JsonName("settings"))
      .annotations({ identifier: "JobSettings" }),
    ShareStatus: S.optional(ShareStatus).pipe(T.JsonName("shareStatus")),
    SimulateReservedQueue: S.optional(SimulateReservedQueue).pipe(
      T.JsonName("simulateReservedQueue"),
    ),
    Status: S.optional(JobStatus).pipe(T.JsonName("status")),
    StatusUpdateInterval: S.optional(StatusUpdateInterval).pipe(
      T.JsonName("statusUpdateInterval"),
    ),
    Timing: S.optional(Timing)
      .pipe(T.JsonName("timing"))
      .annotations({ identifier: "Timing" }),
    UserMetadata: S.optional(__mapOf__string).pipe(T.JsonName("userMetadata")),
    Warnings: S.optional(__listOfWarningGroup).pipe(T.JsonName("warnings")),
  }),
).annotations({ identifier: "Job" }) as any as S.Schema<Job>;
export type __listOfJob = Job[];
export const __listOfJob = S.Array(Job);
export type JobsQueryStatus =
  | "SUBMITTED"
  | "PROGRESSING"
  | "COMPLETE"
  | "ERROR";
export const JobsQueryStatus = S.Literal(
  "SUBMITTED",
  "PROGRESSING",
  "COMPLETE",
  "ERROR",
);
export type Type = "SYSTEM" | "CUSTOM";
export const Type = S.Literal("SYSTEM", "CUSTOM");
export interface JobTemplate {
  AccelerationSettings?: AccelerationSettings;
  Arn?: string;
  Category?: string;
  CreatedAt?: Date;
  Description?: string;
  HopDestinations?: HopDestination[];
  LastUpdated?: Date;
  Name?: string;
  Priority?: number;
  Queue?: string;
  Settings?: JobTemplateSettings;
  StatusUpdateInterval?: StatusUpdateInterval;
  Type?: Type;
}
export const JobTemplate = S.suspend(() =>
  S.Struct({
    AccelerationSettings: S.optional(AccelerationSettings)
      .pipe(T.JsonName("accelerationSettings"))
      .annotations({ identifier: "AccelerationSettings" }),
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Category: S.optional(S.String).pipe(T.JsonName("category")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    HopDestinations: S.optional(__listOfHopDestination).pipe(
      T.JsonName("hopDestinations"),
    ),
    LastUpdated: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("lastUpdated")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
    Queue: S.optional(S.String).pipe(T.JsonName("queue")),
    Settings: S.optional(JobTemplateSettings)
      .pipe(T.JsonName("settings"))
      .annotations({ identifier: "JobTemplateSettings" }),
    StatusUpdateInterval: S.optional(StatusUpdateInterval).pipe(
      T.JsonName("statusUpdateInterval"),
    ),
    Type: S.optional(Type).pipe(T.JsonName("type")),
  }),
).annotations({ identifier: "JobTemplate" }) as any as S.Schema<JobTemplate>;
export type __listOfJobTemplate = JobTemplate[];
export const __listOfJobTemplate = S.Array(JobTemplate);
export interface Preset {
  Arn?: string;
  Category?: string;
  CreatedAt?: Date;
  Description?: string;
  LastUpdated?: Date;
  Name?: string;
  Settings?: PresetSettings;
  Type?: Type;
}
export const Preset = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Category: S.optional(S.String).pipe(T.JsonName("category")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    LastUpdated: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("lastUpdated")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Settings: S.optional(PresetSettings)
      .pipe(T.JsonName("settings"))
      .annotations({ identifier: "PresetSettings" }),
    Type: S.optional(Type).pipe(T.JsonName("type")),
  }),
).annotations({ identifier: "Preset" }) as any as S.Schema<Preset>;
export type __listOfPreset = Preset[];
export const __listOfPreset = S.Array(Preset);
export type ReservationPlanStatus = "ACTIVE" | "EXPIRED";
export const ReservationPlanStatus = S.Literal("ACTIVE", "EXPIRED");
export interface ReservationPlan {
  Commitment?: Commitment;
  ExpiresAt?: Date;
  PurchasedAt?: Date;
  RenewalType?: RenewalType;
  ReservedSlots?: number;
  Status?: ReservationPlanStatus;
}
export const ReservationPlan = S.suspend(() =>
  S.Struct({
    Commitment: S.optional(Commitment).pipe(T.JsonName("commitment")),
    ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("expiresAt"),
    ),
    PurchasedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("purchasedAt")),
    RenewalType: S.optional(RenewalType).pipe(T.JsonName("renewalType")),
    ReservedSlots: S.optional(S.Number).pipe(T.JsonName("reservedSlots")),
    Status: S.optional(ReservationPlanStatus).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "ReservationPlan",
}) as any as S.Schema<ReservationPlan>;
export interface ServiceOverride {
  Message?: string;
  Name?: string;
  OverrideValue?: string;
  Value?: string;
}
export const ServiceOverride = S.suspend(() =>
  S.Struct({
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    OverrideValue: S.optional(S.String).pipe(T.JsonName("overrideValue")),
    Value: S.optional(S.String).pipe(T.JsonName("value")),
  }),
).annotations({
  identifier: "ServiceOverride",
}) as any as S.Schema<ServiceOverride>;
export type __listOfServiceOverride = ServiceOverride[];
export const __listOfServiceOverride = S.Array(ServiceOverride);
export interface Queue {
  Arn?: string;
  ConcurrentJobs?: number;
  CreatedAt?: Date;
  Description?: string;
  LastUpdated?: Date;
  Name?: string;
  PricingPlan?: PricingPlan;
  ProgressingJobsCount?: number;
  ReservationPlan?: ReservationPlan;
  ServiceOverrides?: ServiceOverride[];
  Status?: QueueStatus;
  SubmittedJobsCount?: number;
  Type?: Type;
}
export const Queue = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ConcurrentJobs: S.optional(S.Number).pipe(T.JsonName("concurrentJobs")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    LastUpdated: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("lastUpdated")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    PricingPlan: S.optional(PricingPlan).pipe(T.JsonName("pricingPlan")),
    ProgressingJobsCount: S.optional(S.Number).pipe(
      T.JsonName("progressingJobsCount"),
    ),
    ReservationPlan: S.optional(ReservationPlan)
      .pipe(T.JsonName("reservationPlan"))
      .annotations({ identifier: "ReservationPlan" }),
    ServiceOverrides: S.optional(__listOfServiceOverride).pipe(
      T.JsonName("serviceOverrides"),
    ),
    Status: S.optional(QueueStatus).pipe(T.JsonName("status")),
    SubmittedJobsCount: S.optional(S.Number).pipe(
      T.JsonName("submittedJobsCount"),
    ),
    Type: S.optional(Type).pipe(T.JsonName("type")),
  }),
).annotations({ identifier: "Queue" }) as any as S.Schema<Queue>;
export type __listOfQueue = Queue[];
export const __listOfQueue = S.Array(Queue);
export interface ProbeInputFile {
  FileUrl?: string;
}
export const ProbeInputFile = S.suspend(() =>
  S.Struct({ FileUrl: S.optional(S.String).pipe(T.JsonName("fileUrl")) }),
).annotations({
  identifier: "ProbeInputFile",
}) as any as S.Schema<ProbeInputFile>;
export type __listOfProbeInputFile = ProbeInputFile[];
export const __listOfProbeInputFile = S.Array(ProbeInputFile);
export interface JobsQueryFilter {
  Key?: JobsQueryFilterKey;
  Values?: string[];
}
export const JobsQueryFilter = S.suspend(() =>
  S.Struct({
    Key: S.optional(JobsQueryFilterKey).pipe(T.JsonName("key")),
    Values: S.optional(__listOf__stringMax100).pipe(T.JsonName("values")),
  }),
).annotations({
  identifier: "JobsQueryFilter",
}) as any as S.Schema<JobsQueryFilter>;
export type __listOfJobsQueryFilter = JobsQueryFilter[];
export const __listOfJobsQueryFilter = S.Array(JobsQueryFilter);
export interface CreateQueueRequest {
  ConcurrentJobs?: number;
  Description?: string;
  Name?: string;
  PricingPlan?: PricingPlan;
  ReservationPlanSettings?: ReservationPlanSettings;
  Status?: QueueStatus;
  Tags?: { [key: string]: string };
}
export const CreateQueueRequest = S.suspend(() =>
  S.Struct({
    ConcurrentJobs: S.optional(S.Number).pipe(T.JsonName("concurrentJobs")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    PricingPlan: S.optional(PricingPlan).pipe(T.JsonName("pricingPlan")),
    ReservationPlanSettings: S.optional(ReservationPlanSettings)
      .pipe(T.JsonName("reservationPlanSettings"))
      .annotations({ identifier: "ReservationPlanSettings" }),
    Status: S.optional(QueueStatus).pipe(T.JsonName("status")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2017-08-29/queues" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateQueueRequest",
}) as any as S.Schema<CreateQueueRequest>;
export interface GetJobsQueryResultsResponse {
  Jobs?: (Job & {
    Role: string;
    Settings: JobSettings;
    AccelerationSettings: AccelerationSettings & { Mode: AccelerationMode };
    Warnings: (WarningGroup & { Code: number; Count: number })[];
  })[];
  NextToken?: string;
  Status?: JobsQueryStatus;
}
export const GetJobsQueryResultsResponse = S.suspend(() =>
  S.Struct({
    Jobs: S.optional(__listOfJob).pipe(T.JsonName("jobs")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Status: S.optional(JobsQueryStatus).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "GetJobsQueryResultsResponse",
}) as any as S.Schema<GetJobsQueryResultsResponse>;
export interface GetPolicyResponse {
  Policy?: Policy;
}
export const GetPolicyResponse = S.suspend(() =>
  S.Struct({
    Policy: S.optional(Policy)
      .pipe(T.JsonName("policy"))
      .annotations({ identifier: "Policy" }),
  }),
).annotations({
  identifier: "GetPolicyResponse",
}) as any as S.Schema<GetPolicyResponse>;
export interface ListJobsResponse {
  Jobs?: (Job & {
    Role: string;
    Settings: JobSettings;
    AccelerationSettings: AccelerationSettings & { Mode: AccelerationMode };
    Warnings: (WarningGroup & { Code: number; Count: number })[];
  })[];
  NextToken?: string;
}
export const ListJobsResponse = S.suspend(() =>
  S.Struct({
    Jobs: S.optional(__listOfJob).pipe(T.JsonName("jobs")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListJobsResponse",
}) as any as S.Schema<ListJobsResponse>;
export interface ListJobTemplatesResponse {
  JobTemplates?: (JobTemplate & {
    Name: string;
    Settings: JobTemplateSettings;
    AccelerationSettings: AccelerationSettings & { Mode: AccelerationMode };
  })[];
  NextToken?: string;
}
export const ListJobTemplatesResponse = S.suspend(() =>
  S.Struct({
    JobTemplates: S.optional(__listOfJobTemplate).pipe(
      T.JsonName("jobTemplates"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListJobTemplatesResponse",
}) as any as S.Schema<ListJobTemplatesResponse>;
export interface ListPresetsResponse {
  NextToken?: string;
  Presets?: (Preset & { Name: string; Settings: PresetSettings })[];
}
export const ListPresetsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Presets: S.optional(__listOfPreset).pipe(T.JsonName("presets")),
  }),
).annotations({
  identifier: "ListPresetsResponse",
}) as any as S.Schema<ListPresetsResponse>;
export interface ListQueuesResponse {
  NextToken?: string;
  Queues?: (Queue & { Name: string })[];
  TotalConcurrentJobs?: number;
  UnallocatedConcurrentJobs?: number;
}
export const ListQueuesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Queues: S.optional(__listOfQueue).pipe(T.JsonName("queues")),
    TotalConcurrentJobs: S.optional(S.Number).pipe(
      T.JsonName("totalConcurrentJobs"),
    ),
    UnallocatedConcurrentJobs: S.optional(S.Number).pipe(
      T.JsonName("unallocatedConcurrentJobs"),
    ),
  }),
).annotations({
  identifier: "ListQueuesResponse",
}) as any as S.Schema<ListQueuesResponse>;
export interface ProbeRequest {
  InputFiles?: ProbeInputFile[];
}
export const ProbeRequest = S.suspend(() =>
  S.Struct({
    InputFiles: S.optional(__listOfProbeInputFile).pipe(
      T.JsonName("inputFiles"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2017-08-29/probe" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "ProbeRequest" }) as any as S.Schema<ProbeRequest>;
export interface PutPolicyResponse {
  Policy?: Policy;
}
export const PutPolicyResponse = S.suspend(() =>
  S.Struct({
    Policy: S.optional(Policy)
      .pipe(T.JsonName("policy"))
      .annotations({ identifier: "Policy" }),
  }),
).annotations({
  identifier: "PutPolicyResponse",
}) as any as S.Schema<PutPolicyResponse>;
export interface SearchJobsResponse {
  Jobs?: (Job & {
    Role: string;
    Settings: JobSettings;
    AccelerationSettings: AccelerationSettings & { Mode: AccelerationMode };
    Warnings: (WarningGroup & { Code: number; Count: number })[];
  })[];
  NextToken?: string;
}
export const SearchJobsResponse = S.suspend(() =>
  S.Struct({
    Jobs: S.optional(__listOfJob).pipe(T.JsonName("jobs")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "SearchJobsResponse",
}) as any as S.Schema<SearchJobsResponse>;
export interface StartJobsQueryRequest {
  FilterList?: JobsQueryFilter[];
  MaxResults?: number;
  NextToken?: string;
  Order?: Order;
}
export const StartJobsQueryRequest = S.suspend(() =>
  S.Struct({
    FilterList: S.optional(__listOfJobsQueryFilter).pipe(
      T.JsonName("filterList"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Order: S.optional(Order).pipe(T.JsonName("order")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2017-08-29/jobsQueries" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartJobsQueryRequest",
}) as any as S.Schema<StartJobsQueryRequest>;
export interface UpdateJobTemplateResponse {
  JobTemplate?: JobTemplate & {
    Name: string;
    Settings: JobTemplateSettings;
    AccelerationSettings: AccelerationSettings & { Mode: AccelerationMode };
  };
}
export const UpdateJobTemplateResponse = S.suspend(() =>
  S.Struct({
    JobTemplate: S.optional(JobTemplate)
      .pipe(T.JsonName("jobTemplate"))
      .annotations({ identifier: "JobTemplate" }),
  }),
).annotations({
  identifier: "UpdateJobTemplateResponse",
}) as any as S.Schema<UpdateJobTemplateResponse>;
export interface UpdatePresetResponse {
  Preset?: Preset & { Name: string; Settings: PresetSettings };
}
export const UpdatePresetResponse = S.suspend(() =>
  S.Struct({
    Preset: S.optional(Preset)
      .pipe(T.JsonName("preset"))
      .annotations({ identifier: "Preset" }),
  }),
).annotations({
  identifier: "UpdatePresetResponse",
}) as any as S.Schema<UpdatePresetResponse>;
export interface UpdateQueueResponse {
  Queue?: Queue & { Name: string };
}
export const UpdateQueueResponse = S.suspend(() =>
  S.Struct({
    Queue: S.optional(Queue)
      .pipe(T.JsonName("queue"))
      .annotations({ identifier: "Queue" }),
  }),
).annotations({
  identifier: "UpdateQueueResponse",
}) as any as S.Schema<UpdateQueueResponse>;
export interface Endpoint {
  Url?: string;
}
export const Endpoint = S.suspend(() =>
  S.Struct({ Url: S.optional(S.String).pipe(T.JsonName("url")) }),
).annotations({ identifier: "Endpoint" }) as any as S.Schema<Endpoint>;
export type __listOfEndpoint = Endpoint[];
export const __listOfEndpoint = S.Array(Endpoint);
export interface ResourceTags {
  Arn?: string;
  Tags?: { [key: string]: string };
}
export const ResourceTags = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }),
).annotations({ identifier: "ResourceTags" }) as any as S.Schema<ResourceTags>;
export interface JobEngineVersion {
  ExpirationDate?: Date;
  Version?: string;
}
export const JobEngineVersion = S.suspend(() =>
  S.Struct({
    ExpirationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("expirationDate")),
    Version: S.optional(S.String).pipe(T.JsonName("version")),
  }),
).annotations({
  identifier: "JobEngineVersion",
}) as any as S.Schema<JobEngineVersion>;
export type __listOfJobEngineVersion = JobEngineVersion[];
export const __listOfJobEngineVersion = S.Array(JobEngineVersion);
export interface CreateJobTemplateRequest {
  AccelerationSettings?: AccelerationSettings;
  Category?: string;
  Description?: string;
  HopDestinations?: HopDestination[];
  Name?: string;
  Priority?: number;
  Queue?: string;
  Settings?: JobTemplateSettings;
  StatusUpdateInterval?: StatusUpdateInterval;
  Tags?: { [key: string]: string };
}
export const CreateJobTemplateRequest = S.suspend(() =>
  S.Struct({
    AccelerationSettings: S.optional(AccelerationSettings)
      .pipe(T.JsonName("accelerationSettings"))
      .annotations({ identifier: "AccelerationSettings" }),
    Category: S.optional(S.String).pipe(T.JsonName("category")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    HopDestinations: S.optional(__listOfHopDestination).pipe(
      T.JsonName("hopDestinations"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
    Queue: S.optional(S.String).pipe(T.JsonName("queue")),
    Settings: S.optional(JobTemplateSettings)
      .pipe(T.JsonName("settings"))
      .annotations({ identifier: "JobTemplateSettings" }),
    StatusUpdateInterval: S.optional(StatusUpdateInterval).pipe(
      T.JsonName("statusUpdateInterval"),
    ),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2017-08-29/jobTemplates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateJobTemplateRequest",
}) as any as S.Schema<CreateJobTemplateRequest>;
export interface CreateQueueResponse {
  Queue?: Queue & { Name: string };
}
export const CreateQueueResponse = S.suspend(() =>
  S.Struct({
    Queue: S.optional(Queue)
      .pipe(T.JsonName("queue"))
      .annotations({ identifier: "Queue" }),
  }),
).annotations({
  identifier: "CreateQueueResponse",
}) as any as S.Schema<CreateQueueResponse>;
export interface DescribeEndpointsResponse {
  Endpoints?: Endpoint[];
  NextToken?: string;
}
export const DescribeEndpointsResponse = S.suspend(() =>
  S.Struct({
    Endpoints: S.optional(__listOfEndpoint).pipe(T.JsonName("endpoints")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "DescribeEndpointsResponse",
}) as any as S.Schema<DescribeEndpointsResponse>;
export interface GetJobTemplateResponse {
  JobTemplate?: JobTemplate & {
    Name: string;
    Settings: JobTemplateSettings;
    AccelerationSettings: AccelerationSettings & { Mode: AccelerationMode };
  };
}
export const GetJobTemplateResponse = S.suspend(() =>
  S.Struct({
    JobTemplate: S.optional(JobTemplate)
      .pipe(T.JsonName("jobTemplate"))
      .annotations({ identifier: "JobTemplate" }),
  }),
).annotations({
  identifier: "GetJobTemplateResponse",
}) as any as S.Schema<GetJobTemplateResponse>;
export interface GetPresetResponse {
  Preset?: Preset & { Name: string; Settings: PresetSettings };
}
export const GetPresetResponse = S.suspend(() =>
  S.Struct({
    Preset: S.optional(Preset)
      .pipe(T.JsonName("preset"))
      .annotations({ identifier: "Preset" }),
  }),
).annotations({
  identifier: "GetPresetResponse",
}) as any as S.Schema<GetPresetResponse>;
export interface ListTagsForResourceResponse {
  ResourceTags?: ResourceTags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({
    ResourceTags: S.optional(ResourceTags)
      .pipe(T.JsonName("resourceTags"))
      .annotations({ identifier: "ResourceTags" }),
  }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListVersionsResponse {
  NextToken?: string;
  Versions?: JobEngineVersion[];
}
export const ListVersionsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Versions: S.optional(__listOfJobEngineVersion).pipe(T.JsonName("versions")),
  }),
).annotations({
  identifier: "ListVersionsResponse",
}) as any as S.Schema<ListVersionsResponse>;
export interface StartJobsQueryResponse {
  Id?: string;
}
export const StartJobsQueryResponse = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String).pipe(T.JsonName("id")) }),
).annotations({
  identifier: "StartJobsQueryResponse",
}) as any as S.Schema<StartJobsQueryResponse>;
export type Format = "mp4" | "quicktime" | "matroska" | "webm" | "mxf";
export const Format = S.Literal("mp4", "quicktime", "matroska", "webm", "mxf");
export type __listOf__integer = number[];
export const __listOf__integer = S.Array(S.Number);
export interface CreateJobTemplateResponse {
  JobTemplate?: JobTemplate & {
    Name: string;
    Settings: JobTemplateSettings;
    AccelerationSettings: AccelerationSettings & { Mode: AccelerationMode };
  };
}
export const CreateJobTemplateResponse = S.suspend(() =>
  S.Struct({
    JobTemplate: S.optional(JobTemplate)
      .pipe(T.JsonName("jobTemplate"))
      .annotations({ identifier: "JobTemplate" }),
  }),
).annotations({
  identifier: "CreateJobTemplateResponse",
}) as any as S.Schema<CreateJobTemplateResponse>;
export interface GetQueueResponse {
  Queue?: Queue & { Name: string };
}
export const GetQueueResponse = S.suspend(() =>
  S.Struct({
    Queue: S.optional(Queue)
      .pipe(T.JsonName("queue"))
      .annotations({ identifier: "Queue" }),
  }),
).annotations({
  identifier: "GetQueueResponse",
}) as any as S.Schema<GetQueueResponse>;
export interface Metadata {
  ETag?: string;
  FileSize?: number;
  LastModified?: Date;
  MimeType?: string;
}
export const Metadata = S.suspend(() =>
  S.Struct({
    ETag: S.optional(S.String).pipe(T.JsonName("eTag")),
    FileSize: S.optional(S.Number).pipe(T.JsonName("fileSize")),
    LastModified: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("lastModified")),
    MimeType: S.optional(S.String).pipe(T.JsonName("mimeType")),
  }),
).annotations({ identifier: "Metadata" }) as any as S.Schema<Metadata>;
export interface TrackMapping {
  AudioTrackIndexes?: number[];
  DataTrackIndexes?: number[];
  VideoTrackIndexes?: number[];
}
export const TrackMapping = S.suspend(() =>
  S.Struct({
    AudioTrackIndexes: S.optional(__listOf__integer).pipe(
      T.JsonName("audioTrackIndexes"),
    ),
    DataTrackIndexes: S.optional(__listOf__integer).pipe(
      T.JsonName("dataTrackIndexes"),
    ),
    VideoTrackIndexes: S.optional(__listOf__integer).pipe(
      T.JsonName("videoTrackIndexes"),
    ),
  }),
).annotations({ identifier: "TrackMapping" }) as any as S.Schema<TrackMapping>;
export type __listOfTrackMapping = TrackMapping[];
export const __listOfTrackMapping = S.Array(TrackMapping);
export type Codec =
  | "UNKNOWN"
  | "AAC"
  | "AC3"
  | "EAC3"
  | "FLAC"
  | "MP3"
  | "OPUS"
  | "PCM"
  | "VORBIS"
  | "AV1"
  | "AVC"
  | "HEVC"
  | "JPEG2000"
  | "MJPEG"
  | "MPEG1"
  | "MP4V"
  | "MPEG2"
  | "PRORES"
  | "THEORA"
  | "VFW"
  | "VP8"
  | "VP9"
  | "QTRLE"
  | "C608"
  | "C708"
  | "WEBVTT";
export const Codec = S.Literal(
  "UNKNOWN",
  "AAC",
  "AC3",
  "EAC3",
  "FLAC",
  "MP3",
  "OPUS",
  "PCM",
  "VORBIS",
  "AV1",
  "AVC",
  "HEVC",
  "JPEG2000",
  "MJPEG",
  "MPEG1",
  "MP4V",
  "MPEG2",
  "PRORES",
  "THEORA",
  "VFW",
  "VP8",
  "VP9",
  "QTRLE",
  "C608",
  "C708",
  "WEBVTT",
);
export type TrackType = "video" | "audio" | "data";
export const TrackType = S.Literal("video", "audio", "data");
export type ColorPrimaries =
  | "ITU_709"
  | "UNSPECIFIED"
  | "RESERVED"
  | "ITU_470M"
  | "ITU_470BG"
  | "SMPTE_170M"
  | "SMPTE_240M"
  | "GENERIC_FILM"
  | "ITU_2020"
  | "SMPTE_428_1"
  | "SMPTE_431_2"
  | "SMPTE_EG_432_1"
  | "IPT"
  | "SMPTE_2067XYZ"
  | "EBU_3213_E"
  | "LAST";
export const ColorPrimaries = S.Literal(
  "ITU_709",
  "UNSPECIFIED",
  "RESERVED",
  "ITU_470M",
  "ITU_470BG",
  "SMPTE_170M",
  "SMPTE_240M",
  "GENERIC_FILM",
  "ITU_2020",
  "SMPTE_428_1",
  "SMPTE_431_2",
  "SMPTE_EG_432_1",
  "IPT",
  "SMPTE_2067XYZ",
  "EBU_3213_E",
  "LAST",
);
export type MatrixCoefficients =
  | "RGB"
  | "ITU_709"
  | "UNSPECIFIED"
  | "RESERVED"
  | "FCC"
  | "ITU_470BG"
  | "SMPTE_170M"
  | "SMPTE_240M"
  | "YCgCo"
  | "ITU_2020_NCL"
  | "ITU_2020_CL"
  | "SMPTE_2085"
  | "CD_NCL"
  | "CD_CL"
  | "ITU_2100ICtCp"
  | "IPT"
  | "EBU3213"
  | "LAST";
export const MatrixCoefficients = S.Literal(
  "RGB",
  "ITU_709",
  "UNSPECIFIED",
  "RESERVED",
  "FCC",
  "ITU_470BG",
  "SMPTE_170M",
  "SMPTE_240M",
  "YCgCo",
  "ITU_2020_NCL",
  "ITU_2020_CL",
  "SMPTE_2085",
  "CD_NCL",
  "CD_CL",
  "ITU_2100ICtCp",
  "IPT",
  "EBU3213",
  "LAST",
);
export type TransferCharacteristics =
  | "ITU_709"
  | "UNSPECIFIED"
  | "RESERVED"
  | "ITU_470M"
  | "ITU_470BG"
  | "SMPTE_170M"
  | "SMPTE_240M"
  | "LINEAR"
  | "LOG10_2"
  | "LOC10_2_5"
  | "IEC_61966_2_4"
  | "ITU_1361"
  | "IEC_61966_2_1"
  | "ITU_2020_10bit"
  | "ITU_2020_12bit"
  | "SMPTE_2084"
  | "SMPTE_428_1"
  | "ARIB_B67"
  | "LAST";
export const TransferCharacteristics = S.Literal(
  "ITU_709",
  "UNSPECIFIED",
  "RESERVED",
  "ITU_470M",
  "ITU_470BG",
  "SMPTE_170M",
  "SMPTE_240M",
  "LINEAR",
  "LOG10_2",
  "LOC10_2_5",
  "IEC_61966_2_4",
  "ITU_1361",
  "IEC_61966_2_1",
  "ITU_2020_10bit",
  "ITU_2020_12bit",
  "SMPTE_2084",
  "SMPTE_428_1",
  "ARIB_B67",
  "LAST",
);
export interface DataProperties {
  LanguageCode?: string;
}
export const DataProperties = S.suspend(() =>
  S.Struct({
    LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
  }),
).annotations({
  identifier: "DataProperties",
}) as any as S.Schema<DataProperties>;
export interface CreatePresetRequest {
  Category?: string;
  Description?: string;
  Name?: string;
  Settings?: PresetSettings;
  Tags?: { [key: string]: string };
}
export const CreatePresetRequest = S.suspend(() =>
  S.Struct({
    Category: S.optional(S.String).pipe(T.JsonName("category")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Settings: S.optional(PresetSettings)
      .pipe(T.JsonName("settings"))
      .annotations({ identifier: "PresetSettings" }),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2017-08-29/presets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePresetRequest",
}) as any as S.Schema<CreatePresetRequest>;
export interface GetJobResponse {
  Job?: Job & {
    Role: string;
    Settings: JobSettings;
    AccelerationSettings: AccelerationSettings & { Mode: AccelerationMode };
    Warnings: (WarningGroup & { Code: number; Count: number })[];
  };
}
export const GetJobResponse = S.suspend(() =>
  S.Struct({
    Job: S.optional(Job)
      .pipe(T.JsonName("job"))
      .annotations({ identifier: "Job" }),
  }),
).annotations({
  identifier: "GetJobResponse",
}) as any as S.Schema<GetJobResponse>;
export interface FrameRate {
  Denominator?: number;
  Numerator?: number;
}
export const FrameRate = S.suspend(() =>
  S.Struct({
    Denominator: S.optional(S.Number).pipe(T.JsonName("denominator")),
    Numerator: S.optional(S.Number).pipe(T.JsonName("numerator")),
  }),
).annotations({ identifier: "FrameRate" }) as any as S.Schema<FrameRate>;
export interface CodecMetadata {
  BitDepth?: number;
  ChromaSubsampling?: string;
  CodedFrameRate?: FrameRate;
  ColorPrimaries?: ColorPrimaries;
  Height?: number;
  Level?: string;
  MatrixCoefficients?: MatrixCoefficients;
  Profile?: string;
  ScanType?: string;
  TransferCharacteristics?: TransferCharacteristics;
  Width?: number;
}
export const CodecMetadata = S.suspend(() =>
  S.Struct({
    BitDepth: S.optional(S.Number).pipe(T.JsonName("bitDepth")),
    ChromaSubsampling: S.optional(S.String).pipe(
      T.JsonName("chromaSubsampling"),
    ),
    CodedFrameRate: S.optional(FrameRate)
      .pipe(T.JsonName("codedFrameRate"))
      .annotations({ identifier: "FrameRate" }),
    ColorPrimaries: S.optional(ColorPrimaries).pipe(
      T.JsonName("colorPrimaries"),
    ),
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    Level: S.optional(S.String).pipe(T.JsonName("level")),
    MatrixCoefficients: S.optional(MatrixCoefficients).pipe(
      T.JsonName("matrixCoefficients"),
    ),
    Profile: S.optional(S.String).pipe(T.JsonName("profile")),
    ScanType: S.optional(S.String).pipe(T.JsonName("scanType")),
    TransferCharacteristics: S.optional(TransferCharacteristics).pipe(
      T.JsonName("transferCharacteristics"),
    ),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
  }),
).annotations({
  identifier: "CodecMetadata",
}) as any as S.Schema<CodecMetadata>;
export interface AudioProperties {
  BitDepth?: number;
  BitRate?: number;
  Channels?: number;
  FrameRate?: FrameRate;
  LanguageCode?: string;
  SampleRate?: number;
}
export const AudioProperties = S.suspend(() =>
  S.Struct({
    BitDepth: S.optional(S.Number).pipe(T.JsonName("bitDepth")),
    BitRate: S.optional(S.Number).pipe(T.JsonName("bitRate")),
    Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
    FrameRate: S.optional(FrameRate)
      .pipe(T.JsonName("frameRate"))
      .annotations({ identifier: "FrameRate" }),
    LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
  }),
).annotations({
  identifier: "AudioProperties",
}) as any as S.Schema<AudioProperties>;
export interface VideoProperties {
  BitDepth?: number;
  BitRate?: number;
  CodecMetadata?: CodecMetadata;
  ColorPrimaries?: ColorPrimaries;
  FrameRate?: FrameRate;
  Height?: number;
  MatrixCoefficients?: MatrixCoefficients;
  TransferCharacteristics?: TransferCharacteristics;
  Width?: number;
}
export const VideoProperties = S.suspend(() =>
  S.Struct({
    BitDepth: S.optional(S.Number).pipe(T.JsonName("bitDepth")),
    BitRate: S.optional(S.Number).pipe(T.JsonName("bitRate")),
    CodecMetadata: S.optional(CodecMetadata)
      .pipe(T.JsonName("codecMetadata"))
      .annotations({ identifier: "CodecMetadata" }),
    ColorPrimaries: S.optional(ColorPrimaries).pipe(
      T.JsonName("colorPrimaries"),
    ),
    FrameRate: S.optional(FrameRate)
      .pipe(T.JsonName("frameRate"))
      .annotations({ identifier: "FrameRate" }),
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    MatrixCoefficients: S.optional(MatrixCoefficients).pipe(
      T.JsonName("matrixCoefficients"),
    ),
    TransferCharacteristics: S.optional(TransferCharacteristics).pipe(
      T.JsonName("transferCharacteristics"),
    ),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
  }),
).annotations({
  identifier: "VideoProperties",
}) as any as S.Schema<VideoProperties>;
export interface Track {
  AudioProperties?: AudioProperties;
  Codec?: Codec;
  DataProperties?: DataProperties;
  Duration?: number;
  Index?: number;
  TrackType?: TrackType;
  VideoProperties?: VideoProperties;
}
export const Track = S.suspend(() =>
  S.Struct({
    AudioProperties: S.optional(AudioProperties)
      .pipe(T.JsonName("audioProperties"))
      .annotations({ identifier: "AudioProperties" }),
    Codec: S.optional(Codec).pipe(T.JsonName("codec")),
    DataProperties: S.optional(DataProperties)
      .pipe(T.JsonName("dataProperties"))
      .annotations({ identifier: "DataProperties" }),
    Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
    Index: S.optional(S.Number).pipe(T.JsonName("index")),
    TrackType: S.optional(TrackType).pipe(T.JsonName("trackType")),
    VideoProperties: S.optional(VideoProperties)
      .pipe(T.JsonName("videoProperties"))
      .annotations({ identifier: "VideoProperties" }),
  }),
).annotations({ identifier: "Track" }) as any as S.Schema<Track>;
export type __listOfTrack = Track[];
export const __listOfTrack = S.Array(Track);
export interface CreatePresetResponse {
  Preset?: Preset & { Name: string; Settings: PresetSettings };
}
export const CreatePresetResponse = S.suspend(() =>
  S.Struct({
    Preset: S.optional(Preset)
      .pipe(T.JsonName("preset"))
      .annotations({ identifier: "Preset" }),
  }),
).annotations({
  identifier: "CreatePresetResponse",
}) as any as S.Schema<CreatePresetResponse>;
export interface Container {
  Duration?: number;
  Format?: Format;
  Tracks?: Track[];
}
export const Container = S.suspend(() =>
  S.Struct({
    Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
    Format: S.optional(Format).pipe(T.JsonName("format")),
    Tracks: S.optional(__listOfTrack).pipe(T.JsonName("tracks")),
  }),
).annotations({ identifier: "Container" }) as any as S.Schema<Container>;
export interface ProbeResult {
  Container?: Container;
  Metadata?: Metadata;
  TrackMappings?: TrackMapping[];
}
export const ProbeResult = S.suspend(() =>
  S.Struct({
    Container: S.optional(Container)
      .pipe(T.JsonName("container"))
      .annotations({ identifier: "Container" }),
    Metadata: S.optional(Metadata)
      .pipe(T.JsonName("metadata"))
      .annotations({ identifier: "Metadata" }),
    TrackMappings: S.optional(__listOfTrackMapping).pipe(
      T.JsonName("trackMappings"),
    ),
  }),
).annotations({ identifier: "ProbeResult" }) as any as S.Schema<ProbeResult>;
export type __listOfProbeResult = ProbeResult[];
export const __listOfProbeResult = S.Array(ProbeResult);
export interface CreateJobRequest {
  AccelerationSettings?: AccelerationSettings;
  BillingTagsSource?: BillingTagsSource;
  ClientRequestToken?: string;
  HopDestinations?: HopDestination[];
  JobEngineVersion?: string;
  JobTemplate?: string;
  Priority?: number;
  Queue?: string;
  Role?: string;
  Settings?: JobSettings;
  SimulateReservedQueue?: SimulateReservedQueue;
  StatusUpdateInterval?: StatusUpdateInterval;
  Tags?: { [key: string]: string };
  UserMetadata?: { [key: string]: string };
}
export const CreateJobRequest = S.suspend(() =>
  S.Struct({
    AccelerationSettings: S.optional(AccelerationSettings)
      .pipe(T.JsonName("accelerationSettings"))
      .annotations({ identifier: "AccelerationSettings" }),
    BillingTagsSource: S.optional(BillingTagsSource).pipe(
      T.JsonName("billingTagsSource"),
    ),
    ClientRequestToken: S.optional(S.String).pipe(
      T.JsonName("clientRequestToken"),
      T.IdempotencyToken(),
    ),
    HopDestinations: S.optional(__listOfHopDestination).pipe(
      T.JsonName("hopDestinations"),
    ),
    JobEngineVersion: S.optional(S.String).pipe(T.JsonName("jobEngineVersion")),
    JobTemplate: S.optional(S.String).pipe(T.JsonName("jobTemplate")),
    Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
    Queue: S.optional(S.String).pipe(T.JsonName("queue")),
    Role: S.optional(S.String).pipe(T.JsonName("role")),
    Settings: S.optional(JobSettings)
      .pipe(T.JsonName("settings"))
      .annotations({ identifier: "JobSettings" }),
    SimulateReservedQueue: S.optional(SimulateReservedQueue).pipe(
      T.JsonName("simulateReservedQueue"),
    ),
    StatusUpdateInterval: S.optional(StatusUpdateInterval).pipe(
      T.JsonName("statusUpdateInterval"),
    ),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    UserMetadata: S.optional(__mapOf__string).pipe(T.JsonName("userMetadata")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2017-08-29/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateJobRequest",
}) as any as S.Schema<CreateJobRequest>;
export interface ProbeResponse {
  ProbeResults?: ProbeResult[];
}
export const ProbeResponse = S.suspend(() =>
  S.Struct({
    ProbeResults: S.optional(__listOfProbeResult).pipe(
      T.JsonName("probeResults"),
    ),
  }),
).annotations({
  identifier: "ProbeResponse",
}) as any as S.Schema<ProbeResponse>;
export interface CreateJobResponse {
  Job?: Job & {
    Role: string;
    Settings: JobSettings;
    AccelerationSettings: AccelerationSettings & { Mode: AccelerationMode };
    Warnings: (WarningGroup & { Code: number; Count: number })[];
  };
}
export const CreateJobResponse = S.suspend(() =>
  S.Struct({
    Job: S.optional(Job)
      .pipe(T.JsonName("job"))
      .annotations({ identifier: "Job" }),
  }),
).annotations({
  identifier: "CreateJobResponse",
}) as any as S.Schema<CreateJobResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withConflictError) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withAuthError) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withServerError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withQuotaError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withThrottlingError) {}

//# Operations
/**
 * Permanently delete a policy that you created.
 */
export const deletePolicy: (
  input: DeletePolicyRequest,
) => effect.Effect<
  DeletePolicyResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyRequest,
  output: DeletePolicyResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieve the JSON for a specific transcoding job.
 */
export const getJob: (
  input: GetJobRequest,
) => effect.Effect<
  GetJobResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobRequest,
  output: GetJobResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieve the JSON for a specific queue.
 */
export const getQueue: (
  input: GetQueueRequest,
) => effect.Effect<
  GetQueueResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQueueRequest,
  output: GetQueueResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Send a request with an empty body to the regional API endpoint to get your account API endpoint. Note that DescribeEndpoints is no longer required. We recommend that you send your requests directly to the regional endpoint instead.
 */
export const describeEndpoints: {
  (
    input: DescribeEndpointsRequest,
  ): effect.Effect<
    DescribeEndpointsResponse,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEndpointsRequest,
  ) => stream.Stream<
    DescribeEndpointsResponse,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEndpointsRequest,
  ) => stream.Stream<
    Endpoint,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEndpointsRequest,
  output: DescribeEndpointsResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Endpoints",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieve the JSON for a specific job template.
 */
export const getJobTemplate: (
  input: GetJobTemplateRequest,
) => effect.Effect<
  GetJobTemplateResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobTemplateRequest,
  output: GetJobTemplateResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieve the JSON for a specific preset.
 */
export const getPreset: (
  input: GetPresetRequest,
) => effect.Effect<
  GetPresetResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPresetRequest,
  output: GetPresetResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieve the tags for a MediaConvert resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieve a JSON array of all available Job engine versions and the date they expire.
 */
export const listVersions: {
  (
    input: ListVersionsRequest,
  ): effect.Effect<
    ListVersionsResponse,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVersionsRequest,
  ) => stream.Stream<
    ListVersionsResponse,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVersionsRequest,
  ) => stream.Stream<
    JobEngineVersion,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListVersionsRequest,
  output: ListVersionsResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Versions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Start an asynchronous jobs query using the provided filters. To receive the list of jobs that match your query, call the GetJobsQueryResults API using the query ID returned by this API.
 */
export const startJobsQuery: (
  input: StartJobsQueryRequest,
) => effect.Effect<
  StartJobsQueryResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartJobsQueryRequest,
  output: StartJobsQueryResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieve a JSON array of up to twenty of your most recent jobs matched by a jobs query.
 */
export const getJobsQueryResults: (
  input: GetJobsQueryResultsRequest,
) => effect.Effect<
  GetJobsQueryResultsResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobsQueryResultsRequest,
  output: GetJobsQueryResultsResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieve the JSON for your policy.
 */
export const getPolicy: (
  input: GetPolicyRequest,
) => effect.Effect<
  GetPolicyResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyRequest,
  output: GetPolicyResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieve a JSON array of up to twenty of your most recently created jobs. This array includes in-process, completed, and errored jobs. This will return the jobs themselves, not just a list of the jobs. To retrieve the twenty next most recent jobs, use the nextToken string returned with the array.
 */
export const listJobs: {
  (
    input: ListJobsRequest,
  ): effect.Effect<
    ListJobsResponse,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobsRequest,
  ) => stream.Stream<
    ListJobsResponse,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobsRequest,
  ) => stream.Stream<
    Job,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobsRequest,
  output: ListJobsResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Jobs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieve a JSON array of up to twenty of your job templates. This will return the templates themselves, not just a list of them. To retrieve the next twenty templates, use the nextToken string returned with the array
 */
export const listJobTemplates: {
  (
    input: ListJobTemplatesRequest,
  ): effect.Effect<
    ListJobTemplatesResponse,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobTemplatesRequest,
  ) => stream.Stream<
    ListJobTemplatesResponse,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobTemplatesRequest,
  ) => stream.Stream<
    JobTemplate,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobTemplatesRequest,
  output: ListJobTemplatesResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "JobTemplates",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieve a JSON array of up to twenty of your presets. This will return the presets themselves, not just a list of them. To retrieve the next twenty presets, use the nextToken string returned with the array.
 */
export const listPresets: {
  (
    input: ListPresetsRequest,
  ): effect.Effect<
    ListPresetsResponse,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPresetsRequest,
  ) => stream.Stream<
    ListPresetsResponse,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPresetsRequest,
  ) => stream.Stream<
    Preset,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPresetsRequest,
  output: ListPresetsResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Presets",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieve a JSON array of up to twenty of your queues. This will return the queues themselves, not just a list of them. To retrieve the next twenty queues, use the nextToken string returned with the array.
 */
export const listQueues: {
  (
    input: ListQueuesRequest,
  ): effect.Effect<
    ListQueuesResponse,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListQueuesRequest,
  ) => stream.Stream<
    ListQueuesResponse,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListQueuesRequest,
  ) => stream.Stream<
    Queue,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListQueuesRequest,
  output: ListQueuesResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Queues",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Create or change your policy. For more information about policies, see the user guide at http://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
 */
export const putPolicy: (
  input: PutPolicyRequest,
) => effect.Effect<
  PutPolicyResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPolicyRequest,
  output: PutPolicyResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieve a JSON array that includes job details for up to twenty of your most recent jobs. Optionally filter results further according to input file, queue, or status. To retrieve the twenty next most recent jobs, use the nextToken string returned with the array.
 */
export const searchJobs: {
  (
    input: SearchJobsRequest,
  ): effect.Effect<
    SearchJobsResponse,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchJobsRequest,
  ) => stream.Stream<
    SearchJobsResponse,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchJobsRequest,
  ) => stream.Stream<
    Job,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | ServiceQuotaExceededException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchJobsRequest,
  output: SearchJobsResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Jobs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Modify one of your existing job templates.
 */
export const updateJobTemplate: (
  input: UpdateJobTemplateRequest,
) => effect.Effect<
  UpdateJobTemplateResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateJobTemplateRequest,
  output: UpdateJobTemplateResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Modify one of your existing presets.
 */
export const updatePreset: (
  input: UpdatePresetRequest,
) => effect.Effect<
  UpdatePresetResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePresetRequest,
  output: UpdatePresetResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Modify one of your existing queues.
 */
export const updateQueue: (
  input: UpdateQueueRequest,
) => effect.Effect<
  UpdateQueueResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateQueueRequest,
  output: UpdateQueueResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Permanently delete a preset you have created.
 */
export const deletePreset: (
  input: DeletePresetRequest,
) => effect.Effect<
  DeletePresetResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePresetRequest,
  output: DeletePresetResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Permanently delete a queue you have created.
 */
export const deleteQueue: (
  input: DeleteQueueRequest,
) => effect.Effect<
  DeleteQueueResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteQueueRequest,
  output: DeleteQueueResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes an association between the Amazon Resource Name (ARN) of an AWS Certificate Manager (ACM) certificate and an AWS Elemental MediaConvert resource.
 */
export const disassociateCertificate: (
  input: DisassociateCertificateRequest,
) => effect.Effect<
  DisassociateCertificateResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateCertificateRequest,
  output: DisassociateCertificateResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Add tags to a MediaConvert queue, preset, or job template. For information about tagging, see the User Guide at https://docs.aws.amazon.com/mediaconvert/latest/ug/tagging-resources.html
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Remove tags from a MediaConvert queue, preset, or job template. For information about tagging, see the User Guide at https://docs.aws.amazon.com/mediaconvert/latest/ug/tagging-resources.html
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Associates an AWS Certificate Manager (ACM) Amazon Resource Name (ARN) with AWS Elemental MediaConvert.
 */
export const associateCertificate: (
  input: AssociateCertificateRequest,
) => effect.Effect<
  AssociateCertificateResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateCertificateRequest,
  output: AssociateCertificateResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Permanently cancel a job. Once you have canceled a job, you can't start it again.
 */
export const cancelJob: (
  input: CancelJobRequest,
) => effect.Effect<
  CancelJobResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelJobRequest,
  output: CancelJobResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Create a new resource share request for MediaConvert resources with AWS Support.
 */
export const createResourceShare: (
  input: CreateResourceShareRequest,
) => effect.Effect<
  CreateResourceShareResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResourceShareRequest,
  output: CreateResourceShareResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Permanently delete a job template you have created.
 */
export const deleteJobTemplate: (
  input: DeleteJobTemplateRequest,
) => effect.Effect<
  DeleteJobTemplateResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJobTemplateRequest,
  output: DeleteJobTemplateResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Create a new transcoding queue. For information about queues, see Working With Queues in the User Guide at https://docs.aws.amazon.com/mediaconvert/latest/ug/working-with-queues.html
 */
export const createQueue: (
  input: CreateQueueRequest,
) => effect.Effect<
  CreateQueueResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateQueueRequest,
  output: CreateQueueResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Create a new job template. For information about job templates see the User Guide at http://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
 */
export const createJobTemplate: (
  input: CreateJobTemplateRequest,
) => effect.Effect<
  CreateJobTemplateResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateJobTemplateRequest,
  output: CreateJobTemplateResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Create a new preset. For information about job templates see the User Guide at http://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
 */
export const createPreset: (
  input: CreatePresetRequest,
) => effect.Effect<
  CreatePresetResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePresetRequest,
  output: CreatePresetResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Use Probe to obtain detailed information about your input media files. Probe returns a JSON that includes container, codec, frame rate, resolution, track count, audio layout, captions, and more. You can use this information to learn more about your media files, or to help make decisions while automating your transcoding workflow.
 */
export const probe: (
  input: ProbeRequest,
) => effect.Effect<
  ProbeResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ProbeRequest,
  output: ProbeResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Create a new transcoding job. For information about jobs and job settings, see the User Guide at http://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
 */
export const createJob: (
  input: CreateJobRequest,
) => effect.Effect<
  CreateJobResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateJobRequest,
  output: CreateJobResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
  ],
}));

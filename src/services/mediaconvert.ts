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
  sdkId: "MediaConvert",
  serviceShapeName: "MediaConvert",
});
const auth = T.AwsAuthSigv4({ name: "mediaconvert" });
const ver = T.ServiceVersion("2017-08-29");
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
                        url: "https://mediaconvert-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://mediaconvert.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://mediaconvert-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://mediaconvert.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [{ ref: "Region" }, "cn-northwest-1"],
                },
              ],
              endpoint: {
                url: "https://subscribe.mediaconvert.cn-northwest-1.amazonaws.com.cn",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://mediaconvert.{Region}.{PartitionResult#dnsSuffix}",
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

//# Newtypes
export type __string = string;
export type __integerMinNegative50Max50 = number;
export type __integer = number;
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
export type __double = number;
export type __long = number;
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
export type __listOf__string = string[];
export const __listOf__string = S.Array(S.String);
export interface AssociateCertificateRequest {
  Arn: string;
}
export const AssociateCertificateRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.JsonName("arn")) }).pipe(
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
  JobId: string;
  SupportCaseId: string;
}
export const CreateResourceShareRequest = S.suspend(() =>
  S.Struct({
    JobId: S.String.pipe(T.JsonName("jobId")),
    SupportCaseId: S.String.pipe(T.JsonName("supportCaseId")),
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
  Mode?: string;
  NextToken?: string;
}
export const DescribeEndpointsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    Mode: S.optional(S.String).pipe(T.JsonName("mode")),
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
  Order?: string;
  Queue?: string;
  Status?: string;
}
export const ListJobsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Order: S.optional(S.String).pipe(T.HttpQuery("order")),
    Queue: S.optional(S.String).pipe(T.HttpQuery("queue")),
    Status: S.optional(S.String).pipe(T.HttpQuery("status")),
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
  ListBy?: string;
  MaxResults?: number;
  NextToken?: string;
  Order?: string;
}
export const ListJobTemplatesRequest = S.suspend(() =>
  S.Struct({
    Category: S.optional(S.String).pipe(T.HttpQuery("category")),
    ListBy: S.optional(S.String).pipe(T.HttpQuery("listBy")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Order: S.optional(S.String).pipe(T.HttpQuery("order")),
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
  ListBy?: string;
  MaxResults?: number;
  NextToken?: string;
  Order?: string;
}
export const ListPresetsRequest = S.suspend(() =>
  S.Struct({
    Category: S.optional(S.String).pipe(T.HttpQuery("category")),
    ListBy: S.optional(S.String).pipe(T.HttpQuery("listBy")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Order: S.optional(S.String).pipe(T.HttpQuery("order")),
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
  ListBy?: string;
  MaxResults?: number;
  NextToken?: string;
  Order?: string;
}
export const ListQueuesRequest = S.suspend(() =>
  S.Struct({
    ListBy: S.optional(S.String).pipe(T.HttpQuery("listBy")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Order: S.optional(S.String).pipe(T.HttpQuery("order")),
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
export interface Policy {
  HttpInputs?: string;
  HttpsInputs?: string;
  S3Inputs?: string;
}
export const Policy = S.suspend(() =>
  S.Struct({
    HttpInputs: S.optional(S.String).pipe(T.JsonName("httpInputs")),
    HttpsInputs: S.optional(S.String).pipe(T.JsonName("httpsInputs")),
    S3Inputs: S.optional(S.String).pipe(T.JsonName("s3Inputs")),
  }),
).annotations({ identifier: "Policy" }) as any as S.Schema<Policy>;
export interface PutPolicyRequest {
  Policy: Policy;
}
export const PutPolicyRequest = S.suspend(() =>
  S.Struct({
    Policy: Policy.pipe(T.JsonName("policy")).annotations({
      identifier: "Policy",
    }),
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
  Order?: string;
  Queue?: string;
  Status?: string;
}
export const SearchJobsRequest = S.suspend(() =>
  S.Struct({
    InputFile: S.optional(S.String).pipe(T.HttpQuery("inputFile")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Order: S.optional(S.String).pipe(T.HttpQuery("order")),
    Queue: S.optional(S.String).pipe(T.HttpQuery("queue")),
    Status: S.optional(S.String).pipe(T.HttpQuery("status")),
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
  Arn: string;
  Tags: __mapOf__string;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.JsonName("arn")),
    Tags: __mapOf__string.pipe(T.JsonName("tags")),
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
  TagKeys?: __listOf__string;
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
export interface AccelerationSettings {
  Mode: string;
}
export const AccelerationSettings = S.suspend(() =>
  S.Struct({ Mode: S.String.pipe(T.JsonName("mode")) }),
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
export interface ColorConversion3DLUTSetting {
  FileInput?: string;
  InputColorSpace?: string;
  InputMasteringLuminance?: number;
  OutputColorSpace?: string;
  OutputMasteringLuminance?: number;
}
export const ColorConversion3DLUTSetting = S.suspend(() =>
  S.Struct({
    FileInput: S.optional(S.String).pipe(T.JsonName("fileInput")),
    InputColorSpace: S.optional(S.String).pipe(T.JsonName("inputColorSpace")),
    InputMasteringLuminance: S.optional(S.Number).pipe(
      T.JsonName("inputMasteringLuminance"),
    ),
    OutputColorSpace: S.optional(S.String).pipe(T.JsonName("outputColorSpace")),
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
export interface ExtendedDataServices {
  CopyProtectionAction?: string;
  VchipAction?: string;
}
export const ExtendedDataServices = S.suspend(() =>
  S.Struct({
    CopyProtectionAction: S.optional(S.String).pipe(
      T.JsonName("copyProtectionAction"),
    ),
    VchipAction: S.optional(S.String).pipe(T.JsonName("vchipAction")),
  }),
).annotations({
  identifier: "ExtendedDataServices",
}) as any as S.Schema<ExtendedDataServices>;
export interface AdvancedInputFilterSettings {
  AddTexture?: string;
  Sharpening?: string;
}
export const AdvancedInputFilterSettings = S.suspend(() =>
  S.Struct({
    AddTexture: S.optional(S.String).pipe(T.JsonName("addTexture")),
    Sharpening: S.optional(S.String).pipe(T.JsonName("sharpening")),
  }),
).annotations({
  identifier: "AdvancedInputFilterSettings",
}) as any as S.Schema<AdvancedInputFilterSettings>;
export type __listOf__stringMin1 = string[];
export const __listOf__stringMin1 = S.Array(S.String);
export interface AudioSelectorGroup {
  AudioSelectorNames?: __listOf__stringMin1;
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
export interface HlsRenditionGroupSettings {
  RenditionGroupId?: string;
  RenditionLanguageCode?: string;
  RenditionName?: string;
}
export const HlsRenditionGroupSettings = S.suspend(() =>
  S.Struct({
    RenditionGroupId: S.optional(S.String).pipe(T.JsonName("renditionGroupId")),
    RenditionLanguageCode: S.optional(S.String).pipe(
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
  InputChannels?: __listOf__integerMinNegative60Max6;
  InputChannelsFineTune?: __listOf__doubleMinNegative60Max6;
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
  OutputChannels?: __listOfOutputChannelMapping;
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
export interface AudioSelector {
  AudioDurationCorrection?: string;
  CustomLanguageCode?: string;
  DefaultSelection?: string;
  ExternalAudioFileInput?: string;
  HlsRenditionGroupSettings?: HlsRenditionGroupSettings;
  LanguageCode?: string;
  Offset?: number;
  Pids?: __listOf__integerMin1Max2147483647;
  ProgramSelection?: number;
  RemixSettings?: RemixSettings;
  SelectorType?: string;
  Streams?: __listOf__integerMin1Max2147483647;
  Tracks?: __listOf__integerMin1Max2147483647;
}
export const AudioSelector = S.suspend(() =>
  S.Struct({
    AudioDurationCorrection: S.optional(S.String).pipe(
      T.JsonName("audioDurationCorrection"),
    ),
    CustomLanguageCode: S.optional(S.String).pipe(
      T.JsonName("customLanguageCode"),
    ),
    DefaultSelection: S.optional(S.String).pipe(T.JsonName("defaultSelection")),
    ExternalAudioFileInput: S.optional(S.String).pipe(
      T.JsonName("externalAudioFileInput"),
    ),
    HlsRenditionGroupSettings: S.optional(HlsRenditionGroupSettings)
      .pipe(T.JsonName("hlsRenditionGroupSettings"))
      .annotations({ identifier: "HlsRenditionGroupSettings" }),
    LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
    Offset: S.optional(S.Number).pipe(T.JsonName("offset")),
    Pids: S.optional(__listOf__integerMin1Max2147483647).pipe(
      T.JsonName("pids"),
    ),
    ProgramSelection: S.optional(S.Number).pipe(T.JsonName("programSelection")),
    RemixSettings: S.optional(RemixSettings)
      .pipe(T.JsonName("remixSettings"))
      .annotations({ identifier: "RemixSettings" }),
    SelectorType: S.optional(S.String).pipe(T.JsonName("selectorType")),
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
export interface AncillarySourceSettings {
  Convert608To708?: string;
  SourceAncillaryChannelNumber?: number;
  TerminateCaptions?: string;
}
export const AncillarySourceSettings = S.suspend(() =>
  S.Struct({
    Convert608To708: S.optional(S.String).pipe(T.JsonName("convert608To708")),
    SourceAncillaryChannelNumber: S.optional(S.Number).pipe(
      T.JsonName("sourceAncillaryChannelNumber"),
    ),
    TerminateCaptions: S.optional(S.String).pipe(
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
export interface EmbeddedSourceSettings {
  Convert608To708?: string;
  Source608ChannelNumber?: number;
  Source608TrackNumber?: number;
  TerminateCaptions?: string;
}
export const EmbeddedSourceSettings = S.suspend(() =>
  S.Struct({
    Convert608To708: S.optional(S.String).pipe(T.JsonName("convert608To708")),
    Source608ChannelNumber: S.optional(S.Number).pipe(
      T.JsonName("source608ChannelNumber"),
    ),
    Source608TrackNumber: S.optional(S.Number).pipe(
      T.JsonName("source608TrackNumber"),
    ),
    TerminateCaptions: S.optional(S.String).pipe(
      T.JsonName("terminateCaptions"),
    ),
  }),
).annotations({
  identifier: "EmbeddedSourceSettings",
}) as any as S.Schema<EmbeddedSourceSettings>;
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
export interface FileSourceSettings {
  ByteRateLimit?: string;
  Convert608To708?: string;
  ConvertPaintToPop?: string;
  Framerate?: CaptionSourceFramerate;
  SourceFile?: string;
  TimeDelta?: number;
  TimeDeltaUnits?: string;
  UpconvertSTLToTeletext?: string;
}
export const FileSourceSettings = S.suspend(() =>
  S.Struct({
    ByteRateLimit: S.optional(S.String).pipe(T.JsonName("byteRateLimit")),
    Convert608To708: S.optional(S.String).pipe(T.JsonName("convert608To708")),
    ConvertPaintToPop: S.optional(S.String).pipe(
      T.JsonName("convertPaintToPop"),
    ),
    Framerate: S.optional(CaptionSourceFramerate)
      .pipe(T.JsonName("framerate"))
      .annotations({ identifier: "CaptionSourceFramerate" }),
    SourceFile: S.optional(S.String).pipe(T.JsonName("sourceFile")),
    TimeDelta: S.optional(S.Number).pipe(T.JsonName("timeDelta")),
    TimeDeltaUnits: S.optional(S.String).pipe(T.JsonName("timeDeltaUnits")),
    UpconvertSTLToTeletext: S.optional(S.String).pipe(
      T.JsonName("upconvertSTLToTeletext"),
    ),
  }),
).annotations({
  identifier: "FileSourceSettings",
}) as any as S.Schema<FileSourceSettings>;
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
  RenditionLanguageCode?: string;
  RenditionName?: string;
}
export const WebvttHlsSourceSettings = S.suspend(() =>
  S.Struct({
    RenditionGroupId: S.optional(S.String).pipe(T.JsonName("renditionGroupId")),
    RenditionLanguageCode: S.optional(S.String).pipe(
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
  SourceType?: string;
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
    SourceType: S.optional(S.String).pipe(T.JsonName("sourceType")),
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
  LanguageCode?: string;
  SourceSettings?: CaptionSourceSettings;
}
export const CaptionSelector = S.suspend(() =>
  S.Struct({
    CustomLanguageCode: S.optional(S.String).pipe(
      T.JsonName("customLanguageCode"),
    ),
    LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
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
export interface DynamicAudioSelector {
  AudioDurationCorrection?: string;
  ExternalAudioFileInput?: string;
  LanguageCode?: string;
  Offset?: number;
  SelectorType?: string;
}
export const DynamicAudioSelector = S.suspend(() =>
  S.Struct({
    AudioDurationCorrection: S.optional(S.String).pipe(
      T.JsonName("audioDurationCorrection"),
    ),
    ExternalAudioFileInput: S.optional(S.String).pipe(
      T.JsonName("externalAudioFileInput"),
    ),
    LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
    Offset: S.optional(S.Number).pipe(T.JsonName("offset")),
    SelectorType: S.optional(S.String).pipe(T.JsonName("selectorType")),
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
  InsertableImages?: __listOfInsertableImage;
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
export interface VideoOverlayCrop {
  Height?: number;
  Unit?: string;
  Width?: number;
  X?: number;
  Y?: number;
}
export const VideoOverlayCrop = S.suspend(() =>
  S.Struct({
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    Unit: S.optional(S.String).pipe(T.JsonName("unit")),
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
  Unit?: string;
  Width?: number;
  XPosition?: number;
  YPosition?: number;
}
export const VideoOverlayPosition = S.suspend(() =>
  S.Struct({
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    Opacity: S.optional(S.Number).pipe(T.JsonName("opacity")),
    Unit: S.optional(S.String).pipe(T.JsonName("unit")),
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
  AudioSelectors?: __mapOfAudioSelector;
  FileInput?: string;
  InputClippings?: __listOfVideoOverlayInputClipping;
  TimecodeSource?: string;
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
    TimecodeSource: S.optional(S.String).pipe(T.JsonName("timecodeSource")),
    TimecodeStart: S.optional(S.String).pipe(T.JsonName("timecodeStart")),
  }),
).annotations({
  identifier: "VideoOverlayInput",
}) as any as S.Schema<VideoOverlayInput>;
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
  Playback?: string;
  StartTimecode?: string;
  Transitions?: __listOfVideoOverlayTransition;
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
    Playback: S.optional(S.String).pipe(T.JsonName("playback")),
    StartTimecode: S.optional(S.String).pipe(T.JsonName("startTimecode")),
    Transitions: S.optional(__listOfVideoOverlayTransition).pipe(
      T.JsonName("transitions"),
    ),
  }),
).annotations({ identifier: "VideoOverlay" }) as any as S.Schema<VideoOverlay>;
export type __listOfVideoOverlay = VideoOverlay[];
export const __listOfVideoOverlay = S.Array(VideoOverlay);
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
export interface VideoSelector {
  AlphaBehavior?: string;
  ColorSpace?: string;
  ColorSpaceUsage?: string;
  EmbeddedTimecodeOverride?: string;
  Hdr10Metadata?: Hdr10Metadata;
  MaxLuminance?: number;
  PadVideo?: string;
  Pid?: number;
  ProgramNumber?: number;
  Rotate?: string;
  SampleRange?: string;
  SelectorType?: string;
  Streams?: __listOf__integerMin1Max2147483647;
}
export const VideoSelector = S.suspend(() =>
  S.Struct({
    AlphaBehavior: S.optional(S.String).pipe(T.JsonName("alphaBehavior")),
    ColorSpace: S.optional(S.String).pipe(T.JsonName("colorSpace")),
    ColorSpaceUsage: S.optional(S.String).pipe(T.JsonName("colorSpaceUsage")),
    EmbeddedTimecodeOverride: S.optional(S.String).pipe(
      T.JsonName("embeddedTimecodeOverride"),
    ),
    Hdr10Metadata: S.optional(Hdr10Metadata)
      .pipe(T.JsonName("hdr10Metadata"))
      .annotations({ identifier: "Hdr10Metadata" }),
    MaxLuminance: S.optional(S.Number).pipe(T.JsonName("maxLuminance")),
    PadVideo: S.optional(S.String).pipe(T.JsonName("padVideo")),
    Pid: S.optional(S.Number).pipe(T.JsonName("pid")),
    ProgramNumber: S.optional(S.Number).pipe(T.JsonName("programNumber")),
    Rotate: S.optional(S.String).pipe(T.JsonName("rotate")),
    SampleRange: S.optional(S.String).pipe(T.JsonName("sampleRange")),
    SelectorType: S.optional(S.String).pipe(T.JsonName("selectorType")),
    Streams: S.optional(__listOf__integerMin1Max2147483647).pipe(
      T.JsonName("streams"),
    ),
  }),
).annotations({
  identifier: "VideoSelector",
}) as any as S.Schema<VideoSelector>;
export interface InputTemplate {
  AdvancedInputFilter?: string;
  AdvancedInputFilterSettings?: AdvancedInputFilterSettings;
  AudioSelectorGroups?: __mapOfAudioSelectorGroup;
  AudioSelectors?: __mapOfAudioSelector;
  CaptionSelectors?: __mapOfCaptionSelector;
  Crop?: Rectangle;
  DeblockFilter?: string;
  DenoiseFilter?: string;
  DolbyVisionMetadataXml?: string;
  DynamicAudioSelectors?: __mapOfDynamicAudioSelector;
  FilterEnable?: string;
  FilterStrength?: number;
  ImageInserter?: ImageInserter;
  InputClippings?: __listOfInputClipping;
  InputScanType?: string;
  Position?: Rectangle;
  ProgramNumber?: number;
  PsiControl?: string;
  TimecodeSource?: string;
  TimecodeStart?: string;
  VideoOverlays?: __listOfVideoOverlay;
  VideoSelector?: VideoSelector;
}
export const InputTemplate = S.suspend(() =>
  S.Struct({
    AdvancedInputFilter: S.optional(S.String).pipe(
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
    DeblockFilter: S.optional(S.String).pipe(T.JsonName("deblockFilter")),
    DenoiseFilter: S.optional(S.String).pipe(T.JsonName("denoiseFilter")),
    DolbyVisionMetadataXml: S.optional(S.String).pipe(
      T.JsonName("dolbyVisionMetadataXml"),
    ),
    DynamicAudioSelectors: S.optional(__mapOfDynamicAudioSelector).pipe(
      T.JsonName("dynamicAudioSelectors"),
    ),
    FilterEnable: S.optional(S.String).pipe(T.JsonName("filterEnable")),
    FilterStrength: S.optional(S.Number).pipe(T.JsonName("filterStrength")),
    ImageInserter: S.optional(ImageInserter)
      .pipe(T.JsonName("imageInserter"))
      .annotations({ identifier: "ImageInserter" }),
    InputClippings: S.optional(__listOfInputClipping).pipe(
      T.JsonName("inputClippings"),
    ),
    InputScanType: S.optional(S.String).pipe(T.JsonName("inputScanType")),
    Position: S.optional(Rectangle)
      .pipe(T.JsonName("position"))
      .annotations({ identifier: "Rectangle" }),
    ProgramNumber: S.optional(S.Number).pipe(T.JsonName("programNumber")),
    PsiControl: S.optional(S.String).pipe(T.JsonName("psiControl")),
    TimecodeSource: S.optional(S.String).pipe(T.JsonName("timecodeSource")),
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
export interface MotionImageInserter {
  Framerate?: MotionImageInsertionFramerate;
  Input?: string;
  InsertionMode?: string;
  Offset?: MotionImageInsertionOffset;
  Playback?: string;
  StartTime?: string;
}
export const MotionImageInserter = S.suspend(() =>
  S.Struct({
    Framerate: S.optional(MotionImageInsertionFramerate)
      .pipe(T.JsonName("framerate"))
      .annotations({ identifier: "MotionImageInsertionFramerate" }),
    Input: S.optional(S.String).pipe(T.JsonName("input")),
    InsertionMode: S.optional(S.String).pipe(T.JsonName("insertionMode")),
    Offset: S.optional(MotionImageInsertionOffset)
      .pipe(T.JsonName("offset"))
      .annotations({ identifier: "MotionImageInsertionOffset" }),
    Playback: S.optional(S.String).pipe(T.JsonName("playback")),
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
export interface NielsenNonLinearWatermarkSettings {
  ActiveWatermarkProcess?: string;
  AdiFilename?: string;
  AssetId?: string;
  AssetName?: string;
  CbetSourceId?: string;
  EpisodeId?: string;
  MetadataDestination?: string;
  SourceId?: number;
  SourceWatermarkStatus?: string;
  TicServerUrl?: string;
  UniqueTicPerAudioTrack?: string;
}
export const NielsenNonLinearWatermarkSettings = S.suspend(() =>
  S.Struct({
    ActiveWatermarkProcess: S.optional(S.String).pipe(
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
    SourceWatermarkStatus: S.optional(S.String).pipe(
      T.JsonName("sourceWatermarkStatus"),
    ),
    TicServerUrl: S.optional(S.String).pipe(T.JsonName("ticServerUrl")),
    UniqueTicPerAudioTrack: S.optional(S.String).pipe(
      T.JsonName("uniqueTicPerAudioTrack"),
    ),
  }),
).annotations({
  identifier: "NielsenNonLinearWatermarkSettings",
}) as any as S.Schema<NielsenNonLinearWatermarkSettings>;
export interface AllowedRenditionSize {
  Height?: number;
  Required?: string;
  Width?: number;
}
export const AllowedRenditionSize = S.suspend(() =>
  S.Struct({
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    Required: S.optional(S.String).pipe(T.JsonName("required")),
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
export interface AutomatedAbrRule {
  AllowedRenditions?: __listOfAllowedRenditionSize;
  ForceIncludeRenditions?: __listOfForceIncludeRenditionSize;
  MinBottomRenditionSize?: MinBottomRenditionSize;
  MinTopRenditionSize?: MinTopRenditionSize;
  Type?: string;
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
    Type: S.optional(S.String).pipe(T.JsonName("type")),
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
  Rules?: __listOfAutomatedAbrRule;
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
  SelectedOutputs?: __listOf__stringMin1;
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
export interface S3DestinationAccessControl {
  CannedAcl?: string;
}
export const S3DestinationAccessControl = S.suspend(() =>
  S.Struct({ CannedAcl: S.optional(S.String).pipe(T.JsonName("cannedAcl")) }),
).annotations({
  identifier: "S3DestinationAccessControl",
}) as any as S.Schema<S3DestinationAccessControl>;
export interface S3EncryptionSettings {
  EncryptionType?: string;
  KmsEncryptionContext?: string;
  KmsKeyArn?: string;
}
export const S3EncryptionSettings = S.suspend(() =>
  S.Struct({
    EncryptionType: S.optional(S.String).pipe(T.JsonName("encryptionType")),
    KmsEncryptionContext: S.optional(S.String).pipe(
      T.JsonName("kmsEncryptionContext"),
    ),
    KmsKeyArn: S.optional(S.String).pipe(T.JsonName("kmsKeyArn")),
  }),
).annotations({
  identifier: "S3EncryptionSettings",
}) as any as S.Schema<S3EncryptionSettings>;
export interface S3DestinationSettings {
  AccessControl?: S3DestinationAccessControl;
  Encryption?: S3EncryptionSettings;
  StorageClass?: string;
}
export const S3DestinationSettings = S.suspend(() =>
  S.Struct({
    AccessControl: S.optional(S3DestinationAccessControl)
      .pipe(T.JsonName("accessControl"))
      .annotations({ identifier: "S3DestinationAccessControl" }),
    Encryption: S.optional(S3EncryptionSettings)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "S3EncryptionSettings" }),
    StorageClass: S.optional(S.String).pipe(T.JsonName("storageClass")),
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
export type __listOf__stringMin36Max36Pattern09aFAF809aFAF409aFAF409aFAF409aFAF12 =
  string[];
export const __listOf__stringMin36Max36Pattern09aFAF809aFAF409aFAF409aFAF409aFAF12 =
  S.Array(S.String);
export interface EncryptionContractConfiguration {
  SpekeAudioPreset?: string;
  SpekeVideoPreset?: string;
}
export const EncryptionContractConfiguration = S.suspend(() =>
  S.Struct({
    SpekeAudioPreset: S.optional(S.String).pipe(T.JsonName("spekeAudioPreset")),
    SpekeVideoPreset: S.optional(S.String).pipe(T.JsonName("spekeVideoPreset")),
  }),
).annotations({
  identifier: "EncryptionContractConfiguration",
}) as any as S.Schema<EncryptionContractConfiguration>;
export interface SpekeKeyProviderCmaf {
  CertificateArn?: string;
  DashSignaledSystemIds?: __listOf__stringMin36Max36Pattern09aFAF809aFAF409aFAF409aFAF409aFAF12;
  EncryptionContractConfiguration?: EncryptionContractConfiguration;
  HlsSignaledSystemIds?: __listOf__stringMin36Max36Pattern09aFAF809aFAF409aFAF409aFAF409aFAF12;
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
export interface CmafEncryptionSettings {
  ConstantInitializationVector?: string;
  EncryptionMethod?: string;
  InitializationVectorInManifest?: string;
  SpekeKeyProvider?: SpekeKeyProviderCmaf;
  StaticKeyProvider?: StaticKeyProvider;
  Type?: string;
}
export const CmafEncryptionSettings = S.suspend(() =>
  S.Struct({
    ConstantInitializationVector: S.optional(S.String).pipe(
      T.JsonName("constantInitializationVector"),
    ),
    EncryptionMethod: S.optional(S.String).pipe(T.JsonName("encryptionMethod")),
    InitializationVectorInManifest: S.optional(S.String).pipe(
      T.JsonName("initializationVectorInManifest"),
    ),
    SpekeKeyProvider: S.optional(SpekeKeyProviderCmaf)
      .pipe(T.JsonName("spekeKeyProvider"))
      .annotations({ identifier: "SpekeKeyProviderCmaf" }),
    StaticKeyProvider: S.optional(StaticKeyProvider)
      .pipe(T.JsonName("staticKeyProvider"))
      .annotations({ identifier: "StaticKeyProvider" }),
    Type: S.optional(S.String).pipe(T.JsonName("type")),
  }),
).annotations({
  identifier: "CmafEncryptionSettings",
}) as any as S.Schema<CmafEncryptionSettings>;
export interface CmafImageBasedTrickPlaySettings {
  IntervalCadence?: string;
  ThumbnailHeight?: number;
  ThumbnailInterval?: number;
  ThumbnailWidth?: number;
  TileHeight?: number;
  TileWidth?: number;
}
export const CmafImageBasedTrickPlaySettings = S.suspend(() =>
  S.Struct({
    IntervalCadence: S.optional(S.String).pipe(T.JsonName("intervalCadence")),
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
export interface CmafGroupSettings {
  AdditionalManifests?: __listOfCmafAdditionalManifest;
  BaseUrl?: string;
  ClientCache?: string;
  CodecSpecification?: string;
  DashIFrameTrickPlayNameModifier?: string;
  DashManifestStyle?: string;
  Destination?: string;
  DestinationSettings?: DestinationSettings;
  Encryption?: CmafEncryptionSettings;
  FragmentLength?: number;
  ImageBasedTrickPlay?: string;
  ImageBasedTrickPlaySettings?: CmafImageBasedTrickPlaySettings;
  ManifestCompression?: string;
  ManifestDurationFormat?: string;
  MinBufferTime?: number;
  MinFinalSegmentLength?: number;
  MpdManifestBandwidthType?: string;
  MpdProfile?: string;
  PtsOffsetHandlingForBFrames?: string;
  SegmentControl?: string;
  SegmentLength?: number;
  SegmentLengthControl?: string;
  StreamInfResolution?: string;
  TargetDurationCompatibilityMode?: string;
  VideoCompositionOffsets?: string;
  WriteDashManifest?: string;
  WriteHlsManifest?: string;
  WriteSegmentTimelineInRepresentation?: string;
}
export const CmafGroupSettings = S.suspend(() =>
  S.Struct({
    AdditionalManifests: S.optional(__listOfCmafAdditionalManifest).pipe(
      T.JsonName("additionalManifests"),
    ),
    BaseUrl: S.optional(S.String).pipe(T.JsonName("baseUrl")),
    ClientCache: S.optional(S.String).pipe(T.JsonName("clientCache")),
    CodecSpecification: S.optional(S.String).pipe(
      T.JsonName("codecSpecification"),
    ),
    DashIFrameTrickPlayNameModifier: S.optional(S.String).pipe(
      T.JsonName("dashIFrameTrickPlayNameModifier"),
    ),
    DashManifestStyle: S.optional(S.String).pipe(
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
    ImageBasedTrickPlay: S.optional(S.String).pipe(
      T.JsonName("imageBasedTrickPlay"),
    ),
    ImageBasedTrickPlaySettings: S.optional(CmafImageBasedTrickPlaySettings)
      .pipe(T.JsonName("imageBasedTrickPlaySettings"))
      .annotations({ identifier: "CmafImageBasedTrickPlaySettings" }),
    ManifestCompression: S.optional(S.String).pipe(
      T.JsonName("manifestCompression"),
    ),
    ManifestDurationFormat: S.optional(S.String).pipe(
      T.JsonName("manifestDurationFormat"),
    ),
    MinBufferTime: S.optional(S.Number).pipe(T.JsonName("minBufferTime")),
    MinFinalSegmentLength: S.optional(S.Number).pipe(
      T.JsonName("minFinalSegmentLength"),
    ),
    MpdManifestBandwidthType: S.optional(S.String).pipe(
      T.JsonName("mpdManifestBandwidthType"),
    ),
    MpdProfile: S.optional(S.String).pipe(T.JsonName("mpdProfile")),
    PtsOffsetHandlingForBFrames: S.optional(S.String).pipe(
      T.JsonName("ptsOffsetHandlingForBFrames"),
    ),
    SegmentControl: S.optional(S.String).pipe(T.JsonName("segmentControl")),
    SegmentLength: S.optional(S.Number).pipe(T.JsonName("segmentLength")),
    SegmentLengthControl: S.optional(S.String).pipe(
      T.JsonName("segmentLengthControl"),
    ),
    StreamInfResolution: S.optional(S.String).pipe(
      T.JsonName("streamInfResolution"),
    ),
    TargetDurationCompatibilityMode: S.optional(S.String).pipe(
      T.JsonName("targetDurationCompatibilityMode"),
    ),
    VideoCompositionOffsets: S.optional(S.String).pipe(
      T.JsonName("videoCompositionOffsets"),
    ),
    WriteDashManifest: S.optional(S.String).pipe(
      T.JsonName("writeDashManifest"),
    ),
    WriteHlsManifest: S.optional(S.String).pipe(T.JsonName("writeHlsManifest")),
    WriteSegmentTimelineInRepresentation: S.optional(S.String).pipe(
      T.JsonName("writeSegmentTimelineInRepresentation"),
    ),
  }),
).annotations({
  identifier: "CmafGroupSettings",
}) as any as S.Schema<CmafGroupSettings>;
export interface DashAdditionalManifest {
  ManifestNameModifier?: string;
  SelectedOutputs?: __listOf__stringMin1;
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
export type __listOf__stringPattern09aFAF809aFAF409aFAF409aFAF409aFAF12 =
  string[];
export const __listOf__stringPattern09aFAF809aFAF409aFAF409aFAF409aFAF12 =
  S.Array(S.String);
export interface SpekeKeyProvider {
  CertificateArn?: string;
  EncryptionContractConfiguration?: EncryptionContractConfiguration;
  ResourceId?: string;
  SystemIds?: __listOf__stringPattern09aFAF809aFAF409aFAF409aFAF409aFAF12;
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
  PlaybackDeviceCompatibility?: string;
  SpekeKeyProvider?: SpekeKeyProvider;
}
export const DashIsoEncryptionSettings = S.suspend(() =>
  S.Struct({
    PlaybackDeviceCompatibility: S.optional(S.String).pipe(
      T.JsonName("playbackDeviceCompatibility"),
    ),
    SpekeKeyProvider: S.optional(SpekeKeyProvider)
      .pipe(T.JsonName("spekeKeyProvider"))
      .annotations({ identifier: "SpekeKeyProvider" }),
  }),
).annotations({
  identifier: "DashIsoEncryptionSettings",
}) as any as S.Schema<DashIsoEncryptionSettings>;
export interface DashIsoImageBasedTrickPlaySettings {
  IntervalCadence?: string;
  ThumbnailHeight?: number;
  ThumbnailInterval?: number;
  ThumbnailWidth?: number;
  TileHeight?: number;
  TileWidth?: number;
}
export const DashIsoImageBasedTrickPlaySettings = S.suspend(() =>
  S.Struct({
    IntervalCadence: S.optional(S.String).pipe(T.JsonName("intervalCadence")),
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
export interface DashIsoGroupSettings {
  AdditionalManifests?: __listOfDashAdditionalManifest;
  AudioChannelConfigSchemeIdUri?: string;
  BaseUrl?: string;
  DashIFrameTrickPlayNameModifier?: string;
  DashManifestStyle?: string;
  Destination?: string;
  DestinationSettings?: DestinationSettings;
  Encryption?: DashIsoEncryptionSettings;
  FragmentLength?: number;
  HbbtvCompliance?: string;
  ImageBasedTrickPlay?: string;
  ImageBasedTrickPlaySettings?: DashIsoImageBasedTrickPlaySettings;
  MinBufferTime?: number;
  MinFinalSegmentLength?: number;
  MpdManifestBandwidthType?: string;
  MpdProfile?: string;
  PtsOffsetHandlingForBFrames?: string;
  SegmentControl?: string;
  SegmentLength?: number;
  SegmentLengthControl?: string;
  VideoCompositionOffsets?: string;
  WriteSegmentTimelineInRepresentation?: string;
}
export const DashIsoGroupSettings = S.suspend(() =>
  S.Struct({
    AdditionalManifests: S.optional(__listOfDashAdditionalManifest).pipe(
      T.JsonName("additionalManifests"),
    ),
    AudioChannelConfigSchemeIdUri: S.optional(S.String).pipe(
      T.JsonName("audioChannelConfigSchemeIdUri"),
    ),
    BaseUrl: S.optional(S.String).pipe(T.JsonName("baseUrl")),
    DashIFrameTrickPlayNameModifier: S.optional(S.String).pipe(
      T.JsonName("dashIFrameTrickPlayNameModifier"),
    ),
    DashManifestStyle: S.optional(S.String).pipe(
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
    HbbtvCompliance: S.optional(S.String).pipe(T.JsonName("hbbtvCompliance")),
    ImageBasedTrickPlay: S.optional(S.String).pipe(
      T.JsonName("imageBasedTrickPlay"),
    ),
    ImageBasedTrickPlaySettings: S.optional(DashIsoImageBasedTrickPlaySettings)
      .pipe(T.JsonName("imageBasedTrickPlaySettings"))
      .annotations({ identifier: "DashIsoImageBasedTrickPlaySettings" }),
    MinBufferTime: S.optional(S.Number).pipe(T.JsonName("minBufferTime")),
    MinFinalSegmentLength: S.optional(S.Number).pipe(
      T.JsonName("minFinalSegmentLength"),
    ),
    MpdManifestBandwidthType: S.optional(S.String).pipe(
      T.JsonName("mpdManifestBandwidthType"),
    ),
    MpdProfile: S.optional(S.String).pipe(T.JsonName("mpdProfile")),
    PtsOffsetHandlingForBFrames: S.optional(S.String).pipe(
      T.JsonName("ptsOffsetHandlingForBFrames"),
    ),
    SegmentControl: S.optional(S.String).pipe(T.JsonName("segmentControl")),
    SegmentLength: S.optional(S.Number).pipe(T.JsonName("segmentLength")),
    SegmentLengthControl: S.optional(S.String).pipe(
      T.JsonName("segmentLengthControl"),
    ),
    VideoCompositionOffsets: S.optional(S.String).pipe(
      T.JsonName("videoCompositionOffsets"),
    ),
    WriteSegmentTimelineInRepresentation: S.optional(S.String).pipe(
      T.JsonName("writeSegmentTimelineInRepresentation"),
    ),
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
export type __listOfHlsAdMarkers = string[];
export const __listOfHlsAdMarkers = S.Array(S.String);
export interface HlsAdditionalManifest {
  ManifestNameModifier?: string;
  SelectedOutputs?: __listOf__stringMin1;
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
export interface HlsCaptionLanguageMapping {
  CaptionChannel?: number;
  CustomLanguageCode?: string;
  LanguageCode?: string;
  LanguageDescription?: string;
}
export const HlsCaptionLanguageMapping = S.suspend(() =>
  S.Struct({
    CaptionChannel: S.optional(S.Number).pipe(T.JsonName("captionChannel")),
    CustomLanguageCode: S.optional(S.String).pipe(
      T.JsonName("customLanguageCode"),
    ),
    LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
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
export interface HlsEncryptionSettings {
  ConstantInitializationVector?: string;
  EncryptionMethod?: string;
  InitializationVectorInManifest?: string;
  OfflineEncrypted?: string;
  SpekeKeyProvider?: SpekeKeyProvider;
  StaticKeyProvider?: StaticKeyProvider;
  Type?: string;
}
export const HlsEncryptionSettings = S.suspend(() =>
  S.Struct({
    ConstantInitializationVector: S.optional(S.String).pipe(
      T.JsonName("constantInitializationVector"),
    ),
    EncryptionMethod: S.optional(S.String).pipe(T.JsonName("encryptionMethod")),
    InitializationVectorInManifest: S.optional(S.String).pipe(
      T.JsonName("initializationVectorInManifest"),
    ),
    OfflineEncrypted: S.optional(S.String).pipe(T.JsonName("offlineEncrypted")),
    SpekeKeyProvider: S.optional(SpekeKeyProvider)
      .pipe(T.JsonName("spekeKeyProvider"))
      .annotations({ identifier: "SpekeKeyProvider" }),
    StaticKeyProvider: S.optional(StaticKeyProvider)
      .pipe(T.JsonName("staticKeyProvider"))
      .annotations({ identifier: "StaticKeyProvider" }),
    Type: S.optional(S.String).pipe(T.JsonName("type")),
  }),
).annotations({
  identifier: "HlsEncryptionSettings",
}) as any as S.Schema<HlsEncryptionSettings>;
export interface HlsImageBasedTrickPlaySettings {
  IntervalCadence?: string;
  ThumbnailHeight?: number;
  ThumbnailInterval?: number;
  ThumbnailWidth?: number;
  TileHeight?: number;
  TileWidth?: number;
}
export const HlsImageBasedTrickPlaySettings = S.suspend(() =>
  S.Struct({
    IntervalCadence: S.optional(S.String).pipe(T.JsonName("intervalCadence")),
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
export interface HlsGroupSettings {
  AdMarkers?: __listOfHlsAdMarkers;
  AdditionalManifests?: __listOfHlsAdditionalManifest;
  AudioOnlyHeader?: string;
  BaseUrl?: string;
  CaptionLanguageMappings?: __listOfHlsCaptionLanguageMapping;
  CaptionLanguageSetting?: string;
  CaptionSegmentLengthControl?: string;
  ClientCache?: string;
  CodecSpecification?: string;
  Destination?: string;
  DestinationSettings?: DestinationSettings;
  DirectoryStructure?: string;
  Encryption?: HlsEncryptionSettings;
  ImageBasedTrickPlay?: string;
  ImageBasedTrickPlaySettings?: HlsImageBasedTrickPlaySettings;
  ManifestCompression?: string;
  ManifestDurationFormat?: string;
  MinFinalSegmentLength?: number;
  MinSegmentLength?: number;
  OutputSelection?: string;
  ProgramDateTime?: string;
  ProgramDateTimePeriod?: number;
  ProgressiveWriteHlsManifest?: string;
  SegmentControl?: string;
  SegmentLength?: number;
  SegmentLengthControl?: string;
  SegmentsPerSubdirectory?: number;
  StreamInfResolution?: string;
  TargetDurationCompatibilityMode?: string;
  TimedMetadataId3Frame?: string;
  TimedMetadataId3Period?: number;
  TimestampDeltaMilliseconds?: number;
}
export const HlsGroupSettings = S.suspend(() =>
  S.Struct({
    AdMarkers: S.optional(__listOfHlsAdMarkers).pipe(T.JsonName("adMarkers")),
    AdditionalManifests: S.optional(__listOfHlsAdditionalManifest).pipe(
      T.JsonName("additionalManifests"),
    ),
    AudioOnlyHeader: S.optional(S.String).pipe(T.JsonName("audioOnlyHeader")),
    BaseUrl: S.optional(S.String).pipe(T.JsonName("baseUrl")),
    CaptionLanguageMappings: S.optional(__listOfHlsCaptionLanguageMapping).pipe(
      T.JsonName("captionLanguageMappings"),
    ),
    CaptionLanguageSetting: S.optional(S.String).pipe(
      T.JsonName("captionLanguageSetting"),
    ),
    CaptionSegmentLengthControl: S.optional(S.String).pipe(
      T.JsonName("captionSegmentLengthControl"),
    ),
    ClientCache: S.optional(S.String).pipe(T.JsonName("clientCache")),
    CodecSpecification: S.optional(S.String).pipe(
      T.JsonName("codecSpecification"),
    ),
    Destination: S.optional(S.String).pipe(T.JsonName("destination")),
    DestinationSettings: S.optional(DestinationSettings)
      .pipe(T.JsonName("destinationSettings"))
      .annotations({ identifier: "DestinationSettings" }),
    DirectoryStructure: S.optional(S.String).pipe(
      T.JsonName("directoryStructure"),
    ),
    Encryption: S.optional(HlsEncryptionSettings)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "HlsEncryptionSettings" }),
    ImageBasedTrickPlay: S.optional(S.String).pipe(
      T.JsonName("imageBasedTrickPlay"),
    ),
    ImageBasedTrickPlaySettings: S.optional(HlsImageBasedTrickPlaySettings)
      .pipe(T.JsonName("imageBasedTrickPlaySettings"))
      .annotations({ identifier: "HlsImageBasedTrickPlaySettings" }),
    ManifestCompression: S.optional(S.String).pipe(
      T.JsonName("manifestCompression"),
    ),
    ManifestDurationFormat: S.optional(S.String).pipe(
      T.JsonName("manifestDurationFormat"),
    ),
    MinFinalSegmentLength: S.optional(S.Number).pipe(
      T.JsonName("minFinalSegmentLength"),
    ),
    MinSegmentLength: S.optional(S.Number).pipe(T.JsonName("minSegmentLength")),
    OutputSelection: S.optional(S.String).pipe(T.JsonName("outputSelection")),
    ProgramDateTime: S.optional(S.String).pipe(T.JsonName("programDateTime")),
    ProgramDateTimePeriod: S.optional(S.Number).pipe(
      T.JsonName("programDateTimePeriod"),
    ),
    ProgressiveWriteHlsManifest: S.optional(S.String).pipe(
      T.JsonName("progressiveWriteHlsManifest"),
    ),
    SegmentControl: S.optional(S.String).pipe(T.JsonName("segmentControl")),
    SegmentLength: S.optional(S.Number).pipe(T.JsonName("segmentLength")),
    SegmentLengthControl: S.optional(S.String).pipe(
      T.JsonName("segmentLengthControl"),
    ),
    SegmentsPerSubdirectory: S.optional(S.Number).pipe(
      T.JsonName("segmentsPerSubdirectory"),
    ),
    StreamInfResolution: S.optional(S.String).pipe(
      T.JsonName("streamInfResolution"),
    ),
    TargetDurationCompatibilityMode: S.optional(S.String).pipe(
      T.JsonName("targetDurationCompatibilityMode"),
    ),
    TimedMetadataId3Frame: S.optional(S.String).pipe(
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
  SelectedOutputs?: __listOf__stringMin1;
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
export interface MsSmoothGroupSettings {
  AdditionalManifests?: __listOfMsSmoothAdditionalManifest;
  AudioDeduplication?: string;
  Destination?: string;
  DestinationSettings?: DestinationSettings;
  Encryption?: MsSmoothEncryptionSettings;
  FragmentLength?: number;
  FragmentLengthControl?: string;
  ManifestEncoding?: string;
}
export const MsSmoothGroupSettings = S.suspend(() =>
  S.Struct({
    AdditionalManifests: S.optional(__listOfMsSmoothAdditionalManifest).pipe(
      T.JsonName("additionalManifests"),
    ),
    AudioDeduplication: S.optional(S.String).pipe(
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
    FragmentLengthControl: S.optional(S.String).pipe(
      T.JsonName("fragmentLengthControl"),
    ),
    ManifestEncoding: S.optional(S.String).pipe(T.JsonName("manifestEncoding")),
  }),
).annotations({
  identifier: "MsSmoothGroupSettings",
}) as any as S.Schema<MsSmoothGroupSettings>;
export type __listOfFrameMetricType = string[];
export const __listOfFrameMetricType = S.Array(S.String);
export interface OutputGroupSettings {
  CmafGroupSettings?: CmafGroupSettings;
  DashIsoGroupSettings?: DashIsoGroupSettings;
  FileGroupSettings?: FileGroupSettings;
  HlsGroupSettings?: HlsGroupSettings;
  MsSmoothGroupSettings?: MsSmoothGroupSettings;
  PerFrameMetrics?: __listOfFrameMetricType;
  Type?: string;
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
    Type: S.optional(S.String).pipe(T.JsonName("type")),
  }),
).annotations({
  identifier: "OutputGroupSettings",
}) as any as S.Schema<OutputGroupSettings>;
export type __listOfAudioChannelTag = string[];
export const __listOfAudioChannelTag = S.Array(S.String);
export interface AudioChannelTaggingSettings {
  ChannelTag?: string;
  ChannelTags?: __listOfAudioChannelTag;
}
export const AudioChannelTaggingSettings = S.suspend(() =>
  S.Struct({
    ChannelTag: S.optional(S.String).pipe(T.JsonName("channelTag")),
    ChannelTags: S.optional(__listOfAudioChannelTag).pipe(
      T.JsonName("channelTags"),
    ),
  }),
).annotations({
  identifier: "AudioChannelTaggingSettings",
}) as any as S.Schema<AudioChannelTaggingSettings>;
export interface AudioNormalizationSettings {
  Algorithm?: string;
  AlgorithmControl?: string;
  CorrectionGateLevel?: number;
  LoudnessLogging?: string;
  PeakCalculation?: string;
  TargetLkfs?: number;
  TruePeakLimiterThreshold?: number;
}
export const AudioNormalizationSettings = S.suspend(() =>
  S.Struct({
    Algorithm: S.optional(S.String).pipe(T.JsonName("algorithm")),
    AlgorithmControl: S.optional(S.String).pipe(T.JsonName("algorithmControl")),
    CorrectionGateLevel: S.optional(S.Number).pipe(
      T.JsonName("correctionGateLevel"),
    ),
    LoudnessLogging: S.optional(S.String).pipe(T.JsonName("loudnessLogging")),
    PeakCalculation: S.optional(S.String).pipe(T.JsonName("peakCalculation")),
    TargetLkfs: S.optional(S.Number).pipe(T.JsonName("targetLkfs")),
    TruePeakLimiterThreshold: S.optional(S.Number).pipe(
      T.JsonName("truePeakLimiterThreshold"),
    ),
  }),
).annotations({
  identifier: "AudioNormalizationSettings",
}) as any as S.Schema<AudioNormalizationSettings>;
export interface AudioPitchCorrectionSettings {
  SlowPalPitchCorrection?: string;
}
export const AudioPitchCorrectionSettings = S.suspend(() =>
  S.Struct({
    SlowPalPitchCorrection: S.optional(S.String).pipe(
      T.JsonName("slowPalPitchCorrection"),
    ),
  }),
).annotations({
  identifier: "AudioPitchCorrectionSettings",
}) as any as S.Schema<AudioPitchCorrectionSettings>;
export interface AacSettings {
  AudioDescriptionBroadcasterMix?: string;
  Bitrate?: number;
  CodecProfile?: string;
  CodingMode?: string;
  LoudnessMeasurementMode?: string;
  RapInterval?: number;
  RateControlMode?: string;
  RawFormat?: string;
  SampleRate?: number;
  Specification?: string;
  TargetLoudnessRange?: number;
  VbrQuality?: string;
}
export const AacSettings = S.suspend(() =>
  S.Struct({
    AudioDescriptionBroadcasterMix: S.optional(S.String).pipe(
      T.JsonName("audioDescriptionBroadcasterMix"),
    ),
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    CodecProfile: S.optional(S.String).pipe(T.JsonName("codecProfile")),
    CodingMode: S.optional(S.String).pipe(T.JsonName("codingMode")),
    LoudnessMeasurementMode: S.optional(S.String).pipe(
      T.JsonName("loudnessMeasurementMode"),
    ),
    RapInterval: S.optional(S.Number).pipe(T.JsonName("rapInterval")),
    RateControlMode: S.optional(S.String).pipe(T.JsonName("rateControlMode")),
    RawFormat: S.optional(S.String).pipe(T.JsonName("rawFormat")),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
    Specification: S.optional(S.String).pipe(T.JsonName("specification")),
    TargetLoudnessRange: S.optional(S.Number).pipe(
      T.JsonName("targetLoudnessRange"),
    ),
    VbrQuality: S.optional(S.String).pipe(T.JsonName("vbrQuality")),
  }),
).annotations({ identifier: "AacSettings" }) as any as S.Schema<AacSettings>;
export interface Ac3Settings {
  Bitrate?: number;
  BitstreamMode?: string;
  CodingMode?: string;
  Dialnorm?: number;
  DynamicRangeCompressionLine?: string;
  DynamicRangeCompressionProfile?: string;
  DynamicRangeCompressionRf?: string;
  LfeFilter?: string;
  MetadataControl?: string;
  SampleRate?: number;
}
export const Ac3Settings = S.suspend(() =>
  S.Struct({
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    BitstreamMode: S.optional(S.String).pipe(T.JsonName("bitstreamMode")),
    CodingMode: S.optional(S.String).pipe(T.JsonName("codingMode")),
    Dialnorm: S.optional(S.Number).pipe(T.JsonName("dialnorm")),
    DynamicRangeCompressionLine: S.optional(S.String).pipe(
      T.JsonName("dynamicRangeCompressionLine"),
    ),
    DynamicRangeCompressionProfile: S.optional(S.String).pipe(
      T.JsonName("dynamicRangeCompressionProfile"),
    ),
    DynamicRangeCompressionRf: S.optional(S.String).pipe(
      T.JsonName("dynamicRangeCompressionRf"),
    ),
    LfeFilter: S.optional(S.String).pipe(T.JsonName("lfeFilter")),
    MetadataControl: S.optional(S.String).pipe(T.JsonName("metadataControl")),
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
export interface Eac3AtmosSettings {
  Bitrate?: number;
  BitstreamMode?: string;
  CodingMode?: string;
  DialogueIntelligence?: string;
  DownmixControl?: string;
  DynamicRangeCompressionLine?: string;
  DynamicRangeCompressionRf?: string;
  DynamicRangeControl?: string;
  LoRoCenterMixLevel?: number;
  LoRoSurroundMixLevel?: number;
  LtRtCenterMixLevel?: number;
  LtRtSurroundMixLevel?: number;
  MeteringMode?: string;
  SampleRate?: number;
  SpeechThreshold?: number;
  StereoDownmix?: string;
  SurroundExMode?: string;
}
export const Eac3AtmosSettings = S.suspend(() =>
  S.Struct({
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    BitstreamMode: S.optional(S.String).pipe(T.JsonName("bitstreamMode")),
    CodingMode: S.optional(S.String).pipe(T.JsonName("codingMode")),
    DialogueIntelligence: S.optional(S.String).pipe(
      T.JsonName("dialogueIntelligence"),
    ),
    DownmixControl: S.optional(S.String).pipe(T.JsonName("downmixControl")),
    DynamicRangeCompressionLine: S.optional(S.String).pipe(
      T.JsonName("dynamicRangeCompressionLine"),
    ),
    DynamicRangeCompressionRf: S.optional(S.String).pipe(
      T.JsonName("dynamicRangeCompressionRf"),
    ),
    DynamicRangeControl: S.optional(S.String).pipe(
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
    MeteringMode: S.optional(S.String).pipe(T.JsonName("meteringMode")),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
    SpeechThreshold: S.optional(S.Number).pipe(T.JsonName("speechThreshold")),
    StereoDownmix: S.optional(S.String).pipe(T.JsonName("stereoDownmix")),
    SurroundExMode: S.optional(S.String).pipe(T.JsonName("surroundExMode")),
  }),
).annotations({
  identifier: "Eac3AtmosSettings",
}) as any as S.Schema<Eac3AtmosSettings>;
export interface Eac3Settings {
  AttenuationControl?: string;
  Bitrate?: number;
  BitstreamMode?: string;
  CodingMode?: string;
  DcFilter?: string;
  Dialnorm?: number;
  DynamicRangeCompressionLine?: string;
  DynamicRangeCompressionRf?: string;
  LfeControl?: string;
  LfeFilter?: string;
  LoRoCenterMixLevel?: number;
  LoRoSurroundMixLevel?: number;
  LtRtCenterMixLevel?: number;
  LtRtSurroundMixLevel?: number;
  MetadataControl?: string;
  PassthroughControl?: string;
  PhaseControl?: string;
  SampleRate?: number;
  StereoDownmix?: string;
  SurroundExMode?: string;
  SurroundMode?: string;
}
export const Eac3Settings = S.suspend(() =>
  S.Struct({
    AttenuationControl: S.optional(S.String).pipe(
      T.JsonName("attenuationControl"),
    ),
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    BitstreamMode: S.optional(S.String).pipe(T.JsonName("bitstreamMode")),
    CodingMode: S.optional(S.String).pipe(T.JsonName("codingMode")),
    DcFilter: S.optional(S.String).pipe(T.JsonName("dcFilter")),
    Dialnorm: S.optional(S.Number).pipe(T.JsonName("dialnorm")),
    DynamicRangeCompressionLine: S.optional(S.String).pipe(
      T.JsonName("dynamicRangeCompressionLine"),
    ),
    DynamicRangeCompressionRf: S.optional(S.String).pipe(
      T.JsonName("dynamicRangeCompressionRf"),
    ),
    LfeControl: S.optional(S.String).pipe(T.JsonName("lfeControl")),
    LfeFilter: S.optional(S.String).pipe(T.JsonName("lfeFilter")),
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
    MetadataControl: S.optional(S.String).pipe(T.JsonName("metadataControl")),
    PassthroughControl: S.optional(S.String).pipe(
      T.JsonName("passthroughControl"),
    ),
    PhaseControl: S.optional(S.String).pipe(T.JsonName("phaseControl")),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
    StereoDownmix: S.optional(S.String).pipe(T.JsonName("stereoDownmix")),
    SurroundExMode: S.optional(S.String).pipe(T.JsonName("surroundExMode")),
    SurroundMode: S.optional(S.String).pipe(T.JsonName("surroundMode")),
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
export interface Mp2Settings {
  AudioDescriptionMix?: string;
  Bitrate?: number;
  Channels?: number;
  SampleRate?: number;
}
export const Mp2Settings = S.suspend(() =>
  S.Struct({
    AudioDescriptionMix: S.optional(S.String).pipe(
      T.JsonName("audioDescriptionMix"),
    ),
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
  }),
).annotations({ identifier: "Mp2Settings" }) as any as S.Schema<Mp2Settings>;
export interface Mp3Settings {
  Bitrate?: number;
  Channels?: number;
  RateControlMode?: string;
  SampleRate?: number;
  VbrQuality?: number;
}
export const Mp3Settings = S.suspend(() =>
  S.Struct({
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
    RateControlMode: S.optional(S.String).pipe(T.JsonName("rateControlMode")),
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
export interface WavSettings {
  BitDepth?: number;
  Channels?: number;
  Format?: string;
  SampleRate?: number;
}
export const WavSettings = S.suspend(() =>
  S.Struct({
    BitDepth: S.optional(S.Number).pipe(T.JsonName("bitDepth")),
    Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
    Format: S.optional(S.String).pipe(T.JsonName("format")),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
  }),
).annotations({ identifier: "WavSettings" }) as any as S.Schema<WavSettings>;
export interface AudioCodecSettings {
  AacSettings?: AacSettings;
  Ac3Settings?: Ac3Settings;
  AiffSettings?: AiffSettings;
  Codec?: string;
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
    Codec: S.optional(S.String).pipe(T.JsonName("codec")),
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
export interface AudioDescription {
  AudioChannelTaggingSettings?: AudioChannelTaggingSettings;
  AudioNormalizationSettings?: AudioNormalizationSettings;
  AudioPitchCorrectionSettings?: AudioPitchCorrectionSettings;
  AudioSourceName?: string;
  AudioType?: number;
  AudioTypeControl?: string;
  CodecSettings?: AudioCodecSettings;
  CustomLanguageCode?: string;
  LanguageCode?: string;
  LanguageCodeControl?: string;
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
    AudioTypeControl: S.optional(S.String).pipe(T.JsonName("audioTypeControl")),
    CodecSettings: S.optional(AudioCodecSettings)
      .pipe(T.JsonName("codecSettings"))
      .annotations({ identifier: "AudioCodecSettings" }),
    CustomLanguageCode: S.optional(S.String).pipe(
      T.JsonName("customLanguageCode"),
    ),
    LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
    LanguageCodeControl: S.optional(S.String).pipe(
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
export interface BurninDestinationSettings {
  Alignment?: string;
  ApplyFontColor?: string;
  BackgroundColor?: string;
  BackgroundOpacity?: number;
  FallbackFont?: string;
  FontColor?: string;
  FontFileBold?: string;
  FontFileBoldItalic?: string;
  FontFileItalic?: string;
  FontFileRegular?: string;
  FontOpacity?: number;
  FontResolution?: number;
  FontScript?: string;
  FontSize?: number;
  HexFontColor?: string;
  OutlineColor?: string;
  OutlineSize?: number;
  RemoveRubyReserveAttributes?: string;
  ShadowColor?: string;
  ShadowOpacity?: number;
  ShadowXOffset?: number;
  ShadowYOffset?: number;
  StylePassthrough?: string;
  TeletextSpacing?: string;
  XPosition?: number;
  YPosition?: number;
}
export const BurninDestinationSettings = S.suspend(() =>
  S.Struct({
    Alignment: S.optional(S.String).pipe(T.JsonName("alignment")),
    ApplyFontColor: S.optional(S.String).pipe(T.JsonName("applyFontColor")),
    BackgroundColor: S.optional(S.String).pipe(T.JsonName("backgroundColor")),
    BackgroundOpacity: S.optional(S.Number).pipe(
      T.JsonName("backgroundOpacity"),
    ),
    FallbackFont: S.optional(S.String).pipe(T.JsonName("fallbackFont")),
    FontColor: S.optional(S.String).pipe(T.JsonName("fontColor")),
    FontFileBold: S.optional(S.String).pipe(T.JsonName("fontFileBold")),
    FontFileBoldItalic: S.optional(S.String).pipe(
      T.JsonName("fontFileBoldItalic"),
    ),
    FontFileItalic: S.optional(S.String).pipe(T.JsonName("fontFileItalic")),
    FontFileRegular: S.optional(S.String).pipe(T.JsonName("fontFileRegular")),
    FontOpacity: S.optional(S.Number).pipe(T.JsonName("fontOpacity")),
    FontResolution: S.optional(S.Number).pipe(T.JsonName("fontResolution")),
    FontScript: S.optional(S.String).pipe(T.JsonName("fontScript")),
    FontSize: S.optional(S.Number).pipe(T.JsonName("fontSize")),
    HexFontColor: S.optional(S.String).pipe(T.JsonName("hexFontColor")),
    OutlineColor: S.optional(S.String).pipe(T.JsonName("outlineColor")),
    OutlineSize: S.optional(S.Number).pipe(T.JsonName("outlineSize")),
    RemoveRubyReserveAttributes: S.optional(S.String).pipe(
      T.JsonName("removeRubyReserveAttributes"),
    ),
    ShadowColor: S.optional(S.String).pipe(T.JsonName("shadowColor")),
    ShadowOpacity: S.optional(S.Number).pipe(T.JsonName("shadowOpacity")),
    ShadowXOffset: S.optional(S.Number).pipe(T.JsonName("shadowXOffset")),
    ShadowYOffset: S.optional(S.Number).pipe(T.JsonName("shadowYOffset")),
    StylePassthrough: S.optional(S.String).pipe(T.JsonName("stylePassthrough")),
    TeletextSpacing: S.optional(S.String).pipe(T.JsonName("teletextSpacing")),
    XPosition: S.optional(S.Number).pipe(T.JsonName("xPosition")),
    YPosition: S.optional(S.Number).pipe(T.JsonName("yPosition")),
  }),
).annotations({
  identifier: "BurninDestinationSettings",
}) as any as S.Schema<BurninDestinationSettings>;
export interface DvbSubDestinationSettings {
  Alignment?: string;
  ApplyFontColor?: string;
  BackgroundColor?: string;
  BackgroundOpacity?: number;
  DdsHandling?: string;
  DdsXCoordinate?: number;
  DdsYCoordinate?: number;
  FallbackFont?: string;
  FontColor?: string;
  FontFileBold?: string;
  FontFileBoldItalic?: string;
  FontFileItalic?: string;
  FontFileRegular?: string;
  FontOpacity?: number;
  FontResolution?: number;
  FontScript?: string;
  FontSize?: number;
  Height?: number;
  HexFontColor?: string;
  OutlineColor?: string;
  OutlineSize?: number;
  ShadowColor?: string;
  ShadowOpacity?: number;
  ShadowXOffset?: number;
  ShadowYOffset?: number;
  StylePassthrough?: string;
  SubtitlingType?: string;
  TeletextSpacing?: string;
  Width?: number;
  XPosition?: number;
  YPosition?: number;
}
export const DvbSubDestinationSettings = S.suspend(() =>
  S.Struct({
    Alignment: S.optional(S.String).pipe(T.JsonName("alignment")),
    ApplyFontColor: S.optional(S.String).pipe(T.JsonName("applyFontColor")),
    BackgroundColor: S.optional(S.String).pipe(T.JsonName("backgroundColor")),
    BackgroundOpacity: S.optional(S.Number).pipe(
      T.JsonName("backgroundOpacity"),
    ),
    DdsHandling: S.optional(S.String).pipe(T.JsonName("ddsHandling")),
    DdsXCoordinate: S.optional(S.Number).pipe(T.JsonName("ddsXCoordinate")),
    DdsYCoordinate: S.optional(S.Number).pipe(T.JsonName("ddsYCoordinate")),
    FallbackFont: S.optional(S.String).pipe(T.JsonName("fallbackFont")),
    FontColor: S.optional(S.String).pipe(T.JsonName("fontColor")),
    FontFileBold: S.optional(S.String).pipe(T.JsonName("fontFileBold")),
    FontFileBoldItalic: S.optional(S.String).pipe(
      T.JsonName("fontFileBoldItalic"),
    ),
    FontFileItalic: S.optional(S.String).pipe(T.JsonName("fontFileItalic")),
    FontFileRegular: S.optional(S.String).pipe(T.JsonName("fontFileRegular")),
    FontOpacity: S.optional(S.Number).pipe(T.JsonName("fontOpacity")),
    FontResolution: S.optional(S.Number).pipe(T.JsonName("fontResolution")),
    FontScript: S.optional(S.String).pipe(T.JsonName("fontScript")),
    FontSize: S.optional(S.Number).pipe(T.JsonName("fontSize")),
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    HexFontColor: S.optional(S.String).pipe(T.JsonName("hexFontColor")),
    OutlineColor: S.optional(S.String).pipe(T.JsonName("outlineColor")),
    OutlineSize: S.optional(S.Number).pipe(T.JsonName("outlineSize")),
    ShadowColor: S.optional(S.String).pipe(T.JsonName("shadowColor")),
    ShadowOpacity: S.optional(S.Number).pipe(T.JsonName("shadowOpacity")),
    ShadowXOffset: S.optional(S.Number).pipe(T.JsonName("shadowXOffset")),
    ShadowYOffset: S.optional(S.Number).pipe(T.JsonName("shadowYOffset")),
    StylePassthrough: S.optional(S.String).pipe(T.JsonName("stylePassthrough")),
    SubtitlingType: S.optional(S.String).pipe(T.JsonName("subtitlingType")),
    TeletextSpacing: S.optional(S.String).pipe(T.JsonName("teletextSpacing")),
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
export interface ImscDestinationSettings {
  Accessibility?: string;
  StylePassthrough?: string;
}
export const ImscDestinationSettings = S.suspend(() =>
  S.Struct({
    Accessibility: S.optional(S.String).pipe(T.JsonName("accessibility")),
    StylePassthrough: S.optional(S.String).pipe(T.JsonName("stylePassthrough")),
  }),
).annotations({
  identifier: "ImscDestinationSettings",
}) as any as S.Schema<ImscDestinationSettings>;
export interface SccDestinationSettings {
  Framerate?: string;
}
export const SccDestinationSettings = S.suspend(() =>
  S.Struct({ Framerate: S.optional(S.String).pipe(T.JsonName("framerate")) }),
).annotations({
  identifier: "SccDestinationSettings",
}) as any as S.Schema<SccDestinationSettings>;
export interface SrtDestinationSettings {
  StylePassthrough?: string;
}
export const SrtDestinationSettings = S.suspend(() =>
  S.Struct({
    StylePassthrough: S.optional(S.String).pipe(T.JsonName("stylePassthrough")),
  }),
).annotations({
  identifier: "SrtDestinationSettings",
}) as any as S.Schema<SrtDestinationSettings>;
export type __listOfTeletextPageType = string[];
export const __listOfTeletextPageType = S.Array(S.String);
export interface TeletextDestinationSettings {
  PageNumber?: string;
  PageTypes?: __listOfTeletextPageType;
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
export interface TtmlDestinationSettings {
  StylePassthrough?: string;
}
export const TtmlDestinationSettings = S.suspend(() =>
  S.Struct({
    StylePassthrough: S.optional(S.String).pipe(T.JsonName("stylePassthrough")),
  }),
).annotations({
  identifier: "TtmlDestinationSettings",
}) as any as S.Schema<TtmlDestinationSettings>;
export interface WebvttDestinationSettings {
  Accessibility?: string;
  StylePassthrough?: string;
}
export const WebvttDestinationSettings = S.suspend(() =>
  S.Struct({
    Accessibility: S.optional(S.String).pipe(T.JsonName("accessibility")),
    StylePassthrough: S.optional(S.String).pipe(T.JsonName("stylePassthrough")),
  }),
).annotations({
  identifier: "WebvttDestinationSettings",
}) as any as S.Schema<WebvttDestinationSettings>;
export interface CaptionDestinationSettings {
  BurninDestinationSettings?: BurninDestinationSettings;
  DestinationType?: string;
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
    DestinationType: S.optional(S.String).pipe(T.JsonName("destinationType")),
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
  LanguageCode?: string;
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
    LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
    LanguageDescription: S.optional(S.String).pipe(
      T.JsonName("languageDescription"),
    ),
  }),
).annotations({
  identifier: "CaptionDescription",
}) as any as S.Schema<CaptionDescription>;
export type __listOfCaptionDescription = CaptionDescription[];
export const __listOfCaptionDescription = S.Array(CaptionDescription);
export interface CmfcSettings {
  AudioDuration?: string;
  AudioGroupId?: string;
  AudioRenditionSets?: string;
  AudioTrackType?: string;
  C2paManifest?: string;
  CertificateSecret?: string;
  DescriptiveVideoServiceFlag?: string;
  IFrameOnlyManifest?: string;
  KlvMetadata?: string;
  ManifestMetadataSignaling?: string;
  Scte35Esam?: string;
  Scte35Source?: string;
  SigningKmsKey?: string;
  TimedMetadata?: string;
  TimedMetadataBoxVersion?: string;
  TimedMetadataSchemeIdUri?: string;
  TimedMetadataValue?: string;
}
export const CmfcSettings = S.suspend(() =>
  S.Struct({
    AudioDuration: S.optional(S.String).pipe(T.JsonName("audioDuration")),
    AudioGroupId: S.optional(S.String).pipe(T.JsonName("audioGroupId")),
    AudioRenditionSets: S.optional(S.String).pipe(
      T.JsonName("audioRenditionSets"),
    ),
    AudioTrackType: S.optional(S.String).pipe(T.JsonName("audioTrackType")),
    C2paManifest: S.optional(S.String).pipe(T.JsonName("c2paManifest")),
    CertificateSecret: S.optional(S.String).pipe(
      T.JsonName("certificateSecret"),
    ),
    DescriptiveVideoServiceFlag: S.optional(S.String).pipe(
      T.JsonName("descriptiveVideoServiceFlag"),
    ),
    IFrameOnlyManifest: S.optional(S.String).pipe(
      T.JsonName("iFrameOnlyManifest"),
    ),
    KlvMetadata: S.optional(S.String).pipe(T.JsonName("klvMetadata")),
    ManifestMetadataSignaling: S.optional(S.String).pipe(
      T.JsonName("manifestMetadataSignaling"),
    ),
    Scte35Esam: S.optional(S.String).pipe(T.JsonName("scte35Esam")),
    Scte35Source: S.optional(S.String).pipe(T.JsonName("scte35Source")),
    SigningKmsKey: S.optional(S.String).pipe(T.JsonName("signingKmsKey")),
    TimedMetadata: S.optional(S.String).pipe(T.JsonName("timedMetadata")),
    TimedMetadataBoxVersion: S.optional(S.String).pipe(
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
export interface F4vSettings {
  MoovPlacement?: string;
}
export const F4vSettings = S.suspend(() =>
  S.Struct({
    MoovPlacement: S.optional(S.String).pipe(T.JsonName("moovPlacement")),
  }),
).annotations({ identifier: "F4vSettings" }) as any as S.Schema<F4vSettings>;
export type __listOf__integerMin32Max8182 = number[];
export const __listOf__integerMin32Max8182 = S.Array(S.Number);
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
export interface DvbSdtSettings {
  OutputSdt?: string;
  SdtInterval?: number;
  ServiceName?: string;
  ServiceProviderName?: string;
}
export const DvbSdtSettings = S.suspend(() =>
  S.Struct({
    OutputSdt: S.optional(S.String).pipe(T.JsonName("outputSdt")),
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
export interface M2tsSettings {
  AudioBufferModel?: string;
  AudioDuration?: string;
  AudioFramesPerPes?: number;
  AudioPids?: __listOf__integerMin32Max8182;
  AudioPtsOffsetDelta?: number;
  Bitrate?: number;
  BufferModel?: string;
  DataPTSControl?: string;
  DvbNitSettings?: DvbNitSettings;
  DvbSdtSettings?: DvbSdtSettings;
  DvbSubPids?: __listOf__integerMin32Max8182;
  DvbTdtSettings?: DvbTdtSettings;
  DvbTeletextPid?: number;
  EbpAudioInterval?: string;
  EbpPlacement?: string;
  EsRateInPes?: string;
  ForceTsVideoEbpOrder?: string;
  FragmentTime?: number;
  KlvMetadata?: string;
  MaxPcrInterval?: number;
  MinEbpInterval?: number;
  NielsenId3?: string;
  NullPacketBitrate?: number;
  PatInterval?: number;
  PcrControl?: string;
  PcrPid?: number;
  PmtInterval?: number;
  PmtPid?: number;
  PreventBufferUnderflow?: string;
  PrivateMetadataPid?: number;
  ProgramNumber?: number;
  PtsOffset?: number;
  PtsOffsetMode?: string;
  RateMode?: string;
  Scte35Esam?: M2tsScte35Esam;
  Scte35Pid?: number;
  Scte35Source?: string;
  SegmentationMarkers?: string;
  SegmentationStyle?: string;
  SegmentationTime?: number;
  TimedMetadataPid?: number;
  TransportStreamId?: number;
  VideoPid?: number;
}
export const M2tsSettings = S.suspend(() =>
  S.Struct({
    AudioBufferModel: S.optional(S.String).pipe(T.JsonName("audioBufferModel")),
    AudioDuration: S.optional(S.String).pipe(T.JsonName("audioDuration")),
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
    BufferModel: S.optional(S.String).pipe(T.JsonName("bufferModel")),
    DataPTSControl: S.optional(S.String).pipe(T.JsonName("dataPTSControl")),
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
    EbpAudioInterval: S.optional(S.String).pipe(T.JsonName("ebpAudioInterval")),
    EbpPlacement: S.optional(S.String).pipe(T.JsonName("ebpPlacement")),
    EsRateInPes: S.optional(S.String).pipe(T.JsonName("esRateInPes")),
    ForceTsVideoEbpOrder: S.optional(S.String).pipe(
      T.JsonName("forceTsVideoEbpOrder"),
    ),
    FragmentTime: S.optional(S.Number).pipe(T.JsonName("fragmentTime")),
    KlvMetadata: S.optional(S.String).pipe(T.JsonName("klvMetadata")),
    MaxPcrInterval: S.optional(S.Number).pipe(T.JsonName("maxPcrInterval")),
    MinEbpInterval: S.optional(S.Number).pipe(T.JsonName("minEbpInterval")),
    NielsenId3: S.optional(S.String).pipe(T.JsonName("nielsenId3")),
    NullPacketBitrate: S.optional(S.Number).pipe(
      T.JsonName("nullPacketBitrate"),
    ),
    PatInterval: S.optional(S.Number).pipe(T.JsonName("patInterval")),
    PcrControl: S.optional(S.String).pipe(T.JsonName("pcrControl")),
    PcrPid: S.optional(S.Number).pipe(T.JsonName("pcrPid")),
    PmtInterval: S.optional(S.Number).pipe(T.JsonName("pmtInterval")),
    PmtPid: S.optional(S.Number).pipe(T.JsonName("pmtPid")),
    PreventBufferUnderflow: S.optional(S.String).pipe(
      T.JsonName("preventBufferUnderflow"),
    ),
    PrivateMetadataPid: S.optional(S.Number).pipe(
      T.JsonName("privateMetadataPid"),
    ),
    ProgramNumber: S.optional(S.Number).pipe(T.JsonName("programNumber")),
    PtsOffset: S.optional(S.Number).pipe(T.JsonName("ptsOffset")),
    PtsOffsetMode: S.optional(S.String).pipe(T.JsonName("ptsOffsetMode")),
    RateMode: S.optional(S.String).pipe(T.JsonName("rateMode")),
    Scte35Esam: S.optional(M2tsScte35Esam)
      .pipe(T.JsonName("scte35Esam"))
      .annotations({ identifier: "M2tsScte35Esam" }),
    Scte35Pid: S.optional(S.Number).pipe(T.JsonName("scte35Pid")),
    Scte35Source: S.optional(S.String).pipe(T.JsonName("scte35Source")),
    SegmentationMarkers: S.optional(S.String).pipe(
      T.JsonName("segmentationMarkers"),
    ),
    SegmentationStyle: S.optional(S.String).pipe(
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
export interface M3u8Settings {
  AudioDuration?: string;
  AudioFramesPerPes?: number;
  AudioPids?: __listOf__integerMin32Max8182;
  AudioPtsOffsetDelta?: number;
  DataPTSControl?: string;
  MaxPcrInterval?: number;
  NielsenId3?: string;
  PatInterval?: number;
  PcrControl?: string;
  PcrPid?: number;
  PmtInterval?: number;
  PmtPid?: number;
  PrivateMetadataPid?: number;
  ProgramNumber?: number;
  PtsOffset?: number;
  PtsOffsetMode?: string;
  Scte35Pid?: number;
  Scte35Source?: string;
  TimedMetadata?: string;
  TimedMetadataPid?: number;
  TransportStreamId?: number;
  VideoPid?: number;
}
export const M3u8Settings = S.suspend(() =>
  S.Struct({
    AudioDuration: S.optional(S.String).pipe(T.JsonName("audioDuration")),
    AudioFramesPerPes: S.optional(S.Number).pipe(
      T.JsonName("audioFramesPerPes"),
    ),
    AudioPids: S.optional(__listOf__integerMin32Max8182).pipe(
      T.JsonName("audioPids"),
    ),
    AudioPtsOffsetDelta: S.optional(S.Number).pipe(
      T.JsonName("audioPtsOffsetDelta"),
    ),
    DataPTSControl: S.optional(S.String).pipe(T.JsonName("dataPTSControl")),
    MaxPcrInterval: S.optional(S.Number).pipe(T.JsonName("maxPcrInterval")),
    NielsenId3: S.optional(S.String).pipe(T.JsonName("nielsenId3")),
    PatInterval: S.optional(S.Number).pipe(T.JsonName("patInterval")),
    PcrControl: S.optional(S.String).pipe(T.JsonName("pcrControl")),
    PcrPid: S.optional(S.Number).pipe(T.JsonName("pcrPid")),
    PmtInterval: S.optional(S.Number).pipe(T.JsonName("pmtInterval")),
    PmtPid: S.optional(S.Number).pipe(T.JsonName("pmtPid")),
    PrivateMetadataPid: S.optional(S.Number).pipe(
      T.JsonName("privateMetadataPid"),
    ),
    ProgramNumber: S.optional(S.Number).pipe(T.JsonName("programNumber")),
    PtsOffset: S.optional(S.Number).pipe(T.JsonName("ptsOffset")),
    PtsOffsetMode: S.optional(S.String).pipe(T.JsonName("ptsOffsetMode")),
    Scte35Pid: S.optional(S.Number).pipe(T.JsonName("scte35Pid")),
    Scte35Source: S.optional(S.String).pipe(T.JsonName("scte35Source")),
    TimedMetadata: S.optional(S.String).pipe(T.JsonName("timedMetadata")),
    TimedMetadataPid: S.optional(S.Number).pipe(T.JsonName("timedMetadataPid")),
    TransportStreamId: S.optional(S.Number).pipe(
      T.JsonName("transportStreamId"),
    ),
    VideoPid: S.optional(S.Number).pipe(T.JsonName("videoPid")),
  }),
).annotations({ identifier: "M3u8Settings" }) as any as S.Schema<M3u8Settings>;
export interface MovSettings {
  ClapAtom?: string;
  CslgAtom?: string;
  Mpeg2FourCCControl?: string;
  PaddingControl?: string;
  Reference?: string;
}
export const MovSettings = S.suspend(() =>
  S.Struct({
    ClapAtom: S.optional(S.String).pipe(T.JsonName("clapAtom")),
    CslgAtom: S.optional(S.String).pipe(T.JsonName("cslgAtom")),
    Mpeg2FourCCControl: S.optional(S.String).pipe(
      T.JsonName("mpeg2FourCCControl"),
    ),
    PaddingControl: S.optional(S.String).pipe(T.JsonName("paddingControl")),
    Reference: S.optional(S.String).pipe(T.JsonName("reference")),
  }),
).annotations({ identifier: "MovSettings" }) as any as S.Schema<MovSettings>;
export interface Mp4Settings {
  AudioDuration?: string;
  C2paManifest?: string;
  CertificateSecret?: string;
  CslgAtom?: string;
  CttsVersion?: number;
  FreeSpaceBox?: string;
  MoovPlacement?: string;
  Mp4MajorBrand?: string;
  SigningKmsKey?: string;
}
export const Mp4Settings = S.suspend(() =>
  S.Struct({
    AudioDuration: S.optional(S.String).pipe(T.JsonName("audioDuration")),
    C2paManifest: S.optional(S.String).pipe(T.JsonName("c2paManifest")),
    CertificateSecret: S.optional(S.String).pipe(
      T.JsonName("certificateSecret"),
    ),
    CslgAtom: S.optional(S.String).pipe(T.JsonName("cslgAtom")),
    CttsVersion: S.optional(S.Number).pipe(T.JsonName("cttsVersion")),
    FreeSpaceBox: S.optional(S.String).pipe(T.JsonName("freeSpaceBox")),
    MoovPlacement: S.optional(S.String).pipe(T.JsonName("moovPlacement")),
    Mp4MajorBrand: S.optional(S.String).pipe(T.JsonName("mp4MajorBrand")),
    SigningKmsKey: S.optional(S.String).pipe(T.JsonName("signingKmsKey")),
  }),
).annotations({ identifier: "Mp4Settings" }) as any as S.Schema<Mp4Settings>;
export interface MpdSettings {
  AccessibilityCaptionHints?: string;
  AudioDuration?: string;
  C2paManifest?: string;
  CaptionContainerType?: string;
  CertificateSecret?: string;
  KlvMetadata?: string;
  ManifestMetadataSignaling?: string;
  Scte35Esam?: string;
  Scte35Source?: string;
  SigningKmsKey?: string;
  TimedMetadata?: string;
  TimedMetadataBoxVersion?: string;
  TimedMetadataSchemeIdUri?: string;
  TimedMetadataValue?: string;
}
export const MpdSettings = S.suspend(() =>
  S.Struct({
    AccessibilityCaptionHints: S.optional(S.String).pipe(
      T.JsonName("accessibilityCaptionHints"),
    ),
    AudioDuration: S.optional(S.String).pipe(T.JsonName("audioDuration")),
    C2paManifest: S.optional(S.String).pipe(T.JsonName("c2paManifest")),
    CaptionContainerType: S.optional(S.String).pipe(
      T.JsonName("captionContainerType"),
    ),
    CertificateSecret: S.optional(S.String).pipe(
      T.JsonName("certificateSecret"),
    ),
    KlvMetadata: S.optional(S.String).pipe(T.JsonName("klvMetadata")),
    ManifestMetadataSignaling: S.optional(S.String).pipe(
      T.JsonName("manifestMetadataSignaling"),
    ),
    Scte35Esam: S.optional(S.String).pipe(T.JsonName("scte35Esam")),
    Scte35Source: S.optional(S.String).pipe(T.JsonName("scte35Source")),
    SigningKmsKey: S.optional(S.String).pipe(T.JsonName("signingKmsKey")),
    TimedMetadata: S.optional(S.String).pipe(T.JsonName("timedMetadata")),
    TimedMetadataBoxVersion: S.optional(S.String).pipe(
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
export interface MxfXavcProfileSettings {
  DurationMode?: string;
  MaxAncDataSize?: number;
}
export const MxfXavcProfileSettings = S.suspend(() =>
  S.Struct({
    DurationMode: S.optional(S.String).pipe(T.JsonName("durationMode")),
    MaxAncDataSize: S.optional(S.Number).pipe(T.JsonName("maxAncDataSize")),
  }),
).annotations({
  identifier: "MxfXavcProfileSettings",
}) as any as S.Schema<MxfXavcProfileSettings>;
export interface MxfSettings {
  AfdSignaling?: string;
  Profile?: string;
  XavcProfileSettings?: MxfXavcProfileSettings;
}
export const MxfSettings = S.suspend(() =>
  S.Struct({
    AfdSignaling: S.optional(S.String).pipe(T.JsonName("afdSignaling")),
    Profile: S.optional(S.String).pipe(T.JsonName("profile")),
    XavcProfileSettings: S.optional(MxfXavcProfileSettings)
      .pipe(T.JsonName("xavcProfileSettings"))
      .annotations({ identifier: "MxfXavcProfileSettings" }),
  }),
).annotations({ identifier: "MxfSettings" }) as any as S.Schema<MxfSettings>;
export interface ContainerSettings {
  CmfcSettings?: CmfcSettings;
  Container?: string;
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
    Container: S.optional(S.String).pipe(T.JsonName("container")),
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
export interface HlsSettings {
  AudioGroupId?: string;
  AudioOnlyContainer?: string;
  AudioRenditionSets?: string;
  AudioTrackType?: string;
  DescriptiveVideoServiceFlag?: string;
  IFrameOnlyManifest?: string;
  SegmentModifier?: string;
}
export const HlsSettings = S.suspend(() =>
  S.Struct({
    AudioGroupId: S.optional(S.String).pipe(T.JsonName("audioGroupId")),
    AudioOnlyContainer: S.optional(S.String).pipe(
      T.JsonName("audioOnlyContainer"),
    ),
    AudioRenditionSets: S.optional(S.String).pipe(
      T.JsonName("audioRenditionSets"),
    ),
    AudioTrackType: S.optional(S.String).pipe(T.JsonName("audioTrackType")),
    DescriptiveVideoServiceFlag: S.optional(S.String).pipe(
      T.JsonName("descriptiveVideoServiceFlag"),
    ),
    IFrameOnlyManifest: S.optional(S.String).pipe(
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
export interface Av1Settings {
  AdaptiveQuantization?: string;
  BitDepth?: string;
  FilmGrainSynthesis?: string;
  FramerateControl?: string;
  FramerateConversionAlgorithm?: string;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  GopSize?: number;
  MaxBitrate?: number;
  NumberBFramesBetweenReferenceFrames?: number;
  PerFrameMetrics?: __listOfFrameMetricType;
  QvbrSettings?: Av1QvbrSettings;
  RateControlMode?: string;
  Slices?: number;
  SpatialAdaptiveQuantization?: string;
}
export const Av1Settings = S.suspend(() =>
  S.Struct({
    AdaptiveQuantization: S.optional(S.String).pipe(
      T.JsonName("adaptiveQuantization"),
    ),
    BitDepth: S.optional(S.String).pipe(T.JsonName("bitDepth")),
    FilmGrainSynthesis: S.optional(S.String).pipe(
      T.JsonName("filmGrainSynthesis"),
    ),
    FramerateControl: S.optional(S.String).pipe(T.JsonName("framerateControl")),
    FramerateConversionAlgorithm: S.optional(S.String).pipe(
      T.JsonName("framerateConversionAlgorithm"),
    ),
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
    RateControlMode: S.optional(S.String).pipe(T.JsonName("rateControlMode")),
    Slices: S.optional(S.Number).pipe(T.JsonName("slices")),
    SpatialAdaptiveQuantization: S.optional(S.String).pipe(
      T.JsonName("spatialAdaptiveQuantization"),
    ),
  }),
).annotations({ identifier: "Av1Settings" }) as any as S.Schema<Av1Settings>;
export interface AvcIntraUhdSettings {
  QualityTuningLevel?: string;
}
export const AvcIntraUhdSettings = S.suspend(() =>
  S.Struct({
    QualityTuningLevel: S.optional(S.String).pipe(
      T.JsonName("qualityTuningLevel"),
    ),
  }),
).annotations({
  identifier: "AvcIntraUhdSettings",
}) as any as S.Schema<AvcIntraUhdSettings>;
export interface AvcIntraSettings {
  AvcIntraClass?: string;
  AvcIntraUhdSettings?: AvcIntraUhdSettings;
  FramerateControl?: string;
  FramerateConversionAlgorithm?: string;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  InterlaceMode?: string;
  PerFrameMetrics?: __listOfFrameMetricType;
  ScanTypeConversionMode?: string;
  SlowPal?: string;
  Telecine?: string;
}
export const AvcIntraSettings = S.suspend(() =>
  S.Struct({
    AvcIntraClass: S.optional(S.String).pipe(T.JsonName("avcIntraClass")),
    AvcIntraUhdSettings: S.optional(AvcIntraUhdSettings)
      .pipe(T.JsonName("avcIntraUhdSettings"))
      .annotations({ identifier: "AvcIntraUhdSettings" }),
    FramerateControl: S.optional(S.String).pipe(T.JsonName("framerateControl")),
    FramerateConversionAlgorithm: S.optional(S.String).pipe(
      T.JsonName("framerateConversionAlgorithm"),
    ),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    InterlaceMode: S.optional(S.String).pipe(T.JsonName("interlaceMode")),
    PerFrameMetrics: S.optional(__listOfFrameMetricType).pipe(
      T.JsonName("perFrameMetrics"),
    ),
    ScanTypeConversionMode: S.optional(S.String).pipe(
      T.JsonName("scanTypeConversionMode"),
    ),
    SlowPal: S.optional(S.String).pipe(T.JsonName("slowPal")),
    Telecine: S.optional(S.String).pipe(T.JsonName("telecine")),
  }),
).annotations({
  identifier: "AvcIntraSettings",
}) as any as S.Schema<AvcIntraSettings>;
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
export interface GifSettings {
  FramerateControl?: string;
  FramerateConversionAlgorithm?: string;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
}
export const GifSettings = S.suspend(() =>
  S.Struct({
    FramerateControl: S.optional(S.String).pipe(T.JsonName("framerateControl")),
    FramerateConversionAlgorithm: S.optional(S.String).pipe(
      T.JsonName("framerateConversionAlgorithm"),
    ),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
  }),
).annotations({ identifier: "GifSettings" }) as any as S.Schema<GifSettings>;
export interface BandwidthReductionFilter {
  Sharpening?: string;
  Strength?: string;
}
export const BandwidthReductionFilter = S.suspend(() =>
  S.Struct({
    Sharpening: S.optional(S.String).pipe(T.JsonName("sharpening")),
    Strength: S.optional(S.String).pipe(T.JsonName("strength")),
  }),
).annotations({
  identifier: "BandwidthReductionFilter",
}) as any as S.Schema<BandwidthReductionFilter>;
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
export interface H264Settings {
  AdaptiveQuantization?: string;
  BandwidthReductionFilter?: BandwidthReductionFilter;
  Bitrate?: number;
  CodecLevel?: string;
  CodecProfile?: string;
  DynamicSubGop?: string;
  EndOfStreamMarkers?: string;
  EntropyEncoding?: string;
  FieldEncoding?: string;
  FlickerAdaptiveQuantization?: string;
  FramerateControl?: string;
  FramerateConversionAlgorithm?: string;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  GopBReference?: string;
  GopClosedCadence?: number;
  GopSize?: number;
  GopSizeUnits?: string;
  HrdBufferFinalFillPercentage?: number;
  HrdBufferInitialFillPercentage?: number;
  HrdBufferSize?: number;
  InterlaceMode?: string;
  MaxBitrate?: number;
  MinIInterval?: number;
  NumberBFramesBetweenReferenceFrames?: number;
  NumberReferenceFrames?: number;
  ParControl?: string;
  ParDenominator?: number;
  ParNumerator?: number;
  PerFrameMetrics?: __listOfFrameMetricType;
  QualityTuningLevel?: string;
  QvbrSettings?: H264QvbrSettings;
  RateControlMode?: string;
  RepeatPps?: string;
  SaliencyAwareEncoding?: string;
  ScanTypeConversionMode?: string;
  SceneChangeDetect?: string;
  Slices?: number;
  SlowPal?: string;
  Softness?: number;
  SpatialAdaptiveQuantization?: string;
  Syntax?: string;
  Telecine?: string;
  TemporalAdaptiveQuantization?: string;
  UnregisteredSeiTimecode?: string;
  WriteMp4PackagingType?: string;
}
export const H264Settings = S.suspend(() =>
  S.Struct({
    AdaptiveQuantization: S.optional(S.String).pipe(
      T.JsonName("adaptiveQuantization"),
    ),
    BandwidthReductionFilter: S.optional(BandwidthReductionFilter)
      .pipe(T.JsonName("bandwidthReductionFilter"))
      .annotations({ identifier: "BandwidthReductionFilter" }),
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    CodecLevel: S.optional(S.String).pipe(T.JsonName("codecLevel")),
    CodecProfile: S.optional(S.String).pipe(T.JsonName("codecProfile")),
    DynamicSubGop: S.optional(S.String).pipe(T.JsonName("dynamicSubGop")),
    EndOfStreamMarkers: S.optional(S.String).pipe(
      T.JsonName("endOfStreamMarkers"),
    ),
    EntropyEncoding: S.optional(S.String).pipe(T.JsonName("entropyEncoding")),
    FieldEncoding: S.optional(S.String).pipe(T.JsonName("fieldEncoding")),
    FlickerAdaptiveQuantization: S.optional(S.String).pipe(
      T.JsonName("flickerAdaptiveQuantization"),
    ),
    FramerateControl: S.optional(S.String).pipe(T.JsonName("framerateControl")),
    FramerateConversionAlgorithm: S.optional(S.String).pipe(
      T.JsonName("framerateConversionAlgorithm"),
    ),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    GopBReference: S.optional(S.String).pipe(T.JsonName("gopBReference")),
    GopClosedCadence: S.optional(S.Number).pipe(T.JsonName("gopClosedCadence")),
    GopSize: S.optional(S.Number).pipe(T.JsonName("gopSize")),
    GopSizeUnits: S.optional(S.String).pipe(T.JsonName("gopSizeUnits")),
    HrdBufferFinalFillPercentage: S.optional(S.Number).pipe(
      T.JsonName("hrdBufferFinalFillPercentage"),
    ),
    HrdBufferInitialFillPercentage: S.optional(S.Number).pipe(
      T.JsonName("hrdBufferInitialFillPercentage"),
    ),
    HrdBufferSize: S.optional(S.Number).pipe(T.JsonName("hrdBufferSize")),
    InterlaceMode: S.optional(S.String).pipe(T.JsonName("interlaceMode")),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    MinIInterval: S.optional(S.Number).pipe(T.JsonName("minIInterval")),
    NumberBFramesBetweenReferenceFrames: S.optional(S.Number).pipe(
      T.JsonName("numberBFramesBetweenReferenceFrames"),
    ),
    NumberReferenceFrames: S.optional(S.Number).pipe(
      T.JsonName("numberReferenceFrames"),
    ),
    ParControl: S.optional(S.String).pipe(T.JsonName("parControl")),
    ParDenominator: S.optional(S.Number).pipe(T.JsonName("parDenominator")),
    ParNumerator: S.optional(S.Number).pipe(T.JsonName("parNumerator")),
    PerFrameMetrics: S.optional(__listOfFrameMetricType).pipe(
      T.JsonName("perFrameMetrics"),
    ),
    QualityTuningLevel: S.optional(S.String).pipe(
      T.JsonName("qualityTuningLevel"),
    ),
    QvbrSettings: S.optional(H264QvbrSettings)
      .pipe(T.JsonName("qvbrSettings"))
      .annotations({ identifier: "H264QvbrSettings" }),
    RateControlMode: S.optional(S.String).pipe(T.JsonName("rateControlMode")),
    RepeatPps: S.optional(S.String).pipe(T.JsonName("repeatPps")),
    SaliencyAwareEncoding: S.optional(S.String).pipe(
      T.JsonName("saliencyAwareEncoding"),
    ),
    ScanTypeConversionMode: S.optional(S.String).pipe(
      T.JsonName("scanTypeConversionMode"),
    ),
    SceneChangeDetect: S.optional(S.String).pipe(
      T.JsonName("sceneChangeDetect"),
    ),
    Slices: S.optional(S.Number).pipe(T.JsonName("slices")),
    SlowPal: S.optional(S.String).pipe(T.JsonName("slowPal")),
    Softness: S.optional(S.Number).pipe(T.JsonName("softness")),
    SpatialAdaptiveQuantization: S.optional(S.String).pipe(
      T.JsonName("spatialAdaptiveQuantization"),
    ),
    Syntax: S.optional(S.String).pipe(T.JsonName("syntax")),
    Telecine: S.optional(S.String).pipe(T.JsonName("telecine")),
    TemporalAdaptiveQuantization: S.optional(S.String).pipe(
      T.JsonName("temporalAdaptiveQuantization"),
    ),
    UnregisteredSeiTimecode: S.optional(S.String).pipe(
      T.JsonName("unregisteredSeiTimecode"),
    ),
    WriteMp4PackagingType: S.optional(S.String).pipe(
      T.JsonName("writeMp4PackagingType"),
    ),
  }),
).annotations({ identifier: "H264Settings" }) as any as S.Schema<H264Settings>;
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
export interface H265Settings {
  AdaptiveQuantization?: string;
  AlternateTransferFunctionSei?: string;
  BandwidthReductionFilter?: BandwidthReductionFilter;
  Bitrate?: number;
  CodecLevel?: string;
  CodecProfile?: string;
  Deblocking?: string;
  DynamicSubGop?: string;
  EndOfStreamMarkers?: string;
  FlickerAdaptiveQuantization?: string;
  FramerateControl?: string;
  FramerateConversionAlgorithm?: string;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  GopBReference?: string;
  GopClosedCadence?: number;
  GopSize?: number;
  GopSizeUnits?: string;
  HrdBufferFinalFillPercentage?: number;
  HrdBufferInitialFillPercentage?: number;
  HrdBufferSize?: number;
  InterlaceMode?: string;
  MaxBitrate?: number;
  MinIInterval?: number;
  MvOverPictureBoundaries?: string;
  MvTemporalPredictor?: string;
  NumberBFramesBetweenReferenceFrames?: number;
  NumberReferenceFrames?: number;
  ParControl?: string;
  ParDenominator?: number;
  ParNumerator?: number;
  PerFrameMetrics?: __listOfFrameMetricType;
  QualityTuningLevel?: string;
  QvbrSettings?: H265QvbrSettings;
  RateControlMode?: string;
  SampleAdaptiveOffsetFilterMode?: string;
  ScanTypeConversionMode?: string;
  SceneChangeDetect?: string;
  Slices?: number;
  SlowPal?: string;
  SpatialAdaptiveQuantization?: string;
  Telecine?: string;
  TemporalAdaptiveQuantization?: string;
  TemporalIds?: string;
  TileHeight?: number;
  TilePadding?: string;
  TileWidth?: number;
  Tiles?: string;
  TreeBlockSize?: string;
  UnregisteredSeiTimecode?: string;
  WriteMp4PackagingType?: string;
}
export const H265Settings = S.suspend(() =>
  S.Struct({
    AdaptiveQuantization: S.optional(S.String).pipe(
      T.JsonName("adaptiveQuantization"),
    ),
    AlternateTransferFunctionSei: S.optional(S.String).pipe(
      T.JsonName("alternateTransferFunctionSei"),
    ),
    BandwidthReductionFilter: S.optional(BandwidthReductionFilter)
      .pipe(T.JsonName("bandwidthReductionFilter"))
      .annotations({ identifier: "BandwidthReductionFilter" }),
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    CodecLevel: S.optional(S.String).pipe(T.JsonName("codecLevel")),
    CodecProfile: S.optional(S.String).pipe(T.JsonName("codecProfile")),
    Deblocking: S.optional(S.String).pipe(T.JsonName("deblocking")),
    DynamicSubGop: S.optional(S.String).pipe(T.JsonName("dynamicSubGop")),
    EndOfStreamMarkers: S.optional(S.String).pipe(
      T.JsonName("endOfStreamMarkers"),
    ),
    FlickerAdaptiveQuantization: S.optional(S.String).pipe(
      T.JsonName("flickerAdaptiveQuantization"),
    ),
    FramerateControl: S.optional(S.String).pipe(T.JsonName("framerateControl")),
    FramerateConversionAlgorithm: S.optional(S.String).pipe(
      T.JsonName("framerateConversionAlgorithm"),
    ),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    GopBReference: S.optional(S.String).pipe(T.JsonName("gopBReference")),
    GopClosedCadence: S.optional(S.Number).pipe(T.JsonName("gopClosedCadence")),
    GopSize: S.optional(S.Number).pipe(T.JsonName("gopSize")),
    GopSizeUnits: S.optional(S.String).pipe(T.JsonName("gopSizeUnits")),
    HrdBufferFinalFillPercentage: S.optional(S.Number).pipe(
      T.JsonName("hrdBufferFinalFillPercentage"),
    ),
    HrdBufferInitialFillPercentage: S.optional(S.Number).pipe(
      T.JsonName("hrdBufferInitialFillPercentage"),
    ),
    HrdBufferSize: S.optional(S.Number).pipe(T.JsonName("hrdBufferSize")),
    InterlaceMode: S.optional(S.String).pipe(T.JsonName("interlaceMode")),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    MinIInterval: S.optional(S.Number).pipe(T.JsonName("minIInterval")),
    MvOverPictureBoundaries: S.optional(S.String).pipe(
      T.JsonName("mvOverPictureBoundaries"),
    ),
    MvTemporalPredictor: S.optional(S.String).pipe(
      T.JsonName("mvTemporalPredictor"),
    ),
    NumberBFramesBetweenReferenceFrames: S.optional(S.Number).pipe(
      T.JsonName("numberBFramesBetweenReferenceFrames"),
    ),
    NumberReferenceFrames: S.optional(S.Number).pipe(
      T.JsonName("numberReferenceFrames"),
    ),
    ParControl: S.optional(S.String).pipe(T.JsonName("parControl")),
    ParDenominator: S.optional(S.Number).pipe(T.JsonName("parDenominator")),
    ParNumerator: S.optional(S.Number).pipe(T.JsonName("parNumerator")),
    PerFrameMetrics: S.optional(__listOfFrameMetricType).pipe(
      T.JsonName("perFrameMetrics"),
    ),
    QualityTuningLevel: S.optional(S.String).pipe(
      T.JsonName("qualityTuningLevel"),
    ),
    QvbrSettings: S.optional(H265QvbrSettings)
      .pipe(T.JsonName("qvbrSettings"))
      .annotations({ identifier: "H265QvbrSettings" }),
    RateControlMode: S.optional(S.String).pipe(T.JsonName("rateControlMode")),
    SampleAdaptiveOffsetFilterMode: S.optional(S.String).pipe(
      T.JsonName("sampleAdaptiveOffsetFilterMode"),
    ),
    ScanTypeConversionMode: S.optional(S.String).pipe(
      T.JsonName("scanTypeConversionMode"),
    ),
    SceneChangeDetect: S.optional(S.String).pipe(
      T.JsonName("sceneChangeDetect"),
    ),
    Slices: S.optional(S.Number).pipe(T.JsonName("slices")),
    SlowPal: S.optional(S.String).pipe(T.JsonName("slowPal")),
    SpatialAdaptiveQuantization: S.optional(S.String).pipe(
      T.JsonName("spatialAdaptiveQuantization"),
    ),
    Telecine: S.optional(S.String).pipe(T.JsonName("telecine")),
    TemporalAdaptiveQuantization: S.optional(S.String).pipe(
      T.JsonName("temporalAdaptiveQuantization"),
    ),
    TemporalIds: S.optional(S.String).pipe(T.JsonName("temporalIds")),
    TileHeight: S.optional(S.Number).pipe(T.JsonName("tileHeight")),
    TilePadding: S.optional(S.String).pipe(T.JsonName("tilePadding")),
    TileWidth: S.optional(S.Number).pipe(T.JsonName("tileWidth")),
    Tiles: S.optional(S.String).pipe(T.JsonName("tiles")),
    TreeBlockSize: S.optional(S.String).pipe(T.JsonName("treeBlockSize")),
    UnregisteredSeiTimecode: S.optional(S.String).pipe(
      T.JsonName("unregisteredSeiTimecode"),
    ),
    WriteMp4PackagingType: S.optional(S.String).pipe(
      T.JsonName("writeMp4PackagingType"),
    ),
  }),
).annotations({ identifier: "H265Settings" }) as any as S.Schema<H265Settings>;
export interface Mpeg2Settings {
  AdaptiveQuantization?: string;
  Bitrate?: number;
  CodecLevel?: string;
  CodecProfile?: string;
  DynamicSubGop?: string;
  FramerateControl?: string;
  FramerateConversionAlgorithm?: string;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  GopClosedCadence?: number;
  GopSize?: number;
  GopSizeUnits?: string;
  HrdBufferFinalFillPercentage?: number;
  HrdBufferInitialFillPercentage?: number;
  HrdBufferSize?: number;
  InterlaceMode?: string;
  IntraDcPrecision?: string;
  MaxBitrate?: number;
  MinIInterval?: number;
  NumberBFramesBetweenReferenceFrames?: number;
  ParControl?: string;
  ParDenominator?: number;
  ParNumerator?: number;
  PerFrameMetrics?: __listOfFrameMetricType;
  QualityTuningLevel?: string;
  RateControlMode?: string;
  ScanTypeConversionMode?: string;
  SceneChangeDetect?: string;
  SlowPal?: string;
  Softness?: number;
  SpatialAdaptiveQuantization?: string;
  Syntax?: string;
  Telecine?: string;
  TemporalAdaptiveQuantization?: string;
}
export const Mpeg2Settings = S.suspend(() =>
  S.Struct({
    AdaptiveQuantization: S.optional(S.String).pipe(
      T.JsonName("adaptiveQuantization"),
    ),
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    CodecLevel: S.optional(S.String).pipe(T.JsonName("codecLevel")),
    CodecProfile: S.optional(S.String).pipe(T.JsonName("codecProfile")),
    DynamicSubGop: S.optional(S.String).pipe(T.JsonName("dynamicSubGop")),
    FramerateControl: S.optional(S.String).pipe(T.JsonName("framerateControl")),
    FramerateConversionAlgorithm: S.optional(S.String).pipe(
      T.JsonName("framerateConversionAlgorithm"),
    ),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    GopClosedCadence: S.optional(S.Number).pipe(T.JsonName("gopClosedCadence")),
    GopSize: S.optional(S.Number).pipe(T.JsonName("gopSize")),
    GopSizeUnits: S.optional(S.String).pipe(T.JsonName("gopSizeUnits")),
    HrdBufferFinalFillPercentage: S.optional(S.Number).pipe(
      T.JsonName("hrdBufferFinalFillPercentage"),
    ),
    HrdBufferInitialFillPercentage: S.optional(S.Number).pipe(
      T.JsonName("hrdBufferInitialFillPercentage"),
    ),
    HrdBufferSize: S.optional(S.Number).pipe(T.JsonName("hrdBufferSize")),
    InterlaceMode: S.optional(S.String).pipe(T.JsonName("interlaceMode")),
    IntraDcPrecision: S.optional(S.String).pipe(T.JsonName("intraDcPrecision")),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    MinIInterval: S.optional(S.Number).pipe(T.JsonName("minIInterval")),
    NumberBFramesBetweenReferenceFrames: S.optional(S.Number).pipe(
      T.JsonName("numberBFramesBetweenReferenceFrames"),
    ),
    ParControl: S.optional(S.String).pipe(T.JsonName("parControl")),
    ParDenominator: S.optional(S.Number).pipe(T.JsonName("parDenominator")),
    ParNumerator: S.optional(S.Number).pipe(T.JsonName("parNumerator")),
    PerFrameMetrics: S.optional(__listOfFrameMetricType).pipe(
      T.JsonName("perFrameMetrics"),
    ),
    QualityTuningLevel: S.optional(S.String).pipe(
      T.JsonName("qualityTuningLevel"),
    ),
    RateControlMode: S.optional(S.String).pipe(T.JsonName("rateControlMode")),
    ScanTypeConversionMode: S.optional(S.String).pipe(
      T.JsonName("scanTypeConversionMode"),
    ),
    SceneChangeDetect: S.optional(S.String).pipe(
      T.JsonName("sceneChangeDetect"),
    ),
    SlowPal: S.optional(S.String).pipe(T.JsonName("slowPal")),
    Softness: S.optional(S.Number).pipe(T.JsonName("softness")),
    SpatialAdaptiveQuantization: S.optional(S.String).pipe(
      T.JsonName("spatialAdaptiveQuantization"),
    ),
    Syntax: S.optional(S.String).pipe(T.JsonName("syntax")),
    Telecine: S.optional(S.String).pipe(T.JsonName("telecine")),
    TemporalAdaptiveQuantization: S.optional(S.String).pipe(
      T.JsonName("temporalAdaptiveQuantization"),
    ),
  }),
).annotations({
  identifier: "Mpeg2Settings",
}) as any as S.Schema<Mpeg2Settings>;
export interface PassthroughSettings {
  FrameControl?: string;
  VideoSelectorMode?: string;
}
export const PassthroughSettings = S.suspend(() =>
  S.Struct({
    FrameControl: S.optional(S.String).pipe(T.JsonName("frameControl")),
    VideoSelectorMode: S.optional(S.String).pipe(
      T.JsonName("videoSelectorMode"),
    ),
  }),
).annotations({
  identifier: "PassthroughSettings",
}) as any as S.Schema<PassthroughSettings>;
export interface ProresSettings {
  ChromaSampling?: string;
  CodecProfile?: string;
  FramerateControl?: string;
  FramerateConversionAlgorithm?: string;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  InterlaceMode?: string;
  ParControl?: string;
  ParDenominator?: number;
  ParNumerator?: number;
  PerFrameMetrics?: __listOfFrameMetricType;
  ScanTypeConversionMode?: string;
  SlowPal?: string;
  Telecine?: string;
}
export const ProresSettings = S.suspend(() =>
  S.Struct({
    ChromaSampling: S.optional(S.String).pipe(T.JsonName("chromaSampling")),
    CodecProfile: S.optional(S.String).pipe(T.JsonName("codecProfile")),
    FramerateControl: S.optional(S.String).pipe(T.JsonName("framerateControl")),
    FramerateConversionAlgorithm: S.optional(S.String).pipe(
      T.JsonName("framerateConversionAlgorithm"),
    ),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    InterlaceMode: S.optional(S.String).pipe(T.JsonName("interlaceMode")),
    ParControl: S.optional(S.String).pipe(T.JsonName("parControl")),
    ParDenominator: S.optional(S.Number).pipe(T.JsonName("parDenominator")),
    ParNumerator: S.optional(S.Number).pipe(T.JsonName("parNumerator")),
    PerFrameMetrics: S.optional(__listOfFrameMetricType).pipe(
      T.JsonName("perFrameMetrics"),
    ),
    ScanTypeConversionMode: S.optional(S.String).pipe(
      T.JsonName("scanTypeConversionMode"),
    ),
    SlowPal: S.optional(S.String).pipe(T.JsonName("slowPal")),
    Telecine: S.optional(S.String).pipe(T.JsonName("telecine")),
  }),
).annotations({
  identifier: "ProresSettings",
}) as any as S.Schema<ProresSettings>;
export interface UncompressedSettings {
  Fourcc?: string;
  FramerateControl?: string;
  FramerateConversionAlgorithm?: string;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  InterlaceMode?: string;
  ScanTypeConversionMode?: string;
  SlowPal?: string;
  Telecine?: string;
}
export const UncompressedSettings = S.suspend(() =>
  S.Struct({
    Fourcc: S.optional(S.String).pipe(T.JsonName("fourcc")),
    FramerateControl: S.optional(S.String).pipe(T.JsonName("framerateControl")),
    FramerateConversionAlgorithm: S.optional(S.String).pipe(
      T.JsonName("framerateConversionAlgorithm"),
    ),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    InterlaceMode: S.optional(S.String).pipe(T.JsonName("interlaceMode")),
    ScanTypeConversionMode: S.optional(S.String).pipe(
      T.JsonName("scanTypeConversionMode"),
    ),
    SlowPal: S.optional(S.String).pipe(T.JsonName("slowPal")),
    Telecine: S.optional(S.String).pipe(T.JsonName("telecine")),
  }),
).annotations({
  identifier: "UncompressedSettings",
}) as any as S.Schema<UncompressedSettings>;
export interface Vc3Settings {
  FramerateControl?: string;
  FramerateConversionAlgorithm?: string;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  InterlaceMode?: string;
  ScanTypeConversionMode?: string;
  SlowPal?: string;
  Telecine?: string;
  Vc3Class?: string;
}
export const Vc3Settings = S.suspend(() =>
  S.Struct({
    FramerateControl: S.optional(S.String).pipe(T.JsonName("framerateControl")),
    FramerateConversionAlgorithm: S.optional(S.String).pipe(
      T.JsonName("framerateConversionAlgorithm"),
    ),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    InterlaceMode: S.optional(S.String).pipe(T.JsonName("interlaceMode")),
    ScanTypeConversionMode: S.optional(S.String).pipe(
      T.JsonName("scanTypeConversionMode"),
    ),
    SlowPal: S.optional(S.String).pipe(T.JsonName("slowPal")),
    Telecine: S.optional(S.String).pipe(T.JsonName("telecine")),
    Vc3Class: S.optional(S.String).pipe(T.JsonName("vc3Class")),
  }),
).annotations({ identifier: "Vc3Settings" }) as any as S.Schema<Vc3Settings>;
export interface Vp8Settings {
  Bitrate?: number;
  FramerateControl?: string;
  FramerateConversionAlgorithm?: string;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  GopSize?: number;
  HrdBufferSize?: number;
  MaxBitrate?: number;
  ParControl?: string;
  ParDenominator?: number;
  ParNumerator?: number;
  QualityTuningLevel?: string;
  RateControlMode?: string;
}
export const Vp8Settings = S.suspend(() =>
  S.Struct({
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    FramerateControl: S.optional(S.String).pipe(T.JsonName("framerateControl")),
    FramerateConversionAlgorithm: S.optional(S.String).pipe(
      T.JsonName("framerateConversionAlgorithm"),
    ),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    GopSize: S.optional(S.Number).pipe(T.JsonName("gopSize")),
    HrdBufferSize: S.optional(S.Number).pipe(T.JsonName("hrdBufferSize")),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    ParControl: S.optional(S.String).pipe(T.JsonName("parControl")),
    ParDenominator: S.optional(S.Number).pipe(T.JsonName("parDenominator")),
    ParNumerator: S.optional(S.Number).pipe(T.JsonName("parNumerator")),
    QualityTuningLevel: S.optional(S.String).pipe(
      T.JsonName("qualityTuningLevel"),
    ),
    RateControlMode: S.optional(S.String).pipe(T.JsonName("rateControlMode")),
  }),
).annotations({ identifier: "Vp8Settings" }) as any as S.Schema<Vp8Settings>;
export interface Vp9Settings {
  Bitrate?: number;
  FramerateControl?: string;
  FramerateConversionAlgorithm?: string;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  GopSize?: number;
  HrdBufferSize?: number;
  MaxBitrate?: number;
  ParControl?: string;
  ParDenominator?: number;
  ParNumerator?: number;
  QualityTuningLevel?: string;
  RateControlMode?: string;
}
export const Vp9Settings = S.suspend(() =>
  S.Struct({
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    FramerateControl: S.optional(S.String).pipe(T.JsonName("framerateControl")),
    FramerateConversionAlgorithm: S.optional(S.String).pipe(
      T.JsonName("framerateConversionAlgorithm"),
    ),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    GopSize: S.optional(S.Number).pipe(T.JsonName("gopSize")),
    HrdBufferSize: S.optional(S.Number).pipe(T.JsonName("hrdBufferSize")),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    ParControl: S.optional(S.String).pipe(T.JsonName("parControl")),
    ParDenominator: S.optional(S.Number).pipe(T.JsonName("parDenominator")),
    ParNumerator: S.optional(S.Number).pipe(T.JsonName("parNumerator")),
    QualityTuningLevel: S.optional(S.String).pipe(
      T.JsonName("qualityTuningLevel"),
    ),
    RateControlMode: S.optional(S.String).pipe(T.JsonName("rateControlMode")),
  }),
).annotations({ identifier: "Vp9Settings" }) as any as S.Schema<Vp9Settings>;
export interface Xavc4kIntraCbgProfileSettings {
  XavcClass?: string;
}
export const Xavc4kIntraCbgProfileSettings = S.suspend(() =>
  S.Struct({ XavcClass: S.optional(S.String).pipe(T.JsonName("xavcClass")) }),
).annotations({
  identifier: "Xavc4kIntraCbgProfileSettings",
}) as any as S.Schema<Xavc4kIntraCbgProfileSettings>;
export interface Xavc4kIntraVbrProfileSettings {
  XavcClass?: string;
}
export const Xavc4kIntraVbrProfileSettings = S.suspend(() =>
  S.Struct({ XavcClass: S.optional(S.String).pipe(T.JsonName("xavcClass")) }),
).annotations({
  identifier: "Xavc4kIntraVbrProfileSettings",
}) as any as S.Schema<Xavc4kIntraVbrProfileSettings>;
export interface Xavc4kProfileSettings {
  BitrateClass?: string;
  CodecProfile?: string;
  FlickerAdaptiveQuantization?: string;
  GopBReference?: string;
  GopClosedCadence?: number;
  HrdBufferSize?: number;
  QualityTuningLevel?: string;
  Slices?: number;
}
export const Xavc4kProfileSettings = S.suspend(() =>
  S.Struct({
    BitrateClass: S.optional(S.String).pipe(T.JsonName("bitrateClass")),
    CodecProfile: S.optional(S.String).pipe(T.JsonName("codecProfile")),
    FlickerAdaptiveQuantization: S.optional(S.String).pipe(
      T.JsonName("flickerAdaptiveQuantization"),
    ),
    GopBReference: S.optional(S.String).pipe(T.JsonName("gopBReference")),
    GopClosedCadence: S.optional(S.Number).pipe(T.JsonName("gopClosedCadence")),
    HrdBufferSize: S.optional(S.Number).pipe(T.JsonName("hrdBufferSize")),
    QualityTuningLevel: S.optional(S.String).pipe(
      T.JsonName("qualityTuningLevel"),
    ),
    Slices: S.optional(S.Number).pipe(T.JsonName("slices")),
  }),
).annotations({
  identifier: "Xavc4kProfileSettings",
}) as any as S.Schema<Xavc4kProfileSettings>;
export interface XavcHdIntraCbgProfileSettings {
  XavcClass?: string;
}
export const XavcHdIntraCbgProfileSettings = S.suspend(() =>
  S.Struct({ XavcClass: S.optional(S.String).pipe(T.JsonName("xavcClass")) }),
).annotations({
  identifier: "XavcHdIntraCbgProfileSettings",
}) as any as S.Schema<XavcHdIntraCbgProfileSettings>;
export interface XavcHdProfileSettings {
  BitrateClass?: string;
  FlickerAdaptiveQuantization?: string;
  GopBReference?: string;
  GopClosedCadence?: number;
  HrdBufferSize?: number;
  InterlaceMode?: string;
  QualityTuningLevel?: string;
  Slices?: number;
  Telecine?: string;
}
export const XavcHdProfileSettings = S.suspend(() =>
  S.Struct({
    BitrateClass: S.optional(S.String).pipe(T.JsonName("bitrateClass")),
    FlickerAdaptiveQuantization: S.optional(S.String).pipe(
      T.JsonName("flickerAdaptiveQuantization"),
    ),
    GopBReference: S.optional(S.String).pipe(T.JsonName("gopBReference")),
    GopClosedCadence: S.optional(S.Number).pipe(T.JsonName("gopClosedCadence")),
    HrdBufferSize: S.optional(S.Number).pipe(T.JsonName("hrdBufferSize")),
    InterlaceMode: S.optional(S.String).pipe(T.JsonName("interlaceMode")),
    QualityTuningLevel: S.optional(S.String).pipe(
      T.JsonName("qualityTuningLevel"),
    ),
    Slices: S.optional(S.Number).pipe(T.JsonName("slices")),
    Telecine: S.optional(S.String).pipe(T.JsonName("telecine")),
  }),
).annotations({
  identifier: "XavcHdProfileSettings",
}) as any as S.Schema<XavcHdProfileSettings>;
export interface XavcSettings {
  AdaptiveQuantization?: string;
  EntropyEncoding?: string;
  FramerateControl?: string;
  FramerateConversionAlgorithm?: string;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  PerFrameMetrics?: __listOfFrameMetricType;
  Profile?: string;
  SlowPal?: string;
  Softness?: number;
  SpatialAdaptiveQuantization?: string;
  TemporalAdaptiveQuantization?: string;
  Xavc4kIntraCbgProfileSettings?: Xavc4kIntraCbgProfileSettings;
  Xavc4kIntraVbrProfileSettings?: Xavc4kIntraVbrProfileSettings;
  Xavc4kProfileSettings?: Xavc4kProfileSettings;
  XavcHdIntraCbgProfileSettings?: XavcHdIntraCbgProfileSettings;
  XavcHdProfileSettings?: XavcHdProfileSettings;
}
export const XavcSettings = S.suspend(() =>
  S.Struct({
    AdaptiveQuantization: S.optional(S.String).pipe(
      T.JsonName("adaptiveQuantization"),
    ),
    EntropyEncoding: S.optional(S.String).pipe(T.JsonName("entropyEncoding")),
    FramerateControl: S.optional(S.String).pipe(T.JsonName("framerateControl")),
    FramerateConversionAlgorithm: S.optional(S.String).pipe(
      T.JsonName("framerateConversionAlgorithm"),
    ),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    PerFrameMetrics: S.optional(__listOfFrameMetricType).pipe(
      T.JsonName("perFrameMetrics"),
    ),
    Profile: S.optional(S.String).pipe(T.JsonName("profile")),
    SlowPal: S.optional(S.String).pipe(T.JsonName("slowPal")),
    Softness: S.optional(S.Number).pipe(T.JsonName("softness")),
    SpatialAdaptiveQuantization: S.optional(S.String).pipe(
      T.JsonName("spatialAdaptiveQuantization"),
    ),
    TemporalAdaptiveQuantization: S.optional(S.String).pipe(
      T.JsonName("temporalAdaptiveQuantization"),
    ),
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
  Codec?: string;
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
    Codec: S.optional(S.String).pipe(T.JsonName("codec")),
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
export interface ColorCorrector {
  Brightness?: number;
  ClipLimits?: ClipLimits;
  ColorSpaceConversion?: string;
  Contrast?: number;
  Hdr10Metadata?: Hdr10Metadata;
  HdrToSdrToneMapper?: string;
  Hue?: number;
  MaxLuminance?: number;
  SampleRangeConversion?: string;
  Saturation?: number;
  SdrReferenceWhiteLevel?: number;
}
export const ColorCorrector = S.suspend(() =>
  S.Struct({
    Brightness: S.optional(S.Number).pipe(T.JsonName("brightness")),
    ClipLimits: S.optional(ClipLimits)
      .pipe(T.JsonName("clipLimits"))
      .annotations({ identifier: "ClipLimits" }),
    ColorSpaceConversion: S.optional(S.String).pipe(
      T.JsonName("colorSpaceConversion"),
    ),
    Contrast: S.optional(S.Number).pipe(T.JsonName("contrast")),
    Hdr10Metadata: S.optional(Hdr10Metadata)
      .pipe(T.JsonName("hdr10Metadata"))
      .annotations({ identifier: "Hdr10Metadata" }),
    HdrToSdrToneMapper: S.optional(S.String).pipe(
      T.JsonName("hdrToSdrToneMapper"),
    ),
    Hue: S.optional(S.Number).pipe(T.JsonName("hue")),
    MaxLuminance: S.optional(S.Number).pipe(T.JsonName("maxLuminance")),
    SampleRangeConversion: S.optional(S.String).pipe(
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
export interface Deinterlacer {
  Algorithm?: string;
  Control?: string;
  Mode?: string;
}
export const Deinterlacer = S.suspend(() =>
  S.Struct({
    Algorithm: S.optional(S.String).pipe(T.JsonName("algorithm")),
    Control: S.optional(S.String).pipe(T.JsonName("control")),
    Mode: S.optional(S.String).pipe(T.JsonName("mode")),
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
export interface DolbyVision {
  L6Metadata?: DolbyVisionLevel6Metadata;
  L6Mode?: string;
  Mapping?: string;
  Profile?: string;
}
export const DolbyVision = S.suspend(() =>
  S.Struct({
    L6Metadata: S.optional(DolbyVisionLevel6Metadata)
      .pipe(T.JsonName("l6Metadata"))
      .annotations({ identifier: "DolbyVisionLevel6Metadata" }),
    L6Mode: S.optional(S.String).pipe(T.JsonName("l6Mode")),
    Mapping: S.optional(S.String).pipe(T.JsonName("mapping")),
    Profile: S.optional(S.String).pipe(T.JsonName("profile")),
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
export interface NoiseReducerTemporalFilterSettings {
  AggressiveMode?: number;
  PostTemporalSharpening?: string;
  PostTemporalSharpeningStrength?: string;
  Speed?: number;
  Strength?: number;
}
export const NoiseReducerTemporalFilterSettings = S.suspend(() =>
  S.Struct({
    AggressiveMode: S.optional(S.Number).pipe(T.JsonName("aggressiveMode")),
    PostTemporalSharpening: S.optional(S.String).pipe(
      T.JsonName("postTemporalSharpening"),
    ),
    PostTemporalSharpeningStrength: S.optional(S.String).pipe(
      T.JsonName("postTemporalSharpeningStrength"),
    ),
    Speed: S.optional(S.Number).pipe(T.JsonName("speed")),
    Strength: S.optional(S.Number).pipe(T.JsonName("strength")),
  }),
).annotations({
  identifier: "NoiseReducerTemporalFilterSettings",
}) as any as S.Schema<NoiseReducerTemporalFilterSettings>;
export interface NoiseReducer {
  Filter?: string;
  FilterSettings?: NoiseReducerFilterSettings;
  SpatialFilterSettings?: NoiseReducerSpatialFilterSettings;
  TemporalFilterSettings?: NoiseReducerTemporalFilterSettings;
}
export const NoiseReducer = S.suspend(() =>
  S.Struct({
    Filter: S.optional(S.String).pipe(T.JsonName("filter")),
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
export interface NexGuardFileMarkerSettings {
  License?: string;
  Payload?: number;
  Preset?: string;
  Strength?: string;
}
export const NexGuardFileMarkerSettings = S.suspend(() =>
  S.Struct({
    License: S.optional(S.String).pipe(T.JsonName("license")),
    Payload: S.optional(S.Number).pipe(T.JsonName("payload")),
    Preset: S.optional(S.String).pipe(T.JsonName("preset")),
    Strength: S.optional(S.String).pipe(T.JsonName("strength")),
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
export interface TimecodeBurnin {
  FontSize?: number;
  Position?: string;
  Prefix?: string;
}
export const TimecodeBurnin = S.suspend(() =>
  S.Struct({
    FontSize: S.optional(S.Number).pipe(T.JsonName("fontSize")),
    Position: S.optional(S.String).pipe(T.JsonName("position")),
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
  AfdSignaling?: string;
  AntiAlias?: string;
  ChromaPositionMode?: string;
  CodecSettings?: VideoCodecSettings;
  ColorMetadata?: string;
  Crop?: Rectangle;
  DropFrameTimecode?: string;
  FixedAfd?: number;
  Height?: number;
  Position?: Rectangle;
  RespondToAfd?: string;
  ScalingBehavior?: string;
  Sharpness?: number;
  TimecodeInsertion?: string;
  TimecodeTrack?: string;
  VideoPreprocessors?: VideoPreprocessor;
  Width?: number;
}
export const VideoDescription = S.suspend(() =>
  S.Struct({
    AfdSignaling: S.optional(S.String).pipe(T.JsonName("afdSignaling")),
    AntiAlias: S.optional(S.String).pipe(T.JsonName("antiAlias")),
    ChromaPositionMode: S.optional(S.String).pipe(
      T.JsonName("chromaPositionMode"),
    ),
    CodecSettings: S.optional(VideoCodecSettings)
      .pipe(T.JsonName("codecSettings"))
      .annotations({ identifier: "VideoCodecSettings" }),
    ColorMetadata: S.optional(S.String).pipe(T.JsonName("colorMetadata")),
    Crop: S.optional(Rectangle)
      .pipe(T.JsonName("crop"))
      .annotations({ identifier: "Rectangle" }),
    DropFrameTimecode: S.optional(S.String).pipe(
      T.JsonName("dropFrameTimecode"),
    ),
    FixedAfd: S.optional(S.Number).pipe(T.JsonName("fixedAfd")),
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    Position: S.optional(Rectangle)
      .pipe(T.JsonName("position"))
      .annotations({ identifier: "Rectangle" }),
    RespondToAfd: S.optional(S.String).pipe(T.JsonName("respondToAfd")),
    ScalingBehavior: S.optional(S.String).pipe(T.JsonName("scalingBehavior")),
    Sharpness: S.optional(S.Number).pipe(T.JsonName("sharpness")),
    TimecodeInsertion: S.optional(S.String).pipe(
      T.JsonName("timecodeInsertion"),
    ),
    TimecodeTrack: S.optional(S.String).pipe(T.JsonName("timecodeTrack")),
    VideoPreprocessors: S.optional(VideoPreprocessor)
      .pipe(T.JsonName("videoPreprocessors"))
      .annotations({ identifier: "VideoPreprocessor" }),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
  }),
).annotations({
  identifier: "VideoDescription",
}) as any as S.Schema<VideoDescription>;
export interface Output {
  AudioDescriptions?: __listOfAudioDescription;
  CaptionDescriptions?: __listOfCaptionDescription;
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
  Outputs?: __listOfOutput;
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
export interface TimecodeConfig {
  Anchor?: string;
  Source?: string;
  Start?: string;
  TimestampOffset?: string;
}
export const TimecodeConfig = S.suspend(() =>
  S.Struct({
    Anchor: S.optional(S.String).pipe(T.JsonName("anchor")),
    Source: S.optional(S.String).pipe(T.JsonName("source")),
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
  Id3Insertions?: __listOfId3Insertion;
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
  ColorConversion3DLUTSettings?: __listOfColorConversion3DLUTSetting;
  Esam?: EsamSettings;
  ExtendedDataServices?: ExtendedDataServices;
  FollowSource?: number;
  Inputs?: __listOfInputTemplate;
  KantarWatermark?: KantarWatermarkSettings;
  MotionImageInserter?: MotionImageInserter;
  NielsenConfiguration?: NielsenConfiguration;
  NielsenNonLinearWatermark?: NielsenNonLinearWatermarkSettings;
  OutputGroups?: __listOfOutputGroup;
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
  HopDestinations?: __listOfHopDestination;
  Name: string;
  Priority?: number;
  Queue?: string;
  Settings?: JobTemplateSettings;
  StatusUpdateInterval?: string;
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
    StatusUpdateInterval: S.optional(S.String).pipe(
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
  LanguageCode?: string;
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
    LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
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
  AudioDescriptions?: __listOfAudioDescription;
  CaptionDescriptions?: __listOfCaptionDescriptionPreset;
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
export interface ReservationPlanSettings {
  Commitment: string;
  RenewalType: string;
  ReservedSlots: number;
}
export const ReservationPlanSettings = S.suspend(() =>
  S.Struct({
    Commitment: S.String.pipe(T.JsonName("commitment")),
    RenewalType: S.String.pipe(T.JsonName("renewalType")),
    ReservedSlots: S.Number.pipe(T.JsonName("reservedSlots")),
  }),
).annotations({
  identifier: "ReservationPlanSettings",
}) as any as S.Schema<ReservationPlanSettings>;
export interface UpdateQueueRequest {
  ConcurrentJobs?: number;
  Description?: string;
  Name: string;
  ReservationPlanSettings?: ReservationPlanSettings;
  Status?: string;
}
export const UpdateQueueRequest = S.suspend(() =>
  S.Struct({
    ConcurrentJobs: S.optional(S.Number).pipe(T.JsonName("concurrentJobs")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Name: S.String.pipe(T.HttpLabel("Name")),
    ReservationPlanSettings: S.optional(ReservationPlanSettings)
      .pipe(T.JsonName("reservationPlanSettings"))
      .annotations({ identifier: "ReservationPlanSettings" }),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
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
export type __listOf__stringMax100 = string[];
export const __listOf__stringMax100 = S.Array(S.String);
export interface JobMessages {
  Info?: __listOf__string;
  Warning?: __listOf__string;
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
  OutputDetails?: __listOfOutputDetail;
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
export interface InputDecryptionSettings {
  DecryptionMode?: string;
  EncryptedDecryptionKey?: string;
  InitializationVector?: string;
  KmsKeyRegion?: string;
}
export const InputDecryptionSettings = S.suspend(() =>
  S.Struct({
    DecryptionMode: S.optional(S.String).pipe(T.JsonName("decryptionMode")),
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
export interface InputTamsSettings {
  AuthConnectionArn?: string;
  GapHandling?: string;
  SourceId?: string;
  Timerange?: string;
}
export const InputTamsSettings = S.suspend(() =>
  S.Struct({
    AuthConnectionArn: S.optional(S.String).pipe(
      T.JsonName("authConnectionArn"),
    ),
    GapHandling: S.optional(S.String).pipe(T.JsonName("gapHandling")),
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
  AdvancedInputFilter?: string;
  AdvancedInputFilterSettings?: AdvancedInputFilterSettings;
  AudioSelectorGroups?: __mapOfAudioSelectorGroup;
  AudioSelectors?: __mapOfAudioSelector;
  CaptionSelectors?: __mapOfCaptionSelector;
  Crop?: Rectangle;
  DeblockFilter?: string;
  DecryptionSettings?: InputDecryptionSettings;
  DenoiseFilter?: string;
  DolbyVisionMetadataXml?: string;
  DynamicAudioSelectors?: __mapOfDynamicAudioSelector;
  FileInput?: string;
  FilterEnable?: string;
  FilterStrength?: number;
  ImageInserter?: ImageInserter;
  InputClippings?: __listOfInputClipping;
  InputScanType?: string;
  Position?: Rectangle;
  ProgramNumber?: number;
  PsiControl?: string;
  SupplementalImps?: __listOf__stringPatternS3ASSETMAPXml;
  TamsSettings?: InputTamsSettings;
  TimecodeSource?: string;
  TimecodeStart?: string;
  VideoGenerator?: InputVideoGenerator;
  VideoOverlays?: __listOfVideoOverlay;
  VideoSelector?: VideoSelector;
}
export const Input = S.suspend(() =>
  S.Struct({
    AdvancedInputFilter: S.optional(S.String).pipe(
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
    DeblockFilter: S.optional(S.String).pipe(T.JsonName("deblockFilter")),
    DecryptionSettings: S.optional(InputDecryptionSettings)
      .pipe(T.JsonName("decryptionSettings"))
      .annotations({ identifier: "InputDecryptionSettings" }),
    DenoiseFilter: S.optional(S.String).pipe(T.JsonName("denoiseFilter")),
    DolbyVisionMetadataXml: S.optional(S.String).pipe(
      T.JsonName("dolbyVisionMetadataXml"),
    ),
    DynamicAudioSelectors: S.optional(__mapOfDynamicAudioSelector).pipe(
      T.JsonName("dynamicAudioSelectors"),
    ),
    FileInput: S.optional(S.String).pipe(T.JsonName("fileInput")),
    FilterEnable: S.optional(S.String).pipe(T.JsonName("filterEnable")),
    FilterStrength: S.optional(S.Number).pipe(T.JsonName("filterStrength")),
    ImageInserter: S.optional(ImageInserter)
      .pipe(T.JsonName("imageInserter"))
      .annotations({ identifier: "ImageInserter" }),
    InputClippings: S.optional(__listOfInputClipping).pipe(
      T.JsonName("inputClippings"),
    ),
    InputScanType: S.optional(S.String).pipe(T.JsonName("inputScanType")),
    Position: S.optional(Rectangle)
      .pipe(T.JsonName("position"))
      .annotations({ identifier: "Rectangle" }),
    ProgramNumber: S.optional(S.Number).pipe(T.JsonName("programNumber")),
    PsiControl: S.optional(S.String).pipe(T.JsonName("psiControl")),
    SupplementalImps: S.optional(__listOf__stringPatternS3ASSETMAPXml).pipe(
      T.JsonName("supplementalImps"),
    ),
    TamsSettings: S.optional(InputTamsSettings)
      .pipe(T.JsonName("tamsSettings"))
      .annotations({ identifier: "InputTamsSettings" }),
    TimecodeSource: S.optional(S.String).pipe(T.JsonName("timecodeSource")),
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
  ColorConversion3DLUTSettings?: __listOfColorConversion3DLUTSetting;
  Esam?: EsamSettings;
  ExtendedDataServices?: ExtendedDataServices;
  FollowSource?: number;
  Inputs?: __listOfInput;
  KantarWatermark?: KantarWatermarkSettings;
  MotionImageInserter?: MotionImageInserter;
  NielsenConfiguration?: NielsenConfiguration;
  NielsenNonLinearWatermark?: NielsenNonLinearWatermarkSettings;
  OutputGroups?: __listOfOutputGroup;
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
  Code: number;
  Count: number;
}
export const WarningGroup = S.suspend(() =>
  S.Struct({
    Code: S.Number.pipe(T.JsonName("code")),
    Count: S.Number.pipe(T.JsonName("count")),
  }),
).annotations({ identifier: "WarningGroup" }) as any as S.Schema<WarningGroup>;
export type __listOfWarningGroup = WarningGroup[];
export const __listOfWarningGroup = S.Array(WarningGroup);
export interface Job {
  AccelerationSettings?: AccelerationSettings;
  AccelerationStatus?: string;
  Arn?: string;
  BillingTagsSource?: string;
  ClientRequestToken?: string;
  CreatedAt?: Date;
  CurrentPhase?: string;
  ErrorCode?: number;
  ErrorMessage?: string;
  HopDestinations?: __listOfHopDestination;
  Id?: string;
  JobEngineVersionRequested?: string;
  JobEngineVersionUsed?: string;
  JobPercentComplete?: number;
  JobTemplate?: string;
  LastShareDetails?: string;
  Messages?: JobMessages;
  OutputGroupDetails?: __listOfOutputGroupDetail;
  Priority?: number;
  Queue?: string;
  QueueTransitions?: __listOfQueueTransition;
  RetryCount?: number;
  Role: string;
  Settings: JobSettings;
  ShareStatus?: string;
  SimulateReservedQueue?: string;
  Status?: string;
  StatusUpdateInterval?: string;
  Timing?: Timing;
  UserMetadata?: __mapOf__string;
  Warnings?: __listOfWarningGroup;
}
export const Job = S.suspend(() =>
  S.Struct({
    AccelerationSettings: S.optional(AccelerationSettings)
      .pipe(T.JsonName("accelerationSettings"))
      .annotations({ identifier: "AccelerationSettings" }),
    AccelerationStatus: S.optional(S.String).pipe(
      T.JsonName("accelerationStatus"),
    ),
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    BillingTagsSource: S.optional(S.String).pipe(
      T.JsonName("billingTagsSource"),
    ),
    ClientRequestToken: S.optional(S.String).pipe(
      T.JsonName("clientRequestToken"),
    ),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("createdAt"),
    ),
    CurrentPhase: S.optional(S.String).pipe(T.JsonName("currentPhase")),
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
    Role: S.String.pipe(T.JsonName("role")),
    Settings: JobSettings.pipe(T.JsonName("settings")).annotations({
      identifier: "JobSettings",
    }),
    ShareStatus: S.optional(S.String).pipe(T.JsonName("shareStatus")),
    SimulateReservedQueue: S.optional(S.String).pipe(
      T.JsonName("simulateReservedQueue"),
    ),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
    StatusUpdateInterval: S.optional(S.String).pipe(
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
export interface JobTemplate {
  AccelerationSettings?: AccelerationSettings;
  Arn?: string;
  Category?: string;
  CreatedAt?: Date;
  Description?: string;
  HopDestinations?: __listOfHopDestination;
  LastUpdated?: Date;
  Name: string;
  Priority?: number;
  Queue?: string;
  Settings: JobTemplateSettings;
  StatusUpdateInterval?: string;
  Type?: string;
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
    Name: S.String.pipe(T.JsonName("name")),
    Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
    Queue: S.optional(S.String).pipe(T.JsonName("queue")),
    Settings: JobTemplateSettings.pipe(T.JsonName("settings")).annotations({
      identifier: "JobTemplateSettings",
    }),
    StatusUpdateInterval: S.optional(S.String).pipe(
      T.JsonName("statusUpdateInterval"),
    ),
    Type: S.optional(S.String).pipe(T.JsonName("type")),
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
  Name: string;
  Settings: PresetSettings;
  Type?: string;
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
    Name: S.String.pipe(T.JsonName("name")),
    Settings: PresetSettings.pipe(T.JsonName("settings")).annotations({
      identifier: "PresetSettings",
    }),
    Type: S.optional(S.String).pipe(T.JsonName("type")),
  }),
).annotations({ identifier: "Preset" }) as any as S.Schema<Preset>;
export type __listOfPreset = Preset[];
export const __listOfPreset = S.Array(Preset);
export interface ReservationPlan {
  Commitment?: string;
  ExpiresAt?: Date;
  PurchasedAt?: Date;
  RenewalType?: string;
  ReservedSlots?: number;
  Status?: string;
}
export const ReservationPlan = S.suspend(() =>
  S.Struct({
    Commitment: S.optional(S.String).pipe(T.JsonName("commitment")),
    ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.JsonName("expiresAt"),
    ),
    PurchasedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.JsonName("purchasedAt")),
    RenewalType: S.optional(S.String).pipe(T.JsonName("renewalType")),
    ReservedSlots: S.optional(S.Number).pipe(T.JsonName("reservedSlots")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
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
  Name: string;
  PricingPlan?: string;
  ProgressingJobsCount?: number;
  ReservationPlan?: ReservationPlan;
  ServiceOverrides?: __listOfServiceOverride;
  Status?: string;
  SubmittedJobsCount?: number;
  Type?: string;
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
    Name: S.String.pipe(T.JsonName("name")),
    PricingPlan: S.optional(S.String).pipe(T.JsonName("pricingPlan")),
    ProgressingJobsCount: S.optional(S.Number).pipe(
      T.JsonName("progressingJobsCount"),
    ),
    ReservationPlan: S.optional(ReservationPlan)
      .pipe(T.JsonName("reservationPlan"))
      .annotations({ identifier: "ReservationPlan" }),
    ServiceOverrides: S.optional(__listOfServiceOverride).pipe(
      T.JsonName("serviceOverrides"),
    ),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
    SubmittedJobsCount: S.optional(S.Number).pipe(
      T.JsonName("submittedJobsCount"),
    ),
    Type: S.optional(S.String).pipe(T.JsonName("type")),
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
  Key?: string;
  Values?: __listOf__stringMax100;
}
export const JobsQueryFilter = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String).pipe(T.JsonName("key")),
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
  Name: string;
  PricingPlan?: string;
  ReservationPlanSettings?: ReservationPlanSettings;
  Status?: string;
  Tags?: __mapOf__string;
}
export const CreateQueueRequest = S.suspend(() =>
  S.Struct({
    ConcurrentJobs: S.optional(S.Number).pipe(T.JsonName("concurrentJobs")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Name: S.String.pipe(T.JsonName("name")),
    PricingPlan: S.optional(S.String).pipe(T.JsonName("pricingPlan")),
    ReservationPlanSettings: S.optional(ReservationPlanSettings)
      .pipe(T.JsonName("reservationPlanSettings"))
      .annotations({ identifier: "ReservationPlanSettings" }),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
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
  Jobs?: __listOfJob;
  NextToken?: string;
  Status?: string;
}
export const GetJobsQueryResultsResponse = S.suspend(() =>
  S.Struct({
    Jobs: S.optional(__listOfJob).pipe(T.JsonName("jobs")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
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
  Jobs?: __listOfJob;
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
  JobTemplates?: __listOfJobTemplate;
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
  Presets?: __listOfPreset;
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
  Queues?: __listOfQueue;
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
  InputFiles?: __listOfProbeInputFile;
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
  Jobs?: __listOfJob;
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
  FilterList?: __listOfJobsQueryFilter;
  MaxResults?: number;
  NextToken?: string;
  Order?: string;
}
export const StartJobsQueryRequest = S.suspend(() =>
  S.Struct({
    FilterList: S.optional(__listOfJobsQueryFilter).pipe(
      T.JsonName("filterList"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Order: S.optional(S.String).pipe(T.JsonName("order")),
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
  JobTemplate?: JobTemplate;
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
  Preset?: Preset;
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
  Queue?: Queue;
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
  Tags?: __mapOf__string;
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
  HopDestinations?: __listOfHopDestination;
  Name: string;
  Priority?: number;
  Queue?: string;
  Settings: JobTemplateSettings;
  StatusUpdateInterval?: string;
  Tags?: __mapOf__string;
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
    Name: S.String.pipe(T.JsonName("name")),
    Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
    Queue: S.optional(S.String).pipe(T.JsonName("queue")),
    Settings: JobTemplateSettings.pipe(T.JsonName("settings")).annotations({
      identifier: "JobTemplateSettings",
    }),
    StatusUpdateInterval: S.optional(S.String).pipe(
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
  Queue?: Queue;
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
  Endpoints?: __listOfEndpoint;
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
  JobTemplate?: JobTemplate;
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
  Preset?: Preset;
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
  Versions?: __listOfJobEngineVersion;
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
export type __listOf__integer = number[];
export const __listOf__integer = S.Array(S.Number);
export interface CreateJobTemplateResponse {
  JobTemplate?: JobTemplate;
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
  Queue?: Queue;
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
  AudioTrackIndexes?: __listOf__integer;
  DataTrackIndexes?: __listOf__integer;
  VideoTrackIndexes?: __listOf__integer;
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
  Name: string;
  Settings: PresetSettings;
  Tags?: __mapOf__string;
}
export const CreatePresetRequest = S.suspend(() =>
  S.Struct({
    Category: S.optional(S.String).pipe(T.JsonName("category")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Name: S.String.pipe(T.JsonName("name")),
    Settings: PresetSettings.pipe(T.JsonName("settings")).annotations({
      identifier: "PresetSettings",
    }),
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
  Job?: Job;
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
  ColorPrimaries?: string;
  Height?: number;
  Level?: string;
  MatrixCoefficients?: string;
  Profile?: string;
  ScanType?: string;
  TransferCharacteristics?: string;
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
    ColorPrimaries: S.optional(S.String).pipe(T.JsonName("colorPrimaries")),
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    Level: S.optional(S.String).pipe(T.JsonName("level")),
    MatrixCoefficients: S.optional(S.String).pipe(
      T.JsonName("matrixCoefficients"),
    ),
    Profile: S.optional(S.String).pipe(T.JsonName("profile")),
    ScanType: S.optional(S.String).pipe(T.JsonName("scanType")),
    TransferCharacteristics: S.optional(S.String).pipe(
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
  ColorPrimaries?: string;
  FrameRate?: FrameRate;
  Height?: number;
  MatrixCoefficients?: string;
  TransferCharacteristics?: string;
  Width?: number;
}
export const VideoProperties = S.suspend(() =>
  S.Struct({
    BitDepth: S.optional(S.Number).pipe(T.JsonName("bitDepth")),
    BitRate: S.optional(S.Number).pipe(T.JsonName("bitRate")),
    CodecMetadata: S.optional(CodecMetadata)
      .pipe(T.JsonName("codecMetadata"))
      .annotations({ identifier: "CodecMetadata" }),
    ColorPrimaries: S.optional(S.String).pipe(T.JsonName("colorPrimaries")),
    FrameRate: S.optional(FrameRate)
      .pipe(T.JsonName("frameRate"))
      .annotations({ identifier: "FrameRate" }),
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    MatrixCoefficients: S.optional(S.String).pipe(
      T.JsonName("matrixCoefficients"),
    ),
    TransferCharacteristics: S.optional(S.String).pipe(
      T.JsonName("transferCharacteristics"),
    ),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
  }),
).annotations({
  identifier: "VideoProperties",
}) as any as S.Schema<VideoProperties>;
export interface Track {
  AudioProperties?: AudioProperties;
  Codec?: string;
  DataProperties?: DataProperties;
  Duration?: number;
  Index?: number;
  TrackType?: string;
  VideoProperties?: VideoProperties;
}
export const Track = S.suspend(() =>
  S.Struct({
    AudioProperties: S.optional(AudioProperties)
      .pipe(T.JsonName("audioProperties"))
      .annotations({ identifier: "AudioProperties" }),
    Codec: S.optional(S.String).pipe(T.JsonName("codec")),
    DataProperties: S.optional(DataProperties)
      .pipe(T.JsonName("dataProperties"))
      .annotations({ identifier: "DataProperties" }),
    Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
    Index: S.optional(S.Number).pipe(T.JsonName("index")),
    TrackType: S.optional(S.String).pipe(T.JsonName("trackType")),
    VideoProperties: S.optional(VideoProperties)
      .pipe(T.JsonName("videoProperties"))
      .annotations({ identifier: "VideoProperties" }),
  }),
).annotations({ identifier: "Track" }) as any as S.Schema<Track>;
export type __listOfTrack = Track[];
export const __listOfTrack = S.Array(Track);
export interface CreatePresetResponse {
  Preset?: Preset;
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
  Format?: string;
  Tracks?: __listOfTrack;
}
export const Container = S.suspend(() =>
  S.Struct({
    Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
    Format: S.optional(S.String).pipe(T.JsonName("format")),
    Tracks: S.optional(__listOfTrack).pipe(T.JsonName("tracks")),
  }),
).annotations({ identifier: "Container" }) as any as S.Schema<Container>;
export interface ProbeResult {
  Container?: Container;
  Metadata?: Metadata;
  TrackMappings?: __listOfTrackMapping;
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
  BillingTagsSource?: string;
  ClientRequestToken?: string;
  HopDestinations?: __listOfHopDestination;
  JobEngineVersion?: string;
  JobTemplate?: string;
  Priority?: number;
  Queue?: string;
  Role: string;
  Settings: JobSettings;
  SimulateReservedQueue?: string;
  StatusUpdateInterval?: string;
  Tags?: __mapOf__string;
  UserMetadata?: __mapOf__string;
}
export const CreateJobRequest = S.suspend(() =>
  S.Struct({
    AccelerationSettings: S.optional(AccelerationSettings)
      .pipe(T.JsonName("accelerationSettings"))
      .annotations({ identifier: "AccelerationSettings" }),
    BillingTagsSource: S.optional(S.String).pipe(
      T.JsonName("billingTagsSource"),
    ),
    ClientRequestToken: S.optional(S.String).pipe(
      T.JsonName("clientRequestToken"),
    ),
    HopDestinations: S.optional(__listOfHopDestination).pipe(
      T.JsonName("hopDestinations"),
    ),
    JobEngineVersion: S.optional(S.String).pipe(T.JsonName("jobEngineVersion")),
    JobTemplate: S.optional(S.String).pipe(T.JsonName("jobTemplate")),
    Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
    Queue: S.optional(S.String).pipe(T.JsonName("queue")),
    Role: S.String.pipe(T.JsonName("role")),
    Settings: JobSettings.pipe(T.JsonName("settings")).annotations({
      identifier: "JobSettings",
    }),
    SimulateReservedQueue: S.optional(S.String).pipe(
      T.JsonName("simulateReservedQueue"),
    ),
    StatusUpdateInterval: S.optional(S.String).pipe(
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
  ProbeResults?: __listOfProbeResult;
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
  Job?: Job;
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
) => Effect.Effect<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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

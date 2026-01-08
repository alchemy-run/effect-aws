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
const svc = T.AwsApiService({ sdkId: "b2bi", serviceShapeName: "B2BI" });
const auth = T.AwsAuthSigv4({ name: "b2bi" });
const ver = T.ServiceVersion("2022-06-23");
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
              `https://b2bi-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://b2bi-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://b2bi.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://b2bi.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type GenerateMappingInputFileContent = string;
export type GenerateMappingOutputFileContent = string;
export type TransformerJobId = string;
export type TransformerId = string;
export type AmazonResourceName = string;
export type TestMappingInputFileContent = string;
export type MappingTemplate = string;
export type TagKey = string;
export type CapabilityName = string;
export type CapabilityId = string;
export type PageToken = string;
export type MaxResults = number;
export type ProfileId = string;
export type PartnerName = string;
export type Email = string | redacted.Redacted<string>;
export type Phone = string | redacted.Redacted<string>;
export type PartnershipId = string;
export type ProfileName = string;
export type BusinessName = string;
export type TransformerName = string;
export type FileLocation = string;
export type BucketName = string;
export type S3Key = string;
export type TagValue = string;
export type ErrorMessage = string;
export type ResourceArn = string;
export type CreatedDate = Date;
export type ModifiedDate = Date;
export type TradingPartnerId = string;
export type LogGroupName = string;
export type X12ValidateEdi = boolean;
export type LineLength = number;
export type ElementId = string;
export type ElementPosition = string;
export type X12IdQualifier = string;
export type X12SenderId = string;
export type X12ReceiverId = string;
export type X12RepetitionSeparator = string;
export type X12AcknowledgmentRequestedCode = string;
export type X12UsageIndicatorCode = string;
export type X12ApplicationSenderCode = string;
export type X12ApplicationReceiverCode = string;
export type X12ResponsibleAgencyCode = string;
export type X12ComponentSeparator = string;
export type X12DataElementSeparator = string;
export type X12SegmentTerminator = string;
export type StartingInterchangeControlNumber = number;
export type StartingFunctionalGroupControlNumber = number;
export type StartingTransactionSetControlNumber = number;

//# Schemas
export type MappingType = "JSONATA" | "XSLT";
export const MappingType = S.Literal("JSONATA", "XSLT");
export type FileFormat = "XML" | "JSON" | "NOT_USED";
export const FileFormat = S.Literal("XML", "JSON", "NOT_USED");
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type CapabilityType = "edi";
export const CapabilityType = S.Literal("edi");
export interface S3Location {
  bucketName?: string;
  key?: string;
}
export const S3Location = S.suspend(() =>
  S.Struct({ bucketName: S.optional(S.String), key: S.optional(S.String) }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export type InstructionsDocuments = S3Location[];
export const InstructionsDocuments = S.Array(S3Location);
export type PartnershipCapabilities = string[];
export const PartnershipCapabilities = S.Array(S.String);
export type Logging = "ENABLED" | "DISABLED";
export const Logging = S.Literal("ENABLED", "DISABLED");
export type TransformerStatus = "active" | "inactive";
export const TransformerStatus = S.Literal("active", "inactive");
export interface GenerateMappingRequest {
  inputFileContent: string;
  outputFileContent: string;
  mappingType: MappingType;
}
export const GenerateMappingRequest = S.suspend(() =>
  S.Struct({
    inputFileContent: S.String,
    outputFileContent: S.String,
    mappingType: MappingType,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/generate-mapping" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GenerateMappingRequest",
}) as any as S.Schema<GenerateMappingRequest>;
export interface GetTransformerJobRequest {
  transformerJobId: string;
  transformerId: string;
}
export const GetTransformerJobRequest = S.suspend(() =>
  S.Struct({
    transformerJobId: S.String.pipe(T.HttpLabel("transformerJobId")),
    transformerId: S.String.pipe(T.HttpQuery("transformerId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/transformer-jobs/{transformerJobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTransformerJobRequest",
}) as any as S.Schema<GetTransformerJobRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String.pipe(T.HttpLabel("ResourceARN")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceARN}" }),
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
export interface StartTransformerJobRequest {
  inputFile: S3Location;
  outputLocation: S3Location;
  transformerId: string;
  clientToken?: string;
}
export const StartTransformerJobRequest = S.suspend(() =>
  S.Struct({
    inputFile: S3Location,
    outputLocation: S3Location,
    transformerId: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/transformer-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartTransformerJobRequest",
}) as any as S.Schema<StartTransformerJobRequest>;
export interface TestMappingRequest {
  inputFileContent: string;
  mappingTemplate: string;
  fileFormat: FileFormat;
}
export const TestMappingRequest = S.suspend(() =>
  S.Struct({
    inputFileContent: S.String,
    mappingTemplate: S.String,
    fileFormat: FileFormat,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/testmapping" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestMappingRequest",
}) as any as S.Schema<TestMappingRequest>;
export interface UntagResourceRequest {
  ResourceARN: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceARN: S.String.pipe(T.HttpLabel("ResourceARN")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("TagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{ResourceARN}" }),
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
export interface GetCapabilityRequest {
  capabilityId: string;
}
export const GetCapabilityRequest = S.suspend(() =>
  S.Struct({ capabilityId: S.String.pipe(T.HttpLabel("capabilityId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/capabilities/{capabilityId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCapabilityRequest",
}) as any as S.Schema<GetCapabilityRequest>;
export type CapabilityDirection = "INBOUND" | "OUTBOUND";
export const CapabilityDirection = S.Literal("INBOUND", "OUTBOUND");
export type X12TransactionSet =
  | "X12_100"
  | "X12_101"
  | "X12_102"
  | "X12_103"
  | "X12_104"
  | "X12_105"
  | "X12_106"
  | "X12_107"
  | "X12_108"
  | "X12_109"
  | "X12_110"
  | "X12_111"
  | "X12_112"
  | "X12_113"
  | "X12_120"
  | "X12_121"
  | "X12_124"
  | "X12_125"
  | "X12_126"
  | "X12_127"
  | "X12_128"
  | "X12_129"
  | "X12_130"
  | "X12_131"
  | "X12_132"
  | "X12_133"
  | "X12_135"
  | "X12_138"
  | "X12_139"
  | "X12_140"
  | "X12_141"
  | "X12_142"
  | "X12_143"
  | "X12_144"
  | "X12_146"
  | "X12_147"
  | "X12_148"
  | "X12_149"
  | "X12_150"
  | "X12_151"
  | "X12_152"
  | "X12_153"
  | "X12_154"
  | "X12_155"
  | "X12_157"
  | "X12_158"
  | "X12_159"
  | "X12_160"
  | "X12_161"
  | "X12_163"
  | "X12_170"
  | "X12_175"
  | "X12_176"
  | "X12_179"
  | "X12_180"
  | "X12_185"
  | "X12_186"
  | "X12_187"
  | "X12_188"
  | "X12_189"
  | "X12_190"
  | "X12_191"
  | "X12_194"
  | "X12_195"
  | "X12_196"
  | "X12_197"
  | "X12_198"
  | "X12_199"
  | "X12_200"
  | "X12_201"
  | "X12_202"
  | "X12_203"
  | "X12_204"
  | "X12_205"
  | "X12_206"
  | "X12_210"
  | "X12_211"
  | "X12_212"
  | "X12_213"
  | "X12_214"
  | "X12_215"
  | "X12_216"
  | "X12_217"
  | "X12_218"
  | "X12_219"
  | "X12_220"
  | "X12_222"
  | "X12_223"
  | "X12_224"
  | "X12_225"
  | "X12_227"
  | "X12_228"
  | "X12_240"
  | "X12_242"
  | "X12_244"
  | "X12_245"
  | "X12_248"
  | "X12_249"
  | "X12_250"
  | "X12_251"
  | "X12_252"
  | "X12_255"
  | "X12_256"
  | "X12_259"
  | "X12_260"
  | "X12_261"
  | "X12_262"
  | "X12_263"
  | "X12_264"
  | "X12_265"
  | "X12_266"
  | "X12_267"
  | "X12_268"
  | "X12_269"
  | "X12_270"
  | "X12_271"
  | "X12_272"
  | "X12_273"
  | "X12_274"
  | "X12_275"
  | "X12_276"
  | "X12_277"
  | "X12_278"
  | "X12_280"
  | "X12_283"
  | "X12_284"
  | "X12_285"
  | "X12_286"
  | "X12_288"
  | "X12_290"
  | "X12_300"
  | "X12_301"
  | "X12_303"
  | "X12_304"
  | "X12_309"
  | "X12_310"
  | "X12_311"
  | "X12_312"
  | "X12_313"
  | "X12_315"
  | "X12_317"
  | "X12_319"
  | "X12_322"
  | "X12_323"
  | "X12_324"
  | "X12_325"
  | "X12_326"
  | "X12_350"
  | "X12_352"
  | "X12_353"
  | "X12_354"
  | "X12_355"
  | "X12_356"
  | "X12_357"
  | "X12_358"
  | "X12_361"
  | "X12_362"
  | "X12_404"
  | "X12_410"
  | "X12_412"
  | "X12_414"
  | "X12_417"
  | "X12_418"
  | "X12_419"
  | "X12_420"
  | "X12_421"
  | "X12_422"
  | "X12_423"
  | "X12_424"
  | "X12_425"
  | "X12_426"
  | "X12_429"
  | "X12_431"
  | "X12_432"
  | "X12_433"
  | "X12_434"
  | "X12_435"
  | "X12_436"
  | "X12_437"
  | "X12_440"
  | "X12_451"
  | "X12_452"
  | "X12_453"
  | "X12_455"
  | "X12_456"
  | "X12_460"
  | "X12_463"
  | "X12_466"
  | "X12_468"
  | "X12_470"
  | "X12_475"
  | "X12_485"
  | "X12_486"
  | "X12_490"
  | "X12_492"
  | "X12_494"
  | "X12_500"
  | "X12_501"
  | "X12_503"
  | "X12_504"
  | "X12_511"
  | "X12_517"
  | "X12_521"
  | "X12_527"
  | "X12_536"
  | "X12_540"
  | "X12_561"
  | "X12_567"
  | "X12_568"
  | "X12_601"
  | "X12_602"
  | "X12_620"
  | "X12_625"
  | "X12_650"
  | "X12_715"
  | "X12_753"
  | "X12_754"
  | "X12_805"
  | "X12_806"
  | "X12_810"
  | "X12_811"
  | "X12_812"
  | "X12_813"
  | "X12_814"
  | "X12_815"
  | "X12_816"
  | "X12_818"
  | "X12_819"
  | "X12_820"
  | "X12_821"
  | "X12_822"
  | "X12_823"
  | "X12_824"
  | "X12_826"
  | "X12_827"
  | "X12_828"
  | "X12_829"
  | "X12_830"
  | "X12_831"
  | "X12_832"
  | "X12_833"
  | "X12_834"
  | "X12_835"
  | "X12_836"
  | "X12_837"
  | "X12_838"
  | "X12_839"
  | "X12_840"
  | "X12_841"
  | "X12_842"
  | "X12_843"
  | "X12_844"
  | "X12_845"
  | "X12_846"
  | "X12_847"
  | "X12_848"
  | "X12_849"
  | "X12_850"
  | "X12_851"
  | "X12_852"
  | "X12_853"
  | "X12_854"
  | "X12_855"
  | "X12_856"
  | "X12_857"
  | "X12_858"
  | "X12_859"
  | "X12_860"
  | "X12_861"
  | "X12_862"
  | "X12_863"
  | "X12_864"
  | "X12_865"
  | "X12_866"
  | "X12_867"
  | "X12_868"
  | "X12_869"
  | "X12_870"
  | "X12_871"
  | "X12_872"
  | "X12_873"
  | "X12_874"
  | "X12_875"
  | "X12_876"
  | "X12_877"
  | "X12_878"
  | "X12_879"
  | "X12_880"
  | "X12_881"
  | "X12_882"
  | "X12_883"
  | "X12_884"
  | "X12_885"
  | "X12_886"
  | "X12_887"
  | "X12_888"
  | "X12_889"
  | "X12_891"
  | "X12_893"
  | "X12_894"
  | "X12_895"
  | "X12_896"
  | "X12_920"
  | "X12_924"
  | "X12_925"
  | "X12_926"
  | "X12_928"
  | "X12_940"
  | "X12_943"
  | "X12_944"
  | "X12_945"
  | "X12_947"
  | "X12_980"
  | "X12_990"
  | "X12_993"
  | "X12_996"
  | "X12_997"
  | "X12_998"
  | "X12_999"
  | "X12_270_X279"
  | "X12_271_X279"
  | "X12_275_X210"
  | "X12_275_X211"
  | "X12_276_X212"
  | "X12_277_X212"
  | "X12_277_X214"
  | "X12_277_X364"
  | "X12_278_X217"
  | "X12_820_X218"
  | "X12_820_X306"
  | "X12_824_X186"
  | "X12_834_X220"
  | "X12_834_X307"
  | "X12_834_X318"
  | "X12_835_X221"
  | "X12_837_X222"
  | "X12_837_X223"
  | "X12_837_X224"
  | "X12_837_X291"
  | "X12_837_X292"
  | "X12_837_X298"
  | "X12_999_X231";
export const X12TransactionSet = S.Literal(
  "X12_100",
  "X12_101",
  "X12_102",
  "X12_103",
  "X12_104",
  "X12_105",
  "X12_106",
  "X12_107",
  "X12_108",
  "X12_109",
  "X12_110",
  "X12_111",
  "X12_112",
  "X12_113",
  "X12_120",
  "X12_121",
  "X12_124",
  "X12_125",
  "X12_126",
  "X12_127",
  "X12_128",
  "X12_129",
  "X12_130",
  "X12_131",
  "X12_132",
  "X12_133",
  "X12_135",
  "X12_138",
  "X12_139",
  "X12_140",
  "X12_141",
  "X12_142",
  "X12_143",
  "X12_144",
  "X12_146",
  "X12_147",
  "X12_148",
  "X12_149",
  "X12_150",
  "X12_151",
  "X12_152",
  "X12_153",
  "X12_154",
  "X12_155",
  "X12_157",
  "X12_158",
  "X12_159",
  "X12_160",
  "X12_161",
  "X12_163",
  "X12_170",
  "X12_175",
  "X12_176",
  "X12_179",
  "X12_180",
  "X12_185",
  "X12_186",
  "X12_187",
  "X12_188",
  "X12_189",
  "X12_190",
  "X12_191",
  "X12_194",
  "X12_195",
  "X12_196",
  "X12_197",
  "X12_198",
  "X12_199",
  "X12_200",
  "X12_201",
  "X12_202",
  "X12_203",
  "X12_204",
  "X12_205",
  "X12_206",
  "X12_210",
  "X12_211",
  "X12_212",
  "X12_213",
  "X12_214",
  "X12_215",
  "X12_216",
  "X12_217",
  "X12_218",
  "X12_219",
  "X12_220",
  "X12_222",
  "X12_223",
  "X12_224",
  "X12_225",
  "X12_227",
  "X12_228",
  "X12_240",
  "X12_242",
  "X12_244",
  "X12_245",
  "X12_248",
  "X12_249",
  "X12_250",
  "X12_251",
  "X12_252",
  "X12_255",
  "X12_256",
  "X12_259",
  "X12_260",
  "X12_261",
  "X12_262",
  "X12_263",
  "X12_264",
  "X12_265",
  "X12_266",
  "X12_267",
  "X12_268",
  "X12_269",
  "X12_270",
  "X12_271",
  "X12_272",
  "X12_273",
  "X12_274",
  "X12_275",
  "X12_276",
  "X12_277",
  "X12_278",
  "X12_280",
  "X12_283",
  "X12_284",
  "X12_285",
  "X12_286",
  "X12_288",
  "X12_290",
  "X12_300",
  "X12_301",
  "X12_303",
  "X12_304",
  "X12_309",
  "X12_310",
  "X12_311",
  "X12_312",
  "X12_313",
  "X12_315",
  "X12_317",
  "X12_319",
  "X12_322",
  "X12_323",
  "X12_324",
  "X12_325",
  "X12_326",
  "X12_350",
  "X12_352",
  "X12_353",
  "X12_354",
  "X12_355",
  "X12_356",
  "X12_357",
  "X12_358",
  "X12_361",
  "X12_362",
  "X12_404",
  "X12_410",
  "X12_412",
  "X12_414",
  "X12_417",
  "X12_418",
  "X12_419",
  "X12_420",
  "X12_421",
  "X12_422",
  "X12_423",
  "X12_424",
  "X12_425",
  "X12_426",
  "X12_429",
  "X12_431",
  "X12_432",
  "X12_433",
  "X12_434",
  "X12_435",
  "X12_436",
  "X12_437",
  "X12_440",
  "X12_451",
  "X12_452",
  "X12_453",
  "X12_455",
  "X12_456",
  "X12_460",
  "X12_463",
  "X12_466",
  "X12_468",
  "X12_470",
  "X12_475",
  "X12_485",
  "X12_486",
  "X12_490",
  "X12_492",
  "X12_494",
  "X12_500",
  "X12_501",
  "X12_503",
  "X12_504",
  "X12_511",
  "X12_517",
  "X12_521",
  "X12_527",
  "X12_536",
  "X12_540",
  "X12_561",
  "X12_567",
  "X12_568",
  "X12_601",
  "X12_602",
  "X12_620",
  "X12_625",
  "X12_650",
  "X12_715",
  "X12_753",
  "X12_754",
  "X12_805",
  "X12_806",
  "X12_810",
  "X12_811",
  "X12_812",
  "X12_813",
  "X12_814",
  "X12_815",
  "X12_816",
  "X12_818",
  "X12_819",
  "X12_820",
  "X12_821",
  "X12_822",
  "X12_823",
  "X12_824",
  "X12_826",
  "X12_827",
  "X12_828",
  "X12_829",
  "X12_830",
  "X12_831",
  "X12_832",
  "X12_833",
  "X12_834",
  "X12_835",
  "X12_836",
  "X12_837",
  "X12_838",
  "X12_839",
  "X12_840",
  "X12_841",
  "X12_842",
  "X12_843",
  "X12_844",
  "X12_845",
  "X12_846",
  "X12_847",
  "X12_848",
  "X12_849",
  "X12_850",
  "X12_851",
  "X12_852",
  "X12_853",
  "X12_854",
  "X12_855",
  "X12_856",
  "X12_857",
  "X12_858",
  "X12_859",
  "X12_860",
  "X12_861",
  "X12_862",
  "X12_863",
  "X12_864",
  "X12_865",
  "X12_866",
  "X12_867",
  "X12_868",
  "X12_869",
  "X12_870",
  "X12_871",
  "X12_872",
  "X12_873",
  "X12_874",
  "X12_875",
  "X12_876",
  "X12_877",
  "X12_878",
  "X12_879",
  "X12_880",
  "X12_881",
  "X12_882",
  "X12_883",
  "X12_884",
  "X12_885",
  "X12_886",
  "X12_887",
  "X12_888",
  "X12_889",
  "X12_891",
  "X12_893",
  "X12_894",
  "X12_895",
  "X12_896",
  "X12_920",
  "X12_924",
  "X12_925",
  "X12_926",
  "X12_928",
  "X12_940",
  "X12_943",
  "X12_944",
  "X12_945",
  "X12_947",
  "X12_980",
  "X12_990",
  "X12_993",
  "X12_996",
  "X12_997",
  "X12_998",
  "X12_999",
  "X12_270_X279",
  "X12_271_X279",
  "X12_275_X210",
  "X12_275_X211",
  "X12_276_X212",
  "X12_277_X212",
  "X12_277_X214",
  "X12_277_X364",
  "X12_278_X217",
  "X12_820_X218",
  "X12_820_X306",
  "X12_824_X186",
  "X12_834_X220",
  "X12_834_X307",
  "X12_834_X318",
  "X12_835_X221",
  "X12_837_X222",
  "X12_837_X223",
  "X12_837_X224",
  "X12_837_X291",
  "X12_837_X292",
  "X12_837_X298",
  "X12_999_X231",
);
export type X12Version =
  | "VERSION_4010"
  | "VERSION_4030"
  | "VERSION_4050"
  | "VERSION_4060"
  | "VERSION_5010"
  | "VERSION_5010_HIPAA";
export const X12Version = S.Literal(
  "VERSION_4010",
  "VERSION_4030",
  "VERSION_4050",
  "VERSION_4060",
  "VERSION_5010",
  "VERSION_5010_HIPAA",
);
export interface X12Details {
  transactionSet?: X12TransactionSet;
  version?: X12Version;
}
export const X12Details = S.suspend(() =>
  S.Struct({
    transactionSet: S.optional(X12TransactionSet),
    version: S.optional(X12Version),
  }),
).annotations({ identifier: "X12Details" }) as any as S.Schema<X12Details>;
export type EdiType = { x12Details: X12Details };
export const EdiType = S.Union(S.Struct({ x12Details: X12Details }));
export interface EdiConfiguration {
  capabilityDirection?: CapabilityDirection;
  type: EdiType;
  inputLocation: S3Location;
  outputLocation: S3Location;
  transformerId: string;
}
export const EdiConfiguration = S.suspend(() =>
  S.Struct({
    capabilityDirection: S.optional(CapabilityDirection),
    type: EdiType,
    inputLocation: S3Location,
    outputLocation: S3Location,
    transformerId: S.String,
  }),
).annotations({
  identifier: "EdiConfiguration",
}) as any as S.Schema<EdiConfiguration>;
export type CapabilityConfiguration = { edi: EdiConfiguration };
export const CapabilityConfiguration = S.Union(
  S.Struct({ edi: EdiConfiguration }),
);
export interface UpdateCapabilityRequest {
  capabilityId: string;
  name?: string;
  configuration?: CapabilityConfiguration;
  instructionsDocuments?: S3Location[];
}
export const UpdateCapabilityRequest = S.suspend(() =>
  S.Struct({
    capabilityId: S.String.pipe(T.HttpLabel("capabilityId")),
    name: S.optional(S.String),
    configuration: S.optional(CapabilityConfiguration),
    instructionsDocuments: S.optional(InstructionsDocuments),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/capabilities/{capabilityId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCapabilityRequest",
}) as any as S.Schema<UpdateCapabilityRequest>;
export interface DeleteCapabilityRequest {
  capabilityId: string;
}
export const DeleteCapabilityRequest = S.suspend(() =>
  S.Struct({ capabilityId: S.String.pipe(T.HttpLabel("capabilityId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/capabilities/{capabilityId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCapabilityRequest",
}) as any as S.Schema<DeleteCapabilityRequest>;
export interface DeleteCapabilityResponse {}
export const DeleteCapabilityResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCapabilityResponse",
}) as any as S.Schema<DeleteCapabilityResponse>;
export interface ListCapabilitiesRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListCapabilitiesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/capabilities" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCapabilitiesRequest",
}) as any as S.Schema<ListCapabilitiesRequest>;
export interface GetPartnershipRequest {
  partnershipId: string;
}
export const GetPartnershipRequest = S.suspend(() =>
  S.Struct({ partnershipId: S.String.pipe(T.HttpLabel("partnershipId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/partnerships/{partnershipId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPartnershipRequest",
}) as any as S.Schema<GetPartnershipRequest>;
export interface X12InterchangeControlHeaders {
  senderIdQualifier?: string;
  senderId?: string;
  receiverIdQualifier?: string;
  receiverId?: string;
  repetitionSeparator?: string;
  acknowledgmentRequestedCode?: string;
  usageIndicatorCode?: string;
}
export const X12InterchangeControlHeaders = S.suspend(() =>
  S.Struct({
    senderIdQualifier: S.optional(S.String),
    senderId: S.optional(S.String),
    receiverIdQualifier: S.optional(S.String),
    receiverId: S.optional(S.String),
    repetitionSeparator: S.optional(S.String),
    acknowledgmentRequestedCode: S.optional(S.String),
    usageIndicatorCode: S.optional(S.String),
  }),
).annotations({
  identifier: "X12InterchangeControlHeaders",
}) as any as S.Schema<X12InterchangeControlHeaders>;
export interface X12FunctionalGroupHeaders {
  applicationSenderCode?: string;
  applicationReceiverCode?: string;
  responsibleAgencyCode?: string;
}
export const X12FunctionalGroupHeaders = S.suspend(() =>
  S.Struct({
    applicationSenderCode: S.optional(S.String),
    applicationReceiverCode: S.optional(S.String),
    responsibleAgencyCode: S.optional(S.String),
  }),
).annotations({
  identifier: "X12FunctionalGroupHeaders",
}) as any as S.Schema<X12FunctionalGroupHeaders>;
export interface X12Delimiters {
  componentSeparator?: string;
  dataElementSeparator?: string;
  segmentTerminator?: string;
}
export const X12Delimiters = S.suspend(() =>
  S.Struct({
    componentSeparator: S.optional(S.String),
    dataElementSeparator: S.optional(S.String),
    segmentTerminator: S.optional(S.String),
  }),
).annotations({
  identifier: "X12Delimiters",
}) as any as S.Schema<X12Delimiters>;
export interface X12ControlNumbers {
  startingInterchangeControlNumber?: number;
  startingFunctionalGroupControlNumber?: number;
  startingTransactionSetControlNumber?: number;
}
export const X12ControlNumbers = S.suspend(() =>
  S.Struct({
    startingInterchangeControlNumber: S.optional(S.Number),
    startingFunctionalGroupControlNumber: S.optional(S.Number),
    startingTransactionSetControlNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "X12ControlNumbers",
}) as any as S.Schema<X12ControlNumbers>;
export type X12GS05TimeFormat = "HHMM" | "HHMMSS" | "HHMMSSDD";
export const X12GS05TimeFormat = S.Literal("HHMM", "HHMMSS", "HHMMSSDD");
export interface X12OutboundEdiHeaders {
  interchangeControlHeaders?: X12InterchangeControlHeaders;
  functionalGroupHeaders?: X12FunctionalGroupHeaders;
  delimiters?: X12Delimiters;
  validateEdi?: boolean;
  controlNumbers?: X12ControlNumbers;
  gs05TimeFormat?: X12GS05TimeFormat;
}
export const X12OutboundEdiHeaders = S.suspend(() =>
  S.Struct({
    interchangeControlHeaders: S.optional(X12InterchangeControlHeaders),
    functionalGroupHeaders: S.optional(X12FunctionalGroupHeaders),
    delimiters: S.optional(X12Delimiters),
    validateEdi: S.optional(S.Boolean),
    controlNumbers: S.optional(X12ControlNumbers),
    gs05TimeFormat: S.optional(X12GS05TimeFormat),
  }),
).annotations({
  identifier: "X12OutboundEdiHeaders",
}) as any as S.Schema<X12OutboundEdiHeaders>;
export type WrapFormat = "SEGMENT" | "ONE_LINE" | "LINE_LENGTH";
export const WrapFormat = S.Literal("SEGMENT", "ONE_LINE", "LINE_LENGTH");
export type LineTerminator = "CRLF" | "LF" | "CR";
export const LineTerminator = S.Literal("CRLF", "LF", "CR");
export interface WrapOptions {
  wrapBy: WrapFormat;
  lineTerminator?: LineTerminator;
  lineLength?: number;
}
export const WrapOptions = S.suspend(() =>
  S.Struct({
    wrapBy: WrapFormat,
    lineTerminator: S.optional(LineTerminator),
    lineLength: S.optional(S.Number),
  }),
).annotations({ identifier: "WrapOptions" }) as any as S.Schema<WrapOptions>;
export interface X12Envelope {
  common?: X12OutboundEdiHeaders;
  wrapOptions?: WrapOptions;
}
export const X12Envelope = S.suspend(() =>
  S.Struct({
    common: S.optional(X12OutboundEdiHeaders),
    wrapOptions: S.optional(WrapOptions),
  }),
).annotations({ identifier: "X12Envelope" }) as any as S.Schema<X12Envelope>;
export type OutboundEdiOptions = { x12: X12Envelope };
export const OutboundEdiOptions = S.Union(S.Struct({ x12: X12Envelope }));
export type X12FunctionalAcknowledgment =
  | "DO_NOT_GENERATE"
  | "GENERATE_ALL_SEGMENTS"
  | "GENERATE_WITHOUT_TRANSACTION_SET_RESPONSE_LOOP";
export const X12FunctionalAcknowledgment = S.Literal(
  "DO_NOT_GENERATE",
  "GENERATE_ALL_SEGMENTS",
  "GENERATE_WITHOUT_TRANSACTION_SET_RESPONSE_LOOP",
);
export type X12TechnicalAcknowledgment =
  | "DO_NOT_GENERATE"
  | "GENERATE_ALL_SEGMENTS";
export const X12TechnicalAcknowledgment = S.Literal(
  "DO_NOT_GENERATE",
  "GENERATE_ALL_SEGMENTS",
);
export interface X12AcknowledgmentOptions {
  functionalAcknowledgment: X12FunctionalAcknowledgment;
  technicalAcknowledgment: X12TechnicalAcknowledgment;
}
export const X12AcknowledgmentOptions = S.suspend(() =>
  S.Struct({
    functionalAcknowledgment: X12FunctionalAcknowledgment,
    technicalAcknowledgment: X12TechnicalAcknowledgment,
  }),
).annotations({
  identifier: "X12AcknowledgmentOptions",
}) as any as S.Schema<X12AcknowledgmentOptions>;
export interface X12InboundEdiOptions {
  acknowledgmentOptions?: X12AcknowledgmentOptions;
}
export const X12InboundEdiOptions = S.suspend(() =>
  S.Struct({ acknowledgmentOptions: S.optional(X12AcknowledgmentOptions) }),
).annotations({
  identifier: "X12InboundEdiOptions",
}) as any as S.Schema<X12InboundEdiOptions>;
export interface InboundEdiOptions {
  x12?: X12InboundEdiOptions;
}
export const InboundEdiOptions = S.suspend(() =>
  S.Struct({ x12: S.optional(X12InboundEdiOptions) }),
).annotations({
  identifier: "InboundEdiOptions",
}) as any as S.Schema<InboundEdiOptions>;
export interface CapabilityOptions {
  outboundEdi?: OutboundEdiOptions;
  inboundEdi?: InboundEdiOptions;
}
export const CapabilityOptions = S.suspend(() =>
  S.Struct({
    outboundEdi: S.optional(OutboundEdiOptions),
    inboundEdi: S.optional(InboundEdiOptions),
  }),
).annotations({
  identifier: "CapabilityOptions",
}) as any as S.Schema<CapabilityOptions>;
export interface UpdatePartnershipRequest {
  partnershipId: string;
  name?: string;
  capabilities?: string[];
  capabilityOptions?: CapabilityOptions;
}
export const UpdatePartnershipRequest = S.suspend(() =>
  S.Struct({
    partnershipId: S.String.pipe(T.HttpLabel("partnershipId")),
    name: S.optional(S.String),
    capabilities: S.optional(PartnershipCapabilities),
    capabilityOptions: S.optional(CapabilityOptions),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/partnerships/{partnershipId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePartnershipRequest",
}) as any as S.Schema<UpdatePartnershipRequest>;
export interface DeletePartnershipRequest {
  partnershipId: string;
}
export const DeletePartnershipRequest = S.suspend(() =>
  S.Struct({ partnershipId: S.String.pipe(T.HttpLabel("partnershipId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/partnerships/{partnershipId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePartnershipRequest",
}) as any as S.Schema<DeletePartnershipRequest>;
export interface DeletePartnershipResponse {}
export const DeletePartnershipResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePartnershipResponse",
}) as any as S.Schema<DeletePartnershipResponse>;
export interface ListPartnershipsRequest {
  profileId?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListPartnershipsRequest = S.suspend(() =>
  S.Struct({
    profileId: S.optional(S.String).pipe(T.HttpQuery("profileId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/partnerships" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPartnershipsRequest",
}) as any as S.Schema<ListPartnershipsRequest>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateProfileRequest {
  name: string;
  email?: string | redacted.Redacted<string>;
  phone: string | redacted.Redacted<string>;
  businessName: string;
  logging: Logging;
  clientToken?: string;
  tags?: Tag[];
}
export const CreateProfileRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    email: S.optional(SensitiveString),
    phone: SensitiveString,
    businessName: S.String,
    logging: Logging,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProfileRequest",
}) as any as S.Schema<CreateProfileRequest>;
export interface GetProfileRequest {
  profileId: string;
}
export const GetProfileRequest = S.suspend(() =>
  S.Struct({ profileId: S.String.pipe(T.HttpLabel("profileId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/profiles/{profileId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProfileRequest",
}) as any as S.Schema<GetProfileRequest>;
export interface UpdateProfileRequest {
  profileId: string;
  name?: string;
  email?: string | redacted.Redacted<string>;
  phone?: string | redacted.Redacted<string>;
  businessName?: string;
}
export const UpdateProfileRequest = S.suspend(() =>
  S.Struct({
    profileId: S.String.pipe(T.HttpLabel("profileId")),
    name: S.optional(S.String),
    email: S.optional(SensitiveString),
    phone: S.optional(SensitiveString),
    businessName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/profiles/{profileId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProfileRequest",
}) as any as S.Schema<UpdateProfileRequest>;
export interface DeleteProfileRequest {
  profileId: string;
}
export const DeleteProfileRequest = S.suspend(() =>
  S.Struct({ profileId: S.String.pipe(T.HttpLabel("profileId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/profiles/{profileId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProfileRequest",
}) as any as S.Schema<DeleteProfileRequest>;
export interface DeleteProfileResponse {}
export const DeleteProfileResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteProfileResponse",
}) as any as S.Schema<DeleteProfileResponse>;
export interface ListProfilesRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListProfilesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProfilesRequest",
}) as any as S.Schema<ListProfilesRequest>;
export interface GetTransformerRequest {
  transformerId: string;
}
export const GetTransformerRequest = S.suspend(() =>
  S.Struct({ transformerId: S.String.pipe(T.HttpLabel("transformerId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/transformers/{transformerId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTransformerRequest",
}) as any as S.Schema<GetTransformerRequest>;
export type FromFormat = "X12";
export const FromFormat = S.Literal("X12");
export type FormatOptions = { x12: X12Details };
export const FormatOptions = S.Union(S.Struct({ x12: X12Details }));
export type X12SplitBy = "NONE" | "TRANSACTION";
export const X12SplitBy = S.Literal("NONE", "TRANSACTION");
export interface X12SplitOptions {
  splitBy: X12SplitBy;
}
export const X12SplitOptions = S.suspend(() =>
  S.Struct({ splitBy: X12SplitBy }),
).annotations({
  identifier: "X12SplitOptions",
}) as any as S.Schema<X12SplitOptions>;
export type CodeList = string[];
export const CodeList = S.Array(S.String);
export interface X12CodeListValidationRule {
  elementId: string;
  codesToAdd?: string[];
  codesToRemove?: string[];
}
export const X12CodeListValidationRule = S.suspend(() =>
  S.Struct({
    elementId: S.String,
    codesToAdd: S.optional(CodeList),
    codesToRemove: S.optional(CodeList),
  }),
).annotations({
  identifier: "X12CodeListValidationRule",
}) as any as S.Schema<X12CodeListValidationRule>;
export interface X12ElementLengthValidationRule {
  elementId: string;
  maxLength: number;
  minLength: number;
}
export const X12ElementLengthValidationRule = S.suspend(() =>
  S.Struct({ elementId: S.String, maxLength: S.Number, minLength: S.Number }),
).annotations({
  identifier: "X12ElementLengthValidationRule",
}) as any as S.Schema<X12ElementLengthValidationRule>;
export type ElementRequirement = "OPTIONAL" | "MANDATORY";
export const ElementRequirement = S.Literal("OPTIONAL", "MANDATORY");
export interface X12ElementRequirementValidationRule {
  elementPosition: string;
  requirement: ElementRequirement;
}
export const X12ElementRequirementValidationRule = S.suspend(() =>
  S.Struct({ elementPosition: S.String, requirement: ElementRequirement }),
).annotations({
  identifier: "X12ElementRequirementValidationRule",
}) as any as S.Schema<X12ElementRequirementValidationRule>;
export type X12ValidationRule =
  | { codeListValidationRule: X12CodeListValidationRule }
  | { elementLengthValidationRule: X12ElementLengthValidationRule }
  | { elementRequirementValidationRule: X12ElementRequirementValidationRule };
export const X12ValidationRule = S.Union(
  S.Struct({ codeListValidationRule: X12CodeListValidationRule }),
  S.Struct({ elementLengthValidationRule: X12ElementLengthValidationRule }),
  S.Struct({
    elementRequirementValidationRule: X12ElementRequirementValidationRule,
  }),
);
export type X12ValidationRules = X12ValidationRule[];
export const X12ValidationRules = S.Array(X12ValidationRule);
export interface X12ValidationOptions {
  validationRules?: X12ValidationRule[];
}
export const X12ValidationOptions = S.suspend(() =>
  S.Struct({ validationRules: S.optional(X12ValidationRules) }),
).annotations({
  identifier: "X12ValidationOptions",
}) as any as S.Schema<X12ValidationOptions>;
export interface X12AdvancedOptions {
  splitOptions?: X12SplitOptions;
  validationOptions?: X12ValidationOptions;
}
export const X12AdvancedOptions = S.suspend(() =>
  S.Struct({
    splitOptions: S.optional(X12SplitOptions),
    validationOptions: S.optional(X12ValidationOptions),
  }),
).annotations({
  identifier: "X12AdvancedOptions",
}) as any as S.Schema<X12AdvancedOptions>;
export interface AdvancedOptions {
  x12?: X12AdvancedOptions;
}
export const AdvancedOptions = S.suspend(() =>
  S.Struct({ x12: S.optional(X12AdvancedOptions) }),
).annotations({
  identifier: "AdvancedOptions",
}) as any as S.Schema<AdvancedOptions>;
export interface InputConversion {
  fromFormat: FromFormat;
  formatOptions?: FormatOptions;
  advancedOptions?: AdvancedOptions;
}
export const InputConversion = S.suspend(() =>
  S.Struct({
    fromFormat: FromFormat,
    formatOptions: S.optional(FormatOptions),
    advancedOptions: S.optional(AdvancedOptions),
  }),
).annotations({
  identifier: "InputConversion",
}) as any as S.Schema<InputConversion>;
export type MappingTemplateLanguage = "XSLT" | "JSONATA";
export const MappingTemplateLanguage = S.Literal("XSLT", "JSONATA");
export interface Mapping {
  templateLanguage: MappingTemplateLanguage;
  template?: string;
}
export const Mapping = S.suspend(() =>
  S.Struct({
    templateLanguage: MappingTemplateLanguage,
    template: S.optional(S.String),
  }),
).annotations({ identifier: "Mapping" }) as any as S.Schema<Mapping>;
export type ToFormat = "X12";
export const ToFormat = S.Literal("X12");
export interface OutputConversion {
  toFormat: ToFormat;
  formatOptions?: FormatOptions;
  advancedOptions?: AdvancedOptions;
}
export const OutputConversion = S.suspend(() =>
  S.Struct({
    toFormat: ToFormat,
    formatOptions: S.optional(FormatOptions),
    advancedOptions: S.optional(AdvancedOptions),
  }),
).annotations({
  identifier: "OutputConversion",
}) as any as S.Schema<OutputConversion>;
export interface SampleDocumentKeys {
  input?: string;
  output?: string;
}
export const SampleDocumentKeys = S.suspend(() =>
  S.Struct({ input: S.optional(S.String), output: S.optional(S.String) }),
).annotations({
  identifier: "SampleDocumentKeys",
}) as any as S.Schema<SampleDocumentKeys>;
export type KeyList = SampleDocumentKeys[];
export const KeyList = S.Array(SampleDocumentKeys);
export interface SampleDocuments {
  bucketName: string;
  keys: SampleDocumentKeys[];
}
export const SampleDocuments = S.suspend(() =>
  S.Struct({ bucketName: S.String, keys: KeyList }),
).annotations({
  identifier: "SampleDocuments",
}) as any as S.Schema<SampleDocuments>;
export interface UpdateTransformerRequest {
  transformerId: string;
  name?: string;
  status?: TransformerStatus;
  fileFormat?: FileFormat;
  mappingTemplate?: string;
  ediType?: EdiType;
  sampleDocument?: string;
  inputConversion?: InputConversion;
  mapping?: Mapping;
  outputConversion?: OutputConversion;
  sampleDocuments?: SampleDocuments;
}
export const UpdateTransformerRequest = S.suspend(() =>
  S.Struct({
    transformerId: S.String.pipe(T.HttpLabel("transformerId")),
    name: S.optional(S.String),
    status: S.optional(TransformerStatus),
    fileFormat: S.optional(FileFormat),
    mappingTemplate: S.optional(S.String),
    ediType: S.optional(EdiType),
    sampleDocument: S.optional(S.String),
    inputConversion: S.optional(InputConversion),
    mapping: S.optional(Mapping),
    outputConversion: S.optional(OutputConversion),
    sampleDocuments: S.optional(SampleDocuments),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/transformers/{transformerId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTransformerRequest",
}) as any as S.Schema<UpdateTransformerRequest>;
export interface DeleteTransformerRequest {
  transformerId: string;
}
export const DeleteTransformerRequest = S.suspend(() =>
  S.Struct({ transformerId: S.String.pipe(T.HttpLabel("transformerId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/transformers/{transformerId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTransformerRequest",
}) as any as S.Schema<DeleteTransformerRequest>;
export interface DeleteTransformerResponse {}
export const DeleteTransformerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTransformerResponse",
}) as any as S.Schema<DeleteTransformerResponse>;
export interface ListTransformersRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListTransformersRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/transformers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTransformersRequest",
}) as any as S.Schema<ListTransformersRequest>;
export type ConversionSourceFormat = "JSON" | "XML";
export const ConversionSourceFormat = S.Literal("JSON", "XML");
export type ConversionTargetFormat = "X12";
export const ConversionTargetFormat = S.Literal("X12");
export type TransformerJobStatus = "running" | "succeeded" | "failed";
export const TransformerJobStatus = S.Literal("running", "succeeded", "failed");
export type S3LocationList = S3Location[];
export const S3LocationList = S.Array(S3Location);
export interface GenerateMappingResponse {
  mappingTemplate: string;
  mappingAccuracy?: number;
}
export const GenerateMappingResponse = S.suspend(() =>
  S.Struct({
    mappingTemplate: S.String,
    mappingAccuracy: S.optional(S.Number),
  }),
).annotations({
  identifier: "GenerateMappingResponse",
}) as any as S.Schema<GenerateMappingResponse>;
export interface GetTransformerJobResponse {
  status: TransformerJobStatus;
  outputFiles?: S3Location[];
  message?: string;
}
export const GetTransformerJobResponse = S.suspend(() =>
  S.Struct({
    status: TransformerJobStatus,
    outputFiles: S.optional(S3LocationList),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTransformerJobResponse",
}) as any as S.Schema<GetTransformerJobResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface StartTransformerJobResponse {
  transformerJobId: string;
}
export const StartTransformerJobResponse = S.suspend(() =>
  S.Struct({ transformerJobId: S.String }),
).annotations({
  identifier: "StartTransformerJobResponse",
}) as any as S.Schema<StartTransformerJobResponse>;
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceARN: S.String.pipe(T.HttpLabel("ResourceARN")),
    Tags: TagList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{ResourceARN}" }),
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
export interface TestMappingResponse {
  mappedFileContent: string;
}
export const TestMappingResponse = S.suspend(() =>
  S.Struct({ mappedFileContent: S.String }),
).annotations({
  identifier: "TestMappingResponse",
}) as any as S.Schema<TestMappingResponse>;
export interface GetCapabilityResponse {
  capabilityId: string;
  capabilityArn: string;
  name: string;
  type: CapabilityType;
  configuration: CapabilityConfiguration;
  instructionsDocuments?: S3Location[];
  createdAt: Date;
  modifiedAt?: Date;
}
export const GetCapabilityResponse = S.suspend(() =>
  S.Struct({
    capabilityId: S.String,
    capabilityArn: S.String,
    name: S.String,
    type: CapabilityType,
    configuration: CapabilityConfiguration,
    instructionsDocuments: S.optional(InstructionsDocuments),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetCapabilityResponse",
}) as any as S.Schema<GetCapabilityResponse>;
export interface UpdateCapabilityResponse {
  capabilityId: string;
  capabilityArn: string;
  name: string;
  type: CapabilityType;
  configuration: CapabilityConfiguration;
  instructionsDocuments?: S3Location[];
  createdAt: Date;
  modifiedAt?: Date;
}
export const UpdateCapabilityResponse = S.suspend(() =>
  S.Struct({
    capabilityId: S.String,
    capabilityArn: S.String,
    name: S.String,
    type: CapabilityType,
    configuration: CapabilityConfiguration,
    instructionsDocuments: S.optional(InstructionsDocuments),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "UpdateCapabilityResponse",
}) as any as S.Schema<UpdateCapabilityResponse>;
export interface GetPartnershipResponse {
  profileId: string;
  partnershipId: string;
  partnershipArn: string;
  name?: string;
  email?: string | redacted.Redacted<string>;
  phone?: string | redacted.Redacted<string>;
  capabilities?: string[];
  capabilityOptions?: CapabilityOptions;
  tradingPartnerId?: string;
  createdAt: Date;
  modifiedAt?: Date;
}
export const GetPartnershipResponse = S.suspend(() =>
  S.Struct({
    profileId: S.String,
    partnershipId: S.String,
    partnershipArn: S.String,
    name: S.optional(S.String),
    email: S.optional(SensitiveString),
    phone: S.optional(SensitiveString),
    capabilities: S.optional(PartnershipCapabilities),
    capabilityOptions: S.optional(CapabilityOptions),
    tradingPartnerId: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetPartnershipResponse",
}) as any as S.Schema<GetPartnershipResponse>;
export interface UpdatePartnershipResponse {
  profileId: string;
  partnershipId: string;
  partnershipArn: string;
  name?: string;
  email?: string | redacted.Redacted<string>;
  phone?: string | redacted.Redacted<string>;
  capabilities?: string[];
  capabilityOptions?: CapabilityOptions;
  tradingPartnerId?: string;
  createdAt: Date;
  modifiedAt?: Date;
}
export const UpdatePartnershipResponse = S.suspend(() =>
  S.Struct({
    profileId: S.String,
    partnershipId: S.String,
    partnershipArn: S.String,
    name: S.optional(S.String),
    email: S.optional(SensitiveString),
    phone: S.optional(SensitiveString),
    capabilities: S.optional(PartnershipCapabilities),
    capabilityOptions: S.optional(CapabilityOptions),
    tradingPartnerId: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "UpdatePartnershipResponse",
}) as any as S.Schema<UpdatePartnershipResponse>;
export interface CreateProfileResponse {
  profileId: string;
  profileArn: string;
  name: string;
  businessName: string;
  phone: string | redacted.Redacted<string>;
  email?: string | redacted.Redacted<string>;
  logging?: Logging;
  logGroupName?: string;
  createdAt: Date;
}
export const CreateProfileResponse = S.suspend(() =>
  S.Struct({
    profileId: S.String,
    profileArn: S.String,
    name: S.String,
    businessName: S.String,
    phone: SensitiveString,
    email: S.optional(SensitiveString),
    logging: S.optional(Logging),
    logGroupName: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreateProfileResponse",
}) as any as S.Schema<CreateProfileResponse>;
export interface GetProfileResponse {
  profileId: string;
  profileArn: string;
  name: string;
  email?: string | redacted.Redacted<string>;
  phone: string | redacted.Redacted<string>;
  businessName: string;
  logging?: Logging;
  logGroupName?: string;
  createdAt: Date;
  modifiedAt?: Date;
}
export const GetProfileResponse = S.suspend(() =>
  S.Struct({
    profileId: S.String,
    profileArn: S.String,
    name: S.String,
    email: S.optional(SensitiveString),
    phone: SensitiveString,
    businessName: S.String,
    logging: S.optional(Logging),
    logGroupName: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetProfileResponse",
}) as any as S.Schema<GetProfileResponse>;
export interface UpdateProfileResponse {
  profileId: string;
  profileArn: string;
  name: string;
  email?: string | redacted.Redacted<string>;
  phone: string | redacted.Redacted<string>;
  businessName: string;
  logging?: Logging;
  logGroupName?: string;
  createdAt: Date;
  modifiedAt?: Date;
}
export const UpdateProfileResponse = S.suspend(() =>
  S.Struct({
    profileId: S.String,
    profileArn: S.String,
    name: S.String,
    email: S.optional(SensitiveString),
    phone: SensitiveString,
    businessName: S.String,
    logging: S.optional(Logging),
    logGroupName: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "UpdateProfileResponse",
}) as any as S.Schema<UpdateProfileResponse>;
export interface GetTransformerResponse {
  transformerId: string;
  transformerArn: string;
  name: string;
  status: TransformerStatus;
  createdAt: Date;
  modifiedAt?: Date;
  fileFormat?: FileFormat;
  mappingTemplate?: string;
  ediType?: EdiType;
  sampleDocument?: string;
  inputConversion?: InputConversion;
  mapping?: Mapping;
  outputConversion?: OutputConversion;
  sampleDocuments?: SampleDocuments;
}
export const GetTransformerResponse = S.suspend(() =>
  S.Struct({
    transformerId: S.String,
    transformerArn: S.String,
    name: S.String,
    status: TransformerStatus,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    fileFormat: S.optional(FileFormat),
    mappingTemplate: S.optional(S.String),
    ediType: S.optional(EdiType),
    sampleDocument: S.optional(S.String),
    inputConversion: S.optional(InputConversion),
    mapping: S.optional(Mapping),
    outputConversion: S.optional(OutputConversion),
    sampleDocuments: S.optional(SampleDocuments),
  }),
).annotations({
  identifier: "GetTransformerResponse",
}) as any as S.Schema<GetTransformerResponse>;
export interface UpdateTransformerResponse {
  transformerId: string;
  transformerArn: string;
  name: string;
  status: TransformerStatus;
  createdAt: Date;
  modifiedAt: Date;
  fileFormat?: FileFormat;
  mappingTemplate?: string;
  ediType?: EdiType;
  sampleDocument?: string;
  inputConversion?: InputConversion;
  mapping?: Mapping;
  outputConversion?: OutputConversion;
  sampleDocuments?: SampleDocuments;
}
export const UpdateTransformerResponse = S.suspend(() =>
  S.Struct({
    transformerId: S.String,
    transformerArn: S.String,
    name: S.String,
    status: TransformerStatus,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    fileFormat: S.optional(FileFormat),
    mappingTemplate: S.optional(S.String),
    ediType: S.optional(EdiType),
    sampleDocument: S.optional(S.String),
    inputConversion: S.optional(InputConversion),
    mapping: S.optional(Mapping),
    outputConversion: S.optional(OutputConversion),
    sampleDocuments: S.optional(SampleDocuments),
  }),
).annotations({
  identifier: "UpdateTransformerResponse",
}) as any as S.Schema<UpdateTransformerResponse>;
export type InputFileSource = { fileContent: string };
export const InputFileSource = S.Union(S.Struct({ fileContent: S.String }));
export type ConversionTargetFormatDetails = { x12: X12Details };
export const ConversionTargetFormatDetails = S.Union(
  S.Struct({ x12: X12Details }),
);
export type OutputSampleFileSource = { fileLocation: S3Location };
export const OutputSampleFileSource = S.Union(
  S.Struct({ fileLocation: S3Location }),
);
export type TemplateDetails = { x12: X12Details };
export const TemplateDetails = S.Union(S.Struct({ x12: X12Details }));
export interface ConversionSource {
  fileFormat: ConversionSourceFormat;
  inputFile: InputFileSource;
}
export const ConversionSource = S.suspend(() =>
  S.Struct({ fileFormat: ConversionSourceFormat, inputFile: InputFileSource }),
).annotations({
  identifier: "ConversionSource",
}) as any as S.Schema<ConversionSource>;
export interface ConversionTarget {
  fileFormat: ConversionTargetFormat;
  formatDetails?: ConversionTargetFormatDetails;
  outputSampleFile?: OutputSampleFileSource;
  advancedOptions?: AdvancedOptions;
}
export const ConversionTarget = S.suspend(() =>
  S.Struct({
    fileFormat: ConversionTargetFormat,
    formatDetails: S.optional(ConversionTargetFormatDetails),
    outputSampleFile: S.optional(OutputSampleFileSource),
    advancedOptions: S.optional(AdvancedOptions),
  }),
).annotations({
  identifier: "ConversionTarget",
}) as any as S.Schema<ConversionTarget>;
export interface CapabilitySummary {
  capabilityId: string;
  name: string;
  type: CapabilityType;
  createdAt: Date;
  modifiedAt?: Date;
}
export const CapabilitySummary = S.suspend(() =>
  S.Struct({
    capabilityId: S.String,
    name: S.String,
    type: CapabilityType,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CapabilitySummary",
}) as any as S.Schema<CapabilitySummary>;
export type CapabilityList = CapabilitySummary[];
export const CapabilityList = S.Array(CapabilitySummary);
export interface PartnershipSummary {
  profileId: string;
  partnershipId: string;
  name?: string;
  capabilities?: string[];
  capabilityOptions?: CapabilityOptions;
  tradingPartnerId?: string;
  createdAt: Date;
  modifiedAt?: Date;
}
export const PartnershipSummary = S.suspend(() =>
  S.Struct({
    profileId: S.String,
    partnershipId: S.String,
    name: S.optional(S.String),
    capabilities: S.optional(PartnershipCapabilities),
    capabilityOptions: S.optional(CapabilityOptions),
    tradingPartnerId: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "PartnershipSummary",
}) as any as S.Schema<PartnershipSummary>;
export type PartnershipList = PartnershipSummary[];
export const PartnershipList = S.Array(PartnershipSummary);
export interface ProfileSummary {
  profileId: string;
  name: string;
  businessName: string;
  logging?: Logging;
  logGroupName?: string;
  createdAt: Date;
  modifiedAt?: Date;
}
export const ProfileSummary = S.suspend(() =>
  S.Struct({
    profileId: S.String,
    name: S.String,
    businessName: S.String,
    logging: S.optional(Logging),
    logGroupName: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ProfileSummary",
}) as any as S.Schema<ProfileSummary>;
export type ProfileList = ProfileSummary[];
export const ProfileList = S.Array(ProfileSummary);
export interface TransformerSummary {
  transformerId: string;
  name: string;
  status: TransformerStatus;
  createdAt: Date;
  modifiedAt?: Date;
  fileFormat?: FileFormat;
  mappingTemplate?: string;
  ediType?: EdiType;
  sampleDocument?: string;
  inputConversion?: InputConversion;
  mapping?: Mapping;
  outputConversion?: OutputConversion;
  sampleDocuments?: SampleDocuments;
}
export const TransformerSummary = S.suspend(() =>
  S.Struct({
    transformerId: S.String,
    name: S.String,
    status: TransformerStatus,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    fileFormat: S.optional(FileFormat),
    mappingTemplate: S.optional(S.String),
    ediType: S.optional(EdiType),
    sampleDocument: S.optional(S.String),
    inputConversion: S.optional(InputConversion),
    mapping: S.optional(Mapping),
    outputConversion: S.optional(OutputConversion),
    sampleDocuments: S.optional(SampleDocuments),
  }),
).annotations({
  identifier: "TransformerSummary",
}) as any as S.Schema<TransformerSummary>;
export type TransformerList = TransformerSummary[];
export const TransformerList = S.Array(TransformerSummary);
export interface CreateStarterMappingTemplateRequest {
  outputSampleLocation?: S3Location;
  mappingType: MappingType;
  templateDetails: TemplateDetails;
}
export const CreateStarterMappingTemplateRequest = S.suspend(() =>
  S.Struct({
    outputSampleLocation: S.optional(S3Location),
    mappingType: MappingType,
    templateDetails: TemplateDetails,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/createmappingstarttemplate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateStarterMappingTemplateRequest",
}) as any as S.Schema<CreateStarterMappingTemplateRequest>;
export interface TestConversionRequest {
  source: ConversionSource;
  target: ConversionTarget;
}
export const TestConversionRequest = S.suspend(() =>
  S.Struct({ source: ConversionSource, target: ConversionTarget }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/testconversion" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestConversionRequest",
}) as any as S.Schema<TestConversionRequest>;
export interface CreateCapabilityRequest {
  name: string;
  type: CapabilityType;
  configuration: CapabilityConfiguration;
  instructionsDocuments?: S3Location[];
  clientToken?: string;
  tags?: Tag[];
}
export const CreateCapabilityRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    type: CapabilityType,
    configuration: CapabilityConfiguration,
    instructionsDocuments: S.optional(InstructionsDocuments),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/capabilities" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCapabilityRequest",
}) as any as S.Schema<CreateCapabilityRequest>;
export interface ListCapabilitiesResponse {
  capabilities: CapabilitySummary[];
  nextToken?: string;
}
export const ListCapabilitiesResponse = S.suspend(() =>
  S.Struct({ capabilities: CapabilityList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListCapabilitiesResponse",
}) as any as S.Schema<ListCapabilitiesResponse>;
export interface ListPartnershipsResponse {
  partnerships: PartnershipSummary[];
  nextToken?: string;
}
export const ListPartnershipsResponse = S.suspend(() =>
  S.Struct({ partnerships: PartnershipList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListPartnershipsResponse",
}) as any as S.Schema<ListPartnershipsResponse>;
export interface ListProfilesResponse {
  profiles: ProfileSummary[];
  nextToken?: string;
}
export const ListProfilesResponse = S.suspend(() =>
  S.Struct({ profiles: ProfileList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListProfilesResponse",
}) as any as S.Schema<ListProfilesResponse>;
export interface CreateTransformerRequest {
  name: string;
  clientToken?: string;
  tags?: Tag[];
  fileFormat?: FileFormat;
  mappingTemplate?: string;
  ediType?: EdiType;
  sampleDocument?: string;
  inputConversion?: InputConversion;
  mapping?: Mapping;
  outputConversion?: OutputConversion;
  sampleDocuments?: SampleDocuments;
}
export const CreateTransformerRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(TagList),
    fileFormat: S.optional(FileFormat),
    mappingTemplate: S.optional(S.String),
    ediType: S.optional(EdiType),
    sampleDocument: S.optional(S.String),
    inputConversion: S.optional(InputConversion),
    mapping: S.optional(Mapping),
    outputConversion: S.optional(OutputConversion),
    sampleDocuments: S.optional(SampleDocuments),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/transformers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTransformerRequest",
}) as any as S.Schema<CreateTransformerRequest>;
export interface ListTransformersResponse {
  transformers: TransformerSummary[];
  nextToken?: string;
}
export const ListTransformersResponse = S.suspend(() =>
  S.Struct({ transformers: TransformerList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTransformersResponse",
}) as any as S.Schema<ListTransformersResponse>;
export type ValidationMessages = string[];
export const ValidationMessages = S.Array(S.String);
export interface CreateStarterMappingTemplateResponse {
  mappingTemplate: string;
}
export const CreateStarterMappingTemplateResponse = S.suspend(() =>
  S.Struct({ mappingTemplate: S.String }),
).annotations({
  identifier: "CreateStarterMappingTemplateResponse",
}) as any as S.Schema<CreateStarterMappingTemplateResponse>;
export interface TestConversionResponse {
  convertedFileContent: string;
  validationMessages?: string[];
}
export const TestConversionResponse = S.suspend(() =>
  S.Struct({
    convertedFileContent: S.String,
    validationMessages: S.optional(ValidationMessages),
  }),
).annotations({
  identifier: "TestConversionResponse",
}) as any as S.Schema<TestConversionResponse>;
export interface CreateCapabilityResponse {
  capabilityId: string;
  capabilityArn: string;
  name: string;
  type: CapabilityType;
  configuration: CapabilityConfiguration;
  instructionsDocuments?: S3Location[];
  createdAt: Date;
}
export const CreateCapabilityResponse = S.suspend(() =>
  S.Struct({
    capabilityId: S.String,
    capabilityArn: S.String,
    name: S.String,
    type: CapabilityType,
    configuration: CapabilityConfiguration,
    instructionsDocuments: S.optional(InstructionsDocuments),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreateCapabilityResponse",
}) as any as S.Schema<CreateCapabilityResponse>;
export interface CreateTransformerResponse {
  transformerId: string;
  transformerArn: string;
  name: string;
  status: TransformerStatus;
  createdAt: Date;
  fileFormat?: FileFormat;
  mappingTemplate?: string;
  ediType?: EdiType;
  sampleDocument?: string;
  inputConversion?: InputConversion;
  mapping?: Mapping;
  outputConversion?: OutputConversion;
  sampleDocuments?: SampleDocuments;
}
export const CreateTransformerResponse = S.suspend(() =>
  S.Struct({
    transformerId: S.String,
    transformerArn: S.String,
    name: S.String,
    status: TransformerStatus,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    fileFormat: S.optional(FileFormat),
    mappingTemplate: S.optional(S.String),
    ediType: S.optional(EdiType),
    sampleDocument: S.optional(S.String),
    inputConversion: S.optional(InputConversion),
    mapping: S.optional(Mapping),
    outputConversion: S.optional(OutputConversion),
    sampleDocuments: S.optional(SampleDocuments),
  }),
).annotations({
  identifier: "CreateTransformerResponse",
}) as any as S.Schema<CreateTransformerResponse>;
export interface TestParsingRequest {
  inputFile: S3Location;
  fileFormat: FileFormat;
  ediType: EdiType;
  advancedOptions?: AdvancedOptions;
}
export const TestParsingRequest = S.suspend(() =>
  S.Struct({
    inputFile: S3Location,
    fileFormat: FileFormat,
    ediType: EdiType,
    advancedOptions: S.optional(AdvancedOptions),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/testparsing" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestParsingRequest",
}) as any as S.Schema<TestParsingRequest>;
export interface CreatePartnershipRequest {
  profileId: string;
  name: string;
  email: string | redacted.Redacted<string>;
  phone?: string | redacted.Redacted<string>;
  capabilities: string[];
  capabilityOptions?: CapabilityOptions;
  clientToken?: string;
  tags?: Tag[];
}
export const CreatePartnershipRequest = S.suspend(() =>
  S.Struct({
    profileId: S.String,
    name: S.String,
    email: SensitiveString,
    phone: S.optional(SensitiveString),
    capabilities: PartnershipCapabilities,
    capabilityOptions: S.optional(CapabilityOptions),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/partnerships" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePartnershipRequest",
}) as any as S.Schema<CreatePartnershipRequest>;
export type ParsedSplitFileContentsList = string[];
export const ParsedSplitFileContentsList = S.Array(S.String);
export interface TestParsingResponse {
  parsedFileContent: string;
  parsedSplitFileContents?: string[];
  validationMessages?: string[];
}
export const TestParsingResponse = S.suspend(() =>
  S.Struct({
    parsedFileContent: S.String,
    parsedSplitFileContents: S.optional(ParsedSplitFileContentsList),
    validationMessages: S.optional(ValidationMessages),
  }),
).annotations({
  identifier: "TestParsingResponse",
}) as any as S.Schema<TestParsingResponse>;
export interface CreatePartnershipResponse {
  profileId: string;
  partnershipId: string;
  partnershipArn: string;
  name?: string;
  email?: string | redacted.Redacted<string>;
  phone?: string | redacted.Redacted<string>;
  capabilities?: string[];
  capabilityOptions?: CapabilityOptions;
  tradingPartnerId?: string;
  createdAt: Date;
}
export const CreatePartnershipResponse = S.suspend(() =>
  S.Struct({
    profileId: S.String,
    partnershipId: S.String,
    partnershipArn: S.String,
    name: S.optional(S.String),
    email: S.optional(SensitiveString),
    phone: S.optional(SensitiveString),
    capabilities: S.optional(PartnershipCapabilities),
    capabilityOptions: S.optional(CapabilityOptions),
    tradingPartnerId: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreatePartnershipResponse",
}) as any as S.Schema<CreatePartnershipResponse>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
).pipe(C.withConflictError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Detaches a key-value pair from the specified resource, as identified by its Amazon Resource Name (ARN). Resources are capability, partnership, profile, transformers and other entities.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists all of the tags associated with the Amazon Resource Name (ARN) that you specify. The resource can be a capability, partnership, profile, or transformer.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Takes sample input and output documents and uses Amazon Bedrock to generate a mapping automatically. Depending on the accuracy and other factors, you can then edit the mapping for your needs.
 *
 * Before you can use the AI-assisted feature for Amazon Web Services B2B Data Interchange you must enable models in Amazon Bedrock. For details, see AI-assisted template mapping prerequisites in the *Amazon Web Services B2B Data Interchange User guide*.
 *
 * To generate a mapping, perform the following steps:
 *
 * - Start with an X12 EDI document to use as the input.
 *
 * - Call `TestMapping` using your EDI document.
 *
 * - Use the output from the `TestMapping` operation as either input or output for your GenerateMapping call, along with your sample file.
 */
export const generateMapping: (
  input: GenerateMappingRequest,
) => effect.Effect<
  GenerateMappingResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateMappingRequest,
  output: GenerateMappingResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified partnership. A partnership represents the connection between you and your trading partner. It ties together a profile and one or more trading capabilities.
 */
export const deletePartnership: (
  input: DeletePartnershipRequest,
) => effect.Effect<
  DeletePartnershipResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePartnershipRequest,
  output: DeletePartnershipResponse,
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
 * Deletes the specified profile. A profile is the mechanism used to create the concept of a private network.
 */
export const deleteProfile: (
  input: DeleteProfileRequest,
) => effect.Effect<
  DeleteProfileResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProfileRequest,
  output: DeleteProfileResponse,
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
 * Deletes the specified transformer. A transformer can take an EDI file as input and transform it into a JSON-or XML-formatted document. Alternatively, a transformer can take a JSON-or XML-formatted document as input and transform it into an EDI file.
 */
export const deleteTransformer: (
  input: DeleteTransformerRequest,
) => effect.Effect<
  DeleteTransformerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTransformerRequest,
  output: DeleteTransformerResponse,
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
 * Runs a job, using a transformer, to parse input EDI (electronic data interchange) file into the output structures used by Amazon Web Services B2B Data Interchange.
 *
 * If you only want to transform EDI (electronic data interchange) documents, you don't need to create profiles, partnerships or capabilities. Just create and configure a transformer, and then run the `StartTransformerJob` API to process your files.
 *
 * The system stores transformer jobs for 30 days. During that period, you can run GetTransformerJob and supply its `transformerId` and `transformerJobId` to return details of the job.
 */
export const startTransformerJob: (
  input: StartTransformerJobRequest,
) => effect.Effect<
  StartTransformerJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTransformerJobRequest,
  output: StartTransformerJobResponse,
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
 * Deletes the specified capability. A trading capability contains the information required to transform incoming EDI documents into JSON or XML outputs.
 */
export const deleteCapability: (
  input: DeleteCapabilityRequest,
) => effect.Effect<
  DeleteCapabilityResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCapabilityRequest,
  output: DeleteCapabilityResponse,
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
 * Lists the capabilities associated with your Amazon Web Services account for your current or specified region. A trading capability contains the information required to transform incoming EDI documents into JSON or XML outputs.
 */
export const listCapabilities: {
  (
    input: ListCapabilitiesRequest,
  ): effect.Effect<
    ListCapabilitiesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCapabilitiesRequest,
  ) => stream.Stream<
    ListCapabilitiesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCapabilitiesRequest,
  ) => stream.Stream<
    CapabilitySummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCapabilitiesRequest,
  output: ListCapabilitiesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "capabilities",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the partnerships associated with your Amazon Web Services account for your current or specified region. A partnership represents the connection between you and your trading partner. It ties together a profile and one or more trading capabilities.
 */
export const listPartnerships: {
  (
    input: ListPartnershipsRequest,
  ): effect.Effect<
    ListPartnershipsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPartnershipsRequest,
  ) => stream.Stream<
    ListPartnershipsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPartnershipsRequest,
  ) => stream.Stream<
    PartnershipSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPartnershipsRequest,
  output: ListPartnershipsResponse,
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
    items: "partnerships",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the profiles associated with your Amazon Web Services account for your current or specified region. A profile is the mechanism used to create the concept of a private network.
 */
export const listProfiles: {
  (
    input: ListProfilesRequest,
  ): effect.Effect<
    ListProfilesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProfilesRequest,
  ) => stream.Stream<
    ListProfilesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProfilesRequest,
  ) => stream.Stream<
    ProfileSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProfilesRequest,
  output: ListProfilesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "profiles",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the available transformers. A transformer can take an EDI file as input and transform it into a JSON-or XML-formatted document. Alternatively, a transformer can take a JSON-or XML-formatted document as input and transform it into an EDI file.
 */
export const listTransformers: {
  (
    input: ListTransformersRequest,
  ): effect.Effect<
    ListTransformersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTransformersRequest,
  ) => stream.Stream<
    ListTransformersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTransformersRequest,
  ) => stream.Stream<
    TransformerSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTransformersRequest,
  output: ListTransformersResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "transformers",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the details for a partnership, based on the partner and profile IDs specified. A partnership represents the connection between you and your trading partner. It ties together a profile and one or more trading capabilities.
 */
export const getPartnership: (
  input: GetPartnershipRequest,
) => effect.Effect<
  GetPartnershipResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPartnershipRequest,
  output: GetPartnershipResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the details for the profile specified by the profile ID. A profile is the mechanism used to create the concept of a private network.
 */
export const getProfile: (
  input: GetProfileRequest,
) => effect.Effect<
  GetProfileResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProfileRequest,
  output: GetProfileResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the details for the transformer specified by the transformer ID. A transformer can take an EDI file as input and transform it into a JSON-or XML-formatted document. Alternatively, a transformer can take a JSON-or XML-formatted document as input and transform it into an EDI file.
 */
export const getTransformer: (
  input: GetTransformerRequest,
) => effect.Effect<
  GetTransformerResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTransformerRequest,
  output: GetTransformerResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Attaches a key-value pair to a resource, as identified by its Amazon Resource Name (ARN). Resources are capability, partnership, profile, transformers and other entities.
 *
 * There is no response returned from this call.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
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
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the details of the transformer run, based on the Transformer job ID.
 *
 * If 30 days have elapsed since your transformer job was started, the system deletes it. So, if you run `GetTransformerJob` and supply a `transformerId` and `transformerJobId` for a job that was started more than 30 days previously, you receive a 404 response.
 */
export const getTransformerJob: (
  input: GetTransformerJobRequest,
) => effect.Effect<
  GetTransformerJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTransformerJobRequest,
  output: GetTransformerJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Maps the input file according to the provided template file. The API call downloads the file contents from the Amazon S3 location, and passes the contents in as a string, to the `inputFileContent` parameter.
 */
export const testMapping: (
  input: TestMappingRequest,
) => effect.Effect<
  TestMappingResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestMappingRequest,
  output: TestMappingResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the details for the specified capability. A trading capability contains the information required to transform incoming EDI documents into JSON or XML outputs.
 */
export const getCapability: (
  input: GetCapabilityRequest,
) => effect.Effect<
  GetCapabilityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCapabilityRequest,
  output: GetCapabilityResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Amazon Web Services B2B Data Interchange uses a mapping template in JSONata or XSLT format to transform a customer input file into a JSON or XML file that can be converted to EDI.
 *
 * If you provide a sample EDI file with the same structure as the EDI files that you wish to generate, then the service can generate a mapping template. The starter template contains placeholder values which you can replace with JSONata or XSLT expressions to take data from your input file and insert it into the JSON or XML file that is used to generate the EDI.
 *
 * If you do not provide a sample EDI file, then the service can generate a mapping template based on the EDI settings in the `templateDetails` parameter.
 *
 * Currently, we only support generating a template that can generate the input to produce an Outbound X12 EDI file.
 */
export const createStarterMappingTemplate: (
  input: CreateStarterMappingTemplateRequest,
) => effect.Effect<
  CreateStarterMappingTemplateResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStarterMappingTemplateRequest,
  output: CreateStarterMappingTemplateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * This operation mimics the latter half of a typical Outbound EDI request. It takes an input JSON/XML in the B2Bi shape as input, converts it to an X12 EDI string, and return that string.
 */
export const testConversion: (
  input: TestConversionRequest,
) => effect.Effect<
  TestConversionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestConversionRequest,
  output: TestConversionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates some of the parameters for a partnership between a customer and trading partner. A partnership represents the connection between you and your trading partner. It ties together a profile and one or more trading capabilities.
 */
export const updatePartnership: (
  input: UpdatePartnershipRequest,
) => effect.Effect<
  UpdatePartnershipResponse,
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
  input: UpdatePartnershipRequest,
  output: UpdatePartnershipResponse,
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
 * Creates a customer profile. You can have up to five customer profiles, each representing a distinct private network. A profile is the mechanism used to create the concept of a private network.
 */
export const createProfile: (
  input: CreateProfileRequest,
) => effect.Effect<
  CreateProfileResponse,
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
  input: CreateProfileRequest,
  output: CreateProfileResponse,
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
 * Updates the specified parameters for a profile. A profile is the mechanism used to create the concept of a private network.
 */
export const updateProfile: (
  input: UpdateProfileRequest,
) => effect.Effect<
  UpdateProfileResponse,
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
  input: UpdateProfileRequest,
  output: UpdateProfileResponse,
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
 * Updates the specified parameters for a transformer. A transformer can take an EDI file as input and transform it into a JSON-or XML-formatted document. Alternatively, a transformer can take a JSON-or XML-formatted document as input and transform it into an EDI file.
 */
export const updateTransformer: (
  input: UpdateTransformerRequest,
) => effect.Effect<
  UpdateTransformerResponse,
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
  input: UpdateTransformerRequest,
  output: UpdateTransformerResponse,
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
 * Updates some of the parameters for a capability, based on the specified parameters. A trading capability contains the information required to transform incoming EDI documents into JSON or XML outputs.
 */
export const updateCapability: (
  input: UpdateCapabilityRequest,
) => effect.Effect<
  UpdateCapabilityResponse,
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
  input: UpdateCapabilityRequest,
  output: UpdateCapabilityResponse,
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
 * Instantiates a capability based on the specified parameters. A trading capability contains the information required to transform incoming EDI documents into JSON or XML outputs.
 */
export const createCapability: (
  input: CreateCapabilityRequest,
) => effect.Effect<
  CreateCapabilityResponse,
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
  input: CreateCapabilityRequest,
  output: CreateCapabilityResponse,
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
 * Creates a transformer. Amazon Web Services B2B Data Interchange currently supports two scenarios:
 *
 * - *Inbound EDI*: the Amazon Web Services customer receives an EDI file from their trading partner. Amazon Web Services B2B Data Interchange converts this EDI file into a JSON or XML file with a service-defined structure. A mapping template provided by the customer, in JSONata or XSLT format, is optionally applied to this file to produce a JSON or XML file with the structure the customer requires.
 *
 * - *Outbound EDI*: the Amazon Web Services customer has a JSON or XML file containing data that they wish to use in an EDI file. A mapping template, provided by the customer (in either JSONata or XSLT format) is applied to this file to generate a JSON or XML file in the service-defined structure. This file is then converted to an EDI file.
 *
 * The following fields are provided for backwards compatibility only: `fileFormat`, `mappingTemplate`, `ediType`, and `sampleDocument`.
 *
 * - Use the `mapping` data type in place of `mappingTemplate` and `fileFormat`
 *
 * - Use the `sampleDocuments` data type in place of `sampleDocument`
 *
 * - Use either the `inputConversion` or `outputConversion` in place of `ediType`
 */
export const createTransformer: (
  input: CreateTransformerRequest,
) => effect.Effect<
  CreateTransformerResponse,
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
  input: CreateTransformerRequest,
  output: CreateTransformerResponse,
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
 * Parses the input EDI (electronic data interchange) file. The input file has a file size limit of 250 KB.
 */
export const testParsing: (
  input: TestParsingRequest,
) => effect.Effect<
  TestParsingResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestParsingRequest,
  output: TestParsingResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a partnership between a customer and a trading partner, based on the supplied parameters. A partnership represents the connection between you and your trading partner. It ties together a profile and one or more trading capabilities.
 */
export const createPartnership: (
  input: CreatePartnershipRequest,
) => effect.Effect<
  CreatePartnershipResponse,
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
  input: CreatePartnershipRequest,
  output: CreatePartnershipResponse,
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

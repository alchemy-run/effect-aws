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
export type Email = string | Redacted.Redacted<string>;
export type Phone = string | Redacted.Redacted<string>;
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
export type TradingPartnerId = string;
export type LogGroupName = string;
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
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
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
export interface GenerateMappingRequest {
  inputFileContent: string;
  outputFileContent: string;
  mappingType: string;
}
export const GenerateMappingRequest = S.suspend(() =>
  S.Struct({
    inputFileContent: S.String,
    outputFileContent: S.String,
    mappingType: S.String,
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
    clientToken: S.optional(S.String),
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
  fileFormat: string;
}
export const TestMappingRequest = S.suspend(() =>
  S.Struct({
    inputFileContent: S.String,
    mappingTemplate: S.String,
    fileFormat: S.String,
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
  TagKeys: TagKeyList;
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
export interface X12Details {
  transactionSet?: string;
  version?: string;
}
export const X12Details = S.suspend(() =>
  S.Struct({
    transactionSet: S.optional(S.String),
    version: S.optional(S.String),
  }),
).annotations({ identifier: "X12Details" }) as any as S.Schema<X12Details>;
export type EdiType = { x12Details: X12Details };
export const EdiType = S.Union(S.Struct({ x12Details: X12Details }));
export interface EdiConfiguration {
  capabilityDirection?: string;
  type: (typeof EdiType)["Type"];
  inputLocation: S3Location;
  outputLocation: S3Location;
  transformerId: string;
}
export const EdiConfiguration = S.suspend(() =>
  S.Struct({
    capabilityDirection: S.optional(S.String),
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
  configuration?: (typeof CapabilityConfiguration)["Type"];
  instructionsDocuments?: InstructionsDocuments;
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
export interface X12OutboundEdiHeaders {
  interchangeControlHeaders?: X12InterchangeControlHeaders;
  functionalGroupHeaders?: X12FunctionalGroupHeaders;
  delimiters?: X12Delimiters;
  validateEdi?: boolean;
  controlNumbers?: X12ControlNumbers;
  gs05TimeFormat?: string;
}
export const X12OutboundEdiHeaders = S.suspend(() =>
  S.Struct({
    interchangeControlHeaders: S.optional(X12InterchangeControlHeaders),
    functionalGroupHeaders: S.optional(X12FunctionalGroupHeaders),
    delimiters: S.optional(X12Delimiters),
    validateEdi: S.optional(S.Boolean),
    controlNumbers: S.optional(X12ControlNumbers),
    gs05TimeFormat: S.optional(S.String),
  }),
).annotations({
  identifier: "X12OutboundEdiHeaders",
}) as any as S.Schema<X12OutboundEdiHeaders>;
export interface WrapOptions {
  wrapBy: string;
  lineTerminator?: string;
  lineLength?: number;
}
export const WrapOptions = S.suspend(() =>
  S.Struct({
    wrapBy: S.String,
    lineTerminator: S.optional(S.String),
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
export interface X12AcknowledgmentOptions {
  functionalAcknowledgment: string;
  technicalAcknowledgment: string;
}
export const X12AcknowledgmentOptions = S.suspend(() =>
  S.Struct({
    functionalAcknowledgment: S.String,
    technicalAcknowledgment: S.String,
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
  outboundEdi?: (typeof OutboundEdiOptions)["Type"];
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
  capabilities?: PartnershipCapabilities;
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
  email?: string | Redacted.Redacted<string>;
  phone: string | Redacted.Redacted<string>;
  businessName: string;
  logging: string;
  clientToken?: string;
  tags?: TagList;
}
export const CreateProfileRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    email: S.optional(SensitiveString),
    phone: SensitiveString,
    businessName: S.String,
    logging: S.String,
    clientToken: S.optional(S.String),
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
  email?: string | Redacted.Redacted<string>;
  phone?: string | Redacted.Redacted<string>;
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
export type FormatOptions = { x12: X12Details };
export const FormatOptions = S.Union(S.Struct({ x12: X12Details }));
export interface X12SplitOptions {
  splitBy: string;
}
export const X12SplitOptions = S.suspend(() =>
  S.Struct({ splitBy: S.String }),
).annotations({
  identifier: "X12SplitOptions",
}) as any as S.Schema<X12SplitOptions>;
export type CodeList = string[];
export const CodeList = S.Array(S.String);
export interface X12CodeListValidationRule {
  elementId: string;
  codesToAdd?: CodeList;
  codesToRemove?: CodeList;
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
export interface X12ElementRequirementValidationRule {
  elementPosition: string;
  requirement: string;
}
export const X12ElementRequirementValidationRule = S.suspend(() =>
  S.Struct({ elementPosition: S.String, requirement: S.String }),
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
export type X12ValidationRules = (typeof X12ValidationRule)["Type"][];
export const X12ValidationRules = S.Array(X12ValidationRule);
export interface X12ValidationOptions {
  validationRules?: X12ValidationRules;
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
  fromFormat: string;
  formatOptions?: (typeof FormatOptions)["Type"];
  advancedOptions?: AdvancedOptions;
}
export const InputConversion = S.suspend(() =>
  S.Struct({
    fromFormat: S.String,
    formatOptions: S.optional(FormatOptions),
    advancedOptions: S.optional(AdvancedOptions),
  }),
).annotations({
  identifier: "InputConversion",
}) as any as S.Schema<InputConversion>;
export interface Mapping {
  templateLanguage: string;
  template?: string;
}
export const Mapping = S.suspend(() =>
  S.Struct({ templateLanguage: S.String, template: S.optional(S.String) }),
).annotations({ identifier: "Mapping" }) as any as S.Schema<Mapping>;
export interface OutputConversion {
  toFormat: string;
  formatOptions?: (typeof FormatOptions)["Type"];
  advancedOptions?: AdvancedOptions;
}
export const OutputConversion = S.suspend(() =>
  S.Struct({
    toFormat: S.String,
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
  keys: KeyList;
}
export const SampleDocuments = S.suspend(() =>
  S.Struct({ bucketName: S.String, keys: KeyList }),
).annotations({
  identifier: "SampleDocuments",
}) as any as S.Schema<SampleDocuments>;
export interface UpdateTransformerRequest {
  transformerId: string;
  name?: string;
  status?: string;
  fileFormat?: string;
  mappingTemplate?: string;
  ediType?: (typeof EdiType)["Type"];
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
    status: S.optional(S.String),
    fileFormat: S.optional(S.String),
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
  status: string;
  outputFiles?: S3LocationList;
  message?: string;
}
export const GetTransformerJobResponse = S.suspend(() =>
  S.Struct({
    status: S.String,
    outputFiles: S.optional(S3LocationList),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTransformerJobResponse",
}) as any as S.Schema<GetTransformerJobResponse>;
export interface ListTagsForResourceResponse {
  Tags?: TagList;
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
  Tags: TagList;
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
  type: string;
  configuration: (typeof CapabilityConfiguration)["Type"];
  instructionsDocuments?: InstructionsDocuments;
  createdAt: Date;
  modifiedAt?: Date;
}
export const GetCapabilityResponse = S.suspend(() =>
  S.Struct({
    capabilityId: S.String,
    capabilityArn: S.String,
    name: S.String,
    type: S.String,
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
  type: string;
  configuration: (typeof CapabilityConfiguration)["Type"];
  instructionsDocuments?: InstructionsDocuments;
  createdAt: Date;
  modifiedAt?: Date;
}
export const UpdateCapabilityResponse = S.suspend(() =>
  S.Struct({
    capabilityId: S.String,
    capabilityArn: S.String,
    name: S.String,
    type: S.String,
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
  email?: string | Redacted.Redacted<string>;
  phone?: string | Redacted.Redacted<string>;
  capabilities?: PartnershipCapabilities;
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
  email?: string | Redacted.Redacted<string>;
  phone?: string | Redacted.Redacted<string>;
  capabilities?: PartnershipCapabilities;
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
  phone: string | Redacted.Redacted<string>;
  email?: string | Redacted.Redacted<string>;
  logging?: string;
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
    logging: S.optional(S.String),
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
  email?: string | Redacted.Redacted<string>;
  phone: string | Redacted.Redacted<string>;
  businessName: string;
  logging?: string;
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
    logging: S.optional(S.String),
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
  email?: string | Redacted.Redacted<string>;
  phone: string | Redacted.Redacted<string>;
  businessName: string;
  logging?: string;
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
    logging: S.optional(S.String),
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
  status: string;
  createdAt: Date;
  modifiedAt?: Date;
  fileFormat?: string;
  mappingTemplate?: string;
  ediType?: (typeof EdiType)["Type"];
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
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    fileFormat: S.optional(S.String),
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
  status: string;
  createdAt: Date;
  modifiedAt: Date;
  fileFormat?: string;
  mappingTemplate?: string;
  ediType?: (typeof EdiType)["Type"];
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
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    fileFormat: S.optional(S.String),
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
  fileFormat: string;
  inputFile: (typeof InputFileSource)["Type"];
}
export const ConversionSource = S.suspend(() =>
  S.Struct({ fileFormat: S.String, inputFile: InputFileSource }),
).annotations({
  identifier: "ConversionSource",
}) as any as S.Schema<ConversionSource>;
export interface ConversionTarget {
  fileFormat: string;
  formatDetails?: (typeof ConversionTargetFormatDetails)["Type"];
  outputSampleFile?: (typeof OutputSampleFileSource)["Type"];
  advancedOptions?: AdvancedOptions;
}
export const ConversionTarget = S.suspend(() =>
  S.Struct({
    fileFormat: S.String,
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
  type: string;
  createdAt: Date;
  modifiedAt?: Date;
}
export const CapabilitySummary = S.suspend(() =>
  S.Struct({
    capabilityId: S.String,
    name: S.String,
    type: S.String,
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
  capabilities?: PartnershipCapabilities;
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
  logging?: string;
  logGroupName?: string;
  createdAt: Date;
  modifiedAt?: Date;
}
export const ProfileSummary = S.suspend(() =>
  S.Struct({
    profileId: S.String,
    name: S.String,
    businessName: S.String,
    logging: S.optional(S.String),
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
  status: string;
  createdAt: Date;
  modifiedAt?: Date;
  fileFormat?: string;
  mappingTemplate?: string;
  ediType?: (typeof EdiType)["Type"];
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
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    fileFormat: S.optional(S.String),
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
  mappingType: string;
  templateDetails: (typeof TemplateDetails)["Type"];
}
export const CreateStarterMappingTemplateRequest = S.suspend(() =>
  S.Struct({
    outputSampleLocation: S.optional(S3Location),
    mappingType: S.String,
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
  type: string;
  configuration: (typeof CapabilityConfiguration)["Type"];
  instructionsDocuments?: InstructionsDocuments;
  clientToken?: string;
  tags?: TagList;
}
export const CreateCapabilityRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    type: S.String,
    configuration: CapabilityConfiguration,
    instructionsDocuments: S.optional(InstructionsDocuments),
    clientToken: S.optional(S.String),
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
  capabilities: CapabilityList;
  nextToken?: string;
}
export const ListCapabilitiesResponse = S.suspend(() =>
  S.Struct({ capabilities: CapabilityList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListCapabilitiesResponse",
}) as any as S.Schema<ListCapabilitiesResponse>;
export interface ListPartnershipsResponse {
  partnerships: PartnershipList;
  nextToken?: string;
}
export const ListPartnershipsResponse = S.suspend(() =>
  S.Struct({ partnerships: PartnershipList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListPartnershipsResponse",
}) as any as S.Schema<ListPartnershipsResponse>;
export interface ListProfilesResponse {
  profiles: ProfileList;
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
  tags?: TagList;
  fileFormat?: string;
  mappingTemplate?: string;
  ediType?: (typeof EdiType)["Type"];
  sampleDocument?: string;
  inputConversion?: InputConversion;
  mapping?: Mapping;
  outputConversion?: OutputConversion;
  sampleDocuments?: SampleDocuments;
}
export const CreateTransformerRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    clientToken: S.optional(S.String),
    tags: S.optional(TagList),
    fileFormat: S.optional(S.String),
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
  transformers: TransformerList;
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
  validationMessages?: ValidationMessages;
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
  type: string;
  configuration: (typeof CapabilityConfiguration)["Type"];
  instructionsDocuments?: InstructionsDocuments;
  createdAt: Date;
}
export const CreateCapabilityResponse = S.suspend(() =>
  S.Struct({
    capabilityId: S.String,
    capabilityArn: S.String,
    name: S.String,
    type: S.String,
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
  status: string;
  createdAt: Date;
  fileFormat?: string;
  mappingTemplate?: string;
  ediType?: (typeof EdiType)["Type"];
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
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    fileFormat: S.optional(S.String),
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
  fileFormat: string;
  ediType: (typeof EdiType)["Type"];
  advancedOptions?: AdvancedOptions;
}
export const TestParsingRequest = S.suspend(() =>
  S.Struct({
    inputFile: S3Location,
    fileFormat: S.String,
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
  email: string | Redacted.Redacted<string>;
  phone?: string | Redacted.Redacted<string>;
  capabilities: PartnershipCapabilities;
  capabilityOptions?: CapabilityOptions;
  clientToken?: string;
  tags?: TagList;
}
export const CreatePartnershipRequest = S.suspend(() =>
  S.Struct({
    profileId: S.String,
    name: S.String,
    email: SensitiveString,
    phone: S.optional(SensitiveString),
    capabilities: PartnershipCapabilities,
    capabilityOptions: S.optional(CapabilityOptions),
    clientToken: S.optional(S.String),
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
  parsedSplitFileContents?: ParsedSplitFileContentsList;
  validationMessages?: ValidationMessages;
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
  email?: string | Redacted.Redacted<string>;
  phone?: string | Redacted.Redacted<string>;
  capabilities?: PartnershipCapabilities;
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({ sdkId: "b2bi", serviceShapeName: "B2BI" });
const auth = T.AwsAuthSigv4({ name: "b2bi" });
const ver = T.ServiceVersion("2022-06-23");
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
                                url: "https://b2bi-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://b2bi-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://b2bi.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://b2bi.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export class S3Location extends S.Class<S3Location>("S3Location")({
  bucketName: S.optional(S.String),
  key: S.optional(S.String),
}) {}
export const InstructionsDocuments = S.Array(S3Location);
export const PartnershipCapabilities = S.Array(S.String);
export class GenerateMappingRequest extends S.Class<GenerateMappingRequest>(
  "GenerateMappingRequest",
)(
  {
    inputFileContent: S.String,
    outputFileContent: S.String,
    mappingType: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/generate-mapping" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTransformerJobRequest extends S.Class<GetTransformerJobRequest>(
  "GetTransformerJobRequest",
)(
  {
    transformerJobId: S.String.pipe(T.HttpLabel("transformerJobId")),
    transformerId: S.String.pipe(T.HttpQuery("transformerId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/transformer-jobs/{transformerJobId}" }),
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
  { ResourceARN: S.String.pipe(T.HttpLabel("ResourceARN")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceARN}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartTransformerJobRequest extends S.Class<StartTransformerJobRequest>(
  "StartTransformerJobRequest",
)(
  {
    inputFile: S3Location,
    outputLocation: S3Location,
    transformerId: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/transformer-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TestMappingRequest extends S.Class<TestMappingRequest>(
  "TestMappingRequest",
)(
  {
    inputFileContent: S.String,
    mappingTemplate: S.String,
    fileFormat: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/testmapping" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceARN: S.String.pipe(T.HttpLabel("ResourceARN")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("TagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{ResourceARN}" }),
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
export class GetCapabilityRequest extends S.Class<GetCapabilityRequest>(
  "GetCapabilityRequest",
)(
  { capabilityId: S.String.pipe(T.HttpLabel("capabilityId")) },
  T.all(
    T.Http({ method: "GET", uri: "/capabilities/{capabilityId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class X12Details extends S.Class<X12Details>("X12Details")({
  transactionSet: S.optional(S.String),
  version: S.optional(S.String),
}) {}
export const EdiType = S.Union(S.Struct({ x12Details: X12Details }));
export class EdiConfiguration extends S.Class<EdiConfiguration>(
  "EdiConfiguration",
)({
  capabilityDirection: S.optional(S.String),
  type: EdiType,
  inputLocation: S3Location,
  outputLocation: S3Location,
  transformerId: S.String,
}) {}
export const CapabilityConfiguration = S.Union(
  S.Struct({ edi: EdiConfiguration }),
);
export class UpdateCapabilityRequest extends S.Class<UpdateCapabilityRequest>(
  "UpdateCapabilityRequest",
)(
  {
    capabilityId: S.String.pipe(T.HttpLabel("capabilityId")),
    name: S.optional(S.String),
    configuration: S.optional(CapabilityConfiguration),
    instructionsDocuments: S.optional(InstructionsDocuments),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/capabilities/{capabilityId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCapabilityRequest extends S.Class<DeleteCapabilityRequest>(
  "DeleteCapabilityRequest",
)(
  { capabilityId: S.String.pipe(T.HttpLabel("capabilityId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/capabilities/{capabilityId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCapabilityResponse extends S.Class<DeleteCapabilityResponse>(
  "DeleteCapabilityResponse",
)({}) {}
export class ListCapabilitiesRequest extends S.Class<ListCapabilitiesRequest>(
  "ListCapabilitiesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/capabilities" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPartnershipRequest extends S.Class<GetPartnershipRequest>(
  "GetPartnershipRequest",
)(
  { partnershipId: S.String.pipe(T.HttpLabel("partnershipId")) },
  T.all(
    T.Http({ method: "GET", uri: "/partnerships/{partnershipId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class X12InterchangeControlHeaders extends S.Class<X12InterchangeControlHeaders>(
  "X12InterchangeControlHeaders",
)({
  senderIdQualifier: S.optional(S.String),
  senderId: S.optional(S.String),
  receiverIdQualifier: S.optional(S.String),
  receiverId: S.optional(S.String),
  repetitionSeparator: S.optional(S.String),
  acknowledgmentRequestedCode: S.optional(S.String),
  usageIndicatorCode: S.optional(S.String),
}) {}
export class X12FunctionalGroupHeaders extends S.Class<X12FunctionalGroupHeaders>(
  "X12FunctionalGroupHeaders",
)({
  applicationSenderCode: S.optional(S.String),
  applicationReceiverCode: S.optional(S.String),
  responsibleAgencyCode: S.optional(S.String),
}) {}
export class X12Delimiters extends S.Class<X12Delimiters>("X12Delimiters")({
  componentSeparator: S.optional(S.String),
  dataElementSeparator: S.optional(S.String),
  segmentTerminator: S.optional(S.String),
}) {}
export class X12ControlNumbers extends S.Class<X12ControlNumbers>(
  "X12ControlNumbers",
)({
  startingInterchangeControlNumber: S.optional(S.Number),
  startingFunctionalGroupControlNumber: S.optional(S.Number),
  startingTransactionSetControlNumber: S.optional(S.Number),
}) {}
export class X12OutboundEdiHeaders extends S.Class<X12OutboundEdiHeaders>(
  "X12OutboundEdiHeaders",
)({
  interchangeControlHeaders: S.optional(X12InterchangeControlHeaders),
  functionalGroupHeaders: S.optional(X12FunctionalGroupHeaders),
  delimiters: S.optional(X12Delimiters),
  validateEdi: S.optional(S.Boolean),
  controlNumbers: S.optional(X12ControlNumbers),
  gs05TimeFormat: S.optional(S.String),
}) {}
export class WrapOptions extends S.Class<WrapOptions>("WrapOptions")({
  wrapBy: S.String,
  lineTerminator: S.optional(S.String),
  lineLength: S.optional(S.Number),
}) {}
export class X12Envelope extends S.Class<X12Envelope>("X12Envelope")({
  common: S.optional(X12OutboundEdiHeaders),
  wrapOptions: S.optional(WrapOptions),
}) {}
export const OutboundEdiOptions = S.Union(S.Struct({ x12: X12Envelope }));
export class X12AcknowledgmentOptions extends S.Class<X12AcknowledgmentOptions>(
  "X12AcknowledgmentOptions",
)({ functionalAcknowledgment: S.String, technicalAcknowledgment: S.String }) {}
export class X12InboundEdiOptions extends S.Class<X12InboundEdiOptions>(
  "X12InboundEdiOptions",
)({ acknowledgmentOptions: S.optional(X12AcknowledgmentOptions) }) {}
export class InboundEdiOptions extends S.Class<InboundEdiOptions>(
  "InboundEdiOptions",
)({ x12: S.optional(X12InboundEdiOptions) }) {}
export class CapabilityOptions extends S.Class<CapabilityOptions>(
  "CapabilityOptions",
)({
  outboundEdi: S.optional(OutboundEdiOptions),
  inboundEdi: S.optional(InboundEdiOptions),
}) {}
export class UpdatePartnershipRequest extends S.Class<UpdatePartnershipRequest>(
  "UpdatePartnershipRequest",
)(
  {
    partnershipId: S.String.pipe(T.HttpLabel("partnershipId")),
    name: S.optional(S.String),
    capabilities: S.optional(PartnershipCapabilities),
    capabilityOptions: S.optional(CapabilityOptions),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/partnerships/{partnershipId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePartnershipRequest extends S.Class<DeletePartnershipRequest>(
  "DeletePartnershipRequest",
)(
  { partnershipId: S.String.pipe(T.HttpLabel("partnershipId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/partnerships/{partnershipId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePartnershipResponse extends S.Class<DeletePartnershipResponse>(
  "DeletePartnershipResponse",
)({}) {}
export class ListPartnershipsRequest extends S.Class<ListPartnershipsRequest>(
  "ListPartnershipsRequest",
)(
  {
    profileId: S.optional(S.String).pipe(T.HttpQuery("profileId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/partnerships" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateProfileRequest extends S.Class<CreateProfileRequest>(
  "CreateProfileRequest",
)(
  {
    name: S.String,
    email: S.optional(S.String),
    phone: S.String,
    businessName: S.String,
    logging: S.String,
    clientToken: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetProfileRequest extends S.Class<GetProfileRequest>(
  "GetProfileRequest",
)(
  { profileId: S.String.pipe(T.HttpLabel("profileId")) },
  T.all(
    T.Http({ method: "GET", uri: "/profiles/{profileId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateProfileRequest extends S.Class<UpdateProfileRequest>(
  "UpdateProfileRequest",
)(
  {
    profileId: S.String.pipe(T.HttpLabel("profileId")),
    name: S.optional(S.String),
    email: S.optional(S.String),
    phone: S.optional(S.String),
    businessName: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/profiles/{profileId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProfileRequest extends S.Class<DeleteProfileRequest>(
  "DeleteProfileRequest",
)(
  { profileId: S.String.pipe(T.HttpLabel("profileId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/profiles/{profileId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProfileResponse extends S.Class<DeleteProfileResponse>(
  "DeleteProfileResponse",
)({}) {}
export class ListProfilesRequest extends S.Class<ListProfilesRequest>(
  "ListProfilesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTransformerRequest extends S.Class<GetTransformerRequest>(
  "GetTransformerRequest",
)(
  { transformerId: S.String.pipe(T.HttpLabel("transformerId")) },
  T.all(
    T.Http({ method: "GET", uri: "/transformers/{transformerId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const FormatOptions = S.Union(S.Struct({ x12: X12Details }));
export class X12SplitOptions extends S.Class<X12SplitOptions>(
  "X12SplitOptions",
)({ splitBy: S.String }) {}
export const CodeList = S.Array(S.String);
export class X12CodeListValidationRule extends S.Class<X12CodeListValidationRule>(
  "X12CodeListValidationRule",
)({
  elementId: S.String,
  codesToAdd: S.optional(CodeList),
  codesToRemove: S.optional(CodeList),
}) {}
export class X12ElementLengthValidationRule extends S.Class<X12ElementLengthValidationRule>(
  "X12ElementLengthValidationRule",
)({ elementId: S.String, maxLength: S.Number, minLength: S.Number }) {}
export class X12ElementRequirementValidationRule extends S.Class<X12ElementRequirementValidationRule>(
  "X12ElementRequirementValidationRule",
)({ elementPosition: S.String, requirement: S.String }) {}
export const X12ValidationRule = S.Union(
  S.Struct({ codeListValidationRule: X12CodeListValidationRule }),
  S.Struct({ elementLengthValidationRule: X12ElementLengthValidationRule }),
  S.Struct({
    elementRequirementValidationRule: X12ElementRequirementValidationRule,
  }),
);
export const X12ValidationRules = S.Array(X12ValidationRule);
export class X12ValidationOptions extends S.Class<X12ValidationOptions>(
  "X12ValidationOptions",
)({ validationRules: S.optional(X12ValidationRules) }) {}
export class X12AdvancedOptions extends S.Class<X12AdvancedOptions>(
  "X12AdvancedOptions",
)({
  splitOptions: S.optional(X12SplitOptions),
  validationOptions: S.optional(X12ValidationOptions),
}) {}
export class AdvancedOptions extends S.Class<AdvancedOptions>(
  "AdvancedOptions",
)({ x12: S.optional(X12AdvancedOptions) }) {}
export class InputConversion extends S.Class<InputConversion>(
  "InputConversion",
)({
  fromFormat: S.String,
  formatOptions: S.optional(FormatOptions),
  advancedOptions: S.optional(AdvancedOptions),
}) {}
export class Mapping extends S.Class<Mapping>("Mapping")({
  templateLanguage: S.String,
  template: S.optional(S.String),
}) {}
export class OutputConversion extends S.Class<OutputConversion>(
  "OutputConversion",
)({
  toFormat: S.String,
  formatOptions: S.optional(FormatOptions),
  advancedOptions: S.optional(AdvancedOptions),
}) {}
export class SampleDocumentKeys extends S.Class<SampleDocumentKeys>(
  "SampleDocumentKeys",
)({ input: S.optional(S.String), output: S.optional(S.String) }) {}
export const KeyList = S.Array(SampleDocumentKeys);
export class SampleDocuments extends S.Class<SampleDocuments>(
  "SampleDocuments",
)({ bucketName: S.String, keys: KeyList }) {}
export class UpdateTransformerRequest extends S.Class<UpdateTransformerRequest>(
  "UpdateTransformerRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/transformers/{transformerId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTransformerRequest extends S.Class<DeleteTransformerRequest>(
  "DeleteTransformerRequest",
)(
  { transformerId: S.String.pipe(T.HttpLabel("transformerId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/transformers/{transformerId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTransformerResponse extends S.Class<DeleteTransformerResponse>(
  "DeleteTransformerResponse",
)({}) {}
export class ListTransformersRequest extends S.Class<ListTransformersRequest>(
  "ListTransformersRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/transformers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const S3LocationList = S.Array(S3Location);
export class GenerateMappingResponse extends S.Class<GenerateMappingResponse>(
  "GenerateMappingResponse",
)({ mappingTemplate: S.String, mappingAccuracy: S.optional(S.Number) }) {}
export class GetTransformerJobResponse extends S.Class<GetTransformerJobResponse>(
  "GetTransformerJobResponse",
)({
  status: S.String,
  outputFiles: S.optional(S3LocationList),
  message: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class StartTransformerJobResponse extends S.Class<StartTransformerJobResponse>(
  "StartTransformerJobResponse",
)({ transformerJobId: S.String }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String.pipe(T.HttpLabel("ResourceARN")), Tags: TagList },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceARN}" }),
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
export class TestMappingResponse extends S.Class<TestMappingResponse>(
  "TestMappingResponse",
)({ mappedFileContent: S.String }) {}
export class GetCapabilityResponse extends S.Class<GetCapabilityResponse>(
  "GetCapabilityResponse",
)({
  capabilityId: S.String,
  capabilityArn: S.String,
  name: S.String,
  type: S.String,
  configuration: CapabilityConfiguration,
  instructionsDocuments: S.optional(InstructionsDocuments),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UpdateCapabilityResponse extends S.Class<UpdateCapabilityResponse>(
  "UpdateCapabilityResponse",
)({
  capabilityId: S.String,
  capabilityArn: S.String,
  name: S.String,
  type: S.String,
  configuration: CapabilityConfiguration,
  instructionsDocuments: S.optional(InstructionsDocuments),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class GetPartnershipResponse extends S.Class<GetPartnershipResponse>(
  "GetPartnershipResponse",
)({
  profileId: S.String,
  partnershipId: S.String,
  partnershipArn: S.String,
  name: S.optional(S.String),
  email: S.optional(S.String),
  phone: S.optional(S.String),
  capabilities: S.optional(PartnershipCapabilities),
  capabilityOptions: S.optional(CapabilityOptions),
  tradingPartnerId: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UpdatePartnershipResponse extends S.Class<UpdatePartnershipResponse>(
  "UpdatePartnershipResponse",
)({
  profileId: S.String,
  partnershipId: S.String,
  partnershipArn: S.String,
  name: S.optional(S.String),
  email: S.optional(S.String),
  phone: S.optional(S.String),
  capabilities: S.optional(PartnershipCapabilities),
  capabilityOptions: S.optional(CapabilityOptions),
  tradingPartnerId: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class CreateProfileResponse extends S.Class<CreateProfileResponse>(
  "CreateProfileResponse",
)({
  profileId: S.String,
  profileArn: S.String,
  name: S.String,
  businessName: S.String,
  phone: S.String,
  email: S.optional(S.String),
  logging: S.optional(S.String),
  logGroupName: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class GetProfileResponse extends S.Class<GetProfileResponse>(
  "GetProfileResponse",
)({
  profileId: S.String,
  profileArn: S.String,
  name: S.String,
  email: S.optional(S.String),
  phone: S.String,
  businessName: S.String,
  logging: S.optional(S.String),
  logGroupName: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UpdateProfileResponse extends S.Class<UpdateProfileResponse>(
  "UpdateProfileResponse",
)({
  profileId: S.String,
  profileArn: S.String,
  name: S.String,
  email: S.optional(S.String),
  phone: S.String,
  businessName: S.String,
  logging: S.optional(S.String),
  logGroupName: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class GetTransformerResponse extends S.Class<GetTransformerResponse>(
  "GetTransformerResponse",
)({
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
}) {}
export class UpdateTransformerResponse extends S.Class<UpdateTransformerResponse>(
  "UpdateTransformerResponse",
)({
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
}) {}
export const InputFileSource = S.Union(S.Struct({ fileContent: S.String }));
export const ConversionTargetFormatDetails = S.Union(
  S.Struct({ x12: X12Details }),
);
export const OutputSampleFileSource = S.Union(
  S.Struct({ fileLocation: S3Location }),
);
export const TemplateDetails = S.Union(S.Struct({ x12: X12Details }));
export class ConversionSource extends S.Class<ConversionSource>(
  "ConversionSource",
)({ fileFormat: S.String, inputFile: InputFileSource }) {}
export class ConversionTarget extends S.Class<ConversionTarget>(
  "ConversionTarget",
)({
  fileFormat: S.String,
  formatDetails: S.optional(ConversionTargetFormatDetails),
  outputSampleFile: S.optional(OutputSampleFileSource),
  advancedOptions: S.optional(AdvancedOptions),
}) {}
export class CapabilitySummary extends S.Class<CapabilitySummary>(
  "CapabilitySummary",
)({
  capabilityId: S.String,
  name: S.String,
  type: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const CapabilityList = S.Array(CapabilitySummary);
export class PartnershipSummary extends S.Class<PartnershipSummary>(
  "PartnershipSummary",
)({
  profileId: S.String,
  partnershipId: S.String,
  name: S.optional(S.String),
  capabilities: S.optional(PartnershipCapabilities),
  capabilityOptions: S.optional(CapabilityOptions),
  tradingPartnerId: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const PartnershipList = S.Array(PartnershipSummary);
export class ProfileSummary extends S.Class<ProfileSummary>("ProfileSummary")({
  profileId: S.String,
  name: S.String,
  businessName: S.String,
  logging: S.optional(S.String),
  logGroupName: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const ProfileList = S.Array(ProfileSummary);
export class TransformerSummary extends S.Class<TransformerSummary>(
  "TransformerSummary",
)({
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
}) {}
export const TransformerList = S.Array(TransformerSummary);
export class CreateStarterMappingTemplateRequest extends S.Class<CreateStarterMappingTemplateRequest>(
  "CreateStarterMappingTemplateRequest",
)(
  {
    outputSampleLocation: S.optional(S3Location),
    mappingType: S.String,
    templateDetails: TemplateDetails,
  },
  T.all(
    T.Http({ method: "POST", uri: "/createmappingstarttemplate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TestConversionRequest extends S.Class<TestConversionRequest>(
  "TestConversionRequest",
)(
  { source: ConversionSource, target: ConversionTarget },
  T.all(
    T.Http({ method: "POST", uri: "/testconversion" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCapabilityRequest extends S.Class<CreateCapabilityRequest>(
  "CreateCapabilityRequest",
)(
  {
    name: S.String,
    type: S.String,
    configuration: CapabilityConfiguration,
    instructionsDocuments: S.optional(InstructionsDocuments),
    clientToken: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/capabilities" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCapabilitiesResponse extends S.Class<ListCapabilitiesResponse>(
  "ListCapabilitiesResponse",
)({ capabilities: CapabilityList, nextToken: S.optional(S.String) }) {}
export class ListPartnershipsResponse extends S.Class<ListPartnershipsResponse>(
  "ListPartnershipsResponse",
)({ partnerships: PartnershipList, nextToken: S.optional(S.String) }) {}
export class ListProfilesResponse extends S.Class<ListProfilesResponse>(
  "ListProfilesResponse",
)({ profiles: ProfileList, nextToken: S.optional(S.String) }) {}
export class CreateTransformerRequest extends S.Class<CreateTransformerRequest>(
  "CreateTransformerRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/transformers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTransformersResponse extends S.Class<ListTransformersResponse>(
  "ListTransformersResponse",
)({ transformers: TransformerList, nextToken: S.optional(S.String) }) {}
export const ValidationMessages = S.Array(S.String);
export class CreateStarterMappingTemplateResponse extends S.Class<CreateStarterMappingTemplateResponse>(
  "CreateStarterMappingTemplateResponse",
)({ mappingTemplate: S.String }) {}
export class TestConversionResponse extends S.Class<TestConversionResponse>(
  "TestConversionResponse",
)({
  convertedFileContent: S.String,
  validationMessages: S.optional(ValidationMessages),
}) {}
export class CreateCapabilityResponse extends S.Class<CreateCapabilityResponse>(
  "CreateCapabilityResponse",
)({
  capabilityId: S.String,
  capabilityArn: S.String,
  name: S.String,
  type: S.String,
  configuration: CapabilityConfiguration,
  instructionsDocuments: S.optional(InstructionsDocuments),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class CreateTransformerResponse extends S.Class<CreateTransformerResponse>(
  "CreateTransformerResponse",
)({
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
}) {}
export class TestParsingRequest extends S.Class<TestParsingRequest>(
  "TestParsingRequest",
)(
  {
    inputFile: S3Location,
    fileFormat: S.String,
    ediType: EdiType,
    advancedOptions: S.optional(AdvancedOptions),
  },
  T.all(
    T.Http({ method: "POST", uri: "/testparsing" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePartnershipRequest extends S.Class<CreatePartnershipRequest>(
  "CreatePartnershipRequest",
)(
  {
    profileId: S.String,
    name: S.String,
    email: S.String,
    phone: S.optional(S.String),
    capabilities: PartnershipCapabilities,
    capabilityOptions: S.optional(CapabilityOptions),
    clientToken: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/partnerships" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ParsedSplitFileContentsList = S.Array(S.String);
export class TestParsingResponse extends S.Class<TestParsingResponse>(
  "TestParsingResponse",
)({
  parsedFileContent: S.String,
  parsedSplitFileContents: S.optional(ParsedSplitFileContentsList),
  validationMessages: S.optional(ValidationMessages),
}) {}
export class CreatePartnershipResponse extends S.Class<CreatePartnershipResponse>(
  "CreatePartnershipResponse",
)({
  profileId: S.String,
  partnershipId: S.String,
  partnershipArn: S.String,
  name: S.optional(S.String),
  email: S.optional(S.String),
  phone: S.optional(S.String),
  capabilities: S.optional(PartnershipCapabilities),
  capabilityOptions: S.optional(CapabilityOptions),
  tradingPartnerId: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
) {}

//# Operations
/**
 * Detaches a key-value pair from the specified resource, as identified by its Amazon Resource Name (ARN). Resources are capability, partnership, profile, transformers and other entities.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const generateMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePartnership = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteTransformer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startTransformerJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteCapability = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listCapabilities = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Lists the partnerships associated with your Amazon Web Services account for your current or specified region. A partnership represents the connection between you and your trading partner. It ties together a profile and one or more trading capabilities.
 */
export const listPartnerships = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Lists the profiles associated with your Amazon Web Services account for your current or specified region. A profile is the mechanism used to create the concept of a private network.
 */
export const listProfiles = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Lists the available transformers. A transformer can take an EDI file as input and transform it into a JSON-or XML-formatted document. Alternatively, a transformer can take a JSON-or XML-formatted document as input and transform it into an EDI file.
 */
export const listTransformers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Retrieves the details for a partnership, based on the partner and profile IDs specified. A partnership represents the connection between you and your trading partner. It ties together a profile and one or more trading capabilities.
 */
export const getPartnership = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTransformer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTransformerJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const testMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCapability = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createStarterMappingTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const testConversion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePartnership = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateTransformer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateCapability = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createCapability = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createTransformer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const testParsing = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPartnership = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

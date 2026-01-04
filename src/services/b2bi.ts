import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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
    transformerJobId: S.String.pipe(T.HttpLabel()),
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
  { ResourceARN: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceARN}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class S3Location extends S.Class<S3Location>("S3Location")({
  bucketName: S.optional(S.String),
  key: S.optional(S.String),
}) {}
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
    ResourceARN: S.String.pipe(T.HttpLabel()),
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
export const S3LocationList = S.Array(S3Location);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class X12Details extends S.Class<X12Details>("X12Details")({
  transactionSet: S.optional(S.String),
  version: S.optional(S.String),
}) {}
export const EdiType = S.Union(S.Struct({ x12Details: X12Details }));
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
  { ResourceARN: S.String.pipe(T.HttpLabel()), Tags: TagList },
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
export class ConversionTarget extends S.Class<ConversionTarget>(
  "ConversionTarget",
)({
  fileFormat: S.String,
  formatDetails: S.optional(ConversionTargetFormatDetails),
  outputSampleFile: S.optional(OutputSampleFileSource),
  advancedOptions: S.optional(AdvancedOptions),
}) {}
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
export const ParsedSplitFileContentsList = S.Array(S.String);
export class TestParsingResponse extends S.Class<TestParsingResponse>(
  "TestParsingResponse",
)({
  parsedFileContent: S.String,
  parsedSplitFileContents: S.optional(ParsedSplitFileContentsList),
  validationMessages: S.optional(ValidationMessages),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
) {}

//# Operations
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

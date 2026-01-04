import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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

//# Schemas
export class DeletePolicyRequest extends S.Class<DeletePolicyRequest>(
  "DeletePolicyRequest",
)(
  {},
  T.all(
    T.Http({ method: "DELETE", uri: "/2017-08-29/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePolicyResponse extends S.Class<DeletePolicyResponse>(
  "DeletePolicyResponse",
)({}) {}
export class GetPolicyRequest extends S.Class<GetPolicyRequest>(
  "GetPolicyRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/2017-08-29/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const __listOf__string = S.Array(S.String);
export class AssociateCertificateRequest extends S.Class<AssociateCertificateRequest>(
  "AssociateCertificateRequest",
)(
  { Arn: S.String.pipe(T.JsonName("arn")) },
  T.all(
    T.Http({ method: "POST", uri: "/2017-08-29/certificates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateCertificateResponse extends S.Class<AssociateCertificateResponse>(
  "AssociateCertificateResponse",
)({}) {}
export class CancelJobRequest extends S.Class<CancelJobRequest>(
  "CancelJobRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/2017-08-29/jobs/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelJobResponse extends S.Class<CancelJobResponse>(
  "CancelJobResponse",
)({}) {}
export class CreateResourceShareRequest extends S.Class<CreateResourceShareRequest>(
  "CreateResourceShareRequest",
)(
  {
    JobId: S.String.pipe(T.JsonName("jobId")),
    SupportCaseId: S.String.pipe(T.JsonName("supportCaseId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2017-08-29/resourceShares" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateResourceShareResponse extends S.Class<CreateResourceShareResponse>(
  "CreateResourceShareResponse",
)({}) {}
export class DeleteJobTemplateRequest extends S.Class<DeleteJobTemplateRequest>(
  "DeleteJobTemplateRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/2017-08-29/jobTemplates/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteJobTemplateResponse extends S.Class<DeleteJobTemplateResponse>(
  "DeleteJobTemplateResponse",
)({}) {}
export class DeletePresetRequest extends S.Class<DeletePresetRequest>(
  "DeletePresetRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/2017-08-29/presets/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePresetResponse extends S.Class<DeletePresetResponse>(
  "DeletePresetResponse",
)({}) {}
export class DeleteQueueRequest extends S.Class<DeleteQueueRequest>(
  "DeleteQueueRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/2017-08-29/queues/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteQueueResponse extends S.Class<DeleteQueueResponse>(
  "DeleteQueueResponse",
)({}) {}
export class DescribeEndpointsRequest extends S.Class<DescribeEndpointsRequest>(
  "DescribeEndpointsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    Mode: S.optional(S.String).pipe(T.JsonName("mode")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2017-08-29/endpoints" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateCertificateRequest extends S.Class<DisassociateCertificateRequest>(
  "DisassociateCertificateRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/2017-08-29/certificates/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateCertificateResponse extends S.Class<DisassociateCertificateResponse>(
  "DisassociateCertificateResponse",
)({}) {}
export class GetJobRequest extends S.Class<GetJobRequest>("GetJobRequest")(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/2017-08-29/jobs/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetJobsQueryResultsRequest extends S.Class<GetJobsQueryResultsRequest>(
  "GetJobsQueryResultsRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/2017-08-29/jobsQueries/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetJobTemplateRequest extends S.Class<GetJobTemplateRequest>(
  "GetJobTemplateRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/2017-08-29/jobTemplates/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPresetRequest extends S.Class<GetPresetRequest>(
  "GetPresetRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/2017-08-29/presets/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetQueueRequest extends S.Class<GetQueueRequest>(
  "GetQueueRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/2017-08-29/queues/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListJobsRequest extends S.Class<ListJobsRequest>(
  "ListJobsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Order: S.optional(S.String).pipe(T.HttpQuery("order")),
    Queue: S.optional(S.String).pipe(T.HttpQuery("queue")),
    Status: S.optional(S.String).pipe(T.HttpQuery("status")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2017-08-29/jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListJobTemplatesRequest extends S.Class<ListJobTemplatesRequest>(
  "ListJobTemplatesRequest",
)(
  {
    Category: S.optional(S.String).pipe(T.HttpQuery("category")),
    ListBy: S.optional(S.String).pipe(T.HttpQuery("listBy")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Order: S.optional(S.String).pipe(T.HttpQuery("order")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2017-08-29/jobTemplates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPresetsRequest extends S.Class<ListPresetsRequest>(
  "ListPresetsRequest",
)(
  {
    Category: S.optional(S.String).pipe(T.HttpQuery("category")),
    ListBy: S.optional(S.String).pipe(T.HttpQuery("listBy")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Order: S.optional(S.String).pipe(T.HttpQuery("order")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2017-08-29/presets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListQueuesRequest extends S.Class<ListQueuesRequest>(
  "ListQueuesRequest",
)(
  {
    ListBy: S.optional(S.String).pipe(T.HttpQuery("listBy")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Order: S.optional(S.String).pipe(T.HttpQuery("order")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2017-08-29/queues" }),
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
  { Arn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/2017-08-29/tags/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVersionsRequest extends S.Class<ListVersionsRequest>(
  "ListVersionsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2017-08-29/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Policy extends S.Class<Policy>("Policy")({
  HttpInputs: S.optional(S.String).pipe(T.JsonName("httpInputs")),
  HttpsInputs: S.optional(S.String).pipe(T.JsonName("httpsInputs")),
  S3Inputs: S.optional(S.String).pipe(T.JsonName("s3Inputs")),
}) {}
export class PutPolicyRequest extends S.Class<PutPolicyRequest>(
  "PutPolicyRequest",
)(
  { Policy: Policy.pipe(T.JsonName("policy")) },
  T.all(
    T.Http({ method: "PUT", uri: "/2017-08-29/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchJobsRequest extends S.Class<SearchJobsRequest>(
  "SearchJobsRequest",
)(
  {
    InputFile: S.optional(S.String).pipe(T.HttpQuery("inputFile")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Order: S.optional(S.String).pipe(T.HttpQuery("order")),
    Queue: S.optional(S.String).pipe(T.HttpQuery("queue")),
    Status: S.optional(S.String).pipe(T.HttpQuery("status")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2017-08-29/search" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const __mapOf__string = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  {
    Arn: S.String.pipe(T.JsonName("arn")),
    Tags: __mapOf__string.pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2017-08-29/tags" }),
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
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    Arn: S.String.pipe(T.HttpLabel()),
    TagKeys: S.optional(__listOf__string).pipe(T.JsonName("tagKeys")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/2017-08-29/tags/{Arn}" }),
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
export class AccelerationSettings extends S.Class<AccelerationSettings>(
  "AccelerationSettings",
)({ Mode: S.String.pipe(T.JsonName("mode")) }) {}
export class HopDestination extends S.Class<HopDestination>("HopDestination")({
  Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
  Queue: S.optional(S.String).pipe(T.JsonName("queue")),
  WaitMinutes: S.optional(S.Number).pipe(T.JsonName("waitMinutes")),
}) {}
export const __listOfHopDestination = S.Array(HopDestination);
export class AvailBlanking extends S.Class<AvailBlanking>("AvailBlanking")({
  AvailBlankingImage: S.optional(S.String).pipe(
    T.JsonName("availBlankingImage"),
  ),
}) {}
export class ColorConversion3DLUTSetting extends S.Class<ColorConversion3DLUTSetting>(
  "ColorConversion3DLUTSetting",
)({
  FileInput: S.optional(S.String).pipe(T.JsonName("fileInput")),
  InputColorSpace: S.optional(S.String).pipe(T.JsonName("inputColorSpace")),
  InputMasteringLuminance: S.optional(S.Number).pipe(
    T.JsonName("inputMasteringLuminance"),
  ),
  OutputColorSpace: S.optional(S.String).pipe(T.JsonName("outputColorSpace")),
  OutputMasteringLuminance: S.optional(S.Number).pipe(
    T.JsonName("outputMasteringLuminance"),
  ),
}) {}
export const __listOfColorConversion3DLUTSetting = S.Array(
  ColorConversion3DLUTSetting,
);
export class EsamManifestConfirmConditionNotification extends S.Class<EsamManifestConfirmConditionNotification>(
  "EsamManifestConfirmConditionNotification",
)({ MccXml: S.optional(S.String).pipe(T.JsonName("mccXml")) }) {}
export class EsamSignalProcessingNotification extends S.Class<EsamSignalProcessingNotification>(
  "EsamSignalProcessingNotification",
)({ SccXml: S.optional(S.String).pipe(T.JsonName("sccXml")) }) {}
export class EsamSettings extends S.Class<EsamSettings>("EsamSettings")({
  ManifestConfirmConditionNotification: S.optional(
    EsamManifestConfirmConditionNotification,
  ).pipe(T.JsonName("manifestConfirmConditionNotification")),
  ResponseSignalPreroll: S.optional(S.Number).pipe(
    T.JsonName("responseSignalPreroll"),
  ),
  SignalProcessingNotification: S.optional(
    EsamSignalProcessingNotification,
  ).pipe(T.JsonName("signalProcessingNotification")),
}) {}
export class ExtendedDataServices extends S.Class<ExtendedDataServices>(
  "ExtendedDataServices",
)({
  CopyProtectionAction: S.optional(S.String).pipe(
    T.JsonName("copyProtectionAction"),
  ),
  VchipAction: S.optional(S.String).pipe(T.JsonName("vchipAction")),
}) {}
export class AdvancedInputFilterSettings extends S.Class<AdvancedInputFilterSettings>(
  "AdvancedInputFilterSettings",
)({
  AddTexture: S.optional(S.String).pipe(T.JsonName("addTexture")),
  Sharpening: S.optional(S.String).pipe(T.JsonName("sharpening")),
}) {}
export const __listOf__stringMin1 = S.Array(S.String);
export class AudioSelectorGroup extends S.Class<AudioSelectorGroup>(
  "AudioSelectorGroup",
)({
  AudioSelectorNames: S.optional(__listOf__stringMin1).pipe(
    T.JsonName("audioSelectorNames"),
  ),
}) {}
export const __mapOfAudioSelectorGroup = S.Record({
  key: S.String,
  value: AudioSelectorGroup,
});
export class HlsRenditionGroupSettings extends S.Class<HlsRenditionGroupSettings>(
  "HlsRenditionGroupSettings",
)({
  RenditionGroupId: S.optional(S.String).pipe(T.JsonName("renditionGroupId")),
  RenditionLanguageCode: S.optional(S.String).pipe(
    T.JsonName("renditionLanguageCode"),
  ),
  RenditionName: S.optional(S.String).pipe(T.JsonName("renditionName")),
}) {}
export const __listOf__integerMin1Max2147483647 = S.Array(S.Number);
export const __listOf__integerMinNegative60Max6 = S.Array(S.Number);
export const __listOf__doubleMinNegative60Max6 = S.Array(S.Number);
export class OutputChannelMapping extends S.Class<OutputChannelMapping>(
  "OutputChannelMapping",
)({
  InputChannels: S.optional(__listOf__integerMinNegative60Max6).pipe(
    T.JsonName("inputChannels"),
  ),
  InputChannelsFineTune: S.optional(__listOf__doubleMinNegative60Max6).pipe(
    T.JsonName("inputChannelsFineTune"),
  ),
}) {}
export const __listOfOutputChannelMapping = S.Array(OutputChannelMapping);
export class ChannelMapping extends S.Class<ChannelMapping>("ChannelMapping")({
  OutputChannels: S.optional(__listOfOutputChannelMapping).pipe(
    T.JsonName("outputChannels"),
  ),
}) {}
export class RemixSettings extends S.Class<RemixSettings>("RemixSettings")({
  AudioDescriptionAudioChannel: S.optional(S.Number).pipe(
    T.JsonName("audioDescriptionAudioChannel"),
  ),
  AudioDescriptionDataChannel: S.optional(S.Number).pipe(
    T.JsonName("audioDescriptionDataChannel"),
  ),
  ChannelMapping: S.optional(ChannelMapping).pipe(T.JsonName("channelMapping")),
  ChannelsIn: S.optional(S.Number).pipe(T.JsonName("channelsIn")),
  ChannelsOut: S.optional(S.Number).pipe(T.JsonName("channelsOut")),
}) {}
export class AudioSelector extends S.Class<AudioSelector>("AudioSelector")({
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
  HlsRenditionGroupSettings: S.optional(HlsRenditionGroupSettings).pipe(
    T.JsonName("hlsRenditionGroupSettings"),
  ),
  LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
  Offset: S.optional(S.Number).pipe(T.JsonName("offset")),
  Pids: S.optional(__listOf__integerMin1Max2147483647).pipe(T.JsonName("pids")),
  ProgramSelection: S.optional(S.Number).pipe(T.JsonName("programSelection")),
  RemixSettings: S.optional(RemixSettings).pipe(T.JsonName("remixSettings")),
  SelectorType: S.optional(S.String).pipe(T.JsonName("selectorType")),
  Streams: S.optional(__listOf__integerMin1Max2147483647).pipe(
    T.JsonName("streams"),
  ),
  Tracks: S.optional(__listOf__integerMin1Max2147483647).pipe(
    T.JsonName("tracks"),
  ),
}) {}
export const __mapOfAudioSelector = S.Record({
  key: S.String,
  value: AudioSelector,
});
export class AncillarySourceSettings extends S.Class<AncillarySourceSettings>(
  "AncillarySourceSettings",
)({
  Convert608To708: S.optional(S.String).pipe(T.JsonName("convert608To708")),
  SourceAncillaryChannelNumber: S.optional(S.Number).pipe(
    T.JsonName("sourceAncillaryChannelNumber"),
  ),
  TerminateCaptions: S.optional(S.String).pipe(T.JsonName("terminateCaptions")),
}) {}
export class DvbSubSourceSettings extends S.Class<DvbSubSourceSettings>(
  "DvbSubSourceSettings",
)({ Pid: S.optional(S.Number).pipe(T.JsonName("pid")) }) {}
export class EmbeddedSourceSettings extends S.Class<EmbeddedSourceSettings>(
  "EmbeddedSourceSettings",
)({
  Convert608To708: S.optional(S.String).pipe(T.JsonName("convert608To708")),
  Source608ChannelNumber: S.optional(S.Number).pipe(
    T.JsonName("source608ChannelNumber"),
  ),
  Source608TrackNumber: S.optional(S.Number).pipe(
    T.JsonName("source608TrackNumber"),
  ),
  TerminateCaptions: S.optional(S.String).pipe(T.JsonName("terminateCaptions")),
}) {}
export class CaptionSourceFramerate extends S.Class<CaptionSourceFramerate>(
  "CaptionSourceFramerate",
)({
  FramerateDenominator: S.optional(S.Number).pipe(
    T.JsonName("framerateDenominator"),
  ),
  FramerateNumerator: S.optional(S.Number).pipe(
    T.JsonName("framerateNumerator"),
  ),
}) {}
export class FileSourceSettings extends S.Class<FileSourceSettings>(
  "FileSourceSettings",
)({
  ByteRateLimit: S.optional(S.String).pipe(T.JsonName("byteRateLimit")),
  Convert608To708: S.optional(S.String).pipe(T.JsonName("convert608To708")),
  ConvertPaintToPop: S.optional(S.String).pipe(T.JsonName("convertPaintToPop")),
  Framerate: S.optional(CaptionSourceFramerate).pipe(T.JsonName("framerate")),
  SourceFile: S.optional(S.String).pipe(T.JsonName("sourceFile")),
  TimeDelta: S.optional(S.Number).pipe(T.JsonName("timeDelta")),
  TimeDeltaUnits: S.optional(S.String).pipe(T.JsonName("timeDeltaUnits")),
  UpconvertSTLToTeletext: S.optional(S.String).pipe(
    T.JsonName("upconvertSTLToTeletext"),
  ),
}) {}
export class TeletextSourceSettings extends S.Class<TeletextSourceSettings>(
  "TeletextSourceSettings",
)({ PageNumber: S.optional(S.String).pipe(T.JsonName("pageNumber")) }) {}
export class TrackSourceSettings extends S.Class<TrackSourceSettings>(
  "TrackSourceSettings",
)({
  StreamNumber: S.optional(S.Number).pipe(T.JsonName("streamNumber")),
  TrackNumber: S.optional(S.Number).pipe(T.JsonName("trackNumber")),
}) {}
export class WebvttHlsSourceSettings extends S.Class<WebvttHlsSourceSettings>(
  "WebvttHlsSourceSettings",
)({
  RenditionGroupId: S.optional(S.String).pipe(T.JsonName("renditionGroupId")),
  RenditionLanguageCode: S.optional(S.String).pipe(
    T.JsonName("renditionLanguageCode"),
  ),
  RenditionName: S.optional(S.String).pipe(T.JsonName("renditionName")),
}) {}
export class CaptionSourceSettings extends S.Class<CaptionSourceSettings>(
  "CaptionSourceSettings",
)({
  AncillarySourceSettings: S.optional(AncillarySourceSettings).pipe(
    T.JsonName("ancillarySourceSettings"),
  ),
  DvbSubSourceSettings: S.optional(DvbSubSourceSettings).pipe(
    T.JsonName("dvbSubSourceSettings"),
  ),
  EmbeddedSourceSettings: S.optional(EmbeddedSourceSettings).pipe(
    T.JsonName("embeddedSourceSettings"),
  ),
  FileSourceSettings: S.optional(FileSourceSettings).pipe(
    T.JsonName("fileSourceSettings"),
  ),
  SourceType: S.optional(S.String).pipe(T.JsonName("sourceType")),
  TeletextSourceSettings: S.optional(TeletextSourceSettings).pipe(
    T.JsonName("teletextSourceSettings"),
  ),
  TrackSourceSettings: S.optional(TrackSourceSettings).pipe(
    T.JsonName("trackSourceSettings"),
  ),
  WebvttHlsSourceSettings: S.optional(WebvttHlsSourceSettings).pipe(
    T.JsonName("webvttHlsSourceSettings"),
  ),
}) {}
export class CaptionSelector extends S.Class<CaptionSelector>(
  "CaptionSelector",
)({
  CustomLanguageCode: S.optional(S.String).pipe(
    T.JsonName("customLanguageCode"),
  ),
  LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
  SourceSettings: S.optional(CaptionSourceSettings).pipe(
    T.JsonName("sourceSettings"),
  ),
}) {}
export const __mapOfCaptionSelector = S.Record({
  key: S.String,
  value: CaptionSelector,
});
export class Rectangle extends S.Class<Rectangle>("Rectangle")({
  Height: S.optional(S.Number).pipe(T.JsonName("height")),
  Width: S.optional(S.Number).pipe(T.JsonName("width")),
  X: S.optional(S.Number).pipe(T.JsonName("x")),
  Y: S.optional(S.Number).pipe(T.JsonName("y")),
}) {}
export class DynamicAudioSelector extends S.Class<DynamicAudioSelector>(
  "DynamicAudioSelector",
)({
  AudioDurationCorrection: S.optional(S.String).pipe(
    T.JsonName("audioDurationCorrection"),
  ),
  ExternalAudioFileInput: S.optional(S.String).pipe(
    T.JsonName("externalAudioFileInput"),
  ),
  LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
  Offset: S.optional(S.Number).pipe(T.JsonName("offset")),
  SelectorType: S.optional(S.String).pipe(T.JsonName("selectorType")),
}) {}
export const __mapOfDynamicAudioSelector = S.Record({
  key: S.String,
  value: DynamicAudioSelector,
});
export class InsertableImage extends S.Class<InsertableImage>(
  "InsertableImage",
)({
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
}) {}
export const __listOfInsertableImage = S.Array(InsertableImage);
export class ImageInserter extends S.Class<ImageInserter>("ImageInserter")({
  InsertableImages: S.optional(__listOfInsertableImage).pipe(
    T.JsonName("insertableImages"),
  ),
  SdrReferenceWhiteLevel: S.optional(S.Number).pipe(
    T.JsonName("sdrReferenceWhiteLevel"),
  ),
}) {}
export class InputClipping extends S.Class<InputClipping>("InputClipping")({
  EndTimecode: S.optional(S.String).pipe(T.JsonName("endTimecode")),
  StartTimecode: S.optional(S.String).pipe(T.JsonName("startTimecode")),
}) {}
export const __listOfInputClipping = S.Array(InputClipping);
export class VideoOverlayCrop extends S.Class<VideoOverlayCrop>(
  "VideoOverlayCrop",
)({
  Height: S.optional(S.Number).pipe(T.JsonName("height")),
  Unit: S.optional(S.String).pipe(T.JsonName("unit")),
  Width: S.optional(S.Number).pipe(T.JsonName("width")),
  X: S.optional(S.Number).pipe(T.JsonName("x")),
  Y: S.optional(S.Number).pipe(T.JsonName("y")),
}) {}
export class VideoOverlayPosition extends S.Class<VideoOverlayPosition>(
  "VideoOverlayPosition",
)({
  Height: S.optional(S.Number).pipe(T.JsonName("height")),
  Opacity: S.optional(S.Number).pipe(T.JsonName("opacity")),
  Unit: S.optional(S.String).pipe(T.JsonName("unit")),
  Width: S.optional(S.Number).pipe(T.JsonName("width")),
  XPosition: S.optional(S.Number).pipe(T.JsonName("xPosition")),
  YPosition: S.optional(S.Number).pipe(T.JsonName("yPosition")),
}) {}
export class VideoOverlayInputClipping extends S.Class<VideoOverlayInputClipping>(
  "VideoOverlayInputClipping",
)({
  EndTimecode: S.optional(S.String).pipe(T.JsonName("endTimecode")),
  StartTimecode: S.optional(S.String).pipe(T.JsonName("startTimecode")),
}) {}
export const __listOfVideoOverlayInputClipping = S.Array(
  VideoOverlayInputClipping,
);
export class VideoOverlayInput extends S.Class<VideoOverlayInput>(
  "VideoOverlayInput",
)({
  AudioSelectors: S.optional(__mapOfAudioSelector).pipe(
    T.JsonName("audioSelectors"),
  ),
  FileInput: S.optional(S.String).pipe(T.JsonName("fileInput")),
  InputClippings: S.optional(__listOfVideoOverlayInputClipping).pipe(
    T.JsonName("inputClippings"),
  ),
  TimecodeSource: S.optional(S.String).pipe(T.JsonName("timecodeSource")),
  TimecodeStart: S.optional(S.String).pipe(T.JsonName("timecodeStart")),
}) {}
export class VideoOverlayTransition extends S.Class<VideoOverlayTransition>(
  "VideoOverlayTransition",
)({
  EndPosition: S.optional(VideoOverlayPosition).pipe(T.JsonName("endPosition")),
  EndTimecode: S.optional(S.String).pipe(T.JsonName("endTimecode")),
  StartTimecode: S.optional(S.String).pipe(T.JsonName("startTimecode")),
}) {}
export const __listOfVideoOverlayTransition = S.Array(VideoOverlayTransition);
export class VideoOverlay extends S.Class<VideoOverlay>("VideoOverlay")({
  Crop: S.optional(VideoOverlayCrop).pipe(T.JsonName("crop")),
  EndTimecode: S.optional(S.String).pipe(T.JsonName("endTimecode")),
  InitialPosition: S.optional(VideoOverlayPosition).pipe(
    T.JsonName("initialPosition"),
  ),
  Input: S.optional(VideoOverlayInput).pipe(T.JsonName("input")),
  Playback: S.optional(S.String).pipe(T.JsonName("playback")),
  StartTimecode: S.optional(S.String).pipe(T.JsonName("startTimecode")),
  Transitions: S.optional(__listOfVideoOverlayTransition).pipe(
    T.JsonName("transitions"),
  ),
}) {}
export const __listOfVideoOverlay = S.Array(VideoOverlay);
export class Hdr10Metadata extends S.Class<Hdr10Metadata>("Hdr10Metadata")({
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
}) {}
export class VideoSelector extends S.Class<VideoSelector>("VideoSelector")({
  AlphaBehavior: S.optional(S.String).pipe(T.JsonName("alphaBehavior")),
  ColorSpace: S.optional(S.String).pipe(T.JsonName("colorSpace")),
  ColorSpaceUsage: S.optional(S.String).pipe(T.JsonName("colorSpaceUsage")),
  EmbeddedTimecodeOverride: S.optional(S.String).pipe(
    T.JsonName("embeddedTimecodeOverride"),
  ),
  Hdr10Metadata: S.optional(Hdr10Metadata).pipe(T.JsonName("hdr10Metadata")),
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
}) {}
export class InputTemplate extends S.Class<InputTemplate>("InputTemplate")({
  AdvancedInputFilter: S.optional(S.String).pipe(
    T.JsonName("advancedInputFilter"),
  ),
  AdvancedInputFilterSettings: S.optional(AdvancedInputFilterSettings).pipe(
    T.JsonName("advancedInputFilterSettings"),
  ),
  AudioSelectorGroups: S.optional(__mapOfAudioSelectorGroup).pipe(
    T.JsonName("audioSelectorGroups"),
  ),
  AudioSelectors: S.optional(__mapOfAudioSelector).pipe(
    T.JsonName("audioSelectors"),
  ),
  CaptionSelectors: S.optional(__mapOfCaptionSelector).pipe(
    T.JsonName("captionSelectors"),
  ),
  Crop: S.optional(Rectangle).pipe(T.JsonName("crop")),
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
  ImageInserter: S.optional(ImageInserter).pipe(T.JsonName("imageInserter")),
  InputClippings: S.optional(__listOfInputClipping).pipe(
    T.JsonName("inputClippings"),
  ),
  InputScanType: S.optional(S.String).pipe(T.JsonName("inputScanType")),
  Position: S.optional(Rectangle).pipe(T.JsonName("position")),
  ProgramNumber: S.optional(S.Number).pipe(T.JsonName("programNumber")),
  PsiControl: S.optional(S.String).pipe(T.JsonName("psiControl")),
  TimecodeSource: S.optional(S.String).pipe(T.JsonName("timecodeSource")),
  TimecodeStart: S.optional(S.String).pipe(T.JsonName("timecodeStart")),
  VideoOverlays: S.optional(__listOfVideoOverlay).pipe(
    T.JsonName("videoOverlays"),
  ),
  VideoSelector: S.optional(VideoSelector).pipe(T.JsonName("videoSelector")),
}) {}
export const __listOfInputTemplate = S.Array(InputTemplate);
export class KantarWatermarkSettings extends S.Class<KantarWatermarkSettings>(
  "KantarWatermarkSettings",
)({
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
}) {}
export class MotionImageInsertionFramerate extends S.Class<MotionImageInsertionFramerate>(
  "MotionImageInsertionFramerate",
)({
  FramerateDenominator: S.optional(S.Number).pipe(
    T.JsonName("framerateDenominator"),
  ),
  FramerateNumerator: S.optional(S.Number).pipe(
    T.JsonName("framerateNumerator"),
  ),
}) {}
export class MotionImageInsertionOffset extends S.Class<MotionImageInsertionOffset>(
  "MotionImageInsertionOffset",
)({
  ImageX: S.optional(S.Number).pipe(T.JsonName("imageX")),
  ImageY: S.optional(S.Number).pipe(T.JsonName("imageY")),
}) {}
export class MotionImageInserter extends S.Class<MotionImageInserter>(
  "MotionImageInserter",
)({
  Framerate: S.optional(MotionImageInsertionFramerate).pipe(
    T.JsonName("framerate"),
  ),
  Input: S.optional(S.String).pipe(T.JsonName("input")),
  InsertionMode: S.optional(S.String).pipe(T.JsonName("insertionMode")),
  Offset: S.optional(MotionImageInsertionOffset).pipe(T.JsonName("offset")),
  Playback: S.optional(S.String).pipe(T.JsonName("playback")),
  StartTime: S.optional(S.String).pipe(T.JsonName("startTime")),
}) {}
export class NielsenConfiguration extends S.Class<NielsenConfiguration>(
  "NielsenConfiguration",
)({
  BreakoutCode: S.optional(S.Number).pipe(T.JsonName("breakoutCode")),
  DistributorId: S.optional(S.String).pipe(T.JsonName("distributorId")),
}) {}
export class NielsenNonLinearWatermarkSettings extends S.Class<NielsenNonLinearWatermarkSettings>(
  "NielsenNonLinearWatermarkSettings",
)({
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
}) {}
export class AllowedRenditionSize extends S.Class<AllowedRenditionSize>(
  "AllowedRenditionSize",
)({
  Height: S.optional(S.Number).pipe(T.JsonName("height")),
  Required: S.optional(S.String).pipe(T.JsonName("required")),
  Width: S.optional(S.Number).pipe(T.JsonName("width")),
}) {}
export const __listOfAllowedRenditionSize = S.Array(AllowedRenditionSize);
export class ForceIncludeRenditionSize extends S.Class<ForceIncludeRenditionSize>(
  "ForceIncludeRenditionSize",
)({
  Height: S.optional(S.Number).pipe(T.JsonName("height")),
  Width: S.optional(S.Number).pipe(T.JsonName("width")),
}) {}
export const __listOfForceIncludeRenditionSize = S.Array(
  ForceIncludeRenditionSize,
);
export class MinBottomRenditionSize extends S.Class<MinBottomRenditionSize>(
  "MinBottomRenditionSize",
)({
  Height: S.optional(S.Number).pipe(T.JsonName("height")),
  Width: S.optional(S.Number).pipe(T.JsonName("width")),
}) {}
export class MinTopRenditionSize extends S.Class<MinTopRenditionSize>(
  "MinTopRenditionSize",
)({
  Height: S.optional(S.Number).pipe(T.JsonName("height")),
  Width: S.optional(S.Number).pipe(T.JsonName("width")),
}) {}
export class AutomatedAbrRule extends S.Class<AutomatedAbrRule>(
  "AutomatedAbrRule",
)({
  AllowedRenditions: S.optional(__listOfAllowedRenditionSize).pipe(
    T.JsonName("allowedRenditions"),
  ),
  ForceIncludeRenditions: S.optional(__listOfForceIncludeRenditionSize).pipe(
    T.JsonName("forceIncludeRenditions"),
  ),
  MinBottomRenditionSize: S.optional(MinBottomRenditionSize).pipe(
    T.JsonName("minBottomRenditionSize"),
  ),
  MinTopRenditionSize: S.optional(MinTopRenditionSize).pipe(
    T.JsonName("minTopRenditionSize"),
  ),
  Type: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export const __listOfAutomatedAbrRule = S.Array(AutomatedAbrRule);
export class AutomatedAbrSettings extends S.Class<AutomatedAbrSettings>(
  "AutomatedAbrSettings",
)({
  MaxAbrBitrate: S.optional(S.Number).pipe(T.JsonName("maxAbrBitrate")),
  MaxQualityLevel: S.optional(S.Number).pipe(T.JsonName("maxQualityLevel")),
  MaxRenditions: S.optional(S.Number).pipe(T.JsonName("maxRenditions")),
  MinAbrBitrate: S.optional(S.Number).pipe(T.JsonName("minAbrBitrate")),
  Rules: S.optional(__listOfAutomatedAbrRule).pipe(T.JsonName("rules")),
}) {}
export class AutomatedEncodingSettings extends S.Class<AutomatedEncodingSettings>(
  "AutomatedEncodingSettings",
)({
  AbrSettings: S.optional(AutomatedAbrSettings).pipe(T.JsonName("abrSettings")),
}) {}
export class CmafAdditionalManifest extends S.Class<CmafAdditionalManifest>(
  "CmafAdditionalManifest",
)({
  ManifestNameModifier: S.optional(S.String).pipe(
    T.JsonName("manifestNameModifier"),
  ),
  SelectedOutputs: S.optional(__listOf__stringMin1).pipe(
    T.JsonName("selectedOutputs"),
  ),
}) {}
export const __listOfCmafAdditionalManifest = S.Array(CmafAdditionalManifest);
export class S3DestinationAccessControl extends S.Class<S3DestinationAccessControl>(
  "S3DestinationAccessControl",
)({ CannedAcl: S.optional(S.String).pipe(T.JsonName("cannedAcl")) }) {}
export class S3EncryptionSettings extends S.Class<S3EncryptionSettings>(
  "S3EncryptionSettings",
)({
  EncryptionType: S.optional(S.String).pipe(T.JsonName("encryptionType")),
  KmsEncryptionContext: S.optional(S.String).pipe(
    T.JsonName("kmsEncryptionContext"),
  ),
  KmsKeyArn: S.optional(S.String).pipe(T.JsonName("kmsKeyArn")),
}) {}
export class S3DestinationSettings extends S.Class<S3DestinationSettings>(
  "S3DestinationSettings",
)({
  AccessControl: S.optional(S3DestinationAccessControl).pipe(
    T.JsonName("accessControl"),
  ),
  Encryption: S.optional(S3EncryptionSettings).pipe(T.JsonName("encryption")),
  StorageClass: S.optional(S.String).pipe(T.JsonName("storageClass")),
}) {}
export class DestinationSettings extends S.Class<DestinationSettings>(
  "DestinationSettings",
)({
  S3Settings: S.optional(S3DestinationSettings).pipe(T.JsonName("s3Settings")),
}) {}
export const __listOf__stringMin36Max36Pattern09aFAF809aFAF409aFAF409aFAF409aFAF12 =
  S.Array(S.String);
export class EncryptionContractConfiguration extends S.Class<EncryptionContractConfiguration>(
  "EncryptionContractConfiguration",
)({
  SpekeAudioPreset: S.optional(S.String).pipe(T.JsonName("spekeAudioPreset")),
  SpekeVideoPreset: S.optional(S.String).pipe(T.JsonName("spekeVideoPreset")),
}) {}
export class SpekeKeyProviderCmaf extends S.Class<SpekeKeyProviderCmaf>(
  "SpekeKeyProviderCmaf",
)({
  CertificateArn: S.optional(S.String).pipe(T.JsonName("certificateArn")),
  DashSignaledSystemIds: S.optional(
    __listOf__stringMin36Max36Pattern09aFAF809aFAF409aFAF409aFAF409aFAF12,
  ).pipe(T.JsonName("dashSignaledSystemIds")),
  EncryptionContractConfiguration: S.optional(
    EncryptionContractConfiguration,
  ).pipe(T.JsonName("encryptionContractConfiguration")),
  HlsSignaledSystemIds: S.optional(
    __listOf__stringMin36Max36Pattern09aFAF809aFAF409aFAF409aFAF409aFAF12,
  ).pipe(T.JsonName("hlsSignaledSystemIds")),
  ResourceId: S.optional(S.String).pipe(T.JsonName("resourceId")),
  Url: S.optional(S.String).pipe(T.JsonName("url")),
}) {}
export class StaticKeyProvider extends S.Class<StaticKeyProvider>(
  "StaticKeyProvider",
)({
  KeyFormat: S.optional(S.String).pipe(T.JsonName("keyFormat")),
  KeyFormatVersions: S.optional(S.String).pipe(T.JsonName("keyFormatVersions")),
  StaticKeyValue: S.optional(S.String).pipe(T.JsonName("staticKeyValue")),
  Url: S.optional(S.String).pipe(T.JsonName("url")),
}) {}
export class CmafEncryptionSettings extends S.Class<CmafEncryptionSettings>(
  "CmafEncryptionSettings",
)({
  ConstantInitializationVector: S.optional(S.String).pipe(
    T.JsonName("constantInitializationVector"),
  ),
  EncryptionMethod: S.optional(S.String).pipe(T.JsonName("encryptionMethod")),
  InitializationVectorInManifest: S.optional(S.String).pipe(
    T.JsonName("initializationVectorInManifest"),
  ),
  SpekeKeyProvider: S.optional(SpekeKeyProviderCmaf).pipe(
    T.JsonName("spekeKeyProvider"),
  ),
  StaticKeyProvider: S.optional(StaticKeyProvider).pipe(
    T.JsonName("staticKeyProvider"),
  ),
  Type: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export class CmafImageBasedTrickPlaySettings extends S.Class<CmafImageBasedTrickPlaySettings>(
  "CmafImageBasedTrickPlaySettings",
)({
  IntervalCadence: S.optional(S.String).pipe(T.JsonName("intervalCadence")),
  ThumbnailHeight: S.optional(S.Number).pipe(T.JsonName("thumbnailHeight")),
  ThumbnailInterval: S.optional(S.Number).pipe(T.JsonName("thumbnailInterval")),
  ThumbnailWidth: S.optional(S.Number).pipe(T.JsonName("thumbnailWidth")),
  TileHeight: S.optional(S.Number).pipe(T.JsonName("tileHeight")),
  TileWidth: S.optional(S.Number).pipe(T.JsonName("tileWidth")),
}) {}
export class CmafGroupSettings extends S.Class<CmafGroupSettings>(
  "CmafGroupSettings",
)({
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
  DashManifestStyle: S.optional(S.String).pipe(T.JsonName("dashManifestStyle")),
  Destination: S.optional(S.String).pipe(T.JsonName("destination")),
  DestinationSettings: S.optional(DestinationSettings).pipe(
    T.JsonName("destinationSettings"),
  ),
  Encryption: S.optional(CmafEncryptionSettings).pipe(T.JsonName("encryption")),
  FragmentLength: S.optional(S.Number).pipe(T.JsonName("fragmentLength")),
  ImageBasedTrickPlay: S.optional(S.String).pipe(
    T.JsonName("imageBasedTrickPlay"),
  ),
  ImageBasedTrickPlaySettings: S.optional(CmafImageBasedTrickPlaySettings).pipe(
    T.JsonName("imageBasedTrickPlaySettings"),
  ),
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
  WriteDashManifest: S.optional(S.String).pipe(T.JsonName("writeDashManifest")),
  WriteHlsManifest: S.optional(S.String).pipe(T.JsonName("writeHlsManifest")),
  WriteSegmentTimelineInRepresentation: S.optional(S.String).pipe(
    T.JsonName("writeSegmentTimelineInRepresentation"),
  ),
}) {}
export class DashAdditionalManifest extends S.Class<DashAdditionalManifest>(
  "DashAdditionalManifest",
)({
  ManifestNameModifier: S.optional(S.String).pipe(
    T.JsonName("manifestNameModifier"),
  ),
  SelectedOutputs: S.optional(__listOf__stringMin1).pipe(
    T.JsonName("selectedOutputs"),
  ),
}) {}
export const __listOfDashAdditionalManifest = S.Array(DashAdditionalManifest);
export const __listOf__stringPattern09aFAF809aFAF409aFAF409aFAF409aFAF12 =
  S.Array(S.String);
export class SpekeKeyProvider extends S.Class<SpekeKeyProvider>(
  "SpekeKeyProvider",
)({
  CertificateArn: S.optional(S.String).pipe(T.JsonName("certificateArn")),
  EncryptionContractConfiguration: S.optional(
    EncryptionContractConfiguration,
  ).pipe(T.JsonName("encryptionContractConfiguration")),
  ResourceId: S.optional(S.String).pipe(T.JsonName("resourceId")),
  SystemIds: S.optional(
    __listOf__stringPattern09aFAF809aFAF409aFAF409aFAF409aFAF12,
  ).pipe(T.JsonName("systemIds")),
  Url: S.optional(S.String).pipe(T.JsonName("url")),
}) {}
export class DashIsoEncryptionSettings extends S.Class<DashIsoEncryptionSettings>(
  "DashIsoEncryptionSettings",
)({
  PlaybackDeviceCompatibility: S.optional(S.String).pipe(
    T.JsonName("playbackDeviceCompatibility"),
  ),
  SpekeKeyProvider: S.optional(SpekeKeyProvider).pipe(
    T.JsonName("spekeKeyProvider"),
  ),
}) {}
export class DashIsoImageBasedTrickPlaySettings extends S.Class<DashIsoImageBasedTrickPlaySettings>(
  "DashIsoImageBasedTrickPlaySettings",
)({
  IntervalCadence: S.optional(S.String).pipe(T.JsonName("intervalCadence")),
  ThumbnailHeight: S.optional(S.Number).pipe(T.JsonName("thumbnailHeight")),
  ThumbnailInterval: S.optional(S.Number).pipe(T.JsonName("thumbnailInterval")),
  ThumbnailWidth: S.optional(S.Number).pipe(T.JsonName("thumbnailWidth")),
  TileHeight: S.optional(S.Number).pipe(T.JsonName("tileHeight")),
  TileWidth: S.optional(S.Number).pipe(T.JsonName("tileWidth")),
}) {}
export class DashIsoGroupSettings extends S.Class<DashIsoGroupSettings>(
  "DashIsoGroupSettings",
)({
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
  DashManifestStyle: S.optional(S.String).pipe(T.JsonName("dashManifestStyle")),
  Destination: S.optional(S.String).pipe(T.JsonName("destination")),
  DestinationSettings: S.optional(DestinationSettings).pipe(
    T.JsonName("destinationSettings"),
  ),
  Encryption: S.optional(DashIsoEncryptionSettings).pipe(
    T.JsonName("encryption"),
  ),
  FragmentLength: S.optional(S.Number).pipe(T.JsonName("fragmentLength")),
  HbbtvCompliance: S.optional(S.String).pipe(T.JsonName("hbbtvCompliance")),
  ImageBasedTrickPlay: S.optional(S.String).pipe(
    T.JsonName("imageBasedTrickPlay"),
  ),
  ImageBasedTrickPlaySettings: S.optional(
    DashIsoImageBasedTrickPlaySettings,
  ).pipe(T.JsonName("imageBasedTrickPlaySettings")),
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
}) {}
export class FileGroupSettings extends S.Class<FileGroupSettings>(
  "FileGroupSettings",
)({
  Destination: S.optional(S.String).pipe(T.JsonName("destination")),
  DestinationSettings: S.optional(DestinationSettings).pipe(
    T.JsonName("destinationSettings"),
  ),
}) {}
export const __listOfHlsAdMarkers = S.Array(S.String);
export class HlsAdditionalManifest extends S.Class<HlsAdditionalManifest>(
  "HlsAdditionalManifest",
)({
  ManifestNameModifier: S.optional(S.String).pipe(
    T.JsonName("manifestNameModifier"),
  ),
  SelectedOutputs: S.optional(__listOf__stringMin1).pipe(
    T.JsonName("selectedOutputs"),
  ),
}) {}
export const __listOfHlsAdditionalManifest = S.Array(HlsAdditionalManifest);
export class HlsCaptionLanguageMapping extends S.Class<HlsCaptionLanguageMapping>(
  "HlsCaptionLanguageMapping",
)({
  CaptionChannel: S.optional(S.Number).pipe(T.JsonName("captionChannel")),
  CustomLanguageCode: S.optional(S.String).pipe(
    T.JsonName("customLanguageCode"),
  ),
  LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
  LanguageDescription: S.optional(S.String).pipe(
    T.JsonName("languageDescription"),
  ),
}) {}
export const __listOfHlsCaptionLanguageMapping = S.Array(
  HlsCaptionLanguageMapping,
);
export class HlsEncryptionSettings extends S.Class<HlsEncryptionSettings>(
  "HlsEncryptionSettings",
)({
  ConstantInitializationVector: S.optional(S.String).pipe(
    T.JsonName("constantInitializationVector"),
  ),
  EncryptionMethod: S.optional(S.String).pipe(T.JsonName("encryptionMethod")),
  InitializationVectorInManifest: S.optional(S.String).pipe(
    T.JsonName("initializationVectorInManifest"),
  ),
  OfflineEncrypted: S.optional(S.String).pipe(T.JsonName("offlineEncrypted")),
  SpekeKeyProvider: S.optional(SpekeKeyProvider).pipe(
    T.JsonName("spekeKeyProvider"),
  ),
  StaticKeyProvider: S.optional(StaticKeyProvider).pipe(
    T.JsonName("staticKeyProvider"),
  ),
  Type: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export class HlsImageBasedTrickPlaySettings extends S.Class<HlsImageBasedTrickPlaySettings>(
  "HlsImageBasedTrickPlaySettings",
)({
  IntervalCadence: S.optional(S.String).pipe(T.JsonName("intervalCadence")),
  ThumbnailHeight: S.optional(S.Number).pipe(T.JsonName("thumbnailHeight")),
  ThumbnailInterval: S.optional(S.Number).pipe(T.JsonName("thumbnailInterval")),
  ThumbnailWidth: S.optional(S.Number).pipe(T.JsonName("thumbnailWidth")),
  TileHeight: S.optional(S.Number).pipe(T.JsonName("tileHeight")),
  TileWidth: S.optional(S.Number).pipe(T.JsonName("tileWidth")),
}) {}
export class HlsGroupSettings extends S.Class<HlsGroupSettings>(
  "HlsGroupSettings",
)({
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
  DestinationSettings: S.optional(DestinationSettings).pipe(
    T.JsonName("destinationSettings"),
  ),
  DirectoryStructure: S.optional(S.String).pipe(
    T.JsonName("directoryStructure"),
  ),
  Encryption: S.optional(HlsEncryptionSettings).pipe(T.JsonName("encryption")),
  ImageBasedTrickPlay: S.optional(S.String).pipe(
    T.JsonName("imageBasedTrickPlay"),
  ),
  ImageBasedTrickPlaySettings: S.optional(HlsImageBasedTrickPlaySettings).pipe(
    T.JsonName("imageBasedTrickPlaySettings"),
  ),
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
}) {}
export class MsSmoothAdditionalManifest extends S.Class<MsSmoothAdditionalManifest>(
  "MsSmoothAdditionalManifest",
)({
  ManifestNameModifier: S.optional(S.String).pipe(
    T.JsonName("manifestNameModifier"),
  ),
  SelectedOutputs: S.optional(__listOf__stringMin1).pipe(
    T.JsonName("selectedOutputs"),
  ),
}) {}
export const __listOfMsSmoothAdditionalManifest = S.Array(
  MsSmoothAdditionalManifest,
);
export class MsSmoothEncryptionSettings extends S.Class<MsSmoothEncryptionSettings>(
  "MsSmoothEncryptionSettings",
)({
  SpekeKeyProvider: S.optional(SpekeKeyProvider).pipe(
    T.JsonName("spekeKeyProvider"),
  ),
}) {}
export class MsSmoothGroupSettings extends S.Class<MsSmoothGroupSettings>(
  "MsSmoothGroupSettings",
)({
  AdditionalManifests: S.optional(__listOfMsSmoothAdditionalManifest).pipe(
    T.JsonName("additionalManifests"),
  ),
  AudioDeduplication: S.optional(S.String).pipe(
    T.JsonName("audioDeduplication"),
  ),
  Destination: S.optional(S.String).pipe(T.JsonName("destination")),
  DestinationSettings: S.optional(DestinationSettings).pipe(
    T.JsonName("destinationSettings"),
  ),
  Encryption: S.optional(MsSmoothEncryptionSettings).pipe(
    T.JsonName("encryption"),
  ),
  FragmentLength: S.optional(S.Number).pipe(T.JsonName("fragmentLength")),
  FragmentLengthControl: S.optional(S.String).pipe(
    T.JsonName("fragmentLengthControl"),
  ),
  ManifestEncoding: S.optional(S.String).pipe(T.JsonName("manifestEncoding")),
}) {}
export const __listOfFrameMetricType = S.Array(S.String);
export class OutputGroupSettings extends S.Class<OutputGroupSettings>(
  "OutputGroupSettings",
)({
  CmafGroupSettings: S.optional(CmafGroupSettings).pipe(
    T.JsonName("cmafGroupSettings"),
  ),
  DashIsoGroupSettings: S.optional(DashIsoGroupSettings).pipe(
    T.JsonName("dashIsoGroupSettings"),
  ),
  FileGroupSettings: S.optional(FileGroupSettings).pipe(
    T.JsonName("fileGroupSettings"),
  ),
  HlsGroupSettings: S.optional(HlsGroupSettings).pipe(
    T.JsonName("hlsGroupSettings"),
  ),
  MsSmoothGroupSettings: S.optional(MsSmoothGroupSettings).pipe(
    T.JsonName("msSmoothGroupSettings"),
  ),
  PerFrameMetrics: S.optional(__listOfFrameMetricType).pipe(
    T.JsonName("perFrameMetrics"),
  ),
  Type: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export const __listOfAudioChannelTag = S.Array(S.String);
export class AudioChannelTaggingSettings extends S.Class<AudioChannelTaggingSettings>(
  "AudioChannelTaggingSettings",
)({
  ChannelTag: S.optional(S.String).pipe(T.JsonName("channelTag")),
  ChannelTags: S.optional(__listOfAudioChannelTag).pipe(
    T.JsonName("channelTags"),
  ),
}) {}
export class AudioNormalizationSettings extends S.Class<AudioNormalizationSettings>(
  "AudioNormalizationSettings",
)({
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
}) {}
export class AudioPitchCorrectionSettings extends S.Class<AudioPitchCorrectionSettings>(
  "AudioPitchCorrectionSettings",
)({
  SlowPalPitchCorrection: S.optional(S.String).pipe(
    T.JsonName("slowPalPitchCorrection"),
  ),
}) {}
export class AacSettings extends S.Class<AacSettings>("AacSettings")({
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
}) {}
export class Ac3Settings extends S.Class<Ac3Settings>("Ac3Settings")({
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
}) {}
export class AiffSettings extends S.Class<AiffSettings>("AiffSettings")({
  BitDepth: S.optional(S.Number).pipe(T.JsonName("bitDepth")),
  Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
  SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
}) {}
export class Eac3AtmosSettings extends S.Class<Eac3AtmosSettings>(
  "Eac3AtmosSettings",
)({
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
}) {}
export class Eac3Settings extends S.Class<Eac3Settings>("Eac3Settings")({
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
}) {}
export class FlacSettings extends S.Class<FlacSettings>("FlacSettings")({
  BitDepth: S.optional(S.Number).pipe(T.JsonName("bitDepth")),
  Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
  SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
}) {}
export class Mp2Settings extends S.Class<Mp2Settings>("Mp2Settings")({
  AudioDescriptionMix: S.optional(S.String).pipe(
    T.JsonName("audioDescriptionMix"),
  ),
  Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
  Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
  SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
}) {}
export class Mp3Settings extends S.Class<Mp3Settings>("Mp3Settings")({
  Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
  Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
  RateControlMode: S.optional(S.String).pipe(T.JsonName("rateControlMode")),
  SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
  VbrQuality: S.optional(S.Number).pipe(T.JsonName("vbrQuality")),
}) {}
export class OpusSettings extends S.Class<OpusSettings>("OpusSettings")({
  Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
  Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
  SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
}) {}
export class VorbisSettings extends S.Class<VorbisSettings>("VorbisSettings")({
  Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
  SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
  VbrQuality: S.optional(S.Number).pipe(T.JsonName("vbrQuality")),
}) {}
export class WavSettings extends S.Class<WavSettings>("WavSettings")({
  BitDepth: S.optional(S.Number).pipe(T.JsonName("bitDepth")),
  Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
  Format: S.optional(S.String).pipe(T.JsonName("format")),
  SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
}) {}
export class AudioCodecSettings extends S.Class<AudioCodecSettings>(
  "AudioCodecSettings",
)({
  AacSettings: S.optional(AacSettings).pipe(T.JsonName("aacSettings")),
  Ac3Settings: S.optional(Ac3Settings).pipe(T.JsonName("ac3Settings")),
  AiffSettings: S.optional(AiffSettings).pipe(T.JsonName("aiffSettings")),
  Codec: S.optional(S.String).pipe(T.JsonName("codec")),
  Eac3AtmosSettings: S.optional(Eac3AtmosSettings).pipe(
    T.JsonName("eac3AtmosSettings"),
  ),
  Eac3Settings: S.optional(Eac3Settings).pipe(T.JsonName("eac3Settings")),
  FlacSettings: S.optional(FlacSettings).pipe(T.JsonName("flacSettings")),
  Mp2Settings: S.optional(Mp2Settings).pipe(T.JsonName("mp2Settings")),
  Mp3Settings: S.optional(Mp3Settings).pipe(T.JsonName("mp3Settings")),
  OpusSettings: S.optional(OpusSettings).pipe(T.JsonName("opusSettings")),
  VorbisSettings: S.optional(VorbisSettings).pipe(T.JsonName("vorbisSettings")),
  WavSettings: S.optional(WavSettings).pipe(T.JsonName("wavSettings")),
}) {}
export class AudioDescription extends S.Class<AudioDescription>(
  "AudioDescription",
)({
  AudioChannelTaggingSettings: S.optional(AudioChannelTaggingSettings).pipe(
    T.JsonName("audioChannelTaggingSettings"),
  ),
  AudioNormalizationSettings: S.optional(AudioNormalizationSettings).pipe(
    T.JsonName("audioNormalizationSettings"),
  ),
  AudioPitchCorrectionSettings: S.optional(AudioPitchCorrectionSettings).pipe(
    T.JsonName("audioPitchCorrectionSettings"),
  ),
  AudioSourceName: S.optional(S.String).pipe(T.JsonName("audioSourceName")),
  AudioType: S.optional(S.Number).pipe(T.JsonName("audioType")),
  AudioTypeControl: S.optional(S.String).pipe(T.JsonName("audioTypeControl")),
  CodecSettings: S.optional(AudioCodecSettings).pipe(
    T.JsonName("codecSettings"),
  ),
  CustomLanguageCode: S.optional(S.String).pipe(
    T.JsonName("customLanguageCode"),
  ),
  LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
  LanguageCodeControl: S.optional(S.String).pipe(
    T.JsonName("languageCodeControl"),
  ),
  RemixSettings: S.optional(RemixSettings).pipe(T.JsonName("remixSettings")),
  StreamName: S.optional(S.String).pipe(T.JsonName("streamName")),
}) {}
export const __listOfAudioDescription = S.Array(AudioDescription);
export class BurninDestinationSettings extends S.Class<BurninDestinationSettings>(
  "BurninDestinationSettings",
)({
  Alignment: S.optional(S.String).pipe(T.JsonName("alignment")),
  ApplyFontColor: S.optional(S.String).pipe(T.JsonName("applyFontColor")),
  BackgroundColor: S.optional(S.String).pipe(T.JsonName("backgroundColor")),
  BackgroundOpacity: S.optional(S.Number).pipe(T.JsonName("backgroundOpacity")),
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
}) {}
export class DvbSubDestinationSettings extends S.Class<DvbSubDestinationSettings>(
  "DvbSubDestinationSettings",
)({
  Alignment: S.optional(S.String).pipe(T.JsonName("alignment")),
  ApplyFontColor: S.optional(S.String).pipe(T.JsonName("applyFontColor")),
  BackgroundColor: S.optional(S.String).pipe(T.JsonName("backgroundColor")),
  BackgroundOpacity: S.optional(S.Number).pipe(T.JsonName("backgroundOpacity")),
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
}) {}
export class EmbeddedDestinationSettings extends S.Class<EmbeddedDestinationSettings>(
  "EmbeddedDestinationSettings",
)({
  Destination608ChannelNumber: S.optional(S.Number).pipe(
    T.JsonName("destination608ChannelNumber"),
  ),
  Destination708ServiceNumber: S.optional(S.Number).pipe(
    T.JsonName("destination708ServiceNumber"),
  ),
}) {}
export class ImscDestinationSettings extends S.Class<ImscDestinationSettings>(
  "ImscDestinationSettings",
)({
  Accessibility: S.optional(S.String).pipe(T.JsonName("accessibility")),
  StylePassthrough: S.optional(S.String).pipe(T.JsonName("stylePassthrough")),
}) {}
export class SccDestinationSettings extends S.Class<SccDestinationSettings>(
  "SccDestinationSettings",
)({ Framerate: S.optional(S.String).pipe(T.JsonName("framerate")) }) {}
export class SrtDestinationSettings extends S.Class<SrtDestinationSettings>(
  "SrtDestinationSettings",
)({
  StylePassthrough: S.optional(S.String).pipe(T.JsonName("stylePassthrough")),
}) {}
export const __listOfTeletextPageType = S.Array(S.String);
export class TeletextDestinationSettings extends S.Class<TeletextDestinationSettings>(
  "TeletextDestinationSettings",
)({
  PageNumber: S.optional(S.String).pipe(T.JsonName("pageNumber")),
  PageTypes: S.optional(__listOfTeletextPageType).pipe(T.JsonName("pageTypes")),
}) {}
export class TtmlDestinationSettings extends S.Class<TtmlDestinationSettings>(
  "TtmlDestinationSettings",
)({
  StylePassthrough: S.optional(S.String).pipe(T.JsonName("stylePassthrough")),
}) {}
export class WebvttDestinationSettings extends S.Class<WebvttDestinationSettings>(
  "WebvttDestinationSettings",
)({
  Accessibility: S.optional(S.String).pipe(T.JsonName("accessibility")),
  StylePassthrough: S.optional(S.String).pipe(T.JsonName("stylePassthrough")),
}) {}
export class CaptionDestinationSettings extends S.Class<CaptionDestinationSettings>(
  "CaptionDestinationSettings",
)({
  BurninDestinationSettings: S.optional(BurninDestinationSettings).pipe(
    T.JsonName("burninDestinationSettings"),
  ),
  DestinationType: S.optional(S.String).pipe(T.JsonName("destinationType")),
  DvbSubDestinationSettings: S.optional(DvbSubDestinationSettings).pipe(
    T.JsonName("dvbSubDestinationSettings"),
  ),
  EmbeddedDestinationSettings: S.optional(EmbeddedDestinationSettings).pipe(
    T.JsonName("embeddedDestinationSettings"),
  ),
  ImscDestinationSettings: S.optional(ImscDestinationSettings).pipe(
    T.JsonName("imscDestinationSettings"),
  ),
  SccDestinationSettings: S.optional(SccDestinationSettings).pipe(
    T.JsonName("sccDestinationSettings"),
  ),
  SrtDestinationSettings: S.optional(SrtDestinationSettings).pipe(
    T.JsonName("srtDestinationSettings"),
  ),
  TeletextDestinationSettings: S.optional(TeletextDestinationSettings).pipe(
    T.JsonName("teletextDestinationSettings"),
  ),
  TtmlDestinationSettings: S.optional(TtmlDestinationSettings).pipe(
    T.JsonName("ttmlDestinationSettings"),
  ),
  WebvttDestinationSettings: S.optional(WebvttDestinationSettings).pipe(
    T.JsonName("webvttDestinationSettings"),
  ),
}) {}
export class CaptionDescription extends S.Class<CaptionDescription>(
  "CaptionDescription",
)({
  CaptionSelectorName: S.optional(S.String).pipe(
    T.JsonName("captionSelectorName"),
  ),
  CustomLanguageCode: S.optional(S.String).pipe(
    T.JsonName("customLanguageCode"),
  ),
  DestinationSettings: S.optional(CaptionDestinationSettings).pipe(
    T.JsonName("destinationSettings"),
  ),
  LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
  LanguageDescription: S.optional(S.String).pipe(
    T.JsonName("languageDescription"),
  ),
}) {}
export const __listOfCaptionDescription = S.Array(CaptionDescription);
export class CmfcSettings extends S.Class<CmfcSettings>("CmfcSettings")({
  AudioDuration: S.optional(S.String).pipe(T.JsonName("audioDuration")),
  AudioGroupId: S.optional(S.String).pipe(T.JsonName("audioGroupId")),
  AudioRenditionSets: S.optional(S.String).pipe(
    T.JsonName("audioRenditionSets"),
  ),
  AudioTrackType: S.optional(S.String).pipe(T.JsonName("audioTrackType")),
  C2paManifest: S.optional(S.String).pipe(T.JsonName("c2paManifest")),
  CertificateSecret: S.optional(S.String).pipe(T.JsonName("certificateSecret")),
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
}) {}
export class F4vSettings extends S.Class<F4vSettings>("F4vSettings")({
  MoovPlacement: S.optional(S.String).pipe(T.JsonName("moovPlacement")),
}) {}
export const __listOf__integerMin32Max8182 = S.Array(S.Number);
export class DvbNitSettings extends S.Class<DvbNitSettings>("DvbNitSettings")({
  NetworkId: S.optional(S.Number).pipe(T.JsonName("networkId")),
  NetworkName: S.optional(S.String).pipe(T.JsonName("networkName")),
  NitInterval: S.optional(S.Number).pipe(T.JsonName("nitInterval")),
}) {}
export class DvbSdtSettings extends S.Class<DvbSdtSettings>("DvbSdtSettings")({
  OutputSdt: S.optional(S.String).pipe(T.JsonName("outputSdt")),
  SdtInterval: S.optional(S.Number).pipe(T.JsonName("sdtInterval")),
  ServiceName: S.optional(S.String).pipe(T.JsonName("serviceName")),
  ServiceProviderName: S.optional(S.String).pipe(
    T.JsonName("serviceProviderName"),
  ),
}) {}
export class DvbTdtSettings extends S.Class<DvbTdtSettings>("DvbTdtSettings")({
  TdtInterval: S.optional(S.Number).pipe(T.JsonName("tdtInterval")),
}) {}
export class M2tsScte35Esam extends S.Class<M2tsScte35Esam>("M2tsScte35Esam")({
  Scte35EsamPid: S.optional(S.Number).pipe(T.JsonName("scte35EsamPid")),
}) {}
export class M2tsSettings extends S.Class<M2tsSettings>("M2tsSettings")({
  AudioBufferModel: S.optional(S.String).pipe(T.JsonName("audioBufferModel")),
  AudioDuration: S.optional(S.String).pipe(T.JsonName("audioDuration")),
  AudioFramesPerPes: S.optional(S.Number).pipe(T.JsonName("audioFramesPerPes")),
  AudioPids: S.optional(__listOf__integerMin32Max8182).pipe(
    T.JsonName("audioPids"),
  ),
  AudioPtsOffsetDelta: S.optional(S.Number).pipe(
    T.JsonName("audioPtsOffsetDelta"),
  ),
  Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
  BufferModel: S.optional(S.String).pipe(T.JsonName("bufferModel")),
  DataPTSControl: S.optional(S.String).pipe(T.JsonName("dataPTSControl")),
  DvbNitSettings: S.optional(DvbNitSettings).pipe(T.JsonName("dvbNitSettings")),
  DvbSdtSettings: S.optional(DvbSdtSettings).pipe(T.JsonName("dvbSdtSettings")),
  DvbSubPids: S.optional(__listOf__integerMin32Max8182).pipe(
    T.JsonName("dvbSubPids"),
  ),
  DvbTdtSettings: S.optional(DvbTdtSettings).pipe(T.JsonName("dvbTdtSettings")),
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
  NullPacketBitrate: S.optional(S.Number).pipe(T.JsonName("nullPacketBitrate")),
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
  Scte35Esam: S.optional(M2tsScte35Esam).pipe(T.JsonName("scte35Esam")),
  Scte35Pid: S.optional(S.Number).pipe(T.JsonName("scte35Pid")),
  Scte35Source: S.optional(S.String).pipe(T.JsonName("scte35Source")),
  SegmentationMarkers: S.optional(S.String).pipe(
    T.JsonName("segmentationMarkers"),
  ),
  SegmentationStyle: S.optional(S.String).pipe(T.JsonName("segmentationStyle")),
  SegmentationTime: S.optional(S.Number).pipe(T.JsonName("segmentationTime")),
  TimedMetadataPid: S.optional(S.Number).pipe(T.JsonName("timedMetadataPid")),
  TransportStreamId: S.optional(S.Number).pipe(T.JsonName("transportStreamId")),
  VideoPid: S.optional(S.Number).pipe(T.JsonName("videoPid")),
}) {}
export class M3u8Settings extends S.Class<M3u8Settings>("M3u8Settings")({
  AudioDuration: S.optional(S.String).pipe(T.JsonName("audioDuration")),
  AudioFramesPerPes: S.optional(S.Number).pipe(T.JsonName("audioFramesPerPes")),
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
  TransportStreamId: S.optional(S.Number).pipe(T.JsonName("transportStreamId")),
  VideoPid: S.optional(S.Number).pipe(T.JsonName("videoPid")),
}) {}
export class MovSettings extends S.Class<MovSettings>("MovSettings")({
  ClapAtom: S.optional(S.String).pipe(T.JsonName("clapAtom")),
  CslgAtom: S.optional(S.String).pipe(T.JsonName("cslgAtom")),
  Mpeg2FourCCControl: S.optional(S.String).pipe(
    T.JsonName("mpeg2FourCCControl"),
  ),
  PaddingControl: S.optional(S.String).pipe(T.JsonName("paddingControl")),
  Reference: S.optional(S.String).pipe(T.JsonName("reference")),
}) {}
export class Mp4Settings extends S.Class<Mp4Settings>("Mp4Settings")({
  AudioDuration: S.optional(S.String).pipe(T.JsonName("audioDuration")),
  C2paManifest: S.optional(S.String).pipe(T.JsonName("c2paManifest")),
  CertificateSecret: S.optional(S.String).pipe(T.JsonName("certificateSecret")),
  CslgAtom: S.optional(S.String).pipe(T.JsonName("cslgAtom")),
  CttsVersion: S.optional(S.Number).pipe(T.JsonName("cttsVersion")),
  FreeSpaceBox: S.optional(S.String).pipe(T.JsonName("freeSpaceBox")),
  MoovPlacement: S.optional(S.String).pipe(T.JsonName("moovPlacement")),
  Mp4MajorBrand: S.optional(S.String).pipe(T.JsonName("mp4MajorBrand")),
  SigningKmsKey: S.optional(S.String).pipe(T.JsonName("signingKmsKey")),
}) {}
export class MpdSettings extends S.Class<MpdSettings>("MpdSettings")({
  AccessibilityCaptionHints: S.optional(S.String).pipe(
    T.JsonName("accessibilityCaptionHints"),
  ),
  AudioDuration: S.optional(S.String).pipe(T.JsonName("audioDuration")),
  C2paManifest: S.optional(S.String).pipe(T.JsonName("c2paManifest")),
  CaptionContainerType: S.optional(S.String).pipe(
    T.JsonName("captionContainerType"),
  ),
  CertificateSecret: S.optional(S.String).pipe(T.JsonName("certificateSecret")),
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
}) {}
export class MxfXavcProfileSettings extends S.Class<MxfXavcProfileSettings>(
  "MxfXavcProfileSettings",
)({
  DurationMode: S.optional(S.String).pipe(T.JsonName("durationMode")),
  MaxAncDataSize: S.optional(S.Number).pipe(T.JsonName("maxAncDataSize")),
}) {}
export class MxfSettings extends S.Class<MxfSettings>("MxfSettings")({
  AfdSignaling: S.optional(S.String).pipe(T.JsonName("afdSignaling")),
  Profile: S.optional(S.String).pipe(T.JsonName("profile")),
  XavcProfileSettings: S.optional(MxfXavcProfileSettings).pipe(
    T.JsonName("xavcProfileSettings"),
  ),
}) {}
export class ContainerSettings extends S.Class<ContainerSettings>(
  "ContainerSettings",
)({
  CmfcSettings: S.optional(CmfcSettings).pipe(T.JsonName("cmfcSettings")),
  Container: S.optional(S.String).pipe(T.JsonName("container")),
  F4vSettings: S.optional(F4vSettings).pipe(T.JsonName("f4vSettings")),
  M2tsSettings: S.optional(M2tsSettings).pipe(T.JsonName("m2tsSettings")),
  M3u8Settings: S.optional(M3u8Settings).pipe(T.JsonName("m3u8Settings")),
  MovSettings: S.optional(MovSettings).pipe(T.JsonName("movSettings")),
  Mp4Settings: S.optional(Mp4Settings).pipe(T.JsonName("mp4Settings")),
  MpdSettings: S.optional(MpdSettings).pipe(T.JsonName("mpdSettings")),
  MxfSettings: S.optional(MxfSettings).pipe(T.JsonName("mxfSettings")),
}) {}
export class HlsSettings extends S.Class<HlsSettings>("HlsSettings")({
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
}) {}
export class OutputSettings extends S.Class<OutputSettings>("OutputSettings")({
  HlsSettings: S.optional(HlsSettings).pipe(T.JsonName("hlsSettings")),
}) {}
export class Av1QvbrSettings extends S.Class<Av1QvbrSettings>(
  "Av1QvbrSettings",
)({
  QvbrQualityLevel: S.optional(S.Number).pipe(T.JsonName("qvbrQualityLevel")),
  QvbrQualityLevelFineTune: S.optional(S.Number).pipe(
    T.JsonName("qvbrQualityLevelFineTune"),
  ),
}) {}
export class Av1Settings extends S.Class<Av1Settings>("Av1Settings")({
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
  QvbrSettings: S.optional(Av1QvbrSettings).pipe(T.JsonName("qvbrSettings")),
  RateControlMode: S.optional(S.String).pipe(T.JsonName("rateControlMode")),
  Slices: S.optional(S.Number).pipe(T.JsonName("slices")),
  SpatialAdaptiveQuantization: S.optional(S.String).pipe(
    T.JsonName("spatialAdaptiveQuantization"),
  ),
}) {}
export class AvcIntraUhdSettings extends S.Class<AvcIntraUhdSettings>(
  "AvcIntraUhdSettings",
)({
  QualityTuningLevel: S.optional(S.String).pipe(
    T.JsonName("qualityTuningLevel"),
  ),
}) {}
export class AvcIntraSettings extends S.Class<AvcIntraSettings>(
  "AvcIntraSettings",
)({
  AvcIntraClass: S.optional(S.String).pipe(T.JsonName("avcIntraClass")),
  AvcIntraUhdSettings: S.optional(AvcIntraUhdSettings).pipe(
    T.JsonName("avcIntraUhdSettings"),
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
  InterlaceMode: S.optional(S.String).pipe(T.JsonName("interlaceMode")),
  PerFrameMetrics: S.optional(__listOfFrameMetricType).pipe(
    T.JsonName("perFrameMetrics"),
  ),
  ScanTypeConversionMode: S.optional(S.String).pipe(
    T.JsonName("scanTypeConversionMode"),
  ),
  SlowPal: S.optional(S.String).pipe(T.JsonName("slowPal")),
  Telecine: S.optional(S.String).pipe(T.JsonName("telecine")),
}) {}
export class FrameCaptureSettings extends S.Class<FrameCaptureSettings>(
  "FrameCaptureSettings",
)({
  FramerateDenominator: S.optional(S.Number).pipe(
    T.JsonName("framerateDenominator"),
  ),
  FramerateNumerator: S.optional(S.Number).pipe(
    T.JsonName("framerateNumerator"),
  ),
  MaxCaptures: S.optional(S.Number).pipe(T.JsonName("maxCaptures")),
  Quality: S.optional(S.Number).pipe(T.JsonName("quality")),
}) {}
export class GifSettings extends S.Class<GifSettings>("GifSettings")({
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
}) {}
export class BandwidthReductionFilter extends S.Class<BandwidthReductionFilter>(
  "BandwidthReductionFilter",
)({
  Sharpening: S.optional(S.String).pipe(T.JsonName("sharpening")),
  Strength: S.optional(S.String).pipe(T.JsonName("strength")),
}) {}
export class H264QvbrSettings extends S.Class<H264QvbrSettings>(
  "H264QvbrSettings",
)({
  MaxAverageBitrate: S.optional(S.Number).pipe(T.JsonName("maxAverageBitrate")),
  QvbrQualityLevel: S.optional(S.Number).pipe(T.JsonName("qvbrQualityLevel")),
  QvbrQualityLevelFineTune: S.optional(S.Number).pipe(
    T.JsonName("qvbrQualityLevelFineTune"),
  ),
}) {}
export class H264Settings extends S.Class<H264Settings>("H264Settings")({
  AdaptiveQuantization: S.optional(S.String).pipe(
    T.JsonName("adaptiveQuantization"),
  ),
  BandwidthReductionFilter: S.optional(BandwidthReductionFilter).pipe(
    T.JsonName("bandwidthReductionFilter"),
  ),
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
  QvbrSettings: S.optional(H264QvbrSettings).pipe(T.JsonName("qvbrSettings")),
  RateControlMode: S.optional(S.String).pipe(T.JsonName("rateControlMode")),
  RepeatPps: S.optional(S.String).pipe(T.JsonName("repeatPps")),
  SaliencyAwareEncoding: S.optional(S.String).pipe(
    T.JsonName("saliencyAwareEncoding"),
  ),
  ScanTypeConversionMode: S.optional(S.String).pipe(
    T.JsonName("scanTypeConversionMode"),
  ),
  SceneChangeDetect: S.optional(S.String).pipe(T.JsonName("sceneChangeDetect")),
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
}) {}
export class H265QvbrSettings extends S.Class<H265QvbrSettings>(
  "H265QvbrSettings",
)({
  MaxAverageBitrate: S.optional(S.Number).pipe(T.JsonName("maxAverageBitrate")),
  QvbrQualityLevel: S.optional(S.Number).pipe(T.JsonName("qvbrQualityLevel")),
  QvbrQualityLevelFineTune: S.optional(S.Number).pipe(
    T.JsonName("qvbrQualityLevelFineTune"),
  ),
}) {}
export class H265Settings extends S.Class<H265Settings>("H265Settings")({
  AdaptiveQuantization: S.optional(S.String).pipe(
    T.JsonName("adaptiveQuantization"),
  ),
  AlternateTransferFunctionSei: S.optional(S.String).pipe(
    T.JsonName("alternateTransferFunctionSei"),
  ),
  BandwidthReductionFilter: S.optional(BandwidthReductionFilter).pipe(
    T.JsonName("bandwidthReductionFilter"),
  ),
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
  QvbrSettings: S.optional(H265QvbrSettings).pipe(T.JsonName("qvbrSettings")),
  RateControlMode: S.optional(S.String).pipe(T.JsonName("rateControlMode")),
  SampleAdaptiveOffsetFilterMode: S.optional(S.String).pipe(
    T.JsonName("sampleAdaptiveOffsetFilterMode"),
  ),
  ScanTypeConversionMode: S.optional(S.String).pipe(
    T.JsonName("scanTypeConversionMode"),
  ),
  SceneChangeDetect: S.optional(S.String).pipe(T.JsonName("sceneChangeDetect")),
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
}) {}
export class Mpeg2Settings extends S.Class<Mpeg2Settings>("Mpeg2Settings")({
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
  SceneChangeDetect: S.optional(S.String).pipe(T.JsonName("sceneChangeDetect")),
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
}) {}
export class PassthroughSettings extends S.Class<PassthroughSettings>(
  "PassthroughSettings",
)({
  FrameControl: S.optional(S.String).pipe(T.JsonName("frameControl")),
  VideoSelectorMode: S.optional(S.String).pipe(T.JsonName("videoSelectorMode")),
}) {}
export class ProresSettings extends S.Class<ProresSettings>("ProresSettings")({
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
}) {}
export class UncompressedSettings extends S.Class<UncompressedSettings>(
  "UncompressedSettings",
)({
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
}) {}
export class Vc3Settings extends S.Class<Vc3Settings>("Vc3Settings")({
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
}) {}
export class Vp8Settings extends S.Class<Vp8Settings>("Vp8Settings")({
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
}) {}
export class Vp9Settings extends S.Class<Vp9Settings>("Vp9Settings")({
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
}) {}
export class Xavc4kIntraCbgProfileSettings extends S.Class<Xavc4kIntraCbgProfileSettings>(
  "Xavc4kIntraCbgProfileSettings",
)({ XavcClass: S.optional(S.String).pipe(T.JsonName("xavcClass")) }) {}
export class Xavc4kIntraVbrProfileSettings extends S.Class<Xavc4kIntraVbrProfileSettings>(
  "Xavc4kIntraVbrProfileSettings",
)({ XavcClass: S.optional(S.String).pipe(T.JsonName("xavcClass")) }) {}
export class Xavc4kProfileSettings extends S.Class<Xavc4kProfileSettings>(
  "Xavc4kProfileSettings",
)({
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
}) {}
export class XavcHdIntraCbgProfileSettings extends S.Class<XavcHdIntraCbgProfileSettings>(
  "XavcHdIntraCbgProfileSettings",
)({ XavcClass: S.optional(S.String).pipe(T.JsonName("xavcClass")) }) {}
export class XavcHdProfileSettings extends S.Class<XavcHdProfileSettings>(
  "XavcHdProfileSettings",
)({
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
}) {}
export class XavcSettings extends S.Class<XavcSettings>("XavcSettings")({
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
  Xavc4kIntraCbgProfileSettings: S.optional(Xavc4kIntraCbgProfileSettings).pipe(
    T.JsonName("xavc4kIntraCbgProfileSettings"),
  ),
  Xavc4kIntraVbrProfileSettings: S.optional(Xavc4kIntraVbrProfileSettings).pipe(
    T.JsonName("xavc4kIntraVbrProfileSettings"),
  ),
  Xavc4kProfileSettings: S.optional(Xavc4kProfileSettings).pipe(
    T.JsonName("xavc4kProfileSettings"),
  ),
  XavcHdIntraCbgProfileSettings: S.optional(XavcHdIntraCbgProfileSettings).pipe(
    T.JsonName("xavcHdIntraCbgProfileSettings"),
  ),
  XavcHdProfileSettings: S.optional(XavcHdProfileSettings).pipe(
    T.JsonName("xavcHdProfileSettings"),
  ),
}) {}
export class VideoCodecSettings extends S.Class<VideoCodecSettings>(
  "VideoCodecSettings",
)({
  Av1Settings: S.optional(Av1Settings).pipe(T.JsonName("av1Settings")),
  AvcIntraSettings: S.optional(AvcIntraSettings).pipe(
    T.JsonName("avcIntraSettings"),
  ),
  Codec: S.optional(S.String).pipe(T.JsonName("codec")),
  FrameCaptureSettings: S.optional(FrameCaptureSettings).pipe(
    T.JsonName("frameCaptureSettings"),
  ),
  GifSettings: S.optional(GifSettings).pipe(T.JsonName("gifSettings")),
  H264Settings: S.optional(H264Settings).pipe(T.JsonName("h264Settings")),
  H265Settings: S.optional(H265Settings).pipe(T.JsonName("h265Settings")),
  Mpeg2Settings: S.optional(Mpeg2Settings).pipe(T.JsonName("mpeg2Settings")),
  PassthroughSettings: S.optional(PassthroughSettings).pipe(
    T.JsonName("passthroughSettings"),
  ),
  ProresSettings: S.optional(ProresSettings).pipe(T.JsonName("proresSettings")),
  UncompressedSettings: S.optional(UncompressedSettings).pipe(
    T.JsonName("uncompressedSettings"),
  ),
  Vc3Settings: S.optional(Vc3Settings).pipe(T.JsonName("vc3Settings")),
  Vp8Settings: S.optional(Vp8Settings).pipe(T.JsonName("vp8Settings")),
  Vp9Settings: S.optional(Vp9Settings).pipe(T.JsonName("vp9Settings")),
  XavcSettings: S.optional(XavcSettings).pipe(T.JsonName("xavcSettings")),
}) {}
export class ClipLimits extends S.Class<ClipLimits>("ClipLimits")({
  MaximumRGBTolerance: S.optional(S.Number).pipe(
    T.JsonName("maximumRGBTolerance"),
  ),
  MaximumYUV: S.optional(S.Number).pipe(T.JsonName("maximumYUV")),
  MinimumRGBTolerance: S.optional(S.Number).pipe(
    T.JsonName("minimumRGBTolerance"),
  ),
  MinimumYUV: S.optional(S.Number).pipe(T.JsonName("minimumYUV")),
}) {}
export class ColorCorrector extends S.Class<ColorCorrector>("ColorCorrector")({
  Brightness: S.optional(S.Number).pipe(T.JsonName("brightness")),
  ClipLimits: S.optional(ClipLimits).pipe(T.JsonName("clipLimits")),
  ColorSpaceConversion: S.optional(S.String).pipe(
    T.JsonName("colorSpaceConversion"),
  ),
  Contrast: S.optional(S.Number).pipe(T.JsonName("contrast")),
  Hdr10Metadata: S.optional(Hdr10Metadata).pipe(T.JsonName("hdr10Metadata")),
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
}) {}
export class Deinterlacer extends S.Class<Deinterlacer>("Deinterlacer")({
  Algorithm: S.optional(S.String).pipe(T.JsonName("algorithm")),
  Control: S.optional(S.String).pipe(T.JsonName("control")),
  Mode: S.optional(S.String).pipe(T.JsonName("mode")),
}) {}
export class DolbyVisionLevel6Metadata extends S.Class<DolbyVisionLevel6Metadata>(
  "DolbyVisionLevel6Metadata",
)({
  MaxCll: S.optional(S.Number).pipe(T.JsonName("maxCll")),
  MaxFall: S.optional(S.Number).pipe(T.JsonName("maxFall")),
}) {}
export class DolbyVision extends S.Class<DolbyVision>("DolbyVision")({
  L6Metadata: S.optional(DolbyVisionLevel6Metadata).pipe(
    T.JsonName("l6Metadata"),
  ),
  L6Mode: S.optional(S.String).pipe(T.JsonName("l6Mode")),
  Mapping: S.optional(S.String).pipe(T.JsonName("mapping")),
  Profile: S.optional(S.String).pipe(T.JsonName("profile")),
}) {}
export class Hdr10Plus extends S.Class<Hdr10Plus>("Hdr10Plus")({
  MasteringMonitorNits: S.optional(S.Number).pipe(
    T.JsonName("masteringMonitorNits"),
  ),
  TargetMonitorNits: S.optional(S.Number).pipe(T.JsonName("targetMonitorNits")),
}) {}
export class NoiseReducerFilterSettings extends S.Class<NoiseReducerFilterSettings>(
  "NoiseReducerFilterSettings",
)({ Strength: S.optional(S.Number).pipe(T.JsonName("strength")) }) {}
export class NoiseReducerSpatialFilterSettings extends S.Class<NoiseReducerSpatialFilterSettings>(
  "NoiseReducerSpatialFilterSettings",
)({
  PostFilterSharpenStrength: S.optional(S.Number).pipe(
    T.JsonName("postFilterSharpenStrength"),
  ),
  Speed: S.optional(S.Number).pipe(T.JsonName("speed")),
  Strength: S.optional(S.Number).pipe(T.JsonName("strength")),
}) {}
export class NoiseReducerTemporalFilterSettings extends S.Class<NoiseReducerTemporalFilterSettings>(
  "NoiseReducerTemporalFilterSettings",
)({
  AggressiveMode: S.optional(S.Number).pipe(T.JsonName("aggressiveMode")),
  PostTemporalSharpening: S.optional(S.String).pipe(
    T.JsonName("postTemporalSharpening"),
  ),
  PostTemporalSharpeningStrength: S.optional(S.String).pipe(
    T.JsonName("postTemporalSharpeningStrength"),
  ),
  Speed: S.optional(S.Number).pipe(T.JsonName("speed")),
  Strength: S.optional(S.Number).pipe(T.JsonName("strength")),
}) {}
export class NoiseReducer extends S.Class<NoiseReducer>("NoiseReducer")({
  Filter: S.optional(S.String).pipe(T.JsonName("filter")),
  FilterSettings: S.optional(NoiseReducerFilterSettings).pipe(
    T.JsonName("filterSettings"),
  ),
  SpatialFilterSettings: S.optional(NoiseReducerSpatialFilterSettings).pipe(
    T.JsonName("spatialFilterSettings"),
  ),
  TemporalFilterSettings: S.optional(NoiseReducerTemporalFilterSettings).pipe(
    T.JsonName("temporalFilterSettings"),
  ),
}) {}
export class NexGuardFileMarkerSettings extends S.Class<NexGuardFileMarkerSettings>(
  "NexGuardFileMarkerSettings",
)({
  License: S.optional(S.String).pipe(T.JsonName("license")),
  Payload: S.optional(S.Number).pipe(T.JsonName("payload")),
  Preset: S.optional(S.String).pipe(T.JsonName("preset")),
  Strength: S.optional(S.String).pipe(T.JsonName("strength")),
}) {}
export class PartnerWatermarking extends S.Class<PartnerWatermarking>(
  "PartnerWatermarking",
)({
  NexguardFileMarkerSettings: S.optional(NexGuardFileMarkerSettings).pipe(
    T.JsonName("nexguardFileMarkerSettings"),
  ),
}) {}
export class TimecodeBurnin extends S.Class<TimecodeBurnin>("TimecodeBurnin")({
  FontSize: S.optional(S.Number).pipe(T.JsonName("fontSize")),
  Position: S.optional(S.String).pipe(T.JsonName("position")),
  Prefix: S.optional(S.String).pipe(T.JsonName("prefix")),
}) {}
export class VideoPreprocessor extends S.Class<VideoPreprocessor>(
  "VideoPreprocessor",
)({
  ColorCorrector: S.optional(ColorCorrector).pipe(T.JsonName("colorCorrector")),
  Deinterlacer: S.optional(Deinterlacer).pipe(T.JsonName("deinterlacer")),
  DolbyVision: S.optional(DolbyVision).pipe(T.JsonName("dolbyVision")),
  Hdr10Plus: S.optional(Hdr10Plus).pipe(T.JsonName("hdr10Plus")),
  ImageInserter: S.optional(ImageInserter).pipe(T.JsonName("imageInserter")),
  NoiseReducer: S.optional(NoiseReducer).pipe(T.JsonName("noiseReducer")),
  PartnerWatermarking: S.optional(PartnerWatermarking).pipe(
    T.JsonName("partnerWatermarking"),
  ),
  TimecodeBurnin: S.optional(TimecodeBurnin).pipe(T.JsonName("timecodeBurnin")),
}) {}
export class VideoDescription extends S.Class<VideoDescription>(
  "VideoDescription",
)({
  AfdSignaling: S.optional(S.String).pipe(T.JsonName("afdSignaling")),
  AntiAlias: S.optional(S.String).pipe(T.JsonName("antiAlias")),
  ChromaPositionMode: S.optional(S.String).pipe(
    T.JsonName("chromaPositionMode"),
  ),
  CodecSettings: S.optional(VideoCodecSettings).pipe(
    T.JsonName("codecSettings"),
  ),
  ColorMetadata: S.optional(S.String).pipe(T.JsonName("colorMetadata")),
  Crop: S.optional(Rectangle).pipe(T.JsonName("crop")),
  DropFrameTimecode: S.optional(S.String).pipe(T.JsonName("dropFrameTimecode")),
  FixedAfd: S.optional(S.Number).pipe(T.JsonName("fixedAfd")),
  Height: S.optional(S.Number).pipe(T.JsonName("height")),
  Position: S.optional(Rectangle).pipe(T.JsonName("position")),
  RespondToAfd: S.optional(S.String).pipe(T.JsonName("respondToAfd")),
  ScalingBehavior: S.optional(S.String).pipe(T.JsonName("scalingBehavior")),
  Sharpness: S.optional(S.Number).pipe(T.JsonName("sharpness")),
  TimecodeInsertion: S.optional(S.String).pipe(T.JsonName("timecodeInsertion")),
  TimecodeTrack: S.optional(S.String).pipe(T.JsonName("timecodeTrack")),
  VideoPreprocessors: S.optional(VideoPreprocessor).pipe(
    T.JsonName("videoPreprocessors"),
  ),
  Width: S.optional(S.Number).pipe(T.JsonName("width")),
}) {}
export class Output extends S.Class<Output>("Output")({
  AudioDescriptions: S.optional(__listOfAudioDescription).pipe(
    T.JsonName("audioDescriptions"),
  ),
  CaptionDescriptions: S.optional(__listOfCaptionDescription).pipe(
    T.JsonName("captionDescriptions"),
  ),
  ContainerSettings: S.optional(ContainerSettings).pipe(
    T.JsonName("containerSettings"),
  ),
  Extension: S.optional(S.String).pipe(T.JsonName("extension")),
  NameModifier: S.optional(S.String).pipe(T.JsonName("nameModifier")),
  OutputSettings: S.optional(OutputSettings).pipe(T.JsonName("outputSettings")),
  Preset: S.optional(S.String).pipe(T.JsonName("preset")),
  VideoDescription: S.optional(VideoDescription).pipe(
    T.JsonName("videoDescription"),
  ),
}) {}
export const __listOfOutput = S.Array(Output);
export class OutputGroup extends S.Class<OutputGroup>("OutputGroup")({
  AutomatedEncodingSettings: S.optional(AutomatedEncodingSettings).pipe(
    T.JsonName("automatedEncodingSettings"),
  ),
  CustomName: S.optional(S.String).pipe(T.JsonName("customName")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  OutputGroupSettings: S.optional(OutputGroupSettings).pipe(
    T.JsonName("outputGroupSettings"),
  ),
  Outputs: S.optional(__listOfOutput).pipe(T.JsonName("outputs")),
}) {}
export const __listOfOutputGroup = S.Array(OutputGroup);
export class TimecodeConfig extends S.Class<TimecodeConfig>("TimecodeConfig")({
  Anchor: S.optional(S.String).pipe(T.JsonName("anchor")),
  Source: S.optional(S.String).pipe(T.JsonName("source")),
  Start: S.optional(S.String).pipe(T.JsonName("start")),
  TimestampOffset: S.optional(S.String).pipe(T.JsonName("timestampOffset")),
}) {}
export class Id3Insertion extends S.Class<Id3Insertion>("Id3Insertion")({
  Id3: S.optional(S.String).pipe(T.JsonName("id3")),
  Timecode: S.optional(S.String).pipe(T.JsonName("timecode")),
}) {}
export const __listOfId3Insertion = S.Array(Id3Insertion);
export class TimedMetadataInsertion extends S.Class<TimedMetadataInsertion>(
  "TimedMetadataInsertion",
)({
  Id3Insertions: S.optional(__listOfId3Insertion).pipe(
    T.JsonName("id3Insertions"),
  ),
}) {}
export class JobTemplateSettings extends S.Class<JobTemplateSettings>(
  "JobTemplateSettings",
)({
  AdAvailOffset: S.optional(S.Number).pipe(T.JsonName("adAvailOffset")),
  AvailBlanking: S.optional(AvailBlanking).pipe(T.JsonName("availBlanking")),
  ColorConversion3DLUTSettings: S.optional(
    __listOfColorConversion3DLUTSetting,
  ).pipe(T.JsonName("colorConversion3DLUTSettings")),
  Esam: S.optional(EsamSettings).pipe(T.JsonName("esam")),
  ExtendedDataServices: S.optional(ExtendedDataServices).pipe(
    T.JsonName("extendedDataServices"),
  ),
  FollowSource: S.optional(S.Number).pipe(T.JsonName("followSource")),
  Inputs: S.optional(__listOfInputTemplate).pipe(T.JsonName("inputs")),
  KantarWatermark: S.optional(KantarWatermarkSettings).pipe(
    T.JsonName("kantarWatermark"),
  ),
  MotionImageInserter: S.optional(MotionImageInserter).pipe(
    T.JsonName("motionImageInserter"),
  ),
  NielsenConfiguration: S.optional(NielsenConfiguration).pipe(
    T.JsonName("nielsenConfiguration"),
  ),
  NielsenNonLinearWatermark: S.optional(NielsenNonLinearWatermarkSettings).pipe(
    T.JsonName("nielsenNonLinearWatermark"),
  ),
  OutputGroups: S.optional(__listOfOutputGroup).pipe(
    T.JsonName("outputGroups"),
  ),
  TimecodeConfig: S.optional(TimecodeConfig).pipe(T.JsonName("timecodeConfig")),
  TimedMetadataInsertion: S.optional(TimedMetadataInsertion).pipe(
    T.JsonName("timedMetadataInsertion"),
  ),
}) {}
export class UpdateJobTemplateRequest extends S.Class<UpdateJobTemplateRequest>(
  "UpdateJobTemplateRequest",
)(
  {
    AccelerationSettings: S.optional(AccelerationSettings).pipe(
      T.JsonName("accelerationSettings"),
    ),
    Category: S.optional(S.String).pipe(T.JsonName("category")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    HopDestinations: S.optional(__listOfHopDestination).pipe(
      T.JsonName("hopDestinations"),
    ),
    Name: S.String.pipe(T.HttpLabel()),
    Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
    Queue: S.optional(S.String).pipe(T.JsonName("queue")),
    Settings: S.optional(JobTemplateSettings).pipe(T.JsonName("settings")),
    StatusUpdateInterval: S.optional(S.String).pipe(
      T.JsonName("statusUpdateInterval"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/2017-08-29/jobTemplates/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CaptionDescriptionPreset extends S.Class<CaptionDescriptionPreset>(
  "CaptionDescriptionPreset",
)({
  CustomLanguageCode: S.optional(S.String).pipe(
    T.JsonName("customLanguageCode"),
  ),
  DestinationSettings: S.optional(CaptionDestinationSettings).pipe(
    T.JsonName("destinationSettings"),
  ),
  LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
  LanguageDescription: S.optional(S.String).pipe(
    T.JsonName("languageDescription"),
  ),
}) {}
export const __listOfCaptionDescriptionPreset = S.Array(
  CaptionDescriptionPreset,
);
export class PresetSettings extends S.Class<PresetSettings>("PresetSettings")({
  AudioDescriptions: S.optional(__listOfAudioDescription).pipe(
    T.JsonName("audioDescriptions"),
  ),
  CaptionDescriptions: S.optional(__listOfCaptionDescriptionPreset).pipe(
    T.JsonName("captionDescriptions"),
  ),
  ContainerSettings: S.optional(ContainerSettings).pipe(
    T.JsonName("containerSettings"),
  ),
  VideoDescription: S.optional(VideoDescription).pipe(
    T.JsonName("videoDescription"),
  ),
}) {}
export class UpdatePresetRequest extends S.Class<UpdatePresetRequest>(
  "UpdatePresetRequest",
)(
  {
    Category: S.optional(S.String).pipe(T.JsonName("category")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Name: S.String.pipe(T.HttpLabel()),
    Settings: S.optional(PresetSettings).pipe(T.JsonName("settings")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/2017-08-29/presets/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ReservationPlanSettings extends S.Class<ReservationPlanSettings>(
  "ReservationPlanSettings",
)({
  Commitment: S.String.pipe(T.JsonName("commitment")),
  RenewalType: S.String.pipe(T.JsonName("renewalType")),
  ReservedSlots: S.Number.pipe(T.JsonName("reservedSlots")),
}) {}
export class UpdateQueueRequest extends S.Class<UpdateQueueRequest>(
  "UpdateQueueRequest",
)(
  {
    ConcurrentJobs: S.optional(S.Number).pipe(T.JsonName("concurrentJobs")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Name: S.String.pipe(T.HttpLabel()),
    ReservationPlanSettings: S.optional(ReservationPlanSettings).pipe(
      T.JsonName("reservationPlanSettings"),
    ),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/2017-08-29/queues/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const __listOf__stringMax100 = S.Array(S.String);
export class JobMessages extends S.Class<JobMessages>("JobMessages")({
  Info: S.optional(__listOf__string).pipe(T.JsonName("info")),
  Warning: S.optional(__listOf__string).pipe(T.JsonName("warning")),
}) {}
export class VideoDetail extends S.Class<VideoDetail>("VideoDetail")({
  HeightInPx: S.optional(S.Number).pipe(T.JsonName("heightInPx")),
  WidthInPx: S.optional(S.Number).pipe(T.JsonName("widthInPx")),
}) {}
export class OutputDetail extends S.Class<OutputDetail>("OutputDetail")({
  DurationInMs: S.optional(S.Number).pipe(T.JsonName("durationInMs")),
  VideoDetails: S.optional(VideoDetail).pipe(T.JsonName("videoDetails")),
}) {}
export const __listOfOutputDetail = S.Array(OutputDetail);
export class OutputGroupDetail extends S.Class<OutputGroupDetail>(
  "OutputGroupDetail",
)({
  OutputDetails: S.optional(__listOfOutputDetail).pipe(
    T.JsonName("outputDetails"),
  ),
}) {}
export const __listOfOutputGroupDetail = S.Array(OutputGroupDetail);
export class QueueTransition extends S.Class<QueueTransition>(
  "QueueTransition",
)({
  DestinationQueue: S.optional(S.String).pipe(T.JsonName("destinationQueue")),
  SourceQueue: S.optional(S.String).pipe(T.JsonName("sourceQueue")),
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("timestamp"),
  ),
}) {}
export const __listOfQueueTransition = S.Array(QueueTransition);
export class InputDecryptionSettings extends S.Class<InputDecryptionSettings>(
  "InputDecryptionSettings",
)({
  DecryptionMode: S.optional(S.String).pipe(T.JsonName("decryptionMode")),
  EncryptedDecryptionKey: S.optional(S.String).pipe(
    T.JsonName("encryptedDecryptionKey"),
  ),
  InitializationVector: S.optional(S.String).pipe(
    T.JsonName("initializationVector"),
  ),
  KmsKeyRegion: S.optional(S.String).pipe(T.JsonName("kmsKeyRegion")),
}) {}
export const __listOf__stringPatternS3ASSETMAPXml = S.Array(S.String);
export class InputTamsSettings extends S.Class<InputTamsSettings>(
  "InputTamsSettings",
)({
  AuthConnectionArn: S.optional(S.String).pipe(T.JsonName("authConnectionArn")),
  GapHandling: S.optional(S.String).pipe(T.JsonName("gapHandling")),
  SourceId: S.optional(S.String).pipe(T.JsonName("sourceId")),
  Timerange: S.optional(S.String).pipe(T.JsonName("timerange")),
}) {}
export class InputVideoGenerator extends S.Class<InputVideoGenerator>(
  "InputVideoGenerator",
)({
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
}) {}
export class Input extends S.Class<Input>("Input")({
  AdvancedInputFilter: S.optional(S.String).pipe(
    T.JsonName("advancedInputFilter"),
  ),
  AdvancedInputFilterSettings: S.optional(AdvancedInputFilterSettings).pipe(
    T.JsonName("advancedInputFilterSettings"),
  ),
  AudioSelectorGroups: S.optional(__mapOfAudioSelectorGroup).pipe(
    T.JsonName("audioSelectorGroups"),
  ),
  AudioSelectors: S.optional(__mapOfAudioSelector).pipe(
    T.JsonName("audioSelectors"),
  ),
  CaptionSelectors: S.optional(__mapOfCaptionSelector).pipe(
    T.JsonName("captionSelectors"),
  ),
  Crop: S.optional(Rectangle).pipe(T.JsonName("crop")),
  DeblockFilter: S.optional(S.String).pipe(T.JsonName("deblockFilter")),
  DecryptionSettings: S.optional(InputDecryptionSettings).pipe(
    T.JsonName("decryptionSettings"),
  ),
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
  ImageInserter: S.optional(ImageInserter).pipe(T.JsonName("imageInserter")),
  InputClippings: S.optional(__listOfInputClipping).pipe(
    T.JsonName("inputClippings"),
  ),
  InputScanType: S.optional(S.String).pipe(T.JsonName("inputScanType")),
  Position: S.optional(Rectangle).pipe(T.JsonName("position")),
  ProgramNumber: S.optional(S.Number).pipe(T.JsonName("programNumber")),
  PsiControl: S.optional(S.String).pipe(T.JsonName("psiControl")),
  SupplementalImps: S.optional(__listOf__stringPatternS3ASSETMAPXml).pipe(
    T.JsonName("supplementalImps"),
  ),
  TamsSettings: S.optional(InputTamsSettings).pipe(T.JsonName("tamsSettings")),
  TimecodeSource: S.optional(S.String).pipe(T.JsonName("timecodeSource")),
  TimecodeStart: S.optional(S.String).pipe(T.JsonName("timecodeStart")),
  VideoGenerator: S.optional(InputVideoGenerator).pipe(
    T.JsonName("videoGenerator"),
  ),
  VideoOverlays: S.optional(__listOfVideoOverlay).pipe(
    T.JsonName("videoOverlays"),
  ),
  VideoSelector: S.optional(VideoSelector).pipe(T.JsonName("videoSelector")),
}) {}
export const __listOfInput = S.Array(Input);
export class JobSettings extends S.Class<JobSettings>("JobSettings")({
  AdAvailOffset: S.optional(S.Number).pipe(T.JsonName("adAvailOffset")),
  AvailBlanking: S.optional(AvailBlanking).pipe(T.JsonName("availBlanking")),
  ColorConversion3DLUTSettings: S.optional(
    __listOfColorConversion3DLUTSetting,
  ).pipe(T.JsonName("colorConversion3DLUTSettings")),
  Esam: S.optional(EsamSettings).pipe(T.JsonName("esam")),
  ExtendedDataServices: S.optional(ExtendedDataServices).pipe(
    T.JsonName("extendedDataServices"),
  ),
  FollowSource: S.optional(S.Number).pipe(T.JsonName("followSource")),
  Inputs: S.optional(__listOfInput).pipe(T.JsonName("inputs")),
  KantarWatermark: S.optional(KantarWatermarkSettings).pipe(
    T.JsonName("kantarWatermark"),
  ),
  MotionImageInserter: S.optional(MotionImageInserter).pipe(
    T.JsonName("motionImageInserter"),
  ),
  NielsenConfiguration: S.optional(NielsenConfiguration).pipe(
    T.JsonName("nielsenConfiguration"),
  ),
  NielsenNonLinearWatermark: S.optional(NielsenNonLinearWatermarkSettings).pipe(
    T.JsonName("nielsenNonLinearWatermark"),
  ),
  OutputGroups: S.optional(__listOfOutputGroup).pipe(
    T.JsonName("outputGroups"),
  ),
  TimecodeConfig: S.optional(TimecodeConfig).pipe(T.JsonName("timecodeConfig")),
  TimedMetadataInsertion: S.optional(TimedMetadataInsertion).pipe(
    T.JsonName("timedMetadataInsertion"),
  ),
}) {}
export class Timing extends S.Class<Timing>("Timing")({
  FinishTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("finishTime"),
  ),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("startTime"),
  ),
  SubmitTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("submitTime"),
  ),
}) {}
export class WarningGroup extends S.Class<WarningGroup>("WarningGroup")({
  Code: S.Number.pipe(T.JsonName("code")),
  Count: S.Number.pipe(T.JsonName("count")),
}) {}
export const __listOfWarningGroup = S.Array(WarningGroup);
export class Job extends S.Class<Job>("Job")({
  AccelerationSettings: S.optional(AccelerationSettings).pipe(
    T.JsonName("accelerationSettings"),
  ),
  AccelerationStatus: S.optional(S.String).pipe(
    T.JsonName("accelerationStatus"),
  ),
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  BillingTagsSource: S.optional(S.String).pipe(T.JsonName("billingTagsSource")),
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
  Messages: S.optional(JobMessages).pipe(T.JsonName("messages")),
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
  Settings: JobSettings.pipe(T.JsonName("settings")),
  ShareStatus: S.optional(S.String).pipe(T.JsonName("shareStatus")),
  SimulateReservedQueue: S.optional(S.String).pipe(
    T.JsonName("simulateReservedQueue"),
  ),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  StatusUpdateInterval: S.optional(S.String).pipe(
    T.JsonName("statusUpdateInterval"),
  ),
  Timing: S.optional(Timing).pipe(T.JsonName("timing")),
  UserMetadata: S.optional(__mapOf__string).pipe(T.JsonName("userMetadata")),
  Warnings: S.optional(__listOfWarningGroup).pipe(T.JsonName("warnings")),
}) {}
export const __listOfJob = S.Array(Job);
export class JobTemplate extends S.Class<JobTemplate>("JobTemplate")({
  AccelerationSettings: S.optional(AccelerationSettings).pipe(
    T.JsonName("accelerationSettings"),
  ),
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Category: S.optional(S.String).pipe(T.JsonName("category")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  HopDestinations: S.optional(__listOfHopDestination).pipe(
    T.JsonName("hopDestinations"),
  ),
  LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("lastUpdated"),
  ),
  Name: S.String.pipe(T.JsonName("name")),
  Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
  Queue: S.optional(S.String).pipe(T.JsonName("queue")),
  Settings: JobTemplateSettings.pipe(T.JsonName("settings")),
  StatusUpdateInterval: S.optional(S.String).pipe(
    T.JsonName("statusUpdateInterval"),
  ),
  Type: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export const __listOfJobTemplate = S.Array(JobTemplate);
export class Preset extends S.Class<Preset>("Preset")({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Category: S.optional(S.String).pipe(T.JsonName("category")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("lastUpdated"),
  ),
  Name: S.String.pipe(T.JsonName("name")),
  Settings: PresetSettings.pipe(T.JsonName("settings")),
  Type: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export const __listOfPreset = S.Array(Preset);
export class ReservationPlan extends S.Class<ReservationPlan>(
  "ReservationPlan",
)({
  Commitment: S.optional(S.String).pipe(T.JsonName("commitment")),
  ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("expiresAt"),
  ),
  PurchasedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("purchasedAt"),
  ),
  RenewalType: S.optional(S.String).pipe(T.JsonName("renewalType")),
  ReservedSlots: S.optional(S.Number).pipe(T.JsonName("reservedSlots")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class ServiceOverride extends S.Class<ServiceOverride>(
  "ServiceOverride",
)({
  Message: S.optional(S.String).pipe(T.JsonName("message")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  OverrideValue: S.optional(S.String).pipe(T.JsonName("overrideValue")),
  Value: S.optional(S.String).pipe(T.JsonName("value")),
}) {}
export const __listOfServiceOverride = S.Array(ServiceOverride);
export class Queue extends S.Class<Queue>("Queue")({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ConcurrentJobs: S.optional(S.Number).pipe(T.JsonName("concurrentJobs")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("lastUpdated"),
  ),
  Name: S.String.pipe(T.JsonName("name")),
  PricingPlan: S.optional(S.String).pipe(T.JsonName("pricingPlan")),
  ProgressingJobsCount: S.optional(S.Number).pipe(
    T.JsonName("progressingJobsCount"),
  ),
  ReservationPlan: S.optional(ReservationPlan).pipe(
    T.JsonName("reservationPlan"),
  ),
  ServiceOverrides: S.optional(__listOfServiceOverride).pipe(
    T.JsonName("serviceOverrides"),
  ),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  SubmittedJobsCount: S.optional(S.Number).pipe(
    T.JsonName("submittedJobsCount"),
  ),
  Type: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export const __listOfQueue = S.Array(Queue);
export class ProbeInputFile extends S.Class<ProbeInputFile>("ProbeInputFile")({
  FileUrl: S.optional(S.String).pipe(T.JsonName("fileUrl")),
}) {}
export const __listOfProbeInputFile = S.Array(ProbeInputFile);
export class JobsQueryFilter extends S.Class<JobsQueryFilter>(
  "JobsQueryFilter",
)({
  Key: S.optional(S.String).pipe(T.JsonName("key")),
  Values: S.optional(__listOf__stringMax100).pipe(T.JsonName("values")),
}) {}
export const __listOfJobsQueryFilter = S.Array(JobsQueryFilter);
export class CreateQueueRequest extends S.Class<CreateQueueRequest>(
  "CreateQueueRequest",
)(
  {
    ConcurrentJobs: S.optional(S.Number).pipe(T.JsonName("concurrentJobs")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Name: S.String.pipe(T.JsonName("name")),
    PricingPlan: S.optional(S.String).pipe(T.JsonName("pricingPlan")),
    ReservationPlanSettings: S.optional(ReservationPlanSettings).pipe(
      T.JsonName("reservationPlanSettings"),
    ),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2017-08-29/queues" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetJobsQueryResultsResponse extends S.Class<GetJobsQueryResultsResponse>(
  "GetJobsQueryResultsResponse",
)({
  Jobs: S.optional(__listOfJob).pipe(T.JsonName("jobs")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class GetPolicyResponse extends S.Class<GetPolicyResponse>(
  "GetPolicyResponse",
)({ Policy: S.optional(Policy).pipe(T.JsonName("policy")) }) {}
export class ListJobsResponse extends S.Class<ListJobsResponse>(
  "ListJobsResponse",
)({
  Jobs: S.optional(__listOfJob).pipe(T.JsonName("jobs")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListJobTemplatesResponse extends S.Class<ListJobTemplatesResponse>(
  "ListJobTemplatesResponse",
)({
  JobTemplates: S.optional(__listOfJobTemplate).pipe(
    T.JsonName("jobTemplates"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListPresetsResponse extends S.Class<ListPresetsResponse>(
  "ListPresetsResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Presets: S.optional(__listOfPreset).pipe(T.JsonName("presets")),
}) {}
export class ListQueuesResponse extends S.Class<ListQueuesResponse>(
  "ListQueuesResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Queues: S.optional(__listOfQueue).pipe(T.JsonName("queues")),
  TotalConcurrentJobs: S.optional(S.Number).pipe(
    T.JsonName("totalConcurrentJobs"),
  ),
  UnallocatedConcurrentJobs: S.optional(S.Number).pipe(
    T.JsonName("unallocatedConcurrentJobs"),
  ),
}) {}
export class ProbeRequest extends S.Class<ProbeRequest>("ProbeRequest")(
  {
    InputFiles: S.optional(__listOfProbeInputFile).pipe(
      T.JsonName("inputFiles"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2017-08-29/probe" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutPolicyResponse extends S.Class<PutPolicyResponse>(
  "PutPolicyResponse",
)({ Policy: S.optional(Policy).pipe(T.JsonName("policy")) }) {}
export class SearchJobsResponse extends S.Class<SearchJobsResponse>(
  "SearchJobsResponse",
)({
  Jobs: S.optional(__listOfJob).pipe(T.JsonName("jobs")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class StartJobsQueryRequest extends S.Class<StartJobsQueryRequest>(
  "StartJobsQueryRequest",
)(
  {
    FilterList: S.optional(__listOfJobsQueryFilter).pipe(
      T.JsonName("filterList"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Order: S.optional(S.String).pipe(T.JsonName("order")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2017-08-29/jobsQueries" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateJobTemplateResponse extends S.Class<UpdateJobTemplateResponse>(
  "UpdateJobTemplateResponse",
)({ JobTemplate: S.optional(JobTemplate).pipe(T.JsonName("jobTemplate")) }) {}
export class UpdatePresetResponse extends S.Class<UpdatePresetResponse>(
  "UpdatePresetResponse",
)({ Preset: S.optional(Preset).pipe(T.JsonName("preset")) }) {}
export class UpdateQueueResponse extends S.Class<UpdateQueueResponse>(
  "UpdateQueueResponse",
)({ Queue: S.optional(Queue).pipe(T.JsonName("queue")) }) {}
export class Endpoint extends S.Class<Endpoint>("Endpoint")({
  Url: S.optional(S.String).pipe(T.JsonName("url")),
}) {}
export const __listOfEndpoint = S.Array(Endpoint);
export class ResourceTags extends S.Class<ResourceTags>("ResourceTags")({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
}) {}
export class JobEngineVersion extends S.Class<JobEngineVersion>(
  "JobEngineVersion",
)({
  ExpirationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ).pipe(T.JsonName("expirationDate")),
  Version: S.optional(S.String).pipe(T.JsonName("version")),
}) {}
export const __listOfJobEngineVersion = S.Array(JobEngineVersion);
export class CreateJobTemplateRequest extends S.Class<CreateJobTemplateRequest>(
  "CreateJobTemplateRequest",
)(
  {
    AccelerationSettings: S.optional(AccelerationSettings).pipe(
      T.JsonName("accelerationSettings"),
    ),
    Category: S.optional(S.String).pipe(T.JsonName("category")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    HopDestinations: S.optional(__listOfHopDestination).pipe(
      T.JsonName("hopDestinations"),
    ),
    Name: S.String.pipe(T.JsonName("name")),
    Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
    Queue: S.optional(S.String).pipe(T.JsonName("queue")),
    Settings: JobTemplateSettings.pipe(T.JsonName("settings")),
    StatusUpdateInterval: S.optional(S.String).pipe(
      T.JsonName("statusUpdateInterval"),
    ),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2017-08-29/jobTemplates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateQueueResponse extends S.Class<CreateQueueResponse>(
  "CreateQueueResponse",
)({ Queue: S.optional(Queue).pipe(T.JsonName("queue")) }) {}
export class DescribeEndpointsResponse extends S.Class<DescribeEndpointsResponse>(
  "DescribeEndpointsResponse",
)({
  Endpoints: S.optional(__listOfEndpoint).pipe(T.JsonName("endpoints")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class GetJobTemplateResponse extends S.Class<GetJobTemplateResponse>(
  "GetJobTemplateResponse",
)({ JobTemplate: S.optional(JobTemplate).pipe(T.JsonName("jobTemplate")) }) {}
export class GetPresetResponse extends S.Class<GetPresetResponse>(
  "GetPresetResponse",
)({ Preset: S.optional(Preset).pipe(T.JsonName("preset")) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({
  ResourceTags: S.optional(ResourceTags).pipe(T.JsonName("resourceTags")),
}) {}
export class ListVersionsResponse extends S.Class<ListVersionsResponse>(
  "ListVersionsResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Versions: S.optional(__listOfJobEngineVersion).pipe(T.JsonName("versions")),
}) {}
export class StartJobsQueryResponse extends S.Class<StartJobsQueryResponse>(
  "StartJobsQueryResponse",
)({ Id: S.optional(S.String).pipe(T.JsonName("id")) }) {}
export const __listOf__integer = S.Array(S.Number);
export class CreateJobTemplateResponse extends S.Class<CreateJobTemplateResponse>(
  "CreateJobTemplateResponse",
)({ JobTemplate: S.optional(JobTemplate).pipe(T.JsonName("jobTemplate")) }) {}
export class GetQueueResponse extends S.Class<GetQueueResponse>(
  "GetQueueResponse",
)({ Queue: S.optional(Queue).pipe(T.JsonName("queue")) }) {}
export class Metadata extends S.Class<Metadata>("Metadata")({
  ETag: S.optional(S.String).pipe(T.JsonName("eTag")),
  FileSize: S.optional(S.Number).pipe(T.JsonName("fileSize")),
  LastModified: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ).pipe(T.JsonName("lastModified")),
  MimeType: S.optional(S.String).pipe(T.JsonName("mimeType")),
}) {}
export class TrackMapping extends S.Class<TrackMapping>("TrackMapping")({
  AudioTrackIndexes: S.optional(__listOf__integer).pipe(
    T.JsonName("audioTrackIndexes"),
  ),
  DataTrackIndexes: S.optional(__listOf__integer).pipe(
    T.JsonName("dataTrackIndexes"),
  ),
  VideoTrackIndexes: S.optional(__listOf__integer).pipe(
    T.JsonName("videoTrackIndexes"),
  ),
}) {}
export const __listOfTrackMapping = S.Array(TrackMapping);
export class DataProperties extends S.Class<DataProperties>("DataProperties")({
  LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
}) {}
export class CreatePresetRequest extends S.Class<CreatePresetRequest>(
  "CreatePresetRequest",
)(
  {
    Category: S.optional(S.String).pipe(T.JsonName("category")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Name: S.String.pipe(T.JsonName("name")),
    Settings: PresetSettings.pipe(T.JsonName("settings")),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2017-08-29/presets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetJobResponse extends S.Class<GetJobResponse>("GetJobResponse")({
  Job: S.optional(Job).pipe(T.JsonName("job")),
}) {}
export class FrameRate extends S.Class<FrameRate>("FrameRate")({
  Denominator: S.optional(S.Number).pipe(T.JsonName("denominator")),
  Numerator: S.optional(S.Number).pipe(T.JsonName("numerator")),
}) {}
export class CodecMetadata extends S.Class<CodecMetadata>("CodecMetadata")({
  BitDepth: S.optional(S.Number).pipe(T.JsonName("bitDepth")),
  ChromaSubsampling: S.optional(S.String).pipe(T.JsonName("chromaSubsampling")),
  CodedFrameRate: S.optional(FrameRate).pipe(T.JsonName("codedFrameRate")),
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
}) {}
export class AudioProperties extends S.Class<AudioProperties>(
  "AudioProperties",
)({
  BitDepth: S.optional(S.Number).pipe(T.JsonName("bitDepth")),
  BitRate: S.optional(S.Number).pipe(T.JsonName("bitRate")),
  Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
  FrameRate: S.optional(FrameRate).pipe(T.JsonName("frameRate")),
  LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
  SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
}) {}
export class VideoProperties extends S.Class<VideoProperties>(
  "VideoProperties",
)({
  BitDepth: S.optional(S.Number).pipe(T.JsonName("bitDepth")),
  BitRate: S.optional(S.Number).pipe(T.JsonName("bitRate")),
  CodecMetadata: S.optional(CodecMetadata).pipe(T.JsonName("codecMetadata")),
  ColorPrimaries: S.optional(S.String).pipe(T.JsonName("colorPrimaries")),
  FrameRate: S.optional(FrameRate).pipe(T.JsonName("frameRate")),
  Height: S.optional(S.Number).pipe(T.JsonName("height")),
  MatrixCoefficients: S.optional(S.String).pipe(
    T.JsonName("matrixCoefficients"),
  ),
  TransferCharacteristics: S.optional(S.String).pipe(
    T.JsonName("transferCharacteristics"),
  ),
  Width: S.optional(S.Number).pipe(T.JsonName("width")),
}) {}
export class Track extends S.Class<Track>("Track")({
  AudioProperties: S.optional(AudioProperties).pipe(
    T.JsonName("audioProperties"),
  ),
  Codec: S.optional(S.String).pipe(T.JsonName("codec")),
  DataProperties: S.optional(DataProperties).pipe(T.JsonName("dataProperties")),
  Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
  Index: S.optional(S.Number).pipe(T.JsonName("index")),
  TrackType: S.optional(S.String).pipe(T.JsonName("trackType")),
  VideoProperties: S.optional(VideoProperties).pipe(
    T.JsonName("videoProperties"),
  ),
}) {}
export const __listOfTrack = S.Array(Track);
export class CreatePresetResponse extends S.Class<CreatePresetResponse>(
  "CreatePresetResponse",
)({ Preset: S.optional(Preset).pipe(T.JsonName("preset")) }) {}
export class Container extends S.Class<Container>("Container")({
  Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
  Format: S.optional(S.String).pipe(T.JsonName("format")),
  Tracks: S.optional(__listOfTrack).pipe(T.JsonName("tracks")),
}) {}
export class ProbeResult extends S.Class<ProbeResult>("ProbeResult")({
  Container: S.optional(Container).pipe(T.JsonName("container")),
  Metadata: S.optional(Metadata).pipe(T.JsonName("metadata")),
  TrackMappings: S.optional(__listOfTrackMapping).pipe(
    T.JsonName("trackMappings"),
  ),
}) {}
export const __listOfProbeResult = S.Array(ProbeResult);
export class CreateJobRequest extends S.Class<CreateJobRequest>(
  "CreateJobRequest",
)(
  {
    AccelerationSettings: S.optional(AccelerationSettings).pipe(
      T.JsonName("accelerationSettings"),
    ),
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
    Settings: JobSettings.pipe(T.JsonName("settings")),
    SimulateReservedQueue: S.optional(S.String).pipe(
      T.JsonName("simulateReservedQueue"),
    ),
    StatusUpdateInterval: S.optional(S.String).pipe(
      T.JsonName("statusUpdateInterval"),
    ),
    Tags: S.optional(__mapOf__string).pipe(T.JsonName("tags")),
    UserMetadata: S.optional(__mapOf__string).pipe(T.JsonName("userMetadata")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2017-08-29/jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ProbeResponse extends S.Class<ProbeResponse>("ProbeResponse")({
  ProbeResults: S.optional(__listOfProbeResult).pipe(
    T.JsonName("probeResults"),
  ),
}) {}
export class CreateJobResponse extends S.Class<CreateJobResponse>(
  "CreateJobResponse",
)({ Job: S.optional(Job).pipe(T.JsonName("job")) }) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  {},
) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  {},
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {},
) {}

//# Operations
/**
 * Permanently delete a queue you have created.
 */
export const deleteQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Add tags to a MediaConvert queue, preset, or job template. For information about tagging, see the User Guide at https://docs.aws.amazon.com/mediaconvert/latest/ug/tagging-resources.html
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Permanently cancel a job. Once you have canceled a job, you can't start it again.
 */
export const cancelJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createResourceShare = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteJobTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Permanently delete a policy that you created.
 */
export const deletePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Permanently delete a preset you have created.
 */
export const deletePreset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieve a JSON array of up to twenty of your most recent jobs matched by a jobs query.
 */
export const getJobsQueryResults = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieve a JSON array of up to twenty of your job templates. This will return the templates themselves, not just a list of them. To retrieve the next twenty templates, use the nextToken string returned with the array
 */
export const listJobTemplates = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieve a JSON array of up to twenty of your presets. This will return the presets themselves, not just a list of them. To retrieve the next twenty presets, use the nextToken string returned with the array.
 */
export const listPresets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieve a JSON array of up to twenty of your queues. This will return the queues themselves, not just a list of them. To retrieve the next twenty queues, use the nextToken string returned with the array.
 */
export const listQueues = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Create or change your policy. For more information about policies, see the user guide at http://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
 */
export const putPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const searchJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Modify one of your existing job templates.
 */
export const updateJobTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePreset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Create a new transcoding queue. For information about queues, see Working With Queues in the User Guide at https://docs.aws.amazon.com/mediaconvert/latest/ug/working-with-queues.html
 */
export const createQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Send a request with an empty body to the regional API endpoint to get your account API endpoint. Note that DescribeEndpoints is no longer required. We recommend that you send your requests directly to the regional endpoint instead.
 */
export const describeEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieve the JSON for a specific job template.
 */
export const getJobTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPreset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Start an asynchronous jobs query using the provided filters. To receive the list of jobs that match your query, call the GetJobsQueryResults API using the query ID returned by this API.
 */
export const startJobsQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Create a new job template. For information about job templates see the User Guide at http://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
 */
export const createJobTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieve the JSON for a specific queue.
 */
export const getQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieve the JSON for a specific transcoding job.
 */
export const getJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Create a new preset. For information about job templates see the User Guide at http://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
 */
export const createPreset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const probe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

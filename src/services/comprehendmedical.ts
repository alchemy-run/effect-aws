import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "ComprehendMedical",
  serviceShapeName: "ComprehendMedical_20181030",
});
const auth = T.AwsAuthSigv4({ name: "comprehendmedical" });
const ver = T.ServiceVersion("2018-10-30");
const proto = T.AwsProtocolsAwsJson1_1();
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
                        url: "https://comprehendmedical-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [],
                      endpoint: {
                        url: "https://comprehendmedical-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://comprehendmedical.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
              conditions: [],
              endpoint: {
                url: "https://comprehendmedical.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeEntitiesDetectionV2JobRequest extends S.Class<DescribeEntitiesDetectionV2JobRequest>(
  "DescribeEntitiesDetectionV2JobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeICD10CMInferenceJobRequest extends S.Class<DescribeICD10CMInferenceJobRequest>(
  "DescribeICD10CMInferenceJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePHIDetectionJobRequest extends S.Class<DescribePHIDetectionJobRequest>(
  "DescribePHIDetectionJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRxNormInferenceJobRequest extends S.Class<DescribeRxNormInferenceJobRequest>(
  "DescribeRxNormInferenceJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSNOMEDCTInferenceJobRequest extends S.Class<DescribeSNOMEDCTInferenceJobRequest>(
  "DescribeSNOMEDCTInferenceJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetectEntitiesRequest extends S.Class<DetectEntitiesRequest>(
  "DetectEntitiesRequest",
)(
  { Text: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetectEntitiesV2Request extends S.Class<DetectEntitiesV2Request>(
  "DetectEntitiesV2Request",
)(
  { Text: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetectPHIRequest extends S.Class<DetectPHIRequest>(
  "DetectPHIRequest",
)(
  { Text: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class InferICD10CMRequest extends S.Class<InferICD10CMRequest>(
  "InferICD10CMRequest",
)(
  { Text: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class InferRxNormRequest extends S.Class<InferRxNormRequest>(
  "InferRxNormRequest",
)(
  { Text: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class InferSNOMEDCTRequest extends S.Class<InferSNOMEDCTRequest>(
  "InferSNOMEDCTRequest",
)(
  { Text: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ComprehendMedicalAsyncJobFilter extends S.Class<ComprehendMedicalAsyncJobFilter>(
  "ComprehendMedicalAsyncJobFilter",
)({
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  SubmitTimeBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SubmitTimeAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ListICD10CMInferenceJobsRequest extends S.Class<ListICD10CMInferenceJobsRequest>(
  "ListICD10CMInferenceJobsRequest",
)(
  {
    Filter: S.optional(ComprehendMedicalAsyncJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPHIDetectionJobsRequest extends S.Class<ListPHIDetectionJobsRequest>(
  "ListPHIDetectionJobsRequest",
)(
  {
    Filter: S.optional(ComprehendMedicalAsyncJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRxNormInferenceJobsRequest extends S.Class<ListRxNormInferenceJobsRequest>(
  "ListRxNormInferenceJobsRequest",
)(
  {
    Filter: S.optional(ComprehendMedicalAsyncJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSNOMEDCTInferenceJobsRequest extends S.Class<ListSNOMEDCTInferenceJobsRequest>(
  "ListSNOMEDCTInferenceJobsRequest",
)(
  {
    Filter: S.optional(ComprehendMedicalAsyncJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class InputDataConfig extends S.Class<InputDataConfig>(
  "InputDataConfig",
)({ S3Bucket: S.String, S3Key: S.optional(S.String) }) {}
export class OutputDataConfig extends S.Class<OutputDataConfig>(
  "OutputDataConfig",
)({ S3Bucket: S.String, S3Key: S.optional(S.String) }) {}
export class StartICD10CMInferenceJobRequest extends S.Class<StartICD10CMInferenceJobRequest>(
  "StartICD10CMInferenceJobRequest",
)(
  {
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    JobName: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    KMSKey: S.optional(S.String),
    LanguageCode: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartPHIDetectionJobRequest extends S.Class<StartPHIDetectionJobRequest>(
  "StartPHIDetectionJobRequest",
)(
  {
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    JobName: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    KMSKey: S.optional(S.String),
    LanguageCode: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartRxNormInferenceJobRequest extends S.Class<StartRxNormInferenceJobRequest>(
  "StartRxNormInferenceJobRequest",
)(
  {
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    JobName: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    KMSKey: S.optional(S.String),
    LanguageCode: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartSNOMEDCTInferenceJobRequest extends S.Class<StartSNOMEDCTInferenceJobRequest>(
  "StartSNOMEDCTInferenceJobRequest",
)(
  {
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    JobName: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    KMSKey: S.optional(S.String),
    LanguageCode: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopEntitiesDetectionV2JobRequest extends S.Class<StopEntitiesDetectionV2JobRequest>(
  "StopEntitiesDetectionV2JobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopICD10CMInferenceJobRequest extends S.Class<StopICD10CMInferenceJobRequest>(
  "StopICD10CMInferenceJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopPHIDetectionJobRequest extends S.Class<StopPHIDetectionJobRequest>(
  "StopPHIDetectionJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopRxNormInferenceJobRequest extends S.Class<StopRxNormInferenceJobRequest>(
  "StopRxNormInferenceJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopSNOMEDCTInferenceJobRequest extends S.Class<StopSNOMEDCTInferenceJobRequest>(
  "StopSNOMEDCTInferenceJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ComprehendMedicalAsyncJobProperties extends S.Class<ComprehendMedicalAsyncJobProperties>(
  "ComprehendMedicalAsyncJobProperties",
)({
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
}) {}
export const ComprehendMedicalAsyncJobPropertiesList = S.Array(
  ComprehendMedicalAsyncJobProperties,
);
export class DescribeICD10CMInferenceJobResponse extends S.Class<DescribeICD10CMInferenceJobResponse>(
  "DescribeICD10CMInferenceJobResponse",
)({
  ComprehendMedicalAsyncJobProperties: S.optional(
    ComprehendMedicalAsyncJobProperties,
  ),
}) {}
export class DescribePHIDetectionJobResponse extends S.Class<DescribePHIDetectionJobResponse>(
  "DescribePHIDetectionJobResponse",
)({
  ComprehendMedicalAsyncJobProperties: S.optional(
    ComprehendMedicalAsyncJobProperties,
  ),
}) {}
export class DescribeRxNormInferenceJobResponse extends S.Class<DescribeRxNormInferenceJobResponse>(
  "DescribeRxNormInferenceJobResponse",
)({
  ComprehendMedicalAsyncJobProperties: S.optional(
    ComprehendMedicalAsyncJobProperties,
  ),
}) {}
export class DescribeSNOMEDCTInferenceJobResponse extends S.Class<DescribeSNOMEDCTInferenceJobResponse>(
  "DescribeSNOMEDCTInferenceJobResponse",
)({
  ComprehendMedicalAsyncJobProperties: S.optional(
    ComprehendMedicalAsyncJobProperties,
  ),
}) {}
export class Trait extends S.Class<Trait>("Trait")({
  Name: S.optional(S.String),
  Score: S.optional(S.Number),
}) {}
export const TraitList = S.Array(Trait);
export class Attribute extends S.Class<Attribute>("Attribute")({
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
}) {}
export const AttributeList = S.Array(Attribute);
export class Entity extends S.Class<Entity>("Entity")({
  Id: S.optional(S.Number),
  BeginOffset: S.optional(S.Number),
  EndOffset: S.optional(S.Number),
  Score: S.optional(S.Number),
  Text: S.optional(S.String),
  Category: S.optional(S.String),
  Type: S.optional(S.String),
  Traits: S.optional(TraitList),
  Attributes: S.optional(AttributeList),
}) {}
export const EntityList = S.Array(Entity);
export class UnmappedAttribute extends S.Class<UnmappedAttribute>(
  "UnmappedAttribute",
)({ Type: S.optional(S.String), Attribute: S.optional(Attribute) }) {}
export const UnmappedAttributeList = S.Array(UnmappedAttribute);
export class DetectEntitiesV2Response extends S.Class<DetectEntitiesV2Response>(
  "DetectEntitiesV2Response",
)({
  Entities: EntityList,
  UnmappedAttributes: S.optional(UnmappedAttributeList),
  PaginationToken: S.optional(S.String),
  ModelVersion: S.String,
}) {}
export class DetectPHIResponse extends S.Class<DetectPHIResponse>(
  "DetectPHIResponse",
)({
  Entities: EntityList,
  PaginationToken: S.optional(S.String),
  ModelVersion: S.String,
}) {}
export class ListEntitiesDetectionV2JobsRequest extends S.Class<ListEntitiesDetectionV2JobsRequest>(
  "ListEntitiesDetectionV2JobsRequest",
)(
  {
    Filter: S.optional(ComprehendMedicalAsyncJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListICD10CMInferenceJobsResponse extends S.Class<ListICD10CMInferenceJobsResponse>(
  "ListICD10CMInferenceJobsResponse",
)({
  ComprehendMedicalAsyncJobPropertiesList: S.optional(
    ComprehendMedicalAsyncJobPropertiesList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListPHIDetectionJobsResponse extends S.Class<ListPHIDetectionJobsResponse>(
  "ListPHIDetectionJobsResponse",
)({
  ComprehendMedicalAsyncJobPropertiesList: S.optional(
    ComprehendMedicalAsyncJobPropertiesList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListRxNormInferenceJobsResponse extends S.Class<ListRxNormInferenceJobsResponse>(
  "ListRxNormInferenceJobsResponse",
)({
  ComprehendMedicalAsyncJobPropertiesList: S.optional(
    ComprehendMedicalAsyncJobPropertiesList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListSNOMEDCTInferenceJobsResponse extends S.Class<ListSNOMEDCTInferenceJobsResponse>(
  "ListSNOMEDCTInferenceJobsResponse",
)({
  ComprehendMedicalAsyncJobPropertiesList: S.optional(
    ComprehendMedicalAsyncJobPropertiesList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class StartEntitiesDetectionV2JobRequest extends S.Class<StartEntitiesDetectionV2JobRequest>(
  "StartEntitiesDetectionV2JobRequest",
)(
  {
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    JobName: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    KMSKey: S.optional(S.String),
    LanguageCode: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartICD10CMInferenceJobResponse extends S.Class<StartICD10CMInferenceJobResponse>(
  "StartICD10CMInferenceJobResponse",
)({ JobId: S.optional(S.String) }) {}
export class StartPHIDetectionJobResponse extends S.Class<StartPHIDetectionJobResponse>(
  "StartPHIDetectionJobResponse",
)({ JobId: S.optional(S.String) }) {}
export class StartRxNormInferenceJobResponse extends S.Class<StartRxNormInferenceJobResponse>(
  "StartRxNormInferenceJobResponse",
)({ JobId: S.optional(S.String) }) {}
export class StartSNOMEDCTInferenceJobResponse extends S.Class<StartSNOMEDCTInferenceJobResponse>(
  "StartSNOMEDCTInferenceJobResponse",
)({ JobId: S.optional(S.String) }) {}
export class StopEntitiesDetectionV2JobResponse extends S.Class<StopEntitiesDetectionV2JobResponse>(
  "StopEntitiesDetectionV2JobResponse",
)({ JobId: S.optional(S.String) }) {}
export class StopICD10CMInferenceJobResponse extends S.Class<StopICD10CMInferenceJobResponse>(
  "StopICD10CMInferenceJobResponse",
)({ JobId: S.optional(S.String) }) {}
export class StopPHIDetectionJobResponse extends S.Class<StopPHIDetectionJobResponse>(
  "StopPHIDetectionJobResponse",
)({ JobId: S.optional(S.String) }) {}
export class StopRxNormInferenceJobResponse extends S.Class<StopRxNormInferenceJobResponse>(
  "StopRxNormInferenceJobResponse",
)({ JobId: S.optional(S.String) }) {}
export class StopSNOMEDCTInferenceJobResponse extends S.Class<StopSNOMEDCTInferenceJobResponse>(
  "StopSNOMEDCTInferenceJobResponse",
)({ JobId: S.optional(S.String) }) {}
export class SNOMEDCTDetails extends S.Class<SNOMEDCTDetails>(
  "SNOMEDCTDetails",
)({
  Edition: S.optional(S.String),
  Language: S.optional(S.String),
  VersionDate: S.optional(S.String),
}) {}
export class Characters extends S.Class<Characters>("Characters")({
  OriginalTextCharacters: S.optional(S.Number),
}) {}
export class DescribeEntitiesDetectionV2JobResponse extends S.Class<DescribeEntitiesDetectionV2JobResponse>(
  "DescribeEntitiesDetectionV2JobResponse",
)({
  ComprehendMedicalAsyncJobProperties: S.optional(
    ComprehendMedicalAsyncJobProperties,
  ),
}) {}
export class ListEntitiesDetectionV2JobsResponse extends S.Class<ListEntitiesDetectionV2JobsResponse>(
  "ListEntitiesDetectionV2JobsResponse",
)({
  ComprehendMedicalAsyncJobPropertiesList: S.optional(
    ComprehendMedicalAsyncJobPropertiesList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class StartEntitiesDetectionV2JobResponse extends S.Class<StartEntitiesDetectionV2JobResponse>(
  "StartEntitiesDetectionV2JobResponse",
)({ JobId: S.optional(S.String) }) {}
export class ICD10CMTrait extends S.Class<ICD10CMTrait>("ICD10CMTrait")({
  Name: S.optional(S.String),
  Score: S.optional(S.Number),
}) {}
export const ICD10CMTraitList = S.Array(ICD10CMTrait);
export class ICD10CMAttribute extends S.Class<ICD10CMAttribute>(
  "ICD10CMAttribute",
)({
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
}) {}
export const ICD10CMAttributeList = S.Array(ICD10CMAttribute);
export class ICD10CMConcept extends S.Class<ICD10CMConcept>("ICD10CMConcept")({
  Description: S.optional(S.String),
  Code: S.optional(S.String),
  Score: S.optional(S.Number),
}) {}
export const ICD10CMConceptList = S.Array(ICD10CMConcept);
export class RxNormTrait extends S.Class<RxNormTrait>("RxNormTrait")({
  Name: S.optional(S.String),
  Score: S.optional(S.Number),
}) {}
export const RxNormTraitList = S.Array(RxNormTrait);
export class RxNormAttribute extends S.Class<RxNormAttribute>(
  "RxNormAttribute",
)({
  Type: S.optional(S.String),
  Score: S.optional(S.Number),
  RelationshipScore: S.optional(S.Number),
  Id: S.optional(S.Number),
  BeginOffset: S.optional(S.Number),
  EndOffset: S.optional(S.Number),
  Text: S.optional(S.String),
  Traits: S.optional(RxNormTraitList),
}) {}
export const RxNormAttributeList = S.Array(RxNormAttribute);
export class RxNormConcept extends S.Class<RxNormConcept>("RxNormConcept")({
  Description: S.optional(S.String),
  Code: S.optional(S.String),
  Score: S.optional(S.Number),
}) {}
export const RxNormConceptList = S.Array(RxNormConcept);
export class SNOMEDCTTrait extends S.Class<SNOMEDCTTrait>("SNOMEDCTTrait")({
  Name: S.optional(S.String),
  Score: S.optional(S.Number),
}) {}
export const SNOMEDCTTraitList = S.Array(SNOMEDCTTrait);
export class SNOMEDCTConcept extends S.Class<SNOMEDCTConcept>(
  "SNOMEDCTConcept",
)({
  Description: S.optional(S.String),
  Code: S.optional(S.String),
  Score: S.optional(S.Number),
}) {}
export const SNOMEDCTConceptList = S.Array(SNOMEDCTConcept);
export class SNOMEDCTAttribute extends S.Class<SNOMEDCTAttribute>(
  "SNOMEDCTAttribute",
)({
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
}) {}
export const SNOMEDCTAttributeList = S.Array(SNOMEDCTAttribute);
export class ICD10CMEntity extends S.Class<ICD10CMEntity>("ICD10CMEntity")({
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
}) {}
export const ICD10CMEntityList = S.Array(ICD10CMEntity);
export class RxNormEntity extends S.Class<RxNormEntity>("RxNormEntity")({
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
}) {}
export const RxNormEntityList = S.Array(RxNormEntity);
export class SNOMEDCTEntity extends S.Class<SNOMEDCTEntity>("SNOMEDCTEntity")({
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
}) {}
export const SNOMEDCTEntityList = S.Array(SNOMEDCTEntity);
export class DetectEntitiesResponse extends S.Class<DetectEntitiesResponse>(
  "DetectEntitiesResponse",
)({
  Entities: EntityList,
  UnmappedAttributes: S.optional(UnmappedAttributeList),
  PaginationToken: S.optional(S.String),
  ModelVersion: S.String,
}) {}
export class InferICD10CMResponse extends S.Class<InferICD10CMResponse>(
  "InferICD10CMResponse",
)({
  Entities: ICD10CMEntityList,
  PaginationToken: S.optional(S.String),
  ModelVersion: S.optional(S.String),
}) {}
export class InferRxNormResponse extends S.Class<InferRxNormResponse>(
  "InferRxNormResponse",
)({
  Entities: RxNormEntityList,
  PaginationToken: S.optional(S.String),
  ModelVersion: S.optional(S.String),
}) {}
export class InferSNOMEDCTResponse extends S.Class<InferSNOMEDCTResponse>(
  "InferSNOMEDCTResponse",
)({
  Entities: SNOMEDCTEntityList,
  PaginationToken: S.optional(S.String),
  ModelVersion: S.optional(S.String),
  SNOMEDCTDetails: S.optional(SNOMEDCTDetails),
  Characters: S.optional(Characters),
}) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
) {}
export class InvalidEncodingException extends S.TaggedError<InvalidEncodingException>()(
  "InvalidEncodingException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class TextSizeLimitExceededException extends S.TaggedError<TextSizeLimitExceededException>()(
  "TextSizeLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Starts an asynchronous medical entity detection job for a collection of documents. Use the
 * `DescribeEntitiesDetectionV2Job` operation to track the status of a job.
 */
export const startEntitiesDetectionV2Job = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartEntitiesDetectionV2JobRequest,
    output: StartEntitiesDetectionV2JobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Gets the properties associated with a protected health information (PHI) detection job.
 * Use this operation to get the status of a detection job.
 */
export const describePHIDetectionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribePHIDetectionJobRequest,
    output: DescribePHIDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Gets the properties associated with an InferRxNorm job. Use this operation to get the
 * status of an inference job.
 */
export const describeRxNormInferenceJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeRxNormInferenceJobRequest,
    output: DescribeRxNormInferenceJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Gets the properties associated with an InferSNOMEDCT job. Use this operation to get the status of an inference job.
 */
export const describeSNOMEDCTInferenceJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startICD10CMInferenceJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartICD10CMInferenceJobRequest,
    output: StartICD10CMInferenceJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Starts an asynchronous job to detect protected health information (PHI). Use the
 * `DescribePHIDetectionJob` operation to track the status of a job.
 */
export const startPHIDetectionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartPHIDetectionJobRequest,
    output: StartPHIDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Starts an asynchronous job to detect medication entities and link them to the RxNorm
 * ontology. Use the `DescribeRxNormInferenceJob` operation to track the status of a
 * job.
 */
export const startRxNormInferenceJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartRxNormInferenceJobRequest,
    output: StartRxNormInferenceJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Starts an asynchronous job to detect medical concepts and link them to the SNOMED-CT ontology. Use the DescribeSNOMEDCTInferenceJob operation to track the status of a job.
 */
export const startSNOMEDCTInferenceJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartSNOMEDCTInferenceJobRequest,
    output: StartSNOMEDCTInferenceJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Stops a medical entities detection job in progress.
 */
export const stopEntitiesDetectionV2Job = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopEntitiesDetectionV2JobRequest,
    output: StopEntitiesDetectionV2JobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Stops an InferICD10CM inference job in progress.
 */
export const stopICD10CMInferenceJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopICD10CMInferenceJobRequest,
    output: StopICD10CMInferenceJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Stops a protected health information (PHI) detection job in progress.
 */
export const stopPHIDetectionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopRxNormInferenceJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopRxNormInferenceJobRequest,
    output: StopRxNormInferenceJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Stops an InferSNOMEDCT inference job in progress.
 */
export const stopSNOMEDCTInferenceJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopSNOMEDCTInferenceJobRequest,
    output: StopSNOMEDCTInferenceJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Gets the properties associated with a medical entities detection job. Use this operation
 * to get the status of a detection job.
 */
export const describeEntitiesDetectionV2Job =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeICD10CMInferenceJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeICD10CMInferenceJobRequest,
    output: DescribeICD10CMInferenceJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
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
export const detectEntitiesV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listEntitiesDetectionV2Jobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListEntitiesDetectionV2JobsRequest,
    output: ListEntitiesDetectionV2JobsResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Inspects the clinical text for protected health information (PHI) entities and returns
 * the entity category, location, and confidence score for each entity. Amazon Comprehend Medical
 * only detects entities in English language texts.
 */
export const detectPHI = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const detectEntities = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const inferICD10CM = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const inferRxNorm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const inferSNOMEDCT = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listICD10CMInferenceJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListICD10CMInferenceJobsRequest,
    output: ListICD10CMInferenceJobsResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Gets a list of protected health information (PHI) detection jobs you have
 * submitted.
 */
export const listPHIDetectionJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPHIDetectionJobsRequest,
    output: ListPHIDetectionJobsResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Gets a list of InferRxNorm jobs that you have submitted.
 */
export const listRxNormInferenceJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListRxNormInferenceJobsRequest,
    output: ListRxNormInferenceJobsResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Gets a list of InferSNOMEDCT jobs a user has submitted.
 */
export const listSNOMEDCTInferenceJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSNOMEDCTInferenceJobsRequest,
    output: ListSNOMEDCTInferenceJobsResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);

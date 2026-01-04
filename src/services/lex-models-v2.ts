import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Lex Models V2",
  serviceShapeName: "LexModelBuildingServiceV2",
});
const auth = T.AwsAuthSigv4({ name: "lex" });
const ver = T.ServiceVersion("2020-08-07");
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
                        url: "https://models-v2-lex-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://models-v2-lex-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://models-v2-lex.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://models-v2-lex.{Region}.{PartitionResult#dnsSuffix}",
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
export class CreateUploadUrlRequest extends S.Class<CreateUploadUrlRequest>(
  "CreateUploadUrlRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/createuploadurl" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const OperationList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class BuildBotLocaleRequest extends S.Class<BuildBotLocaleRequest>(
  "BuildBotLocaleRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateBotReplicaRequest extends S.Class<CreateBotReplicaRequest>(
  "CreateBotReplicaRequest",
)(
  { botId: S.String.pipe(T.HttpLabel()), replicaRegion: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/bots/{botId}/replicas" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateResourcePolicyRequest extends S.Class<CreateResourcePolicyRequest>(
  "CreateResourcePolicyRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()), policy: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/policy/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateUploadUrlResponse extends S.Class<CreateUploadUrlResponse>(
  "CreateUploadUrlResponse",
)({ importId: S.optional(S.String), uploadUrl: S.optional(S.String) }) {}
export class DeleteBotRequest extends S.Class<DeleteBotRequest>(
  "DeleteBotRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    skipResourceInUseCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipResourceInUseCheck"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/bots/{botId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBotAliasRequest extends S.Class<DeleteBotAliasRequest>(
  "DeleteBotAliasRequest",
)(
  {
    botAliasId: S.String.pipe(T.HttpLabel()),
    botId: S.String.pipe(T.HttpLabel()),
    skipResourceInUseCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipResourceInUseCheck"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/bots/{botId}/botaliases/{botAliasId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBotLocaleRequest extends S.Class<DeleteBotLocaleRequest>(
  "DeleteBotLocaleRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBotReplicaRequest extends S.Class<DeleteBotReplicaRequest>(
  "DeleteBotReplicaRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    replicaRegion: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/bots/{botId}/replicas/{replicaRegion}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBotVersionRequest extends S.Class<DeleteBotVersionRequest>(
  "DeleteBotVersionRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    skipResourceInUseCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipResourceInUseCheck"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/bots/{botId}/botversions/{botVersion}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCustomVocabularyRequest extends S.Class<DeleteCustomVocabularyRequest>(
  "DeleteCustomVocabularyRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/customvocabulary",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteExportRequest extends S.Class<DeleteExportRequest>(
  "DeleteExportRequest",
)(
  { exportId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/exports/{exportId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteImportRequest extends S.Class<DeleteImportRequest>(
  "DeleteImportRequest",
)(
  { importId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/imports/{importId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIntentRequest extends S.Class<DeleteIntentRequest>(
  "DeleteIntentRequest",
)(
  {
    intentId: S.String.pipe(T.HttpLabel()),
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents/{intentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIntentResponse extends S.Class<DeleteIntentResponse>(
  "DeleteIntentResponse",
)({}) {}
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel()),
    expectedRevisionId: S.optional(S.String).pipe(
      T.HttpQuery("expectedRevisionId"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/policy/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourcePolicyStatementRequest extends S.Class<DeleteResourcePolicyStatementRequest>(
  "DeleteResourcePolicyStatementRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel()),
    statementId: S.String.pipe(T.HttpLabel()),
    expectedRevisionId: S.optional(S.String).pipe(
      T.HttpQuery("expectedRevisionId"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/policy/{resourceArn}/statements/{statementId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSlotRequest extends S.Class<DeleteSlotRequest>(
  "DeleteSlotRequest",
)(
  {
    slotId: S.String.pipe(T.HttpLabel()),
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    intentId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents/{intentId}/slots/{slotId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSlotResponse extends S.Class<DeleteSlotResponse>(
  "DeleteSlotResponse",
)({}) {}
export class DeleteSlotTypeRequest extends S.Class<DeleteSlotTypeRequest>(
  "DeleteSlotTypeRequest",
)(
  {
    slotTypeId: S.String.pipe(T.HttpLabel()),
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    skipResourceInUseCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipResourceInUseCheck"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/slottypes/{slotTypeId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSlotTypeResponse extends S.Class<DeleteSlotTypeResponse>(
  "DeleteSlotTypeResponse",
)({}) {}
export class DeleteTestSetRequest extends S.Class<DeleteTestSetRequest>(
  "DeleteTestSetRequest",
)(
  { testSetId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/testsets/{testSetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTestSetResponse extends S.Class<DeleteTestSetResponse>(
  "DeleteTestSetResponse",
)({}) {}
export class DeleteUtterancesRequest extends S.Class<DeleteUtterancesRequest>(
  "DeleteUtterancesRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    localeId: S.optional(S.String).pipe(T.HttpQuery("localeId")),
    sessionId: S.optional(S.String).pipe(T.HttpQuery("sessionId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/bots/{botId}/utterances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteUtterancesResponse extends S.Class<DeleteUtterancesResponse>(
  "DeleteUtterancesResponse",
)({}) {}
export class DescribeBotRequest extends S.Class<DescribeBotRequest>(
  "DescribeBotRequest",
)(
  { botId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/bots/{botId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeBotAliasRequest extends S.Class<DescribeBotAliasRequest>(
  "DescribeBotAliasRequest",
)(
  {
    botAliasId: S.String.pipe(T.HttpLabel()),
    botId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/bots/{botId}/botaliases/{botAliasId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeBotLocaleRequest extends S.Class<DescribeBotLocaleRequest>(
  "DescribeBotLocaleRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeBotRecommendationRequest extends S.Class<DescribeBotRecommendationRequest>(
  "DescribeBotRecommendationRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    botRecommendationId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/botrecommendations/{botRecommendationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeBotReplicaRequest extends S.Class<DescribeBotReplicaRequest>(
  "DescribeBotReplicaRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    replicaRegion: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/bots/{botId}/replicas/{replicaRegion}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeBotResourceGenerationRequest extends S.Class<DescribeBotResourceGenerationRequest>(
  "DescribeBotResourceGenerationRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    generationId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/generations/{generationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeBotVersionRequest extends S.Class<DescribeBotVersionRequest>(
  "DescribeBotVersionRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/bots/{botId}/botversions/{botVersion}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeCustomVocabularyMetadataRequest extends S.Class<DescribeCustomVocabularyMetadataRequest>(
  "DescribeCustomVocabularyMetadataRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/customvocabulary/DEFAULT/metadata",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeExportRequest extends S.Class<DescribeExportRequest>(
  "DescribeExportRequest",
)(
  { exportId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/exports/{exportId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeImportRequest extends S.Class<DescribeImportRequest>(
  "DescribeImportRequest",
)(
  { importId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/imports/{importId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeIntentRequest extends S.Class<DescribeIntentRequest>(
  "DescribeIntentRequest",
)(
  {
    intentId: S.String.pipe(T.HttpLabel()),
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents/{intentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeResourcePolicyRequest extends S.Class<DescribeResourcePolicyRequest>(
  "DescribeResourcePolicyRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/policy/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSlotRequest extends S.Class<DescribeSlotRequest>(
  "DescribeSlotRequest",
)(
  {
    slotId: S.String.pipe(T.HttpLabel()),
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    intentId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents/{intentId}/slots/{slotId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSlotTypeRequest extends S.Class<DescribeSlotTypeRequest>(
  "DescribeSlotTypeRequest",
)(
  {
    slotTypeId: S.String.pipe(T.HttpLabel()),
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/slottypes/{slotTypeId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeTestExecutionRequest extends S.Class<DescribeTestExecutionRequest>(
  "DescribeTestExecutionRequest",
)(
  { testExecutionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/testexecutions/{testExecutionId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeTestSetRequest extends S.Class<DescribeTestSetRequest>(
  "DescribeTestSetRequest",
)(
  { testSetId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/testsets/{testSetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeTestSetDiscrepancyReportRequest extends S.Class<DescribeTestSetDiscrepancyReportRequest>(
  "DescribeTestSetDiscrepancyReportRequest",
)(
  { testSetDiscrepancyReportId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/testsetdiscrepancy/{testSetDiscrepancyReportId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeTestSetGenerationRequest extends S.Class<DescribeTestSetGenerationRequest>(
  "DescribeTestSetGenerationRequest",
)(
  { testSetGenerationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/testsetgenerations/{testSetGenerationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GenerateBotElementRequest extends S.Class<GenerateBotElementRequest>(
  "GenerateBotElementRequest",
)(
  {
    intentId: S.String,
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/generate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTestExecutionArtifactsUrlRequest extends S.Class<GetTestExecutionArtifactsUrlRequest>(
  "GetTestExecutionArtifactsUrlRequest",
)(
  { testExecutionId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/testexecutions/{testExecutionId}/artifacturl",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBotAliasesRequest extends S.Class<ListBotAliasesRequest>(
  "ListBotAliasesRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/bots/{botId}/botaliases" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBotAliasReplicasRequest extends S.Class<ListBotAliasReplicasRequest>(
  "ListBotAliasReplicasRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    replicaRegion: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/bots/{botId}/replicas/{replicaRegion}/botaliases",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBotRecommendationsRequest extends S.Class<ListBotRecommendationsRequest>(
  "ListBotRecommendationsRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/botrecommendations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBotReplicasRequest extends S.Class<ListBotReplicasRequest>(
  "ListBotReplicasRequest",
)(
  { botId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "POST", uri: "/bots/{botId}/replicas" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCustomVocabularyItemsRequest extends S.Class<ListCustomVocabularyItemsRequest>(
  "ListCustomVocabularyItemsRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/customvocabulary/DEFAULT/list",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRecommendedIntentsRequest extends S.Class<ListRecommendedIntentsRequest>(
  "ListRecommendedIntentsRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    botRecommendationId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/botrecommendations/{botRecommendationId}/intents",
    }),
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
  { resourceARN: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceARN}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTestSetRecordsRequest extends S.Class<ListTestSetRecordsRequest>(
  "ListTestSetRecordsRequest",
)(
  {
    testSetId: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/testsets/{testSetId}/records" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartBotResourceGenerationRequest extends S.Class<StartBotResourceGenerationRequest>(
  "StartBotResourceGenerationRequest",
)(
  {
    generationInputPrompt: S.String,
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/startgeneration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopBotRecommendationRequest extends S.Class<StopBotRecommendationRequest>(
  "StopBotRecommendationRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    botRecommendationId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/botrecommendations/{botRecommendationId}/stopbotrecommendation",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceARN: S.String.pipe(T.HttpLabel()), tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceARN}" }),
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
    resourceARN: S.String.pipe(T.HttpLabel()),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceARN}" }),
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
export class DataPrivacy extends S.Class<DataPrivacy>("DataPrivacy")({
  childDirected: S.Boolean,
}) {}
export class BotMember extends S.Class<BotMember>("BotMember")({
  botMemberId: S.String,
  botMemberName: S.String,
  botMemberAliasId: S.String,
  botMemberAliasName: S.String,
  botMemberVersion: S.String,
}) {}
export const BotMembers = S.Array(BotMember);
export class ErrorLogSettings extends S.Class<ErrorLogSettings>(
  "ErrorLogSettings",
)({ enabled: S.Boolean }) {}
export class UpdateBotRequest extends S.Class<UpdateBotRequest>(
  "UpdateBotRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botName: S.String,
    description: S.optional(S.String),
    roleArn: S.String,
    dataPrivacy: DataPrivacy,
    idleSessionTTLInSeconds: S.Number,
    botType: S.optional(S.String),
    botMembers: S.optional(BotMembers),
    errorLogSettings: S.optional(ErrorLogSettings),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/bots/{botId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LambdaCodeHook extends S.Class<LambdaCodeHook>("LambdaCodeHook")({
  lambdaARN: S.String,
  codeHookInterfaceVersion: S.String,
}) {}
export class CodeHookSpecification extends S.Class<CodeHookSpecification>(
  "CodeHookSpecification",
)({ lambdaCodeHook: LambdaCodeHook }) {}
export class BotAliasLocaleSettings extends S.Class<BotAliasLocaleSettings>(
  "BotAliasLocaleSettings",
)({
  enabled: S.Boolean,
  codeHookSpecification: S.optional(CodeHookSpecification),
}) {}
export const BotAliasLocaleSettingsMap = S.Record({
  key: S.String,
  value: BotAliasLocaleSettings,
});
export class CloudWatchLogGroupLogDestination extends S.Class<CloudWatchLogGroupLogDestination>(
  "CloudWatchLogGroupLogDestination",
)({ cloudWatchLogGroupArn: S.String, logPrefix: S.String }) {}
export class TextLogDestination extends S.Class<TextLogDestination>(
  "TextLogDestination",
)({ cloudWatch: CloudWatchLogGroupLogDestination }) {}
export class TextLogSetting extends S.Class<TextLogSetting>("TextLogSetting")({
  enabled: S.Boolean,
  destination: TextLogDestination,
  selectiveLoggingEnabled: S.optional(S.Boolean),
}) {}
export const TextLogSettingsList = S.Array(TextLogSetting);
export class S3BucketLogDestination extends S.Class<S3BucketLogDestination>(
  "S3BucketLogDestination",
)({
  kmsKeyArn: S.optional(S.String),
  s3BucketArn: S.String,
  logPrefix: S.String,
}) {}
export class AudioLogDestination extends S.Class<AudioLogDestination>(
  "AudioLogDestination",
)({ s3Bucket: S3BucketLogDestination }) {}
export class AudioLogSetting extends S.Class<AudioLogSetting>(
  "AudioLogSetting",
)({
  enabled: S.Boolean,
  destination: AudioLogDestination,
  selectiveLoggingEnabled: S.optional(S.Boolean),
}) {}
export const AudioLogSettingsList = S.Array(AudioLogSetting);
export class ConversationLogSettings extends S.Class<ConversationLogSettings>(
  "ConversationLogSettings",
)({
  textLogSettings: S.optional(TextLogSettingsList),
  audioLogSettings: S.optional(AudioLogSettingsList),
}) {}
export class SentimentAnalysisSettings extends S.Class<SentimentAnalysisSettings>(
  "SentimentAnalysisSettings",
)({ detectSentiment: S.Boolean }) {}
export class UpdateBotAliasRequest extends S.Class<UpdateBotAliasRequest>(
  "UpdateBotAliasRequest",
)(
  {
    botAliasId: S.String.pipe(T.HttpLabel()),
    botAliasName: S.String,
    description: S.optional(S.String),
    botVersion: S.optional(S.String),
    botAliasLocaleSettings: S.optional(BotAliasLocaleSettingsMap),
    conversationLogSettings: S.optional(ConversationLogSettings),
    sentimentAnalysisSettings: S.optional(SentimentAnalysisSettings),
    botId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/bots/{botId}/botaliases/{botAliasId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VoiceSettings extends S.Class<VoiceSettings>("VoiceSettings")({
  engine: S.optional(S.String),
  voiceId: S.String,
}) {}
export class SpeechFoundationModel extends S.Class<SpeechFoundationModel>(
  "SpeechFoundationModel",
)({ modelArn: S.String, voiceId: S.optional(S.String) }) {}
export class UnifiedSpeechSettings extends S.Class<UnifiedSpeechSettings>(
  "UnifiedSpeechSettings",
)({ speechFoundationModel: SpeechFoundationModel }) {}
export class DeepgramSpeechModelConfig extends S.Class<DeepgramSpeechModelConfig>(
  "DeepgramSpeechModelConfig",
)({ apiTokenSecretArn: S.String, modelId: S.optional(S.String) }) {}
export class SpeechModelConfig extends S.Class<SpeechModelConfig>(
  "SpeechModelConfig",
)({ deepgramConfig: S.optional(DeepgramSpeechModelConfig) }) {}
export class SpeechRecognitionSettings extends S.Class<SpeechRecognitionSettings>(
  "SpeechRecognitionSettings",
)({
  speechModelPreference: S.optional(S.String),
  speechModelConfig: S.optional(SpeechModelConfig),
}) {}
export class BedrockGuardrailConfiguration extends S.Class<BedrockGuardrailConfiguration>(
  "BedrockGuardrailConfiguration",
)({ identifier: S.String, version: S.String }) {}
export class BedrockModelSpecification extends S.Class<BedrockModelSpecification>(
  "BedrockModelSpecification",
)({
  modelArn: S.String,
  guardrail: S.optional(BedrockGuardrailConfiguration),
  traceStatus: S.optional(S.String),
  customPrompt: S.optional(S.String),
}) {}
export class SlotResolutionImprovementSpecification extends S.Class<SlotResolutionImprovementSpecification>(
  "SlotResolutionImprovementSpecification",
)({
  enabled: S.Boolean,
  bedrockModelSpecification: S.optional(BedrockModelSpecification),
}) {}
export class IntentDisambiguationSettings extends S.Class<IntentDisambiguationSettings>(
  "IntentDisambiguationSettings",
)({
  enabled: S.Boolean,
  maxDisambiguationIntents: S.optional(S.Number),
  customDisambiguationMessage: S.optional(S.String),
}) {}
export class NluImprovementSpecification extends S.Class<NluImprovementSpecification>(
  "NluImprovementSpecification",
)({
  enabled: S.Boolean,
  assistedNluMode: S.optional(S.String),
  intentDisambiguationSettings: S.optional(IntentDisambiguationSettings),
}) {}
export class RuntimeSettings extends S.Class<RuntimeSettings>(
  "RuntimeSettings",
)({
  slotResolutionImprovement: S.optional(SlotResolutionImprovementSpecification),
  nluImprovement: S.optional(NluImprovementSpecification),
}) {}
export class DescriptiveBotBuilderSpecification extends S.Class<DescriptiveBotBuilderSpecification>(
  "DescriptiveBotBuilderSpecification",
)({
  enabled: S.Boolean,
  bedrockModelSpecification: S.optional(BedrockModelSpecification),
}) {}
export class SampleUtteranceGenerationSpecification extends S.Class<SampleUtteranceGenerationSpecification>(
  "SampleUtteranceGenerationSpecification",
)({
  enabled: S.Boolean,
  bedrockModelSpecification: S.optional(BedrockModelSpecification),
}) {}
export class BuildtimeSettings extends S.Class<BuildtimeSettings>(
  "BuildtimeSettings",
)({
  descriptiveBotBuilder: S.optional(DescriptiveBotBuilderSpecification),
  sampleUtteranceGeneration: S.optional(SampleUtteranceGenerationSpecification),
}) {}
export class GenerativeAISettings extends S.Class<GenerativeAISettings>(
  "GenerativeAISettings",
)({
  runtimeSettings: S.optional(RuntimeSettings),
  buildtimeSettings: S.optional(BuildtimeSettings),
}) {}
export class UpdateBotLocaleRequest extends S.Class<UpdateBotLocaleRequest>(
  "UpdateBotLocaleRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    description: S.optional(S.String),
    nluIntentConfidenceThreshold: S.Number,
    voiceSettings: S.optional(VoiceSettings),
    unifiedSpeechSettings: S.optional(UnifiedSpeechSettings),
    speechRecognitionSettings: S.optional(SpeechRecognitionSettings),
    generativeAISettings: S.optional(GenerativeAISettings),
    speechDetectionSensitivity: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EncryptionSetting extends S.Class<EncryptionSetting>(
  "EncryptionSetting",
)({
  kmsKeyArn: S.optional(S.String),
  botLocaleExportPassword: S.optional(S.String),
  associatedTranscriptsPassword: S.optional(S.String),
}) {}
export class UpdateBotRecommendationRequest extends S.Class<UpdateBotRecommendationRequest>(
  "UpdateBotRecommendationRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    botRecommendationId: S.String.pipe(T.HttpLabel()),
    encryptionSetting: EncryptionSetting,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/botrecommendations/{botRecommendationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateExportRequest extends S.Class<UpdateExportRequest>(
  "UpdateExportRequest",
)(
  {
    exportId: S.String.pipe(T.HttpLabel()),
    filePassword: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/exports/{exportId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateResourcePolicyRequest extends S.Class<UpdateResourcePolicyRequest>(
  "UpdateResourcePolicyRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel()),
    policy: S.String,
    expectedRevisionId: S.optional(S.String).pipe(
      T.HttpQuery("expectedRevisionId"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/policy/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SlotDefaultValue extends S.Class<SlotDefaultValue>(
  "SlotDefaultValue",
)({ defaultValue: S.String }) {}
export const SlotDefaultValueList = S.Array(SlotDefaultValue);
export class SlotDefaultValueSpecification extends S.Class<SlotDefaultValueSpecification>(
  "SlotDefaultValueSpecification",
)({ defaultValueList: SlotDefaultValueList }) {}
export class PlainTextMessage extends S.Class<PlainTextMessage>(
  "PlainTextMessage",
)({ value: S.String }) {}
export class CustomPayload extends S.Class<CustomPayload>("CustomPayload")({
  value: S.String,
}) {}
export class SSMLMessage extends S.Class<SSMLMessage>("SSMLMessage")({
  value: S.String,
}) {}
export class Button extends S.Class<Button>("Button")({
  text: S.String,
  value: S.String,
}) {}
export const ButtonsList = S.Array(Button);
export class ImageResponseCard extends S.Class<ImageResponseCard>(
  "ImageResponseCard",
)({
  title: S.String,
  subtitle: S.optional(S.String),
  imageUrl: S.optional(S.String),
  buttons: S.optional(ButtonsList),
}) {}
export class Message extends S.Class<Message>("Message")({
  plainTextMessage: S.optional(PlainTextMessage),
  customPayload: S.optional(CustomPayload),
  ssmlMessage: S.optional(SSMLMessage),
  imageResponseCard: S.optional(ImageResponseCard),
}) {}
export const MessageVariationsList = S.Array(Message);
export class MessageGroup extends S.Class<MessageGroup>("MessageGroup")({
  message: Message,
  variations: S.optional(MessageVariationsList),
}) {}
export const MessageGroupsList = S.Array(MessageGroup);
export class AllowedInputTypes extends S.Class<AllowedInputTypes>(
  "AllowedInputTypes",
)({ allowAudioInput: S.Boolean, allowDTMFInput: S.Boolean }) {}
export class AudioSpecification extends S.Class<AudioSpecification>(
  "AudioSpecification",
)({ maxLengthMs: S.Number, endTimeoutMs: S.Number }) {}
export class DTMFSpecification extends S.Class<DTMFSpecification>(
  "DTMFSpecification",
)({
  maxLength: S.Number,
  endTimeoutMs: S.Number,
  deletionCharacter: S.String,
  endCharacter: S.String,
}) {}
export class AudioAndDTMFInputSpecification extends S.Class<AudioAndDTMFInputSpecification>(
  "AudioAndDTMFInputSpecification",
)({
  startTimeoutMs: S.Number,
  audioSpecification: S.optional(AudioSpecification),
  dtmfSpecification: S.optional(DTMFSpecification),
}) {}
export class TextInputSpecification extends S.Class<TextInputSpecification>(
  "TextInputSpecification",
)({ startTimeoutMs: S.Number }) {}
export class PromptAttemptSpecification extends S.Class<PromptAttemptSpecification>(
  "PromptAttemptSpecification",
)({
  allowInterrupt: S.optional(S.Boolean),
  allowedInputTypes: AllowedInputTypes,
  audioAndDTMFInputSpecification: S.optional(AudioAndDTMFInputSpecification),
  textInputSpecification: S.optional(TextInputSpecification),
}) {}
export const PromptAttemptsSpecificationMap = S.Record({
  key: S.String,
  value: PromptAttemptSpecification,
});
export class PromptSpecification extends S.Class<PromptSpecification>(
  "PromptSpecification",
)({
  messageGroups: MessageGroupsList,
  maxRetries: S.Number,
  allowInterrupt: S.optional(S.Boolean),
  messageSelectionStrategy: S.optional(S.String),
  promptAttemptsSpecification: S.optional(PromptAttemptsSpecificationMap),
}) {}
export class SampleUtterance extends S.Class<SampleUtterance>(
  "SampleUtterance",
)({ utterance: S.String }) {}
export const SampleUtterancesList = S.Array(SampleUtterance);
export class ResponseSpecification extends S.Class<ResponseSpecification>(
  "ResponseSpecification",
)({
  messageGroups: MessageGroupsList,
  allowInterrupt: S.optional(S.Boolean),
}) {}
export class StillWaitingResponseSpecification extends S.Class<StillWaitingResponseSpecification>(
  "StillWaitingResponseSpecification",
)({
  messageGroups: MessageGroupsList,
  frequencyInSeconds: S.Number,
  timeoutInSeconds: S.Number,
  allowInterrupt: S.optional(S.Boolean),
}) {}
export class WaitAndContinueSpecification extends S.Class<WaitAndContinueSpecification>(
  "WaitAndContinueSpecification",
)({
  waitingResponse: ResponseSpecification,
  continueResponse: ResponseSpecification,
  stillWaitingResponse: S.optional(StillWaitingResponseSpecification),
  active: S.optional(S.Boolean),
}) {}
export class DialogAction extends S.Class<DialogAction>("DialogAction")({
  type: S.String,
  slotToElicit: S.optional(S.String),
  suppressNextMessage: S.optional(S.Boolean),
}) {}
export class SlotValue extends S.Class<SlotValue>("SlotValue")({
  interpretedValue: S.optional(S.String),
}) {}
export class SlotValueOverride extends S.Class<SlotValueOverride>(
  "SlotValueOverride",
)({
  shape: S.optional(S.String),
  value: S.optional(SlotValue),
  values: S.optional(S.suspend(() => SlotValues)),
}) {}
export const SlotValueOverrideMap = S.Record({
  key: S.String,
  value: S.suspend((): S.Schema<SlotValueOverride, any> => SlotValueOverride),
});
export class IntentOverride extends S.Class<IntentOverride>("IntentOverride")({
  name: S.optional(S.String),
  slots: S.optional(SlotValueOverrideMap),
}) {}
export const StringMap = S.Record({ key: S.String, value: S.String });
export class DialogState extends S.Class<DialogState>("DialogState")({
  dialogAction: S.optional(DialogAction),
  intent: S.optional(IntentOverride),
  sessionAttributes: S.optional(StringMap),
}) {}
export class Condition extends S.Class<Condition>("Condition")({
  expressionString: S.String,
}) {}
export class ConditionalBranch extends S.Class<ConditionalBranch>(
  "ConditionalBranch",
)({
  name: S.String,
  condition: Condition,
  nextStep: DialogState,
  response: S.optional(ResponseSpecification),
}) {}
export const ConditionalBranches = S.Array(ConditionalBranch);
export class DefaultConditionalBranch extends S.Class<DefaultConditionalBranch>(
  "DefaultConditionalBranch",
)({
  nextStep: S.optional(DialogState),
  response: S.optional(ResponseSpecification),
}) {}
export class ConditionalSpecification extends S.Class<ConditionalSpecification>(
  "ConditionalSpecification",
)({
  active: S.Boolean,
  conditionalBranches: ConditionalBranches,
  defaultBranch: DefaultConditionalBranch,
}) {}
export class PostDialogCodeHookInvocationSpecification extends S.Class<PostDialogCodeHookInvocationSpecification>(
  "PostDialogCodeHookInvocationSpecification",
)({
  successResponse: S.optional(ResponseSpecification),
  successNextStep: S.optional(DialogState),
  successConditional: S.optional(ConditionalSpecification),
  failureResponse: S.optional(ResponseSpecification),
  failureNextStep: S.optional(DialogState),
  failureConditional: S.optional(ConditionalSpecification),
  timeoutResponse: S.optional(ResponseSpecification),
  timeoutNextStep: S.optional(DialogState),
  timeoutConditional: S.optional(ConditionalSpecification),
}) {}
export class DialogCodeHookInvocationSetting extends S.Class<DialogCodeHookInvocationSetting>(
  "DialogCodeHookInvocationSetting",
)({
  enableCodeHookInvocation: S.Boolean,
  active: S.Boolean,
  invocationLabel: S.optional(S.String),
  postCodeHookSpecification: PostDialogCodeHookInvocationSpecification,
}) {}
export class ElicitationCodeHookInvocationSetting extends S.Class<ElicitationCodeHookInvocationSetting>(
  "ElicitationCodeHookInvocationSetting",
)({
  enableCodeHookInvocation: S.Boolean,
  invocationLabel: S.optional(S.String),
}) {}
export class SlotCaptureSetting extends S.Class<SlotCaptureSetting>(
  "SlotCaptureSetting",
)({
  captureResponse: S.optional(ResponseSpecification),
  captureNextStep: S.optional(DialogState),
  captureConditional: S.optional(ConditionalSpecification),
  failureResponse: S.optional(ResponseSpecification),
  failureNextStep: S.optional(DialogState),
  failureConditional: S.optional(ConditionalSpecification),
  codeHook: S.optional(DialogCodeHookInvocationSetting),
  elicitationCodeHook: S.optional(ElicitationCodeHookInvocationSetting),
}) {}
export class SlotResolutionSetting extends S.Class<SlotResolutionSetting>(
  "SlotResolutionSetting",
)({ slotResolutionStrategy: S.String }) {}
export class SlotValueElicitationSetting extends S.Class<SlotValueElicitationSetting>(
  "SlotValueElicitationSetting",
)({
  defaultValueSpecification: S.optional(SlotDefaultValueSpecification),
  slotConstraint: S.String,
  promptSpecification: S.optional(PromptSpecification),
  sampleUtterances: S.optional(SampleUtterancesList),
  waitAndContinueSpecification: S.optional(WaitAndContinueSpecification),
  slotCaptureSetting: S.optional(SlotCaptureSetting),
  slotResolutionSetting: S.optional(SlotResolutionSetting),
}) {}
export class ObfuscationSetting extends S.Class<ObfuscationSetting>(
  "ObfuscationSetting",
)({ obfuscationSettingType: S.String }) {}
export class MultipleValuesSetting extends S.Class<MultipleValuesSetting>(
  "MultipleValuesSetting",
)({ allowMultipleValues: S.optional(S.Boolean) }) {}
export class SubSlotValueElicitationSetting extends S.Class<SubSlotValueElicitationSetting>(
  "SubSlotValueElicitationSetting",
)({
  defaultValueSpecification: S.optional(SlotDefaultValueSpecification),
  promptSpecification: PromptSpecification,
  sampleUtterances: S.optional(SampleUtterancesList),
  waitAndContinueSpecification: S.optional(WaitAndContinueSpecification),
}) {}
export class Specifications extends S.Class<Specifications>("Specifications")({
  slotTypeId: S.String,
  valueElicitationSetting: SubSlotValueElicitationSetting,
}) {}
export const SubSlotSpecificationMap = S.Record({
  key: S.String,
  value: Specifications,
});
export class SubSlotSetting extends S.Class<SubSlotSetting>("SubSlotSetting")({
  expression: S.optional(S.String),
  slotSpecifications: S.optional(SubSlotSpecificationMap),
}) {}
export class UpdateSlotRequest extends S.Class<UpdateSlotRequest>(
  "UpdateSlotRequest",
)(
  {
    slotId: S.String.pipe(T.HttpLabel()),
    slotName: S.String,
    description: S.optional(S.String),
    slotTypeId: S.optional(S.String),
    valueElicitationSetting: SlotValueElicitationSetting,
    obfuscationSetting: S.optional(ObfuscationSetting),
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    intentId: S.String.pipe(T.HttpLabel()),
    multipleValuesSetting: S.optional(MultipleValuesSetting),
    subSlotSetting: S.optional(SubSlotSetting),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents/{intentId}/slots/{slotId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SampleValue extends S.Class<SampleValue>("SampleValue")({
  value: S.String,
}) {}
export const SynonymList = S.Array(SampleValue);
export class SlotTypeValue extends S.Class<SlotTypeValue>("SlotTypeValue")({
  sampleValue: S.optional(SampleValue),
  synonyms: S.optional(SynonymList),
}) {}
export const SlotTypeValues = S.Array(SlotTypeValue);
export class SlotValueRegexFilter extends S.Class<SlotValueRegexFilter>(
  "SlotValueRegexFilter",
)({ pattern: S.String }) {}
export class AdvancedRecognitionSetting extends S.Class<AdvancedRecognitionSetting>(
  "AdvancedRecognitionSetting",
)({ audioRecognitionStrategy: S.optional(S.String) }) {}
export class SlotValueSelectionSetting extends S.Class<SlotValueSelectionSetting>(
  "SlotValueSelectionSetting",
)({
  resolutionStrategy: S.String,
  regexFilter: S.optional(SlotValueRegexFilter),
  advancedRecognitionSetting: S.optional(AdvancedRecognitionSetting),
}) {}
export class GrammarSlotTypeSource extends S.Class<GrammarSlotTypeSource>(
  "GrammarSlotTypeSource",
)({
  s3BucketName: S.String,
  s3ObjectKey: S.String,
  kmsKeyArn: S.optional(S.String),
}) {}
export class GrammarSlotTypeSetting extends S.Class<GrammarSlotTypeSetting>(
  "GrammarSlotTypeSetting",
)({ source: S.optional(GrammarSlotTypeSource) }) {}
export class ExternalSourceSetting extends S.Class<ExternalSourceSetting>(
  "ExternalSourceSetting",
)({ grammarSlotTypeSetting: S.optional(GrammarSlotTypeSetting) }) {}
export class SubSlotTypeComposition extends S.Class<SubSlotTypeComposition>(
  "SubSlotTypeComposition",
)({ name: S.String, slotTypeId: S.String }) {}
export const SubSlotTypeList = S.Array(SubSlotTypeComposition);
export class CompositeSlotTypeSetting extends S.Class<CompositeSlotTypeSetting>(
  "CompositeSlotTypeSetting",
)({ subSlots: S.optional(SubSlotTypeList) }) {}
export class UpdateSlotTypeRequest extends S.Class<UpdateSlotTypeRequest>(
  "UpdateSlotTypeRequest",
)(
  {
    slotTypeId: S.String.pipe(T.HttpLabel()),
    slotTypeName: S.String,
    description: S.optional(S.String),
    slotTypeValues: S.optional(SlotTypeValues),
    valueSelectionSetting: S.optional(SlotValueSelectionSetting),
    parentSlotTypeSignature: S.optional(S.String),
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    externalSourceSetting: S.optional(ExternalSourceSetting),
    compositeSlotTypeSetting: S.optional(CompositeSlotTypeSetting),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/slottypes/{slotTypeId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTestSetRequest extends S.Class<UpdateTestSetRequest>(
  "UpdateTestSetRequest",
)(
  {
    testSetId: S.String.pipe(T.HttpLabel()),
    testSetName: S.String,
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/testsets/{testSetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const FilterValues = S.Array(S.String);
export const AnalyticsFilterValues = S.Array(S.String);
export class NewCustomVocabularyItem extends S.Class<NewCustomVocabularyItem>(
  "NewCustomVocabularyItem",
)({
  phrase: S.String,
  weight: S.optional(S.Number),
  displayAs: S.optional(S.String),
}) {}
export const CreateCustomVocabularyItemsList = S.Array(NewCustomVocabularyItem);
export class CustomVocabularyEntryId extends S.Class<CustomVocabularyEntryId>(
  "CustomVocabularyEntryId",
)({ itemId: S.String }) {}
export const DeleteCustomVocabularyItemsList = S.Array(CustomVocabularyEntryId);
export class CustomVocabularyItem extends S.Class<CustomVocabularyItem>(
  "CustomVocabularyItem",
)({
  itemId: S.String,
  phrase: S.String,
  weight: S.optional(S.Number),
  displayAs: S.optional(S.String),
}) {}
export const UpdateCustomVocabularyItemsList = S.Array(CustomVocabularyItem);
export class DialogCodeHookSettings extends S.Class<DialogCodeHookSettings>(
  "DialogCodeHookSettings",
)({ enabled: S.Boolean }) {}
export class IntentClosingSetting extends S.Class<IntentClosingSetting>(
  "IntentClosingSetting",
)({
  closingResponse: S.optional(ResponseSpecification),
  active: S.optional(S.Boolean),
  nextStep: S.optional(DialogState),
  conditional: S.optional(ConditionalSpecification),
}) {}
export class InputContext extends S.Class<InputContext>("InputContext")({
  name: S.String,
}) {}
export const InputContextsList = S.Array(InputContext);
export class OutputContext extends S.Class<OutputContext>("OutputContext")({
  name: S.String,
  timeToLiveInSeconds: S.Number,
  turnsToLive: S.Number,
}) {}
export const OutputContextsList = S.Array(OutputContext);
export class KendraConfiguration extends S.Class<KendraConfiguration>(
  "KendraConfiguration",
)({
  kendraIndex: S.String,
  queryFilterStringEnabled: S.optional(S.Boolean),
  queryFilterString: S.optional(S.String),
}) {}
export class InitialResponseSetting extends S.Class<InitialResponseSetting>(
  "InitialResponseSetting",
)({
  initialResponse: S.optional(ResponseSpecification),
  nextStep: S.optional(DialogState),
  conditional: S.optional(ConditionalSpecification),
  codeHook: S.optional(DialogCodeHookInvocationSetting),
}) {}
export class Principal extends S.Class<Principal>("Principal")({
  service: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const PrincipalList = S.Array(Principal);
export const FailureReasons = S.Array(S.String);
export const RecommendedActions = S.Array(S.String);
export class AggregatedUtterancesSortBy extends S.Class<AggregatedUtterancesSortBy>(
  "AggregatedUtterancesSortBy",
)({ attribute: S.String, order: S.String }) {}
export class AggregatedUtterancesFilter extends S.Class<AggregatedUtterancesFilter>(
  "AggregatedUtterancesFilter",
)({ name: S.String, values: FilterValues, operator: S.String }) {}
export const AggregatedUtterancesFilters = S.Array(AggregatedUtterancesFilter);
export class BotLocaleSortBy extends S.Class<BotLocaleSortBy>(
  "BotLocaleSortBy",
)({ attribute: S.String, order: S.String }) {}
export class BotLocaleFilter extends S.Class<BotLocaleFilter>(
  "BotLocaleFilter",
)({ name: S.String, values: FilterValues, operator: S.String }) {}
export const BotLocaleFilters = S.Array(BotLocaleFilter);
export class GenerationSortBy extends S.Class<GenerationSortBy>(
  "GenerationSortBy",
)({ attribute: S.String, order: S.String }) {}
export class BotSortBy extends S.Class<BotSortBy>("BotSortBy")({
  attribute: S.String,
  order: S.String,
}) {}
export class BotFilter extends S.Class<BotFilter>("BotFilter")({
  name: S.String,
  values: FilterValues,
  operator: S.String,
}) {}
export const BotFilters = S.Array(BotFilter);
export class BotVersionReplicaSortBy extends S.Class<BotVersionReplicaSortBy>(
  "BotVersionReplicaSortBy",
)({ attribute: S.String, order: S.String }) {}
export class BotVersionSortBy extends S.Class<BotVersionSortBy>(
  "BotVersionSortBy",
)({ attribute: S.String, order: S.String }) {}
export class BuiltInIntentSortBy extends S.Class<BuiltInIntentSortBy>(
  "BuiltInIntentSortBy",
)({ attribute: S.String, order: S.String }) {}
export class BuiltInSlotTypeSortBy extends S.Class<BuiltInSlotTypeSortBy>(
  "BuiltInSlotTypeSortBy",
)({ attribute: S.String, order: S.String }) {}
export const CustomVocabularyItems = S.Array(CustomVocabularyItem);
export class ExportSortBy extends S.Class<ExportSortBy>("ExportSortBy")({
  attribute: S.String,
  order: S.String,
}) {}
export class ExportFilter extends S.Class<ExportFilter>("ExportFilter")({
  name: S.String,
  values: FilterValues,
  operator: S.String,
}) {}
export const ExportFilters = S.Array(ExportFilter);
export class ImportSortBy extends S.Class<ImportSortBy>("ImportSortBy")({
  attribute: S.String,
  order: S.String,
}) {}
export class ImportFilter extends S.Class<ImportFilter>("ImportFilter")({
  name: S.String,
  values: FilterValues,
  operator: S.String,
}) {}
export const ImportFilters = S.Array(ImportFilter);
export class AnalyticsIntentMetric extends S.Class<AnalyticsIntentMetric>(
  "AnalyticsIntentMetric",
)({ name: S.String, statistic: S.String, order: S.optional(S.String) }) {}
export const AnalyticsIntentMetrics = S.Array(AnalyticsIntentMetric);
export class AnalyticsBinBySpecification extends S.Class<AnalyticsBinBySpecification>(
  "AnalyticsBinBySpecification",
)({ name: S.String, interval: S.String, order: S.optional(S.String) }) {}
export const AnalyticsBinByList = S.Array(AnalyticsBinBySpecification);
export class AnalyticsIntentGroupBySpecification extends S.Class<AnalyticsIntentGroupBySpecification>(
  "AnalyticsIntentGroupBySpecification",
)({ name: S.String }) {}
export const AnalyticsIntentGroupByList = S.Array(
  AnalyticsIntentGroupBySpecification,
);
export class AnalyticsIntentFilter extends S.Class<AnalyticsIntentFilter>(
  "AnalyticsIntentFilter",
)({ name: S.String, operator: S.String, values: AnalyticsFilterValues }) {}
export const AnalyticsIntentFilters = S.Array(AnalyticsIntentFilter);
export class AnalyticsPathFilter extends S.Class<AnalyticsPathFilter>(
  "AnalyticsPathFilter",
)({ name: S.String, operator: S.String, values: AnalyticsFilterValues }) {}
export const AnalyticsPathFilters = S.Array(AnalyticsPathFilter);
export class IntentSortBy extends S.Class<IntentSortBy>("IntentSortBy")({
  attribute: S.String,
  order: S.String,
}) {}
export class IntentFilter extends S.Class<IntentFilter>("IntentFilter")({
  name: S.String,
  values: FilterValues,
  operator: S.String,
}) {}
export const IntentFilters = S.Array(IntentFilter);
export class AnalyticsIntentStageMetric extends S.Class<AnalyticsIntentStageMetric>(
  "AnalyticsIntentStageMetric",
)({ name: S.String, statistic: S.String, order: S.optional(S.String) }) {}
export const AnalyticsIntentStageMetrics = S.Array(AnalyticsIntentStageMetric);
export class AnalyticsIntentStageGroupBySpecification extends S.Class<AnalyticsIntentStageGroupBySpecification>(
  "AnalyticsIntentStageGroupBySpecification",
)({ name: S.String }) {}
export const AnalyticsIntentStageGroupByList = S.Array(
  AnalyticsIntentStageGroupBySpecification,
);
export class AnalyticsIntentStageFilter extends S.Class<AnalyticsIntentStageFilter>(
  "AnalyticsIntentStageFilter",
)({ name: S.String, operator: S.String, values: AnalyticsFilterValues }) {}
export const AnalyticsIntentStageFilters = S.Array(AnalyticsIntentStageFilter);
export class SessionDataSortBy extends S.Class<SessionDataSortBy>(
  "SessionDataSortBy",
)({ name: S.String, order: S.String }) {}
export class AnalyticsSessionFilter extends S.Class<AnalyticsSessionFilter>(
  "AnalyticsSessionFilter",
)({ name: S.String, operator: S.String, values: AnalyticsFilterValues }) {}
export const AnalyticsSessionFilters = S.Array(AnalyticsSessionFilter);
export class AnalyticsSessionMetric extends S.Class<AnalyticsSessionMetric>(
  "AnalyticsSessionMetric",
)({ name: S.String, statistic: S.String, order: S.optional(S.String) }) {}
export const AnalyticsSessionMetrics = S.Array(AnalyticsSessionMetric);
export class AnalyticsSessionGroupBySpecification extends S.Class<AnalyticsSessionGroupBySpecification>(
  "AnalyticsSessionGroupBySpecification",
)({ name: S.String }) {}
export const AnalyticsSessionGroupByList = S.Array(
  AnalyticsSessionGroupBySpecification,
);
export class SlotSortBy extends S.Class<SlotSortBy>("SlotSortBy")({
  attribute: S.String,
  order: S.String,
}) {}
export class SlotFilter extends S.Class<SlotFilter>("SlotFilter")({
  name: S.String,
  values: FilterValues,
  operator: S.String,
}) {}
export const SlotFilters = S.Array(SlotFilter);
export class SlotTypeSortBy extends S.Class<SlotTypeSortBy>("SlotTypeSortBy")({
  attribute: S.String,
  order: S.String,
}) {}
export class SlotTypeFilter extends S.Class<SlotTypeFilter>("SlotTypeFilter")({
  name: S.String,
  values: FilterValues,
  operator: S.String,
}) {}
export const SlotTypeFilters = S.Array(SlotTypeFilter);
export class TestExecutionSortBy extends S.Class<TestExecutionSortBy>(
  "TestExecutionSortBy",
)({ attribute: S.String, order: S.String }) {}
export class TestSetSortBy extends S.Class<TestSetSortBy>("TestSetSortBy")({
  attribute: S.String,
  order: S.String,
}) {}
export class UtteranceDataSortBy extends S.Class<UtteranceDataSortBy>(
  "UtteranceDataSortBy",
)({ name: S.String, order: S.String }) {}
export class AnalyticsUtteranceFilter extends S.Class<AnalyticsUtteranceFilter>(
  "AnalyticsUtteranceFilter",
)({ name: S.String, operator: S.String, values: AnalyticsFilterValues }) {}
export const AnalyticsUtteranceFilters = S.Array(AnalyticsUtteranceFilter);
export class AnalyticsUtteranceMetric extends S.Class<AnalyticsUtteranceMetric>(
  "AnalyticsUtteranceMetric",
)({ name: S.String, statistic: S.String, order: S.optional(S.String) }) {}
export const AnalyticsUtteranceMetrics = S.Array(AnalyticsUtteranceMetric);
export class AnalyticsUtteranceGroupBySpecification extends S.Class<AnalyticsUtteranceGroupBySpecification>(
  "AnalyticsUtteranceGroupBySpecification",
)({ name: S.String }) {}
export const AnalyticsUtteranceGroupByList = S.Array(
  AnalyticsUtteranceGroupBySpecification,
);
export class AnalyticsUtteranceAttribute extends S.Class<AnalyticsUtteranceAttribute>(
  "AnalyticsUtteranceAttribute",
)({ name: S.String }) {}
export const AnalyticsUtteranceAttributes = S.Array(
  AnalyticsUtteranceAttribute,
);
export class AssociatedTranscriptFilter extends S.Class<AssociatedTranscriptFilter>(
  "AssociatedTranscriptFilter",
)({ name: S.String, values: FilterValues }) {}
export const AssociatedTranscriptFilters = S.Array(AssociatedTranscriptFilter);
export class TestSetStorageLocation extends S.Class<TestSetStorageLocation>(
  "TestSetStorageLocation",
)({
  s3BucketName: S.String,
  s3Path: S.String,
  kmsKeyArn: S.optional(S.String),
}) {}
export class SlotPriority extends S.Class<SlotPriority>("SlotPriority")({
  priority: S.Number,
  slotId: S.String,
}) {}
export const SlotPrioritiesList = S.Array(SlotPriority);
export class BatchCreateCustomVocabularyItemRequest extends S.Class<BatchCreateCustomVocabularyItemRequest>(
  "BatchCreateCustomVocabularyItemRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    customVocabularyItemList: CreateCustomVocabularyItemsList,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/customvocabulary/DEFAULT/batchcreate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDeleteCustomVocabularyItemRequest extends S.Class<BatchDeleteCustomVocabularyItemRequest>(
  "BatchDeleteCustomVocabularyItemRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    customVocabularyItemList: DeleteCustomVocabularyItemsList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/customvocabulary/DEFAULT/batchdelete",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchUpdateCustomVocabularyItemRequest extends S.Class<BatchUpdateCustomVocabularyItemRequest>(
  "BatchUpdateCustomVocabularyItemRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    customVocabularyItemList: UpdateCustomVocabularyItemsList,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/customvocabulary/DEFAULT/batchupdate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BuildBotLocaleResponse extends S.Class<BuildBotLocaleResponse>(
  "BuildBotLocaleResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  botLocaleStatus: S.optional(S.String),
  lastBuildSubmittedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class CreateBotRequest extends S.Class<CreateBotRequest>(
  "CreateBotRequest",
)(
  {
    botName: S.String,
    description: S.optional(S.String),
    roleArn: S.String,
    dataPrivacy: DataPrivacy,
    idleSessionTTLInSeconds: S.Number,
    botTags: S.optional(TagMap),
    testBotAliasTags: S.optional(TagMap),
    botType: S.optional(S.String),
    botMembers: S.optional(BotMembers),
    errorLogSettings: S.optional(ErrorLogSettings),
  },
  T.all(T.Http({ method: "PUT", uri: "/bots" }), svc, auth, proto, ver, rules),
) {}
export class CreateBotReplicaResponse extends S.Class<CreateBotReplicaResponse>(
  "CreateBotReplicaResponse",
)({
  botId: S.optional(S.String),
  replicaRegion: S.optional(S.String),
  sourceRegion: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  botReplicaStatus: S.optional(S.String),
}) {}
export class CreateResourcePolicyResponse extends S.Class<CreateResourcePolicyResponse>(
  "CreateResourcePolicyResponse",
)({ resourceArn: S.optional(S.String), revisionId: S.optional(S.String) }) {}
export class DeleteBotResponse extends S.Class<DeleteBotResponse>(
  "DeleteBotResponse",
)({ botId: S.optional(S.String), botStatus: S.optional(S.String) }) {}
export class DeleteBotAliasResponse extends S.Class<DeleteBotAliasResponse>(
  "DeleteBotAliasResponse",
)({
  botAliasId: S.optional(S.String),
  botId: S.optional(S.String),
  botAliasStatus: S.optional(S.String),
}) {}
export class DeleteBotLocaleResponse extends S.Class<DeleteBotLocaleResponse>(
  "DeleteBotLocaleResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  botLocaleStatus: S.optional(S.String),
}) {}
export class DeleteBotReplicaResponse extends S.Class<DeleteBotReplicaResponse>(
  "DeleteBotReplicaResponse",
)({
  botId: S.optional(S.String),
  replicaRegion: S.optional(S.String),
  botReplicaStatus: S.optional(S.String),
}) {}
export class DeleteBotVersionResponse extends S.Class<DeleteBotVersionResponse>(
  "DeleteBotVersionResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  botStatus: S.optional(S.String),
}) {}
export class DeleteCustomVocabularyResponse extends S.Class<DeleteCustomVocabularyResponse>(
  "DeleteCustomVocabularyResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  customVocabularyStatus: S.optional(S.String),
}) {}
export class DeleteExportResponse extends S.Class<DeleteExportResponse>(
  "DeleteExportResponse",
)({ exportId: S.optional(S.String), exportStatus: S.optional(S.String) }) {}
export class DeleteImportResponse extends S.Class<DeleteImportResponse>(
  "DeleteImportResponse",
)({ importId: S.optional(S.String), importStatus: S.optional(S.String) }) {}
export class DeleteResourcePolicyResponse extends S.Class<DeleteResourcePolicyResponse>(
  "DeleteResourcePolicyResponse",
)({ resourceArn: S.optional(S.String), revisionId: S.optional(S.String) }) {}
export class DeleteResourcePolicyStatementResponse extends S.Class<DeleteResourcePolicyStatementResponse>(
  "DeleteResourcePolicyStatementResponse",
)({ resourceArn: S.optional(S.String), revisionId: S.optional(S.String) }) {}
export class DescribeBotResponse extends S.Class<DescribeBotResponse>(
  "DescribeBotResponse",
)({
  botId: S.optional(S.String),
  botName: S.optional(S.String),
  description: S.optional(S.String),
  roleArn: S.optional(S.String),
  dataPrivacy: S.optional(DataPrivacy),
  idleSessionTTLInSeconds: S.optional(S.Number),
  botStatus: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  botType: S.optional(S.String),
  botMembers: S.optional(BotMembers),
  failureReasons: S.optional(FailureReasons),
  errorLogSettings: S.optional(ErrorLogSettings),
}) {}
export class DescribeBotReplicaResponse extends S.Class<DescribeBotReplicaResponse>(
  "DescribeBotReplicaResponse",
)({
  botId: S.optional(S.String),
  replicaRegion: S.optional(S.String),
  sourceRegion: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  botReplicaStatus: S.optional(S.String),
  failureReasons: S.optional(FailureReasons),
}) {}
export class DescribeBotResourceGenerationResponse extends S.Class<DescribeBotResourceGenerationResponse>(
  "DescribeBotResourceGenerationResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  generationId: S.optional(S.String),
  failureReasons: S.optional(FailureReasons),
  generationStatus: S.optional(S.String),
  generationInputPrompt: S.optional(S.String),
  generatedBotLocaleUrl: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  modelArn: S.optional(S.String),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class ParentBotNetwork extends S.Class<ParentBotNetwork>(
  "ParentBotNetwork",
)({ botId: S.String, botVersion: S.String }) {}
export const ParentBotNetworks = S.Array(ParentBotNetwork);
export class DescribeBotVersionResponse extends S.Class<DescribeBotVersionResponse>(
  "DescribeBotVersionResponse",
)({
  botId: S.optional(S.String),
  botName: S.optional(S.String),
  botVersion: S.optional(S.String),
  description: S.optional(S.String),
  roleArn: S.optional(S.String),
  dataPrivacy: S.optional(DataPrivacy),
  idleSessionTTLInSeconds: S.optional(S.Number),
  botStatus: S.optional(S.String),
  failureReasons: S.optional(FailureReasons),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  parentBotNetworks: S.optional(ParentBotNetworks),
  botType: S.optional(S.String),
  botMembers: S.optional(BotMembers),
}) {}
export class DescribeCustomVocabularyMetadataResponse extends S.Class<DescribeCustomVocabularyMetadataResponse>(
  "DescribeCustomVocabularyMetadataResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  customVocabularyStatus: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class BotExportSpecification extends S.Class<BotExportSpecification>(
  "BotExportSpecification",
)({ botId: S.String, botVersion: S.String }) {}
export class BotLocaleExportSpecification extends S.Class<BotLocaleExportSpecification>(
  "BotLocaleExportSpecification",
)({ botId: S.String, botVersion: S.String, localeId: S.String }) {}
export class CustomVocabularyExportSpecification extends S.Class<CustomVocabularyExportSpecification>(
  "CustomVocabularyExportSpecification",
)({ botId: S.String, botVersion: S.String, localeId: S.String }) {}
export class TestSetExportSpecification extends S.Class<TestSetExportSpecification>(
  "TestSetExportSpecification",
)({ testSetId: S.String }) {}
export class ExportResourceSpecification extends S.Class<ExportResourceSpecification>(
  "ExportResourceSpecification",
)({
  botExportSpecification: S.optional(BotExportSpecification),
  botLocaleExportSpecification: S.optional(BotLocaleExportSpecification),
  customVocabularyExportSpecification: S.optional(
    CustomVocabularyExportSpecification,
  ),
  testSetExportSpecification: S.optional(TestSetExportSpecification),
}) {}
export class DescribeExportResponse extends S.Class<DescribeExportResponse>(
  "DescribeExportResponse",
)({
  exportId: S.optional(S.String),
  resourceSpecification: S.optional(ExportResourceSpecification),
  fileFormat: S.optional(S.String),
  exportStatus: S.optional(S.String),
  failureReasons: S.optional(FailureReasons),
  downloadUrl: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class BotImportSpecification extends S.Class<BotImportSpecification>(
  "BotImportSpecification",
)({
  botName: S.String,
  roleArn: S.String,
  dataPrivacy: DataPrivacy,
  errorLogSettings: S.optional(ErrorLogSettings),
  idleSessionTTLInSeconds: S.optional(S.Number),
  botTags: S.optional(TagMap),
  testBotAliasTags: S.optional(TagMap),
}) {}
export class BotLocaleImportSpecification extends S.Class<BotLocaleImportSpecification>(
  "BotLocaleImportSpecification",
)({
  botId: S.String,
  botVersion: S.String,
  localeId: S.String,
  nluIntentConfidenceThreshold: S.optional(S.Number),
  voiceSettings: S.optional(VoiceSettings),
  speechRecognitionSettings: S.optional(SpeechRecognitionSettings),
  speechDetectionSensitivity: S.optional(S.String),
  unifiedSpeechSettings: S.optional(UnifiedSpeechSettings),
}) {}
export class CustomVocabularyImportSpecification extends S.Class<CustomVocabularyImportSpecification>(
  "CustomVocabularyImportSpecification",
)({ botId: S.String, botVersion: S.String, localeId: S.String }) {}
export class TestSetImportInputLocation extends S.Class<TestSetImportInputLocation>(
  "TestSetImportInputLocation",
)({ s3BucketName: S.String, s3Path: S.String }) {}
export class TestSetImportResourceSpecification extends S.Class<TestSetImportResourceSpecification>(
  "TestSetImportResourceSpecification",
)({
  testSetName: S.String,
  description: S.optional(S.String),
  roleArn: S.String,
  storageLocation: TestSetStorageLocation,
  importInputLocation: TestSetImportInputLocation,
  modality: S.String,
  testSetTags: S.optional(TagMap),
}) {}
export class ImportResourceSpecification extends S.Class<ImportResourceSpecification>(
  "ImportResourceSpecification",
)({
  botImportSpecification: S.optional(BotImportSpecification),
  botLocaleImportSpecification: S.optional(BotLocaleImportSpecification),
  customVocabularyImportSpecification: S.optional(
    CustomVocabularyImportSpecification,
  ),
  testSetImportResourceSpecification: S.optional(
    TestSetImportResourceSpecification,
  ),
}) {}
export class DescribeImportResponse extends S.Class<DescribeImportResponse>(
  "DescribeImportResponse",
)({
  importId: S.optional(S.String),
  resourceSpecification: S.optional(ImportResourceSpecification),
  importedResourceId: S.optional(S.String),
  importedResourceName: S.optional(S.String),
  mergeStrategy: S.optional(S.String),
  importStatus: S.optional(S.String),
  failureReasons: S.optional(FailureReasons),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class PostFulfillmentStatusSpecification extends S.Class<PostFulfillmentStatusSpecification>(
  "PostFulfillmentStatusSpecification",
)({
  successResponse: S.optional(ResponseSpecification),
  failureResponse: S.optional(ResponseSpecification),
  timeoutResponse: S.optional(ResponseSpecification),
  successNextStep: S.optional(DialogState),
  successConditional: S.optional(ConditionalSpecification),
  failureNextStep: S.optional(DialogState),
  failureConditional: S.optional(ConditionalSpecification),
  timeoutNextStep: S.optional(DialogState),
  timeoutConditional: S.optional(ConditionalSpecification),
}) {}
export class FulfillmentStartResponseSpecification extends S.Class<FulfillmentStartResponseSpecification>(
  "FulfillmentStartResponseSpecification",
)({
  delayInSeconds: S.Number,
  messageGroups: MessageGroupsList,
  allowInterrupt: S.optional(S.Boolean),
}) {}
export class FulfillmentUpdateResponseSpecification extends S.Class<FulfillmentUpdateResponseSpecification>(
  "FulfillmentUpdateResponseSpecification",
)({
  frequencyInSeconds: S.Number,
  messageGroups: MessageGroupsList,
  allowInterrupt: S.optional(S.Boolean),
}) {}
export class FulfillmentUpdatesSpecification extends S.Class<FulfillmentUpdatesSpecification>(
  "FulfillmentUpdatesSpecification",
)({
  active: S.Boolean,
  startResponse: S.optional(FulfillmentStartResponseSpecification),
  updateResponse: S.optional(FulfillmentUpdateResponseSpecification),
  timeoutInSeconds: S.optional(S.Number),
}) {}
export class FulfillmentCodeHookSettings extends S.Class<FulfillmentCodeHookSettings>(
  "FulfillmentCodeHookSettings",
)({
  enabled: S.Boolean,
  postFulfillmentStatusSpecification: S.optional(
    PostFulfillmentStatusSpecification,
  ),
  fulfillmentUpdatesSpecification: S.optional(FulfillmentUpdatesSpecification),
  active: S.optional(S.Boolean),
}) {}
export class IntentConfirmationSetting extends S.Class<IntentConfirmationSetting>(
  "IntentConfirmationSetting",
)({
  promptSpecification: PromptSpecification,
  declinationResponse: S.optional(ResponseSpecification),
  active: S.optional(S.Boolean),
  confirmationResponse: S.optional(ResponseSpecification),
  confirmationNextStep: S.optional(DialogState),
  confirmationConditional: S.optional(ConditionalSpecification),
  declinationNextStep: S.optional(DialogState),
  declinationConditional: S.optional(ConditionalSpecification),
  failureResponse: S.optional(ResponseSpecification),
  failureNextStep: S.optional(DialogState),
  failureConditional: S.optional(ConditionalSpecification),
  codeHook: S.optional(DialogCodeHookInvocationSetting),
  elicitationCodeHook: S.optional(ElicitationCodeHookInvocationSetting),
}) {}
export class ExactResponseFields extends S.Class<ExactResponseFields>(
  "ExactResponseFields",
)({ questionField: S.String, answerField: S.String }) {}
export const OSIncludeFields = S.Array(S.String);
export class OpensearchConfiguration extends S.Class<OpensearchConfiguration>(
  "OpensearchConfiguration",
)({
  domainEndpoint: S.String,
  indexName: S.String,
  exactResponse: S.optional(S.Boolean),
  exactResponseFields: S.optional(ExactResponseFields),
  includeFields: S.optional(OSIncludeFields),
}) {}
export class QnAKendraConfiguration extends S.Class<QnAKendraConfiguration>(
  "QnAKendraConfiguration",
)({
  kendraIndex: S.String,
  queryFilterStringEnabled: S.optional(S.Boolean),
  queryFilterString: S.optional(S.String),
  exactResponse: S.optional(S.Boolean),
}) {}
export class BedrockKnowledgeStoreExactResponseFields extends S.Class<BedrockKnowledgeStoreExactResponseFields>(
  "BedrockKnowledgeStoreExactResponseFields",
)({ answerField: S.optional(S.String) }) {}
export class BedrockKnowledgeStoreConfiguration extends S.Class<BedrockKnowledgeStoreConfiguration>(
  "BedrockKnowledgeStoreConfiguration",
)({
  bedrockKnowledgeBaseArn: S.String,
  exactResponse: S.optional(S.Boolean),
  exactResponseFields: S.optional(BedrockKnowledgeStoreExactResponseFields),
}) {}
export class DataSourceConfiguration extends S.Class<DataSourceConfiguration>(
  "DataSourceConfiguration",
)({
  opensearchConfiguration: S.optional(OpensearchConfiguration),
  kendraConfiguration: S.optional(QnAKendraConfiguration),
  bedrockKnowledgeStoreConfiguration: S.optional(
    BedrockKnowledgeStoreConfiguration,
  ),
}) {}
export class QnAIntentConfiguration extends S.Class<QnAIntentConfiguration>(
  "QnAIntentConfiguration",
)({
  dataSourceConfiguration: S.optional(DataSourceConfiguration),
  bedrockModelConfiguration: S.optional(BedrockModelSpecification),
}) {}
export class QInConnectAssistantConfiguration extends S.Class<QInConnectAssistantConfiguration>(
  "QInConnectAssistantConfiguration",
)({ assistantArn: S.String }) {}
export class QInConnectIntentConfiguration extends S.Class<QInConnectIntentConfiguration>(
  "QInConnectIntentConfiguration",
)({
  qInConnectAssistantConfiguration: S.optional(
    QInConnectAssistantConfiguration,
  ),
}) {}
export class DescribeIntentResponse extends S.Class<DescribeIntentResponse>(
  "DescribeIntentResponse",
)({
  intentId: S.optional(S.String),
  intentName: S.optional(S.String),
  intentDisplayName: S.optional(S.String),
  description: S.optional(S.String),
  parentIntentSignature: S.optional(S.String),
  sampleUtterances: S.optional(SampleUtterancesList),
  dialogCodeHook: S.optional(DialogCodeHookSettings),
  fulfillmentCodeHook: S.optional(FulfillmentCodeHookSettings),
  slotPriorities: S.optional(SlotPrioritiesList),
  intentConfirmationSetting: S.optional(IntentConfirmationSetting),
  intentClosingSetting: S.optional(IntentClosingSetting),
  inputContexts: S.optional(InputContextsList),
  outputContexts: S.optional(OutputContextsList),
  kendraConfiguration: S.optional(KendraConfiguration),
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  initialResponseSetting: S.optional(InitialResponseSetting),
  qnAIntentConfiguration: S.optional(QnAIntentConfiguration),
  qInConnectIntentConfiguration: S.optional(QInConnectIntentConfiguration),
}) {}
export class DescribeResourcePolicyResponse extends S.Class<DescribeResourcePolicyResponse>(
  "DescribeResourcePolicyResponse",
)({
  resourceArn: S.optional(S.String),
  policy: S.optional(S.String),
  revisionId: S.optional(S.String),
}) {}
export class DescribeSlotResponse extends S.Class<DescribeSlotResponse>(
  "DescribeSlotResponse",
)({
  slotId: S.optional(S.String),
  slotName: S.optional(S.String),
  description: S.optional(S.String),
  slotTypeId: S.optional(S.String),
  valueElicitationSetting: S.optional(SlotValueElicitationSetting),
  obfuscationSetting: S.optional(ObfuscationSetting),
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  intentId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  multipleValuesSetting: S.optional(MultipleValuesSetting),
  subSlotSetting: S.optional(SubSlotSetting),
}) {}
export class DescribeSlotTypeResponse extends S.Class<DescribeSlotTypeResponse>(
  "DescribeSlotTypeResponse",
)({
  slotTypeId: S.optional(S.String),
  slotTypeName: S.optional(S.String),
  description: S.optional(S.String),
  slotTypeValues: S.optional(SlotTypeValues),
  valueSelectionSetting: S.optional(SlotValueSelectionSetting),
  parentSlotTypeSignature: S.optional(S.String),
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  externalSourceSetting: S.optional(ExternalSourceSetting),
  compositeSlotTypeSetting: S.optional(CompositeSlotTypeSetting),
}) {}
export class BotAliasTestExecutionTarget extends S.Class<BotAliasTestExecutionTarget>(
  "BotAliasTestExecutionTarget",
)({ botId: S.String, botAliasId: S.String, localeId: S.String }) {}
export class TestExecutionTarget extends S.Class<TestExecutionTarget>(
  "TestExecutionTarget",
)({ botAliasTarget: S.optional(BotAliasTestExecutionTarget) }) {}
export class DescribeTestExecutionResponse extends S.Class<DescribeTestExecutionResponse>(
  "DescribeTestExecutionResponse",
)({
  testExecutionId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  testExecutionStatus: S.optional(S.String),
  testSetId: S.optional(S.String),
  testSetName: S.optional(S.String),
  target: S.optional(TestExecutionTarget),
  apiMode: S.optional(S.String),
  testExecutionModality: S.optional(S.String),
  failureReasons: S.optional(FailureReasons),
}) {}
export class DescribeTestSetResponse extends S.Class<DescribeTestSetResponse>(
  "DescribeTestSetResponse",
)({
  testSetId: S.optional(S.String),
  testSetName: S.optional(S.String),
  description: S.optional(S.String),
  modality: S.optional(S.String),
  status: S.optional(S.String),
  roleArn: S.optional(S.String),
  numTurns: S.optional(S.Number),
  storageLocation: S.optional(TestSetStorageLocation),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class ConversationLogsDataSourceFilterBy extends S.Class<ConversationLogsDataSourceFilterBy>(
  "ConversationLogsDataSourceFilterBy",
)({
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  inputMode: S.String,
}) {}
export class ConversationLogsDataSource extends S.Class<ConversationLogsDataSource>(
  "ConversationLogsDataSource",
)({
  botId: S.String,
  botAliasId: S.String,
  localeId: S.String,
  filter: ConversationLogsDataSourceFilterBy,
}) {}
export class TestSetGenerationDataSource extends S.Class<TestSetGenerationDataSource>(
  "TestSetGenerationDataSource",
)({ conversationLogsDataSource: S.optional(ConversationLogsDataSource) }) {}
export class DescribeTestSetGenerationResponse extends S.Class<DescribeTestSetGenerationResponse>(
  "DescribeTestSetGenerationResponse",
)({
  testSetGenerationId: S.optional(S.String),
  testSetGenerationStatus: S.optional(S.String),
  failureReasons: S.optional(FailureReasons),
  testSetId: S.optional(S.String),
  testSetName: S.optional(S.String),
  description: S.optional(S.String),
  storageLocation: S.optional(TestSetStorageLocation),
  generationDataSource: S.optional(TestSetGenerationDataSource),
  roleArn: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class GenerateBotElementResponse extends S.Class<GenerateBotElementResponse>(
  "GenerateBotElementResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  intentId: S.optional(S.String),
  sampleUtterances: S.optional(SampleUtterancesList),
}) {}
export class GetTestExecutionArtifactsUrlResponse extends S.Class<GetTestExecutionArtifactsUrlResponse>(
  "GetTestExecutionArtifactsUrlResponse",
)({
  testExecutionId: S.optional(S.String),
  downloadArtifactsUrl: S.optional(S.String),
}) {}
export class ListBotLocalesRequest extends S.Class<ListBotLocalesRequest>(
  "ListBotLocalesRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    sortBy: S.optional(BotLocaleSortBy),
    filters: S.optional(BotLocaleFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBotResourceGenerationsRequest extends S.Class<ListBotResourceGenerationsRequest>(
  "ListBotResourceGenerationsRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    sortBy: S.optional(GenerationSortBy),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/generations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBotsRequest extends S.Class<ListBotsRequest>(
  "ListBotsRequest",
)(
  {
    sortBy: S.optional(BotSortBy),
    filters: S.optional(BotFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/bots" }), svc, auth, proto, ver, rules),
) {}
export class ListBotVersionReplicasRequest extends S.Class<ListBotVersionReplicasRequest>(
  "ListBotVersionReplicasRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    replicaRegion: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    sortBy: S.optional(BotVersionReplicaSortBy),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/bots/{botId}/replicas/{replicaRegion}/botversions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBotVersionsRequest extends S.Class<ListBotVersionsRequest>(
  "ListBotVersionsRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    sortBy: S.optional(BotVersionSortBy),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/bots/{botId}/botversions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBuiltInIntentsRequest extends S.Class<ListBuiltInIntentsRequest>(
  "ListBuiltInIntentsRequest",
)(
  {
    localeId: S.String.pipe(T.HttpLabel()),
    sortBy: S.optional(BuiltInIntentSortBy),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/builtins/locales/{localeId}/intents" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBuiltInSlotTypesRequest extends S.Class<ListBuiltInSlotTypesRequest>(
  "ListBuiltInSlotTypesRequest",
)(
  {
    localeId: S.String.pipe(T.HttpLabel()),
    sortBy: S.optional(BuiltInSlotTypeSortBy),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/builtins/locales/{localeId}/slottypes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCustomVocabularyItemsResponse extends S.Class<ListCustomVocabularyItemsResponse>(
  "ListCustomVocabularyItemsResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  customVocabularyItems: S.optional(CustomVocabularyItems),
  nextToken: S.optional(S.String),
}) {}
export class ListExportsRequest extends S.Class<ListExportsRequest>(
  "ListExportsRequest",
)(
  {
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    sortBy: S.optional(ExportSortBy),
    filters: S.optional(ExportFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    localeId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/exports" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListImportsRequest extends S.Class<ListImportsRequest>(
  "ListImportsRequest",
)(
  {
    botId: S.optional(S.String),
    botVersion: S.optional(S.String),
    sortBy: S.optional(ImportSortBy),
    filters: S.optional(ImportFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    localeId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/imports" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIntentMetricsRequest extends S.Class<ListIntentMetricsRequest>(
  "ListIntentMetricsRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    startDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    metrics: AnalyticsIntentMetrics,
    binBy: S.optional(AnalyticsBinByList),
    groupBy: S.optional(AnalyticsIntentGroupByList),
    filters: S.optional(AnalyticsIntentFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/bots/{botId}/analytics/intentmetrics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIntentPathsRequest extends S.Class<ListIntentPathsRequest>(
  "ListIntentPathsRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    startDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    intentPath: S.String,
    filters: S.optional(AnalyticsPathFilters),
  },
  T.all(
    T.Http({ method: "POST", uri: "/bots/{botId}/analytics/intentpaths" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIntentsRequest extends S.Class<ListIntentsRequest>(
  "ListIntentsRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    sortBy: S.optional(IntentSortBy),
    filters: S.optional(IntentFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIntentStageMetricsRequest extends S.Class<ListIntentStageMetricsRequest>(
  "ListIntentStageMetricsRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    startDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    metrics: AnalyticsIntentStageMetrics,
    binBy: S.optional(AnalyticsBinByList),
    groupBy: S.optional(AnalyticsIntentStageGroupByList),
    filters: S.optional(AnalyticsIntentStageFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/bots/{botId}/analytics/intentstagemetrics",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSessionAnalyticsDataRequest extends S.Class<ListSessionAnalyticsDataRequest>(
  "ListSessionAnalyticsDataRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    startDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    sortBy: S.optional(SessionDataSortBy),
    filters: S.optional(AnalyticsSessionFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/bots/{botId}/analytics/sessions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSessionMetricsRequest extends S.Class<ListSessionMetricsRequest>(
  "ListSessionMetricsRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    startDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    metrics: AnalyticsSessionMetrics,
    binBy: S.optional(AnalyticsBinByList),
    groupBy: S.optional(AnalyticsSessionGroupByList),
    filters: S.optional(AnalyticsSessionFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/bots/{botId}/analytics/sessionmetrics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSlotsRequest extends S.Class<ListSlotsRequest>(
  "ListSlotsRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    intentId: S.String.pipe(T.HttpLabel()),
    sortBy: S.optional(SlotSortBy),
    filters: S.optional(SlotFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents/{intentId}/slots",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSlotTypesRequest extends S.Class<ListSlotTypesRequest>(
  "ListSlotTypesRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    sortBy: S.optional(SlotTypeSortBy),
    filters: S.optional(SlotTypeFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/slottypes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class ListTestExecutionsRequest extends S.Class<ListTestExecutionsRequest>(
  "ListTestExecutionsRequest",
)(
  {
    sortBy: S.optional(TestExecutionSortBy),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/testexecutions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTestSetsRequest extends S.Class<ListTestSetsRequest>(
  "ListTestSetsRequest",
)(
  {
    sortBy: S.optional(TestSetSortBy),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/testsets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListUtteranceAnalyticsDataRequest extends S.Class<ListUtteranceAnalyticsDataRequest>(
  "ListUtteranceAnalyticsDataRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    startDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    sortBy: S.optional(UtteranceDataSortBy),
    filters: S.optional(AnalyticsUtteranceFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/bots/{botId}/analytics/utterances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListUtteranceMetricsRequest extends S.Class<ListUtteranceMetricsRequest>(
  "ListUtteranceMetricsRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    startDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    metrics: AnalyticsUtteranceMetrics,
    binBy: S.optional(AnalyticsBinByList),
    groupBy: S.optional(AnalyticsUtteranceGroupByList),
    attributes: S.optional(AnalyticsUtteranceAttributes),
    filters: S.optional(AnalyticsUtteranceFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/bots/{botId}/analytics/utterancemetrics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchAssociatedTranscriptsRequest extends S.Class<SearchAssociatedTranscriptsRequest>(
  "SearchAssociatedTranscriptsRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    botRecommendationId: S.String.pipe(T.HttpLabel()),
    searchOrder: S.optional(S.String),
    filters: AssociatedTranscriptFilters,
    maxResults: S.optional(S.Number),
    nextIndex: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/botrecommendations/{botRecommendationId}/associatedtranscripts",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartBotResourceGenerationResponse extends S.Class<StartBotResourceGenerationResponse>(
  "StartBotResourceGenerationResponse",
)({
  generationInputPrompt: S.optional(S.String),
  generationId: S.optional(S.String),
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  generationStatus: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class StopBotRecommendationResponse extends S.Class<StopBotRecommendationResponse>(
  "StopBotRecommendationResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  botRecommendationStatus: S.optional(S.String),
  botRecommendationId: S.optional(S.String),
}) {}
export class UpdateBotResponse extends S.Class<UpdateBotResponse>(
  "UpdateBotResponse",
)({
  botId: S.optional(S.String),
  botName: S.optional(S.String),
  description: S.optional(S.String),
  roleArn: S.optional(S.String),
  dataPrivacy: S.optional(DataPrivacy),
  idleSessionTTLInSeconds: S.optional(S.Number),
  botStatus: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  botType: S.optional(S.String),
  botMembers: S.optional(BotMembers),
  errorLogSettings: S.optional(ErrorLogSettings),
}) {}
export class UpdateBotAliasResponse extends S.Class<UpdateBotAliasResponse>(
  "UpdateBotAliasResponse",
)({
  botAliasId: S.optional(S.String),
  botAliasName: S.optional(S.String),
  description: S.optional(S.String),
  botVersion: S.optional(S.String),
  botAliasLocaleSettings: S.optional(BotAliasLocaleSettingsMap),
  conversationLogSettings: S.optional(ConversationLogSettings),
  sentimentAnalysisSettings: S.optional(SentimentAnalysisSettings),
  botAliasStatus: S.optional(S.String),
  botId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class UpdateBotLocaleResponse extends S.Class<UpdateBotLocaleResponse>(
  "UpdateBotLocaleResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  localeName: S.optional(S.String),
  description: S.optional(S.String),
  nluIntentConfidenceThreshold: S.optional(S.Number),
  voiceSettings: S.optional(VoiceSettings),
  unifiedSpeechSettings: S.optional(UnifiedSpeechSettings),
  speechRecognitionSettings: S.optional(SpeechRecognitionSettings),
  botLocaleStatus: S.optional(S.String),
  failureReasons: S.optional(FailureReasons),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  recommendedActions: S.optional(RecommendedActions),
  generativeAISettings: S.optional(GenerativeAISettings),
  speechDetectionSensitivity: S.optional(S.String),
}) {}
export const ObjectPrefixes = S.Array(S.String);
export class PathFormat extends S.Class<PathFormat>("PathFormat")({
  objectPrefixes: S.optional(ObjectPrefixes),
}) {}
export class DateRangeFilter extends S.Class<DateRangeFilter>(
  "DateRangeFilter",
)({
  startDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  endDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class LexTranscriptFilter extends S.Class<LexTranscriptFilter>(
  "LexTranscriptFilter",
)({ dateRangeFilter: S.optional(DateRangeFilter) }) {}
export class TranscriptFilter extends S.Class<TranscriptFilter>(
  "TranscriptFilter",
)({ lexTranscriptFilter: S.optional(LexTranscriptFilter) }) {}
export class S3BucketTranscriptSource extends S.Class<S3BucketTranscriptSource>(
  "S3BucketTranscriptSource",
)({
  s3BucketName: S.String,
  pathFormat: S.optional(PathFormat),
  transcriptFormat: S.String,
  transcriptFilter: S.optional(TranscriptFilter),
  kmsKeyArn: S.optional(S.String),
}) {}
export class TranscriptSourceSetting extends S.Class<TranscriptSourceSetting>(
  "TranscriptSourceSetting",
)({ s3BucketTranscriptSource: S.optional(S3BucketTranscriptSource) }) {}
export class UpdateBotRecommendationResponse extends S.Class<UpdateBotRecommendationResponse>(
  "UpdateBotRecommendationResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  botRecommendationStatus: S.optional(S.String),
  botRecommendationId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  transcriptSourceSetting: S.optional(TranscriptSourceSetting),
  encryptionSetting: S.optional(EncryptionSetting),
}) {}
export class UpdateExportResponse extends S.Class<UpdateExportResponse>(
  "UpdateExportResponse",
)({
  exportId: S.optional(S.String),
  resourceSpecification: S.optional(ExportResourceSpecification),
  fileFormat: S.optional(S.String),
  exportStatus: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class UpdateIntentRequest extends S.Class<UpdateIntentRequest>(
  "UpdateIntentRequest",
)(
  {
    intentId: S.String.pipe(T.HttpLabel()),
    intentName: S.String,
    intentDisplayName: S.optional(S.String),
    description: S.optional(S.String),
    parentIntentSignature: S.optional(S.String),
    sampleUtterances: S.optional(SampleUtterancesList),
    dialogCodeHook: S.optional(DialogCodeHookSettings),
    fulfillmentCodeHook: S.optional(FulfillmentCodeHookSettings),
    slotPriorities: S.optional(SlotPrioritiesList),
    intentConfirmationSetting: S.optional(IntentConfirmationSetting),
    intentClosingSetting: S.optional(IntentClosingSetting),
    inputContexts: S.optional(InputContextsList),
    outputContexts: S.optional(OutputContextsList),
    kendraConfiguration: S.optional(KendraConfiguration),
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    initialResponseSetting: S.optional(InitialResponseSetting),
    qnAIntentConfiguration: S.optional(QnAIntentConfiguration),
    qInConnectIntentConfiguration: S.optional(QInConnectIntentConfiguration),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents/{intentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateResourcePolicyResponse extends S.Class<UpdateResourcePolicyResponse>(
  "UpdateResourcePolicyResponse",
)({ resourceArn: S.optional(S.String), revisionId: S.optional(S.String) }) {}
export class UpdateSlotResponse extends S.Class<UpdateSlotResponse>(
  "UpdateSlotResponse",
)({
  slotId: S.optional(S.String),
  slotName: S.optional(S.String),
  description: S.optional(S.String),
  slotTypeId: S.optional(S.String),
  valueElicitationSetting: S.optional(SlotValueElicitationSetting),
  obfuscationSetting: S.optional(ObfuscationSetting),
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  intentId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  multipleValuesSetting: S.optional(MultipleValuesSetting),
  subSlotSetting: S.optional(SubSlotSetting),
}) {}
export class UpdateSlotTypeResponse extends S.Class<UpdateSlotTypeResponse>(
  "UpdateSlotTypeResponse",
)({
  slotTypeId: S.optional(S.String),
  slotTypeName: S.optional(S.String),
  description: S.optional(S.String),
  slotTypeValues: S.optional(SlotTypeValues),
  valueSelectionSetting: S.optional(SlotValueSelectionSetting),
  parentSlotTypeSignature: S.optional(S.String),
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  externalSourceSetting: S.optional(ExternalSourceSetting),
  compositeSlotTypeSetting: S.optional(CompositeSlotTypeSetting),
}) {}
export class UpdateTestSetResponse extends S.Class<UpdateTestSetResponse>(
  "UpdateTestSetResponse",
)({
  testSetId: S.optional(S.String),
  testSetName: S.optional(S.String),
  description: S.optional(S.String),
  modality: S.optional(S.String),
  status: S.optional(S.String),
  roleArn: S.optional(S.String),
  numTurns: S.optional(S.Number),
  storageLocation: S.optional(TestSetStorageLocation),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class BotVersionLocaleDetails extends S.Class<BotVersionLocaleDetails>(
  "BotVersionLocaleDetails",
)({ sourceBotVersion: S.String }) {}
export const ConditionKeyValueMap = S.Record({
  key: S.String,
  value: S.String,
});
export class TestSetDiscrepancyReportBotAliasTarget extends S.Class<TestSetDiscrepancyReportBotAliasTarget>(
  "TestSetDiscrepancyReportBotAliasTarget",
)({ botId: S.String, botAliasId: S.String, localeId: S.String }) {}
export class RelativeAggregationDuration extends S.Class<RelativeAggregationDuration>(
  "RelativeAggregationDuration",
)({ timeDimension: S.String, timeValue: S.Number }) {}
export class ConversationLevelTestResultsFilterBy extends S.Class<ConversationLevelTestResultsFilterBy>(
  "ConversationLevelTestResultsFilterBy",
)({ endToEndResult: S.optional(S.String) }) {}
export const BotVersionLocaleSpecification = S.Record({
  key: S.String,
  value: BotVersionLocaleDetails,
});
export const ConditionMap = S.Record({
  key: S.String,
  value: ConditionKeyValueMap,
});
export class TestSetDiscrepancyReportResourceTarget extends S.Class<TestSetDiscrepancyReportResourceTarget>(
  "TestSetDiscrepancyReportResourceTarget",
)({ botAliasTarget: S.optional(TestSetDiscrepancyReportBotAliasTarget) }) {}
export class BotAliasHistoryEvent extends S.Class<BotAliasHistoryEvent>(
  "BotAliasHistoryEvent",
)({
  botVersion: S.optional(S.String),
  startDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const BotAliasHistoryEventsList = S.Array(BotAliasHistoryEvent);
export class BotLocaleHistoryEvent extends S.Class<BotLocaleHistoryEvent>(
  "BotLocaleHistoryEvent",
)({
  event: S.String,
  eventDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const BotLocaleHistoryEventsList = S.Array(BotLocaleHistoryEvent);
export class UtteranceAggregationDuration extends S.Class<UtteranceAggregationDuration>(
  "UtteranceAggregationDuration",
)({ relativeAggregationDuration: RelativeAggregationDuration }) {}
export class BotAliasSummary extends S.Class<BotAliasSummary>(
  "BotAliasSummary",
)({
  botAliasId: S.optional(S.String),
  botAliasName: S.optional(S.String),
  description: S.optional(S.String),
  botVersion: S.optional(S.String),
  botAliasStatus: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const BotAliasSummaryList = S.Array(BotAliasSummary);
export class BotAliasReplicaSummary extends S.Class<BotAliasReplicaSummary>(
  "BotAliasReplicaSummary",
)({
  botAliasId: S.optional(S.String),
  botAliasReplicationStatus: S.optional(S.String),
  botVersion: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  failureReasons: S.optional(FailureReasons),
}) {}
export const BotAliasReplicaSummaryList = S.Array(BotAliasReplicaSummary);
export class BotRecommendationSummary extends S.Class<BotRecommendationSummary>(
  "BotRecommendationSummary",
)({
  botRecommendationStatus: S.String,
  botRecommendationId: S.String,
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const BotRecommendationSummaryList = S.Array(BotRecommendationSummary);
export class BotReplicaSummary extends S.Class<BotReplicaSummary>(
  "BotReplicaSummary",
)({
  replicaRegion: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  botReplicaStatus: S.optional(S.String),
  failureReasons: S.optional(FailureReasons),
}) {}
export const BotReplicaSummaryList = S.Array(BotReplicaSummary);
export class RecommendedIntentSummary extends S.Class<RecommendedIntentSummary>(
  "RecommendedIntentSummary",
)({
  intentId: S.optional(S.String),
  intentName: S.optional(S.String),
  sampleUtterancesCount: S.optional(S.Number),
}) {}
export const RecommendedIntentSummaryList = S.Array(RecommendedIntentSummary);
export class TestExecutionResultFilterBy extends S.Class<TestExecutionResultFilterBy>(
  "TestExecutionResultFilterBy",
)({
  resultTypeFilter: S.String,
  conversationLevelTestResultsFilterBy: S.optional(
    ConversationLevelTestResultsFilterBy,
  ),
}) {}
export class FailedCustomVocabularyItem extends S.Class<FailedCustomVocabularyItem>(
  "FailedCustomVocabularyItem",
)({
  itemId: S.optional(S.String),
  errorMessage: S.optional(S.String),
  errorCode: S.optional(S.String),
}) {}
export const FailedCustomVocabularyItems = S.Array(FailedCustomVocabularyItem);
export class BatchDeleteCustomVocabularyItemResponse extends S.Class<BatchDeleteCustomVocabularyItemResponse>(
  "BatchDeleteCustomVocabularyItemResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  errors: S.optional(FailedCustomVocabularyItems),
  resources: S.optional(CustomVocabularyItems),
}) {}
export class BatchUpdateCustomVocabularyItemResponse extends S.Class<BatchUpdateCustomVocabularyItemResponse>(
  "BatchUpdateCustomVocabularyItemResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  errors: S.optional(FailedCustomVocabularyItems),
  resources: S.optional(CustomVocabularyItems),
}) {}
export class CreateBotResponse extends S.Class<CreateBotResponse>(
  "CreateBotResponse",
)({
  botId: S.optional(S.String),
  botName: S.optional(S.String),
  description: S.optional(S.String),
  roleArn: S.optional(S.String),
  dataPrivacy: S.optional(DataPrivacy),
  idleSessionTTLInSeconds: S.optional(S.Number),
  botStatus: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  botTags: S.optional(TagMap),
  testBotAliasTags: S.optional(TagMap),
  botType: S.optional(S.String),
  botMembers: S.optional(BotMembers),
  errorLogSettings: S.optional(ErrorLogSettings),
}) {}
export class CreateBotVersionRequest extends S.Class<CreateBotVersionRequest>(
  "CreateBotVersionRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    description: S.optional(S.String),
    botVersionLocaleSpecification: BotVersionLocaleSpecification,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/bots/{botId}/botversions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateExportRequest extends S.Class<CreateExportRequest>(
  "CreateExportRequest",
)(
  {
    resourceSpecification: ExportResourceSpecification,
    fileFormat: S.String,
    filePassword: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/exports" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateResourcePolicyStatementRequest extends S.Class<CreateResourcePolicyStatementRequest>(
  "CreateResourcePolicyStatementRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel()),
    statementId: S.String,
    effect: S.String,
    principal: PrincipalList,
    action: OperationList,
    condition: S.optional(ConditionMap),
    expectedRevisionId: S.optional(S.String).pipe(
      T.HttpQuery("expectedRevisionId"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/policy/{resourceArn}/statements" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTestSetDiscrepancyReportRequest extends S.Class<CreateTestSetDiscrepancyReportRequest>(
  "CreateTestSetDiscrepancyReportRequest",
)(
  {
    testSetId: S.String.pipe(T.HttpLabel()),
    target: TestSetDiscrepancyReportResourceTarget,
  },
  T.all(
    T.Http({ method: "POST", uri: "/testsets/{testSetId}/testsetdiscrepancy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeBotAliasResponse extends S.Class<DescribeBotAliasResponse>(
  "DescribeBotAliasResponse",
)({
  botAliasId: S.optional(S.String),
  botAliasName: S.optional(S.String),
  description: S.optional(S.String),
  botVersion: S.optional(S.String),
  botAliasLocaleSettings: S.optional(BotAliasLocaleSettingsMap),
  conversationLogSettings: S.optional(ConversationLogSettings),
  sentimentAnalysisSettings: S.optional(SentimentAnalysisSettings),
  botAliasHistoryEvents: S.optional(BotAliasHistoryEventsList),
  botAliasStatus: S.optional(S.String),
  botId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  parentBotNetworks: S.optional(ParentBotNetworks),
}) {}
export class DescribeBotLocaleResponse extends S.Class<DescribeBotLocaleResponse>(
  "DescribeBotLocaleResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  localeName: S.optional(S.String),
  description: S.optional(S.String),
  nluIntentConfidenceThreshold: S.optional(S.Number),
  voiceSettings: S.optional(VoiceSettings),
  unifiedSpeechSettings: S.optional(UnifiedSpeechSettings),
  speechRecognitionSettings: S.optional(SpeechRecognitionSettings),
  intentsCount: S.optional(S.Number),
  slotTypesCount: S.optional(S.Number),
  botLocaleStatus: S.optional(S.String),
  failureReasons: S.optional(FailureReasons),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  lastBuildSubmittedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  botLocaleHistoryEvents: S.optional(BotLocaleHistoryEventsList),
  recommendedActions: S.optional(RecommendedActions),
  generativeAISettings: S.optional(GenerativeAISettings),
  speechDetectionSensitivity: S.optional(S.String),
}) {}
export class ListAggregatedUtterancesRequest extends S.Class<ListAggregatedUtterancesRequest>(
  "ListAggregatedUtterancesRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botAliasId: S.optional(S.String),
    botVersion: S.optional(S.String),
    localeId: S.String,
    aggregationDuration: UtteranceAggregationDuration,
    sortBy: S.optional(AggregatedUtterancesSortBy),
    filters: S.optional(AggregatedUtterancesFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/bots/{botId}/aggregatedutterances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBotAliasesResponse extends S.Class<ListBotAliasesResponse>(
  "ListBotAliasesResponse",
)({
  botAliasSummaries: S.optional(BotAliasSummaryList),
  nextToken: S.optional(S.String),
  botId: S.optional(S.String),
}) {}
export class ListBotAliasReplicasResponse extends S.Class<ListBotAliasReplicasResponse>(
  "ListBotAliasReplicasResponse",
)({
  botId: S.optional(S.String),
  sourceRegion: S.optional(S.String),
  replicaRegion: S.optional(S.String),
  botAliasReplicaSummaries: S.optional(BotAliasReplicaSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListBotRecommendationsResponse extends S.Class<ListBotRecommendationsResponse>(
  "ListBotRecommendationsResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  botRecommendationSummaries: S.optional(BotRecommendationSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListBotReplicasResponse extends S.Class<ListBotReplicasResponse>(
  "ListBotReplicasResponse",
)({
  botId: S.optional(S.String),
  sourceRegion: S.optional(S.String),
  botReplicaSummaries: S.optional(BotReplicaSummaryList),
}) {}
export class ListRecommendedIntentsResponse extends S.Class<ListRecommendedIntentsResponse>(
  "ListRecommendedIntentsResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  botRecommendationId: S.optional(S.String),
  summaryList: S.optional(RecommendedIntentSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListTestExecutionResultItemsRequest extends S.Class<ListTestExecutionResultItemsRequest>(
  "ListTestExecutionResultItemsRequest",
)(
  {
    testExecutionId: S.String.pipe(T.HttpLabel()),
    resultFilterBy: TestExecutionResultFilterBy,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/testexecutions/{testExecutionId}/results",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartTestExecutionRequest extends S.Class<StartTestExecutionRequest>(
  "StartTestExecutionRequest",
)(
  {
    testSetId: S.String.pipe(T.HttpLabel()),
    target: TestExecutionTarget,
    apiMode: S.String,
    testExecutionModality: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/testsets/{testSetId}/testexecutions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateIntentResponse extends S.Class<UpdateIntentResponse>(
  "UpdateIntentResponse",
)({
  intentId: S.optional(S.String),
  intentName: S.optional(S.String),
  intentDisplayName: S.optional(S.String),
  description: S.optional(S.String),
  parentIntentSignature: S.optional(S.String),
  sampleUtterances: S.optional(SampleUtterancesList),
  dialogCodeHook: S.optional(DialogCodeHookSettings),
  fulfillmentCodeHook: S.optional(FulfillmentCodeHookSettings),
  slotPriorities: S.optional(SlotPrioritiesList),
  intentConfirmationSetting: S.optional(IntentConfirmationSetting),
  intentClosingSetting: S.optional(IntentClosingSetting),
  inputContexts: S.optional(InputContextsList),
  outputContexts: S.optional(OutputContextsList),
  kendraConfiguration: S.optional(KendraConfiguration),
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  initialResponseSetting: S.optional(InitialResponseSetting),
  qnAIntentConfiguration: S.optional(QnAIntentConfiguration),
  qInConnectIntentConfiguration: S.optional(QInConnectIntentConfiguration),
}) {}
export class TestSetIntentDiscrepancyItem extends S.Class<TestSetIntentDiscrepancyItem>(
  "TestSetIntentDiscrepancyItem",
)({ intentName: S.String, errorMessage: S.String }) {}
export const TestSetIntentDiscrepancyList = S.Array(
  TestSetIntentDiscrepancyItem,
);
export class TestSetSlotDiscrepancyItem extends S.Class<TestSetSlotDiscrepancyItem>(
  "TestSetSlotDiscrepancyItem",
)({ intentName: S.String, slotName: S.String, errorMessage: S.String }) {}
export const TestSetSlotDiscrepancyList = S.Array(TestSetSlotDiscrepancyItem);
export type SlotValues = SlotValueOverride[];
export const SlotValues = S.Array(
  S.suspend((): S.Schema<SlotValueOverride, any> => SlotValueOverride),
) as any as S.Schema<SlotValues>;
export class TestSetDiscrepancyErrors extends S.Class<TestSetDiscrepancyErrors>(
  "TestSetDiscrepancyErrors",
)({
  intentDiscrepancies: TestSetIntentDiscrepancyList,
  slotDiscrepancies: TestSetSlotDiscrepancyList,
}) {}
export class BotLocaleSummary extends S.Class<BotLocaleSummary>(
  "BotLocaleSummary",
)({
  localeId: S.optional(S.String),
  localeName: S.optional(S.String),
  description: S.optional(S.String),
  botLocaleStatus: S.optional(S.String),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  lastBuildSubmittedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const BotLocaleSummaryList = S.Array(BotLocaleSummary);
export class GenerationSummary extends S.Class<GenerationSummary>(
  "GenerationSummary",
)({
  generationId: S.optional(S.String),
  generationStatus: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const GenerationSummaryList = S.Array(GenerationSummary);
export class BotSummary extends S.Class<BotSummary>("BotSummary")({
  botId: S.optional(S.String),
  botName: S.optional(S.String),
  description: S.optional(S.String),
  botStatus: S.optional(S.String),
  latestBotVersion: S.optional(S.String),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  botType: S.optional(S.String),
}) {}
export const BotSummaryList = S.Array(BotSummary);
export class BotVersionReplicaSummary extends S.Class<BotVersionReplicaSummary>(
  "BotVersionReplicaSummary",
)({
  botVersion: S.optional(S.String),
  botVersionReplicationStatus: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  failureReasons: S.optional(FailureReasons),
}) {}
export const BotVersionReplicaSummaryList = S.Array(BotVersionReplicaSummary);
export class BotVersionSummary extends S.Class<BotVersionSummary>(
  "BotVersionSummary",
)({
  botName: S.optional(S.String),
  botVersion: S.optional(S.String),
  description: S.optional(S.String),
  botStatus: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const BotVersionSummaryList = S.Array(BotVersionSummary);
export class BuiltInIntentSummary extends S.Class<BuiltInIntentSummary>(
  "BuiltInIntentSummary",
)({
  intentSignature: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export const BuiltInIntentSummaryList = S.Array(BuiltInIntentSummary);
export class BuiltInSlotTypeSummary extends S.Class<BuiltInSlotTypeSummary>(
  "BuiltInSlotTypeSummary",
)({
  slotTypeSignature: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export const BuiltInSlotTypeSummaryList = S.Array(BuiltInSlotTypeSummary);
export class ExportSummary extends S.Class<ExportSummary>("ExportSummary")({
  exportId: S.optional(S.String),
  resourceSpecification: S.optional(ExportResourceSpecification),
  fileFormat: S.optional(S.String),
  exportStatus: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const ExportSummaryList = S.Array(ExportSummary);
export class ImportSummary extends S.Class<ImportSummary>("ImportSummary")({
  importId: S.optional(S.String),
  importedResourceId: S.optional(S.String),
  importedResourceName: S.optional(S.String),
  importStatus: S.optional(S.String),
  mergeStrategy: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  importedResourceType: S.optional(S.String),
}) {}
export const ImportSummaryList = S.Array(ImportSummary);
export class AnalyticsIntentNodeSummary extends S.Class<AnalyticsIntentNodeSummary>(
  "AnalyticsIntentNodeSummary",
)({
  intentName: S.optional(S.String),
  intentPath: S.optional(S.String),
  intentCount: S.optional(S.Number),
  intentLevel: S.optional(S.Number),
  nodeType: S.optional(S.String),
}) {}
export const AnalyticsIntentNodeSummaries = S.Array(AnalyticsIntentNodeSummary);
export class IntentSummary extends S.Class<IntentSummary>("IntentSummary")({
  intentId: S.optional(S.String),
  intentName: S.optional(S.String),
  intentDisplayName: S.optional(S.String),
  description: S.optional(S.String),
  parentIntentSignature: S.optional(S.String),
  inputContexts: S.optional(InputContextsList),
  outputContexts: S.optional(OutputContextsList),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const IntentSummaryList = S.Array(IntentSummary);
export class SlotSummary extends S.Class<SlotSummary>("SlotSummary")({
  slotId: S.optional(S.String),
  slotName: S.optional(S.String),
  description: S.optional(S.String),
  slotConstraint: S.optional(S.String),
  slotTypeId: S.optional(S.String),
  valueElicitationPromptSpecification: S.optional(PromptSpecification),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const SlotSummaryList = S.Array(SlotSummary);
export class SlotTypeSummary extends S.Class<SlotTypeSummary>(
  "SlotTypeSummary",
)({
  slotTypeId: S.optional(S.String),
  slotTypeName: S.optional(S.String),
  description: S.optional(S.String),
  parentSlotTypeSignature: S.optional(S.String),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  slotTypeCategory: S.optional(S.String),
}) {}
export const SlotTypeSummaryList = S.Array(SlotTypeSummary);
export class TestExecutionSummary extends S.Class<TestExecutionSummary>(
  "TestExecutionSummary",
)({
  testExecutionId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  testExecutionStatus: S.optional(S.String),
  testSetId: S.optional(S.String),
  testSetName: S.optional(S.String),
  target: S.optional(TestExecutionTarget),
  apiMode: S.optional(S.String),
  testExecutionModality: S.optional(S.String),
}) {}
export const TestExecutionSummaryList = S.Array(TestExecutionSummary);
export class TestSetSummary extends S.Class<TestSetSummary>("TestSetSummary")({
  testSetId: S.optional(S.String),
  testSetName: S.optional(S.String),
  description: S.optional(S.String),
  modality: S.optional(S.String),
  status: S.optional(S.String),
  roleArn: S.optional(S.String),
  numTurns: S.optional(S.Number),
  storageLocation: S.optional(TestSetStorageLocation),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const TestSetSummaryList = S.Array(TestSetSummary);
export class AssociatedTranscript extends S.Class<AssociatedTranscript>(
  "AssociatedTranscript",
)({ transcript: S.optional(S.String) }) {}
export const AssociatedTranscriptList = S.Array(AssociatedTranscript);
export class IntentStatistics extends S.Class<IntentStatistics>(
  "IntentStatistics",
)({ discoveredIntentCount: S.optional(S.Number) }) {}
export class SlotTypeStatistics extends S.Class<SlotTypeStatistics>(
  "SlotTypeStatistics",
)({ discoveredSlotTypeCount: S.optional(S.Number) }) {}
export class AgentTurnSpecification extends S.Class<AgentTurnSpecification>(
  "AgentTurnSpecification",
)({ agentPrompt: S.String }) {}
export class BatchCreateCustomVocabularyItemResponse extends S.Class<BatchCreateCustomVocabularyItemResponse>(
  "BatchCreateCustomVocabularyItemResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  errors: S.optional(FailedCustomVocabularyItems),
  resources: S.optional(CustomVocabularyItems),
}) {}
export class CreateBotVersionResponse extends S.Class<CreateBotVersionResponse>(
  "CreateBotVersionResponse",
)({
  botId: S.optional(S.String),
  description: S.optional(S.String),
  botVersion: S.optional(S.String),
  botVersionLocaleSpecification: S.optional(BotVersionLocaleSpecification),
  botStatus: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateExportResponse extends S.Class<CreateExportResponse>(
  "CreateExportResponse",
)({
  exportId: S.optional(S.String),
  resourceSpecification: S.optional(ExportResourceSpecification),
  fileFormat: S.optional(S.String),
  exportStatus: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateResourcePolicyStatementResponse extends S.Class<CreateResourcePolicyStatementResponse>(
  "CreateResourcePolicyStatementResponse",
)({ resourceArn: S.optional(S.String), revisionId: S.optional(S.String) }) {}
export class CreateSlotTypeRequest extends S.Class<CreateSlotTypeRequest>(
  "CreateSlotTypeRequest",
)(
  {
    slotTypeName: S.String,
    description: S.optional(S.String),
    slotTypeValues: S.optional(SlotTypeValues),
    valueSelectionSetting: S.optional(SlotValueSelectionSetting),
    parentSlotTypeSignature: S.optional(S.String),
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    externalSourceSetting: S.optional(ExternalSourceSetting),
    compositeSlotTypeSetting: S.optional(CompositeSlotTypeSetting),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/slottypes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTestSetDiscrepancyReportResponse extends S.Class<CreateTestSetDiscrepancyReportResponse>(
  "CreateTestSetDiscrepancyReportResponse",
)({
  testSetDiscrepancyReportId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  testSetId: S.optional(S.String),
  target: S.optional(TestSetDiscrepancyReportResourceTarget),
}) {}
export class DescribeTestSetDiscrepancyReportResponse extends S.Class<DescribeTestSetDiscrepancyReportResponse>(
  "DescribeTestSetDiscrepancyReportResponse",
)({
  testSetDiscrepancyReportId: S.optional(S.String),
  testSetId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  target: S.optional(TestSetDiscrepancyReportResourceTarget),
  testSetDiscrepancyReportStatus: S.optional(S.String),
  lastUpdatedDataTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  testSetDiscrepancyTopErrors: S.optional(TestSetDiscrepancyErrors),
  testSetDiscrepancyRawOutputUrl: S.optional(S.String),
  failureReasons: S.optional(FailureReasons),
}) {}
export class ListBotLocalesResponse extends S.Class<ListBotLocalesResponse>(
  "ListBotLocalesResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  nextToken: S.optional(S.String),
  botLocaleSummaries: S.optional(BotLocaleSummaryList),
}) {}
export class ListBotResourceGenerationsResponse extends S.Class<ListBotResourceGenerationsResponse>(
  "ListBotResourceGenerationsResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  generationSummaries: S.optional(GenerationSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListBotsResponse extends S.Class<ListBotsResponse>(
  "ListBotsResponse",
)({
  botSummaries: S.optional(BotSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListBotVersionReplicasResponse extends S.Class<ListBotVersionReplicasResponse>(
  "ListBotVersionReplicasResponse",
)({
  botId: S.optional(S.String),
  sourceRegion: S.optional(S.String),
  replicaRegion: S.optional(S.String),
  botVersionReplicaSummaries: S.optional(BotVersionReplicaSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListBotVersionsResponse extends S.Class<ListBotVersionsResponse>(
  "ListBotVersionsResponse",
)({
  botId: S.optional(S.String),
  botVersionSummaries: S.optional(BotVersionSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListBuiltInIntentsResponse extends S.Class<ListBuiltInIntentsResponse>(
  "ListBuiltInIntentsResponse",
)({
  builtInIntentSummaries: S.optional(BuiltInIntentSummaryList),
  nextToken: S.optional(S.String),
  localeId: S.optional(S.String),
}) {}
export class ListBuiltInSlotTypesResponse extends S.Class<ListBuiltInSlotTypesResponse>(
  "ListBuiltInSlotTypesResponse",
)({
  builtInSlotTypeSummaries: S.optional(BuiltInSlotTypeSummaryList),
  nextToken: S.optional(S.String),
  localeId: S.optional(S.String),
}) {}
export class ListExportsResponse extends S.Class<ListExportsResponse>(
  "ListExportsResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  exportSummaries: S.optional(ExportSummaryList),
  nextToken: S.optional(S.String),
  localeId: S.optional(S.String),
}) {}
export class ListImportsResponse extends S.Class<ListImportsResponse>(
  "ListImportsResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  importSummaries: S.optional(ImportSummaryList),
  nextToken: S.optional(S.String),
  localeId: S.optional(S.String),
}) {}
export class ListIntentPathsResponse extends S.Class<ListIntentPathsResponse>(
  "ListIntentPathsResponse",
)({ nodeSummaries: S.optional(AnalyticsIntentNodeSummaries) }) {}
export class ListIntentsResponse extends S.Class<ListIntentsResponse>(
  "ListIntentsResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  intentSummaries: S.optional(IntentSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListSlotsResponse extends S.Class<ListSlotsResponse>(
  "ListSlotsResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  intentId: S.optional(S.String),
  slotSummaries: S.optional(SlotSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListSlotTypesResponse extends S.Class<ListSlotTypesResponse>(
  "ListSlotTypesResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  slotTypeSummaries: S.optional(SlotTypeSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListTestExecutionsResponse extends S.Class<ListTestExecutionsResponse>(
  "ListTestExecutionsResponse",
)({
  testExecutions: S.optional(TestExecutionSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListTestSetsResponse extends S.Class<ListTestSetsResponse>(
  "ListTestSetsResponse",
)({
  testSets: S.optional(TestSetSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class SearchAssociatedTranscriptsResponse extends S.Class<SearchAssociatedTranscriptsResponse>(
  "SearchAssociatedTranscriptsResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  botRecommendationId: S.optional(S.String),
  nextIndex: S.optional(S.Number),
  associatedTranscripts: S.optional(AssociatedTranscriptList),
  totalResults: S.optional(S.Number),
}) {}
export class StartImportRequest extends S.Class<StartImportRequest>(
  "StartImportRequest",
)(
  {
    importId: S.String,
    resourceSpecification: ImportResourceSpecification,
    mergeStrategy: S.String,
    filePassword: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/imports" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartTestExecutionResponse extends S.Class<StartTestExecutionResponse>(
  "StartTestExecutionResponse",
)({
  testExecutionId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  testSetId: S.optional(S.String),
  target: S.optional(TestExecutionTarget),
  apiMode: S.optional(S.String),
  testExecutionModality: S.optional(S.String),
}) {}
export class StartTestSetGenerationRequest extends S.Class<StartTestSetGenerationRequest>(
  "StartTestSetGenerationRequest",
)(
  {
    testSetName: S.String,
    description: S.optional(S.String),
    storageLocation: TestSetStorageLocation,
    generationDataSource: TestSetGenerationDataSource,
    roleArn: S.String,
    testSetTags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/testsetgenerations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BotRecommendationResultStatistics extends S.Class<BotRecommendationResultStatistics>(
  "BotRecommendationResultStatistics",
)({
  intents: S.optional(IntentStatistics),
  slotTypes: S.optional(SlotTypeStatistics),
}) {}
export class AnalyticsBinKey extends S.Class<AnalyticsBinKey>(
  "AnalyticsBinKey",
)({ name: S.optional(S.String), value: S.optional(S.Number) }) {}
export const AnalyticsBinKeys = S.Array(AnalyticsBinKey);
export class AnalyticsIntentGroupByKey extends S.Class<AnalyticsIntentGroupByKey>(
  "AnalyticsIntentGroupByKey",
)({ name: S.optional(S.String), value: S.optional(S.String) }) {}
export const AnalyticsIntentGroupByKeys = S.Array(AnalyticsIntentGroupByKey);
export class AnalyticsIntentMetricResult extends S.Class<AnalyticsIntentMetricResult>(
  "AnalyticsIntentMetricResult",
)({
  name: S.optional(S.String),
  statistic: S.optional(S.String),
  value: S.optional(S.Number),
}) {}
export const AnalyticsIntentMetricResults = S.Array(
  AnalyticsIntentMetricResult,
);
export class AnalyticsIntentStageGroupByKey extends S.Class<AnalyticsIntentStageGroupByKey>(
  "AnalyticsIntentStageGroupByKey",
)({ name: S.optional(S.String), value: S.optional(S.String) }) {}
export const AnalyticsIntentStageGroupByKeys = S.Array(
  AnalyticsIntentStageGroupByKey,
);
export class AnalyticsIntentStageMetricResult extends S.Class<AnalyticsIntentStageMetricResult>(
  "AnalyticsIntentStageMetricResult",
)({
  name: S.optional(S.String),
  statistic: S.optional(S.String),
  value: S.optional(S.Number),
}) {}
export const AnalyticsIntentStageMetricResults = S.Array(
  AnalyticsIntentStageMetricResult,
);
export class InvokedIntentSample extends S.Class<InvokedIntentSample>(
  "InvokedIntentSample",
)({ intentName: S.optional(S.String) }) {}
export const InvokedIntentSamples = S.Array(InvokedIntentSample);
export class AnalyticsSessionGroupByKey extends S.Class<AnalyticsSessionGroupByKey>(
  "AnalyticsSessionGroupByKey",
)({ name: S.optional(S.String), value: S.optional(S.String) }) {}
export const AnalyticsSessionGroupByKeys = S.Array(AnalyticsSessionGroupByKey);
export class AnalyticsSessionMetricResult extends S.Class<AnalyticsSessionMetricResult>(
  "AnalyticsSessionMetricResult",
)({
  name: S.optional(S.String),
  statistic: S.optional(S.String),
  value: S.optional(S.Number),
}) {}
export const AnalyticsSessionMetricResults = S.Array(
  AnalyticsSessionMetricResult,
);
export class UtteranceBotResponse extends S.Class<UtteranceBotResponse>(
  "UtteranceBotResponse",
)({
  content: S.optional(S.String),
  contentType: S.optional(S.String),
  imageResponseCard: S.optional(ImageResponseCard),
}) {}
export const UtteranceBotResponses = S.Array(UtteranceBotResponse);
export class AnalyticsUtteranceGroupByKey extends S.Class<AnalyticsUtteranceGroupByKey>(
  "AnalyticsUtteranceGroupByKey",
)({ name: S.optional(S.String), value: S.optional(S.String) }) {}
export const AnalyticsUtteranceGroupByKeys = S.Array(
  AnalyticsUtteranceGroupByKey,
);
export class AnalyticsUtteranceMetricResult extends S.Class<AnalyticsUtteranceMetricResult>(
  "AnalyticsUtteranceMetricResult",
)({
  name: S.optional(S.String),
  statistic: S.optional(S.String),
  value: S.optional(S.Number),
}) {}
export const AnalyticsUtteranceMetricResults = S.Array(
  AnalyticsUtteranceMetricResult,
);
export class AnalyticsUtteranceAttributeResult extends S.Class<AnalyticsUtteranceAttributeResult>(
  "AnalyticsUtteranceAttributeResult",
)({ lastUsedIntent: S.optional(S.String) }) {}
export const AnalyticsUtteranceAttributeResults = S.Array(
  AnalyticsUtteranceAttributeResult,
);
export class BotRecommendationResults extends S.Class<BotRecommendationResults>(
  "BotRecommendationResults",
)({
  botLocaleExportUrl: S.optional(S.String),
  associatedTranscriptsUrl: S.optional(S.String),
  statistics: S.optional(BotRecommendationResultStatistics),
}) {}
export class AggregatedUtterancesSummary extends S.Class<AggregatedUtterancesSummary>(
  "AggregatedUtterancesSummary",
)({
  utterance: S.optional(S.String),
  hitCount: S.optional(S.Number),
  missedCount: S.optional(S.Number),
  utteranceFirstRecordedInAggregationDuration: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  utteranceLastRecordedInAggregationDuration: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  containsDataFromDeletedResources: S.optional(S.Boolean),
}) {}
export const AggregatedUtterancesSummaryList = S.Array(
  AggregatedUtterancesSummary,
);
export class AnalyticsIntentResult extends S.Class<AnalyticsIntentResult>(
  "AnalyticsIntentResult",
)({
  binKeys: S.optional(AnalyticsBinKeys),
  groupByKeys: S.optional(AnalyticsIntentGroupByKeys),
  metricsResults: S.optional(AnalyticsIntentMetricResults),
}) {}
export const AnalyticsIntentResults = S.Array(AnalyticsIntentResult);
export class AnalyticsIntentStageResult extends S.Class<AnalyticsIntentStageResult>(
  "AnalyticsIntentStageResult",
)({
  binKeys: S.optional(AnalyticsBinKeys),
  groupByKeys: S.optional(AnalyticsIntentStageGroupByKeys),
  metricsResults: S.optional(AnalyticsIntentStageMetricResults),
}) {}
export const AnalyticsIntentStageResults = S.Array(AnalyticsIntentStageResult);
export class SessionSpecification extends S.Class<SessionSpecification>(
  "SessionSpecification",
)({
  botAliasId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  channel: S.optional(S.String),
  sessionId: S.optional(S.String),
  conversationStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  conversationEndTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  conversationDurationSeconds: S.optional(S.Number),
  conversationEndState: S.optional(S.String),
  mode: S.optional(S.String),
  numberOfTurns: S.optional(S.Number),
  invokedIntentSamples: S.optional(InvokedIntentSamples),
  originatingRequestId: S.optional(S.String),
}) {}
export const SessionSpecifications = S.Array(SessionSpecification);
export class AnalyticsSessionResult extends S.Class<AnalyticsSessionResult>(
  "AnalyticsSessionResult",
)({
  binKeys: S.optional(AnalyticsBinKeys),
  groupByKeys: S.optional(AnalyticsSessionGroupByKeys),
  metricsResults: S.optional(AnalyticsSessionMetricResults),
}) {}
export const AnalyticsSessionResults = S.Array(AnalyticsSessionResult);
export class UtteranceSpecification extends S.Class<UtteranceSpecification>(
  "UtteranceSpecification",
)({
  botAliasId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  sessionId: S.optional(S.String),
  channel: S.optional(S.String),
  mode: S.optional(S.String),
  conversationStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  conversationEndTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  utterance: S.optional(S.String),
  utteranceTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  audioVoiceDurationMillis: S.optional(S.Number),
  utteranceUnderstood: S.optional(S.Boolean),
  inputType: S.optional(S.String),
  outputType: S.optional(S.String),
  associatedIntentName: S.optional(S.String),
  associatedSlotName: S.optional(S.String),
  intentState: S.optional(S.String),
  dialogActionType: S.optional(S.String),
  botResponseAudioVoiceId: S.optional(S.String),
  slotsFilledInSession: S.optional(S.String),
  utteranceRequestId: S.optional(S.String),
  botResponses: S.optional(UtteranceBotResponses),
}) {}
export const UtteranceSpecifications = S.Array(UtteranceSpecification);
export class AnalyticsUtteranceResult extends S.Class<AnalyticsUtteranceResult>(
  "AnalyticsUtteranceResult",
)({
  binKeys: S.optional(AnalyticsBinKeys),
  groupByKeys: S.optional(AnalyticsUtteranceGroupByKeys),
  metricsResults: S.optional(AnalyticsUtteranceMetricResults),
  attributeResults: S.optional(AnalyticsUtteranceAttributeResults),
}) {}
export const AnalyticsUtteranceResults = S.Array(AnalyticsUtteranceResult);
export class CreateBotAliasRequest extends S.Class<CreateBotAliasRequest>(
  "CreateBotAliasRequest",
)(
  {
    botAliasName: S.String,
    description: S.optional(S.String),
    botVersion: S.optional(S.String),
    botAliasLocaleSettings: S.optional(BotAliasLocaleSettingsMap),
    conversationLogSettings: S.optional(ConversationLogSettings),
    sentimentAnalysisSettings: S.optional(SentimentAnalysisSettings),
    botId: S.String.pipe(T.HttpLabel()),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/bots/{botId}/botaliases" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateBotLocaleRequest extends S.Class<CreateBotLocaleRequest>(
  "CreateBotLocaleRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String,
    description: S.optional(S.String),
    nluIntentConfidenceThreshold: S.Number,
    voiceSettings: S.optional(VoiceSettings),
    unifiedSpeechSettings: S.optional(UnifiedSpeechSettings),
    speechRecognitionSettings: S.optional(SpeechRecognitionSettings),
    generativeAISettings: S.optional(GenerativeAISettings),
    speechDetectionSensitivity: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSlotRequest extends S.Class<CreateSlotRequest>(
  "CreateSlotRequest",
)(
  {
    slotName: S.String,
    description: S.optional(S.String),
    slotTypeId: S.optional(S.String),
    valueElicitationSetting: SlotValueElicitationSetting,
    obfuscationSetting: S.optional(ObfuscationSetting),
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    intentId: S.String.pipe(T.HttpLabel()),
    multipleValuesSetting: S.optional(MultipleValuesSetting),
    subSlotSetting: S.optional(SubSlotSetting),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents/{intentId}/slots",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSlotTypeResponse extends S.Class<CreateSlotTypeResponse>(
  "CreateSlotTypeResponse",
)({
  slotTypeId: S.optional(S.String),
  slotTypeName: S.optional(S.String),
  description: S.optional(S.String),
  slotTypeValues: S.optional(SlotTypeValues),
  valueSelectionSetting: S.optional(SlotValueSelectionSetting),
  parentSlotTypeSignature: S.optional(S.String),
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  externalSourceSetting: S.optional(ExternalSourceSetting),
  compositeSlotTypeSetting: S.optional(CompositeSlotTypeSetting),
}) {}
export class DescribeBotRecommendationResponse extends S.Class<DescribeBotRecommendationResponse>(
  "DescribeBotRecommendationResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  botRecommendationStatus: S.optional(S.String),
  botRecommendationId: S.optional(S.String),
  failureReasons: S.optional(FailureReasons),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  transcriptSourceSetting: S.optional(TranscriptSourceSetting),
  encryptionSetting: S.optional(EncryptionSetting),
  botRecommendationResults: S.optional(BotRecommendationResults),
}) {}
export class ListAggregatedUtterancesResponse extends S.Class<ListAggregatedUtterancesResponse>(
  "ListAggregatedUtterancesResponse",
)({
  botId: S.optional(S.String),
  botAliasId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  aggregationDuration: S.optional(UtteranceAggregationDuration),
  aggregationWindowStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  aggregationWindowEndTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  aggregationLastRefreshedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  aggregatedUtterancesSummaries: S.optional(AggregatedUtterancesSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListIntentMetricsResponse extends S.Class<ListIntentMetricsResponse>(
  "ListIntentMetricsResponse",
)({
  botId: S.optional(S.String),
  results: S.optional(AnalyticsIntentResults),
  nextToken: S.optional(S.String),
}) {}
export class ListIntentStageMetricsResponse extends S.Class<ListIntentStageMetricsResponse>(
  "ListIntentStageMetricsResponse",
)({
  botId: S.optional(S.String),
  results: S.optional(AnalyticsIntentStageResults),
  nextToken: S.optional(S.String),
}) {}
export class ListSessionAnalyticsDataResponse extends S.Class<ListSessionAnalyticsDataResponse>(
  "ListSessionAnalyticsDataResponse",
)({
  botId: S.optional(S.String),
  nextToken: S.optional(S.String),
  sessions: S.optional(SessionSpecifications),
}) {}
export class ListSessionMetricsResponse extends S.Class<ListSessionMetricsResponse>(
  "ListSessionMetricsResponse",
)({
  botId: S.optional(S.String),
  results: S.optional(AnalyticsSessionResults),
  nextToken: S.optional(S.String),
}) {}
export class ActiveContext extends S.Class<ActiveContext>("ActiveContext")({
  name: S.String,
}) {}
export const ActiveContextList = S.Array(ActiveContext);
export class ListUtteranceAnalyticsDataResponse extends S.Class<ListUtteranceAnalyticsDataResponse>(
  "ListUtteranceAnalyticsDataResponse",
)({
  botId: S.optional(S.String),
  nextToken: S.optional(S.String),
  utterances: S.optional(UtteranceSpecifications),
}) {}
export class ListUtteranceMetricsResponse extends S.Class<ListUtteranceMetricsResponse>(
  "ListUtteranceMetricsResponse",
)({
  botId: S.optional(S.String),
  results: S.optional(AnalyticsUtteranceResults),
  nextToken: S.optional(S.String),
}) {}
export class StartImportResponse extends S.Class<StartImportResponse>(
  "StartImportResponse",
)({
  importId: S.optional(S.String),
  resourceSpecification: S.optional(ImportResourceSpecification),
  mergeStrategy: S.optional(S.String),
  importStatus: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class StartTestSetGenerationResponse extends S.Class<StartTestSetGenerationResponse>(
  "StartTestSetGenerationResponse",
)({
  testSetGenerationId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  testSetGenerationStatus: S.optional(S.String),
  testSetName: S.optional(S.String),
  description: S.optional(S.String),
  storageLocation: S.optional(TestSetStorageLocation),
  generationDataSource: S.optional(TestSetGenerationDataSource),
  roleArn: S.optional(S.String),
  testSetTags: S.optional(TagMap),
}) {}
export class UtteranceAudioInputSpecification extends S.Class<UtteranceAudioInputSpecification>(
  "UtteranceAudioInputSpecification",
)({ audioFileS3Location: S.String }) {}
export type UserTurnSlotOutputList = UserTurnSlotOutput[];
export const UserTurnSlotOutputList = S.Array(
  S.suspend((): S.Schema<UserTurnSlotOutput, any> => UserTurnSlotOutput),
) as any as S.Schema<UserTurnSlotOutputList>;
export class CreateBotAliasResponse extends S.Class<CreateBotAliasResponse>(
  "CreateBotAliasResponse",
)({
  botAliasId: S.optional(S.String),
  botAliasName: S.optional(S.String),
  description: S.optional(S.String),
  botVersion: S.optional(S.String),
  botAliasLocaleSettings: S.optional(BotAliasLocaleSettingsMap),
  conversationLogSettings: S.optional(ConversationLogSettings),
  sentimentAnalysisSettings: S.optional(SentimentAnalysisSettings),
  botAliasStatus: S.optional(S.String),
  botId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagMap),
}) {}
export class CreateBotLocaleResponse extends S.Class<CreateBotLocaleResponse>(
  "CreateBotLocaleResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeName: S.optional(S.String),
  localeId: S.optional(S.String),
  description: S.optional(S.String),
  nluIntentConfidenceThreshold: S.optional(S.Number),
  voiceSettings: S.optional(VoiceSettings),
  unifiedSpeechSettings: S.optional(UnifiedSpeechSettings),
  speechRecognitionSettings: S.optional(SpeechRecognitionSettings),
  botLocaleStatus: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  generativeAISettings: S.optional(GenerativeAISettings),
  speechDetectionSensitivity: S.optional(S.String),
}) {}
export class CreateSlotResponse extends S.Class<CreateSlotResponse>(
  "CreateSlotResponse",
)({
  slotId: S.optional(S.String),
  slotName: S.optional(S.String),
  description: S.optional(S.String),
  slotTypeId: S.optional(S.String),
  valueElicitationSetting: S.optional(SlotValueElicitationSetting),
  obfuscationSetting: S.optional(ObfuscationSetting),
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  intentId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  multipleValuesSetting: S.optional(MultipleValuesSetting),
  subSlotSetting: S.optional(SubSlotSetting),
}) {}
export class UtteranceInputSpecification extends S.Class<UtteranceInputSpecification>(
  "UtteranceInputSpecification",
)({
  textInput: S.optional(S.String),
  audioInput: S.optional(UtteranceAudioInputSpecification),
}) {}
export class StartBotRecommendationRequest extends S.Class<StartBotRecommendationRequest>(
  "StartBotRecommendationRequest",
)(
  {
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    transcriptSourceSetting: TranscriptSourceSetting,
    encryptionSetting: S.optional(EncryptionSetting),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/botrecommendations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UserTurnSlotOutput extends S.Class<UserTurnSlotOutput>(
  "UserTurnSlotOutput",
)({
  value: S.optional(S.String),
  values: S.optional(S.suspend(() => UserTurnSlotOutputList)),
  subSlots: S.optional(S.suspend(() => UserTurnSlotOutputMap)),
}) {}
export const TestResultMatchStatusCountMap = S.Record({
  key: S.String,
  value: S.Number,
});
export class ConversationLevelIntentClassificationResultItem extends S.Class<ConversationLevelIntentClassificationResultItem>(
  "ConversationLevelIntentClassificationResultItem",
)({ intentName: S.String, matchResult: S.String }) {}
export const ConversationLevelIntentClassificationResults = S.Array(
  ConversationLevelIntentClassificationResultItem,
);
export class ConversationLevelSlotResolutionResultItem extends S.Class<ConversationLevelSlotResolutionResultItem>(
  "ConversationLevelSlotResolutionResultItem",
)({ intentName: S.String, slotName: S.String, matchResult: S.String }) {}
export const ConversationLevelSlotResolutionResults = S.Array(
  ConversationLevelSlotResolutionResultItem,
);
export class IntentClassificationTestResultItemCounts extends S.Class<IntentClassificationTestResultItemCounts>(
  "IntentClassificationTestResultItemCounts",
)({
  totalResultCount: S.Number,
  speechTranscriptionResultCounts: S.optional(TestResultMatchStatusCountMap),
  intentMatchResultCounts: TestResultMatchStatusCountMap,
}) {}
export type UserTurnSlotOutputMap = { [key: string]: UserTurnSlotOutput };
export const UserTurnSlotOutputMap = S.Record({
  key: S.String,
  value: S.suspend((): S.Schema<UserTurnSlotOutput, any> => UserTurnSlotOutput),
}) as any as S.Schema<UserTurnSlotOutputMap>;
export class OverallTestResultItem extends S.Class<OverallTestResultItem>(
  "OverallTestResultItem",
)({
  multiTurnConversation: S.Boolean,
  totalResultCount: S.Number,
  speechTranscriptionResultCounts: S.optional(TestResultMatchStatusCountMap),
  endToEndResultCounts: TestResultMatchStatusCountMap,
}) {}
export const OverallTestResultItemList = S.Array(OverallTestResultItem);
export class ConversationLevelTestResultItem extends S.Class<ConversationLevelTestResultItem>(
  "ConversationLevelTestResultItem",
)({
  conversationId: S.String,
  endToEndResult: S.String,
  speechTranscriptionResult: S.optional(S.String),
  intentClassificationResults: ConversationLevelIntentClassificationResults,
  slotResolutionResults: ConversationLevelSlotResolutionResults,
}) {}
export const ConversationLevelTestResultItemList = S.Array(
  ConversationLevelTestResultItem,
);
export class IntentClassificationTestResultItem extends S.Class<IntentClassificationTestResultItem>(
  "IntentClassificationTestResultItem",
)({
  intentName: S.String,
  multiTurnConversation: S.Boolean,
  resultCounts: IntentClassificationTestResultItemCounts,
}) {}
export const IntentClassificationTestResultItemList = S.Array(
  IntentClassificationTestResultItem,
);
export class CreateIntentRequest extends S.Class<CreateIntentRequest>(
  "CreateIntentRequest",
)(
  {
    intentName: S.String,
    intentDisplayName: S.optional(S.String),
    description: S.optional(S.String),
    parentIntentSignature: S.optional(S.String),
    sampleUtterances: S.optional(SampleUtterancesList),
    dialogCodeHook: S.optional(DialogCodeHookSettings),
    fulfillmentCodeHook: S.optional(FulfillmentCodeHookSettings),
    intentConfirmationSetting: S.optional(IntentConfirmationSetting),
    intentClosingSetting: S.optional(IntentClosingSetting),
    inputContexts: S.optional(InputContextsList),
    outputContexts: S.optional(OutputContextsList),
    kendraConfiguration: S.optional(KendraConfiguration),
    botId: S.String.pipe(T.HttpLabel()),
    botVersion: S.String.pipe(T.HttpLabel()),
    localeId: S.String.pipe(T.HttpLabel()),
    initialResponseSetting: S.optional(InitialResponseSetting),
    qnAIntentConfiguration: S.optional(QnAIntentConfiguration),
    qInConnectIntentConfiguration: S.optional(QInConnectIntentConfiguration),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/bots/{botId}/botversions/{botVersion}/botlocales/{localeId}/intents",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SlotResolutionTestResultItemCounts extends S.Class<SlotResolutionTestResultItemCounts>(
  "SlotResolutionTestResultItemCounts",
)({
  totalResultCount: S.Number,
  speechTranscriptionResultCounts: S.optional(TestResultMatchStatusCountMap),
  slotMatchResultCounts: TestResultMatchStatusCountMap,
}) {}
export class UserTurnIntentOutput extends S.Class<UserTurnIntentOutput>(
  "UserTurnIntentOutput",
)({ name: S.String, slots: S.optional(UserTurnSlotOutputMap) }) {}
export class StartBotRecommendationResponse extends S.Class<StartBotRecommendationResponse>(
  "StartBotRecommendationResponse",
)({
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  botRecommendationStatus: S.optional(S.String),
  botRecommendationId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  transcriptSourceSetting: S.optional(TranscriptSourceSetting),
  encryptionSetting: S.optional(EncryptionSetting),
}) {}
export class OverallTestResults extends S.Class<OverallTestResults>(
  "OverallTestResults",
)({ items: OverallTestResultItemList }) {}
export class ConversationLevelTestResults extends S.Class<ConversationLevelTestResults>(
  "ConversationLevelTestResults",
)({ items: ConversationLevelTestResultItemList }) {}
export class IntentClassificationTestResults extends S.Class<IntentClassificationTestResults>(
  "IntentClassificationTestResults",
)({ items: IntentClassificationTestResultItemList }) {}
export class SlotResolutionTestResultItem extends S.Class<SlotResolutionTestResultItem>(
  "SlotResolutionTestResultItem",
)({ slotName: S.String, resultCounts: SlotResolutionTestResultItemCounts }) {}
export const SlotResolutionTestResultItems = S.Array(
  SlotResolutionTestResultItem,
);
export class UserTurnOutputSpecification extends S.Class<UserTurnOutputSpecification>(
  "UserTurnOutputSpecification",
)({
  intent: UserTurnIntentOutput,
  activeContexts: S.optional(ActiveContextList),
  transcript: S.optional(S.String),
}) {}
export class ExecutionErrorDetails extends S.Class<ExecutionErrorDetails>(
  "ExecutionErrorDetails",
)({ errorCode: S.String, errorMessage: S.String }) {}
export class ConversationLevelResultDetail extends S.Class<ConversationLevelResultDetail>(
  "ConversationLevelResultDetail",
)({
  endToEndResult: S.String,
  speechTranscriptionResult: S.optional(S.String),
}) {}
export class IntentLevelSlotResolutionTestResultItem extends S.Class<IntentLevelSlotResolutionTestResultItem>(
  "IntentLevelSlotResolutionTestResultItem",
)({
  intentName: S.String,
  multiTurnConversation: S.Boolean,
  slotResolutionResults: SlotResolutionTestResultItems,
}) {}
export const IntentLevelSlotResolutionTestResultItemList = S.Array(
  IntentLevelSlotResolutionTestResultItem,
);
export class CreateIntentResponse extends S.Class<CreateIntentResponse>(
  "CreateIntentResponse",
)({
  intentId: S.optional(S.String),
  intentName: S.optional(S.String),
  intentDisplayName: S.optional(S.String),
  description: S.optional(S.String),
  parentIntentSignature: S.optional(S.String),
  sampleUtterances: S.optional(SampleUtterancesList),
  dialogCodeHook: S.optional(DialogCodeHookSettings),
  fulfillmentCodeHook: S.optional(FulfillmentCodeHookSettings),
  intentConfirmationSetting: S.optional(IntentConfirmationSetting),
  intentClosingSetting: S.optional(IntentClosingSetting),
  inputContexts: S.optional(InputContextsList),
  outputContexts: S.optional(OutputContextsList),
  kendraConfiguration: S.optional(KendraConfiguration),
  botId: S.optional(S.String),
  botVersion: S.optional(S.String),
  localeId: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  initialResponseSetting: S.optional(InitialResponseSetting),
  qnAIntentConfiguration: S.optional(QnAIntentConfiguration),
  qInConnectIntentConfiguration: S.optional(QInConnectIntentConfiguration),
}) {}
export class AgentTurnResult extends S.Class<AgentTurnResult>(
  "AgentTurnResult",
)({
  expectedAgentPrompt: S.String,
  actualAgentPrompt: S.optional(S.String),
  errorDetails: S.optional(ExecutionErrorDetails),
  actualElicitedSlot: S.optional(S.String),
  actualIntent: S.optional(S.String),
}) {}
export type SlotHintsSlotMap = { [key: string]: RuntimeHintDetails };
export const SlotHintsSlotMap = S.Record({
  key: S.String,
  value: S.suspend((): S.Schema<RuntimeHintDetails, any> => RuntimeHintDetails),
}) as any as S.Schema<SlotHintsSlotMap>;
export const SlotHintsIntentMap = S.Record({
  key: S.String,
  value: S.suspend(() => SlotHintsSlotMap),
});
export class RuntimeHints extends S.Class<RuntimeHints>("RuntimeHints")({
  slotHints: S.optional(SlotHintsIntentMap),
}) {}
export class InputSessionStateSpecification extends S.Class<InputSessionStateSpecification>(
  "InputSessionStateSpecification",
)({
  sessionAttributes: S.optional(StringMap),
  activeContexts: S.optional(ActiveContextList),
  runtimeHints: S.optional(RuntimeHints),
}) {}
export class UserTurnInputSpecification extends S.Class<UserTurnInputSpecification>(
  "UserTurnInputSpecification",
)({
  utteranceInput: UtteranceInputSpecification,
  requestAttributes: S.optional(StringMap),
  sessionState: S.optional(InputSessionStateSpecification),
}) {}
export class UserTurnResult extends S.Class<UserTurnResult>("UserTurnResult")({
  input: UserTurnInputSpecification,
  expectedOutput: UserTurnOutputSpecification,
  actualOutput: S.optional(UserTurnOutputSpecification),
  errorDetails: S.optional(ExecutionErrorDetails),
  endToEndResult: S.optional(S.String),
  intentMatchResult: S.optional(S.String),
  slotMatchResult: S.optional(S.String),
  speechTranscriptionResult: S.optional(S.String),
  conversationLevelResult: S.optional(ConversationLevelResultDetail),
}) {}
export class RuntimeHintValue extends S.Class<RuntimeHintValue>(
  "RuntimeHintValue",
)({ phrase: S.String }) {}
export const RuntimeHintValuesList = S.Array(RuntimeHintValue);
export class IntentLevelSlotResolutionTestResults extends S.Class<IntentLevelSlotResolutionTestResults>(
  "IntentLevelSlotResolutionTestResults",
)({ items: IntentLevelSlotResolutionTestResultItemList }) {}
export class TestSetTurnResult extends S.Class<TestSetTurnResult>(
  "TestSetTurnResult",
)({ agent: S.optional(AgentTurnResult), user: S.optional(UserTurnResult) }) {}
export class RuntimeHintDetails extends S.Class<RuntimeHintDetails>(
  "RuntimeHintDetails",
)({
  runtimeHintValues: S.optional(RuntimeHintValuesList),
  subSlotHints: S.optional(S.suspend(() => SlotHintsSlotMap)),
}) {}
export class UtteranceLevelTestResultItem extends S.Class<UtteranceLevelTestResultItem>(
  "UtteranceLevelTestResultItem",
)({
  recordNumber: S.Number,
  conversationId: S.optional(S.String),
  turnResult: TestSetTurnResult,
}) {}
export const UtteranceLevelTestResultItemList = S.Array(
  UtteranceLevelTestResultItem,
);
export class UtteranceLevelTestResults extends S.Class<UtteranceLevelTestResults>(
  "UtteranceLevelTestResults",
)({ items: UtteranceLevelTestResultItemList }) {}
export class TestExecutionResultItems extends S.Class<TestExecutionResultItems>(
  "TestExecutionResultItems",
)({
  overallTestResults: S.optional(OverallTestResults),
  conversationLevelTestResults: S.optional(ConversationLevelTestResults),
  intentClassificationTestResults: S.optional(IntentClassificationTestResults),
  intentLevelSlotResolutionTestResults: S.optional(
    IntentLevelSlotResolutionTestResults,
  ),
  utteranceLevelTestResults: S.optional(UtteranceLevelTestResults),
}) {}
export class ListTestExecutionResultItemsResponse extends S.Class<ListTestExecutionResultItemsResponse>(
  "ListTestExecutionResultItemsResponse",
)({
  testExecutionResults: S.optional(TestExecutionResultItems),
  nextToken: S.optional(S.String),
}) {}
export class UserTurnSpecification extends S.Class<UserTurnSpecification>(
  "UserTurnSpecification",
)({
  input: UserTurnInputSpecification,
  expected: UserTurnOutputSpecification,
}) {}
export class TurnSpecification extends S.Class<TurnSpecification>(
  "TurnSpecification",
)({
  agentTurn: S.optional(AgentTurnSpecification),
  userTurn: S.optional(UserTurnSpecification),
}) {}
export class TestSetTurnRecord extends S.Class<TestSetTurnRecord>(
  "TestSetTurnRecord",
)({
  recordNumber: S.Number,
  conversationId: S.optional(S.String),
  turnNumber: S.optional(S.Number),
  turnSpecification: TurnSpecification,
}) {}
export const TestSetTurnRecordList = S.Array(TestSetTurnRecord);
export class ListTestSetRecordsResponse extends S.Class<ListTestSetRecordsResponse>(
  "ListTestSetRecordsResponse",
)({
  testSetRecords: S.optional(TestSetTurnRecordList),
  nextToken: S.optional(S.String),
}) {}

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class PreconditionFailedException extends S.TaggedError<PreconditionFailedException>()(
  "PreconditionFailedException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}

//# Operations
/**
 * Removes tags from a bot, bot alias, or bot channel.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Builds a bot, its intents, and its slot types into a specific
 * locale. A bot can be built into multiple locales. At runtime the locale
 * is used to choose a specific build of the bot.
 */
export const buildBotLocale = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BuildBotLocaleRequest,
  output: BuildBotLocaleResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Action to create a replication of the source bot in the secondary region.
 */
export const createBotReplica = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBotReplicaRequest,
  output: CreateBotReplicaResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new resource policy with the specified policy
 * statements.
 */
export const createResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateResourcePolicyRequest,
    output: CreateResourcePolicyResponse,
    errors: [
      InternalServerException,
      PreconditionFailedException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets a pre-signed S3 write URL that you use to upload the zip
 * archive when importing a bot or a bot locale.
 */
export const createUploadUrl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUploadUrlRequest,
  output: CreateUploadUrlResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes all versions of a bot, including the `Draft`
 * version. To delete a specific version, use the
 * `DeleteBotVersion` operation.
 *
 * When you delete a bot, all of the resources contained in the bot are
 * also deleted. Deleting a bot removes all locales, intents, slot, and
 * slot types defined for the bot.
 *
 * If a bot has an alias, the `DeleteBot` operation returns
 * a `ResourceInUseException` exception. If you want to delete
 * the bot and the alias, set the `skipResourceInUseCheck`
 * parameter to `true`.
 */
export const deleteBot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBotRequest,
  output: DeleteBotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified bot alias.
 */
export const deleteBotAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBotAliasRequest,
  output: DeleteBotAliasResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a locale from a bot.
 *
 * When you delete a locale, all intents, slots, and slot types defined
 * for the locale are also deleted.
 */
export const deleteBotLocale = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBotLocaleRequest,
  output: DeleteBotLocaleResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The action to delete the replicated bot in the secondary region.
 */
export const deleteBotReplica = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBotReplicaRequest,
  output: DeleteBotReplicaResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a specific version of a bot. To delete all versions of a bot,
 * use the DeleteBot operation.
 */
export const deleteBotVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBotVersionRequest,
  output: DeleteBotVersionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a custom vocabulary from the specified locale
 * in the specified bot.
 */
export const deleteCustomVocabulary = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCustomVocabularyRequest,
    output: DeleteCustomVocabularyResponse,
    errors: [
      ConflictException,
      InternalServerException,
      PreconditionFailedException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Removes a previous export and the associated files stored in an S3
 * bucket.
 */
export const deleteExport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteExportRequest,
  output: DeleteExportResponse,
  errors: [
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a previous import and the associated file stored in an S3
 * bucket.
 */
export const deleteImport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteImportRequest,
  output: DeleteImportResponse,
  errors: [
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the specified intent.
 *
 * Deleting an intent also deletes the slots associated with the
 * intent.
 */
export const deleteIntent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIntentRequest,
  output: DeleteIntentResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes an existing policy from a bot or bot alias. If the resource
 * doesn't have a policy attached, Amazon Lex returns an exception.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyRequest,
    output: DeleteResourcePolicyResponse,
    errors: [
      InternalServerException,
      PreconditionFailedException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes a policy statement from a resource policy. If you delete the
 * last statement from a policy, the policy is deleted. If you specify a
 * statement ID that doesn't exist in the policy, or if the bot or bot
 * alias doesn't have a policy attached, Amazon Lex returns an
 * exception.
 *
 * You need to add the `DeleteResourcePolicy` or `UpdateResourcePolicy`
 * action to the bot role in order to call the API.
 */
export const deleteResourcePolicyStatement =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteResourcePolicyStatementRequest,
    output: DeleteResourcePolicyStatementResponse,
    errors: [
      InternalServerException,
      PreconditionFailedException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes the specified slot from an intent.
 */
export const deleteSlot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSlotRequest,
  output: DeleteSlotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a slot type from a bot locale.
 *
 * If a slot is using the slot type, Amazon Lex throws a
 * `ResourceInUseException` exception. To avoid the
 * exception, set the `skipResourceInUseCheck` parameter to
 * `true`.
 */
export const deleteSlotType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSlotTypeRequest,
  output: DeleteSlotTypeResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The action to delete the selected test set.
 */
export const deleteTestSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTestSetRequest,
  output: DeleteTestSetResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes stored utterances.
 *
 * Amazon Lex stores the utterances that users send to your bot. Utterances
 * are stored for 15 days for use with the ListAggregatedUtterances operation, and
 * then stored indefinitely for use in improving the ability of your bot
 * to respond to user input..
 *
 * Use the `DeleteUtterances` operation to manually delete
 * utterances for a specific session. When you use the
 * `DeleteUtterances` operation, utterances stored for
 * improving your bot's ability to respond to user input are deleted
 * immediately. Utterances stored for use with the
 * `ListAggregatedUtterances` operation are deleted after 15
 * days.
 */
export const deleteUtterances = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUtterancesRequest,
  output: DeleteUtterancesResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Provides metadata information about a bot.
 */
export const describeBot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBotRequest,
  output: DescribeBotResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Monitors the bot replication status through the UI console.
 */
export const describeBotReplica = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBotReplicaRequest,
  output: DescribeBotReplicaResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a request to generate a bot through natural language description, made through
 * the `StartBotResource` API. Use the `generatedBotLocaleUrl`
 * to retrieve the Amazon S3 object containing the bot locale configuration. You can
 * then modify and import this configuration.
 */
export const describeBotResourceGeneration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeBotResourceGenerationRequest,
    output: DescribeBotResourceGenerationResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Provides metadata about a version of a bot.
 */
export const describeBotVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBotVersionRequest,
  output: DescribeBotVersionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides metadata information about a custom vocabulary.
 */
export const describeCustomVocabularyMetadata =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeCustomVocabularyMetadataRequest,
    output: DescribeCustomVocabularyMetadataResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Gets information about a specific export.
 */
export const describeExport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeExportRequest,
  output: DescribeExportResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a specific import.
 */
export const describeImport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeImportRequest,
  output: DescribeImportResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns metadata about an intent.
 */
export const describeIntent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeIntentRequest,
  output: DescribeIntentResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the resource policy and policy revision for a bot or bot
 * alias.
 */
export const describeResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeResourcePolicyRequest,
    output: DescribeResourcePolicyResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Gets metadata information about a slot.
 */
export const describeSlot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSlotRequest,
  output: DescribeSlotResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets metadata information about a slot type.
 */
export const describeSlotType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSlotTypeRequest,
  output: DescribeSlotTypeResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets metadata information about the test execution.
 */
export const describeTestExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTestExecutionRequest,
    output: DescribeTestExecutionResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets metadata information about the test set.
 */
export const describeTestSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTestSetRequest,
  output: DescribeTestSetResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets metadata information about the test set generation.
 */
export const describeTestSetGeneration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTestSetGenerationRequest,
    output: DescribeTestSetGenerationResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Generates sample utterances for an intent.
 */
export const generateBotElement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateBotElementRequest,
  output: GenerateBotElementResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The pre-signed Amazon S3 URL to download the test execution result artifacts.
 */
export const getTestExecutionArtifactsUrl =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetTestExecutionArtifactsUrlRequest,
    output: GetTestExecutionArtifactsUrlResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Paginated list of custom vocabulary items for a given bot locale's
 * custom vocabulary.
 */
export const listCustomVocabularyItems = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListCustomVocabularyItemsRequest,
    output: ListCustomVocabularyItemsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets a list of tags associated with a resource. Only bots, bot
 * aliases, and bot channels can have tags associated with them.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a request for the descriptive bot builder to generate a bot locale configuration
 * based on the prompt you provide it. After you make this call, use the `DescribeBotResourceGeneration`
 * operation to check on the status of the generation and for the `generatedBotLocaleUrl` when the
 * generation is complete. Use that value to retrieve the Amazon S3 object containing the bot locale configuration. You can
 * then modify and import this configuration.
 */
export const startBotResourceGeneration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartBotResourceGenerationRequest,
    output: StartBotResourceGenerationResponse,
    errors: [
      ConflictException,
      InternalServerException,
      PreconditionFailedException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Stop an already running Bot Recommendation request.
 */
export const stopBotRecommendation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopBotRecommendationRequest,
    output: StopBotRecommendationResponse,
    errors: [
      ConflictException,
      InternalServerException,
      PreconditionFailedException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Adds the specified tags to the specified resource. If a tag key
 * already exists, the existing value is replaced with the new
 * value.
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
 * Updates the configuration of an existing bot.
 */
export const updateBot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBotRequest,
  output: UpdateBotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of an existing bot alias.
 */
export const updateBotAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBotAliasRequest,
  output: UpdateBotAliasResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the settings that a bot has for a specific locale.
 */
export const updateBotLocale = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBotLocaleRequest,
  output: UpdateBotLocaleResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing bot recommendation request.
 */
export const updateBotRecommendation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateBotRecommendationRequest,
    output: UpdateBotRecommendationResponse,
    errors: [
      ConflictException,
      InternalServerException,
      PreconditionFailedException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the password used to protect an export zip archive.
 *
 * The password is not required. If you don't supply a password, Amazon Lex
 * generates a zip file that is not protected by a password. This is the
 * archive that is available at the pre-signed S3 URL provided by the
 * DescribeExport operation.
 */
export const updateExport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateExportRequest,
  output: UpdateExportResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Replaces the existing resource policy for a bot or bot alias with a
 * new one. If the policy doesn't exist, Amazon Lex returns an
 * exception.
 */
export const updateResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateResourcePolicyRequest,
    output: UpdateResourcePolicyResponse,
    errors: [
      InternalServerException,
      PreconditionFailedException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the settings for a slot.
 */
export const updateSlot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSlotRequest,
  output: UpdateSlotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of an existing slot type.
 */
export const updateSlotType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSlotTypeRequest,
  output: UpdateSlotTypeResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The action to update the test set.
 */
export const updateTestSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTestSetRequest,
  output: UpdateTestSetResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete a batch of custom vocabulary items for a given bot locale's
 * custom vocabulary.
 */
export const batchDeleteCustomVocabularyItem =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchDeleteCustomVocabularyItemRequest,
    output: BatchDeleteCustomVocabularyItemResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Update a batch of custom vocabulary items for a given bot locale's custom
 * vocabulary.
 */
export const batchUpdateCustomVocabularyItem =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchUpdateCustomVocabularyItemRequest,
    output: BatchUpdateCustomVocabularyItemResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates an Amazon Lex conversational bot.
 */
export const createBot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBotRequest,
  output: CreateBotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get information about a specific bot alias.
 */
export const describeBotAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBotAliasRequest,
  output: DescribeBotAliasResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes the settings that a bot has for a specific locale.
 */
export const describeBotLocale = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBotLocaleRequest,
  output: DescribeBotLocaleResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a list of aliases for the specified bot.
 */
export const listBotAliases = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBotAliasesRequest,
  output: ListBotAliasesResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The action to list the replicated bots created from the source bot alias.
 */
export const listBotAliasReplicas = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListBotAliasReplicasRequest,
    output: ListBotAliasReplicasResponse,
    errors: [
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Get a list of bot recommendations that meet the specified
 * criteria.
 */
export const listBotRecommendations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListBotRecommendationsRequest,
    output: ListBotRecommendationsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * The action to list the replicated bots.
 */
export const listBotReplicas = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBotReplicasRequest,
  output: ListBotReplicasResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a list of recommended intents provided by the bot
 * recommendation that you can use in your bot. Intents in the
 * response are ordered by relevance.
 */
export const listRecommendedIntents = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListRecommendedIntentsRequest,
    output: ListRecommendedIntentsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the settings for an intent.
 */
export const updateIntent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIntentRequest,
  output: UpdateIntentResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create a batch of custom vocabulary items for a given bot locale's
 * custom vocabulary.
 */
export const batchCreateCustomVocabularyItem =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchCreateCustomVocabularyItemRequest,
    output: BatchCreateCustomVocabularyItemResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates an immutable version of the bot. When you create the first
 * version of a bot, Amazon Lex sets the version number to 1. Subsequent bot versions increase
 * in an increment of 1. The version number will always represent the total number
 * of versions created of the bot, not the current number of versions. If a bot version
 * is deleted, that bot version number will not be reused.
 */
export const createBotVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBotVersionRequest,
  output: CreateBotVersionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a zip archive containing the contents of a bot or a bot
 * locale. The archive contains a directory structure that contains JSON
 * files that define the bot.
 *
 * You can create an archive that contains the complete definition of a
 * bot, or you can specify that the archive contain only the definition of
 * a single bot locale.
 *
 * For more information about exporting bots, and about the structure
 * of the export archive, see Importing and
 * exporting bots
 */
export const createExport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExportRequest,
  output: CreateExportResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds a new resource policy statement to a bot or bot alias. If a
 * resource policy exists, the statement is added to the current resource
 * policy. If a policy doesn't exist, a new policy is created.
 *
 * You can't create a resource policy statement that allows
 * cross-account access.
 *
 * You need to add the `CreateResourcePolicy` or `UpdateResourcePolicy`
 * action to the bot role in order to call the API.
 */
export const createResourcePolicyStatement =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateResourcePolicyStatementRequest,
    output: CreateResourcePolicyStatementResponse,
    errors: [
      ConflictException,
      InternalServerException,
      PreconditionFailedException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Create a report that describes the differences between the bot and the test set.
 */
export const createTestSetDiscrepancyReport =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateTestSetDiscrepancyReportRequest,
    output: CreateTestSetDiscrepancyReportResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Gets metadata information about the test set discrepancy report.
 */
export const describeTestSetDiscrepancyReport =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeTestSetDiscrepancyReportRequest,
    output: DescribeTestSetDiscrepancyReportResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Gets a list of locales for the specified bot.
 */
export const listBotLocales = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBotLocalesRequest,
  output: ListBotLocalesResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the generation requests made for a bot locale.
 */
export const listBotResourceGenerations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListBotResourceGenerationsRequest,
    output: ListBotResourceGenerationsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets a list of available bots.
 */
export const listBots = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBotsRequest,
  output: ListBotsResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Contains information about all the versions replication statuses applicable for Global Resiliency.
 */
export const listBotVersionReplicas = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListBotVersionReplicasRequest,
    output: ListBotVersionReplicasResponse,
    errors: [
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets information about all of the versions of a bot.
 *
 * The `ListBotVersions` operation returns a summary of each
 * version of a bot. For example, if a bot has three numbered versions,
 * the `ListBotVersions` operation returns for summaries, one
 * for each numbered version and one for the `DRAFT`
 * version.
 *
 * The `ListBotVersions` operation always returns at least
 * one version, the `DRAFT` version.
 */
export const listBotVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBotVersionsRequest,
  output: ListBotVersionsResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a list of built-in intents provided by Amazon Lex that you can use
 * in your bot.
 *
 * To use a built-in intent as a the base for your own intent, include
 * the built-in intent signature in the `parentIntentSignature`
 * parameter when you call the `CreateIntent` operation. For
 * more information, see CreateIntent.
 */
export const listBuiltInIntents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBuiltInIntentsRequest,
  output: ListBuiltInIntentsResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a list of built-in slot types that meet the specified
 * criteria.
 */
export const listBuiltInSlotTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListBuiltInSlotTypesRequest,
    output: ListBuiltInSlotTypesResponse,
    errors: [
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the exports for a bot, bot locale, or custom vocabulary.
 * Exports are kept in the list for 7 days.
 */
export const listExports = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListExportsRequest,
  output: ListExportsResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Lists the imports for a bot, bot locale, or custom vocabulary.
 * Imports are kept in the list for 7 days.
 */
export const listImports = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListImportsRequest,
  output: ListImportsResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Retrieves summary statistics for a path of intents that users take over sessions with your bot. The following fields are required:
 *
 * - `startDateTime` and `endDateTime` – Define a time range for which you want to retrieve results.
 *
 * - `intentPath` – Define an order of intents for which you want to retrieve metrics. Separate intents in the path with a forward slash. For example, populate the `intentPath` field with `/BookCar/BookHotel` to see details about how many times users invoked the `BookCar` and `BookHotel` intents in that order.
 *
 * Use the optional `filters` field to filter the results.
 */
export const listIntentPaths = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIntentPathsRequest,
  output: ListIntentPathsResponse,
  errors: [
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get a list of intents that meet the specified criteria.
 */
export const listIntents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIntentsRequest,
  output: ListIntentsResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a list of slots that match the specified criteria.
 */
export const listSlots = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSlotsRequest,
  output: ListSlotsResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a list of slot types that match the specified criteria.
 */
export const listSlotTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSlotTypesRequest,
  output: ListSlotTypesResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The list of test set executions.
 */
export const listTestExecutions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTestExecutionsRequest,
  output: ListTestExecutionsResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The list of the test sets
 */
export const listTestSets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTestSetsRequest,
  output: ListTestSetsResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Search for associated transcripts that meet the specified
 * criteria.
 */
export const searchAssociatedTranscripts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SearchAssociatedTranscriptsRequest,
    output: SearchAssociatedTranscriptsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * The action to start test set execution.
 */
export const startTestExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTestExecutionRequest,
  output: StartTestExecutionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a custom slot type
 *
 * To create a custom slot type, specify a name for the slot type and
 * a set of enumeration values, the values that a slot of this type can
 * assume.
 */
export const createSlotType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSlotTypeRequest,
  output: CreateSlotTypeResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides metadata information about a bot recommendation. This
 * information will enable you to get a description on the request inputs,
 * to download associated transcripts after processing is complete, and to
 * download intents and slot-types generated by the bot
 * recommendation.
 */
export const describeBotRecommendation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeBotRecommendationRequest,
    output: DescribeBotRecommendationResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Provides a list of utterances that users have sent to the
 * bot.
 *
 * Utterances are aggregated by the text of the utterance. For example,
 * all instances where customers used the phrase "I want to order pizza"
 * are aggregated into the same line in the response.
 *
 * You can see both detected utterances and missed utterances. A
 * detected utterance is where the bot properly recognized the utterance
 * and activated the associated intent. A missed utterance was not
 * recognized by the bot and didn't activate an intent.
 *
 * Utterances can be aggregated for a bot alias or for a bot version,
 * but not both at the same time.
 *
 * Utterances statistics are not generated under the following
 * conditions:
 *
 * - The `childDirected` field was set to true when the
 * bot was created.
 *
 * - You are using slot obfuscation with one or more slots.
 *
 * - You opted out of participating in improving Amazon Lex.
 */
export const listAggregatedUtterances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAggregatedUtterancesRequest,
    output: ListAggregatedUtterancesResponse,
    errors: [
      InternalServerException,
      PreconditionFailedException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves summary metrics for the intents in your bot. The following fields are required:
 *
 * - `metrics` – A list of AnalyticsIntentMetric objects. In each object, use the `name` field to specify the metric to calculate, the `statistic` field to specify whether to calculate the `Sum`, `Average`, or `Max` number, and the `order` field to specify whether to sort the results in `Ascending` or `Descending` order.
 *
 * - `startDateTime` and `endDateTime` – Define a time range for which you want to retrieve results.
 *
 * Of the optional fields, you can organize the results in the following ways:
 *
 * - Use the `filters` field to filter the results, the `groupBy` field to specify categories by which to group the results, and the `binBy` field to specify time intervals by which to group the results.
 *
 * - Use the `maxResults` field to limit the number of results to return in a single response and the `nextToken` field to return the next batch of results if the response does not return the full set of results.
 *
 * Note that an `order` field exists in both `binBy` and `metrics`. You can specify only one `order` in a given request.
 */
export const listIntentMetrics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIntentMetricsRequest,
  output: ListIntentMetricsResponse,
  errors: [
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves summary metrics for the stages within intents in your bot. The following fields are required:
 *
 * - `metrics` – A list of AnalyticsIntentStageMetric objects. In each object, use the `name` field to specify the metric to calculate, the `statistic` field to specify whether to calculate the `Sum`, `Average`, or `Max` number, and the `order` field to specify whether to sort the results in `Ascending` or `Descending` order.
 *
 * - `startDateTime` and `endDateTime` – Define a time range for which you want to retrieve results.
 *
 * Of the optional fields, you can organize the results in the following ways:
 *
 * - Use the `filters` field to filter the results, the `groupBy` field to specify categories by which to group the results, and the `binBy` field to specify time intervals by which to group the results.
 *
 * - Use the `maxResults` field to limit the number of results to return in a single response and the `nextToken` field to return the next batch of results if the response does not return the full set of results.
 *
 * Note that an `order` field exists in both `binBy` and `metrics`. You can only specify one `order` in a given request.
 */
export const listIntentStageMetrics = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListIntentStageMetricsRequest,
    output: ListIntentStageMetricsResponse,
    errors: [
      InternalServerException,
      PreconditionFailedException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves a list of metadata for individual user sessions with your bot. The `startDateTime` and `endDateTime` fields are required. These fields define a time range for which you want to retrieve results. Of the optional fields, you can organize the results in the following ways:
 *
 * - Use the `filters` field to filter the results and the `sortBy` field to specify the values by which to sort the results.
 *
 * - Use the `maxResults` field to limit the number of results to return in a single response and the `nextToken` field to return the next batch of results if the response does not return the full set of results.
 */
export const listSessionAnalyticsData = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSessionAnalyticsDataRequest,
    output: ListSessionAnalyticsDataResponse,
    errors: [
      InternalServerException,
      PreconditionFailedException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves summary metrics for the user sessions with your bot. The following fields are required:
 *
 * - `metrics` – A list of AnalyticsSessionMetric objects. In each object, use the `name` field to specify the metric to calculate, the `statistic` field to specify whether to calculate the `Sum`, `Average`, or `Max` number, and the `order` field to specify whether to sort the results in `Ascending` or `Descending` order.
 *
 * - `startDateTime` and `endDateTime` – Define a time range for which you want to retrieve results.
 *
 * Of the optional fields, you can organize the results in the following ways:
 *
 * - Use the `filters` field to filter the results, the `groupBy` field to specify categories by which to group the results, and the `binBy` field to specify time intervals by which to group the results.
 *
 * - Use the `maxResults` field to limit the number of results to return in a single response and the `nextToken` field to return the next batch of results if the response does not return the full set of results.
 *
 * Note that an `order` field exists in both `binBy` and `metrics`. Currently, you can specify it in either field, but not in both.
 */
export const listSessionMetrics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSessionMetricsRequest,
  output: ListSessionMetricsResponse,
  errors: [
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * To use this API operation, your IAM role must have permissions to
 * perform the ListAggregatedUtterances operation, which provides access to
 * utterance-related analytics. See Viewing utterance
 * statistics for the IAM policy to apply to the IAM role.
 *
 * Retrieves a list of metadata for individual user utterances to your bot. The following fields are required:
 *
 * - `startDateTime` and `endDateTime` – Define a time range for which you want to retrieve results.
 *
 * Of the optional fields, you can organize the results in the following ways:
 *
 * - Use the `filters` field to filter the results and the `sortBy` field to specify the values by which to sort the results.
 *
 * - Use the `maxResults` field to limit the number of results to return in a single response and the `nextToken` field to return the next batch of results if the response does not return the full set of results.
 */
export const listUtteranceAnalyticsData = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListUtteranceAnalyticsDataRequest,
    output: ListUtteranceAnalyticsDataResponse,
    errors: [
      InternalServerException,
      PreconditionFailedException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * To use this API operation, your IAM role must have permissions to
 * perform the ListAggregatedUtterances operation, which provides access to
 * utterance-related analytics. See Viewing utterance
 * statistics for the IAM policy to apply to the IAM role.
 *
 * Retrieves summary metrics for the utterances in your bot. The following fields are required:
 *
 * - `metrics` – A list of AnalyticsUtteranceMetric objects. In each object, use the `name` field to specify the metric to calculate, the `statistic` field to specify whether to calculate the `Sum`, `Average`, or `Max` number, and the `order` field to specify whether to sort the results in `Ascending` or `Descending` order.
 *
 * - `startDateTime` and `endDateTime` – Define a time range for which you want to retrieve results.
 *
 * Of the optional fields, you can organize the results in the following ways:
 *
 * - Use the `filters` field to filter the results, the `groupBy` field to specify categories by which to group the results, and the `binBy` field to specify time intervals by which to group the results.
 *
 * - Use the `maxResults` field to limit the number of results to return in a single response and the `nextToken` field to return the next batch of results if the response does not return the full set of results.
 *
 * Note that an `order` field exists in both `binBy` and `metrics`. Currently, you can specify it in either field, but not in both.
 */
export const listUtteranceMetrics = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListUtteranceMetricsRequest,
    output: ListUtteranceMetricsResponse,
    errors: [
      InternalServerException,
      PreconditionFailedException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Starts importing a bot, bot locale, or custom vocabulary from a zip
 * archive that you uploaded to an S3 bucket.
 */
export const startImport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartImportRequest,
  output: StartImportResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The action to start the generation of test set.
 */
export const startTestSetGeneration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartTestSetGenerationRequest,
    output: StartTestSetGenerationResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an alias for the specified version of a bot. Use an alias to
 * enable you to change the version of a bot without updating applications
 * that use the bot.
 *
 * For example, you can create an alias called "PROD" that your
 * applications use to call the Amazon Lex bot.
 */
export const createBotAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBotAliasRequest,
  output: CreateBotAliasResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a locale in the bot. The locale contains the intents and
 * slot types that the bot uses in conversations with users in the
 * specified language and locale. You must add a locale to a bot before
 * you can add intents and slot types to the bot.
 */
export const createBotLocale = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBotLocaleRequest,
  output: CreateBotLocaleResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a slot in an intent. A slot is a variable needed to fulfill
 * an intent. For example, an `OrderPizza` intent might need
 * slots for size, crust, and number of pizzas. For each slot, you define
 * one or more utterances that Amazon Lex uses to elicit a response from the
 * user.
 */
export const createSlot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSlotRequest,
  output: CreateSlotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Use this to provide your transcript data, and to start the bot
 * recommendation process.
 */
export const startBotRecommendation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartBotRecommendationRequest,
    output: StartBotRecommendationResponse,
    errors: [
      ConflictException,
      InternalServerException,
      PreconditionFailedException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an intent.
 *
 * To define the interaction between the user and your bot, you define
 * one or more intents. For example, for a pizza ordering bot you would
 * create an `OrderPizza` intent.
 *
 * When you create an intent, you must provide a name. You can
 * optionally provide the following:
 *
 * - Sample utterances. For example, "I want to order a pizza" and
 * "Can I order a pizza." You can't provide utterances for built-in
 * intents.
 *
 * - Information to be gathered. You specify slots for the
 * information that you bot requests from the user. You can specify
 * standard slot types, such as date and time, or custom slot types
 * for your application.
 *
 * - How the intent is fulfilled. You can provide a Lambda function
 * or configure the intent to return the intent information to your
 * client application. If you use a Lambda function, Amazon Lex invokes
 * the function when all of the intent information is
 * available.
 *
 * - A confirmation prompt to send to the user to confirm an
 * intent. For example, "Shall I order your pizza?"
 *
 * - A conclusion statement to send to the user after the intent is
 * fulfilled. For example, "I ordered your pizza."
 *
 * - A follow-up prompt that asks the user for additional activity.
 * For example, "Do you want a drink with your pizza?"
 */
export const createIntent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIntentRequest,
  output: CreateIntentResponse,
  errors: [
    ConflictException,
    InternalServerException,
    PreconditionFailedException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a list of test execution result items.
 */
export const listTestExecutionResultItems =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListTestExecutionResultItemsRequest,
    output: ListTestExecutionResultItemsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * The list of test set records.
 */
export const listTestSetRecords = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTestSetRecordsRequest,
  output: ListTestSetRecordsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));

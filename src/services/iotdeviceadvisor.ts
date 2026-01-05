import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "IotDeviceAdvisor",
  serviceShapeName: "IotSenateService",
});
const auth = T.AwsAuthSigv4({ name: "iotdeviceadvisor" });
const ver = T.ServiceVersion("2020-09-18");
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
                        url: "https://api.iotdeviceadvisor-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://api.iotdeviceadvisor-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://api.iotdeviceadvisor.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://api.iotdeviceadvisor.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export class DeleteSuiteDefinitionRequest extends S.Class<DeleteSuiteDefinitionRequest>(
  "DeleteSuiteDefinitionRequest",
)(
  { suiteDefinitionId: S.String.pipe(T.HttpLabel("suiteDefinitionId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/suiteDefinitions/{suiteDefinitionId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSuiteDefinitionResponse extends S.Class<DeleteSuiteDefinitionResponse>(
  "DeleteSuiteDefinitionResponse",
)({}) {}
export class GetEndpointRequest extends S.Class<GetEndpointRequest>(
  "GetEndpointRequest",
)(
  {
    thingArn: S.optional(S.String).pipe(T.HttpQuery("thingArn")),
    certificateArn: S.optional(S.String).pipe(T.HttpQuery("certificateArn")),
    deviceRoleArn: S.optional(S.String).pipe(T.HttpQuery("deviceRoleArn")),
    authenticationMethod: S.optional(S.String).pipe(
      T.HttpQuery("authenticationMethod"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/endpoint" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSuiteDefinitionRequest extends S.Class<GetSuiteDefinitionRequest>(
  "GetSuiteDefinitionRequest",
)(
  {
    suiteDefinitionId: S.String.pipe(T.HttpLabel("suiteDefinitionId")),
    suiteDefinitionVersion: S.optional(S.String).pipe(
      T.HttpQuery("suiteDefinitionVersion"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/suiteDefinitions/{suiteDefinitionId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSuiteRunRequest extends S.Class<GetSuiteRunRequest>(
  "GetSuiteRunRequest",
)(
  {
    suiteDefinitionId: S.String.pipe(T.HttpLabel("suiteDefinitionId")),
    suiteRunId: S.String.pipe(T.HttpLabel("suiteRunId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/suiteDefinitions/{suiteDefinitionId}/suiteRuns/{suiteRunId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSuiteRunReportRequest extends S.Class<GetSuiteRunReportRequest>(
  "GetSuiteRunReportRequest",
)(
  {
    suiteDefinitionId: S.String.pipe(T.HttpLabel("suiteDefinitionId")),
    suiteRunId: S.String.pipe(T.HttpLabel("suiteRunId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/suiteDefinitions/{suiteDefinitionId}/suiteRuns/{suiteRunId}/report",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSuiteDefinitionsRequest extends S.Class<ListSuiteDefinitionsRequest>(
  "ListSuiteDefinitionsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/suiteDefinitions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSuiteRunsRequest extends S.Class<ListSuiteRunsRequest>(
  "ListSuiteRunsRequest",
)(
  {
    suiteDefinitionId: S.optional(S.String).pipe(
      T.HttpQuery("suiteDefinitionId"),
    ),
    suiteDefinitionVersion: S.optional(S.String).pipe(
      T.HttpQuery("suiteDefinitionVersion"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/suiteRuns" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopSuiteRunRequest extends S.Class<StopSuiteRunRequest>(
  "StopSuiteRunRequest",
)(
  {
    suiteDefinitionId: S.String.pipe(T.HttpLabel("suiteDefinitionId")),
    suiteRunId: S.String.pipe(T.HttpLabel("suiteRunId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/suiteDefinitions/{suiteDefinitionId}/suiteRuns/{suiteRunId}/stop",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopSuiteRunResponse extends S.Class<StopSuiteRunResponse>(
  "StopSuiteRunResponse",
)({}) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export class DeviceUnderTest extends S.Class<DeviceUnderTest>(
  "DeviceUnderTest",
)({
  thingArn: S.optional(S.String),
  certificateArn: S.optional(S.String),
  deviceRoleArn: S.optional(S.String),
}) {}
export const DeviceUnderTestList = S.Array(DeviceUnderTest);
export class SuiteDefinitionConfiguration extends S.Class<SuiteDefinitionConfiguration>(
  "SuiteDefinitionConfiguration",
)({
  suiteDefinitionName: S.String,
  devices: S.optional(DeviceUnderTestList),
  intendedForQualification: S.optional(S.Boolean),
  isLongDurationTest: S.optional(S.Boolean),
  rootGroup: S.String,
  devicePermissionRoleArn: S.String,
  protocol: S.optional(S.String),
}) {}
export class UpdateSuiteDefinitionRequest extends S.Class<UpdateSuiteDefinitionRequest>(
  "UpdateSuiteDefinitionRequest",
)(
  {
    suiteDefinitionId: S.String.pipe(T.HttpLabel("suiteDefinitionId")),
    suiteDefinitionConfiguration: SuiteDefinitionConfiguration,
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/suiteDefinitions/{suiteDefinitionId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const SelectedTestList = S.Array(S.String);
export class SuiteRunConfiguration extends S.Class<SuiteRunConfiguration>(
  "SuiteRunConfiguration",
)({
  primaryDevice: DeviceUnderTest,
  selectedTestList: S.optional(SelectedTestList),
  parallelRun: S.optional(S.Boolean),
}) {}
export class GetEndpointResponse extends S.Class<GetEndpointResponse>(
  "GetEndpointResponse",
)({ endpoint: S.optional(S.String) }) {}
export class GetSuiteDefinitionResponse extends S.Class<GetSuiteDefinitionResponse>(
  "GetSuiteDefinitionResponse",
)({
  suiteDefinitionId: S.optional(S.String),
  suiteDefinitionArn: S.optional(S.String),
  suiteDefinitionVersion: S.optional(S.String),
  latestVersion: S.optional(S.String),
  suiteDefinitionConfiguration: S.optional(SuiteDefinitionConfiguration),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagMap),
}) {}
export class GetSuiteRunReportResponse extends S.Class<GetSuiteRunReportResponse>(
  "GetSuiteRunReportResponse",
)({ qualificationReportDownloadUrl: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class StartSuiteRunRequest extends S.Class<StartSuiteRunRequest>(
  "StartSuiteRunRequest",
)(
  {
    suiteDefinitionId: S.String.pipe(T.HttpLabel("suiteDefinitionId")),
    suiteDefinitionVersion: S.optional(S.String),
    suiteRunConfiguration: SuiteRunConfiguration,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/suiteDefinitions/{suiteDefinitionId}/suiteRuns",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSuiteDefinitionResponse extends S.Class<UpdateSuiteDefinitionResponse>(
  "UpdateSuiteDefinitionResponse",
)({
  suiteDefinitionId: S.optional(S.String),
  suiteDefinitionArn: S.optional(S.String),
  suiteDefinitionName: S.optional(S.String),
  suiteDefinitionVersion: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class SuiteDefinitionInformation extends S.Class<SuiteDefinitionInformation>(
  "SuiteDefinitionInformation",
)({
  suiteDefinitionId: S.optional(S.String),
  suiteDefinitionName: S.optional(S.String),
  defaultDevices: S.optional(DeviceUnderTestList),
  intendedForQualification: S.optional(S.Boolean),
  isLongDurationTest: S.optional(S.Boolean),
  protocol: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const SuiteDefinitionInformationList = S.Array(
  SuiteDefinitionInformation,
);
export class SuiteRunInformation extends S.Class<SuiteRunInformation>(
  "SuiteRunInformation",
)({
  suiteDefinitionId: S.optional(S.String),
  suiteDefinitionVersion: S.optional(S.String),
  suiteDefinitionName: S.optional(S.String),
  suiteRunId: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  passed: S.optional(S.Number),
  failed: S.optional(S.Number),
}) {}
export const SuiteRunsList = S.Array(SuiteRunInformation);
export class CreateSuiteDefinitionRequest extends S.Class<CreateSuiteDefinitionRequest>(
  "CreateSuiteDefinitionRequest",
)(
  {
    suiteDefinitionConfiguration: SuiteDefinitionConfiguration,
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/suiteDefinitions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSuiteDefinitionsResponse extends S.Class<ListSuiteDefinitionsResponse>(
  "ListSuiteDefinitionsResponse",
)({
  suiteDefinitionInformationList: S.optional(SuiteDefinitionInformationList),
  nextToken: S.optional(S.String),
}) {}
export class ListSuiteRunsResponse extends S.Class<ListSuiteRunsResponse>(
  "ListSuiteRunsResponse",
)({
  suiteRunsList: S.optional(SuiteRunsList),
  nextToken: S.optional(S.String),
}) {}
export class StartSuiteRunResponse extends S.Class<StartSuiteRunResponse>(
  "StartSuiteRunResponse",
)({
  suiteRunId: S.optional(S.String),
  suiteRunArn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endpoint: S.optional(S.String),
}) {}
export class CreateSuiteDefinitionResponse extends S.Class<CreateSuiteDefinitionResponse>(
  "CreateSuiteDefinitionResponse",
)({
  suiteDefinitionId: S.optional(S.String),
  suiteDefinitionArn: S.optional(S.String),
  suiteDefinitionName: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class TestCaseScenario extends S.Class<TestCaseScenario>(
  "TestCaseScenario",
)({
  testCaseScenarioId: S.optional(S.String),
  testCaseScenarioType: S.optional(S.String),
  status: S.optional(S.String),
  failure: S.optional(S.String),
  systemMessage: S.optional(S.String),
}) {}
export const TestCaseScenariosList = S.Array(TestCaseScenario);
export class TestCaseRun extends S.Class<TestCaseRun>("TestCaseRun")({
  testCaseRunId: S.optional(S.String),
  testCaseDefinitionId: S.optional(S.String),
  testCaseDefinitionName: S.optional(S.String),
  status: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  logUrl: S.optional(S.String),
  warnings: S.optional(S.String),
  failure: S.optional(S.String),
  testScenarios: S.optional(TestCaseScenariosList),
}) {}
export const TestCaseRuns = S.Array(TestCaseRun);
export class GroupResult extends S.Class<GroupResult>("GroupResult")({
  groupId: S.optional(S.String),
  groupName: S.optional(S.String),
  tests: S.optional(TestCaseRuns),
}) {}
export const GroupResultList = S.Array(GroupResult);
export class TestResult extends S.Class<TestResult>("TestResult")({
  groups: S.optional(GroupResultList),
}) {}
export class GetSuiteRunResponse extends S.Class<GetSuiteRunResponse>(
  "GetSuiteRunResponse",
)({
  suiteDefinitionId: S.optional(S.String),
  suiteDefinitionVersion: S.optional(S.String),
  suiteRunId: S.optional(S.String),
  suiteRunArn: S.optional(S.String),
  suiteRunConfiguration: S.optional(SuiteRunConfiguration),
  testResult: S.optional(TestResult),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  errorReason: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes a Device Advisor test suite.
 *
 * Requires permission to access the DeleteSuiteDefinition action.
 */
export const deleteSuiteDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSuiteDefinitionRequest,
    output: DeleteSuiteDefinitionResponse,
    errors: [InternalServerException, ValidationException],
  }),
);
/**
 * Gets information about an Device Advisor endpoint.
 */
export const getEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEndpointRequest,
  output: GetEndpointResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the Device Advisor test suites you have created.
 *
 * Requires permission to access the ListSuiteDefinitions action.
 */
export const listSuiteDefinitions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSuiteDefinitionsRequest,
    output: ListSuiteDefinitionsResponse,
    errors: [InternalServerException, ValidationException],
  }),
);
/**
 * Lists runs of the specified Device Advisor test suite. You can list all runs of the test
 * suite, or the runs of a specific version of the test suite.
 *
 * Requires permission to access the ListSuiteRuns action.
 */
export const listSuiteRuns = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSuiteRunsRequest,
  output: ListSuiteRunsResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Updates a Device Advisor test suite.
 *
 * Requires permission to access the UpdateSuiteDefinition action.
 */
export const updateSuiteDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSuiteDefinitionRequest,
    output: UpdateSuiteDefinitionResponse,
    errors: [InternalServerException, ValidationException],
  }),
);
/**
 * Gets information about a Device Advisor test suite.
 *
 * Requires permission to access the GetSuiteDefinition action.
 */
export const getSuiteDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSuiteDefinitionRequest,
  output: GetSuiteDefinitionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets a report download link for a successful Device Advisor qualifying test suite run.
 *
 * Requires permission to access the GetSuiteRunReport action.
 */
export const getSuiteRunReport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSuiteRunReportRequest,
  output: GetSuiteRunReportResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the tags attached to an IoT Device Advisor resource.
 *
 * Requires permission to access the ListTagsForResource action.
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
 * Stops a Device Advisor test suite run that is currently running.
 *
 * Requires permission to access the StopSuiteRun action.
 */
export const stopSuiteRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopSuiteRunRequest,
  output: StopSuiteRunResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds to and modifies existing tags of an IoT Device Advisor resource.
 *
 * Requires permission to access the TagResource action.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes tags from an IoT Device Advisor resource.
 *
 * Requires permission to access the UntagResource action.
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
 * Creates a Device Advisor test suite.
 *
 * Requires permission to access the CreateSuiteDefinition action.
 */
export const createSuiteDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSuiteDefinitionRequest,
    output: CreateSuiteDefinitionResponse,
    errors: [InternalServerException, ValidationException],
  }),
);
/**
 * Starts a Device Advisor test suite run.
 *
 * Requires permission to access the StartSuiteRun action.
 */
export const startSuiteRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSuiteRunRequest,
  output: StartSuiteRunResponse,
  errors: [ConflictException, InternalServerException, ValidationException],
}));
/**
 * Gets information about a Device Advisor test suite run.
 *
 * Requires permission to access the GetSuiteRun action.
 */
export const getSuiteRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSuiteRunRequest,
  output: GetSuiteRunResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "synthetics",
  serviceShapeName: "Synthetics",
});
const auth = T.AwsAuthSigv4({ name: "synthetics" });
const ver = T.ServiceVersion("2017-10-11");
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
                        url: "https://synthetics-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://synthetics-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://synthetics.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://synthetics.{Region}.{PartitionResult#dnsSuffix}",
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
export const ResourceList = S.Array(S.String);
export const DescribeCanariesNameFilter = S.Array(S.String);
export const DescribeCanariesLastRunNameFilter = S.Array(S.String);
export const BaseScreenshotIgnoreCoordinates = S.Array(S.String);
export class BaseScreenshot extends S.Class<BaseScreenshot>("BaseScreenshot")({
  ScreenshotName: S.String,
  IgnoreCoordinates: S.optional(BaseScreenshotIgnoreCoordinates),
}) {}
export const BaseScreenshots = S.Array(BaseScreenshot);
export class VisualReferenceInput extends S.Class<VisualReferenceInput>(
  "VisualReferenceInput",
)({
  BaseScreenshots: S.optional(BaseScreenshots),
  BaseCanaryRunId: S.String,
  BrowserType: S.optional(S.String),
}) {}
export const VisualReferences = S.Array(VisualReferenceInput);
export const TagKeyList = S.Array(S.String);
export class AssociateResourceRequest extends S.Class<AssociateResourceRequest>(
  "AssociateResourceRequest",
)(
  {
    GroupIdentifier: S.String.pipe(T.HttpLabel("GroupIdentifier")),
    ResourceArn: S.String,
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/group/{GroupIdentifier}/associate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateResourceResponse extends S.Class<AssociateResourceResponse>(
  "AssociateResourceResponse",
)({}) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateGroupRequest extends S.Class<CreateGroupRequest>(
  "CreateGroupRequest",
)(
  { Name: S.String, Tags: S.optional(TagMap) },
  T.all(
    T.Http({ method: "POST", uri: "/group" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCanaryRequest extends S.Class<DeleteCanaryRequest>(
  "DeleteCanaryRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    DeleteLambda: S.optional(S.Boolean).pipe(T.HttpQuery("deleteLambda")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/canary/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCanaryResponse extends S.Class<DeleteCanaryResponse>(
  "DeleteCanaryResponse",
)({}) {}
export class DeleteGroupRequest extends S.Class<DeleteGroupRequest>(
  "DeleteGroupRequest",
)(
  { GroupIdentifier: S.String.pipe(T.HttpLabel("GroupIdentifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/group/{GroupIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGroupResponse extends S.Class<DeleteGroupResponse>(
  "DeleteGroupResponse",
)({}) {}
export class DescribeCanariesRequest extends S.Class<DescribeCanariesRequest>(
  "DescribeCanariesRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Names: S.optional(DescribeCanariesNameFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/canaries" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeCanariesLastRunRequest extends S.Class<DescribeCanariesLastRunRequest>(
  "DescribeCanariesLastRunRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Names: S.optional(DescribeCanariesLastRunNameFilter),
    BrowserType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/canaries/last-run" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRuntimeVersionsRequest extends S.Class<DescribeRuntimeVersionsRequest>(
  "DescribeRuntimeVersionsRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(
    T.Http({ method: "POST", uri: "/runtime-versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateResourceRequest extends S.Class<DisassociateResourceRequest>(
  "DisassociateResourceRequest",
)(
  {
    GroupIdentifier: S.String.pipe(T.HttpLabel("GroupIdentifier")),
    ResourceArn: S.String,
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/group/{GroupIdentifier}/disassociate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateResourceResponse extends S.Class<DisassociateResourceResponse>(
  "DisassociateResourceResponse",
)({}) {}
export class GetCanaryRequest extends S.Class<GetCanaryRequest>(
  "GetCanaryRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    DryRunId: S.optional(S.String).pipe(T.HttpQuery("dryRunId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/canary/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCanaryRunsRequest extends S.Class<GetCanaryRunsRequest>(
  "GetCanaryRunsRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    DryRunId: S.optional(S.String),
    RunType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/canary/{Name}/runs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGroupRequest extends S.Class<GetGroupRequest>(
  "GetGroupRequest",
)(
  { GroupIdentifier: S.String.pipe(T.HttpLabel("GroupIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/group/{GroupIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssociatedGroupsRequest extends S.Class<ListAssociatedGroupsRequest>(
  "ListAssociatedGroupsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/resource/{ResourceArn}/groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGroupResourcesRequest extends S.Class<ListGroupResourcesRequest>(
  "ListGroupResourcesRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    GroupIdentifier: S.String.pipe(T.HttpLabel("GroupIdentifier")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/group/{GroupIdentifier}/resources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGroupsRequest extends S.Class<ListGroupsRequest>(
  "ListGroupsRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(
    T.Http({ method: "POST", uri: "/groups" }),
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
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartCanaryRequest extends S.Class<StartCanaryRequest>(
  "StartCanaryRequest",
)(
  { Name: S.String.pipe(T.HttpLabel("Name")) },
  T.all(
    T.Http({ method: "POST", uri: "/canary/{Name}/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartCanaryResponse extends S.Class<StartCanaryResponse>(
  "StartCanaryResponse",
)({}) {}
export class StopCanaryRequest extends S.Class<StopCanaryRequest>(
  "StopCanaryRequest",
)(
  { Name: S.String.pipe(T.HttpLabel("Name")) },
  T.all(
    T.Http({ method: "POST", uri: "/canary/{Name}/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopCanaryResponse extends S.Class<StopCanaryResponse>(
  "StopCanaryResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export const BlueprintTypes = S.Array(S.String);
export class Dependency extends S.Class<Dependency>("Dependency")({
  Type: S.optional(S.String),
  Reference: S.String,
}) {}
export const Dependencies = S.Array(Dependency);
export class CanaryCodeInput extends S.Class<CanaryCodeInput>(
  "CanaryCodeInput",
)({
  S3Bucket: S.optional(S.String),
  S3Key: S.optional(S.String),
  S3Version: S.optional(S.String),
  ZipFile: S.optional(T.Blob),
  Handler: S.optional(S.String),
  BlueprintTypes: S.optional(BlueprintTypes),
  Dependencies: S.optional(Dependencies),
}) {}
export class RetryConfigInput extends S.Class<RetryConfigInput>(
  "RetryConfigInput",
)({ MaxRetries: S.Number }) {}
export class CanaryScheduleInput extends S.Class<CanaryScheduleInput>(
  "CanaryScheduleInput",
)({
  Expression: S.String,
  DurationInSeconds: S.optional(S.Number),
  RetryConfig: S.optional(RetryConfigInput),
}) {}
export const EnvironmentVariablesMap = S.Record({
  key: S.String,
  value: S.String,
});
export class CanaryRunConfigInput extends S.Class<CanaryRunConfigInput>(
  "CanaryRunConfigInput",
)({
  TimeoutInSeconds: S.optional(S.Number),
  MemoryInMB: S.optional(S.Number),
  ActiveTracing: S.optional(S.Boolean),
  EnvironmentVariables: S.optional(EnvironmentVariablesMap),
  EphemeralStorage: S.optional(S.Number),
}) {}
export const SubnetIds = S.Array(S.String);
export const SecurityGroupIds = S.Array(S.String);
export class VpcConfigInput extends S.Class<VpcConfigInput>("VpcConfigInput")({
  SubnetIds: S.optional(SubnetIds),
  SecurityGroupIds: S.optional(SecurityGroupIds),
  Ipv6AllowedForDualStack: S.optional(S.Boolean),
}) {}
export class S3EncryptionConfig extends S.Class<S3EncryptionConfig>(
  "S3EncryptionConfig",
)({ EncryptionMode: S.optional(S.String), KmsKeyArn: S.optional(S.String) }) {}
export class ArtifactConfigInput extends S.Class<ArtifactConfigInput>(
  "ArtifactConfigInput",
)({ S3Encryption: S.optional(S3EncryptionConfig) }) {}
export class BrowserConfig extends S.Class<BrowserConfig>("BrowserConfig")({
  BrowserType: S.optional(S.String),
}) {}
export const BrowserConfigs = S.Array(BrowserConfig);
export class UpdateCanaryRequest extends S.Class<UpdateCanaryRequest>(
  "UpdateCanaryRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    Code: S.optional(CanaryCodeInput),
    ExecutionRoleArn: S.optional(S.String),
    RuntimeVersion: S.optional(S.String),
    Schedule: S.optional(CanaryScheduleInput),
    RunConfig: S.optional(CanaryRunConfigInput),
    SuccessRetentionPeriodInDays: S.optional(S.Number),
    FailureRetentionPeriodInDays: S.optional(S.Number),
    VpcConfig: S.optional(VpcConfigInput),
    VisualReference: S.optional(VisualReferenceInput),
    ArtifactS3Location: S.optional(S.String),
    ArtifactConfig: S.optional(ArtifactConfigInput),
    ProvisionedResourceCleanup: S.optional(S.String),
    DryRunId: S.optional(S.String),
    VisualReferences: S.optional(VisualReferences),
    BrowserConfigs: S.optional(BrowserConfigs),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/canary/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCanaryResponse extends S.Class<UpdateCanaryResponse>(
  "UpdateCanaryResponse",
)({}) {}
export const StringList = S.Array(S.String);
export class CanaryCodeOutput extends S.Class<CanaryCodeOutput>(
  "CanaryCodeOutput",
)({
  SourceLocationArn: S.optional(S.String),
  Handler: S.optional(S.String),
  BlueprintTypes: S.optional(BlueprintTypes),
  Dependencies: S.optional(Dependencies),
}) {}
export class RetryConfigOutput extends S.Class<RetryConfigOutput>(
  "RetryConfigOutput",
)({ MaxRetries: S.optional(S.Number) }) {}
export class CanaryScheduleOutput extends S.Class<CanaryScheduleOutput>(
  "CanaryScheduleOutput",
)({
  Expression: S.optional(S.String),
  DurationInSeconds: S.optional(S.Number),
  RetryConfig: S.optional(RetryConfigOutput),
}) {}
export class CanaryRunConfigOutput extends S.Class<CanaryRunConfigOutput>(
  "CanaryRunConfigOutput",
)({
  TimeoutInSeconds: S.optional(S.Number),
  MemoryInMB: S.optional(S.Number),
  ActiveTracing: S.optional(S.Boolean),
  EphemeralStorage: S.optional(S.Number),
}) {}
export class CanaryStatus extends S.Class<CanaryStatus>("CanaryStatus")({
  State: S.optional(S.String),
  StateReason: S.optional(S.String),
  StateReasonCode: S.optional(S.String),
}) {}
export class CanaryTimeline extends S.Class<CanaryTimeline>("CanaryTimeline")({
  Created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastStarted: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastStopped: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class VpcConfigOutput extends S.Class<VpcConfigOutput>(
  "VpcConfigOutput",
)({
  VpcId: S.optional(S.String),
  SubnetIds: S.optional(SubnetIds),
  SecurityGroupIds: S.optional(SecurityGroupIds),
  Ipv6AllowedForDualStack: S.optional(S.Boolean),
}) {}
export class VisualReferenceOutput extends S.Class<VisualReferenceOutput>(
  "VisualReferenceOutput",
)({
  BaseScreenshots: S.optional(BaseScreenshots),
  BaseCanaryRunId: S.optional(S.String),
  BrowserType: S.optional(S.String),
}) {}
export class EngineConfig extends S.Class<EngineConfig>("EngineConfig")({
  EngineArn: S.optional(S.String),
  BrowserType: S.optional(S.String),
}) {}
export const EngineConfigs = S.Array(EngineConfig);
export const VisualReferencesOutput = S.Array(VisualReferenceOutput);
export class ArtifactConfigOutput extends S.Class<ArtifactConfigOutput>(
  "ArtifactConfigOutput",
)({ S3Encryption: S.optional(S3EncryptionConfig) }) {}
export class DryRunConfigOutput extends S.Class<DryRunConfigOutput>(
  "DryRunConfigOutput",
)({
  DryRunId: S.optional(S.String),
  LastDryRunExecutionStatus: S.optional(S.String),
}) {}
export class Canary extends S.Class<Canary>("Canary")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Code: S.optional(CanaryCodeOutput),
  ExecutionRoleArn: S.optional(S.String),
  Schedule: S.optional(CanaryScheduleOutput),
  RunConfig: S.optional(CanaryRunConfigOutput),
  SuccessRetentionPeriodInDays: S.optional(S.Number),
  FailureRetentionPeriodInDays: S.optional(S.Number),
  Status: S.optional(CanaryStatus),
  Timeline: S.optional(CanaryTimeline),
  ArtifactS3Location: S.optional(S.String),
  EngineArn: S.optional(S.String),
  RuntimeVersion: S.optional(S.String),
  VpcConfig: S.optional(VpcConfigOutput),
  VisualReference: S.optional(VisualReferenceOutput),
  ProvisionedResourceCleanup: S.optional(S.String),
  BrowserConfigs: S.optional(BrowserConfigs),
  EngineConfigs: S.optional(EngineConfigs),
  VisualReferences: S.optional(VisualReferencesOutput),
  Tags: S.optional(TagMap),
  ArtifactConfig: S.optional(ArtifactConfigOutput),
  DryRunConfig: S.optional(DryRunConfigOutput),
}) {}
export class GetCanaryResponse extends S.Class<GetCanaryResponse>(
  "GetCanaryResponse",
)({ Canary: S.optional(Canary) }) {}
export class Group extends S.Class<Group>("Group")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  Tags: S.optional(TagMap),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetGroupResponse extends S.Class<GetGroupResponse>(
  "GetGroupResponse",
)({ Group: S.optional(Group) }) {}
export class ListGroupResourcesResponse extends S.Class<ListGroupResourcesResponse>(
  "ListGroupResourcesResponse",
)({ Resources: S.optional(StringList), NextToken: S.optional(S.String) }) {}
export class GroupSummary extends S.Class<GroupSummary>("GroupSummary")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
}) {}
export const GroupSummaryList = S.Array(GroupSummary);
export class ListGroupsResponse extends S.Class<ListGroupsResponse>(
  "ListGroupsResponse",
)({ Groups: S.optional(GroupSummaryList), NextToken: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagMap) }) {}
export class CanaryRunStatus extends S.Class<CanaryRunStatus>(
  "CanaryRunStatus",
)({
  State: S.optional(S.String),
  StateReason: S.optional(S.String),
  StateReasonCode: S.optional(S.String),
  TestResult: S.optional(S.String),
}) {}
export class CanaryRunTimeline extends S.Class<CanaryRunTimeline>(
  "CanaryRunTimeline",
)({
  Started: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Completed: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  MetricTimestampForRunAndRetries: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class CanaryDryRunConfigOutput extends S.Class<CanaryDryRunConfigOutput>(
  "CanaryDryRunConfigOutput",
)({ DryRunId: S.optional(S.String) }) {}
export class CanaryRun extends S.Class<CanaryRun>("CanaryRun")({
  Id: S.optional(S.String),
  ScheduledRunId: S.optional(S.String),
  RetryAttempt: S.optional(S.Number),
  Name: S.optional(S.String),
  Status: S.optional(CanaryRunStatus),
  Timeline: S.optional(CanaryRunTimeline),
  ArtifactS3Location: S.optional(S.String),
  DryRunConfig: S.optional(CanaryDryRunConfigOutput),
  BrowserType: S.optional(S.String),
}) {}
export class CanaryLastRun extends S.Class<CanaryLastRun>("CanaryLastRun")({
  CanaryName: S.optional(S.String),
  LastRun: S.optional(CanaryRun),
}) {}
export const CanariesLastRun = S.Array(CanaryLastRun);
export class RuntimeVersion extends S.Class<RuntimeVersion>("RuntimeVersion")({
  VersionName: S.optional(S.String),
  Description: S.optional(S.String),
  ReleaseDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeprecationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const RuntimeVersionList = S.Array(RuntimeVersion);
export class CreateCanaryRequest extends S.Class<CreateCanaryRequest>(
  "CreateCanaryRequest",
)(
  {
    Name: S.String,
    Code: CanaryCodeInput,
    ArtifactS3Location: S.String,
    ExecutionRoleArn: S.String,
    Schedule: CanaryScheduleInput,
    RunConfig: S.optional(CanaryRunConfigInput),
    SuccessRetentionPeriodInDays: S.optional(S.Number),
    FailureRetentionPeriodInDays: S.optional(S.Number),
    RuntimeVersion: S.String,
    VpcConfig: S.optional(VpcConfigInput),
    ResourcesToReplicateTags: S.optional(ResourceList),
    ProvisionedResourceCleanup: S.optional(S.String),
    BrowserConfigs: S.optional(BrowserConfigs),
    Tags: S.optional(TagMap),
    ArtifactConfig: S.optional(ArtifactConfigInput),
  },
  T.all(
    T.Http({ method: "POST", uri: "/canary" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGroupResponse extends S.Class<CreateGroupResponse>(
  "CreateGroupResponse",
)({ Group: S.optional(Group) }) {}
export class DescribeCanariesLastRunResponse extends S.Class<DescribeCanariesLastRunResponse>(
  "DescribeCanariesLastRunResponse",
)({
  CanariesLastRun: S.optional(CanariesLastRun),
  NextToken: S.optional(S.String),
}) {}
export class DescribeRuntimeVersionsResponse extends S.Class<DescribeRuntimeVersionsResponse>(
  "DescribeRuntimeVersionsResponse",
)({
  RuntimeVersions: S.optional(RuntimeVersionList),
  NextToken: S.optional(S.String),
}) {}
export class ListAssociatedGroupsResponse extends S.Class<ListAssociatedGroupsResponse>(
  "ListAssociatedGroupsResponse",
)({ Groups: S.optional(GroupSummaryList), NextToken: S.optional(S.String) }) {}
export class StartCanaryDryRunRequest extends S.Class<StartCanaryDryRunRequest>(
  "StartCanaryDryRunRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    Code: S.optional(CanaryCodeInput),
    RuntimeVersion: S.optional(S.String),
    RunConfig: S.optional(CanaryRunConfigInput),
    VpcConfig: S.optional(VpcConfigInput),
    ExecutionRoleArn: S.optional(S.String),
    SuccessRetentionPeriodInDays: S.optional(S.Number),
    FailureRetentionPeriodInDays: S.optional(S.Number),
    VisualReference: S.optional(VisualReferenceInput),
    ArtifactS3Location: S.optional(S.String),
    ArtifactConfig: S.optional(ArtifactConfigInput),
    ProvisionedResourceCleanup: S.optional(S.String),
    BrowserConfigs: S.optional(BrowserConfigs),
    VisualReferences: S.optional(VisualReferences),
  },
  T.all(
    T.Http({ method: "POST", uri: "/canary/{Name}/dry-run/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const CanaryRuns = S.Array(CanaryRun);
export class CreateCanaryResponse extends S.Class<CreateCanaryResponse>(
  "CreateCanaryResponse",
)({ Canary: S.optional(Canary) }) {}
export class GetCanaryRunsResponse extends S.Class<GetCanaryRunsResponse>(
  "GetCanaryRunsResponse",
)({ CanaryRuns: S.optional(CanaryRuns), NextToken: S.optional(S.String) }) {}
export class StartCanaryDryRunResponse extends S.Class<StartCanaryDryRunResponse>(
  "StartCanaryDryRunResponse",
)({ DryRunConfig: S.optional(DryRunConfigOutput) }) {}
export const Canaries = S.Array(Canary);
export class DescribeCanariesResponse extends S.Class<DescribeCanariesResponse>(
  "DescribeCanariesResponse",
)({ Canaries: S.optional(Canaries), NextToken: S.optional(S.String) }) {}

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String) },
) {}
export class RequestEntityTooLargeException extends S.TaggedError<RequestEntityTooLargeException>()(
  "RequestEntityTooLargeException",
  { Message: S.optional(S.String) },
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}

//# Operations
/**
 * Use this operation to see information from the most recent run of each canary that you have created.
 *
 * This operation supports resource-level authorization using an IAM policy and
 * the `Names` parameter. If you specify the `Names` parameter, the operation is successful only if you have authorization to view
 * all the canaries that you specify in your request. If you do not have permission to view any of
 * the canaries, the request fails with a 403 response.
 *
 * You are required to use the `Names` parameter if you are logged on to a user or role that has an
 * IAM policy that restricts which canaries that you are allowed to view. For more information,
 * see
 * Limiting a user to viewing specific canaries.
 */
export const describeCanariesLastRun = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeCanariesLastRunRequest,
    output: DescribeCanariesLastRunResponse,
    errors: [InternalServerException, ValidationException],
  }),
);
/**
 * Retrieves a list of runs for a specified canary.
 */
export const getCanaryRuns = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCanaryRunsRequest,
  output: GetCanaryRunsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Use this operation to start a dry run for a canary that has already been created
 */
export const startCanaryDryRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCanaryDryRunRequest,
  output: StartCanaryDryRunResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of a canary that has already been created.
 *
 * For multibrowser canaries, you can add or remove browsers by updating the browserConfig list in the update call. For example:
 *
 * - To add Firefox to a canary that currently uses Chrome, specify browserConfigs as [CHROME, FIREFOX]
 *
 * - To remove Firefox and keep only Chrome, specify browserConfigs as [CHROME]
 *
 * You can't use this operation to update the tags of an existing canary. To change the tags of an existing canary, use
 * TagResource.
 *
 * When you use the `dryRunId` field when updating a canary, the only other field you can provide is the `Schedule`. Adding any other field will thrown an exception.
 */
export const updateCanary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCanaryRequest,
  output: UpdateCanaryResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestEntityTooLargeException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of the groups that the specified canary is associated with. The canary
 * that you specify must be in the current Region.
 */
export const listAssociatedGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAssociatedGroupsRequest,
    output: ListAssociatedGroupsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Returns information about one group. Groups are a global resource, so you can use this operation from
 * any Region.
 */
export const getGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGroupRequest,
  output: GetGroupResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * This operation returns a list of the ARNs of the canaries that are associated with the specified group.
 */
export const listGroupResources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGroupResourcesRequest,
  output: ListGroupResourcesResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Permanently deletes the specified canary.
 *
 * If the canary's `ProvisionedResourceCleanup` field is set to `AUTOMATIC`
 * or you specify `DeleteLambda` in this operation as `true`, CloudWatch Synthetics also deletes
 * the Lambda functions and layers that are used by the canary.
 *
 * Other resources used and created by the canary are not automatically deleted.
 * After you delete a canary, you
 * should also delete the following:
 *
 * - The CloudWatch alarms created for this canary. These alarms have a name of
 * Synthetics-Alarm-*first-198-characters-of-canary-name*-*canaryId*-*alarm number*
 *
 * - Amazon S3 objects and buckets, such as the canary's artifact location.
 *
 * - IAM roles created for the canary. If they were created in the console, these roles
 * have the name
 * role/service-role/CloudWatchSyntheticsRole-*First-21-Characters-of-CanaryName*
 *
 * - CloudWatch Logs log groups created for the canary. These logs groups have the name
 * /aws/lambda/cwsyn-*First-21-Characters-of-CanaryName*
 *
 * Before you delete a canary, you might want to use `GetCanary` to display
 * the information about this canary. Make
 * note of the information returned by this operation so that you can delete these resources
 * after you delete the canary.
 */
export const deleteCanary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCanaryRequest,
  output: DeleteCanaryResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a group. The group doesn't need to be empty to be deleted. If there are canaries in the group,
 * they are not deleted when you delete the group.
 *
 * Groups are a global resource that appear in all Regions, but the request to delete a group
 * must be made from its home Region. You can find the home Region of a group within its ARN.
 */
export const deleteGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGroupRequest,
  output: DeleteGroupResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes a canary from a group. You must run this operation in the Region where the canary exists.
 */
export const disassociateResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateResourceRequest,
    output: DisassociateResourceResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Use this operation to run a canary that has already been created.
 * The frequency of the canary runs is determined by the value of the canary's `Schedule`. To see a canary's schedule,
 * use GetCanary.
 */
export const startCanary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCanaryRequest,
  output: StartCanaryResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Stops the canary to prevent all future runs. If the canary is currently running,the
 * run that is in progress completes on its own, publishes metrics, and uploads artifacts, but
 * it is not recorded in Synthetics as a completed run.
 *
 * You can use `StartCanary` to start it running again
 * with the canary’s current schedule at any point in the future.
 */
export const stopCanary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopCanaryRequest,
  output: StopCanaryResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Associates a canary with a group. Using groups can help you with
 * managing and automating your canaries, and you can also view aggregated run results and statistics
 * for all canaries in a group.
 *
 * You must run this operation in the Region where the canary exists.
 */
export const associateResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateResourceRequest,
  output: AssociateResourceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Returns a list of Synthetics canary runtime versions. For more information,
 * see
 * Canary Runtime Versions.
 */
export const describeRuntimeVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeRuntimeVersionsRequest,
    output: DescribeRuntimeVersionsResponse,
    errors: [InternalServerException, ValidationException],
  }),
);
/**
 * Retrieves complete information about one canary. You must specify
 * the name of the canary that you want. To get a list of canaries
 * and their names, use DescribeCanaries.
 */
export const getCanary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCanaryRequest,
  output: GetCanaryResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Returns a list of all groups in the account, displaying their names, unique IDs, and ARNs. The groups
 * from all Regions are returned.
 */
export const listGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGroupsRequest,
  output: ListGroupsResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Creates a group which you can use to associate canaries with each other, including cross-Region
 * canaries. Using groups can help you with
 * managing and automating your canaries, and you can also view aggregated run results and statistics
 * for all canaries in a group.
 *
 * Groups are global resources. When you create a group, it is replicated across Amazon Web Services Regions, and
 * you can view it and add canaries to it from any Region.
 * Although the group ARN format reflects the Region name where it was created, a group is not constrained to any Region.
 * This means that you can put canaries from multiple Regions into the same group, and then use
 * that group to view and manage all of those canaries in a single view.
 *
 * Groups are supported in all Regions except the Regions that are disabled by default. For more information
 * about these Regions, see Enabling a Region.
 *
 * Each group can contain as many as 10 canaries. You can have as many as 20 groups in your account. Any single canary
 * can be a member of up to 10 groups.
 */
export const createGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGroupRequest,
  output: CreateGroupResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a canary. Canaries are scripts that monitor your endpoints and APIs from the
 * outside-in. Canaries help you check the availability and latency of your web services and
 * troubleshoot anomalies by investigating load time data, screenshots of the UI, logs, and
 * metrics. You can set up a canary to run continuously or just once.
 *
 * Do not use `CreateCanary` to modify an existing canary. Use UpdateCanary instead.
 *
 * To create canaries, you must have the `CloudWatchSyntheticsFullAccess` policy.
 * If you are creating a new IAM role for the canary, you also need the
 * `iam:CreateRole`, `iam:CreatePolicy` and
 * `iam:AttachRolePolicy` permissions. For more information, see Necessary
 * Roles and Permissions.
 *
 * Do not include secrets or proprietary information in your canary names. The canary name
 * makes up part of the Amazon Resource Name (ARN) for the canary, and the ARN is included in
 * outbound calls over the internet. For more information, see Security
 * Considerations for Synthetics Canaries.
 */
export const createCanary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCanaryRequest,
  output: CreateCanaryResponse,
  errors: [
    InternalServerException,
    RequestEntityTooLargeException,
    ValidationException,
  ],
}));
/**
 * This operation returns a list of the canaries in your account, along with full details
 * about each canary.
 *
 * This operation supports resource-level authorization using an IAM policy and
 * the `Names` parameter. If you specify the `Names` parameter, the operation is successful only if you have authorization to view
 * all the canaries that you specify in your request. If you do not have permission to view any of
 * the canaries, the request fails with a 403 response.
 *
 * You are required to use the `Names` parameter if you are logged on to a user or role that has an
 * IAM policy that restricts which canaries that you are allowed to view. For more information,
 * see
 * Limiting a user to viewing specific canaries.
 */
export const describeCanaries = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCanariesRequest,
  output: DescribeCanariesResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified canary or group.
 *
 * Tags can help you organize and categorize your
 * resources. You can also use them to scope user permissions, by granting a user permission to access or change only resources with
 * certain tag values.
 *
 * Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters.
 *
 * You can use the `TagResource` action with a resource that already has tags. If you specify a new
 * tag key for the resource,
 * this tag is appended to the list of tags associated
 * with the resource. If you specify a tag key that is already associated with the resource, the new tag
 * value that you specify replaces
 * the previous value for that tag.
 *
 * You can associate as many as 50 tags with a canary or group.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes one or more tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Displays the tags associated with a canary or group.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));

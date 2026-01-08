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
  sdkId: "IotDeviceAdvisor",
  serviceShapeName: "IotSenateService",
});
const auth = T.AwsAuthSigv4({ name: "iotdeviceadvisor" });
const ver = T.ServiceVersion("2020-09-18");
const proto = T.AwsProtocolsRestJson1();
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
              `https://api.iotdeviceadvisor-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://api.iotdeviceadvisor-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://api.iotdeviceadvisor.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://api.iotdeviceadvisor.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ClientToken = string;
export type UUID = string;
export type AmazonResourceName = string;
export type SuiteDefinitionVersion = string;
export type MaxResults = number;
export type Token = string;
export type String128 = string;
export type SuiteDefinitionName = string;
export type RootGroup = string;
export type String256 = string;
export type Message = string;
export type Endpoint = string;
export type ErrorReason = string;
export type QualificationReportDownloadUrl = string;
export type SuiteRunResultCount = number;
export type GroupName = string;
export type TestCaseDefinitionName = string;
export type LogUrl = string;
export type Warnings = string;
export type Failure = string;
export type TestCaseScenarioId = string;
export type SystemMessage = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeleteSuiteDefinitionRequest {
  suiteDefinitionId: string;
}
export const DeleteSuiteDefinitionRequest = S.suspend(() =>
  S.Struct({
    suiteDefinitionId: S.String.pipe(T.HttpLabel("suiteDefinitionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/suiteDefinitions/{suiteDefinitionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSuiteDefinitionRequest",
}) as any as S.Schema<DeleteSuiteDefinitionRequest>;
export interface DeleteSuiteDefinitionResponse {}
export const DeleteSuiteDefinitionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSuiteDefinitionResponse",
}) as any as S.Schema<DeleteSuiteDefinitionResponse>;
export interface GetEndpointRequest {
  thingArn?: string;
  certificateArn?: string;
  deviceRoleArn?: string;
  authenticationMethod?: string;
}
export const GetEndpointRequest = S.suspend(() =>
  S.Struct({
    thingArn: S.optional(S.String).pipe(T.HttpQuery("thingArn")),
    certificateArn: S.optional(S.String).pipe(T.HttpQuery("certificateArn")),
    deviceRoleArn: S.optional(S.String).pipe(T.HttpQuery("deviceRoleArn")),
    authenticationMethod: S.optional(S.String).pipe(
      T.HttpQuery("authenticationMethod"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/endpoint" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEndpointRequest",
}) as any as S.Schema<GetEndpointRequest>;
export interface GetSuiteDefinitionRequest {
  suiteDefinitionId: string;
  suiteDefinitionVersion?: string;
}
export const GetSuiteDefinitionRequest = S.suspend(() =>
  S.Struct({
    suiteDefinitionId: S.String.pipe(T.HttpLabel("suiteDefinitionId")),
    suiteDefinitionVersion: S.optional(S.String).pipe(
      T.HttpQuery("suiteDefinitionVersion"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/suiteDefinitions/{suiteDefinitionId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSuiteDefinitionRequest",
}) as any as S.Schema<GetSuiteDefinitionRequest>;
export interface GetSuiteRunRequest {
  suiteDefinitionId: string;
  suiteRunId: string;
}
export const GetSuiteRunRequest = S.suspend(() =>
  S.Struct({
    suiteDefinitionId: S.String.pipe(T.HttpLabel("suiteDefinitionId")),
    suiteRunId: S.String.pipe(T.HttpLabel("suiteRunId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSuiteRunRequest",
}) as any as S.Schema<GetSuiteRunRequest>;
export interface GetSuiteRunReportRequest {
  suiteDefinitionId: string;
  suiteRunId: string;
}
export const GetSuiteRunReportRequest = S.suspend(() =>
  S.Struct({
    suiteDefinitionId: S.String.pipe(T.HttpLabel("suiteDefinitionId")),
    suiteRunId: S.String.pipe(T.HttpLabel("suiteRunId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSuiteRunReportRequest",
}) as any as S.Schema<GetSuiteRunReportRequest>;
export interface ListSuiteDefinitionsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListSuiteDefinitionsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/suiteDefinitions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSuiteDefinitionsRequest",
}) as any as S.Schema<ListSuiteDefinitionsRequest>;
export interface ListSuiteRunsRequest {
  suiteDefinitionId?: string;
  suiteDefinitionVersion?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListSuiteRunsRequest = S.suspend(() =>
  S.Struct({
    suiteDefinitionId: S.optional(S.String).pipe(
      T.HttpQuery("suiteDefinitionId"),
    ),
    suiteDefinitionVersion: S.optional(S.String).pipe(
      T.HttpQuery("suiteDefinitionVersion"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/suiteRuns" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSuiteRunsRequest",
}) as any as S.Schema<ListSuiteRunsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
export interface StopSuiteRunRequest {
  suiteDefinitionId: string;
  suiteRunId: string;
}
export const StopSuiteRunRequest = S.suspend(() =>
  S.Struct({
    suiteDefinitionId: S.String.pipe(T.HttpLabel("suiteDefinitionId")),
    suiteRunId: S.String.pipe(T.HttpLabel("suiteRunId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "StopSuiteRunRequest",
}) as any as S.Schema<StopSuiteRunRequest>;
export interface StopSuiteRunResponse {}
export const StopSuiteRunResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "StopSuiteRunResponse",
}) as any as S.Schema<StopSuiteRunResponse>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  resourceArn: string;
  tags: TagMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
  resourceArn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export interface DeviceUnderTest {
  thingArn?: string;
  certificateArn?: string;
  deviceRoleArn?: string;
}
export const DeviceUnderTest = S.suspend(() =>
  S.Struct({
    thingArn: S.optional(S.String),
    certificateArn: S.optional(S.String),
    deviceRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DeviceUnderTest",
}) as any as S.Schema<DeviceUnderTest>;
export type DeviceUnderTestList = DeviceUnderTest[];
export const DeviceUnderTestList = S.Array(DeviceUnderTest);
export interface SuiteDefinitionConfiguration {
  suiteDefinitionName: string;
  devices?: DeviceUnderTestList;
  intendedForQualification?: boolean;
  isLongDurationTest?: boolean;
  rootGroup: string;
  devicePermissionRoleArn: string;
  protocol?: string;
}
export const SuiteDefinitionConfiguration = S.suspend(() =>
  S.Struct({
    suiteDefinitionName: S.String,
    devices: S.optional(DeviceUnderTestList),
    intendedForQualification: S.optional(S.Boolean),
    isLongDurationTest: S.optional(S.Boolean),
    rootGroup: S.String,
    devicePermissionRoleArn: S.String,
    protocol: S.optional(S.String),
  }),
).annotations({
  identifier: "SuiteDefinitionConfiguration",
}) as any as S.Schema<SuiteDefinitionConfiguration>;
export interface UpdateSuiteDefinitionRequest {
  suiteDefinitionId: string;
  suiteDefinitionConfiguration: SuiteDefinitionConfiguration;
}
export const UpdateSuiteDefinitionRequest = S.suspend(() =>
  S.Struct({
    suiteDefinitionId: S.String.pipe(T.HttpLabel("suiteDefinitionId")),
    suiteDefinitionConfiguration: SuiteDefinitionConfiguration,
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/suiteDefinitions/{suiteDefinitionId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSuiteDefinitionRequest",
}) as any as S.Schema<UpdateSuiteDefinitionRequest>;
export type SelectedTestList = string[];
export const SelectedTestList = S.Array(S.String);
export interface SuiteRunConfiguration {
  primaryDevice: DeviceUnderTest;
  selectedTestList?: SelectedTestList;
  parallelRun?: boolean;
}
export const SuiteRunConfiguration = S.suspend(() =>
  S.Struct({
    primaryDevice: DeviceUnderTest,
    selectedTestList: S.optional(SelectedTestList),
    parallelRun: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SuiteRunConfiguration",
}) as any as S.Schema<SuiteRunConfiguration>;
export interface GetEndpointResponse {
  endpoint?: string;
}
export const GetEndpointResponse = S.suspend(() =>
  S.Struct({ endpoint: S.optional(S.String) }),
).annotations({
  identifier: "GetEndpointResponse",
}) as any as S.Schema<GetEndpointResponse>;
export interface GetSuiteDefinitionResponse {
  suiteDefinitionId?: string;
  suiteDefinitionArn?: string;
  suiteDefinitionVersion?: string;
  latestVersion?: string;
  suiteDefinitionConfiguration?: SuiteDefinitionConfiguration;
  createdAt?: Date;
  lastModifiedAt?: Date;
  tags?: TagMap;
}
export const GetSuiteDefinitionResponse = S.suspend(() =>
  S.Struct({
    suiteDefinitionId: S.optional(S.String),
    suiteDefinitionArn: S.optional(S.String),
    suiteDefinitionVersion: S.optional(S.String),
    latestVersion: S.optional(S.String),
    suiteDefinitionConfiguration: S.optional(SuiteDefinitionConfiguration),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetSuiteDefinitionResponse",
}) as any as S.Schema<GetSuiteDefinitionResponse>;
export interface GetSuiteRunReportResponse {
  qualificationReportDownloadUrl?: string;
}
export const GetSuiteRunReportResponse = S.suspend(() =>
  S.Struct({ qualificationReportDownloadUrl: S.optional(S.String) }),
).annotations({
  identifier: "GetSuiteRunReportResponse",
}) as any as S.Schema<GetSuiteRunReportResponse>;
export interface ListTagsForResourceResponse {
  tags?: TagMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface StartSuiteRunRequest {
  suiteDefinitionId: string;
  suiteDefinitionVersion?: string;
  suiteRunConfiguration: SuiteRunConfiguration;
  tags?: TagMap;
}
export const StartSuiteRunRequest = S.suspend(() =>
  S.Struct({
    suiteDefinitionId: S.String.pipe(T.HttpLabel("suiteDefinitionId")),
    suiteDefinitionVersion: S.optional(S.String),
    suiteRunConfiguration: SuiteRunConfiguration,
    tags: S.optional(TagMap),
  }).pipe(
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
  ),
).annotations({
  identifier: "StartSuiteRunRequest",
}) as any as S.Schema<StartSuiteRunRequest>;
export interface UpdateSuiteDefinitionResponse {
  suiteDefinitionId?: string;
  suiteDefinitionArn?: string;
  suiteDefinitionName?: string;
  suiteDefinitionVersion?: string;
  createdAt?: Date;
  lastUpdatedAt?: Date;
}
export const UpdateSuiteDefinitionResponse = S.suspend(() =>
  S.Struct({
    suiteDefinitionId: S.optional(S.String),
    suiteDefinitionArn: S.optional(S.String),
    suiteDefinitionName: S.optional(S.String),
    suiteDefinitionVersion: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "UpdateSuiteDefinitionResponse",
}) as any as S.Schema<UpdateSuiteDefinitionResponse>;
export interface SuiteDefinitionInformation {
  suiteDefinitionId?: string;
  suiteDefinitionName?: string;
  defaultDevices?: DeviceUnderTestList;
  intendedForQualification?: boolean;
  isLongDurationTest?: boolean;
  protocol?: string;
  createdAt?: Date;
}
export const SuiteDefinitionInformation = S.suspend(() =>
  S.Struct({
    suiteDefinitionId: S.optional(S.String),
    suiteDefinitionName: S.optional(S.String),
    defaultDevices: S.optional(DeviceUnderTestList),
    intendedForQualification: S.optional(S.Boolean),
    isLongDurationTest: S.optional(S.Boolean),
    protocol: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "SuiteDefinitionInformation",
}) as any as S.Schema<SuiteDefinitionInformation>;
export type SuiteDefinitionInformationList = SuiteDefinitionInformation[];
export const SuiteDefinitionInformationList = S.Array(
  SuiteDefinitionInformation,
);
export interface SuiteRunInformation {
  suiteDefinitionId?: string;
  suiteDefinitionVersion?: string;
  suiteDefinitionName?: string;
  suiteRunId?: string;
  createdAt?: Date;
  startedAt?: Date;
  endAt?: Date;
  status?: string;
  passed?: number;
  failed?: number;
}
export const SuiteRunInformation = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "SuiteRunInformation",
}) as any as S.Schema<SuiteRunInformation>;
export type SuiteRunsList = SuiteRunInformation[];
export const SuiteRunsList = S.Array(SuiteRunInformation);
export interface CreateSuiteDefinitionRequest {
  suiteDefinitionConfiguration: SuiteDefinitionConfiguration;
  tags?: TagMap;
  clientToken?: string;
}
export const CreateSuiteDefinitionRequest = S.suspend(() =>
  S.Struct({
    suiteDefinitionConfiguration: SuiteDefinitionConfiguration,
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/suiteDefinitions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSuiteDefinitionRequest",
}) as any as S.Schema<CreateSuiteDefinitionRequest>;
export interface ListSuiteDefinitionsResponse {
  suiteDefinitionInformationList?: SuiteDefinitionInformationList;
  nextToken?: string;
}
export const ListSuiteDefinitionsResponse = S.suspend(() =>
  S.Struct({
    suiteDefinitionInformationList: S.optional(SuiteDefinitionInformationList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSuiteDefinitionsResponse",
}) as any as S.Schema<ListSuiteDefinitionsResponse>;
export interface ListSuiteRunsResponse {
  suiteRunsList?: SuiteRunsList;
  nextToken?: string;
}
export const ListSuiteRunsResponse = S.suspend(() =>
  S.Struct({
    suiteRunsList: S.optional(SuiteRunsList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSuiteRunsResponse",
}) as any as S.Schema<ListSuiteRunsResponse>;
export interface StartSuiteRunResponse {
  suiteRunId?: string;
  suiteRunArn?: string;
  createdAt?: Date;
  endpoint?: string;
}
export const StartSuiteRunResponse = S.suspend(() =>
  S.Struct({
    suiteRunId: S.optional(S.String),
    suiteRunArn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endpoint: S.optional(S.String),
  }),
).annotations({
  identifier: "StartSuiteRunResponse",
}) as any as S.Schema<StartSuiteRunResponse>;
export interface CreateSuiteDefinitionResponse {
  suiteDefinitionId?: string;
  suiteDefinitionArn?: string;
  suiteDefinitionName?: string;
  createdAt?: Date;
}
export const CreateSuiteDefinitionResponse = S.suspend(() =>
  S.Struct({
    suiteDefinitionId: S.optional(S.String),
    suiteDefinitionArn: S.optional(S.String),
    suiteDefinitionName: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CreateSuiteDefinitionResponse",
}) as any as S.Schema<CreateSuiteDefinitionResponse>;
export interface TestCaseScenario {
  testCaseScenarioId?: string;
  testCaseScenarioType?: string;
  status?: string;
  failure?: string;
  systemMessage?: string;
}
export const TestCaseScenario = S.suspend(() =>
  S.Struct({
    testCaseScenarioId: S.optional(S.String),
    testCaseScenarioType: S.optional(S.String),
    status: S.optional(S.String),
    failure: S.optional(S.String),
    systemMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "TestCaseScenario",
}) as any as S.Schema<TestCaseScenario>;
export type TestCaseScenariosList = TestCaseScenario[];
export const TestCaseScenariosList = S.Array(TestCaseScenario);
export interface TestCaseRun {
  testCaseRunId?: string;
  testCaseDefinitionId?: string;
  testCaseDefinitionName?: string;
  status?: string;
  startTime?: Date;
  endTime?: Date;
  logUrl?: string;
  warnings?: string;
  failure?: string;
  testScenarios?: TestCaseScenariosList;
}
export const TestCaseRun = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "TestCaseRun" }) as any as S.Schema<TestCaseRun>;
export type TestCaseRuns = TestCaseRun[];
export const TestCaseRuns = S.Array(TestCaseRun);
export interface GroupResult {
  groupId?: string;
  groupName?: string;
  tests?: TestCaseRuns;
}
export const GroupResult = S.suspend(() =>
  S.Struct({
    groupId: S.optional(S.String),
    groupName: S.optional(S.String),
    tests: S.optional(TestCaseRuns),
  }),
).annotations({ identifier: "GroupResult" }) as any as S.Schema<GroupResult>;
export type GroupResultList = GroupResult[];
export const GroupResultList = S.Array(GroupResult);
export interface TestResult {
  groups?: GroupResultList;
}
export const TestResult = S.suspend(() =>
  S.Struct({ groups: S.optional(GroupResultList) }),
).annotations({ identifier: "TestResult" }) as any as S.Schema<TestResult>;
export interface GetSuiteRunResponse {
  suiteDefinitionId?: string;
  suiteDefinitionVersion?: string;
  suiteRunId?: string;
  suiteRunArn?: string;
  suiteRunConfiguration?: SuiteRunConfiguration;
  testResult?: TestResult;
  startTime?: Date;
  endTime?: Date;
  status?: string;
  errorReason?: string;
  tags?: TagMap;
}
export const GetSuiteRunResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetSuiteRunResponse",
}) as any as S.Schema<GetSuiteRunResponse>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes a Device Advisor test suite.
 *
 * Requires permission to access the DeleteSuiteDefinition action.
 */
export const deleteSuiteDefinition: (
  input: DeleteSuiteDefinitionRequest,
) => Effect.Effect<
  DeleteSuiteDefinitionResponse,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSuiteDefinitionRequest,
  output: DeleteSuiteDefinitionResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Gets information about an Device Advisor endpoint.
 */
export const getEndpoint: (
  input: GetEndpointRequest,
) => Effect.Effect<
  GetEndpointResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listSuiteDefinitions: {
  (
    input: ListSuiteDefinitionsRequest,
  ): Effect.Effect<
    ListSuiteDefinitionsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSuiteDefinitionsRequest,
  ) => Stream.Stream<
    ListSuiteDefinitionsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSuiteDefinitionsRequest,
  ) => Stream.Stream<
    unknown,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSuiteDefinitionsRequest,
  output: ListSuiteDefinitionsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists runs of the specified Device Advisor test suite. You can list all runs of the test
 * suite, or the runs of a specific version of the test suite.
 *
 * Requires permission to access the ListSuiteRuns action.
 */
export const listSuiteRuns: {
  (
    input: ListSuiteRunsRequest,
  ): Effect.Effect<
    ListSuiteRunsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSuiteRunsRequest,
  ) => Stream.Stream<
    ListSuiteRunsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSuiteRunsRequest,
  ) => Stream.Stream<
    unknown,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSuiteRunsRequest,
  output: ListSuiteRunsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates a Device Advisor test suite.
 *
 * Requires permission to access the UpdateSuiteDefinition action.
 */
export const updateSuiteDefinition: (
  input: UpdateSuiteDefinitionRequest,
) => Effect.Effect<
  UpdateSuiteDefinitionResponse,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSuiteDefinitionRequest,
  output: UpdateSuiteDefinitionResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Gets information about a Device Advisor test suite.
 *
 * Requires permission to access the GetSuiteDefinition action.
 */
export const getSuiteDefinition: (
  input: GetSuiteDefinitionRequest,
) => Effect.Effect<
  GetSuiteDefinitionResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSuiteRunReport: (
  input: GetSuiteRunReportRequest,
) => Effect.Effect<
  GetSuiteRunReportResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Stops a Device Advisor test suite run that is currently running.
 *
 * Requires permission to access the StopSuiteRun action.
 */
export const stopSuiteRun: (
  input: StopSuiteRunRequest,
) => Effect.Effect<
  StopSuiteRunResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a Device Advisor test suite.
 *
 * Requires permission to access the CreateSuiteDefinition action.
 */
export const createSuiteDefinition: (
  input: CreateSuiteDefinitionRequest,
) => Effect.Effect<
  CreateSuiteDefinitionResponse,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSuiteDefinitionRequest,
  output: CreateSuiteDefinitionResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Starts a Device Advisor test suite run.
 *
 * Requires permission to access the StartSuiteRun action.
 */
export const startSuiteRun: (
  input: StartSuiteRunRequest,
) => Effect.Effect<
  StartSuiteRunResponse,
  | ConflictException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSuiteRunRequest,
  output: StartSuiteRunResponse,
  errors: [ConflictException, InternalServerException, ValidationException],
}));
/**
 * Gets information about a Device Advisor test suite run.
 *
 * Requires permission to access the GetSuiteRun action.
 */
export const getSuiteRun: (
  input: GetSuiteRunRequest,
) => Effect.Effect<
  GetSuiteRunResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSuiteRunRequest,
  output: GetSuiteRunResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));

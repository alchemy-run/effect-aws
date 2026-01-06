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
  sdkId: "ARC Zonal Shift",
  serviceShapeName: "PercDataPlane",
});
const auth = T.AwsAuthSigv4({ name: "arc-zonal-shift" });
const ver = T.ServiceVersion("2022-10-30");
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
                                url: "https://arc-zonal-shift-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://arc-zonal-shift-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://arc-zonal-shift.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://arc-zonal-shift.{Region}.{PartitionResult#dnsSuffix}",
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

//# Newtypes
export type MaxResults = number;
export type ResourceIdentifier = string;
export type BlockedWindow = string;
export type BlockedDate = string;
export type AllowedWindow = string;
export type ZonalShiftId = string;
export type ZonalShiftComment = string;
export type ExpiresIn = string;
export type AvailabilityZone = string;
export type MetricIdentifier = string;
export type ResourceArn = string;
export type ResourceName = string;
export type Weight = number;

//# Schemas
export interface GetAutoshiftObserverNotificationStatusRequest {}
export const GetAutoshiftObserverNotificationStatusRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/autoshift-observer-notification" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAutoshiftObserverNotificationStatusRequest",
}) as any as S.Schema<GetAutoshiftObserverNotificationStatusRequest>;
export type BlockedWindows = string[];
export const BlockedWindows = S.Array(S.String);
export type BlockedDates = string[];
export const BlockedDates = S.Array(S.String);
export type AllowedWindows = string[];
export const AllowedWindows = S.Array(S.String);
export interface ControlCondition {
  type: string;
  alarmIdentifier: string;
}
export const ControlCondition = S.suspend(() =>
  S.Struct({ type: S.String, alarmIdentifier: S.String }),
).annotations({
  identifier: "ControlCondition",
}) as any as S.Schema<ControlCondition>;
export type OutcomeAlarms = ControlCondition[];
export const OutcomeAlarms = S.Array(ControlCondition);
export interface ListAutoshiftsRequest {
  nextToken?: string;
  status?: string;
  maxResults?: number;
}
export const ListAutoshiftsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/autoshifts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAutoshiftsRequest",
}) as any as S.Schema<ListAutoshiftsRequest>;
export interface GetAutoshiftObserverNotificationStatusResponse {
  status: string;
}
export const GetAutoshiftObserverNotificationStatusResponse = S.suspend(() =>
  S.Struct({ status: S.String }),
).annotations({
  identifier: "GetAutoshiftObserverNotificationStatusResponse",
}) as any as S.Schema<GetAutoshiftObserverNotificationStatusResponse>;
export interface UpdateAutoshiftObserverNotificationStatusRequest {
  status: string;
}
export const UpdateAutoshiftObserverNotificationStatusRequest = S.suspend(() =>
  S.Struct({ status: S.String }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/autoshift-observer-notification" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAutoshiftObserverNotificationStatusRequest",
}) as any as S.Schema<UpdateAutoshiftObserverNotificationStatusRequest>;
export interface GetManagedResourceRequest {
  resourceIdentifier: string;
}
export const GetManagedResourceRequest = S.suspend(() =>
  S.Struct({
    resourceIdentifier: S.String.pipe(T.HttpLabel("resourceIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/managedresources/{resourceIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetManagedResourceRequest",
}) as any as S.Schema<GetManagedResourceRequest>;
export interface ListManagedResourcesRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListManagedResourcesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/managedresources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListManagedResourcesRequest",
}) as any as S.Schema<ListManagedResourcesRequest>;
export interface UpdateZonalAutoshiftConfigurationRequest {
  resourceIdentifier: string;
  zonalAutoshiftStatus: string;
}
export const UpdateZonalAutoshiftConfigurationRequest = S.suspend(() =>
  S.Struct({
    resourceIdentifier: S.String.pipe(T.HttpLabel("resourceIdentifier")),
    zonalAutoshiftStatus: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/managedresources/{resourceIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateZonalAutoshiftConfigurationRequest",
}) as any as S.Schema<UpdateZonalAutoshiftConfigurationRequest>;
export interface DeletePracticeRunConfigurationRequest {
  resourceIdentifier: string;
}
export const DeletePracticeRunConfigurationRequest = S.suspend(() =>
  S.Struct({
    resourceIdentifier: S.String.pipe(T.HttpLabel("resourceIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/configuration/{resourceIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePracticeRunConfigurationRequest",
}) as any as S.Schema<DeletePracticeRunConfigurationRequest>;
export type BlockingAlarms = ControlCondition[];
export const BlockingAlarms = S.Array(ControlCondition);
export interface CreatePracticeRunConfigurationRequest {
  resourceIdentifier: string;
  blockedWindows?: BlockedWindows;
  blockedDates?: BlockedDates;
  blockingAlarms?: BlockingAlarms;
  allowedWindows?: AllowedWindows;
  outcomeAlarms: OutcomeAlarms;
}
export const CreatePracticeRunConfigurationRequest = S.suspend(() =>
  S.Struct({
    resourceIdentifier: S.String,
    blockedWindows: S.optional(BlockedWindows),
    blockedDates: S.optional(BlockedDates),
    blockingAlarms: S.optional(BlockingAlarms),
    allowedWindows: S.optional(AllowedWindows),
    outcomeAlarms: OutcomeAlarms,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePracticeRunConfigurationRequest",
}) as any as S.Schema<CreatePracticeRunConfigurationRequest>;
export interface CancelPracticeRunRequest {
  zonalShiftId: string;
}
export const CancelPracticeRunRequest = S.suspend(() =>
  S.Struct({ zonalShiftId: S.String.pipe(T.HttpLabel("zonalShiftId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/practiceruns/{zonalShiftId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelPracticeRunRequest",
}) as any as S.Schema<CancelPracticeRunRequest>;
export interface CancelZonalShiftRequest {
  zonalShiftId: string;
}
export const CancelZonalShiftRequest = S.suspend(() =>
  S.Struct({ zonalShiftId: S.String.pipe(T.HttpLabel("zonalShiftId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/zonalshifts/{zonalShiftId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelZonalShiftRequest",
}) as any as S.Schema<CancelZonalShiftRequest>;
export interface UpdateZonalShiftRequest {
  zonalShiftId: string;
  comment?: string;
  expiresIn?: string;
}
export const UpdateZonalShiftRequest = S.suspend(() =>
  S.Struct({
    zonalShiftId: S.String.pipe(T.HttpLabel("zonalShiftId")),
    comment: S.optional(S.String),
    expiresIn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/zonalshifts/{zonalShiftId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateZonalShiftRequest",
}) as any as S.Schema<UpdateZonalShiftRequest>;
export interface ListZonalShiftsRequest {
  nextToken?: string;
  status?: string;
  maxResults?: number;
  resourceIdentifier?: string;
}
export const ListZonalShiftsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    resourceIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("resourceIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/zonalshifts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListZonalShiftsRequest",
}) as any as S.Schema<ListZonalShiftsRequest>;
export interface StartPracticeRunRequest {
  resourceIdentifier: string;
  awayFrom: string;
  comment: string;
}
export const StartPracticeRunRequest = S.suspend(() =>
  S.Struct({
    resourceIdentifier: S.String,
    awayFrom: S.String,
    comment: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/practiceruns" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartPracticeRunRequest",
}) as any as S.Schema<StartPracticeRunRequest>;
export interface StartZonalShiftRequest {
  resourceIdentifier: string;
  awayFrom: string;
  expiresIn: string;
  comment: string;
}
export const StartZonalShiftRequest = S.suspend(() =>
  S.Struct({
    resourceIdentifier: S.String,
    awayFrom: S.String,
    expiresIn: S.String,
    comment: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/zonalshifts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartZonalShiftRequest",
}) as any as S.Schema<StartZonalShiftRequest>;
export interface UpdateAutoshiftObserverNotificationStatusResponse {
  status: string;
}
export const UpdateAutoshiftObserverNotificationStatusResponse = S.suspend(() =>
  S.Struct({ status: S.String }),
).annotations({
  identifier: "UpdateAutoshiftObserverNotificationStatusResponse",
}) as any as S.Schema<UpdateAutoshiftObserverNotificationStatusResponse>;
export interface UpdateZonalAutoshiftConfigurationResponse {
  resourceIdentifier: string;
  zonalAutoshiftStatus: string;
}
export const UpdateZonalAutoshiftConfigurationResponse = S.suspend(() =>
  S.Struct({ resourceIdentifier: S.String, zonalAutoshiftStatus: S.String }),
).annotations({
  identifier: "UpdateZonalAutoshiftConfigurationResponse",
}) as any as S.Schema<UpdateZonalAutoshiftConfigurationResponse>;
export interface UpdatePracticeRunConfigurationRequest {
  resourceIdentifier: string;
  blockedWindows?: BlockedWindows;
  blockedDates?: BlockedDates;
  blockingAlarms?: BlockingAlarms;
  allowedWindows?: AllowedWindows;
  outcomeAlarms?: OutcomeAlarms;
}
export const UpdatePracticeRunConfigurationRequest = S.suspend(() =>
  S.Struct({
    resourceIdentifier: S.String.pipe(T.HttpLabel("resourceIdentifier")),
    blockedWindows: S.optional(BlockedWindows),
    blockedDates: S.optional(BlockedDates),
    blockingAlarms: S.optional(BlockingAlarms),
    allowedWindows: S.optional(AllowedWindows),
    outcomeAlarms: S.optional(OutcomeAlarms),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/configuration/{resourceIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePracticeRunConfigurationRequest",
}) as any as S.Schema<UpdatePracticeRunConfigurationRequest>;
export interface DeletePracticeRunConfigurationResponse {
  arn: string;
  name: string;
  zonalAutoshiftStatus: string;
}
export const DeletePracticeRunConfigurationResponse = S.suspend(() =>
  S.Struct({ arn: S.String, name: S.String, zonalAutoshiftStatus: S.String }),
).annotations({
  identifier: "DeletePracticeRunConfigurationResponse",
}) as any as S.Schema<DeletePracticeRunConfigurationResponse>;
export interface PracticeRunConfiguration {
  blockingAlarms?: BlockingAlarms;
  outcomeAlarms: OutcomeAlarms;
  blockedWindows?: BlockedWindows;
  allowedWindows?: AllowedWindows;
  blockedDates?: BlockedDates;
}
export const PracticeRunConfiguration = S.suspend(() =>
  S.Struct({
    blockingAlarms: S.optional(BlockingAlarms),
    outcomeAlarms: OutcomeAlarms,
    blockedWindows: S.optional(BlockedWindows),
    allowedWindows: S.optional(AllowedWindows),
    blockedDates: S.optional(BlockedDates),
  }),
).annotations({
  identifier: "PracticeRunConfiguration",
}) as any as S.Schema<PracticeRunConfiguration>;
export interface CreatePracticeRunConfigurationResponse {
  arn: string;
  name: string;
  zonalAutoshiftStatus: string;
  practiceRunConfiguration: PracticeRunConfiguration;
}
export const CreatePracticeRunConfigurationResponse = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    zonalAutoshiftStatus: S.String,
    practiceRunConfiguration: PracticeRunConfiguration,
  }),
).annotations({
  identifier: "CreatePracticeRunConfigurationResponse",
}) as any as S.Schema<CreatePracticeRunConfigurationResponse>;
export interface CancelPracticeRunResponse {
  zonalShiftId: string;
  resourceIdentifier: string;
  awayFrom: string;
  expiryTime: Date;
  startTime: Date;
  status: string;
  comment: string;
}
export const CancelPracticeRunResponse = S.suspend(() =>
  S.Struct({
    zonalShiftId: S.String,
    resourceIdentifier: S.String,
    awayFrom: S.String,
    expiryTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: S.String,
    comment: S.String,
  }),
).annotations({
  identifier: "CancelPracticeRunResponse",
}) as any as S.Schema<CancelPracticeRunResponse>;
export interface ZonalShift {
  zonalShiftId: string;
  resourceIdentifier: string;
  awayFrom: string;
  expiryTime: Date;
  startTime: Date;
  status: string;
  comment: string;
}
export const ZonalShift = S.suspend(() =>
  S.Struct({
    zonalShiftId: S.String,
    resourceIdentifier: S.String,
    awayFrom: S.String,
    expiryTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: S.String,
    comment: S.String,
  }),
).annotations({ identifier: "ZonalShift" }) as any as S.Schema<ZonalShift>;
export interface StartPracticeRunResponse {
  zonalShiftId: string;
  resourceIdentifier: string;
  awayFrom: string;
  expiryTime: Date;
  startTime: Date;
  status: string;
  comment: string;
}
export const StartPracticeRunResponse = S.suspend(() =>
  S.Struct({
    zonalShiftId: S.String,
    resourceIdentifier: S.String,
    awayFrom: S.String,
    expiryTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: S.String,
    comment: S.String,
  }),
).annotations({
  identifier: "StartPracticeRunResponse",
}) as any as S.Schema<StartPracticeRunResponse>;
export type AvailabilityZones = string[];
export const AvailabilityZones = S.Array(S.String);
export interface AutoshiftSummary {
  awayFrom: string;
  endTime?: Date;
  startTime: Date;
  status: string;
}
export const AutoshiftSummary = S.suspend(() =>
  S.Struct({
    awayFrom: S.String,
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: S.String,
  }),
).annotations({
  identifier: "AutoshiftSummary",
}) as any as S.Schema<AutoshiftSummary>;
export type AutoshiftSummaries = AutoshiftSummary[];
export const AutoshiftSummaries = S.Array(AutoshiftSummary);
export type AppliedWeights = { [key: string]: number };
export const AppliedWeights = S.Record({ key: S.String, value: S.Number });
export interface ZonalShiftInResource {
  appliedStatus: string;
  zonalShiftId: string;
  resourceIdentifier: string;
  awayFrom: string;
  expiryTime: Date;
  startTime: Date;
  comment: string;
  shiftType?: string;
  practiceRunOutcome?: string;
}
export const ZonalShiftInResource = S.suspend(() =>
  S.Struct({
    appliedStatus: S.String,
    zonalShiftId: S.String,
    resourceIdentifier: S.String,
    awayFrom: S.String,
    expiryTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    comment: S.String,
    shiftType: S.optional(S.String),
    practiceRunOutcome: S.optional(S.String),
  }),
).annotations({
  identifier: "ZonalShiftInResource",
}) as any as S.Schema<ZonalShiftInResource>;
export type ZonalShiftsInResource = ZonalShiftInResource[];
export const ZonalShiftsInResource = S.Array(ZonalShiftInResource);
export interface AutoshiftInResource {
  appliedStatus: string;
  awayFrom: string;
  startTime: Date;
}
export const AutoshiftInResource = S.suspend(() =>
  S.Struct({
    appliedStatus: S.String,
    awayFrom: S.String,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "AutoshiftInResource",
}) as any as S.Schema<AutoshiftInResource>;
export type AutoshiftsInResource = AutoshiftInResource[];
export const AutoshiftsInResource = S.Array(AutoshiftInResource);
export interface ManagedResourceSummary {
  arn?: string;
  name?: string;
  availabilityZones: AvailabilityZones;
  appliedWeights?: AppliedWeights;
  zonalShifts?: ZonalShiftsInResource;
  autoshifts?: AutoshiftsInResource;
  zonalAutoshiftStatus?: string;
  practiceRunStatus?: string;
}
export const ManagedResourceSummary = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    availabilityZones: AvailabilityZones,
    appliedWeights: S.optional(AppliedWeights),
    zonalShifts: S.optional(ZonalShiftsInResource),
    autoshifts: S.optional(AutoshiftsInResource),
    zonalAutoshiftStatus: S.optional(S.String),
    practiceRunStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "ManagedResourceSummary",
}) as any as S.Schema<ManagedResourceSummary>;
export type ManagedResourceSummaries = ManagedResourceSummary[];
export const ManagedResourceSummaries = S.Array(ManagedResourceSummary);
export interface ZonalShiftSummary {
  zonalShiftId: string;
  resourceIdentifier: string;
  awayFrom: string;
  expiryTime: Date;
  startTime: Date;
  status: string;
  comment: string;
  shiftType?: string;
  practiceRunOutcome?: string;
}
export const ZonalShiftSummary = S.suspend(() =>
  S.Struct({
    zonalShiftId: S.String,
    resourceIdentifier: S.String,
    awayFrom: S.String,
    expiryTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: S.String,
    comment: S.String,
    shiftType: S.optional(S.String),
    practiceRunOutcome: S.optional(S.String),
  }),
).annotations({
  identifier: "ZonalShiftSummary",
}) as any as S.Schema<ZonalShiftSummary>;
export type ZonalShiftSummaries = ZonalShiftSummary[];
export const ZonalShiftSummaries = S.Array(ZonalShiftSummary);
export interface ListAutoshiftsResponse {
  items?: AutoshiftSummaries;
  nextToken?: string;
}
export const ListAutoshiftsResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(AutoshiftSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAutoshiftsResponse",
}) as any as S.Schema<ListAutoshiftsResponse>;
export interface GetManagedResourceResponse {
  arn?: string;
  name?: string;
  appliedWeights: AppliedWeights;
  zonalShifts: ZonalShiftsInResource;
  autoshifts?: AutoshiftsInResource;
  practiceRunConfiguration?: PracticeRunConfiguration;
  zonalAutoshiftStatus?: string;
}
export const GetManagedResourceResponse = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    appliedWeights: AppliedWeights,
    zonalShifts: ZonalShiftsInResource,
    autoshifts: S.optional(AutoshiftsInResource),
    practiceRunConfiguration: S.optional(PracticeRunConfiguration),
    zonalAutoshiftStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "GetManagedResourceResponse",
}) as any as S.Schema<GetManagedResourceResponse>;
export interface ListManagedResourcesResponse {
  items: ManagedResourceSummaries;
  nextToken?: string;
}
export const ListManagedResourcesResponse = S.suspend(() =>
  S.Struct({
    items: ManagedResourceSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListManagedResourcesResponse",
}) as any as S.Schema<ListManagedResourcesResponse>;
export interface UpdatePracticeRunConfigurationResponse {
  arn: string;
  name: string;
  zonalAutoshiftStatus: string;
  practiceRunConfiguration: PracticeRunConfiguration;
}
export const UpdatePracticeRunConfigurationResponse = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    zonalAutoshiftStatus: S.String,
    practiceRunConfiguration: PracticeRunConfiguration,
  }),
).annotations({
  identifier: "UpdatePracticeRunConfigurationResponse",
}) as any as S.Schema<UpdatePracticeRunConfigurationResponse>;
export interface ListZonalShiftsResponse {
  items?: ZonalShiftSummaries;
  nextToken?: string;
}
export const ListZonalShiftsResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(ZonalShiftSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListZonalShiftsResponse",
}) as any as S.Schema<ListZonalShiftsResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, reason: S.String, zonalShiftId: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String, reason: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns the status of the autoshift observer notification. Autoshift observer notifications notify you through Amazon EventBridge when there is an autoshift event for zonal autoshift. The status can be `ENABLED` or `DISABLED`. When `ENABLED`, a notification is sent when an autoshift is triggered. When `DISABLED`, notifications are not sent.
 */
export const getAutoshiftObserverNotificationStatus: (
  input: GetAutoshiftObserverNotificationStatusRequest,
) => Effect.Effect<
  GetAutoshiftObserverNotificationStatusResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutoshiftObserverNotificationStatusRequest,
  output: GetAutoshiftObserverNotificationStatusResponse,
  errors: [AccessDeniedException, InternalServerException, ThrottlingException],
}));
/**
 * Get information about a resource that's been registered for zonal shifts with Amazon Application Recovery Controller in this Amazon Web Services Region. Resources that are registered for zonal shifts are managed resources in ARC. You can start zonal shifts and configure zonal autoshift for managed resources.
 */
export const getManagedResource: (
  input: GetManagedResourceRequest,
) => Effect.Effect<
  GetManagedResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetManagedResourceRequest,
  output: GetManagedResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all the resources in your Amazon Web Services account in this Amazon Web Services Region that are managed for zonal shifts in Amazon Application Recovery Controller, and information about them. The information includes the zonal autoshift status for the resource, as well as the Amazon Resource Name (ARN), the Availability Zones that each resource is deployed in, and the resource name.
 */
export const listManagedResources: {
  (
    input: ListManagedResourcesRequest,
  ): Effect.Effect<
    ListManagedResourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListManagedResourcesRequest,
  ) => Stream.Stream<
    ListManagedResourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListManagedResourcesRequest,
  ) => Stream.Stream<
    ManagedResourceSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListManagedResourcesRequest,
  output: ListManagedResourcesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all active and completed zonal shifts in Amazon Application Recovery Controller in your Amazon Web Services account in this Amazon Web Services Region. `ListZonalShifts` returns customer-initiated zonal shifts, as well as practice run zonal shifts that ARC started on your behalf for zonal autoshift.
 *
 * For more information about listing autoshifts, see ">ListAutoshifts.
 */
export const listZonalShifts: {
  (
    input: ListZonalShiftsRequest,
  ): Effect.Effect<
    ListZonalShiftsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListZonalShiftsRequest,
  ) => Stream.Stream<
    ListZonalShiftsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListZonalShiftsRequest,
  ) => Stream.Stream<
    ZonalShiftSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListZonalShiftsRequest,
  output: ListZonalShiftsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Update the status of autoshift observer notification. Autoshift observer notification enables you to be notified, through Amazon EventBridge, when there is an autoshift event for zonal autoshift.
 *
 * If the status is `ENABLED`, ARC includes all autoshift events when you use the EventBridge pattern `Autoshift In Progress`. When the status is `DISABLED`, ARC includes only autoshift events for autoshifts when one or more of your resources is included in the autoshift.
 *
 * For more information, see Notifications for practice runs and autoshifts in the Amazon Application Recovery Controller Developer Guide.
 */
export const updateAutoshiftObserverNotificationStatus: (
  input: UpdateAutoshiftObserverNotificationStatusRequest,
) => Effect.Effect<
  UpdateAutoshiftObserverNotificationStatusResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAutoshiftObserverNotificationStatusRequest,
  output: UpdateAutoshiftObserverNotificationStatusResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the autoshifts for an Amazon Web Services Region. By default, the call returns only `ACTIVE` autoshifts. Optionally, you can specify the `status` parameter to return `COMPLETED` autoshifts.
 */
export const listAutoshifts: {
  (
    input: ListAutoshiftsRequest,
  ): Effect.Effect<
    ListAutoshiftsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAutoshiftsRequest,
  ) => Stream.Stream<
    ListAutoshiftsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAutoshiftsRequest,
  ) => Stream.Stream<
    AutoshiftSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAutoshiftsRequest,
  output: ListAutoshiftsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * The zonal autoshift configuration for a resource includes the practice run configuration and the status for running autoshifts, zonal autoshift status. When a resource has a practice run configuration, ARC starts weekly zonal shifts for the resource, to shift traffic away from an Availability Zone. Weekly practice runs help you to make sure that your application can continue to operate normally with the loss of one Availability Zone.
 *
 * You can update the zonal autoshift status to enable or disable zonal autoshift. When zonal autoshift is `ENABLED`, you authorize Amazon Web Services to shift away resource traffic for an application from an Availability Zone during events, on your behalf, to help reduce time to recovery. Traffic is also shifted away for the required weekly practice runs.
 */
export const updateZonalAutoshiftConfiguration: (
  input: UpdateZonalAutoshiftConfigurationRequest,
) => Effect.Effect<
  UpdateZonalAutoshiftConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateZonalAutoshiftConfigurationRequest,
  output: UpdateZonalAutoshiftConfigurationResponse,
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
 * Update a practice run configuration to change one or more of the following: add, change, or remove the blocking alarm; change the outcome alarm; or add, change, or remove blocking dates or time windows.
 */
export const updatePracticeRunConfiguration: (
  input: UpdatePracticeRunConfigurationRequest,
) => Effect.Effect<
  UpdatePracticeRunConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePracticeRunConfigurationRequest,
  output: UpdatePracticeRunConfigurationResponse,
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
 * Deletes the practice run configuration for a resource. Before you can delete a practice run configuration for a resource., you must disable zonal autoshift for the resource. Practice runs must be configured for zonal autoshift to be enabled.
 */
export const deletePracticeRunConfiguration: (
  input: DeletePracticeRunConfigurationRequest,
) => Effect.Effect<
  DeletePracticeRunConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePracticeRunConfigurationRequest,
  output: DeletePracticeRunConfigurationResponse,
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
 * A practice run configuration for zonal autoshift is required when you enable zonal autoshift. A practice run configuration includes specifications for blocked dates and blocked time windows, and for Amazon CloudWatch alarms that you create to use with practice runs. The alarms that you specify are an *outcome alarm*, to monitor application health during practice runs and, optionally, a *blocking alarm*, to block practice runs from starting.
 *
 * When a resource has a practice run configuration, ARC starts zonal shifts for the resource weekly, to shift traffic for practice runs. Practice runs help you to ensure that shifting away traffic from an Availability Zone during an autoshift is safe for your application.
 *
 * For more information, see Considerations when you configure zonal autoshift in the Amazon Application Recovery Controller Developer Guide.
 */
export const createPracticeRunConfiguration: (
  input: CreatePracticeRunConfigurationRequest,
) => Effect.Effect<
  CreatePracticeRunConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePracticeRunConfigurationRequest,
  output: CreatePracticeRunConfigurationResponse,
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
 * Cancel an in-progress practice run zonal shift in Amazon Application Recovery Controller.
 */
export const cancelPracticeRun: (
  input: CancelPracticeRunRequest,
) => Effect.Effect<
  CancelPracticeRunResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelPracticeRunRequest,
  output: CancelPracticeRunResponse,
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
 * Cancel a zonal shift in Amazon Application Recovery Controller. To cancel the zonal shift, specify the zonal shift ID.
 *
 * A zonal shift can be one that you've started for a resource in your Amazon Web Services account in an Amazon Web Services Region, or it can be a zonal shift started by a practice run with zonal autoshift.
 */
export const cancelZonalShift: (
  input: CancelZonalShiftRequest,
) => Effect.Effect<
  ZonalShift,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelZonalShiftRequest,
  output: ZonalShift,
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
 * Start an on-demand practice run zonal shift in Amazon Application Recovery Controller. With zonal autoshift enabled, you can start an on-demand practice run to verify preparedness at any time. Amazon Web Services also runs automated practice runs about weekly when you have enabled zonal autoshift.
 *
 * For more information, see Considerations when you configure zonal autoshift in the Amazon Application Recovery Controller Developer Guide.
 */
export const startPracticeRun: (
  input: StartPracticeRunRequest,
) => Effect.Effect<
  StartPracticeRunResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartPracticeRunRequest,
  output: StartPracticeRunResponse,
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
 * Update an active zonal shift in Amazon Application Recovery Controller in your Amazon Web Services account. You can update a zonal shift to set a new expiration, or edit or replace the comment for the zonal shift.
 */
export const updateZonalShift: (
  input: UpdateZonalShiftRequest,
) => Effect.Effect<
  ZonalShift,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateZonalShiftRequest,
  output: ZonalShift,
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
 * You start a zonal shift to temporarily move load balancer traffic away from an Availability Zone in an Amazon Web Services Region, to help your application recover immediately, for example, from a developer's bad code deployment or from an Amazon Web Services infrastructure failure in a single Availability Zone. You can start a zonal shift in ARC only for managed resources in your Amazon Web Services account in an Amazon Web Services Region. Resources are automatically registered with ARC by Amazon Web Services services.
 *
 * Amazon Application Recovery Controller currently supports enabling the following resources for zonal shift and zonal autoshift:
 *
 * - Amazon EC2 Auto Scaling groups
 *
 * - Amazon Elastic Kubernetes Service
 *
 * - Application Load Balancer
 *
 * - Network Load Balancer
 *
 * When you start a zonal shift, traffic for the resource is no longer routed to the Availability Zone. The zonal shift is created immediately in ARC. However, it can take a short time, typically up to a few minutes, for existing, in-progress connections in the Availability Zone to complete.
 *
 * For more information, see Zonal shift in the Amazon Application Recovery Controller Developer Guide.
 */
export const startZonalShift: (
  input: StartZonalShiftRequest,
) => Effect.Effect<
  ZonalShift,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartZonalShiftRequest,
  output: ZonalShift,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

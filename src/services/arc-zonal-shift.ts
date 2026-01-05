import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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

//# Schemas
export class GetAutoshiftObserverNotificationStatusRequest extends S.Class<GetAutoshiftObserverNotificationStatusRequest>(
  "GetAutoshiftObserverNotificationStatusRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/autoshift-observer-notification" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const BlockedWindows = S.Array(S.String);
export const BlockedDates = S.Array(S.String);
export const AllowedWindows = S.Array(S.String);
export class ControlCondition extends S.Class<ControlCondition>(
  "ControlCondition",
)({ type: S.String, alarmIdentifier: S.String }) {}
export const OutcomeAlarms = S.Array(ControlCondition);
export class ListAutoshiftsRequest extends S.Class<ListAutoshiftsRequest>(
  "ListAutoshiftsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/autoshifts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAutoshiftObserverNotificationStatusResponse extends S.Class<GetAutoshiftObserverNotificationStatusResponse>(
  "GetAutoshiftObserverNotificationStatusResponse",
)({ status: S.String }) {}
export class UpdateAutoshiftObserverNotificationStatusRequest extends S.Class<UpdateAutoshiftObserverNotificationStatusRequest>(
  "UpdateAutoshiftObserverNotificationStatusRequest",
)(
  { status: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/autoshift-observer-notification" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetManagedResourceRequest extends S.Class<GetManagedResourceRequest>(
  "GetManagedResourceRequest",
)(
  { resourceIdentifier: S.String.pipe(T.HttpLabel("resourceIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/managedresources/{resourceIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListManagedResourcesRequest extends S.Class<ListManagedResourcesRequest>(
  "ListManagedResourcesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/managedresources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateZonalAutoshiftConfigurationRequest extends S.Class<UpdateZonalAutoshiftConfigurationRequest>(
  "UpdateZonalAutoshiftConfigurationRequest",
)(
  {
    resourceIdentifier: S.String.pipe(T.HttpLabel("resourceIdentifier")),
    zonalAutoshiftStatus: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/managedresources/{resourceIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePracticeRunConfigurationRequest extends S.Class<DeletePracticeRunConfigurationRequest>(
  "DeletePracticeRunConfigurationRequest",
)(
  { resourceIdentifier: S.String.pipe(T.HttpLabel("resourceIdentifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/configuration/{resourceIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const BlockingAlarms = S.Array(ControlCondition);
export class CreatePracticeRunConfigurationRequest extends S.Class<CreatePracticeRunConfigurationRequest>(
  "CreatePracticeRunConfigurationRequest",
)(
  {
    resourceIdentifier: S.String,
    blockedWindows: S.optional(BlockedWindows),
    blockedDates: S.optional(BlockedDates),
    blockingAlarms: S.optional(BlockingAlarms),
    allowedWindows: S.optional(AllowedWindows),
    outcomeAlarms: OutcomeAlarms,
  },
  T.all(
    T.Http({ method: "POST", uri: "/configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelPracticeRunRequest extends S.Class<CancelPracticeRunRequest>(
  "CancelPracticeRunRequest",
)(
  { zonalShiftId: S.String.pipe(T.HttpLabel("zonalShiftId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/practiceruns/{zonalShiftId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelZonalShiftRequest extends S.Class<CancelZonalShiftRequest>(
  "CancelZonalShiftRequest",
)(
  { zonalShiftId: S.String.pipe(T.HttpLabel("zonalShiftId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/zonalshifts/{zonalShiftId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateZonalShiftRequest extends S.Class<UpdateZonalShiftRequest>(
  "UpdateZonalShiftRequest",
)(
  {
    zonalShiftId: S.String.pipe(T.HttpLabel("zonalShiftId")),
    comment: S.optional(S.String),
    expiresIn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/zonalshifts/{zonalShiftId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListZonalShiftsRequest extends S.Class<ListZonalShiftsRequest>(
  "ListZonalShiftsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    resourceIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("resourceIdentifier"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/zonalshifts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartPracticeRunRequest extends S.Class<StartPracticeRunRequest>(
  "StartPracticeRunRequest",
)(
  { resourceIdentifier: S.String, awayFrom: S.String, comment: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/practiceruns" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartZonalShiftRequest extends S.Class<StartZonalShiftRequest>(
  "StartZonalShiftRequest",
)(
  {
    resourceIdentifier: S.String,
    awayFrom: S.String,
    expiresIn: S.String,
    comment: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/zonalshifts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAutoshiftObserverNotificationStatusResponse extends S.Class<UpdateAutoshiftObserverNotificationStatusResponse>(
  "UpdateAutoshiftObserverNotificationStatusResponse",
)({ status: S.String }) {}
export class UpdateZonalAutoshiftConfigurationResponse extends S.Class<UpdateZonalAutoshiftConfigurationResponse>(
  "UpdateZonalAutoshiftConfigurationResponse",
)({ resourceIdentifier: S.String, zonalAutoshiftStatus: S.String }) {}
export class UpdatePracticeRunConfigurationRequest extends S.Class<UpdatePracticeRunConfigurationRequest>(
  "UpdatePracticeRunConfigurationRequest",
)(
  {
    resourceIdentifier: S.String.pipe(T.HttpLabel("resourceIdentifier")),
    blockedWindows: S.optional(BlockedWindows),
    blockedDates: S.optional(BlockedDates),
    blockingAlarms: S.optional(BlockingAlarms),
    allowedWindows: S.optional(AllowedWindows),
    outcomeAlarms: S.optional(OutcomeAlarms),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/configuration/{resourceIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePracticeRunConfigurationResponse extends S.Class<DeletePracticeRunConfigurationResponse>(
  "DeletePracticeRunConfigurationResponse",
)({ arn: S.String, name: S.String, zonalAutoshiftStatus: S.String }) {}
export class PracticeRunConfiguration extends S.Class<PracticeRunConfiguration>(
  "PracticeRunConfiguration",
)({
  blockingAlarms: S.optional(BlockingAlarms),
  outcomeAlarms: OutcomeAlarms,
  blockedWindows: S.optional(BlockedWindows),
  allowedWindows: S.optional(AllowedWindows),
  blockedDates: S.optional(BlockedDates),
}) {}
export class CreatePracticeRunConfigurationResponse extends S.Class<CreatePracticeRunConfigurationResponse>(
  "CreatePracticeRunConfigurationResponse",
)({
  arn: S.String,
  name: S.String,
  zonalAutoshiftStatus: S.String,
  practiceRunConfiguration: PracticeRunConfiguration,
}) {}
export class CancelPracticeRunResponse extends S.Class<CancelPracticeRunResponse>(
  "CancelPracticeRunResponse",
)({
  zonalShiftId: S.String,
  resourceIdentifier: S.String,
  awayFrom: S.String,
  expiryTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
  comment: S.String,
}) {}
export class ZonalShift extends S.Class<ZonalShift>("ZonalShift")({
  zonalShiftId: S.String,
  resourceIdentifier: S.String,
  awayFrom: S.String,
  expiryTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
  comment: S.String,
}) {}
export class StartPracticeRunResponse extends S.Class<StartPracticeRunResponse>(
  "StartPracticeRunResponse",
)({
  zonalShiftId: S.String,
  resourceIdentifier: S.String,
  awayFrom: S.String,
  expiryTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
  comment: S.String,
}) {}
export const AvailabilityZones = S.Array(S.String);
export class AutoshiftSummary extends S.Class<AutoshiftSummary>(
  "AutoshiftSummary",
)({
  awayFrom: S.String,
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
}) {}
export const AutoshiftSummaries = S.Array(AutoshiftSummary);
export const AppliedWeights = S.Record({ key: S.String, value: S.Number });
export class ZonalShiftInResource extends S.Class<ZonalShiftInResource>(
  "ZonalShiftInResource",
)({
  appliedStatus: S.String,
  zonalShiftId: S.String,
  resourceIdentifier: S.String,
  awayFrom: S.String,
  expiryTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  comment: S.String,
  shiftType: S.optional(S.String),
  practiceRunOutcome: S.optional(S.String),
}) {}
export const ZonalShiftsInResource = S.Array(ZonalShiftInResource);
export class AutoshiftInResource extends S.Class<AutoshiftInResource>(
  "AutoshiftInResource",
)({
  appliedStatus: S.String,
  awayFrom: S.String,
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const AutoshiftsInResource = S.Array(AutoshiftInResource);
export class ManagedResourceSummary extends S.Class<ManagedResourceSummary>(
  "ManagedResourceSummary",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  availabilityZones: AvailabilityZones,
  appliedWeights: S.optional(AppliedWeights),
  zonalShifts: S.optional(ZonalShiftsInResource),
  autoshifts: S.optional(AutoshiftsInResource),
  zonalAutoshiftStatus: S.optional(S.String),
  practiceRunStatus: S.optional(S.String),
}) {}
export const ManagedResourceSummaries = S.Array(ManagedResourceSummary);
export class ZonalShiftSummary extends S.Class<ZonalShiftSummary>(
  "ZonalShiftSummary",
)({
  zonalShiftId: S.String,
  resourceIdentifier: S.String,
  awayFrom: S.String,
  expiryTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
  comment: S.String,
  shiftType: S.optional(S.String),
  practiceRunOutcome: S.optional(S.String),
}) {}
export const ZonalShiftSummaries = S.Array(ZonalShiftSummary);
export class ListAutoshiftsResponse extends S.Class<ListAutoshiftsResponse>(
  "ListAutoshiftsResponse",
)({ items: S.optional(AutoshiftSummaries), nextToken: S.optional(S.String) }) {}
export class GetManagedResourceResponse extends S.Class<GetManagedResourceResponse>(
  "GetManagedResourceResponse",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  appliedWeights: AppliedWeights,
  zonalShifts: ZonalShiftsInResource,
  autoshifts: S.optional(AutoshiftsInResource),
  practiceRunConfiguration: S.optional(PracticeRunConfiguration),
  zonalAutoshiftStatus: S.optional(S.String),
}) {}
export class ListManagedResourcesResponse extends S.Class<ListManagedResourcesResponse>(
  "ListManagedResourcesResponse",
)({ items: ManagedResourceSummaries, nextToken: S.optional(S.String) }) {}
export class UpdatePracticeRunConfigurationResponse extends S.Class<UpdatePracticeRunConfigurationResponse>(
  "UpdatePracticeRunConfigurationResponse",
)({
  arn: S.String,
  name: S.String,
  zonalAutoshiftStatus: S.String,
  practiceRunConfiguration: PracticeRunConfiguration,
}) {}
export class ListZonalShiftsResponse extends S.Class<ListZonalShiftsResponse>(
  "ListZonalShiftsResponse",
)({
  items: S.optional(ZonalShiftSummaries),
  nextToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, reason: S.String, zonalShiftId: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String, reason: S.String },
) {}

//# Operations
/**
 * Returns the status of the autoshift observer notification. Autoshift observer notifications notify you through Amazon EventBridge when there is an autoshift event for zonal autoshift. The status can be `ENABLED` or `DISABLED`. When `ENABLED`, a notification is sent when an autoshift is triggered. When `DISABLED`, notifications are not sent.
 */
export const getAutoshiftObserverNotificationStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetAutoshiftObserverNotificationStatusRequest,
    output: GetAutoshiftObserverNotificationStatusResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
    ],
  }));
/**
 * Get information about a resource that's been registered for zonal shifts with Amazon Application Recovery Controller in this Amazon Web Services Region. Resources that are registered for zonal shifts are managed resources in ARC. You can start zonal shifts and configure zonal autoshift for managed resources.
 */
export const getManagedResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listManagedResources =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listZonalShifts = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Update the status of autoshift observer notification. Autoshift observer notification enables you to be notified, through Amazon EventBridge, when there is an autoshift event for zonal autoshift.
 *
 * If the status is `ENABLED`, ARC includes all autoshift events when you use the EventBridge pattern `Autoshift In Progress`. When the status is `DISABLED`, ARC includes only autoshift events for autoshifts when one or more of your resources is included in the autoshift.
 *
 * For more information, see Notifications for practice runs and autoshifts in the Amazon Application Recovery Controller Developer Guide.
 */
export const updateAutoshiftObserverNotificationStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAutoshifts = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * The zonal autoshift configuration for a resource includes the practice run configuration and the status for running autoshifts, zonal autoshift status. When a resource has a practice run configuration, ARC starts weekly zonal shifts for the resource, to shift traffic away from an Availability Zone. Weekly practice runs help you to make sure that your application can continue to operate normally with the loss of one Availability Zone.
 *
 * You can update the zonal autoshift status to enable or disable zonal autoshift. When zonal autoshift is `ENABLED`, you authorize Amazon Web Services to shift away resource traffic for an application from an Availability Zone during events, on your behalf, to help reduce time to recovery. Traffic is also shifted away for the required weekly practice runs.
 */
export const updateZonalAutoshiftConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePracticeRunConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePracticeRunConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPracticeRunConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const cancelPracticeRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const cancelZonalShift = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startPracticeRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateZonalShift = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startZonalShift = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

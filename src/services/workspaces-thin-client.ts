import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "WorkSpaces Thin Client",
  serviceShapeName: "ThinClient",
});
const auth = T.AwsAuthSigv4({ name: "thinclient" });
const ver = T.ServiceVersion("2023-08-22");
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
                                url: "https://thinclient-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://thinclient-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://thinclient.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://thinclient.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeys = S.Array(S.String);
export class DeleteDeviceRequest extends S.Class<DeleteDeviceRequest>(
  "DeleteDeviceRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/devices/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDeviceResponse extends S.Class<DeleteDeviceResponse>(
  "DeleteDeviceResponse",
)({}) {}
export class DeleteEnvironmentRequest extends S.Class<DeleteEnvironmentRequest>(
  "DeleteEnvironmentRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/environments/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEnvironmentResponse extends S.Class<DeleteEnvironmentResponse>(
  "DeleteEnvironmentResponse",
)({}) {}
export class DeregisterDeviceRequest extends S.Class<DeregisterDeviceRequest>(
  "DeregisterDeviceRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    targetDeviceStatus: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/deregister-device/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeregisterDeviceResponse extends S.Class<DeregisterDeviceResponse>(
  "DeregisterDeviceResponse",
)({}) {}
export class GetDeviceRequest extends S.Class<GetDeviceRequest>(
  "GetDeviceRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "GET", uri: "/devices/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEnvironmentRequest extends S.Class<GetEnvironmentRequest>(
  "GetEnvironmentRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "GET", uri: "/environments/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSoftwareSetRequest extends S.Class<GetSoftwareSetRequest>(
  "GetSoftwareSetRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "GET", uri: "/softwaresets/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDevicesRequest extends S.Class<ListDevicesRequest>(
  "ListDevicesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/devices" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEnvironmentsRequest extends S.Class<ListEnvironmentsRequest>(
  "ListEnvironmentsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/environments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSoftwareSetsRequest extends S.Class<ListSoftwareSetsRequest>(
  "ListSoftwareSetsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/softwaresets" }),
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
export const TagsMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagsMap },
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
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
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
export class UpdateDeviceRequest extends S.Class<UpdateDeviceRequest>(
  "UpdateDeviceRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    name: S.optional(S.String),
    desiredSoftwareSetId: S.optional(S.String),
    softwareSetUpdateSchedule: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/devices/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const DayOfWeekList = S.Array(S.String);
export class MaintenanceWindow extends S.Class<MaintenanceWindow>(
  "MaintenanceWindow",
)({
  type: S.String,
  startTimeHour: S.optional(S.Number),
  startTimeMinute: S.optional(S.Number),
  endTimeHour: S.optional(S.Number),
  endTimeMinute: S.optional(S.Number),
  daysOfTheWeek: S.optional(DayOfWeekList),
  applyTimeOf: S.optional(S.String),
}) {}
export const DeviceCreationTagsMap = S.Record({
  key: S.String,
  value: S.String,
});
export class UpdateEnvironmentRequest extends S.Class<UpdateEnvironmentRequest>(
  "UpdateEnvironmentRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    name: S.optional(S.String),
    desktopArn: S.optional(S.String),
    desktopEndpoint: S.optional(S.String),
    softwareSetUpdateSchedule: S.optional(S.String),
    maintenanceWindow: S.optional(MaintenanceWindow),
    softwareSetUpdateMode: S.optional(S.String),
    desiredSoftwareSetId: S.optional(S.String),
    deviceCreationTags: S.optional(DeviceCreationTagsMap),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/environments/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSoftwareSetRequest extends S.Class<UpdateSoftwareSetRequest>(
  "UpdateSoftwareSetRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")), validationStatus: S.String },
  T.all(
    T.Http({ method: "PATCH", uri: "/softwaresets/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSoftwareSetResponse extends S.Class<UpdateSoftwareSetResponse>(
  "UpdateSoftwareSetResponse",
)({}) {}
export class CreateEnvironmentRequest extends S.Class<CreateEnvironmentRequest>(
  "CreateEnvironmentRequest",
)(
  {
    name: S.optional(S.String),
    desktopArn: S.String,
    desktopEndpoint: S.optional(S.String),
    softwareSetUpdateSchedule: S.optional(S.String),
    maintenanceWindow: S.optional(MaintenanceWindow),
    softwareSetUpdateMode: S.optional(S.String),
    desiredSoftwareSetId: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
    clientToken: S.optional(S.String),
    tags: S.optional(TagsMap),
    deviceCreationTags: S.optional(DeviceCreationTagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/environments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagsMap) }) {}
export class DeviceSummary extends S.Class<DeviceSummary>("DeviceSummary")({
  id: S.optional(S.String),
  serialNumber: S.optional(S.String),
  name: S.optional(S.String),
  model: S.optional(S.String),
  environmentId: S.optional(S.String),
  status: S.optional(S.String),
  currentSoftwareSetId: S.optional(S.String),
  desiredSoftwareSetId: S.optional(S.String),
  pendingSoftwareSetId: S.optional(S.String),
  softwareSetUpdateSchedule: S.optional(S.String),
  lastConnectedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastPostureAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  arn: S.optional(S.String),
  lastUserId: S.optional(S.String),
}) {}
export class UpdateDeviceResponse extends S.Class<UpdateDeviceResponse>(
  "UpdateDeviceResponse",
)({ device: S.optional(DeviceSummary) }) {}
export class EnvironmentSummary extends S.Class<EnvironmentSummary>(
  "EnvironmentSummary",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  desktopArn: S.optional(S.String),
  desktopEndpoint: S.optional(S.String),
  desktopType: S.optional(S.String),
  activationCode: S.optional(S.String),
  softwareSetUpdateSchedule: S.optional(S.String),
  maintenanceWindow: S.optional(MaintenanceWindow),
  softwareSetUpdateMode: S.optional(S.String),
  desiredSoftwareSetId: S.optional(S.String),
  pendingSoftwareSetId: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  arn: S.optional(S.String),
}) {}
export class UpdateEnvironmentResponse extends S.Class<UpdateEnvironmentResponse>(
  "UpdateEnvironmentResponse",
)({ environment: S.optional(EnvironmentSummary) }) {}
export class Device extends S.Class<Device>("Device")({
  id: S.optional(S.String),
  serialNumber: S.optional(S.String),
  name: S.optional(S.String),
  model: S.optional(S.String),
  environmentId: S.optional(S.String),
  status: S.optional(S.String),
  currentSoftwareSetId: S.optional(S.String),
  currentSoftwareSetVersion: S.optional(S.String),
  desiredSoftwareSetId: S.optional(S.String),
  pendingSoftwareSetId: S.optional(S.String),
  pendingSoftwareSetVersion: S.optional(S.String),
  softwareSetUpdateSchedule: S.optional(S.String),
  softwareSetComplianceStatus: S.optional(S.String),
  softwareSetUpdateStatus: S.optional(S.String),
  lastConnectedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastPostureAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  arn: S.optional(S.String),
  kmsKeyArn: S.optional(S.String),
  lastUserId: S.optional(S.String),
}) {}
export class Environment extends S.Class<Environment>("Environment")({
  id: S.optional(S.String),
  name: S.optional(S.String),
  desktopArn: S.optional(S.String),
  desktopEndpoint: S.optional(S.String),
  desktopType: S.optional(S.String),
  activationCode: S.optional(S.String),
  registeredDevicesCount: S.optional(S.Number),
  softwareSetUpdateSchedule: S.optional(S.String),
  maintenanceWindow: S.optional(MaintenanceWindow),
  softwareSetUpdateMode: S.optional(S.String),
  desiredSoftwareSetId: S.optional(S.String),
  pendingSoftwareSetId: S.optional(S.String),
  pendingSoftwareSetVersion: S.optional(S.String),
  softwareSetComplianceStatus: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  arn: S.optional(S.String),
  kmsKeyArn: S.optional(S.String),
  deviceCreationTags: S.optional(DeviceCreationTagsMap),
}) {}
export const DeviceList = S.Array(DeviceSummary);
export const EnvironmentList = S.Array(EnvironmentSummary);
export class SoftwareSetSummary extends S.Class<SoftwareSetSummary>(
  "SoftwareSetSummary",
)({
  id: S.optional(S.String),
  version: S.optional(S.String),
  releasedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  supportedUntil: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  validationStatus: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const SoftwareSetList = S.Array(SoftwareSetSummary);
export class CreateEnvironmentResponse extends S.Class<CreateEnvironmentResponse>(
  "CreateEnvironmentResponse",
)({ environment: S.optional(EnvironmentSummary) }) {}
export class GetDeviceResponse extends S.Class<GetDeviceResponse>(
  "GetDeviceResponse",
)({ device: S.optional(Device) }) {}
export class GetEnvironmentResponse extends S.Class<GetEnvironmentResponse>(
  "GetEnvironmentResponse",
)({ environment: S.optional(Environment) }) {}
export class ListDevicesResponse extends S.Class<ListDevicesResponse>(
  "ListDevicesResponse",
)({ devices: S.optional(DeviceList), nextToken: S.optional(S.String) }) {}
export class ListEnvironmentsResponse extends S.Class<ListEnvironmentsResponse>(
  "ListEnvironmentsResponse",
)({
  environments: S.optional(EnvironmentList),
  nextToken: S.optional(S.String),
}) {}
export class ListSoftwareSetsResponse extends S.Class<ListSoftwareSetsResponse>(
  "ListSoftwareSetsResponse",
)({
  softwareSets: S.optional(SoftwareSetList),
  nextToken: S.optional(S.String),
}) {}
export class Software extends S.Class<Software>("Software")({
  name: S.optional(S.String),
  version: S.optional(S.String),
}) {}
export const SoftwareList = S.Array(Software);
export class SoftwareSet extends S.Class<SoftwareSet>("SoftwareSet")({
  id: S.optional(S.String),
  version: S.optional(S.String),
  releasedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  supportedUntil: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  validationStatus: S.optional(S.String),
  software: S.optional(SoftwareList),
  arn: S.optional(S.String),
}) {}
export class GetSoftwareSetResponse extends S.Class<GetSoftwareSetResponse>(
  "GetSoftwareSetResponse",
)({ softwareSet: S.optional(SoftwareSet) }) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    reason: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Returns a list of thin client devices.
 */
export const listDevices = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDevicesRequest,
    output: ListDevicesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "devices",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Updates an environment.
 */
export const updateEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentRequest,
  output: UpdateEnvironmentResponse,
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
 * Deletes an environment.
 */
export const deleteEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentRequest,
  output: DeleteEnvironmentResponse,
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
 * Deregisters a thin client device.
 */
export const deregisterDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterDeviceRequest,
  output: DeregisterDeviceResponse,
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
 * Assigns one or more tags (key-value pairs) to the specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
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
 * Removes a tag or tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
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
 * Updates a thin client device.
 */
export const updateDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDeviceRequest,
  output: UpdateDeviceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a software set.
 */
export const updateSoftwareSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSoftwareSetRequest,
  output: UpdateSoftwareSetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a thin client device.
 */
export const deleteDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeviceRequest,
  output: DeleteDeviceResponse,
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
 * Returns information for a thin client device.
 */
export const getDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeviceRequest,
  output: GetDeviceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information for an environment.
 */
export const getEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentRequest,
  output: GetEnvironmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information for a software set.
 */
export const getSoftwareSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSoftwareSetRequest,
  output: GetSoftwareSetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of environments.
 */
export const listEnvironments = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListEnvironmentsRequest,
    output: ListEnvironmentsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "environments",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns a list of software sets.
 */
export const listSoftwareSets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSoftwareSetsRequest,
    output: ListSoftwareSetsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "softwareSets",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns a list of tags for a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an environment for your thin client devices.
 */
export const createEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentRequest,
  output: CreateEnvironmentResponse,
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

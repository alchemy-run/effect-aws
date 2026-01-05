import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "ControlTower",
  serviceShapeName: "AWSControlTowerApis",
});
const auth = T.AwsAuthSigv4({ name: "controltower" });
const ver = T.ServiceVersion("2018-05-10");
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
                        url: "https://controltower-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://controltower-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://controltower.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://controltower.{Region}.{PartitionResult#dnsSuffix}",
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
export const RemediationTypes = S.Array(S.String);
export const TagKeys = S.Array(S.String);
export class DisableControlInput extends S.Class<DisableControlInput>(
  "DisableControlInput",
)(
  {
    controlIdentifier: S.optional(S.String),
    targetIdentifier: S.optional(S.String),
    enabledControlIdentifier: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/disable-control" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBaselineOperationInput extends S.Class<GetBaselineOperationInput>(
  "GetBaselineOperationInput",
)(
  { operationIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/get-baseline-operation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBaselineInput extends S.Class<GetBaselineInput>(
  "GetBaselineInput",
)(
  { baselineIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/get-baseline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBaselinesInput extends S.Class<ListBaselinesInput>(
  "ListBaselinesInput",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(
    T.Http({ method: "POST", uri: "/list-baselines" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetControlOperationInput extends S.Class<GetControlOperationInput>(
  "GetControlOperationInput",
)(
  { operationIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/get-control-operation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEnabledBaselineInput extends S.Class<GetEnabledBaselineInput>(
  "GetEnabledBaselineInput",
)(
  { enabledBaselineIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/get-enabled-baseline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EnabledBaselineParameter extends S.Class<EnabledBaselineParameter>(
  "EnabledBaselineParameter",
)({ key: S.String, value: S.Any }) {}
export const EnabledBaselineParameters = S.Array(EnabledBaselineParameter);
export class UpdateEnabledBaselineInput extends S.Class<UpdateEnabledBaselineInput>(
  "UpdateEnabledBaselineInput",
)(
  {
    baselineVersion: S.String,
    parameters: S.optional(EnabledBaselineParameters),
    enabledBaselineIdentifier: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/update-enabled-baseline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableBaselineInput extends S.Class<DisableBaselineInput>(
  "DisableBaselineInput",
)(
  { enabledBaselineIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/disable-baseline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResetEnabledBaselineInput extends S.Class<ResetEnabledBaselineInput>(
  "ResetEnabledBaselineInput",
)(
  { enabledBaselineIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/reset-enabled-baseline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEnabledControlInput extends S.Class<GetEnabledControlInput>(
  "GetEnabledControlInput",
)(
  { enabledControlIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/get-enabled-control" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EnabledControlParameter extends S.Class<EnabledControlParameter>(
  "EnabledControlParameter",
)({ key: S.String, value: S.Any }) {}
export const EnabledControlParameters = S.Array(EnabledControlParameter);
export class UpdateEnabledControlInput extends S.Class<UpdateEnabledControlInput>(
  "UpdateEnabledControlInput",
)(
  { parameters: EnabledControlParameters, enabledControlIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/update-enabled-control" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResetEnabledControlInput extends S.Class<ResetEnabledControlInput>(
  "ResetEnabledControlInput",
)(
  { enabledControlIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/reset-enabled-control" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLandingZoneOperationInput extends S.Class<GetLandingZoneOperationInput>(
  "GetLandingZoneOperationInput",
)(
  { operationIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/get-landingzone-operation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateLandingZoneInput extends S.Class<CreateLandingZoneInput>(
  "CreateLandingZoneInput",
)(
  {
    version: S.String,
    remediationTypes: S.optional(RemediationTypes),
    tags: S.optional(TagMap),
    manifest: S.optional(S.Any),
  },
  T.all(
    T.Http({ method: "POST", uri: "/create-landingzone" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLandingZoneInput extends S.Class<GetLandingZoneInput>(
  "GetLandingZoneInput",
)(
  { landingZoneIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/get-landingzone" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateLandingZoneInput extends S.Class<UpdateLandingZoneInput>(
  "UpdateLandingZoneInput",
)(
  {
    version: S.String,
    remediationTypes: S.optional(RemediationTypes),
    landingZoneIdentifier: S.String,
    manifest: S.optional(S.Any),
  },
  T.all(
    T.Http({ method: "POST", uri: "/update-landingzone" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLandingZoneInput extends S.Class<DeleteLandingZoneInput>(
  "DeleteLandingZoneInput",
)(
  { landingZoneIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/delete-landingzone" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLandingZonesInput extends S.Class<ListLandingZonesInput>(
  "ListLandingZonesInput",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(
    T.Http({ method: "POST", uri: "/list-landingzones" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResetLandingZoneInput extends S.Class<ResetLandingZoneInput>(
  "ResetLandingZoneInput",
)(
  { landingZoneIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/reset-landingzone" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
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
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
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
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
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
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}) {}
export const ControlIdentifiers = S.Array(S.String);
export const TargetIdentifiers = S.Array(S.String);
export const EnabledControlIdentifiers = S.Array(S.String);
export const ControlOperationStatuses = S.Array(S.String);
export const ControlOperationTypes = S.Array(S.String);
export const EnabledBaselineTargetIdentifiers = S.Array(S.String);
export const EnabledBaselineBaselineIdentifiers = S.Array(S.String);
export const EnabledBaselineParentIdentifiers = S.Array(S.String);
export const EnabledBaselineEnablementStatuses = S.Array(S.String);
export const EnabledBaselineDriftStatuses = S.Array(S.String);
export const EnablementStatuses = S.Array(S.String);
export const DriftStatuses = S.Array(S.String);
export const ParentIdentifiers = S.Array(S.String);
export const LandingZoneOperationTypes = S.Array(S.String);
export const LandingZoneOperationStatuses = S.Array(S.String);
export class ControlOperationFilter extends S.Class<ControlOperationFilter>(
  "ControlOperationFilter",
)({
  controlIdentifiers: S.optional(ControlIdentifiers),
  targetIdentifiers: S.optional(TargetIdentifiers),
  enabledControlIdentifiers: S.optional(EnabledControlIdentifiers),
  statuses: S.optional(ControlOperationStatuses),
  controlOperationTypes: S.optional(ControlOperationTypes),
}) {}
export class EnabledBaselineFilter extends S.Class<EnabledBaselineFilter>(
  "EnabledBaselineFilter",
)({
  targetIdentifiers: S.optional(EnabledBaselineTargetIdentifiers),
  baselineIdentifiers: S.optional(EnabledBaselineBaselineIdentifiers),
  parentIdentifiers: S.optional(EnabledBaselineParentIdentifiers),
  statuses: S.optional(EnabledBaselineEnablementStatuses),
  inheritanceDriftStatuses: S.optional(EnabledBaselineDriftStatuses),
}) {}
export class EnabledControlFilter extends S.Class<EnabledControlFilter>(
  "EnabledControlFilter",
)({
  controlIdentifiers: S.optional(ControlIdentifiers),
  statuses: S.optional(EnablementStatuses),
  driftStatuses: S.optional(DriftStatuses),
  parentIdentifiers: S.optional(ParentIdentifiers),
  inheritanceDriftStatuses: S.optional(DriftStatuses),
  resourceDriftStatuses: S.optional(DriftStatuses),
}) {}
export class LandingZoneOperationFilter extends S.Class<LandingZoneOperationFilter>(
  "LandingZoneOperationFilter",
)({
  types: S.optional(LandingZoneOperationTypes),
  statuses: S.optional(LandingZoneOperationStatuses),
}) {}
export class DisableControlOutput extends S.Class<DisableControlOutput>(
  "DisableControlOutput",
)({ operationIdentifier: S.String }) {}
export class GetBaselineOutput extends S.Class<GetBaselineOutput>(
  "GetBaselineOutput",
)({ arn: S.String, name: S.String, description: S.optional(S.String) }) {}
export class ListControlOperationsInput extends S.Class<ListControlOperationsInput>(
  "ListControlOperationsInput",
)(
  {
    filter: S.optional(ControlOperationFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-control-operations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EnableBaselineInput extends S.Class<EnableBaselineInput>(
  "EnableBaselineInput",
)(
  {
    baselineVersion: S.String,
    parameters: S.optional(EnabledBaselineParameters),
    baselineIdentifier: S.String,
    targetIdentifier: S.String,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/enable-baseline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEnabledBaselineOutput extends S.Class<UpdateEnabledBaselineOutput>(
  "UpdateEnabledBaselineOutput",
)({ operationIdentifier: S.String }) {}
export class DisableBaselineOutput extends S.Class<DisableBaselineOutput>(
  "DisableBaselineOutput",
)({ operationIdentifier: S.String }) {}
export class ListEnabledBaselinesInput extends S.Class<ListEnabledBaselinesInput>(
  "ListEnabledBaselinesInput",
)(
  {
    filter: S.optional(EnabledBaselineFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    includeChildren: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-enabled-baselines" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResetEnabledBaselineOutput extends S.Class<ResetEnabledBaselineOutput>(
  "ResetEnabledBaselineOutput",
)({ operationIdentifier: S.String }) {}
export class EnableControlInput extends S.Class<EnableControlInput>(
  "EnableControlInput",
)(
  {
    controlIdentifier: S.String,
    targetIdentifier: S.String,
    tags: S.optional(TagMap),
    parameters: S.optional(EnabledControlParameters),
  },
  T.all(
    T.Http({ method: "POST", uri: "/enable-control" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEnabledControlOutput extends S.Class<UpdateEnabledControlOutput>(
  "UpdateEnabledControlOutput",
)({ operationIdentifier: S.String }) {}
export class ListEnabledControlsInput extends S.Class<ListEnabledControlsInput>(
  "ListEnabledControlsInput",
)(
  {
    targetIdentifier: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filter: S.optional(EnabledControlFilter),
    includeChildren: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-enabled-controls" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResetEnabledControlOutput extends S.Class<ResetEnabledControlOutput>(
  "ResetEnabledControlOutput",
)({ operationIdentifier: S.String }) {}
export class ListLandingZoneOperationsInput extends S.Class<ListLandingZoneOperationsInput>(
  "ListLandingZoneOperationsInput",
)(
  {
    filter: S.optional(LandingZoneOperationFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-landingzone-operations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateLandingZoneOutput extends S.Class<CreateLandingZoneOutput>(
  "CreateLandingZoneOutput",
)({ arn: S.String, operationIdentifier: S.String }) {}
export class UpdateLandingZoneOutput extends S.Class<UpdateLandingZoneOutput>(
  "UpdateLandingZoneOutput",
)({ operationIdentifier: S.String }) {}
export class DeleteLandingZoneOutput extends S.Class<DeleteLandingZoneOutput>(
  "DeleteLandingZoneOutput",
)({ operationIdentifier: S.String }) {}
export class ResetLandingZoneOutput extends S.Class<ResetLandingZoneOutput>(
  "ResetLandingZoneOutput",
)({ operationIdentifier: S.String }) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ tags: TagMap }) {}
export class BaselineOperation extends S.Class<BaselineOperation>(
  "BaselineOperation",
)({
  operationIdentifier: S.optional(S.String),
  operationType: S.optional(S.String),
  status: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  statusMessage: S.optional(S.String),
}) {}
export class BaselineSummary extends S.Class<BaselineSummary>(
  "BaselineSummary",
)({ arn: S.String, name: S.String, description: S.optional(S.String) }) {}
export const Baselines = S.Array(BaselineSummary);
export class ControlOperation extends S.Class<ControlOperation>(
  "ControlOperation",
)({
  operationType: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  operationIdentifier: S.optional(S.String),
  controlIdentifier: S.optional(S.String),
  targetIdentifier: S.optional(S.String),
  enabledControlIdentifier: S.optional(S.String),
}) {}
export class LandingZoneOperationDetail extends S.Class<LandingZoneOperationDetail>(
  "LandingZoneOperationDetail",
)({
  operationType: S.optional(S.String),
  operationIdentifier: S.optional(S.String),
  status: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  statusMessage: S.optional(S.String),
}) {}
export class LandingZoneSummary extends S.Class<LandingZoneSummary>(
  "LandingZoneSummary",
)({ arn: S.optional(S.String) }) {}
export const LandingZoneSummaries = S.Array(LandingZoneSummary);
export class GetBaselineOperationOutput extends S.Class<GetBaselineOperationOutput>(
  "GetBaselineOperationOutput",
)({ baselineOperation: BaselineOperation }) {}
export class ListBaselinesOutput extends S.Class<ListBaselinesOutput>(
  "ListBaselinesOutput",
)({ baselines: Baselines, nextToken: S.optional(S.String) }) {}
export class GetControlOperationOutput extends S.Class<GetControlOperationOutput>(
  "GetControlOperationOutput",
)({ controlOperation: ControlOperation }) {}
export class EnableBaselineOutput extends S.Class<EnableBaselineOutput>(
  "EnableBaselineOutput",
)({ operationIdentifier: S.String, arn: S.String }) {}
export class EnableControlOutput extends S.Class<EnableControlOutput>(
  "EnableControlOutput",
)({ operationIdentifier: S.String, arn: S.optional(S.String) }) {}
export class GetLandingZoneOperationOutput extends S.Class<GetLandingZoneOperationOutput>(
  "GetLandingZoneOperationOutput",
)({ operationDetails: LandingZoneOperationDetail }) {}
export class ListLandingZonesOutput extends S.Class<ListLandingZonesOutput>(
  "ListLandingZonesOutput",
)({ landingZones: LandingZoneSummaries, nextToken: S.optional(S.String) }) {}
export class EnablementStatusSummary extends S.Class<EnablementStatusSummary>(
  "EnablementStatusSummary",
)({
  status: S.optional(S.String),
  lastOperationIdentifier: S.optional(S.String),
}) {}
export class EnabledBaselineParameterSummary extends S.Class<EnabledBaselineParameterSummary>(
  "EnabledBaselineParameterSummary",
)({ key: S.String, value: S.Any }) {}
export const EnabledBaselineParameterSummaries = S.Array(
  EnabledBaselineParameterSummary,
);
export class Region extends S.Class<Region>("Region")({
  name: S.optional(S.String),
}) {}
export const TargetRegions = S.Array(Region);
export class EnabledControlParameterSummary extends S.Class<EnabledControlParameterSummary>(
  "EnabledControlParameterSummary",
)({ key: S.String, value: S.Any }) {}
export const EnabledControlParameterSummaries = S.Array(
  EnabledControlParameterSummary,
);
export class LandingZoneDriftStatusSummary extends S.Class<LandingZoneDriftStatusSummary>(
  "LandingZoneDriftStatusSummary",
)({ status: S.optional(S.String) }) {}
export class ControlOperationSummary extends S.Class<ControlOperationSummary>(
  "ControlOperationSummary",
)({
  operationType: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  operationIdentifier: S.optional(S.String),
  controlIdentifier: S.optional(S.String),
  targetIdentifier: S.optional(S.String),
  enabledControlIdentifier: S.optional(S.String),
}) {}
export const ControlOperations = S.Array(ControlOperationSummary);
export class EnabledBaselineInheritanceDrift extends S.Class<EnabledBaselineInheritanceDrift>(
  "EnabledBaselineInheritanceDrift",
)({ status: S.optional(S.String) }) {}
export class EnabledBaselineDriftTypes extends S.Class<EnabledBaselineDriftTypes>(
  "EnabledBaselineDriftTypes",
)({ inheritance: S.optional(EnabledBaselineInheritanceDrift) }) {}
export class EnabledBaselineDriftStatusSummary extends S.Class<EnabledBaselineDriftStatusSummary>(
  "EnabledBaselineDriftStatusSummary",
)({ types: S.optional(EnabledBaselineDriftTypes) }) {}
export class EnabledBaselineSummary extends S.Class<EnabledBaselineSummary>(
  "EnabledBaselineSummary",
)({
  arn: S.String,
  baselineIdentifier: S.String,
  baselineVersion: S.optional(S.String),
  driftStatusSummary: S.optional(EnabledBaselineDriftStatusSummary),
  targetIdentifier: S.String,
  parentIdentifier: S.optional(S.String),
  statusSummary: EnablementStatusSummary,
}) {}
export const EnabledBaselines = S.Array(EnabledBaselineSummary);
export class EnabledControlInheritanceDrift extends S.Class<EnabledControlInheritanceDrift>(
  "EnabledControlInheritanceDrift",
)({ status: S.optional(S.String) }) {}
export class EnabledControlResourceDrift extends S.Class<EnabledControlResourceDrift>(
  "EnabledControlResourceDrift",
)({ status: S.optional(S.String) }) {}
export class EnabledControlDriftTypes extends S.Class<EnabledControlDriftTypes>(
  "EnabledControlDriftTypes",
)({
  inheritance: S.optional(EnabledControlInheritanceDrift),
  resource: S.optional(EnabledControlResourceDrift),
}) {}
export class DriftStatusSummary extends S.Class<DriftStatusSummary>(
  "DriftStatusSummary",
)({
  driftStatus: S.optional(S.String),
  types: S.optional(EnabledControlDriftTypes),
}) {}
export class EnabledControlSummary extends S.Class<EnabledControlSummary>(
  "EnabledControlSummary",
)({
  arn: S.optional(S.String),
  controlIdentifier: S.optional(S.String),
  targetIdentifier: S.optional(S.String),
  statusSummary: S.optional(EnablementStatusSummary),
  driftStatusSummary: S.optional(DriftStatusSummary),
  parentIdentifier: S.optional(S.String),
}) {}
export const EnabledControls = S.Array(EnabledControlSummary);
export class LandingZoneOperationSummary extends S.Class<LandingZoneOperationSummary>(
  "LandingZoneOperationSummary",
)({
  operationType: S.optional(S.String),
  operationIdentifier: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export const LandingZoneOperations = S.Array(LandingZoneOperationSummary);
export class LandingZoneDetail extends S.Class<LandingZoneDetail>(
  "LandingZoneDetail",
)({
  version: S.String,
  remediationTypes: S.optional(RemediationTypes),
  arn: S.optional(S.String),
  status: S.optional(S.String),
  latestAvailableVersion: S.optional(S.String),
  driftStatus: S.optional(LandingZoneDriftStatusSummary),
  manifest: S.Any,
}) {}
export class ListControlOperationsOutput extends S.Class<ListControlOperationsOutput>(
  "ListControlOperationsOutput",
)({ controlOperations: ControlOperations, nextToken: S.optional(S.String) }) {}
export class ListEnabledBaselinesOutput extends S.Class<ListEnabledBaselinesOutput>(
  "ListEnabledBaselinesOutput",
)({ enabledBaselines: EnabledBaselines, nextToken: S.optional(S.String) }) {}
export class ListEnabledControlsOutput extends S.Class<ListEnabledControlsOutput>(
  "ListEnabledControlsOutput",
)({ enabledControls: EnabledControls, nextToken: S.optional(S.String) }) {}
export class ListLandingZoneOperationsOutput extends S.Class<ListLandingZoneOperationsOutput>(
  "ListLandingZoneOperationsOutput",
)({
  landingZoneOperations: LandingZoneOperations,
  nextToken: S.optional(S.String),
}) {}
export class GetLandingZoneOutput extends S.Class<GetLandingZoneOutput>(
  "GetLandingZoneOutput",
)({ landingZone: LandingZoneDetail }) {}
export class EnabledBaselineDetails extends S.Class<EnabledBaselineDetails>(
  "EnabledBaselineDetails",
)({
  arn: S.String,
  baselineIdentifier: S.String,
  baselineVersion: S.optional(S.String),
  driftStatusSummary: S.optional(EnabledBaselineDriftStatusSummary),
  targetIdentifier: S.String,
  parentIdentifier: S.optional(S.String),
  statusSummary: EnablementStatusSummary,
  parameters: S.optional(EnabledBaselineParameterSummaries),
}) {}
export class EnabledControlDetails extends S.Class<EnabledControlDetails>(
  "EnabledControlDetails",
)({
  arn: S.optional(S.String),
  controlIdentifier: S.optional(S.String),
  targetIdentifier: S.optional(S.String),
  statusSummary: S.optional(EnablementStatusSummary),
  driftStatusSummary: S.optional(DriftStatusSummary),
  parentIdentifier: S.optional(S.String),
  targetRegions: S.optional(TargetRegions),
  parameters: S.optional(EnabledControlParameterSummaries),
}) {}
export class GetEnabledBaselineOutput extends S.Class<GetEnabledBaselineOutput>(
  "GetEnabledBaselineOutput",
)({ enabledBaselineDetails: S.optional(EnabledBaselineDetails) }) {}
export class GetEnabledControlOutput extends S.Class<GetEnabledControlOutput>(
  "GetEnabledControlOutput",
)({ enabledControlDetails: EnabledControlDetails }) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
) {}

//# Operations
/**
 * Applies tags to a resource. For usage examples, see the *Controls Reference Guide* .
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a new landing zone. This API call starts an asynchronous operation that creates and configures a landing zone, based on the parameters specified in the manifest JSON file.
 */
export const createLandingZone = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLandingZoneInput,
  output: CreateLandingZoneOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This API call updates the landing zone. It starts an asynchronous operation that updates the landing zone based on the new landing zone version, or on the changed parameters specified in the updated manifest file.
 */
export const updateLandingZone = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLandingZoneInput,
  output: UpdateLandingZoneOutput,
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
 * Decommissions a landing zone. This API call starts an asynchronous operation that deletes Amazon Web Services Control Tower resources deployed in accounts managed by Amazon Web Services Control Tower.
 *
 * Decommissioning a landing zone is a process with significant consequences, and it cannot be undone. We strongly recommend that you perform this decommissioning process only if you intend to stop using your landing zone.
 */
export const deleteLandingZone = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLandingZoneInput,
  output: DeleteLandingZoneOutput,
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
 * This API call resets a landing zone. It starts an asynchronous operation that resets the landing zone to the parameters specified in the original configuration, which you specified in the manifest file. Nothing in the manifest file's original landing zone configuration is changed during the reset process, by default. This API is not the same as a rollback of a landing zone version, which is not a supported operation.
 */
export const resetLandingZone = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetLandingZoneInput,
  output: ResetLandingZoneOutput,
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
 * Returns the landing zone ARN for the landing zone deployed in your managed account. This API also creates an ARN for existing accounts that do not yet have a landing zone ARN.
 *
 * Returns one landing zone ARN.
 */
export const listLandingZones = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListLandingZonesInput,
    output: ListLandingZonesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "landingZones",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Retrieve details about an existing `Baseline` resource by specifying its identifier. For usage examples, see *the Amazon Web Services Control Tower User Guide* .
 */
export const getBaseline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBaselineInput,
  output: GetBaselineOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the details of an asynchronous baseline operation, as initiated by any of these APIs: `EnableBaseline`, `DisableBaseline`, `UpdateEnabledBaseline`, `ResetEnabledBaseline`. A status message is displayed in case of operation failure. For usage examples, see *the Amazon Web Services Control Tower User Guide* .
 */
export const getBaselineOperation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetBaselineOperationInput,
    output: GetBaselineOperationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns the status of a particular `EnableControl` or `DisableControl` operation. Displays a message in case of error. Details for an operation are available for 90 days. For usage examples, see the *Controls Reference Guide* .
 */
export const getControlOperation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetControlOperationInput,
  output: GetControlOperationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the status of the specified landing zone operation. Details for an operation are available for 90 days.
 */
export const getLandingZoneOperation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLandingZoneOperationInput,
    output: GetLandingZoneOperationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Removes tags from a resource. For usage examples, see the *Controls Reference Guide* .
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of tags associated with the resource. For usage examples, see the *Controls Reference Guide* .
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a summary list of all available baselines. For usage examples, see *the Amazon Web Services Control Tower User Guide* .
 */
export const listBaselines = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListBaselinesInput,
    output: ListBaselinesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "baselines",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Provides a list of operations in progress or queued. For usage examples, see ListControlOperation examples.
 */
export const listControlOperations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListControlOperationsInput,
    output: ListControlOperationsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "controlOperations",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of summaries describing `EnabledBaseline` resources. You can filter the list by the corresponding `Baseline` or `Target` of the `EnabledBaseline` resources. For usage examples, see *the Amazon Web Services Control Tower User Guide* .
 */
export const listEnabledBaselines =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEnabledBaselinesInput,
    output: ListEnabledBaselinesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "enabledBaselines",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists the controls enabled by Amazon Web Services Control Tower on the specified organizational unit and the accounts it contains. For usage examples, see the *Controls Reference Guide* .
 */
export const listEnabledControls =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEnabledControlsInput,
    output: ListEnabledControlsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "enabledControls",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists all landing zone operations from the past 90 days. Results are sorted by time, with the most recent operation first.
 */
export const listLandingZoneOperations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListLandingZoneOperationsInput,
    output: ListLandingZoneOperationsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "landingZoneOperations",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns details about the landing zone. Displays a message in case of error.
 */
export const getLandingZone = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLandingZoneInput,
  output: GetLandingZoneOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This API call turns off a control. It starts an asynchronous operation that deletes Amazon Web Services resources on the specified organizational unit and the accounts it contains. The resources will vary according to the control that you specify. For usage examples, see the *Controls Reference Guide* .
 */
export const disableControl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableControlInput,
  output: DisableControlOutput,
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
/**
 * Enable (apply) a `Baseline` to a Target. This API starts an asynchronous operation to deploy resources specified by the `Baseline` to the specified Target. For usage examples, see *the Amazon Web Services Control Tower User Guide* .
 */
export const enableBaseline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableBaselineInput,
  output: EnableBaselineOutput,
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
/**
 * This API call activates a control. It starts an asynchronous operation that creates Amazon Web Services resources on the specified organizational unit and the accounts it contains. The resources created will vary according to the control that you specify. For usage examples, see the *Controls Reference Guide* .
 */
export const enableControl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableControlInput,
  output: EnableControlOutput,
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
/**
 * Updates an `EnabledBaseline` resource's applied parameters or version. For usage examples, see *the Amazon Web Services Control Tower User Guide* .
 */
export const updateEnabledBaseline = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateEnabledBaselineInput,
    output: UpdateEnabledBaselineOutput,
    errors: [
      AccessDeniedException,
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
 * Disable an `EnabledBaseline` resource on the specified Target. This API starts an asynchronous operation to remove all resources deployed as part of the baseline enablement. The resource will vary depending on the enabled baseline. For usage examples, see *the Amazon Web Services Control Tower User Guide* .
 */
export const disableBaseline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableBaselineInput,
  output: DisableBaselineOutput,
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
/**
 * Re-enables an `EnabledBaseline` resource. For example, this API can re-apply the existing `Baseline` after a new member account is moved to the target OU. For usage examples, see *the Amazon Web Services Control Tower User Guide* .
 */
export const resetEnabledBaseline = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ResetEnabledBaselineInput,
    output: ResetEnabledBaselineOutput,
    errors: [
      AccessDeniedException,
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
 * Updates the configuration of an already enabled control.
 *
 * If the enabled control shows an `EnablementStatus` of SUCCEEDED, supply parameters that are different from the currently configured parameters. Otherwise, Amazon Web Services Control Tower will not accept the request.
 *
 * If the enabled control shows an `EnablementStatus` of FAILED, Amazon Web Services Control Tower updates the control to match any valid parameters that you supply.
 *
 * If the `DriftSummary` status for the control shows as `DRIFTED`, you cannot call this API. Instead, you can update the control by calling the `ResetEnabledControl` API. Alternatively, you can call `DisableControl` and then call `EnableControl` again. Also, you can run an extending governance operation to repair drift. For usage examples, see the *Controls Reference Guide* .
 */
export const updateEnabledControl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateEnabledControlInput,
    output: UpdateEnabledControlOutput,
    errors: [
      AccessDeniedException,
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
 * Resets an enabled control. Does not work for controls implemented with SCPs.
 */
export const resetEnabledControl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetEnabledControlInput,
  output: ResetEnabledControlOutput,
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
/**
 * Retrieve details of an `EnabledBaseline` resource by specifying its identifier.
 */
export const getEnabledBaseline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnabledBaselineInput,
  output: GetEnabledBaselineOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details about an enabled control. For usage examples, see the *Controls Reference Guide* .
 */
export const getEnabledControl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnabledControlInput,
  output: GetEnabledControlOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

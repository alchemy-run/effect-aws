import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "NetworkMonitor",
  serviceShapeName: "NetworkMonitor",
});
const auth = T.AwsAuthSigv4({ name: "networkmonitor" });
const ver = T.ServiceVersion("2023-08-01");
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
                                url: "https://networkmonitor-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://networkmonitor-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://networkmonitor.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://networkmonitor.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
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
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
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
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}) {}
export class GetMonitorInput extends S.Class<GetMonitorInput>(
  "GetMonitorInput",
)(
  { monitorName: S.String.pipe(T.HttpLabel("monitorName")) },
  T.all(
    T.Http({ method: "GET", uri: "/monitors/{monitorName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMonitorInput extends S.Class<UpdateMonitorInput>(
  "UpdateMonitorInput",
)(
  {
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    aggregationPeriod: S.Number,
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/monitors/{monitorName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMonitorInput extends S.Class<DeleteMonitorInput>(
  "DeleteMonitorInput",
)(
  { monitorName: S.String.pipe(T.HttpLabel("monitorName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/monitors/{monitorName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMonitorOutput extends S.Class<DeleteMonitorOutput>(
  "DeleteMonitorOutput",
)({}) {}
export class ListMonitorsInput extends S.Class<ListMonitorsInput>(
  "ListMonitorsInput",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    state: S.optional(S.String).pipe(T.HttpQuery("state")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/monitors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetProbeInput extends S.Class<GetProbeInput>("GetProbeInput")(
  {
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    probeId: S.String.pipe(T.HttpLabel("probeId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/monitors/{monitorName}/probes/{probeId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateProbeInput extends S.Class<UpdateProbeInput>(
  "UpdateProbeInput",
)(
  {
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    probeId: S.String.pipe(T.HttpLabel("probeId")),
    state: S.optional(S.String),
    destination: S.optional(S.String),
    destinationPort: S.optional(S.Number),
    protocol: S.optional(S.String),
    packetSize: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/monitors/{monitorName}/probes/{probeId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProbeInput extends S.Class<DeleteProbeInput>(
  "DeleteProbeInput",
)(
  {
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    probeId: S.String.pipe(T.HttpLabel("probeId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/monitors/{monitorName}/probes/{probeId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProbeOutput extends S.Class<DeleteProbeOutput>(
  "DeleteProbeOutput",
)({}) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateMonitorProbeInput extends S.Class<CreateMonitorProbeInput>(
  "CreateMonitorProbeInput",
)({
  sourceArn: S.String,
  destination: S.String,
  destinationPort: S.optional(S.Number),
  protocol: S.String,
  packetSize: S.optional(S.Number),
  probeTags: S.optional(TagMap),
}) {}
export const CreateMonitorProbeInputList = S.Array(CreateMonitorProbeInput);
export class ProbeInput extends S.Class<ProbeInput>("ProbeInput")({
  sourceArn: S.String,
  destination: S.String,
  destinationPort: S.optional(S.Number),
  protocol: S.String,
  packetSize: S.optional(S.Number),
  tags: S.optional(TagMap),
}) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ tags: S.optional(TagMap) }) {}
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
export class CreateMonitorInput extends S.Class<CreateMonitorInput>(
  "CreateMonitorInput",
)(
  {
    monitorName: S.String,
    probes: S.optional(CreateMonitorProbeInputList),
    aggregationPeriod: S.optional(S.Number),
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/monitors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMonitorOutput extends S.Class<UpdateMonitorOutput>(
  "UpdateMonitorOutput",
)({
  monitorArn: S.String,
  monitorName: S.String,
  state: S.String,
  aggregationPeriod: S.optional(S.Number),
  tags: S.optional(TagMap),
}) {}
export class CreateProbeInput extends S.Class<CreateProbeInput>(
  "CreateProbeInput",
)(
  {
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    probe: ProbeInput,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/monitors/{monitorName}/probes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetProbeOutput extends S.Class<GetProbeOutput>("GetProbeOutput")({
  probeId: S.optional(S.String),
  probeArn: S.optional(S.String),
  sourceArn: S.String,
  destination: S.String,
  destinationPort: S.optional(S.Number),
  protocol: S.String,
  packetSize: S.optional(S.Number),
  addressFamily: S.optional(S.String),
  vpcId: S.optional(S.String),
  state: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagMap),
}) {}
export class UpdateProbeOutput extends S.Class<UpdateProbeOutput>(
  "UpdateProbeOutput",
)({
  probeId: S.optional(S.String),
  probeArn: S.optional(S.String),
  sourceArn: S.String,
  destination: S.String,
  destinationPort: S.optional(S.Number),
  protocol: S.String,
  packetSize: S.optional(S.Number),
  addressFamily: S.optional(S.String),
  vpcId: S.optional(S.String),
  state: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagMap),
}) {}
export class Probe extends S.Class<Probe>("Probe")({
  probeId: S.optional(S.String),
  probeArn: S.optional(S.String),
  sourceArn: S.String,
  destination: S.String,
  destinationPort: S.optional(S.Number),
  protocol: S.String,
  packetSize: S.optional(S.Number),
  addressFamily: S.optional(S.String),
  vpcId: S.optional(S.String),
  state: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagMap),
}) {}
export const ProbeList = S.Array(Probe);
export class MonitorSummary extends S.Class<MonitorSummary>("MonitorSummary")({
  monitorArn: S.String,
  monitorName: S.String,
  state: S.String,
  aggregationPeriod: S.optional(S.Number),
  tags: S.optional(TagMap),
}) {}
export const MonitorList = S.Array(MonitorSummary);
export class CreateMonitorOutput extends S.Class<CreateMonitorOutput>(
  "CreateMonitorOutput",
)({
  monitorArn: S.String,
  monitorName: S.String,
  state: S.String,
  aggregationPeriod: S.optional(S.Number),
  tags: S.optional(TagMap),
}) {}
export class GetMonitorOutput extends S.Class<GetMonitorOutput>(
  "GetMonitorOutput",
)({
  monitorArn: S.String,
  monitorName: S.String,
  state: S.String,
  aggregationPeriod: S.Number,
  tags: S.optional(TagMap),
  probes: S.optional(ProbeList),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  modifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class ListMonitorsOutput extends S.Class<ListMonitorsOutput>(
  "ListMonitorsOutput",
)({ monitors: MonitorList, nextToken: S.optional(S.String) }) {}
export class CreateProbeOutput extends S.Class<CreateProbeOutput>(
  "CreateProbeOutput",
)({
  probeId: S.optional(S.String),
  probeArn: S.optional(S.String),
  sourceArn: S.String,
  destination: S.String,
  destinationPort: S.optional(S.Number),
  protocol: S.String,
  packetSize: S.optional(S.Number),
  addressFamily: S.optional(S.String),
  vpcId: S.optional(S.String),
  state: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagMap),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns a list of all of your monitors.
 */
export const listMonitors = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListMonitorsInput,
    output: ListMonitorsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "monitors",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Creates a monitor between a source subnet and destination IP address. Within a monitor you'll create one or more probes that monitor network traffic between your source Amazon Web Services VPC subnets and your destination IP addresses. Each probe then aggregates and sends metrics to Amazon CloudWatch.
 *
 * You can also create a monitor with probes using this command. For each probe, you
 * define the following:
 *
 * - `source`—The subnet IDs where the probes will be created.
 *
 * - `destination`— The target destination IP address for the
 * probe.
 *
 * - `destinationPort`—Required only if the protocol is
 * `TCP`.
 *
 * - `protocol`—The communication protocol between the source and
 * destination. This will be either `TCP` or `ICMP`.
 *
 * - `packetSize`—The size of the packets. This must be a number between
 * `56` and `8500`.
 *
 * - (Optional) `tags` —Key-value pairs created and assigned to the
 * probe.
 */
export const createMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMonitorInput,
  output: CreateMonitorOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create a probe within a monitor. Once you create a probe, and it begins monitoring your
 * network traffic, you'll incur billing charges for that probe. This action requires the
 * `monitorName` parameter. Run `ListMonitors` to get a list of
 * monitor names. Note the name of the `monitorName` you want to create the
 * probe for.
 */
export const createProbe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProbeInput,
  output: CreateProbeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the tags assigned to this resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
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
 * Adds key-value pairs to a monitor or probe.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
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
 * Returns the details about a probe. This action requires both the
 * `monitorName` and `probeId` parameters. Run
 * `ListMonitors` to get a list of monitor names. Run
 * `GetMonitor` to get a list of probes and probe IDs.
 */
export const getProbe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProbeInput,
  output: GetProbeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a monitor probe. This action requires both the `monitorName` and `probeId` parameters. Run `ListMonitors` to get a list of monitor names. Run `GetMonitor` to get a list of probes and probe IDs.
 *
 * You can update the following para create a monitor with probes using this command. For
 * each probe, you define the following:
 *
 * - `state`—The state of the probe.
 *
 * - `destination`— The target destination IP address for the
 * probe.
 *
 * - `destinationPort`—Required only if the protocol is
 * `TCP`.
 *
 * - `protocol`—The communication protocol between the source and
 * destination. This will be either `TCP` or `ICMP`.
 *
 * - `packetSize`—The size of the packets. This must be a number between
 * `56` and `8500`.
 *
 * - (Optional) `tags` —Key-value pairs created and assigned to the
 * probe.
 */
export const updateProbe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProbeInput,
  output: UpdateProbeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a specified monitor.
 *
 * This action requires the `monitorName` parameter. Run
 * `ListMonitors` to get a list of monitor names.
 */
export const deleteMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMonitorInput,
  output: DeleteMonitorOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified probe. Once a probe is deleted you'll no longer incur any billing
 * fees for that probe.
 *
 * This action requires both the `monitorName` and `probeId`
 * parameters. Run `ListMonitors` to get a list of monitor names. Run
 * `GetMonitor` to get a list of probes and probe IDs. You can only delete a
 * single probe at a time using this action.
 */
export const deleteProbe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProbeInput,
  output: DeleteProbeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a key-value pair from a monitor or probe.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
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
 * Returns details about a specific monitor.
 *
 * This action requires the `monitorName` parameter. Run
 * `ListMonitors` to get a list of monitor names.
 */
export const getMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMonitorInput,
  output: GetMonitorOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the `aggregationPeriod` for a monitor. Monitors support an
 * `aggregationPeriod` of either `30` or `60` seconds.
 * This action requires the `monitorName` and `probeId` parameter.
 * Run `ListMonitors` to get a list of monitor names.
 */
export const updateMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMonitorInput,
  output: UpdateMonitorOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));

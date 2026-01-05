import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Route53 Recovery Cluster",
  serviceShapeName: "ToggleCustomerAPI",
});
const auth = T.AwsAuthSigv4({ name: "route53-recovery-cluster" });
const ver = T.ServiceVersion("2019-12-02");
const proto = T.AwsProtocolsAwsJson1_0();
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
                        url: "https://route53-recovery-cluster-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://route53-recovery-cluster-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://route53-recovery-cluster.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://route53-recovery-cluster.{Region}.{PartitionResult#dnsSuffix}",
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
export const Arns = S.Array(S.String);
export class GetRoutingControlStateRequest extends S.Class<GetRoutingControlStateRequest>(
  "GetRoutingControlStateRequest",
)(
  { RoutingControlArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRoutingControlsRequest extends S.Class<ListRoutingControlsRequest>(
  "ListRoutingControlsRequest",
)(
  {
    ControlPanelArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateRoutingControlStateRequest extends S.Class<UpdateRoutingControlStateRequest>(
  "UpdateRoutingControlStateRequest",
)(
  {
    RoutingControlArn: S.String,
    RoutingControlState: S.String,
    SafetyRulesToOverride: S.optional(Arns),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateRoutingControlStateResponse extends S.Class<UpdateRoutingControlStateResponse>(
  "UpdateRoutingControlStateResponse",
)({}) {}
export class UpdateRoutingControlStateEntry extends S.Class<UpdateRoutingControlStateEntry>(
  "UpdateRoutingControlStateEntry",
)({ RoutingControlArn: S.String, RoutingControlState: S.String }) {}
export const UpdateRoutingControlStateEntries = S.Array(
  UpdateRoutingControlStateEntry,
);
export class GetRoutingControlStateResponse extends S.Class<GetRoutingControlStateResponse>(
  "GetRoutingControlStateResponse",
)({
  RoutingControlArn: S.String,
  RoutingControlState: S.String,
  RoutingControlName: S.optional(S.String),
}) {}
export class UpdateRoutingControlStatesRequest extends S.Class<UpdateRoutingControlStatesRequest>(
  "UpdateRoutingControlStatesRequest",
)(
  {
    UpdateRoutingControlStateEntries: UpdateRoutingControlStateEntries,
    SafetyRulesToOverride: S.optional(Arns),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateRoutingControlStatesResponse extends S.Class<UpdateRoutingControlStatesResponse>(
  "UpdateRoutingControlStatesResponse",
)({}) {}
export class RoutingControl extends S.Class<RoutingControl>("RoutingControl")({
  ControlPanelArn: S.optional(S.String),
  ControlPanelName: S.optional(S.String),
  RoutingControlArn: S.optional(S.String),
  RoutingControlName: S.optional(S.String),
  RoutingControlState: S.optional(S.String),
  Owner: S.optional(S.String),
}) {}
export const RoutingControls = S.Array(RoutingControl);
export class ListRoutingControlsResponse extends S.Class<ListRoutingControlsResponse>(
  "ListRoutingControlsResponse",
)({ RoutingControls: RoutingControls, NextToken: S.optional(S.String) }) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class EndpointTemporarilyUnavailableException extends S.TaggedError<EndpointTemporarilyUnavailableException>()(
  "EndpointTemporarilyUnavailableException",
  { message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceLimitExceededException extends S.TaggedError<ServiceLimitExceededException>()(
  "ServiceLimitExceededException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    limitCode: S.String,
    serviceCode: S.String,
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.optional(S.String),
    fields: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Get the state for a routing control. A routing control is a simple on/off switch that you
 * can use to route traffic to cells. When a routing control state is set to ON, traffic flows to a cell. When
 * the state is set to OFF, traffic does not flow.
 *
 * Before you can create a routing control, you must first create a cluster, and then host the control
 * in a control panel on the cluster. For more information, see
 * Create routing control structures in the Amazon Route 53 Application Recovery Controller Developer Guide.
 * You access one of the endpoints for the cluster to get or update the routing control state to
 * redirect traffic for your application.
 *
 * You must specify Regional endpoints when you work with API cluster operations
 * to get or update routing control states in Route 53 ARC.
 *
 * To see a code example for getting a routing control state, including accessing Regional cluster endpoints
 * in sequence, see API examples
 * in the Amazon Route 53 Application Recovery Controller Developer Guide.
 *
 * Learn more about working with routing controls in the following topics in the
 * Amazon Route 53 Application Recovery Controller Developer Guide:
 *
 * -
 * Viewing and updating routing control states
 *
 * - Working with
 * routing controls in Route 53 ARC
 */
export const getRoutingControlState = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRoutingControlStateRequest,
    output: GetRoutingControlStateResponse,
    errors: [
      AccessDeniedException,
      EndpointTemporarilyUnavailableException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Set multiple routing control states. You can set the value for each state to be ON or OFF.
 * When the state is ON, traffic flows to a cell. When it's OFF, traffic does not
 * flow.
 *
 * With Route 53 ARC, you can add safety rules for routing controls, which are safeguards for routing
 * control state updates that help prevent unexpected outcomes, like fail open traffic routing. However,
 * there are scenarios when you might want to bypass the routing control safeguards that are enforced with
 * safety rules that you've configured. For example, you might want to fail over quickly for disaster recovery,
 * and one or more safety rules might be unexpectedly preventing you from updating a routing control state to
 * reroute traffic. In a "break glass" scenario like this, you can override one or more safety rules to change
 * a routing control state and fail over your application.
 *
 * The `SafetyRulesToOverride` property enables you override one or more safety rules and
 * update routing control states. For more information, see
 *
 * Override safety rules to reroute traffic in the Amazon Route 53 Application Recovery Controller Developer Guide.
 *
 * You must specify Regional endpoints when you work with API cluster operations
 * to get or update routing control states in Route 53 ARC.
 *
 * To see a code example for getting a routing control state, including accessing Regional cluster endpoints
 * in sequence, see API examples
 * in the Amazon Route 53 Application Recovery Controller Developer Guide.
 *
 * -
 * Viewing and updating routing control states
 *
 * - Working with routing controls overall
 */
export const updateRoutingControlStates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateRoutingControlStatesRequest,
    output: UpdateRoutingControlStatesResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      EndpointTemporarilyUnavailableException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceLimitExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * List routing control names and Amazon Resource Names (ARNs), as well as the routing control
 * state for each routing control, along with the control panel name and control panel ARN for the routing controls.
 * If you specify a control panel ARN, this call lists the routing controls in the control panel. Otherwise, it lists
 * all the routing controls in the cluster.
 *
 * A routing control is a simple on/off switch in Route 53 ARC that you
 * can use to route traffic to cells. When a routing control state is set to ON, traffic flows to a cell. When
 * the state is set to OFF, traffic does not flow.
 *
 * Before you can create a routing control, you must first create a cluster, and then host the control
 * in a control panel on the cluster. For more information, see
 * Create routing control structures in the Amazon Route 53 Application Recovery Controller Developer Guide.
 * You access one of the endpoints for the cluster to get or update the routing control state to
 * redirect traffic for your application.
 *
 * You must specify Regional endpoints when you work with API cluster operations
 * to use this API operation to list routing controls in Route 53 ARC.
 *
 * Learn more about working with routing controls in the following topics in the
 * Amazon Route 53 Application Recovery Controller Developer Guide:
 *
 * -
 * Viewing and updating routing control states
 *
 * - Working with
 * routing controls in Route 53 ARC
 */
export const listRoutingControls =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRoutingControlsRequest,
    output: ListRoutingControlsResponse,
    errors: [
      AccessDeniedException,
      EndpointTemporarilyUnavailableException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "RoutingControls",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Set the state of the routing control to reroute traffic. You can set the value to ON or
 * OFF. When the state is ON, traffic flows to a cell. When the state is OFF, traffic does not
 * flow.
 *
 * With Route 53 ARC, you can add safety rules for routing controls, which are safeguards for routing
 * control state updates that help prevent unexpected outcomes, like fail open traffic routing. However,
 * there are scenarios when you might want to bypass the routing control safeguards that are enforced with
 * safety rules that you've configured. For example, you might want to fail over quickly for disaster recovery,
 * and one or more safety rules might be unexpectedly preventing you from updating a routing control state to
 * reroute traffic. In a "break glass" scenario like this, you can override one or more safety rules to change
 * a routing control state and fail over your application.
 *
 * The `SafetyRulesToOverride` property enables you override one or more safety rules and
 * update routing control states. For more information, see
 *
 * Override safety rules to reroute traffic in the Amazon Route 53 Application Recovery Controller Developer Guide.
 *
 * You must specify Regional endpoints when you work with API cluster operations
 * to get or update routing control states in Route 53 ARC.
 *
 * To see a code example for getting a routing control state, including accessing Regional cluster endpoints
 * in sequence, see API examples
 * in the Amazon Route 53 Application Recovery Controller Developer Guide.
 *
 * -
 * Viewing and updating routing control states
 *
 * - Working with routing controls overall
 */
export const updateRoutingControlState = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateRoutingControlStateRequest,
    output: UpdateRoutingControlStateResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      EndpointTemporarilyUnavailableException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);

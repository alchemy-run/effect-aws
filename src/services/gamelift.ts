import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://gamelift.amazonaws.com/doc/");
const svc = T.AwsApiService({
  sdkId: "GameLift",
  serviceShapeName: "GameLift",
});
const auth = T.AwsAuthSigv4({ name: "gamelift" });
const ver = T.ServiceVersion("2015-10-01");
const proto = T.AwsProtocolsAwsJson1_1();
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
                        url: "https://gamelift-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://gamelift-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://gamelift.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://gamelift.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeVpcPeeringAuthorizationsInput extends S.Class<DescribeVpcPeeringAuthorizationsInput>(
  "DescribeVpcPeeringAuthorizationsInput",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const PlayerIdsForAcceptMatch = S.Array(S.String);
export const MetricGroupList = S.Array(S.String);
export const StringList = S.Array(S.String);
export const VpcSubnets = S.Array(S.String);
export const QueueArnsList = S.Array(S.String);
export const PlayerIdList = S.Array(S.String);
export const LocationList = S.Array(S.String);
export const FleetIdOrArnList = S.Array(S.String);
export const GameServerInstanceIds = S.Array(S.String);
export const GameSessionQueueNameOrArnList = S.Array(S.String);
export const MatchmakingIdList = S.Array(S.String);
export const MatchmakingConfigurationNameList = S.Array(S.String);
export const MatchmakingRuleSetNameList = S.Array(S.String);
export const LocationFilterList = S.Array(S.String);
export const GameServerGroupActions = S.Array(S.String);
export const FleetActionList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const ContainerFleetRemoveAttributeList = S.Array(S.String);
export class AcceptMatchInput extends S.Class<AcceptMatchInput>(
  "AcceptMatchInput",
)(
  {
    TicketId: S.String,
    PlayerIds: PlayerIdsForAcceptMatch,
    AcceptanceType: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AcceptMatchOutput extends S.Class<AcceptMatchOutput>(
  "AcceptMatchOutput",
)({}, ns) {}
export class LocationConfiguration extends S.Class<LocationConfiguration>(
  "LocationConfiguration",
)({ Location: S.String }) {}
export const LocationConfigurationList = S.Array(LocationConfiguration);
export class CreateFleetLocationsInput extends S.Class<CreateFleetLocationsInput>(
  "CreateFleetLocationsInput",
)(
  { FleetId: S.String, Locations: LocationConfigurationList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateLocationInput extends S.Class<CreateLocationInput>(
  "CreateLocationInput",
)(
  { LocationName: S.String, Tags: S.optional(TagList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GameProperty extends S.Class<GameProperty>("GameProperty")({
  Key: S.String,
  Value: S.String,
}) {}
export const GamePropertyList = S.Array(GameProperty);
export class CreateMatchmakingConfigurationInput extends S.Class<CreateMatchmakingConfigurationInput>(
  "CreateMatchmakingConfigurationInput",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    GameSessionQueueArns: S.optional(QueueArnsList),
    RequestTimeoutSeconds: S.Number,
    AcceptanceTimeoutSeconds: S.optional(S.Number),
    AcceptanceRequired: S.Boolean,
    RuleSetName: S.String,
    NotificationTarget: S.optional(S.String),
    AdditionalPlayerCount: S.optional(S.Number),
    CustomEventData: S.optional(S.String),
    GameProperties: S.optional(GamePropertyList),
    GameSessionData: S.optional(S.String),
    BackfillMode: S.optional(S.String),
    FlexMatchMode: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateMatchmakingRuleSetInput extends S.Class<CreateMatchmakingRuleSetInput>(
  "CreateMatchmakingRuleSetInput",
)(
  { Name: S.String, RuleSetBody: S.String, Tags: S.optional(TagList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePlayerSessionInput extends S.Class<CreatePlayerSessionInput>(
  "CreatePlayerSessionInput",
)(
  {
    GameSessionId: S.String,
    PlayerId: S.String,
    PlayerData: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class S3Location extends S.Class<S3Location>("S3Location")({
  Bucket: S.optional(S.String),
  Key: S.optional(S.String),
  RoleArn: S.optional(S.String),
  ObjectVersion: S.optional(S.String),
}) {}
export class CreateScriptInput extends S.Class<CreateScriptInput>(
  "CreateScriptInput",
)(
  {
    Name: S.optional(S.String),
    Version: S.optional(S.String),
    StorageLocation: S.optional(S3Location),
    ZipFile: S.optional(T.Blob),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateVpcPeeringAuthorizationInput extends S.Class<CreateVpcPeeringAuthorizationInput>(
  "CreateVpcPeeringAuthorizationInput",
)(
  { GameLiftAwsAccountId: S.String, PeerVpcId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateVpcPeeringConnectionInput extends S.Class<CreateVpcPeeringConnectionInput>(
  "CreateVpcPeeringConnectionInput",
)(
  { FleetId: S.String, PeerVpcAwsAccountId: S.String, PeerVpcId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateVpcPeeringConnectionOutput extends S.Class<CreateVpcPeeringConnectionOutput>(
  "CreateVpcPeeringConnectionOutput",
)({}, ns) {}
export class DeleteAliasInput extends S.Class<DeleteAliasInput>(
  "DeleteAliasInput",
)(
  { AliasId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAliasResponse extends S.Class<DeleteAliasResponse>(
  "DeleteAliasResponse",
)({}, ns) {}
export class DeleteBuildInput extends S.Class<DeleteBuildInput>(
  "DeleteBuildInput",
)(
  { BuildId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBuildResponse extends S.Class<DeleteBuildResponse>(
  "DeleteBuildResponse",
)({}, ns) {}
export class DeleteContainerFleetInput extends S.Class<DeleteContainerFleetInput>(
  "DeleteContainerFleetInput",
)(
  { FleetId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteContainerFleetOutput extends S.Class<DeleteContainerFleetOutput>(
  "DeleteContainerFleetOutput",
)({}, ns) {}
export class DeleteContainerGroupDefinitionInput extends S.Class<DeleteContainerGroupDefinitionInput>(
  "DeleteContainerGroupDefinitionInput",
)(
  {
    Name: S.String,
    VersionNumber: S.optional(S.Number),
    VersionCountToRetain: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteContainerGroupDefinitionOutput extends S.Class<DeleteContainerGroupDefinitionOutput>(
  "DeleteContainerGroupDefinitionOutput",
)({}, ns) {}
export class DeleteFleetInput extends S.Class<DeleteFleetInput>(
  "DeleteFleetInput",
)(
  { FleetId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFleetResponse extends S.Class<DeleteFleetResponse>(
  "DeleteFleetResponse",
)({}, ns) {}
export class DeleteFleetLocationsInput extends S.Class<DeleteFleetLocationsInput>(
  "DeleteFleetLocationsInput",
)(
  { FleetId: S.String, Locations: LocationList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGameServerGroupInput extends S.Class<DeleteGameServerGroupInput>(
  "DeleteGameServerGroupInput",
)(
  { GameServerGroupName: S.String, DeleteOption: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGameSessionQueueInput extends S.Class<DeleteGameSessionQueueInput>(
  "DeleteGameSessionQueueInput",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGameSessionQueueOutput extends S.Class<DeleteGameSessionQueueOutput>(
  "DeleteGameSessionQueueOutput",
)({}, ns) {}
export class DeleteLocationInput extends S.Class<DeleteLocationInput>(
  "DeleteLocationInput",
)(
  { LocationName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLocationOutput extends S.Class<DeleteLocationOutput>(
  "DeleteLocationOutput",
)({}, ns) {}
export class DeleteMatchmakingConfigurationInput extends S.Class<DeleteMatchmakingConfigurationInput>(
  "DeleteMatchmakingConfigurationInput",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteMatchmakingConfigurationOutput extends S.Class<DeleteMatchmakingConfigurationOutput>(
  "DeleteMatchmakingConfigurationOutput",
)({}, ns) {}
export class DeleteMatchmakingRuleSetInput extends S.Class<DeleteMatchmakingRuleSetInput>(
  "DeleteMatchmakingRuleSetInput",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteMatchmakingRuleSetOutput extends S.Class<DeleteMatchmakingRuleSetOutput>(
  "DeleteMatchmakingRuleSetOutput",
)({}, ns) {}
export class DeleteScalingPolicyInput extends S.Class<DeleteScalingPolicyInput>(
  "DeleteScalingPolicyInput",
)(
  { Name: S.String, FleetId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteScalingPolicyResponse extends S.Class<DeleteScalingPolicyResponse>(
  "DeleteScalingPolicyResponse",
)({}, ns) {}
export class DeleteScriptInput extends S.Class<DeleteScriptInput>(
  "DeleteScriptInput",
)(
  { ScriptId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteScriptResponse extends S.Class<DeleteScriptResponse>(
  "DeleteScriptResponse",
)({}, ns) {}
export class DeleteVpcPeeringAuthorizationInput extends S.Class<DeleteVpcPeeringAuthorizationInput>(
  "DeleteVpcPeeringAuthorizationInput",
)(
  { GameLiftAwsAccountId: S.String, PeerVpcId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteVpcPeeringAuthorizationOutput extends S.Class<DeleteVpcPeeringAuthorizationOutput>(
  "DeleteVpcPeeringAuthorizationOutput",
)({}, ns) {}
export class DeleteVpcPeeringConnectionInput extends S.Class<DeleteVpcPeeringConnectionInput>(
  "DeleteVpcPeeringConnectionInput",
)(
  { FleetId: S.String, VpcPeeringConnectionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteVpcPeeringConnectionOutput extends S.Class<DeleteVpcPeeringConnectionOutput>(
  "DeleteVpcPeeringConnectionOutput",
)({}, ns) {}
export class DeregisterComputeInput extends S.Class<DeregisterComputeInput>(
  "DeregisterComputeInput",
)(
  { FleetId: S.String, ComputeName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeregisterComputeOutput extends S.Class<DeregisterComputeOutput>(
  "DeregisterComputeOutput",
)({}, ns) {}
export class DeregisterGameServerInput extends S.Class<DeregisterGameServerInput>(
  "DeregisterGameServerInput",
)(
  { GameServerGroupName: S.String, GameServerId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeregisterGameServerResponse extends S.Class<DeregisterGameServerResponse>(
  "DeregisterGameServerResponse",
)({}, ns) {}
export class DescribeAliasInput extends S.Class<DescribeAliasInput>(
  "DescribeAliasInput",
)(
  { AliasId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeBuildInput extends S.Class<DescribeBuildInput>(
  "DescribeBuildInput",
)(
  { BuildId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeComputeInput extends S.Class<DescribeComputeInput>(
  "DescribeComputeInput",
)(
  { FleetId: S.String, ComputeName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeContainerFleetInput extends S.Class<DescribeContainerFleetInput>(
  "DescribeContainerFleetInput",
)(
  { FleetId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeContainerGroupDefinitionInput extends S.Class<DescribeContainerGroupDefinitionInput>(
  "DescribeContainerGroupDefinitionInput",
)(
  { Name: S.String, VersionNumber: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEC2InstanceLimitsInput extends S.Class<DescribeEC2InstanceLimitsInput>(
  "DescribeEC2InstanceLimitsInput",
)(
  { EC2InstanceType: S.optional(S.String), Location: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFleetAttributesInput extends S.Class<DescribeFleetAttributesInput>(
  "DescribeFleetAttributesInput",
)(
  {
    FleetIds: S.optional(FleetIdOrArnList),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFleetCapacityInput extends S.Class<DescribeFleetCapacityInput>(
  "DescribeFleetCapacityInput",
)(
  {
    FleetIds: S.optional(FleetIdOrArnList),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFleetDeploymentInput extends S.Class<DescribeFleetDeploymentInput>(
  "DescribeFleetDeploymentInput",
)(
  { FleetId: S.String, DeploymentId: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFleetEventsInput extends S.Class<DescribeFleetEventsInput>(
  "DescribeFleetEventsInput",
)(
  {
    FleetId: S.String,
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFleetLocationAttributesInput extends S.Class<DescribeFleetLocationAttributesInput>(
  "DescribeFleetLocationAttributesInput",
)(
  {
    FleetId: S.String,
    Locations: S.optional(LocationList),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFleetLocationCapacityInput extends S.Class<DescribeFleetLocationCapacityInput>(
  "DescribeFleetLocationCapacityInput",
)(
  { FleetId: S.String, Location: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFleetLocationUtilizationInput extends S.Class<DescribeFleetLocationUtilizationInput>(
  "DescribeFleetLocationUtilizationInput",
)(
  { FleetId: S.String, Location: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFleetPortSettingsInput extends S.Class<DescribeFleetPortSettingsInput>(
  "DescribeFleetPortSettingsInput",
)(
  { FleetId: S.String, Location: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFleetUtilizationInput extends S.Class<DescribeFleetUtilizationInput>(
  "DescribeFleetUtilizationInput",
)(
  {
    FleetIds: S.optional(FleetIdOrArnList),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeGameServerInput extends S.Class<DescribeGameServerInput>(
  "DescribeGameServerInput",
)(
  { GameServerGroupName: S.String, GameServerId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeGameServerGroupInput extends S.Class<DescribeGameServerGroupInput>(
  "DescribeGameServerGroupInput",
)(
  { GameServerGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeGameServerInstancesInput extends S.Class<DescribeGameServerInstancesInput>(
  "DescribeGameServerInstancesInput",
)(
  {
    GameServerGroupName: S.String,
    InstanceIds: S.optional(GameServerInstanceIds),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeGameSessionDetailsInput extends S.Class<DescribeGameSessionDetailsInput>(
  "DescribeGameSessionDetailsInput",
)(
  {
    FleetId: S.optional(S.String),
    GameSessionId: S.optional(S.String),
    AliasId: S.optional(S.String),
    Location: S.optional(S.String),
    StatusFilter: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeGameSessionPlacementInput extends S.Class<DescribeGameSessionPlacementInput>(
  "DescribeGameSessionPlacementInput",
)(
  { PlacementId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeGameSessionQueuesInput extends S.Class<DescribeGameSessionQueuesInput>(
  "DescribeGameSessionQueuesInput",
)(
  {
    Names: S.optional(GameSessionQueueNameOrArnList),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeGameSessionsInput extends S.Class<DescribeGameSessionsInput>(
  "DescribeGameSessionsInput",
)(
  {
    FleetId: S.optional(S.String),
    GameSessionId: S.optional(S.String),
    AliasId: S.optional(S.String),
    Location: S.optional(S.String),
    StatusFilter: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeInstancesInput extends S.Class<DescribeInstancesInput>(
  "DescribeInstancesInput",
)(
  {
    FleetId: S.String,
    InstanceId: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Location: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMatchmakingInput extends S.Class<DescribeMatchmakingInput>(
  "DescribeMatchmakingInput",
)(
  { TicketIds: MatchmakingIdList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMatchmakingConfigurationsInput extends S.Class<DescribeMatchmakingConfigurationsInput>(
  "DescribeMatchmakingConfigurationsInput",
)(
  {
    Names: S.optional(MatchmakingConfigurationNameList),
    RuleSetName: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMatchmakingRuleSetsInput extends S.Class<DescribeMatchmakingRuleSetsInput>(
  "DescribeMatchmakingRuleSetsInput",
)(
  {
    Names: S.optional(MatchmakingRuleSetNameList),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePlayerSessionsInput extends S.Class<DescribePlayerSessionsInput>(
  "DescribePlayerSessionsInput",
)(
  {
    GameSessionId: S.optional(S.String),
    PlayerId: S.optional(S.String),
    PlayerSessionId: S.optional(S.String),
    PlayerSessionStatusFilter: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRuntimeConfigurationInput extends S.Class<DescribeRuntimeConfigurationInput>(
  "DescribeRuntimeConfigurationInput",
)(
  { FleetId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeScalingPoliciesInput extends S.Class<DescribeScalingPoliciesInput>(
  "DescribeScalingPoliciesInput",
)(
  {
    FleetId: S.String,
    StatusFilter: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Location: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeScriptInput extends S.Class<DescribeScriptInput>(
  "DescribeScriptInput",
)(
  { ScriptId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeVpcPeeringConnectionsInput extends S.Class<DescribeVpcPeeringConnectionsInput>(
  "DescribeVpcPeeringConnectionsInput",
)(
  { FleetId: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetComputeAccessInput extends S.Class<GetComputeAccessInput>(
  "GetComputeAccessInput",
)(
  { FleetId: S.String, ComputeName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetComputeAuthTokenInput extends S.Class<GetComputeAuthTokenInput>(
  "GetComputeAuthTokenInput",
)(
  { FleetId: S.String, ComputeName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetGameSessionLogUrlInput extends S.Class<GetGameSessionLogUrlInput>(
  "GetGameSessionLogUrlInput",
)(
  { GameSessionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetInstanceAccessInput extends S.Class<GetInstanceAccessInput>(
  "GetInstanceAccessInput",
)(
  { FleetId: S.String, InstanceId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAliasesInput extends S.Class<ListAliasesInput>(
  "ListAliasesInput",
)(
  {
    RoutingStrategyType: S.optional(S.String),
    Name: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListBuildsInput extends S.Class<ListBuildsInput>(
  "ListBuildsInput",
)(
  {
    Status: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListComputeInput extends S.Class<ListComputeInput>(
  "ListComputeInput",
)(
  {
    FleetId: S.String,
    Location: S.optional(S.String),
    ContainerGroupDefinitionName: S.optional(S.String),
    ComputeStatus: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListContainerFleetsInput extends S.Class<ListContainerFleetsInput>(
  "ListContainerFleetsInput",
)(
  {
    ContainerGroupDefinitionName: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListContainerGroupDefinitionsInput extends S.Class<ListContainerGroupDefinitionsInput>(
  "ListContainerGroupDefinitionsInput",
)(
  {
    ContainerGroupType: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListContainerGroupDefinitionVersionsInput extends S.Class<ListContainerGroupDefinitionVersionsInput>(
  "ListContainerGroupDefinitionVersionsInput",
)(
  {
    Name: S.String,
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFleetDeploymentsInput extends S.Class<ListFleetDeploymentsInput>(
  "ListFleetDeploymentsInput",
)(
  {
    FleetId: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFleetsInput extends S.Class<ListFleetsInput>(
  "ListFleetsInput",
)(
  {
    BuildId: S.optional(S.String),
    ScriptId: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListGameServerGroupsInput extends S.Class<ListGameServerGroupsInput>(
  "ListGameServerGroupsInput",
)(
  { Limit: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListGameServersInput extends S.Class<ListGameServersInput>(
  "ListGameServersInput",
)(
  {
    GameServerGroupName: S.String,
    SortOrder: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLocationsInput extends S.Class<ListLocationsInput>(
  "ListLocationsInput",
)(
  {
    Filters: S.optional(LocationFilterList),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListScriptsInput extends S.Class<ListScriptsInput>(
  "ListScriptsInput",
)(
  { Limit: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterComputeInput extends S.Class<RegisterComputeInput>(
  "RegisterComputeInput",
)(
  {
    FleetId: S.String,
    ComputeName: S.String,
    CertificatePath: S.optional(S.String),
    DnsName: S.optional(S.String),
    IpAddress: S.optional(S.String),
    Location: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterGameServerInput extends S.Class<RegisterGameServerInput>(
  "RegisterGameServerInput",
)(
  {
    GameServerGroupName: S.String,
    GameServerId: S.String,
    InstanceId: S.String,
    ConnectionInfo: S.optional(S.String),
    GameServerData: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RequestUploadCredentialsInput extends S.Class<RequestUploadCredentialsInput>(
  "RequestUploadCredentialsInput",
)(
  { BuildId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResolveAliasInput extends S.Class<ResolveAliasInput>(
  "ResolveAliasInput",
)(
  { AliasId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResumeGameServerGroupInput extends S.Class<ResumeGameServerGroupInput>(
  "ResumeGameServerGroupInput",
)(
  { GameServerGroupName: S.String, ResumeActions: GameServerGroupActions },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SearchGameSessionsInput extends S.Class<SearchGameSessionsInput>(
  "SearchGameSessionsInput",
)(
  {
    FleetId: S.optional(S.String),
    AliasId: S.optional(S.String),
    Location: S.optional(S.String),
    FilterExpression: S.optional(S.String),
    SortExpression: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartFleetActionsInput extends S.Class<StartFleetActionsInput>(
  "StartFleetActionsInput",
)(
  {
    FleetId: S.String,
    Actions: FleetActionList,
    Location: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const PlayerAttributeStringList = S.Array(S.String);
export const PlayerAttributeStringDoubleMap = S.Record({
  key: S.String,
  value: S.Number,
});
export class AttributeValue extends S.Class<AttributeValue>("AttributeValue")({
  S: S.optional(S.String),
  N: S.optional(S.Number),
  SL: S.optional(PlayerAttributeStringList),
  SDM: S.optional(PlayerAttributeStringDoubleMap),
}) {}
export const PlayerAttributeMap = S.Record({
  key: S.String,
  value: AttributeValue,
});
export const LatencyMap = S.Record({ key: S.String, value: S.Number });
export class Player extends S.Class<Player>("Player")({
  PlayerId: S.optional(S.String),
  PlayerAttributes: S.optional(PlayerAttributeMap),
  Team: S.optional(S.String),
  LatencyInMs: S.optional(LatencyMap),
}) {}
export const PlayerList = S.Array(Player);
export class StartMatchmakingInput extends S.Class<StartMatchmakingInput>(
  "StartMatchmakingInput",
)(
  {
    TicketId: S.optional(S.String),
    ConfigurationName: S.String,
    Players: PlayerList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopFleetActionsInput extends S.Class<StopFleetActionsInput>(
  "StopFleetActionsInput",
)(
  {
    FleetId: S.String,
    Actions: FleetActionList,
    Location: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopGameSessionPlacementInput extends S.Class<StopGameSessionPlacementInput>(
  "StopGameSessionPlacementInput",
)(
  { PlacementId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopMatchmakingInput extends S.Class<StopMatchmakingInput>(
  "StopMatchmakingInput",
)(
  { TicketId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopMatchmakingOutput extends S.Class<StopMatchmakingOutput>(
  "StopMatchmakingOutput",
)({}, ns) {}
export class SuspendGameServerGroupInput extends S.Class<SuspendGameServerGroupInput>(
  "SuspendGameServerGroupInput",
)(
  { GameServerGroupName: S.String, SuspendActions: GameServerGroupActions },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class TerminateGameSessionInput extends S.Class<TerminateGameSessionInput>(
  "TerminateGameSessionInput",
)(
  { GameSessionId: S.String, TerminationMode: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class RoutingStrategy extends S.Class<RoutingStrategy>(
  "RoutingStrategy",
)({
  Type: S.optional(S.String),
  FleetId: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export class UpdateAliasInput extends S.Class<UpdateAliasInput>(
  "UpdateAliasInput",
)(
  {
    AliasId: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    RoutingStrategy: S.optional(RoutingStrategy),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateBuildInput extends S.Class<UpdateBuildInput>(
  "UpdateBuildInput",
)(
  {
    BuildId: S.String,
    Name: S.optional(S.String),
    Version: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ContainerDependency extends S.Class<ContainerDependency>(
  "ContainerDependency",
)({ ContainerName: S.String, Condition: S.String }) {}
export const ContainerDependencyList = S.Array(ContainerDependency);
export class ContainerMountPoint extends S.Class<ContainerMountPoint>(
  "ContainerMountPoint",
)({
  InstancePath: S.String,
  ContainerPath: S.optional(S.String),
  AccessLevel: S.optional(S.String),
}) {}
export const ContainerMountPointList = S.Array(ContainerMountPoint);
export class ContainerEnvironment extends S.Class<ContainerEnvironment>(
  "ContainerEnvironment",
)({ Name: S.String, Value: S.String }) {}
export const ContainerEnvironmentList = S.Array(ContainerEnvironment);
export class ContainerPortRange extends S.Class<ContainerPortRange>(
  "ContainerPortRange",
)({ FromPort: S.Number, ToPort: S.Number, Protocol: S.String }) {}
export const ContainerPortRangeList = S.Array(ContainerPortRange);
export class ContainerPortConfiguration extends S.Class<ContainerPortConfiguration>(
  "ContainerPortConfiguration",
)({ ContainerPortRanges: ContainerPortRangeList }) {}
export class GameServerContainerDefinitionInput extends S.Class<GameServerContainerDefinitionInput>(
  "GameServerContainerDefinitionInput",
)({
  ContainerName: S.String,
  DependsOn: S.optional(ContainerDependencyList),
  MountPoints: S.optional(ContainerMountPointList),
  EnvironmentOverride: S.optional(ContainerEnvironmentList),
  ImageUri: S.String,
  PortConfiguration: ContainerPortConfiguration,
  ServerSdkVersion: S.String,
}) {}
export const ContainerCommandStringList = S.Array(S.String);
export class ContainerHealthCheck extends S.Class<ContainerHealthCheck>(
  "ContainerHealthCheck",
)({
  Command: ContainerCommandStringList,
  Interval: S.optional(S.Number),
  Retries: S.optional(S.Number),
  StartPeriod: S.optional(S.Number),
  Timeout: S.optional(S.Number),
}) {}
export class SupportContainerDefinitionInput extends S.Class<SupportContainerDefinitionInput>(
  "SupportContainerDefinitionInput",
)({
  ContainerName: S.String,
  DependsOn: S.optional(ContainerDependencyList),
  MountPoints: S.optional(ContainerMountPointList),
  EnvironmentOverride: S.optional(ContainerEnvironmentList),
  Essential: S.optional(S.Boolean),
  HealthCheck: S.optional(ContainerHealthCheck),
  ImageUri: S.String,
  MemoryHardLimitMebibytes: S.optional(S.Number),
  PortConfiguration: S.optional(ContainerPortConfiguration),
  Vcpu: S.optional(S.Number),
}) {}
export const SupportContainerDefinitionInputList = S.Array(
  SupportContainerDefinitionInput,
);
export class UpdateContainerGroupDefinitionInput extends S.Class<UpdateContainerGroupDefinitionInput>(
  "UpdateContainerGroupDefinitionInput",
)(
  {
    Name: S.String,
    GameServerContainerDefinition: S.optional(
      GameServerContainerDefinitionInput,
    ),
    SupportContainerDefinitions: S.optional(
      SupportContainerDefinitionInputList,
    ),
    TotalMemoryLimitMebibytes: S.optional(S.Number),
    TotalVcpuLimit: S.optional(S.Number),
    VersionDescription: S.optional(S.String),
    SourceVersionNumber: S.optional(S.Number),
    OperatingSystem: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResourceCreationLimitPolicy extends S.Class<ResourceCreationLimitPolicy>(
  "ResourceCreationLimitPolicy",
)({
  NewGameSessionsPerCreator: S.optional(S.Number),
  PolicyPeriodInMinutes: S.optional(S.Number),
}) {}
export class AnywhereConfiguration extends S.Class<AnywhereConfiguration>(
  "AnywhereConfiguration",
)({ Cost: S.String }) {}
export class UpdateFleetAttributesInput extends S.Class<UpdateFleetAttributesInput>(
  "UpdateFleetAttributesInput",
)(
  {
    FleetId: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    NewGameSessionProtectionPolicy: S.optional(S.String),
    ResourceCreationLimitPolicy: S.optional(ResourceCreationLimitPolicy),
    MetricGroups: S.optional(MetricGroupList),
    AnywhereConfiguration: S.optional(AnywhereConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateFleetCapacityInput extends S.Class<UpdateFleetCapacityInput>(
  "UpdateFleetCapacityInput",
)(
  {
    FleetId: S.String,
    DesiredInstances: S.optional(S.Number),
    MinSize: S.optional(S.Number),
    MaxSize: S.optional(S.Number),
    Location: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class IpPermission extends S.Class<IpPermission>("IpPermission")({
  FromPort: S.Number,
  ToPort: S.Number,
  IpRange: S.String,
  Protocol: S.String,
}) {}
export const IpPermissionsList = S.Array(IpPermission);
export class UpdateFleetPortSettingsInput extends S.Class<UpdateFleetPortSettingsInput>(
  "UpdateFleetPortSettingsInput",
)(
  {
    FleetId: S.String,
    InboundPermissionAuthorizations: S.optional(IpPermissionsList),
    InboundPermissionRevocations: S.optional(IpPermissionsList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateGameServerInput extends S.Class<UpdateGameServerInput>(
  "UpdateGameServerInput",
)(
  {
    GameServerGroupName: S.String,
    GameServerId: S.String,
    GameServerData: S.optional(S.String),
    UtilizationStatus: S.optional(S.String),
    HealthCheck: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class InstanceDefinition extends S.Class<InstanceDefinition>(
  "InstanceDefinition",
)({ InstanceType: S.String, WeightedCapacity: S.optional(S.String) }) {}
export const InstanceDefinitions = S.Array(InstanceDefinition);
export class UpdateGameServerGroupInput extends S.Class<UpdateGameServerGroupInput>(
  "UpdateGameServerGroupInput",
)(
  {
    GameServerGroupName: S.String,
    RoleArn: S.optional(S.String),
    InstanceDefinitions: S.optional(InstanceDefinitions),
    GameServerProtectionPolicy: S.optional(S.String),
    BalancingStrategy: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateGameSessionInput extends S.Class<UpdateGameSessionInput>(
  "UpdateGameSessionInput",
)(
  {
    GameSessionId: S.String,
    MaximumPlayerSessionCount: S.optional(S.Number),
    Name: S.optional(S.String),
    PlayerSessionCreationPolicy: S.optional(S.String),
    ProtectionPolicy: S.optional(S.String),
    GameProperties: S.optional(GamePropertyList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PlayerLatencyPolicy extends S.Class<PlayerLatencyPolicy>(
  "PlayerLatencyPolicy",
)({
  MaximumIndividualPlayerLatencyMilliseconds: S.optional(S.Number),
  PolicyDurationSeconds: S.optional(S.Number),
}) {}
export const PlayerLatencyPolicyList = S.Array(PlayerLatencyPolicy);
export class GameSessionQueueDestination extends S.Class<GameSessionQueueDestination>(
  "GameSessionQueueDestination",
)({ DestinationArn: S.optional(S.String) }) {}
export const GameSessionQueueDestinationList = S.Array(
  GameSessionQueueDestination,
);
export class FilterConfiguration extends S.Class<FilterConfiguration>(
  "FilterConfiguration",
)({ AllowedLocations: S.optional(LocationList) }) {}
export const PriorityTypeList = S.Array(S.String);
export class PriorityConfiguration extends S.Class<PriorityConfiguration>(
  "PriorityConfiguration",
)({
  PriorityOrder: S.optional(PriorityTypeList),
  LocationOrder: S.optional(LocationList),
}) {}
export class UpdateGameSessionQueueInput extends S.Class<UpdateGameSessionQueueInput>(
  "UpdateGameSessionQueueInput",
)(
  {
    Name: S.String,
    TimeoutInSeconds: S.optional(S.Number),
    PlayerLatencyPolicies: S.optional(PlayerLatencyPolicyList),
    Destinations: S.optional(GameSessionQueueDestinationList),
    FilterConfiguration: S.optional(FilterConfiguration),
    PriorityConfiguration: S.optional(PriorityConfiguration),
    CustomEventData: S.optional(S.String),
    NotificationTarget: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateMatchmakingConfigurationInput extends S.Class<UpdateMatchmakingConfigurationInput>(
  "UpdateMatchmakingConfigurationInput",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    GameSessionQueueArns: S.optional(QueueArnsList),
    RequestTimeoutSeconds: S.optional(S.Number),
    AcceptanceTimeoutSeconds: S.optional(S.Number),
    AcceptanceRequired: S.optional(S.Boolean),
    RuleSetName: S.optional(S.String),
    NotificationTarget: S.optional(S.String),
    AdditionalPlayerCount: S.optional(S.Number),
    CustomEventData: S.optional(S.String),
    GameProperties: S.optional(GamePropertyList),
    GameSessionData: S.optional(S.String),
    BackfillMode: S.optional(S.String),
    FlexMatchMode: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ServerProcess extends S.Class<ServerProcess>("ServerProcess")({
  LaunchPath: S.String,
  Parameters: S.optional(S.String),
  ConcurrentExecutions: S.Number,
}) {}
export const ServerProcessList = S.Array(ServerProcess);
export class RuntimeConfiguration extends S.Class<RuntimeConfiguration>(
  "RuntimeConfiguration",
)({
  ServerProcesses: S.optional(ServerProcessList),
  MaxConcurrentGameSessionActivations: S.optional(S.Number),
  GameSessionActivationTimeoutSeconds: S.optional(S.Number),
}) {}
export class UpdateRuntimeConfigurationInput extends S.Class<UpdateRuntimeConfigurationInput>(
  "UpdateRuntimeConfigurationInput",
)(
  { FleetId: S.String, RuntimeConfiguration: RuntimeConfiguration },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateScriptInput extends S.Class<UpdateScriptInput>(
  "UpdateScriptInput",
)(
  {
    ScriptId: S.String,
    Name: S.optional(S.String),
    Version: S.optional(S.String),
    StorageLocation: S.optional(S3Location),
    ZipFile: S.optional(T.Blob),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ValidateMatchmakingRuleSetInput extends S.Class<ValidateMatchmakingRuleSetInput>(
  "ValidateMatchmakingRuleSetInput",
)(
  { RuleSetBody: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const FilterInstanceStatuses = S.Array(S.String);
export const LocationOrderOverrideList = S.Array(S.String);
export class ClaimFilterOption extends S.Class<ClaimFilterOption>(
  "ClaimFilterOption",
)({ InstanceStatuses: S.optional(FilterInstanceStatuses) }) {}
export class ConnectionPortRange extends S.Class<ConnectionPortRange>(
  "ConnectionPortRange",
)({ FromPort: S.Number, ToPort: S.Number }) {}
export class GameSessionCreationLimitPolicy extends S.Class<GameSessionCreationLimitPolicy>(
  "GameSessionCreationLimitPolicy",
)({
  NewGameSessionsPerCreator: S.optional(S.Number),
  PolicyPeriodInMinutes: S.optional(S.Number),
}) {}
export class LogConfiguration extends S.Class<LogConfiguration>(
  "LogConfiguration",
)({
  LogDestination: S.optional(S.String),
  S3BucketName: S.optional(S.String),
  LogGroupArn: S.optional(S.String),
}) {}
export class CertificateConfiguration extends S.Class<CertificateConfiguration>(
  "CertificateConfiguration",
)({ CertificateType: S.String }) {}
export class LaunchTemplateSpecification extends S.Class<LaunchTemplateSpecification>(
  "LaunchTemplateSpecification",
)({
  LaunchTemplateId: S.optional(S.String),
  LaunchTemplateName: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export const PlayerDataMap = S.Record({ key: S.String, value: S.String });
export class FleetUtilization extends S.Class<FleetUtilization>(
  "FleetUtilization",
)({
  FleetId: S.optional(S.String),
  FleetArn: S.optional(S.String),
  ActiveServerProcessCount: S.optional(S.Number),
  ActiveGameSessionCount: S.optional(S.Number),
  CurrentPlayerSessionCount: S.optional(S.Number),
  MaximumPlayerSessionCount: S.optional(S.Number),
  Location: S.optional(S.String),
}) {}
export const FleetUtilizationList = S.Array(FleetUtilization);
export class MatchmakingConfiguration extends S.Class<MatchmakingConfiguration>(
  "MatchmakingConfiguration",
)({
  Name: S.optional(S.String),
  ConfigurationArn: S.optional(S.String),
  Description: S.optional(S.String),
  GameSessionQueueArns: S.optional(QueueArnsList),
  RequestTimeoutSeconds: S.optional(S.Number),
  AcceptanceTimeoutSeconds: S.optional(S.Number),
  AcceptanceRequired: S.optional(S.Boolean),
  RuleSetName: S.optional(S.String),
  RuleSetArn: S.optional(S.String),
  NotificationTarget: S.optional(S.String),
  AdditionalPlayerCount: S.optional(S.Number),
  CustomEventData: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  GameProperties: S.optional(GamePropertyList),
  GameSessionData: S.optional(S.String),
  BackfillMode: S.optional(S.String),
  FlexMatchMode: S.optional(S.String),
}) {}
export const MatchmakingConfigurationList = S.Array(MatchmakingConfiguration);
export class MatchmakingRuleSet extends S.Class<MatchmakingRuleSet>(
  "MatchmakingRuleSet",
)({
  RuleSetName: S.optional(S.String),
  RuleSetArn: S.optional(S.String),
  RuleSetBody: S.String,
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const MatchmakingRuleSetList = S.Array(MatchmakingRuleSet);
export class PlayerSession extends S.Class<PlayerSession>("PlayerSession")({
  PlayerSessionId: S.optional(S.String),
  PlayerId: S.optional(S.String),
  GameSessionId: S.optional(S.String),
  FleetId: S.optional(S.String),
  FleetArn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TerminationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  IpAddress: S.optional(S.String),
  DnsName: S.optional(S.String),
  Port: S.optional(S.Number),
  PlayerData: S.optional(S.String),
}) {}
export const PlayerSessionList = S.Array(PlayerSession);
export class VpcPeeringAuthorization extends S.Class<VpcPeeringAuthorization>(
  "VpcPeeringAuthorization",
)({
  GameLiftAwsAccountId: S.optional(S.String),
  PeerVpcAwsAccountId: S.optional(S.String),
  PeerVpcId: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const VpcPeeringAuthorizationList = S.Array(VpcPeeringAuthorization);
export class Alias extends S.Class<Alias>("Alias")({
  AliasId: S.optional(S.String),
  Name: S.optional(S.String),
  AliasArn: S.optional(S.String),
  Description: S.optional(S.String),
  RoutingStrategy: S.optional(RoutingStrategy),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const AliasList = S.Array(Alias);
export class Build extends S.Class<Build>("Build")({
  BuildId: S.optional(S.String),
  BuildArn: S.optional(S.String),
  Name: S.optional(S.String),
  Version: S.optional(S.String),
  Status: S.optional(S.String),
  SizeOnDisk: S.optional(S.Number),
  OperatingSystem: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ServerSdkVersion: S.optional(S.String),
}) {}
export const BuildList = S.Array(Build);
export class ContainerAttribute extends S.Class<ContainerAttribute>(
  "ContainerAttribute",
)({
  ContainerName: S.optional(S.String),
  ContainerRuntimeId: S.optional(S.String),
}) {}
export const ContainerAttributes = S.Array(ContainerAttribute);
export class Compute extends S.Class<Compute>("Compute")({
  FleetId: S.optional(S.String),
  FleetArn: S.optional(S.String),
  ComputeName: S.optional(S.String),
  ComputeArn: S.optional(S.String),
  IpAddress: S.optional(S.String),
  DnsName: S.optional(S.String),
  ComputeStatus: S.optional(S.String),
  Location: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  OperatingSystem: S.optional(S.String),
  Type: S.optional(S.String),
  GameLiftServiceSdkEndpoint: S.optional(S.String),
  GameLiftAgentEndpoint: S.optional(S.String),
  InstanceId: S.optional(S.String),
  ContainerAttributes: S.optional(ContainerAttributes),
  GameServerContainerGroupDefinitionArn: S.optional(S.String),
}) {}
export const ComputeList = S.Array(Compute);
export class DeploymentDetails extends S.Class<DeploymentDetails>(
  "DeploymentDetails",
)({ LatestDeploymentId: S.optional(S.String) }) {}
export class ContainerFleetLocationAttributes extends S.Class<ContainerFleetLocationAttributes>(
  "ContainerFleetLocationAttributes",
)({ Location: S.optional(S.String), Status: S.optional(S.String) }) {}
export const ContainerFleetLocationAttributesList = S.Array(
  ContainerFleetLocationAttributes,
);
export class ContainerFleet extends S.Class<ContainerFleet>("ContainerFleet")({
  FleetId: S.optional(S.String),
  FleetArn: S.optional(S.String),
  FleetRoleArn: S.optional(S.String),
  GameServerContainerGroupDefinitionName: S.optional(S.String),
  GameServerContainerGroupDefinitionArn: S.optional(S.String),
  PerInstanceContainerGroupDefinitionName: S.optional(S.String),
  PerInstanceContainerGroupDefinitionArn: S.optional(S.String),
  InstanceConnectionPortRange: S.optional(ConnectionPortRange),
  InstanceInboundPermissions: S.optional(IpPermissionsList),
  GameServerContainerGroupsPerInstance: S.optional(S.Number),
  MaximumGameServerContainerGroupsPerInstance: S.optional(S.Number),
  InstanceType: S.optional(S.String),
  BillingType: S.optional(S.String),
  Description: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  MetricGroups: S.optional(MetricGroupList),
  NewGameSessionProtectionPolicy: S.optional(S.String),
  GameSessionCreationLimitPolicy: S.optional(GameSessionCreationLimitPolicy),
  Status: S.optional(S.String),
  DeploymentDetails: S.optional(DeploymentDetails),
  LogConfiguration: S.optional(LogConfiguration),
  LocationAttributes: S.optional(ContainerFleetLocationAttributesList),
}) {}
export const ContainerFleetList = S.Array(ContainerFleet);
export class GameServerContainerDefinition extends S.Class<GameServerContainerDefinition>(
  "GameServerContainerDefinition",
)({
  ContainerName: S.optional(S.String),
  DependsOn: S.optional(ContainerDependencyList),
  MountPoints: S.optional(ContainerMountPointList),
  EnvironmentOverride: S.optional(ContainerEnvironmentList),
  ImageUri: S.optional(S.String),
  PortConfiguration: S.optional(ContainerPortConfiguration),
  ResolvedImageDigest: S.optional(S.String),
  ServerSdkVersion: S.optional(S.String),
}) {}
export class SupportContainerDefinition extends S.Class<SupportContainerDefinition>(
  "SupportContainerDefinition",
)({
  ContainerName: S.optional(S.String),
  DependsOn: S.optional(ContainerDependencyList),
  MountPoints: S.optional(ContainerMountPointList),
  EnvironmentOverride: S.optional(ContainerEnvironmentList),
  Essential: S.optional(S.Boolean),
  HealthCheck: S.optional(ContainerHealthCheck),
  ImageUri: S.optional(S.String),
  MemoryHardLimitMebibytes: S.optional(S.Number),
  PortConfiguration: S.optional(ContainerPortConfiguration),
  ResolvedImageDigest: S.optional(S.String),
  Vcpu: S.optional(S.Number),
}) {}
export const SupportContainerDefinitionList = S.Array(
  SupportContainerDefinition,
);
export class ContainerGroupDefinition extends S.Class<ContainerGroupDefinition>(
  "ContainerGroupDefinition",
)({
  ContainerGroupDefinitionArn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  OperatingSystem: S.optional(S.String),
  Name: S.String,
  ContainerGroupType: S.optional(S.String),
  TotalMemoryLimitMebibytes: S.optional(S.Number),
  TotalVcpuLimit: S.optional(S.Number),
  GameServerContainerDefinition: S.optional(GameServerContainerDefinition),
  SupportContainerDefinitions: S.optional(SupportContainerDefinitionList),
  VersionNumber: S.optional(S.Number),
  VersionDescription: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
}) {}
export const ContainerGroupDefinitionList = S.Array(ContainerGroupDefinition);
export class DeploymentConfiguration extends S.Class<DeploymentConfiguration>(
  "DeploymentConfiguration",
)({
  ProtectionStrategy: S.optional(S.String),
  MinimumHealthyPercentage: S.optional(S.Number),
  ImpairmentStrategy: S.optional(S.String),
}) {}
export class FleetDeployment extends S.Class<FleetDeployment>(
  "FleetDeployment",
)({
  DeploymentId: S.optional(S.String),
  FleetId: S.optional(S.String),
  GameServerBinaryArn: S.optional(S.String),
  RollbackGameServerBinaryArn: S.optional(S.String),
  PerInstanceBinaryArn: S.optional(S.String),
  RollbackPerInstanceBinaryArn: S.optional(S.String),
  DeploymentStatus: S.optional(S.String),
  DeploymentConfiguration: S.optional(DeploymentConfiguration),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const FleetDeployments = S.Array(FleetDeployment);
export const FleetIdList = S.Array(S.String);
export class GameServerGroup extends S.Class<GameServerGroup>(
  "GameServerGroup",
)({
  GameServerGroupName: S.optional(S.String),
  GameServerGroupArn: S.optional(S.String),
  RoleArn: S.optional(S.String),
  InstanceDefinitions: S.optional(InstanceDefinitions),
  BalancingStrategy: S.optional(S.String),
  GameServerProtectionPolicy: S.optional(S.String),
  AutoScalingGroupArn: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  SuspendedActions: S.optional(GameServerGroupActions),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const GameServerGroups = S.Array(GameServerGroup);
export class GameServer extends S.Class<GameServer>("GameServer")({
  GameServerGroupName: S.optional(S.String),
  GameServerGroupArn: S.optional(S.String),
  GameServerId: S.optional(S.String),
  InstanceId: S.optional(S.String),
  ConnectionInfo: S.optional(S.String),
  GameServerData: S.optional(S.String),
  ClaimStatus: S.optional(S.String),
  UtilizationStatus: S.optional(S.String),
  RegistrationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastClaimTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastHealthCheckTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const GameServers = S.Array(GameServer);
export class UDPEndpoint extends S.Class<UDPEndpoint>("UDPEndpoint")({
  Domain: S.optional(S.String),
  Port: S.optional(S.Number),
}) {}
export class PingBeacon extends S.Class<PingBeacon>("PingBeacon")({
  UDPEndpoint: S.optional(UDPEndpoint),
}) {}
export class LocationModel extends S.Class<LocationModel>("LocationModel")({
  LocationName: S.optional(S.String),
  LocationArn: S.optional(S.String),
  PingBeacon: S.optional(PingBeacon),
}) {}
export const LocationModelList = S.Array(LocationModel);
export class Script extends S.Class<Script>("Script")({
  ScriptId: S.optional(S.String),
  ScriptArn: S.optional(S.String),
  Name: S.optional(S.String),
  Version: S.optional(S.String),
  SizeOnDisk: S.optional(S.Number),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StorageLocation: S.optional(S3Location),
}) {}
export const ScriptList = S.Array(Script);
export class TargetConfiguration extends S.Class<TargetConfiguration>(
  "TargetConfiguration",
)({ TargetValue: S.Number }) {}
export class PlayerLatency extends S.Class<PlayerLatency>("PlayerLatency")({
  PlayerId: S.optional(S.String),
  RegionIdentifier: S.optional(S.String),
  LatencyInMilliseconds: S.optional(S.Number),
}) {}
export const PlayerLatencyList = S.Array(PlayerLatency);
export class DesiredPlayerSession extends S.Class<DesiredPlayerSession>(
  "DesiredPlayerSession",
)({ PlayerId: S.optional(S.String), PlayerData: S.optional(S.String) }) {}
export const DesiredPlayerSessionList = S.Array(DesiredPlayerSession);
export class PriorityConfigurationOverride extends S.Class<PriorityConfigurationOverride>(
  "PriorityConfigurationOverride",
)({
  PlacementFallbackStrategy: S.optional(S.String),
  LocationOrder: LocationOrderOverrideList,
}) {}
export class ClaimGameServerInput extends S.Class<ClaimGameServerInput>(
  "ClaimGameServerInput",
)(
  {
    GameServerGroupName: S.String,
    GameServerId: S.optional(S.String),
    GameServerData: S.optional(S.String),
    FilterOption: S.optional(ClaimFilterOption),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateAliasInput extends S.Class<CreateAliasInput>(
  "CreateAliasInput",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    RoutingStrategy: RoutingStrategy,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateBuildInput extends S.Class<CreateBuildInput>(
  "CreateBuildInput",
)(
  {
    Name: S.optional(S.String),
    Version: S.optional(S.String),
    StorageLocation: S.optional(S3Location),
    OperatingSystem: S.optional(S.String),
    Tags: S.optional(TagList),
    ServerSdkVersion: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateContainerFleetInput extends S.Class<CreateContainerFleetInput>(
  "CreateContainerFleetInput",
)(
  {
    FleetRoleArn: S.String,
    Description: S.optional(S.String),
    GameServerContainerGroupDefinitionName: S.optional(S.String),
    PerInstanceContainerGroupDefinitionName: S.optional(S.String),
    InstanceConnectionPortRange: S.optional(ConnectionPortRange),
    InstanceInboundPermissions: S.optional(IpPermissionsList),
    GameServerContainerGroupsPerInstance: S.optional(S.Number),
    InstanceType: S.optional(S.String),
    BillingType: S.optional(S.String),
    Locations: S.optional(LocationConfigurationList),
    MetricGroups: S.optional(MetricGroupList),
    NewGameSessionProtectionPolicy: S.optional(S.String),
    GameSessionCreationLimitPolicy: S.optional(GameSessionCreationLimitPolicy),
    LogConfiguration: S.optional(LogConfiguration),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateGameSessionInput extends S.Class<CreateGameSessionInput>(
  "CreateGameSessionInput",
)(
  {
    FleetId: S.optional(S.String),
    AliasId: S.optional(S.String),
    MaximumPlayerSessionCount: S.Number,
    Name: S.optional(S.String),
    GameProperties: S.optional(GamePropertyList),
    CreatorId: S.optional(S.String),
    GameSessionId: S.optional(S.String),
    IdempotencyToken: S.optional(S.String),
    GameSessionData: S.optional(S.String),
    Location: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateGameSessionQueueInput extends S.Class<CreateGameSessionQueueInput>(
  "CreateGameSessionQueueInput",
)(
  {
    Name: S.String,
    TimeoutInSeconds: S.optional(S.Number),
    PlayerLatencyPolicies: S.optional(PlayerLatencyPolicyList),
    Destinations: S.optional(GameSessionQueueDestinationList),
    FilterConfiguration: S.optional(FilterConfiguration),
    PriorityConfiguration: S.optional(PriorityConfiguration),
    CustomEventData: S.optional(S.String),
    NotificationTarget: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePlayerSessionsInput extends S.Class<CreatePlayerSessionsInput>(
  "CreatePlayerSessionsInput",
)(
  {
    GameSessionId: S.String,
    PlayerIds: PlayerIdList,
    PlayerDataMap: S.optional(PlayerDataMap),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateVpcPeeringAuthorizationOutput extends S.Class<CreateVpcPeeringAuthorizationOutput>(
  "CreateVpcPeeringAuthorizationOutput",
)({ VpcPeeringAuthorization: S.optional(VpcPeeringAuthorization) }, ns) {}
export class LocationState extends S.Class<LocationState>("LocationState")({
  Location: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const LocationStateList = S.Array(LocationState);
export class DeleteFleetLocationsOutput extends S.Class<DeleteFleetLocationsOutput>(
  "DeleteFleetLocationsOutput",
)(
  {
    FleetId: S.optional(S.String),
    FleetArn: S.optional(S.String),
    LocationStates: S.optional(LocationStateList),
  },
  ns,
) {}
export class EC2InstanceCounts extends S.Class<EC2InstanceCounts>(
  "EC2InstanceCounts",
)({
  DESIRED: S.optional(S.Number),
  MINIMUM: S.optional(S.Number),
  MAXIMUM: S.optional(S.Number),
  PENDING: S.optional(S.Number),
  ACTIVE: S.optional(S.Number),
  IDLE: S.optional(S.Number),
  TERMINATING: S.optional(S.Number),
}) {}
export class GameServerContainerGroupCounts extends S.Class<GameServerContainerGroupCounts>(
  "GameServerContainerGroupCounts",
)({
  PENDING: S.optional(S.Number),
  ACTIVE: S.optional(S.Number),
  IDLE: S.optional(S.Number),
  TERMINATING: S.optional(S.Number),
}) {}
export class FleetCapacity extends S.Class<FleetCapacity>("FleetCapacity")({
  FleetId: S.optional(S.String),
  FleetArn: S.optional(S.String),
  InstanceType: S.optional(S.String),
  InstanceCounts: S.optional(EC2InstanceCounts),
  Location: S.optional(S.String),
  GameServerContainerGroupCounts: S.optional(GameServerContainerGroupCounts),
}) {}
export class DescribeFleetLocationCapacityOutput extends S.Class<DescribeFleetLocationCapacityOutput>(
  "DescribeFleetLocationCapacityOutput",
)({ FleetCapacity: S.optional(FleetCapacity) }, ns) {}
export class DescribeFleetPortSettingsOutput extends S.Class<DescribeFleetPortSettingsOutput>(
  "DescribeFleetPortSettingsOutput",
)(
  {
    FleetId: S.optional(S.String),
    FleetArn: S.optional(S.String),
    InboundPermissions: S.optional(IpPermissionsList),
    UpdateStatus: S.optional(S.String),
    Location: S.optional(S.String),
  },
  ns,
) {}
export class DescribeFleetUtilizationOutput extends S.Class<DescribeFleetUtilizationOutput>(
  "DescribeFleetUtilizationOutput",
)(
  {
    FleetUtilization: S.optional(FleetUtilizationList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeGameServerGroupOutput extends S.Class<DescribeGameServerGroupOutput>(
  "DescribeGameServerGroupOutput",
)({ GameServerGroup: S.optional(GameServerGroup) }, ns) {}
export class DescribeMatchmakingConfigurationsOutput extends S.Class<DescribeMatchmakingConfigurationsOutput>(
  "DescribeMatchmakingConfigurationsOutput",
)(
  {
    Configurations: S.optional(MatchmakingConfigurationList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeMatchmakingRuleSetsOutput extends S.Class<DescribeMatchmakingRuleSetsOutput>(
  "DescribeMatchmakingRuleSetsOutput",
)({ RuleSets: MatchmakingRuleSetList, NextToken: S.optional(S.String) }, ns) {}
export class DescribePlayerSessionsOutput extends S.Class<DescribePlayerSessionsOutput>(
  "DescribePlayerSessionsOutput",
)(
  {
    PlayerSessions: S.optional(PlayerSessionList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeRuntimeConfigurationOutput extends S.Class<DescribeRuntimeConfigurationOutput>(
  "DescribeRuntimeConfigurationOutput",
)({ RuntimeConfiguration: S.optional(RuntimeConfiguration) }, ns) {}
export class DescribeScriptOutput extends S.Class<DescribeScriptOutput>(
  "DescribeScriptOutput",
)({ Script: S.optional(Script) }, ns) {}
export class DescribeVpcPeeringAuthorizationsOutput extends S.Class<DescribeVpcPeeringAuthorizationsOutput>(
  "DescribeVpcPeeringAuthorizationsOutput",
)({ VpcPeeringAuthorizations: S.optional(VpcPeeringAuthorizationList) }, ns) {}
export class GetComputeAuthTokenOutput extends S.Class<GetComputeAuthTokenOutput>(
  "GetComputeAuthTokenOutput",
)(
  {
    FleetId: S.optional(S.String),
    FleetArn: S.optional(S.String),
    ComputeName: S.optional(S.String),
    ComputeArn: S.optional(S.String),
    AuthToken: S.optional(S.String),
    ExpirationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class GetGameSessionLogUrlOutput extends S.Class<GetGameSessionLogUrlOutput>(
  "GetGameSessionLogUrlOutput",
)({ PreSignedUrl: S.optional(S.String) }, ns) {}
export class ListAliasesOutput extends S.Class<ListAliasesOutput>(
  "ListAliasesOutput",
)({ Aliases: S.optional(AliasList), NextToken: S.optional(S.String) }, ns) {}
export class ListBuildsOutput extends S.Class<ListBuildsOutput>(
  "ListBuildsOutput",
)({ Builds: S.optional(BuildList), NextToken: S.optional(S.String) }, ns) {}
export class ListComputeOutput extends S.Class<ListComputeOutput>(
  "ListComputeOutput",
)(
  { ComputeList: S.optional(ComputeList), NextToken: S.optional(S.String) },
  ns,
) {}
export class ListContainerFleetsOutput extends S.Class<ListContainerFleetsOutput>(
  "ListContainerFleetsOutput",
)(
  {
    ContainerFleets: S.optional(ContainerFleetList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListContainerGroupDefinitionsOutput extends S.Class<ListContainerGroupDefinitionsOutput>(
  "ListContainerGroupDefinitionsOutput",
)(
  {
    ContainerGroupDefinitions: S.optional(ContainerGroupDefinitionList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListContainerGroupDefinitionVersionsOutput extends S.Class<ListContainerGroupDefinitionVersionsOutput>(
  "ListContainerGroupDefinitionVersionsOutput",
)(
  {
    ContainerGroupDefinitions: S.optional(ContainerGroupDefinitionList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListFleetDeploymentsOutput extends S.Class<ListFleetDeploymentsOutput>(
  "ListFleetDeploymentsOutput",
)(
  {
    FleetDeployments: S.optional(FleetDeployments),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListFleetsOutput extends S.Class<ListFleetsOutput>(
  "ListFleetsOutput",
)({ FleetIds: S.optional(FleetIdList), NextToken: S.optional(S.String) }, ns) {}
export class ListGameServerGroupsOutput extends S.Class<ListGameServerGroupsOutput>(
  "ListGameServerGroupsOutput",
)(
  {
    GameServerGroups: S.optional(GameServerGroups),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListGameServersOutput extends S.Class<ListGameServersOutput>(
  "ListGameServersOutput",
)(
  { GameServers: S.optional(GameServers), NextToken: S.optional(S.String) },
  ns,
) {}
export class ListLocationsOutput extends S.Class<ListLocationsOutput>(
  "ListLocationsOutput",
)(
  { Locations: S.optional(LocationModelList), NextToken: S.optional(S.String) },
  ns,
) {}
export class ListScriptsOutput extends S.Class<ListScriptsOutput>(
  "ListScriptsOutput",
)({ Scripts: S.optional(ScriptList), NextToken: S.optional(S.String) }, ns) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }, ns) {}
export class PutScalingPolicyInput extends S.Class<PutScalingPolicyInput>(
  "PutScalingPolicyInput",
)(
  {
    Name: S.String,
    FleetId: S.String,
    ScalingAdjustment: S.optional(S.Number),
    ScalingAdjustmentType: S.optional(S.String),
    Threshold: S.optional(S.Number),
    ComparisonOperator: S.optional(S.String),
    EvaluationPeriods: S.optional(S.Number),
    MetricName: S.String,
    PolicyType: S.optional(S.String),
    TargetConfiguration: S.optional(TargetConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterComputeOutput extends S.Class<RegisterComputeOutput>(
  "RegisterComputeOutput",
)({ Compute: S.optional(Compute) }, ns) {}
export class RegisterGameServerOutput extends S.Class<RegisterGameServerOutput>(
  "RegisterGameServerOutput",
)({ GameServer: S.optional(GameServer) }, ns) {}
export class AwsCredentials extends S.Class<AwsCredentials>("AwsCredentials")({
  AccessKeyId: S.optional(S.String),
  SecretAccessKey: S.optional(S.String),
  SessionToken: S.optional(S.String),
}) {}
export class RequestUploadCredentialsOutput extends S.Class<RequestUploadCredentialsOutput>(
  "RequestUploadCredentialsOutput",
)(
  {
    UploadCredentials: S.optional(AwsCredentials),
    StorageLocation: S.optional(S3Location),
  },
  ns,
) {}
export class ResolveAliasOutput extends S.Class<ResolveAliasOutput>(
  "ResolveAliasOutput",
)({ FleetId: S.optional(S.String), FleetArn: S.optional(S.String) }, ns) {}
export class ResumeGameServerGroupOutput extends S.Class<ResumeGameServerGroupOutput>(
  "ResumeGameServerGroupOutput",
)({ GameServerGroup: S.optional(GameServerGroup) }, ns) {}
export class GameSession extends S.Class<GameSession>("GameSession")({
  GameSessionId: S.optional(S.String),
  Name: S.optional(S.String),
  FleetId: S.optional(S.String),
  FleetArn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TerminationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CurrentPlayerSessionCount: S.optional(S.Number),
  MaximumPlayerSessionCount: S.optional(S.Number),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  GameProperties: S.optional(GamePropertyList),
  IpAddress: S.optional(S.String),
  DnsName: S.optional(S.String),
  Port: S.optional(S.Number),
  PlayerSessionCreationPolicy: S.optional(S.String),
  CreatorId: S.optional(S.String),
  GameSessionData: S.optional(S.String),
  MatchmakerData: S.optional(S.String),
  Location: S.optional(S.String),
}) {}
export const GameSessionList = S.Array(GameSession);
export class SearchGameSessionsOutput extends S.Class<SearchGameSessionsOutput>(
  "SearchGameSessionsOutput",
)(
  {
    GameSessions: S.optional(GameSessionList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class StartFleetActionsOutput extends S.Class<StartFleetActionsOutput>(
  "StartFleetActionsOutput",
)({ FleetId: S.optional(S.String), FleetArn: S.optional(S.String) }, ns) {}
export class StartGameSessionPlacementInput extends S.Class<StartGameSessionPlacementInput>(
  "StartGameSessionPlacementInput",
)(
  {
    PlacementId: S.String,
    GameSessionQueueName: S.String,
    GameProperties: S.optional(GamePropertyList),
    MaximumPlayerSessionCount: S.Number,
    GameSessionName: S.optional(S.String),
    PlayerLatencies: S.optional(PlayerLatencyList),
    DesiredPlayerSessions: S.optional(DesiredPlayerSessionList),
    GameSessionData: S.optional(S.String),
    PriorityConfigurationOverride: S.optional(PriorityConfigurationOverride),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class MatchedPlayerSession extends S.Class<MatchedPlayerSession>(
  "MatchedPlayerSession",
)({ PlayerId: S.optional(S.String), PlayerSessionId: S.optional(S.String) }) {}
export const MatchedPlayerSessionList = S.Array(MatchedPlayerSession);
export class GameSessionConnectionInfo extends S.Class<GameSessionConnectionInfo>(
  "GameSessionConnectionInfo",
)({
  GameSessionArn: S.optional(S.String),
  IpAddress: S.optional(S.String),
  DnsName: S.optional(S.String),
  Port: S.optional(S.Number),
  MatchedPlayerSessions: S.optional(MatchedPlayerSessionList),
}) {}
export class MatchmakingTicket extends S.Class<MatchmakingTicket>(
  "MatchmakingTicket",
)({
  TicketId: S.optional(S.String),
  ConfigurationName: S.optional(S.String),
  ConfigurationArn: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Players: S.optional(PlayerList),
  GameSessionConnectionInfo: S.optional(GameSessionConnectionInfo),
  EstimatedWaitTime: S.optional(S.Number),
}) {}
export class StartMatchmakingOutput extends S.Class<StartMatchmakingOutput>(
  "StartMatchmakingOutput",
)({ MatchmakingTicket: S.optional(MatchmakingTicket) }, ns) {}
export class StopFleetActionsOutput extends S.Class<StopFleetActionsOutput>(
  "StopFleetActionsOutput",
)({ FleetId: S.optional(S.String), FleetArn: S.optional(S.String) }, ns) {}
export class PlacedPlayerSession extends S.Class<PlacedPlayerSession>(
  "PlacedPlayerSession",
)({ PlayerId: S.optional(S.String), PlayerSessionId: S.optional(S.String) }) {}
export const PlacedPlayerSessionList = S.Array(PlacedPlayerSession);
export class GameSessionPlacement extends S.Class<GameSessionPlacement>(
  "GameSessionPlacement",
)({
  PlacementId: S.optional(S.String),
  GameSessionQueueName: S.optional(S.String),
  Status: S.optional(S.String),
  GameProperties: S.optional(GamePropertyList),
  MaximumPlayerSessionCount: S.optional(S.Number),
  GameSessionName: S.optional(S.String),
  GameSessionId: S.optional(S.String),
  GameSessionArn: S.optional(S.String),
  GameSessionRegion: S.optional(S.String),
  PlayerLatencies: S.optional(PlayerLatencyList),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  IpAddress: S.optional(S.String),
  DnsName: S.optional(S.String),
  Port: S.optional(S.Number),
  PlacedPlayerSessions: S.optional(PlacedPlayerSessionList),
  GameSessionData: S.optional(S.String),
  MatchmakerData: S.optional(S.String),
  PriorityConfigurationOverride: S.optional(PriorityConfigurationOverride),
}) {}
export class StopGameSessionPlacementOutput extends S.Class<StopGameSessionPlacementOutput>(
  "StopGameSessionPlacementOutput",
)({ GameSessionPlacement: S.optional(GameSessionPlacement) }, ns) {}
export class SuspendGameServerGroupOutput extends S.Class<SuspendGameServerGroupOutput>(
  "SuspendGameServerGroupOutput",
)({ GameServerGroup: S.optional(GameServerGroup) }, ns) {}
export class TerminateGameSessionOutput extends S.Class<TerminateGameSessionOutput>(
  "TerminateGameSessionOutput",
)({ GameSession: S.optional(GameSession) }, ns) {}
export class UpdateAliasOutput extends S.Class<UpdateAliasOutput>(
  "UpdateAliasOutput",
)({ Alias: S.optional(Alias) }, ns) {}
export class UpdateBuildOutput extends S.Class<UpdateBuildOutput>(
  "UpdateBuildOutput",
)({ Build: S.optional(Build) }, ns) {}
export class UpdateContainerFleetInput extends S.Class<UpdateContainerFleetInput>(
  "UpdateContainerFleetInput",
)(
  {
    FleetId: S.String,
    GameServerContainerGroupDefinitionName: S.optional(S.String),
    PerInstanceContainerGroupDefinitionName: S.optional(S.String),
    GameServerContainerGroupsPerInstance: S.optional(S.Number),
    InstanceConnectionPortRange: S.optional(ConnectionPortRange),
    InstanceInboundPermissionAuthorizations: S.optional(IpPermissionsList),
    InstanceInboundPermissionRevocations: S.optional(IpPermissionsList),
    DeploymentConfiguration: S.optional(DeploymentConfiguration),
    Description: S.optional(S.String),
    MetricGroups: S.optional(MetricGroupList),
    NewGameSessionProtectionPolicy: S.optional(S.String),
    GameSessionCreationLimitPolicy: S.optional(GameSessionCreationLimitPolicy),
    LogConfiguration: S.optional(LogConfiguration),
    RemoveAttributes: S.optional(ContainerFleetRemoveAttributeList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateContainerGroupDefinitionOutput extends S.Class<UpdateContainerGroupDefinitionOutput>(
  "UpdateContainerGroupDefinitionOutput",
)({ ContainerGroupDefinition: S.optional(ContainerGroupDefinition) }, ns) {}
export class UpdateFleetAttributesOutput extends S.Class<UpdateFleetAttributesOutput>(
  "UpdateFleetAttributesOutput",
)({ FleetId: S.optional(S.String), FleetArn: S.optional(S.String) }, ns) {}
export class UpdateFleetCapacityOutput extends S.Class<UpdateFleetCapacityOutput>(
  "UpdateFleetCapacityOutput",
)(
  {
    FleetId: S.optional(S.String),
    FleetArn: S.optional(S.String),
    Location: S.optional(S.String),
  },
  ns,
) {}
export class UpdateFleetPortSettingsOutput extends S.Class<UpdateFleetPortSettingsOutput>(
  "UpdateFleetPortSettingsOutput",
)({ FleetId: S.optional(S.String), FleetArn: S.optional(S.String) }, ns) {}
export class UpdateGameServerOutput extends S.Class<UpdateGameServerOutput>(
  "UpdateGameServerOutput",
)({ GameServer: S.optional(GameServer) }, ns) {}
export class UpdateGameServerGroupOutput extends S.Class<UpdateGameServerGroupOutput>(
  "UpdateGameServerGroupOutput",
)({ GameServerGroup: S.optional(GameServerGroup) }, ns) {}
export class UpdateGameSessionOutput extends S.Class<UpdateGameSessionOutput>(
  "UpdateGameSessionOutput",
)({ GameSession: S.optional(GameSession) }, ns) {}
export class GameSessionQueue extends S.Class<GameSessionQueue>(
  "GameSessionQueue",
)({
  Name: S.optional(S.String),
  GameSessionQueueArn: S.optional(S.String),
  TimeoutInSeconds: S.optional(S.Number),
  PlayerLatencyPolicies: S.optional(PlayerLatencyPolicyList),
  Destinations: S.optional(GameSessionQueueDestinationList),
  FilterConfiguration: S.optional(FilterConfiguration),
  PriorityConfiguration: S.optional(PriorityConfiguration),
  CustomEventData: S.optional(S.String),
  NotificationTarget: S.optional(S.String),
}) {}
export class UpdateGameSessionQueueOutput extends S.Class<UpdateGameSessionQueueOutput>(
  "UpdateGameSessionQueueOutput",
)({ GameSessionQueue: S.optional(GameSessionQueue) }, ns) {}
export class UpdateMatchmakingConfigurationOutput extends S.Class<UpdateMatchmakingConfigurationOutput>(
  "UpdateMatchmakingConfigurationOutput",
)({ Configuration: S.optional(MatchmakingConfiguration) }, ns) {}
export class UpdateRuntimeConfigurationOutput extends S.Class<UpdateRuntimeConfigurationOutput>(
  "UpdateRuntimeConfigurationOutput",
)({ RuntimeConfiguration: S.optional(RuntimeConfiguration) }, ns) {}
export class UpdateScriptOutput extends S.Class<UpdateScriptOutput>(
  "UpdateScriptOutput",
)({ Script: S.optional(Script) }, ns) {}
export class ValidateMatchmakingRuleSetOutput extends S.Class<ValidateMatchmakingRuleSetOutput>(
  "ValidateMatchmakingRuleSetOutput",
)({ Valid: S.optional(S.Boolean) }, ns) {}
export class TargetTrackingConfiguration extends S.Class<TargetTrackingConfiguration>(
  "TargetTrackingConfiguration",
)({ TargetValue: S.Number }) {}
export class GameServerGroupAutoScalingPolicy extends S.Class<GameServerGroupAutoScalingPolicy>(
  "GameServerGroupAutoScalingPolicy",
)({
  EstimatedInstanceWarmup: S.optional(S.Number),
  TargetTrackingConfiguration: TargetTrackingConfiguration,
}) {}
export class EC2InstanceLimit extends S.Class<EC2InstanceLimit>(
  "EC2InstanceLimit",
)({
  EC2InstanceType: S.optional(S.String),
  CurrentInstances: S.optional(S.Number),
  InstanceLimit: S.optional(S.Number),
  Location: S.optional(S.String),
}) {}
export const EC2InstanceLimitList = S.Array(EC2InstanceLimit);
export class FleetAttributes extends S.Class<FleetAttributes>(
  "FleetAttributes",
)({
  FleetId: S.optional(S.String),
  FleetArn: S.optional(S.String),
  FleetType: S.optional(S.String),
  InstanceType: S.optional(S.String),
  Description: S.optional(S.String),
  Name: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TerminationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  BuildId: S.optional(S.String),
  BuildArn: S.optional(S.String),
  ScriptId: S.optional(S.String),
  ScriptArn: S.optional(S.String),
  ServerLaunchPath: S.optional(S.String),
  ServerLaunchParameters: S.optional(S.String),
  LogPaths: S.optional(StringList),
  NewGameSessionProtectionPolicy: S.optional(S.String),
  OperatingSystem: S.optional(S.String),
  ResourceCreationLimitPolicy: S.optional(ResourceCreationLimitPolicy),
  MetricGroups: S.optional(MetricGroupList),
  StoppedActions: S.optional(FleetActionList),
  InstanceRoleArn: S.optional(S.String),
  CertificateConfiguration: S.optional(CertificateConfiguration),
  ComputeType: S.optional(S.String),
  AnywhereConfiguration: S.optional(AnywhereConfiguration),
  InstanceRoleCredentialsProvider: S.optional(S.String),
}) {}
export const FleetAttributesList = S.Array(FleetAttributes);
export class Event extends S.Class<Event>("Event")({
  EventId: S.optional(S.String),
  ResourceId: S.optional(S.String),
  EventCode: S.optional(S.String),
  Message: S.optional(S.String),
  EventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  PreSignedLogUrl: S.optional(S.String),
  Count: S.optional(S.Number),
}) {}
export const EventList = S.Array(Event);
export class LocationAttributes extends S.Class<LocationAttributes>(
  "LocationAttributes",
)({
  LocationState: S.optional(LocationState),
  StoppedActions: S.optional(FleetActionList),
  UpdateStatus: S.optional(S.String),
}) {}
export const LocationAttributesList = S.Array(LocationAttributes);
export class GameServerInstance extends S.Class<GameServerInstance>(
  "GameServerInstance",
)({
  GameServerGroupName: S.optional(S.String),
  GameServerGroupArn: S.optional(S.String),
  InstanceId: S.optional(S.String),
  InstanceStatus: S.optional(S.String),
}) {}
export const GameServerInstances = S.Array(GameServerInstance);
export class GameSessionDetail extends S.Class<GameSessionDetail>(
  "GameSessionDetail",
)({
  GameSession: S.optional(GameSession),
  ProtectionPolicy: S.optional(S.String),
}) {}
export const GameSessionDetailList = S.Array(GameSessionDetail);
export const GameSessionQueueList = S.Array(GameSessionQueue);
export class Instance extends S.Class<Instance>("Instance")({
  FleetId: S.optional(S.String),
  FleetArn: S.optional(S.String),
  InstanceId: S.optional(S.String),
  IpAddress: S.optional(S.String),
  DnsName: S.optional(S.String),
  OperatingSystem: S.optional(S.String),
  Type: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Location: S.optional(S.String),
}) {}
export const InstanceList = S.Array(Instance);
export class ScalingPolicy extends S.Class<ScalingPolicy>("ScalingPolicy")({
  FleetId: S.optional(S.String),
  FleetArn: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  ScalingAdjustment: S.optional(S.Number),
  ScalingAdjustmentType: S.optional(S.String),
  ComparisonOperator: S.optional(S.String),
  Threshold: S.optional(S.Number),
  EvaluationPeriods: S.optional(S.Number),
  MetricName: S.optional(S.String),
  PolicyType: S.optional(S.String),
  TargetConfiguration: S.optional(TargetConfiguration),
  UpdateStatus: S.optional(S.String),
  Location: S.optional(S.String),
}) {}
export const ScalingPolicyList = S.Array(ScalingPolicy);
export class ContainerIdentifier extends S.Class<ContainerIdentifier>(
  "ContainerIdentifier",
)({
  ContainerName: S.optional(S.String),
  ContainerRuntimeId: S.optional(S.String),
}) {}
export const ContainerIdentifierList = S.Array(ContainerIdentifier);
export class ClaimGameServerOutput extends S.Class<ClaimGameServerOutput>(
  "ClaimGameServerOutput",
)({ GameServer: S.optional(GameServer) }, ns) {}
export class CreateAliasOutput extends S.Class<CreateAliasOutput>(
  "CreateAliasOutput",
)({ Alias: S.optional(Alias) }, ns) {}
export class CreateBuildOutput extends S.Class<CreateBuildOutput>(
  "CreateBuildOutput",
)(
  {
    Build: S.optional(Build),
    UploadCredentials: S.optional(AwsCredentials),
    StorageLocation: S.optional(S3Location),
  },
  ns,
) {}
export class CreateContainerFleetOutput extends S.Class<CreateContainerFleetOutput>(
  "CreateContainerFleetOutput",
)({ ContainerFleet: S.optional(ContainerFleet) }, ns) {}
export class CreateFleetInput extends S.Class<CreateFleetInput>(
  "CreateFleetInput",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    BuildId: S.optional(S.String),
    ScriptId: S.optional(S.String),
    ServerLaunchPath: S.optional(S.String),
    ServerLaunchParameters: S.optional(S.String),
    LogPaths: S.optional(StringList),
    EC2InstanceType: S.optional(S.String),
    EC2InboundPermissions: S.optional(IpPermissionsList),
    NewGameSessionProtectionPolicy: S.optional(S.String),
    RuntimeConfiguration: S.optional(RuntimeConfiguration),
    ResourceCreationLimitPolicy: S.optional(ResourceCreationLimitPolicy),
    MetricGroups: S.optional(MetricGroupList),
    PeerVpcAwsAccountId: S.optional(S.String),
    PeerVpcId: S.optional(S.String),
    FleetType: S.optional(S.String),
    InstanceRoleArn: S.optional(S.String),
    CertificateConfiguration: S.optional(CertificateConfiguration),
    Locations: S.optional(LocationConfigurationList),
    Tags: S.optional(TagList),
    ComputeType: S.optional(S.String),
    AnywhereConfiguration: S.optional(AnywhereConfiguration),
    InstanceRoleCredentialsProvider: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateFleetLocationsOutput extends S.Class<CreateFleetLocationsOutput>(
  "CreateFleetLocationsOutput",
)(
  {
    FleetId: S.optional(S.String),
    FleetArn: S.optional(S.String),
    LocationStates: S.optional(LocationStateList),
  },
  ns,
) {}
export class CreateGameServerGroupInput extends S.Class<CreateGameServerGroupInput>(
  "CreateGameServerGroupInput",
)(
  {
    GameServerGroupName: S.String,
    RoleArn: S.String,
    MinSize: S.Number,
    MaxSize: S.Number,
    LaunchTemplate: LaunchTemplateSpecification,
    InstanceDefinitions: InstanceDefinitions,
    AutoScalingPolicy: S.optional(GameServerGroupAutoScalingPolicy),
    BalancingStrategy: S.optional(S.String),
    GameServerProtectionPolicy: S.optional(S.String),
    VpcSubnets: S.optional(VpcSubnets),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateGameSessionOutput extends S.Class<CreateGameSessionOutput>(
  "CreateGameSessionOutput",
)({ GameSession: S.optional(GameSession) }, ns) {}
export class CreateGameSessionQueueOutput extends S.Class<CreateGameSessionQueueOutput>(
  "CreateGameSessionQueueOutput",
)({ GameSessionQueue: S.optional(GameSessionQueue) }, ns) {}
export class CreateMatchmakingConfigurationOutput extends S.Class<CreateMatchmakingConfigurationOutput>(
  "CreateMatchmakingConfigurationOutput",
)({ Configuration: S.optional(MatchmakingConfiguration) }, ns) {}
export class CreateMatchmakingRuleSetOutput extends S.Class<CreateMatchmakingRuleSetOutput>(
  "CreateMatchmakingRuleSetOutput",
)({ RuleSet: MatchmakingRuleSet }, ns) {}
export class CreatePlayerSessionOutput extends S.Class<CreatePlayerSessionOutput>(
  "CreatePlayerSessionOutput",
)({ PlayerSession: S.optional(PlayerSession) }, ns) {}
export class CreatePlayerSessionsOutput extends S.Class<CreatePlayerSessionsOutput>(
  "CreatePlayerSessionsOutput",
)({ PlayerSessions: S.optional(PlayerSessionList) }, ns) {}
export class CreateScriptOutput extends S.Class<CreateScriptOutput>(
  "CreateScriptOutput",
)({ Script: S.optional(Script) }, ns) {}
export class DeleteGameServerGroupOutput extends S.Class<DeleteGameServerGroupOutput>(
  "DeleteGameServerGroupOutput",
)({ GameServerGroup: S.optional(GameServerGroup) }, ns) {}
export class DescribeAliasOutput extends S.Class<DescribeAliasOutput>(
  "DescribeAliasOutput",
)({ Alias: S.optional(Alias) }, ns) {}
export class DescribeBuildOutput extends S.Class<DescribeBuildOutput>(
  "DescribeBuildOutput",
)({ Build: S.optional(Build) }, ns) {}
export class DescribeEC2InstanceLimitsOutput extends S.Class<DescribeEC2InstanceLimitsOutput>(
  "DescribeEC2InstanceLimitsOutput",
)({ EC2InstanceLimits: S.optional(EC2InstanceLimitList) }, ns) {}
export class DescribeFleetAttributesOutput extends S.Class<DescribeFleetAttributesOutput>(
  "DescribeFleetAttributesOutput",
)(
  {
    FleetAttributes: S.optional(FleetAttributesList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeFleetEventsOutput extends S.Class<DescribeFleetEventsOutput>(
  "DescribeFleetEventsOutput",
)({ Events: S.optional(EventList), NextToken: S.optional(S.String) }, ns) {}
export class DescribeFleetLocationAttributesOutput extends S.Class<DescribeFleetLocationAttributesOutput>(
  "DescribeFleetLocationAttributesOutput",
)(
  {
    FleetId: S.optional(S.String),
    FleetArn: S.optional(S.String),
    LocationAttributes: S.optional(LocationAttributesList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeFleetLocationUtilizationOutput extends S.Class<DescribeFleetLocationUtilizationOutput>(
  "DescribeFleetLocationUtilizationOutput",
)({ FleetUtilization: S.optional(FleetUtilization) }, ns) {}
export class DescribeGameServerOutput extends S.Class<DescribeGameServerOutput>(
  "DescribeGameServerOutput",
)({ GameServer: S.optional(GameServer) }, ns) {}
export class DescribeGameServerInstancesOutput extends S.Class<DescribeGameServerInstancesOutput>(
  "DescribeGameServerInstancesOutput",
)(
  {
    GameServerInstances: S.optional(GameServerInstances),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeGameSessionDetailsOutput extends S.Class<DescribeGameSessionDetailsOutput>(
  "DescribeGameSessionDetailsOutput",
)(
  {
    GameSessionDetails: S.optional(GameSessionDetailList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeGameSessionQueuesOutput extends S.Class<DescribeGameSessionQueuesOutput>(
  "DescribeGameSessionQueuesOutput",
)(
  {
    GameSessionQueues: S.optional(GameSessionQueueList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeGameSessionsOutput extends S.Class<DescribeGameSessionsOutput>(
  "DescribeGameSessionsOutput",
)(
  {
    GameSessions: S.optional(GameSessionList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeInstancesOutput extends S.Class<DescribeInstancesOutput>(
  "DescribeInstancesOutput",
)(
  { Instances: S.optional(InstanceList), NextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeScalingPoliciesOutput extends S.Class<DescribeScalingPoliciesOutput>(
  "DescribeScalingPoliciesOutput",
)(
  {
    ScalingPolicies: S.optional(ScalingPolicyList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetComputeAccessOutput extends S.Class<GetComputeAccessOutput>(
  "GetComputeAccessOutput",
)(
  {
    FleetId: S.optional(S.String),
    FleetArn: S.optional(S.String),
    ComputeName: S.optional(S.String),
    ComputeArn: S.optional(S.String),
    Credentials: S.optional(AwsCredentials),
    Target: S.optional(S.String),
    ContainerIdentifiers: S.optional(ContainerIdentifierList),
  },
  ns,
) {}
export class PutScalingPolicyOutput extends S.Class<PutScalingPolicyOutput>(
  "PutScalingPolicyOutput",
)({ Name: S.optional(S.String) }, ns) {}
export class StartGameSessionPlacementOutput extends S.Class<StartGameSessionPlacementOutput>(
  "StartGameSessionPlacementOutput",
)({ GameSessionPlacement: S.optional(GameSessionPlacement) }, ns) {}
export class UpdateContainerFleetOutput extends S.Class<UpdateContainerFleetOutput>(
  "UpdateContainerFleetOutput",
)({ ContainerFleet: S.optional(ContainerFleet) }, ns) {}
export class LocationalDeployment extends S.Class<LocationalDeployment>(
  "LocationalDeployment",
)({ DeploymentStatus: S.optional(S.String) }) {}
export class VpcPeeringConnectionStatus extends S.Class<VpcPeeringConnectionStatus>(
  "VpcPeeringConnectionStatus",
)({ Code: S.optional(S.String), Message: S.optional(S.String) }) {}
export class InstanceCredentials extends S.Class<InstanceCredentials>(
  "InstanceCredentials",
)({ UserName: S.optional(S.String), Secret: S.optional(S.String) }) {}
export const FleetCapacityList = S.Array(FleetCapacity);
export const LocationalDeployments = S.Record({
  key: S.String,
  value: LocationalDeployment,
});
export class VpcPeeringConnection extends S.Class<VpcPeeringConnection>(
  "VpcPeeringConnection",
)({
  FleetId: S.optional(S.String),
  FleetArn: S.optional(S.String),
  IpV4CidrBlock: S.optional(S.String),
  VpcPeeringConnectionId: S.optional(S.String),
  Status: S.optional(VpcPeeringConnectionStatus),
  PeerVpcId: S.optional(S.String),
  GameLiftVpcId: S.optional(S.String),
}) {}
export const VpcPeeringConnectionList = S.Array(VpcPeeringConnection);
export class InstanceAccess extends S.Class<InstanceAccess>("InstanceAccess")({
  FleetId: S.optional(S.String),
  InstanceId: S.optional(S.String),
  IpAddress: S.optional(S.String),
  OperatingSystem: S.optional(S.String),
  Credentials: S.optional(InstanceCredentials),
}) {}
export class CreateContainerGroupDefinitionInput extends S.Class<CreateContainerGroupDefinitionInput>(
  "CreateContainerGroupDefinitionInput",
)(
  {
    Name: S.String,
    ContainerGroupType: S.optional(S.String),
    TotalMemoryLimitMebibytes: S.Number,
    TotalVcpuLimit: S.Number,
    GameServerContainerDefinition: S.optional(
      GameServerContainerDefinitionInput,
    ),
    SupportContainerDefinitions: S.optional(
      SupportContainerDefinitionInputList,
    ),
    OperatingSystem: S.String,
    VersionDescription: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateFleetOutput extends S.Class<CreateFleetOutput>(
  "CreateFleetOutput",
)(
  {
    FleetAttributes: S.optional(FleetAttributes),
    LocationStates: S.optional(LocationStateList),
  },
  ns,
) {}
export class CreateGameServerGroupOutput extends S.Class<CreateGameServerGroupOutput>(
  "CreateGameServerGroupOutput",
)({ GameServerGroup: S.optional(GameServerGroup) }, ns) {}
export class DescribeComputeOutput extends S.Class<DescribeComputeOutput>(
  "DescribeComputeOutput",
)({ Compute: S.optional(Compute) }, ns) {}
export class DescribeContainerFleetOutput extends S.Class<DescribeContainerFleetOutput>(
  "DescribeContainerFleetOutput",
)({ ContainerFleet: S.optional(ContainerFleet) }, ns) {}
export class DescribeContainerGroupDefinitionOutput extends S.Class<DescribeContainerGroupDefinitionOutput>(
  "DescribeContainerGroupDefinitionOutput",
)({ ContainerGroupDefinition: S.optional(ContainerGroupDefinition) }, ns) {}
export class DescribeFleetCapacityOutput extends S.Class<DescribeFleetCapacityOutput>(
  "DescribeFleetCapacityOutput",
)(
  {
    FleetCapacity: S.optional(FleetCapacityList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeFleetDeploymentOutput extends S.Class<DescribeFleetDeploymentOutput>(
  "DescribeFleetDeploymentOutput",
)(
  {
    FleetDeployment: S.optional(FleetDeployment),
    LocationalDeployments: S.optional(LocationalDeployments),
  },
  ns,
) {}
export class DescribeGameSessionPlacementOutput extends S.Class<DescribeGameSessionPlacementOutput>(
  "DescribeGameSessionPlacementOutput",
)({ GameSessionPlacement: S.optional(GameSessionPlacement) }, ns) {}
export class DescribeVpcPeeringConnectionsOutput extends S.Class<DescribeVpcPeeringConnectionsOutput>(
  "DescribeVpcPeeringConnectionsOutput",
)({ VpcPeeringConnections: S.optional(VpcPeeringConnectionList) }, ns) {}
export class GetInstanceAccessOutput extends S.Class<GetInstanceAccessOutput>(
  "GetInstanceAccessOutput",
)({ InstanceAccess: S.optional(InstanceAccess) }, ns) {}
export const MatchmakingTicketList = S.Array(MatchmakingTicket);
export class CreateContainerGroupDefinitionOutput extends S.Class<CreateContainerGroupDefinitionOutput>(
  "CreateContainerGroupDefinitionOutput",
)({ ContainerGroupDefinition: S.optional(ContainerGroupDefinition) }, ns) {}
export class CreateLocationOutput extends S.Class<CreateLocationOutput>(
  "CreateLocationOutput",
)({ Location: S.optional(LocationModel) }, ns) {}
export class DescribeMatchmakingOutput extends S.Class<DescribeMatchmakingOutput>(
  "DescribeMatchmakingOutput",
)({ TicketList: S.optional(MatchmakingTicketList) }, ns) {}
export class StartMatchBackfillInput extends S.Class<StartMatchBackfillInput>(
  "StartMatchBackfillInput",
)(
  {
    TicketId: S.optional(S.String),
    ConfigurationName: S.String,
    GameSessionArn: S.optional(S.String),
    Players: PlayerList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartMatchBackfillOutput extends S.Class<StartMatchBackfillOutput>(
  "StartMatchBackfillOutput",
)({ MatchmakingTicket: S.optional(MatchmakingTicket) }, ns) {}

//# Errors
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  {},
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {},
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {},
) {}
export class TaggingFailedException extends S.TaggedError<TaggingFailedException>()(
  "TaggingFailedException",
  {},
) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  {},
) {}
export class UnsupportedRegionException extends S.TaggedError<UnsupportedRegionException>()(
  "UnsupportedRegionException",
  {},
) {}
export class InvalidFleetStatusException extends S.TaggedError<InvalidFleetStatusException>()(
  "InvalidFleetStatusException",
  { Message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class TerminalRoutingStrategyException extends S.TaggedError<TerminalRoutingStrategyException>()(
  "TerminalRoutingStrategyException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class InvalidGameSessionStatusException extends S.TaggedError<InvalidGameSessionStatusException>()(
  "InvalidGameSessionStatusException",
  {},
) {}
export class NotReadyException extends S.TaggedError<NotReadyException>()(
  "NotReadyException",
  {},
) {}
export class GameSessionFullException extends S.TaggedError<GameSessionFullException>()(
  "GameSessionFullException",
  {},
) {}
export class OutOfCapacityException extends S.TaggedError<OutOfCapacityException>()(
  "OutOfCapacityException",
  { Message: S.optional(S.String) },
) {}
export class FleetCapacityExceededException extends S.TaggedError<FleetCapacityExceededException>()(
  "FleetCapacityExceededException",
  { Message: S.optional(S.String) },
) {}
export class IdempotentParameterMismatchException extends S.TaggedError<IdempotentParameterMismatchException>()(
  "IdempotentParameterMismatchException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Deletes a game session queue. Once a queue is successfully deleted, unfulfilled StartGameSessionPlacement requests that reference the queue will fail. To
 * delete a queue, specify the queue name.
 */
export const deleteGameSessionQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteGameSessionQueueInput,
    output: DeleteGameSessionQueueOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      TaggingFailedException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** Anywhere
 *
 * Deletes a custom location.
 *
 * Before deleting a custom location, review any fleets currently using the custom
 * location and deregister the location if it is in use. For more information, see DeregisterCompute.
 */
export const deleteLocation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLocationInput,
  output: DeleteLocationOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Permanently removes a FlexMatch matchmaking configuration. To delete, specify the
 * configuration name. A matchmaking configuration cannot be deleted if it is being used in
 * any active matchmaking tickets.
 */
export const deleteMatchmakingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteMatchmakingConfigurationInput,
    output: DeleteMatchmakingConfigurationOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      TaggingFailedException,
      UnsupportedRegionException,
    ],
  }));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Deletes an existing matchmaking rule set. To delete the rule set, provide the rule set
 * name. Rule sets cannot be deleted if they are currently being used by a matchmaking
 * configuration.
 *
 * **Learn more**
 *
 * - Build a rule
 * set
 */
export const deleteMatchmakingRuleSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMatchmakingRuleSetInput,
    output: DeleteMatchmakingRuleSetOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      TaggingFailedException,
      UnsupportedRegionException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2
 *
 * Deletes a fleet scaling policy. Once deleted, the policy is no longer in force and
 * Amazon GameLift Servers removes all record of it. To delete a scaling policy, specify both the scaling
 * policy name and the fleet ID it is associated with.
 *
 * To temporarily suspend scaling policies, use StopFleetActions. This operation suspends all policies for the
 * fleet.
 */
export const deleteScalingPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteScalingPolicyInput,
  output: DeleteScalingPolicyResponse,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Deletes a Realtime script. This operation permanently deletes the script record. If
 * script files were uploaded, they are also deleted (files stored in an S3 bucket are not
 * deleted).
 *
 * To delete a script, specify the script ID. Before deleting a script, be sure to
 * terminate all fleets that are deployed with the script being deleted. Fleet instances
 * periodically check for script updates, and if the script record no longer exists, the
 * instance will go into an error state and be unable to host game sessions.
 *
 * **Learn more**
 *
 * Amazon GameLift Servers Amazon GameLift Servers Realtime
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const deleteScript = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteScriptInput,
  output: DeleteScriptResponse,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    TaggingFailedException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Cancels a pending VPC peering authorization for the specified VPC. If you need to
 * delete an existing VPC peering connection, use DeleteVpcPeeringConnection.
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const deleteVpcPeeringAuthorization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteVpcPeeringAuthorizationInput,
    output: DeleteVpcPeeringAuthorizationOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Removes a VPC peering connection. To delete the connection, you must have a valid
 * authorization for the VPC peering connection that you want to delete..
 *
 * Once a valid authorization exists, call this operation from the Amazon Web Services account that is
 * used to manage the Amazon GameLift Servers fleets. Identify the connection to delete by the connection ID
 * and fleet ID. If successful, the connection is removed.
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const deleteVpcPeeringConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteVpcPeeringConnectionInput,
    output: DeleteVpcPeeringConnectionOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** Anywhere
 *
 * Removes a compute resource from an Anywhere fleet. Deregistered computes can no longer
 * host game sessions through Amazon GameLift Servers. Use this operation with an Anywhere fleet that
 * doesn't use the Amazon GameLift Servers Agent For Anywhere fleets with the Agent, the Agent handles all
 * compute registry tasks for you.
 *
 * To deregister a compute, call this operation from the compute that's being
 * deregistered and specify the compute name and the fleet ID.
 */
export const deregisterCompute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterComputeInput,
  output: DeregisterComputeOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2 (FleetIQ)
 *
 * Removes the game server from a
 * game server group. As a result of this operation, the deregistered game server can no
 * longer be claimed and will not be returned in a list of active game servers.
 *
 * To deregister a game server, specify the game server group and game server ID. If
 * successful, this operation emits a CloudWatch event with termination timestamp and
 * reason.
 *
 * **Learn more**
 *
 * Amazon GameLift Servers FleetIQ
 * Guide
 */
export const deregisterGameServer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeregisterGameServerInput,
    output: DeregisterGameServerResponse,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Cancels a matchmaking ticket or match backfill ticket that is currently being
 * processed. To stop the matchmaking operation, specify the ticket ID. If successful, work
 * on the ticket is stopped, and the ticket status is changed to
 * `CANCELLED`.
 *
 * This call is also used to turn off automatic backfill for an individual game session.
 * This is for game sessions that are created with a matchmaking configuration that has
 * automatic backfill enabled. The ticket ID is included in the `MatchmakerData`
 * of an updated game session object, which is provided to the game server.
 *
 * If the operation is successful, the service sends back an empty JSON struct with
 * the HTTP 200 response (not an empty HTTP body).
 *
 * **Learn more**
 *
 * Add FlexMatch to a game client
 */
export const stopMatchmaking = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopMatchmakingInput,
  output: StopMatchmakingOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Assigns a tag to an Amazon GameLift Servers resource. You can use tags to organize resources, create
 * IAM permissions policies to manage access to groups of resources, customize Amazon Web Services cost
 * breakdowns, and more. This operation handles the permissions necessary to manage tags
 * for Amazon GameLift Servers resources that support tagging.
 *
 * To add a tag to a resource, specify the unique ARN value for the resource and provide
 * a tag list containing one or more tags. The operation succeeds even if the list includes
 * tags that are already assigned to the resource.
 *
 * **Learn more**
 *
 * Tagging Amazon Web Services
 * Resources in the *Amazon Web Services General Reference*
 *
 * Amazon Web Services Tagging Strategies
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    TaggingFailedException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Removes a tag assigned to a Amazon GameLift Servers resource. You can use resource tags to organize
 * Amazon Web Services resources for a range of purposes. This operation handles the permissions
 * necessary to manage tags for Amazon GameLift Servers resources that support tagging.
 *
 * To remove a tag from a resource, specify the unique ARN value for the resource and
 * provide a string list containing one or more tags to remove. This operation succeeds
 * even if the list includes tags that aren't assigned to the resource.
 *
 * **Learn more**
 *
 * Tagging Amazon Web Services
 * Resources in the *Amazon Web Services General Reference*
 *
 * Amazon Web Services Tagging Strategies
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    TaggingFailedException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Registers a player's acceptance or rejection of a proposed FlexMatch match. A
 * matchmaking configuration may require player acceptance; if so, then matches built with
 * that configuration cannot be completed unless all players accept the proposed match
 * within a specified time limit.
 *
 * When FlexMatch builds a match, all the matchmaking tickets involved in the proposed
 * match are placed into status `REQUIRES_ACCEPTANCE`. This is a trigger for
 * your game to get acceptance from all players in each ticket. Calls to this action are only valid
 * for tickets that are in this status; calls for tickets not in this status result in an
 * error.
 *
 * To register acceptance, specify the ticket ID, one or more players, and an acceptance response.
 * When all players have accepted, Amazon GameLift Servers advances the matchmaking tickets to status
 * `PLACING`, and attempts to create a new game session for the match.
 *
 * If any player rejects the match, or if acceptances are not received before a specified
 * timeout, the proposed match is dropped. Each matchmaking ticket in the failed match is handled as follows:
 *
 * - If the ticket has one or more players who rejected the match or failed to
 * respond, the ticket status is set `CANCELLED` and processing is
 * terminated.
 *
 * - If all players in the ticket accepted the match, the ticket
 * status is returned to `SEARCHING` to find a new match.
 *
 * **Learn more**
 *
 * Add FlexMatch to a game client
 *
 * FlexMatch events (reference)
 */
export const acceptMatch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptMatchInput,
  output: AcceptMatchOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Requests authorization to create or delete a peer connection between the VPC for your
 * Amazon GameLift Servers fleet and a virtual private cloud (VPC) in your Amazon Web Services account. VPC peering enables the game servers on
 * your fleet to communicate directly with other Amazon Web Services resources. After you've received
 * authorization, use CreateVpcPeeringConnection to establish the peering connection. For more
 * information, see VPC Peering with Amazon GameLift Servers
 * Fleets.
 *
 * You can peer with VPCs that are owned by any Amazon Web Services account you have access to,
 * including the account that you use to manage your Amazon GameLift Servers fleets. You cannot peer with
 * VPCs that are in different Regions.
 *
 * To request authorization to create a connection, call this operation from the Amazon Web Services
 * account with the VPC that you want to peer to your Amazon GameLift Servers fleet. For example, to enable
 * your game servers to retrieve data from a DynamoDB table, use the account that manages
 * that DynamoDB resource. Identify the following values: (1) The ID of the VPC that you
 * want to peer with, and (2) the ID of the Amazon Web Services account that you use to manage Amazon GameLift Servers. If
 * successful, VPC peering is authorized for the specified VPC.
 *
 * To request authorization to delete a connection, call this operation from the Amazon Web Services
 * account with the VPC that is peered with your Amazon GameLift Servers fleet. Identify the following
 * values: (1) VPC ID that you want to delete the peering connection for, and (2) ID of the
 * Amazon Web Services account that you use to manage Amazon GameLift Servers.
 *
 * The authorization remains valid for 24 hours unless it is canceled. You must create or
 * delete the peering connection while the authorization is valid.
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const createVpcPeeringAuthorization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateVpcPeeringAuthorizationInput,
    output: CreateVpcPeeringAuthorizationOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Establishes a VPC peering connection between a virtual private cloud (VPC) in an Amazon Web Services account with the VPC
 * for your Amazon GameLift Servers fleet. VPC peering enables the game servers on your fleet to communicate
 * directly with other Amazon Web Services resources. You can peer with VPCs in any Amazon Web Services account that
 * you have access to, including the account that you use to manage your Amazon GameLift Servers fleets. You
 * cannot peer with VPCs that are in different Regions. For more information, see VPC
 * Peering with Amazon GameLift Servers Fleets.
 *
 * Before calling this operation to establish the peering connection, you first need to
 * use CreateVpcPeeringAuthorization and identify the VPC you want to peer with.
 * Once the authorization for the specified VPC is issued, you have 24 hours to establish
 * the connection. These two operations handle all tasks necessary to peer the two VPCs,
 * including acceptance, updating routing tables, etc.
 *
 * To establish the connection, call this operation from the Amazon Web Services account that is used
 * to manage the Amazon GameLift Servers fleets. Identify the following values: (1) The ID of the fleet you
 * want to be enable a VPC peering connection for; (2) The Amazon Web Services account with the VPC that
 * you want to peer with; and (3) The ID of the VPC you want to peer with. This operation
 * is asynchronous. If successful, a connection request is created. You can use continuous
 * polling to track the request's status using DescribeVpcPeeringConnections , or by monitoring fleet events for success
 * or failure using DescribeFleetEvents .
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const createVpcPeeringConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateVpcPeeringConnectionInput,
    output: CreateVpcPeeringConnectionOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Deletes an alias. This operation removes all record of the alias. Game clients
 * attempting to access a server process using the deleted alias receive an error. To
 * delete an alias, specify the alias ID to be deleted.
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const deleteAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAliasInput,
  output: DeleteAliasResponse,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    TaggingFailedException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Deletes a build. This operation permanently deletes the build resource and any
 * uploaded build files. Deleting a build does not affect the status of any active fleets
 * using the build, but you can no longer create new fleets with the deleted build.
 *
 * To delete a build, specify the build ID.
 *
 * **Learn more**
 *
 * Upload a Custom
 * Server Build
 *
 * All APIs by task
 */
export const deleteBuild = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBuildInput,
  output: DeleteBuildResponse,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    TaggingFailedException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** Container
 *
 * Deletes all resources and information related to a container fleet and shuts down
 * currently running fleet instances, including those in remote locations. The container
 * fleet must be in `ACTIVE` status to be deleted.
 *
 * To delete a fleet, specify the fleet ID to be terminated. During the deletion process,
 * the fleet status is changed to `DELETING`.
 *
 * **Learn more**
 *
 * Setting up Amazon GameLift Servers
 * Fleets
 */
export const deleteContainerFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteContainerFleetInput,
    output: DeleteContainerFleetOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      TaggingFailedException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** Container
 *
 * **Request options:**
 *
 * Deletes a container group definition.
 *
 * - Delete an entire container group definition, including all versions. Specify the
 * container group definition name, or use an ARN value without the version number.
 *
 * - Delete a particular version. Specify the container group definition name and a version
 * number, or use an ARN value that includes the version number.
 *
 * - Keep the newest versions and delete all older versions. Specify the container group
 * definition name and the number of versions to retain. For example, set
 * `VersionCountToRetain` to 5 to delete all but the five most recent
 * versions.
 *
 * **Result**
 *
 * If successful, Amazon GameLift Servers removes the container group definition versions that you request deletion for.
 * This request will fail for any requested versions if the following is true:
 *
 * - If the version is being used in an active fleet
 *
 * - If the version is being deployed to a fleet in a deployment that's currently in progress.
 *
 * - If the version is designated as a rollback definition in a fleet deployment that's currently in progress.
 *
 * **Learn more**
 *
 * - Manage a container group definition
 */
export const deleteContainerGroupDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteContainerGroupDefinitionInput,
    output: DeleteContainerGroupDefinitionOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      TaggingFailedException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Deletes all resources and information related to a fleet and shuts down any currently
 * running fleet instances, including those in remote locations.
 *
 * If the fleet being deleted has a VPC peering connection, you first need to get a
 * valid authorization (good for 24 hours) by calling CreateVpcPeeringAuthorization. You don't need to explicitly delete the
 * VPC peering connection.
 *
 * To delete a fleet, specify the fleet ID to be terminated. During the deletion process,
 * the fleet status is changed to `DELETING`. When completed, the status
 * switches to `TERMINATED` and the fleet event `FLEET_DELETED` is
 * emitted.
 *
 * **Learn more**
 *
 * Setting up Amazon GameLift Servers
 * Fleets
 */
export const deleteFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFleetInput,
  output: DeleteFleetResponse,
  errors: [
    InternalServiceException,
    InvalidFleetStatusException,
    InvalidRequestException,
    NotFoundException,
    TaggingFailedException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Container
 *
 * Removes locations from a multi-location fleet. When deleting a location, all game
 * server process and all instances that are still active in the location are shut down.
 *
 * To delete fleet locations, identify the fleet ID and provide a list of the locations
 * to be deleted.
 *
 * If successful, GameLift sets the location status to `DELETING`, and begins
 * to shut down existing server processes and terminate instances in each location being
 * deleted. When completed, the location status changes to `TERMINATED`.
 *
 * **Learn more**
 *
 * Setting up Amazon GameLift Servers
 * fleets
 */
export const deleteFleetLocations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteFleetLocationsInput,
    output: DeleteFleetLocationsOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Container
 *
 * Retrieves the resource capacity settings for a fleet location. The data returned
 * includes the current capacity (number of EC2 instances) and some scaling settings for
 * the requested fleet location. For a managed container fleet, this operation also returns counts
 * for game server container groups.
 *
 * Use this operation to retrieve capacity information for a fleet's remote location or
 * home Region (you can also retrieve home Region capacity by calling
 * `DescribeFleetCapacity`).
 *
 * To retrieve capacity data, identify a fleet and location.
 *
 * If successful, a `FleetCapacity` object is returned for the requested fleet
 * location.
 *
 * **Learn more**
 *
 * Setting up Amazon GameLift Servers
 * fleets
 *
 * Amazon GameLift Servers service locations for managed hosting
 *
 * GameLift metrics for fleets
 */
export const describeFleetLocationCapacity =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeFleetLocationCapacityInput,
    output: DescribeFleetLocationCapacityOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }));
/**
 * **This API works with the following fleet types:** EC2, Container
 *
 * Retrieves a fleet's inbound connection permissions. Connection permissions specify IP
 * addresses and port settings that incoming traffic can use to access server processes in
 * the fleet. Game server processes that are running in the fleet must use a port that
 * falls within this range.
 *
 * Use this operation in the following ways:
 *
 * - To retrieve the port settings for a fleet, identify the fleet's unique
 * identifier.
 *
 * - To check the status of recent updates to a fleet remote location, specify the
 * fleet ID and a location. Port setting updates can take time to propagate across
 * all locations.
 *
 * If successful, a set of `IpPermission` objects is returned for the
 * requested fleet ID. When specifying a location, this operation returns a pending status.
 * If the requested fleet has been deleted, the result set is empty.
 *
 * **Learn more**
 *
 * Setting up Amazon GameLift Servers
 * fleets
 */
export const describeFleetPortSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFleetPortSettingsInput,
    output: DescribeFleetPortSettingsOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Container
 *
 * Retrieves utilization statistics for one or more fleets. Utilization data provides a
 * snapshot of how the fleet's hosting resources are currently being used. For fleets with
 * remote locations, this operation retrieves data for the fleet's home Region only. See
 * DescribeFleetLocationUtilization to get utilization statistics for a
 * fleet's remote locations.
 *
 * This operation can be used in the following ways:
 *
 * - To get utilization data for one or more specific fleets, provide a list of
 * fleet IDs or fleet ARNs.
 *
 * - To get utilization data for all fleets, do not provide a fleet identifier.
 *
 * When requesting multiple fleets, use the pagination parameters to retrieve results as
 * a set of sequential pages.
 *
 * If successful, a FleetUtilization object is returned for each requested fleet ID, unless the
 * fleet identifier is not found. Each fleet utilization object includes a
 * `Location` property, which is set to the fleet's home Region.
 *
 * Some API operations may limit the number of fleet IDs allowed in one request. If a
 * request exceeds this limit, the request fails and the error message includes the
 * maximum allowed.
 *
 * **Learn more**
 *
 * Setting up Amazon GameLift Servers
 * Fleets
 *
 * GameLift Metrics for Fleets
 */
export const describeFleetUtilization = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFleetUtilizationInput,
    output: DescribeFleetUtilizationOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2 (FleetIQ)
 *
 * Retrieves information on a
 * game server group. This operation returns only properties related to Amazon GameLift Servers FleetIQ. To view or
 * update properties for the corresponding Auto Scaling group, such as launch template,
 * auto scaling policies, and maximum/minimum group size, access the Auto Scaling group
 * directly.
 *
 * To get attributes for a game server group, provide a group name or ARN value. If
 * successful, a `GameServerGroup` object is returned.
 *
 * **Learn more**
 *
 * Amazon GameLift Servers FleetIQ
 * Guide
 */
export const describeGameServerGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeGameServerGroupInput,
    output: DescribeGameServerGroupOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Retrieves the details of FlexMatch matchmaking configurations.
 *
 * This operation offers the following options: (1) retrieve all matchmaking
 * configurations, (2) retrieve configurations for a specified list, or (3) retrieve all
 * configurations that use a specified rule set name. When requesting multiple items, use
 * the pagination parameters to retrieve results as a set of sequential pages.
 *
 * If successful, a configuration is returned for each requested name. When specifying a
 * list of names, only configurations that currently exist are returned.
 *
 * **Learn more**
 *
 * Setting up FlexMatch matchmakers
 */
export const describeMatchmakingConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeMatchmakingConfigurationsInput,
    output: DescribeMatchmakingConfigurationsOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      UnsupportedRegionException,
    ],
  }));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Retrieves the details for FlexMatch matchmaking rule sets. You can request all existing
 * rule sets for the Region, or provide a list of one or more rule set names. When
 * requesting multiple items, use the pagination parameters to retrieve results as a set of
 * sequential pages. If successful, a rule set is returned for each requested name.
 *
 * **Learn more**
 *
 * - Build a rule
 * set
 */
export const describeMatchmakingRuleSets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeMatchmakingRuleSetsInput,
    output: DescribeMatchmakingRuleSetsOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnsupportedRegionException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Retrieves properties for one or more player sessions.
 *
 * This action can be used in the following ways:
 *
 * - To retrieve a specific player session, provide the player session ID
 * only.
 *
 * - To retrieve all player sessions in a game session, provide the game session ID
 * only.
 *
 * - To retrieve all player sessions for a specific player, provide a player ID
 * only.
 *
 * To request player sessions, specify either a player session ID, game session ID, or
 * player ID. You can filter this request by player session status. If you provide
 * a specific `PlayerSessionId` or `PlayerId`, Amazon GameLift Servers ignores the filter criteria.
 * Use the pagination parameters to retrieve results as a set of sequential pages.
 *
 * If successful, a `PlayerSession` object is returned for each session that
 * matches the request.
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const describePlayerSessions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribePlayerSessionsInput,
    output: DescribePlayerSessionsOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2
 *
 * Retrieves a fleet's runtime configuration settings. The runtime configuration
 * determines which server processes run, and how, on computes in the fleet. For managed
 * EC2 fleets, the runtime configuration describes server processes that run on each fleet
 * instance. You can update a fleet's runtime configuration at any time using
 * UpdateRuntimeConfiguration.
 *
 * To get the current runtime configuration for a fleet, provide the fleet ID.
 *
 * If successful, a `RuntimeConfiguration` object is returned for the
 * requested fleet. If the requested fleet has been deleted, the result set is
 * empty.
 *
 * **Learn more**
 *
 * Setting up Amazon GameLift Servers
 * fleets
 *
 * Running multiple
 * processes on a fleet
 */
export const describeRuntimeConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeRuntimeConfigurationInput,
    output: DescribeRuntimeConfigurationOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Retrieves properties for a Realtime script.
 *
 * To request a script record, specify the script ID. If successful, an object containing
 * the script properties is returned.
 *
 * **Learn more**
 *
 * Amazon GameLift Servers Amazon GameLift Servers Realtime
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const describeScript = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeScriptInput,
  output: DescribeScriptOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Retrieves valid VPC peering authorizations that are pending for the Amazon Web Services account.
 * This operation returns all VPC peering authorizations and requests for peering. This
 * includes those initiated and received by this account.
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const describeVpcPeeringAuthorizations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeVpcPeeringAuthorizationsInput,
    output: DescribeVpcPeeringAuthorizationsOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      UnauthorizedException,
    ],
  }));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Requests an authentication token from Amazon GameLift Servers for a compute resource in an Amazon GameLift Servers
 * fleet. Game servers that are running on the compute use this token to communicate
 * with the Amazon GameLift Servers service, such as when calling the Amazon GameLift Servers server SDK action
 * `InitSDK()`. Authentication tokens are valid for a limited time span, so
 * you need to request a fresh token before the current token expires.
 *
 * **Request options**
 *
 * - For managed EC2 fleets (compute type `EC2`), auth token retrieval
 * and refresh is handled automatically. All game servers that are running on all
 * fleet instances have access to a valid auth token.
 *
 * - For Anywhere fleets (compute type `ANYWHERE`), if you're using the
 * Amazon GameLift Servers Agent, auth token retrieval and refresh is handled automatically for any
 * compute where the Agent is running. If you're not using
 * the Agent, create a mechanism to retrieve and refresh auth tokens for computes
 * that are running game server processes.
 *
 * **Learn more**
 *
 * - Create an
 * Anywhere fleet
 *
 * - Test your
 * integration
 *
 * - Server SDK
 * reference guides (for version 5.x)
 */
export const getComputeAuthToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetComputeAuthTokenInput,
  output: GetComputeAuthTokenOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Retrieves the location of stored game session logs for a specified game session on
 * Amazon GameLift Servers managed fleets. When a game session is terminated, Amazon GameLift Servers automatically stores
 * the logs in Amazon S3 and retains them for 14 days. Use this URL to download the logs.
 *
 * See the Amazon Web Services Service
 * Limits page for maximum log file sizes. Log files that exceed this limit
 * are not saved.
 *
 * All APIs by task
 */
export const getGameSessionLogUrl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetGameSessionLogUrlInput,
    output: GetGameSessionLogUrlOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Retrieves all aliases for this Amazon Web Services account. You can filter the result set by alias
 * name and/or routing strategy type. Use the pagination parameters to retrieve results in
 * sequential pages.
 *
 * Returned aliases are not listed in any particular order.
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const listAliases = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAliasesInput,
  output: ListAliasesOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Retrieves build resources for all builds associated with the Amazon Web Services account in use. You
 * can limit results to builds that are in a specific status by using the
 * `Status` parameter. Use the pagination parameters to retrieve results in
 *
 * Build resources are not listed in any particular order.
 *
 * **Learn more**
 *
 * Upload a Custom
 * Server Build
 *
 * All APIs by task
 */
export const listBuilds = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBuildsInput,
  output: ListBuildsOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Retrieves information on the compute resources in an Amazon GameLift Servers fleet. Use the pagination
 * parameters to retrieve results in a set of sequential pages.
 *
 * **Request options**
 *
 * - Retrieve a list of all computes in a fleet. Specify a fleet ID.
 *
 * - Retrieve a list of all computes in a specific fleet location. Specify a fleet
 * ID and location.
 *
 * **Results**
 *
 * If successful, this operation returns information on a set of computes. Depending on
 * the type of fleet, the result includes the following information:
 *
 * - For a managed EC2 fleet (compute type `EC2`), this operation
 * returns information about the EC2 instance. Compute names are EC2 instance
 * IDs.
 *
 * - For an Anywhere fleet (compute type `ANYWHERE`), this operation
 * returns compute names and details from when the compute was registered with
 * `RegisterCompute`. This includes
 * `GameLiftServiceSdkEndpoint` or
 * `GameLiftAgentEndpoint`.
 */
export const listCompute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListComputeInput,
  output: ListComputeOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    UnauthorizedException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** Container
 *
 * Retrieves a collection of container fleet resources in an Amazon Web Services Region. For fleets
 * that have multiple locations, this operation retrieves fleets based on their home Region
 * only.
 *
 * **Request options**
 *
 * - Get a list of all fleets. Call this operation without specifying a container
 * group definition.
 *
 * - Get a list of fleets filtered by container group definition. Provide the
 * container group definition name or ARN value.
 *
 * - To get a list of all Amazon GameLift Servers Realtime fleets with a specific configuration script,
 * provide the script ID.
 *
 * Use the pagination parameters to retrieve results as a set of sequential pages.
 *
 * If successful, this operation returns a collection of container fleets that match the request
 * parameters. A NextToken value is also returned if there are more result pages to
 * retrieve.
 *
 * Fleet IDs are returned in no particular order.
 */
export const listContainerFleets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListContainerFleetsInput,
  output: ListContainerFleetsOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    UnauthorizedException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** Container
 *
 * Retrieves container group definitions for the Amazon Web Services account and Amazon Web Services Region. Use the pagination parameters to retrieve results in a set of sequential
 * pages.
 *
 * This operation returns only the latest version of each definition. To retrieve all
 * versions of a container group definition, use ListContainerGroupDefinitionVersions.
 *
 * **Request options:**
 *
 * - Retrieve the most recent versions of all container group definitions.
 *
 * - Retrieve the most recent versions of all container group definitions, filtered by
 * type. Specify the container group type to filter on.
 *
 * **Results:**
 *
 * If successful, this operation returns the complete properties of a set of container group
 * definition versions that match the request.
 *
 * This operation returns the list of container group definitions in no particular order.
 */
export const listContainerGroupDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListContainerGroupDefinitionsInput,
    output: ListContainerGroupDefinitionsOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }));
/**
 * **This API works with the following fleet types:** Container
 *
 * Retrieves all versions of a container group definition. Use the pagination parameters to
 * retrieve results in a set of sequential pages.
 *
 * **Request options:**
 *
 * - Get all versions of a specified container group definition. Specify the container
 * group definition name or ARN value. (If the ARN value has a version number, it's
 * ignored.)
 *
 * **Results:**
 *
 * If successful, this operation returns the complete properties of a set of container group
 * definition versions that match the request.
 *
 * This operation returns the list of container group definitions in descending version
 * order (latest first).
 *
 * **Learn more**
 *
 * - Manage a container group definition
 */
export const listContainerGroupDefinitionVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListContainerGroupDefinitionVersionsInput,
    output: ListContainerGroupDefinitionVersionsOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }));
/**
 * **This API works with the following fleet types:** Container
 *
 * Retrieves a collection of container fleet deployments in an Amazon Web Services Region. Use the
 * pagination parameters to retrieve results as a set of sequential pages.
 *
 * **Request options**
 *
 * - Get a list of all deployments. Call this operation without specifying a fleet ID.
 *
 * - Get a list of all deployments for a fleet. Specify the container fleet ID or ARN value.
 *
 * **Results**
 *
 * If successful, this operation returns a list of deployments that match the request
 * parameters. A NextToken value is also returned if there are more result pages to
 * retrieve.
 *
 * Deployments are returned starting with the latest.
 */
export const listFleetDeployments = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListFleetDeploymentsInput,
    output: ListFleetDeploymentsOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Retrieves a collection of fleet resources in an Amazon Web Services Region. You can filter the
 * result set to find only those fleets that are deployed with a specific build or script.
 * For fleets that have multiple locations, this operation retrieves fleets based on their
 * home Region only.
 *
 * You can use operation in the following ways:
 *
 * - To get a list of all fleets in a Region, don't provide a build or script
 * identifier.
 *
 * - To get a list of all fleets where a specific game build is deployed, provide
 * the build ID.
 *
 * - To get a list of all Amazon GameLift Servers Realtime fleets with a specific configuration script,
 * provide the script ID.
 *
 * Use the pagination parameters to retrieve results as a set of sequential pages.
 *
 * If successful, this operation returns a list of fleet IDs that match the request
 * parameters. A NextToken value is also returned if there are more result pages to
 * retrieve.
 *
 * Fleet IDs are returned in no particular order.
 */
export const listFleets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFleetsInput,
  output: ListFleetsOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2 (FleetIQ)
 *
 * Lists a game server groups.
 */
export const listGameServerGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListGameServerGroupsInput,
    output: ListGameServerGroupsOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2 (FleetIQ)
 *
 * Retrieves information on all game
 * servers that are currently active in a specified game server group. You can opt to sort
 * the list by game server age. Use the pagination parameters to retrieve results in a set
 * of sequential segments.
 *
 * **Learn more**
 *
 * Amazon GameLift Servers FleetIQ
 * Guide
 */
export const listGameServers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGameServersInput,
  output: ListGameServersOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** Anywhere
 *
 * Lists all custom and Amazon Web Services locations where Amazon GameLift Servers can host game servers.
 *
 * Note that if you call this API using a location that doesn't have a service endpoint,
 * such as one that can only be a remote location in a multi-location fleet, the API
 * returns an error.
 *
 * Consult the table of supported locations in Amazon GameLift Servers service
 * locations to identify home Regions that support single and multi-location
 * fleets.
 *
 * **Learn more**
 *
 * Service locations
 */
export const listLocations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLocationsInput,
  output: ListLocationsOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Retrieves script records for all Realtime scripts that are associated with the Amazon Web Services
 * account in use.
 *
 * **Learn more**
 *
 * Amazon GameLift Servers Amazon GameLift Servers Realtime
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const listScripts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListScriptsInput,
  output: ListScriptsOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Retrieves all tags assigned to a Amazon GameLift Servers resource. Use resource tags to organize Amazon Web Services
 * resources for a range of purposes. This operation handles the permissions necessary to
 * manage tags for Amazon GameLift Servers resources that support tagging.
 *
 * To list tags for a resource, specify the unique ARN value for the resource.
 *
 * **Learn more**
 *
 * Tagging Amazon Web Services
 * Resources in the *Amazon Web Services General Reference*
 *
 * Amazon Web Services Tagging Strategies
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    TaggingFailedException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Retrieves a fresh set of credentials for use when uploading a new set of game build
 * files to Amazon GameLift Servers's Amazon S3. This is done as part of the build creation process; see
 * CreateBuild.
 *
 * To request new credentials, specify the build ID as returned with an initial
 * `CreateBuild` request. If successful, a new set of credentials are
 * returned, along with the S3 storage location associated with the build ID.
 *
 * **Learn more**
 *
 * Create a Build with Files in S3
 *
 * All APIs by task
 */
export const requestUploadCredentials = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RequestUploadCredentialsInput,
    output: RequestUploadCredentialsOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2 (FleetIQ)
 *
 * Reinstates activity on a game
 * server group after it has been suspended. A game server group might be suspended by the
 * SuspendGameServerGroup operation, or it might be suspended involuntarily
 * due to a configuration problem. In the second case, you can manually resume activity on
 * the group once the configuration problem has been resolved. Refer to the game server
 * group status and status reason for more information on why group activity is
 * suspended.
 *
 * To resume activity, specify a game server group ARN and the type of activity to be
 * resumed. If successful, a `GameServerGroup` object is returned showing that
 * the resumed activity is no longer listed in `SuspendedActions`.
 *
 * **Learn more**
 *
 * Amazon GameLift Servers FleetIQ
 * Guide
 */
export const resumeGameServerGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ResumeGameServerGroupInput,
    output: ResumeGameServerGroupOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Retrieves all active game sessions that match a set of search criteria and sorts them
 * into a specified order.
 *
 * This operation is not designed to continually track game session status because that practice can cause you to exceed your API limit and generate errors. Instead, configure an Amazon Simple Notification Service (Amazon SNS) topic to receive notifications from a matchmaker or a game session placement queue.
 *
 * When searching for game sessions, you specify exactly where you want to search and
 * provide a search filter expression, a sort expression, or both. A search request can
 * search only one fleet, but it can search all of a fleet's locations.
 *
 * This operation can be used in the following ways:
 *
 * - To search all game sessions that are currently running on all locations in a
 * fleet, provide a fleet or alias ID. This approach returns game sessions in the
 * fleet's home Region and all remote locations that fit the search
 * criteria.
 *
 * - To search all game sessions that are currently running on a specific fleet
 * location, provide a fleet or alias ID and a location name. For location, you can
 * specify a fleet's home Region or any remote location.
 *
 * Use the pagination parameters to retrieve results as a set of sequential pages.
 *
 * If successful, a `GameSession` object is returned for each game session
 * that matches the request. Search finds game sessions that are in `ACTIVE`
 * status only. To retrieve information on game sessions in other statuses, use DescribeGameSessions.
 *
 * To set search and sort criteria, create a filter expression using the following game session attributes. For game session search examples, see the Examples section of this topic.
 *
 * - **gameSessionId** -- A unique identifier for the game session. You can use either a
 * `GameSessionId` or `GameSessionArn` value.
 *
 * - **gameSessionName** -- Name assigned to a game
 * session. Game session names do not need to be unique to a game session.
 *
 * - **gameSessionProperties** -- A set of key-value pairs that can store custom data in a game session.
 * For example: `{"Key": "difficulty", "Value": "novice"}`.
 * The filter expression must specify the https://docs.aws.amazon.com/gamelift/latest/apireference/API_GameProperty -- a `Key` and a string `Value` to search for the game sessions.
 *
 * For example, to search for the above key-value pair, specify the following search filter: `gameSessionProperties.difficulty = "novice"`.
 * All game property values are searched as strings.
 *
 * For examples of searching game sessions, see the ones below, and also see Search game sessions by game property.
 *
 * - **maximumSessions** -- Maximum number of player
 * sessions allowed for a game session.
 *
 * - **creationTimeMillis** -- Value indicating when a
 * game session was created. It is expressed in Unix time as milliseconds.
 *
 * - **playerSessionCount** -- Number of players
 * currently connected to a game session. This value changes rapidly as players
 * join the session or drop out.
 *
 * - **hasAvailablePlayerSessions** -- Boolean value
 * indicating whether a game session has reached its maximum number of players. It
 * is highly recommended that all search requests include this filter attribute to
 * optimize search performance and return only sessions that players can join.
 *
 * Returned values for `playerSessionCount` and
 * `hasAvailablePlayerSessions` change quickly as players join sessions
 * and others drop out. Results should be considered a snapshot in time. Be sure to
 * refresh search results often, and handle sessions that fill up before a player can
 * join.
 *
 * All APIs by task
 */
export const searchGameSessions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchGameSessionsInput,
  output: SearchGameSessionsOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    TerminalRoutingStrategyException,
    UnauthorizedException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Container
 *
 * Resumes certain types of activity on fleet instances that were suspended with StopFleetActions. For multi-location fleets, fleet actions are managed
 * separately for each location. Currently, this operation is used to restart a fleet's
 * auto-scaling activity.
 *
 * This operation can be used in the following ways:
 *
 * - To restart actions on instances in the fleet's home Region, provide a fleet ID
 * and the type of actions to resume.
 *
 * - To restart actions on instances in one of the fleet's remote locations,
 * provide a fleet ID, a location name, and the type of actions to resume.
 *
 * If successful, Amazon GameLift Servers once again initiates scaling events as triggered by the fleet's
 * scaling policies. If actions on the fleet location were never stopped, this operation
 * will have no effect.
 *
 * **Learn more**
 *
 * Setting up Amazon GameLift Servers
 * fleets
 */
export const startFleetActions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartFleetActionsInput,
  output: StartFleetActionsOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Uses FlexMatch to create a game match for a group of players based on custom matchmaking
 * rules. With games that use Amazon GameLift Servers managed hosting, this operation also triggers Amazon GameLift Servers
 * to find hosting resources and start a new game session for the new match. Each
 * matchmaking request includes information on one or more players and specifies the
 * FlexMatch matchmaker to use. When a request is for multiple players, FlexMatch attempts to
 * build a match that includes all players in the request, placing them in the same team
 * and finding additional players as needed to fill the match.
 *
 * To start matchmaking, provide a unique ticket ID, specify a matchmaking configuration,
 * and include the players to be matched. You must also include any player attributes that
 * are required by the matchmaking configuration's rule set. If successful, a matchmaking
 * ticket is returned with status set to `QUEUED`.
 *
 * Track matchmaking events to respond as needed and acquire game session connection
 * information for successfully completed matches. Ticket status updates are tracked using
 * event notification through Amazon Simple Notification Service, which is defined in the matchmaking
 * configuration.
 *
 * **Learn more**
 *
 * Add FlexMatch to a game client
 *
 * Set Up FlexMatch event
 * notification
 *
 * How Amazon GameLift Servers FlexMatch works
 */
export const startMatchmaking = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMatchmakingInput,
  output: StartMatchmakingOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Container
 *
 * Suspends certain types of activity in a fleet location. Currently, this operation is
 * used to stop auto-scaling activity. For multi-location fleets, fleet actions are managed
 * separately for each location.
 *
 * Stopping fleet actions has several potential purposes. It allows you to temporarily
 * stop auto-scaling activity but retain your scaling policies for use in the future. For
 * multi-location fleets, you can set up fleet-wide auto-scaling, and then opt out of it
 * for certain locations.
 *
 * This operation can be used in the following ways:
 *
 * - To stop actions on instances in the fleet's home Region, provide a fleet ID
 * and the type of actions to suspend.
 *
 * - To stop actions on instances in one of the fleet's remote locations, provide a
 * fleet ID, a location name, and the type of actions to suspend.
 *
 * If successful, Amazon GameLift Servers no longer initiates scaling events except in response to manual
 * changes using UpdateFleetCapacity. To restart fleet actions again, call
 * StartFleetActions.
 *
 * **Learn more**
 *
 * Setting up Amazon GameLift Servers
 * Fleets
 */
export const stopFleetActions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopFleetActionsInput,
  output: StopFleetActionsOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Cancels a game session placement that's in `PENDING` status. To stop a
 * placement, provide the placement ID value.
 *
 * Results
 *
 * If successful, this operation removes the placement request from the queue and moves
 * the `GameSessionPlacement` to `CANCELLED` status.
 *
 * This operation results in an `InvalidRequestExecption` (400) error if a
 * game session has already been created for this placement. You can clean up an unneeded
 * game session by calling TerminateGameSession.
 */
export const stopGameSessionPlacement = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopGameSessionPlacementInput,
    output: StopGameSessionPlacementOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2 (FleetIQ)
 *
 * Temporarily stops activity on
 * a game server group without terminating instances or the game server group. You can
 * restart activity by calling ResumeGameServerGroup. You can suspend the following activity:
 *
 * - **Instance type replacement** - This activity
 * evaluates the current game hosting viability of all Spot instance types that are
 * defined for the game server group. It updates the Auto Scaling group to remove
 * nonviable Spot Instance types, which have a higher chance of game server
 * interruptions. It then balances capacity across the remaining viable Spot
 * Instance types. When this activity is suspended, the Auto Scaling group
 * continues with its current balance, regardless of viability. Instance
 * protection, utilization metrics, and capacity scaling activities continue to be
 * active.
 *
 * To suspend activity, specify a game server group ARN and the type of activity to be
 * suspended. If successful, a `GameServerGroup` object is returned showing that
 * the activity is listed in `SuspendedActions`.
 *
 * **Learn more**
 *
 * Amazon GameLift Servers FleetIQ
 * Guide
 */
export const suspendGameServerGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SuspendGameServerGroupInput,
    output: SuspendGameServerGroupOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Updates properties for an alias. Specify the unique identifier of the alias to be
 * updated and the new property values.
 *
 * When reassigning an alias to a new fleet, provide
 * an updated routing strategy. If successful, the updated alias record is returned.
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const updateAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAliasInput,
  output: UpdateAliasOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Updates metadata in a build resource, including the build name and version. To update
 * the metadata, specify the build ID to update and provide the new values. If successful,
 * a build object containing the updated metadata is returned.
 *
 * **Learn more**
 *
 * Upload a Custom
 * Server Build
 *
 * All APIs by task
 */
export const updateBuild = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBuildInput,
  output: UpdateBuildOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** Container
 *
 * Updates properties in an existing container group definition. This operation doesn't
 * replace the definition. Instead, it creates a new version of the definition and saves it
 * separately. You can access all versions that you choose to retain.
 *
 * The only property you can't update is the container group type.
 *
 * **Request options:**
 *
 * - Update based on the latest version of the container group definition. Specify the
 * container group definition name only, or use an ARN value without a version number.
 * Provide updated values for the properties that you want to change only. All other values
 * remain the same as the latest version.
 *
 * - Update based on a specific version of the container group definition. Specify the
 * container group definition name and a source version number, or use an ARN value with a
 * version number. Provide updated values for the properties that you want to change only.
 * All other values remain the same as the source version.
 *
 * - Change a game server container definition. Provide the updated container
 * definition.
 *
 * - Add or change a support container definition. Provide a complete set of container
 * definitions, including the updated definition.
 *
 * - Remove a support container definition. Provide a complete set of container
 * definitions, excluding the definition to remove. If the container group has only one
 * support container definition, provide an empty set.
 *
 * **Results:**
 *
 * If successful, this operation returns the complete properties of the new container group
 * definition version.
 *
 * If the container group definition version is used in an active fleets, the update
 * automatically initiates a new fleet deployment of the new version. You can track a fleet's
 * deployments using ListFleetDeployments.
 */
export const updateContainerGroupDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateContainerGroupDefinitionInput,
    output: UpdateContainerGroupDefinitionOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      LimitExceededException,
      NotFoundException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Updates a fleet's mutable attributes, such as game session protection and resource
 * creation limits.
 *
 * To update fleet attributes, specify the fleet ID and the property values that you want
 * to change. If successful, Amazon GameLift Servers returns the identifiers for the updated fleet.
 *
 * A managed fleet's runtime environment, which depends on the fleet's
 * Amazon Machine Image {AMI} version, can't be updated. You must create a new
 * fleet. As a best practice, we recommend replacing your managed fleets every 30
 * days to maintain a secure and up-to-date runtime environment for your hosted game
 * servers. For guidance, see
 * Security best practices for Amazon GameLift Servers.
 *
 * **Learn more**
 *
 * Setting up Amazon GameLift Servers
 * fleets
 */
export const updateFleetAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateFleetAttributesInput,
    output: UpdateFleetAttributesOutput,
    errors: [
      ConflictException,
      InternalServiceException,
      InvalidFleetStatusException,
      InvalidRequestException,
      LimitExceededException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Container
 *
 * Updates capacity settings for a managed EC2 fleet or managed container fleet. For these
 * fleets, you adjust capacity by changing the number of instances in the fleet. Fleet
 * capacity determines the number of game sessions and players that the fleet can host
 * based on its configuration. For fleets with multiple locations, use this operation to
 * manage capacity settings in each location individually.
 *
 * Use this operation to set these fleet capacity properties:
 *
 * - Minimum/maximum size: Set hard limits on the number of Amazon EC2 instances allowed. If Amazon GameLift Servers receives a
 * request--either through manual update or automatic scaling--it won't change the capacity
 * to a value outside of this range.
 *
 * - Desired capacity: As an alternative to automatic scaling, manually set the number of Amazon EC2
 * instances to be maintained.
 * Before changing a fleet's desired capacity, check the maximum capacity of the
 * fleet's Amazon EC2 instance type by calling DescribeEC2InstanceLimits.
 *
 * To update capacity for a fleet's home Region, or if the fleet has no remote
 * locations, omit the `Location` parameter. The fleet must be in
 * `ACTIVE` status.
 *
 * To update capacity for a fleet's remote location, set the
 * `Location` parameter to the location to update. The location must be in
 * `ACTIVE` status.
 *
 * If successful, Amazon GameLift Servers updates the capacity settings and returns the identifiers for
 * the updated fleet and/or location. If a requested change to desired capacity exceeds the
 * instance type's limit, the `LimitExceeded` exception occurs.
 *
 * Updates often prompt an immediate change in fleet capacity, such as when current
 * capacity is different than the new desired capacity or outside the new limits. In this
 * scenario, Amazon GameLift Servers automatically initiates steps to add or remove instances in the fleet
 * location. You can track a fleet's current capacity by calling DescribeFleetCapacity or DescribeFleetLocationCapacity.
 *
 * **Learn more**
 *
 * Scaling fleet
 * capacity
 */
export const updateFleetCapacity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFleetCapacityInput,
  output: UpdateFleetCapacityOutput,
  errors: [
    ConflictException,
    InternalServiceException,
    InvalidFleetStatusException,
    InvalidRequestException,
    LimitExceededException,
    NotFoundException,
    UnauthorizedException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Container
 *
 * Updates permissions that allow inbound traffic to connect to game sessions in the
 * fleet.
 *
 * To update settings, specify the fleet ID to be updated and specify the changes to be
 * made. List the permissions you want to add in
 * `InboundPermissionAuthorizations`, and permissions you want to remove in
 * `InboundPermissionRevocations`. Permissions to be removed must match
 * existing fleet permissions.
 *
 * If successful, the fleet ID for the updated fleet is returned. For fleets with remote
 * locations, port setting updates can take time to propagate across all locations. You can
 * check the status of updates in each location by calling
 * `DescribeFleetPortSettings` with a location name.
 *
 * **Learn more**
 *
 * Setting up Amazon GameLift Servers
 * fleets
 */
export const updateFleetPortSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateFleetPortSettingsInput,
    output: UpdateFleetPortSettingsOutput,
    errors: [
      ConflictException,
      InternalServiceException,
      InvalidFleetStatusException,
      InvalidRequestException,
      LimitExceededException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2 (FleetIQ)
 *
 * Updates information about a registered game server to help Amazon GameLift Servers FleetIQ track game server
 * availability. This operation is called by a game server process that is running on an
 * instance in a game server group.
 *
 * Use this operation to update the following types of game server information. You can
 * make all three types of updates in the same request:
 *
 * - To update the game server's utilization status from `AVAILABLE`
 * (when the game server is available to be claimed) to `UTILIZED` (when
 * the game server is currently hosting games). Identify the game server and game
 * server group and specify the new utilization status. You can't change the status
 * from to `UTILIZED` to `AVAILABLE` .
 *
 * - To report health status, identify the game server and game server group and
 * set health check to `HEALTHY`. If a game server does not report
 * health status for a certain length of time, the game server is no longer
 * considered healthy. As a result, it will be eventually deregistered from the
 * game server group to avoid affecting utilization metrics. The best practice is
 * to report health every 60 seconds.
 *
 * - To change game server metadata, provide updated game server data.
 *
 * Once a game server is successfully updated, the relevant statuses and timestamps are
 * updated.
 *
 * **Learn more**
 *
 * Amazon GameLift Servers FleetIQ
 * Guide
 */
export const updateGameServer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGameServerInput,
  output: UpdateGameServerOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2 (FleetIQ)
 *
 * Updates Amazon GameLift Servers FleetIQ-specific
 * properties for a game server group. Many Auto Scaling group properties are updated on
 * the Auto Scaling group directly, including the launch template, Auto Scaling policies,
 * and maximum/minimum/desired instance counts.
 *
 * To update the game server group, specify the game server group ID and provide the
 * updated values. Before applying the updates, the new values are validated to ensure that
 * Amazon GameLift Servers FleetIQ can continue to perform instance balancing activity. If successful, a
 * `GameServerGroup` object is returned.
 *
 * **Learn more**
 *
 * Amazon GameLift Servers FleetIQ
 * Guide
 */
export const updateGameServerGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateGameServerGroupInput,
    output: UpdateGameServerGroupOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Updates the configuration of a game session queue, which determines how the queue
 * processes new game session requests. To update settings, specify the queue name to be
 * updated and provide the new settings. When updating destinations, provide a complete
 * list of destinations.
 *
 * **Learn more**
 *
 * Using Multi-Region Queues
 */
export const updateGameSessionQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateGameSessionQueueInput,
    output: UpdateGameSessionQueueOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Updates settings for a FlexMatch matchmaking configuration. These changes affect all
 * matches and game sessions that are created after the update. To update settings, specify
 * the configuration name to be updated and provide the new settings.
 *
 * **Learn more**
 *
 * Design a FlexMatch
 * matchmaker
 */
export const updateMatchmakingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateMatchmakingConfigurationInput,
    output: UpdateMatchmakingConfigurationOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnsupportedRegionException,
    ],
  }));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Updates the runtime configuration for the specified fleet. The runtime configuration
 * tells Amazon GameLift Servers how to launch server processes on computes in managed EC2 and Anywhere fleets. You
 * can update a fleet's runtime configuration at any time after the fleet is created; it
 * does not need to be in `ACTIVE` status.
 *
 * To update runtime configuration, specify the fleet ID and provide a
 * `RuntimeConfiguration` with an updated set of server process
 * configurations.
 *
 * If successful, the fleet's runtime configuration settings are updated. Fleet computes
 * that run game server processes regularly check for and receive updated runtime
 * configurations. The computes immediately take action to comply with the new
 * configuration by launching new server processes or by not replacing existing processes
 * when they shut down. Updating a fleet's runtime configuration never affects existing
 * server processes.
 *
 * **Learn more**
 *
 * Setting up Amazon GameLift Servers
 * fleets
 */
export const updateRuntimeConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateRuntimeConfigurationInput,
    output: UpdateRuntimeConfigurationOutput,
    errors: [
      InternalServiceException,
      InvalidFleetStatusException,
      InvalidRequestException,
      LimitExceededException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2
 *
 * Updates Realtime script metadata and content.
 *
 * To update script metadata, specify the script ID and provide updated name and/or
 * version values.
 *
 * To update script content, provide an updated zip file by pointing to either a local
 * file or an Amazon S3 bucket location. You can use either method regardless of how the
 * original script was uploaded. Use the *Version* parameter to track
 * updates to the script.
 *
 * If the call is successful, the updated metadata is stored in the script record and a
 * revised script is uploaded to the Amazon GameLift Servers service. Once the script is updated and
 * acquired by a fleet instance, the new version is used for all new game sessions.
 *
 * **Learn more**
 *
 * Amazon GameLift Servers Amazon GameLift Servers Realtime
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const updateScript = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateScriptInput,
  output: UpdateScriptOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Validates the syntax of a matchmaking rule or rule set. This operation checks that the
 * rule set is using syntactically correct JSON and that it conforms to allowed property
 * expressions. To validate syntax, provide a rule set JSON string.
 *
 * **Learn more**
 *
 * - Build a rule
 * set
 */
export const validateMatchmakingRuleSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ValidateMatchmakingRuleSetInput,
    output: ValidateMatchmakingRuleSetOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      UnsupportedRegionException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Creates an alias for a fleet. In most situations, you can use an alias ID in place of
 * a fleet ID. An alias provides a level of abstraction for a fleet that is useful when
 * redirecting player traffic from one fleet to another, such as when updating your game
 * build.
 *
 * Amazon GameLift Servers supports two types of routing strategies for aliases: simple and terminal. A
 * simple alias points to an active fleet. A terminal alias is used to display messaging or
 * link to a URL instead of routing players to an active fleet. For example, you might use
 * a terminal alias when a game version is no longer supported and you want to direct
 * players to an upgrade site.
 *
 * To create a fleet alias, specify an alias name, routing strategy, and optional
 * description. Each simple alias can point to only one fleet, but a fleet can have
 * multiple aliases. If successful, a new alias record is returned, including an alias ID
 * and an ARN. You can reassign an alias to another fleet by calling
 * `UpdateAlias`.
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const createAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAliasInput,
  output: CreateAliasOutput,
  errors: [
    ConflictException,
    InternalServiceException,
    InvalidRequestException,
    LimitExceededException,
    TaggingFailedException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Anywhere
 *
 * Creates a new Amazon GameLift Servers build resource for your game server binary files. Combine game
 * server binaries into a zip file for use with Amazon GameLift Servers.
 *
 * When setting up a new game build for Amazon GameLift Servers, we recommend using the CLI command
 * upload-build
 * . This helper command combines two tasks: (1) it
 * uploads your build files from a file directory to an Amazon GameLift Servers Amazon S3 location, and (2)
 * it creates a new build resource.
 *
 * You can use the `CreateBuild` operation in the following scenarios:
 *
 * - Create a new game build with build files that are in an Amazon S3 location under an
 * Amazon Web Services account that you control. To use this option, you give Amazon GameLift Servers access to
 * the Amazon S3 bucket. With permissions in place, specify a build name, operating
 * system, and the Amazon S3 storage location of your game build.
 *
 * - Upload your build files to a Amazon GameLift Servers Amazon S3 location. To use this option,
 * specify a build name and operating system. This operation creates a new build
 * resource and also returns an Amazon S3 location with temporary access credentials.
 * Use the credentials to manually upload your build files to the specified Amazon S3
 * location. For more information, see Uploading Objects in
 * the *Amazon S3 Developer Guide*. After you upload build files to
 * the Amazon GameLift Servers Amazon S3 location, you can't update them.
 *
 * If successful, this operation creates a new build resource with a unique build ID and
 * places it in `INITIALIZED` status. A build must be in `READY`
 * status before you can create fleets with it.
 *
 * **Learn more**
 *
 * Uploading Your
 * Game
 *
 * Create a Build with Files in Amazon S3
 *
 * All APIs by task
 */
export const createBuild = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBuildInput,
  output: CreateBuildOutput,
  errors: [
    ConflictException,
    InternalServiceException,
    InvalidRequestException,
    TaggingFailedException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** Container
 *
 * Creates a managed fleet of Amazon Elastic Compute Cloud (Amazon EC2) instances to host your containerized game
 * servers. Use this operation to define how to deploy a container architecture onto each
 * fleet instance and configure fleet settings. You can create a container fleet in any
 * Amazon Web Services Regions that Amazon GameLift Servers supports for multi-location fleets. A container fleet can be
 * deployed to a single location or multiple locations. Container fleets are deployed with
 * Amazon Linux 2023 as the instance operating system.
 *
 * Define the fleet's container architecture using container group definitions. Each
 * fleet can have one of the following container group types:
 *
 * - The game server container group runs your game server build and dependent software. Amazon GameLift Servers
 * deploys one or more replicas of this container group to each fleet instance. The
 * number of replicas depends on the computing capabilities of the fleet instance
 * in use.
 *
 * - An optional per-instance container group might be used to run other software that only needs
 * to run once per instance, such as background services, logging, or test
 * processes. One per-instance container group is deployed to each fleet instance.
 *
 * Each container group can include the definition for one or more containers. A
 * container definition specifies a container image that is stored in an Amazon Elastic Container Registry (Amazon ECR)
 * public or private repository.
 *
 * **Request options**
 *
 * Use this operation to make the following types of requests. Most fleet settings have
 * default values, so you can create a working fleet with a minimal configuration and
 * default values, which you can customize later.
 *
 * - Create a fleet with no container groups. You can configure a container fleet and then add
 * container group definitions later. In this scenario, no fleet instances are
 * deployed, and the fleet can't host game sessions until you add a game server
 * container group definition. Provide the following required parameter
 * values:
 *
 * - `FleetRoleArn`
 *
 * - Create a fleet with a game server container group. Provide the following required parameter
 * values:
 *
 * - `FleetRoleArn`
 *
 * - `GameServerContainerGroupDefinitionName`
 *
 * - Create a fleet with a game server container group and a per-instance container group. Provide
 * the following required parameter values:
 *
 * - `FleetRoleArn`
 *
 * - `GameServerContainerGroupDefinitionName`
 *
 * - `PerInstanceContainerGroupDefinitionName`
 *
 * **Results**
 *
 * If successful, this operation creates a new container fleet resource, places it in
 * `PENDING` status, and initiates the fleet creation workflow. For fleets with container groups, this workflow
 * starts a fleet deployment and transitions the status to `ACTIVE`. Fleets
 * without a container group are placed in `CREATED` status.
 *
 * You can update most of the properties of a fleet, including container group
 * definitions, and deploy the update across all fleet instances. Use
 * UpdateContainerFleet
 * to deploy a new game server version update across the container fleet.
 *
 * A managed fleet's runtime environment depends on the Amazon Machine Image (AMI)
 * version it uses. When a new fleet is created, Amazon GameLift Servers assigns the
 * latest available AMI version to the fleet, and all compute instances in that fleet
 * are deployed with that version. To update the AMI version, you must create a new
 * fleet. As a best practice, we recommend replacing your managed fleets every 30
 * days to maintain a secure and up-to-date runtime environment for your hosted game
 * servers. For guidance, see
 * Security best practices for Amazon GameLift Servers.
 */
export const createContainerFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateContainerFleetInput,
    output: CreateContainerFleetOutput,
    errors: [
      ConflictException,
      InternalServiceException,
      InvalidRequestException,
      LimitExceededException,
      TaggingFailedException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Container
 *
 * Adds remote locations to an EC2 and begins populating the new locations with
 * instances. The new instances conform to the fleet's instance type, auto-scaling, and
 * other configuration settings.
 *
 * You can't add remote locations to a fleet that resides in an Amazon Web Services Region that
 * doesn't support multiple locations. Fleets created prior to March 2021 can't support
 * multiple locations.
 *
 * To add fleet locations, specify the fleet to be updated and provide a list of one or
 * more locations.
 *
 * If successful, this operation returns the list of added locations with their status
 * set to `NEW`. Amazon GameLift Servers initiates the process of starting an instance in each
 * added location. You can track the status of each new location by monitoring location
 * creation events using DescribeFleetEvents.
 *
 * **Learn more**
 *
 * Setting up
 * fleets
 *
 * Update fleet locations
 *
 * Amazon GameLift Servers service locations for managed hosting.
 */
export const createFleetLocations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateFleetLocationsInput,
    output: CreateFleetLocationsOutput,
    errors: [
      ConflictException,
      InternalServiceException,
      InvalidFleetStatusException,
      InvalidRequestException,
      LimitExceededException,
      NotFoundException,
      NotReadyException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Creates a placement queue that processes requests for new game sessions. A queue uses
 * FleetIQ algorithms to locate the best available placement locations for a new game
 * session, and then prompts the game server process to start a new game session.
 *
 * A game session queue is configured with a set of destinations (Amazon GameLift Servers fleets or
 * aliases) that determine where the queue can place new game sessions. These destinations
 * can span multiple Amazon Web Services Regions, can use different instance types, and can include both
 * Spot and On-Demand fleets. If the queue includes multi-location fleets, the queue can
 * place game sessions in any of a fleet's remote locations.
 *
 * You can configure a queue to determine how it selects the best available placement for
 * a new game session. Queues can prioritize placement decisions based on a combination of
 * location, hosting cost, and player latency. You can set up the queue to use the default
 * prioritization or provide alternate instructions using
 * `PriorityConfiguration`.
 *
 * **Request options**
 *
 * Use this operation to make these common types of requests.
 *
 * - Create a queue with the minimum required parameters.
 *
 * - `Name`
 *
 * - `Destinations` (This parameter isn't required, but a queue
 * can't make placements without at least one destination.)
 *
 * - Create a queue with placement notification. Queues that have high placement
 * activity must use a notification system, such as with Amazon Simple Notification Service (Amazon SNS) or Amazon CloudWatch.
 *
 * - Required parameters `Name` and
 * `Destinations`
 *
 * - `NotificationTarget`
 *
 * - Create a queue with custom prioritization settings. These custom settings
 * replace the default prioritization configuration for a queue.
 *
 * - Required parameters `Name` and
 * `Destinations`
 *
 * - `PriorityConfiguration`
 *
 * - Create a queue with special rules for processing player latency data.
 *
 * - Required parameters `Name` and
 * `Destinations`
 *
 * - `PlayerLatencyPolicies`
 *
 * **Results**
 *
 * If successful, this operation returns a new `GameSessionQueue` object with
 * an assigned queue ARN. Use the queue's name or ARN when submitting new game session
 * requests with StartGameSessionPlacement or StartMatchmaking.
 *
 * **Learn more**
 *
 * Design a game session queue
 *
 * Create a game session queue
 *
 * **Related actions**
 *
 * CreateGameSessionQueue
 * |
 * DescribeGameSessionQueues
 * |
 * UpdateGameSessionQueue
 * |
 * DeleteGameSessionQueue
 * |
 * All APIs by task
 */
export const createGameSessionQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateGameSessionQueueInput,
    output: CreateGameSessionQueueOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      LimitExceededException,
      NotFoundException,
      TaggingFailedException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Defines a new matchmaking configuration for use with FlexMatch. Whether your are using
 * FlexMatch with Amazon GameLift Servers hosting or as a standalone matchmaking service, the matchmaking
 * configuration sets out rules for matching players and forming teams. If you're also
 * using Amazon GameLift Servers hosting, it defines how to start game sessions for each match. Your
 * matchmaking system can use multiple configurations to handle different game scenarios.
 * All matchmaking requests identify the matchmaking configuration to use and provide
 * player attributes consistent with that configuration.
 *
 * To create a matchmaking configuration, you must provide the following: configuration
 * name and FlexMatch mode (with or without Amazon GameLift Servers hosting); a rule set that specifies how
 * to evaluate players and find acceptable matches; whether player acceptance is required;
 * and the maximum time allowed for a matchmaking attempt. When using FlexMatch with Amazon GameLift Servers
 * hosting, you also need to identify the game session queue to use when starting a game
 * session for the match.
 *
 * In addition, you must set up an Amazon Simple Notification Service topic to receive matchmaking notifications.
 * Provide the topic ARN in the matchmaking configuration.
 *
 * **Learn more**
 *
 * Design a FlexMatch
 * matchmaker
 *
 * Set up FlexMatch event
 * notification
 */
export const createMatchmakingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateMatchmakingConfigurationInput,
    output: CreateMatchmakingConfigurationOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      LimitExceededException,
      NotFoundException,
      TaggingFailedException,
      UnsupportedRegionException,
    ],
  }));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Creates a new rule set for FlexMatch matchmaking. A rule set describes the type of match
 * to create, such as the number and size of teams. It also sets the parameters for
 * acceptable player matches, such as minimum skill level or character type.
 *
 * To create a matchmaking rule set, provide unique rule set name and the rule set body
 * in JSON format. Rule sets must be defined in the same Region as the matchmaking
 * configuration they are used with.
 *
 * Since matchmaking rule sets cannot be edited, it is a good idea to check the rule set
 * syntax using ValidateMatchmakingRuleSet before creating a new rule set.
 *
 * **Learn more**
 *
 * - Build a rule
 * set
 *
 * - Design a
 * matchmaker
 *
 * - Matchmaking with
 * FlexMatch
 */
export const createMatchmakingRuleSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateMatchmakingRuleSetInput,
    output: CreateMatchmakingRuleSetOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      LimitExceededException,
      TaggingFailedException,
      UnsupportedRegionException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Reserves open slots in a game session for a group of players. New player sessions can
 * be created in any game session with an open slot that is in `ACTIVE` status
 * and has a player creation policy of `ACCEPT_ALL`. To add a single player to a
 * game session, use CreatePlayerSession
 *
 * To create player sessions, specify a game session ID and a list of player IDs.
 * Optionally, provide a set of player data for each player ID.
 *
 * If successful, a slot is reserved in the game session for each player, and new
 * `PlayerSession` objects are returned with player session IDs. Each player
 * references their player session ID when sending a connection request to the game
 * session, and the game server can use it to validate the player reservation with the
 * Amazon GameLift Servers service. Player sessions cannot be updated.
 *
 * The maximum number of players per game session is 200. It is not adjustable.
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const createPlayerSessions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePlayerSessionsInput,
    output: CreatePlayerSessionsOutput,
    errors: [
      GameSessionFullException,
      InternalServiceException,
      InvalidGameSessionStatusException,
      InvalidRequestException,
      NotFoundException,
      TerminalRoutingStrategyException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere
 *
 * Creates a new script record for your Amazon GameLift Servers Realtime script. Realtime scripts are JavaScript that
 * provide configuration settings and optional custom game logic for your game. The script
 * is deployed when you create a Amazon GameLift Servers Realtime fleet to host your game sessions. Script logic is
 * executed during an active game session.
 *
 * To create a new script record, specify a script name and provide the script file(s).
 * The script files and all dependencies must be zipped into a single file. You can pull
 * the zip file from either of these locations:
 *
 * - A locally available directory. Use the *ZipFile* parameter
 * for this option.
 *
 * - An Amazon Simple Storage Service (Amazon S3) bucket under your Amazon Web Services account. Use the
 * *StorageLocation* parameter for this option. You'll need
 * to have an Identity Access Management (IAM) role that allows the Amazon GameLift Servers service
 * to access your S3 bucket.
 *
 * If the call is successful, a new script record is created with a unique script ID. If
 * the script file is provided as a local file, the file is uploaded to an Amazon GameLift Servers-owned S3
 * bucket and the script record's storage location reflects this location. If the script
 * file is provided as an S3 bucket, Amazon GameLift Servers accesses the file at this storage location as
 * needed for deployment.
 *
 * **Learn more**
 *
 * Amazon GameLift Servers Amazon GameLift Servers Realtime
 *
 * Set Up a Role for Amazon GameLift Servers Access
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const createScript = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateScriptInput,
  output: CreateScriptOutput,
  errors: [
    ConflictException,
    InternalServiceException,
    InvalidRequestException,
    TaggingFailedException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2 (FleetIQ)
 *
 * Terminates a game server group
 * and permanently deletes the game server group record. You have several options for how
 * these resources are impacted when deleting the game server group. Depending on the type
 * of delete operation selected, this operation might affect these resources:
 *
 * - The game server group
 *
 * - The corresponding Auto Scaling group
 *
 * - All game servers that are currently running in the group
 *
 * To delete a game server group, identify the game server group to delete and specify
 * the type of delete operation to initiate. Game server groups can only be deleted if they
 * are in `ACTIVE` or `ERROR` status.
 *
 * If the delete request is successful, a series of operations are kicked off. The game
 * server group status is changed to `DELETE_SCHEDULED`, which prevents new game
 * servers from being registered and stops automatic scaling activity. Once all game
 * servers in the game server group are deregistered, Amazon GameLift Servers FleetIQ can begin deleting resources.
 * If any of the delete operations fail, the game server group is placed in
 * `ERROR` status.
 *
 * Amazon GameLift Servers FleetIQ emits delete events to Amazon CloudWatch.
 *
 * **Learn more**
 *
 * Amazon GameLift Servers FleetIQ
 * Guide
 */
export const deleteGameServerGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteGameServerGroupInput,
    output: DeleteGameServerGroupOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Retrieves properties for an alias. This operation returns all alias metadata and
 * settings. To get an alias's target fleet ID only, use `ResolveAlias`.
 *
 * To get alias properties, specify the alias ID. If successful, the requested alias
 * record is returned.
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const describeAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAliasInput,
  output: DescribeAliasOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Retrieves properties for a custom game build. To request a build resource, specify a
 * build ID. If successful, an object containing the build properties is returned.
 *
 * **Learn more**
 *
 * Upload a Custom
 * Server Build
 *
 * All APIs by task
 */
export const describeBuild = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBuildInput,
  output: DescribeBuildOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Retrieves the instance limits and current utilization for an Amazon Web Services Region or location.
 * Instance limits control the number of instances, per instance type, per location, that
 * your Amazon Web Services account can use. Learn more at Amazon EC2 Instance Types. The information
 * returned includes the maximum number of instances allowed and your account's current
 * usage across all fleets. This information can affect your ability to scale your Amazon GameLift Servers
 * fleets. You can request a limit increase for your account by using the **Service limits** page in the Amazon GameLift Servers console.
 *
 * Instance limits differ based on whether the instances are deployed in a fleet's home
 * Region or in a remote location. For remote locations, limits also differ based on the
 * combination of home Region and remote location. All requests must specify an Amazon Web Services
 * Region (either explicitly or as your default settings). To get the limit for a remote
 * location, you must also specify the location. For example, the following requests all
 * return different results:
 *
 * - Request specifies the Region `ap-northeast-1` with no location. The
 * result is limits and usage data on all instance types that are deployed in
 * `us-east-2`, by all of the fleets that reside in
 * `ap-northeast-1`.
 *
 * - Request specifies the Region `us-east-1` with location
 * `ca-central-1`. The result is limits and usage data on all
 * instance types that are deployed in `ca-central-1`, by all of the
 * fleets that reside in `us-east-2`. These limits do not affect fleets
 * in any other Regions that deploy instances to `ca-central-1`.
 *
 * - Request specifies the Region `eu-west-1` with location
 * `ca-central-1`. The result is limits and usage data on all
 * instance types that are deployed in `ca-central-1`, by all of the
 * fleets that reside in `eu-west-1`.
 *
 * This operation can be used in the following ways:
 *
 * - To get limit and usage data for all instance types that are deployed in an
 * Amazon Web Services Region by fleets that reside in the same Region: Specify the Region only.
 * Optionally, specify a single instance type to retrieve information for.
 *
 * - To get limit and usage data for all instance types that are deployed to a
 * remote location by fleets that reside in different Amazon Web Services Region: Provide both
 * the Amazon Web Services Region and the remote location. Optionally, specify a single instance
 * type to retrieve information for.
 *
 * If successful, an `EC2InstanceLimits` object is returned with limits and
 * usage data for each requested instance type.
 *
 * **Learn more**
 *
 * Setting up Amazon GameLift Servers fleets
 */
export const describeEC2InstanceLimits = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEC2InstanceLimitsInput,
    output: DescribeEC2InstanceLimitsOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Retrieves core fleet-wide properties for fleets in an Amazon Web Services Region. Properties include the computing
 * hardware and deployment configuration for instances in the fleet.
 *
 * You can use this operation in the following ways:
 *
 * - To get attributes for specific fleets, provide a list of fleet IDs or fleet ARNs.
 *
 * - To get attributes for all fleets, do not provide a fleet identifier.
 *
 * When requesting attributes for multiple fleets, use the pagination parameters to
 * retrieve results as a set of sequential pages.
 *
 * If successful, a `FleetAttributes` object is returned for each fleet
 * requested, unless the fleet identifier is not found.
 *
 * Some API operations limit the number of fleet IDs that allowed in one request. If
 * a request exceeds this limit, the request fails and the error message contains the
 * maximum allowed number.
 *
 * **Learn more**
 *
 * Setting up Amazon GameLift Servers
 * fleets
 */
export const describeFleetAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFleetAttributesInput,
    output: DescribeFleetAttributesOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Retrieves entries from a fleet's event log. Fleet events are initiated by changes in
 * status, such as during fleet creation and termination, changes in capacity, etc. If a
 * fleet has multiple locations, events are also initiated by changes to status and capacity in remote locations.
 *
 * You can specify a time range to limit the result set. Use the pagination parameters to
 * retrieve results as a set of sequential pages.
 *
 * If successful, a collection of event log entries matching the request are
 * returned.
 *
 * **Learn more**
 *
 * Setting up Amazon GameLift Servers
 * fleets
 */
export const describeFleetEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFleetEventsInput,
  output: DescribeFleetEventsOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Container
 *
 * Retrieves information on a fleet's remote locations, including life-cycle status and
 * any suspended fleet activity.
 *
 * This operation can be used in the following ways:
 *
 * - To get data for specific locations, provide a fleet identifier and a list of
 * locations. Location data is returned in the order that it is requested.
 *
 * - To get data for all locations, provide a fleet identifier only. Location data
 * is returned in no particular order.
 *
 * When requesting attributes for multiple locations, use the pagination parameters to
 * retrieve results as a set of sequential pages.
 *
 * If successful, a `LocationAttributes` object is returned for each requested
 * location. If the fleet does not have a requested location, no information is returned.
 * This operation does not return the home Region. To get information on a fleet's home
 * Region, call `DescribeFleetAttributes`.
 *
 * **Learn more**
 *
 * Setting
 * up Amazon GameLift Servers fleets
 *
 * Amazon GameLift Servers service locations for managed hosting
 */
export const describeFleetLocationAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeFleetLocationAttributesInput,
    output: DescribeFleetLocationAttributesOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Retrieves current usage data for a fleet location. Utilization data provides a
 * snapshot of current game hosting activity at the requested location. Use this operation
 * to retrieve utilization information for a fleet's remote location or home Region (you
 * can also retrieve home Region utilization by calling
 * `DescribeFleetUtilization`).
 *
 * To retrieve utilization data, identify a fleet and location.
 *
 * If successful, a `FleetUtilization` object is returned for the requested
 * fleet location.
 *
 * **Learn more**
 *
 * Setting up Amazon GameLift Servers
 * fleets
 *
 * Amazon GameLift Servers service locations for managed hosting
 *
 * GameLift metrics for fleets
 */
export const describeFleetLocationUtilization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeFleetLocationUtilizationInput,
    output: DescribeFleetLocationUtilizationOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }));
/**
 * **This API works with the following fleet types:** EC2 (FleetIQ)
 *
 * Retrieves information for a
 * registered game server. Information includes game server status, health check info, and
 * the instance that the game server is running on.
 *
 * To retrieve game server information, specify the game server ID. If successful, the
 * requested game server object is returned.
 *
 * **Learn more**
 *
 * Amazon GameLift Servers FleetIQ
 * Guide
 */
export const describeGameServer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeGameServerInput,
  output: DescribeGameServerOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2 (FleetIQ)
 *
 * Retrieves status
 * information about the Amazon EC2 instances associated with a Amazon GameLift Servers FleetIQ game server group.
 * Use this operation to detect when instances are active or not available to host new game
 * servers.
 *
 * To request status for all instances in the game server group, provide a game server
 * group ID only. To request status for specific instances, provide the game server group
 * ID and one or more instance IDs. Use the pagination parameters to retrieve results in
 * sequential segments. If successful, a collection of `GameServerInstance`
 * objects is returned.
 *
 * This operation is not designed to be called with every game server claim request; this
 * practice can cause you to exceed your API limit, which results in errors. Instead, as a
 * best practice, cache the results and refresh your cache no more than once every 10
 * seconds.
 *
 * **Learn more**
 *
 * Amazon GameLift Servers FleetIQ
 * Guide
 */
export const describeGameServerInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeGameServerInstancesInput,
    output: DescribeGameServerInstancesOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Retrieves additional game session properties, including the game session protection
 * policy in force, a set of one or more game sessions in a specific fleet location. You
 * can optionally filter the results by current game session status.
 *
 * This operation can be used in the following ways:
 *
 * - To retrieve details for all game sessions that are currently running on all
 * locations in a fleet, provide a fleet or alias ID, with an optional status
 * filter. This approach returns details from the fleet's home Region and all
 * remote locations.
 *
 * - To retrieve details for all game sessions that are currently running on a
 * specific fleet location, provide a fleet or alias ID and a location name, with
 * optional status filter. The location can be the fleet's home Region or any
 * remote location.
 *
 * - To retrieve details for a specific game session, provide the game session ID.
 * This approach looks for the game session ID in all fleets that reside in the
 * Amazon Web Services Region defined in the request.
 *
 * Use the pagination parameters to retrieve results as a set of sequential pages.
 *
 * If successful, a `GameSessionDetail` object is returned for each game
 * session that matches the request.
 *
 * **Learn more**
 *
 * Find a game session
 *
 * All APIs by task
 */
export const describeGameSessionDetails = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeGameSessionDetailsInput,
    output: DescribeGameSessionDetailsOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      TerminalRoutingStrategyException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Retrieves the properties for one or more game session queues. When requesting multiple
 * queues, use the pagination parameters to retrieve results as a set of sequential pages.
 * When specifying a list of queues, objects are returned only for queues that currently
 * exist in the Region.
 *
 * **Learn more**
 *
 * View Your Queues
 */
export const describeGameSessionQueues = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeGameSessionQueuesInput,
    output: DescribeGameSessionQueuesOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Retrieves a set of one or more game sessions in a specific fleet location. You can
 * optionally filter the results by current game session status.
 *
 * This operation can be used in the following ways:
 *
 * - To retrieve all game sessions that are currently running on all locations in a
 * fleet, provide a fleet or alias ID, with an optional status filter. This
 * approach returns all game sessions in the fleet's home Region and all remote
 * locations.
 *
 * - To retrieve all game sessions that are currently running on a specific fleet
 * location, provide a fleet or alias ID and a location name, with optional status
 * filter. The location can be the fleet's home Region or any remote
 * location.
 *
 * - To retrieve a specific game session, provide the game session ID. This
 * approach looks for the game session ID in all fleets that reside in the Amazon Web Services
 * Region defined in the request.
 *
 * Use the pagination parameters to retrieve results as a set of sequential pages.
 *
 * If successful, a `GameSession` object is returned for each game session
 * that matches the request.
 *
 * This operation is not designed to be continually called to track game session status.
 * This practice can cause you to exceed your API limit, which results in errors. Instead,
 * you must configure an Amazon Simple Notification Service (SNS) topic to receive notifications from FlexMatch or
 * queues. Continuously polling with `DescribeGameSessions` should only be used
 * for games in development with low game session usage.
 *
 * *Available in Amazon GameLift Servers Local.*
 *
 * **Learn more**
 *
 * Find a game session
 *
 * All APIs by task
 */
export const describeGameSessions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeGameSessionsInput,
    output: DescribeGameSessionsOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      TerminalRoutingStrategyException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2
 *
 * Retrieves information about the EC2 instances in an Amazon GameLift Servers managed fleet, including
 * instance ID, connection data, and status. You can use this operation with a
 * multi-location fleet to get location-specific instance information. As an alternative,
 * use the operations https://docs.aws.amazon.com/gamelift/latest/apireference/API_ListCompute and https://docs.aws.amazon.com/gamelift/latest/apireference/API_DescribeCompute
 * to retrieve information for compute resources, including EC2 and Anywhere fleets.
 *
 * You can call this operation in the following ways:
 *
 * - To get information on all instances in a fleet's home Region, specify the
 * fleet ID.
 *
 * - To get information on all instances in a fleet's remote location, specify the
 * fleet ID and location name.
 *
 * - To get information on a specific instance in a fleet, specify the fleet ID and
 * instance ID.
 *
 * Use the pagination parameters to retrieve results as a set of sequential pages.
 *
 * If successful, this operation returns `Instance` objects for each requested
 * instance, listed in no particular order. If you call this operation for an Anywhere
 * fleet, you receive an InvalidRequestException.
 *
 * **Learn more**
 *
 * Remotely connect to
 * fleet instances
 *
 * Debug fleet
 * issues
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const describeInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInstancesInput,
  output: DescribeInstancesOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Retrieves all scaling policies applied to a fleet.
 *
 * To get a fleet's scaling policies, specify the fleet ID. You can filter this request
 * by policy status, such as to retrieve only active scaling policies. Use the pagination
 * parameters to retrieve results as a set of sequential pages. If successful, set of
 * `ScalingPolicy` objects is returned for the fleet.
 *
 * A fleet may have all of its scaling policies suspended. This operation does not affect
 * the status of the scaling policies, which remains ACTIVE.
 */
export const describeScalingPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeScalingPoliciesInput,
    output: DescribeScalingPoliciesOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Container
 *
 * Requests authorization to remotely connect to a hosting resource in a Amazon GameLift Servers managed
 * fleet. This operation is not used with Amazon GameLift Servers Anywhere fleets.
 *
 * **Request options**
 *
 * Provide the fleet ID and compute name. The compute name varies depending on the type
 * of fleet.
 *
 * - For a compute in a managed EC2 fleet, provide an instance ID. Each instance in
 * the fleet is a compute.
 *
 * - For a compute in a managed container fleet, provide a compute name. In a
 * container fleet, each game server container group on a fleet instance is
 * assigned a compute name.
 *
 * **Results**
 *
 * If successful, this operation returns a set of temporary Amazon Web Services credentials, including
 * a two-part access key and a session token.
 *
 * - With a managed EC2 fleet (where compute type is `EC2`), use these
 * credentials with Amazon EC2 Systems Manager (SSM) to start a session with the compute. For more
 * details, see Starting a session (CLI) in the Amazon EC2 Systems Manager User
 * Guide.
 */
export const getComputeAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetComputeAccessInput,
  output: GetComputeAccessOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Creates or updates a scaling policy for a fleet. Scaling policies are used to
 * automatically scale a fleet's hosting capacity to meet player demand. An active scaling
 * policy instructs Amazon GameLift Servers to track a fleet metric and automatically change the fleet's
 * capacity when a certain threshold is reached. There are two types of scaling policies:
 * target-based and rule-based. Use a target-based policy to quickly and efficiently manage
 * fleet scaling; this option is the most commonly used. Use rule-based policies when you
 * need to exert fine-grained control over auto-scaling.
 *
 * Fleets can have multiple scaling policies of each type in force at the same time; you
 * can have one target-based policy, one or multiple rule-based scaling policies, or both.
 * We recommend caution, however, because multiple auto-scaling policies can have
 * unintended consequences.
 *
 * Learn more about how to work with auto-scaling in Set Up Fleet Automatic
 * Scaling.
 *
 * **Target-based policy**
 *
 * A target-based policy tracks a single metric: PercentAvailableGameSessions. This
 * metric tells us how much of a fleet's hosting capacity is ready to host game sessions
 * but is not currently in use. This is the fleet's buffer; it measures the additional
 * player demand that the fleet could handle at current capacity. With a target-based
 * policy, you set your ideal buffer size and leave it to Amazon GameLift Servers to take whatever action is
 * needed to maintain that target.
 *
 * For example, you might choose to maintain a 10% buffer for a fleet that has the
 * capacity to host 100 simultaneous game sessions. This policy tells Amazon GameLift Servers to take action
 * whenever the fleet's available capacity falls below or rises above 10 game sessions.
 * Amazon GameLift Servers will start new instances or stop unused instances in order to return to the 10%
 * buffer.
 *
 * To create or update a target-based policy, specify a fleet ID and name, and set the
 * policy type to "TargetBased". Specify the metric to track (PercentAvailableGameSessions)
 * and reference a `TargetConfiguration` object with your desired buffer value.
 * Exclude all other parameters. On a successful request, the policy name is returned. The
 * scaling policy is automatically in force as soon as it's successfully created. If the
 * fleet's auto-scaling actions are temporarily suspended, the new policy will be in force
 * once the fleet actions are restarted.
 *
 * **Rule-based policy**
 *
 * A rule-based policy tracks specified fleet metric, sets a threshold value, and
 * specifies the type of action to initiate when triggered. With a rule-based policy, you
 * can select from several available fleet metrics. Each policy specifies whether to scale
 * up or scale down (and by how much), so you need one policy for each type of action.
 *
 * For example, a policy may make the following statement: "If the percentage of idle
 * instances is greater than 20% for more than 15 minutes, then reduce the fleet capacity
 * by 10%."
 *
 * A policy's rule statement has the following structure:
 *
 * If `[MetricName]` is `[ComparisonOperator]`
 * `[Threshold]` for `[EvaluationPeriods]` minutes, then
 * `[ScalingAdjustmentType]` to/by `[ScalingAdjustment]`.
 *
 * To implement the example, the rule statement would look like this:
 *
 * If `[PercentIdleInstances]` is `[GreaterThanThreshold]`
 * `[20]` for `[15]` minutes, then
 * `[PercentChangeInCapacity]` to/by `[10]`.
 *
 * To create or update a scaling policy, specify a unique combination of name and fleet
 * ID, and set the policy type to "RuleBased". Specify the parameter values for a policy
 * rule statement. On a successful request, the policy name is returned. Scaling policies
 * are automatically in force as soon as they're successfully created. If the fleet's
 * auto-scaling actions are temporarily suspended, the new policy will be in force once the
 * fleet actions are restarted.
 */
export const putScalingPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutScalingPolicyInput,
  output: PutScalingPolicyOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** Anywhere, Container
 *
 * Registers a compute resource in an Amazon GameLift Servers Anywhere fleet.
 *
 * For an Anywhere fleet that's running the Amazon GameLift Servers Agent, the Agent
 * handles all compute registry tasks for you. For an Anywhere fleet that doesn't use the
 * Agent, call this operation to register fleet computes.
 *
 * To register a compute, give the compute a name (must be unique within the
 * fleet) and specify the compute resource's DNS name or IP address. Provide a
 * fleet ID and a fleet location to associate with the compute being registered. You can
 * optionally include the path to a TLS certificate on the compute resource.
 *
 * If successful, this operation returns compute details, including an Amazon GameLift Servers SDK
 * endpoint or Agent endpoint. Game server processes running on the compute can use this
 * endpoint to communicate with the Amazon GameLift Servers service. Each server process includes the SDK
 * endpoint in its call to the Amazon GameLift Servers server SDK action `InitSDK()`.
 *
 * To view compute details, call DescribeCompute with the compute name.
 *
 * **Learn more**
 *
 * - Create an
 * Anywhere fleet
 *
 * - Test your
 * integration
 *
 * - Server SDK
 * reference guides (for version 5.x)
 */
export const registerCompute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterComputeInput,
  output: RegisterComputeOutput,
  errors: [
    ConflictException,
    InternalServiceException,
    InvalidRequestException,
    LimitExceededException,
    NotReadyException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2 (FleetIQ)
 *
 * Creates a new game server
 * resource and notifies Amazon GameLift Servers FleetIQ that the game server is ready to host gameplay and players.
 * This operation is called by a game server process that is running on an instance in a
 * game server group. Registering game servers enables Amazon GameLift Servers FleetIQ to track available game
 * servers and enables game clients and services to claim a game server for a new game
 * session.
 *
 * To register a game server, identify the game server group and instance where the game
 * server is running, and provide a unique identifier for the game server. You can also
 * include connection and game server data.
 *
 * Once a game server is successfully registered, it is put in status
 * `AVAILABLE`. A request to register a game server may fail if the instance
 * it is running on is in the process of shutting down as part of instance balancing or
 * scale-down activity.
 *
 * **Learn more**
 *
 * Amazon GameLift Servers FleetIQ
 * Guide
 */
export const registerGameServer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterGameServerInput,
  output: RegisterGameServerOutput,
  errors: [
    ConflictException,
    InternalServiceException,
    InvalidRequestException,
    LimitExceededException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Attempts to retrieve a fleet ID that is associated with an alias. Specify a unique
 * alias identifier.
 *
 * If the alias has a `SIMPLE` routing strategy, Amazon GameLift Servers returns a fleet ID.
 * If the alias has a `TERMINAL` routing strategy, the result is a
 * `TerminalRoutingStrategyException`.
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const resolveAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResolveAliasInput,
  output: ResolveAliasOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    TerminalRoutingStrategyException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Makes a request to start a new game session using a game session queue. When
 * processing a placement request, Amazon GameLift Servers looks for the best possible available resource to
 * host the game session, based on how the queue is configured to prioritize factors such
 * as resource cost, latency, and location. After selecting an available resource, Amazon GameLift Servers
 * prompts the resource to start a game session. A placement request can include a list of
 * players to create a set of player sessions. The request can also include information to
 * pass to the new game session, such as to specify a game map or other options.
 *
 * **Request options**
 *
 * Use this operation to make the following types of requests.
 *
 * - Request a placement using the queue's default prioritization process (see the
 * default prioritization described in PriorityConfiguration). Include these required parameters:
 *
 * - `GameSessionQueueName`
 *
 * - `MaximumPlayerSessionCount`
 *
 * - `PlacementID`
 *
 * - Request a placement and prioritize based on latency. Include these
 * parameters:
 *
 * - Required parameters `GameSessionQueueName`,
 * `MaximumPlayerSessionCount`,
 * `PlacementID`.
 *
 * - `PlayerLatencies`. Include a set of latency values for
 * destinations in the queue. When a request includes latency data, Amazon GameLift Servers
 * automatically reorder the queue's locations priority list based on
 * lowest available latency values. If a request includes latency data for
 * multiple players, Amazon GameLift Servers calculates each location's average latency for
 * all players and reorders to find the lowest latency across all players.
 *
 * - Don't include `PriorityConfigurationOverride`.
 *
 * - Prioritize based on a custom list of locations. If you're using a
 * queue that's configured to prioritize location first (see PriorityConfiguration for game session queues), you can
 * optionally use the *PriorityConfigurationOverride*
 * parameter to substitute a different location priority list for this
 * placement request. Amazon GameLift Servers searches each location on the priority
 * override list to find an available hosting resource for the new game
 * session. Specify a fallback strategy to use in the event that Amazon GameLift Servers
 * fails to place the game session in any of the locations on the override
 * list.
 *
 * - Request a placement and prioritized based on a custom list of locations.
 *
 * - You can request new player sessions for a group of players. Include the
 * *DesiredPlayerSessions* parameter and include at minimum
 * a unique player ID for each. You can also include player-specific data to pass
 * to the new game session.
 *
 * **Result**
 *
 * If successful, this operation generates a new game session placement request and adds
 * it to the game session queue for processing. You can track the status of individual
 * placement requests by calling DescribeGameSessionPlacement or by monitoring queue notifications. When the
 * request status is `FULFILLED`, a new game session has started and the
 * placement request is updated with connection information for the game session (IP
 * address and port). If the request included player session data, Amazon GameLift Servers creates a player
 * session for each player ID in the request.
 *
 * The request results in a `InvalidRequestException` in the following
 * situations:
 *
 * - If the request includes both *PlayerLatencies* and
 * *PriorityConfigurationOverride* parameters.
 *
 * - If the request includes the *PriorityConfigurationOverride*
 * parameter and specifies a queue that doesn't prioritize locations.
 *
 * Amazon GameLift Servers continues to retry each placement request until it reaches the queue's timeout
 * setting. If a request times out, you can resubmit the request to the same queue or try a
 * different queue.
 */
export const startGameSessionPlacement = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartGameSessionPlacementInput,
    output: StartGameSessionPlacementOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Ends a game session that's currently in progress. Use this action to terminate any
 * game session that isn't in `ERROR` status. Terminating a game session is the
 * most efficient way to free up a server process when it's hosting a game session that's
 * in a bad state or not ending properly. You can use this action to terminate a game
 * session that's being hosted on any type of Amazon GameLift Servers fleet compute, including computes for
 * managed EC2, managed container, and Anywhere fleets. The game server must be integrated
 * with Amazon GameLift Servers server SDK 5.x or greater.
 *
 * **Request options**
 *
 * Request termination for a single game session. Provide the game session ID and the
 * termination mode. There are two potential methods for terminating a game session:
 *
 * - Initiate a graceful termination using the normal game session shutdown
 * sequence. With this mode, the Amazon GameLift Servers service prompts the server process that's
 * hosting the game session by calling the server SDK callback method
 * `OnProcessTerminate()`. The callback implementation is part of
 * the custom game server code. It might involve a variety of actions to gracefully
 * end a game session, such as notifying players, before stopping the server
 * process.
 *
 * - Force an immediate game session termination. With this mode, the Amazon GameLift Servers
 * service takes action to stop the server process, which ends the game session
 * without the normal game session shutdown sequence.
 *
 * **Results**
 *
 * If successful, game session termination is initiated. During this activity, the game
 * session status is changed to `TERMINATING`. When completed, the server
 * process that was hosting the game session has been stopped and replaced with a new
 * server process that's ready to host a new game session. The old game session's status is
 * changed to `TERMINATED` with a status reason that indicates the termination
 * method used.
 *
 * **Learn more**
 *
 * Add Amazon GameLift Servers to your game server
 *
 * Amazon GameLift Servers server SDK 5 reference guide for `OnProcessTerminate()`
 * (C++)
 * (C#)
 * (Unreal)
 * (Go)
 */
export const terminateGameSession = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: TerminateGameSessionInput,
    output: TerminateGameSessionOutput,
    errors: [
      InternalServiceException,
      InvalidGameSessionStatusException,
      InvalidRequestException,
      NotFoundException,
      NotReadyException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** Container
 *
 * Updates the properties of a managed container fleet. Depending on the properties being
 * updated, this operation might initiate a fleet deployment. You can track deployments for
 * a fleet using https://docs.aws.amazon.com/gamelift/latest/apireference/API_DescribeFleetDeployment.html.
 *
 * A managed fleet's runtime environment, which depends on the fleet's
 * Amazon Machine Image {AMI} version, can't be updated. You must create a new
 * fleet. As a best practice, we recommend replacing your managed fleets every 30
 * days to maintain a secure and up-to-date runtime environment for your hosted game
 * servers. For guidance, see
 * Security best practices for Amazon GameLift Servers.
 *
 * **Request options**
 *
 * As with CreateContainerFleet, many fleet properties use common defaults or are
 * calculated based on the fleet's container group definitions.
 *
 * - Update fleet properties that result in a fleet deployment. Include only those
 * properties that you want to change. Specify deployment configuration
 * settings.
 *
 * - Update fleet properties that don't result in a fleet deployment. Include only
 * those properties that you want to change.
 *
 * Changes to the following properties initiate a fleet deployment:
 *
 * - `GameServerContainerGroupDefinition`
 *
 * - `PerInstanceContainerGroupDefinition`
 *
 * - `GameServerContainerGroupsPerInstance`
 *
 * - `InstanceInboundPermissions`
 *
 * - `InstanceConnectionPortRange`
 *
 * - `LogConfiguration`
 *
 * **Results**
 *
 * If successful, this operation updates the container fleet resource, and might initiate
 * a new deployment of fleet resources using the deployment configuration provided. A
 * deployment replaces existing fleet instances with new instances that are deployed with
 * the updated fleet properties. The fleet is placed in `UPDATING` status until
 * the deployment is complete, then return to `ACTIVE`.
 *
 * You can have only one update deployment active at a time for a fleet. If a second
 * update request initiates a deployment while another deployment is in progress, the first
 * deployment is cancelled.
 */
export const updateContainerFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateContainerFleetInput,
    output: UpdateContainerFleetOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      LimitExceededException,
      NotFoundException,
      NotReadyException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Updates the mutable properties of a game session.
 *
 * To update a game session, specify the game session ID and the values you want to
 * change.
 *
 * If successful, the updated `GameSession` object is returned.
 *
 * All APIs by task
 */
export const updateGameSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGameSessionInput,
  output: UpdateGameSessionOutput,
  errors: [
    ConflictException,
    InternalServiceException,
    InvalidGameSessionStatusException,
    InvalidRequestException,
    NotFoundException,
    NotReadyException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2 (FleetIQ)
 *
 * Locates an available game server and
 * temporarily reserves it to host gameplay and players. This operation is called from a
 * game client or client service (such as a matchmaker) to request hosting resources for a
 * new game session. In response, Amazon GameLift Servers FleetIQ locates an available game server, places it in
 * `CLAIMED` status for 60 seconds, and returns connection information that
 * players can use to connect to the game server.
 *
 * To claim a game server, identify a game server group. You can also specify a game
 * server ID, although this approach bypasses Amazon GameLift Servers FleetIQ placement optimization. Optionally,
 * include game data to pass to the game server at the start of a game session, such as a
 * game map or player information. Add filter options to further restrict how a
 * game server is chosen, such as only allowing game servers on `ACTIVE` instances
 * to be claimed.
 *
 * When a game server is successfully claimed, connection information is returned. A
 * claimed game server's utilization status remains `AVAILABLE` while the claim
 * status is set to `CLAIMED` for up to 60 seconds. This time period gives the
 * game server time to update its status to `UTILIZED` after players join. If
 * the game server's status is not updated within 60 seconds, the game server reverts to
 * unclaimed status and is available to be claimed by another request. The claim time
 * period is a fixed value and is not configurable.
 *
 * If you try to claim a specific game server, this request will fail in the following
 * cases:
 *
 * - If the game server utilization status is `UTILIZED`.
 *
 * - If the game server claim status is `CLAIMED`.
 *
 * - If the game server is running on an instance in `DRAINING` status and
 * the provided filter option does not allow placing on `DRAINING` instances.
 *
 * **Learn more**
 *
 * Amazon GameLift Servers FleetIQ
 * Guide
 */
export const claimGameServer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ClaimGameServerInput,
  output: ClaimGameServerOutput,
  errors: [
    ConflictException,
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    OutOfCapacityException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Creates a fleet of compute resources to host your game servers. Use this operation to
 * set up a fleet for the following compute types:
 *
 * **Managed EC2 fleet**
 *
 * An EC2 fleet is a set of Amazon Elastic Compute Cloud (Amazon EC2) instances. Your game server build is
 * deployed to each fleet instance. Amazon GameLift Servers manages the fleet's instances and controls the
 * lifecycle of game server processes, which host game sessions for players. EC2 fleets can
 * have instances in multiple locations. Each instance in the fleet is designated a
 * `Compute`.
 *
 * To create an EC2 fleet, provide these required parameters:
 *
 * - Either `BuildId` or `ScriptId`
 *
 * - `ComputeType` set to `EC2` (the default value)
 *
 * - `EC2InboundPermissions`
 *
 * - `EC2InstanceType`
 *
 * - `FleetType`
 *
 * - `Name`
 *
 * - `RuntimeConfiguration` with at least one `ServerProcesses`
 * configuration
 *
 * If successful, this operation creates a new fleet resource and places it in
 * `NEW` status while Amazon GameLift Servers initiates the fleet creation workflow. To debug your fleet, fetch logs, view performance
 * metrics or other actions on the fleet, create a development fleet with port 22/3389
 * open. As a best practice, we recommend opening ports for remote access only when you
 * need them and closing them when you're finished.
 *
 * When the fleet status is ACTIVE, you can adjust capacity settings and turn autoscaling
 * on/off for each location.
 *
 * A managed fleet's runtime environment depends on the Amazon Machine Image (AMI)
 * version it uses. When a new fleet is created, Amazon GameLift Servers assigns the
 * latest available AMI version to the fleet, and all compute instances in that fleet
 * are deployed with that version. To update the AMI version, you must create a new
 * fleet. As a best practice, we recommend replacing your managed fleets every 30
 * days to maintain a secure and up-to-date runtime environment for your hosted game
 * servers. For guidance, see
 * Security best practices for Amazon GameLift Servers.
 *
 * **Anywhere fleet**
 *
 * An Anywhere fleet represents compute resources that are not owned or managed by
 * Amazon GameLift Servers. You might create an Anywhere fleet with your local machine for testing, or use
 * one to host game servers with on-premises hardware or other game hosting solutions.
 *
 * To create an Anywhere fleet, provide these required parameters:
 *
 * - `ComputeType` set to `ANYWHERE`
 *
 * - `Locations` specifying a custom location
 *
 * - `Name`
 *
 * If successful, this operation creates a new fleet resource and places it in
 * `ACTIVE` status. You can register computes with a fleet in
 * `ACTIVE` status.
 *
 * **Learn more**
 *
 * Setting up
 * fleets
 *
 * Debug fleet creation issues
 *
 * Multi-location fleets
 */
export const createFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFleetInput,
  output: CreateFleetOutput,
  errors: [
    ConflictException,
    InternalServiceException,
    InvalidRequestException,
    LimitExceededException,
    NotFoundException,
    NotReadyException,
    TaggingFailedException,
    UnauthorizedException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2 (FleetIQ)
 *
 * Creates a Amazon GameLift Servers FleetIQ game server
 * group for managing game hosting on a collection of Amazon Elastic Compute Cloud instances for game hosting.
 * This operation creates the game server group, creates an Auto Scaling group in your
 * Amazon Web Services account, and establishes a link between the two groups. You can view the status of
 * your game server groups in the Amazon GameLift Servers console. Game server group metrics and events are
 * emitted to Amazon CloudWatch.
 *
 * Before creating a new game server group, you must have the following:
 *
 * - An Amazon Elastic Compute Cloud launch template that specifies how to launch Amazon Elastic Compute Cloud instances
 * with your game server build. For more information, see Launching an Instance from a Launch Template in the
 * *Amazon Elastic Compute Cloud User Guide*.
 *
 * - An IAM role that extends limited access to your Amazon Web Services account to allow Amazon GameLift Servers FleetIQ
 * to create and interact with the Auto Scaling group. For more information, see
 * Create IAM
 * roles for cross-service interaction in the Amazon GameLift Servers FleetIQ Developer
 * Guide.
 *
 * To create a new game server group, specify a unique group name, IAM role and Amazon Elastic Compute Cloud
 * launch template, and provide a list of instance types that can be used in the group. You
 * must also set initial maximum and minimum limits on the group's instance count. You can
 * optionally set an Auto Scaling policy with target tracking based on a Amazon GameLift Servers FleetIQ
 * metric.
 *
 * Once the game server group and corresponding Auto Scaling group are created, you have
 * full access to change the Auto Scaling group's configuration as needed. Several
 * properties that are set when creating a game server group, including maximum/minimum
 * size and auto-scaling policy settings, must be updated directly in the Auto Scaling
 * group. Keep in mind that some Auto Scaling group properties are periodically updated by
 * Amazon GameLift Servers FleetIQ as part of its balancing activities to optimize for availability and cost.
 *
 * **Learn more**
 *
 * Amazon GameLift Servers FleetIQ
 * Guide
 */
export const createGameServerGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateGameServerGroupInput,
    output: CreateGameServerGroupOutput,
    errors: [
      ConflictException,
      InternalServiceException,
      InvalidRequestException,
      LimitExceededException,
      UnauthorizedException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Reserves an open player slot in a game session for a player. New player sessions can
 * be created in any game session with an open slot that is in `ACTIVE` status
 * and has a player creation policy of `ACCEPT_ALL`. You can add a group of
 * players to a game session with CreatePlayerSessions .
 *
 * To create a player session, specify a game session ID, player ID, and optionally a set
 * of player data.
 *
 * If successful, a slot is reserved in the game session for the player and a new
 * `PlayerSessions` object is returned with a player session ID. The player
 * references the player session ID when sending a connection request to the game session,
 * and the game server can use it to validate the player reservation with the Amazon GameLift Servers
 * service. Player sessions cannot be updated.
 *
 * The maximum number of players per game session is 200. It is not adjustable.
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const createPlayerSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePlayerSessionInput,
  output: CreatePlayerSessionOutput,
  errors: [
    GameSessionFullException,
    InternalServiceException,
    InvalidGameSessionStatusException,
    InvalidRequestException,
    NotFoundException,
    TerminalRoutingStrategyException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Retrieves properties for a specific compute resource in an Amazon GameLift Servers fleet. You can list
 * all computes in a fleet by calling ListCompute.
 *
 * **Request options**
 *
 * Provide the fleet ID and compute name. The compute name varies depending on the type
 * of fleet.
 *
 * - For a compute in a managed EC2 fleet, provide an instance ID. Each instance in
 * the fleet is a compute.
 *
 * - For a compute in a managed container fleet, provide a compute name. In a
 * container fleet, each game server container group on a fleet instance is
 * assigned a compute name.
 *
 * - For a compute in an Anywhere fleet, provide a registered compute name.
 * Anywhere fleet computes are created when you register a hosting resource with
 * the fleet.
 *
 * **Results**
 *
 * If successful, this operation returns details for the requested compute resource.
 * Depending on the fleet's compute type, the result includes the following information:
 *
 * - For a managed EC2 fleet, this operation returns information about the EC2
 * instance.
 *
 * - For an Anywhere fleet, this operation returns information about the registered
 * compute.
 */
export const describeCompute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeComputeInput,
  output: DescribeComputeOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** Container
 *
 * Retrieves the properties for a container fleet. When requesting attributes for
 * multiple fleets, use the pagination parameters to retrieve results as a set of
 * sequential pages.
 *
 * **Request options**
 *
 * - Get container fleet properties for a single fleet. Provide either the fleet ID or ARN value.
 *
 * **Results**
 *
 * If successful, a `ContainerFleet` object is returned. This object includes
 * the fleet properties, including information about the most recent deployment.
 *
 * Some API operations limit the number of fleet IDs that allowed in one request. If
 * a request exceeds this limit, the request fails and the error message contains the
 * maximum allowed number.
 */
export const describeContainerFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeContainerFleetInput,
    output: DescribeContainerFleetOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** Container
 *
 * Retrieves the properties of a container group definition, including all container
 * definitions in the group.
 *
 * **Request options:**
 *
 * - Retrieve the latest version of a container group definition. Specify the container
 * group definition name only, or use an ARN value without a version number.
 *
 * - Retrieve a particular version. Specify the container group definition name and a
 * version number, or use an ARN value that includes the version number.
 *
 * **Results:**
 *
 * If successful, this operation returns the complete properties of a container group
 * definition version.
 *
 * **Learn more**
 *
 * - Manage a container group definition
 */
export const describeContainerGroupDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeContainerGroupDefinitionInput,
    output: DescribeContainerGroupDefinitionOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }));
/**
 * **This API works with the following fleet types:** EC2, Container
 *
 * Retrieves the resource capacity settings for one or more fleets. For a container
 * fleet, this operation also returns counts for game server container groups.
 *
 * With multi-location fleets, this operation retrieves data for the fleet's home Region
 * only. To retrieve capacity for remote locations, see
 * https://docs.aws.amazon.com/gamelift/latest/apireference/API_DescribeFleetLocationCapacity.html.
 *
 * This operation can be used in the following ways:
 *
 * - To get capacity data for one or more specific fleets, provide a list of fleet
 * IDs or fleet ARNs.
 *
 * - To get capacity data for all fleets, do not provide a fleet identifier.
 *
 * When requesting multiple fleets, use the pagination parameters to retrieve results as
 * a set of sequential pages.
 *
 * If successful, a `FleetCapacity` object is returned for each requested
 * fleet ID. Each `FleetCapacity` object includes a `Location`
 * property, which is set to the fleet's home Region. Capacity values are returned only for
 * fleets that currently exist.
 *
 * Some API operations may limit the number of fleet IDs that are allowed in one
 * request. If a request exceeds this limit, the request fails and the error message
 * includes the maximum allowed.
 *
 * **Learn more**
 *
 * Setting up Amazon GameLift Servers
 * fleets
 *
 * GameLift metrics for fleets
 */
export const describeFleetCapacity = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFleetCapacityInput,
    output: DescribeFleetCapacityOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** Container
 *
 * Retrieves information about a managed container fleet deployment.
 *
 * **Request options**
 *
 * - Get information about the latest deployment for a specific fleet. Provide the
 * fleet ID or ARN.
 *
 * - Get information about a specific deployment. Provide the fleet ID or ARN and
 * the deployment ID.
 *
 * **Results**
 *
 * If successful, a `FleetDeployment` object is returned.
 */
export const describeFleetDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFleetDeploymentInput,
    output: DescribeFleetDeploymentOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }),
);
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Retrieves information, including current status, about a game session placement
 * request.
 *
 * To get game session placement details, specify the placement ID.
 *
 * This operation is not designed to be continually called to track game session status.
 * This practice can cause you to exceed your API limit, which results in errors. Instead,
 * you must configure an Amazon Simple Notification Service (SNS) topic to receive notifications from FlexMatch or
 * queues. Continuously polling with `DescribeGameSessionPlacement` should only
 * be used for games in development with low game session usage.
 */
export const describeGameSessionPlacement =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeGameSessionPlacementInput,
    output: DescribeGameSessionPlacementOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Retrieves information on VPC peering connections. Use this operation to get peering
 * information for all fleets or for one specific fleet ID.
 *
 * To retrieve connection information, call this operation from the Amazon Web Services account that is
 * used to manage the Amazon GameLift Servers fleets. Specify a fleet ID or leave the parameter empty to
 * retrieve all connection records. If successful, the retrieved information includes both
 * active and pending connections. Active connections identify the IpV4 CIDR block that the
 * VPC uses to connect.
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const describeVpcPeeringConnections =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeVpcPeeringConnectionsInput,
    output: DescribeVpcPeeringConnectionsOutput,
    errors: [
      InternalServiceException,
      InvalidRequestException,
      NotFoundException,
      UnauthorizedException,
    ],
  }));
/**
 * **This API works with the following fleet types:** EC2
 *
 * Requests authorization to remotely connect to an instance in an Amazon GameLift Servers managed fleet.
 * Use this operation to connect to instances with game servers that use Amazon GameLift Servers server SDK
 * 4.x or earlier. To connect to instances with game servers that use server SDK 5.x or
 * later, call https://docs.aws.amazon.com/gamelift/latest/apireference/API_GetComputeAccess.
 *
 * To request access to an instance, specify IDs for the instance and the fleet it
 * belongs to. You can retrieve instance IDs for a fleet by calling DescribeInstances with the fleet ID.
 *
 * If successful, this operation returns an IP address and credentials. The returned
 * credentials match the operating system of the instance, as follows:
 *
 * - For a Windows instance: returns a user name and secret (password) for use with
 * a Windows Remote Desktop client.
 *
 * - For a Linux instance: returns a user name and secret (RSA private key) for use
 * with an SSH client. You must save the secret to a `.pem` file. If
 * you're using the CLI, see the example Get credentials for a Linux instance for tips on automatically
 * saving the secret to a `.pem` file.
 *
 * **Learn more**
 *
 * Remotely connect to
 * fleet instances
 *
 * Debug fleet
 * issues
 *
 * **Related actions**
 *
 * All APIs by task
 */
export const getInstanceAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstanceAccessInput,
  output: GetInstanceAccessOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** Container
 *
 * Creates a `ContainerGroupDefinition` that describes a set of containers for
 * hosting your game server with Amazon GameLift Servers managed containers hosting. An Amazon GameLift Servers container group
 * is similar to a container task or pod. Use container group definitions when you create a
 * container fleet with CreateContainerFleet.
 *
 * A container group definition determines how Amazon GameLift Servers deploys your containers to each
 * instance in a container fleet. You can maintain multiple versions of a container group
 * definition.
 *
 * There are two types of container groups:
 *
 * - A **game server container group** has the containers that run
 * your game server application and supporting software. A game server container group can
 * have these container types:
 *
 * - Game server container. This container runs your game server. You can define one
 * game server container in a game server container group.
 *
 * - Support container. This container runs software in parallel with your game server.
 * You can define up to 8 support containers in a game server group.
 *
 * When building a game server container group definition, you can choose to bundle your
 * game server executable and all dependent software into a single game server container.
 * Alternatively, you can separate the software into one game server container and one or
 * more support containers.
 *
 * On a container fleet instance, a game server container group can be deployed multiple
 * times (depending on the compute resources of the instance). This means that all containers
 * in the container group are replicated together.
 *
 * - A **per-instance container group** has containers for processes
 * that aren't replicated on a container fleet instance. This might include background
 * services, logging, test processes, or processes that need to persist independently of the
 * game server container group. When building a per-instance container group, you can define
 * up to 10 support containers.
 *
 * This operation requires Identity and Access Management (IAM) permissions to access container images in
 * Amazon ECR repositories. See IAM permissions
 * for Amazon GameLift Servers for help setting the appropriate permissions.
 *
 * **Request options**
 *
 * Use this operation to make the following types of requests. You can specify values for the
 * minimum required parameters and customize optional values later.
 *
 * - Create a game server container group definition. Provide the following required parameter values:
 *
 * - `Name`
 *
 * - `ContainerGroupType` (`GAME_SERVER`)
 *
 * - `OperatingSystem` (omit to use default value)
 *
 * - `TotalMemoryLimitMebibytes` (omit to use default value)
 *
 * - `TotalVcpuLimit `(omit to use default value)
 *
 * - At least one `GameServerContainerDefinition`
 *
 * - `ContainerName`
 *
 * - `ImageUrl`
 *
 * - `PortConfiguration`
 *
 * - `ServerSdkVersion` (omit to use default value)
 *
 * - Create a per-instance container group definition. Provide the following required parameter
 * values:
 *
 * - `Name`
 *
 * - `ContainerGroupType` (`PER_INSTANCE`)
 *
 * - `OperatingSystem` (omit to use default value)
 *
 * - `TotalMemoryLimitMebibytes` (omit to use default value)
 *
 * - `TotalVcpuLimit `(omit to use default value)
 *
 * - At least one `SupportContainerDefinition`
 *
 * - `ContainerName`
 *
 * - `ImageUrl`
 *
 * **Results**
 *
 * If successful, this request creates a `ContainerGroupDefinition` resource and
 * assigns a unique ARN value. You can update most properties of a container group definition by
 * calling UpdateContainerGroupDefinition, and optionally save the update as a new version.
 */
export const createContainerGroupDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateContainerGroupDefinitionInput,
    output: CreateContainerGroupDefinitionOutput,
    errors: [
      ConflictException,
      InternalServiceException,
      InvalidRequestException,
      LimitExceededException,
      TaggingFailedException,
      UnauthorizedException,
      UnsupportedRegionException,
    ],
  }));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Creates a multiplayer game session for players in a specific fleet location. This
 * operation prompts an available server process to start a game session and retrieves
 * connection information for the new game session. As an alternative, consider using the
 * Amazon GameLift Servers game session placement feature with StartGameSessionPlacement, which uses the FleetIQ algorithm and queues to
 * optimize the placement process.
 *
 * When creating a game session, you specify exactly where you want to place it and
 * provide a set of game session configuration settings. The target fleet must be in
 * `ACTIVE` status.
 *
 * You can use this operation in the following ways:
 *
 * - To create a game session on an instance in a fleet's home Region, provide a
 * fleet or alias ID along with your game session configuration.
 *
 * - To create a game session on an instance in a fleet's remote location, provide
 * a fleet or alias ID and a location name, along with your game session
 * configuration.
 *
 * - To create a game session on an instance in an Anywhere fleet, specify the
 * fleet's custom location.
 *
 * If successful, Amazon GameLift Servers initiates a workflow to start a new game session and returns a
 * `GameSession` object containing the game session configuration and
 * status. When the game session status is `ACTIVE`, it is updated with
 * connection information and you can create player sessions for the game session. By
 * default, newly created game sessions are open to new players. You can restrict new
 * player access by using UpdateGameSession to change the game session's player session creation
 * policy.
 *
 * Amazon GameLift Servers retains logs for active for 14 days. To access the logs, call GetGameSessionLogUrl to download the log files.
 *
 * *Available in Amazon GameLift Servers Local.*
 *
 * **Learn more**
 *
 * Start a game session
 *
 * All APIs by task
 */
export const createGameSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGameSessionInput,
  output: CreateGameSessionOutput,
  errors: [
    ConflictException,
    FleetCapacityExceededException,
    IdempotentParameterMismatchException,
    InternalServiceException,
    InvalidFleetStatusException,
    InvalidRequestException,
    LimitExceededException,
    NotFoundException,
    TerminalRoutingStrategyException,
    UnauthorizedException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** Anywhere
 *
 * Creates a custom location for use in an Anywhere fleet.
 */
export const createLocation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLocationInput,
  output: CreateLocationOutput,
  errors: [
    ConflictException,
    InternalServiceException,
    InvalidRequestException,
    LimitExceededException,
    TaggingFailedException,
    UnauthorizedException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Retrieves one or more matchmaking tickets. Use this operation to retrieve ticket
 * information, including--after a successful match is made--connection information for the
 * resulting new game session.
 *
 * To request matchmaking tickets, provide a list of up to 10 ticket IDs. If the request
 * is successful, a ticket object is returned for each requested ID that currently
 * exists.
 *
 * This operation is not designed to be continually called to track matchmaking ticket
 * status. This practice can cause you to exceed your API limit, which results in errors.
 * Instead, as a best practice, set up an Amazon Simple Notification Service to receive notifications, and provide
 * the topic ARN in the matchmaking configuration.
 *
 * **Learn more**
 *
 * Add FlexMatch to a game client
 *
 * Set Up FlexMatch event
 * notification
 */
export const describeMatchmaking = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMatchmakingInput,
  output: DescribeMatchmakingOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    UnsupportedRegionException,
  ],
}));
/**
 * **This API works with the following fleet types:** EC2, Anywhere, Container
 *
 * Finds new players to fill open slots in currently running game sessions. The backfill
 * match process is essentially identical to the process of forming new matches. Backfill
 * requests use the same matchmaker that was used to make the original match, and they
 * provide matchmaking data for all players currently in the game session. FlexMatch uses
 * this information to select new players so that backfilled match continues to meet the
 * original match requirements.
 *
 * When using FlexMatch with Amazon GameLift Servers managed hosting, you can request a backfill match from
 * a client service by calling this operation with a `GameSessions` ID. You also
 * have the option of making backfill requests directly from your game server. In response
 * to a request, FlexMatch creates player sessions for the new players, updates the
 * `GameSession` resource, and sends updated matchmaking data to the game
 * server. You can request a backfill match at any point after a game session is started.
 * Each game session can have only one active backfill request at a time; a subsequent
 * request automatically replaces the earlier request.
 *
 * When using FlexMatch as a standalone component, request a backfill match by calling this
 * operation without a game session identifier. As with newly formed matches, matchmaking
 * results are returned in a matchmaking event so that your game can update the game
 * session that is being backfilled.
 *
 * To request a backfill match, specify a unique ticket ID, the original matchmaking
 * configuration, and matchmaking data for all current players in the game session being
 * backfilled. Optionally, specify the `GameSession` ARN. If successful, a match
 * backfill ticket is created and returned with status set to QUEUED. Track the status of
 * backfill tickets using the same method for tracking tickets for new matches.
 *
 * Only game sessions created by FlexMatch are supported for match backfill.
 *
 * **Learn more**
 *
 * Backfill existing games with FlexMatch
 *
 * Matchmaking events (reference)
 *
 * How Amazon GameLift Servers FlexMatch works
 */
export const startMatchBackfill = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMatchBackfillInput,
  output: StartMatchBackfillOutput,
  errors: [
    InternalServiceException,
    InvalidRequestException,
    NotFoundException,
    UnsupportedRegionException,
  ],
}));

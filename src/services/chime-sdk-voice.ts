import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Chime SDK Voice",
  serviceShapeName: "ChimeSDKTelephonyService",
});
const auth = T.AwsAuthSigv4({ name: "chime" });
const ver = T.ServiceVersion("2022-08-03");
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
                                url: "https://voice-chime-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://voice-chime-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://voice-chime.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://voice-chime.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetGlobalSettingsRequest extends S.Class<GetGlobalSettingsRequest>(
  "GetGlobalSettingsRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPhoneNumberSettingsRequest extends S.Class<GetPhoneNumberSettingsRequest>(
  "GetPhoneNumberSettingsRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAvailableVoiceConnectorRegionsRequest extends S.Class<ListAvailableVoiceConnectorRegionsRequest>(
  "ListAvailableVoiceConnectorRegionsRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const E164PhoneNumberList = S.Array(S.String);
export const NonEmptyStringList = S.Array(S.String);
export const ParticipantPhoneNumberList = S.Array(S.String);
export const CapabilityList = S.Array(S.String);
export const SensitiveStringList = S.Array(S.String);
export const VoiceConnectorAwsRegionList = S.Array(S.String);
export const SessionBorderControllerTypeList = S.Array(S.String);
export const ContactCenterSystemTypeList = S.Array(S.String);
export const CountryList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AssociatePhoneNumbersWithVoiceConnectorRequest extends S.Class<AssociatePhoneNumbersWithVoiceConnectorRequest>(
  "AssociatePhoneNumbersWithVoiceConnectorRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    E164PhoneNumbers: E164PhoneNumberList,
    ForceAssociate: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/voice-connectors/{VoiceConnectorId}?operation=associate-phone-numbers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociatePhoneNumbersWithVoiceConnectorGroupRequest extends S.Class<AssociatePhoneNumbersWithVoiceConnectorGroupRequest>(
  "AssociatePhoneNumbersWithVoiceConnectorGroupRequest",
)(
  {
    VoiceConnectorGroupId: S.String.pipe(T.HttpLabel("VoiceConnectorGroupId")),
    E164PhoneNumbers: E164PhoneNumberList,
    ForceAssociate: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/voice-connector-groups/{VoiceConnectorGroupId}?operation=associate-phone-numbers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDeletePhoneNumberRequest extends S.Class<BatchDeletePhoneNumberRequest>(
  "BatchDeletePhoneNumberRequest",
)(
  { PhoneNumberIds: NonEmptyStringList },
  T.all(
    T.Http({ method: "POST", uri: "/phone-numbers?operation=batch-delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePhoneNumberOrderRequest extends S.Class<CreatePhoneNumberOrderRequest>(
  "CreatePhoneNumberOrderRequest",
)(
  {
    ProductType: S.String,
    E164PhoneNumbers: E164PhoneNumberList,
    Name: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/phone-number-orders" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateVoiceConnectorRequest extends S.Class<CreateVoiceConnectorRequest>(
  "CreateVoiceConnectorRequest",
)(
  {
    Name: S.String,
    AwsRegion: S.optional(S.String),
    RequireEncryption: S.Boolean,
    Tags: S.optional(TagList),
    IntegrationType: S.optional(S.String),
    NetworkType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/voice-connectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateVoiceProfileRequest extends S.Class<CreateVoiceProfileRequest>(
  "CreateVoiceProfileRequest",
)(
  { SpeakerSearchTaskId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/voice-profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePhoneNumberRequest extends S.Class<DeletePhoneNumberRequest>(
  "DeletePhoneNumberRequest",
)(
  { PhoneNumberId: S.String.pipe(T.HttpLabel("PhoneNumberId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/phone-numbers/{PhoneNumberId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePhoneNumberResponse extends S.Class<DeletePhoneNumberResponse>(
  "DeletePhoneNumberResponse",
)({}) {}
export class DeleteProxySessionRequest extends S.Class<DeleteProxySessionRequest>(
  "DeleteProxySessionRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    ProxySessionId: S.String.pipe(T.HttpLabel("ProxySessionId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/voice-connectors/{VoiceConnectorId}/proxy-sessions/{ProxySessionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProxySessionResponse extends S.Class<DeleteProxySessionResponse>(
  "DeleteProxySessionResponse",
)({}) {}
export class DeleteSipMediaApplicationRequest extends S.Class<DeleteSipMediaApplicationRequest>(
  "DeleteSipMediaApplicationRequest",
)(
  {
    SipMediaApplicationId: S.String.pipe(T.HttpLabel("SipMediaApplicationId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/sip-media-applications/{SipMediaApplicationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSipMediaApplicationResponse extends S.Class<DeleteSipMediaApplicationResponse>(
  "DeleteSipMediaApplicationResponse",
)({}) {}
export class DeleteSipRuleRequest extends S.Class<DeleteSipRuleRequest>(
  "DeleteSipRuleRequest",
)(
  { SipRuleId: S.String.pipe(T.HttpLabel("SipRuleId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/sip-rules/{SipRuleId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSipRuleResponse extends S.Class<DeleteSipRuleResponse>(
  "DeleteSipRuleResponse",
)({}) {}
export class DeleteVoiceConnectorRequest extends S.Class<DeleteVoiceConnectorRequest>(
  "DeleteVoiceConnectorRequest",
)(
  { VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/voice-connectors/{VoiceConnectorId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVoiceConnectorResponse extends S.Class<DeleteVoiceConnectorResponse>(
  "DeleteVoiceConnectorResponse",
)({}) {}
export class DeleteVoiceConnectorEmergencyCallingConfigurationRequest extends S.Class<DeleteVoiceConnectorEmergencyCallingConfigurationRequest>(
  "DeleteVoiceConnectorEmergencyCallingConfigurationRequest",
)(
  { VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/voice-connectors/{VoiceConnectorId}/emergency-calling-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVoiceConnectorEmergencyCallingConfigurationResponse extends S.Class<DeleteVoiceConnectorEmergencyCallingConfigurationResponse>(
  "DeleteVoiceConnectorEmergencyCallingConfigurationResponse",
)({}) {}
export class DeleteVoiceConnectorExternalSystemsConfigurationRequest extends S.Class<DeleteVoiceConnectorExternalSystemsConfigurationRequest>(
  "DeleteVoiceConnectorExternalSystemsConfigurationRequest",
)(
  { VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/voice-connectors/{VoiceConnectorId}/external-systems-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVoiceConnectorExternalSystemsConfigurationResponse extends S.Class<DeleteVoiceConnectorExternalSystemsConfigurationResponse>(
  "DeleteVoiceConnectorExternalSystemsConfigurationResponse",
)({}) {}
export class DeleteVoiceConnectorGroupRequest extends S.Class<DeleteVoiceConnectorGroupRequest>(
  "DeleteVoiceConnectorGroupRequest",
)(
  {
    VoiceConnectorGroupId: S.String.pipe(T.HttpLabel("VoiceConnectorGroupId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/voice-connector-groups/{VoiceConnectorGroupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVoiceConnectorGroupResponse extends S.Class<DeleteVoiceConnectorGroupResponse>(
  "DeleteVoiceConnectorGroupResponse",
)({}) {}
export class DeleteVoiceConnectorOriginationRequest extends S.Class<DeleteVoiceConnectorOriginationRequest>(
  "DeleteVoiceConnectorOriginationRequest",
)(
  { VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/voice-connectors/{VoiceConnectorId}/origination",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVoiceConnectorOriginationResponse extends S.Class<DeleteVoiceConnectorOriginationResponse>(
  "DeleteVoiceConnectorOriginationResponse",
)({}) {}
export class DeleteVoiceConnectorProxyRequest extends S.Class<DeleteVoiceConnectorProxyRequest>(
  "DeleteVoiceConnectorProxyRequest",
)(
  { VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/voice-connectors/{VoiceConnectorId}/programmable-numbers/proxy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVoiceConnectorProxyResponse extends S.Class<DeleteVoiceConnectorProxyResponse>(
  "DeleteVoiceConnectorProxyResponse",
)({}) {}
export class DeleteVoiceConnectorStreamingConfigurationRequest extends S.Class<DeleteVoiceConnectorStreamingConfigurationRequest>(
  "DeleteVoiceConnectorStreamingConfigurationRequest",
)(
  { VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/voice-connectors/{VoiceConnectorId}/streaming-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVoiceConnectorStreamingConfigurationResponse extends S.Class<DeleteVoiceConnectorStreamingConfigurationResponse>(
  "DeleteVoiceConnectorStreamingConfigurationResponse",
)({}) {}
export class DeleteVoiceConnectorTerminationRequest extends S.Class<DeleteVoiceConnectorTerminationRequest>(
  "DeleteVoiceConnectorTerminationRequest",
)(
  { VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/voice-connectors/{VoiceConnectorId}/termination",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVoiceConnectorTerminationResponse extends S.Class<DeleteVoiceConnectorTerminationResponse>(
  "DeleteVoiceConnectorTerminationResponse",
)({}) {}
export class DeleteVoiceConnectorTerminationCredentialsRequest extends S.Class<DeleteVoiceConnectorTerminationCredentialsRequest>(
  "DeleteVoiceConnectorTerminationCredentialsRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    Usernames: SensitiveStringList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/voice-connectors/{VoiceConnectorId}/termination/credentials?operation=delete",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVoiceConnectorTerminationCredentialsResponse extends S.Class<DeleteVoiceConnectorTerminationCredentialsResponse>(
  "DeleteVoiceConnectorTerminationCredentialsResponse",
)({}) {}
export class DeleteVoiceProfileRequest extends S.Class<DeleteVoiceProfileRequest>(
  "DeleteVoiceProfileRequest",
)(
  { VoiceProfileId: S.String.pipe(T.HttpLabel("VoiceProfileId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/voice-profiles/{VoiceProfileId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVoiceProfileResponse extends S.Class<DeleteVoiceProfileResponse>(
  "DeleteVoiceProfileResponse",
)({}) {}
export class DeleteVoiceProfileDomainRequest extends S.Class<DeleteVoiceProfileDomainRequest>(
  "DeleteVoiceProfileDomainRequest",
)(
  { VoiceProfileDomainId: S.String.pipe(T.HttpLabel("VoiceProfileDomainId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/voice-profile-domains/{VoiceProfileDomainId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVoiceProfileDomainResponse extends S.Class<DeleteVoiceProfileDomainResponse>(
  "DeleteVoiceProfileDomainResponse",
)({}) {}
export class DisassociatePhoneNumbersFromVoiceConnectorRequest extends S.Class<DisassociatePhoneNumbersFromVoiceConnectorRequest>(
  "DisassociatePhoneNumbersFromVoiceConnectorRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    E164PhoneNumbers: E164PhoneNumberList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/voice-connectors/{VoiceConnectorId}?operation=disassociate-phone-numbers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociatePhoneNumbersFromVoiceConnectorGroupRequest extends S.Class<DisassociatePhoneNumbersFromVoiceConnectorGroupRequest>(
  "DisassociatePhoneNumbersFromVoiceConnectorGroupRequest",
)(
  {
    VoiceConnectorGroupId: S.String.pipe(T.HttpLabel("VoiceConnectorGroupId")),
    E164PhoneNumbers: E164PhoneNumberList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/voice-connector-groups/{VoiceConnectorGroupId}?operation=disassociate-phone-numbers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPhoneNumberRequest extends S.Class<GetPhoneNumberRequest>(
  "GetPhoneNumberRequest",
)(
  { PhoneNumberId: S.String.pipe(T.HttpLabel("PhoneNumberId")) },
  T.all(
    T.Http({ method: "GET", uri: "/phone-numbers/{PhoneNumberId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPhoneNumberOrderRequest extends S.Class<GetPhoneNumberOrderRequest>(
  "GetPhoneNumberOrderRequest",
)(
  { PhoneNumberOrderId: S.String.pipe(T.HttpLabel("PhoneNumberOrderId")) },
  T.all(
    T.Http({ method: "GET", uri: "/phone-number-orders/{PhoneNumberOrderId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPhoneNumberSettingsResponse extends S.Class<GetPhoneNumberSettingsResponse>(
  "GetPhoneNumberSettingsResponse",
)({
  CallingName: S.optional(S.String),
  CallingNameUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export class GetProxySessionRequest extends S.Class<GetProxySessionRequest>(
  "GetProxySessionRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    ProxySessionId: S.String.pipe(T.HttpLabel("ProxySessionId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/voice-connectors/{VoiceConnectorId}/proxy-sessions/{ProxySessionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSipMediaApplicationRequest extends S.Class<GetSipMediaApplicationRequest>(
  "GetSipMediaApplicationRequest",
)(
  {
    SipMediaApplicationId: S.String.pipe(T.HttpLabel("SipMediaApplicationId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/sip-media-applications/{SipMediaApplicationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSipMediaApplicationAlexaSkillConfigurationRequest extends S.Class<GetSipMediaApplicationAlexaSkillConfigurationRequest>(
  "GetSipMediaApplicationAlexaSkillConfigurationRequest",
)(
  {
    SipMediaApplicationId: S.String.pipe(T.HttpLabel("SipMediaApplicationId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/sip-media-applications/{SipMediaApplicationId}/alexa-skill-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSipMediaApplicationLoggingConfigurationRequest extends S.Class<GetSipMediaApplicationLoggingConfigurationRequest>(
  "GetSipMediaApplicationLoggingConfigurationRequest",
)(
  {
    SipMediaApplicationId: S.String.pipe(T.HttpLabel("SipMediaApplicationId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/sip-media-applications/{SipMediaApplicationId}/logging-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSipRuleRequest extends S.Class<GetSipRuleRequest>(
  "GetSipRuleRequest",
)(
  { SipRuleId: S.String.pipe(T.HttpLabel("SipRuleId")) },
  T.all(
    T.Http({ method: "GET", uri: "/sip-rules/{SipRuleId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSpeakerSearchTaskRequest extends S.Class<GetSpeakerSearchTaskRequest>(
  "GetSpeakerSearchTaskRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    SpeakerSearchTaskId: S.String.pipe(T.HttpLabel("SpeakerSearchTaskId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/voice-connectors/{VoiceConnectorId}/speaker-search-tasks/{SpeakerSearchTaskId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVoiceConnectorRequest extends S.Class<GetVoiceConnectorRequest>(
  "GetVoiceConnectorRequest",
)(
  { VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")) },
  T.all(
    T.Http({ method: "GET", uri: "/voice-connectors/{VoiceConnectorId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVoiceConnectorEmergencyCallingConfigurationRequest extends S.Class<GetVoiceConnectorEmergencyCallingConfigurationRequest>(
  "GetVoiceConnectorEmergencyCallingConfigurationRequest",
)(
  { VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/voice-connectors/{VoiceConnectorId}/emergency-calling-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVoiceConnectorExternalSystemsConfigurationRequest extends S.Class<GetVoiceConnectorExternalSystemsConfigurationRequest>(
  "GetVoiceConnectorExternalSystemsConfigurationRequest",
)(
  { VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/voice-connectors/{VoiceConnectorId}/external-systems-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVoiceConnectorGroupRequest extends S.Class<GetVoiceConnectorGroupRequest>(
  "GetVoiceConnectorGroupRequest",
)(
  {
    VoiceConnectorGroupId: S.String.pipe(T.HttpLabel("VoiceConnectorGroupId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/voice-connector-groups/{VoiceConnectorGroupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVoiceConnectorLoggingConfigurationRequest extends S.Class<GetVoiceConnectorLoggingConfigurationRequest>(
  "GetVoiceConnectorLoggingConfigurationRequest",
)(
  { VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/voice-connectors/{VoiceConnectorId}/logging-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVoiceConnectorOriginationRequest extends S.Class<GetVoiceConnectorOriginationRequest>(
  "GetVoiceConnectorOriginationRequest",
)(
  { VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/voice-connectors/{VoiceConnectorId}/origination",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVoiceConnectorProxyRequest extends S.Class<GetVoiceConnectorProxyRequest>(
  "GetVoiceConnectorProxyRequest",
)(
  { VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/voice-connectors/{VoiceConnectorId}/programmable-numbers/proxy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVoiceConnectorStreamingConfigurationRequest extends S.Class<GetVoiceConnectorStreamingConfigurationRequest>(
  "GetVoiceConnectorStreamingConfigurationRequest",
)(
  { VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/voice-connectors/{VoiceConnectorId}/streaming-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVoiceConnectorTerminationRequest extends S.Class<GetVoiceConnectorTerminationRequest>(
  "GetVoiceConnectorTerminationRequest",
)(
  { VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/voice-connectors/{VoiceConnectorId}/termination",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVoiceConnectorTerminationHealthRequest extends S.Class<GetVoiceConnectorTerminationHealthRequest>(
  "GetVoiceConnectorTerminationHealthRequest",
)(
  { VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/voice-connectors/{VoiceConnectorId}/termination/health",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVoiceProfileRequest extends S.Class<GetVoiceProfileRequest>(
  "GetVoiceProfileRequest",
)(
  { VoiceProfileId: S.String.pipe(T.HttpLabel("VoiceProfileId")) },
  T.all(
    T.Http({ method: "GET", uri: "/voice-profiles/{VoiceProfileId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVoiceProfileDomainRequest extends S.Class<GetVoiceProfileDomainRequest>(
  "GetVoiceProfileDomainRequest",
)(
  { VoiceProfileDomainId: S.String.pipe(T.HttpLabel("VoiceProfileDomainId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/voice-profile-domains/{VoiceProfileDomainId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVoiceToneAnalysisTaskRequest extends S.Class<GetVoiceToneAnalysisTaskRequest>(
  "GetVoiceToneAnalysisTaskRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    VoiceToneAnalysisTaskId: S.String.pipe(
      T.HttpLabel("VoiceToneAnalysisTaskId"),
    ),
    IsCaller: S.Boolean.pipe(T.HttpQuery("isCaller")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/voice-connectors/{VoiceConnectorId}/voice-tone-analysis-tasks/{VoiceToneAnalysisTaskId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAvailableVoiceConnectorRegionsResponse extends S.Class<ListAvailableVoiceConnectorRegionsResponse>(
  "ListAvailableVoiceConnectorRegionsResponse",
)({ VoiceConnectorRegions: S.optional(VoiceConnectorAwsRegionList) }) {}
export class ListPhoneNumberOrdersRequest extends S.Class<ListPhoneNumberOrdersRequest>(
  "ListPhoneNumberOrdersRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/phone-number-orders" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPhoneNumbersRequest extends S.Class<ListPhoneNumbersRequest>(
  "ListPhoneNumbersRequest",
)(
  {
    Status: S.optional(S.String).pipe(T.HttpQuery("status")),
    ProductType: S.optional(S.String).pipe(T.HttpQuery("product-type")),
    FilterName: S.optional(S.String).pipe(T.HttpQuery("filter-name")),
    FilterValue: S.optional(S.String).pipe(T.HttpQuery("filter-value")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/phone-numbers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProxySessionsRequest extends S.Class<ListProxySessionsRequest>(
  "ListProxySessionsRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    Status: S.optional(S.String).pipe(T.HttpQuery("status")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/voice-connectors/{VoiceConnectorId}/proxy-sessions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSipMediaApplicationsRequest extends S.Class<ListSipMediaApplicationsRequest>(
  "ListSipMediaApplicationsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/sip-media-applications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSipRulesRequest extends S.Class<ListSipRulesRequest>(
  "ListSipRulesRequest",
)(
  {
    SipMediaApplicationId: S.optional(S.String).pipe(
      T.HttpQuery("sip-media-application"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/sip-rules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSupportedPhoneNumberCountriesRequest extends S.Class<ListSupportedPhoneNumberCountriesRequest>(
  "ListSupportedPhoneNumberCountriesRequest",
)(
  { ProductType: S.String.pipe(T.HttpQuery("product-type")) },
  T.all(
    T.Http({ method: "GET", uri: "/phone-number-countries" }),
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
  { ResourceARN: S.String.pipe(T.HttpQuery("arn")) },
  T.all(T.Http({ method: "GET", uri: "/tags" }), svc, auth, proto, ver, rules),
) {}
export class ListVoiceConnectorGroupsRequest extends S.Class<ListVoiceConnectorGroupsRequest>(
  "ListVoiceConnectorGroupsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/voice-connector-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVoiceConnectorsRequest extends S.Class<ListVoiceConnectorsRequest>(
  "ListVoiceConnectorsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/voice-connectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVoiceConnectorTerminationCredentialsRequest extends S.Class<ListVoiceConnectorTerminationCredentialsRequest>(
  "ListVoiceConnectorTerminationCredentialsRequest",
)(
  { VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/voice-connectors/{VoiceConnectorId}/termination/credentials",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVoiceProfileDomainsRequest extends S.Class<ListVoiceProfileDomainsRequest>(
  "ListVoiceProfileDomainsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/voice-profile-domains" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVoiceProfilesRequest extends S.Class<ListVoiceProfilesRequest>(
  "ListVoiceProfilesRequest",
)(
  {
    VoiceProfileDomainId: S.String.pipe(T.HttpQuery("voice-profile-domain-id")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/voice-profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutVoiceConnectorExternalSystemsConfigurationRequest extends S.Class<PutVoiceConnectorExternalSystemsConfigurationRequest>(
  "PutVoiceConnectorExternalSystemsConfigurationRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    SessionBorderControllerTypes: S.optional(SessionBorderControllerTypeList),
    ContactCenterSystemTypes: S.optional(ContactCenterSystemTypeList),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/voice-connectors/{VoiceConnectorId}/external-systems-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutVoiceConnectorProxyRequest extends S.Class<PutVoiceConnectorProxyRequest>(
  "PutVoiceConnectorProxyRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    DefaultSessionExpiryMinutes: S.Number,
    PhoneNumberPoolCountries: CountryList,
    FallBackPhoneNumber: S.optional(S.String),
    Disabled: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/voice-connectors/{VoiceConnectorId}/programmable-numbers/proxy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RestorePhoneNumberRequest extends S.Class<RestorePhoneNumberRequest>(
  "RestorePhoneNumberRequest",
)(
  { PhoneNumberId: S.String.pipe(T.HttpLabel("PhoneNumberId")) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/phone-numbers/{PhoneNumberId}?operation=restore",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchAvailablePhoneNumbersRequest extends S.Class<SearchAvailablePhoneNumbersRequest>(
  "SearchAvailablePhoneNumbersRequest",
)(
  {
    AreaCode: S.optional(S.String).pipe(T.HttpQuery("area-code")),
    City: S.optional(S.String).pipe(T.HttpQuery("city")),
    Country: S.optional(S.String).pipe(T.HttpQuery("country")),
    State: S.optional(S.String).pipe(T.HttpQuery("state")),
    TollFreePrefix: S.optional(S.String).pipe(T.HttpQuery("toll-free-prefix")),
    PhoneNumberType: S.optional(S.String).pipe(
      T.HttpQuery("phone-number-type"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/search?type=phone-numbers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartSpeakerSearchTaskRequest extends S.Class<StartSpeakerSearchTaskRequest>(
  "StartSpeakerSearchTaskRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    TransactionId: S.String,
    VoiceProfileDomainId: S.String,
    ClientRequestToken: S.optional(S.String),
    CallLeg: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/voice-connectors/{VoiceConnectorId}/speaker-search-tasks",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartVoiceToneAnalysisTaskRequest extends S.Class<StartVoiceToneAnalysisTaskRequest>(
  "StartVoiceToneAnalysisTaskRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    TransactionId: S.String,
    LanguageCode: S.String,
    ClientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/voice-connectors/{VoiceConnectorId}/voice-tone-analysis-tasks",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopSpeakerSearchTaskRequest extends S.Class<StopSpeakerSearchTaskRequest>(
  "StopSpeakerSearchTaskRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    SpeakerSearchTaskId: S.String.pipe(T.HttpLabel("SpeakerSearchTaskId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/voice-connectors/{VoiceConnectorId}/speaker-search-tasks/{SpeakerSearchTaskId}?operation=stop",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopSpeakerSearchTaskResponse extends S.Class<StopSpeakerSearchTaskResponse>(
  "StopSpeakerSearchTaskResponse",
)({}) {}
export class StopVoiceToneAnalysisTaskRequest extends S.Class<StopVoiceToneAnalysisTaskRequest>(
  "StopVoiceToneAnalysisTaskRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    VoiceToneAnalysisTaskId: S.String.pipe(
      T.HttpLabel("VoiceToneAnalysisTaskId"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/voice-connectors/{VoiceConnectorId}/voice-tone-analysis-tasks/{VoiceToneAnalysisTaskId}?operation=stop",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopVoiceToneAnalysisTaskResponse extends S.Class<StopVoiceToneAnalysisTaskResponse>(
  "StopVoiceToneAnalysisTaskResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(
    T.Http({ method: "POST", uri: "/tags?operation=tag-resource" }),
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
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(
    T.Http({ method: "POST", uri: "/tags?operation=untag-resource" }),
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
export class VoiceConnectorSettings extends S.Class<VoiceConnectorSettings>(
  "VoiceConnectorSettings",
)({ CdrBucket: S.optional(S.String) }) {}
export class UpdateGlobalSettingsRequest extends S.Class<UpdateGlobalSettingsRequest>(
  "UpdateGlobalSettingsRequest",
)(
  { VoiceConnector: S.optional(VoiceConnectorSettings) },
  T.all(
    T.Http({ method: "PUT", uri: "/settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateGlobalSettingsResponse extends S.Class<UpdateGlobalSettingsResponse>(
  "UpdateGlobalSettingsResponse",
)({}) {}
export class UpdatePhoneNumberRequest extends S.Class<UpdatePhoneNumberRequest>(
  "UpdatePhoneNumberRequest",
)(
  {
    PhoneNumberId: S.String.pipe(T.HttpLabel("PhoneNumberId")),
    ProductType: S.optional(S.String),
    CallingName: S.optional(S.String),
    Name: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/phone-numbers/{PhoneNumberId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePhoneNumberSettingsRequest extends S.Class<UpdatePhoneNumberSettingsRequest>(
  "UpdatePhoneNumberSettingsRequest",
)(
  { CallingName: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/settings/phone-number" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePhoneNumberSettingsResponse extends S.Class<UpdatePhoneNumberSettingsResponse>(
  "UpdatePhoneNumberSettingsResponse",
)({}) {}
export class UpdateProxySessionRequest extends S.Class<UpdateProxySessionRequest>(
  "UpdateProxySessionRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    ProxySessionId: S.String.pipe(T.HttpLabel("ProxySessionId")),
    Capabilities: CapabilityList,
    ExpiryMinutes: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/voice-connectors/{VoiceConnectorId}/proxy-sessions/{ProxySessionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SipMediaApplicationEndpoint extends S.Class<SipMediaApplicationEndpoint>(
  "SipMediaApplicationEndpoint",
)({ LambdaArn: S.optional(S.String) }) {}
export const SipMediaApplicationEndpointList = S.Array(
  SipMediaApplicationEndpoint,
);
export class UpdateSipMediaApplicationRequest extends S.Class<UpdateSipMediaApplicationRequest>(
  "UpdateSipMediaApplicationRequest",
)(
  {
    SipMediaApplicationId: S.String.pipe(T.HttpLabel("SipMediaApplicationId")),
    Name: S.optional(S.String),
    Endpoints: S.optional(SipMediaApplicationEndpointList),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/sip-media-applications/{SipMediaApplicationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SipRuleTargetApplication extends S.Class<SipRuleTargetApplication>(
  "SipRuleTargetApplication",
)({
  SipMediaApplicationId: S.optional(S.String),
  Priority: S.optional(S.Number),
  AwsRegion: S.optional(S.String),
}) {}
export const SipRuleTargetApplicationList = S.Array(SipRuleTargetApplication);
export class UpdateSipRuleRequest extends S.Class<UpdateSipRuleRequest>(
  "UpdateSipRuleRequest",
)(
  {
    SipRuleId: S.String.pipe(T.HttpLabel("SipRuleId")),
    Name: S.String,
    Disabled: S.optional(S.Boolean),
    TargetApplications: S.optional(SipRuleTargetApplicationList),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/sip-rules/{SipRuleId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateVoiceConnectorRequest extends S.Class<UpdateVoiceConnectorRequest>(
  "UpdateVoiceConnectorRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    Name: S.String,
    RequireEncryption: S.Boolean,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/voice-connectors/{VoiceConnectorId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VoiceConnectorItem extends S.Class<VoiceConnectorItem>(
  "VoiceConnectorItem",
)({ VoiceConnectorId: S.String, Priority: S.Number }) {}
export const VoiceConnectorItemList = S.Array(VoiceConnectorItem);
export class UpdateVoiceConnectorGroupRequest extends S.Class<UpdateVoiceConnectorGroupRequest>(
  "UpdateVoiceConnectorGroupRequest",
)(
  {
    VoiceConnectorGroupId: S.String.pipe(T.HttpLabel("VoiceConnectorGroupId")),
    Name: S.String,
    VoiceConnectorItems: VoiceConnectorItemList,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/voice-connector-groups/{VoiceConnectorGroupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateVoiceProfileRequest extends S.Class<UpdateVoiceProfileRequest>(
  "UpdateVoiceProfileRequest",
)(
  {
    VoiceProfileId: S.String.pipe(T.HttpLabel("VoiceProfileId")),
    SpeakerSearchTaskId: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/voice-profiles/{VoiceProfileId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateVoiceProfileDomainRequest extends S.Class<UpdateVoiceProfileDomainRequest>(
  "UpdateVoiceProfileDomainRequest",
)(
  {
    VoiceProfileDomainId: S.String.pipe(T.HttpLabel("VoiceProfileDomainId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/voice-profile-domains/{VoiceProfileDomainId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ValidateE911AddressRequest extends S.Class<ValidateE911AddressRequest>(
  "ValidateE911AddressRequest",
)(
  {
    AwsAccountId: S.String,
    StreetNumber: S.String,
    StreetInfo: S.String,
    City: S.String,
    State: S.String,
    Country: S.String,
    PostalCode: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/emergency-calling/address" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const AlexaSkillIdList = S.Array(S.String);
export const CallingRegionList = S.Array(S.String);
export const StringList = S.Array(S.String);
export class UpdatePhoneNumberRequestItem extends S.Class<UpdatePhoneNumberRequestItem>(
  "UpdatePhoneNumberRequestItem",
)({
  PhoneNumberId: S.String,
  ProductType: S.optional(S.String),
  CallingName: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export const UpdatePhoneNumberRequestItemList = S.Array(
  UpdatePhoneNumberRequestItem,
);
export class GeoMatchParams extends S.Class<GeoMatchParams>("GeoMatchParams")({
  Country: S.String,
  AreaCode: S.String,
}) {}
export const SipHeadersMap = S.Record({ key: S.String, value: S.String });
export const SMACreateCallArgumentsMap = S.Record({
  key: S.String,
  value: S.String,
});
export class ServerSideEncryptionConfiguration extends S.Class<ServerSideEncryptionConfiguration>(
  "ServerSideEncryptionConfiguration",
)({ KmsKeyArn: S.String }) {}
export class OrderedPhoneNumber extends S.Class<OrderedPhoneNumber>(
  "OrderedPhoneNumber",
)({ E164PhoneNumber: S.optional(S.String), Status: S.optional(S.String) }) {}
export const OrderedPhoneNumberList = S.Array(OrderedPhoneNumber);
export class PhoneNumberOrder extends S.Class<PhoneNumberOrder>(
  "PhoneNumberOrder",
)({
  PhoneNumberOrderId: S.optional(S.String),
  ProductType: S.optional(S.String),
  Status: S.optional(S.String),
  OrderType: S.optional(S.String),
  OrderedPhoneNumbers: S.optional(OrderedPhoneNumberList),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  FocDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const PhoneNumberOrderList = S.Array(PhoneNumberOrder);
export class PhoneNumberCapabilities extends S.Class<PhoneNumberCapabilities>(
  "PhoneNumberCapabilities",
)({
  InboundCall: S.optional(S.Boolean),
  OutboundCall: S.optional(S.Boolean),
  InboundSMS: S.optional(S.Boolean),
  OutboundSMS: S.optional(S.Boolean),
  InboundMMS: S.optional(S.Boolean),
  OutboundMMS: S.optional(S.Boolean),
}) {}
export class PhoneNumberAssociation extends S.Class<PhoneNumberAssociation>(
  "PhoneNumberAssociation",
)({
  Value: S.optional(S.String),
  Name: S.optional(S.String),
  AssociatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const PhoneNumberAssociationList = S.Array(PhoneNumberAssociation);
export class PhoneNumber extends S.Class<PhoneNumber>("PhoneNumber")({
  PhoneNumberId: S.optional(S.String),
  E164PhoneNumber: S.optional(S.String),
  Country: S.optional(S.String),
  Type: S.optional(S.String),
  ProductType: S.optional(S.String),
  Status: S.optional(S.String),
  Capabilities: S.optional(PhoneNumberCapabilities),
  Associations: S.optional(PhoneNumberAssociationList),
  CallingName: S.optional(S.String),
  CallingNameStatus: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  DeletionTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  OrderId: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export const PhoneNumberList = S.Array(PhoneNumber);
export class Participant extends S.Class<Participant>("Participant")({
  PhoneNumber: S.optional(S.String),
  ProxyPhoneNumber: S.optional(S.String),
}) {}
export const Participants = S.Array(Participant);
export class ProxySession extends S.Class<ProxySession>("ProxySession")({
  VoiceConnectorId: S.optional(S.String),
  ProxySessionId: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  ExpiryMinutes: S.optional(S.Number),
  Capabilities: S.optional(CapabilityList),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EndedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Participants: S.optional(Participants),
  NumberSelectionBehavior: S.optional(S.String),
  GeoMatchLevel: S.optional(S.String),
  GeoMatchParams: S.optional(GeoMatchParams),
}) {}
export const ProxySessions = S.Array(ProxySession);
export class SipMediaApplication extends S.Class<SipMediaApplication>(
  "SipMediaApplication",
)({
  SipMediaApplicationId: S.optional(S.String),
  AwsRegion: S.optional(S.String),
  Name: S.optional(S.String),
  Endpoints: S.optional(SipMediaApplicationEndpointList),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  SipMediaApplicationArn: S.optional(S.String),
}) {}
export const SipMediaApplicationList = S.Array(SipMediaApplication);
export class SipRule extends S.Class<SipRule>("SipRule")({
  SipRuleId: S.optional(S.String),
  Name: S.optional(S.String),
  Disabled: S.optional(S.Boolean),
  TriggerType: S.optional(S.String),
  TriggerValue: S.optional(S.String),
  TargetApplications: S.optional(SipRuleTargetApplicationList),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const SipRuleList = S.Array(SipRule);
export class VoiceConnectorGroup extends S.Class<VoiceConnectorGroup>(
  "VoiceConnectorGroup",
)({
  VoiceConnectorGroupId: S.optional(S.String),
  Name: S.optional(S.String),
  VoiceConnectorItems: S.optional(VoiceConnectorItemList),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  VoiceConnectorGroupArn: S.optional(S.String),
}) {}
export const VoiceConnectorGroupList = S.Array(VoiceConnectorGroup);
export class VoiceConnector extends S.Class<VoiceConnector>("VoiceConnector")({
  VoiceConnectorId: S.optional(S.String),
  AwsRegion: S.optional(S.String),
  Name: S.optional(S.String),
  OutboundHostName: S.optional(S.String),
  RequireEncryption: S.optional(S.Boolean),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  VoiceConnectorArn: S.optional(S.String),
  IntegrationType: S.optional(S.String),
  NetworkType: S.optional(S.String),
}) {}
export const VoiceConnectorList = S.Array(VoiceConnector);
export class SipMediaApplicationAlexaSkillConfiguration extends S.Class<SipMediaApplicationAlexaSkillConfiguration>(
  "SipMediaApplicationAlexaSkillConfiguration",
)({ AlexaSkillStatus: S.String, AlexaSkillIds: AlexaSkillIdList }) {}
export class SipMediaApplicationLoggingConfiguration extends S.Class<SipMediaApplicationLoggingConfiguration>(
  "SipMediaApplicationLoggingConfiguration",
)({ EnableSipMediaApplicationMessageLogs: S.optional(S.Boolean) }) {}
export class LoggingConfiguration extends S.Class<LoggingConfiguration>(
  "LoggingConfiguration",
)({
  EnableSIPLogs: S.optional(S.Boolean),
  EnableMediaMetricLogs: S.optional(S.Boolean),
}) {}
export class Termination extends S.Class<Termination>("Termination")({
  CpsLimit: S.optional(S.Number),
  DefaultPhoneNumber: S.optional(S.String),
  CallingRegions: S.optional(CallingRegionList),
  CidrAllowedList: S.optional(StringList),
  Disabled: S.optional(S.Boolean),
}) {}
export class Credential extends S.Class<Credential>("Credential")({
  Username: S.optional(S.String),
  Password: S.optional(S.String),
}) {}
export const CredentialList = S.Array(Credential);
export const SMAUpdateCallArgumentsMap = S.Record({
  key: S.String,
  value: S.String,
});
export class PhoneNumberError extends S.Class<PhoneNumberError>(
  "PhoneNumberError",
)({
  PhoneNumberId: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const PhoneNumberErrorList = S.Array(PhoneNumberError);
export class AssociatePhoneNumbersWithVoiceConnectorGroupResponse extends S.Class<AssociatePhoneNumbersWithVoiceConnectorGroupResponse>(
  "AssociatePhoneNumbersWithVoiceConnectorGroupResponse",
)({ PhoneNumberErrors: S.optional(PhoneNumberErrorList) }) {}
export class BatchDeletePhoneNumberResponse extends S.Class<BatchDeletePhoneNumberResponse>(
  "BatchDeletePhoneNumberResponse",
)({ PhoneNumberErrors: S.optional(PhoneNumberErrorList) }) {}
export class BatchUpdatePhoneNumberRequest extends S.Class<BatchUpdatePhoneNumberRequest>(
  "BatchUpdatePhoneNumberRequest",
)(
  { UpdatePhoneNumberRequestItems: UpdatePhoneNumberRequestItemList },
  T.all(
    T.Http({ method: "POST", uri: "/phone-numbers?operation=batch-update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateProxySessionRequest extends S.Class<CreateProxySessionRequest>(
  "CreateProxySessionRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    ParticipantPhoneNumbers: ParticipantPhoneNumberList,
    Name: S.optional(S.String),
    ExpiryMinutes: S.optional(S.Number),
    Capabilities: CapabilityList,
    NumberSelectionBehavior: S.optional(S.String),
    GeoMatchLevel: S.optional(S.String),
    GeoMatchParams: S.optional(GeoMatchParams),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/voice-connectors/{VoiceConnectorId}/proxy-sessions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSipMediaApplicationRequest extends S.Class<CreateSipMediaApplicationRequest>(
  "CreateSipMediaApplicationRequest",
)(
  {
    AwsRegion: S.String,
    Name: S.String,
    Endpoints: SipMediaApplicationEndpointList,
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/sip-media-applications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSipMediaApplicationCallRequest extends S.Class<CreateSipMediaApplicationCallRequest>(
  "CreateSipMediaApplicationCallRequest",
)(
  {
    FromPhoneNumber: S.String,
    ToPhoneNumber: S.String,
    SipMediaApplicationId: S.String.pipe(T.HttpLabel("SipMediaApplicationId")),
    SipHeaders: S.optional(SipHeadersMap),
    ArgumentsMap: S.optional(SMACreateCallArgumentsMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/sip-media-applications/{SipMediaApplicationId}/calls",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSipRuleRequest extends S.Class<CreateSipRuleRequest>(
  "CreateSipRuleRequest",
)(
  {
    Name: S.String,
    TriggerType: S.String,
    TriggerValue: S.String,
    Disabled: S.optional(S.Boolean),
    TargetApplications: S.optional(SipRuleTargetApplicationList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/sip-rules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateVoiceConnectorGroupRequest extends S.Class<CreateVoiceConnectorGroupRequest>(
  "CreateVoiceConnectorGroupRequest",
)(
  { Name: S.String, VoiceConnectorItems: S.optional(VoiceConnectorItemList) },
  T.all(
    T.Http({ method: "POST", uri: "/voice-connector-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateVoiceProfileDomainRequest extends S.Class<CreateVoiceProfileDomainRequest>(
  "CreateVoiceProfileDomainRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    ServerSideEncryptionConfiguration: ServerSideEncryptionConfiguration,
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/voice-profile-domains" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociatePhoneNumbersFromVoiceConnectorResponse extends S.Class<DisassociatePhoneNumbersFromVoiceConnectorResponse>(
  "DisassociatePhoneNumbersFromVoiceConnectorResponse",
)({ PhoneNumberErrors: S.optional(PhoneNumberErrorList) }) {}
export class DisassociatePhoneNumbersFromVoiceConnectorGroupResponse extends S.Class<DisassociatePhoneNumbersFromVoiceConnectorGroupResponse>(
  "DisassociatePhoneNumbersFromVoiceConnectorGroupResponse",
)({ PhoneNumberErrors: S.optional(PhoneNumberErrorList) }) {}
export class GetGlobalSettingsResponse extends S.Class<GetGlobalSettingsResponse>(
  "GetGlobalSettingsResponse",
)({ VoiceConnector: S.optional(VoiceConnectorSettings) }) {}
export class GetPhoneNumberOrderResponse extends S.Class<GetPhoneNumberOrderResponse>(
  "GetPhoneNumberOrderResponse",
)({ PhoneNumberOrder: S.optional(PhoneNumberOrder) }) {}
export class GetSipMediaApplicationAlexaSkillConfigurationResponse extends S.Class<GetSipMediaApplicationAlexaSkillConfigurationResponse>(
  "GetSipMediaApplicationAlexaSkillConfigurationResponse",
)({
  SipMediaApplicationAlexaSkillConfiguration: S.optional(
    SipMediaApplicationAlexaSkillConfiguration,
  ),
}) {}
export class GetSipMediaApplicationLoggingConfigurationResponse extends S.Class<GetSipMediaApplicationLoggingConfigurationResponse>(
  "GetSipMediaApplicationLoggingConfigurationResponse",
)({
  SipMediaApplicationLoggingConfiguration: S.optional(
    SipMediaApplicationLoggingConfiguration,
  ),
}) {}
export class GetVoiceConnectorResponse extends S.Class<GetVoiceConnectorResponse>(
  "GetVoiceConnectorResponse",
)({ VoiceConnector: S.optional(VoiceConnector) }) {}
export class DNISEmergencyCallingConfiguration extends S.Class<DNISEmergencyCallingConfiguration>(
  "DNISEmergencyCallingConfiguration",
)({
  EmergencyPhoneNumber: S.String,
  TestPhoneNumber: S.optional(S.String),
  CallingCountry: S.String,
}) {}
export const DNISEmergencyCallingConfigurationList = S.Array(
  DNISEmergencyCallingConfiguration,
);
export class EmergencyCallingConfiguration extends S.Class<EmergencyCallingConfiguration>(
  "EmergencyCallingConfiguration",
)({ DNIS: S.optional(DNISEmergencyCallingConfigurationList) }) {}
export class GetVoiceConnectorEmergencyCallingConfigurationResponse extends S.Class<GetVoiceConnectorEmergencyCallingConfigurationResponse>(
  "GetVoiceConnectorEmergencyCallingConfigurationResponse",
)({
  EmergencyCallingConfiguration: S.optional(EmergencyCallingConfiguration),
}) {}
export class GetVoiceConnectorLoggingConfigurationResponse extends S.Class<GetVoiceConnectorLoggingConfigurationResponse>(
  "GetVoiceConnectorLoggingConfigurationResponse",
)({ LoggingConfiguration: S.optional(LoggingConfiguration) }) {}
export class OriginationRoute extends S.Class<OriginationRoute>(
  "OriginationRoute",
)({
  Host: S.optional(S.String),
  Port: S.optional(S.Number),
  Protocol: S.optional(S.String),
  Priority: S.optional(S.Number),
  Weight: S.optional(S.Number),
}) {}
export const OriginationRouteList = S.Array(OriginationRoute);
export class Origination extends S.Class<Origination>("Origination")({
  Routes: S.optional(OriginationRouteList),
  Disabled: S.optional(S.Boolean),
}) {}
export class GetVoiceConnectorOriginationResponse extends S.Class<GetVoiceConnectorOriginationResponse>(
  "GetVoiceConnectorOriginationResponse",
)({ Origination: S.optional(Origination) }) {}
export class StreamingNotificationTarget extends S.Class<StreamingNotificationTarget>(
  "StreamingNotificationTarget",
)({ NotificationTarget: S.optional(S.String) }) {}
export const StreamingNotificationTargetList = S.Array(
  StreamingNotificationTarget,
);
export class MediaInsightsConfiguration extends S.Class<MediaInsightsConfiguration>(
  "MediaInsightsConfiguration",
)({
  Disabled: S.optional(S.Boolean),
  ConfigurationArn: S.optional(S.String),
}) {}
export class StreamingConfiguration extends S.Class<StreamingConfiguration>(
  "StreamingConfiguration",
)({
  DataRetentionInHours: S.Number,
  Disabled: S.Boolean,
  StreamingNotificationTargets: S.optional(StreamingNotificationTargetList),
  MediaInsightsConfiguration: S.optional(MediaInsightsConfiguration),
}) {}
export class GetVoiceConnectorStreamingConfigurationResponse extends S.Class<GetVoiceConnectorStreamingConfigurationResponse>(
  "GetVoiceConnectorStreamingConfigurationResponse",
)({ StreamingConfiguration: S.optional(StreamingConfiguration) }) {}
export class GetVoiceConnectorTerminationResponse extends S.Class<GetVoiceConnectorTerminationResponse>(
  "GetVoiceConnectorTerminationResponse",
)({ Termination: S.optional(Termination) }) {}
export class VoiceProfile extends S.Class<VoiceProfile>("VoiceProfile")({
  VoiceProfileId: S.optional(S.String),
  VoiceProfileArn: S.optional(S.String),
  VoiceProfileDomainId: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ExpirationTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class GetVoiceProfileResponse extends S.Class<GetVoiceProfileResponse>(
  "GetVoiceProfileResponse",
)({ VoiceProfile: S.optional(VoiceProfile) }) {}
export class ListPhoneNumberOrdersResponse extends S.Class<ListPhoneNumberOrdersResponse>(
  "ListPhoneNumberOrdersResponse",
)({
  PhoneNumberOrders: S.optional(PhoneNumberOrderList),
  NextToken: S.optional(S.String),
}) {}
export class ListPhoneNumbersResponse extends S.Class<ListPhoneNumbersResponse>(
  "ListPhoneNumbersResponse",
)({
  PhoneNumbers: S.optional(PhoneNumberList),
  NextToken: S.optional(S.String),
}) {}
export class ListProxySessionsResponse extends S.Class<ListProxySessionsResponse>(
  "ListProxySessionsResponse",
)({
  ProxySessions: S.optional(ProxySessions),
  NextToken: S.optional(S.String),
}) {}
export class ListSipMediaApplicationsResponse extends S.Class<ListSipMediaApplicationsResponse>(
  "ListSipMediaApplicationsResponse",
)({
  SipMediaApplications: S.optional(SipMediaApplicationList),
  NextToken: S.optional(S.String),
}) {}
export class ListSipRulesResponse extends S.Class<ListSipRulesResponse>(
  "ListSipRulesResponse",
)({ SipRules: S.optional(SipRuleList), NextToken: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class ListVoiceConnectorGroupsResponse extends S.Class<ListVoiceConnectorGroupsResponse>(
  "ListVoiceConnectorGroupsResponse",
)({
  VoiceConnectorGroups: S.optional(VoiceConnectorGroupList),
  NextToken: S.optional(S.String),
}) {}
export class ListVoiceConnectorsResponse extends S.Class<ListVoiceConnectorsResponse>(
  "ListVoiceConnectorsResponse",
)({
  VoiceConnectors: S.optional(VoiceConnectorList),
  NextToken: S.optional(S.String),
}) {}
export class ListVoiceConnectorTerminationCredentialsResponse extends S.Class<ListVoiceConnectorTerminationCredentialsResponse>(
  "ListVoiceConnectorTerminationCredentialsResponse",
)({ Usernames: S.optional(SensitiveStringList) }) {}
export class PutSipMediaApplicationAlexaSkillConfigurationRequest extends S.Class<PutSipMediaApplicationAlexaSkillConfigurationRequest>(
  "PutSipMediaApplicationAlexaSkillConfigurationRequest",
)(
  {
    SipMediaApplicationId: S.String.pipe(T.HttpLabel("SipMediaApplicationId")),
    SipMediaApplicationAlexaSkillConfiguration: S.optional(
      SipMediaApplicationAlexaSkillConfiguration,
    ),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/sip-media-applications/{SipMediaApplicationId}/alexa-skill-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutSipMediaApplicationLoggingConfigurationRequest extends S.Class<PutSipMediaApplicationLoggingConfigurationRequest>(
  "PutSipMediaApplicationLoggingConfigurationRequest",
)(
  {
    SipMediaApplicationId: S.String.pipe(T.HttpLabel("SipMediaApplicationId")),
    SipMediaApplicationLoggingConfiguration: S.optional(
      SipMediaApplicationLoggingConfiguration,
    ),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/sip-media-applications/{SipMediaApplicationId}/logging-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExternalSystemsConfiguration extends S.Class<ExternalSystemsConfiguration>(
  "ExternalSystemsConfiguration",
)({
  SessionBorderControllerTypes: S.optional(SessionBorderControllerTypeList),
  ContactCenterSystemTypes: S.optional(ContactCenterSystemTypeList),
}) {}
export class PutVoiceConnectorExternalSystemsConfigurationResponse extends S.Class<PutVoiceConnectorExternalSystemsConfigurationResponse>(
  "PutVoiceConnectorExternalSystemsConfigurationResponse",
)({ ExternalSystemsConfiguration: S.optional(ExternalSystemsConfiguration) }) {}
export class PutVoiceConnectorLoggingConfigurationRequest extends S.Class<PutVoiceConnectorLoggingConfigurationRequest>(
  "PutVoiceConnectorLoggingConfigurationRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    LoggingConfiguration: LoggingConfiguration,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/voice-connectors/{VoiceConnectorId}/logging-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Proxy extends S.Class<Proxy>("Proxy")({
  DefaultSessionExpiryMinutes: S.optional(S.Number),
  Disabled: S.optional(S.Boolean),
  FallBackPhoneNumber: S.optional(S.String),
  PhoneNumberCountries: S.optional(StringList),
}) {}
export class PutVoiceConnectorProxyResponse extends S.Class<PutVoiceConnectorProxyResponse>(
  "PutVoiceConnectorProxyResponse",
)({ Proxy: S.optional(Proxy) }) {}
export class PutVoiceConnectorTerminationRequest extends S.Class<PutVoiceConnectorTerminationRequest>(
  "PutVoiceConnectorTerminationRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    Termination: Termination,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/voice-connectors/{VoiceConnectorId}/termination",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutVoiceConnectorTerminationCredentialsRequest extends S.Class<PutVoiceConnectorTerminationCredentialsRequest>(
  "PutVoiceConnectorTerminationCredentialsRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    Credentials: S.optional(CredentialList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/voice-connectors/{VoiceConnectorId}/termination/credentials?operation=put",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutVoiceConnectorTerminationCredentialsResponse extends S.Class<PutVoiceConnectorTerminationCredentialsResponse>(
  "PutVoiceConnectorTerminationCredentialsResponse",
)({}) {}
export class RestorePhoneNumberResponse extends S.Class<RestorePhoneNumberResponse>(
  "RestorePhoneNumberResponse",
)({ PhoneNumber: S.optional(PhoneNumber) }) {}
export class SearchAvailablePhoneNumbersResponse extends S.Class<SearchAvailablePhoneNumbersResponse>(
  "SearchAvailablePhoneNumbersResponse",
)({
  E164PhoneNumbers: S.optional(E164PhoneNumberList),
  NextToken: S.optional(S.String),
}) {}
export class CallDetails extends S.Class<CallDetails>("CallDetails")({
  VoiceConnectorId: S.optional(S.String),
  TransactionId: S.optional(S.String),
  IsCaller: S.optional(S.Boolean),
}) {}
export class SpeakerSearchResult extends S.Class<SpeakerSearchResult>(
  "SpeakerSearchResult",
)({
  ConfidenceScore: S.optional(S.Number),
  VoiceProfileId: S.optional(S.String),
}) {}
export const SpeakerSearchResultList = S.Array(SpeakerSearchResult);
export class SpeakerSearchDetails extends S.Class<SpeakerSearchDetails>(
  "SpeakerSearchDetails",
)({
  Results: S.optional(SpeakerSearchResultList),
  VoiceprintGenerationStatus: S.optional(S.String),
}) {}
export class SpeakerSearchTask extends S.Class<SpeakerSearchTask>(
  "SpeakerSearchTask",
)({
  SpeakerSearchTaskId: S.optional(S.String),
  SpeakerSearchTaskStatus: S.optional(S.String),
  CallDetails: S.optional(CallDetails),
  SpeakerSearchDetails: S.optional(SpeakerSearchDetails),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  StartedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  StatusMessage: S.optional(S.String),
}) {}
export class StartSpeakerSearchTaskResponse extends S.Class<StartSpeakerSearchTaskResponse>(
  "StartSpeakerSearchTaskResponse",
)({ SpeakerSearchTask: S.optional(SpeakerSearchTask) }) {}
export class VoiceToneAnalysisTask extends S.Class<VoiceToneAnalysisTask>(
  "VoiceToneAnalysisTask",
)({
  VoiceToneAnalysisTaskId: S.optional(S.String),
  VoiceToneAnalysisTaskStatus: S.optional(S.String),
  CallDetails: S.optional(CallDetails),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  StartedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  StatusMessage: S.optional(S.String),
}) {}
export class StartVoiceToneAnalysisTaskResponse extends S.Class<StartVoiceToneAnalysisTaskResponse>(
  "StartVoiceToneAnalysisTaskResponse",
)({ VoiceToneAnalysisTask: S.optional(VoiceToneAnalysisTask) }) {}
export class UpdatePhoneNumberResponse extends S.Class<UpdatePhoneNumberResponse>(
  "UpdatePhoneNumberResponse",
)({ PhoneNumber: S.optional(PhoneNumber) }) {}
export class UpdateProxySessionResponse extends S.Class<UpdateProxySessionResponse>(
  "UpdateProxySessionResponse",
)({ ProxySession: S.optional(ProxySession) }) {}
export class UpdateSipMediaApplicationResponse extends S.Class<UpdateSipMediaApplicationResponse>(
  "UpdateSipMediaApplicationResponse",
)({ SipMediaApplication: S.optional(SipMediaApplication) }) {}
export class UpdateSipMediaApplicationCallRequest extends S.Class<UpdateSipMediaApplicationCallRequest>(
  "UpdateSipMediaApplicationCallRequest",
)(
  {
    SipMediaApplicationId: S.String.pipe(T.HttpLabel("SipMediaApplicationId")),
    TransactionId: S.String.pipe(T.HttpLabel("TransactionId")),
    Arguments: SMAUpdateCallArgumentsMap,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/sip-media-applications/{SipMediaApplicationId}/calls/{TransactionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSipRuleResponse extends S.Class<UpdateSipRuleResponse>(
  "UpdateSipRuleResponse",
)({ SipRule: S.optional(SipRule) }) {}
export class UpdateVoiceConnectorResponse extends S.Class<UpdateVoiceConnectorResponse>(
  "UpdateVoiceConnectorResponse",
)({ VoiceConnector: S.optional(VoiceConnector) }) {}
export class UpdateVoiceConnectorGroupResponse extends S.Class<UpdateVoiceConnectorGroupResponse>(
  "UpdateVoiceConnectorGroupResponse",
)({ VoiceConnectorGroup: S.optional(VoiceConnectorGroup) }) {}
export class UpdateVoiceProfileResponse extends S.Class<UpdateVoiceProfileResponse>(
  "UpdateVoiceProfileResponse",
)({ VoiceProfile: S.optional(VoiceProfile) }) {}
export class VoiceProfileDomain extends S.Class<VoiceProfileDomain>(
  "VoiceProfileDomain",
)({
  VoiceProfileDomainId: S.optional(S.String),
  VoiceProfileDomainArn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  ServerSideEncryptionConfiguration: S.optional(
    ServerSideEncryptionConfiguration,
  ),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UpdateVoiceProfileDomainResponse extends S.Class<UpdateVoiceProfileDomainResponse>(
  "UpdateVoiceProfileDomainResponse",
)({ VoiceProfileDomain: S.optional(VoiceProfileDomain) }) {}
export const PhoneNumberTypeList = S.Array(S.String);
export class TerminationHealth extends S.Class<TerminationHealth>(
  "TerminationHealth",
)({
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Source: S.optional(S.String),
}) {}
export class PhoneNumberCountry extends S.Class<PhoneNumberCountry>(
  "PhoneNumberCountry",
)({
  CountryCode: S.optional(S.String),
  SupportedPhoneNumberTypes: S.optional(PhoneNumberTypeList),
}) {}
export const PhoneNumberCountriesList = S.Array(PhoneNumberCountry);
export class VoiceProfileDomainSummary extends S.Class<VoiceProfileDomainSummary>(
  "VoiceProfileDomainSummary",
)({
  VoiceProfileDomainId: S.optional(S.String),
  VoiceProfileDomainArn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const VoiceProfileDomainSummaryList = S.Array(VoiceProfileDomainSummary);
export class VoiceProfileSummary extends S.Class<VoiceProfileSummary>(
  "VoiceProfileSummary",
)({
  VoiceProfileId: S.optional(S.String),
  VoiceProfileArn: S.optional(S.String),
  VoiceProfileDomainId: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ExpirationTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const VoiceProfileSummaryList = S.Array(VoiceProfileSummary);
export class Address extends S.Class<Address>("Address")({
  streetName: S.optional(S.String),
  streetSuffix: S.optional(S.String),
  postDirectional: S.optional(S.String),
  preDirectional: S.optional(S.String),
  streetNumber: S.optional(S.String),
  city: S.optional(S.String),
  state: S.optional(S.String),
  postalCode: S.optional(S.String),
  postalCodePlus4: S.optional(S.String),
  country: S.optional(S.String),
}) {}
export class CandidateAddress extends S.Class<CandidateAddress>(
  "CandidateAddress",
)({
  streetInfo: S.optional(S.String),
  streetNumber: S.optional(S.String),
  city: S.optional(S.String),
  state: S.optional(S.String),
  postalCode: S.optional(S.String),
  postalCodePlus4: S.optional(S.String),
  country: S.optional(S.String),
}) {}
export const CandidateAddressList = S.Array(
  CandidateAddress.pipe(T.XmlName("CandidateAddress")),
);
export class AssociatePhoneNumbersWithVoiceConnectorResponse extends S.Class<AssociatePhoneNumbersWithVoiceConnectorResponse>(
  "AssociatePhoneNumbersWithVoiceConnectorResponse",
)({ PhoneNumberErrors: S.optional(PhoneNumberErrorList) }) {}
export class BatchUpdatePhoneNumberResponse extends S.Class<BatchUpdatePhoneNumberResponse>(
  "BatchUpdatePhoneNumberResponse",
)({ PhoneNumberErrors: S.optional(PhoneNumberErrorList) }) {}
export class CreateProxySessionResponse extends S.Class<CreateProxySessionResponse>(
  "CreateProxySessionResponse",
)({ ProxySession: S.optional(ProxySession) }) {}
export class CreateSipMediaApplicationResponse extends S.Class<CreateSipMediaApplicationResponse>(
  "CreateSipMediaApplicationResponse",
)({ SipMediaApplication: S.optional(SipMediaApplication) }) {}
export class CreateSipRuleResponse extends S.Class<CreateSipRuleResponse>(
  "CreateSipRuleResponse",
)({ SipRule: S.optional(SipRule) }) {}
export class CreateVoiceConnectorResponse extends S.Class<CreateVoiceConnectorResponse>(
  "CreateVoiceConnectorResponse",
)({ VoiceConnector: S.optional(VoiceConnector) }) {}
export class CreateVoiceConnectorGroupResponse extends S.Class<CreateVoiceConnectorGroupResponse>(
  "CreateVoiceConnectorGroupResponse",
)({ VoiceConnectorGroup: S.optional(VoiceConnectorGroup) }) {}
export class CreateVoiceProfileResponse extends S.Class<CreateVoiceProfileResponse>(
  "CreateVoiceProfileResponse",
)({ VoiceProfile: S.optional(VoiceProfile) }) {}
export class CreateVoiceProfileDomainResponse extends S.Class<CreateVoiceProfileDomainResponse>(
  "CreateVoiceProfileDomainResponse",
)({ VoiceProfileDomain: S.optional(VoiceProfileDomain) }) {}
export class GetSipMediaApplicationResponse extends S.Class<GetSipMediaApplicationResponse>(
  "GetSipMediaApplicationResponse",
)({ SipMediaApplication: S.optional(SipMediaApplication) }) {}
export class GetSipRuleResponse extends S.Class<GetSipRuleResponse>(
  "GetSipRuleResponse",
)({ SipRule: S.optional(SipRule) }) {}
export class GetVoiceConnectorExternalSystemsConfigurationResponse extends S.Class<GetVoiceConnectorExternalSystemsConfigurationResponse>(
  "GetVoiceConnectorExternalSystemsConfigurationResponse",
)({ ExternalSystemsConfiguration: S.optional(ExternalSystemsConfiguration) }) {}
export class GetVoiceConnectorGroupResponse extends S.Class<GetVoiceConnectorGroupResponse>(
  "GetVoiceConnectorGroupResponse",
)({ VoiceConnectorGroup: S.optional(VoiceConnectorGroup) }) {}
export class GetVoiceConnectorProxyResponse extends S.Class<GetVoiceConnectorProxyResponse>(
  "GetVoiceConnectorProxyResponse",
)({ Proxy: S.optional(Proxy) }) {}
export class GetVoiceConnectorTerminationHealthResponse extends S.Class<GetVoiceConnectorTerminationHealthResponse>(
  "GetVoiceConnectorTerminationHealthResponse",
)({ TerminationHealth: S.optional(TerminationHealth) }) {}
export class GetVoiceProfileDomainResponse extends S.Class<GetVoiceProfileDomainResponse>(
  "GetVoiceProfileDomainResponse",
)({ VoiceProfileDomain: S.optional(VoiceProfileDomain) }) {}
export class GetVoiceToneAnalysisTaskResponse extends S.Class<GetVoiceToneAnalysisTaskResponse>(
  "GetVoiceToneAnalysisTaskResponse",
)({ VoiceToneAnalysisTask: S.optional(VoiceToneAnalysisTask) }) {}
export class ListSupportedPhoneNumberCountriesResponse extends S.Class<ListSupportedPhoneNumberCountriesResponse>(
  "ListSupportedPhoneNumberCountriesResponse",
)({ PhoneNumberCountries: S.optional(PhoneNumberCountriesList) }) {}
export class ListVoiceProfileDomainsResponse extends S.Class<ListVoiceProfileDomainsResponse>(
  "ListVoiceProfileDomainsResponse",
)({
  VoiceProfileDomains: S.optional(VoiceProfileDomainSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListVoiceProfilesResponse extends S.Class<ListVoiceProfilesResponse>(
  "ListVoiceProfilesResponse",
)({
  VoiceProfiles: S.optional(VoiceProfileSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class PutSipMediaApplicationAlexaSkillConfigurationResponse extends S.Class<PutSipMediaApplicationAlexaSkillConfigurationResponse>(
  "PutSipMediaApplicationAlexaSkillConfigurationResponse",
)({
  SipMediaApplicationAlexaSkillConfiguration: S.optional(
    SipMediaApplicationAlexaSkillConfiguration,
  ),
}) {}
export class PutSipMediaApplicationLoggingConfigurationResponse extends S.Class<PutSipMediaApplicationLoggingConfigurationResponse>(
  "PutSipMediaApplicationLoggingConfigurationResponse",
)({
  SipMediaApplicationLoggingConfiguration: S.optional(
    SipMediaApplicationLoggingConfiguration,
  ),
}) {}
export class PutVoiceConnectorEmergencyCallingConfigurationRequest extends S.Class<PutVoiceConnectorEmergencyCallingConfigurationRequest>(
  "PutVoiceConnectorEmergencyCallingConfigurationRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    EmergencyCallingConfiguration: EmergencyCallingConfiguration,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/voice-connectors/{VoiceConnectorId}/emergency-calling-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutVoiceConnectorLoggingConfigurationResponse extends S.Class<PutVoiceConnectorLoggingConfigurationResponse>(
  "PutVoiceConnectorLoggingConfigurationResponse",
)({ LoggingConfiguration: S.optional(LoggingConfiguration) }) {}
export class PutVoiceConnectorOriginationRequest extends S.Class<PutVoiceConnectorOriginationRequest>(
  "PutVoiceConnectorOriginationRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    Origination: Origination,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/voice-connectors/{VoiceConnectorId}/origination",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutVoiceConnectorStreamingConfigurationRequest extends S.Class<PutVoiceConnectorStreamingConfigurationRequest>(
  "PutVoiceConnectorStreamingConfigurationRequest",
)(
  {
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    StreamingConfiguration: StreamingConfiguration,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/voice-connectors/{VoiceConnectorId}/streaming-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutVoiceConnectorTerminationResponse extends S.Class<PutVoiceConnectorTerminationResponse>(
  "PutVoiceConnectorTerminationResponse",
)({ Termination: S.optional(Termination) }) {}
export class SipMediaApplicationCall extends S.Class<SipMediaApplicationCall>(
  "SipMediaApplicationCall",
)({ TransactionId: S.optional(S.String) }) {}
export class UpdateSipMediaApplicationCallResponse extends S.Class<UpdateSipMediaApplicationCallResponse>(
  "UpdateSipMediaApplicationCallResponse",
)({ SipMediaApplicationCall: S.optional(SipMediaApplicationCall) }) {}
export class ValidateE911AddressResponse extends S.Class<ValidateE911AddressResponse>(
  "ValidateE911AddressResponse",
)({
  ValidationResult: S.optional(S.Number),
  AddressExternalId: S.optional(S.String),
  Address: S.optional(Address),
  CandidateAddressList: S.optional(CandidateAddressList),
}) {}
export class CreatePhoneNumberOrderResponse extends S.Class<CreatePhoneNumberOrderResponse>(
  "CreatePhoneNumberOrderResponse",
)({ PhoneNumberOrder: S.optional(PhoneNumberOrder) }) {}
export class CreateSipMediaApplicationCallResponse extends S.Class<CreateSipMediaApplicationCallResponse>(
  "CreateSipMediaApplicationCallResponse",
)({ SipMediaApplicationCall: S.optional(SipMediaApplicationCall) }) {}
export class GetPhoneNumberResponse extends S.Class<GetPhoneNumberResponse>(
  "GetPhoneNumberResponse",
)({ PhoneNumber: S.optional(PhoneNumber) }) {}
export class GetProxySessionResponse extends S.Class<GetProxySessionResponse>(
  "GetProxySessionResponse",
)({ ProxySession: S.optional(ProxySession) }) {}
export class PutVoiceConnectorEmergencyCallingConfigurationResponse extends S.Class<PutVoiceConnectorEmergencyCallingConfigurationResponse>(
  "PutVoiceConnectorEmergencyCallingConfigurationResponse",
)({
  EmergencyCallingConfiguration: S.optional(EmergencyCallingConfiguration),
}) {}
export class PutVoiceConnectorOriginationResponse extends S.Class<PutVoiceConnectorOriginationResponse>(
  "PutVoiceConnectorOriginationResponse",
)({ Origination: S.optional(Origination) }) {}
export class PutVoiceConnectorStreamingConfigurationResponse extends S.Class<PutVoiceConnectorStreamingConfigurationResponse>(
  "PutVoiceConnectorStreamingConfigurationResponse",
)({ StreamingConfiguration: S.optional(StreamingConfiguration) }) {}
export class GetSpeakerSearchTaskResponse extends S.Class<GetSpeakerSearchTaskResponse>(
  "GetSpeakerSearchTaskResponse",
)({ SpeakerSearchTask: S.optional(SpeakerSearchTask) }) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class ServiceFailureException extends S.TaggedError<ServiceFailureException>()(
  "ServiceFailureException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class GoneException extends S.TaggedError<GoneException>()(
  "GoneException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ThrottledClientException extends S.TaggedError<ThrottledClientException>()(
  "ThrottledClientException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class UnauthorizedClientException extends S.TaggedError<UnauthorizedClientException>()(
  "UnauthorizedClientException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class UnprocessableEntityException extends S.TaggedError<UnprocessableEntityException>()(
  "UnprocessableEntityException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns a list of the tags in a given resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates a Voice Connector's emergency calling configuration.
 */
export const putVoiceConnectorEmergencyCallingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutVoiceConnectorEmergencyCallingConfigurationRequest,
    output: PutVoiceConnectorEmergencyCallingConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Updates a Voice Connector's origination settings.
 */
export const putVoiceConnectorOrigination =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutVoiceConnectorOriginationRequest,
    output: PutVoiceConnectorOriginationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Updates a Voice Connector's streaming configuration settings.
 */
export const putVoiceConnectorStreamingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutVoiceConnectorStreamingConfigurationRequest,
    output: PutVoiceConnectorStreamingConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Creates an Amazon Chime SDK Voice Connector. For more information about
 * Voice Connectors,
 * see Managing Amazon Chime SDK Voice Connector groups in the Amazon Chime SDK
 * Administrator Guide.
 */
export const createVoiceConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateVoiceConnectorRequest,
    output: CreateVoiceConnectorResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Deletes a voice profile, including its voice print and enrollment data. WARNING: This action is not reversible.
 */
export const deleteVoiceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVoiceProfileRequest,
  output: DeleteVoiceProfileResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Retrieves the information for a SIP media application, including name,
 * AWS Region, and endpoints.
 */
export const getSipMediaApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSipMediaApplicationRequest,
    output: GetSipMediaApplicationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Retrieves the details of a SIP rule, such as the rule ID, name, triggers, and
 * target endpoints.
 */
export const getSipRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSipRuleRequest,
  output: GetSipRuleResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Gets information about an external systems configuration for a Voice
 * Connector.
 */
export const getVoiceConnectorExternalSystemsConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetVoiceConnectorExternalSystemsConfigurationRequest,
    output: GetVoiceConnectorExternalSystemsConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Retrieves details for the specified Amazon Chime SDK Voice Connector group,
 * such as timestamps,name, and associated `VoiceConnectorItems`.
 */
export const getVoiceConnectorGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetVoiceConnectorGroupRequest,
    output: GetVoiceConnectorGroupResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Retrieves the proxy configuration details for the specified Amazon Chime SDK Voice
 * Connector.
 */
export const getVoiceConnectorProxy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetVoiceConnectorProxyRequest,
    output: GetVoiceConnectorProxyResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Retrieves information about the last time a `SIP OPTIONS` ping
 * was received from your SIP infrastructure for the specified Amazon Chime SDK Voice
 * Connector.
 */
export const getVoiceConnectorTerminationHealth =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetVoiceConnectorTerminationHealthRequest,
    output: GetVoiceConnectorTerminationHealthResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Retrieves the details of the specified voice profile domain.
 */
export const getVoiceProfileDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetVoiceProfileDomainRequest,
    output: GetVoiceProfileDomainResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Retrieves the details of a voice tone analysis task.
 */
export const getVoiceToneAnalysisTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetVoiceToneAnalysisTaskRequest,
    output: GetVoiceToneAnalysisTaskResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Lists the specified voice profile domains in the administrator's AWS account.
 */
export const listVoiceProfileDomains =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListVoiceProfileDomainsRequest,
    output: ListVoiceProfileDomainsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the voice profiles in a voice profile domain.
 */
export const listVoiceProfiles = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListVoiceProfilesRequest,
    output: ListVoiceProfilesResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Updates the Alexa Skill configuration for the SIP media application.
 *
 * Due to changes made by the Amazon Alexa service, this API is no longer available for use. For more information, refer to
 * the Alexa Smart Properties page.
 */
export const putSipMediaApplicationAlexaSkillConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutSipMediaApplicationAlexaSkillConfigurationRequest,
    output: PutSipMediaApplicationAlexaSkillConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Updates the logging configuration for the specified SIP media application.
 */
export const putSipMediaApplicationLoggingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutSipMediaApplicationLoggingConfigurationRequest,
    output: PutSipMediaApplicationLoggingConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Updates a Voice Connector's logging configuration.
 */
export const putVoiceConnectorLoggingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutVoiceConnectorLoggingConfigurationRequest,
    output: PutVoiceConnectorLoggingConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Updates a Voice Connector's termination settings.
 */
export const putVoiceConnectorTermination =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutVoiceConnectorTerminationRequest,
    output: PutVoiceConnectorTerminationResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Invokes the AWS Lambda function associated with the SIP media application and
 * transaction ID in an update request. The Lambda function can then return a new set
 * of actions.
 */
export const updateSipMediaApplicationCall =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateSipMediaApplicationCallRequest,
    output: UpdateSipMediaApplicationCallResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Validates an address to be used for 911 calls made with Amazon Chime SDK Voice
 * Connectors. You can use validated addresses in a Presence Information Data Format
 * Location Object file that you include in SIP requests. That helps ensure that addresses
 * are routed to the appropriate Public Safety Answering Point.
 */
export const validateE911Address = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ValidateE911AddressRequest,
  output: ValidateE911AddressResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Disassociates the specified phone numbers from the specified
 * Amazon Chime SDK Voice Connector.
 */
export const disassociatePhoneNumbersFromVoiceConnector =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociatePhoneNumbersFromVoiceConnectorRequest,
    output: DisassociatePhoneNumbersFromVoiceConnectorResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Disassociates the specified phone numbers from the specified Amazon Chime SDK Voice
 * Connector group.
 */
export const disassociatePhoneNumbersFromVoiceConnectorGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociatePhoneNumbersFromVoiceConnectorGroupRequest,
    output: DisassociatePhoneNumbersFromVoiceConnectorGroupResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Retrieves details for the specified phone number order, such as the order
 * creation timestamp, phone numbers in E.164 format, product type, and
 * order status.
 */
export const getPhoneNumberOrder = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPhoneNumberOrderRequest,
  output: GetPhoneNumberOrderResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Gets the Alexa Skill configuration for the SIP media application.
 *
 * Due to changes made by the Amazon Alexa service, this API is no longer available for use. For more information, refer to
 * the Alexa Smart Properties page.
 */
export const getSipMediaApplicationAlexaSkillConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetSipMediaApplicationAlexaSkillConfigurationRequest,
    output: GetSipMediaApplicationAlexaSkillConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Retrieves the logging configuration for the specified SIP media application.
 */
export const getSipMediaApplicationLoggingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetSipMediaApplicationLoggingConfigurationRequest,
    output: GetSipMediaApplicationLoggingConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Retrieves details for the specified Amazon Chime SDK Voice Connector, such as
 * timestamps,name, outbound host, and encryption requirements.
 */
export const getVoiceConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVoiceConnectorRequest,
  output: GetVoiceConnectorResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Retrieves the emergency calling configuration details for the specified Voice Connector.
 */
export const getVoiceConnectorEmergencyCallingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetVoiceConnectorEmergencyCallingConfigurationRequest,
    output: GetVoiceConnectorEmergencyCallingConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Retrieves the logging configuration settings for the specified Voice Connector.
 * Shows whether SIP message logs are enabled for sending to Amazon CloudWatch Logs.
 */
export const getVoiceConnectorLoggingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetVoiceConnectorLoggingConfigurationRequest,
    output: GetVoiceConnectorLoggingConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Retrieves the origination settings for the specified Voice Connector.
 */
export const getVoiceConnectorOrigination =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetVoiceConnectorOriginationRequest,
    output: GetVoiceConnectorOriginationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Retrieves the streaming configuration details for the specified Amazon Chime SDK
 * Voice Connector. Shows whether media streaming is enabled for sending to Amazon
 * Kinesis. It also shows the retention period, in hours, for the Amazon Kinesis data.
 */
export const getVoiceConnectorStreamingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetVoiceConnectorStreamingConfigurationRequest,
    output: GetVoiceConnectorStreamingConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Retrieves the termination setting details for the specified Voice Connector.
 */
export const getVoiceConnectorTermination =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetVoiceConnectorTerminationRequest,
    output: GetVoiceConnectorTerminationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Retrieves the details of the specified voice profile.
 */
export const getVoiceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVoiceProfileRequest,
  output: GetVoiceProfileResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Lists the phone numbers for the specified Amazon Chime SDK account,
 * Amazon Chime SDK user, Amazon Chime SDK Voice Connector, or Amazon Chime SDK Voice
 * Connector group.
 */
export const listPhoneNumbers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPhoneNumbersRequest,
    output: ListPhoneNumbersResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the proxy sessions for the specified Amazon Chime SDK Voice Connector.
 */
export const listProxySessions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListProxySessionsRequest,
    output: ListProxySessionsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the SIP credentials for the specified Amazon Chime SDK Voice Connector.
 */
export const listVoiceConnectorTerminationCredentials =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListVoiceConnectorTerminationCredentialsRequest,
    output: ListVoiceConnectorTerminationCredentialsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Puts the specified proxy configuration to the specified Amazon Chime SDK Voice Connector.
 */
export const putVoiceConnectorProxy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutVoiceConnectorProxyRequest,
    output: PutVoiceConnectorProxyResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Updates a Voice Connector's termination credentials.
 */
export const putVoiceConnectorTerminationCredentials =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutVoiceConnectorTerminationCredentialsRequest,
    output: PutVoiceConnectorTerminationCredentialsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Restores a deleted phone number.
 */
export const restorePhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestorePhoneNumberRequest,
  output: RestorePhoneNumberResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates the specified proxy session details, such as voice or SMS capabilities.
 */
export const updateProxySession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProxySessionRequest,
  output: UpdateProxySessionResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates the details for the specified Amazon Chime SDK Voice Connector.
 */
export const updateVoiceConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateVoiceConnectorRequest,
    output: UpdateVoiceConnectorResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Updates the settings for the specified voice profile domain.
 */
export const updateVoiceProfileDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateVoiceProfileDomainRequest,
    output: UpdateVoiceProfileDomainResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Deletes the specified proxy session from the specified Amazon Chime SDK Voice
 * Connector.
 */
export const deleteProxySession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProxySessionRequest,
  output: DeleteProxySessionResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Deletes the emergency calling details from the specified Amazon Chime SDK Voice
 * Connector.
 */
export const deleteVoiceConnectorEmergencyCallingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteVoiceConnectorEmergencyCallingConfigurationRequest,
    output: DeleteVoiceConnectorEmergencyCallingConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Deletes the external systems configuration for a Voice Connector.
 */
export const deleteVoiceConnectorExternalSystemsConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteVoiceConnectorExternalSystemsConfigurationRequest,
    output: DeleteVoiceConnectorExternalSystemsConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Deletes the origination settings for the specified Amazon Chime SDK Voice Connector.
 *
 * If emergency calling is configured for the Voice Connector, it must be
 * deleted prior to deleting the origination settings.
 */
export const deleteVoiceConnectorOrigination =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteVoiceConnectorOriginationRequest,
    output: DeleteVoiceConnectorOriginationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Deletes the proxy configuration from the specified Amazon Chime SDK Voice Connector.
 */
export const deleteVoiceConnectorProxy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteVoiceConnectorProxyRequest,
    output: DeleteVoiceConnectorProxyResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Deletes a Voice Connector's streaming configuration.
 */
export const deleteVoiceConnectorStreamingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteVoiceConnectorStreamingConfigurationRequest,
    output: DeleteVoiceConnectorStreamingConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Deletes the termination settings for the specified Amazon Chime SDK Voice Connector.
 *
 * If emergency calling is configured for the Voice Connector, it must be
 * deleted prior to deleting the termination settings.
 */
export const deleteVoiceConnectorTermination =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteVoiceConnectorTerminationRequest,
    output: DeleteVoiceConnectorTerminationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Deletes the specified SIP credentials used by your equipment to
 * authenticate during call termination.
 */
export const deleteVoiceConnectorTerminationCredentials =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteVoiceConnectorTerminationCredentialsRequest,
    output: DeleteVoiceConnectorTerminationCredentialsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Moves phone numbers into the
 * **Deletion queue**. Phone numbers must be disassociated from any users or Amazon Chime SDK Voice Connectors before they can be deleted.
 *
 * Phone numbers remain in the
 * **Deletion queue** for 7 days before they are deleted permanently.
 */
export const batchDeletePhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDeletePhoneNumberRequest,
    output: BatchDeletePhoneNumberResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Associates phone numbers with the specified Amazon Chime SDK Voice Connector group.
 */
export const associatePhoneNumbersWithVoiceConnectorGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociatePhoneNumbersWithVoiceConnectorGroupRequest,
    output: AssociatePhoneNumbersWithVoiceConnectorGroupResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Associates phone numbers with the specified Amazon Chime SDK Voice Connector.
 */
export const associatePhoneNumbersWithVoiceConnector =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociatePhoneNumbersWithVoiceConnectorRequest,
    output: AssociatePhoneNumbersWithVoiceConnectorResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Updates phone number product types, calling names, or phone number names. You can update one attribute at a time for each
 * `UpdatePhoneNumberRequestItem`. For example, you can update the product type, the calling name, or phone name.
 *
 * You cannot have a duplicate `phoneNumberId` in a request.
 */
export const batchUpdatePhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchUpdatePhoneNumberRequest,
    output: BatchUpdatePhoneNumberResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Creates a proxy session for the specified Amazon Chime SDK Voice Connector for
 * the specified participant phone numbers.
 */
export const createProxySession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProxySessionRequest,
  output: CreateProxySessionResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Adds an external systems configuration to a Voice Connector.
 */
export const putVoiceConnectorExternalSystemsConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutVoiceConnectorExternalSystemsConfigurationRequest,
    output: PutVoiceConnectorExternalSystemsConfigurationResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Updates phone number details, such as product type, calling name, or phone number name for the
 * specified phone number ID. You can update one phone number detail at a time. For
 * example, you can update either the product type, calling name, or phone number name in one action.
 *
 * For numbers outside the U.S., you must use the Amazon Chime SDK SIP Media
 * Application Dial-In product type.
 *
 * Updates to outbound calling names can take 72 hours to complete. Pending
 * updates to outbound calling names must be complete before you can request another
 * update.
 */
export const updatePhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePhoneNumberRequest,
  output: UpdatePhoneNumberResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates the details of the specified SIP media application.
 */
export const updateSipMediaApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSipMediaApplicationRequest,
    output: UpdateSipMediaApplicationResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Updates the details of the specified SIP rule.
 */
export const updateSipRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSipRuleRequest,
  output: UpdateSipRuleResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates the settings for the specified Amazon Chime SDK Voice Connector group.
 */
export const updateVoiceConnectorGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateVoiceConnectorGroupRequest,
    output: UpdateVoiceConnectorGroupResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Deletes a SIP media application.
 */
export const deleteSipMediaApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSipMediaApplicationRequest,
    output: DeleteSipMediaApplicationResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Deletes a SIP rule.
 */
export const deleteSipRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSipRuleRequest,
  output: DeleteSipRuleResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Deletes an Amazon Chime SDK Voice Connector. Any phone numbers associated
 * with the Amazon Chime SDK Voice Connector must be disassociated from it before it
 * can be deleted.
 */
export const deleteVoiceConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteVoiceConnectorRequest,
    output: DeleteVoiceConnectorResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Deletes an Amazon Chime SDK Voice Connector group. Any `VoiceConnectorItems`
 * and phone numbers associated with the group must be removed before it can be
 * deleted.
 */
export const deleteVoiceConnectorGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteVoiceConnectorGroupRequest,
    output: DeleteVoiceConnectorGroupResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Deletes all voice profiles in the domain. WARNING: This action is not reversible.
 */
export const deleteVoiceProfileDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteVoiceProfileDomainRequest,
    output: DeleteVoiceProfileDomainResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Retrieves the global settings for the Amazon Chime SDK Voice Connectors in an AWS account.
 */
export const getGlobalSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGlobalSettingsRequest,
  output: GetGlobalSettingsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Lists the phone numbers for an administrator's Amazon Chime SDK account.
 */
export const listPhoneNumberOrders =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPhoneNumberOrdersRequest,
    output: ListPhoneNumberOrdersResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the SIP media applications under the administrator's AWS account.
 */
export const listSipMediaApplications =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSipMediaApplicationsRequest,
    output: ListSipMediaApplicationsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "SipMediaApplications",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the SIP rules under the administrator's AWS account.
 */
export const listSipRules = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSipRulesRequest,
    output: ListSipRulesResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "SipRules",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the Amazon Chime SDK Voice Connector groups in the administrator's AWS
 * account.
 */
export const listVoiceConnectorGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListVoiceConnectorGroupsRequest,
    output: ListVoiceConnectorGroupsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the Amazon Chime SDK Voice Connectors in the administrators
 * AWS account.
 */
export const listVoiceConnectors =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListVoiceConnectorsRequest,
    output: ListVoiceConnectorsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Searches the provisioned phone numbers in an organization.
 */
export const searchAvailablePhoneNumbers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: SearchAvailablePhoneNumbersRequest,
    output: SearchAvailablePhoneNumbersResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves the phone number settings for the administrator's AWS account,
 * such as the default outbound calling name.
 */
export const getPhoneNumberSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPhoneNumberSettingsRequest,
    output: GetPhoneNumberSettingsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Lists the available AWS Regions in which you can create an Amazon Chime SDK Voice Connector.
 */
export const listAvailableVoiceConnectorRegions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAvailableVoiceConnectorRegionsRequest,
    output: ListAvailableVoiceConnectorRegionsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Updates global settings for the Amazon Chime SDK Voice Connectors in an AWS account.
 */
export const updateGlobalSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateGlobalSettingsRequest,
    output: UpdateGlobalSettingsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Updates the phone number settings for the administrator's AWS account, such
 * as the default outbound calling name. You can update the default outbound calling
 * name once every seven days. Outbound calling names can take up to 72 hours to
 * update.
 */
export const updatePhoneNumberSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdatePhoneNumberSettingsRequest,
    output: UpdatePhoneNumberSettingsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Moves the specified phone number into the
 * **Deletion queue**. A phone number must
 * be disassociated from any users or Amazon Chime SDK Voice Connectors before it can be
 * deleted.
 *
 * Deleted phone numbers remain in the
 * **Deletion queue** queue for 7 days before
 * they are deleted permanently.
 */
export const deletePhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePhoneNumberRequest,
  output: DeletePhoneNumberResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Retrieves details for the specified phone number ID, such as associations,
 * capabilities, and product type.
 */
export const getPhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPhoneNumberRequest,
  output: GetPhoneNumberResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Retrieves the specified proxy session details for the specified Amazon Chime SDK Voice Connector.
 */
export const getProxySession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProxySessionRequest,
  output: GetProxySessionResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Creates an Amazon Chime SDK Voice Connector group under the administrator's
 * AWS account. You can associate Amazon Chime SDK Voice Connectors with the
 * Voice Connector group by including `VoiceConnectorItems` in the
 * request.
 *
 * You can include Voice Connectors from different AWS Regions in your group.
 * This creates a fault tolerant mechanism for fallback in case of availability events.
 */
export const createVoiceConnectorGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateVoiceConnectorGroupRequest,
    output: CreateVoiceConnectorGroupResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Creates a SIP media application. For more information about SIP media applications, see Managing SIP media applications
 * and rules in the *Amazon Chime SDK Administrator Guide*.
 */
export const createSipMediaApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSipMediaApplicationRequest,
    output: CreateSipMediaApplicationResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Creates a SIP rule, which can be used to run a SIP media application as a target for a specific trigger type. For more information about SIP rules, see Managing SIP media applications
 * and rules in the *Amazon Chime SDK Administrator Guide*.
 */
export const createSipRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSipRuleRequest,
  output: CreateSipRuleResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Creates a voice profile domain, a collection of voice profiles, their voice prints, and encrypted enrollment audio.
 *
 * Before creating any voice profiles, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the
 * AWS service terms for the Amazon Chime SDK.
 *
 * For more information about voice profile domains, see Using Amazon Chime SDK Voice Analytics
 * in the *Amazon Chime SDK Developer Guide*.
 */
export const createVoiceProfileDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateVoiceProfileDomainRequest,
    output: CreateVoiceProfileDomainResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Creates an order for phone numbers to be provisioned. For numbers outside the U.S., you must use the Amazon Chime SDK SIP media application dial-in product type.
 */
export const createPhoneNumberOrder = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePhoneNumberOrderRequest,
    output: CreatePhoneNumberOrderResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Creates an outbound call to a phone number from the phone number specified
 * in the request, and it invokes the endpoint of the specified
 * `sipMediaApplicationId`.
 */
export const createSipMediaApplicationCall =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateSipMediaApplicationCallRequest,
    output: CreateSipMediaApplicationCallResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Updates the specified voice profile’s voice print and refreshes its expiration timestamp.
 *
 * As a condition of using this feature, you acknowledge that the collection, use, storage, and retention of
 * your caller’s biometric identifiers and biometric information (“biometric data”) in the form of a digital voiceprint
 * requires the caller’s informed consent via a written release. Such consent is required under various state laws,
 * including biometrics laws in Illinois, Texas, Washington and other state privacy laws.
 *
 * You must provide a written release to each caller through a process that clearly reflects each caller’s informed
 * consent before using Amazon Chime SDK Voice Insights service, as required under the terms of your agreement
 * with AWS governing your use of the service.
 */
export const updateVoiceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVoiceProfileRequest,
  output: UpdateVoiceProfileResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GoneException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Creates a voice profile, which consists of an enrolled user and their latest voice print.
 *
 * Before creating any voice profiles, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the
 * AWS service terms for the Amazon Chime SDK.
 *
 * For more information about voice profiles and voice analytics, see Using Amazon Chime SDK Voice Analytics
 * in the *Amazon Chime SDK Developer Guide*.
 */
export const createVoiceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVoiceProfileRequest,
  output: CreateVoiceProfileResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GoneException,
    NotFoundException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Retrieves the details of the specified speaker search task.
 */
export const getSpeakerSearchTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSpeakerSearchTaskRequest,
    output: GetSpeakerSearchTaskResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Adds a tag to the specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    UnauthorizedClientException,
  ],
}));
/**
 * Removes tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    UnauthorizedClientException,
  ],
}));
/**
 * Lists the countries that you can order phone numbers from.
 */
export const listSupportedPhoneNumberCountries =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListSupportedPhoneNumberCountriesRequest,
    output: ListSupportedPhoneNumberCountriesResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Stops a speaker search task.
 */
export const stopSpeakerSearchTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopSpeakerSearchTaskRequest,
    output: StopSpeakerSearchTaskResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
      UnprocessableEntityException,
    ],
  }),
);
/**
 * Stops a voice tone analysis task.
 */
export const stopVoiceToneAnalysisTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopVoiceToneAnalysisTaskRequest,
    output: StopVoiceToneAnalysisTaskResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
      UnprocessableEntityException,
    ],
  }),
);
/**
 * Starts a speaker search task.
 *
 * Before starting any speaker search tasks, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the
 * AWS service terms for the Amazon Chime SDK.
 */
export const startSpeakerSearchTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartSpeakerSearchTaskRequest,
    output: StartSpeakerSearchTaskResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      GoneException,
      NotFoundException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
      UnprocessableEntityException,
    ],
  }),
);
/**
 * Starts a voice tone analysis task. For more information about voice tone analysis, see
 * Using Amazon Chime SDK voice analytics
 * in the *Amazon Chime SDK Developer Guide*.
 *
 * Before starting any voice tone analysis tasks, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the
 * AWS service terms for the Amazon Chime SDK.
 */
export const startVoiceToneAnalysisTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartVoiceToneAnalysisTaskRequest,
    output: StartVoiceToneAnalysisTaskResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      GoneException,
      NotFoundException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
      UnprocessableEntityException,
    ],
  }),
);

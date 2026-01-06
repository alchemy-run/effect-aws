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

//# Newtypes
export type NonEmptyString = string;
export type E164PhoneNumber = string | Redacted.Redacted<string>;
export type PhoneNumberName = string | Redacted.Redacted<string>;
export type NonEmptyString128 = string;
export type ProxySessionNameString = string | Redacted.Redacted<string>;
export type PositiveInteger = number;
export type SipMediaApplicationName = string;
export type SipRuleName = string;
export type VoiceConnectorName = string;
export type VoiceConnectorGroupName = string;
export type NonEmptyString256 = string;
export type VoiceProfileDomainName = string;
export type VoiceProfileDomainDescription = string;
export type ClientRequestId = string;
export type SensitiveNonEmptyString = string | Redacted.Redacted<string>;
export type SensitiveString = string | Redacted.Redacted<string>;
export type GuidString = string;
export type CallingName = string | Redacted.Redacted<string>;
export type ResultMax = number;
export type NextTokenString = string;
export type Arn = string | Redacted.Redacted<string>;
export type Integer = number;
export type Country = string;
export type Alpha2CountryCode = string;
export type TollFreePrefix = string;
export type PhoneNumberMaxResults = number;
export type TagKey = string | Redacted.Redacted<string>;
export type AreaCode = string;
export type FunctionArn = string | Redacted.Redacted<string>;
export type TagValue = string | Redacted.Redacted<string>;
export type SipApplicationPriority = number;
export type VoiceConnectorItemPriority = number;
export type AlexaSkillId = string | Redacted.Redacted<string>;
export type DataRetentionInHours = number;
export type CpsLimit = number;
export type CallingRegion = string;
export type ValidationResult = number;
export type Port = number;
export type OriginationRoutePriority = number;
export type OriginationRouteWeight = number;
export type String128 = string;
export type ConfidenceScore = number;

//# Schemas
export interface GetGlobalSettingsRequest {}
export const GetGlobalSettingsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetGlobalSettingsRequest",
}) as any as S.Schema<GetGlobalSettingsRequest>;
export interface GetPhoneNumberSettingsRequest {}
export const GetPhoneNumberSettingsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPhoneNumberSettingsRequest",
}) as any as S.Schema<GetPhoneNumberSettingsRequest>;
export interface ListAvailableVoiceConnectorRegionsRequest {}
export const ListAvailableVoiceConnectorRegionsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAvailableVoiceConnectorRegionsRequest",
}) as any as S.Schema<ListAvailableVoiceConnectorRegionsRequest>;
export type E164PhoneNumberList = string | Redacted.Redacted<string>[];
export const E164PhoneNumberList = S.Array(SensitiveString);
export type NonEmptyStringList = string[];
export const NonEmptyStringList = S.Array(S.String);
export type ParticipantPhoneNumberList = string | Redacted.Redacted<string>[];
export const ParticipantPhoneNumberList = S.Array(SensitiveString);
export type CapabilityList = string[];
export const CapabilityList = S.Array(S.String);
export type SensitiveStringList = string | Redacted.Redacted<string>[];
export const SensitiveStringList = S.Array(SensitiveString);
export type VoiceConnectorAwsRegionList = string[];
export const VoiceConnectorAwsRegionList = S.Array(S.String);
export type SessionBorderControllerTypeList = string[];
export const SessionBorderControllerTypeList = S.Array(S.String);
export type ContactCenterSystemTypeList = string[];
export const ContactCenterSystemTypeList = S.Array(S.String);
export type CountryList = string[];
export const CountryList = S.Array(S.String);
export type TagKeyList = string | Redacted.Redacted<string>[];
export const TagKeyList = S.Array(SensitiveString);
export interface AssociatePhoneNumbersWithVoiceConnectorRequest {
  VoiceConnectorId: string;
  E164PhoneNumbers: E164PhoneNumberList;
  ForceAssociate?: boolean;
}
export const AssociatePhoneNumbersWithVoiceConnectorRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    E164PhoneNumbers: E164PhoneNumberList,
    ForceAssociate: S.optional(S.Boolean),
  }).pipe(
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
  ),
).annotations({
  identifier: "AssociatePhoneNumbersWithVoiceConnectorRequest",
}) as any as S.Schema<AssociatePhoneNumbersWithVoiceConnectorRequest>;
export interface AssociatePhoneNumbersWithVoiceConnectorGroupRequest {
  VoiceConnectorGroupId: string;
  E164PhoneNumbers: E164PhoneNumberList;
  ForceAssociate?: boolean;
}
export const AssociatePhoneNumbersWithVoiceConnectorGroupRequest = S.suspend(
  () =>
    S.Struct({
      VoiceConnectorGroupId: S.String.pipe(
        T.HttpLabel("VoiceConnectorGroupId"),
      ),
      E164PhoneNumbers: E164PhoneNumberList,
      ForceAssociate: S.optional(S.Boolean),
    }).pipe(
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
    ),
).annotations({
  identifier: "AssociatePhoneNumbersWithVoiceConnectorGroupRequest",
}) as any as S.Schema<AssociatePhoneNumbersWithVoiceConnectorGroupRequest>;
export interface BatchDeletePhoneNumberRequest {
  PhoneNumberIds: NonEmptyStringList;
}
export const BatchDeletePhoneNumberRequest = S.suspend(() =>
  S.Struct({ PhoneNumberIds: NonEmptyStringList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/phone-numbers?operation=batch-delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeletePhoneNumberRequest",
}) as any as S.Schema<BatchDeletePhoneNumberRequest>;
export interface CreatePhoneNumberOrderRequest {
  ProductType: string;
  E164PhoneNumbers: E164PhoneNumberList;
  Name?: string | Redacted.Redacted<string>;
}
export const CreatePhoneNumberOrderRequest = S.suspend(() =>
  S.Struct({
    ProductType: S.String,
    E164PhoneNumbers: E164PhoneNumberList,
    Name: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/phone-number-orders" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePhoneNumberOrderRequest",
}) as any as S.Schema<CreatePhoneNumberOrderRequest>;
export interface Tag {
  Key: string | Redacted.Redacted<string>;
  Value: string | Redacted.Redacted<string>;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: SensitiveString, Value: SensitiveString }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateVoiceConnectorRequest {
  Name: string;
  AwsRegion?: string;
  RequireEncryption: boolean;
  Tags?: TagList;
  IntegrationType?: string;
  NetworkType?: string;
}
export const CreateVoiceConnectorRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    AwsRegion: S.optional(S.String),
    RequireEncryption: S.Boolean,
    Tags: S.optional(TagList),
    IntegrationType: S.optional(S.String),
    NetworkType: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/voice-connectors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateVoiceConnectorRequest",
}) as any as S.Schema<CreateVoiceConnectorRequest>;
export interface CreateVoiceProfileRequest {
  SpeakerSearchTaskId: string;
}
export const CreateVoiceProfileRequest = S.suspend(() =>
  S.Struct({ SpeakerSearchTaskId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/voice-profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateVoiceProfileRequest",
}) as any as S.Schema<CreateVoiceProfileRequest>;
export interface DeletePhoneNumberRequest {
  PhoneNumberId: string | Redacted.Redacted<string>;
}
export const DeletePhoneNumberRequest = S.suspend(() =>
  S.Struct({
    PhoneNumberId: SensitiveString.pipe(T.HttpLabel("PhoneNumberId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/phone-numbers/{PhoneNumberId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePhoneNumberRequest",
}) as any as S.Schema<DeletePhoneNumberRequest>;
export interface DeletePhoneNumberResponse {}
export const DeletePhoneNumberResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePhoneNumberResponse",
}) as any as S.Schema<DeletePhoneNumberResponse>;
export interface DeleteProxySessionRequest {
  VoiceConnectorId: string;
  ProxySessionId: string;
}
export const DeleteProxySessionRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    ProxySessionId: S.String.pipe(T.HttpLabel("ProxySessionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteProxySessionRequest",
}) as any as S.Schema<DeleteProxySessionRequest>;
export interface DeleteProxySessionResponse {}
export const DeleteProxySessionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteProxySessionResponse",
}) as any as S.Schema<DeleteProxySessionResponse>;
export interface DeleteSipMediaApplicationRequest {
  SipMediaApplicationId: string;
}
export const DeleteSipMediaApplicationRequest = S.suspend(() =>
  S.Struct({
    SipMediaApplicationId: S.String.pipe(T.HttpLabel("SipMediaApplicationId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteSipMediaApplicationRequest",
}) as any as S.Schema<DeleteSipMediaApplicationRequest>;
export interface DeleteSipMediaApplicationResponse {}
export const DeleteSipMediaApplicationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSipMediaApplicationResponse",
}) as any as S.Schema<DeleteSipMediaApplicationResponse>;
export interface DeleteSipRuleRequest {
  SipRuleId: string;
}
export const DeleteSipRuleRequest = S.suspend(() =>
  S.Struct({ SipRuleId: S.String.pipe(T.HttpLabel("SipRuleId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/sip-rules/{SipRuleId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSipRuleRequest",
}) as any as S.Schema<DeleteSipRuleRequest>;
export interface DeleteSipRuleResponse {}
export const DeleteSipRuleResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteSipRuleResponse",
}) as any as S.Schema<DeleteSipRuleResponse>;
export interface DeleteVoiceConnectorRequest {
  VoiceConnectorId: string;
}
export const DeleteVoiceConnectorRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/voice-connectors/{VoiceConnectorId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVoiceConnectorRequest",
}) as any as S.Schema<DeleteVoiceConnectorRequest>;
export interface DeleteVoiceConnectorResponse {}
export const DeleteVoiceConnectorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteVoiceConnectorResponse",
}) as any as S.Schema<DeleteVoiceConnectorResponse>;
export interface DeleteVoiceConnectorEmergencyCallingConfigurationRequest {
  VoiceConnectorId: string;
}
export const DeleteVoiceConnectorEmergencyCallingConfigurationRequest =
  S.suspend(() =>
    S.Struct({
      VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    }).pipe(
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
    ),
  ).annotations({
    identifier: "DeleteVoiceConnectorEmergencyCallingConfigurationRequest",
  }) as any as S.Schema<DeleteVoiceConnectorEmergencyCallingConfigurationRequest>;
export interface DeleteVoiceConnectorEmergencyCallingConfigurationResponse {}
export const DeleteVoiceConnectorEmergencyCallingConfigurationResponse =
  S.suspend(() => S.Struct({})).annotations({
    identifier: "DeleteVoiceConnectorEmergencyCallingConfigurationResponse",
  }) as any as S.Schema<DeleteVoiceConnectorEmergencyCallingConfigurationResponse>;
export interface DeleteVoiceConnectorExternalSystemsConfigurationRequest {
  VoiceConnectorId: string;
}
export const DeleteVoiceConnectorExternalSystemsConfigurationRequest =
  S.suspend(() =>
    S.Struct({
      VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    }).pipe(
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
    ),
  ).annotations({
    identifier: "DeleteVoiceConnectorExternalSystemsConfigurationRequest",
  }) as any as S.Schema<DeleteVoiceConnectorExternalSystemsConfigurationRequest>;
export interface DeleteVoiceConnectorExternalSystemsConfigurationResponse {}
export const DeleteVoiceConnectorExternalSystemsConfigurationResponse =
  S.suspend(() => S.Struct({})).annotations({
    identifier: "DeleteVoiceConnectorExternalSystemsConfigurationResponse",
  }) as any as S.Schema<DeleteVoiceConnectorExternalSystemsConfigurationResponse>;
export interface DeleteVoiceConnectorGroupRequest {
  VoiceConnectorGroupId: string;
}
export const DeleteVoiceConnectorGroupRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorGroupId: S.String.pipe(T.HttpLabel("VoiceConnectorGroupId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteVoiceConnectorGroupRequest",
}) as any as S.Schema<DeleteVoiceConnectorGroupRequest>;
export interface DeleteVoiceConnectorGroupResponse {}
export const DeleteVoiceConnectorGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteVoiceConnectorGroupResponse",
}) as any as S.Schema<DeleteVoiceConnectorGroupResponse>;
export interface DeleteVoiceConnectorOriginationRequest {
  VoiceConnectorId: string;
}
export const DeleteVoiceConnectorOriginationRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteVoiceConnectorOriginationRequest",
}) as any as S.Schema<DeleteVoiceConnectorOriginationRequest>;
export interface DeleteVoiceConnectorOriginationResponse {}
export const DeleteVoiceConnectorOriginationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteVoiceConnectorOriginationResponse",
}) as any as S.Schema<DeleteVoiceConnectorOriginationResponse>;
export interface DeleteVoiceConnectorProxyRequest {
  VoiceConnectorId: string;
}
export const DeleteVoiceConnectorProxyRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteVoiceConnectorProxyRequest",
}) as any as S.Schema<DeleteVoiceConnectorProxyRequest>;
export interface DeleteVoiceConnectorProxyResponse {}
export const DeleteVoiceConnectorProxyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteVoiceConnectorProxyResponse",
}) as any as S.Schema<DeleteVoiceConnectorProxyResponse>;
export interface DeleteVoiceConnectorStreamingConfigurationRequest {
  VoiceConnectorId: string;
}
export const DeleteVoiceConnectorStreamingConfigurationRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteVoiceConnectorStreamingConfigurationRequest",
}) as any as S.Schema<DeleteVoiceConnectorStreamingConfigurationRequest>;
export interface DeleteVoiceConnectorStreamingConfigurationResponse {}
export const DeleteVoiceConnectorStreamingConfigurationResponse = S.suspend(
  () => S.Struct({}),
).annotations({
  identifier: "DeleteVoiceConnectorStreamingConfigurationResponse",
}) as any as S.Schema<DeleteVoiceConnectorStreamingConfigurationResponse>;
export interface DeleteVoiceConnectorTerminationRequest {
  VoiceConnectorId: string;
}
export const DeleteVoiceConnectorTerminationRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteVoiceConnectorTerminationRequest",
}) as any as S.Schema<DeleteVoiceConnectorTerminationRequest>;
export interface DeleteVoiceConnectorTerminationResponse {}
export const DeleteVoiceConnectorTerminationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteVoiceConnectorTerminationResponse",
}) as any as S.Schema<DeleteVoiceConnectorTerminationResponse>;
export interface DeleteVoiceConnectorTerminationCredentialsRequest {
  VoiceConnectorId: string;
  Usernames: SensitiveStringList;
}
export const DeleteVoiceConnectorTerminationCredentialsRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    Usernames: SensitiveStringList,
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteVoiceConnectorTerminationCredentialsRequest",
}) as any as S.Schema<DeleteVoiceConnectorTerminationCredentialsRequest>;
export interface DeleteVoiceConnectorTerminationCredentialsResponse {}
export const DeleteVoiceConnectorTerminationCredentialsResponse = S.suspend(
  () => S.Struct({}),
).annotations({
  identifier: "DeleteVoiceConnectorTerminationCredentialsResponse",
}) as any as S.Schema<DeleteVoiceConnectorTerminationCredentialsResponse>;
export interface DeleteVoiceProfileRequest {
  VoiceProfileId: string;
}
export const DeleteVoiceProfileRequest = S.suspend(() =>
  S.Struct({
    VoiceProfileId: S.String.pipe(T.HttpLabel("VoiceProfileId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/voice-profiles/{VoiceProfileId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVoiceProfileRequest",
}) as any as S.Schema<DeleteVoiceProfileRequest>;
export interface DeleteVoiceProfileResponse {}
export const DeleteVoiceProfileResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteVoiceProfileResponse",
}) as any as S.Schema<DeleteVoiceProfileResponse>;
export interface DeleteVoiceProfileDomainRequest {
  VoiceProfileDomainId: string;
}
export const DeleteVoiceProfileDomainRequest = S.suspend(() =>
  S.Struct({
    VoiceProfileDomainId: S.String.pipe(T.HttpLabel("VoiceProfileDomainId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteVoiceProfileDomainRequest",
}) as any as S.Schema<DeleteVoiceProfileDomainRequest>;
export interface DeleteVoiceProfileDomainResponse {}
export const DeleteVoiceProfileDomainResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteVoiceProfileDomainResponse",
}) as any as S.Schema<DeleteVoiceProfileDomainResponse>;
export interface DisassociatePhoneNumbersFromVoiceConnectorRequest {
  VoiceConnectorId: string;
  E164PhoneNumbers: E164PhoneNumberList;
}
export const DisassociatePhoneNumbersFromVoiceConnectorRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    E164PhoneNumbers: E164PhoneNumberList,
  }).pipe(
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
  ),
).annotations({
  identifier: "DisassociatePhoneNumbersFromVoiceConnectorRequest",
}) as any as S.Schema<DisassociatePhoneNumbersFromVoiceConnectorRequest>;
export interface DisassociatePhoneNumbersFromVoiceConnectorGroupRequest {
  VoiceConnectorGroupId: string;
  E164PhoneNumbers: E164PhoneNumberList;
}
export const DisassociatePhoneNumbersFromVoiceConnectorGroupRequest = S.suspend(
  () =>
    S.Struct({
      VoiceConnectorGroupId: S.String.pipe(
        T.HttpLabel("VoiceConnectorGroupId"),
      ),
      E164PhoneNumbers: E164PhoneNumberList,
    }).pipe(
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
    ),
).annotations({
  identifier: "DisassociatePhoneNumbersFromVoiceConnectorGroupRequest",
}) as any as S.Schema<DisassociatePhoneNumbersFromVoiceConnectorGroupRequest>;
export interface GetPhoneNumberRequest {
  PhoneNumberId: string | Redacted.Redacted<string>;
}
export const GetPhoneNumberRequest = S.suspend(() =>
  S.Struct({
    PhoneNumberId: SensitiveString.pipe(T.HttpLabel("PhoneNumberId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/phone-numbers/{PhoneNumberId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPhoneNumberRequest",
}) as any as S.Schema<GetPhoneNumberRequest>;
export interface GetPhoneNumberOrderRequest {
  PhoneNumberOrderId: string;
}
export const GetPhoneNumberOrderRequest = S.suspend(() =>
  S.Struct({
    PhoneNumberOrderId: S.String.pipe(T.HttpLabel("PhoneNumberOrderId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/phone-number-orders/{PhoneNumberOrderId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPhoneNumberOrderRequest",
}) as any as S.Schema<GetPhoneNumberOrderRequest>;
export interface GetPhoneNumberSettingsResponse {
  CallingName?: string | Redacted.Redacted<string>;
  CallingNameUpdatedTimestamp?: Date;
}
export const GetPhoneNumberSettingsResponse = S.suspend(() =>
  S.Struct({
    CallingName: S.optional(SensitiveString),
    CallingNameUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "GetPhoneNumberSettingsResponse",
}) as any as S.Schema<GetPhoneNumberSettingsResponse>;
export interface GetProxySessionRequest {
  VoiceConnectorId: string;
  ProxySessionId: string;
}
export const GetProxySessionRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    ProxySessionId: S.String.pipe(T.HttpLabel("ProxySessionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetProxySessionRequest",
}) as any as S.Schema<GetProxySessionRequest>;
export interface GetSipMediaApplicationRequest {
  SipMediaApplicationId: string;
}
export const GetSipMediaApplicationRequest = S.suspend(() =>
  S.Struct({
    SipMediaApplicationId: S.String.pipe(T.HttpLabel("SipMediaApplicationId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSipMediaApplicationRequest",
}) as any as S.Schema<GetSipMediaApplicationRequest>;
export interface GetSipMediaApplicationAlexaSkillConfigurationRequest {
  SipMediaApplicationId: string;
}
export const GetSipMediaApplicationAlexaSkillConfigurationRequest = S.suspend(
  () =>
    S.Struct({
      SipMediaApplicationId: S.String.pipe(
        T.HttpLabel("SipMediaApplicationId"),
      ),
    }).pipe(
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
    ),
).annotations({
  identifier: "GetSipMediaApplicationAlexaSkillConfigurationRequest",
}) as any as S.Schema<GetSipMediaApplicationAlexaSkillConfigurationRequest>;
export interface GetSipMediaApplicationLoggingConfigurationRequest {
  SipMediaApplicationId: string;
}
export const GetSipMediaApplicationLoggingConfigurationRequest = S.suspend(() =>
  S.Struct({
    SipMediaApplicationId: S.String.pipe(T.HttpLabel("SipMediaApplicationId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSipMediaApplicationLoggingConfigurationRequest",
}) as any as S.Schema<GetSipMediaApplicationLoggingConfigurationRequest>;
export interface GetSipRuleRequest {
  SipRuleId: string;
}
export const GetSipRuleRequest = S.suspend(() =>
  S.Struct({ SipRuleId: S.String.pipe(T.HttpLabel("SipRuleId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sip-rules/{SipRuleId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSipRuleRequest",
}) as any as S.Schema<GetSipRuleRequest>;
export interface GetSpeakerSearchTaskRequest {
  VoiceConnectorId: string;
  SpeakerSearchTaskId: string;
}
export const GetSpeakerSearchTaskRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    SpeakerSearchTaskId: S.String.pipe(T.HttpLabel("SpeakerSearchTaskId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSpeakerSearchTaskRequest",
}) as any as S.Schema<GetSpeakerSearchTaskRequest>;
export interface GetVoiceConnectorRequest {
  VoiceConnectorId: string;
}
export const GetVoiceConnectorRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/voice-connectors/{VoiceConnectorId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVoiceConnectorRequest",
}) as any as S.Schema<GetVoiceConnectorRequest>;
export interface GetVoiceConnectorEmergencyCallingConfigurationRequest {
  VoiceConnectorId: string;
}
export const GetVoiceConnectorEmergencyCallingConfigurationRequest = S.suspend(
  () =>
    S.Struct({
      VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    }).pipe(
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
    ),
).annotations({
  identifier: "GetVoiceConnectorEmergencyCallingConfigurationRequest",
}) as any as S.Schema<GetVoiceConnectorEmergencyCallingConfigurationRequest>;
export interface GetVoiceConnectorExternalSystemsConfigurationRequest {
  VoiceConnectorId: string;
}
export const GetVoiceConnectorExternalSystemsConfigurationRequest = S.suspend(
  () =>
    S.Struct({
      VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    }).pipe(
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
    ),
).annotations({
  identifier: "GetVoiceConnectorExternalSystemsConfigurationRequest",
}) as any as S.Schema<GetVoiceConnectorExternalSystemsConfigurationRequest>;
export interface GetVoiceConnectorGroupRequest {
  VoiceConnectorGroupId: string;
}
export const GetVoiceConnectorGroupRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorGroupId: S.String.pipe(T.HttpLabel("VoiceConnectorGroupId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetVoiceConnectorGroupRequest",
}) as any as S.Schema<GetVoiceConnectorGroupRequest>;
export interface GetVoiceConnectorLoggingConfigurationRequest {
  VoiceConnectorId: string;
}
export const GetVoiceConnectorLoggingConfigurationRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetVoiceConnectorLoggingConfigurationRequest",
}) as any as S.Schema<GetVoiceConnectorLoggingConfigurationRequest>;
export interface GetVoiceConnectorOriginationRequest {
  VoiceConnectorId: string;
}
export const GetVoiceConnectorOriginationRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetVoiceConnectorOriginationRequest",
}) as any as S.Schema<GetVoiceConnectorOriginationRequest>;
export interface GetVoiceConnectorProxyRequest {
  VoiceConnectorId: string;
}
export const GetVoiceConnectorProxyRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetVoiceConnectorProxyRequest",
}) as any as S.Schema<GetVoiceConnectorProxyRequest>;
export interface GetVoiceConnectorStreamingConfigurationRequest {
  VoiceConnectorId: string;
}
export const GetVoiceConnectorStreamingConfigurationRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetVoiceConnectorStreamingConfigurationRequest",
}) as any as S.Schema<GetVoiceConnectorStreamingConfigurationRequest>;
export interface GetVoiceConnectorTerminationRequest {
  VoiceConnectorId: string;
}
export const GetVoiceConnectorTerminationRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetVoiceConnectorTerminationRequest",
}) as any as S.Schema<GetVoiceConnectorTerminationRequest>;
export interface GetVoiceConnectorTerminationHealthRequest {
  VoiceConnectorId: string;
}
export const GetVoiceConnectorTerminationHealthRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetVoiceConnectorTerminationHealthRequest",
}) as any as S.Schema<GetVoiceConnectorTerminationHealthRequest>;
export interface GetVoiceProfileRequest {
  VoiceProfileId: string;
}
export const GetVoiceProfileRequest = S.suspend(() =>
  S.Struct({
    VoiceProfileId: S.String.pipe(T.HttpLabel("VoiceProfileId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/voice-profiles/{VoiceProfileId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVoiceProfileRequest",
}) as any as S.Schema<GetVoiceProfileRequest>;
export interface GetVoiceProfileDomainRequest {
  VoiceProfileDomainId: string;
}
export const GetVoiceProfileDomainRequest = S.suspend(() =>
  S.Struct({
    VoiceProfileDomainId: S.String.pipe(T.HttpLabel("VoiceProfileDomainId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetVoiceProfileDomainRequest",
}) as any as S.Schema<GetVoiceProfileDomainRequest>;
export interface GetVoiceToneAnalysisTaskRequest {
  VoiceConnectorId: string;
  VoiceToneAnalysisTaskId: string;
  IsCaller: boolean;
}
export const GetVoiceToneAnalysisTaskRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    VoiceToneAnalysisTaskId: S.String.pipe(
      T.HttpLabel("VoiceToneAnalysisTaskId"),
    ),
    IsCaller: S.Boolean.pipe(T.HttpQuery("isCaller")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetVoiceToneAnalysisTaskRequest",
}) as any as S.Schema<GetVoiceToneAnalysisTaskRequest>;
export interface ListAvailableVoiceConnectorRegionsResponse {
  VoiceConnectorRegions?: VoiceConnectorAwsRegionList;
}
export const ListAvailableVoiceConnectorRegionsResponse = S.suspend(() =>
  S.Struct({ VoiceConnectorRegions: S.optional(VoiceConnectorAwsRegionList) }),
).annotations({
  identifier: "ListAvailableVoiceConnectorRegionsResponse",
}) as any as S.Schema<ListAvailableVoiceConnectorRegionsResponse>;
export interface ListPhoneNumberOrdersRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListPhoneNumberOrdersRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/phone-number-orders" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPhoneNumberOrdersRequest",
}) as any as S.Schema<ListPhoneNumberOrdersRequest>;
export interface ListPhoneNumbersRequest {
  Status?: string;
  ProductType?: string;
  FilterName?: string;
  FilterValue?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListPhoneNumbersRequest = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String).pipe(T.HttpQuery("status")),
    ProductType: S.optional(S.String).pipe(T.HttpQuery("product-type")),
    FilterName: S.optional(S.String).pipe(T.HttpQuery("filter-name")),
    FilterValue: S.optional(S.String).pipe(T.HttpQuery("filter-value")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/phone-numbers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPhoneNumbersRequest",
}) as any as S.Schema<ListPhoneNumbersRequest>;
export interface ListProxySessionsRequest {
  VoiceConnectorId: string;
  Status?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListProxySessionsRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    Status: S.optional(S.String).pipe(T.HttpQuery("status")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListProxySessionsRequest",
}) as any as S.Schema<ListProxySessionsRequest>;
export interface ListSipMediaApplicationsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListSipMediaApplicationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sip-media-applications" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSipMediaApplicationsRequest",
}) as any as S.Schema<ListSipMediaApplicationsRequest>;
export interface ListSipRulesRequest {
  SipMediaApplicationId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListSipRulesRequest = S.suspend(() =>
  S.Struct({
    SipMediaApplicationId: S.optional(S.String).pipe(
      T.HttpQuery("sip-media-application"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sip-rules" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSipRulesRequest",
}) as any as S.Schema<ListSipRulesRequest>;
export interface ListSupportedPhoneNumberCountriesRequest {
  ProductType: string;
}
export const ListSupportedPhoneNumberCountriesRequest = S.suspend(() =>
  S.Struct({ ProductType: S.String.pipe(T.HttpQuery("product-type")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/phone-number-countries" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSupportedPhoneNumberCountriesRequest",
}) as any as S.Schema<ListSupportedPhoneNumberCountriesRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string | Redacted.Redacted<string>;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: SensitiveString.pipe(T.HttpQuery("arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags" }),
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
export interface ListVoiceConnectorGroupsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListVoiceConnectorGroupsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/voice-connector-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVoiceConnectorGroupsRequest",
}) as any as S.Schema<ListVoiceConnectorGroupsRequest>;
export interface ListVoiceConnectorsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListVoiceConnectorsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/voice-connectors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVoiceConnectorsRequest",
}) as any as S.Schema<ListVoiceConnectorsRequest>;
export interface ListVoiceConnectorTerminationCredentialsRequest {
  VoiceConnectorId: string;
}
export const ListVoiceConnectorTerminationCredentialsRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListVoiceConnectorTerminationCredentialsRequest",
}) as any as S.Schema<ListVoiceConnectorTerminationCredentialsRequest>;
export interface ListVoiceProfileDomainsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListVoiceProfileDomainsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/voice-profile-domains" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVoiceProfileDomainsRequest",
}) as any as S.Schema<ListVoiceProfileDomainsRequest>;
export interface ListVoiceProfilesRequest {
  VoiceProfileDomainId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListVoiceProfilesRequest = S.suspend(() =>
  S.Struct({
    VoiceProfileDomainId: S.String.pipe(T.HttpQuery("voice-profile-domain-id")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/voice-profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVoiceProfilesRequest",
}) as any as S.Schema<ListVoiceProfilesRequest>;
export interface PutVoiceConnectorExternalSystemsConfigurationRequest {
  VoiceConnectorId: string;
  SessionBorderControllerTypes?: SessionBorderControllerTypeList;
  ContactCenterSystemTypes?: ContactCenterSystemTypeList;
}
export const PutVoiceConnectorExternalSystemsConfigurationRequest = S.suspend(
  () =>
    S.Struct({
      VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
      SessionBorderControllerTypes: S.optional(SessionBorderControllerTypeList),
      ContactCenterSystemTypes: S.optional(ContactCenterSystemTypeList),
    }).pipe(
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
    ),
).annotations({
  identifier: "PutVoiceConnectorExternalSystemsConfigurationRequest",
}) as any as S.Schema<PutVoiceConnectorExternalSystemsConfigurationRequest>;
export interface PutVoiceConnectorProxyRequest {
  VoiceConnectorId: string;
  DefaultSessionExpiryMinutes: number;
  PhoneNumberPoolCountries: CountryList;
  FallBackPhoneNumber?: string | Redacted.Redacted<string>;
  Disabled?: boolean;
}
export const PutVoiceConnectorProxyRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    DefaultSessionExpiryMinutes: S.Number,
    PhoneNumberPoolCountries: CountryList,
    FallBackPhoneNumber: S.optional(SensitiveString),
    Disabled: S.optional(S.Boolean),
  }).pipe(
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
  ),
).annotations({
  identifier: "PutVoiceConnectorProxyRequest",
}) as any as S.Schema<PutVoiceConnectorProxyRequest>;
export interface RestorePhoneNumberRequest {
  PhoneNumberId: string | Redacted.Redacted<string>;
}
export const RestorePhoneNumberRequest = S.suspend(() =>
  S.Struct({
    PhoneNumberId: SensitiveString.pipe(T.HttpLabel("PhoneNumberId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "RestorePhoneNumberRequest",
}) as any as S.Schema<RestorePhoneNumberRequest>;
export interface SearchAvailablePhoneNumbersRequest {
  AreaCode?: string;
  City?: string;
  Country?: string;
  State?: string;
  TollFreePrefix?: string;
  PhoneNumberType?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const SearchAvailablePhoneNumbersRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/search?type=phone-numbers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchAvailablePhoneNumbersRequest",
}) as any as S.Schema<SearchAvailablePhoneNumbersRequest>;
export interface StartSpeakerSearchTaskRequest {
  VoiceConnectorId: string;
  TransactionId: string;
  VoiceProfileDomainId: string;
  ClientRequestToken?: string;
  CallLeg?: string;
}
export const StartSpeakerSearchTaskRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    TransactionId: S.String,
    VoiceProfileDomainId: S.String,
    ClientRequestToken: S.optional(S.String),
    CallLeg: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "StartSpeakerSearchTaskRequest",
}) as any as S.Schema<StartSpeakerSearchTaskRequest>;
export interface StartVoiceToneAnalysisTaskRequest {
  VoiceConnectorId: string;
  TransactionId: string;
  LanguageCode: string;
  ClientRequestToken?: string;
}
export const StartVoiceToneAnalysisTaskRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    TransactionId: S.String,
    LanguageCode: S.String,
    ClientRequestToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "StartVoiceToneAnalysisTaskRequest",
}) as any as S.Schema<StartVoiceToneAnalysisTaskRequest>;
export interface StopSpeakerSearchTaskRequest {
  VoiceConnectorId: string;
  SpeakerSearchTaskId: string;
}
export const StopSpeakerSearchTaskRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    SpeakerSearchTaskId: S.String.pipe(T.HttpLabel("SpeakerSearchTaskId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "StopSpeakerSearchTaskRequest",
}) as any as S.Schema<StopSpeakerSearchTaskRequest>;
export interface StopSpeakerSearchTaskResponse {}
export const StopSpeakerSearchTaskResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopSpeakerSearchTaskResponse",
}) as any as S.Schema<StopSpeakerSearchTaskResponse>;
export interface StopVoiceToneAnalysisTaskRequest {
  VoiceConnectorId: string;
  VoiceToneAnalysisTaskId: string;
}
export const StopVoiceToneAnalysisTaskRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    VoiceToneAnalysisTaskId: S.String.pipe(
      T.HttpLabel("VoiceToneAnalysisTaskId"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "StopVoiceToneAnalysisTaskRequest",
}) as any as S.Schema<StopVoiceToneAnalysisTaskRequest>;
export interface StopVoiceToneAnalysisTaskResponse {}
export const StopVoiceToneAnalysisTaskResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopVoiceToneAnalysisTaskResponse",
}) as any as S.Schema<StopVoiceToneAnalysisTaskResponse>;
export interface TagResourceRequest {
  ResourceARN: string | Redacted.Redacted<string>;
  Tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: SensitiveString, Tags: TagList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags?operation=tag-resource" }),
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
  ResourceARN: string | Redacted.Redacted<string>;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: SensitiveString, TagKeys: TagKeyList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags?operation=untag-resource" }),
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
export interface VoiceConnectorSettings {
  CdrBucket?: string;
}
export const VoiceConnectorSettings = S.suspend(() =>
  S.Struct({ CdrBucket: S.optional(S.String) }),
).annotations({
  identifier: "VoiceConnectorSettings",
}) as any as S.Schema<VoiceConnectorSettings>;
export interface UpdateGlobalSettingsRequest {
  VoiceConnector?: VoiceConnectorSettings;
}
export const UpdateGlobalSettingsRequest = S.suspend(() =>
  S.Struct({ VoiceConnector: S.optional(VoiceConnectorSettings) }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/settings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGlobalSettingsRequest",
}) as any as S.Schema<UpdateGlobalSettingsRequest>;
export interface UpdateGlobalSettingsResponse {}
export const UpdateGlobalSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateGlobalSettingsResponse",
}) as any as S.Schema<UpdateGlobalSettingsResponse>;
export interface UpdatePhoneNumberRequest {
  PhoneNumberId: string | Redacted.Redacted<string>;
  ProductType?: string;
  CallingName?: string | Redacted.Redacted<string>;
  Name?: string | Redacted.Redacted<string>;
}
export const UpdatePhoneNumberRequest = S.suspend(() =>
  S.Struct({
    PhoneNumberId: SensitiveString.pipe(T.HttpLabel("PhoneNumberId")),
    ProductType: S.optional(S.String),
    CallingName: S.optional(SensitiveString),
    Name: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/phone-numbers/{PhoneNumberId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePhoneNumberRequest",
}) as any as S.Schema<UpdatePhoneNumberRequest>;
export interface UpdatePhoneNumberSettingsRequest {
  CallingName: string | Redacted.Redacted<string>;
}
export const UpdatePhoneNumberSettingsRequest = S.suspend(() =>
  S.Struct({ CallingName: SensitiveString }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/settings/phone-number" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePhoneNumberSettingsRequest",
}) as any as S.Schema<UpdatePhoneNumberSettingsRequest>;
export interface UpdatePhoneNumberSettingsResponse {}
export const UpdatePhoneNumberSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdatePhoneNumberSettingsResponse",
}) as any as S.Schema<UpdatePhoneNumberSettingsResponse>;
export interface UpdateProxySessionRequest {
  VoiceConnectorId: string;
  ProxySessionId: string;
  Capabilities: CapabilityList;
  ExpiryMinutes?: number;
}
export const UpdateProxySessionRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    ProxySessionId: S.String.pipe(T.HttpLabel("ProxySessionId")),
    Capabilities: CapabilityList,
    ExpiryMinutes: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateProxySessionRequest",
}) as any as S.Schema<UpdateProxySessionRequest>;
export interface SipMediaApplicationEndpoint {
  LambdaArn?: string | Redacted.Redacted<string>;
}
export const SipMediaApplicationEndpoint = S.suspend(() =>
  S.Struct({ LambdaArn: S.optional(SensitiveString) }),
).annotations({
  identifier: "SipMediaApplicationEndpoint",
}) as any as S.Schema<SipMediaApplicationEndpoint>;
export type SipMediaApplicationEndpointList = SipMediaApplicationEndpoint[];
export const SipMediaApplicationEndpointList = S.Array(
  SipMediaApplicationEndpoint,
);
export interface UpdateSipMediaApplicationRequest {
  SipMediaApplicationId: string;
  Name?: string;
  Endpoints?: SipMediaApplicationEndpointList;
}
export const UpdateSipMediaApplicationRequest = S.suspend(() =>
  S.Struct({
    SipMediaApplicationId: S.String.pipe(T.HttpLabel("SipMediaApplicationId")),
    Name: S.optional(S.String),
    Endpoints: S.optional(SipMediaApplicationEndpointList),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateSipMediaApplicationRequest",
}) as any as S.Schema<UpdateSipMediaApplicationRequest>;
export interface SipRuleTargetApplication {
  SipMediaApplicationId?: string;
  Priority?: number;
  AwsRegion?: string;
}
export const SipRuleTargetApplication = S.suspend(() =>
  S.Struct({
    SipMediaApplicationId: S.optional(S.String),
    Priority: S.optional(S.Number),
    AwsRegion: S.optional(S.String),
  }),
).annotations({
  identifier: "SipRuleTargetApplication",
}) as any as S.Schema<SipRuleTargetApplication>;
export type SipRuleTargetApplicationList = SipRuleTargetApplication[];
export const SipRuleTargetApplicationList = S.Array(SipRuleTargetApplication);
export interface UpdateSipRuleRequest {
  SipRuleId: string;
  Name: string;
  Disabled?: boolean;
  TargetApplications?: SipRuleTargetApplicationList;
}
export const UpdateSipRuleRequest = S.suspend(() =>
  S.Struct({
    SipRuleId: S.String.pipe(T.HttpLabel("SipRuleId")),
    Name: S.String,
    Disabled: S.optional(S.Boolean),
    TargetApplications: S.optional(SipRuleTargetApplicationList),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/sip-rules/{SipRuleId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSipRuleRequest",
}) as any as S.Schema<UpdateSipRuleRequest>;
export interface UpdateVoiceConnectorRequest {
  VoiceConnectorId: string;
  Name: string;
  RequireEncryption: boolean;
}
export const UpdateVoiceConnectorRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    Name: S.String,
    RequireEncryption: S.Boolean,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/voice-connectors/{VoiceConnectorId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateVoiceConnectorRequest",
}) as any as S.Schema<UpdateVoiceConnectorRequest>;
export interface VoiceConnectorItem {
  VoiceConnectorId: string;
  Priority: number;
}
export const VoiceConnectorItem = S.suspend(() =>
  S.Struct({ VoiceConnectorId: S.String, Priority: S.Number }),
).annotations({
  identifier: "VoiceConnectorItem",
}) as any as S.Schema<VoiceConnectorItem>;
export type VoiceConnectorItemList = VoiceConnectorItem[];
export const VoiceConnectorItemList = S.Array(VoiceConnectorItem);
export interface UpdateVoiceConnectorGroupRequest {
  VoiceConnectorGroupId: string;
  Name: string;
  VoiceConnectorItems: VoiceConnectorItemList;
}
export const UpdateVoiceConnectorGroupRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorGroupId: S.String.pipe(T.HttpLabel("VoiceConnectorGroupId")),
    Name: S.String,
    VoiceConnectorItems: VoiceConnectorItemList,
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateVoiceConnectorGroupRequest",
}) as any as S.Schema<UpdateVoiceConnectorGroupRequest>;
export interface UpdateVoiceProfileRequest {
  VoiceProfileId: string;
  SpeakerSearchTaskId: string;
}
export const UpdateVoiceProfileRequest = S.suspend(() =>
  S.Struct({
    VoiceProfileId: S.String.pipe(T.HttpLabel("VoiceProfileId")),
    SpeakerSearchTaskId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/voice-profiles/{VoiceProfileId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateVoiceProfileRequest",
}) as any as S.Schema<UpdateVoiceProfileRequest>;
export interface UpdateVoiceProfileDomainRequest {
  VoiceProfileDomainId: string;
  Name?: string;
  Description?: string;
}
export const UpdateVoiceProfileDomainRequest = S.suspend(() =>
  S.Struct({
    VoiceProfileDomainId: S.String.pipe(T.HttpLabel("VoiceProfileDomainId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateVoiceProfileDomainRequest",
}) as any as S.Schema<UpdateVoiceProfileDomainRequest>;
export interface ValidateE911AddressRequest {
  AwsAccountId: string;
  StreetNumber: string | Redacted.Redacted<string>;
  StreetInfo: string | Redacted.Redacted<string>;
  City: string | Redacted.Redacted<string>;
  State: string | Redacted.Redacted<string>;
  Country: string | Redacted.Redacted<string>;
  PostalCode: string | Redacted.Redacted<string>;
}
export const ValidateE911AddressRequest = S.suspend(() =>
  S.Struct({
    AwsAccountId: S.String,
    StreetNumber: SensitiveString,
    StreetInfo: SensitiveString,
    City: SensitiveString,
    State: SensitiveString,
    Country: SensitiveString,
    PostalCode: SensitiveString,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/emergency-calling/address" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ValidateE911AddressRequest",
}) as any as S.Schema<ValidateE911AddressRequest>;
export type AlexaSkillIdList = string | Redacted.Redacted<string>[];
export const AlexaSkillIdList = S.Array(SensitiveString);
export type CallingRegionList = string[];
export const CallingRegionList = S.Array(S.String);
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface UpdatePhoneNumberRequestItem {
  PhoneNumberId: string | Redacted.Redacted<string>;
  ProductType?: string;
  CallingName?: string | Redacted.Redacted<string>;
  Name?: string | Redacted.Redacted<string>;
}
export const UpdatePhoneNumberRequestItem = S.suspend(() =>
  S.Struct({
    PhoneNumberId: SensitiveString,
    ProductType: S.optional(S.String),
    CallingName: S.optional(SensitiveString),
    Name: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "UpdatePhoneNumberRequestItem",
}) as any as S.Schema<UpdatePhoneNumberRequestItem>;
export type UpdatePhoneNumberRequestItemList = UpdatePhoneNumberRequestItem[];
export const UpdatePhoneNumberRequestItemList = S.Array(
  UpdatePhoneNumberRequestItem,
);
export interface GeoMatchParams {
  Country: string;
  AreaCode: string;
}
export const GeoMatchParams = S.suspend(() =>
  S.Struct({ Country: S.String, AreaCode: S.String }),
).annotations({
  identifier: "GeoMatchParams",
}) as any as S.Schema<GeoMatchParams>;
export type SipHeadersMap = {
  [key: string]: string | Redacted.Redacted<string>;
};
export const SipHeadersMap = S.Record({
  key: S.String,
  value: SensitiveString,
});
export type SMACreateCallArgumentsMap = {
  [key: string]: string | Redacted.Redacted<string>;
};
export const SMACreateCallArgumentsMap = S.Record({
  key: S.String,
  value: SensitiveString,
});
export interface ServerSideEncryptionConfiguration {
  KmsKeyArn: string | Redacted.Redacted<string>;
}
export const ServerSideEncryptionConfiguration = S.suspend(() =>
  S.Struct({ KmsKeyArn: SensitiveString }),
).annotations({
  identifier: "ServerSideEncryptionConfiguration",
}) as any as S.Schema<ServerSideEncryptionConfiguration>;
export interface OrderedPhoneNumber {
  E164PhoneNumber?: string | Redacted.Redacted<string>;
  Status?: string;
}
export const OrderedPhoneNumber = S.suspend(() =>
  S.Struct({
    E164PhoneNumber: S.optional(SensitiveString),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "OrderedPhoneNumber",
}) as any as S.Schema<OrderedPhoneNumber>;
export type OrderedPhoneNumberList = OrderedPhoneNumber[];
export const OrderedPhoneNumberList = S.Array(OrderedPhoneNumber);
export interface PhoneNumberOrder {
  PhoneNumberOrderId?: string;
  ProductType?: string;
  Status?: string;
  OrderType?: string;
  OrderedPhoneNumbers?: OrderedPhoneNumberList;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
  FocDate?: Date;
}
export const PhoneNumberOrder = S.suspend(() =>
  S.Struct({
    PhoneNumberOrderId: S.optional(S.String),
    ProductType: S.optional(S.String),
    Status: S.optional(S.String),
    OrderType: S.optional(S.String),
    OrderedPhoneNumbers: S.optional(OrderedPhoneNumberList),
    CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    FocDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "PhoneNumberOrder",
}) as any as S.Schema<PhoneNumberOrder>;
export type PhoneNumberOrderList = PhoneNumberOrder[];
export const PhoneNumberOrderList = S.Array(PhoneNumberOrder);
export interface PhoneNumberCapabilities {
  InboundCall?: boolean;
  OutboundCall?: boolean;
  InboundSMS?: boolean;
  OutboundSMS?: boolean;
  InboundMMS?: boolean;
  OutboundMMS?: boolean;
}
export const PhoneNumberCapabilities = S.suspend(() =>
  S.Struct({
    InboundCall: S.optional(S.Boolean),
    OutboundCall: S.optional(S.Boolean),
    InboundSMS: S.optional(S.Boolean),
    OutboundSMS: S.optional(S.Boolean),
    InboundMMS: S.optional(S.Boolean),
    OutboundMMS: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PhoneNumberCapabilities",
}) as any as S.Schema<PhoneNumberCapabilities>;
export interface PhoneNumberAssociation {
  Value?: string;
  Name?: string;
  AssociatedTimestamp?: Date;
}
export const PhoneNumberAssociation = S.suspend(() =>
  S.Struct({
    Value: S.optional(S.String),
    Name: S.optional(S.String),
    AssociatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "PhoneNumberAssociation",
}) as any as S.Schema<PhoneNumberAssociation>;
export type PhoneNumberAssociationList = PhoneNumberAssociation[];
export const PhoneNumberAssociationList = S.Array(PhoneNumberAssociation);
export interface PhoneNumber {
  PhoneNumberId?: string | Redacted.Redacted<string>;
  E164PhoneNumber?: string | Redacted.Redacted<string>;
  Country?: string;
  Type?: string;
  ProductType?: string;
  Status?: string;
  Capabilities?: PhoneNumberCapabilities;
  Associations?: PhoneNumberAssociationList;
  CallingName?: string | Redacted.Redacted<string>;
  CallingNameStatus?: string;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
  DeletionTimestamp?: Date;
  OrderId?: string;
  Name?: string | Redacted.Redacted<string>;
}
export const PhoneNumber = S.suspend(() =>
  S.Struct({
    PhoneNumberId: S.optional(SensitiveString),
    E164PhoneNumber: S.optional(SensitiveString),
    Country: S.optional(S.String),
    Type: S.optional(S.String),
    ProductType: S.optional(S.String),
    Status: S.optional(S.String),
    Capabilities: S.optional(PhoneNumberCapabilities),
    Associations: S.optional(PhoneNumberAssociationList),
    CallingName: S.optional(SensitiveString),
    CallingNameStatus: S.optional(S.String),
    CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DeletionTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    OrderId: S.optional(S.String),
    Name: S.optional(SensitiveString),
  }),
).annotations({ identifier: "PhoneNumber" }) as any as S.Schema<PhoneNumber>;
export type PhoneNumberList = PhoneNumber[];
export const PhoneNumberList = S.Array(PhoneNumber);
export interface Participant {
  PhoneNumber?: string | Redacted.Redacted<string>;
  ProxyPhoneNumber?: string | Redacted.Redacted<string>;
}
export const Participant = S.suspend(() =>
  S.Struct({
    PhoneNumber: S.optional(SensitiveString),
    ProxyPhoneNumber: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Participant" }) as any as S.Schema<Participant>;
export type Participants = Participant[];
export const Participants = S.Array(Participant);
export interface ProxySession {
  VoiceConnectorId?: string;
  ProxySessionId?: string;
  Name?: string;
  Status?: string;
  ExpiryMinutes?: number;
  Capabilities?: CapabilityList;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
  EndedTimestamp?: Date;
  Participants?: Participants;
  NumberSelectionBehavior?: string;
  GeoMatchLevel?: string;
  GeoMatchParams?: GeoMatchParams;
}
export const ProxySession = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "ProxySession" }) as any as S.Schema<ProxySession>;
export type ProxySessions = ProxySession[];
export const ProxySessions = S.Array(ProxySession);
export interface SipMediaApplication {
  SipMediaApplicationId?: string;
  AwsRegion?: string;
  Name?: string;
  Endpoints?: SipMediaApplicationEndpointList;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
  SipMediaApplicationArn?: string;
}
export const SipMediaApplication = S.suspend(() =>
  S.Struct({
    SipMediaApplicationId: S.optional(S.String),
    AwsRegion: S.optional(S.String),
    Name: S.optional(S.String),
    Endpoints: S.optional(SipMediaApplicationEndpointList),
    CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    SipMediaApplicationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "SipMediaApplication",
}) as any as S.Schema<SipMediaApplication>;
export type SipMediaApplicationList = SipMediaApplication[];
export const SipMediaApplicationList = S.Array(SipMediaApplication);
export interface SipRule {
  SipRuleId?: string;
  Name?: string;
  Disabled?: boolean;
  TriggerType?: string;
  TriggerValue?: string;
  TargetApplications?: SipRuleTargetApplicationList;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
}
export const SipRule = S.suspend(() =>
  S.Struct({
    SipRuleId: S.optional(S.String),
    Name: S.optional(S.String),
    Disabled: S.optional(S.Boolean),
    TriggerType: S.optional(S.String),
    TriggerValue: S.optional(S.String),
    TargetApplications: S.optional(SipRuleTargetApplicationList),
    CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({ identifier: "SipRule" }) as any as S.Schema<SipRule>;
export type SipRuleList = SipRule[];
export const SipRuleList = S.Array(SipRule);
export interface VoiceConnectorGroup {
  VoiceConnectorGroupId?: string;
  Name?: string;
  VoiceConnectorItems?: VoiceConnectorItemList;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
  VoiceConnectorGroupArn?: string;
}
export const VoiceConnectorGroup = S.suspend(() =>
  S.Struct({
    VoiceConnectorGroupId: S.optional(S.String),
    Name: S.optional(S.String),
    VoiceConnectorItems: S.optional(VoiceConnectorItemList),
    CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    VoiceConnectorGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "VoiceConnectorGroup",
}) as any as S.Schema<VoiceConnectorGroup>;
export type VoiceConnectorGroupList = VoiceConnectorGroup[];
export const VoiceConnectorGroupList = S.Array(VoiceConnectorGroup);
export interface VoiceConnector {
  VoiceConnectorId?: string;
  AwsRegion?: string;
  Name?: string;
  OutboundHostName?: string;
  RequireEncryption?: boolean;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
  VoiceConnectorArn?: string;
  IntegrationType?: string;
  NetworkType?: string;
}
export const VoiceConnector = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "VoiceConnector",
}) as any as S.Schema<VoiceConnector>;
export type VoiceConnectorList = VoiceConnector[];
export const VoiceConnectorList = S.Array(VoiceConnector);
export interface SipMediaApplicationAlexaSkillConfiguration {
  AlexaSkillStatus: string;
  AlexaSkillIds: AlexaSkillIdList;
}
export const SipMediaApplicationAlexaSkillConfiguration = S.suspend(() =>
  S.Struct({ AlexaSkillStatus: S.String, AlexaSkillIds: AlexaSkillIdList }),
).annotations({
  identifier: "SipMediaApplicationAlexaSkillConfiguration",
}) as any as S.Schema<SipMediaApplicationAlexaSkillConfiguration>;
export interface SipMediaApplicationLoggingConfiguration {
  EnableSipMediaApplicationMessageLogs?: boolean;
}
export const SipMediaApplicationLoggingConfiguration = S.suspend(() =>
  S.Struct({ EnableSipMediaApplicationMessageLogs: S.optional(S.Boolean) }),
).annotations({
  identifier: "SipMediaApplicationLoggingConfiguration",
}) as any as S.Schema<SipMediaApplicationLoggingConfiguration>;
export interface LoggingConfiguration {
  EnableSIPLogs?: boolean;
  EnableMediaMetricLogs?: boolean;
}
export const LoggingConfiguration = S.suspend(() =>
  S.Struct({
    EnableSIPLogs: S.optional(S.Boolean),
    EnableMediaMetricLogs: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "LoggingConfiguration",
}) as any as S.Schema<LoggingConfiguration>;
export interface Termination {
  CpsLimit?: number;
  DefaultPhoneNumber?: string | Redacted.Redacted<string>;
  CallingRegions?: CallingRegionList;
  CidrAllowedList?: StringList;
  Disabled?: boolean;
}
export const Termination = S.suspend(() =>
  S.Struct({
    CpsLimit: S.optional(S.Number),
    DefaultPhoneNumber: S.optional(SensitiveString),
    CallingRegions: S.optional(CallingRegionList),
    CidrAllowedList: S.optional(StringList),
    Disabled: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Termination" }) as any as S.Schema<Termination>;
export interface Credential {
  Username?: string | Redacted.Redacted<string>;
  Password?: string | Redacted.Redacted<string>;
}
export const Credential = S.suspend(() =>
  S.Struct({
    Username: S.optional(SensitiveString),
    Password: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Credential" }) as any as S.Schema<Credential>;
export type CredentialList = Credential[];
export const CredentialList = S.Array(Credential);
export type SMAUpdateCallArgumentsMap = {
  [key: string]: string | Redacted.Redacted<string>;
};
export const SMAUpdateCallArgumentsMap = S.Record({
  key: S.String,
  value: SensitiveString,
});
export interface PhoneNumberError {
  PhoneNumberId?: string | Redacted.Redacted<string>;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const PhoneNumberError = S.suspend(() =>
  S.Struct({
    PhoneNumberId: S.optional(SensitiveString),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "PhoneNumberError",
}) as any as S.Schema<PhoneNumberError>;
export type PhoneNumberErrorList = PhoneNumberError[];
export const PhoneNumberErrorList = S.Array(PhoneNumberError);
export interface AssociatePhoneNumbersWithVoiceConnectorGroupResponse {
  PhoneNumberErrors?: PhoneNumberErrorList;
}
export const AssociatePhoneNumbersWithVoiceConnectorGroupResponse = S.suspend(
  () => S.Struct({ PhoneNumberErrors: S.optional(PhoneNumberErrorList) }),
).annotations({
  identifier: "AssociatePhoneNumbersWithVoiceConnectorGroupResponse",
}) as any as S.Schema<AssociatePhoneNumbersWithVoiceConnectorGroupResponse>;
export interface BatchDeletePhoneNumberResponse {
  PhoneNumberErrors?: PhoneNumberErrorList;
}
export const BatchDeletePhoneNumberResponse = S.suspend(() =>
  S.Struct({ PhoneNumberErrors: S.optional(PhoneNumberErrorList) }),
).annotations({
  identifier: "BatchDeletePhoneNumberResponse",
}) as any as S.Schema<BatchDeletePhoneNumberResponse>;
export interface BatchUpdatePhoneNumberRequest {
  UpdatePhoneNumberRequestItems: UpdatePhoneNumberRequestItemList;
}
export const BatchUpdatePhoneNumberRequest = S.suspend(() =>
  S.Struct({
    UpdatePhoneNumberRequestItems: UpdatePhoneNumberRequestItemList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/phone-numbers?operation=batch-update" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchUpdatePhoneNumberRequest",
}) as any as S.Schema<BatchUpdatePhoneNumberRequest>;
export interface CreateProxySessionRequest {
  VoiceConnectorId: string;
  ParticipantPhoneNumbers: ParticipantPhoneNumberList;
  Name?: string | Redacted.Redacted<string>;
  ExpiryMinutes?: number;
  Capabilities: CapabilityList;
  NumberSelectionBehavior?: string;
  GeoMatchLevel?: string;
  GeoMatchParams?: GeoMatchParams;
}
export const CreateProxySessionRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    ParticipantPhoneNumbers: ParticipantPhoneNumberList,
    Name: S.optional(SensitiveString),
    ExpiryMinutes: S.optional(S.Number),
    Capabilities: CapabilityList,
    NumberSelectionBehavior: S.optional(S.String),
    GeoMatchLevel: S.optional(S.String),
    GeoMatchParams: S.optional(GeoMatchParams),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateProxySessionRequest",
}) as any as S.Schema<CreateProxySessionRequest>;
export interface CreateSipMediaApplicationRequest {
  AwsRegion: string;
  Name: string;
  Endpoints: SipMediaApplicationEndpointList;
  Tags?: TagList;
}
export const CreateSipMediaApplicationRequest = S.suspend(() =>
  S.Struct({
    AwsRegion: S.String,
    Name: S.String,
    Endpoints: SipMediaApplicationEndpointList,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/sip-media-applications" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSipMediaApplicationRequest",
}) as any as S.Schema<CreateSipMediaApplicationRequest>;
export interface CreateSipMediaApplicationCallRequest {
  FromPhoneNumber: string | Redacted.Redacted<string>;
  ToPhoneNumber: string | Redacted.Redacted<string>;
  SipMediaApplicationId: string;
  SipHeaders?: SipHeadersMap;
  ArgumentsMap?: SMACreateCallArgumentsMap;
}
export const CreateSipMediaApplicationCallRequest = S.suspend(() =>
  S.Struct({
    FromPhoneNumber: SensitiveString,
    ToPhoneNumber: SensitiveString,
    SipMediaApplicationId: S.String.pipe(T.HttpLabel("SipMediaApplicationId")),
    SipHeaders: S.optional(SipHeadersMap),
    ArgumentsMap: S.optional(SMACreateCallArgumentsMap),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateSipMediaApplicationCallRequest",
}) as any as S.Schema<CreateSipMediaApplicationCallRequest>;
export interface CreateSipRuleRequest {
  Name: string;
  TriggerType: string;
  TriggerValue: string;
  Disabled?: boolean;
  TargetApplications?: SipRuleTargetApplicationList;
}
export const CreateSipRuleRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    TriggerType: S.String,
    TriggerValue: S.String,
    Disabled: S.optional(S.Boolean),
    TargetApplications: S.optional(SipRuleTargetApplicationList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/sip-rules" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSipRuleRequest",
}) as any as S.Schema<CreateSipRuleRequest>;
export interface CreateVoiceConnectorGroupRequest {
  Name: string;
  VoiceConnectorItems?: VoiceConnectorItemList;
}
export const CreateVoiceConnectorGroupRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    VoiceConnectorItems: S.optional(VoiceConnectorItemList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/voice-connector-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateVoiceConnectorGroupRequest",
}) as any as S.Schema<CreateVoiceConnectorGroupRequest>;
export interface CreateVoiceProfileDomainRequest {
  Name: string;
  Description?: string;
  ServerSideEncryptionConfiguration: ServerSideEncryptionConfiguration;
  ClientRequestToken?: string;
  Tags?: TagList;
}
export const CreateVoiceProfileDomainRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    ServerSideEncryptionConfiguration: ServerSideEncryptionConfiguration,
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/voice-profile-domains" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateVoiceProfileDomainRequest",
}) as any as S.Schema<CreateVoiceProfileDomainRequest>;
export interface DisassociatePhoneNumbersFromVoiceConnectorResponse {
  PhoneNumberErrors?: PhoneNumberErrorList;
}
export const DisassociatePhoneNumbersFromVoiceConnectorResponse = S.suspend(
  () => S.Struct({ PhoneNumberErrors: S.optional(PhoneNumberErrorList) }),
).annotations({
  identifier: "DisassociatePhoneNumbersFromVoiceConnectorResponse",
}) as any as S.Schema<DisassociatePhoneNumbersFromVoiceConnectorResponse>;
export interface DisassociatePhoneNumbersFromVoiceConnectorGroupResponse {
  PhoneNumberErrors?: PhoneNumberErrorList;
}
export const DisassociatePhoneNumbersFromVoiceConnectorGroupResponse =
  S.suspend(() =>
    S.Struct({ PhoneNumberErrors: S.optional(PhoneNumberErrorList) }),
  ).annotations({
    identifier: "DisassociatePhoneNumbersFromVoiceConnectorGroupResponse",
  }) as any as S.Schema<DisassociatePhoneNumbersFromVoiceConnectorGroupResponse>;
export interface GetGlobalSettingsResponse {
  VoiceConnector?: VoiceConnectorSettings;
}
export const GetGlobalSettingsResponse = S.suspend(() =>
  S.Struct({ VoiceConnector: S.optional(VoiceConnectorSettings) }),
).annotations({
  identifier: "GetGlobalSettingsResponse",
}) as any as S.Schema<GetGlobalSettingsResponse>;
export interface GetPhoneNumberOrderResponse {
  PhoneNumberOrder?: PhoneNumberOrder;
}
export const GetPhoneNumberOrderResponse = S.suspend(() =>
  S.Struct({ PhoneNumberOrder: S.optional(PhoneNumberOrder) }),
).annotations({
  identifier: "GetPhoneNumberOrderResponse",
}) as any as S.Schema<GetPhoneNumberOrderResponse>;
export interface GetSipMediaApplicationAlexaSkillConfigurationResponse {
  SipMediaApplicationAlexaSkillConfiguration?: SipMediaApplicationAlexaSkillConfiguration;
}
export const GetSipMediaApplicationAlexaSkillConfigurationResponse = S.suspend(
  () =>
    S.Struct({
      SipMediaApplicationAlexaSkillConfiguration: S.optional(
        SipMediaApplicationAlexaSkillConfiguration,
      ),
    }),
).annotations({
  identifier: "GetSipMediaApplicationAlexaSkillConfigurationResponse",
}) as any as S.Schema<GetSipMediaApplicationAlexaSkillConfigurationResponse>;
export interface GetSipMediaApplicationLoggingConfigurationResponse {
  SipMediaApplicationLoggingConfiguration?: SipMediaApplicationLoggingConfiguration;
}
export const GetSipMediaApplicationLoggingConfigurationResponse = S.suspend(
  () =>
    S.Struct({
      SipMediaApplicationLoggingConfiguration: S.optional(
        SipMediaApplicationLoggingConfiguration,
      ),
    }),
).annotations({
  identifier: "GetSipMediaApplicationLoggingConfigurationResponse",
}) as any as S.Schema<GetSipMediaApplicationLoggingConfigurationResponse>;
export interface GetVoiceConnectorResponse {
  VoiceConnector?: VoiceConnector;
}
export const GetVoiceConnectorResponse = S.suspend(() =>
  S.Struct({ VoiceConnector: S.optional(VoiceConnector) }),
).annotations({
  identifier: "GetVoiceConnectorResponse",
}) as any as S.Schema<GetVoiceConnectorResponse>;
export interface DNISEmergencyCallingConfiguration {
  EmergencyPhoneNumber: string | Redacted.Redacted<string>;
  TestPhoneNumber?: string | Redacted.Redacted<string>;
  CallingCountry: string;
}
export const DNISEmergencyCallingConfiguration = S.suspend(() =>
  S.Struct({
    EmergencyPhoneNumber: SensitiveString,
    TestPhoneNumber: S.optional(SensitiveString),
    CallingCountry: S.String,
  }),
).annotations({
  identifier: "DNISEmergencyCallingConfiguration",
}) as any as S.Schema<DNISEmergencyCallingConfiguration>;
export type DNISEmergencyCallingConfigurationList =
  DNISEmergencyCallingConfiguration[];
export const DNISEmergencyCallingConfigurationList = S.Array(
  DNISEmergencyCallingConfiguration,
);
export interface EmergencyCallingConfiguration {
  DNIS?: DNISEmergencyCallingConfigurationList;
}
export const EmergencyCallingConfiguration = S.suspend(() =>
  S.Struct({ DNIS: S.optional(DNISEmergencyCallingConfigurationList) }),
).annotations({
  identifier: "EmergencyCallingConfiguration",
}) as any as S.Schema<EmergencyCallingConfiguration>;
export interface GetVoiceConnectorEmergencyCallingConfigurationResponse {
  EmergencyCallingConfiguration?: EmergencyCallingConfiguration;
}
export const GetVoiceConnectorEmergencyCallingConfigurationResponse = S.suspend(
  () =>
    S.Struct({
      EmergencyCallingConfiguration: S.optional(EmergencyCallingConfiguration),
    }),
).annotations({
  identifier: "GetVoiceConnectorEmergencyCallingConfigurationResponse",
}) as any as S.Schema<GetVoiceConnectorEmergencyCallingConfigurationResponse>;
export interface GetVoiceConnectorLoggingConfigurationResponse {
  LoggingConfiguration?: LoggingConfiguration;
}
export const GetVoiceConnectorLoggingConfigurationResponse = S.suspend(() =>
  S.Struct({ LoggingConfiguration: S.optional(LoggingConfiguration) }),
).annotations({
  identifier: "GetVoiceConnectorLoggingConfigurationResponse",
}) as any as S.Schema<GetVoiceConnectorLoggingConfigurationResponse>;
export interface OriginationRoute {
  Host?: string;
  Port?: number;
  Protocol?: string;
  Priority?: number;
  Weight?: number;
}
export const OriginationRoute = S.suspend(() =>
  S.Struct({
    Host: S.optional(S.String),
    Port: S.optional(S.Number),
    Protocol: S.optional(S.String),
    Priority: S.optional(S.Number),
    Weight: S.optional(S.Number),
  }),
).annotations({
  identifier: "OriginationRoute",
}) as any as S.Schema<OriginationRoute>;
export type OriginationRouteList = OriginationRoute[];
export const OriginationRouteList = S.Array(OriginationRoute);
export interface Origination {
  Routes?: OriginationRouteList;
  Disabled?: boolean;
}
export const Origination = S.suspend(() =>
  S.Struct({
    Routes: S.optional(OriginationRouteList),
    Disabled: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Origination" }) as any as S.Schema<Origination>;
export interface GetVoiceConnectorOriginationResponse {
  Origination?: Origination;
}
export const GetVoiceConnectorOriginationResponse = S.suspend(() =>
  S.Struct({ Origination: S.optional(Origination) }),
).annotations({
  identifier: "GetVoiceConnectorOriginationResponse",
}) as any as S.Schema<GetVoiceConnectorOriginationResponse>;
export interface StreamingNotificationTarget {
  NotificationTarget?: string;
}
export const StreamingNotificationTarget = S.suspend(() =>
  S.Struct({ NotificationTarget: S.optional(S.String) }),
).annotations({
  identifier: "StreamingNotificationTarget",
}) as any as S.Schema<StreamingNotificationTarget>;
export type StreamingNotificationTargetList = StreamingNotificationTarget[];
export const StreamingNotificationTargetList = S.Array(
  StreamingNotificationTarget,
);
export interface MediaInsightsConfiguration {
  Disabled?: boolean;
  ConfigurationArn?: string | Redacted.Redacted<string>;
}
export const MediaInsightsConfiguration = S.suspend(() =>
  S.Struct({
    Disabled: S.optional(S.Boolean),
    ConfigurationArn: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "MediaInsightsConfiguration",
}) as any as S.Schema<MediaInsightsConfiguration>;
export interface StreamingConfiguration {
  DataRetentionInHours: number;
  Disabled: boolean;
  StreamingNotificationTargets?: StreamingNotificationTargetList;
  MediaInsightsConfiguration?: MediaInsightsConfiguration;
}
export const StreamingConfiguration = S.suspend(() =>
  S.Struct({
    DataRetentionInHours: S.Number,
    Disabled: S.Boolean,
    StreamingNotificationTargets: S.optional(StreamingNotificationTargetList),
    MediaInsightsConfiguration: S.optional(MediaInsightsConfiguration),
  }),
).annotations({
  identifier: "StreamingConfiguration",
}) as any as S.Schema<StreamingConfiguration>;
export interface GetVoiceConnectorStreamingConfigurationResponse {
  StreamingConfiguration?: StreamingConfiguration;
}
export const GetVoiceConnectorStreamingConfigurationResponse = S.suspend(() =>
  S.Struct({ StreamingConfiguration: S.optional(StreamingConfiguration) }),
).annotations({
  identifier: "GetVoiceConnectorStreamingConfigurationResponse",
}) as any as S.Schema<GetVoiceConnectorStreamingConfigurationResponse>;
export interface GetVoiceConnectorTerminationResponse {
  Termination?: Termination;
}
export const GetVoiceConnectorTerminationResponse = S.suspend(() =>
  S.Struct({ Termination: S.optional(Termination) }),
).annotations({
  identifier: "GetVoiceConnectorTerminationResponse",
}) as any as S.Schema<GetVoiceConnectorTerminationResponse>;
export interface VoiceProfile {
  VoiceProfileId?: string;
  VoiceProfileArn?: string | Redacted.Redacted<string>;
  VoiceProfileDomainId?: string;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
  ExpirationTimestamp?: Date;
}
export const VoiceProfile = S.suspend(() =>
  S.Struct({
    VoiceProfileId: S.optional(S.String),
    VoiceProfileArn: S.optional(SensitiveString),
    VoiceProfileDomainId: S.optional(S.String),
    CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ExpirationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({ identifier: "VoiceProfile" }) as any as S.Schema<VoiceProfile>;
export interface GetVoiceProfileResponse {
  VoiceProfile?: VoiceProfile;
}
export const GetVoiceProfileResponse = S.suspend(() =>
  S.Struct({ VoiceProfile: S.optional(VoiceProfile) }),
).annotations({
  identifier: "GetVoiceProfileResponse",
}) as any as S.Schema<GetVoiceProfileResponse>;
export interface ListPhoneNumberOrdersResponse {
  PhoneNumberOrders?: PhoneNumberOrderList;
  NextToken?: string;
}
export const ListPhoneNumberOrdersResponse = S.suspend(() =>
  S.Struct({
    PhoneNumberOrders: S.optional(PhoneNumberOrderList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPhoneNumberOrdersResponse",
}) as any as S.Schema<ListPhoneNumberOrdersResponse>;
export interface ListPhoneNumbersResponse {
  PhoneNumbers?: PhoneNumberList;
  NextToken?: string;
}
export const ListPhoneNumbersResponse = S.suspend(() =>
  S.Struct({
    PhoneNumbers: S.optional(PhoneNumberList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPhoneNumbersResponse",
}) as any as S.Schema<ListPhoneNumbersResponse>;
export interface ListProxySessionsResponse {
  ProxySessions?: ProxySessions;
  NextToken?: string;
}
export const ListProxySessionsResponse = S.suspend(() =>
  S.Struct({
    ProxySessions: S.optional(ProxySessions),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProxySessionsResponse",
}) as any as S.Schema<ListProxySessionsResponse>;
export interface ListSipMediaApplicationsResponse {
  SipMediaApplications?: SipMediaApplicationList;
  NextToken?: string;
}
export const ListSipMediaApplicationsResponse = S.suspend(() =>
  S.Struct({
    SipMediaApplications: S.optional(SipMediaApplicationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSipMediaApplicationsResponse",
}) as any as S.Schema<ListSipMediaApplicationsResponse>;
export interface ListSipRulesResponse {
  SipRules?: SipRuleList;
  NextToken?: string;
}
export const ListSipRulesResponse = S.suspend(() =>
  S.Struct({
    SipRules: S.optional(SipRuleList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSipRulesResponse",
}) as any as S.Schema<ListSipRulesResponse>;
export interface ListTagsForResourceResponse {
  Tags?: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListVoiceConnectorGroupsResponse {
  VoiceConnectorGroups?: VoiceConnectorGroupList;
  NextToken?: string;
}
export const ListVoiceConnectorGroupsResponse = S.suspend(() =>
  S.Struct({
    VoiceConnectorGroups: S.optional(VoiceConnectorGroupList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListVoiceConnectorGroupsResponse",
}) as any as S.Schema<ListVoiceConnectorGroupsResponse>;
export interface ListVoiceConnectorsResponse {
  VoiceConnectors?: VoiceConnectorList;
  NextToken?: string;
}
export const ListVoiceConnectorsResponse = S.suspend(() =>
  S.Struct({
    VoiceConnectors: S.optional(VoiceConnectorList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListVoiceConnectorsResponse",
}) as any as S.Schema<ListVoiceConnectorsResponse>;
export interface ListVoiceConnectorTerminationCredentialsResponse {
  Usernames?: SensitiveStringList;
}
export const ListVoiceConnectorTerminationCredentialsResponse = S.suspend(() =>
  S.Struct({ Usernames: S.optional(SensitiveStringList) }),
).annotations({
  identifier: "ListVoiceConnectorTerminationCredentialsResponse",
}) as any as S.Schema<ListVoiceConnectorTerminationCredentialsResponse>;
export interface PutSipMediaApplicationAlexaSkillConfigurationRequest {
  SipMediaApplicationId: string;
  SipMediaApplicationAlexaSkillConfiguration?: SipMediaApplicationAlexaSkillConfiguration;
}
export const PutSipMediaApplicationAlexaSkillConfigurationRequest = S.suspend(
  () =>
    S.Struct({
      SipMediaApplicationId: S.String.pipe(
        T.HttpLabel("SipMediaApplicationId"),
      ),
      SipMediaApplicationAlexaSkillConfiguration: S.optional(
        SipMediaApplicationAlexaSkillConfiguration,
      ),
    }).pipe(
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
    ),
).annotations({
  identifier: "PutSipMediaApplicationAlexaSkillConfigurationRequest",
}) as any as S.Schema<PutSipMediaApplicationAlexaSkillConfigurationRequest>;
export interface PutSipMediaApplicationLoggingConfigurationRequest {
  SipMediaApplicationId: string;
  SipMediaApplicationLoggingConfiguration?: SipMediaApplicationLoggingConfiguration;
}
export const PutSipMediaApplicationLoggingConfigurationRequest = S.suspend(() =>
  S.Struct({
    SipMediaApplicationId: S.String.pipe(T.HttpLabel("SipMediaApplicationId")),
    SipMediaApplicationLoggingConfiguration: S.optional(
      SipMediaApplicationLoggingConfiguration,
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "PutSipMediaApplicationLoggingConfigurationRequest",
}) as any as S.Schema<PutSipMediaApplicationLoggingConfigurationRequest>;
export interface ExternalSystemsConfiguration {
  SessionBorderControllerTypes?: SessionBorderControllerTypeList;
  ContactCenterSystemTypes?: ContactCenterSystemTypeList;
}
export const ExternalSystemsConfiguration = S.suspend(() =>
  S.Struct({
    SessionBorderControllerTypes: S.optional(SessionBorderControllerTypeList),
    ContactCenterSystemTypes: S.optional(ContactCenterSystemTypeList),
  }),
).annotations({
  identifier: "ExternalSystemsConfiguration",
}) as any as S.Schema<ExternalSystemsConfiguration>;
export interface PutVoiceConnectorExternalSystemsConfigurationResponse {
  ExternalSystemsConfiguration?: ExternalSystemsConfiguration;
}
export const PutVoiceConnectorExternalSystemsConfigurationResponse = S.suspend(
  () =>
    S.Struct({
      ExternalSystemsConfiguration: S.optional(ExternalSystemsConfiguration),
    }),
).annotations({
  identifier: "PutVoiceConnectorExternalSystemsConfigurationResponse",
}) as any as S.Schema<PutVoiceConnectorExternalSystemsConfigurationResponse>;
export interface PutVoiceConnectorLoggingConfigurationRequest {
  VoiceConnectorId: string;
  LoggingConfiguration: LoggingConfiguration;
}
export const PutVoiceConnectorLoggingConfigurationRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    LoggingConfiguration: LoggingConfiguration,
  }).pipe(
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
  ),
).annotations({
  identifier: "PutVoiceConnectorLoggingConfigurationRequest",
}) as any as S.Schema<PutVoiceConnectorLoggingConfigurationRequest>;
export interface Proxy {
  DefaultSessionExpiryMinutes?: number;
  Disabled?: boolean;
  FallBackPhoneNumber?: string | Redacted.Redacted<string>;
  PhoneNumberCountries?: StringList;
}
export const Proxy = S.suspend(() =>
  S.Struct({
    DefaultSessionExpiryMinutes: S.optional(S.Number),
    Disabled: S.optional(S.Boolean),
    FallBackPhoneNumber: S.optional(SensitiveString),
    PhoneNumberCountries: S.optional(StringList),
  }),
).annotations({ identifier: "Proxy" }) as any as S.Schema<Proxy>;
export interface PutVoiceConnectorProxyResponse {
  Proxy?: Proxy;
}
export const PutVoiceConnectorProxyResponse = S.suspend(() =>
  S.Struct({ Proxy: S.optional(Proxy) }),
).annotations({
  identifier: "PutVoiceConnectorProxyResponse",
}) as any as S.Schema<PutVoiceConnectorProxyResponse>;
export interface PutVoiceConnectorTerminationRequest {
  VoiceConnectorId: string;
  Termination: Termination;
}
export const PutVoiceConnectorTerminationRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    Termination: Termination,
  }).pipe(
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
  ),
).annotations({
  identifier: "PutVoiceConnectorTerminationRequest",
}) as any as S.Schema<PutVoiceConnectorTerminationRequest>;
export interface PutVoiceConnectorTerminationCredentialsRequest {
  VoiceConnectorId: string;
  Credentials?: CredentialList;
}
export const PutVoiceConnectorTerminationCredentialsRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    Credentials: S.optional(CredentialList),
  }).pipe(
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
  ),
).annotations({
  identifier: "PutVoiceConnectorTerminationCredentialsRequest",
}) as any as S.Schema<PutVoiceConnectorTerminationCredentialsRequest>;
export interface PutVoiceConnectorTerminationCredentialsResponse {}
export const PutVoiceConnectorTerminationCredentialsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutVoiceConnectorTerminationCredentialsResponse",
}) as any as S.Schema<PutVoiceConnectorTerminationCredentialsResponse>;
export interface RestorePhoneNumberResponse {
  PhoneNumber?: PhoneNumber;
}
export const RestorePhoneNumberResponse = S.suspend(() =>
  S.Struct({ PhoneNumber: S.optional(PhoneNumber) }),
).annotations({
  identifier: "RestorePhoneNumberResponse",
}) as any as S.Schema<RestorePhoneNumberResponse>;
export interface SearchAvailablePhoneNumbersResponse {
  E164PhoneNumbers?: E164PhoneNumberList;
  NextToken?: string;
}
export const SearchAvailablePhoneNumbersResponse = S.suspend(() =>
  S.Struct({
    E164PhoneNumbers: S.optional(E164PhoneNumberList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchAvailablePhoneNumbersResponse",
}) as any as S.Schema<SearchAvailablePhoneNumbersResponse>;
export interface CallDetails {
  VoiceConnectorId?: string;
  TransactionId?: string;
  IsCaller?: boolean;
}
export const CallDetails = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.optional(S.String),
    TransactionId: S.optional(S.String),
    IsCaller: S.optional(S.Boolean),
  }),
).annotations({ identifier: "CallDetails" }) as any as S.Schema<CallDetails>;
export interface SpeakerSearchResult {
  ConfidenceScore?: number;
  VoiceProfileId?: string;
}
export const SpeakerSearchResult = S.suspend(() =>
  S.Struct({
    ConfidenceScore: S.optional(S.Number),
    VoiceProfileId: S.optional(S.String),
  }),
).annotations({
  identifier: "SpeakerSearchResult",
}) as any as S.Schema<SpeakerSearchResult>;
export type SpeakerSearchResultList = SpeakerSearchResult[];
export const SpeakerSearchResultList = S.Array(SpeakerSearchResult);
export interface SpeakerSearchDetails {
  Results?: SpeakerSearchResultList;
  VoiceprintGenerationStatus?: string;
}
export const SpeakerSearchDetails = S.suspend(() =>
  S.Struct({
    Results: S.optional(SpeakerSearchResultList),
    VoiceprintGenerationStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "SpeakerSearchDetails",
}) as any as S.Schema<SpeakerSearchDetails>;
export interface SpeakerSearchTask {
  SpeakerSearchTaskId?: string;
  SpeakerSearchTaskStatus?: string;
  CallDetails?: CallDetails;
  SpeakerSearchDetails?: SpeakerSearchDetails;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
  StartedTimestamp?: Date;
  StatusMessage?: string;
}
export const SpeakerSearchTask = S.suspend(() =>
  S.Struct({
    SpeakerSearchTaskId: S.optional(S.String),
    SpeakerSearchTaskStatus: S.optional(S.String),
    CallDetails: S.optional(CallDetails),
    SpeakerSearchDetails: S.optional(SpeakerSearchDetails),
    CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    StartedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "SpeakerSearchTask",
}) as any as S.Schema<SpeakerSearchTask>;
export interface StartSpeakerSearchTaskResponse {
  SpeakerSearchTask?: SpeakerSearchTask;
}
export const StartSpeakerSearchTaskResponse = S.suspend(() =>
  S.Struct({ SpeakerSearchTask: S.optional(SpeakerSearchTask) }),
).annotations({
  identifier: "StartSpeakerSearchTaskResponse",
}) as any as S.Schema<StartSpeakerSearchTaskResponse>;
export interface VoiceToneAnalysisTask {
  VoiceToneAnalysisTaskId?: string;
  VoiceToneAnalysisTaskStatus?: string;
  CallDetails?: CallDetails;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
  StartedTimestamp?: Date;
  StatusMessage?: string;
}
export const VoiceToneAnalysisTask = S.suspend(() =>
  S.Struct({
    VoiceToneAnalysisTaskId: S.optional(S.String),
    VoiceToneAnalysisTaskStatus: S.optional(S.String),
    CallDetails: S.optional(CallDetails),
    CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    StartedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "VoiceToneAnalysisTask",
}) as any as S.Schema<VoiceToneAnalysisTask>;
export interface StartVoiceToneAnalysisTaskResponse {
  VoiceToneAnalysisTask?: VoiceToneAnalysisTask;
}
export const StartVoiceToneAnalysisTaskResponse = S.suspend(() =>
  S.Struct({ VoiceToneAnalysisTask: S.optional(VoiceToneAnalysisTask) }),
).annotations({
  identifier: "StartVoiceToneAnalysisTaskResponse",
}) as any as S.Schema<StartVoiceToneAnalysisTaskResponse>;
export interface UpdatePhoneNumberResponse {
  PhoneNumber?: PhoneNumber;
}
export const UpdatePhoneNumberResponse = S.suspend(() =>
  S.Struct({ PhoneNumber: S.optional(PhoneNumber) }),
).annotations({
  identifier: "UpdatePhoneNumberResponse",
}) as any as S.Schema<UpdatePhoneNumberResponse>;
export interface UpdateProxySessionResponse {
  ProxySession?: ProxySession;
}
export const UpdateProxySessionResponse = S.suspend(() =>
  S.Struct({ ProxySession: S.optional(ProxySession) }),
).annotations({
  identifier: "UpdateProxySessionResponse",
}) as any as S.Schema<UpdateProxySessionResponse>;
export interface UpdateSipMediaApplicationResponse {
  SipMediaApplication?: SipMediaApplication;
}
export const UpdateSipMediaApplicationResponse = S.suspend(() =>
  S.Struct({ SipMediaApplication: S.optional(SipMediaApplication) }),
).annotations({
  identifier: "UpdateSipMediaApplicationResponse",
}) as any as S.Schema<UpdateSipMediaApplicationResponse>;
export interface UpdateSipMediaApplicationCallRequest {
  SipMediaApplicationId: string;
  TransactionId: string;
  Arguments: SMAUpdateCallArgumentsMap;
}
export const UpdateSipMediaApplicationCallRequest = S.suspend(() =>
  S.Struct({
    SipMediaApplicationId: S.String.pipe(T.HttpLabel("SipMediaApplicationId")),
    TransactionId: S.String.pipe(T.HttpLabel("TransactionId")),
    Arguments: SMAUpdateCallArgumentsMap,
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateSipMediaApplicationCallRequest",
}) as any as S.Schema<UpdateSipMediaApplicationCallRequest>;
export interface UpdateSipRuleResponse {
  SipRule?: SipRule;
}
export const UpdateSipRuleResponse = S.suspend(() =>
  S.Struct({ SipRule: S.optional(SipRule) }),
).annotations({
  identifier: "UpdateSipRuleResponse",
}) as any as S.Schema<UpdateSipRuleResponse>;
export interface UpdateVoiceConnectorResponse {
  VoiceConnector?: VoiceConnector;
}
export const UpdateVoiceConnectorResponse = S.suspend(() =>
  S.Struct({ VoiceConnector: S.optional(VoiceConnector) }),
).annotations({
  identifier: "UpdateVoiceConnectorResponse",
}) as any as S.Schema<UpdateVoiceConnectorResponse>;
export interface UpdateVoiceConnectorGroupResponse {
  VoiceConnectorGroup?: VoiceConnectorGroup;
}
export const UpdateVoiceConnectorGroupResponse = S.suspend(() =>
  S.Struct({ VoiceConnectorGroup: S.optional(VoiceConnectorGroup) }),
).annotations({
  identifier: "UpdateVoiceConnectorGroupResponse",
}) as any as S.Schema<UpdateVoiceConnectorGroupResponse>;
export interface UpdateVoiceProfileResponse {
  VoiceProfile?: VoiceProfile;
}
export const UpdateVoiceProfileResponse = S.suspend(() =>
  S.Struct({ VoiceProfile: S.optional(VoiceProfile) }),
).annotations({
  identifier: "UpdateVoiceProfileResponse",
}) as any as S.Schema<UpdateVoiceProfileResponse>;
export interface VoiceProfileDomain {
  VoiceProfileDomainId?: string;
  VoiceProfileDomainArn?: string | Redacted.Redacted<string>;
  Name?: string;
  Description?: string;
  ServerSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
}
export const VoiceProfileDomain = S.suspend(() =>
  S.Struct({
    VoiceProfileDomainId: S.optional(S.String),
    VoiceProfileDomainArn: S.optional(SensitiveString),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ServerSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
    CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "VoiceProfileDomain",
}) as any as S.Schema<VoiceProfileDomain>;
export interface UpdateVoiceProfileDomainResponse {
  VoiceProfileDomain?: VoiceProfileDomain;
}
export const UpdateVoiceProfileDomainResponse = S.suspend(() =>
  S.Struct({ VoiceProfileDomain: S.optional(VoiceProfileDomain) }),
).annotations({
  identifier: "UpdateVoiceProfileDomainResponse",
}) as any as S.Schema<UpdateVoiceProfileDomainResponse>;
export type PhoneNumberTypeList = string[];
export const PhoneNumberTypeList = S.Array(S.String);
export interface TerminationHealth {
  Timestamp?: Date;
  Source?: string;
}
export const TerminationHealth = S.suspend(() =>
  S.Struct({
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Source: S.optional(S.String),
  }),
).annotations({
  identifier: "TerminationHealth",
}) as any as S.Schema<TerminationHealth>;
export interface PhoneNumberCountry {
  CountryCode?: string;
  SupportedPhoneNumberTypes?: PhoneNumberTypeList;
}
export const PhoneNumberCountry = S.suspend(() =>
  S.Struct({
    CountryCode: S.optional(S.String),
    SupportedPhoneNumberTypes: S.optional(PhoneNumberTypeList),
  }),
).annotations({
  identifier: "PhoneNumberCountry",
}) as any as S.Schema<PhoneNumberCountry>;
export type PhoneNumberCountriesList = PhoneNumberCountry[];
export const PhoneNumberCountriesList = S.Array(PhoneNumberCountry);
export interface VoiceProfileDomainSummary {
  VoiceProfileDomainId?: string;
  VoiceProfileDomainArn?: string | Redacted.Redacted<string>;
  Name?: string;
  Description?: string;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
}
export const VoiceProfileDomainSummary = S.suspend(() =>
  S.Struct({
    VoiceProfileDomainId: S.optional(S.String),
    VoiceProfileDomainArn: S.optional(SensitiveString),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "VoiceProfileDomainSummary",
}) as any as S.Schema<VoiceProfileDomainSummary>;
export type VoiceProfileDomainSummaryList = VoiceProfileDomainSummary[];
export const VoiceProfileDomainSummaryList = S.Array(VoiceProfileDomainSummary);
export interface VoiceProfileSummary {
  VoiceProfileId?: string;
  VoiceProfileArn?: string | Redacted.Redacted<string>;
  VoiceProfileDomainId?: string;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
  ExpirationTimestamp?: Date;
}
export const VoiceProfileSummary = S.suspend(() =>
  S.Struct({
    VoiceProfileId: S.optional(S.String),
    VoiceProfileArn: S.optional(SensitiveString),
    VoiceProfileDomainId: S.optional(S.String),
    CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ExpirationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "VoiceProfileSummary",
}) as any as S.Schema<VoiceProfileSummary>;
export type VoiceProfileSummaryList = VoiceProfileSummary[];
export const VoiceProfileSummaryList = S.Array(VoiceProfileSummary);
export interface Address {
  streetName?: string | Redacted.Redacted<string>;
  streetSuffix?: string | Redacted.Redacted<string>;
  postDirectional?: string | Redacted.Redacted<string>;
  preDirectional?: string | Redacted.Redacted<string>;
  streetNumber?: string | Redacted.Redacted<string>;
  city?: string | Redacted.Redacted<string>;
  state?: string | Redacted.Redacted<string>;
  postalCode?: string | Redacted.Redacted<string>;
  postalCodePlus4?: string | Redacted.Redacted<string>;
  country?: string | Redacted.Redacted<string>;
}
export const Address = S.suspend(() =>
  S.Struct({
    streetName: S.optional(SensitiveString),
    streetSuffix: S.optional(SensitiveString),
    postDirectional: S.optional(SensitiveString),
    preDirectional: S.optional(SensitiveString),
    streetNumber: S.optional(SensitiveString),
    city: S.optional(SensitiveString),
    state: S.optional(SensitiveString),
    postalCode: S.optional(SensitiveString),
    postalCodePlus4: S.optional(SensitiveString),
    country: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Address" }) as any as S.Schema<Address>;
export interface CandidateAddress {
  streetInfo?: string | Redacted.Redacted<string>;
  streetNumber?: string | Redacted.Redacted<string>;
  city?: string | Redacted.Redacted<string>;
  state?: string | Redacted.Redacted<string>;
  postalCode?: string | Redacted.Redacted<string>;
  postalCodePlus4?: string | Redacted.Redacted<string>;
  country?: string | Redacted.Redacted<string>;
}
export const CandidateAddress = S.suspend(() =>
  S.Struct({
    streetInfo: S.optional(SensitiveString),
    streetNumber: S.optional(SensitiveString),
    city: S.optional(SensitiveString),
    state: S.optional(SensitiveString),
    postalCode: S.optional(SensitiveString),
    postalCodePlus4: S.optional(SensitiveString),
    country: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "CandidateAddress",
}) as any as S.Schema<CandidateAddress>;
export type CandidateAddressList = CandidateAddress[];
export const CandidateAddressList = S.Array(
  CandidateAddress.pipe(T.XmlName("CandidateAddress")).annotations({
    identifier: "CandidateAddress",
  }),
);
export interface AssociatePhoneNumbersWithVoiceConnectorResponse {
  PhoneNumberErrors?: PhoneNumberErrorList;
}
export const AssociatePhoneNumbersWithVoiceConnectorResponse = S.suspend(() =>
  S.Struct({ PhoneNumberErrors: S.optional(PhoneNumberErrorList) }),
).annotations({
  identifier: "AssociatePhoneNumbersWithVoiceConnectorResponse",
}) as any as S.Schema<AssociatePhoneNumbersWithVoiceConnectorResponse>;
export interface BatchUpdatePhoneNumberResponse {
  PhoneNumberErrors?: PhoneNumberErrorList;
}
export const BatchUpdatePhoneNumberResponse = S.suspend(() =>
  S.Struct({ PhoneNumberErrors: S.optional(PhoneNumberErrorList) }),
).annotations({
  identifier: "BatchUpdatePhoneNumberResponse",
}) as any as S.Schema<BatchUpdatePhoneNumberResponse>;
export interface CreateProxySessionResponse {
  ProxySession?: ProxySession;
}
export const CreateProxySessionResponse = S.suspend(() =>
  S.Struct({ ProxySession: S.optional(ProxySession) }),
).annotations({
  identifier: "CreateProxySessionResponse",
}) as any as S.Schema<CreateProxySessionResponse>;
export interface CreateSipMediaApplicationResponse {
  SipMediaApplication?: SipMediaApplication;
}
export const CreateSipMediaApplicationResponse = S.suspend(() =>
  S.Struct({ SipMediaApplication: S.optional(SipMediaApplication) }),
).annotations({
  identifier: "CreateSipMediaApplicationResponse",
}) as any as S.Schema<CreateSipMediaApplicationResponse>;
export interface CreateSipRuleResponse {
  SipRule?: SipRule;
}
export const CreateSipRuleResponse = S.suspend(() =>
  S.Struct({ SipRule: S.optional(SipRule) }),
).annotations({
  identifier: "CreateSipRuleResponse",
}) as any as S.Schema<CreateSipRuleResponse>;
export interface CreateVoiceConnectorResponse {
  VoiceConnector?: VoiceConnector;
}
export const CreateVoiceConnectorResponse = S.suspend(() =>
  S.Struct({ VoiceConnector: S.optional(VoiceConnector) }),
).annotations({
  identifier: "CreateVoiceConnectorResponse",
}) as any as S.Schema<CreateVoiceConnectorResponse>;
export interface CreateVoiceConnectorGroupResponse {
  VoiceConnectorGroup?: VoiceConnectorGroup;
}
export const CreateVoiceConnectorGroupResponse = S.suspend(() =>
  S.Struct({ VoiceConnectorGroup: S.optional(VoiceConnectorGroup) }),
).annotations({
  identifier: "CreateVoiceConnectorGroupResponse",
}) as any as S.Schema<CreateVoiceConnectorGroupResponse>;
export interface CreateVoiceProfileResponse {
  VoiceProfile?: VoiceProfile;
}
export const CreateVoiceProfileResponse = S.suspend(() =>
  S.Struct({ VoiceProfile: S.optional(VoiceProfile) }),
).annotations({
  identifier: "CreateVoiceProfileResponse",
}) as any as S.Schema<CreateVoiceProfileResponse>;
export interface CreateVoiceProfileDomainResponse {
  VoiceProfileDomain?: VoiceProfileDomain;
}
export const CreateVoiceProfileDomainResponse = S.suspend(() =>
  S.Struct({ VoiceProfileDomain: S.optional(VoiceProfileDomain) }),
).annotations({
  identifier: "CreateVoiceProfileDomainResponse",
}) as any as S.Schema<CreateVoiceProfileDomainResponse>;
export interface GetSipMediaApplicationResponse {
  SipMediaApplication?: SipMediaApplication;
}
export const GetSipMediaApplicationResponse = S.suspend(() =>
  S.Struct({ SipMediaApplication: S.optional(SipMediaApplication) }),
).annotations({
  identifier: "GetSipMediaApplicationResponse",
}) as any as S.Schema<GetSipMediaApplicationResponse>;
export interface GetSipRuleResponse {
  SipRule?: SipRule;
}
export const GetSipRuleResponse = S.suspend(() =>
  S.Struct({ SipRule: S.optional(SipRule) }),
).annotations({
  identifier: "GetSipRuleResponse",
}) as any as S.Schema<GetSipRuleResponse>;
export interface GetVoiceConnectorExternalSystemsConfigurationResponse {
  ExternalSystemsConfiguration?: ExternalSystemsConfiguration;
}
export const GetVoiceConnectorExternalSystemsConfigurationResponse = S.suspend(
  () =>
    S.Struct({
      ExternalSystemsConfiguration: S.optional(ExternalSystemsConfiguration),
    }),
).annotations({
  identifier: "GetVoiceConnectorExternalSystemsConfigurationResponse",
}) as any as S.Schema<GetVoiceConnectorExternalSystemsConfigurationResponse>;
export interface GetVoiceConnectorGroupResponse {
  VoiceConnectorGroup?: VoiceConnectorGroup;
}
export const GetVoiceConnectorGroupResponse = S.suspend(() =>
  S.Struct({ VoiceConnectorGroup: S.optional(VoiceConnectorGroup) }),
).annotations({
  identifier: "GetVoiceConnectorGroupResponse",
}) as any as S.Schema<GetVoiceConnectorGroupResponse>;
export interface GetVoiceConnectorProxyResponse {
  Proxy?: Proxy;
}
export const GetVoiceConnectorProxyResponse = S.suspend(() =>
  S.Struct({ Proxy: S.optional(Proxy) }),
).annotations({
  identifier: "GetVoiceConnectorProxyResponse",
}) as any as S.Schema<GetVoiceConnectorProxyResponse>;
export interface GetVoiceConnectorTerminationHealthResponse {
  TerminationHealth?: TerminationHealth;
}
export const GetVoiceConnectorTerminationHealthResponse = S.suspend(() =>
  S.Struct({ TerminationHealth: S.optional(TerminationHealth) }),
).annotations({
  identifier: "GetVoiceConnectorTerminationHealthResponse",
}) as any as S.Schema<GetVoiceConnectorTerminationHealthResponse>;
export interface GetVoiceProfileDomainResponse {
  VoiceProfileDomain?: VoiceProfileDomain;
}
export const GetVoiceProfileDomainResponse = S.suspend(() =>
  S.Struct({ VoiceProfileDomain: S.optional(VoiceProfileDomain) }),
).annotations({
  identifier: "GetVoiceProfileDomainResponse",
}) as any as S.Schema<GetVoiceProfileDomainResponse>;
export interface GetVoiceToneAnalysisTaskResponse {
  VoiceToneAnalysisTask?: VoiceToneAnalysisTask;
}
export const GetVoiceToneAnalysisTaskResponse = S.suspend(() =>
  S.Struct({ VoiceToneAnalysisTask: S.optional(VoiceToneAnalysisTask) }),
).annotations({
  identifier: "GetVoiceToneAnalysisTaskResponse",
}) as any as S.Schema<GetVoiceToneAnalysisTaskResponse>;
export interface ListSupportedPhoneNumberCountriesResponse {
  PhoneNumberCountries?: PhoneNumberCountriesList;
}
export const ListSupportedPhoneNumberCountriesResponse = S.suspend(() =>
  S.Struct({ PhoneNumberCountries: S.optional(PhoneNumberCountriesList) }),
).annotations({
  identifier: "ListSupportedPhoneNumberCountriesResponse",
}) as any as S.Schema<ListSupportedPhoneNumberCountriesResponse>;
export interface ListVoiceProfileDomainsResponse {
  VoiceProfileDomains?: VoiceProfileDomainSummaryList;
  NextToken?: string;
}
export const ListVoiceProfileDomainsResponse = S.suspend(() =>
  S.Struct({
    VoiceProfileDomains: S.optional(VoiceProfileDomainSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListVoiceProfileDomainsResponse",
}) as any as S.Schema<ListVoiceProfileDomainsResponse>;
export interface ListVoiceProfilesResponse {
  VoiceProfiles?: VoiceProfileSummaryList;
  NextToken?: string;
}
export const ListVoiceProfilesResponse = S.suspend(() =>
  S.Struct({
    VoiceProfiles: S.optional(VoiceProfileSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListVoiceProfilesResponse",
}) as any as S.Schema<ListVoiceProfilesResponse>;
export interface PutSipMediaApplicationAlexaSkillConfigurationResponse {
  SipMediaApplicationAlexaSkillConfiguration?: SipMediaApplicationAlexaSkillConfiguration;
}
export const PutSipMediaApplicationAlexaSkillConfigurationResponse = S.suspend(
  () =>
    S.Struct({
      SipMediaApplicationAlexaSkillConfiguration: S.optional(
        SipMediaApplicationAlexaSkillConfiguration,
      ),
    }),
).annotations({
  identifier: "PutSipMediaApplicationAlexaSkillConfigurationResponse",
}) as any as S.Schema<PutSipMediaApplicationAlexaSkillConfigurationResponse>;
export interface PutSipMediaApplicationLoggingConfigurationResponse {
  SipMediaApplicationLoggingConfiguration?: SipMediaApplicationLoggingConfiguration;
}
export const PutSipMediaApplicationLoggingConfigurationResponse = S.suspend(
  () =>
    S.Struct({
      SipMediaApplicationLoggingConfiguration: S.optional(
        SipMediaApplicationLoggingConfiguration,
      ),
    }),
).annotations({
  identifier: "PutSipMediaApplicationLoggingConfigurationResponse",
}) as any as S.Schema<PutSipMediaApplicationLoggingConfigurationResponse>;
export interface PutVoiceConnectorEmergencyCallingConfigurationRequest {
  VoiceConnectorId: string;
  EmergencyCallingConfiguration: EmergencyCallingConfiguration;
}
export const PutVoiceConnectorEmergencyCallingConfigurationRequest = S.suspend(
  () =>
    S.Struct({
      VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
      EmergencyCallingConfiguration: EmergencyCallingConfiguration,
    }).pipe(
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
    ),
).annotations({
  identifier: "PutVoiceConnectorEmergencyCallingConfigurationRequest",
}) as any as S.Schema<PutVoiceConnectorEmergencyCallingConfigurationRequest>;
export interface PutVoiceConnectorLoggingConfigurationResponse {
  LoggingConfiguration?: LoggingConfiguration;
}
export const PutVoiceConnectorLoggingConfigurationResponse = S.suspend(() =>
  S.Struct({ LoggingConfiguration: S.optional(LoggingConfiguration) }),
).annotations({
  identifier: "PutVoiceConnectorLoggingConfigurationResponse",
}) as any as S.Schema<PutVoiceConnectorLoggingConfigurationResponse>;
export interface PutVoiceConnectorOriginationRequest {
  VoiceConnectorId: string;
  Origination: Origination;
}
export const PutVoiceConnectorOriginationRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    Origination: Origination,
  }).pipe(
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
  ),
).annotations({
  identifier: "PutVoiceConnectorOriginationRequest",
}) as any as S.Schema<PutVoiceConnectorOriginationRequest>;
export interface PutVoiceConnectorStreamingConfigurationRequest {
  VoiceConnectorId: string;
  StreamingConfiguration: StreamingConfiguration;
}
export const PutVoiceConnectorStreamingConfigurationRequest = S.suspend(() =>
  S.Struct({
    VoiceConnectorId: S.String.pipe(T.HttpLabel("VoiceConnectorId")),
    StreamingConfiguration: StreamingConfiguration,
  }).pipe(
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
  ),
).annotations({
  identifier: "PutVoiceConnectorStreamingConfigurationRequest",
}) as any as S.Schema<PutVoiceConnectorStreamingConfigurationRequest>;
export interface PutVoiceConnectorTerminationResponse {
  Termination?: Termination;
}
export const PutVoiceConnectorTerminationResponse = S.suspend(() =>
  S.Struct({ Termination: S.optional(Termination) }),
).annotations({
  identifier: "PutVoiceConnectorTerminationResponse",
}) as any as S.Schema<PutVoiceConnectorTerminationResponse>;
export interface SipMediaApplicationCall {
  TransactionId?: string;
}
export const SipMediaApplicationCall = S.suspend(() =>
  S.Struct({ TransactionId: S.optional(S.String) }),
).annotations({
  identifier: "SipMediaApplicationCall",
}) as any as S.Schema<SipMediaApplicationCall>;
export interface UpdateSipMediaApplicationCallResponse {
  SipMediaApplicationCall?: SipMediaApplicationCall;
}
export const UpdateSipMediaApplicationCallResponse = S.suspend(() =>
  S.Struct({ SipMediaApplicationCall: S.optional(SipMediaApplicationCall) }),
).annotations({
  identifier: "UpdateSipMediaApplicationCallResponse",
}) as any as S.Schema<UpdateSipMediaApplicationCallResponse>;
export interface ValidateE911AddressResponse {
  ValidationResult?: number;
  AddressExternalId?: string;
  Address?: Address;
  CandidateAddressList?: CandidateAddressList;
}
export const ValidateE911AddressResponse = S.suspend(() =>
  S.Struct({
    ValidationResult: S.optional(S.Number),
    AddressExternalId: S.optional(S.String),
    Address: S.optional(Address),
    CandidateAddressList: S.optional(CandidateAddressList),
  }),
).annotations({
  identifier: "ValidateE911AddressResponse",
}) as any as S.Schema<ValidateE911AddressResponse>;
export interface CreatePhoneNumberOrderResponse {
  PhoneNumberOrder?: PhoneNumberOrder;
}
export const CreatePhoneNumberOrderResponse = S.suspend(() =>
  S.Struct({ PhoneNumberOrder: S.optional(PhoneNumberOrder) }),
).annotations({
  identifier: "CreatePhoneNumberOrderResponse",
}) as any as S.Schema<CreatePhoneNumberOrderResponse>;
export interface CreateSipMediaApplicationCallResponse {
  SipMediaApplicationCall?: SipMediaApplicationCall;
}
export const CreateSipMediaApplicationCallResponse = S.suspend(() =>
  S.Struct({ SipMediaApplicationCall: S.optional(SipMediaApplicationCall) }),
).annotations({
  identifier: "CreateSipMediaApplicationCallResponse",
}) as any as S.Schema<CreateSipMediaApplicationCallResponse>;
export interface GetPhoneNumberResponse {
  PhoneNumber?: PhoneNumber;
}
export const GetPhoneNumberResponse = S.suspend(() =>
  S.Struct({ PhoneNumber: S.optional(PhoneNumber) }),
).annotations({
  identifier: "GetPhoneNumberResponse",
}) as any as S.Schema<GetPhoneNumberResponse>;
export interface GetProxySessionResponse {
  ProxySession?: ProxySession;
}
export const GetProxySessionResponse = S.suspend(() =>
  S.Struct({ ProxySession: S.optional(ProxySession) }),
).annotations({
  identifier: "GetProxySessionResponse",
}) as any as S.Schema<GetProxySessionResponse>;
export interface PutVoiceConnectorEmergencyCallingConfigurationResponse {
  EmergencyCallingConfiguration?: EmergencyCallingConfiguration;
}
export const PutVoiceConnectorEmergencyCallingConfigurationResponse = S.suspend(
  () =>
    S.Struct({
      EmergencyCallingConfiguration: S.optional(EmergencyCallingConfiguration),
    }),
).annotations({
  identifier: "PutVoiceConnectorEmergencyCallingConfigurationResponse",
}) as any as S.Schema<PutVoiceConnectorEmergencyCallingConfigurationResponse>;
export interface PutVoiceConnectorOriginationResponse {
  Origination?: Origination;
}
export const PutVoiceConnectorOriginationResponse = S.suspend(() =>
  S.Struct({ Origination: S.optional(Origination) }),
).annotations({
  identifier: "PutVoiceConnectorOriginationResponse",
}) as any as S.Schema<PutVoiceConnectorOriginationResponse>;
export interface PutVoiceConnectorStreamingConfigurationResponse {
  StreamingConfiguration?: StreamingConfiguration;
}
export const PutVoiceConnectorStreamingConfigurationResponse = S.suspend(() =>
  S.Struct({ StreamingConfiguration: S.optional(StreamingConfiguration) }),
).annotations({
  identifier: "PutVoiceConnectorStreamingConfigurationResponse",
}) as any as S.Schema<PutVoiceConnectorStreamingConfigurationResponse>;
export interface GetSpeakerSearchTaskResponse {
  SpeakerSearchTask?: SpeakerSearchTask;
}
export const GetSpeakerSearchTaskResponse = S.suspend(() =>
  S.Struct({ SpeakerSearchTask: S.optional(SpeakerSearchTask) }),
).annotations({
  identifier: "GetSpeakerSearchTaskResponse",
}) as any as S.Schema<GetSpeakerSearchTaskResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceFailureException extends S.TaggedError<ServiceFailureException>()(
  "ServiceFailureException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class GoneException extends S.TaggedError<GoneException>()(
  "GoneException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ThrottledClientException extends S.TaggedError<ThrottledClientException>()(
  "ThrottledClientException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class UnauthorizedClientException extends S.TaggedError<UnauthorizedClientException>()(
  "UnauthorizedClientException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class UnprocessableEntityException extends S.TaggedError<UnprocessableEntityException>()(
  "UnprocessableEntityException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a list of the tags in a given resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putVoiceConnectorEmergencyCallingConfiguration: (
  input: PutVoiceConnectorEmergencyCallingConfigurationRequest,
) => Effect.Effect<
  PutVoiceConnectorEmergencyCallingConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putVoiceConnectorOrigination: (
  input: PutVoiceConnectorOriginationRequest,
) => Effect.Effect<
  PutVoiceConnectorOriginationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putVoiceConnectorStreamingConfiguration: (
  input: PutVoiceConnectorStreamingConfigurationRequest,
) => Effect.Effect<
  PutVoiceConnectorStreamingConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createVoiceConnector: (
  input: CreateVoiceConnectorRequest,
) => Effect.Effect<
  CreateVoiceConnectorResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes a voice profile, including its voice print and enrollment data. WARNING: This action is not reversible.
 */
export const deleteVoiceProfile: (
  input: DeleteVoiceProfileRequest,
) => Effect.Effect<
  DeleteVoiceProfileResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSipMediaApplication: (
  input: GetSipMediaApplicationRequest,
) => Effect.Effect<
  GetSipMediaApplicationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves the details of a SIP rule, such as the rule ID, name, triggers, and
 * target endpoints.
 */
export const getSipRule: (
  input: GetSipRuleRequest,
) => Effect.Effect<
  GetSipRuleResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getVoiceConnectorExternalSystemsConfiguration: (
  input: GetVoiceConnectorExternalSystemsConfigurationRequest,
) => Effect.Effect<
  GetVoiceConnectorExternalSystemsConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getVoiceConnectorGroup: (
  input: GetVoiceConnectorGroupRequest,
) => Effect.Effect<
  GetVoiceConnectorGroupResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves the proxy configuration details for the specified Amazon Chime SDK Voice
 * Connector.
 */
export const getVoiceConnectorProxy: (
  input: GetVoiceConnectorProxyRequest,
) => Effect.Effect<
  GetVoiceConnectorProxyResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves information about the last time a `SIP OPTIONS` ping
 * was received from your SIP infrastructure for the specified Amazon Chime SDK Voice
 * Connector.
 */
export const getVoiceConnectorTerminationHealth: (
  input: GetVoiceConnectorTerminationHealthRequest,
) => Effect.Effect<
  GetVoiceConnectorTerminationHealthResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getVoiceProfileDomain: (
  input: GetVoiceProfileDomainRequest,
) => Effect.Effect<
  GetVoiceProfileDomainResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves the details of a voice tone analysis task.
 */
export const getVoiceToneAnalysisTask: (
  input: GetVoiceToneAnalysisTaskRequest,
) => Effect.Effect<
  GetVoiceToneAnalysisTaskResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists the specified voice profile domains in the administrator's AWS account.
 */
export const listVoiceProfileDomains: {
  (
    input: ListVoiceProfileDomainsRequest,
  ): Effect.Effect<
    ListVoiceProfileDomainsResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVoiceProfileDomainsRequest,
  ) => Stream.Stream<
    ListVoiceProfileDomainsResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVoiceProfileDomainsRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listVoiceProfiles: {
  (
    input: ListVoiceProfilesRequest,
  ): Effect.Effect<
    ListVoiceProfilesResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVoiceProfilesRequest,
  ) => Stream.Stream<
    ListVoiceProfilesResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVoiceProfilesRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Updates the Alexa Skill configuration for the SIP media application.
 *
 * Due to changes made by the Amazon Alexa service, this API is no longer available for use. For more information, refer to
 * the Alexa Smart Properties page.
 */
export const putSipMediaApplicationAlexaSkillConfiguration: (
  input: PutSipMediaApplicationAlexaSkillConfigurationRequest,
) => Effect.Effect<
  PutSipMediaApplicationAlexaSkillConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putSipMediaApplicationLoggingConfiguration: (
  input: PutSipMediaApplicationLoggingConfigurationRequest,
) => Effect.Effect<
  PutSipMediaApplicationLoggingConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putVoiceConnectorLoggingConfiguration: (
  input: PutVoiceConnectorLoggingConfigurationRequest,
) => Effect.Effect<
  PutVoiceConnectorLoggingConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putVoiceConnectorTermination: (
  input: PutVoiceConnectorTerminationRequest,
) => Effect.Effect<
  PutVoiceConnectorTerminationResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSipMediaApplicationCall: (
  input: UpdateSipMediaApplicationCallRequest,
) => Effect.Effect<
  UpdateSipMediaApplicationCallResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const validateE911Address: (
  input: ValidateE911AddressRequest,
) => Effect.Effect<
  ValidateE911AddressResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociatePhoneNumbersFromVoiceConnector: (
  input: DisassociatePhoneNumbersFromVoiceConnectorRequest,
) => Effect.Effect<
  DisassociatePhoneNumbersFromVoiceConnectorResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociatePhoneNumbersFromVoiceConnectorGroup: (
  input: DisassociatePhoneNumbersFromVoiceConnectorGroupRequest,
) => Effect.Effect<
  DisassociatePhoneNumbersFromVoiceConnectorGroupResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPhoneNumberOrder: (
  input: GetPhoneNumberOrderRequest,
) => Effect.Effect<
  GetPhoneNumberOrderResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSipMediaApplicationAlexaSkillConfiguration: (
  input: GetSipMediaApplicationAlexaSkillConfigurationRequest,
) => Effect.Effect<
  GetSipMediaApplicationAlexaSkillConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSipMediaApplicationLoggingConfiguration: (
  input: GetSipMediaApplicationLoggingConfigurationRequest,
) => Effect.Effect<
  GetSipMediaApplicationLoggingConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getVoiceConnector: (
  input: GetVoiceConnectorRequest,
) => Effect.Effect<
  GetVoiceConnectorResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getVoiceConnectorEmergencyCallingConfiguration: (
  input: GetVoiceConnectorEmergencyCallingConfigurationRequest,
) => Effect.Effect<
  GetVoiceConnectorEmergencyCallingConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getVoiceConnectorLoggingConfiguration: (
  input: GetVoiceConnectorLoggingConfigurationRequest,
) => Effect.Effect<
  GetVoiceConnectorLoggingConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getVoiceConnectorOrigination: (
  input: GetVoiceConnectorOriginationRequest,
) => Effect.Effect<
  GetVoiceConnectorOriginationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getVoiceConnectorStreamingConfiguration: (
  input: GetVoiceConnectorStreamingConfigurationRequest,
) => Effect.Effect<
  GetVoiceConnectorStreamingConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getVoiceConnectorTermination: (
  input: GetVoiceConnectorTerminationRequest,
) => Effect.Effect<
  GetVoiceConnectorTerminationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getVoiceProfile: (
  input: GetVoiceProfileRequest,
) => Effect.Effect<
  GetVoiceProfileResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listPhoneNumbers: {
  (
    input: ListPhoneNumbersRequest,
  ): Effect.Effect<
    ListPhoneNumbersResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPhoneNumbersRequest,
  ) => Stream.Stream<
    ListPhoneNumbersResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPhoneNumbersRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists the proxy sessions for the specified Amazon Chime SDK Voice Connector.
 */
export const listProxySessions: {
  (
    input: ListProxySessionsRequest,
  ): Effect.Effect<
    ListProxySessionsResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProxySessionsRequest,
  ) => Stream.Stream<
    ListProxySessionsResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProxySessionsRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists the SIP credentials for the specified Amazon Chime SDK Voice Connector.
 */
export const listVoiceConnectorTerminationCredentials: (
  input: ListVoiceConnectorTerminationCredentialsRequest,
) => Effect.Effect<
  ListVoiceConnectorTerminationCredentialsResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putVoiceConnectorProxy: (
  input: PutVoiceConnectorProxyRequest,
) => Effect.Effect<
  PutVoiceConnectorProxyResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates a Voice Connector's termination credentials.
 */
export const putVoiceConnectorTerminationCredentials: (
  input: PutVoiceConnectorTerminationCredentialsRequest,
) => Effect.Effect<
  PutVoiceConnectorTerminationCredentialsResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const restorePhoneNumber: (
  input: RestorePhoneNumberRequest,
) => Effect.Effect<
  RestorePhoneNumberResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateProxySession: (
  input: UpdateProxySessionRequest,
) => Effect.Effect<
  UpdateProxySessionResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateVoiceConnector: (
  input: UpdateVoiceConnectorRequest,
) => Effect.Effect<
  UpdateVoiceConnectorResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates the settings for the specified voice profile domain.
 */
export const updateVoiceProfileDomain: (
  input: UpdateVoiceProfileDomainRequest,
) => Effect.Effect<
  UpdateVoiceProfileDomainResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes the specified proxy session from the specified Amazon Chime SDK Voice
 * Connector.
 */
export const deleteProxySession: (
  input: DeleteProxySessionRequest,
) => Effect.Effect<
  DeleteProxySessionResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteVoiceConnectorEmergencyCallingConfiguration: (
  input: DeleteVoiceConnectorEmergencyCallingConfigurationRequest,
) => Effect.Effect<
  DeleteVoiceConnectorEmergencyCallingConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteVoiceConnectorExternalSystemsConfiguration: (
  input: DeleteVoiceConnectorExternalSystemsConfigurationRequest,
) => Effect.Effect<
  DeleteVoiceConnectorExternalSystemsConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteVoiceConnectorOrigination: (
  input: DeleteVoiceConnectorOriginationRequest,
) => Effect.Effect<
  DeleteVoiceConnectorOriginationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteVoiceConnectorProxy: (
  input: DeleteVoiceConnectorProxyRequest,
) => Effect.Effect<
  DeleteVoiceConnectorProxyResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes a Voice Connector's streaming configuration.
 */
export const deleteVoiceConnectorStreamingConfiguration: (
  input: DeleteVoiceConnectorStreamingConfigurationRequest,
) => Effect.Effect<
  DeleteVoiceConnectorStreamingConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteVoiceConnectorTermination: (
  input: DeleteVoiceConnectorTerminationRequest,
) => Effect.Effect<
  DeleteVoiceConnectorTerminationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteVoiceConnectorTerminationCredentials: (
  input: DeleteVoiceConnectorTerminationCredentialsRequest,
) => Effect.Effect<
  DeleteVoiceConnectorTerminationCredentialsResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchDeletePhoneNumber: (
  input: BatchDeletePhoneNumberRequest,
) => Effect.Effect<
  BatchDeletePhoneNumberResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Associates phone numbers with the specified Amazon Chime SDK Voice Connector group.
 */
export const associatePhoneNumbersWithVoiceConnectorGroup: (
  input: AssociatePhoneNumbersWithVoiceConnectorGroupRequest,
) => Effect.Effect<
  AssociatePhoneNumbersWithVoiceConnectorGroupResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associatePhoneNumbersWithVoiceConnector: (
  input: AssociatePhoneNumbersWithVoiceConnectorRequest,
) => Effect.Effect<
  AssociatePhoneNumbersWithVoiceConnectorResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchUpdatePhoneNumber: (
  input: BatchUpdatePhoneNumberRequest,
) => Effect.Effect<
  BatchUpdatePhoneNumberResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a proxy session for the specified Amazon Chime SDK Voice Connector for
 * the specified participant phone numbers.
 */
export const createProxySession: (
  input: CreateProxySessionRequest,
) => Effect.Effect<
  CreateProxySessionResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putVoiceConnectorExternalSystemsConfiguration: (
  input: PutVoiceConnectorExternalSystemsConfigurationRequest,
) => Effect.Effect<
  PutVoiceConnectorExternalSystemsConfigurationResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePhoneNumber: (
  input: UpdatePhoneNumberRequest,
) => Effect.Effect<
  UpdatePhoneNumberResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSipMediaApplication: (
  input: UpdateSipMediaApplicationRequest,
) => Effect.Effect<
  UpdateSipMediaApplicationResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates the details of the specified SIP rule.
 */
export const updateSipRule: (
  input: UpdateSipRuleRequest,
) => Effect.Effect<
  UpdateSipRuleResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateVoiceConnectorGroup: (
  input: UpdateVoiceConnectorGroupRequest,
) => Effect.Effect<
  UpdateVoiceConnectorGroupResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes a SIP media application.
 */
export const deleteSipMediaApplication: (
  input: DeleteSipMediaApplicationRequest,
) => Effect.Effect<
  DeleteSipMediaApplicationResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes a SIP rule.
 */
export const deleteSipRule: (
  input: DeleteSipRuleRequest,
) => Effect.Effect<
  DeleteSipRuleResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteVoiceConnector: (
  input: DeleteVoiceConnectorRequest,
) => Effect.Effect<
  DeleteVoiceConnectorResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes an Amazon Chime SDK Voice Connector group. Any `VoiceConnectorItems`
 * and phone numbers associated with the group must be removed before it can be
 * deleted.
 */
export const deleteVoiceConnectorGroup: (
  input: DeleteVoiceConnectorGroupRequest,
) => Effect.Effect<
  DeleteVoiceConnectorGroupResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes all voice profiles in the domain. WARNING: This action is not reversible.
 */
export const deleteVoiceProfileDomain: (
  input: DeleteVoiceProfileDomainRequest,
) => Effect.Effect<
  DeleteVoiceProfileDomainResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves the global settings for the Amazon Chime SDK Voice Connectors in an AWS account.
 */
export const getGlobalSettings: (
  input: GetGlobalSettingsRequest,
) => Effect.Effect<
  GetGlobalSettingsResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listPhoneNumberOrders: {
  (
    input: ListPhoneNumberOrdersRequest,
  ): Effect.Effect<
    ListPhoneNumberOrdersResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPhoneNumberOrdersRequest,
  ) => Stream.Stream<
    ListPhoneNumberOrdersResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPhoneNumberOrdersRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listSipMediaApplications: {
  (
    input: ListSipMediaApplicationsRequest,
  ): Effect.Effect<
    ListSipMediaApplicationsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSipMediaApplicationsRequest,
  ) => Stream.Stream<
    ListSipMediaApplicationsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSipMediaApplicationsRequest,
  ) => Stream.Stream<
    SipMediaApplication,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listSipRules: {
  (
    input: ListSipRulesRequest,
  ): Effect.Effect<
    ListSipRulesResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSipRulesRequest,
  ) => Stream.Stream<
    ListSipRulesResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSipRulesRequest,
  ) => Stream.Stream<
    SipRule,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists the Amazon Chime SDK Voice Connector groups in the administrator's AWS
 * account.
 */
export const listVoiceConnectorGroups: {
  (
    input: ListVoiceConnectorGroupsRequest,
  ): Effect.Effect<
    ListVoiceConnectorGroupsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVoiceConnectorGroupsRequest,
  ) => Stream.Stream<
    ListVoiceConnectorGroupsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVoiceConnectorGroupsRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listVoiceConnectors: {
  (
    input: ListVoiceConnectorsRequest,
  ): Effect.Effect<
    ListVoiceConnectorsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVoiceConnectorsRequest,
  ) => Stream.Stream<
    ListVoiceConnectorsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVoiceConnectorsRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const searchAvailablePhoneNumbers: {
  (
    input: SearchAvailablePhoneNumbersRequest,
  ): Effect.Effect<
    SearchAvailablePhoneNumbersResponse,
    | AccessDeniedException
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchAvailablePhoneNumbersRequest,
  ) => Stream.Stream<
    SearchAvailablePhoneNumbersResponse,
    | AccessDeniedException
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchAvailablePhoneNumbersRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getPhoneNumberSettings: (
  input: GetPhoneNumberSettingsRequest,
) => Effect.Effect<
  GetPhoneNumberSettingsResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists the available AWS Regions in which you can create an Amazon Chime SDK Voice Connector.
 */
export const listAvailableVoiceConnectorRegions: (
  input: ListAvailableVoiceConnectorRegionsRequest,
) => Effect.Effect<
  ListAvailableVoiceConnectorRegionsResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateGlobalSettings: (
  input: UpdateGlobalSettingsRequest,
) => Effect.Effect<
  UpdateGlobalSettingsResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates the phone number settings for the administrator's AWS account, such
 * as the default outbound calling name. You can update the default outbound calling
 * name once every seven days. Outbound calling names can take up to 72 hours to
 * update.
 */
export const updatePhoneNumberSettings: (
  input: UpdatePhoneNumberSettingsRequest,
) => Effect.Effect<
  UpdatePhoneNumberSettingsResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const deletePhoneNumber: (
  input: DeletePhoneNumberRequest,
) => Effect.Effect<
  DeletePhoneNumberResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPhoneNumber: (
  input: GetPhoneNumberRequest,
) => Effect.Effect<
  GetPhoneNumberResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getProxySession: (
  input: GetProxySessionRequest,
) => Effect.Effect<
  GetProxySessionResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createVoiceConnectorGroup: (
  input: CreateVoiceConnectorGroupRequest,
) => Effect.Effect<
  CreateVoiceConnectorGroupResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a SIP media application. For more information about SIP media applications, see Managing SIP media applications
 * and rules in the *Amazon Chime SDK Administrator Guide*.
 */
export const createSipMediaApplication: (
  input: CreateSipMediaApplicationRequest,
) => Effect.Effect<
  CreateSipMediaApplicationResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a SIP rule, which can be used to run a SIP media application as a target for a specific trigger type. For more information about SIP rules, see Managing SIP media applications
 * and rules in the *Amazon Chime SDK Administrator Guide*.
 */
export const createSipRule: (
  input: CreateSipRuleRequest,
) => Effect.Effect<
  CreateSipRuleResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createVoiceProfileDomain: (
  input: CreateVoiceProfileDomainRequest,
) => Effect.Effect<
  CreateVoiceProfileDomainResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates an order for phone numbers to be provisioned. For numbers outside the U.S., you must use the Amazon Chime SDK SIP media application dial-in product type.
 */
export const createPhoneNumberOrder: (
  input: CreatePhoneNumberOrderRequest,
) => Effect.Effect<
  CreatePhoneNumberOrderResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates an outbound call to a phone number from the phone number specified
 * in the request, and it invokes the endpoint of the specified
 * `sipMediaApplicationId`.
 */
export const createSipMediaApplicationCall: (
  input: CreateSipMediaApplicationCallRequest,
) => Effect.Effect<
  CreateSipMediaApplicationCallResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateVoiceProfile: (
  input: UpdateVoiceProfileRequest,
) => Effect.Effect<
  UpdateVoiceProfileResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GoneException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createVoiceProfile: (
  input: CreateVoiceProfileRequest,
) => Effect.Effect<
  CreateVoiceProfileResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GoneException
  | NotFoundException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSpeakerSearchTask: (
  input: GetSpeakerSearchTaskRequest,
) => Effect.Effect<
  GetSpeakerSearchTaskResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Adds a tag to the specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listSupportedPhoneNumberCountries: (
  input: ListSupportedPhoneNumberCountriesRequest,
) => Effect.Effect<
  ListSupportedPhoneNumberCountriesResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopSpeakerSearchTask: (
  input: StopSpeakerSearchTaskRequest,
) => Effect.Effect<
  StopSpeakerSearchTaskResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Stops a voice tone analysis task.
 */
export const stopVoiceToneAnalysisTask: (
  input: StopVoiceToneAnalysisTaskRequest,
) => Effect.Effect<
  StopVoiceToneAnalysisTaskResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Starts a speaker search task.
 *
 * Before starting any speaker search tasks, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the
 * AWS service terms for the Amazon Chime SDK.
 */
export const startSpeakerSearchTask: (
  input: StartSpeakerSearchTaskRequest,
) => Effect.Effect<
  StartSpeakerSearchTaskResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GoneException
  | NotFoundException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Starts a voice tone analysis task. For more information about voice tone analysis, see
 * Using Amazon Chime SDK voice analytics
 * in the *Amazon Chime SDK Developer Guide*.
 *
 * Before starting any voice tone analysis tasks, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the
 * AWS service terms for the Amazon Chime SDK.
 */
export const startVoiceToneAnalysisTask: (
  input: StartVoiceToneAnalysisTaskRequest,
) => Effect.Effect<
  StartVoiceToneAnalysisTaskResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GoneException
  | NotFoundException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));

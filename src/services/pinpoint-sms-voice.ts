import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Pinpoint SMS Voice",
  serviceShapeName: "PinpointSMSVoice",
});
const auth = T.AwsAuthSigv4({ name: "sms-voice" });
const ver = T.ServiceVersion("2018-09-05");
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
                                url: "https://sms-voice.pinpoint-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://sms-voice.pinpoint-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://sms-voice.pinpoint.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://sms-voice.pinpoint.{Region}.{PartitionResult#dnsSuffix}",
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
export class CreateConfigurationSetRequest extends S.Class<CreateConfigurationSetRequest>(
  "CreateConfigurationSetRequest",
)(
  { ConfigurationSetName: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/sms-voice/configuration-sets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateConfigurationSetResponse extends S.Class<CreateConfigurationSetResponse>(
  "CreateConfigurationSetResponse",
)({}) {}
export class DeleteConfigurationSetRequest extends S.Class<DeleteConfigurationSetRequest>(
  "DeleteConfigurationSetRequest",
)(
  { ConfigurationSetName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/sms-voice/configuration-sets/{ConfigurationSetName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfigurationSetResponse extends S.Class<DeleteConfigurationSetResponse>(
  "DeleteConfigurationSetResponse",
)({}) {}
export class DeleteConfigurationSetEventDestinationRequest extends S.Class<DeleteConfigurationSetEventDestinationRequest>(
  "DeleteConfigurationSetEventDestinationRequest",
)(
  {
    ConfigurationSetName: S.String.pipe(T.HttpLabel()),
    EventDestinationName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/sms-voice/configuration-sets/{ConfigurationSetName}/event-destinations/{EventDestinationName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfigurationSetEventDestinationResponse extends S.Class<DeleteConfigurationSetEventDestinationResponse>(
  "DeleteConfigurationSetEventDestinationResponse",
)({}) {}
export class GetConfigurationSetEventDestinationsRequest extends S.Class<GetConfigurationSetEventDestinationsRequest>(
  "GetConfigurationSetEventDestinationsRequest",
)(
  { ConfigurationSetName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/sms-voice/configuration-sets/{ConfigurationSetName}/event-destinations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConfigurationSetsRequest extends S.Class<ListConfigurationSetsRequest>(
  "ListConfigurationSetsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("PageSize")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/sms-voice/configuration-sets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CloudWatchLogsDestination extends S.Class<CloudWatchLogsDestination>(
  "CloudWatchLogsDestination",
)({ IamRoleArn: S.optional(S.String), LogGroupArn: S.optional(S.String) }) {}
export class KinesisFirehoseDestination extends S.Class<KinesisFirehoseDestination>(
  "KinesisFirehoseDestination",
)({
  DeliveryStreamArn: S.optional(S.String),
  IamRoleArn: S.optional(S.String),
}) {}
export const EventTypes = S.Array(S.String);
export class SnsDestination extends S.Class<SnsDestination>("SnsDestination")({
  TopicArn: S.optional(S.String),
}) {}
export class EventDestinationDefinition extends S.Class<EventDestinationDefinition>(
  "EventDestinationDefinition",
)({
  CloudWatchLogsDestination: S.optional(CloudWatchLogsDestination),
  Enabled: S.optional(S.Boolean),
  KinesisFirehoseDestination: S.optional(KinesisFirehoseDestination),
  MatchingEventTypes: S.optional(EventTypes),
  SnsDestination: S.optional(SnsDestination),
}) {}
export class UpdateConfigurationSetEventDestinationRequest extends S.Class<UpdateConfigurationSetEventDestinationRequest>(
  "UpdateConfigurationSetEventDestinationRequest",
)(
  {
    ConfigurationSetName: S.String.pipe(T.HttpLabel()),
    EventDestination: S.optional(EventDestinationDefinition),
    EventDestinationName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/sms-voice/configuration-sets/{ConfigurationSetName}/event-destinations/{EventDestinationName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateConfigurationSetEventDestinationResponse extends S.Class<UpdateConfigurationSetEventDestinationResponse>(
  "UpdateConfigurationSetEventDestinationResponse",
)({}) {}
export const ConfigurationSets = S.Array(S.String);
export class ListConfigurationSetsResponse extends S.Class<ListConfigurationSetsResponse>(
  "ListConfigurationSetsResponse",
)({
  ConfigurationSets: S.optional(ConfigurationSets),
  NextToken: S.optional(S.String),
}) {}
export class CallInstructionsMessageType extends S.Class<CallInstructionsMessageType>(
  "CallInstructionsMessageType",
)({ Text: S.optional(S.String) }) {}
export class PlainTextMessageType extends S.Class<PlainTextMessageType>(
  "PlainTextMessageType",
)({
  LanguageCode: S.optional(S.String),
  Text: S.optional(S.String),
  VoiceId: S.optional(S.String),
}) {}
export class SSMLMessageType extends S.Class<SSMLMessageType>(
  "SSMLMessageType",
)({
  LanguageCode: S.optional(S.String),
  Text: S.optional(S.String),
  VoiceId: S.optional(S.String),
}) {}
export class EventDestination extends S.Class<EventDestination>(
  "EventDestination",
)({
  CloudWatchLogsDestination: S.optional(CloudWatchLogsDestination),
  Enabled: S.optional(S.Boolean),
  KinesisFirehoseDestination: S.optional(KinesisFirehoseDestination),
  MatchingEventTypes: S.optional(EventTypes),
  Name: S.optional(S.String),
  SnsDestination: S.optional(SnsDestination),
}) {}
export const EventDestinations = S.Array(EventDestination);
export class VoiceMessageContent extends S.Class<VoiceMessageContent>(
  "VoiceMessageContent",
)({
  CallInstructionsMessage: S.optional(CallInstructionsMessageType),
  PlainTextMessage: S.optional(PlainTextMessageType),
  SSMLMessage: S.optional(SSMLMessageType),
}) {}
export class CreateConfigurationSetEventDestinationRequest extends S.Class<CreateConfigurationSetEventDestinationRequest>(
  "CreateConfigurationSetEventDestinationRequest",
)(
  {
    ConfigurationSetName: S.String.pipe(T.HttpLabel()),
    EventDestination: S.optional(EventDestinationDefinition),
    EventDestinationName: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v1/sms-voice/configuration-sets/{ConfigurationSetName}/event-destinations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateConfigurationSetEventDestinationResponse extends S.Class<CreateConfigurationSetEventDestinationResponse>(
  "CreateConfigurationSetEventDestinationResponse",
)({}) {}
export class GetConfigurationSetEventDestinationsResponse extends S.Class<GetConfigurationSetEventDestinationsResponse>(
  "GetConfigurationSetEventDestinationsResponse",
)({ EventDestinations: S.optional(EventDestinations) }) {}
export class SendVoiceMessageRequest extends S.Class<SendVoiceMessageRequest>(
  "SendVoiceMessageRequest",
)(
  {
    CallerId: S.optional(S.String),
    ConfigurationSetName: S.optional(S.String),
    Content: S.optional(VoiceMessageContent),
    DestinationPhoneNumber: S.optional(S.String),
    OriginationPhoneNumber: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/sms-voice/voice/message" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendVoiceMessageResponse extends S.Class<SendVoiceMessageResponse>(
  "SendVoiceMessageResponse",
)({ MessageId: S.optional(S.String) }) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {},
) {}
export class InternalServiceErrorException extends S.TaggedError<InternalServiceErrorException>()(
  "InternalServiceErrorException",
  {},
) {}
export class AlreadyExistsException extends S.TaggedError<AlreadyExistsException>()(
  "AlreadyExistsException",
  { Message: S.optional(S.String) },
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {},
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes an event destination in a configuration set.
 */
export const deleteConfigurationSetEventDestination =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteConfigurationSetEventDestinationRequest,
    output: DeleteConfigurationSetEventDestinationResponse,
    errors: [
      BadRequestException,
      InternalServiceErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * List all of the configuration sets associated with your Amazon Pinpoint account in the current region.
 */
export const listConfigurationSets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListConfigurationSetsRequest,
    output: ListConfigurationSetsResponse,
    errors: [
      BadRequestException,
      InternalServiceErrorException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Update an event destination in a configuration set. An event destination is a location that you publish information about your voice calls to. For example, you can log an event to an Amazon CloudWatch destination when a call fails.
 */
export const updateConfigurationSetEventDestination =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateConfigurationSetEventDestinationRequest,
    output: UpdateConfigurationSetEventDestinationResponse,
    errors: [
      BadRequestException,
      InternalServiceErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Create a new configuration set. After you create the configuration set, you can add one or more event destinations to it.
 */
export const createConfigurationSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateConfigurationSetRequest,
    output: CreateConfigurationSetResponse,
    errors: [
      AlreadyExistsException,
      BadRequestException,
      InternalServiceErrorException,
      LimitExceededException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Create a new event destination in a configuration set.
 */
export const createConfigurationSetEventDestination =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateConfigurationSetEventDestinationRequest,
    output: CreateConfigurationSetEventDestinationResponse,
    errors: [
      AlreadyExistsException,
      BadRequestException,
      InternalServiceErrorException,
      LimitExceededException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Deletes an existing configuration set.
 */
export const deleteConfigurationSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteConfigurationSetRequest,
    output: DeleteConfigurationSetResponse,
    errors: [
      BadRequestException,
      InternalServiceErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Obtain information about an event destination, including the types of events it reports, the Amazon Resource Name (ARN) of the destination, and the name of the event destination.
 */
export const getConfigurationSetEventDestinations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetConfigurationSetEventDestinationsRequest,
    output: GetConfigurationSetEventDestinationsResponse,
    errors: [
      BadRequestException,
      InternalServiceErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Create a new voice message and send it to a recipient's phone number.
 */
export const sendVoiceMessage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendVoiceMessageRequest,
  output: SendVoiceMessageResponse,
  errors: [
    BadRequestException,
    InternalServiceErrorException,
    TooManyRequestsException,
  ],
}));

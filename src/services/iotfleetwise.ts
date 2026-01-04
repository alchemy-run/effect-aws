import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "IoTFleetWise",
  serviceShapeName: "IoTAutobahnControlPlane",
});
const auth = T.AwsAuthSigv4({ name: "iotfleetwise" });
const ver = T.ServiceVersion("2021-06-17");
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
                        url: "https://iotfleetwise-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://iotfleetwise-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://iotfleetwise.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://iotfleetwise.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetEncryptionConfigurationRequest extends S.Class<GetEncryptionConfigurationRequest>(
  "GetEncryptionConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/encryptionConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLoggingOptionsRequest extends S.Class<GetLoggingOptionsRequest>(
  "GetLoggingOptionsRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/loggingOptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRegisterAccountStatusRequest extends S.Class<GetRegisterAccountStatusRequest>(
  "GetRegisterAccountStatusRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/account/registration_status" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagKeyList = S.Array(S.String);
export class GetEncryptionConfigurationResponse extends S.Class<GetEncryptionConfigurationResponse>(
  "GetEncryptionConfigurationResponse",
)({
  kmsKeyId: S.optional(S.String),
  encryptionStatus: S.String,
  encryptionType: S.String,
  errorMessage: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class GetVehicleStatusRequest extends S.Class<GetVehicleStatusRequest>(
  "GetVehicleStatusRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    vehicleName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/vehicles/{vehicleName}/status" }),
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
  { ResourceARN: S.String.pipe(T.HttpQuery("resourceArn")) },
  T.all(T.Http({ method: "GET", uri: "/tags" }), svc, auth, proto, ver, rules),
) {}
export class PutEncryptionConfigurationRequest extends S.Class<PutEncryptionConfigurationRequest>(
  "PutEncryptionConfigurationRequest",
)(
  { kmsKeyId: S.optional(S.String), encryptionType: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/encryptionConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CloudWatchLogDeliveryOptions extends S.Class<CloudWatchLogDeliveryOptions>(
  "CloudWatchLogDeliveryOptions",
)({ logType: S.String, logGroupName: S.optional(S.String) }) {}
export class PutLoggingOptionsRequest extends S.Class<PutLoggingOptionsRequest>(
  "PutLoggingOptionsRequest",
)(
  { cloudWatchLogDelivery: CloudWatchLogDeliveryOptions },
  T.all(
    T.Http({ method: "PUT", uri: "/loggingOptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutLoggingOptionsResponse extends S.Class<PutLoggingOptionsResponse>(
  "PutLoggingOptionsResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceARN: S.String.pipe(T.HttpQuery("resourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags" }),
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
export const StateTemplateAssociationIdentifiers = S.Array(S.String);
export const attributesMap = S.Record({ key: S.String, value: S.String });
export class TimePeriod extends S.Class<TimePeriod>("TimePeriod")({
  unit: S.String,
  value: S.Number,
}) {}
export class PeriodicStateTemplateUpdateStrategy extends S.Class<PeriodicStateTemplateUpdateStrategy>(
  "PeriodicStateTemplateUpdateStrategy",
)({ stateTemplateUpdateRate: TimePeriod }) {}
export class OnChangeStateTemplateUpdateStrategy extends S.Class<OnChangeStateTemplateUpdateStrategy>(
  "OnChangeStateTemplateUpdateStrategy",
)({}) {}
export const StateTemplateUpdateStrategy = S.Union(
  S.Struct({ periodic: PeriodicStateTemplateUpdateStrategy }),
  S.Struct({ onChange: OnChangeStateTemplateUpdateStrategy }),
);
export class StateTemplateAssociation extends S.Class<StateTemplateAssociation>(
  "StateTemplateAssociation",
)({
  identifier: S.String,
  stateTemplateUpdateStrategy: StateTemplateUpdateStrategy,
}) {}
export const StateTemplateAssociations = S.Array(StateTemplateAssociation);
export class UpdateVehicleRequestItem extends S.Class<UpdateVehicleRequestItem>(
  "UpdateVehicleRequestItem",
)({
  vehicleName: S.String,
  modelManifestArn: S.optional(S.String),
  decoderManifestArn: S.optional(S.String),
  attributes: S.optional(attributesMap),
  attributeUpdateMode: S.optional(S.String),
  stateTemplatesToAdd: S.optional(StateTemplateAssociations),
  stateTemplatesToRemove: S.optional(StateTemplateAssociationIdentifiers),
  stateTemplatesToUpdate: S.optional(StateTemplateAssociations),
}) {}
export const updateVehicleRequestItems = S.Array(UpdateVehicleRequestItem);
export class TimestreamRegistrationResponse extends S.Class<TimestreamRegistrationResponse>(
  "TimestreamRegistrationResponse",
)({
  timestreamDatabaseName: S.String,
  timestreamTableName: S.String,
  timestreamDatabaseArn: S.optional(S.String),
  timestreamTableArn: S.optional(S.String),
  registrationStatus: S.String,
  errorMessage: S.optional(S.String),
}) {}
export class IamRegistrationResponse extends S.Class<IamRegistrationResponse>(
  "IamRegistrationResponse",
)({
  roleArn: S.String,
  registrationStatus: S.String,
  errorMessage: S.optional(S.String),
}) {}
export class TimestreamResources extends S.Class<TimestreamResources>(
  "TimestreamResources",
)({ timestreamDatabaseName: S.String, timestreamTableName: S.String }) {}
export class IamResources extends S.Class<IamResources>("IamResources")({
  roleArn: S.String,
}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class BatchUpdateVehicleRequest extends S.Class<BatchUpdateVehicleRequest>(
  "BatchUpdateVehicleRequest",
)(
  { vehicles: updateVehicleRequestItems },
  T.all(
    T.Http({ method: "PUT", uri: "/vehicles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLoggingOptionsResponse extends S.Class<GetLoggingOptionsResponse>(
  "GetLoggingOptionsResponse",
)({ cloudWatchLogDelivery: CloudWatchLogDeliveryOptions }) {}
export class GetRegisterAccountStatusResponse extends S.Class<GetRegisterAccountStatusResponse>(
  "GetRegisterAccountStatusResponse",
)({
  customerAccountId: S.String,
  accountStatus: S.String,
  timestreamRegistrationResponse: S.optional(TimestreamRegistrationResponse),
  iamRegistrationResponse: IamRegistrationResponse,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class PutEncryptionConfigurationResponse extends S.Class<PutEncryptionConfigurationResponse>(
  "PutEncryptionConfigurationResponse",
)({
  kmsKeyId: S.optional(S.String),
  encryptionStatus: S.String,
  encryptionType: S.String,
}) {}
export class RegisterAccountRequest extends S.Class<RegisterAccountRequest>(
  "RegisterAccountRequest",
)(
  {
    timestreamResources: S.optional(TimestreamResources),
    iamResources: S.optional(IamResources),
  },
  T.all(
    T.Http({ method: "POST", uri: "/account/registration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String.pipe(T.HttpQuery("resourceArn")), Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/tags" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class VehicleStatus extends S.Class<VehicleStatus>("VehicleStatus")({
  campaignName: S.optional(S.String),
  vehicleName: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export const VehicleStatusList = S.Array(VehicleStatus);
export class GetVehicleStatusResponse extends S.Class<GetVehicleStatusResponse>(
  "GetVehicleStatusResponse",
)({
  campaigns: S.optional(VehicleStatusList),
  nextToken: S.optional(S.String),
}) {}
export class RegisterAccountResponse extends S.Class<RegisterAccountResponse>(
  "RegisterAccountResponse",
)({
  registerAccountStatus: S.String,
  timestreamResources: S.optional(TimestreamResources),
  iamResources: IamResources,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class UpdateVehicleResponseItem extends S.Class<UpdateVehicleResponseItem>(
  "UpdateVehicleResponseItem",
)({ vehicleName: S.optional(S.String), arn: S.optional(S.String) }) {}
export const updateVehicleResponseItems = S.Array(UpdateVehicleResponseItem);
export class UpdateVehicleError extends S.Class<UpdateVehicleError>(
  "UpdateVehicleError",
)({
  vehicleName: S.optional(S.String),
  code: S.optional(S.Number),
  message: S.optional(S.String),
}) {}
export const updateVehicleErrors = S.Array(UpdateVehicleError);
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class BatchUpdateVehicleResponse extends S.Class<BatchUpdateVehicleResponse>(
  "BatchUpdateVehicleResponse",
)({
  vehicles: S.optional(updateVehicleResponseItems),
  errors: S.optional(updateVehicleErrors),
}) {}
export class CreateVehicleRequestItem extends S.Class<CreateVehicleRequestItem>(
  "CreateVehicleRequestItem",
)({
  vehicleName: S.String,
  modelManifestArn: S.String,
  decoderManifestArn: S.String,
  attributes: S.optional(attributesMap),
  associationBehavior: S.optional(S.String),
  tags: S.optional(TagList),
  stateTemplates: S.optional(StateTemplateAssociations),
}) {}
export const createVehicleRequestItems = S.Array(CreateVehicleRequestItem);
export class BatchCreateVehicleRequest extends S.Class<BatchCreateVehicleRequest>(
  "BatchCreateVehicleRequest",
)(
  { vehicles: createVehicleRequestItems },
  T.all(
    T.Http({ method: "POST", uri: "/vehicles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateVehicleResponseItem extends S.Class<CreateVehicleResponseItem>(
  "CreateVehicleResponseItem",
)({
  vehicleName: S.optional(S.String),
  arn: S.optional(S.String),
  thingArn: S.optional(S.String),
}) {}
export const createVehicleResponses = S.Array(CreateVehicleResponseItem);
export class CreateVehicleError extends S.Class<CreateVehicleError>(
  "CreateVehicleError",
)({
  vehicleName: S.optional(S.String),
  code: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export const createVehicleErrors = S.Array(CreateVehicleError);
export class BatchCreateVehicleResponse extends S.Class<BatchCreateVehicleResponse>(
  "BatchCreateVehicleResponse",
)({
  vehicles: S.optional(createVehicleResponses),
  errors: S.optional(createVehicleErrors),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}

//# Operations
/**
 * Lists the tags (metadata) you have assigned to the resource.
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
 * Creates or updates the encryption configuration. Amazon Web Services IoT FleetWise can encrypt your data and
 * resources using an Amazon Web Services managed key. Or, you can use a KMS key that you own and
 * manage. For more information, see Data
 * encryption in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const putEncryptionConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutEncryptionConfigurationRequest,
    output: PutEncryptionConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates or updates the logging option.
 */
export const putLoggingOptions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLoggingOptionsRequest,
  output: PutLoggingOptionsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds to or modifies the tags of the given resource. Tags are metadata which can be
 * used to manage a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the given tags (metadata) from the resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the encryption configuration for resources and data in Amazon Web Services IoT FleetWise.
 */
export const getEncryptionConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetEncryptionConfigurationRequest,
    output: GetEncryptionConfigurationResponse,
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
 * Retrieves the logging options.
 */
export const getLoggingOptions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLoggingOptionsRequest,
  output: GetLoggingOptionsResponse,
  errors: [AccessDeniedException, ThrottlingException],
}));
/**
 * Retrieves information about the status of campaigns, decoder manifests, or state templates
 * associated with a vehicle.
 */
export const getVehicleStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVehicleStatusRequest,
  output: GetVehicleStatusResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This API operation contains deprecated parameters. Register your account again
 * without the Timestream resources parameter so that Amazon Web Services IoT FleetWise can remove the Timestream
 * metadata stored. You should then pass the data destination into the CreateCampaign API operation.
 *
 * You must delete any existing campaigns that include an empty data destination
 * before you register your account again. For more information, see the DeleteCampaign API operation.
 *
 * If you want to delete the Timestream inline policy from the service-linked role, such
 * as to mitigate an overly permissive policy, you must first delete any existing
 * campaigns. Then delete the service-linked role and register your account again to
 * enable CloudWatch metrics. For more information, see DeleteServiceLinkedRole in the Identity and Access Management API
 * Reference.
 *
 * Registers your Amazon Web Services account, IAM, and Amazon Timestream resources so Amazon Web Services IoT FleetWise can
 * transfer your vehicle data to the Amazon Web Services Cloud. For more information, including
 * step-by-step procedures, see Setting up
 * Amazon Web Services IoT FleetWise.
 *
 * An Amazon Web Services account is **not** the same thing as a
 * "user." An Amazon Web Services user is an identity that you create using Identity and Access Management (IAM) and
 * takes the form of either an IAM user or an IAM role, both
 * with credentials. A single Amazon Web Services account can, and typically does,
 * contain many users and roles.
 */
export const registerAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterAccountRequest,
  output: RegisterAccountResponse,
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
 * Retrieves information about the status of registering your Amazon Web Services account, IAM, and
 * Amazon Timestream resources so that Amazon Web Services IoT FleetWise can transfer your vehicle data to the Amazon Web Services
 * Cloud.
 *
 * For more information, including step-by-step procedures, see Setting up Amazon Web Services IoT FleetWise.
 *
 * This API operation doesn't require input parameters.
 */
export const getRegisterAccountStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRegisterAccountStatusRequest,
    output: GetRegisterAccountStatusResponse,
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
 * Updates a group, or batch, of vehicles.
 *
 * You must specify a decoder manifest and a vehicle model (model manifest) for each
 * vehicle.
 *
 * For more information, see Update multiple
 * vehicles (AWS CLI) in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const batchUpdateVehicle = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateVehicleRequest,
  output: BatchUpdateVehicleResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a group, or batch, of vehicles.
 *
 * You must specify a decoder manifest and a vehicle model (model manifest) for each
 * vehicle.
 *
 * For more information, see Create multiple
 * vehicles (AWS CLI) in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const batchCreateVehicle = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchCreateVehicleRequest,
  output: BatchCreateVehicleResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));

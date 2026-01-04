import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "CloudHSM",
  serviceShapeName: "CloudHsmFrontendService",
});
const auth = T.AwsAuthSigv4({ name: "cloudhsm" });
const ver = T.ServiceVersion("2014-05-30");
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
                        url: "https://cloudhsm-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://cloudhsm-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://cloudhsm.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://cloudhsm.{Region}.{PartitionResult#dnsSuffix}",
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
export class ListAvailableZonesRequest extends S.Class<ListAvailableZonesRequest>(
  "ListAvailableZonesRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const HapgList = S.Array(S.String);
export const AZList = S.Array(S.String);
export const PartitionSerialList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class CreateHapgRequest extends S.Class<CreateHapgRequest>(
  "CreateHapgRequest",
)(
  { Label: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateHsmRequest extends S.Class<CreateHsmRequest>(
  "CreateHsmRequest",
)(
  {
    SubnetId: S.String.pipe(T.XmlName("SubnetId")),
    SshKey: S.String.pipe(T.XmlName("SshKey")),
    EniIp: S.optional(S.String).pipe(T.XmlName("EniIp")),
    IamRoleArn: S.String.pipe(T.XmlName("IamRoleArn")),
    ExternalId: S.optional(S.String).pipe(T.XmlName("ExternalId")),
    SubscriptionType: S.String.pipe(T.XmlName("SubscriptionType")),
    ClientToken: S.optional(S.String).pipe(T.XmlName("ClientToken")),
    SyslogIp: S.optional(S.String).pipe(T.XmlName("SyslogIp")),
  },
  T.all(
    T.XmlName("CreateHsmRequest"),
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateLunaClientRequest extends S.Class<CreateLunaClientRequest>(
  "CreateLunaClientRequest",
)(
  { Label: S.optional(S.String), Certificate: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteHapgRequest extends S.Class<DeleteHapgRequest>(
  "DeleteHapgRequest",
)(
  { HapgArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteHsmRequest extends S.Class<DeleteHsmRequest>(
  "DeleteHsmRequest",
)(
  { HsmArn: S.String.pipe(T.XmlName("HsmArn")) },
  T.all(
    T.XmlName("DeleteHsmRequest"),
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLunaClientRequest extends S.Class<DeleteLunaClientRequest>(
  "DeleteLunaClientRequest",
)(
  { ClientArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeHapgRequest extends S.Class<DescribeHapgRequest>(
  "DescribeHapgRequest",
)(
  { HapgArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeHsmRequest extends S.Class<DescribeHsmRequest>(
  "DescribeHsmRequest",
)(
  { HsmArn: S.optional(S.String), HsmSerialNumber: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLunaClientRequest extends S.Class<DescribeLunaClientRequest>(
  "DescribeLunaClientRequest",
)(
  {
    ClientArn: S.optional(S.String),
    CertificateFingerprint: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetConfigRequest extends S.Class<GetConfigRequest>(
  "GetConfigRequest",
)(
  { ClientArn: S.String, ClientVersion: S.String, HapgList: HapgList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAvailableZonesResponse extends S.Class<ListAvailableZonesResponse>(
  "ListAvailableZonesResponse",
)({ AZList: S.optional(AZList) }) {}
export class ListHapgsRequest extends S.Class<ListHapgsRequest>(
  "ListHapgsRequest",
)(
  { NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListHsmsRequest extends S.Class<ListHsmsRequest>(
  "ListHsmsRequest",
)(
  { NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLunaClientsRequest extends S.Class<ListLunaClientsRequest>(
  "ListLunaClientsRequest",
)(
  { NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyHapgRequest extends S.Class<ModifyHapgRequest>(
  "ModifyHapgRequest",
)(
  {
    HapgArn: S.String,
    Label: S.optional(S.String),
    PartitionSerialList: S.optional(PartitionSerialList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyHsmRequest extends S.Class<ModifyHsmRequest>(
  "ModifyHsmRequest",
)(
  {
    HsmArn: S.String.pipe(T.XmlName("HsmArn")),
    SubnetId: S.optional(S.String).pipe(T.XmlName("SubnetId")),
    EniIp: S.optional(S.String).pipe(T.XmlName("EniIp")),
    IamRoleArn: S.optional(S.String).pipe(T.XmlName("IamRoleArn")),
    ExternalId: S.optional(S.String).pipe(T.XmlName("ExternalId")),
    SyslogIp: S.optional(S.String).pipe(T.XmlName("SyslogIp")),
  },
  T.all(
    T.XmlName("ModifyHsmRequest"),
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ModifyLunaClientRequest extends S.Class<ModifyLunaClientRequest>(
  "ModifyLunaClientRequest",
)(
  { ClientArn: S.String, Certificate: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveTagsFromResourceRequest extends S.Class<RemoveTagsFromResourceRequest>(
  "RemoveTagsFromResourceRequest",
)(
  { ResourceArn: S.String, TagKeyList: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export const HsmList = S.Array(S.String);
export const PartitionList = S.Array(S.String);
export const ClientList = S.Array(S.String);
export class AddTagsToResourceRequest extends S.Class<AddTagsToResourceRequest>(
  "AddTagsToResourceRequest",
)(
  { ResourceArn: S.String, TagList: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateHapgResponse extends S.Class<CreateHapgResponse>(
  "CreateHapgResponse",
)({ HapgArn: S.optional(S.String) }) {}
export class CreateHsmResponse extends S.Class<CreateHsmResponse>(
  "CreateHsmResponse",
)({ HsmArn: S.optional(S.String) }) {}
export class CreateLunaClientResponse extends S.Class<CreateLunaClientResponse>(
  "CreateLunaClientResponse",
)({ ClientArn: S.optional(S.String) }) {}
export class DeleteHapgResponse extends S.Class<DeleteHapgResponse>(
  "DeleteHapgResponse",
)({ Status: S.String }) {}
export class DeleteHsmResponse extends S.Class<DeleteHsmResponse>(
  "DeleteHsmResponse",
)({ Status: S.String }) {}
export class DeleteLunaClientResponse extends S.Class<DeleteLunaClientResponse>(
  "DeleteLunaClientResponse",
)({ Status: S.String }) {}
export class DescribeHapgResponse extends S.Class<DescribeHapgResponse>(
  "DescribeHapgResponse",
)({
  HapgArn: S.optional(S.String),
  HapgSerial: S.optional(S.String),
  HsmsLastActionFailed: S.optional(HsmList),
  HsmsPendingDeletion: S.optional(HsmList),
  HsmsPendingRegistration: S.optional(HsmList),
  Label: S.optional(S.String),
  LastModifiedTimestamp: S.optional(S.String),
  PartitionSerialList: S.optional(PartitionSerialList),
  State: S.optional(S.String),
}) {}
export class DescribeHsmResponse extends S.Class<DescribeHsmResponse>(
  "DescribeHsmResponse",
)({
  HsmArn: S.optional(S.String),
  Status: S.optional(S.String),
  StatusDetails: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  EniId: S.optional(S.String),
  EniIp: S.optional(S.String),
  SubscriptionType: S.optional(S.String),
  SubscriptionStartDate: S.optional(S.String),
  SubscriptionEndDate: S.optional(S.String),
  VpcId: S.optional(S.String),
  SubnetId: S.optional(S.String),
  IamRoleArn: S.optional(S.String),
  SerialNumber: S.optional(S.String),
  VendorName: S.optional(S.String),
  HsmType: S.optional(S.String),
  SoftwareVersion: S.optional(S.String),
  SshPublicKey: S.optional(S.String),
  SshKeyLastUpdated: S.optional(S.String),
  ServerCertUri: S.optional(S.String),
  ServerCertLastUpdated: S.optional(S.String),
  Partitions: S.optional(PartitionList),
}) {}
export class DescribeLunaClientResponse extends S.Class<DescribeLunaClientResponse>(
  "DescribeLunaClientResponse",
)({
  ClientArn: S.optional(S.String),
  Certificate: S.optional(S.String),
  CertificateFingerprint: S.optional(S.String),
  LastModifiedTimestamp: S.optional(S.String),
  Label: S.optional(S.String),
}) {}
export class GetConfigResponse extends S.Class<GetConfigResponse>(
  "GetConfigResponse",
)({
  ConfigType: S.optional(S.String),
  ConfigFile: S.optional(S.String),
  ConfigCred: S.optional(S.String),
}) {}
export class ListHapgsResponse extends S.Class<ListHapgsResponse>(
  "ListHapgsResponse",
)({ HapgList: HapgList, NextToken: S.optional(S.String) }) {}
export class ListHsmsResponse extends S.Class<ListHsmsResponse>(
  "ListHsmsResponse",
)({ HsmList: S.optional(HsmList), NextToken: S.optional(S.String) }) {}
export class ListLunaClientsResponse extends S.Class<ListLunaClientsResponse>(
  "ListLunaClientsResponse",
)({ ClientList: ClientList, NextToken: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ TagList: TagList }) {}
export class ModifyHapgResponse extends S.Class<ModifyHapgResponse>(
  "ModifyHapgResponse",
)({ HapgArn: S.optional(S.String) }) {}
export class ModifyHsmResponse extends S.Class<ModifyHsmResponse>(
  "ModifyHsmResponse",
)({ HsmArn: S.optional(S.String) }) {}
export class ModifyLunaClientResponse extends S.Class<ModifyLunaClientResponse>(
  "ModifyLunaClientResponse",
)({ ClientArn: S.optional(S.String) }) {}
export class RemoveTagsFromResourceResponse extends S.Class<RemoveTagsFromResourceResponse>(
  "RemoveTagsFromResourceResponse",
)({ Status: S.String }) {}
export class AddTagsToResourceResponse extends S.Class<AddTagsToResourceResponse>(
  "AddTagsToResourceResponse",
)({ Status: S.String }) {}

//# Errors
export class CloudHsmInternalException extends S.TaggedError<CloudHsmInternalException>()(
  "CloudHsmInternalException",
  {},
) {}
export class CloudHsmServiceException extends S.TaggedError<CloudHsmServiceException>()(
  "CloudHsmServiceException",
  {},
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {},
) {}

//# Operations
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Creates an HSM client.
 */
export const createLunaClient = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLunaClientRequest,
  output: CreateLunaClientResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Deletes a high-availability partition group.
 */
export const deleteHapg = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHapgRequest,
  output: DeleteHapgResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Deletes an HSM. After completion, this operation cannot be undone and your key material
 * cannot be recovered.
 */
export const deleteHsm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHsmRequest,
  output: DeleteHsmResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Deletes a client.
 */
export const deleteLunaClient = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLunaClientRequest,
  output: DeleteLunaClientResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Retrieves information about a high-availability partition group.
 */
export const describeHapg = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeHapgRequest,
  output: DescribeHapgResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Retrieves information about an HSM. You can identify the HSM by its ARN or its serial
 * number.
 */
export const describeHsm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeHsmRequest,
  output: DescribeHsmResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Retrieves information about an HSM client.
 */
export const describeLunaClient = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLunaClientRequest,
  output: DescribeLunaClientResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Gets the configuration files necessary to connect to all high availability partition
 * groups the client is associated with.
 */
export const getConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfigRequest,
  output: GetConfigResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Lists the Availability Zones that have available AWS CloudHSM capacity.
 */
export const listAvailableZones = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAvailableZonesRequest,
  output: ListAvailableZonesResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Lists the high-availability partition groups for the account.
 *
 * This operation supports pagination with the use of the `NextToken` member.
 * If more results are available, the `NextToken` member of the response contains a
 * token that you pass in the next call to `ListHapgs` to retrieve the next set of
 * items.
 */
export const listHapgs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListHapgsRequest,
  output: ListHapgsResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Retrieves the identifiers of all of the HSMs provisioned for the current
 * customer.
 *
 * This operation supports pagination with the use of the `NextToken` member.
 * If more results are available, the `NextToken` member of the response contains a
 * token that you pass in the next call to `ListHsms` to retrieve the next set of
 * items.
 */
export const listHsms = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListHsmsRequest,
  output: ListHsmsResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Lists all of the clients.
 *
 * This operation supports pagination with the use of the `NextToken` member.
 * If more results are available, the `NextToken` member of the response contains a
 * token that you pass in the next call to `ListLunaClients` to retrieve the next set
 * of items.
 */
export const listLunaClients = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLunaClientsRequest,
  output: ListLunaClientsResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Returns a list of all tags for the specified AWS CloudHSM resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Modifies an existing high-availability partition group.
 */
export const modifyHapg = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyHapgRequest,
  output: ModifyHapgResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Modifies an HSM.
 *
 * This operation can result in the HSM being offline for up to 15 minutes while the AWS
 * CloudHSM service is reconfigured. If you are modifying a production HSM, you should ensure
 * that your AWS CloudHSM service is configured for high availability, and consider executing this
 * operation during a maintenance window.
 */
export const modifyHsm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyHsmRequest,
  output: ModifyHsmResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Modifies the certificate used by the client.
 *
 * This action can potentially start a workflow to install the new certificate on the
 * client's HSMs.
 */
export const modifyLunaClient = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyLunaClientRequest,
  output: ModifyLunaClientResponse,
  errors: [CloudHsmServiceException],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Removes one or more tags from the specified AWS CloudHSM resource.
 *
 * To remove a tag, specify only the tag key to remove (not the value). To overwrite the
 * value for an existing tag, use AddTagsToResource.
 */
export const removeTagsFromResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveTagsFromResourceRequest,
    output: RemoveTagsFromResourceResponse,
    errors: [
      CloudHsmInternalException,
      CloudHsmServiceException,
      InvalidRequestException,
    ],
  }),
);
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Adds or overwrites one or more tags for the specified AWS CloudHSM resource.
 *
 * Each tag consists of a key and a value. Tag keys must be unique to each
 * resource.
 */
export const addTagsToResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsToResourceRequest,
  output: AddTagsToResourceResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Creates a high-availability partition group. A high-availability partition group is a
 * group of partitions that spans multiple physical HSMs.
 */
export const createHapg = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHapgRequest,
  output: CreateHapgResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));
/**
 * This is documentation for **AWS CloudHSM Classic**. For
 * more information, see AWS CloudHSM
 * Classic FAQs, the AWS
 * CloudHSM Classic User Guide, and the AWS CloudHSM Classic API Reference.
 *
 * For information about the current version of AWS
 * CloudHSM, see AWS CloudHSM, the
 * AWS CloudHSM User Guide,
 * and the AWS CloudHSM API
 * Reference.
 *
 * Creates an uninitialized HSM instance.
 *
 * There is an upfront fee charged for each HSM instance that you create with the
 * `CreateHsm` operation. If you accidentally provision an HSM and want to request a
 * refund, delete the instance using the DeleteHsm operation, go to the AWS Support Center, create a new case, and select
 * **Account and Billing Support**.
 *
 * It can take up to 20 minutes to create and provision an HSM. You can monitor the
 * status of the HSM with the DescribeHsm operation. The HSM is ready to be
 * initialized when the status changes to `RUNNING`.
 */
export const createHsm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHsmRequest,
  output: CreateHsmResponse,
  errors: [
    CloudHsmInternalException,
    CloudHsmServiceException,
    InvalidRequestException,
  ],
}));

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Payment Cryptography",
  serviceShapeName: "PaymentCryptographyControlPlane",
});
const auth = T.AwsAuthSigv4({ name: "payment-cryptography" });
const ver = T.ServiceVersion("2021-09-14");
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
                                url: "https://controlplane.payment-cryptography-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://controlplane.payment-cryptography-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://controlplane.payment-cryptography.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://controlplane.payment-cryptography.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetDefaultKeyReplicationRegionsInput extends S.Class<GetDefaultKeyReplicationRegionsInput>(
  "GetDefaultKeyReplicationRegionsInput",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const Regions = S.Array(S.String);
export const TagKeys = S.Array(S.String);
export class DisableDefaultKeyReplicationRegionsInput extends S.Class<DisableDefaultKeyReplicationRegionsInput>(
  "DisableDefaultKeyReplicationRegionsInput",
)(
  { ReplicationRegions: Regions },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableDefaultKeyReplicationRegionsInput extends S.Class<EnableDefaultKeyReplicationRegionsInput>(
  "EnableDefaultKeyReplicationRegionsInput",
)(
  { ReplicationRegions: Regions },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDefaultKeyReplicationRegionsOutput extends S.Class<GetDefaultKeyReplicationRegionsOutput>(
  "GetDefaultKeyReplicationRegionsOutput",
)({ EnabledReplicationRegions: Regions }) {}
export class GetParametersForExportInput extends S.Class<GetParametersForExportInput>(
  "GetParametersForExportInput",
)(
  { KeyMaterialType: S.String, SigningKeyAlgorithm: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetParametersForImportInput extends S.Class<GetParametersForImportInput>(
  "GetParametersForImportInput",
)(
  { KeyMaterialType: S.String, WrappingKeyAlgorithm: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPublicKeyCertificateInput extends S.Class<GetPublicKeyCertificateInput>(
  "GetPublicKeyCertificateInput",
)(
  { KeyIdentifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  {
    ResourceArn: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const Tags = S.Array(Tag);
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { ResourceArn: S.String, Tags: Tags },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  { ResourceArn: S.String, TagKeys: TagKeys },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}) {}
export class CreateAliasInput extends S.Class<CreateAliasInput>(
  "CreateAliasInput",
)(
  { AliasName: S.String, KeyArn: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAliasInput extends S.Class<GetAliasInput>("GetAliasInput")(
  { AliasName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateAliasInput extends S.Class<UpdateAliasInput>(
  "UpdateAliasInput",
)(
  { AliasName: S.String, KeyArn: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAliasInput extends S.Class<DeleteAliasInput>(
  "DeleteAliasInput",
)(
  { AliasName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAliasOutput extends S.Class<DeleteAliasOutput>(
  "DeleteAliasOutput",
)({}) {}
export class ListAliasesInput extends S.Class<ListAliasesInput>(
  "ListAliasesInput",
)(
  {
    KeyArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetKeyInput extends S.Class<GetKeyInput>("GetKeyInput")(
  { KeyIdentifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteKeyInput extends S.Class<DeleteKeyInput>("DeleteKeyInput")(
  { KeyIdentifier: S.String, DeleteKeyInDays: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListKeysInput extends S.Class<ListKeysInput>("ListKeysInput")(
  {
    KeyState: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddKeyReplicationRegionsInput extends S.Class<AddKeyReplicationRegionsInput>(
  "AddKeyReplicationRegionsInput",
)(
  { KeyIdentifier: S.String, ReplicationRegions: Regions },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveKeyReplicationRegionsInput extends S.Class<RemoveKeyReplicationRegionsInput>(
  "RemoveKeyReplicationRegionsInput",
)(
  { KeyIdentifier: S.String, ReplicationRegions: Regions },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RestoreKeyInput extends S.Class<RestoreKeyInput>(
  "RestoreKeyInput",
)(
  { KeyIdentifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartKeyUsageInput extends S.Class<StartKeyUsageInput>(
  "StartKeyUsageInput",
)(
  { KeyIdentifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopKeyUsageInput extends S.Class<StopKeyUsageInput>(
  "StopKeyUsageInput",
)(
  { KeyIdentifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CertificateSubjectType extends S.Class<CertificateSubjectType>(
  "CertificateSubjectType",
)({
  CommonName: S.String,
  OrganizationUnit: S.optional(S.String),
  Organization: S.optional(S.String),
  City: S.optional(S.String),
  Country: S.optional(S.String),
  StateOrProvince: S.optional(S.String),
  EmailAddress: S.optional(S.String),
}) {}
export class Alias extends S.Class<Alias>("Alias")({
  AliasName: S.String,
  KeyArn: S.optional(S.String),
}) {}
export const Aliases = S.Array(Alias);
export class DisableDefaultKeyReplicationRegionsOutput extends S.Class<DisableDefaultKeyReplicationRegionsOutput>(
  "DisableDefaultKeyReplicationRegionsOutput",
)({ EnabledReplicationRegions: Regions }) {}
export class EnableDefaultKeyReplicationRegionsOutput extends S.Class<EnableDefaultKeyReplicationRegionsOutput>(
  "EnableDefaultKeyReplicationRegionsOutput",
)({ EnabledReplicationRegions: Regions }) {}
export class GetCertificateSigningRequestInput extends S.Class<GetCertificateSigningRequestInput>(
  "GetCertificateSigningRequestInput",
)(
  {
    KeyIdentifier: S.String,
    SigningAlgorithm: S.String,
    CertificateSubject: CertificateSubjectType,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetParametersForExportOutput extends S.Class<GetParametersForExportOutput>(
  "GetParametersForExportOutput",
)({
  SigningKeyCertificate: S.String,
  SigningKeyCertificateChain: S.String,
  SigningKeyAlgorithm: S.String,
  ExportToken: S.String,
  ParametersValidUntilTimestamp: S.Date.pipe(
    T.TimestampFormat("epoch-seconds"),
  ),
}) {}
export class GetParametersForImportOutput extends S.Class<GetParametersForImportOutput>(
  "GetParametersForImportOutput",
)({
  WrappingKeyCertificate: S.String,
  WrappingKeyCertificateChain: S.String,
  WrappingKeyAlgorithm: S.String,
  ImportToken: S.String,
  ParametersValidUntilTimestamp: S.Date.pipe(
    T.TimestampFormat("epoch-seconds"),
  ),
}) {}
export class GetPublicKeyCertificateOutput extends S.Class<GetPublicKeyCertificateOutput>(
  "GetPublicKeyCertificateOutput",
)({ KeyCertificate: S.String, KeyCertificateChain: S.String }) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ Tags: Tags, NextToken: S.optional(S.String) }) {}
export class GetAliasOutput extends S.Class<GetAliasOutput>("GetAliasOutput")({
  Alias: Alias,
}) {}
export class UpdateAliasOutput extends S.Class<UpdateAliasOutput>(
  "UpdateAliasOutput",
)({ Alias: Alias }) {}
export class ListAliasesOutput extends S.Class<ListAliasesOutput>(
  "ListAliasesOutput",
)({ Aliases: Aliases, NextToken: S.optional(S.String) }) {}
export class KeyModesOfUse extends S.Class<KeyModesOfUse>("KeyModesOfUse")({
  Encrypt: S.optional(S.Boolean),
  Decrypt: S.optional(S.Boolean),
  Wrap: S.optional(S.Boolean),
  Unwrap: S.optional(S.Boolean),
  Generate: S.optional(S.Boolean),
  Sign: S.optional(S.Boolean),
  Verify: S.optional(S.Boolean),
  DeriveKey: S.optional(S.Boolean),
  NoRestrictions: S.optional(S.Boolean),
}) {}
export class KeyAttributes extends S.Class<KeyAttributes>("KeyAttributes")({
  KeyUsage: S.String,
  KeyClass: S.String,
  KeyAlgorithm: S.String,
  KeyModesOfUse: KeyModesOfUse,
}) {}
export class ReplicationStatusType extends S.Class<ReplicationStatusType>(
  "ReplicationStatusType",
)({ Status: S.String, StatusMessage: S.optional(S.String) }) {}
export const ReplicationStatus = S.Record({
  key: S.String,
  value: ReplicationStatusType,
});
export class Key extends S.Class<Key>("Key")({
  KeyArn: S.String,
  KeyAttributes: KeyAttributes,
  KeyCheckValue: S.String,
  KeyCheckValueAlgorithm: S.String,
  Enabled: S.Boolean,
  Exportable: S.Boolean,
  KeyState: S.String,
  KeyOrigin: S.String,
  CreateTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  UsageStartTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  UsageStopTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  DeletePendingTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  DeleteTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeriveKeyUsage: S.optional(S.String),
  MultiRegionKeyType: S.optional(S.String),
  PrimaryRegion: S.optional(S.String),
  ReplicationStatus: S.optional(ReplicationStatus),
  UsingDefaultReplicationRegions: S.optional(S.Boolean),
}) {}
export class DeleteKeyOutput extends S.Class<DeleteKeyOutput>(
  "DeleteKeyOutput",
)({ Key: Key }) {}
export class AddKeyReplicationRegionsOutput extends S.Class<AddKeyReplicationRegionsOutput>(
  "AddKeyReplicationRegionsOutput",
)({ Key: Key }) {}
export class RemoveKeyReplicationRegionsOutput extends S.Class<RemoveKeyReplicationRegionsOutput>(
  "RemoveKeyReplicationRegionsOutput",
)({ Key: Key }) {}
export class RestoreKeyOutput extends S.Class<RestoreKeyOutput>(
  "RestoreKeyOutput",
)({ Key: Key }) {}
export class StartKeyUsageOutput extends S.Class<StartKeyUsageOutput>(
  "StartKeyUsageOutput",
)({ Key: Key }) {}
export class StopKeyUsageOutput extends S.Class<StopKeyUsageOutput>(
  "StopKeyUsageOutput",
)({ Key: Key }) {}
export const OptionalBlocks = S.Record({ key: S.String, value: S.String });
export class KeyBlockHeaders extends S.Class<KeyBlockHeaders>(
  "KeyBlockHeaders",
)({
  KeyModesOfUse: S.optional(KeyModesOfUse),
  KeyExportability: S.optional(S.String),
  KeyVersion: S.optional(S.String),
  OptionalBlocks: S.optional(OptionalBlocks),
}) {}
export class ExportTr34KeyBlock extends S.Class<ExportTr34KeyBlock>(
  "ExportTr34KeyBlock",
)({
  CertificateAuthorityPublicKeyIdentifier: S.String,
  WrappingKeyCertificate: S.String,
  ExportToken: S.optional(S.String),
  SigningKeyIdentifier: S.optional(S.String),
  SigningKeyCertificate: S.optional(S.String),
  KeyBlockFormat: S.String,
  RandomNonce: S.optional(S.String),
  KeyBlockHeaders: S.optional(KeyBlockHeaders),
}) {}
export class ExportKeyCryptogram extends S.Class<ExportKeyCryptogram>(
  "ExportKeyCryptogram",
)({
  CertificateAuthorityPublicKeyIdentifier: S.String,
  WrappingKeyCertificate: S.String,
  WrappingSpec: S.optional(S.String),
}) {}
export class ExportAs2805KeyCryptogram extends S.Class<ExportAs2805KeyCryptogram>(
  "ExportAs2805KeyCryptogram",
)({ WrappingKeyIdentifier: S.String, As2805KeyVariant: S.String }) {}
export class ExportDukptInitialKey extends S.Class<ExportDukptInitialKey>(
  "ExportDukptInitialKey",
)({ KeySerialNumber: S.String }) {}
export class RootCertificatePublicKey extends S.Class<RootCertificatePublicKey>(
  "RootCertificatePublicKey",
)({ KeyAttributes: KeyAttributes, PublicKeyCertificate: S.String }) {}
export class TrustedCertificatePublicKey extends S.Class<TrustedCertificatePublicKey>(
  "TrustedCertificatePublicKey",
)({
  KeyAttributes: KeyAttributes,
  PublicKeyCertificate: S.String,
  CertificateAuthorityPublicKeyIdentifier: S.String,
}) {}
export class ImportTr31KeyBlock extends S.Class<ImportTr31KeyBlock>(
  "ImportTr31KeyBlock",
)({ WrappingKeyIdentifier: S.String, WrappedKeyBlock: S.String }) {}
export class ImportTr34KeyBlock extends S.Class<ImportTr34KeyBlock>(
  "ImportTr34KeyBlock",
)({
  CertificateAuthorityPublicKeyIdentifier: S.String,
  SigningKeyCertificate: S.String,
  ImportToken: S.optional(S.String),
  WrappingKeyIdentifier: S.optional(S.String),
  WrappingKeyCertificate: S.optional(S.String),
  WrappedKeyBlock: S.String,
  KeyBlockFormat: S.String,
  RandomNonce: S.optional(S.String),
}) {}
export class ImportKeyCryptogram extends S.Class<ImportKeyCryptogram>(
  "ImportKeyCryptogram",
)({
  KeyAttributes: KeyAttributes,
  Exportable: S.Boolean,
  WrappedKeyCryptogram: S.String,
  ImportToken: S.String,
  WrappingSpec: S.optional(S.String),
}) {}
export const DiffieHellmanDerivationData = S.Union(
  S.Struct({ SharedInformation: S.String }),
);
export class ImportDiffieHellmanTr31KeyBlock extends S.Class<ImportDiffieHellmanTr31KeyBlock>(
  "ImportDiffieHellmanTr31KeyBlock",
)({
  PrivateKeyIdentifier: S.String,
  CertificateAuthorityPublicKeyIdentifier: S.String,
  PublicKeyCertificate: S.String,
  DeriveKeyAlgorithm: S.String,
  KeyDerivationFunction: S.String,
  KeyDerivationHashAlgorithm: S.String,
  DerivationData: DiffieHellmanDerivationData,
  WrappedKeyBlock: S.String,
}) {}
export class ImportAs2805KeyCryptogram extends S.Class<ImportAs2805KeyCryptogram>(
  "ImportAs2805KeyCryptogram",
)({
  As2805KeyVariant: S.String,
  KeyModesOfUse: KeyModesOfUse,
  KeyAlgorithm: S.String,
  Exportable: S.Boolean,
  WrappingKeyIdentifier: S.String,
  WrappedKeyCryptogram: S.String,
}) {}
export class ExportAttributes extends S.Class<ExportAttributes>(
  "ExportAttributes",
)({
  ExportDukptInitialKey: S.optional(ExportDukptInitialKey),
  KeyCheckValueAlgorithm: S.optional(S.String),
}) {}
export const ImportKeyMaterial = S.Union(
  S.Struct({ RootCertificatePublicKey: RootCertificatePublicKey }),
  S.Struct({ TrustedCertificatePublicKey: TrustedCertificatePublicKey }),
  S.Struct({ Tr31KeyBlock: ImportTr31KeyBlock }),
  S.Struct({ Tr34KeyBlock: ImportTr34KeyBlock }),
  S.Struct({ KeyCryptogram: ImportKeyCryptogram }),
  S.Struct({ DiffieHellmanTr31KeyBlock: ImportDiffieHellmanTr31KeyBlock }),
  S.Struct({ As2805KeyCryptogram: ImportAs2805KeyCryptogram }),
);
export class KeySummary extends S.Class<KeySummary>("KeySummary")({
  KeyArn: S.String,
  KeyState: S.String,
  KeyAttributes: KeyAttributes,
  KeyCheckValue: S.String,
  Exportable: S.Boolean,
  Enabled: S.Boolean,
  MultiRegionKeyType: S.optional(S.String),
  PrimaryRegion: S.optional(S.String),
}) {}
export const KeySummaryList = S.Array(KeySummary);
export class GetCertificateSigningRequestOutput extends S.Class<GetCertificateSigningRequestOutput>(
  "GetCertificateSigningRequestOutput",
)({ CertificateSigningRequest: S.String }) {}
export class ImportKeyInput extends S.Class<ImportKeyInput>("ImportKeyInput")(
  {
    KeyMaterial: ImportKeyMaterial,
    KeyCheckValueAlgorithm: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    Tags: S.optional(Tags),
    ReplicationRegions: S.optional(Regions),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateAliasOutput extends S.Class<CreateAliasOutput>(
  "CreateAliasOutput",
)({ Alias: Alias }) {}
export class CreateKeyInput extends S.Class<CreateKeyInput>("CreateKeyInput")(
  {
    KeyAttributes: KeyAttributes,
    KeyCheckValueAlgorithm: S.optional(S.String),
    Exportable: S.Boolean,
    Enabled: S.optional(S.Boolean),
    Tags: S.optional(Tags),
    DeriveKeyUsage: S.optional(S.String),
    ReplicationRegions: S.optional(Regions),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListKeysOutput extends S.Class<ListKeysOutput>("ListKeysOutput")({
  Keys: KeySummaryList,
  NextToken: S.optional(S.String),
}) {}
export class ExportDiffieHellmanTr31KeyBlock extends S.Class<ExportDiffieHellmanTr31KeyBlock>(
  "ExportDiffieHellmanTr31KeyBlock",
)({
  PrivateKeyIdentifier: S.String,
  CertificateAuthorityPublicKeyIdentifier: S.String,
  PublicKeyCertificate: S.String,
  DeriveKeyAlgorithm: S.String,
  KeyDerivationFunction: S.String,
  KeyDerivationHashAlgorithm: S.String,
  DerivationData: DiffieHellmanDerivationData,
  KeyBlockHeaders: S.optional(KeyBlockHeaders),
}) {}
export class ImportKeyOutput extends S.Class<ImportKeyOutput>(
  "ImportKeyOutput",
)({ Key: Key }) {}
export class CreateKeyOutput extends S.Class<CreateKeyOutput>(
  "CreateKeyOutput",
)({ Key: Key }) {}
export class ExportTr31KeyBlock extends S.Class<ExportTr31KeyBlock>(
  "ExportTr31KeyBlock",
)({
  WrappingKeyIdentifier: S.String,
  KeyBlockHeaders: S.optional(KeyBlockHeaders),
}) {}
export const ExportKeyMaterial = S.Union(
  S.Struct({ Tr31KeyBlock: ExportTr31KeyBlock }),
  S.Struct({ Tr34KeyBlock: ExportTr34KeyBlock }),
  S.Struct({ KeyCryptogram: ExportKeyCryptogram }),
  S.Struct({ DiffieHellmanTr31KeyBlock: ExportDiffieHellmanTr31KeyBlock }),
  S.Struct({ As2805KeyCryptogram: ExportAs2805KeyCryptogram }),
);
export class ExportKeyInput extends S.Class<ExportKeyInput>("ExportKeyInput")(
  {
    KeyMaterial: ExportKeyMaterial,
    ExportKeyIdentifier: S.String,
    ExportAttributes: S.optional(ExportAttributes),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetKeyOutput extends S.Class<GetKeyOutput>("GetKeyOutput")({
  Key: Key,
}) {}
export class WrappedKey extends S.Class<WrappedKey>("WrappedKey")({
  WrappingKeyArn: S.String,
  WrappedKeyMaterialFormat: S.String,
  KeyMaterial: S.String,
  KeyCheckValue: S.optional(S.String),
  KeyCheckValueAlgorithm: S.optional(S.String),
}) {}
export class ExportKeyOutput extends S.Class<ExportKeyOutput>(
  "ExportKeyOutput",
)({ WrappedKey: S.optional(WrappedKey) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { ResourceId: S.optional(S.String) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Gets the public key certificate of the asymmetric key pair that exists within Amazon Web Services Payment Cryptography.
 *
 * Unlike the private key of an asymmetric key, which never leaves Amazon Web Services Payment Cryptography unencrypted, callers with `GetPublicKeyCertificate` permission can download the public key certificate of the asymmetric key. You can share the public key certificate to allow others to encrypt messages and verify signatures outside of Amazon Web Services Payment Cryptography
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 */
export const getPublicKeyCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPublicKeyCertificateInput,
    output: GetPublicKeyCertificateOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Imports symmetric keys and public key certificates in PEM format (base64 encoded) into Amazon Web Services Payment Cryptography.
 *
 * Amazon Web Services Payment Cryptography simplifies key exchange by replacing the existing paper-based approach with a modern electronic approach. With `ImportKey` you can import symmetric keys using either symmetric and asymmetric key exchange mechanisms.
 *
 * For symmetric key exchange, Amazon Web Services Payment Cryptography uses the ANSI X9 TR-31 norm in accordance with PCI PIN guidelines. And for asymmetric key exchange, Amazon Web Services Payment Cryptography supports ANSI X9 TR-34 norm, RSA unwrap, and ECDH (Elliptic Curve Diffie-Hellman) key exchange mechanisms. Asymmetric key exchange methods are typically used to establish bi-directional trust between the two parties exhanging keys and are used for initial key exchange such as Key Encryption Key (KEK) or Zone Master Key (ZMK). After which you can import working keys using symmetric method to perform various cryptographic operations within Amazon Web Services Payment Cryptography.
 *
 * PCI requires specific minimum key strength of wrapping keys used to protect the keys being exchanged electronically. These requirements can change when PCI standards are revised. The rules specify that wrapping keys used for transport must be at least as strong as the key being protected. For more information on recommended key strength of wrapping keys and key exchange mechanism, see Importing and exporting keys in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * You can also import a *root public key certificate*, used to sign other public key certificates, or a *trusted public key certificate* under an already established root public key certificate.
 *
 * **To import a public root key certificate**
 *
 * Using this operation, you can import the public component (in PEM cerificate format) of your private root key. You can use the imported public root key certificate for digital signatures, for example signing wrapping key or signing key in TR-34, within your Amazon Web Services Payment Cryptography account.
 *
 * Set the following parameters:
 *
 * - `KeyMaterial`: `RootCertificatePublicKey`
 *
 * - `KeyClass`: `PUBLIC_KEY`
 *
 * - `KeyModesOfUse`: `Verify`
 *
 * - `KeyUsage`: `TR31_S0_ASYMMETRIC_KEY_FOR_DIGITAL_SIGNATURE`
 *
 * - `PublicKeyCertificate`: The public key certificate in PEM format (base64 encoded) of the private root key under import.
 *
 * **To import a trusted public key certificate**
 *
 * The root public key certificate must be in place and operational before you import a trusted public key certificate. Set the following parameters:
 *
 * - `KeyMaterial`: `TrustedCertificatePublicKey`
 *
 * - `CertificateAuthorityPublicKeyIdentifier`: `KeyArn` of the `RootCertificatePublicKey`.
 *
 * - `KeyModesOfUse` and `KeyUsage`: Corresponding to the cryptographic operations such as wrap, sign, or encrypt that you will allow the trusted public key certificate to perform.
 *
 * - `PublicKeyCertificate`: The trusted public key certificate in PEM format (base64 encoded) under import.
 *
 * **To import initial keys (KEK or ZMK or similar) using TR-34**
 *
 * Using this operation, you can import initial key using TR-34 asymmetric key exchange. In TR-34 terminology, the sending party of the key is called Key Distribution Host (KDH) and the receiving party of the key is called Key Receiving Device (KRD). During the key import process, KDH is the user who initiates the key import and KRD is Amazon Web Services Payment Cryptography who receives the key.
 *
 * To initiate TR-34 key import, the KDH must obtain an import token by calling GetParametersForImport. This operation generates an encryption keypair for the purpose of key import, signs the key and returns back the wrapping key certificate (also known as KRD wrapping certificate) and the root certificate chain. The KDH must trust and install the KRD wrapping certificate on its HSM and use it to encrypt (wrap) the KDH key during TR-34 WrappedKeyBlock generation. The import token and associated KRD wrapping certificate expires after 30 days.
 *
 * Next the KDH generates a key pair for the purpose of signing the encrypted KDH key and provides the public certificate of the signing key to Amazon Web Services Payment Cryptography. The KDH will also need to import the root certificate chain of the KDH signing certificate by calling `ImportKey` for `RootCertificatePublicKey`. For more information on TR-34 key import, see section Importing symmetric keys in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * Set the following parameters:
 *
 * - `KeyMaterial`: Use `Tr34KeyBlock` parameters.
 *
 * - `CertificateAuthorityPublicKeyIdentifier`: The `KeyARN` of the certificate chain that signed the KDH signing key certificate.
 *
 * - `ImportToken`: Obtained from KRD by calling GetParametersForImport.
 *
 * - `WrappedKeyBlock`: The TR-34 wrapped key material from KDH. It contains the KDH key under import, wrapped with KRD wrapping certificate and signed by KDH signing private key. This TR-34 key block is typically generated by the KDH Hardware Security Module (HSM) outside of Amazon Web Services Payment Cryptography.
 *
 * - `SigningKeyCertificate`: The public key certificate in PEM format (base64 encoded) of the KDH signing key generated under the root certificate (CertificateAuthorityPublicKeyIdentifier) imported in Amazon Web Services Payment Cryptography.
 *
 * **To import initial keys (KEK or ZMK or similar) using RSA Wrap and Unwrap**
 *
 * Using this operation, you can import initial key using asymmetric RSA wrap and unwrap key exchange method. To initiate import, call GetParametersForImport with `KeyMaterial` set to `KEY_CRYPTOGRAM` to generate an import token. This operation also generates an encryption keypair for the purpose of key import, signs the key and returns back the wrapping key certificate in PEM format (base64 encoded) and its root certificate chain. The import token and associated KRD wrapping certificate expires after 30 days.
 *
 * You must trust and install the wrapping certificate and its certificate chain on the sending HSM and use it to wrap the key under export for WrappedKeyCryptogram generation. Next call `ImportKey` with `KeyMaterial` set to `KEY_CRYPTOGRAM` and provide the `ImportToken` and `KeyAttributes` for the key under import.
 *
 * **To import working keys using TR-31**
 *
 * Amazon Web Services Payment Cryptography uses TR-31 symmetric key exchange norm to import working keys. A KEK must be established within Amazon Web Services Payment Cryptography by using TR-34 key import or by using CreateKey. To initiate a TR-31 key import, set the following parameters:
 *
 * - `KeyMaterial`: Use `Tr31KeyBlock` parameters.
 *
 * - `WrappedKeyBlock`: The TR-31 wrapped key material. It contains the key under import, encrypted using KEK. The TR-31 key block is typically generated by a HSM outside of Amazon Web Services Payment Cryptography.
 *
 * - `WrappingKeyIdentifier`: The `KeyArn` of the KEK that Amazon Web Services Payment Cryptography uses to decrypt or unwrap the key under import.
 *
 * **To import working keys using ECDH**
 *
 * You can also use ECDH key agreement to import working keys as a TR-31 keyblock, where the wrapping key is an ECDH derived key.
 *
 * To initiate a TR-31 key import using ECDH, both sides must create an ECC key pair with key usage K3 and exchange public key certificates. In Amazon Web Services Payment Cryptography, you can do this by calling `CreateKey` and then `GetPublicKeyCertificate` to retrieve its public key certificate. Next, you can then generate a TR-31 WrappedKeyBlock using your own ECC key pair, the public certificate of the service's ECC key pair, and the key derivation parameters including key derivation function, hash algorithm, derivation data, and key algorithm. If you have not already done so, you must import the CA chain that issued the receiving public key certificate by calling `ImportKey` with input `RootCertificatePublicKey` for root CA or `TrustedPublicKey` for intermediate CA. To complete the TR-31 key import, you can use the following parameters. It is important that the ECDH key derivation parameters you use should match those used during import to derive the same shared wrapping key within Amazon Web Services Payment Cryptography.
 *
 * - `KeyMaterial`: Use `DiffieHellmanTr31KeyBlock` parameters.
 *
 * - `PrivateKeyIdentifier`: The `KeyArn` of the ECC key pair created within Amazon Web Services Payment Cryptography to derive a shared KEK.
 *
 * - `PublicKeyCertificate`: The public key certificate of the receiving ECC key pair in PEM format (base64 encoded) to derive a shared KEK.
 *
 * - `CertificateAuthorityPublicKeyIdentifier`: The `keyARN` of the CA that signed the public key certificate of the receiving ECC key pair.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - ExportKey
 *
 * - GetParametersForImport
 */
export const importKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportKeyInput,
  output: ImportKeyOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the key metadata for an Amazon Web Services Payment Cryptography key, including the immutable and mutable attributes specified when the key was created. Returns key metadata including attributes, state, and timestamps, but does not return the actual cryptographic key material.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - CreateKey
 *
 * - DeleteKey
 *
 * - ListKeys
 */
export const getKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKeyInput,
  output: GetKeyOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the keys in the caller's Amazon Web Services account and Amazon Web Services Region. You can filter the list of keys.
 *
 * This is a paginated operation, which means that each response might contain only a subset of all the keys. When the response contains only a subset of keys, it includes a `NextToken` value. Use this value in a subsequent `ListKeys` request to get more keys. When you receive a response with no NextToken (or an empty or null value), that means there are no more keys to get.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - CreateKey
 *
 * - DeleteKey
 *
 * - GetKey
 */
export const listKeys = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListKeysInput,
  output: ListKeysOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Keys",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Associates an existing Amazon Web Services Payment Cryptography alias with a different key. Each alias is associated with only one Amazon Web Services Payment Cryptography key at a time, although a key can have multiple aliases. The alias and the Amazon Web Services Payment Cryptography key must be in the same Amazon Web Services account and Amazon Web Services Region
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - CreateAlias
 *
 * - DeleteAlias
 *
 * - GetAlias
 *
 * - ListAliases
 */
export const updateAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAliasInput,
  output: UpdateAliasOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the key material and metadata associated with Amazon Web Services Payment Cryptography key.
 *
 * Key deletion is irreversible. After a key is deleted, you can't perform cryptographic operations using the key. For example, you can't decrypt data that was encrypted by a deleted Amazon Web Services Payment Cryptography key, and the data may become unrecoverable. Because key deletion is destructive, Amazon Web Services Payment Cryptography has a safety mechanism to prevent accidental deletion of a key. When you call this operation, Amazon Web Services Payment Cryptography disables the specified key but doesn't delete it until after a waiting period set using `DeleteKeyInDays`. The default waiting period is 7 days. During the waiting period, the `KeyState` is `DELETE_PENDING`. After the key is deleted, the `KeyState` is `DELETE_COMPLETE`.
 *
 * You should delete a key only when you are sure that you don't need to use it anymore and no other parties are utilizing this key. If you aren't sure, consider deactivating it instead by calling StopKeyUsage.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - RestoreKey
 *
 * - StartKeyUsage
 *
 * - StopKeyUsage
 */
export const deleteKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKeyInput,
  output: DeleteKeyOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a tag from an Amazon Web Services Payment Cryptography key.
 *
 * Tagging or untagging an Amazon Web Services Payment Cryptography key can allow or deny permission to the key.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - ListTagsForResource
 *
 * - TagResource
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the alias, but doesn't affect the underlying key.
 *
 * Each key can have multiple aliases. To get the aliases of all keys, use the UpdateAlias operation. To change the alias of a key, first use DeleteAlias to delete the current alias and then use CreateAlias to create a new alias. To associate an existing alias with a different key, call UpdateAlias.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - CreateAlias
 *
 * - GetAlias
 *
 * - ListAliases
 *
 * - UpdateAlias
 */
export const deleteAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAliasInput,
  output: DeleteAliasOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the tags for an Amazon Web Services resource.
 *
 * This is a paginated operation, which means that each response might contain only a subset of all the tags. When the response contains only a subset of tags, it includes a `NextToken` value. Use this value in a subsequent `ListTagsForResource` request to get more tags. When you receive a response with no NextToken (or an empty or null value), that means there are no more tags to get.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - TagResource
 *
 * - UntagResource
 */
export const listTagsForResource =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTagsForResourceInput,
    output: ListTagsForResourceOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Tags",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets the Amazon Web Services Payment Cryptography key associated with the alias.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - CreateAlias
 *
 * - DeleteAlias
 *
 * - ListAliases
 *
 * - UpdateAlias
 */
export const getAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAliasInput,
  output: GetAliasOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the aliases for all keys in the caller's Amazon Web Services account and Amazon Web Services Region. You can filter the aliases by `keyARN`. For more information, see Using aliases in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * This is a paginated operation, which means that each response might contain only a subset of all the aliases. When the response contains only a subset of aliases, it includes a `NextToken` value. Use this value in a subsequent `ListAliases` request to get more aliases. When you receive a response with no NextToken (or an empty or null value), that means there are no more aliases to get.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - CreateAlias
 *
 * - DeleteAlias
 *
 * - GetAlias
 *
 * - UpdateAlias
 */
export const listAliases = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListAliasesInput,
    output: ListAliasesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Aliases",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Creates a certificate signing request (CSR) from a key pair.
 */
export const getCertificateSigningRequest =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCertificateSigningRequestInput,
    output: GetCertificateSigningRequestOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates an Amazon Web Services Payment Cryptography key, a logical representation of a cryptographic key, that is unique in your account and Amazon Web Services Region. You use keys for cryptographic functions such as encryption and decryption.
 *
 * In addition to the key material used in cryptographic operations, an Amazon Web Services Payment Cryptography key includes metadata such as the key ARN, key usage, key origin, creation date, description, and key state.
 *
 * When you create a key, you specify both immutable and mutable data about the key. The immutable data contains key attributes that define the scope and cryptographic operations that you can perform using the key, for example key class (example: `SYMMETRIC_KEY`), key algorithm (example: `TDES_2KEY`), key usage (example: `TR31_P0_PIN_ENCRYPTION_KEY`) and key modes of use (example: `Encrypt`). Amazon Web Services Payment Cryptography binds key attributes to keys using key blocks when you store or export them. Amazon Web Services Payment Cryptography stores the key contents wrapped and never stores or transmits them in the clear.
 *
 * For information about valid combinations of key attributes, see Understanding key attributes in the *Amazon Web Services Payment Cryptography User Guide*. The mutable data contained within a key includes usage timestamp and key deletion timestamp and can be modified after creation.
 *
 * You can use the `CreateKey` operation to generate an ECC (Elliptic Curve Cryptography) key pair used for establishing an ECDH (Elliptic Curve Diffie-Hellman) key agreement between two parties. In the ECDH key agreement process, both parties generate their own ECC key pair with key usage K3 and exchange the public keys. Each party then use their private key, the received public key from the other party, and the key derivation parameters including key derivation function, hash algorithm, derivation data, and key algorithm to derive a shared key.
 *
 * To maintain the single-use principle of cryptographic keys in payments, ECDH derived keys should not be used for multiple purposes, such as a `TR31_P0_PIN_ENCRYPTION_KEY` and `TR31_K1_KEY_BLOCK_PROTECTION_KEY`. When creating ECC key pairs in Amazon Web Services Payment Cryptography you can optionally set the `DeriveKeyUsage` parameter, which defines the key usage bound to the symmetric key that will be derived using the ECC key pair.
 *
 * **Cross-account use**: This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - DeleteKey
 *
 * - GetKey
 *
 * - ListKeys
 */
export const createKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKeyInput,
  output: CreateKeyOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an *alias*, or a friendly name, for an Amazon Web Services Payment Cryptography key. You can use an alias to identify a key in the console and when you call cryptographic operations such as EncryptData or DecryptData.
 *
 * You can associate the alias with any key in the same Amazon Web Services Region. Each alias is associated with only one key at a time, but a key can have multiple aliases. You can't create an alias without a key. The alias must be unique in the account and Amazon Web Services Region, but you can create another alias with the same name in a different Amazon Web Services Region.
 *
 * To change the key that's associated with the alias, call UpdateAlias. To delete the alias, call DeleteAlias. These operations don't affect the underlying key. To get the alias that you created, call ListAliases.
 *
 * **Cross-account use**: This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - DeleteAlias
 *
 * - GetAlias
 *
 * - ListAliases
 *
 * - UpdateAlias
 */
export const createAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAliasInput,
  output: CreateAliasOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the export token and the signing key certificate to initiate a TR-34 key export from Amazon Web Services Payment Cryptography.
 *
 * The signing key certificate signs the wrapped key under export within the TR-34 key payload. The export token and signing key certificate must be in place and operational before calling ExportKey. The export token expires in 30 days. You can use the same export token to export multiple keys from your service account.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - ExportKey
 *
 * - GetParametersForImport
 */
export const getParametersForExport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetParametersForExportInput,
    output: GetParametersForExportOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets the import token and the wrapping key certificate in PEM format (base64 encoded) to initiate a TR-34 WrappedKeyBlock or a RSA WrappedKeyCryptogram import into Amazon Web Services Payment Cryptography.
 *
 * The wrapping key certificate wraps the key under import. The import token and wrapping key certificate must be in place and operational before calling ImportKey. The import token expires in 30 days. You can use the same import token to import multiple keys into your service account.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - GetParametersForExport
 *
 * - ImportKey
 */
export const getParametersForImport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetParametersForImportInput,
    output: GetParametersForImportOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Adds replication Amazon Web Services Regions to an existing Amazon Web Services Payment Cryptography key, enabling the key to be used for cryptographic operations in additional Amazon Web Services Regions.
 *
 * Multi-Region key replication allow you to use the same key material across multiple Amazon Web Services Regions, providing lower latency for applications distributed across regions. When you add Replication Regions, Amazon Web Services Payment Cryptography securely replicates the key material to the specified Amazon Web Services Regions.
 *
 * The key must be in an active state to add Replication Regions. You can add multiple regions in a single operation, and the key will be available for use in those regions once replication is complete.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - RemoveKeyReplicationRegions
 *
 * - EnableDefaultKeyReplicationRegions
 *
 * - GetDefaultKeyReplicationRegions
 */
export const addKeyReplicationRegions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AddKeyReplicationRegionsInput,
    output: AddKeyReplicationRegionsOutput,
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
 * Removes Replication Regions from an existing Amazon Web Services Payment Cryptography key, disabling the key's availability for cryptographic operations in the specified Amazon Web Services Regions.
 *
 * When you remove Replication Regions, the key material is securely deleted from those regions and can no longer be used for cryptographic operations there. This operation is irreversible for the specified Amazon Web Services Regions. For more information, see Multi-Region key replication.
 *
 * Ensure that no active cryptographic operations or applications depend on the key in the regions you're removing before performing this operation.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - AddKeyReplicationRegions
 *
 * - DisableDefaultKeyReplicationRegions
 */
export const removeKeyReplicationRegions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveKeyReplicationRegionsInput,
    output: RemoveKeyReplicationRegionsOutput,
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
 * Cancels a scheduled key deletion during the waiting period. Use this operation to restore a `Key` that is scheduled for deletion.
 *
 * During the waiting period, the `KeyState` is `DELETE_PENDING` and `deletePendingTimestamp` contains the date and time after which the `Key` will be deleted. After `Key` is restored, the `KeyState` is `CREATE_COMPLETE`, and the value for `deletePendingTimestamp` is removed.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - DeleteKey
 *
 * - StartKeyUsage
 *
 * - StopKeyUsage
 */
export const restoreKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreKeyInput,
  output: RestoreKeyOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables an Amazon Web Services Payment Cryptography key, which makes it active for cryptographic operations within Amazon Web Services Payment Cryptography
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - StopKeyUsage
 */
export const startKeyUsage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartKeyUsageInput,
  output: StartKeyUsageOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Disables an Amazon Web Services Payment Cryptography key, which makes it inactive within Amazon Web Services Payment Cryptography.
 *
 * You can use this operation instead of DeleteKey to deactivate a key. You can enable the key in the future by calling StartKeyUsage.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - DeleteKey
 *
 * - StartKeyUsage
 */
export const stopKeyUsage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopKeyUsageInput,
  output: StopKeyUsageOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds or edits tags on an Amazon Web Services Payment Cryptography key.
 *
 * Tagging or untagging an Amazon Web Services Payment Cryptography key can allow or deny permission to the key.
 *
 * Each tag consists of a tag key and a tag value, both of which are case-sensitive strings. The tag value can be an empty (null) string. To add a tag, specify a new tag key and a tag value. To edit a tag, specify an existing tag key and a new tag value. You can also add tags to an Amazon Web Services Payment Cryptography key when you create it with CreateKey.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - ListTagsForResource
 *
 * - UntagResource
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Disables Multi-Region key replication settings for the specified Amazon Web Services Regions in your Amazon Web Services account, preventing new keys from being automatically replicated to those regions.
 *
 * After disabling Multi-Region key replication for specific regions, new keys created in your account will not be automatically replicated to those regions. You can still manually add replication to those regions for individual keys using the AddKeyReplicationRegions operation.
 *
 * This operation does not affect existing keys or their current replication configuration.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - EnableDefaultKeyReplicationRegions
 *
 * - GetDefaultKeyReplicationRegions
 */
export const disableDefaultKeyReplicationRegions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisableDefaultKeyReplicationRegionsInput,
    output: DisableDefaultKeyReplicationRegionsOutput,
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
 * Enables Multi-Region key replication settings for your Amazon Web Services account, causing new keys to be automatically replicated to the specified Amazon Web Services Regions when created.
 *
 * When Multi-Region key replication are enabled, any new keys created in your account will automatically be replicated to these regions unless you explicitly override this behavior during key creation. This simplifies key management for applications that operate across multiple regions.
 *
 * Existing keys are not affected by this operation - only keys created after enabling default replication will be automatically replicated.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - DisableDefaultKeyReplicationRegions
 *
 * - GetDefaultKeyReplicationRegions
 */
export const enableDefaultKeyReplicationRegions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: EnableDefaultKeyReplicationRegionsInput,
    output: EnableDefaultKeyReplicationRegionsOutput,
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
 * Retrieves the list of Amazon Web Services Regions where Multi-Region key replication is currently enabled for your Amazon Web Services account.
 *
 * This operation returns the current Multi-Region key replication configuration. New keys created in your account will be automatically replicated to these regions unless explicitly overridden during key creation.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - EnableDefaultKeyReplicationRegions
 *
 * - DisableDefaultKeyReplicationRegions
 */
export const getDefaultKeyReplicationRegions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDefaultKeyReplicationRegionsInput,
    output: GetDefaultKeyReplicationRegionsOutput,
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
 * Exports a key from Amazon Web Services Payment Cryptography.
 *
 * Amazon Web Services Payment Cryptography simplifies key exchange by replacing the existing paper-based approach with a modern electronic approach. With `ExportKey` you can export symmetric keys using either symmetric and asymmetric key exchange mechanisms. Using this operation, you can share your Amazon Web Services Payment Cryptography generated keys with other service partners to perform cryptographic operations outside of Amazon Web Services Payment Cryptography
 *
 * For symmetric key exchange, Amazon Web Services Payment Cryptography uses the ANSI X9 TR-31 norm in accordance with PCI PIN guidelines. And for asymmetric key exchange, Amazon Web Services Payment Cryptography supports ANSI X9 TR-34 norm, RSA unwrap, and ECDH (Elliptic Curve Diffie-Hellman) key exchange mechanisms. Asymmetric key exchange methods are typically used to establish bi-directional trust between the two parties exhanging keys and are used for initial key exchange such as Key Encryption Key (KEK). After which you can export working keys using symmetric method to perform various cryptographic operations within Amazon Web Services Payment Cryptography.
 *
 * PCI requires specific minimum key strength of wrapping keys used to protect the keys being exchanged electronically. These requirements can change when PCI standards are revised. The rules specify that wrapping keys used for transport must be at least as strong as the key being protected. For more information on recommended key strength of wrapping keys and key exchange mechanism, see Importing and exporting keys in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * You can also use `ExportKey` functionality to generate and export an IPEK (Initial Pin Encryption Key) from Amazon Web Services Payment Cryptography using either TR-31 or TR-34 export key exchange. IPEK is generated from BDK (Base Derivation Key) and `ExportDukptInitialKey` attribute KSN (`KeySerialNumber`). The generated IPEK does not persist within Amazon Web Services Payment Cryptography and has to be re-generated each time during export.
 *
 * For key exchange using TR-31 or TR-34 key blocks, you can also export optional blocks within the key block header which contain additional attribute information about the key. The `KeyVersion` within `KeyBlockHeaders` indicates the version of the key within the key block. Furthermore, `KeyExportability` within `KeyBlockHeaders` can be used to further restrict exportability of the key after export from Amazon Web Services Payment Cryptography.
 *
 * The `OptionalBlocks` contain the additional data related to the key. For information on data type that can be included within optional blocks, refer to ASC X9.143-2022.
 *
 * Data included in key block headers is signed but transmitted in clear text. Sensitive or confidential information should not be included in optional blocks. Refer to ASC X9.143-2022 standard for information on allowed data type.
 *
 * **To export initial keys (KEK) or IPEK using TR-34**
 *
 * Using this operation, you can export initial key using TR-34 asymmetric key exchange. You can only export KEK generated within Amazon Web Services Payment Cryptography. In TR-34 terminology, the sending party of the key is called Key Distribution Host (KDH) and the receiving party of the key is called Key Receiving Device (KRD). During key export process, KDH is Amazon Web Services Payment Cryptography which initiates key export and KRD is the user receiving the key.
 *
 * To initiate TR-34 key export, the KRD must obtain an export token by calling GetParametersForExport. This operation also generates a key pair for the purpose of key export, signs the key and returns back the signing public key certificate (also known as KDH signing certificate) and root certificate chain. The KDH uses the private key to sign the the export payload and the signing public key certificate is provided to KRD to verify the signature. The KRD can import the root certificate into its Hardware Security Module (HSM), as required. The export token and the associated KDH signing certificate expires after 30 days.
 *
 * Next the KRD generates a key pair for the the purpose of encrypting the KDH key and provides the public key cerificate (also known as KRD wrapping certificate) back to KDH. The KRD will also import the root cerificate chain into Amazon Web Services Payment Cryptography by calling ImportKey for `RootCertificatePublicKey`. The KDH, Amazon Web Services Payment Cryptography, will use the KRD wrapping cerificate to encrypt (wrap) the key under export and signs it with signing private key to generate a TR-34 WrappedKeyBlock. For more information on TR-34 key export, see section Exporting symmetric keys in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * Set the following parameters:
 *
 * - `ExportAttributes`: Specify export attributes in case of IPEK export. This parameter is optional for KEK export.
 *
 * - `ExportKeyIdentifier`: The `KeyARN` of the KEK or BDK (in case of IPEK) under export.
 *
 * - `KeyMaterial`: Use `Tr34KeyBlock` parameters.
 *
 * - `CertificateAuthorityPublicKeyIdentifier`: The `KeyARN` of the certificate chain that signed the KRD wrapping key certificate.
 *
 * - `ExportToken`: Obtained from KDH by calling GetParametersForImport.
 *
 * - `WrappingKeyCertificate`: The public key certificate in PEM format (base64 encoded) of the KRD wrapping key Amazon Web Services Payment Cryptography uses for encryption of the TR-34 export payload. This certificate must be signed by the root certificate (CertificateAuthorityPublicKeyIdentifier) imported into Amazon Web Services Payment Cryptography.
 *
 * When this operation is successful, Amazon Web Services Payment Cryptography returns the KEK or IPEK as a TR-34 WrappedKeyBlock.
 *
 * **To export initial keys (KEK) or IPEK using RSA Wrap and Unwrap**
 *
 * Using this operation, you can export initial key using asymmetric RSA wrap and unwrap key exchange method. To initiate export, generate an asymmetric key pair on the receiving HSM and obtain the public key certificate in PEM format (base64 encoded) for the purpose of wrapping and the root certifiate chain. Import the root certificate into Amazon Web Services Payment Cryptography by calling ImportKey for `RootCertificatePublicKey`.
 *
 * Next call `ExportKey` and set the following parameters:
 *
 * - `CertificateAuthorityPublicKeyIdentifier`: The `KeyARN` of the certificate chain that signed wrapping key certificate.
 *
 * - `KeyMaterial`: Set to `KeyCryptogram`.
 *
 * - `WrappingKeyCertificate`: The public key certificate in PEM format (base64 encoded) obtained by the receiving HSM and signed by the root certificate (CertificateAuthorityPublicKeyIdentifier) imported into Amazon Web Services Payment Cryptography. The receiving HSM uses its private key component to unwrap the WrappedKeyCryptogram.
 *
 * When this operation is successful, Amazon Web Services Payment Cryptography returns the WrappedKeyCryptogram.
 *
 * **To export working keys or IPEK using TR-31**
 *
 * Using this operation, you can export working keys or IPEK using TR-31 symmetric key exchange. In TR-31, you must use an initial key such as KEK to encrypt or wrap the key under export. To establish a KEK, you can use CreateKey or ImportKey.
 *
 * Set the following parameters:
 *
 * - `ExportAttributes`: Specify export attributes in case of IPEK export. This parameter is optional for KEK export.
 *
 * - `ExportKeyIdentifier`: The `KeyARN` of the KEK or BDK (in case of IPEK) under export.
 *
 * - `KeyMaterial`: Use `Tr31KeyBlock` parameters.
 *
 * **To export working keys using ECDH**
 *
 * You can also use ECDH key agreement to export working keys in a TR-31 keyblock, where the wrapping key is an ECDH derived key.
 *
 * To initiate a TR-31 key export using ECDH, both sides must create an ECC key pair with key usage K3 and exchange public key certificates. In Amazon Web Services Payment Cryptography, you can do this by calling `CreateKey`. If you have not already done so, you must import the CA chain that issued the receiving public key certificate by calling `ImportKey` with input `RootCertificatePublicKey` for root CA or `TrustedPublicKey` for intermediate CA. You can then complete a TR-31 key export by deriving a shared wrapping key using the service ECC key pair, public certificate of your ECC key pair outside of Amazon Web Services Payment Cryptography, and the key derivation parameters including key derivation function, hash algorithm, derivation data, key algorithm.
 *
 * - `KeyMaterial`: Use `DiffieHellmanTr31KeyBlock` parameters.
 *
 * - `PrivateKeyIdentifier`: The `KeyArn` of the ECC key pair created within Amazon Web Services Payment Cryptography to derive a shared KEK.
 *
 * - `PublicKeyCertificate`: The public key certificate of the receiving ECC key pair in PEM format (base64 encoded) to derive a shared KEK.
 *
 * - `CertificateAuthorityPublicKeyIdentifier`: The `keyARN` of the CA that signed the public key certificate of the receiving ECC key pair.
 *
 * When this operation is successful, Amazon Web Services Payment Cryptography returns the working key as a TR-31 WrappedKeyBlock, where the wrapping key is the ECDH derived key.
 *
 * **Cross-account use:** This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - GetParametersForExport
 *
 * - ImportKey
 */
export const exportKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportKeyInput,
  output: ExportKeyOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));

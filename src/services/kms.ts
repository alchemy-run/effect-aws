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
const ns = T.XmlNamespace("https://trent.amazonaws.com/doc/2014-11-01/");
const svc = T.AwsApiService({ sdkId: "KMS", serviceShapeName: "TrentService" });
const auth = T.AwsAuthSigv4({ name: "kms" });
const ver = T.ServiceVersion("2014-11-01");
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
                        url: "https://kms-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://kms-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://kms.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://kms.{Region}.{PartitionResult#dnsSuffix}",
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

//# Newtypes
export type KeyIdType = string;
export type CustomKeyStoreIdType = string;
export type AliasNameType = string;
export type CustomKeyStoreNameType = string;
export type CloudHsmClusterIdType = string;
export type TrustAnchorCertificateType = string;
export type KeyStorePasswordType = string | Redacted.Redacted<string>;
export type XksProxyUriEndpointType = string;
export type XksProxyUriPathType = string;
export type XksProxyVpcEndpointServiceNameType = string;
export type AccountIdType = string;
export type PrincipalIdType = string;
export type GrantTokenType = string;
export type GrantNameType = string;
export type PolicyType = string;
export type DescriptionType = string;
export type XksKeyIdType = string;
export type BackingKeyIdType = string;
export type LimitType = number;
export type MarkerType = string;
export type RotationPeriodInDaysType = number;
export type NumberOfBytesType = number;
export type PolicyNameType = string;
export type KeyMaterialDescriptionType = string;
export type GrantIdType = string;
export type RegionType = string;
export type PendingWindowInDaysType = number;
export type TagKeyType = string;
export type XksProxyAuthenticationAccessKeyIdType =
  | string
  | Redacted.Redacted<string>;
export type XksProxyAuthenticationRawSecretAccessKeyType =
  | string
  | Redacted.Redacted<string>;
export type TagValueType = string;
export type EncryptionContextKey = string;
export type EncryptionContextValue = string;
export type ErrorMessageType = string;
export type BackingKeyIdResponseType = string;
export type AWSAccountIdType = string;
export type ArnType = string;

//# Schemas
export type GrantOperationList = string[];
export const GrantOperationList = S.Array(S.String);
export type GrantTokenList = string[];
export const GrantTokenList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface CancelKeyDeletionRequest {
  KeyId: string;
}
export const CancelKeyDeletionRequest = S.suspend(() =>
  S.Struct({ KeyId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelKeyDeletionRequest",
}) as any as S.Schema<CancelKeyDeletionRequest>;
export interface ConnectCustomKeyStoreRequest {
  CustomKeyStoreId: string;
}
export const ConnectCustomKeyStoreRequest = S.suspend(() =>
  S.Struct({ CustomKeyStoreId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ConnectCustomKeyStoreRequest",
}) as any as S.Schema<ConnectCustomKeyStoreRequest>;
export interface ConnectCustomKeyStoreResponse {}
export const ConnectCustomKeyStoreResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ConnectCustomKeyStoreResponse",
}) as any as S.Schema<ConnectCustomKeyStoreResponse>;
export interface CreateAliasRequest {
  AliasName: string;
  TargetKeyId: string;
}
export const CreateAliasRequest = S.suspend(() =>
  S.Struct({ AliasName: S.String, TargetKeyId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAliasRequest",
}) as any as S.Schema<CreateAliasRequest>;
export interface CreateAliasResponse {}
export const CreateAliasResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateAliasResponse",
}) as any as S.Schema<CreateAliasResponse>;
export interface DeleteAliasRequest {
  AliasName: string;
}
export const DeleteAliasRequest = S.suspend(() =>
  S.Struct({ AliasName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAliasRequest",
}) as any as S.Schema<DeleteAliasRequest>;
export interface DeleteAliasResponse {}
export const DeleteAliasResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAliasResponse",
}) as any as S.Schema<DeleteAliasResponse>;
export interface DeleteCustomKeyStoreRequest {
  CustomKeyStoreId: string;
}
export const DeleteCustomKeyStoreRequest = S.suspend(() =>
  S.Struct({ CustomKeyStoreId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCustomKeyStoreRequest",
}) as any as S.Schema<DeleteCustomKeyStoreRequest>;
export interface DeleteCustomKeyStoreResponse {}
export const DeleteCustomKeyStoreResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteCustomKeyStoreResponse",
}) as any as S.Schema<DeleteCustomKeyStoreResponse>;
export interface DeleteImportedKeyMaterialRequest {
  KeyId: string;
  KeyMaterialId?: string;
}
export const DeleteImportedKeyMaterialRequest = S.suspend(() =>
  S.Struct({ KeyId: S.String, KeyMaterialId: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteImportedKeyMaterialRequest",
}) as any as S.Schema<DeleteImportedKeyMaterialRequest>;
export interface RecipientInfo {
  KeyEncryptionAlgorithm?: string;
  AttestationDocument?: Uint8Array;
}
export const RecipientInfo = S.suspend(() =>
  S.Struct({
    KeyEncryptionAlgorithm: S.optional(S.String),
    AttestationDocument: S.optional(T.Blob),
  }),
).annotations({
  identifier: "RecipientInfo",
}) as any as S.Schema<RecipientInfo>;
export interface DeriveSharedSecretRequest {
  KeyId: string;
  KeyAgreementAlgorithm: string;
  PublicKey: Uint8Array;
  GrantTokens?: GrantTokenList;
  DryRun?: boolean;
  Recipient?: RecipientInfo;
}
export const DeriveSharedSecretRequest = S.suspend(() =>
  S.Struct({
    KeyId: S.String,
    KeyAgreementAlgorithm: S.String,
    PublicKey: T.Blob,
    GrantTokens: S.optional(GrantTokenList),
    DryRun: S.optional(S.Boolean),
    Recipient: S.optional(RecipientInfo),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeriveSharedSecretRequest",
}) as any as S.Schema<DeriveSharedSecretRequest>;
export interface DescribeCustomKeyStoresRequest {
  CustomKeyStoreId?: string;
  CustomKeyStoreName?: string;
  Limit?: number;
  Marker?: string;
}
export const DescribeCustomKeyStoresRequest = S.suspend(() =>
  S.Struct({
    CustomKeyStoreId: S.optional(S.String),
    CustomKeyStoreName: S.optional(S.String),
    Limit: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCustomKeyStoresRequest",
}) as any as S.Schema<DescribeCustomKeyStoresRequest>;
export interface DescribeKeyRequest {
  KeyId: string;
  GrantTokens?: GrantTokenList;
}
export const DescribeKeyRequest = S.suspend(() =>
  S.Struct({ KeyId: S.String, GrantTokens: S.optional(GrantTokenList) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeKeyRequest",
}) as any as S.Schema<DescribeKeyRequest>;
export interface DisableKeyRequest {
  KeyId: string;
}
export const DisableKeyRequest = S.suspend(() =>
  S.Struct({ KeyId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableKeyRequest",
}) as any as S.Schema<DisableKeyRequest>;
export interface DisableKeyResponse {}
export const DisableKeyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisableKeyResponse",
}) as any as S.Schema<DisableKeyResponse>;
export interface DisableKeyRotationRequest {
  KeyId: string;
}
export const DisableKeyRotationRequest = S.suspend(() =>
  S.Struct({ KeyId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableKeyRotationRequest",
}) as any as S.Schema<DisableKeyRotationRequest>;
export interface DisableKeyRotationResponse {}
export const DisableKeyRotationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisableKeyRotationResponse",
}) as any as S.Schema<DisableKeyRotationResponse>;
export interface DisconnectCustomKeyStoreRequest {
  CustomKeyStoreId: string;
}
export const DisconnectCustomKeyStoreRequest = S.suspend(() =>
  S.Struct({ CustomKeyStoreId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisconnectCustomKeyStoreRequest",
}) as any as S.Schema<DisconnectCustomKeyStoreRequest>;
export interface DisconnectCustomKeyStoreResponse {}
export const DisconnectCustomKeyStoreResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisconnectCustomKeyStoreResponse",
}) as any as S.Schema<DisconnectCustomKeyStoreResponse>;
export interface EnableKeyRequest {
  KeyId: string;
}
export const EnableKeyRequest = S.suspend(() =>
  S.Struct({ KeyId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableKeyRequest",
}) as any as S.Schema<EnableKeyRequest>;
export interface EnableKeyResponse {}
export const EnableKeyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "EnableKeyResponse",
}) as any as S.Schema<EnableKeyResponse>;
export interface EnableKeyRotationRequest {
  KeyId: string;
  RotationPeriodInDays?: number;
}
export const EnableKeyRotationRequest = S.suspend(() =>
  S.Struct({
    KeyId: S.String,
    RotationPeriodInDays: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableKeyRotationRequest",
}) as any as S.Schema<EnableKeyRotationRequest>;
export interface EnableKeyRotationResponse {}
export const EnableKeyRotationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "EnableKeyRotationResponse",
}) as any as S.Schema<EnableKeyRotationResponse>;
export type EncryptionContextType = { [key: string]: string };
export const EncryptionContextType = S.Record({
  key: S.String,
  value: S.String,
});
export interface EncryptRequest {
  KeyId: string;
  Plaintext: Uint8Array | Redacted.Redacted<Uint8Array>;
  EncryptionContext?: EncryptionContextType;
  GrantTokens?: GrantTokenList;
  EncryptionAlgorithm?: string;
  DryRun?: boolean;
}
export const EncryptRequest = S.suspend(() =>
  S.Struct({
    KeyId: S.String,
    Plaintext: SensitiveBlob,
    EncryptionContext: S.optional(EncryptionContextType),
    GrantTokens: S.optional(GrantTokenList),
    EncryptionAlgorithm: S.optional(S.String),
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EncryptRequest",
}) as any as S.Schema<EncryptRequest>;
export interface GenerateDataKeyRequest {
  KeyId: string;
  EncryptionContext?: EncryptionContextType;
  NumberOfBytes?: number;
  KeySpec?: string;
  GrantTokens?: GrantTokenList;
  Recipient?: RecipientInfo;
  DryRun?: boolean;
}
export const GenerateDataKeyRequest = S.suspend(() =>
  S.Struct({
    KeyId: S.String,
    EncryptionContext: S.optional(EncryptionContextType),
    NumberOfBytes: S.optional(S.Number),
    KeySpec: S.optional(S.String),
    GrantTokens: S.optional(GrantTokenList),
    Recipient: S.optional(RecipientInfo),
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GenerateDataKeyRequest",
}) as any as S.Schema<GenerateDataKeyRequest>;
export interface GenerateDataKeyPairRequest {
  EncryptionContext?: EncryptionContextType;
  KeyId: string;
  KeyPairSpec: string;
  GrantTokens?: GrantTokenList;
  Recipient?: RecipientInfo;
  DryRun?: boolean;
}
export const GenerateDataKeyPairRequest = S.suspend(() =>
  S.Struct({
    EncryptionContext: S.optional(EncryptionContextType),
    KeyId: S.String,
    KeyPairSpec: S.String,
    GrantTokens: S.optional(GrantTokenList),
    Recipient: S.optional(RecipientInfo),
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GenerateDataKeyPairRequest",
}) as any as S.Schema<GenerateDataKeyPairRequest>;
export interface GenerateDataKeyPairWithoutPlaintextRequest {
  EncryptionContext?: EncryptionContextType;
  KeyId: string;
  KeyPairSpec: string;
  GrantTokens?: GrantTokenList;
  DryRun?: boolean;
}
export const GenerateDataKeyPairWithoutPlaintextRequest = S.suspend(() =>
  S.Struct({
    EncryptionContext: S.optional(EncryptionContextType),
    KeyId: S.String,
    KeyPairSpec: S.String,
    GrantTokens: S.optional(GrantTokenList),
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GenerateDataKeyPairWithoutPlaintextRequest",
}) as any as S.Schema<GenerateDataKeyPairWithoutPlaintextRequest>;
export interface GenerateDataKeyWithoutPlaintextRequest {
  KeyId: string;
  EncryptionContext?: EncryptionContextType;
  KeySpec?: string;
  NumberOfBytes?: number;
  GrantTokens?: GrantTokenList;
  DryRun?: boolean;
}
export const GenerateDataKeyWithoutPlaintextRequest = S.suspend(() =>
  S.Struct({
    KeyId: S.String,
    EncryptionContext: S.optional(EncryptionContextType),
    KeySpec: S.optional(S.String),
    NumberOfBytes: S.optional(S.Number),
    GrantTokens: S.optional(GrantTokenList),
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GenerateDataKeyWithoutPlaintextRequest",
}) as any as S.Schema<GenerateDataKeyWithoutPlaintextRequest>;
export interface GenerateMacRequest {
  Message: Uint8Array | Redacted.Redacted<Uint8Array>;
  KeyId: string;
  MacAlgorithm: string;
  GrantTokens?: GrantTokenList;
  DryRun?: boolean;
}
export const GenerateMacRequest = S.suspend(() =>
  S.Struct({
    Message: SensitiveBlob,
    KeyId: S.String,
    MacAlgorithm: S.String,
    GrantTokens: S.optional(GrantTokenList),
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GenerateMacRequest",
}) as any as S.Schema<GenerateMacRequest>;
export interface GenerateRandomRequest {
  NumberOfBytes?: number;
  CustomKeyStoreId?: string;
  Recipient?: RecipientInfo;
}
export const GenerateRandomRequest = S.suspend(() =>
  S.Struct({
    NumberOfBytes: S.optional(S.Number),
    CustomKeyStoreId: S.optional(S.String),
    Recipient: S.optional(RecipientInfo),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GenerateRandomRequest",
}) as any as S.Schema<GenerateRandomRequest>;
export interface GetKeyPolicyRequest {
  KeyId: string;
  PolicyName?: string;
}
export const GetKeyPolicyRequest = S.suspend(() =>
  S.Struct({ KeyId: S.String, PolicyName: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetKeyPolicyRequest",
}) as any as S.Schema<GetKeyPolicyRequest>;
export interface GetKeyRotationStatusRequest {
  KeyId: string;
}
export const GetKeyRotationStatusRequest = S.suspend(() =>
  S.Struct({ KeyId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetKeyRotationStatusRequest",
}) as any as S.Schema<GetKeyRotationStatusRequest>;
export interface GetParametersForImportRequest {
  KeyId: string;
  WrappingAlgorithm: string;
  WrappingKeySpec: string;
}
export const GetParametersForImportRequest = S.suspend(() =>
  S.Struct({
    KeyId: S.String,
    WrappingAlgorithm: S.String,
    WrappingKeySpec: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetParametersForImportRequest",
}) as any as S.Schema<GetParametersForImportRequest>;
export interface GetPublicKeyRequest {
  KeyId: string;
  GrantTokens?: GrantTokenList;
}
export const GetPublicKeyRequest = S.suspend(() =>
  S.Struct({ KeyId: S.String, GrantTokens: S.optional(GrantTokenList) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPublicKeyRequest",
}) as any as S.Schema<GetPublicKeyRequest>;
export interface ImportKeyMaterialRequest {
  KeyId: string;
  ImportToken: Uint8Array;
  EncryptedKeyMaterial: Uint8Array;
  ValidTo?: Date;
  ExpirationModel?: string;
  ImportType?: string;
  KeyMaterialDescription?: string;
  KeyMaterialId?: string;
}
export const ImportKeyMaterialRequest = S.suspend(() =>
  S.Struct({
    KeyId: S.String,
    ImportToken: T.Blob,
    EncryptedKeyMaterial: T.Blob,
    ValidTo: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ExpirationModel: S.optional(S.String),
    ImportType: S.optional(S.String),
    KeyMaterialDescription: S.optional(S.String),
    KeyMaterialId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ImportKeyMaterialRequest",
}) as any as S.Schema<ImportKeyMaterialRequest>;
export interface ListAliasesRequest {
  KeyId?: string;
  Limit?: number;
  Marker?: string;
}
export const ListAliasesRequest = S.suspend(() =>
  S.Struct({
    KeyId: S.optional(S.String),
    Limit: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAliasesRequest",
}) as any as S.Schema<ListAliasesRequest>;
export interface ListGrantsRequest {
  Limit?: number;
  Marker?: string;
  KeyId: string;
  GrantId?: string;
  GranteePrincipal?: string;
}
export const ListGrantsRequest = S.suspend(() =>
  S.Struct({
    Limit: S.optional(S.Number),
    Marker: S.optional(S.String),
    KeyId: S.String,
    GrantId: S.optional(S.String),
    GranteePrincipal: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGrantsRequest",
}) as any as S.Schema<ListGrantsRequest>;
export interface ListKeyPoliciesRequest {
  KeyId: string;
  Limit?: number;
  Marker?: string;
}
export const ListKeyPoliciesRequest = S.suspend(() =>
  S.Struct({
    KeyId: S.String,
    Limit: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKeyPoliciesRequest",
}) as any as S.Schema<ListKeyPoliciesRequest>;
export interface ListKeyRotationsRequest {
  KeyId: string;
  IncludeKeyMaterial?: string;
  Limit?: number;
  Marker?: string;
}
export const ListKeyRotationsRequest = S.suspend(() =>
  S.Struct({
    KeyId: S.String,
    IncludeKeyMaterial: S.optional(S.String),
    Limit: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKeyRotationsRequest",
}) as any as S.Schema<ListKeyRotationsRequest>;
export interface ListKeysRequest {
  Limit?: number;
  Marker?: string;
}
export const ListKeysRequest = S.suspend(() =>
  S.Struct({ Limit: S.optional(S.Number), Marker: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKeysRequest",
}) as any as S.Schema<ListKeysRequest>;
export interface ListResourceTagsRequest {
  KeyId: string;
  Limit?: number;
  Marker?: string;
}
export const ListResourceTagsRequest = S.suspend(() =>
  S.Struct({
    KeyId: S.String,
    Limit: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourceTagsRequest",
}) as any as S.Schema<ListResourceTagsRequest>;
export interface ListRetirableGrantsRequest {
  Limit?: number;
  Marker?: string;
  RetiringPrincipal: string;
}
export const ListRetirableGrantsRequest = S.suspend(() =>
  S.Struct({
    Limit: S.optional(S.Number),
    Marker: S.optional(S.String),
    RetiringPrincipal: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRetirableGrantsRequest",
}) as any as S.Schema<ListRetirableGrantsRequest>;
export interface PutKeyPolicyRequest {
  KeyId: string;
  PolicyName?: string;
  Policy: string;
  BypassPolicyLockoutSafetyCheck?: boolean;
}
export const PutKeyPolicyRequest = S.suspend(() =>
  S.Struct({
    KeyId: S.String,
    PolicyName: S.optional(S.String),
    Policy: S.String,
    BypassPolicyLockoutSafetyCheck: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutKeyPolicyRequest",
}) as any as S.Schema<PutKeyPolicyRequest>;
export interface PutKeyPolicyResponse {}
export const PutKeyPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutKeyPolicyResponse",
}) as any as S.Schema<PutKeyPolicyResponse>;
export interface ReEncryptRequest {
  CiphertextBlob: Uint8Array;
  SourceEncryptionContext?: EncryptionContextType;
  SourceKeyId?: string;
  DestinationKeyId: string;
  DestinationEncryptionContext?: EncryptionContextType;
  SourceEncryptionAlgorithm?: string;
  DestinationEncryptionAlgorithm?: string;
  GrantTokens?: GrantTokenList;
  DryRun?: boolean;
}
export const ReEncryptRequest = S.suspend(() =>
  S.Struct({
    CiphertextBlob: T.Blob,
    SourceEncryptionContext: S.optional(EncryptionContextType),
    SourceKeyId: S.optional(S.String),
    DestinationKeyId: S.String,
    DestinationEncryptionContext: S.optional(EncryptionContextType),
    SourceEncryptionAlgorithm: S.optional(S.String),
    DestinationEncryptionAlgorithm: S.optional(S.String),
    GrantTokens: S.optional(GrantTokenList),
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ReEncryptRequest",
}) as any as S.Schema<ReEncryptRequest>;
export interface Tag {
  TagKey: string;
  TagValue: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ TagKey: S.String, TagValue: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface ReplicateKeyRequest {
  KeyId: string;
  ReplicaRegion: string;
  Policy?: string;
  BypassPolicyLockoutSafetyCheck?: boolean;
  Description?: string;
  Tags?: TagList;
}
export const ReplicateKeyRequest = S.suspend(() =>
  S.Struct({
    KeyId: S.String,
    ReplicaRegion: S.String,
    Policy: S.optional(S.String),
    BypassPolicyLockoutSafetyCheck: S.optional(S.Boolean),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ReplicateKeyRequest",
}) as any as S.Schema<ReplicateKeyRequest>;
export interface RetireGrantRequest {
  GrantToken?: string;
  KeyId?: string;
  GrantId?: string;
  DryRun?: boolean;
}
export const RetireGrantRequest = S.suspend(() =>
  S.Struct({
    GrantToken: S.optional(S.String),
    KeyId: S.optional(S.String),
    GrantId: S.optional(S.String),
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RetireGrantRequest",
}) as any as S.Schema<RetireGrantRequest>;
export interface RetireGrantResponse {}
export const RetireGrantResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RetireGrantResponse",
}) as any as S.Schema<RetireGrantResponse>;
export interface RevokeGrantRequest {
  KeyId: string;
  GrantId: string;
  DryRun?: boolean;
}
export const RevokeGrantRequest = S.suspend(() =>
  S.Struct({
    KeyId: S.String,
    GrantId: S.String,
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RevokeGrantRequest",
}) as any as S.Schema<RevokeGrantRequest>;
export interface RevokeGrantResponse {}
export const RevokeGrantResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RevokeGrantResponse",
}) as any as S.Schema<RevokeGrantResponse>;
export interface RotateKeyOnDemandRequest {
  KeyId: string;
}
export const RotateKeyOnDemandRequest = S.suspend(() =>
  S.Struct({ KeyId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RotateKeyOnDemandRequest",
}) as any as S.Schema<RotateKeyOnDemandRequest>;
export interface ScheduleKeyDeletionRequest {
  KeyId: string;
  PendingWindowInDays?: number;
}
export const ScheduleKeyDeletionRequest = S.suspend(() =>
  S.Struct({ KeyId: S.String, PendingWindowInDays: S.optional(S.Number) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ScheduleKeyDeletionRequest",
}) as any as S.Schema<ScheduleKeyDeletionRequest>;
export interface SignRequest {
  KeyId: string;
  Message: Uint8Array | Redacted.Redacted<Uint8Array>;
  MessageType?: string;
  GrantTokens?: GrantTokenList;
  SigningAlgorithm: string;
  DryRun?: boolean;
}
export const SignRequest = S.suspend(() =>
  S.Struct({
    KeyId: S.String,
    Message: SensitiveBlob,
    MessageType: S.optional(S.String),
    GrantTokens: S.optional(GrantTokenList),
    SigningAlgorithm: S.String,
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "SignRequest" }) as any as S.Schema<SignRequest>;
export interface TagResourceRequest {
  KeyId: string;
  Tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ KeyId: S.String, Tags: TagList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  KeyId: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ KeyId: S.String, TagKeys: TagKeyList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateAliasRequest {
  AliasName: string;
  TargetKeyId: string;
}
export const UpdateAliasRequest = S.suspend(() =>
  S.Struct({ AliasName: S.String, TargetKeyId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAliasRequest",
}) as any as S.Schema<UpdateAliasRequest>;
export interface UpdateAliasResponse {}
export const UpdateAliasResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateAliasResponse",
}) as any as S.Schema<UpdateAliasResponse>;
export interface XksProxyAuthenticationCredentialType {
  AccessKeyId: string | Redacted.Redacted<string>;
  RawSecretAccessKey: string | Redacted.Redacted<string>;
}
export const XksProxyAuthenticationCredentialType = S.suspend(() =>
  S.Struct({
    AccessKeyId: SensitiveString,
    RawSecretAccessKey: SensitiveString,
  }),
).annotations({
  identifier: "XksProxyAuthenticationCredentialType",
}) as any as S.Schema<XksProxyAuthenticationCredentialType>;
export interface UpdateCustomKeyStoreRequest {
  CustomKeyStoreId: string;
  NewCustomKeyStoreName?: string;
  KeyStorePassword?: string | Redacted.Redacted<string>;
  CloudHsmClusterId?: string;
  XksProxyUriEndpoint?: string;
  XksProxyUriPath?: string;
  XksProxyVpcEndpointServiceName?: string;
  XksProxyVpcEndpointServiceOwner?: string;
  XksProxyAuthenticationCredential?: XksProxyAuthenticationCredentialType;
  XksProxyConnectivity?: string;
}
export const UpdateCustomKeyStoreRequest = S.suspend(() =>
  S.Struct({
    CustomKeyStoreId: S.String,
    NewCustomKeyStoreName: S.optional(S.String),
    KeyStorePassword: S.optional(SensitiveString),
    CloudHsmClusterId: S.optional(S.String),
    XksProxyUriEndpoint: S.optional(S.String),
    XksProxyUriPath: S.optional(S.String),
    XksProxyVpcEndpointServiceName: S.optional(S.String),
    XksProxyVpcEndpointServiceOwner: S.optional(S.String),
    XksProxyAuthenticationCredential: S.optional(
      XksProxyAuthenticationCredentialType,
    ),
    XksProxyConnectivity: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCustomKeyStoreRequest",
}) as any as S.Schema<UpdateCustomKeyStoreRequest>;
export interface UpdateCustomKeyStoreResponse {}
export const UpdateCustomKeyStoreResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateCustomKeyStoreResponse",
}) as any as S.Schema<UpdateCustomKeyStoreResponse>;
export interface UpdateKeyDescriptionRequest {
  KeyId: string;
  Description: string;
}
export const UpdateKeyDescriptionRequest = S.suspend(() =>
  S.Struct({ KeyId: S.String, Description: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateKeyDescriptionRequest",
}) as any as S.Schema<UpdateKeyDescriptionRequest>;
export interface UpdateKeyDescriptionResponse {}
export const UpdateKeyDescriptionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateKeyDescriptionResponse",
}) as any as S.Schema<UpdateKeyDescriptionResponse>;
export interface UpdatePrimaryRegionRequest {
  KeyId: string;
  PrimaryRegion: string;
}
export const UpdatePrimaryRegionRequest = S.suspend(() =>
  S.Struct({ KeyId: S.String, PrimaryRegion: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePrimaryRegionRequest",
}) as any as S.Schema<UpdatePrimaryRegionRequest>;
export interface UpdatePrimaryRegionResponse {}
export const UpdatePrimaryRegionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdatePrimaryRegionResponse",
}) as any as S.Schema<UpdatePrimaryRegionResponse>;
export interface VerifyRequest {
  KeyId: string;
  Message: Uint8Array | Redacted.Redacted<Uint8Array>;
  MessageType?: string;
  Signature: Uint8Array;
  SigningAlgorithm: string;
  GrantTokens?: GrantTokenList;
  DryRun?: boolean;
}
export const VerifyRequest = S.suspend(() =>
  S.Struct({
    KeyId: S.String,
    Message: SensitiveBlob,
    MessageType: S.optional(S.String),
    Signature: T.Blob,
    SigningAlgorithm: S.String,
    GrantTokens: S.optional(GrantTokenList),
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "VerifyRequest",
}) as any as S.Schema<VerifyRequest>;
export interface VerifyMacRequest {
  Message: Uint8Array | Redacted.Redacted<Uint8Array>;
  KeyId: string;
  MacAlgorithm: string;
  Mac: Uint8Array;
  GrantTokens?: GrantTokenList;
  DryRun?: boolean;
}
export const VerifyMacRequest = S.suspend(() =>
  S.Struct({
    Message: SensitiveBlob,
    KeyId: S.String,
    MacAlgorithm: S.String,
    Mac: T.Blob,
    GrantTokens: S.optional(GrantTokenList),
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "VerifyMacRequest",
}) as any as S.Schema<VerifyMacRequest>;
export interface GrantConstraints {
  EncryptionContextSubset?: EncryptionContextType;
  EncryptionContextEquals?: EncryptionContextType;
}
export const GrantConstraints = S.suspend(() =>
  S.Struct({
    EncryptionContextSubset: S.optional(EncryptionContextType),
    EncryptionContextEquals: S.optional(EncryptionContextType),
  }),
).annotations({
  identifier: "GrantConstraints",
}) as any as S.Schema<GrantConstraints>;
export type EncryptionAlgorithmSpecList = string[];
export const EncryptionAlgorithmSpecList = S.Array(S.String);
export type SigningAlgorithmSpecList = string[];
export const SigningAlgorithmSpecList = S.Array(S.String);
export type KeyAgreementAlgorithmSpecList = string[];
export const KeyAgreementAlgorithmSpecList = S.Array(S.String);
export type PolicyNameList = string[];
export const PolicyNameList = S.Array(S.String);
export interface CancelKeyDeletionResponse {
  KeyId?: string;
}
export const CancelKeyDeletionResponse = S.suspend(() =>
  S.Struct({ KeyId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CancelKeyDeletionResponse",
}) as any as S.Schema<CancelKeyDeletionResponse>;
export interface CreateCustomKeyStoreRequest {
  CustomKeyStoreName: string;
  CloudHsmClusterId?: string;
  TrustAnchorCertificate?: string;
  KeyStorePassword?: string | Redacted.Redacted<string>;
  CustomKeyStoreType?: string;
  XksProxyUriEndpoint?: string;
  XksProxyUriPath?: string;
  XksProxyVpcEndpointServiceName?: string;
  XksProxyVpcEndpointServiceOwner?: string;
  XksProxyAuthenticationCredential?: XksProxyAuthenticationCredentialType;
  XksProxyConnectivity?: string;
}
export const CreateCustomKeyStoreRequest = S.suspend(() =>
  S.Struct({
    CustomKeyStoreName: S.String,
    CloudHsmClusterId: S.optional(S.String),
    TrustAnchorCertificate: S.optional(S.String),
    KeyStorePassword: S.optional(SensitiveString),
    CustomKeyStoreType: S.optional(S.String),
    XksProxyUriEndpoint: S.optional(S.String),
    XksProxyUriPath: S.optional(S.String),
    XksProxyVpcEndpointServiceName: S.optional(S.String),
    XksProxyVpcEndpointServiceOwner: S.optional(S.String),
    XksProxyAuthenticationCredential: S.optional(
      XksProxyAuthenticationCredentialType,
    ),
    XksProxyConnectivity: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCustomKeyStoreRequest",
}) as any as S.Schema<CreateCustomKeyStoreRequest>;
export interface CreateGrantRequest {
  KeyId: string;
  GranteePrincipal: string;
  RetiringPrincipal?: string;
  Operations: GrantOperationList;
  Constraints?: GrantConstraints;
  GrantTokens?: GrantTokenList;
  Name?: string;
  DryRun?: boolean;
}
export const CreateGrantRequest = S.suspend(() =>
  S.Struct({
    KeyId: S.String,
    GranteePrincipal: S.String,
    RetiringPrincipal: S.optional(S.String),
    Operations: GrantOperationList,
    Constraints: S.optional(GrantConstraints),
    GrantTokens: S.optional(GrantTokenList),
    Name: S.optional(S.String),
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGrantRequest",
}) as any as S.Schema<CreateGrantRequest>;
export interface CreateKeyRequest {
  Policy?: string;
  Description?: string;
  KeyUsage?: string;
  CustomerMasterKeySpec?: string;
  KeySpec?: string;
  Origin?: string;
  CustomKeyStoreId?: string;
  BypassPolicyLockoutSafetyCheck?: boolean;
  Tags?: TagList;
  MultiRegion?: boolean;
  XksKeyId?: string;
}
export const CreateKeyRequest = S.suspend(() =>
  S.Struct({
    Policy: S.optional(S.String),
    Description: S.optional(S.String),
    KeyUsage: S.optional(S.String),
    CustomerMasterKeySpec: S.optional(S.String),
    KeySpec: S.optional(S.String),
    Origin: S.optional(S.String),
    CustomKeyStoreId: S.optional(S.String),
    BypassPolicyLockoutSafetyCheck: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    MultiRegion: S.optional(S.Boolean),
    XksKeyId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateKeyRequest",
}) as any as S.Schema<CreateKeyRequest>;
export interface DecryptRequest {
  CiphertextBlob: Uint8Array;
  EncryptionContext?: EncryptionContextType;
  GrantTokens?: GrantTokenList;
  KeyId?: string;
  EncryptionAlgorithm?: string;
  Recipient?: RecipientInfo;
  DryRun?: boolean;
}
export const DecryptRequest = S.suspend(() =>
  S.Struct({
    CiphertextBlob: T.Blob,
    EncryptionContext: S.optional(EncryptionContextType),
    GrantTokens: S.optional(GrantTokenList),
    KeyId: S.optional(S.String),
    EncryptionAlgorithm: S.optional(S.String),
    Recipient: S.optional(RecipientInfo),
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DecryptRequest",
}) as any as S.Schema<DecryptRequest>;
export interface DeleteImportedKeyMaterialResponse {
  KeyId?: string;
  KeyMaterialId?: string;
}
export const DeleteImportedKeyMaterialResponse = S.suspend(() =>
  S.Struct({
    KeyId: S.optional(S.String),
    KeyMaterialId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DeleteImportedKeyMaterialResponse",
}) as any as S.Schema<DeleteImportedKeyMaterialResponse>;
export interface DeriveSharedSecretResponse {
  KeyId?: string;
  SharedSecret?: Uint8Array | Redacted.Redacted<Uint8Array>;
  CiphertextForRecipient?: Uint8Array;
  KeyAgreementAlgorithm?: string;
  KeyOrigin?: string;
}
export const DeriveSharedSecretResponse = S.suspend(() =>
  S.Struct({
    KeyId: S.optional(S.String),
    SharedSecret: S.optional(SensitiveBlob),
    CiphertextForRecipient: S.optional(T.Blob),
    KeyAgreementAlgorithm: S.optional(S.String),
    KeyOrigin: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DeriveSharedSecretResponse",
}) as any as S.Schema<DeriveSharedSecretResponse>;
export interface EncryptResponse {
  CiphertextBlob?: Uint8Array;
  KeyId?: string;
  EncryptionAlgorithm?: string;
}
export const EncryptResponse = S.suspend(() =>
  S.Struct({
    CiphertextBlob: S.optional(T.Blob),
    KeyId: S.optional(S.String),
    EncryptionAlgorithm: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "EncryptResponse",
}) as any as S.Schema<EncryptResponse>;
export interface GenerateDataKeyResponse {
  CiphertextBlob?: Uint8Array;
  Plaintext?: Uint8Array | Redacted.Redacted<Uint8Array>;
  KeyId?: string;
  CiphertextForRecipient?: Uint8Array;
  KeyMaterialId?: string;
}
export const GenerateDataKeyResponse = S.suspend(() =>
  S.Struct({
    CiphertextBlob: S.optional(T.Blob),
    Plaintext: S.optional(SensitiveBlob),
    KeyId: S.optional(S.String),
    CiphertextForRecipient: S.optional(T.Blob),
    KeyMaterialId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GenerateDataKeyResponse",
}) as any as S.Schema<GenerateDataKeyResponse>;
export interface GenerateDataKeyPairResponse {
  PrivateKeyCiphertextBlob?: Uint8Array;
  PrivateKeyPlaintext?: Uint8Array | Redacted.Redacted<Uint8Array>;
  PublicKey?: Uint8Array;
  KeyId?: string;
  KeyPairSpec?: string;
  CiphertextForRecipient?: Uint8Array;
  KeyMaterialId?: string;
}
export const GenerateDataKeyPairResponse = S.suspend(() =>
  S.Struct({
    PrivateKeyCiphertextBlob: S.optional(T.Blob),
    PrivateKeyPlaintext: S.optional(SensitiveBlob),
    PublicKey: S.optional(T.Blob),
    KeyId: S.optional(S.String),
    KeyPairSpec: S.optional(S.String),
    CiphertextForRecipient: S.optional(T.Blob),
    KeyMaterialId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GenerateDataKeyPairResponse",
}) as any as S.Schema<GenerateDataKeyPairResponse>;
export interface GenerateDataKeyPairWithoutPlaintextResponse {
  PrivateKeyCiphertextBlob?: Uint8Array;
  PublicKey?: Uint8Array;
  KeyId?: string;
  KeyPairSpec?: string;
  KeyMaterialId?: string;
}
export const GenerateDataKeyPairWithoutPlaintextResponse = S.suspend(() =>
  S.Struct({
    PrivateKeyCiphertextBlob: S.optional(T.Blob),
    PublicKey: S.optional(T.Blob),
    KeyId: S.optional(S.String),
    KeyPairSpec: S.optional(S.String),
    KeyMaterialId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GenerateDataKeyPairWithoutPlaintextResponse",
}) as any as S.Schema<GenerateDataKeyPairWithoutPlaintextResponse>;
export interface GenerateDataKeyWithoutPlaintextResponse {
  CiphertextBlob?: Uint8Array;
  KeyId?: string;
  KeyMaterialId?: string;
}
export const GenerateDataKeyWithoutPlaintextResponse = S.suspend(() =>
  S.Struct({
    CiphertextBlob: S.optional(T.Blob),
    KeyId: S.optional(S.String),
    KeyMaterialId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GenerateDataKeyWithoutPlaintextResponse",
}) as any as S.Schema<GenerateDataKeyWithoutPlaintextResponse>;
export interface GenerateMacResponse {
  Mac?: Uint8Array;
  MacAlgorithm?: string;
  KeyId?: string;
}
export const GenerateMacResponse = S.suspend(() =>
  S.Struct({
    Mac: S.optional(T.Blob),
    MacAlgorithm: S.optional(S.String),
    KeyId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GenerateMacResponse",
}) as any as S.Schema<GenerateMacResponse>;
export interface GenerateRandomResponse {
  Plaintext?: Uint8Array | Redacted.Redacted<Uint8Array>;
  CiphertextForRecipient?: Uint8Array;
}
export const GenerateRandomResponse = S.suspend(() =>
  S.Struct({
    Plaintext: S.optional(SensitiveBlob),
    CiphertextForRecipient: S.optional(T.Blob),
  }).pipe(ns),
).annotations({
  identifier: "GenerateRandomResponse",
}) as any as S.Schema<GenerateRandomResponse>;
export interface GetKeyPolicyResponse {
  Policy?: string;
  PolicyName?: string;
}
export const GetKeyPolicyResponse = S.suspend(() =>
  S.Struct({
    Policy: S.optional(S.String),
    PolicyName: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetKeyPolicyResponse",
}) as any as S.Schema<GetKeyPolicyResponse>;
export interface GetKeyRotationStatusResponse {
  KeyRotationEnabled?: boolean;
  KeyId?: string;
  RotationPeriodInDays?: number;
  NextRotationDate?: Date;
  OnDemandRotationStartDate?: Date;
}
export const GetKeyRotationStatusResponse = S.suspend(() =>
  S.Struct({
    KeyRotationEnabled: S.optional(S.Boolean),
    KeyId: S.optional(S.String),
    RotationPeriodInDays: S.optional(S.Number),
    NextRotationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    OnDemandRotationStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "GetKeyRotationStatusResponse",
}) as any as S.Schema<GetKeyRotationStatusResponse>;
export interface GetParametersForImportResponse {
  KeyId?: string;
  ImportToken?: Uint8Array;
  PublicKey?: Uint8Array | Redacted.Redacted<Uint8Array>;
  ParametersValidTo?: Date;
}
export const GetParametersForImportResponse = S.suspend(() =>
  S.Struct({
    KeyId: S.optional(S.String),
    ImportToken: S.optional(T.Blob),
    PublicKey: S.optional(SensitiveBlob),
    ParametersValidTo: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "GetParametersForImportResponse",
}) as any as S.Schema<GetParametersForImportResponse>;
export interface GetPublicKeyResponse {
  KeyId?: string;
  PublicKey?: Uint8Array;
  CustomerMasterKeySpec?: string;
  KeySpec?: string;
  KeyUsage?: string;
  EncryptionAlgorithms?: EncryptionAlgorithmSpecList;
  SigningAlgorithms?: SigningAlgorithmSpecList;
  KeyAgreementAlgorithms?: KeyAgreementAlgorithmSpecList;
}
export const GetPublicKeyResponse = S.suspend(() =>
  S.Struct({
    KeyId: S.optional(S.String),
    PublicKey: S.optional(T.Blob),
    CustomerMasterKeySpec: S.optional(S.String),
    KeySpec: S.optional(S.String),
    KeyUsage: S.optional(S.String),
    EncryptionAlgorithms: S.optional(EncryptionAlgorithmSpecList),
    SigningAlgorithms: S.optional(SigningAlgorithmSpecList),
    KeyAgreementAlgorithms: S.optional(KeyAgreementAlgorithmSpecList),
  }).pipe(ns),
).annotations({
  identifier: "GetPublicKeyResponse",
}) as any as S.Schema<GetPublicKeyResponse>;
export interface ImportKeyMaterialResponse {
  KeyId?: string;
  KeyMaterialId?: string;
}
export const ImportKeyMaterialResponse = S.suspend(() =>
  S.Struct({
    KeyId: S.optional(S.String),
    KeyMaterialId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ImportKeyMaterialResponse",
}) as any as S.Schema<ImportKeyMaterialResponse>;
export interface ListKeyPoliciesResponse {
  PolicyNames?: PolicyNameList;
  NextMarker?: string;
  Truncated?: boolean;
}
export const ListKeyPoliciesResponse = S.suspend(() =>
  S.Struct({
    PolicyNames: S.optional(PolicyNameList),
    NextMarker: S.optional(S.String),
    Truncated: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "ListKeyPoliciesResponse",
}) as any as S.Schema<ListKeyPoliciesResponse>;
export interface ListResourceTagsResponse {
  Tags?: TagList;
  NextMarker?: string;
  Truncated?: boolean;
}
export const ListResourceTagsResponse = S.suspend(() =>
  S.Struct({
    Tags: S.optional(TagList),
    NextMarker: S.optional(S.String),
    Truncated: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "ListResourceTagsResponse",
}) as any as S.Schema<ListResourceTagsResponse>;
export interface ReEncryptResponse {
  CiphertextBlob?: Uint8Array;
  SourceKeyId?: string;
  KeyId?: string;
  SourceEncryptionAlgorithm?: string;
  DestinationEncryptionAlgorithm?: string;
  SourceKeyMaterialId?: string;
  DestinationKeyMaterialId?: string;
}
export const ReEncryptResponse = S.suspend(() =>
  S.Struct({
    CiphertextBlob: S.optional(T.Blob),
    SourceKeyId: S.optional(S.String),
    KeyId: S.optional(S.String),
    SourceEncryptionAlgorithm: S.optional(S.String),
    DestinationEncryptionAlgorithm: S.optional(S.String),
    SourceKeyMaterialId: S.optional(S.String),
    DestinationKeyMaterialId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ReEncryptResponse",
}) as any as S.Schema<ReEncryptResponse>;
export interface MultiRegionKey {
  Arn?: string;
  Region?: string;
}
export const MultiRegionKey = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Region: S.optional(S.String) }),
).annotations({
  identifier: "MultiRegionKey",
}) as any as S.Schema<MultiRegionKey>;
export type MultiRegionKeyList = MultiRegionKey[];
export const MultiRegionKeyList = S.Array(MultiRegionKey);
export interface MultiRegionConfiguration {
  MultiRegionKeyType?: string;
  PrimaryKey?: MultiRegionKey;
  ReplicaKeys?: MultiRegionKeyList;
}
export const MultiRegionConfiguration = S.suspend(() =>
  S.Struct({
    MultiRegionKeyType: S.optional(S.String),
    PrimaryKey: S.optional(MultiRegionKey),
    ReplicaKeys: S.optional(MultiRegionKeyList),
  }),
).annotations({
  identifier: "MultiRegionConfiguration",
}) as any as S.Schema<MultiRegionConfiguration>;
export type MacAlgorithmSpecList = string[];
export const MacAlgorithmSpecList = S.Array(S.String);
export interface XksKeyConfigurationType {
  Id?: string;
}
export const XksKeyConfigurationType = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String) }),
).annotations({
  identifier: "XksKeyConfigurationType",
}) as any as S.Schema<XksKeyConfigurationType>;
export interface KeyMetadata {
  AWSAccountId?: string;
  KeyId: string;
  Arn?: string;
  CreationDate?: Date;
  Enabled?: boolean;
  Description?: string;
  KeyUsage?: string;
  KeyState?: string;
  DeletionDate?: Date;
  ValidTo?: Date;
  Origin?: string;
  CustomKeyStoreId?: string;
  CloudHsmClusterId?: string;
  ExpirationModel?: string;
  KeyManager?: string;
  CustomerMasterKeySpec?: string;
  KeySpec?: string;
  EncryptionAlgorithms?: EncryptionAlgorithmSpecList;
  SigningAlgorithms?: SigningAlgorithmSpecList;
  KeyAgreementAlgorithms?: KeyAgreementAlgorithmSpecList;
  MultiRegion?: boolean;
  MultiRegionConfiguration?: MultiRegionConfiguration;
  PendingDeletionWindowInDays?: number;
  MacAlgorithms?: MacAlgorithmSpecList;
  XksKeyConfiguration?: XksKeyConfigurationType;
  CurrentKeyMaterialId?: string;
}
export const KeyMetadata = S.suspend(() =>
  S.Struct({
    AWSAccountId: S.optional(S.String),
    KeyId: S.String,
    Arn: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Enabled: S.optional(S.Boolean),
    Description: S.optional(S.String),
    KeyUsage: S.optional(S.String),
    KeyState: S.optional(S.String),
    DeletionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ValidTo: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Origin: S.optional(S.String),
    CustomKeyStoreId: S.optional(S.String),
    CloudHsmClusterId: S.optional(S.String),
    ExpirationModel: S.optional(S.String),
    KeyManager: S.optional(S.String),
    CustomerMasterKeySpec: S.optional(S.String),
    KeySpec: S.optional(S.String),
    EncryptionAlgorithms: S.optional(EncryptionAlgorithmSpecList),
    SigningAlgorithms: S.optional(SigningAlgorithmSpecList),
    KeyAgreementAlgorithms: S.optional(KeyAgreementAlgorithmSpecList),
    MultiRegion: S.optional(S.Boolean),
    MultiRegionConfiguration: S.optional(MultiRegionConfiguration),
    PendingDeletionWindowInDays: S.optional(S.Number),
    MacAlgorithms: S.optional(MacAlgorithmSpecList),
    XksKeyConfiguration: S.optional(XksKeyConfigurationType),
    CurrentKeyMaterialId: S.optional(S.String),
  }),
).annotations({ identifier: "KeyMetadata" }) as any as S.Schema<KeyMetadata>;
export interface ReplicateKeyResponse {
  ReplicaKeyMetadata?: KeyMetadata;
  ReplicaPolicy?: string;
  ReplicaTags?: TagList;
}
export const ReplicateKeyResponse = S.suspend(() =>
  S.Struct({
    ReplicaKeyMetadata: S.optional(KeyMetadata),
    ReplicaPolicy: S.optional(S.String),
    ReplicaTags: S.optional(TagList),
  }).pipe(ns),
).annotations({
  identifier: "ReplicateKeyResponse",
}) as any as S.Schema<ReplicateKeyResponse>;
export interface RotateKeyOnDemandResponse {
  KeyId?: string;
}
export const RotateKeyOnDemandResponse = S.suspend(() =>
  S.Struct({ KeyId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "RotateKeyOnDemandResponse",
}) as any as S.Schema<RotateKeyOnDemandResponse>;
export interface ScheduleKeyDeletionResponse {
  KeyId?: string;
  DeletionDate?: Date;
  KeyState?: string;
  PendingWindowInDays?: number;
}
export const ScheduleKeyDeletionResponse = S.suspend(() =>
  S.Struct({
    KeyId: S.optional(S.String),
    DeletionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    KeyState: S.optional(S.String),
    PendingWindowInDays: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "ScheduleKeyDeletionResponse",
}) as any as S.Schema<ScheduleKeyDeletionResponse>;
export interface SignResponse {
  KeyId?: string;
  Signature?: Uint8Array;
  SigningAlgorithm?: string;
}
export const SignResponse = S.suspend(() =>
  S.Struct({
    KeyId: S.optional(S.String),
    Signature: S.optional(T.Blob),
    SigningAlgorithm: S.optional(S.String),
  }).pipe(ns),
).annotations({ identifier: "SignResponse" }) as any as S.Schema<SignResponse>;
export interface VerifyResponse {
  KeyId?: string;
  SignatureValid?: boolean;
  SigningAlgorithm?: string;
}
export const VerifyResponse = S.suspend(() =>
  S.Struct({
    KeyId: S.optional(S.String),
    SignatureValid: S.optional(S.Boolean),
    SigningAlgorithm: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "VerifyResponse",
}) as any as S.Schema<VerifyResponse>;
export interface VerifyMacResponse {
  KeyId?: string;
  MacValid?: boolean;
  MacAlgorithm?: string;
}
export const VerifyMacResponse = S.suspend(() =>
  S.Struct({
    KeyId: S.optional(S.String),
    MacValid: S.optional(S.Boolean),
    MacAlgorithm: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "VerifyMacResponse",
}) as any as S.Schema<VerifyMacResponse>;
export interface AliasListEntry {
  AliasName?: string;
  AliasArn?: string;
  TargetKeyId?: string;
  CreationDate?: Date;
  LastUpdatedDate?: Date;
}
export const AliasListEntry = S.suspend(() =>
  S.Struct({
    AliasName: S.optional(S.String),
    AliasArn: S.optional(S.String),
    TargetKeyId: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "AliasListEntry",
}) as any as S.Schema<AliasListEntry>;
export type AliasList = AliasListEntry[];
export const AliasList = S.Array(AliasListEntry);
export interface GrantListEntry {
  KeyId?: string;
  GrantId?: string;
  Name?: string;
  CreationDate?: Date;
  GranteePrincipal?: string;
  RetiringPrincipal?: string;
  IssuingAccount?: string;
  Operations?: GrantOperationList;
  Constraints?: GrantConstraints;
}
export const GrantListEntry = S.suspend(() =>
  S.Struct({
    KeyId: S.optional(S.String),
    GrantId: S.optional(S.String),
    Name: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    GranteePrincipal: S.optional(S.String),
    RetiringPrincipal: S.optional(S.String),
    IssuingAccount: S.optional(S.String),
    Operations: S.optional(GrantOperationList),
    Constraints: S.optional(GrantConstraints),
  }),
).annotations({
  identifier: "GrantListEntry",
}) as any as S.Schema<GrantListEntry>;
export type GrantList = GrantListEntry[];
export const GrantList = S.Array(GrantListEntry);
export interface RotationsListEntry {
  KeyId?: string;
  KeyMaterialId?: string;
  KeyMaterialDescription?: string;
  ImportState?: string;
  KeyMaterialState?: string;
  ExpirationModel?: string;
  ValidTo?: Date;
  RotationDate?: Date;
  RotationType?: string;
}
export const RotationsListEntry = S.suspend(() =>
  S.Struct({
    KeyId: S.optional(S.String),
    KeyMaterialId: S.optional(S.String),
    KeyMaterialDescription: S.optional(S.String),
    ImportState: S.optional(S.String),
    KeyMaterialState: S.optional(S.String),
    ExpirationModel: S.optional(S.String),
    ValidTo: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    RotationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    RotationType: S.optional(S.String),
  }),
).annotations({
  identifier: "RotationsListEntry",
}) as any as S.Schema<RotationsListEntry>;
export type RotationsList = RotationsListEntry[];
export const RotationsList = S.Array(RotationsListEntry);
export interface KeyListEntry {
  KeyId?: string;
  KeyArn?: string;
}
export const KeyListEntry = S.suspend(() =>
  S.Struct({ KeyId: S.optional(S.String), KeyArn: S.optional(S.String) }),
).annotations({ identifier: "KeyListEntry" }) as any as S.Schema<KeyListEntry>;
export type KeyList = KeyListEntry[];
export const KeyList = S.Array(KeyListEntry);
export interface CreateCustomKeyStoreResponse {
  CustomKeyStoreId?: string;
}
export const CreateCustomKeyStoreResponse = S.suspend(() =>
  S.Struct({ CustomKeyStoreId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateCustomKeyStoreResponse",
}) as any as S.Schema<CreateCustomKeyStoreResponse>;
export interface CreateGrantResponse {
  GrantToken?: string;
  GrantId?: string;
}
export const CreateGrantResponse = S.suspend(() =>
  S.Struct({
    GrantToken: S.optional(S.String),
    GrantId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateGrantResponse",
}) as any as S.Schema<CreateGrantResponse>;
export interface CreateKeyResponse {
  KeyMetadata?: KeyMetadata;
}
export const CreateKeyResponse = S.suspend(() =>
  S.Struct({ KeyMetadata: S.optional(KeyMetadata) }).pipe(ns),
).annotations({
  identifier: "CreateKeyResponse",
}) as any as S.Schema<CreateKeyResponse>;
export interface DecryptResponse {
  KeyId?: string;
  Plaintext?: Uint8Array | Redacted.Redacted<Uint8Array>;
  EncryptionAlgorithm?: string;
  CiphertextForRecipient?: Uint8Array;
  KeyMaterialId?: string;
}
export const DecryptResponse = S.suspend(() =>
  S.Struct({
    KeyId: S.optional(S.String),
    Plaintext: S.optional(SensitiveBlob),
    EncryptionAlgorithm: S.optional(S.String),
    CiphertextForRecipient: S.optional(T.Blob),
    KeyMaterialId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DecryptResponse",
}) as any as S.Schema<DecryptResponse>;
export interface ListAliasesResponse {
  Aliases?: AliasList;
  NextMarker?: string;
  Truncated?: boolean;
}
export const ListAliasesResponse = S.suspend(() =>
  S.Struct({
    Aliases: S.optional(AliasList),
    NextMarker: S.optional(S.String),
    Truncated: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "ListAliasesResponse",
}) as any as S.Schema<ListAliasesResponse>;
export interface ListGrantsResponse {
  Grants?: GrantList;
  NextMarker?: string;
  Truncated?: boolean;
}
export const ListGrantsResponse = S.suspend(() =>
  S.Struct({
    Grants: S.optional(GrantList),
    NextMarker: S.optional(S.String),
    Truncated: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "ListGrantsResponse",
}) as any as S.Schema<ListGrantsResponse>;
export interface ListKeyRotationsResponse {
  Rotations?: RotationsList;
  NextMarker?: string;
  Truncated?: boolean;
}
export const ListKeyRotationsResponse = S.suspend(() =>
  S.Struct({
    Rotations: S.optional(RotationsList),
    NextMarker: S.optional(S.String),
    Truncated: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "ListKeyRotationsResponse",
}) as any as S.Schema<ListKeyRotationsResponse>;
export interface ListKeysResponse {
  Keys?: KeyList;
  NextMarker?: string;
  Truncated?: boolean;
}
export const ListKeysResponse = S.suspend(() =>
  S.Struct({
    Keys: S.optional(KeyList),
    NextMarker: S.optional(S.String),
    Truncated: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "ListKeysResponse",
}) as any as S.Schema<ListKeysResponse>;
export interface XksProxyConfigurationType {
  Connectivity?: string;
  AccessKeyId?: string | Redacted.Redacted<string>;
  UriEndpoint?: string;
  UriPath?: string;
  VpcEndpointServiceName?: string;
  VpcEndpointServiceOwner?: string;
}
export const XksProxyConfigurationType = S.suspend(() =>
  S.Struct({
    Connectivity: S.optional(S.String),
    AccessKeyId: S.optional(SensitiveString),
    UriEndpoint: S.optional(S.String),
    UriPath: S.optional(S.String),
    VpcEndpointServiceName: S.optional(S.String),
    VpcEndpointServiceOwner: S.optional(S.String),
  }),
).annotations({
  identifier: "XksProxyConfigurationType",
}) as any as S.Schema<XksProxyConfigurationType>;
export interface CustomKeyStoresListEntry {
  CustomKeyStoreId?: string;
  CustomKeyStoreName?: string;
  CloudHsmClusterId?: string;
  TrustAnchorCertificate?: string;
  ConnectionState?: string;
  ConnectionErrorCode?: string;
  CreationDate?: Date;
  CustomKeyStoreType?: string;
  XksProxyConfiguration?: XksProxyConfigurationType;
}
export const CustomKeyStoresListEntry = S.suspend(() =>
  S.Struct({
    CustomKeyStoreId: S.optional(S.String),
    CustomKeyStoreName: S.optional(S.String),
    CloudHsmClusterId: S.optional(S.String),
    TrustAnchorCertificate: S.optional(S.String),
    ConnectionState: S.optional(S.String),
    ConnectionErrorCode: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CustomKeyStoreType: S.optional(S.String),
    XksProxyConfiguration: S.optional(XksProxyConfigurationType),
  }),
).annotations({
  identifier: "CustomKeyStoresListEntry",
}) as any as S.Schema<CustomKeyStoresListEntry>;
export type CustomKeyStoresList = CustomKeyStoresListEntry[];
export const CustomKeyStoresList = S.Array(CustomKeyStoresListEntry);
export interface DescribeCustomKeyStoresResponse {
  CustomKeyStores?: CustomKeyStoresList;
  NextMarker?: string;
  Truncated?: boolean;
}
export const DescribeCustomKeyStoresResponse = S.suspend(() =>
  S.Struct({
    CustomKeyStores: S.optional(CustomKeyStoresList),
    NextMarker: S.optional(S.String),
    Truncated: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "DescribeCustomKeyStoresResponse",
}) as any as S.Schema<DescribeCustomKeyStoresResponse>;
export interface DescribeKeyResponse {
  KeyMetadata?: KeyMetadata;
}
export const DescribeKeyResponse = S.suspend(() =>
  S.Struct({ KeyMetadata: S.optional(KeyMetadata) }).pipe(ns),
).annotations({
  identifier: "DescribeKeyResponse",
}) as any as S.Schema<DescribeKeyResponse>;

//# Errors
export class CloudHsmClusterInvalidConfigurationException extends S.TaggedError<CloudHsmClusterInvalidConfigurationException>()(
  "CloudHsmClusterInvalidConfigurationException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CloudHsmClusterInvalidConfigurationException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class AlreadyExistsException extends S.TaggedError<AlreadyExistsException>()(
  "AlreadyExistsException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "AlreadyExists", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class DependencyTimeoutException extends S.TaggedError<DependencyTimeoutException>()(
  "DependencyTimeoutException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DependencyTimeout", httpResponseCode: 503 }),
).pipe(C.withServerError) {}
export class CustomKeyStoreHasCMKsException extends S.TaggedError<CustomKeyStoreHasCMKsException>()(
  "CustomKeyStoreHasCMKsException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CustomKeyStoreHasCMKsException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class CustomKeyStoreInvalidStateException extends S.TaggedError<CustomKeyStoreInvalidStateException>()(
  "CustomKeyStoreInvalidStateException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CustomKeyStoreInvalidStateException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidArnException extends S.TaggedError<InvalidArnException>()(
  "InvalidArnException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidArn", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DisabledException extends S.TaggedError<DisabledException>()(
  "DisabledException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "Disabled", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class CloudHsmClusterNotActiveException extends S.TaggedError<CloudHsmClusterNotActiveException>()(
  "CloudHsmClusterNotActiveException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CloudHsmClusterNotActiveException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class KMSInternalException extends S.TaggedError<KMSInternalException>()(
  "KMSInternalException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSInternal", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class CustomKeyStoreNotFoundException extends S.TaggedError<CustomKeyStoreNotFoundException>()(
  "CustomKeyStoreNotFoundException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CustomKeyStoreNotFoundException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ExpiredImportTokenException extends S.TaggedError<ExpiredImportTokenException>()(
  "ExpiredImportTokenException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ExpiredImportTokenException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ConflictException", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class DryRunOperationException extends S.TaggedError<DryRunOperationException>()(
  "DryRunOperationException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DryRunOperation", httpResponseCode: 412 }),
) {}
export class InvalidMarkerException extends S.TaggedError<InvalidMarkerException>()(
  "InvalidMarkerException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidMarker", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidAliasNameException extends S.TaggedError<InvalidAliasNameException>()(
  "InvalidAliasNameException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidAliasName", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidGrantTokenException extends S.TaggedError<InvalidGrantTokenException>()(
  "InvalidGrantTokenException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidGrantToken", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class CloudHsmClusterInUseException extends S.TaggedError<CloudHsmClusterInUseException>()(
  "CloudHsmClusterInUseException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CloudHsmClusterInUseException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class KMSInvalidStateException extends S.TaggedError<KMSInvalidStateException>()(
  "KMSInvalidStateException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSInvalidStateException", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class IncorrectKeyMaterialException extends S.TaggedError<IncorrectKeyMaterialException>()(
  "IncorrectKeyMaterialException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IncorrectKeyMaterialException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidGrantIdException extends S.TaggedError<InvalidGrantIdException>()(
  "InvalidGrantIdException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidGrantId", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class CloudHsmClusterNotFoundException extends S.TaggedError<CloudHsmClusterNotFoundException>()(
  "CloudHsmClusterNotFoundException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CloudHsmClusterNotFoundException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "NotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UnsupportedOperation", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "LimitExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidKeyUsageException extends S.TaggedError<InvalidKeyUsageException>()(
  "InvalidKeyUsageException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidKeyUsage", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class IncorrectKeyException extends S.TaggedError<IncorrectKeyException>()(
  "IncorrectKeyException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "IncorrectKeyException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidCiphertextException extends S.TaggedError<InvalidCiphertextException>()(
  "InvalidCiphertextException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidCiphertext", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class CloudHsmClusterNotRelatedException extends S.TaggedError<CloudHsmClusterNotRelatedException>()(
  "CloudHsmClusterNotRelatedException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CloudHsmClusterNotRelatedException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class TagException extends S.TaggedError<TagException>()(
  "TagException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TagException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class MalformedPolicyDocumentException extends S.TaggedError<MalformedPolicyDocumentException>()(
  "MalformedPolicyDocumentException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "MalformedPolicyDocument", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class KeyUnavailableException extends S.TaggedError<KeyUnavailableException>()(
  "KeyUnavailableException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KeyUnavailable", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class CustomKeyStoreNameInUseException extends S.TaggedError<CustomKeyStoreNameInUseException>()(
  "CustomKeyStoreNameInUseException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CustomKeyStoreNameInUseException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidImportTokenException extends S.TaggedError<InvalidImportTokenException>()(
  "InvalidImportTokenException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidImportTokenException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class XksKeyAlreadyInUseException extends S.TaggedError<XksKeyAlreadyInUseException>()(
  "XksKeyAlreadyInUseException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "XksKeyAlreadyInUse", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class IncorrectTrustAnchorException extends S.TaggedError<IncorrectTrustAnchorException>()(
  "IncorrectTrustAnchorException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IncorrectTrustAnchorException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class KMSInvalidMacException extends S.TaggedError<KMSInvalidMacException>()(
  "KMSInvalidMacException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSInvalidMac", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class KMSInvalidSignatureException extends S.TaggedError<KMSInvalidSignatureException>()(
  "KMSInvalidSignatureException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSInvalidSignature", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class XksProxyIncorrectAuthenticationCredentialException extends S.TaggedError<XksProxyIncorrectAuthenticationCredentialException>()(
  "XksProxyIncorrectAuthenticationCredentialException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "XksProxyIncorrectAuthenticationCredentialException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class XksKeyInvalidConfigurationException extends S.TaggedError<XksKeyInvalidConfigurationException>()(
  "XksKeyInvalidConfigurationException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "XksKeyInvalidConfiguration",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class XksProxyInvalidConfigurationException extends S.TaggedError<XksProxyInvalidConfigurationException>()(
  "XksProxyInvalidConfigurationException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "XksProxyInvalidConfigurationException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class XksKeyNotFoundException extends S.TaggedError<XksKeyNotFoundException>()(
  "XksKeyNotFoundException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "XksKeyNotFoundException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class XksProxyInvalidResponseException extends S.TaggedError<XksProxyInvalidResponseException>()(
  "XksProxyInvalidResponseException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "XksProxyInvalidResponseException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class XksProxyUriEndpointInUseException extends S.TaggedError<XksProxyUriEndpointInUseException>()(
  "XksProxyUriEndpointInUseException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "XksProxyUriEndpointInUseException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class XksProxyUriInUseException extends S.TaggedError<XksProxyUriInUseException>()(
  "XksProxyUriInUseException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "XksProxyUriInUseException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class XksProxyUriUnreachableException extends S.TaggedError<XksProxyUriUnreachableException>()(
  "XksProxyUriUnreachableException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "XksProxyUriUnreachableException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class XksProxyVpcEndpointServiceInUseException extends S.TaggedError<XksProxyVpcEndpointServiceInUseException>()(
  "XksProxyVpcEndpointServiceInUseException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "XksProxyVpcEndpointServiceInUseException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class XksProxyVpcEndpointServiceInvalidConfigurationException extends S.TaggedError<XksProxyVpcEndpointServiceInvalidConfigurationException>()(
  "XksProxyVpcEndpointServiceInvalidConfigurationException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "XksProxyVpcEndpointServiceInvalidConfigurationException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class XksProxyVpcEndpointServiceNotFoundException extends S.TaggedError<XksProxyVpcEndpointServiceNotFoundException>()(
  "XksProxyVpcEndpointServiceNotFoundException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "XksProxyVpcEndpointServiceNotFoundException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Disconnects the custom key store from its backing key store. This operation disconnects an
 * CloudHSM key store from its associated CloudHSM cluster or disconnects an external key store from
 * the external key store proxy that communicates with your external key manager.
 *
 * This operation is part of the custom key stores feature in KMS, which
 * combines the convenience and extensive integration of KMS with the isolation and control of a
 * key store that you own and manage.
 *
 * While a custom key store is disconnected, you can manage the custom key store and its KMS
 * keys, but you cannot create or use its KMS keys. You can reconnect the custom key store at any
 * time.
 *
 * While a custom key store is disconnected, all attempts to create KMS keys in the custom key store or to use existing KMS keys in cryptographic operations will
 * fail. This action can prevent users from storing and accessing sensitive data.
 *
 * When you disconnect a custom key store, its `ConnectionState` changes to
 * `Disconnected`. To find the connection state of a custom key store, use the DescribeCustomKeyStores operation. To reconnect a custom key store, use the
 * ConnectCustomKeyStore operation.
 *
 * If the operation succeeds, it returns a JSON object with no
 * properties.
 *
 * **Cross-account use**: No. You cannot perform this operation on a custom key store in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:DisconnectCustomKeyStore (IAM policy)
 *
 * **Related operations:**
 *
 * - ConnectCustomKeyStore
 *
 * - CreateCustomKeyStore
 *
 * - DeleteCustomKeyStore
 *
 * - DescribeCustomKeyStores
 *
 * - UpdateCustomKeyStore
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const disconnectCustomKeyStore: (
  input: DisconnectCustomKeyStoreRequest,
) => Effect.Effect<
  DisconnectCustomKeyStoreResponse,
  | CustomKeyStoreInvalidStateException
  | CustomKeyStoreNotFoundException
  | KMSInternalException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisconnectCustomKeyStoreRequest,
  output: DisconnectCustomKeyStoreResponse,
  errors: [
    CustomKeyStoreInvalidStateException,
    CustomKeyStoreNotFoundException,
    KMSInternalException,
  ],
}));
/**
 * Deletes a custom key store. This operation does not affect any backing elements of the
 * custom key store. It does not delete the CloudHSM cluster that is associated with an CloudHSM key
 * store, or affect any users or keys in the cluster. For an external key store, it does not
 * affect the external key store proxy, external key manager, or any external keys.
 *
 * This operation is part of the custom key stores feature in KMS, which
 * combines the convenience and extensive integration of KMS with the isolation and control of a
 * key store that you own and manage.
 *
 * The custom key store that you delete cannot contain any KMS keys. Before deleting the key store,
 * verify that you will never need to use any of the KMS keys in the key store for any
 * cryptographic operations. Then, use ScheduleKeyDeletion to delete the KMS keys from the
 * key store. After the required waiting period expires and all KMS keys are deleted from the
 * custom key store, use DisconnectCustomKeyStore to disconnect the key store
 * from KMS. Then, you can delete the custom key store.
 *
 * For keys in an CloudHSM key store, the `ScheduleKeyDeletion` operation makes a
 * best effort to delete the key material from the associated cluster. However, you might need to
 * manually delete the orphaned key
 * material from the cluster and its backups. KMS never creates, manages, or deletes
 * cryptographic keys in the external key manager associated with an external key store. You must
 * manage them using your external key manager tools.
 *
 * Instead of deleting the custom key store, consider using the DisconnectCustomKeyStore operation to disconnect the custom key store from its
 * backing key store. While the key store is disconnected, you cannot create or use the KMS keys
 * in the key store. But, you do not need to delete KMS keys and you can reconnect a disconnected
 * custom key store at any time.
 *
 * If the operation succeeds, it returns a JSON object with no
 * properties.
 *
 * **Cross-account use**: No. You cannot perform this operation on a custom key store in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:DeleteCustomKeyStore (IAM policy)
 *
 * **Related operations:**
 *
 * - ConnectCustomKeyStore
 *
 * - CreateCustomKeyStore
 *
 * - DescribeCustomKeyStores
 *
 * - DisconnectCustomKeyStore
 *
 * - UpdateCustomKeyStore
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const deleteCustomKeyStore: (
  input: DeleteCustomKeyStoreRequest,
) => Effect.Effect<
  DeleteCustomKeyStoreResponse,
  | CustomKeyStoreHasCMKsException
  | CustomKeyStoreInvalidStateException
  | CustomKeyStoreNotFoundException
  | KMSInternalException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomKeyStoreRequest,
  output: DeleteCustomKeyStoreResponse,
  errors: [
    CustomKeyStoreHasCMKsException,
    CustomKeyStoreInvalidStateException,
    CustomKeyStoreNotFoundException,
    KMSInternalException,
  ],
}));
/**
 * Connects or reconnects a custom key store to its backing key store. For an CloudHSM key
 * store, `ConnectCustomKeyStore` connects the key store to its associated CloudHSM
 * cluster. For an external key store, `ConnectCustomKeyStore` connects the key store
 * to the external key store proxy that communicates with your external key manager.
 *
 * The custom key store must be connected before you can create KMS keys in the key store or
 * use the KMS keys it contains. You can disconnect and reconnect a custom key store at any
 * time.
 *
 * The connection process for a custom key store can take an extended amount of time to
 * complete. This operation starts the connection process, but it does not wait for it to
 * complete. When it succeeds, this operation quickly returns an HTTP 200 response and a JSON
 * object with no properties. However, this response does not indicate that the custom key store
 * is connected. To get the connection state of the custom key store, use the DescribeCustomKeyStores operation.
 *
 * This operation is part of the custom key stores feature in KMS, which
 * combines the convenience and extensive integration of KMS with the isolation and control of a
 * key store that you own and manage.
 *
 * The `ConnectCustomKeyStore` operation might fail for various reasons. To find
 * the reason, use the DescribeCustomKeyStores operation and see the
 * `ConnectionErrorCode` in the response. For help interpreting the
 * `ConnectionErrorCode`, see CustomKeyStoresListEntry.
 *
 * To fix the failure, use the DisconnectCustomKeyStore operation to
 * disconnect the custom key store, correct the error, use the UpdateCustomKeyStore operation if necessary, and then use
 * `ConnectCustomKeyStore` again.
 *
 * **CloudHSM key store**
 *
 * During the connection process for an CloudHSM key store, KMS finds the CloudHSM cluster that
 * is associated with the custom key store, creates the connection infrastructure, connects to
 * the cluster, logs into the CloudHSM client as the `kmsuser` CU, and rotates its
 * password.
 *
 * To connect an CloudHSM key store, its associated CloudHSM cluster must have at least one active
 * HSM. To get the number of active HSMs in a cluster, use the DescribeClusters operation. To add HSMs
 * to the cluster, use the CreateHsm operation. Also, the
 * `kmsuser` crypto
 * user (CU) must not be logged into the cluster. This prevents KMS from using this
 * account to log in.
 *
 * If you are having trouble connecting or disconnecting a CloudHSM key store, see Troubleshooting an CloudHSM key
 * store in the *Key Management Service Developer Guide*.
 *
 * **External key store**
 *
 * When you connect an external key store that uses public endpoint connectivity, KMS tests
 * its ability to communicate with your external key manager by sending a request via the
 * external key store proxy.
 *
 * When you connect to an external key store that uses VPC endpoint service connectivity,
 * KMS establishes the networking elements that it needs to communicate with your external key
 * manager via the external key store proxy. This includes creating an interface endpoint to the
 * VPC endpoint service and a private hosted zone for traffic between KMS and the VPC endpoint
 * service.
 *
 * To connect an external key store, KMS must be able to connect to the external key store
 * proxy, the external key store proxy must be able to communicate with your external key
 * manager, and the external key manager must be available for cryptographic operations.
 *
 * If you are having trouble connecting or disconnecting an external key store, see Troubleshooting an external
 * key store in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: No. You cannot perform this operation on a custom key store in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:ConnectCustomKeyStore (IAM policy)
 *
 * **Related operations**
 *
 * - CreateCustomKeyStore
 *
 * - DeleteCustomKeyStore
 *
 * - DescribeCustomKeyStores
 *
 * - DisconnectCustomKeyStore
 *
 * - UpdateCustomKeyStore
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const connectCustomKeyStore: (
  input: ConnectCustomKeyStoreRequest,
) => Effect.Effect<
  ConnectCustomKeyStoreResponse,
  | CloudHsmClusterInvalidConfigurationException
  | CloudHsmClusterNotActiveException
  | CustomKeyStoreInvalidStateException
  | CustomKeyStoreNotFoundException
  | KMSInternalException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConnectCustomKeyStoreRequest,
  output: ConnectCustomKeyStoreResponse,
  errors: [
    CloudHsmClusterInvalidConfigurationException,
    CloudHsmClusterNotActiveException,
    CustomKeyStoreInvalidStateException,
    CustomKeyStoreNotFoundException,
    KMSInternalException,
  ],
}));
/**
 * Gets a list of all KMS keys in the caller's Amazon Web Services account and Region.
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:ListKeys (IAM policy)
 *
 * **Related operations:**
 *
 * - CreateKey
 *
 * - DescribeKey
 *
 * - ListAliases
 *
 * - ListResourceTags
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const listKeys: {
  (
    input: ListKeysRequest,
  ): Effect.Effect<
    ListKeysResponse,
    | DependencyTimeoutException
    | InvalidMarkerException
    | KMSInternalException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListKeysRequest,
  ) => Stream.Stream<
    ListKeysResponse,
    | DependencyTimeoutException
    | InvalidMarkerException
    | KMSInternalException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListKeysRequest,
  ) => Stream.Stream<
    KeyListEntry,
    | DependencyTimeoutException
    | InvalidMarkerException
    | KMSInternalException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListKeysRequest,
  output: ListKeysResponse,
  errors: [
    DependencyTimeoutException,
    InvalidMarkerException,
    KMSInternalException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "Keys",
    pageSize: "Limit",
  } as const,
}));
/**
 * Gets information about custom key stores in the account and Region.
 *
 * This operation is part of the custom key stores feature in KMS, which
 * combines the convenience and extensive integration of KMS with the isolation and control of a
 * key store that you own and manage.
 *
 * By default, this operation returns information about all custom key stores in the account
 * and Region. To get only information about a particular custom key store, use either the
 * `CustomKeyStoreName` or `CustomKeyStoreId` parameter (but not
 * both).
 *
 * To determine whether the custom key store is connected to its CloudHSM cluster or external
 * key store proxy, use the `ConnectionState` element in the response. If an attempt
 * to connect the custom key store failed, the `ConnectionState` value is
 * `FAILED` and the `ConnectionErrorCode` element in the response
 * indicates the cause of the failure. For help interpreting the
 * `ConnectionErrorCode`, see CustomKeyStoresListEntry.
 *
 * Custom key stores have a `DISCONNECTED` connection state if the key store has
 * never been connected or you used the DisconnectCustomKeyStore operation to
 * disconnect it. Otherwise, the connection state is CONNECTED. If your custom key store
 * connection state is `CONNECTED` but you are having trouble using it, verify that
 * the backing store is active and available. For an CloudHSM key store, verify that the associated
 * CloudHSM cluster is active and contains the minimum number of HSMs required for the operation, if
 * any. For an external key store, verify that the external key store proxy and its associated
 * external key manager are reachable and enabled.
 *
 * For help repairing your CloudHSM key store, see the Troubleshooting CloudHSM key stores. For help
 * repairing your external key store, see the Troubleshooting external key stores.
 * Both topics are in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: No. You cannot perform this operation on a custom key store in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:DescribeCustomKeyStores (IAM policy)
 *
 * **Related operations:**
 *
 * - ConnectCustomKeyStore
 *
 * - CreateCustomKeyStore
 *
 * - DeleteCustomKeyStore
 *
 * - DisconnectCustomKeyStore
 *
 * - UpdateCustomKeyStore
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const describeCustomKeyStores: {
  (
    input: DescribeCustomKeyStoresRequest,
  ): Effect.Effect<
    DescribeCustomKeyStoresResponse,
    | CustomKeyStoreNotFoundException
    | InvalidMarkerException
    | KMSInternalException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeCustomKeyStoresRequest,
  ) => Stream.Stream<
    DescribeCustomKeyStoresResponse,
    | CustomKeyStoreNotFoundException
    | InvalidMarkerException
    | KMSInternalException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeCustomKeyStoresRequest,
  ) => Stream.Stream<
    CustomKeyStoresListEntry,
    | CustomKeyStoreNotFoundException
    | InvalidMarkerException
    | KMSInternalException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeCustomKeyStoresRequest,
  output: DescribeCustomKeyStoresResponse,
  errors: [
    CustomKeyStoreNotFoundException,
    InvalidMarkerException,
    KMSInternalException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "CustomKeyStores",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns information about all grants in the Amazon Web Services account and Region that have the
 * specified retiring principal.
 *
 * You can specify any principal in your Amazon Web Services account. The grants that are returned include
 * grants for KMS keys in your Amazon Web Services account and other Amazon Web Services accounts. You might use this
 * operation to determine which grants you may retire. To retire a grant, use the RetireGrant operation.
 *
 * For detailed information about grants, including grant terminology, see Grants in KMS in the
 *
 * *Key Management Service Developer Guide*
 * . For examples of creating grants in several
 * programming languages, see Use CreateGrant with an Amazon Web Services SDK or CLI.
 *
 * **Cross-account use**: You must specify a principal in your
 * Amazon Web Services account. This operation returns a list of grants where the retiring principal specified
 * in the `ListRetirableGrants` request is the same retiring principal on the grant.
 * This can include grants on KMS keys owned by other Amazon Web Services accounts, but you do not need
 * `kms:ListRetirableGrants` permission (or any other additional permission) in any
 * Amazon Web Services account other than your own.
 *
 * **Required permissions**: kms:ListRetirableGrants (IAM policy) in your
 * Amazon Web Services account.
 *
 * KMS authorizes `ListRetirableGrants` requests by evaluating the caller
 * account's kms:ListRetirableGrants permissions. The authorized resource in
 * `ListRetirableGrants` calls is the retiring principal specified in the request.
 * KMS does not evaluate the caller's permissions to verify their access to any KMS keys or
 * grants that might be returned by the `ListRetirableGrants` call.
 *
 * **Related operations:**
 *
 * - CreateGrant
 *
 * - ListGrants
 *
 * - RetireGrant
 *
 * - RevokeGrant
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const listRetirableGrants: {
  (
    input: ListRetirableGrantsRequest,
  ): Effect.Effect<
    ListGrantsResponse,
    | DependencyTimeoutException
    | InvalidArnException
    | InvalidMarkerException
    | KMSInternalException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRetirableGrantsRequest,
  ) => Stream.Stream<
    ListGrantsResponse,
    | DependencyTimeoutException
    | InvalidArnException
    | InvalidMarkerException
    | KMSInternalException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRetirableGrantsRequest,
  ) => Stream.Stream<
    GrantListEntry,
    | DependencyTimeoutException
    | InvalidArnException
    | InvalidMarkerException
    | KMSInternalException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRetirableGrantsRequest,
  output: ListGrantsResponse,
  errors: [
    DependencyTimeoutException,
    InvalidArnException,
    InvalidMarkerException,
    KMSInternalException,
    NotFoundException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "Grants",
    pageSize: "Limit",
  } as const,
}));
/**
 * Sets the state of a KMS key to disabled. This change temporarily prevents use of the KMS
 * key for cryptographic operations.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For more
 * information about how key state affects the use of a KMS key, see Key states of KMS keys in the
 *
 * *Key Management Service Developer Guide*
 * .
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:DisableKey (key policy)
 *
 * **Related operations**: EnableKey
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const disableKey: (
  input: DisableKeyRequest,
) => Effect.Effect<
  DisableKeyResponse,
  | DependencyTimeoutException
  | InvalidArnException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableKeyRequest,
  output: DisableKeyResponse,
  errors: [
    DependencyTimeoutException,
    InvalidArnException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
  ],
}));
/**
 * Updates the description of a KMS key. To see the description of a KMS key, use DescribeKey.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:UpdateKeyDescription (key policy)
 *
 * **Related operations**
 *
 * - CreateKey
 *
 * - DescribeKey
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const updateKeyDescription: (
  input: UpdateKeyDescriptionRequest,
) => Effect.Effect<
  UpdateKeyDescriptionResponse,
  | DependencyTimeoutException
  | InvalidArnException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKeyDescriptionRequest,
  output: UpdateKeyDescriptionResponse,
  errors: [
    DependencyTimeoutException,
    InvalidArnException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
  ],
}));
/**
 * Cancels the deletion of a KMS key. When this operation succeeds, the key state of the KMS
 * key is `Disabled`. To enable the KMS key, use EnableKey.
 *
 * For more information about scheduling and canceling deletion of a KMS key, see Deleting KMS keys in the
 * *Key Management Service Developer Guide*.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:CancelKeyDeletion (key policy)
 *
 * **Related operations**: ScheduleKeyDeletion
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const cancelKeyDeletion: (
  input: CancelKeyDeletionRequest,
) => Effect.Effect<
  CancelKeyDeletionResponse,
  | DependencyTimeoutException
  | InvalidArnException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelKeyDeletionRequest,
  output: CancelKeyDeletionResponse,
  errors: [
    DependencyTimeoutException,
    InvalidArnException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
  ],
}));
/**
 * Gets a key policy attached to the specified KMS key.
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:GetKeyPolicy (key policy)
 *
 * **Related operations**: PutKeyPolicy
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const getKeyPolicy: (
  input: GetKeyPolicyRequest,
) => Effect.Effect<
  GetKeyPolicyResponse,
  | DependencyTimeoutException
  | InvalidArnException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKeyPolicyRequest,
  output: GetKeyPolicyResponse,
  errors: [
    DependencyTimeoutException,
    InvalidArnException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
  ],
}));
/**
 * Gets the names of the key policies that are attached to a KMS key. This operation is
 * designed to get policy names that you can use in a GetKeyPolicy operation.
 * However, the only valid policy name is `default`.
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:ListKeyPolicies (key policy)
 *
 * **Related operations:**
 *
 * - GetKeyPolicy
 *
 * - PutKeyPolicy
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const listKeyPolicies: {
  (
    input: ListKeyPoliciesRequest,
  ): Effect.Effect<
    ListKeyPoliciesResponse,
    | DependencyTimeoutException
    | InvalidArnException
    | KMSInternalException
    | KMSInvalidStateException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListKeyPoliciesRequest,
  ) => Stream.Stream<
    ListKeyPoliciesResponse,
    | DependencyTimeoutException
    | InvalidArnException
    | KMSInternalException
    | KMSInvalidStateException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListKeyPoliciesRequest,
  ) => Stream.Stream<
    PolicyNameType,
    | DependencyTimeoutException
    | InvalidArnException
    | KMSInternalException
    | KMSInvalidStateException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListKeyPoliciesRequest,
  output: ListKeyPoliciesResponse,
  errors: [
    DependencyTimeoutException,
    InvalidArnException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "PolicyNames",
    pageSize: "Limit",
  } as const,
}));
/**
 * Schedules the deletion of a KMS key. By default, KMS applies a waiting period of 30
 * days, but you can specify a waiting period of 7-30 days. When this operation is successful,
 * the key state of the KMS key changes to `PendingDeletion` and the key can't be used
 * in any cryptographic operations. It remains in this state for the duration of the waiting
 * period. Before the waiting period ends, you can use CancelKeyDeletion to
 * cancel the deletion of the KMS key. After the waiting period ends, KMS deletes the KMS key,
 * its key material, and all KMS data associated with it, including all aliases that refer to
 * it.
 *
 * Deleting a KMS key is a destructive and potentially dangerous operation. When a KMS key
 * is deleted, all data that was encrypted under the KMS key is unrecoverable. (The only
 * exception is a multi-Region replica key, or an asymmetric or HMAC KMS key with
 * imported key material.) To prevent the use of a KMS key without deleting it, use
 * DisableKey.
 *
 * You can schedule the deletion of a multi-Region primary key and its replica keys at any
 * time. However, KMS will not delete a multi-Region primary key with existing replica keys. If
 * you schedule the deletion of a primary key with replicas, its key state changes to
 * `PendingReplicaDeletion` and it cannot be replicated or used in cryptographic
 * operations. This status can continue indefinitely. When the last of its replicas keys is
 * deleted (not just scheduled), the key state of the primary key changes to
 * `PendingDeletion` and its waiting period (`PendingWindowInDays`)
 * begins. For details, see Deleting multi-Region keys in
 * the *Key Management Service Developer Guide*.
 *
 * When KMS deletes a KMS key from an CloudHSM
 * key store, it makes a best effort to delete the associated key material from the
 * associated CloudHSM cluster. However, you might need to manually delete the orphaned key
 * material from the cluster and its backups. Deleting a KMS key from an external key
 * store has no effect on the associated external key. However, for both types of
 * custom key stores, deleting a KMS key is destructive and irreversible. You cannot decrypt
 * ciphertext encrypted under the KMS key by using only its associated external key or CloudHSM key.
 * Also, you cannot recreate a KMS key in an external key store by creating a new KMS key with
 * the same key material.
 *
 * For more information about scheduling a KMS key for deletion, see Deleting KMS keys in the
 * *Key Management Service Developer Guide*.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:ScheduleKeyDeletion (key
 * policy)
 *
 * **Related operations**
 *
 * - CancelKeyDeletion
 *
 * - DisableKey
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const scheduleKeyDeletion: (
  input: ScheduleKeyDeletionRequest,
) => Effect.Effect<
  ScheduleKeyDeletionResponse,
  | DependencyTimeoutException
  | InvalidArnException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScheduleKeyDeletionRequest,
  output: ScheduleKeyDeletionResponse,
  errors: [
    DependencyTimeoutException,
    InvalidArnException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
  ],
}));
/**
 * Returns a random byte string that is cryptographically secure.
 *
 * You must use the `NumberOfBytes` parameter to specify the length of the random
 * byte string. There is no default value for string length.
 *
 * By default, the random byte string is generated in KMS. To generate the byte string in
 * the CloudHSM cluster associated with an CloudHSM key store, use the `CustomKeyStoreId`
 * parameter.
 *
 * `GenerateRandom` also supports Amazon Web Services Nitro Enclaves, which provide an
 * isolated compute environment in Amazon EC2. To call `GenerateRandom` for a Nitro enclave
 * or NitroTPM, use the Amazon Web Services Nitro Enclaves SDK or any Amazon Web Services SDK. Use the `Recipient`
 * parameter to provide the attestation document for the attested environment. Instead of
 * plaintext bytes, the response includes the plaintext bytes encrypted under the public key from
 * the attestation document (`CiphertextForRecipient`). For information about the interaction between KMS and Amazon Web Services Nitro Enclaves or Amazon Web Services NitroTPM, see Cryptographic attestation support in KMS in the *Key Management Service Developer Guide*.
 *
 * For more information about entropy and random number generation, see Entropy and random number generation in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: Not applicable.
 * `GenerateRandom` does not use any account-specific resources, such as KMS
 * keys.
 *
 * **Required permissions**: kms:GenerateRandom (IAM policy)
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const generateRandom: (
  input: GenerateRandomRequest,
) => Effect.Effect<
  GenerateRandomResponse,
  | CustomKeyStoreInvalidStateException
  | CustomKeyStoreNotFoundException
  | DependencyTimeoutException
  | KMSInternalException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateRandomRequest,
  output: GenerateRandomResponse,
  errors: [
    CustomKeyStoreInvalidStateException,
    CustomKeyStoreNotFoundException,
    DependencyTimeoutException,
    KMSInternalException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes a grant. Typically, you retire a grant when you no longer need its permissions. To
 * identify the grant to retire, use a grant token, or both the grant ID and a
 * key identifier (key ID or key ARN) of the KMS key. The CreateGrant operation
 * returns both values.
 *
 * This operation can be called by the *retiring principal* for a grant,
 * by the *grantee principal* if the grant allows the `RetireGrant`
 * operation, and by the Amazon Web Services account in which the grant is created. It can also be called by
 * principals to whom permission for retiring a grant is delegated.
 *
 * For detailed information about grants, including grant terminology, see Grants in KMS in the
 *
 * *Key Management Service Developer Guide*
 * . For examples of creating grants in several
 * programming languages, see Use CreateGrant with an Amazon Web Services SDK or CLI.
 *
 * **Cross-account use**: Yes. You can retire a grant on a KMS
 * key in a different Amazon Web Services account.
 *
 * **Required permissions**: Permission to retire a grant is
 * determined primarily by the grant. For details, see Retiring and revoking grants in the
 * *Key Management Service Developer Guide*.
 *
 * **Related operations:**
 *
 * - CreateGrant
 *
 * - ListGrants
 *
 * - ListRetirableGrants
 *
 * - RevokeGrant
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const retireGrant: (
  input: RetireGrantRequest,
) => Effect.Effect<
  RetireGrantResponse,
  | DependencyTimeoutException
  | DryRunOperationException
  | InvalidArnException
  | InvalidGrantIdException
  | InvalidGrantTokenException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RetireGrantRequest,
  output: RetireGrantResponse,
  errors: [
    DependencyTimeoutException,
    DryRunOperationException,
    InvalidArnException,
    InvalidGrantIdException,
    InvalidGrantTokenException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
  ],
}));
/**
 * Deletes the specified grant. You revoke a grant to terminate the permissions that the
 * grant allows. For more information, see Retiring and revoking grants in the
 *
 * *Key Management Service Developer Guide*
 * .
 *
 * When you create, retire, or revoke a grant, there might be a brief delay, usually less than five minutes, until the grant is available throughout KMS. This state is known as *eventual consistency*. For details, see Eventual consistency in
 * the
 * *Key Management Service Developer Guide*
 * .
 *
 * For detailed information about grants, including grant terminology, see Grants in KMS in the
 *
 * *Key Management Service Developer Guide*
 * . For examples of creating grants in several
 * programming languages, see Use CreateGrant with an Amazon Web Services SDK or CLI.
 *
 * **Cross-account use**: Yes. To perform this operation on a KMS key in a different Amazon Web Services account, specify the key
 * ARN in the value of the `KeyId` parameter.
 *
 * **Required permissions**: kms:RevokeGrant (key policy).
 *
 * **Related operations:**
 *
 * - CreateGrant
 *
 * - ListGrants
 *
 * - ListRetirableGrants
 *
 * - RetireGrant
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const revokeGrant: (
  input: RevokeGrantRequest,
) => Effect.Effect<
  RevokeGrantResponse,
  | DependencyTimeoutException
  | DryRunOperationException
  | InvalidArnException
  | InvalidGrantIdException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RevokeGrantRequest,
  output: RevokeGrantResponse,
  errors: [
    DependencyTimeoutException,
    DryRunOperationException,
    InvalidArnException,
    InvalidGrantIdException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
  ],
}));
/**
 * Returns all tags on the specified KMS key.
 *
 * For general information about tags, including the format and syntax, see Tagging Amazon Web Services resources in
 * the *Amazon Web Services General Reference*. For information about using
 * tags in KMS, see Tags in
 * KMS.
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:ListResourceTags (key policy)
 *
 * **Related operations:**
 *
 * - CreateKey
 *
 * - ReplicateKey
 *
 * - TagResource
 *
 * - UntagResource
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const listResourceTags: {
  (
    input: ListResourceTagsRequest,
  ): Effect.Effect<
    ListResourceTagsResponse,
    | InvalidArnException
    | InvalidMarkerException
    | KMSInternalException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceTagsRequest,
  ) => Stream.Stream<
    ListResourceTagsResponse,
    | InvalidArnException
    | InvalidMarkerException
    | KMSInternalException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceTagsRequest,
  ) => Stream.Stream<
    Tag,
    | InvalidArnException
    | InvalidMarkerException
    | KMSInternalException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceTagsRequest,
  output: ListResourceTagsResponse,
  errors: [
    InvalidArnException,
    InvalidMarkerException,
    KMSInternalException,
    NotFoundException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "Tags",
    pageSize: "Limit",
  } as const,
}));
/**
 * Gets a list of aliases in the caller's Amazon Web Services account and region. For more information
 * about aliases, see CreateAlias.
 *
 * By default, the `ListAliases` operation returns all aliases in the account and
 * region. To get only the aliases associated with a particular KMS key, use the
 * `KeyId` parameter.
 *
 * The `ListAliases` response can include aliases that you created and associated
 * with your customer managed keys, and aliases that Amazon Web Services created and associated with Amazon Web Services
 * managed keys in your account. You can recognize Amazon Web Services aliases because their names have the
 * format `aws/`, such as `aws/dynamodb`.
 *
 * The response might also include aliases that have no `TargetKeyId` field. These
 * are predefined aliases that Amazon Web Services has created but has not yet associated with a KMS key.
 * Aliases that Amazon Web Services creates in your account, including predefined aliases, do not count against
 * your KMS
 * aliases quota.
 *
 * **Cross-account use**: No. `ListAliases` does not
 * return aliases in other Amazon Web Services accounts.
 *
 * **Required permissions**: kms:ListAliases (IAM policy)
 *
 * For details, see Controlling access to aliases in the *Key Management Service Developer Guide*.
 *
 * **Related operations:**
 *
 * - CreateAlias
 *
 * - DeleteAlias
 *
 * - UpdateAlias
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const listAliases: {
  (
    input: ListAliasesRequest,
  ): Effect.Effect<
    ListAliasesResponse,
    | DependencyTimeoutException
    | InvalidArnException
    | InvalidMarkerException
    | KMSInternalException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAliasesRequest,
  ) => Stream.Stream<
    ListAliasesResponse,
    | DependencyTimeoutException
    | InvalidArnException
    | InvalidMarkerException
    | KMSInternalException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAliasesRequest,
  ) => Stream.Stream<
    AliasListEntry,
    | DependencyTimeoutException
    | InvalidArnException
    | InvalidMarkerException
    | KMSInternalException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAliasesRequest,
  output: ListAliasesResponse,
  errors: [
    DependencyTimeoutException,
    InvalidArnException,
    InvalidMarkerException,
    KMSInternalException,
    NotFoundException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "Aliases",
    pageSize: "Limit",
  } as const,
}));
/**
 * Deletes the specified alias.
 *
 * Adding, deleting, or updating an alias can allow or deny permission to the KMS key. For details, see ABAC for KMS in the *Key Management Service Developer Guide*.
 *
 * Because an alias is not a property of a KMS key, you can delete and change the aliases of
 * a KMS key without affecting the KMS key. Also, aliases do not appear in the response from the
 * DescribeKey operation. To get the aliases of all KMS keys, use the ListAliases operation.
 *
 * Each KMS key can have multiple aliases. To change the alias of a KMS key, use DeleteAlias to delete the current alias and CreateAlias to
 * create a new alias. To associate an existing alias with a different KMS key, call UpdateAlias.
 *
 * **Cross-account use**: No. You cannot perform this operation on an alias in a different Amazon Web Services account.
 *
 * **Required permissions**
 *
 * - kms:DeleteAlias on
 * the alias (IAM policy).
 *
 * - kms:DeleteAlias on
 * the KMS key (key policy).
 *
 * For details, see Controlling access to aliases in the
 * *Key Management Service Developer Guide*.
 *
 * **Related operations:**
 *
 * - CreateAlias
 *
 * - ListAliases
 *
 * - UpdateAlias
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const deleteAlias: (
  input: DeleteAliasRequest,
) => Effect.Effect<
  DeleteAliasResponse,
  | DependencyTimeoutException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAliasRequest,
  output: DeleteAliasResponse,
  errors: [
    DependencyTimeoutException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
  ],
}));
/**
 * Gets a list of all grants for the specified KMS key.
 *
 * You must specify the KMS key in all requests. You can filter the grant list by grant ID or
 * grantee principal.
 *
 * For detailed information about grants, including grant terminology, see Grants in KMS in the
 *
 * *Key Management Service Developer Guide*
 * . For examples of creating grants in several
 * programming languages, see Use CreateGrant with an Amazon Web Services SDK or CLI.
 *
 * The `GranteePrincipal` field in the `ListGrants` response usually contains the
 * user or role designated as the grantee principal in the grant. However, when the grantee
 * principal in the grant is an Amazon Web Services service, the `GranteePrincipal` field contains
 * the service
 * principal, which might represent several different grantee principals.
 *
 * **Cross-account use**: Yes. To perform this operation on a KMS key in a different Amazon Web Services account, specify the key
 * ARN in the value of the `KeyId` parameter.
 *
 * **Required permissions**: kms:ListGrants (key policy)
 *
 * **Related operations:**
 *
 * - CreateGrant
 *
 * - ListRetirableGrants
 *
 * - RetireGrant
 *
 * - RevokeGrant
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const listGrants: {
  (
    input: ListGrantsRequest,
  ): Effect.Effect<
    ListGrantsResponse,
    | DependencyTimeoutException
    | InvalidArnException
    | InvalidGrantIdException
    | InvalidMarkerException
    | KMSInternalException
    | KMSInvalidStateException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGrantsRequest,
  ) => Stream.Stream<
    ListGrantsResponse,
    | DependencyTimeoutException
    | InvalidArnException
    | InvalidGrantIdException
    | InvalidMarkerException
    | KMSInternalException
    | KMSInvalidStateException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGrantsRequest,
  ) => Stream.Stream<
    GrantListEntry,
    | DependencyTimeoutException
    | InvalidArnException
    | InvalidGrantIdException
    | InvalidMarkerException
    | KMSInternalException
    | KMSInvalidStateException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGrantsRequest,
  output: ListGrantsResponse,
  errors: [
    DependencyTimeoutException,
    InvalidArnException,
    InvalidGrantIdException,
    InvalidMarkerException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "Grants",
    pageSize: "Limit",
  } as const,
}));
/**
 * Changes the primary key of a multi-Region key.
 *
 * This operation changes the replica key in the specified Region to a primary key and
 * changes the former primary key to a replica key. For example, suppose you have a primary key
 * in `us-east-1` and a replica key in `eu-west-2`. If you run
 * `UpdatePrimaryRegion` with a `PrimaryRegion` value of
 * `eu-west-2`, the primary key is now the key in `eu-west-2`, and the
 * key in `us-east-1` becomes a replica key. For details, see Change the primary key in a
 * set of multi-Region keys in the *Key Management Service Developer Guide*.
 *
 * This operation supports *multi-Region keys*, an KMS feature that lets you create multiple
 * interoperable KMS keys in different Amazon Web Services Regions. Because these KMS keys have the same key ID, key
 * material, and other metadata, you can use them interchangeably to encrypt data in one Amazon Web Services Region and decrypt
 * it in a different Amazon Web Services Region without re-encrypting the data or making a cross-Region call. For more information about multi-Region keys, see Multi-Region keys in KMS in the *Key Management Service Developer Guide*.
 *
 * The *primary key* of a multi-Region key is the source for properties
 * that are always shared by primary and replica keys, including the key material, key ID, key spec, key usage, key material
 * origin, and automatic
 * key rotation. It's the only key that can be replicated. You cannot delete the primary
 * key until all replica keys are deleted.
 *
 * The key ID and primary Region that you specify uniquely identify the replica key that will
 * become the primary key. The primary Region must already have a replica key. This operation
 * does not create a KMS key in the specified Region. To find the replica keys, use the DescribeKey operation on the primary key or any replica key. To create a replica
 * key, use the ReplicateKey operation.
 *
 * You can run this operation while using the affected multi-Region keys in cryptographic
 * operations. This operation should not delay, interrupt, or cause failures in cryptographic
 * operations.
 *
 * Even after this operation completes, the process of updating the primary Region might
 * still be in progress for a few more seconds. Operations such as `DescribeKey` might
 * display both the old and new primary keys as replicas. The old and new primary keys have a
 * transient key state of `Updating`. The original key state is restored when the
 * update is complete. While the key state is `Updating`, you can use the keys in
 * cryptographic operations, but you cannot replicate the new primary key or perform certain
 * management operations, such as enabling or disabling these keys. For details about the
 * `Updating` key state, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * This operation does not return any output. To verify that primary key is changed, use the
 * DescribeKey operation.
 *
 * **Cross-account use**: No. You cannot use this operation in a
 * different Amazon Web Services account.
 *
 * **Required permissions**:
 *
 * - `kms:UpdatePrimaryRegion` on the current primary key (in the primary key's
 * Region). Include this permission primary key's key policy.
 *
 * - `kms:UpdatePrimaryRegion` on the current replica key (in the replica key's
 * Region). Include this permission in the replica key's key policy.
 *
 * **Related operations**
 *
 * - CreateKey
 *
 * - ReplicateKey
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const updatePrimaryRegion: (
  input: UpdatePrimaryRegionRequest,
) => Effect.Effect<
  UpdatePrimaryRegionResponse,
  | DisabledException
  | InvalidArnException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePrimaryRegionRequest,
  output: UpdatePrimaryRegionResponse,
  errors: [
    DisabledException,
    InvalidArnException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Disables automatic rotation of the key material of the specified symmetric encryption KMS
 * key.
 *
 * Automatic key rotation is supported only on symmetric encryption KMS keys.
 * You cannot enable automatic rotation of asymmetric KMS keys, HMAC KMS keys, KMS keys with imported key material, or KMS keys in a custom key store. To enable or disable automatic rotation of a set of related multi-Region keys, set the property on the primary key.
 *
 * You can enable (EnableKeyRotation) and disable automatic rotation of the
 * key material in customer managed KMS keys. Key material rotation of Amazon Web Services managed KMS keys is not
 * configurable. KMS always rotates the key material for every year. Rotation of Amazon Web Services owned KMS
 * keys varies.
 *
 * In May 2022, KMS changed the rotation schedule for Amazon Web Services managed keys from every three
 * years to every year. For details, see EnableKeyRotation.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:DisableKeyRotation (key policy)
 *
 * **Related operations:**
 *
 * - EnableKeyRotation
 *
 * - GetKeyRotationStatus
 *
 * - ListKeyRotations
 *
 * - RotateKeyOnDemand
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const disableKeyRotation: (
  input: DisableKeyRotationRequest,
) => Effect.Effect<
  DisableKeyRotationResponse,
  | DependencyTimeoutException
  | DisabledException
  | InvalidArnException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableKeyRotationRequest,
  output: DisableKeyRotationResponse,
  errors: [
    DependencyTimeoutException,
    DisabledException,
    InvalidArnException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Enables automatic rotation of the key material of the specified symmetric encryption KMS
 * key.
 *
 * By default, when you enable automatic rotation of a customer managed KMS key, KMS
 * rotates the key material of the KMS key one year (approximately 365 days) from the enable date
 * and every year thereafter. You can use the optional `RotationPeriodInDays`
 * parameter to specify a custom rotation period when you enable key rotation, or you can use
 * `RotationPeriodInDays` to modify the rotation period of a key that you previously
 * enabled automatic key rotation on.
 *
 * You can monitor rotation of the key material for your KMS keys in CloudTrail and Amazon CloudWatch. To disable rotation of the key material in a customer managed KMS key, use
 * the DisableKeyRotation operation. You can use the GetKeyRotationStatus operation to identify any in progress rotations. You can
 * use the ListKeyRotations operation to view the details of completed
 * rotations.
 *
 * Automatic key rotation is supported only on symmetric encryption KMS keys. You cannot enable automatic rotation of asymmetric KMS keys, HMAC KMS keys, KMS keys with imported key material, or KMS keys in a custom key store. To enable or disable automatic rotation of a set of related multi-Region keys, set the property on the primary key.
 *
 * You cannot enable or disable automatic rotation of Amazon Web Services managed KMS keys. KMS
 * always rotates the key material of Amazon Web Services managed keys every year. Rotation of Amazon Web Services owned KMS
 * keys is managed by the Amazon Web Services service that owns the key.
 *
 * In May 2022, KMS changed the rotation schedule for Amazon Web Services managed keys from every three
 * years (approximately 1,095 days) to every year (approximately 365 days).
 *
 * New Amazon Web Services managed keys are automatically rotated one year after they are created, and
 * approximately every year thereafter.
 *
 * Existing Amazon Web Services managed keys are automatically rotated one year after their most recent
 * rotation, and every year thereafter.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:EnableKeyRotation (key policy)
 *
 * **Related operations:**
 *
 * - DisableKeyRotation
 *
 * - GetKeyRotationStatus
 *
 * - ListKeyRotations
 *
 * - RotateKeyOnDemand
 *
 * You can perform on-demand (RotateKeyOnDemand) rotation of the key
 * material in customer managed KMS keys, regardless of whether or not automatic key
 * rotation is enabled.
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const enableKeyRotation: (
  input: EnableKeyRotationRequest,
) => Effect.Effect<
  EnableKeyRotationResponse,
  | DependencyTimeoutException
  | DisabledException
  | InvalidArnException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableKeyRotationRequest,
  output: EnableKeyRotationResponse,
  errors: [
    DependencyTimeoutException,
    DisabledException,
    InvalidArnException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes key material that was previously imported. This operation makes the specified KMS
 * key temporarily unusable. To restore the usability of the KMS key, reimport the same key
 * material. For more information about importing key material into KMS, see Importing Key Material
 * in the *Key Management Service Developer Guide*.
 *
 * When the specified KMS key is in the `PendingDeletion` state, this operation
 * does not change the KMS key's state. Otherwise, it changes the KMS key's state to
 * `PendingImport`.
 *
 * **Considerations for multi-Region symmetric encryption keys**
 *
 * - When you delete the key material of a primary Region key that is in
 * `PENDING_ROTATION` or `PENDING_MULTI_REGION_IMPORT_AND_ROTATION`state,
 * you'll also be deleting the key materials for the replica Region keys.
 *
 * - If you delete any key material of a replica Region key, the primary Region key and
 * other replica Region keys remain unchanged.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:DeleteImportedKeyMaterial (key policy)
 *
 * **Related operations:**
 *
 * - GetParametersForImport
 *
 * - ListKeyRotations
 *
 * - ImportKeyMaterial
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const deleteImportedKeyMaterial: (
  input: DeleteImportedKeyMaterialRequest,
) => Effect.Effect<
  DeleteImportedKeyMaterialResponse,
  | DependencyTimeoutException
  | InvalidArnException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteImportedKeyMaterialRequest,
  output: DeleteImportedKeyMaterialResponse,
  errors: [
    DependencyTimeoutException,
    InvalidArnException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Provides detailed information about the rotation status for a KMS key, including whether
 * automatic
 * rotation of the key material is enabled for the specified KMS key, the rotation
 * period, and the next scheduled rotation date.
 *
 * Automatic key rotation is supported only on symmetric encryption KMS keys.
 * You cannot enable automatic rotation of asymmetric KMS keys, HMAC KMS keys, KMS keys with imported key material, or KMS keys in a custom key store. To enable or disable automatic rotation of a set of related multi-Region keys, set the property on the primary key.
 *
 * You can enable (EnableKeyRotation) and disable automatic rotation (DisableKeyRotation) of the key material in customer managed KMS keys. Key
 * material rotation of Amazon Web Services managed KMS keys is not
 * configurable. KMS always rotates the key material in Amazon Web Services managed KMS keys every year. The
 * key rotation status for Amazon Web Services managed KMS keys is always `true`.
 *
 * You can perform on-demand (RotateKeyOnDemand) rotation of the key
 * material in customer managed KMS keys, regardless of whether or not automatic key rotation is
 * enabled. You can use GetKeyRotationStatus to identify the date and time that an in progress
 * on-demand rotation was initiated. You can use ListKeyRotations to view the
 * details of completed rotations.
 *
 * In May 2022, KMS changed the rotation schedule for Amazon Web Services managed keys from every three
 * years to every year. For details, see EnableKeyRotation.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * - Disabled: The key rotation status does not change when you disable a KMS key. However,
 * while the KMS key is disabled, KMS does not rotate the key material. When you re-enable
 * the KMS key, rotation resumes. If the key material in the re-enabled KMS key hasn't been
 * rotated in one year, KMS rotates it immediately, and every year thereafter. If it's been
 * less than a year since the key material in the re-enabled KMS key was rotated, the KMS key
 * resumes its prior rotation schedule.
 *
 * - Pending deletion: While a KMS key is pending deletion, its key rotation status is
 * `false` and KMS does not rotate the key material. If you cancel the
 * deletion, the original key rotation status returns to `true`.
 *
 * **Cross-account use**: Yes. To perform this operation on a KMS key in a different Amazon Web Services account, specify the key
 * ARN in the value of the `KeyId` parameter.
 *
 * **Required permissions**: kms:GetKeyRotationStatus (key policy)
 *
 * **Related operations:**
 *
 * - DisableKeyRotation
 *
 * - EnableKeyRotation
 *
 * - ListKeyRotations
 *
 * - RotateKeyOnDemand
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const getKeyRotationStatus: (
  input: GetKeyRotationStatusRequest,
) => Effect.Effect<
  GetKeyRotationStatusResponse,
  | DependencyTimeoutException
  | InvalidArnException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKeyRotationStatusRequest,
  output: GetKeyRotationStatusResponse,
  errors: [
    DependencyTimeoutException,
    InvalidArnException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns the public key and an import token you need to import or reimport key material for
 * a KMS key.
 *
 * By default, KMS keys are created with key material that KMS generates. This operation
 * supports Importing key
 * material, an advanced feature that lets you generate and import the cryptographic
 * key material for a KMS key.
 *
 * Before calling `GetParametersForImport`, use the CreateKey
 * operation with an `Origin` value of `EXTERNAL` to create a KMS key with
 * no key material. You can import key material for a symmetric encryption KMS key, HMAC KMS key,
 * asymmetric encryption KMS key, or asymmetric signing KMS key. You can also import key material
 * into a multi-Region key of any supported type. However, you can't import key material into
 * a KMS key in a custom
 * key store. You can also use `GetParametersForImport` to get a public key
 * and import token to reimport
 * the original key material into a KMS key whose key material expired or was
 * deleted.
 *
 * `GetParametersForImport` returns the items that you need to import your key
 * material.
 *
 * - The public key (or "wrapping key") of an RSA key pair that KMS generates.
 *
 * You will use this public key to encrypt ("wrap") your key material while it's in
 * transit to KMS.
 *
 * - A import token that ensures that KMS can decrypt your key material and associate it
 * with the correct KMS key.
 *
 * The public key and its import token are permanently linked and must be used together. Each
 * public key and import token set is valid for 24 hours. The expiration date and time appear in
 * the `ParametersValidTo` field in the `GetParametersForImport` response.
 * You cannot use an expired public key or import token in an ImportKeyMaterial
 * request. If your key and token expire, send another `GetParametersForImport`
 * request.
 *
 * `GetParametersForImport` requires the following information:
 *
 * - The key ID of the KMS key for which you are importing the key material.
 *
 * - The key spec of the public key ("wrapping key") that you will use to encrypt your key
 * material during import.
 *
 * - The wrapping algorithm that you will use with the public key to encrypt your key
 * material.
 *
 * You can use the same or a different public key spec and wrapping algorithm each time you
 * import or reimport the same key material.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:GetParametersForImport (key policy)
 *
 * **Related operations:**
 *
 * - ImportKeyMaterial
 *
 * - DeleteImportedKeyMaterial
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const getParametersForImport: (
  input: GetParametersForImportRequest,
) => Effect.Effect<
  GetParametersForImportResponse,
  | DependencyTimeoutException
  | InvalidArnException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetParametersForImportRequest,
  output: GetParametersForImportResponse,
  errors: [
    DependencyTimeoutException,
    InvalidArnException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns information about the key materials associated with the specified KMS key. You can
 * use the optional `IncludeKeyMaterial` parameter to control which key materials are
 * included in the response.
 *
 * You must specify the KMS key in all requests. You can refine the key rotations list by
 * limiting the number of rotations returned.
 *
 * For detailed information about automatic and on-demand key rotations, see Rotate KMS keys in the
 * *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:ListKeyRotations (key policy)
 *
 * **Related operations:**
 *
 * - EnableKeyRotation
 *
 * - DeleteImportedKeyMaterial
 *
 * - DisableKeyRotation
 *
 * - GetKeyRotationStatus
 *
 * - ImportKeyMaterial
 *
 * - RotateKeyOnDemand
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const listKeyRotations: {
  (
    input: ListKeyRotationsRequest,
  ): Effect.Effect<
    ListKeyRotationsResponse,
    | InvalidArnException
    | InvalidMarkerException
    | KMSInternalException
    | KMSInvalidStateException
    | NotFoundException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListKeyRotationsRequest,
  ) => Stream.Stream<
    ListKeyRotationsResponse,
    | InvalidArnException
    | InvalidMarkerException
    | KMSInternalException
    | KMSInvalidStateException
    | NotFoundException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListKeyRotationsRequest,
  ) => Stream.Stream<
    RotationsListEntry,
    | InvalidArnException
    | InvalidMarkerException
    | KMSInternalException
    | KMSInvalidStateException
    | NotFoundException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListKeyRotationsRequest,
  output: ListKeyRotationsResponse,
  errors: [
    InvalidArnException,
    InvalidMarkerException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "Rotations",
    pageSize: "Limit",
  } as const,
}));
/**
 * Immediately initiates rotation of the key material of the specified symmetric encryption
 * KMS key.
 *
 * You can perform on-demand rotation of the key
 * material in customer managed KMS keys, regardless of whether or not automatic key
 * rotation is enabled. On-demand rotations do not change existing automatic rotation
 * schedules. For example, consider a KMS key that has automatic key rotation enabled with a
 * rotation period of 730 days. If the key is scheduled to automatically rotate on April 14,
 * 2024, and you perform an on-demand rotation on April 10, 2024, the key will automatically
 * rotate, as scheduled, on April 14, 2024 and every 730 days thereafter.
 *
 * You can perform on-demand key rotation a maximum of 10
 * times per KMS key. You can use the KMS console to view the number of
 * remaining on-demand rotations available for a KMS key.
 *
 * You can use GetKeyRotationStatus to identify any in progress on-demand
 * rotations. You can use ListKeyRotations to identify the date that completed
 * on-demand rotations were performed. You can monitor rotation of the key material for your KMS
 * keys in CloudTrail and Amazon CloudWatch.
 *
 * On-demand key rotation is supported only on symmetric encryption KMS keys. You cannot
 * perform on-demand rotation of asymmetric KMS keys, HMAC KMS keys, or KMS keys in a
 * custom key store. When you initiate on-demand key rotation on a symmetric encryption KMS key
 * with imported key material, you must have already imported new key material and that
 * key material's state should be `PENDING_ROTATION`. Use the
 * `ListKeyRotations` operation to check the state of all key materials associated
 * with a KMS key. To perform on-demand rotation of a set of related multi-Region keys, import
 * new key material in the primary Region key, import the same key material in each replica
 * Region key, and invoke the on-demand rotation on the primary Region key.
 *
 * You cannot initiate on-demand rotation of Amazon Web Services managed KMS keys. KMS
 * always rotates the key material of Amazon Web Services managed keys every year. Rotation of Amazon Web Services owned KMS
 * keys is managed by the Amazon Web Services service that owns the key.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:RotateKeyOnDemand (key policy)
 *
 * **Related operations:**
 *
 * - EnableKeyRotation
 *
 * - DisableKeyRotation
 *
 * - GetKeyRotationStatus
 *
 * - ImportKeyMaterial
 *
 * - ListKeyRotations
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const rotateKeyOnDemand: (
  input: RotateKeyOnDemandRequest,
) => Effect.Effect<
  RotateKeyOnDemandResponse,
  | ConflictException
  | DependencyTimeoutException
  | DisabledException
  | InvalidArnException
  | KMSInternalException
  | KMSInvalidStateException
  | LimitExceededException
  | NotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RotateKeyOnDemandRequest,
  output: RotateKeyOnDemandResponse,
  errors: [
    ConflictException,
    DependencyTimeoutException,
    DisabledException,
    InvalidArnException,
    KMSInternalException,
    KMSInvalidStateException,
    LimitExceededException,
    NotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates a friendly name for a KMS key.
 *
 * Adding, deleting, or updating an alias can allow or deny permission to the KMS key. For details, see ABAC for KMS in the *Key Management Service Developer Guide*.
 *
 * You can use an alias to identify a KMS key in the KMS console, in the DescribeKey operation and in cryptographic operations, such as Encrypt and
 * GenerateDataKey. You can also change the KMS key that's associated with
 * the alias (UpdateAlias) or delete the alias (DeleteAlias)
 * at any time. These operations don't affect the underlying KMS key.
 *
 * You can associate the alias with any customer managed key in the same Amazon Web Services Region. Each
 * alias is associated with only one KMS key at a time, but a KMS key can have multiple aliases.
 * A valid KMS key is required. You can't create an alias without a KMS key.
 *
 * The alias must be unique in the account and Region, but you can have aliases with the same
 * name in different Regions. For detailed information about aliases, see Aliases in KMS in the
 * *Key Management Service Developer Guide*.
 *
 * This operation does not return a response. To get the alias that you created, use the
 * ListAliases operation.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: No. You cannot perform this operation on an alias in a different Amazon Web Services account.
 *
 * **Required permissions**
 *
 * - kms:CreateAlias on
 * the alias (IAM policy).
 *
 * - kms:CreateAlias on
 * the KMS key (key policy).
 *
 * For details, see Controlling access to aliases in the *Key Management Service Developer Guide*.
 *
 * **Related operations:**
 *
 * - DeleteAlias
 *
 * - ListAliases
 *
 * - UpdateAlias
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const createAlias: (
  input: CreateAliasRequest,
) => Effect.Effect<
  CreateAliasResponse,
  | AlreadyExistsException
  | DependencyTimeoutException
  | InvalidAliasNameException
  | KMSInternalException
  | KMSInvalidStateException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAliasRequest,
  output: CreateAliasResponse,
  errors: [
    AlreadyExistsException,
    DependencyTimeoutException,
    InvalidAliasNameException,
    KMSInternalException,
    KMSInvalidStateException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Sets the key state of a KMS key to enabled. This allows you to use the KMS key for
 * cryptographic operations.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:EnableKey (key policy)
 *
 * **Related operations**: DisableKey
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const enableKey: (
  input: EnableKeyRequest,
) => Effect.Effect<
  EnableKeyResponse,
  | DependencyTimeoutException
  | InvalidArnException
  | KMSInternalException
  | KMSInvalidStateException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableKeyRequest,
  output: EnableKeyResponse,
  errors: [
    DependencyTimeoutException,
    InvalidArnException,
    KMSInternalException,
    KMSInvalidStateException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Associates an existing KMS alias with a different KMS key. Each alias is associated with
 * only one KMS key at a time, although a KMS key can have multiple aliases. The alias and the
 * KMS key must be in the same Amazon Web Services account and Region.
 *
 * Adding, deleting, or updating an alias can allow or deny permission to the KMS key. For details, see ABAC for KMS in the *Key Management Service Developer Guide*.
 *
 * The current and new KMS key must be the same type (both symmetric or both asymmetric or
 * both HMAC), and they must have the same key usage. This restriction prevents errors in code
 * that uses aliases. If you must assign an alias to a different type of KMS key, use DeleteAlias to delete the old alias and CreateAlias to create
 * a new alias.
 *
 * You cannot use `UpdateAlias` to change an alias name. To change an alias name,
 * use DeleteAlias to delete the old alias and CreateAlias to
 * create a new alias.
 *
 * Because an alias is not a property of a KMS key, you can create, update, and delete the
 * aliases of a KMS key without affecting the KMS key. Also, aliases do not appear in the
 * response from the DescribeKey operation. To get the aliases of all KMS keys
 * in the account, use the ListAliases operation.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**
 *
 * - kms:UpdateAlias on
 * the alias (IAM policy).
 *
 * - kms:UpdateAlias on
 * the current KMS key (key policy).
 *
 * - kms:UpdateAlias on
 * the new KMS key (key policy).
 *
 * For details, see Controlling access to aliases in the
 * *Key Management Service Developer Guide*.
 *
 * **Related operations:**
 *
 * - CreateAlias
 *
 * - DeleteAlias
 *
 * - ListAliases
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const updateAlias: (
  input: UpdateAliasRequest,
) => Effect.Effect<
  UpdateAliasResponse,
  | DependencyTimeoutException
  | KMSInternalException
  | KMSInvalidStateException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAliasRequest,
  output: UpdateAliasResponse,
  errors: [
    DependencyTimeoutException,
    KMSInternalException,
    KMSInvalidStateException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Adds a grant to a KMS key.
 *
 * A *grant* is a policy instrument that allows Amazon Web Services principals to use
 * KMS keys in cryptographic operations. It also can allow them to view a KMS key (DescribeKey) and create and manage grants. When authorizing access to a KMS key,
 * grants are considered along with key policies and IAM policies. Grants are often used for
 * temporary permissions because you can create one, use its permissions, and delete it without
 * changing your key policies or IAM policies.
 *
 * For detailed information about grants, including grant terminology, see Grants in KMS in the
 *
 * *Key Management Service Developer Guide*
 * . For examples of creating grants in several
 * programming languages, see Use CreateGrant with an Amazon Web Services SDK or CLI.
 *
 * The `CreateGrant` operation returns a `GrantToken` and a
 * `GrantId`.
 *
 * - When you create, retire, or revoke a grant, there might be a brief delay, usually less than five minutes, until the grant is available throughout KMS. This state is known as *eventual consistency*. Once the grant has achieved eventual consistency, the grantee
 * principal can use the permissions in the grant without identifying the grant.
 *
 * However, to use the permissions in the grant immediately, use the
 * `GrantToken` that `CreateGrant` returns. For details, see Using a grant
 * token in the
 * *Key Management Service Developer Guide*
 * .
 *
 * - The `CreateGrant` operation also returns a `GrantId`. You can
 * use the `GrantId` and a key identifier to identify the grant in the RetireGrant and RevokeGrant operations. To find the grant
 * ID, use the ListGrants or ListRetirableGrants
 * operations.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: Yes. To perform this operation on a KMS key in a different Amazon Web Services account, specify the key
 * ARN in the value of the `KeyId` parameter.
 *
 * **Required permissions**: kms:CreateGrant (key policy)
 *
 * **Related operations:**
 *
 * - ListGrants
 *
 * - ListRetirableGrants
 *
 * - RetireGrant
 *
 * - RevokeGrant
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const createGrant: (
  input: CreateGrantRequest,
) => Effect.Effect<
  CreateGrantResponse,
  | DependencyTimeoutException
  | DisabledException
  | DryRunOperationException
  | InvalidArnException
  | InvalidGrantTokenException
  | KMSInternalException
  | KMSInvalidStateException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGrantRequest,
  output: CreateGrantResponse,
  errors: [
    DependencyTimeoutException,
    DisabledException,
    DryRunOperationException,
    InvalidArnException,
    InvalidGrantTokenException,
    KMSInternalException,
    KMSInvalidStateException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Provides detailed information about a KMS key. You can run `DescribeKey` on a
 * customer
 * managed key or an Amazon Web Services managed key.
 *
 * This detailed information includes the key ARN, creation date (and deletion date, if
 * applicable), the key state, and the origin and expiration date (if any) of the key material.
 * It includes fields, like `KeySpec`, that help you distinguish different types of
 * KMS keys. It also displays the key usage (encryption, signing, or generating and verifying
 * MACs) and the algorithms that the KMS key supports.
 *
 * For multi-Region keys, `DescribeKey` displays the primary key and all
 * related replica keys. For KMS keys in CloudHSM key stores, it includes information
 * about the key store, such as the key store ID and the CloudHSM cluster ID. For KMS keys in external key stores,
 * it includes the custom key store ID and the ID of the external key.
 *
 * `DescribeKey` does not return the following information:
 *
 * - Aliases associated with the KMS key. To get this information, use ListAliases.
 *
 * - Whether automatic key rotation is enabled on the KMS key. To get this information, use
 * GetKeyRotationStatus. Also, some key states prevent a KMS key from
 * being automatically rotated. For details, see How key rotation
 * works in the *Key Management Service Developer Guide*.
 *
 * - Tags on the KMS key. To get this information, use ListResourceTags.
 *
 * - Key policies and grants on the KMS key. To get this information, use GetKeyPolicy and ListGrants.
 *
 * In general, `DescribeKey` is a non-mutating operation. It returns data about
 * KMS keys, but doesn't change them. However, Amazon Web Services services use `DescribeKey` to
 * create Amazon Web Services
 * managed keys from a *predefined Amazon Web Services alias* with no key
 * ID.
 *
 * **Cross-account use**: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify
 * the key ARN or alias ARN in the value of the `KeyId` parameter.
 *
 * **Required permissions**: kms:DescribeKey (key policy)
 *
 * **Related operations:**
 *
 * - GetKeyPolicy
 *
 * - GetKeyRotationStatus
 *
 * - ListAliases
 *
 * - ListGrants
 *
 * - ListKeys
 *
 * - ListResourceTags
 *
 * - ListRetirableGrants
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const describeKey: (
  input: DescribeKeyRequest,
) => Effect.Effect<
  DescribeKeyResponse,
  | DependencyTimeoutException
  | InvalidArnException
  | KMSInternalException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeKeyRequest,
  output: DescribeKeyResponse,
  errors: [
    DependencyTimeoutException,
    InvalidArnException,
    KMSInternalException,
    NotFoundException,
  ],
}));
/**
 * Deletes tags from a customer managed key. To delete a
 * tag, specify the tag key and the KMS key.
 *
 * Tagging or untagging a KMS key can allow or deny permission to the KMS key. For details, see ABAC for KMS in the *Key Management Service Developer Guide*.
 *
 * When it succeeds, the `UntagResource` operation doesn't return any output.
 * Also, if the specified tag key isn't found on the KMS key, it doesn't throw an exception or
 * return a response. To confirm that the operation worked, use the ListResourceTags operation.
 *
 * For information about using tags in KMS, see Tagging keys. For general information about
 * tags, including the format and syntax, see Tagging Amazon Web Services resources in the Amazon
 * Web Services General Reference.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:UntagResource (key policy)
 *
 * **Related operations**
 *
 * - CreateKey
 *
 * - ListResourceTags
 *
 * - ReplicateKey
 *
 * - TagResource
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | InvalidArnException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | TagException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InvalidArnException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
    TagException,
  ],
}));
/**
 * Returns the public key of an asymmetric KMS key. Unlike the private key of a asymmetric
 * KMS key, which never leaves KMS unencrypted, callers with `kms:GetPublicKey`
 * permission can download the public key of an asymmetric KMS key. You can share the public key
 * to allow others to encrypt messages and verify signatures outside of KMS.
 * For information about asymmetric KMS keys, see Asymmetric KMS keys in the *Key Management Service Developer Guide*.
 *
 * You do not need to download the public key. Instead, you can use the public key within
 * KMS by calling the Encrypt, ReEncrypt, or Verify operations with the identifier of an asymmetric KMS key. When you use the
 * public key within KMS, you benefit from the authentication, authorization, and logging that
 * are part of every KMS operation. You also reduce of risk of encrypting data that cannot be
 * decrypted. These features are not effective outside of KMS.
 *
 * To help you use the public key safely outside of KMS, `GetPublicKey` returns
 * important information about the public key in the response, including:
 *
 * - KeySpec: The type of key material in the public key, such as
 * `RSA_4096` or `ECC_NIST_P521`.
 *
 * - KeyUsage: Whether the key is used for encryption, signing, or deriving a shared
 * secret.
 *
 * - EncryptionAlgorithms, KeyAgreementAlgorithms, or SigningAlgorithms: A list of the encryption algorithms, key agreement
 * algorithms, or signing algorithms for the key.
 *
 * Although KMS cannot enforce these restrictions on external operations, it is crucial
 * that you use this information to prevent the public key from being used improperly. For
 * example, you can prevent a public signing key from being used encrypt data, or prevent a
 * public key from being used with an encryption algorithm that is not supported by KMS. You
 * can also avoid errors, such as using the wrong signing algorithm in a verification
 * operation.
 *
 * To verify a signature outside of KMS with an SM2 public key (China Regions only), you
 * must specify the distinguishing ID. By default, KMS uses `1234567812345678` as
 * the distinguishing ID. For more information, see Offline
 * verification with SM2 key pairs.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify
 * the key ARN or alias ARN in the value of the `KeyId` parameter.
 *
 * **Required permissions**: kms:GetPublicKey (key policy)
 *
 * **Related operations**: CreateKey
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const getPublicKey: (
  input: GetPublicKeyRequest,
) => Effect.Effect<
  GetPublicKeyResponse,
  | DependencyTimeoutException
  | DisabledException
  | InvalidArnException
  | InvalidGrantTokenException
  | InvalidKeyUsageException
  | KeyUnavailableException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPublicKeyRequest,
  output: GetPublicKeyResponse,
  errors: [
    DependencyTimeoutException,
    DisabledException,
    InvalidArnException,
    InvalidGrantTokenException,
    InvalidKeyUsageException,
    KeyUnavailableException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Adds or edits tags on a customer managed key.
 *
 * Tagging or untagging a KMS key can allow or deny permission to the KMS key. For details, see ABAC for KMS in the *Key Management Service Developer Guide*.
 *
 * Each tag consists of a tag key and a tag value, both of which are case-sensitive strings.
 * The tag value can be an empty (null) string. To add a tag, specify a new tag key and a tag
 * value. To edit a tag, specify an existing tag key and a new tag value.
 *
 * You can use this operation to tag a customer managed key, but you
 * cannot tag an Amazon Web Services managed key, an Amazon Web Services owned key, a custom key store,
 * or an alias.
 *
 * You can also add tags to a KMS key while creating it (CreateKey) or
 * replicating it (ReplicateKey).
 *
 * For information about using tags in KMS, see Tagging keys. For general information about
 * tags, including the format and syntax, see Tagging Amazon Web Services resources in the Amazon
 * Web Services General Reference.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:TagResource (key policy)
 *
 * **Related operations**
 *
 * - CreateKey
 *
 * - ListResourceTags
 *
 * - ReplicateKey
 *
 * - UntagResource
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InvalidArnException
  | KMSInternalException
  | KMSInvalidStateException
  | LimitExceededException
  | NotFoundException
  | TagException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InvalidArnException,
    KMSInternalException,
    KMSInvalidStateException,
    LimitExceededException,
    NotFoundException,
    TagException,
  ],
}));
/**
 * Attaches a key policy to the specified KMS key.
 *
 * For more information about key policies, see Key Policies in the *Key Management Service Developer Guide*.
 * For help writing and formatting a JSON policy document, see the IAM JSON Policy Reference in the
 * *Identity and Access Management User Guide*
 * . For examples of adding a key policy in multiple programming languages,
 * see Use
 * PutKeyPolicy with an Amazon Web Services SDK or CLI in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:PutKeyPolicy (key policy)
 *
 * **Related operations**: GetKeyPolicy
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const putKeyPolicy: (
  input: PutKeyPolicyRequest,
) => Effect.Effect<
  PutKeyPolicyResponse,
  | DependencyTimeoutException
  | InvalidArnException
  | KMSInternalException
  | KMSInvalidStateException
  | LimitExceededException
  | MalformedPolicyDocumentException
  | NotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutKeyPolicyRequest,
  output: PutKeyPolicyResponse,
  errors: [
    DependencyTimeoutException,
    InvalidArnException,
    KMSInternalException,
    KMSInvalidStateException,
    LimitExceededException,
    MalformedPolicyDocumentException,
    NotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Replicates a multi-Region key into the specified Region. This operation creates a
 * multi-Region replica key based on a multi-Region primary key in a different Region of the same
 * Amazon Web Services partition. You can create multiple replicas of a primary key, but each must be in a
 * different Region. To create a multi-Region primary key, use the CreateKey
 * operation.
 *
 * This operation supports *multi-Region keys*, an KMS feature that lets you create multiple
 * interoperable KMS keys in different Amazon Web Services Regions. Because these KMS keys have the same key ID, key
 * material, and other metadata, you can use them interchangeably to encrypt data in one Amazon Web Services Region and decrypt
 * it in a different Amazon Web Services Region without re-encrypting the data or making a cross-Region call. For more information about multi-Region keys, see Multi-Region keys in KMS in the *Key Management Service Developer Guide*.
 *
 * A *replica key* is a fully-functional KMS key that can be used
 * independently of its primary and peer replica keys. A primary key and its replica keys share
 * properties that make them interoperable. They have the same key ID and key material. They also
 * have the same key spec, key usage, key material origin, and automatic key rotation status.
 * KMS automatically synchronizes these shared properties among related multi-Region keys. All
 * other properties of a replica key can differ, including its key policy, tags, aliases, and key state. KMS pricing and quotas for KMS keys
 * apply to each primary key and replica key.
 *
 * When this operation completes, the new replica key has a transient key state of
 * `Creating`. This key state changes to `Enabled` (or
 * `PendingImport`) after a few seconds when the process of creating the new replica
 * key is complete. While the key state is `Creating`, you can manage key, but you
 * cannot yet use it in cryptographic operations. If you are creating and using the replica key
 * programmatically, retry on `KMSInvalidStateException` or call
 * `DescribeKey` to check its `KeyState` value before using it. For
 * details about the `Creating` key state, see Key states of KMS keys in the
 * *Key Management Service Developer Guide*.
 *
 * You cannot create more than one replica of a primary key in any Region. If the Region
 * already includes a replica of the key you're trying to replicate, `ReplicateKey`
 * returns an `AlreadyExistsException` error. If the key state of the existing replica
 * is `PendingDeletion`, you can cancel the scheduled key deletion (CancelKeyDeletion) or wait for the key to be deleted. The new replica key you
 * create will have the same shared
 * properties as the original replica key.
 *
 * The CloudTrail log of a `ReplicateKey` operation records a
 * `ReplicateKey` operation in the primary key's Region and a CreateKey operation in the replica key's Region.
 *
 * If you replicate a multi-Region primary key with imported key material, the replica key is
 * created with no key material. You must import the same key material that you imported into the
 * primary key.
 *
 * To convert a replica key to a primary key, use the UpdatePrimaryRegion
 * operation.
 *
 * `ReplicateKey` uses different default values for the `KeyPolicy`
 * and `Tags` parameters than those used in the KMS console. For details, see the
 * parameter descriptions.
 *
 * **Cross-account use**: No. You cannot use this operation to
 * create a replica key in a different Amazon Web Services account.
 *
 * **Required permissions**:
 *
 * - `kms:ReplicateKey` on the primary key (in the primary key's Region).
 * Include this permission in the primary key's key policy.
 *
 * - `kms:CreateKey` in an IAM policy in the replica Region.
 *
 * - To use the `Tags` parameter, `kms:TagResource` in an IAM policy
 * in the replica Region.
 *
 * **Related operations**
 *
 * - CreateKey
 *
 * - UpdatePrimaryRegion
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const replicateKey: (
  input: ReplicateKeyRequest,
) => Effect.Effect<
  ReplicateKeyResponse,
  | AlreadyExistsException
  | DisabledException
  | InvalidArnException
  | KMSInternalException
  | KMSInvalidStateException
  | LimitExceededException
  | MalformedPolicyDocumentException
  | NotFoundException
  | TagException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReplicateKeyRequest,
  output: ReplicateKeyResponse,
  errors: [
    AlreadyExistsException,
    DisabledException,
    InvalidArnException,
    KMSInternalException,
    KMSInvalidStateException,
    LimitExceededException,
    MalformedPolicyDocumentException,
    NotFoundException,
    TagException,
    UnsupportedOperationException,
  ],
}));
/**
 * Derives a shared secret using a key agreement algorithm.
 *
 * You must use an asymmetric NIST-standard elliptic curve (ECC) or SM2 (China Regions
 * only) KMS key pair with a `KeyUsage` value of `KEY_AGREEMENT` to call
 * DeriveSharedSecret.
 *
 * DeriveSharedSecret uses the Elliptic Curve Cryptography Cofactor Diffie-Hellman Primitive (ECDH) to establish a
 * key agreement between two peers by deriving a shared secret from their elliptic curve
 * public-private key pairs. You can use the raw shared secret that DeriveSharedSecret returns to
 * derive a symmetric key that can encrypt and decrypt data that is sent between the two peers,
 * or that can generate and verify HMACs. KMS recommends that you follow NIST
 * recommendations for key derivation when using the raw shared secret to derive a
 * symmetric key.
 *
 * The following workflow demonstrates how to establish key agreement over an insecure
 * communication channel using DeriveSharedSecret.
 *
 * - **Alice** calls CreateKey to create an
 * asymmetric KMS key pair with a `KeyUsage` value of
 * `KEY_AGREEMENT`.
 *
 * The asymmetric KMS key must use a NIST-standard elliptic curve (ECC) or SM2 (China
 * Regions only) key spec.
 *
 * - **Bob** creates an elliptic curve key pair.
 *
 * Bob can call CreateKey to create an asymmetric KMS key pair or
 * generate a key pair outside of KMS. Bob's key pair must use the same NIST-standard
 * elliptic curve (ECC) or SM2 (China Regions ony) curve as Alice.
 *
 * - Alice and Bob **exchange their public keys** through an
 * insecure communication channel (like the internet).
 *
 * Use GetPublicKey to download the public key of your asymmetric KMS
 * key pair.
 *
 * KMS strongly recommends verifying that the public key you receive came from the
 * expected party before using it to derive a shared secret.
 *
 * - **Alice** calls DeriveSharedSecret.
 *
 * KMS uses the private key from the KMS key pair generated in **Step 1**, Bob's public key, and the Elliptic Curve Cryptography Cofactor
 * Diffie-Hellman Primitive to derive the shared secret. The private key in your KMS key pair
 * never leaves KMS unencrypted. DeriveSharedSecret returns the raw shared secret.
 *
 * - **Bob** uses the Elliptic Curve Cryptography Cofactor
 * Diffie-Hellman Primitive to calculate the same raw secret using his private key and
 * Alice's public key.
 *
 * To derive a shared secret you must provide a key agreement algorithm, the private key of
 * the caller's asymmetric NIST-standard elliptic curve or SM2 (China Regions only) KMS key
 * pair, and the public key from your peer's NIST-standard elliptic curve or SM2 (China
 * Regions only) key pair. The public key can be from another asymmetric KMS key pair or from a
 * key pair generated outside of KMS, but both key pairs must be on the same elliptic
 * curve.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify
 * the key ARN or alias ARN in the value of the `KeyId` parameter.
 *
 * **Required permissions**: kms:DeriveSharedSecret (key policy)
 *
 * **Related operations:**
 *
 * - CreateKey
 *
 * - GetPublicKey
 *
 * - DescribeKey
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const deriveSharedSecret: (
  input: DeriveSharedSecretRequest,
) => Effect.Effect<
  DeriveSharedSecretResponse,
  | DependencyTimeoutException
  | DisabledException
  | DryRunOperationException
  | InvalidGrantTokenException
  | InvalidKeyUsageException
  | KeyUnavailableException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeriveSharedSecretRequest,
  output: DeriveSharedSecretResponse,
  errors: [
    DependencyTimeoutException,
    DisabledException,
    DryRunOperationException,
    InvalidGrantTokenException,
    InvalidKeyUsageException,
    KeyUnavailableException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
  ],
}));
/**
 * Encrypts plaintext of up to 4,096 bytes using a KMS key. You can use a symmetric or
 * asymmetric KMS key with a `KeyUsage` of `ENCRYPT_DECRYPT`.
 *
 * You can use this operation to encrypt small amounts of arbitrary data, such as a personal
 * identifier or database password, or other sensitive information. You don't need to use the
 * `Encrypt` operation to encrypt a data key. The GenerateDataKey
 * and GenerateDataKeyPair operations return a plaintext data key and an
 * encrypted copy of that data key.
 *
 * If you use a symmetric encryption KMS key, you can use an encryption context to add
 * additional security to your encryption operation. If you specify an
 * `EncryptionContext` when encrypting data, you must specify the same encryption
 * context (a case-sensitive exact match) when decrypting the data. Otherwise, the request to
 * decrypt fails with an `InvalidCiphertextException`. For more information, see
 * Encryption
 * Context in the *Key Management Service Developer Guide*.
 *
 * If you specify an asymmetric KMS key, you must also specify the encryption algorithm. The
 * algorithm must be compatible with the KMS key spec.
 *
 * When you use an asymmetric KMS key to encrypt or reencrypt data, be sure to record the KMS key and encryption algorithm that you choose. You will be required to provide the same KMS key and encryption algorithm when you decrypt the data. If the KMS key and algorithm do not match the values used to encrypt the data, the decrypt operation fails.
 *
 * You are not required to supply the key ID and encryption algorithm when you decrypt with symmetric encryption KMS keys because KMS stores this information in the ciphertext blob. KMS cannot store metadata in ciphertext generated with asymmetric keys. The standard format for asymmetric key ciphertext does not include configurable fields.
 *
 * The maximum size of the data that you can encrypt varies with the type of KMS key and the
 * encryption algorithm that you choose.
 *
 * - Symmetric encryption KMS keys
 *
 * - `SYMMETRIC_DEFAULT`: 4096 bytes
 *
 * - `RSA_2048`
 *
 * - `RSAES_OAEP_SHA_1`: 214 bytes
 *
 * - `RSAES_OAEP_SHA_256`: 190 bytes
 *
 * - `RSA_3072`
 *
 * - `RSAES_OAEP_SHA_1`: 342 bytes
 *
 * - `RSAES_OAEP_SHA_256`: 318 bytes
 *
 * - `RSA_4096`
 *
 * - `RSAES_OAEP_SHA_1`: 470 bytes
 *
 * - `RSAES_OAEP_SHA_256`: 446 bytes
 *
 * - `SM2PKE`: 1024 bytes (China Regions only)
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify
 * the key ARN or alias ARN in the value of the `KeyId` parameter.
 *
 * **Required permissions**: kms:Encrypt (key policy)
 *
 * **Related operations:**
 *
 * - Decrypt
 *
 * - GenerateDataKey
 *
 * - GenerateDataKeyPair
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const encrypt: (
  input: EncryptRequest,
) => Effect.Effect<
  EncryptResponse,
  | DependencyTimeoutException
  | DisabledException
  | DryRunOperationException
  | InvalidGrantTokenException
  | InvalidKeyUsageException
  | KeyUnavailableException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EncryptRequest,
  output: EncryptResponse,
  errors: [
    DependencyTimeoutException,
    DisabledException,
    DryRunOperationException,
    InvalidGrantTokenException,
    InvalidKeyUsageException,
    KeyUnavailableException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
  ],
}));
/**
 * Returns a unique symmetric data key for use outside of KMS. This operation returns a
 * plaintext copy of the data key and a copy that is encrypted under a symmetric encryption KMS
 * key that you specify. The bytes in the plaintext key are random; they are not related to the
 * caller or the KMS key. You can use the plaintext key to encrypt your data outside of KMS and
 * store the encrypted data key with the encrypted data.
 *
 * To generate a data key, specify the symmetric encryption KMS key that will be used to
 * encrypt the data key. You cannot use an asymmetric KMS key to encrypt data keys. To get the
 * type of your KMS key, use the DescribeKey operation.
 *
 * You must also specify the length of the data key. Use either the `KeySpec` or
 * `NumberOfBytes` parameters (but not both). For 128-bit and 256-bit data keys, use
 * the `KeySpec` parameter.
 *
 * To generate a 128-bit SM4 data key (China Regions only), specify a `KeySpec`
 * value of `AES_128` or a `NumberOfBytes` value of `16`. The
 * symmetric encryption key used in China Regions to encrypt your data key is an SM4 encryption
 * key.
 *
 * To get only an encrypted copy of the data key, use GenerateDataKeyWithoutPlaintext. To generate an asymmetric data key pair, use
 * the GenerateDataKeyPair or GenerateDataKeyPairWithoutPlaintext operation. To get a cryptographically secure
 * random byte string, use GenerateRandom.
 *
 * You can use an optional encryption context to add additional security to the encryption
 * operation. If you specify an `EncryptionContext`, you must specify the same
 * encryption context (a case-sensitive exact match) when decrypting the encrypted data key.
 * Otherwise, the request to decrypt fails with an `InvalidCiphertextException`. For more information, see Encryption Context in the
 * *Key Management Service Developer Guide*.
 *
 * `GenerateDataKey` also supports Amazon Web Services Nitro Enclaves, which provide an
 * isolated compute environment in Amazon EC2. To call `GenerateDataKey` for an Amazon Web Services Nitro
 * enclave or NitroTPM, use the Amazon Web Services Nitro Enclaves SDK or any Amazon Web Services SDK. Use the
 * `Recipient` parameter to provide the attestation document for the attested
 * environment. `GenerateDataKey` returns a copy of the data key encrypted under the
 * specified KMS key, as usual. But instead of a plaintext copy of the data key, the response
 * includes a copy of the data key encrypted under the public key from the attestation document
 * (`CiphertextForRecipient`). For information about the interaction between KMS and Amazon Web Services Nitro Enclaves or Amazon Web Services NitroTPM, see Cryptographic attestation support in KMS in the *Key Management Service Developer Guide*.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **How to use your data key**
 *
 * We recommend that you use the following pattern to encrypt data locally in your
 * application. You can write your own code or use a client-side encryption library, such as the
 * Amazon Web Services Encryption SDK, the
 * Amazon DynamoDB Encryption Client,
 * or Amazon S3
 * client-side encryption to do these tasks for you.
 *
 * To encrypt data outside of KMS:
 *
 * - Use the `GenerateDataKey` operation to get a data key.
 *
 * - Use the plaintext data key (in the `Plaintext` field of the response) to
 * encrypt your data outside of KMS. Then erase the plaintext data key from memory.
 *
 * - Store the encrypted data key (in the `CiphertextBlob` field of the
 * response) with the encrypted data.
 *
 * To decrypt data outside of KMS:
 *
 * - Use the Decrypt operation to decrypt the encrypted data key. The
 * operation returns a plaintext copy of the data key.
 *
 * - Use the plaintext data key to decrypt data outside of KMS, then erase the plaintext
 * data key from memory.
 *
 * **Cross-account use**: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify
 * the key ARN or alias ARN in the value of the `KeyId` parameter.
 *
 * **Required permissions**: kms:GenerateDataKey (key policy)
 *
 * **Related operations:**
 *
 * - Decrypt
 *
 * - Encrypt
 *
 * - GenerateDataKeyPair
 *
 * - GenerateDataKeyPairWithoutPlaintext
 *
 * - GenerateDataKeyWithoutPlaintext
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const generateDataKey: (
  input: GenerateDataKeyRequest,
) => Effect.Effect<
  GenerateDataKeyResponse,
  | DependencyTimeoutException
  | DisabledException
  | DryRunOperationException
  | InvalidGrantTokenException
  | InvalidKeyUsageException
  | KeyUnavailableException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateDataKeyRequest,
  output: GenerateDataKeyResponse,
  errors: [
    DependencyTimeoutException,
    DisabledException,
    DryRunOperationException,
    InvalidGrantTokenException,
    InvalidKeyUsageException,
    KeyUnavailableException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
  ],
}));
/**
 * Returns a unique asymmetric data key pair for use outside of KMS. This operation returns
 * a plaintext public key, a plaintext private key, and a copy of the private key that is
 * encrypted under the symmetric encryption KMS key you specify. You can use the data key pair to
 * perform asymmetric cryptography and implement digital signatures outside of KMS. The bytes
 * in the keys are random; they are not related to the caller or to the KMS key that is used to
 * encrypt the private key.
 *
 * You can use the public key that `GenerateDataKeyPair` returns to encrypt data
 * or verify a signature outside of KMS. Then, store the encrypted private key with the data.
 * When you are ready to decrypt data or sign a message, you can use the Decrypt operation to decrypt the encrypted private key.
 *
 * To generate a data key pair, you must specify a symmetric encryption KMS key to encrypt
 * the private key in a data key pair. You cannot use an asymmetric KMS key or a KMS key in a
 * custom key store. To get the type and origin of your KMS key, use the DescribeKey operation.
 *
 * Use the `KeyPairSpec` parameter to choose an RSA or Elliptic Curve (ECC) data
 * key pair. In China Regions, you can also choose an SM2 data key pair. KMS recommends that
 * you use ECC key pairs for signing, and use RSA and SM2 key pairs for either encryption or
 * signing, but not both. However, KMS cannot enforce any restrictions on the use of data key
 * pairs outside of KMS.
 *
 * If you are using the data key pair to encrypt data, or for any operation where you don't
 * immediately need a private key, consider using the GenerateDataKeyPairWithoutPlaintext operation.
 * `GenerateDataKeyPairWithoutPlaintext` returns a plaintext public key and an
 * encrypted private key, but omits the plaintext private key that you need only to decrypt
 * ciphertext or sign a message. Later, when you need to decrypt the data or sign a message, use
 * the Decrypt operation to decrypt the encrypted private key in the data key
 * pair.
 *
 * `GenerateDataKeyPair` returns a unique data key pair for each request. The
 * bytes in the keys are random; they are not related to the caller or the KMS key that is used
 * to encrypt the private key. The public key is a DER-encoded X.509 SubjectPublicKeyInfo, as
 * specified in RFC 5280. The private
 * key is a DER-encoded PKCS8 PrivateKeyInfo, as specified in RFC 5958.
 *
 * `GenerateDataKeyPair` also supports Amazon Web Services Nitro Enclaves, which provide an
 * isolated compute environment in Amazon EC2. To call `GenerateDataKeyPair` for an Amazon Web Services
 * Nitro enclave or NitroTPM, use the Amazon Web Services Nitro Enclaves SDK or any Amazon Web Services SDK. Use the
 * `Recipient` parameter to provide the attestation document for the attested
 * environment. `GenerateDataKeyPair` returns the public data key and a copy of the
 * private data key encrypted under the specified KMS key, as usual. But instead of a plaintext
 * copy of the private data key (`PrivateKeyPlaintext`), the response includes a copy
 * of the private data key encrypted under the public key from the attestation document
 * (`CiphertextForRecipient`). For information about the interaction between KMS and Amazon Web Services Nitro Enclaves or Amazon Web Services NitroTPM, see Cryptographic attestation support in KMS in the *Key Management Service Developer Guide*.
 *
 * You can use an optional encryption context to add additional security to the encryption
 * operation. If you specify an `EncryptionContext`, you must specify the same
 * encryption context (a case-sensitive exact match) when decrypting the encrypted data key.
 * Otherwise, the request to decrypt fails with an `InvalidCiphertextException`. For more information, see Encryption Context in the
 * *Key Management Service Developer Guide*.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify
 * the key ARN or alias ARN in the value of the `KeyId` parameter.
 *
 * **Required permissions**: kms:GenerateDataKeyPair (key policy)
 *
 * **Related operations:**
 *
 * - Decrypt
 *
 * - Encrypt
 *
 * - GenerateDataKey
 *
 * - GenerateDataKeyPairWithoutPlaintext
 *
 * - GenerateDataKeyWithoutPlaintext
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const generateDataKeyPair: (
  input: GenerateDataKeyPairRequest,
) => Effect.Effect<
  GenerateDataKeyPairResponse,
  | DependencyTimeoutException
  | DisabledException
  | DryRunOperationException
  | InvalidGrantTokenException
  | InvalidKeyUsageException
  | KeyUnavailableException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateDataKeyPairRequest,
  output: GenerateDataKeyPairResponse,
  errors: [
    DependencyTimeoutException,
    DisabledException,
    DryRunOperationException,
    InvalidGrantTokenException,
    InvalidKeyUsageException,
    KeyUnavailableException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns a unique asymmetric data key pair for use outside of KMS. This operation returns
 * a plaintext public key and a copy of the private key that is encrypted under the symmetric
 * encryption KMS key you specify. Unlike GenerateDataKeyPair, this operation
 * does not return a plaintext private key. The bytes in the keys are random; they are not
 * related to the caller or to the KMS key that is used to encrypt the private key.
 *
 * You can use the public key that `GenerateDataKeyPairWithoutPlaintext` returns
 * to encrypt data or verify a signature outside of KMS. Then, store the encrypted private key
 * with the data. When you are ready to decrypt data or sign a message, you can use the Decrypt operation to decrypt the encrypted private key.
 *
 * To generate a data key pair, you must specify a symmetric encryption KMS key to encrypt
 * the private key in a data key pair. You cannot use an asymmetric KMS key or a KMS key in a
 * custom key store. To get the type and origin of your KMS key, use the DescribeKey operation.
 *
 * Use the `KeyPairSpec` parameter to choose an RSA or Elliptic Curve (ECC) data
 * key pair. In China Regions, you can also choose an SM2 data key pair. KMS recommends that
 * you use ECC key pairs for signing, and use RSA and SM2 key pairs for either encryption or
 * signing, but not both. However, KMS cannot enforce any restrictions on the use of data key
 * pairs outside of KMS.
 *
 * `GenerateDataKeyPairWithoutPlaintext` returns a unique data key pair for each
 * request. The bytes in the key are not related to the caller or KMS key that is used to encrypt
 * the private key. The public key is a DER-encoded X.509 SubjectPublicKeyInfo, as specified in
 * RFC 5280.
 *
 * You can use an optional encryption context to add additional security to the encryption
 * operation. If you specify an `EncryptionContext`, you must specify the same
 * encryption context (a case-sensitive exact match) when decrypting the encrypted data key.
 * Otherwise, the request to decrypt fails with an `InvalidCiphertextException`. For more information, see Encryption Context in the
 * *Key Management Service Developer Guide*.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify
 * the key ARN or alias ARN in the value of the `KeyId` parameter.
 *
 * **Required permissions**: kms:GenerateDataKeyPairWithoutPlaintext (key
 * policy)
 *
 * **Related operations:**
 *
 * - Decrypt
 *
 * - Encrypt
 *
 * - GenerateDataKey
 *
 * - GenerateDataKeyPair
 *
 * - GenerateDataKeyWithoutPlaintext
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const generateDataKeyPairWithoutPlaintext: (
  input: GenerateDataKeyPairWithoutPlaintextRequest,
) => Effect.Effect<
  GenerateDataKeyPairWithoutPlaintextResponse,
  | DependencyTimeoutException
  | DisabledException
  | DryRunOperationException
  | InvalidGrantTokenException
  | InvalidKeyUsageException
  | KeyUnavailableException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateDataKeyPairWithoutPlaintextRequest,
  output: GenerateDataKeyPairWithoutPlaintextResponse,
  errors: [
    DependencyTimeoutException,
    DisabledException,
    DryRunOperationException,
    InvalidGrantTokenException,
    InvalidKeyUsageException,
    KeyUnavailableException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns a unique symmetric data key for use outside of KMS. This operation returns a
 * data key that is encrypted under a symmetric encryption KMS key that you specify. The bytes in
 * the key are random; they are not related to the caller or to the KMS key.
 *
 * `GenerateDataKeyWithoutPlaintext` is identical to the GenerateDataKey operation except that it does not return a plaintext copy of the
 * data key.
 *
 * This operation is useful for systems that need to encrypt data at some point, but not
 * immediately. When you need to encrypt the data, you call the Decrypt
 * operation on the encrypted copy of the key.
 *
 * It's also useful in distributed systems with different levels of trust. For example, you
 * might store encrypted data in containers. One component of your system creates new containers
 * and stores an encrypted data key with each container. Then, a different component puts the
 * data into the containers. That component first decrypts the data key, uses the plaintext data
 * key to encrypt data, puts the encrypted data into the container, and then destroys the
 * plaintext data key. In this system, the component that creates the containers never sees the
 * plaintext data key.
 *
 * To request an asymmetric data key pair, use the GenerateDataKeyPair or
 * GenerateDataKeyPairWithoutPlaintext operations.
 *
 * To generate a data key, you must specify the symmetric encryption KMS key that is used to
 * encrypt the data key. You cannot use an asymmetric KMS key or a key in a custom key store to
 * generate a data key. To get the type of your KMS key, use the DescribeKey
 * operation.
 *
 * You must also specify the length of the data key. Use either the `KeySpec` or
 * `NumberOfBytes` parameters (but not both). For 128-bit and 256-bit data keys, use
 * the `KeySpec` parameter.
 *
 * To generate an SM4 data key (China Regions only), specify a `KeySpec` value of
 * `AES_128` or `NumberOfBytes` value of `16`. The symmetric
 * encryption key used in China Regions to encrypt your data key is an SM4 encryption key.
 *
 * If the operation succeeds, you will find the encrypted copy of the data key in the
 * `CiphertextBlob` field.
 *
 * You can use an optional encryption context to add additional security to the encryption
 * operation. If you specify an `EncryptionContext`, you must specify the same
 * encryption context (a case-sensitive exact match) when decrypting the encrypted data key.
 * Otherwise, the request to decrypt fails with an `InvalidCiphertextException`. For more information, see Encryption Context in the
 * *Key Management Service Developer Guide*.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify
 * the key ARN or alias ARN in the value of the `KeyId` parameter.
 *
 * **Required permissions**: kms:GenerateDataKeyWithoutPlaintext (key
 * policy)
 *
 * **Related operations:**
 *
 * - Decrypt
 *
 * - Encrypt
 *
 * - GenerateDataKey
 *
 * - GenerateDataKeyPair
 *
 * - GenerateDataKeyPairWithoutPlaintext
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const generateDataKeyWithoutPlaintext: (
  input: GenerateDataKeyWithoutPlaintextRequest,
) => Effect.Effect<
  GenerateDataKeyWithoutPlaintextResponse,
  | DependencyTimeoutException
  | DisabledException
  | DryRunOperationException
  | InvalidGrantTokenException
  | InvalidKeyUsageException
  | KeyUnavailableException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateDataKeyWithoutPlaintextRequest,
  output: GenerateDataKeyWithoutPlaintextResponse,
  errors: [
    DependencyTimeoutException,
    DisabledException,
    DryRunOperationException,
    InvalidGrantTokenException,
    InvalidKeyUsageException,
    KeyUnavailableException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
  ],
}));
/**
 * Generates a hash-based message authentication code (HMAC) for a message using an HMAC KMS
 * key and a MAC algorithm that the key supports. HMAC KMS keys and the HMAC algorithms that
 * KMS uses conform to industry standards defined in RFC 2104.
 *
 * You can use value that GenerateMac returns in the VerifyMac operation to
 * demonstrate that the original message has not changed. Also, because a secret key is used to
 * create the hash, you can verify that the party that generated the hash has the required secret
 * key. You can also use the raw result to implement HMAC-based algorithms such as key derivation
 * functions. This operation is part of KMS support for HMAC KMS keys. For
 * details, see HMAC keys in
 * KMS in the
 * *Key Management Service Developer Guide*
 * .
 *
 * Best practices recommend that you limit the time during which any signing mechanism,
 * including an HMAC, is effective. This deters an attack where the actor uses a signed message
 * to establish validity repeatedly or long after the message is superseded. HMAC tags do not
 * include a timestamp, but you can include a timestamp in the token or message to help you
 * detect when its time to refresh the HMAC.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify
 * the key ARN or alias ARN in the value of the `KeyId` parameter.
 *
 * **Required permissions**: kms:GenerateMac (key policy)
 *
 * **Related operations**: VerifyMac
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const generateMac: (
  input: GenerateMacRequest,
) => Effect.Effect<
  GenerateMacResponse,
  | DisabledException
  | DryRunOperationException
  | InvalidGrantTokenException
  | InvalidKeyUsageException
  | KeyUnavailableException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateMacRequest,
  output: GenerateMacResponse,
  errors: [
    DisabledException,
    DryRunOperationException,
    InvalidGrantTokenException,
    InvalidKeyUsageException,
    KeyUnavailableException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
  ],
}));
/**
 * Creates a digital
 * signature for a message or message digest by using the private key in an asymmetric
 * signing KMS key. To verify the signature, use the Verify operation, or use
 * the public key in the same asymmetric KMS key outside of KMS. For information about asymmetric KMS keys, see Asymmetric KMS keys in the *Key Management Service Developer Guide*.
 *
 * Digital signatures are generated and verified by using asymmetric key pair, such as an
 * RSA, ECC, or ML-DSA pair that is represented by an asymmetric KMS key. The key owner (or an
 * authorized user) uses their private key to sign a message. Anyone with the public key can
 * verify that the message was signed with that particular private key and that the message
 * hasn't changed since it was signed.
 *
 * To use the `Sign` operation, provide the following information:
 *
 * - Use the `KeyId` parameter to identify an asymmetric KMS key with a
 * `KeyUsage` value of `SIGN_VERIFY`. To get the
 * `KeyUsage` value of a KMS key, use the DescribeKey
 * operation. The caller must have `kms:Sign` permission on the KMS key.
 *
 * - Use the `Message` parameter to specify the message or message digest to
 * sign. You can submit messages of up to 4096 bytes. To sign a larger message, generate a
 * hash digest of the message, and then provide the hash digest in the `Message`
 * parameter. To indicate whether the message is a full message, a digest, or an ML-DSA
 * EXTERNAL_MU, use the `MessageType` parameter.
 *
 * - Choose a signing algorithm that is compatible with the KMS key.
 *
 * When signing a message, be sure to record the KMS key and the signing algorithm. This
 * information is required to verify the signature.
 *
 * Best practices recommend that you limit the time during which any signature is
 * effective. This deters an attack where the actor uses a signed message to establish validity
 * repeatedly or long after the message is superseded. Signatures do not include a timestamp,
 * but you can include a timestamp in the signed message to help you detect when its time to
 * refresh the signature.
 *
 * To verify the signature that this operation generates, use the Verify
 * operation. Or use the GetPublicKey operation to download the public key and
 * then use the public key to verify the signature outside of KMS.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify
 * the key ARN or alias ARN in the value of the `KeyId` parameter.
 *
 * **Required permissions**: kms:Sign (key policy)
 *
 * **Related operations**: Verify
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const sign: (
  input: SignRequest,
) => Effect.Effect<
  SignResponse,
  | DependencyTimeoutException
  | DisabledException
  | DryRunOperationException
  | InvalidGrantTokenException
  | InvalidKeyUsageException
  | KeyUnavailableException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SignRequest,
  output: SignResponse,
  errors: [
    DependencyTimeoutException,
    DisabledException,
    DryRunOperationException,
    InvalidGrantTokenException,
    InvalidKeyUsageException,
    KeyUnavailableException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
  ],
}));
/**
 * Decrypts ciphertext and then reencrypts it entirely within KMS. You can use this
 * operation to change the KMS key under which data is encrypted, such as when you manually rotate a
 * KMS key or change the KMS key that protects a ciphertext. You can also use it to reencrypt
 * ciphertext under the same KMS key, such as to change the encryption context of a ciphertext.
 *
 * The `ReEncrypt` operation can decrypt ciphertext that was encrypted by using a
 * KMS key in an KMS operation, such as Encrypt or GenerateDataKey. It can also decrypt ciphertext that was encrypted by using the
 * public key of an asymmetric KMS key outside of KMS. However, it cannot decrypt ciphertext produced
 * by other libraries, such as the Amazon Web Services
 * Encryption SDK or Amazon S3 client-side encryption.
 * These libraries return a ciphertext format that is incompatible with KMS.
 *
 * When you use the `ReEncrypt` operation, you need to provide information for the
 * decrypt operation and the subsequent encrypt operation.
 *
 * - If your ciphertext was encrypted under an asymmetric KMS key, you must use the
 * `SourceKeyId` parameter to identify the KMS key that encrypted the
 * ciphertext. You must also supply the encryption algorithm that was used. This information
 * is required to decrypt the data.
 *
 * - If your ciphertext was encrypted under a symmetric encryption KMS key, the
 * `SourceKeyId` parameter is optional. KMS can get this information from
 * metadata that it adds to the symmetric ciphertext blob. This feature adds durability to
 * your implementation by ensuring that authorized users can decrypt ciphertext decades after
 * it was encrypted, even if they've lost track of the key ID. However, specifying the source
 * KMS key is always recommended as a best practice. When you use the
 * `SourceKeyId` parameter to specify a KMS key, KMS uses only the KMS key you
 * specify. If the ciphertext was encrypted under a different KMS key, the
 * `ReEncrypt` operation fails. This practice ensures that you use the KMS key
 * that you intend.
 *
 * - To reencrypt the data, you must use the `DestinationKeyId` parameter to
 * specify the KMS key that re-encrypts the data after it is decrypted. If the destination
 * KMS key is an asymmetric KMS key, you must also provide the encryption algorithm. The
 * algorithm that you choose must be compatible with the KMS key.
 *
 * When you use an asymmetric KMS key to encrypt or reencrypt data, be sure to record the KMS key and encryption algorithm that you choose. You will be required to provide the same KMS key and encryption algorithm when you decrypt the data. If the KMS key and algorithm do not match the values used to encrypt the data, the decrypt operation fails.
 *
 * You are not required to supply the key ID and encryption algorithm when you decrypt with symmetric encryption KMS keys because KMS stores this information in the ciphertext blob. KMS cannot store metadata in ciphertext generated with asymmetric keys. The standard format for asymmetric key ciphertext does not include configurable fields.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: Yes. The source KMS key and
 * destination KMS key can be in different Amazon Web Services accounts. Either or both KMS keys can be in a
 * different account than the caller. To specify a KMS key in a different account, you must use
 * its key ARN or alias ARN.
 *
 * **Required permissions**:
 *
 * - kms:ReEncryptFrom
 * permission on the source KMS key (key policy)
 *
 * - kms:ReEncryptTo
 * permission on the destination KMS key (key policy)
 *
 * To permit reencryption from or to a KMS key, include the `"kms:ReEncrypt*"`
 * permission in your key policy. This permission is
 * automatically included in the key policy when you use the console to create a KMS key. But you
 * must include it manually when you create a KMS key programmatically or when you use the PutKeyPolicy operation to set a key policy.
 *
 * **Related operations:**
 *
 * - Decrypt
 *
 * - Encrypt
 *
 * - GenerateDataKey
 *
 * - GenerateDataKeyPair
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const reEncrypt: (
  input: ReEncryptRequest,
) => Effect.Effect<
  ReEncryptResponse,
  | DependencyTimeoutException
  | DisabledException
  | DryRunOperationException
  | IncorrectKeyException
  | InvalidCiphertextException
  | InvalidGrantTokenException
  | InvalidKeyUsageException
  | KeyUnavailableException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReEncryptRequest,
  output: ReEncryptResponse,
  errors: [
    DependencyTimeoutException,
    DisabledException,
    DryRunOperationException,
    IncorrectKeyException,
    InvalidCiphertextException,
    InvalidGrantTokenException,
    InvalidKeyUsageException,
    KeyUnavailableException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
  ],
}));
/**
 * Decrypts ciphertext that was encrypted by a KMS key using any of the following
 * operations:
 *
 * - Encrypt
 *
 * - GenerateDataKey
 *
 * - GenerateDataKeyPair
 *
 * - GenerateDataKeyWithoutPlaintext
 *
 * - GenerateDataKeyPairWithoutPlaintext
 *
 * You can use this operation to decrypt ciphertext that was encrypted under a symmetric
 * encryption KMS key or an asymmetric encryption KMS key. When the KMS key is asymmetric, you
 * must specify the KMS key and the encryption algorithm that was used to encrypt the ciphertext.
 * For information about asymmetric KMS keys, see Asymmetric KMS keys in the *Key Management Service Developer Guide*.
 *
 * The `Decrypt` operation also decrypts ciphertext that was encrypted outside of
 * KMS by the public key in an KMS asymmetric KMS key. However, it cannot decrypt symmetric
 * ciphertext produced by other libraries, such as the Amazon Web Services Encryption SDK or Amazon S3 client-side encryption.
 * These libraries return a ciphertext format that is incompatible with KMS.
 *
 * If the ciphertext was encrypted under a symmetric encryption KMS key, the
 * `KeyId` parameter is optional. KMS can get this information from metadata that
 * it adds to the symmetric ciphertext blob. This feature adds durability to your implementation
 * by ensuring that authorized users can decrypt ciphertext decades after it was encrypted, even
 * if they've lost track of the key ID. However, specifying the KMS key is always recommended as
 * a best practice. When you use the `KeyId` parameter to specify a KMS key, KMS
 * only uses the KMS key you specify. If the ciphertext was encrypted under a different KMS key,
 * the `Decrypt` operation fails. This practice ensures that you use the KMS key that
 * you intend.
 *
 * Whenever possible, use key policies to give users permission to call the
 * `Decrypt` operation on a particular KMS key, instead of using IAM policies.
 * Otherwise, you might create an IAM policy that gives the user `Decrypt`
 * permission on all KMS keys. This user could decrypt ciphertext that was encrypted by KMS keys
 * in other accounts if the key policy for the cross-account KMS key permits it. If you must use
 * an IAM policy for `Decrypt` permissions, limit the user to particular KMS keys or
 * particular trusted accounts. For details, see Best practices for IAM
 * policies in the *Key Management Service Developer Guide*.
 *
 * `Decrypt` also supports Amazon Web Services Nitro Enclaves and NitroTPM, which
 * provide attested environments in Amazon EC2. To call `Decrypt` for a Nitro enclave or
 * NitroTPM, use the Amazon Web Services Nitro Enclaves SDK or any Amazon Web Services SDK. Use the `Recipient`
 * parameter to provide the attestation document for the attested environment. Instead of the
 * plaintext data, the response includes the plaintext data encrypted with the public key from
 * the attestation document (`CiphertextForRecipient`). For information about the interaction between KMS and Amazon Web Services Nitro Enclaves or Amazon Web Services NitroTPM, see Cryptographic attestation support in KMS in the *Key Management Service Developer Guide*.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: Yes. If you use the `KeyId`
 * parameter to identify a KMS key in a different Amazon Web Services account, specify the key ARN or the alias
 * ARN of the KMS key.
 *
 * **Required permissions**: kms:Decrypt (key policy)
 *
 * **Related operations:**
 *
 * - Encrypt
 *
 * - GenerateDataKey
 *
 * - GenerateDataKeyPair
 *
 * - ReEncrypt
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const decrypt: (
  input: DecryptRequest,
) => Effect.Effect<
  DecryptResponse,
  | DependencyTimeoutException
  | DisabledException
  | DryRunOperationException
  | IncorrectKeyException
  | InvalidCiphertextException
  | InvalidGrantTokenException
  | InvalidKeyUsageException
  | KeyUnavailableException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DecryptRequest,
  output: DecryptResponse,
  errors: [
    DependencyTimeoutException,
    DisabledException,
    DryRunOperationException,
    IncorrectKeyException,
    InvalidCiphertextException,
    InvalidGrantTokenException,
    InvalidKeyUsageException,
    KeyUnavailableException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
  ],
}));
/**
 * Imports or reimports key material into an existing KMS key that was created without key
 * material. You can also use this operation to set or update the expiration model and expiration
 * date of the imported key material.
 *
 * By default, KMS creates KMS keys with key material that it generates. You can also
 * generate and import your own key material. For more information about importing key material,
 * see Importing key
 * material.
 *
 * For asymmetric and HMAC keys, you cannot change the key material after the initial import.
 * You can import multiple key materials into symmetric encryption keys and rotate the key
 * material on demand using `RotateKeyOnDemand`.
 *
 * You can import new key materials into multi-Region symmetric encryption keys. To do so, you must
 * import the new key material into the primary Region key. Then you can import the same key
 * materials into the replica Region keys. You cannot directly import new key material into
 * the replica Region keys.
 *
 * To import new key material for a multi-Region symmetric key, you’ll need to complete the
 * following:
 *
 * - Call `ImportKeyMaterial` on the primary Region key with the
 * `ImportType`set to `NEW_KEY_MATERIAL`.
 *
 * - Call `ImportKeyMaterial` on the replica Region key with the
 * `ImportType` set to `EXISTING_KEY_MATERIAL` using the same key
 * material imported to the primary Region key. You must do this for every replica
 * Region key before you can perform the RotateKeyOnDemand operation
 * on the primary Region key.
 *
 * After you import key material, you can reimport
 * the same key material into that KMS key or, if the key supports on-demand rotation,
 * import new key material. You can use the `ImportType` parameter to indicate whether
 * you are importing new key material or re-importing previously imported key material. You might
 * reimport key material to replace key material that expired or key material that you deleted.
 * You might also reimport key material to change the expiration model or expiration date of the
 * key material.
 *
 * Each time you import key material into KMS, you can determine whether
 * (`ExpirationModel`) and when (`ValidTo`) the key material expires. To
 * change the expiration of your key material, you must import it again, either by calling
 * `ImportKeyMaterial` or using the import features of the KMS console.
 *
 * Before you call `ImportKeyMaterial`, complete these steps:
 *
 * - Create or identify a KMS key with `EXTERNAL` origin, which indicates that
 * the KMS key is designed for imported key material.
 *
 * To create a new KMS key for imported key material, call the CreateKey operation with an `Origin` value of `EXTERNAL`. You can create a
 * symmetric encryption KMS key, HMAC KMS key, asymmetric encryption KMS key, asymmetric key
 * agreement key, or asymmetric signing KMS key. You can also import key material into a
 * multi-Region key of any supported type. However, you can't import key material
 * into a KMS key in a custom key store.
 *
 * - Call the GetParametersForImport operation to get a public key and
 * import token set for importing key material.
 *
 * - Use the public key in the GetParametersForImport response to encrypt
 * your key material.
 *
 * Then, in an `ImportKeyMaterial` request, you submit your encrypted key
 * material and import token. When calling this operation, you must specify the following
 * values:
 *
 * - The key ID or key ARN of the KMS key to associate with the imported key material. Its
 * `Origin` must be `EXTERNAL` and its `KeyState` must be
 * `PendingImport` or `Enabled`. You cannot perform this operation on
 * a KMS key in a custom key store, or on a KMS key in a different Amazon Web Services account. To get the
 * `Origin` and `KeyState` of a KMS key, call DescribeKey.
 *
 * - The encrypted key material.
 *
 * - The import token that GetParametersForImport returned. You must use
 * a public key and token from the same `GetParametersForImport` response.
 *
 * - Whether the key material expires (`ExpirationModel`) and, if so, when
 * (`ValidTo`). For help with this choice, see Setting an expiration time in the *Key Management Service Developer Guide*.
 *
 * If you set an expiration date, KMS deletes the key material from the KMS key on the
 * specified date, making the KMS key unusable. To use the KMS key in cryptographic
 * operations again, you must reimport the same key material. However, you can delete and
 * reimport the key material at any time, including before the key material expires. Each
 * time you reimport, you can eliminate or reset the expiration time.
 *
 * When this operation is successful, the state of the KMS key changes to `Enabled`,
 * and you can use the KMS key in cryptographic operations. For symmetric encryption keys, you will
 * need to import all of the key materials associated with the KMS key to change its state to
 * `Enabled`. Use the `ListKeyRotations` operation to list the ID and import
 * state of each key material associated with a KMS key.
 *
 * If this operation fails, use the exception to help determine the problem. If the error is
 * related to the key material, the import token, or wrapping key, use GetParametersForImport to get a new public key and import token for the KMS key
 * and repeat the import procedure. For help, see Create a KMS key with imported key
 * material in the *Key Management Service Developer Guide*.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: No. You cannot perform this operation on a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:ImportKeyMaterial (key policy)
 *
 * **Related operations:**
 *
 * - DeleteImportedKeyMaterial
 *
 * - GetParametersForImport
 *
 * - ListKeyRotations
 *
 * - RotateKeyOnDemand
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const importKeyMaterial: (
  input: ImportKeyMaterialRequest,
) => Effect.Effect<
  ImportKeyMaterialResponse,
  | DependencyTimeoutException
  | ExpiredImportTokenException
  | IncorrectKeyMaterialException
  | InvalidArnException
  | InvalidCiphertextException
  | InvalidImportTokenException
  | KMSInternalException
  | KMSInvalidStateException
  | NotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportKeyMaterialRequest,
  output: ImportKeyMaterialResponse,
  errors: [
    DependencyTimeoutException,
    ExpiredImportTokenException,
    IncorrectKeyMaterialException,
    InvalidArnException,
    InvalidCiphertextException,
    InvalidImportTokenException,
    KMSInternalException,
    KMSInvalidStateException,
    NotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Verifies the hash-based message authentication code (HMAC) for a specified message, HMAC
 * KMS key, and MAC algorithm. To verify the HMAC, `VerifyMac` computes an HMAC using
 * the message, HMAC KMS key, and MAC algorithm that you specify, and compares the computed HMAC
 * to the HMAC that you specify. If the HMACs are identical, the verification succeeds;
 * otherwise, it fails. Verification indicates that the message hasn't changed since the HMAC was
 * calculated, and the specified key was used to generate and verify the HMAC.
 *
 * HMAC KMS keys and the HMAC algorithms that KMS uses conform to industry standards
 * defined in RFC 2104.
 *
 * This operation is part of KMS support for HMAC KMS keys. For details, see
 * HMAC keys in KMS in the
 * *Key Management Service Developer Guide*.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify
 * the key ARN or alias ARN in the value of the `KeyId` parameter.
 *
 * **Required permissions**: kms:VerifyMac (key policy)
 *
 * **Related operations**: GenerateMac
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const verifyMac: (
  input: VerifyMacRequest,
) => Effect.Effect<
  VerifyMacResponse,
  | DisabledException
  | DryRunOperationException
  | InvalidGrantTokenException
  | InvalidKeyUsageException
  | KeyUnavailableException
  | KMSInternalException
  | KMSInvalidMacException
  | KMSInvalidStateException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifyMacRequest,
  output: VerifyMacResponse,
  errors: [
    DisabledException,
    DryRunOperationException,
    InvalidGrantTokenException,
    InvalidKeyUsageException,
    KeyUnavailableException,
    KMSInternalException,
    KMSInvalidMacException,
    KMSInvalidStateException,
    NotFoundException,
  ],
}));
/**
 * Verifies a digital signature that was generated by the Sign operation.
 *
 * Verification confirms that an authorized user signed the message with the specified KMS
 * key and signing algorithm, and the message hasn't changed since it was signed. If the
 * signature is verified, the value of the `SignatureValid` field in the response is
 * `True`. If the signature verification fails, the `Verify` operation
 * fails with an `KMSInvalidSignatureException` exception.
 *
 * A digital signature is generated by using the private key in an asymmetric KMS key. The
 * signature is verified by using the public key in the same asymmetric KMS key.
 * For information about asymmetric KMS keys, see Asymmetric KMS keys in the *Key Management Service Developer Guide*.
 *
 * To use the `Verify` operation, specify the same asymmetric KMS key, message,
 * and signing algorithm that were used to produce the signature. The message type does not need
 * to be the same as the one used for signing, but it must indicate whether the value of the
 * `Message` parameter should be hashed as part of the verification process.
 *
 * You can also verify the digital signature by using the public key of the KMS key outside
 * of KMS. Use the GetPublicKey operation to download the public key in the
 * asymmetric KMS key and then use the public key to verify the signature outside of KMS. The
 * advantage of using the `Verify` operation is that it is performed within KMS. As
 * a result, it's easy to call, the operation is performed within the FIPS boundary, it is logged
 * in CloudTrail, and you can use key policy and IAM policy to determine who is authorized to use
 * the KMS key to verify signatures.
 *
 * To verify a signature outside of KMS with an SM2 public key (China Regions only), you
 * must specify the distinguishing ID. By default, KMS uses `1234567812345678` as
 * the distinguishing ID. For more information, see Offline
 * verification with SM2 key pairs.
 *
 * The KMS key that you use for this operation must be in a compatible key state. For
 * details, see Key states of KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Cross-account use**: Yes. To perform this operation with a KMS key in a different Amazon Web Services account, specify
 * the key ARN or alias ARN in the value of the `KeyId` parameter.
 *
 * **Required permissions**: kms:Verify (key policy)
 *
 * **Related operations**: Sign
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const verify: (
  input: VerifyRequest,
) => Effect.Effect<
  VerifyResponse,
  | DependencyTimeoutException
  | DisabledException
  | DryRunOperationException
  | InvalidGrantTokenException
  | InvalidKeyUsageException
  | KeyUnavailableException
  | KMSInternalException
  | KMSInvalidSignatureException
  | KMSInvalidStateException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifyRequest,
  output: VerifyResponse,
  errors: [
    DependencyTimeoutException,
    DisabledException,
    DryRunOperationException,
    InvalidGrantTokenException,
    InvalidKeyUsageException,
    KeyUnavailableException,
    KMSInternalException,
    KMSInvalidSignatureException,
    KMSInvalidStateException,
    NotFoundException,
  ],
}));
/**
 * Creates a unique customer managed KMS key in your Amazon Web Services account and Region.
 * You can use a KMS key in cryptographic operations, such as encryption and signing. Some Amazon Web Services
 * services let you use KMS keys that you create and manage to protect your service
 * resources.
 *
 * A KMS key is a logical representation of a cryptographic key. In addition to the key
 * material used in cryptographic operations, a KMS key includes metadata, such as the key ID,
 * key policy, creation date, description, and key state.
 *
 * Use the parameters of `CreateKey` to specify the type of KMS key, the source of
 * its key material, its key policy, description, tags, and other properties.
 *
 * KMS has replaced the term *customer master key (CMK)* with *Key Management Service key*
 * and *KMS key*. The concept has not changed. To prevent breaking changes, KMS is keeping some variations of this term.
 *
 * To create different types of KMS keys, use the following guidance:
 *
 * ### Symmetric encryption KMS key
 *
 * By default, `CreateKey` creates a symmetric encryption KMS key with key
 * material that KMS generates. This is the basic and most widely used type of KMS key, and
 * provides the best performance.
 *
 * To create a symmetric encryption KMS key, you don't need to specify any parameters.
 * The default value for `KeySpec`, `SYMMETRIC_DEFAULT`, the default
 * value for `KeyUsage`, `ENCRYPT_DECRYPT`, and the default value for
 * `Origin`, `AWS_KMS`, create a symmetric encryption KMS key with
 * KMS key material.
 *
 * If you need a key for basic encryption and decryption or you are creating a KMS key
 * to protect your resources in an Amazon Web Services service, create a symmetric encryption KMS key.
 * The key material in a symmetric encryption key never leaves KMS unencrypted. You can
 * use a symmetric encryption KMS key to encrypt and decrypt data up to 4,096 bytes, but
 * they are typically used to generate data keys and data keys pairs. For details, see
 * GenerateDataKey and GenerateDataKeyPair.
 *
 * ### Asymmetric KMS keys
 *
 * To create an asymmetric KMS key, use the `KeySpec` parameter to specify
 * the type of key material in the KMS key. Then, use the `KeyUsage` parameter
 * to determine whether the KMS key will be used to encrypt and decrypt or sign and verify.
 * You can't change these properties after the KMS key is created.
 *
 * Asymmetric KMS keys contain an RSA key pair, Elliptic Curve (ECC) key pair, ML-DSA
 * key pair or an SM2 key pair (China Regions only). The private key in an asymmetric KMS
 * key never leaves KMS unencrypted. However, you can use the GetPublicKey operation to download the public key so it can be used
 * outside of KMS. Each KMS key can have only one key usage. KMS keys with RSA key pairs
 * can be used to encrypt and decrypt data or sign and verify messages (but not both). KMS
 * keys with NIST-standard ECC key pairs can be used to sign and verify messages or
 * derive shared secrets (but not both). KMS keys with `ECC_SECG_P256K1` can be
 * used only to sign and verify messages. KMS keys with ML-DSA key pairs can be used to
 * sign and verify messages. KMS keys with SM2 key pairs (China Regions only) can be used
 * to either encrypt and decrypt data, sign and verify messages, or derive shared secrets
 * (you must choose one key usage type). For information about asymmetric KMS keys, see
 * Asymmetric
 * KMS keys in the *Key Management Service Developer Guide*.
 *
 * ### HMAC KMS key
 *
 * To create an HMAC KMS key, set the `KeySpec` parameter to a key spec
 * value for HMAC KMS keys. Then set the `KeyUsage` parameter to
 * `GENERATE_VERIFY_MAC`. You must set the key usage even though
 * `GENERATE_VERIFY_MAC` is the only valid key usage value for HMAC KMS keys.
 * You can't change these properties after the KMS key is created.
 *
 * HMAC KMS keys are symmetric keys that never leave KMS unencrypted. You can use
 * HMAC keys to generate (GenerateMac) and verify (VerifyMac) HMAC codes for messages up to 4096 bytes.
 *
 * ### Multi-Region primary keys
 *
 * ### Imported key material
 *
 * To create a multi-Region *primary key* in the local Amazon Web Services Region,
 * use the `MultiRegion` parameter with a value of `True`. To create
 * a multi-Region *replica key*, that is, a KMS key with the same key ID
 * and key material as a primary key, but in a different Amazon Web Services Region, use the ReplicateKey operation. To change a replica key to a primary key, and its
 * primary key to a replica key, use the UpdatePrimaryRegion
 * operation.
 *
 * You can create multi-Region KMS keys for all supported KMS key types: symmetric
 * encryption KMS keys, HMAC KMS keys, asymmetric encryption KMS keys, and asymmetric
 * signing KMS keys. You can also create multi-Region keys with imported key material.
 * However, you can't create multi-Region keys in a custom key store.
 *
 * This operation supports *multi-Region keys*, an KMS feature that lets you create multiple
 * interoperable KMS keys in different Amazon Web Services Regions. Because these KMS keys have the same key ID, key
 * material, and other metadata, you can use them interchangeably to encrypt data in one Amazon Web Services Region and decrypt
 * it in a different Amazon Web Services Region without re-encrypting the data or making a cross-Region call. For more information about multi-Region keys, see Multi-Region keys in KMS in the *Key Management Service Developer Guide*.
 *
 * To import your own key material into a KMS key, begin by creating a KMS key with no
 * key material. To do this, use the `Origin` parameter of
 * `CreateKey` with a value of `EXTERNAL`. Next, use GetParametersForImport operation to get a public key and import token. Use
 * the wrapping public key to encrypt your key material. Then, use ImportKeyMaterial with your import token to import the key material. For
 * step-by-step instructions, see Importing Key Material in the
 * *Key Management Service Developer Guide*
 * .
 *
 * You can import key material into KMS keys of all supported KMS key types: symmetric
 * encryption KMS keys, HMAC KMS keys, asymmetric encryption KMS keys, and asymmetric
 * signing KMS keys. You can also create multi-Region keys with imported key material.
 * However, you can't import key material into a KMS key in a custom key store.
 *
 * To create a multi-Region primary key with imported key material, use the
 * `Origin` parameter of `CreateKey` with a value of
 * `EXTERNAL` and the `MultiRegion` parameter with a value of
 * `True`. To create replicas of the multi-Region primary key, use the ReplicateKey operation. For instructions, see Importing key material step
 * 1. For more information about multi-Region keys, see Multi-Region keys in KMS in the *Key Management Service Developer Guide*.
 *
 * ### Custom key store
 *
 * A custom key store lets you protect your Amazon Web Services resources using keys in a backing key
 * store that you own and manage. When you request a cryptographic operation with a KMS key
 * in a custom key store, the operation is performed in the backing key store using its
 * cryptographic keys.
 *
 * KMS supports CloudHSM key stores backed by an CloudHSM cluster and external key stores backed by an
 * external key manager outside of Amazon Web Services. When you create a KMS key in an CloudHSM key store,
 * KMS generates an encryption key in the CloudHSM cluster and associates it with the KMS
 * key. When you create a KMS key in an external key store, you specify an existing
 * encryption key in the external key manager.
 *
 * Some external key managers provide a simpler method for creating a KMS key in an
 * external key store. For details, see your external key manager documentation.
 *
 * Before you create a KMS key in a custom key store, the `ConnectionState`
 * of the key store must be `CONNECTED`. To connect the custom key store, use
 * the ConnectCustomKeyStore operation. To find the
 * `ConnectionState`, use the DescribeCustomKeyStores
 * operation.
 *
 * To create a KMS key in a custom key store, use the `CustomKeyStoreId`.
 * Use the default `KeySpec` value, `SYMMETRIC_DEFAULT`, and the
 * default `KeyUsage` value, `ENCRYPT_DECRYPT` to create a symmetric
 * encryption key. No other key type is supported in a custom key store.
 *
 * To create a KMS key in an CloudHSM key store, use the
 * `Origin` parameter with a value of `AWS_CLOUDHSM`. The CloudHSM
 * cluster that is associated with the custom key store must have at least two active HSMs
 * in different Availability Zones in the Amazon Web Services Region.
 *
 * To create a KMS key in an external key store, use the
 * `Origin` parameter with a value of `EXTERNAL_KEY_STORE` and an
 * `XksKeyId` parameter that identifies an existing external key.
 *
 * Some external key managers provide a simpler method for creating a KMS key in an
 * external key store. For details, see your external key manager documentation.
 *
 * **Cross-account use**: No. You cannot use this operation to
 * create a KMS key in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:CreateKey (IAM policy). To use the
 * `Tags` parameter, kms:TagResource (IAM policy). For examples and information about related
 * permissions, see Allow a user
 * to create KMS keys in the *Key Management Service Developer Guide*.
 *
 * **Related operations:**
 *
 * - DescribeKey
 *
 * - ListKeys
 *
 * - ScheduleKeyDeletion
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const createKey: (
  input: CreateKeyRequest,
) => Effect.Effect<
  CreateKeyResponse,
  | CloudHsmClusterInvalidConfigurationException
  | CustomKeyStoreInvalidStateException
  | CustomKeyStoreNotFoundException
  | DependencyTimeoutException
  | InvalidArnException
  | KMSInternalException
  | LimitExceededException
  | MalformedPolicyDocumentException
  | TagException
  | UnsupportedOperationException
  | XksKeyAlreadyInUseException
  | XksKeyInvalidConfigurationException
  | XksKeyNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKeyRequest,
  output: CreateKeyResponse,
  errors: [
    CloudHsmClusterInvalidConfigurationException,
    CustomKeyStoreInvalidStateException,
    CustomKeyStoreNotFoundException,
    DependencyTimeoutException,
    InvalidArnException,
    KMSInternalException,
    LimitExceededException,
    MalformedPolicyDocumentException,
    TagException,
    UnsupportedOperationException,
    XksKeyAlreadyInUseException,
    XksKeyInvalidConfigurationException,
    XksKeyNotFoundException,
  ],
}));
/**
 * Changes the properties of a custom key store. You can use this operation to change the
 * properties of an CloudHSM key store or an external key store.
 *
 * Use the required `CustomKeyStoreId` parameter to identify the custom key store.
 * Use the remaining optional parameters to change its properties. This operation does not return
 * any property values. To verify the updated property values, use the DescribeCustomKeyStores operation.
 *
 * This operation is part of the custom key stores feature in KMS, which
 * combines the convenience and extensive integration of KMS with the isolation and control of a
 * key store that you own and manage.
 *
 * When updating the properties of an external key store, verify that the updated settings
 * connect your key store, via the external key store proxy, to the same external key manager
 * as the previous settings, or to a backup or snapshot of the external key manager with the
 * same cryptographic keys. If the updated connection settings fail, you can fix them and
 * retry, although an extended delay might disrupt Amazon Web Services services. However, if KMS
 * permanently loses its access to cryptographic keys, ciphertext encrypted under those keys is
 * unrecoverable.
 *
 * For external key stores:
 *
 * Some external key managers provide a simpler method for updating an external key store.
 * For details, see your external key manager documentation.
 *
 * When updating an external key store in the KMS console, you can upload a JSON-based
 * proxy configuration file with the desired values. You cannot upload the proxy configuration
 * file to the `UpdateCustomKeyStore` operation. However, you can use the file to
 * help you determine the correct values for the `UpdateCustomKeyStore`
 * parameters.
 *
 * For an CloudHSM key store, you can use this operation to change the custom key store friendly
 * name (`NewCustomKeyStoreName`), to tell KMS about a change to the
 * `kmsuser` crypto user password (`KeyStorePassword`), or to associate
 * the custom key store with a different, but related, CloudHSM cluster
 * (`CloudHsmClusterId`). To update any property of an CloudHSM key store, the
 * `ConnectionState` of the CloudHSM key store must be `DISCONNECTED`.
 *
 * For an external key store, you can use this operation to change the custom key store
 * friendly name (`NewCustomKeyStoreName`), or to tell KMS about a change to the
 * external key store proxy authentication credentials
 * (`XksProxyAuthenticationCredential`), connection method
 * (`XksProxyConnectivity`), external proxy endpoint
 * (`XksProxyUriEndpoint`) and path (`XksProxyUriPath`). For external key
 * stores with an `XksProxyConnectivity` of `VPC_ENDPOINT_SERVICE`, you can
 * also update the Amazon VPC endpoint service name (`XksProxyVpcEndpointServiceName`). To
 * update most properties of an external key store, the `ConnectionState` of the
 * external key store must be `DISCONNECTED`. However, you can update the
 * `CustomKeyStoreName`, `XksProxyAuthenticationCredential`, and
 * `XksProxyUriPath` of an external key store when it is in the CONNECTED or
 * DISCONNECTED state.
 *
 * If your update requires a `DISCONNECTED` state, before using
 * `UpdateCustomKeyStore`, use the DisconnectCustomKeyStore
 * operation to disconnect the custom key store. After the `UpdateCustomKeyStore`
 * operation completes, use the ConnectCustomKeyStore to reconnect the custom
 * key store. To find the `ConnectionState` of the custom key store, use the DescribeCustomKeyStores operation.
 *
 * Before updating the custom key store, verify that the new values allow KMS to connect
 * the custom key store to its backing key store. For example, before you change the
 * `XksProxyUriPath` value, verify that the external key store proxy is reachable at
 * the new path.
 *
 * If the operation succeeds, it returns a JSON object with no
 * properties.
 *
 * **Cross-account use**: No. You cannot perform this operation on a custom key store in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:UpdateCustomKeyStore (IAM policy)
 *
 * **Related operations:**
 *
 * - ConnectCustomKeyStore
 *
 * - CreateCustomKeyStore
 *
 * - DeleteCustomKeyStore
 *
 * - DescribeCustomKeyStores
 *
 * - DisconnectCustomKeyStore
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const updateCustomKeyStore: (
  input: UpdateCustomKeyStoreRequest,
) => Effect.Effect<
  UpdateCustomKeyStoreResponse,
  | CloudHsmClusterInvalidConfigurationException
  | CloudHsmClusterNotActiveException
  | CloudHsmClusterNotFoundException
  | CloudHsmClusterNotRelatedException
  | CustomKeyStoreInvalidStateException
  | CustomKeyStoreNameInUseException
  | CustomKeyStoreNotFoundException
  | KMSInternalException
  | XksProxyIncorrectAuthenticationCredentialException
  | XksProxyInvalidConfigurationException
  | XksProxyInvalidResponseException
  | XksProxyUriEndpointInUseException
  | XksProxyUriInUseException
  | XksProxyUriUnreachableException
  | XksProxyVpcEndpointServiceInUseException
  | XksProxyVpcEndpointServiceInvalidConfigurationException
  | XksProxyVpcEndpointServiceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCustomKeyStoreRequest,
  output: UpdateCustomKeyStoreResponse,
  errors: [
    CloudHsmClusterInvalidConfigurationException,
    CloudHsmClusterNotActiveException,
    CloudHsmClusterNotFoundException,
    CloudHsmClusterNotRelatedException,
    CustomKeyStoreInvalidStateException,
    CustomKeyStoreNameInUseException,
    CustomKeyStoreNotFoundException,
    KMSInternalException,
    XksProxyIncorrectAuthenticationCredentialException,
    XksProxyInvalidConfigurationException,
    XksProxyInvalidResponseException,
    XksProxyUriEndpointInUseException,
    XksProxyUriInUseException,
    XksProxyUriUnreachableException,
    XksProxyVpcEndpointServiceInUseException,
    XksProxyVpcEndpointServiceInvalidConfigurationException,
    XksProxyVpcEndpointServiceNotFoundException,
  ],
}));
/**
 * Creates a custom key store backed by a key store that you own and manage. When you use a
 * KMS key in a custom key store for a cryptographic operation, the cryptographic operation is
 * actually performed in your key store using your keys. KMS supports CloudHSM key stores
 * backed by an CloudHSM cluster
 * and external key
 * stores backed by an external key store proxy and external key manager outside of
 * Amazon Web Services.
 *
 * This operation is part of the custom key stores feature in KMS, which
 * combines the convenience and extensive integration of KMS with the isolation and control of a
 * key store that you own and manage.
 *
 * Before you create the custom key store, the required elements must be in place and
 * operational. We recommend that you use the test tools that KMS provides to verify the
 * configuration your external key store proxy. For details about the required elements and
 * verification tests, see Assemble the prerequisites (for
 * CloudHSM key stores) or Assemble the prerequisites (for
 * external key stores) in the *Key Management Service Developer Guide*.
 *
 * To create a custom key store, use the following parameters.
 *
 * - To create an CloudHSM key store, specify the `CustomKeyStoreName`,
 * `CloudHsmClusterId`, `KeyStorePassword`, and
 * `TrustAnchorCertificate`. The `CustomKeyStoreType` parameter is
 * optional for CloudHSM key stores. If you include it, set it to the default value,
 * `AWS_CLOUDHSM`. For help with failures, see Troubleshooting an CloudHSM key store in the
 * *Key Management Service Developer Guide*.
 *
 * - To create an external key store, specify the `CustomKeyStoreName` and a
 * `CustomKeyStoreType` of `EXTERNAL_KEY_STORE`. Also, specify values
 * for `XksProxyConnectivity`, `XksProxyAuthenticationCredential`,
 * `XksProxyUriEndpoint`, and `XksProxyUriPath`. If your
 * `XksProxyConnectivity` value is `VPC_ENDPOINT_SERVICE`, specify
 * the `XksProxyVpcEndpointServiceName` parameter. For help with failures, see
 * Troubleshooting
 * an external key store in the *Key Management Service Developer Guide*.
 *
 * For external key stores:
 *
 * Some external key managers provide a simpler method for creating an external key store.
 * For details, see your external key manager documentation.
 *
 * When creating an external key store in the KMS console, you can upload a JSON-based
 * proxy configuration file with the desired values. You cannot use a proxy configuration with
 * the `CreateCustomKeyStore` operation. However, you can use the values in the file
 * to help you determine the correct values for the `CreateCustomKeyStore`
 * parameters.
 *
 * When the operation completes successfully, it returns the ID of the new custom key store.
 * Before you can use your new custom key store, you need to use the ConnectCustomKeyStore operation to connect a new CloudHSM key store to its CloudHSM
 * cluster, or to connect a new external key store to the external key store proxy for your
 * external key manager. Even if you are not going to use your custom key store immediately, you
 * might want to connect it to verify that all settings are correct and then disconnect it until
 * you are ready to use it.
 *
 * **Cross-account use**: No. You cannot perform this operation on a custom key store in a different Amazon Web Services account.
 *
 * **Required permissions**: kms:CreateCustomKeyStore (IAM policy).
 *
 * **Related operations:**
 *
 * - ConnectCustomKeyStore
 *
 * - DeleteCustomKeyStore
 *
 * - DescribeCustomKeyStores
 *
 * - DisconnectCustomKeyStore
 *
 * - UpdateCustomKeyStore
 *
 * **Eventual consistency**: The KMS API follows an eventual consistency model.
 * For more information, see KMS eventual consistency.
 */
export const createCustomKeyStore: (
  input: CreateCustomKeyStoreRequest,
) => Effect.Effect<
  CreateCustomKeyStoreResponse,
  | CloudHsmClusterInUseException
  | CloudHsmClusterInvalidConfigurationException
  | CloudHsmClusterNotActiveException
  | CloudHsmClusterNotFoundException
  | CustomKeyStoreNameInUseException
  | IncorrectTrustAnchorException
  | KMSInternalException
  | LimitExceededException
  | XksProxyIncorrectAuthenticationCredentialException
  | XksProxyInvalidConfigurationException
  | XksProxyInvalidResponseException
  | XksProxyUriEndpointInUseException
  | XksProxyUriInUseException
  | XksProxyUriUnreachableException
  | XksProxyVpcEndpointServiceInUseException
  | XksProxyVpcEndpointServiceInvalidConfigurationException
  | XksProxyVpcEndpointServiceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCustomKeyStoreRequest,
  output: CreateCustomKeyStoreResponse,
  errors: [
    CloudHsmClusterInUseException,
    CloudHsmClusterInvalidConfigurationException,
    CloudHsmClusterNotActiveException,
    CloudHsmClusterNotFoundException,
    CustomKeyStoreNameInUseException,
    IncorrectTrustAnchorException,
    KMSInternalException,
    LimitExceededException,
    XksProxyIncorrectAuthenticationCredentialException,
    XksProxyInvalidConfigurationException,
    XksProxyInvalidResponseException,
    XksProxyUriEndpointInUseException,
    XksProxyUriInUseException,
    XksProxyUriUnreachableException,
    XksProxyVpcEndpointServiceInUseException,
    XksProxyVpcEndpointServiceInvalidConfigurationException,
    XksProxyVpcEndpointServiceNotFoundException,
  ],
}));

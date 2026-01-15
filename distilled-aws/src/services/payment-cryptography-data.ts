import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "Payment Cryptography Data",
  serviceShapeName: "PaymentCryptographyDataPlane",
});
const auth = T.AwsAuthSigv4({ name: "payment-cryptography" });
const ver = T.ServiceVersion("2022-02-03");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://dataplane.payment-cryptography-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://dataplane.payment-cryptography-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://dataplane.payment-cryptography.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://dataplane.payment-cryptography.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type KeyArnOrKeyAliasType = string;
export type CipherTextType = string | redacted.Redacted<string>;
export type PlainTextType = string | redacted.Redacted<string>;
export type PrimaryAccountNumberType = string | redacted.Redacted<string>;
export type IntegerRangeBetween3And5Type = number;
export type MessageDataType = string | redacted.Redacted<string>;
export type IntegerRangeBetween4And16 = number;
export type PinBlockLengthEquals16 = string | redacted.Redacted<string>;
export type CommandMessageDataType = string | redacted.Redacted<string>;
export type IntegerRangeBetween4And12 = number;
export type KeyCheckValueAlgorithm = string;
export type HexEvenLengthBetween16And32 = string | redacted.Redacted<string>;
export type TransactionDataType = string | redacted.Redacted<string>;
export type AuthRequestCryptogramType = string | redacted.Redacted<string>;
export type ValidationDataType = string | redacted.Redacted<string>;
export type MacType = string | redacted.Redacted<string>;
export type EncryptedPinBlockType = string | redacted.Redacted<string>;
export type HexLength16Or20Or24 = string;
export type SystemTraceAuditNumberType = string;
export type TransactionAmountType = string;
export type KeyArn = string;
export type KeyCheckValue = string;
export type InitializationVectorType = string | redacted.Redacted<string>;
export type NumberLengthEquals2 = string;
export type SessionDerivationDataType = string | redacted.Redacted<string>;
export type Tr31WrappedKeyBlock = string | redacted.Redacted<string>;
export type As2805RandomKeyMaterial = string | redacted.Redacted<string>;
export type CardExpiryDateType = string | redacted.Redacted<string>;
export type ServiceCodeType = string | redacted.Redacted<string>;
export type HexLengthBetween2And8 = string;
export type HexLengthBetween2And4 = string;
export type TrackDataType = string | redacted.Redacted<string>;
export type ApplicationCryptogramType = string | redacted.Redacted<string>;
export type HexLengthEquals4 = string;
export type IntegerRangeBetween0And6 = number;
export type DecimalizationTableType = string | redacted.Redacted<string>;
export type HexLengthEquals1 = string;
export type PinValidationDataType = string | redacted.Redacted<string>;
export type PinOffsetType = string | redacted.Redacted<string>;
export type CertificateType = string;
export type HexLengthEquals8 = string;
export type ProprietaryAuthenticationDataType =
  | string
  | redacted.Redacted<string>;
export type VerificationValueType = string | redacted.Redacted<string>;
export type SharedInformation = string;
export type AuthResponseValueType = string | redacted.Redacted<string>;
export type PlainTextOutputType = string | redacted.Redacted<string>;
export type MacOutputType = string | redacted.Redacted<string>;
export type PinChangeMacOutputType = string | redacted.Redacted<string>;
export type KeyMaterial = string | redacted.Redacted<string>;
export type WrappedKeyMaterialFormat = string;
export type VerificationFailedReason = string;

//# Schemas
export type RandomKeySendVariantMask =
  | "VARIANT_MASK_82C0"
  | "VARIANT_MASK_82"
  | (string & {});
export const RandomKeySendVariantMask = S.String;
export type PinBlockFormatForEmvPinChange =
  | "ISO_FORMAT_0"
  | "ISO_FORMAT_1"
  | "ISO_FORMAT_3"
  | (string & {});
export const PinBlockFormatForEmvPinChange = S.String;
export type PinBlockFormatForPinData =
  | "ISO_FORMAT_0"
  | "ISO_FORMAT_1"
  | "ISO_FORMAT_3"
  | "ISO_FORMAT_4"
  | (string & {});
export const PinBlockFormatForPinData = S.String;
export type MajorKeyDerivationMode =
  | "EMV_OPTION_A"
  | "EMV_OPTION_B"
  | (string & {});
export const MajorKeyDerivationMode = S.String;
export type EncryptionMode =
  | "ECB"
  | "CBC"
  | "CFB"
  | "CFB1"
  | "CFB8"
  | "CFB64"
  | "CFB128"
  | "OFB"
  | (string & {});
export const EncryptionMode = S.String;
export type PaddingType =
  | "PKCS1"
  | "OAEP_SHA1"
  | "OAEP_SHA256"
  | "OAEP_SHA512"
  | (string & {});
export const PaddingType = S.String;
export interface SymmetricEncryptionAttributes {
  Mode: EncryptionMode;
  InitializationVector?: string | redacted.Redacted<string>;
  PaddingType?: PaddingType;
}
export const SymmetricEncryptionAttributes = S.suspend(() =>
  S.Struct({
    Mode: EncryptionMode,
    InitializationVector: S.optional(SensitiveString),
    PaddingType: S.optional(PaddingType),
  }),
).annotations({
  identifier: "SymmetricEncryptionAttributes",
}) as any as S.Schema<SymmetricEncryptionAttributes>;
export interface AsymmetricEncryptionAttributes {
  PaddingType?: PaddingType;
}
export const AsymmetricEncryptionAttributes = S.suspend(() =>
  S.Struct({ PaddingType: S.optional(PaddingType) }),
).annotations({
  identifier: "AsymmetricEncryptionAttributes",
}) as any as S.Schema<AsymmetricEncryptionAttributes>;
export type DukptEncryptionMode = "ECB" | "CBC" | (string & {});
export const DukptEncryptionMode = S.String;
export type DukptDerivationType =
  | "TDES_2KEY"
  | "TDES_3KEY"
  | "AES_128"
  | "AES_192"
  | "AES_256"
  | (string & {});
export const DukptDerivationType = S.String;
export type DukptKeyVariant =
  | "BIDIRECTIONAL"
  | "REQUEST"
  | "RESPONSE"
  | (string & {});
export const DukptKeyVariant = S.String;
export interface DukptEncryptionAttributes {
  KeySerialNumber: string;
  Mode?: DukptEncryptionMode;
  DukptKeyDerivationType?: DukptDerivationType;
  DukptKeyVariant?: DukptKeyVariant;
  InitializationVector?: string | redacted.Redacted<string>;
}
export const DukptEncryptionAttributes = S.suspend(() =>
  S.Struct({
    KeySerialNumber: S.String,
    Mode: S.optional(DukptEncryptionMode),
    DukptKeyDerivationType: S.optional(DukptDerivationType),
    DukptKeyVariant: S.optional(DukptKeyVariant),
    InitializationVector: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "DukptEncryptionAttributes",
}) as any as S.Schema<DukptEncryptionAttributes>;
export type EmvMajorKeyDerivationMode =
  | "EMV_OPTION_A"
  | "EMV_OPTION_B"
  | (string & {});
export const EmvMajorKeyDerivationMode = S.String;
export type EmvEncryptionMode = "ECB" | "CBC" | (string & {});
export const EmvEncryptionMode = S.String;
export interface EmvEncryptionAttributes {
  MajorKeyDerivationMode: EmvMajorKeyDerivationMode;
  PrimaryAccountNumber: string | redacted.Redacted<string>;
  PanSequenceNumber: string;
  SessionDerivationData: string | redacted.Redacted<string>;
  Mode?: EmvEncryptionMode;
  InitializationVector?: string | redacted.Redacted<string>;
}
export const EmvEncryptionAttributes = S.suspend(() =>
  S.Struct({
    MajorKeyDerivationMode: EmvMajorKeyDerivationMode,
    PrimaryAccountNumber: SensitiveString,
    PanSequenceNumber: S.String,
    SessionDerivationData: SensitiveString,
    Mode: S.optional(EmvEncryptionMode),
    InitializationVector: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "EmvEncryptionAttributes",
}) as any as S.Schema<EmvEncryptionAttributes>;
export type EncryptionDecryptionAttributes =
  | {
      Symmetric: SymmetricEncryptionAttributes;
      Asymmetric?: never;
      Dukpt?: never;
      Emv?: never;
    }
  | {
      Symmetric?: never;
      Asymmetric: AsymmetricEncryptionAttributes;
      Dukpt?: never;
      Emv?: never;
    }
  | {
      Symmetric?: never;
      Asymmetric?: never;
      Dukpt: DukptEncryptionAttributes;
      Emv?: never;
    }
  | {
      Symmetric?: never;
      Asymmetric?: never;
      Dukpt?: never;
      Emv: EmvEncryptionAttributes;
    };
export const EncryptionDecryptionAttributes = S.Union(
  S.Struct({ Symmetric: SymmetricEncryptionAttributes }),
  S.Struct({ Asymmetric: AsymmetricEncryptionAttributes }),
  S.Struct({ Dukpt: DukptEncryptionAttributes }),
  S.Struct({ Emv: EmvEncryptionAttributes }),
);
export type SymmetricKeyAlgorithm =
  | "TDES_2KEY"
  | "TDES_3KEY"
  | "AES_128"
  | "AES_192"
  | "AES_256"
  | "HMAC_SHA256"
  | "HMAC_SHA384"
  | "HMAC_SHA512"
  | "HMAC_SHA224"
  | (string & {});
export const SymmetricKeyAlgorithm = S.String;
export type KeyDerivationFunction = "NIST_SP800" | "ANSI_X963" | (string & {});
export const KeyDerivationFunction = S.String;
export type KeyDerivationHashAlgorithm =
  | "SHA_256"
  | "SHA_384"
  | "SHA_512"
  | (string & {});
export const KeyDerivationHashAlgorithm = S.String;
export interface EcdhDerivationAttributes {
  CertificateAuthorityPublicKeyIdentifier: string;
  PublicKeyCertificate: string;
  KeyAlgorithm: SymmetricKeyAlgorithm;
  KeyDerivationFunction: KeyDerivationFunction;
  KeyDerivationHashAlgorithm: KeyDerivationHashAlgorithm;
  SharedInformation: string;
}
export const EcdhDerivationAttributes = S.suspend(() =>
  S.Struct({
    CertificateAuthorityPublicKeyIdentifier: S.String,
    PublicKeyCertificate: S.String,
    KeyAlgorithm: SymmetricKeyAlgorithm,
    KeyDerivationFunction: KeyDerivationFunction,
    KeyDerivationHashAlgorithm: KeyDerivationHashAlgorithm,
    SharedInformation: S.String,
  }),
).annotations({
  identifier: "EcdhDerivationAttributes",
}) as any as S.Schema<EcdhDerivationAttributes>;
export type WrappedKeyMaterial =
  | {
      Tr31KeyBlock: string | redacted.Redacted<string>;
      DiffieHellmanSymmetricKey?: never;
    }
  | {
      Tr31KeyBlock?: never;
      DiffieHellmanSymmetricKey: EcdhDerivationAttributes;
    };
export const WrappedKeyMaterial = S.Union(
  S.Struct({ Tr31KeyBlock: SensitiveString }),
  S.Struct({ DiffieHellmanSymmetricKey: EcdhDerivationAttributes }),
);
export interface WrappedKey {
  WrappedKeyMaterial: WrappedKeyMaterial;
  KeyCheckValueAlgorithm?: string;
}
export const WrappedKey = S.suspend(() =>
  S.Struct({
    WrappedKeyMaterial: WrappedKeyMaterial,
    KeyCheckValueAlgorithm: S.optional(S.String),
  }),
).annotations({ identifier: "WrappedKey" }) as any as S.Schema<WrappedKey>;
export interface EncryptDataInput {
  KeyIdentifier: string;
  PlainText: string | redacted.Redacted<string>;
  EncryptionAttributes: EncryptionDecryptionAttributes;
  WrappedKey?: WrappedKey;
}
export const EncryptDataInput = S.suspend(() =>
  S.Struct({
    KeyIdentifier: S.String.pipe(T.HttpLabel("KeyIdentifier")),
    PlainText: SensitiveString,
    EncryptionAttributes: EncryptionDecryptionAttributes,
    WrappedKey: S.optional(WrappedKey),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/keys/{KeyIdentifier}/encrypt" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EncryptDataInput",
}) as any as S.Schema<EncryptDataInput>;
export type MacAlgorithm =
  | "ISO9797_ALGORITHM1"
  | "ISO9797_ALGORITHM3"
  | "CMAC"
  | "HMAC"
  | "HMAC_SHA224"
  | "HMAC_SHA256"
  | "HMAC_SHA384"
  | "HMAC_SHA512"
  | "AS2805_4_1"
  | (string & {});
export const MacAlgorithm = S.String;
export type SessionKeyDerivationMode =
  | "EMV_COMMON_SESSION_KEY"
  | "EMV2000"
  | "AMEX"
  | "MASTERCARD_SESSION_KEY"
  | "VISA"
  | (string & {});
export const SessionKeyDerivationMode = S.String;
export type SessionKeyDerivationValue =
  | {
      ApplicationCryptogram: string | redacted.Redacted<string>;
      ApplicationTransactionCounter?: never;
    }
  | { ApplicationCryptogram?: never; ApplicationTransactionCounter: string };
export const SessionKeyDerivationValue = S.Union(
  S.Struct({ ApplicationCryptogram: SensitiveString }),
  S.Struct({ ApplicationTransactionCounter: S.String }),
);
export interface MacAlgorithmEmv {
  MajorKeyDerivationMode: MajorKeyDerivationMode;
  PrimaryAccountNumber: string | redacted.Redacted<string>;
  PanSequenceNumber: string;
  SessionKeyDerivationMode: SessionKeyDerivationMode;
  SessionKeyDerivationValue: SessionKeyDerivationValue;
}
export const MacAlgorithmEmv = S.suspend(() =>
  S.Struct({
    MajorKeyDerivationMode: MajorKeyDerivationMode,
    PrimaryAccountNumber: SensitiveString,
    PanSequenceNumber: S.String,
    SessionKeyDerivationMode: SessionKeyDerivationMode,
    SessionKeyDerivationValue: SessionKeyDerivationValue,
  }),
).annotations({
  identifier: "MacAlgorithmEmv",
}) as any as S.Schema<MacAlgorithmEmv>;
export interface MacAlgorithmDukpt {
  KeySerialNumber: string;
  DukptKeyVariant: DukptKeyVariant;
  DukptDerivationType?: DukptDerivationType;
}
export const MacAlgorithmDukpt = S.suspend(() =>
  S.Struct({
    KeySerialNumber: S.String,
    DukptKeyVariant: DukptKeyVariant,
    DukptDerivationType: S.optional(DukptDerivationType),
  }),
).annotations({
  identifier: "MacAlgorithmDukpt",
}) as any as S.Schema<MacAlgorithmDukpt>;
export type MacAttributes =
  | {
      Algorithm: MacAlgorithm;
      EmvMac?: never;
      DukptIso9797Algorithm1?: never;
      DukptIso9797Algorithm3?: never;
      DukptCmac?: never;
    }
  | {
      Algorithm?: never;
      EmvMac: MacAlgorithmEmv;
      DukptIso9797Algorithm1?: never;
      DukptIso9797Algorithm3?: never;
      DukptCmac?: never;
    }
  | {
      Algorithm?: never;
      EmvMac?: never;
      DukptIso9797Algorithm1: MacAlgorithmDukpt;
      DukptIso9797Algorithm3?: never;
      DukptCmac?: never;
    }
  | {
      Algorithm?: never;
      EmvMac?: never;
      DukptIso9797Algorithm1?: never;
      DukptIso9797Algorithm3: MacAlgorithmDukpt;
      DukptCmac?: never;
    }
  | {
      Algorithm?: never;
      EmvMac?: never;
      DukptIso9797Algorithm1?: never;
      DukptIso9797Algorithm3?: never;
      DukptCmac: MacAlgorithmDukpt;
    };
export const MacAttributes = S.Union(
  S.Struct({ Algorithm: MacAlgorithm }),
  S.Struct({ EmvMac: MacAlgorithmEmv }),
  S.Struct({ DukptIso9797Algorithm1: MacAlgorithmDukpt }),
  S.Struct({ DukptIso9797Algorithm3: MacAlgorithmDukpt }),
  S.Struct({ DukptCmac: MacAlgorithmDukpt }),
);
export interface VerifyMacInput {
  KeyIdentifier: string;
  MessageData: string | redacted.Redacted<string>;
  Mac: string | redacted.Redacted<string>;
  VerificationAttributes: MacAttributes;
  MacLength?: number;
}
export const VerifyMacInput = S.suspend(() =>
  S.Struct({
    KeyIdentifier: S.String,
    MessageData: SensitiveString,
    Mac: SensitiveString,
    VerificationAttributes: MacAttributes,
    MacLength: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/mac/verify" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "VerifyMacInput",
}) as any as S.Schema<VerifyMacInput>;
export interface TranslationPinDataIsoFormat1 {}
export const TranslationPinDataIsoFormat1 = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "TranslationPinDataIsoFormat1",
}) as any as S.Schema<TranslationPinDataIsoFormat1>;
export type ReEncryptionAttributes =
  | { Symmetric: SymmetricEncryptionAttributes; Dukpt?: never }
  | { Symmetric?: never; Dukpt: DukptEncryptionAttributes };
export const ReEncryptionAttributes = S.Union(
  S.Struct({ Symmetric: SymmetricEncryptionAttributes }),
  S.Struct({ Dukpt: DukptEncryptionAttributes }),
);
export interface DukptDerivationAttributes {
  KeySerialNumber: string;
  DukptKeyDerivationType?: DukptDerivationType;
  DukptKeyVariant?: DukptKeyVariant;
}
export const DukptDerivationAttributes = S.suspend(() =>
  S.Struct({
    KeySerialNumber: S.String,
    DukptKeyDerivationType: S.optional(DukptDerivationType),
    DukptKeyVariant: S.optional(DukptKeyVariant),
  }),
).annotations({
  identifier: "DukptDerivationAttributes",
}) as any as S.Schema<DukptDerivationAttributes>;
export interface As2805PekDerivationAttributes {
  SystemTraceAuditNumber: string;
  TransactionAmount: string;
}
export const As2805PekDerivationAttributes = S.suspend(() =>
  S.Struct({ SystemTraceAuditNumber: S.String, TransactionAmount: S.String }),
).annotations({
  identifier: "As2805PekDerivationAttributes",
}) as any as S.Schema<As2805PekDerivationAttributes>;
export interface DukptAttributes {
  KeySerialNumber: string;
  DukptDerivationType: DukptDerivationType;
}
export const DukptAttributes = S.suspend(() =>
  S.Struct({
    KeySerialNumber: S.String,
    DukptDerivationType: DukptDerivationType,
  }),
).annotations({
  identifier: "DukptAttributes",
}) as any as S.Schema<DukptAttributes>;
export type PinBlockPaddingType =
  | "NO_PADDING"
  | "ISO_IEC_7816_4"
  | (string & {});
export const PinBlockPaddingType = S.String;
export type PinBlockLengthPosition =
  | "NONE"
  | "FRONT_OF_PIN_BLOCK"
  | (string & {});
export const PinBlockLengthPosition = S.String;
export interface EncryptDataOutput {
  KeyArn: string;
  KeyCheckValue?: string;
  CipherText: string | redacted.Redacted<string>;
}
export const EncryptDataOutput = S.suspend(() =>
  S.Struct({
    KeyArn: S.String,
    KeyCheckValue: S.optional(S.String),
    CipherText: SensitiveString,
  }),
).annotations({
  identifier: "EncryptDataOutput",
}) as any as S.Schema<EncryptDataOutput>;
export interface ReEncryptDataInput {
  IncomingKeyIdentifier: string;
  OutgoingKeyIdentifier: string;
  CipherText: string | redacted.Redacted<string>;
  IncomingEncryptionAttributes: ReEncryptionAttributes;
  OutgoingEncryptionAttributes: ReEncryptionAttributes;
  IncomingWrappedKey?: WrappedKey;
  OutgoingWrappedKey?: WrappedKey;
}
export const ReEncryptDataInput = S.suspend(() =>
  S.Struct({
    IncomingKeyIdentifier: S.String.pipe(T.HttpLabel("IncomingKeyIdentifier")),
    OutgoingKeyIdentifier: S.String,
    CipherText: SensitiveString,
    IncomingEncryptionAttributes: ReEncryptionAttributes,
    OutgoingEncryptionAttributes: ReEncryptionAttributes,
    IncomingWrappedKey: S.optional(WrappedKey),
    OutgoingWrappedKey: S.optional(WrappedKey),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/keys/{IncomingKeyIdentifier}/reencrypt",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ReEncryptDataInput",
}) as any as S.Schema<ReEncryptDataInput>;
export interface VerifyMacOutput {
  KeyArn: string;
  KeyCheckValue: string;
}
export const VerifyMacOutput = S.suspend(() =>
  S.Struct({ KeyArn: S.String, KeyCheckValue: S.String }),
).annotations({
  identifier: "VerifyMacOutput",
}) as any as S.Schema<VerifyMacOutput>;
export interface KekValidationRequest {
  DeriveKeyAlgorithm: SymmetricKeyAlgorithm;
}
export const KekValidationRequest = S.suspend(() =>
  S.Struct({ DeriveKeyAlgorithm: SymmetricKeyAlgorithm }),
).annotations({
  identifier: "KekValidationRequest",
}) as any as S.Schema<KekValidationRequest>;
export interface KekValidationResponse {
  RandomKeySend: string | redacted.Redacted<string>;
}
export const KekValidationResponse = S.suspend(() =>
  S.Struct({ RandomKeySend: SensitiveString }),
).annotations({
  identifier: "KekValidationResponse",
}) as any as S.Schema<KekValidationResponse>;
export interface AmexCardSecurityCodeVersion1 {
  CardExpiryDate: string | redacted.Redacted<string>;
}
export const AmexCardSecurityCodeVersion1 = S.suspend(() =>
  S.Struct({ CardExpiryDate: SensitiveString }),
).annotations({
  identifier: "AmexCardSecurityCodeVersion1",
}) as any as S.Schema<AmexCardSecurityCodeVersion1>;
export interface AmexCardSecurityCodeVersion2 {
  CardExpiryDate: string | redacted.Redacted<string>;
  ServiceCode: string | redacted.Redacted<string>;
}
export const AmexCardSecurityCodeVersion2 = S.suspend(() =>
  S.Struct({ CardExpiryDate: SensitiveString, ServiceCode: SensitiveString }),
).annotations({
  identifier: "AmexCardSecurityCodeVersion2",
}) as any as S.Schema<AmexCardSecurityCodeVersion2>;
export interface CardVerificationValue1 {
  CardExpiryDate: string | redacted.Redacted<string>;
  ServiceCode: string | redacted.Redacted<string>;
}
export const CardVerificationValue1 = S.suspend(() =>
  S.Struct({ CardExpiryDate: SensitiveString, ServiceCode: SensitiveString }),
).annotations({
  identifier: "CardVerificationValue1",
}) as any as S.Schema<CardVerificationValue1>;
export interface CardVerificationValue2 {
  CardExpiryDate: string | redacted.Redacted<string>;
}
export const CardVerificationValue2 = S.suspend(() =>
  S.Struct({ CardExpiryDate: SensitiveString }),
).annotations({
  identifier: "CardVerificationValue2",
}) as any as S.Schema<CardVerificationValue2>;
export interface CardHolderVerificationValue {
  UnpredictableNumber: string;
  PanSequenceNumber: string;
  ApplicationTransactionCounter: string;
}
export const CardHolderVerificationValue = S.suspend(() =>
  S.Struct({
    UnpredictableNumber: S.String,
    PanSequenceNumber: S.String,
    ApplicationTransactionCounter: S.String,
  }),
).annotations({
  identifier: "CardHolderVerificationValue",
}) as any as S.Schema<CardHolderVerificationValue>;
export interface DynamicCardVerificationCode {
  UnpredictableNumber: string;
  PanSequenceNumber: string;
  ApplicationTransactionCounter: string;
  TrackData: string | redacted.Redacted<string>;
}
export const DynamicCardVerificationCode = S.suspend(() =>
  S.Struct({
    UnpredictableNumber: S.String,
    PanSequenceNumber: S.String,
    ApplicationTransactionCounter: S.String,
    TrackData: SensitiveString,
  }),
).annotations({
  identifier: "DynamicCardVerificationCode",
}) as any as S.Schema<DynamicCardVerificationCode>;
export interface DynamicCardVerificationValue {
  PanSequenceNumber: string;
  CardExpiryDate: string | redacted.Redacted<string>;
  ServiceCode: string | redacted.Redacted<string>;
  ApplicationTransactionCounter: string;
}
export const DynamicCardVerificationValue = S.suspend(() =>
  S.Struct({
    PanSequenceNumber: S.String,
    CardExpiryDate: SensitiveString,
    ServiceCode: SensitiveString,
    ApplicationTransactionCounter: S.String,
  }),
).annotations({
  identifier: "DynamicCardVerificationValue",
}) as any as S.Schema<DynamicCardVerificationValue>;
export interface EmvCommonAttributes {
  MajorKeyDerivationMode: MajorKeyDerivationMode;
  PrimaryAccountNumber: string | redacted.Redacted<string>;
  PanSequenceNumber: string;
  ApplicationCryptogram: string | redacted.Redacted<string>;
  Mode: EmvEncryptionMode;
  PinBlockPaddingType: PinBlockPaddingType;
  PinBlockLengthPosition: PinBlockLengthPosition;
}
export const EmvCommonAttributes = S.suspend(() =>
  S.Struct({
    MajorKeyDerivationMode: MajorKeyDerivationMode,
    PrimaryAccountNumber: SensitiveString,
    PanSequenceNumber: S.String,
    ApplicationCryptogram: SensitiveString,
    Mode: EmvEncryptionMode,
    PinBlockPaddingType: PinBlockPaddingType,
    PinBlockLengthPosition: PinBlockLengthPosition,
  }),
).annotations({
  identifier: "EmvCommonAttributes",
}) as any as S.Schema<EmvCommonAttributes>;
export interface CurrentPinAttributes {
  CurrentPinPekIdentifier: string;
  CurrentEncryptedPinBlock: string | redacted.Redacted<string>;
}
export const CurrentPinAttributes = S.suspend(() =>
  S.Struct({
    CurrentPinPekIdentifier: S.String,
    CurrentEncryptedPinBlock: SensitiveString,
  }),
).annotations({
  identifier: "CurrentPinAttributes",
}) as any as S.Schema<CurrentPinAttributes>;
export interface VisaAttributes {
  MajorKeyDerivationMode: MajorKeyDerivationMode;
  PrimaryAccountNumber: string | redacted.Redacted<string>;
  PanSequenceNumber: string;
  ApplicationTransactionCounter: string;
  AuthorizationRequestKeyIdentifier: string;
  CurrentPinAttributes?: CurrentPinAttributes;
}
export const VisaAttributes = S.suspend(() =>
  S.Struct({
    MajorKeyDerivationMode: MajorKeyDerivationMode,
    PrimaryAccountNumber: SensitiveString,
    PanSequenceNumber: S.String,
    ApplicationTransactionCounter: S.String,
    AuthorizationRequestKeyIdentifier: S.String,
    CurrentPinAttributes: S.optional(CurrentPinAttributes),
  }),
).annotations({
  identifier: "VisaAttributes",
}) as any as S.Schema<VisaAttributes>;
export interface Emv2000Attributes {
  MajorKeyDerivationMode: MajorKeyDerivationMode;
  PrimaryAccountNumber: string | redacted.Redacted<string>;
  PanSequenceNumber: string;
  ApplicationTransactionCounter: string;
}
export const Emv2000Attributes = S.suspend(() =>
  S.Struct({
    MajorKeyDerivationMode: MajorKeyDerivationMode,
    PrimaryAccountNumber: SensitiveString,
    PanSequenceNumber: S.String,
    ApplicationTransactionCounter: S.String,
  }),
).annotations({
  identifier: "Emv2000Attributes",
}) as any as S.Schema<Emv2000Attributes>;
export interface MasterCardAttributes {
  MajorKeyDerivationMode: MajorKeyDerivationMode;
  PrimaryAccountNumber: string | redacted.Redacted<string>;
  PanSequenceNumber: string;
  ApplicationCryptogram: string | redacted.Redacted<string>;
}
export const MasterCardAttributes = S.suspend(() =>
  S.Struct({
    MajorKeyDerivationMode: MajorKeyDerivationMode,
    PrimaryAccountNumber: SensitiveString,
    PanSequenceNumber: S.String,
    ApplicationCryptogram: SensitiveString,
  }),
).annotations({
  identifier: "MasterCardAttributes",
}) as any as S.Schema<MasterCardAttributes>;
export interface VisaPin {
  PinVerificationKeyIndex: number;
}
export const VisaPin = S.suspend(() =>
  S.Struct({ PinVerificationKeyIndex: S.Number }),
).annotations({ identifier: "VisaPin" }) as any as S.Schema<VisaPin>;
export interface VisaPinVerificationValue {
  EncryptedPinBlock: string | redacted.Redacted<string>;
  PinVerificationKeyIndex: number;
}
export const VisaPinVerificationValue = S.suspend(() =>
  S.Struct({
    EncryptedPinBlock: SensitiveString,
    PinVerificationKeyIndex: S.Number,
  }),
).annotations({
  identifier: "VisaPinVerificationValue",
}) as any as S.Schema<VisaPinVerificationValue>;
export interface Ibm3624PinOffset {
  EncryptedPinBlock: string | redacted.Redacted<string>;
  DecimalizationTable: string | redacted.Redacted<string>;
  PinValidationDataPadCharacter: string;
  PinValidationData: string | redacted.Redacted<string>;
}
export const Ibm3624PinOffset = S.suspend(() =>
  S.Struct({
    EncryptedPinBlock: SensitiveString,
    DecimalizationTable: SensitiveString,
    PinValidationDataPadCharacter: S.String,
    PinValidationData: SensitiveString,
  }),
).annotations({
  identifier: "Ibm3624PinOffset",
}) as any as S.Schema<Ibm3624PinOffset>;
export interface Ibm3624NaturalPin {
  DecimalizationTable: string | redacted.Redacted<string>;
  PinValidationDataPadCharacter: string;
  PinValidationData: string | redacted.Redacted<string>;
}
export const Ibm3624NaturalPin = S.suspend(() =>
  S.Struct({
    DecimalizationTable: SensitiveString,
    PinValidationDataPadCharacter: S.String,
    PinValidationData: SensitiveString,
  }),
).annotations({
  identifier: "Ibm3624NaturalPin",
}) as any as S.Schema<Ibm3624NaturalPin>;
export interface Ibm3624RandomPin {
  DecimalizationTable: string | redacted.Redacted<string>;
  PinValidationDataPadCharacter: string;
  PinValidationData: string | redacted.Redacted<string>;
}
export const Ibm3624RandomPin = S.suspend(() =>
  S.Struct({
    DecimalizationTable: SensitiveString,
    PinValidationDataPadCharacter: S.String,
    PinValidationData: SensitiveString,
  }),
).annotations({
  identifier: "Ibm3624RandomPin",
}) as any as S.Schema<Ibm3624RandomPin>;
export interface Ibm3624PinFromOffset {
  DecimalizationTable: string | redacted.Redacted<string>;
  PinValidationDataPadCharacter: string;
  PinValidationData: string | redacted.Redacted<string>;
  PinOffset: string | redacted.Redacted<string>;
}
export const Ibm3624PinFromOffset = S.suspend(() =>
  S.Struct({
    DecimalizationTable: SensitiveString,
    PinValidationDataPadCharacter: S.String,
    PinValidationData: SensitiveString,
    PinOffset: SensitiveString,
  }),
).annotations({
  identifier: "Ibm3624PinFromOffset",
}) as any as S.Schema<Ibm3624PinFromOffset>;
export interface OutgoingTr31KeyBlock {
  WrappingKeyIdentifier: string;
}
export const OutgoingTr31KeyBlock = S.suspend(() =>
  S.Struct({ WrappingKeyIdentifier: S.String }),
).annotations({
  identifier: "OutgoingTr31KeyBlock",
}) as any as S.Schema<OutgoingTr31KeyBlock>;
export interface TranslationPinDataIsoFormat034 {
  PrimaryAccountNumber: string | redacted.Redacted<string>;
}
export const TranslationPinDataIsoFormat034 = S.suspend(() =>
  S.Struct({ PrimaryAccountNumber: SensitiveString }),
).annotations({
  identifier: "TranslationPinDataIsoFormat034",
}) as any as S.Schema<TranslationPinDataIsoFormat034>;
export interface TranslationPinDataAs2805Format0 {
  PrimaryAccountNumber: string | redacted.Redacted<string>;
}
export const TranslationPinDataAs2805Format0 = S.suspend(() =>
  S.Struct({ PrimaryAccountNumber: SensitiveString }),
).annotations({
  identifier: "TranslationPinDataAs2805Format0",
}) as any as S.Schema<TranslationPinDataAs2805Format0>;
export interface SessionKeyEmvCommon {
  PrimaryAccountNumber: string | redacted.Redacted<string>;
  PanSequenceNumber: string;
  ApplicationTransactionCounter: string;
}
export const SessionKeyEmvCommon = S.suspend(() =>
  S.Struct({
    PrimaryAccountNumber: SensitiveString,
    PanSequenceNumber: S.String,
    ApplicationTransactionCounter: S.String,
  }),
).annotations({
  identifier: "SessionKeyEmvCommon",
}) as any as S.Schema<SessionKeyEmvCommon>;
export interface SessionKeyMastercard {
  PrimaryAccountNumber: string | redacted.Redacted<string>;
  PanSequenceNumber: string;
  ApplicationTransactionCounter: string;
  UnpredictableNumber: string;
}
export const SessionKeyMastercard = S.suspend(() =>
  S.Struct({
    PrimaryAccountNumber: SensitiveString,
    PanSequenceNumber: S.String,
    ApplicationTransactionCounter: S.String,
    UnpredictableNumber: S.String,
  }),
).annotations({
  identifier: "SessionKeyMastercard",
}) as any as S.Schema<SessionKeyMastercard>;
export interface SessionKeyEmv2000 {
  PrimaryAccountNumber: string | redacted.Redacted<string>;
  PanSequenceNumber: string;
  ApplicationTransactionCounter: string;
}
export const SessionKeyEmv2000 = S.suspend(() =>
  S.Struct({
    PrimaryAccountNumber: SensitiveString,
    PanSequenceNumber: S.String,
    ApplicationTransactionCounter: S.String,
  }),
).annotations({
  identifier: "SessionKeyEmv2000",
}) as any as S.Schema<SessionKeyEmv2000>;
export interface SessionKeyAmex {
  PrimaryAccountNumber: string | redacted.Redacted<string>;
  PanSequenceNumber: string;
}
export const SessionKeyAmex = S.suspend(() =>
  S.Struct({
    PrimaryAccountNumber: SensitiveString,
    PanSequenceNumber: S.String,
  }),
).annotations({
  identifier: "SessionKeyAmex",
}) as any as S.Schema<SessionKeyAmex>;
export interface SessionKeyVisa {
  PrimaryAccountNumber: string | redacted.Redacted<string>;
  PanSequenceNumber: string;
}
export const SessionKeyVisa = S.suspend(() =>
  S.Struct({
    PrimaryAccountNumber: SensitiveString,
    PanSequenceNumber: S.String,
  }),
).annotations({
  identifier: "SessionKeyVisa",
}) as any as S.Schema<SessionKeyVisa>;
export interface CryptogramVerificationArpcMethod1 {
  AuthResponseCode: string;
}
export const CryptogramVerificationArpcMethod1 = S.suspend(() =>
  S.Struct({ AuthResponseCode: S.String }),
).annotations({
  identifier: "CryptogramVerificationArpcMethod1",
}) as any as S.Schema<CryptogramVerificationArpcMethod1>;
export interface CryptogramVerificationArpcMethod2 {
  CardStatusUpdate: string;
  ProprietaryAuthenticationData?: string | redacted.Redacted<string>;
}
export const CryptogramVerificationArpcMethod2 = S.suspend(() =>
  S.Struct({
    CardStatusUpdate: S.String,
    ProprietaryAuthenticationData: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "CryptogramVerificationArpcMethod2",
}) as any as S.Schema<CryptogramVerificationArpcMethod2>;
export interface DiscoverDynamicCardVerificationCode {
  CardExpiryDate: string | redacted.Redacted<string>;
  UnpredictableNumber: string;
  ApplicationTransactionCounter: string;
}
export const DiscoverDynamicCardVerificationCode = S.suspend(() =>
  S.Struct({
    CardExpiryDate: SensitiveString,
    UnpredictableNumber: S.String,
    ApplicationTransactionCounter: S.String,
  }),
).annotations({
  identifier: "DiscoverDynamicCardVerificationCode",
}) as any as S.Schema<DiscoverDynamicCardVerificationCode>;
export interface VisaPinVerification {
  PinVerificationKeyIndex: number;
  VerificationValue: string | redacted.Redacted<string>;
}
export const VisaPinVerification = S.suspend(() =>
  S.Struct({
    PinVerificationKeyIndex: S.Number,
    VerificationValue: SensitiveString,
  }),
).annotations({
  identifier: "VisaPinVerification",
}) as any as S.Schema<VisaPinVerification>;
export interface Ibm3624PinVerification {
  DecimalizationTable: string | redacted.Redacted<string>;
  PinValidationDataPadCharacter: string;
  PinValidationData: string | redacted.Redacted<string>;
  PinOffset: string | redacted.Redacted<string>;
}
export const Ibm3624PinVerification = S.suspend(() =>
  S.Struct({
    DecimalizationTable: SensitiveString,
    PinValidationDataPadCharacter: S.String,
    PinValidationData: SensitiveString,
    PinOffset: SensitiveString,
  }),
).annotations({
  identifier: "Ibm3624PinVerification",
}) as any as S.Schema<Ibm3624PinVerification>;
export type As2805KekValidationType =
  | {
      KekValidationRequest: KekValidationRequest;
      KekValidationResponse?: never;
    }
  | {
      KekValidationRequest?: never;
      KekValidationResponse: KekValidationResponse;
    };
export const As2805KekValidationType = S.Union(
  S.Struct({ KekValidationRequest: KekValidationRequest }),
  S.Struct({ KekValidationResponse: KekValidationResponse }),
);
export type CardGenerationAttributes =
  | {
      AmexCardSecurityCodeVersion1: AmexCardSecurityCodeVersion1;
      AmexCardSecurityCodeVersion2?: never;
      CardVerificationValue1?: never;
      CardVerificationValue2?: never;
      CardHolderVerificationValue?: never;
      DynamicCardVerificationCode?: never;
      DynamicCardVerificationValue?: never;
    }
  | {
      AmexCardSecurityCodeVersion1?: never;
      AmexCardSecurityCodeVersion2: AmexCardSecurityCodeVersion2;
      CardVerificationValue1?: never;
      CardVerificationValue2?: never;
      CardHolderVerificationValue?: never;
      DynamicCardVerificationCode?: never;
      DynamicCardVerificationValue?: never;
    }
  | {
      AmexCardSecurityCodeVersion1?: never;
      AmexCardSecurityCodeVersion2?: never;
      CardVerificationValue1: CardVerificationValue1;
      CardVerificationValue2?: never;
      CardHolderVerificationValue?: never;
      DynamicCardVerificationCode?: never;
      DynamicCardVerificationValue?: never;
    }
  | {
      AmexCardSecurityCodeVersion1?: never;
      AmexCardSecurityCodeVersion2?: never;
      CardVerificationValue1?: never;
      CardVerificationValue2: CardVerificationValue2;
      CardHolderVerificationValue?: never;
      DynamicCardVerificationCode?: never;
      DynamicCardVerificationValue?: never;
    }
  | {
      AmexCardSecurityCodeVersion1?: never;
      AmexCardSecurityCodeVersion2?: never;
      CardVerificationValue1?: never;
      CardVerificationValue2?: never;
      CardHolderVerificationValue: CardHolderVerificationValue;
      DynamicCardVerificationCode?: never;
      DynamicCardVerificationValue?: never;
    }
  | {
      AmexCardSecurityCodeVersion1?: never;
      AmexCardSecurityCodeVersion2?: never;
      CardVerificationValue1?: never;
      CardVerificationValue2?: never;
      CardHolderVerificationValue?: never;
      DynamicCardVerificationCode: DynamicCardVerificationCode;
      DynamicCardVerificationValue?: never;
    }
  | {
      AmexCardSecurityCodeVersion1?: never;
      AmexCardSecurityCodeVersion2?: never;
      CardVerificationValue1?: never;
      CardVerificationValue2?: never;
      CardHolderVerificationValue?: never;
      DynamicCardVerificationCode?: never;
      DynamicCardVerificationValue: DynamicCardVerificationValue;
    };
export const CardGenerationAttributes = S.Union(
  S.Struct({ AmexCardSecurityCodeVersion1: AmexCardSecurityCodeVersion1 }),
  S.Struct({ AmexCardSecurityCodeVersion2: AmexCardSecurityCodeVersion2 }),
  S.Struct({ CardVerificationValue1: CardVerificationValue1 }),
  S.Struct({ CardVerificationValue2: CardVerificationValue2 }),
  S.Struct({ CardHolderVerificationValue: CardHolderVerificationValue }),
  S.Struct({ DynamicCardVerificationCode: DynamicCardVerificationCode }),
  S.Struct({ DynamicCardVerificationValue: DynamicCardVerificationValue }),
);
export type PinGenerationAttributes =
  | {
      VisaPin: VisaPin;
      VisaPinVerificationValue?: never;
      Ibm3624PinOffset?: never;
      Ibm3624NaturalPin?: never;
      Ibm3624RandomPin?: never;
      Ibm3624PinFromOffset?: never;
    }
  | {
      VisaPin?: never;
      VisaPinVerificationValue: VisaPinVerificationValue;
      Ibm3624PinOffset?: never;
      Ibm3624NaturalPin?: never;
      Ibm3624RandomPin?: never;
      Ibm3624PinFromOffset?: never;
    }
  | {
      VisaPin?: never;
      VisaPinVerificationValue?: never;
      Ibm3624PinOffset: Ibm3624PinOffset;
      Ibm3624NaturalPin?: never;
      Ibm3624RandomPin?: never;
      Ibm3624PinFromOffset?: never;
    }
  | {
      VisaPin?: never;
      VisaPinVerificationValue?: never;
      Ibm3624PinOffset?: never;
      Ibm3624NaturalPin: Ibm3624NaturalPin;
      Ibm3624RandomPin?: never;
      Ibm3624PinFromOffset?: never;
    }
  | {
      VisaPin?: never;
      VisaPinVerificationValue?: never;
      Ibm3624PinOffset?: never;
      Ibm3624NaturalPin?: never;
      Ibm3624RandomPin: Ibm3624RandomPin;
      Ibm3624PinFromOffset?: never;
    }
  | {
      VisaPin?: never;
      VisaPinVerificationValue?: never;
      Ibm3624PinOffset?: never;
      Ibm3624NaturalPin?: never;
      Ibm3624RandomPin?: never;
      Ibm3624PinFromOffset: Ibm3624PinFromOffset;
    };
export const PinGenerationAttributes = S.Union(
  S.Struct({ VisaPin: VisaPin }),
  S.Struct({ VisaPinVerificationValue: VisaPinVerificationValue }),
  S.Struct({ Ibm3624PinOffset: Ibm3624PinOffset }),
  S.Struct({ Ibm3624NaturalPin: Ibm3624NaturalPin }),
  S.Struct({ Ibm3624RandomPin: Ibm3624RandomPin }),
  S.Struct({ Ibm3624PinFromOffset: Ibm3624PinFromOffset }),
);
export type OutgoingKeyMaterial = { Tr31KeyBlock: OutgoingTr31KeyBlock };
export const OutgoingKeyMaterial = S.Union(
  S.Struct({ Tr31KeyBlock: OutgoingTr31KeyBlock }),
);
export type TranslationIsoFormats =
  | {
      IsoFormat0: TranslationPinDataIsoFormat034;
      IsoFormat1?: never;
      IsoFormat3?: never;
      IsoFormat4?: never;
      As2805Format0?: never;
    }
  | {
      IsoFormat0?: never;
      IsoFormat1: TranslationPinDataIsoFormat1;
      IsoFormat3?: never;
      IsoFormat4?: never;
      As2805Format0?: never;
    }
  | {
      IsoFormat0?: never;
      IsoFormat1?: never;
      IsoFormat3: TranslationPinDataIsoFormat034;
      IsoFormat4?: never;
      As2805Format0?: never;
    }
  | {
      IsoFormat0?: never;
      IsoFormat1?: never;
      IsoFormat3?: never;
      IsoFormat4: TranslationPinDataIsoFormat034;
      As2805Format0?: never;
    }
  | {
      IsoFormat0?: never;
      IsoFormat1?: never;
      IsoFormat3?: never;
      IsoFormat4?: never;
      As2805Format0: TranslationPinDataAs2805Format0;
    };
export const TranslationIsoFormats = S.Union(
  S.Struct({ IsoFormat0: TranslationPinDataIsoFormat034 }),
  S.Struct({ IsoFormat1: TranslationPinDataIsoFormat1 }),
  S.Struct({ IsoFormat3: TranslationPinDataIsoFormat034 }),
  S.Struct({ IsoFormat4: TranslationPinDataIsoFormat034 }),
  S.Struct({ As2805Format0: TranslationPinDataAs2805Format0 }),
);
export type SessionKeyDerivation =
  | {
      EmvCommon: SessionKeyEmvCommon;
      Mastercard?: never;
      Emv2000?: never;
      Amex?: never;
      Visa?: never;
    }
  | {
      EmvCommon?: never;
      Mastercard: SessionKeyMastercard;
      Emv2000?: never;
      Amex?: never;
      Visa?: never;
    }
  | {
      EmvCommon?: never;
      Mastercard?: never;
      Emv2000: SessionKeyEmv2000;
      Amex?: never;
      Visa?: never;
    }
  | {
      EmvCommon?: never;
      Mastercard?: never;
      Emv2000?: never;
      Amex: SessionKeyAmex;
      Visa?: never;
    }
  | {
      EmvCommon?: never;
      Mastercard?: never;
      Emv2000?: never;
      Amex?: never;
      Visa: SessionKeyVisa;
    };
export const SessionKeyDerivation = S.Union(
  S.Struct({ EmvCommon: SessionKeyEmvCommon }),
  S.Struct({ Mastercard: SessionKeyMastercard }),
  S.Struct({ Emv2000: SessionKeyEmv2000 }),
  S.Struct({ Amex: SessionKeyAmex }),
  S.Struct({ Visa: SessionKeyVisa }),
);
export type CryptogramAuthResponse =
  | { ArpcMethod1: CryptogramVerificationArpcMethod1; ArpcMethod2?: never }
  | { ArpcMethod1?: never; ArpcMethod2: CryptogramVerificationArpcMethod2 };
export const CryptogramAuthResponse = S.Union(
  S.Struct({ ArpcMethod1: CryptogramVerificationArpcMethod1 }),
  S.Struct({ ArpcMethod2: CryptogramVerificationArpcMethod2 }),
);
export type CardVerificationAttributes =
  | {
      AmexCardSecurityCodeVersion1: AmexCardSecurityCodeVersion1;
      AmexCardSecurityCodeVersion2?: never;
      CardVerificationValue1?: never;
      CardVerificationValue2?: never;
      CardHolderVerificationValue?: never;
      DynamicCardVerificationCode?: never;
      DynamicCardVerificationValue?: never;
      DiscoverDynamicCardVerificationCode?: never;
    }
  | {
      AmexCardSecurityCodeVersion1?: never;
      AmexCardSecurityCodeVersion2: AmexCardSecurityCodeVersion2;
      CardVerificationValue1?: never;
      CardVerificationValue2?: never;
      CardHolderVerificationValue?: never;
      DynamicCardVerificationCode?: never;
      DynamicCardVerificationValue?: never;
      DiscoverDynamicCardVerificationCode?: never;
    }
  | {
      AmexCardSecurityCodeVersion1?: never;
      AmexCardSecurityCodeVersion2?: never;
      CardVerificationValue1: CardVerificationValue1;
      CardVerificationValue2?: never;
      CardHolderVerificationValue?: never;
      DynamicCardVerificationCode?: never;
      DynamicCardVerificationValue?: never;
      DiscoverDynamicCardVerificationCode?: never;
    }
  | {
      AmexCardSecurityCodeVersion1?: never;
      AmexCardSecurityCodeVersion2?: never;
      CardVerificationValue1?: never;
      CardVerificationValue2: CardVerificationValue2;
      CardHolderVerificationValue?: never;
      DynamicCardVerificationCode?: never;
      DynamicCardVerificationValue?: never;
      DiscoverDynamicCardVerificationCode?: never;
    }
  | {
      AmexCardSecurityCodeVersion1?: never;
      AmexCardSecurityCodeVersion2?: never;
      CardVerificationValue1?: never;
      CardVerificationValue2?: never;
      CardHolderVerificationValue: CardHolderVerificationValue;
      DynamicCardVerificationCode?: never;
      DynamicCardVerificationValue?: never;
      DiscoverDynamicCardVerificationCode?: never;
    }
  | {
      AmexCardSecurityCodeVersion1?: never;
      AmexCardSecurityCodeVersion2?: never;
      CardVerificationValue1?: never;
      CardVerificationValue2?: never;
      CardHolderVerificationValue?: never;
      DynamicCardVerificationCode: DynamicCardVerificationCode;
      DynamicCardVerificationValue?: never;
      DiscoverDynamicCardVerificationCode?: never;
    }
  | {
      AmexCardSecurityCodeVersion1?: never;
      AmexCardSecurityCodeVersion2?: never;
      CardVerificationValue1?: never;
      CardVerificationValue2?: never;
      CardHolderVerificationValue?: never;
      DynamicCardVerificationCode?: never;
      DynamicCardVerificationValue: DynamicCardVerificationValue;
      DiscoverDynamicCardVerificationCode?: never;
    }
  | {
      AmexCardSecurityCodeVersion1?: never;
      AmexCardSecurityCodeVersion2?: never;
      CardVerificationValue1?: never;
      CardVerificationValue2?: never;
      CardHolderVerificationValue?: never;
      DynamicCardVerificationCode?: never;
      DynamicCardVerificationValue?: never;
      DiscoverDynamicCardVerificationCode: DiscoverDynamicCardVerificationCode;
    };
export const CardVerificationAttributes = S.Union(
  S.Struct({ AmexCardSecurityCodeVersion1: AmexCardSecurityCodeVersion1 }),
  S.Struct({ AmexCardSecurityCodeVersion2: AmexCardSecurityCodeVersion2 }),
  S.Struct({ CardVerificationValue1: CardVerificationValue1 }),
  S.Struct({ CardVerificationValue2: CardVerificationValue2 }),
  S.Struct({ CardHolderVerificationValue: CardHolderVerificationValue }),
  S.Struct({ DynamicCardVerificationCode: DynamicCardVerificationCode }),
  S.Struct({ DynamicCardVerificationValue: DynamicCardVerificationValue }),
  S.Struct({
    DiscoverDynamicCardVerificationCode: DiscoverDynamicCardVerificationCode,
  }),
);
export type PinVerificationAttributes =
  | { VisaPin: VisaPinVerification; Ibm3624Pin?: never }
  | { VisaPin?: never; Ibm3624Pin: Ibm3624PinVerification };
export const PinVerificationAttributes = S.Union(
  S.Struct({ VisaPin: VisaPinVerification }),
  S.Struct({ Ibm3624Pin: Ibm3624PinVerification }),
);
export type DiffieHellmanDerivationData = { SharedInformation: string };
export const DiffieHellmanDerivationData = S.Union(
  S.Struct({ SharedInformation: S.String }),
);
export interface GenerateAs2805KekValidationInput {
  KeyIdentifier: string;
  KekValidationType: As2805KekValidationType;
  RandomKeySendVariantMask: RandomKeySendVariantMask;
}
export const GenerateAs2805KekValidationInput = S.suspend(() =>
  S.Struct({
    KeyIdentifier: S.String,
    KekValidationType: As2805KekValidationType,
    RandomKeySendVariantMask: RandomKeySendVariantMask,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/as2805kekvalidation/generate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GenerateAs2805KekValidationInput",
}) as any as S.Schema<GenerateAs2805KekValidationInput>;
export interface GenerateCardValidationDataInput {
  KeyIdentifier: string;
  PrimaryAccountNumber: string | redacted.Redacted<string>;
  GenerationAttributes: CardGenerationAttributes;
  ValidationDataLength?: number;
}
export const GenerateCardValidationDataInput = S.suspend(() =>
  S.Struct({
    KeyIdentifier: S.String,
    PrimaryAccountNumber: SensitiveString,
    GenerationAttributes: CardGenerationAttributes,
    ValidationDataLength: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/cardvalidationdata/generate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GenerateCardValidationDataInput",
}) as any as S.Schema<GenerateCardValidationDataInput>;
export interface GeneratePinDataInput {
  GenerationKeyIdentifier: string;
  EncryptionKeyIdentifier: string;
  GenerationAttributes: PinGenerationAttributes;
  PinDataLength?: number;
  PrimaryAccountNumber?: string | redacted.Redacted<string>;
  PinBlockFormat: PinBlockFormatForPinData;
  EncryptionWrappedKey?: WrappedKey;
}
export const GeneratePinDataInput = S.suspend(() =>
  S.Struct({
    GenerationKeyIdentifier: S.String,
    EncryptionKeyIdentifier: S.String,
    GenerationAttributes: PinGenerationAttributes,
    PinDataLength: S.optional(S.Number),
    PrimaryAccountNumber: S.optional(SensitiveString),
    PinBlockFormat: PinBlockFormatForPinData,
    EncryptionWrappedKey: S.optional(WrappedKey),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/pindata/generate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GeneratePinDataInput",
}) as any as S.Schema<GeneratePinDataInput>;
export interface ReEncryptDataOutput {
  KeyArn: string;
  KeyCheckValue: string;
  CipherText: string | redacted.Redacted<string>;
}
export const ReEncryptDataOutput = S.suspend(() =>
  S.Struct({
    KeyArn: S.String,
    KeyCheckValue: S.String,
    CipherText: SensitiveString,
  }),
).annotations({
  identifier: "ReEncryptDataOutput",
}) as any as S.Schema<ReEncryptDataOutput>;
export interface TranslatePinDataInput {
  IncomingKeyIdentifier: string;
  OutgoingKeyIdentifier: string;
  IncomingTranslationAttributes: TranslationIsoFormats;
  OutgoingTranslationAttributes: TranslationIsoFormats;
  EncryptedPinBlock: string | redacted.Redacted<string>;
  IncomingDukptAttributes?: DukptDerivationAttributes;
  OutgoingDukptAttributes?: DukptDerivationAttributes;
  IncomingWrappedKey?: WrappedKey;
  OutgoingWrappedKey?: WrappedKey;
  IncomingAs2805Attributes?: As2805PekDerivationAttributes;
}
export const TranslatePinDataInput = S.suspend(() =>
  S.Struct({
    IncomingKeyIdentifier: S.String,
    OutgoingKeyIdentifier: S.String,
    IncomingTranslationAttributes: TranslationIsoFormats,
    OutgoingTranslationAttributes: TranslationIsoFormats,
    EncryptedPinBlock: SensitiveString,
    IncomingDukptAttributes: S.optional(DukptDerivationAttributes),
    OutgoingDukptAttributes: S.optional(DukptDerivationAttributes),
    IncomingWrappedKey: S.optional(WrappedKey),
    OutgoingWrappedKey: S.optional(WrappedKey),
    IncomingAs2805Attributes: S.optional(As2805PekDerivationAttributes),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/pindata/translate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TranslatePinDataInput",
}) as any as S.Schema<TranslatePinDataInput>;
export interface VerifyAuthRequestCryptogramInput {
  KeyIdentifier: string;
  TransactionData: string | redacted.Redacted<string>;
  AuthRequestCryptogram: string | redacted.Redacted<string>;
  MajorKeyDerivationMode: MajorKeyDerivationMode;
  SessionKeyDerivationAttributes: SessionKeyDerivation;
  AuthResponseAttributes?: CryptogramAuthResponse;
}
export const VerifyAuthRequestCryptogramInput = S.suspend(() =>
  S.Struct({
    KeyIdentifier: S.String,
    TransactionData: SensitiveString,
    AuthRequestCryptogram: SensitiveString,
    MajorKeyDerivationMode: MajorKeyDerivationMode,
    SessionKeyDerivationAttributes: SessionKeyDerivation,
    AuthResponseAttributes: S.optional(CryptogramAuthResponse),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/cryptogram/verify" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "VerifyAuthRequestCryptogramInput",
}) as any as S.Schema<VerifyAuthRequestCryptogramInput>;
export interface VerifyCardValidationDataInput {
  KeyIdentifier: string;
  PrimaryAccountNumber: string | redacted.Redacted<string>;
  VerificationAttributes: CardVerificationAttributes;
  ValidationData: string | redacted.Redacted<string>;
}
export const VerifyCardValidationDataInput = S.suspend(() =>
  S.Struct({
    KeyIdentifier: S.String,
    PrimaryAccountNumber: SensitiveString,
    VerificationAttributes: CardVerificationAttributes,
    ValidationData: SensitiveString,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/cardvalidationdata/verify" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "VerifyCardValidationDataInput",
}) as any as S.Schema<VerifyCardValidationDataInput>;
export interface VerifyPinDataInput {
  VerificationKeyIdentifier: string;
  EncryptionKeyIdentifier: string;
  VerificationAttributes: PinVerificationAttributes;
  EncryptedPinBlock: string | redacted.Redacted<string>;
  PrimaryAccountNumber?: string | redacted.Redacted<string>;
  PinBlockFormat: PinBlockFormatForPinData;
  PinDataLength?: number;
  DukptAttributes?: DukptAttributes;
  EncryptionWrappedKey?: WrappedKey;
}
export const VerifyPinDataInput = S.suspend(() =>
  S.Struct({
    VerificationKeyIdentifier: S.String,
    EncryptionKeyIdentifier: S.String,
    VerificationAttributes: PinVerificationAttributes,
    EncryptedPinBlock: SensitiveString,
    PrimaryAccountNumber: S.optional(SensitiveString),
    PinBlockFormat: PinBlockFormatForPinData,
    PinDataLength: S.optional(S.Number),
    DukptAttributes: S.optional(DukptAttributes),
    EncryptionWrappedKey: S.optional(WrappedKey),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/pindata/verify" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "VerifyPinDataInput",
}) as any as S.Schema<VerifyPinDataInput>;
export interface AmexAttributes {
  MajorKeyDerivationMode: MajorKeyDerivationMode;
  PrimaryAccountNumber: string | redacted.Redacted<string>;
  PanSequenceNumber: string;
  ApplicationTransactionCounter: string;
  AuthorizationRequestKeyIdentifier: string;
  CurrentPinAttributes?: CurrentPinAttributes;
}
export const AmexAttributes = S.suspend(() =>
  S.Struct({
    MajorKeyDerivationMode: MajorKeyDerivationMode,
    PrimaryAccountNumber: SensitiveString,
    PanSequenceNumber: S.String,
    ApplicationTransactionCounter: S.String,
    AuthorizationRequestKeyIdentifier: S.String,
    CurrentPinAttributes: S.optional(CurrentPinAttributes),
  }),
).annotations({
  identifier: "AmexAttributes",
}) as any as S.Schema<AmexAttributes>;
export interface IncomingDiffieHellmanTr31KeyBlock {
  PrivateKeyIdentifier: string;
  CertificateAuthorityPublicKeyIdentifier: string;
  PublicKeyCertificate: string;
  DeriveKeyAlgorithm: SymmetricKeyAlgorithm;
  KeyDerivationFunction: KeyDerivationFunction;
  KeyDerivationHashAlgorithm: KeyDerivationHashAlgorithm;
  DerivationData: DiffieHellmanDerivationData;
  WrappedKeyBlock: string | redacted.Redacted<string>;
}
export const IncomingDiffieHellmanTr31KeyBlock = S.suspend(() =>
  S.Struct({
    PrivateKeyIdentifier: S.String,
    CertificateAuthorityPublicKeyIdentifier: S.String,
    PublicKeyCertificate: S.String,
    DeriveKeyAlgorithm: SymmetricKeyAlgorithm,
    KeyDerivationFunction: KeyDerivationFunction,
    KeyDerivationHashAlgorithm: KeyDerivationHashAlgorithm,
    DerivationData: DiffieHellmanDerivationData,
    WrappedKeyBlock: SensitiveString,
  }),
).annotations({
  identifier: "IncomingDiffieHellmanTr31KeyBlock",
}) as any as S.Schema<IncomingDiffieHellmanTr31KeyBlock>;
export type DerivationMethodAttributes =
  | {
      EmvCommon: EmvCommonAttributes;
      Amex?: never;
      Visa?: never;
      Emv2000?: never;
      Mastercard?: never;
    }
  | {
      EmvCommon?: never;
      Amex: AmexAttributes;
      Visa?: never;
      Emv2000?: never;
      Mastercard?: never;
    }
  | {
      EmvCommon?: never;
      Amex?: never;
      Visa: VisaAttributes;
      Emv2000?: never;
      Mastercard?: never;
    }
  | {
      EmvCommon?: never;
      Amex?: never;
      Visa?: never;
      Emv2000: Emv2000Attributes;
      Mastercard?: never;
    }
  | {
      EmvCommon?: never;
      Amex?: never;
      Visa?: never;
      Emv2000?: never;
      Mastercard: MasterCardAttributes;
    };
export const DerivationMethodAttributes = S.Union(
  S.Struct({ EmvCommon: EmvCommonAttributes }),
  S.Struct({ Amex: AmexAttributes }),
  S.Struct({ Visa: VisaAttributes }),
  S.Struct({ Emv2000: Emv2000Attributes }),
  S.Struct({ Mastercard: MasterCardAttributes }),
);
export type IncomingKeyMaterial = {
  DiffieHellmanTr31KeyBlock: IncomingDiffieHellmanTr31KeyBlock;
};
export const IncomingKeyMaterial = S.Union(
  S.Struct({ DiffieHellmanTr31KeyBlock: IncomingDiffieHellmanTr31KeyBlock }),
);
export interface DecryptDataInput {
  KeyIdentifier: string;
  CipherText: string | redacted.Redacted<string>;
  DecryptionAttributes: EncryptionDecryptionAttributes;
  WrappedKey?: WrappedKey;
}
export const DecryptDataInput = S.suspend(() =>
  S.Struct({
    KeyIdentifier: S.String.pipe(T.HttpLabel("KeyIdentifier")),
    CipherText: SensitiveString,
    DecryptionAttributes: EncryptionDecryptionAttributes,
    WrappedKey: S.optional(WrappedKey),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/keys/{KeyIdentifier}/decrypt" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DecryptDataInput",
}) as any as S.Schema<DecryptDataInput>;
export interface GenerateAs2805KekValidationOutput {
  KeyArn: string;
  KeyCheckValue: string;
  RandomKeySend: string | redacted.Redacted<string>;
  RandomKeyReceive: string | redacted.Redacted<string>;
}
export const GenerateAs2805KekValidationOutput = S.suspend(() =>
  S.Struct({
    KeyArn: S.String,
    KeyCheckValue: S.String,
    RandomKeySend: SensitiveString,
    RandomKeyReceive: SensitiveString,
  }),
).annotations({
  identifier: "GenerateAs2805KekValidationOutput",
}) as any as S.Schema<GenerateAs2805KekValidationOutput>;
export interface GenerateCardValidationDataOutput {
  KeyArn: string;
  KeyCheckValue: string;
  ValidationData: string | redacted.Redacted<string>;
}
export const GenerateCardValidationDataOutput = S.suspend(() =>
  S.Struct({
    KeyArn: S.String,
    KeyCheckValue: S.String,
    ValidationData: SensitiveString,
  }),
).annotations({
  identifier: "GenerateCardValidationDataOutput",
}) as any as S.Schema<GenerateCardValidationDataOutput>;
export interface GenerateMacInput {
  KeyIdentifier: string;
  MessageData: string | redacted.Redacted<string>;
  GenerationAttributes: MacAttributes;
  MacLength?: number;
}
export const GenerateMacInput = S.suspend(() =>
  S.Struct({
    KeyIdentifier: S.String,
    MessageData: SensitiveString,
    GenerationAttributes: MacAttributes,
    MacLength: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/mac/generate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GenerateMacInput",
}) as any as S.Schema<GenerateMacInput>;
export interface GenerateMacEmvPinChangeInput {
  NewPinPekIdentifier: string;
  NewEncryptedPinBlock: string | redacted.Redacted<string>;
  PinBlockFormat: PinBlockFormatForEmvPinChange;
  SecureMessagingIntegrityKeyIdentifier: string;
  SecureMessagingConfidentialityKeyIdentifier: string;
  MessageData: string | redacted.Redacted<string>;
  DerivationMethodAttributes: DerivationMethodAttributes;
}
export const GenerateMacEmvPinChangeInput = S.suspend(() =>
  S.Struct({
    NewPinPekIdentifier: S.String,
    NewEncryptedPinBlock: SensitiveString,
    PinBlockFormat: PinBlockFormatForEmvPinChange,
    SecureMessagingIntegrityKeyIdentifier: S.String,
    SecureMessagingConfidentialityKeyIdentifier: S.String,
    MessageData: SensitiveString,
    DerivationMethodAttributes: DerivationMethodAttributes,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/macemvpinchange/generate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GenerateMacEmvPinChangeInput",
}) as any as S.Schema<GenerateMacEmvPinChangeInput>;
export interface TranslateKeyMaterialInput {
  IncomingKeyMaterial: IncomingKeyMaterial;
  OutgoingKeyMaterial: OutgoingKeyMaterial;
  KeyCheckValueAlgorithm?: string;
}
export const TranslateKeyMaterialInput = S.suspend(() =>
  S.Struct({
    IncomingKeyMaterial: IncomingKeyMaterial,
    OutgoingKeyMaterial: OutgoingKeyMaterial,
    KeyCheckValueAlgorithm: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/keymaterial/translate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TranslateKeyMaterialInput",
}) as any as S.Schema<TranslateKeyMaterialInput>;
export interface TranslatePinDataOutput {
  PinBlock: string | redacted.Redacted<string>;
  KeyArn: string;
  KeyCheckValue: string;
}
export const TranslatePinDataOutput = S.suspend(() =>
  S.Struct({
    PinBlock: SensitiveString,
    KeyArn: S.String,
    KeyCheckValue: S.String,
  }),
).annotations({
  identifier: "TranslatePinDataOutput",
}) as any as S.Schema<TranslatePinDataOutput>;
export interface VerifyAuthRequestCryptogramOutput {
  KeyArn: string;
  KeyCheckValue: string;
  AuthResponseValue?: string | redacted.Redacted<string>;
}
export const VerifyAuthRequestCryptogramOutput = S.suspend(() =>
  S.Struct({
    KeyArn: S.String,
    KeyCheckValue: S.String,
    AuthResponseValue: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "VerifyAuthRequestCryptogramOutput",
}) as any as S.Schema<VerifyAuthRequestCryptogramOutput>;
export interface VerifyCardValidationDataOutput {
  KeyArn: string;
  KeyCheckValue: string;
}
export const VerifyCardValidationDataOutput = S.suspend(() =>
  S.Struct({ KeyArn: S.String, KeyCheckValue: S.String }),
).annotations({
  identifier: "VerifyCardValidationDataOutput",
}) as any as S.Schema<VerifyCardValidationDataOutput>;
export interface VerifyPinDataOutput {
  VerificationKeyArn: string;
  VerificationKeyCheckValue: string;
  EncryptionKeyArn: string;
  EncryptionKeyCheckValue: string;
}
export const VerifyPinDataOutput = S.suspend(() =>
  S.Struct({
    VerificationKeyArn: S.String,
    VerificationKeyCheckValue: S.String,
    EncryptionKeyArn: S.String,
    EncryptionKeyCheckValue: S.String,
  }),
).annotations({
  identifier: "VerifyPinDataOutput",
}) as any as S.Schema<VerifyPinDataOutput>;
export type PinData =
  | { PinOffset: string | redacted.Redacted<string>; VerificationValue?: never }
  | {
      PinOffset?: never;
      VerificationValue: string | redacted.Redacted<string>;
    };
export const PinData = S.Union(
  S.Struct({ PinOffset: SensitiveString }),
  S.Struct({ VerificationValue: SensitiveString }),
);
export interface DecryptDataOutput {
  KeyArn: string;
  KeyCheckValue: string;
  PlainText: string | redacted.Redacted<string>;
}
export const DecryptDataOutput = S.suspend(() =>
  S.Struct({
    KeyArn: S.String,
    KeyCheckValue: S.String,
    PlainText: SensitiveString,
  }),
).annotations({
  identifier: "DecryptDataOutput",
}) as any as S.Schema<DecryptDataOutput>;
export interface GenerateMacOutput {
  KeyArn: string;
  KeyCheckValue: string;
  Mac: string | redacted.Redacted<string>;
}
export const GenerateMacOutput = S.suspend(() =>
  S.Struct({ KeyArn: S.String, KeyCheckValue: S.String, Mac: SensitiveString }),
).annotations({
  identifier: "GenerateMacOutput",
}) as any as S.Schema<GenerateMacOutput>;
export interface GeneratePinDataOutput {
  GenerationKeyArn: string;
  GenerationKeyCheckValue: string;
  EncryptionKeyArn: string;
  EncryptionKeyCheckValue: string;
  EncryptedPinBlock: string | redacted.Redacted<string>;
  PinData: PinData;
}
export const GeneratePinDataOutput = S.suspend(() =>
  S.Struct({
    GenerationKeyArn: S.String,
    GenerationKeyCheckValue: S.String,
    EncryptionKeyArn: S.String,
    EncryptionKeyCheckValue: S.String,
    EncryptedPinBlock: SensitiveString,
    PinData: PinData,
  }),
).annotations({
  identifier: "GeneratePinDataOutput",
}) as any as S.Schema<GeneratePinDataOutput>;
export interface VisaAmexDerivationOutputs {
  AuthorizationRequestKeyArn: string;
  AuthorizationRequestKeyCheckValue: string;
  CurrentPinPekArn?: string;
  CurrentPinPekKeyCheckValue?: string;
}
export const VisaAmexDerivationOutputs = S.suspend(() =>
  S.Struct({
    AuthorizationRequestKeyArn: S.String,
    AuthorizationRequestKeyCheckValue: S.String,
    CurrentPinPekArn: S.optional(S.String),
    CurrentPinPekKeyCheckValue: S.optional(S.String),
  }),
).annotations({
  identifier: "VisaAmexDerivationOutputs",
}) as any as S.Schema<VisaAmexDerivationOutputs>;
export interface WrappedWorkingKey {
  WrappedKeyMaterial: string | redacted.Redacted<string>;
  KeyCheckValue: string;
  WrappedKeyMaterialFormat: string;
}
export const WrappedWorkingKey = S.suspend(() =>
  S.Struct({
    WrappedKeyMaterial: SensitiveString,
    KeyCheckValue: S.String,
    WrappedKeyMaterialFormat: S.String,
  }),
).annotations({
  identifier: "WrappedWorkingKey",
}) as any as S.Schema<WrappedWorkingKey>;
export interface GenerateMacEmvPinChangeOutput {
  NewPinPekArn: string;
  SecureMessagingIntegrityKeyArn: string;
  SecureMessagingConfidentialityKeyArn: string;
  Mac: string | redacted.Redacted<string>;
  EncryptedPinBlock: string | redacted.Redacted<string>;
  NewPinPekKeyCheckValue: string;
  SecureMessagingIntegrityKeyCheckValue: string;
  SecureMessagingConfidentialityKeyCheckValue: string;
  VisaAmexDerivationOutputs?: VisaAmexDerivationOutputs;
}
export const GenerateMacEmvPinChangeOutput = S.suspend(() =>
  S.Struct({
    NewPinPekArn: S.String,
    SecureMessagingIntegrityKeyArn: S.String,
    SecureMessagingConfidentialityKeyArn: S.String,
    Mac: SensitiveString,
    EncryptedPinBlock: SensitiveString,
    NewPinPekKeyCheckValue: S.String,
    SecureMessagingIntegrityKeyCheckValue: S.String,
    SecureMessagingConfidentialityKeyCheckValue: S.String,
    VisaAmexDerivationOutputs: S.optional(VisaAmexDerivationOutputs),
  }),
).annotations({
  identifier: "GenerateMacEmvPinChangeOutput",
}) as any as S.Schema<GenerateMacEmvPinChangeOutput>;
export interface TranslateKeyMaterialOutput {
  WrappedKey: WrappedWorkingKey;
}
export const TranslateKeyMaterialOutput = S.suspend(() =>
  S.Struct({ WrappedKey: WrappedWorkingKey }),
).annotations({
  identifier: "TranslateKeyMaterialOutput",
}) as any as S.Schema<TranslateKeyMaterialOutput>;
export interface ValidationExceptionField {
  path: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ path: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { ResourceId: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String, fieldList: S.optional(ValidationExceptionFieldList) },
) {}
export class VerificationFailedException extends S.TaggedError<VerificationFailedException>()(
  "VerificationFailedException",
  { Reason: S.String, Message: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Encrypts plaintext data to ciphertext using a symmetric (TDES, AES), asymmetric (RSA), or derived (DUKPT or EMV) encryption key scheme. For more information, see Encrypt data in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * You can generate an encryption key within Amazon Web Services Payment Cryptography by calling CreateKey. You can import your own encryption key by calling ImportKey.
 *
 * For this operation, the key must have `KeyModesOfUse` set to `Encrypt`. In asymmetric encryption, plaintext is encrypted using public component. You can import the public component of an asymmetric key pair created outside Amazon Web Services Payment Cryptography by calling ImportKey.
 *
 * This operation also supports dynamic keys, allowing you to pass a dynamic encryption key as a TR-31 WrappedKeyBlock. This can be used when key material is frequently rotated, such as during every card transaction, and there is need to avoid importing short-lived keys into Amazon Web Services Payment Cryptography. To encrypt using dynamic keys, the `keyARN` is the Key Encryption Key (KEK) of the TR-31 wrapped encryption key material. The incoming wrapped key shall have a key purpose of D0 with a mode of use of B or D. For more information, see Using Dynamic Keys in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * For symmetric and DUKPT encryption, Amazon Web Services Payment Cryptography supports `TDES` and `AES` algorithms. For EMV encryption, Amazon Web Services Payment Cryptography supports `TDES` algorithms.For asymmetric encryption, Amazon Web Services Payment Cryptography supports `RSA`.
 *
 * When you use TDES or TDES DUKPT, the plaintext data length must be a multiple of 8 bytes. For AES or AES DUKPT, the plaintext data length must be a multiple of 16 bytes. For RSA, it sould be equal to the key size unless padding is enabled.
 *
 * To encrypt using DUKPT, you must already have a BDK (Base Derivation Key) key in your account with `KeyModesOfUse` set to `DeriveKey`, or you can generate a new DUKPT key by calling CreateKey. To encrypt using EMV, you must already have an IMK (Issuer Master Key) key in your account with `KeyModesOfUse` set to `DeriveKey`.
 *
 * For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * **Cross-account use**: This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - DecryptData
 *
 * - GetPublicCertificate
 *
 * - ImportKey
 *
 * - ReEncryptData
 */
export const encryptData: (
  input: EncryptDataInput,
) => effect.Effect<
  EncryptDataOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EncryptDataInput,
  output: EncryptDataOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Generates an issuer script mac for EMV payment cards that use offline PINs as the cardholder verification method (CVM).
 *
 * This operation generates an authenticated issuer script response by appending the incoming message data (APDU command) with the target encrypted PIN block in ISO2 format. The command structure and method to send the issuer script update to the card is not defined by this operation and is typically determined by the applicable payment card scheme.
 *
 * The primary inputs to this operation include the incoming new encrypted pinblock, PIN encryption key (PEK), issuer master key (IMK), primary account number (PAN), and the payment card derivation method.
 *
 * The operation uses two issuer master keys - secure messaging for confidentiality (IMK-SMC) and secure messaging for integrity (IMK-SMI). The SMC key is used to internally derive a key to secure the pin, while SMI key is used to internally derive a key to authenticate the script reponse as per the EMV 4.4 - Book 2 - Security and Key Management specification.
 *
 * This operation supports Amex, EMV2000, EMVCommon, Mastercard and Visa derivation methods, each requiring specific input parameters. Users must follow the specific derivation method and input parameters defined by the respective payment card scheme.
 *
 * Use GenerateMac operation when sending a script update to an EMV card that does not involve PIN change. When assigning IAM permissions, it is important to understand that EncryptData using EMV keys and GenerateMac perform similar functions to this command.
 *
 * **Cross-account use**: This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - EncryptData
 *
 * - GenerateMac
 */
export const generateMacEmvPinChange: (
  input: GenerateMacEmvPinChangeInput,
) => effect.Effect<
  GenerateMacEmvPinChangeOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateMacEmvPinChangeInput,
  output: GenerateMacEmvPinChangeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Translates an cryptographic key between different wrapping keys without importing the key into Amazon Web Services Payment Cryptography.
 *
 * This operation can be used when key material is frequently rotated, such as during every card transaction, and there is a need to avoid importing short-lived keys into Amazon Web Services Payment Cryptography. It translates short-lived transaction keys such as PEK generated for each transaction and wrapped with an ECDH derived wrapping key to another KEK wrapping key.
 *
 * Before using this operation, you must first request the public key certificate of the ECC key pair generated within Amazon Web Services Payment Cryptography to establish an ECDH key agreement. In `TranslateKeyData`, the service uses its own ECC key pair, public certificate of receiving ECC key pair, and the key derivation parameters to generate a derived key. The service uses this derived key to unwrap the incoming transaction key received as a TR31WrappedKeyBlock and re-wrap using a user provided KEK to generate an outgoing Tr31WrappedKeyBlock.
 *
 * For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * **Cross-account use**: This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - CreateKey
 *
 * - GetPublicCertificate
 *
 * - ImportKey
 */
export const translateKeyMaterial: (
  input: TranslateKeyMaterialInput,
) => effect.Effect<
  TranslateKeyMaterialOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TranslateKeyMaterialInput,
  output: TranslateKeyMaterialOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Generates a Message Authentication Code (MAC) cryptogram within Amazon Web Services Payment Cryptography.
 *
 * You can use this operation to authenticate card-related data by using known data values to generate MAC for data validation between the sending and receiving parties. This operation uses message data, a secret encryption key and MAC algorithm to generate a unique MAC value for transmission. The receiving party of the MAC must use the same message data, secret encryption key and MAC algorithm to reproduce another MAC value for comparision.
 *
 * You can use this operation to generate a DUPKT, CMAC, HMAC or EMV MAC by setting generation attributes and algorithm to the associated values. The MAC generation encryption key must have valid values for `KeyUsage` such as `TR31_M7_HMAC_KEY` for HMAC generation, and the key must have `KeyModesOfUse` set to `Generate`.
 *
 * For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * **Cross-account use**: This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - VerifyMac
 */
export const generateMac: (
  input: GenerateMacInput,
) => effect.Effect<
  GenerateMacOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateMacInput,
  output: GenerateMacOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Generates pin-related data such as PIN, PIN Verification Value (PVV), PIN Block, and PIN Offset during new card issuance or reissuance. For more information, see Generate PIN data in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * PIN data is never transmitted in clear to or from Amazon Web Services Payment Cryptography. This operation generates PIN, PVV, or PIN Offset and then encrypts it using Pin Encryption Key (PEK) to create an `EncryptedPinBlock` for transmission from Amazon Web Services Payment Cryptography. This operation uses a separate Pin Verification Key (PVK) for VISA PVV generation.
 *
 * Using ECDH key exchange, you can receive cardholder selectable PINs into Amazon Web Services Payment Cryptography. The ECDH derived key protects the incoming PIN block. You can also use it for reveal PIN, wherein the generated PIN block is protected by the ECDH derived key before transmission from Amazon Web Services Payment Cryptography. For more information on establishing ECDH derived keys, see the Generating keys in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * **Cross-account use**: This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - GenerateCardValidationData
 *
 * - TranslatePinData
 *
 * - VerifyPinData
 */
export const generatePinData: (
  input: GeneratePinDataInput,
) => effect.Effect<
  GeneratePinDataOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GeneratePinDataInput,
  output: GeneratePinDataOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Establishes node-to-node initialization between payment processing nodes such as an acquirer, issuer or payment network using Australian Standard 2805 (AS2805).
 *
 * During node-to-node initialization, both communicating nodes must validate that they possess the correct Key Encrypting Keys (KEKs) before proceeding with session key exchange. In AS2805, the sending KEK (KEKs) of one node corresponds to the receiving KEK (KEKr) of its partner node. Each node uses its KEK to encrypt and decrypt session keys exchanged between the nodes. A KEK can be created or imported into Amazon Web Services Payment Cryptography using either the CreateKey or ImportKey operations.
 *
 * The node initiating communication can use `GenerateAS2805KekValidation` to generate a combined KEK validation request and KEK validation response to send to the partnering node for validation. When invoked, the API internally generates a random sending key encrypted under KEKs and provides a receiving key encrypted under KEKr as response. The initiating node sends the response returned by this API to its partner for validation.
 *
 * For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * **Cross-account use**: This operation can't be used across different Amazon Web Services accounts.
 */
export const generateAs2805KekValidation: (
  input: GenerateAs2805KekValidationInput,
) => effect.Effect<
  GenerateAs2805KekValidationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateAs2805KekValidationInput,
  output: GenerateAs2805KekValidationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Generates card-related validation data using algorithms such as Card Verification Values (CVV/CVV2), Dynamic Card Verification Values (dCVV/dCVV2), or Card Security Codes (CSC). For more information, see Generate card data in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * This operation generates a CVV or CSC value that is printed on a payment credit or debit card during card production. The CVV or CSC, PAN (Primary Account Number) and expiration date of the card are required to check its validity during transaction processing. To begin this operation, a CVK (Card Verification Key) encryption key is required. You can use CreateKey or ImportKey to establish a CVK within Amazon Web Services Payment Cryptography. The `KeyModesOfUse` should be set to `Generate` and `Verify` for a CVK encryption key.
 *
 * For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * **Cross-account use**: This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - ImportKey
 *
 * - VerifyCardValidationData
 */
export const generateCardValidationData: (
  input: GenerateCardValidationDataInput,
) => effect.Effect<
  GenerateCardValidationDataOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateCardValidationDataInput,
  output: GenerateCardValidationDataOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Translates encrypted PIN block from and to ISO 9564 formats 0,1,3,4. For more information, see Translate PIN data in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * PIN block translation involves changing a PIN block from one encryption key to another and optionally change its format. PIN block translation occurs entirely within the HSM boundary and PIN data never enters or leaves Amazon Web Services Payment Cryptography in clear text. The encryption key transformation can be from PEK (Pin Encryption Key) to BDK (Base Derivation Key) for DUKPT or from BDK for DUKPT to PEK.
 *
 * Amazon Web Services Payment Cryptography also supports use of dynamic keys and ECDH (Elliptic Curve Diffie-Hellman) based key exchange for this operation.
 *
 * Dynamic keys allow you to pass a PEK as a TR-31 WrappedKeyBlock. They can be used when key material is frequently rotated, such as during every card transaction, and there is need to avoid importing short-lived keys into Amazon Web Services Payment Cryptography. To translate PIN block using dynamic keys, the `keyARN` is the Key Encryption Key (KEK) of the TR-31 wrapped PEK. The incoming wrapped key shall have a key purpose of P0 with a mode of use of B or D. For more information, see Using Dynamic Keys in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * Using ECDH key exchange, you can receive cardholder selectable PINs into Amazon Web Services Payment Cryptography. The ECDH derived key protects the incoming PIN block, which is translated to a PEK encrypted PIN block for use within the service. You can also use ECDH for reveal PIN, wherein the service translates the PIN block from PEK to a ECDH derived encryption key. For more information on establishing ECDH derived keys, see the Creating keys in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * The allowed combinations of PIN block format translations are guided by PCI. It is important to note that not all encrypted PIN block formats (example, format 1) require PAN (Primary Account Number) as input. And as such, PIN block format that requires PAN (example, formats 0,3,4) cannot be translated to a format (format 1) that does not require a PAN for generation.
 *
 * For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * Amazon Web Services Payment Cryptography currently supports ISO PIN block 4 translation for PIN block built using legacy PAN length. That is, PAN is the right most 12 digits excluding the check digits.
 *
 * **Cross-account use**: This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - GeneratePinData
 *
 * - VerifyPinData
 */
export const translatePinData: (
  input: TranslatePinDataInput,
) => effect.Effect<
  TranslatePinDataOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TranslatePinDataInput,
  output: TranslatePinDataOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Re-encrypt ciphertext using DUKPT or Symmetric data encryption keys.
 *
 * You can either generate an encryption key within Amazon Web Services Payment Cryptography by calling CreateKey or import your own encryption key by calling ImportKey. The `KeyArn` for use with this operation must be in a compatible key state with `KeyModesOfUse` set to `Encrypt`.
 *
 * This operation also supports dynamic keys, allowing you to pass a dynamic encryption key as a TR-31 WrappedKeyBlock. This can be used when key material is frequently rotated, such as during every card transaction, and there is need to avoid importing short-lived keys into Amazon Web Services Payment Cryptography. To re-encrypt using dynamic keys, the `keyARN` is the Key Encryption Key (KEK) of the TR-31 wrapped encryption key material. The incoming wrapped key shall have a key purpose of D0 with a mode of use of B or D. For more information, see Using Dynamic Keys in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * For symmetric and DUKPT encryption, Amazon Web Services Payment Cryptography supports `TDES` and `AES` algorithms. To encrypt using DUKPT, a DUKPT key must already exist within your account with `KeyModesOfUse` set to `DeriveKey` or a new DUKPT can be generated by calling CreateKey.
 *
 * For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * **Cross-account use**: This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - DecryptData
 *
 * - EncryptData
 *
 * - GetPublicCertificate
 *
 * - ImportKey
 */
export const reEncryptData: (
  input: ReEncryptDataInput,
) => effect.Effect<
  ReEncryptDataOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReEncryptDataInput,
  output: ReEncryptDataOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Decrypts ciphertext data to plaintext using a symmetric (TDES, AES), asymmetric (RSA), or derived (DUKPT or EMV) encryption key scheme. For more information, see Decrypt data in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * You can use an decryption key generated within Amazon Web Services Payment Cryptography, or you can import your own decryption key by calling ImportKey. For this operation, the key must have `KeyModesOfUse` set to `Decrypt`. In asymmetric decryption, Amazon Web Services Payment Cryptography decrypts the ciphertext using the private component of the asymmetric encryption key pair. For data encryption outside of Amazon Web Services Payment Cryptography, you can export the public component of the asymmetric key pair by calling GetPublicCertificate.
 *
 * This operation also supports dynamic keys, allowing you to pass a dynamic decryption key as a TR-31 WrappedKeyBlock. This can be used when key material is frequently rotated, such as during every card transaction, and there is need to avoid importing short-lived keys into Amazon Web Services Payment Cryptography. To decrypt using dynamic keys, the `keyARN` is the Key Encryption Key (KEK) of the TR-31 wrapped decryption key material. The incoming wrapped key shall have a key purpose of D0 with a mode of use of B or D. For more information, see Using Dynamic Keys in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * For symmetric and DUKPT decryption, Amazon Web Services Payment Cryptography supports `TDES` and `AES` algorithms. For EMV decryption, Amazon Web Services Payment Cryptography supports `TDES` algorithms. For asymmetric decryption, Amazon Web Services Payment Cryptography supports `RSA`.
 *
 * When you use TDES or TDES DUKPT, the ciphertext data length must be a multiple of 8 bytes. For AES or AES DUKPT, the ciphertext data length must be a multiple of 16 bytes. For RSA, it sould be equal to the key size unless padding is enabled.
 *
 * For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * **Cross-account use**: This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - EncryptData
 *
 * - GetPublicCertificate
 *
 * - ImportKey
 */
export const decryptData: (
  input: DecryptDataInput,
) => effect.Effect<
  DecryptDataOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DecryptDataInput,
  output: DecryptDataOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Verifies Authorization Request Cryptogram (ARQC) for a EMV chip payment card authorization. For more information, see Verify auth request cryptogram in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * ARQC generation is done outside of Amazon Web Services Payment Cryptography and is typically generated on a point of sale terminal for an EMV chip card to obtain payment authorization during transaction time. For ARQC verification, you must first import the ARQC generated outside of Amazon Web Services Payment Cryptography by calling ImportKey. This operation uses the imported ARQC and an major encryption key (DUKPT) created by calling CreateKey to either provide a boolean ARQC verification result or provide an APRC (Authorization Response Cryptogram) response using Method 1 or Method 2. The `ARPC_METHOD_1` uses `AuthResponseCode` to generate ARPC and `ARPC_METHOD_2` uses `CardStatusUpdate` to generate ARPC.
 *
 * For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * **Cross-account use**: This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - VerifyCardValidationData
 *
 * - VerifyPinData
 */
export const verifyAuthRequestCryptogram: (
  input: VerifyAuthRequestCryptogramInput,
) => effect.Effect<
  VerifyAuthRequestCryptogramOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | VerificationFailedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifyAuthRequestCryptogramInput,
  output: VerifyAuthRequestCryptogramOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
    VerificationFailedException,
  ],
}));
/**
 * Verifies card-related validation data using algorithms such as Card Verification Values (CVV/CVV2), Dynamic Card Verification Values (dCVV/dCVV2) and Card Security Codes (CSC). For more information, see Verify card data in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * This operation validates the CVV or CSC codes that is printed on a payment credit or debit card during card payment transaction. The input values are typically provided as part of an inbound transaction to an issuer or supporting platform partner. Amazon Web Services Payment Cryptography uses CVV or CSC, PAN (Primary Account Number) and expiration date of the card to check its validity during transaction processing. In this operation, the CVK (Card Verification Key) encryption key for use with card data verification is same as the one in used for GenerateCardValidationData.
 *
 * For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * **Cross-account use**: This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - GenerateCardValidationData
 *
 * - VerifyAuthRequestCryptogram
 *
 * - VerifyPinData
 */
export const verifyCardValidationData: (
  input: VerifyCardValidationDataInput,
) => effect.Effect<
  VerifyCardValidationDataOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | VerificationFailedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifyCardValidationDataInput,
  output: VerifyCardValidationDataOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
    VerificationFailedException,
  ],
}));
/**
 * Verifies pin-related data such as PIN and PIN Offset using algorithms including VISA PVV and IBM3624. For more information, see Verify PIN data in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * This operation verifies PIN data for user payment card. A card holder PIN data is never transmitted in clear to or from Amazon Web Services Payment Cryptography. This operation uses PIN Verification Key (PVK) for PIN or PIN Offset generation and then encrypts it using PIN Encryption Key (PEK) to create an `EncryptedPinBlock` for transmission from Amazon Web Services Payment Cryptography.
 *
 * For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * **Cross-account use**: This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - GeneratePinData
 *
 * - TranslatePinData
 */
export const verifyPinData: (
  input: VerifyPinDataInput,
) => effect.Effect<
  VerifyPinDataOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | VerificationFailedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifyPinDataInput,
  output: VerifyPinDataOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
    VerificationFailedException,
  ],
}));
/**
 * Verifies a Message Authentication Code (MAC).
 *
 * You can use this operation to verify MAC for message data authentication such as . In this operation, you must use the same message data, secret encryption key and MAC algorithm that was used to generate MAC. You can use this operation to verify a DUPKT, CMAC, HMAC or EMV MAC by setting generation attributes and algorithm to the associated values.
 *
 * For information about valid keys for this operation, see Understanding key attributes and Key types for specific data operations in the *Amazon Web Services Payment Cryptography User Guide*.
 *
 * **Cross-account use**: This operation can't be used across different Amazon Web Services accounts.
 *
 * **Related operations:**
 *
 * - GenerateMac
 */
export const verifyMac: (
  input: VerifyMacInput,
) => effect.Effect<
  VerifyMacOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | VerificationFailedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifyMacInput,
  output: VerifyMacOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
    VerificationFailedException,
  ],
}));

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Payment Cryptography Data",
  serviceShapeName: "PaymentCryptographyDataPlane",
});
const auth = T.AwsAuthSigv4({ name: "payment-cryptography" });
const ver = T.ServiceVersion("2022-02-03");
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
                                url: "https://dataplane.payment-cryptography-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://dataplane.payment-cryptography-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://dataplane.payment-cryptography.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://dataplane.payment-cryptography.{Region}.{PartitionResult#dnsSuffix}",
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
export class SymmetricEncryptionAttributes extends S.Class<SymmetricEncryptionAttributes>(
  "SymmetricEncryptionAttributes",
)({
  Mode: S.String,
  InitializationVector: S.optional(S.String),
  PaddingType: S.optional(S.String),
}) {}
export class AsymmetricEncryptionAttributes extends S.Class<AsymmetricEncryptionAttributes>(
  "AsymmetricEncryptionAttributes",
)({ PaddingType: S.optional(S.String) }) {}
export class DukptEncryptionAttributes extends S.Class<DukptEncryptionAttributes>(
  "DukptEncryptionAttributes",
)({
  KeySerialNumber: S.String,
  Mode: S.optional(S.String),
  DukptKeyDerivationType: S.optional(S.String),
  DukptKeyVariant: S.optional(S.String),
  InitializationVector: S.optional(S.String),
}) {}
export class EmvEncryptionAttributes extends S.Class<EmvEncryptionAttributes>(
  "EmvEncryptionAttributes",
)({
  MajorKeyDerivationMode: S.String,
  PrimaryAccountNumber: S.String,
  PanSequenceNumber: S.String,
  SessionDerivationData: S.String,
  Mode: S.optional(S.String),
  InitializationVector: S.optional(S.String),
}) {}
export const EncryptionDecryptionAttributes = S.Union(
  S.Struct({ Symmetric: SymmetricEncryptionAttributes }),
  S.Struct({ Asymmetric: AsymmetricEncryptionAttributes }),
  S.Struct({ Dukpt: DukptEncryptionAttributes }),
  S.Struct({ Emv: EmvEncryptionAttributes }),
);
export class EcdhDerivationAttributes extends S.Class<EcdhDerivationAttributes>(
  "EcdhDerivationAttributes",
)({
  CertificateAuthorityPublicKeyIdentifier: S.String,
  PublicKeyCertificate: S.String,
  KeyAlgorithm: S.String,
  KeyDerivationFunction: S.String,
  KeyDerivationHashAlgorithm: S.String,
  SharedInformation: S.String,
}) {}
export const WrappedKeyMaterial = S.Union(
  S.Struct({ Tr31KeyBlock: S.String }),
  S.Struct({ DiffieHellmanSymmetricKey: EcdhDerivationAttributes }),
);
export class WrappedKey extends S.Class<WrappedKey>("WrappedKey")({
  WrappedKeyMaterial: WrappedKeyMaterial,
  KeyCheckValueAlgorithm: S.optional(S.String),
}) {}
export class EncryptDataInput extends S.Class<EncryptDataInput>(
  "EncryptDataInput",
)(
  {
    KeyIdentifier: S.String.pipe(T.HttpLabel()),
    PlainText: S.String,
    EncryptionAttributes: EncryptionDecryptionAttributes,
    WrappedKey: S.optional(WrappedKey),
  },
  T.all(
    T.Http({ method: "POST", uri: "/keys/{KeyIdentifier}/encrypt" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const SessionKeyDerivationValue = S.Union(
  S.Struct({ ApplicationCryptogram: S.String }),
  S.Struct({ ApplicationTransactionCounter: S.String }),
);
export class MacAlgorithmEmv extends S.Class<MacAlgorithmEmv>(
  "MacAlgorithmEmv",
)({
  MajorKeyDerivationMode: S.String,
  PrimaryAccountNumber: S.String,
  PanSequenceNumber: S.String,
  SessionKeyDerivationMode: S.String,
  SessionKeyDerivationValue: SessionKeyDerivationValue,
}) {}
export class MacAlgorithmDukpt extends S.Class<MacAlgorithmDukpt>(
  "MacAlgorithmDukpt",
)({
  KeySerialNumber: S.String,
  DukptKeyVariant: S.String,
  DukptDerivationType: S.optional(S.String),
}) {}
export const MacAttributes = S.Union(
  S.Struct({ Algorithm: S.String }),
  S.Struct({ EmvMac: MacAlgorithmEmv }),
  S.Struct({ DukptIso9797Algorithm1: MacAlgorithmDukpt }),
  S.Struct({ DukptIso9797Algorithm3: MacAlgorithmDukpt }),
  S.Struct({ DukptCmac: MacAlgorithmDukpt }),
);
export class VerifyMacInput extends S.Class<VerifyMacInput>("VerifyMacInput")(
  {
    KeyIdentifier: S.String,
    MessageData: S.String,
    Mac: S.String,
    VerificationAttributes: MacAttributes,
    MacLength: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/mac/verify" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TranslationPinDataIsoFormat1 extends S.Class<TranslationPinDataIsoFormat1>(
  "TranslationPinDataIsoFormat1",
)({}) {}
export const ReEncryptionAttributes = S.Union(
  S.Struct({ Symmetric: SymmetricEncryptionAttributes }),
  S.Struct({ Dukpt: DukptEncryptionAttributes }),
);
export class DukptDerivationAttributes extends S.Class<DukptDerivationAttributes>(
  "DukptDerivationAttributes",
)({
  KeySerialNumber: S.String,
  DukptKeyDerivationType: S.optional(S.String),
  DukptKeyVariant: S.optional(S.String),
}) {}
export class As2805PekDerivationAttributes extends S.Class<As2805PekDerivationAttributes>(
  "As2805PekDerivationAttributes",
)({ SystemTraceAuditNumber: S.String, TransactionAmount: S.String }) {}
export class DukptAttributes extends S.Class<DukptAttributes>(
  "DukptAttributes",
)({ KeySerialNumber: S.String, DukptDerivationType: S.String }) {}
export class EncryptDataOutput extends S.Class<EncryptDataOutput>(
  "EncryptDataOutput",
)({
  KeyArn: S.String,
  KeyCheckValue: S.optional(S.String),
  CipherText: S.String,
}) {}
export class ReEncryptDataInput extends S.Class<ReEncryptDataInput>(
  "ReEncryptDataInput",
)(
  {
    IncomingKeyIdentifier: S.String.pipe(T.HttpLabel()),
    OutgoingKeyIdentifier: S.String,
    CipherText: S.String,
    IncomingEncryptionAttributes: ReEncryptionAttributes,
    OutgoingEncryptionAttributes: ReEncryptionAttributes,
    IncomingWrappedKey: S.optional(WrappedKey),
    OutgoingWrappedKey: S.optional(WrappedKey),
  },
  T.all(
    T.Http({ method: "POST", uri: "/keys/{IncomingKeyIdentifier}/reencrypt" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VerifyMacOutput extends S.Class<VerifyMacOutput>(
  "VerifyMacOutput",
)({ KeyArn: S.String, KeyCheckValue: S.String }) {}
export class KekValidationRequest extends S.Class<KekValidationRequest>(
  "KekValidationRequest",
)({ DeriveKeyAlgorithm: S.String }) {}
export class KekValidationResponse extends S.Class<KekValidationResponse>(
  "KekValidationResponse",
)({ RandomKeySend: S.String }) {}
export class AmexCardSecurityCodeVersion1 extends S.Class<AmexCardSecurityCodeVersion1>(
  "AmexCardSecurityCodeVersion1",
)({ CardExpiryDate: S.String }) {}
export class AmexCardSecurityCodeVersion2 extends S.Class<AmexCardSecurityCodeVersion2>(
  "AmexCardSecurityCodeVersion2",
)({ CardExpiryDate: S.String, ServiceCode: S.String }) {}
export class CardVerificationValue1 extends S.Class<CardVerificationValue1>(
  "CardVerificationValue1",
)({ CardExpiryDate: S.String, ServiceCode: S.String }) {}
export class CardVerificationValue2 extends S.Class<CardVerificationValue2>(
  "CardVerificationValue2",
)({ CardExpiryDate: S.String }) {}
export class CardHolderVerificationValue extends S.Class<CardHolderVerificationValue>(
  "CardHolderVerificationValue",
)({
  UnpredictableNumber: S.String,
  PanSequenceNumber: S.String,
  ApplicationTransactionCounter: S.String,
}) {}
export class DynamicCardVerificationCode extends S.Class<DynamicCardVerificationCode>(
  "DynamicCardVerificationCode",
)({
  UnpredictableNumber: S.String,
  PanSequenceNumber: S.String,
  ApplicationTransactionCounter: S.String,
  TrackData: S.String,
}) {}
export class DynamicCardVerificationValue extends S.Class<DynamicCardVerificationValue>(
  "DynamicCardVerificationValue",
)({
  PanSequenceNumber: S.String,
  CardExpiryDate: S.String,
  ServiceCode: S.String,
  ApplicationTransactionCounter: S.String,
}) {}
export class EmvCommonAttributes extends S.Class<EmvCommonAttributes>(
  "EmvCommonAttributes",
)({
  MajorKeyDerivationMode: S.String,
  PrimaryAccountNumber: S.String,
  PanSequenceNumber: S.String,
  ApplicationCryptogram: S.String,
  Mode: S.String,
  PinBlockPaddingType: S.String,
  PinBlockLengthPosition: S.String,
}) {}
export class CurrentPinAttributes extends S.Class<CurrentPinAttributes>(
  "CurrentPinAttributes",
)({ CurrentPinPekIdentifier: S.String, CurrentEncryptedPinBlock: S.String }) {}
export class VisaAttributes extends S.Class<VisaAttributes>("VisaAttributes")({
  MajorKeyDerivationMode: S.String,
  PrimaryAccountNumber: S.String,
  PanSequenceNumber: S.String,
  ApplicationTransactionCounter: S.String,
  AuthorizationRequestKeyIdentifier: S.String,
  CurrentPinAttributes: S.optional(CurrentPinAttributes),
}) {}
export class Emv2000Attributes extends S.Class<Emv2000Attributes>(
  "Emv2000Attributes",
)({
  MajorKeyDerivationMode: S.String,
  PrimaryAccountNumber: S.String,
  PanSequenceNumber: S.String,
  ApplicationTransactionCounter: S.String,
}) {}
export class MasterCardAttributes extends S.Class<MasterCardAttributes>(
  "MasterCardAttributes",
)({
  MajorKeyDerivationMode: S.String,
  PrimaryAccountNumber: S.String,
  PanSequenceNumber: S.String,
  ApplicationCryptogram: S.String,
}) {}
export class VisaPin extends S.Class<VisaPin>("VisaPin")({
  PinVerificationKeyIndex: S.Number,
}) {}
export class VisaPinVerificationValue extends S.Class<VisaPinVerificationValue>(
  "VisaPinVerificationValue",
)({ EncryptedPinBlock: S.String, PinVerificationKeyIndex: S.Number }) {}
export class Ibm3624PinOffset extends S.Class<Ibm3624PinOffset>(
  "Ibm3624PinOffset",
)({
  EncryptedPinBlock: S.String,
  DecimalizationTable: S.String,
  PinValidationDataPadCharacter: S.String,
  PinValidationData: S.String,
}) {}
export class Ibm3624NaturalPin extends S.Class<Ibm3624NaturalPin>(
  "Ibm3624NaturalPin",
)({
  DecimalizationTable: S.String,
  PinValidationDataPadCharacter: S.String,
  PinValidationData: S.String,
}) {}
export class Ibm3624RandomPin extends S.Class<Ibm3624RandomPin>(
  "Ibm3624RandomPin",
)({
  DecimalizationTable: S.String,
  PinValidationDataPadCharacter: S.String,
  PinValidationData: S.String,
}) {}
export class Ibm3624PinFromOffset extends S.Class<Ibm3624PinFromOffset>(
  "Ibm3624PinFromOffset",
)({
  DecimalizationTable: S.String,
  PinValidationDataPadCharacter: S.String,
  PinValidationData: S.String,
  PinOffset: S.String,
}) {}
export class OutgoingTr31KeyBlock extends S.Class<OutgoingTr31KeyBlock>(
  "OutgoingTr31KeyBlock",
)({ WrappingKeyIdentifier: S.String }) {}
export class TranslationPinDataIsoFormat034 extends S.Class<TranslationPinDataIsoFormat034>(
  "TranslationPinDataIsoFormat034",
)({ PrimaryAccountNumber: S.String }) {}
export class TranslationPinDataAs2805Format0 extends S.Class<TranslationPinDataAs2805Format0>(
  "TranslationPinDataAs2805Format0",
)({ PrimaryAccountNumber: S.String }) {}
export class SessionKeyEmvCommon extends S.Class<SessionKeyEmvCommon>(
  "SessionKeyEmvCommon",
)({
  PrimaryAccountNumber: S.String,
  PanSequenceNumber: S.String,
  ApplicationTransactionCounter: S.String,
}) {}
export class SessionKeyMastercard extends S.Class<SessionKeyMastercard>(
  "SessionKeyMastercard",
)({
  PrimaryAccountNumber: S.String,
  PanSequenceNumber: S.String,
  ApplicationTransactionCounter: S.String,
  UnpredictableNumber: S.String,
}) {}
export class SessionKeyEmv2000 extends S.Class<SessionKeyEmv2000>(
  "SessionKeyEmv2000",
)({
  PrimaryAccountNumber: S.String,
  PanSequenceNumber: S.String,
  ApplicationTransactionCounter: S.String,
}) {}
export class SessionKeyAmex extends S.Class<SessionKeyAmex>("SessionKeyAmex")({
  PrimaryAccountNumber: S.String,
  PanSequenceNumber: S.String,
}) {}
export class SessionKeyVisa extends S.Class<SessionKeyVisa>("SessionKeyVisa")({
  PrimaryAccountNumber: S.String,
  PanSequenceNumber: S.String,
}) {}
export class CryptogramVerificationArpcMethod1 extends S.Class<CryptogramVerificationArpcMethod1>(
  "CryptogramVerificationArpcMethod1",
)({ AuthResponseCode: S.String }) {}
export class CryptogramVerificationArpcMethod2 extends S.Class<CryptogramVerificationArpcMethod2>(
  "CryptogramVerificationArpcMethod2",
)({
  CardStatusUpdate: S.String,
  ProprietaryAuthenticationData: S.optional(S.String),
}) {}
export class DiscoverDynamicCardVerificationCode extends S.Class<DiscoverDynamicCardVerificationCode>(
  "DiscoverDynamicCardVerificationCode",
)({
  CardExpiryDate: S.String,
  UnpredictableNumber: S.String,
  ApplicationTransactionCounter: S.String,
}) {}
export class VisaPinVerification extends S.Class<VisaPinVerification>(
  "VisaPinVerification",
)({ PinVerificationKeyIndex: S.Number, VerificationValue: S.String }) {}
export class Ibm3624PinVerification extends S.Class<Ibm3624PinVerification>(
  "Ibm3624PinVerification",
)({
  DecimalizationTable: S.String,
  PinValidationDataPadCharacter: S.String,
  PinValidationData: S.String,
  PinOffset: S.String,
}) {}
export const As2805KekValidationType = S.Union(
  S.Struct({ KekValidationRequest: KekValidationRequest }),
  S.Struct({ KekValidationResponse: KekValidationResponse }),
);
export const CardGenerationAttributes = S.Union(
  S.Struct({ AmexCardSecurityCodeVersion1: AmexCardSecurityCodeVersion1 }),
  S.Struct({ AmexCardSecurityCodeVersion2: AmexCardSecurityCodeVersion2 }),
  S.Struct({ CardVerificationValue1: CardVerificationValue1 }),
  S.Struct({ CardVerificationValue2: CardVerificationValue2 }),
  S.Struct({ CardHolderVerificationValue: CardHolderVerificationValue }),
  S.Struct({ DynamicCardVerificationCode: DynamicCardVerificationCode }),
  S.Struct({ DynamicCardVerificationValue: DynamicCardVerificationValue }),
);
export const PinGenerationAttributes = S.Union(
  S.Struct({ VisaPin: VisaPin }),
  S.Struct({ VisaPinVerificationValue: VisaPinVerificationValue }),
  S.Struct({ Ibm3624PinOffset: Ibm3624PinOffset }),
  S.Struct({ Ibm3624NaturalPin: Ibm3624NaturalPin }),
  S.Struct({ Ibm3624RandomPin: Ibm3624RandomPin }),
  S.Struct({ Ibm3624PinFromOffset: Ibm3624PinFromOffset }),
);
export const OutgoingKeyMaterial = S.Union(
  S.Struct({ Tr31KeyBlock: OutgoingTr31KeyBlock }),
);
export const TranslationIsoFormats = S.Union(
  S.Struct({ IsoFormat0: TranslationPinDataIsoFormat034 }),
  S.Struct({ IsoFormat1: TranslationPinDataIsoFormat1 }),
  S.Struct({ IsoFormat3: TranslationPinDataIsoFormat034 }),
  S.Struct({ IsoFormat4: TranslationPinDataIsoFormat034 }),
  S.Struct({ As2805Format0: TranslationPinDataAs2805Format0 }),
);
export const SessionKeyDerivation = S.Union(
  S.Struct({ EmvCommon: SessionKeyEmvCommon }),
  S.Struct({ Mastercard: SessionKeyMastercard }),
  S.Struct({ Emv2000: SessionKeyEmv2000 }),
  S.Struct({ Amex: SessionKeyAmex }),
  S.Struct({ Visa: SessionKeyVisa }),
);
export const CryptogramAuthResponse = S.Union(
  S.Struct({ ArpcMethod1: CryptogramVerificationArpcMethod1 }),
  S.Struct({ ArpcMethod2: CryptogramVerificationArpcMethod2 }),
);
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
export const PinVerificationAttributes = S.Union(
  S.Struct({ VisaPin: VisaPinVerification }),
  S.Struct({ Ibm3624Pin: Ibm3624PinVerification }),
);
export const DiffieHellmanDerivationData = S.Union(
  S.Struct({ SharedInformation: S.String }),
);
export class GenerateAs2805KekValidationInput extends S.Class<GenerateAs2805KekValidationInput>(
  "GenerateAs2805KekValidationInput",
)(
  {
    KeyIdentifier: S.String,
    KekValidationType: As2805KekValidationType,
    RandomKeySendVariantMask: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/as2805kekvalidation/generate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GenerateCardValidationDataInput extends S.Class<GenerateCardValidationDataInput>(
  "GenerateCardValidationDataInput",
)(
  {
    KeyIdentifier: S.String,
    PrimaryAccountNumber: S.String,
    GenerationAttributes: CardGenerationAttributes,
    ValidationDataLength: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cardvalidationdata/generate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GeneratePinDataInput extends S.Class<GeneratePinDataInput>(
  "GeneratePinDataInput",
)(
  {
    GenerationKeyIdentifier: S.String,
    EncryptionKeyIdentifier: S.String,
    GenerationAttributes: PinGenerationAttributes,
    PinDataLength: S.optional(S.Number),
    PrimaryAccountNumber: S.optional(S.String),
    PinBlockFormat: S.String,
    EncryptionWrappedKey: S.optional(WrappedKey),
  },
  T.all(
    T.Http({ method: "POST", uri: "/pindata/generate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ReEncryptDataOutput extends S.Class<ReEncryptDataOutput>(
  "ReEncryptDataOutput",
)({ KeyArn: S.String, KeyCheckValue: S.String, CipherText: S.String }) {}
export class TranslatePinDataInput extends S.Class<TranslatePinDataInput>(
  "TranslatePinDataInput",
)(
  {
    IncomingKeyIdentifier: S.String,
    OutgoingKeyIdentifier: S.String,
    IncomingTranslationAttributes: TranslationIsoFormats,
    OutgoingTranslationAttributes: TranslationIsoFormats,
    EncryptedPinBlock: S.String,
    IncomingDukptAttributes: S.optional(DukptDerivationAttributes),
    OutgoingDukptAttributes: S.optional(DukptDerivationAttributes),
    IncomingWrappedKey: S.optional(WrappedKey),
    OutgoingWrappedKey: S.optional(WrappedKey),
    IncomingAs2805Attributes: S.optional(As2805PekDerivationAttributes),
  },
  T.all(
    T.Http({ method: "POST", uri: "/pindata/translate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VerifyAuthRequestCryptogramInput extends S.Class<VerifyAuthRequestCryptogramInput>(
  "VerifyAuthRequestCryptogramInput",
)(
  {
    KeyIdentifier: S.String,
    TransactionData: S.String,
    AuthRequestCryptogram: S.String,
    MajorKeyDerivationMode: S.String,
    SessionKeyDerivationAttributes: SessionKeyDerivation,
    AuthResponseAttributes: S.optional(CryptogramAuthResponse),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cryptogram/verify" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VerifyCardValidationDataInput extends S.Class<VerifyCardValidationDataInput>(
  "VerifyCardValidationDataInput",
)(
  {
    KeyIdentifier: S.String,
    PrimaryAccountNumber: S.String,
    VerificationAttributes: CardVerificationAttributes,
    ValidationData: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/cardvalidationdata/verify" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VerifyPinDataInput extends S.Class<VerifyPinDataInput>(
  "VerifyPinDataInput",
)(
  {
    VerificationKeyIdentifier: S.String,
    EncryptionKeyIdentifier: S.String,
    VerificationAttributes: PinVerificationAttributes,
    EncryptedPinBlock: S.String,
    PrimaryAccountNumber: S.optional(S.String),
    PinBlockFormat: S.String,
    PinDataLength: S.optional(S.Number),
    DukptAttributes: S.optional(DukptAttributes),
    EncryptionWrappedKey: S.optional(WrappedKey),
  },
  T.all(
    T.Http({ method: "POST", uri: "/pindata/verify" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AmexAttributes extends S.Class<AmexAttributes>("AmexAttributes")({
  MajorKeyDerivationMode: S.String,
  PrimaryAccountNumber: S.String,
  PanSequenceNumber: S.String,
  ApplicationTransactionCounter: S.String,
  AuthorizationRequestKeyIdentifier: S.String,
  CurrentPinAttributes: S.optional(CurrentPinAttributes),
}) {}
export class IncomingDiffieHellmanTr31KeyBlock extends S.Class<IncomingDiffieHellmanTr31KeyBlock>(
  "IncomingDiffieHellmanTr31KeyBlock",
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
export const DerivationMethodAttributes = S.Union(
  S.Struct({ EmvCommon: EmvCommonAttributes }),
  S.Struct({ Amex: AmexAttributes }),
  S.Struct({ Visa: VisaAttributes }),
  S.Struct({ Emv2000: Emv2000Attributes }),
  S.Struct({ Mastercard: MasterCardAttributes }),
);
export const IncomingKeyMaterial = S.Union(
  S.Struct({ DiffieHellmanTr31KeyBlock: IncomingDiffieHellmanTr31KeyBlock }),
);
export class DecryptDataInput extends S.Class<DecryptDataInput>(
  "DecryptDataInput",
)(
  {
    KeyIdentifier: S.String.pipe(T.HttpLabel()),
    CipherText: S.String,
    DecryptionAttributes: EncryptionDecryptionAttributes,
    WrappedKey: S.optional(WrappedKey),
  },
  T.all(
    T.Http({ method: "POST", uri: "/keys/{KeyIdentifier}/decrypt" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GenerateAs2805KekValidationOutput extends S.Class<GenerateAs2805KekValidationOutput>(
  "GenerateAs2805KekValidationOutput",
)({
  KeyArn: S.String,
  KeyCheckValue: S.String,
  RandomKeySend: S.String,
  RandomKeyReceive: S.String,
}) {}
export class GenerateCardValidationDataOutput extends S.Class<GenerateCardValidationDataOutput>(
  "GenerateCardValidationDataOutput",
)({ KeyArn: S.String, KeyCheckValue: S.String, ValidationData: S.String }) {}
export class GenerateMacInput extends S.Class<GenerateMacInput>(
  "GenerateMacInput",
)(
  {
    KeyIdentifier: S.String,
    MessageData: S.String,
    GenerationAttributes: MacAttributes,
    MacLength: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/mac/generate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GenerateMacEmvPinChangeInput extends S.Class<GenerateMacEmvPinChangeInput>(
  "GenerateMacEmvPinChangeInput",
)(
  {
    NewPinPekIdentifier: S.String,
    NewEncryptedPinBlock: S.String,
    PinBlockFormat: S.String,
    SecureMessagingIntegrityKeyIdentifier: S.String,
    SecureMessagingConfidentialityKeyIdentifier: S.String,
    MessageData: S.String,
    DerivationMethodAttributes: DerivationMethodAttributes,
  },
  T.all(
    T.Http({ method: "POST", uri: "/macemvpinchange/generate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TranslateKeyMaterialInput extends S.Class<TranslateKeyMaterialInput>(
  "TranslateKeyMaterialInput",
)(
  {
    IncomingKeyMaterial: IncomingKeyMaterial,
    OutgoingKeyMaterial: OutgoingKeyMaterial,
    KeyCheckValueAlgorithm: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/keymaterial/translate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TranslatePinDataOutput extends S.Class<TranslatePinDataOutput>(
  "TranslatePinDataOutput",
)({ PinBlock: S.String, KeyArn: S.String, KeyCheckValue: S.String }) {}
export class VerifyAuthRequestCryptogramOutput extends S.Class<VerifyAuthRequestCryptogramOutput>(
  "VerifyAuthRequestCryptogramOutput",
)({
  KeyArn: S.String,
  KeyCheckValue: S.String,
  AuthResponseValue: S.optional(S.String),
}) {}
export class VerifyCardValidationDataOutput extends S.Class<VerifyCardValidationDataOutput>(
  "VerifyCardValidationDataOutput",
)({ KeyArn: S.String, KeyCheckValue: S.String }) {}
export class VerifyPinDataOutput extends S.Class<VerifyPinDataOutput>(
  "VerifyPinDataOutput",
)({
  VerificationKeyArn: S.String,
  VerificationKeyCheckValue: S.String,
  EncryptionKeyArn: S.String,
  EncryptionKeyCheckValue: S.String,
}) {}
export const PinData = S.Union(
  S.Struct({ PinOffset: S.String }),
  S.Struct({ VerificationValue: S.String }),
);
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ path: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class DecryptDataOutput extends S.Class<DecryptDataOutput>(
  "DecryptDataOutput",
)({ KeyArn: S.String, KeyCheckValue: S.String, PlainText: S.String }) {}
export class GenerateMacOutput extends S.Class<GenerateMacOutput>(
  "GenerateMacOutput",
)({ KeyArn: S.String, KeyCheckValue: S.String, Mac: S.String }) {}
export class GeneratePinDataOutput extends S.Class<GeneratePinDataOutput>(
  "GeneratePinDataOutput",
)({
  GenerationKeyArn: S.String,
  GenerationKeyCheckValue: S.String,
  EncryptionKeyArn: S.String,
  EncryptionKeyCheckValue: S.String,
  EncryptedPinBlock: S.String,
  PinData: PinData,
}) {}
export class VisaAmexDerivationOutputs extends S.Class<VisaAmexDerivationOutputs>(
  "VisaAmexDerivationOutputs",
)({
  AuthorizationRequestKeyArn: S.String,
  AuthorizationRequestKeyCheckValue: S.String,
  CurrentPinPekArn: S.optional(S.String),
  CurrentPinPekKeyCheckValue: S.optional(S.String),
}) {}
export class WrappedWorkingKey extends S.Class<WrappedWorkingKey>(
  "WrappedWorkingKey",
)({
  WrappedKeyMaterial: S.String,
  KeyCheckValue: S.String,
  WrappedKeyMaterialFormat: S.String,
}) {}
export class GenerateMacEmvPinChangeOutput extends S.Class<GenerateMacEmvPinChangeOutput>(
  "GenerateMacEmvPinChangeOutput",
)({
  NewPinPekArn: S.String,
  SecureMessagingIntegrityKeyArn: S.String,
  SecureMessagingConfidentialityKeyArn: S.String,
  Mac: S.String,
  EncryptedPinBlock: S.String,
  NewPinPekKeyCheckValue: S.String,
  SecureMessagingIntegrityKeyCheckValue: S.String,
  SecureMessagingConfidentialityKeyCheckValue: S.String,
  VisaAmexDerivationOutputs: S.optional(VisaAmexDerivationOutputs),
}) {}
export class TranslateKeyMaterialOutput extends S.Class<TranslateKeyMaterialOutput>(
  "TranslateKeyMaterialOutput",
)({ WrappedKey: WrappedWorkingKey }) {}

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
export class VerificationFailedException extends S.TaggedError<VerificationFailedException>()(
  "VerificationFailedException",
  {},
) {}

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
export const encryptData = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const generateAs2805KekValidation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GenerateAs2805KekValidationInput,
    output: GenerateAs2805KekValidationOutput,
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
export const generateCardValidationData = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GenerateCardValidationDataInput,
    output: GenerateCardValidationDataOutput,
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
export const reEncryptData = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const translatePinData = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const verifyCardValidationData = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const verifyPinData = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const decryptData = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const generateMac = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const generatePinData = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const verifyAuthRequestCryptogram = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const verifyMac = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const generateMacEmvPinChange = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GenerateMacEmvPinChangeInput,
    output: GenerateMacEmvPinChangeOutput,
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
export const translateKeyMaterial = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: TranslateKeyMaterialInput,
    output: TranslateKeyMaterialOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
